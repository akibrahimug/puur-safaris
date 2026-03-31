import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 leading-relaxed text-(--text-muted)">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-8 mb-4 font-serif text-2xl font-bold text-(--text-primary)">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 font-serif text-xl font-semibold text-(--text-primary)">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-gold pl-5 italic text-(--text-muted)">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-(--text-primary)">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.openInNewTab ? '_blank' : undefined}
        rel={value?.openInNewTab ? 'noopener noreferrer' : undefined}
        className="text-gold underline underline-offset-2 hover:text-gold-dark transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 ml-5 list-disc space-y-1 text-(--text-muted)">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 ml-5 list-decimal space-y-1 text-(--text-muted)">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      const imageUrl = value?.asset?.url ?? null
      if (!imageUrl) return null
      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <Image
              src={imageUrl}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-(--text-subtle) italic">
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
