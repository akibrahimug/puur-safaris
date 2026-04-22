import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'googleReview',
  title: 'Google Reviews',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Naam',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Land / Woonplaats',
      type: 'string',
      description: 'Optioneel. Bijv. "Rotterdam, Nederland"',
    }),
    defineField({
      name: 'rating',
      title: 'Beoordeling (1-5 sterren)',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'reviewText',
      title: 'Review tekst',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reviewDate',
      title: 'Datum review',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
    defineField({
      name: 'authorPhoto',
      title: 'Profielfoto',
      type: 'image',
      options: { hotspot: true },
      description: 'Optioneel. Zonder foto toont een gekleurde initiaal.',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Google review URL',
      type: 'url',
      description: 'Optioneel. Directe link naar de review op Google.',
    }),
    defineField({
      name: 'featured',
      title: 'Uitgelicht op homepage?',
      type: 'boolean',
      initialValue: true,
      description: 'Vink aan om deze review op de homepage te tonen.',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Volgorde (uitgelicht)',
      type: 'number',
      description: 'Lager = eerder. Laat leeg om op datum te sorteren.',
    }),
    defineField({
      name: 'visible',
      title: 'Weergeven op website?',
      type: 'boolean',
      initialValue: true,
      description: 'Vink uit om deze review tijdelijk te verbergen zonder te verwijderen.',
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
      const flags = [!visible && '(verborgen)', featured && '★ uitgelicht'].filter(Boolean).join(' ')
      return {
        title: `${title ?? 'Onbekend'} — ${stars}`,
        subtitle: [flags, subtitle ? subtitle.slice(0, 70) + (subtitle.length > 70 ? '…' : '') : ''].filter(Boolean).join(' · '),
        media,
      }
    },
  },
  orderings: [
    {
      name: 'displayOrder',
      title: 'Volgorde (uitgelicht eerst)',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'displayOrder', direction: 'asc' },
        { field: 'reviewDate', direction: 'desc' },
      ],
    },
    {
      name: 'dateDesc',
      title: 'Datum (nieuwste eerst)',
      by: [{ field: 'reviewDate', direction: 'desc' }],
    },
  ],
})
