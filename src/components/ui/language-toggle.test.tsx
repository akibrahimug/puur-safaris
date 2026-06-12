import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageToggle } from './language-toggle'

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

describe('LanguageToggle', () => {
  beforeEach(() => {
    setHreflangAlternates([])
    document.cookie = 'puur_locale=; path=/; max-age=0'
    Object.defineProperty(window, 'location', {
      value: { href: '', origin: 'https://www.puurugandareizen.nl' },
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => vi.restoreAllMocks())

  it('shows the OTHER locale code (EN while on nl)', () => {
    render(<LanguageToggle locale="nl" />)
    expect(screen.getByRole('button', { name: 'View in English' })).toHaveTextContent('EN')
  })

  it('shows NL while on en', () => {
    render(<LanguageToggle locale="en" />)
    expect(screen.getByRole('button')).toHaveTextContent('NL')
  })

  it('navigates same-origin to the alternate and does NOT set the choice cookie', async () => {
    setHreflangAlternates([
      { lang: 'en', url: 'http://localhost:3000/en/contact' },
      { lang: 'nl', url: 'http://localhost:3000/nl/contact' },
    ])
    render(<LanguageToggle locale="nl" label="Switch to English" />)
    await userEvent.click(screen.getByRole('button'))

    expect(window.location.href).toBe('/en/contact')
    expect(window.location.href).not.toContain('localhost')
    // Toggle is a "view now" action — it must leave the banner free to reappear.
    expect(getCookie('puur_locale')).toBeNull()
  })
})
