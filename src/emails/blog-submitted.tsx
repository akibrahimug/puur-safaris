import { Text, Section } from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/layout'
import { colors, fonts } from './tokens'

interface BlogSubmittedEmailProps {
  authorName: string
  title: string
}

export function BlogSubmittedEmail({
  authorName,
  title,
}: BlogSubmittedEmailProps) {
  return (
    <EmailLayout
      preview={`Reisverslag ontvangen: ${title}`}
      heading="Bedankt voor uw reisverslag"
      subheading="Wij hebben uw verhaal in goede orde ontvangen"
    >
      <Text style={greeting}>Beste {authorName},</Text>
      <Text style={paragraph}>
        Wat leuk dat u uw ervaring met ons wilt delen! Uw reisverslag{' '}
        <strong style={{ color: colors.text }}>&ldquo;{title}&rdquo;</strong>{' '}
        is succesvol ingediend.
      </Text>

      {/* Status card */}
      <Section style={statusCard}>
        <table
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
          style={{ width: '100%' }}
        >
          <tr>
            <td style={stepCell}>
              <Text style={stepNumber}>1</Text>
              <Text style={stepLabel}>Ontvangen</Text>
              <Text style={stepStatus}>Voltooid</Text>
            </td>
            <td style={stepDividerCell}>
              <div style={stepLine} />
            </td>
            <td style={stepCell}>
              <Text style={stepNumber}>2</Text>
              <Text style={stepLabel}>Beoordeling</Text>
              <Text style={stepStatusPending}>5-7 werkdagen</Text>
            </td>
            <td style={stepDividerCell}>
              <div style={stepLine} />
            </td>
            <td style={stepCell}>
              <Text style={stepNumber}>3</Text>
              <Text style={stepLabel}>Publicatie</Text>
              <Text style={stepStatusPending}>Binnenkort</Text>
            </td>
          </tr>
        </table>
      </Section>

      <Text style={paragraph}>
        Ons team beoordeelt uw reisverslag zorgvuldig. U ontvangt een e-mail
        zodra uw artikel gepubliceerd is op onze website.
      </Text>

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
  margin: '0 0 16px 0',
}

const paragraph: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: colors.textSecondary,
  fontFamily: fonts.primary,
  margin: '0 0 20px 0',
}

const statusCard: React.CSSProperties = {
  backgroundColor: colors.bgAccent,
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  padding: '24px 16px',
  margin: '28px 0',
}

const stepCell: React.CSSProperties = {
  textAlign: 'center' as const,
  verticalAlign: 'top',
}

const stepDividerCell: React.CSSProperties = {
  verticalAlign: 'middle',
  padding: '0 4px',
  width: '40px',
}

const stepLine: React.CSSProperties = {
  height: '1px',
  backgroundColor: colors.border,
  width: '100%',
}

const stepNumber: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  color: colors.primary,
  fontFamily: fonts.primary,
  margin: '0 0 4px 0',
}

const stepLabel: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: colors.text,
  fontFamily: fonts.primary,
  margin: '0 0 2px 0',
}

const stepStatus: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 500,
  color: colors.primary,
  fontFamily: fonts.primary,
  margin: 0,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const stepStatusPending: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 500,
  color: colors.textMuted,
  fontFamily: fonts.primary,
  margin: 0,
}

const signoff: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: colors.textMuted,
  fontFamily: fonts.primary,
  margin: '28px 0 0 0',
}

export default BlogSubmittedEmail
