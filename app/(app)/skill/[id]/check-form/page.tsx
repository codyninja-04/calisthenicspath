import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FormCheckUpload } from '@/components/skill/FormCheckUpload'
import { requireUser } from '@/lib/auth'
import { loadTree } from '@/lib/data'
import { limitsFor, startOfMonthIso } from '@/lib/plan'

export const metadata: Metadata = { title: 'Form check' }

export default async function CheckFormPage({ params }: { params: { id: string } }) {
  const { supabase, user, profile } = await requireUser()
  const tree = await loadTree(supabase, params.id)
  if (!tree) notFound()

  const [{ data: progress }, { count }] = await Promise.all([
    supabase.from('user_skill_progress').select('current_level').eq('user_id', user.id).eq('skill_tree_id', tree.id).maybeSingle(),
    supabase.from('form_checks').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('checked_at', startOfMonthIso()),
  ])

  const last = tree.progressions.length - 1
  const defaultLevel = Math.min(progress?.current_level ?? 0, last)
  const limits = limitsFor(profile.plan)
  const left = limits.formChecksPerMonth === Infinity ? null : Math.max(0, limits.formChecksPerMonth - (count ?? 0))

  return (
    <div className="space-y-8 animate-rise-in">
      <div>
        <Link href={`/skill/${tree.slug}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
          <span aria-hidden>←</span> {tree.name}
        </Link>
        <h1 className="heading mt-5 text-5xl">Form check</h1>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">
          Upload a photo, or grab frames from a video of your set. You&apos;ll get the issues that matter most, one fix for each, and
          an honest call on whether you&apos;re ready to step up.
        </p>
        {left !== null && (
          <p className="mt-3 text-sm text-faint">
            {left} of {limits.formChecksPerMonth} free checks left this month.
          </p>
        )}
      </div>

      {left === 0 ? (
        <div className="card p-6">
          <p className="font-semibold">You&apos;ve used this month&apos;s free form checks.</p>
          <p className="mt-1 text-sm text-muted">They reset on the 1st. Pro has no monthly limit.</p>
          <Link href="/settings" className="btn-primary mt-4">
            See plans
          </Link>
        </div>
      ) : (
        <FormCheckUpload slug={tree.slug} treeName={tree.name} steps={tree.progressions} defaultLevel={defaultLevel} />
      )}
    </div>
  )
}
