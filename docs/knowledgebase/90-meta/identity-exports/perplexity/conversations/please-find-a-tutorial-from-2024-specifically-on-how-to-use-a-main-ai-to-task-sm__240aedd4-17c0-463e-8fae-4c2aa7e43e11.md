---
source_url: "https://www.perplexity.ai/search/f141a104-6213-4536-a63b-9d7ea00fdbca"
thread_uuid: "240aedd4-17c0-463e-8fae-4c2aa7e43e11"
slug: "f141a104-6213-4536-a63b-9d7ea00fdbca"
title: "Please find a tutorial from 2024 specifically on how to use a main ai to task smaller agents to do tasks. Should provide exact prompts in their entirety in your output. Start with claude's prompt tool system and how it communicates them with agents, then move your way to langchain/aider/cline and other implementations."
extracted_at: "2026-06-29T16:13:11.924Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# Please find a tutorial from 2024 specifically on how to use a main ai to task smaller agents to do tasks. Should provide exact prompts in their entirety in your output. Start with claude's prompt tool system and how it communicates them with agents, then move your way to langchain/aider/cline and other implementations.

Source: [Perplexity thread](https://www.perplexity.ai/search/f141a104-6213-4536-a63b-9d7ea00fdbca)

## User

Please find a tutorial from 2024 specifically on how to use a main ai to task smaller agents to do tasks. Should provide exact prompts in their entirety in your output. Start with claude's prompt tool system and how it communicates them with agents, then move your way to langchain/aider/cline and other implementations.

## Assistant

In 2024, several AI frameworks and tools allow you to use a **main AI** (or orchestrator) to delegate tasks to smaller **agent AIs**. This approach is often referred to as *multi-agent orchestration*. Below, I will walk you through some of the most popular implementations, including **Claude** by Anthropic, **LangChain**, **Aider**, and others, along with example prompts.

## **1. Claude's Prompt Tool System**

Claude by Anthropic is a powerful AI model that can be used to manage sub-agents for various tasks. Claude's internal system prompt is designed for flexibility and can handle complex tasks by delegating subtasks to smaller agents.

### **How Claude Communicates with Agents**
Claude can be instructed to break down tasks into subtasks and manage them step-by-step. You can use chain-of-thought (CoT) prompting or XML tags to structure these tasks.

#### **Example Prompt for Claude:**
```plaintext
You are the main orchestrator AI. Your task is to manage several sub-agents that will complete smaller tasks. Here is the breakdown:

1. Agent A: Responsible for data collection.
2. Agent B: Responsible for data analysis.
3. Agent C: Responsible for generating a report.

Please coordinate these agents and ensure that each agent completes its task before passing the result to the next agent. Use XML tags to structure your communication with each agent.

<task>
  <agent name="Agent A">
    Collect data from the following sources: [Source 1], [Source 2].
  </agent>
  <agent name="Agent B">
    Analyze the data collected by Agent A and identify key trends.
  </agent>
  <agent name="Agent C">
    Generate a report based on the analysis provided by Agent B.
  </agent>
</task>

Once all agents have completed their tasks, compile their outputs into a final report.
```

This prompt leverages XML tags, which Claude responds well to, allowing it to manage multiple agents in a structured way.[6][9]

### **Key Features:**
- **Chain-of-Thought (CoT)** prompting allows Claude to break down complex problems into logical steps.
- **XML tags** help organize communication between Claude and its sub-agents.
- You can instruct Claude to use multiple messages if needed, ensuring that it completes all subtasks sequentially.[6]

---

## **2. LangChain**

LangChain is another popular framework for orchestrating multiple agents using large language models (LLMs). It allows you to integrate LLMs with other computational elements, such as databases or APIs, making it ideal for complex workflows involving multiple agents.

### **How LangChain Communicates with Agents**
LangChain uses *chains* and *agents* to handle complex workflows. Chains are sequences of actions that LangChain executes in order, while agents are autonomous units capable of performing specific tasks based on user input.

#### **Example Prompt for LangChain:**
```python
from langchain.chains import SimpleSequentialChain
from langchain.prompts import PromptTemplate

# Define prompts for each agent
data_collection_prompt = PromptTemplate(input_variables=["source"], template="Collect data from {source}.")
data_analysis_prompt = PromptTemplate(input_variables=["data"], template="Analyze this data: {data}.")
report_generation_prompt = PromptTemplate(input_variables=["analysis"], template="Generate a report based on this analysis: {analysis}.")

# Create chains
data_collection_chain = SimpleSequentialChain([data_collection_prompt])
data_analysis_chain = SimpleSequentialChain([data_analysis_prompt])
report_generation_chain = SimpleSequentialChain([report_generation_prompt])

# Orchestrate the chains
collected_data = data_collection_chain.run(source="Source 1")
analysis = data_analysis_chain.run(data=collected_data)
final_report = report_generation_chain.run(analysis=analysis)

print(final_report)
```

This example demonstrates how you can use LangChain's `SimpleSequentialChain` to create a pipeline where each agent performs its task in sequence.[3]

### **Key Features:**
- **Prompt Templates** allow dynamic customization of prompts for each agent.
- **Sequential Chains** ensure that each agent completes its task before passing it on.
- LangChain supports both online and local models, giving you flexibility in choosing your LLM.[3]

---

## **3. Aider**

Aider is another tool designed for managing multi-agent systems. It is particularly useful in coding environments where you need different agents working on separate parts of a project.

### **How Aider Communicates with Agents**
Aider allows you to break down coding projects into smaller tasks and assign them to different agents. You can use prompts that specify which part of the codebase each agent should work on.

#### **Example Prompt for Aider:**
```plaintext
You are the main orchestrator AI for this coding project. Your task is to manage two coding agents:

1. Agent A: Responsible for writing the frontend code in JavaScript.
2. Agent B: Responsible for writing the backend code in Python.

Please coordinate these agents as follows:
- Agent A should first create a simple user interface.
- Once Agent A finishes, pass the UI design to Agent B so they can integrate it with the backend API.

Ensure that both agents follow best practices and provide detailed comments in their code.
```

This prompt helps Aider manage different parts of a project by assigning specific roles to each agent.[4]

### **Key Features:**
- Ideal for managing coding projects with multiple components.
- Allows you to specify which files or sections of code each agent should work on.[4]

---

## **4. Other Implementations**

### **Cline**
Cline is another tool that allows you to orchestrate multiple AI agents efficiently. It focuses on integrating various models and APIs into one cohesive workflow.

#### **Example Prompt for Cline:**
```plaintext
You are managing three AI agents:
1. Data Ingestion Agent - responsible for collecting data from external APIs.
2. Data Processing Agent - responsible for cleaning and processing the ingested data.
3. Reporting Agent - responsible for generating visual reports based on processed data.

Please ensure that each agent completes its task before passing it on to the next agent. Provide detailed logs after each step.
```

Cline excels at managing workflows where different models or APIs need to be integrated into one system.[5]

---

## **Conclusion**

In 2024, tools like Claude, LangChain, Aider, and Cline make it possible to orchestrate multi-agent systems where a main AI delegates tasks efficiently:

- **Claude** uses XML tags and chain-of-thought prompting for flexible task management.[6]
- **LangChain** offers customizable chains and prompt templates ideal for complex workflows.[3]
- **Aider** specializes in managing coding projects across multiple files or components.[4]
- **Cline** integrates various models and APIs into one cohesive system.[5]

These tools provide powerful ways to automate complex workflows by breaking them down into manageable subtasks handled by specialized agents.

### Sources

- [Claude 3 Opus's internal system prompt, according to ... - Reddit](https://www.reddit.com/r/singularity/comments/1b6xqme/claude_3_opuss_internal_system_prompt_according/)
- [Is Claude Dev finally the next level thing we been waiting ... - Reddit](https://www.reddit.com/r/ChatGPTCoding/comments/1embttz/is_claude_dev_finally_the_next_level_thing_we/)
- [Semantick Kernel, Prompt flow. Can someone explain me what each ...](https://www.reddit.com/r/aipromptprogramming/comments/1avvsw9/langchain_langsmith_llamaindex_and_from_microsoft/)
- [What's the best AI tool to help with coding? : r/ChatGPTCoding - Reddit](https://www.reddit.com/r/ChatGPTCoding/comments/1excgal/whats_the_best_ai_tool_to_help_with_coding/)
- [Advanced Prompt Engineering: Full Course : r/ArtificialInteligence](https://www.reddit.com/r/ArtificialInteligence/comments/1epsrfh/advanced_prompt_engineering_full_course/)
- [The People Who Are Having Amazing Results With Claude, Prompt ...](https://www.reddit.com/r/ClaudeAI/comments/1exy6re/the_people_who_are_having_amazing_results_with/)
- [I am coming back to LangChain! - Reddit](https://www.reddit.com/r/LangChain/comments/1c0oucr/i_am_coming_back_to_langchain/)
- [How do people design and build apps with Claude? - Reddit](https://www.reddit.com/r/ClaudeAI/comments/1ejv52g/how_do_people_design_and_build_apps_with_claude/)
- [New section on our docs for system prompt changes : r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/comments/1f1shun/new_section_on_our_docs_for_system_prompt_changes/)
- [Sonnet 3.5 Coding System Prompt (v2 with explainer) : r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/comments/1e39tvj/sonnet_35_coding_system_prompt_v2_with_explainer/)
