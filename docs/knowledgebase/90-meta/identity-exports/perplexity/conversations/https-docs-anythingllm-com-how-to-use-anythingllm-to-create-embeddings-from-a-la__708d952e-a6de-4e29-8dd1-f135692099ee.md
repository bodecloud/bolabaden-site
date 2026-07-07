---
source_url: "https://www.perplexity.ai/search/ced8fda0-5906-4a07-9c39-8cb9a40fd8e9"
thread_uuid: "708d952e-a6de-4e29-8dd1-f135692099ee"
slug: "ced8fda0-5906-4a07-9c39-8cb9a40fd8e9"
title: "https://docs.anythingllm.com

How to use AnythingLLM to create embeddings from a large source code file (50,000 lines of code!) so the LLM can actually work with the data.

I refuse to chunk. Specifically use embeddings. Do NOT write any code: we are using the self-contained app"
extracted_at: "2026-06-29T16:36:07.170Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# https://docs.anythingllm.com

How to use AnythingLLM to create embeddings from a large source code file (50,000 lines of code!) so the LLM can actually work with the data.

I refuse to chunk. Specifically use embeddings. Do NOT write any code: we are using the self-contained app

Source: [Perplexity thread](https://www.perplexity.ai/search/ced8fda0-5906-4a07-9c39-8cb9a40fd8e9)

## User

https://docs.anythingllm.com

How to use AnythingLLM to create embeddings from a large source code file (50,000 lines of code!) so the LLM can actually work with the data.

I refuse to chunk. Specifically use embeddings. Do NOT write any code: we are using the self-contained app

## Assistant

To create embeddings from a large source code file (such as one with 50,000 lines of code) using **AnythingLLM** without chunking, follow these steps based on the documentation and general usage guidelines:

### **1. Upload the Source Code File**
First, ensure that your large source code file is uploaded to the AnythingLLM platform. AnythingLLM allows you to upload various types of files, including text files, which would be appropriate for your source code.

### **2. Use the Embedding Feature**
AnythingLLM includes a feature for creating embeddings from documents. Since you want to avoid chunking and rely solely on embeddings, you need to ensure that the entire file is processed as a single entity.

- **Embedding Process**: When you upload the file, AnythingLLM will automatically generate embeddings for the content. These embeddings are mathematical representations of the text that capture its semantic meaning. This allows the LLM (Language Model) to work with the data effectively without needing to break it into smaller chunks.

### **3. Configure Embedding Settings**
Depending on the configuration options available in AnythingLLM, you may be able to adjust how embeddings are generated:

- **Model Selection**: Ensure that you're using an LLM model capable of handling large inputs for embedding creation. Some models may have token limits, so selecting a model with higher capacity may be necessary.
  
- **Embedding Granularity**: AnythingLLM might provide options to adjust how fine-grained or coarse-grained the embeddings are. For a large file like 50,000 lines of code, you might want to use more coarse-grained embeddings to capture broader context across the entire file.

### **4. Query and Interact with the Embedded Data**
Once the embeddings are created for your source code file:

- You can query specific parts of your code by asking questions or making requests to the LLM. The model will use the embeddings to understand and retrieve relevant information from across the entire file.
  
- The LLM will leverage these embeddings to provide responses that consider semantic relationships within your large source code base.

### **5. Avoid Chunking**
Since you're specifically avoiding chunking, ensure that you do not enable any chunking-related features in AnythingLLM during this process. Chunking typically involves splitting large documents into smaller parts before processing them, but since you're relying on full-file embeddings, this step is unnecessary.

By following these steps, AnythingLLM will generate embeddings from your large source code file without needing to break it into chunks, allowing you to work with and query the data effectively through the LLM.

For more detailed instructions or specific configurations related to embedding settings in AnythingLLM, refer directly to their documentation under sections like "Features" or "Embedding".[1][2]

### Sources

- [docs.anythingllm.com](https://docs.anythingllm.com)
- [Home ~ AnythingLLM](https://docs.anythingllm.com)
