import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  Check,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react"

import PageHero from "../components/PageHero"
import Accordion from "../components/Accordion"
import { InstagramIcon, WhatsappIcon } from "../components/SocialIcons"
import { contact, faqs } from "../data/site"
import { useApp } from "../context/AppContext"
import { cx } from "../utils/format"

const subjects = [
  "A new journey",
  "An existing booking",
  "A private group",
  "Press or partnership",
  "Something else",
]

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "A new journey",
  message: "",
  consent: false,
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const { notify } = useApp()

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (form.name.trim().length < 2) nextErrors.name = "Please tell us your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Please enter a valid email address."
    if (form.message.trim().length < 10) nextErrors.message = "A little more detail helps us help you."
    if (!form.consent) nextErrors.consent = "Please agree to us storing your message."

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSent(true)
    setForm(initialForm)
    notify("Message sent — we will be in touch within one working day.")
  }

  return (
    <>
      <PageHero
        label="Contact"
        eyebrow="Say hello"
        title={
          <>
            Let's plan something <em className="font-light italic text-gold-soft">beautiful.</em>
          </>
        }
        subtitle="A question about a journey, a date that is not on the site, or simply a place you cannot stop thinking about — we would love to hear it."
        image="/images/blog-3.jpg"
      />

      <section className="section">
        <div className="container-x">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                Icon: MapPin,
                title: "Visit us",
                lines: [contact.address],
                href: "https://maps.google.com/?q=Blue+Area+Islamabad",
                external: true,
              },
              {
                Icon: Phone,
                title: "Call us",
                lines: [contact.phone, "Mon–Sat, 9am–7pm"],
                href: contact.phoneHref,
              },
              {
                Icon: Mail,
                title: "Email us",
                lines: [contact.email, "We reply within a day"],
                href: `mailto:${contact.email}`,
              },
              {
                Icon: Clock,
                title: "Office hours",
                lines: ["Monday – Saturday", "9:00 am – 7:00 pm PKT"],
              },
            ].map(({ Icon, title, lines, href, external }, index) => {
              const content = (
                <>
                  <span className="icon-round">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-5 font-sans text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink">
                    {title}
                  </h2>
                  {lines.map((line) => (
                    <p key={line} className="mt-1 text-[12px] leading-relaxed text-muted">
                      {line}
                    </p>
                  ))}
                  {href && (
                    <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-cream">
                      Open
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  )}
                </>
              )

              return href ? (
                <a
                  key={title}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  data-reveal
                  style={{ transitionDelay: `${index * 60}ms` }}
                  className="group rounded-card border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-soft"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={title}
                  data-reveal
                  style={{ transitionDelay: `${index * 60}ms` }}
                  className="rounded-card border border-line bg-surface p-5"
                >
                  {content}
                </div>
              )
            })}
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <div className="rounded-card border border-line bg-surface p-6 shadow-soft md:p-8" data-reveal>
              <span className="eyebrow">Send a note</span>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.5rem)]">Tell us about your trip.</h2>
              <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted">
                Share as much or as little as you like. A real person — usually Sohail or Sana — will reply
                within one working day.
              </p>

              {sent ? (
                <div className="mt-8 rounded-2xl border border-green/20 bg-green/5 p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green text-night">
                    <Check className="h-5 w-5" strokeWidth={3} />
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-cream">Your note is with us.</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    Thank you for writing. We will be in touch within one working day. In the meantime, the
                    journal is a good place to dream.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link to="/journal" className="btn btn-primary btn-sm">
                      Read the journal
                      <ArrowUpRight />
                    </Link>
                    <button type="button" onClick={() => setSent(false)} className="btn btn-outline btn-sm">
                      Send another note
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="field-label">
                        Your name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={form.name}
                        onChange={(event) => update("name", event.target.value)}
                        placeholder="Sohail Bangash"
                        aria-invalid={Boolean(errors.name)}
                        className={cx("field-input", errors.name && "field-input-error")}
                      />
                      {errors.name && <p className="mt-1.5 text-[11px] font-semibold text-clay">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="field-label">
                        Email address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(event) => update("email", event.target.value)}
                        placeholder="you@example.com"
                        aria-invalid={Boolean(errors.email)}
                        className={cx("field-input", errors.email && "field-input-error")}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-[11px] font-semibold text-clay">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-phone" className="field-label">
                        Phone / WhatsApp (optional)
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(event) => update("phone", event.target.value)}
                        placeholder="+92 300 000 0000"
                        className="field-input"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="field-label">
                        What is this about?
                      </label>
                      <select
                        id="contact-subject"
                        value={form.subject}
                        onChange={(event) => update("subject", event.target.value)}
                        className="field-input appearance-none"
                      >
                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="field-label">
                      Your message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={form.message}
                      onChange={(event) => update("message", event.target.value)}
                      placeholder="Dates, places, questions — anything that helps us picture your trip."
                      aria-invalid={Boolean(errors.message)}
                      className={cx("field-input resize-none", errors.message && "field-input-error")}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-[11px] font-semibold text-clay">{errors.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-consent" className="flex items-start gap-2.5 text-[11px] leading-relaxed text-muted">
                      <input
                        id="contact-consent"
                        type="checkbox"
                        checked={form.consent}
                        onChange={(event) => update("consent", event.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-forest"
                      />
                      <span>
                        I am happy for Dream to store this message and contact me about my enquiry. No
                        marketing without my say-so.
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="mt-1.5 text-[11px] font-semibold text-clay">{errors.consent}</p>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Send my note
                    <Send />
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-5" data-reveal style={{ transitionDelay: "90ms" }}>
              <div className="overflow-hidden rounded-card border border-line bg-surface shadow-soft">
                <iframe
                  title="Dream office location in Islamabad"
                  src={contact.map}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[300px] w-full border-0"
                />
                <div className="flex items-start gap-3 p-5">
                  <span className="icon-round h-10 w-10">
                    <MapPin className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <p className="text-[12px] font-extrabold text-ink">Our studio</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted">{contact.address}</p>
                  </div>
                </div>
              </div>

              <div className="on-dark relative overflow-hidden rounded-card bg-forest p-6 text-cream">
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-[160px] w-[160px] rounded-full bg-gold/15 blur-[60px]"
                  aria-hidden="true"
                />
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366]">
                  <WhatsappIcon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-[22px] text-cream">Prefer a quick chat?</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-cream/60">
                  WhatsApp us during office hours and we will reply, usually within the hour.
                </p>
                <p className="mt-3 font-display text-[18px] tracking-[0.02em] text-cream">{contact.whatsapp}</p>
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-glass btn-sm mt-5"
                >
                  Message on WhatsApp
                  <ArrowUpRight />
                </a>
              </div>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-card border border-line bg-surface p-5 transition hover:border-gold/40 hover:shadow-soft"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/5 text-cream">
                  <InstagramIcon className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="text-[12px] font-extrabold text-ink">@dream.travel</p>
                  <p className="text-[11px] text-muted">New frames from the road, every week.</p>
                </div>
                <ArrowUpRight className="ml-auto h-4 w-4 text-muted" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream-2">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div data-reveal>
            <span className="eyebrow">Before you ask</span>
            <h2 className="mt-4 text-balance text-[clamp(2rem,3.6vw,3rem)]">
              The questions we hear <em className="font-light italic text-green">most.</em>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              A few answers to save you an email. If yours is not here, the form above is the fastest way to
              reach a real person.
            </p>
            <div className="mt-7 rounded-2xl border border-line bg-surface p-5">
              <p className="text-[12px] font-extrabold text-ink">Still unsure?</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">
                Book a no-obligation call with a trip designer.
              </p>
              <Link to="/booking" className="link-arrow mt-3">
                Start a conversation
                <ArrowUpRight />
              </Link>
            </div>
          </div>

          <div data-reveal style={{ transitionDelay: "90ms" }}>
            <Accordion items={faqs.map((faq) => ({ title: faq.q, content: faq.a }))} />
          </div>
        </div>
      </section>
    </>
  )
}
