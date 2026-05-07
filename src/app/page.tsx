import Image from "next/image";
import Link from "next/link";
import HeroPathwaySplit from "@/components/HeroPathwaySplit";
import OpportunityStats from "@/components/OpportunityStats";
import PlanterCard from "@/components/PlanterCard";
import ChurchPathwayLadder from "@/components/ChurchPathwayLadder";
import TalkCTA from "@/components/TalkCTA";

const planterStubs = [
  {
    name: "[Planter Name]",
    city: "[City], Iowa",
    quote:
      "God called us to Iowa long before we understood the need. We couldn't be more grateful for the SNI team walking with us every step.",
    href: "/plant",
  },
  {
    name: "[Planter Name]",
    city: "[City], Iowa",
    quote:
      "The coaching and community through SNI made the difference. Planting is hard — you need people who've been there.",
    href: "/plant",
  },
  {
    name: "[Planter Name]",
    city: "[City], Iowa",
    quote:
      "Our sending church and SNI partnered to make this possible. The model works.",
    href: "/plant",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <HeroPathwaySplit />

      {/* Mission-frame block */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-4">
            The Need
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-navy">
            Communities Across Iowa Need Gospel Presence
          </h2>
          <p className="mt-6 text-gray-600 leading-relaxed">
            Your church can participate in God&rsquo;s kingdom work through
            church planting. Iowa has more than 900 communities with no
            gospel-centered church — and the work of planting them belongs to
            every church that takes the Great Commission seriously.
          </p>
        </div>
      </section>

      {/* Opportunity stats */}
      <OpportunityStats />

      {/* Planter stories section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
              Planters
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-navy">
              People planting churches in Iowa
            </h2>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
              Real planters, real cities, real stories. SNI is with them every
              step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planterStubs.map((planter, i) => (
              <PlanterCard key={i} {...planter} />
            ))}
          </div>
        </div>
      </section>

      {/* Church pathway ladder */}
      <ChurchPathwayLadder />

      {/* Pathway escape hatch */}
      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-700 font-medium mb-5">
            Not sure where your church fits?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-7 py-3 rounded-full bg-brand-amber text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Talk to Someone
          </Link>
        </div>
      </section>

      {/* Vision / Iowa section teaser */}
      <section className="py-20 bg-brand-green">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-4">
                Why Iowa
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Iowa is not a pit stop. It&rsquo;s a mission field.
              </h2>
              <p className="mt-6 text-white/70 text-sm leading-relaxed">
                SNI's Iowa-specific vision statement and case for the state as a
                priority church planting context goes here. This section will
                include demographic data, geographic diversity, and the spiritual
                landscape that makes Iowa uniquely urgent.
              </p>
              <Link
                href="/iowa"
                className="mt-8 inline-flex items-center px-6 py-3 rounded-full bg-white text-brand-navy text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                See the Iowa opportunity
              </Link>
            </div>
            <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden">
              <Image
                src="/images/sending-lab-adel/2025-Sending-Lab-03.jpg"
                alt="Iowa church planting gathering"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TalkCTA sticky (mobile only) */}
      <TalkCTA variant="sticky" />
    </>
  );
}
