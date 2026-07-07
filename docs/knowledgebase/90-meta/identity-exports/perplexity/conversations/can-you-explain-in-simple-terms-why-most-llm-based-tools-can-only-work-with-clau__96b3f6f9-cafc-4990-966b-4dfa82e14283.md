---
source_url: "https://www.perplexity.ai/search/d1322808-8f01-4bea-9726-50d2063ae313"
thread_uuid: "96b3f6f9-cafc-4990-966b-4dfa82e14283"
slug: "d1322808-8f01-4bea-9726-50d2063ae313"
title: "Can you explain in simple terms why most LLM based tools can only work with Claude-3.5-sonnet? Specifically, something about the **agent prompts** and the **prompt chain** breaks when using other models.

Why can the other models not understand the prompts? Stuff like <context_here> and <user_query> and 'use the <open_file> tool to do this> just stop working. What functoinality is this that's breaking and why does the format not translate?"
extracted_at: "2026-06-29T16:13:15.038Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# Can you explain in simple terms why most LLM based tools can only work with Claude-3.5-sonnet? Specifically, something about the **agent prompts** and the **prompt chain** breaks when using other models.

Why can the other models not understand the prompts? Stuff like <context_here> and <user_query> and 'use the <open_file> tool to do this> just stop working. What functoinality is this that's breaking and why does the format not translate?

Source: [Perplexity thread](https://www.perplexity.ai/search/d1322808-8f01-4bea-9726-50d2063ae313)

## User

Can you explain in simple terms why most LLM based tools can only work with Claude-3.5-sonnet? Specifically, something about the **agent prompts** and the **prompt chain** breaks when using other models.

Why can the other models not understand the prompts? Stuff like <context_here> and <user_query> and 'use the <open_file> tool to do this> just stop working. What functoinality is this that's breaking and why does the format not translate?

## Assistant

The issue you're describing with **agent prompts** and **prompt chains** breaking when using models other than Claude 3.5 Sonnet likely stems from differences in how models interpret and handle complex, structured prompts. Let's break this down:

### 1. **System Prompts and Model-Specific Behavior**
Each large language model (LLM) has a unique *system prompt* that sets the rules for how it interprets user inputs and manages tasks. These system prompts define the model's behavior, including how it handles tools, chains of thought, or structured tasks like agent-based workflows. For instance, Claude 3.5 Sonnet is specifically designed to handle complex task structures, such as agent-based prompts where the model must manage multiple steps or tools in a sequence.[1][6]

Other models may not have the same level of sophistication in their system prompts, especially when it comes to handling agent workflows with placeholders like `<context_here>` or `<open_file>`. These placeholders are part of a structured prompt format that some models may not fully understand or prioritize correctly because their system prompts are not optimized for such tasks.

### 2. **Prompt Chain and Agent Prompts**
A **prompt chain** involves a series of instructions or queries that build on each other, often requiring the model to maintain context across multiple steps. In agent-based systems, these chains can involve placeholders or tool usage instructions (e.g., "use the `<open_file>` tool"). Claude 3.5 Sonnet is likely optimized for handling these kinds of prompts by maintaining a clear context and understanding tool-related commands effectively.[6]

However, other models might struggle with:
- **Context Management:** Some LLMs may lose track of context when handling long or complex prompt chains, leading to errors in understanding placeholders like `<context_here>`. This could be due to less robust memory management or attention mechanisms compared to models like Claude 3.5 Sonnet.[4]
- **Tool Usage:** Models that aren't optimized for agent-based tasks may not correctly interpret commands like "use the `<open_file>` tool." These instructions rely on the model's ability to understand that it's supposed to invoke a specific tool or action, which may not be well-supported in other models.[6]

### 3. **Why Other Models Fail**
The failure of other models to handle these prompts can be attributed to several factors:
- **Pattern Continuation vs. Task Execution:** Many LLMs are primarily pattern completion engines—they predict the next word based on previous input but may not be designed to execute multi-step tasks involving external tools or agents. If the model hasn't been trained or fine-tuned for such tasks, it will simply continue generating text without understanding the functional aspects of the prompt.[7]
- **Lack of Chain-of-Thought Optimization:** Claude 3.5 Sonnet is designed with guided chain-of-thought reasoning in mind, which helps it think through problems step-by-step. Other models might not have this optimization and therefore fail when they need to follow a structured sequence of actions.[6]
- **System Prompt Sensitivity:** The system prompt in Claude 3.5 Sonnet includes explicit instructions for handling complex workflows, which other models might lack. This makes it more sensitive and capable of following agent-based prompts accurately.[1][6]

### Conclusion
In summary, most LLM-based tools work best with Claude 3.5 Sonnet because it has been specifically optimized for handling complex workflows involving agent-based prompts and multi-step task execution. Other models may fail because they lack the necessary system prompt design and chain-of-thought reasoning capabilities required to interpret placeholders and tool commands effectively. This results in broken functionality when using structured prompts that rely on maintaining context and executing specific actions across multiple steps.

### Sources

- [The updated Claude 3.5 Sonnet also got a new system prompt](https://www.reddit.com/r/ClaudeAI/comments/1g9kzzk/the_updated_claude_35_sonnet_also_got_a_new/)
- [Prompts to break large language models : r/PromptEngineering](https://www.reddit.com/r/PromptEngineering/comments/17gy70m/prompts_to_break_large_language_models/)
- [Why are LLMs bad at deductive reasoning? : r/compsci - Reddit](https://www.reddit.com/r/compsci/comments/1bkruas/why_are_llms_bad_at_deductive_reasoning/)
- [I think I have identified the main 3 (three) obstacles to LLMs ... - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1fevy03/i_think_i_have_identified_the_main_3_three/)
- [AI system prompts compared : r/PromptEngineering - Reddit](https://www.reddit.com/r/PromptEngineering/comments/1f7mltz/ai_system_prompts_compared/)
- [Sonnet 3.5 Coding System Prompt (v2 with explainer) : r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/comments/1e39tvj/sonnet_35_coding_system_prompt_v2_with_explainer/)
- [Prompting Principle: Consistent Behavior has a Specific Cause](https://www.reddit.com/r/LocalLLaMA/comments/1blf768/prompting_principle_consistent_behavior_has_a/)
