import type { MetadataRoute } from 'next'
import { getBaseUrl } from '@/lib/seo'

// AI/answer-engine crawlers explicitly allowed for discoverability (AEO/GEO).
// Functionally redundant with the wildcard rule below (nothing here is
// disallowed elsewhere), but explicit entries document intent and are
// respected first by crawlers that check for a name-specific rule.
const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
]

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/'],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/studio/', '/api/'],
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: new URL(baseUrl).host,
  }
}
