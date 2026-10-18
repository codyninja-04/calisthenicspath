import Link from 'next/link'

export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect x="13" y="38" width="10" height="14" rx="2.5" className="fill-completed" />
      <rect x="27" y="28" width="10" height="24" rx="2.5" className="fill-completed" />
      <rect x="41" y="18" width="10" height="34" rx="2.5" className="fill-primary" />
      <circle cx="46" cy="10.5" r="4" className="fill-primary" />
    </svg>
  )
}

export function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2" aria-label="CalisthenicsPath home">
      <LogoMark />
      <span className="font-display text-lg font-bold uppercase tracking-tight sm:text-xl">
        Calisthenics<span className="text-primary">Path</span>
      </span>
    </Link>
  )
}
