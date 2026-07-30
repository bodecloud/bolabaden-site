# PersonaForge Overlays — Requirements

**Date:** 2026-07-30
**Status:** Draft for planning (`ce-plan`) — U7 is explicitly deferred in `docs/plans/2026-07-24-001-feat-brain-twin-remainder-plan.md`; this document scopes it for a future phase, it does not authorize implementation now.
**Scope:** Deep — feature extension to the twin runtime (inherits product shape from `STRATEGY.md`)

## Problem

The twin's behavior is currently determined entirely by what the pipeline mined automatically: case selection from `behavior_profile.json`, mesh context from Graphiti, and the `pfc_loop` decision gate. There is no way for the operator to say "the twin got that specific pattern wrong, fix it" without re-running the mining pipeline or hand-editing generated JSON. `~/brain-data/overlays/example.yaml` already establishes a precedent for this shape of problem, but it only covers **ingest-time data correction** (exclude a thread, retag an episode, force a privacy label, hint a merge) — it has no vocabulary for **decision-time behavior correction** (this topic should never burst-reply, this stimulus type should always route to `mesh_replay`, this case is miscategorized and keeps winning gate scores it shouldn't).

PersonaForge is the missing piece: a manual correction layer for twin *behavior*, sitting alongside the existing ingest-time overlay system, applied after automated mining and before the gate gets the final say.

## Why now (context that changed since the plan deferred this)

The remainder plan gated U7 on "post-twin stable" and "after desk + twin stable." As of this session:

- `pfc_loop` is gate-promoted and verified live (`docs/plans/2026-07-24-001-feat-brain-twin-remainder-plan.md`, U1/U3 delta).
- The command desk homepage (U5) and public bot shell frontend (U6) are shipped.

So the precondition for scoping this (not implementing it — the plan still says no implementation this phase) has been met. This document exists so the *next* planning pass doesn't start from zero.

## Goal

Give the operator a small, auditable set of manual overrides that shape twin *decision-time* behavior without touching the mined `behavior_profile.json`/case corpus directly, and without requiring a full re-run of the mining pipeline to fix one bad pattern.

## Non-goals

- Replacing case mining, Graphiti, or the ITT gate — PersonaForge corrects at the margins, it does not become the primary decision source.
- A general-purpose rules engine. Scope stays narrow: the specific correction shapes enumerated below, not an arbitrary DSL.
- Any UI. This is an operator-facing YAML/JSON file, editable by hand, same as `overlays/example.yaml` — matching how ingest-time overlays already work in this codebase.
- Making PersonaForge overlays visible to or editable by the public bot shell (`BodenDeskBot`) — this is entirely a private-services concern.
- Training anything. PersonaForge is a runtime correction layer, unrelated to U4's LoRA training track.

## What exists today (baseline)

| Layer | Role |
|-------|------|
| `~/brain-data/overlays/example.yaml` | Ingest-time corrections: `exclude`, `retag`, `force`, `merge_hint` — applied when episodes are loaded, not at decision time |
| `~/brain-data/cases/behavior_profile.json` | Mined case corpus the decision modes select from |
| `scripts/brain/cognitive_loop.py` / `services/bodenai/app/cognitive.py` | `decide_from_hits()` — perceive → orient → retrieve → (deliberate, `pfc_loop` only) → gate, returns a `DecisionTrace` |
| `services/bodenai/app/main.py` `_resolve_mode()` | Per-request decision-mode override (`decision_mode` in body/header) |

None of these layers currently have a hook for "always/never do X for pattern Y" that an operator can express without editing generated data files.

## Actors

- **A1. Operator (Boden).** Wants to fix a specific bad twin response pattern in minutes, not by re-running the pipeline or hand-patching `behavior_profile.json`.
- **A2. `pfc_loop` gate (system).** Needs overlay corrections to compose predictably with its existing scoring — an overlay should be able to veto or boost, not silently bypass the gate's safety properties.
- **A3. Future ITT eval (system).** Needs to know when a response is overlay-influenced vs. purely mined, so gate re-runs can separate "the mining is bad" from "an intentional manual override applied."

## Key questions to resolve during planning (not now)

- **Q1. Overlay shape.** Rule-based (`match: {topic, source_family, stimulus_type} → action: {force_mode, boost_score, block_case_id, rewrite_response_template}`), following `example.yaml`'s `action:`-keyed rule list? Or something closer to `behavior_profile.json`'s own schema, treated as a diff/patch?
- **Q2. Where in the pipeline does it apply?** Candidates: (a) post-gate, as a final veto/rewrite pass in `decide_from_hits()`; (b) pre-gate, injected into candidate scoring so the gate's own logic still runs over adjusted scores; (c) both, with different rule types for each. (a) is simplest and lowest-risk to the gate's existing guarantees; (b) is more powerful but risks the gate's safety properties silently.
- **Q3. Versioning/audit.** Does every overlay-influenced response need a `persona_overlay_applied: <rule_id>` field in the trace (mirroring the existing `steps` array in `DecisionTrace`)? Given A3, almost certainly yes — this should not be optional.
- **Q4. Scope of correction types.** Minimum viable set is probably: force a decision mode for a topic/stimulus match, exclude a specific case_id from ever winning gate selection, and boost/penalize a case_id's score by a fixed delta. Response-template rewriting (generating new text, not just re-weighting existing cases) is a much bigger scope jump — likely out of a first pass.
- **Q5. Interaction with the automated ITT gate.** If overlays change response selection, does `eval_itt_gate.py` need to run with overlays on, off, or both (to isolate "did the mining get better" from "did the manual correction help")? This affects whether overlays are gate-comparable or gate-exempt.

## Proposed minimal shape (starting point for `ce-plan`, not a spec)

```yaml
# ~/brain-data/overlays/persona.yaml — decision-time corrections (deferred, not implemented)
rules:
  - id: no-burst-on-serious-topics
    match: { topics: ["grief", "conflict"] }
    action: force_mode
    mode: case_select
  - id: exclude-miscategorized-case
    match: { case_id: "abc123" }
    action: exclude
  - id: boost-good-kotor-response
    match: { case_id: "def456" }
    action: score_delta
    delta: 5.0
```

Applied as a post-gate pass in `decide_from_hits()`, each match logged into `DecisionTrace.steps` as a `persona_overlay` step, so nothing about the gate's own scoring logic changes — overlays only veto/re-rank the gate's output.

## Success criteria (for when this is actually planned + built)

- An operator can suppress or force a specific twin behavior pattern by editing one YAML file, with no pipeline re-run.
- Every overlay-influenced response is traceable in the SSE `trace` event (matching the existing `pfc_loop` trace shape verified in this session's U3 smoke test).
- `eval_itt_gate.py` can still run and compare modes without an overlay silently corrupting the comparison (Q5 resolved before build).

## Scope boundaries

### Deferred to this document's future planning pass (not this phase, not this document)

- Actual implementation (per the remainder plan's explicit U7 scope: "no implementation this phase").
- UI/editor for overlays.
- Response-template rewriting (Q4's larger option).

### Outside PersonaForge's identity entirely

- Public-facing persona editing (private-services-only, per non-goals).
- Replacing case mining or the ITT gate as primary decision sources.

## Sources

- `~/brain-data/overlays/example.yaml` (existing ingest-time overlay precedent)
- `services/bodenai/app/cognitive.py`, `scripts/brain/cognitive_loop.py` (decision pipeline this would hook into)
- `docs/plans/2026-07-24-001-feat-brain-twin-remainder-plan.md` U7 (deferral source)
- `docs/brainstorms/2026-07-23-cognitive-loop-experimental-brain-requirements.md` (only prior mention: "LoRA / PersonaForge | Defer until ITT pass")
