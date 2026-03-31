import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowUpRight } from 'lucide-react'
import { HoverCard } from '@/components/motion/hover-card'
import { formatDate, blogCategoryLabel } from '@/lib/utils'
import type { BlogPostCard } from '@/lib/types'

interface BlogCardProps {
  post: BlogPostCard
}

export function BlogCard({ post }: BlogCardProps) {
  const imageUrl = post.featuredImage?.asset?.url ?? null

  return (
    <HoverCard lift={5} className="h-full">
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full group">
        <article
          className="flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_0_1px_rgba(58,168,118,0.35),0_20px_50px_rgba(0,0,0,0.32)]"
          style={{ background: 'var(--card-strip-bg)' }}
        >
          {/* ── Image zone ────────────────────────────── */}
          <div className="relative h-48 shrink-0 overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={post.featuredImage?.alt ?? post.title}
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
            {post.category && (
              <div className="absolute top-3.5 left-3.5 pointer-events-none group-hover:pointer-events-auto opacity-0 -translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                <span className="rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] backdrop-blur-md"
                  style={{
                    background: 'rgba(12, 7, 30, 0.82)',
                    color: 'rgba(200,190,255,0.9)',
                    border: '1px solid rgba(160,150,240,0.25)',
                  }}>
                  {blogCategoryLabel(post.category)}
                </span>
              </div>
            )}
          </div>

          {/* ── Content zone ─────────────────────────── */}
          <div className="flex flex-col grow">
            {/* Gold accent line */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(to right, rgba(58,168,118,0.5), rgba(58,168,118,0.12) 65%, transparent)',
            }} />

            <div className="flex flex-col grow px-5 pt-4 pb-0">
              {/* Meta */}
              <div className="flex flex-wrap gap-3 mb-3 text-[10px]" style={{ color: 'var(--card-strip-muted)' }}>
                <span className="flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" />
                  {formatDate(post.publishedAt)}
                </span>
                {post.author && (
                  <span className="flex items-center gap-1">
                    <User className="h-2.5 w-2.5" />
                    {post.author}
                  </span>
                )}
              </div>

              <h2 className="font-serif text-[1.03rem] font-semibold leading-snug mb-2.5 transition-colors duration-200 group-hover:text-gold"
                style={{ color: 'var(--card-strip-text)' }}>
                {post.title}
              </h2>

              <p className="text-sm leading-relaxed line-clamp-2 mb-4"
                style={{ color: 'var(--card-strip-muted)' }}>
                {post.summary}
              </p>

              {/* Spacer pushes CTA to bottom */}
              <div className="grow" />
            </div>

            {/* CTA — pinned to bottom */}
            <div className="px-5 pb-5 pt-3">
              <div style={{ height: '1px', background: 'var(--card-strip-border)' }} className="mb-4" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--card-strip-muted)' }}>
                  Lees artikel
                </span>
                <div className="flex items-center gap-1.5 rounded-full px-3.5 py-2 transition-all duration-300 group-hover:bg-gold"
                  style={{ border: '1px solid rgba(58,168,118,0.3)' }}>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: '#3aa876' }} />
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </HoverCard>
  )
}
