---
source_url: "https://grok.com/c/7cf9bdb4-174f-43f9-bb2e-19ce2f177200"
conversation_id: "7cf9bdb4-174f-43f9-bb2e-19ce2f177200"
title: "Alien Outcast Planet Survival RPG"
extracted_at: "2026-06-29T16:09:38.322Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Alien Outcast Planet Survival RPG

Source: [Grok conversation](https://grok.com/c/7cf9bdb4-174f-43f9-bb2e-19ce2f177200)

## User

_Time: 2026-04-27T07:22:18.825Z_

```
Background 

You are crashed on an alien planet, you must band with outcasts and find a way off. Ancient ruins dot the landscape and crashed starships.
Strange mutants wander around.
Psionic rifts form releasing nightmares at night
Top down, twin stick shooter/bullet hell? style RPG

Humanity meter, the more alien tech you insert into you the more powerful certain powers become at the cost of your humanity.
Low humanity may vhange the ending

Gameplay


Controls

Classes


Leveling



Equipment 

Game Design Pillars
Games should be a tactile experience (about experiencing the setting)
Games should be about choices (choices define games from other media)
Games should evoke emotion (it is better to be hated than forgotten)

Setting

Story


Quest design
Quests will  be a class with states defined by an enum
Unknown, Mentioned, Rejected, Accepted, Accomplished, Completed, Botched.

Unknown represents that the quest has not come up in the game yet 
Mentioned represents that the quest has been mentioned to the player, through talking with the Quest giver, or through rumors etc.
Rejected represents a state where the player has talked with the quest giver and rejected the quest (either temporarily or permanently)
Accepted represents a state where the player has talked to the quest giver and has accepted the quest
Accomplished represents the state where the quest objective(s) have all been completed but the quest has not been turned in.
Completed represents the state where the player has turned the quest back into the quest giver and no more state changes are possible.
Botched represents the state where the quest has become impossible.

Objectives in a quest will be represented by variables within the quest.
Quest dialogue will be represented in the dialogue file, with a check to see the state of the quest and the relevant quest variable.

All quest givers will have help, hurt, and neutral varients.
Help will assist the Quest giver in the quest., hurt will either kill or otherwise block the quest givers quest in favor of their opposition, neutral will be an option that either plays both sides of a conflict or otherwise makes the ending of the quest resolve to neither side's benefit.
Each of these variants will have Combat, Stealth, and Suave options
Combat involves killing opposition
Stealth involves planning and avoiding notice.
Suave involves persuasion and disguise

Quest rewards will always include reputation and experience.

Areas

36 areas

Crash site
Description 
Major Characters

Quests
Main

Side


Notable items

Long term effects



UX
Ux design will focus on 

HUD

Main Menu



Pause menu

Hud

Mechanics

Controls
Controller
Left Trigger
Right Trigger
Left Bumper
Right Bumper
Left stick
Left stick click
Right stick
Right stick click
DPad up
Dpad down
DPad left
Dpad Right
Y button 
X button
B button
A button
Start button
Back button

PC


Combat
Combat should have hazards for environmental kills of enemies, this may include explosives, pits, traps, or other such hazards.
Combat will be a top down action twin stick shooter/hack and slash

Health system
The health system consists of wounds, stamina, armor and shields.
Shields absorb damage first, then armor, then stamina, then wounds.
Stamina regenerates, and is related to ability usage.
Cooldowns are slower the less stamina you have
Wounds are real damage and require medical attention to heal
Powers such as force heal or items such as medkits temporarily can heal wounds (it gets lost over time? Or heals only up to a limit?)
Armor can be repaired with repair kits, amount is based on equipment
Shields are activated, and need recharge?
Droids can repair wounds up to max with repair kits


Resistances
Damage Resistance
Damage Resistance divide a damage type by it's amount

Immunities
Damage Thresholds 
Damage Thresholds subtract from a damage type 
Damage threshold is subtracted before resistances


Vulnerability 
A negative damage Resistance gives vulnerability, this will multiply the amount of damage taken by a damage type

Damage Types
Physical	base damage 3 tags, different par tag
Fire	Chance to continual burn, water extinguishes, bonus vs wounds
Cold	Chance to slow, bonus vs stamina
Shock	Chance to stun, bonus vs shields, merge with ion?
Corrosive	Continual light damage, bonus vs armor?
Sonic	Doesn't explode explosives, chance to disorient?
	
Psychic	Bypass armor/shields, no damage vs Mechanicals
Plasma	Extreme damage to Wounds, Shields Resist
Poison	Extreme damage to Stamina and Wounds, half heals slowly over time, secondary effects, Shields block
Disruption	Extreme damage to Armor, Shields Resist
Ionizing Radiation damage	Bonus damage vs Mechanicals and Shields, Armor Resists
Concussive/force	Bypasses shields, Armor Resists, doesn't detonate explosives

Ranged combat
Ballistics
Lasers
Explosives
Hazardous Environment Unit

Minigun
Ballistics 

Fléchette launcher
Ballistics

Nano swarm painter
Ballistics

Gauss rifle
Ballistics 

Spike gun
Ballistics 

Pulse shot
Laser

Thicc laser
Laser

Reflec laser
Laser

Singularity gun
Laser

Linegun
Laser

Disc launcher
Explosives 

Grenade launcher 
Explosives 

MiniRockets
Explosives 

Spider mines
Explosives

Vengeance Rocket
Explosives 

Flame thrower
Heu

Incineration cannon
Heu

Acidline
Heu

Biorifle
Heu

Cryoblaster
Heu

Ammo

Melee combat



Movement

Animations
General idle animation 
Walk animation
Sprint animation
Crouch animation
Tall Cover animation
Short cover animation
Dance animation 
Sit animation
Meditation animation
Dodge roll animation

Melee idle animation
Melee flourish animation
Melee draw weapon animation
Melee attack animations
Stab
Horizontal strike
Vertical strike
Diagonal strike
Reverse horizontal strike
Hilt strike
Punch animation
Uppercutt animation
Cross animation
Elbow strike
Kick
Combat stance animation
Rifle butt
Pistol whip
Grab
Grab release
Escape grab
Shove grabbed
JudoThrow grabbed
Ranged attack animations
Pistol shoot
Rifle shoot
Throw grenade
Throw lightsaber
Catch lightsaber
Aim animation
Use force animation
Creature shamble
Creature attack
Creature grab attack
Creature slap
Creature bite

Minigames
Minigames will pull up a separate game mode, skill minigames ??


Bypassing
balance power levels to reroute power to desired subsystems
Amount of power available to bypass is based on Repair skill

Hacking
Text graphical on rails ship shooter, speed, damage and health of your ship all determined by your hacking skill? Or on rails runner?

Stealth

AI
NPCs will use sensors
A sensor will be a collision object that returns collision data for the NPC
NPCs will have a floor sensor in a 2d cone, a mid sensor in a  2d cone, and a head sensor in a cone.
The head sensor will represent sight and return the object info of what collides with it. A second raycast check will determine whether specific objects of note(such as characters) are visible, and what percentage is unobstructed(?) 
A 360° head sensor will represent sound, and report collisions with sound objects with a float of the strength of the sound and a float to represent the distance. Raycasts will determine the number of objects between the sound object and the listener, which will modify the strength of the sound (d^2 law?)
A mid raycast sensor will check for cover near the NPC.
A high raycast sensor will check that cover for if it is high cover or low cover (use check for height of detected object instead?)
A low raycast sensor will check for navigation obstacles 
A cylindrical sensor will represent scent and the size of it will be modified by a float for the strength of the sense of smell of the NPC
A cylindrical collision sensor will represent touch
Npcs will have multiple states that will propogate through contact or other actions ranging from idle/complacent (default), investigating (low alert, may return to idle unless suspicion event triggers), alerted( something is known to be wrong but not immediately present), aware(something is wrong and present), searching (looking for present danger), combat

Noise can be drowned out by other noise? Check for noise in area and subtract noise level by level of noise in between divided by 2 and noise near suspicious trigger noise by 4

Noises have suspicion levels attached, this can be modified by the suspicion state of the npc

Coffin shaped vision cones
Npcs off screen have reduced hearing

Enemies


Companions

Factions

Reputation 

Karma
Karma will be two separate floats, one for malevolence and one for benevolence.
Each float will affect the cost of certain relative 
High karma will alter appearance 
When not wearing a full helmet, NPCs will comment on your Appearance 
(Some persuasion differences?)


Leveling
Leveling will be class based
Each level the player will gain skills based on their class, stamina based on their class, and unique abilities or powers based on their class.

Attributes
Strength
Increases max weight
Increases melee damage

Agility
Increases defense
Increases Ranged
Increases crit chance

Intelligence
Bonus to XP gain
Bonus to Mental skills

Memory
Reduces Training Costs
Bonus to Concentration Checks

Wisdom


Personality 


Wounds
Based on your level, increased by class
Stamina
From Strength and Agility
Psyche
From Intelligence and Memory
Spirit

Classes
Each class should play differently
Specializations add power tracks


Soldier ( Combat)
High Wounds

Specializations 
Brawler
Melee focus

?
Ranged Focus

Scout (Combat, Skills)
Moderate Wounds

Specializations 
Ranger
Skill focus

Sniper
Combat Focus



Tech (Skills)
Low Wounds

Specializations 
?
 focus

?
 Focus


Agent (Skills, Psionics)
Low Wounds

Specializations 
?
Tech focus

Ghost
Psionics Focus



Psion (Psionics)
Low Wounds

Specializations 
?
 focus

?
 Focus


Warlock (Combat, Psionics)
Moderate Wounds 

Specializations 
?
 Combat Focus

?
 Psionics Focus



Weapons
Modularity
Each weapon type will be divided into parts, the part of each weapon used will be decided based on an enum.

Weapons can deteriorate (deterioration spread amongst parts)

Melee
Melee weapons will have a blade, a guard, a hilt, and a pommel
Double bladed weapons will replace the pommel with an additional blade option. This will double the blade, guard, and hilt cost
These will be represented by Enums

Ranged
Ranged weapons will have a unique crosshair based on Weapon type to reflect it's characteristics.
Ranged weapons will have accuracy falloff as they are fired
Cooldown weapons with quick cooldown option? 

Armor
Armor will be divided between Armor slots with plating and an under layer
Armor slots will be Head, Torso Armor, Underlayer, Left Leg Armor, Right Leg armor, Boots, Left Arm Armor, Right Arm Armor, Gloves, Back, Eyes for

The player will be able to mix and match parts for the plating. however matching sets will provide a bonus.
Armor disguises will require the full set to be worn to be effective, partial sets will provoke questioning or combat if reputation is not high enough.
Power Armor requires Power Armor Underlayer to be worn

Armor deterioration 

Economy
Each region will have unique goods based on the theme of that area
Basic goods will be found in all areas

Inventory 
I also want to split armors into parts, so left shoulder, right shoulder, torso, legs, helmet, base clothes, gloves, boots, belt 
I want an ammo system because it will allow me to differentiate blasters from melee better.
It also would act to balance ranged vs Melee.
However if it doesn't work, then I will cut it of course.
Or just make some weapons have ammo etc

I may potentially limit consumables on exit of the ship, and ask the player to configure how they want to stock up to the max number of grenades, med packs, and stims
(This also would balance the combat so I could make grenades more powerful for example)

Yeah, I don't want it to be clunky, so I want to have quick armor settings so you can one click apply all of the armor you have of a single set

Crafting
Crafting is divided between mechanical and organic crafting
Mechanical crafting is for weapons and armor
Organic is for medicines and poisons
Mechanical Crafting will use Parts, Components, and Alloy to craft items at a workbench.
Certain items will require rare or unique resources, for example wooshir wood.
Parts can be disassembled to Components (with some efficiency loss), Components can be disassembled to Alloys (with some efficiency loss.)
Allows can be crafted into Components, and components can be crafted into parts

Organic crafting will use Chemicals, and Compounds at a lab.

Skills
Repair skill
Computers skill
Stealth skill
Medicine skill
Persuade skill
Awareness skill
Demolitions skill


Traits
Traits have benefits and downsides
They are self balancing

Advantages
Advantages are generally beneficial to the player, they are gained as the player levels up, and are balanced by flaws


Flaws
Flaws are generally detrimental to the player, they are balanced by advantages
Taking a flaw allows an extra Advantage from a related list.

End game slides
End game slides based off game variables show what happens to major worlds, factions and characters as a result of your actions


New game+
Extra dialogue options

Objects
Containers
Barrel 

Broken barrel

Crate

Broken crate

Box

Broken box

Footlocker

Broken footlocker

Locker

Broken locker

Puzzlebox

Strongbox

Broken strongbox

Bag

Backpack

Wicker basket

Wicker chest

Vase

Broken vase

Corpse



Destructables
Fuel canister

Gas line

Conduit

Transformer

Chemical container

Chem line

Carbonite canister 

Carbonite line

Fuel cell?

Gas canister

Vehicle

Creature cages



Twin stick shooter GDD

Top down camera

Platforms
Ios $5 (or free with ads)
Android $5 (or free with ads)
Windows $20
Linux $20

Windows and linux have 4 player couch co-op 
4 person Online multiplayer with invites, one person hosts
Crossplay?

Separate build for each

Controls (console)
Left stick            - move
Right stick          - Aim?
Left stick click    -
Right stick click  - zoom in vs zoom out
Left bumper       - Camera Left
Right bumper     - Camera Right
Left trigger          - strafe mode 
Right trigger       - charge
A button             - fast attack
B button             - Toggle Shield
X button             - Slow attack
Y button             - Use special item

Controls (mobile)
Left Screen stick            - move
Double tap screen stick - dodge
Right screen stick          - attack in direction 
Button toggle                 - switch to slow attack 
Button                            - use special
Button                            - block/counter
Swipe screen                 - charge

Controls (PC) configurable
W key               - move up
A key                - move left
S key                - move down
D key                - move right
 Combinations of above gives diagonals
Mouse position - aim direction 
Spacebar          - dodge in direction of aiming
Right mouse     - fast attack
Left mouse        - slow attack
F key                 - block/counter
R key                 - use special



Player moves
(Left right up down)
Player shoots
Player heals
Player gets hurt
Player has collision 
Player can pickup specials
Player has score
Player can charge
Player can block
Player can counter

obstacles 
obstacles can explode
Obstacles can kill on collision 
Obstacles can be invincible 

Enemies shoot
Enemies move
Enemies explode

Pick ups
Health
Gold
Special weapons


Enemy types

Weak 1 hit to kill
Mid 2 hits to kill
Strong 3 hits to kill
Mini Boss 15 hits to kill
Boss 30 his to kill
Overboss 60 hits to kill
Generator 5 hits to kill (+1 per area unlocked)

Creeper fast melee enemy
Gunner mid ranged enemy

Randomly generated terrain
Low poly style

Generators spawn new enemies
After a number of generators are destroyed a miniboss may spawn
Number increases every area by 5
Killing the miniboss opens more areas
After 5 areas unlocked boss spawns
After 25 areas overboss spawns

Typed generators are weak to a type of damage 
Eg. Lava is weak to cold
Ice is weak to fire
Metal weak to shock
Etc

Weak, mid and strong enemies share a model but are different sizes
Shrink to lower variety when damaged

Health bar over bosses

Projectile types
Bullet
Laser
Rockets
Lightning
Fireball

Areas generated based off biome
Generators may spawn in old areas

Split screen based on voronoi to maintain split screen


Alien syndrome concepts
Enemy is nanites gone rogue who mutate/control tech and organisms

Leveling up is learning to implement nanites into yourself until you are less human

Structure (has collision)
Object (has Collision and health/destructable) (inventory?)
Actor (has collision, health, inventory, actions)
Item (has collision)

Armor
Sets > set bonuses
Higher tiers at harder maps

Modifiers
0 common
1 uncommon
2 rare
3 legendary 
Unique = 4 modifiers



Weapons

Melee and ranged

Customizable

Modifiers per part
0 common
1 uncommon
2 rare
3 legendary 
Unique = 4 modifiers

0-12 modifiers (16 if all unique parts)

Modify weapons at bench

Break down items to pull the modifiers out
Able to use modifiers to craft items? (1 mod 90% 2 mods 60% 3 mods 20% craft chance, each mod has a separate chance to survive, chance for mods to get corrupted on failure) (minigame?)

Melee
Poke
Crush
Slice

Ranged

Health packs heal over time
Gib at damaged to -max hp

Levels
Themed 
Nonlinear 
Divided by world

Hidden loot levels

Volcano / mountains
Forests
Tropical Island / underwater
Hills
Ice
Desert
Space station
Mutated Bio world 

Enemies

Mutator
Acts as a generator

Splitter
Basic ooze type that splits as you hit it
```

Please write in markdown, do not change or rephrase anything. Just add markdown formatting. Be comprehensive.

## Assistant

_Time: 2026-04-27T07:22:55.254Z_

# Background

You are crashed on an alien planet, you must band with outcasts and find a way off. Ancient ruins dot the landscape and crashed starships.  
Strange mutants wander around.  
Psionic rifts form releasing nightmares at night  
Top down, twin stick shooter/bullet hell? style RPG

## Humanity meter
the more alien tech you insert into you the more powerful certain powers become at the cost of your humanity.  
Low humanity may vhange the ending

## Gameplay

## Controls

## Classes

## Leveling

## Equipment 

## Game Design Pillars
Games should be a tactile experience (about experiencing the setting)  
Games should be about choices (choices define games from other media)  
Games should evoke emotion (it is better to be hated than forgotten)

## Setting

## Story

## Quest design
Quests will  be a class with states defined by an enum  
Unknown, Mentioned, Rejected, Accepted, Accomplished, Completed, Botched.

Unknown represents that the quest has not come up in the game yet   
Mentioned represents that the quest has been mentioned to the player, through talking with the Quest giver, or through rumors etc.  
Rejected represents a state where the player has talked with the quest giver and rejected the quest (either temporarily or permanently)  
Accepted represents a state where the player has talked to the quest giver and has accepted the quest  
Accomplished represents the state where the quest objective(s) have all been completed but the quest has not been turned in.  
Completed represents the state where the player has turned the quest back into the quest giver and no more state changes are possible.  
Botched represents the state where the quest has become impossible.

Objectives in a quest will be represented by variables within the quest.  
Quest dialogue will be represented in the dialogue file, with a check to see the state of the quest and the relevant quest variable.

All quest givers will have help, hurt, and neutral varients.  
Help will assist the Quest giver in the quest., hurt will either kill or otherwise block the quest givers quest in favor of their opposition, neutral will be an option that either plays both sides of a conflict or otherwise makes the ending of the quest resolve to neither side's benefit.  
Each of these variants will have Combat, Stealth, and Suave options  
Combat involves killing opposition  
Stealth involves planning and avoiding notice.  
Suave involves persuasion and disguise

Quest rewards will always include reputation and experience.

## Areas

36 areas

### Crash site
#### Description 
#### Major Characters

#### Quests
##### Main

##### Side

#### Notable items

#### Long term effects

## UX
Ux design will focus on 

### HUD

### Main Menu

### Pause menu

### Hud

## Mechanics

## Controls
### Controller
Left Trigger  
Right Trigger  
Left Bumper  
Right Bumper  
Left stick  
Left stick click  
Right stick  
Right stick click  
DPad up  
Dpad down  
Dpad left  
Dpad Right  
Y button   
X button  
B button  
A button  
Start button  
Back button

### PC

## Combat
Combat should have hazards for environmental kills of enemies, this may include explosives, pits, traps, or other such hazards.  
Combat will be a top down action twin stick shooter/hack and slash

### Health system
The health system consists of wounds, stamina, armor and shields.  
Shields absorb damage first, then armor, then stamina, then wounds.  
Stamina regenerates, and is related to ability usage.  
Cooldowns are slower the less stamina you have  
Wounds are real damage and require medical attention to heal  
Powers such as force heal or items such as medkits temporarily can heal wounds (it gets lost over time? Or heals only up to a limit?)  
Armor can be repaired with repair kits, amount is based on equipment  
Shields are activated, and need recharge?  
Droids can repair wounds up to max with repair kits

### Resistances
Damage Resistance  
Damage Resistance divide a damage type by it's amount

### Immunities
Damage Thresholds   
Damage Thresholds subtract from a damage type   
Damage threshold is subtracted before resistances

### Vulnerability 
A negative damage Resistance gives vulnerability, this will multiply the amount of damage taken by a damage type

### Damage Types
Physical	base damage 3 tags, different par tag  
Fire	Chance to continual burn, water extinguishes, bonus vs wounds  
Cold	Chance to slow, bonus vs stamina  
Shock	Chance to stun, bonus vs shields, merge with ion?  
Corrosive	Continual light damage, bonus vs armor?  
Sonic	Doesn't explode explosives, chance to disorient?  
	
Psychic	Bypass armor/shields, no damage vs Mechanicals  
Plasma	Extreme damage to Wounds, Shields Resist  
Poison	Extreme damage to Stamina and Wounds, half heals slowly over time, secondary effects, Shields block  
Disruption	Extreme damage to Armor, Shields Resist  
Ionizing Radiation damage	Bonus damage vs Mechanicals and Shields, Armor Resists  
Concussive/force	Bypasses shields, Armor Resists, doesn't detonate explosives

### Ranged combat
Ballistics  
Lasers  
Explosives  
Hazardous Environment Unit

Minigun  
Ballistics 

Fléchette launcher  
Ballistics

Nano swarm painter  
Ballistics

Gauss rifle  
Ballistics 

Spike gun  
Ballistics 

Pulse shot  
Laser

Thicc laser  
Laser

Reflec laser  
Laser

Singularity gun  
Laser

Linegun  
Laser

Disc launcher  
Explosives 

Grenade launcher   
Explosives 

MiniRockets  
Explosives 

Spider mines  
Explosives

Vengeance Rocket  
Explosives 

Flame thrower  
Heu

Incineration cannon  
Heu

Acidline  
Heu

Biorifle  
Heu

Cryoblaster  
Heu

### Ammo

### Melee combat

## Movement

## Animations
General idle animation   
Walk animation  
Sprint animation  
Crouch animation  
Tall Cover animation  
Short cover animation  
Dance animation   
Sit animation  
Meditation animation  
Dodge roll animation

Melee idle animation  
Melee flourish animation  
Melee draw weapon animation  
Melee attack animations  
Stab  
Horizontal strike  
Vertical strike  
Diagonal strike  
Reverse horizontal strike  
Hilt strike  
Punch animation  
Uppercutt animation  
Cross animation  
Elbow strike  
Kick  
Combat stance animation  
Rifle butt  
Pistol whip  
Grab  
Grab release  
Escape grab  
Shove grabbed  
JudoThrow grabbed  
Ranged attack animations  
Pistol shoot  
Rifle shoot  
Throw grenade  
Throw lightsaber  
Catch lightsaber  
Aim animation  
Use force animation  
Creature shamble  
Creature attack  
Creature grab attack  
Creature slap  
Creature bite

## Minigames
Minigames will pull up a separate game mode, skill minigames ??

## Bypassing
balance power levels to reroute power to desired subsystems  
Amount of power available to bypass is based on Repair skill

## Hacking
Text graphical on rails ship shooter, speed, damage and health of your ship all determined by your hacking skill? Or on rails runner?

## Stealth

## AI
NPCs will use sensors  
A sensor will be a collision object that returns collision data for the NPC  
NPCs will have a floor sensor in a 2d cone, a mid sensor in a  2d cone, and a head sensor in a cone.  
The head sensor will represent sight and return the object info of what collides with it. A second raycast check will determine whether specific objects of note(such as characters) are visible, and what percentage is unobstructed(?)   
A 360° head sensor will represent sound, and report collisions with sound objects with a float of the strength of the sound and a float to represent the distance. Raycasts will determine the number of objects between the sound object and the listener, which will modify the strength of the sound (d^2 law?)  
A mid raycast sensor will check for cover near the NPC.  
A high raycast sensor will check that cover for if it is high cover or low cover (use check for height of detected object instead?)  
A low raycast sensor will check for navigation obstacles   
A cylindrical sensor will represent scent and the size of it will be modified by a float for the strength of the sense of smell of the NPC  
A cylindrical collision sensor will represent touch  
Npcs will have multiple states that will propogate through contact or other actions ranging from idle/complacent (default), investigating (low alert, may return to idle unless suspicion event triggers), alerted( something is known to be wrong but not immediately present), aware(something is wrong and present), searching (looking for present danger), combat

Noise can be drowned out by other noise? Check for noise in area and subtract noise level by level of noise in between divided by 2 and noise near suspicious trigger noise by 4

Noises have suspicion levels attached, this can be modified by the suspicion state of the npc

Coffin shaped vision cones  
Npcs off screen have reduced hearing

## Enemies

## Companions

## Factions

## Reputation 

## Karma
Karma will be two separate floats, one for malevolence and one for benevolence.  
Each float will affect the cost of certain relative   
High karma will alter appearance   
When not wearing a full helmet, NPCs will comment on your Appearance   
(Some persuasion differences?)

## Leveling
Leveling will be class based  
Each level the player will gain skills based on their class, stamina based on their class, and unique abilities or powers based on their class.

### Attributes
Strength  
Increases max weight  
Increases melee damage

Agility  
Increases defense  
Increases Ranged  
Increases crit chance

Intelligence  
Bonus to XP gain  
Bonus to Mental skills

Memory  
Reduces Training Costs  
Bonus to Concentration Checks

Wisdom

Personality 

### Wounds
Based on your level, increased by class  
Stamina  
From Strength and Agility  
Psyche  
From Intelligence and Memory  
Spirit

## Classes
Each class should play differently  
Specializations add power tracks

### Soldier ( Combat)
High Wounds

#### Specializations 
Brawler  
Melee focus

?  
Ranged Focus

### Scout (Combat, Skills)
Moderate Wounds

#### Specializations 
Ranger  
Skill focus

Sniper  
Combat Focus

### Tech (Skills)
Low Wounds

#### Specializations 
?  
 focus

?  
 Focus

### Agent (Skills, Psionics)
Low Wounds

#### Specializations 
?  
Tech focus

Ghost  
Psionics Focus

### Psion (Psionics)
Low Wounds

#### Specializations 
?  
 focus

?  
 Focus

### Warlock (Combat, Psionics)
Moderate Wounds 

#### Specializations 
?  
 Combat Focus

?  
 Psionics Focus

## Weapons
### Modularity
Each weapon type will be divided into parts, the part of each weapon used will be decided based on an enum.

Weapons can deteriorate (deterioration spread amongst parts)

### Melee
Melee weapons will have a blade, a guard, a hilt, and a pommel  
Double bladed weapons will replace the pommel with an additional blade option. This will double the blade, guard, and hilt cost  
These will be represented by Enums

### Ranged
Ranged weapons will have a unique crosshair based on Weapon type to reflect it's characteristics.  
Ranged weapons will have accuracy falloff as they are fired  
Cooldown weapons with quick cooldown option? 

## Armor
Armor will be divided between Armor slots with plating and an under layer  
Armor slots will be Head, Torso Armor, Underlayer, Left Leg Armor, Right Leg armor, Boots, Left Arm Armor, Right Arm Armor, Gloves, Back, Eyes for

The player will be able to mix and match parts for the plating. however matching sets will provide a bonus.  
Armor disguises will require the full set to be worn to be effective, partial sets will provoke questioning or combat if reputation is not high enough.  
Power Armor requires Power Armor Underlayer to be worn

Armor deterioration 

## Economy
Each region will have unique goods based on the theme of that area  
Basic goods will be found in all areas

## Inventory 
I also want to split armors into parts, so left shoulder, right shoulder, torso, legs, helmet, base clothes, gloves, boots, belt   
I want an ammo system because it will allow me to differentiate blasters from melee better.  
It also would act to balance ranged vs Melee.  
However if it doesn't work, then I will cut it of course.  
Or just make some weapons have ammo etc

I may potentially limit consumables on exit of the ship, and ask the player to configure how they want to stock up to the max number of grenades, med packs, and stims  
(This also would balance the combat so I could make grenades more powerful for example)

Yeah, I don't want it to be clunky, so I want to have quick armor settings so you can one click apply all of the armor you have of a single set

## Crafting
Crafting is divided between mechanical and organic crafting  
Mechanical crafting is for weapons and armor  
Organic is for medicines and poisons  
Mechanical Crafting will use Parts, Components, and Alloy to craft items at a workbench.  
Certain items will require rare or unique resources, for example wooshir wood.  
Parts can be disassembled to Components (with some efficiency loss), Components can be disassembled to Alloys (with some efficiency loss.)  
Allows can be crafted into Components, and components can be crafted into parts

Organic crafting will use Chemicals, and Compounds at a lab.

## Skills
Repair skill  
Computers skill  
Stealth skill  
Medicine skill  
Persuade skill  
Awareness skill  
Demolitions skill

## Traits
Traits have benefits and downsides  
They are self balancing

### Advantages
Advantages are generally beneficial to the player, they are gained as the player levels up, and are balanced by flaws

### Flaws
Flaws are generally detrimental to the player, they are balanced by advantages  
Taking a flaw allows an extra Advantage from a related list.

## End game slides
End game slides based off game variables show what happens to major worlds, factions and characters as a result of your actions

## New game+
Extra dialogue options

## Objects
### Containers
Barrel 

Broken barrel

Crate

Broken crate

Box

Broken box

Footlocker

Broken footlocker

Locker

Broken locker

Puzzlebox

Strongbox

Broken strongbox

Bag

Backpack

Wicker basket

Wicker chest

Vase

Broken vase

Corpse

### Destructables
Fuel canister

Gas line

Conduit

Transformer

Chemical container

Chem line

Carbonite canister 

Carbonite line

Fuel cell?

Gas canister

Vehicle

Creature cages

## Twin stick shooter GDD

Top down camera

### Platforms
Ios $5 (or free with ads)  
Android $5 (or free with ads)  
Windows $20  
Linux $20

Windows and linux have 4 player couch co-op   
4 person Online multiplayer with invites, one person hosts  
Crossplay?

Separate build for each

### Controls (console)
Left stick            - move  
Right stick          - Aim?  
Left stick click    -  
Right stick click  - zoom in vs zoom out  
Left bumper       - Camera Left  
Right bumper     - Camera Right  
Left trigger          - strafe mode   
Right trigger       - charge  
A button             - fast attack  
B button             - Toggle Shield  
X button             - Slow attack  
Y button             - Use special item

### Controls (mobile)
Left Screen stick            - move  
Double tap screen stick - dodge  
Right screen stick          - attack in direction   
Button toggle                 - switch to slow attack   
Button                            - use special  
Button                            - block/counter  
Swipe screen                 - charge

### Controls (PC) configurable
W key               - move up  
A key                - move left  
S key                - move down  
D key                - move right  
 Combinations of above gives diagonals  
Mouse position - aim direction   
Spacebar          - dodge in direction of aiming  
Right mouse     - fast attack  
Left mouse        - slow attack  
F key                 - block/counter  
R key                 - use special

### Player moves
(Left right up down)  
Player shoots  
Player heals  
Player gets hurt  
Player has collision   
Player can pickup specials  
Player has score  
Player can charge  
Player can block  
Player can counter

### obstacles 
obstacles can explode  
Obstacles can kill on collision   
Obstacles can be invincible 

### Enemies shoot
Enemies move  
Enemies explode

### Pick ups
Health  
Gold  
Special weapons

### Enemy types

Weak 1 hit to kill  
Mid 2 hits to kill  
Strong 3 hits to kill  
Mini Boss 15 hits to kill  
Boss 30 his to kill  
Overboss 60 hits to kill  
Generator 5 hits to kill (+1 per area unlocked)

Creeper fast melee enemy  
Gunner mid ranged enemy

Randomly generated terrain  
Low poly style

Generators spawn new enemies  
After a number of generators are destroyed a miniboss may spawn  
Number increases every area by 5  
Killing the miniboss opens more areas  
After 5 areas unlocked boss spawns  
After 25 areas overboss spawns

Typed generators are weak to a type of damage   
Eg. Lava is weak to cold  
Ice is weak to fire  
Metal weak to shock  
Etc

Weak, mid and strong enemies share a model but are different sizes  
Shrink to lower variety when damaged

Health bar over bosses

### Projectile types
Bullet  
Laser  
Rockets  
Lightning  
Fireball

Areas generated based off biome  
Generators may spawn in old areas

Split screen based on voronoi to maintain split screen

## Alien syndrome concepts
Enemy is nanites gone rogue who mutate/control tech and organisms

Leveling up is learning to implement nanites into yourself until you are less human

### Structure (has collision)
Object (has Collision and health/destructable) (inventory?)  
Actor (has collision, health, inventory, actions)  
Item (has collision)

### Armor
Sets > set bonuses  
Higher tiers at harder maps

### Modifiers
0 common  
1 uncommon  
2 rare  
3 legendary   
Unique = 4 modifiers

### Weapons

Melee and ranged

Customizable

Modifiers per part  
0 common  
1 uncommon  
2 rare  
3 legendary   
Unique = 4 modifiers

0-12 modifiers (16 if all unique parts)

Modify weapons at bench

Break down items to pull the modifiers out  
Able to use modifiers to craft items? (1 mod 90% 2 mods 60% 3 mods 20% craft chance, each mod has a separate chance to survive, chance for mods to get corrupted on failure) (minigame?)

### Melee
Poke  
Crush  
Slice

### Ranged

Health packs heal over time  
Gib at damaged to -max hp

### Levels
Themed   
Nonlinear   
Divided by world

Hidden loot levels

Volcano / mountains  
Forests  
Tropical Island / underwater  
Hills  
Ice  
Desert  
Space station  
Mutated Bio world 

### Enemies

Mutator  
Acts as a generator

Splitter  
Basic ooze type that splits as you hit it
