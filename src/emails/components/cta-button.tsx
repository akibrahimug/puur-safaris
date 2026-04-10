import { Button } from '@react-email/components'
import * as React from 'react'
import { colors, fonts } from '../tokens'

interface CtaButtonProps {
  href: string
  children: React.ReactNode
}

export function CtaButton({ href, children }: CtaButtonProps) {
  return (
    <Button href={href} style={button}>
      {children}
    </Button>
  )
}

const button: React.CSSProperties = {
  display: 'inline-block',
  padding: '14px 36px',
  backgroundColor: colors.primary,
  color: colors.white,
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: fonts.primary,
  textDecoration: 'none',
  borderRadius: '50px',
  textAlign: 'center' as const,
  letterSpacing: '0.3px',
}
