---
source_url: "https://chatgpt.com/c/68546b2d-25bc-8006-941b-4fe999931d6c"
conversation_id: "68546b2d-25bc-8006-941b-4fe999931d6c"
title: "Linux Media Player Alternatives"
extracted_at: "2026-06-29T15:39:34.816Z"
message_count: 4
provenance: auth-ui
---

# Linux Media Player Alternatives

Source: [ChatGPT conversation](https://chatgpt.com/c/68546b2d-25bc-8006-941b-4fe999931d6c)

## User

Yo man I have been using k-lite codec pack for over 10 years. I just swapped to kde-based distro of linux lately as my daily driver and i can't find really a good media player at *all*. mpv is too featureless, and the other defaults are D-tier compared to what i've been spoiled on with mpc-hc/potplayer.

Closest equivalents??

## Assistant

Yo, I totally feel you on that. If you've been living the good life with K-Lite + MPC-HC or PotPlayer, landing in Linux media player land can feel like you’ve been thrown back to caveman days.

Let’s break it down. You want a feature-rich, Windows-tier experience on KDE/Linux. Here are your best MPC-HC/PotPlayer equivalents or alternatives that actually hold up:

🔹 SMPlayer — The closest in spirit

Built on MPV but has a full GUI (like MPC-HC).

Clean, simple interface, tons of settings, subtitle downloads, resume playback, audio/video filters.

KDE/Qt-friendly.

Supports YouTube playback with URL input.

Bonus: Doesn’t feel like a skin over a CLI player — it feels like an actual media player.

Install:

Bash
sudo apt install smplayer

(or dnf install smplayer, depending on distro)

🔹 Celluloid (a.k.a. GNOME MPV)

Another MPV GUI, but more streamlined.

Better for casual use, not very tweakable — but it’s prettier than raw MPV.

GTK, so may not look as native on KDE.

If you want something PotPlayer-tier, Celluloid is not it — more like a “dumbed-down MPC.”

🔹 Haruna Player — KDE-native, modern UI

One of the best KDE-integrated MPV GUIs.

Clean, modern interface, hardware decoding, chapter support, subtitle search/download, YouTube DL integration.

More intuitive and polished than SMPlayer, but a bit younger project.

If you’re on KDE, this should be your first stop.

Install (Arch/Manjaro):

Bash
sudo pacman -S haruna

Flatpak:

Bash
flatpak install flathub org.kde.haruna
🔹 MPV + Scripts + GUI Frontend — DIY PotPlayer

If you're okay with a bit of config work, MPV + community scripts turns it into a beast:

Add shader packs, auto subtitle downloader, thumbnail previews, pause screen thumbnails, etc.

GUI frontends: mpv.net
 (if ever going back to Windows), or Haruna/SMPlayer here.

See: Awesome MPV GitHub repo

🔹 Honorable Mentions:

VLC: Still a fallback. It works, it's everywhere, it's... VLC. Not as nice as MPC-HC/PotPlayer though.

QMPlay2: Very full-featured, less polished UI but underrated. Built with Qt, supports audio/video filters, streaming, playlist mgmt, and more.

TL;DR: Your Best Bets
Player	KDE-Friendly	Feature-Rich	MPV-Based	Comment
Haruna	✅	✅	✅	Best KDE-native modern player
SMPlayer	✅	✅✅✅	✅	Closest to MPC-HC
QMPlay2	✅	✅✅✅	❌	Ugly but powerful
MPV + scripts	✅	✅✅✅✅	✅	PotPlayer-level, but DIY
Celluloid	❌ (GTK)	🚫	✅	Too simple for power users

Want a full-blown config+script pack to turn MPV into a PotPlayer clone? I can hook you up — just say the word.

## User

bro smplayer's ui looks like it's 20 years old. Please for the love of god find something better, curated by video encoding enthusiasts on doom9 or whatever ON PAR with k-lite

## Assistant

Say no more. You're not looking for just any media player — you want precision-crafted, codec nerd–approved tools that don’t feel like a Windows 2003 relic. You're chasing that K-Lite + MPC-HC + MadVR + PotPlayer tweak-heaven experience — and I get it.

Here’s the real-deal, enthusiast-curated list of media players and setups that deliver that K-Lite-tier playback quality on Linux (yes, even for 4K HDR, high-bitrate anime, subtitle filters, etc). Most of these names are actually respected on Doom9, Reddit’s r/htpc, and obscure Discords where they talk about bitrates like wine.

🧠 Top-Tier Setup for Linux Video Enthusiasts
🔥 1. MPV + Scripts + Custom Configs — The King Setup

Yes, MPV is “bare” out of the box, but with the right config + scripts, it's the only player on Linux that truly matches PotPlayer/MPC-HC + MadVR.

🔧 Must-Have MPV Setup:

Custom mpv.conf (set up filters, hardware decoding, profiles)

Advanced Shaders (like FSRCNNX, KrigBilateral, SSimDownscaler — from madVR world)

User Scripts (see below)

GUI Frontend (Optional): Haruna for KDE, or just run MPV raw if you're hardcore

🧬 Core Scripts:

uosc
 – Modern OSD with clickable UI elements (feels like PotPlayer)

thumbfast
 – Seekbar thumbnail preview

autoload
 – Automatically load files in the same folder

stats.lua
 – Enhanced stat overlay

sponsorblock
 – Skip YouTube sponsors automatically

subs-delay
 – Real-time subtitle syncing

🧙‍♂️ Shader Example (FSRCNNX):
Lua
glsl-shader="~~/shaders/FSRCNNX_x2_8-0-4-1.glsl"
scale=ewa_lanczossharp
cscale=ewa_lanczossharp
dscale=mitchell

🎯 Result: better upscaling than VLC, more control than MPC-HC, GPU-accelerated everything, better subtitle rendering than PotPlayer.

🧱 2. MPV Shim GUIs That Don’t Suck
Name	KDE Native	UI Rating	Customizable	Notes
Haruna	✅ Yes	⭐⭐⭐⭐	✅ ✅ ✅	MPV power with a clean UI
Celluloid	❌ GTK	⭐⭐⭐	❌	Meh
Deepin Movie (DDE Player)	❌ (QT under)	⭐⭐⭐⭐	❌	Surprisingly slick UI, not very tweakable
Baka-MPlayer	❌ GTK	⭐⭐⭐	❌ (abandoned)	Only notable for anime fans

Honestly, Haruna is the only GUI that doesn’t look like it was made in 2007.

🧨 3. QMPlay2 — Actually a Beast (Ignore the UI)

Uses FFmpeg directly, supports audio/video filters, spectrum analyzer, streaming, playlist management

Built-in YouTube playback, radio streams, codec management

Can even preview video bitstreams

Ugly, but insanely feature-dense, like an engineer's toy

👉 For folks who loved how PotPlayer had 1000 toggles, this is your guy. It’s ugly, but functionally dense as hell.

🏁 TL;DR – If You Want That K-Lite/MPC-HC MadVR Power in KDE Linux:

Install MPV

Get uosc + shaders + thumbfast + sponsorblock

Pair with Haruna if you want a UI

(Optional) Use QMPlay2 if you need serious codec inspection / features

🛠️ Bonus: My Ready-to-Go MPV Config Starter Pack?

Let me know — I can build you a turnkey zip with mpv.conf, scripts, shaders, and fonts so it just works like your old Windows MPC-HC + madVR setup — no fluff.

Want that?
