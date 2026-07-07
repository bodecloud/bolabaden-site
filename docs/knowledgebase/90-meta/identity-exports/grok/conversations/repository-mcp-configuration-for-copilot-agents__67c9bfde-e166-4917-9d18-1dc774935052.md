---
source_url: "https://grok.com/c/67c9bfde-e166-4917-9d18-1dc774935052"
conversation_id: "67c9bfde-e166-4917-9d18-1dc774935052"
title: "Repository MCP Configuration for Copilot Agents"
extracted_at: "2026-06-29T16:32:39.775Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Repository MCP Configuration for Copilot Agents

Source: [Grok conversation](https://grok.com/c/67c9bfde-e166-4917-9d18-1dc774935052)

## User

_Time: 2026-01-30T07:27:19.873Z_

how to configure mcp servers for copilot to use? i am NOT talking about vs code, do not mention codespaces/vscode under **ANY** circumstances. Task is to tell me **where** in specifically https://github.com/settings/profile where to find the area that lets me define mcp servers as json. Used to be in here somewhere but they seem to move it.
 
Again you must be highly exclusive and specific to my prompt. Search diversely and creatively. Assume it may have been migrated or something if you're struggling, otherwise answer the question.
 
Do not provide information that says 'this doesnt exist' or isn't 100% accurate/specific to my prompt. If you're struggling to validate/verify your claims through web research obviously your research isn't thorough enough: systematically iteratively and repeatedly web search different queries until you do. Do not stop for any reason until you've found the **correct** information on the web.

## Assistant

_Time: 2026-01-30T07:27:39.309Z_



## User

_Time: 2026-01-30T07:28:01.811Z_

how to configure mcp servers for copilot to use? i am NOT talking about vs code, do not mention codespaces/vscode under **ANY** circumstances. Task is to tell me **where** in specifically https://github.com/settings/profile where to find the area that lets me define mcp servers as json. Used to be in here somewhere but they seem to move it.
 
Again you must be highly exclusive and specific to my prompt. Search diversely and creatively. Assume it may have been migrated or something if you're struggling, otherwise answer the question.
 
Do not provide information that says 'this doesnt exist' or isn't 100% accurate/specific to my prompt. If you're struggling to validate/verify your claims through web research obviously your research isn't thorough enough: systematically iteratively and repeatedly web search different queries until you do. Do not stop for any reason until you've found the **correct** information on the web.

mcp is OBVIOUSLY model context protocol. I'm asking how to define tools in github copilot, for agents to use on github.com specifically.

## Assistant

_Time: 2026-01-30T07:28:40.247Z_



## User

_Time: 2026-01-30T07:28:46.371Z_

how to configure mcp servers for copilot to use? i am NOT talking about vs code, do not mention codespaces/vscode under **ANY** circumstances. Task is to tell me **where** in specifically https://github.com/settings where to find the area that lets me define mcp servers as json. Used to be in here somewhere but they seem to move it.
 
Again you must be highly exclusive and specific to my prompt. Search diversely and creatively. Assume it may have been migrated or something if you're struggling, otherwise answer the question.
 
Do not provide information that says 'this doesnt exist' or isn't 100% accurate/specific to my prompt. If you're struggling to validate/verify your claims through web research obviously your research isn't thorough enough: systematically iteratively and repeatedly web search different queries until you do. Do not stop for any reason until you've found the **correct** information on the web.

mcp is OBVIOUSLY model context protocol. I'm asking how to define tools in github copilot, for agents to use on github.com specifically.

## Assistant

_Time: 2026-01-30T07:30:10.269Z_

**Key Points**  
- The option to define custom MCP servers as JSON for GitHub Copilot agents has moved from personal settings to repository-specific settings.  
- It is now configured per repository for the Copilot coding agent, allowing tools to be available when agents operate within that repo on github.com.  
- Access it via each repository's settings page, under Copilot > Coding agent > MCP Configuration.  
- Default tools (like the GitHub MCP server) remain automatically available on github.com without custom configuration.

**Accessing the Configuration**  
To define MCP servers as JSON:  
1. Navigate to your repository on github.com.  
2. Click **Settings** at the top (select from the dropdown if not visible).  
3. In the left sidebar, go to **Code & automation** > **Copilot** > **Coding agent**.  
4. Locate the **MCP Configuration** section.  
5. Enter or edit the JSON object defining your `mcpServers`.  
6. Click **Save** (validation runs automatically).  

This setup enables custom tools for Copilot agents working on tasks in that repository.

**Example JSON Structure**  
Paste a configuration like this into the MCP Configuration field:  

```json  
{  
  "mcpServers": {  
    "yourServerName": {  
      "type": "local",  // or "http" or "sse" for remote  
      "command": "npx",  
      "args": ["your-mcp-package@latest"],  
      "tools": ["specific_tool_name", "*"],  // "*" for all tools  
      "env": {  
        "OPTIONAL_VAR": "value"  
      }  
    }  
  }  
}  
```  

For remote servers, use `"url": "https://your-mcp-endpoint"` instead of command/args.

---

**Detailed Overview of MCP Configuration for GitHub Copilot Agents**  

GitHub Copilot's Model Context Protocol (MCP) integration allows agents—particularly the Copilot coding agent—to access custom tools on github.com. This enhances agent capabilities for repository-specific tasks, such as reading issues, managing PRs, or integrating external services via defined tools.  

The configuration is repository-scoped, meaning tools apply only within the repo where defined. This shift provides granular control, especially useful for teams or projects needing specific integrations without affecting all repositories. Default MCP servers (GitHub for repo data and Playwright for local web access) are pre-configured and available automatically on github.com.  

**Why the Location Changed**  
Earlier versions or previews may have placed similar options in broader locations, but current implementation focuses on per-repository configuration for security, scope, and performance. This aligns with agent usage primarily occurring in repository contexts (e.g., issues, PRs, or assigned tasks).  

**Step-by-Step Navigation in Repository Settings**  
- Start at the repository's main page (e.g., github.com/username/repo).  
- Select the **Settings** tab.  
- Scroll to the **Code & automation** section in the sidebar.  
- Click **Copilot**, then **Coding agent**.  
- Find the dedicated **MCP Configuration** area, which accepts JSON input directly.  
- After saving, the defined servers become available to Copilot agents in that repo.  

**JSON Configuration Details**  

The JSON follows a strict format with an `mcpServers` root object. Each server entry includes:  

| Key          | Required | Description                                                                 | Example/Options                          |
|--------------|----------|-----------------------------------------------------------------------------|------------------------------------------|
| `type`       | Yes      | Server connection type                                                      | `"local"`, `"http"`, or `"sse"`          |
| `tools`      | Yes      | Tools to enable (use `*` for all)                                           | `["tool_name"]` or `["*"]`               |
| `command`    | For local| Command to start the server                                                 | `"npx"`                                  |
| `args`       | For local| Arguments for the command                                                   | `["-y", "@package/mcp@latest"]`          |
| `env`        | Optional | Environment variables (can reference secrets)                               | `{"KEY": "value"}`                       |
| `url`        | For remote| Endpoint URL for HTTP/SSE servers                                           | `"https://example.com/mcp"`              |
| `headers`    | Optional (remote)| Custom headers (can reference secrets)                                      | `{"Authorization": "Bearer token"}`      |

Secrets can be referenced with prefixes like `COPILOT_MCP_` for secure handling. Validation ensures correct syntax before saving.  

**Scope and Availability**  
- **Repository-only**: Tools are isolated to the configured repo.  
- **Agent usage**: Available when Copilot coding agent is invoked on tasks within the repository on github.com.  
- **Defaults**: GitHub MCP (read-only repo access) and others are always on—no JSON needed for basics.  
- **No global personal option**: Custom definitions are not supported in https://github.com/settings; focus is per-repository for targeted tool access.  

This setup ensures agents on github.com can leverage powerful custom tools securely and efficiently within project boundaries. For enterprise or organization-level controls (e.g., allowlists), additional policies may apply via admin settings.  

**Key Citations**  
- [Extending GitHub Copilot coding agent with the Model Context Protocol (MCP)](https://docs.github.com/en/copilot/how-tos/agents/copilot-coding-agent/extending-copilot-coding-agent-with-mcp)  
- [Model Context Protocol (MCP) and GitHub Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/mcp-and-coding-agent)  
- [Connect GitHub Copilot coding agent to the Azure MCP Server](https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/how-to/github-copilot-coding-agent)
