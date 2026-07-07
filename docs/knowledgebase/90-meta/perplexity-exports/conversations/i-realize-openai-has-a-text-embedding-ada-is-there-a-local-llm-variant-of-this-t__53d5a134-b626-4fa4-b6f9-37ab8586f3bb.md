---
source_url: "https://www.perplexity.ai/search/797a57d4-350a-4d87-bb2b-08d7b3868d5b"
thread_uuid: "53d5a134-b626-4fa4-b6f9-37ab8586f3bb"
slug: "797a57d4-350a-4d87-bb2b-08d7b3868d5b"
title: "i realize openai has a text-embedding-ada. Is there a local llm variant of this that i can use with ollama?"
extracted_at: "2026-06-29T12:53:18.799Z"
matched_keywords: ["cluster"]
entry_count: 2
provenance: perplexity-rest-api
---

# i realize openai has a text-embedding-ada. Is there a local llm variant of this that i can use with ollama?

Source: [Perplexity thread](https://www.perplexity.ai/search/797a57d4-350a-4d87-bb2b-08d7b3868d5b)

## User

i realize openai has a text-embedding-ada. Is there a local llm variant of this that i can use with ollama?

## Assistant

Yes, there is a local variant of a text embedding model that you can use with Ollama, which is designed to be compatible with OpenAI's text-embedding-ada. The model is called **nomic-embed-text**, and it is available through Ollama. This model is reported to outperform OpenAI's text-embedding-ada on both short and long context tasks.[1][5]

Ollama provides a platform that allows you to run various local models, including embedding models, on your machine while maintaining compatibility with OpenAI's API. This means you can use the same code that worked with OpenAI's API by simply changing the API base URL to your local Ollama server.[2][4]

To use the **nomic-embed-text** model with Ollama, you can follow these steps:

1. **Download and Install Ollama**: First, download and install the Ollama application from their official website.
2. **Run the Model**: Use the command `ollama run nomic-embed-text` to start the embedding model.
3. **API Compatibility**: Set your application's API base to `http://localhost:11434/v1` to interact with the local model using OpenAI-compatible requests.[4][2]

This setup allows you to leverage local embeddings efficiently while benefiting from the compatibility and ease of integration provided by Ollama.

### Sources

- [Build a Local AI Writing Assistant with Ollama and Obsidian - Substack](https://pamperherself.substack.com/p/build-a-local-ai-writing-assistant)
  - Achieving the Effects with Ollama + Obsidian
- [Ollama's OpenAI-Compatible API, and using it with Langroid - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1apvtwo/ollamas_openaicompatible_api_and_using_it_with/)
- [OpenAI Embeddings - LlamaIndex](https://docs.llamaindex.ai/en/stable/examples/embeddings/OpenAI/)
- [OpenAI compatibility · Ollama Blog](https://ollama.com/blog/openai-compatibility)
  - Ollama now has initial compatibility with the OpenAI Chat Completions API, making it possible to use existing tooling built for OpenAI with local models via Ollama.
- [Local Embedding : r/LocalLLaMA - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1dflddk/local_embedding/)
- [How to leverage open source LLMs locally via Ollama - KNIME](https://www.knime.com/blog/how-to-leverage-open-source-llms-ollama/)
  - Take this tutorial to combine Ollama's vast model library with KNIME's GenAI capabilities and access & prompt 80+ open source LLMs locally. Try it!
- [Ollama / OpenAI - local embeddings not working - KNIME Forum](https://forum.knime.com/t/ollama-openai-local-embeddings-not-working/83997)
  - I am trying to create a workflow that would use local LLMs like Llama32 with the help of Ollama and the KNIME AI nodes as described in the article by @roberto_cadili How to leverage open source LLMs locally via Ollama. I tested several local URLs and models but I always receive the same error message ‘invalid input’. I wonder if there is a problem with the current implementation - Ollama version 0.3.14. Maybe someone can also try and give feedback. What does work is creating such Vector ...
- [Ollama - MoodleDocs](https://docs.moodle.org/405/en/Ollama)
- [Run AI models on your local machine with Ollama [Pt 5] - YouTube](https://www.youtube.com/watch?v=dLfNnoPv4AQ)
  - Learn how to seamlessly integrate local AI models into your development workflow using Ollama. You'll see how to download, run, and interact with powerful AI models on your machine, and keep compatibility with OpenAI’s API. We'll explore the Phi-3 model family, and discover how you can use it to build prototypes and experiment with AI applications. Links: Phi-3 cookbook: https://github.com/microsoft/Phi-3CookBook/ AI JavaScript playground:...

## User

are any of these alternatives any better or are they completely different?

## Assistant

The models listed in the image and described in the sources have different strengths and potential use cases compared to OpenAI's text-embedding-ada. Here's a brief overview:

### SFR-Embedding-Mistral
- **Performance**: Considered a top-performing model on the MTEB benchmark, particularly excelling in retrieval tasks and clustering.[2][6]
- **Use Cases**: Suitable for high-accuracy text retrieval and classification tasks.[8]

### Nomic-Embed-Text-v1.5
- **Performance**: Offers flexible embedding dimensions and is noted for outperforming text-embedding-ada-002 in certain tasks. It uses Matryoshka Representation Learning to allow trade-offs between size and performance.[4][7]
- **Use Cases**: Effective for information retrieval, text classification, and clustering.[9]

### All-MiniLM-L6-v2
- **Performance**: Known for efficient sentence and paragraph encoding into 384-dimensional vectors. It performs well in tasks like clustering and semantic search.[5]
- **Use Cases**: Ideal for sentence similarity, information retrieval, and clustering tasks.

### Considerations
- **Domain Specificity**: The effectiveness of these models can vary based on the specific domain or task. Some models may generalize better across domains, while others excel in specialized areas.[3]
- **Memory and Efficiency**: Nomic Embed Text v1.5 is noted for its memory efficiency, which might be beneficial if resource constraints are a concern.[7]

Each model has unique features that might make it more suitable depending on your specific needs, such as task type, resource availability, or domain specificity.

### Sources

- [image.jpg](https://ppl-ai-file-upload.s3.amazonaws.com/image/upload/v1734131206/user_uploads/sCzQdPSIjpTQIth/image.jpg?AWSAccessKeyId=ASIA2F3EMEYER3BK2SEC&Signature=YfLPrueVmizV%2BMHiIdKYiDZuJoI%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIByAyKKKdBfr5ivF9%2F9nDdCISNvYeF12gi9qjtyOxd9QAiBA7eCSEVSqacDSTo7rRoO4T0yG2x4bI%2BCIGYTTw9fXOSr8BAiu%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAEaDDY5OTc1MzMwOTcwNSIMjjl2jH9KghQUcFzcKtAEglcF2L9rMSg57ldJTJm0N%2FyI5D6xJnL9pAaLmJXWUgJfbdk85y%2B6Ukv3O%2FvI1zS8RxVptOKCYaCbo%2BVYSRIUQUo3jMwA%2Fqnmqd7C4X3s6GIv5HED8fvIkZ%2B7kho0DgwzskOg5Rq2reFdcbDhs0v%2FXHrJ8jIcdhjbvNa15PAHPL4VO%2FOGAk1BqNJ9qE2FOqK0k%2B98WL6%2FZjUnqi4QwkMOkahDPyhVJvEhDi0Veu108OhFZI9QEOwoZYrwFveefdndJTiq2KGzzYCBr70HQbn0%2BuBKVfjZXkM6adTNGWSO2%2FzgtPf9r4vb72QSTUwtqsRbPsDoE4hvIz3C3SntirMTgajSPeOpM9hfnIwo3o8nVWgZJSkAT3OHcOAAGAvEMC5p5rNJ4TiyKFRjRmxVgmvdLn2ZcnzdnPtupIp7Vg8NW6LxMkrg5tHhyCyURB9qcMgJ%2BCGm29EJH24p0CWjs5kAc%2B%2BKJDM2d9oZj6KCiATyybdtsnr0ZrYWTS8FKm3KCJpffZ5VgiRCcviAusY57wpyW7VThUCowWnCD2l7O3%2BrDiIX7j02AfK%2BLCoTHuRr5e6QnIXZfZHZm2f32DfN%2FKGjQuxAQf%2BLru27vSga565iUHVNFMNNCadpvdDBiFb4hmw0w9PJWthnuHFcZGfCt8fpFrt1JJgp39%2FYs08kQ9YhRBWTW3ltkj7g%2BkIWxE8zZ%2FK%2Fc8YAlVi%2F0Q7oIDdgt%2BnvymuKmotF0wGlp6e7Is7mzf7BqJJiVewsX0yUPBTyMBWcB%2FB8Plx0O8R3vCIlstNX8DDW0InSBjqZAX%2BoqlfU7BYkf8p8WhPHdcleCBjMo3dBHPPMRbpjMzvA%2FWRdDiq3xDvUY8gdJrrszufYTNXRFdVthDLZEYRjtgUeef5uiuESCLdNcjXetMinW2tQgsLqNPqvwltWISNHGX1yp%2BOpqW4l9vVGQOTIrZPZqew8pZ8oZMqzycnbyP7MtpQMXNFqppi6JviT3BxuaIrrsLrZOGWgBA%3D%3D&Expires=1782738198)
- [Salesforce AI Research's SFR-Embedding, The Top Performing Text ...](https://www.salesforce.com/blog/sfr-top-performing-text-embedding-model/)
  - How can a computer discern the meaning of a sentence? By “discern its meaning,” I’m referring to grasping the words within the sentence, their context, nuances, and relationships with other words.
- [How to get better performance out of embedding models for retrieval ...](https://stackoverflow.com/questions/77771455/how-to-get-better-performance-out-of-embedding-models-for-retrieval-semantic-sea)
  - I am trying to build a document retrieval interface which can take in an example document and retrieve the closest existing documents from a postgres db. It seems like a simple use case, however most
- [Nomic Embed Text V1.5 GGUF by Nomic AI | AI model details](https://www.aimodels.fyi/models/huggingFace/nomic-embed-text-v15-gguf-nomic-ai)
  - Guide to running the Nomic Embed Text V1.5 GGUF by Nomic AI on HuggingFace. Overview, schema, use cases, limitations.
- [All MiniLM L6 V2 · Models - Dataloop](https://dataloop.ai/library/model/sentence-transformers_all-minilm-l6-v2/)
  - The All MiniLM L6 V2 model is a powerful tool for sentence and short paragraph encoding, capable of mapping sentences and paragraphs to a 384-dimensional dense vector space. But how does it work? Essentially, it takes in input text and outputs a vector that captures the semantic information of the input, making it useful for tasks like information retrieval, clustering, and sentence similarity. With its contrastive learning objective and AdamW optimizer, this model achieves state-of-the-art...
- [dranger003/SFR-Embedding-Mistral-GGUF - Hugging Face](https://huggingface.co/dranger003/SFR-Embedding-Mistral-GGUF)
  - We’re on a journey to advance and democratize artificial intelligence through open source and open science.
- [Unboxing Nomic Embed v1.5: Resizable Embeddings with ...](https://www.nomic.ai/blog/posts/nomic-embed-matryoshka)
  - Nomic introduces a truly open text embedding model with resizable embeddings.
- [SFR Embedding Mistral · Models - Dataloop](https://dataloop.ai/library/model/salesforce_sfr-embedding-mistral/)
  - SFR Embedding Mistral is a powerful AI model that enhances text retrieval with transfer learning. It's built on top of E5-mistral-7b-instruct and Mistral-7B-v0.1, allowing it to handle tasks like web search query retrieval and passage ranking. With a model size of 7.11 and FP16 tensor type, it's designed for efficiency and speed. But what makes it unique is its ability to provide accurate results while keeping costs down, making it a practical choice for real-world applications. Want to know...
- [Nomic Embed Text V1.5 · Models - Dataloop](https://dataloop.ai/library/model/nomic-ai_nomic-embed-text-v15/)
  - Nomic Embed Text V1.5 is a powerful AI model designed for efficient and fast text embedding. What makes it unique is its ability to scale sequence length past 2048 tokens, making it ideal for handling long pieces of text. This model utilizes Matryoshka Representation Learning, which allows developers to trade off embedding size for a negligible reduction in performance. With its multimodal capabilities, it can handle tasks like text classification, clustering, and search queries with ease....
