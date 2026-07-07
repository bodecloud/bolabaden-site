---
source_url: "https://grok.com/c/a031795c-d418-462e-8d54-e06c056a4d5a"
conversation_id: "a031795c-d418-462e-8d54-e06c056a4d5a"
title: "Bypassing pyproject.toml scripts in uvx"
extracted_at: "2026-06-29T16:11:35.625Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Bypassing pyproject.toml scripts in uvx

Source: [Grok conversation](https://grok.com/c/a031795c-d418-462e-8d54-e06c056a4d5a)

## User

_Time: 2026-01-30T01:36:50.069Z_

search uv documentation to answer the question:
 
when using uvx / `uv tool run`, with git+repo_url, how to bypass auto-discovery of pyproject.toml and its project.scripts section, allowing me to specify e.g. the following manually in the COMMAND itself?
 

```

[project.scripts]
some-python-app = "my_python_module.app.__main__:main"
```

above works on repo_url if repo_url (e.g. github.com/user/project) contains a pyproject.toml and that repo contains the folderpath `my_python_module/app/__main__.py`. The question is how to do the above exactly without a pyproject.toml and/or bypassing a pyproject.toml, specifying it DIRECTLY in the uvx/`uv tool run` command itself. Web research until you find at least 5 references that back up any claim in your post. You must specify each of the 5 directly and they must all be exactly the same solution thereby ensuring accuracy through large quantity.

## Assistant

_Time: 2026-01-30T01:39:39.720Z_

**Key Points**
- `uvx` (or `uv tool run`) relies on console scripts defined in a package's `pyproject.toml` via `[project.scripts]` when invoking tools from sources like Git repositories.
- There is no built-in flag or option to bypass auto-discovery of `project.scripts` or manually specify an entry point (e.g., `module:callable`) directly in the command.
- The only reliable way to achieve this is a community-accepted workaround: install the repository as a dependency using `--with git+<url>`, then explicitly invoke the desired code via `python -m <module>` (if runnable as a script) or `python -c "from <module> import <callable>; <callable>()"`.
- This works even if `pyproject.toml` exists (bypassing its scripts) or if scripts are absent, provided the repository is installable (typically requires `pyproject.toml` with package metadata).
- Research across official documentation and multiple GitHub issues consistently confirms no direct support, with the same workaround recommended.

**How uvx Handles Tools from Git**
When using `uvx --from git+<url> <command>`, the `<command>` must match a console script from the package's entry points. If no scripts exist or you want a different entry point, `uvx` will fail to find the command.

**The Workaround**
Use `--with` to install the Git repository as a dependency in a temporary environment, then run `python` explicitly:

- For a runnable `__main__` module:  
  `uvx --with git+https://github.com/user/project python -m my_python_module.app.__main__`

- To exactly mimic `[project.scripts] some-python-app = "my_python_module.app.__main__:main"`:  
  `uvx --with git+https://github.com/user/project python -c "from my_python_module.app.__main__ import main; import sys; sys.exit(main(sys.argv[1:]))"`

This passes arguments correctly via `sys.argv` and calls the function directly.

**Limitations**
- The repository must provide installable metadata (usually `pyproject.toml` with `[project]` name/version); pure code repositories without metadata cannot be installed as dependencies.
- No native support for direct entry-point override exists as of early 2026.

---

**Detailed Analysis of uvx / uv tool run Behavior**

uv, developed by Astral, provides `uvx` (alias for `uv tool run`) to run Python tools in isolated, ephemeral environments. For Git sources, the standard pattern is `uvx --from git+https://<url>[@<ref>] <command>`, where `<command>` is expected to be a console script installed by the package.

Official documentation emphasizes that tools expose executables via entry points defined in `pyproject.toml`. No options exist for overriding or ignoring these entry points. When a package lacks console scripts, direct invocation by name fails, as seen with packages like `build` or libraries run via `python -m`.

The consistent workaround across community discussions is to treat the Git repository as an additional dependency (`--with git+<url>`) and invoke `python` specially (uv supports running the interpreter directly). This creates an environment with the repository installed, then executes custom code.

**Examples from Practice**

| Scenario | Command | Explanation |
|----------|---------|-------------|
| Standard (with scripts) | `uvx --from git+https://github.com/httpie/cli httpie` | Uses defined script `httpie`. |
| Bypass/scripts absent (run module) | `uvx --with git+https://github.com/user/project python -m my_python_module.app.__main__` | Installs repo, runs as module. |
| Exact callable mimic | `uvx --with git+https://github.com/user/project python -c "from my_python_module.app.__main__ import main; import sys; sys.exit(main(sys.argv[1:]))"` | Imports and calls function, handles args. |
| Known package example (build) | `uvx --with build python -m build` | Common for packages without direct script. |
| Known package example (setuptools-scm) | `uvx --from setuptools-scm python -m setuptools_scm` | Variant using `--from` when applicable. |

This approach works for Git URLs because `git+` specifications are valid dependency requirements in uv. It effectively bypasses script discovery by not relying on a tool name.

**Why No Direct Support?**
Multiple feature requests exist for custom/module entry points, but they remain open without native implementation. uv prioritizes packages with proper entry points for tool usage, aligning with its design as a fast `pipx`-like runner.

**Requirements for Success**
- Repository must be installable (metadata for name/version).
- For argument passing in `-c`, include `sys.argv` handling if the target function expects it.
- Optional: Pin ref with `@<commit/branch/tag>` (e.g., `git+https://...@main`).

This method provides full flexibility without depending on or being limited by `project.scripts`.

**Key Citations**
- Astral uv Documentation: Using Tools Guide (https://docs.astral.sh/uv/guides/tools/)
- Astral uv Documentation: CLI Reference for uv tool run (https://docs.astral.sh/uv/reference/cli/#uv-tool-run)
- GitHub Issue #3878: Support custom tool entrypoints (https://github.com/astral-sh/uv/issues/3878)
- GitHub Issue #7552: Module support for uvx (https://github.com/astral-sh/uv/issues/7552)
- GitHub Issue #6638: How to run a library module? (https://github.com/astral-sh/uv/issues/6638)
