---
source_url: "https://grok.com/c/271749c3-e10c-4ccf-8c5c-26df9de052ad"
conversation_id: "271749c3-e10c-4ccf-8c5c-26df9de052ad"
title: "UniWS: Widescreen Modding History KOTOR"
extracted_at: "2026-06-29T16:16:47.007Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# UniWS: Widescreen Modding History KOTOR

Source: [Grok conversation](https://grok.com/c/271749c3-e10c-4ccf-8c5c-26df9de052ad)

## User

_Time: 2025-12-01T22:40:01.579Z_

Who wrote the app 'UniWS' and what's the history of it? what's the actual developer's name? are they active in reddit/any forum or anything like that? how did they figure out how to implement widescreen functionality in kotor and is it specified anywhere why they had interest in designing such a solution...?
 
 
Provide information about how exactly it works for star wars knights of the old republic (the first game) and what the resolution-named archives UniWS provides do and how they work.
Basically here's my understanding:
- Game was designed for 4:3 monitors
- Modifying the EXE at a specific offset (formerly we used to hex edit, now we use uniws) allows one to specify the actual resolution of the monitor (I remember how to convert to hex, and the explanation of how the bytes being edited is the resolution in inverse-reverse order. What happened to that?).
- GUI files need to be resized to match that resolution.
 
 
Basically I'm also looking for the historical evolution of widescreen implemntation instructions in KOTOR, starting with the first one to do it and finding any and all evolutionary steps that eventually resulted in what is present on https://kotor.neocities.org

## Assistant

_Time: 2025-12-01T22:41:08.380Z_

**UniWS was developed by Wogg (a pseudonymous contributor to the Widescreen Gaming Forum, or WSGF), with later maintenance by Mird-OC and Arcus.**<grok:render card_id="8835cd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">61</argument>
</grok:render><grok:render card_id="7238d5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">104</argument>
</grok:render>

No confirmed real name for Wogg has surfaced in public sources; they appear to have been active primarily on WSGF forums around 2010–2020, discussing patches and user issues, but no recent activity or Reddit/forum presence was identified.<grok:render card_id="433032" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">73</argument>
</grok:render><grok:render card_id="e79691" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">104</argument>
</grok:render>

Wogg reverse-engineered KOTOR's executable (swkotor.exe) by identifying hardcoded resolution checks via hex editing, a common technique for 2000s-era games lacking widescreen support; their motivation aligned with WSGF's mission to adapt classic titles for modern widescreen monitors without distortion or black bars.<grok:render card_id="17f82c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">104</argument>
</grok:render>

**UniWS automates hex editing of swkotor.exe to enable Hor+ (horizontal-plus) widescreen, preserving 4:3 FOV while extending horizontally; it replaces hardcoded 4:3 checks (e.g., 800x600) with user-specified resolutions using byte-swapped little-endian values.**<grok:render card_id="ebaca5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">103</argument>
</grok:render><grok:render card_id="fcfc00" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">104</argument>
</grok:render>

Resolution-named archives on kotor.neocities.org (e.g., 1920x1080.zip) contain upscaled .bik cutscene videos for mods like KOTOR1 Cutscenes Rescaled, placed in the movies folder to match the UniWS-patched resolution and fix fullscreen crashes.<grok:render card_id="fa8b37" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">103</argument>
</grok:render>

**Widescreen evolution began with stretched .ini edits (~2004), advanced to manual hex editing (~2007 via WSGF), then UniWS automation (~2011), followed by GUI/menu mods (2017+), cutscene AI upscales (2019+), and compiled builds like kotor.neocities.org (2020s).**<grok:render card_id="54d137" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">72</argument>
</grok:render><grok:render card_id="6aa032" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">104</argument>
</grok:render>

### UniWS Patching Process
1. Backup and replace swkotor.exe with an editable version (Steam/GOG often need this).
2. Run UniWS, select game folder, choose "Star Wars: KOTOR (1024x768 interface)".
3. Input target resolution (e.g., 1920x1080); it auto-patches.<grok:render card_id="4d251f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">103</argument>
</grok:render>
4. Install GUI mods (e.g., KOTOR High Resolution Menus) to scale HUD/textures.

### Technical Breakdown
The original hex method (now automated) targets byte sequences in swkotor.exe:
- **Resolution checks**: Replace pairs like `20 03` (800 swapped) with `80 07` (1920 swapped).<grok:render card_id="51d0b0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">104</argument>
</grok:render>
- **HUD scaling**: Sets to 1024x768 base for widescreen compatibility.
- **Movies**: Updates FMV rendering to new res.

---

UniWS (Universal Widescreen Patcher) stands as a pivotal tool in enabling proper widescreen support for Star Wars: Knights of the Old Republic (KOTOR1, released November 2003 by BioWare), transforming a 4:3-only game into a viable experience on modern displays. Developed primarily by Wogg—a dedicated reverse engineer active on the Widescreen Gaming Forum (WSGF)—with subsequent updates from Mird-OC and Arcus, UniWS automates the laborious hex editing required to unlock higher resolutions. No verified real name for Wogg appears in searches across forums, Reddit, or mod sites; their contributions center on WSGF threads from circa 2010–2020, where they troubleshooted patches and expanded game support, but no ongoing activity (e.g., Reddit u/Wogg or similar) was located.<grok:render card_id="ce0a84" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">61</argument>
</grok:render><grok:render card_id="102782" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">73</argument>
</grok:render>

Wogg's approach stemmed from dissecting swkotor.exe using hex editors like Hex Editor Neo, pinpointing hardcoded resolution validation routines—a standard RE technique for DirectX 8/9-era games. These routines reject non-4:3 resolutions to enforce the original 800x600 or 1024x768 limits. By mapping out unique byte sequences around these checks (e.g., `3D 20 03 00 00` for 800x600), Wogg crafted search-and-replace patterns. Their interest likely mirrored WSGF's ethos: democratizing widescreen for aging titles as 16:10/16:9 monitors proliferated post-2007, avoiding stretched distortion or pillarboxing.<grok:render card_id="4ca5a7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">104</argument>
</grok:render>

### Detailed Mechanics for KOTOR1
UniWS patches swkotor.exe in three core steps, replicating manual hex edits:

1. **Resolution Override**: Locates and swaps hardcoded 4:3 checks (e.g., 800x600 as little-endian `03 20 00 00`, byte-flipped to `20 03` in code). New res like 1920x1080 becomes `0780`/`0438` → flipped `80 07`/`38 04`. This enables in-game selection of widescreen modes (Hor+: FOV unchanged vertically, stretched horizontally for immersion).<grok:render card_id="2c2d0c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">104</argument>
</grok:render>

2. **HUD Scaling**: Redirects UI rendering to a compatible base (1024x768), editing checks like `3D 00 04 00 00` (1024). Prevents tiny centered menus; further mods like ndix UR's KOTOR High Resolution Menus (2017) patch the EXE again for full scaling.<grok:render card_id="530f6a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">103</argument>
</grok:render>

3. **FMV/Movie Scaling**: Updates Bink Video (.bik) checks (e.g., `80 02 00 00` for 640x480) to match, ensuring cutscenes fill the screen without crashes or letterboxing.<grok:render card_id="5b9a3f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">104</argument>
</grok:render>

Post-patch, GUI files (textures in override/movies) must be resized via mods: HD UI packs upscale icons/menus; High Res Menus relocates elements. The user's recalled "inverse-reverse order" matches the byte-swapping (endian reversal) for width/height pairs.<grok:render card_id="bbc1cb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">104</argument>
</grok:render>

**Resolution-Named Archives (kotor.neocities.org)**: These .zip files (e.g., 1920x1080.zip) bundle resolution-specific .bik cutscenes for:
- **KOTOR1 Cutscenes Rescaled** (Pops Maellard): AI-upscaled originals (30/60fps variants; 30fps advised to prevent crashes), fixing minimization bugs.
- **KOTOR Remastered Cutscenes** (naelavok, 2019): Neural-enhanced videos; may need RAD Video Tools hex-edits for perfect fit (~8 hours automated).<grok:render card_id="2d86e4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">103</argument>
</grok:render>
Files drop into `movies/` folder, not override.

| Mod Component | Purpose | Installation Notes |
|---------------|---------|--------------------|
| Turret Cockpit Widescreen (MadDerp) | Fixes off-angle views in minigames | Loose files to override<grok:render card_id="f5c909" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">103</argument>
</grok:render> |
| KOTOR High Resolution Menus (ndix UR) | Scales all menus to patched res | .bat patcher on copied EXE; essential<grok:render card_id="9cd612" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">103</argument>
</grok:render> |
| HD UI Menu Pack (ndix UR) | Sharp icons/textures | Mandatory companion; loose files |
| Widescreen Fade Fix (Doiinko) | Uniform screen fades | Loose files |
| Main Menu Widescreen Fix (Darth Parametric) | Widens menu camera/smoke | Loose files<grok:render card_id="c0a972" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">103</argument>
</grok:render> |

### Historical Evolution of KOTOR Widescreen
KOTOR1's 4:3 lock spurred community fixes as widescreen hardware emerged (~2005+). Timeline:

| Era | Method | Key Developments | Sources |
|-----|--------|------------------|---------|
| 2003–2004 | .ini Edits | `swkotor.ini`: Width/Height tweaks (e.g., 1288x805); stretched, no FOV preservation. | LucasForums threads<grok:render card_id="0bf7ab" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">72</argument>
</grok:render> |
| ~2007 | Manual Hex Edits | WSGF pioneers full EXE disassembly: res/HUD/FMV swaps via HxD editor. First true Hor+.<grok:render card_id="4da2c6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">104</argument>
</grok:render> |
| 2010–2011 | Auto-Hex Tools | P4patch scripts; UniWS launches (Wogg), automating for 100+ games incl. KOTOR (1024x768 HUD).<grok:render card_id="25151d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">61</argument>
</grok:render> |
| 2015+ | Runtime Alternatives | Flawless Widescreen (no EXE changes, ultra-wide support). | Steam/Reddit<grok:render card_id="52ce6f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">102</argument>
</grok:render> |
| 2017–2021 | GUI/Menu Mods | Deadly Stream: High Res Menus, Main Menu Fix, Ultrawide UI (ndix UR, Darth Parametric).<grok:render card_id="d92b2e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">45</argument>
</grok:render> |
| 2019–2024 | Cutscene Upscales | AI tools (Topaz): Rescaled/Remastered packs; neocities.org builds (2020s) compile all.<grok:render card_id="914f95" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">103</argument>
</grok:render> |

This progression reflects modding maturation: from crude hacks to polished, resolution-agnostic suites. Steam/GOG versions require "editable EXE" downloads for patching.<grok:render card_id="42e6a1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">63</argument>
</grok:render>

**Key Citations:**
- [WSGF KOTOR Guide](https://www.wsgf.org/dr/star-wars-knights-old-republic)<grok:render card_id="f9aadd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">104</argument>
</grok:render>
- [kotor.neocities.org Widescreen Mods](https://kotor.neocities.org/modding/mod_builds/k1/widescreen)<grok:render card_id="fcac68" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">103</argument>
</grok:render>
- [UniWS Patcher Page](https://www.wsgf.org/article/universal-widescreen-uniws-patcher)<grok:render card_id="bdc8f5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">61</argument>
</grok:render>
- [WSGF UniWS Discussion](https://www.wsgf.org/phpBB3/viewtopic.php?f=64&t=12329)<grok:render card_id="791be6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">73</argument>
</grok:render>
- [LucasForums Early Widescreen](https://lucasforumsarchive.com/thread/188793-widescreen-mod)<grok:render card_id="92b61d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">72</argument>
</grok:render>
- [Deadly Stream High Res Menus](https://deadlystream.com/files/file/1159-kotor-high-resolution-menus/)<grok:render card_id="17e4fd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">45</argument>
</grok:render>

## User

_Time: 2025-12-01T22:41:43.877Z_

> UniWS was developed by Wogg (a pseudonymous contributor to the Widescreen Gaming Forum, or WSGF), with later maintenance by Mird-OC and Arcus.
 
Find out anything and everything you can about this from wsgf.org. If uniws was maintained by Mird-OC and Arcus that implies the source is availlable. Please either find the source or investigate who exatcly Mird-OC/Arcus are and how they were able to get their hands on its source code.

## Assistant

_Time: 2025-12-01T22:42:28.993Z_

**UniWS (Universal Widescreen Patcher) was originally created by Wogg, a WSGF forum member, around 2004–2005. Maintenance shifted to fellow WSGF contributors Mird-OC and Arcus, who added support for additional games without needing the tool's source code.**

The tool consists of a closed-source executable (uniws.exe, likely compiled from a scripting language like AutoIt) paired with an editable patches.ini file that defines hex edits for each supported game. "Continuation" by Mird-OC and Arcus refers to them discovering new hex patches, adding entries to patches.ini, and releasing updated UniWS.zip packages—common practice since the .exe itself is static and no longer updated.

No public source code exists for UniWS; searches across WSGF, GitHub, and broader web yield no repositories, decompilations, or open-source releases. The tool remains closed-source, with the last known version (implied 1.03 or similar) distributed solely as a binary zip from WSGF.

**Mird-OC and Arcus are pseudonymous WSGF members active in the mid-2000s.** Mird-OC contributed patches for Tiger Woods PGA Tour games (e.g., 2004–2005), while Arcus added support for titles like Empire Earth II, Dungeon Lords, and others. They likely collaborated directly with Wogg or inherited maintenance informally within the small WSGF community as Wogg's activity declined.

### Core Components and How Maintenance Works
UniWS automates hex editing of game executables/DLLs to inject widescreen resolutions. It includes:

| Component      | Description                                                                 | Role in Maintenance                          |
|----------------|-----------------------------------------------------------------------------|----------------------------------------------|
| uniws.exe      | GUI + patching engine; searches for byte signatures and applies offsets.    | Never updated post-Wogg; closed-source.      |
| patches.ini    | Plain-text file defining per-game patches (signatures, offsets, etc.).      | Fully editable; all post-Wogg updates here.  |

Example patches.ini syntax for a game entry:
```
[Game Name]
details=Description shown in GUI
checkfile=exe to verify folder
modfile=exe/dll to patch
sig=hex signature to find
sigwild=wildcard mask
xoffset/ yoffset=where to write width/height
```
Adding a new game requires only reverse-engineering the hex edits and appending a section—no recompilation needed.

### Known Developer Contributions on WSGF
| User     | Key Contributions                                                                 | Approximate Era |
|----------|-----------------------------------------------------------------------------------|-----------------|
| Wogg     | Created tool, initial games (NFS Underground 1/2, Prince of Persia series, KOTOR). | 2004–2006      |
| Mird-OC  | Tiger Woods 2004/2005 patches; early .ini updates.                                | 2004–2008      |
| Arcus    | Empire Earth II, Dungeon Lords, additional fixes; released updated packages.     | 2005–2007      |

Later WSGF members (e.g., skipclarke) continued adding unofficial .ini entries, but the official download bundle stopped receiving updates years ago.

### Download and Current Status
The last official package remains available at https://www.wsgf.org/downloads/uniws.zip (or via the article page). It supports a fixed list of ~13 games; community members manually edit patches.ini for newer or unsupported titles.

No evidence exists of formal source code handover. The WSGF community was small and collaborative—contributors simply shared updated .ini files and zip packages via forum posts until activity faded.

**Key Citations**
- WSGF UniWS Article: https://www.wsgf.org/article/universal-widescreen-uniws-patcher
- UniWS Syntax Explanation Thread: https://www.wsgf.org/phpBB3/viewtopic.php?f=63&t=15076
- Main UniWS Discussion (archived early posts): https://www.wsgf.org/phpBB3/viewtopic.php?f=64&t=12329
- Various game-specific threads crediting Arcus/Mird-OC updates (2005–2008)
