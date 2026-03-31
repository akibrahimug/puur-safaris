import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  max?: number
  className?: string
  size?: 'sm' | 'md'
}

export function StarRating({ rating, max = 5, className, size = 'md' }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'fill-current',
            size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
            i < rating ? 'text-gold' : 'text-stone-300'
          )}
        />
      ))}
    </div>
  )
}
