---
source_url: "https://www.perplexity.ai/search/9a7c8e50-1653-46a6-b8b9-dbef38b1da74"
thread_uuid: "9c28bc2e-1c4a-429d-9cb4-2e6e3acea08f"
slug: "9a7c8e50-1653-46a6-b8b9-dbef38b1da74"
title: "https://www.reddit.com/r/LocalLLaMA/comments/1c858ac/llama3_seems_to_get_stuck_in_loops_sometimes/
https://www.reddit.com/r/LocalLLaMA/comments/1c7dkxh/tutorial_how_to_make_llama3instruct_ggufs_less/
https://huggingface.co/QuantFactory/Meta-Llama-3-8B-Instruct-GGUF/discussions/1

Please explain how to fix the issue using these three sites"
extracted_at: "2026-06-29T16:07:56.379Z"
matched_keywords: []
export_suite: "identity"
entry_count: 2
provenance: perplexity-rest-api
---

# https://www.reddit.com/r/LocalLLaMA/comments/1c858ac/llama3_seems_to_get_stuck_in_loops_sometimes/
https://www.reddit.com/r/LocalLLaMA/comments/1c7dkxh/tutorial_how_to_make_llama3instruct_ggufs_less/
https://huggingface.co/QuantFactory/Meta-Llama-3-8B-Instruct-GGUF/discussions/1

Please explain how to fix the issue using these three sites

Source: [Perplexity thread](https://www.perplexity.ai/search/9a7c8e50-1653-46a6-b8b9-dbef38b1da74)

## User

https://www.reddit.com/r/LocalLLaMA/comments/1c858ac/llama3_seems_to_get_stuck_in_loops_sometimes/
https://www.reddit.com/r/LocalLLaMA/comments/1c7dkxh/tutorial_how_to_make_llama3instruct_ggufs_less/
https://huggingface.co/QuantFactory/Meta-Llama-3-8B-Instruct-GGUF/discussions/1

Please explain how to fix the issue using these three sites

## Assistant

To address the issue of Llama-3 models getting stuck in loops and not following instructions properly, there are a few steps you can take based on the discussions from the provided sources:

1. **Adjust the End-of-Sequence (EOS) Token**:
   - The problem often arises due to incorrect handling of stop tokens. Llama-3 models use two different stop tokens: `<|eot_id|>` and `<|end_of_text|>`. However, some implementations like `llama.cpp` only support one stop token at a time[2].
   - To fix this, you need to ensure that the correct EOS token is set in your model configuration. You can do this by editing the GGUF file to

### Sources

- [https://www.reddit.com/r/LocalLLaMA/comments/1c858ac/llama3_seems_to_get_stuck_in_loops_sometimes/](https://www.reddit.com/r/LocalLLaMA/comments/1c858ac/llama3_seems_to_get_stuck_in_loops_sometimes/)
- [https://www.reddit.com/r/LocalLLaMA/comments/1c7dkxh/tutorial_how_to_make_llama3instruct_ggufs_less/](https://www.reddit.com/r/LocalLLaMA/comments/1c7dkxh/tutorial_how_to_make_llama3instruct_ggufs_less/)
- [Meta-Llama-3-8B-Inst](https://huggingface.co/QuantFactory/Meta-Llama-3-8B-Inst)
- [Llama3 seems to get stuck in loops sometimes (using HuggingChat chat at least) and far from perfect at following directions in creative writing](https://www.reddit.com/r/LocalLLaMA/comments/1c858ac/llama3_seems_to_get_stuck_in_loops_sometimes/)
- [Tutorial: How to make Llama-3-Instruct GGUF's less chatty](https://www.reddit.com/r/LocalLLaMA/comments/1c7dkxh/tutorial_how_to_make_llama3instruct_ggufs_less/)

## User

EOS/BOS tokens for qwen2.5-coder?

## Assistant

For the Qwen2.5-Coder model, the configuration of Beginning-of-Sequence (BOS) and End-of-Sequence (EOS) tokens is somewhat non-standard and can lead to confusion. Here's a detailed explanation based on the provided information:

### **BOS Token**
- The Qwen models, including Qwen2.5-Coder, do not inherently require a `bos_token`. In the `tokenizer_config.json`, the `bos_token` is often set to `null` because these models do not prepend a control token to every input sequence by default. This is intentional and aligns with their design philosophy.[1][4]
- However, if a framework or application mandates a `bos_token`, it is recommended to set it to `

### Sources

- [Qwen/Qwen2-7B-Instruct · Why is "bos_token" - Hugging Face](https://huggingface.co/Qwen/Qwen2-7B-Instruct/discussions/15)
  - Why is the "bos_token": null, in tokenizer_config.json? I don't understand the reason for this line "bos_token": null, within tokenizer_config.json
- [Qwen2.5: A Party of Foundation Models! | Qwen](https://qwenlm.github.io/blog/qwen2.5/)
  - GITHUB HUGGING FACE MODELSCOPE DEMO DISCORD Introduction In the past three months since Qwen2’s release, numerous developers have built new models on the Qwen2 language models, providing us with valuable feedback. During this period, we have focused on creating smarter and more knowledgeable language models. Today, we are excited to introduce the latest addition to the Qwen family: Qwen2.5. We are announcing what might be the largest opensource release in history!
- [Qwen/Qwen2.5-Coder-7B - Hugging Face](https://huggingface.co/Qwen/Qwen2.5-Coder-7B)
  - We’re on a journey to advance and democratize artificial intelligence through open source and open science.
- [Qwen/Qwen2.5-Coder-7B-Instruct · I periodically encounter infinite ...](https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct/discussions/16)
  - I periodically encounter infinite generations in Qwen 2.5 7B Coder with FP8 quantization when feeding long texts around 20+k characters into the context.
- [Qwen/Qwen2.5-Coder-7B-Instruct - Hugging Face](https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct)
  - We’re on a journey to advance and democratize artificial intelligence through open source and open science.
- [Tokenizer config for Qwen 2.5 models · langfuse · Discussion #4205](https://github.com/orgs/langfuse/discussions/4205)
  - Hi, I am trying to register qwen-2.5-coder-32b-instruct with my langfuse project but am unclear what values to use for the Tokenizer and Token Configuration field. Under the hood I believe qwen use...
- [[Bug]: The eos_token of the Qwen 2.5 base model is inconsistent ...](https://github.com/QwenLM/Qwen2.5/issues/927)
  - Has this been raised before? I have checked the GitHub README. I have checked the Qwen documentation and cannot find an answer there. I have searched the issues and there is not a similar one. I co...
- [Qwen 2.5 Coder: A Guide With Examples - DataCamp](https://www.datacamp.com/tutorial/qwen-coder-2-5)
- [Qwen/Qwen2.5-Coder-7B - Demo - DeepInfra](https://deepinfra.com/Qwen/Qwen2.5-Coder-7B)
  - Qwen2.5-Coder-7B is a powerful code-specific large language model with 7.61 billion parameters. It's designed for code generation, reasoning, and fixing tasks. The model covers 92 programming languages and has been trained on 5.5 trillion tokens of data, including source code, text-code grounding, and synthetic data.. Try out API on the Web
- [QwenLM/Qwen2.5-Coder - GitHub](https://github.com/QwenLM/Qwen2.5-Coder/activity)
  - Qwen2.5-Coder is the code version of Qwen2.5, the large language model series developed by Qwen team, Alibaba Cloud. - Activity · QwenLM/Qwen2.5-Coder
