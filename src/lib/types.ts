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

export interface NavLink {
  label: string
  href: string
}

export interface OpeningHoursEntry {
  label: string
  hours: string
}

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
  mainNavigation?: NavLink[]
  openingHours?: OpeningHoursEntry[]
  defaultSeoTitle?: string
  defaultSeoDescription?: string
  defaultOgImage?: SanityImage
  footerText?: string
  headerCtaLabel?: string
  headerCtaLink?: string
  footerColumn1Heading?: string
  footerColumn1Links?: NavLink[]
  footerColumn2Heading?: string
  footerColumn2Links?: NavLink[]
  footerColumn3Heading?: string
  copyrightText?: string
  privacyLabel?: string
  privacyLink?: string
  termsLabel?: string
  termsLink?: string
  cardLabels?: {
    featuredBadge?: string
    priceFromLabel?: string
    pricePerGroup?: string
    pricePerPerson?: string
    viewLabel?: string
    readArticleLabel?: string
    tripSingularLabel?: string
    tripPluralLabel?: string
    availableLabel?: string
  }
  safariDetailLabels?: {
    durationLabel?: string
    levelLabel?: string
    groupSizeLabel?: string
    typeLabel?: string
    aboutTripHeading?: string
    highlightsHeading?: string
    itineraryHeading?: string
    includedExcludedHeading?: string
    includedLabel?: string
    excludedLabel?: string
    priceFromSidebarLabel?: string
    bookTripCtaLabel?: string
    eigenReisschemaCtaLabel?: string
    breakfastLabel?: string
    lunchLabel?: string
    dinnerLabel?: string
  }
  destinationDetailLabels?: {
    climateHeading?: string
    bestTimeHeading?: string
    relatedTripsHeadingPrefix?: string
  }
  blogDetailLabels?: {
    writtenByLabel?: string
    backToAllLabel?: string
    ctaHeading?: string
    ctaBody?: string
    ctaButton?: string
    gallerySidebarHeading?: string
    gallerySidebarDescription?: string
    galleryViewLabel?: string
    galleryCtaLabel?: string
  }
}

// ─── HOMEPAGE ────────────────────────────────────────────────────────────────

export interface TrustItem {
  value: string
  phrase: string
}

export interface FeatureCard {
  iconName?: string
  title: string
  description?: string
}

export interface HomePage {
  heroEyebrow?: string
  heroHeadline?: string
  heroHeadlineAccent?: string
  heroSubtitle?: string
  heroImage?: SanityImage
  heroCta1Text?: string
  heroCta1Link?: string
  heroCta2Text?: string
  heroCta2Link?: string
  heroSocialProofText?: string
  trustItems?: TrustItem[]
  featuresEyebrow?: string
  featuresTitle?: string
  features?: FeatureCard[]
  featuredTripsEyebrow?: string
  featuredTripsTitle?: string
  featuredTripsSubtitle?: string
  destinationsEyebrow?: string
  destinationsTitle?: string
  destinationsSubtitle?: string
  ctaEyebrow?: string
  ctaTitle?: string
  ctaSubtitle?: string
  featuredTripsCtaLabel?: string
  destinationsCtaLabel?: string
  ctaButton1Label?: string
  ctaButton1Link?: string
  ctaButton2Label?: string
  ctaButton2Link?: string
  testimonialsEyebrow?: string
  testimonialsTitle?: string
  testimonialsSubtitle?: string
  testimonialsVerifiedLabel?: string
  testimonialsMoreLabel?: string
  testimonialsBeginLabel?: string
  seo?: SeoFields
}

// ─── ABOUT PAGE ──────────────────────────────────────────────────────────────

export interface TeamMember {
  name: string
  role?: string
  image?: SanityImage
  bio?: string
}

export interface UniquePoint {
  title: string
  text?: string
  iconName?: string
}

export interface AboutPage {
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: SanityImage
  backgroundTitle?: string
  backgroundText?: unknown[]
  missionTitle?: string
  missionText?: unknown[]
  teamTitle?: string
  teamMembers?: TeamMember[]
  uniquePointsTitle?: string
  uniquePoints?: UniquePoint[]
  communityTitle?: string
  communityText?: unknown[]
  communityCtaText?: string
  communityCtaLink?: string
  seo?: SeoFields
}

// ─── CONTACT PAGE ───────────────────────────────────────────────────────────

export interface ContactPage {
  heroTitle?: string
  heroSubtitle?: string
  sidebarHeading?: string
  sidebarDescription?: string
  phoneLabel?: string
  emailLabel?: string
  addressLabel?: string
  openingHoursLabel?: string
  whatsappCtaLabel?: string
  responseTimeText?: string
  seo?: SeoFields
}

// ─── SIMPLE HERO PAGES ──────────────────────────────────────────────────────

export interface SimpleHeroPage {
  heroTitle?: string
  heroSubtitle?: string
  seo?: SeoFields
}

// ─── FAQ PAGE ───────────────────────────────────────────────────────────────

export interface FaqPage extends SimpleHeroPage {
  searchPlaceholder?: string
  categoriesHeading?: string
  viewAllLabel?: string
  noResultsText?: string
  resetSearchLabel?: string
}

// ─── BLOG PAGE ──────────────────────────────────────────────────────────────

export interface BlogPage {
  heroTitle?: string
  heroSubtitle?: string
  storiesSectionHeading?: string
  featuredBadgeText?: string
  readArticleLabel?: string
  wildlifeEyebrow?: string
  wildlifeTitle?: string
  wildlifeSubtitle?: string
  guidesSectionTitle?: string
  guidesDescription?: string
  guidesCtaLabel?: string
  guidesCtaLink?: string
  readerCtaBadge?: string
  readerCtaHeading?: string
  readerCtaBody?: string
  readerCtaButton?: string
  seo?: SeoFields
}

// ─── EIGEN REISSCHEMA PAGE ──────────────────────────────────────────────────

export interface EigenReisschemaPage {
  heroEyebrow?: string
  heroTitle?: string
  heroSubtitle?: string
  seo?: SeoFields
}

// ─── BLOG SUBMISSION PAGE ───────────────────────────────────────────────────

export interface BlogSubmissionPage {
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: SanityImage
  instructionsHeading?: string
  step1Text?: string
  step2Text?: string
  step3Text?: string
  successHeading?: string
  successBody?: string
  successResetLabel?: string
  submitLabel?: string
  submitLoadingLabel?: string
  verificationLabel?: string
  writtenByPrefix?: string
  gallerySidebarHeading?: string
  gallerySidebarDescription?: string
  galleryAddLabel?: string
  galleryOverflowLabel?: string
  legalConsent1?: string
  legalConsent2?: string
  seo?: SeoFields
}

// ─── BOOKING PAGE ───────────────────────────────────────────────────────────

export interface BookingPage {
  heroEyebrow?: string
  heroSubtitle?: string
}
