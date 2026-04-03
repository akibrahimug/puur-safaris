import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

const mockUsePathname = vi.fn(() => '/')

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))

import { Breadcrumbs } from './breadcrumbs'

describe('Breadcrumbs', () => {
  beforeEach(() => {
    mockUsePathname.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it('returns null for homepage', () => {
    mockUsePathname.mockReturnValue('/')
    const { container } = render(<Breadcrumbs />)
    expect(container.innerHTML).toBe('')
  })

  it('renders breadcrumbs for /blog', () => {
    mockUsePathname.mockReturnValue('/blog')
    render(<Breadcrumbs />)
    expect(screen.getByText('Home')).toBeDefined()
    expect(screen.getByText('Blog')).toBeDefined()
  })

  it('renders breadcrumbs for /safari-reizen/my-trip with correct labels', () => {
    mockUsePathname.mockReturnValue('/safari-reizen/my-trip')
    render(<Breadcrumbs />)
    expect(screen.getByText('Home')).toBeDefined()
    expect(screen.getByText('Safari Reizen')).toBeDefined()
    expect(screen.getByText('My Trip')).toBeDefined()
  })

  it('last breadcrumb item is not a link', () => {
    mockUsePathname.mockReturnValue('/blog/my-post')
    render(<Breadcrumbs />)
    const lastCrumb = screen.getByText('My Post')
    expect(lastCrumb.tagName).toBe('SPAN')
    expect(lastCrumb.closest('a')).toBeNull()
  })

  it('title-cases unknown segments with hyphens replaced by spaces', () => {
    mockUsePathname.mockReturnValue('/some-unknown-page')
    render(<Breadcrumbs />)
    expect(screen.getByText('Some Unknown Page')).toBeDefined()
  })
})
