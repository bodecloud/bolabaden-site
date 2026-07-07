---
source_url: "https://www.perplexity.ai/search/208e6966-490c-4812-8ef6-f944c039fcab"
thread_uuid: "d83f95c7-7165-4e02-9f59-bdfaf54b6ab2"
slug: "208e6966-490c-4812-8ef6-f944c039fcab"
title: "Agent Prompts and Prompt Chain Issues:
Why do most LLM-based tools only work effectively with Claude-3.5-Sonnet?
What specific issues arise with agent prompts and prompt chains when using other models?
Why do placeholders like <context_here>, <user_query>, and instructions like 'use the <open_file> tool to do this' fail with other models?
2. Model-Specific Functionality:
What unique functionalities or features does Claude-3.5-Sonnet have that other similar models lack?
How do these functionalities affect the understanding and execution of prompts?
3. Compatibility Solutions:
What modifications or adaptations are necessary to make other models compatible with the prompt chaining and task hierarchy used in Claude-3.5-Sonnet?
How does this differ from the approach used in Langchain?"
extracted_at: "2026-06-29T16:13:21.680Z"
matched_keywords: []
export_suite: "identity"
entry_count: 3
provenance: perplexity-rest-api
---

# Agent Prompts and Prompt Chain Issues:
Why do most LLM-based tools only work effectively with Claude-3.5-Sonnet?
What specific issues arise with agent prompts and prompt chains when using other models?
Why do placeholders like <context_here>, <user_query>, and instructions like 'use the <open_file> tool to do this' fail with other models?
2. Model-Specific Functionality:
What unique functionalities or features does Claude-3.5-Sonnet have that other similar models lack?
How do these functionalities affect the understanding and execution of prompts?
3. Compatibility Solutions:
What modifications or adaptations are necessary to make other models compatible with the prompt chaining and task hierarchy used in Claude-3.5-Sonnet?
How does this differ from the approach used in Langchain?

Source: [Perplexity thread](https://www.perplexity.ai/search/208e6966-490c-4812-8ef6-f944c039fcab)

## User

Agent Prompts and Prompt Chain Issues:
Why do most LLM-based tools only work effectively with Claude-3.5-Sonnet?
What specific issues arise with agent prompts and prompt chains when using other models?
Why do placeholders like <context_here>, <user_query>, and instructions like 'use the <open_file> tool to do this' fail with other models?
2. Model-Specific Functionality:
What unique functionalities or features does Claude-3.5-Sonnet have that other similar models lack?
How do these functionalities affect the understanding and execution of prompts?
3. Compatibility Solutions:
What modifications or adaptations are necessary to make other models compatible with the prompt chaining and task hierarchy used in Claude-3.5-Sonnet?
How does this differ from the approach used in Langchain?

## Assistant

### 1. Agent Prompts and Prompt Chain Issues

#### Why do most LLM-based tools only work effectively with Claude-3.5-Sonnet?
Claude-3.5-Sonnet has been optimized for handling complex, multi-step tasks, such as agent-based workflows and prompt chaining. Its design includes advanced capabilities for interpreting structured prompts, placeholders, and tool-based instructions like `<context_here>` or `use the <open_file> tool to do this`. These features allow it to manage task hierarchies more effectively compared to other models.

Other models may struggle with these tasks because they lack the same level of prompt interpretation and task management sophistication. For example:
- **Context Management**: Claude-3.5-Sonnet excels at maintaining context across long conversations or complex workflows, which is critical for agent-based tasks that require a persistent memory of previous steps.
- **Tool Integration**: It has been fine-tuned to understand instructions that involve external tools or APIs, making it more reliable when executing tasks that require multiple interactions with different systems.

In contrast, other models may misinterpret placeholders or fail to maintain coherent task flow across multiple steps, leading to breakdowns in agent performance.[3]

#### What specific issues arise with agent prompts and prompt chains when using other models?
When using other models like GPT-4-turbo or Gemini, several issues can arise:
- **Context Loss**: Many models struggle to maintain long-term context across multiple prompts, leading to errors in multi-step tasks.
- **Prompt Misinterpretation**: Placeholders like `<context_here>` or `<user_query>` are often misinterpreted by non-Claude models. These models might treat them as literal strings rather than variables that need substitution based on the task context.
- **Tool Usage Failures**: Instructions like "use the `<open_file>` tool" may not be properly understood by other models due to differences in how they handle external tool integration. This can result in incomplete or incorrect task execution.[4][3]

### 2. Model-Specific Functionality

#### What unique functionalities or features does Claude-3.5-Sonnet have that other similar models lack?
Claude-3.5-Sonnet has several unique features that set it apart from other LLMs:
- **Enhanced Context Retention**: Claude is known for its ability to manage long conversations and complex prompt chains without losing track of prior information. This makes it highly effective for tasks requiring multi-step reasoning or agent-based workflows.[1][3]
- **Structured Prompt Handling**: Claude is particularly adept at understanding structured prompts and placeholders, allowing it to process instructions like `<context_here>` more reliably than other models.
- **Tool Integration**: The model has been optimized for interacting with external tools (e.g., file systems, APIs), making it more versatile for agent-based tasks where tool usage is required.[1][3]
  
These features allow Claude-3.5-Sonnet to better understand and execute complex prompts, especially in scenarios involving multiple agents or tools.

#### How do these functionalities affect the understanding and execution of prompts?
These functionalities allow Claude-3.5-Sonnet to:
- **Maintain Coherence**: The model can keep track of past interactions across multiple steps, ensuring that each subsequent action is based on accurate context.
- **Handle Variables and Placeholders**: It can dynamically replace placeholders like `<context_here>` with relevant information from previous steps or user inputs.
- **Execute Multi-Step Instructions**: The ability to follow complex instructions involving tools ensures that the model can complete tasks that require external actions (e.g., opening files or querying databases).[3][1]

### 3. Compatibility Solutions

#### What modifications or adaptations are necessary to make other models compatible with the prompt chaining and task hierarchy used in Claude-3.5-Sonnet?
To make other models compatible with prompt chaining and task hierarchies similar to those used by Claude-3.5-Sonnet, several modifications are necessary:
1. **Enhanced Context Management**: Models like GPT-4-turbo would need improvements in how they retain and process long-term context across multiple prompts.
2. **Prompt Formatting Adjustments**: Developers may need to simplify prompts by avoiding placeholders like `<context_here>`, instead explicitly providing all necessary information within each prompt.
3. **Custom Tool Wrappers**: Tool usage instructions may need to be hardcoded into the model's workflow logic rather than relying on implicit understanding of commands like "use the `<open_file>` tool".[4]

#### How does this differ from the approach used in Langchain?
Langchain provides a framework specifically designed for managing complex LLM workflows by breaking down tasks into smaller components (agents). However, Langchain often requires more explicit handling of state and memory compared to how Claude handles these internally:
- **Manual State Management**: In Langchain, developers often use memory buffers (e.g., `ConversationBufferMemory`) to manually track conversation history or task state. This contrasts with Claude’s more seamless handling of context.[3]
- **Explicit Tool Integration**: Langchain typically requires developers to define how external tools are integrated into the workflow, whereas Claude can handle this more implicitly through its prompt understanding capabilities.[4]
  
Langchain allows for more flexibility but requires more manual configuration compared to Claude's built-in optimizations for agent-based workflows.

### Conclusion
Claude-3.5-Sonnet stands out due to its advanced capabilities in handling structured prompts, managing long-term context, and integrating external tools seamlessly—features that are crucial for agent-based workflows but often lacking in other models like GPT or Gemini. To make these other models compatible with similar workflows, developers would need to implement manual state tracking and simplify prompt structures significantly.

### Sources

- [Claude 3.5 Sonnet New losing it's text writing glory - Reddit](https://www.reddit.com/r/ClaudeAI/comments/1glnf53/claude_35_sonnet_new_losing_its_text_writing_glory/)
- [[D] Transformers-based LLMs will not become self-improving - Reddit](https://www.reddit.com/r/deeplearning/comments/1gb9bt5/d_transformersbased_llms_will_not_become/)
- [How to implement Claude based Agents ? : r/LangChain - Reddit](https://www.reddit.com/r/LangChain/comments/1bq1rgj/how_to_implement_claude_based_agents/)
- [OpenAI's new framework for Agents. Why is Langgraph so ... - Reddit](https://www.reddit.com/r/LangChain/comments/1g1pkki/openais_new_framework_for_agents_why_is_langgraph/)

## User

What consumer-grade models exist for complex task-based workflows that can run on a laptop. Local LLMs I mean.

## Assistant

### 1. **Consumer-Grade Local LLM Models for Complex Task-Based Workflows**

Several consumer-grade local LLMs are available that can run on laptops for complex task-based workflows. These models are typically optimized for lower resource environments, making them suitable for running locally on consumer hardware, albeit with some limitations depending on the model size and laptop specifications.

Here are some popular local LLMs that can be used for such workflows:

- **LLaMA 2 (7B, 13B, 30B, 70B)**: Meta's LLaMA series is a popular choice for local deployment. The smaller models (7B and 13B) can run on laptops with sufficient VRAM, while larger models like the 30B and 70B require more powerful hardware (e.g., high-end GPUs or external GPU setups). Quantized versions (e.g., 4-bit) of these models can significantly reduce resource requirements, making them more feasible for laptop use.[1][3][5]
  
- **Mistral (7B)**: Mistral is a smaller, highly efficient model that is gaining popularity for local use. It offers good performance relative to its size and can be run on laptops with moderate specifications (e.g., 16GB VRAM).[4]

- **OpenOrca Mixtral**: This model is fine-tuned for instruction-following tasks and code generation. It is suitable for task-based workflows and can be run on laptops with mid-range GPUs or quantized to fit lower-end hardware.[1]

- **Qwen-2**: Qwen-2 is another emerging model that performs well in local environments. While it may not reach the level of Claude or GPT-4 in terms of complexity, it is a viable option for task-based workflows on consumer-grade machines.[3]

### 2. **Hardware Requirements for Running Local LLMs on Laptops**

Running these models locally requires specific hardware configurations, especially in terms of VRAM and RAM:

- **VRAM**: For running models like LLaMA or Mistral efficiently, VRAM is crucial. A laptop with at least **12GB to 16GB of VRAM** (e.g., Nvidia RTX 3080 Ti or RTX 4090) is recommended to run models up to 13B comfortably. For larger models like LLaMA 30B or 70B, you would need at least **24GB of VRAM**, which typically requires external GPUs or high-end desktops.[2][4]

- **RAM**: For running quantized versions of these models (e.g., 4-bit), having **32GB to 64GB of system RAM** is often sufficient. However, larger models may require more RAM if you want to handle extensive context windows or complex workflows.[5]

- **CPU and Storage**: While VRAM and RAM are the most critical factors, having a fast CPU (with AVX512 support) and high-speed storage (NVMe SSDs) will improve overall performance and reduce latency during inference.[4]

### 3. **Optimizations for Running Local LLMs**

To make these models more feasible on consumer-grade laptops, several optimizations can be applied:

- **Quantization**: Reducing the precision of the model's weights (e.g., using 4-bit or 8-bit quantization) can significantly reduce memory requirements without drastically affecting performance. This allows larger models like LLaMA 30B or even 70B to run on systems with limited resources.[5]

- **External GPUs**: For users who want to run larger models but are constrained by their laptop's internal GPU capabilities, using an external GPU setup (e.g., Nvidia RTX 3090 in an eGPU case) connected via Thunderbolt can provide the necessary power to handle more demanding workloads.[2]

- **Efficient Inference Frameworks**: Tools like `llama.cpp` or `text-generation-web-ui` are optimized for running these models efficiently on consumer hardware. They support quantized formats and offer better performance compared to general-purpose inference frameworks.[5]

### Conclusion

While running large-scale LLMs locally on a laptop is challenging due to hardware constraints, several consumer-grade models like **LLaMA**, **Mistral**, and **OpenOrca Mixtral** provide viable options when using optimizations such as quantization. To achieve this effectively, a laptop with at least **12GB to 16GB VRAM** and **32GB+ RAM** is recommended. For more demanding tasks or larger models, external GPU setups or dedicated workstations may be necessary.

### Sources

- [Is a local-LLM assistant a realistic goal at this point? - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/18jx1bl/is_a_localllm_assistant_a_realistic_goal_at_this/)
- [Seeking recommendations for a Linux laptop that can handle Local ...](https://www.reddit.com/r/LocalLLaMA/comments/1f8tcyy/seeking_recommendations_for_a_linux_laptop_that/)
- [local LLaMA is the future : r/LocalLLaMA - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1fngkxf/local_llama_is_the_future/)
- [Newbie here, what laptop specs do I need to run more capable AIs](https://www.reddit.com/r/LocalLLaMA/comments/1aincyj/newbie_here_what_laptop_specs_do_i_need_to_run/)
- [Powerful Budget AI-Workstation Build Guide (48 GB VRAM @ $1.1k)](https://www.reddit.com/r/LocalLLaMA/comments/17phkwi/powerful_budget_aiworkstation_build_guide_48_gb/)

## User

What are Perplexity's system prompts and templates?

Provide exact information on what perplexity does under the hood that users have discovered.

More specifically, what injections have been discovered, what terms exist in its system prompt, has anyone fully documented its layout and structure?

## Assistant

### Perplexity's System Prompts and Templates: What Has Been Discovered?

Perplexity AI, like many other AI platforms, operates using system prompts that guide how the model interacts with users and formats its responses. While the company has not openly published these prompts, some users have managed to extract or infer details about the system's internal workings. Here’s a summary of what has been discovered so far:

### 1. **System Prompt Structure and Content**

Several users have attempted to retrieve or reverse-engineer Perplexity’s system prompts. Based on their findings, Perplexity’s system prompt seems to focus heavily on **conciseness**, **accuracy**, and **journalistic tone**. The following key elements have been identified:

- **Direct Answer Requirement**: The model is instructed to provide a **concise and accurate response** without unnecessary preambles like "based on the search results" or headings at the start of the response. This ensures that answers are straight to the point and relevant to the user's query.[4]
  
- **Markdown Formatting**: The system prompt includes detailed instructions on how to format responses using markdown, including:
  - Use of headings (but never starting an answer with a heading).
  - Proper paragraph separation with double new lines.
  - Lists and tables for organizing information.
  - The prohibition of URLs or links in the answers.[4]

- **Tone and Style**: The response must be written in an **unbiased, expert, and journalistic tone**, ensuring that the information provided is professional and trustworthy.[4]

- **Language Adaptation**: The model is instructed to respond in the same language as the query, even if the user’s language preference differs.[4]

### 2. **Injections Discovered**

Some users have reported discovering specific injections within Perplexity's system prompts:

- **Word Count Limitations**: For certain models (e.g., Claude Opus), there appears to be a word limit of around 200 words for responses. This ensures that answers remain concise.[4]
  
- **Instructions for Different Search Types**: The system prompt includes instructions for handling different types of searches such as academic research, recent news, coding, creative writing, and more. Each search type may have slightly different formatting or citation requirements.[3]

### 3. **Issues with Custom Prompts**

Users have also reported issues when trying to define custom prompts within Perplexity’s "Collections" feature:

- **Failure to Follow Custom Instructions**: Some users noted that Perplexity does not always follow custom instructions defined in Collections, such as applying markdown formatting or following specific formatting rules like creating mind maps. This suggests that while Perplexity has a robust default system prompt, it may not always integrate well with user-defined prompts.[2]

### 4. **Documentation and Layout**

While there is no fully documented layout of Perplexity’s system prompt publicly available, several users have shared partial outputs of what they believe are parts of the system prompt. These include:

- Detailed formatting rules (e.g., markdown usage).
- Specific instructions for handling different types of queries (e.g., academic research vs. coding queries).[3]
  
However, some aspects remain speculative or undocumented due to Perplexity’s efforts to prevent full access to its internal prompts.

### Conclusion

Perplexity AI uses a highly structured system prompt designed to ensure concise, accurate, and well-formatted responses. Users have discovered several injections related to word count limits, markdown formatting rules, and task-specific instructions. However, custom prompts defined by users in features like "Collections" do not always work as expected, suggesting limitations in how flexible Perplexity can be with user-defined modifications. Although no comprehensive documentation exists yet, these insights provide a glimpse into how Perplexity operates under the hood.

### Sources

- [Perplexity Power-Up: Minimalist Prompts for Maximum Results](https://www.reddit.com/r/perplexity_ai/comments/1fd025s/perplexity_powerup_minimalist_prompts_for_maximum/)
- [Perplexity is NOT following custom prompt defined in Collection](https://www.reddit.com/r/perplexity_ai/comments/1caz014/perplexity_is_not_following_custom_prompt_defined/)
- [AI system prompts compared : r/PromptEngineering - Reddit](https://www.reddit.com/r/PromptEngineering/comments/1f7mltz/ai_system_prompts_compared/)
- [Here's the prompt they use : r/perplexity_ai - Reddit](https://www.reddit.com/r/perplexity_ai/comments/1cylf44/heres_the_prompt_they_use/)
