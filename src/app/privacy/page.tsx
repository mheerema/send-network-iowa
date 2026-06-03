import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Send Network Iowa handles information on sendnetworkiowa.com. The site collects no personal information and runs no tracking or advertising cookies.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://sendnetworkiowa.com" },
    { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://sendnetworkiowa.com/privacy" },
  ],
};

export default function PrivacyPage() {
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
              Privacy
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Privacy Policy
            </h1>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-6 text-gray-700 leading-relaxed">
            <p className="text-sm text-gray-500">Last updated: June 2, 2026.</p>

            <p>
              Send Network Iowa does not collect personal information through
              this website. The site has no contact forms, sign-up forms, or
              other features that gather information from visitors, and it does
              not ask you to create an account or submit any personal details.
            </p>

            <p>
              This website sets no tracking or advertising cookies and runs no
              identifying analytics. We do not use third-party trackers,
              advertising pixels, or marketing tools to follow visitors across
              the web.
            </p>

            <p>
              Some pages link to Send Network, the North American Mission Board
              (NAMB), and other ministry partners. Those links lead to external
              websites that we do not operate. Once you leave
              sendnetworkiowa.com, your activity is governed by the privacy
              policies of those external sites, and we encourage you to review
              them.
            </p>

            <p>
              This site is hosted by a third-party hosting provider, which may
              automatically log standard technical information such as IP
              addresses and browser type as part of normal server operation. We
              do not use this information to identify individual visitors.
            </p>

            <p>
              If you have any questions about this policy, you can reach us at{" "}
              <a
                href="mailto:matt@mattheerema.com"
                className="text-brand-navy font-semibold underline hover:opacity-80 transition-opacity"
              >
                matt@mattheerema.com
              </a>
              .
            </p>

            <p>
              We may update this policy from time to time. Any changes will be
              reflected on this page along with a revised date above.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
