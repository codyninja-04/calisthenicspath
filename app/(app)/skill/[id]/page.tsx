import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FormCheckHistory } from '@/components/skill/FormCheckHistory'
import { ProgressPanel } from '@/components/skill/ProgressPanel'
import { StartTree } from '@/components/skill/StartTree'
import { StopTracking } from '@/components/skill/StopTracking'
import { TimelineChart } from '@/components/skill/TimelineChart'
import { CategoryIcon } from '@/components/skilltrees/CategoryIcon'
import { ProgressionMap } from '@/components/skilltrees/ProgressionMap'
import { requireUser } from '@/lib/auth'
import { loadEvents, loadProgress, loadTree, loadTrees } from '@/lib/data'
import { loadChecks } from '@/lib/formchecks'
import { limitsFor } from '@/lib/plan'
import { CATEGORY_LABEL } from '@/lib/skills/catalog'
import { currentStep, isMastered, prerequisiteStatus } from '@/lib/skills/progression'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { supabase } = await requireUser()
  const tree = await loadTree(supabase, params.id)
  return { title: tree?.name ?? 'Skill' }
}

export default async function SkillPage({ params }: { params: { id: string } }) {
  const { supabase, user, profile } = await requireUser()
  const tree = await loadTree(supabase, params.id)
  if (!tree) notFound()

  const [trees, progressRows, events, checks] = await Promise.all([
    loadTrees(supabase),
    loadProgress(supabase, user.id),
    loadEvents(supabase, user.id, tree.id),
    loadChecks(supabase, user.id, tree.id),
  ])

  const progress = progressRows.find((p) => p.skill_tree_id === tree.id) ?? null
  const levelBySlug = Object.fromEntries(
    progressRows.map((p) => [trees.find((t) => t.id === p.skill_tree_id)?.slug, p.current_level])
  ) as Record<string, number>
  const prereqs = prerequisiteStatus(tree, trees, levelBySlug)
  const limits = limitsFor(profile.plan)
  const step = progress ? currentStep(tree, progress.current_level) : null
  const mastered = progress ? isMastered(tree, progress.current_level) : false
  const lastCheckHere = progress ? checks.find((c) => c.skill_level === progress.current_level) : undefined
  const total = tree.progressions.length

  return (
    <div className="space-y-10 animate-rise-in">
      <div>
        <Link href="/skilltrees" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
          <span aria-hidden>←</span> All trees
        </Link>
        <p className="label mt-5 flex items-center gap-1.5">
          <CategoryIcon category={tree.category} className="h-4 w-4" />
          {CATEGORY_LABEL[tree.category]}
        </p>
        <h1 className="heading mt-2 text-5xl sm:text-6xl">{tree.name}</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">{tree.summary}</p>
        {progress && (
          <p className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="chip">
              {mastered ? 'All steps cleared' : `Step ${progress.current_level + 1} of ${total}`}
            </span>
            <span className="chip">Since {new Date(progress.started_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
          </p>
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-10">
          {!progress && (
            <StartTree slug={tree.slug} steps={tree.progressions} prereqs={prereqs} blockedByPlan={progressRows.length >= limits.trees} />
          )}

          {progress && step && (
            <ProgressPanel
              slug={tree.slug}
              step={step}
              nextStep={tree.progressions[progress.current_level + 1] ?? null}
              currentValue={progress.current_value}
              currentLabel={progress.current_reps_or_hold}
              lastFormReady={lastCheckHere ? lastCheckHere.progression_ready : null}
            />
          )}

          {mastered && (
            <section className="card grid-lines p-6">
              <p className="label text-completed">Skill owned</p>
              <p className="heading mt-2 text-3xl">You cleared every step.</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Keep it in your training once or twice a week so it stays. A skill you stop practising fades faster than the strength
                behind it.
              </p>
              <Link href={`/skill/${tree.slug}/check-form`} className="btn-ghost mt-4">
                Check form on the full skill
              </Link>
            </section>
          )}

          {progress && events.length >= 2 && (
            <section className="card p-5 sm:p-6" aria-label="Progress timeline">
              <TimelineChart events={events} steps={tree.progressions} currentLevel={progress.current_level} />
            </section>
          )}

          {progress && (
            <section>
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="label">Form checks</h2>
                {!mastered && (
                  <Link href={`/skill/${tree.slug}/check-form`} className="text-sm font-semibold text-primary hover:text-primary-soft">
                    New check →
                  </Link>
                )}
              </div>
              <FormCheckHistory checks={checks} steps={tree.progressions} />
            </section>
          )}
        </div>

        <section aria-labelledby="map-heading">
          <h2 id="map-heading" className="label mb-5">
            The path
          </h2>
          <ProgressionMap tree={tree} currentLevel={progress ? progress.current_level : null} />
          {progress && (
            <div className="mt-10">
              <StopTracking slug={tree.slug} name={tree.name} />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
