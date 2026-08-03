/**
 * Translation configuration — defines which fields are translatable per document type.
 *
 * `text`         — plain string fields (DeepL text translation)
 * `textArray`    — arrays of plain strings (e.g. highlights, included, excluded)
 * `portableText` — Portable Text block arrays (walk the tree, translate spans)
 * `nested`       — arrays of objects with their own translatable sub-fields
 *
 * Fields NOT listed here are passed through untranslated (slugs, images, numbers, refs, etc.)
 */

export interface NestedFieldConfig {
  text: string[]
  portableText: string[]
}

export interface TranslatableFieldConfig {
  text: string[]
  textArray: string[]
  portableText: string[]
  nested: Record<string, NestedFieldConfig>
}

export const translatableFields: Record<string, TranslatableFieldConfig> = {
  trip: {
    text: ['title', 'excerpt', 'duration', 'difficulty', 'category'],
    textArray: ['highlights', 'included', 'excluded'],
    portableText: ['fullDescription'],
    nested: {
      itinerary: { text: ['title', 'description', 'location'], portableText: [] },
    },
  },
  destination: {
    text: ['name', 'country', 'continent', 'excerpt', 'climate', 'bestTimeToVisit', 'wildlifeHeading', 'wildlifeDescription', 'communityHeading', 'accommodationsHeading'],
    textArray: [],
    portableText: ['description', 'communityDescription'],
    nested: {
      wildlifeHighlights: { text: ['name', 'description'], portableText: [] },
      accommodations: { text: ['name', 'type', 'description'], portableText: [] },
    },
  },
  blogPost: {
    text: ['title', 'summary', 'author', 'category'],
    textArray: [],
    portableText: ['content'],
    nested: {
      tags: { text: ['label'], portableText: [] },
    },
  },
  testimonial: {
    text: ['name', 'country', 'quote'],
    textArray: [],
    portableText: [],
    nested: {},
  },
  googleReview: {
    text: ['country', 'reviewText'],
    textArray: [],
    portableText: [],
    nested: {},
  },
  faqItem: {
    text: ['question', 'category'],
    textArray: [],
    portableText: ['answer'],
    nested: {},
  },
  siteSettings: {
    text: [
      'siteName', 'tagline', 'defaultSeoTitle', 'defaultSeoDescription',
      'footerText', 'headerCtaLabel', 'footerColumn1Heading', 'footerColumn2Heading',
      'footerColumn3Heading', 'copyrightText', 'privacyLabel', 'termsLabel',
    ],
    textArray: [],
    portableText: [],
    nested: {
      mainNavigation: { text: ['label'], portableText: [] },
      footerColumn1Links: { text: ['label'], portableText: [] },
      footerColumn2Links: { text: ['label'], portableText: [] },
      openingHours: { text: ['label'], portableText: [] },
      cardLabels: { text: ['featuredBadge', 'priceFromLabel', 'pricePerGroup', 'pricePerPerson', 'viewLabel', 'readArticleLabel', 'tripSingularLabel', 'tripPluralLabel', 'availableLabel'], portableText: [] },
      safariDetailLabels: { text: ['durationLabel', 'levelLabel', 'groupSizeLabel', 'typeLabel', 'aboutTripHeading', 'highlightsHeading', 'itineraryHeading', 'includedExcludedHeading', 'includedLabel', 'excludedLabel', 'priceFromSidebarLabel', 'bookTripCtaLabel', 'eigenReisschemaCtaLabel', 'breakfastLabel', 'lunchLabel', 'dinnerLabel'], portableText: [] },
      destinationDetailLabels: { text: ['climateHeading', 'bestTimeHeading', 'relatedTripsHeadingPrefix'], portableText: [] },
      blogDetailLabels: { text: ['writtenByLabel', 'backToAllLabel', 'ctaHeading', 'ctaBody', 'ctaButton', 'gallerySidebarHeading', 'gallerySidebarDescription', 'galleryViewLabel', 'galleryCtaLabel'], portableText: [] },
    },
  },
  homePage: {
    text: [
      'heroHeadline', 'heroHeadlineAccent', 'heroSubtitle',
      'heroCta1Text', 'heroCta2Text', 'heroSocialProofText',
      'featuresEyebrow', 'featuresTitle',
      'featuredTripsEyebrow', 'featuredTripsTitle', 'featuredTripsSubtitle',
      'destinationsEyebrow', 'destinationsTitle', 'destinationsSubtitle',
      'ctaEyebrow', 'ctaTitle', 'ctaSubtitle',
      'featuredTripsCtaLabel', 'destinationsCtaLabel',
      'ctaButton1Label', 'ctaButton2Label',
      'testimonialsEyebrow', 'testimonialsTitle', 'testimonialsSubtitle',
      'testimonialsVerifiedLabel', 'testimonialsMoreLabel', 'testimonialsBeginLabel',
    ],
    textArray: [],
    portableText: [],
    nested: {
      trustItems: { text: ['value', 'phrase'], portableText: [] },
      features: { text: ['title', 'description'], portableText: [] },
    },
  },
  aboutPage: {
    text: ['heroTitle', 'heroSubtitle', 'backgroundTitle', 'missionTitle', 'teamTitle', 'uniquePointsTitle', 'communityTitle', 'communityCtaText'],
    textArray: [],
    portableText: ['backgroundText', 'missionText', 'communityText'],
    nested: {
      teamMembers: { text: ['name', 'role', 'bio'], portableText: [] },
      uniquePoints: { text: ['title', 'text'], portableText: [] },
    },
  },
  contactPage: {
    text: ['heroTitle', 'heroSubtitle', 'sidebarHeading', 'sidebarDescription', 'phoneLabel', 'emailLabel', 'addressLabel', 'openingHoursLabel', 'whatsappCtaLabel', 'responseTimeText'],
    textArray: [],
    portableText: [],
    nested: {},
  },
  safariListingPage: {
    text: ['heroTitle', 'heroSubtitle'],
    textArray: [],
    portableText: [],
    nested: {},
  },
  destinationListingPage: {
    text: ['heroTitle', 'heroSubtitle'],
    textArray: [],
    portableText: [],
    nested: {},
  },
  faqPage: {
    text: ['heroTitle', 'heroSubtitle', 'searchPlaceholder', 'categoriesHeading', 'viewAllLabel', 'noResultsText', 'resetSearchLabel'],
    textArray: [],
    portableText: [],
    nested: {},
  },
  blogPage: {
    text: ['heroTitle', 'heroSubtitle', 'storiesSectionHeading', 'featuredBadgeText', 'readArticleLabel', 'wildlifeEyebrow', 'wildlifeTitle', 'wildlifeSubtitle', 'guidesSectionTitle', 'guidesDescription', 'guidesCtaLabel', 'readerCtaBadge', 'readerCtaHeading', 'readerCtaBody', 'readerCtaButton'],
    textArray: [],
    portableText: [],
    nested: {},
  },
  eigenReisschemaPage: {
    text: ['heroEyebrow', 'heroTitle', 'heroSubtitle'],
    textArray: [],
    portableText: [],
    nested: {},
  },
  blogSubmissionPage: {
    text: ['heroTitle', 'heroSubtitle', 'instructionsHeading', 'step1Text', 'step2Text', 'step3Text', 'successHeading', 'successBody', 'successResetLabel', 'submitLabel', 'submitLoadingLabel', 'verificationLabel', 'writtenByPrefix', 'gallerySidebarHeading', 'gallerySidebarDescription', 'galleryAddLabel', 'galleryOverflowLabel', 'legalConsent1', 'legalConsent2'],
    textArray: [],
    portableText: [],
    nested: {},
  },
  bookingPage: {
    text: ['heroEyebrow', 'heroSubtitle'],
    textArray: [],
    portableText: [],
    nested: {},
  },
  legalPage: {
    text: ['title', 'slug'],
    textArray: [],
    portableText: ['body'],
    nested: {},
  },
}
