import type { Testimonial } from '@/lib/types'

export const testimonials: Testimonial[] = [
  {
    _id: 'test-1',
    name: 'Emma van der Berg',
    country: 'Nederland',
    rating: 5,
    quote:
      'De Maasai Mara reis was absoluut een levensveranderende ervaring. De rivieroversteken van de Grote Trek waren adembenemend. Puur Safaris heeft alles perfect geregeld — van de transfers tot het fantastische kamp. We gaan zeker terug!',
    date: '2024-08-20',
    bookedTrip: { title: 'Maasai Mara Grote Trek Safari', slug: 'maasai-mara-grote-trek' },
  },
  {
    _id: 'test-2',
    name: 'Pieter Janssen',
    country: 'België',
    rating: 5,
    quote:
      'Het gorilla trekking programma in Rwanda was ongelooflijk. Oog in oog staan met een silverback gorilla is iets wat ik nooit zal vergeten. Onze gids kende elke gorilla bij naam. Een absolute aanrader voor iedereen die iets bijzonders wil meemaken.',
    date: '2024-07-12',
    bookedTrip: { title: 'Rwanda Gorilla Trek & Akagera', slug: 'rwanda-gorilla-trek' },
  },
  {
    _id: 'test-3',
    name: 'Lisa Smeets',
    country: 'Nederland',
    rating: 5,
    quote:
      'De Serengeti was nog mooier dan ik me had kunnen voorstellen. Kleine groep, persoonlijke aandacht en een gids die echt alles wist over de dieren. Het lodge was luxueus maar toch authentiek. Perfect georganiseerde reis!',
    date: '2024-09-05',
    bookedTrip: { title: 'Serengeti & Ngorongoro Explorer', slug: 'serengeti-ngorongoro-explorer' },
  },
  {
    _id: 'test-4',
    name: 'Hans de Groot',
    country: 'Nederland',
    rating: 4,
    quote:
      'Onze Okavango Delta reis was een unieke ervaring. De mokoro safari\'s zijn echt bijzonder — zo stil glijd je door het riet terwijl nijlpaarden vlak naast je zijn. Het enige minpuntje was het vliegtuig vertraging op de heenreis, maar Puur Safaris loste dit snel op.',
    date: '2024-06-30',
    bookedTrip: { title: 'Okavango Delta & Chobe Expeditie', slug: 'okavango-delta-chobe' },
  },
  {
    _id: 'test-5',
    name: 'Marieke Vos',
    country: 'Nederland',
    rating: 5,
    quote:
      'De Kilimanjaro beklimming via de Lemosho route was het zwaarste maar ook het mooiste wat ik ooit heb gedaan. Onze gids was fantastisch — altijd bemoedigend, altijd alert op onze gezondheid. De zonsopgang vanaf Uhuru Peak was een moment dat ik nooit zal vergeten.',
    date: '2024-08-15',
    bookedTrip: { title: 'Kilimanjaro Beklimming & Serengeti', slug: 'kilimanjaro-serengeti' },
  },
  {
    _id: 'test-6',
    name: 'David Cohen',
    country: 'Israël',
    rating: 5,
    quote:
      'From the moment we arrived, everything was taken care of. The Kruger safari exceeded all expectations — we saw all of the Big Five in just two days! The Cape Town extension was the perfect finale to an amazing trip. Highly recommended!',
    date: '2024-10-01',
    bookedTrip: { title: 'Kruger & Kaapstad Combinatie', slug: 'kruger-kaapstad' },
  },
]
