---
source_url: "https://grok.com/c/7ca90d48-6b0c-45b6-a980-346dc56abd87"
conversation_id: "7ca90d48-6b0c-45b6-a980-346dc56abd87"
title: "Ghidra Export Formats: C/C++ Optimal"
extracted_at: "2026-06-29T16:13:24.627Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Ghidra Export Formats: C/C++ Optimal

Source: [Grok conversation](https://grok.com/c/7ca90d48-6b0c-45b6-a980-346dc56abd87)

## User

_Time: 2025-12-25T22:50:24.189Z_

what supported export formats does ghidra support? goal is to use what was reverse engineered to build a project that can be compiled. which would be better/more optimal: .sarif or .gzf or some other format and why?

## Assistant

_Time: 2025-12-25T22:50:44.070Z_

**Key Points**
- Ghidra supports multiple export formats, including **C/C++**, XML, Binary (raw bytes), Original File (for ELF/PE), Ghidra Zip File (.gzf), SARIF, HTML, ASCII, Intel Hex, and others.
- For rebuilding a compilable project from reverse-engineered code, the **C/C++** format is the most suitable, as it exports the decompiler's pseudo-C/C++ output.
- Neither **.sarif** (SARIF format for analysis results interchange) nor **.gzf** (compressed Ghidra program archive for sharing projects) is designed for source code export or compilation.
- The **C/C++** export provides the best starting point, though the output is pseudo-code that often requires manual fixes (e.g., types, signatures) to compile fully.

**Supported Export Formats Overview**  
Ghidra's "File > Export Program" feature offers various formats. Common ones include:  
- **C/C++**: Exports decompiled code as readable pseudo-C/C++.  
- **XML**: Detailed program markup (functions, symbols, etc.).  
- **Binary/Raw Bytes**: Dumps memory blocks (not original layout).  
- **Original File**: Recreates ELF/PE executables (with patches, since Ghidra 10+).  
- **Ghidra Zip File (.gzf)**: Packed archive of the full Ghidra program database.  
- **SARIF**: JSON-based format for sharing analysis results (e.g., functions, comments, bookmarks).  
- Others: HTML, ASCII, Intel Hex.

**Recommendation for Compilable Project**  
The optimal format is **C/C++**, as it directly provides source-like code from the decompiler. This aligns with goals of recompiling or rebuilding, and community tools/scripts often enhance it for better compilability.  

**.sarif** is unsuitable—it focuses on static analysis interchange (not clean source code) and lacks direct compilability.  

**.gzf** preserves the full analysis for re-import into Ghidra but contains no extractable source code for compilation.  

No format produces perfectly compilable code automatically; expect manual cleanup (e.g., function signatures, data types). Extensions or scripts can improve results for specific functions.

---

Ghidra, developed by the NSA, is a powerful open-source reverse engineering tool with robust export capabilities via the "Export Program" menu in the CodeBrowser. The exporter plugin supports a wide array of formats, each serving different purposes in analysis workflows.

#### Comprehensive List of Supported Export Formats
From Ghidra's official documentation and user reports, the primary formats include:

| Format              | Extension | Description                                                                 | Use Case |
|---------------------|-----------|-----------------------------------------------------------------------------|----------|
| C/C++              | .c / .cpp | Exports decompiled pseudo-code from the decompiler.                        | Source reconstruction, recompilation attempts. |
| XML                | .xml     | Full program export with symbols, functions, references, etc.              | Inter-tool exchange or scripting. |
| Binary / Raw Bytes | .bin     | Dumps initialized memory blocks sequentially.                              | Patching or raw binary recreation (limited layout preservation). |
| Original File      | (original) | Recreates the input file layout (ELF, PE) with modifications (post-Ghidra 10). | Patched executable export. |
| Ghidra Zip File (GZF) | .gzf   | Compressed archive of the entire Ghidra program database.                  | Sharing complete analysis projects. |
| SARIF              | .sarif   | Static Analysis Results Interchange Format (JSON-based) for program metadata. | Sharing results with other tools; re-import possible. |
| HTML               | .html    | Navigable HTML representation of the program.                               | Documentation or web viewing. |
| ASCII              | .txt     | Printable ASCII dump.                                                      | Quick text inspection. |
| Intel Hex          | .hex     | Intel Hex format for embedded/firmware.                                    | Firmware exporting. |
| Others (e.g., GDT)  | .gdt     | Data Type Archives

## User

_Time: 2025-12-25T22:50:54.804Z_

okay how to export as C/CPP. Exact buttons in the code browser tool. I don't see it.

## Assistant

_Time: 2025-12-25T22:51:19.291Z_

**Key Points**  
- Ghidra exports decompiled pseudo-C/C++ code via the **Export Program** feature in the CodeBrowser tool.  
- Exact steps: In the CodeBrowser window, go to **File > Export Program...** (or press the 'O' key as a shortcut in some versions).  
- In the export dialog, select **C/C++** from the "Format" dropdown menu.  
- Customize options like creating a header file (.h), emitting data types, or exporting only selected functions.  
- If you don't see the C/C++ option, ensure the program is fully analyzed (run Auto Analysis) and you're in the active CodeBrowser window with a loaded program.  

**Step-by-Step Export Process**  
1. Open your analyzed program in the **CodeBrowser Tool** (double-click the program in the Project window).  
2. Complete or re-run analysis if needed (Analysis > Auto Analyze...).  
3. Navigate to **File > Export Program...**.  
4. In the dialog: Choose a save location and filename (e.g., program.c).  
5. Select **C/C++** from the Format dropdown.  
6. Click **Options** to tweak settings (e.g., create a separate .h header, include data types).  
7. Check **Selection Only** if you highlighted specific code in the Listing or Decompiler window.  
8. Click **OK** to export.  

This produces pseudo-C/C++ code reflecting your analysis (renames, types, comments). For single functions, select the function body first or use community scripts for finer control.

---

Ghidra's CodeBrowser Tool provides robust exporting of decompiled code through the built-in Exporter plugin, which has included the C/C++ format since early versions and remains standard as of late 2025 releases.

#### Detailed Export Steps in CodeBrowser
Users often miss the option because it's under "Export Program" rather than a direct "Export Decompile" button. Here's the precise navigation:

1. **Launch CodeBrowser**: From the Ghidra Project window, double-click your imported and analyzed program to open it in the CodeBrowser.
2. **Ensure Analysis Completion**: If decompilation looks incomplete, go to **Analysis > Auto Analyze...** and run or re-run analyzers (e.g., Decompiler Parameter ID for better signatures).
3. **Access the Export Dialog**:
   - Click the menu bar: **File > Export Program...**
   - Shortcut: In many installations, pressing **'O'** (lowercase o) directly opens this dialog.
4. **Configure the Export**:
   - **Save As**: Choose a directory and base filename (Ghidra will append .c or .cpp as needed).
   - **Format Dropdown**: Scroll and select **C/C++ (.c)** – this uses the internal CppExporter to generate decompiled pseudo-code.
   - **Address Set**: Defaults to the entire program; use "Selection Only" for highlighted ranges.
5. **Advanced Options** (click the **Options** button):
   | Option                      | Description                                                                 | Recommended for Recompilation |
   |-----------------------------|-----------------------------------------------------------------------------|------------------------------|
   | Create Header File (.h)    | Generates a separate header with prototypes and types.                     | Yes – helps with declarations. |
   | Create C File (.c)         | Main source file with function bodies.                                     | Yes. |
   | Emit Data-type Definitions | Includes typedefs and structs in the output.                                | Yes – improves type accuracy. |
   | Emit Referenced Globals    | Declares global variables referenced in functions.                         | Useful for data-heavy binaries. |
   | Function Tag Filters       | Export only tagged functions (advanced; requires prior tagging).           | For subset exports. |

6. **Export**: Click **OK**. The output will be one or more files containing high-level C-like code synchronized with your Ghidra analysis.

#### Common Reasons the Option Might Not Appear
- The program isn't loaded or analyzed (no decompiler output available).
- You're in the wrong window (e.g., Project window instead of CodeBrowser).
- Rare plugin issues: Ensure the Exporter plugin is enabled via **File > Configure > Plugins**.

#### Alternatives for Specific Needs
- **Single Function Export**: Highlight the function in the Listing window, check "Selection Only," and export – or use community scripts like GhidraFunctionCPPExporter for better per-function compilability.
- **Batch/Headless Export**: Use Ghidra's analyzeHeadless mode with scripts invoking CppExporter.
- **Enhanced Exports**: Extensions/scripts (e.g., from GitHub) can improve output for recompilation by fixing types or adding includes.

The exported code is pseudo-C/C++ (not always directly compilable without manual fixes like signatures or includes), but it's the closest Ghidra offers to source reconstruction and serves as an excellent base for rebuilding projects.

**Key Citations**
- National Security Agency Ghidra GitHub Repository (Exporter Help Topic): https://github.com/NationalSecurityAgency/ghidra/blob/master/Ghidra/Features/Base/src/main/help/help/topics/ExporterPlugin/exporter.htm
- Ghidra Discussions on Export Program C/C++: https://github.com/NationalSecurityAgency/ghidra/discussions/4702
- Community Guide on Exporting Decompiled Code: https://www.reddit.com/r/ghidra/comments/ok1uq4/dump_decompiled_code/
- Advanced Function Exporter Script: https://github.com/edmcman/GhidraFunctionCPPExporter
- Recompilation Tips from Exported Code: https://edmcman.github.io/blog/2025-05-02--re-compiling-ghidra-decompiler-output/
