# Send Network Iowa — Project Reference

Working documentation for AI team members picking up this project cold.

---

## Project Overview

- **Name:** Send Network Iowa
- **Live URL:** https://sendnetworkiowa.vercel.app
- **GitHub:** https://github.com/mheerema/send-network-iowa
- **Owner:** Matt Heerema, Assistant Director, Send Network Iowa (NAMB)
- **Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, next/font
- **Fonts:** Montserrat (sans), Libre Baskerville (serif) — loaded via `next/font/google` globally
- **Deployment:** Vercel via GitHub integration — push to `main` = production deploy

---

## Deployment Rule

**Do NOT run `vercel --prod`.**
Push to `main` on GitHub. Vercel deploys automatically.

---

## Brand Tokens

| Token | Value |
|---|---|
| `brand-navy` | `#10294c` |
| `brand-amber` | `#fbac33` |

**One Day event gradient** (used on `/events/one-day` only):
```
linear-gradient(150deg, #f7931e 0%, #00a99d 42%, #1e2d6e 100%)
```

**One Day display font:** Barlow Condensed ExtraBold — imported via `next/font/google` on the one-day page only, not globally.

---

## Site Structure

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/plant` | For church planters; includes BCI Partnership funding section |
| `/partner` | For partnering churches; tier overview + link to sendnetwork.com/send/ |
| `/events` | Iowa events list; One Day featured + Sending Labs + Residency Builder |
| `/events/one-day` | Standalone event landing page (One Day, Aug 28 2026) |
| `/iowa` | Exists in filesystem; not in nav — awaiting real data |
| `/contact` | Contact page |

---

## Key Components

- `NavHeader.tsx` — site navigation
- `TalkCTA.tsx` — inline CTA component; removed from most pages as of 2026-05-21 session
- `ChurchPathwayLadder.tsx` — homepage component
- `HeroPathwaySplit.tsx` — homepage component
- `PathwaySteps.tsx` — homepage component

---

## Public Assets

```
/public/images/brand/              — SNI logo files
/public/images/speakers/           — tony-merida.jpg, brian-croft.jpg
/public/images/sending-lab-adel/   — event photos
/public/images/sending-lab-espanol/ — event photos
/public/images/namb-ev-training/   — event photos
```

Speaker image sources (for attribution/replacement reference):
- `tony-merida.jpg` — sourced from grimkeseminary.org
- `brian-croft.jpg` — sourced from practicalshepherding.com

---

## Design Conventions

- **Section padding:** `py-20` or `py-24`
- **Rounded corners:** `rounded-2xl`
- **CTA buttons:** `rounded-full`; amber fill or navy outline
- **Label text** (above headings): `text-xs font-semibold uppercase tracking-widest text-brand-amber`
- **Max content width:** `max-w-6xl` (wide layouts), `max-w-3xl` / `max-w-4xl` (narrow/text-heavy)

---

## One Day Event (Aug 28, 2026)

- **Location:** First Family Church, 317 SE Magazine Rd, Ankeny, IA 50021
- **Registration:** https://web.cvent.com/event/65de6a21-94e2-4911-b20a-9218e3e9481b/summary

**Speakers:**
- Tony Merida — Preaching track
- Brian Croft — Pastoring track

**Afternoon tracks:**
- Preaching — Tony Merida
- Pastoring — Brian Croft
- Women — Kari Minter
- Hispanics — David Martinez & Israel Becerra

**Schedule:**
- 8:30 — Registration
- 9:00 — Worship
- Two morning sessions
- 11:30 — Lunch
- 12:30 — Afternoon tracks
- 2:30 — Closing
- 3:00 — Dismissal

**Resources:**
- Promo playbook: https://cdn.namb.net/files/send_network/OneDay/2026/Promote/Promo_Playbook.pdf
- Field leader guide: https://www.sendnetwork.com/send-network-gathering-field-leader-guide/#plan

---

## Other Iowa Events

| Event | Date | Location |
|---|---|---|
| Sending Lab Ankeny | Sep 14, 2026 | First Family Church, Ankeny |
| Sending Lab Davenport | Oct 5, 2026 | Coram Deo Bible Church, Davenport |
| Residency Builder Ankeny | Dec 1–2, 2026 | First Family Church, Ankeny |

Cvent registration links for Sending Labs are in `app/events/page.tsx`.
