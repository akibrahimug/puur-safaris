import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogSubmissionPage',
  title: 'Blog Inzenden Pagina',
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
      name: 'heroTitle',
      title: 'Hero Titel',
      type: 'string',
      group: 'hero',
      description: 'Bijv. "Schrijf Jouw Safari Dagboek".',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Ondertitel',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Afbeelding',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
      fields: [defineField({ name: 'alt', title: 'Alt tekst', type: 'string' })],
    }),

    // ─── INSTRUCTIONS ──────────────────────────────────────────────
    defineField({
      name: 'instructionsHeading',
      title: 'Instructies Koptekst',
      type: 'string',
      group: 'instructions',
      description: 'Bijv. "Hoe werkt het publiceren?".',
    }),
    defineField({
      name: 'step1Text',
      title: 'Stap 1 Tekst',
      type: 'text',
      rows: 2,
      group: 'instructions',
    }),
    defineField({
      name: 'step2Text',
      title: 'Stap 2 Tekst',
      type: 'text',
      rows: 2,
      group: 'instructions',
    }),
    defineField({
      name: 'step3Text',
      title: 'Stap 3 Tekst',
      type: 'text',
      rows: 3,
      group: 'instructions',
    }),

    // ─── FORM ──────────────────────────────────────────────────────
    defineField({
      name: 'successHeading',
      title: 'Succes Koptekst',
      type: 'string',
      group: 'form',
      description: 'Bijv. "Bedankt voor het delen!".',
    }),
    defineField({
      name: 'successBody',
      title: 'Succes Tekst',
      type: 'text',
      rows: 3,
      group: 'form',
    }),
    defineField({
      name: 'successResetLabel',
      title: 'Succes Reset Knoptekst',
      type: 'string',
      group: 'form',
      description: 'Bijv. "Nog een verhaal insturen".',
    }),
    defineField({
      name: 'submitLabel',
      title: 'Verstuur Knoptekst',
      type: 'string',
      group: 'form',
      description: 'Bijv. "Verstuur Jouw Verhaal".',
    }),
    defineField({
      name: 'submitLoadingLabel',
      title: 'Verstuur Laden Tekst',
      type: 'string',
      group: 'form',
      description: 'Bijv. "Bezig met uploaden...".',
    }),
    defineField({
      name: 'verificationLabel',
      title: 'Verificatie Label',
      type: 'string',
      group: 'form',
      description: 'Bijv. "Bevestig je boeking om verder te gaan".',
    }),
    defineField({
      name: 'writtenByPrefix',
      title: '"Geschreven door" Prefix',
      type: 'string',
      group: 'form',
      description: 'Bijv. "Geschreven door".',
    }),
    defineField({
      name: 'gallerySidebarHeading',
      title: 'Galerij Zijbalk Koptekst',
      type: 'string',
      group: 'form',
      description: 'Bijv. "Favoriete Momenten".',
    }),
    defineField({
      name: 'gallerySidebarDescription',
      title: 'Galerij Zijbalk Omschrijving',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'galleryAddLabel',
      title: 'Galerij Toevoegen Label',
      type: 'string',
      group: 'form',
      description: 'Bijv. "Toevoegen".',
    }),
    defineField({
      name: 'galleryOverflowLabel',
      title: 'Galerij Overflow Label',
      type: 'string',
      group: 'form',
      description: 'Bijv. "meer foto\'s geüpload" (voorafgegaan door het aantal).',
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
    prepare: () => ({ title: 'Blog Inzenden Pagina' }),
  },
})
