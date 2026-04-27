import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bookingPage',
  title: 'Bookingspagina',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      description: 'E.g. "Boeking".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'E.g. "Vul uw gegevens in en wij bevestigen uw boeking binnen 2 werkdagen.".',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Bookingspagina' }),
  },
})
