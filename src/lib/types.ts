// ─── IMAGE ───────────────────────────────────────────────────────────────────

export interface SanityImage {
  asset: {
    _id: string
    url: string
    metadata: {
      dimensions: { width: number; height: number; aspectRatio: number }
      lqip: string
    }
  }
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
}

// ─── SEO ─────────────────────────────────────────────────────────────────────

export interface SeoFields {
  title?: string
  description?: string
  ogImage?: SanityImage
  noIndex?: boolean
}

// ─── DESTINATION ─────────────────────────────────────────────────────────────

export interface DestinationCard {
  _id: string
  name: string
  slug: string
  country: string
  continent?: string
  excerpt?: string
  heroImage: SanityImage
  tripCount?: number
}

export interface DestinationDetail extends DestinationCard {
  description?: unknown[]
  climate?: string
  bestTimeToVisit?: string
  relatedTrips?: TripCard[]
  seo?: SeoFields
}

// ─── TRIP (SAFARI) ────────────────────────────────────────────────────────────

export interface TripCard {
  _id: string
  title: string
  slug: string
  excerpt: string
  duration: string
  daysCount?: number
  price: number
  priceType: 'per_person' | 'per_group'
  difficulty?: 'easy' | 'moderate' | 'challenging'
  category?: string
  featured?: boolean
  heroImage: SanityImage
  destination?: { name: string; country: string; slug: string }
}

export interface ItineraryDay {
  day: number
  title: string
  description?: string
  location?: string
  meals?: string[]
}

export interface GalleryImage {
  image: SanityImage
  alt?: string
  caption?: string
}

export interface TripDetail extends TripCard {
  fullDescription?: unknown[]
  highlights?: string[]
  included?: string[]
  excluded?: string[]
  itinerary?: ItineraryDay[]
  gallery?: GalleryImage[]
  minPersons?: number
  maxPersons?: number
  seo?: SeoFields
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────

export interface BlogPostCard {
  _id: string
  title: string
  slug: string
  author?: string
  publishedAt: string
  category?: string
  summary: string
  featuredImage: SanityImage
}

export interface BlogPostDetail extends BlogPostCard {
  content?: unknown[]
  relatedTrips?: Pick<TripCard, 'title' | 'slug' | 'heroImage' | 'price' | 'duration'>[]
  seo?: SeoFields
}

// ─── TESTIMONIAL ─────────────────────────────────────────────────────────────

export interface Testimonial {
  _id: string
  name: string
  country?: string
  rating: number
  quote: string
  date?: string
  profilePhoto?: SanityImage
  bookedTrip?: { title: string; slug: string }
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface FaqItem {
  _id: string
  question: string
  answer: unknown[]
  category?: string
}

// ─── SITE SETTINGS ────────────────────────────────────────────────────────────

export interface SiteSettings {
  siteName: string
  tagline?: string
  logo?: SanityImage
  contactEmail?: string
  phone?: string
  address?: string
  chamberOfCommerceNumber?: string
  socialMedia?: {
    instagram?: string
    facebook?: string
    whatsapp?: string
    youtube?: string
  }
  defaultSeoTitle?: string
  defaultSeoDescription?: string
  defaultOgImage?: SanityImage
  footerText?: string
}
