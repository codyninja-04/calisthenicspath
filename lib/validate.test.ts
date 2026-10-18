import { describe, expect, it } from 'vitest'
import { sniffImage } from './images'
import { parseProgressAction, parseSession } from './validate'
import { mondayOf, weekStreak, weeklyCounts } from './weeks'

const today = '2026-10-18'

describe('parseSession', () => {
  const base = { session_date: '2026-10-17', skills_trained: ['pull-up', 'pull-up', 'planche'], location: 'outdoor_gym' }

  it('accepts a normal session and dedupes skills', () => {
    const r = parseSession({ ...base, duration_min: '60', rpe: 8, notes: '  felt good ' }, today)
    expect(r.ok && r.value).toEqual({
      session_date: '2026-10-17',
      skills_trained: ['pull-up', 'planche'],
      notes: 'felt good',
      location: 'outdoor_gym',
      duration_min: 60,
      rpe: 8,
    })
  })

  it('rejects bad dates, future dates and unknown skills', () => {
    expect(parseSession({ ...base, session_date: '2026-02-30' }, today).ok).toBe(false)
    expect(parseSession({ ...base, session_date: '2026-10-25' }, today).ok).toBe(false)
    expect(parseSession({ ...base, skills_trained: ['bench-press'] }, today).ok).toBe(false)
    expect(parseSession({ ...base, skills_trained: [] }, today).ok).toBe(false)
  })

  it('checks location and number ranges', () => {
    expect(parseSession({ ...base, location: 'beach' }, today).ok).toBe(false)
    expect(parseSession({ ...base, rpe: 11 }, today).ok).toBe(false)
    expect(parseSession({ ...base, duration_min: 2.5 }, today).ok).toBe(false)
  })
})

describe('parseProgressAction', () => {
  it('parses each action', () => {
    expect(parseProgressAction({ action: 'start' })).toEqual({ ok: true, value: { action: 'start', level: 0 } })
    expect(parseProgressAction({ action: 'log', value: '12' })).toEqual({ ok: true, value: { action: 'log', value: 12 } })
    expect(parseProgressAction({ action: 'advance' }).ok).toBe(true)
    expect(parseProgressAction({ action: 'delete' }).ok).toBe(false)
    expect(parseProgressAction({ action: 'start', level: 1.5 }).ok).toBe(false)
  })
})

describe('sniffImage', () => {
  it('recognises real image headers only', () => {
    expect(sniffImage(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe('image/jpeg')
    expect(sniffImage(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe('image/png')
    expect(sniffImage(new TextEncoder().encode('RIFF\0\0\0\0WEBPVP8 '))).toBe('image/webp')
    expect(sniffImage(new TextEncoder().encode('<svg xmlns='))).toBeNull()
  })
})

describe('weeks', () => {
  it('finds the Monday of a week', () => {
    expect(mondayOf('2026-10-18')).toBe('2026-10-12')
    expect(mondayOf('2026-10-12')).toBe('2026-10-12')
  })

  it('buckets sessions by week, oldest first', () => {
    const counts = weeklyCounts(['2026-10-13', '2026-10-15', '2026-10-06', '2025-01-01'], today, 3)
    expect(counts.map((c) => c.sessions)).toEqual([0, 1, 2])
    expect(counts[2].label).toBe('12 Oct')
  })

  it('counts a streak without punishing an empty current week', () => {
    expect(weekStreak(['2026-10-06', '2026-09-29'], today)).toBe(2)
    expect(weekStreak(['2026-10-13', '2026-10-06', '2026-09-22'], today)).toBe(2)
    expect(weekStreak([], today)).toBe(0)
  })
})
