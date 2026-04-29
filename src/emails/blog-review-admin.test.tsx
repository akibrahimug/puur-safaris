import { describe, it, expect } from 'vitest'
import { render } from '@react-email/render'
import { BlogReviewAdminEmail } from './blog-review-admin'

describe('BlogReviewAdminEmail', () => {
  it('renders submission metadata, preview link, and studio link', async () => {
    const html = await render(
      <BlogReviewAdminEmail
        authorName="Sarah de Boer"
        authorEmail="sarah@example.com"
        title="Vijf dagen in Queen Elizabeth"
        bookingNumber="PS-2026-A1B2"
        previewUrl="https://www.puurugandareizen.nl/blog/preview/vijf-dagen-in-queen-elizabeth"
        studioUrl="https://www.puurugandareizen.nl/studio/structure/blogPost;abc123"
      />,
    )
    expect(html).toContain('Sarah de Boer')
    expect(html).toContain('sarah@example.com')
    expect(html).toContain('Vijf dagen in Queen Elizabeth')
    expect(html).toContain('PS-2026-A1B2')
    expect(html).toContain('blog/preview/vijf-dagen-in-queen-elizabeth')
    expect(html).toContain('studio/structure/blogPost')
  })
})
