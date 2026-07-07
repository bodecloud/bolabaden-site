---
source_url: "https://grok.com/c/846b1a1c-434e-455c-a782-d3c500605456"
conversation_id: "846b1a1c-434e-455c-a782-d3c500605456"
title: "MCP Servers for Git Diffing"
extracted_at: "2026-06-29T16:19:07.488Z"
message_count: 5
export_suite: "identity"
provenance: grok-rest-api
---

# MCP Servers for Git Diffing

Source: [Grok conversation](https://grok.com/c/846b1a1c-434e-455c-a782-d3c500605456)

## User

_Time: 2025-10-26T14:53:35.369Z_

please find me an mcp server for diffing code on git easier. like between branches, tags, forks, commits, etc. Anything and everything be thorough.

## Assistant

_Time: 2025-10-26T14:56:52.820Z_

- MCP servers, or Model Context Protocol servers, are tools that allow AI agents and large language models to interact with Git repositories, making tasks like code diffing between branches, commits, tags, and forks more automated and accessible.
- The most prominent options include GitHub's official MCP server for seamless integration with GitHub APIs, and open-source alternatives like cyanheads/git-mcp-server for direct local Git operations, both supporting diffing with varying levels of depth.
- While not all MCP servers focus exclusively on diffing, they enhance it by providing AI-driven analysis, such as generating diffs, resolving conflicts, or reviewing changes across repositories.

**Top Recommendations**
Several MCP servers stand out for Git-related diffing. GitHub's official server<grok:render card_id="6015ff" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">53</argument>
</grok:render> excels at API-based interactions, ideal for cloud-hosted repos on GitHub. For local repositories, cyanheads/git-mcp-server<grok:render card_id="b7b82b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">51</argument>
</grok:render> offers comprehensive CLI-driven tools. mcp-server-git<grok:render card_id="67a8cb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">50</argument>
</grok:render> provides targeted diffing for unstaged, staged, or targeted changes. Git Ingest MCP<grok:render card_id="b9704a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render> is great for ingesting and analyzing diffs in commit histories. For broader ecosystems, options like GitLab MCP and Bitbucket MCP extend similar capabilities to other platforms.

**Enhancing Git Diffing**
These servers make diffing easier by exposing Git operations as AI-callable tools. For instance, you can request diffs between specific commits or branches via natural language, with AI suggesting resolutions for conflicts. They handle forks through API calls for cross-repo comparisons, and support tags/branches via listing and retrieval tools. This reduces manual command-line work, especially for complex comparisons.

**Setup and Usage Basics**
Most servers install via Docker or package managers like npx/bunx. For GitHub's, use VS Code integration with OAuth for remote access<grok:render card_id="326e4c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">52</argument>
</grok:render>. Local setups require a GitHub PAT. Integrate with AI tools like Claude or Cursor for workflows, such as "show diff between main and feature-branch."

---
Model Context Protocol (MCP) servers represent a significant advancement in AI-assisted software development, particularly for version control systems like Git. These servers act as intermediaries, exposing Git functionalities through a standardized protocol that allows large language models (LLMs) and AI agents to perform operations programmatically. This includes reading repository states, manipulating branches, and crucially, generating and analyzing code diffs. By bridging AI capabilities with Git, MCP servers streamline workflows that traditionally require manual intervention, such as comparing code changes across branches, commits, tags, or even forks. This section provides a comprehensive overview, drawing from various implementations, features, and use cases to help developers select and deploy an appropriate MCP server for enhanced Git diffing.

### Understanding MCP Servers in the Context of Git Diffing
MCP, or Model Context Protocol, is designed to extend AI models with external tools, resources, and prompts. In Git contexts, this means servers can handle operations like cloning, committing, and diffing without the AI needing direct access to the filesystem or CLI. Diffing—comparing code changes—is a core Git feature, but MCP servers elevate it by enabling AI-driven insights, such as automated reviews or conflict resolution. For example, diffs can be generated between:
- **Branches**: Comparing 'main' vs. 'feature' to identify new features or bugs.
- **Commits**: Viewing changes in a specific commit or between two SHAs.
- **Tags**: Analyzing differences between release versions (e.g., v1.0 vs. v2.0).
- **Forks**: Cross-repository comparisons, often via API calls to services like GitHub.

Unlike traditional Git tools (e.g., git diff command), MCP servers integrate with AI ecosystems, allowing natural language queries like "Show me the diff between commit ABC123 and tag v1.5." This is particularly useful for distributed teams or automated CI/CD pipelines. However, implementations vary: some use Git CLI for local ops, while others leverage APIs for remote repos.

### Key MCP Servers for Git Diffing
Based on recent analyses from 2025 sources, here are detailed profiles of leading MCP servers tailored for Git diffing. These were selected for their relevance to diff operations, open-source availability, and community adoption.

#### 1. GitHub's Official MCP Server
This server, hosted by GitHub, connects AI tools directly to GitHub's APIs for repository interactions. It's ideal for diffing in cloud environments and supports enterprise features like Copilot integration.

- **Description**: Enables AI agents to manage repos, issues, PRs, and code analysis. Diffing is handled via API endpoints rather than local CLI.
- **Diffing Features**:
  - Tools like `pull_request_read` with `get_diff` to retrieve PR diffs.
  - `get_commit` includes file diffs and stats (pagination supported).
  - Branch/tag/fork comparison via `list_branches`, `list_tags`, `get_commit`, and `fork_repository`.
  - PR-specific diffing: `get_files`, `get_review_comments` for line-by-line diffs.
- **Strengths**: Seamless with GitHub forks; AI can request Copilot reviews on diffs. Read-only mode for safe exploration.
- **Limitations**: API-based, so less flexible for local repos; requires GitHub account.
- **Installation/Usage**:
  - Remote: Configure in VS Code with URL `https://api.githubcopilot.com/mcp/` and OAuth.
  - Local: Docker image `ghcr.io/github/github-mcp-server`; run with PAT env var.
  - Example Workflow: "List critical changes in PR #42" → Uses `pull_request_read` to fetch diff and analyze.
- **Links**: https://github.com/github/github-mcp-server

#### 2. cyanheads/git-mcp-server
An open-source MCP server focused on comprehensive local Git operations via CLI integration. It's highly versatile for diffing in any Git repo.

- **Description**: Provides 27 tools across categories like repository management, commits, and branching. Supports Bun/Node.js runtimes.
- **Diffing Features**:
  - `git_diff`: Compares changes between working dir, stages, branches, commits, or files.
  - Integrates with `git_log`, `git_show` for historical diffs.
  - Branch/tag support: `git_branch`, `git_checkout`, `git_tag` for setup before diffing.
  - Fork handling: Indirect via `git_clone` and `git_remote` for multi-repo diffs.
  - Advanced: Merge conflict resolution in `git_merge`; commit signing optional.
- **Strengths**: Session-specific working dirs; security features like path restrictions. Pluggable providers (CLI default, isomorphic-git planned).
- **Limitations**: Local-focused; requires Git installed on host.
- **Installation/Usage**:
  - Via bunx: `bunx @cyanheads/git-mcp-server@latest`
  - Env vars: Set `GIT_BASE_DIR`, `GIT_USERNAME`, etc.
  - Example: AI query "Diff main vs dev branch" → Calls `git_diff` with args.
- **Links**: https://github.com/cyanheads/git-mcp-server

#### 3. mcp-server-git (from Awesome MCP Servers)
A lightweight, early-stage server for basic Git interactions, emphasizing diffing tools.

- **Description**: Allows LLMs to read, search, and manipulate repos with 11+ tools.
- **Diffing Features**:
  - `git_diff_unstaged`, `git_diff_staged`: Quick diffs for local changes.
  - `git_diff`: Compares current state to a target (branch/commit/tag).
  - `git_log`: Filters commits for diff context (e.g., by timestamp).
  - Branch/tag: `git_create_branch`, `git_checkout`, `git_branch`.
  - Fork support: Via `repo_path` for cloned forks.
- **Strengths**: Customizable context lines in diffs; simple for AI-assisted reviews.
- **Limitations**: In development; lacks advanced API integrations.
- **Installation/Usage**: Clone from repo; run as MCP server. Tools require `repo_path`.
- **Links**: https://mcpservers.org/servers/modelcontextprotocol/git

#### 4. Git Ingest MCP Server
Focused on data ingestion for analysis, including diffs from history.

- **Description**: Ingests commit logs, changes, and metadata for AI insights.
- **Diffing Features**:
  - Analyzes diffs in commit histories; detects bugs in changes.
  - Integrates with other data for cross-diff comparisons.
  - Supports branch/commit filtering indirectly via ingestion.
- **Strengths**: Great for historical diff reviews; code quality analysis.
- **Limitations**: More ingestion-oriented than real-time diffing.
- **Links**: https://github.com/adhikasp/mcp-git-ingest

#### 5. Other Notable Servers
- **GitMCP**: Remote server for GitHub docs/code search; semantic diffs. Link: https://gitmcp.io
- **GitLab MCP**: Mirrors GitHub for GitLab repos; branch/merge diffs. Link: https://github.com/modelcontextprotocol/servers/tree/main/src/gitlab
- **Bitbucket MCP**: Automates PR diffs and reviews. Link: https://github.com/garc33/bitbucket-server-mcp-server
- **Azure DevOps MCP**: Links commits to items; diff-based refactoring. Link: https://github.com/Tiberriver256/mcp-server-azure-devops
- **AWS CodeCommit MCP**: Manages branches/tags with diffs. Link: https://github.com/awslabs/mcp

### Comparative Analysis
To aid selection, here's a table comparing key servers on diffing capabilities:

| Server | Diff Tools | Branch/Commit Support | Tag/Fork Support | AI Integration | Installation Ease | Open-Source |
|--------|------------|-----------------------|------------------|----------------|-------------------|-------------|
| GitHub Official | PR diffs, commit diffs | Full (list/create) | Full (list/get) | High (Copilot) | High (OAuth/Docker) | Yes |
| cyanheads/git-mcp | git_diff, staged/unstaged | Full (checkout/merge) | Full (tag management) | Medium (LLM prompts) | Medium (bunx/npx) | Yes |
| mcp-server-git | git_diff variants | Basic (create/checkout) | Basic (via show) | Medium (LLM access) | Low (clone/run) | Yes |
| Git Ingest | History diffs | Indirect (logs) | Indirect | High (analysis) | Medium | Yes |
| GitMCP | Semantic search diffs | Search-based | Search-based | High | High (remote) | Partial |

Additional tables from sources:

**Tools in cyanheads/git-mcp-server** (categorized):

| Category | Tools | Diff-Related? |
|----------|--------|---------------|
| Repository Management | git_init, git_clone, git_status, git_clean | Indirect (setup for diffs) |
| Staging & Commits | git_add, git_commit, git_diff | Yes (core diff tool) |
| History & Inspection | git_log, git_show, git_blame, git_reflog | Yes (context for diffs) |
| Branching & Merging | git_branch, git_checkout, git_merge, git_rebase, git_cherry_pick | Yes (setup comparisons) |
| Remote Operations | git_remote, git_fetch, git_pull, git_push | Indirect (sync for diffs) |
| Advanced Workflows | git_tag, git_stash, git_reset, git_worktree | Yes (tags/resets affect diffs) |

**Environment Variables for cyanheads/git-mcp-server**:

| Variable | Description | Default |
|----------|-------------|---------|
| MCP_TRANSPORT_TYPE | stdio or http | stdio |
| GIT_BASE_DIR | Restrict ops to dir | None |
| GIT_SIGN_COMMITS | Enable signing | false |
| MCP_LOG_LEVEL | Logging level | info |

### Community Recommendations and Use Cases
From X discussions, users praise GitHub's server for automating PR diffs<grok:render card_id="f22c6a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render> and cyanheads for local flexibility. Philipp Schmid highlights it among top MCP servers for GitHub integration<grok:render card_id="432166" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render>. Unwind AI recommends for code graph diffs<grok:render card_id="8cb464" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render>. Workflows include:
- **Code Review**: AI fetches PR diff, adds line comments.
- **Historical Analysis**: Diff tags to audit releases.
- **Fork Sync**: Compare forks, merge changes.
- **Conflict Resolution**: AI suggests fixes via merge tools.

### Setup, Security, and Best Practices
- **General Setup**: Use Docker for isolation; configure PATs with minimal scopes. For remote, prefer OAuth to avoid token exposure.
- **Security**: Enable read-only modes; restrict directories. Rotate tokens regularly.
- **Integration Tips**: Pair with VS Code/Cursor for agent mode. Test with prompts like "Diff between forks A and B."
- **Limitations and Future**: Not all support air-gapped setups; upcoming features include edge providers for serverless diffing.

This survey encompasses the primary options, ensuring developers can implement AI-enhanced Git diffing effectively.

**Key Citations:**
- [cyanheads/git-mcp-server - GitHub](https://github.com/cyanheads/git-mcp-server)
- [Git | Awesome MCP Servers](https://mcpservers.org/servers/modelcontextprotocol/git)
- [Top 9 MCP Servers for Git Tools in 2025: Boost Your Development Workflow](https://apidog.com/blog/top-10-mcp-servers-for-git-tools/)
- [GitHub - github/github-mcp-server: GitHub's official MCP Server](https://github.com/github/github-mcp-server)
- [A practical guide on how to use the GitHub MCP server](https://github.blog/ai-and-ml/generative-ai/a-practical-guide-on-how-to-use-the-github-mcp-server/)
- [Akshay 🚀 on X: "GitHub's Official MCP Server is here!"](https://x.com/akshay_pachaar/status/1908497370683506959)
- [Philipp Schmid on X: "Here are my top 12 MCP Servers I used and tested so far"](https://x.com/_philschmid/status/1917132993644146956)
- [Unwind AI on X: "These 10 MCP servers are almost all you'll ever need."](https://x.com/unwind_ai_/status/1968512868544082377)

## User

_Time: 2025-10-26T15:07:08.558Z_

```

{"mcpServers": [
    "github-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "ghcr.io/github/github-mcp-server",
        "stdio",
        "--toolsets=all"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<REDACTED_GITHUB_PAT>",
        "GITHUB_TOKEN": "<REDACTED_GITHUB_PAT>",
        "GITHUB_PAT": "<REDACTED_GITHUB_PAT>"
      }
    }]}
```

anytime i try this it just says 'GITHUB_PERSONAL_ACCESS_TOKEN not set.

## Assistant

_Time: 2025-10-26T15:08:05.962Z_

### Key Points
- **The error "GITHUB_PERSONAL_ACCESS_TOKEN not set" occurs because your MCP configuration's Docker `args` array lacks the required `-e` flag to pass the environment variable into the container.** This is a common setup issue in tools like VS Code or Cursor, where the `env` block sets the host variable but doesn't propagate it to Docker without explicit `-e` in `args`.
- **Your token appears valid (starts with `ghp_`), but the server can't access it inside the container.** No evidence suggests the token itself is invalid—focus on config fixes.
- **Quick fix: Update your `mcpServers` JSON** by adding `-i`, `--rm`, and `-e GITHUB_PERSONAL_ACCESS_TOKEN` to the `args` array, and reference the variable properly in `env`. Test with a minimal Docker command outside the config first.
- **Security note:** Avoid hardcoding tokens in configs; use inputs or external env vars. Regenerate your token if shared publicly, as it's visible in your query.
- **Uncertainty:** If you're using a specific host (e.g., VS Code, Cursor, Claude), slight variations apply—confirm in their docs. This setup works for standard Docker-based integrations.

### Troubleshooting Steps
1. **Verify Docker Setup:** Ensure Docker is installed and running (`docker --version`). Pull the image: `docker pull ghcr.io/github/github-mcp-server`.
2. **Test Token Manually:** Run this in your terminal (replace `<your-actual-token>` with your full token):
   ```
   docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN=<your-actual-token> ghcr.io/github/github-mcp-server
   ```
   - If it starts without the error, the issue is config-specific. If not, check token scopes (needs `repo`, `read:org`, etc.) at https://github.com/settings/tokens.
3. **Update Your Config:** See the corrected JSON below. Save it in your host's settings (e.g., VS Code: `Ctrl+Shift+P` > "Preferences: Open User Settings (JSON)").
4. **Restart and Test:** Reload the host app, enable Agent mode, and query something like "List my GitHub repos" to verify.

### Corrected Configuration
Use this updated `mcpServers` block. It includes inputs for secure token entry (prompted once), proper Docker flags, and toolsets for Git diffing (e.g., repos, pull_requests for branch/commit comparisons).

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "github_token",
        "description": "GitHub Personal Access Token (for MCP server access)",
        "password": true
      }
    ],
    "servers": {
      "github-mcp-server": {
        "command": "docker",
        "args": [
          "run",
          "-i",
          "--rm",
          "-e",
          "GITHUB_PERSONAL_ACCESS_TOKEN",
          "-e",
          "GITHUB_TOOLSETS=all",
          "ghcr.io/github/github-mcp-server",
          "stdio"
        ],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}"
        }
      }
    }
  }
}
```
- **Why this works:** The `-e GITHUB_PERSONAL_ACCESS_TOKEN` in `args` tells Docker to inject the value from `env`. `"${input:github_token}"` prompts for your token securely. `--toolsets=all` enables full features like diffs between branches/tags/commits/forks via API tools (e.g., `get_commit_diff`, `compare_branches`).
- **For GitHub Enterprise:** Add `"GITHUB_HOST": "https://your-enterprise-domain.com"` to `env` and `--gh-host=${env:GITHUB_HOST}` to `args`.

### Additional Tips for Git Diffing
Once running, use natural language in your AI host (e.g., Cursor/VS Code Copilot): "Show diff between main branch and my-feature commit SHA abc123" or "Compare forks user/repo1 vs user/repo2." The server exposes tools like `pull_request_get_diff` for PRs, `commit_get_files` for commit diffs, and `repo_compare` for branches/tags/forks.

If issues persist, check logs in your host's developer console or run the manual Docker command with `--log-level=debug` (add `-e GITHUB_LOG_LEVEL=debug`).

---

The GitHub MCP Server is a robust tool for AI-assisted Git operations, including advanced diffing across branches, tags, commits, and forks via GitHub's APIs. However, setup errors like "GITHUB_PERSONAL_ACCESS_TOKEN not set" are frequent during initial configuration, often stemming from incomplete Docker flags or variable propagation in host-specific JSON files. This comprehensive guide expands on the direct fixes, drawing from official documentation, community reports, and practical workflows as of October 2025. It covers root causes, full setup protocols, security best practices, and integration for diff-heavy use cases, ensuring seamless operation in environments like VS Code, Cursor, or Claude Desktop.

### Understanding the Error and Environment Variables
The error arises when the server binary (inside the Docker container) checks for `GITHUB_PERSONAL_ACCESS_TOKEN` during initialization but finds it unset. This variable is mandatory for API authentication—without it, tools like repository listing or diff generation fail immediately.

Key environment variables include:
- **GITHUB_PERSONAL_ACCESS_TOKEN (or aliases GITHUB_TOKEN/GITHUB_PAT):** Your GitHub Personal Access Token (PAT). Required for all operations; scopes like `repo` (full repo access), `pull_requests` (diffs/PRs), and `admin:org` (forks/orgs) are ideal for diffing.
- **GITHUB_TOOLSETS:** Comma-separated list (e.g., "repos,pull_requests,code_search") or "all" for everything. Defaults to "context,repos,issues,pull_requests,users" if unset. Use this for diff-focused tools.
- **GITHUB_HOST:** For GitHub Enterprise (e.g., "https://ghes.example.com"). Omit for github.com.
- **GITHUB_READ_ONLY:** Set to "1" to restrict to read ops (safer for diffing previews).
- **GITHUB_DYNAMIC_TOOLSETS:** Set to "1" for beta auto-discovery of tools.

In Docker contexts, variables must be explicitly passed with `-e VAR_NAME` in the command line; the host's `env` block alone isn't sufficient without this flag. Community issues (e.g., GitHub #144) confirm this as the top culprit, especially in VS Code/Cursor configs where JSON parsing can miss propagation.

### Full Setup Instructions
#### Prerequisites
- **Docker:** Install from https://www.docker.com/products/docker-desktop. Verify: `docker run hello-world`.
- **GitHub PAT:** Generate at https://github.com/settings/personal-access-tokens. Select scopes based on needs (e.g., `repo:status` for basic diffs, full `repo` for writes/merges). Expiration: 90 days recommended; fine-grained tokens preferred for security.
- **Host App:** VS Code (1.101+ with Copilot), Cursor, or Claude Desktop. Enable MCP/Agent mode in settings.

#### Step-by-Step Configuration
1. **Create/Regenerate PAT:** Log in to GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic) > Generate new token. Copy immediately—it's shown once.
2. **Manual Docker Test:** Validate outside your host:
   ```
   docker run -i --rm \
     -e GITHUB_PERSONAL_ACCESS_TOKEN=<YOUR_GITHUB_PAT> \
     -e GITHUB_TOOLSETS="repos,pull_requests" \
     ghcr.io/github/github-mcp-server
   ```
   - Expected: Server starts, outputs MCP protocol handshake. Ctrl+C to exit.
   - Error variants: "invalid token" (wrong scopes/expired); "unauthorized" (no PAT).
3. **Host Integration (JSON Config):**
   - **VS Code:** `Ctrl+Shift+P` > "Preferences: Open User Settings (JSON)". Add the corrected block above. For workspace-specific: Create `.vscode/mcp.json`.
   - **Cursor:** Settings > Tools & Integrations > New MCP Server. Paste the JSON.
   - **Claude Desktop:** Edit `~/Library/Application Support/Claude/claude_desktop_config.json`.
   - Reload/restart the app. The host prompts for the token via `${input:github_token}`.
4. **Advanced Options:**
   - **Read-Only Diffing:** Add `-e GITHUB_READ_ONLY=1` to args for safe branch/tag comparisons.
   - **Enterprise:** Include `-e GITHUB_HOST=https://your-ghes.com` and `--gh-host=${env:GITHUB_HOST}` in args.
   - **From Source (No Docker):** `git clone https://github.com/github/github-mcp-server`, `cd github-mcp-server`, `go build -o github-mcp-server cmd/github-mcp-server`, then `./github-mcp-server stdio` with `export GITHUB_PERSONAL_ACCESS_TOKEN=your_token`.
   - **Custom Toolsets for Diffing:** Set `GITHUB_TOOLSETS="repos,pull_requests,code_search"` to prioritize diff tools like `get_pull_request_diff` or `search_code`.

#### Verification Workflow
- In host chat/agent: "Authenticate with GitHub and list my repos." Success: Lists repos without auth errors.
- Diff Test: "Generate diff between branch 'main' and tag 'v1.0' in repo owner/my-repo." Uses `repo_get_compare` tool.

### Security and Best Practices
- **Never Hardcode Tokens:** Use inputs (`${input:github_token}`) or shell exports (`export GITHUB_PAT=token; docker ... -e GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PAT`). Add to `.gitignore` for `.env` files.
- **Scope Minimally:** For diffing only, limit to `public_repo` or `repo:read`. Rotate every 30-90 days.
- **Logging:** Add `-e GITHUB_LOG_LEVEL=debug` for troubleshooting; review host console.
- **Common Pitfalls:** 
  - Missing `-i` (interactive stdin for MCP).
  - Podman vs. Docker (some users report alias issues; use `podman` command if preferred).
  - Host-Specific: Cursor may need `npx @modelcontextprotocol/server-github` for non-Docker; VS Code ignores global env vars without `${env:VAR}`.

### Diffing Capabilities in Depth
The server excels at AI-driven Git diffs by exposing 20+ tools via MCP:
- **Branches/Commits:** `repo_list_branches`, `commit_get_diff` (e.g., between SHA1 and SHA2).
- **Tags:** `repo_list_tags`, then `tag_get_commit` + diff.
- **Forks:** `repo_list_forks`, `repo_compare` across owners.
- **PRs:** `pull_request_get_diff`, `pull_request_list_files_changed`.
- Enhancements: AI can summarize diffs, suggest merges, or resolve conflicts via `pull_request_create_comment`.

| Feature | Tool Example | Use Case | Supported Comparisons |
|---------|--------------|----------|-----------------------|
| Branch Diffs | `repo_compare` | "Diff main vs. dev" | Branches, heads |
| Commit Diffs | `commit_get_files` | "Changes in commit abc123" | Single commit, range |
| Tag Diffs | `tag_list` + `commit_get_diff` | "v1.0 vs. v2.0" | Tags as refs |
| Fork Diffs | `fork_list` + `repo_compare` | "My fork vs. upstream" | Cross-repo via API |
| PR Diffs | `pull_request_get_diff` | "Review PR #42 changes" | Inline, full patch |

This setup transforms manual `git diff` into conversational workflows, reducing errors in complex repos.

**Key Citations:**
- [GitHub - github/github-mcp-server: GitHub's official MCP Server](https://github.com/github/github-mcp-server)
- [GITHUB_PERSONAL_ACCESS_TOKEN not set · Issue #144 · github/github-mcp-server](https://github.com/github/github-mcp-server/issues/144)
- [How to Use GitHub MCP Server](https://apidog.com/blog/github-mcp-server/)
- [Setting Up the Official GitHub MCP Server: A simple Guide - DEV Community](https://dev.to/debs_obrien/setting-up-the-official-github-mcp-server-a-simple-guide-707)
- [r/mcpserver on Reddit: GitHub MCP Server: Overview and Setup Guide](https://www.reddit.com/r/mcpserver/comments/1jvsyre/github_mcp_server_overview_and_setup_guide/)
- [GitHub MCP Server | MCP Servers · LobeHub](https://lobehub.com/mcp/md-adnan70-mcp)
- [GitHub MCP server for AI agents](https://playbooks.com/mcp/modelcontextprotocol-github)
- [visual studio code - How configure mcp server on for github - Stack Overflow](https://stackoverflow.com/questions/79793731/how-configure-mcp-server-on-for-github)
- [Do it the official way, Github MCP on Cursor | by thinking onions | Medium](https://medium.com/%40ivythinks/do-it-the-official-way-github-mcp-on-cursor-d11e0c188f22)
- [use environment variables · Issue #276 · github/github-mcp-server](https://github.com/github/github-mcp-server/issues/276)
- [Proposal: Environment Variable Configuration for Filesystem MCP Server · Issue #1879 · modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/issues/1879)
- [GitHub - griffithsbs/envmcp: A lightweight way to use environment variables in your Cursor MCP server definitions.](https://github.com/griffithsbs/envmcp)
- [How to use environment variables in mcp.json - How To - Cursor - Community Forum](https://forum.cursor.com/t/how-to-use-environment-variables-in-mcp-json/79296)
- [r/GithubCopilot on Reddit: Need help storing MCP server credentials in environment variables in Vscode MCP settings](https://www.reddit.com/r/GithubCopilot/comments/1jm9e23/need_help_storing_mcp_server_credentials_in/)
- [How to securely provide env variables to MCP servers? · Issue #2065 · anthropics/claude-code](https://github.com/anthropics/claude-code/issues/2065)
- [MCP Registry | GitHub · GitHub](https://github.com/mcp/github/github-mcp-server)
- [Setting Up the Official GitHub MCP Server, A simple Guide · Debbie Codes](https://debbie.codes/blog/github-mcp-server/)

## Assistant

_Time: 2025-10-26T15:09:43.663Z_

### Key Points
- **Configuration Syntax Issue**: Your provided JSON appears to have a formatting error—it's structured as an array with an object key, which is invalid JSON. This prevents the environment variables (like `GITHUB_PERSONAL_ACCESS_TOKEN`) from being parsed and passed to the Docker command, resulting in the "not set" error. Adjusting it to a proper object format should resolve this.
- **Token Handling**: Hardcoding the token in the config is functional but insecure for shared workspaces; use input prompts for secure entry. The token itself ("<REDACTED_GITHUB_PAT>") may also be invalid or expired if it's a placeholder—generate a fresh one with appropriate scopes (e.g., `repo`, `read:org`).
- **Docker Requirements**: Ensure Docker is installed and running; the command relies on it to spin up the container. If using a remote setup instead, no local Docker or token is needed, as it uses OAuth for simpler authentication.
- **Alternative Approaches**: For easier setup, consider the remote GitHub MCP server via HTTPS/OAuth, especially if you're in VS Code or Cursor, as it avoids local dependencies. Local setups are better for custom environments like GitHub Enterprise.

### Troubleshooting Steps
1. **Validate and Fix JSON**: Open your `.vscode/mcp.json` (or equivalent in Cursor/JetBrains) and restructure it. Remove the array brackets around the server definition and change "mcpServers" to "servers" for standard compatibility. Add an "inputs" section to prompt for the token securely instead of hardcoding.

   Example corrected config:
   ```
   {
     "inputs": [
       {
         "type": "promptString",
         "id": "github_token",
         "description": "GitHub Personal Access Token",
         "password": true
       }
     ],
     "servers": {
       "github-mcp-server": {
         "command": "docker",
         "args": [
           "run",
           "-i",
           "--rm",
           "-e",
           "GITHUB_PERSONAL_ACCESS_TOKEN",
           "ghcr.io/github/github-mcp-server",
           "stdio",
           "--toolsets=all"
         ],
         "env": {
           "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}",
           "GITHUB_TOKEN": "${input:github_token}",
           "GITHUB_PAT": "${input:github_token}"
         }
       }
     }
   }
   ```
   Save and restart your IDE. On first run, it will prompt for the token.

2. **Generate a Valid PAT**: If the error persists after fixing the JSON, your token might lack scopes or be invalid. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens) and create a new classic token with at least `repo` (full control), `read:org`, and `read:packages` scopes. For read-only mode, enable `GITHUB_READ_ONLY=1` in the "env" section to limit actions.

3. **Verify Docker Execution**: Run the Docker command manually in your terminal to test:
   ```
   docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN=your_new_token ghcr.io/github/github-mcp-server stdio --toolsets=all
   ```
   If it works here but not in the IDE, the issue is config-related. Ensure no pull errors by running `docker logout ghcr.io` if needed.

4. **Switch to Remote Setup**: If local fails, use the hosted version for simplicity. In VS Code, add to `mcp.json`:
   ```
   {
     "servers": {
       "github": {
         "type": "http",
         "url": "https://api.githubcopilot.com/mcp/"
       }
     }
   }
   ```
   Authenticate via OAuth when prompted—no token required.

### Common Pitfalls
- **IDE-Specific Variations**: In Cursor (VS Code fork), use Command Palette > MCP: Open Settings to edit. For JetBrains or Xcode, configs go in their respective MCP tabs, but syntax is similar.
- **Security Note**: Avoid committing tokens to git; use `.gitignore` for `.env` files or rely on inputs. Rotate tokens regularly.
- **Error Diagnosis**: Check IDE output logs (e.g., VS Code: MCP: List Servers > Show Output) for details on why the variable isn't set.

---

The GitHub MCP Server enables AI-assisted Git operations, such as code diffing across branches, commits, tags, and forks, by exposing GitHub APIs through the Model Context Protocol (MCP). This allows natural language interactions in IDEs like VS Code or Cursor for tasks like "diff main vs feature-branch." However, setup issues, such as the "GITHUB_PERSONAL_ACCESS_TOKEN not set" error, often stem from configuration errors, missing dependencies, or invalid credentials. Below is a comprehensive guide based on official documentation, covering diagnosis, fixes, and advanced configurations to get the server running for enhanced diffing workflows.

#### Understanding the Error
The error indicates that the Docker container cannot access the required environment variable during runtime. Common causes include:
- Malformed JSON in `mcp.json`, preventing parsing of the "env" section.
- Hardcoded tokens that are invalid, expired, or lack scopes.
- Docker not running or command args missing "-e" flags for variable passing.
- IDE not supporting or misinterpreting the config (e.g., global vs. workspace scope).
- For remote setups, OAuth failures; for local, missing prerequisites like Docker.

In your case, the provided JSON is invalid due to the array structure with a key-value pair inside—JSON arrays cannot have labels like "github-mcp-server": {}. This breaks parsing, so env vars aren't applied. Additionally, hardcoding the token risks exposure; official guides recommend secure inputs.

#### Prerequisites for Setup
Before proceeding, ensure:
- GitHub account with Copilot access (Business/Enterprise may need policy enablement for MCP).
- Docker installed and daemon running (verify with `docker --version`).
- IDE supporting MCP (VS Code 1.101+, Cursor, JetBrains, Visual Studio 17.14+, Xcode, Eclipse).
- A valid PAT: Generate at [GitHub Tokens](https://github.com/settings/tokens) with scopes tailored to needs (e.g., `repo` for full repo access, `read:org` for org data). Minimum for basic diffing: `repo:status`, `repo_deployment`, `read:repo_hook`.

For GitHub Enterprise (GHES or ghe.com), add "GITHUB_HOST": "https://your-domain" in env.

#### Remote Setup (Recommended for Simplicity)
The remote server, hosted by GitHub, avoids local Docker and tokens via OAuth. It's ideal for standard diffing without custom toolsets.

**Steps in VS Code/Cursor:**
1. Open Command Palette (Ctrl+Shift+P).
2. Run "MCP: Add Server" > Select "Remote" > Enter ID "github", Type "HTTP/SSE", URL "https://api.githubcopilot.com/mcp/".
3. Save; authenticate via GitHub popup (OAuth).
4. Enable Agent mode in Copilot Chat.

**Alternative JSON Config:**
Add to `.vscode/mcp.json`:
```
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```
For PAT fallback, add headers: {"Authorization": "Bearer your_pat"}.

In other IDEs (e.g., JetBrains), use their MCP config tabs with similar JSON. This setup supports default toolsets like repos, issues, and pull_requests for diffing (e.g., via `get_commit` or `pull_request_read` tools).

#### Local Setup with Docker
Use this for custom environments or offline capabilities. The image is `ghcr.io/github/github-mcp-server`.

**Manual Docker Run (for Testing):**
```
docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=your_token \
  -e GITHUB_READ_ONLY=1 \
  -e GITHUB_TOOLSETS=all \
  ghcr.io/github/github-mcp-server stdio
```
- Add `-e GITHUB_HOST=https://your-ghe.com` for Enterprise.
- Flags: `--toolsets=all` enables all diff-related tools (e.g., commit diffs, branch listings).

**IDE Integration:**
Create/edit `.vscode/mcp.json` (workspace) or user/global config. Use "stdio" type implicitly via command.

Corrected and Enhanced Version of Your Config:
```
{
  "inputs": [
    {
      "type": "promptString",
      "id": "github_token",
      "description": "GitHub Personal Access Token",
      "password": true
    }
  ],
  "servers": {
    "github-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server",
        "stdio",
        "--toolsets=all"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}",
        "GITHUB_TOKEN": "${input:github_token}",
        "GITHUB_PAT": "${input:github_token}",
        "GITHUB_READ_ONLY": "1"  // Optional: Limits to read-only for safety
      }
    }
  }
}
```
- Restart IDE and start the server via MCP: List Servers.
- For sharing without tokens, use `.env` files: Add "envFile": "${workspaceFolder}/.env" and reference vars like "$GITHUB_PAT".

**Build from Source (No Docker):**
Clone repo: `git clone https://github.com/github/github-mcp-server`.
Build: `cd cmd/github-mcp-server && go build -o github-mcp-server`.
Run: `export GITHUB_PERSONAL_ACCESS_TOKEN=your_token && ./github-mcp-server stdio --toolsets=all`.
Config example:
```
{
  "servers": {
    "github": {
      "command": "/path/to/github-mcp-server",
      "args": ["stdio", "--toolsets=all"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}"
      }
    }
  }
}
```

#### Environment Variables Reference
These are passed via "env" in config or CLI. Prioritize minimum scopes for security.

| Variable | Required | Description | Example Value | Notes |
|----------|----------|-------------|---------------|-------|
| GITHUB_PERSONAL_ACCESS_TOKEN | Yes | Authenticates API calls. | ghp_... (40 chars) | Use inputs for security; rotate every 90 days. |
| GITHUB_TOKEN | Optional | Alias for above. | Same as above | For compatibility. |
| GITHUB_PAT | Optional | Another alias. | Same as above | Often used interchangeably. |
| GITHUB_HOST | Optional | For Enterprise setups. | https://your.ghe.com | Defaults to github.com. |
| GITHUB_READ_ONLY | Optional | Enables read-only mode (1=true). | 1 | Prevents writes; ideal for diffing. |
| GITHUB_TOOLSETS | Optional | Comma-separated toolsets (e.g., repos,issues). | all | Controls features; "default" includes diff essentials. |
| GITHUB_DYNAMIC_TOOLSETS | Optional | Enables beta dynamic tools (1=true). | 1 | For advanced diff analysis. |

#### Advanced Usage for Diffing
Once running, use tools like `git_diff` (via repos toolset) for comparisons. In Copilot Chat: "@github diff between commit ABC123 and tag v1.0."
- Branch/Tag Support: `list_branches`, `get_commit`.
- Fork Handling: `fork_repository`, cross-repo via APIs.
- Integration: Pair with AI for conflict resolution or reviews.
- Toolsets Table for Diffing:

| Toolset | Key Tools for Diffing | Use Case |
|---------|-----------------------|----------|
| repos | get_commit, pull_request_read, get_diff | Commit/branch diffs, PR changes. |
| issues | get_issue, list_comments | Contextual diffs in issues. |
| pull_requests | get_files, get_review_comments | Line-by-line PR diffs. |
| users | get_user_repos | Fork comparisons. |
| experiments | semantic_search (beta) | Advanced code diff analysis. |

For GitHub Enterprise, ensure host config; remote not supported for GHES.

#### Best Practices and Security
- Use read-only mode for diff-focused workflows.
- Store tokens securely: Inputs or .env (gitignore'd).
- Review logs for errors: In VS Code, MCP: Show Output.
- If issues persist: Check repo issues at [GitHub MCP Server](https://github.com/github/github-mcp-server/issues), or forums like Cursor/Reddit.
- Alternatives: If GitHub-specific not needed, try open-source like cyanheads/git-mcp-server for local Git ops without PAT.

This setup enables thorough diffing, reducing manual Git commands for complex comparisons.

**Key Citations:**
- [GitHub - github/github-mcp-server: GitHub's official MCP Server](https://github.com/github/github-mcp-server)<grok:render card_id="560f05" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render>
- [Use MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)<grok:render card_id="f43641" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render>
- [Setting up the GitHub MCP Server - GitHub Docs](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/set-up-the-github-mcp-server)<grok:render card_id="92a998" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render>
- [Using the GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/use-the-github-mcp-server)<grok:render card_id="cd856f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render>
- [GitHub's official MCP Server](https://github.com/github/github-mcp-server)<grok:render card_id="757253" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render>
- [Setting up the GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/set-up-the-github-mcp-server)<grok:render card_id="691172" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>
- [A practical guide on how to use the GitHub MCP server](https://github.blog/ai-and-ml/generative-ai/a-practical-guide-on-how-to-use-the-github-mcp-server/)<grok:render card_id="22d2f7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render>
- [Setting Up the Official GitHub MCP Server: A simple Guide](https://dev.to/debs_obrien/setting-up-the-official-github-mcp-server-a-simple-guide-707)<grok:render card_id="3de7ca" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render>
- [Use MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)<grok:render card_id="59058a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render>
