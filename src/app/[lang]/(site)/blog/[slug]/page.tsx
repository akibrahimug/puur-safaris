import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { hasLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { localePath } from '@/i18n/routes'
import { getSiteSettings, getBlogPostDetail, getBlogPostSlugs } from '@/lib/data'
import { buildMetadata, autoSeo, breadcrumbJsonLd, blogArticleJsonLd } from '@/lib/seo'
import { formatDate, blogCategoryLabel } from '@/lib/utils'
import { PageHero } from '@/components/shared/page-hero'
import { PortableTextRenderer } from '@/components/shared/portable-text-renderer'
import { stegaClean } from '@sanity/client/stega'
import { Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BlogTags } from '@/components/blog/blog-tags'

interface Props {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const settings = await getSiteSettings(lang)
  const post = await getBlogPostDetail(slug, lang)

  if (!post) return {}

  return buildMetadata(
    {
      ...autoSeo(
        { title: post.title, subtitle: post.summary, image: post.featuredImage },
        post.seo,
      ),
      canonical: `/${lang}/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      locale,
      alternates: { nl: `/nl/blog/${slug}`, en: `/en/blog/${slug}` },
    },
    settings,
  )
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug, lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)

  const [post, settings] = await Promise.all([getBlogPostDetail(slug, lang), getSiteSettings(lang)])
  const labels = settings?.blogDetailLabels

  if (!post) notFound()

  const imageUrl = post.featuredImage?.asset?.url || null

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: dict.common.home, path: `/${lang}` },
    { name: dict.nav.blog, path: `/${lang}/blog` },
    { name: stegaClean(post.title)!, path: `/${lang}/blog/${stegaClean(slug)}` },
  ])

  const articleSchema = blogArticleJsonLd({
    title: post.title,
    summary: post.summary,
    author: post.author,
    publishedAt: post.publishedAt,
    slug: stegaClean(slug)!,
    imageUrl,
    locale,
  })

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
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4">
            <BlogTags tags={post.tags} placement="hero" variant="hero" />
          </div>
        )}
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
                <p className="text-sm text-[var(--text-muted)]">{labels?.writtenByLabel ?? dict.blogDetail.writtenBy}</p>
                <p className="font-serif text-lg font-bold text-[var(--text-primary)]">{post.author}</p>
              </div>
            </div>
          )}

          {/* Sidebar tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8">
              <BlogTags tags={post.tags} placement="sidebar" />
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

          {/* Bottom tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[var(--border-subtle)]">
              <BlogTags tags={post.tags} placement="bottom" />
            </div>
          )}

          <div className="mt-16 pb-16 border-b border-[var(--border-subtle)]">
            <Link href={localePath(locale, 'blog')} className="text-gold text-sm font-medium hover:text-gold-dark transition-colors">
              {labels?.backToAllLabel ?? dict.blogDetail.backToAll}
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
               {labels?.ctaHeading ?? dict.blogDetail.ctaHeading}
             </h3>
             <p className="relative text-[var(--text-muted)] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
               {labels?.ctaBody ?? dict.blogDetail.ctaBody}
             </p>
             <Button asChild className="relative bg-gold hover:bg-gold-dark text-white rounded-full px-5 sm:px-8 py-4 sm:py-6 text-sm sm:text-base md:text-lg whitespace-nowrap shadow-lg shadow-gold/20">
               <Link href={localePath(locale, 'customItinerary')}>{labels?.ctaButton ?? dict.blogDetail.ctaButton}</Link>
             </Button>
          </div>

        </div>
      </div>
    </>
  )
}
