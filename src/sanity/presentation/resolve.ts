import {
  defineLocations,
  type PresentationPluginOptions,
} from 'sanity/presentation'

// All content is authored in NL and auto-translated into EN on read,
// so previews point at the NL route. Editors can manually switch to /en
// in the browser to see the translated version.
const NL = '/nl'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    trip: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Safari Reis', href: `${NL}/safaris/${doc?.slug}` },
          { title: 'Alle Safari Reizen', href: `${NL}/safaris` },
        ],
      }),
    }),
    destination: defineLocations({
      select: { title: 'name', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Bestemming', href: `${NL}/destinations/${doc?.slug}` },
          { title: 'Alle Bestemmingen', href: `${NL}/destinations` },
        ],
      }),
    }),
    blogPost: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Blog Post', href: `${NL}/blog/${doc?.slug}` },
          { title: 'Blog Overzicht', href: `${NL}/blog` },
        ],
      }),
    }),
    homePage: defineLocations({
      select: { title: 'heroHeadline' },
      resolve: () => ({ locations: [{ title: 'Homepage', href: NL }] }),
    }),
    aboutPage: defineLocations({
      select: { title: 'heroTitle' },
      resolve: () => ({ locations: [{ title: 'Over Ons', href: `${NL}/about` }] }),
    }),
    blogPage: defineLocations({
      select: { title: 'heroTitle' },
      resolve: () => ({ locations: [{ title: 'Blog Overzicht', href: `${NL}/blog` }] }),
    }),
    contactPage: defineLocations({
      select: { title: 'heroTitle' },
      resolve: () => ({ locations: [{ title: 'Contact', href: `${NL}/contact` }] }),
    }),
    safariListingPage: defineLocations({
      select: { title: 'heroTitle' },
      resolve: () => ({ locations: [{ title: 'Safari Reizen', href: `${NL}/safaris` }] }),
    }),
    destinationListingPage: defineLocations({
      select: { title: 'heroTitle' },
      resolve: () => ({ locations: [{ title: 'Bestemmingen', href: `${NL}/destinations` }] }),
    }),
    faqPage: defineLocations({
      select: { title: 'heroTitle' },
      resolve: () => ({ locations: [{ title: 'FAQ', href: `${NL}/faq` }] }),
    }),
    eigenReisschemaPage: defineLocations({
      select: { title: 'heroTitle' },
      resolve: () => ({ locations: [{ title: 'Eigen Reisschema', href: `${NL}/custom-itinerary` }] }),
    }),
    blogSubmissionPage: defineLocations({
      select: { title: 'heroTitle' },
      resolve: () => ({ locations: [{ title: 'Blog Inzenden', href: `${NL}/blog/submit` }] }),
    }),
    bookingPage: defineLocations({
      select: { title: 'heroTitle' },
      resolve: () => ({ locations: [{ title: 'Boeken', href: `${NL}/book` }] }),
    }),
    siteSettings: defineLocations({
      select: { title: 'siteName' },
      resolve: () => ({ locations: [{ title: 'Hele Website', href: NL }] }),
    }),
    faqItem: defineLocations({
      select: { title: 'question' },
      resolve: () => ({ locations: [{ title: 'FAQ Pagina', href: `${NL}/faq` }] }),
    }),
    testimonial: defineLocations({
      select: { title: 'name' },
      resolve: () => ({ locations: [{ title: 'Homepage', href: NL }] }),
    }),
    googleReview: defineLocations({
      select: { title: 'authorName' },
      resolve: () => ({ locations: [{ title: 'Homepage', href: NL }] }),
    }),
  },
}
