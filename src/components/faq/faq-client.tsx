'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { PortableTextRenderer } from '@/components/shared/portable-text-renderer'
import { faqCategoryLabel } from '@/lib/utils'
import type { FaqItem } from '@/lib/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dict = Record<string, any>

interface FaqClientProps {
  groupedFaqs: Record<string, FaqItem[]>
  searchPlaceholder?: string
  categoriesHeading?: string
  viewAllLabel?: string
  noResultsText?: string
  resetSearchLabel?: string
  dict?: Dict
  locale?: string
}

export function FaqClient({ groupedFaqs, searchPlaceholder, categoriesHeading, viewAllLabel, noResultsText, resetSearchLabel, dict, locale = 'nl' }: FaqClientProps) {
  const cats = dict?.categories
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const categories = Object.keys(groupedFaqs)

  const toggleQuestion = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Flatten and filter FAQs based on search and category
  const filteredFaqs = Object.entries(groupedFaqs).reduce<Array<FaqItem & { catStr: string }>>((acc, [cat, items]) => {
    // If not 'all', strictly filter by category
    if (activeCategory !== 'all' && activeCategory !== cat) return acc

    // Filter by search query
    const filteredItems = items.filter(item => {
      const qMatch = item.question?.toLowerCase().includes(searchQuery.toLowerCase())
      // Optional: search within the answer block texts if needed, but question search is usually enough
      return qMatch
    })

    filteredItems.forEach(item => acc.push({ ...item, catStr: cat }))
    return acc
  }, [])

  // Group the filtered items back if we are viewing "All" so we can show category headers
  const displayGroups = activeCategory === 'all' && searchQuery === '' 
    ? groupedFaqs 
    : filteredFaqs.reduce<Record<string, FaqItem[]>>((acc, item) => {
        if (!acc[item.catStr]) acc[item.catStr] = []
        acc[item.catStr].push(item)
        return acc
      }, {})

  return (
    <section className="py-12 sm:py-20 bg-[var(--bg-primary)] min-h-[60vh] relative overflow-x-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Search Bar */}
        <div className="mb-8 sm:mb-12 max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-5 sm:pl-6 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gold" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder ?? "Zoek een vraag..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] pl-12 sm:pl-14 pr-5 sm:pr-6 py-3 sm:py-4 text-base rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 shadow-sm transition-all"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Sidebar Menu */}
          <div className="lg:col-span-3 lg:sticky lg:top-32">
            <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6">{categoriesHeading ?? 'Categorieën'}</h3>
            <ul className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible -mx-4 px-4 lg:mx-0 lg:px-0 lg:space-y-2 pb-2 lg:pb-0 snap-x snap-mandatory lg:snap-none">
              <li className="shrink-0 lg:shrink snap-start">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`w-full min-h-[44px] whitespace-nowrap lg:whitespace-normal text-left px-5 py-3 rounded-2xl transition-colors duration-300 font-medium ${activeCategory === 'all' ? 'bg-gold text-white shadow-md' : 'bg-[var(--bg-secondary)] lg:bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  {viewAllLabel ?? 'Alles Bekijken'}
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat} className="shrink-0 lg:shrink snap-start">
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full min-h-[44px] whitespace-nowrap lg:whitespace-normal text-left px-5 py-3 rounded-2xl transition-colors duration-300 font-medium flex items-center justify-between gap-3 ${activeCategory === cat ? 'bg-gold text-white shadow-md' : 'bg-[var(--bg-secondary)] lg:bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    <span>{faqCategoryLabel(cat, locale, cats)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs shrink-0 ${activeCategory === cat ? 'bg-white/20 text-white' : 'bg-[var(--bg-primary)] opacity-70'}`}>
                      {groupedFaqs[cat].length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ Accordions */}
          <div className="lg:col-span-9 space-y-8 sm:space-y-12 min-w-0">
            {Object.keys(displayGroups).length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                <p className="text-base sm:text-lg text-[var(--text-muted)] mb-4 break-words">{noResultsText ?? 'Geen resultaten gevonden voor'} &quot;{searchQuery}&quot;</p>
                <button onClick={() => setSearchQuery('')} className="min-h-[44px] px-4 text-gold font-semibold hover:underline">{resetSearchLabel ?? 'Reset zoekopdracht'}</button>
              </div>
            ) : (
              Object.entries(displayGroups).map(([category, items]) => (
                <div key={category}>
                  {(activeCategory === 'all' || searchQuery !== '') && (
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6 ml-1 sm:ml-2 break-words">
                      {faqCategoryLabel(category, locale)}
                    </h2>
                  )}
                  <div className="space-y-3 sm:space-y-4">
                    {items.map((faq) => {
                      const isOpen = openIds.has(faq._id)
                      return (
                        <motion.div
                          layout
                          key={faq._id}
                          className={`rounded-2xl sm:rounded-3xl border transition-colors duration-300 overflow-hidden ${isOpen ? 'bg-[var(--bg-secondary)] border-gold/40 shadow-sm' : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'}`}
                        >
                          <button
                            onClick={() => toggleQuestion(faq._id)}
                            aria-expanded={isOpen}
                            className="w-full min-h-[44px] flex items-center justify-between gap-3 text-left px-4 sm:px-6 py-4 sm:py-5 group whitespace-normal"
                          >
                            <span className={`font-semibold text-sm sm:text-base break-words min-w-0 flex-1 transition-colors ${isOpen ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'}`}>
                              {faq.question}
                            </span>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-gold/10 text-gold' : 'bg-[var(--bg-primary)] text-[var(--text-subtle)] group-hover:text-[var(--text-primary)]'}`}>
                              <ChevronDown className={`h-4 w-4 transition-transform duration-300 will-change-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </div>
                          </button>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="border-t border-[var(--border-subtle)] overflow-hidden"
                              >
                                <div className="px-4 sm:px-6 py-4 sm:py-5 text-sm sm:text-base text-[var(--text-subtle)] leading-relaxed prose prose-sm prose-stone max-w-none break-words">
                                  <PortableTextRenderer value={faq.answer} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
