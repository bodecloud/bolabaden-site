# Cyberscape

Cyberscape is a standalone Next.js computer-network game inspired by classic public network simulations and late-1980s/early-2000s workstation culture. It is not a portfolio terminal gag. It is a persistent shell world with accounts, hosts, routes, files, BBSes, archive surfaces, games, badges, root/login progression, and Windows-era desktop commands backed by server-owned state.

The project is a behavioral recreation effort, not a byte-identical clone target. Historical references, community research, Cyberscape design choices, and implemented behavior are tracked separately in the knowledgebase.

## Quick start

```bash
cd packages/cyberscape
npm install
npm run import:hosts
npm run dev
```

Open `http://localhost:3000`.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js dev server. |
| `npm run build` | Build the app. |
| `npm run start` | Start the built app. |
| `npm run lint` | Run ESLint. |
| `npm run import:hosts` | Regenerate `src/data/hosts.json` from `data/raw/np43-host-list.txt`. |
| `npm run db:push` | Apply the Drizzle schema to SQLite. |
| `npm test` | Run behavioral acceptance tests. |
| `npm run test:hydration` | Run the hydration smoke check. |
| `npm run test:constraints` | Run rendering constraint checks. |
| `npm run test:parity` | Validate the machine-checkable Cyberscape parity inventory. |

## Current implemented surface

The package currently includes:

- Server-owned shell state with NLI/login prompts, remote host stack, pager, STTY shaping, and subsystem modes.
- Account creation/login, durable badges, scores, mail, files, BASIC programs, checkpoints, and desktop preferences.
- Host graph import, hero hosts, route lookup, `hosts`, `netstat`, `uupath`, `uumap`, and transport verbs.
- Pre-LAN connection loop with deterministic phone numbers, executable acoustic-coupler attachment, persistent `phonebook add/rm` entries with line/protocol/notes, `operator <host|number>` toll setup, calling-card toll ledger rows in `accounts`/`credentials`/`modems`, `wardial` carrier and BBS/protocol hints, `dialup`, `lineage`, BBS modem handoff, exact-number alternate-line dialing, `hunt <host>` line hunting when the primary number is busy or dead, `dial <number|host>` connect/busy/no-carrier/toll-blocked outcomes, packet-switched `pad <host>` / `x25 <host>` routes with backend-derived packet-circuit state, and a non-shell `telex <host>` teleprinter path over the same packet fabric.
- Telnet-era social layer with durable `send`, live `relay` channels, direct `talk <user>` sessions across active ttys, `who`, `finger`, and `link`-based session mirroring.
- Progression commands including `wardial`, `porthack`, `rootkit`, `secure`, `takeover`, and `owned`.
- BBS menus, message boards, archive file areas, downloads, USENET reader/posting, and nested adventure/Zork runners.
- Windows-era workstation commands such as `desktop`, `theme`, `control`, `taskmgr`, `eventviewer`, `network`, `shares`, `printers`, and `registry`.

## Docs

Read the root knowledgebase docs in this order:

1. Execution spec - canonical Cyberscape behavior reference.
2. `docs/knowledgebase/50-execution/cyberscape-feature-parity-roadmap.md` - full feature parity converted into Cyberscape implementation targets.
3. Intent doc - product thesis and boundaries.
4. Domain theory - world and mechanics model.
5. Product UX - shell and desktop UX.
6. Source index - evidence registry and citation policy.

The structured parity inventory lives at `data/cyberscape-parity-inventory.json` in the repo root.

## Boundaries

Cyberscape does not currently claim real telnet/SSH daemon support, full live reference-host parity, complete period BASIC API compatibility, or complete coverage of every hidden subsystem. Those can be future systems, but they should be implemented and documented with evidence.

## Orchestrator

Sprint manifest: `.autoclaw/orchestrator/cyberscape-manifest.json`
