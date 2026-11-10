import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { ArrowUpRight, Compass, MapPin, Search, SlidersHorizontal, X } from "lucide-react"

import PageHero from "../components/PageHero"
import DestinationCard from "../components/DestinationCard"
import { destinations, regions } from "../data/destinations"
import { cx } from "../utils/format"

export default function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [region, setRegion] = useState(searchParams.get("region") || "All")
  const [sort, setSort] = useState("recommended")

  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (region !== "All") params.set("region", region)
    setSearchParams(params, { replace: true })
  }, [query, region, setSearchParams])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const result = destinations.filter((destination) => {
      const matchesRegion = region === "All" || destination.region === region
      const haystack = `${destination.name} ${destination.country} ${destination.location} ${destination.tags.join(" ")}`.toLowerCase()
      const matchesQuery = !term || haystack.includes(term)
      return matchesRegion && matchesQuery
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
        return [...result].sort((a, b) => Number(b.featured) - Number(a.featured))
    }
  }, [query, region, sort])

  const resetFilters = () => {
    setQuery("")
    setRegion("All")
    setSort("recommended")
  }

  return (
    <>
      <PageHero
        label="Destinations"
        eyebrow="The map"
        title={
          <>
            Find your next <em className="font-light italic text-gold-soft">somewhere.</em>
          </>
        }
        subtitle="Forty-eight hand-picked places, from high mountain valleys to quiet island atolls. Filter by region, follow your curiosity, and start imagining."
        image="/images/hero-1.jpg"
      />

      <section className="relative z-20 -mt-10 pb-4">
        <div className="container-x">
          <div className="rounded-card border border-line bg-surface p-4 shadow-soft md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
                <label htmlFor="destination-search" className="sr-only">
                  Search destinations
                </label>
                <input
                  id="destination-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search a place, country or feeling…"
                  className="w-full rounded-xl border border-line bg-surface py-3.5 pl-11 pr-4 text-sm font-semibold text-ink outline-none transition placeholder:font-normal placeholder:text-muted/60 focus:border-gold focus:ring-4 focus:ring-gold/15"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
                  <label htmlFor="destination-sort" className="sr-only">
                    Sort destinations
                  </label>
                  <select
                    id="destination-sort"
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-line bg-surface py-3.5 pl-10 pr-9 text-[12px] font-bold text-ink outline-none transition focus:border-gold sm:w-[190px]"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="rating">Highest rated</option>
                    <option value="duration">Longest journey</option>
                  </select>
                </div>

                {(query || region !== "All" || sort !== "recommended") && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-3.5 text-[11px] font-extrabold text-muted transition hover:border-clay/40 hover:text-clay"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto border-t border-line pt-4">
              {regions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRegion(item)}
                  className={cx(
                    "shrink-0 rounded-full px-4 py-2 text-[11px] font-extrabold transition-all duration-300",
                    region === item
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
              Showing <span className="text-cream">{filtered.length}</span> of {destinations.length} destinations
            </p>
            {region !== "All" && (
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                {region}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="pb-20 pt-6 md:pb-28">
        <div className="container-x">
          <h2 className="sr-only">All destinations</h2>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((destination, index) => (
                <DestinationCard key={destination.id} destination={destination} delay={(index % 3) * 60} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-surface/60 px-6 py-20 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/5 text-cream">
                <Compass className="h-7 w-7" />
              </span>
              <h2 className="mt-5 font-display text-3xl">No places match that search.</h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                Try a different region or a broader word — “mountains”, “islands”, or simply “somewhere quiet”.
              </p>
              <button type="button" onClick={resetFilters} className="btn btn-primary mt-6">
                Reset filters
              </button>
            </div>
          )}

          <div className="on-dark relative mt-16 overflow-hidden rounded-[30px] bg-forest px-7 py-10 text-cream md:px-12 md:py-12">
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-[280px] w-[280px] rounded-full bg-gold/15 blur-[90px]"
              aria-hidden="true"
            />
            <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <span className="eyebrow eyebrow-light">Can't decide?</span>
                <h2 className="mt-3 text-balance text-[clamp(1.8rem,3vw,2.6rem)] text-cream">
                  Tell us what you love. We will draw the map.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-cream/60">
                  Around half of our journeys are built from scratch. Share your dates, your pace and a few
                  places you have been dreaming about.
                </p>
              </div>
              <Link to="/booking" className="btn btn-gold shrink-0">
                Design my trip
                <ArrowUpRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
