import { Link } from "react-router-dom"
import { MoonStar } from "lucide-react"

import { cx } from "../utils/format"

export default function Logo({ dark = false, onClick }) {
  return (
    <Link to="/" onClick={onClick} className="group flex items-center gap-3">
      <span
        className={cx(
          "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500 group-hover:scale-105 group-hover:border-gold/60",
          dark
            ? "border-gold/35 bg-gradient-to-br from-forest via-forest to-forest-deep text-gold-soft shadow-[0_10px_30px_rgba(4,17,12,0.28)]"
            : "border-white/25 bg-white/10 text-gold-soft backdrop-blur-md",
        )}
      >
        <MoonStar className="h-[21px] w-[21px]" strokeWidth={1.35} />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold ring-2 ring-forest-deep" />
      </span>
      <span className="leading-none">
        <span
          className={cx(
            "block font-display text-[28px] font-semibold tracking-[-0.035em] transition-colors duration-300",
            dark ? "text-ink" : "text-white",
          )}
        >
          Dream<span className="text-gold">.</span>
        </span>
        <span
          className={cx(
            "mt-1.5 block text-[8.5px] font-extrabold uppercase tracking-[0.3em]",
            dark ? "text-muted" : "text-white/55",
          )}
        >
          Travel, beautifully
        </span>
      </span>
    </Link>
  )
}
