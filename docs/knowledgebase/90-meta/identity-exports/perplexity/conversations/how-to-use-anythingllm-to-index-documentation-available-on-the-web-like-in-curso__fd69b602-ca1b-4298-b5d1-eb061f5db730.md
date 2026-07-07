---
source_url: "https://www.perplexity.ai/search/6375a252-b6aa-45de-8762-bd92e5131a2f"
thread_uuid: "fd69b602-ca1b-4298-b5d1-eb061f5db730"
slug: "6375a252-b6aa-45de-8762-bd92e5131a2f"
title: "how to use AnythingLLM to index documentation available on the web? Like in Cursor I can just provide a base url and then it crawls it. How to do that with AnythingLLM?"
extracted_at: "2026-06-29T16:11:46.322Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# how to use AnythingLLM to index documentation available on the web? Like in Cursor I can just provide a base url and then it crawls it. How to do that with AnythingLLM?

Source: [Perplexity thread](https://www.perplexity.ai/search/6375a252-b6aa-45de-8762-bd92e5131a2f)

## User

how to use AnythingLLM to index documentation available on the web? Like in Cursor I can just provide a base url and then it crawls it. How to do that with AnythingLLM?

## Assistant

To use **AnythingLLM** to index documentation available on the web, similar to how Cursor can crawl a base URL, you can leverage the **Web Scraping** tool built into AnythingLLM. This feature allows the agent to scrape a website and automatically embed its content into your workspace, making it accessible for querying and generating responses based on that content.

Here’s a step-by-step guide:

1. **Access the Web Scraping Tool**: 
   - In AnythingLLM, you don't need to manually embed the website's content. The agent can scrape the website for you.
   
2. **Initiate Web Scraping**:
   - You can command the agent to scrape a website by using a prompt like:
     ``` 
     @agent can you scrape the website [URL] and give me a summary of its content?
     ```
     For example:
     ```
     @agent can you scrape the website https://docs.useanything.com and give me a summary of its features?
     ```

3. **Embedded Content**:
   - Once the agent scrapes the website, it embeds the content into your workspace. This allows you to ask further questions based on that content without needing to manually upload or process documents.

4. **Querying the Indexed Content**:
   - After scraping, you can ask questions about the indexed documentation. For example:
     ```
     @agent what do you know about feature X from [website]?
     ```

This method is similar to how Cursor crawls a base URL, but in AnythingLLM, it's done through an interactive agent that handles web scraping and embedding automatically for you.[3][4]

Make sure that your LLM model is capable of handling these tasks effectively, as some models may have limitations with tool-calling or internet access depending on their configuration.[3]

### Sources

- [RAG Tutorial: Exploring AnythingLLM and Vector Admin](https://dev.to/worldlinetech/rag-tutorial-exploring-anythingllm-and-vector-admin-4i3c)
- [Issues Importing a Data Sources, Questions about AnythingLLM API ...](https://github.com/Mintplex-Labs/anything-llm/issues/487)
- [AI Agent Usage - AnythingLLM Docs](https://docs.useanything.com/agent/usage)
- [AnythingLLM Docs](https://docs.useanything.com)
