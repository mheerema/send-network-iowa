import Link from "next/link";
import HeroPathwaySplit from "@/components/HeroPathwaySplit";
import ChurchPathwayLadder from "@/components/ChurchPathwayLadder";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <HeroPathwaySplit />

      {/* Church pathway ladder */}
      <ChurchPathwayLadder />

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
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-full bg-brand-navy text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            See available support
          </Link>
        </div>
      </section>

    </>
  );
}
