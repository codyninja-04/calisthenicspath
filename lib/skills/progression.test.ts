import { describe, expect, it } from 'vitest'
import { CATALOG, findDef } from './catalog'
import { applyProgressAction, formatValue, hitTarget, isMastered, prerequisiteStatus, readiness, stepStatus } from './progression'

const pullUp = findDef('pull-up')!
const muscleUp = findDef('muscle-up')!

describe('stepStatus', () => {
  it('marks earlier steps completed, the current one current and later ones locked', () => {
    expect(stepStatus(0, 2)).toBe('completed')
    expect(stepStatus(2, 2)).toBe('current')
    expect(stepStatus(3, 2)).toBe('locked')
  })

  it('locks everything when the tree has not been started', () => {
    expect(stepStatus(0, null)).toBe('locked')
  })
})

describe('readiness', () => {
  const strict = pullUp.progressions[3]

  it('scales the logged value against the target', () => {
    expect(readiness(strict, 4)).toBe(0.5)
    expect(readiness(strict, 12)).toBe(1)
    expect(readiness(strict, null)).toBe(0)
    expect(readiness(strict, -2)).toBe(0)
  })

  it('knows when the target is hit', () => {
    expect(hitTarget(strict, 8)).toBe(true)
    expect(hitTarget(strict, 7)).toBe(false)
  })
})

describe('formatValue', () => {
  it('describes reps, holds and per side work', () => {
    expect(formatValue(pullUp.progressions[3], 8)).toBe('8 reps')
    expect(formatValue(pullUp.progressions[3], 1)).toBe('1 rep')
    expect(formatValue(pullUp.progressions[0], 22)).toBe('22 sec hold')
    expect(formatValue(pullUp.progressions[5], 3)).toBe('3 reps each side')
    expect(formatValue(pullUp.progressions[0], 12.5)).toBe('12.5 sec hold')
  })
})

describe('prerequisiteStatus', () => {
  it('needs the listed step cleared, not just reached', () => {
    const atStrict = prerequisiteStatus(muscleUp, CATALOG, { 'pull-up': 3, dips: 3 })
    expect(atStrict.find((p) => p.slug === 'pull-up')?.met).toBe(false)
    expect(atStrict.find((p) => p.slug === 'dips')?.met).toBe(true)

    const past = prerequisiteStatus(muscleUp, CATALOG, { 'pull-up': 4 })
    expect(past.find((p) => p.slug === 'pull-up')?.met).toBe(true)
    expect(past.find((p) => p.slug === 'dips')?.met).toBe(false)
  })

  it('names the tree and step so the UI can explain it', () => {
    const [first] = prerequisiteStatus(muscleUp, CATALOG, {})
    expect(first.treeName).toBe('Pull-up Progression')
    expect(first.stepName).toBe('Strict Pull-ups')
  })
})

describe('applyProgressAction', () => {
  const at = (level: number, value: number | null = null) => ({
    current_level: level,
    current_reps_or_hold: value === null ? null : 'x',
    current_value: value,
  })

  it('starts at the chosen level', () => {
    const r = applyProgressAction(pullUp, null, { action: 'start', level: 3 })
    expect(r.ok && r.state.current_level).toBe(3)
    expect(r.ok && r.event.kind).toBe('start')
  })

  it('rejects levels outside the tree', () => {
    expect(applyProgressAction(pullUp, null, { action: 'start', level: 99 }).ok).toBe(false)
    expect(applyProgressAction(pullUp, null, { action: 'start', level: -1 }).ok).toBe(false)
  })

  it('needs a started tree for everything else', () => {
    expect(applyProgressAction(pullUp, null, { action: 'advance' }).ok).toBe(false)
    expect(applyProgressAction(pullUp, null, { action: 'log', value: 5 }).ok).toBe(false)
  })

  it('logs an attempt with a readable label', () => {
    const r = applyProgressAction(pullUp, at(3), { action: 'log', value: 6 })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.state.current_reps_or_hold).toBe('6 reps')
      expect(r.state.current_value).toBe(6)
      expect(r.event).toEqual({ kind: 'attempt', level: 3, value: 6 })
    }
  })

  it('rejects silly attempt values', () => {
    expect(applyProgressAction(pullUp, at(3), { action: 'log', value: 0 }).ok).toBe(false)
    expect(applyProgressAction(pullUp, at(3), { action: 'log', value: 99999 }).ok).toBe(false)
    expect(applyProgressAction(pullUp, at(3), { action: 'log', value: NaN }).ok).toBe(false)
  })

  it('advances and clears the logged attempt', () => {
    const r = applyProgressAction(pullUp, at(3, 8), { action: 'advance' })
    expect(r.ok && r.state).toEqual({ current_level: 4, current_reps_or_hold: null, current_value: null })
  })

  it('advancing past the last step means mastered', () => {
    const last = pullUp.progressions.length - 1
    const r = applyProgressAction(pullUp, at(last, 1), { action: 'advance' })
    expect(r.ok && isMastered(pullUp, r.state.current_level)).toBe(true)
    if (r.ok) expect(applyProgressAction(pullUp, r.state, { action: 'advance' }).ok).toBe(false)
  })

  it('steps back but never below the first step', () => {
    const r = applyProgressAction(pullUp, at(2), { action: 'regress' })
    expect(r.ok && r.state.current_level).toBe(1)
    expect(applyProgressAction(pullUp, at(0), { action: 'regress' }).ok).toBe(false)
  })
})
