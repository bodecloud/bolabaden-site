---
source_url: "https://grok.com/c/189dee1c-c5ad-44ad-b7d5-ec9de5143710"
conversation_id: "189dee1c-c5ad-44ad-b7d5-ec9de5143710"
title: "UV Hardlinking Issues on Windows"
extracted_at: "2026-06-29T16:12:39.832Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# UV Hardlinking Issues on Windows

Source: [Grok conversation](https://grok.com/c/189dee1c-c5ad-44ad-b7d5-ec9de5143710)

## User

_Time: 2026-01-13T10:04:51.147Z_

```log
2026-01-13 04:03:51.045 [error] : Failed to hardlink files; falling back to full copy. This may lead to degraded performance.
         If the cache and target directories are on different filesystems, hardlinking may not be supported.
         If this is intentional, set `export UV_LINK_MODE=copy` or use `--link-mode=copy` to suppress this warning.
```

Why does this never hardlink properly anyway? i'm on windows 11 and the harddrive it's having issues with is just some extra hdd in my pc?

## Assistant

_Time: 2026-01-13T10:06:41.299Z_

The UV tool's hardlinking feature often fails on Windows when attempting to link files from its cache to a virtual environment or project directory. This is commonly due to the directories residing on separate drives, as hard links are restricted to the same volume in NTFS.<grok:render card_id="18633f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render> While bugs in UV can occasionally trigger the warning even on the same drive, the primary cause in setups with an extra HDD is cross-drive limitations.<grok:render card_id="6992be" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="a8c354" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render> Research suggests this leads to fallback copying, which may slightly impact performance but ensures functionality.<grok:render card_id="ede6e9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render>

### Why Hardlinking Fails
Hard links on Windows NTFS file systems allow multiple file names to point to the same data without duplicating it, but they must be on the same volume (e.g., the same physical drive or partition).<grok:render card_id="f4af93" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render><grok:render card_id="d2e62a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render> If your UV cache (default: `%LOCALAPPDATA%\uv\cache`, typically on C:) and project/venv (on your extra HDD, say D: or E:) are on different drives, hardlinking isn't supported, triggering the error and a switch to copying.<grok:render card_id="7df931" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render><grok:render card_id="074ad2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render> This appears to be a persistent issue in your setup, as the log indicates filesystem boundaries are the root problem.

### Potential Solutions
- **Switch to copy mode**: Run commands with `--link-mode=copy` or set `UV_LINK_MODE=copy` as an environment variable to avoid hardlinking attempts and suppress the warning.<grok:render card_id="b972c9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render> This ensures reliability at the cost of minor performance overhead.
- **Relocate the cache**: Set `UV_CACHE_DIR` to a directory on the same drive as your project (e.g., on your extra HDD) via environment variable or config, allowing hardlinks if feasible.<grok:render card_id="9d1afa" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render><grok:render card_id="499cba" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render> Check current cache with `uv cache dir`.
- **Verify drive setup**: Use tools like Disk Management to confirm your drives are separate volumes; if possible, move projects to C: for testing.

If the issue persists on the same drive, it could stem from UV-specific bugs reported in versions like 0.5.3, where warnings appear unexpectedly.<grok:render card_id="15b34d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="767f0e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render> Updating UV or checking for open issues on GitHub may help.

---

Hardlinking in the UV tool, a Rust-based Python package manager from Astral, is designed to optimize installations by creating multiple references to the same cached package files without duplication, which saves space and improves speed.<grok:render card_id="c2c638" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render><grok:render card_id="d150c6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render> By default on Windows, UV uses `hardlink` mode when pulling wheels or built distributions from its global cache into a virtual environment's `site-packages` directory.<grok:render card_id="f330a0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render> This approach is efficient because hard links share the underlying inode or data blocks, but it comes with strict requirements rooted in the NTFS file system used by Windows 11.

The error message you encountered—"Failed to hardlink files; falling back to full copy. This may lead to degraded performance. If the cache and target directories are on different filesystems, hardlinking may not be supported. If this is intentional, set `export UV_LINK_MODE=copy` or use `--link-mode=copy` to suppress this warning."—directly points to a compatibility issue with filesystem boundaries.<grok:render card_id="d7d78e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="ca546a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render> On Windows, hard links are a feature of NTFS that allows a file to have multiple names in the directory structure, all pointing to the same physical data on disk.<grok:render card_id="d229c8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render> However, this mechanism is inherently limited: hard links cannot cross volume boundaries, meaning they must reside on the same partition, drive, or filesystem.<grok:render card_id="7f9d6c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render><grok:render card_id="5678f8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render><grok:render card_id="45594d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render> Different drives in your PC, such as your system SSD (typically C:) and an extra HDD (e.g., D: or E:), are treated as separate volumes, even if both are formatted as NTFS.<grok:render card_id="9fc8ef" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render> This restriction exists because each volume has its own independent file allocation table and metadata structures, preventing the file system from maintaining consistent references across them.<grok:render card_id="24abf8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render>

In your specific setup on Windows 11 with an extra HDD, the UV cache is likely stored by default in `%LOCALAPPDATA%\uv\cache` (e.g., `C:\Users\YourUsername\AppData\Local\uv\cache`), which is on your primary system drive.<grok:render card_id="89c402" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render><grok:render card_id="35b9c4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render> If your project or virtual environment is located on the extra HDD—for instance, because you're working with large datasets or prefer separating storage—the cache and target (venv) directories end up on different volumes.<grok:render card_id="57814d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render><grok:render card_id="8874b5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render> When UV attempts to hardlink during operations like `uv pip install`, `uv add`, or `uv venv`, it fails due to this cross-volume limitation, forcing a fallback to full file copying.<grok:render card_id="47328b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render> Copying, while functional, can degrade performance slightly because it duplicates data instead of referencing it, leading to increased disk I/O and storage usage.<grok:render card_id="4082dc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="4cb901" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render> This explains why hardlinking "never" works properly in your case: the multi-drive configuration inherently blocks it.

It's worth noting that even in scenarios where the cache and target are on the same drive, UV users have reported intermittent failures.<grok:render card_id="1398de" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="0d67a5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render> For example, in UV version 0.5.3 on Windows 11, warnings have appeared during package installations despite both directories being on C:.<grok:render card_id="2da1aa" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render> Similar issues have been noted in editable installs (`uv pip install -e .`), where the virtual environment and cache misalignment triggers the error.<grok:render card_id="a327e8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render> In non-Windows environments like Linux with NFS, failures have occurred when the UV binary itself is on a different filesystem, suggesting potential edge cases in how UV handles filesystem checks.<grok:render card_id="c276dd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render> Additionally, hardlinking can complicate other operations on Windows, such as deleting virtual environments, due to shared dependencies (e.g., `.pyd` files in packages like `markupsafe`), which may lock files across environments.<grok:render card_id="f258de" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render> These bugs are tracked in UV's GitHub repository, and while not always resolved, they highlight that hardlinking isn't foolproof even without cross-drive issues.<grok:render card_id="e3be84" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="8ab93f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>

UV provides flexibility through its link modes to mitigate these problems.<grok:render card_id="38ba1b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render><grok:render card_id="bdab2c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render> The `--link-mode` flag or `UV_LINK_MODE` environment variable allows overriding the default `hardlink` on Windows to alternatives like `copy` (full duplication, safest for cross-drive setups), `clone` (copy-on-write, default on macOS but available on Windows for efficiency), or `symlink` (symbolic links, fastest but fragile as cache cleanup can break them).<grok:render card_id="c6dd8f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render> Symlinking is generally discouraged because it ties the installation directly to cache files; removing the cache (via `uv cache clean`) would invalidate the links.<grok:render card_id="763928" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render><grok:render card_id="80f1c1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render> For your setup, switching to `copy` mode suppresses the warning and ensures consistent behavior, though it may use more space.<grok:render card_id="5c2e99" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> Alternatively, customizing the cache location with `UV_CACHE_DIR` to match your project's drive can enable hardlinking if the volumes align.<grok:render card_id="901498" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render><grok:render card_id="678408" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render> You can verify your current cache path with `uv cache dir` and adjust accordingly.

For broader context, hard links differ from other linking types on Windows: symbolic links (symlinks) can span drives but require elevated privileges in some cases, while junctions (for directories) also support cross-volume use but aren't applicable to UV's file-level operations.<grok:render card_id="9a294f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render><grok:render card_id="6d79d1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render> In contrast, Unix-like systems (e.g., Linux) allow hard links only within the same filesystem for similar reasons, emphasizing data integrity.<grok:render card_id="ee6012" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render> Tools like UV prioritize hardlinking for performance in controlled environments, but real-world multi-drive PCs often expose these limitations.<grok:render card_id="e4b53d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render> If performance degradation from copying is noticeable (e.g., in large projects), consider SSD upgrades or consolidating storage to a single volume.

To illustrate UV's link modes and their suitability:

| Link Mode | Description | Default on Windows | Pros | Cons | Best For |
|-----------|-------------|--------------------|------|------|----------|
| **hardlink** | Creates additional directory entries pointing to the same data. | Yes | Fast, space-efficient; no data duplication. | Fails across drives; can complicate deletions due to file locks.<grok:render card_id="e570bf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render> | Same-drive setups with managed environments. |
| **copy** | Fully duplicates files from cache to target. | No | Reliable across drives; independent of cache. | Slower, uses more space; potential performance hit on large installs.<grok:render card_id="8e124b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render> | Cross-drive or unstable cache scenarios. |
| **clone** | Uses copy-on-write to reference data until modified. | No (default on macOS) | Efficient like hardlink but more flexible. | Limited support on Windows; may fallback if unsupported. | Balanced performance without strict filesystem ties. |
| **symlink** | Creates pointers to cache files. | No | Fastest creation; minimal overhead. | Breaks if cache is cleaned; tight coupling.<grok:render card_id="f61844" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render> | Controlled, non-production environments. |

This table summarizes options based on UV documentation, highlighting why `hardlink` often fails in diverse hardware configurations like yours.<grok:render card_id="e7a508" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render><grok:render card_id="4d830c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render> For further troubleshooting, check UV's version with `uv --version` and consider updating, as newer releases may address edge cases.<grok:render card_id="dcc0ee" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> If the problem aligns with open issues, contributing details to UV's GitHub could help the community.<grok:render card_id="767199" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render>

**Key Citations:**
- [Warning `Failed to hardlink files`, cache on same drive · Issue #9500 · astral-sh/uv](https://github.com/astral-sh/uv/issues/9500)
- [Windows7 hardlink over two different drives - Super User](https://superuser.com/questions/243410/windows7-hardlink-over-two-different-drives)
- [Hard Links and Junctions - Win32 apps - Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/fileio/hard-links-and-junctions)
- [NTFS Hard Links, Junctions & Symbolic Links Explained (2025) - 2BrightSparks](https://www.2brightsparks.com/resources/articles/ntfs-hard-links-junctions-and-symbolic-links.html?srsltid=AfmBOooSNvcmpsMxN7Yy3UV3vOY_LkeOGCha9XBm8I_qIIWKaHSADagy)
- [Why are hard links only valid within the same filesystem? - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/290525/why-are-hard-links-only-valid-within-the-same-filesystem)
- [Settings | uv - Astral Docs](https://docs.astral.sh/uv/reference/settings)
- [`uv pip install -e .` generates "warning: Failed to hardlink files; falling back to full copy." · Issue #10051 · astral-sh/uv](https://github.com/astral-sh/uv/issues/10051)
- [Failed to hardlink files: Issue with ruff cache · Issue #7285 · astral-sh/uv](https://github.com/astral-sh/uv/issues/7285)
- [Why I DON'T Use Conda or uv for Now | by Zhixiang Zhu - Medium](https://medium.com/@zzxiang/why-i-dont-use-conda-or-uv-to-manage-multiple-python-versions-for-now-35b320d6a026)
- [Caching | uv - Astral Docs](https://docs.astral.sh/uv/concepts/cache)
- [Commands | uv](https://docs.astral.sh/uv/reference/cli)
- [hardlinking dependencies causes issues when trying to delete a `.venv` via python on Windows · Issue #7918 · astral-sh/uv](https://github.com/astral-sh/uv/issues/7918)
- [Soft links, hard links, junctions, oh my! Symlinks on Windows, a how-to. - InterWorks](https://interworks.com/blog/jpoehls/2012/06/07/soft-links-hard-links-junctions-oh-my-symlinks-windows-how)

## User

_Time: 2026-01-13T10:51:13.301Z_

buddy the question was highly specifically **why is hardlink failing on windows 11 NTFS**.

## Assistant

_Time: 2026-01-13T10:52:21.315Z_

- NTFS hard links on Windows 11 fail across different drives or partitions because they must reference the same file within a single volume.
- This limitation stems from NTFS design: hard links are multiple directory entries pointing to one Master File Table (MFT) record, and each volume has its own independent MFT.
- Even if both drives use NTFS, separate drive letters (e.g., C: and D:) treat them as distinct volumes, preventing cross-volume hard links.
- The CreateHardLink API enforces this, failing with errors like ERROR_NOT_SAME_DEVICE when volumes differ—no changes in Windows 11 alter this behavior.

### Core NTFS Limitation
Hard links in NTFS allow multiple file names to point directly to the same underlying data on disk without duplication. This works by creating additional directory entries that reference the exact same file record in the volume's Master File Table (MFT). The MFT is the core metadata structure for each NTFS volume, acting like an index of all files and their attributes. Since every NTFS-formatted drive or partition maintains its own separate MFT, a hard link cannot reference a file record across volumes—the system has no way to unify references between independent MFTs.

### Why the Design Restricts Cross-Volume Links
Allowing hard links across volumes would introduce significant complexity and risks:
- Reference counting (tracking how many links exist to prevent premature deletion) would require coordination between separate volumes.
- Issues with removable or offline drives could lead to data corruption or inconsistent states during operations like filesystem checks.
- Maintaining data integrity becomes challenging if one volume is modified independently.

This restriction mirrors similar limits in other filesystems (e.g., Unix inodes are per-filesystem). Microsoft explicitly documents that all hard links must reside on the same volume, and the CreateHardLink function fails otherwise.

### Relevance to Your UV Issue
In the UV tool's case, the default cache is typically on your system drive (C:), while your project or virtual environment may be on the extra HDD (e.g., D:). When UV attempts to hardlink packages from cache to the target, CreateHardLink detects different volumes and fails, triggering the fallback to full copy as a safe alternative.

### Alternatives for Cross-Volume Scenarios
- Use junctions (for directories) or symbolic links, which can span local volumes.
- Relocate the UV cache to the same drive as your projects.
- Switch UV to copy mode permanently.

| Link Type       | Targets          | Can Span Volumes? | Key Characteristics                          | Use Case Example                  |
|-----------------|------------------|-------------------|----------------------------------------------|-----------------------------------|
| Hard Link      | Files only      | No               | Direct MFT reference; space-efficient; transparent changes | Same-volume package caching (e.g., UV default) |
| Junction       | Directories only| Yes (local)      | Reparse point; breaks if target moved        | Redirecting legacy folders        |
| Symbolic Link  | Files or directories | Yes (local/remote) | Flexible paths; requires privileges; can break if target invalid | Cross-drive or network references |

---

NTFS, the default filesystem in Windows 11, supports hard links as a way to create multiple paths to the same file data without consuming extra space. A hard link is essentially an additional directory entry that points to the existing file record in the Master File Table (MFT)—the central database NTFS uses to track files, attributes, and locations on a volume. This mechanism ensures that changes made through any hard link (e.g., editing the file) are immediately visible via all others, and the file is only truly deleted when the last hard link is removed.

The critical restriction is that hard links are confined to a single volume. Microsoft documentation states unequivocally: "A hard link is the file-system representation of a file by which more than one path references a single file in the same volume." Examples clarify that links like C:\path\file.txt to D:\other\file.txt are invalid because C: and D: are separate volumes, even if both are NTFS-formatted. The CreateHardLink API, which tools like UV rely on internally, enforces this by requiring both the existing file and new link to be on the same volume. If not, it returns failure (often manifesting as ERROR_NOT_SAME_DEVICE), prompting fallbacks like copying.

This volume boundary exists because the MFT is independent for each NTFS volume (partition or drive). Hard links operate at the lowest level by sharing the same MFT record—crossing volumes would require a shared or coordinated MFT system, which NTFS does not provide. Implementing such coordination could compromise reliability, especially with dynamic volume states (e.g., external drives disconnecting) or during maintenance operations. Similar constraints appear in other filesystems: Unix-like systems limit hard links to the same filesystem due to per-filesystem inode uniqueness, preventing the same integrity issues.

In practice, this means your extra HDD, despite being NTFS, counts as a separate volume from your system drive. UV's hardlinking attempts fail predictably in multi-drive setups, leading to the logged warning and copy fallback. This behavior is unchanged from earlier Windows versions—Windows 11 inherits the same NTFS implementation without relaxing these rules.

For comparison, NTFS offers more flexible options:
- **Junctions** (reparse points for directories) allow linking across local volumes but not to files or remote shares.
- **Symbolic links** (introduced fully in Vista) support files or directories, local or remote paths, and relative targeting, though they can become invalid if the target moves.

Tools like UV default to hard links for efficiency on same-volume setups but detect failures and adapt. If cross-volume work is common, configuring UV for copy mode or moving the cache eliminates the issue without meaningful performance loss in most cases.

**Key Citations:**
- [Hard Links and Junctions - Win32 apps | Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/fileio/hard-links-and-junctions)
- [CreateHardLinkA function (winbase.h) - Win32 apps | Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-createhardlinka)
- [NTFS Hard Links, Junctions & Symbolic Links Explained (2025) - 2BrightSparks](https://www.2brightsparks.com/resources/articles/ntfs-hard-links-junctions-and-symbolic-links.html)
- [Why are hard links only valid within the same filesystem? - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/290525/why-are-hard-links-only-valid-within-the-same-filesystem)
- [Hard Links, Soft (Symbolic) Links and Junctions in NTFS - Helge Klein](https://helgeklein.com/blog/hard-links-soft-symbolic-links-and-junctions-in-ntfs-what-are-they-for)
