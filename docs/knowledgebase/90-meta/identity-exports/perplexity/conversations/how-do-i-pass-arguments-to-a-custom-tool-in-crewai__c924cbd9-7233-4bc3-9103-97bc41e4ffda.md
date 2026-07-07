---
source_url: "https://www.perplexity.ai/search/feca20a9-354e-4914-8857-7f0ecd393120"
thread_uuid: "c924cbd9-7233-4bc3-9103-97bc41e4ffda"
slug: "feca20a9-354e-4914-8857-7f0ecd393120"
title: "How do I pass arguments to a custom tool in CrewAI"
extracted_at: "2026-06-29T16:12:39.541Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# How do I pass arguments to a custom tool in CrewAI

Source: [Perplexity thread](https://www.perplexity.ai/search/feca20a9-354e-4914-8857-7f0ecd393120)

## User

How do I pass arguments to a custom tool in CrewAI

## Assistant

To pass arguments to a custom tool in CrewAI, you can follow these steps based on the framework's tool creation guidelines:

### 1. **Create a Custom Tool**
You can create a custom tool by either subclassing `BaseTool` or using the `@tool` decorator.

#### Subclassing `BaseTool`
Subclassing `BaseTool` allows you to define a schema for the arguments (using `args_schema`) and implement the tool's logic in the `_run` method.

```python
from typing import Type
from crewai.tools import BaseTool
from pydantic import BaseModel, Field

# Define the schema for input arguments
class MyToolInput(BaseModel):
    argument: str = Field(..., description="Description of the argument.")

# Define the custom tool by subclassing BaseTool
class MyCustomTool(BaseTool):
    name: str = "My Custom Tool"
    description: str = "This tool does something special."
    args_schema: Type[BaseModel] = MyToolInput

    def _run(self, argument: str) -> str:
        # Your tool's logic here
        return f"Processed argument: {argument}"
```

In this example, `MyCustomTool` takes an argument (defined in `MyToolInput`) and processes it in the `_run` method.

#### Using the `@tool` Decorator
Alternatively, you can use the `@tool` decorator for a more concise implementation:

```python
from crewai.tools import tool

@tool("My Simple Tool")
def my_simple_tool(argument: str) -> str:
    """This tool processes a simple string argument."""
    # Tool logic here
    return f"Processed argument: {argument}"
```

### 2. **Pass Arguments to the Tool**
Once you've defined your custom tool, you need to pass arguments to it when invoking it within an agent or task. The framework automatically handles passing arguments based on the agent's task description or function calls.

For example, if your agent is supposed to use this tool within a task, you can specify the input in the task definition:

```python
from crewai import Agent, Task, Crew

# Define an agent with your custom tool
agent = Agent(
    role='Data Processor',
    goal='Process data using a custom tool',
    tools=[my_simple_tool],  # Add your custom tool here
)

# Define a task that uses this agent and passes arguments to the tool
task = Task(
    description='Process this string with the custom tool.',
    expected_output='Processed string output.',
    agent=agent,
    function_args={'argument': 'Hello, CrewAI!'}  # Pass arguments here
)

# Create and execute crew tasks
crew = Crew(agents=[agent], tasks=[task])
crew.kickoff()
```

In this example:
- The task specifies what argument (`'Hello, CrewAI!'`) should be passed to the tool.
- The `function_args` dictionary is used to map input parameters to the corresponding arguments of your custom tool.

### 3. **Handling Input Validation**
CrewAI uses Pydantic models for validating inputs. By defining an input schema (like `MyToolInput`), you ensure that only valid inputs are passed to your tool. If invalid data is provided, CrewAI will raise an error before running the tool.

### 4. **Example with Multiple Arguments**
If your tool requires multiple arguments, you can define them in your input schema:

```python
class MultiplyInput(BaseModel):
    first_number: int = Field(..., description="The first number.")
    second_number: int = Field(..., description="The second number.")

class MultiplyTool(BaseTool):
    name: str = "Multiplication Tool"
    description: str = "Multiplies two numbers."
    args_schema: Type[BaseModel] = MultiplyInput

    def _run(self, first_number: int, second_number: int) -> int:
        return first_number * second_number
```

Then pass both arguments when calling the tool:

```python
task = Task(
    description='Multiply two numbers using the multiplication tool.',
    expected_output='Product of two numbers.',
    agent=agent,
    function_args={'first_number': 3, 'second_number': 5}
)
```

### Conclusion
Passing arguments to a custom tool in CrewAI involves defining an input schema (if needed), creating a custom tool using either subclassing or decorators, and specifying input values when defining tasks or agents. This approach ensures that tools are flexible and reusable across different agents and tasks within CrewAI's workflow.

By following these steps, you can effectively manage how data flows into your tools and ensure they are invoked with appropriate inputs during execution.[2][5][6]

### Sources

- [Can some please post a super simple example of a custom tool in ...](https://www.reddit.com/r/crewai/comments/1cjkc5s/can_some_please_post_a_super_simple_example_of_a/)
  - It expects a argument of something like "2*3" or "1+1", but the only place it is 'called' is in the agents 'tools' definition: tools=[ ...
- [Create Custom Tools - CrewAI docs!](https://docs.crewai.com/how-to/create-custom-tools)
- [CrewAI - Building a Custom Crew - YouTube](https://www.youtube.com/watch?v=2Uar1fDKYpQ)
- [How to pass inputs from agents/Tasks to a custom tool in crew ai](https://github.com/crewAIInc/crewAI/issues/1005)
- [Crewai:Tool](https://crewai.net/posts/crewai-tool/)
- [Tools - CrewAI docs!](https://docs.crewai.com/concepts/tools)
