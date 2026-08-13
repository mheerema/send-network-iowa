import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import UsAdherenceMap from "@/components/UsAdherenceMap";
import IowaCountyMap, {
  countyRows,
  countyStats,
  peoplePerCongregation,
} from "@/components/IowaCountyMap";
import stateAdherenceCensus from "@/data/state-adherence-2020.json";
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
  formatMillions, evangelicalCongregations, evangelicalPctLabel,
  notEvangelical, notEvangelicalPctLabel, } from "@/data/iowa-demographics";

export const metadata: Metadata = {
  title: "The Need in Iowa | Send Network Iowa",
  description:
    "89% of Iowans — more than 2.8 million people — are not connected to an evangelical church. The demographics, spiritual landscape, and case for church planting in Iowa.",
  openGraph: {
    title: "The Need in Iowa | Send Network Iowa",
    description:
      "89% of Iowans — more than 2.8 million people — are not connected to an evangelical church. The case for church planting in Iowa.",
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

/** Iowa + its six neighbors + the US, for the compact neighbor bar chart. */
const adherenceRows = [
  { name: "Iowa", adherencePct: spiritual.adherentsPctPrecise },
  ...neighborAdherence,
  { name: "United States", adherencePct: nationalAdherenceRate },
].sort((a, b) => a.adherencePct - b.adherencePct);

/**
 * Every state on the map, for the sr-only data table — derived from the
 * census payload, never hand-listed.
 */
const allStateRows = [
  ...Object.entries(stateAdherenceCensus.states).map(([name, s]) => ({
    name,
    adherencePct: s.adherenceRate,
  })),
  {
    name: "United States",
    adherencePct: stateAdherenceCensus.usTotal.adherenceRate,
  },
].sort((a, b) => a.adherencePct - b.adherencePct);

function formatAdherencePct(pct: number): string {
  return `${pct.toFixed(1)}%`;
}

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
              Nine in ten Iowans have no evangelical church home.
            </h1>
            <p className="mt-6 text-white/80 leading-relaxed">
              A new statewide demographics report puts numbers to what many of
              us have sensed for years. {notEvangelicalPctLabel} of Iowans —{" "}
              {formatNumber(notEvangelical)} people — are not connected to an
              evangelical congregation, and more than half claim no religious
              affiliation at all. This page is the honest picture — who lives
              here, what they believe, and why new churches are the answer.
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
                {notEvangelicalPctLabel}
              </p>
              <p className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                Not connected to an evangelical church
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                {formatNumber(notEvangelical)} people. Most towns have no
                evangelical church to reach them.
              </p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-brand-amber leading-none mb-2">
                {formatNumber(evangelicalCongregations)}
              </p>
              <p className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                Evangelical congregations
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                Of {formatNumber(spiritual.congregations)} congregations of
                every kind statewide.
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
                  {evangelicalPctLabel}
                </p>
                <p className="text-sm font-semibold text-brand-navy uppercase tracking-wider mb-3">
                  Iowans connected to an evangelical church
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  About 1 in 9 Iowans is connected to an evangelical
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
            <p className="text-sm text-gray-600 leading-relaxed">
              Iowa has the lowest share of people connected to a congregation
              of any of its six neighboring states —{" "}
              {spiritual.adherentsPctPrecise}%, a little below the national{" "}
              {nationalAdherenceRate}%.
            </p>

            {/* Choropleth map: the lead comparison visual */}
            <div className="mt-6 max-w-2xl mx-auto">
              <UsAdherenceMap />
            </div>
            <p
              className="mt-3 text-xs text-gray-500 leading-relaxed"
              aria-hidden="true"
            >
              Share of each state&rsquo;s population connected to a
              congregation, 2020 U.S. Religion Census. Iowa outlined.
            </p>

            {/* Accessible data table; the map and bar chart are labeled/decorative.
                sr-only lives on a wrapping div, not the table: overflow:hidden
                does not apply to table boxes, so a sr-only table lays out at
                full nowrap width and adds horizontal page scroll. */}
            <div className="sr-only">
            <table>
              <caption>
                Share of population connected to a congregation, 2020 U.S.
                Religion Census. All 50 states and the District of Columbia
                appear on the map; this table lists every one of them, lowest
                to highest, with the United States overall for comparison.
              </caption>
              <thead>
                <tr>
                  <th scope="col">State</th>
                  <th scope="col">Connected to a congregation</th>
                </tr>
              </thead>
              <tbody>
                {allStateRows.map((row) => (
                  <tr key={row.name}>
                    <th scope="row">{row.name}</th>
                    <td>{formatAdherencePct(row.adherencePct)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Compact secondary block: the precise neighbor comparison */}
            <h4 className="mt-8 text-sm font-bold text-brand-navy">
              Iowa and its neighbors
            </h4>
            {/* Zero-based horizontal bar chart; track = 0–100% of population */}
            <div aria-hidden="true" className="mt-3 space-y-2.5 sm:space-y-2">
              {adherenceRows.map((row) => {
                const isIowa = row.name === "Iowa";
                const isUS = row.name === "United States";
                return (
                  <div
                    key={row.name}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[8rem_minmax(0,1fr)_3.5rem]"
                  >
                    <span
                      className={`text-sm sm:col-start-1 sm:row-start-1 ${
                        isIowa
                          ? "font-semibold text-brand-navy"
                          : "text-gray-700"
                      }`}
                    >
                      {row.name}
                    </span>
                    <span
                      className={`text-sm text-right tabular-nums sm:col-start-3 sm:row-start-1 ${
                        isIowa
                          ? "font-semibold text-brand-navy"
                          : "text-gray-500"
                      }`}
                    >
                      {formatAdherencePct(row.adherencePct)}
                    </span>
                    <div className="col-span-2 h-3.5 rounded-r-full bg-gray-200/60 sm:col-span-1 sm:col-start-2 sm:row-start-1">
                      <div
                        className={`h-full rounded-r-full ${
                          isIowa
                            ? "bg-brand-amber"
                            : isUS
                              ? ""
                              : "bg-brand-navy/20"
                        }`}
                        style={{
                          width: `${row.adherencePct}%`,
                          ...(isUS
                            ? {
                                backgroundImage:
                                  "repeating-linear-gradient(135deg, #6a7282 0 3px, transparent 3px 6px)",
                              }
                            : {}),
                        }}
                      />
                    </div>
                  </div>
                );
              })}
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

      {/* County by county */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
              County by County
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-brand-navy mb-4">
              Where the coverage stretches thinnest
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Across Iowa there is one evangelical congregation for every{" "}
              {formatNumber(countyStats.statewide)} people. The map shows where
              that stretches furthest. In Jackson County there is one for every{" "}
              {formatNumber(peoplePerCongregation("Jackson"))} people, and in
              Dubuque County one for every{" "}
              {formatNumber(peoplePerCongregation("Dubuque"))}. And the thinnest
              coverage is not only rural: Linn, Scott and Johnson counties —
              three of the largest in the state — each sit between one
              congregation per 2,500 and one per 2,700 residents.
            </p>
          </div>

          {/* Inline figures */}
          <dl className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl">
            <div>
              <dt className="sr-only">
                Counties where more than 9 in 10 people are not counted as
                adherents of an evangelical congregation
              </dt>
              <dd>
                <span className="block text-4xl font-bold text-brand-navy leading-none mb-2">
                  {countyStats.countiesOver90PctUnconnected} of{" "}
                  {countyStats.countyCount}
                </span>
                <span
                  className="block text-sm text-gray-600 leading-relaxed"
                  aria-hidden="true"
                >
                  Iowa counties where more than 9 in 10 people are not counted
                  as adherents of an evangelical congregation
                </span>
              </dd>
            </div>
            <div>
              <dt className="sr-only">
                Iowans not counted as adherents of an evangelical congregation,
                statewide
              </dt>
              <dd>
                <span className="block text-4xl font-bold text-brand-navy leading-none mb-2">
                  {formatNumber(notEvangelical)}{" "}
                  <span className="text-brand-amber">
                    ({notEvangelicalPctLabel})
                  </span>
                </span>
                <span
                  className="block text-sm text-gray-600 leading-relaxed"
                  aria-hidden="true"
                >
                  Iowans statewide not counted as adherents of an evangelical
                  congregation
                </span>
              </dd>
            </div>
          </dl>

          {/* Choropleth: people per evangelical congregation, by county */}
          <div className="max-w-3xl mx-auto">
            <IowaCountyMap />
          </div>
          <p
            className="mt-3 max-w-3xl mx-auto text-xs text-gray-500 leading-relaxed"
            aria-hidden="true"
          >
            People per evangelical congregation by county, 2020 U.S. Religion
            Census. Darker means fewer congregations for the population.{" "}
            {countyStats.worst.name} County, outlined, is thinnest at one for
            every {formatNumber(peoplePerCongregation(countyStats.worst.name))}{" "}
            people; {countyStats.best.name} County is densest at one for every{" "}
            {formatNumber(peoplePerCongregation(countyStats.best.name))}.
          </p>

          {/* Accessible data table for the map. sr-only lives on a wrapping
              div, not the table: overflow:hidden does not apply to table
              boxes, so a sr-only table lays out at full nowrap width and adds
              horizontal page scroll. */}
          <div className="sr-only">
            <table>
              <caption>
                Iowa counties in the 2020 U.S. Religion Census: population,
                evangelical congregations, people per evangelical congregation,
                and the share of the population not counted as adherents of an
                evangelical congregation. All {countyStats.countyCount} counties
                on the map appear here, in alphabetical order. The share not
                counted is an upper bound; see the note below the table.
              </caption>
              <thead>
                <tr>
                  <th scope="col">County</th>
                  <th scope="col">Population</th>
                  <th scope="col">Evangelical congregations</th>
                  <th scope="col">People per evangelical congregation</th>
                  <th scope="col">Not counted as adherents</th>
                </tr>
              </thead>
              <tbody>
                {countyRows.map((row) => (
                  <tr key={row.fips}>
                    <th scope="row">{row.name}</th>
                    <td>{formatNumber(row.population)}</td>
                    <td>{formatNumber(row.evangelicalCongregations)}</td>
                    <td>
                      {formatNumber(Math.round(row.peoplePerCongregation))}
                    </td>
                    <td>{row.notEvangelicalPct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 max-w-3xl mx-auto pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              A note on the numbers:{" "}
              {formatNumber(countyStats.congregationsWithoutAdherentCount)}{" "}
              of Iowa&rsquo;s {formatNumber(countyStats.totalCongregations)}{" "}
              evangelical congregations were counted by the 2020 census but
              reported no adherent figures. Those churches are not spread
              evenly, so in the counties where they cluster, the share of
              people &ldquo;not counted as adherents&rdquo; comes out higher
              than the reality on the ground. Read those percentages as an
              upper bound. Congregation counts, on the other hand, are complete
              and add up exactly to the state total — which is why the map
              shades people per congregation rather than the percentage.
            </p>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              Source: 2020 U.S. Religion Census (ARDA), county detail.
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
            {formatNumber(notEvangelical)} people. One clear answer.
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
