import { Section, Text } from '@react-email/components'
import * as React from 'react'
import { colors, fonts } from '../tokens'

interface InfoTableProps {
  title?: string
  rows: { label: string; value: string | number | undefined | null }[]
}

export function InfoTable({ title, rows }: InfoTableProps) {
  const filtered = rows.filter((r) => r.value != null && r.value !== '')

  if (filtered.length === 0) return null

  return (
    <Section style={section}>
      {title && (
        <Text style={titleStyle}>
          {title}
        </Text>
      )}
      <table
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        style={tableStyle}
      >
        <tbody>
          {filtered.map((row, i) => (
            <tr key={i}>
              <td style={labelCell}>{row.label}</td>
              <td style={valueCell}>{String(row.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

const section: React.CSSProperties = {
  marginBottom: '24px',
}

const titleStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  fontFamily: fonts.primary,
  color: colors.primary,
  textTransform: 'uppercase' as const,
  letterSpacing: '1.5px',
  margin: '0 0 12px 0',
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  border: `1px solid ${colors.borderLight}`,
  borderRadius: '8px',
  overflow: 'hidden',
}

const labelCell: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: '13px',
  fontWeight: 500,
  fontFamily: fonts.primary,
  color: colors.textSecondary,
  width: '38%',
  verticalAlign: 'top',
  borderBottom: `1px solid ${colors.borderLight}`,
  backgroundColor: colors.bgCard,
}

const valueCell: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: '13px',
  fontFamily: fonts.primary,
  color: colors.text,
  fontWeight: 400,
  width: '62%',
  verticalAlign: 'top',
  borderBottom: `1px solid ${colors.borderLight}`,
}
