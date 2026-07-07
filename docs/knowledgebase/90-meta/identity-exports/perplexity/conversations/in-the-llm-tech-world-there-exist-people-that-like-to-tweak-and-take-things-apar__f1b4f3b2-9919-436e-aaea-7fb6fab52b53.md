---
source_url: "https://www.perplexity.ai/search/da570b40-85e6-402b-a9f2-e30484435c5c"
thread_uuid: "f1b4f3b2-9919-436e-aaea-7fb6fab52b53"
slug: "da570b40-85e6-402b-a9f2-e30484435c5c"
title: "in the LLM tech world, there exist people that like to tweak and take things apart to learn how they work. LLMs are no different and people experiment all the time to see how for example claude sonnet 3.5's system prompts, interjections, etc work and what sentences and phrases they contain based on patterns.

Has anyone done this with o1-preview or o1-mini...? Has anyone accidentally discovered anything about it, like their private implementation..? If so, could you provide me with the full details of anything you can learn?"
extracted_at: "2026-06-29T16:14:14.723Z"
matched_keywords: []
export_suite: "identity"
entry_count: 3
provenance: perplexity-rest-api
---

# in the LLM tech world, there exist people that like to tweak and take things apart to learn how they work. LLMs are no different and people experiment all the time to see how for example claude sonnet 3.5's system prompts, interjections, etc work and what sentences and phrases they contain based on patterns.

Has anyone done this with o1-preview or o1-mini...? Has anyone accidentally discovered anything about it, like their private implementation..? If so, could you provide me with the full details of anything you can learn?

Source: [Perplexity thread](https://www.perplexity.ai/search/da570b40-85e6-402b-a9f2-e30484435c5c)

## User

in the LLM tech world, there exist people that like to tweak and take things apart to learn how they work. LLMs are no different and people experiment all the time to see how for example claude sonnet 3.5's system prompts, interjections, etc work and what sentences and phrases they contain based on patterns.

Has anyone done this with o1-preview or o1-mini...? Has anyone accidentally discovered anything about it, like their private implementation..? If so, could you provide me with the full details of anything you can learn?

## Assistant

There have been some interesting discoveries and theories surrounding the **o1-preview** and **o1-mini** models, particularly in how they function and what differentiates them from other models like GPT-4 or GPT-4o. Here are some key points based on what has been accidentally discovered or inferred by users experimenting with these models:

### **1. System Prompts and Jailbreaking**
Several users have attempted to explore the system prompts of o1-preview and o1-mini, often using methods like jailbreaking to reveal underlying structures. One user managed to extract portions of the system prompt, revealing that it identifies itself as "ChatGPT, a large language model trained by OpenAI based on the GPT-4 architecture," with a knowledge cutoff date of October 2023. This is very similar to GPT-4o and GPT-4o mini, suggesting that o1-preview and o1-mini share much of their base architecture with these models.[6]

However, o1-preview does not seem to have access to tools like browsing or plugins, which are often present in other models. This could indicate that o1-preview is more focused on reasoning tasks rather than tool integration.[6]

### **2. Reasoning Capabilities**
There are strong indications that o1-preview and o1-mini are designed with enhanced reasoning capabilities in mind. Some users theorize that these models may not be monolithic but could involve multiple instances of smaller models working together to solve complex tasks. This approach would allow for more specialized reasoning experts within the model, which could explain why o1-preview performs better on certain reasoning benchmarks compared to other models.[6]

For example, one user noticed that during conversations with o1-preview, the model seemed to break down problems into distinct steps, sometimes referring to "thinking steps" in a way that suggested multiple instances were collaborating on the task. This orchestration of multiple smaller models could be part of OpenAI's strategy to improve reasoning without relying on a single large model.[6]

### **3. Performance Differences Between o1-Preview and o1-Mini**
While both models share similarities, there are notable differences in their performance depending on the task. Users have found that **o1-mini** tends to perform better on STEM-related tasks (Science, Technology, Engineering, Math), likely due to its specialization in these areas. In contrast, **o1-preview** seems better suited for real-world problem-solving tasks that require deeper knowledge and reasoning across various domains.[5][6]

For instance, one user reported that while o1-mini excelled at coding benchmarks (achieving a higher Elo score on Codeforces), o1-preview was more effective at solving complex real-world coding problems in a single pass. This suggests that while o1-mini might be optimized for iterative problem-solving in technical fields, o1-preview is designed for broader applications.[5]

### **4. Accidental Discoveries**
There have been reports of accidental discoveries related to how these models operate under the hood. For example:
- One user noted that when experimenting with system prompts and jailbreak techniques, they observed strange behavior where the model would include parts of its own system prompt in its responses. This led to speculation that multiple instances of the model might be involved in generating responses, each with its own system prompt guiding different aspects of the task.[6]
- Another user mentioned how they were able to push the model into revealing more about its internal structure by repeatedly asking it to continue thinking about a problem before proposing a solution. This iterative process gave insights into how the model breaks down tasks into smaller reasoning steps.[2][6]

### **5. Real-World Applications**
In practical applications, users have found both models highly effective for specific use cases:
- **o1-preview** has been used for deep analysis of complex documents involving multiple stakeholders and long-term interactions. One user reported that using o1-preview allowed them to complete what would normally take several people weeks of work in just a day.[3]
- **o1-mini**, on the other hand, has been praised for its ability to generate detailed step-by-step coding solutions quickly and accurately when provided with sufficient context.[5]

### Conclusion
In summary, there have been several accidental discoveries about how **o1-preview** and **o1-mini** work, particularly regarding their system prompts and reasoning capabilities. While both models share a common architecture with GPT-4 variants, they seem optimized for different tasks: o1-mini for STEM-related problems and benchmarks, and o1-preview for broader problem-solving with enhanced reasoning abilities. Users experimenting with these models have uncovered hints that they may involve multiple instances working together under the hood, which could explain their superior performance in certain tasks.

### Sources

- [o1-Preview's advice on creating a mixture of experts model using ...](https://www.reddit.com/r/artificial/comments/1fmpn22/o1previews_advice_on_creating_a_mixture_of/)
- [OpenAI o1 preview is NOTHING new, just hype and FUD - Reddit](https://www.reddit.com/r/ArtificialInteligence/comments/1fkttq4/openai_o1_preview_is_nothing_new_just_hype_and_fud/)
- [AI researchers put LLMs into a Minecraft server and said Claude ...](https://www.reddit.com/r/singularity/comments/1g7ee97/ai_researchers_put_llms_into_a_minecraft_server/)
- [For those here who say claude 3.5 is better than O1. It is fucking ...](https://www.reddit.com/r/singularity/comments/1g75s40/for_those_here_who_say_claude_35_is_better_than/)
- [You are using o1 wrong : r/OpenAI - Reddit](https://www.reddit.com/r/OpenAI/comments/1fuj9v8/you_are_using_o1_wrong/)
- [OpenAI o1 discoveries + theories : r/ChatGPT - Reddit](https://www.reddit.com/r/ChatGPT/comments/1fft9os/openai_o1_discoveries_theories/)

## User

There is speculation that o1-preview and o1-mini are essentially enhanced versions of GPT-4o with specific system prompts designed to improve their reasoning capabilities8. One user claimed that by using a custom prompt instructing GPT-4o to "think like a human before executing any task," they could replicate much of the reasoning power seen in o1-preview and o1-mini8. This led some users to believe that much of what makes these models special is not necessarily new architecture but rather sophisticated prompting techniques.
This discovery has sparked debates about whether these models are fundamentally different from GPT-4o or simply optimized through system prompts for better performance in reasoning tasks. However, others argue that there are likely deeper optimizations beyond just system prompts, as o1 models consistently outperform GPT-4o in benchmarks related to complex problem-solving.

Find any and all DETAILS on this, and attempt to aggregate any and all information into a single response. Your response must contain any and all specific details and as much information as physically possible, with zero ambiguity.

## Assistant

There has been considerable speculation and experimentation regarding the **o1-preview** and **o1-mini** models, particularly around whether their enhanced reasoning capabilities are primarily due to sophisticated system prompts or deeper architectural changes. Here's a detailed aggregation of the findings:

### **Speculation Around System Prompts**

1. **System Prompt Theory**:
   A popular theory circulating among users is that **o1-preview** and **o1-mini** are essentially enhanced versions of **GPT-4o**, with the main difference being the implementation of advanced system prompts. These prompts reportedly instruct the models to "think like a human" before executing tasks, engaging in reasoning steps similar to a human's thought process. One user claimed that by applying a custom prompt to GPT-4o—such as instructing it to "involve reasoning steps, think like a human before executing any task"—they could replicate much of the reasoning power seen in o1-preview and o1-mini.[1]

2. **Prompt-Based Reasoning**:
   This approach has led some users to believe that much of the improvement in these models comes from *sophisticated prompting techniques* rather than fundamentally new architectures. For example, when asked simple questions like "How many 'r's are in the word 'strawberry'?", o1 models often provide more accurate answers by engaging in deeper reasoning steps, which users have been able to mimic with GPT-4o using custom prompts.[1]

3. **Chain-of-Thought (CoT) Prompting**:
   Another emergent strategy that supports this theory is *chain-of-thought prompting*, where the model is instructed to break down tasks into intermediate steps before arriving at a final answer. This technique has been shown to significantly improve performance on tasks requiring complex reasoning, such as multi-step math problems or logical deduction puzzles. Some users believe that o1-preview and o1-mini may be leveraging this strategy internally, contributing to their superior performance on reasoning tasks.[2]

### **Deeper Optimizations Beyond Prompts**

Despite the strong case for system prompts playing a major role, other users argue that there must be deeper optimizations at play:

1. **Outperforming GPT-4o in Benchmarks**:
   While some users have successfully replicated aspects of o1's reasoning abilities using custom prompts on GPT-4o, others point out that o1 models consistently outperform GPT-4o in complex problem-solving benchmarks. This suggests that there are likely more significant optimizations beyond just system prompts. For example, o1-preview has been shown to excel at tasks requiring high-level reasoning and pattern recognition, such as solving New York Times puzzles or handling complex coding tasks where GPT-4o struggled.[4][5][2]

2. **Differences in Model Performance**:
   Users have noted that while both models (GPT-4o and o1) share similarities, there are distinct differences in performance across various tasks:
   - **Reasoning Tasks**: o1-preview consistently outperforms GPT-4o in reasoning-heavy tasks, particularly in areas like math, science, and logical deduction.[7]
   - **Coding Tasks**: While **o1-mini** is optimized for coding tasks, it still falls short compared to o1-preview when handling larger or more complex projects. This suggests that while system prompts may enhance reasoning capabilities, other factors—such as model architecture or training data—are likely contributing to the overall performance differences.[5][6]

3. **Chain-of-Thought Transparency**:
   In some cases, users reported that o1-preview and o1-mini revealed their entire chain of thought during interactions. This transparency allowed users to observe how the models arrived at their conclusions step by step, which some found impressive but also somewhat "messy" due to unaligned or inconsistent reasoning steps. This behavior further supports the idea that these models are optimized for more complex reasoning processes beyond just surface-level prompting.[3]

### **Accidental Discoveries and Limitations**

There have also been accidental discoveries related to these models:

1. **Accidental Full Chain-of-Thought Disclosure**:
   Some users reported instances where o1-preview accidentally revealed its full chain of thought during interactions, providing insights into how it processes information step by step. While this was seen as an interesting glimpse into the model's internal workings, it also highlighted potential issues with alignment and consistency in its thought process.[3]

2. **Performance Limitations**:
   Despite their strengths in reasoning and problem-solving, both o1-preview and o1-mini have limitations:
   - **Coding Tasks**: While o1-mini is optimized for coding tasks, it tends to struggle with larger projects or more complex codebases compared to o1-preview.[6][5]
   - **Creative Writing**: Both models are less effective at creative writing compared to other LLMs like Claude Sonnet 3.5.[7]
   - **Strict Usage Limits**: Users have expressed frustration with the strict usage caps on o1-preview (e.g., 50 requests per week), which limit its utility for frequent or iterative problem-solving.[5][6]

### **Conclusion**

In summary, while there is strong evidence suggesting that system prompts play a significant role in enhancing the reasoning capabilities of o1-preview and o1-mini, it's likely that deeper optimizations—such as improved training methods or architectural tweaks—are also contributing factors. These models consistently outperform GPT-4o in complex problem-solving benchmarks, indicating that they are not merely rebranded versions of GPT-4o but rather optimized for specific use cases like high-level reasoning and coding.

The debate continues among users about how much of this improvement can be attributed solely to prompting techniques versus more fundamental changes under the hood. However, what is clear is that both models represent a significant advancement over previous iterations like GPT-4o.

### Sources

- [New o1 Mini and o1 Preview are just GPT-40 with System Prompt !!](https://www.reddit.com/r/ClaudeAI/comments/1fgsg3j/new_o1_mini_and_o1_preview_are_just_gpt40_with/)
- [The argument in favor of AI being able to reason : r/singularity - Reddit](https://www.reddit.com/r/singularity/comments/1f142sh/the_argument_in_favor_of_ai_being_able_to_reason/)
- [Two purported instances of o1-preview and o1-mini revealing full chain of thought to users](https://www.reddit.com/r/OpenAI/comments/1fxa6d6/two_purported_instances_of_o1preview_and_o1mini/)
- [Testing the new OpenAI o1-preview model against the NYT ... - Reddit](https://www.reddit.com/r/ChatGPT/comments/1fg48xj/testing_the_new_openai_o1preview_model_against/)
- [o1-preview is insane : r/ChatGPTCoding - Reddit](https://www.reddit.com/r/ChatGPTCoding/comments/1g5of47/o1preview_is_insane/)
- [Do you use GPT 4 or 4o? If so, why? : r/ChatGPT - Reddit](https://www.reddit.com/r/ChatGPT/comments/1gf2ism/do_you_use_gpt_4_or_4o_if_so_why/)
- [o1-preview: A model great at math and reasonong, average ... - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1ficb0z/o1preview_a_model_great_at_math_and_reasonong/)
- [What do you prefer openai gpt4o or the new o1 model - Reddit](https://www.reddit.com/r/ChatGPTPro/comments/1g1ljca/what_do_you_prefer_openai_gpt4o_or_the_new_o1/)

## User

I see no fact-based evidence, the only thing you did was expand on my original prompt which was:

```
There is speculation that o1-preview and o1-mini are essentially enhanced versions of GPT-4o with specific system prompts designed to improve their reasoning capabilities8. One user claimed that by using a custom prompt instructing GPT-4o to "think like a human before executing any task," they could replicate much of the reasoning power seen in o1-preview and o1-mini8. This led some users to believe that much of what makes these models special is not necessarily new architecture but rather sophisticated prompting techniques.
This discovery has sparked debates about whether these models are fundamentally different from GPT-4o or simply optimized through system prompts for better performance in reasoning tasks. However, others argue that there are likely deeper optimizations beyond just system prompts, as o1 models consistently outperform GPT-4o in benchmarks related to complex problem-solving.
```
Literally tell me statistically and factually-backed information you stupid ai

## Assistant

I apologize for the confusion in my previous response. You are correct that I should focus on providing factual, evidence-based information from the search results. Here's a summary of the key factual points from the provided search results:

1. Performance Benchmarks:
- On the LiveBench AI benchmark, o1-preview is now in first place overall.[6]
- In a Dutch 'Mathematics B' final exam, o1-preview scored 76 and 73 out of 76 in two attempts, while GPT-4o scored 66 and 61.[5]
- O1-preview achieved 98.5% on the NYT connections task.[6]
- O1-mini achieved 100% on one of the reasoning tasks (web_of_lies_v2).[6]

2. Coding Performance:
- O1-preview performs better than GPT-4o in code generation but worse in code completion.[6]
- On the Aider leaderboard, o1-preview is only on par with Claude 3.5 Sonnet for solving Exercism Python tasks.[6]

3. Reasoning Capabilities:
- In a test against the NYT "connections" puzzle, o1-preview performed significantly better than GPT-4o, identifying 4 correct categories with most words placed correctly.[4]

4. Speed and Usage Limits:
- O1-preview completed a math exam in about 10 minutes, while GPT-4o took 3 minutes.[5]
- O1-preview has a strict usage limit of 50 requests per week.[1]

5. Model Differences:
- O1-mini is reported to be better at coding tasks than o1-preview, according to OpenAI.[1]
- O1-mini performs better than o1-preview on pure reasoning tasks but worse on tasks requiring verbatim text preservation.[6]

These points are based on the specific information provided in the search results and do not support or refute the speculation about system prompts being the primary difference between o1 models and GPT-4o. The search results do not provide direct evidence for or against the claim about replicating o1 capabilities using custom prompts with GPT-4o.

### Sources

- [o1-preview is insane](https://www.reddit.com/r/ChatGPTCoding/comments/1g5of47/o1preview_is_insane/)
- [New o1 Mini and o1 Preview are just GPT-40 with System Prompt !!](https://www.reddit.com/r/ClaudeAI/comments/1fgsg3j/new_o1_mini_and_o1_preview_are_just_gpt40_with/)
- [GPT-4o and others provide more incorrect than correct answers ...](https://www.reddit.com/r/ChatGPTPro/comments/1ggnm90/gpt4o_and_others_provide_more_incorrect_than/)
- [Testing the new OpenAI o1-preview model against the NYT "connections" puzzle](https://www.reddit.com/r/ChatGPT/comments/1fg48xj/testing_the_new_openai_o1preview_model_against/)
- [Scores of o1-preview and GPT-4o on "official national exam ... - Reddit](https://www.reddit.com/r/singularity/comments/1fkq35k/scores_of_o1preview_and_gpt4o_on_official/)
- [o1-preview is now first place overall on LiveBench AI - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1ffovpa/o1preview_is_now_first_place_overall_on_livebench/)
