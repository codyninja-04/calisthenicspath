import type { Metadata } from 'next'
import { Suspense } from 'react'
import { GoogleAuth } from '@/components/layout/GoogleAuth'

export const metadata: Metadata = { title: 'Create account' }

export default function Page() {
  return (
    <Suspense>
      <GoogleAuth mode="signup" />
    </Suspense>
  )
}
