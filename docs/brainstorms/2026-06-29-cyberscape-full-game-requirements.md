# Cyberscape Full Game - Product Requirements

**Date:** 2026-06-29  
**Status:** Approved for implementation  
**Evidence:** See the source index under `docs/knowledgebase/90-meta/`.

## Problem

Cyberscape is a browser-first retro workstation game inspired by classic ARPANET and BBS simulations. It preserves the useful command-network loops (exploration, badges, porthack, root, BBS) while moving the primary experience into a personal computer shell rather than a toy terminal in the portfolio site.

## Goals

1. **Playable workstation shell** with NLI + `@` prompts, 20+ core commands, pager/STTY semantics
2. **Host graph** seeded from np43 (~8.4k), expandable toward 26k+
3. **Persistence** — accounts, badges, host login/root state
4. **Progression** — wardial, porthack (adjacent-only), competitive root
5. **BBS hosts** with manifest-tagged archive assignment
6. **Evidence-first docs** under `docs/knowledgebase/`

## Non-goals (v1)

- Byte-identical transcripts
- Static export inside bolabaden-site GitHub Pages
- Real telnet/SSH wire protocol
- Full 26k hosts before core loops work
- Unvetted textfiles.com bulk in public git

## Success criteria

| Criterion | Measure |
|-----------|---------|
| Shell MVP | `?`, login, hosts, telnet, netstat work in browser |
| Progression | Behavioral tests pass for badge gate + porthack + root |
| Archives | manifest.json + fetch script; licensing doc |
| Deploy | Next.js app at `packages/cyberscape` builds cleanly |

## User journeys

1. **New player**: connect → NLI `.` → NEWUSER → `@` → HOSTS → TELNET → explore
2. **Hacker loop**: earn badges → WARDIAL → PORTHACK adjacent → login on host → ROOTKIT
3. **BBS**: TELNET to BBS host → BBS → F/W/Q menus

## Technical boundaries

- **Stack:** Next.js 16, SQLite + Drizzle, shadcn terminal UI
- **Location:** `packages/cyberscape` (sibling to bolabaden-site app)
- **Portfolio link:** deferred until MVP

## Risks

| Risk | Mitigation |
|------|------------|
| Archive licensing | manifest `license_class`; dev-only default |
| Telewiki drift | label [OPEN]; verify live |
| Host graph incomplete | generator + hero hosts |

## Open questions

- PostgreSQL for production vs SQLite dev-only
- When to add WebSocket `link` mirroring
- Public host bundle generation pipeline

## References

- Plan: Cyberscape Full Game (2026-06-29)
- External reference manual captured in the source index
