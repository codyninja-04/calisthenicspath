import { NextResponse } from 'next/server'
import { apiUser, planFor } from '@/lib/auth'
import { loadTree } from '@/lib/data'
import { limitsFor } from '@/lib/plan'
import { applyProgressAction } from '@/lib/skills/progression'
import type { SkillProgress } from '@/lib/types'
import { parseProgressAction } from '@/lib/validate'
import { todayIso } from '@/lib/weeks'

// POST { action: 'start' | 'log' | 'advance' | 'regress', ... }
// The rules live in applyProgressAction. This route loads, saves and records the event.
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { supabase, user, unauthorized } = await apiUser()
  if (unauthorized) return unauthorized

  const parsed = parseProgressAction(await request.json().catch(() => null))
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const tree = await loadTree(supabase, params.id)
  if (!tree) return NextResponse.json({ error: 'Skill tree not found' }, { status: 404 })

  const { data: existing } = await supabase
    .from('user_skill_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('skill_tree_id', tree.id)
    .maybeSingle()
  const current = existing as SkillProgress | null

  if (parsed.value.action === 'start') {
    if (current) return NextResponse.json({ error: 'You are already tracking this tree' }, { status: 409 })
    const limits = limitsFor(await planFor(supabase, user.id))
    const { count } = await supabase.from('user_skill_progress').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
    if ((count ?? 0) >= limits.trees) {
      return NextResponse.json({ error: `The free plan tracks ${limits.trees} trees at a time` }, { status: 402 })
    }
  }

  const result = applyProgressAction(
    tree,
    current ? { ...current, current_value: current.current_value === null ? null : Number(current.current_value) } : null,
    parsed.value
  )
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

  const row = { ...result.state, last_progress_update: todayIso() }
  const write = current
    ? supabase.from('user_skill_progress').update(row).eq('id', current.id).select().single()
    : supabase.from('user_skill_progress').insert({ ...row, user_id: user.id, skill_tree_id: tree.id }).select().single()
  const { data, error } = await write
  if (error) return NextResponse.json({ error: 'Could not save your progress' }, { status: 500 })

  await supabase.from('progress_events').insert({ ...result.event, user_id: user.id, skill_tree_id: tree.id })

  return NextResponse.json({ progress: data })
}

// Stop tracking: clears the position and its timeline. Form checks are kept.
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { supabase, user, unauthorized } = await apiUser()
  if (unauthorized) return unauthorized

  const tree = await loadTree(supabase, params.id)
  if (!tree) return NextResponse.json({ error: 'Skill tree not found' }, { status: 404 })

  const [progress, events] = await Promise.all([
    supabase.from('user_skill_progress').delete().eq('user_id', user.id).eq('skill_tree_id', tree.id),
    supabase.from('progress_events').delete().eq('user_id', user.id).eq('skill_tree_id', tree.id),
  ])
  if (progress.error || events.error) return NextResponse.json({ error: 'Could not stop tracking' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
