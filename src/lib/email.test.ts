import { afterEach, describe, expect, it, vi } from 'vitest'
import { getEmailFrom } from './email'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('getEmailFrom', () => {
  it('composes "Name <address>" from EMAIL_FROM + EMAIL_FROM_NAME', () => {
    vi.stubEnv('EMAIL_FROM', 'info@puurugandareizen.nl')
    vi.stubEnv('EMAIL_FROM_NAME', 'Puur Uganda Reizen')
    expect(getEmailFrom()).toBe('Puur Uganda Reizen <info@puurugandareizen.nl>')
  })

  it('returns the bare address when no display name is set', () => {
    vi.stubEnv('EMAIL_FROM', 'info@puurugandareizen.nl')
    vi.stubEnv('EMAIL_FROM_NAME', '')
    expect(getEmailFrom()).toBe('info@puurugandareizen.nl')
  })

  it('uses a legacy combined EMAIL_FROM as-is and ignores EMAIL_FROM_NAME', () => {
    vi.stubEnv('EMAIL_FROM', 'Puur Safaris <info@puurugandareizen.nl>')
    vi.stubEnv('EMAIL_FROM_NAME', 'Should Be Ignored')
    expect(getEmailFrom()).toBe('Puur Safaris <info@puurugandareizen.nl>')
  })

  it('trims surrounding whitespace on both parts', () => {
    vi.stubEnv('EMAIL_FROM', '  info@puurugandareizen.nl  ')
    vi.stubEnv('EMAIL_FROM_NAME', '  Puur Uganda Reizen  ')
    expect(getEmailFrom()).toBe('Puur Uganda Reizen <info@puurugandareizen.nl>')
  })

  it('returns undefined when EMAIL_FROM is missing (keeps the not-configured guard working)', () => {
    vi.stubEnv('EMAIL_FROM', '')
    expect(getEmailFrom()).toBeUndefined()
  })
})
