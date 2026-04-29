import { test, expect, type Page } from '@playwright/test'
import { mockContactError, mockContactSuccess } from './helpers/mock-apis'

const URL = '/en/custom-itinerary'

async function selectFirstDestination(page: Page) {
  // Destination tiles render a <button aria-pressed> inside the
  // "Where do you want to go?" step heading, then a heading per dest.
  // The header has its own aria-pressed buttons (theme toggle), so we
  // scope the lookup to <main> first.
  const main = page.getByRole('main')
  const tile = main.locator('button[aria-pressed]').first()
  await tile.waitFor({ state: 'visible' })
  await tile.click()
  await expect(tile).toHaveAttribute('aria-pressed', 'true')
}

async function fillStep2(page: Page) {
  // Period: pick "January" (the first month pill).
  await page.getByRole('button', { name: 'January', exact: true }).click()
  // Group size: pick "Solo".
  await page.getByRole('button', { name: 'Solo', exact: true }).click()
  // Accommodation: pick "Mid-range".
  await page.getByRole('button', { name: 'Mid-range', exact: true }).click()
}

async function fillStep3(page: Page) {
  await page.getByPlaceholder('John Smith').fill('Jane Tester')
  await page.getByPlaceholder('john@example.com').fill('jane@example.com')
}

test.describe('Trip-builder form (custom itinerary)', () => {
  test('page loads and step 1 is rendered', async ({ page }) => {
    await page.goto(URL)
    await expect(
      page.getByRole('heading', { name: /where do you want to go\?/i }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeVisible()
  })

  test('step 1 validation: cannot advance without a destination', async ({ page }) => {
    await page.goto(URL)
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(
      page.getByText(/Select at least one destination/i),
    ).toBeVisible()
    // Still on step 1.
    await expect(
      page.getByRole('heading', { name: /where do you want to go\?/i }),
    ).toBeVisible()
  })

  test('step 2 validation: requires period, group size, accommodation', async ({ page }) => {
    await page.goto(URL)
    await selectFirstDestination(page)
    await page.getByRole('button', { name: 'Next', exact: true }).click()

    await expect(
      page.getByRole('heading', { name: /tell us about your trip/i }),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Next', exact: true }).click()

    await expect(page.getByText(/Choose a travel period/i)).toBeVisible()
    await expect(page.getByText(/Choose a group size/i)).toBeVisible()
    await expect(
      page.getByText(/Choose an accommodation preference/i),
    ).toBeVisible()
  })

  test('happy path → 200 → success heading visible', async ({ page }) => {
    await mockContactSuccess(page)
    await page.goto(URL)

    await selectFirstDestination(page)
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(
      page.getByRole('heading', { name: /tell us about your trip/i }),
    ).toBeVisible()

    await fillStep2(page)
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(
      page.getByRole('heading', { name: /your details/i }),
    ).toBeVisible()

    await fillStep3(page)
    await page.getByRole('button', { name: /submit request/i }).click()

    // EN heading is "Request received!"; the NL fallback would be "Aanvraag ontvangen!".
    await expect(
      page.getByRole('heading', {
        name: /request received!|Aanvraag ontvangen!/i,
      }),
    ).toBeVisible()
  })

  test('API error → error message shown, form data preserved', async ({ page }) => {
    await mockContactError(page, 500)
    await page.goto(URL)

    await selectFirstDestination(page)
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await fillStep2(page)
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await fillStep3(page)
    await page.getByRole('button', { name: /submit request/i }).click()

    await expect(
      page.getByText(
        /Something went wrong\. Please try again or send us an email\./i,
      ),
    ).toBeVisible()

    // Form values should still be filled.
    await expect(page.getByPlaceholder('John Smith')).toHaveValue('Jane Tester')
    await expect(page.getByPlaceholder('john@example.com')).toHaveValue(
      'jane@example.com',
    )
  })
})
