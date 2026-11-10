import { useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock,
  Link2,
  MessageSquare,
} from "lucide-react"

import { getPost, posts } from "../data/posts"
import { useApp } from "../context/AppContext"
import { XIcon } from "../components/SocialIcons"
import { formatDate } from "../utils/format"

function ArticleBlock({ block, isFirst }) {
  if (block.type === "h2") {
    return <h2 className="mt-12 font-display text-[28px] leading-tight text-ink md:text-[32px]">{block.text}</h2>
  }

  if (block.type === "quote") {
    return (
      <blockquote className="my-10 rounded-r-2xl border-l-2 border-gold bg-surface/50 py-5 pl-6 pr-5">
        <p className="font-display text-[22px] italic leading-snug text-cream md:text-[26px]">
          “{block.text}”
        </p>
        {block.cite && (
          <cite className="mt-3 block text-[10px] font-extrabold uppercase not-italic tracking-[0.18em] text-muted">
            — {block.cite}
          </cite>
        )}
      </blockquote>
    )
  }

  if (block.type === "list") {
    return (
      <ul className="mt-6 space-y-3">
        {block.items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[14px] leading-relaxed text-ink/70 md:text-[15px]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            {item}
          </li>
        ))}
      </ul>
    )
  }

  if (block.type === "image") {
    return (
      <figure className="mt-10">
        <img src={block.src} alt={block.caption} loading="lazy" className="w-full rounded-2xl object-cover" />
        {block.caption && (
          <figcaption className="mt-3 text-center text-[11px] font-semibold text-muted">{block.caption}</figcaption>
        )}
      </figure>
    )
  }

  return (
    <p
      className={`mt-6 text-[15px] leading-[1.85] text-ink/70 md:text-base ${
        isFirst
          ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[62px] first-letter:font-medium first-letter:leading-[0.72] first-letter:text-cream"
          : ""
      }`}
    >
      {block.text}
    </p>
  )
}

export default function PostDetail() {
  const { slug } = useParams()
  const post = getPost(slug)
  const { notify } = useApp()
  const [comment, setComment] = useState({ name: "", email: "", message: "" })
  const [commentSent, setCommentSent] = useState(false)

  if (!post) return <Navigate to="/journal" replace />

  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 3)
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareText = encodeURIComponent(post.title)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      notify("Link copied to your clipboard.")
    } catch {
      notify("Copy the link from your address bar.", "info")
    }
  }

  const submitComment = (event) => {
    event.preventDefault()
    if (!comment.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(comment.email) || !comment.message.trim()) {
      notify("Please add your name, a valid email and a comment.", "info")
      return
    }
    setCommentSent(true)
    setComment({ name: "", email: "", message: "" })
    notify("Thank you — your comment is with us.")
  }

  return (
    <>
      <section className="on-dark relative flex min-h-[74vh] items-end overflow-hidden pb-14 pt-40">
        <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover animate-kenburns-slow" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/95 via-forest-deep/75 to-forest-deep/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/10 to-forest-deep/30" />

        <div className="container-x relative z-10 animate-rise">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-[11px] font-bold text-cream/55">
            <Link to="/" className="transition hover:text-gold-soft">
              Home
            </Link>
            <span className="text-cream/25">/</span>
            <Link to="/journal" className="transition hover:text-gold-soft">
              Journal
            </Link>
            <span className="text-cream/25">/</span>
            <span className="text-gold-soft">{post.category}</span>
          </nav>

          <span className="chip-glass">{post.category}</span>
          <h1 className="mt-5 max-w-4xl text-balance text-[clamp(2.3rem,5vw,4.4rem)] text-cream">
            {post.title}
          </h1>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] font-semibold text-cream/65">
            <span className="flex items-center gap-2">
              <img src={post.avatar} alt={post.author} className="h-8 w-8 rounded-full object-cover ring-2 ring-white/20" />
              <span className="font-bold text-cream">{post.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-gold" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gold" />
              {post.read} min read
            </span>
          </div>
        </div>
      </section>

      <article className="section">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <div className="mb-9 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
              <Link to="/journal" className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted transition hover:text-cream">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to journal
              </Link>
              <div className="flex items-center gap-2">
                <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Share</span>
                <button
                  type="button"
                  onClick={copyLink}
                  aria-label="Copy article link"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-cream transition hover:border-gold hover:bg-gold hover:text-night"
                >
                  <Link2 className="h-3.5 w-3.5" />
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share on X"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-cream transition hover:border-gold hover:bg-gold hover:text-night"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {post.content.map((block, index) => (
              <ArticleBlock key={index} block={block} isFirst={index === 0} />
            ))}

            <div className="mt-10 flex flex-wrap gap-2">
              {[post.category, "Slow travel", "Field notes"].map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-5 rounded-card border border-line bg-cream-2 p-6 sm:flex-row sm:items-center">
              <img
                src={post.avatar}
                alt={post.author}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-gold/20"
              />
              <div className="flex-1">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-gold">Written by</p>
                <p className="mt-1 font-display text-[22px] text-ink">{post.author}</p>
                <p className="text-[11px] font-semibold text-muted">{post.role}</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">
                  Part of the small Dream team — collecting routes, recipes and reasons to go back.
                </p>
              </div>
              <Link to="/about" className="btn btn-outline btn-sm shrink-0">
                Meet the team
                <ArrowUpRight />
              </Link>
            </div>

            <div className="mt-14 border-t border-line pt-9">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-gold" />
                <h2 className="font-display text-[28px]">Join the conversation</h2>
              </div>
              <p className="mt-2 text-[13px] text-muted">
                A question, a memory or a place we should know about — we read every note.
              </p>

              {commentSent ? (
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green/20 bg-green/5 px-5 py-4 text-sm font-semibold text-cream">
                  <Check className="h-5 w-5 text-green" />
                  Thank you — your comment is with us.
                </div>
              ) : (
                <form onSubmit={submitComment} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="comment-name" className="field-label">
                        Your name
                      </label>
                      <input
                        id="comment-name"
                        type="text"
                        value={comment.name}
                        onChange={(event) => setComment((prev) => ({ ...prev, name: event.target.value }))}
                        placeholder="Ayesha Khan"
                        className="field-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="comment-email" className="field-label">
                        Email address
                      </label>
                      <input
                        id="comment-email"
                        type="email"
                        value={comment.email}
                        onChange={(event) => setComment((prev) => ({ ...prev, email: event.target.value }))}
                        placeholder="you@example.com"
                        className="field-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="comment-message" className="field-label">
                      Your comment
                    </label>
                    <textarea
                      id="comment-message"
                      rows={4}
                      value={comment.message}
                      onChange={(event) => setComment((prev) => ({ ...prev, message: event.target.value }))}
                      placeholder="Share a thought…"
                      className="field-input resize-none"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Post comment
                    <ArrowUpRight />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </article>

      <section className="section bg-cream-2">
        <div className="container-x">
          <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <span className="eyebrow">Keep reading</span>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.5rem)]">More from the notebook</h2>
            </div>
            <Link to="/journal" className="link-arrow hidden sm:inline-flex">
              All stories
              <ArrowUpRight />
            </Link>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <article key={item.slug} className="group">
                <Link to={`/journal/${item.slug}`} className="block overflow-hidden rounded-card">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[1100ms] group-hover:scale-105"
                  />
                </Link>
                <p className="mt-4 text-[9px] font-extrabold uppercase tracking-[0.14em] text-gold">
                  {item.category} · {formatDate(item.date)}
                </p>
                <h3 className="mt-2 font-display text-[21px] leading-snug">
                  <Link to={`/journal/${item.slug}`} className="transition-colors hover:text-green">
                    {item.title}
                  </Link>
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
