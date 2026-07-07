---
source_url: "https://www.perplexity.ai/search/7822b3ef-4ffd-42dc-9f7f-e4d6393691db"
thread_uuid: "e8c6dbd8-730e-4779-af6d-ebba20557329"
slug: "7822b3ef-4ffd-42dc-9f7f-e4d6393691db"
title: "There have been reports of accidental discoveries related to how these models operate under the hood. For example:
One user noted that when experimenting with system prompts and jailbreak techniques, they observed strange behavior where the model would include parts of its own system prompt in its responses. This led to speculation that multiple instances of the model might be involved in generating responses, each with its own system prompt guiding different aspects of the task6.
Another user mentioned how they were able to push the model into revealing more about its internal structure by repeatedly asking it to continue thinking about a problem before proposing a solution. This iterative process gave insights into how the model breaks down tasks into smaller reasoning steps26."
extracted_at: "2026-06-29T16:12:56.564Z"
matched_keywords: []
export_suite: "identity"
entry_count: 2
provenance: perplexity-rest-api
---

# There have been reports of accidental discoveries related to how these models operate under the hood. For example:
One user noted that when experimenting with system prompts and jailbreak techniques, they observed strange behavior where the model would include parts of its own system prompt in its responses. This led to speculation that multiple instances of the model might be involved in generating responses, each with its own system prompt guiding different aspects of the task6.
Another user mentioned how they were able to push the model into revealing more about its internal structure by repeatedly asking it to continue thinking about a problem before proposing a solution. This iterative process gave insights into how the model breaks down tasks into smaller reasoning steps26.

Source: [Perplexity thread](https://www.perplexity.ai/search/7822b3ef-4ffd-42dc-9f7f-e4d6393691db)

## User

There have been reports of accidental discoveries related to how these models operate under the hood. For example:
One user noted that when experimenting with system prompts and jailbreak techniques, they observed strange behavior where the model would include parts of its own system prompt in its responses. This led to speculation that multiple instances of the model might be involved in generating responses, each with its own system prompt guiding different aspects of the task6.
Another user mentioned how they were able to push the model into revealing more about its internal structure by repeatedly asking it to continue thinking about a problem before proposing a solution. This iterative process gave insights into how the model breaks down tasks into smaller reasoning steps26.

## Assistant

There have been several reports of users discovering unexpected behaviors in large language models (LLMs) when experimenting with system prompts and iterative techniques. These incidents have led to speculation about how these models operate under the hood. Below are two key observations that have emerged from such experiments:

### **1. System Prompts Leaking into Responses**
Some users have reported that, during attempts to "jailbreak" or manipulate the model, they observed instances where portions of the system prompt (the instructions given to the model to guide its behavior) appeared in the model's responses. This has led to speculation that multiple instances of the model might be involved in generating responses, each with its own system prompt guiding different aspects of the task. This phenomenon could be related to how LLMs handle context and instructions internally, where certain parts of the prompt may inadvertently become part of the output due to improper handling of boundaries between instructions and generated text.[1]

### **2. Iterative Prompting Revealing Internal Structures**
Another user described how they were able to push the model into revealing more about its internal reasoning process by repeatedly asking it to continue thinking about a problem before proposing a solution. This iterative approach allowed them to gain insights into how the model breaks down complex tasks into smaller reasoning steps. This aligns with techniques like *chain-of-thought prompting*, which encourages models to decompose problems into logical, intermediate steps, thereby improving performance on complex reasoning tasks. By engaging the model in this iterative process, users can sometimes glimpse how it structures its problem-solving approach, potentially offering a window into its underlying decision-making processes.[2]

These discoveries suggest that LLMs may exhibit emergent behaviors when pushed beyond typical use cases, offering glimpses into their internal mechanics through unconventional interactions.

### Sources

- [AI models collapse when trained on recursively generated data](https://www.reddit.com/r/science/comments/1ec43k2/ai_models_collapse_when_trained_on_recursively/)
- [Advanced Prompt Engineering: Full Course : r/ArtificialInteligence](https://www.reddit.com/r/ArtificialInteligence/comments/1epsrfh/advanced_prompt_engineering_full_course/)
- [Iterative Prompt Creator : r/PromptEngineering - Reddit](https://www.reddit.com/r/PromptEngineering/comments/12a5j34/iterative_prompt_creator/)
- [Asking Claude 3 to self analyze and go deeper... : r/ClaudeAI - Reddit](https://www.reddit.com/r/ClaudeAI/comments/1bx2odb/asking_claude_3_to_self_analyze_and_go_deeper/)

## User

can you provide exact examples of what users have found work well with gpt-4o when making it act like o1, especially the small model querying gpt-4o, and the system prompt? I'd like you to utilize the information aggregated and actually write the prompts themselves.

## Assistant

To replicate the behavior of GPT-4o acting like the smaller "o1 Mini" model, users have found that specific prompts can help simulate the reasoning and human-like thinking that the system prompt in o1 models encourages. Below are examples of how to structure these prompts, including the use of system prompts and reasoning steps.

### **1. System Prompt Example for GPT-4o to Act Like o1 Mini**

The key idea is to instruct GPT-4o to involve reasoning steps and take more time to think before executing tasks, similar to how o1 models operate. Here's a prompt you can use:

```plaintext
You are an advanced reasoning assistant. Before answering any question, you will think like a human, breaking down the problem into smaller steps. Take your time to consider all possibilities and ensure your answer is accurate. Do not rush; instead, reason through each part of the task carefully.
```

For example, if you want to ask a simple question like "How many 'r's are in the word 'strawberry'?", you can phrase it as follows:

```plaintext
How many "r"s are in the word "strawberry"? (Involve reasoning steps, think like a human before executing any task, and take full time to think.)
```

This prompt encourages GPT-4o to engage in a more deliberate thought process, which has been reported to increase accuracy in answers.[3]

### **2. Chain-of-Thought Prompting for Complex Tasks**

To further enhance the model's reasoning capabilities, you can use *chain-of-thought* prompting. This technique guides the model through logical intermediate steps before arriving at a solution. Here’s how you can structure such a prompt:

```plaintext
I want you to solve this problem step by step. Break down each part of the problem and explain your reasoning before providing an answer.
```

For example, if you're asking a math-related question:

```plaintext
Solve this math problem: If Sarah has 5 apples and gives 2 away, how many does she have left? (Break down each step of your reasoning before giving the final answer.)
```

This approach helps GPT-4o mimic the smaller o1 Mini model's ability to handle tasks with more structured thinking.[2]

### **3. Iterative Prompting for Enhanced Problem Solving**

Users have also found success by iteratively prompting GPT-4o to continue thinking about a problem before proposing a solution. This method allows the model to refine its approach over multiple interactions:

```plaintext
Before providing an answer, I want you to think deeply about this problem and propose multiple ways of solving it. After each suggestion, evaluate which one is most effective.
```

For example:

```plaintext
I want you to think about different strategies for solving this riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind." (Think deeply and propose multiple solutions before deciding on the best one.)
```

This iterative approach encourages GPT-4o to explore various angles before settling on an answer, which can lead to more accurate or creative responses.[1][2]

### **Conclusion**

By using these types of prompts—system prompts that encourage human-like reasoning, chain-of-thought prompting for step-by-step problem-solving, and iterative questioning—you can effectively make GPT-4o behave similarly to smaller models like o1 Mini or o1 Preview. These methods help unlock enhanced reasoning capabilities within GPT-4o by guiding its internal processes more deliberately.

### Sources

- [Become God Like Prompt Engineer With This One Prompt : r/ChatGPT](https://www.reddit.com/r/ChatGPT/comments/14d7pfz/become_god_like_prompt_engineer_with_this_one/)
- [Advanced Prompt Engineering: Full Course](https://www.reddit.com/r/ArtificialInteligence/comments/1epsrfh/advanced_prompt_engineering_full_course/)
- [New o1 Mini and o1 Preview are just GPT-40 with System Prompt](https://www.reddit.com/r/ClaudeAI/comments/1fgsg3j/new_o1_mini_and_o1_preview_are_just_gpt40_with/)
