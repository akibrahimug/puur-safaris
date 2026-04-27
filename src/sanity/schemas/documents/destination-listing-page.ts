import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'destinationListingPage',
  title: 'Destinations Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
      description: 'Backgroundafbeelding voor de hero sectie.',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      description: 'E.g. "Bestemmingen".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
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
    prepare: () => ({ title: 'Destinations Page' }),
  },
})
