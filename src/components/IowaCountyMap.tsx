import census from "@/data/iowa-county-evangelical-2020.json";
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

/**
 * Ramp shared with UsEvangelicalMap so the two maps read as one system —
 * which is exactly why it runs the direction it does.
 *
 * DARK = MORE EVANGELICAL COVERAGE, LIGHT = THE LACK. On the national map
 * dark means a higher evangelical share (the Deep South is darkest, Utah
 * lightest). This measure is inverted relative to that one — FEWER people per
 * congregation is BETTER coverage — so the ramp has to be inverted against the
 * thresholds to keep the two maps saying the same thing with the same ink.
 * The darkest step is therefore the LOWEST band, and "3,000 or more" is the
 * palest. Do not "fix" this by sorting the fills light-to-dark.
 */
const CLASSES = [
  { below: 750, label: "Under 750", fill: "#10294c" },
  { below: 1250, label: "750–1,250", fill: "#46608c" },
  { below: 2000, label: "1,250–2,000", fill: "#7e93b7" },
  { below: 3000, label: "2,000–3,000", fill: "#b9c6dd" },
  { below: Infinity, label: "3,000 or more", fill: "#e2e8f2" },
] as const;

function fillFor(peoplePerCongregation: number): string {
  return CLASSES.find((c) => peoplePerCongregation < c.below)!.fill;
}

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

const statewidePopulation = counties.reduce((s, c) => s + c.population, 0);
const statewideCongregations = counties.reduce(
  (s, c) => s + c.evangelicalCongregations,
  0
);

const sortedByRatio = [...countyRows].sort(
  (a, b) => a.peoplePerCongregation - b.peoplePerCongregation
);

/** Derived figures the page quotes in prose. Computed, not typed in. */
export const countyStats = {
  statewide: Math.round(statewidePopulation / statewideCongregations),
  best: sortedByRatio[0],
  worst: sortedByRatio[sortedByRatio.length - 1],
  countiesOver90PctUnconnected: countyRows.filter((r) => r.notEvangelicalPct > 90)
    .length,
  countyCount: countyRows.length,
  totalCongregations: statewideCongregations,
  /** Congregations counted by the census with no adherent figure reported. */
  congregationsWithoutAdherentCount: counties.reduce(
    (s, c) => s + c.evangelicalCongregationsWithoutAdherentCount,
    0
  ),
  /**
   * The thinnest-covered counties (2,000+ people per evangelical congregation,
   * the bottom two legend classes) and the share of Iowans who live in them.
   */
  thinlyCovered: (() => {
    const thin = countyRows.filter((r) => r.peoplePerCongregation >= 2000);
    const pop = thin.reduce((sum, r) => sum + r.population, 0);
    return {
      countyCount: thin.length,
      population: pop,
      pctOfState: Math.round((pop / statewidePopulation) * 100),
    };
  })(),
};

export function peoplePerCongregation(countyName: string): number {
  const row = countyRows.find((r) => r.name === countyName);
  if (!row) throw new Error(`No county named "${countyName}"`);
  return Math.round(row.peoplePerCongregation);
}

function round(n: number): string {
  return Math.round(n).toLocaleString("en-US");
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
  `their population; the palest counties have the fewest. ` +
  `Statewide there is one evangelical congregation for every ` +
  `${round(countyStats.statewide)} Iowans. ${countyStats.worst.name} County ` +
  `is thinnest at one for every ${round(countyStats.worst.peoplePerCongregation)}; ` +
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
          Ordered dark → light so the strip itself reads as the direction, and
          the two extreme swatches say the direction in words — a wrapping chip
          row cannot rely on "left end / right end" labels holding position at
          375px, so the direction rides on the chips that never separate from
          their own color. */}
      <div aria-hidden="true" className="mt-4">
        <p className="text-xs font-semibold text-brand-navy">
          Evangelical coverage{" "}
          <span className="font-normal text-gray-500">
            — Iowans per evangelical congregation
          </span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          {CLASSES.map((c, i) => (
            <span
              key={c.label}
              className="flex items-center gap-1.5 text-xs text-gray-500"
            >
              <span
                className="inline-block h-3 w-3 rounded-[2px] ring-1 ring-inset ring-black/10"
                style={{ backgroundColor: c.fill }}
              />
              {c.label}
              {i === 0 && (
                <span className="text-gray-400">(more coverage)</span>
              )}
              {i === CLASSES.length - 1 && (
                <span className="text-gray-400">(less coverage)</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
