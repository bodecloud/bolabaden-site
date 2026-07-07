---
source_url: "https://grok.com/c/8d5c3111-bfe8-4cfa-a72e-e671e60f4b82"
conversation_id: "8d5c3111-bfe8-4cfa-a72e-e671e60f4b82"
title: "uvx Git Repo Subdirectory pyproject.toml"
extracted_at: "2026-06-29T16:32:41.580Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# uvx Git Repo Subdirectory pyproject.toml

Source: [Grok conversation](https://grok.com/c/8d5c3111-bfe8-4cfa-a72e-e671e60f4b82)

## User

_Time: 2026-01-30T01:21:16.924Z_

how to use uvx (aka: `uv tool run`) for a git repo url, for a repo that contains pyproject.toml in a subdirectory on the repo? for example I can do:
`uvx --verbose --from git+https://github.com/bolabaden/agentdecompile mcp-agentdecompile` because the agentdecompile repo has a pyproject.toml in the repo root containing a section named [project.scripts] with the contents `mcp-agentdecompile = "agentdecompile_cli.__main__:main"` allowing it to work.
 
I want a similar solution for a repo that contains pyproject.toml in a subfolder instead of the root of the repo. How to specify??? search web for a solution, solution must be highly specific to (uv tool run OR uvx) AND 'subfolder pyproject.toml of a git repo'.

## Assistant

_Time: 2026-01-30T01:23:06.094Z_

The recommended way to run a tool via `uvx` (or `uv tool run`) from a Git repository where the `pyproject.toml` is in a subdirectory is to append the `#subdirectory=<relative-path>` fragment to the Git URL. This follows PEP 508 URL syntax, which `uv` supports for dependency specifications.

- **Specify the subdirectory in the URL**: The path should be relative to the repository root, pointing to the folder with the `pyproject.toml` that defines the project scripts.
- **Command structure**: Use `uvx --from git+https://github.com/<user>/<repo>#subdirectory=<path/to/subdir> <tool-name>`, where `<tool-name>` matches the entry point in `[project.scripts]`.
- **Verification needed**: Test the URL first, as incorrect paths may cause `uv` to report missing project files like `pyproject.toml`.

### Basic Syntax and Example
To adapt your working example for a hypothetical repository where `pyproject.toml` is in a subfolder like `src/agent`, the command would be:
```
uvx --verbose --from git+https://github.com/bolabaden/agentdecompile#subdirectory=src/agent mcp-agentdecompile
```
This tells `uv` to look in the `src/agent` subdirectory for the project metadata and scripts.<grok:render card_id="b5c7bb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="0b131d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render><grok:render card_id="533478" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>

### Common Pitfalls
If the command fails with errors like "no pyproject.toml or setup.py found," double-check the subdirectory path—it's case-sensitive and must be exact.<grok:render card_id="7689d7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> You can combine this with Git references like branches or commits, e.g., `#subdirectory=<path>&ref=<branch>`.<grok:render card_id="a2cb79" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render>

### Alternatives
If the subdirectory approach doesn't fit (e.g., due to complex monorepos), consider cloning the repo locally and using `uvx --from . --project <subdir> <tool-name>` from the root, but this defeats the direct Git URL convenience.<grok:render card_id="04da0e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render>

---

In the evolving landscape of Python package management, tools like `uv` from Astral have revolutionized workflows with their speed and integration of Rust-based efficiency. One particularly nuanced use case involves running command-line tools via `uvx` (a shorthand for `uv tool run`) directly from Git repositories, especially when the project's configuration file, `pyproject.toml`, resides not at the repository root but in a subdirectory. This scenario is common in monorepos or modular projects where multiple packages are housed under a single Git repository, and it requires precise syntax to ensure `uv` correctly identifies and installs the tool's environment temporarily for execution.

At its core, `uvx` allows users to invoke Python tools without persistent installation by creating an ephemeral virtual environment, resolving dependencies, and running the specified entry point. For Git-based sources, `uv` leverages PEP 508 direct URL requirements, which standardize how version control system (VCS) dependencies are specified.<grok:render card_id="643984" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render> This includes support for Git URLs prefixed with `git+`, optional references like branches or commits, and fragments for additional directives such as subdirectories. The `#subdirectory=<path>` fragment is key here, as it instructs the resolver to navigate to the specified relative path within the cloned repository to locate the `pyproject.toml` file, which must contain the `[project]` metadata and, crucially, the `[project.scripts]` section defining console entry points.<grok:render card_id="1e0b43" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render>

For instance, in your provided example, `uvx --verbose --from git+https://github.com/bolabaden/agentdecompile mcp-agentdecompile` succeeds because the `agentdecompile` repository has its `pyproject.toml` at the root, with an entry like `mcp-agentdecompile = "agentdecompile_cli.__main__:main"` under `[project.scripts]`. To extend this to a repository where `pyproject.toml` is nested, say in a subdirectory `tools/decompiler`, the adjusted command becomes `uvx --verbose --from git+https://github.com/bolabaden/agentdecompile#subdirectory=tools/decompiler mcp-agentdecompile`.<grok:render card_id="2b8a1a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render> Here, the `#subdirectory=tools/decompiler` tells `uv` to treat that subfolder as the project root for resolution and installation purposes. Without this, `uv` would scan the repository root and fail if no `pyproject.toml` or fallback `setup.py` is present, raising errors like "does not appear to be a Python project."<grok:render card_id="5a4fbf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>

This functionality isn't unique to `uvx`; it's inherited from `uv`'s broader dependency management system, as seen in commands like `uv add` for project dependencies.<grok:render card_id="82f037" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render> For example, adding a Git dependency to a project's `pyproject.toml` might look like `uv add git+https://github.com/langchain-ai/langchain#subdirectory=libs/langchain`, which updates the `[tool.uv.sources]` section accordingly.<grok:render card_id="ad0bde" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render> The parallelism arises because `uv tool run` (and thus `uvx`) performs a similar temporary installation, resolving the tool as if it were a dependency. Community discussions, such as those on GitHub issues, confirm this works for `uvx` as well, with syntax like `uvx git+https://github.com/RonanKMcGovern/uv-subfolder#subdirectory=subfolder-test` succeeding after correcting common typos (e.g., `subfolder` vs. `subdirectory`).<grok:render card_id="98a9dc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>

However, real-world applications reveal potential challenges. In monorepos, subpackages might not resolve automatically if they rely on relative paths or workspace configurations, requiring explicit additions or workarounds like local editable installs.<grok:render card_id="1a6f16" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render> For instance, if a subdirectory depends on another subpackage in the same repo, `uv` might not fetch it unless declared separately, potentially leading to inconsistencies.<grok:render card_id="9e6ac2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render> Additionally, combining subdirectory with other PEP 508 fragments, such as `@branch` for specific refs, follows the format `git+https://github.com/user/repo@branch#subdirectory=sub/dir`.<grok:render card_id="c4f4bb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render> But issues can arise with Git tags or commits if the subdirectory lacks proper metadata, as noted in cases where `uv pip install` fails with workspace-related errors.<grok:render card_id="21a527" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render>

To illustrate variations and best practices, consider the following table summarizing command formats for different scenarios:

| Scenario | Command Example | Notes |
|----------|-----------------|-------|
| Root-level `pyproject.toml` | `uvx --from git+https://github.com/user/repo tool-name` | Standard case; no subdirectory needed.<grok:render card_id="a9b8cc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render> |
| Subdirectory with branch | `uvx --from git+https://github.com/user/repo@develop#subdirectory=src/pkg tool-name` | Combines ref and subdir; use `&` if more fragments.<grok:render card_id="dd5c7e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render> |
| Direct Git URL without `--from` | `uvx git+https://github.com/user/repo#subdirectory=sub/dir` | Implies the tool name from project metadata; useful if entry point matches package name.<grok:render card_id="e9bd98" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render> |
| Local clone fallback | `git clone https://github.com/user/repo && cd repo && uvx --project sub/dir tool-name` | Avoids network but requires manual steps; equivalent to `--project` for local paths.<grok:render card_id="30767e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render> |
| With optional dependencies skip | `uvx --from git+...#subdirectory=... --no-deps tool-name` | Not directly supported for optionals, but `--no-deps` skips all; edit `pyproject.toml` post-clone if needed.<grok:render card_id="cae89c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render> |

Beyond syntax, performance considerations make `uv` appealing: its resolver handles Git sources efficiently, caching downloads and avoiding redundant fetches.<grok:render card_id="e6c651" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render> For advanced users, integrating this with `uv`'s lockfiles ensures reproducibility, though for ephemeral `uvx` runs, no lockfile is generated. If issues persist, community resources like Astral's GitHub issues highlight ongoing improvements, such as better support for subdirectories in tools like `vdsql` from the `visidata` repo, where the path `visidata/apps/vdsql` required exact matching.<grok:render card_id="2f0b0f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="9a5e56" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render> In cases of failure, alternatives include using `uv tool install` for persistent global installation, which supports the same Git syntax but creates a dedicated environment under `~/.local/share/uv/tools`.<grok:render card_id="1c7355" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>

Ultimately, while `uv`'s documentation may not explicitly cover Git subdirectories for `uvx` in every section, practical usage and PEP compliance ensure reliability.<grok:render card_id="90aadc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render><grok:render card_id="fc1319" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render> For the most up-to-date verification, testing with a minimal reproducible repo is advised, as `uv` continues to iterate on edge cases in monorepo and VCS integrations.

### Key Citations:
- [Support installing a tool from a subdirectory of a git repo #10728](https://github.com/astral-sh/uv/issues/10728)
- [Managing dependencies | uv - Astral Docs](https://docs.astral.sh/uv/concepts/projects/dependencies)
- [uvx install tool from GitHub repo and skip optional dependencies?](https://www.reddit.com/r/learnpython/comments/1lmpbtu/question_uv_uvx_install_tool_from_github_repo_and)
- [uvx git+.. failing when trying to run a package from a subfolder. #12713](https://github.com/astral-sh/uv/issues/12713)
- [uv Package Manager for Python - Medium](https://medium.com/@nimritakoul01/uv-package-manager-for-python-f92c5a760a1c)
- [How do I make a script accessible across all directories within a ...](https://stackoverflow.com/questions/79591637/how-do-i-make-a-script-accessible-across-all-directories-within-a-python-monorep)
- [Ultimate guide to uv library in Python - Deepnote](https://deepnote.com/blog/ultimate-guide-to-uv-library-in-python)
- [Unable to install subdirectory using uv pip install with a git tag #6093](https://github.com/astral-sh/uv/issues/6093)
- [Managing dependencies | uv - Astral Docs](https://docs.astral.sh/uv/concepts/projects/dependencies)
- [Commands | uv](https://docs.astral.sh/uv/reference/cli/#uv-tool-run)
- [Tools | uv](https://docs.astral.sh/uv/concepts/tools/)
- [Support installing a tool from a subdirectory of a git repo · Issue #10728 · astral-sh/uv](https://github.com/astral-sh/uv/issues/10728)
