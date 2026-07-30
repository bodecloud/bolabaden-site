# BodenAI twin (consumes brain search)

Requires `services/brain` with indexed IR. Defaults: no LLM → grounded excerpt from voice-lane hits.

```bash
# terminal A
cd services/brain && uvicorn app.main:app --port 8090
# terminal B
export BRAIN_BASE_URL=http://127.0.0.1:8090
export BODENAI_DECISION_MODE=pfc_loop  # gate 2026-07-24: auto ITT promoted pfc_loop over case_select
cd services/bodenai && uvicorn app.main:app --port 8091
```
