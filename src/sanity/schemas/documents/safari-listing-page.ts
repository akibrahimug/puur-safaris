import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'safariListingPage',
  title: 'Safari Reizen Pagina',
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
      description: 'Bijv. "Safari Reizen".',
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
    prepare: () => ({ title: 'Safari Reizen Pagina' }),
  },
})
