# CalisthenicsPath

A skill tree tracker for calisthenics. Pick a skill, mark which step you're on, log your best sets, and upload a photo or video frames of an attempt to get form feedback from Claude. Built for people who train on their own at home or in outdoor street workout parks and want to know exactly what earns the next progression.

## What's in it

- **10 skill trees**: pull-up to one-arm pull-up, push-up to one-arm push-up, dips, muscle-up, front lever, back lever, planche, handstand, L-sit to V-sit and pistol squat. Every step has a target (like `8 reps` or `10 sec hold`), cues to think about and common faults to watch for.
- **Your position on each tree**: start at any step, log your best set, see how close you are to the target, step up or step back. Trees with prerequisites (the muscle-up wants strict pull-ups and dips first) tell you so, without locking you out.
- **Form checks**: take a photo, choose up to 3, or scrub through a video and grab frames. Only the frames are uploaded. Claude reviews them against that step's cues and faults and comes back with the issues that matter most, one fix for each, what already looks solid, a ready / keep building call, and a safety note when something looks risky.
- **Progress timeline**: a step over time chart for each tree, plus a chart of your sets at the current step against its target.
- **Training log**: log sessions with the skills you trained, where, how long and how hard. Shows this week, a week streak, sessions per week and which tracked trees you've been neglecting.
- **PWA**: installable, with a small service worker that caches static assets and shows an offline page.

## Stack

Next.js 14 (App Router) · TypeScript strict · Supabase (Postgres with RLS, Google auth, private storage) · Claude API with vision · Recharts · Tailwind CSS · Vitest

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in the values
npm run dev
```

### Supabase

1. Create a project and run the two migrations in `supabase/migrations` in order. `001` creates the tables, RLS policies, the signup trigger and the private `form-checks` storage bucket. `002` seeds the skill trees.
2. Enable the Google provider under Authentication and add `http://localhost:3000/auth/callback` (and your production URL) to the redirect URLs.

### Environment

| Variable | What it's for |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | Only used to delete an account |
| `ANTHROPIC_API_KEY` | Form checks |
| `CLAUDE_MODEL` | Optional, defaults to `claude-sonnet-5-5` |
| `ENFORCE_PRO` | `true` turns on the free plan limits (2 trees, 3 form checks a month, no log analytics) |

## Editing the skill trees

`lib/skills/catalog.ts` is the source of truth. After changing it, regenerate the seed and run it against your database:

```bash
npm run seed:sql
```

The seed upserts by slug, so existing progress keeps pointing at the same trees. A test fails if the catalog and the seed file drift apart.

## Scripts

```bash
npm run dev         # local dev server
npm run build       # production build
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm test            # vitest
npm run seed:sql    # regenerate 002_seed_skill_trees.sql from the catalog
```

## How it fits together

- `lib/skills/progression.ts` holds the progression rules (start, log, advance, regress, readiness, prerequisites) as pure functions. The API route just loads, applies and saves.
- `lib/claude/form-analyzer.ts` sends the frames with the step's description, cues, faults and your logged best, and forces a tool call so the response is always structured. The output is checked field by field before it's stored, and an unusable photo can never come back as "ready".
- `app/api/form-check` sniffs the image bytes instead of trusting the file type, enforces the plan limit plus a daily cap for everyone, uploads to `<user_id>/<check_id>/` in the private bucket and cleans up if anything fails.
- Photos are only ever shown through signed URLs that expire after an hour. Clearing your data or deleting your account removes them from storage too.

## Not in v1

No workout programming beyond the trees themselves, and no community or social features. Pro billing isn't wired up yet, so everything is unlocked unless `ENFORCE_PRO=true`.
