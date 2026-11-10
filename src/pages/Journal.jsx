import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight, Clock, PenLine } from "lucide-react"

import PageHero from "../components/PageHero"
import NewsletterCta from "../components/NewsletterCta"
import { posts, postCategories } from "../data/posts"
import { cx, formatDate } from "../utils/format"

function PostCard({ post, delay = 0 }) {
  return (
    <article className="group" data-reveal style={{ transitionDelay: `${delay}ms` }}>
      <Link to={`/journal/${post.slug}`} className="block overflow-hidden rounded-card">
        <div className="relative overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-[1100ms] group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-night">
            {post.category}
          </span>
        </div>
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em]">
        <span className="text-muted">{formatDate(post.date)}</span>
        <span className="text-line">•</span>
        <span className="flex items-center gap-1 text-muted">
          <Clock className="h-3 w-3 text-gold" />
          {post.read} min read
        </span>
      </div>
      <h3 className="mt-2.5 font-display text-[23px] leading-snug">
        <Link to={`/journal/${post.slug}`} className="transition-colors hover:text-green">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{post.excerpt}</p>
      <div className="mt-4 flex items-center gap-2.5">
        <img src={post.avatar} alt={post.author} className="h-7 w-7 rounded-full object-cover" />
        <span className="text-[11px] font-bold text-ink/70">{post.author}</span>
      </div>
    </article>
  )
}

export default function Journal() {
  const [category, setCategory] = useState("All")
  const featured = posts.find((post) => post.featured) || posts[0]

  const visible = useMemo(() => {
    if (category === "All") return posts.filter((post) => post.slug !== featured.slug)
    return posts.filter((post) => post.category === category)
  }, [category, featured.slug])

  return (
    <>
      <PageHero
        label="Journal"
        eyebrow="Notes from the road"
        title={
          <>
            Field notes & <em className="font-light italic text-gold-soft">slow stories.</em>
          </>
        }
        subtitle="Practical guides, quiet observations and the people we meet along the way — written by the team and our guests."
        image="/images/blog-3.jpg"
      />

      <section className="section pb-10">
        <div className="container-x">
          <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <span className="eyebrow">Editor's pick</span>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.5rem)]">The one to read first</h2>
            </div>
            <PenLine className="hidden h-6 w-6 text-gold sm:block" />
          </div>

          <article className="mt-8 grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <Link to={`/journal/${featured.slug}`} className="group block overflow-hidden rounded-[26px]" data-reveal>
              <div className="relative overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/40 via-transparent to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-gold px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-night">
                  {featured.category}
                </span>
              </div>
            </Link>

            <div data-reveal style={{ transitionDelay: "90ms" }}>
              <div className="flex flex-wrap items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em]">
                <span className="text-gold">{featured.category}</span>
                <span className="text-line">•</span>
                <span className="text-muted">{formatDate(featured.date)}</span>
                <span className="text-line">•</span>
                <span className="text-muted">{featured.read} min read</span>
              </div>
              <h3 className="mt-3 text-balance font-display text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.1]">
                <Link to={`/journal/${featured.slug}`} className="transition-colors hover:text-green">
                  {featured.title}
                </Link>
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted md:text-[15px]">{featured.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-3">
                  <img
                    src={featured.avatar}
                    alt={featured.author}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-gold/25"
                  />
                  <div>
                    <p className="text-[12px] font-extrabold text-ink">{featured.author}</p>
                    <p className="text-[10px] font-semibold text-muted">{featured.role}</p>
                  </div>
                </div>
                <Link to={`/journal/${featured.slug}`} className="btn btn-primary btn-sm ml-auto">
                  Read the story
                  <ArrowUpRight />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container-x">
          <div className="flex flex-col gap-5 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">All stories</span>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.5rem)]">From the notebook</h2>
            </div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {postCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cx(
                    "shrink-0 rounded-full px-3.5 py-2 text-[11px] font-extrabold transition-all duration-300",
                    category === item
                      ? "bg-gold text-night shadow-sm"
                      : "bg-surface text-ink/70 ring-1 ring-line hover:bg-cream/5 hover:text-cream",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {visible.length > 0 ? (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((post, index) => (
                <PostCard key={post.slug} post={post} delay={(index % 3) * 70} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-muted">
              No stories in this category yet. Try another one.
            </p>
          )}
        </div>
      </section>

      <NewsletterCta />
    </>
  )
}
