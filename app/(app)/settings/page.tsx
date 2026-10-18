import type { Metadata } from 'next'
import { requireUser } from '@/lib/auth'
import { enforcingPlans, FREE_FORM_CHECKS_PER_MONTH, FREE_TREE_LIMIT } from '@/lib/plan'
import { DangerZone } from './DangerZone'

export const metadata: Metadata = { title: 'Settings' }

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    features: [`${FREE_TREE_LIMIT} skill trees tracked at a time`, 'Every tree to browse, with cues and faults', `${FREE_FORM_CHECKS_PER_MONTH} form checks a month`, 'Training log'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$5/month',
    features: ['Track every skill tree', 'Unlimited form checks', 'Training log analytics', 'Support the app'],
  },
] as const

export default async function SettingsPage() {
  const { user, profile } = await requireUser()
  const enforcing = enforcingPlans()

  return (
    <div className="max-w-3xl space-y-10 animate-rise-in">
      <div>
        <p className="label">Settings</p>
        <h1 className="heading mt-2 text-5xl">Your account</h1>
      </div>

      <section className="card divide-y divide-line/70">
        <Row label="Name" value={profile.full_name ?? 'Not set'} />
        <Row label="Email" value={user.email ?? 'Not set'} />
        <Row label="Signed in with" value="Google" />
        <div className="flex items-center justify-between p-5">
          <span className="text-sm text-muted">Session</span>
          <form action="/auth/signout" method="post">
            <button type="submit" className="btn-ghost">
              Sign out
            </button>
          </form>
        </div>
      </section>

      <section>
        <h2 className="label mb-4">Plan</h2>
        {!enforcing && (
          <p className="mb-4 rounded-xl border border-completed/40 bg-completed/10 p-4 text-sm">
            Everything is unlocked for now while billing isn&apos;t live. Enjoy it.
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {PLANS.map((plan) => {
            const current = profile.plan === plan.id
            return (
              <div key={plan.id} className={`card p-5 ${current ? 'border-primary/60 shadow-glow' : ''}`}>
                <div className="flex items-baseline justify-between">
                  <p className="heading text-3xl">{plan.name}</p>
                  <p className="text-sm text-muted">{plan.price}</p>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-faint">
                  {current ? 'Your plan' : plan.id === 'pro' ? 'Upgrades open soon' : ''}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="label mb-4">Your data</h2>
        <div className="card p-5">
          <p className="mb-5 text-sm leading-relaxed text-muted">
            Form check photos are stored in a private bucket that only your account can read, and are only ever shown through links that
            expire after an hour. They&apos;re sent to Claude for the review and not used for anything else.
          </p>
          <DangerZone />
        </div>
      </section>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 p-5">
      <span className="text-sm text-muted">{label}</span>
      <span className="truncate text-sm font-medium">{value}</span>
    </div>
  )
}
