'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'

// CTA text is shown in the TARGET locale (so the visitor can read it). Keep
// these here as a constant — they're a tiny, static, two-locale set and don't
// belong in the CMS or per-page dictionaries.
const BANNER_LABELS: Record<string, { switchCta: string; dismissLabel: string }> = {
  nl: { switchCta: 'Bekijk in het Nederlands', dismissLabel: 'Sluit melding' },
  en: { switchCta: 'View in English', dismissLabel: 'Dismiss' },
}

const DISMISS_KEY = 'puur:lang-banner-dismissed'

interface LanguageMismatchBannerProps {
  currentLocale: string
}

/**
 * Self-served alternative to relying on Chrome's "Translate this page?" prompt.
 *
 * The proxy already routes most visitors to their preferred locale on first
 * visit, but edge cases (shared links, old bookmarks, direct hits to /nl from
 * a non-Dutch speaker) still happen. When that happens we'd rather offer our
 * authored, glossary-protected translation than let Google Translate machine-
 * translate the page in place.
 *
 * Logic:
 *   1. Read the visitor's preferred languages from `navigator.languages`.
 *   2. If their top choice matches the current page locale → no banner.
 *   3. Otherwise look at the `<link rel="alternate" hreflang="...">` tags
 *      already emitted by `buildMetadata` and find one matching a preferred
 *      language.
 *   4. If found, render a one-click banner linking to that authored URL.
 *   5. Dismissal persists in localStorage so it doesn't nag on every page.
 *
 * Reads from the rendered <link> tags rather than taking alternates as a prop
 * so it works on every page without per-page wiring — the same hreflang setup
 * that powers SEO is reused as the data source.
 */
export function LanguageMismatchBanner({ currentLocale }: LanguageMismatchBannerProps) {
  const [target, setTarget] = useState<{ lang: string; url: string } | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem(DISMISS_KEY) === '1') {
      setDismissed(true)
      return
    }

    // Visitor's ranked language preferences, normalised to base codes
    // ("en-US" → "en"). Falls back to the single `navigator.language` on
    // browsers that don't expose `languages` (older Safari).
    const prefs = navigator.languages?.length ? navigator.languages : [navigator.language]
    const preferredBase = prefs.map((l) => l.split('-')[0]?.toLowerCase()).filter(Boolean)

    if (preferredBase[0] === currentLocale) return

    // Pull authored alternates from the head — same source SEO uses, no
    // separate wiring required.
    const alternates = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]'))
      .map((el) => ({
        lang: el.getAttribute('hreflang')?.toLowerCase() ?? '',
        url: el.getAttribute('href') ?? '',
      }))
      .filter((a) => a.lang && a.url && a.lang !== 'x-default' && a.lang !== currentLocale)

    // Prefer the visitor's TOP language; fall back to any preferred match.
    const match =
      alternates.find((a) => a.lang === preferredBase[0]) ??
      alternates.find((a) => preferredBase.includes(a.lang))

    if (match && BANNER_LABELS[match.lang]) {
      setTarget(match)
    }
  }, [currentLocale])

  if (!target || dismissed) return null

  const labels = BANNER_LABELS[target.lang]

  return (
    <div
      role="region"
      // The region's contents are in the target language; declare it so
      // screen readers pronounce the CTA correctly.
      lang={target.lang}
      aria-label={labels.switchCta}
      className="fixed left-1/2 -translate-x-1/2 bottom-4 z-[60] max-w-[min(calc(100%-1rem),28rem)] w-auto rounded-full border border-stone-200/80 bg-white text-stone-900 shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:bg-ink dark:text-white dark:border-white/10 backdrop-blur-md"
    >
      <div className="flex items-center gap-1 pl-4 pr-1.5 py-1.5">
        <a
          href={target.url}
          className="flex items-center gap-1.5 text-sm font-medium text-stone-900 dark:text-white hover:text-gold dark:hover:text-gold transition-colors"
        >
          {labels.switchCta}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem(DISMISS_KEY, '1')
            setDismissed(true)
          }}
          aria-label={labels.dismissLabel}
          className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
