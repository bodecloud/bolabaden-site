---
source_url: "https://www.perplexity.ai/search/be97845d-fc3d-47ad-865f-b7fb5c72bea0"
thread_uuid: "8efd4b5c-f3ca-41d2-9e6b-b5cde4fa9dc4"
slug: "be97845d-fc3d-47ad-865f-b7fb5c72bea0"
title: "How exactly does function calling work in the current state of LLM AI development? Is there a universal format? I notice claude's models (sonnet, haiku, opus) and open-source llms like mistral support function calling? What exactly is this and how does it get trained and how does it accurately understand its potentials? Is it common for models to forget they have ability to use these tools? Is there a syntax name for this?"
extracted_at: "2026-06-29T16:36:08.723Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# How exactly does function calling work in the current state of LLM AI development? Is there a universal format? I notice claude's models (sonnet, haiku, opus) and open-source llms like mistral support function calling? What exactly is this and how does it get trained and how does it accurately understand its potentials? Is it common for models to forget they have ability to use these tools? Is there a syntax name for this?

Source: [Perplexity thread](https://www.perplexity.ai/search/be97845d-fc3d-47ad-865f-b7fb5c72bea0)

## User

How exactly does function calling work in the current state of LLM AI development? Is there a universal format? I notice claude's models (sonnet, haiku, opus) and open-source llms like mistral support function calling? What exactly is this and how does it get trained and how does it accurately understand its potentials? Is it common for models to forget they have ability to use these tools? Is there a syntax name for this?

## Assistant

Function calling in large language models (LLMs) is a feature that allows these models to interact with external tools or APIs by generating structured outputs, such as JSON, which can then be used to invoke specific functions. This capability significantly expands the utility of LLMs beyond simple text generation, enabling them to perform more complex tasks like retrieving real-time data, performing calculations, or interacting with databases.

## **How Function Calling Works**

At its core, function calling in LLMs involves several key steps:

1. **Defining Functions**: The developer provides the LLM with a set of predefined functions, including their names, descriptions, and the parameters they require. These functions are typically described in a schema format like JSON.
   
2. **Generating Function Calls**: Based on the user's input, the LLM determines which function to call and generates the appropriate arguments for that function in a structured format (e.g., JSON). For example, if the user asks for the weather in a location, the model might generate a function call like:
   ```json
   {
     "name": "get_weather",
     "arguments": {
       "location": "London",
       "unit": "Celsius"
     }
   }
   ```

3. **Executing the Function**: The generated function call is passed to an external system (such as an API or a local tool), which executes it and returns the result.

4. **Final Response**: The LLM then uses the result from the function call to generate a final response for the user. This allows the model to incorporate real-time data or perform actions it wouldn't be able to handle on its own.

This process can be seen across various models like OpenAI's GPT-4, Anthropic's Claude models (e.g., Sonnet, Haiku), and open-source models like Mistral.[2][4][5]

## **Training and Fine-Tuning for Function Calling**

LLMs are trained on large datasets that include examples of structured outputs like JSON. During fine-tuning, they are further trained to recognize when a function call is needed based on a user's input and how to format that call correctly. This fine-tuning process enables models to generate structured outputs more reliably.[3][7]

However, it's important to note that function calling is not an inherent part of LLMs' architecture but rather an extension of their ability to generate structured text. The model doesn't actually execute functions itself; it only suggests which functions should be called and provides the necessary arguments.[3]

## **Is There a Universal Format?**

Most implementations of function calling use JSON as the standard format for defining and invoking functions due to its widespread use in APIs and ease of integration with various systems. While different platforms may have slight variations in how they implement function calling (e.g., OpenAI refers to them as "functions," while Anthropic uses terms like "tools"), they generally follow this same pattern of generating structured outputs that conform to a predefined schema.[8]

## **Challenges and Limitations**

While function calling greatly enhances what LLMs can do, there are several challenges:

- **Security Risks**: As highlighted by research on jailbreaking attacks, function calling introduces potential vulnerabilities where malicious users could exploit poorly defined functions or bypass safety filters.[1]
  
- **Stochastic Nature**: Since LLMs generate output token by token, ensuring strict adherence to schemas can sometimes be tricky. While fine-tuning helps improve reliability, it doesn't guarantee perfect consistency.[3]
  
- **Forgetting Capabilities**: Models may sometimes fail to remember that they have access to certain tools or functions during long interactions. This could be due to context limitations or insufficient reinforcement during training. However, this issue can often be mitigated by providing clear instructions or reminders within prompts.[6]

## **Is It Common for Models to Forget Their Abilities?**

Yes, it is possible for models to "forget" that they have access to certain tools or functions during extended interactions. This is often due to limitations in context length or insufficient reinforcement during training. Some research suggests that adaptive forgetting techniques could help manage this by allowing models to discard irrelevant information while retaining important capabilities.[10][6]

## **Syntax Name for Function Calling**

There isn't a universally agreed-upon syntax name specifically for function calling across all platforms. However, JSON-based schemas are commonly used for defining function calls. In documentation from various providers (e.g., OpenAI and Anthropic), you will see terms like "function calling," "tool use," or "structured output" being used interchangeably.[8][3]

In summary, function calling represents a powerful extension of LLM capabilities, allowing them to interact with external systems effectively through structured outputs like JSON. While there are challenges related to security and reliability, ongoing advancements in training techniques and prompt engineering continue to improve their functionality across both commercial and open-source models.

### Sources

- [The Dark Side of Function Calling: Pathways to Jailbreaking Large ...](https://arxiv.org/html/2407.17915v1)
- [Function Calling with LLMs - Prompt Engineering Guide](https://www.promptingguide.ai/applications/function_calling)
- [The Essential Guide to Large Language Models Structured Output ...](https://pavelbazin.com/post/the-essential-guide-to-large-language-models-structured-output-and-function-calling/)
- [Function Calling & Tool Use with Claude 3 - MLQ.ai](https://blog.mlq.ai/claude-function-calling-tools/)
- [Function calling | Mistral AI Large Language Models](https://docs.mistral.ai/capabilities/function_calling/)
- [Deep Forgetting & Unlearning for Safely-Scoped LLMs](https://www.alignmentforum.org/posts/mFAvspg4sXkrfZ7FA/deep-forgetting-and-unlearning-for-safely-scoped-llms)
- [Expanding AI Horizons: The Rise of Function Calling in LLMs](https://gradientflow.substack.com/p/expanding-ai-horizons-the-rise-of)
- [What is LLM Function Calling and How Does it Work? | Quiq Blog](https://quiq.com/blog/llm-function-calling/)
- [Function calling using Claude 3 family of models : r/OpenAI - Reddit](https://www.reddit.com/r/OpenAI/comments/1baj5u9/function_calling_using_claude_3_family_of_models/)
- [Forget LLM Memory – Why LLMs Need Adaptive Forgetting - Shelf.io](https://shelf.io/blog/forget-llm-memory-why-llms-need-adaptive-forgetting/)
