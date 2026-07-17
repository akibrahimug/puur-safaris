import { describe, it, expect } from 'vitest'
import { organizationJsonLd } from './seo'

describe('organizationJsonLd', () => {
  it('declares Uganda as the service area', () => {
    const schema = organizationJsonLd({ siteName: 'Puur Uganda Reizen' } as never)
    expect(schema.areaServed).toEqual({ '@type': 'Country', name: 'Uganda' })
  })

  it('exposes a stable @id derived from the base URL', () => {
    const schema = organizationJsonLd(null)
    expect(schema['@id']).toBe(`${schema.url}/#organization`)
  })

  it('falls back to the default site name when settings are missing', () => {
    const schema = organizationJsonLd(null)
    expect(schema.name).toBe('Puur Uganda Reizen')
  })
})
