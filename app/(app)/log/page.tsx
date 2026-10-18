import type { Metadata } from 'next'
import Link from 'next/link'
import { SessionForm } from '@/components/log/SessionForm'
import { SessionList } from '@/components/log/SessionList'
import { WeeklyChart } from '@/components/log/WeeklyChart'
import { requireUser } from '@/lib/auth'
import { loadProgress, loadTrees } from '@/lib/data'
import { limitsFor } from '@/lib/plan'
import type { TrainingSession } from '@/lib/types'
import { addDays, mondayOf, todayIso, weekStreak, weeklyCounts } from '@/lib/weeks'

export const metadata: Metadata = { title: 'Training log' }

export default async function LogPage() {
  const { supabase, user, profile } = await requireUser()
  const today = todayIso()
  const since = addDays(mondayOf(today), -7 * 51)

  const [trees, progress, { data }] = await Promise.all([
    loadTrees(supabase),
    loadProgress(supabase, user.id),
    supabase
      .from('training_sessions')
      .select('*')
      .eq('user_id', user.id)
      .gte('session_date', since)
      .order('session_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(400),
  ])

  const sessions = (data ?? []) as TrainingSession[]
  const dates = sessions.map((s) => s.session_date)
  const weeks = weeklyCounts(dates, today, 8)
  const thisWeek = weeks[weeks.length - 1].sessions
  const streak = weekStreak(dates, today)
  const recent = sessions.filter((s) => s.session_date >= weeks[0].week)
  const efforts = recent.map((s) => s.rpe).filter((r): r is number => r !== null)
  const avgEffort = efforts.length ? (efforts.reduce((a, b) => a + b, 0) / efforts.length).toFixed(1) : null

  const names = Object.fromEntries(trees.map((t) => [t.slug, t.name.replace(/ Progression$/, '')]))
  const tracked = progress.map((p) => trees.find((t) => t.id === p.skill_tree_id)?.slug).filter((s): s is string => Boolean(s))

  const frequency = new Map<string, number>()
  recent.forEach((s) => s.skills_trained.forEach((slug) => frequency.set(slug, (frequency.get(slug) ?? 0) + 1)))
  const topSkills = Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
  const topMax = topSkills[0]?.[1] ?? 1
  // A tracked tree you haven't touched in 8 weeks is worth pointing out.
  const neglected = tracked.filter((slug) => !frequency.has(slug))

  const analytics = limitsFor(profile.plan).analytics

  return (
    <div className="space-y-10 animate-rise-in">
      <div>
        <p className="label">Training log</p>
        <h1 className="heading mt-2 text-5xl sm:text-6xl">Show up, write it down</h1>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">
          Skills come from frequency. Log every session, even the short ones, so you can see the weeks you actually trained.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="This week" value={String(thisWeek)} hint={thisWeek === 1 ? 'session' : 'sessions'} />
        <Stat label="Week streak" value={String(streak)} hint={streak === 1 ? 'week' : 'weeks'} />
        <Stat label="Last 8 weeks" value={String(recent.length)} hint="sessions" />
        <Stat label="Avg effort" value={avgEffort ?? '-'} hint={avgEffort ? 'out of 10' : 'not logged'} />
      </dl>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <SessionForm trees={trees.map((t) => ({ slug: t.slug, name: t.name }))} tracked={tracked} />

        <div className="space-y-8">
          {analytics ? (
            <>
              <section className="card p-5">
                <WeeklyChart weeks={weeks} />
              </section>
              {topSkills.length > 0 && (
                <section className="card p-5">
                  <p className="label mb-4">Most trained, last 8 weeks</p>
                  <ul className="space-y-3">
                    {topSkills.map(([slug, n]) => (
                      <li key={slug}>
                        <div className="flex justify-between text-sm">
                          <span>{names[slug] ?? slug}</span>
                          <span className="tabular-nums text-muted">{n}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 rounded-full bg-line/60">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${(n / topMax) * 100}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                  {neglected.length > 0 && (
                    <p className="mt-4 border-t border-line pt-4 text-sm text-muted">
                      You track {neglected.map((s) => names[s] ?? s).join(', ')} but haven&apos;t logged {neglected.length === 1 ? 'it' : 'them'}{' '}
                      in 8 weeks. Train it or stop tracking it.
                    </p>
                  )}
                </section>
              )}
            </>
          ) : (
            <section className="card p-5">
              <p className="label">Analytics</p>
              <p className="mt-2 text-sm text-muted">Weekly charts and per skill frequency come with Pro.</p>
              <Link href="/settings" className="btn-ghost mt-4">
                See plans
              </Link>
            </section>
          )}
        </div>
      </div>

      <section>
        <h2 className="label mb-4">History</h2>
        <SessionList sessions={sessions.slice(0, 40)} names={names} />
      </section>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="card px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-display text-3xl font-bold tabular-nums">
        {value}
        <span className="ml-1 font-sans text-xs font-normal text-faint">{hint}</span>
      </dd>
    </div>
  )
}
