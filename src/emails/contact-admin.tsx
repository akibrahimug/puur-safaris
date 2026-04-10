import { Text, Hr, Link, Section } from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/layout'
import { InfoTable } from './components/info-table'
import { colors, fonts } from './tokens'

interface ContactAdminEmailProps {
  naam: string
  email: string
  telefoon?: string
  onderwerp: string
  bericht: string
  reiscontext?: { label: string; value: string }[]
  reiscontextTitle?: string
  berichtTitle?: string
}

export function ContactAdminEmail({
  naam,
  email,
  telefoon,
  onderwerp,
  bericht,
  reiscontext,
  reiscontextTitle,
  berichtTitle,
}: ContactAdminEmailProps) {
  return (
    <EmailLayout
      preview={`Nieuw bericht: ${onderwerp} — ${naam}`}
      heading="Nieuw bericht ontvangen"
      subheading={`Van ${naam} · ${onderwerp}`}
    >
      <InfoTable
        title="Contactgegevens"
        rows={[
          { label: 'Naam', value: naam },
          { label: 'E-mail', value: email },
          { label: 'Telefoon', value: telefoon },
        ]}
      />

      {reiscontext && reiscontext.length > 0 && (
        <InfoTable
          title={reiscontextTitle || 'Reiscontext'}
          rows={reiscontext.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
        />
      )}

      {/* Message block */}
      <Section style={messageSection}>
        <Text style={messageLabelStyle}>{(berichtTitle || 'Bericht').toUpperCase()}</Text>
        <Section style={messageBox}>
          <Text style={messageText}>{bericht}</Text>
        </Section>
      </Section>

      <Hr style={divider} />

      <Section style={actionBar}>
        <Link href={`mailto:${email}`} style={replyButton}>
          Beantwoord {naam}
        </Link>
      </Section>
    </EmailLayout>
  )
}

const messageSection: React.CSSProperties = {
  marginBottom: '24px',
}

const messageLabelStyle: React.CSSProperties = {
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

export default ContactAdminEmail
