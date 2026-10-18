import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CATALOG } from './catalog'
import { buildSeedSql } from './seed'

describe('catalog', () => {
  it('has unique slugs', () => {
    const slugs = CATALOG.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it.each(CATALOG.map((t) => [t.slug, t] as const))('%s has sequential levels and usable targets', (_, tree) => {
    expect(tree.progressions.length).toBeGreaterThanOrEqual(4)
    tree.progressions.forEach((step, i) => {
      expect(step.level).toBe(i)
      expect(step.target_value).toBeGreaterThan(0)
      expect(step.cues.length).toBeGreaterThan(0)
      expect(step.common_faults.length).toBeGreaterThan(0)
      // The human target should mention the same number as the machine one.
      expect(step.prerequisite_reps).toContain(String(step.target_value))
      expect(step.prerequisite_reps.includes('each side')).toBe(Boolean(step.per_side))
    })
  })

  it('only points prerequisites at real steps in other trees', () => {
    for (const tree of CATALOG) {
      for (const p of tree.prerequisites) {
        const other = CATALOG.find((t) => t.slug === p.slug)
        expect(other, `${tree.slug} -> ${p.slug}`).toBeDefined()
        expect(p.slug).not.toBe(tree.slug)
        expect(other!.progressions[p.level]).toBeDefined()
      }
    }
  })

  it('never uses em dashes in copy', () => {
    expect(JSON.stringify(CATALOG)).not.toContain(String.fromCharCode(0x2014))
  })

  it('matches the generated seed migration (run npm run seed:sql if this fails)', () => {
    const file = readFileSync(join(__dirname, '../../supabase/migrations/002_seed_skill_trees.sql'), 'utf8')
    expect(file.replace(/\r\n/g, '\n')).toBe(buildSeedSql(CATALOG))
  })
})
