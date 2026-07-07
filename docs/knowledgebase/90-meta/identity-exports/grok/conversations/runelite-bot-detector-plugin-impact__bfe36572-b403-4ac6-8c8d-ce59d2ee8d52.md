---
source_url: "https://grok.com/c/bfe36572-b403-4ac6-8c8d-ce59d2ee8d52"
conversation_id: "bfe36572-b403-4ac6-8c8d-ce59d2ee8d52"
title: "RuneLite Bot Detector Plugin Impact"
extracted_at: "2026-06-29T16:14:08.457Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# RuneLite Bot Detector Plugin Impact

Source: [Grok conversation](https://grok.com/c/bfe36572-b403-4ac6-8c8d-ce59d2ee8d52)

## User

_Time: 2025-12-23T15:12:20.444Z_

I thought runelite was doing this anti bot scoreboard check that every player using it was inherently participating in. Something that’d immediately be able to figure out a bot just by a runelite player walking near them, and checking scoreboard stats. Last I heard it was wiping them all out

Find what I’m thinking of

## Assistant

_Time: 2025-12-23T15:13:31.186Z_

# Bot Detector

**RuneLite plugin.** Not built-in. Installs from Plugin Hub (search "Bot Detector").<grok:render card_id="6fdde9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render><grok:render card_id="34fcec" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">56</argument>
</grok:render>

## Why created
Manual checks existed: players copy nearby usernames, paste into hiscores.rs, spot bot patterns (99 mining, 1 everything else). Tedious. Reddit "witch hunts" did this semi-organized.<grok:render card_id="b9e708" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render>

Plugin automates: pulls data passively, feeds ML server. Solves scale—thousands of RuneLite users (50k+ installs) scan constantly. Jagex shares mod-labeled data to train ML. Beats solo reports.<grok:render card_id="16d76e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render><grok:render card_id="a7b111" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">56</argument>
</grok:render>

## Detection
- Triggers on nearby players spawning in view.
- Grabs: username, world/location, sighting time, visible gear + GE value.
- Fetches **hiscores stats** (your "scoreboard").<grok:render card_id="d77d82" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render>
- Server ML flags bot patterns (e.g., max smithing, naked in furnace).
- >90% confidence: auto-sends to Jagex.<grok:render card_id="b1b8eb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">56</argument>
</grok:render>

You participate just by playing. Walk near bot = instant profile.

## Impact
1.99M bans total. Users report 10k+ personal bans.<grok:render card_id="5d16ae" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">45</argument>
</grok:render><grok:render card_id="ee65a8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">65</argument>
</grok:render>

Waves hit hard—matches "wiping them out." Still active: v1.4.2 Dec 2025.<grok:render card_id="18136d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">56</argument>
</grok:render>

## Worth it?
If bots ruin spots: yes. Passive, accurate enough (trains on real data). False positives rare but possible (pures). Bots adapt, but ML updates.<grok:render card_id="8ad41d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render>

[Site](https://www.osrsbotdetector.com/) | [GitHub](https://github.com/Bot-detector/bot-detector)
