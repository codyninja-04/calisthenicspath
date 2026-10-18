'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'
import { NAV, isActive } from './nav'

export function Header({ name }: { name: string }) {
  const path = usePathname()

  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Logo href="/skilltrees" />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((item) => {
            const active = isActive(path, item.match)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? 'bg-surface text-text' : 'text-muted hover:text-text'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <span className="hidden text-sm text-muted md:block">{name}</span>
      </div>
    </header>
  )
}
