'use client'

import { useState } from 'react'
import { MapPin, Utensils, ChevronDown } from 'lucide-react'
import type { ItineraryDay } from '@/lib/types'

const DEFAULT_MEAL_LABELS: Record<string, string> = {
  breakfast: 'Ontbijt',
  lunch: 'Lunch',
  dinner: 'Diner',
}

interface SafariItineraryProps {
  itinerary: ItineraryDay[]
  mealLabels?: { breakfast?: string; lunch?: string; dinner?: string }
}

export function SafariItinerary({ itinerary, mealLabels }: SafariItineraryProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--card-strip-bg)', border: '1px solid rgba(42,125,88,0.18)' }}
    >
      {itinerary.map((day, i) => {
        const isOpen = open === day.day
        const isLast = i === itinerary.length - 1

        return (
          <div key={day.day}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : day.day)}
              className="w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors duration-150"
              style={{
                background: isOpen ? 'rgba(42,125,88,0.06)' : 'transparent',
                borderBottom: isLast && !isOpen ? 'none' : '1px solid rgba(42,125,88,0.08)',
              }}
            >
              {/* Day number — acts as the timeline node */}
              <div
                className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-200"
                style={{
                  background: isOpen ? '#2a7d58' : 'rgba(42,125,88,0.1)',
                  border: `1.5px solid ${isOpen ? '#2a7d58' : 'rgba(42,125,88,0.3)'}`,
                  color: isOpen ? '#fff' : '#2a7d58',
                }}
              >
                {day.day}
              </div>

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <span
                  className="text-sm font-semibold block truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {day.title}
                </span>
                <div className="flex items-center gap-3 mt-0.5">
                  {day.location && (
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-subtle)' }}>
                      <MapPin className="h-2.5 w-2.5 text-gold shrink-0" />
                      {day.location}
                    </span>
                  )}
                  {day.meals && day.meals.length > 0 && (
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-subtle)' }}>
                      <Utensils className="h-2.5 w-2.5 text-gold shrink-0" />
                      {day.meals.map((m) => {
                        if (m === 'breakfast') return mealLabels?.breakfast ?? DEFAULT_MEAL_LABELS[m]
                        if (m === 'lunch') return mealLabels?.lunch ?? DEFAULT_MEAL_LABELS[m]
                        if (m === 'dinner') return mealLabels?.dinner ?? DEFAULT_MEAL_LABELS[m]
                        return DEFAULT_MEAL_LABELS[m] ?? m
                      }).join(' · ')}
                    </span>
                  )}
                </div>
              </div>

              <ChevronDown
                className="h-3.5 w-3.5 shrink-0 transition-transform duration-200"
                style={{
                  color: 'var(--text-subtle)',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {isOpen && day.description && (
              <div
                className="px-5 pb-4 pt-2"
                style={{ borderBottom: isLast ? 'none' : '1px solid rgba(42,125,88,0.08)' }}
              >
                <p className="text-sm leading-relaxed pl-12" style={{ color: 'var(--text-muted)' }}>
                  {day.description}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
