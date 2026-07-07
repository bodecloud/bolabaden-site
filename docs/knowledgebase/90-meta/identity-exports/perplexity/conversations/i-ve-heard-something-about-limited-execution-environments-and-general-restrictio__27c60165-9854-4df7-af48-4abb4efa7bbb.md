---
source_url: "https://www.perplexity.ai/search/8b329107-a43a-4f01-943e-b76cff08d13f"
thread_uuid: "27c60165-9854-4df7-af48-4abb4efa7bbb"
slug: "8b329107-a43a-4f01-943e-b76cff08d13f"
title: "I've heard something about limited execution environments and general restrictions on VS code extensions. Can you elaborate more on what exactly these are? What specific ones are the most detrimental to extension development? I'm wondering why people are forking vs code for such functionality when extensions exist.

Question unrelated to 'workspace trust' and 'restricted mode'."
extracted_at: "2026-06-29T16:11:54.042Z"
matched_keywords: []
export_suite: "identity"
entry_count: 2
provenance: perplexity-rest-api
---

# I've heard something about limited execution environments and general restrictions on VS code extensions. Can you elaborate more on what exactly these are? What specific ones are the most detrimental to extension development? I'm wondering why people are forking vs code for such functionality when extensions exist.

Question unrelated to 'workspace trust' and 'restricted mode'.

Source: [Perplexity thread](https://www.perplexity.ai/search/8b329107-a43a-4f01-943e-b76cff08d13f)

## User

I've heard something about limited execution environments and general restrictions on VS code extensions. Can you elaborate more on what exactly these are? What specific ones are the most detrimental to extension development? I'm wondering why people are forking vs code for such functionality when extensions exist.

Question unrelated to 'workspace trust' and 'restricted mode'.

## Assistant

In Visual Studio Code (VS Code), **limited execution environments** and **general restrictions on extensions** can significantly affect extension development, especially when targeting different platforms like the web or remote environments. These restrictions are often the reason why some developers choose to fork VS Code, as they seek more control and flexibility for their specific use cases.

### **Key Limitations in VS Code Extensions**

1. **Web Extensions and Browser Sandbox**:
   When running VS Code in the browser (e.g., `vscode.dev` or GitHub Codespaces), extensions are executed in a **web extension host**. This environment is restricted by the browser's sandbox, which imposes several limitations:
   - **No Node.js APIs**: Web extensions cannot access Node.js modules or APIs like `process`, `os`, `path`, etc. This is a significant limitation for extensions that rely on server-side capabilities or need to interact with the local file system.
   - **No Child Processes**: Web extensions cannot create child processes or run executables, limiting their ability to perform tasks like compiling code, running scripts, or interacting with external tools.
   - **Virtual File System**: Access to files is limited to a virtual file system via the VS Code API (`vscode.workspace.fs`), which restricts direct file system access.
   - **Single File Packaging**: Due to the lack of support for dynamic module imports (e.g., `importScripts`), web extensions must be packaged into a single file.[8]

2. **Remote Development Restrictions**:
   In remote development scenarios (e.g., using WSL or Docker containers), extensions are classified as either **UI extensions** (which run locally) or **Workspace extensions** (which run remotely). While Workspace extensions have full access to the remote environment, they may face challenges such as:
   - **Adjustments for Remote Environments**: Extensions may need to be adapted to work in remote contexts, especially when they rely on local resources or APIs. For example, language servers and debuggers must be configured to run in the remote environment.[5]
   - **Cross-Platform Issues**: Some extensions may not work consistently across different operating systems in remote environments due to dependencies on platform-specific libraries.[5]

3. **Security and Trust Mechanisms**:
   While this is not related to "workspace trust" directly, there are security concerns around how extensions interact with untrusted workspaces. Extensions can be limited in their functionality based on whether they are running in a trusted workspace or not. However, even outside of restricted mode, developers must carefully handle potential vulnerabilities that could arise from malicious workspaces or external dependencies.[3]

### **Why Fork VS Code?**

Given these limitations, some developers opt to fork VS Code rather than relying solely on extensions. The primary reasons include:

- **Full Control Over Execution Environment**: Forking allows developers to bypass some of the restrictions imposed by VS Code's sandboxed environments (e.g., web or remote) and implement features that require deeper system access.
- **Customization and Flexibility**: By forking VS Code, developers can modify its core behavior, add features that would otherwise be impossible within the extension framework, and optimize it for specific workflows or platforms.[4][7]
- **Avoiding Frequent Breaking Changes**: Since VS Code has frequent updates that can sometimes break extensions, forking provides stability by allowing developers to control when and how updates are applied.[7]

### **Most Detrimental Restrictions for Extension Development**

The following restrictions are particularly challenging for extension developers:

- **Lack of Node.js Support in Web Extensions**: Many powerful extensions rely on Node.js modules for tasks like file manipulation, networking, and process management. The inability to use these modules in web environments severely limits what web-based extensions can do.[8]
- **No Child Processes in Web Extensions**: This restriction prevents running external commands or scripts directly from web-based VS Code instances.[8]
- **Platform-Specific Dependencies in Remote Development**: Extensions that depend on platform-specific binaries or libraries may not work correctly across different remote environments without significant modifications.[5]

### Conclusion

While VS Code's rich ecosystem of extensions offers great flexibility, its limited execution environments—especially in web-based and remote scenarios—can impose significant constraints on extension functionality. These limitations drive some developers to fork VS Code to gain more control over the environment and ensure their tools work seamlessly across all platforms.

### Sources

- [Visual Studio Code Workspace Trust security](https://code.visualstudio.com/docs/editor/workspace-trust)
- [Can you have isolated VS Code environments so each project has ...](https://stackoverflow.com/questions/74157455/can-you-have-isolated-vs-code-environments-so-each-project-has-its-own-extension)
- [How safe are extensions in Visual Studio code? - Stack Overflow](https://stackoverflow.com/questions/67493012/how-safe-are-extensions-in-visual-studio-code/77238116)
- [Visual Studio Code is designed to fracture : r/programming - Reddit](https://www.reddit.com/r/programming/comments/x2223s/visual_studio_code_is_designed_to_fracture/)
- [Visual Studio Code Remote Development Frequently Asked Questions](https://code.visualstudio.com/docs/remote/faq)
- [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web)
- [Should we fork VS Code? · Issue #458 - GitHub](https://github.com/twinbasic/twinbasic/issues/458)
- [Web Extensions - Visual Studio Code](https://code.visualstudio.com/api/extension-guides/web-extensions)

## User

Why might developers choose to fork VS Code instead of using extensions

## Assistant

Developers may choose to fork Visual Studio Code (VS Code) instead of relying solely on extensions due to several key factors related to control, limitations, and the evolving nature of the VS Code ecosystem.

### **1. Control Over Features and Execution Environment**
Forking VS Code allows developers to gain full control over the editor's behavior, which is often constrained when developing extensions. There are several reasons why this level of control is desirable:

- **Limited Access in Web and Remote Environments**: Extensions running in web environments (e.g., `vscode.dev`) or remote setups (like WSL or Docker) face significant restrictions. For instance, web extensions cannot use Node.js APIs, create child processes, or directly access the file system. These limitations can severely restrict what an extension can do, especially for tasks that require deeper system integration or custom workflows.[5]
  
- **Customization Beyond Extensions**: Some features or changes developers want to implement may not be achievable through extensions alone. Forking allows them to modify core functionality, integrate custom features, or change default behaviors that would otherwise be locked down in the official VS Code distribution.

### **2. Avoiding Proprietary Dependencies**
Another reason for forking is to avoid Microsoft's proprietary additions to the official VS Code distribution. While VS Code is open-source under the MIT license, Microsoft's distribution includes proprietary components such as telemetry, branding, and certain closed-source extensions that enhance functionality but are not available in the open-source version. This creates a situation where some developers feel that using the official VS Code version locks them into Microsoft's ecosystem.[1]

- **Open-Source Alternatives**: Forks like VSCodium aim to provide a fully open-source version of VS Code without Microsoft's proprietary elements. Developers who want to avoid vendor lock-in or who prefer fully open-source tools may choose these forks over the official distribution.[1]

### **3. Performance and Security Concerns**
Extensions in VS Code can introduce performance bottlenecks and security vulnerabilities:

- **Performance Issues**: Relying heavily on extensions can degrade performance, especially when many are installed. Extensions often run concurrently, which can slow down the editor and lead to inconsistent behavior.[3]
  
- **Security Risks**: Extensions in VS Code are not sandboxed and can access a wide range of system resources without strict permission controls. This makes them potential vectors for malware or other security exploits. For example, malicious extensions could update silently in the background or execute arbitrary code on the host machine. By forking VS Code, developers can implement stricter security measures or remove potentially insecure components.[4]

### **4. Fractured Ecosystem**
Some developers argue that Microsoft's approach to managing the VS Code ecosystem has led to a fractured community. Microsoft has been accused of prioritizing its proprietary tools and services over open-source alternatives, making it difficult for independent developers or competing products to keep up. This "fracturing" has driven some developers to fork VS Code in order to maintain control over their development environment and avoid being forced into using Microsoft's default tools.[2][1]

### **Conclusion**
In summary, developers may choose to fork VS Code instead of relying on extensions due to limitations in execution environments (especially in web or remote contexts), a desire for more control over features and customization, concerns about performance and security risks with extensions, and dissatisfaction with Microsoft's handling of the ecosystem. Forking provides them with a way to create a more tailored development experience without being constrained by these issues.

### Sources

- [Visual Studio Code is designed to fracture - Geoffrey Huntley](https://ghuntley.com/fracture/)
- [Visual Studio Code is designed to fracture](https://www.reddit.com/r/programming/comments/x2223s/visual_studio_code_is_designed_to_fracture/)
- [Visual Studio Vs Visual Studio Code: What's The Difference?](https://codeop.tech/blog/visual-studio-vs-visual-studio-code/)
- [Visual Studio Code extensions are much less secure than browser ...](https://www.baldurbjarnason.com/2024/vscode-extensions-are-insecure/)
- [Web Extensions](https://code.visualstudio.com/api/extension-guides/web-extensions)
