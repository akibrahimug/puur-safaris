import {
  defineLocations,
  type PresentationPluginOptions,
} from 'sanity/presentation'

// Each doc carries a `language` field once the i18n plugin is on.
// Preview links route to the locale-matching public URL so the editor
// always sees the version they're editing.

const NL = '/nl'
const EN = '/en'

function langPrefix(language?: string | null) {
  return language === 'en' ? EN : NL
}

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    trip: defineLocations({
      select: { title: 'title', slug: 'slug.current', language: 'language' },
      resolve: (doc) => {
        const prefix = langPrefix(doc?.language)
        const tripsPath = doc?.language === 'en' ? '/safaris' : '/safari-reizen'
        return {
          locations: [
            { title: doc?.title || 'Safari Reis', href: `${prefix}${tripsPath}/${doc?.slug}` },
            { title: 'Alle Safari Reizen', href: `${prefix}${tripsPath}` },
          ],
        }
      },
    }),
    destination: defineLocations({
      select: { title: 'name', slug: 'slug.current', language: 'language' },
      resolve: (doc) => {
        const prefix = langPrefix(doc?.language)
        const destPath = doc?.language === 'en' ? '/destinations' : '/bestemmingen'
        return {
          locations: [
            { title: doc?.title || 'Bestemming', href: `${prefix}${destPath}/${doc?.slug}` },
            { title: 'Alle Bestemmingen', href: `${prefix}${destPath}` },
          ],
        }
      },
    }),
    blogPost: defineLocations({
      select: { title: 'title', slug: 'slug.current', language: 'language' },
      resolve: (doc) => {
        const prefix = langPrefix(doc?.language)
        return {
          locations: [
            { title: doc?.title || 'Blog Post', href: `${prefix}/blog/${doc?.slug}` },
            { title: 'Blog Overzicht', href: `${prefix}/blog` },
          ],
        }
      },
    }),
    homePage: defineLocations({
      select: { title: 'heroHeadline', language: 'language' },
      resolve: (doc) => ({ locations: [{ title: 'Homepage', href: langPrefix(doc?.language) }] }),
    }),
    aboutPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => {
        const prefix = langPrefix(doc?.language)
        const path = doc?.language === 'en' ? '/about' : '/over-ons'
        return { locations: [{ title: 'Over Ons', href: `${prefix}${path}` }] }
      },
    }),
    blogPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => ({ locations: [{ title: 'Blog Overzicht', href: `${langPrefix(doc?.language)}/blog` }] }),
    }),
    contactPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => ({ locations: [{ title: 'Contact', href: `${langPrefix(doc?.language)}/contact` }] }),
    }),
    safariListingPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => {
        const prefix = langPrefix(doc?.language)
        const path = doc?.language === 'en' ? '/safaris' : '/safari-reizen'
        return { locations: [{ title: 'Safari Reizen', href: `${prefix}${path}` }] }
      },
    }),
    destinationListingPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => {
        const prefix = langPrefix(doc?.language)
        const path = doc?.language === 'en' ? '/destinations' : '/bestemmingen'
        return { locations: [{ title: 'Bestemmingen', href: `${prefix}${path}` }] }
      },
    }),
    faqPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => ({ locations: [{ title: 'FAQ', href: `${langPrefix(doc?.language)}/faq` }] }),
    }),
    eigenReisschemaPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => {
        const prefix = langPrefix(doc?.language)
        const path = doc?.language === 'en' ? '/custom-itinerary' : '/eigen-reisschema'
        return { locations: [{ title: 'Eigen Reisschema', href: `${prefix}${path}` }] }
      },
    }),
    blogSubmissionPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => {
        const prefix = langPrefix(doc?.language)
        const path = doc?.language === 'en' ? '/blog/submit' : '/blog/inzenden'
        return { locations: [{ title: 'Blog Inzenden', href: `${prefix}${path}` }] }
      },
    }),
    bookingPage: defineLocations({
      select: { title: 'heroTitle', language: 'language' },
      resolve: (doc) => ({ locations: [{ title: 'Boeken', href: `${langPrefix(doc?.language)}` }] }),
    }),
    siteSettings: defineLocations({
      select: { title: 'siteName', language: 'language' },
      resolve: (doc) => ({ locations: [{ title: 'Hele Website', href: langPrefix(doc?.language) }] }),
    }),
    faqItem: defineLocations({
      select: { title: 'question', language: 'language' },
      resolve: (doc) => ({ locations: [{ title: 'FAQ Pagina', href: `${langPrefix(doc?.language)}/faq` }] }),
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
