---
source_url: "https://grok.com/c/38bf0eb1-bc7c-407f-a48d-918f0198b0f6"
conversation_id: "38bf0eb1-bc7c-407f-a48d-918f0198b0f6"
title: "Optimizing .cursorignore for LLM Efficiency"
extracted_at: "2026-06-29T16:18:31.721Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Optimizing .cursorignore for LLM Efficiency

Source: [Grok conversation](https://grok.com/c/38bf0eb1-bc7c-407f-a48d-918f0198b0f6)

## User

_Time: 2025-11-10T10:18:30.278Z_

For all the files here, determine what i probably want to add to .cursorignore. This is a file that syntactically is the same as .gitignore, but allows definitions for files that the LLM-based ai should NOT see. The attached pasted text file represents all the files the llm can currently see. Goal is to condense this to the absolute most frugal amount of lines physically possible without overstepping the requirement of showing as many relevant files as possible to the LLM for working with the codebase. What should we ignore?

## Assistant

_Time: 2025-11-10T10:19:05.097Z_

# .cursorignore contents

```
# Ignore all dotfiles and dotdirs except specific ones
.*
!.cursorrules
!.cursorrules.txt
!.gitignore
!.gitmodules

# Ignore build, compile, and packaging artifacts
compile/
*.pyc
__pycache__/
*.egg-info/
dist/
build/
*.whl
*.tar.gz

# Ignore CI/CD, workflows, and testing configs
.github/
tox.ini
.pre-commit-config.yaml
.flake8
.python-version

# Ignore IDE and editor configs
.vscode/
.cursor/

# Ignore documentation (inaccurate per rules; AI should avoid referencing)
docs/
wiki/

# Ignore install scripts (helper/utils, not core code)
install_*.ps1
install_*.sh

# Ignore tool-specific non-core files (e.g., web srcs, UIs, tests in tools)
Tools/*/web/
Tools/*/src/ui/
Tools/*/src/*/__tests__/
Tools/*/src/*/tests/
Tools/*/src/spyder-plugin/
Tools/*/src/*/help/
Tools/*/run_tests.sh
Tools/*/setup_dev.py
Tools/*/demo.sh
Tools/*/integration_test.py
Tools/*/LICENSE*
Tools/*/README.md
Tools/*/pyproject.toml
Tools/*/requirements.txt
Tools/*/recommended.txt
Tools/*/setup.py
Tools/*/HoloPatcher.code-workspace
Tools/*/KotorDiff.code-workspace

# Ignore engine examples and tests (non-core)
Engines/*/examples/
Engines/*/tests/
Engines/*/requirements.txt
Engines/*/setup.py

# Ignore library manifests and setups (packaging, not code)
Libraries/*/MANIFEST.in
Libraries/*/pyproject.toml
Libraries/*/recommended.txt
Libraries/*/requirements.txt
Libraries/*/setup.py
Libraries/*/PyKotor.code-workspace
Libraries/*/.vscode/
Libraries/*/LICENSE
```
