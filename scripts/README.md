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
indicator-against-indicator, and Understanding 1.4.11 Figure 13 grades exactly
that pattern *Fail*.

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
