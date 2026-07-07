---
source_url: "https://grok.com/c/9a8c9367-c3ed-478b-89cb-ae2cd5290605"
conversation_id: "9a8c9367-c3ed-478b-89cb-ae2cd5290605"
title: "Export All Stored Memories and Context"
extracted_at: "2026-06-29T16:07:44.740Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Export All Stored Memories and Context

Source: [Grok conversation](https://grok.com/c/9a8c9367-c3ed-478b-89cb-ae2cd5290605)

## User

_Time: 2026-06-13T12:26:30.579Z_

Export all of my stored memories and any context you've learned about me from past conversations. Preserve my words verbatim where possible, especially for instructions and preferences.
## Categories (output in this order):
1. **Instructions**: Rules I've explicitly asked you to follow going forward — tone, format, style, "always do X", "never do Y", and corrections to your behavior. Only include rules from stored memories, not from conversations.
2. **Identity**: Name, age, location, education, family, relationships, languages, and personal interests.
3. **Career**: Current and past roles, companies, and general skill areas.
4. **Projects**: Projects I meaningfully built or committed to. Ideally ONE entry per project. Include what it does, current status, and any key decisions. Use the project name or a short descriptor as the first words of the entry.
5. **Preferences**: Opinions, tastes, and working-style preferences that apply broadly.
## Format:
Use section headers for each category. Within each category, list one entry per line, sorted by oldest date first. Format each line as:
[YYYY-MM-DD] - Entry content here.
If no date is known, use [unknown] instead.
## Output:
- Wrap the entire export in a single code block for easy copying.
- After the code block, state whether this is the complete set or if more remain.

## Assistant

_Time: 2026-06-13T12:26:52.399Z_

```markdown
## 1. Instructions
[unknown] - I want straight, minimal answers that don’t waste time. Speak in FULL sentences and ensure you punctuate important points/information multiple times in different wording for ensured retention. Tone: blunt, realistic, partially Socratic (ask just enough to check relevance), a little misanthropic. Style: no fluff, no metaphors, no long build-up. Method: explain things by pointing out what problem they solved compared to what existed before. Goal: help you decide if something is worth your time or if something else is clearly better. Comparisons: never explain each option separately, always explain them directly against each other in one go. Problem defined: cut out noise, keep intent, preserve accuracy, avoid “telephone game” distortion.

## 2. Identity
[2026-06-13] - Online Handles / Identity: Wizard [BIRB] / Wizard-P [BIRB] / Wizard [C#] — active developer, moderator, and community leader/owner in the OpenKotOR / KotOR modding Discord server (explicitly server owner).
[unknown] - Neurodivergent/autistic ("Maybe i'm autistic idk"); fast-moving decision-making, passion for infra exploration, overthinking social cues/alignment, difficulty with "neurotypical bullshit".
[2026-04-25] - Reframed anxiety: "much of my anxiety about how people view me is 'they dont'" — people focus on what affects them, making much anxiety pointless.
[unknown] - Sustained interest in self-hosting services (media, monitoring, security, file management). Values concise, efficient, and impactful tools. Uses Generative AI for learning new subjects. Follows speedrunning and values the dedication behind it. Plays cello.
[unknown] - Location from IP: Wheaton, Illinois, US.

## 3. Career
[unknown] - Developer contributing to KotOR.js (JS-based KotOR implementation/modding tools); reverse engineering game systems (save/load, Frostbite 3), asset porting (BF2 to KOTOR via Blender), building open-source infrastructure (OldRepublicDevs/OpenKotOR GitHub orgs, HuggingFace mirrors/wikis).
[unknown] - Polyglot: C#/.NET (Win7 games), Python (uv/pytest), Rust, Java/Ghidra, LilyPond, Delphi/Pascal, shell. Works on OpenKotOR/PyKotor repos.
[unknown] - Technical: multi-arch builds, Git/uv auth, PDF-to-MD, audio proc, Rust/Go/Python, Wine, VapourSynth/AviSynth, IPv6, Headscale HA.
[unknown] - AI coding workflows: Cursor/Copilot personalization (creative "vibe" personalities via AGENTS.md/.cursor/rules), MCP servers (CLI/GUI/VM control, dynamic tools, bridges), one-shot AI game generators, Blender AI agents, cloud-init (Oracle Cloud Free tier, Podman multi-arch, WSL2 Fedora Silverblue).

## 4. Projects
[2026-02-03] - KotOR.js: JS-based KotOR implementation/modding tools; ongoing core contributor with debugging + 3-year community feedback research (X/Reddit/DeadlyStream/Nexus) for bug ID/repro and resources; status ongoing with community leadership.
[2026-02-16] - Andastra: C# StrideGameFPS targeting Win7/.NET 4.8 compat with modern .NET 9 SDK (MSBuild, upgrade-assistant, PublishReadyToRun); personal game project; status in development.
[2026-02-18] - Cello practice and composition: Restarted after 10-year hiatus; researches premium strings (Kaplan vs Helicore, gut/synthetic/tungsten/titanium cores); composes/requests LilyPond sheet music for game modules (e.g., "The Frontier: Cello Blizzard Lament", Carol of the Bells); ongoing with integration into mods.
[2026-02-22] - Oracle Cloud Free tier maximization: Terraform, full resources, homelab setup with cloud-init (gh/uv/npm), Podman multi-arch, WSL2 Fedora Silverblue; personal repo docs rewrite; ongoing optimization for self-hosting.
[2026-04-03] - OpenKotOR org: HF clone/org creation, modding history/porting bans vs creative freedom; community disclaimers; ongoing with merges and infrastructure.
[2026-04-21–27] - OpenKotOR community work: HF clone/org creation; tensions with BluCollarG33k [T3M4] over cloning/alignment/decision speed; "Wizard's mindset" analysis; ongoing server ownership and moderation (Modzilla role).
[unknown] - Nihilus - Fall of Katarr: High-quality mod/fan content with music-integrated modules; status in planning/creation.
[unknown] - Various modding tools: BF2 asset porting via Blender, Ghidra/PyGhidra for RE (remote/headless, batch/call graphs), texture upscalers, AI generators; ongoing.

## 5. Preferences
[unknown] - AI coding assistants (Cursor/Copilot/custom) with creative, non-stale "vibe" personalities (witty/sarcastic/enthusiastic/mentor-like); heavy investment in prompts, AGENTS.md, MCP optimization. "AI is speed and i'm a junkie".
[unknown] - "Vibe coding" blending AI + manual refinement for games/music/modding.
[unknown] - Setups: Windows+WSL2/Podman, Oracle Cloud Free (Terraform/cloud-init gh/uv/npm), open-source/self-hostable. Broad compat (Win7/.NET 4.8, multi-arch). Prefers self-hosting over commercial services for media, monitoring, security, file management.
[unknown] - Music: Premium cello strings (Kaplan/Helicore, gut/synth/tungsten), LilyPond engraving, Les Mis songs (Gavroche), game-integrated pieces.
[unknown] - Community: Discord bots/roles/layouts, modding history/rules research (DeadlyStream/Nexus), fan content. Values passion-driven exploration, ambition, "planning for the worst"; community progress via alignment/clear communication over gatekeeping/slow consensus. Supports inclusivity (beyond GitHub, neurodivergent styles, bidirectional romances).
[unknown] - Prefers technical assistance that is straightforward and respectful, akin to receiving support from peers. Values concise, efficient, and impactful tools.
```

This is the complete set from stored memories. No additional context remains outside this structured export.
