---
source_url: "https://www.perplexity.ai/search/022e409d-f8e4-41a6-8be6-b95a32576770"
thread_uuid: "caf8c3ab-88f0-41c3-bb23-2c1546a354c2"
slug: "022e409d-f8e4-41a6-8be6-b95a32576770"
title: "in 2024, current best way to use the popular qwen 2.5 coder model, the one that features the function calling stuff that aider added in recent release?

all search queries should be under 7 words
at least 20 searches total
all searches diverse in nature for exhaustive research coverage.
all searches should contain the word 'aider' and 'qwen2.5-coder'.
aider is code generation tool/helper."
extracted_at: "2026-06-29T16:09:57.332Z"
matched_keywords: []
export_suite: "identity"
entry_count: 3
provenance: perplexity-rest-api
---

# in 2024, current best way to use the popular qwen 2.5 coder model, the one that features the function calling stuff that aider added in recent release?

all search queries should be under 7 words
at least 20 searches total
all searches diverse in nature for exhaustive research coverage.
all searches should contain the word 'aider' and 'qwen2.5-coder'.
aider is code generation tool/helper.

Source: [Perplexity thread](https://www.perplexity.ai/search/022e409d-f8e4-41a6-8be6-b95a32576770)

## User

in 2024, current best way to use the popular qwen 2.5 coder model, the one that features the function calling stuff that aider added in recent release?

all search queries should be under 7 words
at least 20 searches total
all searches diverse in nature for exhaustive research coverage.
all searches should contain the word 'aider' and 'qwen2.5-coder'.
aider is code generation tool/helper.

## Assistant

To use the Qwen2.5-Coder model effectively with Aider in 2024, especially with the added function calling features, here are the best practices and steps based on the latest information:

## **1. Model Selection and Setup**

Qwen2.5-Coder comes in various sizes, from 0.5B to 32B parameters, with both Base and Instruct variants. The **Instruct models** are pre-tuned for instruction-following tasks, making them ideal for integration with tools like Aider for code generation, reasoning, and repair tasks. The **Qwen2.5-Coder-32B-Instruct** model is currently the flagship version and offers state-of-the-art (SOTA) performance comparable to GPT-4o across multiple benchmarks like EvalPlus, LiveCodeBench, and Aider.[2][7]

### **Steps to Set Up Qwen2.5-Coder with Aider:**

1. **Install Aider**: First, ensure you have Aider installed on your machine. You can install it via pip:
   ```bash
   pip install aider
   ```

2. **Install Ollama**: For local usage of Qwen2.5-Coder models, Ollama is a popular tool that allows you to run large models efficiently on your hardware.
   ```bash
   ollama pull qwen2.5-coder:32b
   ```

3. **Configure Aider to Use Qwen2.5-Coder**: After installing the model locally via Ollama or other supported platforms (like MLX), configure Aider to use the Qwen2.5-Coder model by specifying it in the `.aider.model.settings.yml` file:
   ```yaml
   name: openai/Qwen/Qwen2.5-32B-Instruct
   max_tokens: 4096
   edit_format: whole
   ```
   This configuration ensures that Aider uses the correct model and format for code generation and editing tasks.

4. **Set API Key**: If using a hosted service or API (such as OpenRouter or Hyperbolic), ensure you set your API key in the environment variables or configuration file:
   ```bash
   export OLLAMA_API_BASE='https://api.your-service.com/v1'
   export OLLAMA_API_KEY='your_api_key'
   ```

## **2. Function Calling Feature**

The Qwen2.5-Coder models have been enhanced with advanced function calling capabilities, making them particularly useful for tasks where code needs to be generated or modified based on specific instructions. This feature is especially relevant when integrating with Aider, which focuses on code editing and generation.[1][6]

- **Fill-in-the-Middle (FIM)**: This technique is used extensively in Qwen2.5-Coder to predict missing parts of a code block, improving its ability to handle incomplete code snippets.[1]
  
- **Code Repair**: The 32B-Instruct model excels in code repair tasks, scoring 73.7 on the Aider benchmark. This makes it ideal for identifying and fixing bugs in existing codebases.[7][41]

### **How to Use Function Calling with Aider**:
1. **Invoke Functionality**: When using Aider for function calling tasks, simply specify the function you need in natural language:
   ```bash
   aider "Create a Python function that reads a CSV file and inserts data into an SQLite database."
   ```
   
2. **Multi-file Editing**: Aider supports multi-file editing with Qwen2.5-Coder, allowing you to refactor or generate complex projects spanning multiple files.[40]

3. **Error Correction**: If errors are detected in your code, Qwen2.5-Coder can assist in debugging and fixing them automatically using its advanced reasoning capabilities.[41]

## **3. Performance Considerations**

- **Model Size vs Performance**: While the 32B version offers the best performance across benchmarks like HumanEval and McEval, smaller versions like the 7B model also provide competitive performance while being more resource-efficient. The choice of model depends on your hardware capabilities and project requirements.[27][35]

- **Quantized Models**: If running locally on limited hardware (e.g., a MacBook Pro M2), you can use quantized versions of Qwen2.5-Coder (e.g., `q8_0` or `q5_k_m`) to reduce memory usage while maintaining decent performance.[21][26]

## **4. Practical Use Cases**

- **Auto-completion and Code Generation**: Qwen2.5-Coder integrates well with editors like VS Code through extensions like ContinueDev or Cursor. It can generate boilerplate code (e.g., CRUD operations), refactor existing codebases, or even assist in creating complex applications like games or web apps.[16][40]

- **Multi-language Support**: The model supports over 40 programming languages and excels at multi-language code repair tasks, making it highly versatile for developers working across different tech stacks.[7][41]

## **Conclusion**

In summary, integrating Qwen2.5-Coder with Aider provides a powerful setup for advanced coding tasks such as function calling, code generation, repair, and reasoning across multiple languages. The 32B-Instruct model delivers SOTA performance but requires substantial hardware resources unless using quantized versions via Ollama or similar tools.

For most developers, starting with a smaller model like 7B or using hosted services can offer a balance between performance and resource efficiency while still leveraging the advanced capabilities of Qwen2.5-Coder within Aider.

### Sources

- [Qwen2.5-Coder Technical Report - arXiv](https://arxiv.org/html/2409.12186v1)
- [Qwen2.5-Coder Series: Powerful, Diverse, Practical - Alibaba Cloud](https://www.alibabacloud.com/blog/qwen2-5-coder-series-powerful-diverse-practical_601765)
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/)
- [Here's how to use Qwen2.5 Coder API for Free ... - YouTube](https://www.youtube.com/watch?v=48RjMe-2l2A)
- [Aider - Featherless.ai](https://featherless.ai/docs/guides-aider)
- [Qwen2.5-Coder](https://qwen2.org/qwen2-5-coder/)
- [Qwen2.5-Coder-32B-Instruct](https://qwen2.org/qwen2-5-coder-32b-instruct/)
- [Qwen2.5-Coder-32B is an LLM that can code well that runs on my Mac](https://simonwillison.net/2024/Nov/12/qwen25-coder/)
- [Qwen/Qwen2.5-Coder-32B-Instruct - Hugging Face](https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct)
- [Qwen2.5-Coder Series: Powerful, Diverse, Practical. | Qwen](https://qwenlm.github.io/blog/qwen2.5-coder-family/)
- [Qwen-2.5 + Hyperbolic + ClaudeDev + Aider : This BEST & FREE AI ...](https://www.youtube.com/watch?v=uu-oag2IkvQ)
- [Qwen2.5-Coder-32B-Instruct](https://qwen2.org/qwen2-5-coder-32b-instruct/)
- [How to use Qwen2.5 Coder ? The best coding LLM - YouTube](https://www.youtube.com/watch?v=CittVqNVWIU)
- [Unable to use diff editing with local instsance of qwen2.5-coder-32b ...](https://github.com/Aider-AI/aider/issues/2371)
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/)
- [Qwen2.5-Coder-32B-Instruct](https://qwen2.org/qwen2-5-coder-32b-instruct/)
- [Aider + Qwen 2.5 Coder 32B vs Claude 3.5 Sonnet (NEW)! - YouTube](https://www.youtube.com/watch?v=rxnFnQHB4DE)
- [Qwen2.5-Coder Series: Powerful, Diverse, Practical. | Qwen](https://qwenlm.github.io/blog/qwen2.5-coder-family/)
- [QwenLM/Qwen2.5-Coder - GitHub](https://github.com/QwenLM/Qwen2.5-Coder/actions)
- [Qwen/Qwen2.5-Coder-14B-Instruct-GGUF - Hugging Face](https://huggingface.co/Qwen/Qwen2.5-Coder-14B-Instruct-GGUF)
- [Qwen2.5-Coder-32B is an LLM that can code well that runs on my Mac](https://simonwillison.net/2024/Nov/12/qwen25-coder/)
- [Qwen2.5-Coder-32B is an LLM that can code well that runs on my Mac](https://simonw.substack.com/p/qwen25-coder-32b-is-an-llm-that-can)
- [Qwen 2.5 Coder - 7B (Fully Tested): Can It Crush ... - YouTube](https://www.youtube.com/watch?v=x5hFKYjqmcE)
- [Qwen2.5-Coder Series: Powerful, Diverse, Practical - Alibaba Cloud](https://www.alibabacloud.com/blog/qwen2-5-coder-series-powerful-diverse-practical_601765)
- [Unable to use diff editing with local instsance of qwen2.5-coder-32b ...](https://github.com/Aider-AI/aider/issues/2371)
- [Qwen2.5-Coder-32B is an LLM that can code well that runs on my Mac](https://simonwillison.net/2024/Nov/12/qwen25-coder/)
- [Qwen2.5-Coder] LLM specialized for code generation, completion ...](https://ai-scholar.tech/en/articles/large-language-models/Qwen2.5-Coder)
- [[PDF] Qwen2.5-Coder Technical Report - arXiv](http://arxiv.org/pdf/2409.12186.pdf)
- [Aider + Qwen 2.5 Coder 32B vs Claude 3.5 Sonnet (NEW)! - YouTube](https://www.youtube.com/watch?v=rxnFnQHB4DE)
- [New Qwen Models On The Aider Leaderboard!!! : r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1gox2iv/new_qwen_models_on_the_aider_leaderboard/)
- [Qwen2.5-Coder-32B-Instruct](https://qwen2.org/qwen2-5-coder-32b-instruct/)
- [Qwen2.5-Coder-32B is an LLM that can code well that runs on my Mac](https://simonwillison.net/2024/Nov/12/qwen25-coder/)
- [Qwen2.5-Coder Series: Powerful, Diverse, Practical. | Qwen](https://qwenlm.github.io/blog/qwen2.5-coder-family/)
- [Aider + Qwen 2.5 Coder 32B vs Claude 3.5 Sonnet (NEW)! - YouTube](https://www.youtube.com/watch?v=rxnFnQHB4DE)
- [Qwen2.5-Coder Series: Powerful, Diverse, Practical - Alibaba Cloud](https://www.alibabacloud.com/blog/qwen2-5-coder-series-powerful-diverse-practical_601765)
- [Aider + Qwen 2.5 Coder : STOP PAYING for CURSOR with this Free ...](https://www.youtube.com/watch?v=Nb7YondQXiU)
- [Aider + Qwen 2.5 Coder 32B vs Claude 3.5 Sonnet (NEW)! - YouTube](https://www.youtube.com/watch?v=rxnFnQHB4DE)
- [Qwen-2.5 & Coder (Fully Tested) : The BEST Opensource LLMs or ...](https://www.youtube.com/watch?v=tdLZxwq0Jrg)
- [Qwen2.5-Coder 32B Instruct: A Best Coding Model-A Complete Step ...](https://generativeai.pub/qwen2-5-coder-32b-instruct-a-best-coding-model-a-complete-step-by-step-guide-and-performance-b8a33ec2547f?gi=683ec37e4925)
- [Qwen-2.5 + Hyperbolic + ClaudeDev + Aider : This BEST & FREE AI ...](https://www.youtube.com/watch?v=uu-oag2IkvQ)
- [Qwen2.5-Coder-32B-Instruct](https://qwen2.org/qwen2-5-coder-32b-instruct/)
- [Unable to use diff editing with local instsance of qwen2.5-coder-32b ...](https://github.com/Aider-AI/aider/issues/2371)
- [Error using Qwen2.5 32B through OpenRouter · Issue #2352 - GitHub](https://github.com/Aider-AI/aider/issues/2352)
- [This NEW AI Coding Model BEATS Claude 3.5 Sonnet!? - YouTube](https://www.youtube.com/watch?v=bJmx_fAOW78)
- [Qwen2.5-Coder Technical Report - arXiv](https://arxiv.org/html/2409.12186v1)
- [Qwen2.5-Coder Series: Powerful, Diverse, Practical - Alibaba Cloud](https://www.alibabacloud.com/blog/qwen2-5-coder-series-powerful-diverse-practical_601765)
- [This NEW AI Coding Model BEATS Claude 3.5 Sonnet!? - YouTube](https://www.youtube.com/watch?v=bJmx_fAOW78)
- [Qwen2.5-Coder 32B Instruct: A Best Coding Model-A Complete Step ...](https://generativeai.pub/qwen2-5-coder-32b-instruct-a-best-coding-model-a-complete-step-by-step-guide-and-performance-b8a33ec2547f?gi=683ec37e4925)
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/)
- [QwenLM/Qwen2.5-Coder - GitHub](https://github.com/QwenLM/Qwen2.5-Coder/actions)
- [Qwen2.5-Coder-32B-Instruct](https://qwen2.org/qwen2-5-coder-32b-instruct/)
- [The Powerful Open Source Code Model Qwen2.5-Coder is ... - AIbase](https://www.aibase.com/news/13176)
- [Qwen2.5-Coder-32B is an LLM that can code well that runs on my Mac](https://simonwillison.net/2024/Nov/12/qwen25-coder/)
- [Qwen 2.5 Coder - 7B (Fully Tested): Can It Crush ... - YouTube](https://www.youtube.com/watch?v=x5hFKYjqmcE)
- [Master Qwen2.5 Coder Artifacts like a PRO with Ollama ... - YouTube](https://www.youtube.com/watch?v=PnIY1Ure6Nc)
- [Aider + Qwen 2.5 Coder 32B vs Claude 3.5 Sonnet (NEW)! - YouTube](https://www.youtube.com/watch?v=rxnFnQHB4DE)
- [Qwen2.5-Coder](https://qwen2.org/qwen2-5-coder/)
- [Qwen2.5-Coder: Code More, Learn More! | Qwen](https://qwenlm.github.io/blog/qwen2.5-coder/)
- [Qwen2.5-Coder Technical Report - arXiv](https://arxiv.org/html/2409.12186v1)
- [[PDF] Qwen2.5-Coder Technical Report - arXiv](http://arxiv.org/pdf/2409.12186.pdf)
- [Qwen/Qwen2.5-Coder-32B-Instruct - Hugging Face](https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct)
- [Qwen2.5-Coder Series: Powerful, Diverse, Practical - Alibaba Cloud](https://www.alibabacloud.com/blog/qwen2-5-coder-series-powerful-diverse-practical_601765)
- [Qwen2.5-Coder: Code More, Learn More! | Qwen](https://qwenlm.github.io/blog/qwen2.5-coder/)
- [New Qwen Models On The Aider Leaderboard!!! : r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1gox2iv/new_qwen_models_on_the_aider_leaderboard/)
- [[PDF] Qwen2.5-Coder Technical Report - arXiv](http://arxiv.org/pdf/2409.12186.pdf)
- [Qwen2.5-Coder Technical Report - arXiv](https://arxiv.org/html/2409.12186v1)
- [Qwen2.5-Coder-32B is an LLM that can code well that runs on my Mac](https://simonwillison.net/2024/Nov/12/qwen25-coder/)
- [QwenLM/Qwen2.5-Coder - GitHub](https://github.com/QwenLM/Qwen2.5-Coder/actions)
- [Qwen2.5-Coder just changed the game for AI programming—and it's ...](https://venturebeat.com/ai/alibaba-new-ai-can-code-in-92-languages-and-its-completely-free/)
- [Qwen-2.5 Coder (32B) + Cursor + Aider: Beats Claude and GPT-4o?](https://aidisruptionpub.com/p/qwen-25-coder-32b-cursor-aider-beats)

## User

What's the recommended way to run qwen2.5-coder with aider? aider has a bunch of different ways to run models, for example you can run the 'architect' as one model, and the 'editor' model as another.

For this search, only find reddit examples.

## Assistant

Based on the Reddit discussions and user experiences, here are some key recommendations and insights for running **Qwen2.5-Coder** with **Aider**, particularly focusing on how to optimize its performance and handle common issues:

## **1. Model Selection and Setup**

- **Qwen2.5-Coder 32B** is recommended for tasks that require high coding accuracy and reasoning ability. However, users have noted issues with model performance when running locally, especially with limited hardware resources or specific settings.
  
- If you're running the model locally, using **Ollama** as the backend is common, but it comes with certain limitations, such as context window size and VRAM constraints. For example, a user running the **7B model** on an RTX 3060 Ti faced performance issues due to VRAM limits. In such cases, quantized versions of the model (e.g., Q4_K_M) might be more suitable, though they may still struggle with larger projects or complex prompts.[2]

## **2. Handling Context Window Limits**

- A significant challenge users face is the **context window limit**. Qwen2.5-Coder 32B has a large context window (up to 100k tokens), but some platforms like **OpenRouter** or **DeepInfra** do not always support the full context size. This can lead to issues where the model outputs gibberish or fails to follow prompts correctly after reaching a certain token threshold.[1]

- To mitigate this, users recommend clearing the context regularly or using a provider like **Hyperbolic**, which offers full context support for Qwen models. Additionally, setting up custom parameters for API calls (if using OpenRouter) can help ensure that the correct provider is used to maximize context size.[1]

## **3. Function Calling and Code Editing**

- One of the standout features of Qwen2.5-Coder is its ability to handle **function calling** and code editing tasks effectively. However, there are discrepancies in performance between local instances and cloud-based solutions:
  
  - When using Aider's **diff edit mode**, some users reported that local instances of Qwen2.5-Coder (especially when run via Ollama) failed to make direct file modifications as expected. In contrast, models run through OpenRouter performed better in this regard.[5]
  
  - If you're facing issues with local instances not adhering to Aider's instructions (e.g., adding unnecessary explanations), you can try appending specific instructions to your prompts, such as "Do not add ANY explanation of the proposed code changes". This workaround has been effective for some users but can be cumbersome if used frequently.[6]

## **4. Multi-model Setup (Architect + Editor)**

- A potentially powerful setup involves using different models for different roles within Aider:
  
  - Use a larger model like **Claude 3.5 Sonnet** or even a bigger version of Qwen (e.g., 72B) as an "architect" for reasoning-heavy tasks like project structuring or complex code generation.
  
  - Use Qwen2.5-Coder 32B as the "editor" for more focused tasks like function generation or bug fixing. This approach leverages the strengths of each model type—reasoning ability from larger models and coding precision from Qwen.[3]

## **5. Common Issues and Troubleshooting**

- Users have reported various issues when running Qwen2.5-Coder locally:
  
  - Some models fail to handle prompts correctly in certain environments like **Cline**, where they either produce irrelevant output or get stuck in loops.[4]
  
  - The performance of Qwen2.5-Coder can degrade significantly when handling large contexts (beyond 32k tokens), even though it theoretically supports much larger contexts.[3]

- To address these issues:
  
  - Ensure you're using the latest version of both Aider and Qwen2.5-Coder.
  
  - If running into persistent problems with local setups, consider switching to cloud-based providers like OpenRouter or Hyperbolic, which might offer better support for large contexts and diff edits.[5][1]

## **Conclusion**

The best way to run Qwen2.5-Coder with Aider depends on your hardware setup and specific use case:

- For local use with limited resources, opt for smaller or quantized versions of the model and regularly clear context to avoid gibberish output.
  
- For more complex projects requiring large contexts or advanced function calling, consider using cloud-based providers that support full context windows.

Finally, experimenting with a multi-model setup (e.g., using Claude as an architect and Qwen as an editor) can provide optimal results in real-world coding tasks.[3]

### Sources

- [Quen 2.5 Coder 32B Outputting Nonsense (Aider) : r/ChatGPTCoding](https://www.reddit.com/r/ChatGPTCoding/comments/1gr2tai/quen_25_coder_32b_outputting_nonsense_aider/)
- [Optimizing Qwen2.5-coder on RTX 3060 Ti with Limited VRAM](https://www.reddit.com/r/MLQuestions/comments/1gr0hof/optimizing_qwen25coder_on_rtx_3060_ti_with/)
- [Qwen 2.5 Coder 32B vs Claude 3.5 Sonnet: Am I doing something ...](https://www.reddit.com/r/LocalLLaMA/comments/1gtiq2r/qwen_25_coder_32b_vs_claude_35_sonnet_am_i_doing/)
- [Qwen 2.5 32B Coder doesn't handle the Cline prompt well ... - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1gpqhgu/qwen_25_32b_coder_doesnt_handle_the_cline_prompt/)
- [Unable to use diff editing with local instsance of qwen2.5-coder-32b-instruct · Issue #2371 · Aider-AI/aider](https://github.com/Aider-AI/aider/issues/2371)
- [[Question] Get Local (Qwen) LLMs to better conform to Aider's expectations · Issue #2027 · Aider-AI/aider](https://github.com/Aider-AI/aider/issues/2027)

## User

Best architect model specifically the architect for specifically aider, and best pairings with the editor model?

## Assistant

The **best architect model** for Aider, based on recent Reddit discussions and benchmarks, is **OpenAI’s o1-preview model**. This model excels at reasoning and problem-solving, making it a strong choice for the **architect role** in Aider's Architect/Editor setup. However, its ability to generate well-formatted code editing instructions is limited, which is why pairing it with an effective editor model is crucial.

### **Best Architect Model: OpenAI’s o1-preview**
- **Strengths**: 
  - Excellent at reasoning and understanding complex coding problems.
  - Provides detailed solutions that describe how to solve the problem.
  - Achieved the highest benchmark scores when paired with a suitable editor model.
  
- **Weaknesses**:
  - Not as proficient at generating specific code edits or handling file modifications directly.

### **Best Editor Pairings for o1-preview Architect**

1. **DeepSeek**:
   - **Performance**: DeepSeek has shown to be highly effective at turning the architect’s proposed solutions into precise code edits.
   - **Use Case**: It is particularly useful when you need to apply changes across multiple files or handle complex refactorings.
   - **Benchmark Results**: Pairing o1-preview with DeepSeek achieved the highest score (85%) on Aider’s code editing benchmark.[1][3]

2. **o1-mini**:
   - **Performance**: While not as powerful as DeepSeek, o1-mini is still a strong editor model that works well within Aider’s two-model system.
   - **Use Case**: It provides a good balance between speed and accuracy, making it suitable for interactive coding sessions where latency matters.
   - **Benchmark Results**: Pairing o1-preview with o1-mini also produced high benchmark scores, though slightly lower than the DeepSeek combination.[3]

3. **Claude 3.5 Sonnet**:
   - **Performance**: Claude 3.5 Sonnet performs well both as an architect and an editor. When used as an editor, it translates the architect’s solutions into well-formatted code edits efficiently.
   - **Use Case**: It offers a practical balance between reasoning ability and code generation speed, making it ideal for users who prefer a single provider (Anthropic) for both roles.
   - **Benchmark Results**: Pairing o1-preview with Claude 3.5 Sonnet as the editor achieved excellent results, second only to the DeepSeek pairing.[2][3]

### **Alternative Architect/Editor Configurations**

- **GPT-4o (OpenAI)**:
  - Can be used both as an architect and an editor. While not as strong in reasoning as o1-preview, it still provides solid performance in both roles when paired with itself or other models like Sonnet.[1][2]
  
- **Claude 3.5 Sonnet (Anthropic)**:
  - Can also be used in both roles effectively. When paired with itself (as both architect and editor), it provides a fast and accurate solution for many coding tasks.[4][2]

### **Summary of Best Architect/Editor Pairings**
| Architect Model    | Editor Model         | Performance/Use Case                                  |
|--------------------|----------------------|------------------------------------------------------|
| OpenAI’s o1-preview | DeepSeek             | Highest benchmark score (85%), best for complex edits |
| OpenAI’s o1-preview | o1-mini              | Good balance of speed and accuracy                    |
| OpenAI’s o1-preview | Claude 3.5 Sonnet    | Practical balance of performance and speed            |
| Claude 3.5 Sonnet  | Claude 3.5 Sonnet     | Effective in both roles, fast and reliable            |
| GPT-4o             | GPT-4o               | Solid performance in both roles                      |

For most users looking to maximize accuracy and performance in Aider's Architect/Editor setup, pairing OpenAI’s **o1-preview as the architect** with either **DeepSeek** or **Claude 3.5 Sonnet as the editor** offers the best results.

### Sources

- [Separating code reasoning and editing | aider](https://aider.chat/2024/09/26/architect.html)
- [Chat modes - Aider](https://aider.chat/docs/usage/modes.html)
- [Aider Implements New Architect/Editor Approach for AI-Assisted Coding](https://generaitelabs.com/aider-implements-new-architect-editor-approach-for-ai-assisted-coding/)
- [AI Coding with Aider Architect, Cursor and AI Agents. (Plans for o1 ...](https://www.topview.ai/blog/detail/ai-coding-with-aider-architect-cursor-and-ai-agents-plans-for-o1-based-engineering)
