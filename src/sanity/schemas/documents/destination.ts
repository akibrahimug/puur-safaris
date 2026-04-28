import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'destination',
  title: 'Bestemmingen',
  type: 'document',
  groups: [
    { name: 'general', title: 'Algemeen', default: true },
    { name: 'gallery', title: 'Galerij' },
    { name: 'community', title: 'Gemeenschap' },
    { name: 'wildlife', title: 'Wildlife' },
    { name: 'accommodations', title: 'Accommodaties' },
    { name: 'location', title: 'Locatie' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── GENERAL ──────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'general',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Afbeelding',
      type: 'image',
      group: 'general',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt tekst',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Land',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'continent',
      title: 'Continent',
      type: 'string',
      group: 'general',
      options: {
        list: [
          { value: 'Africa', title: 'Afrika' },
          { value: 'Asia', title: 'Azië' },
          { value: 'Americas', title: 'Amerika' },
          { value: 'Europe', title: 'Europa' },
        ],
        layout: 'radio',
      },
      initialValue: 'Africa',
    }),
    defineField({
      name: 'excerpt',
      title: 'Korte Omschrijving',
      type: 'text',
      rows: 3,
      group: 'general',
      description: 'Max. 200 tekens. Wordt gebruikt op kaarten.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'description',
      title: 'Volledige Beschrijving',
      type: 'array',
      group: 'general',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normaal', value: 'normal' },
            { title: 'Kop 2', value: 'h2' },
            { title: 'Kop 3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Vet', value: 'strong' },
              { title: 'Cursief', value: 'em' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'climate',
      title: 'Klimaat',
      type: 'text',
      rows: 2,
      group: 'general',
      description: 'Korte beschrijving van het klimaat en weerpatronen.',
    }),
    defineField({
      name: 'bestTimeToVisit',
      title: 'Beste Tijd om te Bezoeken',
      type: 'string',
      group: 'general',
      description: 'Bijv. "Juni t/m oktober (droge seizoen)"',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Weergavevolgorde',
      type: 'number',
      group: 'general',
      description: 'Lagere nummers worden eerder getoond.',
      initialValue: 99,
    }),

    // ─── GALLERY ──────────────────────────────────────────────
    defineField({
      name: 'gallery',
      title: 'Fotogalerij',
      type: 'array',
      group: 'gallery',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt tekst', type: 'string' }),
            defineField({ name: 'caption', title: 'Bijschrift', type: 'string' }),
          ],
        },
      ],
      description: 'Afbeeldingen voor de fotogalerij op de bestemmingspagina.',
    }),

    // ─── WILDLIFE ─────────────────────────────────────────────
    defineField({
      name: 'wildlifeHeading',
      title: 'Wildlife Koptekst',
      type: 'string',
      group: 'wildlife',
      description: 'Bijv. "Wildlife & Natuur"',
    }),
    defineField({
      name: 'wildlifeDescription',
      title: 'Wildlife Beschrijving',
      type: 'text',
      rows: 4,
      group: 'wildlife',
    }),
    defineField({
      name: 'wildlifeHighlights',
      title: 'Diersoorten Hoogtepunten',
      type: 'array',
      group: 'wildlife',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Naam', type: 'string' }),
            defineField({ name: 'description', title: 'Beschrijving', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Afbeelding',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt tekst', type: 'string' }),
              ],
            }),
          ],
          preview: {
            select: { title: 'name', media: 'image' },
          },
        },
      ],
    }),

    // ─── COMMUNITY ────────────────────────────────────────────
    defineField({
      name: 'communityHeading',
      title: 'Gemeenschap Koptekst',
      type: 'string',
      group: 'community',
      description: 'Bijv. "Lokale Gemeenschap & Cultuur"',
    }),
    defineField({
      name: 'communityDescription',
      title: 'Gemeenschap Beschrijving',
      type: 'array',
      group: 'community',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normaal', value: 'normal' },
            { title: 'Kop 3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Vet', value: 'strong' },
              { title: 'Cursief', value: 'em' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'communityImage',
      title: 'Gemeenschap Afbeelding',
      type: 'image',
      group: 'community',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt tekst', type: 'string' }),
      ],
    }),

    // ─── ACCOMMODATIONS ───────────────────────────────────────
    defineField({
      name: 'accommodationsHeading',
      title: 'Accommodaties Koptekst',
      type: 'string',
      group: 'accommodations',
      description: 'Bijv. "Verblijf & Accommodaties"',
    }),
    defineField({
      name: 'accommodations',
      title: 'Accommodaties',
      type: 'array',
      group: 'accommodations',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Naam', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'type', title: 'Type', type: 'string', options: {
              list: [
                { value: 'lodge', title: 'Lodge' },
                { value: 'camp', title: 'Camp' },
                { value: 'hotel', title: 'Hotel' },
                { value: 'guesthouse', title: 'Gasthuis' },
                { value: 'luxury', title: 'Luxe Lodge' },
              ],
            }}),
            defineField({ name: 'description', title: 'Beschrijving', type: 'text', rows: 2 }),
            defineField({
              name: 'image',
              title: 'Afbeelding',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt tekst', type: 'string' }),
              ],
            }),
            defineField({
              name: 'coordinates',
              title: 'Coördinaten',
              type: 'geopoint',
              description: 'Locatie van de accommodatie op de kaart.',
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'type', media: 'image' },
          },
        },
      ],
    }),

    // ─── LOCATION ─────────────────────────────────────────────
    defineField({
      name: 'coordinates',
      title: 'Coördinaten',
      type: 'geopoint',
      group: 'location',
      description: 'Centrale locatie van de bestemming voor de kaart.',
    }),
    defineField({
      name: 'mapZoom',
      title: 'Kaartzoom',
      type: 'number',
      group: 'location',
      description: 'Zoomniveau voor de kaart (8-14). Standaard: 10.',
      initialValue: 10,
      validation: (Rule) => Rule.min(1).max(20),
    }),

    // ─── SEO ──────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO Instellingen',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Weergavevolgorde',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'country',
      media: 'heroImage',
    },
  },
})
