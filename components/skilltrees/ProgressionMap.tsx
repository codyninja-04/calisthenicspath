import { ProgressionStep } from '@/components/skill/ProgressionStep'
import { stepStatus } from '@/lib/skills/progression'
import type { SkillTreeDef } from '@/lib/types'

// The full tree as a vertical path. Earlier steps collapse so the current one
// stands out, but every step can be opened to read its cues.
export function ProgressionMap({ tree, currentLevel }: { tree: SkillTreeDef; currentLevel: number | null }) {
  const mastered = currentLevel !== null && currentLevel >= tree.progressions.length

  return (
    <ol className="relative space-y-5" aria-label={`${tree.name} steps`}>
      <span className="absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-line via-line to-transparent" aria-hidden />
      {tree.progressions.map((step) => (
        <ProgressionStep key={step.level} step={step} status={stepStatus(step.level, currentLevel)} />
      ))}
      {mastered && (
        <li className="relative flex items-center gap-4">
          <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full bg-completed text-bg" aria-hidden>
            ★
          </span>
          <p className="font-display text-xl font-bold uppercase text-completed">Skill owned</p>
        </li>
      )}
    </ol>
  )
}
