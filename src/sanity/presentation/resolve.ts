import {
  defineLocations,
  type PresentationPluginOptions,
} from 'sanity/presentation'

/** Return the locale prefix for a document, defaulting to 'nl'. */
function prefix(doc: { language?: string } | null | undefined): string {
  return `/${doc?.language || 'nl'}`
}

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    trip: defineLocations({
      select: { title: 'title', slug: 'slug.current', language: 'language' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Safari Reis', href: `${prefix(doc)}/safari-reizen/${doc?.slug}` },
          { title: 'Alle Safari Reizen', href: `${prefix(doc)}/safari-reizen` },
        ],
      }),
    }),
    destination: defineLocations({
      select: { title: 'name', slug: 'slug.current', language: 'language' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Bestemming', href: `${prefix(doc)}/bestemmingen/${doc?.slug}` },
          { title: 'Alle Bestemmingen', href: `${prefix(doc)}/bestemmingen` },
        ],
      }),
    }),
    blogPost: defineLocations({
      select: { title: 'title', slug: 'slug.current', language: 'language' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Blog Post', href: `${prefix(doc)}/blog/${doc?.slug}` },
          { title: 'Blog Overzicht', href: `${prefix(doc)}/blog` },
        ],
      }),
    }),
    homePage: defineLocations({
      select: { title: 'heroHeadline', language: 'language' },
      resolve: (doc) => ({
        locations: [{ title: 'Homepage', href: `${prefix(doc)}` }],
      }),
    }),
    aboutPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => ({
        locations: [{ title: 'Over Ons', href: `${prefix(doc)}/over-ons` }],
      }),
    }),
    blogPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => ({
        locations: [{ title: 'Blog Overzicht', href: `${prefix(doc)}/blog` }],
      }),
    }),
    contactPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => ({
        locations: [{ title: 'Contact', href: `${prefix(doc)}/contact` }],
      }),
    }),
    safariListingPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => ({
        locations: [{ title: 'Safari Reizen', href: `${prefix(doc)}/safari-reizen` }],
      }),
    }),
    destinationListingPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => ({
        locations: [{ title: 'Bestemmingen', href: `${prefix(doc)}/bestemmingen` }],
      }),
    }),
    faqPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => ({
        locations: [{ title: 'FAQ', href: `${prefix(doc)}/faq` }],
      }),
    }),
    eigenReisschemaPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => ({
        locations: [{ title: 'Eigen Reisschema', href: `${prefix(doc)}/eigen-reisschema` }],
      }),
    }),
    blogSubmissionPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => ({
        locations: [{ title: 'Blog Inzenden', href: `${prefix(doc)}/blog/inzenden` }],
      }),
    }),
    bookingPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => ({
        locations: [{ title: 'Boeken', href: `${prefix(doc)}/boeken` }],
      }),
    }),
    siteSettings: defineLocations({
      select: { title: 'siteName', language: 'language' },
      resolve: (doc) => ({
        locations: [{ title: 'Hele Website', href: `${prefix(doc)}` }],
      }),
    }),
    faqItem: defineLocations({
      select: { title: 'question', language: 'language' },
      resolve: (doc) => ({
        locations: [{ title: 'FAQ Pagina', href: `${prefix(doc)}/faq` }],
      }),
    }),
    testimonial: defineLocations({
      select: { title: 'name', language: 'language' },
      resolve: (doc) => ({
        locations: [{ title: 'Homepage', href: `${prefix(doc)}` }],
      }),
    }),
  },
}
