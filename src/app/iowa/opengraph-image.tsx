import { ImageResponse } from "next/og";
import { countyStats } from "@/components/IowaCountyMap";
import {
  formatMillions,
  formatNumber,
  notEvangelical,
  notEvangelicalPctLabel,
} from "@/data/iowa-demographics";
import { statePaths } from "@/data/us-states-paths";
import { BRAND_AMBER, BRAND_NAVY, OG_SIZE, loadLogoSrc } from "@/lib/og";

/**
 * The share card for /iowa. Not the site card — this one carries the
 * argument, so a posted link makes the case before anyone clicks.
 *
 * EVERY FIGURE IS IMPORTED. Nothing here is typed in: the headline share, the
 * population it stands for, the statewide ratio, and the shortfall all come
 * from the same modules /iowa renders from, so the card cannot drift from the
 * page. If a payload changes, this image changes with it.
 *
 * WHAT IS DELIBERATELY MISSING. The national comparison, the county map, and
 * the tradition breakdown are all on the page and none of them are here. A
 * share card is read at ~500px in a feed and ~120px in some previews; one
 * dominant number plus three supports is the most that survives the small
 * sizes, and the supports are already gone by 120px.
 *
 * Satori constraints: no CSS variables (brand hex comes from @/lib/og), flex
 * only, every text node in its own element, no fetches beyond the local
 * wordmark read.
 */

// ─── Figures ─────────────────────────────────────────────────────
const notConnectedShare = notEvangelicalPctLabel;
const notConnectedMillions = formatMillions(notEvangelical);
const notConnectedExact = formatNumber(notEvangelical);
const peoplePerCongregation = formatNumber(countyStats.statewide);
const churchesNeeded = formatNumber(countyStats.shortfall.total);
const saturationGoal = formatNumber(countyStats.shortfall.goal);

/** The three supports, in the order they read. Values before labels. */
const SUPPORTS = [
  { value: notConnectedMillions, label: "people not connected" },
  { value: peoplePerCongregation, label: "Iowans per evangelical congregation" },
  {
    value: churchesNeeded,
    label: `more churches to reach one per ${saturationGoal} people`,
  },
];

/**
 * Short-form attribution. The full citation lives in `source` in
 * @/data/iowa-demographics and on the page; a card has room for the vintage
 * and the name, nothing more.
 */
const SOURCE_LINE = "2020 U.S. Religion Census";

// ─── Image metadata ──────────────────────────────────────────────
/**
 * Built from the same constants as the artwork, so a client that reads the
 * alt text out loud gets the identical argument rather than a stale copy.
 */
export const alt =
  `${notConnectedShare} of Iowans — ${notConnectedExact} people — are not connected ` +
  `to an evangelical church. Iowa has one evangelical congregation for every ` +
  `${peoplePerCongregation} people and is short ${churchesNeeded} churches of one per ` +
  `${saturationGoal}. Source: the ${SOURCE_LINE}. Send Network Iowa.`;

export const size = OG_SIZE;
export const contentType = "image/png";

// ─── Iowa silhouette ─────────────────────────────────────────────
/**
 * Iowa's outline from the national basemap — the same shape the state takes
 * on /iowa's US map, so the card reads as Iowa at a glance in a feed. Cropped
 * to Iowa's own bounding box in the 959x593 national coordinate space
 * (x 471.2–575.7, y 180.4–249.7), padded a little so the border does not
 * clip. Missing/renamed path degrades to no silhouette, never a broken build.
 */
const IOWA_VIEWBOX = "470 179.4 107 71.3";
const IOWA_ASPECT = 107 / 71.3;
const iowaPath = statePaths.find((s) => s.code === "IA")?.d ?? null;

// ─── Image generation ────────────────────────────────────────────
export default async function Image() {
  const logoSrc = await loadLogoSrc();
  const iowaWidth = 246;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BRAND_NAVY,
          padding: "56px 72px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Amber Iowa, whole and contained in the right margin the headline
            leaves empty. Solid rather than a low-opacity wash — amber at 28%
            over navy goes olive and reads as a smudge, not a state. Kept
            subordinate by SIZE instead, at a fraction of the 89%. If it ever
            fights the numbers, delete this block: legibility beats
            recognition. */}
        {iowaPath ? (
          <div
            style={{
              position: "absolute",
              top: 142,
              right: 84,
              display: "flex",
            }}
          >
            <svg
              width={iowaWidth}
              height={Math.round(iowaWidth / IOWA_ASPECT)}
              viewBox={IOWA_VIEWBOX}
            >
              <path d={iowaPath} fill={BRAND_AMBER} />
            </svg>
          </div>
        ) : null}

        {logoSrc ? (
          <img src={logoSrc} alt="Send Network Iowa" width={260} />
        ) : (
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            Send Network Iowa
          </div>
        )}

        {/* The one thing that has to survive a thumbnail. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 164,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -8,
              color: BRAND_AMBER,
            }}
          >
            {notConnectedShare}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 38,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: -0.5,
              /* Narrow enough to force the break after "connected" — the
                 alternative wraps on "to an", which is a weak line ending. */
              maxWidth: 500,
            }}
          >
            of Iowans are not connected to an evangelical church
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 3,
              marginBottom: 26,
              background: "rgba(255,255,255,0.22)",
            }}
          />
          <div style={{ display: "flex", width: "100%" }}>
            {SUPPORTS.map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "33.33%",
                  paddingRight: 28,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 46,
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: -1.5,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: 10,
                    fontSize: 21,
                    fontWeight: 500,
                    lineHeight: 1.25,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 19,
              fontWeight: 500,
              letterSpacing: 0.4,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {SOURCE_LINE}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
