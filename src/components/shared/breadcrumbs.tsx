'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

const SEGMENT_LABELS: Record<string, string> = {
  'safari-reizen': 'Safari Reizen',
  bestemmingen: 'Bestemmingen',
  blog: 'Blog',
  'over-ons': 'Over Ons',
  faq: 'FAQ',
  contact: 'Contact',
  privacybeleid: 'Privacybeleid',
  'algemene-voorwaarden': 'Algemene Voorwaarden',
}

function toLabel(segment: string): string {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment]
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const crumbs = segments.map((seg, i) => ({
    label: toLabel(seg),
    href: '/' + segments.slice(0, i + 1).join('/'),
  }))

  return (
    <nav aria-label="Kruimelpad" className="flex items-center gap-1.5 text-[11px] font-medium mb-5 flex-wrap">
      <Link
        href="/"
        className="flex items-center gap-1 transition-colors duration-200 hover:text-white"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        <Home className="h-3 w-3" />
        <span>Home</span>
      </Link>

      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={crumb.href} className="flex items-center gap-1.5">
            <ChevronRight className="h-2.5 w-2.5" style={{ color: 'rgba(255,255,255,0.2)' }} />
            {isLast ? (
              <span style={{ color: 'rgba(255,255,255,0.65)' }}>{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="transition-colors duration-200 hover:text-white"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {crumb.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
