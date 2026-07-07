---
module: cyberscape
tags: [cyberscape, intent, product]
problem_type: reference
---

# Cyberscape intent

Canonical reference: `docs/knowledgebase/50-execution/cyberscape-network-reference.md`.

## Thesis

Cyberscape is a standalone classic-network-inspired computer-network game. The goal is not to add a cute terminal to the bolabaden portfolio. The goal is to recreate the deeper Cyberscape product dream: a historical network museum, a persistent command-line social world, and a puzzle/progression game where hosts, files, users, privileges, archives, and old computing interfaces all matter.

The project should feel like a real system. Commands should expose state. Files should persist. Hosts should have topology. BBS and archive content should have provenance. Progress should be visible through badges, ownership, files, sessions, and scores. The Windows-era shell is part of Cyberscape's identity, but it should remain backed by server-owned world state rather than become static decoration.

## Audience

| Audience | What the docs must give them |
| --- | --- |
| Builder | A clear map of what to implement next without confusing reference facts, community lore, and Cyberscape design choices. |
| Reviewer | Evidence boundaries for claims about reference behavior and current implementation. |
| Player/tester | A mental model for why the game has hosts, BBSes, files, badges, old utilities, and desktop-era surfaces. |
| Future agent | Stable local files and verification anchors instead of ambiguous "do Cyberscape" prompts. |

## Success criteria

| Criterion | Required standard |
| --- | --- |
| World shape | Host graph, historical/archive surfaces, BBS, shell stack, and desktop surfaces behave as parts of one world. |
| Persistence | Accounts, badges, files, messages, programs, sessions, desktop state, and ownership survive API sessions where implemented. |
| Progression | Wardial, porthack, rootkit/root ownership, scores, and gates form a playable loop. |
| Source discipline | Docs separate `[OFFICIAL]`, `[OPEN]`, `[SYNTH]`, and `[IMPLEMENTED]` claims. |
| Honesty | Never claim complete source parity where public sources or local code do not prove it. |

## Non-goals for this documentation pass

- No MkDocs or docs-generator migration.
- No in-app documentation route.
- No real telnet/SSH daemon implementation.
- No claim of full 26,600+ live host parity.
- No unqualified "full reference clone" language.
- No bulk unreviewed archive mirroring in public docs or git.

## Relationship to bolabaden-site

Cyberscape lives in `packages/cyberscape` as a sibling package within the bolabaden-site repo. The main portfolio/discovery site can link to it when appropriate, but the game should be documented and reasoned about as its own system.

The documentation source of truth is the knowledgebase:

1. Start with `docs/knowledgebase/50-execution/cyberscape-network-reference.md`.
2. Use `20-domain-theory` for model details.
3. Use `30-product-ux` for shell and desktop UX expectations.
4. Use `90-meta` for sources and verification rules.
