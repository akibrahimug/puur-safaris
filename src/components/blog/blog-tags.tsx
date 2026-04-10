import type { BlogTag } from '@/lib/types'

const colorMap: Record<string, string> = {
  gold: 'bg-gold/10 text-gold border-gold/20',
  green: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
  blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
  red: 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400',
  neutral: 'bg-stone-500/10 text-stone-600 border-stone-500/20 dark:text-stone-400',
}

interface BlogTagsProps {
  tags: BlogTag[]
  placement: BlogTag['placement']
  variant?: 'default' | 'hero'
}

export function BlogTags({ tags, placement, variant = 'default' }: BlogTagsProps) {
  const filtered = tags.filter((t) => t.placement === placement)
  if (filtered.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {filtered.map((tag, i) => (
        <span
          key={i}
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${
            variant === 'hero'
              ? 'backdrop-blur-xl bg-black/30 text-white/90 border-white/15'
              : colorMap[tag.color ?? 'gold'] ?? colorMap.gold
          }`}
        >
          {tag.label}
        </span>
      ))}
    </div>
  )
}
