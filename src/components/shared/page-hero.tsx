import Image from 'next/image'
import { cn } from '@/lib/utils'
import { FadeUp } from '@/components/motion/fade-up'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import type { SanityImage } from '@/lib/types'

interface PageHeroProps {
  title: string
  subtitle?: string
  image?: SanityImage
  eyebrow?: string
  className?: string
  children?: React.ReactNode
}

export function PageHero({ title, subtitle, image, eyebrow, className, children }: PageHeroProps) {
  const imageUrl = image?.asset?.url ?? null

  return (
    <section className={cn('relative flex min-h-[46vh] items-end overflow-hidden bg-ink', className)}>
      {/* Background */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={image?.alt ?? title}
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #030d07 0%, #0f0f0d 50%, #0a1a0d 100%)' }} />
      )}

      {/* Overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 50%, rgba(12,7,1,0.92) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 60%)' }} />

      {/* Gold bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, rgba(42,125,88,0.4), rgba(42,125,88,0.1) 50%, transparent)' }} />

      {/* Content */}
      <div className="relative z-10 w-full container mx-auto max-w-7xl px-6 lg:px-8 pb-12 pt-28">
        <FadeUp>
          <Breadcrumbs />
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {eyebrow}
            </p>
          )}
          <h1 className="font-serif text-heading font-bold text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-base leading-relaxed max-w-xl" style={{ color: 'rgba(255,255,255,0.52)' }}>
              {subtitle}
            </p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </FadeUp>
      </div>
    </section>
  )
}
