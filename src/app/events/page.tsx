import type { Metadata } from "next";
import Link from "next/link";
import TalkCTA from "@/components/TalkCTA";

export const metadata: Metadata = {
  title: "Events | Send Network Iowa",
  description:
    "Iowa-specific Send Network gatherings. Sending Labs, assessments, cohort meetings, and more. Find the right event for your next step.",
};

interface Event {
  title: string;
  date: string;
  location: string;
  audience: "Planters" | "Sending Churches" | "Both" | "Couples";
  description: string;
  href?: string;
}

const events: Event[] = [
  {
    title: "Sending Lab — Adel, Iowa",
    date: "Event date TBD",
    location: "Adel, Iowa",
    audience: "Both",
    description:
      "SNI's flagship Iowa gathering. Worship, teaching, planter stories, and practical training for both planters and sending church leaders.",
  },
  {
    title: "Planter Assessment Weekend",
    date: "Event date TBD",
    location: "Des Moines area",
    audience: "Planters",
    description:
      "A focused weekend for planters moving through the Send Network assessment process. Open to couples. Details and registration through NAMB.",
    href: "https://www.namb.net/send-network/assessment/",
  },
  {
    title: "Sending Lab — Spanish Speaking",
    date: "Event date TBD",
    location: "Iowa",
    audience: "Planters",
    description:
      "A Sending Lab gathering tailored for Spanish-speaking church planting leaders and their communities. SNI's Iowa context, en español.",
  },
  {
    title: "Planter Cohort Meeting",
    date: "Quarterly",
    location: "Central Iowa (location rotates)",
    audience: "Planters",
    description:
      "Ongoing cohort gathering for active SNI-affiliated planters. Peer learning, coaching check-ins, and prayer. By invitation.",
  },
  {
    title: "Sending Church Roundtable",
    date: "Event date TBD",
    location: "Iowa",
    audience: "Sending Churches",
    description:
      "A half-day gathering for church leaders interested in becoming SNI sending church partners. Tier overview, Q&A, and next steps.",
  },
];

const audienceColors: Record<Event["audience"], string> = {
  Planters: "bg-brand-navy/10 text-brand-navy",
  "Sending Churches": "bg-brand-green/10 text-brand-green",
  Both: "bg-brand-amber/10 text-brand-amber",
  Couples: "bg-pink-50 text-pink-700",
};

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
              Everything listed here is for Iowa. No generic national events.
              Find the right gathering for where you are in the process.
            </p>
          </div>
        </div>
      </section>

      {/* Events list */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 mb-10 items-center">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mr-2">
              Audience:
            </span>
            {(["Planters", "Sending Churches", "Both"] as const).map((a) => (
              <span
                key={a}
                className={`text-xs font-semibold px-3 py-1 rounded-full ${audienceColors[a]}`}
              >
                {a}
              </span>
            ))}
          </div>

          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.title}
                className="rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-start gap-6 bg-white hover:border-brand-amber/30 transition-colors"
              >
                {/* Date block */}
                <div className="shrink-0 text-center sm:w-24">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Date
                  </p>
                  <p className="text-sm font-bold text-brand-navy mt-1 leading-snug">
                    {event.date}
                  </p>
                </div>

                {/* Event info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-brand-navy tracking-tight">
                      {event.title}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${audienceColors[event.audience]}`}
                    >
                      {event.audience}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{event.location}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                  {event.href && (
                    <a
                      href={event.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center text-sm font-semibold text-brand-amber hover:underline"
                    >
                      Register &rarr;
                    </a>
                  )}
                  {!event.href && (
                    <Link
                      href="/contact"
                      className="mt-3 inline-flex items-center text-sm font-semibold text-brand-navy hover:text-brand-amber transition-colors"
                    >
                      Get details &rarr;
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-gray-50 border border-gray-100 text-sm text-gray-500">
            <strong className="text-gray-700">Note for Matt:</strong> Event
            dates are all placeholders. Real dates, registration links, and
            capacity info should be added once confirmed. Photos from
            sending-lab-adel and sending-lab-espanol are available to use as
            event thumbnails.
          </div>
        </div>
      </section>

      <TalkCTA variant="inline" />
      <TalkCTA variant="sticky" />
    </>
  );
}
