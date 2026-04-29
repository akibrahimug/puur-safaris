import { test, expect } from '@playwright/test'
import { mockContactError, mockContactSuccess } from './helpers/mock-apis'

const URL = '/en/contact'

test.describe('Contact form', () => {
  test('page loads and renders the form', async ({ page }) => {
    await page.goto(URL)
    // Wait for the React-hydrated form (`noValidate` is set on the <form>).
    await expect(
      page.getByRole('button', { name: /send message/i }),
    ).toBeVisible()
    await expect(page.getByPlaceholder('John Smith')).toBeVisible()
  })

  test('blocks submission with empty required fields and shows zod errors', async ({ page }) => {
    await mockContactSuccess(page) // safety: also catches any accidental network call
    await page.goto(URL)

    let apiHits = 0
    await page.route('**/api/contact', (route) => {
      apiHits++
      return route.fulfill({ status: 200, body: JSON.stringify({ success: true }) })
    })

    await page.getByRole('button', { name: /send message/i }).click()

    await expect(
      page.getByText('Please enter your full name (minimum 2 characters)'),
    ).toBeVisible()
    await expect(page.getByText('Please enter a valid email address')).toBeVisible()
    await expect(page.getByText('Please choose a subject')).toBeVisible()
    await expect(
      page.getByText('Your message must be at least 20 characters'),
    ).toBeVisible()

    expect(apiHits, 'API must not be called when validation fails').toBe(0)
  })

  test('happy path → 200 → success state', async ({ page }) => {
    await mockContactSuccess(page)
    await page.goto(URL)

    await page.getByPlaceholder('John Smith').fill('Jane Tester')
    await page.getByPlaceholder('john@example.com').fill('jane@example.com')

    await page
      .locator('select[name="onderwerp"]')
      .selectOption({ label: 'Quote request' })

    await page
      .getByPlaceholder(
        /Tell us about your dream safari, questions, or how we can help you/i,
      )
      .fill(
        'Hello team — I would love a quote for a 14 day Uganda safari for two adults next September.',
      )

    await page.getByRole('button', { name: /send message/i }).click()

    const status = page.getByRole('status').filter({ hasText: 'Message received!' })
    await expect(status).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Message received!' }),
    ).toBeVisible()
  })

  test('API error → error state, form data preserved', async ({ page }) => {
    await mockContactError(page, 500)
    await page.goto(URL)

    const name = 'Persistent Pat'
    const email = 'pat@example.com'
    const message =
      'This message should still be in the textarea after a server error so the user can retry.'

    await page.getByPlaceholder('John Smith').fill(name)
    await page.getByPlaceholder('john@example.com').fill(email)
    await page
      .locator('select[name="onderwerp"]')
      .selectOption({ label: 'Quote request' })
    await page
      .getByPlaceholder(
        /Tell us about your dream safari, questions, or how we can help you/i,
      )
      .fill(message)

    await page.getByRole('button', { name: /send message/i }).click()

    await expect(
      page.getByText(
        /Something went wrong\. Please try again or send us an email directly\./i,
      ),
    ).toBeVisible()

    // Form values must remain so the user can retry.
    await expect(page.getByPlaceholder('John Smith')).toHaveValue(name)
    await expect(page.getByPlaceholder('john@example.com')).toHaveValue(email)
    await expect(
      page.getByPlaceholder(
        /Tell us about your dream safari, questions, or how we can help you/i,
      ),
    ).toHaveValue(message)
  })
})
