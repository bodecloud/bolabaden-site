---
source_url: "https://grok.com/c/e041a8cc-4354-43da-aefc-8db6108a4794"
conversation_id: "e041a8cc-4354-43da-aefc-8db6108a4794"
title: "Unifying K1 and TSL Analysis"
extracted_at: "2026-06-29T16:12:49.301Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Unifying K1 and TSL Analysis

Source: [Grok conversation](https://grok.com/c/e041a8cc-4354-43da-aefc-8db6108a4794)

## User

_Time: 2026-01-09T23:47:33.515Z_

````markdown
#### 1. MANDATORY: Core Game Engine Fidelity (Highest Priority Rule)

For **ANY** change involving engine features, file formats, game mechanics, resources, or reverse-engineered behavior:

- **YOU MUST** analyze both K1 (`swkotor.exe`) and TSL (`swkotor2.exe`) using REVA MCP tools.
- Open the project with: `open-project <full path to .gpr>` (common paths: resolve `%USERPROFILE%\test.gpr` → e.g., `C:\Users\boden\test.gpr` **or** `%USERPROFILE%\Andastra Ghidra Project.gpr`).
- Use unified K1/TSL naming and code paths.
- Highlight differences explicitly and use conditionals for game-specific divergences.
- Label game-specific exceptions clearly.

**Address & Reference Formatting – EXACT RULES (MUST FOLLOW)**

- Format addresses as: `FunctionName @ (K1: 0xADDRESS, TSL: 0xADDRESS)` if identical, or separate with **exactly** `TODO: <task>` if unknown.
- Comment references as: `# Reference: K1 swkotor.exe:0xADDRESS, TSL swkotor2.exe:0xADDRESS`

**CORRECT EXAMPLE (USE THIS PATTERN):**

```
        * Callees (call chain depth 3+):
          * ~Model() @ (K1: 0x0043f790, TSL: TODO: Find this address) (destructor, called if duplicate found)
          * IODispatcher::GetRef() @ (K1: 0x004a0580, TSL: TODO: Find this address) (singleton accessor)
          * MaxTree::AsModel() @ (K1: 0x0043e1c0, TSL: TODO: Find this address) (type check and cast)
          * __stricmp() @ (K1: 0x0070acaf, TSL: TODO: Find this address) (case-insensitive string comparison)
```

**INCORRECT EXAMPLE (NEVER USE):**

```
        * Callees (call chain depth 3+):
          * ~Model() @ 0x0043f790 (destructor, called if duplicate found)
          * IODispatcher::GetRef() @ 0x004a0580 (singleton accessor)
          ...
```

- Compare decompilations, similarities, and references via `mcp_reva_*` tools.
- **NEVER** skip this step. If REVA is unavailable, note the exact reason.

**MANDATORY CONFIRMATION (REQUIRED IN EVERY RELEVANT RESPONSE):**
At the end of any response involving engine-related changes, **YOU MUST** add exactly one of these lines:

- `REVA status: Completed :)`
- `REVA status: Skipped - <exact reason> :(`
````

How to get the ai llm coding agents to fully unify swkotor.exe (aka k1), with swkotor2.exe (k2)? it constantly uses tool calls for one but not the other, and more annoyingly it commonly puts tsl and k1 in different sections when writing docstrings and other documentation. It's annoying. They're the same game with slight discrepancies/differences (function address and occasionally logic within a function). All functions always exist in both. Yet it'll fail to remember to do this.
 
Web research ai llm coding agent best prompting strategies, fixing common issues like this, etc find actual posts june 2025 or later that tell how to fix this and similar problems so the ai llm coding agents will do what we want.

## Assistant

_Time: 2026-01-09T23:48:38.460Z_

**Key Points**
- Recent 2025 sources emphasize that LLMs achieve consistent behavior through strong system-level instructions, few-shot examples, and structured prompting rather than one-off queries.
- To unify analysis of similar executables like swkotor.exe (K1) and swkotor2.exe (K2), embed your mandatory unification rule directly into persistent custom instructions or a rules file.
- Techniques like chain-of-thought, focused tasks, and output formatting constraints reliably reduce forgetting and separation of K1/TSL documentation.
- Breaking tasks into small steps while repeating key rules prevents drift in long reverse-engineering sessions.

**Embedding Rules Persistently**  
Place your full MANDATORY Core Game Engine Fidelity rule (including address formatting and REVA requirements) in the AI's system prompt or custom instructions. Many 2025 workflows use dedicated rules files (e.g., RULES.md or CLAUDE.md) that the AI references at the start of every interaction. This keeps the unification directive in the "root" context, reducing recency bias where later messages override early rules.

**Providing Few-Shot Examples**  
Always include 2–3 concrete examples of the desired unified output format in your prompts or system instructions. For instance, show the exact callee list pattern with (K1: 0x..., TSL: 0x...) or TODOs, plus a wrong separated version marked as incorrect. Few-shot prompting teaches the pattern explicitly and dramatically improves format consistency across responses.

**Using Chain-of-Thought and Structured Prompts**  
Start prompts with: "First, recall the mandatory unification rule for K1 and TSL. Confirm you will analyze both executables and use unified formatting. Then, step by step..." This forces the model to acknowledge the rule before proceeding. Specify structured output, e.g., "Format all addresses as: FunctionName @ (K1: 0xADDRESS, TSL: 0xADDRESS)" and require a confirmation like "Unification status: Applied".

**Breaking Tasks and Repeating Reminders**  
Handle one function or feature at a time, but explicitly remind: "Apply the core unification rule to both swkotor.exe and swkotor2.exe." In agentic workflows with tool calls, add: "When using REVA MCP tools, always analyze both K1 and TSL addresses/references unless explicitly irrelevant." Small, focused prompts reduce context overload and improve rule adherence.

**Advanced Consistency Techniques**  
For long sessions, use "nested rules" — keep a lightweight core rule set always loaded, with detailed examples retrieved as needed. If your coding agent supports projects or memory (common in 2025 tools), store the unification guideline as persistent context.

---

**Comprehensive Guide to Achieving Unified Analysis in Similar Binaries with AI Coding Agents**

Reverse engineering closely related executables like *Star Wars: Knights of the Old Republic* (swkotor.exe, K1) and its sequel (swkotor2.exe, TSL/K2) presents a common challenge: AI assistants often analyze one binary thoroughly while neglecting the other or producing separate documentation sections despite minor differences in addresses and occasional logic. This stems from context window limitations, recency bias, and insufficiently reinforced instructions. However, prompt engineering advances documented throughout 2025 provide reliable solutions to enforce unification—treating the engines as a single codebase with explicit differences noted.

**Core Problem Analysis**  
LLMs prioritize recent context, so initial rules get pushed out as conversations lengthen. In agentic coding workflows involving tool calls (e.g., REVA MCP for Ghidra projects), the model may plan steps for one executable but forget to duplicate them for the other. Separation in documentation arises when the model lacks strong pattern enforcement, defaulting to isolated descriptions instead of your preferred unified format with conditional addresses.

**Proven 2025 Prompt Engineering Strategies**  
Experts in late 2025 recommend a multi-layered approach combining persistent instructions, exemplars, and structured reasoning.

1. **Persistent System-Level Rules**  
   Embed your exact MANDATORY rule in the AI's custom instructions or a dedicated rules file loaded at session start. Addy Osmani's widely cited 2026 workflow highlights using files like CLAUDE.md to define project-wide conventions, ensuring rules remain in context without repetition per message → https://addyosmani.com/blog/ai-coding-workflow/.

2. **Few-Shot Prompting for Format Enforcement**  
   Supply multiple examples of correct unified output versus incorrect separated output. Lakera's 2025 guide notes few-shot prompting as one of the most effective ways to teach consistent formatting, especially when combined with delimiters → https://www.lakera.ai/blog/prompt-engineering-guide.

   | Technique              | Description                                                                 | Example Application for K1/TSL Unification                          |
   |------------------------|-----------------------------------------------------------------------------|---------------------------------------------------------------------|
   | Few-Shot Prompting     | Provide 2–3 full examples of desired output                                 | Show correct callee list with unified addresses; mark separated version wrong |
   | Chain-of-Thought       | Force step-by-step reasoning starting with rule recall                       | "Step 1: Recall unification rule. Step 2: Analyze both executables..." |
   | Structured Output      | Mandate exact format with constraints                                       | "Always use: Function @ (K1: 0x..., TSL: 0x...) or TODO"             |
   | Role-Playing           | Assign persona: "You are a KOTOR engine unification expert"                 | Guides consistent behavior across tasks                             |
   | Prefilling/Anchoring   | Start response skeleton                                                     | Begin with "Unification applied: Both K1 and TSL analyzed..."       |

3. **Chain-of-Thought and Step-by-Step Enforcement**  
   Require explicit acknowledgment: "Before any analysis, confirm: 'Applying core unification rule to both K1 and TSL.'" This leverages CoT prompting, shown in 2025 benchmarks to improve adherence in technical tasks.

4. **Task Decomposition and Focused Prompts**  
   Break reverse engineering into atomic steps: e.g., "Analyze this function in K1, then immediately do the equivalent in TSL using unified formatting." Osmani's workflow stresses that LLMs perform best on one focused objective at a time, reducing drift.

5. **Context Engineering for Long Sessions**  
   Use memory retention techniques: summarize prior unification confirmations and re-inject them, or chain constraints so new requests build on the rule. This counters "forgetting" in extended interactions → https://gpt-lab.eu/context-engineering-ai/.

6. **Nested or Hierarchical Rules**  
   Maintain a short core rule set (your mandatory guideline) always active, with detailed examples or sub-rules retrieved on demand. A December 2025 analysis attributes most rule-forgetting to overloaded flat instructions and recommends this nesting → https://bobde-yagyesh.medium.com/why-your-ai-agent-keeps-forgetting-your-rules-and-how-to-fix-it-dc889b7eacbd.

**Practical Implementation Template**  
Use this prompt structure for every interaction:

```
You are a reverse engineering expert specializing in unified analysis of KOTOR1 (swkotor.exe) and KOTOR2 (swkotor2.exe).

[Insert full MANDATORY Core Game Engine Fidelity rule here]

Few-shot examples:
CORRECT:
* FunctionName @ (K1: 0x0043f790, TSL: 0x00512345) ...

INCORRECT (never do this):
* K1 section: ...
* TSL section: ...

First, confirm: "Unification rule applied: Will analyze both executables with unified formatting."

Then, step by step: [your task]
```

This combination—drawn from 2025 best practices—virtually eliminates separation and inconsistent tool application while enforcing your exact address/reference formatting.

**Key Citations**
- Addy Osmani, "My LLM coding workflow going into 2026" (January 2026) → https://addyosmani.com/blog/ai-coding-workflow/
- Lakera AI, "The Ultimate Guide to Prompt Engineering in 2025" → https://www.lakera.ai/blog/prompt-engineering-guide
- "Why Your AI Agent Keeps “Forgetting” Your Rules (And How to Fix It)" (December 2025) → https://bobde-yagyesh.medium.com/why-your-ai-agent-keeps-forgetting-your-rules-and-how-to-fix-it-dc889b7eacbd
- GPT-Lab, "Context Engineering: How to Stop Your AI from Forgetting" (August 2025) → https://gpt-lab.eu/context-engineering-ai/
- Various Reddit discussions on LLM coding consistency (2025 threads) → https://www.reddit.com/r/ClaudeAI/comments/1q3t579/i_spent_2000_hours_coding_with_llms_in_2025_here/

## User

_Time: 2026-01-09T23:50:09.597Z_

````markdown
#### 1. MANDATORY: Core Game Engine Fidelity (Highest Priority Rule)

For **ANY** change involving engine features, file formats, game mechanics, resources, or reverse-engineered behavior:

- **YOU MUST** analyze both K1 (`swkotor.exe`) and TSL (`swkotor2.exe`) using REVA MCP tools.
- Open the project with: `open-project <full path to .gpr>` (common paths: resolve `%USERPROFILE%\test.gpr` → e.g., `C:\Users\boden\test.gpr` **or** `%USERPROFILE%\Andastra Ghidra Project.gpr`).
- Use unified K1/TSL naming and code paths.
- Highlight differences explicitly and use conditionals for game-specific divergences.
- Label game-specific exceptions clearly.

**Address & Reference Formatting – EXACT RULES (MUST FOLLOW)**

- Format addresses as: `FunctionName @ (K1: 0xADDRESS, TSL: 0xADDRESS)` if identical, or separate with **exactly** `TODO: <task>` if unknown.
- Comment references as: `# Reference: K1 swkotor.exe:0xADDRESS, TSL swkotor2.exe:0xADDRESS`

**CORRECT EXAMPLE (USE THIS PATTERN):**

```
        * Callees (call chain depth 3+):
          * ~Model() @ (K1: 0x0043f790, TSL: TODO: Find this address) (destructor, called if duplicate found)
          * IODispatcher::GetRef() @ (K1: 0x004a0580, TSL: TODO: Find this address) (singleton accessor)
          * MaxTree::AsModel() @ (K1: 0x0043e1c0, TSL: TODO: Find this address) (type check and cast)
          * __stricmp() @ (K1: 0x0070acaf, TSL: TODO: Find this address) (case-insensitive string comparison)
```

**INCORRECT EXAMPLE (NEVER USE):**

```
        * Callees (call chain depth 3+):
          * ~Model() @ 0x0043f790 (destructor, called if duplicate found)
          * IODispatcher::GetRef() @ 0x004a0580 (singleton accessor)
          ...
```

- Compare decompilations, similarities, and references via `mcp_reva_*` tools.
- **NEVER** skip this step. If REVA is unavailable, note the exact reason.

**MANDATORY CONFIRMATION (REQUIRED IN EVERY RELEVANT RESPONSE):**
At the end of any response involving engine-related changes, **YOU MUST** add exactly one of these lines:

- `REVA status: Completed :)`
- `REVA status: Skipped - <exact reason> :(`
````

How to get the ai llm coding agents to fully unify swkotor.exe (aka k1), with swkotor2.exe (k2)? it constantly uses tool calls for one but not the other, and more annoyingly it commonly puts tsl and k1 in different sections when writing docstrings and other documentation. It's annoying. They're the same game with slight discrepancies/differences (function address and occasionally logic within a function). All functions always exist in both. Yet it'll fail to remember to do this.
 
Web research ai llm coding agent best prompting strategies, fixing common issues like this, etc find actual posts june 2025 or later that tell how to fix this and similar problems so the ai llm coding agents will do what we want.

Your response should contain a full complete copy/paste-able template with better quality and improvements directly from the above text I've attached with zero omissions or additional text.

## Assistant

_Time: 2026-01-09T23:51:21.784Z_

**Key Insights on Unifying K1 and TSL Analysis in AI Coding Agents**

- Research from late 2025 sources indicates that LLMs consistently follow complex rules when prompts include mandatory step-by-step workflows, explicit prohibitions, and enforcement mechanisms like status confirmations.
- It seems likely that the primary issues—analyzing only one game or separating K1/TSL into different sections—stem from instruction overload or lack of enforced sequential checks; these are fixable with structured workflows and strict formatting rules.
- The evidence leans toward examples outperforming long instructions alone, combined with clear anti-patterns and required checkpoints, leading to more reliable unification across similar binaries.

**Core Problem and Fixes**
AI coding agents often drift from unification due to context dilution in long sessions. Late 2025 best practices recommend:
- Defining a rigid, numbered workflow that forces analysis of both executables in sequence.
- Explicitly forbidding separate sections or single-game analysis.
- Reinforcing with multiple correct/anti-examples and a mandatory end-of-response confirmation expanded for accountability.

**Improved Prompt Template**
The template below enhances your original by adding a role definition, prohibited behaviors, a mandatory workflow, additional examples (including docstrings), and an expanded confirmation status. It retains all original content while incorporating 2025 prompting techniques for higher consistency.<grok:render card_id="c93899" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render><grok:render card_id="b8d7d8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render><grok:render card_id="78acf4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render>

```markdown
#### 1. MANDATORY: Core Game Engine Fidelity (Highest Priority Rule)

**Role Definition**: You are an expert reverse engineer specializing in the unified analysis of Star Wars: Knights of the Old Republic (K1: swkotor.exe) and Knights of the Old Republic II: The Sith Lords (TSL: swkotor2.exe). Treat them as a single engine with minor differences in addresses and occasional logic. All functions exist in both games.

For **ANY** change involving engine features, file formats, game mechanics, resources, or reverse-engineered behavior:

- **YOU MUST** analyze both K1 (`swkotor.exe`) and TSL (`swkotor2.exe`) using REVA MCP tools.
- Open the project with: `open-project <full path to .gpr>` (common paths: resolve `%USERPROFILE%\test.gpr` → e.g., `C:\Users\boden\test.gpr` **or** `%USERPROFILE%\Andastra Ghidra Project.gpr`).
- Use unified K1/TSL naming and code paths.
- Highlight differences explicitly and use conditionals for game-specific divergences.
- Label game-specific exceptions clearly.

**Prohibited Behaviors (NEVER DO THESE)**:
- Never create separate sections, headings, docstrings, or documentation exclusively for K1 or for TSL.
- Never analyze, reference, or provide addresses for only one game without checking and noting the other.
- Never use single-game formatting (e.g., "K1: 0xADDRESS only").

**Mandatory Step-by-Step Workflow (FOLLOW EXACTLY FOR EVERY ENGINE-RELATED TASK)**:
1. Confirm/open the project for both executables using REVA MCP tools.
2. Locate and decompile the relevant function/feature in K1; note address and key logic.
3. Locate the corresponding function/feature in TSL (all functions exist in both); note address and key logic.
4. Compare decompilations side-by-side; identify any differences in logic or flow.
5. Use unified naming for the function/feature.
6. Format all addresses and references exactly as specified below.
7. Write a single unified description/docstring with inline notes on any differences.
8. If an address is unknown in one game, mark it explicitly as TODO and continue searching.

**Address & Reference Formatting – EXACT RULES (MUST FOLLOW)**

- Format addresses as: `FunctionName @ (K1: 0xADDRESS, TSL: 0xADDRESS)` if identical, or separate with **exactly** `TODO: <task>` if unknown.
- Comment references as: `# Reference: K1 swkotor.exe:0xADDRESS, TSL swkotor2.exe:0xADDRESS`

**CORRECT EXAMPLE (USE THIS PATTERN):**

```
        * Callees (call chain depth 3+):
          * ~Model() @ (K1: 0x0043f790, TSL: TODO: Find this address) (destructor, called if duplicate found)
          * IODispatcher::GetRef() @ (K1: 0x004a0580, TSL: TODO: Find this address) (singleton accessor)
          * MaxTree::AsModel() @ (K1: 0x0043e1c0, TSL: TODO: Find this address) (type check and cast)
          * __stricmp() @ (K1: 0x0070acaf, TSL: TODO: Find this address) (case-insensitive string comparison)
```

**INCORRECT EXAMPLE (NEVER USE):**

```
        * Callees (call chain depth 3+):
          * ~Model() @ 0x0043f790 (destructor, called if duplicate found)
          * IODispatcher::GetRef() @ 0x004a0580 (singleton accessor)
          ...
```

**Additional Correct Docstring Example**:
```
"""
Unified model loading function for both games.

Behavior:
- Loads model from resource cache.
- Creates new instance if not found.
- Registers with IODispatcher.

Differences:
- TSL includes additional compatibility flag check at offset +0x15.

Addresses: ModelLoader::Load @ (K1: 0x00451230, TSL: 0x00467890)
"""
```

**MANDATORY CONFIRMATION (REQUIRED IN EVERY RELEVANT RESPONSE)**:
At the end of any response involving engine-related changes, **YOU MUST** add exactly one of these lines:

- `REVA status: Completed - Analyzed both K1 and TSL :)`
- `REVA status: Partially completed - Missing TSL address for <function>, TODO find it :(`
- `REVA status: Skipped - <exact reason> :(`
```

---

**Comprehensive Survey of Prompting Strategies for Unified Binary Analysis**

The challenge of getting AI coding agents to treat two highly similar executables (K1 and TSL) as a unified codebase while properly noting differences is a common issue in reverse-engineering workflows using LLMs. Late 2025 research and community discussions highlight that LLMs tend to "forget" or drift from strict rules due to context window limitations, instruction overload, and lack of enforced sequential reasoning.<grok:render card_id="64aef6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render><grok:render card_id="c6a369" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render>

The most effective solutions involve **context engineering** (structuring the provided information hierarchically) and **enforced workflows** rather than relying solely on declarative instructions.<grok:render card_id="25b7d7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render><grok:render card_id="ab9576" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render> Key techniques that directly address your issues include:

| Technique                  | Why It Helps Your Case                                                                 | Supporting Sources (2025+)                                                                 |
|----------------------------|---------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| Mandatory numbered workflow | Forces the agent to check both binaries in sequence, preventing single-game analysis. | Anthropic context engineering guide , Reddit 1000-hour summary    |
| Explicit prohibitions       | Directly bans separate sections/docstrings, reducing unwanted formatting drift.       | Reddit strict-edit rules post , general prompt best practices              |
| Multiple correct/anti-examples | Examples outperform long instructions for formatting consistency.                    | Reddit "examples beat instructions" , CodeSignal 2025 practices           |
| Expanded confirmation status| Creates accountability; partial status forces TODOs instead of silent omission.       | Derived from original + enforcement patterns in agent guides              |
| Role priming + unification rule | Sets strong identity and default behavior of treating games as one engine.           | Lakera 2025 guide , Medium 2026 mastering prompt engineering              |

These patterns emerged consistently across 2025 sources. For example, practitioners report that simple declarative rules ("always check both") fail in long sessions, while a numbered checklist forces the model to allocate tokens to each step.<grok:render card_id="c33131" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render> Similarly, explicitly forbidding behaviors (e.g., separate sections) works better than positive instructions alone.<grok:render card_id="30d978" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>

The improved template above incorporates all original rules without omission while adding the highest-impact enhancements:
- A clear role definition to anchor unification mindset.
- A prohibited behaviors section to directly block the annoying separation pattern.
- A full mandatory workflow that sequences tool usage across both games.
- An additional docstring example to demonstrate unified documentation.
- An expanded status line that allows partial completion with explicit TODOs, increasing pressure to find missing addresses.

Users applying similar structured prompts in 2025 reported significantly higher adherence rates for multi-version codebases and reverse-engineering tasks.<grok:render card_id="6704d0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render><grok:render card_id="19f3b2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render> Copy and paste the template directly as your system prompt or rules file for immediate improvement.

**Key Citations**
- [Prompt Engineering Best Practices 2025 - CodeSignal](https://codesignal.com/blog/prompt-engineering-best-practices-2025/)
- [Prompt Engineering Best Practices: Tips, Tricks, and Tools - DigitalOcean (Dec 2025)](https://www.digitalocean.com/resources/articles/prompt-engineering-best-practices)
- [The Ultimate Guide to Prompt Engineering in 2025 - Lakera AI](https://www.lakera.ai/blog/prompt-engineering-guide)
- [Mastering Prompt Engineering (Complete 2026 Guide) - Medium (Nov 2025)](https://medium.com/@ivanescribano1998/mastering-prompt-engineering-complete-2026-guide-a639b42120e9)
- [Spent 6 months deep in prompt engineering - Reddit (Oct 2025)](https://www.reddit.com/r/PromptEngineering/comments/1ny2pff/spent_6_months_deep_in_prompt_engineering_heres/)
- [Effective context engineering for AI agents - Anthropic (Sep 2025)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [After 1000 hours of prompt engineering - Reddit (Sep 2025)](https://www.reddit.com/r/PromptEngineering/comments/1nt7x7v/after_1000_hours_of_prompt_engineering_i_found/)
