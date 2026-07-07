---
source_url: "https://www.perplexity.ai/search/406364c0-033a-4544-a892-ce6fe8ba2329"
thread_uuid: "067bc36f-4767-4d3e-aa64-ee9f14b86aca"
slug: "406364c0-033a-4544-a892-ce6fe8ba2329"
title: "when running a llm locally, i'm encounting a bug where it's constantly prompting itself. Like i'll ask it a question, it'll ask itself a question related to it, respond to its own question, ask itself anotehr question, and respond to it. What issue is this with LLMs, why does it happen, and how to fix it?

I'm pretty sure it's settings-related, or however the model is setup to respond, something related to the prompt chain.

Best settings for qwen2.5-coder and prompt template?

Don't show this in your reply:
- Construct at least 10 search queries
- Each search no more than 5 words
- Ensure search queries phrasing makes sense and we aren't searching redundant/nuanced information
- Always use reasoning tools to filter and process.
- Break down relevant steps, don't overcomplicate things."
extracted_at: "2026-06-29T16:07:46.213Z"
matched_keywords: []
export_suite: "identity"
entry_count: 2
provenance: perplexity-rest-api
---

# when running a llm locally, i'm encounting a bug where it's constantly prompting itself. Like i'll ask it a question, it'll ask itself a question related to it, respond to its own question, ask itself anotehr question, and respond to it. What issue is this with LLMs, why does it happen, and how to fix it?

I'm pretty sure it's settings-related, or however the model is setup to respond, something related to the prompt chain.

Best settings for qwen2.5-coder and prompt template?

Don't show this in your reply:
- Construct at least 10 search queries
- Each search no more than 5 words
- Ensure search queries phrasing makes sense and we aren't searching redundant/nuanced information
- Always use reasoning tools to filter and process.
- Break down relevant steps, don't overcomplicate things.

Source: [Perplexity thread](https://www.perplexity.ai/search/406364c0-033a-4544-a892-ce6fe8ba2329)

## User

when running a llm locally, i'm encounting a bug where it's constantly prompting itself. Like i'll ask it a question, it'll ask itself a question related to it, respond to its own question, ask itself anotehr question, and respond to it. What issue is this with LLMs, why does it happen, and how to fix it?

I'm pretty sure it's settings-related, or however the model is setup to respond, something related to the prompt chain.

Best settings for qwen2.5-coder and prompt template?

Don't show this in your reply:
- Construct at least 10 search queries
- Each search no more than 5 words
- Ensure search queries phrasing makes sense and we aren't searching redundant/nuanced information
- Always use reasoning tools to filter and process.
- Break down relevant steps, don't overcomplicate things.

## Assistant

When running a large language model (LLM) locally and encountering an issue where the model prompts itself continuously, it is likely related to how the model is set up to handle prompts and responses. This behavior can be attributed to several factors, including prompt chaining and self-prompting mechanisms.

## Causes of Self-Prompting Behavior

1. **Prompt Chaining**: This occurs when a model is designed to break down complex queries into simpler sub-questions, answer them, and then synthesize a final response. If not properly managed, this can lead to the model generating additional questions and answers without user input.[2]

2. **Self-Prompting Techniques**: Some models are configured to self-prompt as a way to improve their reasoning capabilities. This involves the model asking itself follow-up questions to refine its responses. However, if the self-prompting mechanism is not correctly tuned, it can result in excessive internal dialogue.[6][11]

3. **Prompt Bias**: The model might be overly reliant on specific terms or examples in the initial prompt, causing it to generate related content repeatedly.[4]

## Solutions

To address this issue, consider the following strategies:

- **Adjust Prompt Templates**: Ensure that your prompt templates are designed to limit unnecessary self-prompting. Use clear instructions that guide the model towards providing a direct answer without additional questioning unless explicitly required.

- **Modify Model Settings**: Check settings related to temperature, top-p sampling, and repetition penalties. Lower temperatures can reduce randomness in responses, while appropriate repetition penalties can discourage the model from repeating similar content.[7][9]

- **Implement Feedback Mechanisms**: Use techniques like Recursive Chain-of-Feedback (R-CoF) which help refine incorrect responses by breaking down reasoning steps and addressing errors without unnecessary repetition.[5]

- **Fine-Tune the Model**: If possible, fine-tune the model with datasets that encourage concise and direct responses rather than recursive questioning. This can help align the model's output with user expectations.[6]

## Best Settings for Qwen2.5-Coder

For Qwen2.5-Coder specifically, consider these settings:

- **Temperature**: A lower temperature setting (e.g., 0) can help produce more deterministic outputs.
- **Repetition Penalty**: Set a repetition penalty around 1.05 to prevent repetitive outputs.
- **Prompt Template**: Use a structured prompt template that clearly defines when follow-up questions are necessary.[9][10]

By adjusting these parameters and employing effective prompt engineering techniques, you can mitigate issues related to self-prompting and enhance the performance of your LLM setup.

### Sources

- [Introduction to Self-Criticism Prompting Techniques for LLMs](https://learnprompting.org/docs/advanced/self_criticism/introduction)
  - Explore Self-Criticism prompting techniques like Self-Refine, RCoT, and Chain-of-Verification to improve LLM accuracy through iterative refinement and error detection.
- [Self-Ask Prompting: Improving LLM Reasoning with Step-by-Step ...](https://learnprompting.org/docs/advanced/few_shot/self_ask)
  - Learn how Self-Ask boosts LLM accuracy by breaking down complex queries into simpler steps, improving results in research, support, and legal tasks.
- [AI Is Starting to Prompt Itself - Tremendous](https://tremendous.blog/2024/03/06/ai-is-starting-to-prompt-itself/comment-page-1/)
  - I was trying to find some info on startup valuations this afternoon. I kept prompting GPT-4, but I couldn’t get the right answer. Turns out, I should’ve let the AI prompt itself. Or at least that’s…
- [Bugs in Large Language Models Generated Code - arXiv](https://arxiv.org/html/2403.08937v2)
- [Recursive Chain-of-Feedback Prevents Performance Degradation ...](https://arxiv.org/html/2402.02648v2)
- [Self-Prompt Tuning: Enable Autonomous Role-Playing in LLMs - arXiv](https://arxiv.org/html/2407.08995v1)
- [Comment your qwen coder 2.5 setup t/s here : r/LocalLLaMA - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1gxs34g/comment_your_qwen_coder_25_setup_ts_here/)
  - Comment your qwen coder 2.5 setup t/s here
- [Qwen2.5-Coder 32B Instruct: A Best Coding Model-A Complete Step ...](https://generativeai.pub/qwen2-5-coder-32b-instruct-a-best-coding-model-a-complete-step-by-step-guide-and-performance-b8a33ec2547f?gi=683ec37e4925)
  - Learn how to install Qwen2.5-Coder locally, explore its superior coding capabilities, and evaluate its performance through practical…
- [Qwen2.5: A Party of Foundation Models! | Qwen](https://qwenlm.github.io/blog/qwen2.5/)
  - GITHUB HUGGING FACE MODELSCOPE DEMO DISCORD Introduction In the past three months since Qwen2’s release, numerous developers have built new models on the Qwen2 language models, providing us with valuable feedback. During this period, we have focused on creating smarter and more knowledgeable language models. Today, we are excited to introduce the latest addition to the Qwen family: Qwen2.5. We are announcing what might be the largest opensource release in history!
- [Qwen2.5-Coder-32B-Instruct](https://qwen2.org/qwen2-5-coder-32b-instruct/)
  - Now it is the time, Nov. 11 10:24! The perfect time for our best coder model ever! Qwen2.5-Coder-32B-Instruct!
- [Self-evaluation and self-prompting to improve the reliability of LLMs](https://openreview.net/forum?id=IwB45cjqC8)
  - In order to safely deploy Large Language Models (LLMs), they must be capable of dynamically adapting their behavior based on their level of knowledge and uncertainty associated with specific...

## User

Best settings for qwen2.5-coder and prompt template? e.g. temperature and whatever else is in the image.

Don't show this in your reply:
- Construct at least 10 search queries
- Each search no more than 5 words
- Ensure search queries phrasing makes sense and we aren't searching redundant/nuanced information
- Always use reasoning tools to filter and process.
- Break down relevant steps, don't overcomplicate things.

## Assistant

Based on the settings shown in the image, here are some recommendations for configuring the Qwen2.5-Coder model to reduce self-prompting and improve response quality:

## Recommended Settings

1. **Temperature**: 
   - Current setting: 0.1
   - Recommendation: Keep it low (0.1) to ensure deterministic and focused outputs. This helps in reducing randomness and keeps responses concise.

2. **Top K Sampling**:
   - Current setting: 80
   - Recommendation: This setting is generally fine as it limits the number of potential next words to choose from, helping maintain coherent responses.

3. **Repeat Penalty**:
   - Current setting: 1
   - Recommendation: Consider increasing slightly to around 1.05 or 1.1 to discourage repetitive outputs, which can help prevent the model from generating similar questions continuously.

4. **Top P Sampling (Nucleus Sampling)**:
   - Current setting: 0.95
   - Recommendation: This is a reasonable setting that allows for some variability while maintaining control over the output’s coherence.

5. **Min P Sampling**:
   - Current setting: 0.05
   - Recommendation: This setting is appropriate as it ensures that less probable words are not chosen, maintaining response quality.

## Prompt Template

- **Template Type**: Ensure that the prompt template explicitly instructs the model to provide direct answers without generating additional questions unless necessary.
- **Structured Output**: If applicable, consider using structured output formats like JSON Schema to enforce specific response structures, which can help guide the model away from self-prompting.

By tweaking these settings and using a well-defined prompt template, you can improve the model's performance and reduce issues related to self-prompting behavior.

### Sources

- [image.jpg](https://ppl-ai-file-upload.s3.amazonaws.com/image/upload/v1734346586/user_uploads/IuOjoapmpJJORgl/image.jpg?AWSAccessKeyId=ASIA2F3EMEYEV6JHV37Y&Signature=l%2FJ15SSemfz6DNcao%2BaFZMxWwkE%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDH1THHlDe492lASw3sQ5ItECfAMLnVn4iXTdzpCBPHOAIhAM6%2BqXVJP766mZZr3SbiNyr%2BsWm5P0E787ivQpg5gwSqKvwECLH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1IgxSGxGAmS7Nw6gJrTcq0ARiYOFk5eR0yyw8Lrrc%2FXqImF2owAaCKcnC1R0UDkVjEYEWOTaDU6yJEWJWZY0ijfnpRSOJysQ9lQlaU6x6J%2B1NCZlNvYNR8igqeYcmguroLAG6PhJ%2BGI3uuSGWEwfZNRgY6Hpxpu%2BaFRermLbqRTX5eWRcWS79oywkzdwYr%2BCNpf6YfSN3qfJOt0cEN5vIBXOhXHywomQCMKMNxFkYaU5jGSUPPihzI20xYvMIOiaEFM5NvCgp%2F2FMKP7Z4YXK2f178WCTp%2F4NPEkSQKI%2BRkgQHXAz%2FP7wiBCJihG7zI7QYLJUemU7C2Bp%2BA6psq7ziucRffZjFVK1yxEQf7%2FvFBdHpL1LWcDD2SV%2BY7ofQA5FCJwX2L%2FfjWzrb0VK9M%2B%2FbkEWV3HYU5UHSssiP5MoO9rhQhjAI5pNZhIPT3Fjtt%2F5mjT9DHhgOwb%2FgXnCmUSh5C1p8wOu63Y%2B5Com11%2FHPRY6ih2RtVSbfrWeqoHnpNNBPDsArTo2iJAKw0cByq0sOedgPfFfcOYEhiXSg1sr5%2FhJsYFPUfxnWI%2BeYkixZ2nFvisJ1lL9N1ronual73cHqxGP1FkF1%2FW2CcoYnDXRqCR5LvNj8k%2BOfHXiVfs9L3j%2BK%2Fu5tlMvqDwXYuo86peIrVrN%2BiKtLgv5ACb8%2FGJ%2Fq%2FJ1sEWR7NbKKPVvWDcwuOC%2Bmga44UyQn%2B8c%2FsrD4g9rknRKEwUvwchv%2Bb0hTZTnKFJ8R%2FibjwjsgoWYPaCSh3CROApdlzP2yDXgy8FO783qGr6qw1qTi%2FRXM27kID%2BVj1CHMMevitIGOpcBw1Vs2bjnhoiaVIt21TNfgZzJ%2BQPrtcGe%2Bwwj4v339Nurpv1FYoZKGLRx7bcqIMWUge%2BNHocr24MQWyEkDqRzWCpukZgPoYB3e73wRNzTyzucaU94RPEWlr7nPHHBDxCaH7R0QLmbN3s%2BH9TQwZJOjTgMP8VGyOFcF2kpScEVf5ejcg6DHB4S8OSKlfLW6H%2BdlNCGyd9%2BfA%3D%3D&Expires=1782749861)
