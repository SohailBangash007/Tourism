import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, Camera, Maximize2 } from "lucide-react"

import PageHero from "../components/PageHero"
import Lightbox from "../components/Lightbox"
import { InstagramIcon } from "../components/SocialIcons"
import { gallery, galleryCategories } from "../data/site"
import { cx } from "../utils/format"

const categoryCopy = {
  Mountains: "High passes, slow trails and the first light that makes the climb worth it.",
  Lakes: "Still water, cold mornings and the kind of silence you can hear.",
  Culture: "Markets, kitchens, festivals and the people who keep a place alive.",
  Beaches: "Warm water, bare feet and afternoons with nowhere else to be.",
  Cities: "Lantern-lit lanes, rooftops and the hum of somewhere new.",
}

export default function Gallery() {
  const [category, setCategory] = useState(galleryCategories[0])
  const [activeIndex, setActiveIndex] = useState(null)

  const filtered = useMemo(() => gallery.filter((item) => item.category === category), [category])

  const counts = useMemo(
    () =>
      gallery.reduce((totals, item) => {
        totals[item.category] = (totals[item.category] || 0) + 1
        return totals
      }, {}),
    [],
  )

  useEffect(() => {
    setActiveIndex(null)
  }, [category])

  const onTabKeyDown = (event) => {
    const current = galleryCategories.indexOf(category)
    const last = galleryCategories.length - 1
    let next = current

    if (event.key === "ArrowRight") next = current === last ? 0 : current + 1
    else if (event.key === "ArrowLeft") next = current === 0 ? last : current - 1
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = last
    else return

    event.preventDefault()
    const target = galleryCategories[next]
    setCategory(target)
    requestAnimationFrame(() => document.getElementById(`gallery-tab-${target}`)?.focus())
  }

  const showPrev = () =>
    setActiveIndex((index) => (index - 1 + filtered.length) % filtered.length)
  const showNext = () => setActiveIndex((index) => (index + 1) % filtered.length)

  return (
    <>
      <PageHero
        label="Gallery"
        eyebrow="Through the lens"
        title={
          <>
            Some moments need <em className="font-light italic text-gold-soft">no caption.</em>
          </>
        }
        subtitle="A visual diary from recent journeys — first light, long lunches, wrong turns and the quiet minutes in between."
        image="/images/dest-santorini.jpg"
      />

      <section className="section pt-14 md:pt-20">
        <div className="container-x">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">The collection</span>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.6rem)]">{category}</h2>
              <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-muted">
                {categoryCopy[category]}
              </p>
            </div>
            <p
              aria-live="polite"
              className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted"
            >
              {filtered.length} photographs
            </p>
          </div>

          <div className="mt-8 border-b border-line">
            <div
              role="tablist"
              aria-label="Photo categories"
              onKeyDown={onTabKeyDown}
              className="no-scrollbar -mb-px flex gap-7 overflow-x-auto md:gap-10"
            >
              {galleryCategories.map((item) => {
                const active = category === item
                return (
                  <button
                    key={item}
                    id={`gallery-tab-${item}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="gallery-panel"
                    tabIndex={active ? 0 : -1}
                    onClick={() => setCategory(item)}
                    className={cx(
                      "group relative flex shrink-0 items-center gap-2 border-b-2 pb-4 pt-1 text-[11px] font-extrabold uppercase tracking-[0.14em] transition-colors duration-300",
                      active
                        ? "border-gold text-cream"
                        : "border-transparent text-muted hover:border-line hover:text-cream",
                    )}
                  >
                    {item}
                    <span
                      className={cx(
                        "rounded-full px-2 py-0.5 text-[9px] tracking-normal transition-colors duration-300",
                        active ? "bg-gold text-night" : "bg-cream/5 text-muted group-hover:text-cream",
                      )}
                    >
                      {counts[item] || 0}
                    </span>
                    <span className="sr-only">photographs</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div
            key={category}
            id="gallery-panel"
            role="tabpanel"
            aria-labelledby={`gallery-tab-${category}`}
            tabIndex={-1}
            className="masonry mt-8"
          >
            {filtered.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                style={{ animationDelay: `${index * 55}ms` }}
                className="masonry-item gallery-card on-dark group relative block w-full overflow-hidden rounded-2xl text-left ring-1 ring-inset ring-white/10 transition-shadow duration-500 hover:shadow-card"
              >
                <span className="sr-only">Open photo: </span>
                <div className={cx("w-full overflow-hidden", item.aspect)}>
                  <img
                    src={item.src}
                    alt={`${item.title} — ${item.place}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/75 via-forest-deep/5 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

                <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  {item.category}
                </span>

                <span className="absolute right-4 top-4 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <Maximize2 className="h-3.5 w-3.5" />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-display text-[20px] leading-tight text-cream">{item.title}</p>
                  <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.16em] text-gold-soft">
                    {item.place}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            <Camera className="h-3.5 w-3.5 text-gold" />
            Photographed on our journeys by guides and guests
          </p>

          <div className="on-dark relative mt-16 overflow-hidden rounded-[30px] bg-forest px-7 py-12 text-center text-cream md:px-12">
            <div
              className="pointer-events-none absolute -left-20 top-0 h-[260px] w-[260px] rounded-full bg-gold/15 blur-[90px]"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-gold-soft">
                <InstagramIcon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-balance text-[clamp(1.8rem,3.2vw,2.7rem)] text-cream">
                Follow the journeys as they <em className="font-light italic text-gold-soft">happen.</em>
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-cream/60">
                New frames, field notes and the occasional wrong turn — shared from the road.
              </p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold mt-7"
              >
                @dream.travel
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      {activeIndex !== null && (
        <Lightbox
          items={filtered}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </>
  )
}
