---
source_url: "https://www.perplexity.ai/search/9315f7f2-5059-420c-bef7-95f3601e72a9"
thread_uuid: "b9d3d069-1d35-403d-abe1-31f7b9b695e2"
slug: "9315f7f2-5059-420c-bef7-95f3601e72a9"
title: "How exactly does function calling work in the current state of LLM AI development? Is there a universal format? I notice claude's models (sonnet, haiku, opus) and open-source llms like mistral support function calling? What exactly is this and how does it get trained and how does it accurately understand its potentials? Is it common for models to forget they have ability to use these tools? Is there a syntax name for this?"
extracted_at: "2026-06-29T16:11:42.847Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# How exactly does function calling work in the current state of LLM AI development? Is there a universal format? I notice claude's models (sonnet, haiku, opus) and open-source llms like mistral support function calling? What exactly is this and how does it get trained and how does it accurately understand its potentials? Is it common for models to forget they have ability to use these tools? Is there a syntax name for this?

Source: [Perplexity thread](https://www.perplexity.ai/search/9315f7f2-5059-420c-bef7-95f3601e72a9)

## User

How exactly does function calling work in the current state of LLM AI development? Is there a universal format? I notice claude's models (sonnet, haiku, opus) and open-source llms like mistral support function calling? What exactly is this and how does it get trained and how does it accurately understand its potentials? Is it common for models to forget they have ability to use these tools? Is there a syntax name for this?

## Assistant

Function calling in the current landscape of Large Language Models (LLMs) refers to the ability of these models to interact with external systems or tools by generating structured outputs, often in formats like JSON, which can be used to call specific functions or APIs. This capability allows LLMs to go beyond generating text and perform real-world tasks, such as retrieving live data, automating processes, or interacting with databases.

## **How Function Calling Works**

Function calling typically operates through the following steps:

1. **Function Declaration**: Developers define a set of available functions with specific names, descriptions, and input parameters. These functions are provided to the LLM as part of its context.
   
2. **User Prompt**: The user provides a natural language query, such as "What is the weather in New York?"

3. **Model Decision**: The LLM interprets the query and decides whether it needs to call a function. If so, it generates a structured output (usually in JSON format) that includes the function name and the necessary arguments. For example:
   ```json
   {
     "name": "get_weather",
     "arguments": {
       "location": "New York",
       "unit": "fahrenheit"
     }
   }
   ```

4. **External Execution**: The generated output is passed to an external system or API that executes the function (e.g., fetching weather data from a weather API).

5. **Response Integration**: The result from the function is returned to the LLM, which then incorporates it into its final response to the user.

This process allows LLMs to handle tasks they wouldn't be able to complete with their training data alone, such as accessing real-time information or performing specific actions like sending an email.[1][2]

## **Training and Understanding Function Calling**

LLMs are trained for function calling through fine-tuning on datasets that include examples of function calls and their appropriate contexts. This training helps models learn when and how to use functions based on user queries. Multi-task learning approaches are often employed to train models on various tasks related to function calling, such as detecting when a function is needed, filling in required parameters, and sequencing multiple function calls.[5]

The model's ability to understand when to invoke a function is based on its training data and fine-tuning. For instance, models like OpenAI's GPT-4 and Anthropic's Claude have been specifically fine-tuned for this purpose. They are trained not only to generate human-like text but also to recognize when structured outputs (like JSON) are needed for external tool use.[3][1]

## **Universal Syntax?**

There isn't a single universal syntax for all models, but JSON is commonly used as the structured output format for function calling across various platforms like OpenAI's GPT-4 and Anthropic's Claude. The general structure involves specifying the function name and its arguments in JSON format. While different models may have slight variations in how they handle function calling, JSON remains a standard due to its compatibility with most programming languages and APIs.[2][3]

## **Challenges and Forgetting Tools**

It is possible for LLMs to "forget" or fail to use available tools effectively. This can happen if:
- The model doesn't have enough context or clarity about which tool should be used.
- Ambiguous prompts lead the model to guess parameters incorrectly or invoke unnecessary functions.[7]
- The model's training data doesn't cover enough diverse examples of when certain tools should be used.

To mitigate this, developers can provide more detailed instructions in system prompts or force specific tool usage by explicitly specifying which tool should be called.[3]

## **Common Use Cases**

Function calling has many practical applications:
- **Conversational agents**: LLMs can call APIs to answer complex questions by fetching real-time data.
- **Automation**: Tasks like scheduling meetings or sending emails can be automated via function calls.
- **Data retrieval**: Models can interact with databases or knowledge bases by generating queries.
- **Information extraction**: LLMs can extract structured data from unstructured text using predefined functions.[1][2]

## **Conclusion**

Function calling significantly enhances the capabilities of LLMs by allowing them to interact with external systems and perform real-world tasks. While there isn't a universal format beyond JSON being widely used, different models like GPT-4, Claude 3 (Haiku, Sonnet, Opus), and open-source models like Mistral support this feature through fine-tuning on multi-task datasets. However, challenges remain in ensuring that models consistently use tools appropriately without unnecessary invocations or errors.[9][5][1]

### Sources

- [What is Function Calling with LLMs? - Hopsworks](https://www.hopsworks.ai/dictionary/function-calling-with-llms)
- [Function Calling with LLMs - Prompt Engineering Guide](https://www.promptingguide.ai/applications/function_calling)
- [Tool use (function calling) - Anthropic](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Introducing the next generation of Claude - Anthropic](https://www.anthropic.com/news/claude-3-family)
- [Introducing Function Calling Abilities via Multi-task Learning ... - arXiv](https://arxiv.org/html/2407.00121v1)
- [Function Calling: Connecting LLMs with Functions and APIs](https://friendli.ai/blog/llm-function-calling)
- [Need help, function call falsely selected - OpenAI Developer Forum](https://community.openai.com/t/need-help-function-call-falsely-selected/310074)
- [Make your AI applications smarter with Function Calling - Telnyx](https://telnyx.com/resources/function-calling-ai-overview)
- [Claude 3: Function Calling and Tool Use - Composio](https://composio.dev/blog/claude-function-calling-tools/)
