import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "The Iowa Opportunity | Send Network Iowa",
  description:
    "The case for Iowa as a priority mission field. State demographics, spiritual landscape, and why church planting is urgent across every Iowa context.",
};

interface DataPoint {
  stat: string;
  label: string;
  note: string;
}

const dataPoints: DataPoint[] = [
  {
    stat: "3.2M",
    label: "Total population",
    note: "A mid-sized state with significant unreached communities, often overlooked by national church planting networks.",
  },
  {
    stat: "930+",
    label: "Towns without an evangelical church",
    note: "More than half of Iowa's incorporated towns have no SBC-affiliated or evangelical congregation.",
  },
  {
    stat: "77",
    label: "Counties",
    note: "Iowa spans urban centers, college towns, and deeply rural counties — each requiring contextually appropriate church planting approaches.",
  },
  {
    stat: "29%",
    label: "Church attendance rate",
    note: "Iowa's weekly church attendance has declined significantly over two generations, creating urgency for new gospel-centered congregations.",
  },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://sendnetworkiowa.com" },
    { "@type": "ListItem", position: 2, name: "The Iowa Opportunity", item: "https://sendnetworkiowa.com/iowa" },
  ],
};

export default function IowaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Page hero */}
      <section className="relative bg-brand-green py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/sending-lab-adel/2025-Sending-Lab-05.jpg"
            alt="Iowa gathering"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-4">
              The Case for Iowa
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Iowa is not a pit stop.
              <br />
              It&rsquo;s a mission field.
            </h1>
            <p className="mt-6 text-white/80 leading-relaxed">
              This is the page no national Send Network site has. A clear-eyed
              look at Iowa, who lives here, what they believe, and why new
              churches are the answer.
            </p>
          </div>
        </div>
      </section>

      {/* Data section */}
      <section className="py-20 bg-brand-navy">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              The numbers don&rsquo;t lie
            </h2>
            <p className="mt-4 text-white/60 text-sm max-w-xl mx-auto">
              Iowa-specific data and sources will populate this section. Every
              stat will be cited and honest.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {dataPoints.map((dp) => (
              <div key={dp.label} className="text-center">
                <p className="text-5xl font-bold text-brand-amber leading-none mb-2">
                  {dp.stat}
                </p>
                <p className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                  {dp.label}
                </p>
                <p className="text-sm text-white/50 leading-relaxed">{dp.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Geographic diversity */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
                Geographic Diversity
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-brand-navy mb-4">
                Urban, suburban, and rural — all mission fields
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Iowa is not monolithic. Des Moines is growing. Cedar Rapids,
                Davenport, and Sioux City have distinct urban contexts. College
                towns like Ames, Iowa City, and Cedar Falls carry their own
                cultural dynamics. And hundreds of small towns across the state
                have never had a healthy church.
              </p>
            </div>
            <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden">
              <Image
                src="/images/sending-lab-adel/2025-Sending-Lab-06.jpg"
                alt="Iowa community gathering"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Spiritual landscape */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
            Spiritual Landscape
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy mb-4">
            What Iowa believes (and what it doesn&rsquo;t)
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-8">
            Iowa&rsquo;s religious landscape — mainline decline, unchurched growth, and evangelical pockets — tells a story that demands a planting response.
          </p>
        </div>
      </section>

    </>
  );
}
