---
source_url: "https://grok.com/c/d6e8f163-d701-41ce-ad18-f56e6aba8fb1"
conversation_id: "d6e8f163-d701-41ce-ad18-f56e6aba8fb1"
title: "Open Source Spotify Basic Pitch MIDI Converter"
extracted_at: "2026-06-29T16:09:20.465Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Open Source Spotify Basic Pitch MIDI Converter

Source: [Grok conversation](https://grok.com/c/d6e8f163-d701-41ce-ad18-f56e6aba8fb1)

## User

_Time: 2026-05-08T15:31:14.667Z_

open source implementation of https://basicpitch.spotify.com/ that'll let me upload a mp3/wav and get a midi. Basically find an open source mp3/wav to midi converter and ensure it's open source and best quality/implementation available in the internet

## Assistant

_Time: 2026-05-08T15:32:40.675Z_

**The best open-source MP3/WAV-to-MIDI converter available is Spotify's own Basic Pitch**—the exact technology powering https://basicpitch.spotify.com/. Spotify open-sourced it in 2022 under the Apache 2.0 license (fully permissive for commercial and personal use), and it remains the highest-quality, most actively referenced open-source solution as of 2026.<grok:render card_id="9489d4" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">0</argument></grok:render><grok:render card_id="bfd6ad" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">8</argument></grok:render>

No newer open-source project has surpassed it in general-purpose audio-to-MIDI transcription (polyphonic, instrument-agnostic, with pitch-bend detection). Commercial tools like Melodyne, RipX, or Prism often edge it out in raw accuracy or polish for complex mixes, but they are closed-source and/or paid. Basic Pitch strikes an excellent balance: lightweight neural network, fast inference (CPU/GPU), high note accuracy on single-instrument or clean polyphonic recordings, and zero privacy concerns since everything runs locally.<grok:render card_id="5f4be8" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">42</argument></grok:render>

### Why Basic Pitch Is the Top Recommendation
- **Direct match to the web demo you linked**: The online tool at basicpitch.spotify.com runs the exact same model client-side (no audio leaves your machine). The open-source library gives you the same (or better) results locally with full control.
- **Features that matter for your use case**:
  - Supports MP3, WAV, FLAC, OGG, M4A (and more via librosa).
  - Outputs standard MIDI (.mid) with **pitch bends** (critical for expressive transcription like vocals, guitar, or wind instruments).
  - Polyphonic transcription (multiple notes/chords simultaneously).
  - Optional: sonified MIDI (WAV preview), raw model outputs (.npz), note events (.csv).
  - Works on vocals, guitar, piano, etc.—instrument-agnostic.
- **Performance**: Lightweight model (far smaller/faster than many competitors). Excellent on monophonic or moderately polyphonic sources. For very dense mixes, results improve dramatically if you first separate stems (e.g., with open-source tools like Demucs or Spleeter).
- **License & maintenance**: Apache 2.0. Actively maintained Python library with TypeScript/WebAssembly siblings and third-party wrappers.<grok:render card_id="57a4e7" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">30</argument></grok:render>

**Limitations (important nuances)**: It shines on clean, single-instrument recordings. Extremely busy polyphonic mixes (full band + heavy reverb) can produce extra notes or require post-editing in a DAW. Very long files (>10–15 min) benefit from chunking or streaming. These are common to all audio-to-MIDI tools, but Basic Pitch is still among the best open-source performers.

### Easiest Way to Use It: Python CLI (Drag-and-Drop Style for Files)
1. **Install** (one command, works on macOS, Windows, Linux):
   ```
   pip install basic-pitch --upgrade
   ```
   (Python 3.7–3.11 supported. It auto-installs the right runtime: CoreML on macOS, TFLite on Linux, ONNX on Windows. Optional TensorFlow support via `pip install basic-pitch[tf]`.)

2. **Convert any MP3 or WAV** (example):
   ```
   basic-pitch ./my-midi-output ./my-song.mp3
   ```
   - This creates `./my-midi-output/my-song.mid` (and optional extras).
   - Batch process: `basic-pitch ./output-folder *.mp3 *.wav`
   - Add flags for more outputs: `--sonify-midi --save-note-events`

   Full help: `basic-pitch --help`

This is perfect for your “upload a file and get MIDI” workflow—just point it at local files. No server upload, no limits.<grok:render card_id="27d238" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">41</argument></grok:render>

### Python API (for scripting or custom apps)
```python
from basic_pitch.inference import predict_and_save
from basic_pitch import ICASSP_2022_MODEL_PATH

predict_and_save(
    ["path/to/song.mp3", "path/to/another.wav"],
    output_directory="./midi_files",
    save_midi=True,
    sonify_midi=True,      # creates playable WAV of the MIDI
    save_notes=True,       # CSV with note timings
    model_path=ICASSP_2022_MODEL_PATH
)
```
Full docs and advanced options (custom model, confidence thresholds, etc.) are in the README.

### Even Easier Options Built on the Same Tech (Still Fully Open Source)
- **NeuralNote** (highly recommended for most users): Free standalone app + VST3/AU plugin for any DAW. Drag-and-drop audio → instant MIDI with piano-roll editing, quantization, and real-time preview. It wraps Basic Pitch’s model but adds a polished UI and extra features. Perfect if you live in Ableton, Logic, Reaper, etc.  
  GitHub: https://github.com/DamRsn/NeuralNote  
  Many producers call it the best free audio-to-MIDI experience available.<grok:render card_id="dcb4ee" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">54</argument></grok:render>
- **Basic Pitch UI** (macOS GUI wrapper): Simple desktop app if you prefer clicks over terminal.  
  https://github.com/Hexela/BasicPitchUI
- **Web/JS version**: https://github.com/spotify/basic-pitch-ts (npm install) — same model, runs in browser or Node.

### Quick Comparison of Other Open-Source Alternatives
| Tool                  | Quality                  | Ease of Use          | Polyphonic? | Pitch Bend? | Notes |
|-----------------------|--------------------------|----------------------|-------------|-------------|-------|
| **Basic Pitch** (recommended) | Excellent (SOTA open-source) | CLI/Python + wrappers | Yes        | Yes        | Best overall |
| **NeuralNote**        | Same as above + UI      | Standalone/VST      | Yes        | Yes        | Best for DAW users |
| Older tools (WaoN, Melodia, A2M) | Good for simple cases   | Varies              | Limited    | No         | Outdated vs. ML models |
| GiantMIDI-Piano       | Strong for solo piano   | More setup          | Yes        | No         | Piano-specific, somewhat archived |

Non-ML tools are simpler but noticeably less accurate on real-world recordings.<grok:render card_id="a927d7" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">15</argument></grok:render>

### Tips for Best Results
- **Clean source audio** → highest accuracy.
- **Stem separation first** (open-source Demucs or Ultimate Vocal Remover) if you have a full mix.
- Post-process the MIDI in any DAW (quantize, delete ghost notes, adjust velocity).
- For research/edge cases: The original paper is at https://arxiv.org/abs/2203.09893.

**Bottom line**: Install `basic-pitch` via pip and you’re done—it’s the official open-source implementation of the tool you linked, and it’s still the gold standard for free/local MP3/WAV → MIDI conversion. If you want a one-click GUI or DAW plugin, go straight to NeuralNote. Both are free, private, and give you production-ready MIDI in seconds. Let me know if you need help setting up a Gradio web UI or integrating it into a specific workflow!
