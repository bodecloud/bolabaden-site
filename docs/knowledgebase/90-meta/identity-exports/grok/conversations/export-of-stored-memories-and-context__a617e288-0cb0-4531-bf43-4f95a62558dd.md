---
source_url: "https://grok.com/c/a617e288-0cb0-4531-bf43-4f95a62558dd"
conversation_id: "a617e288-0cb0-4531-bf43-4f95a62558dd"
title: "Export of Stored Memories and Context"
extracted_at: "2026-06-29T16:07:42.421Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Export of Stored Memories and Context

Source: [Grok conversation](https://grok.com/c/a617e288-0cb0-4531-bf43-4f95a62558dd)

## User

_Time: 2026-06-13T12:27:26.454Z_

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

_Time: 2026-06-13T12:27:48.065Z_

```markdown
1. **Instructions**
[unknown] - I want straight, minimal answers that don’t waste time. Speak in FULL sentences and ensure you punctuate important points/information multiple times in different wording for ensured retension. * Tone: blunt, realistic, partially Socratic (ask just enough to check relevance), a little misanthropic. * Style: no fluff, no metaphors, no long build-up. * Method: explain things by pointing out what problem they solved compared to what existed before. * Goal: help you decide if something is worth your time or if something else is clearly better. * Comparisons: never explain each option separately, always explain them directly against each other in one go. Problem defined: cut out noise, keep intent, preserve accuracy, avoid “telephone game” distortion.

2. **Identity**
[2026-02-18] - Plays cello; restarted restringing/practice after 10-year hiatus (Feb 2026); researches premium strings (Kaplan vs Helicore, gut/synthetic/tungsten/titanium cores, cost-value for ADGC bundles); composes/requests LilyPond sheet music for game modules (e.g., "The Frontier: Cello Blizzard Lament", Carol of the Bells).
[2026-04-21–27] - Neurodivergent/autistic ("Maybe i'm autistic idk"); fast-moving decision-making, passion for infra exploration, overthinking social cues/alignment, difficulty with "neurotypical bullshit". Reframed anxiety: "much of my anxiety about how people view me is 'they dont'" — people focus on what affects them, making much anxiety pointless.
[2026-06-13] - Online Handles / Identity: Wizard [BIRB] / Wizard-P [BIRB] / Wizard [C#] — active developer, moderator, and community leader/owner in the OpenKotOR / KotOR modding Discord server (explicitly server owner). Sustained interest in self-hosting services (media, monitoring, security, file management). Values concise, efficient, and impactful tools. Uses Generative AI for learning new subjects. Follows speedrunning and values the dedication behind it. Actively engages with AI tools, programming in Go, and Kubernetes.

3. **Career**
[2026-02-03] - Developer contributing to KotOR.js (JS-based KotOR implementation/modding tools); reverse engineering game systems (save/load, Frostbite 3), asset porting (BF2 to KOTOR via Blender).
[2026-02-22] - Building open-source infrastructure (OldRepublicDevs/OpenKotOR GitHub orgs, HuggingFace mirrors/wikis). Works on OpenKotOR/PyKotor repos.
[unknown] - Technical: multi-arch builds, Git/uv auth, PDF-to-MD, audio proc, Rust/Go/Python, Wine, VapourSynth/AviSynth, IPv6, Headscale HA. Polyglot: C#/.NET (Win7 games), Python (uv/pytest), Rust, Java/Ghidra, LilyPond, Delphi/Pascal, shell. KotOR modding: BF2 asset porting (Blender), KOTOR save/load & Frostbite 3 RE, Ghidra/PyGhidra (remote/headless, batch/call graphs), Delphi/Pascal legacy, KotOR.js debugging + 3-year community feedback research (X/Reddit/DeadlyStream/Nexus).

4. **Projects**
[2026-02-16] - Andastra: personal game project C# StrideGameFPS targeting Win7/.NET 4.8 compat with modern .NET 9 SDK. Current status: in development. Key decisions: .NET 9 SDK targeting Win7/net48/x86 compat (MSBuild, upgrade-assistant, PublishReadyToRun).
[2026-02-03] - KotOR.js: JS-based KotOR implementation/modding tools. Current status: ongoing contributions. Key decisions: debugging + 3-year community feedback research (X/Reddit/DeadlyStream/Nexus) for bug ID/repro and resources.
[2026-04-03] - OpenKotOR orgs: building open-source infrastructure including GitHub orgs, HuggingFace mirrors/wikis. Current status: ongoing (merges, HF clones). Key decisions: alignment before major changes (org mirrors, funding); modding history/porting bans vs creative freedom; community disclaimers.
[unknown] - Nihilus - Fall of Katarr: high-quality mod/fan content for KotOR. Current status: planned. Key decisions: music-integrated modules.

5. **Preferences**
[2026-06-13] - AI coding assistants (Cursor/Copilot/custom) with creative, non-stale "vibe" personalities (witty/sarcastic/enthusiastic/mentor-like); heavy investment in prompts, AGENTS.md, MCP optimization. "AI is speed and i'm a junkie". "Vibe coding" blending AI + manual refinement for games/music/modding.
[2026-06-13] - Setups: Windows+WSL2/Podman, Oracle Cloud Free (Terraform/cloud-init gh/uv/npm), open-source/self-hostable. Broad compat (Win7/.NET 4.8, multi-arch). Prefers self-hosting over commercial services for media, monitoring, security, file management.
[2026-06-13] - Music: Premium cello strings (Kaplan/Helicore, gut/synth/tungsten), LilyPond engraving, Les Mis songs (Gavroche), game-integrated pieces. Community: Discord bots/roles/layouts, modding history/rules research (DeadlyStream/Nexus), fan content. Values concise, efficient, and impactful tools. Prefers technical assistance that is straightforward and respectful, akin to receiving support from peers.
[unknown] - Values passion-driven exploration, ambition, "planning for the worst"; community progress via alignment/clear communication over gatekeeping/slow consensus. Supports inclusivity (beyond GitHub, neurodivergent styles, bidirectional romances). Uses AI for flow-state preservation (drafting to maintain momentum) and objective social/team analysis.
```

This is the complete set from stored memories. No additional memories remain outside this export.
