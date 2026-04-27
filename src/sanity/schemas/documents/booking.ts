import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'booking',
  title: 'Bookings',
  type: 'document',
  fields: [
    defineField({
      name: 'bookingNumber',
      title: 'Bookingsnummer',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'voornaam',
      title: 'First Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'achternaam',
      title: 'Last Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Emailadres',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'telefoon',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'tripTitle',
      title: 'Trip',
      type: 'string',
    }),
    defineField({
      name: 'tripSlug',
      title: 'Trip Slug',
      type: 'string',
    }),
    defineField({
      name: 'vertrekdatum',
      title: 'Departure Date',
      type: 'string',
    }),
    defineField({
      name: 'aantalVolwassenen',
      title: 'Count Adults',
      type: 'number',
    }),
    defineField({
      name: 'aantalKinderen',
      title: 'Count Children',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { value: 'pending', title: 'In behandeling' },
          { value: 'confirmed', title: 'Confirmed' },
          { value: 'completed', title: 'Afgerond' },
          { value: 'cancelled', title: 'Cancelled' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
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
      title: 'Created (newest first)',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
})
