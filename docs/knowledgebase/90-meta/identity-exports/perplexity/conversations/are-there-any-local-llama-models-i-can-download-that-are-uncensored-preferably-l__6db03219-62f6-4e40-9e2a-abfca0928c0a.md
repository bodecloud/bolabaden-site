---
source_url: "https://www.perplexity.ai/search/cabe5e1b-312d-4e63-ae54-981c5164e20d"
thread_uuid: "6db03219-62f6-4e40-9e2a-abfca0928c0a"
slug: "cabe5e1b-312d-4e63-ae54-981c5164e20d"
title: "are there any local llama models I can download that are uncensored? preferably llama 3.2? if so provide instructions on how to get it for ollama"
extracted_at: "2026-06-29T16:18:38.065Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# are there any local llama models I can download that are uncensored? preferably llama 3.2? if so provide instructions on how to get it for ollama

Source: [Perplexity thread](https://www.perplexity.ai/search/cabe5e1b-312d-4e63-ae54-981c5164e20d)

## User

are there any local llama models I can download that are uncensored? preferably llama 3.2? if so provide instructions on how to get it for ollama

## Assistant

There are some uncensored Llama 3.2 models available that can be run locally using Ollama. Here are instructions to download and use one:

1. First, ensure you have Ollama installed on your system. You can download it from ollama.com if needed.

2. Open a terminal and run the following command to download an uncensored Llama 3.2 3B model:

```
ollama pull anshuman852/mradermacher-llama-3.2-3b-instruct-uncensored
```

This will download the uncensored 3B parameter version of Llama 3.2.[6]

3. Once downloaded, you can run the model using:

```
ollama run anshuman852/mradermacher-llama-3.2-3b-instruct-uncensored
```

4. The model should now be ready to use without typical content restrictions.[6]

Keep in mind that uncensored models may generate content that some may find inappropriate or offensive. Use responsibly and at your own discretion. Also note that while this model aims to be uncensored, its exact capabilities may vary.

For a smaller 1B parameter uncensored model, you could try:

```
ollama pull huihui-ai/llama-3.2-1b-instruct-abliterated
```

These models use techniques like abliteration to remove built-in refusal mechanisms. Always verify the model's behavior meets your specific needs.[1][3]

### Sources

- [Uncensored Llama 3.2 1B & 3B Models: Run Locally on iOS/macOS](https://privatellm.app/blog/uncensored-llama-3-2-1b-3b-models-run-locally-ios-macos)
- [Releases · ollama/ollama - GitHub](https://github.com/ollama/ollama/releases)
- [New Model: Lexi Llama-3-8B-Uncensored : r/LocalLLaMA - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1cbhqzk/new_model_lexi_llama38buncensored/)
- [How to Download Llama 3 Models (8 Easy Ways to access Llama-3)!!!!](https://www.youtube.com/watch?v=KyrYOKamwOk)
- [ollama/ollama: Get up and running with Llama 3.2, Mistral ... - GitHub](https://github.com/ollama/ollama/actions/runs/9434394084/job/25986453703)
- [anshuman852/mradermacher-llama-3.2-3b-instruct-uncensored:q4_k](https://ollama.com/anshuman852/mradermacher-llama-3.2-3b-instruct-uncensored:q4_k)
- [Llama 3.2 goes small and multimodal · Ollama Blog](https://ollama.com/blog/llama3.2)
- [Download and Run Ollama (Llama 3 model and more) Locally](https://www.youtube.com/watch?v=WxIuFptuT80)
- [How to Install and test LLaMA 3 Locally [2024] - YouTube](https://www.youtube.com/watch?v=yz-Go4g3FLI)
- [How to Install Ollama and Run LLama 3.2 Model - YouTube](https://www.youtube.com/watch?v=V0Ae6UEKFls)
- [Jumping into AI: How to Uncensor Llama 3.2 : r/ollama - Reddit](https://www.reddit.com/r/ollama/comments/1fut5hr/jumping_into_ai_how_to_uncensor_llama_32/)
- [Download Llama 3.2 1B Instruct | [Download The New Model Here!]](https://llamaimodel.com/1b/)
- [anshuman852/mradermacher-llama-3.2-3b-instruct-uncensored](https://ollama.com/anshuman852/mradermacher-llama-3.2-3b-instruct-uncensored)
- [Run AI On YOUR Computer: NEW Llama 3.2 - Tutorial | HackerNoon](https://hackernoon.com/run-ai-on-your-computer-new-llama-32-tutorial)
- [Llama 3.2 Running Locally in VSCode: How to Set It Up with ...](https://dev.to/dani_avila7/llama-32-running-locally-in-vscode-how-to-set-it-up-with-codegpt-and-ollama-h1n)
