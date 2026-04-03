import {
  defineLocations,
  type PresentationPluginOptions,
} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    trip: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Safari Reis', href: `/safari-reizen/${doc?.slug}` },
          { title: 'Alle Safari Reizen', href: '/safari-reizen' },
        ],
      }),
    }),
    destination: defineLocations({
      select: { title: 'name', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Bestemming', href: `/bestemmingen/${doc?.slug}` },
          { title: 'Alle Bestemmingen', href: '/bestemmingen' },
        ],
      }),
    }),
    blogPost: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Blog Post', href: `/blog/${doc?.slug}` },
          { title: 'Blog Overzicht', href: '/blog' },
        ],
      }),
    }),
    homePage: defineLocations({
      select: { title: 'heroHeadline' },
      resolve: () => ({
        locations: [{ title: 'Homepage', href: '/' }],
      }),
    }),
    aboutPage: defineLocations({
      select: { title: 'heroTitle' },
      resolve: () => ({
        locations: [{ title: 'Over Ons', href: '/over-ons' }],
      }),
    }),
    siteSettings: defineLocations({
      select: { title: 'siteName' },
      resolve: () => ({
        locations: [{ title: 'Hele Website', href: '/' }],
      }),
    }),
    faqItem: defineLocations({
      select: { title: 'question' },
      resolve: () => ({
        locations: [{ title: 'FAQ Pagina', href: '/faq' }],
      }),
    }),
    testimonial: defineLocations({
      select: { title: 'name' },
      resolve: () => ({
        locations: [{ title: 'Homepage', href: '/' }],
      }),
    }),
  },
}
