---
module: cyberscape
tags: [cyberscape, mechanics, domain]
problem_type: reference
---

# Cyberscape domain model

Canonical reference: `docs/knowledgebase/50-execution/cyberscape-network-reference.md`.

Feature parity roadmap: `docs/knowledgebase/50-execution/cyberscape-feature-parity-roadmap.md`.

## Core model

Cyberscape should be modeled as a persistent network world, not as a list of terminal commands.

| Layer | Responsibility | Current evidence |
| --- | --- | --- |
| Client | Browser terminal, desktop shell, plain terminal route. | `packages/cyberscape/src/app`, `packages/cyberscape/src/components/terminal`. |
| Session | Prompt, login identity, current host, shell stack, subsystem mode, pager, STTY, desktop state. | `packages/cyberscape/src/lib/shell/types.ts`, `engine.ts`, `pager.ts`, `stty.ts`. |
| Host graph | Hosts, neighbors, routes, hero systems, login/root ownership markers. | `packages/cyberscape/src/lib/net`. |
| Persistence | Accounts, badges, files, messages, checkpoints, desktop preferences. | `packages/cyberscape/src/lib/db`, acceptance tests. |
| Progression | Badge gates, wardial, porthack, rootkit/root ownership, scores. | `packages/cyberscape/src/lib/progression/engine.ts`. |
| Archives/BBS | Boards, posts, file areas, archive assignments, USENET/games. | `packages/cyberscape/src/lib/bbs`, `data/archive-manifest.json`. |
| Workstation shell | Windows-era app metaphors backed by server state. | Desktop command handlers and acceptance tests. |

## Host graph semantics

[OFFICIAL] The reference uses an adjacency graph. `NETSTAT` is not just decorative output; it defines what the user can reach from the current host.

[SYNTH] Cyberscape should preserve these invariants:

- A host has identity, display metadata, reachable neighbors, services, files, and possible BBS/archive behavior.
- Traversal changes current context and should affect file, route, and privilege behavior.
- Porthack-style access must care about adjacency.
- Root-style access must be distinct from login-style access.
- Host state should be inspectable by both terminal and desktop-era commands.

## Privilege layers

| Layer | Meaning | Status |
| --- | --- | --- |
| Account | A persistent player identity. | Implemented. |
| Host login | User can authenticate/use a host. | Implemented through porthack-style state. |
| Root | User controls host at a higher privilege level. | Implemented through rootkit/secure/takeover style state. |
| BBS/sysop | User owns or administers BBS behavior. | Partially represented; full sysop economy is open. |
| Satellite/admin | Higher live reference privilege family visible in public sources. | Not claimed as implemented. |

## Progression rules

Progression should be durable, inspectable, and tied to world actions.

| Mechanic | Required behavior |
| --- | --- |
| Badges | Unlock or reflect meaningful actions; may gate commands. |
| Scores | Summarize durable state, not just session-local counters. |
| Porthack | Reject non-adjacent targets; produce login-style access on success. |
| Wardial | Reveal or reinforce graph discovery. |
| Rootkit | Escalate beyond login; model ownership/competition honestly. |
| Files | Downloads and user-created files should persist and matter. |
| BBS/USENET | Reading/posting/downloading should affect durable world state where implemented. |

## Implementation-status rule

Every future mechanics doc should answer four questions before claiming a feature:

1. What reference source supports the mechanic?
2. Is the support official, open/community, or inferred?
3. What Cyberscape file implements it?
4. What test or runtime check proves it?

## Parity conversion rule

When a reference feature does not directly map to Cyberscape, convert its role rather than copying its surface blindly.

| Reference feature type | Conversion question |
| --- | --- |
| Network protocol | Does Cyberscape need a real external server or an in-world command/protocol adapter first? |
| Historical data | Is the source public, redistributable, and provenance-tracked? |
| Hidden puzzle | Can the system be tested without documenting the full solution path? |
| Social feature | What is visible, logged, private, and persistent? |
| Progression mechanic | What durable state changes, and how does the player inspect it? |
| Desktop reinterpretation | Which backend state does the Windows-era view expose? |
