import type { Metadata } from "next";
import TalkCTA from "@/components/TalkCTA";

export const metadata: Metadata = {
  title: "Events | Send Network Iowa",
  description:
    "Iowa Send Network gatherings — One Day, Sending Labs, Residency Builder, and more. Find the right gathering for where you are in the process.",
};

interface Event {
  title: string;
  date: string;
  location: string;
  description: string;
  registrationHref: string;
  detailHref: string;
}

const events: Event[] = [
  {
    title: "Sending Lab — Ankeny",
    date: "Sep 14, 2026",
    location: "First Family Church · 317 SE Magazine Rd, Ankeny, IA",
    description:
      "A one-day workshop (9:00am–3:45pm) to help church leaders develop a vision and plan for leading their church to send planters. Sessions cover sending vision, identifying potential planters, developing leaders, and multiplication strategy. Lunch and snacks provided.",
    registrationHref:
      "https://web.cvent.com/event/f7132731-b654-4c4d-bb4d-6142470e1495/summary",
    detailHref: "https://www.sendnetwork.com/events/sending-lab-ankeny-ia/",
  },
  {
    title: "Sending Lab — Davenport",
    date: "Oct 5, 2026",
    location: "Coram Deo Bible Church · 3800 E 53rd St, Davenport, IA",
    description:
      "A one-day workshop (9:00am–3:45pm) to help church leaders develop a vision and plan for leading their church to send planters. Sessions cover sending vision, identifying potential planters, developing leaders, and multiplication strategy. Lunch and snacks provided.",
    registrationHref:
      "https://web.cvent.com/event/d67f3f32-eb73-456f-ad58-82d46fc21726/summary",
    detailHref: "https://www.sendnetwork.com/events/sending-lab-davenport-ia/",
  },
  {
    title: "Residency Builder — Ankeny",
    date: "Dec 1–2, 2026",
    location: "First Family Church · 317 SE Magazine Rd, Ankeny, IA",
    description:
      "A two-day workshop to help ministry leaders build an intentional process for training qualified leaders to be church planters. Day 1: 1:30–3:30pm. Day 2: 8:00am–3:30pm. Topics include residency program design, character formation, leadership development pathways, and practical implementation.",
    registrationHref:
      "https://web.cvent.com/event/49cff91d-5e6a-459f-a50c-5e668c3832cd/summary",
    detailHref:
      "https://www.sendnetwork.com/events/residency-builder-ankeny-ia/",
  },
];

const schedule = [
  { time: "8:30am", item: "Registration and Fellowship" },
  { time: "9:00am", item: "Opening Worship and Prayer" },
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

export default function EventsPage() {
  return (
    <>
      {/* Page hero */}
      <section className="bg-brand-navy py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-4">
              Events
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Iowa-specific gatherings
            </h1>
            <p className="mt-6 text-white/70 leading-relaxed">
              Everything listed here is for Iowa. Find the right gathering for
              where you are in the process.
            </p>
          </div>
        </div>
      </section>

      {/* Featured event: One Day */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Event header */}
          <div className="mb-8">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
              Featured Event
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
                One Day — The Work of the Pastor
              </h2>
              <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-brand-amber/15 text-brand-amber">
                Registration coming soon
              </span>
            </div>
            <p className="text-sm text-gray-500">
              August 28, 2026 &nbsp;·&nbsp; First Family Church, Ankeny, IA
            </p>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-10">
            A full-day gathering for pastors, church leaders, and church
            planters built around the essential work of pastoral ministry:
            preaching and shepherding. Morning sessions bring everyone together.
            Afternoon ministry tracks give Preaching, Pastoring, Women, and
            Hispanics focused time. Lunch provided.
          </p>

          {/* Keynote speakers */}
          <div className="mb-10">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">
              Keynote Speakers
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="text-brand-amber text-xs font-semibold uppercase tracking-wider mb-2">
                  Preaching Track
                </p>
                <p className="font-bold text-brand-navy text-lg mb-1">
                  Tony Merida
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Founding pastor of Imago Dei Church in Raleigh, NC.
                  Faculty at Grimké Seminary. Council Member, The Gospel
                  Coalition.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="text-brand-amber text-xs font-semibold uppercase tracking-wider mb-2">
                  Pastoring Track
                </p>
                <p className="font-bold text-brand-navy text-lg mb-1">
                  Brian Croft
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Founder of Practical Shepherding. 17 years as a senior
                  pastor in Louisville, KY. Author of 25+ books on pastoral
                  ministry. Senior Fellow, Mathena Center, SBTS.
                </p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-brand-navy">Schedule</p>
            </div>
            <div className="divide-y divide-gray-50">
              {schedule.map((row) => (
                <div
                  key={row.time}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6"
                >
                  <span className="shrink-0 text-xs text-gray-400 font-medium sm:w-32">
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

          <p className="mt-6 text-xs text-gray-400">
            Registration details will be available on Send Network soon.
          </p>
        </div>
      </section>

      {/* Other Iowa events */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-6">
            More Iowa Events
          </p>
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.registrationHref}
                className="rounded-2xl border border-gray-100 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start gap-6 hover:border-brand-amber/30 transition-colors"
              >
                {/* Date block */}
                <div className="shrink-0 sm:w-28">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                    Date
                  </p>
                  <p className="text-sm font-bold text-brand-navy leading-snug">
                    {event.date}
                  </p>
                </div>

                {/* Event info */}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-brand-navy tracking-tight mb-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">{event.location}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={event.registrationHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2 rounded-full bg-brand-amber text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      Register
                    </a>
                    <a
                      href={event.detailHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2 rounded-full border border-brand-navy text-brand-navy text-xs font-semibold hover:bg-brand-navy hover:text-white transition-colors"
                    >
                      Event details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TalkCTA variant="inline" />
    </>
  );
}
