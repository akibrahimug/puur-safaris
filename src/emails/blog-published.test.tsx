import { describe, it, expect } from 'vitest'
import { render } from '@react-email/render'
import { BlogPublishedEmail } from './blog-published'

describe('BlogPublishedEmail', () => {
  it('renders the article title and a link to the published blog post', async () => {
    const html = await render(
      <BlogPublishedEmail
        title="Mijn safari avontuur in Bwindi"
        blogUrl="https://www.puurugandareizen.nl/blog/mijn-safari-avontuur"
      />,
    )
    expect(html).toContain('Mijn safari avontuur in Bwindi')
    expect(html).toContain('https://www.puurugandareizen.nl/blog/mijn-safari-avontuur')
    expect(html).toContain('gepubliceerd')
  })
})
