# BodenAI pipeline — execution status (2026-07-24)

**Authoritative remainder plan:** [`2026-07-24-001-feat-brain-twin-remainder-plan.md`](2026-07-24-001-feat-brain-twin-remainder-plan.md)

Autonomous run completed. Xfire mp4 transcription **skipped** (meta only).

## Phase checklist

| Phase | Status | Artifact |
|-------|--------|----------|
| Unified IR | done | `~/brain-data/unified/conversations.jsonl` (3354 conv) |
| wizardofchaos purge | done | 0 in active corpus |
| P0c audio delivery | done | 3 voice transcripts + delivery sidecars |
| MassiveHDD text | done | halo_script, xfire_meta, school, logs |
| P1 segmentation | done | 10,257 episodes |
| P2 case mining | done | 30,489 cases + behavior_profile.json |
| P2c case index | done | cases_bm25.pkl |
| P3 runtime | done | `services/bodenai` case-first select + burst |
| P4 Graphiti export | done | graphiti/episodes.jsonl |
| P4 Graphiti loader | **in progress** | ~564 Neo4j nodes / ~463 episodic; paced xAI load |
| P5 LoRA export | done | lora/sft.jsonl (7121 rows) |
| P5 LoRA train stage | ready | `run_lora_hf.sh` → lora/hf_stage/ |
| P7 ITT eval baseline | done | eval/itt_report.json |
| P7b ITT ranking pack | done | eval/itt_packs/ |
| P7c ITT automated gate | done | eval/itt_gate_report.json → **promote `pfc_loop`** |
| P3b cognitive loop | done | `cognitive_loop.py` + `BODENAI_DECISION_MODE` |
| P8 command desk | **next** | see home hub plan + remainder U5 |
| P5 HF Jobs train | **operator** | requires GPU + HF credits |
| P9 PersonaForge | deferred | after desk + twin stable |

## Identity (locked)

- **Self:** PuritanWizard `227896831944687616` only
- **Excluded:** wizardofchaos `125433170047795200`
- **Xfire aliases (Boden):** th3w1zard1, th3w1zard3, sumrand0mguy, mast3rrchief, nooberpwner, dwmwizard

## Run everything

```bash
cd scripts/brain
./run_pipeline.sh
```

## Start services

```bash
# Brain (BM25 + case search + mesh) — port 8090
cd services/brain && uvicorn app.main:app --host 127.0.0.1 --port 8090

# BodenAI twin — port 8091 (set BODENAI_DECISION_MODE=pfc_loop)
cd services/bodenai && uvicorn app.main:app --host 127.0.0.1 --port 8091
```

Set `BRAIN_DATA_ROOT=~/brain-data`, optional `BRAIN_SERVICE_TOKEN`, `BODENAI_GATE_THRESHOLD=0.35`.

## Active work queue (from remainder plan)

| Unit | Task | Status |
|------|------|--------|
| U1 | Finish Graphiti paced load | in progress |
| U2 | Gate + `pfc_loop` promotion | done (sync secrets) |
| U3 | Service hardening smoke | partial |
| U4 | LoRA cloud train | staged |
| U5 | Command desk homepage | not started |
| U6 | Public bot shell | not started |

## Commands

```bash
# Automated ITT gate (hands-off)
python eval_itt_gate.py --judge auto

# Resume Graphiti
python load_graphiti.py --batch-size 10 --batch-delay 30 --limit 200 --provider xai --offset $(python -c "import json;print(json.load(open('$HOME/brain-data/graphiti/load_state.json')).get('offset_episodes',0))")

# LoRA stage
./run_lora_hf.sh
```

---

### Delta Update (2026-07-24)

- **Landed:** Automated ITT gate, `eval_itt_auto_rank.py`, `pfc_loop` promotion, cognitive loop + mesh, pipeline P7c hook, LoRA staging.
- **Partial:** Graphiti bulk (~463 episodic, load running); command desk (U5) not started; secrets env may still show `case_select`.
- **Next:** Complete U1 Graphiti → sync promotion env → U5 command desk vertical slice → U6 bot → U4 when GPU/HF credits available.
