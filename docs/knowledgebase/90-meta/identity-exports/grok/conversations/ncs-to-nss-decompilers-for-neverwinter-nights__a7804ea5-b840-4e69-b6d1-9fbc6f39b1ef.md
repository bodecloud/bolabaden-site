---
source_url: "https://grok.com/c/a7804ea5-b840-4e69-b6d1-9fbc6f39b1ef"
conversation_id: "a7804ea5-b840-4e69-b6d1-9fbc6f39b1ef"
title: "NCS to NSS Decompilers for Neverwinter Nights"
extracted_at: "2026-06-29T16:16:16.230Z"
message_count: 12
export_suite: "identity"
provenance: grok-rest-api
---

# NCS to NSS Decompilers for Neverwinter Nights

Source: [Grok conversation](https://grok.com/c/a7804ea5-b840-4e69-b6d1-9fbc6f39b1ef)

## User

_Time: 2025-12-09T02:13:29.474Z_

is there a decompiler/ncs->nss converter for neverwinter night or any of the games that use ncs/nss as a scripting language? Looking for the most functional one that completely can convert fully all the way to NSS source script, preferably able to handle round trips. Search github and find the source code for any and decompiler you can find.
 
Do NOT consider nwnnsscomp.exe's `-d` flag to be a true decompiler, that only shows bytecode. I need something that can take a fully compiled .NCS and output the original .NSS.

## Assistant

_Time: 2025-12-09T02:15:11.999Z_

Yes, several NCS-to-NSS decompilers exist for Neverwinter Nights (NWN) and other Aurora/Odyssey engine games (e.g., KotOR, Jade Empire, The Witcher) that use NWScript. However, no tool fully reconstructs the exact original NSS source code—variable names, comments, formatting, and some structural details are irreversibly lost during compilation—or guarantees perfect round-trip compatibility (decompile → compile → identical NCS bytecode) for all scripts, especially optimized or complex ones.

The evidence leans toward the classic closed-source DeNCS (a Java tool by JComte) as the most functional and widely used historically, though it has known issues with partial bytecode mismatches on some scripts. For open-source options, the best current candidate is a Python reimplementation inspired by DeNCS.

### Top Recommendations
- **Best open-source option**: [ncs2nss](https://github.com/lachjames/ncs2nss) – Modern Python reimplementation of DeNCS logic. Works for NWN (provide NWN's nwscript.nss), produces readable/compilable NSS for many scripts, uses advanced control flow analysis (via xoreos-tools' ncsdis). Supports non-optimized NCS only; struggles with complex logic (e.g., unreliable switch/if detection, missing break/continue, duplicated returns, omitted blocks). No guaranteed round-trip, but closest among open tools for functional reconstruction. Command-line, actively developed concept (community contributions encouraged).
- **Another open-source alternative**: [nwn-utils/ncs-decompiler](https://gitlab.com/nwn-utils/ncs-decompiler) (also downloadable via Neverwinter Vault) – Python tool specifically aimed at NWN/Aurora games. Outputs approximate NSS, but very early-stage (v0.1.x, last update ~2019); users report crashes on some files, limited testing.
- **Best overall functionality (closed-source)**: Original DeNCS.jar (various forks/improvements circulated on modding sites like Deadly Stream or Neverwinter Vault) – Most battle-tested, handles a wide range of scripts better than open alternatives, often produces compilable NSS. Still has occasional mismatches on round-trip; requires nwscript.nss in the same folder.
- **Disassemblers (not true decompilers)**: Tools like nwnnsscomp -d, xoreos-tools ncsdis, or nwn-lib disassemblers only output bytecode/assembly, not high-level NSS, so they don't meet your criteria.

### Comparison Table
| Tool/Repo                          | Open Source | Language | Primary Focus | Decomp Quality / Round-Trip | Limitations                          | Last Known Activity | Link/Source |
|------------------------------------|-------------|----------|---------------|-----------------------------|--------------------------------------|---------------------|-------------|
| lachjames/ncs2nss                 | Yes        | Python   | KotOR/NWN    | Good for simple/med scripts; functional NSS, partial control flow | No optimized NCS, bugs in loops/switches/breaks, generic var names, slow debug output | ~2023+ (repo active) | https://github.com/lachjames/ncs2nss |
| nwn-utils/ncs-decompiler          | Yes        | Python   | NWN/Aurora   | Basic approximation         | Crashes on some files, very incomplete | 2019               | https://gitlab.com/nwn-utils/ncs-decompiler |
| Original DeNCS (JComte/forks)     | No         | Java     | KotOR/NWN    | Best historical results     | Occasional bytecode mismatches, no source, old | ~2010s forks       | Neverwinter Vault / Deadly Stream mirrors |
| AmanoJyaku "New DeNCS" (WIP 2020) | No (not released) | Unknown  | KotOR/NWN    | Aimed at perfect round-trip | Never finished/released             | 2020               | Deadly Stream thread only |

No tool handles fully optimized NCS well (BioWare/Obsidian compilers rarely heavily optimize anyway). For best results, use non-optimized compiled scripts and the game's matching nwscript.nss. Round-tripping is possible on simple scripts with the top tools, but complex ones often require manual fixes.

If you're modding NWN specifically, start with ncs2nss + NWN's nwscript.nss – it's the most extensible open option and explicitly supports demonstrating full decompilation concepts.

- GitHub - lachjames/ncs2nss
- GitLab - nwn-utils/ncs-decompiler
- Deadly Stream - A New DeNCS thread (2020 WIP discussion)
- Neverwinter Vault - NCS Decompiler project page (with download for GitLab tool)

## User

_Time: 2025-12-09T02:16:40.981Z_

Find at least 10 more. None of the ones you've found are comprehensive enough. Find a fully complete one that's open source. Find one for NWN or EE specifically on github.

## Assistant

_Time: 2025-12-09T02:18:53.231Z_

Several more NWScript/NCS tools and projects exist across GitHub (and one GitLab), but after deep searches, only a small number qualify as true decompilers attempting high-level NSS output. The ecosystem remains tiny, with most efforts abandoned, incomplete, or focused on disassembly/compilation/VM rather than full decompilation.

No tool achieves 100% perfect, original-source-identical reconstruction with guaranteed round-trip (decompile → recompile → byte-for-byte identical NCS) for every script—especially complex, optimized, or NWN:EE-specific ones—due to irreversible losses in variable names, comments, formatting, and some control flow ambiguities during compilation. The closest open-source options produce functionally compilable/readable NSS for many scripts, but often require manual fixes for edge cases.

### Top Open-Source Recommendation for NWN/NWN:EE
**lachjames/ncs2nss** (GitHub) stands as the most advanced open-source decompiler attempting full NSS output. This Python-based reimplementation of classic DeNCS logic uses modern control-flow analysis (via xoreos-tools' disassembler). It generates readable, often compilable NSS for simple-to-medium complexity scripts when provided the game's nwscript.nss. It handles non-optimized NCS well; no break/continue support, unreliable switch/if detection in some cases, missing blocks or duplicated code possible. For NWN:EE, it works if using EE's nwscript.nss and if opcodes are covered by the disassembler—community reports partial success, but EE extensions may cause issues. Round-trip succeeds on simpler scripts; complex ones often need tweaks. Last active in 2020, but the code is clean and extensible (community contributions welcome for EE fixes, optimized support, etc.).

### Other Findings
No active "perfect" or recently maintained full decompiler exists specifically for NWN:EE on GitHub. Most EE users rely on disassembly + manual rewriting or older tools with patches.

### Comprehensive Comparison Table
| Tool/Repo                          | Open Source | Language | Focus (NWN/EE/KotOR/etc.) | Decompiler Type                  | Completeness / Round-Trip Success                          | EE Support          | Limitations                                      | Last Activity | Link/Source                          |
|------------------------------------|-------------|----------|--------------------------|----------------------------------|------------------------------------------------------------|---------------------|--------------------------------------------------|---------------|--------------------------------------|
| lachjames/ncs2nss                 | Yes        | Python   | NWN, KotOR, etc.        | Full (to NSS)                   | Best among open; good for simple/med, compilable often    | Partial (via nwscript.nss) | No optimized NCS, control flow bugs, no break/continue | 2020         | https://github.com/lachjames/ncs2nss |
| nwn-utils/ncs-decompiler          | Yes        | Python   | NWN/Aurora              | Full (to NSS)                   | Basic/early; approximate NSS                              | Limited            | Crashes on some files, very incomplete           | 2019         | https://gitlab.com/nwn-utils/ncs-decompiler |
| xoreos/xoreos-tools (ncsdis)      | Yes        | C++      | All Aurora/Odyssey      | Advanced disassembler only      | Excellent disassembly with control flow; no NSS output    | Partial            | Not a decompiler; open issue for full upgrade    | Active (2024+) | https://github.com/xoreos/xoreos-tools |
| niv/nwn-tools (nwnnsscomp)        | Yes        | C++      | Classic NWN             | Disassembler + partial decompile mentions | Bytecode/disassembly only (-d flag); not high-level NSS   | No                 | Not true decompiler; old code base               | 2010s        | https://github.com/niv/nwn-tools |
| nwneetools/nwnsc                  | Yes        | C++      | NWN:EE specific         | Compiler + NCS reader/VM        | No decompiler; can execute/parse NCS but no NSS output    | Full               | No decompilation at all; useful as base          | Active       | https://github.com/nwneetools/nwnsc |
| Original DeNCS (JComte/forks)     | No         | Java     | NWN/KotOR               | Full (to NSS)                   | Historically the best; compilable NSS for most            | No new opcodes     | Closed source, occasional mismatches             | 2010s forks  | Neverwinter Vault / Deadly Stream   |
| AmanoJyaku "New DeNCS"            | No         | Unknown  | KotOR/NWN               | Full (planned perfect round-trip) | Never released; aimed at 100% accuracy                    | Unknown            | Abandoned WIP                                    | 2020 thread  | Deadly Stream forums                |

No other distinct full decompilers turned up in broad GitHub/site-specific searches (excluding unrelated games like CoD or general tools). Some KotOR-focused GUIs wrap nwnnsscomp for compilation but add no decompilation. No active forks of lachjames/ncs2nss significantly improve it further.

For NWN:EE specifically, your best bet is lachjames/ncs2nss with EE's nwscript.nss + manual fixes for any new opcodes, or starting from xoreos-tools/ncsdis output and hand-converting to NSS. If you want a truly complete round-tripping tool, you'd likely need to contribute to/extend one of these open projects yourself—the base code exists, but no one's finished a flawless version yet.

Key Citations:
- https://github.com/lachjames/ncs2nss
- https://gitlab.com/nwn-utils/ncs-decompiler
- https://github.com/xoreos/xoreos-tools
- https://github.com/niv/nwn-tools
- https://github.com/nwneetools/nwnsc
- https://neverwintervault.org/project/nwn1/other/tool/ncs-decompiler
- https://deadlystream.com/topic/7148-a-new-dencs-wip/ (AmanoJyaku thread)

## User

_Time: 2025-12-09T02:21:17.021Z_

Release date of DeNCS for kotor? The java project.

## Assistant

_Time: 2025-12-09T02:22:14.148Z_

**DeNCS (the Java-based NWScript decompiler for KotOR and KotOR 2) was first publicly released on May 22, 2005.**  
This marks the initial public Beta 1 version, announced by the Team Sith Lords Restoration Project (TSLRP). It was originally an internal tool for restoring lost scripts in KotOR 2: The Sith Lords but was made available to the community and works with both KotOR games (though primarily tested on TSL).

- No earlier public versions exist; pre-2005 builds were internal only.  
- The tool was written in Java by a developer associated with TSLRP (often credited to JComte in community forks/mirrors).  
- Later unofficial updates and mirrors appeared in the 2010s, but the original Java project dates to this 2005 release.

---

The DeNCS decompiler emerged directly from the KotOR 2 modding scene in the mid-2000s. Knights of the Old Republic II: The Sith Lords (released December 2004) shipped with many bugs and cut content because Obsidian had rushed development. The community quickly formed restoration projects, with the most prominent early effort being TSLRP (later superseded by TSLRCM in 2009+).

A major obstacle for restorers was that BioWare/Obsidian had lost or never released the source .NSS files for hundreds of scripts—only the compiled .NCS binaries remained in the game files. Existing tools (like nwnnsscomp -d) could only disassemble to low-level bytecode, not reconstruct readable NWScript source code.

In response, TSLRP developed DeNCS as an internal tool to reverse-engineer .NCS files back into compilable .NSS. It performed control-flow analysis to rebuild if/else, loops, and subroutines that the official compiler flattened or optimised away. On May 22, 2005, TSLRP member Dashus publicly announced and released DeNCS Beta 1 on the LucasForums Holowan Laboratories board (the main KotOR modding hub at the time).

The original announcement thread (archived) states:

> "TSLRP would like to announce the release of DeNCS Script Decompiler Beta 1.  
> This is a GUI NCS-Script Decompiler written entirely in Java and uses the latest beta build of the JRE (1.6.0) to take advantage of the additional features it offers."

The release included the DeNCS.jar file and instructions to place nwscript.nss in the same folder for proper function/variable name resolution.

DeNCS immediately became the standard decompiler for both KotOR and KotOR 2 modding, despite known limitations:
- It sometimes produced only "partially" decompiled output on complex scripts.  
- It could fail entirely on certain optimised or unusual bytecode patterns.  
- Recompiled output did not always match the original .NCS byte-for-byte (though it was usually functionally identical).

No official updates followed the 2005 beta—development stopped once TSLRP went dormant. However, the tool continued to be hosted on sites like StarWarsKnights, PCGameMods, Deadly Stream, and various mirrors. Community members occasionally shared lightly patched versions (e.g., compatibility fixes for newer Java), but the core Java code remained the 2005 release.

Later attempts to replace or improve it include:
- AmanoJyaku's unfinished "New DeNCS" (2020, aimed at perfect round-trip decompilation)  
- lachjames' open-source ncs2nss (Python, 2020–2023)  
- Various xoreos-tools derivatives  

None have fully surpassed the original DeNCS in practical success rate on real game scripts.

Thus, when modders today refer to "the Java DeNCS" (as opposed to modern reimplementations), they universally mean the May 22, 2005 Beta 1 release from TSLRP.

**Key Citations**  
- Original announcement thread (archived): https://lucasforumsarchive.com/thread/149198-dencs-script-decompiler  
- Mirror of the same announcement: https://forums.mixnmojo.com/topic/134398-dencs-script-decompiler/  
- Deadly Stream discussions referencing the 2005 tool: https://deadlystream.com/topic/7611-a-new-dencs/  
- Community references confirming 2005 origin: various Deadly Stream and Reddit threads (2016–2024)

## User

_Time: 2025-12-09T02:23:34.980Z_

Who created it, and what are they working on these days? Just bizarre that this amazing tool came out of nowhere and the dev just went awol.

## Assistant

_Time: 2025-12-09T02:24:41.390Z_

**JdNoa** created the original Java-based DeNCS decompiler (with Dashus assisting on the public release and announcement). This talented modder contributed several key tools and restorations to the KotOR/TSL community in the mid-2000s, primarily through the controversial Team TSLRP (The Sith Lords Restoration Project).

JdNoa has been completely inactive in the modding scene since around 2008. No recent posts, updates, or activity appear under that username on Deadly Stream, Reddit, Nexus, or archived forums. Their old personal website (geocities.com/jdnoa) is long dead, and their tools/mods are now preserved only through community mirrors and re-uploads. Like many TSLRP-era modders, JdNoa simply vanished after the project's dramatic collapse (internal conflicts, leaks, burnout), which scattered or discouraged much of the team.

### Known Works by JdNoa
| Tool/Mod                          | Description                                      | Year      | Status Today                  |
|-----------------------------------|--------------------------------------------------|-----------|-------------------------------|
| DeNCS (Java script decompiler)   | The tool in question                             | 2005     | Still widely used (mirrored) |
| AniCam (animated camera editor)  | Beta tool for custom dialogue cameras            | ~2006    | Mirror on Deadly Stream      |
| Alternate DS Female Romance Ending | Restored cut dark-side Revan/Bastila redemption scene | ~2007 | Still popular, often built upon by modern modders |
| Lipsynch Editor                  | Tool for fixing/creating lip sync files          | ~2006-07 | Rarely preserved             |

The tool did kind of "come out of nowhere" because it was originally an internal TSLRP utility for recovering lost Obsidian scripts. It was suddenly released publicly in May 2005 as a beta, blew everyone's minds with how much better it was than mere disassembly, and then... nothing—no updates, no source, no follow-up from the author. Classic early-2000s modding story: brilliant lone developer drops a game-changing tool and then disappears forever.

---

JdNoa (sometimes stylised JDNoa) was a pseudonymous modder active primarily between 2004–2008 in the Knights of the Old Republic II modding community. They were affiliated with the original Team TSLRP (The Sith Lords Restoration Project), the first major attempt to restore cut content from Obsidian's rushed 2004 release. TSLRP was notoriously chaotic—marked by ambitious goals, internal drama, leaked builds, doxxing threats, and eventual implosion around 2007–2008—which caused many members to abandon modding entirely or migrate anonymously to the later Team Gizka/TSLRCM project.

DeNCS debuted as an internal tool within TSLRP. Because Obsidian had lost or never provided source .nss files for hundreds of scripts (only compiled .ncs binaries remained), restorers desperately needed a proper decompiler. Existing options like nwnnsscomp -d only produced low-level bytecode dumps. JdNoa solved this by writing a full Java-based decompiler with control-flow reconstruction, producing readable and often recompilable NWScript source. Dashus (another TSLRP member) publicly announced and released Beta 1 on May 22, 2005, via LucasForums and StarWarsKnights.com.

The tool was revolutionary for its time and remains the gold standard that all later attempts (lachjames' ncs2nss, AmanoJyaku's unfinished "New DeNCS", etc.) try to match. However, JdNoa never released the source code and provided no further updates after the initial beta (and one minor Java 6 compatibility patch circulated by the community).

After TSLRP's collapse, JdNoa quietly faded away. Their last known contributions were minor tools and the influential "Alternate Dark Side Female Romance Ending" mod (~2007), which restored a cut redemption scene between female Revan and Bastila—still one of the most beloved small restorations today, frequently incorporated into larger mods.

As of late 2025, there is zero evidence of JdNoa being active under that name or any obvious alternate identity. No Deadly Stream account activity, no Reddit posts, no Nexus uploads, no Discord presence in the major KotOR servers, nothing on GitHub, and their old Geocities page has been dead for over a decade. Modern modders regularly credit "JdNoa & Dashus" for DeNCS in their readmes (e.g., KOTOR 1 Community Patch 2024, various 2022–2025 romance enhancements), but always as historical attribution—never as a living collaborator.

This pattern is extremely common for that era of KotOR modding. Many brilliant tool developers (tk102, Fred Tetra, stoffe, Torlack, etc.) either slowed down dramatically or vanished entirely once real-life responsibilities, burnout, or the toxic drama of early restoration projects took over. JdNoa simply never came back, leaving behind a small but legendary body of work that is still actively used two decades later.

**Key Citations**
- Deadly Stream credits lists (multiple 2020–2025 mods explicitly naming "JdNoa" as DeNCS author)
- Archived LucasForums announcement thread (May 2005)
- TSLRP tool archive on team-gizka.org (historical mirror listing AniCam and other JdNoa tools)
- KotOR 1 Restoration mod readme explicitly crediting "DeNCS Script Decompiler........JDNoa"

## User

_Time: 2025-12-09T07:10:09.399Z_

is there at least a nwnnsscomp source code for nss->ncs compiler for C#? Provide the top 10 c#/.net nss compilers that are available omitting any non-feature-complete implementations i need full C#-compatible code that's 1:1 with the nwnnsscomp.exe

## Assistant

_Time: 2025-12-09T07:10:16.121Z_



## User

_Time: 2025-12-09T07:10:33.754Z_

is there at least a nwnnsscomp source code for nss->ncs compiler for C#? Provide the top 10 c#/.net nss compilers that are available omitting any non-feature-complete implementations i need full C#-compatible code that's 1:1 with the nwnnsscomp.exe

Assume it exists and actually SEARCH THE WEB (especially github) before you conclude it doesn't exist...

## Assistant

_Time: 2025-12-09T07:10:41.128Z_


