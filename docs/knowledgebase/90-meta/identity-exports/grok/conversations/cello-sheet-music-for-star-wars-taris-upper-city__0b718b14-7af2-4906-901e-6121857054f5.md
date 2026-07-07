---
source_url: "https://grok.com/c/0b718b14-7af2-4906-901e-6121857054f5"
conversation_id: "0b718b14-7af2-4906-901e-6121857054f5"
title: "Cello Sheet Music for Star Wars Taris Upper City"
extracted_at: "2026-06-29T16:09:26.646Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Cello Sheet Music for Star Wars Taris Upper City

Source: [Grok conversation](https://grok.com/c/0b718b14-7af2-4906-901e-6121857054f5)

## User

_Time: 2026-05-08T13:42:58.338Z_

https://www.youtube.com/watch?v=0Xh2bkZTiHI
 
please create sheet music for the cello from this song. Also provide it in lilypond please if possible?

## Assistant

_Time: 2026-05-08T13:45:07.429Z_

**The song in the YouTube video (https://www.youtube.com/watch?v=0Xh2bkZTiHI) is “Upper City Cantina (Pazaak)” / “Taris Upper City” from *Star Wars: Knights of the Old Republic* (KOTOR, 2003), composed by Jeremy Soule.** It is the smooth, laid-back lounge/jazz-blues style background music that plays in the Upper City Cantina on Taris and during Pazaak card games. The piece has a relaxed, atmospheric feel with a prominent melodic lead (often described as saxophone- or wind-like in tone) over a swinging bass and chordal accompaniment—perfectly suited to the expressive, warm timbre of the cello.

### Available Resources for the Piece
No official published score exists for this track (like most of Soule’s game music at the time), but high-quality **fan transcriptions** are freely available:
- **Piano solo sheet music** (easiest starting point):  
  - MuseScore: [Taris Upper City (KOTOR) – easy piano arrangement](https://musescore.com/user/27002457/scores/5663264) (downloadable as PDF or MIDI).<grok:render card_id="e90363" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">1</argument></grok:render><grok:render card_id="8bbf91" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">16</argument></grok:render>  
  - Alternative MuseScore version: [Taris Upper City (Kotor)](https://musescore.com/song/taris_upper_city_kotor-6338311).<grok:render card_id="c9d904" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">2</argument></grok:render><grok:render card_id="74c39a" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">15</argument></grok:render>
- **Full score transcription & analysis**: YouTube video by Erik Hoeting with a **direct Google Drive link to the PDF score** (https://drive.google.com/file/d/12RSKBXrmVRt7RvvdcjD0xEsCKvrr0GSv/view?usp=sharing). The video also breaks down the music.<grok:render card_id="73fbfd" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">3</argument></grok:render>
- **Synthesia (visual piano roll) version** for reference: https://www.youtube.com/watch?v=-qBzQhyDCOE (helpful if you want to see/hear the notes visually while transcribing).

The piece is in **G minor**, typically in **4/4 time** with a moderate, swinging tempo (around 80–100 BPM with a relaxed jazz feel). It has a repeating AABA-like structure with bluesy inflections, syncopation, and expressive phrasing.

### Creating Cello Sheet Music
I searched extensively for a pre-existing **cello-specific arrangement** or **LilyPond** version of this exact track and found none. The original is primarily melodic with piano-style accompaniment, so a cello arrangement is straightforward but requires adaptation:

- **Melody line** → Primary lead (the “saxophone” theme) works beautifully on cello.  
- **Range considerations**: The melody sits comfortably in the lower-to-middle registers of the cello (roughly C2 to G4 or so, adjustable by octave). Cello’s rich, singing tone enhances the jazzy, melancholic vibe better than piano in some ways.  
- **Accompaniment**: For solo cello, you can simplify to just the melody (with optional double-stops or pizzicato bass notes) or create a chordal/piano-reduction version using the left-hand piano part.  
- **Style nuances**: Use swung eighth notes (or notate as “swing” feel), generous slurs, dynamics (crescendo/decrescendo for the lounge feel), and occasional harmonics or sul tasto for atmospheric effects. Edge case: If the original has complex chords, reduce them to imply harmony while keeping the line playable without excessive shifts.

**Recommended workflow to get accurate cello sheet music quickly**:
1. Download the MuseScore piano PDF/MIDI or the Google Drive transcription PDF.
2. Open in **MuseScore** (free software) → select the main melody staff → change instrument to “Cello” → switch to bass clef → adjust octave if needed for comfort → add bowings/slurs/dynamics.
3. Export as MusicXML → use an online MusicXML-to-LilyPond converter (search “MusicXML LilyPond converter”) or manually refine in LilyPond.
4. For a quick solo version, you could also use the Synthesia video + ear transcription in notation software.

### LilyPond Template for Cello (Skeleton)
While I cannot generate the *exact* note sequence here without direct audio-to-notation processing or OCR of the PDF (tools do not support that), here is a ready-to-use **LilyPond template** for a solo cello arrangement. You can paste the melody notes (once you transcribe them) into the `celloMusic` variable. Copy-paste this into a `.ly` file and compile with LilyPond (free, open-source).

```lilypond
\version "2.24.0"
\header {
  title = "Upper City Cantina (Pazaak) - Taris Upper City"
  subtitle = "from Star Wars: Knights of the Old Republic"
  composer = "Jeremy Soule"
  arranger = "Arranged for Cello"
  tagline = ##f
}

\paper {
  #(set-paper-size "a4")
}

global = {
  \key g \minor
  \time 4/4
  \tempo "Smooth and relaxed, with swing" 4 = 90
  \set Score.swing = ##t  % or manually notate swung rhythms
}

celloMusic = \relative c {
  % === PASTE YOUR TRANSCRIBED MELODY HERE ===
  % Example placeholder (first few bars in G minor style):
  % d4.\mf es8 d4 c | bes4. a8 g4 f | 
  % ... (replace with actual notes from the score)
  \bar "|."
}

\score {
  \new Staff \with {
    instrumentName = "Cello"
    midiInstrument = "cello"
  } {
    \clef bass
    \global
    \celloMusic
  }
  \layout { }
  \midi { }
}
```

**How to fill it in**:
- Use bass clef (`\clef bass`).
- Add articulations (`\mf`, `\slur`, `\tenuto`, etc.) for expression.
- For swing feel, either use LilyPond’s swing property or write explicit triplets.
- If you want chords or a bass line underneath, add a second voice with `\voiceTwo`.

### Additional Considerations & Edge Cases
- **Copyright note**: This is fan-transcribed game music owned by LucasArts/Disney. Personal use and learning are fine; public performance or commercial distribution would require checking rights.
- **Difficulty level**: Intermediate — the melody has some leaps and syncopation, but nothing extreme for cello. Advanced players could add improvisation or double-stops.
- **Variations**: The in-game track loops and has slight variations; choose one consistent version (the piano transcriptions usually use the main loop).
- **Alternatives if you want instant playable material**: Import the MIDI from MuseScore into a DAW or notation app and let it generate a basic cello part automatically, then refine by ear.

If you upload the PDF score (or a screenshot of the first page) or describe the first few bars you see, I can help refine the LilyPond code or suggest specific fingerings/bowings. Alternatively, MuseScore’s community often fulfills custom arrangement requests quickly. Let me know how you’d like to proceed!
