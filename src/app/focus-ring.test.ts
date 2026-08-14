import assert from "node:assert/strict";
import test, { describe } from "node:test";
import { readFileSync } from "node:fs";

/**
 * The focus-ring guarantee. Run with `npm test`.
 *
 * The site's focus indicator is two bands — a white one against the control
 * and a navy one outside it (globals.css, `focus-ring`). Its correctness rests
 * on a single arithmetic property, and this file is the tripwire for it.
 *
 * THE PROPERTY
 * For band separation S, the better of the two bands is at least sqrt(S)
 * against ANY solid surface. If both bands were under r against some surface,
 * the two bands could be at most r*r apart from each other — so a large
 * separation makes it impossible for both to fail at once.
 *
 * This is W3C Technique C40, "Creating a two-color focus indicator to ensure
 * sufficient contrast with all components", the Sufficient Technique for this
 * exact ring under SC 1.4.11 (focus state), 2.4.7 and 2.4.13:
 * https://www.w3.org/WAI/WCAG22/Techniques/css/C40
 *
 *   "As long as the two indicator colors have a contrast ratio of at least
 *    9:1 with each other, at least one of the two colors is guaranteed to
 *    meet 3:1 contrast with any solid background color."
 *
 * 9:1 is chosen because sqrt(9) = 3, the 1.4.11 threshold. This file covers
 * C40's steps 1 and 2; step 3 — that the indicator sits over one solid colour
 * at a time — cannot be answered without walking the page, which is what
 * scripts/focus-ring-audit.js is for.
 *
 * Ours is 14.55:1, giving a floor of 3.81:1 on any solid background. That is
 * why there is no per-surface contrast table to maintain, and why nobody may
 * retune brand-navy without re-deriving all of this. If this test fails, the
 * guarantee is gone and every solid surface on the site needs measuring again.
 *
 * WHAT THIS DOES NOT COVER — do not read a green run as "focus is fine"
 * The floor bounds each band against the surface. It does not bound a band
 * sandwiched between the control and the surface, which is where the real
 * defect on the home hero lived: over a scrimmed photograph the navy band sat
 * at 1.88:1, too low to carry and too high to be subsumed into the page.
 * Composited surfaces — photos, scrims, gradients, translucent layers — are
 * measured by scripts/focus-ring-audit.js, not guaranteed here.
 */

const CSS = readFileSync(new URL("./globals.css", import.meta.url), "utf8");

/** Read a brand token straight out of globals.css so the test cannot drift. */
function token(name: string): string {
  const m = CSS.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{3,8});`));
  assert.ok(m, `--color-${name} not found in globals.css`);
  return m![1];
}

function relativeLuminance(hex: string): number {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The two bands of the focus indicator, as `focus-ring` actually declares them. */
const OUTER_BAND = () => token("brand-navy");
const INNER_BAND = "#ffffff";

/** Technique C40's threshold. Below this the sqrt bound stops reaching 3:1. */
const MIN_BAND_SEPARATION = 9;

describe("focus-ring band separation (W3C Technique C40)", () => {
  test("the two bands are at least 9:1 apart", () => {
    const s = contrast(OUTER_BAND(), INNER_BAND);
    assert.ok(
      s >= MIN_BAND_SEPARATION,
      `Band separation is ${s.toFixed(2)}:1, below the ${MIN_BAND_SEPARATION}:1 floor. ` +
        `The focus indicator no longer guarantees 3:1 on arbitrary solid surfaces. ` +
        `Either restore the separation or re-measure every surface on the site.`
    );
  });

  test("the guaranteed floor clears the 1.4.11 threshold of 3:1", () => {
    const floor = Math.sqrt(contrast(OUTER_BAND(), INNER_BAND));
    assert.ok(floor >= 3, `Guaranteed floor is ${floor.toFixed(2)}:1, under 3:1.`);
  });

  test("the floor holds against every solid grey — brute force, not algebra", () => {
    // The algebraic bound says sqrt(S). Verify it empirically rather than
    // trusting the derivation: the worst case is the mid-tone where both bands
    // are equally weak, near #838383.
    const floor = Math.sqrt(contrast(OUTER_BAND(), INNER_BAND));
    let worst = Infinity;
    let worstAt = "";
    for (let v = 0; v <= 255; v++) {
      const grey = "#" + [v, v, v].map((n) => n.toString(16).padStart(2, "0")).join("");
      const best = Math.max(contrast(OUTER_BAND(), grey), contrast(INNER_BAND, grey));
      if (best < worst) {
        worst = best;
        worstAt = grey;
      }
    }
    assert.ok(
      worst >= floor - 0.001,
      `Empirical worst case ${worst.toFixed(3)} at ${worstAt} fell below the sqrt bound ${floor.toFixed(3)}.`
    );
    assert.ok(worst >= 3, `Empirical worst case ${worst.toFixed(3)} at ${worstAt} is under 3:1.`);
  });

  /*
   * THE BOUND IS BAND-AGNOSTIC. SC 1.4.11 IS BAND-SPECIFIC.
   *
   * The sqrt(S) floor says SOME band clears 3:1. The criterion asks whether the
   * band ADJACENT TO THE SURFACE does. For an outset ring that is the outermost
   * band only (Understanding 1.4.11, Fig 10). So there are three outcomes:
   *
   *   outer >= 3:1          carrying                                  PASS
   *   outer <  1.5:1        subsumed into the surface, so the inner
   *                         band inherits the adjacency and clears
   *                         by the >= 9:1 separation                  PASS
   *   1.5:1 <= outer < 3:1  neither carrying nor subsumed — a
   *                         visible-but-uncarrying smear at the page
   *                         boundary                                  FAIL
   *
   * The middle case is the DEAD ZONE, and it is a property of the outer band
   * COLOUR, not of any one surface. It is where the shipped home-hero defect
   * lived: navy outermost over a scrimmed photograph at 1.88:1. Asserting
   * `max(outer, inner) >= 3` passes that defect. Do not weaken these back.
   */
  const SUBSUMPTION = 1.5; // declared tokens; tighten to 1.2 for computed composites

  const surfaceTokens = () =>
    [...CSS.matchAll(/--color-(brand-[a-z-]+):\s*(#[0-9a-fA-F]{3,8});/g)]
      .map((m) => ({ name: m[1], hex: m[2] }))
      .concat([
        { name: "white", hex: "#ffffff" },
        { name: "gray-50", hex: "#f9fafb" },
        { name: "gray-100", hex: "#f3f4f6" },
      ]);

  test("every surface the site uses is carried or subsumed — not merely 'some band passes'", () => {
    const inUse = ["white", "brand-navy", "gray-50", "brand-amber", "gray-100", "brand-off-white"];
    const tokens = surfaceTokens();
    for (const name of inUse) {
      const t = tokens.find((x) => x.name === name);
      assert.ok(t, `surface ${name} not found among tokens`);
      const outer = contrast(OUTER_BAND(), t!.hex);
      assert.ok(
        outer >= 3 || outer < SUBSUMPTION,
        `${name} (${t!.hex}): outer band at ${outer.toFixed(2)}:1 is in the dead zone ` +
          `[${SUBSUMPTION}, 3.0) — neither carrying nor subsumed. Use focus-ring-invert here.`
      );
    }
  });

  test("G4 — the variants' dead zones are disjoint, so every surface is coverable", () => {
    const deadZone = (band: string): [number | null, number | null] => {
      let lo: number | null = null;
      let hi: number | null = null;
      for (let v = 0; v <= 255; v++) {
        const grey = "#" + [v, v, v].map((n) => n.toString(16).padStart(2, "0")).join("");
        const c = contrast(band, grey);
        if (c >= SUBSUMPTION && c < 3) {
          if (lo === null) lo = v;
          hi = v;
        }
      }
      return [lo, hi];
    };
    const [aLo, aHi] = deadZone(OUTER_BAND());
    const [bLo, bHi] = deadZone(INNER_BAND);
    assert.ok(aLo !== null && bLo !== null, "expected both variants to have a dead zone");
    assert.ok(
      !(Math.max(aLo!, bLo!) <= Math.min(aHi!, bHi!)),
      `dead zones overlap (${aLo}-${aHi} and ${bLo}-${bHi}); some surfaces uncoverable`
    );
  });

  test("G4 — no brand token sits in BOTH variants' dead zones", () => {
    for (const t of surfaceTokens()) {
      const a = contrast(OUTER_BAND(), t.hex);
      const b = contrast(INNER_BAND, t.hex);
      assert.ok(
        !(a >= SUBSUMPTION && a < 3 && b >= SUBSUMPTION && b < 3),
        `${t.name} (${t.hex}) is dead-zoned for both variants ` +
          `(navy-outer ${a.toFixed(2)}, white-outer ${b.toFixed(2)})`
      );
    }
  });
});

/*
 * G5 — the scrimmed hero, bounded without reference to any photograph.
 *
 * For a uniform scrim of colour C at alpha a over arbitrary source S, the
 * composite is a*C + (1-a)*S per channel. Luminance is monotonic per channel,
 * so compositing over pure black and pure white BOUNDS the achievable range for
 * every possible image. Checking the outer band against the nearer endpoint is
 * therefore image-independent — it survives an asset swap, a CMS upload, or a
 * sixth carousel slide, which per-image measurement does not.
 */
describe("hero scrim bound (image-independent)", () => {
  const SCRIM_ALPHA = 0.8; // bg-brand-navy/80 in HeroPathwaySplit.tsx
  const HERO = readFileSync(
    new URL("../components/HeroPathwaySplit.tsx", import.meta.url),
    "utf8"
  );
  const composite = (over: number[], scrim: string, a: number) => {
    let h = scrim.replace("#", "");
    if (h.length === 3) h = [...h].map((c) => c + c).join("");
    return (
      "#" +
      [0, 2, 4]
        .map((i) => parseInt(h.slice(i, i + 2), 16))
        .map((ch, i) => Math.round(a * ch + (1 - a) * over[i]).toString(16).padStart(2, "0"))
        .join("")
    );
  };
  const darkest = () => composite([0, 0, 0], token("brand-navy"), SCRIM_ALPHA);
  const brightest = () => composite([255, 255, 255], token("brand-navy"), SCRIM_ALPHA);

  test("the derived bound brackets the surface actually measured on the page", () => {
    const measured = "#40546f";
    assert.ok(
      relativeLuminance(darkest()) <= relativeLuminance(measured) &&
        relativeLuminance(measured) <= relativeLuminance(brightest()),
      `measured hero surface ${measured} outside derived bound ${darkest()}..${brightest()}`
    );
  });

  test("the hero's variant clears 3:1 across the WHOLE range, for any image", () => {
    const worstWhiteOuter = Math.min(
      contrast(INNER_BAND, darkest()),
      contrast(INNER_BAND, brightest())
    );
    assert.ok(
      worstWhiteOuter >= 3,
      `white-outermost worst case ${worstWhiteOuter.toFixed(2)}:1 over the hero range`
    );
    // Navy outermost must NOT be used here: it never reaches 3:1 anywhere in
    // the range. That is exactly the defect that shipped and was fixed.
    const bestNavyOuter = Math.max(
      contrast(OUTER_BAND(), darkest()),
      contrast(OUTER_BAND(), brightest())
    );
    assert.ok(
      bestNavyOuter < 3,
      `expected navy-outermost to fail across the hero range; got ${bestNavyOuter.toFixed(2)}:1`
    );
  });

  test("the hero CTAs are declared with the inverted variant", () => {
    const rings = [...HERO.matchAll(/className="(focus-ring(?:-invert)?)\s/g)].map((m) => m[1]);
    assert.ok(rings.length >= 2, "expected the two hero CTAs to carry a focus-ring class");
    for (const r of rings) {
      assert.equal(
        r,
        "focus-ring-invert",
        "a hero CTA is using the default focus-ring; over the scrimmed hero its navy outer " +
          "band never reaches 3:1. This is the SC 1.4.11 / 2.4.7 defect that shipped once."
      );
    }
    assert.match(
      HERO,
      /bg-brand-navy\/80/,
      "hero scrim alpha changed — re-derive the bound in this file before trusting it"
    );
  });
});

describe("focus-ring declarations in globals.css", () => {
  test("both variants carry their indicator on an outline, not box-shadow alone", () => {
    // Forced-colors mode suppresses box-shadow but keeps outline. A variant
    // drawing both bands with box-shadow would vanish entirely — a flat SC
    // 2.4.7 (Level A) failure that no contrast audit surfaces. C40 warns about
    // exactly this: "Avoid setting outline:none to use box-shadow on its own."
    for (const utility of ["focus-ring", "focus-ring-invert"]) {
      const block = CSS.match(new RegExp(`@utility ${utility}\\s*\\{[\\s\\S]*?\\n\\}`));
      assert.ok(block, `@utility ${utility} not found`);
      assert.match(
        block![0],
        /outline:\s*2px solid/,
        `${utility} must draw a band with outline so it survives forced-colors mode`
      );
    }
  });

  test("no rule suppresses the outline on a focusable element", () => {
    assert.doesNotMatch(
      CSS.replace(/\/\*[\s\S]*?\*\//g, ""), // ignore commentary
      /outline:\s*(none|0)\b|outline-style:\s*none/,
      "outline suppression found — this is a flat SC 2.4.7 failure"
    );
  });

  test("the two bands are contiguous, with no surface showing between them", () => {
    // A gap would let the page show through between the bands, creating an
    // extra adjacency that would have to be scored separately. The inner band
    // is a 2px box-shadow spread; the outer is an outline at 2px offset. The
    // shadow must fill exactly the offset gap.
    const block = CSS.match(/@utility focus-ring\s*\{[\s\S]*?\n\}/)![0];
    const offset = block.match(/outline-offset:\s*(\d+)px/);
    const spread = block.match(/box-shadow:\s*0 0 0 (\d+)px/);
    assert.ok(offset && spread, "could not read outline-offset / box-shadow spread");
    assert.equal(
      Number(spread![1]),
      Number(offset![1]),
      "box-shadow spread must equal outline-offset or a seam opens between the bands"
    );
  });

  test("each band is at least 2 CSS px", () => {
    const block = CSS.match(/@utility focus-ring\s*\{[\s\S]*?\n\}/)![0];
    const width = Number(block.match(/outline:\s*(\d+)px solid/)![1]);
    const spread = Number(block.match(/box-shadow:\s*0 0 0 (\d+)px/)![1]);
    assert.ok(width >= 2, `outline band is ${width}px, under the 2px minimum`);
    assert.ok(spread >= 2, `shadow band is ${spread}px, under the 2px minimum`);
  });
});
