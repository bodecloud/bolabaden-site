---
source_url: "https://grok.com/c/c05a0b97-f7b6-45c4-8b14-9fec5a0bff08"
conversation_id: "c05a0b97-f7b6-45c4-8b14-9fec5a0bff08"
title: "Running GitHub Scripts with uv No pyproject.toml"
extracted_at: "2026-06-29T16:32:36.298Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Running GitHub Scripts with uv No pyproject.toml

Source: [Grok conversation](https://grok.com/c/c05a0b97-f7b6-45c4-8b14-9fec5a0bff08)

## User

_Time: 2026-02-11T09:05:28.477Z_

how to use uv to run a github.com project where the github repo does NOT have a pyproject.toml/setup.py. Your response must include a web article/reference that shows explicitly and highly specifically a uv command being used with a script that exists on github but WITHOUT requiring pyproject.toml/setup.py.
 
Be HIGHLY concise and show the exact syntax. Do not take no for an answer; continue searching until fully found. Assume it exists, because it does, and find it.

## Assistant

_Time: 2026-02-11T09:06:39.047Z_

**Key Points**  
- uv allows running a Python script directly from a GitHub raw URL without needing pyproject.toml or setup.py in the repository.  
- This works for single-file scripts hosted on GitHub.  
- The command fetches and executes the script in a managed environment.

**Exact Syntax**  
```
uv run https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path/to/script.py> [script-arguments]
```
- Use `/refs/heads/main` (or desired branch) for `<ref>` to enable proper caching; `--refresh` forces re-download if needed.

**Example**  
Run a simple script from a repo with only one Python file (no pyproject.toml or setup.py):  
```
uv run https://raw.githubusercontent.com/thejcannon/joshcannon.me/refs/heads/main/scripts/claudesay.py "Hello from uv!"
```

**Reference**  
This is explicitly demonstrated in the article "Remote Single-file Python Scripts with uv" by Josh Cannon (April 24, 2025), which shows the exact command and confirms no project metadata is required.

---

**Running GitHub Scripts with uv Without Project Files**  

uv provides a straightforward way to execute Python scripts hosted on GitHub when the repository lacks pyproject.toml or setup.py files. This is particularly useful for lightweight, single-file scripts shared via GitHub, as uv can fetch and run them directly from remote URLs without cloning the repository or installing it as a package.

The core feature relies on uv run supporting HTTP(S) URLs for Python scripts. When provided a raw GitHub URL, uv downloads the script temporarily, sets up a virtual environment if needed (e.g., for dependencies declared via PEP 723 inline metadata), and executes it. No local project configuration is necessary, and the remote repository does not need any build metadata.

 sized.

**Detailed Syntax and Options**  
The full command format is:  
```
uv run [uv-options] https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path/to/script.py> [script-arguments]
```

Common options include:  
- `--refresh`: Force re-download (useful for mutable refs like `main`).  
- `--with <package>`: Add temporary dependencies if not declared inline.  
- `-q`: Quiet mode to reduce output.

GitHub raw URLs typically follow this pattern:  
`https://raw.githubusercontent.com/<owner>/<repo>/<branch-or-ref>/<path/to/file.py>`

Using the full ref (`/refs/heads/main`) improves caching behavior, as noted in community discussions and guides.

**Real-World Example**  
A clear demonstration appears in Josh Cannon's blog post (April 2025):  

```
uv run -q --refresh https://raw.githubusercontent.com/thejcannon/joshcannon.me/refs/heads/main/scripts/claudesay.py 'Certainly!'
```

This executes `claudesay.py` from the repository, passing the argument `'Certainly!'`. The script runs without any local setup or project files in the repo.

Another minimal example repository is https://github.com/konstin/say-hi, which contains only `say-hi.py` (no pyproject.toml or setup.py). It can be run as:  
```
uv run https://raw.githubusercontent.com/konstin/say-hi/refs/heads/main/say-hi.py
```

**Limitations and Scope**  
- Best suited for self-contained single-file scripts.  
- Multi-file projects without pyproject.toml require cloning the repo first, then running `uv run script.py` locally (uv handles this without project metadata).  
- Scripts can declare dependencies inline using PEP 723 blocks, which uv respects automatically.

This approach eliminates manual environment management and works seamlessly for ad-hoc execution of GitHub-hosted scripts.

**Key Citations**  
- [Remote Single-file Python Scripts with uv – Josh Cannon (April 24, 2025)](https://joshcannon.me/2025/04/24/remote-single-file-scripts.html)  
- [uv Running Scripts Guide – Astral Documentation](https://docs.astral.sh/uv/guides/scripts/)  
- [Example Repository: konstin/say-hi (single-file script, no project files)](https://github.com/konstin/say-hi)
