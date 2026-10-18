import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { createClient } from './supabase/server'
import type { Profile } from './types'

// Server components behind the app layout call this to get the signed in user
// and their account row in one go.
export async function requireUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  const meta = user.user_metadata as { full_name?: string; name?: string } | undefined
  const profile: Profile = {
    id: user.id,
    full_name: data?.full_name ?? meta?.full_name ?? meta?.name ?? null,
    plan: data?.plan === 'pro' ? 'pro' : 'free',
    created_at: data?.created_at ?? user.created_at,
  }

  return { supabase, user, profile }
}

// Route handler version: returns a 401 response instead of redirecting.
export async function apiUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, unauthorized: NextResponse.json({ error: 'Sign in first' }, { status: 401 }) }
  return { supabase, user, unauthorized: null }
}

export async function planFor(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data } = await supabase.from('profiles').select('plan').eq('id', userId).maybeSingle()
  return data?.plan === 'pro' ? 'pro' : 'free'
}

export function firstName(profile: Profile, email?: string | null): string {
  const name = profile.full_name?.trim()
  if (name) return name.split(/\s+/)[0]
  return email?.split('@')[0] ?? 'there'
}
