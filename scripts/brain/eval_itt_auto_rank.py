#!/usr/bin/env python3
"""Automated ITT ranking — LLM/heuristic judge, no human session required."""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from common import DEFAULT_DATA_ROOT, ensure_dirs, tokenize
from eval_common import (
    GENERIC_STUB,
    RAW_ASSISTANT_STUB,
    anti_assistant,
    load_case_bundle,
)


def load_probes(path: Path) -> list[dict[str, Any]]:
    probes: list[dict] = []
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            if line.strip():
                probes.append(json.loads(line))
    return probes


def _behavior_profile(data_root: Path) -> dict[str, Any]:
    path = data_root / "cases" / "behavior_profile.json"
    if path.is_file():
        return json.loads(path.read_text(encoding="utf-8"))
    return {}


def heuristic_score(
    candidate: dict[str, Any],
    probe: dict[str, Any],
    profile: dict[str, Any],
) -> float:
    text = (candidate.get("text") or "").strip()
    if not text:
        return -1000.0

    score = 0.0
    if text == RAW_ASSISTANT_STUB:
        score -= 120.0
    if text == GENERIC_STUB:
        score -= 90.0
    if anti_assistant(text):
        score -= 45.0

    parts = [p.strip() for p in text.split("---") if p.strip()]
    channel = str(probe.get("channel") or "dm")
    burst_p = float(
        (profile.get("burst_policy") or {}).get(channel, {}).get("p_burst_gt1", 0.5)
    )
    if len(parts) > 1:
        score += 8.0 + burst_p * 12.0

    raw_score = candidate.get("score")
    if raw_score is not None:
        score += min(float(raw_score), 50.0) * 0.45

    stim = set(tokenize(probe.get("stimulus") or ""))
    resp = set(tokenize(text))
    if stim and resp:
        score += (len(stim & resp) / len(stim)) * 6.0

    if len(text) < 24 and len(parts) == 1:
        score -= 8.0

    low = text.lower()
    for marker in ("wdym", "indeed", "nah", "lol", "hmu", "bro", "yeah"):
        if marker in low:
            score += 3.0

    if "https://" in text or "http://" in text:
        score += 4.0

    return score


def rank_heuristic(
    probe: dict[str, Any],
    profile: dict[str, Any],
) -> list[str]:
    candidates = probe.get("candidates") or []
    scored = [
        (heuristic_score(c, probe, profile), str(c.get("candidate_id") or ""))
        for c in candidates
    ]
    scored.sort(key=lambda x: (-x[0], x[1]))
    return [cid for _, cid in scored if cid]


def _parse_ranking_json(raw: str, valid_ids: set[str]) -> list[str] | None:
    text = raw.strip()
    if not text:
        return None
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            return None
        try:
            data = json.loads(match.group(0))
        except json.JSONDecodeError:
            return None

    ranking = data.get("ranking") if isinstance(data, dict) else data
    if not isinstance(ranking, list):
        return None
    ids = [str(x).strip() for x in ranking if str(x).strip()]
    if set(ids) == valid_ids and len(ids) == len(valid_ids):
        return ids
    return None


def rank_llm(
    probe: dict[str, Any],
    *,
    provider: str | None = None,
) -> list[str] | None:
    from graphiti_llm import _http_post_json, openrouter_model, resolve_provider_spec

    candidates = probe.get("candidates") or []
    ids = {str(c.get("candidate_id") or "") for c in candidates}
    ids.discard("")
    if not ids:
        return None

    lines = []
    for c in candidates:
        cid = c.get("candidate_id")
        body = (c.get("text") or "").replace("\n", " ")[:500]
        lines.append(f"[{cid}] {body}")

    user = (
        "Rank these Discord reply candidates from MOST to LEAST like Boden (PuritanWizard): "
        "direct, informal, sometimes multi-message bursts separated by ---, technical when "
        "relevant, never generic assistant tone.\n\n"
        f"Channel: {probe.get('channel')}  Type: {probe.get('stimulus_type')}\n\n"
        f"Stimulus:\n{(probe.get('stimulus') or '')[:1200]}\n\n"
        "Candidates:\n"
        + "\n".join(lines)
        + '\n\nRespond with JSON only: {"ranking":["c0","c1",...]} using every candidate id once.'
    )

    try:
        spec = resolve_provider_spec(provider)
    except RuntimeError:
        return None

    if spec.name == "gemini":
        return None

    model = spec.llm_model
    url = f"{spec.llm_base_url.rstrip('/')}/chat/completions"
    headers = {"Authorization": f"Bearer {spec.llm_api_key}"}
    if spec.name == "openrouter":
        from graphiti_llm import OPENROUTER_HEADERS

        headers.update(OPENROUTER_HEADERS)
        model = openrouter_model()

    code, payload = _http_post_json(
        url,
        headers,
        {
            "model": model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are an ITT evaluation judge. Output valid JSON only.",
                },
                {"role": "user", "content": user},
            ],
            "temperature": 0.0,
            "max_tokens": 256,
            "response_format": {"type": "json_object"},
        },
    )
    if code != 200 or not isinstance(payload, dict):
        return None

    content = (
        payload.get("choices", [{}])[0]
        .get("message", {})
        .get("content", "")
    )
    return _parse_ranking_json(str(content), ids)


def auto_rank_probe(
    probe: dict[str, Any],
    profile: dict[str, Any],
    *,
    judge: str,
    provider: str | None,
) -> tuple[list[str], str]:
    candidates = probe.get("candidates") or []
    valid = {str(c.get("candidate_id") or "") for c in candidates}
    valid.discard("")

    if judge in {"llm", "auto"}:
        ranking = rank_llm(probe, provider=provider)
        if ranking:
            return ranking, "llm"

    ranking = rank_heuristic(probe, profile)
    if set(ranking) != valid:
        ranking = [str(c.get("candidate_id")) for c in candidates]
    return ranking, "heuristic"


def build_session(
    *,
    pack: Path,
    data_root: Path,
    judge: str = "auto",
    provider: str | None = None,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    probes = load_probes(pack)
    profile = _behavior_profile(data_root)
    judges_used: dict[str, int] = {"llm": 0, "heuristic": 0}
    rows: list[dict[str, Any]] = []

    for probe in probes:
        ranking, used = auto_rank_probe(
            probe, profile, judge=judge, provider=provider
        )
        judges_used[used] = judges_used.get(used, 0) + 1
        rows.append(
            {
                "probe_id": probe.get("probe_id"),
                "case_id": probe.get("case_id"),
                "stimulus_type": probe.get("stimulus_type"),
                "ranking": ranking,
                "ranked_at": datetime.now(timezone.utc).isoformat(),
                "judge": used,
            }
        )

    meta = {
        "judge_mode": judge,
        "judges_used": judges_used,
        "probe_count": len(rows),
    }
    return rows, meta


def main() -> int:
    parser = argparse.ArgumentParser(description="Automated ITT ranking session")
    parser.add_argument(
        "--pack",
        type=Path,
        default=DEFAULT_DATA_ROOT / "eval" / "itt_packs" / "pack_seed42.human.jsonl",
    )
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    parser.add_argument(
        "--judge",
        choices=("auto", "llm", "heuristic"),
        default="auto",
        help="auto=LLM with heuristic fallback",
    )
    parser.add_argument("--provider", default=None, help="LLM provider when judge uses llm")
    parser.add_argument("--out", type=Path, default=None)
    args = parser.parse_args()

    if not args.pack.is_file():
        print(f"Missing pack: {args.pack}", file=sys.stderr)
        return 1

    paths = ensure_dirs(args.data_root)
    rows, meta = build_session(
        pack=args.pack,
        data_root=args.data_root,
        judge=args.judge,
        provider=args.provider,
    )

    out = args.out or (
        paths["eval"]
        / "itt_rankings"
        / f"auto_{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S')}.jsonl"
    )
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", encoding="utf-8") as fh:
        for row in rows:
            fh.write(json.dumps(row, ensure_ascii=False) + "\n")

    print(
        json.dumps(
            {
                "ok": True,
                "rankings": str(out),
                **meta,
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
