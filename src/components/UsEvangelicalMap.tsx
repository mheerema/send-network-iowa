import census from "@/data/state-evangelical-2020.json";
import {
  statePaths,
  US_MAP_VIEWBOX,
  DC_MARKER,
  AK_HI_SEPARATOR,
} from "@/data/us-states-paths";

/**
 * Pew-style US choropleth of EVANGELICAL adherence by state — the share of a
 * state's population counted as adherents of an Evangelical Protestant
 * congregation (ARDA tradition T=1) in the 2020 U.S. Religion Census.
 *
 * This replaced the general-adherence measure (every tradition, 27–76%),
 * which was answering a different question: Utah led the country on general
 * adherence at 76.1% while ranking dead last on evangelical adherence at
 * 2.0%. The map now shades the metric the page is actually about.
 *
 * Static server component: inline SVG, no client JS, no chart library.
 * Responsive via viewBox + max-width; AK/HI insets come from the basemap.
 *
 * Accessibility: the SVG is a single labeled image (role="img"); the
 * state-by-state data lives in the sr-only table on /iowa, which covers all
 * 50 states plus DC and is built from `stateRows` below.
 */

const states = census.states as Record<string, StateRecord>;

interface StateRecord {
  code: string;
  population: number;
  evangelicalAdherents: number;
  evangelicalCongregations: number;
  evangelicalRate: number;
  evangelicalCongregationsWithoutAdherentCount: number;
  /** 1–50 over the states only. DC is unranked: it is not a state. */
  evangelicalRateRank: number | null;
  evangelicalAdherentsImputedUpperBound: number;
  evangelicalRateImputedUpperBound: number;
}

/**
 * Sequential single-hue ramp derived from brand-navy #10294c, shared with
 * IowaCountyMap so the two maps read as one system.
 *
 * Five classes on round breaks; data range is 2.0–42.1, national 16.5.
 * The distribution is hard right-skewed (a long low tail through the
 * Northeast and Mountain West, then a short heavy Deep South tail), so the
 * two upper classes are deliberately wide: 14 / 15 / 12 / 5 / 5 states.
 * A rate equal to a break goes in the higher class (e.g. 15.0 → "15–25%").
 */
const CLASSES = [
  { below: 10, label: "Under 10%", fill: "#e2e8f2" },
  { below: 15, label: "10–15%", fill: "#b9c6dd" },
  { below: 25, label: "15–25%", fill: "#7e93b7" },
  { below: 35, label: "25–35%", fill: "#46608c" },
  { below: Infinity, label: "35% or more", fill: "#10294c" },
] as const;

function fillFor(rate: number): string {
  return CLASSES.find((c) => rate < c.below)!.fill;
}

export interface StateRow {
  name: string;
  /** USPS two-letter code. */
  code: string;
  /** Percent of population counted as evangelical adherents. */
  rate: number;
  /** 1–50, highest rate first. Null for DC, which is not ranked. */
  rank: number | null;
  population: number;
  congregations: number;
}

/** Every jurisdiction on the map, derived from the payload — never hand-listed. */
export const stateRows: StateRow[] = Object.entries(states)
  .map(([name, s]) => ({
    name,
    code: s.code,
    rate: s.evangelicalRate,
    rank: s.evangelicalRateRank,
    population: s.population,
    congregations: s.evangelicalCongregations,
  }))
  .sort((a, b) => a.rate - b.rate || a.name.localeCompare(b.name));

const rateByCode = new Map(stateRows.map((r) => [r.code, r.rate]));

/**
 * Join guard, same rigor as the county map. A silent code mismatch would
 * render an unfilled state, which reads as "no data" when it means "bad key".
 * Fail the build instead. Also rejects a non-finite rate, which would slip
 * past `fillFor` into a `fill` of "undefined".
 */
const shapesWithoutData = statePaths.filter((p) => !rateByCode.has(p.code));
const dataWithoutShapes = stateRows.filter(
  (r) => !statePaths.some((p) => p.code === r.code)
);
const badRates = stateRows.filter((r) => !Number.isFinite(r.rate));
if (shapesWithoutData.length || dataWithoutShapes.length || badRates.length) {
  throw new Error(
    `US evangelical map join failed — basemap shapes with no data: ` +
      `${shapesWithoutData.map((p) => p.code).join(", ") || "none"}; ` +
      `data rows with no shape: ` +
      `${dataWithoutShapes.map((r) => r.code).join(", ") || "none"}; ` +
      `non-numeric rates: ${badRates.map((r) => r.code).join(", ") || "none"}`
  );
}
if (stateRows.length !== 51) {
  throw new Error(
    `Expected 51 jurisdictions (50 states + DC), got ${stateRows.length}.`
  );
}

/**
 * Which states border Iowa is an editorial fact and stays hand-listed; their
 * rates and the "lowest of the six" claim are derived, so neither can drift
 * from the payload.
 */
const NEIGHBOR_STATES = [
  "Minnesota",
  "Wisconsin",
  "Illinois",
  "Missouri",
  "Nebraska",
  "South Dakota",
] as const;

const iowa = states.Iowa;
const iowaRate = iowa.evangelicalRate;
const iowaRank = iowa.evangelicalRateRank!;
const usRate = census.usTotal.evangelicalRate;

const neighborRates = NEIGHBOR_STATES.map((name) => ({
  name,
  rate: states[name].evangelicalRate,
}));
/**
 * The lead-in says Iowa is last among its neighbors. Assert it rather than
 * trust it: a payload correction that flipped this would otherwise ship a
 * false claim in the one sentence the section leads with.
 */
if (!neighborRates.every((n) => n.rate > iowaRate)) {
  throw new Error(
    `Iowa (${iowaRate}%) is no longer strictly lowest among its neighbors: ` +
      neighborRates.map((n) => `${n.name} ${n.rate}%`).join(", ")
  );
}

const rankedStates = stateRows.filter((r) => r.rank !== null);
const lowest = stateRows[0];
const highest = stateRows[stateRows.length - 1];

/** Figures the page quotes in prose. Computed, not typed in. */
export const stateStats = {
  iowaRate,
  iowaRank,
  usRate,
  rankedStateCount: rankedStates.length,
  lowest,
  highest,
  neighbors: neighborRates,
  usPopulation: census.usTotal.population,
  usCongregations: census.usTotal.evangelicalCongregations,
};

/**
 * The reporting gap, derived. Congregations that reported a congregation
 * count but no adherent figure contribute zero adherents, so every rate on
 * this map is understated — and not evenly, which is what makes it a map
 * problem rather than a footnote problem.
 *
 * The imputed figures come from the payload's `sensitivity` block and are
 * flagged `doNotUseAsHeadline` at the source: non-reporting congregations
 * skew small, so mean-imputation overshoots. They belong in the note as a
 * direction and magnitude, never as a published rate.
 */
const affectedShare = (s: StateRecord) =>
  (s.evangelicalCongregationsWithoutAdherentCount / s.evangelicalCongregations) *
  100;

const byAffectedShare = Object.entries(states)
  .map(([name, s]) => ({ name, share: affectedShare(s) }))
  .sort((a, b) => b.share - a.share);

const imputedRanking = Object.entries(states)
  .filter(([, s]) => s.evangelicalRateRank !== null)
  .map(([name, s]) => ({
    name,
    rate: (s.evangelicalAdherentsImputedUpperBound / s.population) * 100,
  }))
  .sort((a, b) => b.rate - a.rate);

const imputedRankOf = (name: string) =>
  imputedRanking.findIndex((r) => r.name === name) + 1;

const nonReportingCongregations = Object.values(states).reduce(
  (sum, s) => sum + s.evangelicalCongregationsWithoutAdherentCount,
  0
);
const topRankedState = stateRows.find((r) => r.rank === 1)!;

export const reportingGap = {
  /** Evangelical congregations nationally that report no adherent figure. */
  nationalCongregations: nonReportingCongregations,
  nationalPct: (nonReportingCongregations / census.usTotal.evangelicalCongregations) * 100,
  iowaPct: affectedShare(iowa),
  /** Iowa's position on that share, 1 = most affected. */
  iowaAffectedPosition: byAffectedShare.findIndex((s) => s.name === "Iowa") + 1,
  /** Payload figures, flagged doNotUseAsHeadline at the source. */
  iowaRatePublished: census.validation.iowaEvangelicalRatePct,
  iowaRateImputed: iowa.evangelicalRateImputedUpperBound,
  iowaRankPublished: iowaRank,
  iowaRankImputed: imputedRankOf("Iowa"),
  topStateName: topRankedState.name,
  topStateRankImputed: imputedRankOf(topRankedState.name),
};

const MAP_LABEL =
  `Map of the United States shading each state by the share of its ` +
  `population counted as adherents of an evangelical congregation in the ` +
  `2020 U.S. Religion Census. Iowa is at ${iowaRate} percent, below the ` +
  `national rate of ${usRate} percent, ranking ${iowaRank} of ` +
  `${rankedStates.length} states. Rates range from ` +
  `${lowest.rate.toFixed(1)} percent in ${lowest.name} to ` +
  `${highest.rate.toFixed(1)} percent in ${highest.name}. ` +
  `Every state and the District of Columbia is listed in the table that ` +
  `follows.`;

/** Iowa's bounding box in the basemap is x 471–576, y 180–250. */
/** Centre of Iowa's bounding box in the 959x593 viewBox — the figure
 *  sits inside the state rather than beside it. */
const IOWA_CALLOUT = { x: 523, y: 215 };

export default function UsEvangelicalMap() {
  const iowaPath = statePaths.find((s) => s.code === "IA")!;

  return (
    <div>
      <svg
        viewBox={US_MAP_VIEWBOX}
        role="img"
        aria-label={MAP_LABEL}
        className="w-full max-w-full h-auto"
      >
        <g stroke="#ffffff" strokeWidth={0.75} strokeLinejoin="round">
          {statePaths
            .filter((s) => s.code !== "IA")
            .map((s) => (
              <path key={s.code} d={s.d} fill={fillFor(rateByCode.get(s.code)!)} />
            ))}
          {/* DC's polygon is sub-pixel at this scale; the source map pairs it
              with a marker circle. DC is shaded with the states: its rate is
              a real, comparable 15.2% and it is inside every national total
              on this page. Only its RANK is undefined (it is not a state),
              and the sr-only table says so rather than the map dropping it. */}
          <circle
            cx={DC_MARKER.cx}
            cy={DC_MARKER.cy}
            r={DC_MARKER.r}
            fill={fillFor(rateByCode.get("DC")!)}
          />
        </g>
        {/* Divider around the Alaska and Hawaii insets. */}
        <path d={AK_HI_SEPARATOR} fill="none" stroke="#d1d5db" strokeWidth={1.5} />
        {/* Iowa drawn last so it sits above its neighbours. It is filled
            amber rather than outlined — an outline is a second encoding
            competing with the ramp, and the fill plus the figure inside it
            says "this is us, and this is our number" without one. Iowa
            therefore does not show its band colour; the printed percentage
            carries that information directly. The thin navy edge keeps it
            legible against the pale fills of its low-rate neighbours. */}
        <path
          d={iowaPath.d}
          fill="#fbac33"
          stroke="#10294c"
          strokeWidth={1.25}
          strokeLinejoin="round"
        />
        <text
          x={IOWA_CALLOUT.x}
          y={IOWA_CALLOUT.y}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-brand-navy font-bold [font-size:30px] sm:[font-size:26px]"
        >
          {iowaRate}%
        </text>
      </svg>

      {/* Legend; the aria-label and sr-only table carry this for AT. */}
      <div aria-hidden="true" className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {CLASSES.map((c) => (
          <span key={c.label} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span
              className="inline-block h-3 w-3 rounded-[2px]"
              style={{ backgroundColor: c.fill }}
            />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}
