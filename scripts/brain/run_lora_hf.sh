#!/usr/bin/env bash
# P5 operator: publish SFT export + print LLaMA-Factory train command
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
: "${BRAIN_DATA_ROOT:=$HOME/brain-data}"
: "${HF_DATASET_REPO:=bolabaden/boden-sft}"

SFT="$BRAIN_DATA_ROOT/lora/sft.jsonl"
LORA_DIR="$ROOT/lora"
STAGE="$BRAIN_DATA_ROOT/lora/hf_stage"

if [[ ! -f "$SFT" ]]; then
  echo "Missing $SFT — run ./run_pipeline.sh first" >&2
  exit 1
fi

mkdir -p "$STAGE"
cp "$SFT" "$STAGE/sft.jsonl"
cp "$LORA_DIR/dataset_info.json" "$STAGE/dataset_info.json"
cp "$LORA_DIR/train_qwen_lora.yaml" "$STAGE/train_qwen_lora.yaml"

echo "Staged LoRA assets: $STAGE"
echo ""
echo "1) Optional — upload dataset to Hugging Face:"
echo "   hf upload $HF_DATASET_REPO $STAGE --repo-type dataset"
echo ""
echo "2) Train on GPU (LLaMA-Factory, after ITT gate pass):"
echo "   pip install 'llamafactory[torch,metrics]'"
echo "   cd $STAGE && llamafactory-cli train train_qwen_lora.yaml"
echo ""
echo "3) Or use HF Jobs / cloud GPU with the same staged directory."
echo "   Gate: run eval_itt_gate.py — twin should beat stubs before training matters."
