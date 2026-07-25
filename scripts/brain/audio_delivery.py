#!/usr/bin/env python3
"""Paralinguistic delivery enrichment for whisper transcripts."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import subprocess
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import numpy as np

from common import DEFAULT_DATA_ROOT

SELF_ID = "227896831944687616"
SELF_NAME = "PuritanWizard"
PEER_ID = "peer_trip"
PEER_NAME = "Trip conversation partner"

PROFANITY_RE = re.compile(r"\b(fuck|fucking|shit|damn)\b", re.I)
LAUGH_RE = re.compile(r"\b(laugh|funny|hilarious|haha|hehe)\b", re.I)
STACCATO_RE = re.compile(r"\b(\w{1,4}-\w{1,4}-|\bcha-cha\b)", re.I)

PEER_SHORT_REPLIES = {
    "no.",
    "yes.",
    "yeah.",
    "okay.",
    "ok.",
    "really?",
    "tell me.",
    "peace.",
    "here.",
    "nothing.",
    "oh.",
    "bored.",
    "billy bored.",
}


def _load_pcm(audio_path: Path, channel: str = "mix", sample_rate: int = 48000) -> np.ndarray:
    af: list[str] = []
    if channel == "left":
        af = ["-af", "pan=mono|c0=c0"]
    elif channel == "right":
        af = ["-af", "pan=mono|c0=c1"]
    elif channel == "mix":
        af = ["-af", "pan=mono|c0=0.5*c0+0.5*c1"]
    cmd = [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        str(audio_path),
        *af,
        "-f",
        "f32le",
        "-ac",
        "1",
        "-ar",
        str(sample_rate),
        "-",
    ]
    raw = subprocess.check_output(cmd)
    if not raw:
        return np.array([], dtype=np.float32)
    return np.frombuffer(raw, dtype=np.float32)


def _rms_db(samples: np.ndarray) -> float:
    if samples.size == 0:
        return -120.0
    rms = float(np.sqrt(np.mean(samples.astype(np.float64) ** 2)))
    if rms <= 1e-10:
        return -120.0
    return 20.0 * math.log10(rms)


def _segment_slice(pcm: np.ndarray, sample_rate: int, start: float, end: float) -> np.ndarray:
    i0 = max(0, int(start * sample_rate))
    i1 = max(i0, int(end * sample_rate))
    return pcm[i0:i1]


def _word_count(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text or ""))


def _is_stereo(audio_path: Path) -> bool:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-hide_banner",
            "-loglevel",
            "error",
            "-select_streams",
            "a:0",
            "-show_entries",
            "stream=channels",
            "-of",
            "csv=p=0",
            str(audio_path),
        ],
        text=True,
    ).strip()
    try:
        return int(out.split(",")[0]) >= 2
    except (ValueError, IndexError):
        return False


def _channel_dominance(left_db: float, right_db: float, threshold_db: float = 3.0) -> str:
    if abs(left_db - right_db) < threshold_db:
        return "mixed"
    return "left" if left_db > right_db else "right"


def _linguistic_peer_score(text: str) -> float:
    t = (text or "").strip()
    if not t:
        return 0.0
    lower = t.lower()
    words = _word_count(t)
    score = 0.0
    i_count = len(re.findall(r"\bI\b", t))

    if words > 25 or i_count >= 2:
        score *= 0.35

    if t.endswith("?"):
        parts = [p.strip() for p in re.split(r"[.!?]", t) if p.strip()]
        last = parts[-1] if parts else t
        if last.endswith("?") or "?" in last:
            last_q = last + ("?" if not last.endswith("?") else "")
            if _word_count(last_q) <= 10 and i_count == 0:
                score += 3.0
            elif _word_count(last_q) <= 6:
                score += 2.5
    if lower in PEER_SHORT_REPLIES:
        score += 3.0
    if words <= 4 and lower.rstrip(".") in {"no", "yes", "yeah", "okay", "ok", "really", "dude"}:
        score += 2.5
    if words <= 8 and re.match(r"^(well|but|and|see|since|or|no|yes|okay|really)\b", lower):
        score += 1.5 if i_count == 0 else 0.5
    if re.search(r"\b(the wizard|wizard,|you said that)\b", lower):
        score += 2.0
    if re.search(r"\bholds,\b", lower):
        score += 2.0
    if re.search(r"\b(you lost|you did better|you're supposed|you ever got|you talking)\b", lower):
        score += 2.0
    if words <= 12 and re.search(r"^(what|why|how|would you|could i|do you|are you|did you)\b", lower):
        score += 2.0 if i_count == 0 else 1.0
    return score


def _linguistic_self_score(text: str) -> float:
    t = (text or "").strip()
    if not t:
        return 0.0
    lower = t.lower()
    words = _word_count(t)
    score = 0.0
    if re.search(r"\b(i|i'm|i've|i'd|my|myself)\b", lower):
        score += 1.5
    if words >= 20:
        score += 2.0
    if lower.startswith(("dude", "man,", "well,", "so i", "i was", "i didn't", "i don't")):
        score += 1.0
    if re.search(r"\b(tripp(ed|ing)|spiritual|dopamine|confidence)\b", lower):
        score += 0.5
    return score


def _calibrate_self_channel(segments: list[dict[str, Any]], stereo: bool) -> tuple[str | None, str]:
    if not stereo:
        return None, "mono"
    left_self = right_self = left_peer = right_peer = 0.0
    for seg in segments:
        dom = seg.get("channel_dominance")
        if dom not in {"left", "right"}:
            continue
        peer = _linguistic_peer_score(seg.get("text", ""))
        self = _linguistic_self_score(seg.get("text", ""))
        if peer > self and peer >= 2.0:
            if dom == "left":
                left_peer += peer
            else:
                right_peer += peer
        elif self >= peer:
            dur = max(0.1, float(seg.get("end", 0)) - float(seg.get("start", 0)))
            weight = dur * max(1, _word_count(seg.get("text", "")))
            if dom == "left":
                left_self += weight
            else:
                right_self += weight
    if left_peer + right_peer >= 3.0:
        self_channel = "right" if right_peer > left_peer else "left"
        return self_channel, "stereo_channel+linguistic"
    if left_self + right_self > 0:
        self_channel = "left" if left_self >= right_self else "right"
        return self_channel, "stereo_channel+duration"
    return None, "linguistic_only"


def _infer_role(
    text: str,
    channel_dominance: str,
    self_channel: str | None,
    stereo: bool,
) -> tuple[str, str, float]:
    peer_score = _linguistic_peer_score(text)
    self_score = _linguistic_self_score(text)
    words = _word_count(text)
    i_count = len(re.findall(r"\bI\b", text or ""))

    if stereo and self_channel and channel_dominance in {"left", "right"}:
        on_self_channel = channel_dominance == self_channel
        if on_self_channel and peer_score < 2.5:
            return "self", "dominant self channel", 0.85
        if not on_self_channel and peer_score >= 2.0:
            return "peer", "dominant peer channel", 0.85
        if not on_self_channel and self_score < peer_score + 0.5:
            return "peer", "off self channel", 0.7

    if STACCATO_RE.search(text or "") and peer_score < 3.0:
        return "self", "staccato self delivery", 0.8
    if words > 18 and i_count >= 2 and peer_score < 3.5:
        return "self", "extended first-person monologue", 0.85
    if peer_score >= 3.0 and peer_score > self_score + 0.75:
        return "peer", "short peer reply", 0.9
    if text.strip().endswith("?") and peer_score >= 2.5 and words <= 15 and i_count == 0:
        return "peer", "question to speaker", 0.85
    if self_score >= peer_score:
        return "self", "first-person monologue", 0.65
    if peer_score > self_score + 1.0:
        return "peer", "linguistic peer markers", 0.6
    return "self", "default self", 0.5


def _smooth_roles(segments: list[dict[str, Any]]) -> None:
    for i, seg in enumerate(segments):
        if i == 0:
            continue
        prev = segments[i - 1]
        if prev.get("role") != "self" or seg.get("role") != "peer":
            continue
        prev_tags = (prev.get("delivery") or {}).get("vibe_tags") or []
        if any(t in prev_tags for t in ("rant", "emphatic", "staccato", "animated", "high_energy")):
            if _linguistic_peer_score(seg.get("text", "")) < 2.5:
                seg["role"] = "self"
                seg["role_note"] = "continuation of self burst"
                seg["role_confidence"] = 0.75
        if STACCATO_RE.search(seg.get("text", "")):
            seg["role"] = "self"
            seg["role_note"] = "staccato self delivery"
            seg["role_confidence"] = 0.8


def _energy_band(rms_db: float, tertiles: tuple[float, float]) -> str:
    low, high = tertiles
    if rms_db <= low:
        return "low"
    if rms_db >= high:
        return "high"
    return "mid"


def _vibe_tags(
    *,
    text: str,
    rms_db: float,
    pace_wps: float,
    pause_before_s: float,
    avg_logprob: float | None,
    no_speech_prob: float | None,
    temperature: float | None,
    energy_band: str,
) -> tuple[list[str], str | None]:
    tags: list[str] = []
    note: str | None = None
    t = text or ""

    if energy_band == "high" and pace_wps > 3.0:
        tags.extend(["high_energy", "animated"])
    if energy_band == "low" and pace_wps < 1.5:
        tags.extend(["soft", "slow", "reflective"])
    elif pace_wps < 1.0:
        tags.extend(["slow", "reflective"])
    elif pace_wps < 1.5 and energy_band != "high":
        tags.append("slow")
    if pause_before_s > 2.0:
        tags.extend(["long_pause", "hesitant"])
    if avg_logprob is not None and avg_logprob < -0.5:
        tags.append("uncertain_transcript")
    if no_speech_prob is not None and no_speech_prob > 0.5 and _word_count(t) < 8:
        tags.append("uncertain_transcript")
    if LAUGH_RE.search(t) and energy_band in {"mid", "high"}:
        tags.append("amused")
    if PROFANITY_RE.search(t) and energy_band == "high" and pace_wps > 2.5:
        tags.extend(["emphatic", "rant"])
    if STACCATO_RE.search(t):
        tags.extend(["staccato", "playful"])
    if temperature is not None and temperature > 0.0:
        tags.append("noisy_segment")

    if not tags:
        if energy_band == "high":
            tags.append("neutral_energy")
        elif energy_band == "low":
            tags.append("intimate")
        else:
            tags.append("neutral_energy")

    # dedupe preserving order
    seen: set[str] = set()
    out: list[str] = []
    for tag in tags:
        if tag not in seen:
            seen.add(tag)
            out.append(tag)
    return out, note


def enrich_segments(audio_path: Path, whisper_data: dict[str, Any]) -> dict[str, Any]:
    segments_in = whisper_data.get("segments") or []
    stereo = _is_stereo(audio_path)
    sample_rate = 48000
    mix_pcm = _load_pcm(audio_path, "mix", sample_rate)
    left_pcm = _load_pcm(audio_path, "left", sample_rate) if stereo else mix_pcm
    right_pcm = _load_pcm(audio_path, "right", sample_rate) if stereo else mix_pcm

    rms_values: list[float] = []
    enriched: list[dict[str, Any]] = []
    prev_end = 0.0

    for seg in segments_in:
        start = float(seg.get("start") or 0.0)
        end = float(seg.get("end") or start)
        text = (seg.get("text") or "").strip()
        duration = max(0.05, end - start)
        pause_before = max(0.0, start - prev_end) if start > 0 else 0.0
        prev_end = end

        mix_slice = _segment_slice(mix_pcm, sample_rate, start, end)
        rms_db = _rms_db(mix_slice)
        rms_values.append(rms_db)

        left_db = _rms_db(_segment_slice(left_pcm, sample_rate, start, end))
        right_db = _rms_db(_segment_slice(right_pcm, sample_rate, start, end))
        dominance = _channel_dominance(left_db, right_db)

        pace = _word_count(text) / duration
        enriched.append(
            {
                "id": seg.get("id"),
                "start": start,
                "end": end,
                "text": text,
                "avg_logprob": seg.get("avg_logprob"),
                "no_speech_prob": seg.get("no_speech_prob"),
                "compression_ratio": seg.get("compression_ratio"),
                "temperature": seg.get("temperature"),
                "rms_db": round(rms_db, 2),
                "left_rms_db": round(left_db, 2),
                "right_rms_db": round(right_db, 2),
                "channel_dominance": dominance if stereo else "mono",
                "pace_wps": round(pace, 2),
                "pause_before_s": round(pause_before, 2),
            }
        )

    if rms_values:
        arr = np.array(rms_values, dtype=np.float64)
        low = float(np.percentile(arr, 33))
        high = float(np.percentile(arr, 67))
        tertiles = (low, high)
    else:
        tertiles = (-30.0, -18.0)

    self_channel, speaker_method = _calibrate_self_channel(enriched, stereo)

    for seg in enriched:
        energy_band = _energy_band(float(seg["rms_db"]), tertiles)
        vibe_tags, delivery_note = _vibe_tags(
            text=seg["text"],
            rms_db=float(seg["rms_db"]),
            pace_wps=float(seg["pace_wps"]),
            pause_before_s=float(seg["pause_before_s"]),
            avg_logprob=seg.get("avg_logprob"),
            no_speech_prob=seg.get("no_speech_prob"),
            temperature=seg.get("temperature"),
            energy_band=energy_band,
        )
        role, role_note, role_conf = _infer_role(
            seg["text"], seg["channel_dominance"], self_channel, stereo
        )
        if delivery_note is None and role_note:
            delivery_note = role_note

        whisper_conf = None
        if seg.get("avg_logprob") is not None:
            whisper_conf = round(math.exp(float(seg["avg_logprob"])), 4)

        seg["delivery"] = {
            "rms_db": seg["rms_db"],
            "energy_band": energy_band,
            "pace_wps": seg["pace_wps"],
            "pause_before_s": seg["pause_before_s"],
            "whisper_confidence": whisper_conf,
            "whisper_no_speech_prob": seg.get("no_speech_prob"),
            "channel_dominance": seg["channel_dominance"],
            "vibe_tags": vibe_tags,
            "delivery_note": delivery_note,
        }
        seg["role"] = role
        seg["role_confidence"] = round(role_conf, 2)
        seg["role_note"] = role_note

    _smooth_roles(enriched)

    if not stereo:
        for seg in enriched:
            seg["role"] = "self"
            seg["role_note"] = "mono single-speaker"
            seg["role_confidence"] = 0.95
        speaker_method = "mono_single_speaker"

    return {
        "audio_path": str(audio_path),
        "stereo": stereo,
        "segment_count": len(enriched),
        "self_channel": self_channel,
        "speaker_method": speaker_method,
        "rms_tertiles_db": {"low": round(tertiles[0], 2), "high": round(tertiles[1], 2)},
        "segments": enriched,
    }


def _format_ts(seconds: float) -> str:
    seconds = max(0, int(seconds))
    m, s = divmod(seconds, 60)
    return f"PT{m}M{s}S"


def build_delivery_profile(enriched: dict[str, Any]) -> dict[str, Any]:
    segments = enriched.get("segments") or []
    rms_vals = [float(s["rms_db"]) for s in segments if s.get("rms_db") is not None]
    vibe_counter: Counter[str] = Counter()
    energy_bands: set[str] = set()
    roles = Counter(str(s.get("role")) for s in segments)
    for seg in segments:
        delivery = seg.get("delivery") or {}
        for tag in delivery.get("vibe_tags") or []:
            vibe_counter[str(tag)] += 1
        band = delivery.get("energy_band")
        if band:
            energy_bands.add(str(band))

    energy_range: list[str] = []
    if "low" in energy_bands:
        energy_range.append("soft")
    if "high" in energy_bands:
        energy_range.append("emphatic")
    if "mid" in energy_bands and not energy_range:
        energy_range.append("neutral")

    return {
        "median_energy_db": round(float(np.median(rms_vals)), 2) if rms_vals else None,
        "energy_range": energy_range,
        "dominant_vibes": [t for t, _ in vibe_counter.most_common(8)],
        "multi_speaker": roles.get("peer", 0) > 0,
        "speaker_method": enriched.get("speaker_method"),
        "self_segments": roles.get("self", 0),
        "peer_segments": roles.get("peer", 0),
    }


def build_voice_conversation(
    *,
    source_path: str,
    title: str,
    enriched: dict[str, Any],
    whisper_model: str = "base",
    content_note: str | None = None,
    participants_peer: tuple[str, str] | None = None,
) -> dict[str, Any]:
    peer_id, peer_name = participants_peer or (PEER_ID, PEER_NAME)
    messages: list[dict[str, Any]] = []
    for seg in enriched.get("segments") or []:
        role = seg.get("role") or "self"
        if role == "peer":
            speaker_id, speaker_name = peer_id, peer_name
        else:
            speaker_id, speaker_name = SELF_ID, "Wizard" if "trip" in source_path.lower() else "th3w1zard1"
        delivery = seg.get("delivery") or {}
        messages.append(
            {
                "message_id": f"seg:{seg.get('id')}",
                "role": role,
                "speaker_id": speaker_id,
                "speaker_name": speaker_name,
                "text": seg.get("text") or "",
                "ts": _format_ts(float(seg.get("start") or 0)),
                "attachments": [],
                "raw": {
                    "whisper_segment_id": seg.get("id"),
                    "start": seg.get("start"),
                    "end": seg.get("end"),
                    "whisper_confidence": delivery.get("whisper_confidence"),
                    "delivery": delivery,
                    "role_confidence": seg.get("role_confidence"),
                    "role_note": seg.get("role_note"),
                },
            }
        )

    delivery_profile = build_delivery_profile(enriched)
    meta: dict[str, Any] = {
        "channel": "massivehdd",
        "twin_eligible": any(m["role"] == "self" for m in messages),
        "language": "en",
        "message_count": len(messages),
        "ingested_at": datetime.now(timezone.utc).isoformat(),
        "massivehdd": True,
        "whisper_model": whisper_model,
        "delivery_enriched_at": datetime.now(timezone.utc).isoformat(),
        "delivery_profile": delivery_profile,
    }
    if content_note:
        meta["content_note"] = content_note
    if delivery_profile.get("multi_speaker"):
        meta["multi_speaker"] = True

    return {
        "schema_version": 1,
        "conversation_id": "conv:" + hashlib.sha256(source_path.encode()).hexdigest()[:24],
        "source_family": "voice_transcript",
        "source_path": source_path,
        "title": title,
        "started_at": None,
        "ended_at": None,
        "participants": [
            {"id": SELF_ID, "name": SELF_NAME, "role": "self"},
            {"id": peer_id, "name": peer_name, "role": "peer"},
        ],
        "messages": messages,
        "meta": meta,
    }


def write_sidecar(enriched: dict[str, Any], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(enriched, ensure_ascii=False, indent=2), encoding="utf-8")


def enrich_file(audio_path: Path, whisper_json_path: Path, sidecar_path: Path | None = None) -> dict[str, Any]:
    whisper_data = json.loads(whisper_json_path.read_text(encoding="utf-8"))
    enriched = enrich_segments(audio_path, whisper_data)
    out = sidecar_path or (
        DEFAULT_DATA_ROOT / "massivehdd" / "paralinguistics" / f"{audio_path.stem}.delivery.json"
    )
    write_sidecar(enriched, out)
    return enriched


def cmd_enrich(args: argparse.Namespace) -> int:
    enriched = enrich_file(Path(args.audio), Path(args.whisper_json), Path(args.output) if args.output else None)
    print(json.dumps({"segment_count": enriched["segment_count"], "speaker_method": enriched["speaker_method"]}))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Audio delivery enrichment")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_enrich = sub.add_parser("enrich", help="Enrich whisper JSON with delivery metadata")
    p_enrich.add_argument("--audio", required=True)
    p_enrich.add_argument("--whisper-json", required=True)
    p_enrich.add_argument("--output", default="")
    p_enrich.set_defaults(func=cmd_enrich)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
