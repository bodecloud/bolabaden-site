---
module: cyberscape
tags: [cyberscape, ux, terminal, desktop]
problem_type: reference
---

# Cyberscape shell and desktop UX

Canonical reference: `docs/knowledgebase/50-execution/cyberscape-network-reference.md`.

## UX principle

The interface should feel like a real old networked computer, not a mock terminal. Text commands, desktop panels, BBS menus, archive readers, and adventure runners should all expose the same underlying world state.

Cyberscape adds a Windows-era workstation shell on top of the historical-network-inspired world. That layer is a deliberate product choice, not a reference-authenticity claim.

## Prompt and subsystem modes

| Mode | Purpose | Evidence |
| --- | --- | --- |
| NLI lobby | Pre-login exploration and account creation. | NLI prompt tests. |
| Logged-in shell | Main player command surface. | Login/newuser and persistence tests. |
| Remote host | Traversal context after transport verbs. | Legacy transport tests. |
| BBS | Menu-based board/file subsystem. | BBS prompt, post, file, and exit tests. |
| Monitor | Low-level `call -151` style surface. | Monitor entry/exit tests. |
| Adventure runner | Nested IF/Z-code style game mode. | Adventure/Zork tests. |

## Pager, pipes, and output

The reference treats long output as an interaction surface. Cyberscape should keep this behavior visible:

- `--More--` paging for long output.
- Keyboard controls for movement, search, and quit.
- Pipe-like filtering for command output.
- STTY shaping before output reaches clients.
- Plain terminal parity where possible.

Current implementation evidence lives in `packages/cyberscape/src/lib/shell/pager.ts`, `stty.ts`, and acceptance tests around pager movement, search, pipes, browser passthrough, and dumb-mode shaping.

## Desktop-era shell

The desktop layer should act like an alternate state viewer/controller, not a decorative skin.

| Desktop family | What it should reveal |
| --- | --- |
| System/control panels | User, host, theme, accessibility, display, time, power, programs, services. |
| Network panels | Connections, setup, diagnostics, mapped drives, dial-up, nodes, shares. |
| Operations panels | Task Manager, scheduled tasks, event viewer, logs, search, registry-like state. |
| Communication panels | Mailbox, boards, BBS/USENET summaries. |
| Files/devices/print | Current host files, devices, printers, queues, disk state. |

Acceptance tests currently prove command and window parity for many of these surfaces. Future UI work should continue to keep desktop views backend-derived.

## Accessibility and constraints

- `STTY /dumb` and `STTY /tty` are functional compatibility modes, not flavor text.
- Decorative ANSI or desktop chrome must not block plain terminal use.
- Prompt, pager, and subsystem transitions must be clear in text clients.
- The app can look era-specific, but critical game state must remain readable without visual ornament.
