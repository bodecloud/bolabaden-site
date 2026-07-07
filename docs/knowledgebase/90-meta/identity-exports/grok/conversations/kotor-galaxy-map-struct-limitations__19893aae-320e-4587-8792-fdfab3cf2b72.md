---
source_url: "https://grok.com/c/19893aae-320e-4587-8792-fdfab3cf2b72"
conversation_id: "19893aae-320e-4587-8792-fdfab3cf2b72"
title: "KOTOR Galaxy Map Struct Limitations"
extracted_at: "2026-06-29T16:38:01.482Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# KOTOR Galaxy Map Struct Limitations

Source: [Grok conversation](https://grok.com/c/19893aae-320e-4587-8792-fdfab3cf2b72)

## User

_Time: 2025-12-23T22:08:52.792Z_

please answer wizard's question in detail. Pull up any and all links.

## Assistant

_Time: 2025-12-23T22:09:23.606Z_

**Key Points**
- Resizing the GlxyMap struct in KOTOR's executable is challenging because field offsets become hardcoded in assembly code across many functions.
- Lane's explanation highlights that C++ member accesses (e.g., obj->field_at_0x1C) compile to direct pointer + offset additions, scattering these hardcodes widely.
- Migrating the struct to a larger unused memory area could work in theory but requires extensive reverse engineering and patching to update all references.
- Evidence from KOTOR modding shows a hard limit of around 16 planets on the galaxy map, likely tied to this struct's fixed size.
- No direct public issue #27 found in the referenced repo, but the discussion aligns with known hardcoded limitations in the game.

**Understanding the Problem**
The galaxy map in *Star Wars: Knights of the Old Republic* (KOTOR 1 or 2) relies on a data structure (referred to as GlxyMap, sized 0x10 per entry or similar) that holds planet entries. The game hardcodes assumptions about this struct's size and layout in the executable (swkotor.exe or swkotor2.exe), limiting modders' ability to expand it for more planets.

**Why Resizing Isn't Simple**
In compiled C++ code, accessing a struct member like `glxyMap.planets[5].name` or a field at offset 0x1C translates to assembly instructions like `mov eax, [ebx + 0x1C]`, where ebx is the pointer to the struct. These offsets appear explicitly in disassembled code across dozens or hundreds of functions—anywhere the galaxy map loads, renders, counts planets, checks availability, or handles navigation.

If you increase the struct size (e.g., to add more fields or allow more entries):
- All subsequent fields shift offsets → Code accessing later fields breaks unless every instance updates.
- Loops or counts assuming fixed size (e.g., hardcoded 16 iterations) fail → This matches Wizard's concern about missing some references.
- Array length isn't always a nice `.Length()` call → Often, the game uses hardcoded constants or calculates based on fixed size.

This scatters hardcodes, making exhaustive updates risky—one missed reference causes crashes, corrupted data, or subtle bugs.

**Wizard's Suggestions Evaluated**
1. **Updating all references to a .Length() or similar unified function**  
   Unlikely unified. KOTOR's Odyssey engine code (decompiled views show this) uses direct memory accesses and hardcoded values in many places. Modders report failing to find/patch all instances when attempting similar changes.

2. **Migrating the GlxyMap struct to unused memory**  
   Possible in advanced reverse engineering: allocate new larger struct in free EXE space or heap, then redirect all loads/stores to the new location.  
   Requires hooking every function accessing the old struct and adjusting pointers/offsets.  
   Tools like LaneDibello's Kotor-Patch-Manager (DLL injection for runtime patching) could help without permanent EXE mods, but still needs identifying all access points.  
   Feasible for skilled RE modders but labor-intensive; no known mod has fully succeeded in removing the planet limit this way.

**Known Galaxy Map Limitations in Modding**
Major projects like the Expanded Galaxy Project hit a hard-coded limit of ~16 planets, preventing further additions without EXE hacks. Attempts to bypass focus on reusing slots or porting content, not resizing the struct. Some hardcoded edits exist for other features (e.g., level caps), but galaxy map remains restricted.

---

The discussion in the provided Discord snippet captures a common pain point in KOTOR reverse engineering and modding: dealing with hardcoded data structures in a 20+ year-old executable.

Lane's response accurately summarizes the core issue. In modern C++ source code, struct accesses look clean and offset-agnostic, but once compiled to machine code, every member access bakes in a literal offset from the base pointer. For a globally used structure like the galaxy map (loaded once or referenced frequently), these offsets appear in:
- Rendering code for drawing planet icons and connections.
- Navigation logic for selecting/hyperjumping to planets.
- Availability checks (e.g., story-progress unlocked planets).
- Save/load routines.
- UI population functions.

This means resizing the per-planet entry (if 0x10 bytes each) or the overall map array shifts everything downstream, requiring patches to potentially hundreds of instructions.

Wizard's analogy to a unified `x.Length()` call would be ideal if the original developers designed it that way (e.g., storing a count field and always reading it), but evidence from decompilations and modding attempts suggests heavy reliance on constants. For example, the observed 16-planet limit strongly implies either a fixed array of 16 entries or loops hardcoded to 16.

Migrating the entire structure to a different memory location (e.g., padding/unused sections in the EXE or dynamic allocation) is a known technique in RE for avoiding offset conflicts—you keep the old location as a stub/pointer to the new one. However, it still requires:
- Finding all reads/writes to the old address.
- Injecting hooks or NOP-ing and redirecting them.
- Ensuring no code relies on the struct being at a specific absolute address.

Projects like Kotor-Patch-Manager by LaneDibello facilitate exactly this kind of runtime patching via DLL injection, avoiding direct EXE modification and improving compatibility. It's likely that issue #27 in that repo (not publicly visible or perhaps closed/private) was discussing implementing such a patch for the galaxy map, but no completed mod achieves unlimited planets, indicating the complexity.

| Aspect                  | Simple Resize Impact                          | Migration to New Memory Impact                  | Real-World Outcome                          |
|-------------------------|-----------------------------------------------|-------------------------------------------------|---------------------------------------------|
| Offset References      | All post-resize fields break                   | Old offsets can redirect to new layout         | Requires full audit either way              |
| Hardcoded Counts/Loops | Likely break (e.g., max 16 planets)           | Easier to inject dynamic count checks          | Planet limit remains in major mods           |
| Risk of Missed Patches | High (crashes, corruption)                    | High (if any access missed)                    | Modders avoid due to instability            |
| Tools Available        | Hex editing, IDA/Ghidra                       | DLL injection (e.g., Kotor-Patch-Manager)      | Some success in smaller hacks               |

In summary, both approaches are theoretically viable but practically very difficult due to the scattered nature of the references. The modding community has largely accepted the ~16 planet limit and worked around it by reusing slots or adding content differently.

**Key Citations**
- https://github.com/LaneDibello/Kotor-Patch-Manager (Patching framework discussed in the conversation)
- https://www.moddb.com/mods/kotor-ii-tsl-expanded-galaxy (Expanded Galaxy Project noting hard-coded 16 planet limit)
- https://www.moddb.com/mods/kotor-ii-tsl-expanded-galaxy/news/hardcoded-executable-edits (Discussion of hardcoded EXE edits in KOTOR modding)
- https://deadlystream.com/ (Primary KOTOR modding forum; search for "galaxy map" or "planet limit" yields related threads)
- https://www.reddit.com/r/kotor/comments/afo87r/expanded_galaxy_project_beta_k1_k2/ (Early discussion of attempting to bypass planet limits)
