---
source_url: "https://grok.com/c/2b9de567-5630-4f07-bab3-645c9e4ec2db"
conversation_id: "2b9de567-5630-4f07-bab3-645c9e4ec2db"
title: "LucasForums Archive: KotOR2 Syntax Fix"
extracted_at: "2026-06-29T16:17:01.988Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# LucasForums Archive: KotOR2 Syntax Fix

Source: [Grok conversation](https://grok.com/c/2b9de567-5630-4f07-bab3-645c9e4ec2db)

## User

_Time: 2025-11-24T16:21:27.777Z_

http://www.lucasforums.com/showthread.php?s=&threadid=142901 Find the most complete and accurate archive url that still is up today for this.

## Assistant

_Time: 2025-11-24T16:24:13.929Z_

### Key Points
- The original LucasForums thread (ID 142901) discusses a syntax error in the `nwscript.nss` file for *Star Wars: Knights of the Old Republic II - The Sith Lords* (KotOR2), providing fixes and related modding advice.
- The most complete and accurate archive available today appears to be on LucasForums Archive, a site dedicated to preserving content from the now-defunct LucasForums by scraping the Wayback Machine.
- This archive seems reliable but, like any reconstruction, may have minor incompletenesses; no evidence suggests a more comprehensive version exists elsewhere.
- Direct URL: https://www.lucasforumsarchive.com/thread/142901-syntax-error-in-kotor2-nwscriptnss<grok:render card_id="ec65bc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>

### Thread Overview
The thread, titled "Syntax Error in KotOR2 nwscript.nss," was started in January 2005 and focuses on scripting issues for KotOR2 modders. It includes discussions on compiling scripts, errors in the game's nwscript.nss file, and workarounds. The archive captures 26 posts from various users, spanning January to March 2005, with contributions from modding community figures like tk102 and Darth333.

### Why This Archive?
Research suggests this is the best option because:
- LucasForums shut down around 2016, leading to loss of original content.
- The LucasForums Archive project explicitly reconstructed threads using Wayback Machine snapshots, aiming for fidelity.
- Other potential sources, like the Internet Archive's Wayback Machine, have incomplete or inaccessible snapshots for this specific thread, while forum mirrors or related discussions (e.g., on Obsidian forums) only reference the issue without full replication.
- No competing full archives were found on sites like archive.is or modding communities such as Deadly Stream, though partial discussions exist elsewhere.

If you're modding KotOR2, note that the PC version fixed this error in U.S. releases, but non-U.S. versions may still require the manual fix described.

---

The archived thread from LucasForums, originally posted at http://www.lucasforums.com/showthread.php?s=&threadid=142901, addresses a specific technical issue encountered by modders working with *Star Wars: Knights of the Old Republic II - The Sith Lords* (KotOR2). The discussion revolves around a syntax error in the nwscript.nss file, which is a core script file used for compiling custom scripts in the game. This file contains declarations for functions, constants, and other elements essential for modding. The thread provides practical solutions, including code modifications, and evolves into broader conversations about modding support, compiler tools, and differences between game versions.

The LucasForums site, once a hub for LucasArts game discussions including Star Wars titles, ceased operations around 2016, resulting in the loss of direct access to its content. To preserve this material, enthusiasts created the LucasForums Archive (lucasforumsarchive.com), which reconstructs threads by scraping historical snapshots from the Internet Archive's Wayback Machine. This process involves piecing together captured pages to recreate the original forum structure, including posts, user names, dates, and sometimes links. While not an official archive, it represents a community-driven effort to maintain accessibility for fans and modders. The specific archived URL for this thread is https://www.lucasforumsarchive.com/thread/142901-syntax-error-in-kotor2-nwscriptnss, and as of recent checks, it remains operational and publicly accessible.<grok:render card_id="feb95c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="ceb304" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render>

The thread begins with user tk102 identifying the syntax error near line 5710 in nwscript.nss, where a function declaration for `SetOrientOnClick` lacks a proper variable type: `object = OBJECT_SELF` should be changed to `object oCreature=OBJECT_SELF`. This fix allows modders to compile scripts that use new KotOR2-specific constants and functions. Subsequent posts build on this, with users like Dak Vesser testing the solution and confirming its effectiveness, while others share tips on compiler setup, such as placing nwscript.nss in the same directory as nwnnsscomp.exe (the NWScript compiler tool).

As the conversation progresses, contributors discuss best practices for separating KotOR1 and KotOR2 modding environments due to differing nwscript.nss files. For instance, tk102 advises using separate folders to avoid conflicts. The thread also touches on broader modding challenges, with users expressing frustration over limited official support from developers compared to games like *The Elder Scrolls III: Morrowind*. One post notes that Obsidian Entertainment (KotOR2's developer) showed more openness to modding discussions on their forums than BioWare did for the first game.

Later posts reveal that the PC version of KotOR2 addressed the error in U.S. releases, as confirmed by Darth333, who shares the corrected code snippet. However, tk102 points out that non-U.S. versions retained the issue, providing a fixed nwscript.nss file for download. Users encounter related compiling errors, often due to mistakenly compiling nwscript.nss itself or using incorrect batch files. Solutions include using specific command-line syntax like `nwnnsscomp -v1.00 myscript.nss` and avoiding wildcards that target nwscript.nss.

The thread concludes with Fred Tetra discussing enhancements to the compiler tool, allowing options like explicit paths for nwscript.nss or registry-based loading. Although the extracted content appears slightly truncated in the final post (ending mid-sentence at "3) specify the"), this likely stems from summarization limitations rather than missing content in the archive itself. The archive notes that reconstructions may not be perfect due to reliance on incomplete Wayback snapshots, but no evidence of additional posts beyond the 26 captured was found in cross-references.

For context, similar discussions appear in other forums. For example, an Obsidian Forums thread from March 2005 alerts developers to the persisting error in non-U.S. versions and links back to related modding resources, though it does not replicate the full LucasForums content.<grok:render card_id="4a1fde" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> An XboxScene forum post echoes the syntax fix in the context of Xbox modding, confirming the issue's relevance across platforms.<grok:render card_id="5c9348" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render> Modding sites like Deadly Stream and GitHub repositories (e.g., KobaltBlu's KotOR Scripting Tool) reference nwscript.nss errors but focus on tools rather than archiving the original thread.<grok:render card_id="b7907b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render><grok:render card_id="17519e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render>

To evaluate completeness, attempts to access direct Wayback Machine snapshots of the original URL yielded limited results, with calendar pages showing captures from 2005 onward but often lacking full content due to forum dynamics (e.g., session parameters in the URL). No superior archives were identified on alternative platforms like archive.is, and searches for exact quotes from later posts did not reveal extended versions. This suggests the LucasForums Archive is the most faithful representation available.

Below is a table summarizing the posts in the archived thread for quick reference:

| Post # | Author          | Date              | Key Content Summary |
|--------|-----------------|-------------------|---------------------|
| 1      | tk102          | 01-14-2005, 12:10 PM | Identifies syntax error in nwscript.nss line 5710 and provides fix. |
| 2      | Dak Vesser     | 01-14-2005, 2:06 PM  | Confirms setup for compiler and override folder. |
| 3      | Dak Vesser     | 01-14-2005, 2:14 PM  | Tests fix and reports success. |
| 4      | tk102          | 01-14-2005, 2:40 PM  | Advises separate folders for KotOR1 and KotOR2 compiling. |
| 5      | Darth333       | 01-14-2005, 3:14 PM  | Thanks for the info. |
| 6      | beancounter    | 01-14-2005, 5:07 PM  | Expresses concern over source scripts and excitement for PC release. |
| 7      | RedHawke       | 01-14-2005, 5:35 PM  | Agrees and praises the find. |
| 8      | tk102          | 01-14-2005, 6:21 PM  | Notes similar errors in KotOR1 and doubts PC fix. |
| 9      | beancounter    | 01-14-2005, 6:51 PM  | Laments lack of mod support compared to other games. |
| 10     | tk102          | 01-14-2005, 6:55 PM  | Motivational comment on modding. |
| 11     | StormSinger    | 01-30-2005, 4:06 AM  | Reports sudden compiling errors after initial success. |
| 12     | Pontifice      | 01-30-2005, 4:37 AM  | Suggests accidental compilation of nwscript.nss. |
| 13     | StormSinger    | 01-30-2005, 4:42 AM  | Agrees but puzzled by change. |
| 14     | Achilles       | 01-30-2005, 5:41 AM  | Shares interest in KotOR modding despite challenges. |
| 15     | tk102          | 01-30-2005, 3:04 PM  | Explains batch file issues and command-line tips. |
| 16     | Darth Stryke   | 01-30-2005, 3:25 PM  | Notes Obsidian's better mod support. |
| 17     | RedHawke       | 01-30-2005, 3:32 PM  | Jokes about Windows exposure. |
| 18     | tk102          | 01-31-2005, 8:48 AM  | Links to fixed batch file. |
| 19     | Dak Vesser     | 02-01-2005, 11:53 AM | Critiques Obsidian's bugs and suggests community help. |
| 20     | Darth333       | 02-10-2005, 2:25 PM  | Confirms fix in PC U.S. version with code snippet. |
| 21     | Dak Vesser     | 02-11-2005, 8:54 PM  | Suggests free fixed version for Xbox users. |
| 22     | tk102          | 03-03-2005, 9:36 AM  | Notes error persists in non-U.S. versions; provides fixed file. |
| 23     | Lorden Darkblade | 03-03-2005, 10:03 AM | Reports additional errors despite U.S. version. |
| 24     | Darth333       | 03-03-2005, 10:24 AM | Advises proper compiling commands to avoid errors. |
| 25     | Lorden Darkblade | 03-03-2005, 10:58 AM | Describes issues with commands and batch files. |
| 26     | Fred Tetra     | 03-03-2005, 6:08 PM  | Discusses compiler improvements with new options (partial in extract). |

This table captures the essence of the discussion, highlighting its technical focus and community collaboration. If the topic involves active modding, modern tools like those on GitHub may offer updated compilers that bypass these old issues.<grok:render card_id="ecc022" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render> For historical accuracy, the LucasForums Archive remains the go-to resource, though users should cross-verify with primary modding wikis like the Czerka Corp. R&D Wiki for nwscript.nss details.<grok:render card_id="877573" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render>

In summary, while the original site is gone, this archive provides a thorough, accessible recreation, supporting ongoing interest in KotOR2 modding two decades later.

### Key Citations
- [LucasForums Archive - Syntax Error in KotOR2 nwscript.nss](https://www.lucasforumsarchive.com/thread/142901-syntax-error-in-kotor2-nwscriptnss) 
- [LucasForums Archive - Syntax Error in KotOR2 nwscript.nss](https://www.lucasforumsarchive.com/thread/142901-syntax-error-in-kotor2-nwscriptnss) 
- [Obsidian Forums - To Devs: Syntax error in nwscript.nss](https://forums.obsidian.net/topic/31241-to-devs-syntax-error-in-nwscriptnss/) 
- [XboxScene Forums - Syntax Error In Kotor2 Nwscript.nss](https://forums.xboxscene.org/index.php?topic=117770.0) 
- [Deadly Stream - Problem With Compiling a Script](https://deadlystream.com/topic/9835-problem-with-compiling-a-script/) 
- [Czerka Corp. R&D Wiki - Nwscript.nss](https://czerka-rd.fandom.com/wiki/Nwscript.nss) 
- [GitHub - KobaltBlu/KotOR-Scripting-Tool](https://github.com/KobaltBlu/KotOR-Scripting-Tool) 
