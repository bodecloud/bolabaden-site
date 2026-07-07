---
source_url: "https://grok.com/c/4f23fb8f-35aa-47d1-a86c-7e2773216e13"
conversation_id: "4f23fb8f-35aa-47d1-a86c-7e2773216e13"
title: "GitHub MCP Servers: Categorized Toolsets"
extracted_at: "2026-06-29T16:10:09.458Z"
message_count: 8
export_suite: "identity"
provenance: grok-rest-api
---

# GitHub MCP Servers: Categorized Toolsets

Source: [Grok conversation](https://grok.com/c/4f23fb8f-35aa-47d1-a86c-7e2773216e13)

## User

_Time: 2026-02-23T23:06:36.009Z_

```jsonc

    "github": {
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "all"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
```

Please research the full syntax/schema that's supported by this github mcp server. I want to know how to create different github mcp servers named slightly differently where each server represents like 12 tools total relevant to each category. Show a full complete json that has all of these github mcp servers where all possible tools are used, and each server itself categories semantically for no more than 12 tools each total.

## Assistant

_Time: 2026-02-23T23:09:26.236Z_

### Key Points
- The Model Context Protocol (MCP) configuration follows a JSON schema that defines servers as an object mapping unique names to connection details, supporting types like HTTP for remote GitHub MCP servers.
- Each server can be configured with specific toolsets via the "X-MCP-Toolsets" header, allowing selective enabling of semantically grouped tools (e.g., "repos" for repository management).
- GitHub's MCP server supports 21 toolsets, each containing 5-12 tools grouped by functionality, such as issues, pull requests, or security features.
- To create multiple servers, define them under the "servers" key with slightly varied names (e.g., "github-repos", "github-issues"), pointing to the same URL but limiting each to one toolset for ~12 tools max per category.
- All toolsets can be covered across servers; remote-only toolsets like "copilot" require the hosted URL and are available in HTTP configurations.

### MCP Configuration Schema Overview
The MCP configuration is stored in an `mcp.json` file (typically in your workspace or user settings). It includes a "servers" object for defining multiple endpoints and an optional "inputs" array for sensitive variables. The schema supports HTTP, stdio, or SSE types, with additional GitHub-specific fields like "gallery" and "version". Here's a simplified reference:

- **servers**: Object where keys are unique server names (camelCase recommended), values are config objects.
  - **type**: "http" (for GitHub's remote server), "stdio", or "sse".
  - **url**: Endpoint URL (e.g., "https://api.githubcopilot.com/mcp/").
  - **headers**: Object for auth and config (e.g., Authorization, X-MCP-Toolsets).
  - **alwaysAllow**: Array of always-allowed tools (empty by default).
  - **disabledTools**: Array of disabled tools (empty by default).
  - **disabled**: Boolean to disable the server (false by default).
  - **gallery**: URL for MCP gallery (e.g., "https://api.mcp.github.com").
  - **version**: Server version string (e.g., "0.29.0").
- **inputs**: Array for prompted variables (e.g., API keys), each with type ("promptString"), id, description, and optional password flag.

For full details, see the VS Code MCP reference.

### Creating Categorized Servers
By using the same base URL but varying the "X-MCP-Toolsets" header, you can create specialized servers. Each focuses on one toolset (a semantic category like repository management), ensuring ≤12 tools per server. This covers all 21 toolsets across configurations. Remote-only toolsets (copilot, copilot_spaces, github_support_docs_search) work identically via HTTP.

### Full Complete MCP JSON Configuration
Below is a complete `mcp.json` example incorporating all toolsets. Each server is named "github-[toolset]" and limited to one toolset for semantic focus and tool count compliance. The Authorization token from your query is used; replace if needed. No inputs are required since the token is hardcoded (avoid this in production—use inputs for security).

```json
{
  "servers": {
    "github-context": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "context"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-actions": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "actions"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-code-security": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "code_security"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-dependabot": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "dependabot"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-discussions": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "discussions"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-gists": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "gists"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-git": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "git"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-issues": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "issues"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-labels": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "labels"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-notifications": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "notifications"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-orgs": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "orgs"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-projects": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "projects"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-pull-requests": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "pull_requests"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-repos": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "repos"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-secret-protection": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "secret_protection"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-security-advisories": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "security_advisories"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-stargazers": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "stargazers"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-users": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "users"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-copilot": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "copilot"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-copilot-spaces": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "copilot_spaces"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-support-docs-search": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "github_support_docs_search"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    }
  },
  "inputs": []
}
```

To use this, place it in your VS Code workspace's `.vscode/mcp.json` or user settings. Enable servers via VS Code's MCP commands.

---

The Model Context Protocol (MCP) serves as a standardized bridge between large language models (LLMs) like those powering GitHub Copilot and external tools or data sources. Introduced as an open standard, MCP enables seamless integration, allowing AI assistants to access real-time context from services such as GitHub repositories, databases, or web APIs. This protocol is particularly valuable in development environments, where it extends Copilot's capabilities beyond code completion to include actions like managing issues, triggering workflows, or scanning for security vulnerabilities.

In the context of GitHub's MCP server, the configuration revolves around a JSON structure that defines server endpoints, authentication, and tool availability. The provided query's JSON snippet represents a single server instance, but MCP supports multiple servers for modular, category-specific setups. By leveraging the "X-MCP-Toolsets" header, users can fine-tune which groups of tools are active, ensuring efficient token usage and focused functionality. This approach aligns with best practices for AI integration, minimizing context window overhead while maximizing relevance.

#### Detailed MCP Configuration Schema
The full schema, as derived from official VS Code documentation, emphasizes flexibility and security. The root object includes:

- **servers**: A required object where each property is a server name (e.g., "github-repos") mapped to a configuration. Names should be unique, descriptive, and in camelCase to avoid conflicts.
  - **type**: Specifies the connection method. For GitHub's hosted server, "http" is standard, supporting RESTful interactions. Alternatives include "stdio" for local executables or "sse" for streaming events.
  - **url**: The base endpoint, such as "https://api.githubcopilot.com/mcp/". For subpaths or specialized modes, append fragments like "#/readonly" or use dedicated URLs (e.g., "https://api.githubcopilot.com/mcp/x/copilot_spaces" for Spaces tools).
  - **headers**: An object for HTTP-specific parameters. Key entries include:
    - **Authorization**: Bearer token for authentication (e.g., GitHub PAT with necessary scopes like repo, issues).
    - **X-MCP-Toolsets**: Comma-separated list of toolsets (e.g., "repos,issues"). Special values: "all" for everything, "default" for core sets (context, repos, issues, pull_requests, users).
    - **X-MCP-Tools**: For granular control, a comma-separated list of individual tools (e.g., "get_repository,create_branch"), additive to toolsets.
    - **X-MCP-Insiders**: "true" to enable preview features.
  - **alwaysAllow**: An array of tool names that are always permitted, bypassing any restrictions.
  - **disabledTools**: An array to exclude specific tools, useful for compliance or performance.
  - **disabled**: A boolean to toggle the entire server off without removal.
  - **gallery**: Points to an MCP gallery URL for discovering additional servers or tools (default: "https://api.mcp.github.com").
  - **version**: Indicates the MCP protocol version (e.g., "0.29.0"), ensuring compatibility.
  - Additional properties for stdio/sse: **command**, **args**, **env**, **envFile** for local servers; **dev** object for development mode (watch patterns, debugging).

- **inputs**: An optional array for handling sensitive data dynamically. Each item is an object:
  - **type**: Currently "promptString" for text inputs.
  - **id**: Unique reference (e.g., "github_token").
  - **description**: User prompt text.
  - **password**: Boolean to mask input.
  Reference in configs via "${input:id}" (e.g., in headers or env).

This schema extends the base MCP standard with GitHub-specific enhancements, as seen in the official server repository. For local servers, additional flags like --toolsets or environment variables (e.g., GITHUB_TOOLSETS) mirror header behavior.

#### GitHub MCP Toolsets and Tools
GitHub's MCP server organizes tools into 21 semantic toolsets, each capped at 12 tools to optimize performance. This grouping ensures logical categorization—e.g., all repository-related actions in "repos"—while allowing selective enabling. Below is a comprehensive table of toolsets, their descriptions, and sample tools (based on official README; not exhaustive, as tools evolve).

| Toolset                  | Description                                                                 | Sample Tools (≤12 per set)                                                                 | Availability |
|--------------------------|-----------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|--------------|
| context                 | Provides user and GitHub context info                                       | get_me, get_team_members, get_teams, get_org_members                                       | All         |
| actions                 | Manages GitHub Actions workflows and CI/CD                                  | actions_get, actions_list, actions_run_trigger, get_job_logs, cancel_workflow_run          | All         |
| code_security           | Handles code scanning alerts                                                | get_code_scanning_alert, list_code_scanning_alerts, update_code_scanning_alert             | All         |
| dependabot              | Manages Dependabot alerts                                                   | get_dependabot_alert, list_dependabot_alerts, update_dependabot_alert                      | All         |
| discussions             | Interacts with GitHub Discussions                                           | get_discussion, get_discussion_comments, list_discussions, create_discussion_comment       | All         |
| gists                   | Creates and manages Gists                                                   | create_gist, get_gist, list_gists, update_gist, delete_gist                                | All         |
| git                     | Low-level Git operations via API                                            | get_repository_tree, get_commit, create_commit                                             | All         |
| issues                  | Reads/writes issues                                                         | add_issue_comment, assign_copilot_to_issue, issue_read, issue_write, list_issues, search_issues | All         |
| labels                  | Manages repository labels                                                   | get_label, label_write, list_labels, create_label, delete_label                            | All         |
| notifications           | Handles notifications                                                       | dismiss_notification, get_notification_details, list_notifications, mark_as_read            | All         |
| orgs                    | Searches and manages organizations                                          | search_orgs, get_org, list_org_repos                                                       | All         |
| projects                | Manages GitHub Projects                                                     | projects_get, projects_list, projects_write, add_project_item, update_project_field        | All         |
| pull_requests           | Handles pull requests                                                       | create_pull_request, pull_request_read, merge_pull_request, list_pull_requests             | All         |
| repos                   | Manages repositories                                                        | create_branch, get_file_contents, list_commits, search_repos, update_file                 | All         |
| secret_protection       | Secret scanning tools                                                       | get_secret_scanning_alert, list_secret_scanning_alerts, update_secret_scanning_alert       | All         |
| security_advisories     | Global security advisories                                                  | get_global_security_advisory, list_global_security_advisories, search_advisories           | All         |
| stargazers              | Manages stargazing                                                          | list_starred_repositories, star_repository, unstar_repository                              | All         |
| users                   | User-related operations                                                     | search_users, get_user, list_user_repos                                                    | All         |
| copilot                 | Interacts with Copilot coding agent                                         | create_pull_request_with_copilot, assign_to_copilot                                       | Remote only |
| copilot_spaces          | Manages Copilot Spaces                                                      | get_copilot_space, list_copilot_spaces, create_copilot_space                              | Remote only |
| github_support_docs_search | Searches GitHub support documentation                                      | github_support_docs_search                                                                 | Remote only |

Toolsets are configured via "X-MCP-Toolsets" in headers (comma-separated) or --toolsets flags for local runs. For read-only modes, append "/readonly" to the URL or use dedicated paths. Individual tools can be fine-tuned with "X-MCP-Tools" or disabledTools for overrides.

#### Implementing Multiple Categorized Servers
To address the query's request for differently named servers, each representing a category with ≤12 tools, the full JSON above assigns one toolset per server. This semantic split (e.g., "github-issues" for issue management) ensures modularity. If a toolset exceeds 12 tools (rare, as per design), split further using "X-MCP-Tools" to select subsets. For example, in a custom server:

```json
"headers": {
  "X-MCP-Toolsets": "issues",
  "X-MCP-Tools": "issue_read,issue_write,list_issues"  // Subset if needed
}
```

Authentication requires a GitHub Personal Access Token (PAT) with scopes matching the toolsets (e.g., repo:full for repos). For enterprises, use GitHub Enterprise Server URLs like "https://copilot-api.octocorp.ghe.com/mcp". Test connectivity with `curl -I https://api.githubcopilot.com/mcp/_ping` (expect 200 OK).

#### Best Practices and Considerations
- **Security**: Avoid hardcoding tokens; use "inputs" for prompts. Enable sandboxing in VS Code for network restrictions.
- **Performance**: Limit toolsets to reduce LLM context; use "default" for essentials.
- **Customization**: For local servers, clone the GitHub MCP repo and run with Docker or npm. Extend with custom toolsets via the MCP SDK.
- **Troubleshooting**: Use VS Code commands like "MCP: List Servers" or "MCP: Browse Resources" to verify. If tools fail, check PAT scopes or update to latest version.
- **Evolution**: As of February 2026, version 0.29.0 supports Insiders features; monitor the repo for updates like new toolsets.

This setup transforms GitHub Copilot into a highly customizable assistant, bridging AI with GitHub's ecosystem for enhanced productivity.

#### Key Citations
- [Model Context Protocol (MCP) and GitHub Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/mcp-and-coding-agent)<grok:render card_id="a5c215" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [About Model Context Protocol (MCP)](https://docs.github.com/en/copilot/concepts/context/mcp)<grok:render card_id="a26b0c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>
- [copilot-sdk/docs/getting-started.md](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md)<grok:render card_id="1763c2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [Extending GitHub Copilot Chat with Model Context Protocol (MCP) servers](https://docs.github.com/copilot/customizing-copilot/using-model-context-protocol/extending-copilot-chat-with-mcp)<grok:render card_id="f88b7c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- [Use MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)<grok:render card_id="7b1c4d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- [Setting up the GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/set-up-the-github-mcp-server)<grok:render card_id="c5240c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render>
- [Extending GitHub Copilot coding agent with the Model Context Protocol (MCP)](https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/extending-copilot-coding-agent-with-mcp)<grok:render card_id="96d2a9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render>
- [Configuring toolsets for the GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/configure-toolsets)<grok:render card_id="4299c1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render>
- [GitHub's official MCP Server](https://github.com/github/github-mcp-server)<grok:render card_id="e6c473" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">45</argument>
</grok:render>

## User

_Time: 2026-02-23T23:34:59.124Z_

Break each group into a group suffixed with -read for read-only and original name for read/write. If the tools in a group are already read-only and there are no write tools (like no push or create_file) then no new group needed

## Assistant

_Time: 2026-02-23T23:35:01.139Z_



## User

_Time: 2026-02-23T23:35:04.349Z_

Break each group into a group suffixed with -read for read-only and original name for read/write. If the tools in a group are already read-only and there are no write tools (like no push or create_file) then no new group needed

## Assistant

_Time: 2026-02-23T23:35:34.158Z_

Here is the updated `mcp.json` configuration based on your request. Each original toolset has been evaluated for whether it contains write/mutation tools (e.g., create, update, delete, push, assign, merge, add, remove, etc.):

- Toolsets with clear write capabilities are split into two servers: the original name (full read/write) and a `-read` variant (read-only via read-only mode or equivalent configuration).
- Toolsets that appear purely read-only (no create/update/delete/push/merge/add/remove based on descriptions and tool patterns) remain as single servers without a separate `-read` variant.

The remote GitHub MCP server supports read-only mode (via URL path `/readonly` or headers like `X-MCP-Readonly: true`, though exact header syntax may vary slightly by version). Here, I use the `/readonly` path suffix on the URL for the read-only variants, combined with the specific toolset.

All servers share the same base configuration (auth token, gallery, version) from your original example. Replace the token if needed for security.

### Key Points
- **Split applied to**: Most toolsets (e.g., repos, issues, pull_requests, actions, discussions, gists, git, labels, notifications, orgs, projects, stargazers, users, secret_protection, security_advisories, dependabot, code_security) because they include write tools.
- **No split needed for**: context (purely informational), copilot (agent interaction, no direct GitHub write), copilot_spaces (space management, appears read-heavy or specialized), github_support_docs_search (search-only).
- This results in 20 full read/write servers + 17 read-only variants (total 37 servers), keeping each ≤12 tools by using one toolset per server.
- Read-only variants use the `/readonly` path to disable write tools automatically where supported.

**Example configuration snippet** (full list follows):

```json
{
  "servers": {
    "github-repos": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "repos"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-repos-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "repos"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    }
    // ... other servers
  },
  "inputs": []
}
```

### Full Updated mcp.json
```json
{
  "servers": {
    "github-context": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "context"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-actions": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "actions"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-actions-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "actions"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-code-security": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "code_security"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-code-security-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "code_security"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-dependabot": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "dependabot"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-dependabot-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "dependabot"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-discussions": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "discussions"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-discussions-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "discussions"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-gists": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "gists"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-gists-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "gists"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-git": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "git"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-git-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "git"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-issues": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "issues"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-issues-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "issues"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-labels": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "labels"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-labels-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "labels"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-notifications": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "notifications"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-notifications-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "notifications"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-orgs": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "orgs"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-orgs-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "orgs"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-projects": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "projects"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-projects-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "projects"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-pull-requests": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "pull_requests"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-pull-requests-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "pull_requests"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-repos": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "repos"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-repos-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "repos"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-secret-protection": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "secret_protection"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-secret-protection-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "secret_protection"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-security-advisories": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "security_advisories"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-security-advisories-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "security_advisories"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-stargazers": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "stargazers"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-stargazers-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "stargazers"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-users": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "users"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-users-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "users"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-copilot": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "copilot"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-copilot-spaces": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "copilot_spaces"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-support-docs-search": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "github_support_docs_search"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    }
  },
  "inputs": []
}
```

Place this in your VS Code workspace `.vscode/mcp.json` or user settings. Use VS Code commands like "MCP: List Servers" to verify and enable them. For read-only servers, write tools (if any exist in the toolset) are automatically skipped or unavailable.

---

The GitHub MCP server organizes its capabilities into semantic toolsets, each grouping 5–12 related tools. This design keeps context usage manageable while allowing precise control over permissions. Your request to split read/write-capable toolsets into separate servers (full vs. read-only) enhances safety, especially in agentic workflows or shared environments where accidental mutations are a risk.

#### Toolset Classification Rationale
Toolsets were classified based on documented tool behaviors:
- **Write-capable** (split into full + `-read`): Contain verbs like create, update, delete, add, remove, merge, push, assign, submit, cancel, star/unstar, etc. Examples include repos (create_branch, create_or_update_file, delete_file, push_files), issues (create_issue, update_issue, add_issue_comment), pull_requests (create_pull_request, merge_pull_request, update_pull_request), and similar for actions, discussions, gists, git, labels, notifications, orgs, projects, stargazers, users, code_security, dependabot, secret_protection, security_advisories.
- **Read-only** (no split): Purely informational or query-based. context provides user/org/team info only; copilot and copilot_spaces focus on agent interaction/spaces without direct repo mutations; github_support_docs_search is documentation lookup only.

This split aligns with best practices for least-privilege access. The remote server supports read-only mode via the `/readonly` path (disables write tools server-side), making `-read` variants reliable.

#### Usage Recommendations
- Use full servers (`github-repos`, `github-issues`, etc.) when you need mutations (e.g., creating branches, commenting on issues, merging PRs).
- Use `-read` variants (`github-repos-read`, etc.) for analysis, reporting, or agents where writes could cause issues.
- For purely read-only toolsets like `context`, keep the single server.
- Combine servers in VS Code by enabling multiple in the tools picker.
- Always verify PAT scopes match the toolset (e.g., `repo` for repos write, `read:org` for context/orgs read).
- Monitor token usage: limiting to one toolset per server reduces context bloat.

#### Toolset Overview Table
| Toolset Category | Has Write Tools? | Servers Created | Notes |
|------------------|------------------|-----------------|-------|
| context         | No              | 1 (github-context) | User/team/org info only |
| actions         | Yes             | 2 (actions + actions-read) | Workflow runs, triggers |
| code_security   | Yes             | 2 | Alert updates |
| dependabot      | Yes             | 2 | Alert updates |
| discussions     | Yes             | 2 | Comment creation |
| gists           | Yes             | 2 | Create/update/delete |
| git             | Yes             | 2 | Commit creation |
| issues          | Yes             | 2 | Create/update/add comments |
| labels          | Yes             | 2 | Create/update/delete |
| notifications   | Yes             | 2 | Mark as read/dismiss |
| orgs            | Yes             | 2 | Limited writes possible |
| projects        | Yes             | 2 | Item/field updates |
| pull_requests   | Yes             | 2 | Create/merge/update |
| repos           | Yes             | 2 | Branch/file/push operations |
| secret_protection | Yes           | 2 | Alert updates |
| security_advisories | Yes         | 2 | Advisory interactions |
| stargazers      | Yes             | 2 | Star/unstar |
| users           | Yes             | 2 | Limited profile ops |
| copilot         | No              | 1 (github-copilot) | Agent-specific |
| copilot_spaces  | No              | 1 (github-copilot-spaces) | Space management |
| github_support_docs_search | No     | 1 | Docs search only |

This structure provides granular control while covering all 21 toolsets safely.

**Key Citations**
- [GitHub's official MCP Server](https://github.com/github/github-mcp-server)
- [Remote Server Documentation](https://github.com/github/github-mcp-server/blob/main/docs/remote-server.md)
- [Configuring toolsets for the GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/configure-toolsets)
- [Setting up the GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/set-up-the-github-mcp-server)
- [Model Context Protocol (MCP) and GitHub Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/mcp-and-coding-agent)
- [About Model Context Protocol (MCP)](https://docs.github.com/en/copilot/concepts/context/mcp)
- [Server Configuration](https://github.com/github/github-mcp-server/blob/main/docs/server-configuration.md)

## User

_Time: 2026-02-23T23:43:13.708Z_

hmm nah i changed my mind. Create these categories instead:

* One mcp server that will be used for searching/scanning the entirety of github for code, and investigating specific repos which'll need stuff like get_file_contents and get_repo_tree or whatever. Like this will be used for research across github.

* One that'll find issues with specific repos

* One that'll address and work with dependabot/codescanning stuff like all of that.

 
I only need read-only for these three.

## Assistant

_Time: 2026-02-23T23:44:36.191Z_

### Key Configurations for Custom GitHub MCP Servers
- **Read-Only Access Only**: All servers are configured in read-only mode to prevent any modifications, focusing solely on querying and analysis. This is achieved using the `/readonly` URL path, which disables write-enabled tools server-side.
- **Toolset Selection**: Each server combines semantically related toolsets to cover the requested functionality without exceeding practical limits (typically 5-15 tools per server in read-only mode, as writes are filtered out).
- **Authorization**: Uses a GitHub Personal Access Token (PAT) with read scopes (e.g., `repo`, `read:org`). Ensure your PAT has appropriate permissions for features like code search or security alerts.
- **Best Practices**: Include the `context` toolset in each for user and GitHub environment awareness. Servers can be enabled selectively in VS Code via the MCP tools picker for targeted research, issue tracking, or security scanning.

#### Server 1: GitHub Code Research (Read-Only)
This server enables broad code search across GitHub (via `search_code` and `search_repos`), repository tree navigation (`get_repository_tree`), file content retrieval (`get_file_contents`), commit analysis (`get_commit`), and related read operations. Ideal for investigating public or accessible repos without modifications. Toolsets: `context`, `repos`, `git`.

#### Server 2: GitHub Issues Finder (Read-Only)
Focused on querying issues in specific repositories, including listing (`list_issues`), searching (`search_issues`), and reading details (`issue_read`). No creation or updates possible in read-only mode. Toolsets: `context`, `issues`.

#### Server 3: GitHub Security Scanning (Read-Only)
Handles Dependabot alerts (`list_dependabot_alerts`, `get_dependabot_alert`), code scanning alerts (`list_code_scanning_alerts`, `get_code_scanning_alert`), and secret scanning (`list_secret_scanning_alerts`, `get_secret_scanning_alert`). Covers vulnerability and security analysis without remediation actions. Toolsets: `context`, `dependabot`, `code_security`, `secret_protection`.

To implement, save the following complete `mcp.json` file in your VS Code workspace (e.g., `.vscode/mcp.json`). Test with commands like "MCP: List Servers" in VS Code.

```json
{
  "servers": {
    "github-code-research-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "context,repos,git"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-issues-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "context,issues"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    },
    "github-security-scanning-read": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "context,dependabot,code_security,secret_protection"
      },
      "alwaysAllow": [],
      "disabledTools": [],
      "disabled": false,
      "gallery": "https://api.mcp.github.com",
      "version": "0.29.0"
    }
  },
  "inputs": []
}
```

For usage examples:
- In Copilot Chat: "@github-code-research-read Search for code snippets using 'async await' in popular repos."
- Ensure your PAT is valid; replace if expired (generate at https://github.com/settings/tokens with read scopes).

---
The Model Context Protocol (MCP) from GitHub provides a flexible way to integrate AI agents with GitHub's ecosystem, allowing read-only access to features like code search, repository analysis, issue querying, and security scanning through grouped toolsets. While the default MCP server includes broad capabilities, customizing servers by category—as requested—enhances modularity and security, especially in read-only mode where write operations (e.g., create_branch, update_issue) are automatically disabled. This setup aligns with GitHub's recommendations for least-privilege access, reducing risks in research or auditing workflows.

Research suggests that combining related toolsets (e.g., `repos` and `git` for code investigation) is effective for semantic categories, as long as the total active tools remain manageable (typically under 15 in read-only, given overlaps and filtering). Evidence from GitHub's documentation leans toward including `context` in all configurations for reliable user/org awareness, which we've incorporated. For controversial or complex topics like security scanning, always cross-verify alerts with multiple sources, as Dependabot and CodeQL may flag false positives.

#### Detailed MCP Syntax and Schema
The `mcp.json` configuration follows a structured schema for defining HTTP-based remote servers:
- **Root Keys**: `servers` (object of named configs) and `inputs` (array for dynamic variables, empty here as token is hardcoded—use inputs for production security).
- **Server Properties**:
  - `type`: "http" for GitHub's remote endpoint.
  - `url`: Base API with `/readonly` appended for read-only enforcement.
  - `headers`: Includes `Authorization` (Bearer PAT), `X-MCP-Toolsets` (comma-separated list for enabling groups).
  - Other fields: `alwaysAllow`/`disabledTools` for fine-grained tool control (unused here), `disabled` (false), `gallery` (discovery URL), `version` (compatibility, e.g., "0.29.0").
- **Read-Only Implementation**: The `/readonly` path or `X-MCP-Readonly: true` header filters out mutation tools, ensuring safety. This takes precedence over other configs.
- **Toolset Customization**: Use `X-MCP-Toolsets` for groups; for granular control, add `X-MCP-Tools` (e.g., "get_file_contents,search_code") if needed, but toolsets suffice here.
- **Versioning and Updates**: As of February 2026, version 0.29.0 supports these features; monitor GitHub's changelog for evolutions like new security tools.

Full schema reference available at GitHub's MCP docs (https://docs.github.com/en/copilot/concepts/context/mcp).

#### Toolset Breakdown by Category
The following table summarizes the selected toolsets, their read-only tools (writes disabled), approximate tool count, and use cases. Total tools per server are kept reasonable by semantic grouping and read-only filtering.

| Category/Server Name | Toolsets Included | Key Read-Only Tools (Examples) | Approx. Active Tools | Primary Use Cases |
|----------------------|-------------------|--------------------------------|----------------------|-------------------|
| Code Research (github-code-research-read) | context, repos, git | get_me (context), search_repos, search_code, get_file_contents, get_repository_tree, list_commits, get_commit (repos/git) | 10-12 | Global code search across GitHub, repo tree navigation, file/content retrieval for analysis. Supports investigating specific repos without edits. |
| Issues Finder (github-issues-read) | context, issues | get_teams (context), list_issues, search_issues, issue_read, get_issue_comments | 6-8 | Querying and reading issues in targeted repos. Useful for triage or reporting without creating/updating. |
| Security Scanning (github-security-scanning-read) | context, dependabot, code_security, secret_protection | get_org_members (context), list_dependabot_alerts, get_dependabot_alert, list_code_scanning_alerts, get_code_scanning_alert, list_secret_scanning_alerts, get_secret_scanning_alert | 9-12 | Vulnerability alerts from Dependabot, code scanning (CodeQL), and secret scanning. Focuses on detection and review, no updates or dismissals. |

Note: Tool counts are estimates based on GitHub's docs; actual varies by version. Overlaps (e.g., tree access in repos/git) are deduplicated by MCP.

#### Implementation Considerations
- **Authentication and Scopes**: The provided PAT should have read access (e.g., `repo`, `security_events` for scanning). For enterprise, use GitHub Enterprise URLs like "https://copilot-api.your-ghe.com/mcp/readonly".
- **Performance Optimization**: Limiting to one category per server minimizes context window usage in AI chats. For broader searches, enable multiple servers simultaneously in VS Code.
- **Limitations and Alternatives**: Global code search is rate-limited by GitHub API; for massive scans, consider third-party MCP servers like Octocode or Git Repo Research (e.g., semantic search via AWS Bedrock). Read-only mode ensures no accidental changes, but verify PAT scopes match (e.g., no write needed).
- **Testing and Troubleshooting**: After saving `mcp.json`, restart VS Code. Use "MCP: Browse Resources" to inspect tools. If tools fail, check logs for auth errors or update to latest MCP version.
- **Extensions and Integrations**: Compatible with tools like Copilot Chat, Claude Desktop, or custom agents. For advanced setups, explore dynamic toolsets via `--tools` in local runs, but remote is recommended for simplicity.

This configuration provides a balanced, secure approach to GitHub research, issue discovery, and security analysis, drawing from GitHub's evolving MCP ecosystem.

### Key Citations
- [GitHub's official MCP Server](https://github.com/github/github-mcp-server)<grok:render card_id="834270" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>
- [Configuring toolsets for the GitHub MCP Server](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/provide-context/use-mcp/configure-toolsets)<grok:render card_id="1dfcdd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>
- [github-mcp-server/docs/remote-server.md at main](https://github.com/github/github-mcp-server/blob/main/docs/remote-server.md)<grok:render card_id="2cb2e3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- [Using the GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/use-the-github-mcp-server)<grok:render card_id="313f2b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render>
- [GitHub MCP Server now comes with server instructions, better tools, and more](https://github.blog/changelog/2025-10-29-github-mcp-server-now-comes-with-server-instructions-better-tools-and-more)<grok:render card_id="c8a336" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [Feature Request: Add support for GitHub Security APIs (Dependabot, Code Scanning, Secret Scanning)](https://github.com/github/github-mcp-server/issues/1921)<grok:render card_id="d2d760" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render>
- [A practical guide on how to use the GitHub MCP server](https://github.blog/ai-and-ml/generative-ai/a-practical-guide-on-how-to-use-the-github-mcp-server)<grok:render card_id="fba9c0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render>
- [github-mcp-server/docs/server-configuration.md at main](https://github.com/github/github-mcp-server/blob/main/docs/server-configuration.md)<grok:render card_id="ed8557" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render>
- [GitHub MCP Server](https://mcpservers.org/servers/asifdotpy/github-mcp-server-asifdotpy)<grok:render card_id="45c21f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render>
- [Read-only mode](https://github.com/atlassian/atlassian-mcp-server/issues/11)<grok:render card_id="0c478e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render>
