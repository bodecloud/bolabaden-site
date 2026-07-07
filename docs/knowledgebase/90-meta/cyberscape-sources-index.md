---
module: cyberscape
tags: [cyberscape, research, sources, provenance]
problem_type: reference
---

# Cyberscape Sources Index

Canonical reference: `docs/knowledgebase/50-execution/cyberscape-network-reference.md`.

Feature parity roadmap: `docs/knowledgebase/50-execution/cyberscape-feature-parity-roadmap.md`.

## Evidence policy

Use these labels consistently:

| Label | Definition |
| --- | --- |
| `[OFFICIAL]` | Primary historical-network source or official project surface. |
| `[OPEN]` | Community, mirrored, or unverified public material. |
| `[SYNTH]` | Cyberscape design interpretation or reconstruction decision. |
| `[IMPLEMENTED]` | Current repo behavior proven by local code, data, or tests. |

Do not promote `[OPEN]` mechanics to fact without live verification or a primary source. Do not promote `[SYNTH]` design choices to reference-authenticity claims. Do not mark behavior `[IMPLEMENTED]` unless a current repo file, test, or runtime check proves it.

## Primary Reference Sources

| Source | URL | Label | Use |
| --- | --- | --- | --- |
| reference manual | `https://telehack.com/telehack.html` | `[OFFICIAL]` | Access methods, command examples, pager behavior, host traversal, file transfer, monitor, archive context. |
| period BASIC guide | `https://telehack.com/basic.html` | `[OFFICIAL]` | BASIC syntax and Cyberscape state APIs. |
| reference privacy policy | `https://telehack.com/privacy.html` | `[OFFICIAL]` | Logging, visibility, chat/mail/process/file privacy implications. |
| Reference foundation | `https://github.com/telehack-foundation` | `[OFFICIAL]` | Stewardship and public project identity; not source-code parity. |
| Andy Baio interview with `forbin` | Public interview | `[OFFICIAL]` as direct creator interview | Origin, implementation history, archive philosophy, hidden-content intent. |

## Local captures and data

| File | Label | Use |
| --- | --- | --- |
| `data/raw/classic-network-manual.html.txt` | `[OFFICIAL]` capture | Durable local copy of official manual text. |
| `data/raw/np43-host-list.txt` | `[OPEN]` | Host-list seed for import pipeline. |
| `data/raw/jkirchartz-bbs-research.txt` | `[OPEN]` | BBS mapping notes and historical BBS clues. |
| `data/raw/telehack-utils-readme.md` | `[OPEN]` | Community tooling reference. |
| `data/archive-manifest.json` | `[SYNTH]`/`[IMPLEMENTED]` | Curated archive assignment manifest. |
| `data/archive-manifest.schema.json` | `[IMPLEMENTED]` | Manifest shape. |

## Implementation anchors

| Area | File |
| --- | --- |
| Package scripts/dependencies | `packages/cyberscape/package.json` |
| Command registry and gates | `packages/cyberscape/src/lib/shell/commands.ts` |
| Shell execution | `packages/cyberscape/src/lib/shell/engine.ts` |
| Session/state types | `packages/cyberscape/src/lib/shell/types.ts` |
| Pager | `packages/cyberscape/src/lib/shell/pager.ts` |
| STTY | `packages/cyberscape/src/lib/shell/stty.ts` |
| Host graph | `packages/cyberscape/src/lib/net/hosts.ts` |
| Hero hosts | `packages/cyberscape/src/lib/net/hero-hosts.ts` |
| Progression | `packages/cyberscape/src/lib/progression/engine.ts` |
| BBS/archive | `packages/cyberscape/src/lib/bbs` |
| Acceptance coverage | `packages/cyberscape/tests/acceptance.test.ts` |

## Parity documentation

| File | Use |
| --- | --- |
| `docs/knowledgebase/50-execution/cyberscape-network-reference.md` | Canonical narrative reference and evidence model. |
| `docs/knowledgebase/50-execution/cyberscape-feature-parity-roadmap.md` | Feature-by-feature parity conversion map and implementation backlog. |
| `data/cyberscape-parity-inventory.json` | Machine-checkable parity inventory used by `npm run test:parity`. |
| `data/cyberscape-parity-inventory.schema.json` | Schema contract for the parity inventory. |

## Known gaps

| Gap | Why it remains open |
| --- | --- |
| Full live reference source | Public official GitHub does not expose the server implementation. |
| Full 26,600+ host graph | Primary public dump is not available. |
| Current live command corpus | Old manual is incomplete relative to live service; in-game `HELP` remains authoritative. |
| Hidden hosts/puzzles | Some discovery is intentionally in-world and spoiler-sensitive. |
| Race/dojo/Telefrag/admin details | Public/community-visible, but not fully primary-source documented here. |
| Complete TeleBASIC parity | Requires deliberate API-by-API implementation and tests. |

## Capture log

| Date | Action |
| --- | --- |
| 2026-06-29 | Ingested official manual capture and open host/BBS utility references into `data/raw`. |
| 2026-06-29 | Created first Cyberscape KB index and domain docs. |
| 2026-06-30 | Reframed docs around canonical reference plus derivative KB files. |
| 2026-06-30 | Added Cyberscape feature parity roadmap to convert full historical-network parity into source-bounded Cyberscape implementation targets. |
| 2026-06-30 | Added machine-checkable parity inventory and package validation script. |
