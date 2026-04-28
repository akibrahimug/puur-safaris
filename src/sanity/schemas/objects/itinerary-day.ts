import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'itineraryDay',
  title: 'Reisschema Dag',
  type: 'object',
  fields: [
    defineField({
      name: 'day',
      title: 'Dag Nummer',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'title',
      title: 'Dag Titel',
      type: 'string',
      description: 'Bijv. "Aankomst Nairobi & transfer naar lodge"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Beschrijving van de dag',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'location',
      title: 'Locatie / Verblijf',
      type: 'string',
      description: 'Bijv. "Amboseli Serena Lodge"',
    }),
    defineField({
      name: 'meals',
      title: 'Inbegrepen Maaltijden',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { value: 'breakfast', title: 'Ontbijt' },
          { value: 'lunch', title: 'Lunch' },
          { value: 'dinner', title: 'Diner' },
        ],
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'day' },
    prepare({ title, subtitle }) {
      return { title: `Dag ${subtitle}: ${title}` }
    },
  },
})
