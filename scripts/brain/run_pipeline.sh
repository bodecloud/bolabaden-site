#!/usr/bin/env bash
# Autonomous BodenAI brain pipeline: P1 → P7 (no xfire video transcription)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
# shellcheck disable=SC1091
source .venv/bin/activate 2>/dev/null || true

: "${BRAIN_DATA_ROOT:=$HOME/brain-data}"
: "${BRAIN_BODEN_DISCORD_ID:=227896831944687616}"

export BRAIN_DATA_ROOT BRAIN_BODEN_DISCORD_ID

echo "=== P1: Episode segmentation ==="
python segment_unified.py

echo "=== P2: Case mining ==="
python mine_cases.py

echo "=== P2b: Episode BM25 + Graphiti export ==="
python build_index.py

echo "=== P2c: Case BM25 index ==="
python build_case_index.py

echo "=== P4: Graphiti export (via build_index) — load when Neo4j ready ==="

echo "=== P5 prep: LoRA SFT export ==="
python export_lora.py

echo "=== P7: ITT eval report ==="
python eval_itt.py

echo "=== P7b: ITT human ranking pack ==="
python eval_itt_pack.py --per-type 5 --cognitive-mode pfc_loop

echo "=== P7c: Automated ITT gate (no human session) ==="
python eval_itt_gate.py --judge auto

echo "=== P5 stage: LoRA HF assets ==="
./run_lora_hf.sh
echo "Data root: $BRAIN_DATA_ROOT"
echo "  episodes:  $BRAIN_DATA_ROOT/episodes/episodes.jsonl"
echo "  cases:     $BRAIN_DATA_ROOT/cases/cases.jsonl"
echo "  profile:   $BRAIN_DATA_ROOT/cases/behavior_profile.json"
echo "  eval:      $BRAIN_DATA_ROOT/eval/itt_report.json"
echo "  itt pack:  $BRAIN_DATA_ROOT/eval/itt_packs/pack_seed42.human.jsonl"
echo "  lora:      $BRAIN_DATA_ROOT/lora/sft.jsonl"
echo "  lora stage: $BRAIN_DATA_ROOT/lora/hf_stage/"
echo ""
echo "Optional next:"
echo "  Graphiti: pip install -r requirements-graphiti.txt && python load_graphiti.py --dry-run"
echo "  LoRA:     ./run_lora_hf.sh"
