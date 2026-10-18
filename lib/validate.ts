import { CATALOG } from './skills/catalog'
import type { ProgressAction } from './skills/progression'
import type { Location } from './types'

const LOCATIONS: Location[] = ['home', 'outdoor_gym', 'commercial_gym']
const SLUGS = new Set(CATALOG.map((t) => t.slug))

export type Result<T> = { ok: true; value: T } | { ok: false; error: string }

export function parseProgressAction(body: unknown): Result<ProgressAction> {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Missing body' }
  const b = body as Record<string, unknown>
  switch (b.action) {
    case 'start': {
      const level = b.level === undefined ? 0 : Number(b.level)
      if (!Number.isInteger(level)) return { ok: false, error: 'Level must be a whole number' }
      return { ok: true, value: { action: 'start', level } }
    }
    case 'log': {
      const value = Number(b.value)
      if (!Number.isFinite(value)) return { ok: false, error: 'Enter a number of reps or seconds' }
      return { ok: true, value: { action: 'log', value } }
    }
    case 'advance':
    case 'regress':
      return { ok: true, value: { action: b.action } }
    default:
      return { ok: false, error: 'Unknown action' }
  }
}

export interface SessionInput {
  session_date: string
  skills_trained: string[]
  notes: string | null
  location: Location | null
  duration_min: number | null
  rpe: number | null
}

function isRealDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const d = new Date(`${s}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

function optionalInt(value: unknown, min: number, max: number, label: string): Result<number | null> {
  if (value === undefined || value === null || value === '') return { ok: true, value: null }
  const n = Number(value)
  if (!Number.isInteger(n) || n < min || n > max) return { ok: false, error: `${label} should be between ${min} and ${max}` }
  return { ok: true, value: n }
}

export function parseSession(body: unknown, today: string): Result<SessionInput> {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Missing body' }
  const b = body as Record<string, unknown>

  const date = typeof b.session_date === 'string' ? b.session_date : ''
  if (!isRealDate(date)) return { ok: false, error: 'Pick a valid date' }
  // Allow a day of slack for time zones.
  const tomorrow = new Date(`${today}T00:00:00Z`)
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  if (date > tomorrow.toISOString().slice(0, 10)) return { ok: false, error: "You can't log a session in the future" }

  const skills = Array.isArray(b.skills_trained) ? b.skills_trained.filter((s): s is string => typeof s === 'string') : []
  const unique = Array.from(new Set(skills))
  if (unique.some((s) => !SLUGS.has(s))) return { ok: false, error: 'Unknown skill tree' }
  if (unique.length === 0) return { ok: false, error: 'Pick at least one skill you trained' }

  const notes = typeof b.notes === 'string' ? b.notes.trim().slice(0, 2000) : ''

  const location = b.location === undefined || b.location === null || b.location === '' ? null : b.location
  if (location !== null && !LOCATIONS.includes(location as Location)) return { ok: false, error: 'Unknown location' }

  const duration = optionalInt(b.duration_min, 1, 600, 'Duration')
  if (!duration.ok) return duration
  const rpe = optionalInt(b.rpe, 1, 10, 'Effort')
  if (!rpe.ok) return rpe

  return {
    ok: true,
    value: {
      session_date: date,
      skills_trained: unique,
      notes: notes || null,
      location: location as Location | null,
      duration_min: duration.value,
      rpe: rpe.value,
    },
  }
}

export function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
}
