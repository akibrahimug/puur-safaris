import { describe, it, expect } from 'vitest'
import { render } from '@react-email/render'
import { ContactConfirmEmail } from './contact-confirm'

describe('ContactConfirmEmail', () => {
  it('renders to HTML containing the recipient name and message', async () => {
    const html = await render(
      <ContactConfirmEmail
        naam="Sarah de Boer"
        onderwerp="Informatie over safari"
        bericht="Ik wil graag meer weten over de gorilla trek in Bwindi."
      />,
    )
    expect(html).toContain('Sarah de Boer')
    expect(html).toContain('Ik wil graag meer weten over de gorilla trek in Bwindi.')
    // Standard contact heading copy
    expect(html).toContain('Uw bericht is ontvangen')
  })

  it('uses the eigen-reisschema heading variant when isEigenReisschema is true', async () => {
    const html = await render(
      <ContactConfirmEmail
        naam="Jan"
        onderwerp="Eigen Reisschema Aanvraag"
        bericht="Bwindi en Queen Elizabeth, 14 dagen, comfort lodges."
        isEigenReisschema
      />,
    )
    expect(html).toContain('reisschema')
    // Echoes the message even on the variant copy
    expect(html).toContain('Bwindi en Queen Elizabeth, 14 dagen, comfort lodges.')
  })
})
