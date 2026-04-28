import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}

/**
 * Build a CDN-optimized URL for a Sanity image asset, ready to feed into
 * `next/Image`'s `src` prop.
 *
 * Why: Sanity's `asset.url` returns the full-size original. For a 6000×4000
 * PNG that's ~30 MB. When `next/Image` downloads the raw file to resize it,
 * the optimization step times out on slow connections (TimeoutError, 500
 * /_next/image). Routing through Sanity's CDN with `width()` + `auto('format')`
 * makes the CDN serve a pre-sized WebP/AVIF that Next can optimize quickly.
 *
 * @param source Sanity image source (any shape `urlFor` accepts: asset ref,
 *               full image with `_type: "image"`, or `{ asset: { ... } }`).
 * @param maxWidth Largest dimension to ship from the CDN. 2560 is a safe
 *                 default for hero images on retina displays; pass smaller
 *                 (640, 1080) for cards and thumbnails.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanityImageUrl(source: any, maxWidth: number = 2560): string {
  return urlFor(source).width(maxWidth).auto('format').url()
}
