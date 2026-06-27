import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// ─── Image metadata ──────────────────────────────────────────────
export const alt =
  "Send Network Iowa — planting gospel-centered churches in every Iowa community.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Brand signature gradient: amber → teal → navy
const ONE_DAY_GRADIENT =
  "linear-gradient(150deg, #f7931e 0%, #00a99d 42%, #1e2d6e 100%)";

/**
 * Read the white SNI wordmark from /public at render time and return a base64
 * data URI for Satori's <img>. Wrapped so a missing/renamed asset degrades to
 * a typographic fallback rather than breaking the build.
 */
async function loadLogoSrc(): Promise<string | null> {
  try {
    const data = await readFile(
      join(process.cwd(), "public/images/brand/sni-logo-white.png"),
      "base64",
    );
    return `data:image/png;base64,${data}`;
  } catch {
    return null;
  }
}

// ─── Image generation ────────────────────────────────────────────
export default async function Image() {
  const logoSrc = await loadLogoSrc();

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: ONE_DAY_GRADIENT,
          padding: "80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
          textAlign: "center",
        }}
      >
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoSrc} alt="Send Network Iowa" width={520} />
        ) : (
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            Send Network Iowa
          </div>
        )}

        {/* Amber rule */}
        <div
          style={{
            display: "flex",
            width: 120,
            height: 6,
            borderRadius: 999,
            marginTop: 44,
            marginBottom: 32,
            background: "#f7931e",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 600,
            maxWidth: 880,
            lineHeight: 1.25,
            color: "rgba(255,255,255,0.95)",
          }}
        >
          A church in every Iowa community
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
