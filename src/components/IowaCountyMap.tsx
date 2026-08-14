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

/** Top of the even gradient; everything above falls in the palest class. */
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
 * `anchor` is the short name shown on the chip; the map's caption spells it
 * out in full. Only the GACX boundary carries one — annotating more chips does
 * not stay legible at 375px across seven of them.
 */
const BREAKS = [
  { below: 500, anchor: null, fill: "#10294c" },
  {
    below: GACX_SATURATION_GOAL,
    anchor: "meets GACX goal",
    fill: "#344e77",
  },
  { below: 1500, anchor: null, fill: "#59719a" },
  { below: 2000, anchor: null, fill: "#7e93b7" },
  { below: 2500, anchor: null, fill: "#a5b5d0" },
  { below: LONG_TAIL_BREAK, anchor: null, fill: "#c7d1e4" },
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
 * Ordering guard. The bands are an even 500-person gradient, but the GACX goal
 * among them is a named constant, so a future edit could still push the list
 * out of order. `fillFor` takes the first match, so a non-ascending break list
 * silently produces an empty class and a mislabeled ramp rather than an error.
 */
const outOfOrder = CLASSES.findIndex(
  (c, i) => i > 0 && CLASSES[i - 1].below >= c.below
);
if (outOfOrder > -1) {
  throw new Error(
    `Iowa county class breaks are not ascending: ` +
      `${CLASSES.map((c) => c.below).join(", ")}. The bands run in even ` +
      `500-person steps with GACX's goal (${GACX_SATURATION_GOAL}) on a ` +
      `boundary — re-order the ramp rather than hardcoding the old order.`
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
  /**
   * Congregations this county would have to gain to reach GACX's stated goal
   * of one per 1,000 residents. Clamped at zero: a county already past the
   * goal needs none, and its surplus is NOT allowed to offset a neighbour's
   * shortfall, because a church in one county does not serve another. That
   * clamp is the whole difference between the county-aware statewide total
   * and the smaller figure you get by dividing Iowa's population by 1,000.
   */
  churchesNeeded: number;
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
    churchesNeeded: Math.max(
      0,
      Math.ceil(c.population / GACX_SATURATION_GOAL) -
        c.evangelicalCongregations
    ),
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

/**
 * THE SHORTFALL, AND WHY IT IS MARKED ON ONLY TEN COUNTIES.
 *
 * 58 of the 99 counties fall short of GACX's stated goal. Ringing all 58 —
 * or checking the 41 that meet it — marks so much of the map that the marks
 * stop carrying information; the choropleth already says which counties are
 * short, in seven bands. What the choropleth CANNOT say is where the missing
 * churches actually are, because a ratio is per-capita and the need is not:
 * Polk is one county out of 58 and carries 263 of the 1,243 congregations
 * needed. Ten markers put the concentration on the map. The count is a
 * design constant, not a natural break in the data — say so rather than
 * implying the 10th county is meaningfully different from the 11th.
 */
const MARKED_COUNTY_COUNT = 10;

const shortCounties = countyRows.filter((r) => r.churchesNeeded > 0);
const shortfallTotal = shortCounties.reduce((s, r) => s + r.churchesNeeded, 0);

/**
 * THE ONE NEED ORDER. The map's markers and the page's county table both rank
 * by shortfall, so they share this comparator rather than each writing their
 * own — two sorts that agree today and drift later is exactly the bug that
 * would put Dubuque above Dallas in one place and below it in the other.
 *
 * Population descending is the tie-break: 11 shortfall values are shared by
 * two or more counties, and among counties needing the same number the larger
 * one is the larger opportunity, which is the question the table is being read
 * to answer. Name is the last key so the order is TOTAL — two counties with
 * equal need and equal population would otherwise sit in payload order, which
 * is not a promise the payload makes.
 */
const byNeed = (a: CountyRow, b: CountyRow) =>
  b.churchesNeeded - a.churchesNeeded ||
  b.population - a.population ||
  a.name.localeCompare(b.name);

const rankedShortCounties = [...shortCounties].sort(byNeed);

const topShortCounties = rankedShortCounties.slice(0, MARKED_COUNTY_COUNT);
const topShortfallTotal = topShortCounties.reduce(
  (s, r) => s + r.churchesNeeded,
  0
);

/**
 * Cutoff guard. "Top ten" is only an honest phrase while the 10th county is
 * strictly ahead of the 11th. On a tie the slice picks a winner alphabetically
 * and the map silently asserts a distinction the data does not support, so
 * fail the build and make someone choose a different count.
 */
const nextShortCounty = rankedShortCounties[MARKED_COUNTY_COUNT];
if (
  nextShortCounty &&
  nextShortCounty.churchesNeeded ===
    topShortCounties[topShortCounties.length - 1].churchesNeeded
) {
  throw new Error(
    `Iowa county markers: a tie at the ${MARKED_COUNTY_COUNT}-county cutoff. ` +
      `${topShortCounties[topShortCounties.length - 1].name} and ` +
      `${nextShortCounty.name} both need ${nextShortCounty.churchesNeeded} ` +
      `congregations, so "the ${MARKED_COUNTY_COUNT} counties that need the ` +
      `most" would exclude one of them arbitrarily. Change ` +
      `MARKED_COUNTY_COUNT rather than letting the sort break the tie.`
  );
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
   * The shortfall, counted county by county. `total` is the sum of every
   * county's own gap, which is NOT the same number as dividing Iowa's
   * population by the goal and subtracting its congregations —
   * `statewideDivision` below is that smaller figure, kept so the page can
   * name the difference instead of leaving two defensible totals in the wild.
   */
  shortfall: {
    goal: GACX_SATURATION_GOAL,
    countyCount: shortCounties.length,
    total: shortfallTotal,
    /** The naive alternative, for the note that distinguishes the two. */
    statewideDivision: Math.max(
      0,
      Math.ceil(statewidePopulation / GACX_SATURATION_GOAL) -
        statewideCongregations
    ),
    /**
     * Every county that falls short, in need order — the page's county table
     * renders this list whole. `top` is its first `MARKED_COUNTY_COUNT` rows,
     * so the map's markers and the table's opening rows are the same counties
     * in the same order by construction, not by coincidence.
     */
    ranked: rankedShortCounties,
    top: topShortCounties,
    topCount: MARKED_COUNTY_COUNT,
    topTotal: topShortfallTotal,
    topPctOfTotal: Math.round((topShortfallTotal / shortfallTotal) * 100),
  },
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

/* ---------------------------------------------------------------------------
 * MARKER GEOMETRY
 *
 * Centroids come from the basemap paths themselves, so a regenerated basemap
 * moves the markers with the shapes. Nothing here is a typed-in coordinate.
 * ------------------------------------------------------------------------ */

/**
 * The basemap is a GENERATED file of straight-line polygons — `M`, `L`, `Z`
 * only, one subpath per county, verified at the time this was written. The
 * shoelace centroid below is exact for that shape and silently wrong for
 * anything else, so refuse to guess if the generator ever emits curves or a
 * second ring (islands, a county split by a river). A bbox centre would be
 * the fallback; it is not the default, because a bbox centre drifts on the
 * counties with a Mississippi boundary — Dubuque's is 11 units east of its
 * true centroid, which is a fifth of a county width.
 */
function polygonPoints(d: string): Array<[number, number]> {
  if (/[^MLZ\d.,\-\s]/.test(d)) {
    throw new Error(
      `Iowa basemap path contains a command this centroid math does not ` +
        `handle (expected only M, L and Z): ${d.slice(0, 60)}…`
    );
  }
  if ((d.match(/M/g) ?? []).length !== 1) {
    throw new Error(
      `Iowa basemap path has more than one subpath, so a single-ring ` +
        `shoelace centroid is not valid for it: ${d.slice(0, 60)}…`
    );
  }
  return d
    .replace(/[MLZ]/g, " ")
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(",").map(Number);
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        throw new Error(`Iowa basemap path has a bad coordinate: "${pair}"`);
      }
      return [x, y] as [number, number];
    });
}

/** Area-weighted (shoelace) polygon centroid. */
function centroidOf(d: string): { cx: number; cy: number } {
  const pts = polygonPoints(d);
  let twiceArea = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % pts.length];
    const cross = x0 * y1 - x1 * y0;
    twiceArea += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  const area = twiceArea / 2;
  if (area === 0) throw new Error("Iowa basemap path encloses no area.");
  return { cx: cx / (6 * area), cy: cy / (6 * area) };
}

/** Ray-casting containment test, for the guard below. */
function contains(d: string, x: number, y: number): boolean {
  const pts = polygonPoints(d);
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Proportional symbols: radius ∝ √value, so the AREA of the circle is
 * proportional to the churches needed. Sizing by radius instead would make
 * Polk look 6.7× Pottawattamie rather than 2.6×, which is the classic
 * over-statement in a bubble map.
 */
const MARKER_RADIUS_SCALE = 1;

const VIEWBOX_WIDTH = Number(IOWA_MAP_VIEWBOX.split(" ")[2]);

/**
 * The map sits in a `max-w-3xl` column, so 768px is the widest it ever
 * renders. Used only to check the smallest marker against an 8px minimum
 * diameter — if the container class changes, this constant has to follow.
 */
const DESKTOP_MAP_WIDTH_PX = 768;
const MIN_MARKER_DIAMETER_PX = 8;

/* ---------------------------------------------------------------------------
 * CITY LABELS
 *
 * WHY THE MARKERS CARRY THE CITY NAMES AND NOTHING ELSE DOES. Iowa's 99
 * counties are an undifferentiated grid to almost every reader — there is
 * nothing on a county map to locate yourself by. The obvious fix, a second
 * set of dots for the major cities, is the wrong one twice over: it competes
 * with the shortfall encoding for the eye, and it invites the reader to think
 * the two symbol sets mark different places when they mark the SAME ones.
 * The ten counties that need the most churches ARE the ten metros, because
 * the need is an absolute count and the count follows population. So the
 * existing markers get labelled instead. One symbol set, two jobs: the reader
 * orients, and the concentration of the shortfall in the population centres —
 * the argument this whole section is making — becomes readable off the map.
 * ------------------------------------------------------------------------ */

/**
 * Where a label sits relative to its marker. Hand-set per city below; ten
 * labels on a fixed basemap is not a layout-engine problem, and a solver
 * would produce placements nobody can predict from the source. `dx`/`dy`
 * nudge in viewBox units for the one or two labels that would otherwise sit
 * against the map's edge.
 */
type LabelPlacement = {
  side: "left" | "right" | "above" | "below";
  dx?: number;
  dy?: number;
};

/**
 * PRINCIPAL CITIES, NOT COUNTY SEATS.
 *
 * Each entry names the population centre a reader actually orients by, which
 * is frequently not the seat: Dallas County's seat is Adel (about 6,000
 * people) and nobody navigates by it — the county's population centre is the
 * Waukee / West Des Moines edge of the Des Moines metro. The label says
 * Waukee because Waukee lies wholly inside Dallas County while West Des
 * Moines straddles the Polk line, so labelling this marker "West Des Moines"
 * would print a city name over a county it is only half in, two centimetres
 * from the Des Moines label. Story County's seat is Nevada; the city is Ames.
 * Pottawattamie's seat is Council Bluffs and Black Hawk's is Waterloo, so
 * some of these agree with the seat — that is a coincidence, not the rule.
 *
 * KEYED BY FIPS, NOT BY NAME, and not because of the join convention alone:
 * "Des Moines" is also the name of an Iowa COUNTY, in the south-east corner,
 * whose seat is Burlington. A name-keyed table here would be one plausible
 * typo away from printing "Des Moines" on the wrong side of the state.
 *
 * `mobile` present means the label survives below the `md` breakpoint — see
 * the mobile-subset comment on `mobileCityLabels`.
 */
const PRINCIPAL_CITIES: Record<
  string,
  {
    /** County name as the census payload spells it, for the guard below. */
    county: string;
    city: string;
    desktop: LabelPlacement;
    mobile?: LabelPlacement;
  }
> = {
  "19153": {
    county: "Polk",
    city: "Des Moines",
    desktop: { side: "right" },
    mobile: { side: "right" },
  },
  "19113": {
    county: "Linn",
    city: "Cedar Rapids",
    // Above, not below: Johnson sits directly underneath at the same x.
    desktop: { side: "above" },
    mobile: { side: "above" },
  },
  "19163": {
    county: "Scott",
    city: "Davenport",
    // Left, because "Davenport" set to the right of the state's south-east
    // corner runs past the viewBox. On mobile the type is twice the size and
    // a left label reaches back over Johnson's marker, so it goes below,
    // nudged west to keep its right edge clear of the map's own edge.
    desktop: { side: "left" },
    mobile: { side: "below", dx: -40 },
  },
  "19103": {
    county: "Johnson",
    city: "Iowa City",
    desktop: { side: "below" },
  },
  "19061": { county: "Dubuque", city: "Dubuque", desktop: { side: "right" } },
  "19049": {
    county: "Dallas",
    city: "Waukee",
    // Left, so the Dallas and Polk labels flank the pair rather than one of
    // them landing in the 41 units of clear space between the two markers.
    desktop: { side: "left" },
  },
  "19013": { county: "Black Hawk", city: "Waterloo", desktop: { side: "above" } },
  "19169": { county: "Story", city: "Ames", desktop: { side: "right" } },
  "19193": {
    county: "Woodbury",
    city: "Sioux City",
    desktop: { side: "right" },
    mobile: { side: "right" },
  },
  "19155": {
    county: "Pottawattamie",
    city: "Council Bluffs",
    desktop: { side: "right" },
  },
};

/**
 * Coverage guard. The marked set is DERIVED — it is whichever ten counties
 * need the most churches today — so a census revision can change it without
 * anyone touching this file. Unlabelled markers would ship silently and the
 * map would go back to being an unreadable grid for the reader it was
 * labelled for, so make it a build failure and name the county that needs a
 * city and a hand-placed offset.
 */
const unlabelled = topShortCounties.filter((r) => !PRINCIPAL_CITIES[r.fips]);
if (unlabelled.length) {
  throw new Error(
    `Iowa county markers have no principal city: ` +
      `${unlabelled.map((r) => `${r.name} (${r.fips})`).join(", ")}. The ` +
      `marked counties are derived from the shortfall, so the top ` +
      `${MARKED_COUNTY_COUNT} changed. Add each one to PRINCIPAL_CITIES with ` +
      `a hand-placed side, then re-check the placements in a browser — ` +
      `label collision cannot be asserted here, because it depends on text ` +
      `metrics this process has no font to measure. Do not fall back to an ` +
      `unlabelled marker.`
  );
}

/**
 * Key guard. A wrong FIPS in the table above would label the right marker
 * with the wrong city and nothing downstream would notice, so assert that
 * every key still points at the county the entry claims.
 */
const misKeyedCities = Object.entries(PRINCIPAL_CITIES).filter(
  ([fips, entry]) => byFips.get(fips)?.name !== entry.county
);
if (misKeyedCities.length) {
  throw new Error(
    `PRINCIPAL_CITIES keys do not match the county they name: ` +
      `${misKeyedCities
        .map(([fips, e]) => `${fips} is ${byFips.get(fips)?.name ?? "no county"}, not ${e.county}`)
        .join("; ")}.`
  );
}

export const countyMarkers = topShortCounties
  .map((row) => {
    const path = countyPaths.find((p) => p.fips === row.fips)!;
    const { cx, cy } = centroidOf(path.d);
    return {
      fips: row.fips,
      name: row.name,
      city: PRINCIPAL_CITIES[row.fips].city,
      churchesNeeded: row.churchesNeeded,
      cx,
      cy,
      r: MARKER_RADIUS_SCALE * Math.sqrt(row.churchesNeeded),
      d: path.d,
    };
  })
  // Largest first so a small marker can never be buried under a large one.
  .sort((a, b) => b.r - a.r);

/** The city the map prints on a marked county. Throws for anything else. */
export function principalCity(fips: string): string {
  const entry = PRINCIPAL_CITIES[fips];
  if (!entry) throw new Error(`No principal city for FIPS "${fips}"`);
  return entry.city;
}

/**
 * "Polk (Des Moines)" — for the prose and the table cells that have to carry
 * both. Two deliberate silences: an UNMARKED county returns its name alone,
 * because the sr-only table runs every county in the state and only the
 * marked ten are labelled on the map; and Dubuque's city is Dubuque, where
 * "Dubuque (Dubuque)" reads as a typo, so the parenthetical drops when the
 * two match.
 */
export function countyWithCity(row: { fips: string; name: string }): string {
  const city = PRINCIPAL_CITIES[row.fips]?.city;
  return !city || city === row.name ? row.name : `${row.name} (${city})`;
}

/**
 * Placement guard. A centroid outside its own county means the marker is
 * making a claim about the wrong place — the single failure this whole
 * feature cannot survive. Concave counties can legitimately have an exterior
 * centroid; Iowa's are near-rectangular and none of them do, so assert it
 * rather than assuming.
 */
const misplaced = countyMarkers.filter((m) => !contains(m.d, m.cx, m.cy));
if (misplaced.length) {
  throw new Error(
    `Iowa county markers fall outside the county they mark: ` +
      `${misplaced.map((m) => `${m.name} (${m.cx.toFixed(1)}, ${m.cy.toFixed(1)})`).join(", ")}. ` +
      `Use a point-on-surface fallback for those shapes.`
  );
}

/** Legibility guard: the smallest marker has to survive the smallest ramp step. */
const smallestDiameterPx =
  Math.min(...countyMarkers.map((m) => m.r)) *
  2 *
  (DESKTOP_MAP_WIDTH_PX / VIEWBOX_WIDTH);
if (smallestDiameterPx < MIN_MARKER_DIAMETER_PX) {
  throw new Error(
    `The smallest Iowa county marker renders at ` +
      `${smallestDiameterPx.toFixed(1)}px across at ${DESKTOP_MAP_WIDTH_PX}px ` +
      `wide, under the ${MIN_MARKER_DIAMETER_PX}px floor. Raise ` +
      `MARKER_RADIUS_SCALE or drop MARKED_COUNTY_COUNT — do not add a radius ` +
      `floor, which would break the proportional encoding.`
  );
}

/**
 * Collision guard. The markers are drawn as a bare amber disc with a navy
 * ring; that reads cleanly only while no two of them touch. Today the closest
 * pair (Polk and Dallas) clears by more than 40 units, so the surface-coloured
 * separator ring is deliberately NOT paid for. If a data revision ever closes
 * that gap, the fix is a third, white stroke outside the navy one — not a
 * smaller MARKER_RADIUS_SCALE, which would quietly rescale the encoding.
 */
const collisions = countyMarkers.flatMap((a, i) =>
  countyMarkers.slice(i + 1).flatMap((b) => {
    const gap = Math.hypot(a.cx - b.cx, a.cy - b.cy) - a.r - b.r;
    return gap < 2 ? [`${a.name}/${b.name} (${gap.toFixed(1)} units)`] : [];
  })
);
if (collisions.length) {
  throw new Error(
    `Iowa county markers overlap: ${collisions.join(", ")}. Add a 2-unit ` +
      `white separator ring outside the navy one; do not shrink the markers.`
  );
}

/**
 * Label anchors, derived from the marker the label belongs to so a data
 * revision that resizes a marker moves its label with it. The gap is the
 * clear space between the marker's edge and the text, in viewBox units; it is
 * larger for the mobile set because that set is set at roughly twice the type
 * size and a 5-unit gap under 27-unit type reads as a collision.
 *
 * `dominantBaseline` rather than a computed y offset: the type size changes
 * with the breakpoint (see the label groups in the markup) while these
 * coordinates do not, so the vertical anchor has to be one the renderer
 * resolves against the current font size, not a number baked in at build time.
 */
function labelAnchor(
  m: { cx: number; cy: number; r: number },
  place: LabelPlacement,
  gap: number
) {
  const dx = place.dx ?? 0;
  const dy = place.dy ?? 0;
  switch (place.side) {
    case "right":
      return {
        x: m.cx + m.r + gap + dx,
        y: m.cy + dy,
        textAnchor: "start" as const,
        dominantBaseline: "central" as const,
      };
    case "left":
      return {
        x: m.cx - m.r - gap + dx,
        y: m.cy + dy,
        textAnchor: "end" as const,
        dominantBaseline: "central" as const,
      };
    case "above":
      return {
        x: m.cx + dx,
        y: m.cy - m.r - gap + dy,
        textAnchor: "middle" as const,
        dominantBaseline: "auto" as const,
      };
    case "below":
      return {
        x: m.cx + dx,
        y: m.cy + m.r + gap + dy,
        textAnchor: "middle" as const,
        dominantBaseline: "hanging" as const,
      };
  }
}

/**
 * Clear space between the marker's edge and the label's anchor, in viewBox
 * units. Sized against the VERTICAL placements, which are the expensive ones:
 * the anchor for those is a baseline, so the text box reaches about 0.3em
 * past it (Montserrat's descent) and the halo adds 0.11em on top of that,
 * before the marker's own 1-unit ring. At the mobile group's largest step,
 * 27 units, that is 13 units of overshoot — which is why these numbers look
 * generous next to a marker radius and are not. Measured in a browser rather
 * than estimated; see the placement note on the label groups in the markup.
 */
const DESKTOP_LABEL_GAP = 8;
const MOBILE_LABEL_GAP = 14;

export const cityLabels = countyMarkers.map((m) => ({
  fips: m.fips,
  city: m.city,
  ...labelAnchor(m, PRINCIPAL_CITIES[m.fips].desktop, DESKTOP_LABEL_GAP),
}));

/**
 * THE MOBILE SUBSET, AND WHY IT IS FOUR.
 *
 * At 375px the map renders 343px wide, so a viewBox unit is 0.38px and the
 * desktop label size (13 units, about 11px on a full-width map) would come
 * out at 5px. Ten labels do not fit at any size that is legible there — the
 * two eastern clusters alone (Linn/Johnson, Scott/Dubuque) would overlap
 * before the type was readable. The choice is a subset or nothing, and
 * nothing is the worse answer: the whole point of labelling is orientation,
 * and the reader who most needs to find themselves on this map is the one
 * holding a phone. The county drawer below cannot do that job — it is a list
 * of county names, and a list of counties is exactly what the reader cannot
 * place.
 *
 * So: the four largest cities in the state, which is a principled subset
 * rather than a pruned one, and they happen to spread across the map —
 * Sioux City north-west, Des Moines centre, Cedar Rapids east, Davenport
 * south-east. Four points that far apart are enough to triangulate the rest
 * of the grid. The fifth candidate, Iowa City, cannot be placed at mobile
 * type size without touching either Cedar Rapids or Davenport, and a legible
 * four beats a colliding five. All ten return at `md`.
 */
export const mobileCityLabels = countyMarkers.flatMap((m) => {
  const place = PRINCIPAL_CITIES[m.fips].mobile;
  return place
    ? [
        {
          fips: m.fips,
          city: m.city,
          ...labelAnchor(m, place, MOBILE_LABEL_GAP),
        },
      ]
    : [];
});

/**
 * Legend swatch geometry, derived from the markers actually drawn so the two
 * sample circles are in true proportion to each other and to the map. Padded
 * by the stroke width so neither ring is clipped by the viewBox.
 */
const legendSwatch = (() => {
  const pad = 2;
  const small = countyMarkers[countyMarkers.length - 1].r;
  const large = countyMarkers[0].r;
  /** Wide enough that the two navy rings read as separate discs at 18px. */
  const gap = 7;
  return {
    viewBox: `0 0 ${pad + small * 2 + gap + large * 2 + pad} ${pad + large * 2 + pad}`,
    cy: pad + large,
    small: { cx: pad + small, r: small },
    large: { cx: pad + small * 2 + gap + large, r: large },
  };
})();

const MAP_LABEL =
  `Map of Iowa's ${countyStats.countyCount} counties, shaded by how many ` +
  `people there are for each evangelical congregation in the 2020 U.S. ` +
  `Religion Census. Darker counties have the most evangelical churches for ` +
  `their population; the palest counties have the fewest. The seven shading ` +
  `bands run in even steps of 500 people per congregation, from under 500 to ` +
  `${round(LONG_TAIL_BREAK)} or more, with one boundary at ` +
  `${round(GACX_SATURATION_GOAL)}, the saturation goal stated by the Global ` +
  `Alliance for Church Multiplication. For reference, Iowa averages one ` +
  `congregation per ${round(IOWA_AVERAGE)} people and the United States one ` +
  `per ${round(US_AVERAGE)}. ` +
  `${countyStats.meetsSaturationGoal.countyCount} counties are in the ` +
  `darkest band and ${countyStats.belowUsAverage.countyCount} fall below the ` +
  `United States average. ${countyStats.worst.name} County is thinnest at one ` +
  `for every ${round(countyStats.worst.peoplePerCongregation)}; ` +
  `${countyStats.best.name} County is densest at one for every ` +
  `${round(countyStats.best.peoplePerCongregation)}. ` +
  `Amber circles mark the ${countyStats.shortfall.topCount} counties that ` +
  `need the most new churches, drawn larger where more are needed, each ` +
  `labelled on the map with the county's principal city. ` +
  `Statewide, ${countyStats.shortfall.countyCount} counties are short a ` +
  `combined ${round(countyStats.shortfall.total)} evangelical congregations ` +
  `of one per ${round(GACX_SATURATION_GOAL)} people, and the ` +
  `${countyStats.shortfall.topCount} marked counties account for ` +
  `${round(countyStats.shortfall.topTotal)} of them, ` +
  `${countyStats.shortfall.topPctOfTotal} percent. They are ` +
  `${countyStats.shortfall.top
    .map(
      (r) =>
        `${r.name}${
          // Dubuque County's principal city is Dubuque; "Dubuque, home to
          // Dubuque" is noise in a label that is already long.
          principalCity(r.fips) === r.name
            ? ""
            : `, home to ${principalCity(r.fips)}`
        }, needing ${round(r.churchesNeeded)}`
    )
    .join("; ")}. County-by-county figures follow in the table.`;

export default function IowaCountyMap() {
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
        {/* Proportional symbols for the ten counties that need the most new
            churches. Amber disc, navy ring, and the ring is doing real work:
            brand amber is 7:1 against the darkest fill but about 1.5:1
            against the palest, so on a pale county the amber alone would sit
            under the 3:1 floor for non-text contrast (1.4.11). Navy carries
            the edge on every pale fill; on the dark fills the ring vanishes
            and the amber disc carries itself. One ring, not two — see the
            collision guard for why the white separator is not paid for. */}
        <g fill="#fbac33" stroke="#10294c" strokeWidth={2}>
          {countyMarkers.map((m) => (
            <circle key={m.fips} cx={m.cx} cy={m.cy} r={m.r} />
          ))}
        </g>
        {/* City labels — see the CITY LABELS block above for why these ride
            the shortfall markers instead of a second set of city dots.
            Purely visual: the svg is role="img", so its subtree is not
            exposed, and the aria-label and the data table both name the city
            alongside the county.

            THE HALO IS NOT DECORATION. Navy type crosses seven fills here,
            three of which are dark enough to swallow it. `paint-order:
            stroke` draws the white stroke first and the navy fill over it, so
            the halo stays outside the letterforms instead of thinning them.
            Its width is set in `em` so it tracks the responsive type size —
            a fixed unit value that reads as a halo at 13 units closes up the
            counters at 27.

            Both groups hide with `hidden` on the side of the breakpoint they
            do not serve, and neither turns display back ON: `hidden md:block`
            would have to put `display:block` on an SVG <g>, and display
            values other than `none` are only loosely defined for SVG
            containers. Hiding one side and setting nothing on the other never
            asks the question.

            TYPE SIZE IS IN VIEWBOX UNITS, so it scales with the map and has
            to be stepped back down as the map grows. The staircase keeps
            every step between about 10 and 14px: at 375px the map is 343px
            wide and 27 units renders 10.3px; at 640px it is 592px and 16
            units renders 10.5px; from `md` up the map is capped at 768px by
            its max-w-3xl column, so 13 units holds at 10.4–11.1px. */}
        <g
          className="fill-brand-navy font-semibold [font-size:27px] min-[500px]:[font-size:20px] sm:[font-size:16px] md:hidden"
          stroke="#ffffff"
          strokeLinejoin="round"
          style={{ paintOrder: "stroke", strokeWidth: "0.22em" }}
        >
          {mobileCityLabels.map((l) => (
            <text
              key={l.fips}
              x={l.x}
              y={l.y}
              textAnchor={l.textAnchor}
              dominantBaseline={l.dominantBaseline}
            >
              {l.city}
            </text>
          ))}
        </g>
        <g
          className="fill-brand-navy font-semibold [font-size:13px] max-md:hidden"
          stroke="#ffffff"
          strokeLinejoin="round"
          style={{ paintOrder: "stroke", strokeWidth: "0.22em" }}
        >
          {cityLabels.map((l) => (
            <text
              key={l.fips}
              x={l.x}
              y={l.y}
              textAnchor={l.textAnchor}
              dominantBaseline={l.dominantBaseline}
            >
              {l.city}
            </text>
          ))}
        </g>
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

        {/* Second encoding, so it gets its own row rather than a chip in the
            ramp: the circles are a count, the fills are a ratio, and putting
            them in one row would read as an eighth band. The swatch is drawn
            from the real smallest and largest radii, so it cannot drift out
            of proportion with the map. */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
          <svg
            viewBox={legendSwatch.viewBox}
            className="h-[18px] w-auto shrink-0 overflow-visible"
            aria-hidden="true"
          >
            <g fill="#fbac33" stroke="#10294c" strokeWidth={2}>
              <circle
                cx={legendSwatch.small.cx}
                cy={legendSwatch.cy}
                r={legendSwatch.small.r}
              />
              <circle
                cx={legendSwatch.large.cx}
                cy={legendSwatch.cy}
                r={legendSwatch.large.r}
              />
            </g>
          </svg>
          {/* The label clause lives here rather than only in the caption:
              this row is where the circle vocabulary is defined, and a
              reader who sees "Des Moines" printed beside a circle has to be
              told, at the circle, that the circle is still the county. */}
          <span>
            The {countyStats.shortfall.topCount} counties needing the most new
            churches, sized by how many and labelled with their principal city
            — {countyStats.shortfall.top[0].name} (
            {principalCity(countyStats.shortfall.top[0].fips)}) needs{" "}
            {round(countyStats.shortfall.top[0].churchesNeeded)}
          </span>
        </div>
      </div>
    </div>
  );
}
