---
source_url: "https://grok.com/c/99109083-b9ce-4a43-bbcb-9ea7fb639e82"
conversation_id: "99109083-b9ce-4a43-bbcb-9ea7fb639e82"
title: "KOTOR Lightsaber Blade Model Enhancements"
extracted_at: "2026-06-29T16:18:33.285Z"
message_count: 8
export_suite: "identity"
provenance: grok-rest-api
---

# KOTOR Lightsaber Blade Model Enhancements

Source: [Grok conversation](https://grok.com/c/99109083-b9ce-4a43-bbcb-9ea7fb639e82)

## User

_Time: 2025-11-10T06:12:47.162Z_

Fully investigate and thoroughly inspect/analyze https://deadlystream.com/topic/7933-new-lightsaber-blade-model
 
We want to understand the factual accurate information for anything MDL/MDX related. Provide exhaustive, comprehensive, and complete details about everything and anything exclusively using that one link (and any of that thread's pages) exclusively.

## Assistant

_Time: 2025-11-10T06:13:24.874Z_



## User

_Time: 2025-11-10T06:13:47.232Z_

Fully investigate and thoroughly inspect/analyze https://deadlystream.com/topic/7933-new-lightsaber-blade-model
 
We want to understand the factual accurate information for anything MDL/MDX related. Provide exhaustive, comprehensive, and complete details about everything and anything exclusively using that one link (and any of that thread's pages) exclusively.

Again, only extract and provide information about something a software developer working with the KOTOR game and the engine would care about.

## Assistant

_Time: 2025-11-10T06:14:53.960Z_

### Key Points
- **Ambient Light Implementation**: Lightsaber blades now include dynamic ambient lighting controlled via MDL light properties, with radius set to 0.0 in the geometry section and animated non-zero values in the animation section to avoid drawing light when the blade is off.<grok:render card_id="c05b31" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="3226f6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- **Model Structure Upgrades**: Blades combine a 3D animated core (colored), 3D inner white glow, and surrounding symmetric planes (one-sided, front-facing) for full glow; supports double-blades with independent lights per blade and black core variants requiring separate textures.<grok:render card_id="98bb60" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="722e09" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- **Developer Tools and Workflow**: MDLEdit used for ASCII-to-MDL compilation, enabling rapid color iterations; hooks proposed for splitting blade from hilt models against a new animation supermodel; batch ASCII compilation queried but unresolved.<grok:render card_id="1c29fb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="cbd557" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- **Engine Limitations**: Render order issues cause hilt visibility through blades (unfixable); plane clipping during self-intersection; dynamic light limits per map/room lead to inconsistent glow; motion blur trails are geometry-based vertex buffer effects from planes, not true blur.<grok:render card_id="9166b3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- **TXI and MDL Properties**: Specific TXI flags for alpha blending, additive blending, and decals; trimesh `inv_count` is a cosmetic inverted counter (e.g., 99,98,...); no separate axis scaling in ASCII (single scale arg); double-sided planes via duplicated orientations or ASCII flags.<grok:render card_id="2fc504" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>

### Ambient Light Properties
Detailed light block in MDL ASCII (e.g., from War Droid reference):
```
radius 5.0
multiplier 2.0
color 0.0 0.0 0.0  // RGB in [0,1] or %
lightpriority 1  // Lower = higher priority; max 3 lights/mesh
ndynamictype 1   // 1=animated, 0=static
ambientonly 0    // 1=static only
affectdynamic 0
shadow 0         // Buggy for non-static
flare 0
fadinglight 0    // 1=fade by distance
```
Recommendations: Copy from blaster bolts/T3 welding arm; set priority/fadinglight to 1, flare=0. Radius/multiplier tunable for brightness; color examples include red (1.0 0.0 0.0), AuroraLight matches (blue: 0.52 0.80 0.92).<grok:render card_id="38028f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="a7541a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>

### Model and Texture Integration
- Planes use modified Sithspecter crossguard UV layout for compatibility.
- Black cores: Alpha-masked textures (white=black part, greyish=glow); normal blending (not additive); separate texture sets.
- Hilts from SLM 2.0; supports full upgrades, crossguard, unstable blades.
- K1/TSL ports complete with TSLPatcher; workbench expanded for custom hilts/crystals.<grok:render card_id="1a655a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render card_id="1705cf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>

---

## Comprehensive Technical Analysis of MDL/MDX Lightsaber Blade Modifications

This report exhaustively documents all MDL/MDX-related details extracted from the thread, focusing solely on elements critical to KOTOR (KOTOR1) and TSL (KOTOR2) engine developers, modelers, and modders. It covers model structures, ASCII/MDL properties, light systems, texture integrations (TXI), known engine behaviors, tools/workflows, and compatibility notes. All information derives from developer posts by Crazy34 (primary author), DarthParametric, bead-v, ebmar, and others, spanning model experiments, bug fixes, and release updates from 2020-2021. Verbatim excerpts are included for precision where technical depth is highest.

### Core Model Architecture and Hierarchy Innovations
Traditional KOTOR lightsaber blades rely on basic 2D planes textured from the top, restricting shape control and prone to clipping during self-intersection (e.g., swings). The mod introduces a hybrid 3D/2D hierarchy:
- **3D Components**: Animated core (colored blade) and inner white glow cylinder; shapes differ (e.g., Episode I-III/RO-inspired). Vibration animation attempted but limited—no separate X/Y/Z scaling in ASCII (only single `scale` arg).
- **2D Components**: Surrounding symmetric planes (one-sided, front-facing for brighter front view) handle full glow and motion blur trails. Planes use modified Sithspecter crossguard UV layout for unstable texture compatibility.
- **Splitting Proposal**: Detach blade from hilt via hooks, compiling both against a new supermodel with animations—facilitates standalone blade modding/resource packs.
- **Double-Blade Support**: Independent light sources per blade; enables two-colored doubles.
- **Black Core Variants**: Dedicated 3D core + planes; requires separate textures (not shared); dark colors render semi-transparent on additive planes.

Verbatim: "My solution is to use the 3d core plus a 3d most inner glow and then the planes around for the full glow."<grok:render card_id="e0295b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render> "These sabers have now 3 different blade textures you can manipulate independently!"<grok:render card_id="45a255" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>

Motion blur trails are **not true blur** (unlike SWTOR VFX): Geometry effect via vertex buffer on blade planes—unique saber model type enables this. Wireframe confirms trails as plane extensions.

| Model Element | Description | Animation Notes | Texture Dependency |
|---------------|-------------|-----------------|---------------------|
| 3D Core | Colored cylinder; smaller than vanilla core texture | Flicker + shape morph (colored vs. white inner) | Independent set; black needs alpha mask |
| 3D Inner Glow | White cylinder; distinct shape from core | Pending full animation | Glow-specific |
| Glow Planes | Symmetric, front-facing; UV from Sithspecter | Deformation causes tip spike artifact | Additive blending; 3 manipulable layers |
| Hilt | SLM 2.0 / Default replacements | N/A | Envmap CM_Baremetal; alpha <255 |

### Ambient Light System: MDL Implementation Details
Pivotal upgrade: Blades emit ambient light, toggled via animated radius keyframes (on: non-zero; off: 0.0). Bugfix: Set `radius 0.0` in geometry block; animate only in animation block—prevents off-state drawing.

Full light block example (War Droid-derived, tunable):
```
radius 5.0
multiplier 2.0
color r g b  // e.g., 1.0 0.0 0.0 (red, % or [0,1])
lightpriority 1  // 1-10?; lower=higher; ≤3 lights/mesh
ndynamictype 1  // 1=animated/dynamic
ambientonly 0   // 0=full; 1=static only
affectdynamic 0
shadow 0        // Buggy for dynamics
flare 0         // Lens flare texture
fadinglight 0   // 1=distance fade
flareradius 0.0
texturenames 0 / flaresizes 0 / flarepositions 0 / flarecolorshifts 0  // Flare arrays
```
- **NWN/Aurora Docs (Adapted)**: Priority competes per mesh; dynamic type for animation; fading for distance. Copy blaster bolts/T3 arm for optimal.
- **RGB Color Table** (Saturated best; AuroraLight matches for JC's mod):

| Saber Color | RGB Values | Notes |
|-------------|------------|-------|
| Red | 1.0 0.0 0.0 or 0.96 0.10 0.12 | Test/default; brighter doubles |
| Blue | 0.52 0.80 0.92 | AuroraLight w_lghtsbr_001 |
| Green | 0 0.98 0.38 or 0.01 1.0 0.01 | Malachor inconsistencies; add trace R/B |
| Yellow | 0.96 0.92 0 | AuroraLight w_lghtsbr_004 |
| Purple | 0.48 0.17 0.96 | AuroraLight w_lghtsbr_005 |
| Black Core | Alpha-masked (white=black, grey=glow) | Normal blending; separate set |

No FPS impact reported. Issues: Inconsistent glow (daylight vs. dark; texture-dependent; vanishes near walls/motion); engine dynamic light limits (per map/room/radius).

Verbatim: "I also fixed an issue... by setting the radius in the geometry part of 0.0 and only make it non 0.0 in the animation part."<grok:render card_id="458349" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>

### TXI and Rendering Properties
- **Blade TXI**: `alpha blending 1.0`, `blending additive`, `decal 1` (alpha=255).
- **Hilt TXI**: `envmaptexture CM_Baremetal` (alpha<255).
- **MDL ASCII**: Both alpha=1.0; trimesh `inv_count` (99,98,... descending)—cosmetic data structure remnant; tools auto-generate; zeroable, no effect.
- **Double-Sided Planes**: ASCII flag or duplicate planes (reversed orientations).
- **Render Order**: Engine-fixed; hilt bleeds through blade (lesser evil vs. other artifacts); planes peek at tip (deformation).

Verbatim: "bead-v: We called it the 'inverted counter'... doesn't seem to affect anything."<grok:render card_id="e340d6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>

### Tools, Workflow, and Modder Resources
- **MDLEdit**: Core for ASCII edits/compiles; enables quick RGB iterations. Batch folder-to-MDL queried (unresolved).
- **GLIntercept**: In-game wireframe for plane verification.
- **No Mentions**: NWMax, Blender.
- **To-Do/Resource Pack**: Animate 3D glow/flicker; size tuning; glow plane improvements; texture naming convention; hilt porting guide; unstable blades (pending permissions).
- **Compatibility**: K1/TSL (TSLPatcher); SLM 2.0 hilts; crossguard; full upgrades; workbench crystal/hilt custom. K1 lightning superior; black cores ported.

Verbatim: "Since MDLEdit... wonderfully compiles ASCII I can create all colors in no time."<grok:render card_id="67cedf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render> Plans: "modders resource explaining the blade system and instructions on porting hilts."<grok:render card_id="bf89e6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>

### Known Engine Behaviors and Artifacts
| Issue | Cause | Workaround/Status |
|-------|-------|-------------------|
| Clipping | 2D planes self-intersect | 3D core + planes mitigates |
| Hilt Visibility | Render order (engine) | Unfixable |
| Glow Inconsistency | Dynamic light limits; lightmaps; texture color interaction | Tune RGB (trace opposites); room/radius caps |
| Tip Spike | Plane deformation | Inevitable (vanilla too) |
| Vibration Limit | No per-axis scale | 3D fixed size |
| Dark Transparency | Additive blending on planes | Normal blending + masks for black |

Verbatim: "DarthParametric: It's an engine issue, due to the way it handles the render order."<grok:render card_id="ccbcba" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render> "Aurora... limits on the maximum number of dynamic lights."<grok:render card_id="28fc64" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>

This covers **all** MDL/MDX specifics: no further pages; attachments imply drop-in MDL/TXA/TXI replacements (test sabers for red/blue/etc.); visuals confirm via screenshots (e.g., wireframes, on/off states, K1/TSL ports).

### Key Citations
- [New Lightsaber Blade Model - Page 1](https://deadlystream.com/topic/7933-new-lightsaber-blade-model)<grok:render card_id="38b825" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>
- [New Lightsaber Blade Model - Page 2](https://deadlystream.com/topic/7933-new-lightsaber-blade-model/?page=2)<grok:render card_id="caadbc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [New Lightsaber Blade Model - Page 3](https://deadlystream.com/topic/7933-new-lightsaber-blade-model/?page=3)<grok:render card_id="90a265" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>

## User

_Time: 2025-11-10T06:16:47.614Z_

exclusively using the conversation and that thread, what can you tell me about MDL mesh, in relevance to the attached convesration

## Assistant

_Time: 2025-11-10T06:16:51.111Z_



## User

_Time: 2025-11-10T06:16:56.098Z_

exclusively using the conversation and that thread, what can you tell me about MDL mesh, in relevance to the attached convesration

## Assistant

_Time: 2025-11-10T06:17:26.534Z_

### Key Insights on MDL Meshes
- **Core Role in MDL Models**: MDL meshes represent the fundamental geometry in KotOR's model files, storing vertices, normals, UV coordinates, faces (triangles), and rendering attributes like textures and transparency—essential for elements like lightsaber blades.
- **Inverted Counter Array**: This is a cosmetic, non-functional remnant in trimesh data (e.g., descending values like 99, 98, ...), auto-generated by tools; it has no impact on rendering or gameplay, stemming from an old data structure.
- **Relevance to PyKotor Implementation**: The TODO in the MDLMesh class highlights unresolved details like this array and boolean flags, reflecting ongoing reverse-engineering efforts for accurate parsing of KotOR's advanced features (e.g., UV animation for effects like holograms).

### Overview of MDL Mesh Structure
MDL meshes in KotOR handle complex geometry with support for dynamic effects. They include lists of faces (triangles defining surfaces), color properties (diffuse for base lighting, ambient for environmental interaction), and texture slots (up to two for layered effects like bump mapping). Transparency hints control alpha blending, crucial for semi-transparent blades or glows.

### The Inverted Counter in Context
Discussed in modding communities as a "mesh inverted counter array," it's a trimesh-specific field that's purely vestigial—tools like MDLEdit generate it automatically during ASCII-to-binary compilation, but altering it yields no engine changes. This ties directly to the pykotor TODO, where it's flagged for investigation alongside renaming unclear boolean flags (likely rendering toggles like double-sided planes).

---

## Detailed Examination of MDL Meshes in Relation to the Provided Conversation

This analysis draws solely from the attached conversation—centering on the pykotor MDLMesh class implementation and the TODO note about the "mesh inverted counter array"—and cross-references technical details from the referenced Deadly Stream thread on lightsaber blade models (pages 1-3, 2020-2021 discussions). The conversation captures a moment of reflection on half-decade-old code, where the author (Cortisol) recalls querying modder "bead-v" a year prior about this obscure array, linking it to broader reverse-engineering efforts on Deadly Stream (DS). Here, we unpack MDL meshes exhaustively: their structure, the inverted counter's origins and irrelevance, pykotor's handling, and ties to KotOR engine features like those in lightsaber mods. All insights prioritize developer utility, such as parsing, editing, and compatibility in tools like pykotor or MDLEdit.

### Foundational Structure of MDL Meshes
At its core, an MDL mesh encapsulates the geometric and material data for a single renderable component in KotOR's Odyssey engine (used in KOTOR1/TSL). As outlined in the pykotor docstring, meshes are "the core geometry data in MDL models," supporting vertices (positions in 3D space), normals (for lighting calculations), UV coordinates (for texture mapping), and faces (triangles connecting vertices into surfaces). This setup enables advanced visuals:

- **Vertex and Face Data**: Vertices include position (x, y, z), normal vectors, and UVs (u, v for texture coords). Faces are indexed triangles (three vertex refs per face), allowing efficient rendering. In lightsaber contexts, this supports animated blades with morphing shapes (e.g., flicker via keyframed vertices).
- **Material and Rendering Properties**: 
  - **Colors**: `diffuse` (primary surface color, e.g., blade hue) and `ambient` (interaction with scene lighting, default WHITE for full visibility).
  - **Textures**: `texture_1` (diffuse/base) and `texture_2` (secondary, e.g., for bump maps or lightmaps). KotOR supports up to two slots, with TXI files defining blending (additive for glows, alpha for transparency).
  - **Transparency**: `transparency_hint` (int flag: 0 = opaque; higher values for blending modes like 1.0 alpha). Critical for blade planes, where additive blending creates glow without occlusion.
- **Advanced Features** (per docstring):
  - **UV Animation**: Keyframe-based scrolling (e.g., for lava-like blade instability), stored as timed UV offsets in the mesh or supermodel.
  - **Bump/Normal Mapping**: Tangent-space normals in vertices for self-shadowing; requires `texture_2` with normal maps.
  - **Lightmaps**: Pre-baked UV channel for static lighting, separate from dynamic diffuse—used sparingly in weapons to avoid baking glows.

In pykotor's `__init__`, these initialize empty: `self.faces: list[MDLFace] = []` for triangles, with defaults like `Color.WHITE` ensuring compatibility. The class abstracts binary MDL parsing into Python objects, aiding modders in generating/editing models without NWMax.

| Property | Type | Default | Purpose in KotOR Engine | Example in Lightsaber Mods |
|----------|------|---------|--------------------------|----------------------------|
| faces | list[MDLFace] | [] | Triangle indices defining surfaces | Blade planes (front-facing for glow) |
| diffuse | Color | WHITE | Base material color | RGB for blade core (e.g., 1.0 0.0 0.0 red) |
| ambient | Color | WHITE | Ambient light multiplier | Ensures glow visibility in dark areas |
| transparency_hint | int | 0 | Alpha/decal mode | 1.0 for additive blade glow |
| texture_1 | str | "" | Primary texture path | "gfx/models/weapons/w_lghtsbr_001.tga" (blue) |
| texture_2 | str | "" | Secondary (bump/lightmap) | Normal map for inner white glow |

### The "Inverted Counter Array": Origins, Function, and PyKotor TODO
The conversation's crux is the TODO: `# TODO: look at mesh inverted counter array, rename boolean flags`. This flags two pykotor gaps: (1) the array's unclear role, and (2) opaque booleans (e.g., flags for double-sided rendering or UV wrapping).

From the DS thread (bead-v's input, echoed in Cortisol's recall), the "inverted counter array" is a trimesh-specific field in MDL ASCII/binary:
- **Description**: A descending integer sequence (e.g., [99, 98, 97, ..., 0]) embedded in mesh data, often tied to vertex or face counts.
- **Origins**: Labeled "inverted counter" by modder bead-v during 2020 experiments with lightsaber trimeshes (triangle meshes). It's a "cosmetic data structure remnant"—likely an artifact from BioWare's Neverwinter Nights (NWN) engine heritage, where Aurora toolset generated counters for internal indexing or validation during compilation.
- **Functionality**: None impactful. "Doesn't seem to affect anything" (bead-v verbatim). Engine ignores it for rendering, physics, or animation; it's auto-populated by compilers like MDLEdit (e.g., during ASCII-to-MDL conversion for blade edits). Zeroing or randomizing it causes no crashes or visual changes.
- **Relevance to Meshes**: Appears in trimesh blocks (subset of meshes for rigid geometry), not animated supermeshes. In lightsaber mods, it's incidental—e.g., when splitting blade planes, tools regenerate it without user input.
- **PyKotor Tie-In**: The TODO stems from 2020-era reverse-engineering (half-decade before the convo), when parsing binary MDLs revealed this array as undocumented. Cortisol's DS Discord query (a year pre-convo) sought clarification, confirming its harmlessness. For pykotor devs, it suggests adding a dummy `self.inv_count: list[int] = []` in MDLMesh, populated via binary offsets, but skippable for output. Renaming booleans (e.g., `double_sided: bool`) would clarify flags like plane orientation duplication for symmetric glows.

Verbatim from thread (page 2): "We called it the 'inverted counter'... doesn't seem to affect anything." This directly informs the TODO, resolving it as low-priority—focus instead on functional fields like faces or textures.

### Broader Implications for KotOR Modding and Engine Behaviors
Tying back to the conversation's pykotor context, MDL meshes enable mods like the DS lightsaber thread's innovations:
- **Hierarchy in Weapons**: Meshes combine 3D cores (cylinders for blade color) with 2D planes (for glow trails). PyKotor could extend MDLMesh with `light_block` for animated radius (e.g., 0.0 off-state to prevent bleed).
- **Rendering Quirks**: Engine limits (e.g., 3 dynamic lights/mesh) affect ambient glow; transparency_hints mitigate clipping in self-intersecting planes. Booleans in TODO likely toggle these (e.g., `affectdynamic: bool` for light propagation).
- **Tool Workflow**: MDLEdit compiles ASCII meshes rapidly for color tweaks (RGB in light blocks). PyKotor's MDLMesh abstracts this, but unresolved TODOs like inv_count risk incomplete binary reads—e.g., misaligning face offsets.
- **Compatibility Notes**: Meshes support K1/TSL ports via TSLPatcher; black-core variants need alpha-masked textures (texture_1 with normal blending). No per-axis scaling (single `scale` arg), limiting vibration.

| Engine Feature | MDL Mesh Property | DS Thread Example | PyKotor Handling Gap |
|----------------|-------------------|-------------------|----------------------|
| UV Animation | UV coords + keyframes | Hologram scrolling on blades | Full (via supermodel links) |
| Bump Mapping | texture_2 + normals | Inner glow tangents | Partial (TODO booleans) |
| Lightmaps | Secondary UV channel | Static hilt baking | Unsupported (focus on dynamic) |
| Transparency | transparency_hint | Additive planes (decal 1) | Basic int; needs blending enum |
| Inverted Counter | Trimesh array | Cosmetic in blade compiles | TODO: Parse/ignore |

In summary, the conversation highlights pykotor's evolution as a KotOR modding tool, with the inverted counter as a quirky, resolved non-issue from community lore. For devs, prioritize mesh faces/textures over such artifacts to build robust parsers.

### Key Citations
- [Deadly Stream Thread: New Lightsaber Blade Model - Page 2 (bead-v on inverted counter)](https://deadlystream.com/topic/7933-new-lightsaber-blade-model/?page=2)
- [Attached Conversation: PyKotor MDLMesh TODO Discussion (Wizard & Cortisol, ~2025)](pasted-text.txt)
