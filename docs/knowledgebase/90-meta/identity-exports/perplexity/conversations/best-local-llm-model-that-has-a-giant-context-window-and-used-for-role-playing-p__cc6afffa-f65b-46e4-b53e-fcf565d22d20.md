---
source_url: "https://www.perplexity.ai/search/d59e63dc-4d3e-4525-8420-8ec46a3c04f9"
thread_uuid: "cc6afffa-f65b-46e4-b53e-fcf565d22d20"
slug: "d59e63dc-4d3e-4525-8420-8ec46a3c04f9"
title: "Best Local LLM model that has a giant context window, and used for role playing purposes...?

Basically looking to feed it a giant dialog containing the character's file in system prompt and say 'act as character X'"
extracted_at: "2026-06-29T16:12:47.351Z"
matched_keywords: []
export_suite: "identity"
entry_count: 4
provenance: perplexity-rest-api
---

# Best Local LLM model that has a giant context window, and used for role playing purposes...?

Basically looking to feed it a giant dialog containing the character's file in system prompt and say 'act as character X'

Source: [Perplexity thread](https://www.perplexity.ai/search/d59e63dc-4d3e-4525-8420-8ec46a3c04f9)

## User

Best Local LLM model that has a giant context window, and used for role playing purposes...?

Basically looking to feed it a giant dialog containing the character's file in system prompt and say 'act as character X'

## Assistant

For local deployment of a role-playing LLM with a large context window, there are several strong options available, each with its own strengths. Below are some of the best models that meet your requirements of handling giant context windows and being suitable for role-playing scenarios:

## **1. Yi-34B-200K**
The **Yi-34B-200K** model is one of the top choices for long-context applications, offering an impressive 200K token context window. This makes it ideal for scenarios where you need to feed in large character files or long dialogues without losing coherency. It has been praised for its instruction-following capabilities, storytelling, and ability to maintain coherence over extended interactions, which is crucial for role-playing purposes. Users have reported that it performs well up to 43k contexts without significant degradation, making it a reliable option for detailed and immersive role-playing sessions.[1][9]

### Key Features:
- **Context Window**: Up to 200K tokens.
- **Role-playing Capabilities**: Excellent at following instructions and maintaining character profiles.
- **Performance**: Handles complex multi-turn conversations and can recall information accurately even in long dialogues.[9][10]

## **2. Nous Capybara 34B**
The **Nous Capybara 34B** model is another excellent option, especially for those who prioritize coherency in longer contexts. It has been tested to work effectively with up to 43k tokens, making it a great choice for role-playing scenarios where you need the model to remember character details over extended interactions. It is built on the Yi-34B architecture but fine-tuned specifically for conversational tasks, which improves its performance in creative and narrative-driven tasks like role-playing.[8][1]

### Key Features:
- **Context Window**: Up to 43k tokens.
- **Role-playing Strengths**: Known for following instructions well and handling complex character interactions.
- **Performance**: Maintains high coherency in long contexts, making it suitable for detailed role-play.[8]

## **3. Miqu 70B**
If you have the hardware to support larger models, **Miqu 70B** is another strong candidate. It offers a context window of up to 32K tokens and is highly regarded for its intelligence and creativity in role-playing tasks. Users have noted that Miqu excels at maintaining character consistency over long dialogues and provides high-quality prose, making it ideal for immersive storytelling and role-play.[4][1]

### Key Features:
- **Context Window**: Up to 32k tokens.
- **Role-playing Capabilities**: Strong at maintaining character consistency and following complex instructions.
- **Performance**: High-quality prose and creative outputs make it suitable for detailed role-playing scenarios.[4]

## **4. Midnight-Miqu 70B**
A variation of Miqu, the **Midnight-Miqu 70B**, combines long-context capabilities (up to 32K tokens) with excellent storytelling abilities. This model is particularly suited for creative writing and interactive fiction, making it a good fit for role-playing applications where narrative depth is important. It can handle long-form contexts while maintaining coherence in character actions and dialogue.[9]

### Key Features:
- **Context Window**: Up to 32k tokens.
- **Role-playing Strengths**: Excellent at generating narrative content and maintaining character authenticity over long sequences.
- **Performance**: Strong storytelling capabilities with long-context handling.[9]

## Conclusion
For your specific use case of feeding large dialogue or character files into the system prompt and instructing the model to "act as character X," both the **Yi-34B-200K** and **Nous Capybara 34B** stand out as top choices due to their massive context windows (up to 200K and 43K tokens respectively) and their proven ability to handle multi-turn conversations without losing coherency. If you have the hardware capacity, the **Miqu 70B** series also offers excellent performance with a slightly smaller but still substantial context window (32K tokens), making it another strong contender.

These models can be run locally using platforms like SillyTavern or Oobabooga's text-generation UI, depending on your setup.[3][4]

### Sources

- [Best LLM with large context window? Not for coding in Feb 2024](https://www.reddit.com/r/LocalLLaMA/comments/1aldqx1/best_llm_with_large_context_window_not_for_coding/)
  - The most coherent Yi 200k model was Nous Cappybara 34b; it was near PERFECT coherency up to 43k context.
- [Which is the best open source language model with large context ...](https://www.reddit.com/r/LocalLLaMA/comments/18aoy4v/which_is_the_best_open_source_language_model_with/)
  - Yi-34b-200k is a base model. I am looking for instruction tuned models with long context. Will try out the mistral and llama 2 32k.
- [Good opens source model(s) for story telling and role play? - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1ai8w36/good_opens_source_models_for_story_telling_and/)
  - I am looking for a model that can be used for role-playing and telling storys. I want to use an opensource Ai model to create a text based ...
- [Miqu science for RP (settings) : r/SillyTavernAI - Reddit](https://www.reddit.com/r/SillyTavernAI/comments/1b2mpg4/miqu_science_for_rp_settings/)
  - Miqu science for RP (settings). Miqu 70b seems to be the strongest model for rp at the moment. Maybe some of the 120b franken models can do ...
- [‍  LLM Comparison/Test: 2x 34B Yi (Dolphin, Nous Capybara) vs. 12x ...](https://www.reddit.com/r/LocalLLaMA/comments/17vcr9d/llm_comparisontest_2x_34b_yi_dolphin_nous/)
  - But even at 2-bit, the GGUF was too slow for regular usage, unfortunately. Amazingly, Nous Capybara 34B did it: A 34B model beating all 70Bs ...
- [Yet Another Awesome Roleplaying Model Review (RPMerge) - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1ancmf2/yet_another_awesome_roleplaying_model_review/)
  - After Yi-34B-200K-AEZAKMI-v2 I started my quest of experimenting with various hyperparameters and ways of combining rawrr and aezakmi datasets, ...
- [brucethemoose/Yi-34B-200K-RPMerge · Possibly my new favourite ...](https://huggingface.co/brucethemoose/Yi-34B-200K-RPMerge/discussions/2)
- [Nous Capybara 34B · Models - Dataloop](https://dataloop.ai/library/model/nousresearch_nous-capybara-34b/)
- [Yi 34B 200K RPMerge by Brucethemoose | AI model details](https://www.aimodels.fyi/models/huggingFace/yi-34b-200k-rpmerge-brucethemoose)
- [Yi 34B 200K · Models - Dataloop](https://dataloop.ai/library/model/01-ai_yi-34b-200k/)

## User

I'd like one that is already hosted online and providing an api, preferably free, please.

## Assistant

If you're looking for an **online-hosted LLM with an API**, suitable for role-playing and capable of handling large context windows, here are some good options that also offer free tiers or trials:

## **1. OpenRouter**
OpenRouter provides access to multiple models, including **Llama 2**, **Mistral**, and others. It offers a free tier with access to various models, making it a great option for role-playing use cases. You can use the API to set system prompts like "act as character X" and feed it large dialogues.

- **Free Tier**: Yes, with access to several models.
- **Models Available**: Llama 2, Mistral, and more.
- **Context Window**: Varies by model, but Llama 2 supports up to 4K tokens.
  
This is a good starting point if you want flexibility in model choice and free access.[1]

## **2. PPLX Labs API**
PPLX Labs offers an API for open-source models like **Mistral 7B**, **Llama 2 (13B and 70B)**, and **CodeLlama**. It's designed for fast inference and supports long-context applications. This could be ideal for role-playing scenarios where you need the model to maintain character consistency over extended dialogues.

- **Free Tier**: Yes, with API access.
- **Models Available**: Mistral 7B, Llama 2 (13B & 70B), CodeLlama.
- **Context Window**: Up to 8K tokens for some models.

This is a strong option if you need fast responses and reliable performance for role-playing.[2]

## **3. Groq.com**
Groq provides free access to powerful models like **Llama 70B** and others. It is known for its high-speed inference, which might be beneficial for real-time role-playing applications. You can use their API to generate responses based on large character files and prompts.

- **Free Tier**: Yes.
- **Models Available**: Llama 70B, Mixtral 8x7B, Gemini 1.5 Pro.
- **Context Window**: Large context windows supported (up to 4K tokens or more depending on the model).

This is a great choice if you need high-speed processing and large models without paying upfront.[1]

## **4. Cohere Command-R**
Cohere offers a free tier for their command-r series models, which are excellent for instruction-following tasks like role-playing. While the context window may not be as large as some other options (usually around 4K tokens), it is still sufficient for many role-playing scenarios.

- **Free Tier**: Yes.
- **Models Available**: Command-R and Command-R Plus.
- **Context Window**: Around 4K tokens.

Cohere's models are known for their instruction-following abilities, making them well-suited for acting as specific characters based on your prompts.[1]

## Conclusion
For a balance of long context windows, role-playing capabilities, and free access via an API, I recommend starting with either **OpenRouter** or the **PPLX Labs API**, both of which offer strong performance with flexible model options. If speed is a priority, consider using **Groq.com**, which provides access to powerful models like Llama 70B at no cost.

### Sources

- [Where Else Can We Get Free LLM API Keys? : r/ollama - Reddit](https://www.reddit.com/r/ollama/comments/1dlsdic/where_else_can_we_get_free_llm_api_keys/)
  - Cohere has a free tier for command-r and command-r-plus. They are amazing. Anthropic has a 2 week free trial. Openrouter has some free models.
- [Best Open Source LLMs of 2024 - Klu.ai](https://klu.ai/blog/open-source-llm-models)
- [Large Language Model API: Free Playground](https://blogs.novita.ai/lora-ai-art-generator-create-stunning-art-effortlessly/)

## User

Free LLM API v1

## Assistant

Here are some **free LLM APIs** that you can use for role-playing purposes, including feeding large dialogues and character files:

## **1. Hugging Face API**
Hugging Face offers access to a wide variety of open-source models, including **Llama 2**, **Mistral**, and **GPT-J**, through their API. Many of these models are available for free with limited usage quotas, making it a great option for experimenting with role-playing scenarios.

- **Free Tier**: Yes, with limited usage.
- **Context Window**: Varies by model, but Llama 2 supports up to 4K tokens.
- **Key Models**: Llama 2, GPT-J, Mistral.
  
Hugging Face's community-driven model hub is constantly updated with new models, and their API is easy to integrate into applications.

## **2. Together.ai**
Together.ai provides free access to several LLMs, including **Llama 2** and other powerful models. They offer a generous free tier for developers, which can be useful for projects that require role-playing capabilities.

- **Free Tier**: Yes, with $25 worth of free usage.
- **Context Window**: Varies by model (up to 8K tokens for some models).
  
This platform is ideal if you're looking for an easy-to-use API with access to multiple LLMs.

## **3. Eden AI**
Eden AI aggregates multiple AI providers into one API, allowing you to choose from various LLMs such as **Jurassic-2**, **Claude 2**, and **Llama 2**. They offer a free tier with $10 credits to get started.

- **Free Tier**: Yes, $10 credits upon signup.
- **Context Window**: Up to 8K tokens depending on the model.
  
Eden AI simplifies the integration process by offering a standardized API across different providers.

## **4. ShaleProtocol**
ShaleProtocol provides free access to the **Llama-2-7b-chat-hf** model with a generous quota of free calls. This could be a good option if you're looking for a simple way to integrate an LLM into your project without worrying about hosting.

- **Free Tier**: Yes, generous free quota.
- **Context Window**: Up to 4K tokens.

## **5. Google Cloud AI (Gemini Models)**
Google Cloud offers free access to its new **Gemini models**, which feature multimodal capabilities and large context windows (up to 2M tokens). This makes it ideal for more complex role-playing scenarios where you need the model to remember extensive character information.

- **Free Tier**: Yes, up to 500K characters per month.
- **Context Window**: Up to 2M tokens for Gemini models.

## Conclusion
For your use case of role-playing with large context windows, I recommend starting with either **Hugging Face** or **Together.ai**, both of which offer flexible access to powerful models with free tiers. If you need even larger context windows, consider using Google's Gemini models through Google Cloud AI Studio.

### Sources

- [[D] Are there any free LLMs for developers with API keys? - Reddit](https://www.reddit.com/r/MachineLearning/comments/1au64x1/d_are_there_any_free_llms_for_developers_with_api/)
  - Are there any LLMs that will provide an API key for free that I can utilize for my project? I know ChatGPT has one, but it's only for around $11 ...
- [Best AI API's 2024 For Free](https://aimlapi.com/best-ai-apis-for-free)
  - Build AI Apps with AI/ML API's free access to top LLMs like Meta Llama 3 and GPT-4, Mixtral and Claude 3. Get your API key today and start innovating with ...
- [Free LLM Api](https://www.easiio.com/free-llm-api/)
- [Top Free LLM tools, APIs, and Open Source models - Eden AI](https://www.edenai.co/post/top-free-llm-tools-apis-and-open-source-models)
- [Top 5 Free Artificial Intelligence APIs for 2024 - QuickCreator](https://quickcreator.io/quthor_blog/top-5-free-artificial-intelligence-apis-of-2024/)
- [10+ AI Tools You Can Start Using For Free | Google Cloud](https://cloud.google.com/use-cases/free-ai-tools?hl=vi)

## User

What free apis are people using for discord chatbots, specifically LLMs

## Assistant

Here are some **free APIs** that people commonly use for integrating **LLMs into Discord chatbots**, specifically for creating conversational AI experiences:

## **1. OpenAI API**
OpenAI's API is one of the most widely used for Discord chatbots due to its powerful models like **GPT-3.5** and **GPT-4**. Even though it has a paid tier, OpenAI offers a free trial with $5 in credits for new users, which can be enough for small-scale projects or initial testing.

- **Free Tier**: $5 in free credits.
- **Model**: GPT-3.5, GPT-4.
- **Usage**: Many Discord bots use OpenAI's API to provide natural language conversations and even role-playing features.
  
You can find many tutorials and GitHub repositories that integrate OpenAI's API with Discord bots, such as [LLMChat](8) and [llmcord](7), which support OpenAI-compatible APIs.

## **2. Hugging Face Inference API**
Hugging Face offers a wide range of open-source models, including **Llama 2**, **Mistral**, and **GPT-J**, through their Inference API. This is a popular choice for developers looking to integrate LLMs into Discord bots without paying upfront.

- **Free Tier**: Limited free usage (up to 30k tokens per month).
- **Models**: Llama 2, GPT-J, Mistral, and others.
- **Usage**: You can use Hugging Face's API to run models directly in your Discord bot by setting up an integration using libraries like `discord.py`.

Projects like [LLMChat](8) also support Hugging Face models, making it easy to switch between different LLMs.

## **3. PPLX API (Perplexity Labs)**
PPLX API is another excellent option for accessing open-source LLMs such as **Mistral 7B**, **Llama 2 (13B & 70B)**, and more. It offers fast inference speeds and is commonly used in Discord chatbots.

- **Free Tier**: Yes, with generous usage limits.
- **Models**: Mistral 7B, Llama 2 (13B & 70B), Code Llama.
  
This API is ideal if you want to integrate open-source models without paying for premium services. It supports various integrations with Discord bots like [llmcord](7).

## **4. Wit.ai**
Wit.ai, owned by Facebook, is another popular free option for building conversational bots on platforms like Discord. It provides robust natural language processing (NLP) capabilities and can be integrated easily into chatbots.

- **Free Tier**: Completely free.
- **Usage**: Wit.ai is particularly useful if you're building a chatbot that needs to understand specific commands or intents beyond just text generation.

This platform is well-documented and often recommended for developers who want to build simple conversational agents without the complexity of large LLMs.[3]

## **5. Ollama**
Ollama is a tool that allows you to run LLMs locally but also offers some cloud-hosted options. It supports models like **Llama 2**, **Falcon**, and others, and can be integrated with Discord via APIs.

- **Free Tier**: Free access to some models.
- **Models**: Llama 2, Falcon, WizardCoder.
  
Ollama provides flexibility if you want to run models locally or use their cloud-hosted versions for your Discord bot.[6]

## Conclusion
For building a free LLM

### Sources

- [How to build a LLM chat bot in Discord : r/Python - Reddit](https://www.reddit.com/r/Python/comments/17kn02r/how_to_build_a_llm_chat_bot_in_discord/)
  - It's a chat bot written in Python using the llama.cpp library that can be interacted with a Discord server using the discord api.
- [Chat with AI in Discord with an open source local LLM - YouTube](https://www.youtube.com/watch?v=-ikvkV1H9LA)
- [13 Best Open Source Chatbot Platforms to Use in 2024 - Botpress](https://botpress.com/blog/open-source-chatbots)
- [Large Language Model API: Free Playground](https://blogs.novita.ai/lora-ai-art-generator-create-stunning-art-effortlessly/)
- [Eidenz/Discord-VC-LLM: A discord bot LLM for Voice Chat (and text)](https://github.com/Eidenz/Discord-VC-LLM)
- [Best Open Source LLMs of 2024](https://klu.ai/blog/open-source-llm-models)
- [jakobdylanc/llmcord: A Discord LLM chat bot that supports ... - GitHub](https://github.com/jakobdylanc/llmcord)
- [hc20k/LLMChat: A Discord chatbot that supports popular ... - GitHub](https://github.com/hc20k/LLMChat)
- [llmcord (Discord) - Jan.ai](https://jan.ai/integrations/messaging/llmcord)
