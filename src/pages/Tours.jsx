import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  ArrowUpRight,
  CalendarDays,
  Compass,
  Headset,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react"

import PageHero from "../components/PageHero"
import TourCard from "../components/TourCard"
import Accordion from "../components/Accordion"
import SectionHeading from "../components/SectionHeading"
import { tours, tourCategories } from "../data/tours"
import { destinations, getDestination } from "../data/destinations"
import { faqs } from "../data/site"
import { cx } from "../utils/format"

export default function Tours() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [destination, setDestination] = useState(searchParams.get("destination") || "All")
  const [category, setCategory] = useState(searchParams.get("category") || "All")
  const [sort, setSort] = useState("recommended")
  const guests = searchParams.get("guests")

  useEffect(() => {
    const next = new URLSearchParams()
    if (destination !== "All") next.set("destination", destination)
    if (category !== "All") next.set("category", category)
    if (guests) next.set("guests", guests)
    setSearchParams(next, { replace: true })
  }, [destination, category, guests, setSearchParams])

  const filtered = useMemo(() => {
    const result = tours.filter((tour) => {
      const matchesDestination = destination === "All" || tour.destId === destination
      const matchesCategory = category === "All" || tour.category === category
      return matchesDestination && matchesCategory
    })

    switch (sort) {
      case "price-low":
        return [...result].sort((a, b) => a.price - b.price)
      case "price-high":
        return [...result].sort((a, b) => b.price - a.price)
      case "rating":
        return [...result].sort((a, b) => b.rating - a.rating)
      case "duration":
        return [...result].sort((a, b) => b.days - a.days)
      default:
        return result
    }
  }, [destination, category, sort])

  const activeDestination = destination !== "All" ? getDestination(destination) : null
  const hasFilters = destination !== "All" || category !== "All"
  const reset = () => {
    setDestination("All")
    setCategory("All")
    setSort("recommended")
  }

  return (
    <>
      <PageHero
        label="Tours"
        eyebrow="Signature journeys"
        title={
          <>
            Journeys worth the <em className="font-light italic text-gold-soft">detour.</em>
          </>
        }
        subtitle="Small departures, carefully paced routes and the kind of details that turn a holiday into a story. Every journey below can also be made private."
        image="/images/dest-switzerland.jpg"
      />

      <section className="relative z-20 -mt-10 pb-4">
        <div className="container-x">
          <div className="rounded-card border border-line bg-surface p-4 shadow-soft md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
                <label htmlFor="tour-destination" className="sr-only">
                  Filter by destination
                </label>
                <select
                  id="tour-destination"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-line bg-surface py-3.5 pl-10 pr-4 text-[12px] font-bold text-ink outline-none transition focus:border-gold"
                >
                  <option value="All">All destinations</option>
                  {destinations.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}, {item.country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative flex-1">
                <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
                <label htmlFor="tour-sort" className="sr-only">
                  Sort tours
                </label>
                <select
                  id="tour-sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-line bg-surface py-3.5 pl-10 pr-4 text-[12px] font-bold text-ink outline-none transition focus:border-gold"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="rating">Highest rated</option>
                  <option value="duration">Longest journey</option>
                </select>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-3.5 text-[11px] font-extrabold text-muted transition hover:border-clay/40 hover:text-clay"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear filters
                </button>
              )}
            </div>

            <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto border-t border-line pt-4">
              {tourCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cx(
                    "shrink-0 rounded-full px-4 py-2 text-[11px] font-extrabold transition-all duration-300",
                    category === item
                      ? "bg-gold text-night shadow-sm"
                      : "bg-surface text-ink/70 hover:bg-cream/5 hover:text-cream",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
              {filtered.length} {filtered.length === 1 ? "journey" : "journeys"} found
              {activeDestination && <span className="text-cream"> · {activeDestination.name}</span>}
            </p>

            {guests && (
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                <Users className="h-3.5 w-3.5 text-gold" />
                Planning for {guests} {Number(guests) === 1 ? "traveller" : "travellers"} —{" "}
                <Link to="/contact" className="font-extrabold text-cream underline-gold">
                  ask us for a private quote
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="pb-20 pt-6 md:pb-24">
        <div className="container-x">
          <h2 className="sr-only">All tours</h2>
          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((tour, index) => (
                <TourCard key={tour.id} tour={tour} delay={(index % 3) * 70} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-surface/60 px-6 py-20 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/5 text-cream">
                <Compass className="h-7 w-7" />
              </span>
              <h2 className="mt-5 font-display text-3xl">No journeys match those filters.</h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                Try another travel style, or let us build something around your dates instead.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={reset} className="btn btn-outline">
                  Reset filters
                </button>
                <Link to="/booking" className="btn btn-primary">
                  Design a private trip
                </Link>
              </div>
            </div>
          )}

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Users, title: "Small groups", text: "Never more than twelve guests on any departure." },
              { Icon: Compass, title: "Local guides", text: "People who call the place home, not script-readers." },
              { Icon: ShieldCheck, title: "Flexible booking", text: "Free date changes up to 30 days before you fly." },
              { Icon: Headset, title: "Human support", text: "A real person on call, before and during your trip." },
            ].map(({ Icon, title, text }, index) => (
              <div
                key={title}
                data-reveal
                style={{ transitionDelay: `${index * 60}ms` }}
                className="rounded-card border border-line bg-surface p-5"
              >
                <Icon className="h-5 w-5 text-gold" />
                <h3 className="mt-4 font-sans text-sm font-extrabold text-ink">{title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream-2">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div data-reveal>
            <span className="eyebrow">Good to know</span>
            <h2 className="mt-4 text-balance text-[clamp(2rem,3.6vw,3rem)]">
              Questions, <em className="font-light italic text-green">answered.</em>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Everything you need before you book. If your question is not here, our team is a phone call
              away.
            </p>
            <div className="mt-7 rounded-2xl border border-line bg-surface p-5">
              <p className="flex items-center gap-2 text-sm font-extrabold text-ink">
                <CalendarDays className="h-4 w-4 text-gold" />
                Need a bespoke date?
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                Most of our journeys can run privately on dates that suit you.
              </p>
              <Link to="/contact" className="link-arrow mt-3">
                Ask a designer
                <ArrowUpRight />
              </Link>
            </div>
          </div>

          <div data-reveal style={{ transitionDelay: "100ms" }}>
            <Accordion items={faqs.slice(0, 4).map((faq) => ({ title: faq.q, content: faq.a }))} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="on-dark relative overflow-hidden rounded-[30px] bg-forest px-7 py-12 text-cream md:px-12 md:py-16">
            <div
              className="pointer-events-none absolute -left-10 -top-16 h-[300px] w-[300px] rounded-full bg-gold/15 blur-[90px]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 right-0 h-[280px] w-[280px] rounded-full bg-green/40 blur-[90px]"
              aria-hidden="true"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <span className="eyebrow eyebrow-light">Make it yours</span>
                <h2 className="mt-3 text-balance text-[clamp(2rem,3.4vw,2.9rem)] text-cream">
                  Every journey can also be <em className="font-light italic text-gold-soft">private.</em>
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-cream/60">
                  Your own dates, your own pace, your own people. Tell us who is travelling and we will
                  design a journey around them — no group, no compromise.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/booking" className="btn btn-gold">
                  Design my journey
                  <ArrowUpRight />
                </Link>
                <Link to="/contact" className="btn btn-glass">
                  Ask a question
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
