---
source_url: "https://grok.com/c/b3dbb352-7ea9-4918-922c-2ccecb23756f"
conversation_id: "b3dbb352-7ea9-4918-922c-2ccecb23756f"
title: "Transcript Delta Analyzer with Needle Search"
extracted_at: "2026-06-29T16:09:55.968Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Transcript Delta Analyzer with Needle Search

Source: [Grok conversation](https://grok.com/c/b3dbb352-7ea9-4918-922c-2ccecb23756f)

## User

_Time: 2026-03-24T04:41:05.156Z_

```
import json, os, re, hashlib
from collections import Counter, defaultdict
base = r'C:\\Users\\boden\\.cursor\\projects\\c-GitHub-PyKotor\\agent-transcripts'
idx_path = r'C:\\GitHub\\PyKotor\\.cursor\\hooks\\state\\continual-learning-index.json'
with open(idx_path, encoding='utf-8') as f:
    idx = json.load(f)
old = idx.get('transcripts', {})
paths = []
for r, _, fs in os.walk(base):
    for fn in fs:
        if fn.endswith('.jsonl'):
            paths.append(os.path.join(r, fn))
paths.sort()
delta = []
for p in paths:
    m = int(os.path.getmtime(p) * 1000)
    rec = old.get(p)
    if rec is None or m > rec.get('mtimeMs', 0):
        delta.append(p)
print('total', len(paths), 'delta', len(delta))

def user_text(line_obj):
    if line_obj.get('role') != 'user':
        return None
    msg = line_obj.get('message') or {}
    content = msg.get('content')
    if not content:
        return None
    parts = []
    for block in content:
        if isinstance(block, dict) and block.get('type') == 'text':
            t = block.get('text') or ''
            if t:
                parts.append(t)
    text = '\n'.join(parts).strip()
    if not text:
        return None
    m2 = re.search(r'<user_query>\\s*(.*?)\\s*</user_query>', text, re.DOTALL)
    if m2:
        text = m2.group(1).strip()
    elif '<cursor_commands>' in text:
        text = text.split('<cursor_commands>', 1)[0].strip()
    return text

# Mine delta only
needles = [
    'no PR', 'commit and push', 'without PR', 'direct commit',
    'plan file', 'only the plan', 'do not execute', 'NEVER CODE', 'no wiki',
    'submodule', 'check-broken', 'lychee', 'BWM', 'authoritative-bwm',
    'AGENTS.md', 'continual-learning', 'PowerShell', 'Set-Location', 'cd /d',
    'Firecrawl', 'convertui', '.ui file',
]
needle_counts = Counter()
files_with = defaultdict(set)
parent_uuids = set()
for p in delta:
    parent = p.split(os.sep)[-2] if 'subagents' not in p else None
    try:
        with open(p, encoding='utf-8', errors='replace') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    o = json.loads(line)
                except json.JSONDecodeError:
                    continue
                t = user_text(o)
                if not t:
                    continue
                tl = t.lower()
                for n in needles:
                    if n.lower() in tl:
                        needle_counts[n] += 1
                        files_with[n].add(p)
                if parent:
                    parent_uuids.add(parent)
    except OSError as e:
        print('err', p, e)
print('--- needle hits (message lines) ---')
for n, c in needle_counts.most_common():
    print(c, n, 'files', len(files_with[n]))
```

write this as a python script indented properly using bets practices.

## Assistant

_Time: 2026-03-24T04:41:14.754Z_

```python
#!/usr/bin/env python3
"""
Transcript Delta Analyzer for Continual Learning Index

Scans the agent-transcripts directory for new or modified .jsonl files
(compared to the saved index), then analyzes user messages for specific
"needles" (keywords/phrases) related to agent behavior, workflows,
and special instructions.

Outputs statistics on needle occurrences and which files contain them.
"""

import json
import os
import re
import hashlib  # kept for potential future use (e.g., content hashing)
from collections import Counter, defaultdict
from pathlib import Path
from typing import Dict, List, Optional, Set


# ========================= CONFIGURATION =========================

BASE_TRANSCRIPTS_DIR: str = r"C:\Users\boden\.cursor\projects\c-GitHub-PyKotor\agent-transcripts"
INDEX_PATH: str = r"C:\GitHub\PyKotor\.cursor\hooks\state\continual-learning-index.json"

NEEDLES: List[str] = [
    "no PR",
    "commit and push",
    "without PR",
    "direct commit",
    "plan file",
    "only the plan",
    "do not execute",
    "NEVER CODE",
    "no wiki",
    "submodule",
    "check-broken",
    "lychee",
    "BWM",
    "authoritative-bwm",
    "AGENTS.md",
    "continual-learning",
    "PowerShell",
    "Set-Location",
    "cd /d",
    "Firecrawl",
    "convertui",
    ".ui file",
]


# ========================= HELPER FUNCTIONS =========================

def load_index() -> Dict:
    """Load the continual-learning index JSON file."""
    idx_path = Path(INDEX_PATH)
    if not idx_path.exists():
        print(f"Warning: Index file not found at {INDEX_PATH}. Starting with empty index.")
        return {"transcripts": {}}

    try:
        with open(idx_path, encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        print(f"Error loading index: {e}. Starting with empty index.")
        return {"transcripts": {}}


def get_all_transcript_paths(base_dir: str) -> List[str]:
    """Recursively find all .jsonl files in the transcripts directory."""
    base_path = Path(base_dir)
    if not base_path.exists():
        raise FileNotFoundError(f"Transcripts base directory not found: {base_dir}")

    paths: List[str] = []
    for root, _, files in os.walk(base_path):
        for filename in files:
            if filename.endswith(".jsonl"):
                paths.append(str(Path(root) / filename))

    paths.sort()
    return paths


def extract_user_text(line_obj: Dict) -> Optional[str]:
    """
    Extract clean user text from a transcript line object.
    Handles nested content structure and special tags like <user_query>.
    """
    if line_obj.get("role") != "user":
        return None

    msg = line_obj.get("message") or {}
    content = msg.get("content")
    if not content or not isinstance(content, list):
        return None

    parts: List[str] = []
    for block in content:
        if isinstance(block, dict) and block.get("type") == "text":
            text = block.get("text") or ""
            if text:
                parts.append(text)

    text = "\n".join(parts).strip()
    if not text:
        return None

    # Extract content inside <user_query> tags if present
    m = re.search(r"<user_query>\s*(.*?)\s*</user_query>", text, re.DOTALL | re.IGNORECASE)
    if m:
        text = m.group(1).strip()

    # Strip everything after <cursor_commands> if present
    elif "<cursor_commands>" in text:
        text = text.split("<cursor_commands>", 1)[0].strip()

    return text if text else None


# ========================= MAIN ANALYSIS =========================

def main() -> None:
    print("=== Transcript Delta Analyzer ===\n")

    # Load previous index
    idx = load_index()
    old: Dict = idx.get("transcripts", {})

    # Discover all current transcript files
    try:
        all_paths = get_all_transcript_paths(BASE_TRANSCRIPTS_DIR)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        return

    print(f"Total .jsonl files found: {len(all_paths)}")

    # Determine delta (new or modified files)
    delta: List[str] = []
    for p in all_paths:
        mtime_ms = int(os.path.getmtime(p) * 1000)
        rec = old.get(p)

        if rec is None or mtime_ms > rec.get("mtimeMs", 0):
            delta.append(p)

    print(f"Files to analyze (delta): {len(delta)}\n")

    if not delta:
        print("No new or modified transcripts since last index. Nothing to analyze.")
        return

    # Analyze needles in delta files only
    needle_counts: Counter = Counter()
    files_with: defaultdict = defaultdict(set)
    parent_uuids: Set[str] = set()

    for p in delta:
        # Extract parent UUID (directory name) if not in subagents
        parent = None
        path_obj = Path(p)
        if "subagents" not in p:
            try:
                parent = path_obj.parent.name
            except Exception:
                pass

        try:
            with open(p, encoding="utf-8", errors="replace") as f:
                for line_num, line in enumerate(f, 1):
                    line = line.strip()
                    if not line:
                        continue

                    try:
                        obj = json.loads(line)
                    except json.JSONDecodeError:
                        continue  # Skip malformed lines

                    user_text = extract_user_text(obj)
                    if not user_text:
                        continue

                    text_lower = user_text.lower()

                    for needle in NEEDLES:
                        if needle.lower() in text_lower:
                            needle_counts[needle] += 1
                            files_with[needle].add(p)

                    if parent:
                        parent_uuids.add(parent)

        except OSError as e:
            print(f"Error reading file {p}: {e}")

    # ========================= OUTPUT RESULTS =========================

    print("--- Needle Hits (across user message lines) ---")
    if not needle_counts:
        print("No needle matches found in the delta files.")
    else:
        for needle, count in needle_counts.most_common():
            unique_files = len(files_with[needle])
            print(f"{count:4d} × {needle:<25}  (in {unique_files} file{'s' if unique_files > 1 else ''})")

    print(f"\nUnique parent UUIDs encountered: {len(parent_uuids)}")
    if parent_uuids:
        print("Sample:", sorted(list(parent_uuids))[:10])

    print("\nAnalysis complete.")


if __name__ == "__main__":
    main()
```

### Key Improvements & Best Practices Applied:

- **Shebang + Docstring** at the top for clarity and executability.
- **Clear configuration section** with constants at the top.
- **Type hints** throughout for better readability and IDE support.
- **Pathlib** used where appropriate for modern path handling.
- **Robust error handling** (missing index, missing directory, malformed JSON, encoding issues).
- **Descriptive function names** and detailed docstrings.
- **Early returns** and clean control flow.
- **Improved output formatting** with aligned columns and plural handling.
- **Case-insensitive** needle matching while preserving original needle in output.
- **Separation of concerns** (loading, discovery, extraction, analysis, output).
- **Comments** explaining non-obvious sections.

You can save this as `analyze_transcript_delta.py` and run it directly. It is production-ready, readable, and maintainable.
