import type { StepStatus } from '@/lib/skills/progression'
import type { ProgressionStep as Step } from '@/lib/types'

const NODE: Record<StepStatus, string> = {
  completed: 'bg-completed text-bg',
  current: 'animate-ring-pulse bg-primary text-primary-ink',
  locked: 'border border-locked bg-bg text-faint',
}

const STATUS_TEXT: Record<StepStatus, string> = {
  completed: 'Cleared',
  current: 'You are here',
  locked: 'Locked',
}

function Cues({ step }: { step: Step }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="label text-[0.7rem]">Cues</p>
        <ul className="mt-2 space-y-1.5 text-sm text-muted">
          {step.cues.map((c) => (
            <li key={c} className="flex gap-2">
              <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-completed" aria-hidden />
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="label text-[0.7rem]">Watch for</p>
        <ul className="mt-2 space-y-1.5 text-sm text-muted">
          {step.common_faults.map((f) => (
            <li key={f} className="flex gap-2">
              <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function ProgressionStep({ step, status }: { step: Step; status: StepStatus }) {
  const node = (
    <span
      className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold ${NODE[status]}`}
      aria-hidden
    >
      {status === 'completed' ? (
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M3.5 8.5l3 3 6-7" />
        </svg>
      ) : status === 'locked' ? (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
        </svg>
      ) : (
        step.level + 1
      )}
    </span>
  )

  const header = (
    <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className={`font-display text-xl font-bold uppercase leading-tight ${status === 'locked' ? 'text-muted' : ''}`}>
          {step.name}
        </p>
        <p className={`text-xs font-semibold uppercase tracking-wider ${status === 'current' ? 'text-primary' : status === 'completed' ? 'text-completed' : 'text-faint'}`}>
          <span className="sr-only">Step {step.level + 1}: </span>
          {STATUS_TEXT[status]}
        </p>
      </div>
      <span className="shrink-0 text-sm tabular-nums text-muted">
        <span className="text-faint">Target </span>
        {step.prerequisite_reps}
      </span>
    </div>
  )

  if (status === 'current') {
    return (
      <li className="relative flex gap-4">
        {node}
        <div className="flex-1 rounded-2xl border border-primary/40 bg-primary/[0.06] p-4 sm:p-5">
          {header}
          <p className="mt-3 text-sm leading-relaxed">{step.description}</p>
          <div className="mt-4 border-t border-primary/20 pt-4">
            <Cues step={step} />
          </div>
        </div>
      </li>
    )
  }

  return (
    <li className="relative flex gap-4">
      {node}
      <details className="group flex-1 rounded-2xl border border-transparent px-1 py-0.5 open:border-line open:bg-surface/50 open:p-4">
        <summary className="flex cursor-pointer list-none items-start gap-2 [&::-webkit-details-marker]:hidden">
          {header}
          <svg viewBox="0 0 16 16" className="mt-1.5 h-4 w-4 shrink-0 text-faint transition group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M4 6l4 4 4-4" />
          </svg>
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
        <div className="mt-4">
          <Cues step={step} />
        </div>
      </details>
    </li>
  )
}
