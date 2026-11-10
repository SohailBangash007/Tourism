import { Link } from "react-router-dom"
import { ArrowUpRight, Heart, MapPin, Star } from "lucide-react"
import { useApp } from "../context/AppContext"
import useReveal from "../hooks/useReveal"
import { cx, formatPrice } from "../utils/format"

export default function DestinationCard({ destination, delay = 0, wide = false, className = "" }) {
  const reveal = useReveal(delay)
  const { isFavorite, toggleFavorite } = useApp()
  const saved = isFavorite(destination.id)

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
      <div className={cx("on-dark relative overflow-hidden", wide ? "aspect-[16/10]" : "aspect-[4/5]")}>
        <img
          src={destination.image}
          alt={`${destination.name}, ${destination.country}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/60 via-forest-deep/5 to-forest-deep/10" />

        <span className="absolute left-4 top-4 z-20 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-md">
          {destination.region}
        </span>

        <button
          type="button"
          onClick={() => toggleFavorite(destination.id, destination.name)}
          aria-label={saved ? `Remove ${destination.name} from wishlist` : `Save ${destination.name} to wishlist`}
          aria-pressed={saved}
          className={cx(
            "absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300",
            saved
              ? "border-gold bg-gold text-night"
              : "border-white/25 bg-white/15 text-white hover:bg-white/25",
          )}
        >
          <Heart className={cx("h-4 w-4", saved && "fill-current")} />
        </button>

        <Link
          to={`/destinations/${destination.id}`}
          aria-label={`Explore ${destination.name}`}
          className="absolute inset-0 z-10"
        />

        <div className="absolute bottom-4 left-4 z-20 rounded-full bg-cream/95 px-3.5 py-1.5 text-[13px] font-extrabold text-night shadow-sm backdrop-blur">
          <span className="mr-1 text-[9px] font-bold uppercase tracking-[0.12em] text-night/60">from</span>
          {formatPrice(destination.price)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 font-extrabold text-gold">
            <Star className="h-3.5 w-3.5 fill-current" />
            {destination.rating.toFixed(1)}
          </span>
          <span className="font-semibold text-muted">{destination.reviews} reviews</span>
        </div>

        <h3 className="mt-2 font-display text-[23px] leading-tight">
          <Link to={`/destinations/${destination.id}`} className="transition-colors hover:text-green">
            {destination.name}
          </Link>
        </h3>

        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
          <MapPin className="h-3.5 w-3.5 text-gold" />
          {destination.country}
        </p>

        <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-muted">{destination.tagline}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-[11px] font-bold text-ink/70">
            {destination.days} days · {destination.nights} nights
          </span>
          <Link
            to={`/destinations/${destination.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-extrabold text-cream transition-colors hover:text-gold"
          >
            Explore
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
