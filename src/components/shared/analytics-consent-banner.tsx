'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GA_CONSENT_COOKIE, GA_CONSENT_MAX_AGE_SECONDS } from '@/lib/analytics/consent'

/**
 * Tiny, static two-locale copy set — same precedent as <CountryBanner>
 * (not CMS, not the dictionary; this is site chrome, not page content).
 */
const COPY: Record<string, { message: string; accept: string; decline: string; privacyLabel: string; privacyHref: string }> = {
  nl: {
    message: 'We gebruiken Google Analytics om onze website te verbeteren. Geen reactie betekent dat u akkoord gaat.',
    accept: 'Accepteren',
    decline: 'Weigeren',
    privacyLabel: 'Privacybeleid',
    privacyHref: '/nl/privacybeleid',
  },
  en: {
    message: 'We use Google Analytics to improve our website. No response means you agree.',
    accept: 'Accept',
    decline: 'Decline',
    privacyLabel: 'Privacy Policy',
    privacyHref: '/en/privacy',
  },
}

function persistConsent(value: 'granted' | 'denied') {
  document.cookie = `${GA_CONSENT_COOKIE}=${value}; path=/; max-age=${GA_CONSENT_MAX_AGE_SECONDS}; samesite=lax`
}

interface AnalyticsConsentBannerProps {
  locale: string
}

/**
 * Full-width bar docked directly under the fixed header (same height,
 * `top-16`/`h-16`, matching `<Header>`'s own footprint), slides down on
 * mount. Only rendered by the server when no `ga_consent` cookie exists yet
 * (see `[lang]/(site)/layout.tsx`) — GTM is already loading by default at
 * that point, so this is a notice + opt-out, not a blocking gate:
 *
 *   - Accept  → save "granted", dismiss. (No reload — GTM already running.)
 *   - Decline → save "denied", then full-reload so the root layout omits
 *     the GTM script from here on.
 */
export function AnalyticsConsentBanner({ locale }: AnalyticsConsentBannerProps) {
  const [open, setOpen] = useState(true)
  const copy = COPY[locale] ?? COPY.nl

  function handleAccept() {
    persistConsent('granted')
    setOpen(false)
  }

  function handleDecline() {
    persistConsent('denied')
    window.location.reload()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="region"
          aria-label={copy.accept}
          lang={locale}
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-16 inset-x-0 z-40 flex h-16 items-center border-b border-stone-200/80 bg-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-ink/95"
        >
          <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <p className="flex-1 text-xs leading-snug text-stone-700 sm:text-sm dark:text-white/80">
              {copy.message}{' '}
              <a
                href={copy.privacyHref}
                className="underline underline-offset-2 hover:text-gold"
              >
                {copy.privacyLabel}
              </a>
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleDecline}
                className="rounded-full border border-stone-300 px-3 py-2 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-100 sm:px-4 sm:text-sm dark:border-white/20 dark:text-white/70 dark:hover:bg-white/10"
              >
                {copy.decline}
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="rounded-full bg-gold px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-gold-dark sm:px-4 sm:text-sm"
              >
                {copy.accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
