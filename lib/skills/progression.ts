import type { ProgressionStep, SkillProgress, SkillTreeDef } from '../types'

export type StepStatus = 'completed' | 'current' | 'locked'

export function stepStatus(level: number, currentLevel: number | null): StepStatus {
  if (currentLevel === null) return 'locked'
  if (level < currentLevel) return 'completed'
  if (level === currentLevel) return 'current'
  return 'locked'
}

export function isMastered(tree: SkillTreeDef, currentLevel: number): boolean {
  return currentLevel >= tree.progressions.length
}

export function currentStep(tree: SkillTreeDef, currentLevel: number): ProgressionStep | null {
  return tree.progressions[currentLevel] ?? null
}

export function unitFor(step: ProgressionStep): string {
  return step.target_type === 'hold' ? 'sec' : 'reps'
}

// "8 reps", "15 sec hold", "5 reps each side". Used for logged attempts, which is
// why it doesn't reuse prerequisite_reps (that one can mention extra load).
export function formatValue(step: ProgressionStep, value: number): string {
  const n = Number.isInteger(value) ? String(value) : value.toFixed(1)
  const base = step.target_type === 'hold' ? `${n} sec hold` : `${n} ${value === 1 ? 'rep' : 'reps'}`
  return step.per_side ? `${base} each side` : base
}

// How close a logged attempt is to the step's target, from 0 to 1.
export function readiness(step: ProgressionStep, value: number | null): number {
  if (value === null || !Number.isFinite(value) || value <= 0) return 0
  return Math.min(1, value / step.target_value)
}

export function hitTarget(step: ProgressionStep, value: number | null): boolean {
  return value !== null && value >= step.target_value
}

export interface PrereqStatus {
  slug: string
  treeName: string
  stepName: string
  met: boolean
}

// Prerequisites are advice, not a gate. People come in with history from other
// training, so the app tells them what it would want cleared first and lets them
// decide.
export function prerequisiteStatus(
  tree: SkillTreeDef,
  catalog: SkillTreeDef[],
  levelBySlug: Record<string, number | undefined>
): PrereqStatus[] {
  return tree.prerequisites.flatMap((p) => {
    const other = catalog.find((t) => t.slug === p.slug)
    const step = other?.progressions[p.level]
    if (!other || !step) return []
    const current = levelBySlug[p.slug]
    return [{ slug: p.slug, treeName: other.name, stepName: step.name, met: current !== undefined && current > p.level }]
  })
}

export type ProgressAction =
  | { action: 'start'; level: number }
  | { action: 'log'; value: number }
  | { action: 'advance' }
  | { action: 'regress' }

type ProgressState = Pick<SkillProgress, 'current_level' | 'current_reps_or_hold' | 'current_value'>

export type ApplyResult =
  | { ok: true; state: ProgressState; event: { kind: 'start' | 'attempt' | 'advance' | 'regress'; level: number; value: number | null } }
  | { ok: false; error: string }

// Works out the next progress row from an action. Pure, so the API route stays
// thin and the rules are covered by tests.
export function applyProgressAction(tree: SkillTreeDef, current: ProgressState | null, input: ProgressAction): ApplyResult {
  const last = tree.progressions.length

  if (input.action === 'start') {
    if (!Number.isInteger(input.level) || input.level < 0 || input.level > last) {
      return { ok: false, error: 'That level is not part of this tree' }
    }
    return {
      ok: true,
      state: { current_level: input.level, current_reps_or_hold: null, current_value: null },
      event: { kind: 'start', level: input.level, value: null },
    }
  }

  if (!current) return { ok: false, error: 'Start this tree first' }

  if (input.action === 'log') {
    const step = currentStep(tree, current.current_level)
    if (!step) return { ok: false, error: 'You have already mastered this skill' }
    if (!Number.isFinite(input.value) || input.value <= 0 || input.value > 3600) {
      return { ok: false, error: 'Enter a number of reps or seconds' }
    }
    const value = Math.round(input.value * 10) / 10
    return {
      ok: true,
      state: { ...current, current_reps_or_hold: formatValue(step, value), current_value: value },
      event: { kind: 'attempt', level: current.current_level, value },
    }
  }

  if (input.action === 'advance') {
    if (current.current_level >= last) return { ok: false, error: 'You have already mastered this skill' }
    const level = current.current_level + 1
    return {
      ok: true,
      state: { current_level: level, current_reps_or_hold: null, current_value: null },
      event: { kind: 'advance', level, value: null },
    }
  }

  if (current.current_level <= 0) return { ok: false, error: 'You are already on the first step' }
  const level = current.current_level - 1
  return {
    ok: true,
    state: { current_level: level, current_reps_or_hold: null, current_value: null },
    event: { kind: 'regress', level, value: null },
  }
}
