import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { cx } from "../utils/format"

export default function SectionHeading({
  eyebrow,
  title,
  text,
  link,
  linkLabel = "Explore all",
  align = "left",
  light = false,
  className = "",
}) {
  const centered = align === "center"

  return (
    <div
      data-reveal
      className={cx(
        "flex flex-col gap-7 md:flex-row md:items-end md:justify-between",
        centered && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cx("max-w-2xl", centered && "mx-auto")}>
        {eyebrow && <span className={cx("eyebrow", light && "eyebrow-light")}>{eyebrow}</span>}
        <h2
          className={cx(
            "mt-4 text-balance text-[clamp(2rem,3.8vw,3.2rem)]",
            light ? "text-cream" : "text-ink",
          )}
        >
          {title}
        </h2>
        {text && (
          <p
            className={cx(
              "mt-4 max-w-xl text-sm leading-relaxed md:text-[15px]",
              light ? "text-cream/60" : "text-muted",
              centered && "mx-auto",
            )}
          >
            {text}
          </p>
        )}
      </div>

      {link && (
        <Link
          to={link}
          className={cx(
            "group inline-flex shrink-0 items-center gap-3 self-start text-[13px] font-extrabold md:self-auto",
            light ? "text-cream hover:text-gold-soft" : "text-cream hover:text-gold",
          )}
        >
          {linkLabel}
          <span
            className={cx(
              "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 group-hover:-translate-y-0.5 group-hover:rotate-45",
              light
                ? "border-white/20 text-cream group-hover:border-gold group-hover:bg-gold group-hover:text-night"
                : "border-cream/20 text-cream group-hover:border-gold group-hover:bg-gold group-hover:text-night",
            )}
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      )}
    </div>
  )
}
