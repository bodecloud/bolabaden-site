#!/usr/bin/env npx tsx
/**
 * Parse np43 host list into packages/cyberscape/src/data/hosts.json
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { applyHeroHosts } from "@/lib/net/hero-hosts";

const PKG_ROOT = path.resolve(import.meta.dirname, "..");
const REPO_ROOT = path.resolve(PKG_ROOT, "../..");
const SRC = path.join(REPO_ROOT, "data/raw/np43-host-list.txt");
const OUT = path.join(PKG_ROOT, "src/data/hosts.json");

interface HostRow {
  hostname: string;
  org: string;
  location: string;
  neighbors: string[];
  os_type: string;
  ports: number[];
  bbs_config?: { name: string; tagline: string };
  files?: Record<string, string>;
}

function parseHosts(text: string): HostRow[] {
  const lines = text.split("\n");
  const hosts: HostRow[] = [];
  let inBlock = false;

  for (const line of lines) {
    if (line.includes("```txt")) {
      inBlock = true;
      continue;
    }
    if (line.startsWith("```") && inBlock) break;
    if (!inBlock) continue;
    if (line.includes("----") || line.trim().startsWith("host ")) continue;
    const trimmed = line.trim();
    if (!trimmed) continue;

    const m = trimmed.match(/^(\S+)\s+(.+?)\s{2,}(.+)$/);
    if (!m) continue;
    const [, hostname, org, location] = m;
    hosts.push({
      hostname,
      org: org.trim(),
      location: location.trim(),
      neighbors: [],
      os_type: hostname.length % 3 === 0 ? "vax" : "unix",
      ports: [23, 79],
    });
  }

  // Link neighbors by shared org prefix (heuristic for MVP graph)
  const byOrg = new Map<string, string[]>();
  for (const h of hosts) {
    const key = h.org.split(/[\s,]/)[0]?.toLowerCase() ?? "misc";
    if (!byOrg.has(key)) byOrg.set(key, []);
    byOrg.get(key)!.push(h.hostname);
  }
  for (const h of hosts) {
    const key = h.org.split(/[\s,]/)[0]?.toLowerCase() ?? "misc";
    const peers = (byOrg.get(key) ?? []).filter((p) => p !== h.hostname);
    h.neighbors = peers.slice(0, 4);
  }

  return hosts;
}

async function main() {
  const text = await readFile(SRC, "utf8");
  const hosts = parseHosts(text);
  applyHeroHosts(hosts);
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify({ count: hosts.length, hosts }, null, 2));
  console.log(`Imported ${hosts.length} hosts -> ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
