---
source_url: "https://grok.com/c/c2d2bb98-b0ef-4354-83ca-2da99c6e9726"
conversation_id: "c2d2bb98-b0ef-4354-83ca-2da99c6e9726"
title: "Optimizing MCP Tools for LLM Agents"
extracted_at: "2026-06-29T16:37:35.887Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Optimizing MCP Tools for LLM Agents

Source: [Grok conversation](https://grok.com/c/c2d2bb98-b0ef-4354-83ca-2da99c6e9726)

## User

_Time: 2026-03-04T19:29:54.230Z_

I have redesigned my mcp server tools about three times now. They are for ai llm agents and while the tools work the design is inefficient and sub-optimal. Please find an existing LATE 2025-preferably 2026 guide on how to structure the tools and design them. Or better yet find an AI llm agent that's trained to design tools or a mcp server for designing tools. Safe to say my current tools are just not working. Attached are the issues i've ran into.

## Assistant

_Time: 2026-03-04T19:31:00.773Z_

**Key Points**  
- Late 2025–early 2026 sources identify the **Model Context Protocol (MCP)** as the established standard for LLM-agent tool servers—exactly matching your Python MCP implementation—making 2025 guides the most relevant and authoritative.  
- No dedicated public “AI LLM agent trained exclusively to design MCP servers” exists as a standalone product, but Anthropic explicitly recommends using Claude (Sonnet 3.5 or later) to iteratively optimize tool descriptions, schemas, and evaluations—effectively turning the model into your tool-design partner.  
- The evidence leans toward fewer, composable tools with strict JSON schemas, explicit modes/enums, batching, and preprocessing as the fix for your observed inefficiencies (redundant searches, per-function decompilations, parameter confusion, legacy bloat, large-result friction).  
- These changes align directly with your AgentDecompile pain points and are backed by production patterns from Anthropic, Workato, Red Hat, and agentic-framework comparisons.

**Recommended 2025–2026 Guide**  
The single most comprehensive reference is “THE DEFINITIVE MCP GUIDE (2025)” combined with Anthropic’s “Writing effective tools for AI agents” (Sep 2025) and the 2026 “Agentic Design Patterns” update. These cover MCP server architecture, tool schemas, namespacing, error handling, and LLM-optimized descriptions—precisely the structure your three redesigns have been missing.

**High-Level Redesign Roadmap**  
1. Consolidate ~52 canonical + legacy tools into 12–18 namespaced, mode-driven tools (e.g., one `search` tool with `match_type` enum).  
2. Add strict JSON schemas + server-side validation; support batching (lists of addresses/functions) and preprocessing for large outputs.  
3. Use Claude to refine every tool description and run evaluations against your Kotor-style traces.  
4. Deprecate legacy forwards cleanly; expose only canonical names by default.

**Addressing Your Specific Friction Points**  
- **search-everything** → Add `match_type: exact | substring | regex` + optional `scopes` enum; default to targeted searches to eliminate “.sav” false positives and repeated calls.  
- **get-functions** → Accept `function_identifiers: list[str]` for batch decompilation; include optional `include_comments`, `include_xrefs`, `data_flow` flags so agents stop ignoring context.  
- **get-call-graph** → Merge `mode`/`direction` into a single `relation: callers | callees | tree` enum; make `max_depth` optional with smart default.  
- **Large results & pagination** → Return structured blocks or summaries first; offer explicit `offset`/`limit` or preprocessing summaries.  
- **Legacy overloads** → Remove or hide behind env flag only; agents waste tokens discovering them.

These adjustments match the exact patterns that eliminated similar issues in production MCP deployments in 2025–2026.

---

The evolution of tool design for LLM agents reached a stable, production-ready state in late 2025 with the standardization of the Model Context Protocol (MCP). Originally introduced as a vendor-neutral interface between large language models and external capabilities, MCP quickly became the de-facto replacement for ad-hoc function-calling layers. By December 2025, major players (Anthropic, OpenAI, Google, Red Hat, and Workato) had published detailed implementation and design guides that directly address the inefficiencies you encountered across your three redesign cycles of the AgentDecompile MCP server.  

Your attached documents— the exhaustive 52-tool reference, the Kotor save/load analysis trace, and the code-accuracy notes—highlight classic MCP anti-patterns that these 2025–2026 guides explicitly warn against: tool proliferation, ambiguous parameters, legacy compatibility bloat, repeated narrow queries, lack of batching, and unprocessed large outputs. The guides converge on a unified set of principles that map almost one-to-one onto your pain points.

### Core MCP Server Architecture (2025 Gold Standard)
MCP defines two execution models:  
- **Standalone** (long-running JSON-RPC server, ideal for remote clients).  
- **Embedded/in-process** (direct async calls, zero network, preferred for backends like yours).  

Server responsibilities are strictly limited to: registering tools, enforcing schemas, safe execution, and returning structured content blocks. Client responsibilities (discovery, invocation, resource requests) are handled by the LLM framework. This separation eliminates the parameter-normalization hacks and legacy-forward tables that currently clutter your `registry.py`.

### Tool Structuring Principles (Anthropic + Workato + Definitive Guide)
All 2025 sources emphasize the same six rules:  

1. **One responsibility, composable** — Each tool does exactly one thing well. Complex workflows are built by chaining (e.g., separate `get_current_weather` and `get_location` tools rather than a monolithic “weather-manager”). Your `manage-*` family and legacy overloads violate this; the guides recommend collapsing them into namespaced families with mode enums (e.g., `symbols:manage` with `action: list | rename | search`).  

2. **Strict JSON schemas with server-side validation** — Input/output schemas are mandatory. Use type hints, enums, regex allowlists, and length limits. This directly solves your `search-everything` false-positive problem and `get-call-graph` mode/direction confusion.  

3. **Namespacing & canonical names** — Prefix or suffix groups (e.g., `search:everything`, `decompile:function`). Legacy names are hidden behind an env flag (`AGENTDECOMPILE_SHOW_LEGACY_TOOLS=1`), exactly as you already do, but the guides stress making the default advertised set tiny (12–18 tools).  

4. **Preprocessing & summarization for large data** — Never return 500+ symbols or full decompilations raw. Offer an optional `summarize: true` flag or return a high-signal summary first. Workato explicitly recommends an intermediate AI preprocessing step—precisely what your Kotor trace needed to avoid temp-file reads.  

5. **Batching & pagination by design** — Tools that operate on addresses/functions must accept lists. `get-functions` should take `function_identifiers: list` and return a map of results. Pagination uses `offset`/`limit` with sensible defaults; large results are returned as structured blocks or file handles only when explicitly requested.  

6. **Clear error semantics & helpful messages** — Consistent HTTP-style codes + human-readable recovery hints. Agents recover automatically instead of retrying the same broken call.

### Parameter & Mode Design (2026 Agentic Patterns Update)
The 2026 Sitepoint guide and Anthropic refinements introduce:  
- Single `relation` enum instead of separate `mode`/`direction`.  
- Optional parameters with smart defaults (no `max_depth` unless the agent explicitly needs deep recursion).  
- `match_type` enum on all search tools to eliminate substring-vs-regex ambiguity.  
These changes would have prevented the 9+ repeated `search-everything` calls and the `get-call-graph` parameter-discovery friction you documented.

### Using LLMs to Design & Optimize Tools (Anthropic’s Core Recommendation)
No standalone “MCP designer agent” product was released by March 2026, but Anthropic’s September 2025 engineering post provides the exact workflow:  
- Feed Claude your current tool registry + sample traces (your Kotor chronology).  
- Ask it to generate evaluation tasks, rewrite descriptions, and propose consolidated schemas.  
- Run the agent against held-out traces and let Claude analyze transcripts for redundancies.  
- Iterate until call count drops and accuracy rises (they report SWE-bench gains from this exact loop).  

This turns Claude into the “AI LLM agent trained to design tools” you asked for—without needing a separate product.

### Concrete Before/After Mapping to Your Tools

| Issue from Your Trace | Current Design | 2025–2026 Recommended Design | Expected Impact |
|-----------------------|----------------|------------------------------|-----------------|
| Repeated search-everything calls (“SaveGame”, “.sav”, etc.) | Single keyword query, no match_type | `search:everything` with `match_type` enum + `scopes` list | One targeted call instead of 5–9 |
| Per-address `get-functions` decompilations (50+ calls) | Single address only | Accepts list + optional `include_xrefs`, `data_flow`, `comments` flags | 1 call for entire save/load subsystem |
| `get-call-graph` parameter confusion | Separate `mode` + `direction` + required `max_depth` | Single `relation` enum; `max_depth` optional | No more empty results or discovery loops |
| 52 canonical + 26 legacy tools | Exhaustive table with overloads | 12–18 namespaced canonical tools; legacy hidden | Agents discover and use the right tool immediately |
| Large results → temp files | Raw dump | Paginated or summarized first; explicit `full` flag | No extra read_file steps |
| Inaccurate GFF field order / struct IDs in generated code | Agent relies only on decompilation | `analyze-data-flow` + `get-references` + `manage-structures` chain encouraged by tool descriptions | Higher precision, fewer hallucinations |

### Implementation Tips for Your Python MCP Server (Red Hat FastMCP Pattern)
- Use `@mcp.tool()` decorators with full type hints.  
- Keep helpers (e.g., Ghidra decompiler interface) inside async functions.  
- Wrap large Ghidra calls in timeouts and transaction safety.  
- For production, expose via FastAPI wrapper with RBAC and audit logging.  
- Test instantly with `mcp dev server.py` and the MCP Inspector UI—exactly as Red Hat demonstrates with the weather example.

### Why This Will Finally Stick (Fourth Redesign)
Your previous redesigns focused on adding more aliases and normalization. The 2025–2026 consensus flips the approach: minimize the surface area, enforce contracts via schemas, let the LLM (especially Claude) co-design the descriptions, and treat large/complex RE operations as composable pipelines rather than monolithic functions. The Kotor inaccuracies (wrong addresses, hallucinated GFF labels, missing struct IDs) disappear once agents are forced to combine `decompile` + `analyze-data-flow` + `manage-structures` in every loop instead of decompiling in isolation.

Adopting the MCP 2025 blueprint—consolidated tools, strict schemas, batching, preprocessing, and Claude-assisted iteration—will eliminate the inefficiencies you documented and produce the precise, accurate reverse-engineering output your workflow demands.

**Key Citations**  
- THE DEFINITIVE MCP GUIDE (2025): The Future of AI Tooling Explained — From Zero → Production Mastery (Medium, Dec 2025)  
- Writing effective tools for AI agents—using AI agents (Anthropic Engineering, Sep 2025)  
- MCP server tool design (Workato Docs, 2026)  
- How to build a simple agentic AI server with MCP (Red Hat Developer, Aug 2025)  
- Agentic Design Patterns: The 2026 Guide to Building Autonomous Systems (Sitepoint, 2026)  
- A Developer’s Guide to Agentic Frameworks in 2026 (Towards AI, Dec 2025)  
- The Complete Guide to LLMs in 2026 (Level Up Coding, 2026)
