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
  countyWithCity,
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
  // Without this block X falls back to the root layout's generic title and
  // description, pairing this page's infographic with the wrong headline.
  twitter: {
    // summary_large_image, not the default summary: at "summary" X renders a
    // small square thumbnail and crops a 1200x630 infographic to nothing.
    card: "summary_large_image",
    title: "The Need in Iowa | Send Network Iowa",
    description:
      "89% of Iowans — more than 2.8 million people — are not connected to an evangelical church. The case for church planting in Iowa.",
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

/**
 * Column totals for the county-need table, summed from the exact rows that
 * table renders rather than read off `countyStats` — a footer that quotes a
 * figure the rows above it do not add up to is worse than no footer.
 */
const needTableTotals = countyStats.shortfall.ranked.reduce(
  (t, r) => ({
    population: t.population + r.population,
    congregations: t.congregations + r.evangelicalCongregations,
    needed: t.needed + r.churchesNeeded,
  }),
  { population: 0, congregations: 0, needed: 0 }
);

/** Counties already at the goal — the rows the need table deliberately omits. */
const countiesAtGoal =
  countyStats.countyCount - countyStats.shortfall.countyCount;

/**
 * Reconciliation guard. The need table and the page's headline shortfall are
 * two renderings of one figure; if the row-by-row sum ever stops matching
 * `countyStats.shortfall.total`, the page is publishing two totals and the
 * build should say so rather than letting a reader find it.
 */
if (needTableTotals.needed !== countyStats.shortfall.total) {
  throw new Error(
    `The county need table sums to ${needTableTotals.needed} churches but ` +
      `the page publishes ${countyStats.shortfall.total}. Both derive from ` +
      `countyRows — reconcile the derivation, do not adjust one to match.`
  );
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
        className="focus-ring relative inline-block text-brand-amber underline-offset-2 hover:underline"
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
      className="focus-ring relative ml-1 inline-block whitespace-nowrap text-gray-600 underline-offset-2 hover:underline"
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
                Only 11% are connected.
              </p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-brand-amber leading-none mb-2">
                {formatMillions(notEvangelical)}
              </p>
              <p className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                People not connected to an evangelical church
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                One evangelical congregation per{" "}
                {formatNumber(countyStats.statewide)} Iowans.
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
              Only 11% of Iowans are connected to an evangelical church.
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
              U.S. Religion Census. Iowa is shown in amber with its own figure.
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
            </h2>
          </div>

          {/* Inline figures: the shortfall counted in counties, then in
              people, then in churches. Three columns start at `md`, not `sm`:
              at 640px a third of this 3xl column is ~180px and the 48px
              figures ("2,640,125") overflow it. */}
          <dl className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
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
                  counties
                </span>
                <span
                  className="block text-base text-gray-700 leading-snug"
                  aria-hidden="true"
                >
                  have fewer than one evangelical congregation per{" "}
                  {formatNumber(scaleAnchors.gacxSaturationGoal)} people
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
                  Iowans
                </span>
                <span
                  className="block text-base text-gray-700 leading-snug"
                  aria-hidden="true"
                >
                  live in them — {countyStats.belowSaturationGoal.pctOfState}%
                  of the state
                </span>
              </dd>
            </div>
            <div>
              {/* Short label here, and the supporting line below is NOT
                  aria-hidden as it is in the other two: the note reference
                  has to sit at the end of that sentence rather than after
                  the figure, where a superscript reads as an exponent
                  ("1,243 to the sixth"). A ref inside an aria-hidden span
                  would be unreachable, so the span is exposed and this
                  label is trimmed to avoid reading the sentence twice. */}
              <dt className="sr-only">
                New evangelical congregations needed
              </dt>
              <dd>
                <span className="block text-4xl sm:text-5xl font-bold text-brand-navy leading-none mb-1">
                  {formatNumber(countyStats.shortfall.total)}
                </span>
                <span className="block text-xl font-bold text-brand-amber leading-none mb-3">
                  churches
                </span>
                <span className="block text-base text-gray-700 leading-snug">
                  would bring every county to one per{" "}
                  {formatNumber(countyStats.shortfall.goal)} people
                  <NoteRef n={6} />
                </span>
                {/* Targets a node INSIDE the <details>, not the element
                    itself: navigating to a fragment within a closed details
                    opens it, so the drawer expands on click with no client
                    JS. Where that is unsupported it still scrolls the reader
                    to the closed drawer, which is a fair degradation. */}
                <a
                  href="#county-need-list"
                  className="mt-3 inline-block text-base font-semibold text-brand-navy underline decoration-brand-amber decoration-2 underline-offset-4 hover:decoration-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
                >
                  See the {countyStats.shortfall.countyCount} counties
                  <span aria-hidden="true"> &rarr;</span>
                </a>
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
            carries, 2020 U.S. Religion Census. There is no accepted standard
            for how many churches a population needs. The bands run in even
            steps of 500, with one boundary at the Global Alliance for Church
            Multiplication&rsquo;s stated saturation goal of one congregation
            per {formatNumber(scaleAnchors.gacxSaturationGoal)} people. For
            reference, Iowa averages one per{" "}
            {formatNumber(scaleAnchors.iowaAverage)} and the United States one
            per {formatNumber(scaleAnchors.usAverage)}.{" "}
            {countyStats.worst.name} County carries the most people per
            congregation —{" "}
            {formatNumber(peoplePerCongregation(countyStats.worst.name))};{" "}
            {countyStats.best.name} County the fewest, at{" "}
            {formatNumber(peoplePerCongregation(countyStats.best.name))}.{" "}
            The amber circles mark the {countyStats.shortfall.topCount}{" "}
            counties that need the most new churches, sized by how many and
            labelled with their principal cities:{" "}
            {countyWithCity(countyStats.shortfall.top[0])} needs{" "}
            {formatNumber(countyStats.shortfall.top[0].churchesNeeded)}, more
            than any other, then{" "}
            {countyStats.shortfall.top.slice(1, 5).map(countyWithCity).join(", ")}
            . Between them the {countyStats.shortfall.topCount} account for{" "}
            {countyStats.shortfall.topPctOfTotal}% of the{" "}
            {formatNumber(countyStats.shortfall.total)}{" "}
            congregations Iowa is
            short — a sum of each county&rsquo;s own gap, not a division of
            the state total. Thin coverage and a large shortfall are not the
            same thing: {countyStats.worst.name} County has the thinnest
            coverage in Iowa but only{" "}
            {formatNumber(countyStats.worst.population)} residents, so it needs{" "}
            {formatNumber(countyStats.worst.churchesNeeded)} more churches
            rather than the hundreds the largest counties need.
          </p>

          {/* Accessible data table for the MAP, and it stays even though the
              visible county table below now repeats 58 of its rows.

              WHY BOTH. The two tables answer different questions and neither
              is a superset in the way that matters. This one is the map's
              text equivalent: it carries people per evangelical congregation
              — the variable the choropleth actually shades, which the visible
              table does not have a column for — across all 99 counties,
              including the 41 already at the goal. Dropping it would leave
              seven bands of shading with no accessible equivalent for 41 of
              the counties they cover, and it would delete "41 counties
              already meet the goal" from the page entirely, which is half of
              what the shortfall means.

              The duplication is real: 58 counties, three shared columns. It
              is paid for in the captions instead — this one now closes by
              naming the shorter table that follows, and that table's caption
              names its own narrower scope, so a screen-reader user can tell
              within a sentence which of the two they are in and skip the one
              they have already heard. Table navigation is caption-driven, so
              distinguishing captions are the actual remedy for meeting the
              same data twice, not deleting one of the tables.

              sr-only lives on a wrapping div, not the table: overflow:hidden
              does not apply to table boxes, so a sr-only table lays out at
              full nowrap width and adds horizontal page scroll. */}
          <div className="sr-only">
            <table>
              <caption>
                Iowa counties in the 2020 U.S. Religion Census: population,
                evangelical congregations, people per evangelical congregation,
                new congregations needed, and the share of the population not
                counted as adherents of an evangelical congregation. All{" "}
                {countyStats.countyCount} counties on the map appear here, in
                alphabetical order. New congregations needed is how many the
                county would have to gain to reach one per{" "}
                {formatNumber(countyStats.shortfall.goal)} residents; 0 means
                it is already there. The{" "}
                {countyStats.shortfall.topCount}{" "}
                counties needing the most are the ones marked with circles on
                the map, and each of those circles is labelled there with the
                county&rsquo;s principal city — given here in brackets after
                the county name, so the city on the map and the county in this
                table are the same place. The share not counted is an upper
                bound; see note 3 at the foot of the page. In
                counties with only a handful of congregations, the figure for
                people per congregation is approximate. A shorter table below
                lists only the{" "}
                {countyStats.shortfall.countyCount} counties that fall short,
                ordered by how many congregations each one needs.
              </caption>
              <thead>
                <tr>
                  <th scope="col">County</th>
                  <th scope="col">Population</th>
                  <th scope="col">Evangelical congregations</th>
                  <th scope="col">People per evangelical congregation</th>
                  <th scope="col">New congregations needed</th>
                  <th scope="col">Not counted as adherents</th>
                </tr>
              </thead>
              <tbody>
                {countyRows.map((row) => (
                  <tr key={row.fips}>
                    {/* The city rides the row header rather than taking a
                        column of its own: a 7th column would be empty for 89
                        of the 99 rows and read as "blank" on every one of
                        them, where the header costs two words on the ten
                        rows that have a city and nothing on the rest. */}
                    <th scope="row">{countyWithCity(row)}</th>
                    <td>{formatNumber(row.population)}</td>
                    <td>{formatNumber(row.evangelicalCongregations)}</td>
                    <td>
                      {formatNumber(Math.round(row.peoplePerCongregation))}
                    </td>
                    <td>{formatNumber(row.churchesNeeded)}</td>
                    <td>{row.notEvangelicalPct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* The county list, as a native disclosure.

              NO CLIENT JS. `<details>`/`<summary>` gets the keyboard
              operation, focus handling, `aria-expanded` state and
              find-in-page behaviour that a div-and-button version would have
              to re-implement, and it keeps /iowa a server component with zero
              hydration — this page has no client components and a disclosure
              is not the reason to introduce the first one.

              Closed by default, but every row is in the HTML either way: the
              content of a closed `<details>` is rendered and indexed, so the
              58 counties are findable by search engines and by Ctrl+F (which
              opens the disclosure to reveal its hit) without JavaScript. */}
          <details className="group mt-8 max-w-3xl mx-auto overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
            {/* The default triangle is hidden in all three engines — Chrome
                and Firefox honour `list-style: none` on summary, Safari needs
                the -webkit pseudo-element — and replaced by a chevron that
                rotates 180° on open. It is navy, not amber: brand amber is
                about 1.9:1 on this surface and a state indicator has to clear
                3:1 (SC 1.4.11). Same reason the focus outline below is navy
                rather than the site's usual amber; the inset offset is so the
                card's `overflow-hidden` cannot clip it. */}
            <summary className="cursor-pointer list-none rounded-2xl px-3 py-4 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-navy sm:px-5 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-3 text-base font-semibold text-brand-navy">
                <span>
                  See all {countyStats.shortfall.countyCount} counties that
                  need churches
                </span>
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                >
                  <path
                    d="M5 7.5 10 12.5 15 7.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </summary>

            {/* The description sits OUTSIDE the scroll region, and a <caption>
                cannot: a caption box takes the table's width, so at 375px it
                inherits the table's 438px and the sentence is cut off at the
                card edge until the reader scrolls sideways to finish reading
                it. Prose has to wrap to the viewport. The table keeps a short
                visually-hidden caption for its accessible name, which is the
                part <caption> is actually better at than a paragraph. */}
            <p
              id="county-need-list"
              className="scroll-mt-24 border-t border-gray-200 px-3 pt-4 text-sm text-gray-600 leading-snug sm:px-5"
            >
              The {countyStats.shortfall.countyCount} Iowa counties with fewer
              than one evangelical congregation per{" "}
              {formatNumber(countyStats.shortfall.goal)} residents, the most
              needed first. The other {countiesAtGoal} counties already meet
              the goal and are not listed. 2020 U.S. Religion Census; see note
              6 at the foot of the page for how the shortfall is counted.
              {/* Plain text, not a NoteRef: each note carries exactly one ref
                  so its back-link has a unique target, and note 6's ref
                  already sits on the 1,243 figure above. */}
            </p>

            {/* All four columns fit at 375px, so there is no scroll hint and
                no sideways scroll to hint at. This wrapper is the safety net,
                not the plan: below 375px, and at large text-zoom settings
                (SC 1.4.4), the table will still outgrow its column and has to
                scroll somewhere other than the page. A scroll container has to
                be reachable without a mouse (SC 2.1.1), hence tabIndex and a
                visible focus style on it; `role="region"` with a name is what
                makes that tab stop announce itself rather than landing a
                screen-reader user on an anonymous div. */}
            <div
              role="region"
              aria-label="Counties ranked by churches needed"
              tabIndex={0}
              /* `relative` is load-bearing, not decoration. The sr-only header
                 spans are `position:absolute`, and an absolutely-positioned
                 element is only clipped by an ancestor's overflow if that
                 ancestor is in its containing-block chain. Without this class
                 they were laid out at their static position inside the full
                 329px table, escaped the 286px scrollport, and pushed the
                 PAGE sideways by 14px at 320px wide. */
              className="relative mt-4 overflow-x-auto pb-5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-navy"
            >
              {/* Reference data, not body prose: the page's ban on small grey
                  type is about copy people read in sequence, and a 58-row
                  lookup table at 16px is harder to scan, not easier. 14px from
                  `sm` up; 13px on phones, which is the last of the three
                  economies that got the fourth column on screen at 375. No
                  `min-w-*` — a floor wider than the scrollport would force a
                  scrollbar back onto a table that now fits. */}
              <table className="w-full text-[13px] sm:text-sm">
                {/* sr-only on the SPAN, never on the <caption> itself. A
                    caption is a table box, so `overflow:hidden` does not clip
                    it, and `sr-only`'s `position:absolute` escapes the scroll
                    region's clipping because that region is not a positioned
                    ancestor — the caption then lays out at its nowrap
                    min-content width and pushes the whole PAGE sideways. It
                    measured 14px of document overflow at 320px. Same family
                    as the sr-only state table further up this page. */}
                <caption>
                  <span className="sr-only">
                    Iowa counties that need churches, most needed first
                  </span>
                </caption>
                {/* HOW THE FOURTH COLUMN GOT ON SCREEN AT 375px.
                    The table wanted 438px of a 341px scrollport, and the fat
                    was in the headers, not the data — "Evangelical churches"
                    sets a column wider than any number in it. Three economies,
                    in order of how much they cost the reader:

                    1. Abbreviated headers below `sm` only — "Evangelical
                       churches" to "Churches", "Churches needed" to "Needed",
                       "Population" to "People". The full wording stays in the
                       cell as an sr-only span and the short version is
                       aria-hidden, so the ACCESSIBLE NAME never degrades — a
                       screen-reader user hears "Evangelical churches" at
                       every width, and the row cells keep a header
                       association that says what they are. It is the header
                       that sets these column widths, not the data: at 13px
                       "Population" is wider than 492,401.
                    2. Tighter cell padding below `sm`.
                    3. 13px type below `sm`, one notch down from 14.

                    The data itself was not touched: no dropped thousands
                    separators, no truncated county names, and the column
                    order is Matt's at every width.

                    The county column stays pinned (`sticky left-0` plus the
                    card's background) for the cases where the wrapper still
                    has to scroll — under 375px and at large text zoom. A
                    number with no county beside it is not data. That is also
                    why the horizontal padding sits on the edge CELLS rather
                    than the scroll container: padding on the container would
                    leave the pinned column flush against the card border the
                    moment anyone scrolls. */}
                <thead>
                  <tr className="border-b border-gray-300 text-brand-navy">
                    <th
                      scope="col"
                      className="sticky left-0 bg-gray-50 py-2 pl-3 pr-1.5 text-left font-semibold tracking-tight sm:pl-5 sm:pr-3 sm:tracking-normal"
                    >
                      County
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-2 text-right font-semibold sm:px-3"
                    >
                      <span aria-hidden="true" className="sm:hidden">
                        People
                      </span>
                      <span className="sr-only sm:not-sr-only">Population</span>
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-2 text-right font-semibold sm:px-3"
                    >
                      <span aria-hidden="true" className="sm:hidden">
                        Churches
                      </span>
                      <span className="sr-only sm:not-sr-only">
                        Evangelical churches
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="py-2 pl-1 pr-3 text-right font-semibold sm:pl-3 sm:pr-5"
                    >
                      <span aria-hidden="true" className="sm:hidden">
                        Needed
                      </span>
                      <span className="sr-only sm:not-sr-only">
                        Churches needed
                      </span>
                    </th>
                  </tr>
                </thead>
                {/* Hairlines, not zebra: the card already sits on a tinted
                    surface, so a second tint per row would be a third value
                    competing with the amber emphasis in the last column. */}
                <tbody className="divide-y divide-gray-200">
                  {countyStats.shortfall.ranked.map((row) => (
                    <tr key={row.fips}>
                      <th
                        scope="row"
                        className="sticky left-0 bg-gray-50 py-2 pl-3 pr-1.5 text-left font-normal tracking-tight text-gray-700 sm:pl-5 sm:pr-3 sm:tracking-normal"
                      >
                        {row.name}
                      </th>
                      <td className="px-1 py-2 text-right tabular-nums text-gray-700 sm:px-3">
                        {formatNumber(row.population)}
                      </td>
                      <td className="px-1 py-2 text-right tabular-nums text-gray-700 sm:px-3">
                        {formatNumber(row.evangelicalCongregations)}
                      </td>
                      <td className="py-2 pl-1 pr-3 text-right font-semibold tabular-nums text-brand-navy sm:pl-3 sm:pr-5">
                        {formatNumber(row.churchesNeeded)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300 font-semibold text-brand-navy">
                    <th
                      scope="row"
                      className="sticky left-0 bg-gray-50 py-2 pl-3 pr-1.5 text-left tracking-tight sm:pl-5 sm:pr-3 sm:tracking-normal"
                    >
                      All {countyStats.shortfall.countyCount}
                    </th>
                    <td className="px-1 py-2 text-right tabular-nums sm:px-3">
                      {formatNumber(needTableTotals.population)}
                    </td>
                    <td className="px-1 py-2 text-right tabular-nums sm:px-3">
                      {formatNumber(needTableTotals.congregations)}
                    </td>
                    <td className="py-2 pl-1 pr-3 text-right tabular-nums sm:pl-3 sm:pr-5">
                      {formatNumber(needTableTotals.needed)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </details>
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
              The Hispanic Opportunity
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
          {/* The county-aware total, the same figure the county section
              publishes — see note 6 for why it is not the statewide
              division. Plain statement of fact, no rhetorical framing. */}
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
            Iowa needs {formatNumber(countyStats.shortfall.total)} more
            evangelical congregations.
          </h2>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
            Behind that number are {formatNumber(notEvangelical)} Iowans on
            streets and in towns within reach of a church that does not yet
            exist. Whether God is calling you to plant or calling your church
            to send, there is a place for you in this work.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/plant"
              className="focus-ring inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-amber text-brand-navy text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Explore planting
            </Link>
            <Link
              href="/partner"
              className="focus-ring inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white hover:text-brand-navy transition-colors"
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
              The shortfall is counted county by county: for each county, one
              congregation per{" "}
              {formatNumber(countyStats.shortfall.goal)} residents, minus the
              congregations it already has, summed across the{" "}
              {countyStats.shortfall.countyCount}{" "}
              counties that fall short.
              Counties already past the goal contribute nothing, and their
              surplus is not subtracted from anyone else&rsquo;s gap, because a
              church in one county does not serve another. Running the same
              arithmetic on Iowa as a whole instead — one congregation per{" "}
              {formatNumber(countyStats.shortfall.goal)} residents statewide,
              minus its{" "}
              {formatNumber(countyStats.totalCongregations)} congregations —
              gives a smaller figure,{" "}
              {formatNumber(countyStats.shortfall.statewideDivision)}, because
              that version lets a surplus in a small rural county cancel a
              shortfall in Polk. The gap between the two is the whole point. One congregation per{" "}
              {formatNumber(scaleAnchors.gacxSaturationGoal)}{" "}
              people is the
              Global Alliance for Church Multiplication&rsquo;s stated
              saturation goal ({scaleAnchors.gacxUrl}) — a goal for global
              evangelization, not an empirical benchmark, and no accepted
              standard for how many churches a population needs exists.
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
