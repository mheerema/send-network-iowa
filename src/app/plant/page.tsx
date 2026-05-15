import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PathwaySteps from "@/components/PathwaySteps";
import TalkCTA from "@/components/TalkCTA";

export const metadata: Metadata = {
  title: "Plant a Church in Iowa | Send Network Iowa",
  description:
    "Everything a pastor considering church planting in Iowa needs to know. Assessment, coaching, the PACE pathway, and how to get started.",
};

export default function PlantPage() {
  return (
    <>
      {/* Page hero */}
      <section className="bg-brand-navy py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-4">
              For Planters
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Is God calling you to plant in Iowa?
            </h1>
            <p className="mt-6 text-white/70 leading-relaxed">
              We walk with planters from initial calling through assessment,
              training, coaching, and launch. Iowa-specific context. Real
              support. No shortcuts.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-full bg-brand-amber text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Talk to Someone
              </Link>
              <a
                href="#assessment"
                className="inline-flex items-center px-6 py-3 rounded-full border border-white/30 text-white text-sm font-semibold hover:border-white/60 transition-colors"
              >
                Start the assessment
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Iowa context for planters */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-72 lg:h-96 rounded-2xl overflow-hidden order-2 lg:order-1">
              <Image
                src="/images/sending-lab-adel/2025-Sending-Lab-02.jpg"
                alt="Planter training at Send Network Iowa Sending Lab"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
                Iowa Context
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-brand-navy mb-4">
                Why Iowa needs you now
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Send Network Iowa's Iowa-specific planting context goes here. This section
                will describe the spiritual landscape, the communities that need
                churches, and why this moment is significant for Iowa church
                planting.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Demographic data, geographic spread, and Send Network Iowa's priority
                communities will be added here with input from Matt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PACE pathway */}
      <PathwaySteps />

      {/* BCI Partnership / Funding */}
      <section id="funding" className="py-20 bg-brand-navy">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
              Financial Support
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
              Backed by the Baptist Convention of Iowa
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-2xl mx-auto">
              Send Network Iowa partners with the Baptist Convention of Iowa to
              give planters real financial footing. Qualified planters can access
              funding packages designed to carry a plant from assessment through
              launch and into stability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white mb-3">
                Church Planter Support
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Planters who complete the Send Network Assessment may receive a
                customized funding package — including monthly support for up to
                four years and one-time startup grants to cover early costs.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white mb-3">
                Church Planting Apprenticeship
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                For planters still in development, partnering churches can access
                up to $1,000/month for one year to support a planter-in-training
                as they prepare, study their community, and build a core team.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white mb-3">
                Church Planter Incubator
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Churches developing a staff member toward planting can receive
                matching funds to employ that leader in a role specifically
                oriented toward future church planting.
              </p>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://bciowa.org/churchplantingpartnership/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-full border border-white/30 text-white text-sm font-semibold hover:border-white/60 transition-colors"
            >
              Learn more at bciowa.org &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Assessment section */}
      <section id="assessment" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
              Ready to begin?
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-brand-navy mb-4">
              Start with the assessment
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              The Send Network assessment process is thorough and honest. It is
              designed to place every person on the right path, whether that is
              lead planting, team planting, or another form of ministry. A brief
              description of what to expect from the assessment process goes
              here.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-amber text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Talk to Someone First
              </Link>
              <a
                href="https://www.namb.net/send-network/assessment/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-brand-navy text-brand-navy text-sm font-semibold hover:bg-brand-navy hover:text-white transition-colors"
              >
                Begin Assessment (NAMB)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
            Coaching
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy mb-4">
            You will not plant alone
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
            Send Network Iowa coaching and cohort model description goes here. This section
            will explain how planters are matched with coaches, what the
            ongoing care relationship looks like, and how the Iowa planting
            cohort provides community through the process.
          </p>
        </div>
      </section>

      <TalkCTA variant="inline" />
      <TalkCTA variant="sticky" />
    </>
  );
}
