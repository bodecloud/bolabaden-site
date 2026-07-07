# Site cohesion requirements

**Date:** 2026-06-29  
**Status:** Implemented (2026-06-29); original pass + follow-up + third pass (see [next ideas](./2026-06-29-next-ideas.md))

## Problem

The site reads as halfway between a portfolio (`/about`) and a discovery hub (home, projects, guides, dashboard). Discovery routes mixed chrome (duplicate nav on home, portfolio-styled 404, dashboard missing its main UI) and hurt visual consistency.

## Product shape (kept)

Two intentional contexts:

| Context | Routes | Chrome |
|---------|--------|--------|
| Portfolio | `/about` | About navigation, portfolio footer, blue tokens |
| Discovery hub | `/`, `/projects`, `/guides`, `/dashboard`, `/contact` | `PageLayout` — neutral dark, emerald accent |

No merge into a single chrome in this pass.

## Success criteria

- Discovery routes share `PageLayout`, nav, and footer.
- Home sections respect `HOME_LAYOUT_SECTIONS` toggles; explore lanes visible by default.
- Dashboard page shows live status UI, not embeds only.
- 404 uses discovery styling, not portfolio glass/gradients.
- Build succeeds after changes.

## In scope (cohesion pass — completed)

- Wire home through `PageLayout` with config-gated sections.
- Wire dashboard to `Dashboard` component with shared page hero.
- Align `not-found` with discovery theme.
- Enable `explore-lanes` by default in config.

## Out of scope / deferred

- Collapsing dual chrome into one theme.
- Visual redesign of `/about` portfolio sections (see [next ideas](./2026-06-29-next-ideas.md)).

## Completed follow-up (2026-06-29)

- [x] `.env.example` and README sync (Next 16, dual chrome).
- [x] Full home section builder wiring (`home-hub`, `future-blocks`, ordered sections).
- [x] Dashboard embeds toggle (`NEXT_PUBLIC_DASHBOARD_EMBEDS_ENABLED`, default on).
- [x] Discovery-themed `global-error.tsx`.
- [x] Removed unused `GET /api/containers`.

Third-pass delivery (SideToc, discovery heroes, OG palette, guide prev/next, etc.) is tracked in [next ideas](./2026-06-29-next-ideas.md).

## Assumptions

- Visitors who land on 404 should stay in discovery hub paths (home, dashboard, guides).
- Demo/fallback data remains acceptable without `.env.local`.

## Resolved questions

- Dashboard embeds: `NEXT_PUBLIC_DASHBOARD_EMBEDS_ENABLED`, default on; embeds section below status UI.
- Default `home-hub`: `enabled: true` in `HOME_LAYOUT_SECTIONS` defaults (override via `NEXT_PUBLIC_HOME_LAYOUT_SECTIONS_JSON`).

## Outstanding questions

- Whether home hero copy should emphasize portfolio vs infrastructure discovery more strongly (partially addressed: tertiary “Full portfolio” CTA).
