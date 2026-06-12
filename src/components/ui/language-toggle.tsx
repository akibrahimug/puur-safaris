'use client'

import { localeAlternatePath } from '@/lib/locale-alternate'

/** The locale this toggle switches TO, given the current one. */
const OTHER_LOCALE: Record<string, 'nl' | 'en'> = { nl: 'en', en: 'nl' }
/** Short label shown in the button — the locale you'll switch to. */
const LOCALE_SHORT: Record<string, string> = { nl: 'NL', en: 'EN' }

interface LanguageToggleProps {
  /** The locale of the page we're currently on. */
  locale: string
  /** Localized aria-label (e.g. "Switch to Dutch") — passed from the dictionary. */
  label?: string
}

/**
 * Manual locale switch sitting next to the theme toggle — an always-available
 * escape hatch independent of the geo/country banner.
 *
 * Deliberately does NOT write the `puur_locale` choice cookie: it's a "view the
 * other market now" action, not a permanent preference. So after switching, the
 * proxy still detects the geo/locale mismatch and the <CountryBanner> appears on
 * the locale we land on (offering to go back), exactly as required.
 *
 * Visually matches <ThemeToggle> (solid green round button). No theme/mounted
 * guard needed — both its styling and its label text are theme-independent.
 */
export function LanguageToggle({ locale, label }: LanguageToggleProps) {
  const target = OTHER_LOCALE[locale] ?? 'en'
  const ariaLabel = label ?? (target === 'en' ? 'View in English' : 'Bekijk in het Nederlands')

  const handleClick = () => {
    // Full navigation so the new locale's <html lang> takes effect. No cookie is
    // set — the banner intentionally still shows on the locale we switch to.
    window.location.href = localeAlternatePath(target)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className="flex h-11 w-11 min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full bg-gold text-xs font-semibold tracking-wide text-white transition-all duration-300 hover:bg-gold-dark active:scale-95 [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
    >
      {LOCALE_SHORT[target]}
    </button>
  )
}
