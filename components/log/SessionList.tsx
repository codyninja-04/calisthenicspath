'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { postJson } from '@/lib/api'
import type { TrainingSession } from '@/lib/types'

const LOCATION_LABEL = { home: 'Home', outdoor_gym: 'Outdoor park', commercial_gym: 'Gym' } as const

function longDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
}

export function SessionList({ sessions, names }: { sessions: TrainingSession[]; names: Record<string, string> }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [removing, setRemoving] = useState<string | null>(null)

  if (sessions.length === 0) {
    return <p className="text-sm text-muted">No sessions yet. Log today&apos;s and the history builds from there.</p>
  }

  function remove(id: string) {
    setRemoving(id)
    start(async () => {
      try {
        await postJson('/api/sessions', { id }, 'DELETE')
        router.refresh()
      } finally {
        setRemoving(null)
      }
    })
  }

  return (
    <ul className="divide-y divide-line/70 overflow-hidden rounded-2xl border border-line/70 bg-surface">
      {sessions.map((s) => (
        <li key={s.id} className="group p-4 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold">{longDate(s.session_date)}</p>
              <p className="mt-0.5 text-xs text-muted">
                {[s.location && LOCATION_LABEL[s.location], s.duration_min && `${s.duration_min} min`, s.rpe && `effort ${s.rpe}/10`]
                  .filter(Boolean)
                  .join(' · ') || 'No details'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove(s.id)}
              disabled={pending}
              className="shrink-0 text-xs text-faint opacity-100 transition hover:text-danger sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
            >
              {removing === s.id ? 'Removing…' : 'Remove'}
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {s.skills_trained.map((slug) => (
              <span key={slug} className="chip py-0.5">
                {names[slug] ?? slug}
              </span>
            ))}
          </div>
          {s.notes && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">{s.notes}</p>}
        </li>
      ))}
    </ul>
  )
}
