---
source_url: "https://grok.com/c/0c368d39-d9ca-4eca-a906-92c3e281bbf7"
conversation_id: "0c368d39-d9ca-4eca-a906-92c3e281bbf7"
title: "Party Health Monitoring Script"
extracted_at: "2026-06-29T16:33:54.300Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Party Health Monitoring Script

Source: [Grok conversation](https://grok.com/c/0c368d39-d9ca-4eca-a906-92c3e281bbf7)

## User

_Time: 2025-08-13T01:34:33.106Z_

Please explain intuitively and concisely what this script does:

```//Checks health of Party when one member hits 1HP
void health_check (object oNPC, object oNPC1, object oNPC2){
    
    if ((GetCurrentHitPoints(oNPC) == 1) && 
        (GetCurrentHitPoints(oNPC1)>=1) &&
        (GetGlobalBoolean("SLE_FIGHT_ON")==TRUE) ||
        (GetCurrentAction(oNPC) == 1) &&
        (GetCurrentHitPoints(oNPC2)>=1) &&
        (GetGlobalBoolean("SLE_FIGHT_ON")==TRUE)){
            partydie(oNPC);
        }
    if ((GetCurrentHitPoints(oNPC) == 1) && 
        (GetCurrentHitPoints(oNPC1) < 1) && 
        (GetCurrentHitPoints(oNPC2) < 1)&& 
        (GetGlobalBoolean("SLE_FIGHT_ON")==TRUE)) {
            surrender(oNPC);
        }
}
//Runs health check constantly
void run(){

    object oPC = CP_GetPartyMember(0);
    object oPM1 = CP_GetPartyMember(1);
    object oPM2 = CP_GetPartyMember(2);

    health_check(oPC, oPM1, oPM2);
    health_check(oPM1, oPC, oPM2);
    health_check(oPM2, oPC, oPM1);
    


}```

## Assistant

_Time: 2025-08-13T01:37:30.970Z_

This script continuously monitors the health of a three-member party (likely in a game like Neverwinter Nights or KotOR) while a fight is active (`SLE_FIGHT_ON` global flag is true).

For each party member:
- If they reach exactly 1 HP and at least one other member is still alive (HP ≥ 1), it forces them to die (`partydie`).
- If they reach 1 HP but both others are dead (HP < 1), it makes them surrender (`surrender`).

(Note: The condition for checking the second other member appears to have a likely typo, using `GetCurrentAction` instead of `GetCurrentHitPoints`, but the intent aligns with the above logic.)
