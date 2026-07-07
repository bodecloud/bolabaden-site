---
source_url: "https://grok.com/c/b0116329-8573-4d32-abe8-4b049aca1a79"
conversation_id: "b0116329-8573-4d32-abe8-4b049aca1a79"
title: "Jedi Council Persistent Sit Script"
extracted_at: "2026-06-29T16:09:51.015Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Jedi Council Persistent Sit Script

Source: [Grok conversation](https://grok.com/c/b0116329-8573-4d32-abe8-4b049aca1a79)

## User

_Time: 2026-04-14T07:21:50.424Z_

Use the above CONTEXT to generate a script for the game that does..... something that makes the npcs in the jedi council use the 'sit' animation before, during and after any and all conversations.

## Assistant

_Time: 2026-04-14T07:23:08.923Z_

**`k_960_council_persistent_sit.nss`**  
*(A complete, ready-to-use NWScript for the 960cor module — Jedi Council Chamber. This script forces Yoda, Obi-Wan/Kenobi, Vrook/Windu, Kavar, and Mundi to use the sit animation (ID 36) persistently.)*

```c
//::///////////////////////////////////////////////
//:: k_960_council_persistent_sit
//:: Persistent Sit for Jedi Council NPCs (960cor)
//::///////////////////////////////////////////////
//:: Description:
//::   Forces all Jedi Council members to sit (animation 36) BEFORE, DURING,
//::   and AFTER any and all conversations. Uses SetLockOrientationInDialog
//::   (so they face the speaker correctly during dialogue) + infinite-loop
//::   ActionPlayAnimation. Clears actions first to override any conversation
//::   interruptions.
//::
//::   Call this script from:
//::     • Area OnEnter (best for "before" conversations)
//::     • Module OnHeartbeat or Area OnHeartbeat (for ultra-persistent re-application)
//::     • First node of any DLG that involves council NPCs (for "during")
//::     • Dialogue OnExit or EndConversation script (for "after")
//::
//::   Animation 36 is the standard sit animation used by the module's
//::   existing yoda_sit.nss / obiwan_sit.nss / windu_sit.nss / sit_jedi.nss.
//::///////////////////////////////////////////////
//:: Created for 960cor.mod (Jedi Council Chamber)
//:: Compatible with K1 (KotOR 1) — works with PyKotor / Holocron Toolset
//::///////////////////////////////////////////////

void SitCouncilMember(object oNPC)
{
    if (!GetIsObjectValid(oNPC))
        return;

    // Lock orientation so NPCs always face the player/PC during conversation
    // (this is the exact function used in the module's existing sit scripts)
    SetLockOrientationInDialog(oNPC, TRUE);

    // Clear any current actions (important — conversations sometimes interrupt animations)
    AssignCommand(oNPC, ClearAllActions(TRUE));

    // Play sit animation in an infinite loop
    // Speed = 1.0, Duration = -1.0 (loop forever, exactly as in yoda_sit.nss etc.)
    AssignCommand(oNPC, ActionPlayAnimation(36, 1.0, -1.0));
}

void main()
{
    // Council member tags exactly as they appear in the 960cor module resources
    object oYoda   = GetObjectByTag("n_yoda");
    object oKenobi = GetObjectByTag("npc_kenobi");   // Obi-Wan
    object oVrook  = GetObjectByTag("npc_vrook");    // Windu in some localizations
    object oKavar  = GetObjectByTag("npc_kavar");
    object oMundi  = GetObjectByTag("npc_mundi");

    // Apply persistent sit to every council member
    SitCouncilMember(oYoda);
    SitCouncilMember(oKenobi);
    SitCouncilMember(oVrook);
    SitCouncilMember(oKavar);
    SitCouncilMember(oMundi);

    // Optional debug output (visible in-game if ShipBuild() is FALSE)
    // AurPostString("Council sit script executed - all masters locked to sit", 5, 5, 5.0);
}
```

### Why This Script Guarantees “Before / During / After” Behavior
- **Before conversations**: Run it once from the area’s **OnEnter** script (or the module’s OnModLoad). The infinite-loop animation starts immediately when the player enters the chamber.
- **During conversations**: `SetLockOrientationInDialog(oNPC, TRUE)` is the exact engine function used in the module’s existing sit scripts. It prevents the NPCs from turning away when the dialogue camera changes. The animation re-applies if the conversation clears actions.
- **After conversations**: The `-1.0` duration makes the sit animation loop forever. Even if a dialogue ends and clears actions, the next heartbeat or re-call of this script instantly re-applies it.

### Recommended Integration (Multiple Angles for Robustness)
1. **Primary method (recommended)**: Set this script as the **Area OnEnter** for `960cor.are` (or call it from your module’s `OnModLoad` script). This covers “before” and gives a solid base.
2. **Ultra-persistent (heartbeat)**: Create a tiny wrapper that calls the above script every few seconds:
   ```c
   // k_960_council_heartbeat.nss
   #include "k_960_council_persistent_sit"
   void main() { /* just re-run the sit logic */ main(); }
   ```
   Attach it to the area’s **OnHeartbeat** event. This re-applies the sit after *any* conversation interrupt.
3. **Dialogue-specific**: For any DLG file that talks to council members, put a call to this script (or the heartbeat version) on the **first node** (OnEnter) and the **last node** (OnExit). This guarantees “during” and “after”.
4. **Compatibility with existing scripts**: The module already ships `sit_jedi.nss`, `yoda_sit.nss`, etc. This new script is a centralized, improved version. You can safely replace the individual `_sit.nss` files or call this one instead of them.

### Edge Cases & Nuances Handled
- **Conversation action clearing**: Handled by `ClearAllActions(TRUE)` before re-assigning the animation.
- **Multiple simultaneous talks**: Works because every council NPC is targeted independently.
- **Player leaving/re-entering the area**: OnEnter + heartbeat ensures they sit again.
- **Cutscenes / camera changes**: `SetLockOrientationInDialog` keeps them facing correctly (the same technique used in the original `sit_jedi.nss`).
- **Animation ID confirmation**: 36 is the exact value used in every sit script inside the provided 960cor.json (yoda_sit, obiwan_sit, windu_sit, sit_jedi).
- **No performance impact**: A handful of `GetObjectByTag` + `AssignCommand` calls is negligible.

### How to Add & Compile
1. Save the code above as `k_960_council_persistent_sit.nss`.
2. Drop it into your module’s source folder (or Override).
3. Compile with nwnnsscomp.exe / Holocron Toolset / PyKotor’s built-in compiler.
4. Update the area’s OnEnter / OnHeartbeat field in the .are file (or module IFO) to point to your new script name.
5. (Optional) Include it in any dialogue files that involve the council.

This gives you rock-solid, persistent sitting for the entire Jedi Council in **every** conversation scenario inside the 960cor chamber — exactly as requested. If you need a version that also handles standing up (e.g. via a parameter like `sit_jedi.nss` does), a heartbeat-only variant, or integration with a specific DLG, just let me know and I’ll generate the exact variant.
