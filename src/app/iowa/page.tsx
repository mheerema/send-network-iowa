import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import UsEvangelicalMap, {
  stateRows,
  stateStats,
  reportingGap,
} from "@/components/UsEvangelicalMap";
import IowaCountyMap, {
  countyRows,
  countyStats,
  peoplePerCongregation,
  scaleAnchors,
} from "@/components/IowaCountyMap";
import {
  source,
  population,
  generations,
  education,
  spiritual,
  traditions,
  largestBodies,
  tapestrySegments,
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

/**
 * The three traditions that carry the evangelical argument: the evangelical
 * figure itself, and the two larger traditions that make it meaningful.
 * Derived from `traditions`, never re-listed — the other three rows are in
 * the screen-reader table at the foot of the page.
 */
const CONTRAST_TRADITIONS = [
  "Evangelical Protestant",
  "Mainline Protestant",
  "Catholic",
];
const contrastTraditions = traditions.filter((t) =>
  CONTRAST_TRADITIONS.includes(t.name)
);

/**
 * "How Iowa compares" shades evangelical adherence — the share of each
 * state's population counted as adherents of an Evangelical Protestant
 * congregation. It used to shade the census's GENERAL adherence measure,
 * which answered a different question (Utah led the country on that one).
 * All figures come from `stateStats`, derived from the payload.
 */
const compareMeasure = "counted as adherents of an evangelical congregation";

function formatPct(pct: number): string {
  return `${pct.toFixed(1)}%`;
}

/** Ranks are interpolated, so the suffix has to be computed, not typed. */
function ordinal(n: number): string {
  const teens = n % 100;
  if (teens >= 11 && teens <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

/** Footnote reference. One ref per note, so the back-link target is unique. */
function NoteRef({ n }: { n: number }) {
  return (
    <sup className="ml-0.5 align-super text-[0.55em] font-semibold leading-none">
      <a
        id={`ref-note-${n}`}
        href={`#note-${n}`}
        className="relative inline-block text-brand-amber underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-amber"
      >
        <span className="sr-only">See note </span>
        {n}
        {/* WCAG 2.2 SC 2.5.8 (Target Size, Minimum): the rendered glyph is
            ~7px, so an invisible 24x24 box centered on it carries the hit
            area without changing how the superscript looks. */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2"
        />
      </a>
    </sup>
  );
}

/** Back-link from a note to the section that referenced it. */
function NoteBack({ n }: { n: number }) {
  return (
    <a
      href={`#ref-note-${n}`}
      className="relative ml-1 inline-block whitespace-nowrap text-gray-600 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-amber"
    >
      <span aria-hidden="true">↩</span>
      {/* Same 24x24 hit area as NoteRef; the arrow glyph is under 24px. */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2"
      />
      <span className="sr-only">Back to note {n} reference</span>
    </a>
  );
}

/** Large figure with its label. The page's default unit of content. */
function BigStat({
  figure,
  label,
}: {
  figure: React.ReactNode;
  label: string;
}) {
  return (
    <div>
      <p className="text-4xl sm:text-5xl font-bold text-brand-navy leading-none mb-3">
        {figure}
      </p>
      <p className="text-base text-gray-700 leading-snug">{label}</p>
    </div>
  );
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
              89% of Iowans are not connected to an evangelical church.
            </h1>
            <p className="mt-6 text-xl text-white/80 leading-relaxed">
              2,837,801 people. Evangelical adherents are 11% of the state,
              against 16.5% nationally.
              <NoteRef n={1} />
            </p>
          </div>
        </div>
      </section>

      {/* Key-stat band */}
      <section className="py-20 bg-brand-navy border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Three cards, not four. Every card here has to frame the need on
              its own — a bare congregation count ("2,153") gives the reader no
              reference for whether that is a lot or a little, so it was cut.
              The count still lives in the sr-only data table and in the county
              map's caption, where the population it serves is right beside it. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold text-brand-amber leading-none mb-2">
                {formatMillions(population.population2026)}
              </p>
              <p className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                People in Iowa
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                Growing less than 2% by 2031.
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
                {formatNumber(notEvangelical)} people.
              </p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-brand-amber leading-none mb-2">
                {formatNumber(countyStats.statewide)}
              </p>
              <p className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                Iowans per evangelical congregation
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                Statewide average.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Evangelical affiliation */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
              Spiritual Landscape
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-brand-navy">
              11% of Iowans are connected to an evangelical church.
              <NoteRef n={2} />
            </h2>
          </div>

          {/* Tradition breakdown */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <p className="text-7xl font-bold text-brand-amber leading-none mb-3">
                  {evangelicalPctLabel}
                </p>
                <p className="text-base font-semibold text-brand-navy uppercase tracking-wider">
                  Iowans connected to an evangelical church
                </p>
              </div>
              <div>
                <dl className="space-y-3 text-base">
                  {contrastTraditions.map((t) => (
                    <div
                      key={t.name}
                      className="flex items-center justify-between gap-4"
                    >
                      <dt className="text-gray-700">{t.name}</dt>
                      <dd className="font-bold text-brand-navy tabular-nums">
                        {formatNumber(t.adherents)}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-lg text-gray-700 leading-snug">
                  Of the Iowans who are religiously affiliated, more than
                  two-thirds attend Catholic or mainline Protestant churches.
                </p>
              </div>
            </div>
          </div>

          {/* How Iowa compares */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-brand-navy mb-4">
              How Iowa compares
              <NoteRef n={4} />
            </h3>
            <p className="text-lg text-gray-700 leading-snug">
              Iowa is {formatPct(stateStats.iowaRate)} evangelical — below the
              national {formatPct(stateStats.usRate)},{" "}
              {ordinal(stateStats.iowaRank)} of {stateStats.rankedStateCount}{" "}
              states, and last among its six neighbors.
              <NoteRef n={5} />
            </p>

            {/* Choropleth map: the comparison visual */}
            <div className="mt-8 max-w-2xl mx-auto">
              <UsEvangelicalMap />
            </div>
            <p
              className="mt-3 text-xs text-gray-500 leading-relaxed"
              aria-hidden="true"
            >
              Share of each state&rsquo;s population {compareMeasure}, 2020
              U.S. Religion Census. Iowa outlined.
            </p>

            {/* Accessible data table; the map is labeled/decorative.
                sr-only lives on a wrapping div, not the table: overflow:hidden
                does not apply to table boxes, so a sr-only table lays out at
                full nowrap width and adds horizontal page scroll. */}
            <div className="sr-only">
            <table>
              <caption>
                Share of population {compareMeasure}, 2020 U.S. Religion
                Census. All 50 states and the District of Columbia appear on
                the map; this table lists every one of them, lowest to highest,
                with the United States overall for comparison. Rank runs 1 to{" "}
                {stateStats.rankedStateCount}, highest share first; the
                District of Columbia is shaded on the map but not ranked,
                because it is not a state. Every share here is understated —
                see note 5 at the foot of the page.
              </caption>
              <thead>
                <tr>
                  <th scope="col">State</th>
                  <th scope="col">
                    Counted as adherents of an evangelical congregation
                  </th>
                  <th scope="col">Rank</th>
                  <th scope="col">Population</th>
                  <th scope="col">Evangelical congregations</th>
                </tr>
              </thead>
              <tbody>
                {stateRows.map((row) => (
                  <tr key={row.code}>
                    <th scope="row">{row.name}</th>
                    <td>{formatPct(row.rate)}</td>
                    <td>{row.rank === null ? "Not ranked" : row.rank}</td>
                    <td>{formatNumber(row.population)}</td>
                    <td>{formatNumber(row.congregations)}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row">United States</th>
                  <td>{formatPct(stateStats.usRate)}</td>
                  <td>Not ranked</td>
                  <td>{formatNumber(stateStats.usPopulation)}</td>
                  <td>{formatNumber(stateStats.usCongregations)}</td>
                </tr>
              </tbody>
            </table>
            </div>
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
              {formatNumber(countyStats.belowSaturationGoal.population)}{" "}
              Iowans live in counties with too few churches
              <NoteRef n={3} />
              <NoteRef n={6} />
            </h2>
          </div>

          {/* Inline figures: the shortfall counted in counties, then in people. */}
          <dl className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl">
            <div>
              <dt className="sr-only">
                Iowa counties with fewer than one evangelical congregation
                per {formatNumber(scaleAnchors.gacxSaturationGoal)} people
              </dt>
              {/* Two tiers, not one line: the count and the share are the
                  two halves of the argument, and at 48px a parenthetical
                  breaks mid-phrase in a half-width column. */}
              <dd>
                <span className="block text-4xl sm:text-5xl font-bold text-brand-navy leading-none mb-1">
                  {countyStats.belowSaturationGoal.countyCount} of{" "}
                  {countyStats.countyCount}
                </span>
                <span className="block text-xl font-bold text-brand-amber leading-none mb-3">
                  {countyStats.belowSaturationGoal.pctOfCounties}% of counties
                </span>
                <span
                  className="block text-base text-gray-700 leading-snug"
                  aria-hidden="true"
                >
                  Iowa counties have fewer than one evangelical congregation
                  per {formatNumber(scaleAnchors.gacxSaturationGoal)} people
                </span>
              </dd>
            </div>
            <div>
              <dt className="sr-only">
                Share of Iowans living in the counties that fall short of
                the saturation goal
              </dt>
              <dd>
                <span className="block text-4xl sm:text-5xl font-bold text-brand-navy leading-none mb-1">
                  {formatNumber(countyStats.belowSaturationGoal.population)}
                </span>
                <span className="block text-xl font-bold text-brand-amber leading-none mb-3">
                  {countyStats.belowSaturationGoal.pctOfState}% of Iowans
                </span>
                <span
                  className="block text-base text-gray-700 leading-snug"
                  aria-hidden="true"
                >
                  live in those {countyStats.belowSaturationGoal.countyCount}{" "}
                  counties
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
            Iowa&rsquo;s {formatNumber(countyStats.totalCongregations)}{" "}
            evangelical congregations, mapped as the number of people each one
            carries, 2020 U.S. Religion Census. The bands break at the Global
            Alliance for Church Multiplication&rsquo;s stated saturation goal
            of one congregation per{" "}
            {formatNumber(scaleAnchors.gacxSaturationGoal)}{" "}
            people, at Iowa&rsquo;s own average of one per{" "}
            {formatNumber(scaleAnchors.iowaAverage)}, and at the US evangelical
            average of one per {formatNumber(scaleAnchors.usAverage)}.{" "}
            {countyStats.worst.name} County, outlined, carries the most people
            per congregation —{" "}
            {formatNumber(peoplePerCongregation(countyStats.worst.name))};{" "}
            {countyStats.best.name} County the fewest, at{" "}
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
                counted is an upper bound; see note 3 at the foot of the page.
                In counties with only a handful of congregations, the figure
                for people per congregation is approximate; see note 6.
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
        </div>
      </section>

      {/* Spanish-speaking Iowans. Promoted to its own section; the general
          population and household figures it used to sit beneath are
          demographic context rather than evangelical coverage, so they now
          live only in the data tables at the foot of the page. */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
              Who Lives Here
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-brand-navy">
              {formatNumber(population.spanishAtHomeAdults)} Iowa adults speak
              Spanish at home
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-8 max-w-4xl">
            <BigStat
              figure={formatNumber(population.spanishAtHomeAdults)}
              label="Adults who speak Spanish at home"
            />
            <BigStat
              figure={`${population.hispanicOriginPct}%`}
              label="Of Iowans are of Hispanic origin — about 1 in 13"
            />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 bg-brand-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-amber text-sm font-semibold uppercase tracking-widest mb-3">
            What This Asks of Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
            One evangelical congregation for every{" "}
            {formatNumber(countyStats.statewide)} Iowans.
          </h2>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
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
        </div>
      </section>

      {/* Notes, sources, and the full data behind the page.
          This is the only place on /iowa where small grey type belongs. */}
      <section
        aria-labelledby="notes-heading"
        className="bg-gray-100 border-t border-gray-200 py-12"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="notes-heading"
            className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5"
          >
            Notes and sources
          </h2>
          <ol className="list-decimal pl-5 space-y-3 text-xs text-gray-500 leading-relaxed marker:text-gray-400">
            <li id="note-1">
              Source: {source}
              <NoteBack n={1} />
            </li>
            <li id="note-2">
              The evangelical figures on this page are understated, because
              some evangelical churches were counted by the census without
              reporting how many people they serve — see note 3. Classification
              per ARDA&rsquo;s tradition scheme (RELTRAD).
              <NoteBack n={2} />
            </li>
            <li id="note-3">
              {formatNumber(countyStats.congregationsWithoutAdherentCount)}{" "}
              of Iowa&rsquo;s {formatNumber(countyStats.totalCongregations)}{" "}
              evangelical congregations were counted by the 2020 census but
              reported no adherent figures. Those churches are not spread
              evenly, so in the counties where they cluster, the share of people
              &ldquo;not counted as adherents&rdquo; comes out higher than the
              reality on the ground. Read those percentages as an upper bound.
              Congregation counts, on the other hand, are complete and add up
              exactly to the state total — which is why the map shades people
              per congregation rather than the percentage. Source: 2020 U.S.
              Religion Census (ARDA), county detail.
              <NoteBack n={3} />
            </li>
            <li id="note-4">
              &ldquo;Counted as an adherent&rdquo; is the census&rsquo;s
              measure — it counts people a church can name, not people who hold
              evangelical convictions. Evangelical Protestant is ARDA&rsquo;s
              classification, applied to the denomination rather than the
              congregation; nondenominational churches are counted evangelical.
              By self-identification (Pew Research, 2023&ndash;24),{" "}
              {pewSelfIdentifiedNones}% of Iowans say they have no religion. The
              distance between those numbers — hundreds of thousands of Iowans
              who would call themselves Christian but are connected to no church
              — is a large part of the mission field. {comparisonSource}
              <NoteBack n={4} />
            </li>
            <li id="note-5">
              Every state&rsquo;s share on this map is understated, and not
              evenly. Nationally{" "}
              {formatNumber(reportingGap.nationalCongregations)} evangelical
              congregations ({formatPct(reportingGap.nationalPct)}{" "}
              of them) reported a congregation count but no adherent figure, so
              they
              contribute zero adherents to their state&rsquo;s rate.{" "}
              <strong className="font-semibold text-gray-700">
                Iowa is the {ordinal(reportingGap.iowaAffectedPosition)} most
                affected state, at {formatPct(reportingGap.iowaPct)}
              </strong>{" "}
              — so Iowa&rsquo;s own figure is understated more than most of the
              states it is being compared against here. Giving each
              state&rsquo;s non-reporting congregations that state&rsquo;s own
              average size moves Iowa from {reportingGap.iowaRatePublished}% to
              roughly {formatPct(reportingGap.iowaRateImputed)} and from rank{" "}
              {reportingGap.iowaRankPublished} to{" "}
              {reportingGap.iowaRankImputed}, while {reportingGap.topStateName}{" "}
              slips from 1st to {ordinal(reportingGap.topStateRankImputed)}.
              Those
              adjusted figures are an upper bound and are not the published
              numbers — non-reporting churches skew small, so the correction
              overshoots. The ordering holds at the extremes; the middle of the
              map, where Iowa sits, is soft.
              <NoteBack n={5} />
            </li>
            <li id="note-6">
              <strong className="font-semibold text-gray-700">
                No accepted standard exists for how many churches a population
                needs.
              </strong>{" "}
              NAMB and Send Network publish a people-per-church ratio for every
              Send City without naming a target or citing a source, so the
              county map is anchored to figures that can be named instead. The
              saturation goal is the Global Alliance for Church
              Multiplication&rsquo;s — &ldquo;a healthy, multiplying,
              sustainable church for every{" "}
              {formatNumber(scaleAnchors.gacxSaturationGoal)}{" "}
              people&rdquo; ({scaleAnchors.gacxUrl}) — a stated goal for global
              evangelization rather than a researched threshold, and it is
              cited here as a goal, not as a benchmark. The other two breaks
              are averages computed from the same 2020 U.S. Religion Census
              figures used throughout this page: one evangelical congregation
              per {formatNumber(scaleAnchors.usAverage)} people nationally, and
              one per {formatNumber(scaleAnchors.iowaAverage)} in Iowa. Where a
              county has only a handful of congregations its ratio turns on a
              single church. One more congregation would move{" "}
              {countyStats.fewestCongregations.map((r, i, arr) => (
                <span key={r.fips}>
                  {i === 0 ? "" : i === arr.length - 1 ? ", and " : ", "}
                  {r.name} County ({formatNumber(r.population)}{" "}
                  people, {r.evangelicalCongregations}{" "}
                  congregations) by {r.swingPctOnOneMore}%
                </span>
              ))}
              .{" "}
              {countyStats.fewestCongregations.some(
                (r) => r.fips === countyStats.worst.fips
              )
                ? `${countyStats.worst.name} is the county outlined on the map. `
                : ""}
              Read any county ratio resting on a handful of congregations as
              approximate; the statewide and multi-county figures are not
              affected.
              <NoteBack n={6} />
            </li>
          </ol>

          {/* Reference data cut from the visible page for legibility. It is
              still reachable here for screen-reader users, exactly as the
              county and state tables above are. sr-only lives on the wrapping
              div, never on a table element. */}
          <div className="sr-only">
            <h2>Detailed data tables</h2>

            <table>
              <caption>
                Religious adherence in Iowa, 2020 U.S. Religion Census.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Measure</th>
                  <th scope="col">Number</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Adherents of any religious body</th>
                  <td>
                    {formatNumber(spiritual.adherents)} (
                    {spiritual.adherentsPctPrecise}%)
                  </td>
                </tr>
                <tr>
                  <th scope="row">No religious affiliation</th>
                  <td>
                    {formatNumber(spiritual.nones)} ({spiritual.nonesPctPrecise}
                    %)
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    Say they are a member of a place of worship
                  </th>
                  <td>
                    {formatNumber(spiritual.memberOfPlaceOfWorship)} (
                    {spiritual.memberOfPlaceOfWorshipPct}%)
                  </td>
                </tr>
                <tr>
                  <th scope="row">Congregations of every kind</th>
                  <td>{formatNumber(spiritual.congregations)}</td>
                </tr>
                <tr>
                  <th scope="row">Evangelical congregations</th>
                  <td>{formatNumber(evangelicalCongregations)}</td>
                </tr>
              </tbody>
            </table>

            <table>
              <caption>
                Iowans responding to &ldquo;Do you attend church
                regularly?&rdquo;
              </caption>
              <thead>
                <tr>
                  <th scope="col">Response</th>
                  <th scope="col">Iowans</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Disagree completely</th>
                  <td>{formatNumber(spiritual.attendSurvey.disagreeCompletely)}</td>
                </tr>
                <tr>
                  <th scope="row">Disagree somewhat</th>
                  <td>{formatNumber(spiritual.attendSurvey.disagreeSomewhat)}</td>
                </tr>
                <tr>
                  <th scope="row">Agree somewhat</th>
                  <td>{formatNumber(spiritual.attendSurvey.agreeSomewhat)}</td>
                </tr>
                <tr>
                  <th scope="row">Agree completely</th>
                  <td>{formatNumber(spiritual.attendSurvey.agreeCompletely)}</td>
                </tr>
                <tr>
                  <th scope="row">Disagree, total</th>
                  <td>{formatNumber(spiritual.attendSurvey.disagreeTotal)}</td>
                </tr>
                <tr>
                  <th scope="row">Agree, total</th>
                  <td>{formatNumber(spiritual.attendSurvey.agreeTotal)}</td>
                </tr>
              </tbody>
            </table>

            <table>
              <caption>
                Adherents by religious tradition, classified per ARDA
                (RELTRAD), 2020 U.S. Religion Census.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Tradition</th>
                  <th scope="col">Adherents</th>
                  <th scope="col">Share of population</th>
                </tr>
              </thead>
              <tbody>
                {traditions.map((t) => (
                  <tr key={t.name}>
                    <th scope="row">{t.name}</th>
                    <td>{formatNumber(t.adherents)}</td>
                    <td>{t.pctOfPopulation.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table>
              <caption>
                Largest religious bodies in Iowa by adherents, 2020 U.S.
                Religion Census.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Body</th>
                  <th scope="col">Adherents</th>
                </tr>
              </thead>
              <tbody>
                {largestBodies.map((body) => (
                  <tr key={body.name}>
                    <th scope="row">{body.name}</th>
                    <td>{formatNumber(body.adherents)}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row">Southern Baptist</th>
                  <td>
                    {formatNumber(spiritual.sbcAdherents)} (
                    {spiritual.sbcPctLabel} of Iowa)
                  </td>
                </tr>
              </tbody>
            </table>

            <table>
              <caption>Iowans by generation, Esri 2026 estimates.</caption>
              <thead>
                <tr>
                  <th scope="col">Generation</th>
                  <th scope="col">Iowans</th>
                </tr>
              </thead>
              <tbody>
                {generations.map((gen) => (
                  <tr key={gen.name}>
                    <th scope="row">{gen.name}</th>
                    <td>{formatNumber(gen.population)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table>
              <caption>
                Educational attainment in Iowa, Esri 2026 estimates.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Level</th>
                  <th scope="col">Share of Iowans</th>
                </tr>
              </thead>
              <tbody>
                {education.map((level) => (
                  <tr key={level.label}>
                    <th scope="row">{level.label}</th>
                    <td>{level.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table>
              <caption>
                Iowa population and household detail, Esri 2026 estimates.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Measure</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Population</th>
                  <td>{formatNumber(population.population2026)}</td>
                </tr>
                <tr>
                  <th scope="row">Projected population, 2031</th>
                  <td>{formatNumber(population.projected2031)}</td>
                </tr>
                <tr>
                  <th scope="row">Households</th>
                  <td>{formatNumber(population.households)}</td>
                </tr>
                <tr>
                  <th scope="row">Average household size</th>
                  <td>{population.avgHouseholdSize}</td>
                </tr>
                <tr>
                  <th scope="row">Median age</th>
                  <td>{population.medianAge}</td>
                </tr>
                <tr>
                  <th scope="row">Children</th>
                  <td>{formatNumber(population.children)}</td>
                </tr>
                <tr>
                  <th scope="row">Median household income</th>
                  <td>${formatNumber(population.medianHouseholdIncome)}</td>
                </tr>
                <tr>
                  <th scope="row">Households below the poverty line</th>
                  <td>{formatNumber(population.householdsBelowPoverty)}</td>
                </tr>
                <tr>
                  <th scope="row">Households receiving SNAP benefits</th>
                  <td>{formatNumber(population.householdsOnSNAP)}</td>
                </tr>
                <tr>
                  <th scope="row">White alone</th>
                  <td>{population.whiteAlonePct}%</td>
                </tr>
                <tr>
                  <th scope="row">Hispanic origin, any race</th>
                  <td>{population.hispanicOriginPct}%</td>
                </tr>
                <tr>
                  <th scope="row">Adults who speak Spanish at home</th>
                  <td>{formatNumber(population.spanishAtHomeAdults)}</td>
                </tr>
              </tbody>
            </table>

            <table>
              <caption>
                Largest community segments in Iowa, Esri Tapestry 2026.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Segment</th>
                  <th scope="col">Share of households</th>
                </tr>
              </thead>
              <tbody>
                {tapestrySegments.map((s) => (
                  <tr key={s.name}>
                    <th scope="row">{s.name}</th>
                    <td>{s.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
