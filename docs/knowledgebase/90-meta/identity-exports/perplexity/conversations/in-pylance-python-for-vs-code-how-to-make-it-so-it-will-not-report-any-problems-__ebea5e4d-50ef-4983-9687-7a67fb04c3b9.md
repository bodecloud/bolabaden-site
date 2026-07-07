---
source_url: "https://www.perplexity.ai/search/c84519ef-8aec-4bb8-8acb-fd8dfb65df84"
thread_uuid: "ebea5e4d-50ef-4983-9687-7a67fb04c3b9"
slug: "c84519ef-8aec-4bb8-8acb-fd8dfb65df84"
title: "in pylance/python for vs code, how to make it so it will NOT report ANY problems whatsoever, is there a way to turn all of that off?"
extracted_at: "2026-06-29T16:09:09.811Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# in pylance/python for vs code, how to make it so it will NOT report ANY problems whatsoever, is there a way to turn all of that off?

Source: [Perplexity thread](https://www.perplexity.ai/search/c84519ef-8aec-4bb8-8acb-fd8dfb65df84)

## User

in pylance/python for vs code, how to make it so it will NOT report ANY problems whatsoever, is there a way to turn all of that off?

## Assistant

To disable all problem reporting by Pylance in Visual Studio Code, you can adjust the settings in your `settings.json` file. Here are the steps and settings you can use:

1. **Disable Type Checking**: Set the `python.analysis.typeCheckingMode` to `"off"`. This will turn off type-related diagnostics.
   ```json
   "python.analysis.typeCheckingMode": "off"
   ```

2. **Suppress Specific Diagnostics**: Use `python.analysis.diagnosticSeverityOverrides` to set specific diagnostics to `"none"`. This effectively disables those specific warnings or errors.
   ```json
   "python.analysis.diagnosticSeverityOverrides": {
       "reportMissingImports": "none",
       "reportUndefinedVariable": "none",
       // Add other diagnostics you want to suppress
   }
   ```

3. **Ignore All Diagnostics**: You can use the `python.analysis.ignore` setting to ignore all diagnostics. This is a more aggressive approach and might suppress useful warnings.
   ```json
   "python.analysis.ignore": ["*"]
   ```

4. **Limit Diagnostic Scope**: Set `python.analysis.diagnosticMode` to `"openFilesOnly"` if you want diagnostics only on files that are currently open, reducing the number of reported issues.
   ```json
   "python.analysis.diagnosticMode": "openFilesOnly"
   ```

Please note that while these settings can reduce or eliminate problem reporting, they may also hide potentially useful information that could help in identifying issues in your code. Additionally, syntax errors cannot be completely turned off as they are necessary for basic code functionality and features like autocompletion.[1][2][3]

### Sources

- [How to calm done Pylance : r/vscode - Reddit](https://www.reddit.com/r/vscode/comments/18k7se1/how_to_calm_done_pylance/)
- [Turn off `pyright` Linting · Issue #2995 · microsoft/pylance-release](https://github.com/microsoft/pylance-release/issues/2995)
  - I would like to turn off pyright linting and use mypy exclusively. I like the other features of the pylance language server (code formatting, debugging, testing, jupyter notebooks, environments, re...
- [Settings Reference for Python - Visual Studio Code](https://code.visualstudio.com/docs/python/settings-reference)
  - Settings Reference for the Python extension in Visual Studio Code
