import { describe, it, expect } from 'vitest'
import { render } from '@react-email/render'
import { BookingConfirmEmail } from './booking-confirm'

describe('BookingConfirmEmail', () => {
  it('renders to HTML containing the customer name, trip title, and booking number', async () => {
    const html = await render(
      <BookingConfirmEmail
        voornaam="Sarah"
        tripTitle="Gorilla Trek Bwindi"
        bookingNumber="PS-2026-A1B2"
      />,
    )
    expect(html).toContain('Sarah')
    expect(html).toContain('Gorilla Trek Bwindi')
    expect(html).toContain('PS-2026-A1B2')
    expect(html).toContain('UW BOEKINGSNUMMER')
  })

  it('reminds the user to keep the booking number for blog submission', async () => {
    const html = await render(
      <BookingConfirmEmail
        voornaam="Jan"
        tripTitle="Queen Elizabeth Safari"
        bookingNumber="PS-2026-ZZZZ"
      />,
    )
    expect(html).toContain('reisverslag')
  })
})
