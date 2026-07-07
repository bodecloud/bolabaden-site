#!/usr/bin/env node
/**
 * Orchestrate full identity exports (Perplexity, ChatGPT, Grok) into identity-exports/.
 *
 *   DISPLAY=:0 node scripts/run-identity-export.mjs
 *   DISPLAY=:0 node scripts/run-identity-export.mjs --platform perplexity
 *   DISPLAY=:0 node scripts/run-identity-export.mjs --skip-grok
 */

import { spawnSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const argv = process.argv.slice(2);

const skipGrok = argv.includes("--skip-grok");
const skipChatgpt = argv.includes("--skip-chatgpt");
const skipPerplexity = argv.includes("--skip-perplexity");
const platformArg = argv.includes("--platform") ? argv[argv.indexOf("--platform") + 1] : null;

function run(label, cmd, args, extraEnv = {}) {
  console.log(`\n========== ${label} ==========\n`);
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  if (r.status !== 0) {
    console.error(`\n${label} failed (exit ${r.status ?? 1})`);
    return false;
  }
  return true;
}

const node = process.execPath;
const env = {
  PERPLEXITY_EXPORT_SKIP_PROMPT: process.env.PERPLEXITY_EXPORT_SKIP_PROMPT || "1",
  CHATGPT_EXPORT_SKIP_PROMPT: process.env.CHATGPT_EXPORT_SKIP_PROMPT || "1",
  GROK_EXPORT_SKIP_PROMPT: process.env.GROK_EXPORT_SKIP_PROMPT || "1",
  CHATGPT_SKIP_CF_BOOTSTRAP: process.env.CHATGPT_SKIP_CF_BOOTSTRAP || "1",
};

const steps = [];

if (!skipPerplexity && (!platformArg || platformArg === "perplexity")) {
  steps.push({
    label: "Perplexity discover (all threads)",
    args: ["scripts/discover-perplexity-threads.mjs", "--identity", "--all"],
  });
  steps.push({
    label: "Perplexity export",
    args: ["scripts/extract-perplexity-conversations.mjs", "--identity", "--resume", "--concurrency", "8"],
  });
}

if (!skipChatgpt && (!platformArg || platformArg === "chatgpt")) {
  steps.push({
    label: "ChatGPT identity export (API, all conversations)",
    args: [
      "scripts/extract-identity-chatgpt.mjs",
      "--discover-first",
      "--resume",
      "--concurrency",
      process.env.CHATGPT_IDENTITY_CONCURRENCY || "3",
    ],
  });
}

if (!skipGrok && (!platformArg || platformArg === "grok")) {
  steps.push({
    label: "Grok discover (all conversations)",
    args: ["scripts/discover-grok-conversations.mjs", "--identity", "--all"],
  });
  steps.push({
    label: "Grok export",
    args: ["scripts/extract-grok-conversations.mjs", "--identity", "--resume", "--concurrency", "4"],
  });
}

console.log("Identity export suite → docs/knowledgebase/90-meta/identity-exports/");
console.log(`Steps: ${steps.length}`);

let ok = 0;
for (const step of steps) {
  if (run(step.label, node, step.args, env)) ok++;
}

console.log(`\nFinished ${ok}/${steps.length} step(s).`);
if (ok < steps.length) process.exit(1);
