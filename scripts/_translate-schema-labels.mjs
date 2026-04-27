#!/usr/bin/env node
/**
 * One-off: rewrite Dutch field/group labels in src/sanity/schemas/ to English.
 * Operates on string literals after `title:` and `description:` only — never
 * touches `name:`, `value:`, schema field names, or other code.
 *
 * Usage:  node scripts/_translate-schema-labels.mjs
 *
 * After running, delete this file. It's not meant to live in the repo.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(process.cwd(), 'src/sanity/schemas')

// Comprehensive Dutch → English map for the labels in our schemas.
// Order matters: longer / more specific phrases first so they match before
// their substrings.
const MAP = [
  // Common headers / section titles
  ['Hero Sectie', 'Hero Section'],
  ['Hero Afbeelding', 'Hero Image'],
  ['Hero Achtergrond Afbeelding', 'Hero Background Image'],
  ['Hero Titel', 'Hero Title'],
  ['Hero Subtitel', 'Hero Subtitle'],
  ['Hoofd Titel', 'Main Title'],
  ['Subtitel', 'Subtitle'],
  ['Eyebrow', 'Eyebrow'],
  ['Headline Accent', 'Headline Accent'],
  ['Hoofdtitel', 'Main Title'],
  ['Bijschrift', 'Caption'],
  ['Alt tekst', 'Alt text'],
  ['Beschrijving van de dag', 'Day Description'],
  ['Beschrijving', 'Description'],
  ['Korte Beschrijving', 'Short Description'],
  ['Volledige Beschrijving', 'Full Description'],
  ['Locatie / Verblijf', 'Location / Stay'],
  ['Locatie', 'Location'],
  ['Inbegrepen Maaltijden', 'Included Meals'],
  ['Inbegrepen', 'Included'],
  ['Niet Inbegrepen', 'Not Included'],
  ['Hoogtepunten', 'Highlights'],
  ['Reisschema', 'Itinerary'],
  ['Reisschema Dag', 'Itinerary Day'],
  ['Dag Nummer', 'Day Number'],
  ['Dag Titel', 'Day Title'],
  ['Reizen', 'Trips'],
  ['Reis', 'Trip'],
  ['Reizigers', 'Travellers'],
  ['Reiziger', 'Traveller'],

  // Specific (sub)groups / sections
  ['SEO Velden', 'SEO Fields'],
  ['SEO Titel (overschrijft paginatitel)', 'SEO Title (overrides page title)'],
  ['SEO Titel', 'SEO Title'],
  ['Meta Omschrijving', 'Meta Description'],
  ['Social Media Afbeelding (Open Graph)', 'Social Media Image (Open Graph)'],
  ['Social Media Afbeelding', 'Social Media Image'],
  ['Verberg van zoekmachines (no-index)', 'Hide from search engines (no-index)'],
  ['Verberg', 'Hide'],

  // Image labels
  ['Galerij Afbeelding', 'Gallery Image'],
  ['Galerij', 'Gallery'],
  ['Afbeelding', 'Image'],
  ['Foto', 'Photo'],
  ['Logo', 'Logo'],
  ['Logo Afbeelding', 'Logo Image'],

  // Page-specific titles
  ['Homepage', 'Homepage'],
  ['Trust Strip', 'Trust Strip'],
  ['Waarom Puur Uganda Reizen', 'Why Pure Uganda Safaris'],
  ['Secties & CTA', 'Sections & CTA'],
  ['Beoordelingen', 'Reviews'],
  ['Getuigenissen', 'Testimonials'],
  ['Bestemmingen', 'Destinations'],
  ['Bestemming', 'Destination'],
  ['Veelgestelde Vragen', 'FAQ'],
  ['Vraag', 'Question'],
  ['Antwoord', 'Answer'],
  ['Categorie', 'Category'],
  ['Categorieën', 'Categories'],
  ['Volgorde', 'Order'],
  ['Volgorde Nummer', 'Order Number'],
  ['Display Volgorde', 'Display Order'],

  // Form/booking
  ['Boekingen', 'Bookings'],
  ['Boeking', 'Booking'],
  ['Boekingsstatus', 'Booking Status'],
  ['Voornaam', 'First Name'],
  ['Achternaam', 'Last Name'],
  ['Naam', 'Name'],
  ['E-mail', 'Email'],
  ['Telefoonnummer', 'Phone Number'],
  ['Telefoon', 'Phone'],
  ['Bericht', 'Message'],
  ['Aantal Reizigers', 'Number of Travellers'],
  ['Vertrekdatum', 'Departure Date'],
  ['Datum', 'Date'],
  ['Status', 'Status'],

  // Trip / safari fields
  ['Safari Reizen', 'Safari Trips'],
  ['Safari Reis', 'Safari Trip'],
  ['Veld', 'Field'],
  ['Velden', 'Fields'],
  ['Titel', 'Title'],
  ['Slug (URL)', 'Slug (URL)'],
  ['Slug', 'Slug'],
  ['Wordt automatisch gegenereerd vanuit de titel.', 'Generated automatically from the title.'],
  ['Duur', 'Duration'],
  ['Aantal Dagen', 'Number of Days'],
  ['Prijs', 'Price'],
  ['Prijs Type', 'Price Type'],
  ['Prijs vanaf', 'Price From'],
  ['Per persoon', 'Per Person'],
  ['Per groep', 'Per Group'],
  ['Moeilijkheidsgraad', 'Difficulty'],
  ['Min Personen', 'Min Persons'],
  ['Max Personen', 'Max Persons'],
  ['Actief', 'Active'],
  ['Uitgelicht', 'Featured'],
  ['Korte Samenvatting', 'Short Summary'],
  ['Samenvatting', 'Summary'],
  ['Inhoud', 'Content'],
  ['Auteur', 'Author'],
  ['Tags', 'Tags'],
  ['Datum Gepubliceerd', 'Date Published'],
  ['Gepubliceerd op', 'Published At'],
  ['Gepubliceerd', 'Published'],
  ['Concept', 'Draft'],

  // Blog
  ['Blog Berichten', 'Blog Posts'],
  ['Blog Bericht', 'Blog Post'],

  // Destination
  ['Land', 'Country'],
  ['Continent', 'Continent'],
  ['Klimaat', 'Climate'],
  ['Beste Reistijd', 'Best Time to Visit'],
  ['Coördinaten', 'Coordinates'],
  ['Kaart Zoom', 'Map Zoom'],
  ['Wildlife Hoofdtekst', 'Wildlife Heading'],
  ['Wildlife Beschrijving', 'Wildlife Description'],
  ['Wildlife Hoogtepunten', 'Wildlife Highlights'],
  ['Community Hoofdtekst', 'Community Heading'],
  ['Community Beschrijving', 'Community Description'],
  ['Community Afbeelding', 'Community Image'],
  ['Accommodaties Hoofdtekst', 'Accommodations Heading'],
  ['Accommodaties', 'Accommodations'],
  ['Accommodatie Type', 'Accommodation Type'],

  // Site settings
  ['Site Instellingen', 'Site Settings'],
  ['Site Naam', 'Site Name'],
  ['Standaard SEO Titel', 'Default SEO Title'],
  ['Standaard SEO Beschrijving', 'Default SEO Description'],
  ['Standaard Social Media Afbeelding', 'Default Social Media Image'],
  ['Tagline', 'Tagline'],
  ['Hoofdnavigatie', 'Main Navigation'],
  ['Header CTA Label', 'Header CTA Label'],
  ['Header CTA Link', 'Header CTA Link'],
  ['Header CTA', 'Header CTA'],
  ['Footer Tekst', 'Footer Text'],
  ['Footer Kolom 1 Hoofdtekst', 'Footer Column 1 Heading'],
  ['Footer Kolom 2 Hoofdtekst', 'Footer Column 2 Heading'],
  ['Footer Kolom 3 Hoofdtekst', 'Footer Column 3 Heading'],
  ['Footer Kolom 1 Links', 'Footer Column 1 Links'],
  ['Footer Kolom 2 Links', 'Footer Column 2 Links'],
  ['Footer Kolom', 'Footer Column'],
  ['Copyright Tekst', 'Copyright Text'],
  ['Privacy Label', 'Privacy Label'],
  ['Voorwaarden Label', 'Terms Label'],
  ['Adres', 'Address'],
  ['Openingstijden', 'Opening Hours'],
  ['Openingsdag Label', 'Opening Day Label'],
  ['Openingsuren Label', 'Opening Hours Label'],
  ['WhatsApp', 'WhatsApp'],
  ['WhatsApp Nummer', 'WhatsApp Number'],
  ['Sociale Media', 'Social Media'],
  ['Sociale Media Links', 'Social Media Links'],
  ['Pagina Tekst Labels', 'Page Text Labels'],
  ['Card Labels', 'Card Labels'],
  ['Safari Detail Labels', 'Safari Detail Labels'],
  ['Bestemming Detail Labels', 'Destination Detail Labels'],
  ['Blog Detail Labels', 'Blog Detail Labels'],
  ['Detail Labels', 'Detail Labels'],
  ['Label', 'Label'],
  ['Labels', 'Labels'],

  // Sub-pages
  ['Over Ons', 'About Us'],
  ['Over Ons Pagina', 'About Page'],
  ['Contact Pagina', 'Contact Page'],
  ['Safari Overzicht Pagina', 'Safari Listing Page'],
  ['Bestemmingen Pagina', 'Destinations Page'],
  ['FAQ Pagina', 'FAQ Page'],
  ['Blog Pagina', 'Blog Page'],
  ['Eigen Reisschema Pagina', 'Custom Itinerary Page'],
  ['Eigen Reisschema', 'Custom Itinerary'],
  ['Blog Inzenden Pagina', 'Blog Submission Page'],
  ['Blog Inzenden', 'Blog Submission'],
  ['Boekingen Pagina', 'Booking Page'],
  ['Juridische Pagina', 'Legal Page'],
  ['Juridische Pagina\'s', 'Legal Pages'],
  ['Inhoud Beheer', 'Content Management'],
  ['Pagina', 'Page'],
  ['Pagina\'s', 'Pages'],

  // About page
  ['Achtergrond', 'Background'],
  ['Achtergrond Tekst', 'Background Text'],
  ['Achtergrond Titel', 'Background Title'],
  ['Missie', 'Mission'],
  ['Missie Titel', 'Mission Title'],
  ['Missie Tekst', 'Mission Text'],
  ['Team', 'Team'],
  ['Team Titel', 'Team Title'],
  ['Teamleden', 'Team Members'],
  ['Teamlid', 'Team Member'],
  ['Functie', 'Role'],
  ['Bio', 'Bio'],
  ['Unieke Punten', 'Unique Points'],
  ['Unieke Punten Titel', 'Unique Points Title'],
  ['Community Titel', 'Community Title'],
  ['Community Tekst', 'Community Text'],
  ['Community CTA Tekst', 'Community CTA Text'],
  ['CTA', 'CTA'],
  ['CTA Titel', 'CTA Title'],
  ['CTA Tekst', 'CTA Text'],
  ['CTA Knop', 'CTA Button'],
  ['CTA Link', 'CTA Link'],
  ['CTA Subtitel', 'CTA Subtitle'],
  ['CTA Eyebrow', 'CTA Eyebrow'],
  ['Knop', 'Button'],
  ['Knop Tekst', 'Button Text'],
  ['Knop Label', 'Button Label'],
  ['Knop Link', 'Button Link'],
  ['Link', 'Link'],
  ['URL', 'URL'],
  ['Tekst', 'Text'],
  ['Waarde', 'Value'],
  ['Frase', 'Phrase'],
  ['Cijfer', 'Number'],

  // FAQ
  ['Veelgestelde Vraag', 'FAQ Item'],
  ['Veelgestelde Vragen Pagina', 'FAQ Page'],
  ['FAQ Item', 'FAQ Item'],
  ['Categorie Naam', 'Category Name'],

  // Testimonial
  ['Citaat', 'Quote'],
  ['Beoordeling', 'Rating'],
  ['Sterren', 'Stars'],
  ['Profielfoto', 'Profile Photo'],
  ['Geboekte Reis', 'Booked Trip'],

  // Booking form details
  ['Volwassenen', 'Adults'],
  ['Kinderen', 'Children'],
  ['Reden', 'Reason'],
  ['Opmerkingen', 'Notes'],
  ['Opmerking', 'Note'],
  ['Verzonden op', 'Submitted At'],
  ['Bevestigd', 'Confirmed'],
  ['In Behandeling', 'Pending'],
  ['Afgewezen', 'Rejected'],
  ['Geannuleerd', 'Cancelled'],

  // Google review
  ['Google Reviews', 'Google Reviews'],
  ['Google Review', 'Google Review'],
  ['Auteurnaam', 'Author Name'],
  ['Bron URL', 'Source URL'],
  ['Review Tekst', 'Review Text'],
  ['Review Datum', 'Review Date'],

  // Misc
  ['Standaard', 'Default'],
  ['Optioneel', 'Optional'],
  ['Verplicht', 'Required'],
  ['Aanbevolen', 'Recommended'],
  ['Maximaal', 'Maximum'],
  ['Minimaal', 'Minimum'],
  ['Aantal', 'Count'],
  ['Type', 'Type'],
  ['Soort', 'Kind'],
  ['Naam Label', 'Name Label'],
  ['Display Label', 'Display Label'],
  ['Hoofdtekst', 'Heading'],
  ['Tekstblok', 'Text Block'],
  ['Bullet', 'Bullet'],
  ['Bullets', 'Bullets'],
  ['Item', 'Item'],
  ['Items', 'Items'],

  // Dropdown / select option titles (we keep these too)
  ['Ontbijt', 'Breakfast'],
  ['Lunch', 'Lunch'],
  ['Diner', 'Dinner'],
  ['Eenvoudig', 'Easy'],
  ['Gemiddeld', 'Moderate'],
  ['Uitdagend', 'Challenging'],
  ['Zwaar', 'Strenuous'],
  ['Wildlife Safari', 'Wildlife Safari'],
  ['Gorilla Trekking', 'Gorilla Trekking'],
  ['Cultureel', 'Cultural'],
  ['Familie', 'Family'],
  ['Gecombineerd', 'Combined'],
  ['Wandelen', 'Hiking'],
  ['Vogels Spotten', 'Birdwatching'],
  ['Vogels', 'Birds'],
  ['Hotel', 'Hotel'],
  ['Lodge', 'Lodge'],
  ['Tented Camp', 'Tented Camp'],
  ['Resort', 'Resort'],

  // Stand-alone single Dutch words used as titles
  ['Taal', 'Language'],
  ['Naam Pagina', 'Page Name'],

  // Second pass — common compound terms
  ['Ondertitel', 'Subtitle'],
  ['Buttontekst', 'Button Text'],
  ['Knoptekst', 'Button Text'],
  ['Koptekst', 'Heading'],
  ['Sectie Koptekst', 'Section Heading'],
  ['Sectie', 'Section'],
  ['Categoryën Koptekst', 'Categories Heading'],
  ['Categoryën', 'Categories'],
  ['Wacht op beoordeling', 'Pending Review'],
  ['Publicatiedatum (nieuwste eerst)', 'Publication Date (newest first)'],
  ['Publicatiedatum', 'Publication Date'],
  ['Combinatiereizen', 'Combined Trips'],
  ['Combinatiereis', 'Combined Trip'],
  ['Geboekte Safari', 'Booked Safari'],
  ['Tripdatum', 'Trip Date'],
  ['Wildlife Sectie', 'Wildlife Section'],
  ['Verhalen Sectie Koptekst', 'Stories Section Heading'],
  ['Verhalen', 'Stories'],
  ['Lezer CTA Koptekst', 'Reader CTA Heading'],
  ['Lezer CTA', 'Reader CTA'],
  ['Lezer', 'Reader'],
  ['Featurede Trips Ondertitel', 'Featured Trips Subtitle'],
  ['Featurede Trips', 'Featured Trips'],
  ['Featurede', 'Featured'],
  ['Featured Trips Ondertitel', 'Featured Trips Subtitle'],
  ['Alle Trips Buttontekst', 'All Trips Button Text'],
  ['Alle Trips', 'All Trips'],
  ['Alle Destinations Buttontekst', 'All Destinations Button Text'],
  ['Alle Destinations', 'All Destinations'],
  ['Alle', 'All'],
  ['Meer Verhalen Buttontekst', 'More Stories Button Text'],
  ['Meer Verhalen', 'More Stories'],
  ['Meer', 'More'],
  ['Begin Buttontekst', 'Start Button Text'],
  ['Begin', 'Start'],
  ['Reviews Ondertitel', 'Reviews Subtitle'],
  ['Destinations Ondertitel', 'Destinations Subtitle'],
  ['CTA Ondertitel', 'CTA Subtitle'],
  ['Hero Ondertitel', 'Hero Subtitle'],
  ['Wildlife Title', 'Wildlife Title'],
  ['Wildlife Ondertitel', 'Wildlife Subtitle'],
  ['Review tekst', 'Review Text'],
  ['Naam van', 'Name of'],
  ['Achtergrondafbeelding', 'Background Image'],
  ['Plaatsnaam', 'Place Name'],
  ['Plaats', 'Place'],
  ['Per stuk', 'Per Item'],
  ['Per nacht', 'Per Night'],
  ['Per dag', 'Per Day'],
  ['Vanaf', 'From'],
  ['Tot', 'To'],
  ['Dagen', 'Days'],
  ['Nachten', 'Nights'],
  ['Uur', 'Hour'],
  ['Uren', 'Hours'],
  ['Aanwezig', 'Present'],
  ['Toon', 'Show'],
  ['Verberg sectie', 'Hide Section'],
  ['Toon sectie', 'Show Section'],
  ['Bekijk', 'View'],
  ['Lees', 'Read'],
  ['Lees Artikel', 'Read Article'],
  ['Klik', 'Click'],
  ['Volgen', 'Follow'],
  ['Verstuur', 'Send'],
  ['Versturen', 'Send'],
  ['Inzenden', 'Submit'],
  ['Indienen', 'Submit'],
  ['Annuleren', 'Cancel'],
  ['Bevestigen', 'Confirm'],
  ['Aanmaken', 'Create'],
  ['Bewerken', 'Edit'],
  ['Verwijderen', 'Delete'],
  ['Wachtwoord', 'Password'],
  ['Inloggen', 'Login'],
  ['Uitloggen', 'Logout'],
  ['Voorvertoning', 'Preview'],
  ['Galerij Ondertitel', 'Gallery Subtitle'],
  ['Galerij Beschrijving', 'Gallery Description'],
  ['Galerij Toevoegen Label', 'Gallery Add Label'],
  ['Galerij Overflow Label', 'Gallery Overflow Label'],
  ['Galerij Bekijk Label', 'Gallery View Label'],
  ['Galerij CTA Label', 'Gallery CTA Label'],
  ['Toevoegen', 'Add'],
  ['Toevoegen Label', 'Add Label'],
  ['Algemeen', 'General'],
  ['Geavanceerd', 'Advanced'],
  ['Standaard Open', 'Open by Default'],
  ['Open', 'Open'],
  ['Sluit', 'Close'],

  // Third pass — terms still in Dutch
  ['Sitenaam', 'Site Name'],
  ['Tijden', 'Hours'],
  ['"Bekijk" Label', '"View" Label'],
  ['"Reizen" (meervoud)', '"Trips" (plural)'],
  ['"Boek deze reis" Knoptekst', '"Book this trip" Button Text'],
  ['"Eigen Reisschema" Knoptekst', '"Custom Itinerary" Button Text'],
  ['"Bekijk Locatie" Label', '"View Location" Label'],
  ['Gerelateerde Trips Heading Prefix', 'Related Trips Heading Prefix'],
  ['Gerelateerde', 'Related'],
  ['Aangemaakt op', 'Created At'],
  ['Aangemaakt (nieuwste eerst)', 'Created (newest first)'],
  ['Aangemaakt', 'Created'],
  ['Bewerkt op', 'Updated At'],
  ['Bewerkt', 'Updated'],

  // Description-only Dutch text
  ['Bijv. "Safari reizen in" (gevolgd door bestemmingsnaam).', 'E.g. "Safari trips in" (followed by destination name).'],
  ['Bijv. "Ontdek Al Onze Reizen".', 'E.g. "Discover All Our Trips".'],
  ['Bijv.', 'E.g.'],
  ['gevolgd door', 'followed by'],
  ['Hoofdtitel, bijv. "Ontdek Afrika".', 'Main title, e.g. "Discover Africa".'],
  ['Hoofdtitel,', 'Main title,'],
  ['bijv.', 'e.g.'],

  // Lingering label terms used inside quoted Dutch labels
  ['Reizen Buttontekst', 'Trips Button Text'],
  ['Reizen', 'Trips'],
  ['Bestemmingsnaam', 'Destination Name'],
  ['Reisnaam', 'Trip Name'],
  ['Reis Datum', 'Trip Date'],

  // Fourth pass — descriptions, edge cases, lingering terms
  ['Vink aan om deze pagina te verbergen van Google en andere zoekmachines.', 'Tick to hide this page from Google and other search engines.'],
  ['Vink aan', 'Tick'],
  ['Vink uit om deze review tijdelijk te verbergen zonder te verwijderen.', 'Untick to temporarily hide this review without deleting it.'],
  ['Vink uit', 'Untick'],
  ['Backgroundafbeelding voor de hero sectie.', 'Background image for the hero section.'],
  ['Backgroundafbeelding', 'Background Image'],
  ['voor de hero sectie', 'for the hero section'],
  ['voor de', 'for the'],
  ['Lager = eerder. Laat leeg om op datum te sorteren.', 'Lower = earlier. Leave empty to sort by date.'],
  ['Lager', 'Lower'],
  ['eerder', 'earlier'],
  ['Laat leeg om op datum te sorteren.', 'Leave empty to sort by date.'],
  ['Laat leeg', 'Leave empty'],
  ['Weergeven op website?', 'Show on website?'],
  ['Weergeven', 'Display'],
  ['Geverifieerd Label', 'Verified Label'],
  ['Geverifieerd', 'Verified'],
  ['Geaccentueerd deel van de titel (in goud), e.g.', 'Accented part of the title (in gold), e.g.'],
  ['Geaccentueerd', 'Accented'],
  ['deel van de titel', 'part of the title'],
  ['Primaire knoptekst,', 'Primary button text,'],
  ['Primaire', 'Primary'],
  ['Secondaire knoptekst,', 'Secondary button text,'],
  ['Secondaire', 'Secondary'],
  ['"Ontdek Afrika"', '"Discover Africa"'],
  ['"Ontdek', '"Discover'],
  ['"op zijn puurste"', '"in its purest form"'],
  ['"Bekijk onze reizen"', '"View our trips"'],
  ['"Bekijk alle reizen"', '"View all trips"'],
  ['"Bekijk', '"View'],
  ['"Wat onze reizigers zeggen"', '"What our travellers say"'],
  ['"Onze gegevens"', '"Our details"'],
  ['"Veelgestelde Vragen"', '"Frequently Asked Questions"'],
  ['"Categorieën"', '"Categories"'],
  ['"Alles Bekijken"', '"View All"'],
  ['"Geen resultaten gevonden voor"', '"No results found for"'],
  ['Geen Resultaten Text', 'No Results Text'],
  ['Geen Resultaten', 'No Results'],
  ['"Adres"', '"Address"'],

  // Lingering Dutch in descriptions
  ['Onze', 'Our'],
  ['onze', 'our'],
  ['de hero sectie', 'the hero section'],
  ['de titel', 'the title'],
  ['de pagina', 'the page'],
  ['de reizen', 'the trips'],
  ['onze reizen', 'our trips'],
  ['onze reizigers', 'our travellers'],
  ['onze gegevens', 'our details'],
  ['hoofdtekst', 'heading'],
]

const FILES = []
function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p)
    else if (p.endsWith('.ts') || p.endsWith('.tsx')) FILES.push(p)
  }
}
walk(ROOT)

let totalReplacements = 0
const fileReports = []

for (const file of FILES) {
  const original = readFileSync(file, 'utf8')
  let updated = original
  let count = 0

  // Replace titles & descriptions in single-quoted strings.
  // We're conservative: only match contents of `title: '…'` and
  // `description: '…'` (and array variant `title: \"…\"` if any).
  for (const [from, to] of MAP) {
    if (from === to) continue
    // Single-quoted, and anywhere inside the quoted value (since some titles have parenthetical)
    // Use word-boundary-ish: ensure the surrounding chars aren't also letters.
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Match `title: '…<from>…'` or `description: '…<from>…'`
    const pattern = new RegExp(
      `((?:title|description)\\s*:\\s*['"\`])([^'"\`]*?)(${escaped})([^'"\`]*?)(['"\`])`,
      'g',
    )
    updated = updated.replace(pattern, (_, pre, before, _match, after, post) => {
      count++
      return `${pre}${before}${to}${after}${post}`
    })
  }

  if (count > 0) {
    writeFileSync(file, updated, 'utf8')
    fileReports.push({ file: file.replace(process.cwd() + '/', ''), count })
    totalReplacements += count
  }
}

console.log(`\nTotal replacements: ${totalReplacements}`)
for (const r of fileReports.sort((a, b) => b.count - a.count)) {
  console.log(`  ${r.count.toString().padStart(4)}  ${r.file}`)
}
