'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { postJson } from '@/lib/api'
import type { PrereqStatus } from '@/lib/skills/progression'
import type { ProgressionStep } from '@/lib/types'

// Lets people place themselves on the tree instead of making everyone start at
// step one. Someone with 10 strict pull-ups shouldn't have to log dead hangs.
export function StartTree({
  slug,
  steps,
  prereqs,
  blockedByPlan,
}: {
  slug: string
  steps: ProgressionStep[]
  prereqs: PrereqStatus[]
  blockedByPlan: boolean
}) {
  const router = useRouter()
  const [level, setLevel] = useState(0)
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const missing = prereqs.filter((p) => !p.met)

  function begin() {
    setError(null)
    start(async () => {
      try {
        await postJson(`/api/skills/${slug}/progress`, { action: 'start', level })
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong')
      }
    })
  }

  return (
    <section className="card p-5 sm:p-6" aria-labelledby="start-heading">
      <p className="label">Start tracking</p>
      <h2 id="start-heading" className="heading mt-1 text-3xl">
        Where are you today?
      </h2>
      <p className="mt-2 text-sm text-muted">
        Pick the hardest step you can&apos;t yet do for the target. That&apos;s the one you&apos;ll work on.
      </p>

      {missing.length > 0 && (
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/[0.07] p-4 text-sm">
          <p className="font-semibold text-primary-soft">Worth having first</p>
          <ul className="mt-1.5 space-y-1 text-muted">
            {missing.map((p) => (
              <li key={p.slug}>
                <Link href={`/skill/${p.slug}`} className="text-text underline decoration-line underline-offset-4 hover:decoration-primary">
                  {p.stepName}
                </Link>{' '}
                cleared in {p.treeName}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-faint">Not a hard rule. If you already have it from other training, go ahead.</p>
        </div>
      )}

      <fieldset className="mt-5">
        <legend className="sr-only">Starting step</legend>
        <div className="grid gap-2">
          {steps.map((s) => (
            <label
              key={s.level}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                level === s.level ? 'border-primary bg-primary/10' : 'border-line hover:border-faint'
              }`}
            >
              <input
                type="radio"
                name="level"
                value={s.level}
                checked={level === s.level}
                onChange={() => setLevel(s.level)}
                className="h-4 w-4 accent-[#F97316]"
              />
              <span className="flex-1 text-sm font-medium">
                <span className="text-faint">{s.level + 1}. </span>
                {s.name}
              </span>
              <span className="text-xs text-muted">{s.prerequisite_reps}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {blockedByPlan ? (
        <p className="mt-5 text-sm text-muted">
          You&apos;re already tracking two trees on the free plan. Stop tracking one, or go Pro in{' '}
          <Link href="/settings" className="text-text underline underline-offset-4">
            settings
          </Link>
          .
        </p>
      ) : (
        <button type="button" onClick={begin} disabled={pending} className="btn-primary mt-5 w-full sm:w-auto">
          {pending ? 'Starting…' : `Start at ${steps[level]?.name}`}
        </button>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
    </section>
  )
}
