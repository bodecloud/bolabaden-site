---
source_url: "https://www.perplexity.ai/search/d264d59c-ce87-4d42-b93e-fd5ba055f25c"
thread_uuid: "66461469-345f-46c6-a1e3-23fd17c35d54"
slug: "d264d59c-ce87-4d42-b93e-fd5ba055f25c"
title: "Show me how to get started with SuperAGI. All I care about is the python code examples in various contexts... i already have stuff installed i just want to understand how to actually setup basic implementations and bridge into advanced usages"
extracted_at: "2026-06-29T12:53:26.027Z"
matched_keywords: ["docker","docker-compose"]
entry_count: 1
provenance: perplexity-rest-api
---

# Show me how to get started with SuperAGI. All I care about is the python code examples in various contexts... i already have stuff installed i just want to understand how to actually setup basic implementations and bridge into advanced usages

Source: [Perplexity thread](https://www.perplexity.ai/search/d264d59c-ce87-4d42-b93e-fd5ba055f25c)

## User

Show me how to get started with SuperAGI. All I care about is the python code examples in various contexts... i already have stuff installed i just want to understand how to actually setup basic implementations and bridge into advanced usages

## Assistant

To get started with **SuperAGI** and explore its Python code implementations, I'll guide you through basic setups and bridge into more advanced usages. SuperAGI is an open-source framework designed to help developers build, manage, and run autonomous AI agents. Below are steps and examples to help you implement SuperAGI in various contexts using Python.

## **Basic Setup: Installing the SuperAGI Python Client**

To interact with SuperAGI using Python, you need to install the **SuperAGI Python Client Library**. This library simplifies the interaction between your Python application and the SuperAGI platform.

1. **Install the SuperAGI client library**:
   ```bash
   pip install superagi-client
   ```

2. **Initialize the Client**:
   After installation, initialize the client by importing the library and providing your API key:
   ```python
   from superagi_client import Client

   client = Client(api_key="YOUR_API_KEY", url="https://app.superagi.com/")
   ```

## **Creating a Basic Agent**

An agent in SuperAGI is an entity that performs tasks autonomously. You can create an agent by defining its configuration, including name, goals, instructions, and tools.

Here’s how you can create a simple agent:

```python
from superagi_client import AgentConfig

agent_config = AgentConfig(
    name="Sample Agent",
    description="This agent performs a simple task.",
    goal=["Complete a basic task"],
    instruction=["Follow these instructions carefully."],
    agent_workflow="Goal Based Workflow",
    constraints=[],
    tools=[{"name": "ToolName"}],  # Replace with actual tool names
    iteration_interval=500,  # Time between iterations (ms)
    max_iterations=10,  # Maximum number of iterations
    model="gpt-4"  # AI model to be used
)

agent = client.create_agent(agent_config=agent_config)
```

### **Starting an Agent Run**

Once your agent is created, you can start its run using the following code:

```python
agent_id = agent['agent_id']
run_agent = client.create_agent_run(agent_id=agent_id)
```

This starts an agent run and returns details about the run.

## **Advanced Usage: Customizing Agents**

### **Updating an Agent's Configuration**

If you need to update an existing agent’s configuration (e.g., changing goals or tools), you can use the `AgentUpdateConfig` class:

```python
from superagi_client import AgentUpdateConfig

updated_config = AgentUpdateConfig(
    name="Updated Agent Name",
    goal=["New goal for the agent"]
)

client.update_agent(agent_id=agent_id, agent_update_config=updated_config)
```

### **Pausing and Resuming Agents**

You can pause or resume specific agent runs as needed:

```python
# Pausing an agent run
client.pause_agent(agent_id=agent_id, agent_run_ids=[run_id])

# Resuming an agent run
client.resume_agent(agent_id=agent_id, agent_run_ids=[run_id])
```

## **Adding Custom Tools to SuperAGI**

If you want to extend SuperAGI by adding custom tools that your agents can use, follow these steps:

1. **Set Up Your GitHub Repository**:
   Create a GitHub repository for your custom tool. The repository should have files like `__init__.py`, `tool1.py`, `toolname_toolkit.py`, and `requirements.txt`.

2. **Install Necessary APIs and Classes**:
   Install the required dependencies for integrating your tool with SuperAGI:
   ```bash
   pip install superagi-tools
   ```

3. **Link Your Repository to SuperAGI**:
   After setting up your repository, link it to SuperAGI by adding it through the frontend or by editing `superagi/tools/tools.json` with your repository details.

4. **Rebuild SuperAGI**:
   Restart Docker to rebuild SuperAGI with your custom tool:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

Now your custom tool should be available for use by your agents.

## **Using Templates: Example of Coding + GitHub Push Agent**

SuperAGI also offers templates that simplify common tasks such as generating codebases and pushing them to GitHub. Here’s how you can set up a “Coding + GitHub Push” agent:

1. Go to `localhost:3000` (or your hosted SuperAGI instance).
2. Navigate to the Marketplace and select the “Coding + GitHub Push” template.
3. Configure the template with your desired options, including linking it to your GitHub repository.
4. Start the agent, which will generate code based on your goals and push it to GitHub.

This template is ideal if you're looking for a quick way to automate coding tasks integrated with version control.

---

By following these steps, you can start building simple agents in SuperAGI and gradually extend their capabilities through custom tools or advanced configurations like scheduling and iteration control.

### Sources

- [Adding your own custom tool/toolkit to SuperAGI](https://superagi.com/adding-your-own-custom-tool-toolkit-to-superagi/)
- [Building Agentic Application with SuperAGI Python Client Library](https://superagi.com/building-agentic-application-with-superagi-python-client-library/)
- [Python SDK | SuperAGI Docs](https://superagi.com/docs/SDK/python_sdk/)
- [SuperAGI tutorial: Generate a Codebase and Push it to GitHub](https://lablab.ai/t/superagi-tutorial-generate-a-codebase-and-push-it-to-github)
