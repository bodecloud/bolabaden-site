---
module: cyberscape
tags: [historical-network, cyberscape, parity, roadmap, execution]
problem_type: reference
---

# Cyberscape feature parity roadmap

Canonical reference: `docs/knowledgebase/50-execution/cyberscape-network-reference.md`.

This document converts "full historical-network feature parity" into a Cyberscape-compatible target. It does not mean byte-identical transcripts, hidden spoiler dumps, or a claim that private reference server internals are knowable. It means every major public reference capability should have one of these outcomes:

1. A Cyberscape implementation that preserves the player-facing purpose.
2. A documented Cyberscape-native reinterpretation when literal copying would be wrong, unavailable, or less useful.
3. A clearly marked gap with source basis, implementation target, and proof needed.

The machine-checkable inventory for this roadmap is `data/cyberscape-parity-inventory.json`, with schema notes in `data/cyberscape-parity-inventory.schema.json`. Validate it with `npm run test:parity` from `packages/cyberscape`.

## Inventory index

These IDs are the stable handles used by the machine-checkable inventory:

| ID | Category | Capability |
| --- | --- | --- |
| `web-shell` | Access and transport | Browser shell and desktop access. |
| `plain-terminal` | Access and transport | Plain terminal route. |
| `real-wire-protocols` | Access and transport | External telnet/rlogin/SSH/FTP/Gopher/Finger/QOTD adapters. |
| `dialup-phone-loop` | Access and transport | In-world phone numbers, modem rows, and `dial <number\|host>` traversal. |
| `packet-pad-routing` | Access and transport | In-world PAD/X.25 packet-switch access over visible multi-hop routes. |
| `remote-shell-stack` | Shell ergonomics | Host traversal and shell stack. |
| `pager-pipes-stty` | Shell ergonomics | Pager, pipes, and terminal modes. |
| `tab-completion-controls` | Shell ergonomics | Completion and control-key behavior. |
| `command-corpus` | Command corpus | Official/live/community/Cyberscape command matrix. |
| `desktop-command-layer` | Command corpus | Backend-derived Windows-era command layer. |
| `host-graph` | Host network | Host graph, routes, services, and ownership markers. |
| `host-occupants-finger` | Host network | Remote host occupants and `finger @host`. |
| `filesystem-archive` | Files, archives, and BBS | Host/user files, FTP, archives, and provenance. |
| `bbs-usenet-gopher` | Files, archives, and BBS | BBS, USENET, Gopher, boards, and file areas. |
| `bbs-sysop` | Files, archives, and BBS | Player-owned/administered BBS systems. |
| `badge-progression` | Progression and ownership | Badges, gates, scores, and durable progress. |
| `wardial-porthack-rootkit` | Progression and ownership | Graph discovery, login ownership, and root escalation. |
| `advanced-privilege-layers` | Progression and ownership | Sysop/admin/satellite/challenge families. |
| `social-world` | Social and multiplayer | Users, who, finger, mail, relay/talk, link, sessions. |
| `basic-programmability` | period BASIC and programmability | BASIC plus world-state APIs. |
| `games-emulators` | Games and amusements | IF, Z-code, BASIC library, interpreters, and toys. |
| `hidden-puzzle-fabric` | Hidden puzzles | Hidden hosts, monitor clues, tools, and puzzle manifest. |

## Parity vocabulary

| Status | Meaning |
| --- | --- |
| `implemented` | Current code/tests prove a Cyberscape feature exists. |
| `partial` | A real slice exists, but important reference behavior or Cyberscape context remains missing. |
| `context target` | The feature should be adapted into Cyberscape, but the adaptation needs design/implementation. |
| `research target` | Public evidence is insufficient; verify live reference behavior or stronger sources first. |
| `defer` | Valid future direction, but not required before the core world feels coherent. |
| `do not clone literally` | The spirit matters, but literal parity would be misleading, unsafe, or outside Cyberscape's product shape. |

## Product parity thesis

Cyberscape should not chase a mechanical checklist where every reference command is copied without context. The real parity target is the role each system plays in the world:

| Reference role | Cyberscape equivalent |
| --- | --- |
| Museum of old network culture | Curated archive/BBS/USENET/game surfaces with provenance. |
| Multi-user command-line world | Persistent accounts, messages, sessions, public state, and route visibility. |
| Host graph puzzle | Imported/generative graph, hero hosts, adjacency, traversal, ownership, and route tools. |
| Hacking progression | Wardial, porthack, login ownership, root ownership, badges, scores, and visible consequences. |
| Scriptable self-inspection | BASIC and future period BASIC-style APIs into Cyberscape world state. |
| Hidden discovery | Secret routes, monitor surfaces, puzzle clues, and discoverable tools without publishing every solution inline. |
| Old-terminal ergonomics | Pager, pipes, STTY, prompt modes, and text-client parity. |
| Cyberscape-specific shell fantasy | Windows-era workstation layer backed by the same server state. |

## Current parity map

### Access and transport

| Capability | Reference basis | Cyberscape target | Status | Proof / next action |
| --- | --- | --- | --- | --- |
| Web shell | Official web access. | Primary browser terminal and desktop shell. | implemented | `packages/cyberscape/src/app`, acceptance tests around shell API and desktop snapshot. |
| Plain/no-JS terminal path | The reference is terminal-first. | Text path that preserves shell interaction without the rich desktop. | implemented | `packages/cyberscape/src/app/api/shell/plain/route.ts`. |
| Telnet/rlogin/SSH commands | Official transport verbs and SSH access. | In-world transport commands first; real daemons only after core game state is stable. | partial | `telnet`, `ssh`, `rlogin` shell verbs are tested; no external daemon yet. |
| FTP | Official FTP/file-transfer surface. | Host file retrieval into user-local state. | implemented | Acceptance test: `ftp retrieves host files into the local shell`. |
| Gopher | Official Gopher access. | Menu/selectors over archive/world entries. | implemented | Acceptance test: `gopher exposes a menu and readable selectors`. |
| Finger | Official user/system status surface. | User/session/account/status inspection. | implemented | Acceptance tests for `users`, `who`, and `finger`. |
| QOTD | Official service. | Ambient quote/info service command. | implemented | Command registry and shell handler. |
| Real modem/dial-up phone line | Official third-party dial-up path. | In-world acoustic-coupler/dial-up/wardial simulation, not a real phone endpoint. | partial | `coupler <host\|number>` attaches a 110/300 baud acoustic coupler; `phonebook add/rm` persists a readable user `phonebook.txt` with host, label, line type, protocol, and notes; `operator <host\|number>` opens toll circuits for multi-hop phonebook entries and records calling-card toll rows; `phonebook`, `dialup`, `modems`, `lineage`, `devices`, `wardial`, `accounts`, and `credentials` expose deterministic numbers, protocol hints, BBS line hints, hunt-group counts, coupler status, carrier previews, toll blocks, toll history, busy lines, and no-carrier failures; `hunt <host>` surfaces alternate lines and `dial <number\|host>` can use those exact numbers to bypass a busy or dead primary line. Next deepen larger hunt groups, switchboard-style routing clues, and owned-BBS file-area configuration. |
| Packet-switched PAD/X.25 access | Historical packet-era host traversal before a flat always-on internet model. | In-world `pad <host>` / `x25 <host>` flow plus `telex <host>` packet-teleprinter access that only target visible multi-hop hosts, assign deterministic packet addresses, and reflect the circuit in backend-derived connection, device, lineage, event, and receipt state. | implemented | Acceptance tests: `packet PAD transport is playable and backend-derived across shell and desktop surfaces` and `telex uses a non-shell packet teleprinter path with backend-derived state`. Next deepen packet directories, switch families, and additional non-shell packet destinations beyond the first telex endpoint. |
| External protocol servers | Telnet/SSH/FTP/Gopher/Finger ports. | Optional later deployment mode if product needs it. | defer | Requires daemon/service architecture and security review. |

### Shell ergonomics

| Capability | Reference basis | Cyberscape target | Status | Proof / next action |
| --- | --- | --- | --- | --- |
| NLI lobby prompt | Official `.` prompt. | Pre-login exploration and account creation. | implemented | Acceptance test: `NLI prompt is dot`. |
| Logged-in shell prompt | Official logged-in prompt behavior. | Account-owned local shell. | implemented | Login/newuser tests and shell state. |
| Remote shell stack | Official host traversal. | Current-host stack with `back`/exit behavior. | implemented | `legacy transport verbs connect across the host stack`. |
| Pager | Official `--More--` controls. | Long-output navigation, search, quit, client passthrough. | implemented | Pager tests. |
| Pipes/output filters | Official pipe transforms. | Filtering command output through shell pipeline. | implemented | `shell pipes filter paginated command output`. |
| STTY `/dumb` and `/tty` | Official accessibility/terminal modes. | Output shaping before client render. | implemented | STTY acceptance test. |
| Case-insensitive command model | Official behavior. | Lowercase command normalization. | implemented | Command registry/engine behavior. |
| Tab completion | Official manual behavior. | Browser/client completion affordance. | context target | Needs UI/client design and tests. |
| Control characters | Official `^C`, `^D`, `EXIT`, `QUIT`. | Text-client interruption/exit semantics. | partial | `exit`/`quit` exist; explicit control-key handling needs client/runtime proof. |

### Command corpus

| Capability | Reference basis | Cyberscape target | Status | Proof / next action |
| --- | --- | --- | --- | --- |
| Official lobby utilities | Manual command list. | Inspired command set with visible help. | implemented | Registry includes broad utility/game commands and tests cover retro helpers/toys. |
| Logged-in file/network commands | Manual examples and host loop. | Commands unlock once user/world context exists. | implemented | Registry and acceptance coverage. |
| Complete live command list | Live reference `HELP`, wiki indexes. | Source-gated import of commands with Cyberscape dispositions. | research target | Build a command matrix: official/manual, live-verified, community-only, Cyberscape-only. |
| Command help | Manual `HELP`. | Useful one-line help and command list. | implemented | `COMMAND_HELP`, `formatCommandList`. |
| Hidden commands | Reference hidden-discovery culture. | Implement discoverable secrets without dumping solutions in public docs. | context target | Define spoiler-safe hidden-command policy and tests for discovery triggers. |
| Cyberscape desktop commands | Cyberscape Windows-era context. | Keep workstation commands backend-derived, not decorative. | implemented | Large desktop command/window parity test block. |

### Host graph and network world

| Capability | Reference basis | Cyberscape target | Status | Proof / next action |
| --- | --- | --- | --- | --- |
| 26,600+ host claim | Official public claim. | Large generated/imported graph with honest source limits. | partial | `np43` import plus hero hosts; full live graph not public. |
| Historical host metadata | Official archive/network-map basis. | Host org/location/display metadata and curated hero systems. | partial | `np43-host-list`, `hero-hosts.ts`; improve data provenance and generator. |
| Adjacency | Official `NETSTAT` reachability. | Traversal and porthack depend on graph edges. | implemented | `porthack rejects non-adjacent host`, route tests. |
| `HOSTS` | Official partial host enumeration. | Visible host list with paging/search. | implemented | Hosts pager tests. |
| `NETSTAT` markers | Official login/root markers. | Show reachable/current/owned/root posture. | partial | `netstat` and desktop network tests; exact marker parity should be audited. |
| `UUMAP`/`UUPATH`/`UUPLOT` | Official graph/routing tools. | Route and map inspection. | implemented | `uupath and uumap expose real UUCP routes`; `uuplot` command exists. |
| Historical users on remote hosts | Official `FINGER @host` examples. | Curated hero-host occupants plus generated imported-host occupants. | partial | `finger @host` returns host users/plans and has shell/API tests; next add desktop/profile surfaces and stronger provenance. |
| Host services/ports | Official protocol/service world. | Ports/services visible through shell and desktop views. | partial | Host model has ports; deepen service-specific behavior. |

### Files, archives, BBS, and content

| Capability | Reference basis | Cyberscape target | Status | Proof / next action |
| --- | --- | --- | --- | --- |
| Host-local files | Official file browsing/transfer. | Files vary by host and support read/download. | implemented | FTP/file tests. |
| User writable storage | Official user storage and disk warnings. | Persistent home files with quota/scoring later. | partial | Write/append/copy/move/remove persist; quota pressure should be expanded. |
| Textfiles/archive corpus | Official Textfiles.com/archive influence. | Curated manifest, provenance, license class, assignment rules. | partial | `data/archive-manifest.json`, licensing doc; needs larger reviewed corpus. |
| BBS list and BBS hosts | Official/community BBS behavior. | Menu BBS, boards, file areas, posting, downloads. | implemented | BBS prompt/file/post tests. |
| BBS sysop/admin ownership | Reference user BBS/sysop progression. | First player sysop claim persists in `sysop.txt` and appears in BBS, board, account, and credential surfaces. | partial | `packages/cyberscape/src/lib/bbs/sysop.ts`; acceptance test: `bbs sysop claim persists through account, credential, and board surfaces`. Next add player-created board publishing, moderation actions, listings, and owned file-area configuration. |
| USENET archive | Official archive command. | Groups/list/read/search/post, persistence. | implemented | USENET reader and posts tests. |
| Gopher content | Official protocol surface. | Menu-driven archive/world browser. | implemented | Gopher test. |
| Privacy/logging model | Official privacy policy. | Transparent in-game logs/events without leaking sensitive real data. | partial | Events/history exist; explicit privacy doc/runtime messaging should be improved. |

### Progression and ownership

| Capability | Reference basis | Cyberscape target | Status | Proof / next action |
| --- | --- | --- | --- | --- |
| Persistent accounts | Official `NEWUSER`/`LOGIN`. | Durable users and sessions. | implemented | Login/newuser and persistence tests. |
| Badge-based progression | Official/user-page/period BASIC evidence. | Badges, gates, scores, system-level-style state. | partial | Badge gates and scores exist; badge catalog needs expansion. |
| `WARDIAL` | Official/community progression tool. | Discovery and route expansion loop. | partial | Command exists; deepen phone/BBS discovery. |
| `PORTHACK` | Official/community login acquisition. | Adjacent-host login ownership. | implemented | Porthack adjacency/access tests. |
| `ROOTKIT` | Official/community root escalation. | Payload plus target-OS support-kit gated root control, ownership replacement. | partial | `ROOTKIT.EXE` plus `UNIXKIT.EXE`/`VAXKIT.EXE`/`CPMKIT.EXE` fixtures and tests exist; richer OS matrix/consequences remain open. |
| OS support kits | Community root details. | Target-specific exploit prerequisites. | partial | First OS/tool model and BBS acquisition tests exist; expand support-kit families and order-specific behavior. |
| Sysop/admin/satellite layers | period BASIC/user-page evidence. | Separate ownership classes beyond login/root. | context target | Add domain model before implementation. |
| Dojo/quests/races/Telefrag | Public/user/community evidence. | Optional challenge subsystems that reuse shell/world state. | research target | Verify rules and choose Cyberscape equivalents. |
| Competitive root | Community/user progression evidence. | Ousting or contesting root ownership with visible events. | partial | Root seizure exists; social/event consequences need expansion. |

### Social and multiplayer world

| Capability | Reference basis | Cyberscape target | Status | Proof / next action |
| --- | --- | --- | --- | --- |
| `USERS`/`WHO` | Official system status. | Active/persisted session visibility. | implemented | Users/who/finger tests. |
| `FINGER user` | Official profile/status. | User profile, badges, home host, state. | implemented | Finger tests. |
| `FINGER @host` | Official remote occupants. | Host occupant archaeology and simulated historical users. | partial | `finger @host` exposes host metadata, occupants, and plans; next surface occupants in desktop/profile views. |
| `SEND`/mail | Official social commands and privacy policy. | Durable messages and inbox. | implemented | Mail protocol and persistence tests. |
| `RELAY`/group chat | Official/interview social world. | Group channel or board-like live chat. | partial | `relay` enters a live text channel backed by active shell sessions, with channel membership, broadcast delivery, and queued lines for live listeners. Next decide persistence and broader visibility rules. |
| `TALK` | Official/interview one-to-one chat. | Interactive direct session channel. | partial | `talk <user>` opens a direct tty-to-tty text path for active users, with queued delivery through the live relay subsystem. Next add stronger offline/visibility/privacy behavior. |
| `LINK`/TTY mirroring | Official session observation. | Mirror persisted shell sessions. | implemented | Link tests. |
| Camp/tunnel/process state | Cyberscape-native multiplayer routes. | Visible route/session tactics in shell world. | implemented | Camp/tunnel/ps/kill tests. |
| Public user pages | Official profile transparency. | In-app profile/status surfaces and maybe static profile pages. | defer | Needs product decision and privacy model. |

### period BASIC and programmability

| Capability | Reference basis | Cyberscape target | Status | Proof / next action |
| --- | --- | --- | --- | --- |
| BASIC interpreter | Official period BASIC. | Load/run/save/delete user programs. | implemented | BASIC interpreter and persistence tests. |
| Historical BASIC library | Official library. | Curated runnable library with provenance. | partial | Catalog surface exists; expand corpus deliberately. |
| period BASIC state APIs | Official `TH_*` functions. | Cyberscape world APIs for hosts, badges, roots, messages, routes, time. | context target | Design `CH_*` or `TH_*` compatibility layer, then tests. |
| File APIs | Official `DIR$`, `OPEN`, `PRINT#`, `READ#`. | Programmatic access to user/host files within safety bounds. | context target | Add file API tests before broad scripting claims. |
| `TH_EXEC`-style shell chaining | Official/community-visible scripting. | Safe shell invocation from BASIC with limits. | research target | Verify source and security implications first. |

### Games, emulators, and amusements

| Capability | Reference basis | Cyberscape target | Status | Proof / next action |
| --- | --- | --- | --- | --- |
| Zork/adventure/IF | Official games library. | Nested adventure runner with shell return. | implemented | Advent/Zork tests. |
| Z-code shelf | Official `zrun`/`zc` style surface. | Browse and launch games. | implemented | Games/run/zcode tests. |
| BASIC games/programs | Official BASIC library. | Runnable user/library programs. | partial | BASIC persistence exists; library breadth open. |
| Apple II / CHIP-8 / BF style commands | Official command list. | Era-flavored interpreters or stubs with honest behavior. | partial | Commands exist; depth should be audited command-by-command. |
| Toy commands | Official command list. | Lightweight fun commands that teach shell feel. | implemented | Toy command tests. |

### Hidden content and puzzle fabric

| Capability | Reference basis | Cyberscape target | Status | Proof / next action |
| --- | --- | --- | --- | --- |
| Monitor secrets | Official `CALL -151` and creator interview. | Low-level monitor with discoverable exits/clues. | partial | Monitor entry/exit exists; hidden entry network open. |
| `PTYCON`-style monitoring | Official/interview-hidden surface. | Advanced session monitor gated by discovery/privilege. | context target | Model ethically as in-game observation, with clear privacy boundaries. |
| Hidden hosts/tools | Official/community discovery culture. | Spoiler-safe secret systems tied to host graph and archives. | context target | Add puzzle manifest and hidden-host tests. |
| Clue solving | Cyberscape-specific puzzle shell. | `solve` should unlock archive/world state. | partial | Command exists; puzzle catalog needs design. |
| Spoiler policy | Community spoiler norms. | Docs discuss systems; solution dumps live separately if ever needed. | implemented as documentation policy | Canonical reference and source index. |

### Windows-era Cyberscape layer

| Capability | Reference basis | Cyberscape target | Status | Proof / next action |
| --- | --- | --- | --- | --- |
| Themeable Windows shell | Cyberscape product context. | NT/2000/XP/7-inspired shell around same world state. | implemented | Theme persistence tests and CSS/classes. |
| Desktop app state | Cyberscape product context. | Active/open/minimized/maximized windows persist safely. | implemented | Desktop window state tests. |
| Control Panel/management views | Cyberscape product context. | Backend-derived state views, not static panels. | implemented | Desktop command/window parity tests. |
| Network Neighborhood/dial-up views | Cyberscape product context. | Expose graph, services, routes, and ownership. | implemented/partial | Existing parity tests; deepen data as graph improves. |
| Task Manager/Event Viewer/Search | Cyberscape product context. | Expose command history, events, session/process state. | implemented | Acceptance tests. |
| Accessibility preferences | Cyberscape product context plus reference STTY. | Shared terminal/desktop accessibility state. | implemented/partial | Tests exist; UI polish can improve. |

## Priority order for real parity work

1. **Make the parity inventory machine-checkable.** Add a data file or table-driven docs source for capability, evidence, status, owner file, and test proof.
2. **Close source-backed high-impact gaps.** Prioritize `finger @host`, richer `netstat` markers, host services, BBS/sysop ownership, root support kits, and period BASIC state APIs.
3. **Expand the historical corpus carefully.** Grow archive, BASIC, game, BBS, and host data through manifest/provenance review, not bulk dumping.
4. **Deepen multiplayer/social behavior.** Add relay/talk equivalents, richer public profile surfaces, route visibility, and event consequences for porthack/root actions.
5. **Add hidden/puzzle systems with tests.** Implement hidden hosts, monitor clues, puzzle manifests, and spoiler-safe verification.
6. **Consider real protocol daemons only after world parity is strong.** Web/API state should remain canonical; external wire services should be adapters.

## Acceptance standard for "parity converted to Cyberscape"

A feature is done only when all of these are true:

| Requirement | Evidence |
| --- | --- |
| Source basis is documented. | `[OFFICIAL]`, `[OPEN]`, or `[SYNTH]` row in docs. |
| Cyberscape behavior is explicitly defined. | Roadmap row states the adaptation, not just the reference feature name. |
| State model exists if needed. | Code owns durable state rather than rendering static copy. |
| Text shell works. | Command/API test or plain terminal proof. |
| Desktop layer works when applicable. | Backend-derived desktop/window parity test. |
| Persistence works when applicable. | Cross-session test. |
| Limits are named. | Docs say what is not yet claimed. |

## Next implementation slices

| Slice | Why it matters | Minimum proof |
| --- | --- | --- |
| Host occupants desktop/profile view | Extends implemented `finger @host` archaeology into workstation surfaces. | Desktop/profile rows for host occupants, provenance labels, and tests. |
| Root support-kit consequences | Turns the first support-kit gate into a richer exploit-chain model. | More OS kit families, order-specific behavior, event consequences, and failure/recovery tests. |
| period BASIC state APIs | Makes the world programmable rather than merely playable. | BASIC functions for host, badges, logins, roots, route, and files, with tests. |
| BBS sysop ownership | Extends archive/BBS from consumption into creator/admin progression. | Build beyond first sysop claim into create/admin board flow, listings, moderation, and owned file-area persistence. |
| Relay/talk social layer | Moves social world beyond mail and session mirroring. | Channel/direct-message model, visibility/logging rules, tests. |
| Hidden-host puzzle manifest | Makes discovery systematic and testable without public solution dumps. | Manifest schema, unlock trigger, hidden host/tool tests. |
