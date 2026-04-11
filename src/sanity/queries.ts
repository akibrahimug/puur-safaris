import { groq } from 'next-sanity'

// ─── COMMON PROJECTIONS ───────────────────────────────────────────────────────

/** Included in every singleton / detail query so the app can detect fallback docs. */
const LANG_FIELD = `language,`

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
  *[_type == "siteSettings" && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
    ${LANG_FIELD}
    siteName,
    tagline,
    logo ${IMAGE_PROJECTION},
    contactEmail,
    phone,
    address,
    chamberOfCommerceNumber,
    socialMedia,
    mainNavigation[] { label, href },
    openingHours[] { label, hours },
    defaultSeoTitle,
    defaultSeoDescription,
    defaultOgImage ${IMAGE_PROJECTION},
    footerText,
    headerCtaLabel,
    headerCtaLink,
    footerColumn1Heading,
    footerColumn1Links[] { label, href },
    footerColumn2Heading,
    footerColumn2Links[] { label, href },
    footerColumn3Heading,
    copyrightText,
    privacyLabel,
    privacyLink,
    termsLabel,
    termsLink,
    cardLabels {
      featuredBadge, priceFromLabel, pricePerGroup, pricePerPerson,
      viewLabel, readArticleLabel, tripSingularLabel, tripPluralLabel, availableLabel
    },
    safariDetailLabels {
      durationLabel, levelLabel, groupSizeLabel, typeLabel,
      aboutTripHeading, highlightsHeading, itineraryHeading, includedExcludedHeading,
      includedLabel, excludedLabel, priceFromSidebarLabel, bookTripCtaLabel, eigenReisschemaCtaLabel,
      breakfastLabel, lunchLabel, dinnerLabel
    },
    destinationDetailLabels { climateHeading, bestTimeHeading, relatedTripsHeadingPrefix },
    blogDetailLabels { writtenByLabel, backToAllLabel, ctaHeading, ctaBody, ctaButton, gallerySidebarHeading, gallerySidebarDescription, galleryViewLabel, galleryCtaLabel }
  }
`

// ─── HOMEPAGE ─────────────────────────────────────────────────────────────────

export const homepageQuery = groq`{
  "featuredTrips": *[_type == "trip" && featured == true && active == true && language == $language]
    | order(_createdAt asc)[0...6] ${TRIP_CARD_PROJECTION},

  "destinations": *[_type == "destination" && language == $language] | order(displayOrder asc)[0...6] {
    _id,
    name,
    "slug": slug.current,
    country,
    continent,
    excerpt,
    heroImage ${IMAGE_PROJECTION}
  },

  "testimonials": *[_type == "testimonial" && visible == true && language == $language]
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

  "settings": *[_type == "siteSettings" && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
    siteName,
    tagline,
    defaultSeoTitle,
    defaultSeoDescription,
    defaultOgImage ${IMAGE_PROJECTION}
  }
}`

// ─── TRIP LISTING ─────────────────────────────────────────────────────────────

export const tripListQuery = groq`
  *[_type == "trip" && active == true && language == $language]
  | order(featured desc, _createdAt asc)
  ${TRIP_CARD_PROJECTION}
`

// ─── TRIP DETAIL ──────────────────────────────────────────────────────────────

export const tripDetailQuery = groq`
  *[_type == "trip" && slug.current == $slug && active == true && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
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
  *[_type == "trip" && active == true && language == $language]{ "slug": slug.current }
`

// ─── DESTINATION LISTING ──────────────────────────────────────────────────────

export const destinationListQuery = groq`
  *[_type == "destination" && language == $language] | order(displayOrder asc) {
    _id,
    name,
    "slug": slug.current,
    country,
    continent,
    excerpt,
    heroImage ${IMAGE_PROJECTION},
    "tripCount": count(*[_type == "trip" && active == true && language == $language && references(^._id)])
  }
`

// ─── DESTINATION DETAIL ───────────────────────────────────────────────────────

export const destinationDetailQuery = groq`
  *[_type == "destination" && slug.current == $slug && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
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
    gallery[] {
      asset->{ _id, url, metadata{ dimensions, lqip } },
      hotspot, crop, alt, caption
    },
    wildlifeHeading,
    wildlifeDescription,
    wildlifeHighlights[] {
      name,
      description,
      image ${IMAGE_PROJECTION}
    },
    communityHeading,
    communityDescription,
    communityImage ${IMAGE_PROJECTION},
    accommodationsHeading,
    accommodations[] {
      name,
      type,
      description,
      image ${IMAGE_PROJECTION},
      coordinates
    },
    coordinates,
    mapZoom,
    "relatedTrips": *[_type == "trip" && active == true && language == $language && references(^._id)]
      | order(featured desc)
      ${TRIP_CARD_PROJECTION},
    ${SEO_PROJECTION}
  }
`

export const destinationSlugsQuery = groq`
  *[_type == "destination" && language == $language]{ "slug": slug.current }
`

// ─── BLOG LISTING ─────────────────────────────────────────────────────────────

export const blogListQuery = groq`
  *[_type == "blogPost" && status == "published" && language == $language] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    author,
    publishedAt,
    category,
    summary,
    featuredImage ${IMAGE_PROJECTION},
    tags[] { label, placement, color }
  }
`

// ─── BLOG POST DETAIL ─────────────────────────────────────────────────────────

export const blogPostDetailQuery = groq`
  *[_type == "blogPost" && slug.current == $slug && status == "published" && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
    _id,
    title,
    "slug": slug.current,
    author,
    publishedAt,
    category,
    summary,
    content[] {
      ...,
      _type == "image" => {
        ...,
        asset->{ _id, url, metadata{ dimensions, lqip } }
      }
    },
    tags[] { label, placement, color },
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
  *[_type == "blogPost" && status == "published" && language == $language]{ "slug": slug.current }
`

// Preview query — no status filter, includes status + submitterEmail for admin preview
export const blogPostPreviewQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    author,
    publishedAt,
    category,
    summary,
    status,
    submitterEmail,
    content[] {
      ...,
      _type == "image" => {
        ...,
        asset->{ _id, url, metadata{ dimensions, lqip } }
      }
    },
    tags[] { label, placement, color },
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

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const faqQuery = groq`
  *[_type == "faqItem" && language == $language] | order(category asc, order asc) {
    _id,
    question,
    answer,
    category
  }
`

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

export const testimonialListQuery = groq`
  *[_type == "testimonial" && visible == true && language == $language] | order(_createdAt desc)[0...12] {
    _id,
    name,
    country,
    rating,
    quote,
    date,
    profilePhoto ${IMAGE_PROJECTION},
    "bookedTrip": bookedTrip->{ title, "slug": slug.current }
  }
`

// ─── HOMEPAGE (SINGLETON) ─────────────────────────────────────────────────────

export const homePageQuery = groq`
  *[_type == "homePage" && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
    language,
    heroEyebrow,
    heroHeadline,
    heroHeadlineAccent,
    heroSubtitle,
    heroImage ${IMAGE_PROJECTION},
    heroCta1Text,
    heroCta1Link,
    heroCta2Text,
    heroCta2Link,
    heroSocialProofAvatars[] { asset->{ _id, url }, alt },
    heroSocialProofText,
    trustItems[] { value, phrase },
    featuresEyebrow,
    featuresTitle,
    features[] { iconName, title, description },
    featuredTripsEyebrow,
    featuredTripsTitle,
    featuredTripsSubtitle,
    destinationsEyebrow,
    destinationsTitle,
    destinationsSubtitle,
    ctaEyebrow,
    ctaTitle,
    ctaSubtitle,
    featuredTripsCtaLabel,
    destinationsCtaLabel,
    ctaButton1Label,
    ctaButton1Link,
    ctaButton2Label,
    ctaButton2Link,
    testimonialsEyebrow,
    testimonialsTitle,
    testimonialsSubtitle,
    testimonialsVerifiedLabel,
    testimonialsMoreLabel,
    testimonialsBeginLabel,
    ${SEO_PROJECTION}
  }
`

// ─── ABOUT PAGE (SINGLETON) ──────────────────────────────────────────────────

export const aboutPageQuery = groq`
  *[_type == "aboutPage" && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
    ${LANG_FIELD}
    heroTitle,
    heroSubtitle,
    heroImage ${IMAGE_PROJECTION},
    backgroundTitle,
    backgroundText,
    missionTitle,
    missionText,
    teamTitle,
    teamMembers[] {
      name,
      role,
      image ${IMAGE_PROJECTION},
      bio
    },
    uniquePointsTitle,
    uniquePoints[] { title, text, iconName },
    communityTitle,
    communityText,
    communityCtaText,
    communityCtaLink,
    ${SEO_PROJECTION}
  }
`

// ─── CONTACT PAGE (SINGLETON) ────────────────────────────────────────────────

export const contactPageQuery = groq`
  *[_type == "contactPage" && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
    ${LANG_FIELD}
    heroTitle,
    heroImage ${IMAGE_PROJECTION},
    heroSubtitle,
    sidebarHeading,
    sidebarDescription,
    phoneLabel,
    emailLabel,
    addressLabel,
    openingHoursLabel,
    whatsappCtaLabel,
    responseTimeText,
    ${SEO_PROJECTION}
  }
`

// ─── SAFARI LISTING PAGE (SINGLETON) ─────────────────────────────────────────

export const safariListingPageQuery = groq`
  *[_type == "safariListingPage" && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
    ${LANG_FIELD} heroTitle, heroImage ${IMAGE_PROJECTION}, heroSubtitle, ${SEO_PROJECTION}
  }
`

// ─── DESTINATION LISTING PAGE (SINGLETON) ────────────────────────────────────

export const destinationListingPageQuery = groq`
  *[_type == "destinationListingPage" && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
    ${LANG_FIELD} heroTitle, heroImage ${IMAGE_PROJECTION}, heroSubtitle, ${SEO_PROJECTION}
  }
`

// ─── FAQ PAGE (SINGLETON) ────────────────────────────────────────────────────

export const faqPageQuery = groq`
  *[_type == "faqPage" && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
    ${LANG_FIELD}
    heroTitle,
    heroImage ${IMAGE_PROJECTION},
    heroSubtitle,
    searchPlaceholder,
    categoriesHeading,
    viewAllLabel,
    noResultsText,
    resetSearchLabel,
    ${SEO_PROJECTION}
  }
`

// ─── BLOG PAGE (SINGLETON) ───────────────────────────────────────────────────

export const blogPageQuery = groq`
  *[_type == "blogPage" && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
    ${LANG_FIELD}
    heroTitle,
    heroSubtitle,
    heroImage ${IMAGE_PROJECTION},
    storiesSectionHeading,
    featuredBadgeText,
    readArticleLabel,
    wildlifeEyebrow,
    wildlifeTitle,
    wildlifeSubtitle,
    guidesSectionTitle,
    guidesDescription,
    guidesCtaLabel,
    guidesCtaLink,
    readerCtaBadge,
    readerCtaHeading,
    readerCtaBody,
    readerCtaButton,
    ${SEO_PROJECTION}
  }
`

// ─── EIGEN REISSCHEMA PAGE (SINGLETON) ───────────────────────────────────────

export const eigenReisschemaPageQuery = groq`
  *[_type == "eigenReisschemaPage" && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
    ${LANG_FIELD} heroEyebrow, heroTitle, heroImage ${IMAGE_PROJECTION}, heroSubtitle, ${SEO_PROJECTION}
  }
`

// ─── BLOG SUBMISSION PAGE (SINGLETON) ────────────────────────────────────────

export const blogSubmissionPageQuery = groq`
  *[_type == "blogSubmissionPage" && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
    ${LANG_FIELD}
    heroTitle,
    heroSubtitle,
    heroImage ${IMAGE_PROJECTION},
    instructionsHeading,
    step1Text,
    step2Text,
    step3Text,
    successHeading, successBody, successResetLabel,
    submitLabel, submitLoadingLabel, verificationLabel, writtenByPrefix,
    gallerySidebarHeading, gallerySidebarDescription, galleryAddLabel, galleryOverflowLabel,
    legalConsent1, legalConsent2,
    ${SEO_PROJECTION}
  }
`

// ─── LEGAL PAGE ─────────────────────────────────────────────────────────────

export const legalPageQuery = groq`
  *[_type == "legalPage" && slug.current in $slugs && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
    ${LANG_FIELD}
    title,
    "slug": slug.current,
    heroImage ${IMAGE_PROJECTION},
    body[] { ..., _type == "image" => { ..., asset->{ _id, url, metadata{ dimensions, lqip } } } },
    ${SEO_PROJECTION}
  }
`

// ─── BOOKING PAGE (SINGLETON) ────────────────────────────────────────────────

export const bookingPageQuery = groq`
  *[_type == "bookingPage" && language in [$language, "nl"]] | order(select(language == $language => 0, 1) asc)[0] {
    ${LANG_FIELD}
    heroEyebrow,
    heroImage ${IMAGE_PROJECTION},
    heroSubtitle
  }
`
