import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { cx } from "../utils/format"

export default function Accordion({ items, defaultOpen = 0, className = "" }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen)

  return (
    <div className={cx("divide-y divide-line border-y border-line", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={item.title || index}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              className="group flex w-full items-center gap-4 py-5 text-left"
            >
              {item.meta && (
                <span
                  className={cx(
                    "shrink-0 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] transition-colors",
                    isOpen ? "bg-gold text-night" : "bg-cream/[0.06] text-cream",
                  )}
                >
                  {item.meta}
                </span>
              )}
              <span className="flex-1 pr-2 font-display text-[19px] leading-snug text-ink transition-colors group-hover:text-green md:text-[21px]">
                {item.title}
              </span>
              <span
                className={cx(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                  isOpen
                    ? "border-gold bg-gold text-night"
                    : "border-line text-cream group-hover:border-cream/30",
                )}
              >
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <div className={cx("acc-panel", isOpen && "is-open")}>
              <div>
                <p className="pb-6 pr-10 text-sm leading-relaxed text-muted md:text-[15px]">{item.content}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
