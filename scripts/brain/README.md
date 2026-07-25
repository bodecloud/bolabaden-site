# Private brain warehouse

Canonical episode IR + case library + overlays + BM25 / Graphiti export.

## Full pipeline (P1–P7)

```bash
cd scripts/brain
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export BRAIN_DATA_ROOT=$HOME/brain-data
./run_pipeline.sh
```

| Script | Phase | Output |
|--------|-------|--------|
| `segment_unified.py` | P1 | `episodes/episodes.jsonl` |
| `mine_cases.py` | P2 | `cases/cases.jsonl`, `behavior_profile.json` |
| `build_index.py` | P2b | `index/bm25.pkl`, `graphiti/episodes.jsonl` |
| `build_case_index.py` | P2c | `index/cases_bm25.pkl` |
| `export_lora.py` | P5 prep | `lora/sft.jsonl` |
| `eval_itt.py` | P7 | `eval/itt_report.json` |
| `eval_itt_autorank.py` | P7d | `eval/itt_autorank_proxy.json` (pre-human mode compare) |
| `cognitive_loop.py` | P3b | shared PFC-inspired decision loop |
| `eval_itt_pack.py` | P7b | `eval/itt_packs/*.human.jsonl` |
| `eval_itt_rank.py` | P7 human | interactive ranking session (CLI) |
| `eval_itt_gate.py` | P7 gate | `eval/itt_gate_report.json` (hands-off rank+score+promote) |
| `eval_itt_auto_rank.py` | P7 auto | automated ranking JSONL |
| `eval_itt_score.py` | P7 score | `eval/itt_human_score.json` |
| `load_graphiti.py` | P4 load | Neo4j bulk ingest (cloud LLM) |
| `llm_providers.py` | LLM ops | status/probe/refresh keys |
| `run_lora_hf.sh` | P5 operator | Stage + print LLaMA-Factory train steps |

## Legacy slice (limited Discord sample)

```bash
./run_slice.sh
```

## Layout (`$BRAIN_DATA_ROOT`)

| Path | Role |
|------|------|
| `unified/conversations.jsonl` | Conversation IR v1 (ground truth) |
| `episodes/episodes.jsonl` | Episode IR v1 |
| `cases/cases.jsonl` | Stimulus→response cases (CBR) |
| `cases/behavior_profile.json` | Mined engagement/burst/trigger stats |
| `index/bm25.pkl` | Episode search fallback |
| `index/cases_bm25.pkl` | Case select-mode index |
| `graphiti/episodes.jsonl` | Graphiti bulk load export |
| `eval/held_out/` | Threads withheld from mining |
| `eval/itt_packs/` | Human ranking packs + answer keys |
| `eval/itt_rankings/` | Saved ranking sessions |
| `lora/sft.jsonl` | LoRA SFT export |

## Identity

- Boden only: Discord `227896831944687616` (PuritanWizard)
- Excluded: wizardofchaos `125433170047795200`
- Xfire mp4s: **not transcribed** — `xfire_meta` only

## Services

- Brain API: `services/brain` — `/v1/search`, `/v1/cases/search`
- BodenAI twin: `services/bodenai` — configurable decision modes (`BODENAI_DECISION_MODE`)

## Cognitive decision modes (experimental, opt-in)

Default remains **`case_select`** (plan baseline). Experimental modes reuse the same gate/act path with different retrieval/deliberation scoring.

| Mode | Env value | Behavior |
|------|-----------|----------|
| Default | `case_select` | BM25 case retrieval + policy boosts |
| Mesh | `mesh_replay` | Episode thread/ID mesh boost on cases |
| PFC loop | `pfc_loop` | R+R+I deliberation + partial mesh |
| Hybrid | `hybrid` | 55% case + 45% mesh score blend |

```bash
export BODENAI_DECISION_MODE=pfc_loop   # or per-request: X-BodenAI-Decision-Mode header

# Automated A/B on held-out cases (auxiliary — not a promotion gate)
python eval_cognitive.py --sample 200

# Pre-human ITT proxy on ranking pack (21 probes)
python eval_itt_autorank.py

# Human ITT pack with experimental arm
python eval_itt_pack.py --per-type 5 --cognitive-mode pfc_loop
python eval_itt_review.py   # browser UI

# Agent/human mode compare on one stimulus (BodenAI service)
curl -s -X POST http://127.0.0.1:8091/v1/decide/compare \
  -H 'Content-Type: application/json' \
  -d '{"query":"your stimulus here"}' | jq .
```

See [`docs/plans/2026-07-24-001-feat-brain-twin-remainder-plan.md`](../../docs/plans/2026-07-24-001-feat-brain-twin-remainder-plan.md) (authoritative), [`docs/plans/2026-07-18-bodenai-pipeline-status.md`](../../docs/plans/2026-07-18-bodenai-pipeline-status.md) (living status).

## Human ITT ranking (automated gate)

Hands-off promotion gate — no browser or interactive session:

```bash
python eval_itt_gate.py --judge auto
# → eval/itt_gate_report.json + eval/itt_rankings/auto_gate_*.jsonl
```

Uses LLM judge (OpenRouter/xAI/Mistral) with behavior-profile heuristic fallback. Scores against pack keys and recommends `BODENAI_DECISION_MODE` (`case_select` unless `pfc_loop` wins).

Optional browser UI: `python eval_itt_review.py` (manual override only).

## Graphiti bulk load (optional)

Export is built during `build_index.py`. Load when Neo4j + LLM keys are ready:

```bash
# Start Neo4j (from services/brain)
docker compose -f docker-compose.brain.yml --profile graphiti up -d brain-neo4j

export BRAIN_NEO4J_URI=bolt://127.0.0.1:7687
export BRAIN_NEO4J_PASSWORD=brain-change-me
# Auto-detects ~/.config/secrets.env. Cloud-first; local Ollama/LM Studio **off by default**.
export BRAIN_LOCAL_LLM_ENABLED=false
export BRAIN_LLM_FALLBACKS=openrouter,huggingface,mistral,gemini,groq,anthropic
export BRAIN_LLM_PROVIDER=xai   # recommended for Graphiti entity extract
# mistral/openrouter/free often fail pydantic schema on bulk extract

pip install -r requirements-graphiti.txt
python load_graphiti.py --dry-run --limit 10 --provider xai
python load_graphiti.py --init-indices --batch-size 25 --limit 200 --provider xai
# Resume after partial load:
python load_graphiti.py --limit 200 --batch-size 25 --provider xai --offset $(python -c "import json;print(json.load(open('$HOME/brain-data/graphiti/load_state.json')).get('offset_episodes',0))")
```

Or `POST /v1/graphiti/load?limit=200` on the brain service.

Auto-loads `~/.config/secrets.env`. **Local AI is opt-in** (`BRAIN_LOCAL_LLM_ENABLED=false` by default). Cloud fallback chain defaults to `openrouter,huggingface,mistral,...`.

```bash
python llm_providers.py status
python llm_providers.py probe
python llm_providers.py refresh-openrouter   # browser login → save key
python llm_providers.py refresh-hf           # browser login → paste token
```

Force a provider: `BRAIN_LLM_PROVIDER=huggingface`. Enable local only when intended: `BRAIN_LOCAL_LLM_ENABLED=true BRAIN_LLM_PROVIDER=ollama`.

## LoRA train prep (operator)

```bash
./run_lora_hf.sh   # stages configs under ~/brain-data/lora/hf_stage
```

Train only after ITT human ranking shows case-select beats stubs.
