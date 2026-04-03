import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { siteSettings } from '@/data/site-settings'
import { blogPostDetails } from '@/data/blog-posts'
import { trips } from '@/data/trips'
import { buildMetadata, mergeWithSeoFields, getBaseUrl } from '@/lib/seo'
import { formatDate, blogCategoryLabel } from '@/lib/utils'
import { PageHero } from '@/components/shared/page-hero'
import { PortableTextRenderer } from '@/components/shared/portable-text-renderer'
import { Calendar, User, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InstagramSidebarGallery } from '@/components/blog/instagram-sidebar-gallery'

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

const defaultGallery = [
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80",
  "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80",
  "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80",
  "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=400&q=80",
  "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80",
  "https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=400&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&q=80",
  "https://images.unsplash.com/photo-1549366021-9f1d07c3be09?w=400&q=80",
  "https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=400&q=80",
  "https://images.unsplash.com/photo-1504173010664-32509ceebb18?w=400&q=80",
  "https://images.unsplash.com/photo-1534142499878-f3b1add7b5d1?w=400&q=80",
  "https://images.unsplash.com/photo-1600029801831-29eb510cb101?w=400&q=80"
]

// Map author data for the dynamic sidebar
const AUTHORS_DATA: Record<string, { image: string, bio: string, gallery: string[] }> = {
  'Puur Safaris Team': {
    image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&q=80',
    bio: 'Als team van gepassioneerde safari-experts schrijven wij gezamenlijk artikelen om onze diepgaande kennis over Afrikaanse bestemmingen en wildlife met jullie te delen.',
    gallery: [...defaultGallery].reverse()
  },
  'Sarah de Boer': {
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    bio: 'Na mijn adembenemende ontmoeting met de berggorilla\'s wilde ik niets liever dan dit persoonlijke, intieme verhaal delen om anderen te inspireren deze magische wezens te bezoeken.',
    gallery: [...defaultGallery.slice(2), ...defaultGallery.slice(0, 2)]
  },
  'Mark van Dijk': {
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    bio: 'Mijn reis naar de Okavango Delta veranderde mijn perspectief op de wildernis. Ik besloot deze blog te schrijven om de unieke dynamiek van de Kalahari woestijn te documenteren.',
    gallery: [...defaultGallery.slice(4), ...defaultGallery.slice(0, 4)]
  },
  'Tom Bergman': {
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    bio: 'De Kilimanjaro beklimmen was de grootste fysieke uitdaging van mijn leven. Ik deel dit verhaal om toekomstige klimmers voor te bereiden op wat hen echt te wachten staat.',
    gallery: defaultGallery
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = blogPostDetails[slug]

  if (!post) notFound()

  const baseUrl = getBaseUrl()
  const imageUrl = post.featuredImage?.asset?.url ?? null
  const authorContext = post.author ? AUTHORS_DATA[post.author as keyof typeof AUTHORS_DATA] : undefined

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Article Content */}
          <div className="lg:col-span-8">
            
            {/* Author Introduction Section */}
            {authorContext && (
              <div className="mb-12 p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden border-2 border-gold/20">
                  <Image src={authorContext.image} alt={post.author || 'Auteur'} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] mb-2">
                    Geschreven door {post.author}
                  </h3>
                  <p className="text-[var(--text-muted)] leading-relaxed italic">
                    &quot;{authorContext.bio}&quot;
                  </p>
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
                ← Terug naar alle blogberichten
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
                 Geïnspireerd geraakt door deze reis?
               </h3>
               <p className="relative text-[var(--text-muted)] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                 Wat u in deze blog leest kan ook uw realiteit worden. Wij helpen u graag met het ontwerpen van een volledig gepersonaliseerd avontuur in Afrika.
               </p>
               <Button asChild className="relative bg-gold hover:bg-gold-dark text-white rounded-full px-5 sm:px-8 py-4 sm:py-6 text-sm sm:text-base md:text-lg whitespace-nowrap shadow-lg shadow-gold/20">
                 <Link href="/eigen-reisschema">Stel jouw Droomsafari samen</Link>
               </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="sticky top-32 space-y-8">
               
               {/* Interactive Component */}
               {authorContext && authorContext.gallery.length > 0 && (
                 <InstagramSidebarGallery 
                   authorName={post.author || 'Puur Safaris Team'} 
                   authorImage={authorContext.image} 
                   gallery={authorContext.gallery} 
                 />
               )}

            </div>
          </div>

        </div>
      </div>
    </>
  )
}
