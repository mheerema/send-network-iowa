import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partner with Send Network Iowa",
  description:
    "Your church can support church planting in Iowa through prayer, finances, and sending. Four partnership tiers for churches of any size.",
};

interface PartnershipTier {
  name: string;
  commitment: string;
  description: string;
  actions: string[];
  accent: string;
}

const tiers: PartnershipTier[] = [
  {
    name: "Prayer",
    commitment: "Intercede",
    description:
      "The most foundational form of partnership. Commit to pray regularly for Iowa church planters and their communities.",
    actions: [
      "Receive a monthly prayer guide with specific planter requests",
      "Include Iowa planting in your church's weekly prayer rhythms",
      "Pray for specific communities without gospel-centered churches",
    ],
    accent: "border-brand-amber/30 bg-brand-amber/5",
  },
  {
    name: "Supporting",
    commitment: "Give",
    description:
      "Financial partnership that provides direct resources to planters in the field.",
    actions: [
      "Commit a monthly or annual financial gift to Send Network Iowa",
      "Designate giving to a specific planter or region",
      "Help cover assessment and training costs for new planters",
    ],
    accent: "border-brand-navy/20 bg-brand-navy/5",
  },
  {
    name: "Sending",
    commitment: "Commission",
    description:
      "A deeper partnership where your church actively commissions a planter from within your congregation.",
    actions: [
      "Identify and encourage a planter from your church family",
      "Walk them through PACE with Send Network Iowa coaching support",
      "Provide spiritual authority and ongoing accountability",
    ],
    accent: "border-brand-green/30 bg-brand-green/5",
  },
  {
    name: "Multiplying",
    commitment: "Reproduce",
    description:
      "The fullest expression of partnership. Your church plants a daughter church in an Iowa community and commits to its growth.",
    actions: [
      "Collaborate with Send Network Iowa to identify a target community",
      "Send a core team to form the nucleus of the new church",
      "Maintain a covenant relationship with the plant for three years",
    ],
    accent: "border-brand-amber/50 bg-brand-amber/10",
  },
];

export default function PartnerPage() {
  return (
    <>
      {/* Page hero */}
      <section className="bg-brand-navy py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-4">
              For Sending Churches
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Your church was made to multiply
            </h1>
            <p className="mt-6 text-white/70 leading-relaxed">
              Church planting is not the work of lone planters. It is the work
              of whole churches. Send Network Iowa connects sending churches to planters
              across Iowa through four partnership tiers designed for churches
              of any size.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership tiers */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
              Partnership Tiers
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-navy">
              Four ways your church can partner
            </h2>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
              Every tier is a genuine partnership. Start where you are. Grow
              into more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border-2 p-8 ${tier.accent}`}
              >
                <p className="text-brand-amber text-xs font-semibold uppercase tracking-wider mb-1">
                  {tier.commitment}
                </p>
                <h3 className="text-xl font-bold text-brand-navy tracking-tight mb-3">
                  {tier.name} Partner
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  {tier.description}
                </p>
                <ul className="space-y-2">
                  {tier.actions.map((action) => (
                    <li
                      key={action}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="mt-0.5 text-brand-amber font-bold">
                        &rsaquo;
                      </span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to adopt a plant */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
            Getting Started
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy mb-4">
            How a church adopts a plant
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            The process starts with a conversation about where your church is and what kind of partnership fits.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 rounded-full bg-brand-amber text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Talk to Someone on the Send Network Iowa Team
          </Link>
        </div>
      </section>
    </>
  );
}
