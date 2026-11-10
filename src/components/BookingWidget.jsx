import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight, CalendarDays, Check, Lock, ShieldCheck, Star, Users } from "lucide-react"
import { formatPrice, todayISO } from "../utils/format"

export default function BookingWidget({ destination }) {
  const [date, setDate] = useState(todayISO(30))
  const [guests, setGuests] = useState(2)
  const total = destination.price * guests

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
        <div className="border-b border-line bg-cream-2 px-6 pb-5 pt-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted">From, per person</p>
              <p className="mt-1 font-display text-[36px] font-semibold leading-none text-cream">
                {formatPrice(destination.price)}
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-gold/15 px-3 py-1.5 text-[11px] font-extrabold text-gold-soft">
              <Star className="h-3.5 w-3.5 fill-current" />
              {destination.rating.toFixed(1)}
            </span>
          </div>
          <p className="mt-2 text-[11px] font-semibold text-muted">{destination.reviews} verified guest reviews</p>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label htmlFor="trip-date" className="field-label">
              Preferred start date
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
              <input
                id="trip-date"
                type="date"
                min={todayISO(1)}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="field-input pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="trip-guests" className="field-label">
              Travellers
            </label>
            <div className="relative">
              <Users className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
              <select
                id="trip-guests"
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
                className="field-input appearance-none pl-10"
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1} {index === 0 ? "traveller" : "travellers"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-cream/5 px-4 py-3 text-sm">
            <span className="font-semibold text-ink/70">Estimated total</span>
            <span className="font-display text-xl font-semibold text-cream">{formatPrice(total)}</span>
          </div>

          <Link
            to={`/booking?destination=${destination.id}&date=${date}&adults=${guests}`}
            className="btn btn-primary w-full"
          >
            Reserve this journey
            <ArrowUpRight />
          </Link>

          <p className="flex items-center justify-center gap-1.5 text-center text-[10px] font-semibold text-muted">
            <Lock className="h-3 w-3" />
            No payment now · Free cancellation up to 30 days
          </p>
        </div>

        <div className="border-t border-line bg-cream-2 px-6 py-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted">What is included</p>
          <ul className="mt-3 space-y-2.5">
            {[
              "Hand-picked stays with breakfast",
              "An expert local guide throughout",
              "Private transport & transfers",
              "24/7 support while you travel",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[12px] font-semibold text-ink/70">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-3 text-[10px] font-semibold text-muted">
            <ShieldCheck className="h-5 w-5 shrink-0 text-gold" />
            Fully licensed operator · Secure payments · 4.9/5 guest rating
          </div>
        </div>
      </div>
    </aside>
  )
}
