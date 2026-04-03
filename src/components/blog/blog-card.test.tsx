import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BlogCard } from './blog-card'

const basePost = {
  _id: 'post-1',
  slug: 'test-post',
  title: 'Test Title',
  summary: 'A summary',
  publishedAt: '2026-06-15',
  author: 'John',
  category: 'tips',
  featuredImage: {
    asset: { _id: 'img-1', url: 'https://example.com/img.jpg', metadata: { dimensions: { width: 800, height: 600, aspectRatio: 1.33 }, lqip: '' } },
    alt: 'Test',
  },
}

describe('BlogCard', () => {
  it('links to /blog/{slug}', () => {
    render(<BlogCard post={basePost} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/blog/test-post')
  })

  it('renders title', () => {
    render(<BlogCard post={basePost} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders formatted date', () => {
    render(<BlogCard post={basePost} />)
    // Dutch formatted date for 2026-06-15 should contain "15" and "juni" and "2026"
    expect(screen.getByText(/15/)).toBeInTheDocument()
  })

  it('renders author when provided', () => {
    render(<BlogCard post={basePost} />)
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('does not render author when not provided', () => {
    const postWithoutAuthor = { ...basePost, author: undefined }
    render(<BlogCard post={postWithoutAuthor} />)
    expect(screen.queryByText('John')).not.toBeInTheDocument()
  })

  it('shows category badge when category exists', () => {
    render(<BlogCard post={basePost} />)
    // 'tips' maps to 'Tips & Advies'
    expect(screen.getByText('Tips & Advies')).toBeInTheDocument()
  })

  it('shows custom readArticleLabel when provided', () => {
    render(<BlogCard post={basePost} labels={{ readArticleLabel: 'Read more' }} />)
    expect(screen.getByText('Read more')).toBeInTheDocument()
  })

  it('defaults to "Lees artikel" label', () => {
    render(<BlogCard post={basePost} />)
    expect(screen.getByText('Lees artikel')).toBeInTheDocument()
  })
})
