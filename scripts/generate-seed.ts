import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { CATALOG } from '../lib/skills/catalog'
import { buildSeedSql } from '../lib/skills/seed'

const out = join(__dirname, '..', 'supabase', 'migrations', '002_seed_skill_trees.sql')
writeFileSync(out, buildSeedSql(CATALOG))
console.log(`Wrote ${CATALOG.length} skill trees to ${out}`)
