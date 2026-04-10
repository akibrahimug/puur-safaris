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
      // English URL aliases → same page files as Dutch
      { source: '/en/safaris', destination: '/en/safari-reizen' },
      { source: '/en/safaris/:slug', destination: '/en/safari-reizen/:slug' },
      { source: '/en/safaris/:slug/book', destination: '/en/safari-reizen/:slug/boeken' },
      { source: '/en/destinations', destination: '/en/bestemmingen' },
      { source: '/en/destinations/:slug', destination: '/en/bestemmingen/:slug' },
      { source: '/en/about', destination: '/en/over-ons' },
      { source: '/en/custom-itinerary', destination: '/en/eigen-reisschema' },
      { source: '/en/blog/submit', destination: '/en/blog/inzenden' },
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
