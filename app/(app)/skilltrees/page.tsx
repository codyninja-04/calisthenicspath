import type { Metadata } from 'next'
import Link from 'next/link'
import { SkillTreeCard } from '@/components/skilltrees/SkillTreeCard'
import { firstName, requireUser } from '@/lib/auth'
import { loadProgress, loadTrees } from '@/lib/data'
import { limitsFor } from '@/lib/plan'
import { CATEGORY_LABEL, CATEGORY_ORDER } from '@/lib/skills/catalog'
import { currentStep, hitTarget, isMastered } from '@/lib/skills/progression'
import { mondayOf, todayIso } from '@/lib/weeks'

export const metadata: Metadata = { title: 'Skill trees' }

export default async function SkillTreesPage() {
  const { supabase, user, profile } = await requireUser()
  const today = todayIso()

  const [trees, progress, { count: weekSessions }] = await Promise.all([
    loadTrees(supabase),
    loadProgress(supabase, user.id),
    supabase
      .from('training_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('session_date', mondayOf(today)),
  ])

  const byTree = new Map(progress.map((p) => [p.skill_tree_id, p]))
  const active = trees.filter((t) => byTree.has(t.id))
  const limits = limitsFor(profile.plan)
  const readyToMove = active.filter((t) => {
    const p = byTree.get(t.id)!
    const step = currentStep(t, p.current_level)
    return step && hitTarget(step, p.current_value)
  })
  const mastered = active.filter((t) => isMastered(t, byTree.get(t.id)!.current_level)).length

  return (
    <div className="space-y-12 animate-rise-in">
      <section>
        <p className="label">Hey {firstName(profile, user.email)}</p>
        <h1 className="heading mt-2 text-5xl sm:text-6xl">Skill trees</h1>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">
          Every skill is a ladder. Know which rung you&apos;re on and what it takes to step up.
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-3 sm:max-w-lg">
          <Stat label="Training" value={active.length} />
          <Stat label="Owned" value={mastered} />
          <Stat label="This week" value={weekSessions ?? 0} suffix={weekSessions === 1 ? 'session' : 'sessions'} />
        </dl>

        {readyToMove.length > 0 && (
          <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-primary/40 bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              <span className="font-semibold text-primary-soft">You&apos;ve hit the target</span> on{' '}
              {readyToMove.map((t) => t.name).join(', ')}. Check your form, then step up.
            </p>
            <Link href={`/skill/${readyToMove[0].slug}`} className="btn-primary shrink-0">
              Review {readyToMove.length > 1 ? 'first' : 'it'}
            </Link>
          </div>
        )}
      </section>

      {active.length > 0 && (
        <section>
          <h2 className="label mb-4">Training now</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {active.map((t) => (
              <SkillTreeCard key={t.id} tree={t} progress={byTree.get(t.id)} />
            ))}
          </div>
        </section>
      )}

      {active.length === 0 && (
        <section className="card grid-lines p-6 sm:p-8">
          <p className="label">Start here</p>
          <p className="heading mt-2 text-3xl">Pick one or two skills you actually train.</p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
            Open a tree, choose the step you can do today, and log your best set. Most people start with the pull-up and push-up
            trees because nearly everything else builds on them.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/skill/pull-up" className="btn-primary">
              Start with pull-ups
            </Link>
            <Link href="/skill/push-up" className="btn-ghost">
              Or push-ups
            </Link>
          </div>
        </section>
      )}

      {limits.trees !== Infinity && active.length >= limits.trees && (
        <p className="rounded-xl border border-line bg-surface/60 p-4 text-sm text-muted">
          The free plan tracks {limits.trees} trees at a time. Stop tracking one from its page, or go Pro to track every tree.
        </p>
      )}

      {CATEGORY_ORDER.map((category) => {
        const inCategory = trees.filter((t) => t.category === category && !byTree.has(t.id))
        if (inCategory.length === 0) return null
        return (
          <section key={category}>
            <h2 className="label mb-4">{CATEGORY_LABEL[category]}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {inCategory.map((t) => (
                <SkillTreeCard key={t.id} tree={t} />
              ))}
            </div>
          </section>
        )
      })}

      {trees.length === 0 && (
        <p className="card p-6 text-sm text-muted">
          No skill trees found. Run the migrations in <code className="text-text">supabase/migrations</code> to seed them.
        </p>
      )}
    </div>
  )
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="card px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-display text-3xl font-bold tabular-nums">
        {value}
        {suffix && <span className="ml-1 font-sans text-xs font-normal text-faint">{suffix}</span>}
      </dd>
    </div>
  )
}
