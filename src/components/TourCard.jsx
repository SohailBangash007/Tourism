import { Link } from "react-router-dom"
import { ArrowUpRight, CalendarDays, Heart, MapPin, Star, Users } from "lucide-react"
import { getDestination } from "../data/destinations"
import useReveal from "../hooks/useReveal"
import { useApp } from "../context/AppContext"
import { cx, formatPrice } from "../utils/format"

export default function TourCard({ tour, delay = 0, className = "" }) {
  const reveal = useReveal(delay)
  const destination = getDestination(tour.destId)
  const { isFavorite, toggleFavorite } = useApp()
  const saved = isFavorite(tour.id)

  return (
    <article
      ref={reveal.ref}
      style={reveal.style}
      className={cx(
        reveal.className,
        "premium-card group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-card",
        className,
      )}
    >
      <div className="on-dark relative aspect-[16/11] overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/65 via-transparent to-forest-deep/10" />

        {tour.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-night shadow-sm">
            {tour.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleFavorite(tour.id, tour.title)}
          aria-label={saved ? `Remove ${tour.title} from wishlist` : `Save ${tour.title} to wishlist`}
          aria-pressed={saved}
          className={cx(
            "absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300",
            saved
              ? "border-gold bg-gold text-night"
              : "border-white/25 bg-white/15 text-white hover:bg-white/25",
          )}
        >
          <Heart className={cx("h-4 w-4", saved && "fill-current")} />
        </button>

        <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
          <MapPin className="h-3 w-3 text-gold-soft" />
          {destination?.name}
        </span>

        <span className="absolute bottom-4 right-4 rounded-full bg-cream/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-night">
          {tour.days} days
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-extrabold uppercase tracking-[0.13em] text-green">{tour.category}</span>
          <span className="flex items-center gap-1 font-extrabold text-gold">
            <Star className="h-3.5 w-3.5 fill-current" />
            {tour.rating.toFixed(1)}
            <span className="font-semibold text-muted">({tour.reviews})</span>
          </span>
        </div>

        <h3 className="mt-3 font-display text-[22px] leading-tight">
          <Link to={`/destinations/${tour.destId}`} className="transition-colors hover:text-green">
            {tour.title}
          </Link>
        </h3>

        <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-muted">{tour.summary}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {tour.highlights.slice(0, 2).map((highlight) => (
            <span
              key={highlight}
              className="rounded-full bg-cream/5 px-2.5 py-1 text-[10px] font-bold text-ink/65"
            >
              {highlight}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-muted">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5 text-gold" />
            {tour.nights} nights
          </span>
          <span className="text-line">•</span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-gold" />
            {tour.groupSize} guests
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted">From</p>
            <p className="mt-0.5 flex items-baseline gap-2">
              <span className="font-display text-[23px] font-semibold text-cream">{formatPrice(tour.price)}</span>
              {tour.oldPrice && (
                <span className="text-xs font-semibold text-muted line-through">{formatPrice(tour.oldPrice)}</span>
              )}
            </p>
          </div>
          <Link
            to={`/booking?tour=${tour.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2.5 text-[11px] font-extrabold text-night transition-all duration-300 hover:bg-gold-soft"
          >
            Book now
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
