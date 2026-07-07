---
source_url: "https://www.perplexity.ai/search/8369bb9e-934f-4080-b22c-b6f8aa91f087"
thread_uuid: "5d4aa6a6-1910-42ef-b7cc-676d9a018cf4"
slug: "8369bb9e-934f-4080-b22c-b6f8aa91f087"
title: "in vs code, best way to improve the speed of the language server and various extensions...? especially python. and don't say 'disable unused extensions'... what specifically is causing the whole language server to just... lag...?"
extracted_at: "2026-06-29T16:18:24.914Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# in vs code, best way to improve the speed of the language server and various extensions...? especially python. and don't say 'disable unused extensions'... what specifically is causing the whole language server to just... lag...?

Source: [Perplexity thread](https://www.perplexity.ai/search/8369bb9e-934f-4080-b22c-b6f8aa91f087)

## User

in vs code, best way to improve the speed of the language server and various extensions...? especially python. and don't say 'disable unused extensions'... what specifically is causing the whole language server to just... lag...?

## Assistant

To improve the speed of the language server and extensions in VS Code, especially for Python, you can try the following approaches:

## Optimize Workspace Settings

1. Limit the workspace scope:
   - Open only the necessary folders in your workspace.[3]
   - Use a `.gitignore` file to exclude unnecessary directories from being indexed.[3]

2. Adjust Python-specific settings:
   - Set `"python.analysis.indexing": false` in your `settings.json` to prevent pre-emptive indexing of large numbers of files.[1]
   - Configure `pyrightconfig.json` to exclude large data directories.[1]

## Tune Language Server Performance

1. Use Pylance:
   - Pylance is a fast, feature-rich language support extension for Python in VS Code.[2]
   - It's powered by Pyright, which offers improved performance over older language servers.[2]

2. Monitor and profile extensions:
   - Use the "Developer: Show Running Extensions" command to identify slow extensions.[3]
   - Profile specific extensions using the built-in profiling tool.[3]

3. Optimize startup performance:
   - Run the "Developer: Startup Performance" command to analyze VS Code's launch process.[3]
   - Edit the `argv.json` file to customize runtime arguments.[3]

## Address Specific Issues

1. TypeScript-related slowdowns:
   - If you don't use TypeScript, disable the "TypeScript: Disable Automatic Type Acquisition" feature.[3]

2. Large file handling:
   - For files with over 5000 lines, consider splitting them into smaller modules.[7]
   - Adjust linting settings for large files to reduce processing overhead.

3. Multi-root workspace optimization:
   - If using multiple projects in a workspace, open them individually if performance issues persist.[4]

## General Performance Tips

1. Use SSD storage:
   - Ensure your workspace is on an SSD for faster file access and indexing.

2. Keep VS Code updated:
   - Regular updates often include performance improvements and bug fixes.

3. Clear VS Code cache:
   - Occasionally clear the VS Code cache to remove outdated information.

4. Adjust hardware resources:
   - Allocate more RAM or CPU cores to VS Code if your system allows it.

By implementing these strategies, you should see a noticeable improvement in VS Code's performance, particularly with the Python language server and related extensions. Remember that the specific cause of lag can vary depending on your project size, configuration, and system resources, so you may need to experiment with different combinations of these solutions.

### Sources

- [VS Code Pylance works slow with much delay - Stack Overflow](https://stackoverflow.com/questions/71290916/vs-code-pylance-works-slow-with-much-delay)
- [Pylance - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance)
- [How To Speed Up Vscode - My Docs - GitBook](https://bryan-guner.gitbook.io/my-docs/code-editors-and-tools/vscode/how-to-speed-up-vscode)
- [why vscode slow, even when my specs are decent? - Reddit](https://www.reddit.com/r/vscode/comments/yh126s/why_vscode_slow_even_when_my_specs_are_decent/)
- [Horrible experience with Python Language Server #1813 - GitHub](https://github.com/microsoft/python-language-server/issues/1813)
- [LSP for Python?](https://discuss.python.org/t/lsp-for-python/22194)
- [VS Code lags when python extension enabled in large python files](https://github.com/microsoft/vscode-python/issues/21089)
