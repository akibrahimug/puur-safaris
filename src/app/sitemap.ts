import type { MetadataRoute } from 'next'
import { getTripSlugs, getDestinationSlugs, getBlogPostSlugs } from '@/lib/data'
import { getBaseUrl } from '@/lib/seo'
import { locales } from '@/i18n/config'
import { localePath, type RouteKey } from '@/i18n/routes'

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>

/**
 * Every real page lives under a locale prefix (/nl/..., /en/...); an
 * unprefixed URL just 307s through the locale-detection proxy. Sitemap
 * entries must be the final, non-redirecting URLs, so each route is listed
 * once per locale via localePath (the same NL/EN segment map next.config's
 * rewrites and page metadata use).
 */
function localizedEntries(
  route: RouteKey,
  changeFrequency: ChangeFrequency,
  priority: number,
  slug?: string,
): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  const lastModified = new Date()
  return locales.map((locale) => ({
    url: `${baseUrl}${localePath(locale, route, slug)}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tripSlugs, destinationSlugs, blogSlugs] = await Promise.all([
    getTripSlugs(),
    getDestinationSlugs(),
    getBlogPostSlugs(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    ...localizedEntries('home', 'daily', 1.0),
    ...localizedEntries('safaris', 'daily', 0.9),
    ...localizedEntries('destinations', 'weekly', 0.9),
    ...localizedEntries('blog', 'weekly', 0.8),
    ...localizedEntries('about', 'monthly', 0.6),
    ...localizedEntries('contact', 'monthly', 0.7),
    ...localizedEntries('faq', 'monthly', 0.7),
  ]

  const tripRoutes = tripSlugs.flatMap((slug) => localizedEntries('safariDetail', 'weekly', 0.85, slug))
  const destinationRoutes = destinationSlugs.flatMap((slug) =>
    localizedEntries('destinationDetail', 'weekly', 0.8, slug),
  )
  const blogRoutes = blogSlugs.flatMap((slug) => localizedEntries('blogDetail', 'monthly', 0.7, slug))

  return [...staticRoutes, ...tripRoutes, ...destinationRoutes, ...blogRoutes]
}
