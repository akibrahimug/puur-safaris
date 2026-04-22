'use client'

import { motion } from 'framer-motion'
import {
  Heart, Shield, Users, Star, Globe, Headphones,
  Map, Compass, Sun, Camera,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '@/components/shared/section-heading'
import type { FeatureCard } from '@/lib/types'

const iconMap: Record<string, LucideIcon> = {
  Heart, Shield, Users, Star, Globe, Headphones,
  Map, Compass, Sun, Camera,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dict = Record<string, any>

function buildDefaultFeatures(dict?: Dict): (FeatureCard & { icon: LucideIcon })[] {
  const f = dict?.home?.features
  return [
    { iconName: 'Heart', icon: Heart, title: f?.personalTitle ?? 'Persoonlijk & op maat', description: f?.personalDesc ?? 'Elke safari wordt speciaal voor u ontworpen. Uw wensen, uw tempo, uw droomreis.' },
    { iconName: 'Shield', icon: Shield, title: f?.safetyTitle ?? 'Veiligheid voorop', description: f?.safetyDesc ?? 'Al onze gidsen zijn gecertificeerd en hebben jarenlange ervaring in het veld.' },
    { iconName: 'Users', icon: Users, title: f?.smallGroupsTitle ?? 'Kleine groepen', description: f?.smallGroupsDesc ?? 'Wij werken met kleine, intieme groepen voor een echte en authentieke ervaring.' },
    { iconName: 'Star', icon: Star, title: f?.qualityTitle ?? 'Topkwaliteit', description: f?.qualityDesc ?? 'Zorgvuldig geselecteerde lodges en camps met uitstekende service en comfort.' },
    { iconName: 'Globe', icon: Globe, title: f?.localTitle ?? 'Lokale expertise', description: f?.localDesc ?? 'Onze Afrikaanse partners kennen elk pad, elke schuilplaats en elk seizoen.' },
    { iconName: 'Headphones', icon: Headphones, title: f?.supportTitle ?? '24/7 ondersteuning', description: f?.supportDesc ?? 'Voor, tijdens en na uw reis staat ons team klaar voor vragen en ondersteuning.' },
  ]
}

interface WhyChooseUsSectionProps {
  eyebrow?: string
  title?: string
  features?: FeatureCard[]
  dict?: Dict
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.065, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

export function WhyChooseUsSection({ eyebrow, title, features, dict }: WhyChooseUsSectionProps) {
  const d = dict?.home
  const featureList = features?.length ? features : buildDefaultFeatures(dict)

  return (
    <section className="section-page py-16 sm:py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={eyebrow ?? d?.whyEyebrow ?? 'Waarom Puur Uganda Reizen'}
          title={title ?? d?.whyTitle ?? 'Wij geloven in reizen die een indruk achterlaten voor het leven.'}
          light
          centered
          className="mb-10 sm:mb-12 md:mb-16 mx-auto max-w-2xl"
        />

        {/* Feature grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {featureList.map((f, i) => {
            const Icon = (f.iconName ? iconMap[f.iconName] : undefined) ?? Heart
            const num = String(i + 1).padStart(2, '0')
            return (
              <motion.div
                key={f.title}
                custom={i}
                variants={cardVariants}
                className="group relative p-5 sm:p-6 rounded-3xl overflow-hidden cursor-default transition-all duration-500 ease-out border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-lg shadow-black/5 active:bg-white/5"
                whileHover={{
                  y: -6,
                  background: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
                  transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
                }}
              >
                {/* Watermark number */}
                <span
                  className="absolute top-4 right-5 font-serif font-bold select-none pointer-events-none"
                  style={{ fontSize: '3.5rem', lineHeight: 1, color: 'rgba(42,125,88,0.06)' }}
                >
                  {num}
                </span>

                {/* Icon */}
                <div className="mb-4 sm:mb-5 flex h-12 w-12 sm:h-12 sm:w-12 items-center justify-center rounded-2xl transition-all duration-500 ease-out group-hover:scale-110 shadow-inner"
                  style={{ background: 'rgba(42,125,88,0.15)', border: '1px solid rgba(42,125,88,0.2)' }}>
                  <Icon className="h-5 w-5 sm:h-5 sm:w-5" style={{ color: '#5aad7e' }} />
                </div>

                <h3 className="font-semibold text-base sm:text-[0.925rem] mb-2" style={{ color: 'var(--text-primary)' }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed break-words" style={{ color: 'var(--text-muted)' }}>
                  {f.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
