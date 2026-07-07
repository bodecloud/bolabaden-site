---
source_url: "https://www.perplexity.ai/search/c9648565-e49d-455e-97d5-18fb8ce3eb23"
thread_uuid: "0fcb3464-02b7-421c-a47a-4b56617300ae"
slug: "c9648565-e49d-455e-97d5-18fb8ce3eb23"
title: "Are there any examples of complex custom tools in CrewAI"
extracted_at: "2026-06-29T16:12:38.154Z"
matched_keywords: []
export_suite: "identity"
entry_count: 6
provenance: perplexity-rest-api
---

# Are there any examples of complex custom tools in CrewAI

Source: [Perplexity thread](https://www.perplexity.ai/search/c9648565-e49d-455e-97d5-18fb8ce3eb23)

## User

Are there any examples of complex custom tools in CrewAI

## Assistant

Yes, there are several examples of complex custom tools in **CrewAI**. These tools can be used to extend the capabilities of AI agents for tasks ranging from simple web searches to advanced data analysis and collaboration. Below are some examples of complex custom tools and their applications in CrewAI:

## **1. Custom Data Processing Tools**
CrewAI allows developers to create custom tools by inheriting from the `BaseTool` class or using the `tool` decorator. For instance, a developer can build a tool to perform specific data processing tasks, such as smoothing stock ticker data or performing calculations on retrieved datasets. Here's an example:

```python
from crewai_tools import BaseTool

class MyCustomTool(BaseTool):
    name = "My Custom Tool"
    description = "This tool processes stock ticker data."
    
    def _run(self, data: list) -> list:
        # Custom logic to smooth out stock ticker data
        smoothed_data = [sum(data[i:i+3])/3 for i in range(len(data)-2)]
        return smoothed_data
```

This tool can be integrated into an agent's workflow to process financial data retrieved from other tasks, such as web scraping or API queries.[2][3]

## **2. Web Scraping and Data Extraction Tools**
CrewAI supports the creation of custom web scraping tools that can extract specific information from websites. For example, a tool could be designed to scrape financial news or product prices from e-commerce platforms:

```python
from crewai_tools import BaseTool

class WebScraperTool(BaseTool):
    name = "Web Scraper"
    description = "Scrapes product prices from a given e-commerce website."
    
    def _run(self, url: str) -> dict:
        # Logic to scrape the website
        prices = scrape_prices_from_website(url)
        return prices
```

This tool can be used in conjunction with other agents tasked with analyzing market trends or generating reports based on scraped data.[4][2]

## **3. File Handling and Document Analysis Tools**
CrewAI also provides tools for handling files and documents, such as reading from directories or analyzing specific file types (e.g., CSV, PDF). For instance, a custom tool could be created to analyze CSV files containing large datasets:

```python
from crewai_tools import BaseTool

class CSVAnalyzerTool(BaseTool):
    name = "CSV Analyzer"
    description = "Analyzes CSV files and extracts key metrics."
    
    def _run(self, file_path: str) -> dict:
        # Logic to analyze the CSV file
        metrics = analyze_csv(file_path)
        return metrics
```

This type of tool is useful for agents involved in data analysis tasks, allowing them to automatically extract insights from large datasets stored in files.[3]

## **4. Multi-Agent Collaboration Tools**
CrewAI excels at enabling collaboration between multiple agents through custom tools that facilitate task delegation and coordination. For example, a team of agents could be assigned the task of researching a topic online and then writing a blog post based on that research:

```python
from crewai import Agent, Task, Crew

# Define agents with specific roles
researcher = Agent(
    role='Market Research Analyst',
    goal='Provide up-to-date market analysis',
    tools=[search_tool]
)

writer = Agent(
    role='Content Writer',
    goal='Write engaging blog posts',
    tools=[file_read_tool]
)

# Define tasks for each agent
research_task = Task(
    description='Research AI industry trends',
    agent=researcher,
)

write_task = Task(
    description='Write a blog post based on research',
    agent=writer,
)

# Create and execute the crew
crew = Crew(agents=[researcher, writer], tasks=[research_task, write_task])
crew.kickoff()
```

This setup demonstrates how multiple agents can collaborate using different tools to achieve a shared goal—such as researching and writing content in this case.[2][4]

## **Conclusion**
CrewAI provides a powerful framework for creating complex custom tools that extend AI agent capabilities across various domains like web scraping, data analysis, file handling, and multi-agent collaboration. Whether using built-in tools or developing new ones from scratch, CrewAI offers flexibility for building sophisticated AI-driven solutions tailored to specific needs.[3][4][2]

### Sources

- [Can some please post a super simple example of a custom tool in ...](https://www.reddit.com/r/crewai/comments/1cjkc5s/can_some_please_post_a_super_simple_example_of_a/)
  - I have searched the net for exam,ples, but found nothing that shows how to actually call a tool with passed arguments, or how to retrieve d the ...
- [Crewai:Tool](https://crewai.net/posts/crewai-tool/)
- [Tools - CrewAI docs!](https://docs.crewai.com/concepts/tools)
- [Deep dive into CrewAI (With Examples) - Composio](https://composio.dev/blog/crewai-examples/)

## User

Are there any examples of complex custom tools in SuperAGI

## Assistant

Yes, there are several examples of complex custom tools that can be built and integrated into **SuperAGI**. SuperAGI is an open-source framework designed to allow developers to create, manage, and run autonomous AI agents. These agents can be extended with custom tools to enhance their capabilities. Below are some examples of complex custom tools that can be developed within SuperAGI:

## **1. Custom Data Processing Tools**
Developers can create tools to process and analyze data within SuperAGI. For instance, a tool could be built to analyze financial data or perform specific calculations on datasets retrieved by the agent. The tool class would inherit from `BaseTool` and include logic for processing the data.

Example:

```python
from superagi.tools.base_tool import BaseTool
from pydantic import BaseModel, Field
from typing import Type

# Define the input schema using Pydantic
class DataProcessingInput(BaseModel):
    data: list = Field(..., description="List of numerical data to process")

# Define the custom tool class
class DataProcessingTool(BaseTool):
    name: str = "Data Processing Tool"
    args_schema: Type[BaseModel] = DataProcessingInput
    description: str = "Tool for processing numerical data"

    def _execute(self, data: list = None):
        # Custom logic for processing the data
        processed_data = [x * 2 for x in data]  # Example logic: multiply each element by 2
        return processed_data
```

This tool could be used by an agent to process numerical datasets retrieved from external sources.

## **2. Web Scraping Tools**
A complex web scraping tool can be created to extract specific information from websites, such as product prices or news articles. This tool would automate the process of gathering data from the web, which could then be analyzed or used by other tools.

Example:

```python
from superagi.tools.base_tool import BaseTool
import requests
from bs4 import BeautifulSoup

class WebScraperTool(BaseTool):
    name: str = "Web Scraper Tool"
    description: str = "Scrapes product prices from e-commerce websites"

    def _execute(self, url: str = None):
        # Logic for scraping the website
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        prices = [price.text for price in soup.find_all(class_='price')]  # Example selector
        return prices
```

This tool could help an agent collect pricing information from multiple e-commerce sites and compare them.

## **3. File Analysis Tools**
SuperAGI allows developers to build tools that handle file analysis tasks, such as reading CSV files and extracting insights. This could be useful for agents tasked with analyzing large datasets stored in files.

Example:

```python
import csv
from superagi.tools.base_tool import BaseTool

class CSVAnalyzerTool(BaseTool):
    name: str = "CSV Analyzer Tool"
    description: str = "Analyzes CSV files and extracts key metrics"

    def _execute(self, file_path: str = None):
        with open(file_path, mode='r') as file:
            csv_reader = csv.DictReader(file)
            rows = list(csv_reader)
            return {"row_count": len(rows), "columns": csv_reader.fieldnames}
```

This tool would allow an agent to read a CSV file and extract key metrics such as the number of rows and column names.

## **4. Multi-Tool Integration via Toolkits**
SuperAGI supports creating **toolkits**, which are collections of related tools that can work together to achieve more complex tasks. For example, a toolkit could combine a web scraper with a data processor and a report generator.

Example:

```python
from superagi.tools.base_tool import BaseToolkit, BaseTool

class MyToolkit(BaseToolkit):
    name: str = "My Custom Toolkit"
    description: str = "A toolkit combining web scraping and data processing tools"

    def get_tools(self) -> list[BaseTool]:
        return [WebScraperTool(), DataProcessingTool()]

    def get_env_keys(self) -> list[str]:
        return []
```

This toolkit allows an agent to scrape data from the web and then process it using the integrated tools.

## **5. API Interaction Tools**
Custom tools can also interact with external APIs to retrieve or send data. For example, a tool could be built to interact with a financial API to retrieve stock market information or perform trades.

Example:

```python
import requests
from superagi.tools.base_tool import BaseTool

class StockMarketAPITool(BaseTool):
    name: str = "Stock Market API Tool"
    description: str = "Retrieves stock prices from an external API"

    def _execute(self, stock_symbol: str = None):
        api_url = f"https://api.example.com/stocks/{stock_symbol}"
        response = requests.get(api_url)
        return response.json()
```

This tool could be used by an agent tasked with monitoring stock prices or making investment decisions based on real-time data.

## **Conclusion**
SuperAGI offers a flexible framework for building complex custom tools that extend the capabilities of autonomous AI agents. Developers can create tools for tasks such as data processing, web scraping, file analysis, API interaction, and more. By leveraging SuperAGI's toolkit system, these tools can be combined into powerful workflows that enable agents to handle sophisticated tasks autonomously.[1][2]

### Sources

- [Adding your own custom tool/toolkit to SuperAGI](https://superagi.com/adding-your-own-custom-tool-toolkit-to-superagi/)
- [Building Your Own Custom Tool in SuperAGI: A Step-by-Step Guide](https://superagi.com/building-your-own-custom-tool-in-superagi/)
- [SuperAGI: Unleashing the Power of Autonomous AI Agents – Kanaries](https://docs.kanaries.net/topics/ChatGPT/SuperAGI)

## User

How to highly customize the prompt flow and system prompts to achieve personalized task flows in SuperAGI?

## Assistant

To highly customize the **prompt flow** and **system prompts** in SuperAGI to achieve personalized task flows, you can follow several strategies. Customizing these elements allows you to tailor the behavior of AI agents to specific tasks, goals, and workflows. Below are key approaches to achieve this:

## **1. Crafting Custom Prompts for Agents**
The prompt is the primary mechanism that controls the behavior of an agent in SuperAGI. A well-crafted prompt serves as a blueprint for the agent, guiding its actions and ensuring it stays aligned with the desired objectives. To customize the prompt flow:

- **Define clear goals and constraints**: The prompt should clearly define what the agent is expected to achieve and any constraints it must follow. This ensures that the agent remains focused on its task without deviating from its intended purpose.
  
- **Use multi-agent systems for complex tasks**: If a single agent's prompt becomes too complex, you can break down tasks into multiple agents, each with a simpler prompt. This allows for more manageable and specialized agents that collaborate to achieve a common goal.[1]

- **Incorporate dynamic inputs**: You can design prompts that adapt based on real-time inputs or outputs from previous steps. This enables agents to adjust their behavior dynamically as they progress through tasks.

### Example:
```python
from superagi import Agent

# Create an agent with a custom prompt
my_agent = Agent(prompt="You are an expert data analyst. Your task is to analyze customer feedback data and generate insights about product performance.")
```

## **2. Customizing System Prompts**
System prompts are used to set up the overall context in which agents operate, including their persona, role, and task-specific instructions. These can be customized for more personalized workflows by:

- **Defining agent personas**: You can assign specific roles or personas to agents through system prompts (e.g., "You are a marketing expert" or "You are a financial advisor"). This helps shape how the agent approaches tasks and interacts with other agents or tools.

- **Establishing communication protocols**: In multi-agent systems, system prompts can guide how agents communicate with each other. For example, using the **Agent-to-Agent Communication Protocol (AACP)** ensures structured communication between agents working on different parts of a task.[1]

### Example:
```python
from superagi import Agent

# Set up an agent with a persona
my_agent = Agent(prompt="You are an experienced project manager responsible for coordinating between multiple teams.")
```

## **3. Creating Custom Workflows**
SuperAGI allows for creating custom workflows that define how agents execute tasks step-by-step. These workflows can be customized by coding specific task flows in Python files like `workflow_seed.py` and `main.py`:

- **Define step-by-step processes**: Use workflows to break down complex tasks into smaller steps, where each step has its own input and output instructions.[5]
  
- **Looping and conditional logic**: You can incorporate looping mechanisms where certain steps repeat based on conditions or feedback from previous steps. This allows agents to iterate over tasks until they meet specified criteria.

### Example of Workflow Customization:
```python
# Define workflow steps in workflow_seed.py
def my_custom_workflow():
    step_1 = {"step_type": "TRIGGER", "tool": "DataScraperTool", "input_instruction": "Scrape data from website"}
    step_2 = {"step_type": "ACTION", "tool": "DataAnalyzerTool", "input_instruction": "Analyze scraped data"}
    return [step_1, step_2]
```

## **4. Adding Custom Tools**
Custom tools can be integrated into SuperAGI to extend an agent’s capabilities and personalize task flows further. By building custom tools tailored to specific needs (e.g., web scraping, data analysis), you can ensure that agents have access to the right resources at each step of their workflow.[2][6]

### Example of Adding a Custom Tool:
```python
from superagi.tools.base_tool import BaseTool

class MyCustomTool(BaseTool):
    name = "Custom Data Processor"
    description = "Processes data for analysis"
    
    def _execute(self, data: list):
        # Custom logic for processing data
        return [d * 2 for d in data]
```

## **5. Fine-Tuning Agent Behavior via Memory**
Memory plays a crucial role in customizing how agents handle long-term tasks or remember previous interactions. By customizing memory settings, you can ensure that agents retain important context across multiple sessions or iterations of a task.[1]

- **Persistent memory**: Agents can store key information about their environment or previous actions, allowing them to make better decisions in future interactions.
  
- **Task-specific memory**: Customize memory usage so that only relevant information is stored based on the current task flow.

### Example:
```python
from superagi.memory import Memory

# Initialize memory for an agent
my_agent_memory = Memory()
my_agent_memory.store("key_information", value="Important data point")
```

## **6. Using Toolkits for Complex Task Flows**
SuperAGI supports toolkits—collections of related tools—that can be used together within workflows. By creating custom toolkits, you can streamline complex task flows where multiple tools need to work in tandem.[6][2]

### Example of Creating a Toolkit:
```python
from superagi.tools.base_tool import BaseToolkit

class MyToolkit(BaseToolkit):
    name = "Data Processing Toolkit"
    description = "A toolkit for scraping and analyzing web data"
    
    def get_tools(self):
        return [WebScraperTool(), DataAnalyzerTool()]
```

## **Conclusion**
To highly customize prompt flows and system prompts in SuperAGI for personalized task flows:

- Design clear prompts that define goals and constraints.
- Use system prompts to establish agent personas and communication protocols.
- Create custom workflows by coding step-by-step processes with looping logic.
- Integrate custom tools and toolkits tailored to specific tasks.
- Leverage memory settings to enhance long-term context retention.

By following these approaches, you can create highly personalized and efficient task flows within SuperAGI's autonomous agent framework.

### Sources

- [Multi-Agent System - SuperAGI](https://superagi.com/multi-agent-system/)
  - The prompt, that controls the behavior of the agent should be therefore crafted in such a way that it works in the way we want it to work, and ...
- [Adding your own custom tool/toolkit to SuperAGI](https://superagi.com/adding-your-own-custom-tool-toolkit-to-superagi/)
  - The article aims to guide you step-by-step through the process of building and adding your own custom tool with SuperAGI.
- [SuperAGI – Autonomous AI Agent Systems](https://superagi.com)
  - AI Agents for fully autonomous sales, support, marketing and app development. Get a Demo Start for Free Join Our Thriving Community of Users.
- [SuperAGI: Unleashing the Power of Autonomous AI Agents](https://docs.kanaries.net/topics/ChatGPT/SuperAGI)
- [Building Autonomous Business Processes using AI Agent Workflows](https://superagi.com/building-autonomous-business-processes-using-ai-agent-workflows/)
- [Building Your Own Custom Tool in SuperAGI: A Step-by-Step Guide - SuperAGI](https://superagi.com/building-your-own-custom-tool-in-superagi/)

## User

What are the best practices for crafting prompts in SuperAGI

## Assistant

To craft effective prompts in **SuperAGI**, it’s essential to follow best practices that ensure the AI agents deliver accurate, relevant, and efficient responses. These best practices help shape the behavior of the AI, guiding it to perform tasks in alignment with your objectives. Below are some key strategies for crafting prompts in SuperAGI:

## **1. Be Clear and Specific**
Clarity and specificity are crucial when writing prompts. A well-defined prompt minimizes ambiguity, allowing the AI to understand the task more precisely.

- **Define the Objective**: Clearly state what you want the AI to achieve. This ensures that the agent focuses on the correct task without deviating.
- **Provide Context**: Include relevant background information or conditions that help the AI understand the scope of the task.
  
**Example**:
```python
"You are a financial analyst. Your task is to analyze quarterly earnings reports and identify trends in revenue growth."
```

This prompt clearly defines the role of the agent and its specific task, reducing confusion.

## **2. Use Positive Instructions**
Focus on what you want the AI to do rather than what it should avoid. Negative instructions can confuse models, leading to suboptimal results.

- **Action-Oriented Verbs**: Start your prompts with verbs like *generate*, *create*, or *analyze* to guide the AI toward action.
  
**Example**:
```python
"Generate a list of key performance indicators (KPIs) based on this financial report."
```

Avoid phrasing like "Do not include irrelevant data," which can be interpreted ambiguously.

## **3. Provide Examples**
Supplying relevant examples helps guide the AI by setting a precedent for the type of output you expect. This is especially useful for complex tasks.

- **Match Format and Style**: Ensure that your examples reflect the format, tone, and quality of output you want.
  
**Example**:
```python
"Analyze this dataset and provide insights similar to this example: 'Revenue increased by 15% year-over-year due to higher sales in North America.'"
```

Providing examples helps the AI model its response after your desired output.

## **4. Structure Prompts for Clarity**
A well-structured prompt is easier for an AI agent to interpret and execute accurately. Break down complex instructions into simpler, sequential steps.

- **Step-by-Step Instructions**: If a task involves multiple steps, outline them clearly.
  
**Example**:
```python
"Step 1: Scrape product reviews from e-commerce websites. Step 2: Analyze sentiment from these reviews using natural language processing techniques."
```

This approach ensures that each part of a complex task is executed correctly.

## **5. Specify Desired Output Format**
Clearly specifying how you want the response formatted (e.g., lists, tables, or bullet points) can significantly improve accuracy.

- **Format Requirements**: Let the AI know if you need an answer in a specific format such as code snippets, bullet points, or structured text.
  
**Example**:
```python
"Provide your analysis in bullet points, highlighting key trends and data points."
```

This helps ensure that you receive responses in a usable format without needing additional adjustments.

## **6. Experiment with Different Phrasings**
Prompt engineering is often an iterative process. Testing different phrasings or structures can help fine-tune how well an agent performs its tasks.

- **Iterative Testing**: Try rewording prompts or changing their structure to see how it impacts results.
  
**Example**:
```python
"Analyze customer feedback data." 
vs.
"Analyze customer feedback data to identify common complaints about product quality."
```

The second prompt provides more guidance, leading to more targeted results.

## **7. Consider Task Complexity**
For complex tasks, break down prompts into smaller sub-tasks or use multi-agent systems where each agent handles a specific part of the workflow.

- **Modular Prompts**: Divide complex tasks into simpler components that can be handled sequentially by different agents.
  
**Example**:
```python
Agent 1: "Scrape data from news websites."
Agent 2: "Summarize key news articles related to technology trends."
```

This modular approach ensures that each step is handled efficiently without overwhelming a single agent.

## **8. Maintain Consistency**
Use consistent formatting and structure across multiple prompts if they are part of a larger workflow. This helps agents recognize patterns and improves performance over time.

- **Uniform Formatting**: Keep formatting consistent across all related prompts to enhance pattern recognition by agents.
  
**Example**:
```python
"Step 1: Identify market trends from financial reports."
"Step 2: Summarize key findings in bullet points."
```

Consistency helps streamline workflows and reduces errors in multi-step processes.

## **9. Include Constraints When Necessary**
If there are specific constraints (e.g., time limits, word count), include them in your prompt to guide the AI’s output more effectively.

- **Explicit Constraints**: Define any limitations clearly within your prompt.
  
**Example**:
```python
"Summarize this document in no more than 200 words."
```

This ensures that responses are concise and adhere to your requirements.

## **10. Iterate Based on Feedback**
As you work with SuperAGI agents, iteratively refine your prompts based on feedback from their outputs. Adjusting prompts based on real-world performance helps improve accuracy over time.

### Example Process:
1. Initial Prompt: "Analyze sales data from Q3 2024."
2. Feedback: The response includes unnecessary details.
3. Refined Prompt: "Analyze sales data from Q3 2024 and focus only on revenue growth."

By iterating on your prompt design, you can fine-tune it for better results over time.

---

By following these best practices for crafting prompts in SuperAGI, you can significantly improve how well agents perform tasks, ensuring they deliver accurate and relevant results tailored to your needs.

### Sources

- [filipecalegario/awesome-generative-ai: A curated list of ... - GitHub](https://github.com/filipecalegario/awesome-generative-ai)
  - This repository is a curated collection of references in the dynamic field of Generative AI, equipped with various sources such as academic papers, technical ...
- [Prompt engineering best practices for In-Context Learning - Reddit](https://www.reddit.com/r/aipromptprogramming/comments/1g8uimj/prompt_engineering_best_practices_for_incontext/)
  - Use high-quality, relevant examples: This one probably goes without saying. · Varied examples: Ensure your examples cover different scenarios.
- [Crafting Effective Prompts: Tips and Best Practices](https://help.ocoya.com/en/articles/8294281-crafting-effective-prompts-tips-and-best-practices)
- [Prompt Engineering Best Practices: Tips, Tricks, and Tools](https://www.digitalocean.com/resources/articles/prompt-engineering-best-practices)
- [A Guide to Crafting Effective Prompts for Diverse Applications](https://community.openai.com/t/a-guide-to-crafting-effective-prompts-for-diverse-applications/493914)
- [10 Prompt Engineering Best Practices - Pieces for Developers](https://pieces.app/blog/10-prompt-engineering-best-practices)

## User

How do I balance specificity and flexibility in my prompts

## Assistant

Balancing **specificity** and **flexibility** in AI prompts is crucial for ensuring that the AI generates relevant and accurate responses while remaining adaptable to a range of inputs. Here are some best practices to achieve this balance:

## **1. Be Clear and Specific, but Not Overly Restrictive**
Specific prompts help the AI focus on the task at hand, but being too rigid can limit the AI’s ability to provide creative or unexpected insights. The key is to provide enough detail to guide the AI without micromanaging its response.

- **Tip**: Include essential details, but leave room for the AI to interpret and expand on them.
  
**Example**:
- **Too Specific**: "List five benefits of AI in healthcare, focusing only on diagnostic tools in MRI machines."
- **Balanced**: "List five benefits of AI in healthcare, with a focus on diagnostic tools."

By removing overly narrow constraints (e.g., limiting it to MRI machines), you allow the AI to explore a broader range of diagnostic tools while still keeping the focus on healthcare.[1][4]

## **2. Use Context to Guide Flexibility**
Providing context helps the AI understand the background of your query, allowing it to generate more relevant responses. However, avoid overloading the prompt with unnecessary information.

- **Tip**: Provide enough context for clarity but avoid overwhelming the AI with too much detail.

**Example**:
- **Too Vague**: "Summarize this report."
- **Balanced**: "Summarize this report with a focus on how market trends have shifted in the last quarter."

Here, the context ("market trends in the last quarter") helps guide the AI without being overly prescriptive.[7][1]

## **3. Break Down Complex Tasks into Manageable Parts**
Complex tasks may require multiple steps. Instead of cramming everything into one prompt, break it down into smaller, manageable parts while still allowing flexibility within each step.

- **Tip**: Use sequential prompts for multi-step tasks, giving flexibility within each step.

**Example**:
- Step 1: "Analyze customer feedback data from Q3 2024."
- Step 2: "Identify common complaints related to product quality."

This approach allows flexibility within each step while maintaining specificity about what needs to be done at each stage.[5][6]

## **4. Use Iterative Refinement**
Testing and refining your prompts is an effective way to balance specificity and flexibility. Start with a general prompt and refine it based on the AI’s output until you achieve the desired balance.

- **Tip**: Begin with a broader prompt and adjust based on feedback from initial outputs.

**Example Process**:
1. Initial Prompt: "Describe how AI improves patient care."
2. Refined Prompt: "Describe how AI improves patient care by enhancing diagnostic accuracy and treatment recommendations."

This iterative process allows you to find the right level of specificity without being too restrictive.[1][7]

## **5. Specify Output Format Without Limiting Creativity**
While specifying an output format (e.g., bullet points, lists) can help structure responses, avoid limiting creative or insightful answers by being too rigid about how content should be presented.

- **Tip**: Specify format when necessary but allow flexibility in content generation.

**Example**:
- **Too Restrictive**: "List three benefits of renewable energy in exactly 100 words."
- **Balanced**: "List three benefits of renewable energy in bullet points, providing brief explanations for each."

This ensures clear formatting while giving flexibility in how much detail the AI provides.[6][7]

## **6. Encourage Positive Instructions**
Focus on what you want the AI to do rather than what it should avoid. Positive instructions help guide the AI without restricting its ability to explore different approaches.

- **Tip**: Use action-oriented verbs and avoid negative phrasing.

**Example**:
- **Negative Instruction**: "Don’t include irrelevant data."
- **Positive Instruction**: "Focus on relevant data related to product performance."

Positive instructions keep the task clear while allowing flexibility in how the AI approaches it.[4][6]

## **Conclusion**
Balancing specificity and flexibility in prompts requires careful consideration of how much guidance you provide versus how much freedom you allow the AI. By being clear about your objectives, providing relevant context, breaking tasks into manageable parts, iterating your prompts, specifying formats when necessary, and using positive instructions, you can craft prompts that are both specific enough for accuracy and flexible enough for creativity and adaptability.

### Sources

- [Tips for AI Prompts: Expert Tips And Examples - New Horizons - Blog](https://www.newhorizons.com/resources/blog/tips-for-ai-prompts)
  - In this blog post, we will explore essential tips for creating effective AI prompts. These strategies will help you harness the full potential of AI.
- [How to talk to AIs: Advanced Prompt Engineering](https://etc.cuit.columbia.edu/news/how-talk-ais-advanced-prompt-engineering)
  - Researchers and users are discovering several methods for effective prompt engineering, which we can discuss in a later session. Here are a few examples.
- [Navigating the Complexities of Prompt Engineering in Large ...](https://www.linkedin.com/pulse/navigating-complexities-prompt-engineering-large-models-homaei--ma6lf)
- [Prompt Engineering Best Practices: Tips, Tricks, and Tools | DigitalOcean](https://www.digitalocean.com/resources/articles/prompt-engineering-best-practices)
- [How to use AI writing prompts to get the best out of your AI tools](https://sproutsocial.com/insights/ai-prompt/)
- [10 Prompt Engineering Best Practices](https://pieces.app/blog/10-prompt-engineering-best-practices)
- [How To Write AI Prompts: 10 Essential Steps | CKEditor](https://ckeditor.com/blog/create-good-ai-prompts/)

## User

With SuperAGI, how do I perform tasks concurrently...? Do I need to manually implement ProcessPoolExecutor or similar?

## Assistant

In **SuperAGI**, you can perform tasks concurrently without needing to manually implement concurrency mechanisms like `ProcessPoolExecutor`. SuperAGI natively supports running multiple agents concurrently, allowing you to maximize efficiency and achieve parallel processing without additional code for managing concurrency.

### Key Points on Concurrent Task Execution in SuperAGI:
1. **Built-in Concurrent Agent Execution**: SuperAGI is designed to allow developers to run multiple agents simultaneously. This feature is integrated into the platform, so you don’t need to manually manage processes or threads using Python’s `concurrent.futures` or similar libraries.[1][4][5]

2. **Agent Workflows**: You can create custom workflows where multiple agents can work on different tasks in parallel. This enables you to break down complex tasks into smaller, concurrent tasks that agents can execute independently.[6]

3. **No Need for Manual Concurrency Management**: Since SuperAGI handles concurrency internally, you don’t need to implement `ProcessPoolExecutor` or similar concurrency models manually. The platform is optimized for running agents in parallel, and it manages resource allocation and task distribution behind the scenes.[8]

### How to Use Concurrent Agents in SuperAGI:
- **Provision Multiple Agents**: You can provision and spawn multiple agents through the SuperAGI interface or programmatically via code. These agents will run concurrently, each handling its assigned task.
- **Extend Agent Capabilities**: By adding tools or toolkits to your agents, you can ensure that each agent has the necessary resources to perform its tasks efficiently while running in parallel.[7][1]
- **Monitor and Control**: SuperAGI provides a graphical user interface (GUI) and an action console that allows you to monitor the performance of concurrent agents and interact with them in real-time.[4][8]

In summary, SuperAGI's architecture is built to handle concurrent task execution seamlessly. You can rely on its built-in capabilities for running multiple agents in parallel without needing to manually implement concurrency mechanisms like `ProcessPoolExecutor`.

### Sources

- [SuperAGI: Building & Managing AI Agents | Zenitech](https://zenitech.co.uk/insights/articles/superagi/)
  - SuperAGI is an open-source platform that provides infrastructure for building autonomous AI agents. It allows developers to spawn, deploy, and manage AI agents ...
- [Running a ProcessPoolExecutor in IPython - Stack Overflow](https://stackoverflow.com/questions/61860800/running-a-processpoolexecutor-in-ipython)
  - I was running a simple multiprocessing example in my IPython interpreter (IPython 7.9.0, Python 3.8.0) on my MacBook and ran into a strange error.
- [python - How to store concurrent.futures ProcessPoolExecutor HTTP ...](https://stackoverflow.com/questions/70888034/how-to-store-concurrent-futures-processpoolexecutor-http-responses-and-process-i)
  - I have a project I am working on and I'm looking to use concurrent.futures ProcessPoolExecutor send a high number of HTTP requests.
- [Introduction to SuperAGI | SuperAGI Docs](https://superagi.com/docs/)
- [SuperAGI Vs TaskMatrix: Comparing AI Builder Brands - SmythOS](https://smythos.com/ai-agents/ai-agent-builders/superagi-vs-taskmatrix/)
- [Building Autonomous Business Processes using AI Agent Workflows - SuperAGI](https://superagi.com/building-autonomous-business-processes-using-ai-agent-workflows/)
- [SuperAGI: Unleashing the Power of Autonomous AI Agents – Kanaries](https://docs.kanaries.net/topics/ChatGPT/SuperAGI)
- [Open-source framework to build, manage and run autonomous AI ...](https://autonomics.hashnode.dev/getting-started-with-superagi-framework-for-building-useful-autonomous-ai-agents)
