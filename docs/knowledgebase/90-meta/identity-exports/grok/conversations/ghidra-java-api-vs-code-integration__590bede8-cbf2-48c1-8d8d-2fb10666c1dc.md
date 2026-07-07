---
source_url: "https://grok.com/c/590bede8-cbf2-48c1-8d8d-2fb10666c1dc"
conversation_id: "590bede8-cbf2-48c1-8d8d-2fb10666c1dc"
title: "Ghidra Java API VS Code Integration"
extracted_at: "2026-06-29T16:11:55.350Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Ghidra Java API VS Code Integration

Source: [Grok conversation](https://grok.com/c/590bede8-cbf2-48c1-8d8d-2fb10666c1dc)

## User

_Time: 2026-01-21T03:21:33.265Z_

in vs code/cursor how to get cmprehensive and exhaustive docstrings and 'stubs' for the java pyghidra extension? Like whatever is providing the getProjectData shown in the photo. I'm struggling with an issue where my getProjectData is only showing one program that's available in my project, which is highly incorrect i have like 12 programs in there. But I can't figure out how to get those from the project? so i'm now looking for a vscode extension that provides actual api when hovering over vairous functions in ghidra and pyghidra. Please find some comprehensive extensions for vs code or integrations into the java extension/maven/gradle or whatever. Something that'll make the api easier to understand without opening in my browser or another tab lol i like the LSP integrations.

## Assistant

_Time: 2026-01-21T03:23:23.445Z_

**Key Points**  
- Ghidra (version 11.3 and later) includes built-in Visual Studio Code support for Java extension development, offering IntelliSense, hover documentation from Javadoc comments, debugging, and project setup.  
- The official integration provides the most comprehensive API hovering and completions without extra extensions.  
- For your issue with `getProjectData()` showing only one program: Ghidra projects store multiple programs across a folder hierarchy—use recursive traversal of `DomainFolder` to list all programs.  
- No dedicated third-party VS Code extension exists specifically for Ghidra's Java API, but the Java Language Support (Red Hat) combined with Ghidra's tools delivers excellent results.  

**Setting Up VS Code for Ghidra Java Development**  
Update Ghidra to the latest version (11.3 or newer recommended for full VS Code features). In Ghidra:  
- Go to **File > New** (or similar menu) and select **Create VSCode Module Project**. This generates a folder with a Gradle-based skeleton for your extension, including `.vscode` configurations for launchers and debugging.  
- Open the generated folder in VS Code (or Cursor, which supports the same Java extensions).  
- Install the **Extension Pack for Java** (by Microsoft/Red Hat) if not already present—it provides LSP-based IntelliSense, hover docs (pulling from Ghidra's source comments), code navigation, and refactoring.  

This setup resolves dependencies on Ghidra's framework, giving you exhaustive hover documentation and stubs for classes like `ProjectData`, `DomainFolder`, and `DomainFile`. The hover shows actual Javadoc comments from Ghidra's source, which is more complete than browser-based docs.  

If working with an existing project, move your code into a Ghidra-generated module folder or manually add Gradle dependencies pointing to your Ghidra installation (via `ghidra.gradle` properties).  

**Fixing the Multiple Programs Issue**  
`Project.getProjectData()` provides access to the entire project tree, but it doesn't have a single method to return all programs—programs are stored as `DomainFile` entries across folders. Your code likely checks only the root or a specific folder, which explains seeing just one.  

To retrieve all programs, recursively traverse from the root folder and filter `DomainFile` instances where the content is a program:  

```java
import ghidra.framework.model.DomainFile;
import ghidra.framework.model.DomainFolder;
import ghidra.program.model.listing.Program;
import java.util.ArrayList;
import java.util.List;

// Recursive method to collect all program files
private List<DomainFile> getAllProgramFiles(DomainFolder folder) {
    List<DomainFile> programs = new ArrayList<>();
    
    // Add program files in current folder
    for (DomainFile file : folder.getFiles()) {
        Class<?> clazz = file.getDomainObjectClass();
        if (clazz != null && Program.class.isAssignableFrom(clazz)) {
            programs.add(file);
        }
    }
    
    // Recurse into subfolders
    for (DomainFolder subFolder : folder.getFolders()) {
        programs.addAll(getAllProgramFiles(subFolder));
    }
    
    return programs;
}

// Usage in your tool/provider
DomainFolder root = project.getProjectData().getRootFolder();
List<DomainFile> allPrograms = getAllProgramFiles(root);

// Now allPrograms contains every program in the project (typically 12 in your case)
```

Call `project.getProjectData().refresh(true)` first if needed to ensure fresh data. This approach is standard in Ghidra scripts/extensions for listing all project contents.  

**Alternatives and Additional Tools**  
- For Python-based PyGhidra scripting: Use the **Python** extension with Pylance for IntelliSense—community skeletons (e.g., devcontainers) exist for PyGhidra-specific setups.  
- Browser fallback: The online Ghidra API docs at ghidra.re provide searchable Javadocs if hover info is insufficient.  
- Older workflows: Community skeletons like vscode-ghidra-skeleton on GitHub can help, but official integration is superior.  

---

**Comprehensive Overview of Ghidra Java Development in VS Code**  

Ghidra's Java API is extensive, covering everything from project management (`Project`, `ProjectData`) to program analysis (`Program`, `Listing`, `Decompiler`). Developing extensions or tools (like your `ProjectToolProvider`) benefits enormously from strong IDE support, particularly hover documentation and autocompletion.  

Since Ghidra 11.3 (released early 2025), the tool includes native Visual Studio Code integration designed specifically for module/extension development. This replaces older workflows (like the GhidraDev Eclipse plugin or manual Gradle setup) and provides:  
- One-click project creation via **Create VSCode Module Project**, which generates a fully configured Gradle module with `.vscode/launch.json` for debugging extensions directly against a running Ghidra instance.  
- Seamless script editing via **Edit Script with Visual Studio Code**.  
- Automatic detection of your VS Code installation (configurable under **Edit > Tool Options > Visual Studio Code** if needed).  

When you open the generated project in VS Code and use the **Extension Pack for Java** (Language Support for Java™ by Red Hat, plus companions), the Language Server Protocol (LSP) resolves Ghidra's dependencies. This delivers:  
- **Hover documentation** — Full Javadoc comments extracted from Ghidra's source (e.g., hovering over `getProjectData()` shows its description, parameters, and return type).  
- **Autocompletion and stubs** — Contextual suggestions for methods like `getRootFolder()`, `getFiles()`, `getFolders()`, and `getDomainObjectClass()`.  
- **Go-to definition / references** — Navigation across Ghidra framework classes.  
- **Debugging** — Attach to Ghidra and step through your extension code.  

No additional third-party VS Code extensions are required for core Ghidra Java API support—the Red Hat Java LSP handles it once the project is configured correctly.  

**Detailed Fix for Listing All Programs in a Project**  

Ghidra projects organize data in a tree structure: a root `DomainFolder` containing subfolders and `DomainFile` entries. Imported binaries become program files scattered across this tree (not limited to the active tool's open program).  

The `ProjectData` interface provides:  
- `getRootFolder()` → starting point.  
- No direct "getAllPrograms()" method → requires traversal.  

Standard pattern used in many community scripts and extensions:  

```java
import ghidra.app.plugin.core.progmgr.ProgramManagerPlugin; // if needed for open programs
import ghidra.framework.model.*; // DomainFile, DomainFolder
import ghidra.program.model.listing.Program;
import java.util.*;

public List<DomainFile> findAllPrograms(Project project) {
    DomainFolder root = project.getProjectData().getRootFolder();
    List<DomainFile> programs = new ArrayList<>();
    collectPrograms(root, programs);
    return programs;
}

private void collectPrograms(DomainFolder folder, List<DomainFile> programs) {
    // Check files in current folder
    for (DomainFile file : folder.getFiles()) {
        Class<?> objClass = file.getDomainObjectClass();
        if (objClass != null && Program.class.isAssignableFrom(objClass)) {
            programs.add(file);
            // Optional: println(file.getName() + " at " + file.getPathname());
        }
    }
    
    // Recurse subfolders
    for (DomainFolder sub : folder.getFolders()) {
        collectPrograms(sub, programs);
    }
}
```

This will return all 12 programs in your project. If you only want currently open programs, use the tool's `state.getTool().getService(ProgramManager.class).getAllOpenPrograms()` instead. Refresh with `project.getProjectData().refresh(true)` before traversal if data appears stale.  

**PyGhidra Considerations**  
If part of your workflow involves PyGhidra (Python access to Ghidra's API), note that PyGhidra itself is Python-focused. For Python scripting in VS Code:  
- Use the **Python** extension with Pylance for type checking and completions.  
- Community resources like ghidra-python-vscode-devcontainer-skeleton provide ready-made setups with Ghidra launcher integration.  

However, your screenshot and code (`ProjectToolProvider` extending a Ghidra tool class) indicate pure Java extension development, so the Java-focused setup above applies directly.  

**Resource Table**  

| Resource Type              | Description                                                                 | Link/Source                                      |
|----------------------------|-----------------------------------------------------------------------------|--------------------------------------------------|
| Official VS Code Integration | Built-in Ghidra menu actions for project creation and script editing        | Ghidra 11.3+ Help > VSCode Integration           |
| Java Extension Pack        | Core LSP support for IntelliSense and hover docs                            | VS Code Marketplace (Microsoft/Red Hat)           |
| Online API Docs            | Searchable Javadocs for all Ghidra classes                                  | https://ghidra.re/ghidra_docs/api/               |
| Community Skeleton         | Pre-configured VS Code setups for Ghidra plugins/scripts                    | https://github.com/astrelsky/vscode-ghidra-skeleton |
| Example Recursive Traversal| Blog post demonstrating DomainFile collection                               | https://maxkersten.nl/2024/09/28/ghidra-tip-0x06-domainfiles-in-projects |

This combination gives you the LSP-style experience you want—no more switching tabs to a browser for API details.  

**Key Citations**  
- Ghidra 11.3 Release Notes and VS Code Features (helpnetsecurity.com, linkedin.com posts)  
- Official Ghidra GitHub Repository and DevGuide.md  
- ghidra.re API Documentation (ProjectData, DomainFolder, DomainFile)  
- Community discussions on Reddit (/r/ghidra) about VS Code integration and project traversal  
- Max Kersten's blog on recursively listing DomainFiles in projects  
- vscode-ghidra-skeleton GitHub repository
