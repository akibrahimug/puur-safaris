import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faqItem',
  title: 'Veelgestelde Vragen',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Vraag',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Antwoord',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normaal', value: 'normal' }],
          marks: {
            decorators: [
              { title: 'Vet', value: 'strong' },
              { title: 'Cursief', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'string',
      options: {
        list: [
          { value: 'general', title: 'Algemeen' },
          { value: 'booking', title: 'Boeking & Betaling' },
          { value: 'travel', title: 'Reizen & Visa' },
          { value: 'accommodation', title: 'Accommodatie' },
          { value: 'safety', title: 'Veiligheid & Gezondheid' },
          { value: 'packing', title: 'Inpakken & Voorbereiding' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Weergavevolgorde',
      type: 'number',
      description: 'Lagere nummers worden eerder getoond.',
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: 'Categorie & Volgorde',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
    },
  },
})
