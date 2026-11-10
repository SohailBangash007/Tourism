import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Headset,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  X,
} from "lucide-react"

import PageHero from "../components/PageHero"
import { destinations, getDestination } from "../data/destinations"
import { getTour, tours } from "../data/tours"
import { countries } from "../data/site"
import { useApp } from "../context/AppContext"
import { cx, formatDate, formatPrice, nightsBetween, todayISO } from "../utils/format"

const steps = [
  { label: "Trip details", hint: "Dates & travellers" },
  { label: "Traveller details", hint: "Who is coming" },
  { label: "Confirm", hint: "Payment & review" },
]

const extrasList = [
  {
    id: "insurance",
    label: "Travel insurance",
    price: 49,
    unit: "per traveller",
    description: "Comprehensive cover, including trekking and altitude.",
  },
  {
    id: "guide",
    label: "Private guide upgrade",
    price: 180,
    unit: "per booking",
    description: "A dedicated guide for your whole journey.",
  },
  {
    id: "transfers",
    label: "Private airport transfers",
    price: 60,
    unit: "per booking",
    description: "Door-to-door, both ways, with a meet-and-greet.",
  },
]

const roomTypes = ["Standard double", "Deluxe double", "Twin share", "Family suite"]

const paymentOptions = [
  {
    id: "deposit",
    title: "Pay a 25% deposit",
    text: "Reserve your place now. The balance is due 30 days before departure.",
    Icon: Wallet,
  },
  {
    id: "full",
    title: "Pay in full",
    text: "Settle the full amount today and we will handle everything else.",
    Icon: CreditCard,
  },
  {
    id: "later",
    title: "Hold my place",
    text: "We will hold your place for 48 hours while you make up your mind.",
    Icon: Clock,
  },
]

const addDays = (iso, days) => {
  if (!iso) return iso
  const date = new Date(`${iso}T12:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function FieldError({ message }) {
  if (!message) return null
  return <p className="mt-1.5 text-[11px] font-semibold text-clay">{message}</p>
}

function Summary({
  destination,
  selectedTour,
  trip,
  nights,
  basePrice,
  adultsTotal,
  childrenTotal,
  extraLines,
  discount,
  serviceFee,
  total,
  deposit,
  payment,
}) {
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
        <div className="relative h-36">
          <img src={destination.image} alt={destination.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur">
            {destination.region}
          </span>
          <p className="absolute bottom-4 left-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold-soft">
            {selectedTour ? "Your package" : "Your destination"}
          </p>
        </div>

        <div className="p-5">
          <h3 className="font-display text-[24px] leading-tight text-ink">
            {selectedTour ? selectedTour.title : destination.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            {destination.location}
          </p>

          <div className="mt-4 space-y-2 rounded-xl bg-cream-2 p-4 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted">
                <CalendarDays className="h-3.5 w-3.5 text-gold" />
                Departure
              </span>
              <span className="font-bold text-ink">{formatDate(trip.date)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted">
                <CalendarDays className="h-3.5 w-3.5 text-gold" />
                Return
              </span>
              <span className="font-bold text-ink">{formatDate(trip.returnDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted">
                <Clock className="h-3.5 w-3.5 text-gold" />
                Duration
              </span>
              <span className="font-bold text-ink">
                {nights > 0 ? `${nights} ${nights === 1 ? "night" : "nights"}` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted">
                <Users className="h-3.5 w-3.5 text-gold" />
                Travellers
              </span>
              <span className="font-bold text-ink">
                {trip.adults} adult{trip.adults > 1 ? "s" : ""}
                {trip.children > 0 ? `, ${trip.children} children` : ""}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Room</span>
              <span className="font-bold text-ink">{trip.room}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-muted">
                {formatPrice(basePrice)} × {trip.adults} adults
              </span>
              <span className="font-bold text-ink">{formatPrice(adultsTotal)}</span>
            </div>
            {trip.children > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted">
                  {formatPrice(basePrice * 0.6)} × {trip.children} children
                </span>
                <span className="font-bold text-ink">{formatPrice(childrenTotal)}</span>
              </div>
            )}
            {extraLines.map((line) => (
              <div key={line.label} className="flex items-center justify-between">
                <span className="text-muted">{line.label}</span>
                <span className="font-bold text-ink">{formatPrice(line.amount)}</span>
              </div>
            ))}
            {discount > 0 && (
              <div className="flex items-center justify-between text-green">
                <span>Group saving (10%)</span>
                <span className="font-bold">−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted">Taxes & service (5%)</span>
              <span className="font-bold text-ink">{formatPrice(serviceFee)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted">Total</p>
              <p className="font-display text-[30px] font-semibold leading-none text-cream">
                {formatPrice(total)}
              </p>
            </div>
            <span className="rounded-full bg-cream/5 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-ink/70">
              USD
            </span>
          </div>

          <p className="mt-2 text-[10px] font-semibold text-muted">
            {payment === "deposit"
              ? `Pay ${formatPrice(deposit)} today · balance due 30 days before`
              : payment === "full"
                ? "Full payment today"
                : "No payment today · 48-hour hold"}
          </p>

          <div className="mt-4 space-y-2 border-t border-line pt-4">
            {[
              "No hidden fees or booking charges",
              "Free cancellation up to 30 days before",
              "24/7 support from a real person",
            ].map((item) => (
              <p key={item} className="flex items-start gap-2 text-[10px] font-semibold text-muted">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-green" strokeWidth={3} />
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-line bg-cream-2 px-4 py-3 text-[10px] font-semibold text-muted">
        <Lock className="h-3.5 w-3.5 text-gold" />
        Secure booking · Your details are never shared
      </div>
    </aside>
  )
}

export default function Booking() {
  const [searchParams] = useSearchParams()
  const { notify } = useApp()
  const formRef = useRef(null)
  const stepChanged = useRef(false)

  const initialTourId = getTour(searchParams.get("tour") || "")?.id || ""
  const initialTour = getTour(initialTourId)
  const initialDestination =
    getDestination(searchParams.get("destination") || "")?.id || initialTour?.destId || "hunza"
  const initialAdults = Math.min(10, Math.max(1, Number(searchParams.get("adults")) || 2))

  const [trip, setTrip] = useState({
    destination: initialDestination,
    tourId: initialTourId,
    date: searchParams.get("date") || todayISO(30),
    returnDate: addDays(searchParams.get("date") || todayISO(30), (initialTour?.days || 6) - 1),
    adults: initialAdults,
    children: 0,
    room: "Deluxe double",
    extras: ["transfers"],
  })
  const [traveler, setTraveler] = useState({
    firstName: "Sohail",
    lastName: "",
    email: "",
    phone: "",
    country: "Pakistan",
    notes: "",
  })
  const [confirm, setConfirm] = useState({ payment: "deposit", terms: false })
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(null)

  const destination = getDestination(trip.destination) || destinations[0]
  const selectedTour = trip.tourId ? getTour(trip.tourId) : null
  const tourOptions = tours.filter((tour) => tour.destId === trip.destination)
  const nights = nightsBetween(trip.date, trip.returnDate)
  const pax = trip.adults + trip.children
  const basePrice = selectedTour?.price ?? destination.price
  const adultsTotal = basePrice * trip.adults
  const childrenTotal = basePrice * 0.6 * trip.children

  const extraLines = extrasList
    .filter((extra) => trip.extras.includes(extra.id))
    .map((extra) => ({
      label: extra.label,
      amount: extra.id === "insurance" ? extra.price * pax : extra.price,
    }))
  const extraTotal = extraLines.reduce((sum, line) => sum + line.amount, 0)
  const subtotal = adultsTotal + childrenTotal + extraTotal
  const discount = pax >= 4 ? subtotal * 0.1 : 0
  const serviceFee = (subtotal - discount) * 0.05
  const total = Math.round(subtotal - discount + serviceFee)
  const deposit = Math.round(total * 0.25)

  useEffect(() => {
    if (!stepChanged.current) {
      stepChanged.current = true
      return
    }
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [step])

  useEffect(() => {
    if (!success) return undefined
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [success])

  const updateTrip = (field, value) => {
    setTrip((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const updateTraveler = (field, value) => {
    setTraveler((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const changeDestination = (id) => {
    setTrip((prev) => ({ ...prev, destination: id, tourId: "" }))
    setErrors((prev) => ({ ...prev, destination: "" }))
  }

  const changeTour = (id) => {
    const tour = getTour(id)
    setTrip((prev) => ({
      ...prev,
      tourId: id,
      destination: tour?.destId || prev.destination,
      returnDate: tour ? addDays(prev.date, tour.days - 1) : prev.returnDate,
    }))
  }

  const toggleExtra = (id) => {
    setTrip((prev) => ({
      ...prev,
      extras: prev.extras.includes(id) ? prev.extras.filter((item) => item !== id) : [...prev.extras, id],
    }))
  }

  const validate = () => {
    const next = {}
    if (step === 0) {
      if (!trip.destination) next.destination = "Please choose a destination."
      if (!trip.date) next.date = "Please choose a departure date."
      if (!trip.returnDate) next.returnDate = "Please choose a return date."
      else if (nights <= 0) next.returnDate = "Your return date must be after departure."
      if (trip.adults < 1) next.adults = "At least one adult is required."
      if (pax > 12) next.adults = "For groups larger than 12, please contact us for a private quote."
    }

    if (step === 1) {
      if (traveler.firstName.trim().length < 2) next.firstName = "Please enter your first name."
      if (traveler.lastName.trim().length < 2) next.lastName = "Please enter your last name."
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(traveler.email)) next.email = "Please enter a valid email address."
      if (traveler.phone.replace(/[^0-9]/g, "").length < 7) next.phone = "Please enter a valid phone number."
      if (!traveler.country) next.country = "Please choose your country of residence."
    }

    if (step === 2 && !confirm.terms) {
      next.terms = "Please agree to the booking terms to continue."
    }

    setErrors(next)
    if (Object.keys(next).length > 0) {
      notify("Please check the highlighted fields.", "info")
      return false
    }
    return true
  }

  const goNext = () => {
    if (validate()) setStep((value) => Math.min(2, value + 1))
  }

  const goBack = () => {
    setErrors({})
    setStep((value) => Math.max(0, value - 1))
  }

  const submitBooking = () => {
    if (!validate()) return
    const reference = `DRM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    const booking = {
      reference,
      trip,
      traveler,
      total,
      deposit,
      payment: confirm.payment,
      createdAt: new Date().toISOString(),
    }
    try {
      const existing = JSON.parse(localStorage.getItem("dream-bookings") || "[]")
      localStorage.setItem("dream-bookings", JSON.stringify([...existing, booking]))
    } catch {
      /* demo booking still confirms without storage */
    }
    setSuccess({ reference, total, deposit })
    notify("Booking request received — check your inbox soon.")
  }

  return (
    <>
      <PageHero
        label="Booking"
        eyebrow="Plan with us"
        title={
          <>
            Let's plan your <em className="font-light italic text-gold-soft">escape.</em>
          </>
        }
        subtitle="Tell us the shape of the trip and we will take care of the rest. No payment is taken now — this is a booking request, reviewed by a real person."
        image="/images/booking-side.jpg"
      >
        <div className="flex flex-wrap gap-2">
          <span className="chip-glass">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure & flexible
          </span>
          <span className="chip-glass">
            <BadgeCheck className="h-3.5 w-3.5" />
            24-hour response
          </span>
          <span className="chip-glass">
            <Headset className="h-3.5 w-3.5" />
            Real human support
          </span>
        </div>
      </PageHero>

      <section className="section">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-10">
            <div ref={formRef} className="scroll-mt-28">
              <div className="overflow-hidden rounded-card border border-line bg-surface shadow-soft">
                <div className="border-b border-line bg-cream-2 p-6 md:p-8">
                  <div className="flex items-start justify-between gap-2">
                    {steps.map((item, index) => {
                      const active = index === step
                      const done = index < step
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            if (index < step) {
                              setErrors({})
                              setStep(index)
                            }
                          }}
                          disabled={index > step}
                          className={cx(
                            "flex flex-1 items-start gap-2.5 text-left",
                            index > step && "cursor-default opacity-50",
                          )}
                        >
                          <span
                            className={cx(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold transition",
                              done && "bg-green text-night",
                              active && "bg-gold text-night",
                              !done && !active && "border border-line bg-surface text-muted",
                            )}
                          >
                            {done ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
                          </span>
                          <span className="hidden sm:block">
                            <span
                              className={cx(
                                "block text-[11px] font-extrabold",
                                active ? "text-cream" : "text-ink/65",
                              )}
                            >
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.08em] text-muted">
                              {item.hint}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-cream/5">
                    <div
                      className="h-full rounded-full bg-gold transition-all duration-500"
                      style={{ width: `${((step + 1) / 3) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {step === 0 && (
                    <div className="animate-fade">
                      <span className="eyebrow">Step one</span>
                      <h2 className="mt-3 font-display text-[26px] md:text-[30px]">The shape of your trip</h2>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted">
                        Pick a destination or one of our signature journeys. Everything can be tailored
                        later.
                      </p>

                      <div className="mt-7 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="booking-destination" className="field-label">
                            Destination
                          </label>
                          <select
                            id="booking-destination"
                            value={trip.destination}
                            onChange={(event) => changeDestination(event.target.value)}
                            className="field-input appearance-none"
                          >
                            {destinations.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}, {item.country}
                              </option>
                            ))}
                          </select>
                          <FieldError message={errors.destination} />
                        </div>

                        <div>
                          <label htmlFor="booking-tour" className="field-label">
                            Signature journey
                          </label>
                          <select
                            id="booking-tour"
                            value={trip.tourId}
                            onChange={(event) => changeTour(event.target.value)}
                            className="field-input appearance-none"
                          >
                            <option value="">Custom journey — build from scratch</option>
                            {tourOptions.map((tour) => (
                              <option key={tour.id} value={tour.id}>
                                {tour.title} · {tour.days} days
                              </option>
                            ))}
                          </select>
                          <p className="mt-1.5 text-[10px] font-semibold text-muted">
                            {tourOptions.length === 0
                              ? "No set departure — we will design this one for you."
                              : "Optional. Choose a package or keep it custom."}
                          </p>
                        </div>

                        <div>
                          <label htmlFor="booking-date" className="field-label">
                            Departure date
                          </label>
                          <input
                            id="booking-date"
                            type="date"
                            min={todayISO(1)}
                            value={trip.date}
                            onChange={(event) => {
                              const value = event.target.value
                              setTrip((prev) => ({
                                ...prev,
                                date: value,
                                returnDate:
                                  nightsBetween(value, prev.returnDate) > 0
                                    ? prev.returnDate
                                    : addDays(value, (selectedTour?.days || destination.days) - 1),
                              }))
                              setErrors((prev) => ({ ...prev, date: "", returnDate: "" }))
                            }}
                            className={cx("field-input", errors.date && "field-input-error")}
                          />
                          <FieldError message={errors.date} />
                        </div>

                        <div>
                          <label htmlFor="booking-return" className="field-label">
                            Return date
                          </label>
                          <input
                            id="booking-return"
                            type="date"
                            min={trip.date ? addDays(trip.date, 1) : todayISO(2)}
                            value={trip.returnDate}
                            onChange={(event) => updateTrip("returnDate", event.target.value)}
                            className={cx("field-input", errors.returnDate && "field-input-error")}
                          />
                          <FieldError message={errors.returnDate} />
                        </div>

                        <div>
                          <label htmlFor="booking-adults" className="field-label">
                            Adults
                          </label>
                          <select
                            id="booking-adults"
                            value={trip.adults}
                            onChange={(event) => updateTrip("adults", Number(event.target.value))}
                            className="field-input appearance-none"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                              <option key={number} value={number}>
                                {number} {number === 1 ? "adult" : "adults"}
                              </option>
                            ))}
                          </select>
                          <FieldError message={errors.adults} />
                        </div>

                        <div>
                          <label htmlFor="booking-children" className="field-label">
                            Children (2–11 years)
                          </label>
                          <select
                            id="booking-children"
                            value={trip.children}
                            onChange={(event) => updateTrip("children", Number(event.target.value))}
                            className="field-input appearance-none"
                          >
                            {[0, 1, 2, 3, 4, 5, 6].map((number) => (
                              <option key={number} value={number}>
                                {number === 0 ? "No children" : `${number} ${number === 1 ? "child" : "children"}`}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="booking-room" className="field-label">
                            Room preference
                          </label>
                          <select
                            id="booking-room"
                            value={trip.room}
                            onChange={(event) => updateTrip("room", event.target.value)}
                            className="field-input appearance-none"
                          >
                            {roomTypes.map((room) => (
                              <option key={room} value={room}>
                                {room}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <fieldset className="mt-7">
                        <legend className="field-label">Little extras</legend>
                        <div className="grid gap-2.5">
                          {extrasList.map((extra) => {
                            const checked = trip.extras.includes(extra.id)
                            return (
                              <label
                                key={extra.id}
                                className={cx(
                                  "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                                  checked
                                    ? "border-cream/30 bg-cream-2"
                                    : "border-line bg-surface hover:border-gold/40",
                                )}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleExtra(extra.id)}
                                  className="mt-0.5 h-4 w-4 shrink-0 accent-forest"
                                />
                                <span className="flex-1">
                                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                                    <span className="text-[12px] font-extrabold text-ink">{extra.label}</span>
                                    <span className="text-[12px] font-bold text-cream">
                                      {formatPrice(extra.price)}{" "}
                                      <span className="text-[9px] font-semibold text-muted">{extra.unit}</span>
                                    </span>
                                  </span>
                                  <span className="mt-1 block text-[11px] leading-relaxed text-muted">
                                    {extra.description}
                                  </span>
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      </fieldset>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="animate-fade">
                      <span className="eyebrow">Step two</span>
                      <h2 className="mt-3 font-display text-[26px] md:text-[30px]">Who is travelling?</h2>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted">
                        We will use these details to confirm availability and send your itinerary.
                      </p>

                      <div className="mt-7 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="booking-first" className="field-label">
                            First name *
                          </label>
                          <input
                            id="booking-first"
                            type="text"
                            value={traveler.firstName}
                            onChange={(event) => updateTraveler("firstName", event.target.value)}
                            placeholder="Sohail"
                            className={cx("field-input", errors.firstName && "field-input-error")}
                          />
                          <FieldError message={errors.firstName} />
                        </div>
                        <div>
                          <label htmlFor="booking-last" className="field-label">
                            Last name *
                          </label>
                          <input
                            id="booking-last"
                            type="text"
                            value={traveler.lastName}
                            onChange={(event) => updateTraveler("lastName", event.target.value)}
                            placeholder="Khan"
                            className={cx("field-input", errors.lastName && "field-input-error")}
                          />
                          <FieldError message={errors.lastName} />
                        </div>
                        <div>
                          <label htmlFor="booking-email" className="field-label">
                            Email address *
                          </label>
                          <input
                            id="booking-email"
                            type="email"
                            value={traveler.email}
                            onChange={(event) => updateTraveler("email", event.target.value)}
                            placeholder="you@example.com"
                            className={cx("field-input", errors.email && "field-input-error")}
                          />
                          <FieldError message={errors.email} />
                        </div>
                        <div>
                          <label htmlFor="booking-phone" className="field-label">
                            Phone / WhatsApp *
                          </label>
                          <input
                            id="booking-phone"
                            type="tel"
                            value={traveler.phone}
                            onChange={(event) => updateTraveler("phone", event.target.value)}
                            placeholder="+92 300 000 0000"
                            className={cx("field-input", errors.phone && "field-input-error")}
                          />
                          <FieldError message={errors.phone} />
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="booking-country" className="field-label">
                            Country of residence *
                          </label>
                          <select
                            id="booking-country"
                            value={traveler.country}
                            onChange={(event) => updateTraveler("country", event.target.value)}
                            className="field-input appearance-none"
                          >
                            {countries.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                          <FieldError message={errors.country} />
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="booking-notes" className="field-label">
                            Anything we should know?
                          </label>
                          <textarea
                            id="booking-notes"
                            rows={4}
                            value={traveler.notes}
                            onChange={(event) => updateTraveler("notes", event.target.value)}
                            placeholder="Dietary needs, celebrations, accessibility, places you have dreamed about…"
                            className="field-input resize-none"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex items-start gap-3 rounded-xl border border-line bg-cream-2 p-4">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        <p className="text-[11px] leading-relaxed text-muted">
                          Travelling for a special occasion? Tell us — we have arranged birthdays at 3,000
                          metres, proposals on sandbanks and very good cake in the mountains.
                        </p>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="animate-fade">
                      <span className="eyebrow">Step three</span>
                      <h2 className="mt-3 font-display text-[26px] md:text-[30px]">Almost there.</h2>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted">
                        Choose how you would like to proceed. Nothing is charged until a designer confirms
                        availability with you.
                      </p>

                      <div className="mt-7 space-y-2.5">
                        {paymentOptions.map(({ id, title, text, Icon }) => {
                          const checked = confirm.payment === id
                          return (
                            <label
                              key={id}
                              className={cx(
                                "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                                checked
                                  ? "border-forest bg-cream-2 ring-1 ring-gold/25"
                                  : "border-line hover:border-gold/40",
                              )}
                            >
                              <input
                                type="radio"
                                name="payment"
                                value={id}
                                checked={checked}
                                onChange={() => setConfirm((prev) => ({ ...prev, payment: id }))}
                                className="sr-only"
                              />
                              <span
                                className={cx(
                                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                  checked ? "bg-gold text-night" : "bg-cream/5 text-cream",
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="flex-1">
                                <span className="flex flex-wrap items-baseline justify-between gap-2">
                                  <span className="text-[12px] font-extrabold text-ink">{title}</span>
                                  <span className="text-[12px] font-bold text-cream">
                                    {id === "deposit"
                                      ? formatPrice(deposit)
                                      : id === "full"
                                        ? formatPrice(total)
                                        : "No payment"}
                                  </span>
                                </span>
                                <span className="mt-1 block text-[11px] leading-relaxed text-muted">{text}</span>
                              </span>
                              <span
                                className={cx(
                                  "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                  checked ? "border-gold bg-gold" : "border-cream/30",
                                )}
                              >
                                {checked && <span className="h-1.5 w-1.5 rounded-full bg-surface" />}
                              </span>
                            </label>
                          )
                        })}
                      </div>

                      <div className="mt-6 rounded-xl border border-line bg-cream-2 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted">
                            Booking summary
                          </p>
                          <p className="text-[11px] font-bold text-ink">
                            {trip.adults} adult{trip.adults > 1 ? "s" : ""}
                            {trip.children > 0 ? ` · ${trip.children} children` : ""} · {nights} nights
                          </p>
                        </div>
                        <p className="mt-2 font-display text-[20px] text-ink">
                          {selectedTour?.title || destination.name}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-muted">
                          {formatDate(trip.date)} → {formatDate(trip.returnDate)} · {trip.room}
                        </p>
                        <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
                          <span className="text-[11px] font-semibold text-muted">
                            {confirm.payment === "deposit" ? "Due today (25%)" : confirm.payment === "full" ? "Due today" : "Due today"}
                          </span>
                          <span className="font-display text-[24px] font-semibold text-cream">
                            {confirm.payment === "deposit"
                              ? formatPrice(deposit)
                              : confirm.payment === "full"
                                ? formatPrice(total)
                                : "—"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5">
                        <label htmlFor="booking-terms" className="flex items-start gap-2.5 text-[11px] leading-relaxed text-muted">
                          <input
                            id="booking-terms"
                            type="checkbox"
                            checked={confirm.terms}
                            onChange={(event) => {
                              setConfirm((prev) => ({ ...prev, terms: event.target.checked }))
                              setErrors((prev) => ({ ...prev, terms: "" }))
                            }}
                            className="mt-0.5 h-4 w-4 shrink-0 accent-forest"
                          />
                          <span>
                            I agree to Dream's booking terms and cancellation policy, and confirm that I am
                            over 18. I understand this is a request, not a confirmed reservation.
                          </span>
                        </label>
                        <FieldError message={errors.terms} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-cream-2 px-6 py-5 md:px-8">
                  {step > 0 ? (
                    <button type="button" onClick={goBack} className="btn btn-outline btn-sm">
                      <ArrowLeft />
                      Back
                    </button>
                  ) : (
                    <Link to="/destinations" className="inline-flex items-center gap-2 text-[11px] font-extrabold text-muted transition hover:text-cream">
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Keep exploring
                    </Link>
                  )}

                  {step < 2 ? (
                    <button type="button" onClick={goNext} className="btn btn-primary">
                      Continue
                      <ArrowRight />
                    </button>
                  ) : (
                    <button type="button" onClick={submitBooking} className="btn btn-gold">
                      Confirm booking request
                      <CheckCircle2 />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { Icon: ShieldCheck, title: "Secure & private", text: "Your details stay with us." },
                  { Icon: CalendarDays, title: "Flexible dates", text: "Free changes up to 30 days." },
                  { Icon: Headset, title: "Human support", text: "A real person, 24/7." },
                ].map(({ Icon, title, text }) => (
                  <div key={title} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
                    <Icon className="h-4 w-4 shrink-0 text-gold" />
                    <div>
                      <p className="text-[11px] font-extrabold text-ink">{title}</p>
                      <p className="text-[10px] text-muted">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Summary
              destination={destination}
              selectedTour={selectedTour}
              trip={trip}
              nights={nights}
              basePrice={basePrice}
              adultsTotal={adultsTotal}
              childrenTotal={childrenTotal}
              extraLines={extraLines}
              discount={discount}
              serviceFee={serviceFee}
              total={total}
              deposit={deposit}
              payment={confirm.payment}
            />
          </div>
        </div>
      </section>

      {success && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-forest-deep/75 p-4 backdrop-blur-md">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Booking request received"
            className="animate-pop relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-surface p-7 shadow-float md:p-9"
          >
            <button
              type="button"
              onClick={() => setSuccess(null)}
              aria-label="Close confirmation"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-forest hover:text-cream"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green text-night">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <span className="eyebrow mt-5">Request received</span>
            <h2 className="mt-3 font-display text-[32px] leading-tight text-ink">Your journey starts here.</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              Thank you, {traveler.firstName || "traveller"}. A travel designer will email you within 24 hours
              to confirm availability and send a secure payment link. Your place is held for 48 hours.
            </p>

            <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted">Reference</span>
                <span className="rounded-full bg-cream/5 px-3 py-1 font-mono text-[11px] font-bold text-cream">
                  {success.reference}
                </span>
              </div>
              <div className="mt-3 space-y-2 text-[12px]">
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Journey</span>
                  <span className="text-right font-bold text-ink">{selectedTour?.title || destination.name}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Dates</span>
                  <span className="font-bold text-ink">
                    {formatDate(trip.date)} → {formatDate(trip.returnDate)}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Travellers</span>
                  <span className="font-bold text-ink">
                    {trip.adults} adult{trip.adults > 1 ? "s" : ""}
                    {trip.children > 0 ? `, ${trip.children} children` : ""}
                  </span>
                </div>
                <div className="flex justify-between gap-3 border-t border-line pt-3">
                  <span className="text-muted">
                    {confirm.payment === "deposit" ? "Deposit due" : confirm.payment === "full" ? "Total" : "Total (pay later)"}
                  </span>
                  <span className="font-display text-lg font-semibold text-cream">
                    {confirm.payment === "deposit" ? formatPrice(success.deposit) : formatPrice(success.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/" className="btn btn-primary btn-sm" onClick={() => setSuccess(null)}>
                Back to home
              </Link>
              <Link to="/destinations" className="btn btn-outline btn-sm" onClick={() => setSuccess(null)}>
                Explore more
              </Link>
              <Link to="/contact" className="btn btn-outline btn-sm" onClick={() => setSuccess(null)}>
                Contact us
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
