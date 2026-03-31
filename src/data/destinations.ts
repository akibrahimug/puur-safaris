import type { DestinationCard, DestinationDetail } from '@/lib/types'

// Placeholder image helper — uses Unsplash source images
const img = (id: string, alt: string) => ({
  asset: {
    _id: id,
    url: `https://images.unsplash.com/${id}?w=1200&q=80`,
    metadata: { dimensions: { width: 1200, height: 800, aspectRatio: 1.5 }, lqip: '' },
  },
  alt,
})

export const destinations: DestinationCard[] = [
  {
    _id: 'dest-kenya',
    name: 'Kenya',
    slug: 'kenya',
    country: 'Kenya',
    continent: 'Africa',
    excerpt:
      'Het land van de Grote Trek. Kenya biedt spectaculaire wildlife en adembenemende landschappen van de savanne tot de kust.',
    heroImage: img('photo-1547471080-7cc2caa01a7e', 'Olifanten in de Maasai Mara, Kenya'),
    tripCount: 4,
  },
  {
    _id: 'dest-tanzania',
    name: 'Tanzania',
    slug: 'tanzania',
    country: 'Tanzania',
    continent: 'Africa',
    excerpt:
      'Thuisbasis van de Serengeti en de Ngorongoro Krater. Tanzania is het paradijs voor wildlife liefhebbers.',
    heroImage: img('photo-1516426122078-c23e76319801', 'Leeuwen in de Serengeti, Tanzania'),
    tripCount: 3,
  },
  {
    _id: 'dest-botswana',
    name: 'Botswana',
    slug: 'botswana',
    country: 'Botswana',
    continent: 'Africa',
    excerpt:
      'Ongerepte wildernis en luxe safaris. Het Okavango Delta is een van de meest unieke ecosystemen ter wereld.',
    heroImage: img('photo-1535941339077-2dd1c7963098', 'Okavango Delta, Botswana'),
    tripCount: 2,
  },
  {
    _id: 'dest-south-africa',
    name: 'Zuid-Afrika',
    slug: 'zuid-afrika',
    country: 'Zuid-Afrika',
    continent: 'Africa',
    excerpt:
      'Van Kruger Park tot de Kaapse Wijnlanden. Zuid-Afrika combineert geweldige wildlife met spectaculaire natuur.',
    heroImage: img('photo-1583422409516-2895a77efded', 'Kruger National Park, Zuid-Afrika'),
    tripCount: 2,
  },
  {
    _id: 'dest-rwanda',
    name: 'Rwanda',
    slug: 'rwanda',
    country: 'Rwanda',
    continent: 'Africa',
    excerpt:
      'Het land van de duizend heuvels en de zeldzame berggorilla\'s. Een onvergetelijke en intieme wilderniservaring.',
    heroImage: img('photo-1516026672322-bc52d61a55d5', 'Berggorilla in Rwanda'),
    tripCount: 1,
  },
  {
    _id: 'dest-zambia',
    name: 'Zambia',
    slug: 'zambia',
    country: 'Zambia',
    continent: 'Africa',
    excerpt:
      'Het thuisland van walking safaris en de machtige Victoria Falls. Zambia is Afrika op zijn meest authentiek.',
    heroImage: img('photo-1528543606781-2f6e6857f318', 'Victoria Falls, Zambia'),
    tripCount: 1,
  },
]

export const destinationDetails: Record<string, DestinationDetail> = {
  kenya: {
    ...destinations[0],
    climate: 'Tropisch klimaat met twee regenseizoenen (april–mei en november). Temperaturen van 20–30°C.',
    bestTimeToVisit: 'Juli t/m oktober (droge seizoen, Grote Trek)',
    description: [
      {
        _type: 'block',
        _key: 'k1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: 'Kenya is een van de meest iconische safari bestemmingen ter wereld. De Maasai Mara is wereldberoemd om de jaarlijkse Grote Trek, waarbij miljoenen gnoes en zebra\'s de Mara rivier oversteken. Maar Kenya heeft veel meer te bieden.',
          },
        ],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'k2',
        style: 'h2',
        children: [{ _type: 'span', _key: 's2', text: 'Nationale parken & reservaten' }],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'k3',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's3',
            text: 'Naast de Maasai Mara zijn Amboseli (met uitzicht op de Kilimanjaro), Tsavo en Lake Nakuru must-see bestemmingen. Elk park heeft zijn eigen karakter en wildlife.',
          },
        ],
        markDefs: [],
      },
    ],
    relatedTrips: [],
  },
  tanzania: {
    ...destinations[1],
    climate: 'Droog seizoen juni–oktober, kort regenseizoen november–december, lang regenseizoen maart–mei.',
    bestTimeToVisit: 'Juni t/m oktober (droge seizoen)',
    description: [
      {
        _type: 'block',
        _key: 't1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: 'Tanzania herbergt enkele van de grootste en meest spectaculaire nationale parken van Afrika. De Serengeti is het toneel van de grootste diermigratie op aarde, terwijl de Ngorongoro Krater een uniek ecosysteem vormt.',
          },
        ],
        markDefs: [],
      },
    ],
    relatedTrips: [],
  },
  botswana: {
    ...destinations[2],
    climate: 'Semi-aride klimaat. Droog seizoen mei–oktober is het beste voor safari.',
    bestTimeToVisit: 'Mei t/m oktober (droge seizoen)',
    description: [
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: 'Botswana staat bekend om haar ongerepte wildernis en exclusieve safari ervaringen. Het Okavango Delta, een binnenzee in de Kalahari woestijn, is een UNESCO Werelderfgoed en herbergt een indrukwekkende diversiteit aan flora en fauna.',
          },
        ],
        markDefs: [],
      },
    ],
    relatedTrips: [],
  },
  'zuid-afrika': {
    ...destinations[3],
    climate: 'Gematigd klimaat. Droog en zonnig in de winter (mei–sept), warm en regenachtig in de zomer.',
    bestTimeToVisit: 'Mei t/m september (droge seizoen voor Kruger)',
    description: [
      {
        _type: 'block',
        _key: 'za1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: 'Zuid-Afrika is een land van ongelooflijke contrasten. Van de wildlife van Kruger National Park tot de schilderachtige kustlijn van de Garden Route en de wereldberoemde wijngaarden van Stellenbosch.',
          },
        ],
        markDefs: [],
      },
    ],
    relatedTrips: [],
  },
  rwanda: {
    ...destinations[4],
    climate: 'Tropisch hooglanden klimaat, aangenaam koel. Twee droge seizoenen: juni–sept en jan–feb.',
    bestTimeToVisit: 'Juni t/m september of december t/m februari',
    description: [
      {
        _type: 'block',
        _key: 'rw1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: 'Rwanda, het "Land van Duizend Heuvels", is thuisbasis van de zeldzame berggorilla. Een gorilla trekking in het Volcanoes National Park is een van de meest indringende en intieme wildernis ervaringen die Afrika te bieden heeft.',
          },
        ],
        markDefs: [],
      },
    ],
    relatedTrips: [],
  },
  zambia: {
    ...destinations[5],
    climate: 'Droog seizoen mei–oktober, warm en vochtig regenseizoen november–april.',
    bestTimeToVisit: 'Mei t/m oktober (droge seizoen)',
    description: [
      {
        _type: 'block',
        _key: 'zm1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: 'Zambia is de geboorteplaats van de walking safari. Er is geen betere manier om de Afrikaanse bush te ervaren dan te voet, begeleid door een ervaren local guide. Het South Luangwa National Park is het epicentrum van de walking safari.',
          },
        ],
        markDefs: [],
      },
    ],
    relatedTrips: [],
  },
}
