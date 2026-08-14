# Focus-indicator contrast audit

`focus-ring-audit.js` checks that every focusable control on a page has a
keyboard focus indicator meeting WCAG 2.2 SC 1.4.11 (Non-text Contrast), and
that the indicator is actually *visible* rather than merely high-contrast on
paper (SC 2.4.7, Level A).

**Run it after any change to a focus-ring utility, a surface token, or a brand
colour.** Those are the only changes that can break this.

## Why it is manual

axe-core has **no rule** that evaluates focus-indicator contrast, and neither
does anything else in the stack. A green axe run says nothing about any of
this. This script is the only coverage that exists for it.

It is deliberately a console script — no test framework, no browser binary, no
CI job. The convention it guards is locked and does not churn; a CI harness
would cost a dependency and ongoing flake triage to watch something that
changes once a year. Revisit that if surface tokens start moving regularly.

## How to run

1. Open the page in Chrome.
2. **Press `Tab` once.** `:focus-visible` does not match programmatic focus
   unless the last interaction was a key press. The script refuses to run
   otherwise rather than reporting a page full of `NO-RING`.
3. Paste the whole of `focus-ring-audit.js` into the console.
4. Run `focusRingAudit()`.

```js
focusRingAudit()                 // every pixel of the painted band (default)
focusRingAudit({ stride: 4 })    // faster, coarser — see "stride" below
await focusRingAudit.selfTest()  // validate the script itself
```

Check both 1280px and 375px, and at 375px open the nav drawer first.

## Reading the output

| field | meaning |
|---|---|
| `pageVerdict` | `VALID + ALL PASS`, `FAIL`, or `PAGE INVALID` |
| `failing` / `failures` | controls that genuinely fail |
| `unscorable` | controls whose verdict would depend on a resource that did not load |
| `carriedBy` | which boundary carried each control's indicator |
| `annulusPointsSampled` | how many pixels of the painted band were measured |
| `carrierDivergedFromGlobalMax` | how often the reported witness was not the highest ratio |

### `UNSCORABLE` is a verdict, not an error

It means the tool **declines to answer**, because every boundary that would
carry the control depends on a resource that did not load. Re-running does not
help. A human closes it, usually by characterising the surface independently.

Worked example — the `/iowa` hero footnote link. It came back `UNSCORABLE`
locally because the hero photograph does not load in this environment. It was
closed *without* the image, by characterising the surface: the hero is a photo
at `opacity-20` over an opaque `bg-brand-navy` section, so the painted surface
is `0.2 × photo + 0.8 × navy`, which bounds to `rgb(13,33,61)`–`rgb(64,84,112)`
whatever the photograph is. Scanning the actual photo (25,288 pixels, zero
outside the bound) gives the outer navy band 1.88:1 — it does not carry — and
the inner white band **7.72:1**, which does, because the link is transparent so
its fill *is* the surface showing through. Pass, on the bound, no image needed.

Note that this is the mirror image of the defect on the home hero CTA: there
the control had an *opaque white* fill, so the white band merged into it (1.00)
while the navy band merged into the page. **The fill is the discriminator.**

### `PAGE INVALID` is not a failure

If any image on the page failed to load, the page verdict is `PAGE INVALID`
even when every control individually passes. A page does not go green out of a
broken run — that property is the entire value of the check.

Individual controls can still be **rescued**: a control is scored normally if
some boundary clearing 3:1 does not depend on the broken resource. Those report
as `PASS (rescued)`, never as a plain `pass`, so a rescued page can never be
mistaken for a clean one.

Locally, remote media (the Unsplash article images) will not load and every page
will come back `PAGE INVALID`. To get genuinely clean page verdicts, run against
a deployed preview instead, which has a working image pipeline.

### `carriedBy`

Each control's indicator is carried by exactly one boundary:

- `outer_vs_surface` — the outer band against the page. The healthy default.
- `inner_vs_fill` — the inner band against the control's own fill. Valid
  (Understanding 1.4.11 Figures 8/11) but harder to see than a control clearing
  on both boundaries.
- `inner_vs_surface` / `outer_vs_fill` — merge-through cases, where one band is
  the same colour as its neighbour and hands that neighbour to the other band.
- `N/A (fill==surface)` — transparent controls, where the two terms are the same
  number and the label would be arbitrary.

Watch for a drift toward `inner_vs_fill`. A sheet that stays green while
migrating to inner-edge-only rings is quietly getting worse for low-vision
keyboard users.

### `stride`

The script samples the annulus the ring actually paints — the region between the
border box and border box + offset + width — not a filled rectangle. `stride: 1`
(default) measures every pixel of that band. A larger stride is faster but cannot
detect an intersecting region narrower than the stride. The value used is always
reported, so a coarse run cannot be mistaken for an exhaustive one.

## The scoring rule

On each surface exactly **one** band carries the indicator, and it must clear
3:1 against an adjacent **non-indicator** colour — the page surface outside it,
or the control's own fill inside it.

**The two bands' contrast against each other is never a scoring term.** That is
indicator-against-indicator. Understanding 1.4.11 defines *adjacent colors* as
"the colors adjacent to the component" — outward, toward the surroundings,
with nothing contemplating internal structure — and Figure 13 is a worked
**Fail** of exactly this move: an inner dark-green border that contrasts with
the black border but not with the blue component background. Figure 14 passes
the same geometry only because the inner band contrasts with *both*.

The normative sentence alone does not settle it: SC 1.4.11 says "3:1 against
adjacent color(s)" and *adjacent colors* is not in the WCAG glossary. The
guidance settles it.

### The criterion is existential, not a maximisation

At least one boundary must clear 3:1. The carrier is a **witness**, not a
maximum. Any valid witness suffices, which is what makes it legitimate for this
script to pick a witness that does not rest on a broken resource rather than
the highest number — it is citing the proof that does not depend on an
unavailable lemma. A broken-dependent term can only ever supply an *additional*
proof of pass; it can never revoke one. The script reports both the carrier and
the global max so this can be audited rather than trusted.

### Why the band colours must stay far apart

The bands are 14.55:1 apart, and that is a guarantee rather than a decoration.
For separation `S`, the better band is at least `sqrt(S)` against **any solid
surface** — if both bands were under `r` against some surface, the bands could
be at most `r × r` apart. W3C Technique C40 uses 9:1 for exactly this reason:
`sqrt(9) = 3`, the threshold. Ours gives a floor of **3.81:1**, verified by
brute force over all 256 greys (true worst case 3.84 at `#838383`).

That floor is why there is no per-surface table to maintain for solid
backgrounds, and it is enforced by `src/app/focus-ring.test.ts` — the tripwire
that fires if anyone retunes `brand-navy`.

**Where the guarantee does not reach.** It bounds each band against the
surface. It does *not* bound a band sandwiched between the control and the
surface. On the home hero the composited surface sits near `#40546f`, where the
outer navy band is 1.88:1 — too low to carry (needs 3:1), too high to be
subsumed into the page (under ~1.5:1). The ring failed there even though the
guarantee held at 7.73:1 for white. Palette tokens never land in that gap;
composited surfaces — photos, scrims, gradients, translucent layers — can, and
that is what this script is for.

The failure this rule exists to catch: a near-white control on a navy section.
The white band merges into the control, the navy band merges into the page, and
the only edge left is the control's own outline, which was there before focus.
Scored band-against-band that reads 14.55:1 — and a keyboard user sees nothing.
**This shipped on the home hero CTA and is what the rule was written to find.**

Any new control whose fill is near-white on a dark section, or near-navy on a
light one, needs `focus-ring-invert` rather than a contrast tweak.

## Design rule this encodes

**Prefer focus indicators whose painted geometry is disjoint from component
content.** An outset ring paints outside the border box and is unaffected by
what the component contains. An inset ring shares pixels with content and
inherits every failure mode of that content — broken images, overflow, z-index,
lazy loading, CMS-supplied media.

An earlier inset variant drew its band with `box-shadow: inset`, which paints
*beneath* child content. Its only consumer wrapped `<Image fill>`, so the band
rendered zero pixels behind an opaque photograph — and measured clean, because
the remote image happened not to load in the test environment.

## Self-test

`await focusRingAudit.selfTest()` runs three synthetic controls. Each has caught
a real defect in this script:

| case | expected | what it caught |
|---|---|---|
| `invisible` | `INVISIBLE-2.4.7` | best-of-band scoring reporting 14.55:1 on an invisible ring |
| `insideScoring` | `pass` | a detector that only understood outside-scoring would false-positive here |
| `rescueNegative` | `UNSCORABLE…` | the rescue rule ran 148 controls without its negative branch ever firing |

`results.ok === true` means all three behaved. **Re-run this after touching the
scoring or rescue logic** — the rescue negative in particular, since a rule that
never returns its negative verdict is permissive rather than validated.

## Fail closed — the invariant

Any check added to this script must resolve unknowns toward **"cannot rescue"**,
never toward "safe". Two defects here came from the same violation of that rule,
and they do not look related:

| what | where it bit |
|---|---|
| An `rgb()` regex silently dropped `lab()` colours | the hero scrim vanished from the surface calculation, hiding a Level A defect |
| A guard checked only `background: transparent`, not the whole class of surface-inherited values | the rescue rule ran 148 controls without its negative branch ever firing |

The first is *measurement*, the second is *dependency analysis*. "Sample
pixels, not tokens" is the lesson for both, and applying it to one did not
immunise the other. A value is only safe to treat as independent if it resolves
to a literal colour with alpha exactly 1, from a chain with no ancestor
`opacity`, `mix-blend-mode`, `filter`, or `backdrop-filter`.

## Known gaps

- **Forced-colors mode is not covered.** Dropping `box-shadow` reproduces one
  effect of that mode, not the mode. Needs a DevTools `forced-colors: active`
  pass, checking that a ring is present, that it renders in a system colour, and
  that the hero still gives it a background it contrasts against.
- **Resting-state control visibility is not covered.** In forced colors the
  CTAs' own backgrounds collapse to one system fill, and borderless
  `<a>`-styled-as-button controls may become invisible *as controls* — SC 1.4.11
  on the resting state, independent of the focus ring.
- This checks one convention. It is not a site accessibility audit, and nothing
  from it supports an accessibility statement, a VPAT, or a "WCAG 2.2 AA" claim.
