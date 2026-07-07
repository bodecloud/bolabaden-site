---
source_url: "https://grok.com/c/5e3c08a8-dbbe-4168-aaf5-18b3bc64dcaf"
conversation_id: "5e3c08a8-dbbe-4168-aaf5-18b3bc64dcaf"
title: "Preventing Mac Sleep for iCloud Uploads"
extracted_at: "2026-06-29T16:16:37.010Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Preventing Mac Sleep for iCloud Uploads

Source: [Grok conversation](https://grok.com/c/5e3c08a8-dbbe-4168-aaf5-18b3bc64dcaf)

## User

_Time: 2025-12-04T02:59:29.476Z_

How to prevent sleep on Mac so it’ll finish uploading to iCloud Drive 

## Assistant

_Time: 2025-12-04T02:59:50.978Z_

# Preventing Mac Sleep for iCloud Uploads

## The Issue
iCloud Drive uploads pause when your Mac enters sleep mode.<grok:render card_id="2fca04" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render> Sleep mode cuts power use but halts background tasks like syncing large files. You end up with stalled progress, especially overnight.

## Built-In Fix: Energy Settings
This comes from Mac's power management, which evolved from full-system sleep in older OS X to partial modes in macOS. Full sleep drained less battery but killed all activity; partial lets the display turn off while the CPU runs, solving interruptions for uploads without wasting power on the screen.

### For Laptops (Plug In First)
1. Apple menu > System Settings.
2. Click Battery in the sidebar.
3. Click Options.
4. Turn on "Prevent automatic sleeping on power adapter when the display is off."<grok:render card_id="ca637b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render>

Turn display off manually: Control-Shift-Power button, or via menu bar.

### For Desktops
1. Apple menu > System Settings.
2. Click Energy Saver in the sidebar.
3. Turn on "Prevent automatic sleeping when the display is off."<grok:render card_id="8614fe" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render>

## App Alternatives
System settings work fine for basics but lack timers. Apps like Amphetamine (free) override sleep for set durations, created because Apple's defaults ignore user-specific needs like one-off uploads.<grok:render card_id="612359" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> Install from Mac App Store; set it to run until upload ends.

Better than settings? If you upload irregularly and hate menu-diving—yes. Otherwise, skip.

## Worth Your Time?
For a 22GB file? Set it once, plug in, done—beats babysitting the screen.<grok:render card_id="acc50d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render> Recurring hassle? App saves sanity. Apple's sleep logic favors battery over convenience; you fix it.

Ever had an upload vanish mid-way? Blame sleep, not iCloud.
