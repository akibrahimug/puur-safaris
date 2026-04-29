import { Text, Section, Hr } from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/layout'
import { CtaButton } from './components/cta-button'
import { colors, fonts } from './tokens'

interface ContactConfirmEmailProps {
  naam: string
  onderwerp: string
  bericht: string
  // Set when the inquiry came through the trip-builder ("Eigen Reisschema
  // Aanvraag") rather than the standard contact form. Drives slightly
  // different copy — the user already filled out a more detailed brief, so
  // we frame the follow-up around that.
  isEigenReisschema?: boolean
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puurugandareizen.nl'

export function ContactConfirmEmail({
  naam,
  onderwerp,
  bericht,
  isEigenReisschema,
}: ContactConfirmEmailProps) {
  const heading = isEigenReisschema
    ? 'Uw reisschema aanvraag is ontvangen'
    : 'Uw bericht is ontvangen'

  const subheading = isEigenReisschema
    ? 'We gaan ermee aan de slag'
    : `Onderwerp: ${onderwerp}`

  return (
    <EmailLayout preview={heading} heading={heading} subheading={subheading}>
      <Text style={greeting}>Beste {naam},</Text>
      <Text style={paragraph}>
        {isEigenReisschema
          ? 'Bedankt voor uw aanvraag voor een eigen reisschema. We hebben uw wensen ontvangen en gaan voor u aan de slag.'
          : 'Bedankt voor uw bericht aan Puur Uganda Reizen. We hebben uw vraag in goede orde ontvangen.'}
      </Text>

      <Text style={paragraph}>
        Ons team neemt binnen <strong>2 werkdagen</strong> persoonlijk contact met u op
        {isEigenReisschema
          ? ' om uw reis verder vorm te geven.'
          : ' om uw vraag te beantwoorden.'}
      </Text>

      {/* Echo back the message so the sender has a record of what was sent. */}
      <Section style={messageSection}>
        <Text style={messageLabel}>UW BERICHT</Text>
        <Section style={messageBox}>
          <Text style={messageText}>{bericht}</Text>
        </Section>
      </Section>

      <Hr style={divider} />

      <Section style={ctaContainer}>
        <CtaButton href={`${siteUrl}/safaris`}>Bekijk onze reizen</CtaButton>
      </Section>

      <Text style={signoff}>
        Met vriendelijke groet,
        <br />
        <strong style={{ color: colors.text }}>Het Puur Uganda Reizen Team</strong>
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

const messageSection: React.CSSProperties = {
  marginBottom: '24px',
  marginTop: '8px',
}

const messageLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  fontFamily: fonts.primary,
  color: colors.primary,
  textTransform: 'uppercase' as const,
  letterSpacing: '1.5px',
  margin: '0 0 12px 0',
}

const messageBox: React.CSSProperties = {
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.borderLight}`,
  borderRadius: '8px',
  padding: '20px',
  borderLeft: `3px solid ${colors.primary}`,
}

const messageText: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.7',
  color: colors.text,
  fontFamily: fonts.primary,
  margin: 0,
  whiteSpace: 'pre-wrap' as const,
}

const divider: React.CSSProperties = {
  borderColor: colors.borderLight,
  margin: '0 0 20px 0',
}

const ctaContainer: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const signoff: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: colors.textMuted,
  fontFamily: fonts.primary,
  margin: '24px 0 0 0',
}

export default ContactConfirmEmail
