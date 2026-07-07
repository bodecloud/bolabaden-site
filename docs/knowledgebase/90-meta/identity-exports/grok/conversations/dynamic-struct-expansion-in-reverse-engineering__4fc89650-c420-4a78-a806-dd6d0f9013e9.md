---
source_url: "https://grok.com/c/4fc89650-c420-4a78-a806-dd6d0f9013e9"
conversation_id: "4fc89650-c420-4a78-a806-dd6d0f9013e9"
title: "Dynamic Struct Expansion in Reverse Engineering"
extracted_at: "2026-06-29T16:13:58.354Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Dynamic Struct Expansion in Reverse Engineering

Source: [Grok conversation](https://grok.com/c/4fc89650-c420-4a78-a806-dd6d0f9013e9)

## User

_Time: 2025-12-23T22:10:57.325Z_

Please answer wizard's question more fully. I'm just wondering why he doesn't simply move the struct to some different address that has extra space for the struct...? why does his solution about int* work properly? wouldn't that still require him to update all references?

## Assistant

_Time: 2025-12-23T22:11:22.251Z_

**Key Points**
- Moving the entire GlxyMap struct to a new memory location with more space isn't straightforward because the original struct is likely a global or static object at a fixed address hardcoded throughout the executable.
- Resizing the struct in place risks breaking numerous offset references, as C++ member accesses compile to fixed pointer + offset calculations scattered across many functions.
- Lane's solution—replacing the fixed-size inline array (e.g., int[16] for available planets) with a dynamically allocated int* pointer—preserves existing struct offsets for other fields while allowing the array to grow arbitrarily.
- This approach requires patching code to change how the array is accessed and allocated, but avoids the massive task of updating every offset reference in the binary.

**Why Moving the Struct Isn't Simple**
In reverse-engineered executables like KOTOR's swkotor.exe, global objects often reside at fixed addresses determined by the linker. Code across the binary directly references these addresses (e.g., via absolute loads or as base pointers). Relocating the entire GlxyMap struct to a new area with extra padding would require:
- Finding or injecting new code to allocate/move the struct at runtime.
- Patching every single reference to the old fixed address to point to the new one.

This is far more invasive than offset adjustments, as absolute addresses appear in dozens or hundreds of places. Without dynamic relocation (like position-independent code), it's impractical and risks instability. Even if unreferenced padding exists nearby, the struct's allocation is fixed—there's no guarantee of contiguous free space, and overlapping other data would crash the game.

**Why Lane's int* Pointer Solution Works Better**
The core issue is that expanding a fixed-size array inside the struct (e.g., from 16 to more planets) shifts all subsequent member offsets. Since compiled C++ code uses hardcoded offsets like `struct_ptr + 0x1C` for member access, this breaks every reference to later fields.

Lane's approach sidesteps this by:
- Treating the "available_planets" field as an `int*` pointing to a separately allocated array (dynamically sized as needed).
- Allocating this array elsewhere (e.g., on the heap or in padded memory).
- Patching only the code that directly reads/writes/modifies this specific array (e.g., loops iterating over planets, unlocks, etc.).

Other struct members keep their original offsets, so untouched code continues working. While it still requires updating references to this field (now dereferencing a pointer instead of inline array), it's a targeted change—far fewer locations than rewriting every offset in the entire binary.

This is a classic reverse-engineering strategy for expanding hard-coded limits without a full struct overhaul.

---

In the context of modding *Star Wars: Knights of the Old Republic* (KOTOR 1), the galaxy map uses a global structure (here called GlxyMap) to track data like unlocked/available planets. The vanilla game limits this to around 16 planets, likely via a fixed-size array (e.g., `int available_planets[16]` or similar, contributing to the 0x10-related sizing mentioned).

Wizard's suggestion—migrating the whole struct to a larger unreferenced memory area—assumes the struct could be relocated without side effects. However, in a compiled executable:

- Global structs are often at fixed virtual addresses.
- Instructions load the base address directly (e.g., `mov eax, offset GlxyMap_global`).
- Relocating requires either:
  - Changing it to dynamic allocation (adding new init code).
  - Patching all absolute references (potentially hundreds).

This is risky and labor-intensive, especially in an old game like KOTOR without source access.

Lane highlights the offset problem: C++ member access becomes `base + fixed_offset` in assembly. Inserting space for a larger array shifts everything after it, breaking code like:

```assembly
mov eax, [glxymap_ptr]
mov ecx, [eax + 0x50]  ; some later field—now wrong if array expanded
```

Finding and fixing *all* such offsets is error-prone; missing one causes crashes or bugs.

Instead, Lane decouples the expandable part:

- Change the array field to a pointer (`int* available_planets`).
- Allocate the larger array separately (heap or spare memory).
- Patch allocation code to size it dynamically.
- Update access code to use `* (ptr->available_planets + index)` instead of inline array.

Benefits include:
- No offset shifts for other fields.
- Unlimited array size.
- Fewer patches needed (only array-related logic).

Drawbacks: Still requires identifying and modifying all array accesses/loops, plus adding allocation logic. But it's more feasible than full relocation or resize.

| Approach                  | Pros                              | Cons                                      | Patch Scope                     |
|---------------------------|-----------------------------------|-------------------------------------------|---------------------------------|
| Resize struct in place    | Keeps original layout mostly     | Shifts all later offsets; high risk of misses | Very high (all struct references) |
| Move entire struct        | Potential large space            | Hard to redirect fixed address references | Extremely high (address + offsets) |
| Pointer to separate array | No offset shifts; flexible size  | Needs allocation + access changes        | Medium (array-specific code)    |

This pointer technique is common in game modding for expanding limits (e.g., more items, quests) without breaking compatibility.

**Key Citations**
- General reverse engineering principles on struct offsets in compiled C++: Resources from Ghidra/IDA documentation and Stack Exchange discussions on identifying structs via offsets.
- KOTOR-specific context: Community discussions on galaxy map limits (hardcoded ~16 planets) in mods like Expanded Galaxy Project.
