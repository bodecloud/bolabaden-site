# AGENTS.md

## Cursor Cloud specific instructions

### Service overview

This is a single Next.js 16 (App Router) portfolio website. No database, Docker, or external services are required for local development. All external dependencies (GitHub API, SearXNG, Docker socket proxy, Prometheus) have built-in fallbacks/demo data.

### Running the application

- `npm run dev` starts the dev server on `http://localhost:3000`.
- See `README.md` for env-driven configuration; the site works with zero `.env.local` configuration.
- **Private brain** (optional): `scripts/brain` + `services/brain` normalize Discord/ChatGPT/Perplexity into `$BRAIN_DATA_ROOT` (off git). Twin (`services/bodenai`) consumes brain search; both default disabled.
- **MassiveHDD corpus** (private, off git): `$BRAIN_DATA_ROOT/massivehdd/` holds audits/transcripts for `/run/media/brunner56/MassiveHDD/Downloads/` and deferred video work. See `massivehdd/audit/downloads_inventory.json` and `massivehdd/audit/xfire_summary.json`. **All six Xfire accounts** (`th3w1zard1`, `th3w1zard3`, `sumrand0mguy`, `mast3rrchief`, `nooberpwner`, `dwmwizard`) are **Boden/Wizard identity aliases** — ingest as `role:self`, not separate people. **Video batch (14GB / 86 files in `MassiveHDD/Videos/`) is deferred** — use `ffmpeg` + local `whisper` CLI when scheduled.

### Lint

- `npm run lint` calls `eslint . --max-warnings=0` directly (the old `next lint` invocation was removed in Next.js 16). `eslint.config.mjs` is a flat config on `eslint-config-next` 16.1.6 with no `FlatCompat` shim, and runs clean — 0 errors, only a handful of pre-existing `no-unused-vars` warnings in standalone `scripts/*.mjs` archive-export tooling, unrelated to the Next app itself.

### Build

- `npm run build` works and produces a standalone build via Turbopack.

### Important caveats

- The environment's default `NODE_ENV=production` causes `npm install` to skip devDependencies. The update script unsets `NODE_ENV` before installing. If you reinstall manually, use `NODE_ENV=development npm install` or `unset NODE_ENV && npm install`.
- The `/projects` (Contributions) page shows zeros without network access to the GitHub API (rate-limited to 60 req/hr without `GITHUB_TOKEN`).
