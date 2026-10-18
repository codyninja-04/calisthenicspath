import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { apiUser, planFor } from '@/lib/auth'
import { analyzeForm, type FormFrame } from '@/lib/claude/form-analyzer'
import { loadTree } from '@/lib/data'
import { BUCKET } from '@/lib/formchecks'
import { extensionFor, MAX_FRAME_BYTES, MAX_FRAMES, sniffImage } from '@/lib/images'
import { DAILY_FORM_CHECK_CAP, limitsFor, startOfMonthIso } from '@/lib/plan'
import { isUuid } from '@/lib/validate'

export const runtime = 'nodejs'
export const maxDuration = 60

// POST multipart: skill (slug), level, note?, frames (1 to 3 images)
export async function POST(request: Request) {
  const { supabase, user, unauthorized } = await apiUser()
  if (unauthorized) return unauthorized

  const form = await request.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Send the photo as a form upload' }, { status: 400 })

  const tree = await loadTree(supabase, String(form.get('skill') ?? ''))
  if (!tree) return NextResponse.json({ error: 'Skill tree not found' }, { status: 404 })

  const level = Number(form.get('level'))
  const step = Number.isInteger(level) ? tree.progressions[level] : undefined
  if (!step) return NextResponse.json({ error: 'Pick which step the photo shows' }, { status: 400 })

  const note = typeof form.get('note') === 'string' ? String(form.get('note')).trim().slice(0, 500) : ''

  const files = form.getAll('frames').filter((f): f is File => typeof f === 'object' && f !== null && 'arrayBuffer' in f)
  if (files.length === 0) return NextResponse.json({ error: 'Add at least one photo' }, { status: 400 })
  if (files.length > MAX_FRAMES) return NextResponse.json({ error: `Up to ${MAX_FRAMES} photos per check` }, { status: 400 })

  const frames: (FormFrame & { bytes: Uint8Array })[] = []
  for (const file of files) {
    if (file.size > MAX_FRAME_BYTES) return NextResponse.json({ error: 'Each photo needs to be under 5 MB' }, { status: 413 })
    const bytes = new Uint8Array(await file.arrayBuffer())
    const mimeType = sniffImage(bytes)
    if (!mimeType) return NextResponse.json({ error: 'Photos need to be JPEG, PNG or WebP' }, { status: 415 })
    frames.push({ bytes, mimeType, base64: Buffer.from(bytes).toString('base64') })
  }

  // Plan limit, then the hard daily ceiling that applies to everyone.
  const limits = limitsFor(await planFor(supabase, user.id))
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const [{ count: monthCount }, { count: dayCount }] = await Promise.all([
    supabase.from('form_checks').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('checked_at', startOfMonthIso()),
    supabase.from('form_checks').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('checked_at', dayAgo),
  ])
  if ((monthCount ?? 0) >= limits.formChecksPerMonth) {
    return NextResponse.json({ error: "You've used this month's free form checks" }, { status: 402 })
  }
  if ((dayCount ?? 0) >= DAILY_FORM_CHECK_CAP) {
    return NextResponse.json({ error: "That's a lot of checks for one day. Rest up and try again tomorrow." }, { status: 429 })
  }

  const { data: progress } = await supabase
    .from('user_skill_progress')
    .select('current_level, current_value')
    .eq('user_id', user.id)
    .eq('skill_tree_id', tree.id)
    .maybeSingle()
  const loggedValue = progress && progress.current_level === level && progress.current_value !== null ? Number(progress.current_value) : null

  const checkId = randomUUID()
  const paths = frames.map((f, i) => `${user.id}/${checkId}/${i}.${extensionFor(f.mimeType)}`)
  const storage = supabase.storage.from(BUCKET)

  const uploads = await Promise.all(frames.map((f, i) => storage.upload(paths[i], f.bytes, { contentType: f.mimeType, upsert: false })))
  if (uploads.some((u) => u.error)) {
    await storage.remove(paths)
    return NextResponse.json({ error: 'Could not save your photo. Try again.' }, { status: 500 })
  }

  let analysis
  try {
    analysis = await analyzeForm({ frames, tree, step, loggedValue, note: note || null })
  } catch (e) {
    console.error('form check failed', e)
    await storage.remove(paths)
    return NextResponse.json({ error: "Couldn't review that one right now. Give it another go in a minute." }, { status: 502 })
  }

  const { data: check, error } = await supabase
    .from('form_checks')
    .insert({
      id: checkId,
      user_id: user.id,
      skill_tree_id: tree.id,
      skill_level: level,
      photo_url: paths[0],
      photo_paths: paths,
      ai_feedback: analysis.feedback,
      form_issues: analysis.form_issues.map((i) => i.issue),
      progression_ready: analysis.progression_ready,
      next_step_advice: analysis.next_step_advice,
      details: analysis,
    })
    .select()
    .single()

  if (error) {
    await storage.remove(paths)
    return NextResponse.json({ error: 'Could not save the form check' }, { status: 500 })
  }

  return NextResponse.json({ check, analysis })
}

// DELETE { id } removes the check and its photos.
export async function DELETE(request: Request) {
  const { supabase, user, unauthorized } = await apiUser()
  if (unauthorized) return unauthorized

  const body = (await request.json().catch(() => null)) as { id?: unknown } | null
  const id = typeof body?.id === 'string' ? body.id : ''
  if (!isUuid(id)) return NextResponse.json({ error: 'Unknown form check' }, { status: 400 })

  const { data: check } = await supabase.from('form_checks').select('id, photo_paths').eq('id', id).eq('user_id', user.id).maybeSingle()
  if (!check) return NextResponse.json({ error: 'Form check not found' }, { status: 404 })

  if (check.photo_paths?.length) await supabase.storage.from(BUCKET).remove(check.photo_paths)
  const { error } = await supabase.from('form_checks').delete().eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: 'Could not delete the form check' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
