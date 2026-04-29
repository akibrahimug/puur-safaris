import { defineConfig, devices } from '@playwright/test'

// Playwright config for Puur Uganda Reizen E2E suite.
//
// Vitest stays in charge of src/<...>.test.ts(x) (configured in
// vitest.config.ts); Playwright owns everything under e2e/.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Local: 1 retry to absorb Turbopack's first-compile races (Next 16 dev
  // mode compiles each route on first hit). CI gets more retries because
  // cold starts are slower there.
  retries: process.env.CI ? 2 : 1,
  // Local: 2 workers — enough parallelism to keep wall time low without
  // hammering an uncompiled dev server with 10 concurrent route requests
  // (caused first-run flakes). CI runs serial to avoid that race entirely.
  workers: process.env.CI ? 1 : 2,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
