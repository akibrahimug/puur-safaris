'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { resolveRangeSelection } from './date-range-logic'

/* ── Breakpoint hook ──────────────────────────────────────────────────────── */

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatches(mq.matches) // eslint-disable-line react-hooks/set-state-in-effect -- syncing with external matchMedia API
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

/* ── Chevron ──────────────────────────────────────────────────────────────── */

function CalendarChevron({ orientation }: { orientation?: string }) {
  return orientation === 'left' ? (
    <ChevronLeft className="h-4 w-4" style={{ color: '#1c1917' }} />
  ) : (
    <ChevronRight className="h-4 w-4" style={{ color: '#1c1917' }} />
  )
}

/* ── Trigger button ───────────────────────────────────────────────────────── */

function TriggerButton({
  onClick,
  error,
  children,
}: {
  onClick: () => void
  error?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl px-4 py-3 text-sm text-left outline-none transition-all duration-200 flex items-center justify-between gap-2"
      style={
        error
          ? {
              background: 'rgba(220,38,38,0.04)',
              border: '1px solid rgba(220,38,38,0.5)',
              color: 'var(--text-primary)',
            }
          : {
              background: 'rgba(42,125,88,0.05)',
              border: '1px solid rgba(42,125,88,0.2)',
              color: 'var(--text-primary)',
            }
      }
    >
      {children}
    </button>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   DROPDOWN — works on all screen sizes
   Mobile: bottom-sheet style (anchored, not fullscreen)
   Desktop: standard dropdown
   ══════════════════════════════════════════════════════════════════════════════ */

function CalendarDropdown({
  open,
  onClose,
  anchorRef,
  children,
}: {
  open: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose, anchorRef])

  if (!open) return null

  return (
    <div
      ref={dropdownRef}
      className="puur-calendar-dropdown absolute left-0 right-0 md:right-auto z-50 mt-2 rounded-xl p-3 md:p-5 shadow-xl"
    >
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   SINGLE DATE PICKER
   ══════════════════════════════════════════════════════════════════════════════ */

interface SingleDatePickerProps {
  value: string
  onChange: (value: string) => void
  label: string
  required?: boolean
  optional?: boolean
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  error?: string
}

export function SingleDatePicker({
  value,
  onChange,
  label,
  required,
  optional,
  placeholder = 'Selecteer datum',
  minDate,
  maxDate,
  error,
}: SingleDatePickerProps) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  const selectedDate = value ? new Date(value + 'T00:00:00') : undefined
  const displayValue = selectedDate
    ? format(selectedDate, 'd MMMM yyyy', { locale: nl })
    : ''

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        onChange(format(date, 'yyyy-MM-dd'))
      }
      setOpen(false)
    },
    [onChange],
  )

  return (
    <div className="relative" ref={anchorRef}>
      <label
        className="block text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}{' '}
        {required && <span style={{ color: '#2a7d58' }}>*</span>}
        {optional && (
          <span className="text-[10px] normal-case" style={{ color: 'var(--text-subtle)' }}>
            (optioneel)
          </span>
        )}
      </label>
      <TriggerButton onClick={() => setOpen((v) => !v)} error={error}>
        <span style={{ color: displayValue ? undefined : 'var(--text-subtle)' }}>
          {displayValue || placeholder}
        </span>
        <CalendarDays className="h-4 w-4 shrink-0" style={{ color: '#2a7d58' }} />
      </TriggerButton>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

      <CalendarDropdown open={open} onClose={() => setOpen(false)} anchorRef={anchorRef}>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          locale={nl}
          disabled={[
            ...(minDate ? [{ before: minDate }] : []),
            ...(maxDate ? [{ after: maxDate }] : []),
          ]}
          defaultMonth={selectedDate ?? minDate ?? maxDate ?? new Date()}
          components={{ Chevron: CalendarChevron }}
        />
      </CalendarDropdown>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   DATE RANGE PICKER
   - Clicking a 3rd date resets the range (new start date)
   - Selecting end date auto-closes on desktop
   ══════════════════════════════════════════════════════════════════════════════ */

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
  label: string
  required?: boolean
  minDate?: Date
  error?: string
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  label,
  required,
  minDate,
  error,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const from = startDate ? new Date(startDate + 'T00:00:00') : undefined
  const to = endDate ? new Date(endDate + 'T00:00:00') : undefined
  const selected: DateRange | undefined = from || to ? { from, to } : undefined

  const displayValue = (() => {
    if (from && to) {
      return `${format(from, 'd MMM yyyy', { locale: nl })}  —  ${format(to, 'd MMM yyyy', { locale: nl })}`
    }
    if (from) {
      return `${format(from, 'd MMM yyyy', { locale: nl })}  —  ...`
    }
    return ''
  })()

  // Sync refs in an effect so the handler always sees current state
  const fromRef = useRef(from)
  const toRef = useRef(to)
  useEffect(() => {
    fromRef.current = from
    toRef.current = to
  })

  const handleDayClick = useCallback(
    (day: Date) => {
      const result = resolveRangeSelection(day, fromRef.current, toRef.current)
      onStartChange(format(result.from, 'yyyy-MM-dd'))
      onEndChange(result.to ? format(result.to, 'yyyy-MM-dd') : '')
    },
    [onStartChange, onEndChange],
  )

  return (
    <div className="relative" ref={anchorRef}>
      <label
        className="block text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}{' '}
        {required && <span style={{ color: '#2a7d58' }}>*</span>}
      </label>
      <TriggerButton onClick={() => setOpen((v) => !v)} error={error}>
        <span style={{ color: displayValue ? undefined : 'var(--text-subtle)' }}>
          {displayValue || 'Selecteer reisdata'}
        </span>
        <CalendarDays className="h-4 w-4 shrink-0" style={{ color: '#2a7d58' }} />
      </TriggerButton>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

      <CalendarDropdown open={open} onClose={() => setOpen(false)} anchorRef={anchorRef}>
        <DayPicker
          mode="range"
          selected={selected}
          onDayClick={handleDayClick}
          locale={nl}
          numberOfMonths={isDesktop ? 2 : 1}
          disabled={minDate ? { before: minDate } : undefined}
          defaultMonth={from ?? minDate ?? new Date()}
          components={{ Chevron: CalendarChevron }}
        />
      </CalendarDropdown>
    </div>
  )
}
