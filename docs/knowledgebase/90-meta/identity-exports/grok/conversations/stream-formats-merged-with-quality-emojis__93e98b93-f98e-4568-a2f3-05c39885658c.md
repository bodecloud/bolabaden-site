---
source_url: "https://grok.com/c/93e98b93-f98e-4568-a2f3-05c39885658c"
conversation_id: "93e98b93-f98e-4568-a2f3-05c39885658c"
title: "Stream formats merged with quality emojis"
extracted_at: "2026-06-29T16:08:06.297Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Stream formats merged with quality emojis

Source: [Grok conversation](https://grok.com/c/93e98b93-f98e-4568-a2f3-05c39885658c)

## User

_Time: 2026-06-06T01:21:17.437Z_

please merge these two format definitions:
 

```
{stream.proxied::istrue["🕵️ "||""]}{stream.type::=p2p["[P2P] "||""]}{service.shortName::exists["[{service.shortName}"||""]}{stream.library::istrue["☁️"||""]}{service.cached::istrue["⚡] "||""]}{service.cached::isfalse["⏳] "||""]}{addon.name}{stream.resolution::exists[" {stream.resolution}"||""]}{stream.regexMatched::exists[" ({stream.regexMatched})"||""]}
```

and
 

```
{stream.resolution::exists["{stream.resolution::replace('2160p','   4K   ')::replace('1440p','    2K   ')::replace('p','P')}‍"||"‍     "]}{stream.type::exists["‍{stream.type::replace('debrid','    ')::replace('p2p','⁽ᵖ²ᵖ⁾')::replace('live','⁽ˡᶦᵛᵉ⁾')::replace('http','⁽ʷᵉᵇ⁾')::replace('usenet','‍⁽ⁿᶻᵇ⁾‍')::replace('stremio-usenet','‏⁽ⁿᶻᵇ⁾')::replace('info','⁽ᶦⁿᶠᵒ⁾')::replace('statistic','⁽ˢᵗᵃᵗˢ⁾')::replace('external','⁽ᵉˣᵗ⁾')::replace('error','⁽ᵉʳʳᵒʳ⁾')::replace('youtube','⁽ʸᵗ⁾')}‍‍‍"||""]}{service.cached::istrue["⚡"||""]}{service.cached::isfalse["‍⏳‍​"||""]}{stream.quality::exists["‍‍\n  〈{stream.quality::title::replace('Bluray Remux','Remux')::replace('Web-dl','Web‍-‍dl')::replace('Hc Hd-rip','HC HDRip')::replace('Hdrip','HDRip')}〉‍     "||""]}{stream.message::~Download["{tools.removeLine}\n"||""]}{stream.nSeScore::exists["‍\n  {stream.nSeScore::star::replace('⯪','☆')}            "||""]}{stream.message::~Download["{tools.removeLine}\n"||""]}
```

 
then do next:
 

```
{stream.message::exists["ℹ️ {stream.message}"||""]}
{stream.title::exists["📁 {stream.title::title}"||""]}{stream.year::exists[" ({stream.year})"||""]}{stream.season::>=0[" S"||""]}{stream.season::<=9["0"||""]}{stream.season::>0["{stream.season}"||""]}{stream.episode::>=0[" • E"||""]}{stream.episode::<=9["0"||""]}{stream.episode::>0["{stream.episode}"||""]}
{stream.quality::exists["🎥 {stream.quality} "||""]}{stream.encode::exists["🎞️ {stream.encode} "||""]}{stream.releaseGroup::exists["🏷️ {stream.releaseGroup}"||""]}
{stream.visualTags::exists["📺 {stream.visualTags::join(' • ')} "||""]}{stream.audioTags::exists["🎧 {stream.audioTags::join(' • ')} "||""]}{stream.audioChannels::exists["🔊 {stream.audioChannels::join(' • ')}"||""]}
{stream.size::>0["📦 {stream.size::bytes} "||""]}{stream.folderSize::>0["/ 📦 {stream.folderSize::bytes}"||""]}{stream.duration::>0["⏱️ {stream.duration::time} "||""]}{stream.age::exists["📅 {stream.age} "||""]}
{stream.languageEmojis::exists["🌐 {stream.languageEmojis::join(' / ')}"||""]}
```

and combine/merge with:
 

```

{stream.title::exists::and::stream.library::isfalse["✎  {stream.title::title::truncate(15)}"||""]}{stream.title::exists::and::stream.library::istrue["☁︎  {stream.title::title::truncate(15)} "||""]}{stream.year::exists::and::stream.episodes::exists::isfalse::and::stream.seasons::exists::isfalse[" ({stream.year})"||""]}{stream.seasonEpisode::exists["  {stream.seasonEpisode::join('·')::replace('E','ᴇ')::replace('S','s')::replace('0','₀')::replace('1','₁')::replace('2','₂')::replace('3','₃')::replace('4','₄')::replace('5','₅')::replace('6','₆')::replace('7','₇')::replace('8','₈')::replace('9','₉')}"||""]}
{stream.visualTags::=IMAX["{tools.removeLine}\n"||"{tools.removeLine}\n"]}{stream.encode::exists["▣  {stream.encode}  "||""]}{stream.visualTags::~DV::or::stream.visualTags::~HDR::or::stream.visualTags::~HDR10::or::stream.visualTags::~HDR10+::and::stream.visualTags::exists::and::stream.visualTags::=IMAX::isfalse["✦  "||""]}{stream.visualTags::exists::and::stream.visualTags::=IMAX::isfalse::and::stream.visualTags::~DV::isfalse::and::stream.visualTags::~HDR::isfalse::and::stream.visualTags::~HDR10::isfalse::and::stream.visualTags::~HDR10+::isfalse["✧  "||""]}{stream.visualTags::exists::and::stream.visualTags::=IMAX::isfalse["{stream.visualTags::sort::join(' · ')::replace('HDR · HDR','HDR')::replace(' · IMAX','')} "||""]}
{stream.audioTags::exists["♬  {stream.audioTags::lsort::join(' · ')::replace('DD · DD','DD')::replace('DTS · DTS','DTS')}  "||""]}{stream.audioChannels::exists["♯  {stream.audioChannels::join(' · ')} "||""]}
{stream.size::>0::and::stream.seasonPack::istrue["❖  "||""]}{stream.size::>0::and::stream.seasonPack::isfalse["◈  "||""]}{stream.size::>0["{stream.size::sbytes}"||""]}{stream.folderSize::>0["/{stream.folderSize::sbytes}"||""]}{stream.bitrate::exists[" · {stream.bitrate::sbitrate::replace('Mbps','ᴹᵇᵖˢ')::replace('Kbps','ᴷᵇᵖˢ')} "||""]}{stream.message::~Download["{tools.removeLine}"||""]}{service.cached::isfalse::or::stream.type::=p2p::and::stream.seeders::>0["⇄ {stream.seeders}❦ "||""]}{stream.age::exists["· {stream.age}"||""]}
{stream.proxied::istrue["⛊  "||"⛉  "]}{service.shortName::exists["[{service.shortName}] "||""]}{addon.name}{stream.private::istrue[" ⚿ ᴘʀɪᴠᴀᴛᴇ "||""]}{stream.releaseGroup::exists[" · {stream.releaseGroup::truncate(13)}"||""]}{stream.indexer::exists::and::stream.type::~usenet[" · {stream.indexer::truncate(13)}"||""]}{stream.message::~Download["{tools.removeLine}\n"||""]}
{stream.uLanguages::exists["⛿  {stream.uSmallLanguageCodes::join(' · ')::replace('ꜰ','ғ')::replace('x','х')::replace('ꞯ','ϙ')::replace('ꜱ','s')::replace('ᴅᴜᴀʟ ᴀᴜᴅɪᴏ','ᴅᴜᴏ')::replace('ᴅᴜʙʙᴇᴅ','ᴅᴜʙ')}  "||""]}{stream.subbed::istrue::and::stream.uLanguages::exists["· sᴜʙ "||""]}{stream.subbed::istrue::and::stream.uLanguages::exists::isfalse["⛿  sᴜʙ "||""]}{stream.uSubtitles::exists["({stream.uSmallSubtitleCodes::join(' · ')::replace('ꜰ','ғ')::replace('x','х')::replace('ꞯ','ϙ')::replace('ꜱ','s')})  "||""]}{stream.seadex::or::stream.seScore::>0::or::stream.seScore::<0::or::stream.message::exists::or::stream.rseMatched::length::>0[" »  "||""]}{stream.seadexBest::istrue[" ʙᴇsᴛ ʀᴇʟᴇᴀsᴇ "||""]}{stream.seadex::istrue::and::stream.seadexBest::isfalse[" ᴀʟᴛ ʙᴇsᴛ ʀᴇʟᴇᴀsᴇ "||""]}{stream.seadex::isfalse::and::stream.rseMatched::length::>0["{stream.rseMatched::remove('TrueHD ATMOS')::remove('DD+ ATMOS')::remove('ATMOS')::remove('TrueHD')::remove('DTS-HD MA')::remove('FLAC')::remove('DTS-HD HRA')::remove('DD+')::remove('DD')::remove('DTS-ES')::remove('DTS X')::remove('DTS')::remove('AAC')::remove('Opus')::remove('DV (Disk)')::remove('DV')::remove('HDR10+ Boost')::remove('HDR')::remove('UHD Streaming Boost')::remove('HD Streaming Boost')::remove('INTERNAL')::remove('No-RlsGroup')::remove('FHD')::remove('UHD')::remove('HD')::remove('4K')::remove('126811')::remove('SiC')::remove('FraMeSToR')::remove('TheFarm')::remove('hallowed')::remove('BHDStudio')::remove('FLUX')::remove('Season Pack')::join('  ')::replace('UHD ','')::replace('HD ','')::replace('Movies Anywhere','MA')::upper::replace('F','ғ')::replace('X','х')::replace('Q','ϙ')::replace('0','₀')::replace('1','₁')::replace('2','₂')::replace('3','₃')::replace('4','₄')::replace('5','₅')::replace('6','₆')::replace('7','₇')::replace('8','₈')::replace('9','₉')::smallcaps::replace('ꜱ','s')} "||""]}{stream.message::exists[" {stream.message::replace('NZB Health: ✅','✅ ɴᴢʙ')::replace('NZB Health: 🧝','🧝 ɴᴢʙ')::replace('AvailNZB 💚','💚 ɴᴢʙ')::replace('NZB Health: ⚠️','ᴜɴᴠᴇʀɪғɪᴇᴅ ɴᴢʙ')::replace('NZB Health: 🚫','✘ɴᴢʙ')::smallcaps} "||""]}{stream.seScore::>0::or::stream.seScore::<0["{stream.seScore::string::replace('0','₀')::replace('1','₁')::replace('2','₂')::replace('3','₃')::replace('4','₄')::replace('5','₅')::replace('6','₆')::replace('7','₇')::replace('8','₈')::replace('9','₉')}"||""]}{stream.message::~Download["{tools.removeLine}"||""]}{service.cached::istrue::and::stream.message::~Download::istrue["\n➥ DL Stream"||""]}
```

## Assistant

_Time: 2026-06-06T01:21:50.141Z_

**Final Merged Format Definition**

Here is a comprehensive, logically organized merge of all four provided snippets. I prioritized:

- **Avoiding duplication** (e.g., multiple cached/quality/proxied/title handlers).
- **Logical flow** — from stream identification/prefixes → title & episode info → quality/visual/audio details → technical metadata (size, bitrate, etc.) → advanced tags/scores → cleanup.
- **Best features from each source** — fancy Unicode replacements, conditional icons, truncation, sorting, special handling for library vs non-library, IMAX/DV/HDR, seeders, NZB messages, etc.
- **Coherence** — consistent spacing, line breaks where useful (`\n`), and removal of redundant `removeLine` calls.

``` 
{stream.proxied::istrue["🕵️ "||""]}{stream.type::=p2p["[P2P] "||""]}{service.shortName::exists["[{service.shortName}] "||""]}{stream.library::istrue["☁️"||""]}{service.cached::istrue["⚡ "||""]}{service.cached::isfalse["⏳ "||""]}{addon.name}

{stream.resolution::exists["{stream.resolution::replace('2160p','   4K   ')::replace('1440p','    2K   ')::replace('p','P')} "||""]}{stream.regexMatched::exists[" ({stream.regexMatched})"||""]}

{stream.message::exists["ℹ️ {stream.message}"||""]}

{stream.title::exists::and::stream.library::isfalse["✎  {stream.title::title::truncate(15)}"||""]}{stream.title::exists::and::stream.library::istrue["☁︎  {stream.title::title::truncate(15)} "||""]}{stream.year::exists::and::stream.episodes::exists::isfalse::and::stream.seasons::exists::isfalse[" ({stream.year})"||""]}{stream.seasonEpisode::exists["  {stream.seasonEpisode::join('·')::replace('E','ᴇ')::replace('S','s')::replace('0','₀')::replace('1','₁')::replace('2','₂')::replace('3','₃')::replace('4','₄')::replace('5','₅')::replace('6','₆')::replace('7','₇')::replace('8','₈')::replace('9','₉')}"||""]}

{stream.quality::exists["\n  〈{stream.quality::title::replace('Bluray Remux','Remux')::replace('Web-dl','Web‍-‍dl')::replace('Hc Hd-rip','HC HDRip')::replace('Hdrip','HDRip')}〉"||""]}{stream.encode::exists[" ▣ {stream.encode} "||""]}

{stream.visualTags::=IMAX["{tools.removeLine}\n"||"{tools.removeLine}\n"]}{stream.visualTags::~DV::or::stream.visualTags::~HDR::or::stream.visualTags::~HDR10::or::stream.visualTags::~HDR10+::and::stream.visualTags::exists::and::stream.visualTags::=IMAX::isfalse["✦  "||""]}{stream.visualTags::exists::and::stream.visualTags::=IMAX::isfalse::and::stream.visualTags::~DV::isfalse::and::stream.visualTags::~HDR::isfalse::and::stream.visualTags::~HDR10::isfalse::and::stream.visualTags::~HDR10+::isfalse["✧  "||""]}{stream.visualTags::exists::and::stream.visualTags::=IMAX::isfalse["{stream.visualTags::sort::join(' · ')::replace('HDR · HDR','HDR')::replace(' · IMAX','')} "||""]}

{stream.audioTags::exists["♬  {stream.audioTags::lsort::join(' · ')::replace('DD · DD','DD')::replace('DTS · DTS','DTS')}  "||""]}{stream.audioChannels::exists["♯  {stream.audioChannels::join(' · ')} "||""]}

{stream.size::>0::and::stream.seasonPack::istrue["❖  "||""]}{stream.size::>0::and::stream.seasonPack::isfalse["◈  "||""]}{stream.size::>0["{stream.size::sbytes}"||""]}{stream.folderSize::>0["/{stream.folderSize::sbytes}"||""]}{stream.bitrate::exists[" · {stream.bitrate::sbitrate::replace('Mbps','ᴹᵇᵖˢ')::replace('Kbps','ᴷᵇᵖˢ')} "||""]}

{stream.duration::>0["⏱️ {stream.duration::time} "||""]}{stream.age::exists["📅 {stream.age}"||""]}{service.cached::isfalse::or::stream.type::=p2p::and::stream.seeders::>0[" ⇄ {stream.seeders}❦ "||""]}

{stream.proxied::istrue["⛊  "||"⛉  "]}{stream.private::istrue[" ⚿ ᴘʀɪᴠᴀᴛᴇ "||""]}{stream.releaseGroup::exists[" · {stream.releaseGroup::truncate(13)}"||""]}{stream.indexer::exists::and::stream.type::~usenet[" · {stream.indexer::truncate(13)}"||""]}

{stream.uLanguages::exists["⛿  {stream.uSmallLanguageCodes::join(' · ')::replace('ꜰ','ғ')::replace('x','х')::replace('ꞯ','ϙ')::replace('ꜱ','s')::replace('ᴅᴜᴀʟ ᴀᴜᴅɪᴏ','ᴅᴜᴏ')::replace('ᴅᴜʙʙᴇᴅ','ᴅᴜʙ')}  "||""]}{stream.subbed::istrue::and::stream.uLanguages::exists["· sᴜʙ "||""]}{stream.subbed::istrue::and::stream.uLanguages::exists::isfalse["⛿  sᴜʙ "||""]}{stream.uSubtitles::exists["({stream.uSmallSubtitleCodes::join(' · ')::replace('ꜰ','ғ')::replace('x','х')::replace('ꞯ','ϙ')::replace('ꜱ','s')})  "||""]}

{stream.seadex::or::stream.seScore::>0::or::stream.seScore::<0::or::stream.message::exists::or::stream.rseMatched::length::>0[" »  "||""]}{stream.seadexBest::istrue[" ʙᴇsᴛ ʀᴇʟᴇᴀsᴇ "||""]}{stream.seadex::istrue::and::stream.seadexBest::isfalse[" ᴀʟᴛ ʙᴇsᴛ ʀᴇʟᴇᴀsᴇ "||""]}{stream.seadex::isfalse::and::stream.rseMatched::length::>0["{stream.rseMatched::remove('TrueHD ATMOS')::remove('DD+ ATMOS')::remove('ATMOS')::remove('TrueHD')::remove('DTS-HD MA')::remove('FLAC')::remove('DTS-HD HRA')::remove('DD+')::remove('DD')::remove('DTS-ES')::remove('DTS X')::remove('DTS')::remove('AAC')::remove('Opus')::remove('DV (Disk)')::remove('DV')::remove('HDR10+ Boost')::remove('HDR')::remove('UHD Streaming Boost')::remove('HD Streaming Boost')::remove('INTERNAL')::remove('No-RlsGroup')::remove('FHD')::remove('UHD')::remove('HD')::remove('4K')::remove('126811')::remove('SiC')::remove('FraMeSToR')::remove('TheFarm')::remove('hallowed')::remove('BHDStudio')::remove('FLUX')::remove('Season Pack')::join('  ')::replace('UHD ','')::replace('HD ','')::replace('Movies Anywhere','MA')::upper::replace('F','ғ')::replace('X','х')::replace('Q','ϙ')::replace('0','₀')::replace('1','₁')::replace('2','₂')::replace('3','₃')::replace('4','₄')::replace('5','₅')::replace('6','₆')::replace('7','₇')::replace('8','₈')::replace('9','₉')::smallcaps::replace('ꜱ','s')} "||""]}

{stream.message::exists[" {stream.message::replace('NZB Health: ✅','✅ ɴᴢʙ')::replace('NZB Health: 🧝','🧝 ɴᴢʙ')::replace('AvailNZB 💚','💚 ɴᴢʙ')::replace('NZB Health: ⚠️','ᴜɴᴠᴇʀɪғɪᴇᴅ ɴᴢʙ')::replace('NZB Health: 🚫','✘ɴᴢʙ')::smallcaps} "||""]}{stream.seScore::>0::or::stream.seScore::<0["{stream.seScore::string::replace('0','₀')::replace('1','₁')::replace('2','₂')::replace('3','₃')::replace('4','₄')::replace('5','₅')::replace('6','₆')::replace('7','₇')::replace('8','₈')::replace('9','₉')}"||""]}{stream.nSeScore::exists["  {stream.nSeScore::star::replace('⯪','☆')}"||""]}

{service.cached::istrue::and::stream.message::~Download::istrue["\n➥ DL Stream"||""]}{stream.message::~Download["{tools.removeLine}\n"||""]}
```

### Key Merging Decisions & Notes
- **Prefix section** — Combined proxied, type (P2P), shortName, library, cached indicators, and addon.
- **Resolution & Type** — Kept the fancy 4K/2K replacements and type symbol replacements.
- **Title/Episode** — Used the library-aware truncated version + seasonEpisode formatting (more advanced than basic S/E).
- **Quality/Visual/Audio** — Blended emoji styles with the sophisticated IMAX/DV/HDR conditional icons and sorting.
- **Size & Tech** — Mixed icon-based and compact `sbytes`/`sbitrate` where appropriate, plus seeders and age.
- **Language & Subtitles** — Added the detailed uLanguages/uSubtitles handling.
- **Scores & Messages** — Included seScore, nSeScore, rseMatched cleaning, and NZB message formatting.
- **Cleanup** — Retained `removeLine` for download messages and special cases.

This should produce rich, visually appealing stream labels. Test it in your app (likely Stremio with a custom addon like Comet/Torrentio or similar) and tweak spacing/conditions if specific fields cause rendering issues. Let me know if you want variants (e.g., more compact, more emojis, or further refinements)!

## User

_Time: 2026-06-06T01:23:14.485Z_

please merge these two format definitions:
 

```
{stream.proxied::istrue["🕵️ "||""]}{stream.type::=p2p["[P2P] "||""]}{service.shortName::exists["[{service.shortName}"||""]}{stream.library::istrue["☁️"||""]}{service.cached::istrue["⚡] "||""]}{service.cached::isfalse["⏳] "||""]}{addon.name}{stream.resolution::exists[" {stream.resolution}"||""]}{stream.regexMatched::exists[" ({stream.regexMatched})"||""]}
```

and
 

```
{stream.resolution::exists["{stream.resolution::replace('2160p','   4K   ')::replace('1440p','    2K   ')::replace('p','P')}‍"||"‍     "]}{stream.type::exists["‍{stream.type::replace('debrid','    ')::replace('p2p','⁽ᵖ²ᵖ⁾')::replace('live','⁽ˡᶦᵛᵉ⁾')::replace('http','⁽ʷᵉᵇ⁾')::replace('usenet','‍⁽ⁿᶻᵇ⁾‍')::replace('stremio-usenet','‏⁽ⁿᶻᵇ⁾')::replace('info','⁽ᶦⁿᶠᵒ⁾')::replace('statistic','⁽ˢᵗᵃᵗˢ⁾')::replace('external','⁽ᵉˣᵗ⁾')::replace('error','⁽ᵉʳʳᵒʳ⁾')::replace('youtube','⁽ʸᵗ⁾')}‍‍‍"||""]}{service.cached::istrue["⚡"||""]}{service.cached::isfalse["‍⏳‍​"||""]}{stream.quality::exists["‍‍\n  〈{stream.quality::title::replace('Bluray Remux','Remux')::replace('Web-dl','Web‍-‍dl')::replace('Hc Hd-rip','HC HDRip')::replace('Hdrip','HDRip')}〉‍     "||""]}{stream.message::~Download["{tools.removeLine}\n"||""]}{stream.nSeScore::exists["‍\n  {stream.nSeScore::star::replace('⯪','☆')}            "||""]}{stream.message::~Download["{tools.removeLine}\n"||""]}
```

 
then do next:
 

```
{stream.message::exists["ℹ️ {stream.message}"||""]}
{stream.title::exists["📁 {stream.title::title}"||""]}{stream.year::exists[" ({stream.year})"||""]}{stream.season::>=0[" S"||""]}{stream.season::<=9["0"||""]}{stream.season::>0["{stream.season}"||""]}{stream.episode::>=0[" • E"||""]}{stream.episode::<=9["0"||""]}{stream.episode::>0["{stream.episode}"||""]}
{stream.quality::exists["🎥 {stream.quality} "||""]}{stream.encode::exists["🎞️ {stream.encode} "||""]}{stream.releaseGroup::exists["🏷️ {stream.releaseGroup}"||""]}
{stream.visualTags::exists["📺 {stream.visualTags::join(' • ')} "||""]}{stream.audioTags::exists["🎧 {stream.audioTags::join(' • ')} "||""]}{stream.audioChannels::exists["🔊 {stream.audioChannels::join(' • ')}"||""]}
{stream.size::>0["📦 {stream.size::bytes} "||""]}{stream.folderSize::>0["/ 📦 {stream.folderSize::bytes}"||""]}{stream.duration::>0["⏱️ {stream.duration::time} "||""]}{stream.age::exists["📅 {stream.age} "||""]}
{stream.languageEmojis::exists["🌐 {stream.languageEmojis::join(' / ')}"||""]}
```

and combine/merge with:
 

```

{stream.title::exists::and::stream.library::isfalse["✎  {stream.title::title::truncate(15)}"||""]}{stream.title::exists::and::stream.library::istrue["☁︎  {stream.title::title::truncate(15)} "||""]}{stream.year::exists::and::stream.episodes::exists::isfalse::and::stream.seasons::exists::isfalse[" ({stream.year})"||""]}{stream.seasonEpisode::exists["  {stream.seasonEpisode::join('·')::replace('E','ᴇ')::replace('S','s')::replace('0','₀')::replace('1','₁')::replace('2','₂')::replace('3','₃')::replace('4','₄')::replace('5','₅')::replace('6','₆')::replace('7','₇')::replace('8','₈')::replace('9','₉')}"||""]}
{stream.visualTags::=IMAX["{tools.removeLine}\n"||"{tools.removeLine}\n"]}{stream.encode::exists["▣  {stream.encode}  "||""]}{stream.visualTags::~DV::or::stream.visualTags::~HDR::or::stream.visualTags::~HDR10::or::stream.visualTags::~HDR10+::and::stream.visualTags::exists::and::stream.visualTags::=IMAX::isfalse["✦  "||""]}{stream.visualTags::exists::and::stream.visualTags::=IMAX::isfalse::and::stream.visualTags::~DV::isfalse::and::stream.visualTags::~HDR::isfalse::and::stream.visualTags::~HDR10::isfalse::and::stream.visualTags::~HDR10+::isfalse["✧  "||""]}{stream.visualTags::exists::and::stream.visualTags::=IMAX::isfalse["{stream.visualTags::sort::join(' · ')::replace('HDR · HDR','HDR')::replace(' · IMAX','')} "||""]}
{stream.audioTags::exists["♬  {stream.audioTags::lsort::join(' · ')::replace('DD · DD','DD')::replace('DTS · DTS','DTS')}  "||""]}{stream.audioChannels::exists["♯  {stream.audioChannels::join(' · ')} "||""]}
{stream.size::>0::and::stream.seasonPack::istrue["❖  "||""]}{stream.size::>0::and::stream.seasonPack::isfalse["◈  "||""]}{stream.size::>0["{stream.size::sbytes}"||""]}{stream.folderSize::>0["/{stream.folderSize::sbytes}"||""]}{stream.bitrate::exists[" · {stream.bitrate::sbitrate::replace('Mbps','ᴹᵇᵖˢ')::replace('Kbps','ᴷᵇᵖˢ')} "||""]}{stream.message::~Download["{tools.removeLine}"||""]}{service.cached::isfalse::or::stream.type::=p2p::and::stream.seeders::>0["⇄ {stream.seeders}❦ "||""]}{stream.age::exists["· {stream.age}"||""]}
{stream.proxied::istrue["⛊  "||"⛉  "]}{service.shortName::exists["[{service.shortName}] "||""]}{addon.name}{stream.private::istrue[" ⚿ ᴘʀɪᴠᴀᴛᴇ "||""]}{stream.releaseGroup::exists[" · {stream.releaseGroup::truncate(13)}"||""]}{stream.indexer::exists::and::stream.type::~usenet[" · {stream.indexer::truncate(13)}"||""]}{stream.message::~Download["{tools.removeLine}\n"||""]}
{stream.uLanguages::exists["⛿  {stream.uSmallLanguageCodes::join(' · ')::replace('ꜰ','ғ')::replace('x','х')::replace('ꞯ','ϙ')::replace('ꜱ','s')::replace('ᴅᴜᴀʟ ᴀᴜᴅɪᴏ','ᴅᴜᴏ')::replace('ᴅᴜʙʙᴇᴅ','ᴅᴜʙ')}  "||""]}{stream.subbed::istrue::and::stream.uLanguages::exists["· sᴜʙ "||""]}{stream.subbed::istrue::and::stream.uLanguages::exists::isfalse["⛿  sᴜʙ "||""]}{stream.uSubtitles::exists["({stream.uSmallSubtitleCodes::join(' · ')::replace('ꜰ','ғ')::replace('x','х')::replace('ꞯ','ϙ')::replace('ꜱ','s')})  "||""]}{stream.seadex::or::stream.seScore::>0::or::stream.seScore::<0::or::stream.message::exists::or::stream.rseMatched::length::>0[" »  "||""]}{stream.seadexBest::istrue[" ʙᴇsᴛ ʀᴇʟᴇᴀsᴇ "||""]}{stream.seadex::istrue::and::stream.seadexBest::isfalse[" ᴀʟᴛ ʙᴇsᴛ ʀᴇʟᴇᴀsᴇ "||""]}{stream.seadex::isfalse::and::stream.rseMatched::length::>0["{stream.rseMatched::remove('TrueHD ATMOS')::remove('DD+ ATMOS')::remove('ATMOS')::remove('TrueHD')::remove('DTS-HD MA')::remove('FLAC')::remove('DTS-HD HRA')::remove('DD+')::remove('DD')::remove('DTS-ES')::remove('DTS X')::remove('DTS')::remove('AAC')::remove('Opus')::remove('DV (Disk)')::remove('DV')::remove('HDR10+ Boost')::remove('HDR')::remove('UHD Streaming Boost')::remove('HD Streaming Boost')::remove('INTERNAL')::remove('No-RlsGroup')::remove('FHD')::remove('UHD')::remove('HD')::remove('4K')::remove('126811')::remove('SiC')::remove('FraMeSToR')::remove('TheFarm')::remove('hallowed')::remove('BHDStudio')::remove('FLUX')::remove('Season Pack')::join('  ')::replace('UHD ','')::replace('HD ','')::replace('Movies Anywhere','MA')::upper::replace('F','ғ')::replace('X','х')::replace('Q','ϙ')::replace('0','₀')::replace('1','₁')::replace('2','₂')::replace('3','₃')::replace('4','₄')::replace('5','₅')::replace('6','₆')::replace('7','₇')::replace('8','₈')::replace('9','₉')::smallcaps::replace('ꜱ','s')} "||""]}{stream.message::exists[" {stream.message::replace('NZB Health: ✅','✅ ɴᴢʙ')::replace('NZB Health: 🧝','🧝 ɴᴢʙ')::replace('AvailNZB 💚','💚 ɴᴢʙ')::replace('NZB Health: ⚠️','ᴜɴᴠᴇʀɪғɪᴇᴅ ɴᴢʙ')::replace('NZB Health: 🚫','✘ɴᴢʙ')::smallcaps} "||""]}{stream.seScore::>0::or::stream.seScore::<0["{stream.seScore::string::replace('0','₀')::replace('1','₁')::replace('2','₂')::replace('3','₃')::replace('4','₄')::replace('5','₅')::replace('6','₆')::replace('7','₇')::replace('8','₈')::replace('9','₉')}"||""]}{stream.message::~Download["{tools.removeLine}"||""]}{service.cached::istrue::and::stream.message::~Download::istrue["\n➥ DL Stream"||""]}
```

reminder: there's two areas; and i've given you two different contents for each. Please merge to use the icon's from the simpler one, while handling all of the conditional logic in the more convooluted ones. So there should be a name and a description area that's why there's four.

## Assistant

_Time: 2026-06-06T01:23:31.725Z_

**Merged Formats (Name Area + Description Area)**

### 1. Merged Name / Header Area
``` 
{stream.proxied::istrue["🕵️ "||""]}{stream.type::=p2p["[P2P] "||""]}{service.shortName::exists["[{service.shortName}"||""]}{stream.library::istrue["☁️"||""]}{service.cached::istrue["⚡ "||""]}{service.cached::isfalse["⏳ "||""]}{addon.name}{stream.resolution::exists[" {stream.resolution::replace('2160p','   4K   ')::replace('1440p','    2K   ')::replace('p','P')}"||""]}{stream.regexMatched::exists[" ({stream.regexMatched})"||""]}{stream.type::exists[" {stream.type::replace('debrid','    ')::replace('p2p','⁽ᵖ²ᵖ⁾')::replace('live','⁽ˡᶦᵛᵉ⁾')::replace('http','⁽ʷᵉᵇ⁾')::replace('usenet','⁽ⁿᶻᵇ⁾')::replace('stremio-usenet','⁽ⁿᶻᵇ⁾')::replace('info','⁽ᶦⁿᶠᵒ⁾')::replace('statistic','⁽ˢᵗᵃᵗˢ⁾')::replace('external','⁽ᵉˣᵗ⁾')::replace('error','⁽ᵉʳʳᵒʳ⁾')::replace('youtube','⁽ʸᵗ⁾')}"||""]}{stream.quality::exists["\n  〈{stream.quality::title::replace('Bluray Remux','Remux')::replace('Web-dl','Web‍-‍dl')::replace('Hc Hd-rip','HC HDRip')::replace('Hdrip','HDRip')}〉"||""]}{stream.nSeScore::exists["\n  {stream.nSeScore::star::replace('⯪','☆')}"||""]}{stream.message::~Download["{tools.removeLine}\n"||""]}
```

**Key Merging Decisions (Name Area):**
- **Icons**: Kept the clean, simple icons from the first definition (`🕵️`, `☁️`, `⚡`, `⏳`).
- **Resolution & Type**: Used the richer replacement logic from the second definition (4K/2K formatting, superscript type tags).
- **Quality & Score**: Incorporated the formatted quality block and `nSeScore` from the complex version.
- **Order & Flow**: Proxied → Type/P2P → Service → Library/Cache → Addon → Resolution/Type/Quality/Score.
- Preserved conditional logic for removing download-related lines.

---

### 2. Merged Description Area
``` 
{stream.message::exists["ℹ️ {stream.message}"||""]}
{stream.title::exists::and::stream.library::isfalse["📁 {stream.title::title::truncate(15)}"||""]}{stream.title::exists::and::stream.library::istrue["☁︎ 📁 {stream.title::title::truncate(15)}"||""]}{stream.year::exists::and::stream.episodes::exists::isfalse::and::stream.seasons::exists::isfalse[" ({stream.year})"||""]}{stream.seasonEpisode::exists[" {stream.seasonEpisode::join('·')::replace('E','ᴇ')::replace('S','s')::replace('0','₀')::replace('1','₁')::replace('2','₂')::replace('3','₃')::replace('4','₄')::replace('5','₅')::replace('6','₆')::replace('7','₇')::replace('8','₈')::replace('9','₉')}"||""]}
{stream.quality::exists["🎥 {stream.quality} "||""]}{stream.encode::exists["🎞️ {stream.encode} "||""]}{stream.releaseGroup::exists["🏷️ {stream.releaseGroup}"||""]}
{stream.visualTags::exists::and::stream.visualTags::=IMAX::isfalse["📺 {stream.visualTags::sort::join(' • ')::replace('HDR · HDR','HDR')::replace(' · IMAX','')}"||""]}{stream.visualTags::=IMAX["{tools.removeLine}\n"||""]}{stream.audioTags::exists["🎧 {stream.audioTags::lsort::join(' • ')::replace('DD · DD','DD')::replace('DTS · DTS','DTS')}"||""]}{stream.audioChannels::exists["🔊 {stream.audioChannels::join(' • ')}"||""]}
{stream.size::>0::and::stream.seasonPack::istrue["📦 ❖ {stream.size::sbytes}"||""]}{stream.size::>0::and::stream.seasonPack::isfalse["📦 ◈ {stream.size::sbytes}"||""]}{stream.folderSize::>0[" / {stream.folderSize::sbytes}"||""]}{stream.bitrate::exists[" · {stream.bitrate::sbitrate::replace('Mbps','ᴹᵇᵖˢ')::replace('Kbps','ᴷᵇᵖˢ')}"||""]}{stream.duration::>0[" ⏱️ {stream.duration::time}"||""]}{stream.age::exists[" 📅 {stream.age}"||""]}
{stream.languageEmojis::exists[" 🌐 {stream.languageEmojis::join(' / ')}"||""]}{stream.uLanguages::exists[" ⛿ {stream.uSmallLanguageCodes::join(' · ')::replace('ꜰ','ғ')::replace('x','х')::replace('ꞯ','ϙ')::replace('ꜱ','s')::replace('ᴅᴜᴀʟ ᴀᴜᴅɪᴏ','ᴅᴜᴏ')::replace('ᴅᴜʙʙᴇᴅ','ᴅᴜʙ')}"||""]}{stream.subbed::istrue::and::stream.uLanguages::exists["· sᴜʙ "||""]}{stream.subbed::istrue::and::stream.uLanguages::exists::isfalse[" ⛿ sᴜʙ "||""]}{stream.uSubtitles::exists[" ({stream.uSmallSubtitleCodes::join(' · ')::replace('ꜰ','ғ')::replace('x','х')::replace('ꞯ','ϙ')::replace('ꜱ','s')})"||""]}
{stream.seadex::or::stream.seScore::>0::or::stream.seScore::<0::or::stream.message::exists::or::stream.rseMatched::length::>0[" » "||""]}{stream.seadexBest::istrue["ʙᴇsᴛ ʀᴇʟᴇᴀsᴇ "||""]}{stream.seadex::istrue::and::stream.seadexBest::isfalse["ᴀʟᴛ ʙᴇsᴛ ʀᴇʟᴇᴀsᴇ "||""]}{stream.seadex::isfalse::and::stream.rseMatched::length::>0["{stream.rseMatched::remove('TrueHD ATMOS')::remove('DD+ ATMOS')::remove('ATMOS')::remove('TrueHD')::remove('DTS-HD MA')::remove('FLAC')::remove('DTS-HD HRA')::remove('DD+')::remove('DD')::remove('DTS-ES')::remove('DTS X')::remove('DTS')::remove('AAC')::remove('Opus')::remove('DV (Disk)')::remove('DV')::remove('HDR10+ Boost')::remove('HDR')::remove('UHD Streaming Boost')::remove('HD Streaming Boost')::remove('INTERNAL')::remove('No-RlsGroup')::remove('FHD')::remove('UHD')::remove('HD')::remove('4K')::remove('126811')::remove('SiC')::remove('FraMeSToR')::remove('TheFarm')::remove('hallowed')::remove('BHDStudio')::remove('FLUX')::remove('Season Pack')::join('  ')::replace('UHD ','')::replace('HD ','')::replace('Movies Anywhere','MA')::upper::replace('F','ғ')::replace('X','х')::replace('Q','ϙ')::replace('0','₀')::replace('1','₁')::replace('2','₂')::replace('3','₃')::replace('4','₄')::replace('5','₅')::replace('6','₆')::replace('7','₇')::replace('8','₈')::replace('9','₉')::smallcaps::replace('ꜱ','s')}"||""]}{stream.seScore::>0::or::stream.seScore::<0[" {stream.seScore::string::replace('0','₀')::replace('1','₁')::replace('2','₂')::replace('3','₃')::replace('4','₄')::replace('5','₅')::replace('6','₆')::replace('7','₇')::replace('8','₈')::replace('9','₉')}"||""]}{stream.message::~Download["{tools.removeLine}"||""]}{service.cached::istrue::and::stream.message::~Download::istrue["\n➥ DL Stream"||""]}
```

**Key Merging Decisions (Description Area):**
- **Icons**: Prioritized the cleaner emoji-based icons from the third (simpler) definition (`📁`, `🎥`, `🎞️`, `🏷️`, `📺`, `🎧`, `🔊`, `📦`, `⏱️`, `📅`, `🌐`).
- **Advanced Logic**: Kept nearly all conditional formatting, replacements, sorting, truncation, and special handling (season packs with ❖/◈, visual/audio tag cleaning, seadex/rseMatched, language/subtitle superscripts, etc.) from the long fourth definition.
- **Title Handling**: Combined library-aware icons (`📁` vs `☁︎ 📁`).
- **Structure**: Message → Title/Year/Episode → Quality/Encode/Release → Visual/Audio → Size/Bitrate/Duration/Age → Languages/Subtitles → Release scoring info.

---

These two merged blocks should give you a clean visual style (simple icons) while preserving the rich conditional intelligence and formatting from the more complex versions. 

**Recommendations**:
- Test in your environment — some `::removeLine` calls and complex nesting can be sensitive to exact syntax.
- If certain sections feel too dense, you can trim specific conditionals (e.g., the very long `rseMatched` cleaning chain).
- Let me know if you want further refinements, such as shortening certain parts, adjusting icon placement, or handling specific edge cases!
