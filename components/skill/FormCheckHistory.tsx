/* eslint-disable @next/next/no-img-element */
import type { FormCheckWithUrls } from '@/lib/formchecks'
import type { ProgressionStep } from '@/lib/types'
import { DeleteCheck } from './DeleteCheck'
import { FormFeedback, ReadyBadge } from './FormFeedback'

function when(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function FormCheckHistory({ checks, steps }: { checks: FormCheckWithUrls[]; steps: ProgressionStep[] }) {
  if (checks.length === 0) {
    return <p className="text-sm text-muted">No form checks yet. Snap a photo at the hardest point of a rep or hold and get honest feedback.</p>
  }

  return (
    <ul className="space-y-3">
      {checks.map((c, i) => (
        <li key={c.id}>
          <details className="card group overflow-hidden" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center gap-4 p-4 [&::-webkit-details-marker]:hidden">
              {c.urls[0] ? (
                <img src={c.urls[0]} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
              ) : (
                <span className="h-14 w-14 shrink-0 rounded-lg bg-raised" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{steps[c.skill_level]?.name ?? 'Form check'}</p>
                <p className="text-xs text-muted">{when(c.checked_at)}</p>
              </div>
              <ReadyBadge ready={c.progression_ready} usable={c.details?.image_usable ?? true} />
            </summary>
            <div className="border-t border-line/70 p-4 sm:p-5">
              {c.urls.length > 1 && (
                <div className="mb-5 grid grid-cols-3 gap-2">
                  {c.urls.map((u, j) => (
                    <img key={u} src={u} alt={`Frame ${j + 1}`} className="aspect-square w-full rounded-lg object-cover" />
                  ))}
                </div>
              )}
              {c.urls.length === 1 && <img src={c.urls[0]} alt="Your attempt" className="mb-5 max-h-80 rounded-xl object-contain" />}
              {c.details ? (
                <FormFeedback analysis={c.details} />
              ) : (
                <p className="text-sm leading-relaxed">{c.ai_feedback}</p>
              )}
              <div className="mt-5 flex justify-end">
                <DeleteCheck id={c.id} />
              </div>
            </div>
          </details>
        </li>
      ))}
    </ul>
  )
}
