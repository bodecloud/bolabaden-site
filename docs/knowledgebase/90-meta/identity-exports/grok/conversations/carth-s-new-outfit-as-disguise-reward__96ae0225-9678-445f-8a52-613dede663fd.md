---
source_url: "https://grok.com/c/96ae0225-9678-445f-8a52-613dede663fd"
conversation_id: "96ae0225-9678-445f-8a52-613dede663fd"
title: "Carth's New Outfit as Disguise Reward"
extracted_at: "2026-06-29T16:10:39.914Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Carth's New Outfit as Disguise Reward

Source: [Grok conversation](https://grok.com/c/96ae0225-9678-445f-8a52-613dede663fd)

## User

_Time: 2026-02-15T22:49:00.447Z_

Search the web thoroughly, meticulously, and CAREFULLY and please provide intuitive accessible instructions for how to do this in something like the Holocron Toolset. Ensure most sentences in your response are backed by as many references/resources as possible.

## Assistant

_Time: 2026-02-15T22:50:47.454Z_

**Add Carth's New Outfit as a Disguise Item Reward**

- **Recommended Method**: Create a **disguise item** using the provided model/textures. This avoids replacing existing models/armor, bypasses class/feat restrictions in baseitems.2da (e.g., Jedi robes require "Jedi Defense"), and works seamlessly for NPCs like Carth.<grok:render card_id="864e7f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">96</argument>
</grok:render><grok:render card_id="78eff7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">101</argument>
</grok:render>
- **Exclusivity**: Install **K1 NPC Immersive Feats** mod, which adds a unique feat ("Decorated Pilot") only Carth has. Set this as a requirement in the item's UTI file.<grok:render card_id="ae67d1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">71</argument>
</grok:render>
- **Quest Integration**: Add the item as a reward in Carth's global dialogue (k_hcar_dialog.dlg) after the Dustil quest completes on Korriban.<grok:render card_id="8f799a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">98</argument>
</grok:render>
- **Primary Tool**: **Holocron Toolset** for 2DA/DLG/UTI editing and testing—intuitive GUI, no extraction needed.<grok:render card_id="3d4bc4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">93</argument>
</grok:render>
- **Uncertainty Note**: Disguises replace the full body (including head), but since only Carth equips it, no issue. Test thoroughly for clipping/animations.<grok:render card_id="4fae5b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">96</argument>
</grok:render>

### Preparation (5-10 mins)
1. **Download/Install Tools**:
   | Tool | Purpose | Download |
   |------|---------|----------|
   | Holocron Toolset | Edit 2DA (appearance.2da), UTI, DLG; test in 3D viewer/module editor | [Deadly Stream](https://deadlystream.com/files/file/1982-holocron-toolset/)<grok:render card_id="513b03" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">93</argument>
</grok:render> |
   | K1 NPC Immersive Feats | Carth's exclusive feat | [Deadly Stream](https://deadlystream.com/files/file/2065-k1-npc-immersive-feats/)<grok:render card_id="f03ef6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">71</argument>
</grok:render> |
   | MDLEdit | Rename model root | User has<grok:render card_id="aa9edc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">97</argument>
</grok:render> |

   - Run Holocron, set game paths (Override, Modules). Install Immersive Feats via TSLPatcher.

2. **Prepare Model/Textures** (from [source](https://deadlystream.com/topic/5529-a-new-look-for-carth/)):
   - Rename: `P_CarthBB.mdl` → `P_carthoutfit.mdl`, `.mdx` → `.mdx`, `P_CarthBB01.tga` → `P_carthoutfit01.tga`, `.txi` → `.txi` (P_ prefix for party models).<grok:render card_id="811d39" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">95</argument>
</grok:render>
   - MDLEdit: Open `.mdl` (binary → ASCII), edit root "classification" to `P_carthoutfit`, save ASCII → batch binary (K1 mode). Fixes internal name mismatch.<grok:render card_id="157205" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">96</argument>
</grok:render>
   - Copy to `Override` folder.

### Create Appearance Entry (Holocron: 2DA Editor)
1. Holocron → 2DA tab → Open `appearance.2da` (from BIFs/override).
2. Copy Carth's row (search "carth" or row ~292: PM1CB). Add new row at bottom (increment row #, e.g., 500).
3. Key columns (backup original!):
   | Column | Value | Notes |
   |--------|-------|-------|
   | label | P_carthoutfit | Unique ID<grok:render card_id="5595bb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">97</argument>
</grok:render> |
   | bodyvariation | 0 | Clothing slot (test 0-4) |
   | modelfleshvariant | PMHC06 | Carth's head texture |
   | modelhead_a | PMHC06 | Head model |
   | bodymodela | P_carthoutfit | New body model |
   | texturea | P_carthoutfit01 | Texture |
   - Save as `appearance.2da` to Override. Holocron auto-handles row numbering.<grok:render card_id="720b18" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">93</argument>
</grok:render>

### Create Item UTI (Holocron: GFF Editor)
1. Holocron → New File → UTI (or copy existing disguise, e.g., `g_i_sithdisguise001` via KotOR Tool if needed).
2. Tag: `g_i_carthoutfit`
3. Key fields:
   | Field | Value | Notes |
   |-------|-------|-------|
   | BasItems | disguise (row ~9 in baseitems.2da) | Item type<grok:render card_id="e28a78" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">101</argument>
</grok:render> |
   | Appearances | 500 (your row #) | Links appearance<grok:render card_id="5eceaf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">96</argument>
</grok:render> |
   | ReqFeat | Decorated Pilot row (~300+, check feats.2da post-Immersive install) | Carth only<grok:render card_id="55160e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">71</argument>
</grok:render> |
   | name | Carth's Republic Uniform | Display name |
   | desc | Stylish outfit reward... | Description |
   | icon | g_i_clth001 | Clothing icon |
   | texgui | 1 | Texture variation |
   - Save `g_i_carthoutfit.uti` to Override. No buffs needed.

### Test Item
- Holocron Module Editor → Load `ebo_m12aa` (Ebon Hawk) → Spawn NPC Carth → Console: `giveitem g_i_carthoutfit` → Equip. Check 3D viewer for model/head.<grok:render card_id="a74be3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">93</argument>
</grok:render>
- Pitfall: Invisible? Recheck model root/texture names match 2DA.<grok:render card_id="527b71" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">96</argument>
</grok:render>

### Add as Dustil Quest Reward
1. Holocron → DLG Editor → Open `k_hcar_dialog.dlg` (dialog.bif).
2. Find node after Dustil (search "dustil" entries, post-Korriban journal update ~k_hcar_dustil).
3. Select node → Actions tab → Add "Give Item" → Tag: `g_i_carthoutfit`, Count: 1.
4. Save to Override.
5. Test: Complete Dustil (kor_m01ab.mod, talk Dustil → Uthar/Yuthura paths), board Ebon Hawk, talk Carth.<grok:render card_id="d1a109" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">98</argument>
</grok:render>

**Total Time**: 30-60 mins. Backup Override. For sharing: Contact Darth Parametric (DS Discord), DarkHope.<grok:render card_id="a374c5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">95</argument>
</grok:render>

---

### Comprehensive Guide to Implementing Carth's Custom Outfit in KOTOR 1

This guide provides exhaustive, step-by-step instructions for integrating the custom Carth outfit (P_CarthBB model/textures) as a personal-use mod, optimized for the Holocron Toolset. It draws from established KOTOR 1 modding practices, prioritizing disguises for simplicity and compatibility—no new baseitems.2da row needed, avoiding prerequisite conflicts (e.g., Carth can't equip Jedi robes due to "Jedi Defense" in baseitems.2da row 14-16).<grok:render card_id="70ed7c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render><grok:render card_id="7402aa" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render> Evidence from multiple sources confirms disguises reference appearance.2da directly via UTI, rendering full-body models without slot conflicts.<grok:render card_id="5fedfa" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">96</argument>
</grok:render><grok:render card_id="3f9247" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">101</argument>
</grok:render><grok:render card_id="40dfc0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">103</argument>
</grok:render>

#### 1. Toolchain and Prerequisites
Holocron Toolset streamlines everything: 2DA/GFF/DLG editors, 3D preview, module access—no KotOR Tool extraction required.<grok:render card_id="55196a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">93</argument>
</grok:render> Install K1 NPC Immersive Feats first (TSLPatcher auto-edits feats.2da/UTC for Carth's "Decorated Pilot" feat, row ~299).<grok:render card_id="d688a7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">71</argument>
</grok:render>

| Tool | Version/Notes | Why Essential |
|------|---------------|---------------|
| Holocron Toolset | Latest (v1.8+) | One-app workflow; DLG actions like "Give Item" built-in<grok:render card_id="52be4b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">93</argument>
</grok:render> |
| MDLEdit | User-owned | Model renaming (OdysseyBase root)<grok:render card_id="8450a5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">97</argument>
</grok:render> |
| K1 NPC Immersive Feats | v1.0 | NPC feat for reqfeat field<grok:render card_id="e779bf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">71</argument>
</grok:render> |

**Setup**:
- Extract Holocron to folder, run → Set `swkotor.exe` path, Override/Modules.
- Install Immersive Feats → Verify `feats.2da` has "Decorated Pilot" (label: feat_pilot_carth).

#### 2. Asset Preparation
Source files are K1-compatible party reskin (P_ prefix).<grok:render card_id="da7327" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">95</argument>
</grok:render>
- **Rename** (unique to avoid conflicts):
  | Original | New | Reason |
  |----------|-----|--------|
  | P_CarthBB.mdl/.mdx | P_carthoutfit.mdl/.mdx | Party body model<grok:render card_id="0f017e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">97</argument>
</grok:render> |
  | P_CarthBB01.tga/.txi | P_carthoutfit01.tga/.txi | Matches body texture slot |
- **MDLEdit Fix** (critical: prevents "missing model" errors):
  1. Open `P_carthoutfit.mdl` → Binary → ASCII.
  2. Edit root node "classification": `P_carthoutfit`.
  3. Find texture nodes → Update to `P_carthoutfit01`.
  4. Save ASCII → MDLEdit batch (K1) → Binary .mdl/.mdx.
- Copy all to `Override`. Pitfall: Case-sensitive; use lowercase after P_.<grok:render card_id="44d9a5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">96</argument>
</grok:render>

#### 3. Appearance.2da Integration
Defines visuals. Copy Carth's row (PM1CB, row 292) for compatibility (head/torso match).<grok:render card_id="d168f4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">97</argument>
</grok:render>

**Holocron Steps**:
1. 2DA Editor → Load `appearance.2da`.
2. Right-click row 292 → Copy → Paste at bottom (new row 501).
3. Edit:
   | Column | Recommended | Purpose |
   |--------|-------------|---------|
   | label | P_carthoutfit | UTI reference<grok:render card_id="39c1f7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">96</argument>
</grok:render> |
   | bodymodela | P_carthoutfit | Clothing/disguise body |
   | texturea | P_carthoutfit01 | Primary texture |
   | modheadres | PMHC06 | Carth head texture |
   | modelhead_a | PMHC06 | Head model |
   | bodyvariation | 0 | Clothing slot A (test 1-3 if issues) |
   | modtorso | PMDB | Default torso (**** hides) |
4. Save to Override. Holocron validates rows.

#### 4. UTI Item Creation
**Holocron Steps**:
1. File → New → UTI.
2. Structured fields (GFF Editor):
   | Field (Struct) | Value | Notes |
   |----------------|-------|-------|
   | BaseItem | 9 (disguise) | baseitems.2da row<grok:render card_id="650301" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">101</argument>
</grok:render> |
   | AppearanceRow | 501 | Your 2DA row<grok:render card_id="9d8f7d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">96</argument>
</grok:render> |
   | ReqFeat | 299 | Immersive feat row (confirm in feats.2da) |
   | InvenTexSwap | 0 | No extra swap |
   | TexGUI | 1 | Texture var |
   | name | 0xFFFFFFFF (IPM string: "Carth's New Outfit") | TLK Editor for localization |
   | desc | 0xFFFFFFFE (TLK: desc) | |
   | icon | g_i_clth001 | Inventory icon |
3. Save `g_i_carthoutfit.uti`.

#### 5. Testing Protocol
| Step | Action | Expected |
|------|--------|----------|
| 1 | Holocron Module → ebo_m12aa → Spawn "carth" | Loads default |
| 2 | Console: `giveitem g_i_carthoutfit` | Item in inv |
| 3 | Equip on Carth (right-click) | New model/texture; head intact |
| 4 | Rotate in 3D viewer | No clipping/animations OK |
- Issues: Invisible head → Verify head columns; crash → MDLEdit root mismatch.<grok:render card_id="733bf9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">96</argument>
</grok:render>

#### 6. Quest Reward Integration
Dustil completes via kor_m01ab.mod (Academy); reward triggers in Carth's global DLG on Ebon Hawk (post-Leviathan).<grok:render card_id="76e748" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">98</argument>
</grok:render>

**Holocron Steps**:
1. DLG Editor → Load `k_hcar_dialog.dlg`.
2. Search "dustil" → Find completion node (journal update k_hcar_dustil_complete, ~entry 150+).
3. Select → Actions → Add → "Give Item" → Tag: `g_i_carthoutfit`, Stack: 1.
4. Optional: Add "Journal Entry" for tracking.
5. Save to Override.
- Test: New game → Korriban → Save Dustil (talk Dustil → lie/expose) → Ebon Hawk → Talk Carth → Receive item.

#### Advanced Tips & Pitfalls
- **Permissions**: DarkHope (DH) OK if credited; Darth Parametric (DP) via DS Discord.<grok:render card_id="22d1b1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">95</argument>
</grok:render>
- **Compatibility**: TSLPatcher for releases; test with K1CP.<grok:render card_id="0652ce" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">68</argument>
</grok:render>
- **Alternatives**: Armor slot → New baseitems row (complex); Jedi robe hack fails (feat locked).<grok:render card_id="701447" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">82</argument>
</grok:render>
- **Further Reading**: Modding Tutorial Series (models/2DA); DS Discord for DP.<grok:render card_id="e9784e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">97</argument>
</grok:render>

**Key Citations**:
- [Holocron Toolset](https://deadlystream.com/files/file/1982-holocron-toolset/)<grok:render card_id="dae98f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">93</argument>
</grok:render>
- [Disguise Thread](https://deadlystream.com/topic/11119-how-to-create-unique-disguises-kotor-1)<grok:render card_id="95d362" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">96</argument>
</grok:render>
- [K1 NPC Feats](https://deadlystream.com/files/file/2065-k1-npc-immersive-feats/)<grok:render card_id="3b47a8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">71</argument>
</grok:render>
- [Sidequest Rewards Mod](https://deadlystream.com/files/file/1980-k1-companion-sidequest-rewards)<grok:render card_id="203602" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">98</argument>
</grok:render>
- [Modding Tutorials](https://deadlystream.com/topic/6886-tutorial-kotor-modding-tutorial-series)<grok:render card_id="e65a33" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">97</argument>
</grok:render>
- [Carth Mod Source](https://deadlystream.com/topic/5529-a-new-look-for-carth)<grok:render card_id="5d1a46" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">95</argument>
</grok:render>
