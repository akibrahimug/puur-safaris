import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country / Woonplaats',
      type: 'string',
      description: 'E.g. "Amsterdam, Nederland"',
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5 sterren)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bookedTrip',
      title: 'Booked Safari',
      type: 'reference',
      to: [{ type: 'trip' }],
    }),
    defineField({
      name: 'date',
      title: 'Trip Date',
      type: 'date',
      options: { dateFormat: 'MM-YYYY' },
    }),
    defineField({
      name: 'profilePhoto',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'visible',
      title: 'Weergeven op website?',
      type: 'boolean',
      initialValue: true,
      description: 'Vink uit om deze getuigenis tijdelijk te verbergen.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'quote',
      media: 'profilePhoto',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? subtitle.slice(0, 60) + '…' : '',
        media,
      }
    },
  },
})
