import { test, expect, type Page } from '@playwright/test'
import {
  mockBlogSubmitError,
  mockBlogSubmitSuccess,
} from './helpers/mock-apis'
import { TEST_IMAGE } from './helpers/fill-form'

const URL = '/en/blog/submit'

/**
 * Tick the two native-required legal-consent checkboxes. They sit at the
 * bottom of the form and must be checked before the browser will fire
 * `submit`, regardless of any React-side validation. Both checkboxes have
 * `required` so we use `check()` (not `click()`) to satisfy validity.
 */
async function tickLegalConsents(page: Page) {
  const consents = page.locator('input[type="checkbox"][required]')
  const count = await consents.count()
  for (let i = 0; i < count; i++) {
    await consents.nth(i).check()
  }
}

/**
 * Fill the form completely so it passes React-side validation. The form
 * uses an "edit" toggle pattern — title/author/intro/section fields render
 * read-only by default and become inputs only after clicking the pencil
 * EditBtn.
 */
async function fillFormCompletely(page: Page) {
  // Verification bar (always visible inputs)
  await page.locator('#bsf-bookingNumber').fill('PS-2026-AB12')
  await page.locator('#bsf-email').fill('blogger@example.com')

  // Hero image
  await page
    .locator('input[type="file"]')
    .nth(0)
    .setInputFiles(TEST_IMAGE)

  // Author photo (third file input — see hiddenInputs order: hero, author, gallery)
  await page
    .locator('input[type="file"]')
    .nth(1)
    .setInputFiles(TEST_IMAGE)

  // Gallery (multiple)
  await page
    .locator('input[type="file"]')
    .nth(2)
    .setInputFiles([TEST_IMAGE])

  // Title block — toggle edit mode via the EditBtn inside the
  // `[data-field="title"]` wrapper, then fill the input.
  await page
    .locator('[data-field="title"] button[title="Edit"]')
    .click()
  await page
    .locator('input[placeholder="Your story title..."]')
    .fill('My Uganda Adventure')

  // Author card (data-field="authorPhoto") — has both name + bio editors.
  await page
    .locator('[data-field="authorPhoto"] button[title="Edit"]')
    .click()
  await page
    .locator('input[placeholder="Your full name"]')
    .fill('Jane Tester')
  await page
    .locator(
      'textarea[placeholder="Tell us a bit about yourself and why you are sharing this story..."]',
    )
    .fill('Travel-loving software tester from Amsterdam.')

  // Intro
  await page
    .locator('[data-field="intro"] button[title="Edit"]')
    .click()
  await page
    .locator(
      'textarea[placeholder="Start your story with a captivating introduction..."]',
    )
    .fill(
      'Our 14-day Uganda safari was unforgettable from the very first morning game drive.',
    )

  // Sections — 3 of them. Each section wrapper has data-field=section_<idx>_title
  // and contains 2 EditBtns (title, body in order). The EditBtn `title`
  // attr flips from "Edit" to "Done editing" once active, so we can't
  // re-query by `[title="Edit"]` after clicking the first one. Match
  // either label.
  for (let i = 0; i < 3; i++) {
    const section = page.locator(`[data-field="section_${i}_title"]`)
    const editBtns = section.locator(
      'button[title="Edit"], button[title="Done editing"]',
    )
    await editBtns.nth(0).click()
    await section
      .locator('input[placeholder="Section title..."]')
      .fill(`Day ${i + 1}: Highlights`)
    await editBtns.nth(1).click()
    await section
      .locator('textarea[placeholder="Write your story here..."]')
      .fill(
        `On day ${i + 1} we visited a national park and saw amazing wildlife up close.`,
      )
  }
}

test.describe('Blog submission form', () => {
  test('page loads and required form fields render', async ({ page }) => {
    await page.goto(URL)
    await expect(
      page.getByRole('button', {
        name: /Submit Travel Report|Send Travel Report|Verstuur (Jouw|je) Verhaal/i,
      }),
    ).toBeVisible()
    await expect(page.locator('#bsf-bookingNumber')).toBeVisible()
    await expect(page.locator('#bsf-email')).toBeVisible()
  })

  test('validation: consent ticked + empty submit shows React errors', async ({ page }) => {
    let apiHits = 0
    await page.route('**/api/blog/submit', (route) => {
      apiHits++
      return route.fulfill({ status: 200, body: '{}' })
    })

    await page.goto(URL)
    await tickLegalConsents(page)
    await page.getByRole('button', {
        name: /Submit Travel Report|Send Travel Report|Verstuur (Jouw|je) Verhaal/i,
      }).click()

    // Multiple inline FieldError <p> elements should appear.
    await expect(
      page.locator('p[class*="text-red"]').first(),
    ).toBeVisible()
    const count = await page.locator('p[class*="text-red"]').count()
    expect(count, 'at least one validation error should be visible').toBeGreaterThan(0)
    expect(apiHits, 'API must not be called when validation fails').toBe(0)
  })

  test('happy path → 200 → success heading', async ({ page }) => {
    await mockBlogSubmitSuccess(page)
    await page.goto(URL)
    await fillFormCompletely(page)
    await tickLegalConsents(page)

    await page.getByRole('button', {
        name: /Submit Travel Report|Send Travel Report|Verstuur (Jouw|je) Verhaal/i,
      }).click()

    await expect(
      page.getByRole('heading', { name: /thank you for your submission!/i }),
    ).toBeVisible({ timeout: 15_000 })
  })

  test('API error → error message shown, form preserved', async ({ page }) => {
    await mockBlogSubmitError(page, 500)
    await page.goto(URL)
    await fillFormCompletely(page)
    await tickLegalConsents(page)

    await page.getByRole('button', {
        name: /Submit Travel Report|Send Travel Report|Verstuur (Jouw|je) Verhaal/i,
      }).click()

    // The form catches the error via `result.error || 'Er is iets misgegaan.'`
    // The route returns { error: 'Mocked failure' } so that's the visible text.
    await expect(page.getByText(/Mocked failure/i)).toBeVisible({
      timeout: 15_000,
    })

    // Booking number must still be present.
    await expect(page.locator('#bsf-bookingNumber')).toHaveValue('PS-2026-AB12')
  })
})
