---
source_url: "https://grok.com/c/d5213f56-279d-4859-a851-8c63813379d2"
conversation_id: "d5213f56-279d-4859-a851-8c63813379d2"
title: "KOTOR Japanese/Korean Localizations and PC Font Limits"
extracted_at: "2026-06-29T16:37:31.024Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# KOTOR Japanese/Korean Localizations and PC Font Limits

Source: [Grok conversation](https://grok.com/c/d5213f56-279d-4859-a851-8c63813379d2)

## User

_Time: 2026-05-13T21:58:28.152Z_

please rephrase/summarize/condense the information into one intuitive message containing the information to make more accessible and public. These are one on one dms that i want to copy and paste the information into a group DM without making it obvious that these were originally one on one dms:
 

```
Vriff
Vriff [PC98],  — 4:45 PM
I've checked all the kotor 2 game engines except for jp, kr, and Asian versions
PuritanWizard
 [BIRB],  — 4:45 PM
THERE'S A JAPANESE VERSION?
Vriff
Vriff [PC98],  — 4:45 PM
Hoping there were symbols, or anything else included
PuritanWizard
 [BIRB],  — 4:45 PM
i spent weeks on that
there's no way
 [PC98], 
Vriff
Vriff [PC98],  — 4:46 PM
Yes
PuritanWizard
 [BIRB],  — 4:46 PM
the game only works with SBCS encodings 😂
whatttt
you madlad
where can i find that
Vriff
Vriff [PC98],  — 4:46 PM
There's japanese, Korean, and Other Asian versions
Image
PuritanWizard
 [BIRB],  — 4:47 PM
oh man if you knew how hard i worked on the ridiculous 256-character font bitmap limitation you'd understand my pain
please send a link or explain how to find when you have a chance

(earliest convenience)

would be appreciated
Vriff
Vriff [PC98],  — 4:48 PM
Image
It's never been dumped and uploaded to the internet before that I can find, I should be the first.
PuritanWizard
 [BIRB],  — 4:49 PM
What lane sent me last:
I did a brief look this evening. What you refer to as TXIFontInformation is essentially what the Engine refers to as CAurFontInfo (C++ Class Aurora Font Information).

These are the fields that this structure parses in when its initialized (notably missing isdoublebyte and dbmapping):
void __thiscall CAurFontInfo::ParseField(CAurFontInfo *this,char *data)

{
    char *fieldName;
    int isMatch;
    
    fieldName = firstword(data);
    isMatch = __stricmp("numchars",fieldName);
    if (isMatch == 0) {
        Parse(data + 8,&this->numchars);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("fontheight",fieldName);
    if (isMatch == 0) {
        Parse(data + 10,(float)&this->fontheight);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("baselineheight",fieldName);
    if (isMatch == 0) {
        Parse(data + 0xe,(float)&this->baselineheight);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("texturewidth",fieldName);
    if (isMatch == 0) {
        Parse(data + 0xc,(float)&this->texturewidth);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("spacingR",fieldName);
    if (isMatch == 0) {
        Parse(data + 8,(float)&this->spacingR);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("spacingB",fieldName);
    if (isMatch == 0) {
        Parse(data + 8,(float)&this->spacingB);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("upperleftcoords",fieldName);
    if (isMatch == 0) {
        Parse<Vector>(data + 0xf,&this->upperleftcoords);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("lowerrightcoords",fieldName);
    if (isMatch == 0) {
        Parse<Vector>(data + 0x10,&this->lowerrightcoords);
    }
    return;
}

Looking at the data structure I've reversed, I don't think they even instantiate those fields (see image attached).

I also did a string search for both of those fields, and got no results in K1 GoG, K1 Mac, K2 Gog, or K1 Xbox. So, I'm thinking that, as you mentioned may be possible, that kotor does not implement them at all. 

If I were to guess the Aurora code from this era likely kept Multi-byte character processing code behind preprocessor directives, that would've excluded it from compilation. I've seen similar things like this before, such as with various debug strings that never get utilized, or the entire NSS Compiler class that is entirely unimplemented. 

It does look like the import table still includes a few kernel functions for multi-byte characters, but nothing more.

So probably a bust, though I'm gonna double check on a few TXI parsing details to make sure I didn't miss anything.
Image
Vriff
Vriff [PC98],  — 4:49 PM
I've talked to a guy in Korea about buying his Kr version but he wants $300
PuritanWizard
 [BIRB],  — 4:50 PM
nah fuck that i'm going to check bittorrent
fuck that idiot
excuse the language
🙄
⁠OpenKotOR⁠🩹kotor-patch-manager we probably should bring this idea here since it's so good. I have no way to contact Leilukin but that is a project she'd be interested in
hmm i can't remember their pronouns oops
Vriff
Vriff [PC98],  — 4:51 PM
https://www.thefamicast.com/2022/01/japanese-localization-added-to-star.html?m=1
TheFamicast.com: Japan-based Nintendo Podcasts, Videos & Reviews!
Japanese Localization Added to Star Wars KOTOR in Latest Patch
Video game website based in Japan covering all things Nintendo! Fun podcasts, videos, and features abound. Please to enjoy!
Image
Image
Looks like it's been officially released for the switch as well
PuritanWizard
 [BIRB],  — 4:52 PM
so the reason this is interesting is we thought it was impossible to support DBCS or any sort of unicode without extensive codecaving and memory patching.
But theoretically...
 [BIRB], 
PuritanWizard
 [BIRB],  — 4:53 PM
couldn't we copy some of the asm from one of the japanese/korean/etc where it does all the font bitmap handling and use that in kotor-patch-manager to support more languages?
Vriff
Vriff [PC98],  — 4:53 PM
Not quite, xbox is a different architecture
PuritanWizard
 [BIRB],  — 4:53 PM
i'm guessing it wouldn't be that easy but
huh??? are you saying ONLY xbox has the korean/japanese localizations?
uhh i may have jumped the gun
shit
😂
Vriff
Vriff [PC98],  — 4:54 PM
I am not sure if PC got a release with it, what I have is the japanese xbox version
PuritanWizard
 [BIRB],  — 4:54 PM
How the PC versions of the game work is they load .tpc/.tga files representing the A-Z1-9 etc in the codepages. Like there's a texture for every single character
The kicker: there's only 256 supported
That means any double-byte or multi-byte code pages have zero way to be supported
I'm GUESSING xbox doesn't do that pipeline
probably some built-in way of rendering text in games or some sort of api call they can make that pc can't
Sorry to derail whatever we were talking about so thoroughly. I think we were talking about self-hosting nextcloud privately so we can all access the assets within the game
I could hand out root access to that server the ghidra runs on. I've already given it to lane.

if groups worked more optimally on linux i'd just go that route. It's annoying how stuff like certs etc can't be group-owned :/
```

## Assistant

_Time: 2026-05-13T21:58:35.910Z_

**Hey group, quick summary on KOTOR font/localization stuff we've been digging into:**

I’ve been looking into non-English versions of KOTOR (especially K2) and checked most game engines, including Japanese, Korean, and other Asian releases. Turns out there **are** official Japanese (and Korean) versions — including a recent official Japanese localization patch that even came to Switch.

The big limitation on PC has always been the font system: it loads small texture files (.tpc/.tga) for characters with a hard 256-character cap (SBCS only). That’s why proper DBCS / multi-byte / Unicode support seemed basically impossible without heavy patching.

However, the Japanese and Korean versions appear to handle fonts differently (especially on Xbox, which uses a different architecture). I’ve been looking at the font structures (CAurFontInfo / TXI parsing) and it looks like the original Aurora engine had some multi-byte code that just got stripped out or disabled via preprocessor stuff on the PC builds.

**Cool possibility:** We might be able to pull some of the font bitmap / rendering ASM or logic from those Asian versions and adapt it into the **kotor-patch-manager** (or OpenKotOR) to add better language support without needing full codecaves everywhere. It’s not trivial, especially since Xbox ≠ PC, but it feels more doable than we originally thought.

I haven’t found any public dumps of the JP/KR PC assets yet (might be first if we get them). Also chatted with someone who has the Korean physical version but they’re asking way too much for it.

This seems like something the broader modding team (Leilukin, etc.) would be interested in. Worth discussing in the patch manager channel?

Let me know your thoughts — happy to share the technical details, links, or the article about the official Japanese Switch patch if anyone wants them.

## User

_Time: 2026-05-13T21:59:14.407Z_

please rephrase/summarize/condense the information into one intuitive message containing the information to make more accessible and public. These are one on one dms that i want to copy and paste the information into a group DM without making it obvious that these were originally one on one dms:
 

```
Vriff
Vriff [PC98],  — 4:45 PM
I've checked all the kotor 2 game engines except for jp, kr, and Asian versions
PuritanWizard
 [BIRB],  — 4:45 PM
THERE'S A JAPANESE VERSION?
Vriff
Vriff [PC98],  — 4:45 PM
Hoping there were symbols, or anything else included
PuritanWizard
 [BIRB],  — 4:45 PM
i spent weeks on that
there's no way
 [PC98], 
Vriff
Vriff [PC98],  — 4:46 PM
Yes
PuritanWizard
 [BIRB],  — 4:46 PM
the game only works with SBCS encodings 😂
whatttt
you madlad
where can i find that
Vriff
Vriff [PC98],  — 4:46 PM
There's japanese, Korean, and Other Asian versions
Image
PuritanWizard
 [BIRB],  — 4:47 PM
oh man if you knew how hard i worked on the ridiculous 256-character font bitmap limitation you'd understand my pain
please send a link or explain how to find when you have a chance

(earliest convenience)

would be appreciated
Vriff
Vriff [PC98],  — 4:48 PM
Image
It's never been dumped and uploaded to the internet before that I can find, I should be the first.
PuritanWizard
 [BIRB],  — 4:49 PM
What lane sent me last:
I did a brief look this evening. What you refer to as TXIFontInformation is essentially what the Engine refers to as CAurFontInfo (C++ Class Aurora Font Information).

These are the fields that this structure parses in when its initialized (notably missing isdoublebyte and dbmapping):
void __thiscall CAurFontInfo::ParseField(CAurFontInfo *this,char *data)

{
    char *fieldName;
    int isMatch;
    
    fieldName = firstword(data);
    isMatch = __stricmp("numchars",fieldName);
    if (isMatch == 0) {
        Parse(data + 8,&this->numchars);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("fontheight",fieldName);
    if (isMatch == 0) {
        Parse(data + 10,(float)&this->fontheight);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("baselineheight",fieldName);
    if (isMatch == 0) {
        Parse(data + 0xe,(float)&this->baselineheight);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("texturewidth",fieldName);
    if (isMatch == 0) {
        Parse(data + 0xc,(float)&this->texturewidth);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("spacingR",fieldName);
    if (isMatch == 0) {
        Parse(data + 8,(float)&this->spacingR);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("spacingB",fieldName);
    if (isMatch == 0) {
        Parse(data + 8,(float)&this->spacingB);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("upperleftcoords",fieldName);
    if (isMatch == 0) {
        Parse<Vector>(data + 0xf,&this->upperleftcoords);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("lowerrightcoords",fieldName);
    if (isMatch == 0) {
        Parse<Vector>(data + 0x10,&this->lowerrightcoords);
    }
    return;
}

Looking at the data structure I've reversed, I don't think they even instantiate those fields (see image attached).

I also did a string search for both of those fields, and got no results in K1 GoG, K1 Mac, K2 Gog, or K1 Xbox. So, I'm thinking that, as you mentioned may be possible, that kotor does not implement them at all. 

If I were to guess the Aurora code from this era likely kept Multi-byte character processing code behind preprocessor directives, that would've excluded it from compilation. I've seen similar things like this before, such as with various debug strings that never get utilized, or the entire NSS Compiler class that is entirely unimplemented. 

It does look like the import table still includes a few kernel functions for multi-byte characters, but nothing more.

So probably a bust, though I'm gonna double check on a few TXI parsing details to make sure I didn't miss anything.
Image
Vriff
Vriff [PC98],  — 4:49 PM
I've talked to a guy in Korea about buying his Kr version but he wants $300
PuritanWizard
 [BIRB],  — 4:50 PM
nah fuck that i'm going to check bittorrent
fuck that idiot
excuse the language
🙄
⁠OpenKotOR⁠🩹kotor-patch-manager we probably should bring this idea here since it's so good. I have no way to contact Leilukin but that is a project she'd be interested in
hmm i can't remember their pronouns oops
Vriff
Vriff [PC98],  — 4:51 PM
https://www.thefamicast.com/2022/01/japanese-localization-added-to-star.html?m=1
TheFamicast.com: Japan-based Nintendo Podcasts, Videos & Reviews!
Japanese Localization Added to Star Wars KOTOR in Latest Patch
Video game website based in Japan covering all things Nintendo! Fun podcasts, videos, and features abound. Please to enjoy!
Image
Image
Looks like it's been officially released for the switch as well
PuritanWizard
 [BIRB],  — 4:52 PM
so the reason this is interesting is we thought it was impossible to support DBCS or any sort of unicode without extensive codecaving and memory patching.
But theoretically...
 [BIRB], 
PuritanWizard
 [BIRB],  — 4:53 PM
couldn't we copy some of the asm from one of the japanese/korean/etc where it does all the font bitmap handling and use that in kotor-patch-manager to support more languages?
Vriff
Vriff [PC98],  — 4:53 PM
Not quite, xbox is a different architecture
PuritanWizard
 [BIRB],  — 4:53 PM
i'm guessing it wouldn't be that easy but
huh??? are you saying ONLY xbox has the korean/japanese localizations?
uhh i may have jumped the gun
shit
😂
Vriff
Vriff [PC98],  — 4:54 PM
I am not sure if PC got a release with it, what I have is the japanese xbox version
PuritanWizard
 [BIRB],  — 4:54 PM
How the PC versions of the game work is they load .tpc/.tga files representing the A-Z1-9 etc in the codepages. Like there's a texture for every single character
The kicker: there's only 256 supported
That means any double-byte or multi-byte code pages have zero way to be supported
I'm GUESSING xbox doesn't do that pipeline
probably some built-in way of rendering text in games or some sort of api call they can make that pc can't
Sorry to derail whatever we were talking about so thoroughly. I think we were talking about self-hosting nextcloud privately so we can all access the assets within the game
I could hand out root access to that server the ghidra runs on. I've already given it to lane.

if groups worked more optimally on linux i'd just go that route. It's annoying how stuff like certs etc can't be group-owned :/
```

Focus on relaying wizard's plan/information, you may mention Vriff by name if you must

## Assistant

_Time: 2026-05-13T21:59:22.041Z_

**Hey group, quick update on KOTOR 2 localization/font stuff:**

Vriff has been digging into non-English versions of the game (Japanese, Korean, and other Asian releases). He found that Japanese and Korean versions exist — including a Japanese Xbox version that hasn't been dumped online yet (he's likely the first to have it).

The big discovery: we always thought full DBCS / multi-byte character support was impossible on PC without heavy patching because the game uses single-byte 256-character font textures (.tpc/.tga files) for everything. But the localized console versions apparently handle fonts and text rendering differently.

**My takeaway / idea for us:**
We could potentially pull the relevant font bitmap and text handling ASM/code from the Japanese/Korean versions and adapt it via **kotor-patch-manager** (or OpenKotOR) to add proper multi-language support without being limited to 256 characters. It probably won't be simple, but it's way more feasible than we originally thought.

Vriff also shared some solid reverse-engineering details on how the engine loads font info (CAurFontInfo struct, missing double-byte fields, etc.), confirming that PC builds basically stripped out the multi-byte stuff.

This seems like something Leilukin and the OpenKotOR crew would be really interested in. If anyone has leads on PC versions of the JP/KR releases (or wants to help hunt them), that’d be huge.

Let me know your thoughts — this could open the door to much better modding/localization options!

## User

_Time: 2026-05-13T21:59:27.907Z_

please rephrase/summarize/condense the information into one intuitive message containing the information to make more accessible and public. These are one on one dms that i want to copy and paste the information into a group DM without making it obvious that these were originally one on one dms:
 

```
Vriff
Vriff [PC98],  — 4:45 PM
I've checked all the kotor 2 game engines except for jp, kr, and Asian versions
PuritanWizard
 [BIRB],  — 4:45 PM
THERE'S A JAPANESE VERSION?
Vriff
Vriff [PC98],  — 4:45 PM
Hoping there were symbols, or anything else included
PuritanWizard
 [BIRB],  — 4:45 PM
i spent weeks on that
there's no way
 [PC98], 
Vriff
Vriff [PC98],  — 4:46 PM
Yes
PuritanWizard
 [BIRB],  — 4:46 PM
the game only works with SBCS encodings 😂
whatttt
you madlad
where can i find that
Vriff
Vriff [PC98],  — 4:46 PM
There's japanese, Korean, and Other Asian versions
Image
PuritanWizard
 [BIRB],  — 4:47 PM
oh man if you knew how hard i worked on the ridiculous 256-character font bitmap limitation you'd understand my pain
please send a link or explain how to find when you have a chance

(earliest convenience)

would be appreciated
Vriff
Vriff [PC98],  — 4:48 PM
Image
It's never been dumped and uploaded to the internet before that I can find, I should be the first.
PuritanWizard
 [BIRB],  — 4:49 PM
What lane sent me last:
I did a brief look this evening. What you refer to as TXIFontInformation is essentially what the Engine refers to as CAurFontInfo (C++ Class Aurora Font Information).

These are the fields that this structure parses in when its initialized (notably missing isdoublebyte and dbmapping):
void __thiscall CAurFontInfo::ParseField(CAurFontInfo *this,char *data)

{
    char *fieldName;
    int isMatch;
    
    fieldName = firstword(data);
    isMatch = __stricmp("numchars",fieldName);
    if (isMatch == 0) {
        Parse(data + 8,&this->numchars);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("fontheight",fieldName);
    if (isMatch == 0) {
        Parse(data + 10,(float)&this->fontheight);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("baselineheight",fieldName);
    if (isMatch == 0) {
        Parse(data + 0xe,(float)&this->baselineheight);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("texturewidth",fieldName);
    if (isMatch == 0) {
        Parse(data + 0xc,(float)&this->texturewidth);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("spacingR",fieldName);
    if (isMatch == 0) {
        Parse(data + 8,(float)&this->spacingR);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("spacingB",fieldName);
    if (isMatch == 0) {
        Parse(data + 8,(float)&this->spacingB);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("upperleftcoords",fieldName);
    if (isMatch == 0) {
        Parse<Vector>(data + 0xf,&this->upperleftcoords);
    }
    fieldName = firstword(data);
    isMatch = __stricmp("lowerrightcoords",fieldName);
    if (isMatch == 0) {
        Parse<Vector>(data + 0x10,&this->lowerrightcoords);
    }
    return;
}

Looking at the data structure I've reversed, I don't think they even instantiate those fields (see image attached).

I also did a string search for both of those fields, and got no results in K1 GoG, K1 Mac, K2 Gog, or K1 Xbox. So, I'm thinking that, as you mentioned may be possible, that kotor does not implement them at all. 

If I were to guess the Aurora code from this era likely kept Multi-byte character processing code behind preprocessor directives, that would've excluded it from compilation. I've seen similar things like this before, such as with various debug strings that never get utilized, or the entire NSS Compiler class that is entirely unimplemented. 

It does look like the import table still includes a few kernel functions for multi-byte characters, but nothing more.

So probably a bust, though I'm gonna double check on a few TXI parsing details to make sure I didn't miss anything.
Image
Vriff
Vriff [PC98],  — 4:49 PM
I've talked to a guy in Korea about buying his Kr version but he wants $300
PuritanWizard
 [BIRB],  — 4:50 PM
nah fuck that i'm going to check bittorrent
fuck that idiot
excuse the language
🙄
⁠OpenKotOR⁠🩹kotor-patch-manager we probably should bring this idea here since it's so good. I have no way to contact Leilukin but that is a project she'd be interested in
hmm i can't remember their pronouns oops
Vriff
Vriff [PC98],  — 4:51 PM
https://www.thefamicast.com/2022/01/japanese-localization-added-to-star.html?m=1
TheFamicast.com: Japan-based Nintendo Podcasts, Videos & Reviews!
Japanese Localization Added to Star Wars KOTOR in Latest Patch
Video game website based in Japan covering all things Nintendo! Fun podcasts, videos, and features abound. Please to enjoy!
Image
Image
Looks like it's been officially released for the switch as well
PuritanWizard
 [BIRB],  — 4:52 PM
so the reason this is interesting is we thought it was impossible to support DBCS or any sort of unicode without extensive codecaving and memory patching.
But theoretically...
 [BIRB], 
PuritanWizard
 [BIRB],  — 4:53 PM
couldn't we copy some of the asm from one of the japanese/korean/etc where it does all the font bitmap handling and use that in kotor-patch-manager to support more languages?
Vriff
Vriff [PC98],  — 4:53 PM
Not quite, xbox is a different architecture
PuritanWizard
 [BIRB],  — 4:53 PM
i'm guessing it wouldn't be that easy but
huh??? are you saying ONLY xbox has the korean/japanese localizations?
uhh i may have jumped the gun
shit
😂
Vriff
Vriff [PC98],  — 4:54 PM
I am not sure if PC got a release with it, what I have is the japanese xbox version
PuritanWizard
 [BIRB],  — 4:54 PM
How the PC versions of the game work is they load .tpc/.tga files representing the A-Z1-9 etc in the codepages. Like there's a texture for every single character
The kicker: there's only 256 supported
That means any double-byte or multi-byte code pages have zero way to be supported
I'm GUESSING xbox doesn't do that pipeline
probably some built-in way of rendering text in games or some sort of api call they can make that pc can't
Sorry to derail whatever we were talking about so thoroughly. I think we were talking about self-hosting nextcloud privately so we can all access the assets within the game
I could hand out root access to that server the ghidra runs on. I've already given it to lane.

if groups worked more optimally on linux i'd just go that route. It's annoying how stuff like certs etc can't be group-owned :/
```

Focus on relaying wizard's plan/information, you may mention Vriff by name if you must focus on accuracy.

## Assistant

_Time: 2026-05-13T21:59:35.772Z_

**Hey team, quick update on KOTOR font/localization stuff:**

Vriff has been digging into various KOTOR 2 versions (including Japanese, Korean, and other Asian releases that most of us never knew existed). The big takeaway is that the **PC versions** are fundamentally limited to 256 characters because they rely on pre-rendered texture sheets for every glyph (A-Z, 0-9, symbols, etc.). That's why proper DBCS / multi-byte / Unicode support has always seemed impossible without heavy codecaving.

However, the Japanese and Korean console versions (especially Xbox) appear to handle fonts very differently and actually support those extra characters. Vriff has access to a Japanese Xbox version that hasn't been dumped publicly yet.

**The exciting idea:** We might be able to pull relevant font rendering / bitmap handling code from those localized console builds and adapt it into **kotor-patch-manager** (and OpenKotOR) to finally get better language/mod support. It's not trivial (different architecture on Xbox, different text pipeline), but it's way more promising than we thought before.

Vriff also found that the engine's font structure (CAurFontInfo) doesn't even implement the double-byte fields we were hoping for, which matches what we saw in the PC binaries.

This seems like something Leilukin and the OpenKotOR folks would be really interested in. Worth exploring further?

(Also, if anyone has leads on cheap Japanese/Korean copies or dumps, let us know — no $300 Korean disc nonsense 😂)

Let me know your thoughts!
