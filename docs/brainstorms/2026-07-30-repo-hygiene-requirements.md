---
date: 2026-07-30
topic: repo-hygiene
---

# Repo Hygiene — Requirements

## Summary

Stop new commits from carrying tooling-authorship trailers, and untrack agent configuration and planning artifacts from the public repo going forward. Split out of `docs/brainstorms/2026-07-30-command-desk-activation-requirements.md`, which it shared no goal with.

## Requirements

- R1. New commits must not carry authorship trailers referencing the tooling used to produce them.
- R2. Agent configuration files and planning artifacts must be untracked and ignored: `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.roo/`, `.kilocode/`, `blurb_conversation.md`, `docs/brainstorms/`, `docs/plans/`.
- R3. `docs/design-comparison.md` must be deleted. It documents a legacy/modern theme toggle, `design-backups/`, and `.docker-reference/`, none of which exist.

## Acceptance Examples

- AE1. **Covers R2.** Given a fresh clone after untracking, when a contributor runs `npm run dev`, then setup succeeds without the removed files.

## Scope Boundaries

### Outside this product's identity

- Rewriting published git history. Force-pushing is prohibited by standing project instructions and would not help anyone who already cloned the repository — 24 of the last 46 commits already carry Claude trailers, and that history is permanent regardless of this document.

## Dependencies / Assumptions

- A1. Untracking `AGENTS.md` and `CLAUDE.md` removes setup notes from fresh clones, including the `NODE_ENV=production` install caveat, the lint-config rationale, and the dual-chrome model description. Those notes need a home that stays tracked, or they are lost.
- A2. Untracking `docs/brainstorms/` means this document, and the command-desk-activation requirements doc it split from, stop being version-controlled once R2 lands.

## Outstanding Questions

### Deferred to planning

- Q1. Where do the `AGENTS.md`/`CLAUDE.md` setup notes live once those files are untracked?

## Sources / Research

- `docs/brainstorms/2026-07-30-command-desk-activation-requirements.md` — the document this was split from.
