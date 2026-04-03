import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Instellingen',
  type: 'document',
  groups: [
    { name: 'general', title: 'Algemeen', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'social', title: 'Social Media' },
    { name: 'navigation', title: 'Navigatie' },
    { name: 'seo', title: 'SEO' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Sitenaam',
      type: 'string',
      group: 'general',
      initialValue: 'Puur Safaris',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'general',
      description: 'Korte slogan onder de sitenaam.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'general',
      options: { hotspot: false },
      fields: [defineField({ name: 'alt', title: 'Alt tekst', type: 'string' })],
    }),

    // ─── CONTACT ─────────────────────────────────────────────────────
    defineField({
      name: 'contactEmail',
      title: 'Contacte-mailadres',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'phone',
      title: 'Telefoonnummer',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Adres',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),
    defineField({
      name: 'chamberOfCommerceNumber',
      title: 'KvK Nummer',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'openingHours',
      title: 'Openingstijden',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'hours', title: 'Tijden', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'hours' },
          },
        },
      ],
    }),

    // ─── SOCIAL MEDIA ─────────────────────────────────────────────────
    defineField({
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'object',
      group: 'social',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp Nummer',
          type: 'string',
          description: 'Bijv. +31612345678 (inclusief landcode)',
        }),
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
      ],
    }),

    // ─── NAVIGATION ──────────────────────────────────────────────────
    defineField({
      name: 'mainNavigation',
      title: 'Hoofdnavigatie',
      type: 'array',
      group: 'navigation',
      description: 'Links in het hoofdmenu. Laat leeg om de standaard navigatie te gebruiken.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', title: 'URL', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),

    // ─── HEADER CTA ─────────────────────────────────────────────────────
    defineField({
      name: 'headerCtaLabel',
      title: 'Header CTA Knoptekst',
      type: 'string',
      group: 'navigation',
      description: 'Bijv. "Eigen Reisschema".',
    }),
    defineField({
      name: 'headerCtaLink',
      title: 'Header CTA Link',
      type: 'string',
      group: 'navigation',
    }),

    // ─── SEO DEFAULTS ─────────────────────────────────────────────────
    defineField({
      name: 'defaultSeoTitle',
      title: 'Standaard SEO Titel',
      type: 'string',
      group: 'seo',
      description: 'Wordt gebruikt als er geen specifieke SEO titel is ingesteld.',
    }),
    defineField({
      name: 'defaultSeoDescription',
      title: 'Standaard SEO Omschrijving',
      type: 'text',
      rows: 2,
      group: 'seo',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Standaard Social Media Afbeelding',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
    }),

    // ─── FOOTER ───────────────────────────────────────────────────────
    defineField({
      name: 'footerText',
      title: 'Footer Tekst',
      type: 'text',
      rows: 2,
      group: 'footer',
      description: 'Korte tekst onderaan de pagina.',
    }),
    defineField({
      name: 'footerColumn1Heading',
      title: 'Footer Kolom 1 Koptekst',
      type: 'string',
      group: 'footer',
      description: 'Bijv. "Safari Reizen".',
    }),
    defineField({
      name: 'footerColumn1Links',
      title: 'Footer Kolom 1 Links',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', title: 'URL', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'footerColumn2Heading',
      title: 'Footer Kolom 2 Koptekst',
      type: 'string',
      group: 'footer',
      description: 'Bijv. "Over Ons".',
    }),
    defineField({
      name: 'footerColumn2Links',
      title: 'Footer Kolom 2 Links',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', title: 'URL', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
    defineField({
      name: 'footerColumn3Heading',
      title: 'Footer Kolom 3 Koptekst',
      type: 'string',
      group: 'footer',
      description: 'Bijv. "Contact".',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Tekst',
      type: 'string',
      group: 'footer',
      description: 'Bijv. "Alle rechten voorbehouden." (jaar en sitenaam worden automatisch toegevoegd).',
    }),
    defineField({
      name: 'privacyLabel',
      title: 'Privacybeleid Label',
      type: 'string',
      group: 'footer',
      description: 'Bijv. "Privacybeleid".',
    }),
    defineField({
      name: 'privacyLink',
      title: 'Privacybeleid Link',
      type: 'string',
      group: 'footer',
      initialValue: '/privacybeleid',
    }),
    defineField({
      name: 'termsLabel',
      title: 'Algemene Voorwaarden Label',
      type: 'string',
      group: 'footer',
      description: 'Bijv. "Algemene Voorwaarden".',
    }),
    defineField({
      name: 'termsLink',
      title: 'Algemene Voorwaarden Link',
      type: 'string',
      group: 'footer',
      initialValue: '/algemene-voorwaarden',
    }),

    // ─── CARD & DETAIL LABELS ──────────────────────────────────────────
    defineField({
      name: 'cardLabels',
      title: 'Kaart Labels',
      type: 'object',
      group: 'general',
      description: 'Labels op safari-, bestemming- en blogkaarten.',
      fields: [
        defineField({ name: 'featuredBadge', title: '"Aanbevolen" Badge', type: 'string' }),
        defineField({ name: 'priceFromLabel', title: '"Vanaf" Label', type: 'string' }),
        defineField({ name: 'pricePerGroup', title: '"Per Groep" Label', type: 'string' }),
        defineField({ name: 'pricePerPerson', title: '"Per Persoon" Label', type: 'string' }),
        defineField({ name: 'viewLabel', title: '"Bekijk" Label', type: 'string' }),
        defineField({ name: 'readArticleLabel', title: '"Lees Artikel" Label', type: 'string' }),
        defineField({ name: 'tripSingularLabel', title: '"Reis" (enkelvoud)', type: 'string' }),
        defineField({ name: 'tripPluralLabel', title: '"Reizen" (meervoud)', type: 'string' }),
        defineField({ name: 'availableLabel', title: '"Beschikbaar" Label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'safariDetailLabels',
      title: 'Safari Detail Labels',
      type: 'object',
      group: 'general',
      description: 'Labels op de safari detailpagina.',
      fields: [
        defineField({ name: 'durationLabel', title: '"Duur" Label', type: 'string' }),
        defineField({ name: 'levelLabel', title: '"Niveau" Label', type: 'string' }),
        defineField({ name: 'groupSizeLabel', title: '"Groepsgrootte" Label', type: 'string' }),
        defineField({ name: 'typeLabel', title: '"Type" Label', type: 'string' }),
        defineField({ name: 'aboutTripHeading', title: '"Over deze reis" Koptekst', type: 'string' }),
        defineField({ name: 'highlightsHeading', title: '"Hoogtepunten" Koptekst', type: 'string' }),
        defineField({ name: 'itineraryHeading', title: '"Dag-tot-dag Reisschema" Koptekst', type: 'string' }),
        defineField({ name: 'includedExcludedHeading', title: '"In- en uitbegrepen" Koptekst', type: 'string' }),
        defineField({ name: 'includedLabel', title: '"Inbegrepen" Label', type: 'string' }),
        defineField({ name: 'excludedLabel', title: '"Niet Inbegrepen" Label', type: 'string' }),
        defineField({ name: 'priceFromSidebarLabel', title: '"Prijs Vanaf" Zijbalk Label', type: 'string' }),
        defineField({ name: 'bookTripCtaLabel', title: '"Boek deze reis" Knoptekst', type: 'string' }),
        defineField({ name: 'eigenReisschemaCtaLabel', title: '"Eigen Reisschema" Knoptekst', type: 'string' }),
        defineField({ name: 'breakfastLabel', title: '"Ontbijt" Label', type: 'string' }),
        defineField({ name: 'lunchLabel', title: '"Lunch" Label', type: 'string' }),
        defineField({ name: 'dinnerLabel', title: '"Diner" Label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'destinationDetailLabels',
      title: 'Bestemming Detail Labels',
      type: 'object',
      group: 'general',
      description: 'Labels op de bestemming detailpagina.',
      fields: [
        defineField({ name: 'climateHeading', title: '"Klimaat" Koptekst', type: 'string' }),
        defineField({ name: 'bestTimeHeading', title: '"Beste tijd om te bezoeken" Koptekst', type: 'string' }),
        defineField({ name: 'relatedTripsHeadingPrefix', title: 'Gerelateerde Reizen Koptekst Prefix', type: 'string', description: 'Bijv. "Safari reizen in" (gevolgd door bestemmingsnaam).' }),
      ],
    }),
    defineField({
      name: 'blogDetailLabels',
      title: 'Blog Detail Labels',
      type: 'object',
      group: 'general',
      description: 'Labels op de blog detailpagina.',
      fields: [
        defineField({ name: 'writtenByLabel', title: '"Geschreven door" Label', type: 'string' }),
        defineField({ name: 'backToAllLabel', title: 'Terug Naar Overzicht Label', type: 'string', description: 'Bijv. "← Terug naar alle blogberichten".' }),
        defineField({ name: 'ctaHeading', title: 'Blog CTA Koptekst', type: 'string', description: 'Bijv. "Geïnspireerd geraakt door deze reis?".' }),
        defineField({ name: 'ctaBody', title: 'Blog CTA Tekst', type: 'text', rows: 2 }),
        defineField({ name: 'ctaButton', title: 'Blog CTA Knoptekst', type: 'string' }),
        defineField({ name: 'gallerySidebarHeading', title: 'Galerij Zijbalk Koptekst', type: 'string', description: 'Bijv. "Favoriete Momenten".' }),
        defineField({ name: 'gallerySidebarDescription', title: 'Galerij Zijbalk Omschrijving', type: 'string' }),
        defineField({ name: 'galleryViewLabel', title: '"Bekijk Locatie" Label', type: 'string' }),
        defineField({ name: 'galleryCtaLabel', title: 'Galerij CTA Label', type: 'string', description: 'Bijv. "Ontdek Al Onze Reizen".' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'siteName', media: 'logo' },
  },
})
