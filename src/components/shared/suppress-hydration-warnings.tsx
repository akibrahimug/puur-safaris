'use client'

import { useEffect } from 'react'

/**
 * Suppresses React hydration mismatch warnings caused by Sanity's
 * stega-encoded content and visual editing live updates.
 * Only active in development — production builds are unaffected.
 */
export function SuppressHydrationWarnings() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const originalError = console.error
    console.error = (...args: unknown[]) => {
      const msg = typeof args[0] === 'string' ? args[0] : ''
      if (
        msg.includes('Hydration') ||
        msg.includes('hydrat') ||
        msg.includes('server rendered') ||
        msg.includes('did not match') ||
        msg.includes('Failed to decode stega')
      ) {
        return
      }
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return null
}
