'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { postJson } from '@/lib/api'
import { hitTarget, readiness, unitFor } from '@/lib/skills/progression'
import type { ProgressionStep } from '@/lib/types'

export function ProgressPanel({
  slug,
  step,
  nextStep,
  currentValue,
  currentLabel,
  lastFormReady,
}: {
  slug: string
  step: ProgressionStep
  nextStep: ProgressionStep | null
  currentValue: number | null
  currentLabel: string | null
  lastFormReady: boolean | null
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<'advance' | 'regress' | null>(null)

  const ready = readiness(step, currentValue)
  const hit = hitTarget(step, currentValue)
  const unit = unitFor(step)

  function send(body: Record<string, unknown>, after?: () => void) {
    setError(null)
    start(async () => {
      try {
        await postJson(`/api/skills/${slug}/progress`, body)
        after?.()
        setConfirming(null)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong')
      }
    })
  }

  function log(e: React.FormEvent) {
    e.preventDefault()
    const n = Number(value)
    if (!value || !Number.isFinite(n) || n <= 0) {
      setError(`Enter how many ${unit} you got`)
      return
    }
    send({ action: 'log', value: n }, () => setValue(''))
  }

  return (
    <section className="card overflow-hidden" aria-labelledby="current-step">
      <div className="flex items-center gap-5 p-5 sm:p-6">
        <ProgressRing value={ready} size={84} stroke={7} tone={hit ? 'completed' : 'primary'}>
          <span className="font-display text-2xl font-bold tabular-nums">{Math.round(ready * 100)}%</span>
        </ProgressRing>
        <div className="min-w-0">
          <p className="label">Working on</p>
          <h2 id="current-step" className="heading mt-1 text-3xl">
            {step.name}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Best logged: <span className="font-semibold text-text">{currentLabel ?? 'nothing yet'}</span>
            <span className="text-faint"> · target {step.prerequisite_reps}</span>
          </p>
        </div>
      </div>

      <form onSubmit={log} className="border-t border-line/70 bg-bg/30 p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="label text-[0.7rem]">
              Today&apos;s best set{step.per_side ? ', weaker side' : ''}
            </span>
            <div className="relative mt-1.5">
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step={step.target_type === 'hold' ? '0.5' : '1'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={step.target_type === 'hold' ? 'Seconds held' : 'Clean reps'}
                className="input pr-14 text-base"
                aria-describedby="log-hint"
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-faint">{unit}</span>
            </div>
          </label>
          <button type="submit" className="btn-ghost sm:w-36" disabled={pending}>
            {pending && !confirming ? 'Saving…' : 'Log it'}
          </button>
        </div>
        <p id="log-hint" className="mt-2 text-xs text-faint">
          Only count reps or seconds with good form. A sloppy rep doesn&apos;t move you forward.
        </p>
      </form>

      <div className="space-y-3 border-t border-line/70 p-5 sm:p-6">
        {hit ? (
          <p className="text-sm">
            <span className="font-semibold text-completed">Target hit.</span>{' '}
            {lastFormReady === true
              ? 'Your last form check looked ready too. Time to step up.'
              : 'Worth a quick form check before you move on, so the next step is built on clean reps.'}
          </p>
        ) : (
          <p className="text-sm text-muted">
            {currentValue === null
              ? `Log a set to see how far you are from ${step.prerequisite_reps}.`
              : `${Math.max(0, Math.ceil((step.target_value - currentValue) * 10) / 10)} ${unit} to go.`}
          </p>
        )}

        {confirming ? (
          <div className="rounded-xl border border-line bg-bg/40 p-4">
            <p className="text-sm">
              {confirming === 'advance'
                ? hit
                  ? `Move on to ${nextStep?.name ?? 'owning the skill'}?`
                  : `You haven't logged ${step.prerequisite_reps} yet. Move on to ${nextStep?.name ?? 'owning the skill'} anyway?`
                : 'Step back to the previous progression? Good call if this one is breaking your form or hurting.'}
            </p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="btn-quiet" onClick={() => setConfirming(null)} disabled={pending}>
                Cancel
              </button>
              <button
                type="button"
                className={confirming === 'advance' ? 'btn-primary' : 'btn-ghost'}
                disabled={pending}
                onClick={() => send({ action: confirming })}
              >
                {pending ? 'Saving…' : confirming === 'advance' ? 'Yes, step up' : 'Yes, step back'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button type="button" className={hit ? 'btn-primary' : 'btn-ghost'} onClick={() => setConfirming('advance')}>
              {nextStep ? 'Mark progression achieved' : 'Mark skill owned'}
            </button>
            <Link href={`/skill/${slug}/check-form`} className={hit ? 'btn-ghost' : 'btn-primary'}>
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                <path d="M3 7a2 2 0 0 1 2-2h1.5l1-1.5h5l1 1.5H15a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                <circle cx="10" cy="10.5" r="3" />
              </svg>
              Check form
            </Link>
            {step.level > 0 && (
              <button type="button" className="btn-quiet" onClick={() => setConfirming('regress')}>
                Step back
              </button>
            )}
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
