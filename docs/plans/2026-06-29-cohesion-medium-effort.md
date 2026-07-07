---
type: feat
origin: docs/brainstorms/2026-06-29-next-ideas.md
status: ready
---

# Cohesion medium-effort polish

## Problem

Discovery routes share `PageLayout` and heroes, but `/projects` and contact copy still diverge from the pattern established on dashboard and guides. Requirements doc is stale relative to shipped code and `next-ideas.md`.

## Scope

**In:** Projects page hero, contact hero config, requirements doc sync, remove stale `build_output.txt`, bootstrap `STRATEGY.md`.

**Out:** Mobile guide inline TOC, unified search, single-theme merge.

## Implementation units

### U1 — Sync requirements doc

**Goal:** Align `docs/brainstorms/2026-06-29-site-cohesion-requirements.md` with code and companion backlog.

**Files:** `docs/brainstorms/2026-06-29-site-cohesion-requirements.md`

**Approach:** Mark follow-up complete; move resolved questions; fix `home-hub` default; link third pass to next-ideas.

**Verification:** No contradictory "still off" or open follow-up bullets for shipped work.

### U2 — Projects discovery hero

**Goal:** Match dashboard pattern on `/projects`.

**Files:** `src/app/projects/page.tsx`, `src/components/projects-section.tsx`

**Approach:** Add `DiscoveryPageHero` with `PROJECTS_PAGE_*` config; add `showHeader={false}` on `ProjectsSection`.

**Verification:** Single h1 on page; filters and list unchanged.

### U3 — Contact hero title in config

**Goal:** Centralize contact hero headline.

**Files:** `src/lib/config.ts`, `src/app/contact/page.tsx`, `.env.example`

**Approach:** Add `CONTACT_HERO_TITLE` via `NEXT_PUBLIC_CONTACT_HERO_TITLE`, default `"Get in touch"`.

**Verification:** Contact page imports hero title from config only.

### U4 — Remove stale build artifact

**Files:** `build_output.txt` (delete)

**Verification:** File absent; no references in repo.

## Key decisions

- Projects hero uses `PROJECTS_PAGE_TITLE` / `DESCRIPTION` (not hardcoded "Contributions & Gists") for nav/metadata alignment.
- Strategy doc bootstrapped from README + cohesion docs; full `ce-strategy` interview deferred.

## Risks

- Terminology "Projects" vs "Contributions" remains in nav vs about portfolio — acceptable dual context.
