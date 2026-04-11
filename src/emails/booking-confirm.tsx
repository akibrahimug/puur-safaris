import { Text, Section, Hr } from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/layout'
import { CtaButton } from './components/cta-button'
import { colors, fonts } from './tokens'

interface BookingConfirmEmailProps {
  voornaam: string
  tripTitle: string
  bookingNumber: string
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puursafaris.nl'

export function BookingConfirmEmail({
  voornaam,
  tripTitle,
  bookingNumber,
}: BookingConfirmEmailProps) {
  return (
    <EmailLayout
      preview={`Bevestiging boekingsaanvraag: ${tripTitle}`}
      heading="Uw boeking is ontvangen"
      subheading={`Boekingsaanvraag voor ${tripTitle}`}
    >
      <Text style={greeting}>Beste {voornaam},</Text>
      <Text style={paragraph}>
        Bedankt voor uw interesse in een safari ervaring met Puur Safaris. Wij
        hebben uw boekingsaanvraag voor <strong>{tripTitle}</strong> in goede
        orde ontvangen.
      </Text>

      {/* Booking number card */}
      <Section style={bookingCard}>
        <Text style={bookingLabel}>UW BOEKINGSNUMMER</Text>
        <Text style={bookingNumber_style}>{bookingNumber}</Text>
        <Hr style={cardDivider} />
        <Text style={bookingNote}>
          Bewaar dit nummer goed — u heeft het nodig om later een reisverslag in
          te dienen op onze website.
        </Text>
      </Section>

      <Text style={paragraph}>
        Ons team neemt binnen <strong>2 werkdagen</strong> persoonlijk contact
        met u op om uw reis samen te plannen en alle details te bespreken.
      </Text>

      <Section style={ctaContainer}>
        <CtaButton href={`${siteUrl}/safaris`}>
          Bekijk onze reizen
        </CtaButton>
      </Section>

      <Text style={signoff}>
        Met vriendelijke groet,
        <br />
        <strong style={{ color: colors.text }}>Het Puur Safaris Team</strong>
      </Text>
    </EmailLayout>
  )
}

const greeting: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: colors.text,
  fontFamily: fonts.primary,
  fontWeight: 400,
  margin: '0 0 16px 0',
}

const paragraph: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: colors.textSecondary,
  fontFamily: fonts.primary,
  margin: '0 0 20px 0',
}

const bookingCard: React.CSSProperties = {
  backgroundColor: colors.bgAccent,
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  padding: '28px 24px',
  textAlign: 'center' as const,
  margin: '28px 0',
}

const bookingLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 600,
  color: colors.textMuted,
  fontFamily: fonts.primary,
  textTransform: 'uppercase' as const,
  letterSpacing: '2px',
  margin: '0 0 8px 0',
}

const bookingNumber_style: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 700,
  color: colors.primary,
  fontFamily: fonts.primary,
  margin: '0 0 16px 0',
  letterSpacing: '3px',
}

const cardDivider: React.CSSProperties = {
  borderColor: colors.border,
  margin: '0 0 16px 0',
}

const bookingNote: React.CSSProperties = {
  fontSize: '12px',
  color: colors.textMuted,
  fontFamily: fonts.primary,
  margin: 0,
  lineHeight: '1.5',
}

const ctaContainer: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const signoff: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: colors.textMuted,
  fontFamily: fonts.primary,
  margin: '28px 0 0 0',
}

export default BookingConfirmEmail
