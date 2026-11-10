import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  Check,
  Compass,
  Headset,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react"

import SectionHeading from "../components/SectionHeading"
import DestinationCard from "../components/DestinationCard"
import TourCard from "../components/TourCard"
import StatCounter from "../components/StatCounter"
import TestimonialSlider from "../components/TestimonialSlider"
import NewsletterCta from "../components/NewsletterCta"
import DynamicIcon from "../utils/icons"

import { destinations, getDestination } from "../data/destinations"
import { tours, tourCategories } from "../data/tours"
import { posts } from "../data/posts"
import { featuredIn, gallery, galleryCategories, journeySteps, stats } from "../data/site"
import { formatDate } from "../utils/format"

const slides = [
  { image: "/images/hero-1.jpg", place: "Hunza Valley, Pakistan", coords: "36.31° N · 74.65° E" },
  { image: "/images/hero-2.jpg", place: "Kaghan Valley, Pakistan", coords: "34.90° N · 73.65° E" },
  { image: "/images/hero-3.jpg", place: "Deosai Plains, Pakistan", coords: "35.02° N · 75.41° E" },
]

const featuredIds = ["hunza", "maldives", "cappadocia", "switzerland", "skardu"]
const featuredDestinations = featuredIds.map(getDestination).filter(Boolean)

function HeroSearch() {
  const navigate = useNavigate()
  const [where, setWhere] = useState("all")
  const [style, setStyle] = useState("All")
  const [guests, setGuests] = useState("2")

  const handleSubmit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (where !== "all") params.set("destination", where)
    if (style !== "All") params.set("category", style)
    params.set("guests", guests)
    navigate(`/tours?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-0 rounded-[24px] border border-line bg-surface p-2.5 shadow-float sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_0.85fr_auto]"
    >
      <div className="flex items-center gap-3 px-4 py-3.5 lg:border-r lg:border-line">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream/[0.06] text-cream">
          <MapPin className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <label htmlFor="search-where" className="mb-0.5 block text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">
            Where to
          </label>
          <select
            id="search-where"
            value={where}
            onChange={(event) => setWhere(event.target.value)}
            className="w-full cursor-pointer truncate border-none bg-transparent text-[13px] font-bold text-ink outline-none"
          >
            <option value="all">Anywhere beautiful</option>
            {destinations.map((destination) => (
              <option key={destination.id} value={destination.id}>
                {destination.name}, {destination.country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-line px-4 py-3.5 sm:border-l-0 lg:border-l-0 lg:border-t-0">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream/[0.06] text-cream">
          <Compass className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <label htmlFor="search-style" className="mb-0.5 block text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">
            Travel style
          </label>
          <select
            id="search-style"
            value={style}
            onChange={(event) => setStyle(event.target.value)}
            className="w-full cursor-pointer border-none bg-transparent text-[13px] font-bold text-ink outline-none"
          >
            {tourCategories.map((category) => (
              <option key={category} value={category}>
                {category === "All" ? "Any experience" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-line px-4 py-3.5 sm:border-l sm:border-t-0">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream/[0.06] text-cream">
          <Users className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <label htmlFor="search-guests" className="mb-0.5 block text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">
            Travellers
          </label>
          <select
            id="search-guests"
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            className="w-full cursor-pointer border-none bg-transparent text-[13px] font-bold text-ink outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <option key={number} value={number}>
                {number} {number === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-gold m-1 justify-center sm:col-span-2 lg:col-span-1 lg:m-0 lg:px-7">
        <Search />
        Find my journey
      </button>
    </form>
  )
}

export default function Home() {
  const [slide, setSlide] = useState(0)
  const featuredPosts = posts.slice(0, 3)
  const galleryPreview = galleryCategories
    .map((category) => gallery.find((item) => item.category === category))
    .filter(Boolean)

  useEffect(() => {
    const timer = setInterval(() => setSlide((value) => (value + 1) % slides.length), 7000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="on-dark relative flex min-h-[100svh] items-center overflow-hidden pb-40 pt-32">
        {slides.map((item, index) => (
          <div
            key={item.image}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ${
              index === slide ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={index !== slide}
          >
            <img
              src={item.image}
              alt={item.place}
              className={`h-full w-full object-cover ${index === slide ? "animate-kenburns" : ""}`}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/95 via-forest-deep/70 to-forest-deep/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-forest-deep/30" />
        <div className="grain absolute inset-0" aria-hidden="true" />
        <div
          className="hero-orb pointer-events-none absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full bg-green/25 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="hero-orb pointer-events-none absolute -right-16 bottom-10 h-[360px] w-[360px] rounded-full bg-gold/20 blur-[110px]"
          style={{ animationDelay: "-7s" }}
          aria-hidden="true"
        />

        <div className="container-x relative z-10">
          <div className="max-w-3xl">
            <span
              className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-cream backdrop-blur-md"
              style={{ animationDelay: "80ms" }}
            >
              <span className="pulse-dot" />
              Curated journeys · 48 destinations
            </span>

            <h1 className="hero-title mt-7 text-balance text-[clamp(3.3rem,7.6vw,6.5rem)] font-medium text-cream">
              <span className="block overflow-hidden pb-1">
                <span className="block animate-rise" style={{ animationDelay: "180ms" }}>
                  Go further.
                </span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="block animate-rise" style={{ animationDelay: "300ms" }}>
                  <em className="text-gradient-gold text-shimmer font-light italic">Feel closer.</em>
                </span>
              </span>
            </h1>

            <p
              className="animate-rise mt-7 max-w-xl text-sm leading-relaxed text-cream/70 md:text-[17px]"
              style={{ animationDelay: "420ms" }}
            >
              Thoughtfully crafted small-group journeys to the world's most extraordinary places — led by
              people who call them home.
            </p>

            <div
              className="animate-rise mt-9 flex flex-wrap gap-3"
              style={{ animationDelay: "520ms" }}
            >
              <Link to="/destinations" className="btn btn-gold btn-lg">
                Explore destinations
                <ArrowRight />
              </Link>
              <Link to="/tours" className="btn btn-glass btn-lg">
                View our journeys
                <Compass />
              </Link>
            </div>

            <div
              className="animate-rise mt-10 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "640ms" }}
            >
              <div className="flex -space-x-2.5">
                {["/images/av-1.jpg", "/images/av-2.jpg", "/images/av-3.jpg"].map((avatar) => (
                  <img
                    key={avatar}
                    src={avatar}
                    alt=""
                    className="h-10 w-10 rounded-full border-2 border-cream/80 object-cover"
                  />
                ))}
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cream/80 bg-gold text-[10px] font-extrabold text-night">
                  12k+
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-gold-soft">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3.5 w-3.5 fill-current" />
                  ))}
                  <span className="ml-1 text-[11px] font-extrabold text-cream">4.9 / 5</span>
                </div>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-cream/50">
                  Loved by 12,400+ travellers
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-4 xl:flex" aria-hidden="true">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-cream/40 [writing-mode:vertical-rl]">
            Scroll to explore
          </span>
          <span className="scroll-cue h-16 w-px bg-gradient-to-b from-gold/70 to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-24 z-10 hidden md:block">
          <div className="container-x flex items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="font-display text-[15px] font-semibold tracking-[0.08em] text-cream">
                {String(slide + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1.5">
                {slides.map((item, index) => (
                  <button
                    key={item.image}
                    type="button"
                    onClick={() => setSlide(index)}
                    aria-label={`Show ${item.place}`}
                    aria-pressed={index === slide}
                    className={`h-[2px] rounded-full transition-all duration-500 ${
                      index === slide ? "w-10 bg-gold" : "w-5 bg-white/25 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream/35">
                / {String(slides.length).padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-cream/55">
              <MapPin className="h-3.5 w-3.5 text-gold" />
              {slides[slide].place}
              <span className="text-cream/25">·</span>
              {slides[slide].coords}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 h-[2px] bg-white/10" aria-hidden="true">
          <div
            key={slide}
            className="hero-progress h-full bg-gradient-to-r from-gold/50 via-gold to-gold/50"
          />
        </div>
      </section>

      {/* ---------------- Search ---------------- */}
      <div className="relative z-20 -mt-20 md:-mt-24">
        <div className="container-x">
          <HeroSearch />
        </div>
      </div>

      {/* ---------------- Featured in ---------------- */}
      <div className="border-b border-line">
        <div className="container-x flex flex-col items-center gap-4 py-8 md:flex-row md:gap-8">
          <span className="shrink-0 text-[9px] font-extrabold uppercase tracking-[0.24em] text-muted">
            As featured in
          </span>
          <div className="marquee-mask w-full md:flex-1">
            <div className="marquee-track items-center gap-10 pr-10">
              {[...featuredIn, ...featuredIn].map((name, index) => (
                <span
                  key={`${name}-${index}`}
                  aria-hidden={index >= featuredIn.length}
                  className="shrink-0 whitespace-nowrap font-display text-[15px] text-muted transition hover:text-cream"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Featured destinations ---------------- */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Where to next"
            title={
              <>
                Places that stay <em className="font-light italic text-green">with you.</em>
              </>
            }
            text="A handful of favourites from our map — chosen for the light, the people and the way they make you slow down."
            link="/destinations"
            linkLabel="All destinations"
          />

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDestinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                delay={index * 70}
                wide={index === 0}
                className={index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Why Dream ---------------- */}
      <section className="section overflow-hidden bg-cream-2">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative" data-reveal>
            <img
              src="/images/about-camp.jpg"
              alt="Travellers camped under the mountains in northern Pakistan"
              loading="lazy"
              className="aspect-[4/5] w-[84%] rounded-[30px] object-cover shadow-card"
            />
            <img
              src="/images/dest-swat.jpg"
              alt="Green valley and river in Swat"
              loading="lazy"
              className="absolute -right-1 bottom-8 aspect-[3/4] w-[46%] rounded-[24px] border-[5px] border-cream object-cover shadow-card"
            />
            <div className="on-dark animate-float absolute -top-4 left-6 rounded-2xl bg-forest px-5 py-4 text-cream shadow-card">
              <p className="font-display text-[30px] leading-none text-gold-soft">14+</p>
              <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.16em] text-cream/60">
                years crafting
                <br />
                journeys
              </p>
            </div>
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 shadow-soft sm:left-10">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green/10 text-green">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] font-extrabold text-ink">B-Corp certified</p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
                  Travel that gives back
                </p>
              </div>
            </div>
          </div>

          <div data-reveal>
            <span className="eyebrow">Why Dream</span>
            <h2 className="mt-4 text-balance text-[clamp(2rem,3.8vw,3.2rem)]">
              Travel that feels <em className="font-light italic text-green">personal.</em>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted md:text-[15px]">
              We are not trying to show you everything. We are trying to show you the right things, at the
              right pace, with the right people. That is the whole idea.
            </p>

            <ul className="mt-8 space-y-5">
              {[
                {
                  Icon: Users,
                  title: "Small groups, always",
                  text: "Never more than twelve travellers. Quieter trails, better tables, real conversations.",
                },
                {
                  Icon: Compass,
                  title: "Guides who call it home",
                  text: "Local experts, not script-readers. They know the stories, the shortcuts and the best tea.",
                },
                {
                  Icon: BedDouble,
                  title: "Stays with a soul",
                  text: "Family-run guesthouses, heritage havelis and design-led retreats we have slept in ourselves.",
                },
                {
                  Icon: Headset,
                  title: "Looked after, end to end",
                  text: "A real person on call 24/7, from the first question to the last airport transfer.",
                },
              ].map(({ Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="icon-round h-10 w-10">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <h3 className="font-sans text-sm font-extrabold text-ink">{title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link to="/about" className="btn btn-primary">
                Our story
                <ArrowRight />
              </Link>
              <div>
                <p className="font-display text-lg italic text-cream">Hamza Sheikh</p>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-muted">
                  Founder, Dream
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Signature journeys ---------------- */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Signature journeys"
            title={
              <>
                Trips we would take <em className="font-light italic text-green">ourselves.</em>
              </>
            }
            text="Small departures, carefully paced and full of the details that turn a good holiday into a story."
            link="/tours"
            linkLabel="All tours"
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tours.slice(0, 3).map((tour, index) => (
              <TourCard key={tour.id} tour={tour} delay={index * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section className="on-dark relative overflow-hidden bg-forest py-16 text-cream md:py-20">
        <div
          className="pointer-events-none absolute -left-20 -top-24 h-[340px] w-[340px] rounded-full bg-green/30 blur-[100px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 right-0 h-[300px] w-[300px] rounded-full bg-gold/10 blur-[100px]"
          aria-hidden="true"
        />
        <div className="grain absolute inset-0" aria-hidden="true" />

        <div className="container-x relative grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <p className="font-display text-[38px] font-medium leading-none text-cream md:text-[48px]">
                <StatCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
              </p>
              <p className="mx-auto mt-3 max-w-[160px] text-[10px] font-bold uppercase leading-relaxed tracking-[0.16em] text-cream md:mx-0">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="How it works"
            title={
              <>
                From a spark to <em className="font-light italic text-green">a story.</em>
              </>
            }
            text="Three simple steps, one very considered journey. We handle the logistics; you bring the curiosity."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {journeySteps.map((step, index) => (
              <div
                key={step.number}
                data-reveal
                style={{ transitionDelay: `${index * 90}ms` }}
                className="relative overflow-hidden rounded-card border border-line bg-surface p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft md:p-8"
              >
                <span className="pointer-events-none absolute right-6 top-5 font-display text-[64px] font-light leading-none text-sand/70">
                  {step.number}
                </span>
                <span className="icon-round">
                  <DynamicIcon name={step.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-[23px]">{step.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{step.text}</p>
                <span className="mt-6 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-gold">
                  <span className="h-px w-7 bg-gold" />
                  Step {step.number}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/booking" className="btn btn-outline">
              Start planning
              <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section className="on-dark relative overflow-hidden bg-forest-deep py-20 text-cream md:py-28">
        <div
          className="pointer-events-none absolute -right-32 top-0 h-[460px] w-[460px] rounded-full bg-green/30 blur-[130px]"
          aria-hidden="true"
        />
        <div className="grain absolute inset-0" aria-hidden="true" />

        <div className="container-x relative grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div data-reveal>
            <span className="eyebrow eyebrow-light">Guest stories</span>
            <h2 className="mt-4 text-balance text-[clamp(2rem,3.9vw,3.3rem)] text-cream">
              Stories from <em className="font-light italic text-gold-soft">the road.</em>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/60">
              The places change, the itineraries change — but the feeling of coming home a little different
              does not.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cream/55">
                4.9 · 2,300+ reviews
              </p>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {testimonialsAvatars.map((avatar) => (
                  <img
                    key={avatar}
                    src={avatar}
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-forest-deep object-cover"
                  />
                ))}
              </div>
              <p className="text-[11px] font-semibold text-cream/50">
                Real guests, real journeys
              </p>
            </div>
          </div>

          <div data-reveal style={{ transitionDelay: "100ms" }}>
            <TestimonialSlider light />
          </div>
        </div>
      </section>

      {/* ---------------- Gallery preview ---------------- */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Through the lens"
            title={
              <>
                Moments worth <em className="font-light italic text-green">keeping.</em>
              </>
            }
            text="A few frames from recent journeys — the in-between moments that never make the brochure."
            link="/gallery"
            linkLabel="Open gallery"
          />

          <div className="on-dark mt-12 grid grid-cols-2 gap-3 md:h-[520px] md:grid-cols-4 md:grid-rows-2">
            {galleryPreview.map((item, index) => (
              <Link
                key={item.id}
                to="/gallery"
                data-reveal
                style={{ transitionDelay: `${index * 60}ms` }}
                className={`group relative overflow-hidden rounded-2xl ${
                  index === 0 ? "col-span-2 row-span-2 aspect-[16/11] md:aspect-auto" : "aspect-square"
                }`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1100ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                  <div>
                    <p className="font-display text-lg leading-tight text-cream">{item.title}</p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-gold-soft">
                      {item.place}
                    </p>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-cream backdrop-blur">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Journal ---------------- */}
      <section className="section bg-cream-2">
        <div className="container-x">
          <SectionHeading
            eyebrow="The journal"
            title={
              <>
                Notes from <em className="font-light italic text-green">the road.</em>
              </>
            }
            text="Field notes, practical guides and slow-travel stories from our team and the people we meet."
            link="/journal"
            linkLabel="Read the journal"
          />

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {featuredPosts.map((post, index) => (
              <article key={post.slug} data-reveal style={{ transitionDelay: `${index * 80}ms` }} className="group">
                <Link to={`/journal/${post.slug}`} className="block overflow-hidden rounded-card">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[1100ms] group-hover:scale-105"
                  />
                </Link>
                <div className="mt-5 flex flex-wrap items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em]">
                  <span className="text-gold">{post.category}</span>
                  <span className="text-line">•</span>
                  <span className="text-muted">{formatDate(post.date)}</span>
                  <span className="text-line">•</span>
                  <span className="text-muted">{post.read} min read</span>
                </div>
                <h3 className="mt-2.5 font-display text-[23px] leading-snug">
                  <Link to={`/journal/${post.slug}`} className="transition-colors hover:text-green">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{post.excerpt}</p>
                <Link to={`/journal/${post.slug}`} className="link-arrow mt-4">
                  Read story
                  <ArrowUpRight />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <NewsletterCta />
    </>
  )
}

const testimonialsAvatars = ["/images/av-1.jpg", "/images/av-2.jpg", "/images/av-3.jpg", "/images/av-4.jpg"]
