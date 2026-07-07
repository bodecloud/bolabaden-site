import hostsBundle from "@/data/hosts.json";
import { applyHeroHosts } from "@/lib/net/hero-hosts";

export interface Host {
  hostname: string;
  org: string;
  location: string;
  neighbors: string[];
  os_type: string;
  ports: number[];
  bbs_config?: { name: string; tagline: string };
  files?: Record<string, string>;
  occupants?: HostOccupant[];
}

export interface HostOccupant {
  login: string;
  name: string;
  tty: string;
  idle: string;
  office: string;
  plan: string;
}

const hosts: Host[] = hostsBundle.hosts as Host[];

applyHeroHosts(hosts);

// Seed demo files on select hosts
for (const h of hosts.slice(0, 50)) {
  h.files = {
    "readme.txt": `Welcome to ${h.hostname}\n${h.org}\n${h.location}`,
    "porthack.exe": "PORTHACK v1.0 - adjacent hosts only",
  };
}

const bbsHosts = new Set(
  hosts.filter((_, i) => i % 120 === 0).map((h) => h.hostname)
);
for (const name of bbsHosts) {
  const h = getHost(name)!;
  h.bbs_config = { name: `${h.org.split(/[\s,]/)[0]} BBS`, tagline: "Welcome to the board" };
  h.ports.push(23);
}

const fallbackNames = [
  "Ada Lovelace",
  "Grace Hopper",
  "Radia Perlman",
  "Ken Thompson",
  "Dennis Ritchie",
  "Evelyn Boyd Granville",
  "Karen Sparck Jones",
  "Mary Allen Wilkes",
];

function slug(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 10) || "operator";
}

function occupantSeed(host: Host): number {
  return [...`${host.hostname}:${host.org}:${host.location}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function hostOccupants(hostname: string): HostOccupant[] {
  const host = getHost(hostname);
  if (!host) return [];
  if (host.occupants?.length) return host.occupants;

  const seed = occupantSeed(host);
  const orgWord = host.org.split(/[\s,.-]+/).find(Boolean) ?? host.hostname;
  const city = host.location.split(",")[0]?.trim() || "machine room";
  return [0, 1, 2].map((offset) => {
    const name = fallbackNames[(seed + offset * 3) % fallbackNames.length]!;
    const loginBase = offset === 0 ? orgWord : name.split(/\s+/).at(-1) ?? name;
    return {
      login: `${slug(loginBase)}${offset || ""}`,
      name,
      tty: `tty${(seed + offset) % 8}`,
      idle: offset === 0 ? "0:03" : offset === 1 ? "1:17" : "2d",
      office: city,
      plan: offset === 0
        ? `Maintaining ${host.hostname} routes and local notes.`
        : offset === 1
          ? `Reviewing ${host.org} archive drops.`
          : `Watching UUCP mail for ${host.hostname}.`,
    };
  });
}

export function getHost(hostname: string): Host | undefined {
  return hosts.find((h) => h.hostname.toLowerCase() === hostname.toLowerCase());
}

export function listHosts(filter?: string): Host[] {
  if (!filter) return hosts.slice(0, 100);
  const q = filter.toLowerCase();
  return hosts.filter(
    (h) =>
      h.hostname.toLowerCase().includes(q) ||
      h.org.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q)
  ).slice(0, 100);
}

export function hostCount(): number {
  return hosts.length;
}

export function findUucpRoute(from: string, to: string): string[] | null {
  const start = getHost(from);
  const goal = getHost(to);
  if (!start || !goal) return null;
  if (start.hostname === goal.hostname) return [start.hostname];

  const queue: string[][] = [[start.hostname]];
  const seen = new Set<string>([start.hostname.toLowerCase()]);

  while (queue.length) {
    const path = queue.shift()!;
    const node = getHost(path[path.length - 1]!);
    if (!node) continue;
    for (const neighbor of node.neighbors) {
      const key = neighbor.toLowerCase();
      if (seen.has(key)) continue;
      const next = [...path, neighbor];
      if (key === goal.hostname.toLowerCase()) {
        return next;
      }
      seen.add(key);
      queue.push(next);
    }
  }

  return null;
}

export function netstatForUser(username: string, loginHosts: string[], rootHosts: string[]): string[] {
  const seed = username.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const picked: Host[] = [];
  for (let i = 0; picked.length < 11 && i < hosts.length; i++) {
    picked.push(hosts[(seed + i * 997) % hosts.length]);
  }
  const lines = [
    "Host            Org                          St",
    "----            ---                          --",
  ];
  for (const h of picked) {
    let st = "  ";
    if (rootHosts.includes(h.hostname)) st = "! ";
    else if (loginHosts.includes(h.hostname)) st = "* ";
    lines.push(
      `${h.hostname.padEnd(16)}${h.org.slice(0, 28).padEnd(29)}${st}`
    );
  }
  return lines;
}

export function uupath(from: string, to: string): string[] {
  const a = getHost(from);
  const b = getHost(to);
  if (!a || !b) return [`Unknown host: ${!a ? from : to}`];
  if (from === to) return [`${from} (local)`];
  const path = findUucpRoute(from, to);
  if (path) return [path.join(" -> ")];
  return [`No uucp path from ${from} to ${to}`];
}

export function uumap(center: string): string[] {
  const host = getHost(center);
  if (!host) return [`Unknown host: ${center}`];

  const lines = [
    `UUCP map for ${host.hostname}`,
    `  ${host.hostname} (${host.org})`,
  ];
  const seen = new Set<string>([host.hostname.toLowerCase()]);

  for (const neighborName of host.neighbors.slice(0, 8)) {
    const neighbor = getHost(neighborName);
    if (!neighbor) continue;
    seen.add(neighbor.hostname.toLowerCase());
    lines.push(`  -> ${neighbor.hostname} (${neighbor.org})`);
    for (const leafName of neighbor.neighbors.slice(0, 4)) {
      const leaf = getHost(leafName);
      if (!leaf || seen.has(leaf.hostname.toLowerCase())) continue;
      lines.push(`     -> ${leaf.hostname} (${leaf.org})`);
    }
  }

  return lines;
}

export { hosts };
