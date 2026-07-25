#!/usr/bin/env python3
"""Build BM25 index over mined cases for P3 select-mode retrieval."""

from __future__ import annotations

import argparse
import json
import pickle
import sys
from pathlib import Path

from common import DEFAULT_DATA_ROOT, ensure_dirs, tokenize

try:
    from rank_bm25 import BM25Okapi
except ImportError:  # pragma: no cover
    BM25Okapi = None  # type: ignore


def load_cases(path: Path) -> list[dict]:
    out: list[dict] = []
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            if line.strip():
                out.append(json.loads(line))
    return out


def case_search_text(c: dict) -> str:
    parts = [
        c.get("stimulus") or "",
        c.get("stimulus_type") or "",
        " ".join(c.get("topics") or []),
        " ".join(c.get("boden_moves") or []),
        c.get("channel") or "",
    ]
    return "\n".join(parts)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    args = parser.parse_args()
    paths = ensure_dirs(args.data_root)
    if BM25Okapi is None:
        print("rank-bm25 missing", file=sys.stderr)
        return 1
    if not paths["cases_jsonl"].is_file():
        print("Missing cases.jsonl — run mine_cases.py", file=sys.stderr)
        return 1

    cases = load_cases(paths["cases_jsonl"])
    train = [c for c in cases if not c.get("held_out")]
    tokens = [tokenize(case_search_text(c)) for c in train]
    bm25 = BM25Okapi(tokens)
    slim = [
        {
            "id": c["id"],
            "stimulus": c.get("stimulus"),
            "stimulus_type": c.get("stimulus_type"),
            "channel": c.get("channel"),
            "partner_id": c.get("partner_id"),
            "source_family": c.get("source_family"),
            "boden_moves": c.get("boden_moves"),
            "affect_tags": c.get("affect_tags"),
            "topics": c.get("topics"),
            "response_messages": c.get("response_messages"),
            "response_count": c.get("response_count"),
            "source_episode_ids": c.get("source_episode_ids"),
            "reference_time": c.get("reference_time"),
        }
        for c in train
    ]
    with paths["case_bm25_pkl"].open("wb") as fh:
        pickle.dump({"bm25": bm25, "cases": slim}, fh)

    meta = {
        "backend": "bm25",
        "case_count": len(train),
        "held_out_excluded": len(cases) - len(train),
    }
    (paths["index"] / "cases_bm25_meta.json").write_text(
        json.dumps(meta, indent=2), encoding="utf-8"
    )
    print(json.dumps(meta))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
