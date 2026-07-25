# Boden Brain service

Private search over canonical IR (BM25 always-on). Graphiti Neo4j is optional (`--profile graphiti`).

```bash
export BRAIN_DATA_ROOT=$HOME/brain-data
cd services/brain
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8090
```

- `GET /health`
- `POST /v1/search` `{ "query": "...", "voice_only": true }`
- `POST /v1/graphiti/load` when Neo4j + graphiti-core + `OPENAI_API_KEY` configured
- Neo4j: `docker compose -f docker-compose.brain.yml --profile graphiti up -d brain-neo4j`
- Bulk CLI: `scripts/brain/load_graphiti.py --init-indices --limit 200`
