---
source_url: "https://grok.com/c/878e308b-67c0-4484-b5cb-835106e925b4"
conversation_id: "878e308b-67c0-4484-b5cb-835106e925b4"
title: "KotOR uses Bink 1 video codec"
extracted_at: "2026-06-29T16:08:02.825Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# KotOR uses Bink 1 video codec

Source: [Grok conversation](https://grok.com/c/878e308b-67c0-4484-b5cb-835106e925b4)

## User

_Time: 2026-06-06T20:26:57.149Z_

what video bik engine does KotOR use? rad video? bink 1? 2? please investigate thoroughly

## Assistant

_Time: 2026-06-06T20:27:47.798Z_

**KotOR (Star Wars: Knights of the Old Republic, 2003 PC/Xbox release, and its 2004/2005 sequel KotOR II: The Sith Lords) uses Bink Video (specifically Bink 1 / the original Bink codec) from RAD Game Tools (now part of Epic Games Tools) for its cutscene and movie playback.**<grok:render card_id="e74843" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">6</argument></grok:render>

It does **not** use Bink 2. “RAD Video” refers to the RAD Video Tools software suite (the compressor, player, and converter tools), which has long included Bink as its primary modern video format (alongside the much older Smacker/.smk format that KotOR does not use).

### Bink Background and Versions
Bink Video is a proprietary video (and audio) codec/container format optimized for games. It emphasizes fast decoding on limited hardware, good compression ratios for the era, and low CPU overhead—ideal for full-motion video (FMV) cutscenes that play alongside or instead of real-time 3D rendering. RAD Game Tools released the original Bink around 1999; it became extremely widespread across PC and console games.<grok:render card_id="a6c67a" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">66</argument></grok:render>

**Bink 1** (the version KotOR uses) has file extension primarily **.bik**.  
**Bink 2** (a major upgrade released in **2013**) offers significantly better quality at lower bitrates, faster decoding (multi-core + SIMD improvements), and later features like HDR support. Its files often use **.bk2** (or sometimes .bik2) and start with a different header signature.<grok:render card_id="051e18" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">16</argument></grok:render>

Bink 2 is incompatible with engines built around Bink 1 without substantial work. KotOR’s engine (the Odyssey engine, originally from BioWare) predates Bink 2 by a decade, so it bundles and calls the Bink 1 decoder.

### Direct Evidence That KotOR Uses Bink 1 (Not Bink 2 or Anything Else)
- **Release timeline**: KotOR (2003) and KotOR II (2004–2005) came out long before Bink 2 (2013). No post-release patches or re-releases switched the video system.<grok:render card_id="952035" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">66</argument></grok:render>
- **File extensions and assets**: Every reference to KotOR/KotOR II movies points to **.bik** files in the `Movies` folder (e.g., `biologo.bik`, `leclogo.bik`, legal/intro/cutscene files). There are zero credible reports or files of `.bk2` or `.bik2` in the original or standard re-releases. Modding guides, PCGamingWiki, Deadly Stream, Reddit (/r/kotor), and Steam discussions all consistently describe “.bik files” and “Bink Video.”<grok:render card_id="0d64bc" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">38</argument></grok:render>
- **File header signature** (the definitive technical distinguisher): Bink files begin with a small header. Bytes 0–2 are the signature:
  - **'BIK'** → Bink 1 (what KotOR uses).
  - **'KB2'** → Bink Video 2.
  
  Byte 3 is a revision code (e.g., 0x68 = 'h', 0x69 = 'i' for common later Bink 1 revisions). KotOR’s files match the classic 'BIK' + old revision pattern. Bink 2 uses its own revision set.<grok:render card_id="6e8548" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">65</argument></grok:render>
- **Runtime library (DLL)**: KotOR and KotOR II rely on **binkw32.dll** (the classic 32-bit Bink 1 decoder). Countless troubleshooting threads for the games mention missing or problematic `binkw32.dll` files; the game even shipped with specific older versions of it (e.g., references to ~1.5.x builds in older posts). Bink 2 uses different libraries (often bink2*.dll variants).<grok:render card_id="e93813" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">47</argument></grok:render>
- **Modding and community practice**: The KotOR modding scene (Deadly Stream, TSLRCM, etc.) extensively uses **RAD Video Tools** to convert AVI/MP4/etc. into `.bik` files via the “Bink it!” function. These custom `.bik` files work in-game because they are Bink 1 format. Guides for upscaling cutscenes, adding custom movies, or fixing widescreen issues all assume and produce Bink 1 `.bik` files. No one uses or needs Bink 2 tools for KotOR.<grok:render card_id="713f8b" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">52</argument></grok:render>
- **No Smacker usage**: While RAD Video Tools historically supported the older Smacker (.smk) format, KotOR’s cutscenes are all Bink .bik. Mentions of “Bink and Smacker” in KotOR contexts almost always refer to the RAD player tool itself, not the game’s video files.

### Nuances, Edge Cases, and Related Considerations
- **Both games are the same**: KotOR I (BioWare) and KotOR II (Obsidian, built on the same engine tech) use identical Bink 1 handling. KotOR II just has more/longer cutscenes.
- **Platforms**: PC version uses the binkw32.dll path. Xbox versions use a console-specific Bink build but the same .bik file format and container. No evidence of format changes across platforms.
- **Modern re-releases and ports** (Steam, GOG, Aspyr/mobile/console ports): These still ship or reference the original .bik assets (or compatible versions). Community guides for running on modern hardware (widescreen fixes, skipping intros by renaming/deleting specific .bik files like `leclogo.bik` or `aspyr.bik`, etc.) continue to treat them as classic Bink 1 files. There is no widespread switch to Bink 2 or re-encoding to .bk2.<grok:render card_id="36ff89" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">80</argument></grok:render>
- **Fan re-implementations**: Projects like KotOR.js (a browser-based reimplementation of the engine) explicitly added “BINK video playback” support to handle the original cutscenes—meaning the classic Bink 1 format.
- **Playing or converting outside the game**: Use the free **RAD Video Tools** (still available from the official site) — it plays .bik files natively and can convert them. FFmpeg has good support for decoding classic Bink 1 (less complete or absent for Bink 2’s .bk2 in some builds). Many players extract and watch KotOR movies this way.
- **Creating/replacing videos (modding)**: Convert source footage to AVI (or similar), open in RAD Video Tools, select Bink compression settings appropriate for the era/game resolution (often 640x480 or similar for vanilla), and “Bink it.” Some older guides note that certain Windows versions (or XP compatibility) worked better for the compressor at times. Upscaled or HD .bik replacements are popular mods.
- **Potential issues on modern systems**: Bink 1 decoding is lightweight but very old. Some players report cutscene crashes or black screens on newer Windows/Steam Deck/etc.; common fixes include deleting problematic .bik files (skipping those cutscenes) or using compatibility modes/patches. The format itself isn’t the usual culprit—driver or timing issues often are.
- **Why not something else?** No evidence of custom video engines, MPEG, or other codecs in KotOR’s movie playback. The binkw32.dll dependency and .bik files are unambiguous.

### Summary
KotOR uses the **Bink 1** video codec/engine (part of RAD Game Tools’ RAD Video Tools suite) via `.bik` files and `binkw32.dll`. It is **not** Bink 2 (2013+), nor any other “RAD Video” variant. This is confirmed by file signatures, extensions, bundled libraries, release dates, and a decade-plus of consistent community and technical references.

The choice made perfect sense in 2003: Bink 1 was mature, efficient, and already licensed in hundreds of games. Bink 2’s improvements came far too late for this engine. If you’re modding, extracting, or troubleshooting, stick with classic RAD Video Tools and Bink 1 workflows—they remain fully compatible with the original assets and engine.
