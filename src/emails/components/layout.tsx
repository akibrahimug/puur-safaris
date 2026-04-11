import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Font,
} from '@react-email/components'
import * as React from 'react'
import { colors, fonts } from '../tokens'

interface EmailLayoutProps {
  preview: string
  heading?: string
  subheading?: string
  children: React.ReactNode
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puursafaris.nl'

export function EmailLayout({
  preview,
  heading,
  subheading,
  children,
}: EmailLayoutProps) {
  return (
    <Html lang="nl">
      <Head>
        <Font
          fontFamily="Sora"
          fallbackFontFamily={['Arial', 'Helvetica', 'sans-serif']}
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={body}>
        {/* Spacer top */}
        <Section style={{ height: '32px' }} />

        <Container style={container}>
          {/* ── Header ── */}
          <Section style={header}>
            <table
              cellPadding="0"
              cellSpacing="0"
              role="presentation"
              style={{ width: '100%' }}
            >
              <tr>
                <td style={{ textAlign: 'center', padding: '36px 40px 32px' }}>
                  <Text style={brandName}>PUUR SAFARIS</Text>
                  <Text style={brandTagline}>Authentieke safari ervaringen</Text>
                </td>
              </tr>
            </table>
            {/* Green accent line */}
            <div
              style={{
                height: '3px',
                background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryLight}, ${colors.primary})`,
              }}
            />
          </Section>

          {/* ── Content ── */}
          <Section style={content}>
            {heading && (
              <Section style={headingSection}>
                <Text style={headingStyle}>{heading}</Text>
                {subheading && (
                  <Text style={subheadingStyle}>{subheading}</Text>
                )}
              </Section>
            )}
            {children}
          </Section>

          {/* ── Footer ── */}
          <Section style={footer}>
            <Hr style={footerDivider} />

            <table
              cellPadding="0"
              cellSpacing="0"
              role="presentation"
              style={{ width: '100%' }}
            >
              <tr>
                <td style={{ textAlign: 'center', paddingTop: '24px' }}>
                  <Text style={footerBrand}>PUUR SAFARIS</Text>
                  <Text style={footerLinks}>
                    <Link href={siteUrl} style={footerLink}>
                      Website
                    </Link>
                    {'  ·  '}
                    <Link href={`${siteUrl}/safaris`} style={footerLink}>
                      Safari Reizen
                    </Link>
                    {'  ·  '}
                    <Link href={`${siteUrl}/blog`} style={footerLink}>
                      Blog
                    </Link>
                    {'  ·  '}
                    <Link href={`${siteUrl}/contact`} style={footerLink}>
                      Contact
                    </Link>
                  </Text>
                  <Text style={footerDisclaimer}>
                    Puur Safaris — Authentieke safari ervaringen in Oost-Afrika
                  </Text>
                </td>
              </tr>
            </table>
          </Section>
        </Container>

        {/* Spacer bottom */}
        <Section style={{ height: '32px' }} />
      </Body>
    </Html>
  )
}

/* ── Styles ── */

const body: React.CSSProperties = {
  backgroundColor: colors.bgBody,
  fontFamily: fonts.primary,
  margin: 0,
  padding: 0,
  WebkitFontSmoothing: 'antialiased',
}

const container: React.CSSProperties = {
  maxWidth: '680px',
  margin: '0 auto',
  backgroundColor: colors.bgContent,
  borderRadius: '16px',
  overflow: 'hidden',
  border: `1px solid ${colors.borderLight}`,
}

const header: React.CSSProperties = {
  backgroundColor: colors.forest,
}

const brandName: React.CSSProperties = {
  color: colors.textLight,
  fontSize: '20px',
  fontWeight: 700,
  fontFamily: fonts.primary,
  letterSpacing: '4px',
  margin: '0 0 4px 0',
  textAlign: 'center' as const,
}

const brandTagline: React.CSSProperties = {
  color: 'rgba(250, 250, 248, 0.5)',
  fontSize: '11px',
  fontWeight: 300,
  fontFamily: fonts.primary,
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  margin: 0,
  textAlign: 'center' as const,
}

const content: React.CSSProperties = {
  padding: '40px 40px 32px',
}

const headingSection: React.CSSProperties = {
  marginBottom: '32px',
}

const headingStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  fontFamily: fonts.primary,
  color: colors.text,
  margin: '0 0 6px 0',
  letterSpacing: '-0.3px',
  lineHeight: '1.2',
}

const subheadingStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 400,
  color: colors.textMuted,
  fontFamily: fonts.primary,
  margin: 0,
  lineHeight: '1.5',
}

const footer: React.CSSProperties = {
  padding: '0 40px 32px',
}

const footerDivider: React.CSSProperties = {
  borderColor: colors.borderLight,
  borderWidth: '1px',
  margin: '8px 0 0 0',
}

const footerBrand: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  color: colors.textMuted,
  fontFamily: fonts.primary,
  letterSpacing: '2.5px',
  margin: '0 0 12px 0',
  textAlign: 'center' as const,
}

const footerLinks: React.CSSProperties = {
  fontSize: '12px',
  color: colors.textMuted,
  fontFamily: fonts.primary,
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
  lineHeight: '20px',
}

const footerLink: React.CSSProperties = {
  color: colors.primary,
  textDecoration: 'none',
  fontWeight: 500,
}

const footerDisclaimer: React.CSSProperties = {
  fontSize: '11px',
  color: colors.textMuted,
  fontFamily: fonts.primary,
  margin: 0,
  textAlign: 'center' as const,
  lineHeight: '16px',
  opacity: 0.7,
}
