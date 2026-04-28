import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bookingPage',
  title: 'Booking Page',
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
      description: 'E.g. "Booking".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'E.g. "Fill in your details and we will confirm your booking within 2 business days.".',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Booking Page' }),
  },
})
