import { useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

export default function Lightbox({ items, index, onClose, onPrev, onNext }) {
  const item = items[index]

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowLeft") onPrev()
      if (event.key === "ArrowRight") onNext()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose, onPrev, onNext])

  if (!item) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${items.length}: ${item.title}`}
      onClick={onClose}
      className="on-dark fixed inset-0 z-[300] flex flex-col bg-forest-deep/95 p-4 text-cream backdrop-blur-md animate-fade sm:p-8"
    >
      <div className="flex items-center justify-between text-cream">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-cream/60">
          {index + 1} / {items.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-cream transition hover:border-gold hover:bg-gold hover:text-night"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center py-4">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onPrev()
          }}
          aria-label="Previous photo"
          className="absolute left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-forest-deep/50 text-cream backdrop-blur transition hover:border-gold hover:bg-gold hover:text-night sm:left-4"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <figure
          className="flex max-h-full flex-col items-center animate-pop"
          onClick={(event) => event.stopPropagation()}
        >
          <img
            src={item.src}
            alt={item.title}
            className="max-h-[72vh] w-auto max-w-full rounded-xl object-contain shadow-float"
          />
          <figcaption className="mt-5 text-center">
            <p className="font-display text-xl text-cream">{item.title}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-soft">
              {item.place}
            </p>
          </figcaption>
        </figure>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onNext()
          }}
          aria-label="Next photo"
          className="absolute right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-forest-deep/50 text-cream backdrop-blur transition hover:border-gold hover:bg-gold hover:text-night sm:right-4"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/30">
        Use arrow keys to browse · Esc to close
      </p>
    </div>
  )
}
