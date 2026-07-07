---
source_url: "https://grok.com/c/3310ed12-a372-46c7-b13b-8d20ff3d73f2"
conversation_id: "3310ed12-a372-46c7-b13b-8d20ff3d73f2"
title: "Reverse Engineering KOTOR Save/Load System"
extracted_at: "2026-06-29T16:10:01.498Z"
message_count: 5
export_suite: "identity"
provenance: grok-rest-api
---

# Reverse Engineering KOTOR Save/Load System

Source: [Grok conversation](https://grok.com/c/3310ed12-a372-46c7-b13b-8d20ff3d73f2)

## User

_Time: 2026-03-04T18:13:03.387Z_

Task: Reverse Engineer KOTOR Save/Load System via AgentDecompile MCP Tools
You are performing a comprehensive reverse engineering analysis of Star Wars: Knights of the Old Republic (KOTOR) save/load game functionality in the binary /K1/k1_win_gog_swkotor.exe using Ghidra via AgentDecompile MCP tools.
CRITICAL: Tool Discovery First
Before calling ANY mcp_agentdecompil_* tool, you MUST first use tool_search_tool_regex to discover and load all available MCP tools. Start with:

* tool_search_tool_regex with pattern ^mcp_agentdecompil to find ALL available tools

* Then use tool_search_tool_regex with pattern decompile|search-string|search-symbol|list-import|list-export|list-function|open to find any non-MCP-prefixed variants

Step-by-Step Analysis Plan
Phase 1: Open the Binary
Use mcp_agentdecompil_open to open /K1/k1_win_gog_swkotor.exe.
Phase 2: String Search - Find Save/Load Related Strings
Use mcp_agentdecompil_search-everything to search for each of these patterns (do them one at a time since they may each return different results):

* "SaveGame"

* "LoadGame"

* "save" (with case sensitivity off if possible)

* ".sav"

* "SAVEGAME"

* "SaveLoad"

* "CExoFile"

* "CERFFile"

* "ERF"

Also use mcp_agentdecompil_manage-strings to search for strings containing "save", "load", "sav", "erf".
Phase 3: Symbol/Function Search
Use mcp_agentdecompil_manage-symbols to search for symbols containing:

* "save"

* "load"

* "Save"

* "Load"

* "CExoFile"

* "CERF"

* "Serialize"

Use mcp_agentdecompil_list-functions to list functions and search for any with save/load related names.
Phase 4: Decompile ALL Save/Load Functions
For EVERY function you discover that is related to save/load:

1. Use decompile-function (search for it with tool_search_tool_regex pattern "decompile") to get the FULL decompilation with NO line limits

2. Get the function signature

3. Get ALL comments on the function

Key functions to look for and decompile (these are typical BioWare Aurora engine function names):

* Any function with "SaveGame" in the name

* Any function with "LoadGame" in the name

* Any function with "CExoFile" in the name (file I/O class)

* Any function with "CERF" or "ERF" in the name (ERF is KOTOR's archive format for saves)

* Any function with "Serialize" in the name

* Any function with "WriteSaveGame" or "ReadSaveGame"

* Any function with "CClientSave"

* Any function with "CSaveLoad"

Phase 5: Call Graph Analysis
For each major save/load function found, use mcp_agentdecompil_get-call-graph to:

1. Get the full caller tree (mode="tree", direction="callers", maxDepth=5)

2. Get the full callee tree (mode="tree", direction="callees", maxDepth=5)

3. Get callers with decompilation (mode="callers_decomp")

Phase 6: Cross-References
Use mcp_agentdecompil_get-references on key functions and strings to understand the complete reference web.
Phase 7: Data Types and Structures
Use mcp_agentdecompil_manage-data-types and mcp_agentdecompil_manage-structures to find any structs/classes related to save game data.
CRITICAL OUTPUT REQUIREMENTS
Your final report MUST include ALL of the following with ZERO omissions:

1. Complete Function List: Every function address + name related to save/load

2. Full Decompiled Code: The COMPLETE decompiled C pseudocode for EVERY save/load function - do NOT truncate or summarize. Include every line.

3. Call Stack: The complete call hierarchy showing how save/load is triggered from UI down to file I/O

4. Function Signatures: Full signatures for all functions (return type, parameters, calling convention)

5. Cross References: All xrefs for key functions

6. Strings: All strings referenced by save/load code

7. Data Structures: Any structs/classes used in save/load

8. Comments/Labels: All existing Ghidra comments and labels on these functions

9. Addresses: Every single address for every function, string reference, and data structure

TOOL USAGE TRACKING (CRITICAL)
For EACH tool call you make, record:

* The exact tool name you called

* The exact parameters you passed

* Whether the call succeeded or failed

* Any error messages

* How intuitive or unintuitive the tool call was

* Any confusion about parameter names, modes, or expected behavior

* Any cases where you had to retry with different parameters

* Any cases where the tool returned unexpected or unhelpful results

* Any cases where you wished a tool existed but didn't

* Any frustrations or friction points

Include a dedicated section at the end called "## Tool Usage Analysis" with all of this tracking data organized chronologically.
Additional Notes

* The binary is a 32-bit Windows PE (x86)

* KOTOR uses the BioWare Aurora engine

* Save files are typically in ERF format (.sav extension)

* Key engine classes: CExoFile, CERFFile, CApp, CNWCModule, CGameObject

* The program path to use as parameter is: /K1/k1_win_gog_swkotor.exe

* Use programPath="/K1/k1_win_gog_swkotor.exe" for all tool calls

DO NOT STOP until you have exhaustively gathered ALL save/load related code. If a function calls sub-functions, decompile those too. Follow every thread.
 
without changing any wording/phrasing please add markdown formatting/styling intuitively throughout, sections, and including a TOC. Bold, italic, you name it, etc.

## Assistant

_Time: 2026-03-04T18:13:16.550Z_



## User

_Time: 2026-03-04T18:13:23.553Z_

```Task: Reverse Engineer KOTOR Save/Load System via AgentDecompile MCP Tools
You are performing a comprehensive reverse engineering analysis of Star Wars: Knights of the Old Republic (KOTOR) save/load game functionality in the binary /K1/k1_win_gog_swkotor.exe using Ghidra via AgentDecompile MCP tools.
CRITICAL: Tool Discovery First
Before calling ANY mcp_agentdecompil_* tool, you MUST first use tool_search_tool_regex to discover and load all available MCP tools. Start with:

* tool_search_tool_regex with pattern ^mcp_agentdecompil to find ALL available tools

* Then use tool_search_tool_regex with pattern decompile|search-string|search-symbol|list-import|list-export|list-function|open to find any non-MCP-prefixed variants

Step-by-Step Analysis Plan
Phase 1: Open the Binary
Use mcp_agentdecompil_open to open /K1/k1_win_gog_swkotor.exe.
Phase 2: String Search - Find Save/Load Related Strings
Use mcp_agentdecompil_search-everything to search for each of these patterns (do them one at a time since they may each return different results):

* "SaveGame"

* "LoadGame"

* "save" (with case sensitivity off if possible)

* ".sav"

* "SAVEGAME"

* "SaveLoad"

* "CExoFile"

* "CERFFile"

* "ERF"

Also use mcp_agentdecompil_manage-strings to search for strings containing "save", "load", "sav", "erf".
Phase 3: Symbol/Function Search
Use mcp_agentdecompil_manage-symbols to search for symbols containing:

* "save"

* "load"

* "Save"

* "Load"

* "CExoFile"

* "CERF"

* "Serialize"

Use mcp_agentdecompil_list-functions to list functions and search for any with save/load related names.
Phase 4: Decompile ALL Save/Load Functions
For EVERY function you discover that is related to save/load:

1. Use decompile-function (search for it with tool_search_tool_regex pattern "decompile") to get the FULL decompilation with NO line limits

2. Get the function signature

3. Get ALL comments on the function

Key functions to look for and decompile (these are typical BioWare Aurora engine function names):

* Any function with "SaveGame" in the name

* Any function with "LoadGame" in the name

* Any function with "CExoFile" in the name (file I/O class)

* Any function with "CERF" or "ERF" in the name (ERF is KOTOR's archive format for saves)

* Any function with "Serialize" in the name

* Any function with "WriteSaveGame" or "ReadSaveGame"

* Any function with "CClientSave"

* Any function with "CSaveLoad"

Phase 5: Call Graph Analysis
For each major save/load function found, use mcp_agentdecompil_get-call-graph to:

1. Get the full caller tree (mode="tree", direction="callers", maxDepth=5)

2. Get the full callee tree (mode="tree", direction="callees", maxDepth=5)

3. Get callers with decompilation (mode="callers_decomp")

Phase 6: Cross-References
Use mcp_agentdecompil_get-references on key functions and strings to understand the complete reference web.
Phase 7: Data Types and Structures
Use mcp_agentdecompil_manage-data-types and mcp_agentdecompil_manage-structures to find any structs/classes related to save game data.
CRITICAL OUTPUT REQUIREMENTS
Your final report MUST include ALL of the following with ZERO omissions:

1. Complete Function List: Every function address + name related to save/load

2. Full Decompiled Code: The COMPLETE decompiled C pseudocode for EVERY save/load function - do NOT truncate or summarize. Include every line.

3. Call Stack: The complete call hierarchy showing how save/load is triggered from UI down to file I/O

4. Function Signatures: Full signatures for all functions (return type, parameters, calling convention)

5. Cross References: All xrefs for key functions

6. Strings: All strings referenced by save/load code

7. Data Structures: Any structs/classes used in save/load

8. Comments/Labels: All existing Ghidra comments and labels on these functions

9. Addresses: Every single address for every function, string reference, and data structure

TOOL USAGE TRACKING (CRITICAL)
For EACH tool call you make, record:

* The exact tool name you called

* The exact parameters you passed

* Whether the call succeeded or failed

* Any error messages

* How intuitive or unintuitive the tool call was

* Any confusion about parameter names, modes, or expected behavior

* Any cases where you had to retry with different parameters

* Any cases where the tool returned unexpected or unhelpful results

* Any cases where you wished a tool existed but didn't

* Any frustrations or friction points

Include a dedicated section at the end called "## Tool Usage Analysis" with all of this tracking data organized chronologically.
Additional Notes

* The binary is a 32-bit Windows PE (x86)

* KOTOR uses the BioWare Aurora engine

* Save files are typically in ERF format (.sav extension)

* Key engine classes: CExoFile, CERFFile, CApp, CNWCModule, CGameObject

* The program path to use as parameter is: /K1/k1_win_gog_swkotor.exe

* Use programPath="/K1/k1_win_gog_swkotor.exe" for all tool calls

DO NOT STOP until you have exhaustively gathered ALL save/load related code. If a function calls sub-functions, decompile those too. Follow every thread.
 ```
without changing any wording/phrasing please add markdown formatting/styling intuitively throughout, sections, and including a TOC. Bold, italic, you name it, etc.

## Assistant

_Time: 2026-03-04T18:13:57.290Z_

# Table of Contents
- [Task: Reverse Engineer KOTOR Save/Load System via AgentDecompile MCP Tools](#task-reverse-engineer-kotor-saveload-system-via-agentdecompile-mcp-tools)
- [CRITICAL: Tool Discovery First](#critical-tool-discovery-first)
- [Step-by-Step Analysis Plan](#step-by-step-analysis-plan)
  - [Phase 1: Open the Binary](#phase-1-open-the-binary)
  - [Phase 2: String Search - Find Save/Load Related Strings](#phase-2-string-search---find-saveload-related-strings)
  - [Phase 3: Symbol/Function Search](#phase-3-symbolfunction-search)
  - [Phase 4: Decompile ALL Save/Load Functions](#phase-4-decompile-all-saveload-functions)
  - [Phase 5: Call Graph Analysis](#phase-5-call-graph-analysis)
  - [Phase 6: Cross-References](#phase-6-cross-references)
  - [Phase 7: Data Types and Structures](#phase-7-data-types-and-structures)
- [CRITICAL OUTPUT REQUIREMENTS](#critical-output-requirements)
- [TOOL USAGE TRACKING (CRITICAL)](#tool-usage-tracking-critical)
- [Additional Notes](#additional-notes)

# Task: Reverse Engineer KOTOR Save/Load System via AgentDecompile MCP Tools
**You are performing a comprehensive reverse engineering analysis of Star Wars: Knights of the Old Republic (KOTOR) save/load game functionality in the binary /K1/k1_win_gog_swkotor.exe using Ghidra via AgentDecompile MCP tools.**

## CRITICAL: Tool Discovery First
**Before calling ANY mcp_agentdecompil_* tool, you MUST first use tool_search_tool_regex to discover and load all available MCP tools. Start with:**

* **tool_search_tool_regex** with pattern **^mcp_agentdecompil** to find ALL available tools

* Then use **tool_search_tool_regex** with pattern **decompile|search-string|search-symbol|list-import|list-export|list-function|open** to find any non-MCP-prefixed variants

## Step-by-Step Analysis Plan

### Phase 1: Open the Binary
**Use mcp_agentdecompil_open to open /K1/k1_win_gog_swkotor.exe.**

### Phase 2: String Search - Find Save/Load Related Strings
**Use mcp_agentdecompil_search-everything to search for each of these patterns (do them one at a time since they may each return different results):**

* "SaveGame"

* "LoadGame"

* "save" (with case sensitivity off if possible)

* ".sav"

* "SAVEGAME"

* "SaveLoad"

* "CExoFile"

* "CERFFile"

* "ERF"

**Also use mcp_agentdecompil_manage-strings to search for strings containing "save", "load", "sav", "erf".**

### Phase 3: Symbol/Function Search
**Use mcp_agentdecompil_manage-symbols to search for symbols containing:**

* "save"

* "load"

* "Save"

* "Load"

* "CExoFile"

* "CERF"

* "Serialize"

**Use mcp_agentdecompil_list-functions to list functions and search for any with save/load related names.**

### Phase 4: Decompile ALL Save/Load Functions
**For EVERY function you discover that is related to save/load:**

1. **Use decompile-function (search for it with tool_search_tool_regex pattern "decompile") to get the FULL decompilation with NO line limits**

2. **Get the function signature**

3. **Get ALL comments on the function**

**Key functions to look for and decompile (these are typical BioWare Aurora engine function names):**

* Any function with "SaveGame" in the name

* Any function with "LoadGame" in the name

* Any function with "CExoFile" in the name (file I/O class)

* Any function with "CERF" or "ERF" in the name (ERF is KOTOR's archive format for saves)

* Any function with "Serialize" in the name

* Any function with "WriteSaveGame" or "ReadSaveGame"

* Any function with "CClientSave"

* Any function with "CSaveLoad"

### Phase 5: Call Graph Analysis
**For each major save/load function found, use mcp_agentdecompil_get-call-graph to:**

1. **Get the full caller tree (mode="tree", direction="callers", maxDepth=5)**

2. **Get the full callee tree (mode="tree", direction="callees", maxDepth=5)**

3. **Get callers with decompilation (mode="callers_decomp")**

### Phase 6: Cross-References
**Use mcp_agentdecompil_get-references on key functions and strings to understand the complete reference web.**

### Phase 7: Data Types and Structures
**Use mcp_agentdecompil_manage-data-types and mcp_agentdecompil_manage-structures to find any structs/classes related to save game data.**

## CRITICAL OUTPUT REQUIREMENTS
**Your final report MUST include ALL of the following with ZERO omissions:**

1. **Complete Function List: Every function address + name related to save/load**

2. **Full Decompiled Code: The COMPLETE decompiled C pseudocode for EVERY save/load function - do NOT truncate or summarize. Include every line.**

3. **Call Stack: The complete call hierarchy showing how save/load is triggered from UI down to file I/O**

4. **Function Signatures: Full signatures for all functions (return type, parameters, calling convention)**

5. **Cross References: All xrefs for key functions**

6. **Strings: All strings referenced by save/load code**

7. **Data Structures: Any structs/classes used in save/load**

8. **Comments/Labels: All existing Ghidra comments and labels on these functions**

9. **Addresses: Every single address for every function, string reference, and data structure**

## TOOL USAGE TRACKING (CRITICAL)
**For EACH tool call you make, record:**

* **The exact tool name you called**

* **The exact parameters you passed**

* **Whether the call succeeded or failed**

* **Any error messages**

* **How intuitive or unintuitive the tool call was**

* **Any confusion about parameter names, modes, or expected behavior**

* **Any cases where you had to retry with different parameters**

* **Any cases where the tool returned unexpected or unhelpful results**

* **Any cases where you wished a tool existed but didn't**

* **Any frustrations or friction points**

**Include a dedicated section at the end called "## Tool Usage Analysis" with all of this tracking data organized chronologically.**

## Additional Notes
* **The binary is a 32-bit Windows PE (x86)**

* **KOTOR uses the BioWare Aurora engine**

* **Save files are typically in ERF format (.sav extension)**

* **Key engine classes: CExoFile, CERFFile, CApp, CNWCModule, CGameObject**

* **The program path to use as parameter is: /K1/k1_win_gog_swkotor.exe**

* **Use programPath="/K1/k1_win_gog_swkotor.exe" for all tool calls**

**DO NOT STOP until you have exhaustively gathered ALL save/load related code. If a function calls sub-functions, decompile those too. Follow every thread.**

## Assistant

_Time: 2026-03-04T18:13:57.310Z_

# Task: Reverse Engineer KOTOR Save/Load System via AgentDecompile MCP Tools

**You are performing a comprehensive reverse engineering analysis of Star Wars: Knights of the Old Republic (KOTOR) save/load game functionality in the binary /K1/k1_win_gog_swkotor.exe using Ghidra via AgentDecompile MCP tools.**

## Table of Contents
- [CRITICAL: Tool Discovery First](#critical-tool-discovery-first)
- [Step-by-Step Analysis Plan](#step-by-step-analysis-plan)
  - [Phase 1: Open the Binary](#phase-1-open-the-binary)
  - [Phase 2: String Search - Find Save/Load Related Strings](#phase-2-string-search---find-saveload-related-strings)
  - [Phase 3: Symbol/Function Search](#phase-3-symbolfunction-search)
  - [Phase 4: Decompile ALL Save/Load Functions](#phase-4-decompile-all-saveload-functions)
  - [Phase 5: Call Graph Analysis](#phase-5-call-graph-analysis)
  - [Phase 6: Cross-References](#phase-6-cross-references)
  - [Phase 7: Data Types and Structures](#phase-7-data-types-and-structures)
- [CRITICAL OUTPUT REQUIREMENTS](#critical-output-requirements)
- [TOOL USAGE TRACKING (CRITICAL)](#tool-usage-tracking-critical)
- [Additional Notes](#additional-notes)

## CRITICAL: Tool Discovery First
Before calling ANY mcp_agentdecompil_* tool, you **MUST** first use tool_search_tool_regex to discover and load all available MCP tools. Start with:

* tool_search_tool_regex with pattern ^mcp_agentdecompil to find ALL available tools

* Then use tool_search_tool_regex with pattern decompile|search-string|search-symbol|list-import|list-export|list-function|open to find any non-MCP-prefixed variants

## Step-by-Step Analysis Plan

### Phase 1: Open the Binary
Use mcp_agentdecompil_open to open /K1/k1_win_gog_swkotor.exe.

### Phase 2: String Search - Find Save/Load Related Strings
Use mcp_agentdecompil_search-everything to search for each of these patterns (do them one at a time since they may each return different results):

* "SaveGame"

* "LoadGame"

* "save" (with case sensitivity off if possible)

* ".sav"

* "SAVEGAME"

* "SaveLoad"

* "CExoFile"

* "CERFFile"

* "ERF"

Also use mcp_agentdecompil_manage-strings to search for strings containing "save", "load", "sav", "erf".

### Phase 3: Symbol/Function Search
Use mcp_agentdecompil_manage-symbols to search for symbols containing:

* "save"

* "load"

* "Save"

* "Load"

* "CExoFile"

* "CERF"

* "Serialize"

Use mcp_agentdecompil_list-functions to list functions and search for any with save/load related names.

### Phase 4: Decompile ALL Save/Load Functions
For EVERY function you discover that is related to save/load:

1. Use decompile-function (search for it with tool_search_tool_regex pattern "decompile") to get the FULL decompilation with NO line limits

2. Get the function signature

3. Get ALL comments on the function

**Key functions to look for and decompile (these are typical BioWare Aurora engine function names):**

* Any function with "SaveGame" in the name

* Any function with "LoadGame" in the name

* Any function with "CExoFile" in the name (file I/O class)

* Any function with "CERF" or "ERF" in the name (ERF is KOTOR's archive format for saves)

* Any function with "Serialize" in the name

* Any function with "WriteSaveGame" or "ReadSaveGame"

* Any function with "CClientSave"

* Any function with "CSaveLoad"

### Phase 5: Call Graph Analysis
For each major save/load function found, use mcp_agentdecompil_get-call-graph to:

1. Get the full caller tree (mode="tree", direction="callers", maxDepth=5)

2. Get the full callee tree (mode="tree", direction="callees", maxDepth=5)

3. Get callers with decompilation (mode="callers_decomp")

### Phase 6: Cross-References
Use mcp_agentdecompil_get-references on key functions and strings to understand the complete reference web.

### Phase 7: Data Types and Structures
Use mcp_agentdecompil_manage-data-types and mcp_agentdecompil_manage-structures to find any structs/classes related to save game data.

## CRITICAL OUTPUT REQUIREMENTS
**Your final report MUST include ALL of the following with ZERO omissions:**

1. Complete Function List: Every function address + name related to save/load

2. Full Decompiled Code: The COMPLETE decompiled C pseudocode for EVERY save/load function - do NOT truncate or summarize. Include every line.

3. Call Stack: The complete call hierarchy showing how save/load is triggered from UI down to file I/O

4. Function Signatures: Full signatures for all functions (return type, parameters, calling convention)

5. Cross References: All xrefs for key functions

6. Strings: All strings referenced by save/load code

7. Data Structures: Any structs/classes used in save/load

8. Comments/Labels: All existing Ghidra comments and labels on these functions

9. Addresses: Every single address for every function, string reference, and data structure

## TOOL USAGE TRACKING (CRITICAL)
**For EACH tool call you make, record:**

* The exact tool name you called

* The exact parameters you passed

* Whether the call succeeded or failed

* Any error messages

* How intuitive or unintuitive the tool call was

* Any confusion about parameter names, modes, or expected behavior

* Any cases where you had to retry with different parameters

* Any cases where the tool returned unexpected or unhelpful results

* Any cases where you wished a tool existed but didn't

* Any frustrations or friction points

**Include a dedicated section at the end called "## Tool Usage Analysis" with all of this tracking data organized chronologically.**

## Additional Notes
* The binary is a 32-bit Windows PE (x86)

* KOTOR uses the BioWare Aurora engine

* Save files are typically in ERF format (.sav extension)

* Key engine classes: CExoFile, CERFFile, CApp, CNWCModule, CGameObject

* The program path to use as parameter is: /K1/k1_win_gog_swkotor.exe

* Use programPath="/K1/k1_win_gog_swkotor.exe" for all tool calls

**DO NOT STOP until you have exhaustively gathered ALL save/load related code. If a function calls sub-functions, decompile those too. Follow every thread.**
