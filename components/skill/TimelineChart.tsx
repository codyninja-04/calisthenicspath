'use client'

import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ProgressEvent, ProgressionStep } from '@/lib/types'

const PRIMARY = '#F97316'
const GRID = '#334155'
const TICK = { fill: '#94A3B8', fontSize: 12 }

const KIND_LABEL: Record<ProgressEvent['kind'], string> = {
  start: 'Started',
  attempt: 'Logged',
  advance: 'Stepped up',
  regress: 'Stepped back',
}

function day(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

interface Point {
  t: number
  step: number
  kind: ProgressEvent['kind']
  value: number | null
}

function TooltipCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-xl border border-line bg-bg/95 px-3 py-2 text-xs shadow-card">
      <p className="font-semibold text-text">{title}</p>
      {lines.map((l) => (
        <p key={l} className="text-muted">
          {l}
        </p>
      ))}
    </div>
  )
}

// Two separate charts on purpose: which step you're on, and how your sets at the
// current step are trending. Different units, so they never share an axis.
export function TimelineChart({
  events,
  steps,
  currentLevel,
}: {
  events: ProgressEvent[]
  steps: ProgressionStep[]
  currentLevel: number
}) {
  const total = steps.length
  const points: Point[] = events.map((e) => ({
    t: new Date(e.created_at).getTime(),
    step: Math.min(e.level, total) + 1,
    kind: e.kind,
    value: e.value,
  }))
  // Carry the line to today so a long plateau is visible.
  const last = points[points.length - 1]
  if (last && Date.now() - last.t > 36e5) points.push({ ...last, t: Date.now(), kind: 'attempt', value: null })

  const current = steps[currentLevel]
  const attempts = current
    ? events.filter((e) => e.kind === 'attempt' && e.level === currentLevel && e.value !== null).map((e) => ({ t: new Date(e.created_at).getTime(), value: e.value as number }))
    : []

  const stepName = (n: number) => (n > total ? 'Skill owned' : steps[n - 1]?.name ?? '')

  return (
    <div className="space-y-8">
      <figure>
        <figcaption className="mb-3 flex items-baseline justify-between">
          <span className="label">Step over time</span>
          <span className="text-xs text-faint">{events.length} entries</span>
        </figcaption>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
              <CartesianGrid stroke={GRID} strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={day} tick={TICK} tickLine={false} axisLine={false} minTickGap={32} />
              <YAxis
                dataKey="step"
                domain={[1, total + 1]}
                ticks={Array.from({ length: total + 1 }, (_, i) => i + 1)}
                allowDecimals={false}
                tick={TICK}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                cursor={{ stroke: '#64748B', strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  const p = active && payload?.[0] ? (payload[0].payload as Point) : null
                  if (!p) return null
                  return (
                    <TooltipCard
                      title={`${day(p.t)} · Step ${Math.min(p.step, total)}`}
                      lines={[stepName(p.step), p.value !== null ? `${KIND_LABEL[p.kind]} ${p.value}` : KIND_LABEL[p.kind]]}
                    />
                  )
                }}
              />
              <Line
                type="stepAfter"
                dataKey="step"
                stroke={PRIMARY}
                strokeWidth={2}
                dot={(props: { cx?: number; cy?: number; payload?: Point; index?: number }) => {
                  const { cx, cy, payload, index } = props
                  if (cx === undefined || cy === undefined || !payload || payload.kind === 'attempt') return <g key={index} />
                  return <circle key={index} cx={cx} cy={cy} r={4.5} fill={PRIMARY} stroke="#1E293B" strokeWidth={2} />
                }}
                activeDot={{ r: 5, fill: PRIMARY, stroke: '#1E293B', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </figure>

      {current && attempts.length >= 2 && (
        <figure>
          <figcaption className="mb-3 flex items-baseline justify-between">
            <span className="label">{current.name} sets</span>
            <span className="text-xs text-faint">dashed line is the target</span>
          </figcaption>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attempts} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid stroke={GRID} strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={day} tick={TICK} tickLine={false} axisLine={false} minTickGap={32} />
                <YAxis domain={[0, (max: number) => Math.max(max, current.target_value) * 1.15]} tickFormatter={(v: number) => String(Math.round(v))} tick={TICK} tickLine={false} axisLine={false} width={40} />
                <ReferenceLine y={current.target_value} stroke="#16A34A" strokeDasharray="4 4" />
                <Tooltip
                  cursor={{ stroke: '#64748B', strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    const p = active && payload?.[0] ? (payload[0].payload as { t: number; value: number }) : null
                    if (!p) return null
                    return (
                      <TooltipCard
                        title={day(p.t)}
                        lines={[`${p.value} ${current.target_type === 'hold' ? 'sec' : 'reps'} of ${current.target_value}`]}
                      />
                    )
                  }}
                />
                <Line type="monotone" dataKey="value" stroke={PRIMARY} strokeWidth={2} dot={{ r: 4, fill: PRIMARY, stroke: '#1E293B', strokeWidth: 2 }} activeDot={{ r: 5 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </figure>
      )}
    </div>
  )
}
