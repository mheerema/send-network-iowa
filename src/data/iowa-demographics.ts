/**
 * Single source of truth for Iowa demographic and religious statistics
 * used on /iowa, the homepage need section, and anywhere else stats appear.
 * Do not duplicate these figures as literals in JSX — import from here.
 */

export const source =
  "NAMB Demographics Report for Send Network Iowa, Aug 2026. Demographic data: Esri 2026 estimates. Religious data: 2020 U.S. Religion Census (ARDA, corrected June 2023); tradition classification per ARDA (RELTRAD).";

/**
 * 477 evangelical congregations reported congregation counts but no adherent
 * figures to the 2020 U.S. Religion Census, so evangelical adherent totals
 * are understated.
 */
export const evangelicalAdherentsNote =
  "The evangelical figure is understated: 477 evangelical congregations report congregation counts but no adherent figures.";

export interface Generation {
  name: string;
  population: number;
}

export interface EducationLevel {
  label: string;
  pct: number;
}

export interface ReligiousBody {
  name: string;
  adherents: number;
}

export interface TapestrySegment {
  name: string;
  pct: number;
}

export interface Tradition {
  name: string;
  adherents: number;
  /** Percent of the 2020 census population (religionCensusPopulation2020). */
  pctOfPopulation: number;
  congregations?: number;
}

export const population = {
  population2026: 3_274_155,
  projected2031: 3_332_661,
  projectedGrowth: 58_506,
  medianAge: 39.4,
  households: 1_332_722,
  avgHouseholdSize: 2.38,
  medianHouseholdIncome: 78_969,
  children: 718_842,
  householdsBelowPoverty: 148_396,
  householdsOnSNAP: 116_375,
  whiteAlonePct: 82.47,
  hispanicOriginPct: 7.78,
  spanishAtHomeAdults: 99_334,
} as const;

export const generations: Generation[] = [
  { name: "Gen Alpha", population: 387_422 },
  { name: "Gen Z", population: 785_321 },
  { name: "Millennial", population: 739_837 },
  { name: "Gen X", population: 588_592 },
  { name: "Boomer", population: 632_834 },
  { name: "Silent+", population: 140_149 },
];

export const education: EducationLevel[] = [
  { label: "No high school diploma", pct: 7 },
  { label: "High school graduate", pct: 29 },
  { label: "Some college", pct: 32 },
  { label: "Bachelor's degree or higher", pct: 33 },
];

export const spiritual = {
  /**
   * Denominator for religion-census percentages: 2020 census population.
   * Distinct from population.population2026 (Esri estimate), which is the
   * denominator for demographic stats only.
   */
  religionCensusPopulation2020: 3_190_369,
  nones: 1_759_020,
  nonesPct: 55,
  nonesPctPrecise: 55.1,
  adherents: 1_431_349,
  adherentsPct: 45,
  adherentsPctPrecise: 44.9,
  congregations: 4_827,
  sbcAdherents: 16_129,
  sbcPctLabel: "0.5%",
  memberOfPlaceOfWorship: 473_502,
  memberOfPlaceOfWorshipPct: 14,
  attendSurvey: {
    disagreeTotal: 1_593_048,
    disagreeCompletely: 1_135_502,
    disagreeSomewhat: 457_546,
    agreeTotal: 959_902,
    agreeSomewhat: 378_170,
    agreeCompletely: 581_732,
  },
} as const;

/** Adherents by religious tradition, classified per ARDA (RELTRAD). */
export const traditions: Tradition[] = [
  { name: "Evangelical Protestant", adherents: 352_568, pctOfPopulation: 11.05, congregations: 2_153 },
  { name: "Mainline Protestant", adherents: 501_643, pctOfPopulation: 15.72, congregations: 1_927 },
  { name: "Catholic", adherents: 470_487, pctOfPopulation: 14.75, congregations: 416 },
  { name: "Black Protestant", adherents: 23_713, pctOfPopulation: 0.74 },
  { name: "Orthodox", adherents: 3_216, pctOfPopulation: 0.1 },
  { name: "Other", adherents: 79_722, pctOfPopulation: 2.5 },
];

/** ARDA corrected vintage (June 2023 corrections to the 2020 U.S. Religion Census). */
export const largestBodies: ReligiousBody[] = [
  { name: "Catholic", adherents: 470_487 },
  { name: "ELCA", adherents: 185_217 },
  { name: "United Methodist", adherents: 173_750 },
  { name: "LCMS", adherents: 89_917 },
  { name: "Non-denominational", adherents: 85_426 },
];

/**
 * Convenience figures derived from `traditions` (Evangelical Protestant row).
 * evangelicalCongregations excludes nothing: it is ARDA's congregation count,
 * which includes the 477 congregations that report no adherent figures.
 */
export const evangelicalCongregations = 2_153;
/**
 * The headline need framing: Iowans NOT connected to an evangelical
 * congregation = religionCensusPopulation2020 - evangelical adherents
 * (3,190,369 - 352,568). Slightly overstated by the same 477-congregation
 * reporting gap that understates evangelical adherents (see note above).
 */
export const notEvangelical = 2_837_801;
export const notEvangelicalPctLabel = "89%";
export const evangelicalPctLabel = "11%";

/*
 * The state-level comparison — national rate, neighboring states, and the
 * choropleth itself — moved to `@/components/UsEvangelicalMap`, which derives
 * all of it from `state-evangelical-2020.json`. The old general-adherence
 * payload it used to read (`state-adherence-2020.json`) went with it: no
 * general per-state adherence figure appears on the site any more.
 */

/** Pew Research Religious Landscape Study (2023-24): Iowans self-identifying as religiously unaffiliated. */
export const pewSelfIdentifiedNones = 31;

export const comparisonSource =
  "State comparisons: 2020 U.S. Religion Census; Pew Research Religious Landscape Study.";

export const tapestrySegments: TapestrySegment[] = [
  { name: "Country Charm", pct: 14.4 },
  { name: "Heartland Communities", pct: 11.2 },
  { name: "Middle Ground", pct: 11.2 },
];

const numberFormat = new Intl.NumberFormat("en-US");

export function formatNumber(n: number): string {
  return numberFormat.format(n);
}

/** e.g. 3,274,155 → "3.27M" for compact stat displays */
export function formatMillions(n: number): string {
  return `${(n / 1_000_000).toFixed(2)}M`;
}
