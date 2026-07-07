#!/usr/bin/env npx tsx
/**
 * Idempotent archive fetcher: downloads manifest entries, updates SHA256.
 * Usage: npx tsx scripts/archive-fetch.ts [--dry-run] [--id <entry-id>]
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "data/archive-manifest.json");
const CACHE_DIR = path.join(ROOT, "data/archive-cache");

type LicenseClass = "public" | "dev-only" | "restricted";

interface ManifestEntry {
  id: string;
  source_url: string;
  local_path?: string;
  sha256: string | null;
  license_class: LicenseClass;
  assignable_tags: string[];
  notes?: string;
}

interface Manifest {
  version: number;
  updated: string;
  entries: ManifestEntry[];
}

async function sha256File(filePath: string): Promise<string> {
  const buf = await readFile(filePath);
  return createHash("sha256").update(buf).digest("hex");
}

async function fetchEntry(entry: ManifestEntry, dryRun: boolean): Promise<void> {
  if (entry.local_path) {
    const local = path.join(ROOT, entry.local_path);
    const hash = await sha256File(local);
    entry.sha256 = hash;
    console.log(`[local] ${entry.id} sha256=${hash.slice(0, 12)}…`);
    return;
  }

  const dest = path.join(CACHE_DIR, `${entry.id}.bin`);
  if (dryRun) {
    console.log(`[dry-run] would fetch ${entry.source_url} -> ${dest}`);
    return;
  }

  await mkdir(CACHE_DIR, { recursive: true });
  const res = await fetch(entry.source_url);
  if (!res.ok) throw new Error(`Fetch failed ${entry.id}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  entry.sha256 = createHash("sha256").update(buf).digest("hex");
  console.log(`[fetch] ${entry.id} -> ${dest} sha256=${entry.sha256.slice(0, 12)}…`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const idIdx = args.indexOf("--id");
  const filterId = idIdx >= 0 ? args[idIdx + 1] : undefined;

  const raw = await readFile(MANIFEST_PATH, "utf8");
  const manifest: Manifest = JSON.parse(raw);

  for (const entry of manifest.entries) {
    if (filterId && entry.id !== filterId) continue;
    if (entry.license_class === "restricted") {
      console.log(`[skip] ${entry.id} restricted`);
      continue;
    }
    try {
      await fetchEntry(entry, dryRun);
    } catch (e) {
      console.error(`[error] ${entry.id}:`, e);
    }
  }

  if (!dryRun) {
    manifest.updated = new Date().toISOString().slice(0, 10);
    await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
