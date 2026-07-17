import { stegaClean } from '@sanity/client/stega'
import { getSiteSettings, getTrips, getDestinations, getBlogPosts } from '@/lib/data'
import { getBaseUrl } from '@/lib/seo'

export const dynamic = 'force-static'

const MAX_LINKS_PER_SECTION = 20

function link(baseUrl: string, path: string, title?: string | null, description?: string | null): string {
  const cleanTitle = stegaClean(title) || path
  const cleanDescription = stegaClean(description)
  return cleanDescription
    ? `- [${cleanTitle}](${baseUrl}${path}): ${cleanDescription}`
    : `- [${cleanTitle}](${baseUrl}${path})`
}

export async function GET() {
  const baseUrl = getBaseUrl()

  const [settings, trips, destinations, blogPosts] = await Promise.all([
    getSiteSettings('nl'),
    getTrips('nl'),
    getDestinations('nl'),
    getBlogPosts('nl'),
  ])

  const siteName = stegaClean(settings.siteName) ?? 'Puur Uganda Reizen'
  const tagline = stegaClean(settings.tagline)

  const lines: string[] = [
    `# ${siteName}`,
    '',
    `> ${tagline ?? 'Uganda safari-specialist: reizen op maat, gorilla trekking en reisadvies. Nederlandstalig (bron) met een Engelstalige site voor internationale reizigers.'}`,
    '',
    `Deze site is beschikbaar in het Nederlands (${baseUrl}/nl) en Engels (${baseUrl}/en). Volledige URL-lijst: ${baseUrl}/sitemap.xml`,
    '',
    '## Safaris',
  ]

  for (const trip of trips.slice(0, MAX_LINKS_PER_SECTION)) {
    lines.push(link(baseUrl, `/nl/safaris/${stegaClean(trip.slug)}`, trip.title, trip.excerpt))
  }

  lines.push('', '## Bestemmingen')
  for (const destination of destinations.slice(0, MAX_LINKS_PER_SECTION)) {
    lines.push(link(baseUrl, `/nl/destinations/${stegaClean(destination.slug)}`, destination.name, destination.excerpt))
  }

  lines.push('', '## Blog')
  for (const post of blogPosts.slice(0, MAX_LINKS_PER_SECTION)) {
    lines.push(link(baseUrl, `/nl/blog/${stegaClean(post.slug)}`, post.title, post.summary))
  }

  lines.push(
    '',
    '## Overig',
    link(baseUrl, '/nl/faq', 'Veelgestelde vragen'),
    link(baseUrl, '/nl/contact', 'Contact'),
    link(baseUrl, '/nl/about', 'Over ons'),
  )

  if (settings.contactEmail) {
    lines.push(`- Email: ${stegaClean(settings.contactEmail)}`)
  }
  if (settings.phone) {
    lines.push(`- Telefoon: ${stegaClean(settings.phone)}`)
  }

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
