import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared pieces for the file-convention OG / twitter image routes
 * (src/app/** /opengraph-image.tsx). Satori can't read CSS custom properties,
 * so the brand hex values from src/app/globals.css are repeated here on
 * purpose — keep them in sync with the Tailwind tokens.
 */

export const OG_SIZE = { width: 1200, height: 630 };

export const BRAND_NAVY = "#10294c";
export const BRAND_AMBER = "#fbac33";

/**
 * Read the white SNI wordmark from /public at render time and return a base64
 * data URI for Satori's <img>. Wrapped so a missing/renamed asset degrades to
 * a typographic fallback rather than breaking the build.
 */
export async function loadLogoSrc(): Promise<string | null> {
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

/** Brand navy at 75% — keeps title/byline legible over a hero photo. */
const OVERLAY_NAVY = "rgba(16,41,76,0.75)";

const HERO_FETCH_TIMEOUT_MS = 10_000;

/**
 * Ask the stock CDNs for a 1200-wide frame instead of the full-res original;
 * Unsplash additionally gets fm=jpg because Satori can't decode AVIF. URLs
 * that already carry sizing params, or from unknown hosts, pass through.
 */
function withOgPhotoParams(url: string): string {
  try {
    const u = new URL(url);
    if (
      u.hostname === "images.unsplash.com" ||
      u.hostname === "images.pexels.com"
    ) {
      if (!u.searchParams.has("w")) u.searchParams.set("w", "1200");
      if (!u.searchParams.has("q")) u.searchParams.set("q", "75");
      if (u.hostname === "images.unsplash.com" && !u.searchParams.has("fm"))
        u.searchParams.set("fm", "jpg");
    }
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Fetch an article's hero photo at build time and return a data URI for
 * Satori's <img>. Any failure — no URL, network error, timeout, non-OK,
 * non-image body — returns null so the card falls back to the solid-navy
 * design. A photo fetch must never fail the build.
 */
export async function loadHeroSrc(
  url: string | undefined,
): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(withOgPhotoParams(url), {
      signal: AbortSignal.timeout(HERO_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) return null;
    const data = Buffer.from(await res.arrayBuffer()).toString("base64");
    return `data:${contentType};base64,${data}`;
  } catch {
    return null;
  }
}

const TITLE_MAX_CHARS = 160;

/** Hard clamp for pathological titles; normal titles pass through untouched. */
export function clampTitle(title: string): string {
  if (title.length <= TITLE_MAX_CHARS) return title;
  return `${title.slice(0, TITLE_MAX_CHARS - 1).trimEnd()}…`;
}

/** Scale the headline down as titles get longer so wrapped lines still fit. */
function titleFontSize(title: string): number {
  if (title.length <= 45) return 68;
  if (title.length <= 80) return 56;
  if (title.length <= 120) return 48;
  return 42;
}

interface OgCardProps {
  logoSrc: string | null;
  title: string;
  /** Small line under the title: "via {source}" for reposts, date otherwise. */
  byline: string;
  bylineColor: string;
  /** Hero photo data URI (from loadHeroSrc). Rendered behind a navy overlay. */
  heroSrc?: string | null;
}

/**
 * The shared 1200x630 card: navy field (or hero photo under a navy overlay),
 * white wordmark top-left, amber rule, large wrapped title, small byline.
 * Used by /resources/articles and /resources/articles/[slug].
 */
export function OgCard({
  logoSrc,
  title,
  byline,
  bylineColor,
  heroSrc,
}: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: BRAND_NAVY,
      }}
    >
      {heroSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={heroSrc}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : null}
      {heroSrc ? (
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: OVERLAY_NAVY,
          }}
        />
      ) : null}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoSrc} alt="Send Network Iowa" width={320} />
        ) : (
          <div
            style={{
              display: "flex",
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            Send Network Iowa
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Amber rule — same treatment as the root OG image */}
          <div
            style={{
              display: "flex",
              width: 120,
              height: 6,
              borderRadius: 999,
              marginBottom: 36,
              background: BRAND_AMBER,
            }}
          />

          <div
            style={{
              display: "flex",
              fontSize: titleFontSize(title),
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: -1,
              maxWidth: 1020,
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 30,
              fontWeight: 600,
              color: bylineColor,
            }}
          >
            {byline}
          </div>
        </div>
      </div>
    </div>
  );
}
