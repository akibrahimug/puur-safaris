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

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="h-9 w-9" />

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Schakel naar lichte modus' : 'Schakel naar donkere modus'}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'border-white/15 text-white/60 hover:border-gold/50 hover:text-gold'
            : 'border-stone-300/60 text-stone-500 hover:border-gold/50 hover:text-gold'
          : 'border-white/20 text-white/60 hover:border-gold/50 hover:text-gold'
      }`}
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5" />
      ) : (
        <Moon className="h-3.5 w-3.5" />
      )}
    </button>
  )
}
