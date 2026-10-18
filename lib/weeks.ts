// Week maths for the training log. Session dates are plain YYYY-MM-DD strings,
// so everything here works in UTC to avoid time zone drift.

export function mondayOf(date: string): string {
  const d = new Date(`${date}T00:00:00Z`)
  const offset = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - offset)
  return d.toISOString().slice(0, 10)
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export interface WeekBucket {
  week: string
  label: string
  sessions: number
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function shortDate(date: string): string {
  const [, m, d] = date.slice(0, 10).split('-').map(Number)
  return `${d} ${MONTHS[m - 1]}`
}

// Oldest first, ending with the current week.
export function weeklyCounts(dates: string[], today: string, weeks = 8): WeekBucket[] {
  const current = mondayOf(today)
  const buckets: WeekBucket[] = []
  for (let i = weeks - 1; i >= 0; i--) {
    const week = addDays(current, -7 * i)
    buckets.push({ week, label: shortDate(week), sessions: 0 })
  }
  const index = new Map(buckets.map((b, i) => [b.week, i]))
  for (const date of dates) {
    const i = index.get(mondayOf(date))
    if (i !== undefined) buckets[i].sessions++
  }
  return buckets
}

// Consecutive weeks with at least one session. The current week only breaks the
// streak once it's over, so a Monday with no session yet doesn't reset it.
export function weekStreak(dates: string[], today: string): number {
  const weeks = new Set(dates.map(mondayOf))
  let week = mondayOf(today)
  if (!weeks.has(week)) week = addDays(week, -7)
  let streak = 0
  while (weeks.has(week)) {
    streak++
    week = addDays(week, -7)
  }
  return streak
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
