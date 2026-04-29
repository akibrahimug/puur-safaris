import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageMismatchBanner } from './language-mismatch-banner'

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

function mockNavigatorLanguages(langs: string[]) {
  // Patch both `language` and `languages` so the component falls back correctly
  // on browsers that only expose the singular property (older Safari).
  Object.defineProperty(navigator, 'languages', { value: langs, configurable: true })
  Object.defineProperty(navigator, 'language', { value: langs[0] ?? 'nl', configurable: true })
}

// Tests -----------------------------------------------------------------------

describe('LanguageMismatchBanner', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setHreflangAlternates([
      { lang: 'nl', url: 'https://example.com/nl' },
      { lang: 'en', url: 'https://example.com/en' },
      { lang: 'x-default', url: 'https://example.com/nl' },
    ])
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove())
  })

  it('renders nothing when the visitor preferred language matches the current locale', () => {
    mockNavigatorLanguages(['nl-NL', 'nl'])
    render(<LanguageMismatchBanner currentLocale="nl" />)
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('renders the EN switch CTA when an EN visitor lands on /nl', () => {
    mockNavigatorLanguages(['en-US', 'en'])
    render(<LanguageMismatchBanner currentLocale="nl" />)
    const region = screen.getByRole('region')
    expect(region).toBeInTheDocument()
    expect(region).toHaveAttribute('lang', 'en')
    const cta = screen.getByRole('link', { name: /View in English/i })
    expect(cta).toHaveAttribute('href', 'https://example.com/en')
  })

  it('renders the NL switch CTA when a NL visitor lands on /en', () => {
    mockNavigatorLanguages(['nl-BE', 'nl'])
    render(<LanguageMismatchBanner currentLocale="en" />)
    const cta = screen.getByRole('link', { name: /Bekijk in het Nederlands/i })
    expect(cta).toHaveAttribute('href', 'https://example.com/nl')
  })

  it('matches a non-top preferred language when the top one has no authored alternate', () => {
    // Top preference is German (no alternate); fall back to English.
    mockNavigatorLanguages(['de-DE', 'de', 'en-GB', 'en'])
    render(<LanguageMismatchBanner currentLocale="nl" />)
    expect(screen.getByRole('link', { name: /View in English/i })).toBeInTheDocument()
  })

  it('renders nothing when no preferred language has a matching authored alternate', () => {
    mockNavigatorLanguages(['fr-FR', 'fr', 'es-ES', 'es'])
    render(<LanguageMismatchBanner currentLocale="nl" />)
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('renders nothing when the dismissal flag is set in localStorage', () => {
    window.localStorage.setItem('puur:lang-banner-dismissed', '1')
    mockNavigatorLanguages(['en-US', 'en'])
    render(<LanguageMismatchBanner currentLocale="nl" />)
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('persists dismissal in localStorage and hides the banner on click', async () => {
    const user = userEvent.setup()
    mockNavigatorLanguages(['en-US', 'en'])
    render(<LanguageMismatchBanner currentLocale="nl" />)
    const dismiss = screen.getByRole('button', { name: /Dismiss/i })
    await user.click(dismiss)
    expect(window.localStorage.getItem('puur:lang-banner-dismissed')).toBe('1')
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('ignores the x-default alternate', () => {
    // Only x-default and the current locale exist — no real alternate to suggest.
    setHreflangAlternates([
      { lang: 'nl', url: 'https://example.com/nl' },
      { lang: 'x-default', url: 'https://example.com/nl' },
    ])
    mockNavigatorLanguages(['en-US', 'en'])
    render(<LanguageMismatchBanner currentLocale="nl" />)
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })
})
