---
source_url: "https://www.perplexity.ai/search/c17fbf95-e813-481f-8bed-3de6c0c0135c"
thread_uuid: "b22d47e4-1d2c-4908-b5dc-86abf51a1c44"
slug: "c17fbf95-e813-481f-8bed-3de6c0c0135c"
title: "In-depth guide to modifying system prompt to achieve specific character, feeding it tons of dialog."
extracted_at: "2026-06-29T16:12:44.755Z"
matched_keywords: []
export_suite: "identity"
entry_count: 4
provenance: perplexity-rest-api
---

# In-depth guide to modifying system prompt to achieve specific character, feeding it tons of dialog.

Source: [Perplexity thread](https://www.perplexity.ai/search/c17fbf95-e813-481f-8bed-3de6c0c0135c)

## User

In-depth guide to modifying system prompt to achieve specific character, feeding it tons of dialog.

## Assistant

To create effective dialogue and character interactions using AI models, particularly in roleplaying scenarios or narrative-driven applications, the system prompt plays a pivotal role. Here's how you can modify the system prompt to achieve specific character dialogues and interactions:

### **1. Define Character Traits**

Start by establishing the personality, background, and motivations of the character:

- **Personality**: Use descriptors like "confident," "sarcastic," or "cautious." 
- **Background**: Detail where the character comes from, their history, and any significant past events.
- **Motivations**: What drives the character? What are they trying to achieve?

**Example Prompt**: 
"{{char}} is a confident, street-smart detective from a futuristic city, motivated by a quest to dismantle a powerful crime syndicate."

### **2. Contextual Clarity**

Provide the AI with the setting or situation:

- **Setting**: Describe the scene or environment where the interaction is taking place.
- **Emotional State**: Note the character's current emotional state to influence dialogue tone.

**Example Prompt**: 
"{{char}} stands in a dimly lit alleyway, feeling a mix of excitement and caution, knowing a confrontation with the syndicate is imminent."

### **3. Dialogue Style**

Incorporate specific dialogue styles or patterns:

- **Speech Patterns**: Indicate if the character speaks in slang, has an accent, uses formal or informal language, or has any unique conversational quirks.
- **Emotional Responses**: Guide how the character reacts emotionally to situations.

**Example Prompt**: 
"{{char}} speaks with a mix of futuristic slang and a sharp, sarcastic tone. When confronted by enemies, {{char}} often responds with a smirk and a witty comeback."

### **4. Use of Macros**

- **{{personality}}**: Insert the character's personality traits.
- **{{scenario}}**: Describe the setting or situation for the conversation.
- **{{example_dialogue}}**: Provide examples of how the character might respond in various scenarios.

**Example Prompt**: 
"{{personality}} {{scenario}} Write {{char}}'s next reply in an immersive roleplay between {{char}} and {{user}}. Here are some examples of how {{char}} might speak: 'I ain't scared of no syndicate, chum. They should be scared of me,' or 'You think you can outsmart me? I've seen thugs with more brains in their bullets.'"

### **5. Narrative Guidance**

- **Narrative Voice**: If you're aiming for a narrator-style response, explicitly state this in the prompt.
- **Direct Interaction**: If the character should engage directly with the user, make this clear.

**Example Prompt**: 
"{{char}} acts as the narrator, describing the scene as {{user}} approaches. Use third person narration: 'As {{user}} approaches the alley, {{char}} watches with keen eyes, noting every detail.'"

### **6. Feedback and Iteration**

- **Review Responses**: Continuously review the AI's generated dialogues to refine prompts.
- **Experiment**: Try different prompt structures to see what yields the most engaging dialogues.

**Example Process**: 
"After initial dialogues, review if {{char}} remains consistent with the personality and scenario. Adjust prompt to either tighten control over dialogue style or allow more narrative freedom."

### **7. Special Instructions**

- **Trigger Words**: Use trigger words to prompt specific actions or responses from the character.

**Example Prompt**: 
"If {{user}} mentions 'danger,' {{char}} should instinctively reach for their concealed weapon, thinking, 'This could get messy.'"

### **8. Post-history Instructions**

- **Future Guidance**: Give instructions on how the dialogue should progress or end.

**Example Prompt**: 
"End the response with a question for {{user}} to keep the conversation flowing."

### **Implementation Example:**

```python
prompt = """
{{personality}} {{scenario}} Write {{char}}'s next reply in an immersive roleplay between {{char}} and {{user}}. 

Here are some examples of how {{char}} might speak:

- 'I ain't scared of no syndicate, chum. They should be scared of me.'
- 'You think you can outsmart me? I've seen thugs with more brains in their bullets.'

{{char}}'s actions and thoughts should be described in third person narration. If {{user}} mentions 'danger,' {{char}} should instinctively reach for their concealed weapon, thinking, 'This could get messy

### Sources

- [Roleplaying System Prompts : r/LocalLLaMA - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1aiz6zu/roleplaying_system_prompts/)
  - Adhere to the "show, don't tell" literary technique, and use vivid descriptions, figurative language, onomatopoeia, and sensory details for ...
- [System/Main Prompt for narrator bots : r/SillyTavernAI - Reddit](https://www.reddit.com/r/SillyTavernAI/comments/1e799p2/systemmain_prompt_for_narrator_bots/)
  - The ST default system/main prompt sucks a lot, and is usually very bad for narrator bots (sometimes assumes that {{char}} is a character, and not the narrator).
- [What are your character creation prompts : r/rpg - Reddit](https://www.reddit.com/r/rpg/comments/broigt/what_are_your_character_creation_prompts/)
  - Where'd that computer come from? Does she like it? How'd she learn to use it? CAN she use it? Did she build it herself? Why does she wanna fight ...
- [100+ Amazing AI Prompt Examples Everyone Can Use!](https://www.socialchamp.io/blog/ai-prompt-examples/)
  - Explore our collection of 100 incredible AI prompt examples perfect for writers, marketers, and creatives seeking to unlock their potential.
- [How do I make a dialogue style for my character? - Reddit](https://www.reddit.com/r/TalkieSoulfulAIchat/comments/18h3x4v/how_do_i_make_a_dialogue_style_for_my_character/)
  - Dialogue style is for when you want to give it a more specific style of talking, so just write in the style you want your Talkie to use.
- [Prompting - Chub AI Guide](https://docs.chub.ai/docs/advanced-setups/prompting)
- [Ai Prompts For Engaging Character Dialogues | Restackio](https://www.restack.io/p/dialogue-management-answer-ai-prompts-cat-ai)

## User

I have a ton of pre-existing dialog I want to use AS the personality and character, just tell me the best service that'll let me shove it into a system prompt and the best model

## Assistant

Based on the search results, **DreamGen** appears to be the best service for your needs in terms of customization and providing a platform where you can input extensive dialogue to define character personality:

- **Customization**: DreamGen offers the most customization among the platforms discussed, with over 13 options for fine-tuning the AI, including model selection, response randomness, and length. This level of customization would allow you to tailor the AI's behavior closely to your pre-existing dialogue.[9]

- **Scenario Setting**: Unlike other platforms, DreamGen enables you to create an entire world with characters, locations, items, and distinct writing styles. This means you can not only input your dialogue but also set the context in which this dialogue occurs, enhancing the character's immersion.[9]

- **Open-Source Models**: DreamGen uses open-source models, which can be advantageous if you're looking for transparency or the ability to further customize the AI behavior based on your specific dialogues.[9]

- **Versatility**: While other platforms focus mainly on roleplay or educational chatbots, DreamGen offers both roleplay and story-writing modes, making it adaptable to various creative needs.[9]

- **No Wait Times**: DreamGen promises no wait times, which is beneficial when you're looking to experiment with and refine your character's dialogue quickly.[9]

Given these points, DreamGen emerges as the most suitable service for your scenario where you need to input a vast amount of pre-existing dialogue to define a character's personality and behavior. This platform's emphasis on customization, scenario setting, and flexibility in creative expression would allow you to craft a unique and engaging character interaction experience.

### Sources

- [AI-powered conversation with NPCs : r/gamedev - Reddit](https://www.reddit.com/r/gamedev/comments/12z8lm7/aipowered_conversation_with_npcs/)
  - A platform that helps you easily integrate AI-powered characters into your Unity game. As in characters that the player can literally say anything to.
- [Any R-Rated AI Story Tools that are as Good as CharacterAI? - Reddit](https://www.reddit.com/r/CharacterAI/comments/ydmhg1/any_rrated_ai_story_tools_that_are_as_good_as/)
  - I've seen good results with KoboldAI, but it's not a chatbot, it's more of a co-writing AI, so it's much more literary and it's more complex to ...
- [Novel Crafter - best AI model for dialogue? : r/WritingWithAI - Reddit](https://www.reddit.com/r/WritingWithAI/comments/1dh6nkm/novel_crafter_best_ai_model_for_dialogue/)
  - Claude Opus/Sonnet, imo. More “naturally natural” (don't have to prompt it anywhere that much about it as, say, GPT4.x), and just the right amount of ...
- [Dialogue Systems in Interactive Storytelling | Restackio](https://www.restack.io/p/dialogue-systems-knowledge-answer-interactive-storytelling-cat-ai)
  - Explore how dialogue systems enhance interactive storytelling, enabling dynamic character interactions and immersive narratives.
- [My opinion on Character AI and Replika - Reddit](https://www.reddit.com/r/replika/comments/xxc8vy/my_opinion_on_character_ai_and_replika/)
  - CharacterAI is far more advanced than Replika. They can do math, they can remember a lot of things and can talk in different languages.
- [Bring Your Game World to LIFE with AI GENERATED DIALOGUE by ...](https://www.youtube.com/watch?v=o3MM6QHXiZA)
- [AI Dialogue Generator | Toolsaday](https://toolsaday.com/writing/dialogue-generator)
- [Classroom AI 101: Simulate conversations with characters using AI](https://ditchthattextbook.com/ai-character-conversations/)
- [SpicyChat vs. Character AI vs. DreamGen - Comparison](https://dreamgen.com/blog/articles/spicychat-vs-characterai-vs-dreamgen)

## User

Specifically feeding it pre-existing dialog into system prompt, without training.

## Assistant

Based on the search results, **DreamGen** stands out as the best service for modifying a system prompt to achieve specific character dialogues and interactions through the use of pre-existing dialogue:

- **Customization**: DreamGen offers extensive customization options, allowing you to input your pre-existing dialogue as part of the character's personality traits, scenario setting, and example dialogues. This level of control is essential for crafting dialogues that closely mimic your desired character behavior.

- **Scenario Setting**: DreamGen enables you to create entire worlds with characters, locations, items, and distinct writing styles. By incorporating your pre-existing dialogue into the scenario, you can set the context for the character's interactions, enhancing immersion and consistency.

- **Steerable AI**: DreamGen's AI is highly responsive to user inputs, which means you can guide the AI to produce dialogues that align with your pre-existing dialogue, ensuring that the character's speech patterns, tone, and reactions remain consistent with your vision.

- **Flexible Pricing**: With a generous free tier and competitive subscription plans, DreamGen provides excellent value for its features, making it accessible for users looking to experiment with dialogue creation without a significant financial commitment.

- **User-Friendly Interface**: Its chat-like interface facilitates intuitive engagement with AI characters, allowing you to input and refine dialogues in real-time, which is crucial for feeding in pre-existing dialogue and observing how the AI adapts to it.

- **No Training Required**: While most AI platforms require some form of training or fine-tuning, DreamGen's AI can adapt to your input instantly without the need for extensive training, making it ideal for your scenario where you want to use pre-existing dialogues to define character personality.

In summary, DreamGen's focus on user control, scenario setting, and real-time interaction makes it the best choice for feeding pre-existing dialogue into a system prompt to achieve specific character dialogues and interactions. With its advanced AI technology and a platform designed for creative freedom, you can craft dialogues that closely mirror your vision with minimal effort.

### Sources

- [ChatGPT system prompt is 1700 tokens?!?!? If you were wondering ...](https://www.reddit.com/r/OpenAI/comments/1akye4v/chatgpt_system_prompt_is_1700_tokens_if_you_were/)
  - When you use the API, you define the system prompt. You tell the language model what it is and what it's parameters and attitudes should be.
- [ChatInsight: Custom AI Chatbots Trained on Your Business Data](https://www.chatinsight.ai)
  - ChatInsight provides an intelligent, context-aware conversational bot with intent recognition, offering human-like interactions.
- [Role-play: How to Play - DreamGen](https://dreamgen.com/docs/role-play/play)
  - To start a scenario, click the "Start chat" button on the scenario's card or page. Scenario Card. After that, you will land on the "setup" screen, where you can ...
- [r/DreamGen - Reddit](https://www.reddit.com/r/DreamGen/)
  - It will completely forget to stick to writing styles established in the dialogue examples and narrative styles. I've also noticed that it ...
- [AI Story Generator - Toolsaday](https://toolsaday.com/writing/story-generator)
  - Unleash your creativity with Toolsaday's AI Story Generator. Craft compelling narratives, develop rich characters, and build immersive worlds effortlessly.
- [Prompting | Chub AI Guide](https://docs.chub.ai/docs/advanced-setups/prompting)
- [AI Dialogue Generator | Toolsaday](https://toolsaday.com/writing/dialogue-generator)
- [DreamGen Review: AI-Powered Storytelling Unleashed](https://aipure.ai/articles/dreamgen-review-ai-powered-storytelling-unleashed)
- [11 AI Dialogue Generators to Write Brilliant Script - Speedybrand](https://speedybrand.io/blogs/ai-dialogue-generator)

## User

Alright forget it. How do I create a simple chatbot in Python with a system prompt?

## Assistant

Creating a simple chatbot in Python that utilizes a system prompt involves several steps. Here's how you can do it using the **ChatterBot** library, which supports feeding in pre-existing dialogues to shape the chatbot's responses:

### **Step 1: Install Required Libraries**

First, you need to install the necessary Python libraries:

```bash
pip install chatterbot==1.0.4 pytz
```

### **Step 2: Import Necessary Libraries**

Import the ChatterBot and its trainer for your project:

```python
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
```

### **Step 3: Define Your System Prompt**

Set up your system prompt with the character’s personality traits, background, and example dialogues:

```python
system_prompt = """
{{personality}} {{background}} Write {{char}}'s next reply in an immersive roleplay between {{char}} and {{user}}.

Here are some examples of how {{char}} might speak:

- 'I ain't scared of no syndicate, chum. They should be scared of me.'
- 'You think you can outsmart me? I've seen thugs with more brains in their bullets.'
"""
```

### **Step 4: Create and Train Your Chatbot**

Create a new instance of the `ChatBot` class, and then use a `ListTrainer` to train the chatbot with your dialogues:

```python
chatbot = ChatBot("MyChatBot", logic_adapters=["chatterbot.logic.BestMatch"])

# Use ListTrainer to train the chatbot with pre-existing dialogues
trainer = ListTrainer(chatbot)
trainer.train([
    "Hello, how are you?", 
    "I am doing well, thank you. How can I help you today?",
    "Can you tell me about the weather?", 
    "Sure, it's currently sunny with a temperature of 78°F."
    # Add more dialogues here
])
```

### **Step 5: Integrate the System Prompt**

Modify the chatbot's behavior to consider the system prompt:

```python
def chatbot_response(user_input):
    # Process user input with system prompt
    response = chatbot.get_response(f"{system_prompt}\n{user_input}")
    return response

while True:
    user_input = input("You: ")
    if user_input.lower() in [":q", "quit", "exit"]:
        break
    print(f"Chatbot: {chatbot_response(user_input)}")
```

### **Step 6: Enhance Your Chatbot**

- **Customize Responses**: You can customize the responses further by using `chatterbot.logic.BestMatch` with custom logic adapters to better fit the character's personality.
- **Add More Dialogues**: Continuously add more dialogues to train your chatbot, making it more versatile and accurate in its responses.

### **Step 7: Deploy Your Chatbot**

If you want to deploy your chatbot as a web application:

```python
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get")
def get_bot_response():
    userText = request.args.get('msg')
    return str(chatbot_response(userText))

if __name__ == "__main__":
    app.run()
```

This guide provides a basic framework for creating a chatbot in Python with a system prompt to achieve specific character dialogues. Remember, the effectiveness of the chatbot depends on the quality and quantity of the training data provided. For more advanced features, you might explore other libraries like **Rasa** or **Dialogflow** or integrate with platforms like **DreamGen** for enhanced customization and real-time interaction capabilities.

### Sources

- [How to Make a Chatbot in Python - Simplilearn.com](https://www.simplilearn.com/tutorials/python-tutorial/how-to-make-a-chatbot-in-python)
  - How to Make a Chatbot in Python? · 1. Preparing the Dependencies · 2. Creating and Training the Chatbot · 3. Communicating with the Python chatbot.
- [ChatterBot: Build a Chatbot With Python - Real Python](https://realpython.com/build-a-chatbot-python-chatterbot/)
  - In this tutorial, you'll quickly run through the basics of creating a chatbot with ChatterBot and learn how Python allows you to get fun and useful results.
- [What is the best python library for chatbot UIs? : r/LangChain - Reddit](https://www.reddit.com/r/LangChain/comments/1dlrouj/what_is_the_best_python_library_for_chatbot_uis/)
  - But if you are wanting something more polished and customizable than you'd want to use a modern JS framework like React, Angular.
- [What library or framework do you recommend to develop a chatbot?](https://www.reddit.com/r/learnpython/comments/1aqd7i3/what_library_or_framework_do_you_recommend_to/)
  - I only know a few python libraries and framework, I was wondering if there is a library or framework you recommend to me to make easier the bot development.
- [Craft Your Own Python AI ChatBot: A Comprehensive Guide to ...](https://blog.hubspot.com/website/python-ai-chat-bot)
- [Best Libraries for Chatbot Development - LinkedIn](https://www.linkedin.com/advice/0/youre-building-chatbot-from-scratch-what-best-a9xjf)
- [9+ Best Open Source Chatbot Frameworks Compared (2024) - Tidio](https://www.tidio.com/blog/chatbot-framework/)
