'use client'

import { useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { localeAlternatePath } from '@/lib/locale-alternate'

/**
 * Copy is shown in the TARGET locale (the one we're suggesting) so the visitor
 * can actually read it. Tiny, static, two-locale set — kept here, not in the
 * CMS or per-page dictionaries.
 */
const COPY: Record<string, { message: string; cta: string; dismiss: string }> = {
  en: {
    message: 'It looks like you’re visiting from outside the Netherlands.',
    cta: 'View in English',
    dismiss: 'Dismiss',
  },
  nl: {
    message: 'Je lijkt ons vanuit Nederland te bezoeken.',
    cta: 'Bekijk in het Nederlands',
    dismiss: 'Melding sluiten',
  },
}

const CHOICE_COOKIE = 'puur_locale'
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

/**
 * Persist the visitor's explicit locale choice for a year. The proxy reads this
 * cookie to (a) never show the banner again and (b) stop auto-routing the
 * visitor away from their chosen locale on future `/` visits.
 */
function persistChoice(locale: string) {
  document.cookie = `${CHOICE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`
}

interface CountryBannerProps {
  /** Locale of the page the visitor is currently on. */
  currentLocale: string
  /** Locale we're suggesting they switch to (their geo/browser preference). */
  targetLocale: string
  /**
   * True when <AnalyticsConsentBanner> is also rendering (occupies
   * top-16..top-32, full width). Shifts this banner below it so the two
   * don't overlap for a first-time visitor who's also on the wrong locale.
   */
  pushDown?: boolean
}

/**
 * Top-of-page banner shown when a visitor lands on the "wrong" locale for their
 * country — e.g. someone outside the Netherlands following a link to /nl, or a
 * Dutch visitor landing on /en. The proxy makes the show/hide decision (geo +
 * the `puur_locale` choice cookie) and passes `targetLocale` down; this
 * component only renders the UI and records the visitor's decision:
 *
 *   - Switch  → save the target locale, navigate to the authored translation.
 *   - Dismiss → save the current locale ("I'll stay here"); never nag again.
 *
 * Both paths write the `puur_locale` cookie, so the banner stops nagging on the
 * locale the visitor settles on. (Navigating back to the other locale re-shows
 * it — that decision lives in the proxy.)
 */
export function CountryBanner({ currentLocale, targetLocale, pushDown }: CountryBannerProps) {
  const [open, setOpen] = useState(true)

  const copy = COPY[targetLocale]
  if (!open || !copy) return null

  const handleSwitch = () => {
    persistChoice(targetLocale)
    // Same-origin path only (never the absolute hreflang host). Full navigation
    // (not client-side) so the new locale's <html lang> and the freshly-set
    // cookie both take effect immediately.
    window.location.href = localeAlternatePath(targetLocale)
  }

  const handleDismiss = () => {
    persistChoice(currentLocale)
    setOpen(false)
  }

  return (
    <div
      role="region"
      // Contents are in the target language; declare it so screen readers
      // pronounce the message and CTA correctly.
      lang={targetLocale}
      aria-label={copy.cta}
      className={`fixed inset-x-3 z-[60] mx-auto flex w-auto max-w-2xl items-center gap-3 rounded-2xl border border-stone-200/80 bg-white/95 px-4 py-3 text-stone-900 shadow-[0_12px_40px_rgba(0,0,0,0.14)] backdrop-blur-md dark:border-white/10 dark:bg-ink/95 dark:text-white sm:gap-4 sm:px-5 ${pushDown ? 'top-36' : 'top-20'}`}
    >
      <p className="flex-1 text-sm leading-snug">{copy.message}</p>
      <button
        type="button"
        onClick={handleSwitch}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-gold-dark"
      >
        {copy.cta}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label={copy.dismiss}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
