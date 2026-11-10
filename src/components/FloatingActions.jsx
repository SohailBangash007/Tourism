import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"
import { contact } from "../data/site"
import { WhatsappIcon } from "./SocialIcons"
import { cx } from "../utils/format"

export default function FloatingActions() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      role="complementary"
      aria-label="Quick actions"
      className="fixed bottom-5 right-4 z-[120] flex flex-col items-center gap-3 sm:bottom-7 sm:right-6"
    >
      <a
        href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Dream on WhatsApp"
        title="Chat with a travel designer"
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_35px_rgba(37,211,102,0.35)] transition-transform duration-300 hover:-translate-y-1"
      >
        <WhatsappIcon className="h-6 w-6" />
      </a>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={cx(
          "flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-cream shadow-soft transition-all duration-300 hover:bg-gold hover:text-night",
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  )
}
