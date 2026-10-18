import Link from 'next/link'
import { CATEGORY_LABEL } from '@/lib/skills/catalog'
import { currentStep, isMastered, readiness } from '@/lib/skills/progression'
import type { SkillProgress, SkillTree } from '@/lib/types'
import { CategoryIcon } from './CategoryIcon'
import { StepTrack } from './StepTrack'

export function SkillTreeCard({ tree, progress }: { tree: SkillTree; progress?: SkillProgress }) {
  const level = progress ? progress.current_level : null
  const step = progress ? currentStep(tree, progress.current_level) : null
  const mastered = progress ? isMastered(tree, progress.current_level) : false
  const ready = step && progress ? readiness(step, progress.current_value) : 0

  return (
    <Link
      href={`/skill/${tree.slug}`}
      className="card group flex flex-col gap-4 p-5 transition hover:-translate-y-0.5 hover:border-faint"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label flex items-center gap-1.5">
            <CategoryIcon category={tree.category} className="h-3.5 w-3.5" />
            {CATEGORY_LABEL[tree.category]}
          </p>
          <h3 className="heading mt-1.5 text-2xl group-hover:text-primary-soft">{tree.name}</h3>
        </div>
        <span className="chip shrink-0">{tree.progressions.length} steps</span>
      </div>

      {progress ? (
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2 text-sm">
            {mastered ? (
              <span className="font-semibold text-completed">Skill owned</span>
            ) : (
              <span className="truncate">
                <span className="text-muted">Now: </span>
                <span className="font-semibold">{step?.name}</span>
              </span>
            )}
            {!mastered && step && (
              <span className="shrink-0 tabular-nums text-muted">
                {progress.current_reps_or_hold ?? 'Nothing logged'}{' '}
                <span className="text-faint">/ {step.prerequisite_reps}</span>
              </span>
            )}
          </div>
          <StepTrack total={tree.progressions.length} currentLevel={level} />
          {!mastered && (
            <div className="h-1 overflow-hidden rounded-full bg-line/60" aria-hidden>
              <div className="h-full rounded-full bg-primary/70" style={{ width: `${Math.round(ready * 100)}%` }} />
            </div>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm leading-relaxed text-muted">{tree.summary}</p>
          <StepTrack total={tree.progressions.length} currentLevel={null} />
        </>
      )}
    </Link>
  )
}
