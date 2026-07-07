---
artifact_contract: ce-unified-plan/v1
artifact_readiness: requirements-only
product_contract_source: ce-brainstorm
execution: code
type: feat
created_at: 2026-06-29
title: Retro Home World Redesign - Plan
---

# Retro Home World Redesign - Plan

## Goal Capsule

- **Objective:** Re-skin the existing public discovery routes into a retro, puzzle-rich personal home world that makes Boden's projects, agents, homelab, history, and present-tense activity feel meaningful instead of generic, while keeping `/about` as the portfolio escape hatch and separating export-safe surfaces from server-only live features.
- **Product authority:** The product direction comes from the user's stated dissatisfaction with the current site, the preserved `/about` exception, `STRATEGY.md`, existing dual-chrome architecture, local Xfire and Discord data availability, public GitHub identity, and current web/platform research.
- **Execution profile:** Software redesign in the existing Next.js App Router repo, with an export-safe public shell, prebuilt public artifacts, and private ingestion/adaptation systems separated from server-capable deployments.
- **Open blockers:** Authenticated iCloud, Gmail, Facebook, Google analytics exports, and additional Discord scraping are adapter slots until credentials/connectors are available and their terms/privacy boundaries are reviewed.

---

## Product Contract

### Summary

The non-About site becomes a browsable personal operating system: part Xfire lobby, part homelab control room, part project museum, part scavenger-hunt archive.
The experience should reward exploration over weeks without hiding core navigation, publishing private messages, or depending on heavyweight WebGL.
The redesign must favor meaning, provenance, and atmosphere over stat grids.

### Problem Frame

The current discovery hub is coherent but still reads like a generic developer dashboard: routes, cards, service panels, GitHub counts, and guides are useful but do not communicate why the work matters or who Boden is.
The user wants a public website that feels like a home, a memory palace, and an active system, while `/about` remains the conventional portfolio view for people who need a direct résumé path.

There is also a major safety tension.
The best source material is private or semi-private: Xfire exports, Discord DMs, notes, sent email, Facebook, analytics, homelab activity, and agent logs.
The public site must extract themes, eras, moods, project meaning, and puzzle material from that corpus without leaking raw conversations, server IPs, private third-party names, sensitive facts, or copyrighted game/media content.

### Key Decisions

- **Preserve `/about` as the conventional portfolio.** The About page remains the stable, React-heavy narrative page; the redesign re-skins the existing discovery shell and targets `/`, `/projects`, `/guides`, `/dashboard`, `/contact`, `/search`, 404, sitemap/metadata, and shared discovery chrome.
- **Build a truthful labyrinth, not a hostile scraper trap.** Puzzles, hidden rooms, metadata clues, fake terminals, password doors, and slow-burn mysteries are in scope; false personal claims, inaccessible navigation, and intentionally corrupted core content are out of scope.
- **Treat private data as an ingestion substrate, not public content.** Xfire, Discord, Gmail, iCloud, Facebook, analytics, and agent/homelab data may inform derived signals, but raw messages and private identifiers never ship in the public bundle.
- **Separate public shell from private live systems.** Next.js static export constraints mean the public site can consume build-time/static JSON and small client islands, while private APIs, ingestion jobs, and live prediction services run only in server-capable deployments.
- **Make exploration optional, not mandatory.** WASD, puzzle paths, and in-world navigation can enhance the site, but every primary destination must remain reachable by links, keyboard tab order, reduced-motion mode, search, and screen-reader labels.
- **Defer Wii-in-browser as a research wing.** Browser arcade content starts with legal, user-provided, or public-domain material and realistic web emulator options; full Wii/GameCube emulation is a later private experiment unless a proven browser-safe path exists.

### Deployment Matrix

| Target | Supported surfaces | Notes |
| --- | --- | --- |
| GitHub Pages / export | Static home-world shell, static project stories, static guide archive, static fallback snapshots, advisory robots and metadata only | Must consume prebuilt JSON only; no promise of live API refresh, private ingestion outputs, or runtime server routes |
| Standalone / server | Live services, GitHub API refresh, SearX, dynamic sitemap, private ingestion outputs, presence snapshots | Can refresh sanitized artifacts at runtime and expose server-only helpers |
| `/about` | Keep the visual portfolio path intact | Either exclude it from export promises or give it explicit static fallbacks before claiming export support |

Anything not listed in the export row is server-only or snapshot-only.

### Sanitized Artifact Contract

- Public artifacts must include source category, generated time, freshness age, confidence, redaction status, and a display-safe summary.
- Export builds must consume prebuilt JSON only.
- Runtime builds may refresh via server-only ingestion, but never ship raw private source text.
- If an artifact cannot be summarized safely, it stays quarantined or private-only.

### Room Concepts

These are practical brainstorm seeds, not all v1 commitments.

- Xfire-style buddy list as a navigation and presence rail.
- Project museum plaques that show purpose, era, proof, current question, and public evidence.
- Optional puzzle notebook with local-only clue history.
- Agent and homelab control room with stale-state and confidence indicators.
- Plain-text low-bandwidth mode for screen readers, crawlers, and reduced-motion users.
- Source provenance overlay explaining which public-safe signals shaped each room.

### Actors

- **A1. Curious visitor:** Explores the site as an interactive home world and discovers story, projects, games, hints, and artifacts over time.
- **A2. Recruiter or collaborator:** Needs a fast path to `/about`, project evidence, contact, and credible technical proof without solving puzzles.
- **A3. Returning friend/community member:** Recognizes Xfire/KotOR/OpenKotOR/Discord-era references and may follow deeper trails.
- **A4. Boden:** Uses the site as a living mirror of personal work, agents, homelab, mood, and short-term focus.
- **A5. Private ingestion system:** Reads sensitive local/connectored sources, derives sanitized facts/signals, and emits public-safe artifacts.
- **A6. Search/crawler/AI agent:** May read the public site mechanically; it receives truthful public summaries and crawler preference signals, not private data or canonical puzzle secrets.

### Key Flows

- **F1. First visit orientation**
  - **Trigger:** A visitor lands on `/`.
  - **Steps:** The site presents the home-world entry, a direct `/about` escape hatch, visible primary rooms, and an optional “explore mode,” with snapshot fallbacks when live refresh is unavailable.
  - **Outcome:** The visitor can either play/explore or immediately reach projects, guides, dashboard, and contact.

- **F2. Meaningful project discovery**
  - **Trigger:** A visitor opens `/projects` or selects a project room.
  - **Steps:** The site shows why each project exists, what era it belongs to, what it proves, what public activity supports it, and what question it is still chasing.
  - **Outcome:** GitHub stats become evidence inside a story rather than standalone tiles.

- **F3. Private-source distillation**
  - **Trigger:** A private ingestion run reads Xfire, Discord, notes, email, analytics, agent logs, or homelab state.
  - **Steps:** It extracts eras, topics, themes, artifact candidates, and confidence-scored presence signals; it redacts private people, raw messages, IPs, tokens, emails, and sensitive facts; it emits only public-safe summaries.
  - **Outcome:** The public site updates atmosphere and meaning without publishing private source text.

- **F4. Puzzle and scavenger-hunt progression**
  - **Trigger:** A visitor notices a clue, image joke, hidden room, terminal command, password prompt, or metadata breadcrumb.
  - **Steps:** The site lets them unlock optional rooms and lore while keeping core navigation available through plain links.
  - **Outcome:** Exploration feels deep and intelligent, but no essential page becomes inaccessible.

- **F5. Live presence and prediction**
  - **Trigger:** The dashboard or home world requests a public presence snapshot.
  - **Steps:** The site shows current focus guess, agent activity, homelab status, ambient theme, and confidence level from sanitized public artifacts; export builds show the latest prebuilt snapshot and age instead of pretending to be live.
  - **Outcome:** Visitors see a living site that admits uncertainty instead of pretending to know exact private state.

- **F6. Arcade room**
  - **Trigger:** A visitor opens the arcade/games area.
  - **Steps:** The room offers legal web-playable experiences, user-uploaded ROM paths where appropriate, Flash/Ruffle candidates when allowed, and clear local-only handling.
  - **Outcome:** Nostalgia is present without hosting copyrighted ROMs or making Wii support a v1 promise.

### Requirements

**Experience and information architecture**

- R1. The redesigned public shell must re-skin and reframe the existing discovery shell into an in-world structure that maps primary routes to memorable rooms or systems.
- R2. `/about` must remain available and materially unchanged as the direct portfolio path.
- R3. The first viewport must communicate the identity of the site as Boden's personal home world, not a generic SaaS dashboard or landing page.
- R4. Primary navigation must work without solving puzzles, using WASD, enabling audio, or accepting motion.
- R5. The site must include optional long-horizon mysteries, unlocks, and easter eggs that reward return visits.
- R6. Puzzles must never be the only path to public résumé, project, contact, or accessibility-critical content.

**Meaning and identity**

- R7. Project surfaces must explain purpose, lineage, proof, current activity, and personal/community relevance.
- R8. GitHub activity must be framed as evidence for project meaning instead of displayed primarily as aggregate stat grids.
- R9. Xfire-era material must influence aesthetics, vocabulary, artifacts, and timeline texture where it can be safely sanitized.
- R10. KotOR/OpenKotOR, reverse engineering, agentic engineering, homelab operations, smart-home presence, and Iowa/home context must be first-class identity signals.
- R11. The site must represent coding agents as visible inhabitants or workers with public-safe activity summaries.
- R12. The site must include a lightweight “little me” figure or avatar state machine, with behavior driven by public-safe presence state.

**Private data and safety**

- R13. Public artifacts must never include raw Discord DMs, raw sent email, raw iCloud notes, private Facebook content, access tokens, private addresses, private emails, server IPs, or private third-party identifiers.
- R14. Every derived public artifact must carry source category, derivation timestamp, confidence, and redaction status.
- R15. Ingestion must support a review/quarantine stage for surprising, sensitive, or low-confidence derived facts before they can ship publicly.
- R16. Third-party conversation participants must be anonymized or generalized unless the content is already public and explicitly safe to name.
- R17. Public “what am I doing now?” predictions must be snapshot-first estimates with confidence, age, and uncertainty, with live refresh limited to server-capable deployments.
- R18. Public content must distinguish verified public facts from inferred personal atmosphere.

**Accessibility and consent**

- R19. Motion-heavy effects must respect `prefers-reduced-motion` and provide an obvious in-site reduced-motion control.
- R20. Audio and ambient music must be opt-in and user-controlled, never autoplay with audible sound.
- R21. The home-world navigation must provide visible focus states, skip links, semantic landmarks, and screen-reader labels.
- R22. Keyboard-only visitors must reach all primary rooms and controls through standard tab/enter/escape patterns.
- R23. Any WASD or game-like controls must be optional progressive enhancement with an accessible equivalent.
- R24. Text must remain readable and non-overlapping across mobile and desktop viewports.

**Crawler and public extraction posture**

- R25. `robots.ts` must express crawler preferences for public, private, and AI-training paths, but on GitHub Pages/export those signals are advisory only and cannot enforce crawler behavior.
- R26. Private data, secrets, and canonical puzzle answers must be absent from public HTML, JS, JSON, source maps, images, and metadata.
- R27. Markdown or AI extraction of public pages may receive simplified summaries and decoys for puzzle flavor, but those summaries must not contradict canonical public facts.
- R28. Any stronger anti-crawler controls must live at hosting/proxy level, not as fragile client-side tricks; export builds can only document preferences and static fallbacks.

**Arcade and emulator room**

- R29. V1 arcade content must use legal, user-provided, public-domain, original, or explicitly licensed game assets.
- R30. Flash nostalgia should prefer Ruffle-compatible SWF content only when rights and performance are acceptable.
- R31. Legacy console emulation should begin with proven web emulator capabilities and local user uploads, not hosted ROM libraries.
- R32. Wii/GameCube emulation must be labeled experimental/deferred until browser performance, legal UX, input handling, and mobile fallback are validated.

**Operations and rollout**

- R33. The public site must remain buildable with zero `.env.local` and degrade gracefully to static/demo data.
- R34. The export-safe shell must stay buildable; server-only features may degrade to static snapshots or require standalone deployment.
- R35. The redesign must ship in slices: world shell, meaning project layer, private-derived static artifacts, snapshot-first presence dashboard, puzzle layer, arcade room, then digital-twin depth.
- R36. New public artifacts must be easy to inspect for privacy leakage before deployment.

### Visual / Structural Model

```mermaid
flowchart TB
  Private[Private source corpus] --> Ingest[Private ingestion and review]
  Ingest --> Safe[Sanitized public artifacts]
  Safe --> Home[Home world]
  Safe --> Projects[Project museum]
  Safe --> Presence[Presence control room]
  Safe --> Puzzles[Puzzle and archive layer]
  Public[Public sources: GitHub, guides, services] --> Safe
  Home --> About[/about portfolio escape hatch]
  Home --> Projects
  Home --> Guides[Guide archive]
  Home --> Presence
  Home --> Contact[Comms terminal]
  Home --> Arcade[Arcade room]
```

### Acceptance Examples

- AE1. A recruiter opens `/`, ignores the world fiction, clicks the visible `/about` path, and reaches the current portfolio without solving anything.
- AE2. A keyboard-only visitor tabs through the home world and reaches projects, guides, dashboard, contact, and About with visible focus states.
- AE3. A visitor with reduced motion enabled sees the same rooms and content with ambient animation removed or replaced.
- AE4. A public build artifact search for private Discord message text, sent-email text, iCloud note text, tokens, and Xfire server IPs returns no matches.
- AE5. A project page explains why PyKotor, ModSync, or another featured repo matters before showing stars, forks, or commit totals.
- AE6. A crawler reads public HTML and receives truthful public summaries plus crawler-preference metadata, but no hidden private corpus or puzzle solution list.
- AE7. The arcade room lets a user upload a local file for supported emulation paths and never offers copyrighted ROM downloads.
- AE8. If private presence data is stale, the dashboard shows the snapshot age and lowers confidence instead of pretending it is live.

### Success Criteria

- The site feels like an authored personal world within the first screen, while still offering a direct conventional path.
- At least five project entries include meaning summaries grounded in public project evidence.
- At least one Xfire-inspired artifact or timeline motif appears publicly without exposing raw private metadata.
- At least one agent/homelab/presence surface updates from sanitized data or a realistic static snapshot.
- GitHub Pages export and standalone builds both succeed on the surfaces they actually promise.
- Public route tests cover keyboard navigation, reduced-motion behavior, audio opt-in, and static-export fallback.
- A privacy scan confirms that generated public files do not contain raw private-source strings.

### Scope Boundaries

**Deferred for later**

- Full self-simulation / digital twin with persistent learning.
- Authenticated Gmail, iCloud, Facebook, and Google analytics ingestion.
- Additional Discord scraping beyond already-exported files.
- Browser Wii/GameCube emulation.
- Smart-home write controls from the public site.
- Publishing curated raw excerpts after manual approval.
- Fine-tuning or long-term memory systems for a public persona clone.

**Outside this product's identity**

- A generic portfolio template.
- A hostile dark-pattern site that blocks normal users, assistive tech, or truthful public extraction.
- A public archive of other people's private conversations.
- Hosted copyrighted ROMs, ripped commercial games, or unlicensed Flash game collections.
- A site that requires WebGL, high-end hardware, or audio to understand the core content.

### Dependencies / Assumptions

- The current repo uses Next.js 16 App Router, React 19, Tailwind v4, `PageLayout` for discovery routes, and `/about` as a separate portfolio context.
- `next.config.ts` already switches GitHub Pages builds to static export and standalone builds otherwise, which means export-safe surfaces need prebuilt JSON or static fallbacks.
- Current `robots.ts` only disallows `/api/` and `/public/`; crawler strategy needs expansion but cannot enforce crawler behavior alone.
- Xfire exports exist locally under the MassiveHDD downloads tree, including dated media metadata from 2008-2010.
- Discord exports exist locally under `Documents/discord_exports` with hundreds of files, including DMs and community channels.
- iCloud, Gmail, Facebook, and Google analytics connectors were requested but are not available in this session.
- Public GitHub identity can be used as a public source; private accounts and non-public social data require explicit adapter support and review.

### Outstanding Questions

**Resolve Before Planning**

- None. Planning can proceed using private ingestion adapters as explicit future slots.

**Deferred to Planning**

- Choose the first implementation slice: world shell only, project meaning layer, or shell plus one sanitized data artifact.
- Decide whether the first “little me” figure is CSS/SVG-only or a small canvas sprite.
- Pick which existing route becomes the first puzzle room and which clue format proves the pattern.
- Decide whether public artifacts live as checked-in demo JSON, generated local JSON, or both.

### Sources / Research

- `STRATEGY.md` defines the current dual-chrome product model and states that `/about` is the separate portfolio context.
- `README.md` documents the current Next.js 16 App Router stack, discovery/portfolio split, zero-env fallback posture, and static-export search behavior.
- `next.config.ts` confirms `DEPLOY_TARGET=github-pages` uses `output: "export"` while default builds use `standalone`.
- `src/app/robots.ts` confirms the current robots policy is basic and needs a richer crawler preference posture.
- `src/lib/config.ts` confirms config-first content and public GitHub user aggregation already exist.
- Context7 Next.js 16.1.6 docs confirm static export supports build-time Server Components/static GET handlers, while runtime server features are unsupported in export mode.
- MDN `prefers-reduced-motion` docs: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- MDN autoplay guide: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay
- Ruffle README: https://github.com/ruffle-rs/ruffle
- EmulatorJS README: https://github.com/EmulatorJS/EmulatorJS
- DiscordChatExporter README and ToS warning: https://github.com/Tyrrrz/DiscordChatExporter
- Cloudflare robots.txt docs: https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/
- Google Search Central robots.txt introduction: https://developers.google.com/search/docs/crawling-indexing/robots/intro
- Individual simulation research: https://arxiv.org/abs/2411.10109
