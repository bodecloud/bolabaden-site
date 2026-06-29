# bolabaden.org

Personal site for Boden Crouch — a **discovery hub** (home, projects, guides, dashboard, contact) plus a separate **portfolio** experience on `/about`. Built with Next.js App Router, TypeScript, and Tailwind CSS v4. Works with zero `.env.local`; external APIs fall back to demo/static data.

## Features

- Config-driven home and about page section builders (`HOME_LAYOUT_SECTIONS`, `ABOUT_LAYOUT_SECTIONS`)
- Dual chrome: discovery (`PageLayout`, emerald accent) vs portfolio (`/about`, blue tokens)
- Projects explorer with GitHub aggregation and fallback data
- Guides from bundled markdown or mounted `GUIDES_DIR`
- Live service dashboard and optional embeds (Research Wizard iframe)
- Dynamic error pages and SearXNG search resolver with fallback

## Tech Stack

- Next.js 16 (App Router, Turbopack build)
- React 19
- TypeScript
- Tailwind CSS v4
- Docker for production containerization

## Project Structure

```shell
.
├── src/
│   ├── app/
│   │   ├── api/              # services, github, searx, projects, error HTML
│   │   ├── about/            # Portfolio chrome (AboutNavigation + Footer)
│   │   ├── contact/
│   │   ├── dashboard/
│   │   ├── guides/
│   │   ├── projects/
│   │   ├── page.tsx          # Discovery home (PageLayout)
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── page-layout.tsx   # Discovery shell (MainNavbar + MainFooter)
│   │   └── dashboard/
│   └── lib/
│       └── config.ts         # Single source of truth for env-driven copy
├── docs/brainstorms/         # Product/requirements notes
├── .env.example
└── next.config.ts
```

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a full local install when `NODE_ENV=production` skips devDependencies:

```bash
unset NODE_ENV && npm install
```

## Configuration

1. Copy `.env.example` to `.env.local`
2. Change only the keys you want to personalize
3. Use JSON override vars (e.g. `NEXT_PUBLIC_HOME_LAYOUT_SECTIONS_JSON`) to reorder or hide sections without code edits

Central config: `src/lib/config.ts`.

### Dual chrome

| Context | Routes | Chrome |
|---------|--------|--------|
| Discovery hub | `/`, `/projects`, `/guides`, `/dashboard`, `/contact`, 404 | `PageLayout` — `#0a0a0a`, emerald accent |
| Portfolio | `/about` | `AboutNavigation`, portfolio footer, blue tokens |

### Homepage builder

`NEXT_PUBLIC_HOME_LAYOUT_SECTIONS_JSON` controls order, visibility, and labels for:

- `showcase` — quick link grid
- `embeds` — live service iframe (`NEXT_PUBLIC_HOME_EMBEDS_MODE`: `default` | `hero`)
- `home-hub` — four-card hub grid (`NEXT_PUBLIC_HOME_HUB_CARDS_JSON`)
- `explore-lanes` — directional lanes (`NEXT_PUBLIC_HOME_EXPLORE_LANES_JSON`)
- `future-blocks` — roadmap placeholders (`NEXT_PUBLIC_HOME_FUTURE_PLACEHOLDERS_JSON`)

### Dashboard

- `NEXT_PUBLIC_DASHBOARD_EMBEDS_ENABLED=false` hides the embed iframe below the status UI.

### About page builder

See `.env.example` and `NEXT_PUBLIC_ABOUT_LAYOUT_SECTIONS_JSON` in README history — same pattern as home.

## Guides as Markdown

- Bundled guides: `src/content/guides/*.md`
- Override with `GUIDES_DIR` (e.g. mount to `/app/guides` in Docker)

## Docker + Traefik

See `docker-compose.override.yml` for Traefik labels and env passthrough (`DOCKER_PROXY_URL`, SearXNG vars, etc.).

## Lint

`npm run lint` targets removed `next lint` (Next.js 16). ESLint flat config exists but may hit upstream FlatCompat issues — see `AGENTS.md`.

## License

Personal portfolio site. All rights reserved.
