'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

const LOCALES = new Set(['nl', 'en'])

const SEGMENT_LABELS: Record<string, Record<string, string>> = {
  nl: {
    safaris: 'Safari Reizen',
    destinations: 'Bestemmingen',
    blog: 'Blog',
    about: 'Over Ons',
    faq: 'FAQ',
    contact: 'Contact',
    'custom-itinerary': 'Eigen Reisschema',
    submit: 'Inzenden',
    book: 'Boeken',
    preview: 'Preview',
    privacy: 'Privacybeleid',
    terms: 'Algemene Voorwaarden',
  },
  en: {
    safaris: 'Safaris',
    destinations: 'Destinations',
    blog: 'Blog',
    about: 'About Us',
    faq: 'FAQ',
    contact: 'Contact',
    'custom-itinerary': 'Custom Itinerary',
    submit: 'Submit',
    book: 'Book',
    preview: 'Preview',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
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
    <nav aria-label={locale === 'nl' ? 'Kruimelpad' : 'Breadcrumb'} className="flex items-center gap-x-1.5 gap-y-1 text-xs sm:text-[11px] font-medium mb-5 flex-wrap leading-loose" suppressHydrationWarning>
      <Link
        href={localePrefix}
        className="inline-flex items-center gap-1 py-1 transition-colors duration-200 hover:text-white"
        style={{ color: 'rgba(255,255,255,0.55)' }}
      >
        <Home className="h-3.5 w-3.5 sm:h-3 sm:w-3 shrink-0" />
        <span>Home</span>
      </Link>

      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={crumb.href} className="inline-flex items-center gap-1.5 min-w-0">
            <ChevronRight
              aria-hidden="true"
              className="h-3 w-3 sm:h-2.5 sm:w-2.5 shrink-0 pointer-events-none"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            />
            {isLast ? (
              <span
                className="truncate max-w-[60vw] sm:max-w-none"
                style={{ color: 'rgba(255,255,255,0.85)' }}
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="py-1 truncate max-w-[50vw] sm:max-w-none transition-colors duration-200 hover:text-white"
                style={{ color: 'rgba(255,255,255,0.55)' }}
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
