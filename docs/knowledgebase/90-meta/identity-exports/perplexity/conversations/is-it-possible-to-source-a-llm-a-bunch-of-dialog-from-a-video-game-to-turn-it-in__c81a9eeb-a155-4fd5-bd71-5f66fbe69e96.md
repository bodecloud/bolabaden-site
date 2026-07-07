---
source_url: "https://www.perplexity.ai/search/74b2be20-cbc4-4ae7-abfd-2b117bea405b"
thread_uuid: "c81a9eeb-a155-4fd5-bd71-5f66fbe69e96"
slug: "74b2be20-cbc4-4ae7-abfd-2b117bea405b"
title: "is it possible to source a LLM a bunch of dialog from a video game to turn it into chatbot? What is the most widely adopted, recommended method that does not involve pretraining? Must run on mid-end hardware, and must be pretrained for this purpose. Large context window and low resource usage. What exists?

Specifically with the system prompt only. User-level tutorials only."
extracted_at: "2026-06-29T16:12:44.374Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# is it possible to source a LLM a bunch of dialog from a video game to turn it into chatbot? What is the most widely adopted, recommended method that does not involve pretraining? Must run on mid-end hardware, and must be pretrained for this purpose. Large context window and low resource usage. What exists?

Specifically with the system prompt only. User-level tutorials only.

Source: [Perplexity thread](https://www.perplexity.ai/search/74b2be20-cbc4-4ae7-abfd-2b117bea405b)

## User

is it possible to source a LLM a bunch of dialog from a video game to turn it into chatbot? What is the most widely adopted, recommended method that does not involve pretraining? Must run on mid-end hardware, and must be pretrained for this purpose. Large context window and low resource usage. What exists?

Specifically with the system prompt only. User-level tutorials only.

## Assistant

Yes, it is **possible** to use a Large Language Model (LLM) to turn video game dialog into a chatbot. Here's a step-by-step guide on how to do this using a system prompt and without pretraining, focusing on methods suitable for mid-end hardware:

### Step 1: Collecting Dialog Data
- **Source the Dialog**: You can source dialog from video games by using game scripts, subtitles, or by recording and transcribing in-game conversations. Websites like the **Internet Archive** or **GitHub** might have repositories with game scripts or subtitles.
- **Use Tools**: Tools like **OCR** (Optical Character Recognition) software or **speech-to-text** services can help in extracting dialog from video or audio files if there are no existing scripts.

### Step 2: Choosing the Right LLM
- **Pre-trained Models**: Look for LLMs that are already pre-trained for conversational applications. Models like **ChatterBot** in Python, **Eden AI's AI Chatbot solution with RAG** for Unity, or **Convai**'s tools for game engines are recommended.[4][7][9]
  - **ChatterBot** allows for training on custom dialog data, which is particularly useful for video game dialog.
  - **Eden AI** provides customizable chatbot functionality with large language models, suitable for Unity.
  - **Convai** offers a platform for creating virtual characters with conversational abilities, supporting multiple game engines and platforms.

### Step 3: Setting Up the Chatbot
- **System Prompt**: Use a system prompt to instruct the LLM on how to behave and respond. Here’s an example of a system prompt tailored for a game character:
  ```plaintext
  You are playing the role of [Character Name] from [Game Title]. Your knowledge base includes the following:
  - [Character's Background Information]
  - [Game's World and Lore]
  - [Character's Personality Traits]
  - [Dialogue Examples from the Game]

  When responding, use the style, tone, and language consistent with [Character Name]. You can only talk about what [Character Name] knows or would know. If asked about something outside your knowledge, respond in character by saying you do not know or that it's not something you would be aware of.
  ```

### Step 4: Integration and Testing
- **Integration**: Use tools like **Oobabooga's Text Generation WebUI** for an accessible interface to run LLMs locally. This UI simplifies interaction with the LLM, making it easier for non-technical users.[6]
  - For Unity, **Eden AI's plugin** provides a straightforward integration process.[7]
- **Testing**: Start by testing basic interactions, then refine the system prompt and the dialog data to improve the chatbot's responses and consistency with the character's personality and the game's lore.

### Considerations:
- **Context Window**: LLMs like **LongChat-13B** have a larger context window, which might be beneficial for maintaining context in conversations.[5]
- **Resource Usage**: Ensure the chosen model runs efficiently on mid-end hardware. **ChatterBot** and **Convai** are designed to be relatively lightweight, but you might need to optimize or use smaller models if necessary.
- **Ethical and Usage Considerations**: Be mindful of copyright issues when using game dialog. Some games might not allow their content to be used in this way without permission.

By following these steps, you can effectively create a chatbot from video game dialog using a system prompt and pre-trained models, ensuring it runs on mid-end hardware with a focus on low resource usage and a large context window. Remember, the success of this chatbot will largely depend on the quality and quantity of the dialog data, the system prompt's clarity, and the LLM's capabilities.

### Sources

- [AI dialog in games? : r/gaming - Reddit](https://www.reddit.com/r/gaming/comments/1b79pw3/ai_dialog_in_games/)
  - An npc has a knowledge base and history and the player can interact with them organically the way you could with a chat bot.
- [The complexity of AI Chat Software making-up NPC behaviour - Reddit](https://www.reddit.com/r/Games/comments/1f9p0j6/the_complexity_of_ai_chat_software_makingup_npc/)
  - By designing the game with a robust knowledge representation system, the dialog system can construct a context for the LLM that includes world ...
- [So how would you intergrate an LLM into video games, beyond ...](https://www.reddit.com/r/LocalLLaMA/comments/142ng75/so_how_would_you_intergrate_an_llm_into_video/)
  - An LLM could make it so any of hundreds of NPCs in the game might become your companion, and it will come up with custom dialog for them to ...
- [Craft Your Own Python AI ChatBot: A Comprehensive Guide to ...](https://blog.hubspot.com/website/python-ai-chat-bot)
  - With this comprehensive guide, I'll take you on a journey to transform you from an AI enthusiast into a skilled creator of AI-powered conversational interfaces.
- [Why More Context Isn't Always Better: Context Window Fails Explained](https://alexandrabarr.beehiiv.com/p/context-windows)
- [How to Run Your Own Free, Offline, and Totally Private AI Chatbot](https://www.pcmag.com/how-to/how-to-run-your-own-chatgpt-like-llm-for-free-and-in-private)
- [Build and deploy a Custom LLM Chatbot in Unity - Eden AI](https://www.edenai.co/post/build-a-customizable-llm-chatbot-in-unity)
- [How to Build Your Own AI Chatbot in 2024: The Ultimate Guide](https://www.codica.com/blog/how-to-build-your-own-ai-chatbot/)
- [Create NPCs with LLM-powered Convai! - YouTube](https://www.youtube.com/watch?v=nZE0gkFKMt8)
