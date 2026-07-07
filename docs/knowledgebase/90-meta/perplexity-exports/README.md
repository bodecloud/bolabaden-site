# Perplexity thread exports

Infrastructure-related Perplexity library threads, exported to markdown for the knowledge base.

## Layout

| Path | Purpose |
| --- | --- |
| `conversations/*.md` | Full thread transcripts (user queries + assistant answers + sources) |
| `index.md` | Generated index of exported threads |
| `../chatgpt-exports/` | Sibling ChatGPT exports (same topic area) |

## How exports are produced

Uses **Patchright** with a persistent browser profile and Perplexity’s internal REST API (protocol 2.18). Unlike the ChatGPT exporter, this does **not** scrape the UI thread-by-thread — it batch-fetches thread JSON in parallel (default **8 concurrent** requests), so exports are much faster.

### 1. Discover matching threads

Searches your Perplexity library for each keyword in `scripts/perplexity-keywords.json` (SPOF, load balance, HA, Docker, Nomad, Kubernetes, GlusterFS, CephFS, etc.).

```bash
DISPLAY=:0 node scripts/discover-perplexity-threads.mjs
```

Optional full-library scan with client-side keyword filter:

```bash
DISPLAY=:0 node scripts/discover-perplexity-threads.mjs --full-scan
```

Writes `scripts/perplexity-thread-manifest.json` (gitignored).

### 2. Export to markdown

```bash
DISPLAY=:0 node scripts/extract-perplexity-conversations.mjs --resume
```

Discover + export in one step:

```bash
DISPLAY=:0 node scripts/extract-perplexity-conversations.mjs --discover --resume
```

Higher concurrency (e.g. 12 parallel fetches):

```bash
DISPLAY=:0 node scripts/extract-perplexity-conversations.mjs --resume --concurrency 12
```

### Login

On first run, a Chromium window opens on `https://www.perplexity.ai/library`. If you are already signed in (saved profile), discovery/export starts immediately. Otherwise the script waits up to **2 minutes** without clicking Sign in so you can complete OAuth manually; it then proceeds as soon as a session is detected (or offers Sign in after the grace window). Profile: `scripts/.perplexity-patchright-profile/` (gitignored).

Override grace / timeout:

```bash
PERPLEXITY_LOGIN_GRACE_MS=180000 PERPLEXITY_LOGIN_TIMEOUT_MS=900000 DISPLAY=:0 node scripts/extract-perplexity-conversations.mjs --discover --resume
```

Skip login wait if session is already valid:

```bash
PERPLEXITY_EXPORT_SKIP_PROMPT=1 DISPLAY=:0 node scripts/extract-perplexity-conversations.mjs --resume
```

### Resume / status

- Progress: `scripts/perplexity-export-status.json`
- Browser log: `scripts/perplexity-browser.log`
- Re-run with `--resume` to skip completed threads

## Keywords

Edit `scripts/perplexity-keywords.json` and re-run discover before export.

## See also

- [ChatGPT exports README](../chatgpt-exports/README.md)
- [PATCHRIGHT.md](../chatgpt-exports/PATCHRIGHT.md) — shared Patchright / OAuth patterns (Perplexity does not use Cloudflare Turnstile)
