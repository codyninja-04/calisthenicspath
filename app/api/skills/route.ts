import { NextResponse } from 'next/server'
import { apiUser } from '@/lib/auth'
import { loadProgress, loadTrees } from '@/lib/data'

// Every tree plus the signed in user's position on each one they track.
export async function GET() {
  const { supabase, user, unauthorized } = await apiUser()
  if (unauthorized) return unauthorized

  const [trees, progress] = await Promise.all([loadTrees(supabase), loadProgress(supabase, user.id)])
  const byTree = new Map(progress.map((p) => [p.skill_tree_id, p]))

  return NextResponse.json({
    trees: trees.map((t) => ({ ...t, progress: byTree.get(t.id) ?? null })),
  })
}
