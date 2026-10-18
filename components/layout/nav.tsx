export const NAV = [
  {
    href: '/skilltrees',
    label: 'Trees',
    match: ['/skilltrees', '/skill'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5" aria-hidden>
        <path d="M5 20v-5M12 20V10M19 20V4" />
        <circle cx="19" cy="4" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: '/log',
    label: 'Log',
    match: ['/log'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5" aria-hidden>
        <rect x="4" y="5" width="16" height="15" rx="2.5" />
        <path d="M4 10h16M9 3v4M15 3v4M8.5 14.5l2 2 4-4" />
      </svg>
    ),
  },
  {
    href: '/settings',
    label: 'Settings',
    match: ['/settings'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5" aria-hidden>
        <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="10" cy="17" r="2" />
      </svg>
    ),
  },
]

export function isActive(path: string, match: string[]): boolean {
  return match.some((m) => path === m || path.startsWith(`${m}/`))
}
