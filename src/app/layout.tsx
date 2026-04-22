import type { Viewport } from 'next'
import { Sora, Barriecito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { headers, draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { SanityLive } from '@/sanity/live'
import { ThemeProvider } from '@/providers/theme-provider'
import { SuppressHydrationWarnings } from '@/components/shared/suppress-hydration-warnings'
import { defaultLocale } from '@/i18n/config'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const barriecito = Barriecito({
  subsets: ['latin'],
  variable: '--font-barriecito',
  weight: '400',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers()
  const lang = hdrs.get('x-locale') ?? defaultLocale

  return (
    <html lang={lang} className={`${sora.variable} ${barriecito.variable} h-full antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <SuppressHydrationWarnings />
        <SanityLive />
        {(await draftMode()).isEnabled && <VisualEditing />}
        <Analytics />
      </body>
    </html>
  )
}
