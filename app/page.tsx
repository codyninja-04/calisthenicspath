import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'
import { CategoryIcon } from '@/components/skilltrees/CategoryIcon'
import { ProgressionPreview } from '@/components/skilltrees/ProgressionPreview'
import { StepTrack } from '@/components/skilltrees/StepTrack'
import { CATALOG, CATEGORY_LABEL } from '@/lib/skills/catalog'
import { createClient } from '@/lib/supabase/server'

const STEPS = [
  {
    n: '01',
    title: 'Find your rung',
    body: 'Pick a skill and mark the hardest step you can do today. No need to log dead hangs if you already have strict pull-ups.',
  },
  {
    n: '02',
    title: 'Log your best set',
    body: 'Every step has a clear target, like 8 strict reps or a 10 second hold. Log clean sets and watch the gap close.',
  },
  {
    n: '03',
    title: 'Check your form, then step up',
    body: 'Snap a photo or grab frames from a video. Get the issues that matter, one fix for each, and an honest call on whether you are ready.',
  },
]

export default async function Home() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <Link href="/skilltrees" className="btn-primary">
              Open your trees
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-quiet">
                Sign in
              </Link>
              <Link href="/signup" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="grid-lines border-b border-line/50">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="animate-rise-in">
              <p className="label text-primary">For the bar, the rings and the floor</p>
              <h1 className="heading mt-4 text-6xl sm:text-7xl lg:text-8xl">
                Know your step.
                <br />
                <span className="text-primary">Earn the next one.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
                CalisthenicsPath tracks where you are on the progressions that actually matter, from dead hang to one-arm pull-up, tuck
                to full planche, wall to freestanding handstand. Upload a photo of your attempt and get straight feedback on your form.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={user ? '/skilltrees' : '/signup'} className="btn-primary px-6 py-3 text-base">
                  {user ? 'Open your trees' : 'Start for free'}
                </Link>
                <a href="#trees" className="btn-ghost px-6 py-3 text-base">
                  See the trees
                </a>
              </div>
              <p className="mt-4 text-sm text-faint">Free for two skill trees. Sign in with Google.</p>
            </div>
            <div className="animate-rise-in [animation-delay:120ms]">
              <ProgressionPreview />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="label">How it works</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="border-t border-line pt-5">
                <p className="font-display text-5xl font-bold text-primary/80">{s.n}</p>
                <h2 className="heading mt-3 text-3xl">{s.title}</h2>
                <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="trees" className="border-y border-line/50 bg-surface/30">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="label">{CATALOG.length} skill trees</p>
            <h2 className="heading mt-3 max-w-2xl text-5xl">The progressions people actually follow.</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">
              Every step has a target, the cues to think about and the faults to watch for. Prerequisites tell you what to build first,
              like strict pull-ups and dips before the muscle-up.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CATALOG.map((t) => (
                <div key={t.slug} className="card p-5">
                  <p className="label flex items-center gap-1.5">
                    <CategoryIcon category={t.category} className="h-3.5 w-3.5" />
                    {CATEGORY_LABEL[t.category]}
                  </p>
                  <p className="heading mt-2 text-2xl">{t.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {t.progressions[0].name} to {t.progressions[t.progressions.length - 1].name}
                  </p>
                  <div className="mt-4">
                    <StepTrack total={t.progressions.length} currentLevel={null} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="label">Form checks</p>
            <h2 className="heading mt-3 text-5xl">A second pair of eyes at the park.</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Training alone means nobody tells you your hips are sagging in the tuck planche, or that your band-assisted reps stop at
              the forehead. Prop your phone up, film the set, grab the frames that matter. The review knows which step you are on and
              what usually goes wrong there.
            </p>
            <p className="mt-4 text-sm text-faint">Photos stay private to your account. Delete them whenever you want.</p>
          </div>
          <div className="card p-5 sm:p-6" aria-label="Example form check">
            <div className="flex items-center justify-between">
              <p className="label">Tuck Planche</p>
              <span className="chip border-primary/40 bg-primary/10 text-primary-soft">Keep building</span>
            </div>
            <p className="mt-4 leading-relaxed">
              Arms are locked and the lean is good, but your hips sit below shoulder height, which takes load off the shoulders and
              makes the hold easier than it should be.
            </p>
            <ol className="mt-5 space-y-3">
              <li className="flex gap-3 rounded-xl border border-line bg-bg/40 p-4 text-sm">
                <span className="font-display text-lg font-bold leading-none text-primary">1</span>
                <div>
                  <p className="font-semibold">Hips below the shoulders</p>
                  <p className="mt-1 text-muted">Round the upper back and push the floor away until the hips float up level.</p>
                </div>
              </li>
              <li className="flex gap-3 rounded-xl border border-line bg-bg/40 p-4 text-sm">
                <span className="font-display text-lg font-bold leading-none text-primary">2</span>
                <div>
                  <p className="font-semibold">Shoulders drifting back over the hands</p>
                  <p className="mt-1 text-muted">Lean until your shoulders are clearly past your wrists before lifting the feet.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="border-t border-line/50">
          <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
            <h2 className="heading mx-auto max-w-3xl text-5xl sm:text-6xl">No shortcuts. Just the next step, done properly.</h2>
            <Link href={user ? '/skilltrees' : '/signup'} className="btn-primary mt-8 px-6 py-3 text-base">
              {user ? 'Open your trees' : 'Find your step'}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line/50">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>CalisthenicsPath</span>
          <span>Form feedback is guidance, not medical advice. If it hurts, stop.</span>
        </div>
      </footer>
    </div>
  )
}
