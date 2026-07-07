---
source_url: "https://grok.com/c/f64f75f8-543f-4c4f-be93-f5051ec301e3"
conversation_id: "f64f75f8-543f-4c4f-be93-f5051ec301e3"
title: "Modular Debugging of Indoor Builder Failures"
extracted_at: "2026-06-29T16:11:07.490Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Modular Debugging of Indoor Builder Failures

Source: [Grok conversation](https://grok.com/c/f64f75f8-543f-4c4f-be93-f5051ec301e3)

## User

_Time: 2026-02-03T09:47:57.305Z_

Please group and separate into modular pieces that I can address and target step by step.

## Assistant

_Time: 2026-02-03T09:49:13.170Z_

### Modular Breakdown of Test Failures

I've grouped the failures into clear, independent modules that you can tackle sequentially. Each module focuses on a distinct root cause or subsystem, with specific symptoms, why it matters, and targeted next actions.

#### Module 1: Module Container Discovery (Highest Priority)
**Problem**  
The helper `_get_original_mod_path` only looks for `{root}.mod`.  
In vanilla KOTOR 1, the Dantooine sub-areas (danm14aa–danm14ad) are stored as `.rim` files, not `.mod`.  
In vanilla KOTOR 2, **all** modules are `.rim` files (001EBO.rim, 002EBO.rim, etc.).

This causes immediate `FileNotFoundError` for any module that isn’t a `.mod`, blocking almost all tests before they can even load data.

**Affected tests**  
- All K1 tests involving danm14aa–danm14ad (lyt room count, lyt positions, etc.)  
- All K2 tests (both lyt and wok walkable faces fail here first)

**Fix target**  
Update the discovery logic to accept either `.mod` or `.rim`.

```python
def _get_original_module_container_path(module_root: str, installation: Installation) -> Path:
    modules_dir = Path(installation.path()) / "modules"
    for ext in [".mod", ".rim"]:
        candidate = modules_dir / f"{module_root}{ext}"
        if candidate.exists():
            return candidate
        # case-insensitive fallback
        for f in modules_dir.iterdir():
            if f.stem.lower() == module_root.lower() and f.suffix.lower() == ext:
                return f
    raise FileNotFoundError(f"Module {module_root}.[mod|rim] not found in {modules_dir}")
```

Rename the function to reflect that it returns a container (mod or rim).

**After this fix**  
- K2 tests should now reach actual comparison logic.  
- K1 sub-area tests will reach comparison logic.  
- danm13 tests (already .mod) remain unchanged.

Do this first — it unblocks everything else.

#### Module 2: Original Geometry Loading Strategy for K1
**Problem**  
In KOTOR 1, area geometry files (LYT, VIS, MDL/MDX/WOK) live in global BIFs (layouts.bif, models.bif, etc.), **not** inside the module container (.mod or .rim).  
The current tests appear to extract “original” resources **only from the module container**, so original LYT/WOK counts are always 0 for vanilla K1 modules.

When the indoor builder rebuilds, it generates new WOKs → rebuilt counts > 0 → all geometry assertions fail (face count, vertex count, material distribution, byte-exact, etc.).

**Affected tests (after Module 1 fix)**  
- All K1 WOK-related tests (face count, walkable faces, vertex count, material distribution, bytes exact)  
- Potentially K1 LYT room count/positions once sub-areas are loadable

**Two viable paths**  

**Path A (Recommended – proper round-trip)**  
Load original geometry from the **full installation** (using the provided `k1_pykotor_installation`), not just the container.

Example sketch:
```python
original_lyt = k1_pykotor_installation.lyt(f"{area_resref}.lyt")  # pulls from BIF if needed
original_woks = {}
for room in original_lyt.rooms:
    wok_resref = room.model
    original_woks[wok_resref] = k1_pykotor_installation.wok(wok_resref)
```

Then compare rebuilt WOKs/LYT against these true originals.

**Path B (Quick workaround)**  
Accept that vanilla K1 modules have no geometry in container → skip or relax geometry assertions for K1, or mark them as expected-to-generate-new.

**Decision point**  
If the goal of the indoor builder round-trip is to verify that rebuilt walkmeshes **match the original game geometry**, go with Path A.  
If the goal is purely “save/load cycle doesn’t corrupt existing encapsulated data”, Path B is fine (but less valuable for K1).

#### Module 3: K2 Geometry Round-Trip (Becomes visible after Module 1)
Once `.rim` files are found, K2 tests will load actual original WOKs/LYTs from the .rim.

Current failures visible now:
- test_roundtrip_k2_lyt_room_count (will run)
- test_roundtrip_k2_wok_walkable_faces (will run)

Check whether:
- Room count/positions in rebuilt LYT match original
- Walkable face count matches

If they don’t, the issue is in the builder’s walkmesh generation or LYT reconstruction logic for TSL modules.

#### Module 4: Walkmesh Property Mismatches (Cross-game)
These will surface once originals are loaded correctly.

Current symptoms (from danm13, which already ran):
- Total faces, walkable faces, vertices differ
- Material distribution completely different
- Byte-exact fails (expected once counts differ)

Likely causes:
- Walkmesh generator produces different triangulation/order
- Material assignment logic differs from original Aurora engine
- Floating-point differences in vertex positions
- Different handling of room hooks/obstacles

These are the core algorithmic concerns in the indoor builder itself.

#### Module 5: Non-Geometry Round-Trip (Already Passing)
These tests already pass:
- required_resources_present
- are_structure, ifo_structure, git_structure
- ui_roundtrip_k1_via_builder_widget

This confirms that basic ERF/RIM read-write, ARE/GIT/IFO serialization, and UI widget loading/saving are solid.

You can largely ignore these unless new regressions appear.

### Recommended Tackle Order

1. **Implement Module 1 fix** (container discovery for .rim) → rerun.  
   Expect: K2 tests and K1 sub-area tests now reach comparison stage.

2. **Implement proper original geometry loading for K1** (Module 2, Path A preferred).  
   Rerun K1 geometry tests → see real mismatches vs. false “original=0” failures.

3. **Analyze remaining property mismatches** (Module 4) on both games.  
   Focus on walkmesh generation code.

4. **Fix K2-specific issues** (Module 3) if any remain after above.

This ordering minimizes noise and lets you see real algorithmic bugs quickly. Let me know what the run looks like after step 1!
