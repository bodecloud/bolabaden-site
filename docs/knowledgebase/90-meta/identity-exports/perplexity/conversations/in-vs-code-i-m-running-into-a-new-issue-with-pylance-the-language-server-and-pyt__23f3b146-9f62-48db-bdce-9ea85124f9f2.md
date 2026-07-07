---
source_url: "https://www.perplexity.ai/search/5d9b51d1-e3d0-49fb-8353-e1481db92682"
thread_uuid: "23f3b146-9f62-48db-bdce-9ea85124f9f2"
slug: "5d9b51d1-e3d0-49fb-8353-e1481db92682"
title: "in vs code i'm running into a new issue with pylance, the language server, and python. I no longer have any 'auto import' functionality. Both my entire codebase, and my pip packages, are not accessible. I am unsure what change I made that broke it."
extracted_at: "2026-06-29T16:18:25.530Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# in vs code i'm running into a new issue with pylance, the language server, and python. I no longer have any 'auto import' functionality. Both my entire codebase, and my pip packages, are not accessible. I am unsure what change I made that broke it.

Source: [Perplexity thread](https://www.perplexity.ai/search/5d9b51d1-e3d0-49fb-8353-e1481db92682)

## User

in vs code i'm running into a new issue with pylance, the language server, and python. I no longer have any 'auto import' functionality. Both my entire codebase, and my pip packages, are not accessible. I am unsure what change I made that broke it.

## Assistant

It seems you're experiencing an issue with Pylance's auto-import functionality in Visual Studio Code. This is a common problem that can occur due to various reasons. Let's go through some potential solutions:

## Check Auto Import Settings

First, ensure that auto-imports are enabled in your VS Code settings:

1. Open VS Code settings (File > Preferences > Settings or Ctrl+,)
2. Search for "python.analysis.autoImportCompletions"
3. Make sure this setting is set to "true"[4]

If it's already enabled, try toggling it off and on again.

## Verify Python Interpreter

Ensure that VS Code is using the correct Python interpreter:

1. Open the Command Palette (Ctrl+Shift+P)
2. Type "Python: Select Interpreter"
3. Choose the appropriate interpreter for your project[2]

## Activate Virtual Environment

If you're using a virtual environment, make sure it's activated:

1. Open a new terminal in VS Code
2. Activate your virtual environment
3. Try running your Python script again[2]

## Reinstall Pylance

Sometimes, reinstalling the Pylance extension can resolve issues:

1. Uninstall the Pylance extension
2. Restart VS Code
3. Reinstall Pylance from the marketplace[1]

## Check Indexing Settings

Pylance's indexing depth might be affecting auto-imports:

1. Open VS Code settings
2. Search for "python.analysis.packageIndexDepths"
3. Adjust the depth for specific packages or set a default depth[3]

## Disable Conflicting Extensions

Other extensions might be interfering with Pylance:

1. Disable all Python-related extensions except Pylance
2. Restart VS Code
3. Check if the issue persists[1]

## Update VS Code and Extensions

Ensure that both VS Code and your Python-related extensions are up to date.

## Reload VS Code

Sometimes, simply reloading VS Code can resolve issues:

1. Open the Command Palette (Ctrl+Shift+P)
2. Type "Reload Window" and select it

If none of these solutions work, you may want to check your `settings.json` file for any conflicting configurations or consider resetting your VS Code settings to default and reconfiguring them.

Remember, changes to settings might require reloading VS Code or restarting the Python language server for them to take effect.

### Sources

- [VSCode Pylance auto import only prompt for typing - Stack Overflow](https://stackoverflow.com/questions/65411579/vscode-pylance-auto-import-only-prompt-for-typing)
- [Fix Pylance resolveMissingImports in VS Code - Sentry](https://sentry.io/answers/fix-pylance-resolvemissingimports-in-vscode/)
- [Editing Python in Visual Studio Code](https://code.visualstudio.com/docs/python/editing)
- [Python in Visual Studio Code - November 2022 Release](https://devblogs.microsoft.com/python/python-in-visual-studio-code-november-2022-release/)
