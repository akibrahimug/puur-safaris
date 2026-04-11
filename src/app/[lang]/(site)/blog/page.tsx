import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { stegaClean } from '@sanity/client/stega'
import { ArrowUpRight, Calendar, User } from 'lucide-react'
import { hasLocale, type Locale, cmsText } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { localePath } from '@/i18n/routes'
import { PageHero } from '@/components/shared/page-hero'
import { BlogCard } from '@/components/blog/blog-card'
import { getSiteSettings, getBlogPosts, getBlogPage } from '@/lib/data'
import { buildMetadata, autoSeo, blogCollectionJsonLd } from '@/lib/seo'
import { formatDate } from '@/lib/utils'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)
  const [settings, blogPage] = await Promise.all([getSiteSettings(lang), getBlogPage(lang)])

  return buildMetadata(
    {
      ...autoSeo(
        { title: blogPage?.heroTitle, subtitle: blogPage?.heroSubtitle, image: blogPage?.heroImage },
        blogPage?.seo,
      ),
      title: blogPage?.heroTitle ?? dict.blog.seoTitle,
      canonical: `/${lang}/blog`,
      locale,
      alternates: { nl: '/nl/blog', en: '/en/blog' },
    },
    settings,
  )
}

export default async function BlogIndexPage({ params }: Props) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang as Locale : 'nl'
  const dict = await getDictionary(locale)

  const [blogPosts, blogPage, settings] = await Promise.all([getBlogPosts(lang), getBlogPage(lang), getSiteSettings(lang)])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cms = <T,>(v: T | null | undefined) => cmsText(v, (blogPage as any)?.language, locale)

  const stories = blogPosts.filter(p => stegaClean(p.category) === 'stories')
  const wildlife = blogPosts.filter(p => stegaClean(p.category) === 'wildlife')
  const guides = blogPosts.filter(p => ['tips', 'guides'].includes(stegaClean(p.category) || ''))

  const featuredStory = stories[0]
  const otherStories = stories.slice(1)

  const collectionSchema = blogCollectionJsonLd(
    blogPosts.map(p => ({ title: p.title, slug: p.slug })),
    locale,
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <PageHero
        title={cms(blogPage?.heroTitle) ?? dict.blog.heroTitle}
        subtitle={cms(blogPage?.heroSubtitle) ?? dict.blog.heroSubtitle}
        image={blogPage?.heroImage ?? blogPosts[0]?.featuredImage}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 space-y-28">

        {/* ── STORIES SECTION: Featured Bento Layout ── */}
        {stories.length > 0 && (
          <section>
             <div className="flex items-center gap-4 mb-10">
               <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-subtle)] to-transparent" />
               <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)]">{cms(blogPage?.storiesSectionHeading) ?? dict.blog.storiesSectionHeading}</h2>
               <div className="flex-1 h-px bg-gradient-to-l from-[var(--border-subtle)] to-transparent" />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Featured Spotlight Card */}
               {featuredStory && (
                 <Link href={`/${locale}/blog/${featuredStory.slug}`} className="lg:col-span-2 group block h-full">
                    <article className="relative h-full min-h-[400px] flex flex-col justify-end p-8 sm:p-12 overflow-hidden rounded-3xl border border-[var(--border-subtle)] group-hover:shadow-2xl transition-all duration-700 ease-out group-hover:-translate-y-1">
                      {featuredStory.featuredImage?.asset?.url && (
                        <Image
                          src={featuredStory.featuredImage.asset.url}
                          alt={featuredStory.featuredImage.alt ?? featuredStory.title}
                          fill
                          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        />
                      )}
                      {/* Gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                      <div className="relative z-10 max-w-2xl">
                         <span className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest bg-gold/90 text-white mb-6 backdrop-blur-md">
                           {cms(blogPage?.featuredBadgeText) ?? dict.blog.featuredBadge}
                         </span>

                         <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4 group-hover:text-gold transition-colors duration-300">
                           {featuredStory.title}
                         </h3>

                         <p className="text-white/80 line-clamp-2 md:line-clamp-3 mb-6 text-sm sm:text-base leading-relaxed">
                           {featuredStory.summary}
                         </p>

                         <div className="flex items-center justify-between text-white/70 text-xs sm:text-sm font-medium">
                           <div className="flex items-center gap-4">
                             <span className="flex items-center gap-1.5">
                               <Calendar className="h-4 w-4 text-gold" />
                               {formatDate(featuredStory.publishedAt)}
                             </span>
                             {featuredStory.author && (
                               <span className="flex items-center gap-1.5 border-l border-white/20 pl-4">
                                 <User className="h-4 w-4 text-gold" />
                                 {featuredStory.author}
                               </span>
                             )}
                           </div>
                           <div className="hidden sm:flex items-center gap-2 group-hover:text-gold transition-colors">
                             <span>{cms(blogPage?.readArticleLabel) ?? dict.blog.readArticle}</span>
                             <div className="p-2 rounded-full bg-white/10 group-hover:bg-gold/20 backdrop-blur-sm transition-all group-hover:translate-x-1">
                               <ArrowUpRight className="h-4 w-4" />
                             </div>
                           </div>
                         </div>
                      </div>
                    </article>
                 </Link>
               )}

               {/* Remaining Stories */}
               <div className="flex flex-col gap-8">
                 {otherStories.map(post => (
                   <BlogCard key={post.slug} post={post} locale={locale} labels={{ readArticleLabel: cms(blogPage?.readArticleLabel) ?? settings?.cardLabels?.readArticleLabel ?? dict.cards.readArticle }} />
                 ))}
               </div>
             </div>
          </section>
        )}


        {/* ── WILDLIFE SECTION: Standard Grid ── */}
        {wildlife.length > 0 && (
          <section>
             <div className="mb-10 text-center">
               <span className="text-gold font-bold tracking-widest text-xs uppercase block mb-2">{cms(blogPage?.wildlifeEyebrow) ?? dict.blog.wildlifeEyebrow}</span>
               <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                 {cms(blogPage?.wildlifeTitle) ?? dict.blog.wildlifeTitle}
               </h2>
               <p className="mt-4 text-[var(--text-muted)] max-w-2xl mx-auto">
                 {cms(blogPage?.wildlifeSubtitle) ?? dict.blog.wildlifeSubtitle}
               </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {wildlife.map(post => (
                 <BlogCard key={post.slug} post={post} locale={locale} labels={{ readArticleLabel: cms(blogPage?.readArticleLabel) ?? settings?.cardLabels?.readArticleLabel ?? dict.cards.readArticle }} />
               ))}
             </div>
          </section>
        )}


        {/* ── GUIDES & TIPS SECTION: Consolidated Landscape ── */}
        {guides.length > 0 && (
          <section className="relative px-6 py-16 sm:py-24 rounded-[3rem] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden shadow-lg shadow-black/5">
             <div className="absolute top-0 right-0 opacity-[0.03] scale-150 -translate-y-1/4 translate-x-1/4">
               <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-primary)]">
                 <path d="M12 2L2 22h20L12 2z"></path>
                 <path d="M12 22V2"></path>
               </svg>
             </div>

             <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                {/* Intro Box */}
                <div className="lg:w-1/3 lg:sticky lg:top-32">
                   <h2 className="font-serif text-3xl font-bold text-[var(--text-primary)] mb-4">
                     {cms(blogPage?.guidesSectionTitle) ?? dict.blog.guidesTitle}
                   </h2>
                   <p className="text-[var(--text-muted)] leading-relaxed mb-8">
                     {cms(blogPage?.guidesDescription) ?? dict.blog.guidesDescription}
                   </p>
                   <Link
                     href={blogPage?.guidesCtaLink ?? localePath(locale, 'contact')}
                     className="inline-flex items-center justify-center rounded-full border-2 border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 font-semibold transition-colors duration-300"
                   >
                     {cms(blogPage?.guidesCtaLabel) ?? dict.blog.guidesCta}
                   </Link>
                </div>

                {/* Guide Cards */}
                <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                   {guides.map(post => (
                     <BlogCard key={post.slug} post={post} locale={locale} labels={{ readArticleLabel: cms(blogPage?.readArticleLabel) ?? settings?.cardLabels?.readArticleLabel ?? dict.cards.readArticle }} />
                   ))}
                </div>
             </div>
          </section>
        )}

        {/* ── CTA TO SUBMIT OWN STORY ── */}
        <section className="relative p-10 sm:p-14 lg:p-20 border-2 border-gold/30 bg-gradient-to-br from-gold/5 to-transparent rounded-[3rem] text-center overflow-hidden flex flex-col items-center group">
          <div className="absolute top-0 right-0 p-8 opacity-20 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="gold" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest border border-gold text-gold mb-6 backdrop-blur-sm">
              {cms(blogPage?.readerCtaBadge) ?? dict.blog.readerCtaBadge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
              {cms(blogPage?.readerCtaHeading) ?? dict.blog.readerCtaHeading}
            </h2>
            <p className="text-lg text-[var(--text-muted)] mb-10 leading-relaxed">
              {cms(blogPage?.readerCtaBody) ?? dict.blog.readerCtaBody}
            </p>
            <Link
              href={localePath(locale, 'blogSubmit')}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-gold text-white px-10 py-4 font-semibold hover:bg-gold-dark hover:-translate-y-1 hover:shadow-xl shadow-gold/20 transition-all duration-300"
            >
              {cms(blogPage?.readerCtaButton) ?? dict.blog.readerCtaButton}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                <path d="M12 19l7-7-7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </Link>
          </div>
        </section>

      </div>
    </>
  )
}
