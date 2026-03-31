'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/shared/section-heading'
import { formatMonth } from '@/lib/utils'
import type { Testimonial } from '@/lib/types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.065, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null

  return (
    <section className="py-28 overflow-hidden section-page">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Reizigersverhalen"
          title="Wat onze reizigers zeggen"
          subtitle="Elke safari is uniek. Lees hoe anderen Oost-Afrika hebben ervaren."
          centered
          light
          className="mb-16 mx-auto max-w-xl"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {testimonials.map((t, i) => {
            const avatarUrl = t.profilePhoto?.asset?.url ?? null
            return (
              <motion.article
                key={t._id}
                custom={i}
                variants={cardVariants}
                className="group flex flex-col rounded-2xl p-6 transition-shadow duration-300"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                whileHover={{
                  y: -4,
                  background: 'rgba(255,255,255,0.06)',
                  borderColor: 'rgba(58,168,118,0.2)',
                  transition: { duration: 0.22 },
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
                    style={{ fontSize: '4rem', color: 'rgba(58,168,118,0.12)', lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <p className="relative text-sm leading-relaxed pl-4" style={{ color: 'var(--text-muted)' }}>
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
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #5aad7e, #8b1c2c)' }}>
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

                  {t.bookedTrip && (
                    <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                      style={{
                        background: 'rgba(29,76,47,0.18)',
                        color: '#7dcb8e',
                        border: '1px solid rgba(125,203,142,0.2)',
                      }}>
                      Geverifieerd
                    </span>
                  )}
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
