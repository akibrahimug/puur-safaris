import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSiteSettings, getBlogPostDetail, getBlogPostSlugs } from '@/lib/data'
import { buildMetadata, mergeWithSeoFields, getBaseUrl, breadcrumbJsonLd } from '@/lib/seo'
import { formatDate, blogCategoryLabel } from '@/lib/utils'
import { PageHero } from '@/components/shared/page-hero'
import { PortableTextRenderer } from '@/components/shared/portable-text-renderer'
import { stegaClean } from '@sanity/client/stega'
import { Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const settings = await getSiteSettings()
  const post = await getBlogPostDetail(slug)

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
    settings
  )
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const [post, settings] = await Promise.all([getBlogPostDetail(slug), getSiteSettings()])
  const labels = settings?.blogDetailLabels

  if (!post) notFound()

  const baseUrl = getBaseUrl()
  const imageUrl = post.featuredImage?.asset?.url || null

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: stegaClean(post.title)!, path: `/blog/${stegaClean(slug)}` },
  ])

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: stegaClean(post.title),
    description: stegaClean(post.summary),
    datePublished: stegaClean(post.publishedAt),
    url: `${baseUrl}/blog/${stegaClean(slug)}`,
    ...(imageUrl && { image: stegaClean(imageUrl) }),
    ...(post.author && {
      author: { '@type': 'Person', name: stegaClean(post.author) },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHero
        title={post.title}
        subtitle={post.summary}
        image={post.featuredImage}
        eyebrow={post.category ? blogCategoryLabel(post.category) : undefined}
      >
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gold" />
            {formatDate(post.publishedAt)}
          </span>
          {post.author && (
            <span className="flex items-center gap-1.5 border-l border-white/20 pl-4">
              <User className="h-4 w-4 text-gold" />
              {post.author}
            </span>
          )}
        </div>
      </PageHero>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">

          {/* Author Introduction */}
          {post.author && (
            <div className="mb-12 p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-center gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-gold/10 flex items-center justify-center">
                <User className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">{labels?.writtenByLabel ?? 'Geschreven door'}</p>
                <p className="font-serif text-lg font-bold text-[var(--text-primary)]">{post.author}</p>
              </div>
            </div>
          )}

          {/* Post Content */}
          {post.content && (
            <div className="prose-container relative z-0">
              <PortableTextRenderer
                value={post.content as unknown[]}
                className="prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-muted)]"
              />
            </div>
          )}

          <div className="mt-16 pb-16 border-b border-[var(--border-subtle)]">
            <Link href="/blog" className="text-gold text-sm font-medium hover:text-gold-dark transition-colors">
              {labels?.backToAllLabel ?? '← Terug naar alle blogberichten'}
            </Link>
          </div>

          {/* Call To Action */}
          <div className="mt-16 p-10 sm:p-14 rounded-3xl border border-gold/20 bg-gold/5 text-center relative overflow-hidden group">
             <div className="absolute -top-16 -right-16 opacity-10 transition-transform duration-700 group-hover:scale-110">
               <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                 <circle cx="12" cy="12" r="10"></circle>
                 <path d="M16.24 7.76l-2.12 2.12"></path>
                 <path d="M14.12 14.12l2.12 2.12"></path>
                 <path d="M7.76 16.24l2.12-2.12"></path>
               </svg>
             </div>
             <h3 className="relative font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
               {labels?.ctaHeading ?? 'Geïnspireerd geraakt door deze reis?'}
             </h3>
             <p className="relative text-[var(--text-muted)] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
               {labels?.ctaBody ?? 'Wat u in deze blog leest kan ook uw realiteit worden. Wij helpen u graag met het ontwerpen van een volledig gepersonaliseerd avontuur in Afrika.'}
             </p>
             <Button asChild className="relative bg-gold hover:bg-gold-dark text-white rounded-full px-5 sm:px-8 py-4 sm:py-6 text-sm sm:text-base md:text-lg whitespace-nowrap shadow-lg shadow-gold/20">
               <Link href="/eigen-reisschema">{labels?.ctaButton ?? 'Stel jouw Droomsafari samen'}</Link>
             </Button>
          </div>

        </div>
      </div>
    </>
  )
}
