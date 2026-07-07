---
source_url: "https://www.perplexity.ai/search/f010deb6-61c4-43ce-a4c2-8066335edd0a"
thread_uuid: "65464fd3-2260-4d73-91d2-c78a4d96fcc1"
slug: "f010deb6-61c4-43ce-a4c2-8066335edd0a"
title: "Besides RAG for context enumeration with LLMs, with e.g. cursor, what alternatives exist for RAG, what are the main drawbacks with RAG and what better implementations exist today as of november 2024? Attempt to find information newer than June of 2024."
extracted_at: "2026-06-29T16:15:12.928Z"
matched_keywords: []
export_suite: "identity"
entry_count: 2
provenance: perplexity-rest-api
---

# Besides RAG for context enumeration with LLMs, with e.g. cursor, what alternatives exist for RAG, what are the main drawbacks with RAG and what better implementations exist today as of november 2024? Attempt to find information newer than June of 2024.

Source: [Perplexity thread](https://www.perplexity.ai/search/f010deb6-61c4-43ce-a4c2-8066335edd0a)

## User

Besides RAG for context enumeration with LLMs, with e.g. cursor, what alternatives exist for RAG, what are the main drawbacks with RAG and what better implementations exist today as of november 2024? Attempt to find information newer than June of 2024.

## Assistant

As of November 2024, while Retrieval Augmented Generation (RAG) remains a popular approach for enhancing LLM responses with external knowledge, there have been some developments and alternatives proposed in recent months. Here's an overview of the current landscape:

## Alternatives to RAG

### Order-Preserving RAG (OP-RAG)

Introduced by NVIDIA researchers in September 2024, OP-RAG offers an improvement over traditional RAG methods by preserving the order of retrieved text chunks. This approach maintains context and coherence throughout the retrieval process, potentially leading to more accurate and contextually relevant responses.[5]

### Massive Mixture of Memory Experts

While not a fully developed alternative yet, the concept of a "massive mixture of memory experts" has gained attention. This approach aims to integrate specialized knowledge directly into the model architecture, potentially reducing the need for external retrieval.[10]

### LLM + Knowledge Graph

Some researchers are exploring the combination of LLMs with knowledge graphs as an alternative to traditional RAG. This approach could potentially offer more structured and relational knowledge representation.[10]

## Drawbacks of RAG

1. Complexity and Overhead: RAG requires multiple inferences, database fetches, and additional computational steps, which can increase latency and system complexity.[5]

2. Context Window Limitations: As LLMs with larger context windows become available, the need for RAG in certain scenarios may diminish.[5]

3. Cross-Passage Interactions: The aggregation methods used in RAG can sometimes lose important cross-passage interactions, potentially hurting accuracy on complex queries that require multi-hop reasoning.[3]

4. Inconsistent Performance: Some users report inconsistent results with RAG, especially when using pre-built solutions.[7]

## Improved RAG Implementations

### Certifiably Robust RAG

A new approach proposed in May 2024 aims to provide more robust RAG responses by addressing potential inaccuracies due to corrupted retrieval results. However, this method may have practical limitations due to increased computational requirements.[3]

### Contextual Compression

Also known as Relevance Extraction, this technique aims to extract only the most relevant portions of retrieved chunks before passing them to the LLM. This can help reduce token costs and improve response accuracy by focusing on the most pertinent information.[9]

### Graph-based RAG

Some researchers are exploring the integration of graph structures into RAG systems, potentially allowing for more complex reasoning and knowledge representation.[10]

While RAG continues to be a widely used approach, these recent developments suggest that the field is actively exploring ways to improve or replace traditional RAG methods. As of November 2024, there's no clear "winner" to fully replace RAG, but rather a landscape of evolving techniques aimed at addressing its limitations and expanding its capabilities.

### Sources

- [Using LLM-as-judge for entity extraction eval… not great - Reddit](https://www.reddit.com/r/LLMDevs/comments/1eha6iq/using_llmasjudge_for_entity_extraction_eval_not/)
- [The Art of Programming and Why I Won't Use LLM - Reddit](https://www.reddit.com/r/programming/comments/1g2n812/the_art_of_programming_and_why_i_wont_use_llm/)
- [New Paper: Certifiably robust RAG that can provide robust answers](https://www.reddit.com/r/LocalLLaMA/comments/1d28t2v/new_paper_certifiably_robust_rag_that_can_provide/)
- [Retrieval Augmented Generation (RAG) with Free CPU-based LLMs ...](https://www.reddit.com/r/selfhosted/comments/17j1d6e/retrieval_augmented_generation_rag_with_free/)
- [RAG vs Long Context Models [Discussion] : r/MachineLearning](https://www.reddit.com/r/MachineLearning/comments/1ax6j73/rag_vs_long_context_models_discussion/)
- [NVIDIA Researchers Introduce Order-Preserving Retrieval ... - Reddit](https://www.reddit.com/r/machinelearningnews/comments/1fdq47k/nvidia_researchers_introduce_orderpreserving/)
- [Chatbot that talks to SQL : r/LangChain - Reddit](https://www.reddit.com/r/LangChain/comments/1do5f9p/chatbot_that_talks_to_sql/)
- [Input variable for Prompt Template won't work with retrieval QA chain](https://www.reddit.com/r/LangChain/comments/16djn0n/input_variable_for_prompt_template_wont_work_with/)
- [Relevance Extraction in RAG pipelines : r/LocalLLaMA - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/17k39es/relevance_extraction_in_rag_pipelines/)
- [[D] what's the alternative to retrieval augmented generation? - Reddit](https://www.reddit.com/r/MachineLearning/comments/1edbg0h/d_whats_the_alternative_to_retrieval_augmented/)

## User

But what is the main challenge when gathering context in codebases...? Also what is 'reranker' and why is it occasionally offered as an alternative...? And what does this have to do with embeddings? What specifically is an embedding...? My personal research has told me RAG is not the solution and it does not live up to the hype around it... so what could be the best solution...?

## Assistant

**Challenges in Gathering Context in Codebases**

One of the main challenges when gathering context in codebases is dealing with the complexity and size of the codebase itself. Here are some key points:

- **Complexity**: Modern codebases are often large, with intricate dependencies and a variety of programming paradigms. This complexity makes it difficult to retrieve relevant context efficiently and accurately.

- **Context Window Limitations**: The size of the context window available in LLMs can limit how much code can be processed at once, often leading to incomplete or fragmented context retrieval.

- **Semantic Understanding**: Codebases contain semantic relationships and dependencies that go beyond simple text matching. Capturing these relationships requires more than basic keyword search.

- **Relevance**: Not all code in a large codebase is relevant to a given query or task. Determining what code is relevant and should be included in the context can be challenging.

**Reranker and Its Role**

- **Reranker**: A reranker is a component in retrieval systems that reorders the results of an initial search to better match the user's query. In the context of RAG:

  - **Purpose**: It's used after an initial retrieval to improve the accuracy of the retrieved documents or code snippets by assessing their relevance to the query.
  
  - **Method**: A reranker typically employs a cross-encoder model, which directly compares pairs of texts (the query and the retrieved document) to provide a relevance score. This method is more accurate but slower than initial similarity searches based on embeddings.

  - **Cost**: Reranking is computationally more intensive and can involve API calls or model inferences, making it costlier in terms of time and resources.

  - **Justification**: It's justified because embeddings can be lossy, potentially missing out on subtle semantic relationships that rerankers can capture.

**Embeddings and Their Role**

- **Embeddings**: In the context of RAG and codebases:

  - **Definition**: Embeddings are vector representations of data (text or code in this case) that capture its semantic meaning. They are used to measure similarity or distance between pieces of text or code.

  - **Usage**: Code embeddings are used to index and search through codebases, allowing for semantic search capabilities beyond simple text matching.

  - **Limitations**: While embeddings can group similar items together, they may not capture all semantic nuances, leading to potential inaccuracies in retrieval.

**Alternatives and Better Implementations**

- **RAG Limitations**:
  - **Complexity and Overhead**: RAG requires multiple inferences, database fetches, and additional computational steps, which can increase latency and system complexity.
  - **Context Window Limitations**: As LLMs with larger context windows become available, the need for RAG in certain scenarios may diminish.

- **Alternative Approaches**:
  - **Order-Preserving RAG (OP-RAG)**: Introduced by NVIDIA, this approach maintains context and coherence throughout the retrieval process, potentially leading to more accurate responses.
  - **Massive Mixture of Memory Experts**: This concept aims to integrate specialized knowledge directly into the model architecture, potentially reducing the need for external retrieval.
  - **LLM + Knowledge Graph**: Combining LLMs with knowledge graphs could offer more structured and relational knowledge representation.
  - **Contextual Compression**: Techniques like Relevance Extraction aim to extract the most relevant portions of retrieved chunks, reducing token costs and improving response accuracy.

- **Improved RAG Implementations**:
  - **Certifiably Robust RAG**: This method addresses potential inaccuracies due to corrupted retrieval results but may have practical limitations due to increased computational requirements.
  - **Graph-based RAG**: Some researchers are exploring the integration of graph structures into RAG systems for more complex reasoning.

- **Best Solutions**:
  - **Contextual Compression**: Techniques like Relevance Extraction can help focus on the most pertinent information, reducing costs and improving accuracy.
  - **Long Context Models**: While not an alternative, models with very large context sizes can handle more information in a single prompt, potentially reducing the need for RAG in some scenarios.

In summary, while RAG has its place, its limitations in handling complex codebases, context window restrictions, and semantic understanding are being addressed by alternative approaches and improved implementations. The choice between these alternatives depends on the specific use case, the size and complexity of the codebase, and the desired balance between accuracy, efficiency, and cost.

### Sources

- [I just had the displeasure of implementing Langchain in our org.](https://www.reddit.com/r/LangChain/comments/18eukhc/i_just_had_the_displeasure_of_implementing/)
- [Yet another RAG system - implementation details and lessons learned](https://www.reddit.com/r/LocalLLaMA/comments/16cbimi/yet_another_rag_system_implementation_details_and/)
- [Explain Re-Ranking : r/LocalLLaMA - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1ayka0f/explain_reranking/)
- [What are "embeddings" in computer vision ? : r/computervision](https://www.reddit.com/r/computervision/comments/1ae4olo/what_are_embeddings_in_computer_vision/)
- [Alternative to GPT4ALL With RAG Built-In (Knowledgebase support)](https://www.reddit.com/r/LocalLLaMA/comments/1arq6lf/alternative_to_gpt4all_with_rag_builtin/)
- [[D] what's the alternative to retrieval augmented generation?](https://www.reddit.com/r/MachineLearning/comments/1edbg0h/d_whats_the_alternative_to_retrieval_augmented/)
- [What complete RAG offerings (ie. not frameworks) are available?](https://www.reddit.com/r/vectordatabase/comments/17lhqri/what_complete_rag_offerings_ie_not_frameworks_are/)
- [RAG vs Long Context Models [Discussion] : r/MachineLearning](https://www.reddit.com/r/MachineLearning/comments/1ax6j73/rag_vs_long_context_models_discussion/)
