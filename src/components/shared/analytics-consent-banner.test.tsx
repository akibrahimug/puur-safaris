import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AnalyticsConsentBanner } from './analytics-consent-banner'
import { GA_CONSENT_COOKIE } from '@/lib/analytics/consent'

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function clearCookies() {
  for (const c of document.cookie.split(';')) {
    const eq = c.indexOf('=')
    const name = (eq > -1 ? c.slice(0, eq) : c).trim()
    if (name) document.cookie = `${name}=; path=/; max-age=0`
  }
}

describe('AnalyticsConsentBanner', () => {
  beforeEach(() => {
    clearCookies()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders Dutch copy for locale nl', () => {
    render(<AnalyticsConsentBanner locale="nl" />)
    expect(screen.getByRole('button', { name: 'Accepteren' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Weigeren' })).toBeInTheDocument()
  })

  it('renders English copy for locale en', () => {
    render(<AnalyticsConsentBanner locale="en" />)
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decline' })).toBeInTheDocument()
  })

  it('falls back to Dutch copy for an unknown locale', () => {
    render(<AnalyticsConsentBanner locale="fr" />)
    expect(screen.getByRole('button', { name: 'Accepteren' })).toBeInTheDocument()
  })

  it('Accept saves the granted cookie and dismisses without reloading', async () => {
    const reload = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload },
      configurable: true,
      writable: true,
    })

    render(<AnalyticsConsentBanner locale="en" />)
    await userEvent.click(screen.getByRole('button', { name: 'Accept' }))

    expect(getCookie(GA_CONSENT_COOKIE)).toBe('granted')
    expect(reload).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: 'Accept' })).not.toBeInTheDocument()
  })

  it('Decline saves the denied cookie and reloads the page', async () => {
    const reload = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload },
      configurable: true,
      writable: true,
    })

    render(<AnalyticsConsentBanner locale="en" />)
    await userEvent.click(screen.getByRole('button', { name: 'Decline' }))

    expect(getCookie(GA_CONSENT_COOKIE)).toBe('denied')
    expect(reload).toHaveBeenCalledTimes(1)
  })
})
