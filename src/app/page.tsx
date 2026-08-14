import Link from "next/link";
import HeroPathwaySplit from "@/components/HeroPathwaySplit";
import ChurchPathwayLadder from "@/components/ChurchPathwayLadder";
import {
  population,
  formatMillions,
  notEvangelical,
  notEvangelicalPctLabel,
} from "@/data/iowa-demographics";

/* Mirrors the key-stat band on /iowa — same three figures, same order, so the
   two pages state the need identically. Reads as the calculation it is:
   population, the share not connected, the resulting count of people. */
const needStats = [
  { stat: formatMillions(population.population2026), label: "People in Iowa" },
  {
    stat: notEvangelicalPctLabel,
    label: "Not connected to an evangelical church",
  },
  {
    stat: formatMillions(notEvangelical),
    label: "People not connected to an evangelical church",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <HeroPathwaySplit />

      {/* Church pathway ladder */}
      <ChurchPathwayLadder />

      {/* The need in Iowa */}
      <section className="py-20 bg-brand-navy">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
              The Need in Iowa
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              89% of Iowans are not connected to an evangelical church
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            {needStats.map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-brand-amber leading-none mb-3">
                  {item.stat}
                </p>
                <p className="text-sm text-white/60 leading-relaxed">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/iowa"
              className="focus-ring inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-full bg-brand-amber text-brand-navy text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              See the full picture
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
            className="focus-ring inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-full bg-brand-navy text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            See available support
          </Link>
        </div>
      </section>

    </>
  );
}
