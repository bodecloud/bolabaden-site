---
source_url: "https://grok.com/c/dbfe3aab-629c-4532-9a2c-b40c10136b72"
conversation_id: "dbfe3aab-629c-4532-9a2c-b40c10136b72"
title: "iOS LZMA BIFs extraction challenges"
extracted_at: "2026-06-29T16:09:12.358Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# iOS LZMA BIFs extraction challenges

Source: [Grok conversation](https://grok.com/c/dbfe3aab-629c-4532-9a2c-b40c10136b72)

## User

_Time: 2026-05-13T21:33:50.525Z_

```
So in pc/xbox they use BIFs
Not sure what android uses
but iOS uses a fully new format i've not seen before. LZMA compressed BIFs
afaik i'm the only one that has a way to extract the resources out of it
see ERF Editor in v4 of the toolset
hmm that won't work well... i may need to fix the bif/bzf stuff in the toolset but it'll work in pykotor's cli assuming i didn't break that again
basically the visual editor forgets to open chitin.key 😂
while it's not required to extract the BIFs it's impossible to know the names of the resources embedded in the BIF/BZF without it
want to hop in voice i may be able to explain better there
https://github.com/openkotor/pykotor/wiki/Container-Formats#bzf-compression
```

please rephrase/condense/make concise for readability without losing information

## Assistant

_Time: 2026-05-13T21:34:10.301Z_

**Here's a clean, concise rephrased version** of your message (all original details preserved, just better organized and easier to read):

---

On PC and Xbox they use standard BIFs.  
Not sure what Android uses, but iOS uses a brand-new format I’ve never seen before: LZMA-compressed BIFs.

As far as I know, I’m currently the only one who can extract resources from it (see the ERF Editor in v4 of the toolset).

The visual editor won’t work well right now because it forgets to open `chitin.key` 😂 — I may need to fix the BIF/BZF handling in the toolset.  
It should still work fine via pyKOTOR’s CLI (assuming I didn’t break it again).

**Important note:**  
While `chitin.key` isn’t required to extract the BIFs themselves, it’s impossible to know the actual names of the resources embedded inside the BIF/BZF files without it.

Want to hop in voice? I can probably explain it better there.

More details on BZF compression:  
https://github.com/openkotor/pykotor/wiki/Container-Formats#bzf-compression

---

Let me know if you’d like any tweaks!
