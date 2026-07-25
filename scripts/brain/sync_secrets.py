#!/usr/bin/env python3
"""Normalize ~/.config/secrets.env for Boden brain LLM keys."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

SECRETS_PATH = Path.home() / ".config" / "secrets.env"
BRAIN_DEFAULTS = {
    "BRAIN_ENABLED": "true",
    "BRAIN_DATA_ROOT": str(Path.home() / "brain-data"),
    "BRAIN_NEO4J_URI": "bolt://127.0.0.1:7687",
    "BRAIN_NEO4J_USER": "neo4j",
    "BRAIN_NEO4J_PASSWORD": "brain-change-me",
    "BRAIN_LOCAL_LLM_ENABLED": "false",
    "BRAIN_LLM_PROVIDER": "auto",
    "BRAIN_LLM_FALLBACKS": "openrouter,gemini,xai,groq,huggingface,mistral,deepseek,together,anthropic",
    "BRAIN_OPENROUTER_MODEL": "openrouter/free",
}

LLM_KEYS = (
    "OPENROUTER_API_KEY",
    "HF_TOKEN",
    "HUGGINGFACEHUB_API_TOKEN",
    "HUGGINGFACE_API_TOKEN",
    "HUGGINGFACE_ACCESS_TOKEN",
    "GEMINI_API_KEY",
    "GOOGLE_API_KEY",
    "GOOGLE_AI_STUDIO_API_KEY",
    "XAI_API_KEY",
    "GROK_API_KEY",
    "MISTRAL_API_KEY",
    "MISTRALAI_API_KEY",
    "OPENAI_API_KEY",
    "GROQ_API_KEY",
    "ANTHROPIC_API_KEY",
    "DEEPSEEK_API_KEY",
    "TOGETHERAI_API_KEY",
    "TOGETHER_API_KEY",
    "JINA_API_KEY",
    *BRAIN_DEFAULTS.keys(),
)


def parse_hf_stored_tokens() -> dict[str, str]:
    path = Path.home() / ".cache/huggingface/stored_tokens"
    if not path.is_file():
        return {}
    out: dict[str, str] = {}
    for block in re.split(r"\n(?=\[)", path.read_text(encoding="utf-8", errors="replace").strip()):
        match = re.match(r"\[([^\]]+)\]", block)
        if not match:
            continue
        token_match = re.search(r"hf_token\s*=\s*(\S+)", block)
        if token_match:
            out[match.group(1)] = token_match.group(1).strip()
    return out


def collect_key_candidates(prefix: str) -> list[str]:
    """Gather duplicate key values from secrets file, backups, and temp discovery files."""
    candidates: list[str] = []
    seen_paths: set[str] = set()

    def add_from_text(text: str) -> None:
        for line in text.splitlines():
            s = line.strip()
            if not s.startswith(f"{prefix}="):
                continue
            val = s.split("=", 1)[1].strip().strip('"').strip("'")
            if val and not val.startswith("$"):
                candidates.append(val)

    for path in [SECRETS_PATH, *SECRETS_PATH.parent.glob("secrets.env.bak.*")]:
        key = str(path)
        if key in seen_paths or not path.is_file():
            continue
        seen_paths.add(key)
        add_from_text(path.read_text(encoding="utf-8", errors="replace"))

    tmp = Path("/tmp/openrouter_key_found.txt")
    if tmp.is_file():
        candidates.insert(0, tmp.read_text(encoding="utf-8").strip())

    return candidates


def parse_secrets(path: Path) -> dict[str, str]:
    out: dict[str, str] = {}
    if not path.is_file():
        return out
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        s = line.strip()
        if not s or s.startswith("#") or "=" not in s:
            continue
        k, v = s.split("=", 1)
        k = k.strip()
        v = v.strip().strip('"').strip("'")
        if v.startswith("$"):
            continue
        if v:
            out[k] = v  # last duplicate wins while parsing
    return out


def discover_sources() -> dict[str, str]:
    found: dict[str, str] = {}
    # Explicit process env wins — never overwrite from file discovery
    for name in LLM_KEYS:
        val = os.environ.get(name, "").strip()
        if val and not val.startswith("$"):
            found[name] = val

    secrets = parse_secrets(SECRETS_PATH)
    for k, v in secrets.items():
        found.setdefault(k, v)

    cache = Path.home() / ".cache/huggingface/token"
    if cache.is_file():
        tok = cache.read_text(encoding="utf-8").strip()
        if tok:
            found.setdefault("HF_TOKEN", tok)

    for name, tok in parse_hf_stored_tokens().items():
        found.setdefault(f"HF_TOKEN__{name}", tok)
        found.setdefault("HF_TOKEN", tok)

    try:
        synth = subprocess.check_output(
            ["podman", "exec", "synthora-api-1", "printenv", "HF_TOKEN"],
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
        if synth:
            found.setdefault("HF_TOKEN", synth)
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass

    return found


def _probe_openrouter_auth(key: str) -> bool:
    if not key:
        return False
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/auth/key",
        headers={"Authorization": f"Bearer {key}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.status == 200
    except urllib.error.HTTPError:
        return False


def _probe_openrouter_chat(key: str) -> bool:
    if not key:
        return False
    body = json.dumps(
        {
            "model": "openrouter/free",
            "messages": [{"role": "user", "content": "ok"}],
            "max_tokens": 3,
        }
    ).encode()
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=body,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://bolabaden.org",
            "X-Title": "Boden Brain",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            return resp.status == 200
    except urllib.error.HTTPError:
        return False


def _probe_openrouter(key: str) -> bool:
    return _probe_openrouter_chat(key) or _probe_openrouter_auth(key)


def _probe_hf(key: str) -> bool:
    if not key:
        return False
    body = json.dumps(
        {
            "model": "meta-llama/Llama-3.1-8B-Instruct",
            "messages": [{"role": "user", "content": "ok"}],
            "max_tokens": 3,
        }
    ).encode()
    req = urllib.request.Request(
        "https://router.huggingface.co/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            return resp.status == 200
    except urllib.error.HTTPError:
        return False


def _probe_hf_code(key: str) -> int:
    if not key:
        return 0
    body = json.dumps(
        {
            "model": "meta-llama/Llama-3.1-8B-Instruct",
            "messages": [{"role": "user", "content": "ok"}],
            "max_tokens": 3,
        }
    ).encode()
    req = urllib.request.Request(
        "https://router.huggingface.co/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            return resp.status
    except urllib.error.HTTPError as exc:
        return exc.code


def _probe_mistral(key: str) -> bool:
    if not key:
        return False
    body = json.dumps(
        {
            "model": "mistral-small-latest",
            "messages": [{"role": "user", "content": "ok"}],
            "max_tokens": 3,
        }
    ).encode()
    req = urllib.request.Request(
        "https://api.mistral.ai/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            return resp.status == 200
    except urllib.error.HTTPError:
        return False


def _probe_xai(key: str) -> bool:
    if not key or not key.startswith("xai-"):
        return False
    body = json.dumps(
        {
            "model": "grok-3-fast",
            "messages": [{"role": "user", "content": "ok"}],
            "max_tokens": 3,
        }
    ).encode()
    req = urllib.request.Request(
        "https://api.x.ai/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            return resp.status == 200
    except urllib.error.HTTPError:
        return False


def pick_best_xai(candidates: list[str]) -> str:
    seen: set[str] = set()
    for key in candidates:
        k = (key or "").strip()
        if not k or k in seen or not k.startswith("xai-"):
            continue
        seen.add(k)
        if _probe_xai(k):
            return k
    xai = [c.strip() for c in candidates if c and c.strip().startswith("xai-")]
    return xai[0] if xai else ""


def pick_best_or_key(candidates: list[str]) -> str:
    seen: set[str] = set()
    auth_only: str = ""
    for key in candidates:
        k = (key or "").strip()
        if not k or k in seen:
            continue
        seen.add(k)
        if _probe_openrouter_chat(k):
            return k
        if not auth_only and _probe_openrouter_auth(k):
            auth_only = k
    return auth_only or (candidates[0] if candidates else "")


def pick_best_hf(candidates: list[str]) -> str:
    seen: set[str] = set()
    best_code = 0
    best_key = ""
    for key in candidates:
        k = (key or "").strip()
        if not k or k in seen:
            continue
        seen.add(k)
        code = _probe_hf_code(k)
        if code == 200:
            return k
        if code == 402 and not best_key:
            best_key = k
            best_code = code
        elif code not in {0, 401} and not best_key:
            best_key = k
            best_code = code
    if best_key:
        return best_key
    oauth = [c for c in candidates if c and c.strip().startswith("hf_oauth_")]
    if oauth:
        return oauth[0].strip()
    return candidates[0] if candidates else ""


def normalize(found: dict[str, str]) -> dict[str, str]:
    out = dict(found)

    or_candidates = [os.environ.get("OPENROUTER_API_KEY", ""), found.get("OPENROUTER_API_KEY", "")]
    or_candidates.extend(collect_key_candidates("OPENROUTER_API_KEY"))
    out["OPENROUTER_API_KEY"] = pick_best_or_key([c for c in or_candidates if c])

    hf_candidates = [os.environ.get("HF_TOKEN", ""), found.get("HF_TOKEN", "")]
    for tok in parse_hf_stored_tokens().values():
        hf_candidates.insert(0, tok)
    hf_candidates.extend(collect_key_candidates("HF_TOKEN"))
    cache = Path.home() / ".cache/huggingface/token"
    if cache.is_file():
        hf_candidates.append(cache.read_text(encoding="utf-8").strip())
    hf = pick_best_hf([c for c in hf_candidates if c])
    if hf:
        out["HF_TOKEN"] = hf
        out["HUGGINGFACEHUB_API_TOKEN"] = hf
        out["HUGGINGFACE_API_TOKEN"] = hf
        out["HUGGINGFACE_ACCESS_TOKEN"] = hf

    if out.get("GEMINI_API_KEY") and not out.get("GOOGLE_API_KEY"):
        out["GOOGLE_API_KEY"] = out["GEMINI_API_KEY"]
    if out.get("GOOGLE_API_KEY") and not out.get("GEMINI_API_KEY"):
        out["GEMINI_API_KEY"] = out["GOOGLE_API_KEY"]
    if out.get("MISTRAL_API_KEY") and not out.get("MISTRALAI_API_KEY"):
        out["MISTRALAI_API_KEY"] = out["MISTRAL_API_KEY"]
    if out.get("MISTRALAI_API_KEY") and not out.get("MISTRAL_API_KEY"):
        out["MISTRAL_API_KEY"] = out["MISTRALAI_API_KEY"]

    xai_candidates = [
        os.environ.get("XAI_API_KEY", ""),
        found.get("XAI_API_KEY", ""),
        found.get("GROK_API_KEY", ""),
    ]
    xai_candidates.extend(collect_key_candidates("XAI_API_KEY"))
    xai_candidates.extend(collect_key_candidates("GROK_API_KEY"))
    xai = pick_best_xai([c for c in xai_candidates if c and not str(c).startswith("$")])
    if xai:
        out["XAI_API_KEY"] = xai
        out["GROK_API_KEY"] = xai

    groq_candidates = [os.environ.get("GROQ_API_KEY", ""), found.get("GROQ_API_KEY", "")]
    groq_candidates.extend(collect_key_candidates("GROQ_API_KEY"))
    # Some secrets files mislabel Groq keys as GROK_API_KEY
    for val in collect_key_candidates("GROK_API_KEY"):
        if val.startswith("gsk_"):
            groq_candidates.append(val)
    groq = next((c for c in groq_candidates if c and c.startswith("gsk_")), "")
    if groq:
        out["GROQ_API_KEY"] = groq

    for k, v in BRAIN_DEFAULTS.items():
        out[k] = v  # managed block owns canonical brain defaults

    return out


def write_secrets(values: dict[str, str], *, dry_run: bool = False) -> None:
    existing_lines: list[str] = []
    if SECRETS_PATH.is_file():
        existing_lines = SECRETS_PATH.read_text(encoding="utf-8", errors="replace").splitlines()

    remove = set(LLM_KEYS)
    kept = [ln for ln in existing_lines if not any(ln.strip().startswith(f"{k}=") for k in remove)]

    block = ["", "# --- Boden brain LLM (managed by scripts/brain/llm_providers.py sync-secrets) ---"]
    for k in LLM_KEYS:
        if values.get(k):
            block.append(f'{k}="{values[k]}"')

    new_content = "\n".join([*kept, *block]).rstrip() + "\n"
    if dry_run:
        print(new_content)
        return
    SECRETS_PATH.parent.mkdir(parents=True, exist_ok=True)
    if SECRETS_PATH.is_file():
        backup = SECRETS_PATH.with_suffix(f".env.bak.{os.getpid()}")
        backup.write_text(SECRETS_PATH.read_text(encoding="utf-8"), encoding="utf-8")
    SECRETS_PATH.write_text(new_content, encoding="utf-8")
    SECRETS_PATH.chmod(0o600)

    hf = values.get("HF_TOKEN")
    if hf:
        cache = Path.home() / ".cache/huggingface"
        cache.mkdir(parents=True, exist_ok=True)
        (cache / "token").write_text(hf + "\n", encoding="utf-8")


def cmd_sync(args: argparse.Namespace) -> int:
    found = discover_sources()
    normalized = normalize(found)
    write_secrets(normalized, dry_run=args.dry_run)
    or_key = normalized.get("OPENROUTER_API_KEY", "")
    hf_key = normalized.get("HF_TOKEN", "")
    report = {
        "openrouter_auth_ok": _probe_openrouter_auth(or_key),
        "openrouter_chat_ok": _probe_openrouter_chat(or_key),
        "openrouter_ok": _probe_openrouter(or_key),
        "hf_ok": _probe_hf(hf_key),
        "mistral_ok": _probe_mistral(normalized.get("MISTRAL_API_KEY", "")),
        "active_provider_hint": (
            "openrouter"
            if _probe_openrouter_chat(or_key)
            else "mistral"
            if _probe_mistral(normalized.get("MISTRAL_API_KEY", ""))
            else "xai"
            if _probe_xai(normalized.get("XAI_API_KEY", ""))
            else "none_chat_ready"
        ),
        "keys_written": {k: bool(normalized.get(k)) for k in LLM_KEYS},
    }
    print(json.dumps(report, indent=2))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    return cmd_sync(args)


if __name__ == "__main__":
    raise SystemExit(main())
