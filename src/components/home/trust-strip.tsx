'use client'

import { motion } from 'framer-motion'

/*
  Trust strip — sits between hero and trips.
  Editorial "expedition manifest" format: inline number within a short phrase.
  Not the generic "big centered number + label" — these read as field notes.
*/
const trustItems = [
  { value: '500+', phrase: 'reizigers vonden hun droomsafari' },
  { value: '12',   phrase: 'landen actief in Oost-Afrika' },
  { value: '15',   phrase: 'jaar veldervaring met de wildernis' },
  { value: '4.9★', phrase: 'gemiddeld beoordeeld door reizigers' },
]

export function TrustStrip() {
  return (
    <div className="relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      {/* Top edge — gold taper */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, rgba(58,168,118,0.45), rgba(58,168,118,0.12) 55%, transparent)' }} />
      {/* Bottom edge — subtle */}
      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: 'var(--border-subtle)' }} />

      <div className="container mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.value}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
              className="flex items-start gap-3"
            >
              {/* Vertical gold accent bar */}
              <div className="shrink-0 mt-0.5 w-0.5 h-8 rounded-full"
                style={{ background: 'linear-gradient(to bottom, rgba(58,168,118,0.7), rgba(58,168,118,0.15))' }} />

              <div>
                <p className="font-serif font-bold leading-none mb-1"
                  style={{ fontSize: '1.35rem', color: '#3aa876' }}>
                  {item.value}
                </p>
                <p className="text-[10.5px] font-medium uppercase tracking-wider leading-snug"
                  style={{ color: 'var(--text-subtle)' }}>
                  {item.phrase}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
