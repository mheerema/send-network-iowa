import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Send Network Iowa",
  description:
    "Iowa Send Network gatherings — Sending Labs, Residency Builder, and more. Find the right gathering for where you are in the process.",
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

const eventsJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sendnetworkiowa.com" },
      { "@type": "ListItem", position: 2, name: "Events", item: "https://sendnetworkiowa.com/events" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Send Network Iowa Events",
    url: "https://sendnetworkiowa.com/events",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Event",
          name: "Residency Builder — Ankeny",
          startDate: "2026-12-01T13:30:00-06:00",
          endDate: "2026-12-02T15:30:00-06:00",
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: { "@type": "Place", name: "First Family Church", address: { "@type": "PostalAddress", streetAddress: "317 SE Magazine Rd", addressLocality: "Ankeny", addressRegion: "IA", postalCode: "50021", addressCountry: "US" } },
          organizer: { "@type": "Organization", name: "Send Network Iowa", url: "https://sendnetworkiowa.com" },
          url: "https://www.sendnetwork.com/events/residency-builder-ankeny-ia/",
        },
      },
    ],
  },
];

export default function EventsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />
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
          <ul className="space-y-4 list-none p-0">

            {/* Iowa events */}
            {events.map((event) => (
              <li
                key={event.registrationHref}
                className="rounded-2xl border border-gray-100 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start gap-6 hover:border-brand-amber/30 transition-colors"
              >
                {/* Date block */}
                <div className="shrink-0 sm:w-28">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
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
                  <p className="text-xs text-gray-500 mb-3">{event.location}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={event.registrationHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Register for ${event.title}`}
                      className="focus-ring inline-flex items-center px-5 py-3 rounded-full bg-brand-amber text-brand-navy text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Register
                    </a>
                    <a
                      href={event.detailHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center px-5 py-3 rounded-full border border-brand-navy text-brand-navy text-sm font-semibold hover:bg-brand-navy hover:text-white transition-colors"
                    >
                      Event details
                    </a>
                  </div>
                </div>
              </li>
            ))}

          </ul>
        </div>
      </section>

    </>
  );
}
