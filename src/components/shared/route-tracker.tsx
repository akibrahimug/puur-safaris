'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackEvent } from '@/lib/analytics/gtm'

/**
 * Fires a `pageview` dataLayer event on every App Router navigation,
 * including client-side (soft) route changes. GTM's built-in "History
 * Change" trigger can miss or double-count SPA navigations, so pageviews are
 * pushed explicitly here — set a GTM trigger listening for the `pageview`
 * custom event instead.
 */
export function RouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams.toString()
    trackEvent('pageview', { page_path: query ? `${pathname}?${query}` : pathname })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  return null
}
