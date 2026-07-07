---
source_url: "https://grok.com/c/4664dc41-f656-4564-bb92-9b695918b7b6"
conversation_id: "4664dc41-f656-4564-bb92-9b695918b7b6"
title: "Human Relay Provider Removed from Roo Code"
extracted_at: "2026-06-29T16:32:28.059Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Human Relay Provider Removed from Roo Code

Source: [Grok conversation](https://grok.com/c/4664dc41-f656-4564-bb92-9b695918b7b6)

## User

_Time: 2026-02-24T00:50:23.621Z_

what happened to the human relay open in roo why was it removed?

## Assistant

_Time: 2026-02-24T00:51:53.170Z_

**The Human Relay provider in Roo Code—a popular VS Code extension for AI-assisted coding—was removed in version 3.38.2.**<grok:render card_id="957050" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render><grok:render card_id="70e1d9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">95</argument>
</grok:render>

**Key reason: It lacked support for native tool calling, making it incompatible with Roo Code's updated architecture.**<grok:render card_id="8b273c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">94</argument>
</grok:render><grok:render card_id="d97e0f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">63</argument>
</grok:render>

**Users who relied on it can downgrade to an earlier version like 3.36.16, though the team ensured no crashes occur for existing setups.**<grok:render card_id="fff29b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">94</argument>
</grok:render>

### What Was Human Relay?
Human Relay was a free provider option in Roo Code that let users manually copy AI prompts from the extension, paste them into web-based AIs (e.g., ChatGPT, Claude, or Grok without an API key), and paste responses back. This enabled cost-free usage of powerful models via a "human-in-the-loop" workflow.<grok:render card_id="f1444b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">47</argument>
</grok:render><grok:render card_id="3bf0d1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render>

### Timeline of Addition and Removal
| Version | Date | Key Change |
|---------|------|------------|
| 3.8.0 | March 2025 | Added Human Relay provider.<grok:render card_id="cf6154" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">95</argument>
</grok:render> |
| Various (e.g., 3.28.9) | Mid-2025 | Bug reports, like interface freezing after a few messages.<grok:render card_id="a82117" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">73</argument>
</grok:render> |
| 3.38.2 | Dec 31, 2025 / Jan 2026 | Removed via PR #10388 (merged ~Dec 30, 2025).<grok:render card_id="3e82bf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">94</argument>
</grok:render><grok:render card_id="cb3597" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">95</argument>
</grok:render> |

### Current Status and Alternatives
- **No longer configurable** in Providers settings post-v3.38.<grok:render card_id="1a4157" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render>
- Downgrade via VS Code extensions (e.g., to 3.36.16) to retain it.<grok:render card_id="e3aee3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">63</argument>
</grok:render>
- Roo Code now emphasizes API-based providers with native tool support; free web AIs require manual workflows outside the extension.

---

Roo Code (previously Roo Cline) is an open-source VS Code extension that acts as an "AI dev team," providing agentic coding assistance through modes like Think, Code, and Architect. It integrates with various LLM providers for tasks such as file editing, tool calling (e.g., read_file, apply_diff), and context management. The extension has evolved rapidly, with frequent releases incorporating features like Boomerang Tasks, Agent Skills, and MCP (Modular Coding Protocol) support.

The Human Relay provider, introduced in version 3.8.0 on March 7, 2025, was a unique workaround for users without paid API access. In practice:
- Roo Code generates a detailed XML-formatted prompt (including system instructions, tools, and context).
- A VS Code dialog pops up with "Copy to Clipboard" for the prompt.
- User pastes into a browser-based AI (e.g., Google AI Studio, ChatGPT web).
- User copies the AI's response (expected in Roo's XML format) and pastes back.
- This repeats per LLM "turn," exposing the full reasoning chain for transparency and debugging.

It was praised for enabling free access to models like Grok-3 or Gemini, especially in "vibecoding" workflows, but criticized for inefficiency (manual copy-paste) and bugs like freezing on Windows.<grok:render card_id="739890" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">47</argument>
</grok:render><grok:render card_id="109b1d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">73</argument>
</grok:render>

### Detailed Removal Context
The removal occurred via Pull Request #10388 ("chore: remove human-relay provider") authored by maintainer @hannesrudolph and co-authored by Roo Code team, merged around December 30, 2025, and included in v3.38.2 (released December 31, 2025, with notes published later).<grok:render card_id="24712a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">94</argument>
</grok:render><grok:render card_id="1bf8ab" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">95</argument>
</grok:render>

**Explicit reason from PR:** "This provider does not operate with native tool calling." Native tool calling refers to direct LLM support for structured function calls (e.g., JSON schemas for tools like read_file or browser_action), which became a core requirement in recent Roo Code updates. Human Relay relied on manual XML parsing, bypassing this for web AIs lacking API tool support.<grok:render card_id="4f9321" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">94</argument>
</grok:render>

**Code changes in PR #10388:**
| Component Removed | Description |
|-------------------|-------------|
| API Handler | human-relay provider registration and logic. |
| UI/Dialog | Web-view dialog for copy-paste. |
| Messages/Commands | Human Relay-specific message types and IPC. |
| Tests/Translations | Associated unit tests and i18n strings. |

Maintainer @mrubens approved after confirming: "Looks good, as long as you confirmed the behavior for what happens to people who have the human relay provider selected when it goes away (just want to make sure the extension doesn’t crash the way it used to)." This ensured graceful fallback (no crashes).<grok:render card_id="580801" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">94</argument>
</grok:render>

### User Reactions and Discussions
Post-removal feedback was mixed but limited:
- **GitHub PR comments:** Users like @mini2s: "I Was using this on My pc, why did you remove it? What is the alternative... it is very useful." Reverted to v3.36.16.<grok:render card_id="083602" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">94</argument>
</grok:render>
- **Reddit (r/RooCode):** Thread "Is human relay dead now?" (Dec 28, 2025): Confirmed removal due to tool calling incompatibility; suggestions to downgrade.<grok:render card_id="13749e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">63</argument>
</grok:render>
- No major backlash on X (Twitter) since February 1, 2026; earlier posts (2025) highlight its utility for free models.

| Platform | Sentiment | Example |
|----------|-----------|---------|
| GitHub | Disappointed but pragmatic | Requests for alternatives; downgrades. |
| Reddit | Informational | Explains technical reason; downgrade advice. |
| X | Positive (pre-removal) | "Peak vibecoding"; automation ideas. |

### Broader Implications
The removal aligns with Roo Code's shift toward production-ready, API-native integrations (e.g., Cerebras, Claude Code). It streamlines the codebase, reducing maintenance for a niche, low-efficiency feature amid bugs like #8338 (freezing after 2-5 messages).<grok:render card_id="ef5e47" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">73</argument>
</grok:render> Alternatives include:
- Free tiers of supported providers (e.g., Grok-3 via xAI API).
- External tools like Aider's copy-paste mode.
- Custom MCP servers for local/web models.

Future updates (e.g., Agent Skills in v3.38.0) emphasize extensible, tool-native workflows over manual relays.

**Key Citations:**
- [Roo Code 3.38 Release Notes](https://docs.roocode.com/update-notes/v3.38)<grok:render card_id="1a7bad" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render>
- [GitHub PR #10388: Remove human-relay provider](https://github.com/RooCodeInc/Roo-Code/pull/10388)<grok:render card_id="440f8c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">94</argument>
</grok:render>
- [CHANGELOG.md](https://github.com/RooCodeInc/Roo-Code/blob/main/CHANGELOG.md)<grok:render card_id="1d2fc9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">95</argument>
</grok:render>
- [Reddit: Is human relay dead now?](https://www.reddit.com/r/RooCode/comments/1pxhwel/is_human_relay_dead_now)<grok:render card_id="8c90cd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">63</argument>
</grok:render>
- [Bug #8338: Human Relay Freeze](https://github.com/RooCodeInc/Roo-Code/issues/8338)<grok:render card_id="70640c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">73</argument>
</grok:render>
- [X Post Explaining Workflow](https://x.com/DavidFSWD/status/1927205162805797147)<grok:render card_id="c046dd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">47</argument>
</grok:render>
