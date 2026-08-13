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

/** Ramp shared with UsAdherenceMap so the two maps read as one system. */
const CLASSES = [
  { below: 750, label: "Under 750", fill: "#e2e8f2" },
  { below: 1250, label: "750–1,250", fill: "#b9c6dd" },
  { below: 2000, label: "1,250–2,000", fill: "#7e93b7" },
  { below: 3000, label: "2,000–3,000", fill: "#46608c" },
  { below: Infinity, label: "3,000 or more", fill: "#10294c" },
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
};

export function peoplePerCongregation(countyName: string): number {
  const row = countyRows.find((r) => r.name === countyName);
  if (!row) throw new Error(`No county named "${countyName}"`);
  return Math.round(row.peoplePerCongregation);
}

function round(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

const MAP_LABEL =
  `Map of Iowa's ${countyStats.countyCount} counties, shaded by how many ` +
  `people there are for each evangelical congregation in the 2020 U.S. ` +
  `Religion Census. Darker means fewer congregations for the population. ` +
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
        {/* Drawn last so the highlight stroke sits above its neighbors. */}
        <path
          d={highlight.d}
          fill={fillFor(countyStats.worst.peoplePerCongregation)}
          stroke="#fbac33"
          strokeWidth={4}
          strokeLinejoin="round"
        />
      </svg>

      {/* Legend; the aria-label and the data table carry this for AT. */}
      <div
        aria-hidden="true"
        className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2"
      >
        <span className="text-xs font-semibold text-brand-navy">
          People per evangelical congregation
        </span>
        {CLASSES.map((c) => (
          <span
            key={c.label}
            className="flex items-center gap-1.5 text-xs text-gray-500"
          >
            <span
              className="inline-block h-3 w-3 rounded-[2px] ring-1 ring-inset ring-black/10"
              style={{ backgroundColor: c.fill }}
            />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}
