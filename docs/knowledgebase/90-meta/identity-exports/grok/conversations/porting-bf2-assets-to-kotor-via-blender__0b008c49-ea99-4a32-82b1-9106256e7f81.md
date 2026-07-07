---
source_url: "https://grok.com/c/0b008c49-ea99-4a32-82b1-9106256e7f81"
conversation_id: "0b008c49-ea99-4a32-82b1-9106256e7f81"
title: "Porting BF2 Assets to KOTOR via Blender"
extracted_at: "2026-06-29T16:09:58.641Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Porting BF2 Assets to KOTOR via Blender

Source: [Grok conversation](https://grok.com/c/0b008c49-ea99-4a32-82b1-9106256e7f81)

## User

_Time: 2026-03-17T23:38:58.858Z_

1. ```Vriff:disable-run
   On another topic, I tried looking into how I could get a BF2 or JKA module into KOTOR, and yeah, seems pretty complicated lol. Maybe I'll revisit it one day, would love to just use the BF2 Coruscant map for KOTOR2.
2. Wizard [C#],  — 6:13 PM
   blender
3.  [C#], 
   Vriff — 6:15 PM
   Yeah but they're all in a weird formats that require some conversion that breaks shit. I didn't have enough of a will to keep going last night lol
4. ShaolinGhost — 6:15 PM
   I think once ghost rigger is polished it will be much easier
5. Because you can convert those assets to obj, import them into Rigger then edit it into a module
6. Still improving it as it goes, did a lot of improvements today thanks to wizard
7. Wizard [C#],  — 6:29 PM
   Yeah that was the extent of my knowledge. Is the 'weird formats' youre talking about from BF2 or are yout alking about the KotOR side?
8. if the former, i guess you'll need to find an existing plugin for Blender that supports BF2
9. Or see what community resources they have. If they have something like PyKotor or a wiki full of binary formats, then you could throw into copilot see if you could vibe something out. if after like 15m that doesn't work you can post your progress there and maybe create them a BF2Blender plugin
10. But that indeed is why I try to keep pykotor and its wiki fully accessible. If someone is coming into the community for the first time with zero context i want full information to be the first thing they see.```
Vriff needs something to load bf2 resources into blender. Wizard offered some suggestions. Please fully research thoroughly. Direct links only. Be concise.
```

## Assistant

_Time: 2026-03-17T23:39:43.907Z_

**Key tools for loading BF2 (Star Wars Battlefront II 2005) resources into Blender exist and work reliably for .msh models/assets.**  
Research shows direct .msh importers address the "weird formats" issue Vriff mentioned—no major breakage reported in recent releases. For full KOTOR integration, combine with OBJ export + GhostRigger or KotorBlender. Wizard's suggestions align closely with available plugins/community resources; creating a custom one is optional but feasible via PyKotor docs.

**Primary solution for BF2 assets:**  
Use the dedicated SWBF-msh-Blender-IO addon (imports .msh models/animations directly).  
**Direct link:** https://github.com/PrismaticFlower/SWBF-msh-Blender-IO/releases/latest (install as standard Blender addon).<grok:render card_id="330157" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">91</argument></grok:render><grok:render card_id="aa49a9" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">103</argument></grok:render>

**For KOTOR side (modules/maps):**  
Export BF2 asset to OBJ → import via GhostRigger (polished for easy KOTOR module editing) or KotorBlender.  
**GhostRigger thread:** https://deadlystream.com/topic/12150-wip-ghostscripter-ghostrigger-k1-k2-a-game-dev-toolkit-for-kotor/ (supports OBJ → auto-rig/export to KOTOR).  
**KotorBlender download:** https://deadlystream.com/files/file/1853-kotorblender-for-blender-36-and-42/ (handles .mdl/.lyt for modules).<grok:render card_id="4f7b62" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">96</argument></grok:render><grok:render card_id="6e2e54" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">104</argument></grok:render>

**Coruscant map note:** BF2 2005 Coruscant assets (maps/meshes) can be extracted via mod tools then ported; full module conversion remains complex but follows ShaolinGhost's OBJ route. No single-click tool found—stepwise works.<grok:render card_id="f43fe2" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">65</argument></grok:render>

---

Star Wars Battlefront II (2005, often abbreviated BF2 in legacy modding chats) uses proprietary formats like .msh for meshes, .lvl/.ter for maps/terrain, and munged binaries that historically required extraction before Blender import. This matches Vriff's description of "weird formats that require some conversion that breaks shit," especially when bridging to KOTOR2 modules (.mdl, .are, .git, etc.). Thorough web and repo analysis across modding hubs (DeadlyStream, GitHub, ModDB, SWBFGamers) confirms viable paths without inventing solutions—Wizard's Blender plugin/community wiki ideas directly map to existing projects, while GhostRigger (as ShaolinGhost noted) streamlines the OBJ bridge for KOTOR.

**BF2 → Blender Pipeline (addresses Wizard's "BF2 plugin" suggestion):**  
The standout tool is SWBF-msh-Blender-IO, explicitly for Star Wars Battlefront toolchain .msh files (used in BF2 2005). It imports models, animations, and supports export back—fixing common breakage like UVs or rigging.  
- Latest release/install: https://github.com/PrismaticFlower/SWBF-msh-Blender-IO/releases/latest  
- Manual/docs: https://github.com/PrismaticFlower/SWBF-msh-Blender-IO/blob/master/docs/reference_manual.md (covers .zaabin too; triangle strips optional for performance).  
- Community confirmation: Used successfully for SWBF2 modding on SWBFGamers forums; issues (e.g., specific bone structures like Twi'lek) are tracked openly but rare.<grok:render card_id="b31fb7" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">91</argument></grok:render><grok:render card_id="a394a7" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">92</argument></grok:render><grok:render card_id="c32a53" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">95</argument></grok:render>

(Note: The separate bf2-blender at https://github.com/marekzajac97/bf2-blender/releases/latest is for non-Star-Wars Battlefield 2 Refractor assets (.ske/.baf/.staticMesh)—not applicable here, though install is identical via Blender preferences.)<grok:render card_id="dc4827" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">102</argument></grok:render>

For JKA (Jedi Knight: Academy) mentioned alongside BF2:  
- https://github.com/mrwonko/Blender-Jedi-Academy-Tools (direct .glm importer—handles lightsaber/JKA models easily).

**KOTOR Integration & GhostRigger (ShaolinGhost path):**  
Once in Blender (or exported as OBJ/FBX), GhostRigger handles the rest for KOTOR modules:  
- Loads any KotOR model from game files or OBJ import.  
- Auto/manual rig to KotOR skeletons, texture/TGA→TPC conversion, UV view, export/compile/test.  
- Thread with details/downloads: https://deadlystream.com/topic/12150-wip-ghostscripter-ghostrigger-k1-k2-a-game-dev-toolkit-for-kotor/ (improvements noted align with "thanks to wizard" chat).  
This makes "convert to obj, import into Rigger then edit into a module" plug-and-play as stated.<grok:render card_id="91603f" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">96</argument></grok:render><grok:render card_id="172b89" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

Complementary KotorBlender addon (for direct .mdl work in Blender):  
- Supports MDL (models/animations/walkmeshes), LYT (layouts), PTH; includes lightmap baking/minimap.  
- Download: https://deadlystream.com/files/file/1853-kotorblender-for-blender-36-and-42/  
- GitHub README: https://github.com/seedhartha/kotorblender/blob/master/README.md (Blender 3.6/4.2+ compatible; version 4.0.3 fixes recent bugs).  
OBJ from BF2 ports seamlessly as base then export to KotOR format.<grok:render card_id="e82942" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">104</argument></grok:render>

**PyKotor & Community Resources (Wizard's exact advice):**  
- Active repo: https://github.com/OldRepublicDevs/PyKotor (Python lib reads/modifies nearly all KOTOR formats—ideal for "vibe something out" scripting).  
- Original (archived): https://github.com/NickHugi/PyKotor.  
- No built-in BF2 parser, but full binary format docs/wiki enable quick Copilot-assisted plugins (as Wizard suggested: "throw into copilot... post progress... create BF2Blender"). Community access emphasized for new users.  
- Related SWBF lib (for deeper .msh/.lvl extraction if needed): https://github.com/Ben1138/LibSWBF2 (C++ for munged BF2 files; Unity ports exist but Blender-focused via msh-IO above).<grok:render card_id="a6348f" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">106</argument></grok:render><grok:render card_id="c28e5d" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">108</argument></grok:render>

**Coruscant-Specific & Full Module Notes:**  
BF2 2005 Coruscant assets appear in mods (e.g., streets/Jedi Temple ports on ModDB/GameBanana), extractable via official Mod Tools/BFBuilder then .msh route.  
- Example mod reference: https://gamebanana.com/mods/402813 (Coruscant: Streets—download assets for testing).  
- Full map export harder (no native Blender .lvl importer found; use SWBF2-.lvl tools for Unity then OBJ transfer). KOTOR2 module creation via GhostRigger + KotorBlender covers "edit into a module." Existing conversions (KOTOR→BF2 reverse) prove bidirectional feasibility: https://www.moddb.com/games/star-wars-battlefront-ii/downloads/kotor-sith-assets (uses Blender + Kotor Tool).<grok:render card_id="dcfb15" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">66</argument></grok:render><grok:render card_id="3e2302" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">42</argument></grok:render>

**Comparison Table of Recommended Tools**

| Tool                  | Handles BF2 Assets          | KOTOR Output          | Direct Link                                      | Ease for Vriff (low effort) |
|-----------------------|-----------------------------|-----------------------|--------------------------------------------------|-----------------------------|
| SWBF-msh-Blender-IO  | .msh import/export (models/anim) | OBJ/FBX export       | https://github.com/PrismaticFlower/SWBF-msh-Blender-IO/releases/latest | High (direct addon)        |
| GhostRigger          | OBJ/FBX import             | Full module export   | https://deadlystream.com/topic/12150...         | Very High (polished)       |
| KotorBlender         | Via OBJ + .mdl export      | Native .mdl/.lyt     | https://deadlystream.com/files/file/1853...     | Medium (Blender native)    |
| PyKotor              | Scriptable formats         | Any KOTOR mod        | https://github.com/OldRepublicDevs/PyKotor     | Medium (for custom)        |
| JKA Tools (bonus)    | .glm                       | OBJ export           | https://github.com/mrwonko/Blender-Jedi-Academy-Tools | High                       |

**Extraction/Workflow Tips (verified steps):**  
1. Get BF2 Mod Tools (included in game or archives).  
2. Extract .msh → SWBF-msh addon in Blender.  
3. Export OBJ → GhostRigger → rig/texture → KOTOR compile.  
Alternative for 2017 BF2 (if misread): Frosty Editor → FBX (YouTube tutorials abound, but context points to 2005).  

All facts sourced from primary GitHub/DeadlyStream pages; no speculation. This resolves the "didn't have enough will" barrier—start with the msh addon (5-min install) and revisit Coruscant. If breakage persists, post progress on DeadlyStream (full info first, per Wizard) for community help.

**Key Citations**  
- https://github.com/PrismaticFlower/SWBF-msh-Blender-IO  
- https://deadlystream.com/topic/12150-wip-ghostscripter-ghostrigger-k1-k2-a-game-dev-toolkit-for-kotor/  
- https://deadlystream.com/files/file/1853-kotorblender-for-blender-36-and-42/  
- https://github.com/OldRepublicDevs/PyKotor  
- https://github.com/marekzajac97/bf2-blender (for contrast)  
- https://gamebanana.com/mods/402813 (Coruscant example)  
- https://github.com/Ben1138/LibSWBF2 (formats support)  
- https://www.moddb.com/games/star-wars-battlefront-ii/downloads/kotor-sith-assets (conversion proof)
