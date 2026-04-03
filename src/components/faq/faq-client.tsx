'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { PortableTextRenderer } from '@/components/shared/portable-text-renderer'
import { faqCategoryLabel } from '@/lib/utils'
import type { FaqItem } from '@/lib/types'

interface FaqClientProps {
  groupedFaqs: Record<string, FaqItem[]>
  searchPlaceholder?: string
  categoriesHeading?: string
  viewAllLabel?: string
  noResultsText?: string
  resetSearchLabel?: string
}

export function FaqClient({ groupedFaqs, searchPlaceholder, categoriesHeading, viewAllLabel, noResultsText, resetSearchLabel }: FaqClientProps) {
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
    <section className="py-20 bg-[var(--bg-primary)] min-h-[60vh] relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gold" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder ?? "Zoek een vraag..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 shadow-sm transition-all"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sidebar Menu */}
          <div className="lg:col-span-3 sticky top-32">
            <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] mb-6">{categoriesHeading ?? 'Categorieën'}</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`w-full text-left px-5 py-3 rounded-2xl transition-all duration-300 font-medium ${activeCategory === 'all' ? 'bg-gold text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  {viewAllLabel ?? 'Alles Bekijken'}
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-5 py-3 rounded-2xl transition-all duration-300 font-medium ${activeCategory === cat ? 'bg-gold text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    {faqCategoryLabel(cat)}
                    <span className="float-right bg-[var(--bg-primary)] px-2 py-0.5 rounded-full text-xs opacity-70">
                      {groupedFaqs[cat].length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ Accordions */}
          <div className="lg:col-span-9 space-y-12">
            {Object.keys(displayGroups).length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                <p className="text-lg text-[var(--text-muted)] mb-4">{noResultsText ?? 'Geen resultaten gevonden voor'} &quot;{searchQuery}&quot;</p>
                <button onClick={() => setSearchQuery('')} className="text-gold font-semibold hover:underline">{resetSearchLabel ?? 'Reset zoekopdracht'}</button>
              </div>
            ) : (
              Object.entries(displayGroups).map(([category, items]) => (
                <div key={category}>
                  {(activeCategory === 'all' || searchQuery !== '') && (
                    <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)] mb-6 ml-2">
                      {faqCategoryLabel(category)}
                    </h2>
                  )}
                  <div className="space-y-4">
                    {items.map((faq) => {
                      const isOpen = openIds.has(faq._id)
                      return (
                        <motion.div
                          layout
                          key={faq._id}
                          className={`rounded-3xl border transition-colors duration-300 overflow-hidden ${isOpen ? 'bg-[var(--bg-secondary)] border-gold/40 shadow-sm' : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-medium)]'}`}
                        >
                          <button
                            onClick={() => toggleQuestion(faq._id)}
                            className="w-full flex items-center justify-between text-left px-6 py-5 group"
                          >
                            <span className={`font-semibold transition-colors ${isOpen ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'}`}>
                              {faq.question}
                            </span>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-gold/10 text-gold' : 'bg-[var(--bg-primary)] text-[var(--text-subtle)] group-hover:text-[var(--text-primary)]'}`}>
                              <ChevronDown className={`h-4 w-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            </div>
                          </button>
                          
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="border-t border-[var(--border-subtle)]"
                              >
                                <div className="px-6 py-5 text-[var(--text-subtle)] leading-relaxed prose prose-sm prose-stone">
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
