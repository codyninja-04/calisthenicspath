import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CalisthenicsPath',
    short_name: 'CaliPath',
    description: 'Skill tree tracker for calisthenics, with form checks on your attempts.',
    start_url: '/skilltrees',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#0F172A',
    orientation: 'portrait',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icons/192', sizes: '192x192', type: 'image/png' },
      { src: '/icons/512', sizes: '512x512', type: 'image/png' },
      { src: '/icons/512?maskable=1', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
