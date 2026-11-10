# Dream — Travel, beautifully.

A complete, multi-page travel & tourism website built with **React 19**, **React Router 7**, **Tailwind CSS 4** and **Vite 8**. Premium editorial design with light and dark themes, fully responsive, with working filters, wishlist, gallery lightbox, booking flow and validated forms.

---

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build
```

---

## Pages

| Route | Page | Highlights |
| --- | --- | --- |
| `/` | Home | Image hero slider, trip search, featured destinations, tours, stats counters, how-it-works, testimonial slider, gallery preview, journal |
| `/destinations` | Destinations | Live search, region filters, sorting, result counts, wishlist hearts |
| `/destinations/:id` | Destination detail | Hero, highlights, photo grid, day-by-day itinerary accordion, inclusions, sticky booking widget, related tours |
| `/tours` | Tours | Destination + category filters, sorting, pricing, FAQs, private-trip CTA |
| `/gallery` | Gallery | Category tabs with 8 photographs each, masonry layout, full keyboard-accessible lightbox |
| `/journal` | Journal | Featured story, category filters, author cards |
| `/journal/:slug` | Article | Long-form article blocks, share/copy link, author card, comment form, related posts |
| `/about` | About | Story, values, animated stats, timeline, team, socials |
| `/contact` | Contact | Contact cards, validated enquiry form, Google map, WhatsApp, FAQ accordion |
| `/booking` | Booking | 3-step form, live price summary, extras, group discount, 25% deposit, confirmation modal |
| `/wishlist` | Wishlist | Saved destinations & tours via `localStorage`, clear-all |
| `*` | 404 | Designed not-found page |

All routes are also usable with query strings, e.g. `/booking?tour=hunza-autumn&adults=4` or `/tours?destination=maldives&category=Beaches`.

---

## Features

- **Design system** — forest green, cream, sand and gold palette; Fraunces display serif + Manrope body; custom Tailwind theme tokens in `src/index.css`.
- **Light & dark themes** — one semantic token set drives both palettes. A `ThemeToggle` in the navbar and mobile drawer switches instantly, the choice persists in `localStorage` (`dream-theme`), and a pre-paint script in `index.html` prevents a flash. Defaults to the visitor's system preference.
- **Responsive** — mobile drawer navigation, fluid type, sticky elements, overflow-tested at 390 px and 1440 px.
- **Motion** — staggered hero reveals, slow Ken Burns imagery, scroll reveals with blur, page transitions, animated marquee, live counters, hover depth and reduced-motion support.
- **Wishlist** — heart any destination or tour; persists in `localStorage`; live badge in the navbar.
- **Booking engine (demo)** — dates, adults/children, room, extras; 10% group discount for 4+; 5% tax; 25% deposit; booking reference and `localStorage` persistence.
- **Forms** — inline validation for contact, newsletter, comments and every booking step.
- **Accessibility** — semantic landmarks, skip link, focus-visible rings, ARIA labels, keyboard lightbox (← → Esc), visible form labels, and a dual-theme axe audit (light + dark) across every route.
- **SEO** — per-route titles/descriptions via `PageMeta`, Open Graph tags, favicon, `robots.txt`.
- **Offline-ready assets** — all 40 photographs live in `public/images/`; no external image requests.
- **Deployment-ready** — SPA fallback included for Netlify (`public/_redirects`) and Vercel (`vercel.json`).

> Forms and payments are simulated on the front end. No data leaves the browser. Booking requests are stored under `dream-bookings` in `localStorage` for demonstration.

---

## Project structure

```text
├─ public/
│  ├─ images/            # 40 local travel photographs
│  ├─ favicon.svg
│  ├─ robots.txt
│  └─ _redirects         # Netlify SPA fallback
├─ scripts/
│  ├─ check.mjs          # headless smoke test (pages, images, overflow)
│  ├─ interact.mjs       # headless functional test (38 checks)
│  ├─ a11y.mjs           # axe audit for both themes across 12 routes
│  ├─ audit-states.mjs   # axe audit of interactive states (navbar, booking, lightbox, drawer)
│  └─ shots.mjs          # optional light/dark screenshot generator → scripts/shots/
├─ src/
│  ├─ components/        # Navbar, Footer, cards, sliders, lightbox, ThemeToggle…
│  ├─ context/           # wishlist, theme + toast provider
│  ├─ data/              # destinations, tours, posts, site content
│  ├─ hooks/             # scroll reveal
│  ├─ pages/             # 12 route components
│  ├─ utils/             # formatters, icon map, social icons
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css          # Tailwind theme + component classes
├─ index.html
├─ vite.config.js
└─ vercel.json
```

---

## Editing content

Almost all copy lives in plain data files:

- `src/data/destinations.js` — 12 destinations with pricing, highlights, galleries and itineraries.
- `src/data/tours.js` — signature tours and categories.
- `src/data/posts.js` — journal articles.
- `src/data/site.js` — testimonials, gallery, FAQs, stats, team, values, timeline, contact details, countries.

To add a destination, copy an object in `destinations.js`, give it a unique `id`, and add a matching image in `public/images/`. Cards, filters, detail pages, sitemap-style links and the booking dropdown update automatically.

### Theming

All colours are semantic tokens declared in the `@theme` block of `src/index.css`. The dark palette is the default; `html.light` re-maps the same token names, so every component switches without per-component overrides.

```css
/* dark (default) */
--color-night: #050f0b;      /* page background */
--color-surface: #0b1d15;    /* cards, panels */
--color-ink: #f3eee2;        /* primary text */
--color-gold: #d8ab63;       /* accents */

/* light */
--color-night: #f2f4ef;      /* porcelain-sage page */
--color-surface: #ffffff;    /* cards, panels */
--color-ink: #0d2119;        /* deep pine text */
--color-gold: #7f5c1e;       /* bronze accent, AA-safe */
```

Intentional dark areas — the home hero, page heroes, footer, CTA panels, lightbox, toast and 404 — carry the `.on-dark` scope, which re-declares the dark palette so they stay dark in light mode. Always pair `bg-gold` with `text-night` so gold surfaces keep a dark foreground in both themes.

Theme behaviour:

- Defaults to `prefers-color-scheme`, then remembers the visitor's choice in `localStorage` under `dream-theme` (`"light"` / `"dark"`).
- An inline script in `index.html` applies the stored theme before first paint to avoid a flash.
- `ThemeToggle` (sun/moon) lives in the desktop navbar and the mobile drawer's Appearance panel.
- `useApp()` exposes `theme` and `toggleTheme()` if you need them elsewhere.

---

## Verification

The project was tested in headless Chrome against the production build:

```bash
npm run build
npm run preview -- --port 4173
node scripts/check.mjs         # all pages: console errors, broken images, overflow
node scripts/interact.mjs      # 43 interaction checks
node scripts/a11y.mjs          # axe audit — light + dark across 12 routes
node scripts/audit-states.mjs  # axe audit — navbar, booking steps, lightbox, mobile drawer
```

All suites pass: zero console errors, zero broken images, **43/43** interactions, **0 axe violations** in both themes across every route, and **0 serious/critical violations** in the audited interactive states.

Need visual references? `node scripts/shots.mjs` writes light/dark desktop screenshots plus both mobile themes to `scripts/shots/` (git-ignored).

---

## Deploying

**Netlify** — build command `npm run build`, publish directory `dist`. The included `_redirects` handles client-side routing.

**Vercel** — import the repository; `vercel.json` rewrites all paths to `index.html`.

**Any static host** — upload `dist/` and configure a catch-all rewrite to `/index.html` so deep links work.

---

## Image credits

Photographs are sourced from [Unsplash](https://unsplash.com) and bundled locally for this demo. Replace them with your own licensed imagery before a commercial launch.

---

Crafted with care in Islamabad.
