import type { Page } from '@playwright/test'
import path from 'node:path'

export const FIXTURE_DIR = path.join(__dirname, '..', 'fixtures')
export const TEST_IMAGE = path.join(FIXTURE_DIR, 'test-image.png')

/**
 * Fetch the first published safari trip slug by scraping the
 * `/en/safaris` listing page. Returns `null` if no card link is found.
 *
 * Used by the booking spec so it doesn't hard-pin to a CMS slug that
 * may have been renamed/unpublished.
 */
export async function getFirstSafariSlug(page: Page): Promise<string | null> {
  await page.goto('/en/safaris')
  const link = page.locator('a[href*="/en/safaris/"]').first()
  const count = await link.count()
  if (count === 0) return null
  const href = await link.getAttribute('href')
  if (!href) return null
  // Strip prefix → "22-dagen-diep-in-oeganda"
  const match = href.match(/\/en\/safaris\/([^/?#]+)/)
  return match?.[1] ?? null
}

/**
 * Pick the first non-empty option from a `<select>` (skips the
 * placeholder, which uses an empty string as `value`).
 */
export async function selectFirstRealOption(page: Page, selector: string) {
  const values = await page
    .locator(`${selector} option`)
    .evaluateAll((opts) => (opts as HTMLOptionElement[]).map((o) => o.value))
  const real = values.find((v) => v !== '')
  if (!real) throw new Error(`No real option found in ${selector}`)
  await page.locator(selector).selectOption(real)
  return real
}
