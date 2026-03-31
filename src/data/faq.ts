import type { FaqItem } from '@/lib/types'

const answer = (key: string, text: string): unknown[] => [
  {
    _type: 'block',
    _key: key,
    style: 'normal',
    children: [{ _type: 'span', _key: `${key}s`, text }],
    markDefs: [],
  },
]

export const faqItems: FaqItem[] = [
  // General
  {
    _id: 'faq-1',
    question: 'Wat maakt Puur Safaris anders dan andere reisorganisaties?',
    category: 'general',
    answer: answer('a1', 'Puur Safaris organiseert uitsluitend kleinschalige safari reizen op maat. We werken met lokale gidsen die de gebieden door en door kennen, en we zorgen voor persoonlijke begeleiding van begin tot eind. Elke reis is uniek en afgestemd op uw wensen, budget en reisgezelschap.'),
  },
  {
    _id: 'faq-2',
    question: 'Hoe groot zijn de groepen bij jullie safari reizen?',
    category: 'general',
    answer: answer('a2', 'Onze safari reizen worden uitgevoerd met maximaal 8 deelnemers per groep. Kleine groepen zorgen voor een persoonlijkere ervaring, minder verstoring van de natuur en meer flexibiliteit in het reisschema. Privéreizen voor 1-3 personen zijn ook mogelijk.'),
  },
  {
    _id: 'faq-3',
    question: 'Zijn jullie safari reizen geschikt voor kinderen?',
    category: 'general',
    answer: answer('a3', 'Veel van onze safari reizen zijn uitstekend geschikt voor kinderen van 8 jaar en ouder. Sommige lodges hebben speciale kinderprogramma\'s. Avontuurlijke trektochten zoals de Kilimanjaro zijn alleen geschikt voor jongeren vanaf 16 jaar. Bij twijfel kunt u altijd contact met ons opnemen.'),
  },

  // Booking
  {
    _id: 'faq-4',
    question: 'Hoe ver van tevoren moet ik boeken?',
    category: 'booking',
    answer: answer('a4', 'Voor populaire bestemmingen en periodes (Grote Trek juli-oktober, Kerstmis, Oud & Nieuw) adviseren we minimaal 6-12 maanden van tevoren te boeken. Voor andere periodes is 3-6 maanden in het algemeen voldoende. Sommige lodges zijn al 12-18 maanden vantevoren volgeboekt.'),
  },
  {
    _id: 'faq-5',
    question: 'Welke betaalmethoden accepteren jullie?',
    category: 'booking',
    answer: answer('a5', 'We accepteren bankoverschrijving, iDEAL en creditcard (Visa, Mastercard). Bij boeking betaalt u een aanbetaling van 25%, het resterende bedrag is verschuldigd 8 weken voor vertrek. Alle bedragen zijn in euro\'s.'),
  },
  {
    _id: 'faq-6',
    question: 'Wat zijn de annuleringsvoorwaarden?',
    category: 'booking',
    answer: answer('a6', 'Bij annulering meer dan 90 dagen voor vertrek wordt 15% van de reissom in rekening gebracht. Bij annulering tussen 60-90 dagen is dit 35%, tussen 30-60 dagen 60%, en binnen 30 dagen voor vertrek 90-100%. We raden aan een annuleringsverzekering af te sluiten.'),
  },

  // Travel
  {
    _id: 'faq-7',
    question: 'Heb ik een visum nodig voor Kenya/Tanzania/Botswana?',
    category: 'travel',
    answer: answer('a7', 'Voor Nederlanders is een visum nodig voor de meeste Afrikaanse landen. Voor Kenya en Tanzania kunt u een e-visum aanvragen via de officiële overheidswebsites. Botswana heeft visumvrije toegang voor EU-burgers voor verblijf tot 90 dagen. We voorzien u van actuele visa-informatie bij boeking.'),
  },
  {
    _id: 'faq-8',
    question: 'Welke inentingen zijn verplicht of aanbevolen?',
    category: 'travel',
    answer: answer('a8', 'Een geldige gele koorts vaccinatie is verplicht voor toegang tot Rwanda en bij doorreis via bepaalde landen. Aanbevolen vaccinaties zijn: Hepatitis A & B, Tyfus, Tetanus en eventueel Rabies. Malariaprofylaxe is sterk aanbevolen voor de meeste safari bestemmingen. Raadpleeg uw huisarts 6-8 weken voor vertrek.'),
  },

  // Accommodation
  {
    _id: 'faq-9',
    question: 'In wat voor type accommodaties verblijf ik op safari?',
    category: 'accommodation',
    answer: answer('a9', 'Onze safari reizen maken gebruik van zorgvuldig geselecteerde lodges en tented camps. Van comfortabele standard lodges met alle faciliteiten tot exclusieve luxe tented camps waar u \'s avonds het geluid van de wildernis hoort. We bespreken uw voorkeuren en budget bij het samenstellen van uw reis.'),
  },
  {
    _id: 'faq-10',
    question: 'Zijn er vegetarische of speciale dieetopties beschikbaar?',
    category: 'accommodation',
    answer: answer('a10', 'Vrijwel alle safari lodges en camps kunnen vegetarisch, veganistisch, glutenvrij of andere dieetspecificaties accommoderen. Het is belangrijk dit vooraf door te geven zodat we het kunnen doorgeven aan de accommodaties. Ernstige allergieën moet u altijd persoonlijk met ons bespreken.'),
  },

  // Safety
  {
    _id: 'faq-11',
    question: 'Is een safari gevaarlijk?',
    category: 'safety',
    answer: answer('a11', 'Een georganiseerde safari is bij correct uitvoering zeer veilig. Onze gidsen zijn gecertificeerd en hebben jarenlange ervaring. U verlaat het voertuig alleen op aangewezen en veilige plaatsen. De grootste risico\'s op safari zijn geen wilde dieren, maar verkeersgerelateerde incidenten — ons chauffeurs zijn dan ook zorgvuldig geselecteerd.'),
  },
  {
    _id: 'faq-12',
    question: 'Welke reisverzekering heb ik nodig?',
    category: 'safety',
    answer: answer('a12', 'Een uitgebreide reisverzekering met medische dekking (inclusief medische evacuatie per helikopter) is verplicht voor deelname aan onze reizen. Zorg ook voor annuleringsverzekering en bagageverzekering. Informeer uw verzekeraar dat u een safari gaat maken. We adviseren CFAR (Cancel For Any Reason) dekking voor extra gemoedsrust.'),
  },

  // Packing
  {
    _id: 'faq-13',
    question: 'Wat moet ik inpakken voor een safari?',
    category: 'packing',
    answer: answer('a13', 'Essentieel zijn: neutrale kleding in kaki/beige/olijfgroen tinten, goede wandelschoenen, zonnebrandcrème (hoge SPF), insectenwerend middel met DEET, zonnebril en zonnehoed, lichte regenjas, verrekijker, en een goede camera met extra batterijen. Draag geen felle kleuren — dit schrikt wildlife af. Een uitgebreide packinglist sturen wij bij boeking toe.'),
  },
  {
    _id: 'faq-14',
    question: 'Hoeveel bagage mag ik meenemen op safari?',
    category: 'packing',
    answer: answer('a14', 'Bij vluchten in kleine vliegtuigen (bush flights) is het bagagelimiet vaak 15 kg in zachte koffers of rugzakken — harde koffers zijn zelden toegestaan. Op de internationale heenvlucht hanteert de luchtvaartmaatschappij eigen regels (doorgaans 20-23 kg). We raden het gebruik van een opvouwbare weekendtas of rugzak aan.'),
  },
]
