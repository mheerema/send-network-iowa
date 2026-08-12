import adherence from "@/data/state-adherence-2020.json";
import {
  statePaths,
  US_MAP_VIEWBOX,
  DC_MARKER,
  AK_HI_SEPARATOR,
} from "@/data/us-states-paths";

/**
 * Pew-style US choropleth of religious adherence by state.
 * Static server component: inline SVG, no client JS, no chart library.
 * Responsive via viewBox + max-width; AK/HI insets come from the basemap.
 *
 * Accessibility: the SVG is a single labeled image (role="img"); the
 * state-by-state data lives in the sr-only table on /iowa, which covers
 * all 50 states plus DC.
 */

/**
 * Sequential single-hue ramp derived from brand-navy #10294c.
 * Five classes on round breaks; data range is 27.2–76.1.
 * A rate equal to a break goes in the higher class (e.g. 45.0 → "45–55%").
 */
const CLASSES = [
  { below: 35, label: "Under 35%", fill: "#e2e8f2" },
  { below: 45, label: "35–45%", fill: "#b9c6dd" },
  { below: 55, label: "45–55%", fill: "#7e93b7" },
  { below: 65, label: "55–65%", fill: "#46608c" },
  { below: Infinity, label: "65% or more", fill: "#10294c" },
] as const;

function fillFor(rate: number): string {
  return CLASSES.find((c) => rate < c.below)!.fill;
}

/** code → adherence rate, derived from the census payload (never hand-listed). */
const rateByCode = new Map<string, number>(
  Object.values(adherence.states).map((s) => [s.code, s.adherenceRate])
);

const stateEntries = Object.entries(adherence.states).map(
  ([name, s]) => ({ name, rate: s.adherenceRate })
);
const lowest = stateEntries.reduce((a, b) => (b.rate < a.rate ? b : a));
const highest = stateEntries.reduce((a, b) => (b.rate > a.rate ? b : a));
const iowaRate = adherence.states.Iowa.adherenceRate;
const usRate = adherence.usTotal.adherenceRate;

const MAP_LABEL =
  `Map of the United States shading each state by the share of its ` +
  `population connected to a congregation in the 2020 U.S. Religion Census. ` +
  `Iowa is at ${iowaRate} percent, below the national rate of ${usRate} percent. ` +
  `Rates range from ${lowest.rate} percent in ${lowest.name} to ` +
  `${highest.rate} percent in ${highest.name}.`;

/** Iowa's bounding box in the basemap is x 471–576, y 180–250. */
const IOWA_CALLOUT = { x: 523, y: 172 };

export default function UsAdherenceMap() {
  const iowa = statePaths.find((s) => s.code === "IA")!;

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
          {/* DC's polygon is sub-pixel at this scale; the source map pairs it with a marker circle. */}
          <circle
            cx={DC_MARKER.cx}
            cy={DC_MARKER.cy}
            r={DC_MARKER.r}
            fill={fillFor(rateByCode.get("DC")!)}
          />
        </g>
        {/* Divider around the Alaska and Hawaii insets. */}
        <path d={AK_HI_SEPARATOR} fill="none" stroke="#d1d5db" strokeWidth={1.5} />
        {/* Iowa last so its highlight stroke sits above its neighbors. */}
        <path
          d={iowa.d}
          fill={fillFor(iowaRate)}
          stroke="#fbac33"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <text
          x={IOWA_CALLOUT.x}
          y={IOWA_CALLOUT.y}
          textAnchor="middle"
          className="fill-brand-navy font-bold [font-size:28px] sm:[font-size:19px]"
          style={{ paintOrder: "stroke", stroke: "#ffffff", strokeWidth: 5, strokeLinejoin: "round" }}
        >
          Iowa {iowaRate}%
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
