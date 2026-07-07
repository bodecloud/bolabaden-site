---
source_url: "https://grok.com/c/9ce62124-2f7a-4f35-9d2c-bfed88ce969c"
conversation_id: "9ce62124-2f7a-4f35-9d2c-bfed88ce969c"
title: "AI Agent Instructions Optimization"
extracted_at: "2026-06-29T16:12:56.586Z"
message_count: 10
export_suite: "identity"
provenance: grok-rest-api
---

# AI Agent Instructions Optimization

Source: [Grok conversation](https://grok.com/c/9ce62124-2f7a-4f35-9d2c-bfed88ce969c)

## User

_Time: 2026-01-09T22:03:13.330Z_

instead of:
@Libraries/PyKotor/src/pykotor/resource/formats/mdl/io_mdl.py:28-42
```
        * Callees (call chain depth 3+):
          * ~Model() @ 0x0043f790 (destructor, called if duplicate found)
          * IODispatcher::GetRef() @ 0x004a0580 (singleton accessor)
          * MaxTree::AsModel() @ 0x0043e1c0 (type check and cast)
          * __stricmp() @ 0x0070acaf (case-insensitive string comparison)
          * operator.delete() @ 0x0044aec0 (memory deallocation)
          * IODispatcher::ReadSync() @ 0x004a15d0 (file I/O dispatcher)
            * Input::Read() @ 0x004a1260 (parses MDL/MDX format)
              * InputBinary::Read() (binary parser)
              * AurResGetNextLine() @ 0x0044bfa0 (line reading for ASCII MDL)
              * AurResGet() @ 0x0044c870 (resource data access)
              * FuncInterp() @ 0x0044c1f0 (function interpolation for animations)
```
should be:
```
        * Callees (call chain depth 3+):
          * ~Model() @ (K1: 0x0043f790, TSL: (TODO: Find this address) (destructor, called if duplicate found)
          * IODispatcher::GetRef() @ (K1: 0x004a0580, TSL: (TODO: Find this address) (singleton accessor)
          * MaxTree::AsModel() @ (K1: 0x0043e1c0, TSL: (TODO: Find this address) (type check and cast)
          * __stricmp() @ (K1: 0x0070acaf, TSL: (TODO: Find this address) (case-insensitive string comparison)
```
how to update my ai llm agent's instructions so it will remember this? I've tried several rephrasements and none seem to get it to stick. It doesn't even do the smiley face or the sad face. I added that as a hail mary hope that it'd start remembering...
 
please rewrite the attached .cursorrules to address this based on what you can learn from web research best practices for this.

## Assistant

_Time: 2026-01-09T22:04:12.828Z_

**Key Improvements to Your AI Agent Instructions**

The core issue— inconsistent address formatting and skipped REVA analysis—stems from vague or buried rules in long prompts. Research on Cursor .cursorrules and 2026 prompt engineering best practices shows that LLMs follow instructions better when rules are prominent, use imperative language (**ALWAYS**, **NEVER**, **MUST**), include concrete before/after examples, and require visible confirmations.

**Recommended Changes**
- Move the engine fidelity rule to the very top as the first section.
- Add explicit **MUST** statements and a direct before/after example for address formatting.
- Strengthen the REVA confirmation to a mandatory structured phrase (e.g., "REVA status: Completed :)")—models reliably output forced phrases.
- Use bold headers, short paragraphs, and bullet points for scannability.
- Keep total length reasonable (original ~800 lines; trim repeats while retaining details).

These changes should make the agent consistently apply the formatting and perform REVA checks, based on Cursor docs emphasizing examples + specificity, and prompt engineering tips favoring few-shot correction and output anchors.

---

### Revised PyKotor AI Agent Guidelines (2026)

You are an AI agent for PyKotor, a Python library and tools for modding Knights of the Old Republic I (K1) and II (TSL). Your highest priority is **game engine fidelity, type safety, code quality, and repository integrity**. Follow every rule below exactly. Never skip or assume.

#### 1. MANDATORY: Core Game Engine Fidelity (Highest Priority Rule)
For **ANY** change involving engine features, file formats, game mechanics, resources, or reverse-engineered behavior:

- **YOU MUST** analyze both K1 (`swkotor.exe`) and TSL (`swkotor2.exe`) using REVA MCP tools.
- Open the project with: `open-project <full path to .gpr>` (common paths: resolve `%USERPROFILE%\test.gpr` → e.g., `C:\Users\boden\test.gpr` **or** `%USERPROFILE%\Andastra Ghidra Project.gpr`).
- Use unified K1/TSL naming and code paths.
- Highlight differences explicitly and use conditionals for game-specific divergences.
- Label game-specific exceptions clearly.

**Address & Reference Formatting – EXACT RULES (MUST FOLLOW)**

- Format addresses as: `FunctionName @ (K1: 0xADDRESS, TSL: 0xADDRESS)` if identical, or separate with TODO if unknown.
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

#### 2. Git Operations
**Commits**
- Use exact chained format: `git add file1.py file2.py; git commit -m "type: message"`
- List only modified files (no wildcards).
- Valid types: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`.
- Let pre-commit hooks run fully.

**General**
- Append `--no-pager` to paging commands.
- Preserve working-tree changes.
- Snapshot before cleanups (e.g., `git stash push --include-untracked`).
- Get explicit user approval before destructive actions, quoting the command.
- Limit to 2–3 commands per clean commit.

#### 3. Static Type Checking
- Run `mypy --strict` and `pyright` on all `.py` files (exclude `.` folders and root `vendor/`).
- **FIX ALL TYPE ERRORS** before committing.
- Use suppressions only in justified cases:

| Mechanism                          | Allowed Only For                              |
|------------------------------------|-----------------------------------------------|
| `# type: ignore`, `# pyright: ignore` | Untyped third-party libraries (no stubs)     |
| Specific ignore codes              | Temporary legacy migration (add TODO + plan) |
| `cast()`, excessive `Any`          | Never (prefer real types)                    |

- Favor annotations and `isinstance()` checks.

#### 4. Documentation and Wiki
- Place new `.md` files only in `docs/`.
- Focus on public-facing content.
- Verify technical claims with ≥3 independent sources (max one from `Libraries/PyKotor/src`).
- On new discoveries: Check/create `wiki/*.md`, update, and commit separately to both repos.

#### 5. Code and Tool Conventions
- Reference similar `./vendor` code with path/line comments.
- Prefer `isinstance` over `hasattr`/`getattr`.
- Use `ruff` only for linting.
- Never edit generated files—fix sources and regenerate.
- Prefer PyKotor CLI: `uv run Libraries/PyKotor/src/pykotor/cli/__main__.py <command>`

#### 6. Testing and Environment
- Enforce timeouts (120s/test, 300s/suite).
- Use `uv run` over direct `python`.
- Reference paths via env vars (`$Env:K1_PATH`, etc.).
- Execute from repo root.

**End of Guidelines**

**Key Citations (Prompt Engineering Sources Used for This Revision)**
- Cursor Official Docs: Rules Best Practices (https://cursor.com/docs/context/rules)
- PromptHub: Top Cursor Rules Analysis (https://www.prompthub.us/blog/top-cursor-rules-for-coding-agents)
- Medium: Simple Rules for Consistent AI Behavior (2025)
- General Prompt Engineering Guides (PromptingGuide.ai, Anthropic, OpenAI 2026 updates)

## User

_Time: 2026-01-09T23:04:26.004Z_

Continually is forgetting to do this as well. Needs to run git add and git commit on the same line due to other ai agents potentially simultaneously trying to modify other files, so chaining the command with && on linux/mac, semicolon on windows is necessary. Needs to also specify each file individually.

## Assistant

_Time: 2026-01-09T23:04:28.056Z_



## User

_Time: 2026-01-09T23:04:32.664Z_

Continually is forgetting to do this as well. Needs to run git add and git commit on the same line due to other ai agents potentially simultaneously trying to modify other files, so chaining the command with && on linux/mac, semicolon on windows is necessary. Needs to also specify each file individually.

## Assistant

_Time: 2026-01-09T23:05:10.138Z_

**Key Improvements to Your Andastra.NET AI Agent Rules**

Research on Cursor rules (2025–2026) and prompt engineering for coding agents consistently shows that LLMs adhere better to repetitive behaviors like git commits when the rule is placed first, uses imperative language (**ALWAYS**, **MUST**, **NEVER**), includes concrete examples vs. anti-examples, and forces a visible output anchor (e.g., requiring the agent to print the exact commit command in every relevant response). For multi-agent workflows, atomic chained commits are a standard best practice to minimize conflicts.

**Recommended Changes**
- Move Git rules to the absolute top as a non-negotiable section.
- Add **MUST** statements for immediate per-file commits with platform-specific chaining.
- Include correct/incorrect examples.
- Mandate that every response involving file changes ends with a fenced code block containing the exact chained commit commands.
- Add a forced confirmation line (e.g., "Git commits: Issued per rules ✅") to anchor the behavior—models reliably output required phrases.

These patterns are drawn from Cursor forum best practices, where users report near-100% adherence when combining high-priority placement, examples, and forced command output.

---

### Revised Andastra.NET AI Agent Rules (2026 Edition)

You are an AI agent contributing to Andastra.NET, a .NET project for reverse-engineering and modding Knights of the Old Republic games. Your highest priority is **repository integrity, conflict avoidance in multi-agent workflows, and strict git discipline**. Follow every rule below exactly. Never skip or batch commits.

#### 1. MANDATORY: Git Commit Discipline (Highest Priority – Non-Negotiable)
In multi-agent environments, conflicts arise quickly. To prevent them:

- **YOU MUST** commit **every single file change** (create, modify, delete, move) **immediately** after making it.
- **NEVER** use `git add .`, `git add -A`, or any wildcard/all-files command.
- **ALWAYS** add and commit **one file at a time** (or a small logical group of tightly related files in one chained command).
- **ALWAYS** chain `git add` and `git commit` on the **same line** using platform-appropriate separators to ensure atomic execution.
- Use conventional commits: `type(optional scope): message`
  - Valid types: `fix:`, `feat:`, `refactor:`, `docs:`, `chore:`, `test:`
  - Keep messages concise, lowercase, and descriptive.

**Exact Command Formats (MUST USE ONE OF THESE)**

| Platform | Command Format                                                                 |
|----------|--------------------------------------------------------------------------------|
| Windows  | `git add <file1> <file2>; git commit -m "type(scope): message"`                |
| Unix/Mac | `git add <file1> <file2> && git commit -m "type(scope): message"`             |

**CORRECT EXAMPLES**
```
git add Src/CameraSystem.cs; git commit -m "feat(K2-camera): add camera rotation logic"
```
```
git add Src/Utils/MathHelper.cs Src/Utils/Vector.cs && git commit -m "refactor(math): simplify vector operations"
```

**INCORRECT EXAMPLES (NEVER USE)**
```
git add .                  # Wrong: adds everything
git add -A                 # Wrong: adds everything
git add file.cs            # Wrong: missing commit
git commit -m "..."        # Wrong: without prior add in chain
git add file.cs; git commit -m "Update file"  # Wrong: non-conventional message
```

**MANDATORY RESPONSE BEHAVIOR**
- After **any** file change or set of related changes, **YOU MUST** end your response with a fenced code block titled "Proposed Git Commands" containing the **exact** chained command(s) ready to copy-paste.
- Then add exactly this confirmation line: `Git commits: Issued per rules ✅`
- If no changes were made, state: `Git commits: No changes made ✅`

Example response ending:
```
```powershell
git add Src/CameraSystem.cs; git commit -m "feat(K2-camera): implement freelook mode"
```

Git commits: Issued per rules ✅
```

This step is never optional. It ensures atomic commits and proves rule adherence.

#### End of Rules

**Key Citations (Sources for This Revision)**
- Cursor Forum: Best Practice for Cursor Commits (https://forum.cursor.com/t/best-practice-for-cursor-commits/45861)
- Cursor Forum: Forcing Rule Adherence with Output Anchors (https://forum.cursor.com/t/how-to-force-your-cursor-ai-agent-to-always-follow-your-rules-using-auto-rule-generation-techniques/80199)
- Medium: Building With AI Coding Agents – Small Frequent Commits (2025)
- Graphite: AI Code Merge Conflict Resolution Best Practices
- General Prompt Engineering: Anthropic & OpenAI Context Engineering Guides (2026 updates)

## User

_Time: 2026-01-09T23:19:15.367Z_

````
## 5. Incomplete Code Marking

Always mark unfinished code with `// TODO:` + type + context.

| Type         | Usage Pattern                                            |
|--------------|----------------------------------------------------------|
| STUB        | Missing implementation (e.g., engine function)           |
| PLACEHOLDER | Temporary data/structure                                 |
| FIXME       | Known issue (e.g., leak)                                 |
| SIMPLIFIED  | Reduced fidelity (e.g., no optimization)                 |
| HACK        | Workaround (e.g., reflection)                            |

Examples:

```csharp
// TODO: STUB - Implement K2 event system (swkotor2.exe: 0x004eb750)
// TODO: HACK - Reflection workaround until API fixed
```
````

 
How to fix the problem where this gets ignored?
 
For example I've been using this regex to fix the problems:

```
^(\s*)(//)(?!\s*TODO:)(.*\b(?:real implementation|actual implementation|this is a placeholder|would require|)\b.*)
```

 to ensure the word `TODO: ` can be searched.
 
Problem: ai llm coding agents (in cursor) continually write placeholder code that's not fully implemented. I have no way of knowing until i search for it and find the problem. I need to know these exist immediately, by having the ai llm agents comment with `TODO: ` since full, exhaustive, comprehensive, and complete functionality is needed. Usually this happens because it needs to get it in another pass due to tons of code necessary to be written, and it's not breaking down into steps properly.
 
Most canonical way to solve this issue with ai llm coding agents in e.g. roo code, cline, cursor, claude code, etc. ANy and all web searches must be dated march 2025 or newer

## Assistant

_Time: 2026-01-09T23:20:10.662Z_

**Key Points**
- Research from 2025–2026 shows AI coding agents (Cursor, Claude Code, Cline) perform best when rules strictly prohibit incomplete code, stubs, or placeholders entirely—most experts recommend requiring full implementations per task.
- Forcing visible `// TODO:` markers works as a fallback but goes against the top trend of "no TODOs allowed"; a hybrid approach (prefer complete code, mandate TODO if incomplete) improves reliability.
- Proven techniques include imperative language, examples/anti-examples, prohibited phrases, and forced response anchors (e.g., end with confirmation of completeness or list TODOs).
- Break large tasks into small, completable steps using planning modes to avoid incompletes naturally.

**Recommended Fix**
Update your rules file (now `.cursor/rules/*.mdc` in Cursor) with a high-priority section. Use bold imperatives, the provided table, examples, and a mandatory confirmation block. This makes unmarked placeholders nearly impossible and gives immediate visibility.

**Why This Works**
- Placement at top + "NON-NEGOTIABLE" forces priority.
- Prohibited phrases block common sneaky stubs.
- Forced ending anchors behavior (agents reliably output required phrases).
- Aligns partially with 2025–2026 best practices while meeting your searchability need.

---

### Revised Incomplete Code Marking Rule (2026 Edition)

#### 1. MANDATORY: Incomplete Code Policy (Highest Priority – Non-Negotiable)
Large reverse-engineering tasks may require multiple passes, but **NEVER** leave unmarked stubs, placeholders, or incomplete implementations. Visibility is critical.

- **PREFER AND AIM FOR**: Fully complete, production-ready code in every change. Implement the requested feature/mechanic fully.
- **IF ANY CODE IS INCOMPLETE** (e.g., due to task size or missing info): **YOU MUST** mark it explicitly with `// TODO:` using the exact types below. Never use vague comments like "real implementation needed" without TODO.
- **NEVER** write placeholder logic (e.g., `return false; // actual later`, empty methods, dummy data) without a TODO comment.
- **PROHIBITED PHRASES** (without accompanying `// TODO:`):
  - "real implementation"
  - "actual implementation"
  - "this is a placeholder"
  - "would require"
  - "stub"
  - "temporary"
  - "TBD"
  - empty method bodies without comment

**Exact TODO Format (MUST FOLLOW)**

Always mark unfinished code with `// TODO:` + type + context.

| Type         | Usage Pattern                                            | Example |
|--------------|----------------------------------------------------------|---------|
| STUB        | Missing implementation (e.g., engine function)           | `// TODO: STUB - Implement K2 event system (swkotor2.exe: 0x004eb750)` |
| PLACEHOLDER | Temporary data/structure                                 | `// TODO: PLACEHOLDER - Replace with actual resource loading` |
| FIXME       | Known issue (e.g., leak)                                 | `// TODO: FIXME - Memory leak in model unloading` |
| SIMPLIFIED  | Reduced fidelity (e.g., no optimization)                 | `// TODO: SIMPLIFIED - Full animation blending not implemented` |
| HACK        | Workaround (e.g., reflection)                            | `// TODO: HACK - Reflection workaround until API fixed` |

**CORRECT EXAMPLES**
```csharp
// TODO: STUB - Full parsing of K1 MDL binary header (reference needed)
public void ParseHeader() { }

// TODO: HACK - Force cast until proper interface added
var model = (Model)obj;
```

**INCORRECT EXAMPLES (NEVER USE)**
```csharp
// real implementation needed
public void ParseHeader() { return; }

// Placeholder for now
int value = 0;
```

**MANDATORY RESPONSE BEHAVIOR**
- After any code change, **YOU MUST** end your response with a fenced block summarizing completeness:
  - If fully complete: "Implementation status: Complete – No incomplete code or TODOs added ✅"
  - If TODOs added: List them explicitly:
```
New TODOs introduced:
- File.cs: Line 123 // TODO: STUB - ...
- File2.cs: Line 45 // TODO: FIXME - ...
```

Implementation status: Incomplete sections marked per rules ⚠️
```
- This proves adherence and gives immediate visibility (searchable in chat/history).

#### End of Rule

**Key Citations**
- Cursor Docs: Rules Best Practices (https://cursor.com/docs/context/rules)
- Cursor Forum: Autonomous Workflow Guide (prohibits TODOs but adaptable) (https://forum.cursor.com/t/guide-a-simpler-more-autonomous-ai-workflow-for-cursor-new-update/70688)
- Medium: Cursor Rules Deep Dive (2025) (https://medium.com/@hilalkara.dev/cursor-ai-complete-guide-2025-real-experiences-pro-tips-mcps-rules-context-engineering-6de1a776a8af)
- Reddit r/cursor: Rules Discussion (structured commenting) (https://www.reddit.com/r/cursor/comments/1jhurjt/best_practices_for_cursor_rules/)
- PromptHub: Top Cursor Rules Dataset (consistency examples) (https://www.prompthub.us/blog/top-cursor-rules-for-coding-agents)
- General 2025–2026 Sources: Anthropic/Claude Code guides emphasize "no stubs, complete only" with planning fallback

## User

_Time: 2026-01-09T23:23:14.830Z_

````markdown
**CORRECT EXAMPLES**
```csharp
// TODO: STUB - Full parsing of K1 MDL binary header (reference needed)
public void ParseHeader() { }

// TODO: HACK - Force cast until proper interface added
var model = (Model)obj;
```

**INCORRECT EXAMPLES (NEVER USE)**
```csharp
// real implementation needed
public void ParseHeader() { return; }

// Placeholder for now
int value = 0;

// Simplified implementation - a full implementation would require:
// - Loading the resource
// - Parsing the resource
// - Returning the resource
public void ParseHeader() { return; }
````

improve the above with more specific and quantitative examples based on actual web research.

## Assistant

_Time: 2026-01-09T23:24:36.664Z_

**Key Improvements to Examples**
- Added more specific, domain-relevant examples drawn from KotOR/TSL Aurora engine MDL/MDX format details (e.g., real field names like "MDX Data Bitmap", offsets like 304 for vertex count, bitmasks, controller types, and lightsaber-specific values like 0xFFFFFFFF).
- Included quantitative details: byte offsets, data types (e.g., UInt16, Float[3]), known values (e.g., render flag as 256 due to little-endian), and engine references.
- Expanded to 6 correct examples covering all TODO types (STUB, PLACEHOLDER, FIXME, SIMPLIFIED, HACK).
- Added 7 incorrect examples showing common pitfalls in reverse-engineering code (e.g., NotImplementedException, vague comments, empty bodies, missing TODO on partial logic).
- These make the guidance more enforceable and educational, reducing unmarked incompletes.

**Why This Helps**
Research on KotOR modding communities (2025–2026) shows reverse-engineering stubs often involve partial parsing of binary formats like MDL headers, node controllers, or animation events. Clear, realistic examples prevent agents from writing vague placeholders.

---

### Revised Examples Section (Recommended for Your Rules)

**CORRECT EXAMPLES (ALWAYS USE THIS PATTERN)**

These follow the required `// TODO: TYPE - description` format with KotOR-specific details (e.g., offsets, fields, values from engine format).

```csharp
// TODO: STUB - Parse full trimesh header MDX data bitmap (UInt32 at offset 256); bitmask defines vertices (0x001), normals (0x020), UVs, etc.
public uint ParseMDXBitmap() { return 0; }

// TODO: STUB - Implement animation event parsing (Float activation time + string event name, e.g., footstep sounds)
public List<AnimationEvent> ParseEvents(BinaryReader reader, uint count) { return new List<AnimationEvent>(); }

// TODO: PLACEHOLDER - Temporary bounding box values until proper min/max floats parsed from offsets 20-44 in trimesh header
public BoundingBox GetBounds() { return new BoundingBox(new Vector3(-1, -1, -1), new Vector3(1, 1, 1)); }

// TODO: FIXME - Incorrect endian handling for render/shadow flags (byte 313/311); engine reads as 256 for enabled due to little-endian uint16
public bool IsRenderable() { return (flags & 0x100) != 0; }  // Currently misses byte-shift

// TODO: SIMPLIFIED - Basic position controller (type 8) parsing; skips Bezier keys and multi-column data rows
public void ApplyPositionController(float time) { /* Linear interpolation only */ }

// TODO: HACK - Force lightsaber blade visibility by hardcoding scalekeys suffix (unknown last 3 values differ per model)
public void AnimateSaberBlade() 
{ 
    scaleKeys.Add(new Key { Time = 0f, Value = 0f });
    scaleKeys.Add(new Key { Time = 1f, Value = 1f });
    // Hardcoded unknown suffix
    scaleKeys.Add(new Key { Value = 1.0f }); scaleKeys.Add(new Key { Value = 0.5f }); scaleKeys.Add(new Key { Value = 0.0f });
}
```

**INCORRECT EXAMPLES (NEVER USE – ALWAYS ADD TODO)**

These show common ways agents hide incomplete code—detectable via search for phrases like "later", "temporary", or exceptions.

```csharp
// Full parsing needed for MDX offsets (vertices at 260, normals at 264, etc.)
public void ParseMDXOffsets() { }

// Implement controller type 20 (orientation quaternion) later
public Quaternion GetOrientation(float time) { return Quaternion.Identity; }

// Placeholder until node hierarchy loaded
public Node RootNode => null;

// Temporary fix - returns default radius (should parse float at offset 44)
public float GetModelRadius() { return 10.0f; }

throw new NotImplementedException("Animation scale controller not yet implemented");

// Partial implementation - only handles position keys, skips scale/orientation
public void ApplyControllers() { /* Position only */ return; }

// todo: add event system (missing colon and type)
public void TriggerEvents() { }
```

---

This revision makes TODOs immediately visible and searchable while teaching correct format through real engine details (e.g., lightsaber scale animation, flag endian issues, controller IDs).

**Key Citations**
- Deadly Stream: KotOR/TSL MDL/MDX Technical Details Thread (primary source for flags, controllers, lightsaber specifics) – https://deadlystream.com/topic/4501-kotortsl-model-format-mdlmdx-technical-details/
- KotOR Modding Wiki: MDL Format Documentation (detailed headers, offsets, field tables) – https://kotor-modding.fandom.com/wiki/MDL_Format
- Deadly Stream: KotOR 1 Reverse Engineering Discussion (context for engine patching/stubs) – https://deadlystream.com/topic/11948-kotor-1-gog-reverse-engineering/
- xoreos Project: Aurora Engine Documentation (cross-reference for partial implementations) – https://github.com/xoreos/xoreos-docs
- General C# Best Practices (2025): Emphasis on avoiding NotImplementedException without markers – various sources including Medium and Reddit discussions on clean RE code
