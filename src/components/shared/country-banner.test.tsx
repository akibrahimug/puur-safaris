import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CountryBanner } from './country-banner'

// Helpers ---------------------------------------------------------------------

function setHreflangAlternates(alternates: Array<{ lang: string; url: string }>) {
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove())
  for (const a of alternates) {
    const link = document.createElement('link')
    link.setAttribute('rel', 'alternate')
    link.setAttribute('hreflang', a.lang)
    link.setAttribute('href', a.url)
    document.head.appendChild(link)
  }
}

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

// Tests -----------------------------------------------------------------------

describe('CountryBanner', () => {
  beforeEach(() => {
    clearCookies()
    setHreflangAlternates([])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the target-language message and CTA (en target on /nl)', () => {
    render(<CountryBanner currentLocale="nl" targetLocale="en" />)
    expect(screen.getByText(/visiting from outside the Netherlands/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'View in English' })).toBeInTheDocument()
  })

  it('renders Dutch copy when the target is nl (Dutch visitor on /en)', () => {
    render(<CountryBanner currentLocale="en" targetLocale="nl" />)
    expect(screen.getByText(/vanuit Nederland te bezoeken/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bekijk in het Nederlands' })).toBeInTheDocument()
  })

  it('switching saves the TARGET locale for a year and navigates same-origin (strips the alternate host)', async () => {
    // Alternate points at a DIFFERENT absolute host (mimics getBaseUrl() →
    // localhost or a misconfigured deploy). The banner must keep only the path.
    setHreflangAlternates([
      { lang: 'en', url: 'http://localhost:3000/en/contact?ref=x#top' },
      { lang: 'nl', url: 'http://localhost:3000/nl/contact' },
    ])
    const assign = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { href: '', origin: 'https://www.puurugandareizen.nl', assign },
      configurable: true,
      writable: true,
    })

    render(<CountryBanner currentLocale="nl" targetLocale="en" />)
    await userEvent.click(screen.getByRole('button', { name: 'View in English' }))

    expect(getCookie('puur_locale')).toBe('en')
    // Path + query + hash, no host — stays on the visitor's origin.
    expect(window.location.href).toBe('/en/contact?ref=x#top')
    expect(window.location.href).not.toContain('localhost')
  })

  it('dismissing saves the CURRENT locale (stay) and hides the banner', async () => {
    render(<CountryBanner currentLocale="nl" targetLocale="en" />)
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))

    expect(getCookie('puur_locale')).toBe('nl')
    expect(screen.queryByText(/visiting from outside the Netherlands/i)).not.toBeInTheDocument()
  })

  it('falls back to the target-locale home when no alternate link exists', async () => {
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      configurable: true,
      writable: true,
    })
    render(<CountryBanner currentLocale="en" targetLocale="nl" />)
    await userEvent.click(screen.getByRole('button', { name: 'Bekijk in het Nederlands' }))
    expect(window.location.href).toBe('/nl')
  })
})
