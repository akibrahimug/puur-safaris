/**
 * Google Tag Manager — dataLayer helper.
 *
 * GTM itself is loaded via a `beforeInteractive` script in the root layout
 * (`src/app/layout.tsx`), gated by the `ga_consent` cookie (see
 * `src/lib/analytics/consent.ts`). This module only pushes events; it never
 * touches the script tag, so it's safe to import from any client component
 * regardless of whether GTM ended up loading for this visitor.
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

/**
 * Push a custom event to the GTM dataLayer. A no-op on the server and when
 * GTM never loaded (declined consent, missing env var) — `window.dataLayer`
 * just accumulates unread entries with no network effect in that case.
 */
export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
}
