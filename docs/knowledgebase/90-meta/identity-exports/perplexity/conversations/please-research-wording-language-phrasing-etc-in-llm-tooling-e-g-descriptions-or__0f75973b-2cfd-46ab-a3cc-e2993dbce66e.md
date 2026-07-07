---
source_url: "https://www.perplexity.ai/search/9e05a692-0e65-4ed3-8994-33ec01fe516c"
thread_uuid: "0f75973b-2cfd-46ab-a3cc-e2993dbce66e"
slug: "9e05a692-0e65-4ed3-8994-33ec01fe516c"
title: "please research wording, language, phrasing, etc in llm tooling e.g. descriptions, or restrictions or what not. I have this:

```

class FunctionToolProvider(ToolProvider):
    HANDLERS: ClassVar[dict[str, str]] = {
        \"listfunctions\": \"_handle_list\",
        \"getfunctions\": \"_handle_get\",
    }


    def list_tools(self) -> list[types.Tool]:
        return [
            types.Tool(
                name=\"list-functions\",
                description=\"Retrieve a giant list of every function defined inside the program. This is useful for getting an overview of what subroutines exist, verifying if a known library function was statically linked, or mapping out everything prior to iterating over them.\",
                inputSchema={
                    \"type\": \"object\",
                    \"properties\": {
                        \"programPath\": {\"type\": \"string\", \"description\": \"The path to the program containing the functions.\"},
                        \"namePattern\": {\"type\": \"string\", \"description\": \"Optional regular expression used to filter down the function names (e.g., '^sub_' to find all default-named subs).\"},
                        \"includeExternals\": {\"type\": \"boolean\", \"default\": True, \"description\": \"Whether to include functions that are dynamically linked to external libraries (like kernel32.dll or libc).\"},
                        \"limit\": {\"type\": \"integer\", \"default\": 100, \"description\": \"Maximum number of functions returned. Keep this manageable.\"},
                        \"offset\": {\"type\": \"integer\", \"default\": 0, \"description\": \"Pagination offset tracker.\"},
                    },
                    \"required\": [],
                },
            ),
``` 

I've rephrased the description for 'limit' like a dozen times but the LLM ai agent continually will use low values like 5 or 3 which is useless. I don't want to specify 'use at least 100' because that wastes tokens. I want to learn how to actually write these descriptions, how to design them and predict what the llm and how it will behave? is there a way to do that?"
extracted_at: "2026-06-29T16:36:01.334Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# please research wording, language, phrasing, etc in llm tooling e.g. descriptions, or restrictions or what not. I have this:

```

class FunctionToolProvider(ToolProvider):
    HANDLERS: ClassVar[dict[str, str]] = {
        "listfunctions": "_handle_list",
        "getfunctions": "_handle_get",
    }


    def list_tools(self) -> list[types.Tool]:
        return [
            types.Tool(
                name="list-functions",
                description="Retrieve a giant list of every function defined inside the program. This is useful for getting an overview of what subroutines exist, verifying if a known library function was statically linked, or mapping out everything prior to iterating over them.",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "programPath": {"type": "string", "description": "The path to the program containing the functions."},
                        "namePattern": {"type": "string", "description": "Optional regular expression used to filter down the function names (e.g., '^sub_' to find all default-named subs)."},
                        "includeExternals": {"type": "boolean", "default": True, "description": "Whether to include functions that are dynamically linked to external libraries (like kernel32.dll or libc)."},
                        "limit": {"type": "integer", "default": 100, "description": "Maximum number of functions returned. Keep this manageable."},
                        "offset": {"type": "integer", "default": 0, "description": "Pagination offset tracker."},
                    },
                    "required": [],
                },
            ),
``` 

I've rephrased the description for 'limit' like a dozen times but the LLM ai agent continually will use low values like 5 or 3 which is useless. I don't want to specify 'use at least 100' because that wastes tokens. I want to learn how to actually write these descriptions, how to design them and predict what the llm and how it will behave? is there a way to do that?

Source: [Perplexity thread](https://www.perplexity.ai/search/9e05a692-0e65-4ed3-8994-33ec01fe516c)

## User

please research wording, language, phrasing, etc in llm tooling e.g. descriptions, or restrictions or what not. I have this:

```

class FunctionToolProvider(ToolProvider):
    HANDLERS: ClassVar[dict[str, str]] = {
        "listfunctions": "_handle_list",
        "getfunctions": "_handle_get",
    }


    def list_tools(self) -> list[types.Tool]:
        return [
            types.Tool(
                name="list-functions",
                description="Retrieve a giant list of every function defined inside the program. This is useful for getting an overview of what subroutines exist, verifying if a known library function was statically linked, or mapping out everything prior to iterating over them.",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "programPath": {"type": "string", "description": "The path to the program containing the functions."},
                        "namePattern": {"type": "string", "description": "Optional regular expression used to filter down the function names (e.g., '^sub_' to find all default-named subs)."},
                        "includeExternals": {"type": "boolean", "default": True, "description": "Whether to include functions that are dynamically linked to external libraries (like kernel32.dll or libc)."},
                        "limit": {"type": "integer", "default": 100, "description": "Maximum number of functions returned. Keep this manageable."},
                        "offset": {"type": "integer", "default": 0, "description": "Pagination offset tracker."},
                    },
                    "required": [],
                },
            ),
``` 

I've rephrased the description for 'limit' like a dozen times but the LLM ai agent continually will use low values like 5 or 3 which is useless. I don't want to specify 'use at least 100' because that wastes tokens. I want to learn how to actually write these descriptions, how to design them and predict what the llm and how it will behave? is there a way to do that?

## Assistant

You are running into a pretty common pattern: the schema text (“keep this manageable”) plus the parameter name (“limit”) are nudging the model toward “small numbers,” and without structural constraints it happily picks 3 or 5. The most reliable fix is to (a) encode your preferences in JSON Schema constraints and defaults, and (b) use short, explicit, authority-style language about ranges, rather than soft phrasing like “manageable.”[1][2][3][4]

Here is what this means concretely for you and your `limit` field, plus how to think about “predicting” LLM behavior.

***

## Why the model keeps picking 3–5

Two things are working against you:

- **Vague framing like “keep this manageable”** strongly suggests “small” without saying “how small,” so the model reaches for stereotypical list sizes (3, 5, 10) it has seen everywhere in training.[5][6]
- **No structural constraints**: the schema doesn’t tell the model that 3 is effectively useless, nor does your runtime clamp or fix bad values, so those tiny numbers make it all the way through.[3][1]

Benchmarks on tool use show models often mis-calibrate numeric parameters when guidance is only verbal, especially for “how many items” style parameters like limits and page sizes.[7][8]

***

## Better design for your `limit` parameter

Right now you have:

```json
"limit": {
  "type": "integer",
  "default": 100,
  "description": "Maximum number of functions returned. Keep this manageable."
}
```

You can keep this cheap in tokens but far more directive. A good pattern is:

1. **Use min/max constraints.**  
2. **Make the default good enough.**  
3. **State a normal range and explicitly discourage tiny values.**  

For example:

```json
"limit": {
  "type": "integer",
  "default": 200,
  "minimum": 50,
  "maximum": 2000,
  "description": "Number of functions to return. In normal use, set this between 100 and 500. Values below 50 usually miss important functions and should only be used if the user explicitly asks for a very small sample."
}
```

Why this works better:

- `minimum`/`maximum` are part of JSON Schema best practices and many tool-call implementations respect them.[4][1]
- Even if the model still tries `5`, your code can clamp to `[50, 2000]` before executing.  
- The description replaces “manageable” with **explicit guidance and a norm** (“between 100 and 500”, “below 50 … should only be used if the user explicitly asks”). Normative, authority-style language is measurably more influential than hedged hints.[2]

Token-wise, you’ve added maybe a sentence or two—orders of magnitude cheaper than repeatedly making useless low-limit calls.

***

## Name and framing tweaks that help

Names and little bits of phrasing matter more than you’d expect:

- **Rename for coverage, not smallness.**  
  - `max_functions_to_inspect` or `max_functions_to_list` nudges “this should be large enough to be meaningful,” more than bare `limit`.[9][4]
- **Avoid fuzzy adjectives.**  
  - Replace “manageable”, “reasonable”, “not too large” with concrete statements:  
    - “Typical values are 100–500.”  
    - “Do not use less than 50 in normal use.”  

Research on “influence prefixes” shows that short, authoritative phrases like “You must not do X under normal circumstances” shift model behavior much more than soft phrases like “try to avoid X.”[2]

***

## Very cheap system-level rule (if you’re willing)

If you can touch the system prompt / agent instructions, a single sentence buys you a lot without much token cost:

> “When calling `list-functions`, do not set `limit` below 50 unless the user explicitly requests a very small number of results.”

OpenAI’s own docs recommend putting global policies like this in higher-level instructions and using the tool schema for parameter semantics. That one line is usually cheaper than the cost of repeated bad tool calls.[1][9]

***

## When to *not* let the model choose `limit` at all

If you think about it, the model rarely has unique insight into “how many functions” are needed; you mostly just want “enough to be useful.” Best-practice guides emphasize **removing parameters the model doesn’t really need to decide**, and handling them in code.[3][9][1]

Options:

- **Hide `limit` from the schema**: always use e.g. 200 or 500 internally, or adjust based on program size heuristics.  
- Or keep `limit` but **ignore low values in code**: if `limit < 50`, treat it as `50` or your preferred default. Log when you do this so you can see how often the model misbehaves.

This treats the model’s arguments as suggestions, not commands—which is how robust agent frameworks are generally designed.[10][3]

***

## How to “predict” behavior in practice

You can’t fully analytically predict token-by-token choices, but you can treat the model like a black-box system and characterize it empirically:

1. **Generate synthetic prompts** that cause `list-functions` to be used (different user wordings, different contexts).  
2. **Log the tool calls** (especially `limit`).  
3. **Iterate**:
   - Try one schema description, run a batch, inspect distributions of `limit`.  
   - Change only the description (or add a `minimum`) and repeat.  
   - Compare histograms.

Tool-use and function-calling benchmarks explicitly recommend this kind of evaluation loop because obedience to schemas and instructions varies a lot between models and scenarios. The pragmatic framing work shows that small wording tweaks can produce large, measurable shifts, so A/B testing descriptions is the practical way to “predict” and then shape behavior.[8][11][7][1][2]

***

## Minimal, concrete suggestions for your case

If you want to change as little as possible right now:

1. **Add hard bounds and adjust description** (fastest win):  
   ```json
   "limit": {
     "type": "integer",
     "default": 200,
     "minimum": 50,
     "maximum": 2000,
     "description": "Number of functions to return. Typical values are 100–500. Do not set this below 50 unless the user explicitly asks for only a handful of results."
   }
   ```  

2. **Clamp in code** before executing the tool:  
   ```python
   limit = max(50, min(user_limit or 200, 2000))
   ```  

3. (Optional but cheap) **Add a one-liner system rule** about `limit >= 50` except when the user clearly wants very few.

Those three together usually stop the “limit: 3” / “limit: 5” behavior without needing long instructions or wasting many tokens.[10][1][3]

***

I have put a more detailed write-up, with citations and examples, into a short report artifact you can reuse when designing other tools and parameters.[12]

### Sources

- [Function calling | OpenAI API](https://developers.openai.com/api/docs/guides/function-calling/)
  - Learn how function calling enables large language models to connect to external data and systems.
- [Measuring Pragmatic Influence in LLM Instructions - arXiv](https://arxiv.org/html/2602.21223v1)
  - It is not only what we ask large language models (LLMs) to do that matters, but also how we prompt. Phrases like “This is urgent” or “As your supervisor” can shift model behavior without altering task content. We study this effect as pragmatic framing, contextual cues that shape directive interpretation rather than task specification. … We introduce directive-framing decomposition to separate pragmatic context (the influence prefix) from task specification (the directive). In speech act terms,...
- [Mastering LLM Function Calling: A Guide to Enhancing AI Capabilities](https://runloop.ai/blog/mastering-llm-function-calling-a-guide-to-enhancing-ai-capabilities)
  - Function calling lets LLMs do real actions, not just text. It can order stuff or automate tasks using JSON schemas and tools like LangChain.
- [From Words to Behavior: How Prompt Instructions Shape LLM ...](https://www.linkedin.com/pulse/from-words-behavior-how-prompt-instructions-shape-llm-amr-altahlawi-isnoe)
  - In the first four articles of this series, we built a foundation: How agents reason (ReAct) Why token prediction produces intelligence How agents “do” work via tools and APIs How memory turns context into experience This article zooms in on a subtle but decisive layer that influences all of the abov
- [Function Calling - Hugging Face](https://huggingface.co/docs/hugs/en/guides/function-calling)
  - We’re on a journey to advance and democratize artificial intelligence through open source and open science.
- [EASYTOOL: Enhancing LLM-based Agents with Concise Tool Instruction](http://arxiv.org/pdf/2401.06201.pdf)
- [ComplexFuncBench: Exploring Multi-Step and Constrained Function Calling
  under Long-Context Scenario](https://arxiv.org/html/2501.10132v1)
- [Structured human-LLM interaction design reveals exploration and ...](https://pmc.ncbi.nlm.nih.gov/articles/PMC12177052/)
  - Large Language Models (LLMs) present a radically new paradigm for the study of information foraging behavior. We study how LLM technology is used for pedagogical content creation by a sample of 25 participants in a doctoral-level Artificial ...
- [Function Calling with LLMs - Prompt Engineering Guide](https://www.promptingguide.ai/applications/function_calling)
  - A Comprehensive Overview of Prompt Engineering
- [Taming LLMs: strategies and tools for controlling responses | Tryolabs](https://tryolabs.com/blog/strategies-and-tools-for-controlling-responses)
  - Discover effective strategies for controlling Large Language Models (LLMs). Learn about prompting, logit filtering, parameter tuning, and guardrails to improve LLM outputs.
- [Understanding OpenAI Function Calling - .NET | Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/ai/conceptual/understanding-openai-functions)
  - Understand how function calling enables you to integrate external tools with your OpenAI application.
- [BigCodeBench: Benchmarking Code Generation with Diverse Function Calls
  and Complex Instructions](https://arxiv.org/html/2406.15877)
- [MCPToolBench++: A Large Scale AI Agent Model Context Protocol MCP Tool Use Benchmark](https://arxiv.org/abs/2508.07575)
- [ToolGen: Unified Tool Retrieval and Calling via Generation](https://arxiv.org/html/2410.03439)
- [An LLM Compiler for Parallel Function Calling](https://arxiv.org/pdf/2312.04511.pdf)
- [TinyAgent: Function Calling at the Edge](http://arxiv.org/pdf/2409.00608.pdf)
- [Hammer: Robust Function-Calling for On-Device Language Models via
  Function Masking](http://arxiv.org/pdf/2410.04587.pdf)
- [An LLM-Tool Compiler for Fused Parallel Function Calling](http://arxiv.org/pdf/2405.17438.pdf)
- [Function calling using LLMs - Martin Fowler](https://martinfowler.com/articles/function-call-LLM.html)
  - Allowing an LLM to formulate calls to external systems
- [LLMs and function/tool calling - by Christo Olivier](https://blog.christoolivier.com/p/llms-and-functiontool-calling)
  - What is it and how to achieve it with any LLM, not just those that support it in their API/SDK
- [Tutorial: Setting Up OpenAI Function Calling with Chat Models](https://www.vellum.ai/blog/openai-function-calling-tutorial)
  - Learn how to use OpenAI function calling in your AI apps to enable reliable, structured outputs.
- [Structured outputs in LLMs: Definition, techniques, applications ...](https://www.leewayhertz.com/structured-outputs-in-llms/)
  - Explore how structured outputs enhance LLMs by boosting accuracy and efficiency in data generation, leading to more precise and reliable results.
- [Prompting Best Practices for Tool Use (Function Calling)](https://community.openai.com/t/prompting-best-practices-for-tool-use-function-calling/1123036)
  - I’m looking for an explanation of how LLMs use/see the information passed in to the API parameters - specifically the tools that are specified. When specifying a list of tools in the parameters to the API request, is it still necessary to declare and describe the list of tools in the system prompt? If so, why? Can’t the LLM see that I declared the list in the parameters? I can even pass in a description field in the JSON definitions of the tools. So do I still need to mention them in the...
- [Best Practices for Improving Assistants' Function calling Reasoning ...](https://community.openai.com/t/best-practices-for-improving-assistants-function-calling-reasoning-ability/596180)
  - I am following the OpenAI cookbook to build an Assistant that operates on a meeting summary and actions upon that summary. There are somewhat complex logic to figure out the set of functions to call, and ~20 custom function calls as tools. Even though I pass in some of that logic into the run instructions, the model still sometimes doesn’t follow those instructions. How can I get the model to follow those instructions, or in general improve reasoning ability in terms of correctly identifying ...
