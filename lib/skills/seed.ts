import type { SkillTreeDef } from '../types'

const HEADER = `-- Generated from lib/skills/catalog.ts by \`npm run seed:sql\`. Edit the catalog,
-- not this file. Safe to re-run: existing trees are updated in place by slug, so
-- people's progress rows keep pointing at the same ids.
`

// Dollar quoting keeps the JSON readable without escaping every apostrophe.
function literal(value: unknown): string {
  return `$json$${JSON.stringify(value, null, 2)}$json$::jsonb`
}

function text(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

export function buildSeedSql(catalog: SkillTreeDef[]): string {
  const rows = catalog.map(
    (t, i) =>
      `(${text(t.slug)}, ${text(t.name)}, ${text(t.category)}, ${text(t.summary)}, ${i}, ${literal(t.prerequisites)}, ${literal(
        t.progressions
      )})`
  )

  return `${HEADER}
insert into skill_trees (slug, name, category, summary, sort_order, prerequisites, progressions) values
${rows.join(',\n')}
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  summary = excluded.summary,
  sort_order = excluded.sort_order,
  prerequisites = excluded.prerequisites,
  progressions = excluded.progressions;
`
}
