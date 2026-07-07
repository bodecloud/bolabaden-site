---
source_url: "https://grok.com/c/f7ed4e2a-e854-4f5d-965e-315ed0fa32bd"
conversation_id: "f7ed4e2a-e854-4f5d-965e-315ed0fa32bd"
title: "KDE Dolphin Extract Multiple Archives to Subfolders"
extracted_at: "2026-06-29T16:32:06.597Z"
message_count: 8
export_suite: "identity"
provenance: grok-rest-api
---

# KDE Dolphin Extract Multiple Archives to Subfolders

Source: [Grok conversation](https://grok.com/c/f7ed4e2a-e854-4f5d-965e-315ed0fa32bd)

## User

_Time: 2026-05-19T13:25:10.605Z_

extract multiple archives at once fedora kde gui only. Looking for something similar to 7zip's extract * to */* on the context menu.

## Assistant

_Time: 2026-05-19T13:26:58.847Z_

**On Fedora KDE Plasma (using Dolphin as your file manager), the closest GUI-only equivalent to 7-Zip’s “Extract * to */*” (which extracts multiple selected archives, each to its own named subfolder) is available through Dolphin’s built-in Ark integration plus a couple of easy enhancements.** These options work directly from the right-click context menu on multiple selected archive files (ZIP, 7z, RAR, TAR, etc.), require no command line, and create subfolders intelligently to avoid dumping files everywhere.

Here are the best options, ranked by simplicity and closeness to 7-Zip behavior. All are fully GUI-driven and integrate natively with Dolphin.

### 1. Best Native Option: Ark + “Extract Here” (Built-in, Minimal Setup)
Ark (KDE’s default archive tool) already supports batch extraction of multiple archives via the context menu, with automatic subfolder creation (similar to 7-Zip’s smart extraction).

**Steps:**
- Ark is pre-installed on Fedora KDE. If missing, run `sudo dnf install ark` (it pulls in the necessary plugins for most formats).
- In Dolphin:
  1. Select multiple archive files (Ctrl+click or Shift+click).
  2. Right-click → **Extract** (or directly **Extract Here** in the top-level menu in Plasma 6+).
  3. Choose **Extract Here** — this now defaults to “autodetect subfolder” behavior (the option formerly called “Extract here, autodetect subfolder”).

**How it behaves (nuances and edge cases):**
- For each archive, Ark creates a subfolder named after the archive (minus extension) *only if* the archive contains multiple top-level items. Single-folder archives extract directly into the current folder.
- It handles mixed formats (ZIP + 7z + RAR) in one go.
- In Plasma 6 (current on recent Fedora), the old separate “autodetect” option was merged into “Extract Here” for simplicity. If you want a plain “Extract Here” that *never* creates subfolders, you can add a custom service menu (see below).
- Works on local files only (not network shares in some cases).

This is the cleanest GUI solution if your archives are standard formats. It’s fast, uses Ark’s batch mode internally (`ark -ba %U`), and requires zero extra configuration in most cases.<grok:render card_id="38028e" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">45</argument></grok:render>

### 2. Closest to 7-Zip: Install the “7z Dolphin Service Menu” from KDE Store (Recommended for Exact Match)
This community service menu (available directly in Dolphin) adds a full 7-Zip-style submenu with options like “Extract to subfolders,” “Extract here,” and compress actions. It explicitly supports **multiple selected archives** and extracts each to its own named subfolder — exactly what you described.

**Steps (100% GUI):**
1. Open Dolphin.
2. Hamburger menu (top-right) → **Configure Dolphin** → **Context Menu** tab.
3. At the bottom, click **Download New Services**.
4. Search for “**7zip**” or “**7z**”.
5. Install the one titled **7z Archive Compress Decompress Menu** (or similar; direct link is https://store.kde.org/p/1290368 — it appears in the list).<grok:render card_id="9d83e6" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">59</argument></grok:render>
6. Restart Dolphin (or log out/in).

**After installation:**
- Right-click multiple archives → you’ll see a **7z** or **Extract** submenu with options like “Extract to */*” / “Extract all to subfolders.”
- It uses the p7zip backend under the hood for excellent format support (including full RAR/7z handling).

**Why this matches 7-Zip perfectly:**
- Designed specifically for bulk operations and subfolder-per-archive extraction.
- Handles passwords, testing, and compression too.
- Works alongside Ark (no conflict).

This was the exact solution recommended in KDE/Reddit discussions for users wanting the old “Extract all to subfolders” behavior.<grok:render card_id="13fbff" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">46</argument></grok:render>

### 3. p7zip Service Menus (Alternative 7-Zip Integration)
If the store version isn’t available or you want the official p7zip GUI too:

**Installation (GUI + one quick terminal step):**
```bash
sudo dnf install p7zip p7zip-plugins p7zip-gui ark
```
- The `p7zip-gui` package includes the `.desktop` service menu files.

**Activate the menus:**
- The files land in `/usr/share/kde4/services/ServiceMenus/`.
- Copy or symlink them to the modern location (one-time terminal command):
  ```bash
  mkdir -p ~/.local/share/kio/servicemenus/
  cp /usr/share/kde4/services/ServiceMenus/p7zip_*.desktop ~/.local/share/kio/servicemenus/
  ```
- Or use Dolphin’s **Download New Services** (search “7zip”) as in option 2 above — it often pulls the same thing.

You’ll then get **p7zip_extract**, **p7zip_extract_to**, etc., in the context menu. Select multiple archives → right-click → p7zip options → it extracts each to its own subfolder (very close to “Extract * to */*”).<grok:render card_id="9f131e" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">55</argument></grok:render>

**Nuances:** p7zip adds better command-line-style options in GUI form and full 7z/RAR support. The `7zG` GUI app (launched from menu) also lets you batch-extract with advanced filters.

### 4. PeaZip (Standalone GUI with Excellent Batch Tools + Context Menu)
If you want a more powerful dedicated archiver (like 7-Zip on steroids) with its own batch extraction screen:

- Install via Flatpak (easiest, sandboxed):
  ```bash
  flatpak install flathub io.github.peazip.PeaZip
  ```
- PeaZip has built-in KDE service menu support (`.desktop` files for “Extract here (smart)”, “Extract here to new folder”, etc.).
- For context menu integration: Check PeaZip’s settings or copy its FreeDesktop integration files (detailed in its docs). It supports drag-and-drop batch extraction and a full GUI for passwords, filters, and output paths.<grok:render card_id="f58df5" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">80</argument></grok:render>

**When to use this:** If you frequently deal with obscure formats, passwords, or want a preview/extract-all-in-one window. It works great alongside Dolphin but is a separate app.

### Quick Tips & Edge Cases
- **Formats supported:** Ark + p7zip covers virtually everything (ZIP, 7z, RAR, TAR.*, ISO, etc.). Install `unrar` or `rar` via DNF if you hit rare RAR issues.
- **Subfolder behavior:** Most options now default to “smart” subfolders to prevent file clutter — exactly like modern 7-Zip.
- **Performance with many/large archives:** Ark/PeaZip handle dozens at once fine; for hundreds, the batch mode is efficient.
- **Customize further:** In **Configure Dolphin → Context Menu**, you can enable/disable any service or download more from the store (e.g., “dolphin-extract-here” for a top-level single-click option).
- **Plasma 6 changes:** The menu simplified in recent versions — the service menus above restore the old granular options if needed.<grok:render card_id="d3a068" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">20</argument></grok:render>
- **Test it:** Drop a few test ZIPs/RARs in a folder, select them all, and try the menu — it’s instant.

The **7z service menu from the KDE Store (option 2)** or **p7zip + Ark (option 3)** will feel most like Windows 7-Zip’s context menu. Start there — it’s all point-and-click after the 2-minute setup. If you run into any Fedora-specific packaging quirk (rare), the Dolphin “Download New Services” button usually resolves it automatically.

Let me know your exact Fedora version or if you need screenshots/steps for a specific option!

## User

_Time: 2026-05-19T13:29:08.103Z_

runner56@BodenPC:~/Downloads/daws$ 7z

7-Zip 25.01 (x64) : Copyright (c) 1999-2025 Igor Pavlov : 2025-08-03
 64-bit locale=en_US.UTF-8 Threads:12 OPEN_MAX:1024

Usage: 7z <command> [<switches>...] <archive_name> [<file_names>...] [@listfile]

<Commands>
  a : Add files to archive
  b : Benchmark
  d : Delete files from archive
  e : Extract files from archive (without using directory names)
  h : Calculate hash values for files
  i : Show information about supported formats
  l : List contents of archive
  rn : Rename files in archive
  t : Test integrity of archive
  u : Update files to archive
  x : eXtract files with full paths

<Switches>
  -- : Stop switches and @listfile parsing
  -ai[r[-|0]][m[-|2]][w[-]]{@listfile|!wildcard} : Include archives
  -ax[r[-|0]][m[-|2]][w[-]]{@listfile|!wildcard} : eXclude archives
  -ao{a|s|t|u} : set Overwrite mode
  -an : disable archive_name field
  -bb[0-3] : set output log level
  -bd : disable progress indicator
  -bs{o|e|p}{0|1|2} : set output stream for output/error/progress line
  -bt : show execution time statistics
  -i[r[-|0]][m[-|2]][w[-]]{@listfile|!wildcard} : Include filenames
  -m{Parameters} : set compression Method
    -mmt[N] : set number of CPU threads
    -mx[N] : set compression level: -mx1 (fastest) ... -mx9 (ultra)
  -o{Directory} : set Output directory
  -p{Password} : set Password
  -r[-|0] : Recurse subdirectories for name search
  -sa{a|e|s} : set Archive name mode
  -scc{UTF-8|WIN|DOS} : set charset for console input/output
  -scs{UTF-8|UTF-16LE|UTF-16BE|WIN|DOS|{id}} : set charset for list files
  -scrc[CRC32|CRC64|SHA256|SHA1|XXH64|*] : set hash function for x, e, h commands
  -sdel : delete files after compression
  -seml[.] : send archive by email
  -sfx[{name}] : Create SFX archive
  -si[{name}] : read data from stdin
  -slp : set Large Pages mode
  -slt : show technical information for l (List) command
  -snh : store hard links as links
  -snl : store symbolic links as links
  -sni : store NT security information
  -sns[-] : store NTFS alternate streams
  -so : write data to stdout
  -spd : disable wildcard matching for file names
  -spe : eliminate duplication of root folder for extract command
  -spf[2] : use fully qualified file paths
  -ssc[-] : set sensitive case mode
  -sse : stop archive creating, if it can't open some input file
  -ssp : do not change Last Access Time of source files while archiving
  -ssw : compress shared files
  -stl : set archive timestamp from the most recently modified file
  -stm{HexMask} : set CPU thread affinity mask (hexadecimal number)
  -stx{Type} : exclude archive type
  -t{Type} : Set type of archive
  -u[-][p#][q#][r#][x#][y#][z#][!newArchiveName] : Update options
  -v{Size}[b|k|m|g] : Create volumes
  -w[{path}] : assign Work directory. Empty path means a temporary directory
  -x[r[-|0]][m[-|2]][w[-]]{@listfile|!wildcard} : eXclude filenames
  -y : assume Yes on all queries
brunner56@BodenPC:~/Downloads/daws$ 7z -u *.zip
 
how to extract any and all archives ending with .zip in the folder, extracting them to subfolders named after the archive from the terminal this time?

## Assistant

_Time: 2026-05-19T13:29:15.819Z_

**Best one-liner command (recommended):**

```bash
for zip in *.zip; do 7z x "$zip" -o"${zip%.zip}/" -aoa; done
```

### What this does:
- Loops through **every** `.zip` file in the current folder.
- Extracts **each archive to its own subfolder** named exactly after the zip file (without the `.zip` extension).
- Uses `7z x` → extracts with full paths (preserves directory structure inside the zip).
- `-o"${zip%.zip}/"` → output directory = archive name (the `/` at the end is optional but clean).
- `-aoa` → automatically overwrite existing files (avoids prompts; safe default for this use case).

### Alternative versions (choose based on your needs):

**1. Safer version (asks before overwriting):**
```bash
for zip in *.zip; do 7z x "$zip" -o"${zip%.zip}/"; done
```

**2. With progress and more verbose output:**
```bash
for zip in *.zip; do 
    echo "=== Extracting $zip ==="
    7z x "$zip" -o"${zip%.zip}/" -aoa
done
```

**3. One-liner with `parallel` (much faster on multi-core if you have many/large zips):**
First install if needed: `sudo dnf install parallel`
```bash
parallel '7z x {} -o{.}/ -aoa' ::: *.zip
```

**4. If you also want to handle `.ZIP` (uppercase) and hidden zips:**
```bash
for zip in *.zip *.ZIP; do 
    [[ -f "$zip" ]] || continue
    7z x "$zip" -o"${zip%.*}/" -aoa
done
```

### Edge cases & tips:
- **Empty folder / no zips** → the loop just does nothing (no error).
- **Zip contains a single top-level folder** → it will still extract inside your new subfolder (clean result).
- **Zip has no internal folders** → files go directly into the new subfolder.
- **Passwords** → add `-pYourPassword` to the `7z x` part if needed (or it will prompt).
- **Very large archives** → 7-Zip handles them well with your 12 threads.
- **Other archive types** (7z, rar, tar.gz, etc.) → change `*.zip` to `*.*z*` or specific patterns, but the command stays the same.

### Test it first
```bash
ls *.zip          # check what will be processed
# then run the command
```

This is the standard, reliable way Linux users do bulk “Extract each to its own folder” from the terminal. It behaves **exactly** like 7-Zip’s GUI “Extract to */*” on Windows.

Run it from inside `~/Downloads/daws/` and you’re good. Let me know if you want it for all archive types at once or with deletion after extraction (`-sdel`).

## User

_Time: 2026-05-19T13:35:02.821Z_

brunner56@BodenPC:~/Downloads/daws$ 7z x "SEQUND_Lite_AAX_1015_WIN.zip" -o"${zip%.*}/" -aoa

7-Zip 25.01 (x64) : Copyright (c) 1999-2025 Igor Pavlov : 2025-08-03
 64-bit locale=en_US.UTF-8 Threads:12 OPEN_MAX:1024

Scanning the drive for archives:
1 file, 4657452 bytes (4549 KiB)

Extracting archive: SEQUND_Lite_AAX_1015_WIN.zip
--
Path = SEQUND_Lite_AAX_1015_WIN.zip
Type = zip
Physical Size = 4657452

ERROR: Cannot open output file : errno=13 : Permission denied : /SEQUND Lite AAX_1015.exe
     
Sub items Errors: 1

Archives with Errors: 1

Sub items Errors: 1
please fix.

## Assistant

_Time: 2026-05-19T13:35:11.061Z_

**The problem is here:**

You copied part of the loop command but ran it **outside** the `for` loop.  
When you wrote `-o"${zip%.*}/"`, the variable `$zip` was **empty**, so 7z interpreted it as `-o/`. That means **extract to the root directory (`/`)** — which your normal user doesn't have permission to write to.

That's why you got:  
`ERROR: Cannot open output file : errno=13 : Permission denied : /SEQUND Lite AAX_1015.exe`

### ✅ Correct fix — run this instead:

```bash
7z x "SEQUND_Lite_AAX_1015_WIN.zip" -o"SEQUND_Lite_AAX_1015_WIN/" -aoa
```

### Even better (recommended for one file):

```bash
zipfile="SEQUND_Lite_AAX_1015_WIN.zip"
7z x "$zipfile" -o"${zipfile%.*}/" -aoa
```

This properly sets the output folder to `SEQUND_Lite_AAX_1015_WIN/` (without the `.zip`).

### Full loop for **all** `.zip` files in the folder (the one you actually want):

```bash
for zip in *.zip; do
    [[ -f "$zip" ]] || continue
    echo "=== Extracting $zip ==="
    7z x "$zip" -o"${zip%.*}/" -aoa
done
```

### Additional useful options you can add:

| Need | Add to the command |
|------|--------------------|
| Skip if folder already exists | `-aos` (skip existing files) |
| Overwrite without asking (default in your case) | `-aoa` (already using) |
| Extract without full paths (flat) | Use `e` instead of `x` |
| Create subfolder even if archive has one root folder | Add `-spe` (eliminate duplication) |

**Example with both overwrite + no root duplication:**

```bash
for zip in *.zip; do
    7z x "$zip" -o"${zip%.*}/" -aoa -spe
done
```

### Quick test before running on everything:
```bash
ls *.zip                    # see what will be processed
mkdir -p test_extract       # optional safety folder
cd test_extract
# then run one of the commands above
```

The file inside has a space (`SEQUND Lite AAX_1015.exe`) — that's fine, 7z handles it correctly when the output path is set properly.

Run the corrected single-file command or the full loop and it should work perfectly now. Let me know if you hit any other errors!

## User

_Time: 2026-05-19T13:36:23.468Z_

write the full loop again this time put it on ONE LINE not multiple

## Assistant

_Time: 2026-05-19T13:36:27.173Z_

**Here is the full loop on a single line:**

```bash
for zip in *.zip; do [[ -f "$zip" ]] || continue; echo "=== Extracting $zip ==="; 7z x "$zip" -o"${zip%.*}/" -aoa; done
```

### How to use it:
Just paste and press Enter in your terminal while inside `~/Downloads/daws/`.

### Slightly more compact version (no progress echo):

```bash
for zip in *.zip; do [[ -f "$zip" ]] || continue; 7z x "$zip" -o"${zip%.*}/" -aoa; done
```

### With extra safety (recommended):

```bash
for zip in *.zip; do [[ -f "$zip" ]] || continue; echo "Extracting $zip..."; 7z x "$zip" -o"${zip%.*}/" -aoa -spe; done
```

(`-spe` prevents creating an extra nested folder when the zip already contains a root folder.)

Copy whichever version you prefer and run it directly. It will process every `.zip` file, each extracting into its own properly named subfolder.
