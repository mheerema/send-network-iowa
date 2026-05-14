import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talk to Someone | Send Network Iowa",
  description:
    "Connect with the Send Network Iowa team. No pressure, no forms. Just a conversation about planting or partnering in Iowa.",
};

export default function ContactPage() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-4">
          Contact
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-brand-navy mb-6">
          Talk to Someone
        </h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          Whether you are considering planting, want to explore partnership, or
          just have questions about Iowa church planting, the Send Network Iowa team wants to
          hear from you. No pressure. No forms. Just a conversation.
        </p>
        <a
          href="mailto:info@sendnetworkiowa.org"
          className="inline-flex items-center px-8 py-4 rounded-full bg-brand-amber text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          info@sendnetworkiowa.org
        </a>
        <p className="mt-8 text-xs text-gray-400">
          Contact form stub. A real contact form or Calendly embed can be wired
          in here once Send Network Iowa confirms the preferred intake method.
        </p>
      </div>
    </section>
  );
}
