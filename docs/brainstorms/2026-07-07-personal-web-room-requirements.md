---
date: 2026-07-07
topic: personal-web-room
---

# Personal Web Room Requirements

> Superseded: use `docs/plans/2026-07-07-001-feat-personality-grounded-home-hub-plan.md` as the current requirements source. This brainstorm assumed the Discord/Xfire/Wizard material was not first-class enough and kept too much generic "web room" framing.

## Summary

The homepage should become Boden Crouch's personal web room: a useful hangout with shortcuts, archive-shaped guidance, rabbit holes, and a lightweight interactive scene. It should feel professional enough for collaborators and recruiters, but approachable enough that a curious visitor wants to click around.

---

## Problem Frame

The previous discovery-hub framing made the site coherent, but it also made the homepage feel like infrastructure packaging. That misses the stronger signal in the archive: Boden repeatedly hunts for better tools, lower-friction systems, useful AI workflows, old software archaeology, creative music tooling, and practical answers to oddly specific problems.

The homepage should not read as a company page, a resume, or a static archive index. It should make the visitor feel like they walked into a real person's desk, terminal, bookshelf, server closet, and creative room, with useful doors everywhere.

The public site also needs a privacy boundary. The archive can shape the voice, taxonomy, and navigation, but it should not dump raw Discord, Xfire, email, or private notes into public retrieval unless those sources are intentionally imported and filtered.

---

## Key Decisions

- **Web room over corporate portfolio.** The homepage leads with personality, usefulness, and curiosity; `/about` can remain the clean professional narrative.
- **Useful first, weird second.** The experience should give visitors immediate utility through search, guides, projects, status, and contact, then reward deeper clicking with stranger archive trails.
- **Archive-shaped, not archive-dumped.** Public copy and bot answers synthesize themes from the visible archive instead of exposing raw logs.
- **Lightweight interaction before full game.** The first interactive layer should feel alive without making the critical path depend on a heavy engine.
- **Honest source status.** The site should distinguish indexed ChatGPT/Grok/Perplexity exports from missing or not-yet-imported Discord, Xfire, and email sources.

---

## Actors

- A1. **Curious visitor:** wants something useful or surprising without reading a resume first.
- A2. **Collaborator or recruiter:** wants to understand Boden's practical strengths and project range quickly.
- A3. **Returning friend or peer:** wants shortcuts, status links, odd rabbit holes, and a sense of what Boden has been thinking about.
- A4. **Future Boden bot:** answers public-facing questions using curated archive themes and, later, filtered retrieval.

---

## Requirements

**Homepage experience**

- R1. The homepage must present the site as a personal web room rather than a company, enterprise product, or generic developer portfolio.
- R2. The first viewport must include an interactive visual anchor that communicates "room full of useful objects" without requiring instructions.
- R3. The page must preserve quick access to search, projects, guides, dashboard/status, and contact.
- R4. The page must include multiple curiosity paths that map to recurring archive themes: AI tooling, self-hosting, old game tooling, workstation repair, music, and practical research.
- R5. The page must keep professional context available without making the homepage sound like a job application.

**Boden bot**

- R6. The site must include a public Boden bot or bot sketch that explains the site, summarizes major interests, and routes visitors to useful areas.
- R7. The bot must not claim to be a raw private archive reader until filtered retrieval exists.
- R8. Bot answers must use plain language and should sound like a concierge for a curious person's workshop, not a corporate support agent.
- R9. The bot must support suggested prompts so visitors can understand what to ask without guessing.

**Archive and source handling**

- R10. The site must show that the visible local knowledgebase contains more than two thousand plaintext archive files.
- R11. The site must summarize archive-derived themes without implying every source named by the user has been fully imported.
- R12. Discord, Xfire, email, and personal-note material must be treated as absent or unverified until a real local source is found and intentionally processed.
- R13. Future archive ingestion must be filtered for public safety before powering public search or bot answers.

**Depth and delight**

- R14. The page must include at least one hidden or optional exploratory path that rewards curiosity without blocking normal navigation.
- R15. Animation should support the room metaphor through purposeful motion, not generic decorative effects.
- R16. The design should make the visitor remember a phrase or mental image, such as "a person with too many tabs open, but a real reason for every tab."
- R17. The experience should make niche interests feel connected instead of random.

**SEO and shareability**

- R18. Metadata and visible headings must describe the page in searchable plain language: Boden Crouch, personal web room, AI tooling, self-hosting, KOTOR or old game tooling, local LLMs, and useful shortcuts.
- R19. The homepage should have at least one shareable concept stronger than "personal site," such as an explorable desk, archive-shaped assistant, or useful rabbit-hole shelf.
- R20. The site should avoid buzzword-heavy positioning and prefer concrete phrases that describe what visitors can do.

---

## Key Flows

- F1. **Useful visitor lands on the homepage**
  - **Trigger:** Visitor opens `/`.
  - **Actors:** A1.
  - **Steps:** Visitor sees the room, chooses search, guides, projects, status, or contact, and reaches the target path without needing to understand the whole concept.
  - **Outcome:** The site is useful within the first minute.
  - **Covers:** R1, R2, R3, R20.

- F2. **Curious visitor explores the room**
  - **Trigger:** Visitor clicks an object, shelf, label, or hidden path.
  - **Actors:** A1, A3.
  - **Steps:** Visitor discovers a theme trail, reads why it matters, and can continue to related pages or prompts.
  - **Outcome:** The homepage feels like a place to explore, not a static landing page.
  - **Covers:** R4, R14, R15, R16, R17.

- F3. **Professional visitor evaluates Boden**
  - **Trigger:** Visitor wants credible context.
  - **Actors:** A2.
  - **Steps:** Visitor can move from the web room to projects, `/about`, contact, and public work without losing the site's personality.
  - **Outcome:** The site supports professional evaluation without becoming sterile.
  - **Covers:** R5, R18, R20.

- F4. **Visitor asks Boden bot**
  - **Trigger:** Visitor opens the bot or selects a prompt.
  - **Actors:** A1, A2, A3, A4.
  - **Steps:** Bot answers from curated public themes, routes the visitor to a site area, and states limits when a source is not indexed.
  - **Outcome:** The bot makes the archive approachable without overexposing private material.
  - **Covers:** R6, R7, R8, R9, R11, R12, R13.

---

## Acceptance Examples

- AE1. **Covers R3, R5.** Given a recruiter lands on the homepage, when they want professional context, then projects, about, and contact are visible paths without turning the homepage into a resume.
- AE2. **Covers R6, R7, R12.** Given a visitor asks the bot about Discord or Xfire, when those sources have not been imported, then the bot states that they are not indexed instead of inventing coverage.
- AE3. **Covers R14, R15.** Given a visitor ignores the exploratory parts, when they use the site normally, then navigation still works without the hidden layer.
- AE4. **Covers R18, R19.** Given the page is shared externally, when someone sees the title or preview, then it communicates a memorable personal web-room concept instead of only "portfolio."

---

## Success Criteria

- The homepage can be explained in one sentence as "Boden's personal web room for useful shortcuts, rabbit holes, projects, and an archive-shaped assistant."
- A first-time visitor can reach search, projects, guides, dashboard/status, and contact from the homepage without reading long copy.
- The design has a memorable visual metaphor visible above the fold on desktop and mobile.
- The bot never claims access to sources that the source-status card says are missing or not imported.
- A planner can add the next interactive layer without changing the product identity.

---

## Scope Boundaries

### Deferred for later

- A real retrieval-backed Boden bot over filtered archive chunks.
- A small 2.5D or WebGL explorable room with character movement.
- Publicly safe ingestion of Discord, Xfire, email, and personal notes if real local exports are provided.
- Local semantic search across guides, projects, and archive summaries.
- Analytics-backed iteration on which shortcuts and rabbit holes visitors actually use.

### Outside this product's identity

- A corporate homepage that hides the person's interests behind generic value propositions.
- A raw private-log viewer.
- A full social network, account system, or visitor profile system.
- A heavy game that delays or replaces the useful homepage.
- Infrastructure documentation migration from `bolabaden-infra`; that repository remains separate.

---

## Dependencies / Assumptions

- A1. Existing public routes for search, projects, guides, dashboard/status, contact, and about remain available as navigation targets.
- A2. The visible archive count and theme counts are derived from local plaintext files under `docs/knowledgebase/90-meta`.
- A3. The current local scan does not show complete first-class Discord, Xfire, or email export directories.
- A4. Future private-source ingestion requires a public/private filtering step before any public bot or search use.
- A5. The site remains a Next.js portfolio/hub with no required database for the public homepage.

---

## Outstanding Questions

### Deferred to Planning

- Q1. Should the next interactive layer be a deeper CSS/DOM room, a canvas mini-scene, or a lightweight WebGL prototype?
- Q2. Should the bot stay scripted for v2, or should it gain retrieval over a curated public summary index first?
- Q3. Which hidden objects or easter eggs should become the first repeat-visit loop?
- Q4. Should the old discovery-hub `STRATEGY.md` be revised to make the personal web room the canonical homepage strategy?

---

## Sources / Research

- `STRATEGY.md` frames the prior discovery-hub and portfolio split that this brainstorm revises.
- `docs/brainstorms/2026-06-29-site-cohesion-requirements.md` documents the earlier two-context approach.
- `docs/brainstorms/2026-06-29-discovery-backlog-requirements.md` preserves useful discovery-hub backlog items that can become web-room doors rather than the homepage identity.
- `src/components/boden-web-room.tsx` and `src/lib/boden-room-data.ts` show the current v1 direction and source-status boundary.
- `docs/knowledgebase/90-meta` contains the visible archive corpus used to identify recurring themes.
