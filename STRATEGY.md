---
name: bolabaden.org
last_updated: 2026-07-24
---

# bolabaden.org Strategy

## Target problem

Visitors need a proof-first field desk for tools, guides, and live infra. Separately, years of Discord, AI chat, and archive exports must become a **queryable private brain** and a **fidelity-checked twin** — without dumping private logs into the Next deploy or shipping prompt-only impersonation.

## Our approach

1. **Proof desk homepage** as the public front door — command-desk aesthetic, not corporate portfolio.
2. **Brain-first (private):** canonical episode IR → BM25 cases + Graphiti mesh → automated ITT gate → BodenAI twin (`pfc_loop` when gate wins).
3. **Portfolio** on `/about` for hiring narrative.
4. **Hands-off gates:** pipeline scripts own promotion decisions; no human ITT session required.

## Who it's for

**Primary:** Operators and curious developers using the desk + tools.

**Secondary:** Recruiters on `/about`.

**Brain / twin (private ops):** Boden — fidelity over friendliness; knowledge lanes ≠ voice lanes; automated ranking gate before mode promotion.

## Key metrics

- **Desk usefulness** — visits that reach projects/guides/dashboard from `/`
- **Brain IR coverage** — episodes by `source_family` with provenance
- **ITT gate quality** — `eval/itt_gate_report.json` method mean ranks (`cognitive_pfc_loop` vs `case_select`)
- **Mesh density** — Neo4j episodic node count; mesh context hit rate on probe tokens
- **Build health** — `npm run build` with brain/twin flags off (default)

## Tracks

### Proof desk cohesion

Ship command desk homepage + public-safe bot shell. Brain/twin APIs stay private until explicitly enabled.

### Private brain warehouse

`$BRAIN_DATA_ROOT` off-git → adapters → episodes → cases → Graphiti (xAI) + BM25 → overlays. `scripts/brain/` + `services/brain/`.

### BodenAI twin (gate-promoted)

Case/mesh cognitive loop consuming brain APIs. Default mode from `eval_itt_gate.py` (currently `pfc_loop`). Not embedded in Next by default.

### LoRA voice lane (cloud)

SFT export staged; train on GPU/HF Jobs after gate — not on local RX 460.

## Milestones

- **2026-06-29** — Discovery hub cohesion shipped
- **2026-07-08** — Static proof desk homepage assets
- **2026-07-18** — Brain-first IR + case mining (30k cases); premature twin ship undone
- **2026-07-24** — Cognitive loop + automated ITT gate; `pfc_loop` promoted over `case_select`

## Not working on

- Prompt-only “act like Boden” without brain grounding
- Public dump of private Discord/Xfire/AI chat corpora
- Human ITT ranking as a required gate (automated gate replaces it)
- LoRA on this host (RX 460 4GB)
- Full 20GB day-one graph (slice + paced load first)
- Cyberscape homepage revival (parked)
- **Status subscriptions (webhook/email alerts on service health)** — Phase 2 product bet, needs a durable store, signed webhook tokens, a background poller, and anonymous-registration abuse controls before any implementation. See `docs/plans/2026-06-29-002-feat-discovery-backlog-plan.md` § Deferred: P5.

## Marketing

**One-liner:** Proof-first command desk for tools and infra — private brain for memory; twin only after automated fidelity gate.

**Key message:** Show the surface. Keep private logs private. Organize once as episodes; let the graph map relations; promote twin modes only when eval says so.
