import { groq } from 'next-sanity'

// ─── COMMON PROJECTIONS ───────────────────────────────────────────────────────

const IMAGE_PROJECTION = `{
  asset->{ _id, url, metadata{ dimensions, lqip } },
  hotspot,
  crop,
  alt
}`

const SEO_PROJECTION = `seo {
  title,
  description,
  ogImage ${IMAGE_PROJECTION},
  noIndex
}`

const TRIP_CARD_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  duration,
  daysCount,
  price,
  priceType,
  difficulty,
  category,
  featured,
  heroImage ${IMAGE_PROJECTION},
  "destination": destination->{ name, country, "slug": slug.current }
}`

// ─── SITE SETTINGS ────────────────────────────────────────────────────────────

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    logo ${IMAGE_PROJECTION},
    contactEmail,
    phone,
    address,
    chamberOfCommerceNumber,
    socialMedia,
    defaultSeoTitle,
    defaultSeoDescription,
    defaultOgImage ${IMAGE_PROJECTION},
    footerText
  }
`

// ─── HOMEPAGE ─────────────────────────────────────────────────────────────────

export const homepageQuery = groq`{
  "featuredTrips": *[_type == "trip" && featured == true && active == true]
    | order(_createdAt asc)[0...6] ${TRIP_CARD_PROJECTION},

  "destinations": *[_type == "destination"] | order(displayOrder asc)[0...6] {
    _id,
    name,
    "slug": slug.current,
    country,
    continent,
    excerpt,
    heroImage ${IMAGE_PROJECTION}
  },

  "testimonials": *[_type == "testimonial" && visible == true]
    | order(_createdAt desc)[0...6] {
    _id,
    name,
    country,
    rating,
    quote,
    date,
    profilePhoto ${IMAGE_PROJECTION},
    "bookedTrip": bookedTrip->{ title, "slug": slug.current }
  },

  "settings": *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    defaultSeoTitle,
    defaultSeoDescription,
    defaultOgImage ${IMAGE_PROJECTION}
  }
}`

// ─── TRIP LISTING ─────────────────────────────────────────────────────────────

export const tripListQuery = groq`
  *[_type == "trip" && active == true]
  | order(featured desc, _createdAt asc)
  ${TRIP_CARD_PROJECTION}
`

// ─── TRIP DETAIL ──────────────────────────────────────────────────────────────

export const tripDetailQuery = groq`
  *[_type == "trip" && slug.current == $slug && active == true][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    fullDescription,
    duration,
    daysCount,
    price,
    priceType,
    difficulty,
    minPersons,
    maxPersons,
    category,
    highlights,
    included,
    excluded,
    itinerary[] {
      day,
      title,
      description,
      location,
      meals
    },
    heroImage ${IMAGE_PROJECTION},
    gallery[] {
      image ${IMAGE_PROJECTION},
      alt,
      caption
    },
    "destination": destination->{ name, "slug": slug.current, country },
    ${SEO_PROJECTION}
  }
`

export const tripSlugsQuery = groq`
  *[_type == "trip" && active == true]{ "slug": slug.current }
`

// ─── DESTINATION LISTING ──────────────────────────────────────────────────────

export const destinationListQuery = groq`
  *[_type == "destination"] | order(displayOrder asc) {
    _id,
    name,
    "slug": slug.current,
    country,
    continent,
    excerpt,
    heroImage ${IMAGE_PROJECTION},
    "tripCount": count(*[_type == "trip" && active == true && references(^._id)])
  }
`

// ─── DESTINATION DETAIL ───────────────────────────────────────────────────────

export const destinationDetailQuery = groq`
  *[_type == "destination" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    country,
    continent,
    excerpt,
    description,
    climate,
    bestTimeToVisit,
    heroImage ${IMAGE_PROJECTION},
    "relatedTrips": *[_type == "trip" && active == true && references(^._id)]
      | order(featured desc)
      ${TRIP_CARD_PROJECTION},
    ${SEO_PROJECTION}
  }
`

export const destinationSlugsQuery = groq`
  *[_type == "destination"]{ "slug": slug.current }
`

// ─── BLOG LISTING ─────────────────────────────────────────────────────────────

export const blogListQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    author,
    publishedAt,
    category,
    summary,
    featuredImage ${IMAGE_PROJECTION}
  }
`

// ─── BLOG POST DETAIL ─────────────────────────────────────────────────────────

export const blogPostDetailQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    author,
    publishedAt,
    category,
    summary,
    content,
    featuredImage ${IMAGE_PROJECTION},
    "relatedTrips": relatedTrips[]->{
      title,
      "slug": slug.current,
      heroImage ${IMAGE_PROJECTION},
      price,
      duration
    },
    ${SEO_PROJECTION}
  }
`

export const blogPostSlugsQuery = groq`
  *[_type == "blogPost"]{ "slug": slug.current }
`

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const faqQuery = groq`
  *[_type == "faqItem"] | order(category asc, order asc) {
    _id,
    question,
    answer,
    category
  }
`
