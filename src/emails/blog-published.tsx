import { Text, Section, Hr } from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/layout'
import { CtaButton } from './components/cta-button'
import { colors, fonts } from './tokens'

interface BlogPublishedEmailProps {
  title: string
  blogUrl: string
}

export function BlogPublishedEmail({
  title,
  blogUrl,
}: BlogPublishedEmailProps) {
  return (
    <EmailLayout
      preview={`Je reisverslag "${title}" is gepubliceerd!`}
      heading="Geweldig nieuws!"
      subheading="Je reisverslag is gepubliceerd"
    >
      <Text style={paragraph}>
        Je reisverslag{' '}
        <strong style={{ color: colors.text }}>&ldquo;{title}&rdquo;</strong> is
        goedgekeurd door ons team en staat nu live op onze website.
      </Text>

      <Section style={ctaContainer}>
        <CtaButton href={blogUrl}>Bekijk je artikel</CtaButton>
      </Section>

      <Hr style={divider} />

      <Text style={paragraphSmall}>
        Bedankt voor het delen van je ervaring. Jouw verhaal inspireert andere
        reizigers om de schoonheid van Afrika te ontdekken.
      </Text>

      <Text style={signoff}>
        Met vriendelijke groet,
        <br />
        <strong style={{ color: colors.text }}>Het Puur Safaris Team</strong>
      </Text>
    </EmailLayout>
  )
}

const paragraph: React.CSSProperties = {
  fontSize: '16px',
  lineHeight: '1.7',
  color: colors.textSecondary,
  fontFamily: fonts.primary,
  margin: '0 0 20px 0',
}

const ctaContainer: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '36px 0',
}

const divider: React.CSSProperties = {
  borderColor: colors.borderLight,
  margin: '0 0 24px 0',
}

const paragraphSmall: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: colors.textMuted,
  fontFamily: fonts.primary,
  margin: '0 0 20px 0',
}

const signoff: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: colors.textMuted,
  fontFamily: fonts.primary,
  margin: '24px 0 0 0',
}

export default BlogPublishedEmail
