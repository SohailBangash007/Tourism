import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { ArrowUpRight, Heart, Mail, Menu, Phone, X } from "lucide-react"
import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"
import { useApp } from "../context/AppContext"
import { contact } from "../data/site"
import { cx } from "../utils/format"

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/destinations", label: "Destinations" },
  { to: "/tours", label: "Tours" },
  { to: "/gallery", label: "Gallery" },
  { to: "/journal", label: "Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { favorites, theme } = useApp()
  const { pathname } = useLocation()
  const solid = scrolled || open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.classList.toggle("nav-open", open)
    return () => document.body.classList.remove("nav-open")
  }, [open])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-[150] transition-all duration-500",
          solid
            ? "border-b border-line bg-night/85 text-ink shadow-soft backdrop-blur-xl"
            : "on-dark bg-transparent text-cream",
        )}
      >
        <div
          className={cx(
            "container-x flex items-center justify-between gap-4 transition-all duration-500",
            scrolled ? "h-[72px] lg:h-[78px]" : "h-[78px] lg:h-[92px]",
          )}
        >
          <Logo dark={solid} onClick={() => setOpen(false)} />

          <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cx(
                    "nav-link",
                    isActive && "active",
                    solid ? "text-ink/75 hover:text-cream" : "text-cream/80 hover:text-white",
                    isActive && (solid ? "text-cream" : "text-white"),
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle solid={solid} />

            <Link
              to="/wishlist"
              aria-label={`Your wishlist, ${favorites.length} saved`}
              className={cx(
                "relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300",
                solid
                  ? "border-cream/15 text-cream hover:bg-gold hover:text-night"
                  : "border-white/20 bg-white/10 text-cream backdrop-blur-md hover:bg-white/20",
              )}
            >
              <Heart className="h-[18px] w-[18px]" />
              {favorites.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-extrabold text-night">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link to="/booking" className="btn btn-gold btn-sm hidden md:inline-flex">
              Plan your trip
              <ArrowUpRight />
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              className={cx(
                "flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 xl:hidden",
                solid
                  ? "border-cream/15 text-cream hover:bg-gold hover:text-night"
                  : "border-white/20 bg-white/10 text-cream backdrop-blur-md hover:bg-white/20",
              )}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cx(
          "fixed inset-0 z-[130] bg-forest-deep/55 backdrop-blur-sm transition-opacity duration-500 xl:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={cx(
          "fixed inset-y-0 right-0 z-[140] flex w-[min(420px,88vw)] flex-col overflow-y-auto border-l border-line bg-night-2 px-7 pb-10 pt-28 shadow-float transition-transform duration-500 xl:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav className="flex flex-col">
          {navLinks.map((link, index) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cx(
                  "flex items-center justify-between border-b border-line py-4 font-display text-[26px] font-medium transition-colors",
                  isActive ? "text-gold" : "text-ink hover:text-green",
                )
              }
              style={{ transitionDelay: open ? `${index * 35}ms` : "0ms" }}
            >
              {link.label}
              <ArrowUpRight className="h-5 w-5 text-muted" />
            </NavLink>
          ))}
        </nav>

        <Link to="/booking" onClick={() => setOpen(false)} className="btn btn-primary mt-8 w-full">
          Plan your trip
          <ArrowUpRight />
        </Link>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-line bg-cream/[0.04] px-5 py-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted">Appearance</p>
            <p className="mt-1 text-sm font-bold text-ink">
              {theme === "light" ? "Light theme" : "Dark theme"}
            </p>
          </div>
          <ThemeToggle solid />
        </div>

        <div className="mt-5 rounded-2xl border border-line bg-cream/[0.04] p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted">Need a hand?</p>
          <a href={contact.phoneHref} className="mt-3 flex items-center gap-3 text-sm font-bold text-cream">
            <Phone className="h-4 w-4 text-gold" />
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} className="mt-2.5 flex items-center gap-3 text-sm font-semibold text-ink/70">
            <Mail className="h-4 w-4 text-gold" />
            {contact.email}
          </a>
        </div>

        <p className="mt-auto pt-8 text-xs leading-relaxed text-muted">
          Small groups, thoughtful routes and people who call these places home.
        </p>
      </aside>
    </>
  )
}
