import { BottomNav } from '@/components/layout/BottomNav'
import { Header } from '@/components/layout/Header'
import { firstName, requireUser } from '@/lib/auth'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireUser()

  return (
    <div className="min-h-screen">
      <Header name={firstName(profile, user.email)} />
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6 md:pb-16 md:pt-10">{children}</main>
      <BottomNav />
    </div>
  )
}
