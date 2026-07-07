---
source_url: "https://grok.com/c/14379ed1-3690-448f-a599-faf0ee6bed1d"
conversation_id: "14379ed1-3690-448f-a599-faf0ee6bed1d"
title: "Flatpak Steam Settings Migration Guide"
extracted_at: "2026-06-29T16:08:45.832Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Flatpak Steam Settings Migration Guide

Source: [Grok conversation](https://grok.com/c/14379ed1-3690-448f-a599-faf0ee6bed1d)

## User

_Time: 2026-05-23T04:04:53.082Z_

1.  

2. ok so i have /home/brunner56/.var/app/... where am I copying this to?

3. specifically:

4. /home/brunner56/.var/app/com.valvesoftware.Steam/*

 
trying to copy my flatpak steam settings so when i reinstall the native non-flatpak variant it'll keep all my settings/etc

## Assistant

_Time: 2026-05-23T04:06:10.144Z_

**You're copying the relevant parts of `/home/brunner56/.var/app/com.valvesoftware.Steam/*` (the Flatpak Steam's isolated data directory) into the native Steam's standard data location, which is `~/.local/share/Steam/` (with some symlinks in `~/.steam/`).** Not the *entire* contents of the Flatpak folder—only the Steam-specific subfolders like `steamapps/`, `userdata/`, and `config/` (plus anything else that holds your games, saves, and client settings). The rest of the Flatpak directory contains sandbox-specific runtime files, caches, or Flatpak-only bits that native Steam doesn't need (and could cause conflicts if copied blindly).

### Quick Context: Why the Paths Differ
Flatpak Steam runs in a sandbox, so its "home directory" is isolated at `~/.var/app/com.valvesoftware.Steam/`. Inside that, Steam creates its normal data structure (often under `.local/share/Steam/` or `data/Steam/`, which are usually symlinked).  
Native (non-Flatpak) Steam uses the standard Linux/XDG paths: primarily `~/.local/share/Steam/` for games, saves, configs, shaders, etc. (The `~/.steam/` folder is mostly symlinks for backward compatibility.)  

This migration preserves:
- Installed games (no full re-downloads in most cases).
- Cloud saves and local game saves (`userdata/`).
- Client settings (library folders, downloads, UI preferences, login state in `config/`).
- Proton/Wine prefixes and some shader caches.

It does **not** automatically handle:
- Flatpak-specific overrides/permissions (e.g., external drive access via Flatseal).
- Any custom controller configs or per-game files outside the standard Steam folders (rare, but check game-specific folders in `steamapps/common/` if needed).

### Important Warnings Before You Start
- **Backup first** — always. This protects against any permission issues, partial copies, or rare incompatibilities.  
  ```bash
  cp -r ~/.var/app/com.valvesoftware.Steam ~/Steam-Flatpak-Backup-$(date +%Y%m%d)
  ```
- Run these commands as your normal user (not sudo).
- Close **both** Flatpak and native Steam completely before copying.
- After migration, you can safely uninstall the Flatpak version: `flatpak uninstall com.valvesoftware.Steam`.
- Native Steam may re-verify some game files or rebuild shader caches on first launch (normal and expected).

### Step-by-Step: Copy Your Flatpak Settings to Native Steam

1. **Install and initialize native Steam**  
   - Download the official `.deb` from store.steampowered.com/about/ (or use your distro's package if preferred, e.g., `sudo apt install steam` on Ubuntu/Debian-based systems).  
   - Install it, then **launch native Steam once** and let it fully start (it will create the empty `~/.local/share/Steam/` and `~/.steam/` folders).  
   - Log in if prompted, then **close Steam completely**.

2. **Locate the important folders inside your Flatpak directory**  
   Open a terminal and explore:  
   ```bash
   ls ~/.var/app/com.valvesoftware.Steam/
   ```  
   You will typically see folders like `.local/share/Steam/`, `data/Steam/`, or both (they're often symlinked—one points to the other). The key subfolders you care about are inside there:  
   - `steamapps/` → your installed games and library manifests.  
   - `userdata/` → your saves, cloud sync data, screenshots, and most per-user settings.  
   - `config/` → Steam client configuration (library folders, skins, etc.).  

   Example common paths in Flatpak (check both if unsure):  
   - `~/.var/app/com.valvesoftware.Steam/.local/share/Steam/`  
   - `~/.var/app/com.valvesoftware.Steam/data/Steam/`

3. **Copy the key data** (this is the core answer to “where am I copying this to?”)  
   Replace `<FLATPAK_STEAM_DATA>` with the actual path you found in step 2 (e.g., `~/.var/app/com.valvesoftware.Steam/.local/share/Steam` or `~/.var/app/com.valvesoftware.Steam/data/Steam`).  

   ```bash
   # Main game files (this is the big one)
   cp -r <FLATPAK_STEAM_DATA>/steamapps ~/.local/share/Steam/

   # Saves, cloud data, and most settings
   cp -r <FLATPAK_STEAM_DATA>/userdata ~/.local/share/Steam/

   # Client config (login, preferences, library setup)
   cp -r <FLATPAK_STEAM_DATA>/config ~/.local/share/Steam/ 2>/dev/null || true
   ```  

   If you want to be extra safe and copy more (e.g., shader caches, compatdata for Proton), you can do:  
   ```bash
   cp -r <FLATPAK_STEAM_DATA>/* ~/.local/share/Steam/
   ```  
   (This is usually overkill but harmless; Steam will ignore extras.)

4. **Fix permissions if needed** (rare, but good practice)  
   ```bash
   chown -R $USER:$USER ~/.local/share/Steam ~/.steam
   ```

5. **Launch native Steam**  
   - Open it. It should detect all your games as “Ready to Play” (or installed).  
   - Let it verify any games if prompted (this checks files but doesn’t re-download everything).  
   - Your settings, library folders, and most saves should appear exactly as before.  
   - If a game was installed to a custom/external library, you may need to add that folder again in Steam → Settings → Storage, then Steam will scan and recognize the files.

### What to Expect After Migration (Nuances & Edge Cases)
- **Performance/Integration**: Native Steam has full system access (easier external drives, better GPU/driver integration in some cases) but less sandbox isolation than Flatpak. Updates come directly from Valve instead of Flathub.
- **Proton / Runtime differences**: Your Proton prefixes (in `steamapps/common/Proton*` or `compatdata/`) usually transfer fine, but you might see a one-time shader recompile for some games.
- **Steam Cloud**: If games use cloud saves, Steam will sync the latest version automatically (could overwrite local changes if timestamps differ).
- **External drives / custom libraries**: If you used Flatseal overrides for extra drives, you’ll need to re-add those library folders in native Steam (no Flatpak permission hassle anymore).
- **Rare issues**:
  - Some very old games or modded setups might need manual file tweaks (check game-specific folders inside `steamapps/common/<game>/`).
  - If you see “missing files” on a game, right-click → Properties → Installed Files → Verify Integrity of Game Files.
  - Controller configs or Big Picture mode settings live in `userdata/<your-steamid>/` and usually migrate cleanly.
- **Space considerations**: The copy can be large (tens to hundreds of GB). Use `rsync -av --progress` instead of `cp` if you want resumable transfers or to exclude big unnecessary caches.

### Related Considerations
- If you’re on a Debian/Ubuntu-based distro (looks likely from your path), the official Valve `.deb` is the most common “native” route and matches the paths above perfectly.
- Want to keep both versions temporarily? You can run them side-by-side, but don’t launch both at once or they’ll fight over the same data.
- For even more complete migration (including any stray Flatpak overrides or skins), you could also copy `~/.var/app/com.valvesoftware.Steam/.steam/steam/` contents selectively, but the `~/.local/share/Steam/` method above covers 99% of cases per community reports.

This approach is the standard, battle-tested method used by many Linux gamers migrating between Flatpak and native Steam.<grok:render card_id="b392d1" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">0</argument></grok:render><grok:render card_id="256097" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">29</argument></grok:render><grok:render card_id="9956b3" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">32</argument></grok:render>

If you run into any specific errors after trying this (e.g., “games not showing up” or a particular path not existing), paste the output of `ls ~/.var/app/com.valvesoftware.Steam/` and `ls ~/.local/share/Steam/` and I’ll help refine the commands. You’ve got this—your settings and progress should transfer smoothly!
