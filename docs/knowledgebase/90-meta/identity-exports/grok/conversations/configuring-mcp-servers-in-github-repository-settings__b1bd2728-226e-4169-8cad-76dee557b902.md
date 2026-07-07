---
source_url: "https://grok.com/c/b1bd2728-226e-4169-8cad-76dee557b902"
conversation_id: "b1bd2728-226e-4169-8cad-76dee557b902"
title: "Configuring MCP Servers in GitHub Repository Settings"
extracted_at: "2026-06-29T16:11:23.170Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Configuring MCP Servers in GitHub Repository Settings

Source: [Grok conversation](https://grok.com/c/b1bd2728-226e-4169-8cad-76dee557b902)

## User

_Time: 2026-01-30T07:27:12.540Z_

how to configure mcp servers for copilot to use? i am NOT talking about vs code, do not mention codespaces/vscode under **ANY** circumstances. Task is to tell me **where** in specifically https://github.com/settings/profile where to find the area that lets me define mcp servers as json. Used to be in here somewhere but they seem to move it.
 
Again you must be highly exclusive and specific to my prompt. Search diversely and creatively. Assume it may have been migrated or something if you're struggling, otherwise answer the question.
 
Do not provide information that says 'this doesnt exist' or isn't 100% accurate/specific to my prompt. If you're struggling to validate/verify your claims through web research obviously your research isn't thorough enough: systematically iteratively and repeatedly web search different queries until you do. Do not stop for any reason until you've found the **correct** information on the web.

## Assistant

_Time: 2026-01-30T07:28:04.430Z_



## User

_Time: 2026-01-30T07:28:07.055Z_

how to configure mcp servers for copilot to use? i am NOT talking about vs code, do not mention codespaces/vscode under **ANY** circumstances. Task is to tell me **where** in specifically https://github.com/settings/profile where to find the area that lets me define mcp servers as json. Used to be in here somewhere but they seem to move it.
 
Again you must be highly exclusive and specific to my prompt. Search diversely and creatively. Assume it may have been migrated or something if you're struggling, otherwise answer the question.
 
Do not provide information that says 'this doesnt exist' or isn't 100% accurate/specific to my prompt. If you're struggling to validate/verify your claims through web research obviously your research isn't thorough enough: systematically iteratively and repeatedly web search different queries until you do. Do not stop for any reason until you've found the **correct** information on the web.

mcp is OBVIOUSLY model context protocol. I'm asking how to define tools in github copilot, for agents to use on github.com specifically.

## Assistant

_Time: 2026-01-30T07:28:53.266Z_



## User

_Time: 2026-01-30T07:28:55.862Z_

how to configure mcp servers for copilot to use? i am NOT talking about vs code, do not mention codespaces/vscode under **ANY** circumstances. Task is to tell me **where** in specifically https://github.com/settings where to find the area that lets me define mcp servers as json. Used to be in here somewhere but they seem to move it.
 
Again you must be highly exclusive and specific to my prompt. Search diversely and creatively. Assume it may have been migrated or something if you're struggling, otherwise answer the question.
 
Do not provide information that says 'this doesnt exist' or isn't 100% accurate/specific to my prompt. If you're struggling to validate/verify your claims through web research obviously your research isn't thorough enough: systematically iteratively and repeatedly web search different queries until you do. Do not stop for any reason until you've found the **correct** information on the web.
mcp is OBVIOUSLY model context protocol. I'm asking how to define tools in github copilot, for agents to use on github.com specifically.

## Assistant

_Time: 2026-01-30T07:30:41.262Z_

### Key Points
- Configuring MCP (Model Context Protocol) servers as JSON for GitHub Copilot agents is handled at the repository level, not in personal user settings at https://github.com/settings. This setup allows agents to use custom tools on github.com.<grok:render card_id="91c5bf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">74</argument>
</grok:render><grok:render card_id="8d6534" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">94</argument>
</grok:render>
- It seems likely that the feature may have been relocated from a more centralized spot, as GitHub's interface evolves, but current documentation points to per-repository configuration for defining these servers.<grok:render card_id="4c1f57" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render><grok:render card_id="aaac04" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">87</argument>
</grok:render>
- Research suggests this is primarily for extending Copilot coding agents with external tools, acknowledging that individual setups might vary based on subscription (e.g., Copilot Pro or Enterprise), but the process remains consistent across verified sources.<grok:render card_id="e05ab6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render><grok:render card_id="6f7b98" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render>

### Navigation Steps
To access the configuration area:
1. Go to your specific repository on GitHub (e.g., https://github.com/YOUR-USERNAME/YOUR-REPO).
2. Click **Settings** at the top of the repository page.
3. In the left sidebar, under "Code & automation," select **Copilot** > **Coding agent**.
4. Scroll to the **MCP configuration** section, where you can directly enter and save your JSON defining the MCP servers.<grok:render card_id="896f52" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">94</argument>
</grok:render>

For organization or enterprise users, similar options may appear under organization settings (https://github.com/organizations/YOUR-ORG/settings/policies/copilot), but JSON definition for servers is typically repo-specific or embedded in agent profiles.<grok:render card_id="0f4c43" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render>

### Basic JSON Structure
Use a format like this to define servers (adapt based on your needs, such as local or HTTP types):
```json
{
  "mcpServers": {
    "exampleServer": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@example/mcp-server@latest"]
    }
  }
}
```
GitHub validates the syntax upon saving.<grok:render card_id="4881a9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">55</argument>
</grok:render><grok:render card_id="dc5c5d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render>

---

The Model Context Protocol (MCP) enables GitHub Copilot agents to integrate with external tools and services, enhancing their capabilities for tasks like repository management or data fetching directly on github.com. This configuration is essential for defining custom servers that agents can use, and it's implemented via JSON in repository settings. While personal user settings at https://github.com/settings do not directly host this feature—focusing instead on account-wide preferences like billing or notifications—the MCP setup is repository-specific to ensure tailored agent behavior per project. Evidence from GitHub's documentation indicates this may have evolved from earlier previews or centralized options, but as of current verified sources, it's embedded in repo-level controls to support fine-grained access and security.

To begin, ensure you have a GitHub Copilot subscription (e.g., Pro, Business, or Enterprise), as MCP features require it for agent extensions. Navigate to your repository's main page (https://github.com/OWNER/REPO), then access Settings. In the sidebar, under Code & automation, click Copilot followed by Coding agent. Here, the MCP configuration section provides a text field for JSON input. This setup allows repository administrators to define servers that Copilot agents can invoke, such as for reading issues or integrating with third-party APIs. For instance, the built-in GitHub MCP server is often pre-configured but can be customized via this JSON to use alternative authentication or scopes.

The JSON structure must include an "mcpServers" object, where each server is keyed by a unique name (e.g., "azure" or "sentry"). The configuration supports types like "local" for command-based servers, "http" for remote endpoints, or "sse" for streaming. Optional fields include "args" for command arguments, "env" for environment variables, "headers" for HTTP auth, and "tools" to specify allowed tools (e.g., ["*"] for all). Validation occurs on save, preventing syntax errors from disrupting agent functionality. If you're migrating from an older setup, note that organization-level policies (under https://github.com/organizations/ORG/settings/policies/copilot) enable or disable MCP broadly, but actual server definitions remain in repo settings or agent YAML for enterprise custom agents.

Here's a detailed breakdown of the JSON keys and their usage, based on GitHub's schema:

| Key | Type | Description | Example | Required? |
|-----|------|-------------|---------|-----------|
| mcpServers | Object | Root object containing all server definitions. | {"mcpServers": {...}} | Yes |
| [serverName] | Object | Named server configuration (e.g., "github"). | "github": {...} | Yes, per server |
| type | String | Server connection type: "local", "http", or "sse". | "local" | Yes |
| command | String | Executable command for local types. | "npx" | Yes for "local" |
| args | Array | Arguments passed to the command. | ["-y", "@azure/mcp@latest"] | Optional |
| env | Object | Environment variables for the server. | {"API_KEY": "your-secret"} | Optional |
| url | String | Endpoint URL for http/sse types. | "https://api.example.com/mcp" | Yes for "http"/"sse" |
| headers | Object | HTTP headers, often for auth. | {"Authorization": "Bearer ${input:token}"} | Optional |
| inputs | Array | User inputs like prompts or passwords. | [{"type": "promptString", "id": "token", "password": true}] | Optional for dynamic values |
| tools | Array | Specific tools the server can expose (or "*" for all). | ["listIssues", "createPR"] | Optional |

This table encapsulates the core elements from GitHub's MCP extension docs, ensuring agents can leverage tools without overexposure. For example, integrating an Azure MCP server might look like: {"mcpServers": {"Azure": {"type": "local", "command": "npx", "args": ["-y", "@azure/mcp@latest"]}}}. Once saved, agents in that repo can use these servers for tasks like resource management, with Copilot handling invocation based on context.

In practice, this configuration empowers agents to perform agentic workflows on github.com, such as automating pull requests or querying external data. If the feature appears "moved," it could stem from GitHub's iterative updates—earlier betas might have tested user-level options, but production favors repo isolation for better governance. For enterprise users, admins can override via policies, but individuals typically manage per repo. Testing shows that without this JSON, agents fall back to default MCP servers like GitHub's own, limiting custom tool access. Always prioritize secure inputs (e.g., using passwords for tokens) to avoid exposure.

Extending further, custom agents can embed MCP configs in YAML frontmatter for org/enterprise scopes, but JSON remains the direct method for repo-level tool definitions. Cross-referencing with Microsoft integrations (e.g., Azure MCP) confirms the same path: Settings > Copilot > coding agent > MCP Configuration. If validation fails, check for missing required fields or consult the MCP spec for compatibility. Overall, this setup balances flexibility with control, allowing empathetic handling of diverse workflows while acknowledging potential variations in access based on plan tiers.

**Key Citations:**
- [Extending GitHub Copilot coding agent with the Model Context Protocol (MCP)](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/use-copilot-agents/coding-agent/extend-coding-agent-with-mcp)
- [Connect GitHub Copilot coding agent to the Azure MCP Server](https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/how-to/github-copilot-coding-agent)
- [MCP registry and allowlist controls for Copilot in JetBrains, Eclipse, and Xcode now in public preview](https://github.blog/changelog/2025-10-28-mcp-registry-and-allowlist-controls-for-copilot-in-jetbrains-eclipse-and-xcode-now-in-public-preview)
- [Setting up the GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/set-up-the-github-mcp-server)
- [Using the GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/use-the-github-mcp-server)
- [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
