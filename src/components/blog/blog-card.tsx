import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowUpRight } from 'lucide-react'
import { stegaClean } from '@sanity/client/stega'
import { localePath } from '@/i18n/routes'
import type { Locale } from '@/i18n/config'
import { HoverCard } from '@/components/motion/hover-card'
import { formatDate, blogCategoryLabel } from '@/lib/utils'
import { BlogTags } from '@/components/blog/blog-tags'
import { sanityImageUrl } from '@/sanity/image'
import type { BlogPostCard } from '@/lib/types'

interface BlogCardProps {
  post: BlogPostCard
  labels?: { readArticleLabel?: string }
  locale?: string
}

export function BlogCard({ post, labels, locale = "nl" }: BlogCardProps) {
  const clean = stegaClean(post)
  const imageUrl = clean.featuredImage?.asset?.url ? sanityImageUrl(clean.featuredImage, 1080) : null

  return (
    <HoverCard lift={5} className="h-full">
      <Link href={localePath(locale as Locale, 'blogDetail', clean.slug)} className="flex flex-col h-full group">
        <article
          className="flex flex-col h-full rounded-3xl overflow-hidden transition-all duration-500 ease-out border border-[var(--border-subtle)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_20px_80px_-15px_rgba(0,0,0,0.15)] group-hover:-translate-y-1"
          style={{ background: 'var(--card-strip-bg)' }}
        >
          {/* ── Image zone ────────────────────────────── */}
          <div className="relative aspect-[16/10] sm:aspect-auto sm:h-56 shrink-0 overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={clean.featuredImage?.alt ?? clean.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="h-full w-full" style={{ background: 'rgba(26,15,5,0.8)' }} />
            )}

            {/* Subtle vignette */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(0,0,0,0.15) 100%)' }} />

            {/* Category badge — appears on hover */}
            {clean.category && (
              <div className="absolute top-4 left-4 pointer-events-none group-hover:pointer-events-auto opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                <span className="rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] backdrop-blur-xl bg-black/40 text-white/95 border border-white/10 shadow-sm">
                  {blogCategoryLabel(clean.category, locale)}
                </span>
              </div>
            )}

            {/* Hero tags */}
            {clean.tags && clean.tags.length > 0 && (
              <div className="absolute bottom-3 left-4">
                <BlogTags tags={clean.tags} placement="hero" variant="hero" />
              </div>
            )}
          </div>

          {/* ── Content zone ─────────────────────────── */}
          <div className="flex flex-col grow">
            {/* Gold accent line */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(to right, rgba(42,125,88,0.5), rgba(42,125,88,0.12) 65%, transparent)',
            }} />

            <div className="flex flex-col grow px-5 pt-4 pb-0">
              {/* Meta */}
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3 text-[11px] sm:text-[10px]" style={{ color: 'var(--card-strip-muted)' }}>
                <span className="flex items-center gap-1 min-w-0">
                  <Calendar className="h-3 w-3 sm:h-2.5 sm:w-2.5 shrink-0" />
                  <span className="truncate">{formatDate(clean.publishedAt, locale)}</span>
                </span>
                {clean.author && (
                  <span className="flex items-center gap-1 min-w-0">
                    <User className="h-3 w-3 sm:h-2.5 sm:w-2.5 shrink-0" />
                    <span className="truncate">{clean.author}</span>
                  </span>
                )}
              </div>

              <h2 className="font-serif text-[1.03rem] font-semibold leading-snug mb-2.5 transition-colors duration-200 group-hover:text-gold line-clamp-2 break-words"
                style={{ color: 'var(--card-strip-text)' }}>
                {clean.title}
              </h2>

              <p className="text-sm leading-relaxed line-clamp-2 mb-3 break-words"
                style={{ color: 'var(--card-strip-muted)' }}>
                {clean.summary}
              </p>

              {/* Sidebar tags */}
              {clean.tags && clean.tags.length > 0 && (
                <div className="mb-3">
                  <BlogTags tags={clean.tags} placement="sidebar" />
                </div>
              )}

              {/* Spacer pushes CTA to bottom */}
              <div className="grow" />
            </div>

            {/* CTA — pinned to bottom */}
            <div className="px-5 pb-5 pt-3">
              <div style={{ height: '1px', background: 'var(--card-strip-border)' }} className="mb-4" />
              <div className="flex items-center justify-between gap-3 min-h-[44px]">
                <span className="text-[11px] font-semibold uppercase tracking-wider break-words" style={{ color: 'var(--card-strip-muted)' }}>
                  {labels?.readArticleLabel}
                </span>
                <div
                  className="flex items-center justify-center shrink-0 h-11 w-11 rounded-full border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-md transition-all duration-500 ease-out group-hover:bg-gold group-hover:border-transparent group-hover:shadow-[0_8px_20px_rgba(42,125,88,0.25)] text-gold group-hover:text-white"
                  aria-hidden="true"
                >
                  <ArrowUpRight className="h-4 w-4 transition-all duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </HoverCard>
  )
}
