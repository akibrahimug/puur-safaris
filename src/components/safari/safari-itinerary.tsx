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
              aria-expanded={isOpen}
              className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 min-h-[56px] text-left transition-colors duration-150 whitespace-normal"
              style={{
                background: isOpen ? 'rgba(42,125,88,0.06)' : 'transparent',
                borderBottom: isLast && !isOpen ? 'none' : '1px solid rgba(42,125,88,0.08)',
              }}
            >
              {/* Day number — acts as the timeline node */}
              <div
                className="shrink-0 flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-200"
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
                  className="text-sm font-semibold block break-words sm:truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {day.title}
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  {day.location && (
                    <span className="flex items-center gap-1 text-[11px] sm:text-[10px] min-w-0" style={{ color: 'var(--text-subtle)' }}>
                      <MapPin className="h-3 w-3 sm:h-2.5 sm:w-2.5 text-gold shrink-0" />
                      <span className="break-words">{day.location}</span>
                    </span>
                  )}
                  {day.meals && day.meals.length > 0 && (
                    <span className="flex items-center gap-1 text-[11px] sm:text-[10px] min-w-0" style={{ color: 'var(--text-subtle)' }}>
                      <Utensils className="h-3 w-3 sm:h-2.5 sm:w-2.5 text-gold shrink-0" />
                      <span className="break-words">
                        {day.meals.map((m) => {
                          if (m === 'breakfast') return mealLabels?.breakfast ?? DEFAULT_MEAL_LABELS[m]
                          if (m === 'lunch') return mealLabels?.lunch ?? DEFAULT_MEAL_LABELS[m]
                          if (m === 'dinner') return mealLabels?.dinner ?? DEFAULT_MEAL_LABELS[m]
                          return DEFAULT_MEAL_LABELS[m] ?? m
                        }).join(' · ')}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <ChevronDown
                className="h-4 w-4 sm:h-3.5 sm:w-3.5 shrink-0 transition-transform duration-200"
                style={{
                  color: 'var(--text-subtle)',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {isOpen && day.description && (
              <div
                className="px-4 sm:px-5 pb-4 pt-2"
                style={{ borderBottom: isLast ? 'none' : '1px solid rgba(42,125,88,0.08)' }}
              >
                <p
                  className="text-sm leading-relaxed pl-0 sm:pl-12 break-words"
                  style={{ color: 'var(--text-muted)', overflowWrap: 'anywhere' }}
                >
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
