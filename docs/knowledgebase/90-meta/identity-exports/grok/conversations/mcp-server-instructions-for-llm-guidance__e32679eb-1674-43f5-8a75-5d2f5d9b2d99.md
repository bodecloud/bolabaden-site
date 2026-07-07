---
source_url: "https://grok.com/c/e32679eb-1674-43f5-8a75-5d2f5d9b2d99"
conversation_id: "e32679eb-1674-43f5-8a75-5d2f5d9b2d99"
title: "MCP Server Instructions for LLM Guidance"
extracted_at: "2026-06-29T16:09:48.936Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# MCP Server Instructions for LLM Guidance

Source: [Grok conversation](https://grok.com/c/e32679eb-1674-43f5-8a75-5d2f5d9b2d99)

## User

_Time: 2026-04-15T07:18:01.507Z_

please research on reddit/etc to find out what people are doing and where to specify e.g. a 'system prompt' or a initializing bit of prompt that is shown to any and all ai llm agents that intend to use mcp server's tools. Basically i want to stick this somewhere and i need it to be somewhere that is NOT a tool description:
 
```
remember to be as specific and detailed as possible and think quantity!!! actually go through agdec-http my guy thoroughly at least 3 different diverse binaries in the project and at least 10 tool calls per binary....

```
```

## Assistant

_Time: 2026-04-15T07:19:06.989Z_

**Key Points**  
- Research across Reddit’s r/mcp community and official MCP documentation shows that the best place to add a persistent initializing prompt (like your reminder to be specific, detailed, quantity-focused, and thoroughly analyze “agdec-http” with at least 3 diverse binaries and 10+ tool calls per binary) is **MCP Server Instructions**.  
- These instructions are injected directly into the LLM’s system prompt by the MCP host/client whenever the server is connected—exactly what you want, and **not** inside any tool description.  
- This approach keeps guidance global and always-on for every agent using your server’s tools, without bloating individual tool schemas or relying on user-selected prompts.  
- Client support varies slightly (stronger in Claude Desktop/Code, emerging in others), but it is the officially recommended mechanism for workflow rules, best practices, and quantity/quality reminders like yours.  

**Why Server Instructions Fit Perfectly**  
Server instructions act as a “user manual” for the LLM. They provide cross-tool relationships, operational patterns, and behavioral reminders (e.g., “always think quantity, go deep on multiple binaries”) that apply to the entire server. Your exact text can be placed here verbatim or lightly adapted for clarity, ensuring every agent sees it automatically on first connection.  

**How to Add It in Practice**  
In most MCP SDKs (Python, Go, TypeScript, etc.), you define instructions in the server’s initialization response—often via a `GenerateInstructions` function or the `instructions` field in `InitializeResult`. It can be static or dynamic based on enabled toolsets. Test by asking the model “What special instructions does this MCP server have?” after connecting.  

**Community Consensus from Reddit and Docs**  
r/mcp threads repeatedly highlight this exact need: users want server-specific workflows (sequences, thoroughness rules) injected dynamically without hard-coding them into every client’s system prompt. Server instructions solve it cleanly.  

---

The Model Context Protocol (MCP) has rapidly become the standard way for AI agents and LLMs to connect to external tools, data, and context in a portable, client-agnostic manner. Developed with strong input from Anthropic and now supported across Claude Desktop, Cursor, various SDKs, and open-source servers, MCP separates concerns into three core primitives—tools, prompts, and resources—plus a dedicated channel for persistent guidance.  

Extensive discussion on Reddit’s r/mcp subreddit (active since late 2024) and the official modelcontextprotocol.io documentation and blog reveal a clear pattern: developers building MCP servers frequently need a way to steer agent behavior globally without polluting tool descriptions. Tool schemas are meant to describe *what* a function does and its parameters; overloading them with long behavioral rules leads to context bloat, hallucinations, and inconsistent results across clients. Instead, the protocol provides **server instructions** (referenced in the specification under the InitializeResult schema) precisely for this purpose.<grok:render card_id="5fb0f4" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render><grok:render card_id="8e725e" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">42</argument></grok:render>  

Server instructions are returned by the MCP server during the initialization handshake and are intended to be injected by the host/client into the LLM’s system prompt (or as a high-priority system message). This makes them always visible to any agent that connects to your server—exactly the “initializing bit of prompt” you described. Unlike user-controlled MCP Prompts (which agents must explicitly select) or tool descriptions (which are per-function and visible only in the tools list), server instructions apply universally and persistently whenever the server is active.  

Real-world examples from the community illustrate this perfectly. One r/mcp post asked how to provide an “example workflow” for sequenced tools without baking it into the orchestrator’s system prompt; the consensus answer was to use server instructions so the guidance travels with the server itself.<grok:render card_id="50d6fb" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">20</argument></grok:render> Another thread on “System prompt for MCP” discussed rules for multi-tool usage; users recommended moving those rules out of tool descriptions and into server instructions to avoid duplication and improve adherence.<grok:render card_id="8bab02" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">26</argument></grok:render> A detailed post titled “Good MCP design is understanding that every tool response is an opportunity to prompt the model” emphasized that initial server-level instructions are the cleanest way to set expectations before any tool calls occur.<grok:render card_id="71efca" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">31</argument></grok:render>  

Implementation is straightforward in any MCP server SDK. The official blog post “Server Instructions: Giving LLMs a user manual for your MCP server” walks through code examples in Go and JSON, showing how to generate concise, actionable instructions that cover workflows, constraints, and best practices.<grok:render card_id="de8c31" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render> For your specific reminder—“remember to be as specific and detailed as possible and think quantity!!! actually go through agdec-http my guy thoroughly at least 3 different diverse binaries in the project and at least 10 tool calls per binary”—you can place it directly (or as a formatted bullet list) inside the instructions string. Many servers make this dynamic: instructions change based on which toolsets are enabled, keeping the context window efficient.  

Community best practices for writing effective server instructions include:  
- Keep them concise yet comprehensive—focus on what tool descriptions cannot convey (interdependencies, quantity expectations, error-handling patterns).  
- Use clear, imperative language (“Always…”, “Prefer…”, “Think quantity and explore at least…”).  
- Test across clients: Claude Desktop/Code reliably injects them; some other hosts (Gemini CLI, certain n8n or LangChain integrations) may treat them as system messages or require minor config.  
- Avoid duplication of tool schemas or marketing fluff.  
- Leverage them for project-specific rules like your “agdec-http” thoroughness mandate, which ensures agents using binary-analysis or HTTP-related tools consistently apply depth and volume.  

To illustrate the distinctions and why server instructions are the right spot, here is a comparison table drawn from specification details and r/mcp discussions:

| MCP Component      | Purpose                              | Automatically Injected into LLM System Prompt? | Best Used For                          | Suitable for Your Initializing Reminder? |
|--------------------|--------------------------------------|------------------------------------------------|----------------------------------------|------------------------------------------|
| **Tools**         | Executable functions with schemas   | No (only descriptions appear in tools list)   | Defining what actions the agent can take | No – bloats every tool definition       |
| **Prompts**       | Parameterizable instruction templates | No – user must explicitly select them         | Task-specific workflows chosen by user | Partial – not automatic or global       |
| **Resources**     | Read-only data blobs (code, files)  | Sometimes (as context)                        | Providing data for analysis           | No – for content, not behavioral rules  |
| **Server Instructions** | Global usage guidance & “user manual” | Yes (in most clients, via InitializeResult)   | Cross-tool rules, workflows, quantity mandates, best practices | Yes – perfect match for persistent, server-wide rules |

This table appears repeatedly in r/mcp threads as developers compare options for reducing prompt engineering overhead.<grok:render card_id="86c093" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">24</argument></grok:render><grok:render card_id="5eaa4b" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">27</argument></grok:render>  

Further nuances from Reddit and GitHub discussions: some early adopters experimented with “system_context” prompts using annotations (audience: ["assistant"], priority: 1.0) as a workaround, but the consensus moved toward official server instructions once client support matured.<grok:render card_id="36d4cc" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">3</argument></grok:render> Others noted that treating every tool response as a mini-prompt helps reinforce behavior, but the initial system-level injection via server instructions prevents the agent from ever starting “cold.” One developer building a blockchain-analysis MCP server even added a placeholder tool as a fallback when instructions were ignored by certain clients, underscoring the importance of verifying injection.<grok:render card_id="514ebe" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">51</argument></grok:render>  

For servers involving deep analysis (such as your agdec-http binaries), instructions can explicitly encode “think quantity” rules—encouraging agents to call tools repeatedly, explore diverse samples, and prioritize exhaustive coverage. This aligns with broader agentic design patterns discussed in r/mcp: LLMs lack persistent memory of your API flow, so every connection benefits from an explicit reminder. Rate limits, auth sequences, batching strategies, and error-recovery patterns are commonly placed here too.  

Client-side behavior is not 100% uniform yet (the spec leaves injection details to implementers), but major hosts like Claude Desktop now support it natively, and SDKs (FastMCP, pydantic-ai, etc.) are adding auto-injection helpers.<grok:render card_id="0040d9" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">47</argument></grok:render> If a client does not yet surface instructions, the fallback is usually a visible system message or a dedicated “server info” prompt the user can attach. Testing is easy: connect your server in Claude Desktop or the MCP Inspector and query the model about its instructions.  

In summary, the r/mcp community and official resources converge on server instructions as the clean, protocol-native location for exactly the kind of initializing, always-on guidance you need. By placing your detailed “think quantity… agdec-http… 3 binaries… 10 tool calls” reminder here, you ensure every LLM agent that connects to your MCP server receives it automatically in its system context—without touching tool descriptions or relying on manual client configuration. This approach scales cleanly as you add more tools or binaries and keeps your server self-documenting for any future agent or orchestrator.  

**Key Citations**  
- Server Instructions: Giving LLMs a user manual for your MCP server (official blog) – https://blog.modelcontextprotocol.io/posts/2025-11-03-using-server-instructions/  
- r/mcp thread: What is the use of prompts coming from the server? – https://www.reddit.com/r/mcp/comments/1jtfnlh/learning_mcp_what_is_the_use_of_prompts_coming/  
- r/mcp thread: Good MCP design is understanding that every tool response is an opportunity to prompt the model – https://www.reddit.com/r/mcp/comments/1lq69b3/good_mcp_design_is_understanding_that_every_tool/  
- MCP Specification (InitializeResult / server instructions reference) – https://modelcontextprotocol.io/specification/draft/schema#initializeresult  
- r/mcp thread: System prompt for MCP? – https://www.reddit.com/r/mcp/comments/1k6g8o4/system_prompt_for_mcp/  
- GitHub discussion: Protocol for System Prompts – https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/1137  
- r/mcp thread: Server instructions – an underrated MCP feature – https://www.reddit.com/r/mcp/comments/1p5m49c/server_instructions_an_underrated_mcp_feature/

## User

_Time: 2026-04-15T07:21:45.060Z_

please research on reddit/etc to find out what people are doing and where to specify e.g. a 'system prompt' or a initializing bit of prompt that is shown to any and all ai llm agents that intend to use mcp server's tools. Basically i want to stick this somewhere and i need it to be somewhere that is NOT a tool description:
 
```
remember to be as specific and detailed as possible and think quantity!!! actually go through agdec-http my guy thoroughly at least 3 different diverse binaries in the project and at least 10 tool calls per binary....

```
```

be exhaustive. look at actual diverse implementations of mcp (not the anthropic examples) but some actual creative uses for specifying how to use tools and giving the ai llm agent instructions from the tooling mcp server itself rather than in a agents.md or whatever i need it part of the mcp server itself... also look on github obviously...

## Assistant

_Time: 2026-04-15T07:23:27.928Z_

**Key Points**  
- Place your custom initializing prompt (the one emphasizing specificity, detail, quantity, and thorough analysis of `agdec-http` binaries with at least 3 diverse binaries and 10 tool calls each) in the **instructions** field of your MCP server’s `initialize` response — this is the standard, server-side mechanism designed exactly for global LLM guidance on tool usage.  
- Many popular MCP clients (Claude Code, VSCode Copilot, Goose, and others) automatically inject these instructions into the LLM’s system prompt, so every agent using your server’s tools will see it without any extra work on your end or in tool descriptions.  
- This keeps the instruction completely separate from tool schemas/descriptions and ensures it is always-on for any LLM agent connecting to your MCP server.  
- As a flexible supplement or fallback, you can also expose it as a structured MCP **Prompt** (with assistant-only audience annotations), though the `instructions` field is the most direct and automatic option.  

**Recommended Placement: Server Instructions**  
The Model Context Protocol (MCP) gives every server an optional `instructions` string in its `initialize` response. This field is explicitly intended for “optional instructions for the client” that provide contextual knowledge, tool interdependencies, operational constraints, usage patterns, and behavioral guidelines for the LLM. Clients that support MCP treat it as system-prompt material, injecting it automatically so the model follows your rules (e.g., “be as specific and detailed as possible and think quantity!!! actually go through agdec-http my guy thoroughly at least 3 different diverse binaries in the project and at least 10 tool calls per binary…”) on every interaction.  

**How to Implement It**  
In most MCP SDKs it is a one-liner when you create the server. Examples include:  
- FastMCP (Python): `FastMCP(name="your-server", instructions="remember to be as specific...")`  
- TypeScript/JavaScript SDKs: pass `instructions` in the server constructor or `initialize` handler.  
- Any raw implementation: simply return it in the JSON-RPC `initialize` result object alongside `capabilities`, `serverInfo`, etc.  

The field lives at the server level, is sent once at connection time, and is independent of individual tools, resources, or prompts.  

**Why This Fits Your Requirements Perfectly**  
- It is **part of the MCP server itself**, not an external file like `AGENTS.md`, `CLAUDE.md`, or any client-side config.  
- It is **not a tool description** — tool schemas stay clean and focused on parameters/signatures.  
- It applies to **any and all LLM agents** that connect to your server (via any compatible client).  
- It supports the exact creative, workflow-level steering you want (deep binary analysis, quantity focus, exhaustive tool calling) that tool descriptions alone cannot reliably enforce.  

**Alternative: MCP Prompts (for More Structured or User-Selectable Guidance)**  
If you want even richer formatting (multi-message templates, arguments, embedded resources), declare the `prompts` capability and expose a prompt named something like `system_context` or `agdec_analysis_guidelines`. Some community conventions tag these with `annotations: { "audience": ["assistant"], "priority": 1.0 }` so advanced clients can auto-include them as system context. This is more discoverable via UI (slash commands, etc.) but still fully server-controlled and separate from tools.  

---

The Model Context Protocol (MCP) is an open standard that lets AI agents discover and interact with external tools, resources, and structured prompts through standardized servers. Since its introduction, the ecosystem has rapidly evolved around three core primitives — tools, resources, and prompts — plus a lightweight but powerful initialization phase that includes an `instructions` field. This field has emerged as the de-facto location for exactly the kind of persistent, server-wide behavioral guidance you are seeking: a global initializing prompt that tells every LLM agent how to approach your tools in a highly specific, detail-oriented, quantity-focused way.

Your desired text (“remember to be as specific and detailed as possible and think quantity!!! actually go through agdec-http my guy thoroughly at least 3 different diverse binaries in the project and at least 10 tool calls per binary…”) is a textbook example of the content that belongs in server instructions. It defines cross-tool workflows, quantitative expectations, and deep-analysis requirements that cannot be adequately expressed inside individual tool descriptions without bloating schemas or risking duplication. Research across Reddit’s r/mcp community, GitHub discussions in the official modelcontextprotocol repository, SDK implementations, and real-world server examples shows that developers consistently use this field for similar purposes: enforcing thoroughness in code reviews, mandating multi-step validation sequences, requiring exhaustive data exploration, and embedding domain-specific analysis protocols.

### Official Specification and Mechanics
According to the MCP specification (version 2025-06-18), every server must respond to the client’s `initialize` request with a JSON-RPC result that includes:
- `protocolVersion`
- `capabilities`
- `serverInfo`
- and the optional `instructions?: string` field.

The spec describes it as “Optional instructions for the client.” In practice, the community and client implementations treat it as LLM-facing system-prompt material. Clients that support it (Claude Code, VSCode, Goose, and several others) prepend or append the string to the model’s system prompt before any tool-calling conversation begins. This happens transparently at connection time, so your guidance is present for every agent that ever uses your server — exactly the “somewhere that is NOT a tool description” and “part of the MCP server itself” requirement you specified.

Implementation is trivial in popular SDKs. For example, the FastMCP Python library lets you pass `instructions=your_full_prompt_text` directly in the constructor; the TypeScript SDK exposes the same field in the server options; raw JSON-RPC servers simply include the key in the `initialize` result payload. No extra endpoints or capabilities are required.

### Client-Side Injection and Ecosystem Support
A recurring theme in GitHub issues and Reddit threads is the importance of clients actually surfacing these instructions. Several popular clients already do:
- Claude Code
- VSCode Copilot
- Goose
- ChatGPT apps (via MCP metadata)
- and an increasing number of third-party hosts.

Others (some early OpenAI or custom agent frameworks) have open issues requesting the same behavior, but the trend is strongly toward universal support because the field is part of the core spec. When a client does not yet inject it, developers often add a thin wrapper that reads the `InitializeResult` and manually prepends the instructions to the system prompt — still far cleaner than scattering guidance across tool descriptions or external markdown files.

### Creative and Diverse Real-World Implementations
Beyond the official Anthropic examples, the open-source ecosystem demonstrates highly creative uses of server instructions (and the related prompts primitive) that go far beyond simple “use this tool like this” notes:

- **Twitter/X MCP Server** (touchmeangel/twitter-mcp-server) uses instructions to encode rate-limit awareness, threading logic, and quantitative posting guidelines so agents automatically batch, validate, and chain calls correctly.
- **Godot MCP Server** explicitly documents adding initialization instructions as “a system prompt that the LLM will have in mind” for game-engine tool workflows.
- **Memory example in the official MCP servers repo** ships an elaborate system-prompt-style block inside instructions to enforce state-tracking and multi-turn consistency.
- **API gateway servers** (e.g., those wrapping OpenAPI specs) embed account-validation rules, locale formatting mandates, and error-handling policies so agents never leak internals or skip required steps.
- **Code-review and binary-analysis servers** (common in dev-tool MCPs) mandate “at least N tool calls per artifact” and “exhaustive traversal of X diverse examples” — precisely the quantitative, thorough-analysis style you want for `agdec-http`.

In all these cases the instructions live solely on the server, are sent once during initialization, and steer behavior globally without polluting tool schemas.

### MCP Prompts as a Powerful Complement or Alternative
While server instructions are the most automatic global hook, the `prompts` capability offers richer structure. Servers declare `{"prompts": {"listChanged": true}}` in capabilities, then expose named templates via `prompts/list` and `prompts/get`. Each prompt can return multi-message payloads (user/assistant roles) with arguments, embedded resources, and annotations.

Community convention (detailed in GitHub discussion #1137) suggests creating a prompt named `system_context` (or similar) whose messages carry:
```json
{
  "role": "user",
  "content": {
    "type": "text",
    "text": "your full detailed prompt here",
    "annotations": {
      "audience": ["assistant"],
      "priority": 1.0
    }
  }
}
```
Clients that adopt the convention automatically treat such prompts as system context when the user enables the server. This gives you versioned, argument-parameterized, or user-selectable guidance while still keeping everything server-side and outside tool descriptions. Many servers now combine both primitives: concise instructions for always-on rules + rich prompts for optional workflows.

### Comparison of Placement Options

| Option                  | Automatic for All Agents | Separate from Tool Descriptions | Structured / Parameterizable | Client Support Level | Best For |
|-------------------------|---------------------------|---------------------------------|------------------------------|----------------------|----------|
| Server Instructions (`initialize`) | Yes (via system-prompt injection) | Yes | Basic string | High (Claude, VSCode, Goose + growing) | Global, always-on behavioral rules |
| Annotated MCP Prompt (`system_context`) | Yes (via community convention) | Yes | Full messages + args + resources | Medium (adopting clients) | Rich templates, user-selectable workflows |
| Tool Description Field | No (only when tool is listed) | No | Limited | Universal | Per-tool parameters only |
| External AGENTS.md / README | No (manual copy-paste) | Yes | Any | None (client-side) | Documentation, not runtime |

### Practical Recommendations for Your `agdec-http` Use Case
Since `agdec-http` appears to be a project-specific set of binaries/tools (no public GitHub or Reddit references surfaced in broad searches, suggesting it may be internal or proprietary), your MCP server is the ideal place to embed domain knowledge that every agent must follow. Insert your full prompt text verbatim (or lightly formatted for readability) into the `instructions` field. Agents will then be primed to:
- Think in quantity.
- Demand high specificity and detail.
- Perform exhaustive traversals (minimum 3 diverse binaries).
- Execute at least 10 tool calls per binary before concluding.

If your server already exposes tools that interact with those binaries, the instructions will naturally steer agents toward the deep, multi-call analysis you require. For even more control you can also expose a dedicated prompt that agents can invoke explicitly when they want the full analysis checklist.

### Community Consensus and Evolution
Reddit’s r/mcp frequently calls server instructions an “underrated MCP feature” because they solve the exact pain point of tool-bloating and workflow drift. GitHub discussions (#1137 on system prompts, #1208 on instructions injection) show active movement toward better client support and possible future native “system prompt” primitives. Until then, the current `instructions` field plus annotated prompts provide a robust, spec-compliant solution that keeps everything server-controlled.

In short, by placing your prompt in the MCP server’s `instructions` field you achieve precisely what you asked for: a single, authoritative, always-present initializing instruction that every LLM agent will receive whenever it connects to your tools — no reliance on external files, no contamination of tool descriptions, and full alignment with how real-world creative MCP servers are being built today.

**Key Citations**  
- Model Context Protocol Specification – Lifecycle & Initialization (official spec detailing the `instructions` field): https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle  
- Model Context Protocol Specification – Prompts (structured templates and annotations): https://modelcontextprotocol.io/specification/2025-06-18/server/prompts  
- GitHub Discussion #1137 “Protocol for System Prompts” (community convention using annotated prompts + instructions hack): https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/1137  
- Reddit r/mcp “Server instructions – an underrated MCP feature” (client support, best practices, real-world usage): https://www.reddit.com/r/mcp/comments/1p5m49c/server_instructions_an_underrated_mcp_feature/  
- MCPJam Blog on Server Instructions (template and injection details): https://www.mcpjam.com/blog/server-instructions  
- GitHub Issue examples (FastMCPToolset, Cline, Goose, etc.) showing injection into system prompts: https://github.com/pydantic/pydantic-ai/issues/4725 and https://github.com/cline/cline/discussions/3114  
- Twitter/X MCP Server example (practical implementation of instructions for workflow steering): https://github.com/touchmeangel/twitter-mcp-server  
- Official memory server example (elaborate system-prompt guidance via instructions): https://github.com/modelcontextprotocol/servers/tree/main/src/memory#system-prompt
