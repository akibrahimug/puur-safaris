import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders as a button element by default', () => {
    render(<Button>Click me</Button>)
    const el = screen.getByRole('button', { name: 'Click me' })
    expect(el.tagName).toBe('BUTTON')
  })

  it('renders children', () => {
    render(<Button>Hello</Button>)
    expect(screen.getByText('Hello')).toBeDefined()
  })

  it('supports the disabled prop', () => {
    render(<Button disabled>Disabled</Button>)
    const el = screen.getByRole('button', { name: 'Disabled' })
    expect(el).toHaveProperty('disabled', true)
    expect(el.className).toContain('disabled:opacity-50')
  })

  it('applies outline variant classes', () => {
    render(<Button variant="outline">Outline</Button>)
    const el = screen.getByRole('button', { name: 'Outline' })
    expect(el.className).toContain('border')
    expect(el.className).toContain('text-stone-900')
  })

  it('applies lg size classes', () => {
    render(<Button size="lg">Large</Button>)
    const el = screen.getByRole('button', { name: 'Large' })
    expect(el.className).toContain('h-12')
    expect(el.className).toContain('px-8')
    expect(el.className).toContain('text-base')
  })
})
