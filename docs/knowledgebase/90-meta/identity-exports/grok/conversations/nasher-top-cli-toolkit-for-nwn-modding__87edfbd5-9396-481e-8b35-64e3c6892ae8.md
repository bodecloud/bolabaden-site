---
source_url: "https://grok.com/c/87edfbd5-9396-481e-8b35-64e3c6892ae8"
conversation_id: "87edfbd5-9396-481e-8b35-64e3c6892ae8"
title: "Nasher: Top CLI Toolkit for NWN Modding"
extracted_at: "2026-06-29T16:17:35.816Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Nasher: Top CLI Toolkit for NWN Modding

Source: [Grok conversation](https://grok.com/c/87edfbd5-9396-481e-8b35-64e3c6892ae8)

## User

_Time: 2025-11-21T01:10:40.871Z_

nwn, kotor, jade empire, or dragon age cli toolkit. Looking for a powerful CLI tool for working with the game(s)

## Assistant

_Time: 2025-11-21T01:11:00.055Z_



## User

_Time: 2025-11-21T01:11:06.463Z_

nwn cli toolkit. Looking for a powerful CLI tool for working with the game(s)

## Assistant

_Time: 2025-11-21T01:12:14.275Z_

**Nasher is the most powerful and community-recommended CLI toolkit for Neverwinter Nights modding and development.**  
**It excels at version-controlled workflows for modules, haks, ERFs, and TLKs, with fast builds, multi-target support, and seamless integration with Git.**<grok:render card_id="37f11b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">155</argument>
</grok:render><grok:render card_id="3b5a3c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">132</argument>
</grok:render>  
**For raw file manipulation (GFF, ERF, 2DA, TLK, etc.), pair it with the neverwinter.nim CLI suite, which powers Nasher and provides dozens of specialized utilities.**<grok:render card_id="62e605" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">152</argument>
</grok:render>  
**NWT offers a streamlined alternative focused on JSON5-based module/hak projects, ideal for macOS EE users seeking Maven-like builds.**<grok:render card_id="43ad5a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">153</argument>
</grok:render>  

### Recommended Tool: Nasher
Nasher transforms binary NWN files (.mod, .hak, .erf, .tlk) into editable JSON/NWNT sources for Git versioning, then rebuilds, installs, and launches them. It's cross-platform, binary-distributable, and handles large projects efficiently. Download binaries from [GitHub Releases](https://github.com/squattingmonk/nasher/releases).<grok:render card_id="76e49a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">155</argument>
</grok:render>

**Quick Start** (assumes NWN:EE installed; set `NWN_ROOT` env var if needed):  
1. Download/extract `nasher` binary to PATH.  
2. `nasher init myproject` (creates `nasher.cfg`, Git repo).  
3. `nasher unpack` (extracts sources).  
4. Edit files in `src/`, commit to Git.  
5. `nasher install` (compiles NSS, packs, installs to NWN dir).  
6. `nasher play myproject` (launches in-game).<grok:render card_id="803869" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">155</argument>
</grok:render>

### Alternatives
- **NWT**: Git-friendly for .mod/.hak; `nwt init`, `nwt install`. macOS-focused.<grok:render card_id="379e65" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">153</argument>
</grok:render>  
- **nwn-devbase**: YAML-based .mod versioning; Docker-friendly.<grok:render card_id="32058e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">154</argument>
</grok:render>  
- **neverwinter.nim**: 20+ utils for file ops (e.g., `nwn_gff` for GFF<->JSON, `nwn_script_comp` for NSS). Binaries available.<grok:render card_id="0a6c77" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">152</argument>
</grok:render>

All tools support NWN1:EE (primary focus); NWN1 original via compatibility paths. NWN2 has separate CLI tools (e.g., on Neverwinter Vault).<grok:render card_id="56a98e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render>

---

Nasher stands out as the premier CLI toolkit for Neverwinter Nights (NWN) development, particularly for NWN: Enhanced Edition (EE), due to its comprehensive build pipeline, community adoption, and efficiency in handling version-controlled modding workflows. Developed by Michael A. Sinclair (squattingmonk), it unpacks binary archives into human-readable JSON or NWNT sources, compiles NWScript (.nss), packs them back, installs to your NWN directory, and even launches modules for testing—all from the command line. This enables traditional software practices like Git branching, pull requests, and CI/CD for module/hak/ERF projects.<grok:render card_id="6de312" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">155</argument>
</grok:render><grok:render card_id="71248f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">132</argument>
</grok:render>

### Core Strengths of Nasher
- **Version Control Native**: Converts binaries to text sources; Git diffs show exact changes in GFF structures, scripts, etc. Custom layouts (e.g., scripts by category) and multi-target builds (e.g., full module + demo ERF) from one repo.
- **Fast and Incremental**: Nim-based for speed; skips unchanged files, supports `--packUnchanged`.
- **Full Lifecycle**: Unpack → Edit → Convert (JSON→GFF) → Compile → Pack → Install → Launch (play/serve/test).
- **Configurable**: `nasher.cfg` defines targets, sources/includes/excludes, variables. Global/local config via `nasher config` for compilers, paths.
- **Cross-Platform**: Windows/macOS/Linux binaries; Docker images for isolation.

**Detailed Command Reference** (run `nasher <cmd> --help` for options):  
| Command | Description | Example |
|---------|-------------|---------|
| `init` | Setup project (nasher.cfg, Git). | `nasher init mymod --default` |
| `unpack` | Extract binary to sources. | `nasher unpack mymod --removeDeleted` |
| `convert` | JSON/NWNT → GFF. | `nasher convert all --clean` |
| `compile` | .nss → .ncs. | `nasher compile mymod --file:src/foo.nss` |
| `pack` | Full build (convert+compile+pack). | `nasher pack mymod --noCompile` |
| `install` | Pack + copy to NWN dir (override/hak/etc.). | `nasher install haks --yes` |
| `play/serve/test` | Pack+install+launch. | `nasher play mymod` |
| `list/config` | View targets/settings. | `nasher list --verbose` |

**Workflow Example: Git-Based Module Dev**  
1. `nasher init module` → Edit `nasher.cfg` for sources: `include = "src/**/*.{nss,json}"`.  
2. Copy existing .mod: `nasher unpack module existing.mod`.  
3. `git add . && git commit -m "v1.0"`.  
4. Edit `src/scripts/player.nss`, `git commit`.  
5. `nasher install module --clean` → Test in NWN.  
6. Branch/PR for collab.<grok:render card_id="fe2e43" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">155</argument>
</grok:render>

### Supporting Toolkit: neverwinter.nim
Nasher relies on this Nim library's CLIs for core ops (e.g., `nwn_script_comp`, `nwn_erf`, `nwn_gff`). Download binaries from [Releases](https://github.com/niv/neverwinter.nim/releases). Standalone power:  
- **Resman/Key Utils**: `nwn_resman_grep nwn_base.key "nw_i0_tool"`, `nwn_key_unpack data.nwn_base.key`.  
- **Formats**: `nwn_gff creature.uti --to json`, `nwn_tlk dialog.tlk --to csv`, `nwn_twoda racialtypes.2da --to tsv`.  
- **NWSync**: Server manifest mgmt (`nwn_nwsync_write`).  
EE-specific; 20+ tools for inspection/conversion.<grok:render card_id="b5f3a7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">152</argument>
</grok:render><grok:render card_id="a40cbd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">151</argument>
</grok:render>

### Comparison of Top CLI Toolkits
| Toolkit | Focus | Formats | Source Format | Platforms | Dependencies | Git Integration | Last Active | Stars (approx.) |
|---------|-------|---------|---------------|-----------|--------------|-----------------|-------------|-----------------|
| **Nasher**<grok:render card_id="1096a4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">155</argument>
</grok:render> | Build pipeline (unpack/build/install/launch) | .mod, .hak, .erf, .tlk | JSON/NWNT | Win/Mac/Linux/Docker | neverwinter.nim | Native (multi-target) | 1.1.1 (recent) | High community use |
| **NWT**<grok:render card_id="b89581" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">153</argument>
</grok:render> | Module/hak projects (Maven-style) | .mod, .hak, .nwm, GFF, .bif/.key (read) | JSON5 | macOS (EE Steam; Win/Linux planned) | None | Strong (init/gitignore) | Mar 2024 | Emerging |
| **nwn-devbase**<grok:render card_id="123c62" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">154</argument>
</grok:render> | .mod YAML versioning | .mod (GFF) | YAML | Win/Linux (Docker) | Ruby/Nim/NSS compiler | Git-focused | Recent (2025) | Niche |
| **neverwinter.nim**<grok:render card_id="204b78" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">152</argument>
</grok:render> | File utils/library | GFF/ERF/TLK/2DA/SSF/Key/NWSync | JSON/CSV/TSV/etc. | All (binaries) | Nim 2.0 | Manual | Active | Backend for others |

### Other Options and NWN2
- **NWT**: Best for quick JSON5 workflows: `nwt init . module.mod && nwt install`. Incremental NSS compile; `nwt diff` verifies builds.<grok:render card_id="25dee9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">153</argument>
</grok:render>  
- **nwn-devbase**: `nwn-build init && nwn-build extract` for YAML .mod; symlink for toolset access.<grok:render card_id="2f6b57" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">154</argument>
</grok:render>  
For NWN2: Vault-hosted CLI tools for HAK/TRN/GFF/TLK/server admin (standalone/multi-platform).<grok:render card_id="17d734" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render><grok:render card_id="d01889" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render>

**Tips**: Set env vars (`NWN_ROOT`, `NWN_USERDIR`) for paths. Use VSCode with nwscript extension for NSS. Community: Neverwinter Vault/Discord, Beamdog forums, Reddit r/neverwinternights. No official CLI from Beamdog, but these fill the gap effectively.<grok:render card_id="f4bd9c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">132</argument>
</grok:render>

### Key Citations
- [GitHub - squattingmonk/nasher](https://github.com/squattingmonk/nasher)<grok:render card_id="f59fa9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">155</argument>
</grok:render>
- [Nasher Promo - Neverwinter Vault](https://forum.neverwintervault.org/t/nasher-a-command-line-build-tool-for-nwn-development/2187)<grok:render card_id="0b7aef" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">132</argument>
</grok:render>
- [GitHub - niv/neverwinter.nim](https://github.com/niv/neverwinter.nim)<grok:render card_id="57c8c2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">152</argument>
</grok:render>
- [GitHub - jeffmcclure/nwt](https://github.com/jeffmcclure/nwt)<grok:render card_id="0e697f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">153</argument>
</grok:render>
- [GitHub - jakkn/nwn-devbase](https://github.com/jakkn/nwn-devbase)<grok:render card_id="5625f2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">154</argument>
</grok:render>
- [Beamdog Forums - NWN1 CLI Utilities](https://forums.beamdog.com/discussion/67044/nwn1-command-line-utilities)<grok:render card_id="b4f706" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">151</argument>
</grok:render>
- [Neverwinter Vault - NWN2 CLI Tools](https://neverwintervault.org/project/nwn2/other/tool/nwn2-cli-tools-and-library-standalone-multi-platform)<grok:render card_id="f6f088" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render>

## User

_Time: 2025-11-21T01:33:05.854Z_

nah none of those are what i'm looking for. I'm looking for a powerful flexible tool for working with the nwn game and the installation, full of parsers/manipulators/discovers etc.

## Assistant

_Time: 2025-11-21T01:34:23.741Z_

**nwn-lib-d provides the most powerful and flexible open-source CLI toolkit for parsing, manipulating, and discovering Neverwinter Nights (NWN1/EE and NWN2) game files.**<grok:render card_id="925266" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render><grok:render card_id="a0381e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">146</argument>
</grok:render>

It includes specialized binaries like `nwn-gff` (GFF ↔ JSON editing), `nwn-erf` (HAK/MOD pack/unpack), `nwn-tlk` (TLK text export), `nwn-2da` (table fixing/merging), and terrain tools—ideal for installation management (overrides, haks) without unpacking everything.<grok:render card_id="c0a3a4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render>

**For base game discovery/extraction from KEY/BIF files, use Tero Kivinen's Perl CLI suite (keyunpack.pl, erfunpack.pl, etc.).** Run from your NWN install dir to grep/extract resources like scripts across chitin.key/nwn_base.key.<grok:render card_id="72c8ac" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">147</argument>
</grok:render><grok:render card_id="fd1402" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>

Download nwn-lib-d prebuilts: [GitHub Releases](https://github.com/CromFr/nwn-lib-d/releases).<grok:render card_id="0773f7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render>

---

### Quick Start: nwn-lib-d
**Platforms**: Windows/Linux (DMD/LDC2 builds; no NWN install needed).<grok:render card_id="b3798f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render>

| Tool | Key Commands | Use Case |
|------|--------------|----------|
| `nwn-gff` | `nwn-gff input.uti --to json` <br> `nwn-gff data.json --to gff -o output.uti` | Parse/edit GFF (items/creatures/areas) to/from pretty JSON; preserves order for Git diffs.<grok:render card_id="d83fec" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render> |
| `nwn-erf` | `nwn-erf myhak.hak --extract` <br> `nwn-erf --pack mydir -o newhak.hak` | Unpack/pack HAKs/MODs/ERFs; reproducible builds.<grok:render card_id="a39f6e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render> |
| `nwn-tlk` | `nwn-tlk dialog.tlk --to text` | Export TLK strings to readable text. |
| `nwn-2da` | `nwn-2da racialtypes.2da --check --fix` | Validate/merge/fix 2DA tables. |
| `nwn-trn` | `nwn-trn area.trn trrn-export` | Terrain/walkmesh export/import (OBJ). |

**Workflow for Installation**: Extract HAK → edit GFF/2DA with json → repack/install to `hak/` or `override/`. Fast, memory-efficient.<grok:render card_id="f80338" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render>

### Kivinen Perl Suite (Installation-Focused)
**Perl scripts** (requires Perl; cross-platform; pre-EE but adaptable).<grok:render card_id="744b39" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">147</argument>
</grok:render>

**Run from NWN root** (`data/` with keys/BIFs):
- `./keyunpack.pl -d scripts/ -p '.*\.nss$' *.key` → Extracts all base scripts.<grok:render card_id="6fb86c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">147</argument>
</grok:render>
- `./erfunpack.pl --mkdir --dir mymod/ mymod.mod` → Unpack module.
- `./gffmatch.pl *.git --include Creature --find '/Plot:1$'` → Discover plot creatures across GFFs.
- `./erfpack.pl --dir mymod/ -o new.mod` → Repack.

Downloads: [kivinen.iki.fi/nwn/downloads.html](https://kivinen.iki.fi/nwn/downloads.html).<grok:render card_id="5dec96" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">142</argument>
</grok:render>

nwn-lib-d excels for modern EE workflows (active releases through 2023+); Kivinen for raw install probing. No single tool covers *everything* like a full resman suite, but this combo is unmatched for flexibility.<grok:render card_id="7c640b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render><grok:render card_id="23704b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">147</argument>
</grok:render>

---

nwn-lib-d stands out as the premier CLI toolkit for comprehensive NWN resource manipulation, offering a cohesive suite of high-performance tools built in D for both NWN1:EE and NWN2. Unlike build-focused tools, it emphasizes direct file surgery—parsing binary formats to editable text (JSON/text), precise editing, and repacking—with features like order-preserving diffs and streaming for large haks. It's actively maintained (releases into late 2023, automated CI), multi-platform, and binary-distributable, making it ideal for scripting installation tweaks, mod auditing, or bulk operations on overrides/haks/tlks/2das.<grok:render card_id="9487e7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render><grok:render card_id="aada9f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">146</argument>
</grok:render>

### Detailed nwn-lib-d Capabilities
The toolkit targets core NWN formats without requiring the game:

**Core Parsers/Manipulators**:
- **nwn-gff**: Full bidirectional GFF (e.g., .are, .bic, .ifo, .uti) ↔ JSON/NWScript-like pretty text. Supports add/remove/set nodes; duplicate fields; legacy JSON. Example: `nwn-gff creature.uti --to pretty` for human-readable tree; edit JSON, `--to gff` back. Great for override tweaks.<grok:render card_id="c6bc4c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render>
- **nwn-erf**: ERF/HAK/MOD/PWC pack/unpack. `--extract` dumps contents; `--pack` rebuilds deterministically (zero buildDate). Handles large archives efficiently.<grok:render card_id="63b82f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render>
- **nwn-tlk**: TLK ↔ plain text (strrefs resolved).<grok:render card_id="86155a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render>
- **nwn-2da**: 2DA validation (`--check`), auto-fix (`--fix`), row merging for overrides.<grok:render card_id="ec61e3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render>

**Advanced/Discovery**:
- **nwn-trn**: TRN/TRX terrain dissection—export/import meshes (OBJ), walkmeshes (colored for navmesh viz), strip non-walkables (50% size cut), water layers.
- **nwn-srv**: NWN2 server ping/query (latency, status)—useful for install validation.
- **nwn-bdb**: BioWare DBF search (regex)—legacy data mining.

**Library Bonus**: Embed in scripts (D API); NWScript reimpls for testing.

**Build/Install**: `dub build` (DUB); prebuilts in releases (win32/64, linux). Git-friendly (`.gitattributes` for GFF diffs).<grok:render card_id="317cb2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render>

### Complement: Kivinen's Perl Toolkit (Base Install Specialist)
For probing the *vanilla installation* (KEY/BIFs), Tero Kivinen's scripts (early 2000s, Perl 5) remain potent. Place in NWN `data/`; they resolve resource precedence automatically.<grok:render card_id="87bdd9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">147</argument>
</grok:render><grok:render card_id="4bcd27" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>

| Tool | Usage Example | Discovery/Manipulation |
|------|---------------|-------------------------|
| `keyunpack.pl` | `./keyunpack.pl -d out/ -p '.*\.nss$' nwn_base.key` | **Discovers/extracts** any resref from KEY→BIF chain (scripts, models). `-m` merges duplicates.<grok:render card_id="6c4751" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">147</argument>
</grok:render> |
| `erfunpack.pl` / `erfpack.pl` | `./erfunpack.pl --dir mod/ mod.mod` | Unpack/repack user ERFs (haks/mods). |
| `gffprint.pl` | `./gffprint.pl --dialog dialog.tlk area.git` | **Parses/displays** GFF trees (strref-resolved). |
| `gffmatch.pl` | `./gffmatch.pl *.uti --find '/Plot:1$'` | **Searches** GFF fields/structures regex across files. |
| `gffcmp.pl` | `./gffcmp.pl file1.uti file2.uti` | **Diffs** GFFs (exclude fields). |

Downloads via site (archives w/ modules for GFF/ERF/KEY/BIF). EE-compatible w/ nwn_base.key (user-tested).<grok:render card_id="93a5b4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">142</argument>
</grok:render>

### Comparison of CLI Suites
| Suite | Formats | Discovery (Install) | Manipulation | Platforms/Binaries | Activity | Best For |
|-------|---------|----------------------|--------------|--------------------|----------|----------|
| **nwn-lib-d**<grok:render card_id="645047" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render> | GFF, TLK, 2DA, ERF/HAK/MOD, TRN, DBF | HAK/override scan (no KEY/BIF) | Pack/unpack/edit/merge | Win/Linux (prebuilts) | Recent (v1.1.2) | Mod/install file surgery<grok:render card_id="bdde5e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">146</argument>
</grok:render> |
| **Kivinen Perl**<grok:render card_id="832984" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">147</argument>
</grok:render> | KEY/BIF, ERF/MOD, GFF | Full KEY→BIF grep/extract | Unpack/pack/search/diff | Any (Perl) | Legacy | Base game extraction |
| NWN Explorer Sources<grok:render card_id="a8ff42" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">119</argument>
</grok:render> | KEY/BIF browse | Resource tree (GUI+?) | Extract | Source (EE update) | 2018+ | GUI fallback |

### Other/Notable
- **TA Tools** (Vault): CLI utils like `head_renamer` (bulk head models), nwhak.exe replacer—niche hak tweaks.<grok:render card_id="9077bf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render>
- **NIT**: GUI mod manager (install/uninstall haks); no CLI.<grok:render card_id="9943db" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">60</argument>
</grok:render>
- No robust Python/Ruby suites found; Nim/D/Perl dominate.

Community: Neverwinter Vault, Beamdog Forums, nwn.wiki. For EE servers, pair w/ nwnsync tools (but Nim-based).<grok:render card_id="f09835" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">132</argument>
</grok:render>

### Key Citations
- [GitHub - CromFr/nwn-lib-d](https://github.com/CromFr/nwn-lib-d)<grok:render card_id="8fd39c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">141</argument>
</grok:render>
- [nwn-lib-d Releases](https://github.com/CromFr/nwn-lib-d/releases)<grok:render card_id="0718e9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">146</argument>
</grok:render>
- [Kivinen NWN Tools Examples](https://kivinen.iki.fi/nwn/examples.html)<grok:render card_id="704628" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">147</argument>
</grok:render>
- [Kivinen NWN Tools](https://kivinen.iki.fi/nwn/)<grok:render card_id="f4f4c4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- [GitHub - virusman/nwnexplorer](https://github.com/virusman/nwnexplorer)<grok:render card_id="15c063" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">119</argument>
</grok:render>
- [TA Tools - Neverwinter Vault](https://neverwintervault.org/project/nwn1/other/tool/ta-tools-utilities-nwhakexe-replacement)<grok:render card_id="9e3dcf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render>
- [NIT - Neverwinter Vault](https://neverwintervault.org/project/nwn1/other/tool/neverwinter-nights-mod-installer-tool-nit)<grok:render card_id="87d113" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">60</argument>
</grok:render>
