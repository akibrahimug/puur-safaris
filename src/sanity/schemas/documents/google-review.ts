import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'googleReview',
  title: 'Google Reviews',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country / City',
      type: 'string',
      description: 'Optional. E.g. "Rotterdam, Netherlands"',
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5 stars)',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'reviewText',
      title: 'Review Text',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reviewDate',
      title: 'Review Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
    defineField({
      name: 'authorPhoto',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional. Without a photo a coloured initial is shown.',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Google review URL',
      type: 'url',
      description: 'Optional. Direct link to the review on Google.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage?',
      type: 'boolean',
      initialValue: true,
      description: 'Tick to show this review on the homepage.',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Order (featured)',
      type: 'number',
      description: 'Lower = earlier. Leave empty to sort by date.',
    }),
    defineField({
      name: 'visible',
      title: 'Show on website?',
      type: 'boolean',
      initialValue: true,
      description: 'Untick to temporarily hide this review without deleting it.',
    }),
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'reviewText',
      media: 'authorPhoto',
      rating: 'rating',
      featured: 'featured',
      visible: 'visible',
    },
    prepare({ title, subtitle, media, rating, featured, visible }) {
      const stars = '★'.repeat(rating ?? 0) + '☆'.repeat(Math.max(0, 5 - (rating ?? 0)))
      const flags = [!visible && '(hidden)', featured && '★ featured'].filter(Boolean).join(' ')
      return {
        title: `${title ?? 'Unknown'} — ${stars}`,
        subtitle: [flags, subtitle ? subtitle.slice(0, 70) + (subtitle.length > 70 ? '…' : '') : ''].filter(Boolean).join(' · '),
        media,
      }
    },
  },
  orderings: [
    {
      name: 'displayOrder',
      title: 'Order (featured first)',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'displayOrder', direction: 'asc' },
        { field: 'reviewDate', direction: 'desc' },
      ],
    },
    {
      name: 'dateDesc',
      title: 'Date (newest first)',
      by: [{ field: 'reviewDate', direction: 'desc' }],
    },
  ],
})
