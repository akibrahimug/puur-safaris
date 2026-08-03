import type { Viewport } from 'next'
import { Sora, Barriecito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { headers, draftMode, cookies } from 'next/headers'
import { Suspense } from 'react'
import Script from 'next/script'
import { VisualEditing } from 'next-sanity/visual-editing'
import { SanityLive } from '@/sanity/live'
import { ThemeProvider } from '@/providers/theme-provider'
import { SuppressHydrationWarnings } from '@/components/shared/suppress-hydration-warnings'
import { RouteTracker } from '@/components/shared/route-tracker'
import { GTM_ID } from '@/lib/analytics/gtm'
import { GA_CONSENT_COOKIE } from '@/lib/analytics/consent'
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
  const [hdrs, cookieStore] = await Promise.all([headers(), cookies()])
  const lang = hdrs.get('x-locale') ?? defaultLocale

  // Tracks by default (see AnalyticsConsentBanner in the (site) layout) —
  // only an explicit "denied" choice skips loading GTM. No GTM ID configured
  // → never loads, so local/preview envs without the env var stay silent.
  const gtmEnabled = Boolean(GTM_ID) && cookieStore.get(GA_CONSENT_COOKIE)?.value !== 'denied'

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
        {gtmEnabled && (
          // `beforeInteractive` is always hoisted into <head> by Next.js
          // regardless of where the Script component sits in the tree — this
          // is the officially supported way to place GTM "as high as
          // possible in <head>" from the App Router.
          <Script id="gtm-head" strategy="beforeInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {gtmEnabled && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <ThemeProvider>
          {children}
        </ThemeProvider>
        {gtmEnabled && (
          <Suspense fallback={null}>
            <RouteTracker />
          </Suspense>
        )}
        <SuppressHydrationWarnings />
        <SanityLive />
        {(await draftMode()).isEnabled && <VisualEditing />}
        <Analytics />
      </body>
    </html>
  )
}
