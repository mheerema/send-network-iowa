import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "One Day — The Work of the Pastor | Send Network Iowa",
  description:
    "A full-day gathering for pastors, church leaders, and church planters in Iowa. August 28, 2026 · First Family Church, Ankeny, IA. Featuring Tony Merida and Brian Croft.",
};

const REGISTRATION_URL =
  "https://web.cvent.com/event/65de6a21-94e2-4911-b20a-9218e3e9481b/summary";

const speakers = [
  {
    name: "Tony Merida",
    track: "Preaching Track",
    photo: "/images/speakers/tony-merida.jpg",
    bio: "Founding pastor of Imago Dei Church in Raleigh, NC, and Vice President of Planter Development for Send Network. Council member of The Gospel Coalition. Faculty at Grimké Seminary. Author of numerous books on preaching, church planting, and biblical exposition.",
  },
  {
    name: "Brian Croft",
    track: "Pastoring Track",
    photo: "/images/speakers/brian-croft.jpg",
    bio: "Founder of Practical Shepherding and Senior Fellow at the Mathena Center for Church Revitalization at Southern Seminary. Served 17 years as senior pastor in Louisville, KY. Author of 25+ books on pastoral ministry and shepherding.",
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
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-4">
            Send Network Iowa · Featured Event
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-tight max-w-2xl">
            One Day
          </h1>
          <p className="text-2xl sm:text-3xl font-bold text-white/60 mt-2 max-w-2xl">
            The Work of the Pastor
          </p>
          <p className="mt-6 text-white/60 text-sm">
            August 28, 2026 &nbsp;·&nbsp; First Family Church, Ankeny, IA
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-7 py-3 rounded-full bg-brand-amber text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Register Now
            </a>
            <Link
              href="/events"
              className="inline-flex items-center px-7 py-3 rounded-full border border-white/30 text-white/80 text-sm font-semibold hover:border-white/60 hover:text-white transition-colors"
            >
              All Iowa Events
            </Link>
          </div>
        </div>
      </section>

      {/* Speaker spotlight */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-amber text-xs font-semibold uppercase tracking-widest mb-10">
            Featured Speakers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            {speakers.map((speaker) => (
              <div key={speaker.name} className="flex flex-col">
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-gray-100">
                  <Image
                    src={speaker.photo}
                    alt={speaker.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <p className="text-brand-amber text-xs font-semibold uppercase tracking-widest mb-2">
                  {speaker.track}
                </p>
                <h2 className="text-2xl font-bold text-brand-navy mb-3">
                  {speaker.name}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {speaker.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-amber text-xs font-semibold uppercase tracking-widest mb-4">
            About the Day
          </p>
          <h2 className="text-3xl font-bold text-brand-navy mb-6">
            Built around the essential work
          </h2>
          <p className="text-gray-600 leading-relaxed">
            One Day is a full-day gathering for pastors, church leaders, and
            church planters built around two irreducible priorities: preaching
            and shepherding. Morning sessions bring everyone together around the
            Word and prayer. After lunch, ministry tracks give each group focused
            time with practitioners who have spent decades in the work.
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Lunch is provided. Bring your team.
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-amber text-xs font-semibold uppercase tracking-widest mb-6">
            Schedule
          </p>
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {schedule.map((row) => (
                <div
                  key={row.time}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6"
                >
                  <span className="shrink-0 text-xs text-gray-400 font-medium sm:w-36">
                    {row.time}
                  </span>
                  <div className="flex-1">
                    <span className="text-sm text-gray-700">{row.item}</span>
                    {"tracks" in row && row.tracks && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {row.tracks.map((track) => (
                          <span
                            key={track.label}
                            className="inline-flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-gray-600"
                          >
                            <span className="font-semibold text-brand-navy">
                              {track.label}
                            </span>
                            <span className="text-gray-400">/</span>
                            {track.leaders}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-amber text-xs font-semibold uppercase tracking-widest mb-4">
            Location
          </p>
          <h2 className="text-2xl font-bold text-brand-navy mb-2">
            First Family Church
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            317 SE Magazine Rd, Ankeny, IA 50021
          </p>
          <a
            href="https://maps.google.com/?q=317+SE+Magazine+Rd+Ankeny+IA+50021"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-brand-amber font-semibold hover:opacity-80 transition-opacity"
          >
            Get directions &rarr;
          </a>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="bg-brand-navy py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-amber text-xs font-semibold uppercase tracking-widest mb-4">
            August 28, 2026
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Register for One Day
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
            First Family Church · Ankeny, IA · Lunch provided
          </p>
          <a
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 rounded-full bg-brand-amber text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Register Now
          </a>
        </div>
      </section>
    </>
  );
}
