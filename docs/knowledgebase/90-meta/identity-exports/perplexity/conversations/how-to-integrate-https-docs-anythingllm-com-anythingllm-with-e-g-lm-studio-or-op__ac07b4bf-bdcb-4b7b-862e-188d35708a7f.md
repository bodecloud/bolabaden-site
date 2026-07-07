---
source_url: "https://www.perplexity.ai/search/93c8e79c-8fcf-400d-8fe2-0d0d055607aa"
thread_uuid: "ac07b4bf-bdcb-4b7b-862e-188d35708a7f"
slug: "93c8e79c-8fcf-400d-8fe2-0d0d055607aa"
title: "how to integrate <https://docs.anythingllm.com> AnythingLLM with e.g. LM Studio or Open WebUI"
extracted_at: "2026-06-29T16:16:58.766Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# how to integrate <https://docs.anythingllm.com> AnythingLLM with e.g. LM Studio or Open WebUI

Source: [Perplexity thread](https://www.perplexity.ai/search/93c8e79c-8fcf-400d-8fe2-0d0d055607aa)

## User

how to integrate <https://docs.anythingllm.com> AnythingLLM with e.g. LM Studio or Open WebUI

## Assistant

AnythingLLM can be integrated with various local LLM providers, including LM Studio and Open WebUI. Here's a guide on how to integrate AnythingLLM with these platforms:

## Integration with LM Studio

LM Studio is a popular choice for running local large language models. To integrate AnythingLLM with LM Studio:

1. **Install LM Studio**: Download and install LM Studio on your local machine.[5]

2. **Configure LM Studio**:
   - Open LM Studio and navigate to the "Models" section.
   - Download an appropriate model (e.g., Llama-3-8B-Instruct-GGUF or Hermes-2-Pro-Mistral-7B-GGUF).[5]
   - Start the LM Studio server with your chosen model.

3. **Set up AnythingLLM**:
   - Install AnythingLLM on your system.[5]
   - During the initial setup, you'll be prompted to choose a service for handling chat functionality.
   - Select LM Studio as your chat service.[5]
   - Provide the LM Studio Base URL (typically http://localhost:1234).[5]

4. **Configure AnythingLLM**:
   - In AnythingLLM, navigate to the LLM selection screen.
   - Choose LM Studio as your LLM provider.[3]

## Integration with Open WebUI

While the search results don't provide specific information about integrating AnythingLLM with Open WebUI, the process is likely similar to other local LLM providers. Here's a general approach:

1. **Set up Open WebUI**: Install and configure Open WebUI on your local machine.

2. **Configure AnythingLLM**:
   - In AnythingLLM, look for options to add custom LLM providers or external APIs.
   - Configure the connection to point to your Open WebUI instance, typically using a local URL and API key if required.

## General Integration Steps

Regardless of the specific LLM provider, the integration process with AnythingLLM usually involves these steps:

1. **Import Custom Models**: AnythingLLM allows you to import custom GGUF models. On the LLM selection screen, look for the "Import custom model" button.[3]

2. **Configure API Settings**: Set the API base URL to your local LLM provider's endpoint (e.g., "http://localhost:1234/v1" for LM Studio).[2]

3. **Set API Key**: Use the appropriate API key for your local LLM provider. For LM Studio, it's typically set to "lm-studio".[2]

4. **Create a Workspace**: In AnythingLLM, create a new workspace and upload the documents you want to use with your LLM.[5]

5. **Test the Integration**: Once configured, test the integration by starting a conversation in AnythingLLM and verifying that it's using your local LLM provider.

Remember that AnythingLLM is designed to work with text-based LLMs, so ensure you're using appropriate models for this integration. The desktop version of AnythingLLM offers more flexibility for custom model integration compared to the browser-based version.[3]

By following these steps, you should be able to successfully integrate AnythingLLM with local LLM providers like LM Studio or Open WebUI, enabling you to leverage the power of local large language models within the AnythingLLM environment.

### Sources

- [docs.anythingllm.com](https://docs.anythingllm.com)
- [Integrating Local LLM Frameworks: A Deep Dive into LM Studio and ...](https://pyimagesearch.com/2024/06/24/integrating-local-llm-frameworks-a-deep-dive-into-lm-studio-and-anythingllm/)
- [Import an LLM into AnythingLLM](https://docs.anythingllm.com/fine-tuning/loading-custom-models)
- [Home ~ AnythingLLM](https://docs.anythingllm.com)
- [How to implement a RAG system using AnythingLLM and LM Studio](https://digitaconnect.com/how-to-implement-rag-using-anythingllm-and-lm-studio/)
