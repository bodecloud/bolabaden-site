---
source_url: "https://www.perplexity.ai/search/ccdd2729-35b2-423a-8564-a2b5c986b30f"
thread_uuid: "675a575a-303f-452c-b5ca-af54ac52e421"
slug: "ccdd2729-35b2-423a-8564-a2b5c986b30f"
title: "Are there any examples of complex custom tools in SuperAGI?"
extracted_at: "2026-06-29T12:53:26.948Z"
matched_keywords: ["docker"]
entry_count: 1
provenance: perplexity-rest-api
---

# Are there any examples of complex custom tools in SuperAGI?

Source: [Perplexity thread](https://www.perplexity.ai/search/ccdd2729-35b2-423a-8564-a2b5c986b30f)

## User

Are there any examples of complex custom tools in SuperAGI?

## Assistant

Yes, there are examples of complex custom tools in SuperAGI. SuperAGI is an open-source framework designed for building and managing autonomous AI agents, and it allows developers to create custom tools that extend the functionality of these agents.

Here are some examples of complex custom tools and toolkits that can be built within SuperAGI:

### **1. Custom Tool Example: Greeting Tool**
A simple but illustrative example is the **Greeting Tool**, which demonstrates how to create a custom tool for SuperAGI. This tool is designed to process a message input and return a greeting. The repository for this tool includes the following components:
- **`tool1.py`**: Contains the logic for the greeting tool.
- **`toolname_toolkit.py`**: Defines the toolkit, including its name, description, and the tools it contains.
- **`requirements.txt`**: Lists dependencies required by the tool.

This example showcases how to structure a repository and integrate it with SuperAGI using Docker and GitHub. The Greeting Tool is relatively simple but serves as a foundation for more complex tools.[1][2]

### **2. Complex Custom Tool Example: MyTool**
Another example involves building a more complex custom tool, such as **MyTool**, which processes specific inputs defined in a schema using Pydantic models. In this case:
- A Python file (`my_tool.py`) defines a class inheriting from `BaseTool`, where you specify attributes like `name`, `args_schema`, and `description`. The core logic of the tool is implemented in the `_execute` method.
- A toolkit file (`my_toolkit.py`) defines a class inheriting from `BaseToolkit`, which manages multiple tools and environment variables.

This setup allows developers to create tools with more advanced logic, such as interacting with APIs or processing complex data structures.[2]

### **3. Custom Tools in SuperAGI Marketplace**
SuperAGI also supports a marketplace where developers can contribute their custom tools for community use. This allows users to access and integrate various complex toolkits developed by others. To contribute, developers must ensure their toolkits pass unit tests and provide comprehensive documentation (README.md) for configuration.[4]

These examples demonstrate that SuperAGI provides robust support for creating both simple and complex custom tools, enabling developers to enhance the capabilities of autonomous AI agents significantly.

### Sources

- [Adding your own custom tool/toolkit to SuperAGI](https://superagi.com/adding-your-own-custom-tool-toolkit-to-superagi/)
- [Building Your Own Custom Tool in SuperAGI: A Step-by-Step Guide](https://superagi.com/building-your-own-custom-tool-in-superagi/)
- [SuperAGI: Unleashing the Power of Autonomous AI Agents – Kanaries](https://docs.kanaries.net/topics/ChatGPT/SuperAGI)
- [TransformerOptimus/SuperAGI-Tools - GitHub](https://github.com/TransformerOptimus/SuperAGI-Tools)
- [SuperAGI - AI Agent Frameworks](https://aiagentframeworks.ai/superagi/)
