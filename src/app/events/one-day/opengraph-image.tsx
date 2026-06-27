import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// ─── Image metadata ──────────────────────────────────────────────
export const alt =
  "One Day — The Work of the Pastor. A free full-day gathering for pastors, church leaders, and church planters. August 28, 2026 in Ankeny, Iowa, featuring Tony Merida and Brian Croft.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Brand signature gradient: amber → teal → navy
const ONE_DAY_GRADIENT =
  "linear-gradient(150deg, #f7931e 0%, #00a99d 42%, #1e2d6e 100%)";

/**
 * Load Barlow Condensed (ExtraBold) so the "ONE DAY" display lockup matches the
 * page's signature condensed uppercase treatment.
 *
 * Primary path: read the OFL-licensed TTF vendored alongside this module
 * (`_fonts/BarlowCondensed-ExtraBold.ttf`). This is deterministic and has no
 * render-time network dependency.
 *
 * Fallback path: if the local read fails (e.g. asset renamed/missing), fetch
 * from Google Fonts. Either way the whole thing is wrapped so that any failure
 * degrades gracefully to Satori's bundled sans-serif rather than breaking the
 * build.
 */
async function loadBarlowCondensed(): Promise<ArrayBuffer | Buffer | null> {
  // Primary: local vendored TTF.
  try {
    return await readFile(
      join(process.cwd(), "src/app/events/one-day/_fonts/BarlowCondensed-ExtraBold.ttf"),
    );
  } catch {
    // Fall through to the network fetch below.
  }

  // Secondary fallback: Google Fonts at render time.
  try {
    const cssRes = await fetch(
      "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&display=swap",
      {
        headers: {
          // Request a TTF/OTF (not woff2) so Satori can parse it.
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
      },
    );
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    const match = css.match(
      /src:\s*url\((https:\/\/[^)]+\.(?:ttf|otf))\)/,
    );
    if (!match) return null;
    const fontRes = await fetch(match[1]);
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

// ─── Image generation ────────────────────────────────────────────
export default async function Image() {
  const barlow = await loadBarlowCondensed();

  const displayFontFamily = barlow ? "Barlow Condensed" : "sans-serif";

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
          background: ONE_DAY_GRADIENT,
          padding: "72px 80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: kicker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontWeight: 600,
            color: "rgba(255,255,255,0.82)",
          }}
        >
          Send Network Iowa
        </div>

        {/* Center block: ONE DAY + subtitle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: displayFontFamily,
              fontWeight: 800,
              textTransform: "uppercase",
              fontSize: 200,
              lineHeight: 0.9,
              letterSpacing: barlow ? 2 : -4,
            }}
          >
            One Day
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 46,
              fontWeight: 600,
              color: "rgba(255,255,255,0.95)",
            }}
          >
            The Work of the Pastor
          </div>

          {/* Amber rule */}
          <div
            style={{
              display: "flex",
              width: 120,
              height: 6,
              borderRadius: 999,
              marginTop: 30,
              background: "#f7931e",
            }}
          />

          {/* Speaker names */}
          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontSize: 36,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            Tony Merida
            <span
              style={{
                margin: "0 16px",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              ·
            </span>
            Brian Croft
          </div>
        </div>

        {/* Bottom row: date + venue */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 30,
            fontWeight: 600,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          August 28, 2026
          <span
            style={{
              margin: "0 18px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            ·
          </span>
          Ankeny, Iowa
        </div>
      </div>
    ),
    {
      ...size,
      ...(barlow
        ? {
            fonts: [
              {
                name: "Barlow Condensed",
                data: barlow,
                style: "normal" as const,
                weight: 800 as const,
              },
            ],
          }
        : {}),
    },
  );
}
