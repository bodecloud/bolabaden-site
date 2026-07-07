---
source_url: "https://www.perplexity.ai/search/3ab3fe23-8d6b-4e1a-a5e1-619ed0798e95"
thread_uuid: "05f45817-453e-4d58-9bf4-436fb6b63aec"
slug: "3ab3fe23-8d6b-4e1a-a5e1-619ed0798e95"
title: "What are the main drawbacks of RAG and why is it not anywhere? is there a better strategy being considered for LLMs that I can experiment around with?"
extracted_at: "2026-06-29T16:16:17.264Z"
matched_keywords: []
export_suite: "identity"
entry_count: 3
provenance: perplexity-rest-api
---

# What are the main drawbacks of RAG and why is it not anywhere? is there a better strategy being considered for LLMs that I can experiment around with?

Source: [Perplexity thread](https://www.perplexity.ai/search/3ab3fe23-8d6b-4e1a-a5e1-619ed0798e95)

## User

What are the main drawbacks of RAG and why is it not anywhere? is there a better strategy being considered for LLMs that I can experiment around with?

## Assistant

While Retrieval-Augmented Generation (RAG) has shown significant promise in enhancing the capabilities of Large Language Models (LLMs), it does have some drawbacks and limitations that have prevented its widespread adoption. Let's explore these issues and consider alternative strategies that are being developed.

## Main Drawbacks of RAG

1. **Computational Cost**: RAG can be computationally expensive, especially when processing long contexts. The inference cost scales quadratically with respect to sequence length, making it challenging to deploy in some real-world text processing applications.[3]

2. **Distraction Phenomenon**: RAG systems can suffer from the "distraction phenomenon," where irrelevant context in the prompt degrades output quality.[3]

3. **Multi-hop Query Limitations**: Existing RAG systems often struggle with multi-hop queries that require retrieving and reasoning over multiple pieces of supporting evidence.[4]

4. **Domain Adaptation Challenges**: RAG models initially trained on general knowledge bases (like Wikipedia) may not perform optimally in specialized domains without further adaptation.[6]

5. **Privacy Concerns**: While RAG can potentially mitigate some privacy risks associated with LLMs, it introduces new privacy issues related to the retrieval database.[7]

## Why RAG Is Not Ubiquitous

Despite its potential, RAG is not universally adopted due to these limitations and the ongoing research to address them. Many organizations and researchers are still exploring the best ways to implement RAG effectively and efficiently.

## Alternative Strategies

Several alternative or complementary strategies are being considered to improve LLMs:

1. **Superposition Prompting**: This novel methodology allows LLMs to process input documents in parallel "prompt paths," discarding irrelevant paths. It can significantly reduce compute time while improving accuracy, especially for large retrieved contexts.[3]

2. **Chain of Agents (CoA)**: This framework uses multi-agent collaboration through natural language to enable information aggregation and context reasoning across various LLMs for long-context tasks. It processes the entire input by interleaving reading and reasoning, assigning each agent a short context to mitigate focus issues.[5]

3. **RAG-end2end**: This extension to RAG adapts to domain-specific knowledge bases by updating all components of the external knowledge base during training. It introduces an auxiliary training signal to inject more domain-specific knowledge.[6]

4. **Improved Retrieval Methods**: Research is ongoing to enhance retrieval efficiency and accuracy, including the development of better embedding models for multi-hop queries.[4]

5. **Privacy-Preserving RAG**: Researchers are exploring ways to mitigate privacy risks in RAG systems while maintaining their benefits.[7]

## Experimenting with Alternative Strategies

If you're interested in experimenting with these strategies, consider the following approaches:

1. Implement superposition prompting with existing pre-trained LLMs to improve efficiency and accuracy on question-answering tasks.[3]

2. Explore multi-agent collaboration using the Chain of Agents framework for long-context tasks.[5]

3. Experiment with domain adaptation techniques like RAG-end2end to optimize RAG for specific domains.[6]

4. Investigate improved retrieval methods, particularly for multi-hop queries, using the MultiHop-RAG dataset as a benchmark.[4]

5. Develop and test privacy-preserving techniques for RAG systems.[7]

These alternative strategies aim to address the limitations of traditional RAG while leveraging its strengths. As research in this field continues to evolve rapidly, experimenting with these approaches could lead to significant improvements in LLM performance and applicability across various domains.

### Sources

- [Retrieval-Augmented Generation for Natural Language Processing: A Survey](https://arxiv.org/abs/2407.13193)
- [Combining Multiple Metrics for Evaluating Retrieval-Augmented Conversations](https://www.semanticscholar.org/paper/6e3f26b13c2c09608ab978c3e354d6a4b8ac368f)
- [Superposition Prompting: Improving and Accelerating Retrieval-Augmented Generation](https://arxiv.org/abs/2404.06910)
- [MultiHop-RAG: Benchmarking Retrieval-Augmented Generation for Multi-Hop Queries](https://arxiv.org/abs/2401.15391)
- [Chain of Agents: Large Language Models Collaborating on Long-Context Tasks](https://arxiv.org/abs/2406.02818)
- [Improving the Domain Adaptation of Retrieval Augmented Generation (RAG) Models for Open Domain Question Answering](https://arxiv.org/abs/2210.02627)
- [The Good and The Bad: Exploring Privacy Issues in Retrieval-Augmented Generation (RAG)](https://arxiv.org/abs/2402.16893)
- [A Comprehensive Survey of Retrieval-Augmented Generation (RAG): Evolution, Current Landscape and Future Directions](https://arxiv.org/abs/2410.12837)

## User

Some have claimed that using an embedding specifically trained for retrieval is better than RAG. Another claims the following:

```
There are several downsides to RAG.

You need a (typically paid) service such as Azure OpenAI to create embedding vectors. This can become expensive for large numbers of documents.

In comparison to traditional text search engines there is no measure of correctness how many documents to retrieve per query.

Furthermore, if you want to guarantee to find the n nearest neighbours of vectors in a vector space that contains many vectors you'll end up sequentially scanning through all vectors for each query. That's very inefficient. Hence, modern systems use approximate nearest neighbours, which is, well, only approximately precise in returning the result candidates.

But the main reason obviously is that this technology is still fairly new, so most companies don't have experience with it yet, or are not even aware yet it exists.
```

Determine the accuracy of these statements as well as any contextual information you'll need to make an expert-informed analysis of the issue and providing a free and easy and today-standard method of retrieving a crapton of files easily, quickly, and efficiently omitting the irrelevant data.

## Assistant

The claims about RAG (Retrieval-Augmented Generation) and alternative approaches have some valid points, but also contain some inaccuracies and oversimplifications. Let's analyze these statements and provide a more nuanced perspective:

1. Embedding models for retrieval vs. RAG:
Using embeddings specifically trained for retrieval can indeed be more effective than generic embeddings used in some RAG implementations. However, this is not a fundamental limitation of RAG, but rather an opportunity for improvement. Many RAG systems are now incorporating specialized retrieval models to enhance performance.[4]

2. Paid services for embeddings:
While it's true that some implementations use paid services like Azure OpenAI for embeddings, there are numerous free and open-source alternatives available. For example, models like SBERT (Sentence-BERT) or various implementations available through the Hugging Face library can be used for generating embeddings without incurring additional costs.[2]

3. Lack of correctness measure:
This claim is partially true. Unlike traditional search engines, RAG systems don't typically provide a direct measure of relevance or correctness for retrieved documents. However, advanced RAG implementations often incorporate relevance scoring mechanisms and can be fine-tuned to improve retrieval accuracy.[1]

4. Efficiency of nearest neighbor search:
The concern about sequential scanning for nearest neighbors is valid for naive implementations, but it's not representative of state-of-the-art RAG systems. Modern vector databases and approximate nearest neighbor (ANN) algorithms provide efficient solutions for large-scale retrieval without significant loss in accuracy.[2]

5. Newness of the technology:
This point is accurate. RAG is a relatively new technology, and many organizations are still in the process of understanding and adopting it. However, its adoption is rapidly increasing due to its effectiveness in various applications.[1][4]

Regarding a free, easy, and efficient method for retrieving large numbers of files while omitting irrelevant data, here's a modern approach:

## Efficient Retrieval Pipeline

1. **Embedding Generation**: Use a free, open-source model like SBERT or a Hugging Face transformer for generating embeddings. These can be run locally or on free cloud platforms.

2. **Vector Database**: Utilize an open-source vector database like Milvus, Qdrant, or FAISS for efficient storage and retrieval of embeddings. These databases implement efficient ANN algorithms.

3. **Chunking Strategy**: Implement an intelligent chunking strategy to break down large documents into meaningful segments. This can be done using libraries like LangChain or by implementing custom logic based on semantic or structural boundaries.

4. **Hybrid Search**: Combine semantic search (using embeddings) with traditional keyword-based search for better precision. This approach can help filter out irrelevant results more effectively.[2]

5. **Relevance Scoring**: Implement a custom relevance scoring mechanism that considers factors like semantic similarity, keyword matches, and document metadata.

6. **Iterative Retrieval**: For complex queries, use a multi-hop retrieval approach where the system performs multiple rounds of retrieval, refining the search based on intermediate results.[4]

7. **Caching**: Implement a caching layer to store frequently accessed documents or embeddings, reducing computation time for repeated queries.

This pipeline can be implemented using open-source tools and libraries, making it cost-effective and scalable. It addresses the main concerns raised about RAG while providing an efficient solution for large-scale document retrieval.

In conclusion, while the criticisms of RAG have some merit, they don't fully represent the current state of the technology. RAG systems are continuously evolving, and many of the mentioned limitations are being addressed through advanced techniques and optimizations. The key is to implement RAG thoughtfully, considering the specific requirements of the use case and leveraging the latest advancements in retrieval and language models.

### Sources

- [Retrieval Augmented Generation Integrated Large Language Models in Smart Contract Vulnerability Detection](https://arxiv.org/abs/2407.14838)
- [Advanced Chunking and Search Methods for Improved Retrieval-Augmented Generation (RAG) System Performance in E-Learning](https://www.semanticscholar.org/paper/02a10b16775ba18c00f841fdede9155adb6fdadd)
- [Intelligent System for Ranking Big Data in Search Engine](https://www.semanticscholar.org/paper/dccd8217f288f65e95010e49a1cf699f8626ed3d)
- [Search Engines, LLMs or Both? Evaluating Information Seeking Strategies for Answering Health Questions](https://arxiv.org/abs/2407.12468)

## User

Yeah I just want to know what I should be looking for. Many users ask 'why isn't rag everywhere at this point' as its been over a yr. so what's the absolute best way to take an insanely large amount of data, and utilize the important parts and/or condense the usable parts for LLM use quickly, efficiently, and easy? What should I be using basically for a free methodology, what's the standard in 2024?

## Assistant

Based on the latest trends and developments in 2024, there are several efficient and free methodologies for handling large amounts of data for LLM use. While RAG (Retrieval-Augmented Generation) has been around for over a year, it's not ubiquitous due to various challenges and the rapid evolution of alternative techniques. Here's what you should be looking at for the most effective approach:

## Current Standard for Efficient Data Handling in 2024

1. **Hybrid Retrieval Systems**
   These systems combine the strengths of semantic search (using embeddings) with traditional keyword-based search. This approach provides a balance between relevance and efficiency, especially for large datasets.

2. **Advanced Embedding Models**
   Utilize the latest open-source embedding models that are specifically designed for retrieval tasks. These models often outperform generic embeddings used in earlier RAG implementations.

3. **Vector Databases**
   Open-source vector databases like Milvus, Qdrant, or FAISS have become the standard for efficient storage and retrieval of embeddings. These databases implement approximate nearest neighbor (ANN) algorithms, addressing the efficiency concerns of earlier systems.

4. **Chunking and Preprocessing**
   Implement intelligent chunking strategies that break down large documents into meaningful segments based on semantic or structural boundaries. This improves the relevance of retrieved information.

5. **Multi-hop Retrieval**
   For complex queries, use iterative or multi-hop retrieval approaches. These methods perform multiple rounds of retrieval, refining the search based on intermediate results.

6. **Caching and Optimization**
   Implement caching mechanisms to store frequently accessed documents or embeddings, reducing computation time for repeated queries.

7. **Relevance Scoring and Filtering**
   Develop custom relevance scoring mechanisms that consider multiple factors like semantic similarity, keyword matches, and document metadata to filter out irrelevant information effectively.

## Free and Easy Methodology for 2024

To implement this approach using free tools:

1. **Embedding Generation**: Use open-source models like SBERT (Sentence-BERT) or models available through Hugging Face for generating embeddings.

2. **Vector Database**: Set up an open-source vector database like Milvus or FAISS for efficient storage and retrieval.

3. **Preprocessing**: Utilize libraries like LangChain for document chunking and preprocessing.

4. **Retrieval Pipeline**: Implement a hybrid retrieval system combining semantic and keyword search using Python libraries like scikit-learn for traditional search and the vector database for semantic search.

5. **Integration with LLMs**: Use open-source LLMs or APIs that offer free tiers for integration with your retrieval system.

6. **Optimization**: Implement caching using simple key-value stores or more advanced caching systems like Redis (which offers a free tier).

This methodology addresses the main concerns raised about RAG while providing an efficient solution for large-scale document retrieval and utilization with LLMs. It's important to note that the field is rapidly evolving, and staying updated with the latest research and open-source tools is crucial for maintaining an effective system.

The reason RAG isn't ubiquitous despite being around for over a year is partly due to the rapid pace of innovation in this field. New techniques and optimizations are constantly being developed, and organizations are still in the process of understanding and implementing these advanced systems. Additionally, the complexity of setting up and maintaining such systems, especially for very large datasets, can be a barrier for some organizations.

By focusing on this hybrid approach that combines the best of semantic and traditional search, along with advanced preprocessing and optimization techniques, you can create a system that efficiently handles large amounts of data for LLM use in 2024.

### Sources

- [JAMIA The Practice of Informatics](https://www.semanticscholar.org/paper/efc30bd04b8f784e5b923cfa18d5a91ce45cad29)
- [Waste Management In India With Special Reference To Ahmedabad City](https://www.semanticscholar.org/paper/c175af01596364e139d94d66696f0ba5024ba926)
- [A Systematic Review of Organizational Resilience Through Digital Technology Adoption: Trends and Insights in a Decade](https://www.semanticscholar.org/paper/82044a130dcd0cb2eb2c5fe17cda8bf48949af74)
- [Goldilocks and the Three Market Trends Shaping Q3 2024: Earnings, AI Adoption, Price Stability Take Center Stage](https://www.semanticscholar.org/paper/a79ff4ec0a03fd34cc3a8cab35a2511a67bb8590)
- [Recent Trends in Renewable Energy Adoption and their Economic Implications](https://www.semanticscholar.org/paper/800c4361af5f790fab5ddf2fc27a5583c5c340ee)
- [Comprehensive Bibliometric Analysis of UTAUT and AI Integration in Business and Management Trends (2015-2024)](https://www.semanticscholar.org/paper/bc16ba5df0c7f41faa8d3f9b81e0cdafb7cb722e)
