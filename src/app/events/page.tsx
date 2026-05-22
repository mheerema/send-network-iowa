import type { Metadata } from "next";
import Link from "next/link";
import TalkCTA from "@/components/TalkCTA";

export const metadata: Metadata = {
  title: "Events | Send Network Iowa",
  description:
    "Iowa Send Network gatherings — One Day, Sending Labs, Residency Builder, and more. Find the right gathering for where you are in the process.",
};

interface RegularEvent {
  title: string;
  date: string;
  location: string;
  description: string;
  registrationHref: string;
  detailHref: string;
}

const events: RegularEvent[] = [
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

      {/* Event list */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">

            {/* One Day — featured card */}
            <div className="rounded-2xl border-2 border-brand-amber/60 bg-brand-amber/[0.04] p-6 sm:p-8 hover:border-brand-amber transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">

                {/* Date block */}
                <div className="shrink-0 sm:w-28">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                    Date
                  </p>
                  <p className="text-sm font-bold text-brand-navy leading-snug">
                    Aug 28, 2026
                  </p>
                </div>

                {/* Event info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-base font-bold text-brand-navy tracking-tight">
                      One Day — The Work of the Pastor
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-brand-amber text-white">
                      Featured
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    First Family Church · 317 SE Magazine Rd, Ankeny, IA
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">
                    A full-day gathering for pastors, church leaders, and church
                    planters built around preaching and shepherding. Morning
                    general sessions. Afternoon ministry tracks. Lunch provided.
                    Free.
                  </p>
                  <p className="text-xs text-gray-400 mb-5">
                    Featuring{" "}
                    <span className="font-semibold text-brand-navy">Tony Merida</span>
                    {" "}and{" "}
                    <span className="font-semibold text-brand-navy">Brian Croft</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://web.cvent.com/event/65de6a21-94e2-4911-b20a-9218e3e9481b/summary"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2 rounded-full bg-brand-amber text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      Register
                    </a>
                    <Link
                      href="/events/one-day"
                      className="inline-flex items-center px-5 py-2 rounded-full border border-brand-navy text-brand-navy text-xs font-semibold hover:bg-brand-navy hover:text-white transition-colors"
                    >
                      Event details
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* Other Iowa events */}
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
