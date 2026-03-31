import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { HoverCard } from '@/components/motion/hover-card'
import type { DestinationCard as DestinationCardType } from '@/lib/types'

interface DestinationCardProps {
  destination: DestinationCardType
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const imageUrl = destination.heroImage?.asset?.url ?? null

  return (
    <HoverCard>
      <Link
        href={`/bestemmingen/${destination.slug}`}
        className="group relative block overflow-hidden rounded-2xl bg-stone-900 aspect-4/3"
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={destination.heroImage?.alt ?? destination.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <MapPin className="h-3 w-3 text-gold" />
                <span className="text-xs font-medium tracking-wide text-gold">{destination.country}</span>
              </div>
              <h3 className="font-serif text-xl font-bold leading-tight">{destination.name}</h3>
              {destination.tripCount !== undefined && destination.tripCount > 0 && (
                <p className="mt-1 text-xs text-white/50">
                  {destination.tripCount} {destination.tripCount === 1 ? 'reis' : 'reizen'} beschikbaar
                </p>
              )}
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:bg-gold group-hover:border-gold">
              <ArrowUpRight className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </Link>
    </HoverCard>
  )
}
