"""Resolve Graphiti LLM/embedder clients — cloud-first, local opt-in."""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any

DEFAULT_FALLBACKS = "openrouter,gemini,xai,groq,huggingface,mistral,deepseek,together,anthropic"
DEFAULT_OPENROUTER_MODEL = "openrouter/free"
LOCAL_PROVIDERS = frozenset({"ollama", "lmstudio"})
OPENROUTER_FREE_MODELS = (
    "openrouter/free",
    "openrouter/auto",
    "meta-llama/llama-3.2-3b-instruct:free",
    "google/gemma-2-9b-it:free",
    "qwen/qwen-2.5-7b-instruct:free",
)
HF_CHAT_MODELS = (
    "meta-llama/Llama-3.1-8B-Instruct",
    "meta-llama/Llama-3.2-3B-Instruct",
)
XAI_CHAT_MODELS = ("grok-3-fast", "grok-3", "grok-2")
GROQ_CHAT_MODELS = ("llama-3.1-8b-instant", "llama-3.3-70b-versatile")
DEEPSEEK_CHAT_MODELS = ("deepseek-chat",)
TOGETHER_CHAT_MODELS = ("meta-llama/Llama-3.2-3B-Instruct-Turbo",)
GEMINI_CHAT_MODELS = ("gemini-2.0-flash", "gemini-2.5-flash-lite")
OPENROUTER_HEADERS = {
    "HTTP-Referer": "https://bolabaden.org",
    "X-Title": "Boden Brain",
}


@dataclass(frozen=True)
class ProviderSpec:
    name: str
    llm_base_url: str
    llm_api_key: str
    llm_model: str
    llm_small_model: str
    embed_base_url: str
    embed_api_key: str
    embed_model: str
    embed_dim: int
    structured_output_mode: str = "json_schema"


def _load_brain_env() -> None:
    """Load secrets file without overriding explicit process env."""
    try:
        from dotenv import load_dotenv  # type: ignore
    except ImportError:
        return
    for path in (
        Path(os.environ.get("SECRETS_PATH", "")),
        Path(os.environ.get("SECRETS_DIR", "")) / "secrets.env",
        Path.home() / ".config" / "secrets.env",
    ):
        if path.is_file():
            load_dotenv(path, override=False)


def _env_raw(name: str) -> str:
    """Read env var without loading secrets file (true process env only)."""
    value = os.environ.get(name, "").strip()
    return value if value and not value.startswith("$") else ""


def _first_env(*names: str) -> str:
    for name in names:
        value = _env_raw(name)
        if value:
            return value
    _load_brain_env()
    for name in names:
        value = os.environ.get(name, "").strip()
        if value and not value.startswith("$"):
            return value
    return ""


def hf_token() -> str:
    token = _first_env(
        "HF_TOKEN",
        "HUGGINGFACEHUB_API_TOKEN",
        "HUGGINGFACE_API_TOKEN",
        "HUGGINGFACE_ACCESS_TOKEN",
    )
    if token:
        return token
    cache = Path.home() / ".cache/huggingface/token"
    if cache.is_file():
        return cache.read_text(encoding="utf-8").strip()
    try:
        from sync_secrets import parse_hf_stored_tokens

        oauth = parse_hf_stored_tokens()
        if oauth:
            return next(iter(oauth.values()))
    except ImportError:
        pass
    return ""


def _truthy(name: str, default: bool = False) -> bool:
    raw = _env_raw(name)
    if raw:
        return raw.lower() in {"1", "true", "yes", "on"}
    _load_brain_env()
    raw = os.environ.get(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def local_llm_enabled() -> bool:
    return _truthy("BRAIN_LOCAL_LLM_ENABLED", default=False)


def ollama_base_url() -> str:
    base = _first_env("OLLAMA_BASE_URL", "BRAIN_OLLAMA_BASE_URL")
    return (base or "http://127.0.0.1:11434").rstrip("/")


def lmstudio_base_url() -> str:
    base = _first_env("LMSTUDIO_API_BASE", "LM_STUDIO_API_BASE", "BRAIN_LMSTUDIO_BASE_URL")
    return (base or "http://127.0.0.1:1234").rstrip("/")


def _ollama_reachable(base: str) -> bool:
    if not local_llm_enabled():
        return False
    try:
        with urllib.request.urlopen(f"{base}/api/tags", timeout=2) as resp:
            return resp.status == 200
    except (urllib.error.URLError, TimeoutError, OSError):
        return False


def _http_get_json(url: str, headers: dict[str, str], *, timeout: int = 20) -> tuple[int, Any]:
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
            return resp.status, json.loads(raw) if raw else None
    except urllib.error.HTTPError as exc:
        try:
            payload = json.loads(exc.read().decode("utf-8", errors="replace"))
        except json.JSONDecodeError:
            payload = exc.reason
        return exc.code, payload


def _http_post_json(url: str, headers: dict[str, str], body: dict[str, Any], *, timeout: int = 20) -> tuple[int, Any]:
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers={**headers, "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
            return resp.status, json.loads(raw) if raw else None
    except urllib.error.HTTPError as exc:
        try:
            payload = json.loads(exc.read().decode("utf-8", errors="replace"))
        except json.JSONDecodeError:
            payload = exc.reason
        return exc.code, payload


def openrouter_model() -> str:
    return _first_env("BRAIN_OPENROUTER_MODEL") or DEFAULT_OPENROUTER_MODEL


def _provider_chat_model(default: str) -> str:
    override = _first_env("BRAIN_LLM_MODEL")
    if not override or override.startswith("openrouter/"):
        return default
    return override


def _openai_chat_probe(
    *,
    url: str,
    api_key: str,
    model: str,
    extra_headers: dict[str, str] | None = None,
) -> tuple[int, Any]:
    headers = {"Authorization": f"Bearer {api_key}"}
    if extra_headers:
        headers.update(extra_headers)
    return _http_post_json(
        url,
        headers,
        {"model": model, "messages": [{"role": "user", "content": "ok"}], "max_tokens": 4},
    )


def _gemini_probe(api_key: str, model: str) -> tuple[int, Any]:
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        f"?key={api_key}"
    )
    return _http_post_json(url, {}, {"contents": [{"parts": [{"text": "ok"}]}]})


def _embed_fallback() -> tuple[str, str, str, int]:
    """Return (embed_base_url, embed_api_key, embed_model, embed_dim)."""
    embed_base = _first_env("BRAIN_EMBED_BASE_URL")
    embed_model = _first_env("BRAIN_EMBED_MODEL")
    embed_dim = int(_first_env("BRAIN_EMBED_DIM") or "1024")
    mistral_key = _first_env("MISTRAL_API_KEY", "MISTRALAI_API_KEY")
    or_key = _first_env("OPENROUTER_API_KEY")
    if embed_base:
        return (
            embed_base,
            _first_env("BRAIN_EMBED_API_KEY") or mistral_key or or_key or "",
            embed_model or "mistral-embed",
            embed_dim,
        )
    if mistral_key:
        return (
            "https://api.mistral.ai/v1",
            mistral_key,
            embed_model or "mistral-embed",
            int(_first_env("BRAIN_EMBED_DIM") or "1024"),
        )
    if or_key:
        return (
            "https://openrouter.ai/api/v1",
            or_key,
            embed_model or "openai/text-embedding-3-small",
            int(_first_env("BRAIN_EMBED_DIM") or "1536"),
        )
    raise RuntimeError(
        "Cloud LLM requires MISTRAL_API_KEY or OPENROUTER_API_KEY for embeddings "
        "when BRAIN_LOCAL_LLM_ENABLED=false"
    )


def fallback_chain() -> list[str]:
    raw = _first_env("BRAIN_LLM_FALLBACKS") or DEFAULT_FALLBACKS
    names = [p.strip().lower() for p in raw.split(",") if p.strip()]
    # grok is an alias for xai (Grok models via xAI API)
    names = ["xai" if n == "grok" else n for n in names]
    if not local_llm_enabled():
        names = [n for n in names if n not in LOCAL_PROVIDERS]
    return names


def _provider_configured(name: str) -> bool:
    if name == "openrouter":
        return bool(_first_env("OPENROUTER_API_KEY"))
    if name == "huggingface":
        return bool(hf_token())
    if name == "gemini":
        return bool(_first_env("GOOGLE_API_KEY", "GEMINI_API_KEY", "GOOGLE_AI_STUDIO_API_KEY"))
    if name == "mistral":
        return bool(_first_env("MISTRAL_API_KEY", "MISTRALAI_API_KEY"))
    if name == "groq":
        return bool(_first_env("GROQ_API_KEY"))
    if name in {"xai", "grok"}:
        key = _first_env("XAI_API_KEY", "GROK_API_KEY")
        return bool(key) and key.startswith("xai-")
    if name == "deepseek":
        return bool(_first_env("DEEPSEEK_API_KEY"))
    if name == "together":
        return bool(_first_env("TOGETHERAI_API_KEY", "TOGETHER_API_KEY"))
    if name == "anthropic":
        return bool(_first_env("ANTHROPIC_API_KEY"))
    if name == "ollama":
        return local_llm_enabled() and _ollama_reachable(ollama_base_url())
    if name == "lmstudio":
        return local_llm_enabled() and bool(_first_env("LMSTUDIO_API_KEY", "LMSTUDIO_API_BASE", "LM_STUDIO_API_BASE"))
    return False


def probe_provider(name: str) -> dict[str, Any]:
    """Lightweight reachability check (no secrets in output)."""
    if not _provider_configured(name):
        return {"provider": name, "ok": False, "reason": "not_configured"}

    if name == "openrouter":
        key = _first_env("OPENROUTER_API_KEY")
        model = openrouter_model()
        code, payload = _openai_chat_probe(
            url="https://openrouter.ai/api/v1/chat/completions",
            api_key=key,
            model=model,
            extra_headers=OPENROUTER_HEADERS,
        )
        if code == 200:
            return {"provider": name, "ok": True, "http": code, "model": model, "detail": payload}
        auth_code, auth_payload = _http_get_json(
            "https://openrouter.ai/api/v1/auth/key",
            {"Authorization": f"Bearer {key}"},
        )
        auth_ok = auth_code == 200
        return {
            "provider": name,
            "ok": False,
            "http": code,
            "model": model,
            "auth_ok": auth_ok,
            "auth_http": auth_code,
            "reason": "no_credits_or_model" if auth_ok else "invalid_key",
            "detail": payload,
            "auth_detail": auth_payload if auth_ok else None,
        }

    if name == "huggingface":
        key = hf_token()
        model = _provider_chat_model(HF_CHAT_MODELS[0])
        code, payload = _openai_chat_probe(
            url="https://router.huggingface.co/v1/chat/completions",
            api_key=key,
            model=model,
        )
        return {"provider": name, "ok": code == 200, "http": code, "model": model, "detail": payload}

    if name == "mistral":
        key = _first_env("MISTRAL_API_KEY", "MISTRALAI_API_KEY")
        code, payload = _openai_chat_probe(
            url="https://api.mistral.ai/v1/chat/completions",
            api_key=key,
            model="mistral-small-latest",
        )
        return {"provider": name, "ok": code == 200, "http": code, "model": "mistral-small-latest"}

    if name == "gemini":
        key = _first_env("GOOGLE_API_KEY", "GEMINI_API_KEY", "GOOGLE_AI_STUDIO_API_KEY")
        model = _provider_chat_model(GEMINI_CHAT_MODELS[0])
        code, payload = _gemini_probe(key, model)
        return {"provider": name, "ok": code == 200, "http": code, "model": model, "detail": payload}

    if name == "groq":
        key = _first_env("GROQ_API_KEY")
        model = _provider_chat_model(GROQ_CHAT_MODELS[0])
        code, payload = _openai_chat_probe(
            url="https://api.groq.com/openai/v1/chat/completions",
            api_key=key,
            model=model,
        )
        return {"provider": name, "ok": code == 200, "http": code, "model": model, "detail": payload}

    if name in {"xai", "grok"}:
        key = _first_env("XAI_API_KEY", "GROK_API_KEY")
        model = _provider_chat_model(XAI_CHAT_MODELS[0])
        code, payload = _openai_chat_probe(
            url="https://api.x.ai/v1/chat/completions",
            api_key=key,
            model=model,
        )
        return {"provider": name, "ok": code == 200, "http": code, "model": model, "detail": payload}

    if name == "deepseek":
        key = _first_env("DEEPSEEK_API_KEY")
        model = _provider_chat_model(DEEPSEEK_CHAT_MODELS[0])
        code, payload = _openai_chat_probe(
            url="https://api.deepseek.com/v1/chat/completions",
            api_key=key,
            model=model,
        )
        return {"provider": name, "ok": code == 200, "http": code, "model": model, "detail": payload}

    if name == "together":
        key = _first_env("TOGETHERAI_API_KEY", "TOGETHER_API_KEY")
        model = _provider_chat_model(TOGETHER_CHAT_MODELS[0])
        code, payload = _openai_chat_probe(
            url="https://api.together.xyz/v1/chat/completions",
            api_key=key,
            model=model,
        )
        return {"provider": name, "ok": code == 200, "http": code, "model": model, "detail": payload}

    if name == "anthropic":
        key = _first_env("ANTHROPIC_API_KEY")
        model = _provider_chat_model("claude-3-5-haiku-20241022")
        code, payload = _http_post_json(
            "https://api.anthropic.com/v1/messages",
            {
                "x-api-key": key,
                "anthropic-version": "2023-06-01",
            },
            {
                "model": model,
                "max_tokens": 4,
                "messages": [{"role": "user", "content": "ok"}],
            },
        )
        return {"provider": name, "ok": code == 200, "http": code, "model": model, "detail": payload}

    if name in LOCAL_PROVIDERS:
        return {"provider": name, "ok": True, "reason": "local_opt_in"}

    return {"provider": name, "ok": False, "reason": "unknown_provider"}


def resolve_provider_name(explicit: str | None = None) -> str:
    choice = (explicit or _first_env("BRAIN_LLM_PROVIDER") or "auto").lower()
    if choice != "auto":
        if choice in LOCAL_PROVIDERS and not local_llm_enabled():
            raise RuntimeError(
                f"Local provider '{choice}' requires BRAIN_LOCAL_LLM_ENABLED=true"
            )
        return choice

    working: list[str] = []
    for name in fallback_chain():
        if not _provider_configured(name):
            continue
        probe = probe_provider(name)
        if probe.get("ok"):
            working.append(name)
    if working:
        return working[0]
    return ""


def resolve_provider_spec(provider: str | None = None) -> ProviderSpec:
    name = resolve_provider_name(provider)
    if not name:
        raise RuntimeError(
            "No LLM provider available. Configure OPENROUTER_API_KEY or HF token, "
            "or set BRAIN_LLM_FALLBACKS. Local Ollama/LM Studio requires "
            "BRAIN_LOCAL_LLM_ENABLED=true."
        )

    llm_model = _first_env("BRAIN_LLM_MODEL")
    llm_small = _first_env("BRAIN_LLM_SMALL_MODEL")
    llm_base = _first_env("BRAIN_LLM_BASE_URL")
    embed_base = _first_env("BRAIN_EMBED_BASE_URL")
    embed_model = _first_env("BRAIN_EMBED_MODEL")
    embed_dim = int(_first_env("BRAIN_EMBED_DIM") or "1024")

    if name == "openrouter":
        or_model = openrouter_model()
        embed_via_or = embed_base or llm_base or "https://openrouter.ai/api/v1"
        return ProviderSpec(
            name=name,
            llm_base_url=llm_base or "https://openrouter.ai/api/v1",
            llm_api_key=_first_env("OPENROUTER_API_KEY"),
            llm_model=or_model,
            llm_small_model=llm_small or or_model,
            embed_base_url=embed_via_or,
            embed_api_key=_first_env("OPENROUTER_API_KEY"),
            embed_model=embed_model or "openai/text-embedding-3-small",
            embed_dim=int(_first_env("BRAIN_EMBED_DIM") or "1536"),
            structured_output_mode="json_object",
        )

    if name == "huggingface":
        token = hf_token()
        hf_model = _provider_chat_model(HF_CHAT_MODELS[0])
        mistral_key = _first_env("MISTRAL_API_KEY", "MISTRALAI_API_KEY")
        or_key = _first_env("OPENROUTER_API_KEY")
        if embed_base:
            embed_base_url = embed_base
            embed_api_key = _first_env("BRAIN_EMBED_API_KEY") or token
            embed_model_name = embed_model or hf_model
            embed_dim_val = embed_dim
        elif mistral_key:
            embed_base_url = "https://api.mistral.ai/v1"
            embed_api_key = mistral_key
            embed_model_name = embed_model or "mistral-embed"
            embed_dim_val = int(_first_env("BRAIN_EMBED_DIM") or "1024")
        elif or_key:
            embed_base_url = "https://openrouter.ai/api/v1"
            embed_api_key = or_key
            embed_model_name = embed_model or "openai/text-embedding-3-small"
            embed_dim_val = int(_first_env("BRAIN_EMBED_DIM") or "1536")
        else:
            raise RuntimeError(
                "huggingface LLM requires MISTRAL_API_KEY or OPENROUTER_API_KEY for embeddings "
                "when BRAIN_LOCAL_LLM_ENABLED=false"
            )
        return ProviderSpec(
            name=name,
            llm_base_url=llm_base or "https://router.huggingface.co/v1",
            llm_api_key=token,
            llm_model=hf_model,
            llm_small_model=llm_small or hf_model,
            embed_base_url=embed_base_url,
            embed_api_key=embed_api_key,
            embed_model=embed_model_name,
            embed_dim=embed_dim_val,
            structured_output_mode="json_object",
        )

    if name == "gemini":
        api_key = _first_env("GOOGLE_API_KEY", "GEMINI_API_KEY", "GOOGLE_AI_STUDIO_API_KEY")
        return ProviderSpec(
            name=name,
            llm_base_url="",
            llm_api_key=api_key,
            llm_model=_provider_chat_model("gemini-2.0-flash"),
            llm_small_model=llm_small or _provider_chat_model("gemini-2.5-flash-lite"),
            embed_base_url="",
            embed_api_key=api_key,
            embed_model=embed_model or "text-embedding-004",
            embed_dim=int(_first_env("BRAIN_EMBED_DIM") or "768"),
        )

    if name == "mistral":
        api_key = _first_env("MISTRAL_API_KEY", "MISTRALAI_API_KEY")
        return ProviderSpec(
            name=name,
            llm_base_url=llm_base or "https://api.mistral.ai/v1",
            llm_api_key=api_key,
            llm_model=_provider_chat_model("mistral-small-latest"),
            llm_small_model=llm_small or _provider_chat_model("mistral-small-latest"),
            embed_base_url=embed_base or "https://api.mistral.ai/v1",
            embed_api_key=api_key,
            embed_model=embed_model or "mistral-embed",
            embed_dim=int(_first_env("BRAIN_EMBED_DIM") or "1024"),
            structured_output_mode="json_object",
        )

    if name == "groq":
        api_key = _first_env("GROQ_API_KEY")
        chat_model = _provider_chat_model(GROQ_CHAT_MODELS[0])
        embed_base_url, embed_api_key, embed_model_name, embed_dim_val = _embed_fallback()
        return ProviderSpec(
            name=name,
            llm_base_url=llm_base or "https://api.groq.com/openai/v1",
            llm_api_key=api_key,
            llm_model=chat_model,
            llm_small_model=llm_small or chat_model,
            embed_base_url=embed_base or embed_base_url,
            embed_api_key=embed_api_key,
            embed_model=embed_model or embed_model_name,
            embed_dim=embed_dim_val,
            structured_output_mode="json_object",
        )

    if name in {"xai", "grok"}:
        api_key = _first_env("XAI_API_KEY", "GROK_API_KEY")
        chat_model = _provider_chat_model(XAI_CHAT_MODELS[0])
        embed_base_url, embed_api_key, embed_model_name, embed_dim_val = _embed_fallback()
        return ProviderSpec(
            name="xai",
            llm_base_url=llm_base or "https://api.x.ai/v1",
            llm_api_key=api_key,
            llm_model=chat_model,
            llm_small_model=llm_small or chat_model,
            embed_base_url=embed_base or embed_base_url,
            embed_api_key=embed_api_key,
            embed_model=embed_model or embed_model_name,
            embed_dim=embed_dim_val,
            structured_output_mode="json_object",
        )

    if name == "deepseek":
        api_key = _first_env("DEEPSEEK_API_KEY")
        chat_model = _provider_chat_model(DEEPSEEK_CHAT_MODELS[0])
        embed_base_url, embed_api_key, embed_model_name, embed_dim_val = _embed_fallback()
        return ProviderSpec(
            name=name,
            llm_base_url=llm_base or "https://api.deepseek.com/v1",
            llm_api_key=api_key,
            llm_model=chat_model,
            llm_small_model=llm_small or chat_model,
            embed_base_url=embed_base or embed_base_url,
            embed_api_key=embed_api_key,
            embed_model=embed_model or embed_model_name,
            embed_dim=embed_dim_val,
            structured_output_mode="json_object",
        )

    if name == "together":
        api_key = _first_env("TOGETHERAI_API_KEY", "TOGETHER_API_KEY")
        chat_model = _provider_chat_model(TOGETHER_CHAT_MODELS[0])
        embed_base_url, embed_api_key, embed_model_name, embed_dim_val = _embed_fallback()
        return ProviderSpec(
            name=name,
            llm_base_url=llm_base or "https://api.together.xyz/v1",
            llm_api_key=api_key,
            llm_model=chat_model,
            llm_small_model=llm_small or chat_model,
            embed_base_url=embed_base or embed_base_url,
            embed_api_key=embed_api_key,
            embed_model=embed_model or embed_model_name,
            embed_dim=embed_dim_val,
            structured_output_mode="json_object",
        )

    if name == "anthropic":
        api_key = _first_env("ANTHROPIC_API_KEY")
        or_key = _first_env("OPENROUTER_API_KEY")
        if not or_key and not local_llm_enabled():
            raise RuntimeError(
                "anthropic provider needs OPENROUTER_API_KEY for embeddings when local LLM is disabled"
            )
        return ProviderSpec(
            name=name,
            llm_base_url="",
            llm_api_key=api_key,
            llm_model=_provider_chat_model("claude-3-5-haiku-20241022"),
            llm_small_model=llm_small or _provider_chat_model("claude-3-5-haiku-20241022"),
            embed_base_url=embed_base or "https://openrouter.ai/api/v1",
            embed_api_key=or_key,
            embed_model=embed_model or "openai/text-embedding-3-small",
            embed_dim=int(_first_env("BRAIN_EMBED_DIM") or "1536"),
        )

    if name == "ollama":
        if not local_llm_enabled():
            raise RuntimeError("Ollama requires BRAIN_LOCAL_LLM_ENABLED=true")
        base = ollama_base_url()
        if not _ollama_reachable(base):
            raise RuntimeError(f"Ollama not reachable at {base}")
        chat = llm_model or _first_env("OLLAMA_MODEL") or "llama3.1:8b"
        return ProviderSpec(
            name=name,
            llm_base_url=llm_base or f"{base}/v1",
            llm_api_key=_first_env("OLLAMA_API_KEY") or "ollama",
            llm_model=chat,
            llm_small_model=llm_small or "llama3.2:3b",
            embed_base_url=embed_base or f"{base}/v1",
            embed_api_key=_first_env("OLLAMA_API_KEY") or "ollama",
            embed_model=embed_model or "nomic-embed-text",
            embed_dim=768,
            structured_output_mode="json_object",
        )

    if name == "lmstudio":
        if not local_llm_enabled():
            raise RuntimeError("LM Studio requires BRAIN_LOCAL_LLM_ENABLED=true")
        base = lmstudio_base_url()
        chat = llm_model or _first_env("LMSTUDIO_MODEL") or "local-model"
        return ProviderSpec(
            name=name,
            llm_base_url=llm_base or f"{base}/v1",
            llm_api_key=_first_env("LMSTUDIO_API_KEY") or "lmstudio",
            llm_model=chat,
            llm_small_model=llm_small or chat,
            embed_base_url=embed_base or f"{base}/v1",
            embed_api_key=_first_env("LMSTUDIO_API_KEY") or "lmstudio",
            embed_model=embed_model or chat,
            embed_dim=embed_dim,
            structured_output_mode="json_object",
        )

    raise RuntimeError(f"Unknown BRAIN_LLM_PROVIDER={name}")


def provider_status() -> dict[str, Any]:
    chain = fallback_chain()
    probes = [probe_provider(n) for n in chain if _provider_configured(n) or n in LOCAL_PROVIDERS]
    name = ""
    try:
        name = resolve_provider_name()
        spec = resolve_provider_spec(name)
        selected = {
            "llm_model": spec.llm_model,
            "embed_model": spec.embed_model,
            "embed_dim": spec.embed_dim,
            "llm_base_url": spec.llm_base_url or "(native)",
            "embed_base_url": spec.embed_base_url or "(native)",
        }
    except RuntimeError as exc:
        selected = {"error": str(exc)}

    return {
        "provider": name or None,
        "local_llm_enabled": local_llm_enabled(),
        "fallback_chain": chain,
        "probes": probes,
        "openrouter_present": bool(_first_env("OPENROUTER_API_KEY")),
        "hf_token_present": bool(hf_token()),
        "mistral_present": bool(_first_env("MISTRAL_API_KEY", "MISTRALAI_API_KEY")),
        "gemini_present": bool(
            _first_env("GOOGLE_API_KEY", "GEMINI_API_KEY", "GOOGLE_AI_STUDIO_API_KEY")
        ),
        "xai_present": bool(_first_env("XAI_API_KEY", "GROK_API_KEY")),
        "groq_present": bool(_first_env("GROQ_API_KEY")),
        "deepseek_present": bool(_first_env("DEEPSEEK_API_KEY")),
        "together_present": bool(_first_env("TOGETHERAI_API_KEY", "TOGETHER_API_KEY")),
        "openrouter_model": openrouter_model(),
        "ollama_reachable": _ollama_reachable(ollama_base_url()),
        "secrets_env": str(Path.home() / ".config" / "secrets.env"),
        **selected,
    }


def _sanitize_llm_payload(obj: Any) -> Any:
    """Fix common LLM JSON typos before Graphiti pydantic validation."""
    if isinstance(obj, dict):
        out: dict[str, Any] = {}
        for key, value in obj.items():
            fixed_key = key
            if key in {"entity_type_id_id", "entity_typeId", "entityTypeId"}:
                fixed_key = "entity_type_id"
            out[fixed_key] = _sanitize_llm_payload(value)
        return out
    if isinstance(obj, list):
        return [_sanitize_llm_payload(item) for item in obj]
    return obj


def _wrap_llm_client(client: Any) -> Any:
    """Patch generate_response to sanitize structured extraction payloads."""
    original = client.generate_response

    async def generate_response(*args: Any, **kwargs: Any) -> Any:
        result = await original(*args, **kwargs)
        return _sanitize_llm_payload(result)

    client.generate_response = generate_response  # type: ignore[method-assign]
    return client


def build_graphiti(uri: str, user: str, password: str, provider: str | None = None) -> Any:
    from graphiti_core import Graphiti  # type: ignore

    spec = resolve_provider_spec(provider)

    if spec.name == "gemini":
        from graphiti_core.cross_encoder.gemini_reranker_client import GeminiRerankerClient  # type: ignore
        from graphiti_core.embedder.gemini import GeminiEmbedder, GeminiEmbedderConfig  # type: ignore
        from graphiti_core.llm_client.config import LLMConfig  # type: ignore
        from graphiti_core.llm_client.gemini_client import GeminiClient  # type: ignore

        llm_config = LLMConfig(
            api_key=spec.llm_api_key,
            model=spec.llm_model,
            small_model=spec.llm_small_model,
            temperature=0.0,
            max_tokens=4096,
        )
        llm_client = _wrap_llm_client(GeminiClient(config=llm_config))
        embedder = GeminiEmbedder(
            config=GeminiEmbedderConfig(
                api_key=spec.embed_api_key,
                embedding_model=spec.embed_model,
                embedding_dim=spec.embed_dim,
            )
        )
        cross_encoder = GeminiRerankerClient(
            config=LLMConfig(
                api_key=spec.llm_api_key,
                model=spec.llm_small_model,
                temperature=0.0,
                max_tokens=512,
            )
        )
        return Graphiti(uri, user, password, llm_client=llm_client, embedder=embedder, cross_encoder=cross_encoder)

    from graphiti_core.cross_encoder.openai_reranker_client import OpenAIRerankerClient  # type: ignore
    from graphiti_core.embedder.openai import OpenAIEmbedder, OpenAIEmbedderConfig  # type: ignore
    from graphiti_core.llm_client.config import LLMConfig  # type: ignore
    from graphiti_core.llm_client.openai_generic_client import OpenAIGenericClient  # type: ignore

    llm_config = LLMConfig(
        api_key=spec.llm_api_key,
        model=spec.llm_model,
        small_model=spec.llm_small_model,
        base_url=spec.llm_base_url,
        temperature=0.0,
        max_tokens=4096,
    )
    llm_client = _wrap_llm_client(
        OpenAIGenericClient(
            config=llm_config,
            structured_output_mode=spec.structured_output_mode,  # type: ignore[arg-type]
        )
    )
    embedder = OpenAIEmbedder(
        config=OpenAIEmbedderConfig(
            api_key=spec.embed_api_key,
            base_url=spec.embed_base_url,
            embedding_model=spec.embed_model,
            embedding_dim=spec.embed_dim,
        )
    )
    rerank_config = LLMConfig(
        api_key=spec.llm_api_key,
        model=spec.llm_small_model,
        base_url=spec.llm_base_url,
        temperature=0.0,
        max_tokens=256,
    )
    cross_encoder = OpenAIRerankerClient(config=rerank_config)
    return Graphiti(uri, user, password, llm_client=llm_client, embedder=embedder, cross_encoder=cross_encoder)
