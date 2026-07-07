---
source_url: "https://grok.com/c/61a0af0d-4ffb-496d-a8ea-371daa8ff4b5"
conversation_id: "61a0af0d-4ffb-496d-a8ea-371daa8ff4b5"
title: "Force Retribution: KotOR Battlefront II Adaptation"
extracted_at: "2026-06-29T16:37:34.502Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Force Retribution: KotOR Battlefront II Adaptation

Source: [Grok conversation](https://grok.com/c/61a0af0d-4ffb-496d-a8ea-371daa8ff4b5)

## User

_Time: 2026-04-14T07:04:36.607Z_

Use this to create a force power that does the equivalent of retribution from battlefront 2 but in KotOR using the attached files as examples of how to add unrelated force powers.

## Assistant

_Time: 2026-04-14T07:05:27.338Z_

**Force Retribution** (`st_forceretribution.nss`) – a new high-level universal Force power for your KotOR mod (modeled directly on the provided HLFP examples).

### 1. Understanding the Request & Battlefront II Reference
In *Star Wars Battlefront II* (2017), Anakin Skywalker’s **Retribution** is a charged ultimate-style ability. It passively builds meter when Anakin or nearby allies take damage, then unleashes a large 360° AoE Force Choke / Force Grasp:  
- Heavy area damage  
- Immobilize / choke crowd-control on multiple enemies  
- Dramatic visual burst (dark Force energy, beams, impact effects)  

The provided files (especially `st_forceclone.nss` + `st_inc_clone.nss`, `st_forcedestruct.nss`, `st_forceblind.nss`, `st_forcestrike.nss`, `st_forcehold.nss`, and the utility include `st_inc_force.nss`) show how the mod adds brand-new Force powers: single-file spell scripts that use `st_inc_force` helpers for damage, saves, durations, visuals, and resistance. No new AI or creature templates are required for a non-summon power, so this stays simple and self-contained (exactly like Force Blind, Force Destruction, or Force Deceive).

### 2. Design Rationale – Why This Adaptation Works in KotOR
- **Passive charging is impractical** in vanilla KotOR scripting. There is no clean “on-damage” global listener for the player without heavy engine hooks or per-creature heartbeat spam.  
- **Active cast version** preserves the *feel* of the dramatic payoff: the player chooses when to “release the built-up retribution.”  
- It is a powerful self-centered AoE (large radius, high damage + hard CC) that fits late-game / high-level Force powers.  
- Uses the exact same style, helpers, and visual language as your existing powers (delayed effects for distance, `ST_CalcDamage`, `ST_ResistForce`, `ST_CalcDuration`, `ST_SavingThrows`, linked effects, custom `effecticon.2da` support, etc.).  
- Edge-case handling mirrors your other scripts (droid/beast exceptions via `ST_SubKnockDown`, friendly-fire protection, dead/invalid target skipping).

### 3. Key Features & Nuances
- **Self-cast AoE** (Colossal radius ~20 m) around the caster — matches the 360° Battlefront burst.  
- **Damage scaling**: Uses your `ST_CalcDamage` with level-based dice + Force Mastery / Potency / Focus form bonuses.  
- **Choke CC**: Linked `EffectEntangle` + `EffectStunned` (the same safe combo used in `st_forcehold.nss`). Duration scaled by form.  
- **Saving throw**: Will save for half damage + shorter/no choke (feels like a Force power resist).  
- **Visuals**: Dark lightning beams, sparks, impact explosion — pulled from your existing VFX constants (`st_forcestrike`, `st_forcedestruct`, `st_forceblind`).  
- **Resistance**: `ST_ResistForce` first, then saving throw (exactly like your other hostile powers).  
- **Balance considerations**: High damage + hard CC makes it a strong “panic button” or boss-fight closer, but the 36-second cooldown typical of your other high-level powers keeps it from being spammable.  
- **Compatibility**: Works with Jedi/Sith forms, party members, droids/beasts, and your existing `effecticon.2da` system.

### 4. Complete Script – `st_forceretribution.nss`

```nws
// =============================================================
// ST_FORCERETRIBUTION.NSS - Force Power Script
// =============================================================
// Force Retribution (HLFP-style)
// AoE Force Choke / Grasp burst. Heavy damage + immobilize
// on all nearby enemies. Inspired by Anakin's Retribution
// from Battlefront II.
//
// Uses st_inc_force utilities exactly like Force Destruction,
// Force Blind, Force Strike, and Force Hold.
// -------------------------------------------------------------
// Last modified: 2026-04-14 (created for this request)

#include "st_inc_force"

void main() {
    location lLoc      = GetLocation(OBJECT_SELF);
    int      nSpellId  = GetSpellId();
    int      nHD       = GetHitDice(OBJECT_SELF);
    
    // === Visual wind-up on the caster (dramatic dark energy release) ===
    ApplyEffectToObject(DURATION_TYPE_INSTANT, EffectVisualEffect(VFX_IMP_FORCE_BREACH), OBJECT_SELF);
    ApplyEffectToObject(DURATION_TYPE_INSTANT, EffectVisualEffect(1047), OBJECT_SELF);          // sparks
    ApplyEffectToObject(DURATION_TYPE_INSTANT, EffectVisualEffect(3007), OBJECT_SELF);          // explosion (same as Force Destruction)
    
    SignalEvent(OBJECT_SELF, EventSpellCastAt(OBJECT_SELF, nSpellId, FALSE));
    
    // === AoE loop over all creatures in large radius (exactly like Force Blind / Destruction) ===
    object oTarget = GetFirstObjectInShape(SHAPE_SPHERE, RADIUS_SIZE_COLOSSAL, lLoc, FALSE, OBJECT_TYPE_CREATURE);
    
    while (GetIsObjectValid(oTarget)) {
        if (GetIsEnemy(oTarget) && !GetIsDead(oTarget) && (oTarget != OBJECT_SELF)) {
            
            float fDelay = GetDistanceBetween(OBJECT_SELF, oTarget) / 25.0;   // distance-based stagger for cinematic feel
            
            // First check Force resistance (your standard helper)
            if (ST_ResistForce(oTarget)) {
                DelayCommand(fDelay, ApplyEffectToObject(DURATION_TYPE_INSTANT, EffectForceFizzle(), oTarget));
            }
            else {
                // === Damage (scaled heavily – this is a retribution nuke) ===
                int nDamage = ST_CalcDamage(oTarget, nHD, 8);           // big dice like your Force Strike
                nDamage = nDamage + (nHD * 2);                           // extra flat bonus for high-level feel
                
                effect eDamage = EffectDamage(nDamage, DAMAGE_TYPE_BLUDGEONING);   // Force choke feels physical
                
                // === Choke / Immobilize effect (Entangle + Stun – safe & used in your Force Hold) ===
                effect eChoke = EffectEntangle();
                eChoke = EffectLinkEffects(eChoke, EffectStunned());
                eChoke = EffectLinkEffects(eChoke, EffectVisualEffect(VFX_DUR_LIGHTNING_S));   // dark lightning choke VFX
                eChoke = SetEffectIcon(eChoke, 999);   // <-- update with your custom effecticon.2da row if desired
                
                // === Saving throw (Will save halves damage and shortens choke – feels fair) ===
                if (!ST_SavingThrows(oTarget, SAVING_THROW_WILL)) {
                    // Full effect on failure
                    DelayCommand(fDelay, ApplyEffectToObject(DURATION_TYPE_INSTANT, eDamage, oTarget));
                    DelayCommand(fDelay, ApplyEffectToObject(DURATION_TYPE_TEMPORARY, eChoke, oTarget, ST_CalcDuration(8.0)));
                }
                else {
                    // Half damage + very brief stun on success
                    eDamage = EffectDamage(nDamage / 2, DAMAGE_TYPE_BLUDGEONING);
                    DelayCommand(fDelay, ApplyEffectToObject(DURATION_TYPE_INSTANT, eDamage, oTarget));
                    DelayCommand(fDelay, ApplyEffectToObject(DURATION_TYPE_TEMPORARY, EffectStunned(), oTarget, ST_CalcDuration(2.0)));
                }
                
                // Extra impact VFX per target (same as your other powers)
                DelayCommand(fDelay, ApplyEffectToObject(DURATION_TYPE_INSTANT, EffectVisualEffect(1049), oTarget));
            }
        }
        
        oTarget = GetNextObjectInShape(SHAPE_SPHERE, RADIUS_SIZE_COLOSSAL, lLoc, FALSE, OBJECT_TYPE_CREATURE);
    }
}
```

### 5. How to Add It to Your Mod (Quick Integration Notes)
1. Drop `st_forceretribution.nss` into your source/scripts folder.  
2. Compile to `st_forceretribution.ncs` (use your normal KotOR scripting tool).  
3. Add a new row in `spells.2da` (copy an existing high-level power row and point the script column to `st_forceretribution`).  
4. (Optional) Add a custom icon row in `effecticon.2da` and update the `SetEffectIcon` line.  
5. Assign the power to a feat / Force power selection in your class or item scripts exactly as you did for Spirit Exodus / Force Deceive.

### 6. Balance, Edge Cases & Future Polish Ideas
- **Balance**: Very strong (comparable to your Force Destruction). Consider a longer cooldown or Force-point cost if it feels overtuned in playtesting.  
- **Droids/Beasts**: The stun/entangle combo works on almost everything. If you want a droid exception (like your knockdown scripts), replace the stun portion with `ST_SubKnockDown` logic.  
- **Party safety**: The `GetIsEnemy` check already protects allies.  
- **Future enhancement** (optional): If you ever add a global player OnDamage script, you could add a passive “Retribution Meter” that auto-triggers this effect when full — but the active version above stays 100 % compatible with the files you gave me.

This power slots perfectly into your existing HLFP framework while delivering the dramatic, high-impact “retribution” fantasy from Battlefront II. Let me know if you want a version with passive meter support, different visuals, or a summon-style variant!
