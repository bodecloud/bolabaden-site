---
source_url: "https://grok.com/c/070605f6-51f2-48da-bd98-c3ea36f2329d"
conversation_id: "070605f6-51f2-48da-bd98-c3ea36f2329d"
title: "KOTOR BIK Video Creation Guide"
extracted_at: "2026-06-29T16:32:07.586Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# KOTOR BIK Video Creation Guide

Source: [Grok conversation](https://grok.com/c/070605f6-51f2-48da-bd98-c3ea36f2329d)

## User

_Time: 2026-05-09T05:29:23.776Z_

how to make a bik for kotor

## Assistant

_Time: 2026-05-09T05:29:43.230Z_

**To create or convert videos to .BIK format for *Knights of the Old Republic* (KOTOR 1 or 2), use RAD Video Tools from RAD Game Tools.** This is the standard (and essentially only reliable) tool for making .bik files that the game can play in its Movies folder.<grok:render card_id="6c14fc" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">11</argument></grok:render>

### Step-by-Step Guide to Making .BIK Files

1. **Download RAD Video Tools**  
   - Go to the official site: [radgametools.com/bnkdown.htm](https://www.radgametools.com/bnkdown.htm).  
   - Download `RADTools.7z` (password: **RAD** when extracting).  
   - Run the installer (`radvideo64.exe` or similar). Older versions (e.g., around 1.200e) sometimes work better for KOTOR compatibility.<grok:render card_id="efa6e4" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">38</argument></grok:render>

2. **Prepare Your Source Video**  
   - Start with a high-quality source: MP4, AVI (preferably lossless), MOV, etc.  
   - For best results, convert your video to a lossless AVI first (using tools like HandBrake, FFmpeg, or Adobe software) — RAD Tools is picky about codecs.  
   - Recommended resolutions for vanilla KOTOR: 640x480 (4:3) or similar. For HD/upscaled mods: 1280x720, 1920x1080, etc. (with game patches/hex edits).<grok:render card_id="27c388" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">2</argument></grok:render>

3. **Convert to .BIK**  
   - Open RAD Video Tools.  
   - Browse to your source video file(s) in the file explorer pane.  
   - Select one or more files (use batch for multiples).  
   - Click **"Bink it!"** (bottom left).  
   - In the Bink compressor window:  
     - Set output folder.  
     - Under **Input Video Settings**, enter desired **Width** and **Height** (for scaling).  
     - For KOTOR 1: Check **Compress audio** and set lossiness to 0 (to preserve sound).  
     - For KOTOR 2: Audio compression is often optional.  
     - Click **Bink** to start conversion.  
   - The output will be a new `.bik` file in the chosen folder (same name as source).<grok:render card_id="a00824" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">3</argument></grok:render>

4. **Install the .BIK into KOTOR**  
   - Copy the new `.bik` file to your game's **Movies** folder (e.g., `C:\Program Files (x86)\Steam\steamapps\common\Knights of the Old Republic\Movies`).  
   - Overwrite if replacing an existing cutscene.  
   - Test in-game. Rename or delete problematic originals as a backup.

### For HD/Upscaled Movies (Common Modding Use Case)
- Patch the game for widescreen/higher resolutions first (e.g., using UniWS or community patches).  
- Convert all .bik movies to your target resolution using the method above.  
- Hex-edit the executable (`swkotor.exe` or `swkotor2.exe`) with a tool like HxD to update hardcoded movie resolution values (e.g., change 640x480 references to 1920x1080). Detailed guides exist on Deadly Stream.<grok:render card_id="1123fb" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">38</argument></grok:render>  
- This removes black bars and makes cutscenes match your game resolution.

### Tips, Nuances, and Edge Cases
- **Compatibility Issues**: Newer RAD versions may not play nicely with KOTOR files. Try older builds if you get errors opening non-.bik files or conversion fails. Some users report better luck on Windows XP VMs for stubborn AVIs.<grok:render card_id="fb9f72" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">36</argument></grok:render>
- **File Size & Quality**: .bik files can be large. Balance resolution, bitrate, and audio quality — test in-game as high settings may cause lag or crashes on weaker systems.
- **Audio Problems**: Ensure audio is properly muxed. KOTOR 1 is stricter about sound.
- **Batch Processing**: Select multiple files for efficient conversion of full movie packs.
- **Viewing/Testing**: RAD Tools can play .bik files directly. Use it to verify before installing.
- **Alternatives/Limitations**: No great free alternatives exist for proper Bink encoding. FFmpeg can't output true Bink .bik compatible with KOTOR. For extraction (BIK → MP4), RAD Tools works in reverse via "Convert a file."
- **Modding Context**: This is popular for restored content, custom cutscenes, or HD packs. Always back up originals. Community resources like Deadly Stream forums have pre-made HD movie packs and troubleshooting.<grok:render card_id="81c6d1" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">20</argument></grok:render>

If you're replacing specific cutscenes or creating custom ones, name the file exactly as the game expects (e.g., `01a.bik`). For advanced tweaks (like menu videos), additional scripting may be needed.

This process is straightforward once you have RAD Tools set up, but test small files first. Let me know the exact goal (e.g., HD upgrade, custom video, specific error) for more tailored advice!
