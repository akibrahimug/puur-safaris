'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ThemeToggleProps {
  scrolled?: boolean
}

export function ThemeToggle({ scrolled = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard hydration guard pattern
  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="h-11 w-11" aria-hidden="true" />

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Schakel naar lichte modus' : 'Schakel naar donkere modus'}
      aria-pressed={isDark}
      className={`flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border transition-all duration-300 active:scale-95 [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
        scrolled
          ? isDark
            ? 'border-white/15 text-white/60 hover:border-gold/50 hover:text-gold active:border-gold active:text-gold'
            : 'border-stone-300/60 text-stone-500 hover:border-gold/50 hover:text-gold active:border-gold active:text-gold'
          : 'border-white/20 text-white/60 hover:border-gold/50 hover:text-gold active:border-gold active:text-gold'
      }`}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}
