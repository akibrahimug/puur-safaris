import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'social', title: 'Social Media' },
    { name: 'navigation', title: 'Navigatie' },
    { name: 'seo', title: 'SEO' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      group: 'general',
      initialValue: 'Puur Uganda Reizen',
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
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
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
      title: 'Phone Number',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'address',
      title: 'Address',
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
      title: 'Opening Hours',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'hours', title: 'Hours', type: 'string', validation: (Rule) => Rule.required() }),
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
          title: 'WhatsApp Number',
          type: 'string',
          description: 'E.g. +31612345678 (inclusief landcode)',
        }),
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
      ],
    }),

    // ─── NAVIGATION ──────────────────────────────────────────────────
    defineField({
      name: 'mainNavigation',
      title: 'Main Navigation',
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
      title: 'Header CTA Button Text',
      type: 'string',
      group: 'navigation',
      description: 'E.g. "Eigen Reisschema".',
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
      title: 'Default SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Wordt gebruikt als er geen specifieke SEO titel is ingesteld.',
    }),
    defineField({
      name: 'defaultSeoDescription',
      title: 'Default SEO Omschrijving',
      type: 'text',
      rows: 2,
      group: 'seo',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default Social Media Image',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
    }),

    // ─── FOOTER ───────────────────────────────────────────────────────
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'text',
      rows: 2,
      group: 'footer',
      description: 'Korte tekst onderaan de pagina.',
    }),
    defineField({
      name: 'footerColumn1Heading',
      title: 'Footer Column 1 Heading',
      type: 'string',
      group: 'footer',
      description: 'E.g. "Safari Reizen".',
    }),
    defineField({
      name: 'footerColumn1Links',
      title: 'Footer Column 1 Links',
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
      title: 'Footer Column 2 Heading',
      type: 'string',
      group: 'footer',
      description: 'E.g. "Over Ons".',
    }),
    defineField({
      name: 'footerColumn2Links',
      title: 'Footer Column 2 Links',
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
      title: 'Footer Column 3 Heading',
      type: 'string',
      group: 'footer',
      description: 'E.g. "Contact".',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      group: 'footer',
      description: 'E.g. "Alle rechten voorbehouden." (jaar en sitenaam worden automatisch toegevoegd).',
    }),
    defineField({
      name: 'privacyLabel',
      title: 'Privacybeleid Label',
      type: 'string',
      group: 'footer',
      description: 'E.g. "Privacybeleid".',
    }),
    defineField({
      name: 'privacyLink',
      title: 'Privacybeleid Link',
      type: 'string',
      group: 'footer',
      initialValue: '/privacy',
    }),
    defineField({
      name: 'termsLabel',
      title: 'Algemene Terms Label',
      type: 'string',
      group: 'footer',
      description: 'E.g. "Algemene Voorwaarden".',
    }),
    defineField({
      name: 'termsLink',
      title: 'Algemene Voorwaarden Link',
      type: 'string',
      group: 'footer',
      initialValue: '/terms',
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
        defineField({ name: 'viewLabel', title: '"View" Label', type: 'string' }),
        defineField({ name: 'readArticleLabel', title: '"Lees Artikel" Label', type: 'string' }),
        defineField({ name: 'tripSingularLabel', title: '"Reis" (enkelvoud)', type: 'string' }),
        defineField({ name: 'tripPluralLabel', title: '"Trips" (plural)', type: 'string' }),
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
        defineField({ name: 'bookTripCtaLabel', title: '"Book this trip" Button Text', type: 'string' }),
        defineField({ name: 'eigenReisschemaCtaLabel', title: '"Custom Itinerary" Button Text', type: 'string' }),
        defineField({ name: 'breakfastLabel', title: '"Ontbijt" Label', type: 'string' }),
        defineField({ name: 'lunchLabel', title: '"Lunch" Label', type: 'string' }),
        defineField({ name: 'dinnerLabel', title: '"Diner" Label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'destinationDetailLabels',
      title: 'Destination Detail Labels',
      type: 'object',
      group: 'general',
      description: 'Labels op de bestemming detailpagina.',
      fields: [
        defineField({ name: 'climateHeading', title: '"Klimaat" Koptekst', type: 'string' }),
        defineField({ name: 'bestTimeHeading', title: '"Beste tijd om te bezoeken" Koptekst', type: 'string' }),
        defineField({ name: 'relatedTripsHeadingPrefix', title: 'Related Trips Heading Prefix', type: 'string', description: 'E.g. "Safari trips in" (followed by destination name).' }),
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
        defineField({ name: 'backToAllLabel', title: 'Terug Naar Overzicht Label', type: 'string', description: 'E.g. "← Terug naar alle blogberichten".' }),
        defineField({ name: 'ctaHeading', title: 'Blog CTA Heading', type: 'string', description: 'E.g. "Geïnspireerd geraakt door deze reis?".' }),
        defineField({ name: 'ctaBody', title: 'Blog CTA Text', type: 'text', rows: 2 }),
        defineField({ name: 'ctaButton', title: 'Blog CTA Button Text', type: 'string' }),
        defineField({ name: 'gallerySidebarHeading', title: 'Gallery Zijbalk Heading', type: 'string', description: 'E.g. "Favoriete Momenten".' }),
        defineField({ name: 'gallerySidebarDescription', title: 'Gallery Zijbalk Omschrijving', type: 'string' }),
        defineField({ name: 'galleryViewLabel', title: '"View Location" Label', type: 'string' }),
        defineField({ name: 'galleryCtaLabel', title: 'Gallery CTA Label', type: 'string', description: 'E.g. "Discover All Our Trips".' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'siteName', media: 'logo' },
  },
})
