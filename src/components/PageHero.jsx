import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { cx } from "../utils/format"

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  label,
  children,
  tall = false,
  className = "",
}) {
  return (
    <section
      className={cx(
        "on-dark relative flex items-end overflow-hidden pb-14 pt-36 md:pb-16 md:pt-40",
        tall ? "min-h-[80vh]" : "min-h-[58vh]",
        className,
      )}
    >
      <img
        src={image}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover animate-kenburns-slow"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/95 via-forest-deep/70 to-forest-deep/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-transparent to-forest-deep/20" />

      <div className="container-x relative z-10">
        <nav
          aria-label="Breadcrumb"
          className="animate-rise mb-6 flex items-center gap-2 text-[11px] font-bold text-cream/55"
          style={{ animationDelay: "60ms" }}
        >
          <Link to="/" className="transition hover:text-gold-soft">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gold-soft">{label}</span>
        </nav>

        <span className="eyebrow eyebrow-light animate-rise" style={{ animationDelay: "140ms" }}>
          {eyebrow}
        </span>
        <h1
          className="animate-rise mt-4 max-w-4xl text-balance text-[clamp(2.6rem,5.5vw,4.8rem)] text-cream"
          style={{ animationDelay: "220ms" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="animate-rise mt-5 max-w-2xl text-sm leading-relaxed text-cream/70 md:text-[16px]"
            style={{ animationDelay: "300ms" }}
          >
            {subtitle}
          </p>
        )}
        {children && (
          <div className="animate-rise mt-7" style={{ animationDelay: "380ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
