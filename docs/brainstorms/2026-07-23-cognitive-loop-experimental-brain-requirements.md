# Cognitive Loop Experimental Brain — Requirements

**Date:** 2026-07-23  
**Status:** Draft for planning (`ce-plan`)  
**Scope:** Deep — feature extension (inherits product shape from `STRATEGY.md`)

## Problem

BodenAI fidelity should not depend on heavyweight ML training + brittle automated tests alone. The operator wants a brain-inspired decision loop that walks conversation history sequentially, builds a usable “mesh” of memory, and predicts what Boden would say next — with rigorous control-group evaluation — while keeping the current case-first runtime as the **default**.

## Goal

Add an **optional, configurable cognitive mode** to the existing brain/twin framework that:

1. Mirrors a simplified human decision sequence (perceive → retrieve → gate → act → learn).
2. Can be compared side-by-side with the current plan-default (`case-first select + burst + hard gate`).
3. Uses human-grounded evaluation (ITT ranking + stratified controls), not token-level accuracy alone.

## Non-goals

- Building or claiming a biologically complete brain simulation.
- Replacing Graphiti, case mining, or ITT harnesses.
- Making the experimental mode the default before human ITT pass.
- Training LoRA on this host (RX 460) as part of this experiment.

## What exists today (baseline)

| Layer | Role |
|-------|------|
| Episode IR (`~/brain-data/unified`, P1 segmentation) | Chronological conversation atoms |
| Case mining + BM25 (`cases.jsonl`, `cases_bm25.pkl`) | Stimulus→response retrieval units |
| `behavior_profile.json` | Engagement/burst/gate priors |
| `services/bodenai` | Case search → BP policy → hard gate → select/burst/silence/generate |
| ITT pack/rank/score | Human ranking fidelity gate (ground truth vs case_select vs distractors) |
| Graphiti export/load | Temporal entity/relation mesh (optional Neo4j) |

**Default brain mode (unchanged):** `case-first-select` per `docs/plans/2026-07-18-bodenai-pipeline-status.md`.

## Research conclusion (feasibility)

### Does “full brain” exist?

**No turnkey product.** [OPEN] No industry system replicates full prefrontal–hippocampal–basal ganglia circuitry as a deployable “brain.”

**Closest engineering analogues:**

| Approach | What it maps to | Boden fit |
|----------|-----------------|-----------|
| Cognitive architectures (ACT-R, SOAR, LIDA) [OFFICIAL] | Goal buffer + declarative/procedural memory + production rules | Policy/gate layer |
| Generative Agents memory stream [OFFICIAL] | Recency + relevance + importance retrieval; periodic reflection | Case search + future reflection job |
| MemGPT/Letta [OFFICIAL] | OS-like memory tiers; deliberate paging | Episode IR + overlays |
| Graphiti temporal KG [REPO] | Entity/relation mesh over time | P4 mesh (not yet default runtime path) |
| ITT / Eval4Sim [OFFICIAL] | Human-likeness via ranking & multi-axis persona metrics | P7 ITT (partial); Eval4Sim dimensions TBD |

[SYNTH] The user’s “sequential walk + neural mesh” intuition is **feasible as an engineering pattern**, not as neuroscience simulation: **chronological episode replay → activate retrieval graph → gate → emit**. Graphiti + case index already cover two views of the same history.

### Is ML + strict automated tests the industry standard?

**Partially, but not for persona fidelity.** [OFFICIAL] Eval4Sim (2026) explicitly critiques LLM-as-judge-only evaluation and uses retrieval + authorship verification + dialogue NLI against a **human corpus baseline**. [OFFICIAL] Inverse Turing / persona ranking protocols treat **human judges** as the gold standard when models can appear more human than humans.

[SYNTH] Heavy ML training is optional downstream (LoRA/P9 deferred). **Retrieval + human ranking + control groups** is the credible path for Boden — already started in `eval_itt_*`.

## Proposed cognitive sequence (PFC-inspired, simplified)

Mirrors literature without claiming biological fidelity:

```
1. PERCEIVE   — parse stimulus, topics, lane (voice vs knowledge)
2. ORIENT     — load goal state (engagement, conflict, meta-assistant triggers)
3. RETRIEVE   — episodic (cases, episodes) + semantic (graph entities, BM25)
4. DELIBERATE — score candidates (R+R+I: recency, relevance, importance)
5. GATE       — silence / select / burst / generate (existing hard_gate)
6. ACT        — emit verbatim case or bounded generation
7. CONSOLIDATE — log outcome for eval; optional reflection into overlays
```

**Mapping to repo:**

| Step | Current | Experimental add-on |
|------|---------|---------------------|
| Retrieve | BM25 case search | + chronological episode window + Graphiti neighborhood |
| Deliberate | BP boosts | + activation spread over mesh edges |
| Gate | `hard_gate` | unchanged |
| Act | select/burst/generate | unchanged |
| Consolidate | ITT logs | + next-message prediction log for offline metrics |

## Configuration (must be editable)

Environment-driven modes for humans and agents:

```bash
# Default (unchanged)
BODENAI_DECISION_MODE=case_select          # plan default

# Experimental modes (opt-in)
BODENAI_DECISION_MODE=pfc_loop             # full 7-step loop, mesh-augmented retrieval
BODENAI_DECISION_MODE=mesh_replay          # sequential episode replay bias
BODENAI_DECISION_MODE=hybrid               # case_select + mesh tie-break

# Eval-only overrides
BODENAI_EVAL_PROFILE=itt                   # existing human ranking packs
BODENAI_EVAL_PROFILE=eval4sim              # adherence/consistency/naturalness (future)
BODENAI_EVAL_PROFILE=next_message          # offline top-1/top-k case match (auxiliary)
```

All modes must be selectable from:

- `scripts/brain/` CLI (`eval_*`, future `eval_cognitive.py`)
- `services/bodenai` request header or env
- Side-by-side comparison report JSON for agent runs

## Evaluation requirements

### Primary (unchanged)

**Human ITT ranking** on held-out probes: ground truth must beat `case_select`, near-miss, and assistant stubs (`eval_itt_rank.py` / `eval_itt_score.py`).

### Experimental comparisons (control groups)

For each held-out stimulus, run **fixed candidate pools** (already in `eval_common.build_candidates`):

| Arm | Method | Role |
|-----|--------|------|
| A | `ground_truth` | Upper bound (historical Boden) |
| B | `case_select` | Plan default |
| C | `pfc_loop` / `mesh_replay` | Experimental |
| D | `near_miss_select` | Plausible wrong-context control |
| E | `assistant_stub` / `generic_stub` | Lower bound |

Stratify by case type / topic / burstiness (extend `eval_itt_pack.py` strata).

### Secondary (auxiliary, not gating)

- **Next-message prediction:** top-1 / top-k retrieval hit rate on held-out cases (cheap, automated — **not** sufficient alone).
- **Eval4Sim-style axes** (future): adherence, consistency, naturalness vs PuritanWizard corpus — penalize over-optimized assistant tone.

### Pass criteria for promoting experimental mode

1. Human ITT: experimental arm ranks ≥ `case_select` on mean ground-truth rank (SR).
2. No regression on anti-assistant gate (silence on meta prompts).
3. Operator sign-off on qualitative burst/timing fidelity.

## Dependencies & assumptions

- `BRAIN_DATA_ROOT` populated (P1–P2 done).
- Brain service reachable for case search.
- Graphiti optional for `mesh_replay` (degrades to episode-only if Neo4j down).
- Identity lock: PuritanWizard only; wizardofchaos excluded.

## Outstanding questions

1. Should `mesh_replay` require Neo4j, or is episode chronological bias enough for v1?
2. Is Eval4Sim adoption in-scope for first experimental slice, or ITT-only?
3. Should next-message prediction be exposed in UI, or eval-only?

## Repo implications

| Action | Priority |
|--------|----------|
| Keep `case_select` as default | Now |
| Add `BODENAI_DECISION_MODE` config surface | Next plan |
| Implement `pfc_loop` as thin orchestrator over existing twin | Next plan |
| Extend eval harness for A/B mode comparison | Next plan |
| Graphiti activation in retrieval | Defer until bulk load stable |
| LoRA / PersonaForge | Defer until ITT pass |

## Handoff

Run `ce-plan` to design: `eval_cognitive.py`, twin mode router, mesh retrieval adapter, comparison report schema.
