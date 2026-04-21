'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react'

interface InstagramSidebarGalleryProps {
  authorName: string
  authorImage: string
  gallery: string[]
  labels?: {
    sidebarHeading?: string
    sidebarDescription?: string
    viewLabel?: string
    ctaLabel?: string
  }
}

export function InstagramSidebarGallery({ authorName, authorImage, gallery, labels }: InstagramSidebarGalleryProps) {
  const [page, setPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(4) // default to 4 for SSR
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640
      setIsMobile(mobile)
      setItemsPerPage(mobile ? gallery.length || 1 : 4)
      // On resize transition, reset page to 0 if bounds change drastically
      setPage(prev => {
        const newTotal = Math.ceil(gallery.length / (mobile ? (gallery.length || 1) : 4))
        return prev >= newTotal ? 0 : prev
      })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [gallery.length])

  const totalPages = Math.ceil(gallery.length / itemsPerPage)
  const currentGallery = gallery.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

  const next = () => setPage((p) => (p + 1) % totalPages)
  const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages)

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const distance = touchStart - e.changedTouches[0].clientX
    if (distance > 40) next()
    if (distance < -40) prev()
    setTouchStart(null)
  }

  return (
    <div className="p-4 sm:p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-lg shadow-black/5 relative z-10 bg-opacity-95 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full border-2 border-gold/40 overflow-hidden relative p-[2px] shrink-0">
            <div className="h-full w-full rounded-full overflow-hidden relative">
              <Image src={authorImage} alt={authorName} fill className="object-cover" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] leading-none mb-1">{labels?.sidebarHeading ?? 'Favoriete Momenten'}</h3>
            <p className="text-xs font-mono text-[var(--text-muted)]">@{authorName.toLowerCase().replace(/\s/g, '') || 'puurugandareizen'}</p>
          </div>
        </div>
        <Compass className="h-5 w-5 text-gold/60 shrink-0" />
      </div>

      <p className="text-sm text-[var(--text-muted)] mb-5">
        {labels?.sidebarDescription ?? 'Een visuele weergave van de prachtige momenten vastgelegd tijdens deze reis met Puur Uganda Reizen.'}
      </p>

      {/* Gallery: horizontal swipe row on mobile, grid on larger screens */}
      <div className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div
          className="flex sm:grid sm:grid-cols-2 gap-3 sm:gap-2 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide pb-2 sm:pb-0"
          aria-label={labels?.sidebarHeading ?? 'Instagram gallery'}
          role="list"
        >
          {(isMobile ? gallery : currentGallery).map((imgUrl, idx) => (
            <div
              key={isMobile ? `m-${idx}` : `${page}-${idx}`}
              role="listitem"
              className="relative z-10 sm:hover:z-50 shrink-0 w-[70%] sm:w-auto snap-center"
            >
              <div
                className={`relative aspect-square rounded-xl bg-stone-100 transition-all duration-300 hover:shadow-xl sm:hover:shadow-2xl overflow-hidden cursor-pointer group
                hover:-rotate-0 sm:hover:-rotate-1 lg:hover:-rotate-2
                hover:scale-[1.02] sm:hover:scale-[1.4] lg:hover:scale-[1.8]
                ${idx % 2 === 0 ? 'sm:origin-left' : 'sm:origin-right'}`}
              >
                <Image
                  src={imgUrl}
                  alt={`Safari Memory ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 70vw, 20vw"
                  className="object-cover rounded-xl"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none">
                  <div className="scale-90 sm:scale-100 text-white text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30 backdrop-blur-sm">
                    {labels?.viewLabel ?? 'Bekijk Locatie'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls — hidden on mobile (native swipe handles it) */}
        {totalPages > 1 && !isMobile && (
          <div className="hidden sm:flex items-center justify-between mt-6">
            <button 
              onClick={prev} 
              className="p-3 sm:p-1.5 rounded-full border border-[var(--border-subtle)] hover:bg-[var(--bg-primary)] transition-colors text-[var(--text-muted)] hover:text-gold shadow-sm sm:shadow-none"
              aria-label="Previous images"
            >
              <ChevronLeft className="h-6 w-6 sm:h-4 sm:w-4" />
            </button>
            <div className={`flex gap-1.5 ${totalPages > 6 ? 'flex-wrap justify-center w-24' : ''}`}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 sm:h-1.5 rounded-full transition-all duration-300 ${i === page ? 'w-5 sm:w-5 bg-gold' : 'w-2 sm:w-1.5 bg-[var(--border-subtle)]'}`} 
                />
              ))}
            </div>
            <button 
              onClick={next} 
              className="p-3 sm:p-1.5 rounded-full border border-[var(--border-subtle)] hover:bg-[var(--bg-primary)] transition-colors text-[var(--text-muted)] hover:text-gold shadow-sm sm:shadow-none"
              aria-label="Next images"
            >
              <ChevronRight className="h-6 w-6 sm:h-4 sm:w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] text-center relative z-0">
        <Link
          href="/safaris"
          className="inline-flex items-center justify-center w-full min-h-[44px] rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] px-4 py-3 sm:py-2 text-sm font-medium hover:bg-[var(--bg-primary)] hover:border-gold/40 transition-colors"
        >
          {labels?.ctaLabel ?? 'Ontdek Al Onze Reizen'}
        </Link>
      </div>
    </div>
  )
}
