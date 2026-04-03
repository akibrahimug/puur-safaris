import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'destinationListingPage',
  title: 'Bestemmingen Pagina',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Titel',
      type: 'string',
      group: 'hero',
      description: 'Bijv. "Bestemmingen".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Ondertitel',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Bestemmingen Pagina' }),
  },
})
