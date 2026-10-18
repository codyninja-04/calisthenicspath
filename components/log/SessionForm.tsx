'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { postJson } from '@/lib/api'
import type { Location } from '@/lib/types'

const LOCATIONS: { value: Location; label: string }[] = [
  { value: 'outdoor_gym', label: 'Outdoor park' },
  { value: 'home', label: 'Home' },
  { value: 'commercial_gym', label: 'Gym' },
]

function localToday() {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export function SessionForm({ trees, tracked }: { trees: { slug: string; name: string }[]; tracked: string[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [date, setDate] = useState(localToday)
  const [skills, setSkills] = useState<string[]>([])
  const [location, setLocation] = useState<Location | ''>('')
  const [duration, setDuration] = useState('')
  const [rpe, setRpe] = useState(0)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // Trees you track come first, since that's what you'll pick most.
  const ordered = [...trees].sort((a, b) => Number(tracked.includes(b.slug)) - Number(tracked.includes(a.slug)))

  function toggle(slug: string) {
    setSkills((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    start(async () => {
      try {
        await postJson('/api/sessions', {
          session_date: date,
          skills_trained: skills,
          location: location || null,
          duration_min: duration || null,
          rpe: rpe || null,
          notes,
        })
        setSkills([])
        setNotes('')
        setDuration('')
        setRpe(0)
        setSaved(true)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save')
      }
    })
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-5 sm:p-6" aria-labelledby="log-heading">
      <h2 id="log-heading" className="heading text-3xl">
        Log a session
      </h2>

      <fieldset>
        <legend className="label text-[0.7rem]">What did you train?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {ordered.map((t) => {
            const on = skills.includes(t.slug)
            return (
              <button
                key={t.slug}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(t.slug)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  on ? 'border-primary bg-primary/15 text-text' : 'border-line text-muted hover:border-faint hover:text-text'
                }`}
              >
                {t.name.replace(/ Progression$/, '')}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="label text-[0.7rem]">Date</span>
          <input type="date" value={date} max={localToday()} onChange={(e) => setDate(e.target.value)} className="input mt-1.5" required />
        </label>
        <label className="block">
          <span className="label text-[0.7rem]">Where</span>
          <select value={location} onChange={(e) => setLocation(e.target.value as Location | '')} className="input mt-1.5">
            <option value="">Skip</option>
            {LOCATIONS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label text-[0.7rem]">Minutes</span>
          <input type="number" inputMode="numeric" min={1} max={600} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" className="input mt-1.5" />
        </label>
      </div>

      <fieldset>
        <legend className="label text-[0.7rem]">How hard was it? {rpe > 0 && <span className="text-text">{rpe}/10</span>}</legend>
        <div className="mt-2 grid grid-cols-10 gap-1">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`Effort ${n} out of 10`}
              aria-pressed={rpe === n}
              onClick={() => setRpe(rpe === n ? 0 : n)}
              className={`h-9 rounded-lg text-xs font-semibold tabular-nums transition ${
                n <= rpe ? (n >= 9 ? 'bg-danger/80 text-bg' : 'bg-primary text-primary-ink') : 'bg-raised text-faint hover:text-text'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="label text-[0.7rem]">Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 2000))}
          rows={3}
          placeholder="What went well, what felt off, anything to remember next time"
          className="input mt-1.5 resize-y"
        />
      </label>

      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={pending || skills.length === 0}>
          {pending ? 'Saving…' : 'Save session'}
        </button>
        {saved && <span className="text-sm text-completed">Logged.</span>}
        {error && (
          <span role="alert" className="text-sm text-danger">
            {error}
          </span>
        )}
      </div>
    </form>
  )
}
