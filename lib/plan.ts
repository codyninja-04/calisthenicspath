import type { Plan } from './types'

// Free plan from the spec: two skill trees and basic tracking. Pro opens every
// tree, unlimited form checks and the training analytics. Limits only apply when
// ENFORCE_PRO is on, so the app is fully usable before billing exists.
export const FREE_TREE_LIMIT = 2
export const FREE_FORM_CHECKS_PER_MONTH = 3

// A hard ceiling on Claude calls for everyone, pro included, so a stuck client or
// a bad actor can't run up the bill.
export const DAILY_FORM_CHECK_CAP = 20

export function enforcingPlans(): boolean {
  return process.env.ENFORCE_PRO === 'true'
}

export function limitsFor(plan: Plan) {
  const limited = enforcingPlans() && plan !== 'pro'
  return {
    trees: limited ? FREE_TREE_LIMIT : Infinity,
    formChecksPerMonth: limited ? FREE_FORM_CHECKS_PER_MONTH : Infinity,
    analytics: !limited,
  }
}

export function startOfMonthIso(now = new Date()): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()
}
