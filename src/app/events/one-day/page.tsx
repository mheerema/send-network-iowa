import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Barlow_Condensed } from "next/font/google";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

// Alt text for the official One Day 2026 share card (public/og-one-day.png),
// shared by both the Open Graph and Twitter image declarations.
const ONE_DAY_OG_ALT =
  "One Day — The Work of the Pastor. A free full-day gathering for pastors, church leaders, and church planters. August 28, 2026 in Ankeny, Iowa, featuring Tony Merida and Brian Croft.";

export const metadata: Metadata = {
  title: "One Day — The Work of the Pastor | Send Network Iowa",
  description:
    "A free full-day gathering for pastors, church leaders, and church planters. August 28, 2026 · First Family Church, Ankeny, IA. Featuring Tony Merida and Brian Croft.",
  alternates: {
    canonical: "/events/one-day",
  },
  openGraph: {
    type: "website",
    url: "/events/one-day",
    siteName: "Send Network Iowa",
    locale: "en_US",
    title: "One Day — The Work of the Pastor",
    description:
      "A free full-day gathering for pastors, church leaders, and church planters. August 28, 2026 in Ankeny, Iowa. Featuring Tony Merida & Brian Croft.",
    images: [
      {
        url: "/og-one-day.png",
        width: 1200,
        height: 630,
        alt: ONE_DAY_OG_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "One Day — The Work of the Pastor",
    description:
      "Free full-day gathering for pastors & church planters. Aug 28, 2026 · Ankeny, IA. With Tony Merida & Brian Croft.",
    images: [
      {
        url: "/og-one-day.png",
        width: 1200,
        height: 630,
        alt: ONE_DAY_OG_ALT,
      },
    ],
  },
};

const REGISTRATION_URL =
  "https://web.cvent.com/event/65de6a21-94e2-4911-b20a-9218e3e9481b/summary";

const ONE_DAY_GRADIENT =
  "linear-gradient(150deg, #f7931e 0%, #00a99d 42%, #1e2d6e 100%)";

const speakers = [
  {
    name: "Tony Merida",
    track: "Preaching Track",
    photo: "/images/speakers/tony-merida.jpg",
    role: "Founding Pastor, Imago Dei Church · VP of Planter Development, Send Network",
    bio: "Tony Merida serves as founding pastor of Imago Dei Church in Raleigh, NC, and Vice President of Planter Development for Send Network. He is faculty at Grimké Seminary, a Council member of The Gospel Coalition, and the author of numerous books on preaching, church planting, and biblical exposition. MDiv, MTheo, PhD — New Orleans Baptist Theological Seminary.",
  },
  {
    name: "Brian Croft",
    track: "Pastoring Track",
    photo: "/images/speakers/brian-croft.webp",
    role: "Founder, Practical Shepherding · Senior Fellow, Mathena Center, SBTS",
    bio: "Brian Croft is the founder of Practical Shepherding and Senior Fellow at the Mathena Center for Church Revitalization at Southern Seminary. He served 17 years as senior pastor of Auburndale Baptist Church in Louisville, KY, and is the author of 25+ books on pastoral ministry, shepherding, and church health.",
  },
];

const schedule = [
  {
    time: "8:30 AM",
    type: "ARRIVAL",
    title: "Registration & Fellowship",
    speaker: null,
    description: "Check in, grab coffee, and connect with pastors and church leaders from across Iowa.",
  },
  {
    time: "9:00 AM",
    type: "GENERAL SESSION",
    title: "Opening Worship & Prayer",
    speaker: null,
    description: null,
  },
  {
    time: "9:45 AM",
    type: "GENERAL SESSION",
    title: "Session 1",
    speaker: "Tony Merida",
    description: null,
  },
  {
    time: "10:45 AM",
    type: "GENERAL SESSION",
    title: "Session 2",
    speaker: "Brian Croft",
    description: null,
  },
  {
    time: "11:30 AM",
    type: "BREAK",
    title: "Lunch",
    speaker: null,
    description: "Lunch is provided.",
  },
  {
    time: "12:30 PM",
    type: "MINISTRY TRACKS",
    title: "Afternoon Tracks",
    speaker: null,
    description: null,
    tracks: [
      { label: "Preaching", leaders: "Tony Merida" },
      { label: "Pastoring", leaders: "Brian Croft" },
      { label: "Women", leaders: "Kari Minter" },
      { label: "Hispanics", leaders: "David Martinez & Israel Becerra" },
    ],
  },
  {
    time: "2:15 PM",
    type: "PANEL",
    title: "One Day Panel",
    speaker: "Tony Merida & Brian Croft",
    description: null,
  },
  {
    time: "3:00 PM",
    type: "DISMISSAL",
    title: "Dismissal",
    speaker: null,
    description: null,
  },
];

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "One Day — The Work of the Pastor",
  description:
    "A full-day gathering for pastors, church leaders, and church planters built around preaching and shepherding. Morning general sessions. Afternoon ministry tracks.",
  startDate: "2026-08-28T08:30:00-05:00",
  endDate: "2026-08-28T15:00:00-05:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  isAccessibleForFree: true,
  location: {
    "@type": "Place",
    name: "First Family Church",
    address: {
      "@type": "PostalAddress",
      streetAddress: "317 SE Magazine Rd",
      addressLocality: "Ankeny",
      addressRegion: "IA",
      postalCode: "50021",
      addressCountry: "US",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Send Network Iowa",
    url: "https://sendnetworkiowa.com",
  },
  performer: [
    { "@type": "Person", name: "Tony Merida" },
    { "@type": "Person", name: "Brian Croft" },
  ],
  url: "https://sendnetworkiowa.com/events/one-day",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://sendnetworkiowa.com" },
    { "@type": "ListItem", position: 2, name: "Events", item: "https://sendnetworkiowa.com/events" },
    { "@type": "ListItem", position: 3, name: "One Day — The Work of the Pastor", item: "https://sendnetworkiowa.com/events/one-day" },
  ],
};

export default function OneDayPage() {
  return (
    <div className={barlowCondensed.variable}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: ONE_DAY_GRADIENT,
          minHeight: "92vh",
        }}
      >
        {/* Grain */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />

        {/* Fade bottom into white */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #ffffff)" }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-[92vh]">

          {/* Text — left */}
          <div className="relative z-10 w-full lg:w-[52%] py-16 sm:py-20 lg:py-0">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-[0.2em] mb-5">
              Send Network Iowa &nbsp;·&nbsp; August 28, 2026
            </p>

            <h1
              className="font-[family-name:var(--font-barlow-condensed)] font-extrabold uppercase leading-[0.9] text-white"
              style={{ fontSize: "clamp(5.5rem, 15vw, 11rem)" }}
            >
              One<br />Day
            </h1>

            <div className="flex items-center gap-3 my-6">
              <div className="h-px w-12 bg-white/40" />
              <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden>
                <path d="M0 6h12M7 1l5 5-5 5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 6h13M15 1l5 5-5 5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
              </svg>
              <div className="h-px w-16 bg-white/20" />
            </div>

            <p className="text-white text-lg sm:text-xl font-semibold mb-1">
              <span className="sr-only">One Day: </span>The Work of the Pastor
            </p>
            <p className="text-white/55 text-sm mb-10">
              First Family Church &nbsp;·&nbsp; Ankeny, Iowa
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={REGISTRATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center px-7 py-3 rounded-full bg-white text-gray-900 text-sm font-bold hover:bg-white/90 transition-colors"
              >
                Register Now
              </a>
              <Link
                href="/events"
                className="focus-ring inline-flex items-center px-7 py-3 rounded-full border border-white/35 text-white text-sm font-semibold hover:border-white/60 transition-colors"
              >
                All Iowa Events
              </Link>
            </div>
          </div>

          {/* Floating photos — right */}
          <div
            aria-hidden
            className="hidden lg:flex absolute right-0 top-0 bottom-0 w-[52%] items-center justify-center gap-5 pr-4"
          >
            {/* Tony — shifted up */}
            <div
              className="relative w-[46%] flex-shrink-0 -translate-y-8"
              style={{
                aspectRatio: "3/4",
                maskImage:
                  "radial-gradient(ellipse 78% 82% at 50% 42%, black 48%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 78% 82% at 50% 42%, black 48%, transparent 100%)",
              }}
            >
              <Image
                src="/images/speakers/tony-merida-hero.jpg"
                alt="Tony Merida"
                fill
                className="object-cover"
                style={{ objectPosition: "center 20%" }}
                sizes="(max-width: 1024px) 0px, 25vw"
              />
            </div>

            {/* Brian — shifted down */}
            <div
              className="relative w-[46%] flex-shrink-0 translate-y-8"
              style={{
                aspectRatio: "3/4",
                maskImage:
                  "radial-gradient(ellipse 78% 82% at 50% 42%, black 48%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 78% 82% at 50% 42%, black 48%, transparent 100%)",
              }}
            >
              <Image
                src="/images/speakers/brian-croft-hero.jpg"
                alt="Brian Croft"
                fill
                className="object-cover"
                style={{ objectPosition: "center 20%" }}
                sizes="(max-width: 1024px) 0px, 25vw"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── Speakers ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-amber mb-12">
            Featured Speakers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-16">
            {speakers.map((speaker) => (
              <div key={speaker.name}>
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-7 bg-gray-100">
                  <Image
                    src={speaker.photo}
                    alt={speaker.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 576px"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 to-transparent" />
                  <div className="absolute bottom-5 left-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-amber">
                      {speaker.track}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-1">
                  {speaker.name}
                </h3>
                <p className="text-xs font-semibold text-[#00756c] uppercase tracking-wide mb-3">
                  {speaker.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {speaker.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About + Schedule ─────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading with amber left rule */}
          <div className="flex gap-5 items-start mb-10">
            <div className="w-1 self-stretch rounded-full bg-brand-amber shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-amber mb-2">
                About the Day
              </p>
              <h2
                className="font-[family-name:var(--font-barlow-condensed)] font-extrabold uppercase text-brand-navy leading-none"
                style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
              >
                One Day. One Mission.
              </h2>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-3 max-w-2xl">
            One Day is a full-day gathering for pastors, church leaders, and
            church planters built around two irreducible priorities: preaching
            and shepherding. Morning sessions bring everyone together around the
            Word and prayer. After lunch, four ministry tracks give each group
            focused time with practitioners who have spent decades in the work.
          </p>
          <p className="text-gray-500 text-sm mb-14">
            Lunch is provided. Open to pastors, church leaders, planters, and their teams.
          </p>

          {/* Schedule — card list with amber timeline */}
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-amber mb-6">
            Schedule
          </p>
          <ol className="relative border-l-2 border-brand-amber/30 space-y-0">
            {schedule.map((row, i) => (
              <li key={i} className="relative pl-8 pb-8 last:pb-0">
                {/* Timeline dot */}
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-brand-amber" />

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 mb-1">
                  <span className="text-xs font-bold text-brand-navy">{row.time}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#00756c]">
                    {row.type}
                  </span>
                </div>

                <p className="text-base font-semibold text-brand-navy mb-0.5">
                  {row.title}
                </p>

                {row.speaker && (
                  <p className="text-xs font-semibold text-brand-amber mb-1">{row.speaker}</p>
                )}

                {row.description && (
                  <p className="text-sm text-gray-500 leading-relaxed">{row.description}</p>
                )}

                {"tracks" in row && row.tracks && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {row.tracks.map((track) => (
                      <div
                        key={track.label}
                        className="flex items-start gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"
                      >
                        <span className="text-xs font-bold text-brand-navy uppercase tracking-wide shrink-0 pt-0.5">
                          {track.label}
                        </span>
                        <span className="text-xs text-gray-500">{track.leaders}</span>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Logistics ────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-amber mb-8">
            Logistics
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Venue</p>
              <p className="font-bold text-brand-navy text-lg mb-0.5">First Family Church</p>
              <p className="text-gray-500 text-sm mb-3">317 SE Magazine Rd, Ankeny, IA 50021</p>
              <a
                href="https://maps.google.com/?q=317+SE+Magazine+Rd+Ankeny+IA+50021"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-block py-1 text-sm font-semibold text-brand-amber hover:opacity-75 transition-opacity"
              >
                Get directions &rarr;
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Date & Time</p>
              <p className="font-bold text-brand-navy text-lg mb-0.5">August 28, 2026</p>
              <p className="text-gray-500 text-sm mb-4">Doors open at 8:30 AM · Dismissal at 3:00 PM</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Registration</p>
              <p className="text-gray-500 text-sm mb-4">Free. Lunch is provided.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Register CTA — closing bookend ───────────────────────── */}
      <section
        className="relative py-28 text-white text-center"
        style={{ background: ONE_DAY_GRADIENT }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
            August 28, 2026 &nbsp;·&nbsp; Ankeny, Iowa
          </p>
          <h2
            className="font-[family-name:var(--font-barlow-condensed)] font-extrabold uppercase leading-none text-white mb-8"
            style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}
          >
            Join Us
          </h2>
          <a
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center px-9 py-4 rounded-full bg-white text-gray-900 text-sm font-bold hover:bg-white/90 transition-colors"
          >
            Register Now
          </a>
        </div>
      </section>

    </div>
  );
}
