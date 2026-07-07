#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const packageRoot = path.resolve(import.meta.dirname, "..");
const repoRoot = path.resolve(packageRoot, "../..");
const inventoryPath = path.join(repoRoot, "data/cyberscape-parity-inventory.json");
const schemaPath = path.join(repoRoot, "data/cyberscape-parity-inventory.schema.json");
const roadmapPath = path.join(repoRoot, "docs/knowledgebase/50-execution/cyberscape-feature-parity-roadmap.md");

function fail(message) {
  console.error(`Parity inventory invalid: ${message}`);
  process.exitCode = 1;
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    fail(`${path.relative(repoRoot, file)} is not valid JSON: ${error.message}`);
    return null;
  }
}

const inventory = readJson(inventoryPath);
const schema = readJson(schemaPath);

if (!inventory || !schema) process.exit();

if (!Number.isInteger(inventory.version) || inventory.version < 1) {
  fail("version must be a positive integer");
}

const statusValues = new Set(inventory.statusValues);
const evidenceLabels = new Set(inventory.evidenceLabels);
const ids = new Set();
const categories = new Set();
const statuses = new Map();

if (!Array.isArray(inventory.items) || inventory.items.length === 0) {
  fail("items must be a non-empty array");
}

for (const [index, item] of inventory.items.entries()) {
  const label = item?.id ?? `items[${index}]`;
  for (const key of ["id", "category", "baselineCapability", "cyberscapeTarget", "status", "nextAction"]) {
    if (typeof item?.[key] !== "string" || item[key].trim() === "") {
      fail(`${label}.${key} must be a non-empty string`);
    }
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id ?? "")) {
    fail(`${label}.id must be kebab-case`);
  }
  if (ids.has(item.id)) fail(`${item.id} is duplicated`);
  ids.add(item.id);
  categories.add(item.category);

  if (!statusValues.has(item.status)) {
    fail(`${item.id} uses unknown status "${item.status}"`);
  }
  statuses.set(item.status, (statuses.get(item.status) ?? 0) + 1);

  if (!Array.isArray(item.evidence) || item.evidence.length === 0) {
    fail(`${item.id}.evidence must be a non-empty array`);
  } else {
    for (const evidence of item.evidence) {
      if (!evidenceLabels.has(evidence)) {
        fail(`${item.id} uses unknown evidence label "${evidence}"`);
      }
    }
  }

  if (!Array.isArray(item.proof) || item.proof.length === 0) {
    fail(`${item.id}.proof must be a non-empty array`);
  } else {
    for (const proof of item.proof) {
      if (proof.startsWith("http://") || proof.startsWith("https://")) continue;
      if (!existsSync(path.join(repoRoot, proof))) {
        fail(`${item.id} proof path does not exist: ${proof}`);
      }
    }
  }
}

const requiredStatuses = ["implemented", "partial", "context target", "research target", "defer"];
for (const status of requiredStatuses) {
  if (!statuses.has(status)) fail(`inventory has no item with status "${status}"`);
}

const requiredCategories = [
  "access-transport",
  "shell-ergonomics",
  "command-corpus",
  "host-network",
  "files-archives-bbs",
  "progression-ownership",
  "social-multiplayer",
  "basic-programmability",
  "games-amusements",
  "hidden-puzzles",
];
for (const category of requiredCategories) {
  if (!categories.has(category)) fail(`inventory has no item in category "${category}"`);
}

const roadmap = readFileSync(roadmapPath, "utf8");
for (const item of inventory.items) {
  if (!roadmap.includes(item.id)) {
    fail(`roadmap does not mention inventory id "${item.id}"`);
  }
}

if (process.exitCode) process.exit();

const statusSummary = [...statuses.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([status, count]) => `${status}: ${count}`)
  .join(", ");

console.log(`Parity inventory valid: ${inventory.items.length} items across ${categories.size} categories (${statusSummary})`);
