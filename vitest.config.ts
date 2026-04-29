import { defineConfig } from 'vitest/config'
import path from 'path'

// Vercel's `next build` sets NODE_ENV=production, which propagates into the
// prebuild test step. Under that flag React 19 strips `React.act` from its
// production bundle and `@testing-library/react` blows up on every render.
// Vitest only defaults NODE_ENV to "test" when unset, so force it here.
Object.assign(process.env, { NODE_ENV: 'test' })

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
