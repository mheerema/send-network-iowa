import Link from "next/link";
import HeroPathwaySplit from "@/components/HeroPathwaySplit";
import ChurchPathwayLadder from "@/components/ChurchPathwayLadder";
import TalkCTA from "@/components/TalkCTA";

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

      {/* Church pathway ladder */}
      <ChurchPathwayLadder />

      {/* Pathway escape hatch */}
      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-700 font-medium mb-5">
            Not sure where your church fits?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="https://www.sendnetwork.com/send/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-7 py-3 rounded-full bg-brand-amber text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Explore Send Network
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-7 py-3 rounded-full border border-brand-navy text-brand-navy text-sm font-semibold hover:bg-brand-navy hover:text-white transition-colors"
            >
              Talk to Someone in Iowa
            </Link>
          </div>
        </div>
      </section>

      {/* BCI Partnership callout */}
      <section className="py-14 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
            Partnership
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-navy mb-4">
            In Partnership with the Baptist Convention of Iowa
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mx-auto mb-6">
            Send Network Iowa partners with the Baptist Convention of Iowa to
            provide planters with funding, assessment support, and training.
            Qualified planters can access monthly support for up to four years
            alongside coaching and cohort resources.
          </p>
          <Link
            href="/plant#funding"
            className="inline-flex items-center px-6 py-3 rounded-full bg-brand-navy text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            See available support
          </Link>
        </div>
      </section>

      {/* TalkCTA sticky (mobile only) */}
      <TalkCTA variant="sticky" />
    </>
  );
}
