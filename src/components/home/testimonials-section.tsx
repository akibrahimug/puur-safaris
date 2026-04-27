'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/shared/section-heading'
import { Button } from '@/components/ui/button'
import { formatMonth } from '@/lib/utils'
import type { Testimonial } from '@/lib/types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
  eyebrow?: string
  title?: string
  subtitle?: string
  verifiedLabel?: string
  moreLabel?: string
  beginLabel?: string
}

export function TestimonialsSection({ testimonials, eyebrow, title, subtitle, verifiedLabel, moreLabel, beginLabel }: TestimonialsSectionProps) {
  const INITIAL = 3
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(testimonials.length / INITIAL)
  const visible = testimonials.slice(page * INITIAL, (page + 1) * INITIAL)
  const hasMore = testimonials.length > INITIAL

  if (testimonials.length === 0) return null

  return (
    <section className="py-16 sm:py-20 md:py-28 overflow-hidden section-page">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          centered
          light
          className="mb-10 sm:mb-12 md:mb-16 mx-auto max-w-xl"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {visible.map((t) => {
            const avatarUrl = t.profilePhoto?.asset?.url || null
            return (
              <motion.article
                key={t._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group flex flex-col min-h-[320px] sm:h-[360px] rounded-3xl p-6 sm:p-8 transition-all duration-500 ease-out border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-lg shadow-black/5 active:bg-white/5"
                whileHover={{
                  y: -6,
                  background: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
                  transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
                }}
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg
                      key={idx}
                      className={`h-3.5 w-3.5 ${idx < t.rating ? 'fill-gold text-gold' : ''}`}
                      style={idx >= t.rating ? { fill: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.1)' } : {}}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="grow mb-5 relative">
                  <span
                    className="absolute -top-2 -left-1 font-serif leading-none select-none pointer-events-none"
                    style={{ fontSize: '4rem', color: 'rgba(42,125,88,0.12)', lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <p className="relative text-sm leading-relaxed pl-4 line-clamp-6 sm:line-clamp-[9] break-words" style={{ color: 'var(--text-muted)' }}>
                    {t.quote}
                  </p>
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  {avatarUrl ? (
                    <div className="relative h-9 w-9 overflow-hidden rounded-full shrink-0">
                      <Image src={avatarUrl} alt={t.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-gold">
                      {t.name.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0 grow">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {t.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-subtle)' }}>
                      {t.country}{t.date && ` · ${formatMonth(t.date)}`}
                    </p>
                  </div>

                  {t.source === 'google' ? (
                    <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider flex items-center gap-1"
                      style={{
                        background: 'rgba(66,133,244,0.12)',
                        color: '#4285f4',
                        border: '1px solid rgba(66,133,244,0.2)',
                      }}>
                      <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                      Google
                    </span>
                  ) : t.bookedTrip ? (
                    <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                      style={{
                        background: 'rgba(29,76,47,0.18)',
                        color: '#7dcb8e',
                        border: '1px solid rgba(125,203,142,0.2)',
                      }}>
                      {verifiedLabel}
                    </span>
                  ) : null}
                </div>
              </motion.article>
            )
          })}
        </motion.div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setPage((prev) => (prev + 1) % totalPages)}
              className="rounded-full px-8 py-3 min-h-[44px] transition-all duration-500 ease-out"
            >
              {page === totalPages - 1 ? beginLabel : moreLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
