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
    // `lang={lang}` (set from the proxy's x-locale header) declares the page's
    // authored source language. `translate="no"` (+ the notranslate meta) tells
    // browsers NOT to offer "Translate this page?" — /nl always shows authored
    // Dutch and /en always shows authored English, never a machine translation
    // layered on top. We have first-class translations for both locales, so the
    // browser's auto-translate only ever degraded the experience (e.g. machine-
    // translating Dutch on /nl for an English-browser visitor). Cross-locale
    // switching is offered by <CountryBanner> instead.
    // `suppressHydrationWarning` stays because Sanity stega-encoded content
    // and visual-editing live updates can perturb the DOM during hydration.
    <html lang={lang} translate="no" className={`${sora.variable} ${barriecito.variable} h-full antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
      </head>
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
