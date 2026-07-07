---
source_url: "https://www.perplexity.ai/search/97f639f5-43e7-49e4-95ed-1a5d0514a8b0"
thread_uuid: "829b2313-5d46-4dbe-902b-990db9fe8860"
slug: "97f639f5-43e7-49e4-95ed-1a5d0514a8b0"
title: "How exactly does function calling work in the current state of LLM AI development? Is there a universal format? I notice claude's models (sonnet, haiku, opus) and open-source llms like mistral support function calling? What exactly is this and how does it get trained and how does it accurately understand its potentials? Is it common for models to forget they have ability to use these tools? Is there a syntax name for this?"
extracted_at: "2026-06-29T16:11:45.118Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# How exactly does function calling work in the current state of LLM AI development? Is there a universal format? I notice claude's models (sonnet, haiku, opus) and open-source llms like mistral support function calling? What exactly is this and how does it get trained and how does it accurately understand its potentials? Is it common for models to forget they have ability to use these tools? Is there a syntax name for this?

Source: [Perplexity thread](https://www.perplexity.ai/search/97f639f5-43e7-49e4-95ed-1a5d0514a8b0)

## User

How exactly does function calling work in the current state of LLM AI development? Is there a universal format? I notice claude's models (sonnet, haiku, opus) and open-source llms like mistral support function calling? What exactly is this and how does it get trained and how does it accurately understand its potentials? Is it common for models to forget they have ability to use these tools? Is there a syntax name for this?

## Assistant

Function calling in the context of Large Language Models (LLMs) refers to the model's ability to generate structured outputs that represent requests to invoke external functions or APIs. This capability allows LLMs to bridge the gap between natural language understanding and practical, real-world tasks, such as retrieving data from external sources, executing calculations, or interacting with APIs.

## **How Function Calling Works**

At a high level, function calling involves several key steps:

1. **Function Declarations**: Developers define a set of functions (or tools) that the LLM can use. These functions are described with a schema, typically in JSON format, which includes the function name, description, and parameters.
   
2. **User Prompt**: The user provides a natural language query that may require external data or operations not contained within the LLM's knowledge base.

3. **Model Response**: The LLM processes the prompt and determines whether a function call is necessary. If so, it generates structured output (often in JSON) that specifies the function to call and the arguments needed.

4. **Function Execution**: The application handling the LLM's response takes this structured output and executes the corresponding function (e.g., calling an API or running a local function).

5. **Final Response**: Once the function is executed and results are obtained, they are passed back to the model to generate a final response for the user.

For example, if a user asks for weather information, an LLM might generate a function call like:

```json
{
  "function_call": {
    "name": "get_weather",
    "arguments": {
      "location": "San Francisco"
    }
  }
}
```

The application would then execute the `get_weather` function with "San Francisco" as the argument and return the result to the user.

## **Training and Understanding Function Calling**

LLMs are typically fine-tuned on datasets that include examples of function calls and structured data formats like JSON. During training:

- The model learns to recognize when a task requires external information or operations.
- It learns to generate appropriate structured outputs that conform to predefined schemas.
- The model is trained to infer missing parameters or ask for clarification if needed (e.g., if a location is missing for a weather query).

This training process helps models understand when and how to use functions effectively based on context.

## **Is There a Universal Format?**

There isn't a single universal format for function calling across all models. However, most implementations rely on structured outputs like JSON. OpenAI's GPT models use JSON-based schemas, while Anthropic's Claude models refer to this as "tool use," though they follow similar principles of generating structured outputs with tool names and parameters.[1][2][4]

## **Commonality Across Models**

Many modern LLMs support function calling, including:

- **OpenAI's GPT models** (e.g., GPT-4): These models use JSON-based schemas for defining functions.[9][1]
- **Anthropic's Claude models** (e.g., Sonnet, Haiku): These models refer to function calling as tool use and can handle multiple tools in complex queries.[4]
- **Mistral models**: Mistral supports function calling by integrating with external tools through user-defined functions or APIs.[5]

Open-source models like those from Mistral or Nexusflow also support function calling by enabling users to define custom functions that can be invoked based on model output.[6]

## **Challenges: Forgetting Functionality**

It is possible for LLMs to "forget" their ability to use tools or functions in certain contexts. This can happen if:

- The prompt does not clearly indicate the need for a tool.
- The model fails to infer missing parameters correctly.
- The model generates text responses instead of structured outputs due to ambiguous instructions.

To mitigate this, developers often include explicit instructions in system prompts or fine-tune models with examples that emphasize tool usage.[4][5]

## **Syntax Name**

The syntax used for function calling is often referred to as *function declarations* or *tool schemas*. These declarations describe each available function's name, parameters, and expected output format. In practice, these declarations are typically embedded within JSON objects.[3][9]

## **Conclusion**

Function calling represents an important evolution in LLM capabilities by allowing them to interact with external systems and perform real-world tasks dynamically. While there isn't a universal format across all models, JSON-based schemas are commonly used. Models like OpenAI's GPT series, Anthropic's Claude models, and open-source models like Mistral all support this feature. However, ensuring consistent tool usage may require careful prompt design and training adjustments.

### Sources

- [What is Function Calling with LLMs? - Hopsworks](https://www.hopsworks.ai/dictionary/function-calling-with-llms)
- [Make your AI applications smarter with Function Calling - Telnyx](https://telnyx.com/resources/function-calling-ai-overview)
- [Introduction to function calling | Generative AI on Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/function-calling)
- [Tool use (function calling) - Anthropic](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Function calling | Mistral AI Large Language Models](https://docs.mistral.ai/capabilities/function_calling/)
- [Function-Calling and Data Extraction with LLMs - DeepLearning.AI](https://www.deeplearning.ai/short-courses/function-calling-and-data-extraction-with-llms/)
- [What is LLM Function Calling and How Does it Work? | Quiq Blog](https://quiq.com/blog/llm-function-calling/)
- [Function Calling: Connecting LLMs with Functions and APIs](https://friendli.ai/blog/llm-function-calling)
- [Function Calling with LLMs - Prompt Engineering Guide](https://www.promptingguide.ai/applications/function_calling)
- [LLM Function Calling: Evaluating Tool Calls In LLM Pipelines](https://arize.com/blog/llm-function-calling-evaluating-tool-calls-in-llm-pipelines/)
