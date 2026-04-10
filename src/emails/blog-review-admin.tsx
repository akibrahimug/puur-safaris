import { Text, Section, Hr, Link } from '@react-email/components'
import * as React from 'react'
import { EmailLayout } from './components/layout'
import { CtaButton } from './components/cta-button'
import { InfoTable } from './components/info-table'
import { colors, fonts } from './tokens'

interface BlogReviewAdminEmailProps {
  authorName: string
  authorEmail: string
  title: string
  bookingNumber: string
  previewUrl: string
  studioUrl: string
}

export function BlogReviewAdminEmail({
  authorName,
  authorEmail,
  title,
  bookingNumber,
  previewUrl,
  studioUrl,
}: BlogReviewAdminEmailProps) {
  return (
    <EmailLayout
      preview={`Nieuw reisverslag ter beoordeling: ${title}`}
      heading="Nieuw reisverslag ingediend"
      subheading={`Door ${authorName}`}
    >
      <InfoTable
        title="Inzending"
        rows={[
          { label: 'Titel', value: title },
          { label: 'Auteur', value: authorName },
          { label: 'E-mail', value: authorEmail },
          { label: 'Boekingsnummer', value: bookingNumber },
        ]}
      />

      <Section style={ctaContainer}>
        <CtaButton href={previewUrl}>Bekijk preview</CtaButton>
      </Section>

      <Hr style={divider} />

      <Text style={paragraph}>
        Dit reisverslag is automatisch geverifieerd via het boekingsnummer en
        staat klaar voor beoordeling. Je kunt het verhaal bewerken en
        publiceren in Sanity Studio.
      </Text>

      <Section style={actionBar}>
        <Link href={studioUrl} style={studioLink}>
          Openen in Studio
        </Link>
      </Section>
    </EmailLayout>
  )
}

const ctaContainer: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '28px 0',
}

const divider: React.CSSProperties = {
  borderColor: '#e8efe9',
  margin: '0 0 20px 0',
}

const paragraph: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: colors.textMuted,
  fontFamily: fonts.primary,
  margin: '0 0 20px 0',
}

const actionBar: React.CSSProperties = {
  textAlign: 'center' as const,
}

const studioLink: React.CSSProperties = {
  display: 'inline-block',
  padding: '10px 24px',
  backgroundColor: '#eef5f1',
  color: colors.primary,
  fontSize: '13px',
  fontWeight: 600,
  fontFamily: fonts.primary,
  textDecoration: 'none',
  borderRadius: '50px',
  border: '1px solid #dce8e1',
}

export default BlogReviewAdminEmail
