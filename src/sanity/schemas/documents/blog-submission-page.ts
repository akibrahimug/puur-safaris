import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogSubmissionPage',
  title: 'Blog Submission Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'instructions', title: 'Instructies' },
    { name: 'form', title: 'Formulier' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── HERO ──────────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      description: 'E.g. "Schrijf Jouw Safari Dagboek".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),

    // ─── INSTRUCTIONS ──────────────────────────────────────────────
    defineField({
      name: 'instructionsHeading',
      title: 'Instructies Heading',
      type: 'string',
      group: 'instructions',
      description: 'E.g. "Hoe werkt het publiceren?".',
    }),
    defineField({
      name: 'step1Text',
      title: 'Stap 1 Text',
      type: 'text',
      rows: 2,
      group: 'instructions',
    }),
    defineField({
      name: 'step2Text',
      title: 'Stap 2 Text',
      type: 'text',
      rows: 2,
      group: 'instructions',
    }),
    defineField({
      name: 'step3Text',
      title: 'Stap 3 Text',
      type: 'text',
      rows: 3,
      group: 'instructions',
    }),

    // ─── FORM ──────────────────────────────────────────────────────
    defineField({
      name: 'successHeading',
      title: 'Succes Heading',
      type: 'string',
      group: 'form',
      description: 'E.g. "Bedankt voor het delen!".',
    }),
    defineField({
      name: 'successBody',
      title: 'Succes Text',
      type: 'text',
      rows: 3,
      group: 'form',
    }),
    defineField({
      name: 'successResetLabel',
      title: 'Succes Reset Button Text',
      type: 'string',
      group: 'form',
      description: 'E.g. "Nog een verhaal insturen".',
    }),
    defineField({
      name: 'submitLabel',
      title: 'Send Button Text',
      type: 'string',
      group: 'form',
      description: 'E.g. "Verstuur Jouw Verhaal".',
    }),
    defineField({
      name: 'submitLoadingLabel',
      title: 'Send Laden Text',
      type: 'string',
      group: 'form',
      description: 'E.g. "Bezig met uploaden...".',
    }),
    defineField({
      name: 'verificationLabel',
      title: 'Verificatie Label',
      type: 'string',
      group: 'form',
      description: 'E.g. "Bevestig je boeking om verder te gaan".',
    }),
    defineField({
      name: 'writtenByPrefix',
      title: '"Geschreven door" Prefix',
      type: 'string',
      group: 'form',
      description: 'E.g. "Geschreven door".',
    }),
    defineField({
      name: 'gallerySidebarHeading',
      title: 'Gallery Zijbalk Heading',
      type: 'string',
      group: 'form',
      description: 'E.g. "Favoriete Momenten".',
    }),
    defineField({
      name: 'gallerySidebarDescription',
      title: 'Gallery Zijbalk Omschrijving',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'galleryAddLabel',
      title: 'Gallery Add Label',
      type: 'string',
      group: 'form',
      description: 'E.g. "Toevoegen".',
    }),
    defineField({
      name: 'galleryOverflowLabel',
      title: 'Gallery Overflow Label',
      type: 'string',
      group: 'form',
      description: 'E.g. "meer foto\'s geüpload" (voorafgegaan door het aantal).',
    }),
    defineField({
      name: 'legalConsent1',
      title: 'Juridische Toestemming 1',
      type: 'text',
      rows: 2,
      group: 'form',
    }),
    defineField({
      name: 'legalConsent2',
      title: 'Juridische Toestemming 2',
      type: 'text',
      rows: 2,
      group: 'form',
    }),

    // ─── SEO ───────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Blog Submission Page' }),
  },
})
