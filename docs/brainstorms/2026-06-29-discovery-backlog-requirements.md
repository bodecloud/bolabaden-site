# Discovery backlog requirements

**Date:** 2026-06-29  
**Status:** Ready for planning  
**Origin:** `STRATEGY.md`, `docs/brainstorms/2026-06-29-next-ideas.md`, repo research

## Summary

Prioritized backlog for the discovery hub after the cohesion passes. Order reflects carrying cost vs strategy fit: finish reading polish, add config-only deployment options, then content liveness, then search UX, then offline notifications last (needs backend).

## Problem

Cohesion made discovery routes consistent, but mobile guide navigation, search exit to new tabs, static “future” placeholders, and optional theme forcing remain gaps. Larger bets (notifications) conflict with the no-auth, no-database posture unless scoped narrowly.

## Success criteria

- R1. Mobile guide readers see heading links above the article without losing desktop `SideToc`.
- R2. Single-theme mode is env-driven and does not merge portfolio information architecture.
- R3. At least one `future-blocks` slot can show real release activity without manual copy edits.
- R4. Search from the nav can stay on-site with results sourced from existing SearX proxy when available.
- R5. Status subscriptions are documented as a future phase with explicit backend prerequisites.

## Requirements by priority

### P1 — Mobile guide “On this page” (R1)

**Intent:** On `/guides/[slug]`, when 3+ h2 headings exist, show a compact inline list of anchor links directly under the title block on viewports where `SideToc` is timeline-only (`md` and below). Desktop (`md+`) keeps the fixed timeline `SideToc` unchanged.

**Behavior:**

- Reuse `extractMarkdownHeadings` output; do not duplicate heading parsing.
- Inline block label: “On this page” (configurable later; hardcoded acceptable for v1).
- Links scroll to the same ids `SideToc` uses.
- Hide inline block when fewer than 3 h2 headings (match existing `SideToc` gate).

**Out of scope:** Replacing `SideToc` on desktop; sticky inline TOC on mobile.

### P2 — Single-theme mode (R2)

**Intent:** Env flag (e.g. `NEXT_PUBLIC_CHROME_MODE=discovery|dual`) forces discovery `PageLayout` chrome on `/about` while keeping `/about` content sections and metadata distinct.

**Behavior:**

- Default `dual` preserves current two-context product.
- `discovery` swaps about shell to discovery nav/footer and emerald tokens; does not flatten `/about` section builder or portfolio copy.
- Document in `.env.example` and README dual-chrome table.

**Out of scope:** Merging nav models, removing portfolio section types, or auto-redirecting `/about` → `/`.

### P3 — Release notes stream (R3)

**Intent:** Replace one static `HOME_FUTURE_PLACEHOLDERS` entry with a small feed of recent releases.

**Behavior (pick one at plan time):**

- **A (preferred):** GitHub releases/tags for `GITHUB_USERNAME` repos (server fetch, cached, fallback to static list).
- **B:** RSS/Atom URL via env (generic parser, capped N items).

- Feed renders inside existing `home-future-section` or a dedicated card; max 5 items; each item: title, date, link.
- Graceful empty state: section hidden or shows static placeholders when fetch fails.

**Out of scope:** Full changelog site, comments, or write path.

### P4 — Unified search (R4)

**Intent:** Submitting nav search opens `/search?q=…` on the same site with results rendered from the existing `/api/searx/search` proxy (or config external URL fallback).

**Behavior:**

- Discovery-themed results page under `PageLayout`.
- Show query, result list (title, snippet, URL), and link to open full SearX in new tab.
- Empty/error states when SearX unreachable; reuse demo/fallback patterns from other APIs.
- GitHub Pages deploy: static export strips API — search page shows “available on Docker deploy” or external SearX link only (match existing API fallback posture).

**Out of scope:** Indexing guides/projects locally, account saved searches, embedding SearX iframe as primary UX.

### P5 — Status subscriptions (R5 — deferred phase)

**Intent:** Notify when a tracked dashboard service goes offline.

**Minimum product shape (future):**

- User picks service(s) on `/dashboard`; delivers webhook URL or email.
- Requires durable storage, auth or signed tokens, and a background poller — all absent today.

**Decision:** Record as **Phase 2 product bet**. Do not implement until backend choice is explicit. STRATEGY “not working on” stays unless this doc’s phase gate is met.

**Out of scope for v1:** Email without provider, anonymous webhooks without abuse controls.

## Scope boundaries

**In:** Items P1–P4 as incremental discovery hub improvements; P5 as specified deferral only.

**Deferred:** `/projects` SideToc (needs anchored sections first); collapsing portfolio and discovery nav.

**Outside identity:** Database, user accounts, replacing iframe embeds with full native UIs.

## Key decisions

- K1. Backlog order: P1 → P2 → P3 → P4 → P5 (user confirmed all items; agent-chosen sequence).
- K2. Single-theme is shell override, not product merge (aligns with `STRATEGY.md` not-working-on).
- K3. Unified search reuses SearX proxy; no new search backend.
- K4. Release feed prefers GitHub tags/releases over bespoke CMS.
- K5. Status subscriptions blocked on backend; not part of next implementation plan.

## Assumptions

- A1. SearX and GitHub remain optional env integrations with fallbacks.
- A2. Guide heading extraction stays h2-only for TOC (current `extractMarkdownHeadings` behavior).
- A3. ChatGPT knowledgebase exports may inform guide content but are not a runtime dependency for P1–P4.

## Outstanding questions

- Q1. Release feed: GitHub-only vs env RSS — decide in `ce-plan` based on token availability.
- Q2. Search results page: include quick filters (guides vs web) in v1 or defer?
- Q3. Single-theme: should OG images on `/about` switch to discovery palette when forced?

## Traceability

| ID | Source |
|----|--------|
| P1 | `docs/brainstorms/2026-06-29-next-ideas.md` medium-effort remaining |
| P2–P5 | `docs/brainstorms/2026-06-29-next-ideas.md` larger bets |
| Strategy | `STRATEGY.md` tracks and not-working-on |
