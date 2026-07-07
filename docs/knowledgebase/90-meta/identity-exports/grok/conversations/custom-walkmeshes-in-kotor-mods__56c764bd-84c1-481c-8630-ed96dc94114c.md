---
source_url: "https://grok.com/c/56c764bd-84c1-481c-8630-ed96dc94114c"
conversation_id: "56c764bd-84c1-481c-8630-ed96dc94114c"
title: "Custom Walkmeshes in KotOR Mods"
extracted_at: "2026-06-29T16:17:02.278Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Custom Walkmeshes in KotOR Mods

Source: [Grok conversation](https://grok.com/c/56c764bd-84c1-481c-8630-ed96dc94114c)

## User

_Time: 2025-11-25T02:19:32.556Z_

there have been very very few mods for Star wars knights of the old republic that have managed to make their own walkmeshes and modules without just repurposing an existing one. Please name some of these mods, the people that have done it, and the tools they've used. Browse mixmojo, deadlystream, lucasforumsarchive, etc to find everything and anything that can help me learn how to do this. the attached markdown files are documentation on the file formats responsible for achieving this.

## Assistant

_Time: 2025-11-25T02:20:59.755Z_

**Brotherhood of Shadows: Solomon's Revenge** (by svösh, with updates by Silveredge9) is the most prominent fully released mod featuring entirely new custom modules and walkmeshes built from scratch, including unique areas like Yavin Station and Bimmiel with original 3D models, pathfinding, and collision geometry.

**Sleheyron Planet** (WIP by Sithspecter) demonstrates advanced scratch-built custom walkmeshes for a new planet, using extruded edges for precise collisions and AABB trees for camera blocking.

Other examples like the **Kotor Expansion Pack** (WIP by CapitaineSpoque) include extensive custom walkmesh extensions and fixes, but build on vanilla areas rather than fully standalone new ones.

Creating these requires tools like **KAurora** (by MagnusII) for compiling WOK walkmeshes and lightmaps, **kotorblender** for modern Blender-based BWM editing/export, and **Holocron Tool** for module assembly (IFO/ARE/GIT/LYT).

### Mods and Creators
| Mod Name | Creator(s) | KotOR Game | Custom Walkmeshes/Modules | Status |
|----------|------------|------------|---------------------------|--------|
| Brotherhood of Shadows: Solomon's Revenge | svösh (original), Silveredge9 (updates) | KOTOR 1 | Yes – fully new areas with custom geometry, pathfinding, and collisions | Released (2006, updated) |
| Sleheyron Planet | Sithspecter | KOTOR 1 | Yes – scratch-built planet with extruded walkmesh edges and AABB camera blocks | WIP/Demo |
| Kotor Expansion Pack | CapitaineSpoque (Zobizob) | KOTOR 1 | Partial – major extensions/fixes to vanilla walkmeshes (e.g., Taris, Dantooine) | WIP |

### Key Tools for Custom Walkmeshes
- **KAurora** (MagnusII): Compiles new WOK files from models, supports split walkmeshes via LYT, emitters, lightmaps.<grok:render card_id="d8f8e8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">46</argument>
</grok:render><grok:render card_id="089418" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">72</argument>
</grok:render>
- **kotorblender**: Blender addon for BWM import/export, adjacency/perimeter calculation (matches attached docs).<grok:render card_id="bf9181" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">62</argument>
</grok:render>
- **Holocron Tool**: Modern successor to Kotor Tool for editing ARE (area refs to WOK), GIT, IFO; extracts/compiles .mod files.
- **Walkmesh Injector** (Dastardly): Injects custom walkmeshes into MDL for AABB/camera support.
- **NWMax/KotOR Max/MDLEdit**: Model editing with walkmesh visualization/export.

For tutorials, see Deadly Stream's [New Area Knowledge Thread](https://deadlystream.com/topic/3256-new-area-knowledge-thread/) and attached BWM/LYT docs.

---

The creation of fully custom walkmeshes (WOK/BWM files) and modules (.mod archives containing IFO, ARE, GIT, LYT, VIS, and WOK) in Knights of the Old Republic (KotOR) has historically been extremely challenging, requiring deep reverse-engineering of the Aurora engine's binary formats. As noted in community discussions, "very very few mods" succeed without repurposing vanilla areas due to complexities like adjacency computation, AABB trees for raycasting/collisions, perimeter edges for transitions, and LYT-based room splitting for performance. Pre-2015 efforts relied on hex editing or rudimentary exporters, while modern tools like kotorblender and PyKotor (leveraging the attached BWM specs) enable viable workflows.

### Notable Mods and Their Achievements
Custom walkmeshes demand generating vertices, faces, materials (e.g., Dirt=1 for walkable, Nonwalk=7 for barriers), normals/distances for planarity, adjacencies (`face_index * 3 + edge_index`), edges/perimeters for boundaries, and AABB hierarchies (WOK-only). Modules assemble these via LYT (room positions/hooks) and ARE (WOK refs).

- **Brotherhood of Shadows: Solomon's Revenge** (Released 2006, 1.5 update later): svösh's landmark expansion adds 8+ hours of content with "brand new areas" like a Yavin IV station, Bimmiel planetoid, and Solomon's tomb—fully custom-modeled in 3DS Max/NWMax, with bespoke walkmeshes for NPC pathfinding, player collisions, and transitions. No KAurora (post-dates release), so likely manual WOK hex-editing or early exporters; praised as one of the only "large scale new area mods." Custom voice acting, quests, and items complement the geometry.

- **Sleheyron Planet** (WIP since ~2014): Sithspecter's ambitious Huttese world features scratch-built interiors/exteriors with "smooth collisions where you don't pop through geometry." Walkmeshes use vertical edge extrusions (per attached BWM edge/perimeter docs) and MDL-embedded AABB nodes for camera/line-of-sight blocking. Split via LYT/VIS for multi-room rendering. Tools: KotOR Max/NWMax for modeling, MDLEdit for binary tweaks, KAurora for lightmaps/emitters.

- **Kotor Expansion Pack** (WIP 2024+): CapitaineSpoque's overhaul extends vanilla modules (e.g., Taris Undercity sewers +2 rooms, Dantooine Enclave +dorms/training bay) with custom walkmesh extensions for new placeables (e.g., kolto tanks, fountains). Fixes holes/impassable spots; adds new modules like Taris black market alley. Not fully standalone but demonstrates practical custom BWM work. Tools: Holocron for module edits, K-GFF/2DA editors, asset ports from KOTOR 2.

Smaller/partial examples:
- **Azgath N'Dul's Tomb** (Darth InSidious): Adds Korriban tomb via reskin/relight of Tulak Hord's—repurposed WOK, not scratch.
- WIPs like **KOTOR 3 Collab** and **Restored Content for K1CP** touch custom elements but repurpose heavily.

| Mod | New WOK Vertices/Faces | Adjacencies/Perimeters | AABB Tree | LYT Splits |
|-----|------------------------|-------------------------|-----------|------------|
| BoS: Solomon's Revenge | Custom for all new rooms | Yes (pathfinding) | Yes | Likely |
| Sleheyron | Extruded edges, full BVH | Yes, boundary loops | Embedded in MDL | Yes (multi-model) |
| Expansion Pack | Extensions/fixes (e.g., +rooms) | Partial fixes | Vanilla + tweaks | Vanilla |

### Creators and Contributions
- **svösh**: Pioneered full custom modules pre-modern tools; "talented 3D modellers" credited for BoS geometry.
- **Sithspecter**: Leads new area tech; Sleheyron showcases split walkmeshes/LYT doors for visportals.
- **MagnusII**: KAurora author; enabled "compile new walkmeshes" + emitters/lightmaps ~2015.
- **Dastardly**: Walkmesh Injector for AABB; identified MDL walknode (type 545, 40-byte).
- **Quanon**: Tutorials on lightmapping/split walkmeshes ("rig... with doorhook line in LYT").
- **CapitaineSpoque**: Modern WIP with Holocron; community asset integrator.

### Tools Workflow (Per Attached Docs + Community)
1. **Modeling**: NWMax/3DS Max/kotorblender for MDL/WOK geometry (faces CCW, normals up).
2. **Walkmesh Generation**:
   - **KAurora**: Import MDL, auto-compile BWM (header "BWM V1.0", type 1=WOK); handles hooks/positions.
   - **kotorblender**: Export BWM with adjacency calc (shared vertices), perimeters (1-based edge ends), AABB (SAH/median split).
   - **PyKotor**: Scripted I/O for BWM (vertices float32[3], faces uint32[3], materials enum).
3. **Module Assembly**: Holocron/Kotor Tool extracts vanilla; edit ARE (WOK ref), LYT (rooms/hooks: `<room> <x y z>`), GIT (placeables/PWK), VIS (portals); pack .mod via ERFEdit.
4. **Testing**: reone/xoreos engines for validation; WalkSwitch for material tweaks.
5. **Advanced**: Dastardly's injector for MDL AABB; extrude edges for LOS barriers.

**Challenges**: "Months of work" for vanilla-parity; animations unsupported early; minimaps trial/error; no easy editor until kotorblender.

**Learning Path**:
- Read Deadly Stream's [New Area Knowledge Thread](https://deadlystream.com/topic/3256-new-area-knowledge-thread/)—covers KAurora splits, Quanon's lightmaps, AABB.
- Use attached BWM (offsets: verts 0x4C, faces 0x54) + LYT docs.
- Start: Export vanilla WOK via Holocron, edit in Blender/kotorblender, reimport.
- Forums: Deadly Stream (search "custom wok"), LucasForums Archive (old guides).

This rarity stems from engine limits; modern tools lower barriers, promising more mods.

### Key Citations
- [New Area Knowledge Thread](https://deadlystream.com/topic/3256-new-area-knowledge-thread/)<grok:render card_id="47193b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">46</argument>
</grok:render>
- [Sleheyron Planet Thread](https://deadlystream.com/topic/2887-this-is-the-sleheyron-planet-which-is-a-work-in-progress-mod-for-kotor/)<grok:render card_id="6b6569" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">47</argument>
</grok:render>
- [Brotherhood of Shadows on Deadly Stream](https://deadlystream.com/files/file/761-brotherhood-of-shadow-solomons-revenge/)<grok:render card_id="329618" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">88</argument>
</grok:render>
- [KAurora Tool](https://deadlystream.com/files/file/703-kaurora/)<grok:render card_id="573600" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">72</argument>
</grok:render>
- [Kotor Expansion Pack Thread](https://deadlystream.com/topic/11762-wip-k1-kotor-expansion-pack/)<grok:render card_id="e33ae0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">111</argument>
</grok:render>
- [kotorblender](https://deadlystream.com/files/file/889-kotorblender/)<grok:render card_id="7497cd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">62</argument>
</grok:render>
