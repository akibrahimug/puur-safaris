import { afterEach, describe, expect, it } from 'vitest'
import { trackEvent } from './gtm'

afterEach(() => {
  // @ts-expect-error — test cleanup of a global we don't otherwise touch
  delete window.dataLayer
})

describe('trackEvent', () => {
  it('creates window.dataLayer on first call', () => {
    expect(window.dataLayer).toBeUndefined()
    trackEvent('contact_form_submit')
    expect(Array.isArray(window.dataLayer)).toBe(true)
  })

  it('pushes an object with the event name and given params', () => {
    trackEvent('booking_form_submit', { trip_slug: 'gorilla-trek', booking_number: 'PUR-1' })
    expect(window.dataLayer).toContainEqual({
      event: 'booking_form_submit',
      trip_slug: 'gorilla-trek',
      booking_number: 'PUR-1',
    })
  })

  it('appends to an existing dataLayer instead of replacing it', () => {
    trackEvent('pageview', { page_path: '/nl' })
    trackEvent('pageview', { page_path: '/nl/contact' })
    expect(window.dataLayer).toHaveLength(2)
  })

  it('defaults params to an empty object when omitted', () => {
    trackEvent('blog_submission')
    expect(window.dataLayer).toContainEqual({ event: 'blog_submission' })
  })
})
