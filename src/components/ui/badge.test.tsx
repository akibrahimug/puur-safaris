import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeDefined()
  })

  it('applies default variant classes', () => {
    render(<Badge>Default</Badge>)
    const el = screen.getByText('Default')
    expect(el.className).toContain('text-gold-dark')
    expect(el.className).toContain('rounded-full')
  })

  it('applies secondary variant classes', () => {
    render(<Badge variant="secondary">Secondary</Badge>)
    const el = screen.getByText('Secondary')
    expect(el.className).toContain('bg-stone-100')
    expect(el.className).toContain('text-stone-800')
  })

  it('applies outline variant classes', () => {
    render(<Badge variant="outline">Outline</Badge>)
    const el = screen.getByText('Outline')
    expect(el.className).toContain('border-gold')
    expect(el.className).toContain('text-gold')
  })

  it('applies success variant classes', () => {
    render(<Badge variant="success">Success</Badge>)
    const el = screen.getByText('Success')
    expect(el.className).toContain('bg-green-100')
    expect(el.className).toContain('text-green-800')
  })

  it('applies destructive variant classes', () => {
    render(<Badge variant="destructive">Error</Badge>)
    const el = screen.getByText('Error')
    expect(el.className).toContain('bg-red-100')
    expect(el.className).toContain('text-red-800')
  })

  it('merges custom className', () => {
    render(<Badge className="my-custom-class">Custom</Badge>)
    const el = screen.getByText('Custom')
    expect(el.className).toContain('my-custom-class')
  })
})
