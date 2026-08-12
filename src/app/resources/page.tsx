import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources | Send Network Iowa",
  description:
    "A portal to church-planting resources for Iowa — video and articles from Send Network Iowa events, plus the full Send Network resource library.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://sendnetworkiowa.com" },
    { "@type": "ListItem", position: 2, name: "Resources", item: "https://sendnetworkiowa.com/resources" },
  ],
};

export default function ResourcesPage() {
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
              Resources
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Equipping the church-planting movement in Iowa
            </h1>
          </div>
        </div>
      </section>

      {/* Portal cards */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-700 leading-relaxed max-w-2xl mb-10">
            Start here to find resources for planting and multiplying churches
            across Iowa &mdash; both what we&rsquo;re building locally and the
            full library from Send Network.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Card: Articles (internal) */}
            <Link
              href="/resources/articles"
              className="group flex flex-col rounded-2xl border border-brand-light-gray bg-white p-8 transition-colors hover:border-brand-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-amber"
            >
              <span className="inline-flex w-fit items-center rounded-full bg-brand-amber/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">
                Send Network Iowa
              </span>
              <h2 className="mt-5 text-2xl font-bold text-brand-navy">
                Articles
              </h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                News and commentary for the work in Iowa &mdash; what
                we&rsquo;re reading and sharing.
              </p>
              <span className="mt-6 inline-flex w-fit items-center text-sm font-semibold text-brand-navy group-hover:text-brand-amber transition-colors">
                Browse articles
                <span aria-hidden="true" className="ml-1">&rarr;</span>
              </span>
            </Link>

            {/* Card: Iowa Church Planting Resources (coming soon) */}
            <div className="flex flex-col rounded-2xl border border-brand-light-gray bg-brand-off-white p-8">
              <span className="inline-flex w-fit items-center rounded-full bg-brand-navy/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">
                Coming Soon
              </span>
              <h2 className="mt-5 text-2xl font-bold text-brand-navy">
                Iowa Church Planting Resources
              </h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                Video and articles from Send Network Iowa events, plus
                Iowa-specific church-planting resources &mdash; all gathered in
                one place. We&rsquo;re building this out now. Check back soon.
              </p>
              <span
                aria-hidden="true"
                className="mt-6 inline-flex w-fit items-center text-sm font-semibold text-brand-slate"
              >
                In development
              </span>
            </div>

            {/* Card: Send Network Resources (external) */}
            <a
              href="https://www.sendnetwork.com/resources/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-brand-light-gray bg-white p-8 transition-colors hover:border-brand-amber focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-amber"
            >
              <span className="inline-flex w-fit items-center rounded-full bg-brand-amber/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-navy">
                Send Network
              </span>
              <h2 className="mt-5 text-2xl font-bold text-brand-navy">
                Send Network Resources
              </h2>
              <p className="mt-3 text-gray-700 leading-relaxed">
                Explore the full national library of training, tools, and
                articles for planters and sending churches from Send Network.
              </p>
              <span className="mt-6 inline-flex w-fit items-center text-sm font-semibold text-brand-navy group-hover:text-brand-amber transition-colors">
                Visit sendnetwork.com/resources
                <span aria-hidden="true" className="ml-1">&rarr;</span>
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
