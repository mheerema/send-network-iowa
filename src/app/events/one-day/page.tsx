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

export const metadata: Metadata = {
  title: "One Day — The Work of the Pastor | Send Network Iowa",
  description:
    "A full-day gathering for pastors, church leaders, and church planters. August 28, 2026 · First Family Church, Ankeny, IA. Featuring Tony Merida and Brian Croft.",
};

const REGISTRATION_URL =
  "https://web.cvent.com/event/65de6a21-94e2-4911-b20a-9218e3e9481b/summary";

const speakers = [
  {
    name: "Tony Merida",
    track: "Preaching Track",
    photo: "/images/speakers/tony-merida.jpg",
    bio: "Founding pastor of Imago Dei Church in Raleigh, NC, and Vice President of Planter Development for Send Network. Faculty at Grimké Seminary. Council member of The Gospel Coalition. Author of numerous books on preaching, church planting, and biblical exposition. MDiv, MTheo, PhD — New Orleans Baptist Theological Seminary.",
  },
  {
    name: "Brian Croft",
    track: "Pastoring Track",
    photo: "/images/speakers/brian-croft.jpg",
    bio: "Founder of Practical Shepherding. Senior Fellow at the Mathena Center for Church Revitalization, Southern Seminary. Served 17 years as senior pastor at Auburndale Baptist Church in Louisville, KY. Author of 25+ books on pastoral ministry, shepherding, and church health.",
  },
];

const schedule = [
  { time: "8:30am", item: "Registration & Fellowship" },
  { time: "9:00am", item: "Opening Worship & Prayer" },
  { time: "9:45–10:30am", item: "Session 1" },
  { time: "10:45–11:30am", item: "Session 2" },
  { time: "11:30am", item: "Lunch" },
  {
    time: "12:30pm",
    item: "Ministry Tracks",
    tracks: [
      { label: "Preaching", leaders: "Tony Merida" },
      { label: "Pastoring", leaders: "Brian Croft" },
      { label: "Women", leaders: "Rivers Partin & Kari Minter" },
      { label: "Hispanics", leaders: "David Martinez & Israel Becerra" },
    ],
  },
  { time: "2:30pm", item: "Closing" },
  { time: "3:00pm", item: "Dismissal" },
];

export default function OneDayPage() {
  return (
    <div className={barlowCondensed.variable}>
      {/* ── Hero ── */}
      <section
        className="relative flex flex-col justify-end min-h-[90vh] px-4 sm:px-10 pb-16 pt-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(150deg, #f7931e 0%, #00a99d 42%, #1e2d6e 100%)",
        }}
      >
        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
        />

        {/* Content */}
        <div className="relative max-w-6xl mx-auto w-full">
          <p className="text-white/70 text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Send Network Iowa &nbsp;·&nbsp; August 28, 2026
          </p>

          <h1
            className="font-[family-name:var(--font-barlow-condensed)] font-extrabold uppercase leading-none text-white"
            style={{ fontSize: "clamp(5rem, 18vw, 14rem)", letterSpacing: "-0.01em" }}
          >
            One Day
          </h1>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px w-16 bg-white/40" />
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
              <path d="M0 7h14M9 1l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 7h14M17 1l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
            </svg>
            <div className="h-px flex-1 bg-white/20" />
          </div>

          <p className="text-white text-xl sm:text-2xl font-semibold mb-2">
            The Work of the Pastor
          </p>
          <p className="text-white/60 text-sm mb-10">
            First Family Church &nbsp;·&nbsp; 317 SE Magazine Rd, Ankeny, IA
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-7 py-3 rounded-full bg-white text-gray-900 text-sm font-bold hover:bg-white/90 transition-colors"
            >
              Register Now
            </a>
            <Link
              href="/events"
              className="inline-flex items-center px-7 py-3 rounded-full border border-white/40 text-white text-sm font-semibold hover:border-white/70 transition-colors"
            >
              All Iowa Events
            </Link>
          </div>
        </div>
      </section>

      {/* ── Speakers ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-amber mb-12">
            Featured Speakers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-16">
            {speakers.map((speaker) => (
              <div key={speaker.name}>
                {/* Photo */}
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-7 bg-gray-100">
                  <Image
                    src={speaker.photo}
                    alt={speaker.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    priority
                  />
                  {/* Bottom gradient + track label */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-5 left-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-amber">
                      {speaker.track}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <h2 className="text-2xl font-bold text-brand-navy mb-3">
                  {speaker.name}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {speaker.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section
        className="py-24 text-white"
        style={{
          background:
            "linear-gradient(150deg, #1e2d6e 0%, #00a99d 60%, #f7931e 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-4">
            About the Day
          </p>
          <h2
            className="font-[family-name:var(--font-barlow-condensed)] font-extrabold uppercase text-5xl sm:text-6xl leading-none mb-8"
          >
            One Day. One Mission.
          </h2>
          <p className="text-white/80 leading-relaxed text-base">
            One Day is a full-day gathering for pastors, church leaders, and
            church planters built around two irreducible priorities: preaching
            and shepherding. Morning sessions bring everyone together around the
            Word and prayer. After lunch, ministry tracks give each group focused
            time with practitioners who have spent decades in the work.
          </p>
          <p className="mt-4 text-white/60 text-sm">
            Lunch is provided.
          </p>
        </div>
      </section>

      {/* ── Schedule ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-amber mb-8">
            Schedule
          </p>
          <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {schedule.map((row) => (
              <div
                key={row.time}
                className="px-6 py-5 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8"
              >
                <span className="shrink-0 text-xs text-gray-400 font-semibold sm:w-36 pt-0.5">
                  {row.time}
                </span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800">{row.item}</span>
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
                          <span className="text-xs text-gray-500 leading-relaxed">
                            {track.leaders}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location ── */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-amber mb-4">
            Location
          </p>
          <h2 className="text-2xl font-bold text-brand-navy mb-1">
            First Family Church
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            317 SE Magazine Rd, Ankeny, IA 50021
          </p>
          <a
            href="https://maps.google.com/?q=317+SE+Magazine+Rd+Ankeny+IA+50021"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-semibold text-brand-amber hover:opacity-80 transition-opacity"
          >
            Get directions &rarr;
          </a>
        </div>
      </section>

      {/* ── Register CTA ── */}
      <section
        className="py-28 text-white text-center"
        style={{
          background:
            "linear-gradient(150deg, #f7931e 0%, #00a99d 42%, #1e2d6e 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
            August 28, 2026 &nbsp;·&nbsp; Ankeny, IA
          </p>
          <h2
            className="font-[family-name:var(--font-barlow-condensed)] font-extrabold uppercase leading-none mb-8"
            style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}
          >
            Join Us
          </h2>
          <a
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 rounded-full bg-white text-gray-900 text-sm font-bold hover:bg-white/90 transition-colors"
          >
            Register Now
          </a>
        </div>
      </section>
    </div>
  );
}
