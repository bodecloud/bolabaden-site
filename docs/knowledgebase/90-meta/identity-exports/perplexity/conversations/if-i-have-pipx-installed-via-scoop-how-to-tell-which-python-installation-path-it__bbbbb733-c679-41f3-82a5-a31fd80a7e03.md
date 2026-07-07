---
source_url: "https://www.perplexity.ai/search/e51ef161-358c-4325-8def-91e9fdce7ebf"
thread_uuid: "bbbbb733-c679-41f3-82a5-a31fd80a7e03"
slug: "e51ef161-358c-4325-8def-91e9fdce7ebf"
title: "if i have pipx installed via scoop, how to tell which python installation path it points to"
extracted_at: "2026-06-29T16:09:09.820Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# if i have pipx installed via scoop, how to tell which python installation path it points to

Source: [Perplexity thread](https://www.perplexity.ai/search/e51ef161-358c-4325-8def-91e9fdce7ebf)

## User

if i have pipx installed via scoop, how to tell which python installation path it points to

## Assistant

To determine which Python installation path *pipx* points to when installed via Scoop on Windows, you can follow these steps:

1. **Check the `pipx` Batch Script**: When you install *pipx* using Scoop, it creates a batch script (`pipx.bat`) that determines which Python executable to use. This script typically checks for `python.exe` and `py.exe` in your system's PATH. You can inspect this script to see which Python executable it uses by default. The script is usually located in the directory where Scoop installs its applications (e.g., `C:\Users\<YourUsername>\scoop\apps\pipx\current\`).

2. **Use the `PIPX_DEFAULT_PYTHON` Environment Variable**: If you want to explicitly set which Python installation *pipx* should use, you can define the `PIPX_DEFAULT_PYTHON` environment variable with the full path to your desired Python executable. This setting overrides the default behavior of using `python.exe` or `py.exe`.[2]

3. **Check System PATH**: Ensure that the Python executable you want *pipx* to use is included in your system's PATH environment variable. You can check this by opening a command prompt and running:
   ```sh
   where python
   where py
   ```
   This will list the paths of `python.exe` and `py.exe` that are currently in your PATH.

4. **Inspect Pipx Environment**: You can also run a simple command to verify which Python interpreter *pipx* is using by creating a temporary virtual environment and checking its details:
   ```sh
   pipx run --spec=virtualenv virtualenv --python
   ```
   This command will show the path of the Python interpreter used by *pipx*.

By following these steps, you can determine and control which Python installation *pipx* uses on your system when installed via Scoop.

### Sources

- [Installation - pipx](https://pipx.pypa.io/stable/installation/)
  - execute binaries from Python packages in isolated environments
- [scoop: try to use py.exe to run pipx.pyz if python.exe is not found in ...](https://github.com/pypa/pipx/issues/1260)
  - This is not an issue with pipx, but relates to how pipx is installed with scoop on Windows. Describe the bug Installing pipx with scoop works (i.e., pipx gets installed), but the issue is that the ...
- [Command Line Reference Guide — Python Packaging Guide](https://www.pyopensci.org/python-package-guide/tutorials/command-line-reference.html)
  - Environment Setup:,, Description, Syntax,,, Set PowerShell execution policy (Windows), Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser,, Install Scoop (Windows), Invoke-RestMet...
