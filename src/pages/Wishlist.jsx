import { Link } from "react-router-dom"
import { ArrowUpRight, Compass, Heart, Trash2 } from "lucide-react"

import PageHero from "../components/PageHero"
import DestinationCard from "../components/DestinationCard"
import { destinations } from "../data/destinations"
import { tours } from "../data/tours"
import { useApp } from "../context/AppContext"
import TourCard from "../components/TourCard"

export default function Wishlist() {
  const { favorites, clearFavorites } = useApp()
  const savedDestinations = destinations.filter((destination) => favorites.includes(destination.id))
  const savedTours = tours.filter((tour) => favorites.includes(tour.id))
  const total = savedDestinations.length + savedTours.length
  const clearAll = clearFavorites

  return (
    <>
      <PageHero
        label="Wishlist"
        eyebrow="Saved for later"
        title={
          <>
            The places you <em className="font-light italic text-gold-soft">keep coming back to.</em>
          </>
        }
        subtitle="Your shortlist, saved on this device. Add a destination with the heart icon and it will wait for you here."
        image="/images/dest-santorini.jpg"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="chip-glass">
            <Heart className="h-3.5 w-3.5" />
            {total} saved {total === 1 ? "place" : "places"}
          </span>
          {total > 0 && (
            <button type="button" onClick={clearAll} className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-cream/60 transition hover:text-gold-soft">
              <Trash2 className="mr-1 inline h-3 w-3" />
              Clear all
            </button>
          )}
        </div>
      </PageHero>

      <section className="section">
        <div className="container-x">
          {total === 0 ? (
            <div className="mx-auto max-w-xl rounded-card border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream/5 text-cream">
                <Heart className="h-7 w-7" />
              </span>
              <h2 className="mt-5 font-display text-3xl">Nothing saved just yet.</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                Tap the heart on any destination to keep it here. Your wishlist is stored on this device, so
                it will be waiting when you come back.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link to="/destinations" className="btn btn-primary">
                  Browse destinations
                  <ArrowUpRight />
                </Link>
                <Link to="/tours" className="btn btn-outline">
                  Browse tours
                </Link>
              </div>
            </div>
          ) : (
            <>
              {savedDestinations.length > 0 && (
                <div>
                  <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
                    <div>
                      <span className="eyebrow">Destinations</span>
                      <h2 className="mt-3 font-display text-[clamp(1.7rem,2.8vw,2.3rem)]">
                        {savedDestinations.length} saved {savedDestinations.length === 1 ? "place" : "places"}
                      </h2>
                    </div>
                    <Link to="/destinations" className="link-arrow hidden sm:inline-flex">
                      Add more
                      <ArrowUpRight />
                    </Link>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {savedDestinations.map((destination, index) => (
                      <DestinationCard key={destination.id} destination={destination} delay={index * 60} />
                    ))}
                  </div>
                </div>
              )}

              {savedTours.length > 0 && (
                <div className="mt-16">
                  <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
                    <div>
                      <span className="eyebrow">Journeys</span>
                      <h2 className="mt-3 font-display text-[clamp(1.7rem,2.8vw,2.3rem)]">
                        Saved tours
                      </h2>
                    </div>
                    <Link to="/tours" className="link-arrow hidden sm:inline-flex">
                      Add more
                      <ArrowUpRight />
                    </Link>
                  </div>

                  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {savedTours.map((tour, index) => (
                      <TourCard key={tour.id} tour={tour} delay={index * 60} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {total > 0 && (
            <div className="on-dark relative mt-16 overflow-hidden rounded-[30px] bg-forest px-7 py-10 text-cream md:px-12 md:py-12">
              <div
                className="pointer-events-none absolute -right-16 -top-20 h-[280px] w-[280px] rounded-full bg-gold/15 blur-[90px]"
                aria-hidden="true"
              />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <span className="eyebrow eyebrow-light">Ready when you are</span>
                  <h2 className="mt-3 text-balance text-[clamp(1.8rem,3vw,2.6rem)] text-cream">
                    Turn your shortlist into a journey.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-cream/60">
                    Send us your dates and we will draw a route around the places you have saved — with the
                    small details already thought through.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/booking" className="btn btn-gold">
                    Start planning
                    <ArrowUpRight />
                  </Link>
                  <Link to="/contact" className="btn btn-glass">
                    Ask a designer
                    <Compass />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
