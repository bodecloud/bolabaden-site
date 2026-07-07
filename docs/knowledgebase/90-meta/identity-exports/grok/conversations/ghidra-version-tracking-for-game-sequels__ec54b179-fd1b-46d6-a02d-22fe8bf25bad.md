---
source_url: "https://grok.com/c/ec54b179-fd1b-46d6-a02d-22fe8bf25bad"
conversation_id: "ec54b179-fd1b-46d6-a02d-22fe8bf25bad"
title: "Ghidra Version Tracking for Game Sequels"
extracted_at: "2026-06-29T16:14:02.939Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Ghidra Version Tracking for Game Sequels

Source: [Grok conversation](https://grok.com/c/ec54b179-fd1b-46d6-a02d-22fe8bf25bad)

## User

_Time: 2025-12-23T21:39:38.176Z_

Does ghidra support sig scanning? like i have two games game1.exe and game2.exe where game2.exe is a sequel of game1.exe. I have game1.exe fully documented. I'd like to sig scan game2.exe and migrate all the documentation/function names/etc somehow automatically and dynamically based on common sigs and functions that exist in both (using the sig scanner to find them). How to automate.

## Assistant

_Time: 2025-12-23T21:40:09.730Z_

### Key Points
- Ghidra does not have a built-in "sig scanning" tool like IDA's signature creation for arbitrary byte patterns, but it excels at **function matching** across similar binaries using advanced features.
- The best automated way to migrate function names, comments, labels, and other documentation from a fully analyzed game1.exe to game2.exe (a sequel with many shared or similar functions) is **Ghidra's Version Tracking tool**.
- Version Tracking automatically correlates and matches functions between two binaries, then ports markup (names, comments, references, etc.) with high accuracy, especially for minimally changed code like sequels.
- For even more robust matching on slightly modified functions, use **BSim** (built-in fuzzy matching plugin in Ghidra 11+).
- Alternatives like BinDiff (now open-source) provide similar function matching and can import names automatically via extensions.

### Recommended Approaches

**Primary Method: Ghidra Version Tracking**
1. Create a new Ghidra project and import both game1.exe (source, fully documented) and game2.exe (destination).
2. Run auto-analysis on both (ensure similar analysis options for best results).
3. Open the Version Tracking tool (footsteps icon in the toolbar or via search).
4. Create a new session: Select game1.exe as source and game2.exe as destination.
5. Run correlators (e.g., Exact Function Bytes Match, Similar Function Match) to find pairings.
6. Review matches: Sort by confidence, reject false positives, accept good ones.
7. Apply markup: This automatically transfers function names, comments, labels, and more to matching locations in game2.exe.
8. Open game2.exe in CodeBrowser to see the ported documentation.

This preserves your prior work dynamically based on code similarity, without manual signature creation.

**Enhanced Matching: BSim Plugin**
- Enable BSim (File > Configure > Experimental or via plugin settings).
- Create a BSim database from analyzed functions in game1.exe.
- Query against game2.exe for fuzzy matches (handles compiler changes, minor patches).
- Apply matched signatures and data types automatically—ideal if functions in the sequel are optimized differently.

**External Tool: BinDiff Integration**
- Export both binaries from Ghidra using BinExport (File > Export > Binary BinExport V2).
- Compare in BinDiff to get function matches.
- Use the BinDiffHelper Ghidra extension to import and apply names/comments automatically.

**Manual Signature Option (If Needed)**
- Scripts like Sigga or MakeSig.py can create byte patterns (AOB signatures) from selected code in game1.exe.
- You would then need a custom Ghidra script to scan game2.exe for those patterns and apply labels—less automated and reliable than Version Tracking for large-scale migration.

Version Tracking or BSim will handle 80-90%+ of matches automatically in sequel scenarios, saving significant time.

---

Ghidra provides powerful built-in mechanisms for matching and migrating reverse engineering annotations across similar binaries, such as different versions of software or sequels to games where much of the code is reused or lightly modified. While Ghidra lacks a direct equivalent to traditional "signature scanning" (e.g., array-of-bytes patterns with wildcards as seen in tools like Cheat Engine or IDA's FLIRT for libraries), it offers superior function-level matching that achieves the desired outcome: automatically identifying corresponding functions in game2.exe and transferring names, comments, labels, data types, and other markup from the documented game1.exe.

#### Core Feature: Version Tracking Tool
Ghidra's **Version Tracking** is specifically designed for this use case. It compares two programs in the same project, runs correlators to pair similar or identical functions, and allows bulk application of "markup items" (all your documentation) to the new binary.

| Step | Action | Details |
|------|--------|---------|
| 1 | Project Setup | Create a shared Ghidra project. Import and fully analyze both game1.exe (source) and game2.exe (destination). Use consistent analysis options (e.g., enable aggressive function detection). |
| 2 | Launch Tool | In CodeBrowser, click the Version Tracking icon (footsteps) or search for "Version Tracking". |
| 3 | New Session | Select game1.exe as source markup provider and game2.exe as destination. |
| 4 | Run Correlators | Use "Exact Function Instructions Match", "Exact Function Bytes Match", or "Similar Function Match" first. Additional ones like flow-based or symbol correlators can refine results. |
| 5 | Review & Refine | Table shows matches with confidence scores. Sort, multi-select, accept/reject. View side-by-side disassembly/decompilation diffs for verification. |
| 6 | Apply Markup | Click the "Apply" wand icon. Transfers function names, comments (pre/post/plate/eol), references, bookmarks, and more. |
| 7 | Verify | Open game2.exe—most documented functions now have your original names and notes. |

This process is dynamic and based on code structure/flow/bytes, making it highly effective for sequels where functions are copied or slightly altered. It often matches thousands of functions automatically, far outperforming manual byte-signature scanning.

#### Advanced Fuzzy Matching: BSim
Introduced in Ghidra 11.0 and improved since, **BSim** uses feature vectors for fuzzy function similarity, handling compiler differences, optimizations, or minor changes common in sequels.

| Aspect | Description |
|--------|-------------|
| Setup | Enable BSim plugin. Create an H2 database (simple file-based). |
| Database Creation | Analyze game1.exe, generate and commit function signatures to the database via headless or GUI scripts. |
| Query | Analyze game2.exe, query the database—BSim suggests matches with similarity scores. |
| Application | Right-click matches to apply function signatures, names, and data types en masse. |
| Strengths | Excellent for stripped binaries or when exact bytes differ but logic remains similar. |

BSim complements Version Tracking for harder cases.

#### Comparison with Traditional Sig Scanning
Traditional sig scanning relies on masked byte patterns (e.g., ?? for relocations). Ghidra has community scripts:
- **Sigga** or **MakeSig.py**: Generate patterns from selected functions/code.
- Manual scanning via custom scripts or memory search.

However, for bulk migration, these are inferior—patterns break easily with recompilation, and applying thousands manually is tedious. Function-level tools (Version Tracking/BSim) are more robust and automated.

#### Alternatives and Extensions
- **BinDiff**: Export via BinExport plugin, diff externally, then use BinDiffHelper extension to auto-apply names.
- **Ghidriff**: Python-based diffing tool using Ghidra's API for patch/sequel analysis.

| Tool | Matching Type | Automation Level | Best For |
|------|---------------|------------------|----------|
| Version Tracking | Exact + Similar (flow/bytes) | High (bulk apply) | Porting full documentation |
| BSim | Fuzzy (feature vectors) | High | Minor code changes |
| BinDiff | Graph-based | High (with extension) | Precise diffing |
| Manual Sigs | Byte patterns | Low | Specific offsets/variables |

In practice, start with Version Tracking—it's free, built-in, and directly solves migrating documentation across similar executables like game sequels.

#### Key Citations
- [Ghidra Version Tracking Documentation](https://github.com/NationalSecurityAgency/ghidra/blob/master/Ghidra/Features/VersionTracking/src/main/help/topics/VersionTrackingPlugin/Version_Tracking_Intro.html)
- [Fuzzy Matching with Ghidra BSim Guide](https://www.pentestpartners.com/security-blog/fuzzy-matching-with-ghidra-bsim-a-guide/)
- [Ghidriff: Ghidra Binary Diffing Engine](https://clearbluejar.github.io/posts/ghidriff-ghidra-binary-diffing-engine/)
- [BinDiff GitHub Repository](https://github.com/google/bindiff)
- [Version Tracking Workflow Example](https://www.lrqa.com/en/cyber-labs/version-tracking-in-ghidra/)
