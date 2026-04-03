import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bookingPage',
  title: 'Boekingspagina',
  type: 'document',
  fields: [
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      description: 'Bijv. "Boeking".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Ondertitel',
      type: 'string',
      description: 'Bijv. "Vul uw gegevens in en wij bevestigen uw boeking binnen 2 werkdagen.".',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Boekingspagina' }),
  },
})
