import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { siteSettings } from '@/data/site-settings'
import { blogPostDetails } from '@/data/blog-posts'
import { buildMetadata, mergeWithSeoFields, getBaseUrl } from '@/lib/seo'
import { formatDate, blogCategoryLabel } from '@/lib/utils'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PortableTextRenderer } from '@/components/shared/portable-text-renderer'
import { Badge } from '@/components/ui/badge'
import { Calendar, User } from 'lucide-react'

export const revalidate = 600

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return Object.keys(blogPostDetails).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPostDetails[slug]

  if (!post) return {}

  return buildMetadata(
    mergeWithSeoFields(
      {
        title: post.title,
        description: post.summary,
        image: post.featuredImage,
        canonical: `/blog/${slug}`,
        type: 'article',
        publishedTime: post.publishedAt,
      },
      post.seo
    ),
    siteSettings
  )
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = blogPostDetails[slug]

  if (!post) notFound()

  const baseUrl = getBaseUrl()
  const imageUrl = post.featuredImage?.asset?.url ?? null

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    url: `${baseUrl}/blog/${slug}`,
    ...(imageUrl && { image: imageUrl }),
    ...(post.author && {
      author: { '@type': 'Person', name: post.author },
    }),
    publisher: {
      '@type': 'Organization',
      name: 'Puur Safaris',
      url: baseUrl,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs />

        {/* Article header */}
        <header className="mb-8">
          {post.category && (
            <Badge variant="default" className="mb-3">
              {blogCategoryLabel(post.category)}
            </Badge>
          )}
          <h1 className="font-serif text-4xl font-bold text-[var(--text-primary)] leading-tight sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </span>
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            )}
          </div>
          <p className="mt-4 text-lg text-[var(--text-muted)] leading-relaxed">{post.summary}</p>
        </header>

        {/* Hero image */}
        {imageUrl && (
          <div className="relative mb-10 aspect-video overflow-hidden rounded-2xl">
            <Image
              src={imageUrl}
              alt={post.featuredImage?.alt ?? post.title}
              fill
              priority
              className="object-cover"
              placeholder={post.featuredImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
              blurDataURL={post.featuredImage?.asset?.metadata?.lqip}
            />
          </div>
        )}

        {/* Content */}
        {post.content && (
          <PortableTextRenderer value={post.content as unknown[]} className="prose-lg" />
        )}

        <div className="mt-10 pt-6 border-t border-[rgba(42,125,88,0.18)]">
          <Link href="/blog" className="text-gold text-sm font-medium hover:text-gold-dark transition-colors">
            ← Terug naar alle blogberichten
          </Link>
        </div>
      </div>
    </>
  )
}
