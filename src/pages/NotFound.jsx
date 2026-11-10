import { Link } from "react-router-dom"
import { ArrowRight, Compass, Home, MapPin } from "lucide-react"

const suggestions = [
  { label: "Destinations", to: "/destinations" },
  { label: "Signature tours", to: "/tours" },
  { label: "The journal", to: "/journal" },
  { label: "Plan a trip", to: "/booking" },
]

export default function NotFound() {
  return (
    <section className="on-dark relative flex min-h-[100svh] items-center overflow-hidden bg-forest-deep pb-20 pt-36 text-cream">
      <img
        src="/images/hero-3.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/85 to-forest-deep/40" />
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-[420px] w-[420px] rounded-full bg-gold/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="container-x relative z-10">
        <div className="max-w-2xl">
          <span className="eyebrow eyebrow-light">Error 404</span>
          <p className="mt-6 font-display text-[clamp(5rem,14vw,10rem)] font-light leading-[0.8] text-gold-soft">
            404
          </p>
          <h1 className="mt-7 text-balance text-[clamp(2.2rem,4.6vw,3.6rem)] text-cream">
            Looks like this path <em className="font-light italic text-gold-soft">leads off the map.</em>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-cream/65 md:text-[15px]">
            The page you were looking for has moved, or perhaps it was never here. The good news: there are
            48 beautiful places waiting just around the corner.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="btn btn-gold">
              <Home />
              Back to home
            </Link>
            <Link to="/destinations" className="btn btn-glass">
              Explore destinations
              <Compass />
            </Link>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6">
            <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-cream/40">
              <MapPin className="h-3.5 w-3.5 text-gold" />
              Or try one of these
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-bold text-cream/75 transition hover:border-gold hover:bg-gold hover:text-night"
                >
                  {item.label}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
