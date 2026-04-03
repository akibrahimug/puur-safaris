import type { BlogPostCard, BlogPostDetail } from '@/lib/types'

const img = (id: string, alt: string) => ({
  asset: {
    _id: id,
    url: `https://images.unsplash.com/${id}?w=1200&q=80`,
    metadata: { dimensions: { width: 1200, height: 800, aspectRatio: 1.5 }, lqip: '' },
  },
  alt,
})

export const blogPosts: BlogPostCard[] = [
  {
    _id: 'post-grote-trek',
    title: 'De Grote Trek: Alles wat je moet weten',
    slug: 'de-grote-trek-alles-wat-je-moet-weten',
    author: 'Puur Safaris Team',
    publishedAt: '2024-07-15',
    category: 'wildlife',
    summary:
      'De jaarlijkse Grote Trek is een van de meest spectaculaire natuurfenomenen op aarde. Meer dan 1,5 miljoen gnoes, 200.000 zebra\'s en 500.000 gazellen trekken van de Serengeti naar de Maasai Mara.',
    featuredImage: img('photo-1516426122078-c23e76319801', 'Gnoes tijdens de Grote Trek'),
  },
  {
    _id: 'post-gorilla-trekking',
    title: 'Gorilla Trekking in Rwanda: Een Onvergetelijke Ervaring',
    slug: 'gorilla-trekking-rwanda-onvergetelijke-ervaring',
    author: 'Sarah de Boer',
    publishedAt: '2024-06-20',
    category: 'stories',
    summary:
      'Oog in oog staan met een berggorilla is een van de meest intieme en indringende ervaringen die Afrika te bieden heeft. In dit artikel deelt onze reiziger haar persoonlijke verhaal.',
    featuredImage: img('photo-1516026672322-bc52d61a55d5', 'Berggorilla in Rwanda'),
  },
  {
    _id: 'post-beste-tijd-kenya',
    title: 'Wanneer is de beste tijd om naar Kenya te gaan?',
    slug: 'beste-tijd-kenya',
    author: 'Puur Safaris Team',
    publishedAt: '2024-05-10',
    category: 'guides',
    summary:
      'Kenya heeft twee droge seizoenen en twee regenseizoenen. Wij leggen uit welke tijd het beste past bij jouw wensen, budget en welke wildlife je wilt zien.',
    featuredImage: img('photo-1547471080-7cc2caa01a7e', 'Savanne in Kenya bij zonsondergang'),
  },
  {
    _id: 'post-okavango',
    title: 'Het Okavango Delta: Een Oase in de Kalahari',
    slug: 'okavango-delta-oase-kalahari',
    author: 'Mark van Dijk',
    publishedAt: '2024-04-05',
    category: 'wildlife',
    summary:
      'Het Okavango Delta in Botswana is een van de weinige grote inland deltas ter wereld. Elk jaar stroomt het rivierwater de droge Kalahari woestijn in en schept een tijdelijke oase vol leven.',
    featuredImage: img('photo-1535941339077-2dd1c7963098', 'Okavango Delta vanuit de lucht'),
  },
  {
    _id: 'post-safari-packing',
    title: 'Wat moet je inpakken voor een safari?',
    slug: 'wat-inpakken-voor-safari',
    author: 'Puur Safaris Team',
    publishedAt: '2024-03-18',
    category: 'tips',
    summary:
      'Een goede voorbereiding is het halve werk. In onze uitgebreide packinglist vind je alles wat je nodig hebt voor een comfortabele en succesvolle safari reis.',
    featuredImage: img('photo-1528543606781-2f6e6857f318', 'Safari bagage en uitrusting'),
  },
  {
    _id: 'post-kilimanjaro',
    title: 'Beklimming van de Kilimanjaro: Tips en Ervaring',
    slug: 'kilimanjaro-beklimming-tips-ervaring',
    author: 'Tom Bergman',
    publishedAt: '2024-02-28',
    category: 'stories',
    summary:
      'De Kilimanjaro beklimmen is een droom voor veel reizigers. In dit artikel vertelt Tom over zijn tocht via de Lemosho route naar de hoogste top van Afrika.',
    featuredImage: img('photo-1551632811-561732d1e306', 'Kilimanjaro bij zonsopgang'),
  },
]

const text = (key: string, content: string) => ({
  _type: 'block' as const,
  _key: key,
  style: 'normal' as const,
  children: [{ _type: 'span' as const, _key: `${key}s`, text: content }],
  markDefs: [],
})

const heading = (key: string, content: string) => ({
  _type: 'block' as const,
  _key: key,
  style: 'h2' as const,
  children: [{ _type: 'span' as const, _key: `${key}s`, text: content }],
  markDefs: [],
})

const image = (key: string, id: string, alt: string, caption?: string) => ({
  _type: 'image' as const,
  _key: key,
  asset: {
    _id: id,
    url: `https://images.unsplash.com/${id}?w=1200&q=80`,
  },
  alt,
  caption,
})

const imageGrid = (key: string, items: Array<{ id: string, alt: string }>, caption?: string) => ({
  _type: 'imageGrid' as const,
  _key: key,
  images: items.map((item, idx) => ({
    _key: `${key}-${idx}`,
    asset: { _id: item.id, url: `https://images.unsplash.com/${item.id}?w=800&q=80` },
    alt: item.alt,
  })),
  caption,
})

export const blogPostDetails: Record<string, BlogPostDetail> = {
  'de-grote-trek-alles-wat-je-moet-weten': {
    ...blogPosts[0],
    content: [
      text('p1', 'De Grote Trek is het grootste landdier migratiespektakel op aarde. Elk jaar trekken meer dan 1,5 miljoen gnoes, samen met honderdduizenden zebra\'s en gazellen, in een grote cirkel door de Serengeti in Tanzania en de Maasai Mara in Kenya.'),
      image('img1', 'photo-1516426122078-c23e76319801', 'Gnoes tijdens de grote trek crossen een rivier', 'De pure chaos en oerkracht van tienduizenden gnoes die zich in de kolkende Mara rivier storten.'),
      heading('h1', 'Wanneer vindt de Grote Trek plaats?'),
      text('p2', 'De Trek is een cyclisch fenomeen dat het hele jaar door plaatsvindt. De meest spectaculaire momenten zijn de rivieroversteken van de Mara rivier, die plaatsvinden van juli tot oktober. Dit is het moment waarop gnoes letterlijk kopje-onder gaan terwijl krokodillen wachten.'),
      imageGrid('imgGrid1', [
        { id: 'photo-1549366021-9f1d07c3be09', alt: 'Savanne' },
        { id: 'photo-1504173010664-32509ceebb18', alt: 'Leeuwen in de bush' }
      ], 'De uitgestrekte vlaktes zorgen voor ongeëvenaarde fotomomenten en contrasten.'),
      heading('h2', 'Maasai Mara vs. Serengeti'),
      text('p3', 'Hoewel de trek de grens tussen Kenya en Tanzania overschrijdt, zijn er significante verschillen. De Serengeti is groter en je ziet hier de kalvertijd (februari) en de trek naar het noorden. In de Maasai Mara zie je de dramatische rivieroversteken.'),
      heading('h3', 'Praktische tips'),
      text('p4', 'Boek vroeg: de populairste kampen tijdens de Trek zijn vaak een jaar van tevoren volgeboekt. Kies voor een kamp aan de rivier voor de beste kansen op een rivieroverstek. Een 4x4 voertuig met pop-up dak biedt de beste fotomogelijkheden.'),
    ],
    relatedTrips: [],
  },
  'gorilla-trekking-rwanda-onvergetelijke-ervaring': {
    ...blogPosts[1],
    content: [
      text('p1', 'Het was vroeg in de ochtend toen we het Volcanoes National Park in betraden. De mist hing nog laag over de heuvels terwijl onze ranger ons de richting wees van de Susa groep — een van de grootste gorilla families in Rwanda.'),
      image('img1', 'photo-1516026672322-bc52d61a55d5', 'Gorilla in het oerwoud', 'Oog in oog staan met deze majestueuze wezens was een nederig, emotioneel moment dat alles in perspectief plaatste.'),
      heading('h1', 'De trekking'),
      text('p2', 'Na twee uur lopen door dicht bamboe bos, plotseling een geluid vlak naast het pad. Onze gids legde zijn hand op mijn arm en wees. Daar, op slechts drie meter afstand, zat een jonge gorilla rustig bladeren te eten. Mijn hart stond stil.'),
      heading('h2', 'Het uur met de gorilla\'s'),
      text('p3', 'Je hebt precies één uur in de aanwezigheid van de gorilla\'s. Het leek zowel een eeuwigheid als een seconde. De silverback lag lui op zijn rug terwijl de jongen over hem heen klauterden. Geen enkele dierentuin, geen enkele documentaire kan dit voorbereiden.'),
      imageGrid('imgGrid2', [
        { id: 'photo-1493246507139-91e8fad9978e', alt: 'Dicht oerwoud' },
        { id: 'photo-1600029801831-29eb510cb101', alt: 'Wandelaars in de wildernis' }
      ], 'Het ruige landschap van Volcanoes National Park is puur, donker en adembenemend.'),
      heading('h3', 'Praktische informatie'),
      text('p4', 'Een gorilla trekking permit kost $1500 per persoon. Dit draagt direct bij aan de bescherming van de gorilla\'s en de lokale gemeenschap. De trekking duurt 2-8 uur afhankelijk van waar de gorilla\'s zich bevinden. Goede conditie is een vereiste.'),
    ],
    relatedTrips: [],
  },
  'beste-tijd-kenya': {
    ...blogPosts[2],
    content: [
      text('p1', 'Kenya heeft een gevarieerd klimaat dat sterk afhankelijk is van de regio. De hoogte, nabijheid van de oceaan en seizoenen bepalen allemaal wanneer het beste moment is voor jouw specifieke interesses.'),
      heading('h1', 'De droge seizoenen: ideaal voor safari'),
      text('p2', 'Het lange droge seizoen loopt van juni tot oktober en is de populairste tijd voor safari. De vegetatie is dun, waardoor wildlife makkelijker te spotten is. Dit is ook de tijd van de Grote Trek in de Maasai Mara.'),
      imageGrid('imgGrid1', [
        { id: 'photo-1547471080-7cc2caa01a7e', alt: 'Savanne in Kenya' },
        { id: 'photo-1516426122078-c23e76319801', alt: 'Gnoes op de vlakte' },
        { id: 'photo-1521651201144-634f700b36ef', alt: 'Olifanten en baobabs' }
      ], 'Kenya in zijn volle, ongefilterde droge glorie levert de meest iconische safari beelden op.'),
      text('p3', 'Het korte droge seizoen (januari-februari) is uitstekend voor baby dieren, met name in Amboseli en de Maasai Mara. Minder toeristen en goedkopere prijzen zijn extra voordelen.'),
      heading('h2', 'De regenseizoenen: voor de avonturiers'),
      text('p4', 'Tijdens het lange regenseizoen (maart-mei) is Kenya op zijn groenst. Vogel liefhebbers zijn dol op deze periode — migrerende vogels zijn overal aanwezig. Prijzen zijn laag en kampen bijna leeg. De wegen kunnen modderig zijn, maar dat hoort bij het avontuur.'),
      heading('h3', 'Onze aanbeveling'),
      text('p5', 'Voor de Grote Trek: juli-oktober. Voor een rustige maar geweldige safari: januari-februari. Voor vogelspotten en groene fotografie: april-mei. Voor Mount Kenya beklimming: januari-februari of augustus-september.'),
    ],
    relatedTrips: [],
  },
  'okavango-delta-oase-kalahari': {
    ...blogPosts[3],
    content: [
      text('p1', 'Vanuit de lucht ziet het Okavango Delta eruit als een groene hand die zich uitspreidt over het bruine tapijt van de Kalahari. Het is een van de meest bijzondere geografische fenomenen op aarde.'),
      image('img1', 'photo-1535941339077-2dd1c7963098', 'Okavango Delta van boven', 'De eindeloze rivieren storten zich rechtstreeks in de droge woestijn zand gronden van de Kalahari.'),
      heading('h1', 'Hoe het delta werkt'),
      text('p2', 'Het water van de Okavango rivier komt uit de Angolese hooglanden en bereikt het delta in Botswana na een reis van meer dan 1.000 kilometer. Hier spreidt het water zich uit over een gebied ter grootte van Nederland voordat het langzaam verdampt.'),
      heading('h2', 'Wildlife in het delta'),
      text('p3', 'Het Okavango herbergt een indrukwekkende diversiteit. Olifanten zwemmen door de kanalen, nijlpaarden liggen lui in het water, en luipaarden verstoppen zich in de vijgenbomen. Dit is ook een van de beste plaatsen in Afrika om wilde honden te zien.'),
      imageGrid('imgGrid2', [
        { id: 'photo-1504173010664-32509ceebb18', alt: 'Leeuwen troep in Okavango' },
        { id: 'photo-1521651201144-634f700b36ef', alt: 'Olifant in weelderig water' }
      ], 'De perfecte synergie tussen eindeloze zandvlaktes en weelderige rivieren trekt enorm veel wild aan.'),
      heading('h3', 'Hoe te bezoeken'),
      text('p4', 'Het delta is alleen per bootje, mokoro (dugout kano) of vliegtuig bereikbaar. De meeste lodges zijn exclusief en prijzig — maar de ervaring is onvergelijkbaar. Kies voor een combinatie van fly-in lodge en mokoro safari voor het complete delta gevoel.'),
    ],
    relatedTrips: [],
  },
  'wat-inpakken-voor-safari': {
    ...blogPosts[4],
    content: [
      text('p1', 'De juiste uitrusting kan het verschil maken tussen een prettige en een minder comfortabele safari. Hieronder vind je onze complete packinglist, gebaseerd op tientallen jaren safari ervaring.'),
      imageGrid('imgGrid1', [
        { id: 'photo-1528543606781-2f6e6857f318', alt: 'Safari uitrusting koffers' },
        { id: 'photo-1534142499878-f3b1add7b5d1', alt: 'Camera op een safari trip' },
        { id: 'photo-1600029801831-29eb510cb101', alt: 'Man op de rotsen' }
      ], 'Zorg dat je alleen de essentie pakt. De hitte, regenval, en zware ritten eisen praktische keuzes.'),
      heading('h1', 'Kleding'),
      text('p2', 'Neutrale kleuren (kaki, olijfgroen, beige) zijn essentieel — felle kleuren schrikken wildlife af. Laagjes zijn het sleutelwoord: ochtenden in de bush kunnen fris zijn terwijl middagen heet zijn. Neem altijd een lichte regenjas mee, ook in het droge seizoen.'),
      heading('h2', 'Elektronica'),
      text('p3', 'Een goede camera met een zoom lens (minimaal 300mm) is een aanrader. Vergeet extra batterijen en geheugenkaarten niet — je mist geen enkel moment. Een universele adapter is nodig voor de meeste safari lodges.'),
      heading('h3', 'Gezondheid en hygiëne'),
      text('p4', 'Zonnebrandcrème met hoge SPF, insectenwerend middel met DEET, en malariaprofylaxe zijn onmisbaar. Neem ook een reisapotheek mee met pijnstillers, diarreemedicatie en wondontsmettingsmiddel. Raadpleeg je huisarts 6-8 weken voor vertrek voor alle benodigde vaccinaties.'),
    ],
    relatedTrips: [],
  },
  'kilimanjaro-beklimming-tips-ervaring': {
    ...blogPosts[5],
    content: [
      text('p1', 'Op 5.895 meter is de Kilimanjaro de hoogste vrij staande berg ter wereld en het hoogste punt van Afrika. Anders dan de Rocky Mountains of de Alpen vereist de Kili geen technische klimervaring — maar onderschat hem niet.'),
      heading('h1', 'Mijn route: Lemosho'),
      text('p2', 'Na veel onderzoek koos ik voor de Lemosho route — de langste en daarmee de route met de beste acclimatisatiemogelijkheden. 8 dagen totaal, met een succespercentage van meer dan 90%. De extra kosten zijn het zeker waard.'),
      imageGrid('imgGrid1', [
        { id: 'photo-1551632811-561732d1e306', alt: 'Uitzicht over de Kilimanjaro top' },
        { id: 'photo-1600029801831-29eb510cb101', alt: 'Wandelaar kijkt over de vallei in the wild' }
      ], 'De uitzichten transformeren volledig van weelderig groen beneden tot grimmig vriesweer op 5800m.'),
      heading('h2', 'De nacht naar de top'),
      text('p3', 'Middernacht beginnen we de beklimming naar Uhuru Peak. Het is -15 graden en de wind is genadeloos. Stap voor stap, "pole pole" (langzaam langzaam in Swahili), klimmen we omhoog. Bij zonsopgang bereikten we de top. De tranen bevroren op mijn wangen.'),
      heading('h3', 'Tips voor jouw beklimming'),
      text('p4', 'Kies altijd een langere route (Lemosho of Machame) voor betere acclimatisatie. Investeer in goede bergschoenen en een warm slaapzak. Huur zoveel mogelijk uitrusting ter plaatse om gewicht te besparen. En het allerbelangrijkste: luister naar je gids en ga terug als je twijfelt.'),
    ],
    relatedTrips: [],
  },
}
