import type { Category } from '@/lib/types'

// Small line glyphs so each category reads at a glance without stock imagery.
export function CategoryIcon({ category, className = 'h-5 w-5' }: { category: Category; className?: string }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  }

  switch (category) {
    case 'pull':
      return (
        <svg {...common}>
          <path d="M3 4h18" />
          <path d="M8 4v4.5a4 4 0 0 0 8 0V4" />
          <circle cx="12" cy="12.5" r="0" />
          <path d="M12 12.5V20M9 20h6" />
        </svg>
      )
    case 'push':
      return (
        <svg {...common}>
          <path d="M3 19h18" />
          <path d="M6 19v-4M18 19v-4" />
          <path d="M5 11l7-5 7 5" />
        </svg>
      )
    case 'core':
      return (
        <svg {...common}>
          <rect x="7" y="4" width="10" height="16" rx="3" />
          <path d="M7 10h10M7 14h10M12 4v16" />
        </svg>
      )
    case 'legs':
      return (
        <svg {...common}>
          <path d="M9 3v7l-3 5v6" />
          <path d="M9 10l5 4h6" />
        </svg>
      )
    case 'balance':
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="M8 21l4-6 4 6" />
          <circle cx="12" cy="3" r="0.5" fill="currentColor" />
          <path d="M5 8h14" />
        </svg>
      )
  }
}
