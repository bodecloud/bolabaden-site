# Next ideas (post-cohesion)

**Date:** 2026-06-29  
**Context:** After discovery-hub cohesion pass ([requirements](./2026-06-29-site-cohesion-requirements.md))

## Implemented in follow-up pass

- Home page respects full `HOME_LAYOUT_SECTIONS` order (showcase → embeds → hub → explore → future)
- `home-hub` and `future-blocks` section components wired
- Hero adds “Full portfolio” → `/about` (discovery + portfolio bridge)
- `NEXT_PUBLIC_DASHBOARD_EMBEDS_ENABLED` toggles dashboard iframe
- `global-error.tsx` aligned with discovery styling (no portfolio glass/motion)
- Removed unused `GET /api/containers` (superseded by `/api/services`)
- Added `.env.example` and README sync (Next 16, dual chrome)

## Implemented in third pass (2026-06-29)

- **Side TOC on home** — `SideToc` when 2+ enabled sections; explore id `explore-lanes`
- **Shared page hero** — `DiscoveryPageHero` on home, dashboard, guides index, contact
- **Showcase subtitle spacing** — margin only when subtitle present
- **OG discovery palette** — `og-discovery-styles.ts` wired to all discovery OG routes (`/about` stays portfolio blue)
- **About hub strip** — `AboutHubStrip` with discovery card rhythm, portfolio palette
- **`home-hub` default on** — config default `enabled: true`
- **Showcase dashboard tile** — `showcase-dashboard` → `/dashboard#services-table`
- **Projects empty/rate-limit state** — `GITHUB_TOKEN` hint + link to `/about#projects`
- **Guide prev/next footer** — sequential nav on `/guides/[slug]`
- **Service row anchors** — `#services-table`, `#service-{id}` on dashboard
- **Guide sticky TOC** — `extractMarkdownHeadings` + `SideToc` when 3+ h2 headings
- **Dashboard hash scroll** — `HashScroll` for `#services-table` / `#service-*` deep links
- **Contact hero dedupe** — page hero + slim `ContactSection`

## Implemented in medium-effort pass (2026-06-29)

- **Projects page hero** — `DiscoveryPageHero` on `/projects`; `ProjectsSection showHeader={false}`
- **Contact copy in config** — `NEXT_PUBLIC_CONTACT_HERO_TITLE` / `config.CONTACT_HERO_TITLE`

## Medium effort (remaining)

1. **Guide reading experience** — inline “On this page” list above fold on mobile (SideToc is timeline-only) → see [discovery backlog](./2026-06-29-discovery-backlog-requirements.md) P1

## Larger bets (product)

Tracked in [discovery backlog requirements](./2026-06-29-discovery-backlog-requirements.md) (P2–P5, prioritized).

## Explicit non-goals (for now)

- Collapsing portfolio and discovery into one nav model
- Replacing iframe embeds with full in-app UIs
- Database or auth layer

## Resolved questions

- **Default `home-hub`:** enabled in config defaults (about still shows top 3 hub cards always)
- **Showcase fifth tile:** `showcase-dashboard` added → `/dashboard#services-table`
- **Contact hero title:** `NEXT_PUBLIC_CONTACT_HERO_TITLE` separate from page metadata title
- **Projects hero:** page-level `DiscoveryPageHero` with config titles; section header suppressed on `/projects`

## Open questions

- Should `/projects` gain SideToc for long contribution lists (needs anchored sections first)?
