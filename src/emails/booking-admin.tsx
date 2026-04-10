import { Text, Hr, Link, Section } from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/layout'
import { InfoTable } from './components/info-table'
import { colors, fonts } from './tokens'

interface BookingAdminEmailProps {
  bookingNumber: string
  tripTitle: string
  tripSlug: string
  vertrekdatum: string
  retourdatum?: string
  aantalVolwassenen: number
  aantalKinderen: number
  voornaam: string
  achternaam: string
  email: string
  telefoon?: string
  geboortedatum: string
  nationaliteit?: string
  paspoortnummer?: string
  dieetwensen?: string
  medischeBijzonderheden?: string
  speciale_verzoeken?: string
  gevonden?: string
}

export function BookingAdminEmail({
  bookingNumber,
  tripTitle,
  vertrekdatum,
  retourdatum,
  aantalVolwassenen,
  aantalKinderen,
  voornaam,
  achternaam,
  email,
  telefoon,
  geboortedatum,
  nationaliteit,
  paspoortnummer,
  dieetwensen,
  medischeBijzonderheden,
  speciale_verzoeken,
  gevonden,
}: BookingAdminEmailProps) {
  return (
    <EmailLayout
      preview={`Nieuwe boeking: ${tripTitle} — ${voornaam} ${achternaam}`}
      heading={`Nieuwe boekingsaanvraag`}
      subheading={`${bookingNumber} · ${voornaam} ${achternaam}`}
    >
      {/* Booking badge */}
      <Section style={badgeContainer}>
        <Text style={badge}>{bookingNumber}</Text>
      </Section>

      <InfoTable
        title="Reis"
        rows={[
          { label: 'Reis', value: tripTitle },
          { label: 'Vertrekdatum', value: vertrekdatum },
          { label: 'Retourdatum', value: retourdatum || 'Flexibel / n.v.t.' },
          { label: 'Volwassenen', value: aantalVolwassenen },
          { label: 'Kinderen', value: aantalKinderen },
        ]}
      />

      <InfoTable
        title="Reizigersinformatie"
        rows={[
          { label: 'Naam', value: `${voornaam} ${achternaam}` },
          { label: 'E-mail', value: email },
          { label: 'Telefoon', value: telefoon },
          { label: 'Geboortedatum', value: geboortedatum },
          { label: 'Nationaliteit', value: nationaliteit },
          { label: 'Paspoortnummer', value: paspoortnummer },
        ]}
      />

      <InfoTable
        title="Bijzonderheden"
        rows={[
          { label: 'Dieetwensen', value: dieetwensen },
          { label: 'Medisch', value: medischeBijzonderheden },
          { label: 'Speciale verzoeken', value: speciale_verzoeken },
          { label: 'Gevonden via', value: gevonden },
        ]}
      />

      <Hr style={divider} />

      <Section style={actionBar}>
        <Link href={`mailto:${email}`} style={replyButton}>
          Beantwoord {voornaam}
        </Link>
      </Section>
    </EmailLayout>
  )
}

const badgeContainer: React.CSSProperties = {
  marginBottom: '28px',
}

const badge: React.CSSProperties = {
  display: 'inline-block',
  padding: '6px 16px',
  backgroundColor: colors.bgAccent,
  color: colors.primary,
  fontSize: '13px',
  fontWeight: 700,
  fontFamily: fonts.primary,
  borderRadius: '50px',
  border: `1px solid ${colors.border}`,
  letterSpacing: '1px',
  margin: 0,
}

const divider: React.CSSProperties = {
  borderColor: colors.borderLight,
  margin: '4px 0 20px 0',
}

const actionBar: React.CSSProperties = {
  textAlign: 'center' as const,
}

const replyButton: React.CSSProperties = {
  display: 'inline-block',
  padding: '10px 24px',
  backgroundColor: colors.bgAccent,
  color: colors.primary,
  fontSize: '13px',
  fontWeight: 600,
  fontFamily: fonts.primary,
  textDecoration: 'none',
  borderRadius: '50px',
  border: `1px solid ${colors.border}`,
}

export default BookingAdminEmail
