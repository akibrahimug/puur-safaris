/**
 * Analytics consent cookie — shared between server (root layout, decides
 * whether to render the GTM script) and client (the consent banner, which
 * writes the visitor's choice).
 *
 * No saved value = first visit / no decision yet: the site tracks by default
 * (GTM loads) and shows the banner. "denied" is the only value that turns
 * tracking off; "granted" just silences the banner on repeat visits.
 */
export const GA_CONSENT_COOKIE = 'ga_consent'
export const GA_CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 // 1 year

export type ConsentValue = 'granted' | 'denied'
