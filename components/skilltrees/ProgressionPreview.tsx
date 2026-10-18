import { findDef } from '@/lib/skills/catalog'
import { stepStatus } from '@/lib/skills/progression'

// A static example of the pull-up tree used on the landing and sign in pages.
export function ProgressionPreview({ currentLevel = 2, logged = 6 }: { currentLevel?: number; logged?: number }) {
  const tree = findDef('pull-up')!
  const steps = tree.progressions.slice(0, 5)

  return (
    <div className="card p-5" aria-label="Example pull-up progression">
      <div className="flex items-center justify-between">
        <p className="label">{tree.name}</p>
        <span className="chip border-primary/40 text-primary-soft">
          Step {currentLevel + 1} of {tree.progressions.length}
        </span>
      </div>
      <ol className="relative mt-5 space-y-4">
        <span className="absolute bottom-3 left-[11px] top-3 w-px bg-line" aria-hidden />
        {steps.map((step) => {
          const status = stepStatus(step.level, currentLevel)
          return (
            <li key={step.level} className="relative flex items-center gap-3">
              <span
                className={`relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold ${
                  status === 'completed'
                    ? 'bg-completed text-bg'
                    : status === 'current'
                      ? 'animate-ring-pulse bg-primary text-primary-ink'
                      : 'border border-locked bg-bg text-faint'
                }`}
              >
                {status === 'completed' ? '✓' : step.level + 1}
              </span>
              <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
                <span className={`truncate text-sm ${status === 'locked' ? 'text-faint' : 'font-medium'}`}>{step.name}</span>
                <span className={`shrink-0 text-xs tabular-nums ${status === 'current' ? 'text-primary-soft' : 'text-faint'}`}>
                  {status === 'current' ? `${logged} / ${step.target_value} reps` : step.prerequisite_reps}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
      <div className="mt-5 rounded-xl border border-line bg-bg/50 p-3 text-sm text-muted">
        <span className="font-semibold text-text">Two more clean reps</span> and the strict pull-up opens up. Until then, the band
        stays.
      </div>
    </div>
  )
}
