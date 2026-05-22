import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plant a Church in Iowa | Send Network Iowa",
  description:
    "Is God calling you to plant a church in Iowa? Get started with Send Network.",
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
            <div className="mt-8">
              <a
                href="https://www.sendnetwork.com/plant/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-full bg-brand-amber text-brand-navy text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started on Send Network
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BCI Partnership / Funding */}
      <section id="funding" className="scroll-mt-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-brand-navy mb-4">
              In Partnership with the Baptist Convention of Iowa
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mx-auto">
              Send Network Iowa partners with the Baptist Convention of Iowa to
              give planters real financial footing. Qualified planters can access
              funding packages designed to carry a plant from assessment through
              launch and into stability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-brand-navy mb-3">
                Church Planter Support
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Planters who complete the Send Network Assessment may receive a
                customized funding package — including monthly support for up to
                four years and one-time startup grants to cover early costs.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-brand-navy mb-3">
                Church Planting Apprenticeship
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                For planters still in development, partnering churches can access
                up to $1,000/month for one year to support a planter-in-training
                as they prepare, study their community, and build a core team.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-brand-navy mb-3">
                Church Planter Incubator
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
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
              className="inline-flex items-center px-6 py-3 rounded-full border-2 border-brand-navy text-brand-navy text-sm font-semibold hover:bg-brand-navy hover:text-white transition-colors"
            >
              Learn more at bciowa.org &rarr;
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
