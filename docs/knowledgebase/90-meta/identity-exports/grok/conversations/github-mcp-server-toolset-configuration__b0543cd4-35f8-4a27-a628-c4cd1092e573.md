---
source_url: "https://grok.com/c/b0543cd4-35f8-4a27-a628-c4cd1092e573"
conversation_id: "b0543cd4-35f8-4a27-a628-c4cd1092e573"
title: "GitHub MCP Server Toolset Configuration"
extracted_at: "2026-06-29T16:19:00.967Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# GitHub MCP Server Toolset Configuration

Source: [Grok conversation](https://grok.com/c/b0543cd4-35f8-4a27-a628-c4cd1092e573)

## User

_Time: 2025-10-31T21:56:52.838Z_

"github-mcp-server": { "url": "https://api.githubcopilot.com/mcp/", "headers": { "Authorization": "Bearer <REDACTED_GITHUB_PAT>" } },
please research api.githubcopilot.com/mcp/. it should be the official GitHub mcp server. How to configure the above to show ALL the tools that GitHub mcp server supports? it only shows the default/most used atm. Pelase research the web and scrape the GitHub documentation relevant to this task.

## Assistant

_Time: 2025-10-31T22:00:12.079Z_

### Key Points
- The endpoint `api.githubcopilot.com/mcp/` is the official remote GitHub MCP (Model Context Protocol) server, hosted by GitHub to enable AI tools like Copilot to interact with GitHub features such as repositories, issues, and pull requests.
- By default, it exposes a limited set of toolsets (e.g., context, repos, issues, pull_requests, users), which may appear as only the most used tools in your IDE or client.
- To configure it to show and enable all tools, add the `X-MCP-Toolsets` header to your configuration with a comma-separated list of all toolsets (e.g., "default,actions,code_security,..."); evidence suggests "all" may work as a shortcut, though it's primarily documented for local setups—test it for remote.
- Authentication uses your provided Bearer token (GitHub PAT), but ensure it has sufficient scopes (e.g., repo, read:org) for all tools; OAuth is recommended for remote setups in IDEs like VS Code.
- In clients like VS Code, if exceeding 128 tools, enable virtual tools via the `github.copilot.chat.virtualTools.threshold` setting to handle more without limits.

### Configuration Steps
To update your provided config for the remote MCP server and enable all tools, modify it as follows (example in JSON format for `.vscode/mcp.json` or similar):

```json
{
  "servers": {
    "github-mcp-server": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <REDACTED_GITHUB_PAT>",
        "X-MCP-Toolsets": "all"  // Or list explicitly: "default,actions,code_security,dependabot,discussions,experiments,gists,labels,notifications,orgs,projects,secret_protection,security_advisories,stargazers,copilot,copilot_spaces,github_support_docs_search"
      }
    }
  }
}
```

- Restart your IDE or MCP client after updating.
- If using VS Code, install via the Extensions view (search `@mcp`) or command palette (`MCP: Add Server`), and authenticate if prompted.
- For read-only mode (to safely test all tools without write access), add `"X-MCP-Readonly": "true"` to headers.

### Viewing All Tools
Once configured:
- In VS Code Agent mode, click the Tools icon in Copilot Chat to browse and toggle tools.
- Ask Copilot to "list your tools" in chat for a dynamic list.
- If tools don't appear fully, clear cache with `MCP: Reset Cached Tools` command and ensure `chat.mcp.access` is set to "all".

### Potential Limitations
Research indicates that not all toolsets (e.g., experiments) are stable, and enabling everything may exceed model token limits in some clients—use selectively if issues arise. For controversial or security-sensitive tools (e.g., code_security), double-check PAT scopes and GitHub policies.

---
The GitHub MCP (Model Context Protocol) server at `api.githubcopilot.com/mcp/` serves as GitHub's official hosted implementation of the MCP standard, designed to bridge AI models with GitHub's ecosystem. This allows AI assistants like GitHub Copilot to access and manipulate GitHub data—such as repositories, issues, pull requests, workflows, and more—through a unified interface. Unlike local setups that require Docker or binary execution, the remote server offers always-up-to-date functionality with simplified authentication, making it ideal for integration in IDEs like VS Code, Visual Studio, JetBrains, Xcode, or Eclipse. However, it inherits GitHub's access controls, meaning tools require appropriate subscriptions (e.g., Copilot license for coding agent tools) and permissions.

The default configuration exposes only a subset of tools, often appearing as the "most used" in clients due to model constraints and predefined toolsets. This is intentional to optimize performance and reduce context overload for LLMs, but it can be expanded. The MCP protocol itself is an open standard for connecting LLMs to external tools, with no strict knowledge cutoff—updates like the June 2025 spec emphasize secure transports (stdio, http, sse) and authorization. While the protocol doesn't mandate tool filtering endpoints, GitHub's implementation supports customization via headers.

#### Authentication and Setup
Authentication for the remote server prefers OAuth for seamless sign-in, but your provided Bearer token (a GitHub PAT starting with `ghp_`) works via headers. Ensure the token has broad scopes like `repo`, `read:org`, `workflow`, and `notifications` to unlock all tools; narrow scopes limit functionality. In VS Code, add the server via user or workspace `mcp.json`, prompt for the token securely using `${input:pat-id}`, and validate with `curl -I https://api.githubcopilot.com/mcp/_ping` (expect 200 OK). For enterprises, enable the "MCP servers in Copilot" policy in organization settings.

#### Toolsets and Tools Overview
Toolsets group related tools to manage context size and aid LLM decision-making. The default toolset includes `context`, `repos`, `issues`, `pull_requests`, and `users`. Enabling all exposes advanced capabilities, but may require virtual tools in clients to bypass 128-tool limits.

**Table 1: All Available Toolsets on GitHub MCP Server**

| Toolset                  | Description                                                                 | Availability | Key Tools/Methods |
|--------------------------|-----------------------------------------------------------------------------|--------------|-------------------|
| **context**             | Provides user and GitHub context (e.g., current user details, teams).      | Default     | get_me, get_team_members, get_teams |
| **repos**               | Repository operations like creating branches, files, commits, and searches.| Default     | create_branch, create_or_update_file, delete_file, get_commit, get_file_contents, list_branches, list_commits, search_repositories |
| **issues**              | Issue management, including creation, updates, comments, and sub-issues.   | Default     | issue_read (get, get_comments, get_labels, get_sub_issues), issue_write (create, update), sub_issue_write (add, reprioritize, remove), add_issue_comment, list_issues, search_issues |
| **pull_requests**       | Pull request workflows, including creation, merges, reviews, and diffs.    | Default     | pull_request_read (get, get_diff, get_status, get_files, get_review_comments, get_reviews, get_comments), pull_request_review_write (create, submit, delete), create_pull_request, merge_pull_request, update_pull_request |
| **users**               | User searches and information.                                             | Default     | search_users |
| **actions**             | GitHub Actions and CI/CD (e.g., workflows, runs, artifacts, logs).         | Additional  | cancel_workflow_run, get_workflow_run, list_workflow_runs, list_workflows, rerun_workflow_run |
| **code_security**       | Code scanning alerts and security features.                                | Additional  | get_code_scanning_alert, list_code_scanning_alerts |
| **dependabot**          | Dependabot alerts for vulnerabilities.                                     | Additional  | get_dependabot_alert, list_dependabot_alerts |
| **discussions**         | GitHub Discussions management.                                             | Additional  | get_discussion, get_discussion_comments, list_discussions |
| **experiments**         | Unstable experimental features (use with caution).                         | Additional  | Varies (not fully stable) |
| **gists**               | Gist creation, updates, and listings.                                      | Additional  | create_gist, get_gist, list_gists, update_gist |
| **labels**              | Label creation, updates, and listings.                                     | Additional  | label_write (create, update, delete), get_label, list_labels |
| **notifications**       | Notification management (e.g., list, dismiss, mark read).                  | Additional  | dismiss_notification, get_notification_details, list_notifications, mark_all_notifications_read |
| **orgs**                | Organization searches and details.                                         | Additional  | search_orgs |
| **projects**            | GitHub Projects (e.g., items, fields).                                     | Additional  | add_project_item, get_project, list_project_items, update_project_item |
| **secret_protection**   | Secret scanning alerts.                                                    | Additional  | get_secret_scanning_alert, list_secret_scanning_alerts |
| **security_advisories** | Security advisories listings.                                              | Additional  | get_global_security_advisory, list_repository_security_advisories |
| **stargazers**          | Starred repositories and stargazing actions.                               | Additional  | list_starred_repositories, star_repository, unstar_repository |
| **copilot**             | Copilot-specific tools (e.g., coding agent).                               | Remote Only | create_pull_request_with_copilot |
| **copilot_spaces**      | Copilot Spaces management.                                                 | Remote Only | get_copilot_space, list_copilot_spaces |
| **github_support_docs_search** | Search GitHub support documentation.                                      | Remote Only | github_support_docs_search |

**Table 2: Example Consolidated Tools (Post-October 2025 Updates)**

| Tool Name               | Methods Supported                                                  | Parameters Example | Purpose |
|-------------------------|--------------------------------------------------------------------|--------------------|---------|
| issue_read             | get, get_comments, get_labels, get_sub_issues                     | owner, repo, issue_number | Read issue details and related data. |
| issue_write            | create, update                                                    | title, body, assignees, labels | Create or modify issues. |
| sub_issue_write        | add, reprioritize, remove                                         | parent_issue_number, sub_issue_number | Manage sub-issues. |
| pull_request_read      | get, get_diff, get_status, get_files, get_reviews, get_comments  | owner, repo, pull_number | Retrieve PR details. |
| pull_request_review_write | create, submit_pending, delete_pending                          | body, event (APPROVE/DISMISS) | Handle PR reviews. |

#### Enabling All Tools
To expand beyond defaults, use the `X-MCP-Toolsets` header in your config. Recent updates (October 2025 changelog) introduced support for "default" as a keyword, allowing additions like `X-MCP-Toolsets: "default,actions,code_security"`. For all tools, specify a comma-separated list of every toolset name (as in Table 1), or try "all" (supported in local; likely in remote per parity efforts). If "all" fails, explicitly list: `X-MCP-Toolsets: "context,repos,issues,pull_requests,users,actions,code_security,dependabot,discussions,experiments,gists,labels,notifications,orgs,projects,secret_protection,security_advisories,stargazers,copilot,copilot_spaces,github_support_docs_search"`.

In VS Code, if tools exceed limits, set `github.copilot.chat.virtualTools.threshold` to a low value (e.g., 50) in settings.json to enable virtual grouping. Toggle tools via the Chat view's Tools button, and use `#toolname` in prompts for explicit invocation. For dynamic discovery (beta), enable via local flags but not yet confirmed for remote.

#### Integration and Usage
In IDEs, enter Agent mode in Copilot Chat, select tools, and prompt naturally (e.g., "List all issues in my repo"). The server processes via GitHub's REST/GraphQL APIs, with responses in chat. For GitHub.com Chat, skills are limited to predefined ones (e.g., create branch, merge PR)—no full tool list view, but prompts invoke them.

Troubleshooting: Check logs for errors, ensure no proxy blocks, rotate PATs regularly, and bypass push protections if needed. Limitations include read-only mode for safety (`X-MCP-Readonly: "true"`), no support for custom prompts/resources in some agents, and potential performance hits with all tools enabled.

This configuration unlocks comprehensive AI-driven workflows, from code security scans to notification triage, but prioritize selective toolsets for efficiency.

### Key Citations
- [Using the GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/use-the-github-mcp-server)<grok:render card_id="654a1c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [Use MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)<grok:render card_id="f10d19" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [GitHub's official MCP Server Repository](https://github.com/github/github-mcp-server)<grok:render card_id="897484" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render>
- [A practical guide on how to use the GitHub MCP server](https://github.blog/ai-and-ml/generative-ai/a-practical-guide-on-how-to-use-the-github-mcp-server/)<grok:render card_id="763e81" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>
- [GitHub MCP Server Changelog Update (October 29, 2025)](https://github.blog/changelog/2025-10-29-github-mcp-server-now-comes-with-server-instructions-better-tools-and-more/)<grok:render card_id="2d6277" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">79</argument>
</grok:render>
