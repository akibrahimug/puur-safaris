'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

const LOCALES = new Set(['nl', 'en'])

const SEGMENT_LABELS: Record<string, Record<string, string>> = {
  nl: {
    'safari-reizen': 'Safari Reizen',
    bestemmingen: 'Bestemmingen',
    blog: 'Blog',
    'over-ons': 'Over Ons',
    faq: 'FAQ',
    contact: 'Contact',
    'eigen-reisschema': 'Eigen Reisschema',
    inzenden: 'Inzenden',
    boeken: 'Boeken',
    preview: 'Preview',
    privacybeleid: 'Privacybeleid',
    'algemene-voorwaarden': 'Algemene Voorwaarden',
  },
  en: {
    'safari-reizen': 'Safaris',
    safaris: 'Safaris',
    bestemmingen: 'Destinations',
    destinations: 'Destinations',
    blog: 'Blog',
    'over-ons': 'About Us',
    about: 'About Us',
    faq: 'FAQ',
    contact: 'Contact',
    'eigen-reisschema': 'Custom Itinerary',
    'custom-itinerary': 'Custom Itinerary',
    inzenden: 'Submit',
    submit: 'Submit',
    boeken: 'Book',
    book: 'Book',
    preview: 'Preview',
    'privacy-policy': 'Privacy Policy',
    'terms-and-conditions': 'Terms & Conditions',
  },
}

function toLabel(segment: string, locale: string): string {
  const labels = SEGMENT_LABELS[locale] ?? SEGMENT_LABELS.nl
  if (labels[segment]) return labels[segment]
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const allSegments = pathname.split('/').filter(Boolean)

  // Detect and strip locale prefix
  const locale = allSegments[0] && LOCALES.has(allSegments[0]) ? allSegments[0] : 'nl'
  const segments = LOCALES.has(allSegments[0]) ? allSegments.slice(1) : allSegments
  const localePrefix = `/${locale}`

  if (segments.length === 0) return null

  const crumbs = segments.map((seg, i) => ({
    label: toLabel(seg, locale),
    href: localePrefix + '/' + segments.slice(0, i + 1).join('/'),
  }))

  return (
    <nav aria-label={locale === 'nl' ? 'Kruimelpad' : 'Breadcrumb'} className="flex items-center gap-1.5 text-[11px] font-medium mb-5 flex-wrap" suppressHydrationWarning>
      <Link
        href={localePrefix}
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
