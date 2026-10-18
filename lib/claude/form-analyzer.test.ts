import { describe, expect, it } from 'vitest'
import { findDef } from '../skills/catalog'
import { describeStep, normalizeAnalysis } from './form-analyzer'

const good = {
  image_usable: true,
  feedback: '  Solid tuck planche.  ',
  form_issues: [{ issue: 'Hips a touch low', fix: 'Lean further forward' }, { issue: '' }, 'junk'],
  what_looks_good: ['Straight arms', '', 3],
  progression_ready: true,
  next_step_advice: 'Push the knees out next.',
  safety_note: '   ',
}

describe('normalizeAnalysis', () => {
  it('cleans up the tool output', () => {
    const a = normalizeAnalysis(good)!
    expect(a.feedback).toBe('Solid tuck planche.')
    expect(a.form_issues).toEqual([{ issue: 'Hips a touch low', fix: 'Lean further forward' }])
    expect(a.what_looks_good).toEqual(['Straight arms'])
    expect(a.safety_note).toBeNull()
    expect(a.progression_ready).toBe(true)
  })

  it('never marks an unusable photo as ready', () => {
    expect(normalizeAnalysis({ ...good, image_usable: false })!.progression_ready).toBe(false)
  })

  it('treats anything but a literal true as not ready', () => {
    expect(normalizeAnalysis({ ...good, progression_ready: 'yes' })!.progression_ready).toBe(false)
  })

  it('rejects output with no feedback', () => {
    expect(normalizeAnalysis({ ...good, feedback: '' })).toBeNull()
    expect(normalizeAnalysis(null)).toBeNull()
    expect(normalizeAnalysis('text')).toBeNull()
  })
})

describe('describeStep', () => {
  const planche = findDef('planche')!

  it('gives Claude the step, its cues and the logged effort', () => {
    const text = describeStep(planche, planche.progressions[1], 7)
    expect(text).toContain('Step 2 of 5: Tuck Planche')
    expect(text).toContain('7 sec hold')
    expect(text).toContain('Next step: Advanced Tuck Planche')
  })

  it('says when it is the last step', () => {
    expect(describeStep(planche, planche.progressions[4], null)).toContain('final step')
  })
})
