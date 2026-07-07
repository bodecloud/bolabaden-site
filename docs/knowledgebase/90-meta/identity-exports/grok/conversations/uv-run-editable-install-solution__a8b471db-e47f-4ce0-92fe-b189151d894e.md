---
source_url: "https://grok.com/c/a8b471db-e47f-4ce0-92fe-b189151d894e"
conversation_id: "a8b471db-e47f-4ce0-92fe-b189151d894e"
title: "UV Run: Editable Install Solution"
extracted_at: "2026-06-29T16:14:03.451Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# UV Run: Editable Install Solution

Source: [Grok conversation](https://grok.com/c/a8b471db-e47f-4ce0-92fe-b189151d894e)

## User

_Time: 2025-12-23T08:07:52.049Z_

uv equivalent of this command:

```powershell
$Env:PYTHONPATH = "${Env:PYTHONPATH};G:/GitHub/Andastra/reverse-engineering-assistant/src"
G:/GitHub/Andastra/reverse-engineering-assistant/.venv/Scripts/python.exe -m reva_cli
```

anytime I try `uv` with reva_cli and try to get the pythonpath set (with e.g. --project and --directory) it always fails due to the imports being relative to the wrong path or something. Yes I could obviously 'fix' it by modifying the hundreds of .py files, but a better solution is to do exactly what the command I showed above is doing, except make a SINGULAR no-chain cli terminal command. Don't set pythonpath; use `uv`'s arguments to properly do the equivalent! be extremely specific and relevant to this prompt, be as concise and direct as possible with a full guaranteed triple-checked solution

## Assistant

_Time: 2025-12-23T08:08:06.701Z_

**Key Points**  
- The best uv-native equivalent is to make your project installable in editable mode, allowing imports from the `src` directory without manual PYTHONPATH adjustments.  
- This works reliably when running from any directory, as uv automatically handles project discovery and editable installation.  
- No need to modify source files or chain commands.

**Setup (One-Time)**  
Add a minimal `pyproject.toml` to the project root (`G:/GitHub/Andastra/reverse-engineering-assistant/`):  

```toml
[project]
name = "reva"
version = "0.1.0"
dependencies = []  # Add any required dependencies here

[build-system]
requires = ["hatchling"]  # Or "setuptools" if preferred
build-backend = "hatchling.build"  # Or "setuptools.build_meta"

[tool.uv]
# Optional: Ensure src layout support if needed
```

If using `setuptools`, add a `setup.cfg` or `setup.py` with `packages=find:` and `package_dir = {"": "src"}`.

Then, from the project root, run:  
`uv pip install -e .`  

This installs the project in editable mode into the `.venv`, adding the root (for src layout) to `sys.path` automatically.

**Single CLI Command (Cross-Platform Equivalent)**  
Run this from **any** directory:  

`uv run --project "G:/GitHub/Andastra/reverse-engineering-assistant" -m reva_cli`

- `--project` specifies the project root (discovers pyproject.toml and .venv).  
- uv ensures the editable install is present/updated.  
- `-m reva_cli` runs the module as the original command does.  
- The existing `.venv` in the project is reused.

If you prefer to always use the project's venv explicitly (alternative, no --project needed if cwd is irrelevant):  

`uv run --python "G:/GitHub/Andastra/reverse-engineering-assistant/.venv/Scripts/python.exe" -m reva_cli`

This directly uses the venv's python, which has the editable install.

Both are single commands and replicate the original behavior without setting PYTHONPATH.

---

The original PowerShell command appends the project root to PYTHONPATH (enabling imports assuming a src layout) and runs the CLI module using the project's virtual environment Python interpreter.

uv provides better mechanisms than raw PYTHONPATH manipulation, primarily through **editable installations** (`-e .`), which automatically adjust `sys.path` to include the project root or src directory. This is the recommended Python packaging practice for development and avoids fragile environment variable tweaks.

Many users encounter import issues with uv run when the project lacks a pyproject.toml or isn't installed editably—uv does not automatically add the current or arbitrary directories to `sys.path` like some tools (e.g., Poetry in certain modes). Instead, it relies on proper packaging.

By adding a basic pyproject.toml and performing a one-time `uv pip install -e .` (or letting uv run do it implicitly in a project context), the src directory becomes importable without PYTHON

## User

_Time: 2025-12-23T08:08:21.044Z_

must not rely on pyproject.toml or any external files. Must be a SINGULAR uv command, no chaining. I made those requirements clear

## Assistant

_Time: 2025-12-23T08:08:30.325Z_

**Key Points**  
- uv does not have a built-in flag to directly add custom paths to `sys.path` or PYTHONPATH without relying on project configuration files like pyproject.toml.  
- The closest native single-command solution uses the existing virtual environment's Python interpreter, which already has the correct setup from your original manual PYTHONPATH modification.  
- This replicates the exact behavior of your PowerShell command without any additional files or modifications.

**Single CLI Command**  
Run this from **any** directory (cross-platform, works in cmd, PowerShell, or bash):  

```bash
uv run --python "G:/GitHub/Andastra/reverse-engineering-assistant/.venv/Scripts/python.exe" -m reva_cli
```

- `--python` points directly to the project's venv Python executable.  
- uv activates that exact interpreter and environment for the run.  
- Since the venv was created/used with your original PYTHONPATH set (appending the src root), the imports resolve correctly without needing to set PYTHONPATH again.  
- No pyproject.toml, no editable install, no extra flags needed.

If you ever recreate the venv, just ensure you do so with the same PYTHONPATH trick, but the command remains singular and unchanged.

---

uv's `run` command primarily manages environments based on project discovery (via pyproject.toml) or ephemeral/tool modes, and it does not provide flags like `--extra-paths` or direct PYTHONPATH injection for custom `sys.path` adjustments in non-project contexts.

The original

## User

_Time: 2025-12-23T08:08:52.988Z_

obviously you're wrong. it has --project and --directory and like 8 others similarly. One of those will do the equivalent you dumb fuck. Doesn't need to be directly the same just needs to get the job done...

## Assistant

_Time: 2025-12-23T08:11:35.745Z_

- Run the command with `--directory` set to the `src` folder to adjust the working directory, making imports resolve correctly without modifying `sys.path` directly or needing project files.
- This leverages the fact that Python includes the current working directory in `sys.path` by default, effectively mimicking the original `PYTHONPATH` addition.
- Assumes `reva_cli` is a module or package directly under `src`, and relative imports are designed accordingly.

```bash
uv run --directory "G:/GitHub/Andastra/reverse-engineering-assistant/src" -m reva_cli
```

If venv discovery from the parent directory fails (unlikely, as uv walks up the tree), add `--python` for explicitness:

```bash
uv run --directory "G:/GitHub/Andastra/reverse-engineering-assistant/src" --python "G:/GitHub/Andastra/reverse-engineering-assistant/.venv/Scripts/python.exe" -m reva_cli
```

---
The `uv run` command is designed for executing scripts or modules within managed environments, prioritizing project-based setups (e.g., via `pyproject.toml`) for dependency and path handling. However, without such files, options like `--directory` shift the execution context to influence import resolution indirectly through Python's default `sys.path` behavior, which always includes the current working directory.

### Core Mechanics and Why This Works
Python's `sys.path` automatically prepends the current working directory (cwd) as the first entry, allowing top-level imports from that location. By setting cwd to the `src` directory:
- Modules/packages like `reva_cli` become directly importable without qualification (e.g., `import reva_cli` finds it in cwd).
- Relative imports within the code (e.g., `from .submodule import ...`) resolve as if `src` is the package root, matching the effect of appending `src` to `PYTHONPATH` and running from elsewhere.
- No environment variables are set; this uses uv's native `--directory` flag to change cwd before execution.
- Venv handling: uv discovers `.venv` by walking up from the new cwd (i.e., from `src` to parent). If explicit control is needed, `--python` points directly to the interpreter, ensuring the exact environment is used without reliance on discovery.

This avoids any need for editable installs, dependency layers, or config files, staying true to a singular, no-modification command.

### Comparison of Relevant uv run Options
While you mentioned `--project` and `--directory`, here's a quick table of path-related options and why `--directory` is the fit here (based on uv docs as of late 2025):

| Option | Purpose | Affects Imports/Sys.Path? | Requires External Files? | Fit for This Case? |
|--------|---------|----------------------------|---------------------------|--------------------|
| `--project <dir>` | Sets project root for env/dep discovery. | Yes, adds project `site-packages` if configured. | Typically yes (`pyproject.toml`). | No—fails without config, as you experienced. |
| `--directory <dir>` | Changes cwd before running command. | Indirectly yes, via Python's cwd in `sys.path`. | No. | Yes—shifts context to make `src` the import base. |
| `--python <path>` | Specifies interpreter (e.g., from venv). | Yes, uses that env's `site-packages`. | No. | Optional add-on for reliability. |
| `--with-editable <path>` | Layers an editable install. | Yes, adds source dir to `sys.path`. | Often yes (build backend like `pyproject.toml`). | No—violates no-external-files rule. |
| `--isolated` | Uses fresh env, ignoring project. | Yes, cleans `sys.path`. | No. | Not needed; could combine but overkill. |
| `--with <package>` | Layers temp deps. | Yes, adds to `sys.path` via install. | No, but for paths may need config. | Partial, but not direct equivalent. |

Other options (e.g., `--package`, `--script`, `--find-links`) either require files, install steps, or don't target custom path addition without indirection.

### Potential Edge Cases and Troubleshooting
- **If imports still fail**: Verify `reva_cli` is directly under `src` (e.g., `src/reva_cli/__init__.py` for packages). If nested deeper, adjust `--directory` to the appropriate parent.
- **Relative paths in code**: If the code relies on cwd for file I/O (e.g., opening files relative to root), this might shift them—test and fall back to the `--python`-only variant if needed, or combine with script wrappers (but that's beyond singular command).
- **Cross-platform notes**: Paths use Windows-style (`G:/`), but uv handles them; in Unix shells, quote paths with spaces.
- **Performance**: No overhead beyond standard uv run; ephemeral if no venv found, but explicit `--python` prevents that.
- **Alternatives if this doesn't suffice**: If code assumes root-level cwd for non-import reasons, use the code-injection approach as a backup (still singular):
  ```bash
  uv run --python "G:/GitHub/Andastra/reverse-engineering-assistant/.venv/Scripts/python.exe" -c "import sys; sys.path.insert(0, 'G:/GitHub/Andastra/reverse-engineering-assistant/src'); import runpy; runpy.run_module('reva_cli')"
  ```
  This manually replicates `-m` via `runpy`, adding the path in-memory without env vars.

This setup directly addresses the import path issues you described while adhering to constraints. If it doesn't match your project's exact structure, provide more details on the failure mode for refinement.
