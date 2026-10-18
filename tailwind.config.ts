import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F172A',
        surface: '#1E293B',
        raised: '#263449',
        line: '#334155',
        text: '#F1F5F9',
        muted: '#94A3B8',
        faint: '#64748B',
        primary: { DEFAULT: '#F97316', soft: '#FDBA74', ink: '#1A0E05' },
        completed: '#16A34A',
        locked: '#475569',
        danger: '#F87171',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
        glow: '0 0 0 4px rgba(249,115,22,0.18)',
      },
      keyframes: {
        'rise-in': { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'none' } },
        'ring-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(249,115,22,0.45)' },
          '100%': { boxShadow: '0 0 0 10px rgba(249,115,22,0)' },
        },
      },
      animation: {
        'rise-in': 'rise-in 0.35s ease-out both',
        'ring-pulse': 'ring-pulse 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
