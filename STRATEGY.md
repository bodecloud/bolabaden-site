---
name: bolabaden.org
last_updated: 2026-06-29
---

# bolabaden.org Strategy

## Target problem

Visitors need one place to discover live infrastructure, guides, and open-source work, while hiring managers and collaborators still expect a focused portfolio story. A single generic homepage cannot serve both without feeling muddled or duplicative.

## Our approach

Run two intentional chrome contexts on one site: a **discovery hub** (neutral dark, emerald accent, operational tools) and a **portfolio** on `/about` (blue glass, narrative CV). Share config and content sources; do not merge themes until there is a clear product reason.

## Who it's for

**Primary:** Operators and curious developers — they use the discovery hub to check service status, read guides, and browse ranked GitHub activity without signing in.

**Secondary:** Recruiters and peers — they land on `/about` for a curated portfolio narrative and contact path.

## Key metrics

- **Discovery route engagement** — repeat visits to `/`, `/dashboard`, `/guides` (analytics when wired; manual observation until then)
- **Dashboard freshness** — services API success rate and time-since-last-refresh on `/dashboard`
- **GitHub data quality** — share of project views backed by live API vs fallback when `GITHUB_TOKEN` absent
- **Build health** — `npm run build` succeeds on default env (zero `.env.local`)

## Tracks

### Discovery hub cohesion

Keep discovery routes on `PageLayout`, shared heroes, and config-driven section builders so new lanes ship without one-off page layouts.

_Why it serves the approach:_ Reinforces the site as an operational front door, not a brochure.

### Portfolio depth on `/about`

Maintain a distinct portfolio experience with about-specific sections and cross-links back to discovery tools.

_Why it serves the approach:_ Preserves the hiring narrative without diluting the hub.

### Config-first content

Extend `src/lib/config.ts` and JSON env overrides for copy, section order, and toggles before adding hardcoded UI.

_Why it serves the approach:_ Lets the same codebase serve demo, staging, and production personas.

## Not working on

- Collapsing dual chrome into one theme
- Auth, accounts, or write paths on public discovery routes
- Unified cross-site search (until a concrete backend exists)

## Marketing

**One-liner:** Personal discovery hub for self-hosted infrastructure, guides, and open-source work — with a separate portfolio for the human behind it.

**Key message:** Live status and playbooks first; curated story on `/about` when you want the résumé view.
