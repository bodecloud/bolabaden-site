---
source_url: "https://www.perplexity.ai/search/50a96202-5462-4689-8e8a-9262423e1c83"
thread_uuid: "e8965a6d-bb4d-4db0-a187-b2b167d2a752"
slug: "50a96202-5462-4689-8e8a-9262423e1c83"
title: "What free apis are people using for discord chatbots, specifically LLMs. Building a backend. 2024 answers only. Must be free"
extracted_at: "2026-06-29T16:12:45.258Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# What free apis are people using for discord chatbots, specifically LLMs. Building a backend. 2024 answers only. Must be free

Source: [Perplexity thread](https://www.perplexity.ai/search/50a96202-5462-4689-8e8a-9262423e1c83)

## User

What free apis are people using for discord chatbots, specifically LLMs. Building a backend. 2024 answers only. Must be free

## Assistant

In 2024, developers are using several free APIs and tools to build Discord chatbots powered by Large Language Models (LLMs). Below are some of the most popular free options:

## **1. Llama.cpp with GGML Models**
Llama.cpp is a popular option for running LLMs locally without needing cloud services. It supports models like LLaMA, which can be run efficiently on local hardware. This setup allows developers to avoid API costs entirely by hosting the model themselves. A tutorial for building a Discord bot using Llama.cpp and the Discord API is available, making it a great starting point for those looking to create a chatbot without relying on paid services.[1]

## **2. OpenAI GPT-3.5 Turbo (Free Tier)**
OpenAI offers a free tier with $18 worth of credits, which can be used to access GPT-3.5 Turbo. While this is not entirely free indefinitely, it provides enough credits for small-scale projects or initial development phases. This model is significantly cheaper than previous versions, making it accessible for developers looking to integrate sophisticated LLMs into their Discord bots without incurring high costs.[2]

## **3. Ollama (Self-Hosted)**
For those who prefer self-hosting but need more power than a local machine can provide, Ollama offers a containerized solution that allows developers to run LLMs on their own infrastructure. This method eliminates the need for paid API services like OpenAI and gives developers full control over their models and data. Projects like "Discord Ollama" have demonstrated how this can be done efficiently, especially when paired with powerful GPUs.[5]

## **4. Wit.ai**
Wit.ai is an open-source platform owned by Facebook that provides a robust API for building conversational agents. It integrates easily with platforms like Discord and is completely free to use. Wit.ai’s natural language processing capabilities make it a solid choice for developers who want to build chatbots without incurring costs or managing complex backend infrastructure.[4]

## **5. llmcord (Supports Multiple LLMs)**
Llmcord is another open-source project that allows users to connect various LLMs (both local and remote) to Discord. It supports multiple providers, including OpenAI-compatible APIs and self-hosted models like Ollama or LLaMA. This flexibility makes it an excellent choice for developers who want to experiment with different models without being locked into one provider.[3]

### Summary of Free APIs:
| API/Tool         | Description                                                                 | Free Options                                                                 |
|------------------|-----------------------------------------------------------------------------|------------------------------------------------------------------------------|
| **Llama.cpp**    | Local hosting of GGML-based models like LLaMA                               | Free if hosted locally                                                       |
| **OpenAI GPT-3.5**| GPT-3.5 Turbo with $18 free credits                                         | Free tier available, sufficient for small projects                           |
| **Ollama**       | Self-hosted containerized LLMs                                              | Free if self-hosted                                                          |
| **Wit.ai**       | Open-source NLP platform owned by Facebook                                  | Completely free                                                              |
| **llmcord**      | Supports multiple LLMs (OpenAI, Ollama, etc.)                               | Free if using self-hosted or open-source models                              |

These options provide flexibility depending on whether you prefer local hosting or leveraging free cloud credits for your Discord chatbot project.

### Sources

- [How to build a LLM chat bot in Discord : r/Python - Reddit](https://www.reddit.com/r/Python/comments/17kn02r/how_to_build_a_llm_chat_bot_in_discord/)
  - It's a chat bot written in Python using the llama.cpp library that can be interacted with a Discord server using the discord api.
- [Create a ChatGPT AI Discord Bot (READ PINNED COMMENT)](https://www.youtube.com/watch?v=CB76_GDrPsE)
- [jakobdylanc/llmcord: A Discord LLM chat bot that supports ... - GitHub](https://github.com/jakobdylanc/llmcord)
- [13 Best Open Source Chatbot Platforms to Use in 2024 - Botpress](https://botpress.com/blog/open-source-chatbots)
- [AI LLMs Grow Into A Vibrant Discord Bot Project - Gonzaga University](https://www.gonzaga.edu/news-events/stories/2024/8/30/discord-bot)
- [The 3 Top AI Chatbot APIs To Use In 2024 - Locusive](https://www.locusive.com/resources/best-chatbot-apis)
