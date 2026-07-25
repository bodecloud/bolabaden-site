# BodenAI twin (consumes brain search)

Requires `services/brain` with indexed IR. Defaults: no LLM → grounded excerpt from voice-lane hits.

```bash
# terminal A
cd services/brain && uvicorn app.main:app --port 8090
# terminal B
export BRAIN_BASE_URL=http://127.0.0.1:8090
cd services/bodenai && uvicorn app.main:app --port 8080
```
