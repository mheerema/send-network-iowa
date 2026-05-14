import Image from "next/image";
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
                Send Network Iowa's Iowa-specific vision statement and case for the state as a
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
