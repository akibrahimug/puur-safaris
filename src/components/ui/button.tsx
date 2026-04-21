import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-sm active:scale-[0.97] [-webkit-tap-highlight-color:transparent] select-none',
  {
    variants: {
      variant: {
        default: 'bg-gold text-white hover:bg-gold-dark hover:shadow-[0_0_32px_rgba(42,125,88,0.35)] active:bg-gold-dark',
        outline: 'border border-stone-900/20 text-stone-900 hover:bg-stone-900 hover:text-white hover:border-stone-900 active:bg-stone-900 active:text-white',
        ghost: 'text-stone-700 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200',
        secondary: 'bg-stone-900 text-white hover:bg-stone-800 active:bg-stone-700',
        glass: 'border border-[rgba(42,125,88,0.35)] bg-[rgba(42,125,88,0.08)] text-gold hover:bg-[rgba(42,125,88,0.16)] hover:border-[rgba(42,125,88,0.55)] active:bg-[rgba(42,125,88,0.2)]',
        link: 'text-gold underline-offset-4 hover:underline active:underline p-0 h-auto active:scale-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        default: 'h-11 px-6',
        lg: 'h-12 px-8 text-base',
        icon: 'h-11 w-11 min-h-[44px] min-w-[44px] rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
