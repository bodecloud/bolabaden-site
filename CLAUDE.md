# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000 (Turbopack)
npm run build    # production build (standalone output via Turbopack)
npm run start    # run the production build
npm run lint     # eslint . --max-warnings=0
```

There is no test runner configured (no Jest/Vitest/Playwright config) — verify changes via `npm run lint`, `npm run build`, and manual checks in the dev server.

`NODE_ENV=production` in the shell environment makes `npm install` skip devDependencies (which include `eslint`, `typescript`, `tailwindcss`). If installs look incomplete, reinstall with `unset NODE_ENV && npm install`.

## Architecture

Single Next.js 16 (App Router, React 19, TypeScript, Tailwind CSS v4) portfolio/discovery site. No database; all external integrations (GitHub API, SearXNG, Docker socket proxy, Prometheus) degrade to fallback/demo data when unreachable, so the app runs with zero `.env.local` configuration.

### Dual chrome model

The site renders two distinct experiences from one codebase:

| Context | Routes | Chrome |
|---|---|---|
| Discovery hub | `/`, `/projects`, `/guides`, `/dashboard`, `/contact`, `/search`, 404 | `src/components/page-layout.tsx` (`PageLayout`) — dark background, emerald accent |
| Portfolio | `/about` (default) | `AboutNavigation` + portfolio footer, blue tokens |

`NEXT_PUBLIC_CHROME_MODE=discovery` wraps `/about` in `PageLayout` instead (same section builder/copy, portfolio OG metadata unchanged). Default is `dual`.

### Config-driven pages, not hardcoded markup

`src/lib/config.ts` (~900 lines) is the single source of truth for env-driven copy, feature flags, and page layout. Both home and about pages are built from ordered section lists (`HOME_LAYOUT_SECTIONS`, `ABOUT_LAYOUT_SECTIONS`) that can be reordered, hidden, or relabeled entirely via `NEXT_PUBLIC_*_LAYOUT_SECTIONS_JSON` env vars, without code changes. When adding a new home/about section, wire it through this config pattern rather than hardcoding it into the page component. See `.env.example` for the full set of override vars.

### Static export vs standalone

`next.config.ts` branches heavily on `DEPLOY_TARGET=github-pages`:
- Normal builds: `output: "standalone"`, includes `src/app/api` routes; `/` is `src/app/page.tsx`.
- GitHub Pages builds: `output: "export"`, sets `NEXT_PUBLIC_STATIC_EXPORT=true`, strips `src/app/api` (no server routes on static hosting — e.g. `/search` falls back to an external SearXNG link instead of live results), applies `basePath`/`assetPrefix` from `NEXT_PUBLIC_PAGES_BASE_PATH`.

Keep this in mind when touching anything under `src/app/api/` — it must have a non-server fallback path for the static export build.

### API routes (`src/app/api/`)

Route handlers proxy/aggregate external services with fallback data baked in: `github/` (profile, releases, skills), `projects/` (auto-discover, enhanced, intelligence), `searx/` (search + results), `services/`, `guides/`, `containers/`, `boden/` (chat + health, backed by the optional `services/bodenai` twin), `error/[status]/`.

### Guides

Guides are markdown, either bundled in `src/content/guides/*.md` or loaded from an external `GUIDES_DIR` mount (e.g. for Docker deployments) — see `src/lib/guides.ts`.

### Optional private services (off git)

- `scripts/brain` + `services/brain`: normalizes Discord/ChatGPT/Perplexity exports into `$BRAIN_DATA_ROOT`, off git, disabled by default.
- `services/bodenai`: chat twin consuming brain search, disabled by default.
- `docs/solutions/` (if present): documented past bugs/patterns with YAML frontmatter (`module`, `tags`, `problem_type`) — check when implementing or debugging in an area that may already have a documented solution.

### Lint config

`eslint.config.mjs` is a flat config built on `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` (no `FlatCompat` shim — removed to fix a circular-reference issue under ESLint 9/10 + Next 16). Notable local rule: inline `style={}` JSX attributes are banned except on `opengraph-image.tsx` files (which need `ImageResponse` inline styles).

## Deployment

`docker-compose.override.yml` documents Traefik labels and env passthrough (`DOCKER_PROXY_URL`, SearXNG vars, etc.) for the containerized deployment target.
