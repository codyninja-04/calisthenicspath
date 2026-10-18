import type { createClient } from './supabase/server'
import type { ProgressEvent, SkillProgress, SkillTree } from './types'

type Client = ReturnType<typeof createClient>

export async function loadTrees(supabase: Client): Promise<SkillTree[]> {
  const { data, error } = await supabase.from('skill_trees').select('*').order('sort_order')
  if (error) throw new Error(`Could not load skill trees: ${error.message}`)
  return (data ?? []) as SkillTree[]
}

// Accepts either the slug (what URLs use) or the uuid.
export async function loadTree(supabase: Client, idOrSlug: string): Promise<SkillTree | null> {
  const column = /^[0-9a-f-]{36}$/i.test(idOrSlug) ? 'id' : 'slug'
  const { data } = await supabase.from('skill_trees').select('*').eq(column, idOrSlug).maybeSingle()
  return (data as SkillTree | null) ?? null
}

export async function loadProgress(supabase: Client, userId: string): Promise<SkillProgress[]> {
  const { data } = await supabase.from('user_skill_progress').select('*').eq('user_id', userId)
  return ((data ?? []) as SkillProgress[]).map((p) => ({ ...p, current_value: p.current_value === null ? null : Number(p.current_value) }))
}

export async function loadEvents(supabase: Client, userId: string, treeId: string): Promise<ProgressEvent[]> {
  const { data } = await supabase
    .from('progress_events')
    .select('id, skill_tree_id, kind, level, value, created_at')
    .eq('user_id', userId)
    .eq('skill_tree_id', treeId)
    .order('created_at')
    .limit(500)
  return ((data ?? []) as ProgressEvent[]).map((e) => ({ ...e, value: e.value === null ? null : Number(e.value) }))
}
