import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'social', title: 'Social Media' },
    { name: 'navigation', title: 'Navigation' },
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
      description: 'Short tagline below the site name.',
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
      title: 'Contact Email',
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
      title: 'Chamber of Commerce Number',
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
          description: 'E.g. +31612345678 (including country code)',
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
      description: 'Links in the main menu. Leave empty to use the default navigation.',
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
      description: 'E.g. "Custom Itinerary".',
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
      description: 'Used when no specific SEO title is set.',
    }),
    defineField({
      name: 'defaultSeoDescription',
      title: 'Default SEO Description',
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
      description: 'Short text at the bottom of the page.',
    }),
    defineField({
      name: 'footerColumn1Heading',
      title: 'Footer Column 1 Heading',
      type: 'string',
      group: 'footer',
      description: 'E.g. "Safari Trips".',
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
      description: 'E.g. "About Us".',
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
      description: 'E.g. "All rights reserved." (year and site name are added automatically).',
    }),
    defineField({
      name: 'privacyLabel',
      title: 'Privacy Policy Label',
      type: 'string',
      group: 'footer',
      description: 'E.g. "Privacy Policy".',
    }),
    defineField({
      name: 'privacyLink',
      title: 'Privacy Policy Link',
      type: 'string',
      group: 'footer',
      initialValue: '/privacy',
    }),
    defineField({
      name: 'termsLabel',
      title: 'Terms Label',
      type: 'string',
      group: 'footer',
      description: 'E.g. "Terms & Conditions".',
    }),
    defineField({
      name: 'termsLink',
      title: 'Terms & Conditions Link',
      type: 'string',
      group: 'footer',
      initialValue: '/terms',
    }),

    // ─── CARD & DETAIL LABELS ──────────────────────────────────────────
    defineField({
      name: 'cardLabels',
      title: 'Card Labels',
      type: 'object',
      group: 'general',
      description: 'Labels on safari, destination and blog cards.',
      fields: [
        defineField({ name: 'featuredBadge', title: '"Featured" Badge', type: 'string' }),
        defineField({ name: 'priceFromLabel', title: '"From" Label', type: 'string' }),
        defineField({ name: 'pricePerGroup', title: '"Per Group" Label', type: 'string' }),
        defineField({ name: 'pricePerPerson', title: '"Per Person" Label', type: 'string' }),
        defineField({ name: 'viewLabel', title: '"View" Label', type: 'string' }),
        defineField({ name: 'readArticleLabel', title: '"Read Article" Label', type: 'string' }),
        defineField({ name: 'tripSingularLabel', title: '"Trip" (singular)', type: 'string' }),
        defineField({ name: 'tripPluralLabel', title: '"Trips" (plural)', type: 'string' }),
        defineField({ name: 'availableLabel', title: '"Available" Label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'safariDetailLabels',
      title: 'Safari Detail Labels',
      type: 'object',
      group: 'general',
      description: 'Labels on the safari detail page.',
      fields: [
        defineField({ name: 'durationLabel', title: '"Duration" Label', type: 'string' }),
        defineField({ name: 'levelLabel', title: '"Level" Label', type: 'string' }),
        defineField({ name: 'groupSizeLabel', title: '"Group Size" Label', type: 'string' }),
        defineField({ name: 'typeLabel', title: '"Type" Label', type: 'string' }),
        defineField({ name: 'aboutTripHeading', title: '"About this trip" Heading', type: 'string' }),
        defineField({ name: 'highlightsHeading', title: '"Highlights" Heading', type: 'string' }),
        defineField({ name: 'itineraryHeading', title: '"Day-by-day Itinerary" Heading', type: 'string' }),
        defineField({ name: 'includedExcludedHeading', title: '"Included & Excluded" Heading', type: 'string' }),
        defineField({ name: 'includedLabel', title: '"Included" Label', type: 'string' }),
        defineField({ name: 'excludedLabel', title: '"Not Included" Label', type: 'string' }),
        defineField({ name: 'priceFromSidebarLabel', title: '"Price From" Sidebar Label', type: 'string' }),
        defineField({ name: 'bookTripCtaLabel', title: '"Book this trip" Button Text', type: 'string' }),
        defineField({ name: 'eigenReisschemaCtaLabel', title: '"Custom Itinerary" Button Text', type: 'string' }),
        defineField({ name: 'breakfastLabel', title: '"Breakfast" Label', type: 'string' }),
        defineField({ name: 'lunchLabel', title: '"Lunch" Label', type: 'string' }),
        defineField({ name: 'dinnerLabel', title: '"Dinner" Label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'destinationDetailLabels',
      title: 'Destination Detail Labels',
      type: 'object',
      group: 'general',
      description: 'Labels on the destination detail page.',
      fields: [
        defineField({ name: 'climateHeading', title: '"Climate" Heading', type: 'string' }),
        defineField({ name: 'bestTimeHeading', title: '"Best time to visit" Heading', type: 'string' }),
        defineField({ name: 'relatedTripsHeadingPrefix', title: 'Related Trips Heading Prefix', type: 'string', description: 'E.g. "Safari trips in" (followed by destination name).' }),
      ],
    }),
    defineField({
      name: 'blogDetailLabels',
      title: 'Blog Detail Labels',
      type: 'object',
      group: 'general',
      description: 'Labels on the blog detail page.',
      fields: [
        defineField({ name: 'writtenByLabel', title: '"Written by" Label', type: 'string' }),
        defineField({ name: 'backToAllLabel', title: 'Back to Overview Label', type: 'string', description: 'E.g. "← Back to all blog posts".' }),
        defineField({ name: 'ctaHeading', title: 'Blog CTA Heading', type: 'string', description: 'E.g. "Inspired by this trip?".' }),
        defineField({ name: 'ctaBody', title: 'Blog CTA Text', type: 'text', rows: 2 }),
        defineField({ name: 'ctaButton', title: 'Blog CTA Button Text', type: 'string' }),
        defineField({ name: 'gallerySidebarHeading', title: 'Gallery Sidebar Heading', type: 'string', description: 'E.g. "Favourite Moments".' }),
        defineField({ name: 'gallerySidebarDescription', title: 'Gallery Sidebar Description', type: 'string' }),
        defineField({ name: 'galleryViewLabel', title: '"View Location" Label', type: 'string' }),
        defineField({ name: 'galleryCtaLabel', title: 'Gallery CTA Label', type: 'string', description: 'E.g. "Discover All Our Trips".' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'siteName', media: 'logo' },
  },
})
