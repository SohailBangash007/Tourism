import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react"
import { testimonials } from "../data/site"
import { cx } from "../utils/format"

export default function TestimonialSlider({ light = false }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const current = testimonials[index]

  useEffect(() => {
    if (paused) return undefined
    const timer = setInterval(() => {
      setIndex((value) => (value + 1) % testimonials.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [paused])

  const go = (direction) => {
    setIndex((value) => (value + direction + testimonials.length) % testimonials.length)
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[28px] border border-line bg-surface p-7 shadow-card md:p-10">
        <Quote className="absolute right-7 top-7 h-14 w-14 text-gold/15" strokeWidth={1} />

        <div key={current.id} className="animate-fade" aria-live="polite">
          <div className="flex gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, starIndex) => (
              <Star key={starIndex} className="h-4 w-4 fill-current" />
            ))}
          </div>

          <blockquote className="mt-5 font-display text-[21px] leading-[1.4] text-ink md:text-[26px]">
            “{current.quote}”
          </blockquote>

          <div className="mt-7 flex items-center gap-4 border-t border-line pt-6">
            <img
              src={current.avatar}
              alt={current.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-gold/30"
            />
            <div>
              <p className="text-sm font-extrabold text-ink">{current.name}</p>
              <p className="text-[11px] font-semibold text-muted">{current.trip}</p>
            </div>
            <span className="ml-auto hidden rounded-full bg-surface px-3 py-1.5 text-[10px] font-bold text-muted sm:block">
              {current.location}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {testimonials.map((item, dotIndex) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`Show testimonial ${dotIndex + 1}`}
              aria-pressed={dotIndex === index}
              className={cx(
                "h-1.5 rounded-full transition-all duration-300",
                dotIndex === index
                  ? "w-8 bg-gold"
                  : light
                    ? "w-3 bg-white/25 hover:bg-white/50"
                    : "w-3 bg-cream/20 hover:bg-cream/40",
              )}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className={cx(
              "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300",
              light
                ? "border-white/20 text-cream hover:border-gold hover:bg-gold hover:text-night"
                : "border-cream/20 text-cream hover:border-gold hover:bg-gold hover:text-night",
            )}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className={cx(
              "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300",
              light
                ? "border-white/20 text-cream hover:border-gold hover:bg-gold hover:text-night"
                : "border-cream/20 text-cream hover:border-gold hover:bg-gold hover:text-night",
            )}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
