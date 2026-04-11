import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`,
      },
      // Temporary: allow unsplash for placeholder hero image
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
  },
  async rewrites() {
    return [
      // Dutch URL aliases → English page files
      { source: '/nl/safari-reizen', destination: '/nl/safaris' },
      { source: '/nl/safari-reizen/:slug', destination: '/nl/safaris/:slug' },
      { source: '/nl/safari-reizen/:slug/boeken', destination: '/nl/safaris/:slug/book' },
      { source: '/nl/bestemmingen', destination: '/nl/destinations' },
      { source: '/nl/bestemmingen/:slug', destination: '/nl/destinations/:slug' },
      { source: '/nl/over-ons', destination: '/nl/about' },
      { source: '/nl/eigen-reisschema', destination: '/nl/custom-itinerary' },
      { source: '/nl/blog/inzenden', destination: '/nl/blog/submit' },
      { source: '/nl/privacybeleid', destination: '/nl/privacy' },
      { source: '/nl/algemene-voorwaarden', destination: '/nl/terms' },
    ]
  },
  async headers() {
    return [
      {
        source: '/studio/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
}

export default nextConfig
