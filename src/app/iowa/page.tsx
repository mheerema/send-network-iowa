import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  source,
  population,
  generations,
  education,
  spiritual,
  traditions,
  largestBodies,
  tapestrySegments,
  evangelicalAdherentsNote,
  nationalAdherenceRate,
  neighborAdherence,
  pewSelfIdentifiedNones,
  comparisonSource,
  formatNumber,
  formatMillions,
} from "@/data/iowa-demographics";

export const metadata: Metadata = {
  title: "The Need in Iowa | Send Network Iowa",
  description:
    "55% of Iowans — more than 1.7 million people — have no religious affiliation. The demographics, spiritual landscape, and case for church planting in Iowa.",
  openGraph: {
    title: "The Need in Iowa | Send Network Iowa",
    description:
      "55% of Iowans — more than 1.7 million people — have no religious affiliation. The case for church planting in Iowa.",
    url: "/iowa",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://sendnetworkiowa.com" },
    { "@type": "ListItem", position: 2, name: "The Need in Iowa", item: "https://sendnetworkiowa.com/iowa" },
  ],
};

const adherenceRows = [
  { name: "Iowa", adherencePct: spiritual.adherentsPctPrecise },
  ...neighborAdherence,
  { name: "United States", adherencePct: nationalAdherenceRate },
]
  .map((row) => ({ approximate: false, ...row }))
  .sort((a, b) => a.adherencePct - b.adherencePct);

export default function IowaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Page hero */}
      <section className="relative bg-brand-navy py-16 sm:py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/sending-lab-adel/2025-Sending-Lab-05.jpg"
            alt=""
            aria-hidden="true"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 100vw"
            loading="lazy"
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-4">
              The Need in Iowa
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Most of Iowa has no church home.
            </h1>
            <p className="mt-6 text-white/80 leading-relaxed">
              A new statewide demographics report puts numbers to what many of
              us have sensed for years. More than half of Iowa claims no
              religious affiliation at all. This page is the honest picture —
              who lives here, what they believe, and why new churches are the
              answer.
            </p>
          </div>
        </div>
      </section>

      {/* Key-stat band */}
      <section className="py-20 bg-brand-navy border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold text-brand-amber leading-none mb-2">
                {formatMillions(population.population2026)}
              </p>
              <p className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                People in Iowa
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                {formatNumber(population.population2026)} people, projected to
                grow by {formatNumber(population.projectedGrowth)} by 2031.
              </p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-brand-amber leading-none mb-2">
                {spiritual.nonesPct}%
              </p>
              <p className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                No religious affiliation
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                {formatNumber(spiritual.nones)} Iowans claim no religious
                affiliation of any kind.
              </p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-brand-amber leading-none mb-2">
                {formatNumber(spiritual.congregations)}
              </p>
              <p className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                Congregations statewide
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                Every church of every kind — serving less than half the state.
              </p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-brand-amber leading-none mb-2">
                1 in 9
              </p>
              <p className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                Evangelical
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                Only 11% of Iowans are connected to an evangelical church of
                any kind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spiritual landscape */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
              Spiritual Landscape
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-brand-navy mb-4">
              What Iowa believes — and what it doesn&rsquo;t
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Of Iowa&rsquo;s {formatNumber(population.population2026)} people,
              {" "}{formatNumber(spiritual.adherents)} ({spiritual.adherentsPct}%)
              are counted as adherents of some religious body. The other{" "}
              {formatNumber(spiritual.nones)} — {spiritual.nonesPct}% of the
              state — belong to none. Self-reported membership is thinner
              still: only {formatNumber(spiritual.memberOfPlaceOfWorship)}{" "}
              Iowans (about {spiritual.memberOfPlaceOfWorshipPct}% of the
              population) say they are a member of a place of worship.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-10">
              When Iowans were asked whether they attend church regularly,{" "}
              {formatNumber(spiritual.attendSurvey.disagreeTotal)} said no —
              including {formatNumber(spiritual.attendSurvey.disagreeCompletely)}{" "}
              who disagreed completely — while{" "}
              {formatNumber(spiritual.attendSurvey.agreeTotal)} said yes. For
              every Iowan in a pew on a given Sunday, there are far more who
              have no meaningful connection to any church.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Attendance comparison */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-brand-navy mb-4">
                &ldquo;Do you attend church regularly?&rdquo;
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-gray-600">Disagree completely</dt>
                  <dd className="font-bold text-brand-navy">
                    {formatNumber(spiritual.attendSurvey.disagreeCompletely)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-gray-600">Disagree somewhat</dt>
                  <dd className="font-bold text-brand-navy">
                    {formatNumber(spiritual.attendSurvey.disagreeSomewhat)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-gray-600">Agree somewhat</dt>
                  <dd className="font-bold text-brand-navy">
                    {formatNumber(spiritual.attendSurvey.agreeSomewhat)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-gray-600">Agree completely</dt>
                  <dd className="font-bold text-brand-navy">
                    {formatNumber(spiritual.attendSurvey.agreeCompletely)}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 leading-relaxed">
                {formatNumber(spiritual.attendSurvey.disagreeTotal)} disagree
                vs. {formatNumber(spiritual.attendSurvey.agreeTotal)} agree.
              </p>
            </div>

            {/* Largest bodies */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-brand-navy mb-4">
                Largest religious bodies by adherents
              </h3>
              <dl className="space-y-3 text-sm">
                {largestBodies.map((body) => (
                  <div
                    key={body.name}
                    className="flex items-center justify-between gap-4"
                  >
                    <dt className="text-gray-600">{body.name}</dt>
                    <dd className="font-bold text-brand-navy">
                      {formatNumber(body.adherents)}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 leading-relaxed">
                Southern Baptists: {formatNumber(spiritual.sbcAdherents)}{" "}
                adherents — about {spiritual.sbcPctLabel} of Iowa.
              </p>
            </div>
          </div>

          {/* Tradition breakdown */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-brand-navy mb-6">
              The affiliated, by tradition
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <p className="text-5xl font-bold text-brand-amber leading-none mb-2">
                  1 in 9
                </p>
                <p className="text-sm font-semibold text-brand-navy uppercase tracking-wider mb-3">
                  Iowans connected to an evangelical church
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  About 1 in 9 Iowans — 11% — is connected to an evangelical
                  church. Of the {spiritual.adherentsPct}% of Iowans who are
                  religiously affiliated, more than two-thirds attend Catholic
                  or mainline Protestant churches.
                </p>
              </div>
              <dl className="space-y-3 text-sm">
                {traditions.map((t) => (
                  <div
                    key={t.name}
                    className="flex items-center justify-between gap-4"
                  >
                    <dt className="text-gray-600">{t.name}</dt>
                    <dd className="font-bold text-brand-navy">
                      {formatNumber(t.adherents)}{" "}
                      <span className="font-normal text-gray-400">
                        ({t.pctOfPopulation.toFixed(2)}%)
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* How Iowa compares */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-brand-navy mb-6">
              How Iowa compares
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Iowa is not the least-churched state in America. At{" "}
                  {spiritual.adherentsPct}% connected to a congregation, it
                  sits a little below the national {nationalAdherenceRate}% —
                  the honest picture is more specific than &ldquo;unchurched
                  Iowa.&rdquo;
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The composition is the story. Only 11% of Iowans are
                  connected to an evangelical church — below the national
                  rate, and less than half of Missouri&rsquo;s next door —
                  while Iowa&rsquo;s mainline Protestant share is roughly
                  triple the national rate. Iowa&rsquo;s church infrastructure
                  is disproportionately Catholic parishes and legacy mainline
                  denominations, not evangelical congregations. And among its
                  six neighboring states, Iowa has the lowest share of people
                  connected to any congregation at all.
                </p>
              </div>
              <div>
                <dl className="space-y-3 text-sm">
                  {adherenceRows.map((row) => (
                    <div
                      key={row.name}
                      className={`flex items-center justify-between gap-4${
                        row.name === "Iowa"
                          ? " rounded-lg bg-brand-amber/10 px-3 py-2 -mx-3"
                          : ""
                      }`}
                    >
                      <dt
                        className={
                          row.name === "Iowa"
                            ? "font-bold text-brand-navy"
                            : "text-gray-600"
                        }
                      >
                        {row.name}
                      </dt>
                      <dd className="font-bold text-brand-navy">
                        {row.approximate
                          ? `~${Math.round(row.adherencePct)}%`
                          : `${row.adherencePct.toFixed(1)}%`}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 leading-relaxed">
                  Share of population connected to a congregation, 2020 U.S.
                  Religion Census.
                </p>
              </div>
            </div>
            <p className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 leading-relaxed">
              &ldquo;Connected to a congregation&rdquo; is the census&rsquo;s
              measure — it counts people a church can name. By
              self-identification (Pew Research, 2023&ndash;24),{" "}
              {pewSelfIdentifiedNones}% of Iowans say they have no religion.
              The distance between those numbers — hundreds of thousands of
              Iowans who would call themselves Christian but are connected to
              no church — is a large part of the mission field.
            </p>
          </div>
        </div>
      </section>

      {/* Who lives here */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
              Who Lives Here
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-brand-navy mb-4">
              A state of small towns and steady households
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Iowa is {formatNumber(population.households)} households averaging{" "}
              {population.avgHouseholdSize} people, with a median age of{" "}
              {population.medianAge} and a median household income of $
              {formatNumber(population.medianHouseholdIncome)}. There are{" "}
              {formatNumber(population.children)} children in the state. The
              character is rural and small-town: the top community segments are{" "}
              {tapestrySegments.map((s, i) => (
                <span key={s.name}>
                  {i > 0 && (i === tapestrySegments.length - 1 ? ", and " : ", ")}
                  {s.name} ({s.pct}%)
                </span>
              ))}
              . It is also a state with real need:{" "}
              {formatNumber(population.householdsBelowPoverty)} households live
              below the poverty line and{" "}
              {formatNumber(population.householdsOnSNAP)} receive SNAP benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Generations */}
            <div className="bg-white rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-brand-navy mb-4">
                Iowans by generation
              </h3>
              <dl className="space-y-3 text-sm">
                {generations.map((gen) => (
                  <div
                    key={gen.name}
                    className="flex items-center justify-between gap-4"
                  >
                    <dt className="text-gray-600">{gen.name}</dt>
                    <dd className="font-bold text-brand-navy">
                      {formatNumber(gen.population)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-brand-navy mb-4">
                Educational attainment
              </h3>
              <dl className="space-y-3 text-sm">
                {education.map((level) => (
                  <div
                    key={level.label}
                    className="flex items-center justify-between gap-4"
                  >
                    <dt className="text-gray-600">{level.label}</dt>
                    <dd className="font-bold text-brand-navy">{level.pct}%</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 leading-relaxed">
                {population.whiteAlonePct}% of Iowans are White alone;{" "}
                {population.hispanicOriginPct}% are of Hispanic origin (any
                race).
              </p>
            </div>
          </div>

          {/* Spanish-language opportunity */}
          <div className="mt-12 rounded-2xl border-2 border-brand-amber/60 bg-brand-amber/[0.04] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-brand-navy mb-3">
              The Spanish-language opportunity
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Roughly {formatNumber(population.spanishAtHomeAdults)} adults in
              Iowa speak Spanish at home. Spanish-speaking communities are
              growing across the state — in meatpacking towns, county seats,
              and metro neighborhoods alike — and very few churches are
              positioned to reach them. Spanish-language church planting is one
              of the clearest open doors in Iowa today.
            </p>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 bg-brand-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
            What This Asks of Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            {formatNumber(spiritual.nones)} people. One clear answer.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-2xl mx-auto mb-8">
            Every one of them lives on a street, in a town, within reach of a
            church that does not yet exist. Whether God is calling you to plant
            or calling your church to send, there is a place for you in this
            work.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/plant"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-amber text-brand-navy text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Explore planting
            </Link>
            <Link
              href="/partner"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white hover:text-brand-navy transition-colors"
            >
              Partner with us
            </Link>
          </div>
          <p className="mt-12 text-xs text-white/40 leading-relaxed max-w-2xl mx-auto">
            Source: {source}
          </p>
          <p className="mt-2 text-xs text-white/40 leading-relaxed max-w-2xl mx-auto">
            {evangelicalAdherentsNote}{" "}Classification per ARDA&rsquo;s
            tradition scheme.
          </p>
          <p className="mt-2 text-xs text-white/40 leading-relaxed max-w-2xl mx-auto">
            {comparisonSource}
          </p>
        </div>
      </section>
    </>
  );
}
