'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { WeekBucket } from '@/lib/weeks'

export function WeeklyChart({ weeks }: { weeks: WeekBucket[] }) {
  const max = Math.max(3, ...weeks.map((w) => w.sessions))

  return (
    <figure>
      <figcaption className="label mb-3">Sessions per week</figcaption>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeks} margin={{ top: 8, right: 4, bottom: 0, left: -24 }} barCategoryGap="22%">
            <CartesianGrid stroke="#334155" strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#94A3B8', fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis domain={[0, max]} allowDecimals={false} tick={{ fill: '#94A3B8', fontSize: 11 }} tickLine={false} axisLine={false} width={36} />
            <Tooltip
              cursor={{ fill: 'rgba(148,163,184,0.08)' }}
              content={({ active, payload }) => {
                const w = active && payload?.[0] ? (payload[0].payload as WeekBucket) : null
                if (!w) return null
                return (
                  <div className="rounded-xl border border-line bg-bg/95 px-3 py-2 text-xs shadow-card">
                    <p className="font-semibold">Week of {w.label}</p>
                    <p className="text-muted">
                      {w.sessions} {w.sessions === 1 ? 'session' : 'sessions'}
                    </p>
                  </div>
                )
              }}
            />
            <Bar dataKey="sessions" fill="#F97316" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}
