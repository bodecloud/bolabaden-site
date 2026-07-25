#!/usr/bin/env python3
"""P2: Mine stimulus→response cases + behavior_profile from twin-eligible episodes."""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from common import DEFAULT_DATA_ROOT, ensure_dirs, episode_id, scrub_pii, tokenize

HOLDOUT_MOD = 10  # ~10% threads held out for ITT eval

TOPIC_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("kotor", re.compile(r"\b(kotor|holocron|pykotor|tslpatcher|dlg|openkotor)\b", re.I)),
    ("games", re.compile(r"\b(halo|minecraft|rocket.?league|pokemon|runescape)\b", re.I)),
    ("code", re.compile(r"\b(python|typescript|react|docker|git|error|compile|debug)\b", re.I)),
    ("ai", re.compile(r"\b(llm|gpt|claude|agent|prompt|model)\b", re.I)),
    ("infra", re.compile(r"\b(linux|docker|nginx|traefik|homelab|server)\b", re.I)),
]

CONFLICT_RE = re.compile(
    r"\b(wrong|stupid|shut up|fuck|hate|idiot|stop|wtf|bullshit)\b", re.I
)
META_RE = re.compile(
    r"\b(as an ai|great question|how can i assist|happy to help|assistant)\b", re.I
)
QUESTION_RE = re.compile(r"\?")
REFRAME_RE = re.compile(r"\b(i mean|actually|basically|well,? no)\b", re.I)
SELF_DEPRECATE_RE = re.compile(r"\b(my bad|sorry|my fault|i messed up)\b", re.I)

AFFECT_ANGER = re.compile(r"\b(fuck|shit|stupid|hate|wtf|damn)\b", re.I)
AFFECT_MANIA = re.compile(r"\b(lmao|lol|!!!|insane|holy shit|bruh)\b", re.I)


def _topics(text: str) -> list[str]:
    hits = [name for name, pat in TOPIC_PATTERNS if pat.search(text)]
    return hits or ["general"]


def _affect_tags(text: str, delivery: dict[str, Any] | None = None) -> list[str]:
    tags: list[str] = []
    if delivery:
        tags.extend(delivery.get("vibe_tags") or [])
        band = delivery.get("energy_band")
        if band in {"high", "very_high"}:
            tags.append("high_arousal")
        if band in {"low", "very_low"}:
            tags.append("withdraw")
    t = text or ""
    if AFFECT_ANGER.search(t):
        tags.append("high_arousal")
    if AFFECT_MANIA.search(t) or t.count("!") >= 4:
        tags.append("emphatic")
    if len(t.strip()) <= 12:
        tags.append("withdraw")
    if not tags:
        tags.append("neutral")
    return sorted(set(tags))


def _stimulus_type(stimulus: str) -> str:
    if META_RE.search(stimulus):
        return "meta_assistant"
    if CONFLICT_RE.search(stimulus):
        return "disagreement"
    if QUESTION_RE.search(stimulus):
        return "peer_question"
    topics = _topics(stimulus)
    if "code" in topics or "kotor" in topics:
        return "tech_rant"
    return "casual_banter"


def _boden_moves(stimulus: str, responses: list[str]) -> list[str]:
    moves: list[str] = []
    joined = " ".join(responses)
    if len(responses) > 1:
        moves.append("burst_reply")
    if REFRAME_RE.search(joined):
        moves.append("literal_reframe")
    if QUESTION_RE.search(joined):
        moves.append("seek_clarity")
    if SELF_DEPRECATE_RE.search(joined):
        moves.append("self_deprecate")
    stim_tokens = set(tokenize(stimulus))
    resp_tokens = set(tokenize(joined))
    if stim_tokens and len(stim_tokens & resp_tokens) / max(len(stim_tokens), 1) < 0.15:
        moves.append("topic_shift")
    if not moves:
        moves.append("direct_reply")
    return moves


def _engagement(stimulus: str, responses: list[str], channel: str) -> str:
    if META_RE.search(stimulus):
        return "ignore"
    if len(" ".join(responses).strip()) <= 3 and channel != "dm":
        return "short"
    if CONFLICT_RE.search(stimulus) and not responses:
        return "withdraw"
    return "engage"


def _is_held_out(thread_id: str) -> bool:
    h = int(episode_id([thread_id, "holdout"]), 16)
    return (h % HOLDOUT_MOD) == 0


def _channel(ep: dict[str, Any]) -> str:
    extra = ep.get("extra") or {}
    ch = str(extra.get("channel") or ep.get("source_family") or "unknown")
    if "dm" in ch or ep.get("source_family") == "discord_dm":
        return "dm"
    if ep.get("source_family") in {"chatgpt", "perplexity", "grok", "perplexity_identity"}:
        return "ai_chat"
    if "guild" in ch or ep.get("source_family") == "discord_guild":
        return "guild"
    return ch


def mine_episode(ep: dict[str, Any]) -> list[dict[str, Any]]:
    extra = ep.get("extra") or {}
    if not extra.get("twin_eligible", True):
        return []
    messages = ep.get("messages") or []
    if not messages:
        return []

    thread_id = str(ep.get("thread_id") or ep.get("id"))
    channel = _channel(ep)
    partner_id = str(extra.get("partner_id") or "")
    source_family = str(ep.get("source_family") or "unknown")
    held_out = _is_held_out(thread_id)

    cases: list[dict[str, Any]] = []
    pending_peer: list[str] = []

    def flush_case(stimulus: str, responses: list[dict[str, Any]]) -> None:
        stim_text = scrub_pii("\n".join(pending_peer[-3:])).strip()
        if len(stim_text) < 3:
            return
        resp_texts = [scrub_pii(str(r.get("text") or "")).strip() for r in responses]
        resp_texts = [t for t in resp_texts if t]
        if not resp_texts:
            return
        delivery = None
        for r in responses:
            raw = r.get("raw") or {}
            if isinstance(raw, dict) and raw.get("delivery"):
                delivery = raw["delivery"]
                break
        case = {
            "schema_version": 1,
            "id": episode_id([ep["id"], stim_text[:60], resp_texts[0][:40]]),
            "stimulus": stim_text,
            "stimulus_type": _stimulus_type(stim_text),
            "channel": channel,
            "partner_id": partner_id,
            "source_family": source_family,
            "thread_id": thread_id,
            "source_episode_ids": [ep["id"]],
            "boden_moves": _boden_moves(stim_text, resp_texts),
            "affect_tags": _affect_tags(" ".join(resp_texts), delivery),
            "topics": _topics(stim_text + " " + " ".join(resp_texts)),
            "response_messages": resp_texts,
            "response_count": len(resp_texts),
            "reference_time": ep.get("reference_time"),
            "held_out": held_out,
            "twin_eligible": True,
        }
        cases.append(case)

    i = 0
    while i < len(messages):
        msg = messages[i]
        role = str(msg.get("role") or "")
        text = str(msg.get("text") or "").strip()
        if role == "peer" and text:
            pending_peer.append(text)
            i += 1
            continue
        if role == "self" and text and pending_peer:
            responses = [msg]
            j = i + 1
            while j < len(messages) and str(messages[j].get("role")) == "self":
                t2 = str(messages[j].get("text") or "").strip()
                if t2:
                    responses.append(messages[j])
                j += 1
            flush_case("\n".join(pending_peer), responses)
            pending_peer = []
            i = j
            continue
        if role == "self":
            pending_peer = []
        i += 1

    return cases


def build_behavior_profile(cases: list[dict[str, Any]]) -> dict[str, Any]:
    by_channel: dict[str, Counter[str]] = defaultdict(Counter)
    by_stimulus: Counter[str] = Counter()
    by_move: Counter[str] = Counter()
    by_affect: Counter[str] = Counter()
    by_engagement: dict[str, Counter[str]] = defaultdict(Counter)
    burst_counts: Counter[int] = Counter()
    trigger_lexicon: dict[str, Counter[str]] = defaultdict(Counter)

    for c in cases:
        if c.get("held_out"):
            continue
        ch = c.get("channel") or "unknown"
        st = c.get("stimulus_type") or "unknown"
        by_channel[ch][st] += 1
        by_stimulus[st] += 1
        for m in c.get("boden_moves") or []:
            by_move[m] += 1
        for a in c.get("affect_tags") or []:
            by_affect[a] += 1
        eng = _engagement(
            c.get("stimulus") or "",
            c.get("response_messages") or [],
            ch,
        )
        by_engagement[ch][eng] += 1
        burst_counts[c.get("response_count") or 1] += 1
        for tok in tokenize(c.get("stimulus") or ""):
            if len(tok) >= 4:
                trigger_lexicon[ch][tok] += 1

    burst_policy: dict[str, Any] = {}
    for ch, eng in by_engagement.items():
        total = sum(eng.values()) or 1
        burst_policy[ch] = {
            "p_burst_gt1": sum(
                1 for c in cases if not c.get("held_out") and c.get("channel") == ch and (c.get("response_count") or 1) > 1
            )
            / max(sum(1 for c in cases if not c.get("held_out") and c.get("channel") == ch), 1),
            "engagement": {k: v / total for k, v in eng.items()},
        }

    top_triggers = {
        ch: [w for w, _ in ctr.most_common(40)] for ch, ctr in trigger_lexicon.items()
    }

    return {
        "schema_version": 1,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "case_count": len([c for c in cases if not c.get("held_out")]),
        "held_out_count": len([c for c in cases if c.get("held_out")]),
        "stimulus_types": dict(by_stimulus.most_common()),
        "boden_moves": dict(by_move.most_common()),
        "affect_tags": dict(by_affect.most_common()),
        "by_channel_stimulus": {ch: dict(v) for ch, v in by_channel.items()},
        "burst_policy": burst_policy,
        "trigger_lexicon": top_triggers,
        "gate_threshold_default": 0.35,
        "itt_params": {
            "top_k": 5,
            "cosine_min": 0.35,
            "dedup": 0.92,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="P2 case mining")
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    parser.add_argument("--episodes", type=Path, default=None)
    args = parser.parse_args()
    paths = ensure_dirs(args.data_root)
    ep_path = args.episodes or paths["episodes_jsonl"]
    if not ep_path.is_file():
        print(f"Missing {ep_path} — run segment_unified.py first", file=sys.stderr)
        return 1

    all_cases: list[dict[str, Any]] = []
    twin_eps = 0
    with ep_path.open("r", encoding="utf-8") as fh:
        for line in fh:
            if not line.strip():
                continue
            ep = json.loads(line)
            if (ep.get("extra") or {}).get("twin_eligible"):
                twin_eps += 1
            all_cases.extend(mine_episode(ep))

    paths["cases_jsonl"].write_text(
        "".join(json.dumps(c, ensure_ascii=False) + "\n" for c in all_cases),
        encoding="utf-8",
    )
    profile = build_behavior_profile(all_cases)
    paths["behavior_profile"].write_text(
        json.dumps(profile, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    held_out_dir = paths["held_out"]
    held_out_dir.mkdir(parents=True, exist_ok=True)
    held_threads = sorted({c["thread_id"] for c in all_cases if c.get("held_out")})
    (held_out_dir / "threads.json").write_text(
        json.dumps({"threads": held_threads, "count": len(held_threads)}, indent=2),
        encoding="utf-8",
    )

    audit = {
        "twin_eligible_episodes": twin_eps,
        "cases_total": len(all_cases),
        "cases_train": len([c for c in all_cases if not c.get("held_out")]),
        "cases_held_out": len([c for c in all_cases if c.get("held_out")]),
        "stimulus_types": profile.get("stimulus_types"),
        "output": str(paths["cases_jsonl"]),
    }
    audit_path = paths["cases"] / "p2_mine_audit.json"
    audit_path.write_text(json.dumps(audit, indent=2), encoding="utf-8")
    print(json.dumps(audit))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
