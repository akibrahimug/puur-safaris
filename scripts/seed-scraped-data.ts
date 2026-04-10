/**
 * Seed script: creates trip and destination documents in Sanity
 * from scraped data (oliotyaugandasafaris.com).
 *
 * Usage:
 *   source .env.local && npx tsx scripts/seed-scraped-data.ts
 */

const PROJECT_ID = '68gnvrgl'
const DATASET = 'production'
const API_VERSION = '2025-01-01'
const TOKEN = process.env.SANITY_API_WRITE_TOKEN

if (!TOKEN) {
  console.error('Missing SANITY_API_WRITE_TOKEN — run: source .env.local first')
  process.exit(1)
}

const MUTATE_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`

// ───────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function makeKey(): string {
  return Math.random().toString(36).slice(2, 14)
}

function blockText(text: string) {
  return [
    {
      _type: 'block',
      _key: makeKey(),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: makeKey(), text, marks: [] }],
    },
  ]
}

interface ItineraryDay {
  _type: 'itineraryDay'
  _key: string
  day: number
  title: string
  description: string
  location?: string
  meals?: string[]
}

function iDay(
  day: number,
  title: string,
  description: string,
  location?: string,
  meals?: string[]
): ItineraryDay {
  return {
    _type: 'itineraryDay',
    _key: makeKey(),
    day,
    title,
    description,
    ...(location ? { location } : {}),
    ...(meals ? { meals } : {}),
  }
}

// ───────────────────────────────────────────────────────
// Destinations (Dutch)
// ───────────────────────────────────────────────────────

const destinations = [
  {
    _id: 'destination-semuliki',
    _type: 'destination',
    name: 'Semuliki Nationaal Park',
    slug: { _type: 'slug', current: 'semuliki-nationaal-park' },
    country: 'Oeganda',
    continent: 'Africa',
    excerpt:
      'Oud Ituri-regenwoud met hete bronnen, 53 zoogdiersoorten en 441 vogelsoorten. Een uniek laagland-regenwoud in West-Oeganda.',
    description: blockText(
      'Semuliki Nationaal Park beslaat 220 km² en is een uitbreiding van het oeroude Ituri-bos uit de Democratische Republiek Congo. Het park herbergt 53 zoogdiersoorten en 441 vogelsoorten, waaronder vele soorten die nergens anders in Oost-Afrika voorkomen. De beroemde hete bronnen van Sempaya zijn een van de hoogtepunten van elk bezoek.'
    ),
    climate: 'Tropisch regenwoudklimaat met neerslag het hele jaar door. Temperaturen tussen 18-30°C.',
    bestTimeToVisit: 'Juni t/m augustus & januari t/m februari (droge seizoenen)',
    displayOrder: 6,
    language: 'nl',
  },
  {
    _id: 'destination-kidepo',
    _type: 'destination',
    name: 'Kidepo Valley Nationaal Park',
    slug: { _type: 'slug', current: 'kidepo-valley-nationaal-park' },
    country: 'Oeganda',
    continent: 'Africa',
    excerpt:
      'Afgelegen wildernis van 1.442 km² in het noordoosten, met de enige cheetah-populatie van Oeganda en 475 vogelsoorten.',
    description: blockText(
      'Kidepo Valley Nationaal Park ligt 700 km ten noordoosten van Kampala en beslaat 1.442 km² ruige savanne. Het park herbergt 77 zoogdiersoorten — waaronder de enige cheetah-populatie van Oeganda — en 475 vogelsoorten. De afgelegen ligging maakt het een van de meest ongerepte wildernisgebieden van Afrika.'
    ),
    climate: 'Semi-aride savanneklimaat. Droge seizoenen zijn het best voor wildspotten.',
    bestTimeToVisit: 'Januari t/m maart (droog seizoen)',
    displayOrder: 2,
    language: 'nl',
  },
  {
    _id: 'destination-queen-elizabeth',
    _type: 'destination',
    name: 'Queen Elizabeth Nationaal Park',
    slug: { _type: 'slug', current: 'queen-elizabeth-nationaal-park' },
    country: 'Oeganda',
    continent: 'Africa',
    excerpt:
      'Oeganda\'s populairste park: 1.978 km² met boomklimmende leeuwen, het Kazinga-kanaal en meer dan 600 vogelsoorten.',
    description: blockText(
      'Queen Elizabeth Nationaal Park beslaat 1.978 km² en is het meest bezochte park van Oeganda. Het is beroemd om de boomklimmende leeuwen van Ishasha, het Kazinga-kanaal vol nijlpaarden en krokodillen, en meer dan 95 zoogdiersoorten en 600+ vogelsoorten. Het diverse landschap varieert van savanne tot tropisch bos en kratermeren.'
    ),
    climate:
      'Tropisch klimaat met twee droge seizoenen. Temperaturen gemiddeld 20-27°C.',
    bestTimeToVisit: 'Juni t/m september & december t/m januari (droge seizoenen)',
    displayOrder: 3,
    language: 'nl',
  },
  {
    _id: 'destination-mgahinga',
    _type: 'destination',
    name: 'Mgahinga Gorilla Nationaal Park',
    slug: { _type: 'slug', current: 'mgahinga-gorilla-nationaal-park' },
    country: 'Oeganda',
    continent: 'Africa',
    excerpt:
      'Compact park van 33,7 km² met drie uitgedoofde vulkanen, berggorilla\'s, gouden apen en Batwa-cultuur.',
    description: blockText(
      'Mgahinga Gorilla Nationaal Park is met 33,7 km² het kleinste nationaal park van Oeganda, maar biedt buitengewone ervaringen. Het park omvat drie uitgedoofde vulkanen van de Virunga-keten en is de thuisbasis van berggorilla\'s en de zeldzame gouden aap. De Batwa Experience biedt inzicht in de cultuur van de oorspronkelijke bosbewoners.'
    ),
    climate: 'Koel bergklimaat, temperaturen 7-20°C afhankelijk van hoogte.',
    bestTimeToVisit: 'December t/m januari & juni t/m augustus (droge seizoenen)',
    displayOrder: 4,
    language: 'nl',
  },
  {
    _id: 'destination-bwindi',
    _type: 'destination',
    name: 'Bwindi Impenetrable Nationaal Park',
    slug: { _type: 'slug', current: 'bwindi-impenetrable-nationaal-park' },
    country: 'Oeganda',
    continent: 'Africa',
    excerpt:
      'UNESCO-werelderfgoed met circa 400 berggorilla\'s in 25.000 jaar oud regenwoud. Veertien gehabitueerde groepen.',
    description: blockText(
      'Bwindi Impenetrable Nationaal Park beslaat 331 km² en is een UNESCO-werelderfgoedgebied. Het 25.000 jaar oude regenwoud herbergt ongeveer 400 berggorilla\'s — bijna de helft van de wereldpopulatie — verdeeld over 14 gehabitueerde groepen. Het park biedt ook uitstekende vogelmogelijkheden met meer dan 350 soorten.'
    ),
    climate:
      'Koel en vochtig tropisch bergklimaat. Regen is mogelijk het hele jaar door.',
    bestTimeToVisit: 'Juni t/m augustus & december t/m februari (droge seizoenen)',
    displayOrder: 1,
    language: 'nl',
  },
  {
    _id: 'destination-murchison',
    _type: 'destination',
    name: 'Murchison Falls Nationaal Park',
    slug: { _type: 'slug', current: 'murchison-falls-nationaal-park' },
    country: 'Oeganda',
    continent: 'Africa',
    excerpt:
      'Oeganda\'s grootste park: 3.893 km² met de krachtige Murchison-watervallen, 144 zoogdiersoorten en Rothschild-giraffen.',
    description: blockText(
      'Murchison Falls Nationaal Park is met 3.893 km² het grootste en oudste beschermde gebied van Oeganda. De Victoria-Nijl perst zich hier door een 7 meter brede kloof en stort 45 meter naar beneden. Het park herbergt 144 zoogdiersoorten, 556 vogelsoorten en de zeldzame Rothschild-giraffe. Bootcruises op de Nijl en gamedrive\'s behoren tot de populairste activiteiten.'
    ),
    climate:
      'Tropisch savanneklimaat met gemiddelde temperaturen van 22-28°C.',
    bestTimeToVisit: 'December t/m februari & juni t/m juli (droge seizoenen)',
    displayOrder: 5,
    language: 'nl',
  },
]

// ───────────────────────────────────────────────────────
// Trips (Dutch)
// ───────────────────────────────────────────────────────

const trips = [
  {
    _id: 'trip-14-dagen-noord-west-zuid-oeganda',
    _type: 'trip',
    title: '14 Dagen Noord, West & Zuid Oeganda',
    slug: { _type: 'slug', current: '14-dagen-noord-west-zuid-oeganda' },
    excerpt:
      'Ultieme Oeganda-safari door het noorden, westen en zuiden. Van Murchison Falls tot gorilla-trekking in Bwindi.',
    duration: '14 dagen / 13 nachten',
    daysCount: 14,
    price: 5074,
    priceType: 'per_person',
    difficulty: 'challenging',
    minPersons: 4,
    maxPersons: 32,
    category: 'combined',
    featured: true,
    active: true,
    language: 'nl',
    destination: { _type: 'reference', _ref: 'destination-queen-elizabeth' },
    highlights: [
      'Murchison Falls — krachtigste waterval van Afrika',
      'Chimpansee-trekking in Kibale Forest',
      'Queen Elizabeth Nationaal Park gamedrive',
      'Boomklimmende leeuwen van Ishasha',
      'Gorilla-trekking in Bwindi Impenetrable Forest',
      'Bootcruise op het Kazinga-kanaal',
      'Neushoornwandeling bij Ziwa Rhino Sanctuary',
    ],
    included: [
      'Luchthaven transfers',
      '4x4 safariwagen met Engelstalige gids',
      '13 nachten accommodatie',
      'Alle maaltijden (volpension)',
      'Parkentreegelden',
      'Neushoornwandeling bij Ziwa',
      'Gamedrive\'s en bootcruises',
      'Chimpansee-trekpermit',
      'Gorilla-trekpermit',
      'Drinkwater tijdens safari',
    ],
    excluded: [
      'Internationale vluchten',
      'Visum voor Oeganda',
      'Reisverzekering',
      'Accommodatie-upgrades',
      'Alcoholische dranken',
      'Persoonlijke uitgaven',
      'Fooien voor gidsen en personeel',
      'Medische tests (bijv. COVID)',
    ],
    itinerary: [
      iDay(1, 'Aankomst Entebbe', 'Aankomst op Entebbe International Airport. Transfer naar uw hotel bij het Victoriameer. Welkomstbriefing en tijd om uit te rusten.', 'Entebbe', ['dinner']),
      iDay(2, 'Murchison Falls via Ziwa Rhino\'s', 'Vertrek richting Murchison Falls Nationaal Park met een tussenstop bij het Ziwa Rhino Sanctuary voor een neushoornwandeling. Aankomst bij de lodge in de middag.', 'Murchison Falls NP', ['breakfast', 'lunch', 'dinner']),
      iDay(3, 'Gamedrive & boottocht naar de watervallen', 'Ochtend-gamedrive door het park. Middagboottocht op de Nijl naar de voet van de machtige Murchison Falls. Spot nijlpaarden, krokodillen en talloze vogels.', 'Murchison Falls NP', ['breakfast', 'lunch', 'dinner']),
      iDay(4, 'Reis naar Kibale Forest', 'Schilderachtige rit zuidwaarts door het Oegandese platteland naar het Kibale Forest-gebied. Aankomst en check-in bij de lodge.', 'Kibale Forest', ['breakfast', 'lunch', 'dinner']),
      iDay(5, 'Chimpansee-trekking', 'Ochtend chimpansee-trekking in het Kibale National Park — de thuisbasis van 13 primatensoorten. Middag bezoek aan het Bigodi-moerasgebied voor vogels en apen.', 'Kibale Forest', ['breakfast', 'lunch', 'dinner']),
      iDay(6, 'Queen Elizabeth Nationaal Park', 'Reis naar Queen Elizabeth Nationaal Park. Middaggamedrive door de Kasenyi-vlakten op zoek naar leeuwen, olifanten en buffels.', 'Queen Elizabeth NP', ['breakfast', 'lunch', 'dinner']),
      iDay(7, 'Kazinga-kanaal bootcruise', 'Ochtend-gamedrive. Middagbootcruise op het Kazinga-kanaal — een van de beste plekken ter wereld voor nijlpaarden en vogels.', 'Queen Elizabeth NP', ['breakfast', 'lunch', 'dinner']),
      iDay(8, 'Ishasha boomklimmende leeuwen', 'Reis naar de Ishasha-sector van Queen Elizabeth NP, beroemd om de boomklimmende leeuwen. Gamedrive door de vijgenbomen op zoek naar deze unieke leeuwen.', 'Ishasha', ['breakfast', 'lunch', 'dinner']),
      iDay(9, 'Reis naar Bwindi', 'Schilderachtige rit door de heuvels naar Bwindi Impenetrable Forest. Aankomst bij de lodge en briefing over de gorilla-trekking van morgen.', 'Bwindi', ['breakfast', 'lunch', 'dinner']),
      iDay(10, 'Gorilla-trekking', 'De ervaring van een leven: gorilla-trekking in Bwindi Impenetrable Forest. Volg een gehabitueerde gorillafamilie door het oerbos en breng een onvergetelijk uur met hen door.', 'Bwindi', ['breakfast', 'lunch', 'dinner']),
      iDay(11, 'Lake Mutanda', 'Vrije dag om te ontspannen bij het prachtige Lake Mutanda, omringd door vulkanen. Optioneel: kanotocht of dorpswandeling.', 'Lake Mutanda', ['breakfast', 'lunch', 'dinner']),
      iDay(12, 'Mgahinga & Lake Bunyonyi', 'Bezoek aan Mgahinga Gorilla Nationaal Park voor een wandeling of culturele ervaring. Daarna doorrit naar het schitterende Lake Bunyonyi.', 'Lake Bunyonyi', ['breakfast', 'lunch', 'dinner']),
      iDay(13, 'Lake Mburo Nationaal Park', 'Reis naar Lake Mburo Nationaal Park. Middaggamedrive — het enige park in Oeganda met zebra\'s en impala\'s. Optionele wandelsafari.', 'Lake Mburo NP', ['breakfast', 'lunch', 'dinner']),
      iDay(14, 'Terugreis naar Entebbe', 'Ochtend-gamedrive of wandeling. Daarna terugrit naar Entebbe voor uw vertrekvlucht. Einde van een onvergetelijke reis.', 'Entebbe', ['breakfast', 'lunch']),
    ],
  },
  {
    _id: 'trip-5-dagen-kidepo-valley-safari',
    _type: 'trip',
    title: '5 Dagen Kidepo Valley Safari',
    slug: { _type: 'slug', current: '5-dagen-kidepo-valley-safari' },
    excerpt:
      'Ontdek Oeganda\'s meest afgelegen en ongerepte wildernis in het spectaculaire Kidepo Valley Nationaal Park.',
    duration: '5 dagen / 4 nachten',
    daysCount: 5,
    price: 1200,
    priceType: 'per_person',
    difficulty: 'moderate',
    minPersons: 4,
    maxPersons: 32,
    category: 'wildlife',
    featured: false,
    active: true,
    language: 'nl',
    destination: { _type: 'reference', _ref: 'destination-kidepo' },
    highlights: [
      'Kidepo Valley — meest afgelegen park van Oeganda',
      'Neushoornwandeling bij Ziwa Rhino Sanctuary',
      'Hete bronnen wandeling',
      'Karamojong dorpsbezoek',
      'Gamedrive\'s met kans op cheetah\'s',
    ],
    included: [
      'Luchthaven transfers',
      '4x4 safariwagen met Engelstalige gids',
      '4 nachten accommodatie',
      'Alle maaltijden (volpension)',
      'Parkentreegelden',
      'Neushoornwandeling bij Ziwa',
      'Gamedrive\'s',
      'Drinkwater tijdens safari',
    ],
    excluded: [
      'Internationale vluchten',
      'Visum voor Oeganda',
      'Reisverzekering',
      'Accommodatie-upgrades',
      'Alcoholische dranken',
      'Persoonlijke uitgaven',
      'Fooien voor gidsen en personeel',
    ],
    itinerary: [
      iDay(1, 'Naar Gulu via Ziwa Rhino\'s', 'Vertrek vanuit Kampala richting het noorden. Tussenstop bij Ziwa Rhino Sanctuary voor een wandeling tussen de neushoorns. Doorrit naar Gulu voor overnachting.', 'Gulu', ['lunch', 'dinner']),
      iDay(2, 'Naar Kidepo & middag-gamedrive', 'Voortzetting van de reis naar Kidepo Valley Nationaal Park. Na aankomst en check-in, middaggamedrive door de Narus-vallei op zoek naar leeuwen, buffels en olifanten.', 'Kidepo Valley NP', ['breakfast', 'lunch', 'dinner']),
      iDay(3, 'Gamedrive & hete bronnen', 'Ochtend-gamedrive in de Kidepo- en Narus-valleien. Middag wandeling naar de hete bronnen van Kanangorok aan de grens met Zuid-Soedan.', 'Kidepo Valley NP', ['breakfast', 'lunch', 'dinner']),
      iDay(4, 'Gamedrive & Karamojong dorp', 'Laatste ochtend-gamedrive. Middagbezoek aan een Karamojong-dorp om kennis te maken met deze fascinerende semi-nomadische cultuur.', 'Kidepo Valley NP', ['breakfast', 'lunch', 'dinner']),
      iDay(5, 'Terugreis', 'Vertrek uit Kidepo voor de terugreis naar Kampala/Entebbe. Lange maar schilderachtige rit door Noord-Oeganda.', 'Kampala', ['breakfast', 'lunch']),
    ],
  },
  {
    _id: 'trip-6-dagen-primaten-en-safari',
    _type: 'trip',
    title: '6 Dagen Primaten & Safari',
    slug: { _type: 'slug', current: '6-dagen-primaten-en-safari' },
    excerpt:
      'Combineer gorilla-trekking in Bwindi met kanotochten op Lake Bunyonyi en wildspotten in Lake Mburo.',
    duration: '6 dagen / 5 nachten',
    daysCount: 6,
    price: 2300,
    priceType: 'per_person',
    difficulty: 'moderate',
    minPersons: 4,
    maxPersons: 32,
    category: 'wildlife',
    featured: true,
    active: true,
    language: 'nl',
    destination: { _type: 'reference', _ref: 'destination-bwindi' },
    highlights: [
      'Gorilla-trekking in Bwindi Impenetrable Forest',
      'Kanotocht op Lake Bunyonyi',
      'Lake Mutanda met vulkaanuitzicht',
      'Wildspotten in Lake Mburo Nationaal Park',
    ],
    included: [
      'Luchthaven transfers',
      '4x4 safariwagen met Engelstalige gids',
      '5 nachten accommodatie',
      'Alle maaltijden (volpension)',
      'Parkentreegelden',
      'Gorilla-trekpermit',
      'Kanotocht Lake Bunyonyi',
      'Gamedrive\'s',
      'Drinkwater tijdens safari',
    ],
    excluded: [
      'Internationale vluchten',
      'Visum voor Oeganda',
      'Reisverzekering',
      'Accommodatie-upgrades',
      'Alcoholische dranken',
      'Persoonlijke uitgaven',
      'Fooien voor gidsen en personeel',
    ],
    itinerary: [
      iDay(1, 'Reis naar Lake Bunyonyi', 'Vertrek vanuit Kampala richting het zuidwesten. Schilderachtige rit door het Oegandese berglandschap naar het prachtige Lake Bunyonyi.', 'Lake Bunyonyi', ['lunch', 'dinner']),
      iDay(2, 'Kanotocht Lake Bunyonyi', 'Hele dag om te genieten van Lake Bunyonyi — het op een na diepste meer van Afrika. Kanotocht langs de 29 eilanden met dorpsbezoeken onderweg.', 'Lake Bunyonyi', ['breakfast', 'lunch', 'dinner']),
      iDay(3, 'Reis naar Bwindi', 'Korte rit naar Bwindi Impenetrable Forest. Aankomst bij de lodge en middagbriefing ter voorbereiding op de gorilla-trekking.', 'Bwindi', ['breakfast', 'lunch', 'dinner']),
      iDay(4, 'Gorilla-trekking & Lake Mutanda', 'Vroege ochtend start voor de gorilla-trekking. Na terugkomst, bezoek aan het serene Lake Mutanda met uitzicht op de Virunga-vulkanen.', 'Lake Mutanda', ['breakfast', 'lunch', 'dinner']),
      iDay(5, 'Lake Mburo Nationaal Park', 'Reis naar Lake Mburo Nationaal Park. Middaggamedrive op zoek naar zebra\'s, giraffen, impala\'s en meer.', 'Lake Mburo NP', ['breakfast', 'lunch', 'dinner']),
      iDay(6, 'Terugreis naar Entebbe', 'Ochtendwandelsafari of boottocht in Lake Mburo. Daarna terugrit naar Entebbe voor uw vertrek.', 'Entebbe', ['breakfast', 'lunch']),
    ],
  },
  {
    _id: 'trip-22-dagen-diep-in-oeganda',
    _type: 'trip',
    title: '22 Dagen Diep in Oeganda',
    slug: { _type: 'slug', current: '22-dagen-diep-in-oeganda' },
    excerpt:
      'Het ultieme Oeganda-avontuur: 22 dagen vol wildlife, avontuur, cultuur en adembenemende natuur door het hele land.',
    duration: '22 dagen / 21 nachten',
    daysCount: 22,
    price: 7200,
    priceType: 'per_person',
    difficulty: 'challenging',
    minPersons: 4,
    maxPersons: 32,
    category: 'combined',
    featured: true,
    active: true,
    language: 'nl',
    destination: { _type: 'reference', _ref: 'destination-queen-elizabeth' },
    highlights: [
      'Boda-boda stadstour door Kampala',
      'Zip-lining en Nijl-rafting in Jinja',
      'Sipi Falls wandelingen',
      'Kidepo Valley gamedrive\'s',
      'Murchison Falls bootcruise',
      'Chimpansee-trekking in Kibale',
      'Boomklimmende leeuwen van Ishasha',
      'Gorilla-trekking in Bwindi',
      'Kanotocht op Lake Bunyonyi',
      'Mountainbike-safari in Lake Mburo',
    ],
    included: [
      'Luchthaven transfers',
      '4x4 safariwagen met Engelstalige gids',
      '21 nachten accommodatie',
      'Alle maaltijden (volpension)',
      'Parkentreegelden',
      'Alle genoemde activiteiten en permits',
      'Gorilla-trekpermit',
      'Chimpansee-trekpermit',
      'Drinkwater tijdens safari',
    ],
    excluded: [
      'Internationale vluchten',
      'Visum voor Oeganda',
      'Reisverzekering',
      'Accommodatie-upgrades',
      'Alcoholische dranken',
      'Persoonlijke uitgaven',
      'Fooien voor gidsen en personeel',
      'Medische tests (bijv. COVID)',
    ],
    itinerary: [
      iDay(1, 'Kampala stadstour', 'Aankomst en boda-boda stadstour door Kampala. Ontdek de bruisende hoofdstad, lokale markten en bezienswaardigheden.', 'Kampala', ['dinner']),
      iDay(2, 'Jinja — zip-lining', 'Reis naar Jinja, de avontuurlijke hoofdstad van Oost-Afrika. Middag zip-lining door het Mabira-regenwoud.', 'Jinja', ['breakfast', 'lunch', 'dinner']),
      iDay(3, 'Nijl-rafting', 'Hele dag wildwaterrafting op de Nijl — klasse III tot V stroomversnellingen voor een adrenalinekick van formaat.', 'Jinja', ['breakfast', 'lunch', 'dinner']),
      iDay(4, 'Sipi Falls', 'Reis naar de Sipi Falls aan de flanken van de Mount Elgon. Aankomst en eerste verkenning van het gebied.', 'Sipi Falls', ['breakfast', 'lunch', 'dinner']),
      iDay(5, 'Sipi Falls wandeling', 'Hele dag wandeling langs de drie spectaculaire watervallen van Sipi. Optioneel: koffieproeverij bij lokale boeren.', 'Sipi Falls', ['breakfast', 'lunch', 'dinner']),
      iDay(6, 'Reis naar Moroto', 'Reis naar Moroto in het land van de Karamojong. Kennismaking met de lokale cultuur.', 'Moroto', ['breakfast', 'lunch', 'dinner']),
      iDay(7, 'Mountainbiken & cultuur', 'Mountainbiken door het Karamojong-landschap. Middagbezoek aan een traditioneel dorp voor culturele uitwisseling.', 'Moroto', ['breakfast', 'lunch', 'dinner']),
      iDay(8, 'Kidepo Valley & gamedrive', 'Reis naar Kidepo Valley Nationaal Park. Middaggamedrive door de savanne op zoek naar leeuwen, olifanten en cheetah\'s.', 'Kidepo Valley NP', ['breakfast', 'lunch', 'dinner']),
      iDay(9, 'Kidepo gamedrive', 'Hele dag gamedrive door de Narus- en Kidepo-valleien. Een van de beste wildspotplekken van heel Oeganda.', 'Kidepo Valley NP', ['breakfast', 'lunch', 'dinner']),
      iDay(10, 'Reis naar Murchison Falls', 'Lange maar schilderachtige rit westwaarts naar Murchison Falls Nationaal Park. Aankomst bij de lodge.', 'Murchison Falls NP', ['breakfast', 'lunch', 'dinner']),
      iDay(11, 'Gamedrive & bootcruise', 'Ochtend-gamedrive. Middagbootcruise op de Nijl naar de machtige Murchison Falls. Wandeling naar de top van de watervallen.', 'Murchison Falls NP', ['breakfast', 'lunch', 'dinner']),
      iDay(12, 'Reis naar Kibale Forest', 'Reis zuidwaarts naar Kibale Forest, het primatenparadijs van Oeganda.', 'Kibale Forest', ['breakfast', 'lunch', 'dinner']),
      iDay(13, 'Chimpansee-trekking', 'Ochtend chimpansee-trekking in Kibale National Park. Middag bezoek aan het Bigodi-moerasgebied.', 'Kibale Forest', ['breakfast', 'lunch', 'dinner']),
      iDay(14, 'Queen Elizabeth Nationaal Park', 'Reis naar Queen Elizabeth NP. Middaggamedrive door de Kasenyi-vlakten.', 'Queen Elizabeth NP', ['breakfast', 'lunch', 'dinner']),
      iDay(15, 'Kazinga-kanaal bootcruise', 'Ochtend-gamedrive. Middagbootcruise op het Kazinga-kanaal vol nijlpaarden en vogels.', 'Queen Elizabeth NP', ['breakfast', 'lunch', 'dinner']),
      iDay(16, 'Ishasha boomklimmende leeuwen', 'Reis naar Ishasha-sector op zoek naar de beroemde boomklimmende leeuwen in de vijgenbomen.', 'Ishasha', ['breakfast', 'lunch', 'dinner']),
      iDay(17, 'Reis naar Bwindi', 'Schilderachtige rit door de heuvels naar Bwindi Impenetrable Forest. Middagbriefing voor gorilla-trekking.', 'Bwindi', ['breakfast', 'lunch', 'dinner']),
      iDay(18, 'Gorilla-trekking', 'De ultieme wildlife-ervaring: gorilla-trekking in Bwindi. Een onvergetelijk uur bij een gorillafamilie in het oerbos.', 'Bwindi', ['breakfast', 'lunch', 'dinner']),
      iDay(19, 'Lake Bunyonyi kanotocht', 'Reis naar Lake Bunyonyi. Middagkanotocht over het meer langs de eilanden. Ontspanning bij het meer.', 'Lake Bunyonyi', ['breakfast', 'lunch', 'dinner']),
      iDay(20, 'Lake Mburo Nationaal Park', 'Reis naar Lake Mburo Nationaal Park. Middaggamedrive op zoek naar zebra\'s en impala\'s.', 'Lake Mburo NP', ['breakfast', 'lunch', 'dinner']),
      iDay(21, 'Mountainbike-safari', 'Ochtend mountainbike-safari door Lake Mburo — een unieke manier om wilde dieren van dichtbij te beleven.', 'Lake Mburo NP', ['breakfast', 'lunch', 'dinner']),
      iDay(22, 'Terugreis naar Entebbe', 'Terugreis naar Entebbe. Afscheid en transfer naar de luchthaven.', 'Entebbe', ['breakfast', 'lunch']),
    ],
  },
  {
    _id: 'trip-6-dagen-jinja-en-sipi-falls',
    _type: 'trip',
    title: '6 Dagen Jinja & Sipi Falls',
    slug: { _type: 'slug', current: '6-dagen-jinja-en-sipi-falls' },
    excerpt:
      'Avontuurlijk Oost-Oeganda: zip-lining, Nijl-rafting, quad-biking en wandelingen bij de spectaculaire Sipi Falls.',
    duration: '6 dagen / 5 nachten',
    daysCount: 6,
    price: 1650,
    priceType: 'per_person',
    difficulty: 'challenging',
    minPersons: 4,
    maxPersons: 32,
    category: 'hiking',
    featured: false,
    active: true,
    language: 'nl',
    destination: { _type: 'reference', _ref: 'destination-murchison' },
    highlights: [
      'Zip-lining door Mabira-regenwoud',
      'Bootcruise op de Nijl',
      'Wildwaterrafting klasse III-V',
      'Quad-biking in Jinja',
      'Sipi Falls wandelingen',
    ],
    included: [
      'Luchthaven transfers',
      '4x4 voertuig met gids',
      '5 nachten accommodatie',
      'Alle maaltijden (volpension)',
      'Alle genoemde activiteiten',
      'Drinkwater',
    ],
    excluded: [
      'Internationale vluchten',
      'Visum voor Oeganda',
      'Reisverzekering',
      'Alcoholische dranken',
      'Persoonlijke uitgaven',
      'Fooien',
    ],
    itinerary: [
      iDay(1, 'Jinja via Mabira zip-lining & bootcruise', 'Reis naar Jinja via het Mabira-regenwoud met zip-lining door de boomtoppen. Aankomst in Jinja en bootcruise op de Nijl bij zonsondergang.', 'Jinja', ['lunch', 'dinner']),
      iDay(2, 'Nijl-rafting', 'Hele dag wildwaterrafting op de Nijl — een van de beste raftingbestemmingen ter wereld met klasse III tot V stroomversnellingen.', 'Jinja', ['breakfast', 'lunch', 'dinner']),
      iDay(3, 'Quad-biking', 'Ochtend quad-biking door de dorpen en het platteland rond Jinja. Middag vrij om te ontspannen of optionele activiteiten.', 'Jinja', ['breakfast', 'lunch', 'dinner']),
      iDay(4, 'Reis naar Sipi Falls', 'Reis oostwaarts naar de Sipi Falls aan de flanken van Mount Elgon. Aankomst en eerste wandeling naar de onderste waterval.', 'Sipi Falls', ['breakfast', 'lunch', 'dinner']),
      iDay(5, 'Sipi Falls wandeling', 'Hele dag wandeling langs alle drie de spectaculaire watervallen van Sipi. Geniet van het adembenemende uitzicht over de vlakten van Oost-Oeganda.', 'Sipi Falls', ['breakfast', 'lunch', 'dinner']),
      iDay(6, 'Terugreis', 'Terugrit naar Kampala/Entebbe. Optioneel: stop bij een lokale koffieproeverij onderweg.', 'Entebbe', ['breakfast', 'lunch']),
    ],
  },
  {
    _id: 'trip-12-dagen-noordwest-oeganda',
    _type: 'trip',
    title: '12 Dagen Noordwest-Oeganda',
    slug: { _type: 'slug', current: '12-dagen-noordwest-oeganda' },
    excerpt:
      'Compleet noordwest-circuit: Murchison Falls, chimpansees in Kibale, Queen Elizabeth NP en gorilla\'s in Bwindi.',
    duration: '12 dagen / 11 nachten',
    daysCount: 12,
    price: 3950,
    priceType: 'per_person',
    difficulty: 'moderate',
    minPersons: 4,
    maxPersons: 32,
    category: 'combined',
    featured: true,
    active: true,
    language: 'nl',
    destination: { _type: 'reference', _ref: 'destination-bwindi' },
    highlights: [
      'Murchison Falls gamedrive & bootcruise',
      'Neushoornwandeling bij Ziwa',
      'Chimpansee-trekking in Kibale Forest',
      'Bigodi-moeras wandeling',
      'Queen Elizabeth NP & Kazinga-kanaal',
      'Boomklimmende leeuwen van Ishasha',
      'Gorilla-trekking in Bwindi',
      'Lake Mburo wandelsafari',
    ],
    included: [
      'Luchthaven transfers',
      '4x4 safariwagen met Engelstalige gids',
      '11 nachten accommodatie',
      'Alle maaltijden (volpension)',
      'Parkentreegelden',
      'Neushoornwandeling bij Ziwa',
      'Gamedrive\'s en bootcruises',
      'Chimpansee-trekpermit',
      'Gorilla-trekpermit',
      'Drinkwater tijdens safari',
    ],
    excluded: [
      'Internationale vluchten',
      'Visum voor Oeganda',
      'Reisverzekering',
      'Accommodatie-upgrades',
      'Alcoholische dranken',
      'Persoonlijke uitgaven',
      'Fooien voor gidsen en personeel',
    ],
    itinerary: [
      iDay(1, 'Aankomst Entebbe', 'Aankomst op Entebbe International Airport. Transfer naar hotel en welkomstbriefing.', 'Entebbe', ['dinner']),
      iDay(2, 'Ziwa Rhino\'s & Murchison Falls', 'Reis naar Murchison Falls via Ziwa Rhino Sanctuary. Neushoornwandeling onderweg. Aankomst bij de lodge.', 'Murchison Falls NP', ['breakfast', 'lunch', 'dinner']),
      iDay(3, 'Gamedrive & bootcruise', 'Ochtend-gamedrive. Middagbootcruise op de Nijl naar de watervallen. Spot nijlpaarden, krokodillen en vogels.', 'Murchison Falls NP', ['breakfast', 'lunch', 'dinner']),
      iDay(4, 'Reis naar Kibale Forest', 'Schilderachtige rit naar Kibale Forest. Aankomst en rust bij de lodge.', 'Kibale Forest', ['breakfast', 'lunch', 'dinner']),
      iDay(5, 'Chimpansee-trekking & Bigodi', 'Ochtend chimpansee-trekking. Middag wandeling door het Bigodi-moerasgebied voor vogels en primaten.', 'Kibale Forest', ['breakfast', 'lunch', 'dinner']),
      iDay(6, 'Queen Elizabeth Nationaal Park', 'Reis naar Queen Elizabeth NP. Middaggamedrive door de savanne.', 'Queen Elizabeth NP', ['breakfast', 'lunch', 'dinner']),
      iDay(7, 'Gamedrive & Kazinga-kanaal', 'Ochtend-gamedrive. Middagbootcruise op het Kazinga-kanaal — paradijs voor nijlpaarden en vogels.', 'Queen Elizabeth NP', ['breakfast', 'lunch', 'dinner']),
      iDay(8, 'Ishasha & Bwindi', 'Ochtend in Ishasha op zoek naar boomklimmende leeuwen. Middag doorrit naar Bwindi Impenetrable Forest.', 'Bwindi', ['breakfast', 'lunch', 'dinner']),
      iDay(9, 'Gorilla-trekking', 'Gorilla-trekking in Bwindi. Een onvergetelijke ontmoeting met berggorilla\'s in hun natuurlijke habitat.', 'Bwindi', ['breakfast', 'lunch', 'dinner']),
      iDay(10, 'Reis naar Lake Mburo', 'Reis naar Lake Mburo Nationaal Park. Middaggamedrive op zoek naar zebra\'s en andere dieren.', 'Lake Mburo NP', ['breakfast', 'lunch', 'dinner']),
      iDay(11, 'Wandelsafari & bootcruise', 'Ochtend wandelsafari door het park. Middagbootcruise op Lake Mburo.', 'Lake Mburo NP', ['breakfast', 'lunch', 'dinner']),
      iDay(12, 'Terugreis naar Entebbe', 'Terugrit naar Entebbe voor uw vertrekvlucht. Einde van een prachtige safari.', 'Entebbe', ['breakfast', 'lunch']),
    ],
  },
  {
    _id: 'trip-10-dagen-rwenzori-bergen',
    _type: 'trip',
    title: '10 Dagen Rwenzori Bergtrekking',
    slug: { _type: 'slug', current: '10-dagen-rwenzori-bergtrekking' },
    excerpt:
      'Beklim de legendarische Rwenzori-bergen — de "Maanbergen" van Afrika — in een uitdagende 6-daagse trekking tot 4.023 m.',
    duration: '10 dagen / 9 nachten',
    daysCount: 10,
    price: 1950,
    priceType: 'per_person',
    difficulty: 'challenging',
    minPersons: 4,
    maxPersons: 32,
    category: 'hiking',
    featured: false,
    active: true,
    language: 'nl',
    highlights: [
      'Rwenzori-bergen — UNESCO-werelderfgoed',
      'Trekking tot 4.023 m (Kitandara)',
      'Unieke afro-alpiene vegetatie',
      'Bujuku-meer op 3.962 m',
      'Zes dagen door ongerept berglandschap',
    ],
    included: [
      'Luchthaven transfers',
      'Transport naar Kasese',
      '9 nachten accommodatie (hotels + berghutten)',
      'Alle maaltijden (volpension)',
      'Parkentreegelden',
      'Berggidsen en dragers',
      'Trekking-uitrusting (basis)',
      'Drinkwater',
    ],
    excluded: [
      'Internationale vluchten',
      'Visum voor Oeganda',
      'Reisverzekering (verplicht)',
      'Persoonlijke trekkinguitrusting',
      'Alcoholische dranken',
      'Persoonlijke uitgaven',
      'Fooien voor gidsen en dragers',
    ],
    itinerary: [
      iDay(1, 'Aankomst Entebbe', 'Aankomst op Entebbe Airport. Transfer naar hotel. Welkomstdiner en trekkingbriefing.', 'Entebbe', ['dinner']),
      iDay(2, 'Reis naar Kasese', 'Reis naar Kasese aan de voet van de Rwenzori-bergen. Laatste voorbereidingen voor de trekking.', 'Kasese', ['breakfast', 'lunch', 'dinner']),
      iDay(3, 'Trek naar Nyabitaba (2.652 m)', 'Start van de trekking. Klim door tropisch regenwoud naar Nyabitaba-hut op 2.652 meter.', 'Nyabitaba Hut (2.652 m)', ['breakfast', 'lunch', 'dinner']),
      iDay(4, 'Trek naar John Matte (3.414 m)', 'Trek door bamboebos en heidevegetatie naar John Matte-hut op 3.414 meter.', 'John Matte Hut (3.414 m)', ['breakfast', 'lunch', 'dinner']),
      iDay(5, 'Trek naar Bujuku (3.962 m)', 'Spectaculaire trekdag naar Bujuku-hut op 3.962 meter bij het Bujuku-meer, omringd door reuzensenechio\'s.', 'Bujuku Hut (3.962 m)', ['breakfast', 'lunch', 'dinner']),
      iDay(6, 'Trek naar Kitandara (4.023 m)', 'Het hoogste punt van de trekking. Trek naar Kitandara-hut op 4.023 meter met uitzicht op de Kitandara-meren.', 'Kitandara Hut (4.023 m)', ['breakfast', 'lunch', 'dinner']),
      iDay(7, 'Trek naar Guy Yeoman (3.261 m)', 'Afdaling naar Guy Yeoman-hut op 3.261 meter. Geniet van de veranderende vegetatiezones.', 'Guy Yeoman Hut (3.261 m)', ['breakfast', 'lunch', 'dinner']),
      iDay(8, 'Terug naar Nyabitaba (2.652 m)', 'Voortzetting van de afdaling terug naar Nyabitaba-hut door het prachtige berglandschap.', 'Nyabitaba Hut (2.652 m)', ['breakfast', 'lunch', 'dinner']),
      iDay(9, 'Afdaling & Kasese', 'Afdaling naar de voet van de berg. Transfer naar hotel in Kasese voor een welverdiende rust.', 'Kasese', ['breakfast', 'lunch', 'dinner']),
      iDay(10, 'Terugreis naar Entebbe', 'Reis terug naar Entebbe. Transfer naar de luchthaven voor uw vertrek.', 'Entebbe', ['breakfast', 'lunch']),
    ],
  },
  {
    _id: 'trip-3-dagen-murchison-falls',
    _type: 'trip',
    title: '3 Dagen Murchison Falls',
    slug: { _type: 'slug', current: '3-dagen-murchison-falls' },
    excerpt:
      'Korte maar krachtige safari naar Oeganda\'s grootste park: gamedrive\'s, Nijl-bootcruise en de machtige watervallen.',
    duration: '3 dagen / 2 nachten',
    daysCount: 3,
    price: 500,
    priceType: 'per_person',
    difficulty: 'easy',
    minPersons: 4,
    maxPersons: 32,
    category: 'wildlife',
    featured: false,
    active: true,
    language: 'nl',
    destination: { _type: 'reference', _ref: 'destination-murchison' },
    highlights: [
      'Murchison Falls — krachtigste waterval van Afrika',
      'Nijl-bootcruise met nijlpaarden en krokodillen',
      'Gamedrive\'s in het grootste park van Oeganda',
      'Neushoornwandeling bij Ziwa Rhino Sanctuary',
      'Wandeling naar de top van de watervallen',
    ],
    included: [
      'Luchthaven transfers',
      '4x4 safariwagen met Engelstalige gids',
      '2 nachten accommodatie',
      'Alle maaltijden (volpension)',
      'Parkentreegelden',
      'Neushoornwandeling bij Ziwa',
      'Gamedrive\'s',
      'Nijl-bootcruise',
      'Drinkwater tijdens safari',
    ],
    excluded: [
      'Internationale vluchten',
      'Visum voor Oeganda',
      'Reisverzekering',
      'Alcoholische dranken',
      'Persoonlijke uitgaven',
      'Fooien',
    ],
    itinerary: [
      iDay(1, 'Kampala naar Murchison via Ziwa', 'Vertrek vanuit Kampala. Tussenstop bij Ziwa Rhino Sanctuary voor een wandeling tussen de witte neushoorns. Doorrit naar Murchison Falls NP. Middaggamedrive.', 'Murchison Falls NP', ['lunch', 'dinner']),
      iDay(2, 'Gamedrive & Nijl-bootcruise', 'Vroege ochtend-gamedrive: leeuwen, olifanten, giraffen en buffels. Middagbootcruise op de Nijl naar de voet van de watervallen. Wandeling naar de top.', 'Murchison Falls NP', ['breakfast', 'lunch', 'dinner']),
      iDay(3, 'Terugreis naar Entebbe', 'Optionele ochtendactiviteit. Daarna terugrit naar Kampala/Entebbe.', 'Entebbe', ['breakfast', 'lunch']),
    ],
  },
  {
    _id: 'trip-5-dagen-chimps-en-queen-elizabeth',
    _type: 'trip',
    title: '5 Dagen Chimpansees & Queen Elizabeth',
    slug: { _type: 'slug', current: '5-dagen-chimpansees-en-queen-elizabeth' },
    excerpt:
      'Combineer chimpansee-trekking in Kibale Forest met gamedrive\'s en een bootcruise in Queen Elizabeth Nationaal Park.',
    duration: '5 dagen / 4 nachten',
    daysCount: 5,
    price: 1300,
    priceType: 'per_person',
    difficulty: 'moderate',
    minPersons: 4,
    maxPersons: 32,
    category: 'wildlife',
    featured: false,
    active: true,
    language: 'nl',
    destination: { _type: 'reference', _ref: 'destination-queen-elizabeth' },
    highlights: [
      'Chimpansee-trekking in Kibale Forest',
      'Bigodi-moeras wandeling',
      'Queen Elizabeth Nationaal Park gamedrive',
      'Kazinga-kanaal bootcruise',
    ],
    included: [
      'Luchthaven transfers',
      '4x4 safariwagen met Engelstalige gids',
      '4 nachten accommodatie',
      'Alle maaltijden (volpension)',
      'Parkentreegelden',
      'Chimpansee-trekpermit',
      'Gamedrive\'s en bootcruise',
      'Drinkwater tijdens safari',
    ],
    excluded: [
      'Internationale vluchten',
      'Visum voor Oeganda',
      'Reisverzekering',
      'Alcoholische dranken',
      'Persoonlijke uitgaven',
      'Fooien',
    ],
    itinerary: [
      iDay(1, 'Reis naar Kibale Forest', 'Vertrek vanuit Kampala naar Kibale Forest Nationaal Park. Schilderachtige rit door het Oegandese platteland. Aankomst en check-in.', 'Kibale Forest', ['lunch', 'dinner']),
      iDay(2, 'Chimpansee-trekking & Bigodi', 'Ochtend chimpansee-trekking in Kibale — de thuisbasis van 13 primatensoorten. Middag wandeling door het Bigodi-moerasgebied.', 'Kibale Forest', ['breakfast', 'lunch', 'dinner']),
      iDay(3, 'Queen Elizabeth Nationaal Park', 'Reis naar Queen Elizabeth NP. Middaggamedrive door de Kasenyi-vlakten op zoek naar leeuwen, olifanten en buffels.', 'Queen Elizabeth NP', ['breakfast', 'lunch', 'dinner']),
      iDay(4, 'Gamedrive & Kazinga-kanaal', 'Ochtend-gamedrive. Middagbootcruise op het Kazinga-kanaal — een van de beste plekken voor nijlpaarden en vogels.', 'Queen Elizabeth NP', ['breakfast', 'lunch', 'dinner']),
      iDay(5, 'Terugreis', 'Terugrit naar Kampala/Entebbe voor uw vertrekvlucht.', 'Entebbe', ['breakfast', 'lunch']),
    ],
  },
  {
    _id: 'trip-6-dagen-luxe-tour',
    _type: 'trip',
    title: '6 Dagen Luxe Safari Tour',
    slug: { _type: 'slug', current: '6-dagen-luxe-safari-tour' },
    excerpt:
      'Luxe gorilla-trekking en meren-safari: Lake Bunyonyi, Bwindi, Lake Mutanda en Lake Mburo in premium comfort.',
    duration: '6 dagen / 5 nachten',
    daysCount: 6,
    price: 2160,
    priceType: 'per_person',
    difficulty: 'moderate',
    minPersons: 4,
    maxPersons: 32,
    category: 'wildlife',
    featured: false,
    active: true,
    language: 'nl',
    destination: { _type: 'reference', _ref: 'destination-bwindi' },
    highlights: [
      'Luxe accommodaties',
      'Kanotocht op Lake Bunyonyi',
      'Gorilla-trekking in Bwindi',
      'Lake Mutanda met vulkaanuitzicht',
      'Lake Mburo Nationaal Park',
    ],
    included: [
      'Luchthaven transfers',
      '4x4 safariwagen met Engelstalige gids',
      '5 nachten luxe accommodatie',
      'Alle maaltijden (volpension)',
      'Parkentreegelden',
      'Gorilla-trekpermit',
      'Kanotocht',
      'Gamedrive\'s',
      'Drinkwater',
    ],
    excluded: [
      'Internationale vluchten',
      'Visum voor Oeganda',
      'Reisverzekering',
      'Alcoholische dranken',
      'Persoonlijke uitgaven',
      'Fooien',
    ],
    itinerary: [
      iDay(1, 'Reis naar Lake Bunyonyi', 'Vertrek vanuit Kampala naar het prachtige Lake Bunyonyi. Check-in bij luxe lodge met uitzicht over het meer.', 'Lake Bunyonyi', ['lunch', 'dinner']),
      iDay(2, 'Kanotocht Lake Bunyonyi', 'Ontspannen dag op Lake Bunyonyi. Kanotocht langs de 29 eilanden. Geniet van de rust en het schitterende berglandschap.', 'Lake Bunyonyi', ['breakfast', 'lunch', 'dinner']),
      iDay(3, 'Reis naar Bwindi', 'Korte rit naar Bwindi Impenetrable Forest. Aankomst bij de luxe lodge en briefing voor de gorilla-trekking.', 'Bwindi', ['breakfast', 'lunch', 'dinner']),
      iDay(4, 'Gorilla-trekking & Lake Mutanda', 'Ochtend gorilla-trekking. Na terugkomst, bezoek aan het serene Lake Mutanda met adembenemend uitzicht op de Virunga-vulkanen.', 'Lake Mutanda', ['breakfast', 'lunch', 'dinner']),
      iDay(5, 'Lake Mburo Nationaal Park', 'Reis naar Lake Mburo NP. Middaggamedrive op zoek naar zebra\'s, giraffen en impala\'s. Luxe lodge aan het meer.', 'Lake Mburo NP', ['breakfast', 'lunch', 'dinner']),
      iDay(6, 'Terugreis naar Entebbe', 'Ochtendwandelsafari of bootcruise. Terugrit naar Entebbe voor uw vertrek.', 'Entebbe', ['breakfast', 'lunch']),
    ],
  },
  {
    _id: 'trip-12-dagen-noordoost-oeganda',
    _type: 'trip',
    title: '12 Dagen Noordoost-Oeganda',
    slug: { _type: 'slug', current: '12-dagen-noordoost-oeganda' },
    excerpt:
      'Van Murchison Falls tot Kidepo Valley, Sipi Falls en Nijl-rafting in Jinja. Het beste van noordoost-Oeganda.',
    duration: '12 dagen / 11 nachten',
    daysCount: 12,
    price: 3350,
    priceType: 'per_person',
    difficulty: 'challenging',
    minPersons: 4,
    maxPersons: 32,
    category: 'combined',
    featured: false,
    active: true,
    language: 'nl',
    destination: { _type: 'reference', _ref: 'destination-kidepo' },
    highlights: [
      'Neushoornwandeling bij Ziwa',
      'Murchison Falls gamedrive & bootcruise',
      'Kidepo Valley gamedrive\'s',
      'Karamojong culturele ervaring',
      'Mountainbiken in Moroto',
      'Sipi Falls wandelingen & koffieproeverij',
      'Nijl-rafting in Jinja',
      'Mabira-regenwoud zip-lining',
    ],
    included: [
      'Luchthaven transfers',
      '4x4 safariwagen met Engelstalige gids',
      '11 nachten accommodatie',
      'Alle maaltijden (volpension)',
      'Parkentreegelden',
      'Alle genoemde activiteiten',
      'Drinkwater tijdens safari',
    ],
    excluded: [
      'Internationale vluchten',
      'Visum voor Oeganda',
      'Reisverzekering',
      'Accommodatie-upgrades',
      'Alcoholische dranken',
      'Persoonlijke uitgaven',
      'Fooien voor gidsen en personeel',
    ],
    itinerary: [
      iDay(1, 'Ziwa Rhino\'s & Murchison Falls', 'Vertrek vanuit Kampala. Neushoornwandeling bij Ziwa Rhino Sanctuary. Doorrit naar Murchison Falls NP.', 'Murchison Falls NP', ['lunch', 'dinner']),
      iDay(2, 'Gamedrive & bootcruise', 'Ochtend-gamedrive. Middagbootcruise op de Nijl naar de watervallen met nijlpaarden en krokodillen.', 'Murchison Falls NP', ['breakfast', 'lunch', 'dinner']),
      iDay(3, 'Reis naar Kidepo Valley', 'Lange maar schilderachtige rit naar het afgelegen Kidepo Valley Nationaal Park in het noordoosten.', 'Kidepo Valley NP', ['breakfast', 'lunch', 'dinner']),
      iDay(4, 'Kidepo gamedrive\'s', 'Hele dag gamedrive\'s door de Narus- en Kidepo-valleien. Zoek naar leeuwen, cheetah\'s, olifanten en buffels.', 'Kidepo Valley NP', ['breakfast', 'lunch', 'dinner']),
      iDay(5, 'Moroto & Karamoja cultuur', 'Reis naar Moroto. Middagbezoek aan een Karamojong-dorp voor culturele uitwisseling met deze fascinerende stam.', 'Moroto', ['breakfast', 'lunch', 'dinner']),
      iDay(6, 'Mountainbiken', 'Ochtend mountainbiken door het spectaculaire Karamojong-landschap. Middag vrij voor ontspanning.', 'Moroto', ['breakfast', 'lunch', 'dinner']),
      iDay(7, 'Reis naar Sipi Falls', 'Reis naar de Sipi Falls aan Mount Elgon. Aankomst en eerste verkenning.', 'Sipi Falls', ['breakfast', 'lunch', 'dinner']),
      iDay(8, 'Sipi wandeling & koffie', 'Wandeling langs de watervallen van Sipi. Middag koffieproeverij bij lokale boeren — van boom tot kopje.', 'Sipi Falls', ['breakfast', 'lunch', 'dinner']),
      iDay(9, 'Reis naar Jinja', 'Reis naar Jinja, de avontuurlijke hoofdstad aan de bron van de Nijl.', 'Jinja', ['breakfast', 'lunch', 'dinner']),
      iDay(10, 'Nijl-rafting', 'Hele dag wildwaterrafting op de Nijl. Klasse III tot V stroomversnellingen voor een onvergetelijk avontuur.', 'Jinja', ['breakfast', 'lunch', 'dinner']),
      iDay(11, 'Mabira zip-lining', 'Ochtend zip-lining door het Mabira-regenwoud. Middag vrij in Jinja.', 'Jinja', ['breakfast', 'lunch', 'dinner']),
      iDay(12, 'Terugreis naar Entebbe', 'Korte rit terug naar Entebbe voor uw vertrekvlucht.', 'Entebbe', ['breakfast', 'lunch']),
    ],
  },
]

// ───────────────────────────────────────────────────────
// Execute mutations
// ───────────────────────────────────────────────────────

async function mutate(mutations: Record<string, unknown>[]) {
  const res = await fetch(MUTATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  })
  const json = await res.json()
  if (!res.ok) {
    console.error('Mutation failed:', JSON.stringify(json, null, 2))
    process.exit(1)
  }
  return json
}

async function main() {
  console.log('=== Sanity Seed Script ===\n')

  // 1. Delete existing trip and destination documents
  console.log('Deleting existing trip documents...')
  await mutate([{ delete: { query: '*[_type == "trip"]' } }])
  console.log('Deleting existing destination documents...')
  await mutate([{ delete: { query: '*[_type == "destination"]' } }])

  // 2. Create destinations first (trips reference them)
  console.log(`\nCreating ${destinations.length} destinations...`)
  const destMutations = destinations.map((doc) => ({
    createOrReplace: doc,
  }))
  await mutate(destMutations)
  console.log('Destinations created.')

  // 3. Create trips
  console.log(`\nCreating ${trips.length} trips...`)
  const tripMutations = trips.map((doc) => ({
    createOrReplace: doc,
  }))
  await mutate(tripMutations)
  console.log('Trips created.')

  console.log('\n=== Done! All documents seeded. ===')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
