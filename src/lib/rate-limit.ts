/**
 * In-memory rate limiter for public API routes.
 *
 * This is an in-process token-bucket — fine for the current single-region
 * deployment but it does NOT survive process restarts and won't coordinate
 * across multiple instances. If we ever scale horizontally, swap the
 * `requests` Map for an Upstash/Redis-backed store with the same surface.
 *
 * The bucket is keyed by `${endpoint}:${ip}` so each route has its own
 * window — abuse on /api/contact doesn't blocklist legitimate /api/booking
 * traffic from the same IP.
 */

interface Bucket {
  count: number
  resetAt: number
}

const requests = new Map<string, Bucket>()

// Periodically prune expired buckets so the Map doesn't grow unbounded.
// Using setInterval is fine inside Next's long-lived dev/prod process; it
// would NOT be fine in a serverless edge runtime — that's another reason
// this util needs replacing if we move to edge.
const PRUNE_INTERVAL_MS = 5 * 60_000
if (typeof setInterval !== 'undefined' && process.env.NODE_ENV !== 'test') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, bucket] of requests) {
      if (bucket.resetAt <= now) requests.delete(key)
    }
  }, PRUNE_INTERVAL_MS).unref?.()
}

export interface RateLimitResult {
  ok: boolean
  /** Seconds until the bucket resets — set as `Retry-After` on 429s. */
  retryAfterSeconds: number
  /** Remaining requests in the current window (0 when ok=false). */
  remaining: number
}

interface RateLimitOptions {
  /** Unique identifier per route — keeps buckets isolated between endpoints. */
  endpoint: string
  /** Client identifier — typically the IP from `x-forwarded-for`. */
  ip: string
  /** Max requests allowed in the window. */
  limit: number
  /** Window length in milliseconds. */
  windowMs: number
}

export function rateLimit({ endpoint, ip, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const key = `${endpoint}:${ip}`
  const now = Date.now()
  const bucket = requests.get(key)

  // First hit, or the previous window already expired → start fresh.
  if (!bucket || bucket.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfterSeconds: 0, remaining: limit - 1 }
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      remaining: 0,
    }
  }

  bucket.count += 1
  return { ok: true, retryAfterSeconds: 0, remaining: limit - bucket.count }
}

/**
 * Pull the client IP from a Next.js Request. Vercel sets `x-forwarded-for`
 * as a comma-separated chain (`<client>, <proxy>, ...`); we take the first
 * entry. Falls back to `x-real-ip` and finally to a literal string so the
 * limiter still works locally (single bucket for all dev requests).
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const real = req.headers.get('x-real-ip')
  if (real) return real.trim()
  return 'unknown'
}

/**
 * Test-only — clear the in-process bucket store between tests so they don't
 * pollute each other. Not exported for production use.
 */
export function __resetRateLimitForTests(): void {
  requests.clear()
}
