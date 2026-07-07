---
source_url: "https://grok.com/c/a80634fc-61c4-43ff-9299-ac5dfeb72d00"
conversation_id: "a80634fc-61c4-43ff-9299-ac5dfeb72d00"
title: "Commented nwscript.nss in KOTOR Modding"
extracted_at: "2026-06-29T16:17:03.202Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Commented nwscript.nss in KOTOR Modding

Source: [Grok conversation](https://grok.com/c/a80634fc-61c4-43ff-9299-ac5dfeb72d00)

## User

_Time: 2025-11-24T16:19:24.308Z_

please web search to find out why these nwscript.nss have a bunch of constants/functions commented out? has anyone asked about this or tried to uncomment them or discussed this on any forum? For KOTOR 1 and/or 2 I'm talking about.
 
mixmojo, lucasforumarchives, deadlystream, etc are all good resources to scrape.

## Assistant

_Time: 2025-11-24T16:20:56.163Z_

**The nwscript.nss files in KOTOR 1 and 2 have numerous constants and functions commented out primarily because they represent features from the original Neverwinter Nights (NWN) scripting system that were not implemented or supported in the Aurora engine variant used by KOTOR, preventing crashes, errors, or undefined behavior if used.<grok:render card_id="9803d8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">72</argument>
</grok:render><grok:render card_id="30c0a4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">76</argument>
</grok:render><grok:render card_id="743814" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">86</argument>
</grok:render>**

**Modders have frequently discussed this on forums like Deadly Stream, LucasForums archives, and Reddit, often when seeking workarounds for missing animations or effects; attempts to "uncomment" them directly are rare and discouraged, but overriding the file to add/fix elements is common practice.<grok:render card_id="b53619" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="d9d1e4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">72</argument>
</grok:render><grok:render card_id="e53236" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">74</argument>
</grok:render>**

### Key Examples of Commented Elements
| Category | Examples | Notes from nwscript.nss |
|----------|----------|-------------------------|
| Animations | `//int ANIMATION_LOOPING_LOOK_FAR = 5;`<br>`//int ANIMATION_LOOPING_SIT_CHAIR = 6;`<br>`//int ANIMATION_LOOPING_SIT_CROSS = 7;` | Not usable in KOTOR; modders note them when scripting custom behaviors.<grok:render card_id="8f213f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">72</argument>
</grok:render> |
| Effects/Functions | `EffectMovementSpeedIncrease` (with detailed commented description) | Function exists but capped (~200%); higher values ignored, despite "turbo" cheat allowing more.<grok:render card_id="1c385f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">74</argument>
</grok:render> |
| Behaviors | `SetOrientOnClick` | Syntax-broken in early K2; comments note "// disabled" for orient-to-player on click.<grok:render card_id="5db012" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">86</argument>
</grok:render> |

### Common Modder Workarounds
- **Override nwscript.nss**: Extract from `scripts.bif` via KOTOR Tool, fix issues (e.g., K2 syntax error at line ~5710), place in `Override` folder for compilers/DeNCS.<grok:render card_id="c6875d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">75</argument>
</grok:render><grok:render card_id="050a39" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">86</argument>
</grok:render>
- **Add custom constants**: Modders append new ones (e.g., for feats) rather than uncommenting old.<grok:render card_id="99a4c5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">118</argument>
</grok:render>
- **Avoid direct edits**: Messing with core declarations risks compilation failures across all scripts.<grok:render card_id="317904" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">127</argument>
</grok:render>

---

The `nwscript.nss` file serves as the foundational header for all NWScript (.nss) source files in *Star Wars: Knights of the Old Republic* (KOTOR 1) and *Knights of the Old Republic II: The Sith Lords* (KOTOR 2/TSL), declaring constants (e.g., animation IDs, effect types) and function prototypes (e.g., `ApplyEffectToObject`, `CreateItemOnObject`). It originates from BioWare's Neverwinter Nights (NWN) engine but was adapted for KOTOR's customized Aurora engine.<grok:render card_id="02933b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render><grok:render card_id="10d293" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">75</argument>
</grok:render>

#### Reasons for Commented-Out Elements
KOTOR's `nwscript.nss` retains many NWN-era declarations but prefixes unsupported ones with `//` to disable them during compilation. This deliberate choice by BioWare ensures:
- **Engine Compatibility**: KOTOR's Aurora implementation lacks opcodes or assets for certain NWN features (e.g., advanced animations, UI behaviors), leading to crashes or no-ops if invoked.<grok:render card_id="315a58" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">72</argument>
</grok:render><grok:render card_id="351a12" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">76</argument>
</grok:render>
- **Modder Safety**: Prevents accidental use in custom scripts, which would fail at runtime. File-internal comments often explicitly state "// disabled" (e.g., for creature orientation in dialogues).<grok:render card_id="002bbf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">86</argument>
</grok:render>
- **Game-Specific Differences**: K1 and K2/TSL `nwscript.nss` vary slightly; K2 has a notorious syntax error in `SetOrientOnClick` (fixed by modders via override).<grok:render card_id="b3dd03" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render><grok:render card_id="15f1c9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">75</argument>
</grok:render>

No official BioWare documentation explains this (as KOTOR predates widespread modding support), but forum consensus attributes it to engine streamlining for single-player RPG vs. NWN's multiplayer focus.<grok:render card_id="c1eb28" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render>

#### Forum Discussions and Examples
Modding communities actively reference these commented sections, especially on **Deadly Stream** (primary KOTOR hub), **LucasForums archives**, **Holowan Laboratories** (via MixNMojo/Mixmojo forums), and Reddit.

- **Deadly Stream - Fair Strides' Script Shack** (2016 thread, 100+ pages): Users troubleshooting animations flag the exact commented lines (e.g., `ANIMATION_LOOPING_*`), confirming they can't be used natively. No successful uncommenting reported; focus on alternatives like `ActionPlayAnimation` workarounds.<grok:render card_id="4c819f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="56a017" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">72</argument>
</grok:render>
- **Reddit r/kotor** (2018): Thread on speed boosts quotes the commented description for `EffectMovementSpeedIncrease` (line ~165). Users test values >200% (no effect due to cap), note "turbo" cheat bypasses it partially.<grok:render card_id="def0b5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">74</argument>
</grok:render>
- **LucasForums Archive** (2004-2007 threads): Multiple posts warn against editing `nwscript.nss` ("very bad idea... loads of trouble"). Syntax fix for K2 widely shared; `// disabled` snippets appear in context of `SetOrientOnClick`.<grok:render card_id="d0c1c0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">86</argument>
</grok:render><grok:render card_id="adfdc4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">127</argument>
</grok:render>
- **Czerka R&D Wiki & Tools Threads**: Guides emphasize extracting/placing `nwscript.nss` in `Override` for KOTOR Tool/nwnnsscomp/DeNCS. K2 fix: Change `void SetOrientOnClick( object = OBJECT_SELF, ... )` to `void SetOrientOnClick( object oCreature = OBJECT_SELF, ... )`.<grok:render card_id="2818c3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">75</argument>
</grok:render>

| Forum | Key Threads | Topics Covered |
|-------|-------------|----------------|
| Deadly Stream | [Script Shack](https://deadlystream.com/topic/4808-fair-strides-script-shack/page/7/), [nwscript.nss Request](https://deadlystream.com/topic/6892-nwscriptnss/) | Animations, overrides<grok:render card_id="ad1a0a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render><grok:render card_id="c4c118" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">72</argument>
</grok:render> |
| LucasForums Archive | [Syntax Error](https://www.lucasforumsarchive.com/thread/142901-syntax-error-in-kotor2-nwscriptnss), [Don't Mess with It](https://www.lucasforumsarchive.com/thread/168643-im-trying-to-change-classes2da) | Fixes, warnings<grok:render card_id="99aa37" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">86</argument>
</grok:render> |
| Reddit r/kotor | [Movement Speed](https://www.reddit.com/r/kotor/comments/9dr8iy/modding_question_movement_speed_increase_in_k2/) | Effect caps<grok:render card_id="b64a17" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">74</argument>
</grok:render> |

#### Attempts to Uncomment or Modify
- **Direct Uncommenting**: No documented successes; implied to cause runtime crashes (engine lacks implementation). Forums advise against.<grok:render card_id="2ef0d8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">127</argument>
</grok:render>
- **Overrides & Additions**: Standard modding workflow:
  1. Extract via KOTOR Tool (`scripts.bif > Script, Source > nwscript.nss`).
  2. Edit (fix/add), save as .nss in `Override`.
  3. Use with nwnnsscomp for compilation.<grok:render card_id="30811a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render><grok:render card_id="8e84c1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">75</argument>
</grok:render>
- Examples: TSLPatcher/TSL Patcher tools bundle fixed versions; mods like Hardcore/Improved AI reference custom includes (not core uncomments).<grok:render card_id="d1ac41" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- Advanced: DeNCS/ncs2nss require game-specific `nwscript.nss` for accurate decompiles; modders parse it for custom tools.<grok:render card_id="8a722c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render>

In summary, while no one has publicly shared a "uncomment everything" patch (likely futile), the modding scene thrives on careful overrides, with thousands of posts across these sites confirming the practice since 2003.

**Key Citations:**
- [Deadly Stream: Fair Strides' Script Shack](https://deadlystream.com/topic/4808-fair-strides-script-shack/page/7/)<grok:render card_id="90483c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [Czerka Wiki: nwscript.nss](https://czerka-rd.fandom.com/wiki/Nwscript.nss)<grok:render card_id="308946" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">75</argument>
</grok:render>
- [LucasForums: Syntax Error in K2 nwscript.nss](https://www.lucasforumsarchive.com/thread/142901-syntax-error-in-kotor2-nwscriptnss)<grok:render card_id="6ad629" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">86</argument>
</grok:render>
- [Reddit: Movement Speed Modding](https://www.reddit.com/r/kotor/comments/9dr8iy/modding_question_movement_speed_increase_in_k2/)<grok:render card_id="f56699" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">74</argument>
</grok:render>
- [Deadly Stream: nwscript.nss Thread](https://deadlystream.com/topic/6892-nwscriptnss/)<grok:render card_id="0a222d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render>
- [LucasForums: Warning on Editing nwscript.nss](https://www.lucasforumsarchive.com/thread/168643-im-trying-to-change-classes2da)<grok:render card_id="b25662" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">127</argument>
</grok:render>

## User

_Time: 2025-11-24T16:47:44.099Z_

Find the source code to nwnnsscomp.exe. Any and all of them. Should be multiple since 2001 find kotor-specific ones please.

## Assistant

_Time: 2025-11-24T16:49:13.090Z_

**No complete public source code for the original BioWare `nwnnsscomp.exe` (from ~2002) was found, but multiple open-source versions, forks, and reimplementations exist since 2004, primarily from the OpenKnights project and later updates. KOTOR-specific adaptations (e.g., for KOTOR Tool, TSL Patcher) use modified binaries without released source; modders rely on these tweaked NWN-originated compilers.**

### Available Source Repositories
| Repository | Description | KOTOR Support? | Date/Version | Key Files/Link |
|------------|-------------|----------------|--------------|---------------|
| [virusman/nwnexplorer (nwnnsscomp)](https://github.com/virusman/nwnexplorer/tree/master/nwnnsscomp) | VS2022-updated build of OpenKnights `nwnnsscomp` sources; compiles to `.exe` for NWN/KOTOR scripting. | Yes (Aurora engine compatible) | Updated 2022 (orig. ~2004) | `.vcproj`, `.cpp`/`.h` sources<grok:render card_id="ead7be" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="ed3b7b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">45</argument>
</grok:render> |
| [nwneetools/nwnsc](https://github.com/nwneetools/nwnsc) | Full open-source NWScript compiler (not direct `nwnnsscomp` port); supports NWN/NWN2 EE compilation to `.ncs`. | Partial (NWN-focused; adaptable) | Active (2008+ contribs) | `NWNScriptCompilerLib`, build via VS<grok:render card_id="6b52ea" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render><grok:render card_id="3baa59" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render> |
| OpenKnights NWNTools (historical CVS) | Original leaked/released `nwnnsscomp` sources (~2004); base for KOTOR forks. Archived/mirrored variably. | Yes (KOTOR modders adapted) | 2004-2005 | CVS: `nwnnsscomp.cpp`/`.h`<grok:render card_id="cf96b3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render> |

**Download pre-built KOTOR-compatible binaries from mod tools (source unavailable):**
- [KOTOR Tool (includes custom `nwnnsscomp` v1.0+)](https://deadlystream.com/files/file/280-kotor-tool/)<grok:render card_id="ada33e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render>
- [TSL Patcher (modified for token substitution)](https://deadlystream.com/files/file/1039-tsl-patcher-tlked-and-accessories/)<grok:render card_id="da8a6d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">83</argument>
</grok:render>

---

The `nwnnsscomp.exe` is a standalone NWScript (`.nss` to `.ncs`) compiler/decompiler originating from Neverwinter Nights (NWN, 2002) development tools, adapted for KOTOR (2003) and KOTOR 2 (2004) modding via the Aurora engine. BioWare never officially released source, but community efforts since ~2004 yielded open-source equivalents.<grok:render card_id="5a667c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render><grok:render card_id="3c27bf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">76</argument>
</grok:render>

#### Historical Context (2001-2005)
- **Pre-2002**: No public tools; NWN beta internals only.
- **2002-2003 (NWN/KOTOR era)**: OpenKnights consortium released `NWNTools` including `nwnnsscomp` sources via SourceForge CVS (`openknights/NWNTools/nwnnsscomp`). This C++ codebase (~20 files: `nwnnsscomp.cpp`, `lexer.cpp`, `parser.cpp`, etc.) was the first public version, forked for KOTOR (e.g., `nwscript.nss` lookup).<grok:render card_id="b3f52c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render><grok:render card_id="639041" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render>
- **2004-2005**: KOTOR Tool by Fred Tetra bundled "rewritten/customized" `nwnnsscomp` (v1.05 binary in `kotortoolset/nwnnsscomp-kotor-1.05.tar.gz` on SourceForge); source tweaks for KOTOR syntax/errors (e.g., `SetOrientOnClick`). No public source release.<grok:render card_id="56492e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render><grok:render card_id="827aea" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render><grok:render card_id="fc84c5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">75</argument>
</grok:render>
- CVS archives partially lost; mirrors reference it as base.<grok:render card_id="496b7d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render>

#### Modern Open-Source Versions & Forks
| Version/Fork | Origin | Key Features/Changes | KOTOR Notes | Access |
|--------------|--------|----------------------|-------------|--------|
| OpenKnights (2004) | Community leak/port | Core lexer/parser; decompiles too. | Base for all KOTOR tools. | CVS (archived): `viewvc.sourceforge.net/openknights/NWNTools/nwnnsscomp`<grok:render card_id="caf036" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render> |
| virusman/nwnexplorer (2022) | OpenKnights fork | VS2022 project; Windows `.exe` build. | Full KOTOR compatibility (tested NWN/KOTOR). | [GitHub](https://github.com/virusman/nwnexplorer/tree/master/nwnnsscomp)<grok:render card_id="3ba418" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> |
| nwneetools/nwnsc | Torlack/Skywing/OpenKnights contribs | Full compiler lib/JIT/VM; NWN2 support. | Adaptable (NWScript identical). | [GitHub](https://github.com/nwneetools/nwnsc); VS build<grok:render card_id="b4f54d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render> |
| PRC NWNTools (1.69 compat) | NWN PRC fork | VS2005 build; treasure system broken. | NWN-focused. | SVN: `nwnprc/trunk/tools/NWNTools169compat.7z`<grok:render card_id="318bf5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">66</argument>
</grok:render> |
| Skywing NWN EE Compiler | Skywing engine | Packed files; EE updates. | Not KOTOR. | Beamdog forums/GitHub<grok:render card_id="f5557d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">54</argument>
</grok:render> |

#### KOTOR-Specific Adaptations (No Public Source)
- **Fred Tetra's KOTOR Tool (2004+)**: "Rewritten" version with KOTOR Tool integration; handles KOTOR `nwscript.nss` syntax fixes.<grok:render card_id="7bb761" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render><grok:render card_id="f42c85" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">75</argument>
</grok:render>
- **TSL Patcher (2008+)**: Modified for `.2da` token substitution in scripts.<grok:render card_id="303dce" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render>
- **KotOR Scripting Tool (2021)**: GUI wrapper; uses self-contained KOTOR/TSL `nwnnsscomp`; source *of GUI* public, not compiler.<grok:render card_id="78d620" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">47</argument>
</grok:render><grok:render card_id="6d7b37" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">63</argument>
</grok:render>
- Forums confirm NWN source "tweaked" for KOTOR (e.g., error strings retain "NwnStdLoader"). No leaks found.<grok:render card_id="423ef2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render><grok:render card_id="d2505f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">76</argument>
</grok:render>

#### Building from Source
- **virusman fork**: Open in Visual Studio 2022; build `nwnnsscomp.vcproj` → `nwnnsscomp.exe`.
- **nwnsc**: VS for libs; Docker for tests. Releases provide binaries.
- Historical: VS2003/2005 for OpenKnights/PRC.

No 2001 sources (pre-NWN release); earliest ~2004 OpenKnights. For decompiling alternatives: [lachjames/ncs2nss](https://github.com/lachjames/ncs2nss).<grok:render card_id="608eec" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>

**Key Citations:**
- [GitHub: virusman/nwnexplorer](https://github.com/virusman/nwnexplorer)<grok:render card_id="b97dff" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [Deadly Stream: KOTOR Scripting Tool](https://deadlystream.com/files/file/191-kotor-scripting-tool-2021/)<grok:render card_id="a430bc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render>
- [GitHub: nwneetools/nwnsc](https://github.com/nwneetools/nwnsc)<grok:render card_id="3ec646" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render>
- [PRC Forum: Compiler Source](https://nwnprc.com/index.php?topic=364.0)<grok:render card_id="2c4b63" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">66</argument>
</grok:render>
- [xoreos: OpenKnights Mirror Ref](https://xoreos.org/blog/2016/01/12/disassembling-nwscript-bytecode/)<grok:render card_id="2c72e5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render>
- [Deadly Stream: KOTOR Tool](https://deadlystream.com/files/file/280-kotor-tool/)<grok:render card_id="bbae58" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render>
