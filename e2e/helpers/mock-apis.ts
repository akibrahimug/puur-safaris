import type { Page, Route } from '@playwright/test'

/**
 * Helpers that intercept the public form API routes so E2E tests
 * never hit Resend / Sanity / external services.
 *
 * Use these in `test.beforeEach` (or per test) before navigating to a
 * page that submits to that endpoint.
 */

const json = (status: number, body: unknown) => (route: Route) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  })

// ── Contact ──────────────────────────────────────────────────────────────────

export async function mockContactSuccess(page: Page) {
  await page.route('**/api/contact', json(200, { success: true }))
}

export async function mockContactError(page: Page, status = 500) {
  await page.route('**/api/contact', json(status, { error: 'Mocked failure' }))
}

// ── Booking ──────────────────────────────────────────────────────────────────

export async function mockBookingSuccess(
  page: Page,
  bookingNumber = 'PS-2026-TEST',
) {
  await page.route('**/api/booking', json(200, { success: true, bookingNumber }))
}

export async function mockBookingError(page: Page, status = 500) {
  await page.route('**/api/booking', json(status, { error: 'Mocked failure' }))
}

// ── Blog submission ──────────────────────────────────────────────────────────

export async function mockBlogSubmitSuccess(page: Page) {
  await page.route('**/api/blog/submit', json(200, { success: true, id: 'mock-id' }))
}

export async function mockBlogSubmitError(page: Page, status = 500) {
  await page.route('**/api/blog/submit', json(status, { error: 'Mocked failure' }))
}
