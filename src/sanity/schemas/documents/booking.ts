import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'booking',
  title: 'Boekingen',
  type: 'document',
  fields: [
    defineField({
      name: 'bookingNumber',
      title: 'Boekingsnummer',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'voornaam',
      title: 'Voornaam',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'achternaam',
      title: 'Achternaam',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'E-mailadres',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'telefoon',
      title: 'Telefoonnummer',
      type: 'string',
    }),
    defineField({
      name: 'tripTitle',
      title: 'Reis',
      type: 'string',
    }),
    defineField({
      name: 'tripSlug',
      title: 'Reis Slug',
      type: 'string',
    }),
    defineField({
      name: 'vertrekdatum',
      title: 'Vertrekdatum',
      type: 'string',
    }),
    defineField({
      name: 'aantalVolwassenen',
      title: 'Aantal Volwassenen',
      type: 'number',
    }),
    defineField({
      name: 'aantalKinderen',
      title: 'Aantal Kinderen',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { value: 'pending', title: 'In behandeling' },
          { value: 'confirmed', title: 'Bevestigd' },
          { value: 'completed', title: 'Afgerond' },
          { value: 'cancelled', title: 'Geannuleerd' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'createdAt',
      title: 'Aangemaakt op',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      bookingNumber: 'bookingNumber',
      voornaam: 'voornaam',
      achternaam: 'achternaam',
      tripTitle: 'tripTitle',
      status: 'status',
    },
    prepare({ bookingNumber, voornaam, achternaam, tripTitle, status }) {
      const statusLabels: Record<string, string> = {
        pending: 'In behandeling',
        confirmed: 'Bevestigd',
        completed: 'Afgerond',
        cancelled: 'Geannuleerd',
      }
      return {
        title: `${bookingNumber} — ${voornaam} ${achternaam}`,
        subtitle: `${tripTitle ?? 'Onbekende reis'} (${statusLabels[status] ?? status})`,
      }
    },
  },
  orderings: [
    {
      title: 'Aangemaakt (nieuwste eerst)',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
})
