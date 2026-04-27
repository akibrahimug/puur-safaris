import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faqItem',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
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
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { value: 'general', title: 'General' },
          { value: 'booking', title: 'Booking & Betaling' },
          { value: 'travel', title: 'Trips & Visa' },
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
      title: 'Category & Order',
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
