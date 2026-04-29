import { test, expect, type Page } from '@playwright/test'
import {
  mockBookingError,
  mockBookingSuccess,
} from './helpers/mock-apis'
import { getFirstSafariSlug } from './helpers/fill-form'

const PREFERRED_SLUG = '22-dagen-diep-in-oeganda'
let bookingUrl = ''

test.beforeAll(async ({ browser }) => {
  // Resolve the booking URL once so each spec doesn't re-scrape /en/safaris.
  // Try the preferred slug first; fall back to the first card on /en/safaris.
  const ctx = await browser.newContext()
  const page = await ctx.newPage()

  const candidate = `/en/safaris/${PREFERRED_SLUG}/book`
  const resp = await page.goto(candidate, { waitUntil: 'commit' })
  if (resp && resp.status() < 400) {
    bookingUrl = candidate
  } else {
    const slug = await getFirstSafariSlug(page)
    bookingUrl = slug ? `/en/safaris/${slug}/book` : ''
  }
  await ctx.close()
})

test.beforeEach(async () => {
  test.skip(!bookingUrl, 'No safari slug available — listing page is empty')
})

async function fillStep1Flexible(page: Page) {
  // Step 1: tick the "Flexible date" checkbox so we don't need to drive
  // the date-picker UI.
  await page.getByRole('checkbox', { name: /flexible date/i }).click()
}

async function fillStep2Required(page: Page) {
  await page.getByPlaceholder('John', { exact: true }).fill('Jane')
  await page.getByPlaceholder('Smith', { exact: true }).fill('Tester')
  await page.getByPlaceholder('john@example.com').fill('jane@example.com')

  // Birthdate uses a react-day-picker popover. Open the trigger, then
  // click the first non-disabled day button. v9 renders each day as a
  // <button> inside a [role="gridcell"]. We scope to button cells to
  // avoid matching the "Next"/"Previous" navigation buttons in the
  // calendar header.
  // The trigger button shows the placeholder text when no date is set.
  // The placeholder defaults to `d?.fieldBirthdate` (EN: "Date of birth",
  // NL: "Geboortedatum"). Match either.
  const trigger = page.getByRole('button', {
    name: /^(date of birth|geboortedatum|selecteer geboortedatum)$/i,
  })
  await trigger.first().click()
  const day = page
    .locator('[role="gridcell"] button:not([disabled])')
    .first()
  await day.waitFor({ state: 'visible' })
  await day.click()
}

// The Next button label is locale-driven (EN: "Next", NL: "Volgende"). Match
// either so this spec is robust if the test runs against either locale.
const NEXT_BTN = /^(next|volgende)$/i
const STEP3_HEADING = /(details & confirmation|bijzonderheden & bevestiging)/i
const TERMS_LABEL = /(I agree to the travel terms|Ik ga akkoord met de reisvoorwaarden)/i
const CONFIRM_BTN = /confirm booking|boeking bevestigen/i

test.describe('Booking form', () => {
  test('page loads and step 1 is visible', async ({ page }) => {
    await page.goto(bookingUrl)
    await expect(
      page.getByRole('heading', { name: /trip & dates/i }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: NEXT_BTN }),
    ).toBeVisible()
  })

  test('step 1 validation: requires departure date or flexible', async ({ page }) => {
    await page.goto(bookingUrl)
    await page.getByRole('button', { name: NEXT_BTN }).click()

    await expect(
      page.getByText(/Choose a departure date or tick "Flexible date"/i),
    ).toBeVisible()
    // Should still be on step 1 — heading remains visible.
    await expect(
      page.getByRole('heading', { name: /trip & dates/i }),
    ).toBeVisible()
  })

  test('step 2 validation: empty traveller fields show errors', async ({ page }) => {
    await page.goto(bookingUrl)
    await fillStep1Flexible(page)
    await page.getByRole('button', { name: NEXT_BTN }).click()

    // Wait for step 2 to render.
    await expect(
      page.getByRole('heading', { name: /traveller information/i }),
    ).toBeVisible()

    await page.getByRole('button', { name: NEXT_BTN }).click()

    await expect(
      page.getByText(/First name is required \(minimum 2 characters\)/i),
    ).toBeVisible()
    await expect(
      page.getByText(/Last name is required \(minimum 2 characters\)/i),
    ).toBeVisible()
    await expect(
      page.getByText(/Please enter a valid email address/i),
    ).toBeVisible()
    await expect(
      page.getByText(/Date of birth is required/i),
    ).toBeVisible()
  })

  test('happy path → success shows booking number from API', async ({ page }) => {
    const number = 'PS-2026-TEST'
    await mockBookingSuccess(page, number)
    await page.goto(bookingUrl)

    await fillStep1Flexible(page)
    await page.getByRole('button', { name: NEXT_BTN }).click()

    await expect(
      page.getByRole('heading', { name: /traveller information/i }),
    ).toBeVisible()
    await fillStep2Required(page)
    await page.getByRole('button', { name: NEXT_BTN }).click()

    // Step 3: tick terms and confirm.
    await expect(
      page.getByRole('heading', { name: STEP3_HEADING }),
    ).toBeVisible()
    await page
      .getByRole('checkbox', { name: TERMS_LABEL })
      .click()
    await page.getByRole('button', { name: CONFIRM_BTN }).click()

    await expect(
      page.getByRole('heading', { name: /booking requested!/i }),
    ).toBeVisible()
    await expect(page.getByText(number)).toBeVisible()
  })

  test('API error → error state shown, no success', async ({ page }) => {
    await mockBookingError(page, 500)
    await page.goto(bookingUrl)

    await fillStep1Flexible(page)
    await page.getByRole('button', { name: NEXT_BTN }).click()
    await expect(
      page.getByRole('heading', { name: /traveller information/i }),
    ).toBeVisible()
    await fillStep2Required(page)
    await page.getByRole('button', { name: NEXT_BTN }).click()

    await expect(
      page.getByRole('heading', { name: STEP3_HEADING }),
    ).toBeVisible()
    await page
      .getByRole('checkbox', { name: TERMS_LABEL })
      .click()
    await page.getByRole('button', { name: CONFIRM_BTN }).click()

    await expect(
      page.getByText(/Something went wrong\. Please try again or contact us\./i),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /booking requested!/i }),
    ).not.toBeVisible()
  })
})
