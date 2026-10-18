import type { FormAnalysis } from '@/lib/types'

export function ReadyBadge({ ready, usable = true }: { ready: boolean | null; usable?: boolean }) {
  if (!usable) return <span className="chip border-locked text-muted">Couldn&apos;t judge</span>
  return ready ? (
    <span className="chip border-completed/50 bg-completed/10 text-completed">Ready to progress</span>
  ) : (
    <span className="chip border-primary/40 bg-primary/10 text-primary-soft">Keep building</span>
  )
}

// The structured review from Claude. Issues lead because that's what people act on.
export function FormFeedback({ analysis }: { analysis: FormAnalysis }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <ReadyBadge ready={analysis.progression_ready} usable={analysis.image_usable} />
        {analysis.image_usable && analysis.form_issues.length === 0 && (
          <span className="chip border-completed/40 text-completed">No issues spotted</span>
        )}
      </div>

      <p className="leading-relaxed">{analysis.feedback}</p>

      {analysis.safety_note && (
        <div className="flex gap-3 rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm" role="note">
          <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-danger" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M10 3l8 14H2L10 3z" />
            <path d="M10 8v4M10 14.5v.5" strokeLinecap="round" />
          </svg>
          <p>
            <span className="font-semibold text-danger">Look after yourself. </span>
            {analysis.safety_note}
          </p>
        </div>
      )}

      {analysis.form_issues.length > 0 && (
        <div>
          <p className="label">Fix these</p>
          <ol className="mt-3 space-y-3">
            {analysis.form_issues.map((f, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-line bg-bg/40 p-4">
                <span className="font-display text-lg font-bold leading-none text-primary">{i + 1}</span>
                <div className="text-sm">
                  <p className="font-semibold">{f.issue}</p>
                  {f.fix && <p className="mt-1 text-muted">{f.fix}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {analysis.what_looks_good.length > 0 && (
        <div>
          <p className="label">Already solid</p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted">
            {analysis.what_looks_good.map((g) => (
              <li key={g} className="flex gap-2">
                <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-completed" aria-hidden />
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.next_step_advice && (
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="label">Next session</p>
          <p className="mt-1.5 text-sm leading-relaxed">{analysis.next_step_advice}</p>
        </div>
      )}
    </div>
  )
}
