import { Link } from "react-router-dom"
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react"
import Logo from "./Logo"
import { contact } from "../data/site"
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon, YoutubeIcon } from "./SocialIcons"

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Destinations", to: "/destinations" },
      { label: "Tours & journeys", to: "/tours" },
      { label: "Photo gallery", to: "/gallery" },
      { label: "The journal", to: "/journal" },
      { label: "Your wishlist", to: "/wishlist" },
    ],
  },
  {
    title: "Dream",
    links: [
      { label: "Our story", to: "/about" },
      { label: "Why travel with us", to: "/about" },
      { label: "Meet the team", to: "/about" },
      { label: "Contact us", to: "/contact" },
      { label: "Book a journey", to: "/booking" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Booking help", to: "/contact" },
      { label: "FAQs", to: "/contact" },
      { label: "Cancellation policy", to: "/contact" },
      { label: "Travel insurance", to: "/contact" },
      { label: "Custom trips", to: "/booking" },
    ],
  },
]

const socials = [
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "YouTube", href: "https://youtube.com", Icon: YoutubeIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinIcon },
  { label: "X", href: "https://x.com", Icon: XIcon },
]

export default function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-forest-deep text-cream">
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-green/30 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-gold/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container-x relative pt-16 md:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.55fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/60">
              Thoughtfully crafted small-group journeys to extraordinary places — led by people who call
              them home. Since 2012.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-cream/65 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-night"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="mt-8 space-y-3 text-sm">
              <p className="flex items-start gap-3 text-cream/65">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{contact.address}</span>
              </p>
              <a href={contact.phoneHref} className="flex items-center gap-3 text-cream/65 transition hover:text-gold-soft">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                {contact.phone}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-cream/65 transition hover:text-gold-soft"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                {contact.email}
              </a>
              <p className="flex items-center gap-3 text-cream/65">
                <Clock className="h-4 w-4 shrink-0 text-gold" />
                {contact.hours}
              </p>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gold">
                {column.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-cream/70">
            Not sure where to go? <span className="text-cream">Tell us what you love — we will do the rest.</span>
          </p>
          <Link to="/contact" className="link-arrow text-gold-soft hover:text-gold">
            Talk to a designer
            <ArrowUpRight />
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 py-7 text-xs text-cream/65 lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} Dream Travel. All rights reserved. Crafted with care in Islamabad.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Secure payments</span>
            <div className="flex items-center gap-2">
              {["Visa", "Mastercard", "Amex", "Bank"].map((method) => (
                <span
                  key={method}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold tracking-wide text-cream/60"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
