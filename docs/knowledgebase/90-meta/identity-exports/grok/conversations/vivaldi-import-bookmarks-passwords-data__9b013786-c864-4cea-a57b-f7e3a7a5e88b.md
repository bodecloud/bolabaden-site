---
source_url: "https://grok.com/c/9b013786-c864-4cea-a57b-f7e3a7a5e88b"
conversation_id: "9b013786-c864-4cea-a57b-f7e3a7a5e88b"
title: "Vivaldi Import Bookmarks Passwords Data"
extracted_at: "2026-06-29T16:37:30.730Z"
message_count: 8
export_suite: "identity"
provenance: grok-rest-api
---

# Vivaldi Import Bookmarks Passwords Data

Source: [Grok conversation](https://grok.com/c/9b013786-c864-4cea-a57b-f7e3a7a5e88b)

## User

_Time: 2026-05-20T02:39:18.189Z_

How do I import bookmarks/passwords/saved data etc into Vivaldi?

## Assistant

_Time: 2026-05-20T02:39:29.509Z_

**Importing data into Vivaldi is straightforward**, whether you're switching from another browser like Chrome, Firefox, Edge, or Opera, or bringing in files like HTML bookmarks or CSV passwords. Vivaldi (being Chromium-based) supports importing most common data types directly from other browsers installed on the same computer.<grok:render card_id="1a5ba5" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">5</argument></grok:render>

### Primary Method: Import from Applications or Files
This is the main way to bring in **bookmarks**, **passwords**, **history**, **open tabs**, **cookies**, and more in one go.

1. Open Vivaldi.
2. Go to the **Vivaldi menu** (the V icon in the top-left) → **File** → **Import from Applications or Files**.
3. In the dropdown, select the source browser (e.g., Google Chrome, Mozilla Firefox, Microsoft Edge, Opera, or another profile if you have multiples) **or** an option like *Bookmarks HTML file*.
4. Check the boxes for the data types you want (bookmarks, passwords, history, etc.—availability depends on the source).
5. Click **Start Import**.<grok:render card_id="562fd3" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

**Tips for success**:
- Close the source browser before importing (especially important for passwords and some Chromium-based browsers).
- You can repeat this process multiple times if needed (e.g., import bookmarks first, then handle passwords separately).
- For Chromium-based browsers (Chrome, Edge, Opera, Brave, etc.), you can also import **extensions** and **open tabs** (tabs work best from these).<grok:render card_id="e33696" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">20</argument></grok:render>

### Importing Specific Data Types

**Bookmarks**:
- Use the method above, or export bookmarks as an HTML file from your old browser and select *Bookmarks HTML file* in the import dialog.<grok:render card_id="9c9415" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>
- Vivaldi integrates bookmarks deeply with Speed Dial, so they should appear in the Bookmarks panel and Speed Dials after import.

**Passwords**:
- Use the main import dialog (close the source browser first). Note that direct password import isn't supported from *all* browsers.<grok:render card_id="ae2123" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">41</argument></grok:render>
- For CSV files (common export format):
  1. Type `vivaldi://password-manager/settings` in the address bar and press Enter.
  2. In the **Import passwords** section, click **Select file**.
  3. Choose your `.csv` file and open it.<grok:render card_id="b24f6c" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">41</argument></grok:render>
- **Security note**: Exported CSV files contain plaintext passwords—handle and delete them securely.

**Browsing History**:
- Included in the main import dialog from most browsers.<grok:render card_id="cf7dca" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

**Open Tabs**:
- Available via the main import (primarily from Chromium-based browsers). This helps migrate active sessions.<grok:render card_id="75194c" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

**Other Data**:
- **Notes**: Import a folder of text/markdown files via the main dialog (select *Notes Folder*) or Quick Commands (`F2` → type "Import notes").
- **Reading List**: Import from CSV via the main dialog.
- **Extensions**: Import from Chromium browsers, then enable them individually on the extensions page after import.<grok:render card_id="6766d6" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>
- **Feeds** (for the Feed Reader): See Vivaldi's separate guide for OPML or other formats.<grok:render card_id="6b878f" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

### Advanced/Alternative Methods
- **Vivaldi Sync** (recommended for multiple Vivaldi installations): Create a free Vivaldi account and enable Sync for bookmarks, passwords, notes, etc., across devices. This is often easier than manual imports between Vivaldi instances.
- **Full Profile Transfer**: For maximum data (including preferences, sessions, etc.), copy the profile folder (find it via **Vivaldi menu → Help → About** → Open Profile Folder). This is advanced—back up first, and note limitations with passwords/cookies across machines.<grok:render card_id="4ed0ca" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>
- **Manual File Replacement**: Copy specific files (e.g., Bookmarks, History) from another Chromium profile folder into Vivaldi's while Vivaldi is closed.

### Platform Notes
- These steps are primarily for **desktop** (Windows, macOS, Linux). Mobile (Android/iOS) has more limited options, often involving exported files (e.g., Safari import on iOS).<grok:render card_id="6c763e" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">2</argument></grok:render>
- On first run, Vivaldi may offer to import during setup— you can do it later via the menu.

### Potential Issues and Troubleshooting
- **Source browser not listed?** Ensure it's installed and closed. For older/outdated options, export to HTML/CSV manually.
- **Passwords not importing?** Try the CSV method or check if the source browser needs to be fully closed. Some browsers have restrictions.
- **Duplicates?** Vivaldi may create folders or you can merge/clean up in the Bookmarks manager (**Ctrl+Shift+B** or via panel).
- **Large imports**: May take time; avoid interrupting.
- **Permissions**: On macOS/Windows, you might need to enter your OS password for password imports/exports.<grok:render card_id="b74340" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">41</argument></grok:render>

### Exporting from Vivaldi (for reference)
- Bookmarks: **File → Export Bookmarks** (HTML).
- Passwords: **File → Export → Export Passwords** or via Settings (CSV).

Vivaldi's import tools are quite robust compared to some browsers, especially for power users. For the latest details or edge cases (e.g., specific browser versions), check the official help: [Import and export browser data](https://help.vivaldi.com/desktop/tools/import-and-export-browser-data/).<grok:render card_id="e8525d" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

If you run into a specific issue (e.g., from which browser, or error messages), provide more details for tailored advice!

## User

_Time: 2026-05-20T02:43:02.585Z_

Seems I need to put a profile path for the browser i'm importing, which is opera 12? where's that path at???

## Assistant

_Time: 2026-05-20T02:43:12.425Z_

**For Opera 12 (the old Presto-based version), Vivaldi has dedicated support** for importing data like bookmarks, mail (M2), contacts, and more. When it prompts for a profile path, you need to point it to Opera 12's main profile folder (not a subfolder like "Default" used in modern Chromium Opera).<grok:render card_id="af8789" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">3</argument></grok:render>

### Default Profile Locations for Opera 12
The exact path depends on your operating system and whether you used a standard or portable installation. Opera 12 stores data in files like `opera6.ini`, `bookmarks.adr`, `wand.dat` (passwords), etc.

**Windows (most common):**
- **Standard installation**:  
  `C:\Users\YourUsername\AppData\Roaming\Opera\Opera`  
  (or sometimes `C:\Users\YourUsername\AppData\Roaming\Opera\Opera\profile`)
- Older Windows (XP/Vista):  
  `C:\Documents and Settings\YourUsername\Application Data\Opera\Opera`

**macOS:**  
`~/Library/Application Support/Opera`

**Linux:**  
`~/.opera` (hidden folder in your home directory)

**Portable version:**  
Look inside the Opera installation folder for a `profile` subfolder (or the root if it's fully portable).

### How to Find the Exact Path Quickly
1. **If Opera 12 is still installed and working**:
   - Open Opera 12.
   - Go to **Help → About Opera**.
   - Look under **Paths** for the **Preferences** or **Opera directory** line — this points directly to your profile folder.<grok:render card_id="db3e50" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">50</argument></grok:render>

2. **Search your computer**:
   - Windows: Search for `bookmarks.adr` or `opera6.ini`.
   - macOS/Linux: Search for `bookmarks.adr` or `.opera`.

3. **In Vivaldi's import dialog**:
   - Go to **Vivaldi menu → File → Import from Applications or Files**.
   - Select **Opera 12.x**.
   - If it asks for the path and the default doesn't work, **untick "Use Default Profile Location"**.
   - Click **Choose a Folder** and navigate to the folder containing `opera6.ini` (or the main profile folder).<grok:render card_id="4032c4" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">45</argument></grok:render>
   - Select it and start the import.

### What to Expect and Tips
- **Bookmarks**: Usually import well from `bookmarks.adr`.
- **Passwords**: From `wand.dat` — may require Opera 12 to be closed.
- **Mail/Contacts**: Vivaldi has good support for Opera M2 mail via this method.
- Close Opera 12 completely before importing.
- If the import fails or is incomplete, try exporting from Opera 12 manually:
  - Bookmarks → **File → Export bookmarks** (as HTML) → then import the HTML into Vivaldi.
  - Passwords are trickier (wand.dat is proprietary); you may need third-party tools or manual entry.

**Edge cases**:
- Multiple profiles in Opera 12? The default one is usually in the main folder; others might be in subfolders — check `opera6.ini` for details.
- Custom profile location? Opera 12 lets you set this in preferences or via command line — use the About page to confirm.
- Very old installation? Paths on XP or custom setups can vary; the search method is most reliable.

If you tell me your operating system (Windows/macOS/Linux) and whether it's a standard or portable install, or share any error messages, I can give more precise steps. You can also check Vivaldi's official guide for Opera 12 mail/import for screenshots and extra details. Let me know how it goes!

## User

_Time: 2026-05-20T02:45:05.888Z_

uhhh i'm on fedora kde plasma, and opera was installed in flatpak. it's not in ~/.opera. i was using operagx as well.

## Assistant

_Time: 2026-05-20T02:45:16.187Z_

**On Fedora with Flatpak-installed Opera (or Opera GX), the old `~/.opera` path doesn't exist** because Flatpak sandboxes the app. All its data lives inside `~/.var/app/` instead.<grok:render card_id="856fa5" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">10</argument></grok:render>

### Find Your Exact Opera Profile Path
1. **Easiest way — open Opera and check inside**:
   - Launch your Opera (the Flatpak version).
   - Go to **opera://about** (type it in the address bar).
   - Look for the **"Profile"** or **"Profile path"** line. It should be something like:  
     `~/.var/app/com.opera.Opera/.config/opera`  
     or for **Opera GX**: `~/.var/app/com.opera.opera-gx/.config/opera` (or similar, often with a `/Default` subfolder).

2. **Alternative: Search from terminal (KDE Dolphin or Konsole)**:
   ```bash
   find ~/.var/app -maxdepth 3 -type d -iname "*opera*" 2>/dev/null
   ```
   This will list relevant folders quickly. Look for one containing files like `Bookmarks`, `Login Data`, `Preferences`, `opera6.ini` (if it's old-style), etc.<grok:render card_id="315417" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">12</argument></grok:render>

### In Vivaldi's Import Dialog
- Go to **Vivaldi menu → File → Import from Applications or Files**.
- Choose **Opera 12.x** (even for modern Opera, this option often handles the legacy-style import for bookmarks/mail/etc.).
- **Untick "Use Default Profile Location"**.
- Click **Choose a Folder** and navigate to the full profile folder you found above (usually the one containing the main data files, not just a subfolder like "Default" unless that's what the importer expects).
- Select it and start the import.<grok:render card_id="906293" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">55</argument></grok:render>

### Opera GX Specific Notes
Opera GX uses a similar Flatpak ID (`com.opera.opera-gx`). Its profile follows the same `~/.var/app/com.opera.opera-gx/...` structure. The import may work better if you treat it as a Chromium-based browser (select Opera in the list if available) rather than the old Opera 12 option.<grok:render card_id="d54716" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">39</argument></grok:render>

### If Direct Import Still Fails
Flatpak sandboxing can block automatic detection, so manual methods often work better:

- **Export from Opera**:
  - Bookmarks → **opera://bookmarks** → Export as HTML.
  - Passwords → Settings → Privacy & security → Passwords → Export (as CSV).
  - Then import the HTML/CSV into Vivaldi.

- **Manual profile copy (advanced, for Chromium data)**:
  - Close both browsers.
  - Copy key files (Bookmarks, Login Data, History, etc.) from Opera's Flatpak profile to Vivaldi's profile folder (find Vivaldi's via **vivaldi://about** → Open Profile Folder).<grok:render card_id="51c600" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">56</argument></grok:render>

**Tip for Flatpak Vivaldi users** (if you're also using Flatpak Vivaldi): Its data is in `~/.var/app/com.vivaldi.Vivaldi/config/vivaldi`. You can copy between them carefully.<grok:render card_id="2b0221" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">57</argument></grok:render>

Let me know what you see in `opera://about` (the profile path) or any error messages, and I can refine the steps further!

## User

_Time: 2026-05-20T04:35:02.023Z_

i installed vlc flatpak and i'm not sure where the other skins are. I want the default but it seems to come out of the box with a different one

## Assistant

_Time: 2026-05-20T04:35:22.887Z_

**For VLC installed via Flatpak on Fedora (KDE Plasma), the skin/UI behavior differs due to sandboxing.** The "default" you're seeing might actually be the **skinned interface** (with a bundled or custom .vlt skin) rather than the true **native Qt interface** that matches your system theme better.<grok:render card_id="2b25be" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">57</argument></grok:render>

### Quick Fix: Switch Back to Default Native Interface
1. Open VLC (Flatpak version).
2. Go to **Tools → Preferences** (or press `Ctrl + P`).
3. In the **Interface** tab (usually the default view):
   - Under **Look and feel**, select **Use native style** (or **Native** / **Qt interface** — not "Use custom skin").
4. Click **Save**.
5. **Restart VLC completely** (close all windows, then reopen).

This should give you the standard clean VLC look that integrates better with KDE Plasma/Breeze theme.<grok:render card_id="324c29" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">59</argument></grok:render>

### Where Skins Live in Flatpak VLC
Flatpak apps don't use the normal `~/.local/share/vlc/skins2` path. Instead:

- Create the folder if it doesn't exist:  
  `~/.var/app/org.videolan.VLC/data/vlc/skins2`

- Download skins (.vlt files) from the official site: [videolan.org/vlc/skins.php](https://www.videolan.org/vlc/skins.php).<grok:render card_id="ec0ab2" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">46</argument></grok:render>
- Place the .vlt files directly into that `skins2` folder.
- Then in Preferences → Interface → select **Use custom skin** → **Choose** the .vlt file → Save → Restart.

You can also access this folder easily in **Dolphin** (KDE file manager) by typing the path in the location bar.

### Reset VLC Completely (If It’s Stuck on a Weird Skin)
If the above doesn't work or the UI is broken:

```bash
flatpak run --command=vlc org.videolan.VLC --reset-config --reset-plugins-cache
```

Or delete the config folder (backs up first!):

```bash
mv ~/.var/app/org.videolan.VLC/config/vlc ~/.var/app/org.videolan.VLC/config/vlc-backup
```

Then restart VLC.

### Extra KDE Plasma Tips
- On KDE, the native interface often looks best and follows your system dark/light theme.
- If you want better theming, install `breeze` or related Qt style packages via DNF (helps both native and Flatpak in some cases).<grok:render card_id="5c0c46" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">57</argument></grok:render>
- Flatpak VLC might look slightly different from the system/RPM version due to the bundled Qt runtime.

Let me know what the current skin looks like (e.g., is it very dark/minimalist?) or if you get any errors, and I can give more targeted steps! You can also use **Flatseal** (Flatpak permissions manager) if you need to tweak filesystem access for easier skin management.
