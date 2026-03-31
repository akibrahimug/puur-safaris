import type { Metadata } from 'next'
import { siteSettings } from '@/data/site-settings'
import { blogPosts } from '@/data/blog-posts'
import { buildMetadata } from '@/lib/seo'
import { PageHero } from '@/components/shared/page-hero'
import { BlogCard } from '@/components/blog/blog-card'

export const revalidate = 3600

export function generateMetadata(): Metadata {
  return buildMetadata(
    {
      title: 'Reisblog',
      description: 'Reisverhalen, tips en inspiratie van Puur Safaris. Lees alles over safari avonturen en Afrikaanse bestemmingen.',
      canonical: '/blog',
    },
    siteSettings
  )
}

export default function BlogListPage() {
  return (
    <>
      <PageHero
        title="Reisblog"
        subtitle="Verhalen, tips en inspiratie uit de bush."
      />
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {blogPosts.length === 0 ? (
            <p className="py-20 text-center text-stone-500">Er zijn nog geen blogberichten geplaatst.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              {blogPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
