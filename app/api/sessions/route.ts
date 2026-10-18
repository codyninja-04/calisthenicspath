import { NextResponse } from 'next/server'
import { apiUser } from '@/lib/auth'
import { isUuid, parseSession } from '@/lib/validate'
import { todayIso } from '@/lib/weeks'

export async function GET(request: Request) {
  const { supabase, user, unauthorized } = await apiUser()
  if (unauthorized) return unauthorized

  const limit = Math.min(200, Math.max(1, Number(new URL(request.url).searchParams.get('limit')) || 50))
  const { data, error } = await supabase
    .from('training_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('session_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return NextResponse.json({ error: 'Could not load sessions' }, { status: 500 })

  return NextResponse.json({ sessions: data })
}

export async function POST(request: Request) {
  const { supabase, user, unauthorized } = await apiUser()
  if (unauthorized) return unauthorized

  const parsed = parseSession(await request.json().catch(() => null), todayIso())
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const { data, error } = await supabase
    .from('training_sessions')
    .insert({ ...parsed.value, user_id: user.id })
    .select()
    .single()
  if (error) return NextResponse.json({ error: 'Could not save the session' }, { status: 500 })

  return NextResponse.json({ session: data })
}

export async function DELETE(request: Request) {
  const { supabase, user, unauthorized } = await apiUser()
  if (unauthorized) return unauthorized

  const body = (await request.json().catch(() => null)) as { id?: unknown } | null
  const id = typeof body?.id === 'string' ? body.id : ''
  if (!isUuid(id)) return NextResponse.json({ error: 'Unknown session' }, { status: 400 })

  const { error } = await supabase.from('training_sessions').delete().eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: 'Could not delete the session' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
