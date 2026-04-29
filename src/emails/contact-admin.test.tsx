import { describe, it, expect } from 'vitest'
import { render } from '@react-email/render'
import { ContactAdminEmail } from './contact-admin'

describe('ContactAdminEmail', () => {
  it('renders sender info, message body, and reply mailto link', async () => {
    const html = await render(
      <ContactAdminEmail
        naam="Sarah de Boer"
        email="sarah@example.com"
        telefoon="+31612345678"
        onderwerp="Informatie over safari"
        bericht="Ik wil graag meer weten over de gorilla trek in Bwindi."
      />,
    )
    expect(html).toContain('Sarah de Boer')
    expect(html).toContain('sarah@example.com')
    expect(html).toContain('+31612345678')
    expect(html).toContain('Informatie over safari')
    expect(html).toContain('Ik wil graag meer weten over de gorilla trek in Bwindi.')
    expect(html).toContain('mailto:sarah@example.com')
  })

  it('renders the reiscontext table when entries are provided', async () => {
    const html = await render(
      <ContactAdminEmail
        naam="Jan"
        email="jan@example.com"
        onderwerp="Eigen Reisschema Aanvraag"
        bericht="Bwindi en Queen Elizabeth, 14 dagen, comfort lodges en mid-range tented camps zijn perfect."
        reiscontext={[
          { label: 'Bestemmingen', value: 'Bwindi, Queen Elizabeth' },
          { label: 'Periode & duur', value: 'Augustus, 14 dagen' },
        ]}
        reiscontextTitle="Reisdetails"
        berichtTitle="Extra wensen"
      />,
    )
    expect(html).toContain('Reisdetails')
    expect(html).toContain('Bwindi, Queen Elizabeth')
    expect(html).toContain('Augustus, 14 dagen')
    // berichtTitle is rendered uppercased
    expect(html).toContain('EXTRA WENSEN')
  })

  it('omits the reiscontext block when not provided', async () => {
    const html = await render(
      <ContactAdminEmail
        naam="Jan"
        email="jan@example.com"
        onderwerp="Vraag"
        bericht="Een korte vraag over jullie reizen naar Oeganda en Rwanda."
      />,
    )
    expect(html).not.toContain('Reisdetails')
    expect(html).not.toContain('Reiscontext')
  })
})
