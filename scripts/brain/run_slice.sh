#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
# shellcheck disable=SC1091
source .venv/bin/activate 2>/dev/null || true

: "${BRAIN_DATA_ROOT:=$HOME/brain-data}"
: "${BRAIN_DISCORD_ROOT:=/home/brunner56/Documents/discord_exports}"
: "${BRAIN_REPO_ROOT:=$(cd "$ROOT/../.." && pwd)}"
: "${BRAIN_BODEN_DISCORD_ID:=227896831944687616}"

export BRAIN_DATA_ROOT BRAIN_DISCORD_ROOT BRAIN_REPO_ROOT BRAIN_BODEN_DISCORD_ID

python overlay_cli.py init-example
python ingest.py \
  --max-discord-files "${BRAIN_MAX_DISCORD_FILES:-15}" \
  --max-episodes-per-discord-file "${BRAIN_MAX_EPISODES_PER_FILE:-200}" \
  --chatgpt-limit "${BRAIN_CHATGPT_LIMIT:-30}" \
  --perplexity-limit "${BRAIN_PERPLEXITY_LIMIT:-20}" \
  --kb-limit "${BRAIN_KB_LIMIT:-20}" \
  --skip-xfire \
  "$@"
python build_index.py
python overlay_cli.py merge-candidates
echo "Brain slice ready under $BRAIN_DATA_ROOT"
