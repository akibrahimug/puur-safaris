import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Getuigenissen',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Land / Woonplaats',
      type: 'string',
      description: 'Bijv. "Amsterdam, Nederland"',
    }),
    defineField({
      name: 'rating',
      title: 'Beoordeling (1-5 sterren)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'quote',
      title: 'Citaat',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bookedTrip',
      title: 'Geboekte Safari',
      type: 'reference',
      to: [{ type: 'trip' }],
    }),
    defineField({
      name: 'date',
      title: 'Reisdatum',
      type: 'date',
      options: { dateFormat: 'MM-YYYY' },
    }),
    defineField({
      name: 'profilePhoto',
      title: 'Profielfoto',
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
