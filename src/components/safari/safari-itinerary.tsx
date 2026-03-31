import { Utensils, MapPin } from 'lucide-react'
import type { ItineraryDay } from '@/lib/types'

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Ontbijt',
  lunch: 'Lunch',
  dinner: 'Diner',
}

interface SafariItineraryProps {
  itinerary: ItineraryDay[]
}

export function SafariItinerary({ itinerary }: SafariItineraryProps) {
  return (
    <div className="space-y-4">
      {itinerary.map((day) => (
        <details
          key={day.day}
          className="group rounded-xl border border-stone-200 bg-white overflow-hidden"
        >
          <summary className="flex cursor-pointer items-center gap-4 px-5 py-4 hover:bg-stone-50 transition-colors select-none list-none">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
              {day.day}
            </span>
            <span className="flex-1 font-semibold text-stone-900">{day.title}</span>
            <svg
              className="h-4 w-4 text-stone-400 transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <div className="px-5 pb-5 pt-2 border-t border-stone-100">
            {day.description && (
              <p className="text-stone-600 leading-relaxed text-sm">{day.description}</p>
            )}

            <div className="mt-3 flex flex-wrap gap-4">
              {day.location && (
                <span className="flex items-center gap-1.5 text-xs text-stone-500">
                  <MapPin className="h-3.5 w-3.5 text-amber-600" />
                  {day.location}
                </span>
              )}
              {day.meals && day.meals.length > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Utensils className="h-3.5 w-3.5 text-amber-600" />
                  {day.meals.map((m) => MEAL_LABELS[m] ?? m).join(' · ')}
                </span>
              )}
            </div>
          </div>
        </details>
      ))}
    </div>
  )
}
