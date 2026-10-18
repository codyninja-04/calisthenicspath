import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, Inter } from 'next/font/google'
import { RegisterSW } from '@/components/pwa/RegisterSW'
import './globals.css'

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: { default: 'CalisthenicsPath', template: '%s · CalisthenicsPath' },
  description:
    'Track where you are on every calisthenics progression, from dead hangs to the one-arm pull-up, and get form feedback on your attempts.',
  applicationName: 'CalisthenicsPath',
  appleWebApp: { capable: true, title: 'CalisthenicsPath', statusBarStyle: 'black-translucent' },
  icons: { icon: '/icon.svg', apple: '/icons/180' },
}

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen font-sans">
        {children}
        <RegisterSW />
      </body>
    </html>
  )
}
