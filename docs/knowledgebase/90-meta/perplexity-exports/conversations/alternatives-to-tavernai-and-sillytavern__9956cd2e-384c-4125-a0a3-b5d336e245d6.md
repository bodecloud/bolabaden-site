---
source_url: "https://www.perplexity.ai/search/6d4d82d0-810a-4428-81ff-e6aae4ddc9ed"
thread_uuid: "9956cd2e-384c-4125-a0a3-b5d336e245d6"
slug: "6d4d82d0-810a-4428-81ff-e6aae4ddc9ed"
title: "Alternatives to tavernai and sillytavern"
extracted_at: "2026-06-29T12:53:23.432Z"
matched_keywords: ["infrastructure","infra"]
entry_count: 6
provenance: perplexity-rest-api
---

# Alternatives to tavernai and sillytavern

Source: [Perplexity thread](https://www.perplexity.ai/search/6d4d82d0-810a-4428-81ff-e6aae4ddc9ed)

## User

Alternatives to tavernai and sillytavern

## Assistant

If you're looking for alternatives to TavernAI and SillyTavern, there are several options available, each with its own strengths and features. Here are some notable ones:

## **1. Voxta.ai**
Voxta is a versatile platform that supports two-way voice chat conversations, making it a good option for users who prefer voice interactions. It works with multiple language models and offers various speech-to-text and text-to-speech options. Users can host it locally and access it remotely via mobile devices, which adds flexibility.[1]

## **2. RealmPlay**
RealmPlay is an RP-focused platform that offers a custom AI model with 8K context and privacy features. It is designed for immersive role-playing experiences and includes both SFW and NSFW content options. While it is a paid service, it claims to be more cost-effective than using SillyTavern with OpenAI APIs. The platform also emphasizes long-term memory and customization features.[5]

## **3. AgnAIstic**
AgnAIstic is another alternative that focuses on role-playing but lacks some of the character import features available in SillyTavern. It is designed for users looking for a clean, immersive experience without needing to host models locally.[4][1]

## **4. RisuAI**
RisuAI focuses more on character avatars and has been described as being geared towards anime-style interactions or "waifus." It may not be as feature-rich as SillyTavern but offers a unique experience for those interested in character-driven interactions.[4]

## **5. Immersim AI**
Immersim AI is tailored for narrative-driven, safe-for-work (SFW) role-playing. It operates entirely on server-side models, so users do not need powerful hardware to run it. This makes it a good option for those seeking immersive storytelling without explicit content.[3]

## **6. NovelAI**
NovelAI is one of the most popular paid alternatives, offering multiple AI models fine-tuned for storytelling and role-playing. It has advanced features like image generation (anime-focused) and customizable models, making it a comprehensive choice for users willing to pay for high-quality outputs.[2]

## **7. ChatFAI**
ChatFAI is another paid chatbot platform similar to Chai but with more customization options. It offers different subscription tiers based on message limits and ongoing chats, making it suitable for users who want to create custom characters or engage in multiple conversations at once.[2]

## **8. Oogabooga Text-Generation-WebUI**
Oogabooga combines backend functionality with a frontend interface, making it popular among users looking for an all-in-one solution for text generation and role-playing. It's known for its flexibility in integrating various language models.[4]

These alternatives offer different strengths depending on your specific needs—whether it's voice interaction, advanced role-playing features, or cost-effective hosting solutions.

### Sources

- [Any good alternatives to ST i should know about while ...](https://www.reddit.com/r/SillyTavernAI/comments/1csteeu/any_good_alternatives_to_st_i_should_know_about/)
- [The Updated List of Alternatives : r/AIDungeon](https://www.reddit.com/r/AIDungeon/comments/10w4oh2/the_updated_list_of_alternatives/)
- [Is there a comparable platform to SillyTavern to have a non ...](https://www.reddit.com/r/SillyTavernAI/comments/1ez833b/is_there_a_comparable_platform_to_sillytavern_to/)
- [Alternatives to SillyTavern with better code quality and ...](https://www.reddit.com/r/SillyTavernAI/comments/1fs8h33/alternatives_to_sillytavern_with_better_code/)
- [RealmPlay: A SillyTavern alternative I've been working on ...](https://www.reddit.com/r/SillyTavernAI/comments/15c2ojv/realmplay_a_sillytavern_alternative_ive_been/)

## User

Imagine I have game assets representing Dialog, voiceover wav audio, character textures/models/animation. Best AI platform to use it with? Looking for open source Python libraries preferably.

Ideally keep dialog/vo in embeddings, then utilize past conversation history to represent current dynamic chat

## Assistant

For your project involving game assets like dialog, voiceover audio, and character models/animations, and the goal of creating a dynamic chat system that uses past conversation history, there are several open-source Python libraries and frameworks that could be useful. Here's a breakdown of the best options based on your requirements:

## **1. Rasa**
Rasa is one of the most powerful open-source frameworks for building conversational AI systems. It provides tools for natural language understanding (NLU) and dialogue management, which can be useful for handling dynamic conversations based on past history. Rasa also supports integration with external APIs and databases, allowing you to store conversation history and retrieve it when needed. For embeddings, you can use custom models to represent dialog and voiceover data.

- **Pros**: 
  - Advanced NLU and dialogue management.
  - Extensible with custom components.
  - Can integrate with vector databases for memory.
- **Cons**: 
  - Steeper learning curve compared to simpler chatbot libraries.
  
Rasa would allow you to manage the dialog dynamically and use embeddings to represent past conversations effectively.[4]

## **2. LangChain + Vector Databases**
LangChain is a popular framework for building applications that use language models. It has built-in support for managing conversation history through vector databases (like Pinecone or FAISS) by storing embeddings of past interactions. This makes it particularly suited for your goal of embedding dialog/voiceover data and recalling relevant past conversations.

- **Pros**:
  - Excellent support for long-term memory via vector stores.
  - Easy integration with various language models.
  - Flexible for storing embeddings of both text and audio data.
- **Cons**: 
  - Requires some setup to manage vector databases and embeddings.

LangChain's memory management can help you dynamically adjust conversations based on previous interactions.[5]

## **3. DeepPavlov**
DeepPavlov is another open-source library focused on conversational AI. It provides pre-trained models for various NLP tasks like intent recognition, named entity recognition, and dialogue management. DeepPavlov can be extended with custom models to handle game-specific dialog and voiceover data.

- **Pros**:
  - Pre-trained models for common NLP tasks.
  - Easy to extend with custom components like embeddings.
- **Cons**:
  - Less flexible than LangChain in terms of memory management.

DeepPavlov could be useful if you need a more out-of-the-box solution but still want some flexibility for customizations.[4]

## **4. ChatterBot**
ChatterBot is a simpler Python library that uses machine learning algorithms to generate responses based on conversation history. It can be customized to store conversation history in embeddings, though it does not have built-in support for vector databases like LangChain.

- **Pros**:
  - Simple to set up.
  - Customizable response generation.
- **Cons**:
  - Limited support for complex memory management compared to LangChain or Rasa.

ChatterBot might be a good choice if you're looking for something lightweight but still customizable.[4]

## **5. Mesop (for UI Integration)**
Mesop is an open-source Python UI framework that could be useful if you need a web-based interface to interact with your game assets (dialog, animations, etc.). It provides flexibility in building custom UIs entirely in Python, which could be helpful if you're integrating your conversational AI system into a game or web app.

- **Pros**:
  - Flexible UI framework built in Python.
  - Can handle complex chat rendering.
- **Cons**:
  - Not specifically designed for conversational AI but great for integrating UIs.[1]

## **6. LlamaIndex (formerly GPT Index)**
LlamaIndex is designed to help manage large document-based memory using embeddings and vector stores. You can use this tool to store dialog or voiceover data as embeddings and retrieve relevant information during conversations dynamically.

- **Pros**:
  - Excellent support for long-term memory through embedding-based retrieval.
  - Works well with large datasets like game scripts or dialog trees.
- **Cons**:
  - Requires integration with external storage solutions like vector databases.[5]

## **Conclusion**
For your specific needs—embedding dialog/voiceover data, utilizing past conversation history, and integrating game assets—**LangChain** combined with a vector database would likely be the best fit due to its strong support for memory management using embeddings. If you're looking for something more focused on conversational AI with built-in dialogue management, then **Rasa** would also be a strong contender.

If you also need a UI framework to integrate these capabilities into a web-based or game interface, consider using **Mesop** or another Python-based UI library like Streamlit or Gradio.

### Sources

- [Mesop, open-source Python UI framework used at Google ...](https://www.reddit.com/r/LocalLLaMA/comments/1d8g5j1/mesop_opensource_python_ui_framework_used_at/)
- [What is the best python library for chatbot UIs? : r/Streamlit](https://www.reddit.com/r/Streamlit/comments/1dlrqcl/what_is_the_best_python_library_for_chatbot_uis/)
- [GPTHistory: Search your chatgpt conversation history ...](https://www.reddit.com/r/ChatGPTPro/comments/15auzwg/gpthistory_search_your_chatgpt_conversation/)
- [Top 5 Open-Source Python Libraries for Building Chatbots ...](https://www.reddit.com/r/OpenSourceHub/comments/1aqkkhc/top_5_opensource_python_libraries_for_building/)
- [Help with getting started implementing long-term memory ...](https://www.reddit.com/r/LocalLLaMA/comments/13nlrzp/help_with_getting_started_implementing_longterm/)

## User

Is deeppavlov or rasa compatible with tavern ai? Otherwise what is compatible with tavern ai if I want entirely Python impl

## Assistant

**TavernAI** and **SillyTavern** are primarily front-end interfaces that are designed to interact with large language models (LLMs) like GPT-based models (OpenAI, KoboldAI, etc.) for role-playing and dynamic chat experiences. While they excel in providing a user-friendly interface for interacting with LLMs, they don't natively integrate with frameworks like **Rasa** or **DeepPavlov**, which are more focused on structured conversational AI and dialogue management.

### Compatibility of Rasa and DeepPavlov with TavernAI
- **Rasa** and **DeepPavlov** are not directly compatible with TavernAI out of the box. TavernAI is designed to work with large language models rather than structured dialogue systems. However, you could theoretically build a middleware layer that connects Rasa or DeepPavlov to TavernAI, but this would require significant customization.
  - **Rasa**: Rasa is designed for task-oriented bots, where you define intents, entities, and dialogue flows. It’s more suited for customer service bots or assistants rather than free-form role-playing chat.
  - **DeepPavlov**: Similar to Rasa, DeepPavlov is focused on structured conversations, though it offers more flexibility in NLP tasks. It also doesn’t align well with the free-form nature of TavernAI.

### What is Compatible with TavernAI for Python-Based Implementations?
If you're looking for an entirely Python-based implementation that is compatible with TavernAI or SillyTavern, here are some options:

#### 1. **KoboldAI**
- **KoboldAI** is a popular backend used with TavernAI. It supports various models (GPT-J, GPT-NeoX, etc.) and can be run locally using Python. It allows you to load models and interact with them via a web interface like TavernAI.
- **Why it fits**: KoboldAI provides the flexibility to run large language models locally using Python, making it a good fit for dynamic chat experiences like those offered by TavernAI.

#### 2. **Oogabooga's Text Generation WebUI**
- This is another Python-based solution that offers a web interface for interacting with various large language models (LLMs). It’s highly customizable and can be integrated into TavernAI or SillyTavern setups.
- **Why it fits**: Like KoboldAI, Oogabooga’s WebUI allows you to run models locally in Python and interact with them through a web interface.

#### 3. **LangChain + Vector Databases (e.g., FAISS or Pinecone)**
- If you're looking to integrate memory into your chatbot system (i.e., storing conversation history as embeddings), you can use **LangChain** in combination with vector databases like FAISS or Pinecone. While this setup would not directly plug into TavernAI, you could create a custom backend that manages conversation history and passes relevant context to the LLM running in TavernAI.
- **Why it fits**: LangChain allows you to manage dynamic conversations by storing embeddings of past interactions, which aligns well with your goal of using past conversation history.

### Custom Integration Approach
If you're set on using something like Rasa or DeepPavlov:
1. You would need to build a custom middleware that takes the output from Rasa/DeepPavlov and feeds it into the LLM running in TavernAI.
2. You could use Rasa/DeepPavlov for structured conversations (e.g., handling specific game mechanics or tasks) while still relying on the LLM for free-form role-playing chat.
3. This hybrid setup would require custom Python code to bridge the two systems.

### Conclusion
If you want an entirely Python-based implementation compatible with TavernAI:
- Use **KoboldAI** or **Oogabooga's Text Generation WebUI** as they are already widely used backends for TavernAI.
- For advanced memory management (keeping track of past conversations), consider integrating **LangChain** with vector databases.
  
Rasa and DeepPavlov are not directly compatible but could be integrated through custom middleware if needed. However, these frameworks are better suited for structured dialogue systems rather than the free-form role-playing style typically used in TavernAI.

### Sources

- [Top 5 Open-Source Python Libraries for Building Chatbots and Conversational AI](https://www.reddit.com/r/OpenSourceHub/comments/1aqkkhc/top_5_opensource_python_libraries_for_building/)

## User

What is koboldai

## Assistant

**KoboldAI** is an open-source platform designed to run various large language models (LLMs) locally or through cloud services like Google Colab. It is particularly popular for creative writing, role-playing, and interactive storytelling. Here’s a detailed overview of its key features:

### **Key Features of KoboldAI:**

1. **Local Model Hosting:**
   - KoboldAI allows users to run AI models locally on their own hardware, which provides more control over the models and avoids the need for external APIs like OpenAI or AI Dungeon.
   - It supports a wide range of models, including fine-tuned versions of **GPT-NeoX**, **OPT**, and other large-scale models, giving users flexibility in choosing the model that best fits their needs.

2. **Frontend Interface:**
   - KoboldAI provides a user-friendly interface for interacting with these models. It can be used as a frontend for running AI models locally or via Google Colab.
   - The interface includes advanced features like **text-to-speech**, **image generation**, and **customizable themes** to enhance user experience.[3]

3. **Customization and Flexibility:**
   - Users can create and customize character profiles, world information (lore), and other elements that the AI can use to generate contextually relevant responses.[1]
   - It also supports "world info" modes, where users can store background information about characters or settings that the AI will reference during interactions.

4. **Google Colab Integration:**
   - For users who do not have powerful local hardware, KoboldAI offers integration with Google Colab, allowing them to run larger models in the cloud without needing a local setup.[2]

5. **Memory Management:**
   - KoboldAI has features for managing memory and conversation history, which can help in generating more coherent responses based on past interactions.
   - The platform also supports **phrase biasing** and other advanced techniques to guide the AI's output more effectively.[3]

6. **Community-Driven Development:**
   - KoboldAI is actively developed by a community of contributors, with frequent updates that add new features and improve performance. The recent UI2 update introduced significant enhancements like better memory management, phrase biasing, and text-to-speech improvements.[3]

### **Use Cases:**

- **Role-Playing Games (RPGs):** KoboldAI is often used in conjunction with frontends like TavernAI for immersive role-playing experiences where users interact with AI-generated characters.
- **Creative Writing:** Writers use KoboldAI to generate story ideas, dialogue, or entire narrative sequences based on prompts.
- **Interactive Storytelling:** The platform is ideal for creating dynamic stories where the AI responds to user input in real-time.

### **How It Works with TavernAI:**
KoboldAI can be used as a backend for platforms like TavernAI or SillyTavern, which are front-end interfaces designed for interactive chat experiences. By running KoboldAI locally or via Colab, you can connect it to these interfaces to provide dynamic chat capabilities using large language models.

### **Conclusion:**
KoboldAI is a powerful tool for anyone looking to run large language models locally or via cloud services like Google Colab. Its flexibility, customization options, and integration with platforms like TavernAI make it an excellent choice for creative writing, role-playing games, and interactive storytelling scenarios.

### Sources

- [KoboldAI Concept Feature: Character Profile](https://www.reddit.com/r/KoboldAI/comments/1093xsw/koboldai_concept_feature_character_profile/)
- [The Updated List of Alternatives](https://www.reddit.com/r/AIDungeon/comments/10w4oh2/the_updated_list_of_alternatives/)
- [New UI is released to united! - KoboldAI](https://www.reddit.com/r/KoboldAI/comments/zs8ksc/new_ui_is_released_to_united/)

## User

KoboldAI vs petals? Which came first? What’s the difference

## Assistant

**KoboldAI** and **Petals** are both open-source platforms that enable users to interact with large language models (LLMs), but they serve different purposes and have distinct architectures. Here's a comparison of the two, including which came first and their main differences:

### **KoboldAI**
- **Release Timeline**: KoboldAI has been around since at least 2021. It was initially designed as a platform for running large language models locally or via cloud services like Google Colab. It primarily supports models like **GPT-2**, **GPT-J**, and **GPT-NeoX**.
- **Purpose**: KoboldAI is focused on creative writing, role-playing, and interactive storytelling. It provides a user-friendly interface that allows users to interact with text-generation models in various ways, such as generating stories or playing text-based games.
- **Model Support**: KoboldAI supports a range of models, including GPT-J, GPT-NeoX, and OPT. Users can load custom models from Hugging Face or use pre-configured ones.
- **Architecture**: KoboldAI is designed for local hosting or cloud-based use (via Google Colab or Kaggle). It provides a web-based interface where users can interact with the models, customize settings, and manage memory (e.g., conversation history).
- **Use Cases**:
  - Creative writing
  - Role-playing games (RPGs)
  - Interactive storytelling
  - AI-assisted writing tools

### **Petals**
- **Release Timeline**: Petals was introduced later, in mid-2023, as part of the BigScience project. It is built around the **BLOOM** model (BigScience Large Open-science Open-access Multilingual Language Model), which was released in 2022.
- **Purpose**: Petals is designed for distributed inference and fine-tuning of large-scale language models like BLOOM. It allows users to run parts of a model on their own hardware while offloading other parts to a distributed network of nodes.
- **Model Support**: Petals primarily supports the BLOOM family of models (BLOOM and BLOOMZ), which are multilingual and designed for a wide range of tasks, including text generation, translation, summarization, etc.
- **Architecture**: Petals is unique because it uses a decentralized approach to model inference. Users can contribute their own computing resources to the network to help run large models that would otherwise be too resource-intensive for individual machines. This allows users with limited hardware to run very large models by sharing the load across multiple nodes.
- **Use Cases**:
  - Distributed inference for large-scale LLMs
  - Fine-tuning large models like BLOOM
  - Collaborative AI research

### **Key Differences**
| Feature                   | KoboldAI                                      | Petals                                        |
|----------------------------|----------------------------------------------|-----------------------------------------------|
| **Release Date**            | Early 2021                                   | Mid-2023                                      |
| **Primary Models Supported**| GPT-J, GPT-NeoX, GPT-2                       | BLOOM, BLOOMZ                                 |
| **Architecture**            | Local hosting or cloud-based (Colab/Kaggle)  | Decentralized/distributed inference           |
| **Main Use Case**           | Creative writing, role-playing               | Distributed inference and fine-tuning         |
| **Hardware Requirements**   | Can run locally with sufficient GPU          | Shares model load across multiple nodes       |
| **Customization Options**   | Customizable settings for text generation    | Fine-tuning via distributed network           |

### Which Came First?
KoboldAI came first (around 2021), while Petals was introduced in mid-2023 as part of the BigScience project.

### Conclusion:
- If you're looking for an open-source platform focused on creative writing and interactive storytelling with local or cloud-hosted models, **KoboldAI** is the better choice.
- If you need to run very large models like BLOOM but lack the necessary hardware resources, or you're interested in contributing to a decentralized network for running LLMs, then **Petals** would be more suitable.

Both platforms are valuable depending on your needs—KoboldAI excels in creative applications with flexible model support, while Petals offers an innovative decentralized approach to handling massive LLMs like BLOOM.

### Sources

- [Guide to run Koboldai on Kaggle instead of Google colab ...](https://www.reddit.com/r/KoboldAI/comments/13gf5iw/guide_to_run_koboldai_on_kaggle_instead_of_google/)
- [Selfhosted AI](https://www.reddit.com/r/selfhosted/comments/11g776r/selfhosted_ai/)
- [The Updated List of Alternatives](https://www.reddit.com/r/AIDungeon/comments/10w4oh2/the_updated_list_of_alternatives/)
- [Unable to install Kobold : r/KoboldAI](https://www.reddit.com/r/KoboldAI/comments/1543nnj/unable_to_install_kobold/)
- [[D] Totally Open Alternatives to ChatGPT : r/MachineLearning](https://www.reddit.com/r/MachineLearning/comments/11uk8ti/d_totally_open_alternatives_to_chatgpt/)

## User

Why is petals not as popular ? Like seems like nobody runs it. What issues does it have? Why not setup nonprofit hosting for it

## Assistant

**Petals** is a decentralized platform designed for running large language models (LLMs) like **BLOOM** across a distributed network of machines. While it offers an innovative approach to sharing the computational load of running massive models, it has not gained widespread popularity for several reasons, including technical limitations, privacy concerns, and ease of use. Let’s break down the key issues and why it's not as widely adopted as platforms like **KoboldAI**.

### **Why Petals Is Not as Popular**

1. **Data Privacy and Security Concerns**:
   - One of the biggest concerns with Petals is **data privacy**. Since it relies on distributed computing, user data is processed across multiple nodes, often run by different individuals or organizations. This raises questions about how secure the data is during inference. As one user pointed out, "data cannot be processed in an encrypted fashion; it always needs to be decrypted to run across the sharded models". This makes it risky for users who are concerned about sensitive information being exposed during processing.[1]
   - In contrast, running models locally (as with **KoboldAI**) ensures that all data stays on your machine, which is a significant advantage for privacy-conscious users.

2. **Latency and Performance Issues**:
   - Distributed inference introduces significant **latency**. When a model like BLOOM is split across multiple machines, each machine needs to communicate with others to generate tokens. This communication can introduce delays, especially when machines are geographically distant or have varying hardware capabilities. As one user explained, "the latency between each computer is 100 ms," which can result in very slow token generation times.[3]
   - For example, generating 500 tokens could take several minutes due to this latency. This makes Petals less practical for real-time applications where speed is important.

3. **Complexity and Usability**:
   - Petals is seen as somewhat **intimidating** to set up and use. While the concept of decentralized LLMs is appealing, users have noted that the documentation and setup process can be complex. One user mentioned that for Petals to really take off, it would need to be "as easy to use as possible" with a quickstart involving "downloading a single binary and running it".[1]
   - In comparison, platforms like **KoboldAI** offer more straightforward setups with local hosting options or easy integration with Google Colab. KoboldAI also has a more mature ecosystem with better community support and easier integration with GUIs like TavernAI.

4. **Lack of Incentives**:
   - Another issue with Petals is the lack of an incentive model for users contributing their computing resources. Unlike systems like **BitTensor**, which reward users for contributing compute power, Petals relies on voluntary contributions without any form of compensation or reward. This limits its scalability because there’s no strong motivation for people to contribute their hardware.[1]
   - Without an incentive model or clear benefits for contributors, it's harder to build a large and reliable network of nodes.

5. **Model Limitations**:
   - Petals primarily supports the **BLOOM** family of models, which are large but not necessarily the most versatile or popular models in certain communities (e.g., those using LLaMA or GPT-based models). Users who prefer other models may not find Petals as useful because they would need to convert models into a format compatible with Petals.[1]

### **Why Not Set Up Nonprofit Hosting for Petals?**
While setting up nonprofit hosting for Petals could theoretically address some issues (e.g., providing reliable infrastructure), there are several challenges:

1. **Infrastructure Costs**: Hosting large-scale LLMs requires significant computational resources (GPUs) and fast internet connections. Even if done on a nonprofit basis, the costs associated with maintaining servers capable of handling large models like BLOOM would be substantial.
   
2. **Technical Complexity**: Setting up a robust infrastructure for decentralized inference involves managing worker servers (with GPUs), coordinator servers (for reliability), and ensuring low-latency communication between them. This requires technical expertise and ongoing maintenance.[1]

3. **Privacy Concerns Remain**: Even with nonprofit hosting, privacy concerns would persist unless there’s a way to ensure that data processed through the network remains secure. Users may still prefer local solutions where they have full control over their data.

4. **Lack of Incentive Model**: Without some form of incentive (financial or otherwise), it may be difficult to attract enough contributors willing to donate their computing power consistently.

### **KoboldAI vs Petals**
- **KoboldAI** focuses on local or cloud-based hosting of LLMs like GPT-J and GPT-NeoX and has gained popularity due to its ease of use, privacy advantages (since everything can be run locally), and compatibility with popular frontends like TavernAI.
- **Petals**, while innovative in its decentralized approach, faces challenges related to privacy, latency, complexity, and lack of incentives that have hindered its widespread adoption.

### Conclusion
Petals is an exciting project in theory but faces several practical hurdles that limit its adoption—chief among them being privacy concerns, performance issues due to latency in distributed inference, and usability challenges. While nonprofit hosting could help alleviate some infrastructure issues, it wouldn’t solve the core problems related to privacy and incentives for contributors. For now, platforms like KoboldAI remain more popular due to their simplicity, local control over data, and broader model support.

### Sources

- [Petals: decentralized inference and finetuning of LLMs](https://www.reddit.com/r/LocalLLaMA/comments/150ftob/petals_decentralized_inference_and_finetuning_of/)
- [Top 5 Open-Source Python Libraries for Building Chatbots and Conversational AI](https://www.reddit.com/r/OpenSourceHub/comments/1aqkkhc/top_5_opensource_python_libraries_for_building/)
- [Is there a technical reason that distributed LLMs don't exist?](https://www.reddit.com/r/LocalLLaMA/comments/17u5t4n/is_there_a_technical_reason_that_distributed_llms/)
