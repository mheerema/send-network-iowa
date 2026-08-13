import census from "@/data/iowa-county-evangelical-2020.json";
import stateCensus from "@/data/state-evangelical-2020.json";
import { countyPaths, IOWA_MAP_VIEWBOX } from "@/data/iowa-county-paths";

/**
 * Iowa county choropleth: people per evangelical congregation.
 * Static server component: inline SVG, no client JS, no chart library.
 * Responsive via viewBox + max-width.
 *
 * Basemap: see `@/data/iowa-county-paths` for source and license
 * (U.S. Census Bureau 2020 cartographic boundary files, public domain).
 * Join key: 5-character FIPS/GEOID, string — never coerce to a number,
 * the leading zeros are load-bearing outside Iowa.
 *
 * WHY THIS MEASURE AND NOT THE PERCENTAGE. 477 of Iowa's 2,153 evangelical
 * congregations reported a congregation count but no adherent figure to the
 * 2020 census, and they cluster unevenly. That makes county-level
 * `notEvangelicalPct` an upper bound, and it is worst in exactly the counties
 * a naive choropleth would paint darkest (Allamakee reads 97.6% raw, roughly
 * 88.6% once its unreported congregations are given the statewide average
 * size). Congregation counts, by contrast, are complete and reconcile exactly
 * to the state total — so the map shades population ÷ evangelical
 * congregations, which carries no reporting bias. The percentages still
 * appear, per county, in the screen-reader table.
 */

const counties = census.counties;

function round(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

const statewidePopulation = counties.reduce((s, c) => s + c.population, 0);
const statewideCongregations = counties.reduce(
  (s, c) => s + c.evangelicalCongregations,
  0
);

/**
 * WHERE THE CLASS BREAKS COME FROM.
 *
 * There is no accepted standard for how many churches a population needs, and
 * the page says so out loud. NAMB and Send Network publish "one church per X
 * people" on every Send City page without ever stating a target or citing a
 * source, so there is no benchmark to borrow there either. Breaking this ramp
 * on quantiles or round numbers would invent one by implication — the darkest
 * class would read as "enough" purely because it is the darkest.
 *
 * So every break below is a NAMED, EXTERNAL, CITABLE reference point, or an
 * average computed from the census payloads on disk. None of them is a
 * threshold of adequacy and the legend never claims one.
 */

/**
 * Global Alliance for Church Multiplication: "a healthy, multiplying,
 * sustainable church for every 1,000 people" — https://gacx.io/about,
 * reproduced in the Lausanne Occasional Paper on Saturation Church Planting.
 *
 * This is a stated global evangelization GOAL with no published empirical
 * rationale behind the number. Cite it BY NAME as a goal; never call it "the
 * benchmark" or "the standard." Do NOT conflate it with the Hartford
 * Institute's descriptive 2010 congregations-÷-population arithmetic, which
 * lands on the same figure and means the opposite thing (what America had,
 * not what it should have). And do not reach for the "1900: one church per
 * 430 people" line — it traces to a 1991 practitioner handbook, not to a
 * demographic study.
 */
const GACX_SATURATION_GOAL = 1000;

/** Iowa's own average. Same figure the key-stat band publishes. */
const IOWA_AVERAGE = Math.round(statewidePopulation / statewideCongregations);

/** The US evangelical average, from the national totals in the state payload. */
const US_AVERAGE = Math.round(
  stateCensus.usTotal.population / stateCensus.usTotal.evangelicalCongregations
);

/**
 * The one break that anchors to nothing. It is not a reference point and is
 * not presented as one — it exists only so the long tail above the US average
 * (19 counties from 1,660 to 6,495) does not collapse into a single flat
 * class. If a citable anchor ever turns up for this range, replace it.
 */
const LONG_TAIL_BREAK = 3000;

/**
 * Ramp shared with UsEvangelicalMap so the two maps read as one system —
 * which is exactly why it runs the direction it does.
 *
 * DARK = MORE EVANGELICAL COVERAGE, LIGHT = THE LACK. On the national map
 * dark means a higher evangelical share (the Deep South is darkest, Utah
 * lightest). This measure is inverted relative to that one — FEWER people per
 * congregation is BETTER coverage — so the ramp has to be inverted against the
 * thresholds to keep the two maps saying the same thing with the same ink.
 * The darkest step is therefore the LOWEST band, and the top band is the
 * palest. Do not "fix" this by sorting the fills light-to-dark.
 *
 * `anchor` is the short name shown on the chip; the map's caption spells the
 * anchors out in full. Only the two anchored classes carry one — five annotated
 * chips do not stay legible at 375px.
 */
const BREAKS = [
  {
    below: GACX_SATURATION_GOAL,
    anchor: "meets GACX goal",
    fill: "#10294c",
  },
  { below: IOWA_AVERAGE, anchor: null, fill: "#46608c" },
  { below: US_AVERAGE, anchor: null, fill: "#7e93b7" },
  { below: LONG_TAIL_BREAK, anchor: "below the US average", fill: "#b9c6dd" },
  { below: Infinity, anchor: null, fill: "#e2e8f2" },
] as const;

/** Labels derived from the breaks, so a boundary can never disagree with its own chip. */
const CLASSES = BREAKS.map((b, i) => ({
  ...b,
  label:
    i === 0
      ? `Under ${round(b.below)}`
      : b.below === Infinity
        ? `${round(BREAKS[i - 1].below)} or more`
        : `${round(BREAKS[i - 1].below)}–${round(b.below)}`,
}));

function fillFor(peoplePerCongregation: number): string {
  return CLASSES.find((c) => peoplePerCongregation < c.below)!.fill;
}

/**
 * Ordering guard. Two of the four breaks are computed from census payloads
 * rather than typed in, so a data revision could push Iowa's average past the
 * national one. `fillFor` takes the first match, so a non-ascending break list
 * silently produces an empty class and a mislabeled ramp rather than an error.
 */
const outOfOrder = CLASSES.findIndex(
  (c, i) => i > 0 && CLASSES[i - 1].below >= c.below
);
if (outOfOrder > -1) {
  throw new Error(
    `Iowa county class breaks are not ascending: ` +
      `${CLASSES.map((c) => c.below).join(", ")}. The anchors crossed — ` +
      `Iowa's average (${IOWA_AVERAGE}) and the US average (${US_AVERAGE}) ` +
      `are derived from the payloads, so re-order the ramp rather than ` +
      `hardcoding the old order.`
  );
}

/** The anchors, for the prose that has to name them. Never re-typed on the page. */
export const scaleAnchors = {
  gacxSaturationGoal: GACX_SATURATION_GOAL,
  iowaAverage: IOWA_AVERAGE,
  usAverage: US_AVERAGE,
  gacxUrl: "https://gacx.io/about",
};

/** Drop the "County" suffix the census payload carries. */
function shortName(name: string): string {
  return name.replace(/ County$/, "");
}

export interface CountyRow {
  fips: string;
  /** County name without the "County" suffix. */
  name: string;
  population: number;
  evangelicalCongregations: number;
  /** population ÷ evangelical congregations, unrounded. */
  peoplePerCongregation: number;
  /** Upper bound — see the reporting-gap note above. */
  notEvangelicalPct: number;
}

/** Every county row, derived from the census payload — never hand-listed. */
export const countyRows: CountyRow[] = counties
  .map((c) => ({
    fips: c.fips,
    name: shortName(c.name),
    population: c.population,
    evangelicalCongregations: c.evangelicalCongregations,
    peoplePerCongregation: c.population / c.evangelicalCongregations,
    notEvangelicalPct: c.notEvangelicalPct,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const byFips = new Map(countyRows.map((r) => [r.fips, r]));

/**
 * Join guard. A silent FIPS mismatch would render an unfilled county, which
 * reads as "no data" when it means "bad key". Fail the build instead.
 */
const unmatchedPaths = countyPaths.filter((p) => !byFips.has(p.fips));
const unmatchedRows = countyRows.filter(
  (r) => !countyPaths.some((p) => p.fips === r.fips)
);
if (unmatchedPaths.length || unmatchedRows.length) {
  throw new Error(
    `Iowa county join failed — basemap shapes with no data: ` +
      `${unmatchedPaths.map((p) => p.fips).join(", ") || "none"}; ` +
      `data rows with no shape: ` +
      `${unmatchedRows.map((r) => r.fips).join(", ") || "none"}`
  );
}

const sortedByRatio = [...countyRows].sort(
  (a, b) => a.peoplePerCongregation - b.peoplePerCongregation
);

/** Counties matching a ratio test, with the share of Iowans who live in them. */
function bandOf(test: (ratio: number) => boolean) {
  const band = countyRows.filter((r) => test(r.peoplePerCongregation));
  const pop = band.reduce((sum, r) => sum + r.population, 0);
  return {
    countyCount: band.length,
    pctOfCounties: Math.round((band.length / countyRows.length) * 100),
    population: pop,
    pctOfState: Math.round((pop / statewidePopulation) * 100),
  };
}

/** Derived figures the page quotes in prose. Computed, not typed in. */
export const countyStats = {
  statewide: IOWA_AVERAGE,
  best: sortedByRatio[0],
  worst: sortedByRatio[sortedByRatio.length - 1],
  countyCount: countyRows.length,
  totalCongregations: statewideCongregations,
  /** Congregations counted by the census with no adherent figure reported. */
  congregationsWithoutAdherentCount: counties.reduce(
    (s, c) => s + c.evangelicalCongregationsWithoutAdherentCount,
    0
  ),
  /**
   * The darkest class: counties already at GACX's stated saturation goal. The
   * population share is the point — these are Iowa's emptiest counties, so the
   * count and the share pull in opposite directions.
   */
  meetsSaturationGoal: bandOf((ratio) => ratio < GACX_SATURATION_GOAL),
  /** The two palest classes: counties thinner than the US evangelical average. */
  belowUsAverage: bandOf((ratio) => ratio >= US_AVERAGE),
  /**
   * The inverse of meetsSaturationGoal: counties that fall short of GACX's
   * goal of one congregation per 1,000 people. This is the framing the page
   * leads with — the shortfall, counted in counties and in people.
   */
  belowSaturationGoal: bandOf((ratio) => ratio >= GACX_SATURATION_GOAL),
  /**
   * Ratio noise. A county's ratio moves by 1/(n+1) when it gains one church,
   * so at three congregations a single church swings it 25%. These are the
   * counties whose figures rest on the fewest congregations — derived, never
   * hand-listed, and reported as approximate in the notes.
   */
  fewestCongregations: [...countyRows]
    .sort(
      (a, b) =>
        a.evangelicalCongregations - b.evangelicalCongregations ||
        a.population - b.population
    )
    .slice(0, 3)
    .map((r) => ({
      ...r,
      /** Percent the ratio moves if the county gains one congregation. */
      swingPctOnOneMore: Math.round(100 / (r.evangelicalCongregations + 1)),
    })),
};

export function peoplePerCongregation(countyName: string): number {
  const row = countyRows.find((r) => r.name === countyName);
  if (!row) throw new Error(`No county named "${countyName}"`);
  return Math.round(row.peoplePerCongregation);
}

/**
 * Direction guard. The whole point of the ramp above is that the darkest step
 * belongs to the best-covered counties. If someone re-sorts the fills, the map
 * silently starts arguing the opposite of its own caption — so assert it.
 */
const DARKEST = CLASSES[0].fill;
const LIGHTEST = CLASSES[CLASSES.length - 1].fill;
if (
  fillFor(countyStats.best.peoplePerCongregation) !== DARKEST ||
  fillFor(countyStats.worst.peoplePerCongregation) !== LIGHTEST
) {
  throw new Error(
    `Iowa county ramp is pointing the wrong way. Darker must mean better ` +
      `evangelical coverage: ${countyStats.best.name} (densest, ` +
      `${round(countyStats.best.peoplePerCongregation)} per congregation) must ` +
      `render ${DARKEST} but renders ` +
      `${fillFor(countyStats.best.peoplePerCongregation)}; ` +
      `${countyStats.worst.name} (thinnest, ` +
      `${round(countyStats.worst.peoplePerCongregation)}) must render ` +
      `${LIGHTEST} but renders ` +
      `${fillFor(countyStats.worst.peoplePerCongregation)}.`
  );
}

const MAP_LABEL =
  `Map of Iowa's ${countyStats.countyCount} counties, shaded by how many ` +
  `people there are for each evangelical congregation in the 2020 U.S. ` +
  `Religion Census. Darker counties have the most evangelical churches for ` +
  `their population; the palest counties have the fewest. The five shading ` +
  `bands break at one congregation per ${round(GACX_SATURATION_GOAL)} people, ` +
  `the saturation goal stated by the Global Alliance for Church ` +
  `Multiplication; at one per ${round(IOWA_AVERAGE)}, Iowa's own average; at ` +
  `one per ${round(US_AVERAGE)}, the United States evangelical average; and ` +
  `at one per ${round(LONG_TAIL_BREAK)}. ` +
  `${countyStats.meetsSaturationGoal.countyCount} counties are in the ` +
  `darkest band and ${countyStats.belowUsAverage.countyCount} fall below the ` +
  `United States average. ${countyStats.worst.name} County is thinnest at one ` +
  `for every ${round(countyStats.worst.peoplePerCongregation)}; ` +
  `${countyStats.best.name} County is densest at one for every ` +
  `${round(countyStats.best.peoplePerCongregation)}. County-by-county figures ` +
  `follow in the table.`;

/** The extreme; outlined in amber, the same highlight the US map uses. */
const HIGHLIGHT_FIPS = countyStats.worst.fips;

export default function IowaCountyMap() {
  const highlight = countyPaths.find((p) => p.fips === HIGHLIGHT_FIPS)!;

  return (
    <div>
      <svg
        viewBox={IOWA_MAP_VIEWBOX}
        role="img"
        aria-label={MAP_LABEL}
        className="w-full max-w-full h-auto"
      >
        <g stroke="#ffffff" strokeWidth={1.25} strokeLinejoin="round">
          {countyPaths.map((p) => (
            <path
              key={p.fips}
              d={p.d}
              fill={fillFor(byFips.get(p.fips)!.peoplePerCongregation)}
            />
          ))}
        </g>
        {/* Drawn last so the highlight sits above its neighbors. Two strokes,
            not one: the called-out county is now the PALEST on the map, and
            brand amber on #e2e8f2 is about 1.5:1 — well under the 3:1 floor
            for non-text contrast. The navy underlay shows as a hairline on
            either side of the amber, so the callout stays findable against a
            near-white fill without changing the callout color the US map
            uses. */}
        <path
          d={highlight.d}
          fill={fillFor(countyStats.worst.peoplePerCongregation)}
          stroke="#10294c"
          strokeWidth={6}
          strokeLinejoin="round"
        />
        <path
          d={highlight.d}
          fill="none"
          stroke="#fbac33"
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
      </svg>

      {/* Legend; the aria-label and the data table carry this for AT.
          Chips carry raw ratios — no "well covered" or "underserved", because
          no source supports calling any of these bands adequate. Two of them
          name the anchor their boundary comes from; the caption spells those
          anchors out in full.

          The direction rides on the heading, not on the end chips: a wrapping
          chip row cannot rely on "left end / right end" holding position at
          375px, and "darker means more" is tied to color rather than to
          position, so it survives any wrap. */}
      <div aria-hidden="true" className="mt-4">
        <p className="text-xs font-semibold text-brand-navy">
          Iowans per evangelical congregation{" "}
          <span className="font-normal text-gray-500">
            — darker means more churches per person
          </span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          {CLASSES.map((c) => (
            <span
              key={c.label}
              className="flex items-center gap-1.5 text-xs text-gray-500"
            >
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-[2px] ring-1 ring-inset ring-black/10"
                style={{ backgroundColor: c.fill }}
              />
              <span>
                {c.label}
                {c.anchor ? ` — ${c.anchor}` : ""}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
