---
source_url: "https://www.perplexity.ai/search/dde8df6a-93a1-4f9e-84f1-0cd96fcc0eae"
thread_uuid: "f6ee6510-d73c-4dfb-a695-5bd1c8570b37"
slug: "dde8df6a-93a1-4f9e-84f1-0cd96fcc0eae"
title: "why is my qwen2.5 coder have a max tokens of 128k when you said it's supposedely 32k? also can you use some term other than a singular adjective to describe the code quality of each parameter count? Simply saying 'superior', 'higher performance', 'enhanced' does not tell me what to expect. I'd like to know how well they perform with each other."
extracted_at: "2026-06-29T16:08:02.910Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# why is my qwen2.5 coder have a max tokens of 128k when you said it's supposedely 32k? also can you use some term other than a singular adjective to describe the code quality of each parameter count? Simply saying 'superior', 'higher performance', 'enhanced' does not tell me what to expect. I'd like to know how well they perform with each other.

Source: [Perplexity thread](https://www.perplexity.ai/search/dde8df6a-93a1-4f9e-84f1-0cd96fcc0eae)

## User

why is my qwen2.5 coder have a max tokens of 128k when you said it's supposedely 32k? also can you use some term other than a singular adjective to describe the code quality of each parameter count? Simply saying 'superior', 'higher performance', 'enhanced' does not tell me what to expect. I'd like to know how well they perform with each other.

## Assistant

The discrepancy in the maximum token limit for the Qwen2.5-Coder model arises from differences in model configurations and implementations. The Qwen2.5-Coder model, particularly the 32B version, is designed to support a context length of up to 128K tokens. However, certain configurations, such as those using the GGUF format, might limit this to 32,768 tokens. This limitation can be due to specific settings or optimizations in different deployment environments or frameworks.[1][2]

Regarding the performance of AI models with different parameter counts, simply describing them with adjectives like "superior" or "enhanced" does not provide a comprehensive understanding of their capabilities. Instead, performance should be evaluated based on several metrics:

- **Accuracy**: Measures how often the model's predictions are correct.
- **Perplexity**: Indicates how well a model predicts the next word in a sequence; lower scores are better.
- **F1 Score**: Combines precision and recall to evaluate the balance between them.
- **Human Evaluation**: Assesses qualities like fluency and coherence through human judgment.
- **Task-specific Benchmarks**: These include tests like HumanEval for coding tasks or MMLU for multitask language understanding.[3][9]

Models with more parameters generally have a higher capacity to learn from data, which can lead to better performance in complex tasks. However, they also require more computational resources and can be more challenging to manage. Therefore, evaluating models using a combination of these metrics provides a more nuanced understanding of their performance across different tasks and contexts.[3]

### Sources

- [bug: Wrong maximum context length for qwen2.5-coder #3714](https://github.com/janhq/jan/issues/3714)
  - Jan version v0.5.4 Describe the Bug Using qwen-2.5-coder-7b-instruct, Jan allows a maximum context length of 2048 tokens. However, both according to qwen's website as well as llama.cpp's output (mo...
- [Qwen/Qwen2.5-Coder-32B - Hugging Face](https://huggingface.co/Qwen/Qwen2.5-Coder-32B)
  - We’re on a journey to advance and democratize artificial intelligence through open source and open science.
- [AI parameters: Explaining their role in AI model performance](https://www.techtarget.com/searchenterpriseai/tip/The-role-of-AI-parameters-in-the-enterprise)
  - Learn about the role AI parameters play in the neural networks that power generative AI apps like ChatGPT. Hint to users: More is not always more.
- [Qwen2.5: A Party of Foundation Models! | Qwen](https://qwenlm.github.io/blog/qwen2.5/)
  - GITHUB HUGGING FACE MODELSCOPE DEMO DISCORD Introduction In the past three months since Qwen2’s release, numerous developers have built new models on the Qwen2 language models, providing us with valuable feedback. During this period, we have focused on creating smarter and more knowledgeable language models. Today, we are excited to introduce the latest addition to the Qwen family: Qwen2.5. We are announcing what might be the largest opensource release in history!
- [Qwen2.5 Instruct 72B: Quality, Performance & Price Analysis](https://artificialanalysis.ai/models/qwen2-5-72b-instruct)
  - Analysis of Alibaba's Qwen2.5 Instruct 72B and comparison to other AI models across key metrics including quality, price, performance (tokens per second & time to first token), context window & more.
- [Comparison of AI Models across Quality, Performance, Price](https://artificialanalysis.ai/models)
  - Comparison and analysis of AI models across key performance metrics including quality, price, output speed, latency, context window & others.
- [Qwen 2.5 Coder: A Guide With Examples - DataCamp](https://www.datacamp.com/tutorial/qwen-coder-2-5)
- [Qwen2 Technical Report - arXiv](https://arxiv.org/html/2407.10671v1)
- [A Comprehensive Comparison of All LLMs - AI-Pro.org](https://ai-pro.org/learn-ai/articles/a-comprehensive-comparison-of-all-llms/)
  - Discover the strengths and weaknesses of leading LLMs in this comprehensive comparison of all LLMs and find the perfect ideal for your needs!
- [Qwen 2.5 Coder 32B vs Claude 3.5 Sonnet: Am I doing something ...](https://www.reddit.com/r/LocalLLaMA/comments/1gtiq2r/qwen_25_coder_32b_vs_claude_35_sonnet_am_i_doing/)
  - Qwen 2.5 Coder 32B vs Claude 3.5 Sonnet: Am I doing something wrong?
