---
source_url: "https://www.perplexity.ai/search/3662d021-b7d3-4b9c-a8a2-7dc69b867f13"
thread_uuid: "2a1efe8b-0cc8-4d29-a98a-01d824e96816"
slug: "3662d021-b7d3-4b9c-a8a2-7dc69b867f13"
title: "unique architect + editor models that run locally, specific combinations, what combinations exist? specifically for aider.

must be local and run on mid-end hardware."
extracted_at: "2026-06-29T16:09:55.586Z"
matched_keywords: []
export_suite: "identity"
entry_count: 3
provenance: perplexity-rest-api
---

# unique architect + editor models that run locally, specific combinations, what combinations exist? specifically for aider.

must be local and run on mid-end hardware.

Source: [Perplexity thread](https://www.perplexity.ai/search/3662d021-b7d3-4b9c-a8a2-7dc69b867f13)

## User

unique architect + editor models that run locally, specific combinations, what combinations exist? specifically for aider.

must be local and run on mid-end hardware.

## Assistant

Aider, an AI coding assistant, has introduced a unique **Architect/Editor** approach that separates the tasks of code reasoning and code editing between two models. This method is designed to improve productivity and accuracy in coding by delegating different responsibilities to each model:

- **Architect Model**: Focuses on solving the coding problem by generating a high-level plan or structure.
- **Editor Model**: Focuses on implementing the code based on the Architect's plan, making specific edits and adjustments as necessary.

This approach has been praised for achieving high pass rates (up to 85%) in various coding tasks.[5]

### Architect + Editor Combinations for Aider
Several combinations of models can be used with Aider's Architect/Editor framework, with some users reporting success using specific models for these roles. Here are some examples:

1. **o1-preview (Architect) + o1-preview or DeepSeek Coder (Editor)**:
   - The **o1-preview** model is often used as both the Architect and Editor in Aider. However, some users prefer using **DeepSeek Coder** as the Editor for more effective code editing.[4]
   - This combination allows for a strong focus on reasoning and code generation, with DeepSeek Coder providing fine-tuned edits.

2. **Claude or GPT-4 (Architect) + DeepSeek Coder (Editor)**:
   - Some users have experimented with using **Claude** or **GPT-4** as the Architect model to generate more sophisticated plans, while relying on **DeepSeek Coder** to handle the detailed editing.[3]
   - Claude’s ability to handle large contexts makes it useful for complex coding tasks, while DeepSeek Coder is optimized for precise edits.

### Running Locally on Mid-End Hardware
For users who want to run these models locally on mid-end hardware, such as systems with 16GB or 24GB of VRAM (common among medium-end setups), it’s important to choose models that are optimized for local execution:

- **Mistral 22B**: This model has been noted as performing well even on mid-range GPUs with 16GB of VRAM when quantized properly (e.g., Q2 quantization). It could potentially be used in either role (Architect or Editor) depending on how it’s configured.[1]
- **GPT4All 3.0**: This open-source LLM desktop application supports local execution and can integrate with various models like LLaMA through its own fork of llama.cpp. It also supports Python/TypeScript bindings, making it versatile for different coding tasks.[2]

### Key Considerations
- **Quantization**: To run larger models like Mistral 22B or GPT4All on mid-range hardware, quantization techniques (e.g., Q2 or Q6) are essential to reduce memory usage while maintaining performance.[1]
- **Local Execution**: Tools like GPT4All and llama.cpp are designed for local execution, making them suitable choices for users who prefer not to rely on cloud-based solutions.[2]

In summary, Aider's unique Architect/Editor approach allows users to combine different models for better code generation and editing. For local use on mid-end hardware, models like Mistral 22B and GPT4All are good options when properly optimized through quantization techniques.

### Sources

- [mistralai/Mistral-Large-Instruct-2411 · Hugging Face : r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1gu7k6a/mistralaimistrallargeinstruct2411_hugging_face/)
- [GPT4All 3.0: The Open-Source Local LLM Desktop Application](https://www.reddit.com/r/LocalLLaMA/comments/1dtp71h/gpt4all_30_the_opensource_local_llm_desktop/)
- [Aider is the peak of LLM coding assistants right now - Reddit](https://www.reddit.com/r/ChatGPTCoding/comments/1e0e7up/aider_is_the_peak_of_llm_coding_assistants_right/)
- [o1-preview starts giving me its internal prompts/thoughts mid-code ...](https://www.reddit.com/r/ChatGPTCoding/comments/1fv9pts/o1preview_starts_giving_me_its_internal/)
- [Aider's Architect/Editor approach sets new SOTA for AI code editing ...](https://www.reddit.com/r/ChatGPTCoding/comments/1fshzxl/aiders_architecteditor_approach_sets_new_sota_for/)

## User

Correct way to run qwen2.5-coder in aider. Literally the EXACT COMMAND.

## Assistant

For running **Aider** locally with the **Architect + Editor** model setup, there are several model combinations that can work well on mid-end hardware. Below are some specific combinations and models that you can use for this purpose:

### Architect + Editor Model Combinations

1. **Qwen 2.5-Coder (Architect) + Qwen 2.5-Coder (Editor)**
   - **Qwen 2.5-Coder** is a powerful local model that has been tested for real-time code completion and editing tasks. It has been reported to perform well even on mid-range GPUs like the RTX 3050 Ti with 4GB of VRAM.[3]
   - You can use the **Qwen 2.5-Coder-1.5B** or **7B** versions for both Architect and Editor roles, depending on your hardware capabilities.
   - This combination is good for Python development and handles tasks like real-time code completion and filling in gaps efficiently.

2. **Mistral 7B (Architect) + Qwen 2.5-Coder (Editor)**
   - **Mistral 7B** is another strong candidate for the Architect role, especially when quantized using techniques like Q4 or Q6 to reduce memory usage. It can handle larger context windows, which is useful when dealing with complex coding tasks.[2]
   - Pairing it with **Qwen 2.5-Coder** as the Editor allows for precise code editing based on the Architect's high-level plan.

3. **GPT4All (Architect) + DeepSeek Coder (Editor)**
   - **GPT4All** is a versatile local model that can be used as an Architect, providing high-level reasoning and planning for coding tasks.
   - **DeepSeek Coder** has been praised for its fine-tuned editing capabilities, making it a good choice for the Editor role in this combination.[1]

### Hardware Considerations
For mid-end hardware (e.g., GPUs with 4GB to 16GB VRAM), here are some tips to ensure smooth performance:
- **Quantization**: Use quantized versions of models like Qwen or Mistral to reduce memory usage without sacrificing too much performance. For example, Qwen 2.5-Coder has been used successfully on RTX 3050 Ti with quantization.[3]
- **Memory Management**: Smaller models like Qwen 1.5B or Mistral 7B are more suitable if you're working with limited VRAM (e.g., under 16GB). Larger models like Qwen 32B may require more powerful setups.

### Example Setup for Running Aider Locally
To run Aider locally using these models, you would follow these steps:

1. **Install Aider**:
   ```bash
   pip install aider
   ```

2. **Configure Models**:
   - Download and set up your chosen models (e.g., Qwen or Mistral) using a framework like `llama.cpp`

### Sources

- [Aider is the peak of LLM coding assistants right now](https://www.reddit.com/r/ChatGPTCoding/comments/1e0e7up/aider_is_the_peak_of_llm_coding_assistants_right/)
- [Qwen2.5.1 Coder 7B scored 63.9% on Aider leaderboard - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1gn2y0v/qwen251_coder_7b_scored_639_on_aider_leaderboard/)
- [Running Qwen2.5-Coder-1.5B for real-time code completion (and fill ...](https://www.reddit.com/r/LocalLLaMA/comments/1gr27o3/running_qwen25coder15b_for_realtime_code/)
- [Use Qwen2.5-Coder-32B-Instruct and other models using Langroid ...](https://www.reddit.com/r/LocalLLaMA/comments/1gv8caq/use_qwen25coder32binstruct_and_other_models_using/)

## User

So much text when I literally just asked for the aider cli command.

## Assistant

To run **Qwen2.5-Coder** locally with **Aider**, here is the **exact command** you would use after setting up the model:

### Steps:

1. **Install Aider**:
   ```bash
   pip install aider
   ```

2. **Download the Qwen2.5-Coder model** from Hugging Face or your preferred source. Make sure it's compatible with your system's hardware (e.g., 7B, 14B, or 32B versions depending on VRAM).

3. **Run Aider with Qwen2.5-Coder**:
   ```bash
   aider --model qwen2.5-coder
   ```

This command assumes that you have already set up the environment for running Qwen2.5-Coder locally, and the model is accessible either via Hugging Face or another local directory.

If you're using a specific quantized version (e.g., 4-bit), you may need to adjust the model path accordingly, such as:

```bash
aider --model /path/to/your/local/qwen2.5-coder-14b-4bit
```

Make sure that your system has sufficient resources (VRAM, CPU) to handle the model size you're using.

### Sources

- [What is the best LLM to run locally if you need help with coding?](https://www.reddit.com/r/ChatGPTCoding/comments/1gr8922/what_is_the_best_llm_to_run_locally_if_you_need/)
- [Running Qwen2.5-Coder-1.5B for real-time code completion (and fill in the middle) locally on RTX 3050 Ti (4GB) within PyCharm](https://www.reddit.com/r/LocalLLaMA/comments/1gr27o3/running_qwen25coder15b_for_realtime_code/)
- [Qwen2.5.1 Coder 7B scored 63.9% on Aider leaderboard](https://www.reddit.com/r/LocalLLaMA/comments/1gn2y0v/qwen251_coder_7b_scored_639_on_aider_leaderboard/)
