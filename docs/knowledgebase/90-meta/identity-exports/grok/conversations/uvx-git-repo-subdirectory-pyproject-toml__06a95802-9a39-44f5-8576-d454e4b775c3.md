---
source_url: "https://grok.com/c/06a95802-9a39-44f5-8576-d454e4b775c3"
conversation_id: "06a95802-9a39-44f5-8576-d454e4b775c3"
title: "uvx Git Repo Subdirectory pyproject.toml"
extracted_at: "2026-06-29T16:11:36.954Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# uvx Git Repo Subdirectory pyproject.toml

Source: [Grok conversation](https://grok.com/c/06a95802-9a39-44f5-8576-d454e4b775c3)

## User

_Time: 2026-01-30T01:21:26.910Z_

how to use uvx (aka: `uv tool run`) for a git repo url, for a repo that contains pyproject.toml in a subdirectory on the repo? for example I can do:
`uvx --verbose --from git+https://github.com/bolabaden/agentdecompile mcp-agentdecompile` because the agentdecompile repo has a pyproject.toml in the repo root containing a section named [project.scripts] with the contents `mcp-agentdecompile = "agentdecompile_cli.__main__:main"` allowing it to work.
 
I want a similar solution for a repo that contains pyproject.toml in a subfolder instead of the root of the repo. How to specify??? search web for a solution, solution must be highly specific to (uv tool run OR uvx) AND 'subfolder pyproject.toml of a git repo'.

## Assistant

_Time: 2026-01-30T01:22:48.446Z_

**Key Points**

- **Primary Method**: Append `#subdirectory=<path-to-subdir>` to the Git URL in the `--from` option of `uvx` (or `uv tool run`). This follows PEP 508 standards for direct references, allowing uv to locate the `pyproject.toml` in a subdirectory.
- **Correct Syntax**: Use `#subdirectory=` (exact key name); variations like `#subfolder=` or `#subdir=` will fail.
- **Full Command Structure**: `uvx --from git+https://github.com/user/repo#subdirectory=path/to/subdir script-name`, where `script-name` is the console script defined in the subdirectory's `[project.scripts]`.
- **Branch/Commit Pinning**: Optionally add `@branch` or `@rev` before the `#`, e.g., `git+https://github.com/user/repo@main#subdirectory=path/to/subdir`.
- **Evidence**: This is supported in uv, as confirmed by official documentation for similar commands (e.g., `uv add`) and resolved GitHub issues specifically for `uvx`.

**How It Works**

uv resolves the `--from` requirement using the same PEP 508 direct URL syntax as pip and other uv commands. When a `#subdirectory=` fragment is present, uv checks out the Git repository and treats the specified subdirectory as the project root, finding the `pyproject.toml` there. This enables discovery of `[project.scripts]` entrypoints for tool execution in a temporary environment.

**Examples**

- Root-level (your working case):  
  `uvx --verbose --from git+https://github.com/bolabaden/agentdecompile mcp-agentdecompile`

- Subdirectory equivalent:  
  `uvx --verbose --from git+https://github.com/user/repo#subdirectory=tools/mytool mytool-script`

- With specific branch:  
  `uvx --from git+https://github.com/user/repo@main#subdirectory=tools/mytool mytool-script`

**Potential Limitations**

Older uv versions had issues combining subdirectory with branch/rev pinning, but these were largely resolved by early 2025. Always use the latest uv version for best compatibility.

---

**uvx for Git Repositories with Subdirectory Projects: Detailed Guide**

The uv tool runner (`uvx` or `uv tool run`) provides a fast, isolated way to execute Python console scripts without permanent installation, similar to pipx but significantly quicker. When the target package's `pyproject.toml` resides in the repository root, direct Git URLs work seamlessly, as in your example with `agentdecompile`. However, many repositories—especially monorepos—organize multiple projects in subdirectories, each with its own `pyproject.toml`. uv handles this through standard PEP 508 direct URL syntax, allowing precise targeting of subprojects.

**Core Mechanism: PEP 508 Direct URLs**

uv's dependency resolution, including for ephemeral tool runs, supports PEP 508 requirement specifiers. For VCS (Version Control System) sources like Git, the URL format is:

`git+https://host/user/repo[@ref]#subdirectory=path`

- The optional `@ref` pins to a branch, tag, or commit (defaults to the repository's default branch).
- The `#subdirectory=` fragment instructs uv to treat the specified path as the project root after cloning.

This syntax originated in pip and is adopted by uv for consistency across commands like `uv add`, `uv pip install`, and `uvx --from`. When uv processes the requirement, it:
1. Clones the repository (cached for efficiency).
2. Changes context to the subdirectory.
3. Locates and reads `pyproject.toml`.
4. Discovers entrypoints from `[project.scripts]` or `[project.entry-points.console_scripts]`.
5. Builds and runs the tool in an isolated environment.

**Verified Syntax and Examples**

Official documentation demonstrates subdirectory support for dependency addition:

`uv add git+https://github.com/langchain-ai/langchain#subdirectory=libs/langchain`

The same format applies directly to `uvx`:

`uvx --from git+https://github.com/saulpw/visidata#subdirectory=visidata/apps/vdsql vdsql`

This installs and runs the `vdsql` tool from Visidata's monorepo subdirectory.

Adapting your example:

| Scenario                  | Command                                                                 | Notes                                      |
|---------------------------|-------------------------------------------------------------------------|--------------------------------------------|
| Root pyproject.toml       | `uvx --from git+https://github.com/bolabaden/agentdecompile mcp-agentdecompile` | Works as you described                     |
| Subdirectory (e.g., "cli/") | `uvx --from git+https://github.com/user/repo#subdirectory=cli mcp-agentdecompile` | Assumes pyproject.toml in repo/cli/        |
| With branch pinning       | `uvx --from git+https://github.com/user/repo@main#subdirectory=cli mcp-agentdecompile` | Pins to main branch                        |
| Verbose for debugging     | `uvx --verbose --from git+https://github.com/user/repo#subdirectory=cli mcp-agentdecompile` | Shows resolution steps                     |

**Common Pitfalls and Resolutions**

- **Wrong fragment key**: Using `#subfolder=` or `#subdir=` fails because uv expects exactly `subdirectory`. This caused errors in early user reports but is easily fixed.
- **Branch + subdirectory order**: In older uv versions (pre-2025), combining `@branch` and `#subdirectory=` sometimes failed due to checkout order. Current versions handle this correctly.
- **Missing pyproject.toml**: If the subdirectory lacks a valid `pyproject.toml` with entrypoints, uv will error—ensure the subproject is properly configured.
- **Caching**: uv caches Git clones; use `uv cache clean` if testing changes.

**Historical Context and Community Confirmation**

Community discussions on uv's GitHub repository confirmed this feature. An issue requesting subdirectory support for tools was resolved by pointing to the existing PEP 508 syntax, with examples proving it works for `uvx`. Another report of failure was traced directly to using an incorrect key (`subfolder` instead of `subdirectory`). These resolutions, from early 2025, indicate mature support in current uv releases (as of 2026).

This approach maintains uv's performance advantages—no full repository installation required—and aligns with modern Python packaging best practices.

**Key Citations**

- [Managing dependencies | uv - Astral Docs](https://docs.astral.sh/uv/concepts/projects/dependencies/)
- [Support installing a tool from a subdirectory of a git repo · Issue #10728 · astral-sh/uv](https://github.com/astral-sh/uv/issues/10728)
- [uvx git+.. failing when trying to run a package from a subfolder. · Issue #12713 · astral-sh/uv](https://github.com/astral-sh/uv/issues/12713)
- [Adding Git repo at subdirectory that points to source in ... - GitHub](https://github.com/astral-sh/uv/issues/9516)
- [Packaging Python Command-Line Apps the Modern Way with uv](https://thisdavej.com/packaging-python-command-line-apps-the-modern-way-with-uv)

## User

_Time: 2026-01-30T01:29:39.636Z_

how to use uvx (aka: `uv tool run`) for a git repo url, for a repo that contains pyproject.toml in a subdirectory on the repo? for example I can do:
`uvx --verbose --from git+https://github.com/bolabaden/agentdecompile mcp-agentdecompile` because the agentdecompile repo has a pyproject.toml in the repo root containing a section named [project.scripts] with the contents `mcp-agentdecompile = "agentdecompile_cli.__main__:main"` allowing it to work.
 
I want a similar solution for a repo that contains pyproject.toml in a subfolder instead of the root of the repo. How to specify??? search web for a solution, solution must be highly specific to (uv tool run OR uvx) AND 'subfolder pyproject.toml of a git repo'.

Similarly, curious if it's possible to run a python project with `uv tool run` / `uvx` without using the repo's pyproject.toml, can i specify in the command itself inline the section of `[project.scripts]` necessary and if so how? assume it's possible.

## Assistant

_Time: 2026-01-30T01:31:48.491Z_

**Key Points**  
- **uvx** (alias for `uv tool run`) supports running tools from Git repositories where `pyproject.toml` is in a subdirectory using the syntax `git+https://...#subdirectory=path/to/subdir`.  
- Use `--from` with the Git URL including `#subdirectory=...`, followed by the entrypoint name defined in `[project.scripts]`.  
- It is not possible to inline a `[project.scripts]` section directly in the `uvx` command; entrypoints come from the package's metadata.  
- To run code without a `[project.scripts]` entrypoint, install the package temporarily (via `--with` or `--from`) and execute via `python -m module` or `python -c`.  

**Running Tools from Git Repos with Subdirectory pyproject.toml**  
The standard syntax for root-level repos (like your example) works because `pyproject.toml` is found at the repository root. When it's in a subfolder, append `#subdirectory=<path>` to the Git URL in the `--from` specifier. This follows uv's support for PEP 508-style Git dependencies, allowing uv to locate and build the package from the subdir.  

Example command:  
```bash
uvx --from git+https://github.com/user/repo#subdirectory=path/to/subdir mcp-agentdecompile
```  
Replace `path/to/subdir` with the actual subfolder containing `pyproject.toml`, and `mcp-agentdecompile` with the script name from `[project.scripts]`. Branch specification (e.g., `@main`) can be added before the `#` if needed, though combined usage may have edge cases in older uv versions.  

**Running Without a [project.scripts] Section**  
uvx relies on installed package metadata for entrypoints, so you cannot define `[project.scripts]` inline in the command. Instead, temporarily install the package from Git (supporting subdirectories the same way) and run the code directly with Python.  

Common approaches:  
- Run a module: `uvx --with git+https://github.com/user/repo#subdirectory=path/to/subdir -- python -m package.cli`  
- Call a function explicitly: `uvx --with git+https://github.com/user/repo#subdirectory=path/to/subdir -- python -c "from package.cli import main; main()"`  

This creates an isolated environment, installs the package, and executes the desired code.  

---

**Detailed Overview of uvx for Git-Based Tools**  

uvx provides a fast way to run Python tools in isolated environments without permanent installation. It excels at one-off executions, automatically handling dependencies and entrypoints from packages. For Git repositories, uv supports direct installation and execution, including cases where `pyproject.toml` is not in the root.  

**Git Subdirectory Support**  
uv handles Git dependencies with subdirectory specification using the `#subdirectory=` fragment. This works for `--from` in uvx because uv resolves the requirement, checks out the repo, and builds the package from the specified subfolder where `pyproject.toml` exists. Once built, uv reads the `[project.scripts]` (or `[project.entry-points]`) to expose console scripts.  

| Scenario | Command Example | Explanation |
|----------|-----------------|-------------|
| Root-level pyproject.toml | `uvx --from git+https://github.com/bolabaden/agentdecompile mcp-agentdecompile` | Standard case; uv finds pyproject.toml at root. |
| Subdirectory pyproject.toml | `uvx --from git+https://github.com/user/repo#subdirectory=tools/mytool mcp-mytool` | `#subdirectory=` points uv to the subfolder; entrypoint `mcp-mytool` is used. |
| With specific branch | `uvx --from git+https://github.com/user/repo@main#subdirectory=tools/mytool mytool` | Branch `@main` before `#`; works in recent uv versions. |
| Temporary deps + subdir | `uvx --with "git+https://github.com/user/repo#subdirectory=tools/mytool" -- python -m mytool.cli` | Useful when no entrypoint exists. |

This syntax is confirmed in uv issue discussions and aligns with dependency management docs.  

**Limitations and Edge Cases**  
- The subdir must contain a valid `pyproject.toml` with `[project]` metadata and entrypoints.  
- Combining branch and subdirectory can occasionally fail in older uv versions; update uv if issues arise.  
- Large repos may slow down due to full checkout (uv caches results).  

**Running Code Without Defined Entrypoints**  
Without `[project.scripts]`, no console script is generated, so uvx cannot auto-discover a command name. However, uvx's flexible environment creation allows manual execution:  

1. Use `--with` (or `--from`) to install the Git package temporarily.  
2. Append `--` followed by the Python invocation.  

| Goal | Command Example | Notes |
|------|-----------------|-------|
| Run module as script | `uvx --with git+https://github.com/user/repo#subdirectory=sub -- python -m package.__main__` | Assumes `if __name__ == "__main__":` block. |
| Call function directly | `uvx --with git+https://github.com/user/repo#subdirectory=sub -- python -c "from package.cli import main; main()"` | Bypasses entrypoint entirely. |
| Interactive REPL with package | `uvx --with git+https://github.com/user/repo#subdirectory=sub -- python` | Drops into interpreter with package importable. |

This approach keeps isolation and dependency resolution while working around missing entrypoints. For frequent use, consider adding `[project.scripts]` to the repo's `pyproject.toml`.  

**Comparison to Other Tools**  
- Like pipx run, but faster and with better Git/subdir handling in recent versions.  
- Unlike `uv run` (for local scripts with inline metadata), uvx focuses on published-style tools but remains flexible for arbitrary commands via `--with` and `--`.  

**Key Citations**  
- [Support installing a tool from a subdirectory of a git repo · Issue #10728 · astral-sh/uv](https://github.com/astral-sh/uv/issues/10728)  
- [Commands | uv - Astral Docs](https://docs.astral.sh/uv/reference/cli/)  
- [Running scripts | uv - Astral Docs](https://docs.astral.sh/uv/guides/scripts/)  
- [Managing dependencies | uv - Astral Docs](https://docs.astral.sh/uv/concepts/projects/dependencies)  
- [Adding Git repo at subdirectory that points to source in ... - GitHub](https://github.com/astral-sh/uv/issues/9516)  
- [uvx git+.. failing when trying to run a package from a subfolder. #12713](https://github.com/astral-sh/uv/issues/12713)
