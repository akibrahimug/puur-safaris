import { describe, it, expect } from 'vitest'
import { render } from '@react-email/render'
import { BlogSubmittedEmail } from './blog-submitted'

describe('BlogSubmittedEmail', () => {
  it('renders the author name and submitted title', async () => {
    const html = await render(
      <BlogSubmittedEmail
        authorName="Sarah de Boer"
        title="Vijf dagen in Queen Elizabeth"
      />,
    )
    expect(html).toContain('Sarah de Boer')
    expect(html).toContain('Vijf dagen in Queen Elizabeth')
  })

  it('shows the three review-step labels', async () => {
    const html = await render(
      <BlogSubmittedEmail authorName="Jan" title="Test" />,
    )
    expect(html).toContain('Ontvangen')
    expect(html).toContain('Beoordeling')
    expect(html).toContain('Publicatie')
  })
})
