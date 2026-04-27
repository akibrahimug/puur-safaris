import { cn } from '@/lib/utils'
import { FadeUp } from '@/components/motion/fade-up'

interface SectionHeadingProps {
  title?: string
  subtitle?: string
  eyebrow?: string
  centered?: boolean
  /** light=true → on dark bg (uses var text), light=false → on light bg (uses dark text) */
  light?: boolean
  className?: string
}

export function SectionHeading({ title, subtitle, eyebrow, centered = false, light = false, className }: SectionHeadingProps) {
  return (
    <FadeUp className={cn(centered && 'text-center', className)}>
      {eyebrow && (
        <p className="mb-2 sm:mb-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gold break-words">
          {eyebrow}
        </p>
      )}
      <h2
        className="font-serif text-heading font-bold tracking-tight break-words hyphens-auto"
        style={{ color: light ? 'var(--text-primary)' : '#1c1917' }}
      >
        {title}
      </h2>
      {!eyebrow && (
        <div className={`mt-3 h-px w-10 bg-gold ${centered ? 'mx-auto' : ''}`} />
      )}
      {subtitle && (
        <p
          className={`mt-3 sm:mt-4 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl break-words ${centered ? 'mx-auto' : ''}`}
          style={{ color: light ? 'var(--text-muted)' : 'rgb(120 113 108)' }}
        >
          {subtitle}
        </p>
      )}
    </FadeUp>
  )
}
