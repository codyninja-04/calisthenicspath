import type { createClient } from './supabase/server'
import type { FormCheck } from './types'

type Client = ReturnType<typeof createClient>

export const BUCKET = 'form-checks'

export type FormCheckWithUrls = FormCheck & { urls: string[] }

export async function loadChecks(supabase: Client, userId: string, treeId: string, limit = 10): Promise<FormCheckWithUrls[]> {
  const { data } = await supabase
    .from('form_checks')
    .select('*')
    .eq('user_id', userId)
    .eq('skill_tree_id', treeId)
    .order('checked_at', { ascending: false })
    .limit(limit)

  const checks = (data ?? []) as FormCheck[]
  const paths = checks.flatMap((c) => c.photo_paths ?? [])
  if (paths.length === 0) return checks.map((c) => ({ ...c, urls: [] }))

  // Photos sit in a private bucket. Signed links expire after an hour.
  const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 3600)
  const byPath = new Map((signed ?? []).filter((s) => s.signedUrl).map((s) => [s.path, s.signedUrl]))
  return checks.map((c) => ({
    ...c,
    urls: (c.photo_paths ?? []).map((p) => byPath.get(p)).filter((u): u is string => Boolean(u)),
  }))
}
