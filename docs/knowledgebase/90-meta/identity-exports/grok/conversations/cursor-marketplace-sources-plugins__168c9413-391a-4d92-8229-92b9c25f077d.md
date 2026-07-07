---
source_url: "https://grok.com/c/168c9413-391a-4d92-8229-92b9c25f077d"
conversation_id: "168c9413-391a-4d92-8229-92b9c25f077d"
title: "Cursor Marketplace Sources & Plugins"
extracted_at: "2026-06-29T16:07:30.957Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Cursor Marketplace Sources & Plugins

Source: [Grok conversation](https://grok.com/c/168c9413-391a-4d92-8229-92b9c25f077d)

## User

_Time: 2026-06-29T08:05:34.768Z_

cursor marketplace sources

## Assistant

_Time: 2026-06-29T08:05:51.001Z_

**Cursor has two main "marketplace" ecosystems:**

1. **Official Cursor Marketplace** (for native **Plugins**): Skills, subagents, rules, hooks, commands, MCP servers, and automations.<grok:render card_id="3c755f" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">0</argument></grok:render>
2. **VS Code-style Extensions** (via Open VSX Registry, with some limitations).

### 1. Official Cursor Plugins Marketplace
This is Cursor's dedicated platform for **agent-native extensions** (plugins bundle rules, skills, MCP tools, etc.). Launched around early 2026, it focuses on deep integration with Cursor's AI agents.<grok:render card_id="ea2967" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">30</argument></grok:render>

- **Main site**: [https://cursor.com/marketplace](https://cursor.com/marketplace)<grok:render card_id="1a8efe" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>
  - Browse **Featured Plugins**, **Automations**, **Recently Added**, and categories like Infrastructure, Data & Analytics, Productivity, Payments, etc.
  - Examples: Datadog, Slack, Figma, Linear, Railway, AWS Core, Snyk, etc.
  - Install directly or via `/add-plugin` in Cursor.

- **Documentation**: [https://cursor.com/docs/plugins](https://cursor.com/docs/plugins) — Covers browsing, installing, managing, creating, and publishing plugins.<grok:render card_id="794909" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">3</argument></grok:render>

- **Community Directory**: [https://cursor.directory/](https://cursor.directory/) — 83k+ developers, trending plugins (e.g., language-specific rules for FastAPI, .NET, Go, React/Next.js), MCP servers, etc.<grok:render card_id="31c235" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">42</argument></grok:render>

- **Official GitHub Repo (sources)**: [https://github.com/cursor/plugins](https://github.com/cursor/plugins) — Open-source official plugins, spec, and examples (e.g., Cursor Team Kit, PR Review Canvas, continual-learning). Great for studying structure (`plugin.json`, skills/, rules/, MCP definitions).<grok:render card_id="f93da8" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">43</argument></grok:render>

- **Publishing**: Submit via [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish). Use the multi-plugin manifest format for repositories.<grok:render card_id="28dc82" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">3</argument></grok:render>

**Popular categories** include integrations with observability (Datadog, Grafana), infra (AWS, Netlify), project tools (Linear, Asana), and agent orchestration.

### 2. VS Code Extensions in Cursor
Cursor is a VS Code fork, so it supports many traditional extensions, but with changes:

- Cursor primarily uses the **Open VSX Registry** (Eclipse Foundation open alternative) instead of Microsoft's full VS Code Marketplace (transition ~June 2025).<grok:render card_id="d31a5e" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">16</argument></grok:render>
  - Many popular extensions work, but some (especially Microsoft-proprietary ones) are missing, outdated, or restricted.
  - Search/install via the Extensions view (Ctrl/Cmd + Shift + X).

- **Workarounds for missing extensions**:
  - Download `.vsix` files (from GitHub repos, VSIX downloader tools, or VS Code) and install via **Extensions: Install from VSIX...** (Command Palette).<grok:render card_id="17c2b0" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">20</argument></grok:render>
  - Manually configure marketplace URLs in `settings.json` for broader access (e.g., point to Visual Studio Marketplace).
  - Import from an existing VS Code installation.

- Common extensions mentioned by users: GitLens, Bookmarks, Tailwind, Rainbow CSV, etc.<grok:render card_id="33675d" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">13</argument></grok:render>

### Key Considerations & Nuances
- **Plugins vs. Extensions**: Plugins are more "agent-first" (MCP servers, skills for AI workflows) and preferred for modern Cursor usage. Traditional extensions are better for language servers, UI tweaks, etc.<grok:render card_id="b51252" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">14</argument></grok:render>
- **Compliance/Legal**: Microsoft enforces marketplace terms; Cursor navigates this carefully (e.g., no direct linking in some cases). Open VSX avoids some restrictions.
- **Team/Enterprise**: Supports team marketplaces and automations (e.g., PR workflows, CI triage).<grok:render card_id="311cd7" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">7</argument></grok:render>
- **Development**: Check the plugin spec on GitHub for building your own. Skills often include `SKILL.md` with frontmatter.

For your KotOR.js / game dev / MCP / agent workflows, the plugins marketplace (especially MCP integrations and rules packs) and community directory will be particularly valuable. Check the official marketplace and directory first, then GitHub sources for deeper customization.<grok:render card_id="e44a1d" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">1</argument></grok:render>

Let me know if you need help with a specific plugin, publishing one, or installing something!

## User

_Time: 2026-06-29T08:05:56.116Z_

cursor marketplace sources provide the top 10 that i can put in

## Assistant

_Time: 2026-06-29T08:06:06.499Z_

**Here’s a curated top 10 from the Cursor Marketplace and related high-quality community sources** (as of late June 2026) that you can install or copy into your projects. These focus on rules, plugins (which bundle rules/skills/MCPs), and frameworks relevant to your work in game dev, modding (KotOR.js, C#, Go, Kubernetes, infra), AI agents/MCP, and creative/vibe coding.<grok:render card_id="ce7c73" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">0</argument></grok:render><grok:render card_id="4fbe93" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">4</argument></grok:render>

### Official Cursor Marketplace (cursor.com/marketplace)
Plugins bundle **rules**, skills, subagents, MCP servers, etc., for one-click install (or via `/add-plugin` in Cursor). Prioritize these for seamless integration.

1. **Figma** — Figma MCP + skills for design-to-code workflows. Excellent for UI in game dev or modding tools (e.g., syncing mockups to React/Next.js or custom editors).<grok:render card_id="4b4a6c" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

2. **Linear** — Manage issues, projects, and docs directly in Cursor. Great for community/project alignment in OpenKotOR or your personal repos.<grok:render card_id="3b5221" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

3. **AWS Core** — Comprehensive skills for infra-as-code (CDK, Lambda, etc.), observability, and deployment. Pairs perfectly with your Oracle Cloud/Podman/Kubernetes self-hosting and multi-arch builds.<grok:render card_id="28d258" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

4. **Datadog** — Query logs/metrics/traces in natural language. Ideal for monitoring self-hosted services or game servers.<grok:render card_id="4256dc" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

5. **Railway** (Recently Added) — Deploy

## User

_Time: 2026-06-29T08:06:54.075Z_

cursor marketplace sources provide the top 10 that i can put in specifically and exclusively compatible with the cursor *marketplace*. e.g. compound engineering is an example. Provide 10 others, preferably ones that provide a lot of useful stuff that i can go through.

## Assistant

_Time: 2026-06-29T08:07:22.846Z_

**Here are 10 strong Cursor Marketplace plugins (or equivalent installable sources via `/add-plugin` or the directory) that are compatible with Cursor's ecosystem.** These focus on comprehensive, high-value ones similar to **Compound Engineering** (which bundles agents, skills, rules, workflows, MCPs, and specialized reviewers for iterative engineering).<grok:render card_id="41248f" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">0</argument></grok:render>

I prioritized ones with rich feature sets: multiple agents/skills, MCP servers for live context/tools, rules/best practices, and workflows that deliver broad utility across coding sessions, debugging, architecture, docs, testing, etc. Many are discoverable via **cursor.directory/** or Cursor's built-in marketplace search.<grok:render card_id="075743" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

### Top Recommendations (Ranked Roughly by Breadth/Usefulness for General Dev)
1. **Context7 MCP** (Highly Recommended)  
   Provides up-to-date, version-specific library/framework documentation and code examples directly in prompts. Prevents hallucinations on APIs, handles 18k+ docs, supports many languages/frameworks. Install via MCP config or marketplace; pair with "use context7" in prompts. Excellent for reducing research friction and improving accuracy across sessions.<grok:render card_id="d98552" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">61</argument></grok:render>

2. **Next.js Rules & Best Practices** (or similar high-star framework ones like React, SvelteKit, Nuxt)  
   Massive rulesets with best practices, patterns, and conventions tailored to the framework. High install counts (e.g., 37k+ for Next.js). Great for maintaining consistency in large projects; includes architecture guidance, component patterns, etc. Many framework-specific variants (Go, Python, Laravel, Flutter, etc.) follow the same model.<grok:render card_id="b72b83" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

3. **GitHub MCP Server**  
   Integrates directly with GitHub issues, PRs, repos for context-aware tasks. Lets agents read/write issues, fetch context, and handle repo operations. Ideal for workflow automation, bug triage, and keeping agents grounded in real project state.<grok:render card_id="91dd3e" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">58</argument></grok:render>

4. **Excalidraw Architect MCP**  
   Generates editable architecture diagrams with auto-layout, stateful editing, and component-aware styling. Perfect for visualizing systems, planning refactors, or documenting designs during agent sessions. Strong for visual thinkers and complex projects.<grok:render card_id="04aaeb" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

5. **MCP Mermaid**  
   Dynamically generates Mermaid diagrams/charts via AI. Complements architecture work with sequence, flow, ER diagrams, etc. Lightweight but high-utility for documentation and planning.<grok:render card_id="16edb6" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

6. **Supabase MCP** (or similar DB/Backend ones like PostgREST integration)  
   Enables database queries/operations via PostgREST. Agents can interact with Postgres schemas, data, etc., directly. Useful for full-stack work, data migrations, and backend logic.<grok:render card_id="b42ae8" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

7. **Playwright MCP** (or browser/testing focused)  
   Browser automation and E2E testing capabilities for agents. Run UI checks, interactions, and validations in workflows. Pairs well with QA/review agents.<grok:render card_id="450c96" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">58</argument></grok:render>

8. **Prompt Enhancer MCP**  
   Analyzes/improves prompts, generates templates, compares variants. 4 tools for refinement. Meta-tool that boosts all other agent interactions; great for power users iterating on complex tasks.<grok:render card_id="3137ea" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

9. **Create State** (or memory/knowledge graph plugins)  
   Builds persistent memory, knowledge graphs of decisions/code patterns across sessions. Session handoff, autonomous insights—makes agents "remember" and compound knowledge like Compound Engineering.<grok:render card_id="2157b7" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

10. **i18n Agent** or specialized workflow ones (e.g., EVC Team Relay MCP for Obsidian/notes, or enterprise like Linear/Port)  
    AI-powered translation management (JSON/YAML/MD/PO with regional sensitivity). Or explore Linear (issue/project management), Port (full engineering context/services/ownership), or Figma/Stripe integrations for design/payments workflows. These add deep domain tools and context.<grok:render card_id="31ee42" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

### Additional Notes & Tips
- **Installation**: In Cursor Agent chat, use `/add-plugin [name]` or search the marketplace. Many are GitHub-based repos with `.cursor-plugin/` manifests. Check **cursor.directory/** for trending/sorted lists and direct installs.<grok:render card_id="9a135a" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">28</argument></grok:render>
- **Why these?** They emphasize compounding value (rules + MCPs + agents/skills), similar to Compound Engineering's multi-agent reviews, workflows (`/workflows:plan`, etc.), and specialized tools. Framework rules provide huge immediate lift; MCPs add live external capabilities.<grok:render card_id="017f50" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">10</argument></grok:render>
- **Combinations**: Stack them (e.g., Context7 + GitHub MCP + framework rules + Compound Engineering) for a powerful setup. Test token usage, as heavy plugins can add context overhead.
- **Exploration**: Browse **cursor.com/marketplace** for official/verified ones (e.g., Datadog, Slack, AWS, Figma, Linear, Stripe). Look for plugins with SKILL.md, multiple .mdc rules, MCP configs, and agents.<grok:render card_id="d29fca" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">52</argument></grok:render>
- **Nuances**: Popularity (stars/installs) indicates reliability, but check GitHub for activity/updates. Some are framework-specific (great depth) vs. general (broader applicability). Edge cases: Enterprise plugins may need auth; test in a project to avoid conflicts.

These should give you plenty of "useful stuff to go through"—start with Context7 and a couple framework ones for quick wins, then layer in MCPs for agent superpowers. If you share your main stack (e.g., Go, web, game dev), I can refine further!
