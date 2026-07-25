---
status: superseded
date: 2026-07-23
superseded_by: docs/plans/2026-07-24-001-feat-brain-twin-remainder-plan.md
origin: docs/brainstorms/2026-07-23-cognitive-loop-experimental-brain-requirements.md
---

# Cognitive Loop Experimental Brain — Implementation Plan

> **Superseded** by [`2026-07-24-001-feat-brain-twin-remainder-plan.md`](2026-07-24-001-feat-brain-twin-remainder-plan.md). Retained for history.

## Problem

BodenAI needs an optional, configurable decision loop inspired by human perceive→retrieve→gate→act sequencing, comparable to the default `case_select` path, with automated A/B eval and ITT-compatible human ranking — without ML training as the primary gate.

## Scope

**In:** `BODENAI_DECISION_MODE`, shared `cognitive_loop.py`, twin router, `eval_cognitive.py`, docs/env updates.

**Out:** Graphiti activation in live retrieval (episode BM25 only for mesh), Eval4Sim full adoption, LoRA, default mode change.

## Architecture

```
User message
    → brain /v1/cases/search (k=8)
    → [mesh modes] brain /v1/search voice episodes (k=5)
    → cognitive_loop.decide (perceive/orient/retrieve/deliberate/gate)
    → select | burst | silence | refuse | generate
```

| Mode | Retrieval | Deliberation |
|------|-----------|--------------|
| `case_select` (default) | BM25 cases | R+R+I policy boosts |
| `mesh_replay` | cases + episodes | mesh thread/episode boost |
| `pfc_loop` | cases + episodes | R+R+I + 0.35 mesh |
| `hybrid` | cases + episodes | 55% case + 45% mesh scores |

## Files

| File | Change |
|------|--------|
| `scripts/brain/cognitive_loop.py` | **New** — shared loop |
| `scripts/brain/eval_cognitive.py` | **New** — A/B compare on held-out |
| `services/bodenai/app/cognitive.py` | **New** — HTTP adapter |
| `services/bodenai/app/main.py` | Route through cognitive; header/body mode override |
| `scripts/brain/eval_common.py` | Optional cognitive candidate helper |
| `scripts/brain/eval_itt_pack.py` | `--cognitive-mode` flag |
| `scripts/brain/README.md` | Document modes + eval |
| `.env.example` | `BODENAI_DECISION_MODE` |

## Configuration

```bash
BODENAI_DECISION_MODE=case_select   # default
# case_select | mesh_replay | pfc_loop | hybrid

# Per-request override:
# Header: X-BodenAI-Decision-Mode: pfc_loop
# Body:   { "decision_mode": "pfc_loop", "messages": [...] }
```

## Evaluation

### Automated (auxiliary)

```bash
cd scripts/brain
python eval_cognitive.py --sample 200 --modes case_select,mesh_replay,pfc_loop,hybrid
# → ~/brain-data/eval/cognitive_compare.json
```

Metrics: `gate_allowed_rate`, `prefix8_match_rate`, `case_id_match_rate`, `anti_assistant_pass_rate`.

### Primary (automated ITT)

Promotion gate is **`eval_itt_gate.py`** (hands-off). Human/browser ranking optional override only.

```bash
python eval_itt_gate.py --judge auto
# → eval/itt_gate_report.json recommends BODENAI_DECISION_MODE
```

## Test scenarios

1. `case_select` default unchanged when env unset.
2. Invalid mode falls back to `case_select`.
3. `mesh_replay` with episode index boosts same-thread cases.
4. Meta-assistant stimulus → silence across all modes.
5. `eval_cognitive.py` writes comparison JSON with four mode arms.
6. `/health` exposes `decision_mode_default` and allowed modes.
7. Chat SSE includes `trace` event with step list.

## Risks

| Risk | Mitigation |
|------|------------|
| Mesh mode without episode index | Degrades to case-only mesh weights |
| Automated metrics overfit prefix match | ITT human gate remains primary |
| Duplicate policy logic | Single source in `cognitive_loop.py` |

## Sequencing

1. ✅ Shared loop + eval harness
2. ✅ Twin router + health/config
3. ✅ ITT pack with `cognitive_pfc_loop` arm + `eval_itt_autorank.py` proxy
4. ✅ Graphiti mesh context endpoint (`/v1/mesh/context`) wired into mesh modes
5. ✅ **Automated ITT gate** — `eval_itt_gate.py` → promoted **`pfc_loop`** over `case_select`
6. Graphiti bulk load at scale — **in progress** (~463 episodic nodes; paced xAI load). See remainder plan U1.

---

### Delta Update (2026-07-24)

- **Landed:** Items 1–5 complete; automated ITT gate replaces human session; `pfc_loop` promoted.
- **Partial:** Item 6 Graphiti paced load; mesh live but not at 200-episode target.
- **Next:** Follow [`2026-07-24-001-feat-brain-twin-remainder-plan.md`](2026-07-24-001-feat-brain-twin-remainder-plan.md) U1→U6.
