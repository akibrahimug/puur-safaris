import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-6 leading-relaxed text-[var(--text-muted)]">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-10 mb-5 font-serif text-3xl font-bold text-[var(--text-primary)]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-4 font-serif text-xl font-semibold text-[var(--text-primary)]">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-gold pl-6 py-2 italic text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-r-lg">
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
        className="text-gold font-medium underline underline-offset-4 hover:text-gold-dark transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-8 ml-5 list-disc space-y-2 text-[var(--text-muted)] marker:text-gold">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-8 ml-5 list-decimal space-y-2 text-[var(--text-muted)] marker:text-gold">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed pl-2">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed pl-2">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      const imageUrl = value?.asset?.url ?? null
      if (!imageUrl) return null
      return (
        <figure className="my-10">
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-[var(--border-subtle)] shadow-sm">
            <Image
              src={imageUrl}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-3 text-center text-sm text-[var(--text-subtle)] italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    imageGrid: ({ value }) => {
      const images = value?.images ?? []
      if (images.length === 0) return null
      
      const gridCols = images.length === 1 ? 'grid-cols-1' : (images.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3')
      
      return (
        <figure className="my-12">
          <div className={`grid gap-4 ${gridCols}`}>
            {images.map((img: any, idx: number) => (
              <div key={idx} className="relative aspect-square sm:aspect-[4/3] overflow-hidden rounded-3xl border border-[var(--border-subtle)] shadow-sm group">
                <Image
                  src={img.asset?.url}
                  alt={img.alt ?? ''}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
          {value.caption && (
            <figcaption className="mt-4 text-center text-sm text-[var(--text-subtle)] italic">
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
    <div className={className}>
      <PortableText value={value as Parameters<typeof PortableText>[0]['value']} components={components} />
    </div>
  )
}
