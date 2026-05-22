import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner with Send Network Iowa",
  description:
    "Send Network Iowa connects churches and planters across Iowa to resources that help them prepare, assess, care for one another, and equip their teams.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://sendnetworkiowa.com" },
    { "@type": "ListItem", position: 2, name: "Partner", item: "https://sendnetworkiowa.com/partner" },
  ],
};

export default function PartnerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Page hero */}
      <section className="bg-brand-navy py-16 sm:py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-4">
              For Sending Churches
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Your church was made to multiply
            </h1>
            <p className="mt-6 text-white/70 leading-relaxed">
              Send Network Iowa connects churches and planters across Iowa to
              resources that help them prepare for the planting journey, assess
              their readiness, care for one another along the way, and equip
              their teams to reach their communities.
            </p>
          </div>
        </div>
      </section>

      {/* Get started CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <a
            href="https://www.sendnetwork.com/send/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-full bg-brand-amber text-brand-navy text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started on Send Network &rarr;
          </a>
        </div>
      </section>
    </>
  );
}
