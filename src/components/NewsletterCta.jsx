import { useState } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { useApp } from "../context/AppContext"

export default function NewsletterCta() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const { notify } = useApp()

  const handleSubmit = (event) => {
    event.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!valid) {
      notify("Please enter a valid email address.", "info")
      return
    }
    setSent(true)
    notify("You're on the list — see you in your inbox.")
    setEmail("")
  }

  return (
    <section className="on-dark relative isolate overflow-hidden py-24 md:py-32">
      <img
        src="/images/cta.jpg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-forest-deep/85" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep/90 via-forest-deep/50 to-forest-deep/70" />
      <div className="grain absolute inset-0 -z-10" aria-hidden="true" />

      <div className="container-x relative z-10 flex flex-col items-center text-center" data-reveal>
        <span className="eyebrow eyebrow-light">The Dream letter</span>
        <h2 className="mt-5 max-w-3xl text-balance text-[clamp(2.2rem,4.6vw,3.6rem)] text-cream">
          Your next story is <em className="font-light italic text-gold-soft">waiting.</em>
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-cream/65 md:text-[15px]">
          One considered email a month: new journeys, quiet corners of the world and the occasional
          early-booking invitation. No noise, ever.
        </p>

        {sent ? (
          <div className="mt-9 flex w-full max-w-md items-center justify-center gap-3 rounded-2xl border border-gold/30 bg-white/10 px-6 py-5 text-sm font-semibold text-cream backdrop-blur-md">
            <CheckCircle2 className="h-5 w-5 text-gold" />
            You're on the list. The next letter is yours.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-9 flex w-full max-w-lg flex-col gap-2 rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-md sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-cream outline-none placeholder:text-cream/65"
            />
            <button type="submit" className="btn btn-gold">
              Join the letter
              <ArrowRight />
            </button>
          </form>
        )}

        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream/40">
          No spam · Unsubscribe anytime
        </p>
      </div>
    </section>
  )
}
