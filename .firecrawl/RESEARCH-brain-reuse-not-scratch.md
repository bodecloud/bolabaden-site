# Research: reuse existing tools (not scratch) — 2026-07-18

Sources: `tvly search` + `tvly extract` after clifwrap capacity fix.
Firecrawl: **0 credits** — correctly deferred at cost floor 2 (search).

## clifwrap fix (shipped)

- **Bug:** `providers.toml` had Tavily `search=25` + `reserve_threshold=25` → required **50** credits before any search (copy-paste from crawl-scale costs). Real Tavily basic search = **1** credit.
- **Fix:** correct costs; soft-reserve admission (prefer cost+reserve, allow ≥ cost).
- **PR:** https://github.com/oldrepublicwizard/clifwrap/pull/7 (merged)
- Reinstalled via `pipx install git+https://github.com/oldrepublicwizard/clifwrap.git@main`

## Tier 1 — Prefer these instead of custom IR/adapters

| Role | Project | Why |
|------|---------|-----|
| **Chat export warehouse** | [1ch1n/mychatarchive](https://github.com/1ch1n/mychatarchive) | Local SQLite + FTS5 + sqlite-vec; imports ChatGPT/Claude/Grok; parsers extensible (roadmap: Perplexity); SHA1 dedup; MCP `search_brain`; groups for lane scoping. **AGPL-3.0** — check license fit. |
| **Temporal KG / auto graph** | [getzep/graphiti](https://github.com/getzep/graphiti) | Official `EpisodeType.message` (`speaker: text`), `reference_time`, `add_episode_bulk`, custom entity types. Best LongMemEval among compared OSS (Particula 2026). |
| **Typed ECL graph (alt)** | [topoteretes/cognee](https://github.com/topoteretes/cognee) | remember/recall; heterogeneous ingest; can run on Postgres-only. Heavier; needs LLM key. |

## Tier 2 — Memory services (not export unifiers)

- **Mem0** — fast personalization; weak temporal invalidation vs Graphiti.
- **Letta** — full agent OS / self-managed memory; more runtime than archive.
- **Zep** — managed Graphiti wrapper.

## Implication for bolabaden brain

**Do not hand-roll Discord→JSONL adapters as the product.** Prefer:

1. **MyChatArchive** (or fork + DiscordChatExporter parser) as the lossless archive / IR.
2. **Graphiti** as the automatic relation/pattern layer fed from archive exports or message episodes.
3. Thin wrappers only: Discord parser plugin, lane tags (voice vs knowledge), overlays, twin gate.

Discord is not in MyChatArchive today — add a parser module (their documented extension point) rather than a parallel warehouse.

## Artifacts

- `.firecrawl/tvly-brain-kg.json`
- `.firecrawl/tvly-chat-unifier.json`
- `.firecrawl/tvly-graphiti-ingest.json`
- `.firecrawl/tvly-alt-memory.json`
- `.firecrawl/tvly-extract-brain-tools.md`
