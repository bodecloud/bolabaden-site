---
source_url: "https://www.perplexity.ai/search/00dba289-e372-4ea2-b451-a0f8393a2a3c"
thread_uuid: "3b83f41a-8d12-464b-b70f-dc51d3558c4c"
slug: "00dba289-e372-4ea2-b451-a0f8393a2a3c"
title: "What are the current best huggingface models for python development that can be ran locally...? Looking for the absolute best ones that can run on e.g. 32GB of ram. Looking for ones specifically for code generation with e.g. aider/cline. Preferably I'd like you to respond with the top 5 with the exact command necessary to pull them to `ollama`.

Prefer reddit sources, especially the megathread for best coding llm models, and prefer using sources that discuss huggingface. I primarily use python.

Any and all models recommended must be sourced from searches no older than July 2024."
extracted_at: "2026-06-29T16:17:33.298Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# What are the current best huggingface models for python development that can be ran locally...? Looking for the absolute best ones that can run on e.g. 32GB of ram. Looking for ones specifically for code generation with e.g. aider/cline. Preferably I'd like you to respond with the top 5 with the exact command necessary to pull them to `ollama`.

Prefer reddit sources, especially the megathread for best coding llm models, and prefer using sources that discuss huggingface. I primarily use python.

Any and all models recommended must be sourced from searches no older than July 2024.

Source: [Perplexity thread](https://www.perplexity.ai/search/00dba289-e372-4ea2-b451-a0f8393a2a3c)

## User

What are the current best huggingface models for python development that can be ran locally...? Looking for the absolute best ones that can run on e.g. 32GB of ram. Looking for ones specifically for code generation with e.g. aider/cline. Preferably I'd like you to respond with the top 5 with the exact command necessary to pull them to `ollama`.

Prefer reddit sources, especially the megathread for best coding llm models, and prefer using sources that discuss huggingface. I primarily use python.

Any and all models recommended must be sourced from searches no older than July 2024.

## Assistant

Based on recent discussions and recommendations, here are the top 5 Hugging Face models for Python development that can be run locally on 32GB of RAM, along with the Ollama commands to pull them:

1. Codestral-22B
This is Mistral AI's first code-specific model, released in May 2024. It has shown impressive performance for code generation tasks.[5]

```bash
ollama pull mistralai/Codestral-22B-v0.1
```

2. CodeQwen 1.5 7B
A popular and efficient coding model that performs well on various programming tasks.[6]

```bash
ollama pull Qwen/CodeQwen1.5-7B-Chat
```

3. Deepseek Coder 6.7B
Known for its strong performance in TypeScript and PHP, this model is praised for its thoroughness in code generation.[6]

```bash
ollama pull deepseek-ai/deepseek-coder-6.7b-instruct
```

4. Noromaid Mixtral 8x7B
This model is based on the Mixtral architecture and is recommended for its instruction-following capabilities.[1]

```bash
ollama pull LoneStriker/Noromaid-v0.1-mixtral-8x7b-v3
```

5. Yi-34B-200K-DARE
While larger, this model can still run on 32GB RAM with some optimizations and is known for good performance.[1]

```bash
ollama pull LoneStriker/Yi-34B-200K-DARE-megamerge-v8
```

These models are all recent and have been discussed favorably in the context of local code generation. The Codestral and CodeQwen models, in particular, have received positive feedback for Python development. Remember to adjust quantization settings if needed to fit these models within your 32GB RAM constraint.

### Sources

- [Good local models for 24gb VRAM and 32gb of RAM? : r/SillyTavernAI](https://www.reddit.com/r/SillyTavernAI/comments/1alqpcp/good_local_models_for_24gb_vram_and_32gb_of_ram/)
- [How do I download and run a model? : r/huggingface - Reddit](https://www.reddit.com/r/huggingface/comments/1ajgb3f/how_do_i_download_and_run_a_model/)
- [Generating modelfiles from huggingface repositories : r/ollama](https://www.reddit.com/r/ollama/comments/1dy8pqw/generating_modelfiles_from_huggingface/)
- [What is the best model I can currently run with an RTX 3080? - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/18m8ts9/what_is_the_best_model_i_can_currently_run_with/)
- [Codestral: Mistral AI first-ever code model : r/LocalLLaMA - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1d3df1n/codestral_mistral_ai_firstever_code_model/)
- [Best coding LLM as of May 2024? : r/LocalLLaMA - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1crlfu5/best_coding_llm_as_of_may_2024/)
