import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 sm:mb-6 leading-relaxed text-[var(--text-muted)] break-words">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 sm:mt-10 mb-4 sm:mb-5 font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)] break-words">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 sm:mt-8 mb-3 sm:mb-4 font-serif text-lg sm:text-xl font-semibold text-[var(--text-primary)] break-words">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-3 font-serif text-base sm:text-lg font-semibold text-[var(--text-primary)] break-words">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 sm:my-8 border-l-4 border-gold pl-4 sm:pl-6 py-2 italic text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.openInNewTab ? '_blank' : undefined}
        rel={value?.openInNewTab ? 'noopener noreferrer' : undefined}
        className="text-gold font-medium underline underline-offset-4 hover:text-gold-dark transition-colors break-words"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 sm:mb-8 ml-5 sm:ml-6 list-disc space-y-2 text-[var(--text-muted)] marker:text-gold">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 sm:mb-8 ml-5 sm:ml-6 list-decimal space-y-2 text-[var(--text-muted)] marker:text-gold">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed pl-1 sm:pl-2 break-words">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed pl-1 sm:pl-2 break-words">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      const imageUrl = value?.asset?.url || null
      if (!imageUrl) return null
      return (
        <figure className="my-8 sm:my-10">
          <div className="relative aspect-video overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--border-subtle)] shadow-sm">
            <Image
              src={imageUrl}
              alt={value.alt ?? ''}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-3 text-center text-xs sm:text-sm text-[var(--text-subtle)] italic break-words">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    imageGrid: ({ value }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const images = (value?.images ?? []).filter((img: any) => img.asset?.url)
      if (images.length === 0) return null

      const gridCols = images.length === 1 ? 'grid-cols-1' : (images.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3')

      return (
        <figure className="my-8 sm:my-12">
          <div className={`grid gap-3 sm:gap-4 ${gridCols}`}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {images.map((img: any, idx: number) => (
              <div key={idx} className="relative aspect-square sm:aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--border-subtle)] shadow-sm group">
                <Image
                  src={img.asset.url}
                  alt={img.alt ?? ''}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
          {value.caption && (
            <figcaption className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-[var(--text-subtle)] italic break-words">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

interface PortableTextRendererProps {
  value: unknown[]
  className?: string
}

export function PortableTextRenderer({ value, className }: PortableTextRendererProps) {
  return (
    <div
      className={`portable-text break-words [&_img]:max-w-full [&_img]:h-auto [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_pre]:text-sm [&_code]:break-words [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto ${className ?? ''}`}
    >
      <PortableText value={value as Parameters<typeof PortableText>[0]['value']} components={components} />
    </div>
  )
}
