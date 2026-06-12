/**
 * Resolve the same-origin path to the equivalent page in `targetLocale`.
 *
 * Slugs differ per locale, so we read the authored
 * `<link rel="alternate" hreflang>` from the document head (the same source SEO
 * uses) rather than naively swapping the path prefix. Those hrefs are ABSOLUTE
 * and built from `getBaseUrl()`, which falls back to `http://localhost:3000`
 * when site-URL env vars are unset (dev, and any misconfigured deploy) — so we
 * keep only the path + query + hash and let the caller navigate relative to the
 * visitor's actual origin. That guarantees a locale switch can never bounce the
 * visitor to localhost or some other host.
 *
 * Falls back to the target-locale home page when no alternate is present.
 * Client-only (reads the DOM); returns the home fallback during SSR.
 */
export function localeAlternatePath(targetLocale: string): string {
  const fallback = `/${targetLocale}`
  if (typeof document === 'undefined' || typeof window === 'undefined') return fallback

  const href = document
    .querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${targetLocale}"]`)
    ?.getAttribute('href')
  if (!href) return fallback

  try {
    // Resolve against the current origin, then strip the host back off.
    const url = new URL(href, window.location.origin)
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}
