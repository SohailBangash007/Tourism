import { Link } from "react-router-dom"
import { ArrowUpRight, Check, Quote, Star } from "lucide-react"

import PageHero from "../components/PageHero"
import SectionHeading from "../components/SectionHeading"
import StatCounter from "../components/StatCounter"
import DynamicIcon from "../utils/icons"
import { InstagramIcon, LinkedinIcon } from "../components/SocialIcons"
import { stats, team, timeline, values } from "../data/site"

const promises = [
  "Local, fairly paid guides and partners",
  "Carbon-offset flights booked through us",
  "Single-use plastic free on every trip",
]

export default function About() {
  return (
    <>
      <PageHero
        label="About"
        eyebrow="Since 2012"
        title={
          <>
            We make room for <em className="font-light italic text-gold-soft">wonder.</em>
          </>
        }
        subtitle="Dream is a small travel studio in Islamabad, building journeys that are slower, kinder and a little more personal than the usual."
        image="/images/about-camp.jpg"
      />

      {/* Story */}
      <section className="section overflow-hidden">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative" data-reveal>
            <img
              src="/images/about-story.jpg"
              alt="Travellers planning a route together"
              loading="lazy"
              className="aspect-[4/5] w-[86%] rounded-[30px] object-cover shadow-card"
            />
            <img
              src="/images/dest-swat.jpg"
              alt="A green valley in Swat"
              loading="lazy"
              className="absolute -right-1 bottom-10 aspect-[3/4] w-[44%] rounded-[24px] border-[5px] border-cream object-cover shadow-card"
            />
            <div className="absolute -top-5 right-8 rounded-2xl bg-gold px-5 py-4 text-night shadow-card">
              <p className="font-display text-[28px] font-semibold leading-none">2012</p>
              <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.16em] text-night">
                the first journey
              </p>
            </div>
            <div className="absolute bottom-0 left-5 max-w-[190px] rounded-2xl border border-line bg-surface p-4 shadow-soft sm:left-10">
              <Quote className="h-5 w-5 text-gold" />
              <p className="mt-2 font-display text-[15px] italic leading-snug text-ink/80">
                “The best trips are the ones that change the shape of your week.”
              </p>
            </div>
          </div>

          <div data-reveal>
            <span className="eyebrow">Our story</span>
            <h2 className="mt-4 text-balance text-[clamp(2rem,3.8vw,3.2rem)]">
              It began with a <em className="font-light italic text-green">borrowed jeep.</em>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted md:text-[15px]">
              In 2012, ten friends squeezed into a borrowed jeep and drove north to Hunza. There was no
              itinerary, no bookings and very little planning — just a shared notebook of places we loved
              and people we wanted to visit again.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted md:text-[15px]">
              Fourteen years later, that notebook has become Dream: a small team of guides, designers and
              hosts building journeys across 48 destinations. The idea has not changed. We still travel
              slowly. We still stay with families. We still believe the best moments are the ones you could
              not have planned.
            </p>

            <div className="mt-7 space-y-2.5">
              {promises.map((promise) => (
                <p key={promise} className="flex items-center gap-2.5 text-[13px] font-semibold text-ink/75">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {promise}
                </p>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link to="/tours" className="btn btn-primary">
                Explore our journeys
                <ArrowUpRight />
              </Link>
              <div>
                <p className="font-display text-xl italic text-cream">Hamza Sheikh</p>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-muted">
                  Founder, Dream
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-cream-2">
        <div className="container-x">
          <SectionHeading
            eyebrow="What we believe"
            title={
              <>
                A different way to <em className="font-light italic text-green">go.</em>
              </>
            }
            text="Three principles guide every route we draw, every host we choose and every table we book."
            align="center"
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map((value, index) => (
              <div
                key={value.title}
                data-reveal
                style={{ transitionDelay: `${index * 90}ms` }}
                className="group relative overflow-hidden rounded-card border border-line bg-surface p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft"
              >
                <span className="pointer-events-none absolute right-5 top-4 font-display text-[60px] font-light leading-none text-sand/70">
                  0{index + 1}
                </span>
                <span className="icon-round">
                  <DynamicIcon name={value.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-[23px]">{value.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-line bg-cream/[0.03] py-14">
        <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-[38px] font-medium leading-none text-cream md:text-[46px]">
                <StatCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals || 0}
                  suffixClassName="text-gold"
                />
              </p>
              <p className="mx-auto mt-3 max-w-[150px] text-[10px] font-bold uppercase leading-relaxed tracking-[0.15em] text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="The long way round"
            title={
              <>
                Fourteen years, <em className="font-light italic text-green">one idea.</em>
              </>
            }
            text="A few milestones from the notebook — and the people who made them possible."
          />

          <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
            {timeline.map((item, index) => (
              <div
                key={item.year}
                data-reveal
                style={{ transitionDelay: `${(index % 3) * 80}ms` }}
                className="relative border-t border-cream/15 pt-6"
              >
                <span className="absolute -top-[5px] left-0 h-[9px] w-[9px] rounded-full bg-gold ring-4 ring-cream" />
                <p className="font-display text-[32px] leading-none text-gold">{item.year}</p>
                <h3 className="mt-3 font-display text-[21px]">{item.title}</h3>
                <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="section bg-cream-2">
        <div className="container-x">
          <SectionHeading
            eyebrow="The people"
            title={
              <>
                Small team, <em className="font-light italic text-green">big hearts.</em>
              </>
            }
            text="The people who answer your emails, draw your routes and meet you at the airport."
            link="/contact"
            linkLabel="Say hello"
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <article
                key={member.name}
                data-reveal
                style={{ transitionDelay: `${index * 70}ms` }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-card">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-[1100ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 via-transparent to-transparent opacity-70" />
                  <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on Instagram`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur transition hover:bg-gold hover:text-night"
                    >
                      <InstagramIcon className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur transition hover:bg-gold hover:text-night"
                    >
                      <LinkedinIcon className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
                <h3 className="mt-4 font-display text-[22px]">{member.name}</h3>
                <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold">
                  {member.role}
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{member.bio}</p>
              </article>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-5 rounded-card border border-line bg-surface px-6 py-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {team.map((member) => (
                  <img
                    key={member.name}
                    src={member.image}
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <p className="text-[13px] font-semibold text-ink/70">
                Fourteen people, six countries, one shared notebook.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-gold">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-1 text-[11px] font-extrabold text-ink">4.9 · 2,300+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-x">
          <div className="on-dark relative overflow-hidden rounded-[30px] bg-forest px-7 py-12 text-cream md:px-12 md:py-14">
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-[300px] w-[300px] rounded-full bg-gold/15 blur-[90px]"
              aria-hidden="true"
            />
            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <span className="eyebrow eyebrow-light">Come with us</span>
                <h2 className="mt-3 text-balance text-[clamp(1.9rem,3.4vw,2.8rem)] text-cream">
                  Travel with people who <em className="font-light italic text-gold-soft">care.</em>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-cream/60">
                  Whether it is your first journey with us or your fifth, you will be looked after by people
                  who have been there.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/tours" className="btn btn-gold">
                  Find a journey
                  <ArrowUpRight />
                </Link>
                <Link to="/contact" className="btn btn-glass">
                  Talk to us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
