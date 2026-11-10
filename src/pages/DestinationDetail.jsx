import { useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  Minus,
  Plus,
  Star,
  Users,
  X,
} from "lucide-react"

import TourCard from "../components/TourCard"
import BookingWidget from "../components/BookingWidget"
import DestinationCard from "../components/DestinationCard"
import DynamicIcon from "../utils/icons"
import { getDestination, destinations } from "../data/destinations"
import { tours } from "../data/tours"
import { excluded, included, testimonials } from "../data/site"
import { useApp } from "../context/AppContext"
import { cx } from "../utils/format"

export default function DestinationDetail() {
  const { id } = useParams()
  const destination = getDestination(id)
  const { isFavorite, toggleFavorite } = useApp()
  const [openDay, setOpenDay] = useState(1)

  if (!destination) return <Navigate to="/destinations" replace />

  const saved = isFavorite(destination.id)
  const relatedTours = tours.filter((tour) => tour.destId === destination.id)
  const relatedDestinations = destinations
    .filter((item) => item.id !== destination.id && item.region === destination.region)
    .slice(0, 3)
  const fallbackDestinations = destinations.filter(
    (item) => item.id !== destination.id && item.region !== destination.region,
  )
  const suggestions = relatedDestinations.length >= 3
    ? relatedDestinations
    : [...relatedDestinations, ...fallbackDestinations.slice(0, 3 - relatedDestinations.length)]
  const guest = testimonials[0]

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="on-dark relative flex min-h-[82vh] items-end overflow-hidden pb-14 pt-40">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 h-full w-full object-cover animate-kenburns-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/95 via-forest-deep/70 to-forest-deep/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-forest-deep/25" />

        <div className="container-x relative z-10 animate-rise">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-2 text-[11px] font-bold text-cream/55"
          >
            <Link to="/" className="transition hover:text-gold-soft">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/destinations" className="transition hover:text-gold-soft">
              Destinations
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gold-soft">{destination.name}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="chip-glass">
              <MapPin className="h-3 w-3" />
              {destination.country}
            </span>
            {destination.badge && (
              <span className="rounded-full bg-gold px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-night">
                {destination.badge}
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-4xl text-balance text-[clamp(2.8rem,6vw,5rem)] text-cream">
            {destination.name}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-cream/70 md:text-[17px]">
            {destination.tagline}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-bold text-cream/70">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-current text-gold" />
              {destination.rating.toFixed(1)}
              <span className="font-semibold text-cream/50">({destination.reviews} reviews)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gold" />
              {destination.days} days · {destination.nights} nights
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-gold" />
              {destination.bestTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-gold" />
              {destination.groupSize}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleFavorite(destination.id, destination.name)}
          aria-pressed={saved}
          className={cx(
            "absolute right-5 top-24 z-20 flex items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-extrabold backdrop-blur-md transition duration-300 md:right-8 md:top-28",
            saved
              ? "border-gold bg-gold text-night"
              : "border-white/25 bg-white/10 text-cream hover:bg-white/20",
          )}
        >
          <Heart className={cx("h-4 w-4", saved && "fill-current")} />
          {saved ? "Saved" : "Save"}
        </button>
      </section>

      {/* ---------------- Body ---------------- */}
      <section className="section">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {destination.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
                <span className="chip">
                  <MapPin className="h-3 w-3 text-gold" />
                  {destination.coords}
                </span>
              </div>

              <span className="eyebrow mt-8">The journey</span>
              <h2 className="mt-4 text-balance text-[clamp(1.9rem,3.4vw,2.8rem)]">
                Why we love <em className="font-light italic text-green">{destination.name}.</em>
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-[1.85] text-ink/70">
                {destination.description.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>

              {/* Highlights */}
              <div className="mt-12">
                <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
                  <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.1rem)]">Trip highlights</h2>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted">
                    Included
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {destination.highlights.map((highlight) => (
                    <div
                      key={highlight.title}
                      className="group rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-soft"
                    >
                      <span className="icon-round h-10 w-10">
                        <DynamicIcon name={highlight.icon} className="h-[18px] w-[18px]" />
                      </span>
                      <h3 className="mt-4 font-sans text-[13px] font-extrabold text-ink">
                        {highlight.title}
                      </h3>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{highlight.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div className="mt-12">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {destination.gallery.map((image, index) => (
                    <div key={image} className="overflow-hidden rounded-2xl">
                      <img
                        src={image}
                        alt={`${destination.name} — view ${index + 1}`}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              <div className="mt-14">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <span className="eyebrow">Day by day</span>
                    <h2 className="mt-3 font-display text-[clamp(1.7rem,2.8vw,2.3rem)]">
                      Your {destination.days}-day itinerary
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold text-muted">
                    {destination.nights} nights · {destination.groupSize}
                  </span>
                </div>

                <div className="mt-4 divide-y divide-line">
                  {destination.itinerary.map((day) => {
                    const open = openDay === day.day
                    return (
                      <div key={day.day}>
                        <button
                          type="button"
                          onClick={() => setOpenDay(open ? -1 : day.day)}
                          aria-expanded={open}
                          className="group flex w-full items-center gap-4 py-5 text-left"
                        >
                          <span
                            className={cx(
                              "flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-full text-[9px] font-extrabold uppercase tracking-[0.08em] transition-colors",
                              open ? "bg-gold text-night" : "bg-cream/5 text-cream",
                            )}
                          >
                            <span className="text-[8px]">Day</span>
                            <span className="text-[14px] leading-none">{day.day}</span>
                          </span>
                          <span className="flex-1 pr-2">
                            <span
                              className={cx(
                                "block font-display text-[19px] leading-snug transition-colors md:text-[21px]",
                                open ? "text-cream" : "text-ink group-hover:text-green",
                              )}
                            >
                              {day.title}
                            </span>
                            <span
                              className={cx(
                                "mt-1 block text-[13px] leading-relaxed text-muted transition-all",
                                open ? "block" : "hidden sm:block",
                              )}
                            >
                              {day.text}
                            </span>
                          </span>
                          <span
                            className={cx(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                              open
                                ? "border-gold bg-gold text-night"
                                : "border-line text-cream group-hover:border-cream/30",
                            )}
                          >
                            {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </span>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Included / excluded */}
              <div className="mt-14 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-surface p-6">
                  <h3 className="flex items-center gap-2 font-sans text-[13px] font-extrabold uppercase tracking-[0.12em] text-cream">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green/10 text-green">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    What is included
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {included.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[12px] font-semibold text-ink/70">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" strokeWidth={3} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-line bg-cream-2 p-6">
                  <h3 className="flex items-center gap-2 font-sans text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink/70">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-clay/10 text-clay">
                      <X className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    Not included
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {excluded.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[12px] font-semibold text-ink/70">
                        <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-clay/70" strokeWidth={3} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Guest quote */}
              <figure className="on-dark relative mt-10 overflow-hidden rounded-[26px] bg-forest px-7 py-9 text-cream md:px-10">
                <div
                  className="pointer-events-none absolute -right-10 -top-14 h-[220px] w-[220px] rounded-full bg-gold/15 blur-[70px]"
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="flex gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-4 font-display text-[21px] leading-snug text-cream md:text-[25px]">
                    “{guest.quote}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <img src={guest.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="text-[12px] font-extrabold text-cream">{guest.name}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-cream/65">
                        {guest.trip}
                      </p>
                    </div>
                  </figcaption>
                </div>
              </figure>
            </div>

            <BookingWidget destination={destination} />
          </div>
        </div>
      </section>

      {/* Tours for this destination */}
      {relatedTours.length > 0 && (
        <section className="section border-t border-line bg-cream-2">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">Signature journeys</span>
                <h2 className="mt-3 text-balance text-[clamp(1.7rem,3vw,2.5rem)]">
                  Ready-made trips to <em className="font-light italic text-green">{destination.name}.</em>
                </h2>
              </div>
              <Link to="/tours" className="link-arrow">
                All tours
                <ArrowUpRight />
              </Link>
            </div>

            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTours.map((tour, index) => (
                <TourCard key={tour.id} tour={tour} delay={index * 70} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related destinations */}
      <section className="section">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Keep dreaming</span>
              <h2 className="mt-3 text-balance text-[clamp(1.7rem,3vw,2.5rem)]">
                You might also <em className="font-light italic text-green">love.</em>
              </h2>
            </div>
            <Link to="/destinations" className="link-arrow">
              All destinations
              <ArrowUpRight />
            </Link>
          </div>

          <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((item, index) => (
              <DestinationCard key={item.id} destination={item} delay={index * 70} />
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted transition hover:text-cream"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to all destinations
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
