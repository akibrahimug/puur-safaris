import { describe, it, expect } from 'vitest'
import { render } from '@react-email/render'
import { BookingAdminEmail } from './booking-admin'

describe('BookingAdminEmail', () => {
  it('renders the booking number, traveller names, and trip title', async () => {
    const html = await render(
      <BookingAdminEmail
        bookingNumber="PS-2026-A1B2"
        tripTitle="Gorilla Trek Bwindi"
        tripSlug="gorilla-trek-bwindi"
        vertrekdatum="2026-08-15"
        retourdatum="2026-08-25"
        aantalVolwassenen={2}
        aantalKinderen={1}
        voornaam="Sarah"
        achternaam="de Boer"
        email="sarah@example.com"
        telefoon="+31612345678"
        geboortedatum="1990-01-01"
        nationaliteit="Nederlandse"
      />,
    )
    expect(html).toContain('PS-2026-A1B2')
    expect(html).toContain('Sarah')
    expect(html).toContain('de Boer')
    expect(html).toContain('Gorilla Trek Bwindi')
    expect(html).toContain('sarah@example.com')
  })

  it('falls back to "Flexibel / n.v.t." when retourdatum is omitted', async () => {
    const html = await render(
      <BookingAdminEmail
        bookingNumber="PS-2026-XXXX"
        tripTitle="Test Trip"
        tripSlug="test"
        vertrekdatum="2026-08-15"
        aantalVolwassenen={1}
        aantalKinderen={0}
        voornaam="Jan"
        achternaam="Janssen"
        email="jan@example.com"
        geboortedatum="1980-01-01"
      />,
    )
    expect(html).toContain('Flexibel')
  })
})
