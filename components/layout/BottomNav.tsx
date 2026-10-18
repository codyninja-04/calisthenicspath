'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV, isActive } from './nav'

// Thumb reachable nav for phones, which is how most people will use this at the bar.
export function BottomNav() {
  const path = usePathname()

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-3">
        {NAV.map((item) => {
          const active = isActive(path, item.match)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 py-2.5 text-[0.7rem] font-semibold uppercase tracking-wider transition ${
                active ? 'text-primary' : 'text-faint hover:text-muted'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
