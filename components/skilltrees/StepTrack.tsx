import { stepStatus } from '@/lib/skills/progression'

const TONE = {
  completed: 'bg-completed',
  current: 'bg-primary',
  locked: 'bg-locked/50',
}

// A compact horizontal read of a tree: one segment per step.
export function StepTrack({ total, currentLevel }: { total: number; currentLevel: number | null }) {
  return (
    <div className="flex gap-1" role="img" aria-label={currentLevel === null ? `${total} steps, not started` : `Step ${Math.min(currentLevel + 1, total)} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-1.5 flex-1 rounded-full ${TONE[stepStatus(i, currentLevel)]}`} />
      ))}
    </div>
  )
}
