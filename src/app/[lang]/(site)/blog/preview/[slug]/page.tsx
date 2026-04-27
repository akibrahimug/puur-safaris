import Link from 'next/link'
import { notFound } from 'next/navigation'
import { hasLocale, type Locale } from '@/i18n/config'
import { localePath } from '@/i18n/routes'
import { getSiteSettings, getBlogPostPreview } from '@/lib/data'
import { formatDate, blogCategoryLabel } from '@/lib/utils'
import { PageHero } from '@/components/shared/page-hero'
import { PortableTextRenderer } from '@/components/shared/portable-text-renderer'
import { Calendar, User, AlertTriangle, ExternalLink } from 'lucide-react'
import { BlogTags } from '@/components/blog/blog-tags'

interface Props {
  params: Promise<{ lang: string; slug: string }>
}

export default async function BlogPreviewPage({ params }: Props) {
  const { slug, lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'

  const [post, settings] = await Promise.all([getBlogPostPreview(slug), getSiteSettings(lang)])
  const labels = settings?.blogDetailLabels

  if (!post) notFound()

  const statusLabels: Record<string, string> = {
    submitted: 'Ingediend',
    pending_review: 'Wacht op beoordeling',
    published: 'Gepubliceerd',
    rejected: 'Afgewezen',
  }

  const statusColors: Record<string, string> = {
    submitted: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    pending_review: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    published: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
    rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  }

  const status = post.status || 'pending_review'
  const studioEditUrl = `/studio/structure/blogPost;${post._id}`

  return (
    <>
      {/* Admin bar */}
      <div className="sticky top-16 z-40 border-b border-amber-200 dark:border-amber-500/20 bg-amber-50/95 dark:bg-amber-500/10 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Preview modus</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status]}`}>
                {statusLabels[status] ?? status}
              </span>
              {post.submitterEmail && (
                <span className="text-xs text-amber-600 dark:text-amber-400">
                  · Ingediend door {post.submitterEmail}
                </span>
              )}
            </div>
          </div>
          <Link
            href={studioEditUrl}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gold text-white hover:bg-gold-dark transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Bewerken in Studio
          </Link>
        </div>
      </div>

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
                <p className="text-sm text-[var(--text-muted)]">{labels?.writtenByLabel}</p>
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
              {labels?.backToAllLabel}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
