'use client'

import { useMemo } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { stegaClean } from '@sanity/client/stega'
import { SafariGrid } from './safari-grid'
import type { SafariCardLabels } from './safari-card'
import type { TripCard } from '@/lib/types'

const CATEGORIES = ['wildlife', 'hiking', 'culture', 'beach', 'combined'] as const
type Category = typeof CATEGORIES[number]

interface FilterGridProps {
  allTrips: TripCard[]
  locale: string
  labels: SafariCardLabels
  emptyMessage?: string
  categoryLabels: Partial<Record<Category, string>>
  viewAllLabel: string
}

export function SafariFilterGrid({
  allTrips,
  locale,
  labels,
  emptyMessage,
  categoryLabels,
  viewAllLabel,
}: FilterGridProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const raw = searchParams.get('category')
  const activeCategory: Category | null =
    raw && (CATEGORIES as readonly string[]).includes(raw) ? (raw as Category) : null

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const cat of CATEGORIES) counts[cat] = 0
    for (const trip of allTrips) {
      const key = stegaClean(trip.category) as string
      if (key && counts[key] !== undefined) counts[key]++
    }
    return counts
  }, [allTrips])

  const availableCategories = CATEGORIES.filter((cat) => categoryCounts[cat] > 0)

  const trips = activeCategory
    ? allTrips.filter((t) => stegaClean(t.category) === activeCategory)
    : allTrips

  const setCategory = (cat: Category | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) params.set('category', cat)
    else params.delete('category')
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`whitespace-nowrap min-h-[44px] inline-flex items-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 cursor-pointer ${
            !activeCategory
              ? 'bg-gold text-white shadow-md'
              : 'border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-gold/40 hover:text-[var(--text-primary)]'
          }`}
        >
          {viewAllLabel}
          <span className="ml-2 text-xs opacity-75">{allTrips.length}</span>
        </button>
        {availableCategories.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap min-h-[44px] inline-flex items-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeCategory === cat
                ? 'bg-gold text-white shadow-md'
                : 'border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-gold/40 hover:text-[var(--text-primary)]'
            }`}
          >
            {categoryLabels[cat] ?? cat}
            <span className="ml-2 text-xs opacity-75">{categoryCounts[cat]}</span>
          </button>
        ))}
      </div>

      <SafariGrid
        key={activeCategory ?? 'all'}
        trips={trips}
        locale={locale}
        labels={labels}
        emptyMessage={emptyMessage}
      />
    </>
  )
}
