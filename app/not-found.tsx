import Link from 'next/link'
import { LogoMark } from '@/components/layout/Logo'

export default function NotFound() {
  return (
    <main className="grid-lines grid min-h-screen place-items-center px-6">
      <div className="max-w-sm text-center animate-rise-in">
        <LogoMark className="mx-auto h-12 w-12" />
        <h1 className="heading mt-6 text-5xl">Missed the bar</h1>
        <p className="mt-3 text-muted">That page doesn&apos;t exist. Chalk up and try again.</p>
        <Link href="/skilltrees" className="btn-primary mt-6">
          Back to your trees
        </Link>
      </div>
    </main>
  )
}
