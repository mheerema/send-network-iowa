/*
 * Focus-indicator contrast auditor — WCAG 2.2 SC 1.4.11 / 2.4.7
 * =============================================================
 *
 * Paste this whole file into a DevTools console on any page of the site, then
 * call `focusRingAudit()`. See scripts/README.md for the workflow and for what
 * the output means. No dependencies, no build step, no CI.
 *
 * WHY THIS EXISTS
 * ---------------
 * axe-core and every other scanner in the stack has NO rule that evaluates
 * focus-indicator contrast. A green axe run says nothing about any of this.
 * This script is the only check that covers it, and it is deliberately manual.
 *
 * It also encodes four things that cost real time to get right and that a
 * reimplementation will get wrong in the same ways:
 *
 *   1. Colours are parsed through a canvas, not a regex. Tailwind v4 emits
 *      lab()/oklab()/color-mix() freely. An rgb() regex silently drops them —
 *      which is how a navy/80 scrim went unseen and a Level A defect (an
 *      invisible focus ring on the home hero CTA) sat live on this site.
 *   2. Surfaces are the COMPOSITED painted stack via elementsFromPoint, not
 *      the nearest ancestor background-color. A hero's dark appearance can
 *      come from an absolutely-positioned sibling, not from any ancestor.
 *   3. Photographs are sampled through a canvas, so a ring over an image is
 *      measured against real pixels rather than a token.
 *   4. Broken resources invalidate a run. A page with an image that failed to
 *      load produces scores that look clean and are not.
 *
 * THE SCORING RULE (narrower than it looks)
 * -----------------------------------------
 * On each surface exactly ONE band carries the indicator, and it must clear
 * 3:1 against an adjacent NON-indicator colour — the page surface outside it,
 * or the control's own fill inside it. The two bands' contrast against EACH
 * OTHER is never a scoring term: that is indicator-against-indicator, and
 * Understanding 1.4.11 Figure 13 grades exactly that pattern Fail.
 *
 * Merge-through: a band chromatically identical to its non-indicator neighbour
 * hands that neighbour to the next band. On a navy section the outer navy band
 * merges into the page, so the white band scores against the PAGE SURFACE.
 *
 * Invisible case: when BOTH bands merge into their neighbours, focus only
 * pushes the control's existing edge outward by the ring width and there is no
 * indicator at all. That is SC 2.4.7, Level A. Best-of-band scoring reports
 * this as 14.55:1 while a keyboard user sees nothing — it is the single most
 * important thing this script detects.
 */

(function () {
  const MERGE_THRESHOLD = 1.2; // two colours this close read as one field
  const MIN_RATIO = 3; // SC 1.4.11 non-text contrast

  // ---- colour -------------------------------------------------------------
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const lum = (p) => 0.2126 * lin(p[0] / 255) + 0.7152 * lin(p[1] / 255) + 0.0722 * lin(p[2] / 255);
  const ratio = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
    return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
  };

  // Parse ANY css colour through a canvas. Do not replace with a regex.
  const swatch = document.createElement("canvas");
  swatch.width = swatch.height = 1;
  const swatchCtx = swatch.getContext("2d", { willReadFrequently: true });
  const colourCache = new Map();
  const parseColour = (css) => {
    if (colourCache.has(css)) return colourCache.get(css);
    swatchCtx.clearRect(0, 0, 1, 1);
    swatchCtx.fillStyle = css;
    swatchCtx.fillRect(0, 0, 1, 1);
    const d = swatchCtx.getImageData(0, 0, 1, 1).data;
    const v = [d[0], d[1], d[2], d[3] / 255];
    colourCache.set(css, v);
    return v;
  };
  const over = (fg, bg) => [0, 1, 2].map((i) => Math.round(fg[i] * fg[3] + bg[i] * (1 - fg[3])));

  // ---- image sampling -----------------------------------------------------
  const isBroken = (img) => !(img.complete && img.naturalWidth > 0);
  const imageCanvases = new Map();
  const imagePixel = (img, vx, vy) => {
    if (isBroken(img)) return null;
    let cv = imageCanvases.get(img);
    if (!cv) {
      cv = document.createElement("canvas");
      cv.width = img.naturalWidth;
      cv.height = img.naturalHeight;
      try {
        cv.getContext("2d", { willReadFrequently: true }).drawImage(img, 0, 0);
      } catch {
        return null; // cross-origin taint
      }
      imageCanvases.set(img, cv);
    }
    const r = img.getBoundingClientRect();
    const fit = getComputedStyle(img).objectFit;
    const s = fit === "contain"
      ? Math.min(r.width / cv.width, r.height / cv.height)
      : Math.max(r.width / cv.width, r.height / cv.height);
    const dx = (vx - r.left - (r.width - cv.width * s) / 2) / s;
    const dy = (vy - r.top - (r.height - cv.height * s) / 2) / s;
    if (dx < 0 || dy < 0 || dx >= cv.width || dy >= cv.height) return null;
    try {
      const d = cv.getContext("2d", { willReadFrequently: true })
        .getImageData(Math.round(dx), Math.round(dy), 1, 1).data;
      return [d[0], d[1], d[2], d[3] / 255];
    } catch {
      return null;
    }
  };

  /*
   * A layer terminates the compositing walk only if it is PROVABLY opaque:
   * alpha exactly 1, and no ancestor opacity, mix-blend-mode, or filter that
   * could let content beneath it show through. Fail closed — anything we
   * cannot resolve to exactly 1.0 does not terminate. This is the same failure
   * shape as the original miss: a lab(... / 0.8) scrim treated as not-there.
   */
  const terminatesWalk = (node, bgAlpha) => {
    if (bgAlpha !== 1) return false;
    for (let a = node; a && a !== document.documentElement; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (parseFloat(cs.opacity) !== 1) return false;
      if (cs.mixBlendMode && cs.mixBlendMode !== "normal") return false;
      if (cs.filter && cs.filter !== "none") return false;
    }
    return true;
  };

  /*
   * True painted colour at a viewport point, ignoring `skip` and its subtree.
   * Returns { value, reachedBroken } — reachedBroken means a broken <img> was
   * actually traversed before an opaque layer stopped the walk, i.e. it could
   * have contributed to this pixel had it loaded.
   */
  const sampleAt = (x, y, skip) => {
    if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return null;
    const els = document.elementsFromPoint(x, y)
      .filter((n) => !(skip && (n === skip || skip.contains(n))));
    if (!els.length) return null;
    const layers = [];
    let reachedBroken = false;
    for (const n of els) {
      const cs = getComputedStyle(n);
      const op = parseFloat(cs.opacity);
      if (op === 0) continue;
      if (n.tagName === "IMG") {
        if (isBroken(n)) reachedBroken = true;
        const p = imagePixel(n, x, y);
        if (p && p[3] > 0) layers.push([p[0], p[1], p[2], p[3] * op]);
      }
      const bg = parseColour(cs.backgroundColor);
      if (bg[3] > 0) layers.push([bg[0], bg[1], bg[2], bg[3] * op]);
      if (bg[3] > 0 && terminatesWalk(n, bg[3])) break;
    }
    let base = [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return { value: base, reachedBroken };
  };

  // Geometry is stable between loaded and broken states only if the image is
  // absolutely positioned or inside a fixed aspect-ratio / explicit-height box.
  const isLayoutIndependent = (img) => {
    const cs = getComputedStyle(img);
    if (cs.position === "absolute" || cs.position === "fixed") return true;
    const p = img.parentElement;
    if (!p) return false;
    const pcs = getComputedStyle(p);
    return pcs.aspectRatio !== "auto" || pcs.height !== "auto";
  };

  const FOCUSABLE =
    'a[href],button,[tabindex]:not([tabindex="-1"]),input,select,textarea';

  /**
   * @param {{stride?: number}} [opts] stride in px for annulus sampling.
   *   1 = every pixel of the painted band (default). A larger stride is faster
   *   but cannot see an intersecting region narrower than the stride; the value
   *   used is always reported so the claim stays honest.
   */
  function focusRingAudit(opts) {
    opts = opts || {};
    const stride = opts.stride || 1;

    // Keyboard modality: :focus-visible will not match programmatic focus
    // unless the last interaction was a key press. Press Tab once first.
    const modalityProbe = document.querySelector(FOCUSABLE);
    if (modalityProbe) {
      modalityProbe.focus();
      if (!modalityProbe.matches(":focus-visible")) {
        modalityProbe.blur();
        return {
          ERROR: "No keyboard modality — press Tab once in the page, then re-run.",
        };
      }
      modalityProbe.blur();
    }

    const brokenImages = [...document.images].filter(isBroken);
    const anyLayoutDependent = brokenImages.some((i) => !isLayoutIndependent(i));

    const noTransition = document.createElement("style");
    noTransition.textContent = "*{transition:none!important;animation:none!important}";
    document.head.appendChild(noTransition);

    const rows = [];
    let annulusPoints = 0;

    for (const el of document.querySelectorAll(FOCUSABLE)) {
      const pre = el.getBoundingClientRect();
      if (!pre.width && !pre.height) continue;
      el.focus();
      if (document.activeElement !== el) continue;
      el.scrollIntoView({ block: "center" }); // keep probes inside the viewport
      const cs = getComputedStyle(el);
      const label =
        (el.textContent || el.getAttribute("aria-label") || "")
          .trim().replace(/\s+/g, " ").slice(0, 24) || "(unlabelled)";

      if (cs.outlineStyle !== "solid" || !el.matches(":focus-visible")) {
        rows.push({ label, verdict: "NO-RING" });
        continue;
      }

      const r = el.getBoundingClientRect();
      const extent = Math.ceil((parseFloat(cs.outlineOffset) || 0) + (parseFloat(cs.outlineWidth) || 0));
      const outerBand = parseColour(cs.outlineColor).slice(0, 3);
      const shadow = cs.boxShadow.match(/(rgba?|lab|oklab|color-mix)\([^)]*\)/);
      if (!shadow) {
        rows.push({ label, verdict: "NO-INNER-BAND" });
        continue;
      }
      const innerBand = parseColour(shadow[0]).slice(0, 3);

      // Sample the ANNULUS the ring actually paints — not a filled rect. An
      // outset ring paints only between the border box and border box+extent.
      const pts = [];
      for (let x = Math.floor(r.left - extent); x <= Math.ceil(r.right + extent); x += stride) {
        for (let d = 1; d <= extent; d += stride) {
          pts.push([x, Math.floor(r.top - d)], [x, Math.ceil(r.bottom + d)]);
        }
      }
      for (let y = Math.floor(r.top - extent); y <= Math.ceil(r.bottom + extent); y += stride) {
        for (let d = 1; d <= extent; d += stride) {
          pts.push([Math.floor(r.left - d), y], [Math.ceil(r.right + d), y]);
        }
      }
      annulusPoints += pts.length;

      const sampled = pts.map(([x, y]) => sampleAt(Math.round(x), Math.round(y), el)).filter(Boolean);
      if (sampled.length < 3) {
        rows.push({ label, verdict: "UNSAMPLED" });
        continue;
      }
      const surfaces = sampled.map((s) => s.value);
      const surfaceDependsOnBroken = sampled.some((s) => s.reachedBroken) || anyLayoutDependent;

      /*
       * SURFACE-DEPENDENCE IS A CLASS, NOT A CASE.
       *
       * Any value whose computed result depends on ancestor context is
       * surface-dependent, and therefore broken-dependent when the surface is.
       * The first version of this guard only knew about `background:transparent`,
       * which is one member of the class — and that gap is what let the rescue
       * rule's negative branch never fire across 148 controls.
       *
       * Members that exist or could exist in this codebase:
       *   - partial alpha (bg-white/10), not just fully transparent
       *   - currentColor band colours (outline-current), resolved from an
       *     inherited `color` a section wrapper may set
       *   - ancestor opacity < 1, mix-blend-mode, filter, backdrop-filter,
       *     which make the band itself composite with the backdrop
       *   - custom properties scoped at a surface container
       *
       * One guard collapses them: every colour entering a term must resolve to
       * a literal value with alpha exactly 1, from a chain with no ancestor
       * compositing. Anything else marks the term broken-dependent. FAIL CLOSED
       * — resolve unknowns toward "cannot rescue", never toward "safe".
       *
       * Note this is the same lesson as the lab() parsing miss, arriving for
       * dependency analysis rather than for measurement. "Sample pixels, not
       * tokens" applied once did not immunise the other path.
       */
      const compositingAncestor = (node) => {
        for (let a = node; a && a !== document.documentElement; a = a.parentElement) {
          const acs = getComputedStyle(a);
          if (parseFloat(acs.opacity) !== 1) return true;
          if (acs.mixBlendMode && acs.mixBlendMode !== "normal") return true;
          if (acs.filter && acs.filter !== "none") return true;
          if (acs.backdropFilter && acs.backdropFilter !== "none") return true;
        }
        return false;
      };
      const contextComposited = compositingAncestor(el);
      // A band colour is context-free only if it is fully opaque and nothing in
      // the chain composites it. Partial alpha on EITHER band leaks the surface.
      const bandsContextFree =
        !contextComposited &&
        parseColour(cs.outlineColor)[3] === 1 &&
        parseColour(shadow[0])[3] === 1;

      const ownBg = parseColour(cs.backgroundColor);
      const fillIsContextFree = ownBg[3] === 1 && !contextComposited;
      const fillDependsOnBroken =
        [...el.querySelectorAll("img")].some(isBroken) ||
        (!fillIsContextFree && surfaceDependsOnBroken) ||
        (!bandsContextFree && surfaceDependsOnBroken);

      const fill = ownBg[3] < 1 ? over(ownBg, surfaces[0]) : ownBg.slice(0, 3);

      const outerVsSurface = Math.max(...surfaces.map((s) => ratio(outerBand, s)));
      const innerVsFill = ratio(innerBand, fill);
      const outerMerged = outerVsSurface <= MERGE_THRESHOLD;
      const innerMerged = innerVsFill <= MERGE_THRESHOLD;

      const terms = { inner_vs_fill: innerVsFill, outer_vs_surface: outerVsSurface };
      if (outerMerged) terms.inner_vs_surface = Math.min(...surfaces.map((s) => ratio(innerBand, s)));
      if (innerMerged) terms.outer_vs_fill = ratio(outerBand, fill);

      const globalMax = Math.max(...Object.values(terms));

      /*
       * The rule is EXISTENTIAL, not a maximisation: any adjacent
       * non-indicator boundary clearing 3:1 is a sufficient witness. Prefer a
       * witness that does not rest on a broken resource — a broken-dependent
       * term can only ever add a proof of pass, never revoke one.
       */
      const usable = Object.entries(terms).filter(
        ([k]) =>
          !(k === "inner_vs_fill" && fillDependsOnBroken) &&
          !(k.includes("surface") && surfaceDependsOnBroken)
      );
      const usableBest = usable.length ? Math.max(...usable.map(([, v]) => v)) : 0;
      const carrierEntry = usable.length && usableBest >= MIN_RATIO
        ? usable.find(([, v]) => v === usableBest)
        : Object.entries(terms).find(([, v]) => v === globalMax);

      // Where a control is transparent, fill and surface are the same colour and
      // the carrier label is arbitrary. Mark N/A so it cannot pollute the
      // drift signal (a system quietly trending toward inner-edge-only rings).
      const fillEqualsSurface = ratio(fill, surfaces[0]) <= 1.05;

      let verdict;
      if (outerMerged && innerMerged) verdict = "INVISIBLE-2.4.7";
      else if (globalMax < MIN_RATIO) verdict = "FAIL-1.4.11";
      else if (usableBest < MIN_RATIO) verdict = "UNSCORABLE-no-broken-independent-term";
      else verdict = brokenImages.length ? "PASS (rescued)" : "pass";

      rows.push({
        label,
        carrier: fillEqualsSurface ? "N/A (fill==surface)" : carrierEntry[0],
        carrierValue: usableBest >= MIN_RATIO ? usableBest : globalMax,
        globalMax,
        verdict,
      });
    }

    if (document.activeElement) document.activeElement.blur();
    noTransition.remove();

    const failing = rows.filter((r) => ["FAIL-1.4.11", "INVISIBLE-2.4.7"].includes(r.verdict));
    const unscorable = rows.filter((r) => String(r.verdict).startsWith("UNSCORABLE"));
    const carriers = {};
    rows.filter((r) => r.carrier).forEach((r) => {
      carriers[r.carrier] = (carriers[r.carrier] || 0) + 1;
    });

    return {
      path: location.pathname,
      viewport: innerWidth + "x" + innerHeight,
      stride,
      annulusPointsSampled: annulusPoints,
      controls: rows.length,
      brokenImages: brokenImages.length,
      // A page does not go green out of a broken run, even if every control
      // individually rescues. That property is the whole value of the check.
      pageVerdict: brokenImages.length
        ? "PAGE INVALID (broken resources present)"
        : failing.length || unscorable.length
        ? "FAIL"
        : "VALID + ALL PASS",
      failing: failing.length,
      failures: failing,
      unscorable: unscorable.length,
      unscorableRows: unscorable,
      carriedBy: carriers,
      carrierDivergedFromGlobalMax: rows.filter(
        (r) => r.carrier && r.carrierValue !== r.globalMax
      ).length,
      rows,
    };
  }

  /*
   * Self-test. Run `focusRingAudit.selfTest()` after any change to the scoring
   * or rescue logic. Each case has caught a real defect in this script:
   *
   *   invisible      — the home hero CTA shipped this; best-of-band scored it
   *                    14.55:1 while the ring was not visible at all.
   *   insideScoring  — a band may score against the component's own fill
   *                    (Understanding 1.4.11 Figures 8/11); must NOT be flagged.
   *   rescueNegative — the rescue rule's negative branch. It went 148 controls
   *                    without ever firing, which meant "zero unscorable" was
   *                    permissive rather than validated.
   */
  focusRingAudit.selfTest = async function () {
    const results = {};
    const mk = (bg, text) => {
      const a = document.createElement("a");
      a.href = "#";
      a.className = "focus-ring";
      a.style.cssText =
        `display:inline-block;background:${bg};color:#10294c;padding:12px 24px;border-radius:999px`;
      a.textContent = text;
      return a;
    };

    // 1. invisible: white control on navy — both bands merge
    let host = document.createElement("div");
    host.style.cssText = "background:#10294c;padding:40px";
    const invisible = mk("#ffffff", "selftest invisible");
    host.appendChild(invisible);
    document.body.appendChild(host);
    invisible.focus();
    results.invisible = focusRingAudit({ stride: 4 }).rows
      .find((r) => r.label.includes("selftest invisible"))?.verdict;
    host.remove();

    // 2. inside-scoring: white control on brand-slate — outer band fails against
    //    the surface (2.49) but clears against the fill (14.55). Must pass.
    host = document.createElement("div");
    host.style.cssText = "background:#5c6670;padding:40px";
    const inside = mk("#ffffff", "selftest inside");
    host.appendChild(inside);
    document.body.appendChild(host);
    inside.focus();
    results.insideScoring = focusRingAudit({ stride: 4 }).rows
      .find((r) => r.label.includes("selftest inside"))?.verdict;
    host.remove();

    // 3. rescue negative: transparent control whose ring sits over a broken
    //    image behind a TRANSLUCENT scrim. Must be UNSCORABLE, not rescued.
    host = document.createElement("div");
    host.style.cssText = "position:relative;height:200px;margin:40px";
    const broken = document.createElement("img");
    broken.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover";
    const scrim = document.createElement("div");
    scrim.style.cssText = "position:absolute;inset:0;background:rgba(16,41,76,0.8)";
    const transparent = mk("transparent", "selftest rescue");
    transparent.style.position = "absolute";
    transparent.style.top = "70px";
    transparent.style.left = "70px";
    host.append(broken, scrim, transparent);
    document.body.appendChild(host);
    await new Promise((res) => {
      broken.addEventListener("error", res, { once: true });
      broken.src = "/__intentionally-missing-for-selftest__.webp";
      setTimeout(res, 5000);
    });
    transparent.focus();
    results.rescueNegative = focusRingAudit({ stride: 4 }).rows
      .find((r) => r.label.includes("selftest rescue"))?.verdict;
    host.remove();

    results.ok =
      results.invisible === "INVISIBLE-2.4.7" &&
      /^(pass|PASS)/.test(results.insideScoring || "") &&
      String(results.rescueNegative).startsWith("UNSCORABLE");
    return results;
  };

  window.focusRingAudit = focusRingAudit;
  return "focusRingAudit() ready — press Tab in the page first, then run it.";
})();
