import { client } from '@/sanity/client'

/**
 * Returns true when a real Sanity project ID is configured.
 * Falls back to dummy data when the project ID is missing or still a placeholder.
 */
export function isSanityConfigured(): boolean {
  const id = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  return Boolean(id && id !== 'placeholder' && id.length > 4)
}

/**
 * Fetch data from Sanity with ISR cache options.
 * Returns null when Sanity is not configured or the fetch fails —
 * callers should fall back to dummy data in that case.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: { next?: { revalidate?: number; tags?: string[] } } = {},
): Promise<T | null> {
  if (!isSanityConfigured()) return null

  try {
    const fetchOptions =
      process.env.NODE_ENV === 'development'
        ? { cache: 'no-store' as const }
        : options
    return await client.fetch<T>(query, params, fetchOptions)
  } catch (err) {
    console.error('[sanityFetch] query failed, falling back to dummy data.', err)
    return null
  }
}
