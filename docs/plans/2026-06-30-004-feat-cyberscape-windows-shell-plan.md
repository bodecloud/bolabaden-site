---
artifact_contract: ce-unified-plan/v1
artifact_readiness: requirements-only
product_contract_source: ce-brainstorm
execution: code
type: feat
created_at: 2026-06-30
title: Cyberscape Windows Shell - Plan
source_requirements: legacy command-network requirements
---

# Cyberscape Windows Shell - Plan

## Goal Capsule

- **Objective:** Build Cyberscape as a browser-accessible personal computer world with a period desktop shell, backend-authoritative simulation, themeable era skins, command substrate, and a plain text fallback for non-JavaScript clients.
- **Product authority:** This plan supersedes the earlier terminal-first visual and flow assumptions while preserving command surface, host graph, BBS, persistence, and progression requirements.
- **Execution profile:** Node.js/Next.js implementation, lightweight DOM/CSS rendering, no WebGL, no WASM, no game-engine dependency, no bulky runtime renderer, and backend-owned game state.
- **Open blockers:** External network integrations, cloud resource bridges, real third-party service control, and live internet-facing host federation remain deferred until the next integration phase.

## Plain-Language Summary

Cyberscape starts as a calm, browser-first retro workstation with a real shell underneath.
The player should open it, see a Windows NT/2000/XP/7-style desktop, use the same backend-owned commands from either the desktop or the plain text client, and then grow from simple inspection into host ownership, defense, and gradual world expansion.
The first release is about making that shell usable and safe; later releases keep adding real windows, defensive rules, and more host content without ever turning the browser into the authority layer.

## Player Journey

1. Open the workstation and land in a deterministic, period-correct shell.
2. Use themes, windows, and commands to inspect the same world state from different surfaces.
3. Discover hosts, files, boards, and logs through ordinary use and careful reading.
4. Gain durable access, then harden and defend what is owned.
5. Keep expanding the reachable network without giving the browser authority over the game.

## Build Order

1. **Stabilize the shell surface.** Start with the page entry, session attach, desktop render, and plain text fallback so the first usable release is safe and deterministic.
2. **Lock the presentation system.** Add `nt`, `2000`, `xp`, and `7` as persisted theme layers and keep them separate from command semantics.
3. **Promote the workstation windows.** Add the real desktop apps that surface state and route every action back through the command/state path.
4. **Harden ownership.** Make takeover, recovery, conflict resolution, and anti-camping server-validated and visible in logs.
5. **Grow the world.** Add host packs, clue channels, period artifacts, and optional integrations only after the shell is stable.

## Implementation Principles

- The browser desktop is the primary surface, but every meaningful action must still resolve through the same backend state path as the text client.
- Shell chrome stays semantic DOM/CSS only; decorative SVG, WebGL, WASM, canvas gameplay, and bulky renderer stacks stay out of the shell path.
- Visual eras (`nt`, `2000`, `xp`, `7`) are presentation layers only and must never change command semantics, ownership, or progression.
- Player progress should come from reading, observation, and command fluency, not from brute force or external scavenger work.
- Expansion is allowed, but only after the current shell path remains deterministic, hydration-safe, and backend-authoritative.

## Non-Goals

- Do not make the product terminal-only.
- Do not make the browser desktop authoritative over gameplay state.
- Do not add GL, WASM, Three.js, canvas gameplay, or other bulky renderer stacks to the shell path.
- Do not rely on decorative server-rendered SVG in chrome.
- Do not require external network integrations for the first usable release.
- Do not turn convenience features into autopilot for routing, access, or defense.

## Plan At A Glance

1. Lock the shell contract around a browser-first Windows NT/2000/XP/7 desktop, with the text-only path kept equivalent and backend-owned.
2. Keep chrome deterministic and SVG-free so extension mutation cannot trigger the hydration mismatch class described in the pasted error.
3. Build the desktop as a thin semantic DOM/CSS renderer over authoritative server snapshots.
4. Add theme packs, window/app parity, and command equivalents so the desktop never becomes a dead-end.
5. Extend the control and defense loop with honest access, hardening, recovery, and audit rules.
6. Keep the expansion pipeline open for additional hosts, boards, files, events, and integrations without changing the authority model.

## Execution Flow

1. **Boot the session.** The server creates or resumes one authoritative shell session and returns a deterministic first paint.
2. **Render the workstation.** The browser shows a Windows NT/2000/XP/7-style desktop built from semantic DOM/CSS, not a heavy renderer.
3. **Expose the utility surfaces.** Terminal, Network Places, Files, Boards, Mail, Tasks, Logs, Help, and Settings all reflect backend-owned state.
4. **Let commands do the real work.** Every meaningful action maps back to the same backend command/state path so the text client and desktop stay equivalent.
5. **Keep the shell stable.** Hydration-sensitive SVG chrome, browser-only randomness, GL, and WASM stay out of the gameplay surface.
6. **Grow the world.** Add hosts, clues, defenses, and content packs only after the backend transition rules and anti-abuse rules exist.

## Known Gaps

- The theme system is not yet fully expanded to `nt`, `2000`, `xp`, and `7` across every window and affordance.
- The desktop app parity surface still needs the full `Network Places`, `Files`, `Boards`, `Mail`, `Tasks`, `Logs`, `Help`, and `Settings` implementation path.
- The control and defense loop still needs the durable anti-camping, recovery, and conflict-resolution logic called out below.
- The hydration-safety rule is only useful if every shell chrome path follows it, so any decorative SVG or browser-mutable icon path must stay out of the game shell.
- External integrations remain phase-two work and must not become a dependency for core play or progression.
- Any convenience feature that starts to replace observation, reading, or command fluency is a gap, not a win.

## Risk Register

- **Hydration mismatch regression:** server-rendered SVG or browser-mutated icon chrome can reintroduce the pasted warning; keep shell chrome CSS/DOM only.
- **Theme drift:** theme-specific visuals can accidentally alter command semantics; the backend snapshot and command parser must stay theme-independent.
- **Desktop dead ends:** windows that do not map back to commands or plain-HTML routes would make the desktop the only route through the game.
- **Authority leaks:** if the client can claim ownership, access, or reward state, the simulation becomes cheat-prone; all such facts stay server-owned.
- **Renderer creep:** adding GL, WASM, canvas gameplay, or a bulky widget runtime would violate the lightweight shell contract and should be treated as a regression.
- **Puzzle overexposure:** clues must remain indirect enough to preserve the game, but every hidden path still needs a fair in-world affordance.

## Milestone Map

### First Ship

- Lock the deterministic desktop shell and no-SVG chrome path.
- Keep the text-only route on the same backend command path.
- Keep theme selection backend-owned and limited to `nt`, `2000`, `xp`, and `7`.

### Next Ship

- Finish the utility surfaces that make the desktop feel like a real workstation: Network Places, Files, Boards, Mail, Tasks, Logs, Help, and Settings.
- Add the command equivalents for any new desktop action before or alongside the window.
- Expand the anti-camping, recovery, and conflict-resolution rules so owned hosts remain defensible.

### Later Ship

- Add richer host packs, clue channels, seasonal events, and additional artifacts.
- Add external integrations only after the local simulation is stable and safe.
- Grow the historical texture through more period-accurate files, boards, service banners, and administrative surfaces.

## Release Slices

### Slice 1 - Playable Shell

The first deliverable is a browser-first workstation that opens cleanly, persists a session, and lets the player use the same backend command path through the desktop and text client.

Includes:

- Deterministic first paint.
- Theme persistence.
- No-SVG shell chrome.
- Text-client parity.

### Slice 2 - Real Desktop

The second deliverable turns the workstation into a usable operating system shell with the core utility windows and command equivalents.

Includes:

- Network Places, Files, Boards, Mail, Tasks, Logs, Help, and Settings.
- Window focus, minimize, restore, and drag persistence.
- Shared command/state path across desktop and terminal.

### Slice 3 - Defensible World

The third deliverable makes ownership meaningful and safe to contest.

Includes:

- Takeover, recovery, and conflict-resolution rules.
- Readable audit events for access and defense.
- Anti-camping and route-ownership protections.

### Slice 4 - Living Expansion

The fourth deliverable keeps the world growing without changing the authority model.

Includes:

- More host packs and clue affordances.
- More period artifacts and surface texture.
- External integrations only after the local loop is stable.

## Versioned Scope

### v1 - First Usable Release

Ship the browser desktop, the text fallback, the four theme tokens, the no-SVG shell chrome path, and the shared backend command/state path.

v1 is considered usable when:

- The desktop opens as the default JS surface.
- The text client can still play the same session.
- Theme changes persist and do not alter game authority.
- No GL, WASM, or bulky renderer is required.

v1 ships:

- A browser-first workstation shell with session attach and deterministic first paint.
- The plain text fallback on the same backend command path.
- The four era themes with persisted selection.
- A no-SVG shell chrome path that avoids the pasted hydration mismatch class.

v1 does not ship:

- Full utility-window parity.
- Ownership and anti-camping gameplay depth.
- External network integrations.

### v1.5 - Desktop Completion

Add the workstation windows that make the shell feel like a period OS and keep each one command-equivalent.

v1.5 is considered usable when:

- Utility windows exist and persist per session.
- Every window action has a command or plain-client path.
- The shell remains deterministic and hydration-safe.

### v2+ - Living World

Continue growing hosts, clues, content packs, and defensive mechanics after the shell is stable.

v2+ is considered usable when:

- Ownership, recovery, and anti-camping are server-validated.
- New content ships through server-owned packs or fixtures.
- External integrations stay optional and gated.

## Dependencies

- Phase 2 depends on Phase 1 proving deterministic first paint and the no-SVG shell chrome path.
- Phase 3 depends on Phase 2 proving all four themes exist, persist, and keep the same command/state path.
- Phase 4 depends on Phase 3 proving the workstation windows are real and command-equivalent.
- Phase 5 depends on Phase 4 proving ownership, recovery, and conflict resolution are server-validated.
- Expansion depends on the earlier phases preserving the lightweight DOM/CSS renderer and no-GL/no-WASM contract.

## Verification Matrix

| Requirement | Proof source | Success signal |
| --- | --- | --- |
| Browser-first desktop shell | `/play` or package route, desktop render, build output | Desktop opens as the default JS surface and not a terminal clone |
| Text-client parity | Plain HTML route, command parser tests, shell snapshot output | Same command/state path works without JavaScript |
| `nt` / `2000` / `xp` / `7` themes | Theme switcher, persisted session/profile state, regression tests | Theme changes survive reload and keep the same backend state |
| Hydration safety | Browser hydration smoke, console output, shell chrome source | No mismatch warnings from shell chrome or extension-style SVG mutation |
| Lightweight renderer | Build config, dependency graph, shell chrome source | No GL, WASM, Three.js, or bulky renderer enters the shell path |
| Utility windows | Desktop launchers, per-window tests, command equivalents | Each window opens and has a command or plain-client route |
| Ownership and defense | Host takeover / recovery tests, audit logs, backend state checks | Client claims never grant ownership or rewards |
| Expansion pipeline | Fixture packs, host/content tests, runtime data sources | New content ships through server-owned packs without changing authority |

## Phase Details

### Phase 1 - Shell Contract

Build the browser-first desktop shell and make the no-JS path equivalent enough to play from the same backend state.

Exit criteria:

- Deterministic first paint.
- No decorative SVG in shell chrome.
- No GL, WASM, or bulky renderer dependency.
- Theme choice still comes from backend state.

### Phase 2 - Theme And Chrome

Finish the four-era visual system and make every visible shell element follow the same theme tokens.

Exit criteria:

- `nt`, `2000`, `xp`, and `7` themes exist and persist.
- Shell chrome stays CSS/DOM-based.
- The desktop and text client render the same state from one snapshot path.

### Phase 3 - Desktop Parity

Promote the workstation windows that matter for play and make each one map back to the command substrate.

Exit criteria:

- Network Places, Files, Boards, Mail, Tasks, Logs, Help, and Settings are real windows.
- Every new window action has a command equivalent.
- No desktop-only path is required for progression.

### Phase 4 - Control And Defense

Add the durable access, securing, monitoring, recovery, and anti-camping rules that make ownership meaningful.

Exit criteria:

- Takeovers, recovery, and conflict resolution are server-validated.
- Client claims cannot grant ownership or rewards.
- Security events are readable in-world and in diagnostics.

### Phase 5 - Expansion Pipeline

Grow the host corpus, clues, and period texture without changing the authority model.

Exit criteria:

- New content ships through server-owned packs or fixtures.
- External integrations remain gated behind the local simulation.
- Historical details show up as files, banners, logs, and surface affordances rather than answer keys.

## Implementation Backlog

1. **Desktop shell contract**
   - Wire the deterministic first render, backend snapshot, and no-SVG chrome path.
   - Proof: browser hydration smoke, `npm run build`, and a desktop shell that opens without console mismatch noise.

2. **Theme engine**
   - Finish the `nt`, `2000`, `xp`, and `7` theme tokens, window treatments, and persisted selection path.
   - Proof: theme switching in both desktop and text surfaces, plus reload persistence through the backend session.

3. **Utility windows**
   - Finish the workstation windows that surface the playable state: Network Places, Files, Boards, Mail, Tasks, Logs, Help, and Settings.
   - Proof: every window opens from the desktop and has a command equivalent or a plain-client path.

4. **Defense loop**
   - Add durable secure/repair/recovery/anti-camping behavior for owned hosts and route transitions.
   - Proof: host takeover, recovery, and conflict-resolution tests that reject client-claimed ownership.

5. **Content growth**
   - Add more host packs, clue affordances, logs, board posts, service banners, and period artifacts.
   - Proof: new content ships as server-owned fixtures or packs and remains playable without external integrations.

---

## Product Contract

### Summary

The product is a playable operating-system shell, not a terminal skin.
The default JavaScript experience presents a late-1990s-to-early-2000s desktop with windows, taskbar, Start menu, file surfaces, network places, help dialogs, logs, BBS views, and terminal sessions.
The non-JavaScript experience receives the same simulation through a text-only command form.

The core loop is quiet and persistent: open the machine, inspect what changed, follow host trails, collect durable access, defend owned machines, and slowly expand a personal mesh of reachable systems.
The player should be able to progress through normal use, careful reading, command fluency, and observation of odd system behavior.
The game must not depend on tedious brute force, fragile pixel hunting, or external scavenger work.

### Direction Change From Existing Requirements

The old requirements correctly describe a Cyberscape-compatible command and network simulation, but they make the terminal the product center.
The new direction makes the computer the product center.
The terminal becomes one first-class app inside a larger desktop environment.

Keep from the prior requirements:

- Command parser, shell history, paging, session persistence, and no-JS command execution.
- Simulated users, hosts, BBSes, files, mail, jobs, logs, and route memorization.
- Backend generation and validation for world state, hints, secrets, host access, and progression.
- Evidence-first implementation notes and acceptance criteria.

Replace from the prior requirements:

- The primary JavaScript UI is no longer a full-screen terminal clone.
- The visual language is no longer green-screen nostalgia.
- Static export is not a product target for the game surface because authoritative simulation and persistence require server execution.
- Desktop chrome must not depend on server-rendered SVG icon components that can be mutated before hydration.

### Product Identity

The shell should feel like a period-correct personal workstation recovered from a long-running network, with a calm ambient rhythm rather than an arcade loop.
It should support multiple visual eras without changing the underlying simulation.

Theme packs:

- **NT:** compact gray chrome, sharp borders, dense menus, low-color icons, utilitarian dialogs.
- **2000:** softer taskbar, Active Desktop traces, folder/web hybrid panels, administrative tools.
- **XP:** saturated taskbar options, friendly control panels, tour/help surfaces, chunky icons.
- **7:** glass-adjacent polish represented through CSS gradients and translucency, not GPU effects.

| Theme | Visual bias | Chrome treatment | Invariant |
| --- | --- | --- | --- |
| `nt` | Dense and austere | Flat gray surfaces, hard borders, tight menus | Same backend state and command path |
| `2000` | Practical and corporate | Classic taskbar, restrained gradients, admin-forward panels | Same backend state and command path |
| `xp` | Warm and familiar | Saturated taskbar, rounded affordances, friendly control panels | Same backend state and command path |
| `7` | Polished and airy | Glass-like gradients, soft highlights, translucent surfaces | Same backend state and command path |

Theme requirements:

- Theme selection persists in backend session/profile state.
- Theme switching must not reload the simulation.
- Themes alter chrome, fonts, icon assets, sounds, wallpapers, dialog treatments, and window affordances.
- The command protocol and progression rules must be theme-independent.
- Reduced-motion and low-bandwidth modes must remain available for every theme.

### Player Flow

1. **Attach:** A visitor opens `/play` or the Cyberscape package route and receives an existing or new session from the server.
2. **Boot:** The client renders a deterministic desktop shell with stable placeholders, then hydrates session-specific data.
3. **Orient:** The desktop exposes Terminal, Network Places, Files, Mail, Boards, Tasks, Logs, Help, and Settings.
4. **Explore:** The player uses windows or commands to inspect local files, read boards, dial or connect to hosts, and follow routes.
5. **Gain access:** The player obtains durable access through simulated, historically plausible mistakes: weak credentials, stale shares, misconfigured services, leaked scripts, forgotten dial-up notes, bad ACLs, and outdated daemons.
6. **Secure:** Owned hosts can be stabilized by fixing permissions, rotating credentials, pruning exposed shares, patching services, and monitoring logs.
7. **Expand:** Secured hosts add storage, compute, reachability, reputation, and route options.
8. **Return:** Ambient state changes over time: logs rotate, mail arrives, boards change, jobs finish, and a few rare anomalies become useful.

The flow must not require onboarding.
The desktop itself is the tutorial: labels, tooltips, file names, error messages, and period UI conventions provide enough direction.

### High-Level Runtime Flow

1. **Session attach:** The browser or plain HTML form sends a session cookie and optional command to the shell API.
2. **State load:** The backend loads or creates the authoritative shell session, user profile, host graph, files, boards, mail, tasks, events, and presentation preferences.
3. **Command dispatch:** If a command is present, the backend parser mutates only server-owned state through command handlers, protocol modes, and progression rules.
4. **Desktop derivation:** The backend derives bounded desktop rows for windows, Control Panel applets, logs, search, Help, services, devices, tasks, network places, files, boards, mail, and settings from the current state.
5. **Client render:** The JavaScript client renders the workstation as semantic DOM/CSS windows and glyphs; the plain client renders the same command output and status summaries as HTML.
6. **Presentation update:** Window focus, opened apps, minimized apps, positions, theme, and accessibility preferences are normalized by the API before persistence.
7. **Return loop:** Every follow-up click, shortcut, command, or plain-form post returns to the same API boundary; no browser storage, renderer object, SVG icon pack, canvas, WebGL, or WASM runtime becomes gameplay authority.

### Desktop App Surface

Required windows for the JavaScript experience:

- **Terminal:** full shell command surface, command history, paging, copy/paste, route inspection, and host sessions.
- **Network Places:** visual list of known hosts, shares, boards, routes, link quality, and last-seen times.
- **Files:** local and mounted remote file browser backed by server state.
- **Boards:** BBS/forum reader and writer with era-appropriate threading and moderation surfaces.
- **Mail:** in-game messages, notices, receipts, account hints, and automated reports.
- **Tasks:** active scans, transfers, maintenance jobs, route traces, and defense work.
- **Logs:** local and remote logs with filtering, diffing, rotation, and tamper evidence.
- **Help:** period manual pages, command references, and contextual help without explicit solution dumps.
- **Settings:** theme, sound, motion, font size, contrast, keyboard mode, and reset/export controls.

Desktop requirements:

- Multiple windows can be open, moved, focused, minimized, and restored.
- Window state persists per session.
- Every desktop action that changes simulation state goes through an API route.
- Client-only state is limited to presentation: window position, local focus, animation timing, and unsent input.
- Mobile layout uses a task switcher and single-window focus rather than pretending a small phone is a full desktop.

### Text-Only Surface

Non-JavaScript users must get a functional terminal-style interface for the same game.
This route is not a marketing fallback; it is an alternate client.

Text-only requirements:

- A form posts commands to a backend route and renders the resulting transcript.
- Session identity is cookie-backed.
- Core commands, host access, paging, account creation, login, BBS reading, file listing, and route traversal work without JavaScript.
- The text surface uses the same command parser and state transition code as the JavaScript terminal.
- No desktop-only mechanic may be required for progression unless it has a command equivalent.

### Backend Authority

The backend is the game engine.
The browser is a renderer and input device.

Backend-owned state:

- Session identity, profile, theme, known hosts, credentials, inventory, routes, jobs, mail, boards, files, ownership, defense posture, and world clock.
- Secret discovery, anomaly eligibility, host generation, access checks, cooldowns, anti-camping logic, and audit logs.
- Rate limits, command validation, replay protection, and state transition ordering.

Client-owned state:

- Current focused window, drag positions, local input draft, scroll positions, temporary hover state, and optimistic animation.

API rules:

- Use one command/state transition path for JavaScript and text-only clients.
- Return server snapshots with stable IDs, timestamps, and version counters.
- Reject client-submitted ownership, route completion, secret flags, host control, or reward claims unless they are derived from valid server transitions.
- Make every mutating operation idempotent or version-checked.
- Log meaningful security events inside the simulation and in server diagnostics.

### Network And Control Simulation

The control loop should be reality-adjacent while remaining safe and fictional.

Access vectors in scope:

- Weak passwords, default accounts, abandoned guest shares, exposed FTP roots, writable CGI directories, leaked `.ini` files, bad service banners, public backups, misconfigured SMB-like shares, old mailing-list posts, and stale DNS-style records.

Defense mechanics in scope:

- Change credentials, close shares, fix permissions, remove rogue tasks, patch vulnerable service versions, add monitoring, review logs, and recover from compromise.

Anti-abuse and fairness requirements:

- New sessions cannot be trapped by existing players.
- Host takeovers have grace windows, lockout protections, and server-side conflict resolution.
- No tunneling mechanic should bypass route, trust, or ownership checks.
- Shared host state is bounded; most progression should be personal or sharded until multiplayer rules are mature.
- Competitive actions must have readable logs and recoverable consequences.

### Historical Texture

The world should use early-2000s computing material as a grammar for clues and affordances.
It should not become a museum plaque.

Referenceable materials:

- Dial-up and broadband transition language.
- BBS etiquette, handles, sysop notes, doors, file areas, message bases, and ANSI-adjacent art.
- Shared hosting, FTP, cPanel-like panels, CGI scripts, Perl/PHP snippets, web rings, guestbooks, counters, and directory indexes.
- Windows administrative surfaces: Event Viewer, Network Neighborhood, Control Panel, Services, Task Scheduler, file properties, and help files.
- Small ISP, school lab, LAN party, home server, webhost, and hobbyist community patterns.

Implementation rule:

- Historical references should appear as filenames, UI affordances, logs, defaults, board posts, host banners, service names, and command output.
- Do not publish research notes as direct answer keys.

### Secret And Puzzle Requirements

Secrets should be varied by channel and affordance.
The same hiding method must not dominate the game.

Allowed channels:

- File metadata, log timing, host banners, route names, window coordinates, stale shortcuts, malformed help topics, archived board posts, service version strings, repeated typo patterns, printer queues, scheduled task names, old web counters, registry-style keys, and rare visual glitches.

Puzzle rules:

- Every hidden path must have at least one fair clue.
- Clues may require inference, patience, or command knowledge, but not external private knowledge.
- The backend decides when rare events and unusual outputs are eligible.
- Client visual effects may hint, but cannot be the sole source of a required state transition.
- Avoid direct solution prose in code, comments, data keys, and public docs.

### Rendering Constraints

The desktop must stay lightweight and robust.

Hard constraints:

- No WebGL, no WASM, no Three.js, no game engine dependency, and no heavyweight renderer.
- Prefer semantic HTML, CSS, small raster/icon sprites, CSS gradients, CSS borders, and DOM windows.
- Any animation must be CSS-based or minimal requestAnimationFrame DOM work with reduced-motion support.
- Sound is optional and must be user-controllable.

Hydration constraints:

- Server-rendered markup must be deterministic.
- Do not server-render decorative SVG icon components in desktop chrome.
- Use CSS classes, pseudo-elements, sprites, or static image assets for shell icons.
- Dynamic values such as clock, locale-formatted dates, randomized messages, generated IDs, and session-specific counters must come from server snapshots or mount-only placeholders.
- Browser extension mutations to SVG attributes must not produce React hydration warnings in core chrome.
- The shell must tolerate pre-hydration style mutations by dark-mode extensions.

The pasted hydration failure points to extension-mutated SVG attributes on icon components in the desktop chrome.
The fix is product-level, not just a one-line suppression: remove SSR-hydrated SVG icon components from chrome and use stable CSS or image assets for those affordances.

### Accessibility And Quality Of Life

Required support:

- Keyboard-first navigation for windows, taskbar, Start menu, terminal, lists, and dialogs.
- Screen-reader labels for window controls, app launchers, command output, and status updates.
- High contrast and large-font options.
- Reduced motion mode.
- Copyable command output and selectable logs.
- Command history search.
- Persistent notebook or bookmarks for known hosts, routes, and clues.
- Clear distinction between local, remote, owned, locked, and unknown systems.
- Safe reset, export, and session recovery controls.

### Continuous Expansion Model

The game is not planned as a finished fixed content set.
It needs an expansion pipeline that can add new hosts, boards, files, services, anomalies, commands, themes, and apps without rewriting the shell.

Expansion tracks:

- **Commands:** parser verbs, aliases, manual entries, command tests, text-only parity.
- **Hosts:** generated and curated host packs with service profiles, banners, files, boards, routes, and access policies.
- **Desktop apps:** new windows that consume existing backend state or add server-authoritative mechanics.
- **Themes:** additional era skins and accessibility variants.
- **Events:** time-based mail, board changes, job completions, log anomalies, and seasonal content.
- **Integrations:** external API bridges only after local simulation boundaries and consent model are stable.

Each expansion must define:

- Server schema impact.
- Command equivalents.
- No-JS behavior.
- Hydration risks.
- Abuse or cheating risks.
- Accessibility impact.
- Test fixtures.

### Implementation Phases

#### Phase 1: Contract And Stabilization

- Keep the existing command surface working.
- Create this plan as the current product contract.
- Audit current shell chrome for hydration-prone SVG, random, time, locale, and browser-only values.
- Define backend snapshot shape for desktop session state.

#### Phase 2: Hydration-Safe Desktop Chrome

- Replace decorative Lucide icon components in desktop chrome with CSS or static sprite assets.
- Keep the terminal app as a client island but make the outer desktop shell deterministic.
- Add a development smoke check that fails on hydration mismatch console output.
- Add a focused regression case for dark-mode extension style mutation where practical.

#### Phase 3: Theme Packs

- Add `nt`, `2000`, `xp`, and `7` theme tokens.
- Persist theme choice through backend session state.
- Provide Start menu, taskbar, window, icon, wallpaper, and dialog variants.
- Keep the command protocol unchanged across themes.

#### Phase 4: Desktop App Parity

- Promote terminal-only features into windows: Network Places, Files, Boards, Mail, Tasks, Logs, Help, and Settings.
- Ensure every window action has a command equivalent.
- Keep the no-JS route on the same parser/state transition path.

#### Phase 5: Control And Defense Loop

- Add ownership, securing, monitoring, cooldowns, and recovery rules.
- Add host conflict resolution and spawn-protection semantics.
- Add server-side audit events for every access, ownership, defense, and route transition.

#### Phase 6: Expansion Hooks

- Add content pack loading for hosts, boards, files, mail, banners, and clues.
- Add safe event scheduling.
- Prepare adapter boundaries for future external integrations without allowing clients to claim real-world effects.

### Acceptance Criteria

- The JavaScript route opens into a desktop shell, not a full-screen terminal.
- Terminal, Network Places, Files, Boards, Mail, Tasks, Logs, Help, and Settings have visible launch points.
- Theme switching works between `nt`, `2000`, `xp`, and `7` without a page reload.
- Theme choice persists across refresh.
- No WebGL, WASM, Three.js, or game-engine dependency is added.
- Desktop chrome contains no server-rendered decorative SVG icon components.
- Development browser smoke test shows no hydration mismatch warnings in the shell.
- The known dark-mode-extension SVG mutation class cannot reproduce the pasted hydration warning in shell chrome.
- Non-JavaScript command form can create or attach a session, run commands, page output, inspect hosts, read boards, and continue progression.
- Backend APIs reject direct client claims for host ownership, rewards, secret discovery, and defense completion.
- Every new desktop-only action has a command equivalent or is explicitly presentation-only.
- The shell remains usable with keyboard navigation, reduced motion, high contrast, and narrow viewport layout.

### Product Direction Review

#### 2026-06-30: Direction checkpoint before implementation learnings

- The product center remains the personal computer shell rather than a terminal clone; desktop surfaces should reveal server state and route players back to command-equivalent actions.
- The technical boundary remains lightweight DOM/CSS with backend-authoritative simulation state; client-only state is acceptable only for presentation such as open menus, focus, and local input drafts.
- Theme and active-app state are intentionally bounded and allowlisted because they are presentation preferences, not claims about host control, rewards, access, or progression.
- Text-client parity remains a requirement for every meaningful surface; desktop affordances may be more convenient, but they cannot become the only path for progression.
- Hydration safety remains a product constraint, not a local bug fix: shell chrome must avoid server-rendered decorative SVG components and must tolerate extension style mutation before React hydrates.

#### 2026-06-30: Product direction requirements for future learnings

Implementation learnings must be written as product-contract deltas, not as a chronological changelog.
Each learning should explain which player-facing rule, backend authority boundary, or rendering constraint was clarified by the implementation.

Required framing for new learning entries:

- **Player surface:** State whether the change improves the desktop shell, the terminal app, the text-only client, or a shared backend mechanic.
- **Authority boundary:** Identify whether the changed state is presentation-only, server-owned presentation, or gameplay authority; gameplay authority must never be accepted from client claims.
- **Parity path:** Name the command, text-client route, or API transition that keeps the feature reachable without JavaScript when the feature affects progression.
- **Hydration and renderer risk:** Record whether the change touches deterministic first render, iconography, time/random output, browser-only APIs, SVG, canvas, WebGL, WASM, or heavyweight renderer dependencies.
- **Puzzle discipline:** Describe clue affordances as channels and constraints, not answers, secret names, or direct solution prose.
- **Historical texture:** Tie new flavor to a period computing surface such as BBS menus, shared-hosting panels, file properties, event logs, service banners, help topics, or network neighborhood views.
- **Verification:** List the proof actually run, and keep claims scoped to that proof.

Decision rules before adding future learnings:

- If a change only adds chrome, the learning must say why that chrome helps orientation, calm use, accessibility, or text-client parity.
- If a change adds a puzzle, anomaly, host, board, file, or route, the learning must document fairness, backend eligibility, and spoiler avoidance rather than the answer path.
- If a change touches ownership, defense, access, resource growth, or competition, the learning must document anti-camping, conflict resolution, recovery, and audit-log implications.
- If a change imports historical data, the learning must distinguish official, open/community, and synthesized sources and keep licensing or provenance caveats visible.
- If a change adds convenience, the learning must avoid turning the game into automation-by-proxy; quality-of-life should reduce tedium while keeping observation and decision-making with the player.

Current synthesis against the older command-network requirements:

- The older requirements remain authoritative for command breadth, pager behavior, STTY behavior, host graph, BBS, account persistence, progression, and behavioral testing.
- The older requirements are no longer authoritative for the primary JavaScript experience; the desktop shell is the default surface, and the terminal is one app inside it.
- Official/manual-derived behavior should drive command semantics, while community progression notes remain implementation hypotheses until verified or covered by behavioral tests.
- The early-2000s workstation layer is not a cosmetic wrapper; it is the main navigation model for files, boards, logs, tasks, mail, settings, and future integration boundaries.
- The expansion model must preserve the quiet persistent loop: inspect, infer, connect, gain durable access, secure, expand, and return later to changed state.

#### 2026-06-30: Revisited direction before capturing new learnings

- The product target is still a browser-accessible personal workstation with a command substrate; any new desktop applet must summarize backend-owned state and expose command-equivalent next steps.
- The historical layer should stay artifact-led: believable panels, menus, event rows, BBS text, file metadata, banners, services, shares, tasks, and logs should carry the period texture without relying on explanatory lore dumps.
- Discovery remains observational rather than spoonfed: new anomalies, clues, or route signals should be encoded as affordance channels, bounded state changes, environmental inconsistencies, or provenance hints, never as answer-shaped labels in UI, code comments, tests, or docs.
- Competitive or expansion mechanics remain backend-governed: access, ownership, securing, recovery, resource growth, conflict resolution, and anti-camping rules must be validated server-side and auditably represented before the client can display them.
- Quality-of-life should compress repetition, not decision-making; surfaces may gather related facts, stage commands, and reduce memory burden, but they must not automate observation, routing, access attempts, defense, or clue interpretation.
- Personal-data-driven starts are allowed only through sanitized derived artifacts and bounded summaries; public/export-safe shells must not depend on private raw data, local filesystem scans, live browser identity, or runtime server secrets.
- The rendering constraint is a core requirement: use semantic DOM, CSS glyphs, bounded JSON, deterministic first render, and progressive plain-HTML fallback; do not add decorative server-rendered SVG, canvas gameplay renderers, WebGL, WASM, browser storage authority, or heavyweight game engines.
- Learning capture must prove the exact surface changed. A valid entry records the requirements rule revisited, product fit, player-facing surface, authority boundary, parity path, puzzle discipline when relevant, hydration/rendering risk, and the commands/tests actually run.

#### 2026-06-30: Requirements gate before capturing implementation learnings

Before adding or updating any implementation learning, re-check the change against the product contract above and record the result in the learning itself.
This is a required preface, not an optional summary: the product direction and requirements come first, then the implementation fact, then proof.
Learning entries that only describe code movement without this gate are incomplete.

The gate is deliberately stricter than a normal changelog review.
It protects the core direction from drifting into a terminal clone, a browser-only toy desktop, an automation panel, or a renderer-heavy game shell.
Every learning should show how the implementation keeps the recovered-workstation surface, command substrate, text-client parity, backend authority, puzzle discipline, historical artifact texture, and hydration-safe DOM/CSS renderer aligned.

Gate questions:

- Does the change keep the desktop shell as the primary JavaScript surface rather than collapsing into command-only presentation?
- Does the change preserve a command or plain-HTML route for every progression-relevant action?
- Does the backend derive the exposed fact from session/world state, rather than accepting client claims about access, ownership, route completion, rewards, or puzzle progress?
- Does the JavaScript client remain a lightweight DOM/CSS renderer with no decorative server-rendered SVG, canvas renderer, WebGL, WASM, browser storage authority, or heavyweight game runtime?
- Does the learning describe puzzle and clue channels without publishing direct answers, secret names, or answer-shaped implementation keys?
- Does the change reduce tedium without turning observation, routing, access, or defense into agent-friendly autopilot?
- Does the historical texture appear through believable workstation artifacts such as files, logs, boards, mail, banners, shares, settings, and network views rather than detached exposition?
- Does verification prove the claim on the real surface that changed, including text parity and hydration safety when either surface is touched?

Required learning preface:

- **Requirements revisited:** State the product rule this change is allowed to advance and the rule it must not violate.
- **Product direction review:** Explain why the change belongs in the computer-first shell instead of being a terminal-only feature, a browser-only shortcut, or detached exposition.
- **Player surface:** Describe what the player can inspect or do after the change without publishing solution paths.
- **Authority boundary:** Name the backend state or presentation-only state involved, and explicitly reject client-side authority where relevant.
- **Parity path:** Name the command, text route, or API transition that keeps the surface reachable outside the JavaScript desktop.
- **Hydration and renderer risk:** Confirm the change respects deterministic first render and the no decorative server-rendered SVG/no heavyweight renderer constraint.
- **Verification:** List the proof actually run.

### Implementation Learnings

#### 2026-06-30: Hydration-safe shell chrome

- Requirements revisited: the shell must remain a computer-first DOM/CSS desktop and must not reintroduce hydration-sensitive decorative SVG chrome.
- Product direction review: the icon system is part of the primary JavaScript workstation, so renderer safety is a product requirement rather than a local cleanup detail.
- The pasted hydration issue was caused by browser-extension mutation of server-rendered SVG attributes on decorative desktop chrome icons.
- The shell chrome now avoids Lucide-rendered SVG components and uses CSS-backed glyph spans for desktop apps, titlebar iconography, and the Start affordance.
- The initial era is deterministic (`xp`) so server and first client render agree.
- Era switching must stay on the backend session path rather than browser-only storage.
- Verification on this pass covered static source removal, TypeScript, acceptance tests, production build, and a headless Chromium hydration smoke.

#### 2026-06-30: Backend-owned desktop theme

- Requirements revisited: theme choice may shape the workstation's period presentation but cannot become browser-only authority or alter progression rules.
- Product direction review: themes are part of the computer-first shell identity, so the desktop and text client must share one backend-owned preference path.
- Desktop theme moved into `ShellSessionState.desktopTheme` with `xp` as the deterministic default for existing and new sessions.
- The shell API now returns `desktopTheme` in every snapshot, so the JavaScript desktop renders from server state instead of browser storage.
- A `theme <nt|2000|xp|7>` command updates the same state path, giving the text-only client command parity with the JavaScript era picker.
- The plain HTML route now shows the current theme and the available command forms.
- Acceptance coverage verifies default theme, mutation, persistence across API reload, and invalid-theme rejection.

#### 2026-06-30: Account-persistent desktop theme

- Requirements revisited: durable player preferences may follow the account, but saved presentation state must stay separate from host access, ownership, and rewards.
- Product direction review: the workstation should feel like the same personal machine after login without turning cosmetic state into gameplay state.
- User profiles now store `desktop_theme` with the same `nt`, `2000`, `xp`, and `7` allowlist used by session state.
- Existing databases are upgraded through the package's `ensureColumn` path, matching the existing lightweight migration style.
- Pre-account theme choice is preserved when creating a new user, and later `theme` changes update the logged-in user's profile.
- Fresh sessions start from the deterministic default until login; login then hydrates the saved user theme.
- Acceptance coverage verifies pre-account choice, new-user persistence, post-login mutation, fresh-session defaulting, login hydration, and direct user-row storage.

#### 2026-06-30: Browser hydration smoke

- Requirements revisited: hydration safety is required proof for shell chrome changes because browser-extension mutation is part of the real operating environment.
- Product direction review: a quiet desktop shell loses trust if it warns or visually diverges before play begins, so the smoke test guards the product surface directly.
- `npm run test:hydration` starts or reuses a local Next dev server, drives Chromium through the Chrome DevTools Protocol, and fails on React hydration mismatch console output.
- The smoke injects an extension-style pre-hydration SVG mutation hook matching the pasted failure class; current shell chrome has no decorative SVG targets, so the warning does not reproduce.
- The script uses only Node built-ins and a local Chromium executable; it does not add Playwright, WebGL, WASM, or a browser-rendering dependency to the app.
- The smoke passed against the active local dev server on `http://127.0.0.1:3001/`.

#### 2026-06-30: Lightweight desktop app surfaces

- Requirements revisited: JavaScript users must start in the desktop shell, while meaningful actions still need command or text-client equivalence.
- Product direction review: app windows make the recovered-workstation metaphor concrete without moving simulation authority into React.
- Desktop launchers now open DOM/CSS windows for My Nodes, Network Places, Files, Boards, Mail, Tasks, Logs, Help, and Settings.
- Each window exposes its command-equivalent surface instead of claiming client-side authority over game state.
- The terminal remains the primary mutating interface; app windows can stage a matching command into the prompt.
- The taskbar tracks the active terminal or app window without adding SVG, canvas, WebGL, WASM, or a heavyweight renderer.
- The hydration smoke now clicks every non-terminal desktop launcher and verifies that the matching app window appears without hydration mismatch output.

#### 2026-06-30: Server-owned desktop snapshot

- Requirements revisited: desktop surfaces may summarize game facts, but those facts must be derived from backend session/world state and remain read-only on the client.
- Product direction review: a workstation shell needs real status panels, not static chrome, and the snapshot is the safe bridge from simulation to UI.
- The shell API now returns a bounded `desktopSnapshot` with current host, home host, cwd, user, login state, shell mode, tty port, badge count, access counts, downloads, mailbox count, route depth, camp state, tunnel state, stty, and desktop theme.
- Desktop app windows render real session facts from that server snapshot where available instead of static placeholders.
- The snapshot is read-only client input; mutating game state still goes through shell commands and backend validation.
- Acceptance coverage verifies the default snapshot, theme propagation, new-user login state, username, home host, and cwd.
- Hydration smoke still passes while exercising every desktop app launcher.

#### 2026-06-30: Persisted active desktop app

- Requirements revisited: active-window state may persist for continuity, but it is presentation state and must be allowlisted.
- Product direction review: restoring the last focused surface helps the workstation feel persistent without claiming gameplay progress.
- `ShellSessionState.desktopActiveApp` now stores the active desktop surface as bounded presentation state.
- The shell API accepts only allowlisted app IDs and ignores invalid values, so the client cannot smuggle arbitrary app names or game-state claims through this field.
- The JavaScript desktop restores the active app from the server snapshot and persists app changes through the API.
- Presentation-only app-sync responses are intentionally ignored by the UI to avoid stale rapid-click responses rewinding the active window.
- Acceptance coverage verifies defaulting, persistence across reload, invalid app rejection, and closing back to the terminal.

#### 2026-06-30: Text-client desktop parity

- Requirements revisited: every meaningful desktop surface needs a command or plain-HTML path when it affects orientation or progression.
- Product direction review: the desktop is the primary JavaScript shell, but the same machine must remain playable through text-only interaction.
- `desktop` shows the active desktop app and the allowed app list from the same backend state used by the JavaScript desktop.
- `desktop <app>` switches the active app through the shell command path, so no-JS clients can exercise the same presentation state without a JavaScript-only API body.
- The command is available before login because it changes only bounded presentation state, not game authority.
- The plain HTML route now displays current theme and active desktop app in its status strip.
- Acceptance coverage verifies show, switch, invalid-target rejection, and persistence across API reload.

#### 2026-06-30: Text-rendered desktop app content

- Requirements revisited: desktop windows cannot become JavaScript-exclusive knowledge surfaces.
- Product direction review: backend-rendered app content lets the same workstation state appear in both graphical windows and terminal-style output.
- The `desktop` command now prints backend-rendered content for the active app instead of only reporting the active app name.
- `desktop <app>` switches the active app and immediately prints that app's server-derived rows.
- Text clients can now inspect Terminal, My Nodes, Network, Files, Boards, Mail, Tasks, Logs, Help, and Settings surfaces through the same backend facts used by the JavaScript desktop snapshot.
- Acceptance coverage verifies rendered host, cwd, downloads, and settings/theme rows.

#### 2026-06-30: Removed unused SVG icon dependency

- Requirements revisited: the shell must avoid decorative server-rendered SVG paths that reproduce the known hydration mismatch class.
- Product direction review: removing the icon dependency keeps the visual language enforceable instead of relying on developer memory.
- `lucide-react` is no longer declared or installed in the Cyberscape package.
- Shell chrome remains CSS/DOM glyph based, which keeps the pasted SVG hydration-mutation class out of app code and the dependency graph.
- `components.json` still names Lucide as the shadcn generator preference, but that is project scaffolding metadata rather than bundled runtime app code.
- `npm ls lucide-react` confirms the package tree is empty for Lucide.

#### 2026-06-30: Executable rendering constraint guard

- Requirements revisited: renderer constraints must be executable because later shell work will keep adding chrome and app surfaces.
- Product direction review: the product direction depends on a lightweight DOM/CSS workstation, not a slide toward canvas, SVG icon packs, WebGL, WASM, or game-engine runtime.
- `npm run test:constraints` now checks direct dependencies and Cyberscape source for forbidden rendering paths.
- The guard fails on direct Lucide, Three, React Three, Phaser, Pixi, Babylon, PlayCanvas, Unity WebGL, source WebGL/WASM/canvas renderer usage, source SVG elements, browser storage state, and DarkReader mutation artifacts.
- The check intentionally ignores transitive optional build-tool packages in `package-lock.json`; the product constraint is about app/runtime rendering and source behavior.
- This makes the no-WebGL/no-WASM/no-SVG-shell constraint enforceable before hydration smoke or browser review.

#### 2026-06-30: DOM/CSS Start menu

- Requirements revisited: desktop navigation can improve orientation, but launched actions must still route through allowed apps, commands, or backend presentation state.
- Product direction review: the Start menu is a period workstation affordance that makes the shell legible without adding browser-side game authority.
- The taskbar Start affordance now opens a semantic DOM/CSS menu with app launchers and theme shortcuts instead of remaining decorative chrome.
- Menu open state is client-only presentation state; app selection persists through the existing bounded active-app API path, and theme selection continues through the backend `theme` command.
- The menu uses the same app registry and CSS glyph system as desktop icons, avoiding duplicate launcher definitions and avoiding SVG/canvas renderer risk.
- The hydration smoke now opens the Start menu, launches Files from the menu, verifies the menu closes, and still fails on hydration mismatch console output.

#### 2026-06-30: Server-persisted desktop window state

- Requirements revisited: window layout may persist because it is bounded presentation state, but it cannot carry arbitrary app IDs or gameplay claims.
- Product direction review: multiple restorable windows make the shell feel like a real workstation while preserving backend ownership of allowed surfaces.
- `ShellSessionState` now stores allowlisted open and minimized desktop app arrays alongside the active app.
- The shell API normalizes those arrays on load and input, always keeps Terminal available, and rejects unknown app IDs by filtering rather than trusting client claims.
- The JavaScript shell now renders multiple DOM/CSS app windows, taskbar slots, active-window emphasis, and minimize/restore/close controls without introducing a renderer dependency.
- The text client has command parity through `desktop open|focus|restore|min|close <app>`, while legacy `desktop <app>` still opens and focuses the requested surface.
- Presentation-only browser writes intentionally use fire-and-forget persistence; applying older API responses after rapid minimize/restore clicks can rewind the visible shell to stale state.
- Acceptance tests cover API persistence, invalid input filtering, command parity, and reload behavior; hydration smoke covers launcher accumulation plus minimize/restore/close behavior.

#### 2026-06-30: Bounded desktop window placement

- Requirements revisited: drag interaction is browser input plumbing only; persisted placement must be normalized by the server and stay presentation-only.
- Product direction review: movable windows support the workstation fantasy without letting the client define new surfaces or progression state.
- Desktop app windows now have allowlisted, clamped `x,y` positions in shell session state.
- The API normalizes browser-submitted positions, rejects unknown app keys, rounds fractional coordinates, and clamps movement inside a bounded desktop area.
- Text clients can use `desktop move <app> <x> <y>` to open, focus, and place a window through the same backend state.
- JavaScript clients can drag app titlebars with pointer events; the renderer only owns interaction plumbing while persisted placement remains a server-normalized presentation field.
- Hydration smoke now verifies dragging a restored window changes its DOM position while still running under the pasted extension-style mutation scenario.

#### 2026-06-30: Backend-owned accessibility preferences

- Requirements revisited: accessibility controls are required workstation settings and must persist through the backend without changing game authority.
- Product direction review: calm use, keyboard access, readable text, and high contrast are part of the shell contract, not optional polish.
- Desktop preferences now include allowlisted motion, font-size, and contrast settings in shell session state.
- The shell API normalizes preference objects and supports single-key preference updates without browser storage.
- Text clients can use `theme pref motion normal|reduced`, `theme pref font normal|large`, and `theme pref contrast normal|high` to reach the same settings as the JavaScript desktop.
- The Settings app now has DOM controls for those preferences, and the desktop root reflects them through CSS classes for reduced motion, larger text, and high contrast.
- Rapid Settings clicks must merge with current preference state; otherwise the final API/UI write can overwrite earlier choices from the same interaction burst.
- Hydration smoke opens Settings and toggles all three preferences under the pasted extension-mutation scenario.

#### 2026-06-30: Desktop presentation export and reset

- Requirements revisited: export/reset may help users manage the workstation shell, but they must not reset or reveal progression state.
- Product direction review: Settings should expose maintenance affordances like a real control panel while staging mutations through shared command paths.
- `desktop export` prints a bounded JSON snapshot of presentation state: theme, active app, open apps, minimized apps, window positions, and desktop preferences.
- `desktop reset layout|prefs|all` resets only desktop presentation state and does not touch gameplay progression, files, badges, credentials, or host control state.
- Settings now exposes export and reset controls as command-staging buttons, keeping mutating action execution on the shared backend command path rather than hidden client-side state changes.
- Acceptance coverage verifies export content, layout reset, preference reset, and invalid reset rejection.
- Hydration smoke verifies the Settings export/reset controls stage the correct terminal commands while the extension-mutation hook is active.

#### 2026-06-30: Keyboard task switcher

- Requirements revisited: keyboard quality-of-life can reduce friction, but it must remain presentation/navigation input rather than game automation.
- Product direction review: a period desktop shell needs window-switching muscle memory while preserving terminal use and text-client parity.
- The JavaScript shell now supports a DOM/CSS task switcher for open windows through Alt+Tab, with Escape closing transient overlays and Ctrl+Escape toggling Start.
- Task switching reuses the existing active-app API path through `openApp`, so focus changes remain persisted presentation state instead of a browser-only session artifact.
- The switcher renders with semantic listbox/option roles and CSS glyphs, avoiding hydrated SVG chrome and heavyweight renderers.
- Hydration smoke dispatches keyboard events to verify the switcher opens, highlights an app, closes on Alt release, and still avoids the pasted hydration mismatch class.

#### 2026-06-30: Backend-persisted maximize and restore

- Requirements revisited: window controls can persist only as normalized layout state and must not alter underlying game data.
- Product direction review: maximize/restore makes app windows feel complete without expanding the renderer beyond DOM/CSS.
- Desktop window chrome now has a working maximize/restore button instead of a decorative titlebar glyph.
- `ShellSessionState` stores allowlisted maximized apps alongside open and minimized app arrays, and the shell API includes that state in snapshots and presentation updates.
- Text clients can use `desktop max <app>` and `desktop restore <app>` through the same backend command path used by the JavaScript shell.
- Maximizing clears minimized state, moving a window clears maximized state, and layout reset clears maximized state without touching gameplay progress.
- Hydration smoke clicks maximize and restore on a real app window under the pasted extension-mutation scenario.

#### 2026-06-30: Backend-owned sound preference

- Requirements revisited: sound is a user preference, not an autoplay channel, clue dependency, or browser-storage setting.
- Product direction review: optional sound can support the calm desktop identity only if muted remains deterministic and user-controlled.
- Desktop preferences now include a bounded `sound` setting with `muted` as the deterministic default and `on` as the only enabled value.
- The Settings app exposes Sound controls without adding audio assets, autoplay behavior, browser storage, or a new rendering dependency.
- Text clients can use `theme pref sound muted|on`, and `desktop export` includes the sound preference with the rest of the presentation snapshot.
- Resetting preferences returns sound to `muted`, keeping sound optional and user-controlled.
- Hydration smoke toggles Sound in Settings while the extension-mutation hook is active.

#### 2026-06-30: Backend-owned keyboard mode

- Requirements revisited: keyboard mode is a bounded preference that must reduce shortcut conflicts without automating interaction.
- Product direction review: terminal-priority and desktop-priority modes let the same shell serve command-first and window-first players.
- Player surface: Settings now exposes keyboard mode as a desktop preference for choosing whether global Windows-style shortcuts or the terminal input path should receive priority.
- Authority boundary: keyboard mode is server-owned presentation state in `DesktopPrefs`, normalized through the shell API and never treated as gameplay authority.
- Parity path: text clients can use `theme pref keyboard desktop|terminal`, and `desktop export` includes `keyboardMode` with the other bounded presentation preferences.
- Hydration and renderer risk: the control is semantic DOM inside the existing Settings window and adds no SVG, canvas, WebGL, WASM, browser storage, or renderer dependency.
- Quality-of-life rule: terminal mode suppresses desktop-wide Ctrl+Escape and Alt+Tab handling while preserving Escape for closing transient overlays, reducing shortcut interference without adding automation.
- Verification covered rendering constraints, TypeScript, 56 acceptance tests, the headless Chromium hydration smoke with the extension-style mutation hook, and the production build.

#### 2026-06-30: Backend-owned host and route bookmarks

- Requirements revisited: remembering hosts and routes can reduce tedium, but it must not grant access, mark route completion, or publish solution prose.
- Product direction review: bookmarks are a workstation-native memory aid that supports return visits and route observation without replacing player inference.
- Player surface: Network Places and Help now expose a persistent bookmark layer for remembered hosts and computed routes, turning route memorization into an in-world workstation affordance.
- Authority boundary: bookmarks are session-owned server state in `ShellSessionState.desktopBookmarks`; the browser receives snapshots but creates and removes entries through shell commands rather than trusted client claims.
- Parity path: text clients can use `bookmarks`, `bookmark add <host> [label]`, `bookmark route <host> [label]`, `bookmark rm <id|host>`, and `bookmark clear`; the plain route shows bookmark count in its status strip.
- Puzzle discipline: bookmarks store player observations and backend-computed routes, but they do not publish puzzle answers or grant access, ownership, rewards, or route completion.
- Historical texture: the feature reads like saved Network Places shortcuts and help-desk notes rather than a modern quest log, keeping orientation inside the period desktop metaphor.
- Hydration and renderer risk: bookmark display uses semantic DOM rows and existing CSS glyph chrome; it adds no browser storage, SVG shell iconography, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, TypeScript, 57 acceptance tests, the headless Chromium hydration smoke with a bookmark command and Network Places check under the extension-style mutation hook, and the production build.

#### 2026-06-30: Server-owned command history search

- Requirements revisited: history search can improve command fluency, but it must not become an automated solver or browser-only memory source.
- Product direction review: command history belongs to the workstation because it makes repeated use calmer while preserving player choice.
- Player surface: Terminal, My Nodes, Logs, the plain route, and `history [search]` now use a bounded recent-command list owned by the backend session rather than only the browser's arrow-key buffer.
- Authority boundary: command history is support state in `ShellSessionState.commandHistory`; it records observations about submitted commands but does not grant access, solve clues, complete routes, or mutate host control.
- Parity path: JavaScript and no-JS clients both submit through the shell API, so `history`, `history <term>`, desktop Logs, and plain HTML status all read the same server-owned list.
- Quality-of-life rule: the React terminal may hydrate its local arrow-key buffer from server history, but browser storage remains unused and the backend list is still the source of truth.
- Hydration and renderer risk: command history display is text and semantic DOM only; it adds no SVG shell iconography, canvas, WebGL, WASM, browser storage, or heavyweight runtime dependency.
- Verification covered rendering constraints, TypeScript, 58 acceptance tests, the headless Chromium hydration smoke with `history relay` under the extension-style mutation hook, and the production build.

#### 2026-06-30: Server-owned desktop task queue

- Requirements revisited: background work can be visible and manageable, but task rows must not complete access, defense, transfer, or clue outcomes by client assertion.
- Product direction review: task queues make the shell feel like a working computer while keeping mutating verbs on backend commands.
- Player surface: Tasks now shows queued scan, transfer, and maintenance items from server state, making the desktop feel like a workstation with active background work instead of static panels.
- Authority boundary: tasks are support state in `ShellSessionState.desktopTasks`; queuing or completing a task does not grant access, secure a host, finish a transfer, solve a clue, or claim rewards.
- Parity path: text clients can use `tasks`, `task scan <host> [label]`, `task transfer <target> [label]`, `task maint <host> [label]`, `task done <id|target>`, and `task clear`; queued tasks also appear in `ps` and can be marked done with `kill <pid>`.
- Historical texture: the model reads as Task Scheduler/process-list work rather than a modern quest log, matching the Windows administrative surface in the product direction.
- Hydration and renderer risk: task display uses server snapshots, command output, and existing DOM rows; it adds no SVG shell iconography, canvas, WebGL, WASM, browser storage, or heavyweight runtime dependency.
- Verification covered rendering constraints, TypeScript, 58 acceptance tests, the headless Chromium hydration smoke with `task scan relay` and a Tasks-window check under the extension-style mutation hook, and the production build.

#### 2026-06-30: Server-owned desktop event journal

- Requirements revisited: audit trails can expose what happened, but they must not create privileged facts or accept client-written history.
- Product direction review: the Logs surface must support the computer-first shell, not merely repeat status text; a backend-owned event journal is the smallest durable step toward readable workstation audit trails.
- Player surface: Logs now shows recorded event count, last event, and recent event summaries from server snapshots; text clients can use `events`, `eventvwr`, or `logs` with optional search text.
- Authority boundary: events are support/audit state in `ShellSessionState.desktopEvents`; they record bookmark and task mutations but do not grant access, secure hosts, finish jobs, solve clues, or claim rewards.
- Parity path: JavaScript and no-JS clients submit through the same shell API, and the plain route exposes event count alongside bookmarks, history, and queued tasks.
- Historical texture: the alias and Logs window read as Event Viewer-style workstation administration while staying inside the period desktop metaphor.
- Hydration and renderer risk: the journal is bounded JSON plus semantic DOM rows; it adds no SVG shell iconography, canvas, WebGL, WASM, browser storage, or heavyweight runtime dependency.
- Verification covered rendering constraints, TypeScript, 59 acceptance tests, the headless Chromium hydration smoke with a command-created event visible in Logs under the extension-style mutation hook, and the production build.

#### 2026-06-30: Backend-derived Files window entries

- Requirements revisited: file browsing can reveal visible artifacts, but path visibility, file contents, and mutation rights must remain backend-derived.
- Product direction review: Files must become a workstation surface over the same shell file model, not a static count panel or a browser-only directory mock.
- Player surface: Files now displays a bounded list of visible host, download, and home entries from the backend snapshot, including home-file count and recent visible names.
- Authority boundary: file entries are derived from current host files, server-tracked downloads, and durable user files; the browser receives the list but cannot submit file ownership, path visibility, or file contents as trusted state.
- Parity path: text clients can use `files [search]` before or after login, while existing `cat`, `write`, `append`, `cp`, `mv`, and `rm` keep the durable home-file behavior for authenticated sessions.
- Audit path: write, append, copy, move, and remove operations add support events to the server-owned desktop journal without changing access, rewards, or route completion.
- Hydration and renderer risk: file rows are bounded JSON plus semantic DOM text; the smoke verifies the Files window under the extension-style mutation hook and still uses no SVG shell iconography, canvas, WebGL, WASM, browser storage, or heavyweight runtime dependency.
- Verification covered rendering constraints, TypeScript, 60 acceptance tests, the headless Chromium hydration smoke with `files motd` and a Files-window check, and the production build.

#### 2026-06-30: Backend-derived Mail window summaries

- Requirements revisited: mail can carry notices and context, but delivery state and read/write behavior must remain backend-owned and text-reachable.
- Product direction review: Mail must be a workstation communication surface over the same durable spool used by the shell, not only a static inbox counter.
- Player surface: Mail now displays bounded message summaries from the backend snapshot, including message count and a latest-message preview.
- Authority boundary: `desktopMail` is derived from transient session messages plus durable mail rows; the browser receives summaries but cannot submit trusted message state, delivery claims, or read progress.
- Parity path: text clients can use `mailbox [search]`, while existing `inbox`, `mail <host>`, `compose`, `send`, and `read` keep their protocol behavior.
- Audit path: sending mail records a support event in the server-owned desktop journal without changing access, rewards, host control, or route completion.
- Hydration and renderer risk: Mail rows are bounded JSON plus semantic DOM text; the smoke verifies `mailbox` and the Mail window under the extension-style mutation hook with no new rendering dependency.
- Verification covered rendering constraints, TypeScript, 61 acceptance tests, the headless Chromium hydration smoke with `mailbox` and a Mail-window check, and the production build.

#### 2026-06-30: Backend-derived Boards window summaries

- Requirements revisited: boards can expose social/network texture and clue channels, but posts, visibility, and progression hints must stay bounded by server state and spoiler discipline.
- Product direction review: Boards must surface the same BBS and USENET material as the command protocols, not a static hint panel.
- Player surface: Boards now displays bounded message/article summaries from the backend snapshot, including visible item count, latest subject, and USENET totals.
- Authority boundary: `desktopBoards` is derived from current-host BBS messages plus built-in and durable USENET articles; the browser receives summaries but cannot submit trusted posts, board visibility, or progression claims.
- Parity path: text clients can use `boards [search]`, while existing `bbs`, `news`, `group`, `list`, `read`, `post`, and BBS read/post flows keep their protocol behavior.
- Audit path: BBS and USENET posts record support events in the server-owned desktop journal without changing access, rewards, host control, or route completion.
- Hydration and renderer risk: board rows are bounded JSON plus semantic DOM text; the smoke verifies `boards route` and the Boards window under the extension-style mutation hook with no new rendering dependency.
- Verification covered rendering constraints, TypeScript, 62 acceptance tests, the headless Chromium hydration smoke with `boards route` and a Boards-window check, and the production build.

#### 2026-06-30: Backend-derived Network Places entries

- Requirements revisited: network views can reduce route disorientation, but reachability, ownership, and traversal facts must be computed by the backend.
- Product direction review: Network Places must reflect the host graph, access state, bookmarks, and route visibility from the backend rather than only showing route depth and bookmark labels.
- Player surface: Network now displays bounded visible host summaries from the backend snapshot, including local/current host, neighbors, owned hosts, bookmarked hosts, access level, route hops, ports, and BBS capability.
- Authority boundary: `desktopNetwork` is derived from the server host graph plus session-owned access and bookmark state; the browser receives summaries but cannot submit trusted reachability, ownership, route completion, or access claims.
- Parity path: text clients can use `network [search]`, while existing `hosts`, `trace`, `uupath`, `uumap`, `netstat`, `bookmark route`, `wardial`, and `porthack` keep their progression behavior.
- Quality-of-life rule: bookmarked hosts stay visible even when they are not immediate neighbors, and owned hosts surface their login/root state without granting new privileges.
- Hydration and renderer risk: network rows are bounded JSON plus semantic DOM text; the smoke verifies `network relay` and the Network Places window under the extension-style mutation hook with no new rendering dependency.
- Verification covered rendering constraints, TypeScript, 63 acceptance tests, the headless Chromium hydration smoke with `network relay` and a Network Places check, and the production build.

#### 2026-06-30: Backend-derived My Nodes entries

- Requirements revisited: node inventory can clarify where the player stands, but it must not fabricate control or expose privileged hosts before valid transitions.
- Product direction review: My Nodes must be a workstation inventory of the operator's actual current, home, login, and root systems rather than only access counters.
- Player surface: My Nodes now displays bounded node summaries from the backend snapshot, including role, access, route hops, ports, and organization.
- Authority boundary: `desktopNodes` is derived from current host, home host, and session-owned access state; the browser receives summaries but cannot submit trusted ownership, route completion, or privilege claims.
- Parity path: text clients can use `nodes [search]`, while existing `owned`, `netstat`, `wardial`, `porthack`, `rootkit`, and `secure` keep their progression behavior.
- Quality-of-life rule: current and home systems remain visible even before login, while login/root systems appear only after valid server transitions.
- Hydration and renderer risk: node rows are bounded JSON plus semantic DOM text; the smoke verifies `nodes` and the My Nodes window under the extension-style mutation hook with no new rendering dependency.
- Verification covered rendering constraints, TypeScript, 64 acceptance tests, the headless Chromium hydration smoke with `nodes` and a My Nodes-window check, and the production build.

#### 2026-06-30: Backend-derived Security Center posture

- Requirements revisited: defense information can be visible, but hardening, takeover, camp, tunnel, and recovery outcomes must remain backend-validated.
- Product direction review: Security Center must advance the control-and-defense loop as a workstation administration surface, not as a browser-side protection toggle or decorative shield panel.
- Player surface: Security now displays bounded posture summaries for current, home, accessed, camped, and tunneled systems, including access level, root owner, exposed ports, checks, and suggested command-equivalent actions.
- Authority boundary: `desktopSecurity` is derived from host metadata, session-owned access state, host root-owner rows, camp state, and tunnel state; the browser receives posture facts but cannot submit trusted protection, ownership, route completion, or hardening claims.
- Parity path: text clients can use `security [search]`, while existing `inspect`, `ps`, `secure`, `takeover`, `task maint`, `camp`, and `tunnel` remain the progression and audit commands.
- Quality-of-life rule: the surface reduces ambiguity around what needs inspection or maintenance without automating access, route choice, exploit use, or recovery.
- Historical texture: the window reads as an early Security Center/Event Viewer/Services-adjacent administrative pane using ports, owners, checks, and command actions instead of modern score badges.
- Hydration and renderer risk: the feature adds bounded JSON plus semantic DOM rows and a CSS-only glyph; it adds no server-rendered SVG, browser storage authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, TypeScript, 65 acceptance tests, the headless Chromium hydration smoke with `security relay` and a Security Center window check, and the production build.

#### 2026-06-30: Backend-derived Services administration surface

- Requirements revisited: service visibility can guide inspection, but daemon state, access, hardening, and connection outcomes must not be client-authored.
- Product direction review: Services must make the workstation feel like an administrative computer with visible daemons and ports, not just a host counter or modern vulnerability scanner.
- Player surface: Services now displays bounded service rows for visible hosts, including host, port, period service name, reachability status, access level, banner text, and suggested command-equivalent actions.
- Authority boundary: `desktopServices` is derived from backend host metadata, visible Network Places rows, and session-owned access state; the browser receives rows but cannot submit trusted service state, daemon control, access claims, or hardening results.
- Parity path: text clients can use `services [search]`, while existing `netstat`, `inspect`, `security`, `ftp`, `telnet`, `gopher`, `news`, `irc`, `trace`, and `task scan|maint` remain the action paths.
- Quality-of-life rule: service rows reduce route and command ambiguity by mapping ports to plausible period services, but they do not automate connection choice, exploitation, defense, or puzzle progression.
- Historical texture: the surface reads as an NT/2000 Services and Network Neighborhood hybrid using FTP, Telnet, Gopher, NNTP, SMTP, IRC, POP3, IMAP, HTTP, and banner-style clues.
- Hydration and renderer risk: service rows are bounded JSON plus semantic DOM text and a CSS-only glyph; it adds no server-rendered SVG, browser storage authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, TypeScript, 66 acceptance tests, the headless Chromium hydration smoke with `services telnet` and a Services window check, and the production build.

#### 2026-06-30: Backend-derived Shared Folders surface

- Requirements revisited: share browsing can expose file affordances, but permissions, mounts, write access, and copied data must remain server-derived and command-mutated.
- Product direction review: Shared Folders must express Network Neighborhood-style file affordances over the same backend files and visible host graph, not a browser-owned filesystem mock.
- Player surface: Shares now displays bounded share rows for visible host public areas, logged-in home storage, and downloaded files, including host, share name, kind, access, mode, file count, path, and suggested command-equivalent actions.
- Authority boundary: `desktopShares` is derived from backend host files, user file rows, downloaded-file state, Network Places visibility, and session-owned access; the browser receives summaries but cannot submit trusted share permissions, file counts, write access, or mounted path claims.
- Parity path: text clients can use `shares [search]`, while existing `files`, `cat`, `write`, `append`, `cp`, `mv`, `rm`, `cd`, `ftp`, and `bookmark` remain the action and mutation paths.
- Quality-of-life rule: the surface reduces ambiguity around where files live and what is writable without granting access, copying files, mounting paths, or solving clue chains automatically.
- Historical texture: the feature reads as Windows Network Neighborhood and shared-folder browsing, using UNC-style paths, read/write mode labels, public shares, home storage, and downloads.
- Hydration and renderer risk: share rows are bounded JSON plus semantic DOM text and a CSS-only glyph; it adds no server-rendered SVG, browser storage authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, TypeScript, 67 acceptance tests, the headless Chromium hydration smoke with `shares public` and a Shared Folders window check, and the production build.

#### 2026-06-30: Backend-derived Printers and queue surface

- Requirements revisited: queue browsing can add period texture and clue channels, but it must not invoke native printing, accept client queue claims, or complete hidden progress automatically.
- Product direction review: Printers must add a period workstation affordance and a subtle clue channel through queues and held jobs, not a browser-side print dialog or operating-system integration.
- Player surface: Printers now displays bounded queue rows for visible files, queued transfer tasks, and recent events, including host, queue, status, document, source, page count, and suggested command-equivalent actions.
- Authority boundary: `desktopPrint` is derived from backend task state, visible file projections, and server-owned event rows; the browser receives summaries but cannot submit trusted print jobs, queue status, documents, pages, or clue completion.
- Parity path: text clients can use `printers [search]` or `printq [search]`, while existing `files`, `cat`, `task transfer`, `task done`, `events`, and `logs` remain the action and mutation paths.
- Quality-of-life rule: the surface makes queued work and printable artifacts easier to inspect without performing transfers, printing files, clearing queues, or progressing puzzles automatically.
- Historical texture: the feature reads as Windows Printers and Event Viewer-adjacent queue browsing with LPT-style queues, held jobs, file printouts, and event-log sheets.
- Hydration and renderer risk: print rows are bounded JSON plus semantic DOM text and a CSS-only glyph; it adds no server-rendered SVG, browser storage authority, native print API, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, TypeScript, 68 acceptance tests, the headless Chromium hydration smoke with `printq motd` and a Printers window check, and the production build.

#### 2026-06-30: Backend-derived Registry Editor surface

- Requirements revisited: registry browsing can expose period workstation state and clue-bearing configuration texture, but it must not reveal raw secrets, accept arbitrary client keys, grant access, or complete hidden progress automatically.
- Product direction review: Registry Editor belongs in the computer-first shell as an NT/2000/XP/7 administrative surface over backend state, not as a browser-local settings dump or terminal-only diagnostic.
- Player surface: Registry now displays bounded HKCU, HKU, and HKLM-style rows for desktop theme, active/open windows, preferences, bookmarks, command history, queued tasks, audit events, identity, host metadata, route depth, owned systems, and stealth timers.
- Authority boundary: `desktopRegistry` is derived from normalized backend session state, preferences, host metadata, access state, bookmarks, tasks, events, and a non-secret SSH key fingerprint summary; the browser receives summaries but cannot submit trusted keys, hives, credentials, access claims, route completion, or registry mutations.
- Parity path: text clients can use `registry [search]` or `reg query [search]`, while existing `theme`, `theme pref`, `desktop`, `bookmarks`, `history`, `tasks`, `events`, `whoami`, `nodes`, `network`, `services`, `owned`, `camp`, and `tunnel` remain the action and mutation paths.
- Quality-of-life rule: the surface centralizes workstation state without automating observation, routing, access, defense, or puzzle progression.
- Historical texture: the feature reads as RegEdit/System Properties-adjacent inspection with HKCU/HKLM/HKU hives, Control Panel desktop preferences, Explorer bookmark counters, TCP/IP parameters, service route state, and system watcher keys.
- Hydration and renderer risk: registry rows are bounded JSON plus semantic DOM text and a CSS-only glyph; it adds no server-rendered SVG, browser storage authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, TypeScript, 69 acceptance tests, the headless Chromium hydration smoke with `reg query theme` and a Registry Editor window check, and the production build.

#### 2026-06-30: Backend-derived Dial-Up Networking surface

- Requirements revisited: connection browsing can reduce route confusion and add period network texture, but it must not initiate real external connectivity, accept browser-authored routes, grant access, or mark traversal progress by client claim.
- Product direction review: Dial-Up Networking belongs in the computer-first shell as a Windows-era route and connection folder over the simulated host graph, not as a modern network monitor or real network bridge.
- Player surface: Dial-Up now displays bounded connection rows with generated modem-style numbers, speeds, status, access, route depth, last-seen labels, and command-equivalent actions for local, visible, bookmarked, tunneled, and watched hosts.
- Authority boundary: `desktopDialup` is derived from backend Network Places visibility, normalized bookmarks, current host, camp state, tunnel state, and server-computed routes; the browser receives summaries but cannot submit trusted phone numbers, route reachability, connection state, access claims, or traversal completion.
- Parity path: text clients can use `dialup [search]`, while existing `network`, `trace`, `telnet`, `bookmark route`, `task scan`, `task maint`, `camp`, `tunnel`, and `events` remain the action and mutation paths.
- Quality-of-life rule: the surface makes routes and saved connections easier to inspect without dialing for the player, bypassing hop memory, solving route puzzles, or automating access/defense.
- Historical texture: the feature reads as Windows Dial-Up Networking and RAS-style connection management with saved route entries, modem numbers, speed labels, local area status, and watcher/tunnel state.
- Hydration and renderer risk: dial-up rows are bounded JSON plus semantic DOM text and a CSS-only modem glyph; it adds no server-rendered SVG, browser storage authority, native networking, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, TypeScript, 70 acceptance tests, the headless Chromium hydration smoke with `dialup relay` and a Dial-Up Networking window check, and the production build.

#### 2026-06-30: Backend-derived Device Manager surface

- Requirements revisited: device inspection can make the workstation feel physically and administratively coherent, but it must not expose real hardware, invoke native device APIs, accept client-authored device state, grant access, or complete maintenance outcomes automatically.
- Product direction review: Device Manager belongs in the computer-first shell as an NT/2000/XP/7 administrative inventory over simulated host/session state, not as a modern browser capability surface or decorative hardware list.
- Player surface: Device Manager now displays bounded device rows for the current computer, terminal, home storage, UUCP adapter, visible service controllers, dial-up modems, print queues, and queued task controllers, including host, class, status, device name, driver, resource, and command-equivalent actions.
- Authority boundary: `desktopDevices` is derived from backend host metadata, shell mode, TTY state, pager state, user file rows, Network Places, Dial-Up Networking, Services, Printers, queued tasks, and access state; the browser receives summaries but cannot submit trusted devices, drivers, resources, warnings, job status, maintenance claims, or hardware state.
- Parity path: text clients can use `devices [search]` or `devmgmt [search]`, while existing `services`, `dialup`, `printers`, `tasks`, `events`, `files`, `shares`, `network`, `trace`, `stty`, `status`, and `inspect` remain the action and mutation paths.
- Quality-of-life rule: the surface reduces ambiguity around simulated components and busy/warning states without automating repair, connection, route selection, access escalation, or puzzle progression.
- Historical texture: the feature reads as Windows Device Manager with computer, terminal, storage, modem, printer, port/controller, and system job classes represented through period-style driver/resource labels.
- Hydration and renderer risk: device rows are bounded JSON plus semantic DOM text and a CSS-only device glyph; it adds no server-rendered SVG, browser storage authority, native hardware APIs, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, TypeScript, 71 acceptance tests, the headless Chromium hydration smoke with `devices modem` and a Device Manager window check, and the production build.

#### 2026-06-30: Backend-derived System Properties surface

- Requirements revisited: system summary can explain identity and resources, but it must not expose real hardware, native operating-system APIs, browser-authored license/resource claims, or progression authority.
- Product direction review: System Properties belongs in the computer-first shell as a Windows NT/2000/XP/7 identity and resource panel over backend state, not as a terminal-only banner or client-side environment probe.
- Player surface: System Properties now displays bounded rows for shell version/theme, computer name, organization, registered user, access state, disk quota, system level, device count, route depth, stealth timers, desktop preferences, window state, activity, archive counts, mail, boards, files, and tasks.
- Authority boundary: `desktopSystem` is derived from backend host, user, route, progression, device, network, preference, session, and content state; the browser receives summaries but cannot submit trusted identity, resources, license, access, route, defense, or progress claims.
- Parity path: text clients can use `system [search]`, `sysdm [search]`, and `winver`, while existing `theme`, `status`, `nodes`, `network`, `devices`, `files`, `boards`, `mailbox`, `tasks`, `events`, `registry`, and `desktop` remain the action and inspection paths.
- Quality-of-life rule: the surface centralizes workstation identity and resource state without automating access, defense, route choice, command selection, or puzzle progress.
- Historical texture: the feature reads as System Properties and `winver` using period profile labels, registered-to identity, computer name, organization, resource rows, and administrative tab-style grouping.
- Hydration and renderer risk: system rows are bounded JSON plus semantic DOM text and a CSS-only system glyph; it adds no server-rendered SVG, browser storage authority, native system APIs, license probing, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, TypeScript, 72 acceptance tests, the headless Chromium hydration smoke with `system version`, `winver`, and a System Properties window check, and the production build.

#### 2026-06-30: Backend-derived Control Panel applets

- Requirements revisited: Control Panel can centralize workstation affordances and period navigation, but it must not become a client-side command launcher that fabricates settings, devices, access, resources, or progress.
- Product direction review: Control Panel belongs in the computer-first shell as a Windows NT/2000/XP/7 administrative hub over existing backend surfaces, bridging Settings, System Properties, Device Manager, Network Connections, Security Center, Services, Shared Folders, Printers, Registry, Folder Options, Mail/News, Scheduled Tasks, and Help.
- Player surface: Control Panel now displays bounded applet rows with category, applet name, status, source, and command-equivalent actions; the desktop window summarizes applet count, admin applets, appearance state, and backend source.
- Authority boundary: `desktopControl` is derived from backend system, preference, device, network, dial-up, security, service, share, print, registry, file, board, mail, task, event, history, and bookmark state; the browser receives summaries but cannot submit trusted applets, resources, preferences, devices, routes, access, or completion claims.
- Parity path: text clients can use `control [search]`, `control panel [search]`, and `cpl [search]`, while existing `theme`, `theme pref`, `system`, `devices`, `network`, `dialup`, `security`, `services`, `shares`, `printers`, `registry`, `files`, `mailbox`, `boards`, `tasks`, `events`, `history`, and `bookmarks` remain the action and mutation paths.
- Quality-of-life rule: the surface makes the workstation easier to navigate without automating command choice, access, defense, route selection, repair, or puzzle progress.
- Historical texture: the feature reads as Control Panel with applet categories and `.cpl` alias behavior, using Display, Keyboard, Network Connections, Folder Options, Scheduled Tasks, Mail and News, and administrative applets instead of a modern dashboard.
- Hydration and renderer risk: control rows are bounded JSON plus semantic DOM text and a CSS-only Control Panel glyph; it adds no server-rendered SVG, browser storage authority, native OS panels, canvas renderer, WebGL, WASM, or heavyweight runtime dependency. Hydration smoke now matches app windows by titlebar text because Control Panel applet summaries intentionally mention other window titles.
- Verification covered rendering constraints, TypeScript, 73 acceptance tests, the headless Chromium hydration smoke with `control panel display` and a Control Panel window check, and the production build.

#### 2026-06-30: Backend-derived Task Manager process surface

- Requirements revisited: process inspection can make the workstation feel operational and accountable, but it must not let the browser invent processes, kill protected work, bypass login gates, or complete tasks without backend command validation.
- Product direction review: Task Manager belongs in the computer-first shell as an NT/2000/XP/7 process view over shell state, queued desktop tasks, foreground protocol modes, links, camps, and tunnels, not as a client runtime monitor or browser performance panel.
- Player surface: Task Manager now displays bounded process rows with PID, TTY, user, host, command, status, source, and command-equivalent actions; the desktop window summarizes process count, queued process count, foreground mode, and backend source.
- Authority boundary: `desktopProcesses` is derived from backend local process rows, shell mode, queued tasks, link target, camp state, and tunnel state; the browser receives summaries but cannot submit trusted processes, PIDs, task completion, link state, route state, or kill claims.
- Parity path: text clients can use `taskmgr [search]`, while existing `ps`, `kill <pid>`, `tasks`, `task done <id|target>`, `link`, `unlink`, `camp`, `tunnel`, and protocol `quit` paths remain the action and mutation paths. The implementation keeps `taskmgr` readable before login but preserves `kill` as a logged-in backend mutation.
- Quality-of-life rule: the surface makes running shell work and queued jobs easier to understand without automating cleanup, route defense, task completion, or process termination.
- Historical texture: the feature reads as Windows Task Manager using process rows, PIDs, foreground jobs, queued background work, and kill/task actions while preserving the established `ps`/`kill` command grammar.
- Hydration and renderer risk: process rows are bounded JSON plus semantic DOM text and a CSS-only Task Manager glyph; it adds no server-rendered SVG, browser storage authority, native process APIs, browser performance APIs, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, TypeScript, 74 acceptance tests, the headless Chromium hydration smoke with `taskmgr queued` and a Task Manager window check, and the production build.

#### 2026-06-30: Backend-derived Scheduled Tasks surface

- Requirements revisited: scheduled work can make the computer feel alive and administrable, but it must not let the browser author timers, claim completion, start real jobs, bypass login gates, or mutate queued work outside the backend task commands.
- Product direction review: Scheduled Tasks belongs in the computer-first shell as an NT/2000/XP administrative scheduler over queued tasks and ambient maintenance, distinct from Task Manager's process view and the simpler Tasks queue.
- Player surface: Scheduled Tasks now displays bounded schedule rows with name, trigger, target, status, last run, next run, source, and command-equivalent actions; the desktop window summarizes schedule count, queued task count, running ambient jobs, and backend source.
- Authority boundary: `desktopSchedule` is derived from backend desktop tasks, event journal, mailbox state, board activity, camp state, tunnel state, and current host; the browser receives summaries but cannot submit trusted timers, task completion, mailbox activity, route watcher state, or schedule mutations.
- Parity path: text clients can use `scheduler [search]` and `schtasks /query [search]`, while existing `task scan|transfer|maint`, `task done`, `tasks`, `events`, `mailbox`, `boards`, `camp`, `tunnel`, and `who` remain the action and mutation paths.
- Quality-of-life rule: the surface separates queued work and ambient maintenance from immediate processes, reducing ambiguity without automating scans, transfers, route defense, board refreshes, mail delivery, or event cleanup.
- Historical texture: the feature reads as Windows Scheduled Tasks with `schtasks /query` behavior, manual triggers, queued jobs, log rotation, mail spool sweeps, board index refresh, and route watcher rows.
- Hydration and renderer risk: schedule rows are bounded JSON plus semantic DOM text and a CSS-only Scheduled Tasks glyph; it adds no server-rendered SVG, browser storage authority, native scheduler APIs, timers as authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency. Hydration smoke now matches app windows by exact title text so `Scheduled Tasks` cannot satisfy the `Tasks` window check.
- Verification covered rendering constraints, TypeScript, 75 acceptance tests, the headless Chromium hydration smoke with `scheduler route` and a Scheduled Tasks window check, and the production build.

#### 2026-06-30: Backend-derived Internet Options surface

- Requirements revisited: internet settings can add period browser/network control texture, but they must not invoke real browser APIs, store authority in browser storage, initiate external connectivity, or let the client claim zones, cache, protocol state, access, or security posture.
- Product direction review: Internet Options belongs in the computer-first shell as an NT/2000/XP/7 Control Panel surface over simulated network/protocol state, not as a real browser settings panel or modern web dashboard.
- Player surface: Internet Options now displays bounded tab/zone/setting rows for home page, temporary files, local intranet visibility, restricted exposed services, remembered sites, enabled protocol readers, dial-up routes, LAN service ports, and accessibility-related advanced settings.
- Authority boundary: `desktopInternet` is derived from backend current host/cwd, visible files/downloads, bookmarks, Network Places, Dial-Up Networking, Security Center, Services, desktop preferences, and command protocol availability; the browser receives summaries but cannot submit trusted zones, cache state, cookies, protocol enablement, network settings, or security claims.
- Parity path: text clients can use `internet [search]` and `inetcpl [search]`, while existing `network`, `dialup`, `services`, `security`, `files`, `shares`, `ftp`, `gopher`, `news`, `mail`, `irc`, `bookmarks`, and `theme pref` remain the action and mutation paths.
- Quality-of-life rule: the surface centralizes web-era connection/security/cache orientation without automating routes, downloads, protocol use, browser behavior, access, defense, or puzzle progress.
- Historical texture: the feature reads as Internet Options/INETCPL with General, Security, Privacy, Content, Connections, and Advanced tabs, plus temporary files, zones, dial-up/LAN settings, and enabled protocol readers.
- Hydration and renderer risk: internet rows are bounded JSON plus semantic DOM text and a CSS-only globe/options glyph; it adds no server-rendered SVG, browser storage authority, real browser settings API, network API, cookie API, cache API, canvas renderer, WebGL, WASM, or heavyweight runtime dependency. Hydration smoke now creates the queued task before later window assertions so Task Manager/Scheduled Tasks proof is not dependent on a late command after expanded Registry output.
- Verification covered rendering constraints, TypeScript, 76 acceptance tests, the headless Chromium hydration smoke with `internet security` and an Internet Options window check, and the production build.

#### 2026-06-30: Backend-derived Display Properties surface

- Requirements revisited: desktop customization is central to the NT/2000/XP/7 shell fantasy, but display state must not call browser screen APIs, infer real monitor details, store authority in browser storage, use SVG/canvas/WebGL/WASM, or let the client assert accessibility, theme, resolution, window state, or progress.
- Product direction review: Display Properties belongs in the computer-first shell as a period Control Panel applet over simulated appearance and work-area state, not as a modern responsive design panel or a real OS/browser settings bridge.
- Player surface: Display Properties now displays bounded tab/setting/value rows for color scheme, generated wallpaper, font size, contrast, motion, sound scheme, work area, active window, window state, and idle narrative.
- Authority boundary: `desktopDisplay` is derived from backend theme, desktop preferences, active app, open/minimized/maximized windows, stored window positions, current host, and session identity; the browser receives summaries but cannot submit trusted display state or real device information.
- Parity path: text clients can use `display [search]` and `desk.cpl [search]`, while existing `theme`, `theme pref`, `desktop open|min|max|restore|move`, `desktop export`, `whoami`, `login`, and `newuser` remain the action and mutation paths.
- Quality-of-life rule: the surface makes customization and active-window layout understandable without automating puzzle progress, window placement, accessibility changes, route movement, or host control.
- Historical texture: the feature reads as Display Properties/DESK.CPL with Themes, Desktop, Appearance, Accessibility, Sounds, Settings, and Screen Saver rows, tied to Windows NT/2000/XP/7 era personalization language.
- Hydration and renderer risk: display rows are bounded JSON plus semantic DOM text and a CSS-only monitor glyph; it adds no server-rendered SVG, browser storage authority, real screen API, media query authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency. Hydration smoke now matches the Settings app by exact title text so the Display Properties `Settings` row cannot be mistaken for the Settings window.
- Verification covered rendering constraints, package TypeScript, 77 acceptance tests, the headless Chromium hydration smoke with `display accessibility` and a Display Properties window check, and the production build. Root TypeScript still fails on pre-existing `src/lib/play/engine-xp.ts` ledger fields outside `packages/cyberscape`.

#### 2026-06-30: Backend-derived Add/Remove Programs surface

- Requirements revisited: installed-software texture helps the computer feel like a Windows NT/2000/XP/7 machine, but it must not become real package management, browser extension enumeration, local filesystem scanning, dependency loading, script installation, or client-asserted capability state.
- Product direction review: Add/Remove Programs belongs in the Control Panel as a period inventory over simulated shell components, protocol handlers, games, tasks, downloads, and user artifacts, not as a modern app store or live package manager.
- Player surface: Add/Remove Programs now displays bounded category/name/version/status rows for the Cyberscape command shell, desktop control pack, protocol clients, mail/news/IRC, interactive-fiction shelf, terminal toys, TeleBASIC, route operations, queued tasks, and downloaded files.
- Authority boundary: `desktopPrograms` is derived from backend desktop app registry, current theme, visible network/content rows, downloads, BASIC user programs, queued tasks, login/root progress, and command availability; the browser receives summaries but cannot install, remove, claim installed components, enumerate real extensions, scan local software, or execute packages.
- Parity path: text clients can use `programs [search]` and `appwiz.cpl [search]`, while existing `games`, `basic`, `ftp/get`, `gopher`, `mail`, `news`, `irc`, `task`, `files`, `wardial`, `porthack`, `rootkit`, and `owned` remain the action and mutation paths.
- Quality-of-life rule: the surface centralizes what the shell can do without adding automation, bypassing command gates, exposing secrets, granting progression, installing dependencies, or altering downloads/tasks outside their existing commands.
- Historical texture: the feature reads as Add/Remove Programs/APPWIZ.CPL with installed/available/downloaded/queued rows, Control Panel linkage, protocol components, games, accessories, and user-installed artifacts.
- Hydration and renderer risk: program rows are bounded JSON plus semantic DOM text and a CSS-only list/package glyph; it adds no server-rendered SVG, browser storage authority, filesystem/package-manager APIs, dynamic imports, canvas renderer, WebGL, WASM, or heavyweight runtime dependency. Hydration smoke now matches the Mail app/window exactly and uses explicit pointer events so added app windows cannot confuse generic text selectors during window-control proof.
- Verification covered rendering constraints, package TypeScript, 78 acceptance tests, the headless Chromium hydration smoke with `programs protocol` and an Add/Remove Programs window check, and the production build. Root TypeScript remains blocked by pre-existing `src/lib/play/engine-xp.ts` ledger fields outside `packages/cyberscape`.

#### 2026-06-30: Backend-derived User Accounts surface

- Requirements revisited: account identity is essential to the personal-computer fantasy, but it must not enumerate browser identities, expose raw key material, leak passwords, treat browser storage as authority, or let the client assert user/session/access state.
- Product direction review: User Accounts belongs in the Control Panel as a period account/session profile over simulated operators, TTYs, keys, badges, and host access, not as a real OS account manager or browser profile bridge.
- Player surface: User Accounts now displays bounded scope/name/value rows for current operator, home host, profile level/quota/badges, SSH key fingerprint, login/root host counts, known local profiles, active operators, current TTY, matching TTY sample, theme profile, personal data counts, and stored profile details.
- Authority boundary: `desktopAccounts` is derived from backend user rows, sanitized shell sessions, progression badges, key fingerprinting, current host, desktop preferences, bookmarks, history, downloads, and login/root access; the browser receives summaries but cannot create accounts, mutate sessions, claim access, enumerate local OS users, or read raw SSH key text.
- Parity path: text clients can use `accounts [search]` and `nusrmgr.cpl [search]`, while existing `newuser`, `login`, `users`, `who`, `finger`, `whoami`, `set key`, `owned`, `netstat`, `porthack`, `secure`, `rootkit`, `theme`, `bookmarks`, `history`, and `files` remain the action and mutation paths.
- Quality-of-life rule: the surface centralizes identity and access orientation without automating login, granting privileges, creating users, confirming CAPTCHAs, changing keys, moving hosts, or exposing sensitive account material.
- Historical texture: the feature reads as User Accounts/NUSRMGR.CPL with current operator, local profile, TTY session, credential fingerprint, access group, and desktop-profile rows in a Windows NT/2000/XP/7 Control Panel style.
- Hydration and renderer risk: account rows are bounded JSON plus semantic DOM text and a CSS-only user-card glyph; it adds no server-rendered SVG, browser storage authority, browser profile APIs, OS account APIs, credential APIs, canvas renderer, WebGL, WASM, or heavyweight runtime dependency. Account TTY rows now use count-plus-sample output so large persisted session tables cannot bloat browser smoke transcripts, and hydration smoke now verifies resulting backend-derived windows/state rather than fragile final transcript retention.
- Verification covered rendering constraints, package TypeScript, 79 acceptance tests, the headless Chromium hydration smoke with `accounts session` and a User Accounts window check, and the production build. Root TypeScript remains blocked by pre-existing `src/lib/play/engine-xp.ts` ledger fields outside `packages/cyberscape`.

#### 2026-06-30: Backend-derived Date/Time Properties surface

- Requirements revisited: time and calendar texture can make the workstation feel operational, but it must not use browser clocks as authority, render variable time in deterministic SSR chrome, accept client time claims, call native/browser calendar APIs, or expose direct puzzle answers through timestamp labels.
- Product direction review: Date/Time Properties belongs in the Control Panel as a period clock, calendar, scheduler, and activity applet over backend shell state, not as a browser locale widget or detached terminal utility.
- Player surface: Date/Time Properties now displays bounded tab/name/value rows for server date, server time, shell zone, sync source, Discordian calendar, queued tasks, ambient jobs, last event, and last command.
- Authority boundary: `desktopTime` is derived from the backend server clock plus normalized scheduler, event, and command-history state; the browser receives summaries but cannot submit trusted dates, time zones, timers, scheduler completion, event facts, or command history.
- Parity path: text clients can use `datetime [search]` and `timedate.cpl [search]`, while existing `date`, `clock`, `when`, `ddate`, `cal`, `scheduler`, `schtasks /query`, `tasks`, `events`, `logs`, and `history` remain the inspection/action paths.
- Puzzle discipline: timestamp and activity rows are channels for sequencing, provenance, and state correlation only; they avoid answer-shaped labels and keep clue interpretation with the player.
- Quality-of-life rule: the surface gathers clock, calendar, activity, and queued-work context without automating observation, route choice, access attempts, defense, task completion, or clue interpretation.
- Historical texture: the feature reads as Date/Time Properties/TIMEDATE.CPL with Date & Time, Time Zone, Internet Time, Calendar, Scheduler, and Activity rows in the Windows NT/2000/XP/7 Control Panel idiom.
- Hydration and renderer risk: time rows are bounded JSON returned by the backend API and rendered as semantic DOM text with a CSS-only clock/calendar glyph; no server-rendered variable time is added to initial markup, and the feature adds no decorative SVG, browser storage authority, browser clock authority, locale formatting dependency, calendar API, timer authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, 80 acceptance tests, the headless Chromium hydration smoke with `datetime scheduler` and a Date/Time Properties window check, and the production build.

#### 2026-06-30: Backend-derived Folder Options surface

- Requirements revisited: file-view configuration is part of the workstation fantasy, but it must not scan the real filesystem, expose local hidden files, store browser authority, or let the client assert file visibility, file types, shares, downloads, or search state.
- Product direction review: Folder Options belongs in the Control Panel as a Windows NT/2000/XP/7 file-view applet over simulated shell files, shares, downloads, bookmarks, history, and preferences, not as a browser file picker or real OS Explorer bridge.
- Player surface: Folder Options now displays bounded tab/option/value rows for open-item behavior, command mutation boundaries, hidden-file visibility, known extensions, protected-file summaries, registered file types, offline cache, shared folders, recent queries, saved places, and Explorer-view accessibility settings.
- Authority boundary: `desktopFolders` is derived from backend file rows, share rows, downloads, home files, command history, bookmarks, desktop preferences, and active desktop state; the browser receives summaries but cannot claim files, extensions, hidden state, shares, cache contents, search history, or writable locations.
- Parity path: text clients can use `folders [search]` and `folderopts [search]`, while existing `files`, `cat`, `write`, `shares`, `registry`, `logs`, `services`, `history`, `find`, `grep`, `bookmarks`, and `theme pref` remain the action and inspection paths.
- Puzzle discipline: folder rows describe visibility rules, provenance, and file-context channels without publishing direct answers, secret names, or answer-shaped filenames.
- Quality-of-life rule: the surface gathers file-view, extension, offline-cache, share, bookmark, and query context without automating file reads, route selection, access attempts, search interpretation, or puzzle progress.
- Historical texture: the feature reads as Folder Options with General, View, File Types, Offline Files, Search, and Accessibility rows, echoing period Explorer and Control Panel language.
- Hydration and renderer risk: folder rows are bounded JSON plus semantic DOM text and a CSS-only folder/options glyph; it adds no server-rendered SVG, browser storage authority, browser file APIs, local filesystem probing, drag/drop file authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, 81 acceptance tests, the headless Chromium hydration smoke with `folders offline` and a Folder Options window check, and the production build.

#### 2026-06-30: Backend-derived Sounds and Audio Devices surface

- Requirements gate result: accepted because the feature adds a period Control Panel inspection surface over existing backend state, keeps commands and plain-client access available, and avoids real browser audio/device APIs, autoplay, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: sound configuration can add workstation tactility, but it must not play real browser audio, enumerate hardware, call media-device APIs, store browser authority, or let the client assert alert, event, or device state.
- Product direction review: Sounds and Audio Devices belongs in the Control Panel as a period MMSYS applet over simulated preferences, events, tasks, devices, mail, print queues, and service state, not as a browser audio mixer or Web Audio feature.
- Player surface: Sounds and Audio Devices now displays bounded tab/item/value rows for master volume, mute, sound scheme, program events, default device, device health, command echo, session alerts, legacy mixer, and visual alerts.
- Authority boundary: `desktopSounds` is derived from backend desktop preferences, normalized events, queued tasks, simulated devices, mail rows, print rows, services, session mode, and theme; the browser receives summaries but cannot claim audio state, devices, mixer state, alerts, hardware health, or notification completion.
- Parity path: text clients can use `sounds [search]` and `mmsys.cpl [search]`, while existing `theme pref sound muted|on`, `events`, `tasks`, `scheduler`, `devices`, `stty`, `mailbox`, `printq`, `services`, `registry`, and `display` remain the action and inspection paths.
- Puzzle discipline: sound rows describe alert channels and provenance without publishing direct answers, secret tones, or answer-shaped event labels.
- Quality-of-life rule: the surface gathers audio, alert, and accessibility context without automating event interpretation, task handling, route decisions, or puzzle progress.
- Historical texture: the feature reads as Sounds and Audio Devices/MMSYS.CPL with Volume, Sounds, Audio, Voice, Hardware, and Accessibility rows, matching Windows 2000/XP-era Control Panel language.
- Hydration and renderer risk: sound rows are bounded JSON plus semantic DOM text and a CSS-only speaker glyph; it adds no server-rendered SVG, browser storage authority, Web Audio, media-device enumeration, autoplay, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, 82 acceptance tests, the headless Chromium hydration smoke with `sounds volume` and a Sounds and Audio Devices window check, and the production build.

#### 2026-06-30: Backend-derived Power Options surface

- Requirements gate result: accepted because the feature adds a Windows-era Control Panel inspection surface over existing backend session state, keeps command and plain-client access available, and avoids browser battery APIs, real power controls, autoplay, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: power management can support the calm recovered-workstation shell, but it must not enumerate real batteries, sleep the browser, control host hardware, store browser authority, or let the client assert task, route, process, device, or idle state.
- Product direction review: Power Options belongs in the computer-first shell as a period POWERCFG applet over simulated preferences, timers, sessions, tasks, devices, processes, routes, and event activity, not as a real OS power manager or modern browser capability panel.
- Player surface: Power Options now displays bounded scheme/setting/value rows for active scheme, monitor policy, power buttons, wake timers, session resume, UPS status, battery placeholder, queued jobs, foreground load, ACPI driver, last event, and idle policy.
- Authority boundary: `desktopPower` is derived from backend desktop preferences, normalized tasks, events, processes, schedule rows, device rows, network rows, open/minimized windows, current host, keyboard mode, and theme; the browser receives summaries but cannot claim battery state, timers, sleep state, foreground load, hardware control, or job completion.
- Parity path: text clients can use `power [search]` and `powercfg.cpl [search]`, while existing `theme pref motion normal|reduced`, `tasks`, `taskmgr`, `scheduler`, `devices`, `network`, `nodes`, `events`, `logs`, `desktop export`, and `status` remain the action and inspection paths.
- Puzzle discipline: power rows describe timer, idle, and provenance channels without publishing direct answers, secret schedules, or answer-shaped power-state labels.
- Quality-of-life rule: the surface gathers session-resume, timer, and activity context without automating route decisions, task handling, access attempts, defense work, or clue interpretation.
- Historical texture: the feature reads as Power Options/POWERCFG.CPL with Power Schemes, Advanced, Hibernate, UPS, Timers, Hardware, and Activity rows, matching Windows 2000/XP-era Control Panel language.
- Hydration and renderer risk: power rows are bounded JSON plus semantic DOM text and a CSS-only power glyph; it adds no server-rendered SVG, browser storage authority, browser battery APIs, real sleep/wake calls, canvas renderer, WebGL, WASM, or heavyweight runtime dependency. The hydration smoke detailed pass now avoids redundant all-window reopening because the separate launcher pass already verifies every app title and the detailed pass should prove representative backend-derived content.
- Verification covered rendering constraints, package TypeScript, 83 acceptance tests, the headless Chromium hydration smoke with `power timers` and a Power Options window check, and the production build.

#### 2026-06-30: Backend-derived Mouse Properties surface

- Requirements gate result: accepted because the feature adds a Windows-era Control Panel inspection surface over existing backend presentation and session state, keeps command and plain-client access available, and avoids browser pointer APIs, hardware enumeration, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: pointer settings can make the workstation shell feel complete, but they must not enumerate real pointing devices, inspect browser pointer state, capture user hardware identity, store browser authority, or let the client assert task, process, device, window, or clue state.
- Product direction review: Mouse Properties belongs in the computer-first shell as a period MAIN.CPL applet over simulated keyboard mode, motion, contrast, theme, windows, tasks, processes, devices, events, and terminal mode, not as a browser pointer manager or modern input-permission panel.
- Player surface: Mouse Properties now displays bounded tab/setting/value rows for button configuration, double-click speed, pointer scheme, pointer shadow, pointer speed, snap-to behavior, scroll lines, pointing device, browser-pointer placeholder, last event, and queued gesture context.
- Authority boundary: `desktopMouse` is derived from backend desktop preferences, normalized tasks, events, process rows, device rows, open/minimized windows, `stty`, keyboard mode, and theme; the browser receives summaries but cannot claim device identity, pointer state, task completion, focus authority, or gameplay progress.
- Parity path: text clients can use `mouse [search]` and `main.cpl [search]`, while existing `theme pref keyboard desktop|terminal`, `theme pref motion normal|reduced`, `theme pref contrast normal|high`, `desktop`, `desktop export`, `taskmgr`, `tasks`, `scheduler`, `devices`, `events`, `logs`, and `stty` remain the action and inspection paths.
- Puzzle discipline: mouse rows describe input, focus, and activity channels without publishing direct answers, secret gestures, or answer-shaped pointer labels.
- Quality-of-life rule: the surface gathers input and window-context facts without automating focus decisions, route choices, access attempts, defense work, or clue interpretation.
- Historical texture: the feature reads as Mouse Properties/MAIN.CPL with Buttons, Pointers, Motion, Wheel, Hardware, and Activity rows, matching Windows 2000/XP-era Control Panel language.
- Hydration and renderer risk: mouse rows are bounded JSON plus semantic DOM text and a CSS-only mouse glyph; it adds no server-rendered SVG, browser storage authority, browser pointer APIs, hardware enumeration, canvas renderer, WebGL, WASM, or heavyweight runtime dependency. The hydration smoke now separates exhaustive app-title launching from representative backend-content checks to avoid stale presentation-write races while still running under the extension-style SVG mutation hook.
- Verification covered rendering constraints, package TypeScript, 84 acceptance tests, the headless Chromium hydration smoke with `mouse buttons` and a Mouse Properties window check, and the production build.

#### 2026-06-30: Backend-derived Keyboard Properties surface

- Requirements gate result: accepted because the feature turns the existing Keyboard Control Panel hint into a real backend-derived applet, keeps command and plain-client access available, and avoids browser keylogging, hardware enumeration, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: keyboard configuration can make the workstation shell feel complete, but it must not capture raw browser keystrokes, infer hardware identity, store browser authority, or let the client assert command history, focus, task, event, or progression state.
- Product direction review: Keyboard Properties belongs in the computer-first shell as a period KBD.CPL applet over simulated shortcut priority, terminal mode, repeat cadence, layout, command history, devices, processes, tasks, and events, not as a browser keyboard-permission panel.
- Player surface: Keyboard Properties now displays bounded tab/setting/value rows for repeat delay, repeat rate, shortcut priority, terminal mode, input locale, command history, keyboard device, browser-key placeholder, foreground process, queued task, and last event.
- Authority boundary: `desktopKeyboard` is derived from backend desktop preferences, normalized command history, tasks, events, process rows, device rows, `stty`, shell mode, TTY port, keyboard mode, and theme; the browser receives summaries but cannot claim key events, shortcut state, task completion, command history, focus authority, or gameplay progress.
- Parity path: text clients can use `keyboard [search]` and `kbd.cpl [search]`, while existing `theme pref keyboard desktop|terminal`, `theme pref motion normal|reduced`, `stty`, `status`, `desktop`, `history`, `logs`, `taskmgr`, `tasks`, `scheduler`, `devices`, and `events` remain the action and inspection paths.
- Puzzle discipline: keyboard rows describe input, history, and focus channels without publishing direct answers, secret key sequences, or answer-shaped shortcut labels.
- Quality-of-life rule: the surface gathers keyboard and terminal-mode facts without automating command choice, focus decisions, route choices, access attempts, defense work, or clue interpretation.
- Historical texture: the feature reads as Keyboard Properties/KBD.CPL with Speed, Input, Layout, Hardware, and Activity rows, matching Windows NT/2000/XP-era Control Panel language.
- Hydration and renderer risk: keyboard rows are bounded JSON plus semantic DOM text and a CSS-only keyboard glyph; it adds no server-rendered SVG, browser storage authority, browser keylogging, hardware enumeration, canvas renderer, WebGL, WASM, or heavyweight runtime dependency. The hydration smoke now attaches to Chromium's initial page target, retries one closed-target CDP race, and keeps detailed applet checks representative while exhaustive launcher-title coverage remains separate.
- Verification covered rendering constraints, package TypeScript, 85 acceptance tests, the headless Chromium hydration smoke with `keyboard input` and a Keyboard Properties window check, and the production build.

#### 2026-06-30: Backend-derived Accessibility Options surface

- Requirements gate result: accepted because the feature adds a standard Windows-era Accessibility Options applet over existing backend preference, applet, event, task, process, device, and session state, keeps command and plain-client access available, and avoids browser accessibility APIs, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: accessibility controls can make the workstation shell feel complete and improve usability, but they must not inspect real assistive technology, infer user ability, store browser authority, or let the client assert preference, device, task, process, event, or progression state.
- Product direction review: Accessibility Options belongs in the computer-first shell as a period ACCESS.CPL applet over simulated StickyKeys, FilterKeys, SoundSentry, ShowSounds, high contrast, cursor/font, MouseKeys, SerialKeys, timeout, and hardware behavior, not as a browser permission panel.
- Player surface: Accessibility Options now displays bounded tab/option/value rows for keyboard cadence, sound cues, high contrast, cursor/font treatment, mouse-key behavior, terminal mode, timeout/activity, screen-reader placeholder, input devices, and last event.
- Authority boundary: `desktopAccessibility` is derived from backend desktop preferences, display rows, sound rows, mouse rows, keyboard rows, device rows, process rows, command history, desktop tasks, desktop events, `stty`, and server session state; the browser receives summaries but cannot claim assistive-technology state, user ability, hardware identity, task completion, or gameplay progress.
- Parity path: text clients can use `accessibility [search]` and `access.cpl [search]`, while existing `theme pref contrast`, `theme pref motion`, `theme pref font`, `theme pref sound`, `display`, `sounds`, `keyboard`, `mouse`, `devices`, `events`, `logs`, `tasks`, `taskmgr`, and `stty` remain the action and inspection paths.
- Puzzle discipline: accessibility rows describe presentation, input cadence, and activity context without publishing direct answers, secret settings, or answer-shaped labels.
- Quality-of-life rule: the surface gathers preference and state context without automating route selection, access attempts, defense work, task handling, or clue interpretation.
- Historical texture: the feature reads as Accessibility Options/ACCESS.CPL with Keyboard, Sound, Display, Mouse, General, Hardware, and Activity rows, matching Windows NT/2000/XP-era Control Panel language.
- Hydration and renderer risk: accessibility rows are bounded JSON plus semantic DOM text and a CSS-only accessibility glyph; it adds no server-rendered SVG, browser storage authority, browser accessibility API reads, hardware enumeration, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, 87 acceptance tests, the production build, and the headless Chromium hydration smoke with `accessibility display`, zero SVG nodes in desktop chrome, and an Accessibility Options window check. The smoke now prefers an isolated production `next start` server when `.next/BUILD_ID` exists to avoid `next dev` HMR target churn during CDP attachment.

#### 2026-06-30: Backend-derived Regional and Language Options surface

- Requirements gate result: accepted because the feature adds a Windows-era Regional and Language Options applet over existing backend text, time, file, board, mail, keyboard, and theme state, keeps command and plain-client access available, and avoids browser locale APIs, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: regional formatting can make the workstation shell feel period-complete, but it must not read browser locale, infer user location, store browser authority, or let the client assert language, date, file, mail, board, or progression state.
- Product direction review: Regional and Language Options belongs in the computer-first shell as a period INTL.CPL applet over simulated standards, formats, numbers, languages, text services, and code page behavior, not as a real browser localization bridge.
- Player surface: Regional and Language Options now displays bounded tab/setting/value rows for standards, shell location, date sample, time sample, digit grouping, measurement, input language, text services, code page, browser-locale placeholder, and last event.
- Authority boundary: `desktopRegional` is derived from backend desktop theme, server time rows, visible files, mail rows, board rows, keyboard rows, command history, downloads, tasks, events, `stty`, and current host; the browser receives summaries but cannot claim locale, location, text-store content, task completion, or gameplay progress.
- Parity path: text clients can use `regional [search]` and `intl.cpl [search]`, while existing `theme`, `display`, `datetime`, `keyboard`, `files`, `history`, `mailbox`, `boards`, `events`, `logs`, `stty`, `nodes`, and `network` remain the action and inspection paths.
- Puzzle discipline: regional rows describe formatting, text-store, and provenance channels without publishing direct answers, hidden-language keys, or answer-shaped locale labels.
- Quality-of-life rule: the surface gathers date/time/text/file context without automating search, route selection, access attempts, defense work, or clue interpretation.
- Historical texture: the feature reads as Regional and Language Options/INTL.CPL with Regional, Formats, Numbers, Languages, Advanced, and Activity rows, matching Windows 2000/XP-era Control Panel language.
- Hydration and renderer risk: regional rows are bounded JSON plus semantic DOM text and a CSS-only globe/document glyph; it adds no server-rendered SVG, browser storage authority, browser locale APIs, geolocation, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, 86 acceptance tests, the headless Chromium hydration smoke with `regional formats` and a Regional and Language Options window check, and the production build.

#### 2026-06-30: Backend-derived Phone and Modem Options surface

- Requirements gate result: accepted because the feature adds a standard Windows-era Phone and Modem Options applet over existing backend Dial-Up Networking, Device Manager, Regional and Language Options, Network Places, Services, Tasks, Events, and session state, keeps command and plain-client access available, and avoids browser serial APIs, real modem/hardware enumeration, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: dial-up configuration is central to the period BBS/host-route fantasy, but it must not inspect real serial ports, modems, phone numbers, hardware IDs, browser devices, user location, or let the client assert dialing, reachability, route completion, task completion, or progression state.
- Product direction review: Phone and Modem Options belongs in the computer-first shell as a period TELEPHON.CPL applet over simulated dialing rules, area codes, calling-card/profile state, attached modem rows, active dial-up rows, diagnostics, AT settings, and queued dial activity.
- Player surface: Phone and Modem Options now displays bounded tab/name/value rows for dialing rules, current location, area-code rules, calling-card profile, attached modems, active connection, dial-up entries, modem diagnostics, last response, AT settings, browser-hardware placeholder, and queued dial jobs.
- Authority boundary: `desktopModems` is derived from backend dial-up rows, device rows, regional rows, network rows, service rows, tasks, events, bookmarks, `stty`, current host, and account state; the browser receives summaries but cannot claim hardware, serial ports, phone inventory, dialing success, route access, or gameplay progress.
- Parity path: text clients can use `modems [search]` and `telephon.cpl [search]`, while existing `dialup`, `devices modem`, `devmgmt modem`, `regional`, `network`, `services`, `events`, `logs`, `tasks`, `scheduler`, `taskmgr`, `stty`, and `bookmark route` remain the action and inspection paths.
- Puzzle discipline: modem rows describe route, dialing, diagnostics, and timing channels without publishing direct answers, secret phone numbers, or answer-shaped labels.
- Quality-of-life rule: the surface gathers dial-up and modem context without automating route selection, access attempts, defense work, task handling, or clue interpretation.
- Historical texture: the feature reads as Phone and Modem Options/TELEPHON.CPL with Dialing Rules, Modems, Diagnostics, Advanced, and Activity rows, matching Windows 2000/XP-era Control Panel language.
- Hydration and renderer risk: modem rows are bounded JSON plus semantic DOM text and a CSS-only modem glyph; it adds no server-rendered SVG, browser storage authority, browser serial APIs, hardware enumeration, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, 88 acceptance tests, the headless Chromium hydration smoke with `modems relay`, zero SVG nodes in desktop chrome, and a Phone and Modem Options window check, plus the production build.

#### 2026-06-30: Backend-derived ODBC Data Source Administrator surface

- Requirements gate result: accepted because the feature adds a Windows 2000/XP-era ODBC Data Source Administrator applet over existing backend services, files, registry-style rows, installed-program rows, network rows, shares, boards, tasks, events, bookmarks, and command history, keeps command and plain-client access available, and avoids browser databases, browser storage APIs, native drivers, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: data-source configuration fits the early shared-hosting and web-app pipeline grammar, but it must not inspect real local databases, browser storage, credentials, driver installs, filesystem DSNs, or let the client assert service reachability, task completion, host access, or progression state.
- Product direction review: ODBC Data Source Administrator belongs in the computer-first shell as an ODBCAD32-style administrative surface over simulated User DSNs, System DSNs, File DSNs, drivers, tracing, connection pooling, registry provenance, and browser-storage placeholders.
- Player surface: ODBC now displays bounded tab/name/driver/value rows for local shell files, boards archive text stores, host services, Network Places routes, shared folders, downloads, installed drivers, trace log, connection pool state, registry source, and browser-storage placeholder.
- Authority boundary: `desktopOdbc` is derived from backend service rows, file rows, board rows, registry rows, program rows, network rows, share rows, tasks, events, downloads, bookmarks, command history, current host, and account state; the browser receives summaries but cannot claim DSNs, drivers, database access, storage contents, route access, task completion, or gameplay progress.
- Parity path: text clients can use `odbc [search]` and `odbcad32 [search]`, while existing `services`, `registry`, `reg query`, `files`, `shares`, `boards`, `network`, `programs`, `tasks`, `taskmgr`, `history`, and `bookmark route` remain the action and inspection paths.
- Puzzle discipline: ODBC rows describe data-source provenance, trace, and pooling channels without publishing direct answers, credentials, or answer-shaped DSN labels.
- Quality-of-life rule: the surface gathers backend data pipeline context without automating searches, route selection, access attempts, defense work, task handling, or clue interpretation.
- Historical texture: the feature reads as ODBC Data Source Administrator/ODBCAD32 with User DSN, System DSN, File DSN, Drivers, Tracing, Connection Pooling, and About rows, matching Windows 2000/XP administrative language.
- Hydration and renderer risk: ODBC rows are bounded JSON plus semantic DOM text and a CSS-only database glyph; it adds no server-rendered SVG, browser storage authority, browser database API reads, native driver enumeration, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused ODBC acceptance test, 89 full acceptance tests, the production build, and the headless Chromium hydration smoke with `odbc dsn`, zero SVG nodes in desktop chrome, and an ODBC Data Source Administrator window check.

#### 2026-06-30: Backend-derived Windows Firewall surface

- Requirements gate result: accepted because the feature adds a Windows XP SP2/Windows 7-era Windows Firewall applet over existing backend security posture, service table, visible network rows, dial-up rows, events, tasks, command history, camp state, tunnel state, and desktop theme, while keeping command and plain-client access available and avoiding real OS firewall mutation, browser network permissions, packet APIs, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: firewall language fits the command-and-conquer route-control loop, but the applet must remain an inspection and planning surface; it cannot grant ports, open real sockets, suppress spawn-camp rules, bypass tunnel cooldowns, claim ownership, complete tasks, or decide secure/takeover outcomes from the client.
- Product direction review: Windows Firewall belongs beside Internet Options, Security Center, Services, Network Places, Dial-Up Networking, and Event Viewer as the early-2000s administrative lens for profiles, exceptions, advanced routes, logging, and backend-enforced access controls.
- Player surface: `firewall` and `firewall.cpl` now show bounded tab/name/profile/value rows for the current host profile, public profile, remote administration, visible service exceptions, dial-up profiles, tunnel guard, security log, background task queue, and browser-network placeholder.
- Authority boundary: `desktopFirewall` is derived from backend security rows, service rows, network rows, dial-up rows, tasks, events, command history, current host, root/login access, camp state, and tunnel state; the browser receives summaries but cannot assert service reachability, packet filtering, network permissions, route access, cooldown bypass, host control, task completion, or progression state.
- Parity path: text clients can use `firewall [search]` and `firewall.cpl [search]`, while existing `security`, `services`, `network`, `dialup`, `events`, `logs`, `tasks`, `taskmgr`, `scheduler`, `camp`, `tunnel`, `owned`, `secure`, and `takeover` remain the action and inspection paths.
- Puzzle discipline: firewall rows expose profile, exception, tunnel, and logging relationships without publishing direct answers, credentials, answer-shaped rules, or automation that resolves route choices.
- Quality-of-life rule: the surface gathers backend network-defense context without automating scans, route selection, access attempts, defense work, event interpretation, or task handling.
- Historical texture: the feature reads as Windows Firewall/FIREWALL.CPL with General, Exceptions, Advanced, Logging, and About rows, matching XP SP2 through Windows 7 Control Panel language.
- Hydration and renderer risk: firewall rows are bounded JSON plus semantic DOM text and a CSS-only firewall glyph; it adds no server-rendered SVG, browser network authority, packet inspection, native firewall calls, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Windows Firewall acceptance test, 90 full acceptance tests, the production build, and the headless Chromium hydration smoke with `firewall log`, zero SVG nodes in desktop chrome, and a Windows Firewall window check.

#### 2026-06-30: Backend-derived Automatic Updates surface

- Requirements gate result: accepted because the feature adds a Windows 2000/XP-era Automatic Updates and Windows 7-era Windows Update administrative applet over existing backend program rows, service rows, security posture, scheduled tasks, task queue, downloads, events, command history, and theme state, while keeping command and plain-client access available and avoiding real OS package managers, browser update services, external network calls, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: update language fits the webhost survival and node-maintenance loop, but the applet must remain a provenance and planning surface; it cannot install real packages, fetch external patches, grant payload trust, complete maintenance tasks, change ownership, suppress cooldowns, or decide secure/takeover outcomes from the client.
- Product direction review: Automatic Updates belongs beside Add/Remove Programs, Security Center, Windows Firewall, Services, Scheduled Tasks, Event Viewer, and Internet Options as the early-2000s administrative lens for update mode, schedule, installed surface, cached payloads, sources, trust baseline, and history.
- Player surface: `updates`, `wuaucpl.cpl`, and `windowsupdate` now show bounded tab/name/channel/value rows for update mode, backend schedule, installed surface, downloaded payloads, update services, trust baseline, event log, queued work, and external-update placeholder.
- Authority boundary: `desktopUpdates` is derived from backend program rows, service rows, security rows, scheduler rows, queued tasks, downloads, events, command history, current theme, and host state; the browser receives summaries but cannot assert package state, patch installation, network fetches, payload trust, route access, task completion, host control, or progression state.
- Parity path: text clients can use `updates [search]`, `wuaucpl.cpl [search]`, and `windowsupdate [search]`, while existing `programs`, `appwiz.cpl`, `services`, `security`, `firewall`, `scheduler`, `tasks`, `taskmgr`, `events`, `files`, `ftp`, and `gopher` remain the action and inspection paths.
- Puzzle discipline: update rows expose source, cache, schedule, trust, and event relationships without publishing direct answers, install buttons, credentials, answer-shaped payload names, or automation that resolves maintenance choices.
- Quality-of-life rule: the surface gathers backend patch/provenance context without automating downloads, installs, task completion, route selection, access attempts, or event interpretation.
- Historical texture: the feature reads as Automatic Updates/WUAUCPL.CPL with Settings, Status, Sources, History, and About rows, with Windows Update wording under the Windows 7 theme.
- Hydration and renderer risk: update rows are bounded JSON plus semantic DOM text and a CSS-only update glyph; it adds no server-rendered SVG, browser update service calls, native package manager calls, background fetch, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Automatic Updates acceptance test, 91 full acceptance tests, the production build, and the headless Chromium hydration smoke with `updates cache`, zero SVG nodes in desktop chrome, and an Automatic Updates window check.

#### 2026-06-30: Backend-derived Performance Monitor surface

- Requirements gate result: accepted because the feature adds a Windows NT/2000/XP/7-era Performance Monitor applet over existing backend process rows, service rows, scheduled rows, network rows, file rows, share rows, print rows, security rows, events, task queue, command history, tunnel state, camp state, and host state, while keeping command and plain-client access available and avoiding browser performance APIs, real machine metrics, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: performance language fits the calm machine-observation loop, but the applet must remain a bounded counter and provenance surface; it cannot sample the real browser/device, optimize routes, complete work, change ownership, grant access, suppress cooldowns, or decide secure/takeover outcomes from the client.
- Product direction review: Performance Monitor belongs beside Task Manager, Services, Event Viewer, Scheduled Tasks, Security Center, Network Places, Shared Folders, and Printers as the administrative lens for synthetic counters, process pressure, network visibility, service reachability, queues, and audit flow.
- Player surface: `performance`, `perfmon`, and `perfmon.msc` now show bounded object/counter/instance/value rows for processor load, processor queue, memory commit, network interfaces, service reachability, scheduler state, watched hosts, shared rows, print queue, event log, and runtime placeholder.
- Authority boundary: `desktopPerformance` is derived from backend process rows, service rows, schedule rows, network rows, file rows, share rows, print rows, security rows, tasks, events, command history, current host, tunnel state, camp state, and downloads; the browser receives summaries but cannot assert performance metrics, route quality, process state, service state, task completion, host control, or progression state.
- Parity path: text clients can use `performance [search]`, `perfmon [search]`, and `perfmon.msc [search]`, while existing `taskmgr`, `ps`, `tasks`, `scheduler`, `services`, `network`, `dialup`, `files`, `shares`, `printers`, `events`, `security`, `camp`, and `tunnel` remain the action and inspection paths.
- Puzzle discipline: counters expose relationships among pressure, queues, traces, and routes without publishing direct answers, real device telemetry, hidden timers, credentials, or automation that interprets the counters for the player.
- Quality-of-life rule: the surface gathers backend operational context without automating optimization, route selection, access attempts, process cleanup, event interpretation, or task handling.
- Historical texture: the feature reads as Performance Monitor/PERFMON.MSC with object, counter, instance, and value columns, matching NT-family administrative tooling.
- Hydration and renderer risk: performance rows are bounded JSON plus semantic DOM text and a CSS-only counter glyph; it adds no server-rendered SVG, browser performance API reads, real host metrics, animation timers as authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Performance Monitor acceptance test, 92 full acceptance tests, the production build, and the headless Chromium hydration smoke with `perfmon queue`, zero SVG nodes in desktop chrome, and a Performance Monitor window check.

#### 2026-06-30: Backend-derived System Restore surface

- Requirements gate result: accepted because the feature adds a Windows XP/Windows 7-era System Restore applet over existing backend saved checkpoints, shell session state, files, registry-style rows, security rows, events, tasks, command history, downloads, current host, and account state, while keeping command and plain-client access available and avoiding browser storage snapshots, native OS restore services, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: restore-point language fits the survival and rollback loop, but the applet must remain a provenance and planning surface; it cannot restore from the client, mutate checkpoints, bypass the existing `load` command, complete queued work, change host ownership, grant route access, or decide secure/takeover outcomes.
- Product direction review: System Restore belongs beside Save/Load, Event Viewer, Registry Editor, Security Center, Task Scheduler, Files, and System Properties as the early-2000s administrative lens for checkpoints, monitored stores, access state, event history, and queued work.
- Player surface: `restore`, `rstrui`, and `rstrui.exe` now show bounded tab/name/status/value rows for protection status, current session, saved restore points, monitored files, registry-style state, access state, recent events, queued work, and client-restore placeholder.
- Authority boundary: `desktopRestore` is derived from backend saved checkpoint rows, shell session fields, file rows, registry rows, security rows, tasks, events, command history, current host, downloads, and account state; the browser receives summaries but cannot assert rollback success, checkpoint contents, host access, task completion, ownership, or progression state.
- Parity path: text clients can use `restore [search]`, `rstrui [search]`, and `rstrui.exe [search]`, while existing `save <name>`, `load <name>`, `files`, `registry`, `security`, `events`, `tasks`, `scheduler`, and `history` remain the action and inspection paths.
- Puzzle discipline: restore rows expose checkpoint provenance and monitored stores without publishing direct answers, hidden checkpoint bodies, credentials, or automation that chooses which restore point matters.
- Quality-of-life rule: the surface gathers backend checkpoint context without automating rollback, route selection, access attempts, task completion, or clue interpretation.
- Historical texture: the feature reads as System Restore/RSTRUI with Status, Restore Point, Monitored, History, and About rows, matching XP through Windows 7 recovery tooling.
- Hydration and renderer risk: restore rows are bounded JSON plus semantic DOM text and a CSS-only restore glyph; it adds no server-rendered SVG, browser storage snapshot reads, native restore calls, client rollback authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused System Restore acceptance test, 93 full acceptance tests, the production build, and the headless Chromium hydration smoke with `restore status`, zero SVG nodes in desktop chrome, and a System Restore window check.

#### 2026-06-30: Backend-derived Computer Management console

- Requirements gate result: accepted because the feature adds a Windows NT/2000/XP/7-era Computer Management console over existing backend event, share, device, service, process, schedule, file, network, security, registry, and performance rows, while keeping command and plain-client access available and avoiding real machine management APIs, browser device enumeration, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: MMC-style aggregation fits the computer-first shell, but the console must remain a read-only management lens; it cannot start services, alter storage, clear logs, grant access, complete tasks, change ownership, suppress cooldowns, or decide secure/takeover outcomes from the client.
- Product direction review: Computer Management belongs beside Control Panel, Event Viewer, Shared Folders, Device Manager, Services, Scheduled Tasks, Task Manager, Registry Editor, and Performance Monitor as the administrative tree that makes the workstation feel coherent without replacing the command substrate.
- Player surface: `computer`, `compmgmt`, and `compmgmt.msc` now show bounded tree/node/status/value rows for System Tools, Storage, Services and Applications, Security, and Console nodes derived from the current session.
- Authority boundary: `desktopComputer` is derived from backend collectors and session state; the browser receives summaries but cannot assert event log content, share writability, device state, service reachability, task state, process state, storage state, security posture, registry state, access, ownership, or progression state.
- Parity path: text clients can use `computer [search]`, `compmgmt [search]`, and `compmgmt.msc [search]`, while existing `events`, `shares`, `devices`, `services`, `scheduler`, `tasks`, `files`, `security`, `registry`, `performance`, `taskmgr`, and `network` remain the action and inspection paths.
- Puzzle discipline: the console groups existing operational signals without publishing direct answers, hidden routes, credentials, checkpoint bodies, or automation that chooses which subsystem matters.
- Quality-of-life rule: the surface reduces tab-hopping across administrative views without automating observation, routing, access attempts, task completion, storage changes, service changes, or clue interpretation.
- Historical texture: the feature reads as `compmgmt.msc` with System Tools, Storage, Services and Applications, Security, and Console rows, matching the MMC-style administrative tree used across the target eras.
- Hydration and renderer risk: management rows are bounded JSON plus semantic DOM text and a CSS-only computer glyph; it adds no server-rendered SVG, real machine probes, browser hardware APIs, browser storage authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Computer Management acceptance test, 94 full acceptance tests, the production build, and the headless Chromium hydration smoke with `compmgmt services`, zero SVG nodes in desktop chrome, and a Computer Management window check.

#### 2026-06-30: Backend-derived Disk Management surface

- Requirements gate result: accepted because the feature adds a Windows 2000/XP/7-era Disk Management applet over existing backend progression quota, file rows, downloads, shares, route state, saved checkpoints, registry-style rows, tasks, and current host state, while keeping command and plain-client access available and avoiding native disk APIs, browser storage authority, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: storage visibility fits the workstation survival loop, but the applet must remain an inspection surface; it cannot format volumes, resize partitions, delete files, mount real disks, change quotas, complete transfers, restore checkpoints, grant access, or decide ownership from the client.
- Product direction review: Disk Management belongs under Computer Management and beside Files, Shared Folders, Folder Options, System Restore, Add/Remove Programs, and Performance Monitor as the period administrative view for profile quota, host-visible files, downloads, shares, route cache, transfer queue, and restore-point storage.
- Player surface: `disk`, `diskmgmt`, and `diskmgmt.msc` now show bounded disk/volume/status/capacity/used rows for profile quota, reserved shell configuration, downloads, host-visible files, shared folders, route cache, transfer queue, restore points, and the unused browser-local storage placeholder.
- Authority boundary: `desktopDisk` is derived from backend progression, saved checkpoint rows, shell session state, file rows, shares, registry rows, network rows, and task rows; the browser receives summaries but cannot assert capacity, usage, quota, checkpoint state, transfer completion, mount state, file ownership, host access, or progression state.
- Parity path: text clients can use `disk [search]`, `diskmgmt [search]`, and `diskmgmt.msc [search]`, while existing `files`, `shares`, `scores`, `restore`, `save <name>`, `load <name>`, `tasks`, `scheduler`, `network`, and `folders` remain the action and inspection paths.
- Puzzle discipline: disk rows expose storage provenance and route/cache relationships without publishing hidden files, credentials, checkpoint bodies, direct route answers, or automation that chooses which volume matters.
- Quality-of-life rule: the surface gathers storage-like backend facts without automating cleanup, transfer completion, file reading, route selection, access attempts, restore selection, or clue interpretation.
- Historical texture: the feature reads as `diskmgmt.msc` with Disk 0, Disk 1, Net, Task, Shadow, Runtime, C: Profile, System Reserved, Downloads, host media, shared folders, route cache, transfer queue, and restore-point rows, matching the era's administrative storage vocabulary without touching real disks.
- Hydration and renderer risk: disk rows are bounded JSON plus semantic DOM text and a CSS-only disk glyph; it adds no server-rendered SVG, native disk probes, browser storage reads, drag-resize partition UI, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Disk Management acceptance test, 95 full acceptance tests, the production build, and the headless Chromium hydration smoke with `diskmgmt profile`, zero SVG nodes in desktop chrome, and a Disk Management window check.

#### 2026-06-30: Backend-derived Event Viewer surface

- Requirements gate result: accepted because the feature adds a Windows NT/2000/XP/7-era Event Viewer over existing backend desktop events, task rows, security posture, command history, session state, mail, board, bookmark, and download summaries, while keeping command and plain-client access available and avoiding native OS logs, browser diagnostics authority, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: operational logs fit the administrative workstation loop, but Event Viewer must remain a read-only audit lens; it cannot clear logs, suppress audit rows, grant access, complete tasks, alter security posture, change ownership, reveal hidden routes, or decide secure/takeover outcomes from the client.
- Product direction review: Event Viewer belongs beside Computer Management, Security Center, Services, Scheduled Tasks, Task Manager, Windows Firewall, System Restore, and Performance Monitor as the period-accurate place where session actions become readable traces without replacing the command substrate.
- Player surface: `eventviewer` and `eventvwr.msc` now show bounded Windows Logs/Application/Security/System/Applications and Services rows with level, source, event id, message, host, and action hints; `events`, `eventvwr`, and `logs` continue to expose the simpler event journal path.
- Authority boundary: `desktopEventViewer` is derived from backend collectors and session state; the browser receives summaries but cannot assert log existence, audit level, task state, command history, host access, ownership, cooldown state, security posture, or progression state.
- Parity path: text clients can use `eventviewer [search]` and `eventvwr.msc [search]`, while existing `events [search]`, `logs [search]`, `taskmgr`, `scheduler`, `security`, `firewall`, `services`, `history`, `mailbox`, `boards`, and `bookmarks` remain the action and inspection paths.
- Puzzle discipline: event rows expose cause-and-effect traces and subsystem provenance without publishing direct answers, hidden credentials, route solutions, checkpoint bodies, or automation that chooses which signal matters.
- Quality-of-life rule: the surface gathers audit-like backend facts without automating cleanup, event suppression, task completion, route selection, access attempts, security changes, or clue interpretation.
- Historical texture: the feature reads as `eventvwr.msc` with Application, Security, System, and Applications and Services rows, matching the era's administrative log vocabulary while avoiding real operating-system logs.
- Hydration and renderer risk: event rows are bounded JSON plus semantic DOM text and a CSS-only event-viewer glyph; it adds no server-rendered SVG, native log probes, browser diagnostics APIs, client log authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Event Viewer acceptance test, 96 full acceptance tests, the production build, and the headless Chromium hydration smoke with `eventviewer system`, zero SVG nodes in desktop chrome, and an Event Viewer window check.

#### 2026-06-30: Backend-derived Search Companion surface

- Requirements gate result: accepted because the feature adds a Windows XP/Windows 7-era Search Companion over already-visible backend files, boards, mail, hosts, services, Event Viewer rows, command history, tasks, and bookmarks, while keeping command and plain-client access available and avoiding browser indexing, local filesystem scans, raw private-data exposure, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: search fits the workstation QOL layer, but it must remain a bounded discovery lens; it cannot crawl the user's machine, search private raw data, reveal hidden artifacts outside eligibility, select routes, complete tasks, grant access, change ownership, or decide puzzle progress from the client.
- Product direction review: Search Companion belongs beside Files, Boards, Mail, Network Places, Services, Event Viewer, History, Tasks, and Bookmarks as a period workstation affordance that reduces memory burden without replacing observation or command-equivalent actions.
- Player surface: `search`, `find`, and `srchui` now show bounded scope/name/location/summary rows and action hints for visible artifacts; the desktop app summarizes indexed places and recent history/task rows without exposing direct solution paths.
- Authority boundary: `desktopSearch` is derived from existing backend collectors and normalized session state; the browser receives summaries but cannot assert indexed content, visibility, access, ownership, route completion, task completion, event content, mail content, board content, or progression state.
- Parity path: text clients can use `search [text]`, `find [text]`, and `srchui [text]`, while existing `files`, `boards`, `mailbox`, `network`, `services`, `eventviewer`, `events`, `history`, `tasks`, and `bookmarks` remain the deeper action and inspection paths.
- Puzzle discipline: search rows provide provenance channels and nearby affordances without publishing direct answers, secret names, raw hidden content, credential material, route solutions, or automation that interprets which result matters.
- Quality-of-life rule: the surface reduces tab-hopping and repeated recall across visible artifacts without automating investigation, routing, access attempts, defense, task handling, or clue interpretation.
- Historical texture: the feature reads as Search Companion/SRCHUI with indexed files, mail, boards, hosts, services, logs, tasks, bookmarks, and history rows, matching the era's desktop search vocabulary without using a real OS index.
- Hydration and renderer risk: search rows are bounded JSON plus semantic DOM text and a CSS-only magnifier/folder glyph; it adds no server-rendered SVG, browser indexing APIs, local filesystem reads, browser storage authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Search Companion acceptance test, the desktop snapshot acceptance test, the production build, and the headless Chromium hydration smoke with `search relay`, zero SVG nodes in desktop chrome, and a Search Companion window check.

#### 2026-06-30: Backend-derived Network Connections surface

- Requirements gate result: accepted because the feature adds a Windows 2000/XP/7-era Network Connections applet over existing backend Network Places rows, Dial-Up Networking rows, active tunnel state, queued task state, service reachability, firewall posture, and Control Panel/Search Companion indexes, while keeping command and plain-client access available and avoiding real network adapters, browser network probing, OS APIs, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: connection visibility fits the command-and-control workstation loop, but the applet must remain a bounded administrative lens; it cannot open real sockets, create tunnels, mutate firewall rules, complete tasks, grant access, change ownership, suppress camp/tunnel rules, reveal hidden hosts, or decide secure/takeover outcomes from the client.
- Product direction review: Network Connections belongs beside Network Places, Dial-Up Networking, Phone and Modem Options, Windows Firewall, Services, Task Scheduler, Search Companion, and Control Panel as the period workstation folder for LAN, dial-up, tunnel, and scheduled connection state.
- Player surface: `connections`, `ncpa.cpl`, and `netconnections` now show bounded name/type/status/device/host/speed rows for local adapters, visible remote LAN rows, dial-up entries, active tunnel rows, and queued task connection rows; the desktop app summarizes active and queued rows.
- Authority boundary: `desktopConnections` is derived from backend collectors and normalized session state; the browser receives summaries but cannot assert adapter state, service reachability, firewall state, task state, route availability, tunnel success, host access, ownership, or progression state.
- Parity path: text clients can use `connections [search]`, `ncpa.cpl [search]`, and `netconnections [search]`, while existing `network`, `dialup`, `trace`, `services`, `firewall`, `task`, `scheduler`, `tasks`, and `desktop open connections` remain the deeper action and inspection paths.
- Puzzle discipline: connection rows gather nearby signals without publishing direct answers, hidden host names, credential material, route solutions, or automation that decides which connection matters.
- Quality-of-life rule: the surface reduces memory burden around visible routes and queued connection-like work without automating routing, access attempts, defense, tunnel creation, task completion, or clue interpretation.
- Historical texture: the feature reads as `ncpa.cpl`/Network Connections with Local Area Connection, Remote LAN, Dial-up, Tunnel, Scheduled, TCP/IP Adapter, Legacy Adapter, Modem, and Task Scheduler rows, matching the era's control-panel vocabulary without touching real machine networking.
- Hydration and renderer risk: connection rows are bounded JSON plus semantic DOM text and a CSS-only paired-monitor glyph; it adds no server-rendered SVG, browser network probes, native adapter reads, real tunnel control, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Network Connections acceptance test, the production build, and the headless Chromium hydration smoke with `connections relay`, zero SVG nodes in desktop chrome, and a Network Connections window check.

#### 2026-06-30: Backend-derived Help and Support Center surface

- Requirements gate result: accepted because the feature adds a Windows XP-era Help and Support Center over existing backend command help, applet inventory, command history, bookmarks, queued tasks, events, services, and connection rows, while keeping command and plain-client access available and avoiding static solution dumps, SVG chrome, canvas, WebGL, WASM, browser storage authority, or gameplay authority in React.
- Requirements revisited: help belongs in the workstation shell, but it must remain a contextual orientation surface; it cannot publish hidden answers, choose routes, complete tasks, grant access, alter ownership, suppress security rules, or replace command fluency.
- Product direction review: Help and Support Center belongs beside Search Companion, Control Panel, Settings, Event Viewer, Services, Tasks, and Network Connections as the period-correct place for command and applet orientation without collapsing the game into onboarding.
- Player surface: `support`, `helpctr`, and `helpctr.exe` show bounded section/topic/status rows for commands, workstation apps, recent history, bookmarks, tasks, events, connections, and services; the desktop Help window summarizes command and workstation topics.
- Authority boundary: `desktopHelp` is derived from backend command metadata and normalized session collectors; the browser receives summaries but cannot assert help topics, eligible services, command availability, task state, event content, applet state, access, ownership, or progression state.
- Parity path: text clients can use `support [search]`, `helpctr [search]`, `helpctr.exe [search]`, `?`, and `help <command>`, while existing command-specific surfaces remain the deeper action and inspection paths.
- Puzzle discipline: help rows describe affordance channels and source provenance without publishing direct answers, secret names, credentials, route solutions, checkpoint contents, or automation that decides which hint matters.
- Quality-of-life rule: the surface reduces command and applet recall burden without automating investigation, route choice, access attempts, defense, task handling, or clue interpretation.
- Historical texture: the feature reads as Help and Support Center/`helpctr.exe` with command help, workstation topics, recent activity, and service/connection pointers, matching the era's support-center vocabulary without a tutorial overlay.
- Hydration and renderer risk: help rows are bounded JSON plus semantic DOM text and a CSS-only help glyph; it adds no server-rendered SVG, browser storage authority, real OS help APIs, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Help and Support Center acceptance test, the production build, and the headless Chromium hydration smoke with `support services`, zero SVG nodes in desktop chrome, and a Help and Support Center window check.

#### 2026-06-30: Backend-derived Network Setup Wizard surface

- Requirements gate result: accepted because the feature adds a Windows XP-era Network Setup Wizard over existing backend network rows, connection rows, dial-up entries, shares, firewall posture, service reachability, route watcher state, direct tunnel state, queued tasks, and events, while keeping command and plain-client access available and avoiding real adapter configuration, OS networking APIs, SVG chrome, canvas, WebGL, WASM, browser storage authority, or gameplay authority in React.
- Requirements revisited: setup wizards fit the period desktop, but this one must remain a read-only checklist; it cannot create real sockets, configure browser networking, open tunnels, complete tasks, mark hosts secure, grant access, change shares, alter firewall posture, or decide route eligibility from the client.
- Product direction review: Network Setup Wizard belongs beside Network Connections, Dial-Up Networking, Phone and Modem Options, Windows Firewall, Shared Folders, Services, Scheduled Tasks, and Help as the period-correct place for network orientation without replacing the command substrate.
- Player surface: `netsetup` and `netsetup.cpl` now show bounded stage/item/status rows for profile, adapters, sharing, firewall, services, routes, tunnels, and queued setup work; the desktop window summarizes adapter and sharing rows.
- Authority boundary: `desktopNetSetup` is derived from backend collectors and normalized session state; the browser receives summaries but cannot assert adapters, shares, firewall state, service reachability, route watcher state, tunnel state, task state, access, ownership, or progression state.
- Parity path: text clients can use `netsetup [search]` and `netsetup.cpl [search]`, while existing `network`, `connections`, `dialup`, `modems`, `shares`, `files`, `folders`, `firewall`, `security`, `services`, `task`, `scheduler`, `camp`, `tunnel`, and `trace` remain the action and inspection paths.
- Puzzle discipline: setup rows group visible network readiness signals without publishing direct answers, hidden hosts, credentials, route solutions, exposed secret names, or automation that chooses which connection matters.
- Quality-of-life rule: the surface reduces tab-hopping across network setup concerns without automating routing, access attempts, sharing changes, tunnel creation, service scans, task completion, defense, or clue interpretation.
- Historical texture: the feature reads as Network Setup Wizard/`netsetup.cpl` with profile, workgroup, local area connection, dial-up entries, file sharing, network discovery, firewall, services, route watcher, direct tunnel, and setup checklist rows.
- Hydration and renderer risk: setup rows are bounded JSON plus semantic DOM text and a reused CSS-only network glyph; it adds no server-rendered SVG, real adapter probes, browser network APIs, browser storage authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Network Setup Wizard acceptance test, the production build, and the headless Chromium hydration smoke with `netsetup sharing`, zero SVG nodes in desktop chrome, and a Network Setup Wizard window check.

#### 2026-06-30: Backend-derived Network Diagnostics surface

- Requirements gate result: accepted because the feature adds a Windows XP/7-era Network Diagnostics surface over existing backend network rows, connection rows, service rows, firewall posture, route watcher state, tunnel state, queued tasks, schedules, and event rows, while keeping command and plain-client access available and avoiding real network probes, OS adapter APIs, SVG chrome, canvas, WebGL, WASM, browser storage authority, or gameplay authority in React.
- Requirements revisited: diagnostics fit the support-center and network-control fantasy, but the applet must remain a read-only report; it cannot ping real hosts, open sockets, configure adapters, create tunnels, complete tasks, mark hosts secure, grant access, change shares, alter firewall posture, or decide route eligibility from the client.
- Product direction review: Network Diagnostics belongs beside Network Setup Wizard, Network Connections, Windows Firewall, Services, Event Viewer, Task Scheduler, Security Center, and Help as the period-correct place to inspect network health without replacing the command substrate.
- Player surface: `netdiag` and `diagnose` now show bounded test/target/result/detail rows for adapter binding, host visibility, name services, service reachability, firewall profile, route watcher, direct tunnel, queued network work, and event signal.
- Authority boundary: `desktopNetDiagnostics` is derived from backend collectors and normalized session state; the browser receives summaries but cannot assert diagnostic results, adapter state, service reachability, firewall state, route watcher state, tunnel state, task state, access, ownership, or progression state.
- Parity path: text clients can use `netdiag [search]` and `diagnose [search]`, while existing `network`, `connections`, `netsetup`, `dialup`, `services`, `firewall`, `security`, `task`, `scheduler`, `eventviewer`, `camp`, `tunnel`, and `trace` remain the action and inspection paths.
- Puzzle discipline: diagnostic rows surface operational signal quality and provenance without publishing direct answers, hidden hosts, credentials, route solutions, exposed secret names, or automation that chooses which connection matters.
- Quality-of-life rule: the surface reduces cross-window network triage without automating routing, access attempts, sharing changes, tunnel creation, service scans, task completion, defense, or clue interpretation.
- Historical texture: the feature reads as Windows Network Diagnostics/`netdiag` with adapter binding, name services, service reachability, firewall profile, route watcher, tunnel, queued work, and event-signal rows.
- Hydration and renderer risk: diagnostic rows are bounded JSON plus semantic DOM text and a reused CSS-only network glyph; it adds no server-rendered SVG, real adapter probes, browser network APIs, browser storage authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Network Diagnostics acceptance test, the production build, and the headless Chromium hydration smoke with `netdiag firewall`, zero SVG nodes in desktop chrome, and a Network Diagnostics window check.

#### 2026-06-30: Backend-derived Map Network Drive surface

- Requirements gate result: accepted because the feature adds a Windows 2000/XP/7-era Map Network Drive surface over existing backend share rows, visible file rows, downloads, user home files, profile state, and network state, while keeping command and plain-client access available and avoiding real filesystem mounts, browser storage authority, OS drive APIs, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: mapped drives fit the workstation shell and network-file loop, but this applet must remain a derived orientation surface; it cannot mount real disks, write browser storage, create actual shares, bypass file permissions, complete transfers, grant access, or change ownership from the client.
- Product direction review: Map Network Drive belongs beside Shared Folders, Files, Network Places, Network Setup Wizard, Disk Management, Folder Options, Search Companion, and Help as the period-correct bridge between host reachability and file surfaces.
- Player surface: `mapdrive` and `net use` now show bounded drive/remote/status/capacity rows derived from backend shares, downloads, and home files; the desktop window summarizes mapped rows, writable rows, and drive letters.
- Authority boundary: `desktopMappedDrives` is derived from backend collectors and normalized session state; the browser receives summaries but cannot assert mounted drives, filesystem access, share writability, file visibility, transfer completion, host access, ownership, or progression state.
- Parity path: text clients can use `mapdrive [search]` and `net use [search]`, while existing `shares`, `files`, `network`, `folders`, `disk`, `task`, `ftp`, `cat`, `write`, and `desktop open mapdrive` remain the action and inspection paths.
- Puzzle discipline: mapped-drive rows expose visible storage provenance and affordance channels without publishing hidden files, credentials, route solutions, private raw data, or automation that chooses which share matters.
- Quality-of-life rule: the surface reduces recall burden around visible shares and file locations without automating routing, access attempts, file reads, transfer completion, cleanup, defense, or clue interpretation.
- Historical texture: the feature reads as Map Network Drive/`net use` with drive letters, UNC-style paths, read-only/read-write status, home/download/public shares, and visible capacity summaries.
- Hydration and renderer risk: mapped-drive rows are bounded JSON plus semantic DOM text and a reused CSS-only drive glyph; it adds no server-rendered SVG, real mount probes, browser storage reads, native filesystem APIs, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Map Network Drive acceptance test, the production build, and the headless Chromium hydration smoke with `mapdrive public`, zero SVG nodes in desktop chrome, and a Map Network Drive window check.

#### 2026-06-30: Backend-derived Offline Files surface

- Requirements gate result: accepted because the feature adds a Windows 2000/XP-era Offline Files/Sync Manager surface over existing backend file rows, share rows, mapped-drive rows, downloads, user home files, queued transfer tasks, and file/share events, while keeping command and plain-client access available and avoiding real browser cache APIs, service workers, local filesystem sync, OS sync APIs, SVG chrome, canvas, WebGL, WASM, or gameplay authority in React.
- Requirements revisited: offline-file visibility fits the workstation shell and durable-node loop, but this applet must remain a derived inspection surface; it cannot cache real browser data, write local storage, mount real shares, bypass file permissions, complete transfers, grant access, create ownership, or decide persistence outcomes from the client.
- Product direction review: Offline Files belongs beside Map Network Drive, Shared Folders, Files, Folder Options, Disk Management, Search Companion, Help, and Scheduled Tasks as the period-correct bridge between network files, local profile files, downloads, and queued sync-like work.
- Player surface: `offline`, `sync`, `mobsync`, `mobsync.exe`, and `syncmgr` now show bounded location/item/status/size rows for home files, downloaded files, public shares, mapped drives, pending transfer tasks, and recent file/share events; the desktop window summarizes item count, pending rows, and cached rows.
- Authority boundary: `desktopOffline` is derived from backend collectors and normalized session state; the browser receives summaries but cannot assert cache state, file visibility, share writability, transfer completion, event history, host access, ownership, or progression state.
- Parity path: text clients can use `offline [search]`, `sync [search]`, `mobsync [search]`, `mobsync.exe [search]`, and `syncmgr [search]`, while existing `files`, `shares`, `mapdrive`, `net use`, `folders`, `tasks`, `scheduler`, `events`, `cat`, `write`, and `desktop open offline` remain the action and inspection paths.
- Puzzle discipline: offline rows expose visible storage provenance, stale/pending signals, and affordance channels without publishing hidden files, credentials, route solutions, private raw data, answer-shaped labels, or automation that chooses which cached artifact matters.
- Quality-of-life rule: the surface reduces recall burden around visible files, shares, downloads, and queued transfers without automating routing, access attempts, file reads, writes, transfer completion, cleanup, defense, or clue interpretation.
- Historical texture: the feature reads as Offline Files/Sync Manager/`mobsync.exe` with network locations, pinned local files, cached downloads, mapped UNC paths, pending sync work, and recent synchronization-style event rows.
- Hydration and renderer risk: offline rows are bounded JSON plus semantic DOM text and a reused CSS-only folder-options glyph; it adds no server-rendered SVG, service worker, browser cache/local-storage authority, native sync APIs, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Offline Files acceptance test, the focused Search Companion regression check, the production build, and the headless Chromium hydration smoke with `offline pending`, zero SVG nodes in desktop chrome, and an Offline Files window check.

#### 2026-06-30: Backend-derived Connection Lineage surface

- Requirements gate result: accepted because the feature adds a Windows-era Connection Lineage surface over backend network routes, dial-up rows, visible remote places, route bookmarks, tunnel state, queued network tasks, and current host state, while keeping command and plain-client access available and avoiding real modem control, real network probing, OS adapter APIs, SVG chrome, canvas, WebGL, WASM, browser storage authority, or gameplay authority in React.
- Requirements revisited: lineage fits the period workstation direction as a historical connection lens, but it must remain a derived inspection surface; it cannot create sockets, dial real services, configure adapters, bypass route eligibility, complete tasks, grant access, change ownership, suppress tunnel rules, or decide progression from the client.
- Product direction review: Connection Lineage belongs beside Dial-Up Networking, Network Places, Network Connections, Network Setup Wizard, Phone and Modem Options, Map Network Drive, Search Companion, and Help as the connective tissue between earlier host-hop behavior and the desktop administrative shell.
- Player surface: `lineage` and `era` now show bounded era/method/status/host/speed/path rows for pre-dial-up notes, dial-up entries, packet paths, internet-era services, and LAN control-panel state; the desktop window summarizes lineage rows, eras, current connection method, and backend provenance.
- Authority boundary: `desktopLineage` is derived from backend collectors and normalized session state; the browser receives summaries but cannot assert routes, dial-up state, visible hosts, tunnel state, task state, service reachability, access, ownership, or progression state.
- Parity path: text clients can use `lineage [search]` and `era [search]`, while existing `modems`, `dialup`, `network`, `connections`, `netsetup`, `netdiag`, `mapdrive`, `trace`, `telnet`, `wardial`, `bookmark`, and `task` remain the action and deeper inspection paths.
- Puzzle discipline: lineage rows expose era and transport provenance without publishing direct answers, hidden host names, credentials, route solutions, private raw data, or automation that chooses which hop matters.
- Quality-of-life rule: the surface reduces recall burden around connection history and active route context without automating routing, access attempts, tunnel creation, task completion, defense, or clue interpretation.
- Historical texture: the feature reads as a recovered connection history spanning phone books, acoustic couplers, dial-up BBS entries, UUCP/telnet paths, LAN folders, and control-panel networking vocabulary without touching real machine networking.
- Hydration and renderer risk: lineage rows are bounded JSON plus semantic DOM text and a reused CSS-only dial-up/network glyph; it adds no server-rendered SVG, real adapter probes, browser network APIs, browser storage authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Connection Lineage acceptance test, the focused Search/Help/Network regression checks, the production build, and the headless Chromium hydration smoke with `lineage dialup`, zero SVG nodes in desktop chrome, and a Connection Lineage window check.

#### 2026-06-30: Backend-derived Remote Desktop Connection surface

- Requirements gate result: accepted because the feature adds a Windows XP/7-era Remote Desktop Connection surface over backend-visible hosts, login/root access, routes, tunnel state, bookmarks, queued network tasks, and theme/display state, while keeping command and plain-client access available and avoiding real RDP, real sockets, OS remote-control APIs, browser network probing, SVG chrome, canvas, WebGL, WASM, browser storage authority, or gameplay authority in React.
- Requirements revisited: remote desktop belongs in the workstation shell as a period-correct connection affordance, but it must remain a derived profile list; it cannot open real remote sessions, configure host services, grant access, bypass route eligibility, complete tasks, take ownership, suppress tunnel rules, or decide progression from the client.
- Product direction review: Remote Desktop Connection belongs beside Network Connections, Network Places, Dial-Up Networking, Connection Lineage, Map Network Drive, Computer Management, Security Center, Search Companion, and Help as a familiar Windows-era way to inspect which systems are locally connected, credentialed, queued, or blocked.
- Player surface: `remote`, `mstsc`, `mstsc.exe`, and `tsclient` now show bounded host/status/access/display/profile rows, with the desktop window summarizing remote profile counts, ready rows, display mode, and backend provenance.
- Authority boundary: `desktopRemote` is derived from backend collectors and normalized session state; the browser receives summaries but cannot assert remote sessions, credentials, route availability, task completion, tunnel state, access level, ownership, or progression state.
- Parity path: text clients can use `remote [search]`, `mstsc [search]`, `mstsc.exe [search]`, and `tsclient [search]`, while existing `network`, `connections`, `lineage`, `dialup`, `trace`, `telnet`, `tunnel`, `bookmark`, `task`, `scheduler`, and `desktop open remote` remain the action and deeper inspection paths.
- Puzzle discipline: remote rows expose readiness, display profile, route, and access provenance without publishing direct answers, hidden hosts, credentials, route solutions, private raw data, or automation that chooses which host matters.
- Quality-of-life rule: the surface reduces recall burden around reachable and credentialed systems without automating routing, access attempts, tunnel creation, task completion, defense, ownership, or clue interpretation.
- Historical texture: the feature reads as Remote Desktop Connection/Terminal Services Client/`mstsc.exe` with saved profiles, console display modes, credentialed hosts, queued consoles, and blocked public profiles without touching real machine networking.
- Hydration and renderer risk: remote rows are bounded JSON plus semantic DOM text and a reused CSS-only connection glyph; it adds no server-rendered SVG, real RDP client, browser network APIs, browser storage authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Remote Desktop Connection acceptance test, the focused Network/Search/Help/Control regression checks, the production build, and the headless Chromium hydration smoke with `remote relay`, zero SVG nodes in desktop chrome, and a Remote Desktop Connection window check.

#### 2026-06-30: Backend-derived Run dialog surface

- Requirements gate result: accepted because the feature adds a Windows NT/2000/XP/7-era Run dialog over backend command metadata, desktop apps, command history, visible files, remote profiles, security state, and session context, while keeping text-client access available and avoiding real OS process launch, native shell execution, browser filesystem/process APIs, SVG chrome, canvas, WebGL, WASM, browser storage authority, or gameplay authority in React.
- Requirements revisited: Run belongs in the workstation shell as a fast launch affordance, but it must remain a bounded launcher index; it cannot start native processes, open local files, escalate real privileges, bypass command eligibility, complete tasks, grant access, change ownership, reveal hidden targets, or decide progression from the client.
- Product direction review: Run belongs beside Start, Terminal, Explorer/Files, Control Panel, Remote Desktop Connection, Search Companion, Help, and Task Manager as the period-correct shortcut layer that lets players move through the computer without memorizing every app icon.
- Player surface: `runbox`, `start`, `explorer`, `cmd`, `cmd.exe`, `command.com`, and `runas` now show bounded command/status/source/target rows, with the desktop window summarizing target count, ready rows, recent command, and backend provenance.
- Authority boundary: `desktopRun` is derived from backend collectors and normalized session state; the browser receives summaries but cannot assert command execution, native process launch, filesystem access, elevation, app availability, hidden target visibility, access, ownership, or progression state.
- Parity path: text clients can use `runbox [search]`, `start [search]`, `explorer [search]`, `cmd.exe`, `command.com`, and `runas [search]`, while existing `desktop open <app>`, `search`, `help`, `files`, `control`, `remote`, `security`, `history`, and the existing gameplay `run` command remain separate action paths.
- Puzzle discipline: run rows expose launch affordances and recent command provenance without publishing direct answers, hidden command names, credentials, route solutions, private raw data, or automation that chooses the next command.
- Quality-of-life rule: the surface reduces app and command recall burden without automating investigation, routing, access attempts, task completion, defense, ownership, or clue interpretation.
- Historical texture: the feature reads as the Windows Run dialog and Start/Explorer command bridge with `cmd.exe`, `command.com`, `control.exe`, `mstsc.exe`, `runas.exe`, recent commands, applet targets, and blocked native-process rows.
- Hydration and renderer risk: run rows are bounded JSON plus semantic DOM text and a reused CSS-only terminal glyph; it adds no server-rendered SVG, native process bridge, browser filesystem APIs, browser storage authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Run dialog acceptance test, the focused Search/Help/Control regression checks, the production build, and the headless Chromium hydration smoke with `start cmd`, zero SVG nodes in desktop chrome, and a Run window check.

#### 2026-06-30: Backend-derived Stored User Names and Passwords surface

- Requirements gate result: accepted because the feature adds a Windows XP-era Stored User Names and Passwords/Key Manager surface over backend account identity, SSH key fingerprint, login/root host access, bookmarks, remote profiles, and security state, while keeping text-client access available and avoiding real OS credential stores, browser password APIs, native keychains, raw passwords, private keys, SVG chrome, canvas, WebGL, WASM, browser storage authority, or gameplay authority in React.
- Requirements revisited: credential management belongs in the workstation shell, but it must remain a masked provenance view; it cannot reveal passwords, dump key material, grant access, elevate privileges, bypass route eligibility, complete tasks, change ownership, or decide progression from the client.
- Product direction review: Stored User Names and Passwords belongs beside User Accounts, Security Center, Remote Desktop Connection, Run, Network Connections, Registry Editor, Help, and Search as the period-correct place to inspect which access artifacts exist without turning the interface into a secret dump.
- Player surface: `credentials`, `creds`, `keymgr`, `keymgr.dll`, and `controlkeymgr` now show bounded target/user/type/status/source rows with masked SSH fingerprints, login/root host rows, remote profile rows, bookmark-derived rows, and an explicit raw-secret boundary row.
- Authority boundary: `desktopCredentials` is derived from backend collectors and normalized session state; the browser receives summaries but cannot assert credential existence, read secrets, write key material, elevate privileges, grant access, set ownership, or progress puzzles.
- Parity path: text clients can use `credentials [search]`, `keymgr [search]`, `creds [search]`, `keymgr.dll [search]`, and `controlkeymgr [search]`, while `accounts`, `security`, `set key`, `porthack`, `rootkit`, `secure`, `remote`, `owned`, and `registry` remain the action and deeper inspection paths.
- Puzzle discipline: credential rows expose access provenance and masked fingerprints without publishing passwords, raw keys, hidden host names, direct answers, route solutions, or automation that chooses which credential matters.
- Quality-of-life rule: the surface reduces recall burden around account, key, and host-access state without automating access attempts, routing, escalation, task completion, defense, ownership, or clue interpretation.
- Historical texture: the feature reads as Windows Stored User Names and Passwords/`keymgr.dll` with interactive logon, home profile, SSH public key fingerprint, login shell, root credential, remote profile, bookmark, and hidden raw-secret rows.
- Hydration and renderer risk: credential rows are bounded JSON plus semantic DOM text and a reused CSS-only security glyph; it adds no server-rendered SVG, browser password API, native keychain bridge, local storage authority, canvas renderer, WebGL, WASM, or heavyweight runtime dependency.
- Verification covered rendering constraints, package TypeScript, the focused Stored User Names and Passwords acceptance test with raw password/key non-disclosure checks, the focused Account/Search/Help/Control regression checks, the production build, and the headless Chromium hydration smoke with `keymgr`, zero SVG nodes in desktop chrome, and a Passwords window check.

### Deferred

- Real external cloud, hosting, domain, email, or infrastructure control.
- Federation with other real hosts.
- Multiplayer competitive actions beyond bounded simulation rules.
- Browser-based heavyweight emulation.
- Public internet crawling or live service bridging.
- Static-export support for the authoritative game surface.
