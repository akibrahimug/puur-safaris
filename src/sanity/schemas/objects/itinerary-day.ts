import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'itineraryDay',
  title: 'Itinerary Day',
  type: 'object',
  fields: [
    defineField({
      name: 'day',
      title: 'Day Number',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'title',
      title: 'Day Title',
      type: 'string',
      description: 'E.g. "Arrival Nairobi & transfer to lodge"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Day Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'location',
      title: 'Location / Stay',
      type: 'string',
      description: 'E.g. "Amboseli Serena Lodge"',
    }),
    defineField({
      name: 'meals',
      title: 'Included Meals',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { value: 'breakfast', title: 'Breakfast' },
          { value: 'lunch', title: 'Lunch' },
          { value: 'dinner', title: 'Dinner' },
        ],
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'day' },
    prepare({ title, subtitle }) {
      return { title: `Day ${subtitle}: ${title}` }
    },
  },
})
