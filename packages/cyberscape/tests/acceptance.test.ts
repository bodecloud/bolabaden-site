import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { eq, like } from "drizzle-orm";
import { currentHost, initialShellState } from "../src/lib/shell/types";
import { executeLine, prompt } from "../src/lib/shell/engine";
import { beginPager } from "../src/lib/shell/pager";
import { POST as shellPostRoute } from "../src/app/api/shell/route";
import { attemptPorthack, attemptRootkit, supportKitForHost } from "../src/lib/progression/engine";
import { getHost, hosts, netstatForUser, uupath as hostUupath } from "../src/lib/net/hosts";
import { commandsForState, BADGE_GATES } from "../src/lib/shell/commands";
import { db } from "../src/lib/db";
import { hostState, shellSessions, userFiles, users } from "../src/lib/db/schema";

type DesktopAppTestId = "terminal" | "system" | "control" | "accounts" | "credentials" | "datetime" | "display" | "sounds" | "power" | "mouse" | "keyboard" | "accessibility" | "regional" | "modems" | "odbc" | "programs" | "internet" | "firewall" | "updates" | "performance" | "restore" | "computer" | "disk" | "eventviewer" | "search" | "connections" | "netsetup" | "netdiag" | "mapdrive" | "offline" | "remote" | "runbox" | "taskmgr" | "scheduler" | "nodes" | "network" | "dialup" | "lineage" | "devices" | "security" | "services" | "shares" | "printers" | "registry" | "folders" | "files" | "boards" | "mail" | "tasks" | "logs" | "help" | "settings";
type DesktopPrefsTest = {
  motion: "normal" | "reduced";
  fontSize: "normal" | "large";
  contrast: "normal" | "high";
  sound: "muted" | "on";
  keyboardMode: "desktop" | "terminal";
};
type DesktopBookmarkTest = {
  id: string;
  kind: "host" | "route";
  target: string;
  label: string;
  route?: string[];
  createdAt: number;
};
type CommandHistoryTest = {
  id: number;
  line: string;
  host: string;
  mode: string;
  createdAt: number;
};
type DesktopTaskTest = {
  id: string;
  kind: "scan" | "transfer" | "maint";
  target: string;
  label: string;
  status: "queued" | "done";
  createdAt: number;
  updatedAt: number;
};
type DesktopEventTest = {
  id: number;
  level: "info" | "warn" | "audit";
  source: string;
  message: string;
  host: string;
  createdAt: number;
};
type DesktopEventViewerEntryTest = {
  id: string;
  log: string;
  level: "info" | "warn" | "audit";
  source: string;
  eventId: number;
  message: string;
  host: string;
  actions: string[];
};
type DesktopSearchEntryTest = {
  id: string;
  scope: string;
  name: string;
  location: string;
  summary: string;
  source: string;
  actions: string[];
};
type DesktopConnectionEntryTest = {
  id: string;
  name: string;
  type: string;
  status: "connected" | "enabled" | "limited" | "firewalled" | "queued" | "disabled";
  device: string;
  host: string;
  speed: string;
  source: string;
  actions: string[];
};
type DesktopNetSetupEntryTest = {
  id: string;
  stage: string;
  item: string;
  status: string;
  source: string;
  actions: string[];
};
type DesktopNetDiagnosticEntryTest = {
  id: string;
  test: string;
  target: string;
  result: "pass" | "warn" | "fail" | "info";
  detail: string;
  source: string;
  actions: string[];
};
type DesktopMappedDriveEntryTest = {
  id: string;
  drive: string;
  remote: string;
  status: string;
  capacity: string;
  source: string;
  actions: string[];
};
type DesktopOfflineEntryTest = {
  id: string;
  location: string;
  item: string;
  status: string;
  size: string;
  source: string;
  actions: string[];
};
type DesktopLineageEntryTest = {
  id: string;
  era: "pre-dialup" | "dialup" | "packet" | "internet" | "lan";
  method: string;
  status: string;
  host: string;
  path: string;
  speed: string;
  meaning: string;
  actions: string[];
};
type DesktopRemoteEntryTest = {
  id: string;
  host: string;
  profile: string;
  status: "connected" | "available" | "credentialed" | "queued" | "blocked";
  access: "local" | "root" | "login" | "public";
  route: string[];
  display: string;
  source: string;
  actions: string[];
};
type DesktopRunEntryTest = {
  id: string;
  command: string;
  target: string;
  status: "ready" | "recent" | "elevated" | "blocked" | "missing";
  source: string;
  actions: string[];
};
type DesktopFileEntryTest = {
  id: string;
  kind: "host" | "download" | "home";
  name: string;
  path: string;
  size: number;
  host: string;
  updatedAt: number;
};
type DesktopMailEntryTest = {
  id: string;
  from: string;
  to: string;
  subject: string;
  preview: string;
  createdAt: number;
};
type DesktopBoardEntryTest = {
  id: string;
  kind: "bbs" | "sysop" | "usenet";
  board: string;
  author: string;
  subject: string;
  preview: string;
  createdAt: number;
};
type DesktopSystemEntryTest = {
  id: string;
  group: string;
  name: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopControlEntryTest = {
  id: string;
  category: string;
  applet: string;
  status: string;
  source: string;
  actions: string[];
};
type DesktopHelpEntryTest = {
  id: string;
  section: string;
  topic: string;
  status: string;
  source: string;
  actions: string[];
};
type DesktopAccountEntryTest = {
  id: string;
  scope: string;
  name: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopCredentialEntryTest = {
  id: string;
  target: string;
  username: string;
  kind: string;
  status: "active" | "stored" | "elevated" | "missing" | "revoked";
  source: string;
  actions: string[];
};
type DesktopTimeEntryTest = {
  id: string;
  tab: string;
  name: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopDisplayEntryTest = {
  id: string;
  tab: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopSoundEntryTest = {
  id: string;
  tab: string;
  item: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopPowerEntryTest = {
  id: string;
  scheme: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopMouseEntryTest = {
  id: string;
  tab: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopKeyboardEntryTest = {
  id: string;
  tab: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopAccessibilityEntryTest = {
  id: string;
  tab: string;
  option: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopRegionalEntryTest = {
  id: string;
  tab: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopModemEntryTest = {
  id: string;
  tab: string;
  name: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopOdbcEntryTest = {
  id: string;
  tab: string;
  name: string;
  driver: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopProgramEntryTest = {
  id: string;
  category: string;
  name: string;
  version: string;
  status: "installed" | "available" | "downloaded" | "queued";
  source: string;
  actions: string[];
};
type DesktopInternetEntryTest = {
  id: string;
  tab: string;
  zone: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopFirewallEntryTest = {
  id: string;
  tab: string;
  name: string;
  profile: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopUpdateEntryTest = {
  id: string;
  tab: string;
  name: string;
  channel: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopPerformanceEntryTest = {
  id: string;
  object: string;
  counter: string;
  instance: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopRestoreEntryTest = {
  id: string;
  tab: string;
  name: string;
  status: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopComputerEntryTest = {
  id: string;
  tree: string;
  node: string;
  status: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopDiskEntryTest = {
  id: string;
  disk: string;
  volume: string;
  status: string;
  capacity: string;
  used: string;
  source: string;
  actions: string[];
};
type DesktopFolderEntryTest = {
  id: string;
  tab: string;
  option: string;
  value: string;
  source: string;
  actions: string[];
};
type DesktopProcessEntryTest = {
  id: string;
  pid: number;
  tty: string;
  user: string;
  host: string;
  command: string;
  status: "running" | "linked" | "watching" | "queued" | "foreground";
  source: string;
  actions: string[];
};
type DesktopScheduleEntryTest = {
  id: string;
  name: string;
  trigger: string;
  target: string;
  status: "ready" | "queued" | "running" | "disabled";
  lastRun: string;
  nextRun: string;
  source: string;
  actions: string[];
};
type DesktopNetworkEntryTest = {
  id: string;
  host: string;
  org: string;
  location: string;
  access: "local" | "root" | "login" | "public";
  route: string[];
  ports: number[];
  bbs: boolean;
  bookmarked: boolean;
};
type DesktopDialupEntryTest = {
  id: string;
  name: string;
  host: string;
  status: "connected" | "saved" | "available" | "watched" | "busy" | "no-carrier";
  access: "local" | "root" | "login" | "public";
  route: string[];
  number: string;
  speed: string;
  lastSeen: string;
  actions: string[];
};
type DesktopDeviceEntryTest = {
  id: string;
  host: string;
  category: string;
  name: string;
  status: "ok" | "busy" | "warning" | "offline";
  driver: string;
  resource: string;
  actions: string[];
};
type DesktopNodeEntryTest = {
  id: string;
  host: string;
  org: string;
  location: string;
  role: "current" | "home" | "login" | "root";
  access: "local" | "root" | "login" | "public";
  route: string[];
  ports: number[];
};
type DesktopSecurityEntryTest = {
  id: string;
  host: string;
  access: "local" | "root" | "login" | "public";
  owner: string | null;
  posture: "local" | "controlled" | "watched" | "exposed" | "unknown";
  ports: number[];
  checks: string[];
  actions: string[];
};
type DesktopServiceEntryTest = {
  id: string;
  host: string;
  port: number;
  name: string;
  status: "running" | "reachable" | "restricted";
  access: "local" | "root" | "login" | "public";
  banner: string;
  actions: string[];
};
type DesktopShareEntryTest = {
  id: string;
  host: string;
  name: string;
  kind: "host" | "home" | "download";
  access: "local" | "root" | "login" | "public";
  path: string;
  files: number;
  writable: boolean;
  actions: string[];
};
type DesktopPrintEntryTest = {
  id: string;
  host: string;
  queue: string;
  status: "ready" | "queued" | "held";
  document: string;
  source: string;
  pages: number;
  actions: string[];
};
type DesktopRegistryEntryTest = {
  id: string;
  hive: "HKCU" | "HKLM" | "HKU";
  key: string;
  name: string;
  value: string;
  source: string;
  writable: boolean;
  actions: string[];
};

interface ShellApiResponse {
  sessionId: string;
  prompt: string;
  output: string[];
  pager?: boolean;
  stty?: "normal" | "dumb" | "tty";
  desktopTheme?: "nt" | "2000" | "xp" | "7";
  desktopActiveApp?: DesktopAppTestId;
  desktopOpenApps?: DesktopAppTestId[];
  desktopMinimizedApps?: DesktopAppTestId[];
  desktopMaximizedApps?: DesktopAppTestId[];
  desktopWindowPositions?: Partial<Record<DesktopAppTestId, { x: number; y: number }>>;
  desktopPrefs?: DesktopPrefsTest;
  desktopBookmarks?: DesktopBookmarkTest[];
  commandHistory?: CommandHistoryTest[];
  desktopTasks?: DesktopTaskTest[];
  desktopEvents?: DesktopEventTest[];
  desktopEventViewer?: DesktopEventViewerEntryTest[];
  desktopSearch?: DesktopSearchEntryTest[];
  desktopConnections?: DesktopConnectionEntryTest[];
  desktopNetSetup?: DesktopNetSetupEntryTest[];
  desktopNetDiagnostics?: DesktopNetDiagnosticEntryTest[];
  desktopMappedDrives?: DesktopMappedDriveEntryTest[];
  desktopOffline?: DesktopOfflineEntryTest[];
  desktopFiles?: DesktopFileEntryTest[];
  desktopMail?: DesktopMailEntryTest[];
  desktopBoards?: DesktopBoardEntryTest[];
  desktopSystem?: DesktopSystemEntryTest[];
  desktopControl?: DesktopControlEntryTest[];
  desktopHelp?: DesktopHelpEntryTest[];
  desktopCredentials?: DesktopCredentialEntryTest[];
  desktopAccounts?: DesktopAccountEntryTest[];
  desktopTime?: DesktopTimeEntryTest[];
  desktopDisplay?: DesktopDisplayEntryTest[];
  desktopSounds?: DesktopSoundEntryTest[];
  desktopPower?: DesktopPowerEntryTest[];
  desktopMouse?: DesktopMouseEntryTest[];
  desktopKeyboard?: DesktopKeyboardEntryTest[];
  desktopAccessibility?: DesktopAccessibilityEntryTest[];
  desktopRegional?: DesktopRegionalEntryTest[];
  desktopModems?: DesktopModemEntryTest[];
  desktopOdbc?: DesktopOdbcEntryTest[];
  desktopPrograms?: DesktopProgramEntryTest[];
  desktopInternet?: DesktopInternetEntryTest[];
  desktopFirewall?: DesktopFirewallEntryTest[];
  desktopUpdates?: DesktopUpdateEntryTest[];
  desktopPerformance?: DesktopPerformanceEntryTest[];
  desktopRestore?: DesktopRestoreEntryTest[];
  desktopComputer?: DesktopComputerEntryTest[];
  desktopDisk?: DesktopDiskEntryTest[];
  desktopFolders?: DesktopFolderEntryTest[];
  desktopProcesses?: DesktopProcessEntryTest[];
  desktopSchedule?: DesktopScheduleEntryTest[];
  desktopNetwork?: DesktopNetworkEntryTest[];
  desktopDialup?: DesktopDialupEntryTest[];
  desktopLineage?: DesktopLineageEntryTest[];
  desktopRemote?: DesktopRemoteEntryTest[];
  desktopRun?: DesktopRunEntryTest[];
  desktopDevices?: DesktopDeviceEntryTest[];
  desktopNodes?: DesktopNodeEntryTest[];
  desktopSecurity?: DesktopSecurityEntryTest[];
  desktopServices?: DesktopServiceEntryTest[];
  desktopShares?: DesktopShareEntryTest[];
  desktopPrint?: DesktopPrintEntryTest[];
  desktopRegistry?: DesktopRegistryEntryTest[];
  desktopSnapshot?: {
    currentHost: string;
    homeHost: string;
    cwd: string;
    username: string;
    loggedIn: boolean;
    shellMode: string;
    ttyPort: number;
    badges: number;
    loginHosts: number;
    rootHosts: number;
    downloads: number;
    mailbox: number;
    remoteDepth: number;
    campHost: string | null;
    tunnel: string | null;
    stty: "normal" | "dumb" | "tty";
    desktopTheme: "nt" | "2000" | "xp" | "7";
    desktopActiveApp: DesktopAppTestId;
    desktopOpenApps: DesktopAppTestId[];
    desktopMinimizedApps: DesktopAppTestId[];
    desktopMaximizedApps: DesktopAppTestId[];
    desktopWindowPositions: Partial<Record<DesktopAppTestId, { x: number; y: number }>>;
    desktopPrefs: DesktopPrefsTest;
    desktopBookmarks: DesktopBookmarkTest[];
    commandHistory: CommandHistoryTest[];
    desktopTasks: DesktopTaskTest[];
    desktopEvents: DesktopEventTest[];
    desktopEventViewer: DesktopEventViewerEntryTest[];
    desktopSearch: DesktopSearchEntryTest[];
    desktopConnections: DesktopConnectionEntryTest[];
    desktopNetSetup: DesktopNetSetupEntryTest[];
    desktopNetDiagnostics: DesktopNetDiagnosticEntryTest[];
    desktopMappedDrives: DesktopMappedDriveEntryTest[];
    desktopOffline: DesktopOfflineEntryTest[];
    desktopFiles: DesktopFileEntryTest[];
    desktopMail: DesktopMailEntryTest[];
    desktopBoards: DesktopBoardEntryTest[];
    desktopSystem: DesktopSystemEntryTest[];
    desktopControl: DesktopControlEntryTest[];
    desktopHelp: DesktopHelpEntryTest[];
    desktopCredentials: DesktopCredentialEntryTest[];
    desktopAccounts: DesktopAccountEntryTest[];
    desktopTime: DesktopTimeEntryTest[];
    desktopDisplay: DesktopDisplayEntryTest[];
    desktopSounds: DesktopSoundEntryTest[];
    desktopPower: DesktopPowerEntryTest[];
    desktopMouse: DesktopMouseEntryTest[];
    desktopKeyboard: DesktopKeyboardEntryTest[];
    desktopAccessibility: DesktopAccessibilityEntryTest[];
    desktopRegional: DesktopRegionalEntryTest[];
    desktopModems: DesktopModemEntryTest[];
    desktopOdbc: DesktopOdbcEntryTest[];
    desktopPrograms: DesktopProgramEntryTest[];
    desktopInternet: DesktopInternetEntryTest[];
    desktopFirewall: DesktopFirewallEntryTest[];
    desktopUpdates: DesktopUpdateEntryTest[];
    desktopPerformance: DesktopPerformanceEntryTest[];
    desktopRestore: DesktopRestoreEntryTest[];
    desktopComputer: DesktopComputerEntryTest[];
    desktopDisk: DesktopDiskEntryTest[];
    desktopFolders: DesktopFolderEntryTest[];
    desktopProcesses: DesktopProcessEntryTest[];
    desktopSchedule: DesktopScheduleEntryTest[];
    desktopNetwork: DesktopNetworkEntryTest[];
    desktopDialup: DesktopDialupEntryTest[];
    desktopLineage: DesktopLineageEntryTest[];
    desktopRemote: DesktopRemoteEntryTest[];
    desktopRun: DesktopRunEntryTest[];
    desktopDevices: DesktopDeviceEntryTest[];
    desktopNodes: DesktopNodeEntryTest[];
    desktopSecurity: DesktopSecurityEntryTest[];
    desktopServices: DesktopServiceEntryTest[];
    desktopShares: DesktopShareEntryTest[];
    desktopPrint: DesktopPrintEntryTest[];
    desktopRegistry: DesktopRegistryEntryTest[];
  };
}

async function shellPost(
  sessionId?: string,
  line?: string,
  desktopActiveApp?: ShellApiResponse["desktopActiveApp"] | string,
  desktopOpenApps?: string[],
  desktopMinimizedApps?: string[],
  desktopWindowPositions?: Record<string, unknown>,
  desktopPrefs?: Record<string, unknown>,
  desktopPref?: { key?: unknown; value?: unknown },
  desktopMaximizedApps?: string[],
): Promise<ShellApiResponse> {
  const response = await shellPostRoute(new Request("http://cyberscape.local/api/shell", {
    method: "POST",
    body: JSON.stringify({ sessionId, line, desktopActiveApp, desktopOpenApps, desktopMinimizedApps, desktopMaximizedApps, desktopWindowPositions, desktopPrefs, desktopPref }),
  }));
  return await response.json() as ShellApiResponse;
}

async function downloadBbsRootkit(sessionId: string): Promise<void> {
  await shellPost(sessionId, "telnet bbs");
  await shellPost(sessionId, "guest");
  const listing = await shellPost(sessionId, "F");
  const text = listing.output.join("\n");
  const rootkit = text.match(/^\[(\d+)\].*ROOTKIT\.EXE\s+\d+$/im);
  const unixkit = text.match(/^\[(\d+)\].*UNIXKIT\.EXE\s+\d+$/im);
  assert.ok(rootkit, "expected ROOTKIT.EXE in the BBS file listing");
  assert.ok(unixkit, "expected UNIXKIT.EXE in the BBS file listing");
  await shellPost(sessionId, rootkit[1]!);
  await shellPost(sessionId, "F");
  await shellPost(sessionId, unixkit[1]!);
  await shellPost(sessionId, "Q");
}

function findUucpRouteFrom(startHost: string, minDepth = 2): string[] | null {
  const start = getHost(startHost);
  if (!start) return null;

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
      if (next.length - 1 >= minDepth) return next;
      seen.add(key);
      queue.push(next);
    }
  }
  return null;
}

function findUucpPair(minDepth = 2): [string, string, number] | null {
  for (const host of hosts) {
    const route = findUucpRouteFrom(host.hostname, minDepth);
    if (route) return [route[0]!, route.at(-1)!, route.length - 1];
  }
  return null;
}

test("NLI prompt is dot", async () => {
  const state = initialShellState();
  const { output } = await executeLine(state, "?");
  assert.ok(output.some((l) => l.includes("login")));
});

test("NLI transport verbs allow pre-login exploration", async () => {
  const state = initialShellState();

  const news = await executeLine(state, "news news");
  assert.match(news.output.join("\n"), /USENET archive reader/);
  assert.equal(prompt(state), "news>");
  await executeLine(state, "quit");

  const irc = await executeLine(state, "irc irc");
  assert.match(irc.output.join("\n"), /IRC connected to irc/i);
  assert.equal(prompt(state), "irc>");
  const who = await executeLine(state, "who");
  assert.match(who.output.join("\n"), /routebot/);
  await executeLine(state, "quit");

  const relay = await executeLine(state, "relay");
  assert.match(relay.output.join("\n"), /RELAY connected to relay/i);
  assert.equal(prompt(state), "relay>");
  const relayHelp = await executeLine(state, "help");
  assert.match(relayHelp.output.join("\n"), /RELAY commands/i);
  await executeLine(state, "quit");

  const shelf = await executeLine(state, "game");
  assert.match(shelf.output.join("\n"), /Z-Code shelf/);
  const launch = await executeLine(state, "game zork.gam");
  assert.match(launch.output.join("\n"), /Running zork\.gam/i);
  assert.equal(prompt(state), ">");
  await executeLine(state, "quit");

  const telnet = await executeLine(state, "telnet bbs");
  assert.match(telnet.output.join("\n"), /BBS/);
  assert.equal(prompt(state), "-");
});

test("badge gates hide netstat until networker", () => {
  const state = initialShellState();
  state.loggedIn = true;
  state.username = "tester";
  assert.equal(BADGE_GATES.netstat, "networker");
  const without = commandsForState(state);
  assert.ok(!without.includes("netstat"));
  state.badges.push("networker");
  assert.ok(commandsForState(state).includes("netstat"));
});

test("hosts output pages through --More--", async () => {
  const state = initialShellState();
  const first = await executeLine(state, "hosts");
  assert.equal(first.pager, true);
  assert.ok(first.output.length > 0);
  assert.ok(first.output.length <= 12);
  assert.ok(state.pager);

  const next = await executeLine(state, "__more__");
  assert.ok(next.output.length > 0);
  assert.ok(next.output.some((line) => line.includes("hosts on network")));
});

test("pager supports back, top, bottom, line movement, search, and quit", async () => {
  const state = initialShellState();
  const pagerLines = Array.from({ length: 40 }, (_, index) => `line-${String(index + 1).padStart(2, "0")}`);
  const first = beginPager(state, pagerLines);
  assert.equal(first.pager, true);
  const firstPage = first.output;

  const next = await executeLine(state, "__more__");
  assert.equal(next.pager, true);
  assert.notDeepEqual(next.output, firstPage);

  const back = await executeLine(state, "b");
  assert.deepEqual(back.output, firstPage);
  assert.equal(back.pager, true);

  await executeLine(state, "G");
  assert.equal(state.pager, null);

  const restarted = beginPager(state, pagerLines);
  assert.equal(restarted.pager, true);

  const found = await executeLine(state, "/line-39");
  assert.ok(found.output.some((line) => line.includes("line-39")));

  beginPager(state, pagerLines);
  const oneDown = await executeLine(state, "j");
  assert.equal(oneDown.output.length, 1);
  const oneUp = await executeLine(state, "k");
  assert.equal(oneUp.output.length, 1);
  assert.equal(oneUp.output[0], firstPage.at(-1));

  const top = await executeLine(state, "g");
  assert.deepEqual(top.output, firstPage);

  const quit = await executeLine(state, "q");
  assert.match(quit.output.join("\n"), /Pager canceled/);
  assert.equal(state.pager, null);
});

test("browser terminal passes typed pager commands through the API", async () => {
  const session = await shellPost();
  const first = await shellPost(session.sessionId, "hosts");
  assert.equal(first.pager, true);

  const bottom = await shellPost(session.sessionId, "G");
  assert.ok(bottom.output.some((line) => line.includes("hosts on network")));
  assert.equal(bottom.pager, false);
});

test("shell pipes filter paginated command output", async () => {
  const state = initialShellState();
  const grep = await executeLine(state, "hosts | grep Host");
  const head = await executeLine(state, "hosts | grep a | head 3");
  const sorted = await executeLine(state, "hosts | head 5 | sort");
  const wc = await executeLine(state, "hosts | head 5 | wc");

  assert.match(grep.output.join("\n"), /Host/);
  assert.ok(head.output.length <= 3);
  assert.deepEqual(sorted.output, [...sorted.output].sort((a, b) => a.localeCompare(b)));
  assert.match(wc.output.join("\n"), /^\d+ \d+ \d+$/);
});

test("utility commands expose retro shell helpers", async () => {
  const state = initialShellState();
  const rot13 = await executeLine(state, "rot13 cyberscape");
  const md5 = await executeLine(state, "md5 cyberscape");
  const roll = await executeLine(state, "roll 2d6");
  const uuplot = await executeLine(state, "uuplot relay");
  const calc = await executeLine(state, "calc 12 * 3 + 4");
  const factor = await executeLine(state, "factor 84");
  const primes = await executeLine(state, "primes 20");
  const ping = await executeLine(state, "ping relay");
  const morse = await executeLine(state, "morse sos");
  const units = await executeLine(state, "units 2 mb kb");
  const rfc = await executeLine(state, "rfc 854");
  const notes = await executeLine(state, "notes");
  const help = await executeLine(state, "help porthack");
  const helpSet = await executeLine(state, "help set");

  assert.match(rot13.output.join("\n"), /plorefpncr/i);
  assert.match(md5.output.join("\n"), /^[a-f0-9]{32}$/i);
  assert.match(roll.output.join("\n"), /Total:/);
  assert.match(uuplot.output.join("\n"), /UUPlot/i);
  assert.match(calc.output.join("\n"), /40/);
  assert.match(factor.output.join("\n"), /84: 2 2 3 7/);
  assert.match(primes.output.join("\n"), /2 3 5 7 11 13 17 19/);
  assert.match(ping.output.join("\n"), /PING relay/i);
  assert.match(morse.output.join("\n"), /\.\.\. --- \.\.\./);
  assert.match(units.output.join("\n"), /2048/);
  assert.match(rfc.output.join("\n"), /Telnet Protocol/i);
  assert.match(notes.output.join("\n"), /scores \/badges/i);
  assert.match(help.output.join("\n"), /Create a login on an adjacent host/);
  assert.match(helpSet.output.join("\n"), /Set session options like SSH key material/);
});

test("terminal toy commands render manual-listed displays", async () => {
  const state = initialShellState();
  const board = await executeLine(state, "2048");
  const aquarium = await executeLine(state, "aquarium");
  const rain = await executeLine(state, "rain");
  const starwars = await executeLine(state, "starwars");
  const eliza = await executeLine(state, "eliza I am on a host");
  const phoon = await executeLine(state, "phoon");
  const pig = await executeLine(state, "pig cyberscape terminal");
  const fnord = await executeLine(state, "fnord");
  const qr = await executeLine(state, "qr cyberscape");
  const a2 = await executeLine(state, "a2 ok");
  const ac = await executeLine(state, "ac 6 * 7");
  const bf = await executeLine(state, "bf +++.");
  const c8 = await executeLine(state, "c8");
  const cal = await executeLine(state, "cal 6 2026");
  const ching = await executeLine(state, "ching routing");
  const geoip = await executeLine(state, "geoip relay");
  const octopus = await executeLine(state, "octopus");
  const rig = await executeLine(state, "rig");
  const sleep = await executeLine(state, "sleep 1");
  const typespeed = await executeLine(state, "typespeed old net");

  assert.match(board.output.join("\n"), /2048/);
  assert.match(aquarium.output.join("\n"), /Aquarium/);
  assert.match(rain.output.join("\n"), /rain/);
  assert.match(starwars.output.join("\n"), /Episode IV/);
  assert.match(eliza.output.join("\n"), /ELIZA/);
  assert.match(phoon.output.join("\n"), /Moon phase/);
  assert.match(pig.output.join("\n"), /erscapecybay erminaltay/i);
  assert.match(fnord.output.join("\n"), /fnord/);
  assert.match(qr.output.join("\n"), /QR:/);
  assert.match(a2.output.join("\n"), /4f/);
  assert.match(ac.output.join("\n"), /42/);
  assert.match(bf.output.join("\n"), /BF cells/);
  assert.match(c8.output.join("\n"), /CHIP-8/);
  assert.match(cal.output.join("\n"), /June 2026/);
  assert.match(ching.output.join("\n"), /I Ching hexagram/);
  assert.match(geoip.output.join("\n"), /relay:/i);
  assert.match(octopus.output.join("\n"), /octopus/);
  assert.match(rig.output.join("\n"), /Random identity/);
  assert.match(sleep.output.join("\n"), /Awake/);
  assert.match(typespeed.output.join("\n"), /Score:/);
});

test("stty modes shape API output before it reaches the terminal client", async () => {
  const session = await shellPost();
  const username = `stty${Date.now()}`;

  await shellPost(session.sessionId, `newuser ${username} password`);

  const normal = await shellPost(session.sessionId, "aquarium");
  assert.equal(normal.stty, "normal");
  assert.ok(normal.output.some((line) => line.includes("~~~~")));

  const dumbMode = await shellPost(session.sessionId, "stty /dumb");
  assert.equal(dumbMode.stty, "dumb");
  assert.match(dumbMode.output.join("\n"), /STTY mode: dumb/);

  const dumbAquarium = await shellPost(session.sessionId, "aquarium");
  assert.equal(dumbAquarium.stty, "dumb");
  assert.ok(!dumbAquarium.output.some((line) => line.includes("~~~~")));
  assert.ok(dumbAquarium.output.every((line) => !/[\u0000-\u001f\u007f]/.test(line)));

  const ttyMode = await shellPost(session.sessionId, "stty /tty");
  assert.equal(ttyMode.stty, "tty");

  const ttyFiglet = await shellPost(
    session.sessionId,
    "figlet abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz"
  );
  assert.equal(ttyFiglet.stty, "tty");
  assert.ok(ttyFiglet.output.every((line) => line.length <= 78));

  const reset = await shellPost(session.sessionId, "stty");
  assert.equal(reset.stty, "normal");
});

test("desktop theme is backend-owned and persists through the shell API", async () => {
  const session = await shellPost();
  assert.equal(session.desktopTheme, "xp");

  const setNt = await shellPost(session.sessionId, "theme nt");
  assert.equal(setNt.desktopTheme, "nt");
  assert.match(setNt.output.join("\n"), /Theme set: nt/);

  const reload = await shellPost(session.sessionId);
  assert.equal(reload.desktopTheme, "nt");

  const invalid = await shellPost(session.sessionId, "theme vista");
  assert.equal(invalid.desktopTheme, "nt");
  assert.match(invalid.output.join("\n"), /Usage: theme <nt\|2000\|xp\|7>/);
});

test("desktop theme persists on the user profile across fresh sessions", async () => {
  const username = `theme${Date.now()}`;
  const session = await shellPost();

  const preAccount = await shellPost(session.sessionId, "theme 7");
  assert.equal(preAccount.desktopTheme, "7");

  const created = await shellPost(session.sessionId, `newuser ${username} password`);
  assert.equal(created.desktopTheme, "7");

  const changed = await shellPost(session.sessionId, "theme 2000");
  assert.equal(changed.desktopTheme, "2000");

  const fresh = await shellPost();
  assert.equal(fresh.desktopTheme, "xp");

  const login = await shellPost(fresh.sessionId, `login ${username} password`);
  assert.equal(login.desktopTheme, "2000");

  const row = db.select().from(users).where(eq(users.username, username)).get();
  assert.equal(row?.desktopTheme, "2000");
});

test("desktop snapshot exposes bounded server-owned session state", async () => {
  const session = await shellPost();
  assert.equal(session.desktopSnapshot?.currentHost, "cyberscape");
  assert.equal(session.desktopSnapshot?.loggedIn, false);
  assert.equal(session.desktopSnapshot?.desktopTheme, "xp");
  assert.equal(session.desktopSnapshot?.desktopActiveApp, "terminal");
  assert.deepEqual(session.desktopSnapshot?.desktopPrefs, { motion: "normal", fontSize: "normal", contrast: "normal", sound: "muted", keyboardMode: "desktop" });
  assert.deepEqual(session.desktopSnapshot?.desktopBookmarks, []);
  assert.deepEqual(session.desktopSnapshot?.commandHistory, []);
  assert.deepEqual(session.desktopSnapshot?.desktopTasks, []);
  assert.deepEqual(session.desktopSnapshot?.desktopEvents, []);
  assert.ok(session.desktopSnapshot?.desktopFiles.some((file) => file.kind === "host"));
  assert.deepEqual(session.desktopSnapshot?.desktopMail, []);
  assert.ok(session.desktopSnapshot?.desktopBoards.some((entry) => entry.kind === "usenet"));
  assert.ok(session.desktopSnapshot?.desktopSystem.some((entry) => entry.name === "Shell Version" && entry.value.includes("Windows XP")));
  assert.ok(session.desktopSnapshot?.desktopNetwork.some((entry) => entry.access === "local" && entry.host === "cyberscape"));
  assert.ok(session.desktopSnapshot?.desktopDialup.some((entry) => entry.status === "connected" && entry.host === "cyberscape"));
  assert.ok(session.desktopSnapshot?.desktopDevices.some((entry) => entry.host === "cyberscape" && entry.category === "Computer" && entry.status === "ok"));
  assert.ok(session.desktopSnapshot?.desktopNodes.some((entry) => entry.role === "current" && entry.host === "cyberscape"));
  assert.ok(session.desktopSnapshot?.desktopSecurity.some((entry) => entry.posture === "local" && entry.host === "cyberscape"));
  assert.ok(session.desktopSnapshot?.desktopServices.some((entry) => entry.host === "cyberscape" && entry.status === "running"));
  assert.ok(session.desktopSnapshot?.desktopShares.some((entry) => entry.host === "cyberscape" && entry.kind === "host"));
  assert.ok(session.desktopSnapshot?.desktopPrint.some((entry) => entry.host === "cyberscape" && entry.status === "ready"));
  assert.ok(session.desktopSnapshot?.desktopRegistry.some((entry) => entry.hive === "HKCU" && entry.name === "DesktopTheme" && entry.value === "xp"));

  const themed = await shellPost(session.sessionId, "theme nt");
  assert.equal(themed.desktopSnapshot?.desktopTheme, "nt");
  assert.ok(themed.desktopSnapshot?.desktopRegistry.some((entry) => entry.name === "DesktopTheme" && entry.value === "nt"));

  const username = `snap${Date.now()}`;
  const created = await shellPost(session.sessionId, `newuser ${username} password`);
  assert.equal(created.desktopSnapshot?.loggedIn, true);
  assert.equal(created.desktopSnapshot?.username, username);
  assert.equal(created.desktopSnapshot?.homeHost, "cyberscape");
  assert.equal(created.desktopSnapshot?.cwd, `/home/${username}`);
});

test("bookmarks are backend-owned session notes with text client parity", async () => {
  const session = await shellPost();

  const empty = await shellPost(session.sessionId, "bookmarks");
  assert.match(empty.output.join("\n"), /Bookmarks:\n  none/);

  const hostBookmark = await shellPost(session.sessionId, "bookmark add relay packet switch");
  assert.equal(hostBookmark.desktopBookmarks?.[0]?.kind, "host");
  assert.equal(hostBookmark.desktopBookmarks?.[0]?.target, "relay");
  assert.equal(hostBookmark.desktopBookmarks?.[0]?.label, "packet switch");
  assert.match(hostBookmark.output.join("\n"), /Bookmark saved: host relay/);
  assert.ok(hostBookmark.desktopEvents?.some((event) => event.message === "bookmark saved host relay"));

  const route = findUucpRouteFrom(currentHost(initialShellState()), 2);
  assert.ok(route, "expected a route target for bookmark coverage");
  const target = route![1];
  const routeBookmark = await shellPost(session.sessionId, `bookmark route ${target} slow path`);
  assert.equal(routeBookmark.desktopBookmarks?.[0]?.kind, "route");
  assert.equal(routeBookmark.desktopBookmarks?.[0]?.target, target);
  assert.ok(routeBookmark.desktopBookmarks?.[0]?.route?.includes(target));
  assert.match(routeBookmark.output.join("\n"), /Bookmark saved: route/);

  const network = await shellPost(session.sessionId, "desktop network");
  assert.match(network.output.join("\n"), /Bookmarks\s+/);
  assert.match(network.output.join("\n"), new RegExp(target, "i"));

  const reload = await shellPost(session.sessionId);
  assert.equal(reload.desktopSnapshot?.desktopBookmarks.length, 2);

  const removed = await shellPost(session.sessionId, `bookmark rm ${target}`);
  assert.match(removed.output.join("\n"), /Bookmark removed/);
  assert.equal(removed.desktopBookmarks?.length, 1);

  const cleared = await shellPost(session.sessionId, "bookmark clear");
  assert.deepEqual(cleared.desktopBookmarks, []);
});

test("desktop events are backend-owned and searchable across clients", async () => {
  const session = await shellPost();

  const empty = await shellPost(session.sessionId, "events");
  assert.match(empty.output.join("\n"), /Desktop events:\n  none/);

  const queued = await shellPost(session.sessionId, "task scan relay event sweep");
  assert.ok(queued.desktopEvents?.some((event) => event.level === "info" && event.message === "task queued scan relay"));

  const saved = await shellPost(session.sessionId, "bookmark add relay event marker");
  assert.ok(saved.desktopEvents?.some((event) => event.source === "bookmark" && event.message === "bookmark saved host relay"));

  const listed = await shellPost(session.sessionId, "eventvwr task");
  const listedText = listed.output.join("\n");
  assert.match(listedText, /Desktop events:/);
  assert.match(listedText, /task queued scan relay/);

  const logs = await shellPost(session.sessionId, "desktop logs");
  const logsText = logs.output.join("\n");
  assert.match(logsText, /Events\s+2 recorded/);
  assert.match(logsText, /Last event\s+bookmark saved host relay/);

  const reload = await shellPost(session.sessionId);
  assert.ok(reload.desktopSnapshot?.desktopEvents.some((event) => event.message === "task queued scan relay"));

  const cleared = await shellPost(session.sessionId, "logs clear");
  assert.deepEqual(cleared.desktopEvents, []);
});

test("desktop event viewer is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "eventviewer");
  assert.match(initial.output.join("\n"), /Event Viewer:/);
  assert.ok(initial.desktopEventViewer?.some((entry) => entry.log === "System" && entry.source === "session"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Event Viewer" && entry.source === "desktopEventViewer"));

  await shellPost(session.sessionId, "task scan relay viewer sweep");
  await shellPost(session.sessionId, "bookmark add relay viewer mark");
  const filtered = await shellPost(session.sessionId, "eventvwr.msc application");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Event Viewer matching "application"/);
  assert.match(filteredText, /Desktop events:/);
  assert.ok(filtered.desktopSnapshot?.desktopEventViewer.some((entry) => entry.log === "Application" && entry.message.includes("task queued scan relay")));
  assert.ok(filtered.desktopSnapshot?.desktopEventViewer.some((entry) => entry.log === "Application" && entry.message.includes("bookmark saved host relay")));

  const security = await shellPost(session.sessionId, "eventviewer security");
  assert.match(security.output.join("\n"), /Security/);
  assert.ok(security.desktopEventViewer?.some((entry) => entry.log === "Security" && entry.source === "access"));

  const window = await shellPost(session.sessionId, "desktop open eventviewer");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: eventviewer \(Event Viewer\)/);
  assert.match(windowText, /Windows Logs\s+/);
  assert.match(windowText, /derived from backend desktop events, tasks, security, command history, and session state/);
});

test("desktop search companion is backend-derived with command and window parity", async () => {
  const session = await shellPost();
  const username = `desksearch${Date.now()}`;

  const initial = await shellPost(session.sessionId, "search");
  assert.match(initial.output.join("\n"), /Search Companion:/);
  assert.ok(initial.desktopSearch?.some((entry) => entry.scope === "Files" && entry.source === "desktopFiles"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Search Companion" && entry.source === "desktopSearch"));

  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "write relay-note.txt route signal");
  await shellPost(session.sessionId, "bookmark add relay search marker");
  await shellPost(session.sessionId, "task scan relay search sweep");
  await shellPost(session.sessionId, "send guest Search note: relay mailbox");

  const filtered = await shellPost(session.sessionId, "srchui relay");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Search Companion matching "relay"/);
  assert.match(filteredText, /Scope\s+Name\s+Location\s+Summary/);
  assert.ok(filtered.desktopSnapshot?.desktopSearch.some((entry) => entry.scope === "Files" && entry.name === "relay-note.txt"));
  assert.ok(filtered.desktopSnapshot?.desktopSearch.some((entry) => entry.scope === "Bookmarks" && entry.name === "relay"));
  assert.ok(filtered.desktopSnapshot?.desktopSearch.some((entry) => entry.scope === "Tasks" && entry.name.includes("scan relay")));
  assert.ok(filtered.desktopSnapshot?.desktopSearch.some((entry) => entry.scope === "Mail" && entry.summary.includes("relay mailbox")));
  assert.ok(filtered.desktopSnapshot?.desktopSearch.some((entry) => entry.scope === "History" && entry.name.includes("bookmark add relay")));

  const alias = await shellPost(session.sessionId, "find telnet");
  assert.match(alias.output.join("\n"), /Search Companion matching "telnet"/);
  assert.ok(alias.desktopSearch?.some((entry) => entry.scope === "Services" && entry.name === "Telnet"));

  const window = await shellPost(session.sessionId, "desktop open search");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: search \(Search Companion\)/);
  assert.match(windowText, /Indexed\s+/);
  assert.match(windowText, /derived from backend-visible files, boards, mail, hosts, services, events, history, tasks, and bookmarks/);
});

test("desktop network connections are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "connections");
  assert.match(initial.output.join("\n"), /Network Connections:/);
  assert.ok(initial.desktopConnections?.some((entry) => entry.name === "Local Area Connection" && entry.status === "connected"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Network Connections" && entry.source === "desktopConnections"));
  assert.ok(initial.desktopSearch?.some((entry) => entry.scope === "Connections" && entry.source === "desktopConnections"));

  await shellPost(session.sessionId, "bookmark add relay connection marker");
  await shellPost(session.sessionId, "task scan relay connection sweep");

  const filtered = await shellPost(session.sessionId, "ncpa.cpl relay");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Network Connections matching "relay"/);
  assert.match(filteredText, /Name\s+Type\s+Status\s+Device\s+Host\s+Speed/);
  assert.ok(filtered.desktopSnapshot?.desktopConnections.some((entry) => entry.host === "relay"));
  assert.ok(filtered.desktopSnapshot?.desktopConnections.some((entry) => entry.status === "queued" && entry.host === "relay"));

  const alias = await shellPost(session.sessionId, "netconnections dial");
  assert.match(alias.output.join("\n"), /Network Connections matching "dial"/);
  assert.ok(alias.desktopConnections?.some((entry) => entry.type === "Dial-up"));

  const window = await shellPost(session.sessionId, "desktop open connections");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: connections \(Network Connections\)/);
  assert.match(windowText, /backend connection row/);
  assert.match(windowText, /derived from backend network, dial-up, tunnel, service, firewall, and task state/);
});

test("desktop network setup wizard is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "netsetup");
  assert.match(initial.output.join("\n"), /Network Setup Wizard:/);
  assert.ok(initial.desktopNetSetup?.some((entry) => entry.stage === "Profile" && entry.item === "Computer name"));
  assert.ok(initial.desktopNetSetup?.some((entry) => entry.stage === "Adapters" && entry.source === "desktopConnections"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Network Setup Wizard" && entry.source === "desktopNetSetup"));
  assert.ok(initial.desktopSearch?.some((entry) => entry.scope === "Network Setup" && entry.source === "desktopNetSetup"));
  assert.ok(initial.desktopHelp?.some((entry) => entry.topic === "netsetup" && entry.source === "commandHelp"));

  await shellPost(session.sessionId, "task scan relay setup sweep");
  await shellPost(session.sessionId, "bookmark add relay setup marker");

  const filtered = await shellPost(session.sessionId, "netsetup sharing");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Network Setup Wizard matching "sharing"/);
  assert.match(filteredText, /Stage\s+Item\s+Status/);
  assert.ok(filtered.desktopSnapshot?.desktopNetSetup.some((entry) => entry.stage === "Sharing"));

  const alias = await shellPost(session.sessionId, "netsetup.cpl firewall");
  assert.match(alias.output.join("\n"), /Network Setup Wizard matching "firewall"/);
  assert.ok(alias.desktopNetSetup?.some((entry) => entry.stage === "Firewall" && entry.source === "desktopFirewall"));

  const window = await shellPost(session.sessionId, "desktop open netsetup");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: netsetup \(Network Setup Wizard\)/);
  assert.match(windowText, /backend setup row/);
  assert.match(windowText, /derived from backend network, dial-up, shares, firewall, services, route, and task state/);
});

test("desktop network diagnostics is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "netdiag");
  assert.match(initial.output.join("\n"), /Network Diagnostics:/);
  assert.ok(initial.desktopNetDiagnostics?.some((entry) => entry.test === "Adapter binding" && entry.source === "desktopConnections"));
  assert.ok(initial.desktopNetDiagnostics?.some((entry) => entry.test === "Firewall profile" && entry.source === "desktopFirewall"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Network Diagnostics" && entry.source === "desktopNetDiagnostics"));
  assert.ok(initial.desktopSearch?.some((entry) => entry.scope === "Diagnostics" && entry.source === "desktopNetDiagnostics"));
  assert.ok(initial.desktopHelp?.some((entry) => entry.topic === "netdiag" && entry.source === "commandHelp"));

  await shellPost(session.sessionId, "task scan relay diagnostic sweep");
  const filtered = await shellPost(session.sessionId, "netdiag queued");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Network Diagnostics matching "queued"/);
  assert.match(filteredText, /Test\s+Target\s+Result\s+Detail/);
  assert.ok(filtered.desktopSnapshot?.desktopNetDiagnostics.some((entry) => entry.test === "Queued network work" && entry.result === "warn"));

  const alias = await shellPost(session.sessionId, "diagnose firewall");
  assert.match(alias.output.join("\n"), /Network Diagnostics matching "firewall"/);
  assert.ok(alias.desktopNetDiagnostics?.some((entry) => entry.test === "Firewall profile"));

  const window = await shellPost(session.sessionId, "desktop open netdiag");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: netdiag \(Network Diagnostics\)/);
  assert.match(windowText, /backend diagnostic row/);
  assert.match(windowText, /derived from backend network, services, firewall, route, tasks, and event state/);
});

test("desktop map network drive is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "mapdrive");
  assert.match(initial.output.join("\n"), /Map Network Drive:/);
  assert.ok(initial.desktopMappedDrives?.some((entry) => entry.remote.includes("\\\\cyberscape\\PUBLIC") && entry.source === "desktopShares"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Map Network Drive" && entry.source === "desktopMappedDrives"));
  assert.ok(initial.desktopSearch?.some((entry) => entry.scope === "Mapped Drives" && entry.source === "desktopMappedDrives"));
  assert.ok(initial.desktopHelp?.some((entry) => entry.topic === "mapdrive" && entry.source === "commandHelp"));

  const username = `map${Date.now()}`;
  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "write map-note.txt mapped file");
  const home = await shellPost(session.sessionId, "net use home");
  const homeText = home.output.join("\n");
  assert.match(homeText, /Map Network Drive matching "home"/);
  assert.match(homeText, /Drive\s+Remote\s+Status\s+Capacity/);
  assert.ok(home.desktopSnapshot?.desktopMappedDrives.some((entry) => entry.remote.includes(`\\home\\${username}`) && entry.status === "read/write"));

  const alias = await shellPost(session.sessionId, "net use public");
  assert.match(alias.output.join("\n"), /Map Network Drive matching "public"/);
  assert.ok(alias.desktopMappedDrives?.some((entry) => entry.remote.includes("\\PUBLIC")));

  const window = await shellPost(session.sessionId, "desktop open mapdrive");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: mapdrive \(Map Network Drive\)/);
  assert.match(windowText, /backend mapped drive row/);
  assert.match(windowText, /derived from backend shares, files, downloads, profile, and network state/);
});

test("desktop offline files is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "offline");
  assert.match(initial.output.join("\n"), /Offline Files:/);
  assert.match(initial.output.join("\n"), /Location\s+Item\s+Status\s+Size/);
  assert.ok(initial.desktopOffline?.some((entry) => entry.source === "desktopShares" && entry.location === "Network"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Offline Files" && entry.source === "desktopOffline"));
  assert.ok(initial.desktopSearch?.some((entry) => entry.scope === "Offline Files" && entry.source === "desktopOffline"));
  assert.ok(initial.desktopHelp?.some((entry) => entry.topic === "offline" && entry.source === "commandHelp"));

  const username = `offline${Date.now()}`;
  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "write offline-note.txt cached text");
  await shellPost(session.sessionId, "task transfer cyberscape offline sync");

  const pending = await shellPost(session.sessionId, "sync pending");
  const pendingText = pending.output.join("\n");
  assert.match(pendingText, /Offline Files matching "pending"/);
  assert.ok(pending.desktopSnapshot?.desktopOffline.some((entry) => entry.source === "desktopTasks" && entry.status === "transfer pending"));
  assert.ok(pending.desktopSnapshot?.desktopOffline.some((entry) => entry.source === "userFiles" && entry.item === "offline-note.txt" && entry.status === "pinned read\/write"));

  const alias = await shellPost(session.sessionId, "mobsync offline-note");
  assert.match(alias.output.join("\n"), /Offline Files matching "offline-note"/);

  const window = await shellPost(session.sessionId, "desktop open offline");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: offline \(Offline Files\)/);
  assert.match(windowText, /backend offline file row/);
  assert.match(windowText, /derived from backend files, shares, mapped drives, downloads, tasks, and events/);
});

test("desktop connection lineage is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "lineage");
  const initialText = initial.output.join("\n");
  assert.match(initialText, /Connection Lineage:/);
  assert.match(initialText, /Era\s+Method\s+Status\s+Host\s+Speed\s+Path/);
  assert.ok(initial.desktopLineage?.some((entry) => entry.era === "pre-dialup" && entry.method.includes("phone")));
  assert.ok(initial.desktopLineage?.some((entry) => entry.era === "dialup" && entry.actions.includes("telnet bbs")));
  assert.ok(initial.desktopSearch?.some((entry) => entry.scope === "Connection Lineage" && entry.source === "desktopLineage"));
  assert.ok(initial.desktopHelp?.some((entry) => entry.topic === "lineage" && entry.source === "commandHelp"));
  assert.ok(initial.desktopHelp?.some((entry) => entry.section === "Connection Lineage" && entry.source === "desktopLineage"));

  await shellPost(session.sessionId, "bookmark route relay");
  await shellPost(session.sessionId, "task scan relay lineage sweep");

  const filtered = await shellPost(session.sessionId, "era dialup");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Connection Lineage matching "dialup"/);
  assert.ok(filtered.desktopSnapshot?.desktopLineage.some((entry) => entry.era === "dialup" || entry.era === "pre-dialup"));
  assert.ok(filtered.desktopSnapshot?.desktopLineage.some((entry) => entry.host === "relay" || entry.path.includes("relay")));

  const searched = await shellPost(session.sessionId, "search lineage");
  assert.ok(searched.desktopSnapshot?.desktopSearch.some((entry) => entry.scope === "Connection Lineage" && entry.source === "desktopLineage"));

  const window = await shellPost(session.sessionId, "desktop open lineage");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: lineage \(Connection Lineage\)/);
  assert.match(windowText, /backend lineage row/);
  assert.match(windowText, /derived from backend routes, dial-up rows, network places, and connection state/);
});

test("packet PAD transport is playable and backend-derived across shell and desktop surfaces", async () => {
  const session = await shellPost();

  const network = await shellPost(session.sessionId, "network");
  const packetRows = network.desktopSnapshot?.desktopNetwork ?? [];
  const packetTarget = packetRows.find((entry) =>
    entry.host !== "cyberscape" &&
    entry.host !== "bbs" &&
    entry.route.length > 1
  ) ?? packetRows.find((entry) =>
    entry.host !== "cyberscape" &&
    entry.route.length > 1
  );
  assert.ok(packetTarget, "expected a visible multi-hop packet target");

  const packetConnections = await shellPost(session.sessionId, "connections packet");
  assert.match(packetConnections.output.join("\n"), /Network Connections matching "packet"/);
  assert.ok(packetConnections.desktopSnapshot?.desktopConnections.some((entry) =>
    entry.type === "Packet" &&
    entry.host === packetTarget.host &&
    entry.device === "X.25 PAD"
  ));

  const packetLineage = await shellPost(session.sessionId, "lineage packet");
  assert.match(packetLineage.output.join("\n"), /Connection Lineage matching "packet"/);
  assert.ok(packetLineage.desktopSnapshot?.desktopLineage.some((entry) =>
    entry.era === "packet" &&
    entry.method === "X.25 PAD packet switch"
  ));

  const padded = await shellPost(session.sessionId, `pad ${packetTarget.host}`);
  const paddedText = padded.output.join("\n");
  assert.match(paddedText, /PAD access profile: X\.25 PAD/);
  assert.match(paddedText, /NUA: 3110-\d{4}-\d{4}-\d{4}/);
  assert.match(paddedText, new RegExp(`PAD connected to ${packetTarget.host}`, "i"));
  assert.ok(padded.prompt === `${packetTarget.host}>` || padded.prompt === "-");
  assert.ok(padded.desktopSnapshot?.desktopConnections.some((entry) =>
    entry.host === packetTarget.host &&
    entry.source === "packetCircuit" &&
    entry.status === "connected"
  ));
  assert.ok(padded.desktopSnapshot?.desktopLineage.some((entry) =>
    entry.method === "X.25 PAD packet switch" &&
    entry.host === packetTarget.host &&
    entry.status === "connected"
  ));
  assert.ok(padded.desktopSnapshot?.desktopDevices.some((entry) =>
    entry.name === "X.25 PAD adapter" &&
    entry.status === "busy"
  ));
  assert.ok(padded.desktopSnapshot?.desktopEvents.some((event) =>
    event.source === "packet" &&
    event.message.includes(`pad connected ${packetTarget.host}`)
  ));

  await shellPost(session.sessionId, "back");
  const alias = await shellPost(session.sessionId, `x25 ${packetTarget.host}`);
  assert.match(alias.output.join("\n"), new RegExp(`X25 connected to ${packetTarget.host}`, "i"));
});

test("telex uses a non-shell packet teleprinter path with backend-derived state", async () => {
  const session = await shellPost();

  const network = await shellPost(session.sessionId, "network");
  const packetTarget = (network.desktopSnapshot?.desktopNetwork ?? []).find((entry) =>
    entry.host !== "cyberscape" &&
    entry.route.length > 1
  );
  assert.ok(packetTarget, "expected a visible multi-hop telex target");

  const connected = await shellPost(session.sessionId, `telex ${packetTarget.host}`);
  const connectedText = connected.output.join("\n");
  assert.match(connectedText, /TELEX access profile: packet teleprinter/);
  assert.match(connectedText, /Answerback: 3110-\d{4}-\d{4}-\d{4}/);
  assert.match(connectedText, new RegExp(`TELEX connected to ${packetTarget.host}`, "i"));
  assert.equal(connected.prompt, "telex>");
  assert.ok(connected.desktopSnapshot?.desktopConnections.some((entry) =>
    entry.type === "Telex" &&
    entry.source === "telexCircuit" &&
    entry.host === packetTarget.host
  ));
  assert.ok(connected.desktopSnapshot?.desktopDevices.some((entry) =>
    entry.name === "Telex teleprinter" &&
    entry.status === "busy"
  ));
  assert.ok(connected.desktopSnapshot?.desktopEvents.some((event) =>
    event.source === "telex" &&
    event.message.includes(`telex connected ${packetTarget.host}`)
  ));

  const directory = await shellPost(session.sessionId, "who");
  assert.match(directory.output.join("\n"), new RegExp(`TELEX directory for ${packetTarget.host}:`, "i"));
  assert.match(directory.output.join("\n"), /Answerback 3110-\d{4}-\d{4}-\d{4}/);

  const sent = await shellPost(session.sessionId, "send packet gardens online");
  assert.match(sent.output.join("\n"), /TX packet gardens online/);
  assert.ok(sent.desktopSnapshot?.desktopEvents.some((event) =>
    event.source === "telex" &&
    event.message.includes("packet gardens online")
  ));
  assert.ok(sent.desktopSnapshot?.desktopMail.some((message) =>
    message.from === `telex/${packetTarget.host}` &&
    message.preview.includes("packet gardens online")
  ));

  const closed = await shellPost(session.sessionId, "quit");
  assert.match(closed.output.join("\n"), /TELEX connection closed/);
  assert.equal(closed.prompt, ".");
  assert.ok(closed.desktopSnapshot?.desktopDevices.some((entry) =>
    entry.name === "Telex teleprinter" &&
    entry.status === "offline"
  ));
});

test("desktop remote desktop connection is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "remote");
  const initialText = initial.output.join("\n");
  assert.match(initialText, /Remote Desktop Connection:/);
  assert.match(initialText, /Host\s+Status\s+Access\s+Display\s+Profile/);
  assert.ok(initial.desktopRemote?.some((entry) => entry.host === "cyberscape" && entry.status === "connected" && entry.source === "desktopNetwork"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Remote Desktop Connection" && entry.source === "desktopRemote"));
  assert.ok(initial.desktopSearch?.some((entry) => entry.scope === "Remote Desktop" && entry.source === "desktopRemote"));
  assert.ok(initial.desktopHelp?.some((entry) => entry.topic === "remote" && entry.source === "commandHelp"));

  await shellPost(session.sessionId, "bookmark route relay");
  await shellPost(session.sessionId, "task scan relay remote sweep");

  const filtered = await shellPost(session.sessionId, "mstsc relay");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Remote Desktop Connection matching "relay"/);
  assert.ok(filtered.desktopSnapshot?.desktopRemote.some((entry) => entry.host === "relay" && (entry.source === "desktopBookmarks+desktopNetwork" || entry.source === "desktopTasks")));

  const searched = await shellPost(session.sessionId, "search remote");
  assert.ok(searched.desktopSnapshot?.desktopSearch.some((entry) => entry.scope === "Remote Desktop" && entry.source === "desktopRemote"));

  const window = await shellPost(session.sessionId, "desktop open remote");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: remote \(Remote Desktop Connection\)/);
  assert.match(windowText, /backend remote profile row/);
  assert.match(windowText, /derived from backend visible hosts, access, routes, tunnel, bookmarks, and tasks/);
});

test("desktop run dialog is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "runbox");
  const initialText = initial.output.join("\n");
  assert.match(initialText, /Run Dialog:/);
  assert.match(initialText, /Command\s+Status\s+Source\s+Target/);
  assert.ok(initial.desktopRun?.some((entry) => entry.command === "cmd.exe" && entry.status === "ready" && entry.source === "desktopApps"));
  assert.ok(initial.desktopRun?.some((entry) => entry.command === "real-os-shell" && entry.status === "blocked" && entry.source === "authorityBoundary"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Run" && entry.source === "desktopRun"));
  assert.ok(initial.desktopSearch?.some((entry) => entry.scope === "Run" && entry.source === "desktopRun"));
  assert.ok(initial.desktopHelp?.some((entry) => entry.topic === "runbox" && entry.source === "commandHelp"));

  await shellPost(session.sessionId, "bookmark route relay");
  await shellPost(session.sessionId, "task scan relay run sweep");

  const filtered = await shellPost(session.sessionId, "explorer files");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Run Dialog matching "explorer files"/);
  assert.ok(filtered.desktopSnapshot?.desktopRun.some((entry) => entry.command === "explorer.exe" && entry.source === "desktopFiles"));

  const alias = await shellPost(session.sessionId, "cmd.exe");
  assert.match(alias.output.join("\n"), /Run Dialog matching "cmd.exe"/);
  assert.ok(alias.desktopRun?.some((entry) => entry.command === "cmd.exe"));

  const searched = await shellPost(session.sessionId, "search run");
  assert.ok(searched.desktopSnapshot?.desktopSearch.some((entry) => entry.scope === "Run" && entry.source === "desktopRun"));

  const window = await shellPost(session.sessionId, "desktop open runbox");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: runbox \(Run\)/);
  assert.match(windowText, /backend run target row/);
  assert.match(windowText, /derived from backend commands, desktop apps, command history, files, and session state/);
});

test("desktop files are backend-derived with command and window parity", async () => {
  const session = await shellPost();
  const username = `deskfiles${Date.now()}`;

  const publicFiles = await shellPost(session.sessionId, "files");
  assert.match(publicFiles.output.join("\n"), /Files:/);
  assert.ok(publicFiles.desktopFiles?.some((file) => file.kind === "host"));

  await shellPost(session.sessionId, `newuser ${username} password`);
  const write = await shellPost(session.sessionId, "write notes.txt signal");
  assert.match(write.output.join("\n"), /Wrote 6 bytes/);
  assert.ok(write.desktopEvents?.some((event) => event.source === "files" && event.message.includes("file written")));

  const listed = await shellPost(session.sessionId, "files notes");
  const listedText = listed.output.join("\n");
  assert.match(listedText, /Files matching "notes"/);
  assert.match(listedText, /home\s+notes\.txt/);
  assert.ok(listed.desktopSnapshot?.desktopFiles.some((file) => file.kind === "home" && file.name === "notes.txt"));

  const filesWindow = await shellPost(session.sessionId, "desktop files");
  const filesText = filesWindow.output.join("\n");
  assert.match(filesText, /visible files\s+notes\.txt/);
  assert.match(filesText, /home files\s+1 user file/);

  await shellPost(session.sessionId, "logout");
  const fresh = await shellPost();
  await shellPost(fresh.sessionId, `login ${username} password`);
  const reload = await shellPost(fresh.sessionId);
  assert.ok(reload.desktopSnapshot?.desktopFiles.some((file) => file.kind === "home" && file.name === "notes.txt"));
});

test("desktop mail is backend-derived with command and window parity", async () => {
  const senderSession = await shellPost();
  const recipientSession = await shellPost();
  const stamp = Date.now();
  const sender = `deskmailfrom${stamp}`;
  const recipient = `deskmailto${stamp}`;

  await shellPost(senderSession.sessionId, `newuser ${sender} password`);
  await shellPost(recipientSession.sessionId, `newuser ${recipient} password`);

  const sent = await shellPost(senderSession.sessionId, `send ${recipient} Desk note: packet arrived`);
  assert.match(sent.output.join("\n"), /Sent to/);
  assert.ok(sent.desktopEvents?.some((event) => event.source === "mail" && event.message === `mail sent ${recipient}`));

  const senderBox = await shellPost(senderSession.sessionId, "mailbox desk");
  assert.match(senderBox.output.join("\n"), /Mailbox matching "desk"/);
  assert.match(senderBox.output.join("\n"), /Desk note/);
  assert.ok(senderBox.desktopSnapshot?.desktopMail.some((message) => message.subject === "Desk note" && message.to === recipient));

  const recipientBox = await shellPost(recipientSession.sessionId, "mailbox packet");
  assert.match(recipientBox.output.join("\n"), /packet arrived/);
  assert.ok(recipientBox.desktopMail?.some((message) => message.from === sender && message.preview.includes("packet arrived")));

  const mailWindow = await shellPost(recipientSession.sessionId, "desktop mail");
  const mailText = mailWindow.output.join("\n");
  assert.match(mailText, /Inbox\s+1 message/);
  assert.match(mailText, /Preview\s+Desk note from/);

  const fresh = await shellPost();
  await shellPost(fresh.sessionId, `login ${recipient} password`);
  const reload = await shellPost(fresh.sessionId);
  assert.ok(reload.desktopSnapshot?.desktopMail.some((message) => message.subject === "Desk note"));
});

test("desktop boards are backend-derived with command and window parity", async () => {
  const session = await shellPost();
  const stamp = Date.now();
  const subject = `Board note ${stamp}`;

  const initial = await shellPost(session.sessionId, "boards route");
  assert.match(initial.output.join("\n"), /Boards matching "route"/);
  assert.ok(initial.desktopBoards?.some((entry) => entry.kind === "usenet"));

  await shellPost(session.sessionId, "news");
  await shellPost(session.sessionId, "post comp.misc");
  await shellPost(session.sessionId, subject);
  const posted = await shellPost(session.sessionId, "body crosses the wire");
  assert.match(posted.output.join("\n"), /Article posted to comp\.misc/);
  assert.ok(posted.desktopEvents?.some((event) => event.source === "boards" && event.message === "article posted comp.misc"));
  await shellPost(session.sessionId, "quit");

  const listed = await shellPost(session.sessionId, `boards ${stamp}`);
  const listedText = listed.output.join("\n");
  assert.match(listedText, new RegExp(subject, "i"));
  assert.ok(listed.desktopSnapshot?.desktopBoards.some((entry) => entry.subject.toLowerCase() === subject.toLowerCase() && entry.kind === "usenet"));

  const boardWindow = await shellPost(session.sessionId, "desktop boards");
  const boardText = boardWindow.output.join("\n");
  assert.match(boardText, /Messages\s+\d+ visible item/);
  assert.match(boardText, new RegExp(`Latest\\s+${subject}`, "i"));

  const reload = await shellPost(session.sessionId);
  assert.ok(reload.desktopSnapshot?.desktopBoards.some((entry) => entry.subject.toLowerCase() === subject.toLowerCase()));
});

test("bbs sysop claim persists through account, credential, and board surfaces", async () => {
  db.delete(userFiles).where(like(userFiles.path, "%/sysop.txt")).run();
  const session = await shellPost();
  const username = `sysop${Date.now()}`;

  await shellPost(session.sessionId, `newuser ${username} password`);
  const dialed = await shellPost(session.sessionId, "dial bbs");
  assert.equal(dialed.prompt, "-");
  await shellPost(session.sessionId, username);

  const claimed = await shellPost(session.sessionId, "S");
  const claimText = claimed.output.join("\n");
  assert.match(claimText, /SYSOP panel:/);
  assert.match(claimText, /SYSOP claim recorded\./);
  assert.match(claimText, new RegExp(`Owner:\\s+${username}`));
  assert.match(claimText, new RegExp(`Claim file:\\s+/home/${username}/sysop\\.txt`));
  assert.ok(claimed.desktopEvents?.some((event) => event.source === "boards" && event.message === "bbs sysop claimed bbs"));
  assert.ok(claimed.desktopSnapshot?.desktopBoards.some((entry) =>
    entry.kind === "sysop" &&
    entry.author === username &&
    entry.subject === "SYSOP ownership"
  ));
  assert.ok(claimed.desktopSnapshot?.desktopAccounts.some((entry) =>
    entry.name === "Sysop Boards" &&
    entry.source === "bbsSysop" &&
    entry.value.includes("bbs")
  ));
  assert.ok(claimed.desktopSnapshot?.desktopCredentials.some((entry) =>
    entry.target === "BBS Sysop" &&
    entry.status === "stored" &&
    entry.source.includes("bbsSysop:bbs")
  ));

  const who = await shellPost(session.sessionId, "W");
  assert.match(who.output.join("\n"), new RegExp(`SYSOP:${username}.*owns board`, "i"));

  await shellPost(session.sessionId, "Q");
  const boards = await shellPost(session.sessionId, "boards sysop");
  assert.match(boards.output.join("\n"), /SYSOP ownership/);
  assert.ok(boards.desktopSnapshot?.desktopBoards.some((entry) => entry.kind === "sysop" && entry.author === username));

  const file = await shellPost(session.sessionId, `cat /home/${username}/sysop.txt`);
  assert.match(file.output.join("\n"), new RegExp(`bbs\\|Cyberscape BBS\\|\\d+\\|moderate posts`));

  await shellPost(session.sessionId, "logout");
  const fresh = await shellPost();
  await shellPost(fresh.sessionId, `login ${username} password`);
  const reload = await shellPost(fresh.sessionId, "boards sysop");
  assert.match(reload.output.join("\n"), /SYSOP ownership/);
  assert.ok(reload.desktopSnapshot?.desktopAccounts.some((entry) =>
    entry.name === "Sysop Boards" &&
    entry.value.includes("bbs")
  ));
  assert.ok(reload.desktopSnapshot?.desktopCredentials.some((entry) =>
    entry.target === "BBS Sysop" &&
    entry.status === "stored"
  ));
});

test("desktop system properties are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "system");
  assert.match(initial.output.join("\n"), /System Properties:/);
  assert.ok(initial.desktopSystem?.some((entry) => entry.name === "Computer Name" && entry.value === "cyberscape"));
  assert.ok(initial.desktopSystem?.some((entry) => entry.name === "Shell Version" && entry.value.includes("Windows XP")));

  const username = `sysdm${Date.now()}`;
  await shellPost(session.sessionId, "theme 7");
  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "task scan relay sysdm sweep");

  const filtered = await shellPost(session.sessionId, "sysdm resources");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /System Properties matching "resources"/);
  assert.ok(filtered.desktopSnapshot?.desktopSystem.some((entry) => entry.name === "Disk Quota" && entry.value.endsWith("KB")));
  assert.ok(filtered.desktopSnapshot?.desktopSystem.some((entry) => entry.name === "Devices" && entry.value.includes("device row")));

  const winver = await shellPost(session.sessionId, "winver");
  assert.match(winver.output.join("\n"), /Windows 7 Professional profile/);
  assert.match(winver.output.join("\n"), new RegExp(`Registered to: ${username}`));

  const systemWindow = await shellPost(session.sessionId, "desktop system");
  const windowText = systemWindow.output.join("\n");
  assert.match(windowText, /Desktop app: system \(System Properties\)/);
  assert.match(windowText, /Windows 7 Professional profile/);
  assert.match(windowText, /derived from backend host, user, route, storage, and preference state/);
});

test("desktop control panel is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "control");
  assert.match(initial.output.join("\n"), /Control Panel:/);
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "System" && entry.actions.includes("winver")));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Device Manager" && entry.source === "desktopDevices"));

  await shellPost(session.sessionId, "theme 2000");
  await shellPost(session.sessionId, "bookmark add relay cpl route");
  await shellPost(session.sessionId, "task maint cyberscape cpl maintenance");

  const filtered = await shellPost(session.sessionId, "control panel network");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Control Panel matching "network"/);
  assert.match(filteredText, /Network Connections/);
  assert.ok(filtered.desktopSnapshot?.desktopControl.some((entry) => entry.applet === "Network Connections" && entry.source === "desktopConnections" && entry.status.includes("visible host")));

  const alias = await shellPost(session.sessionId, "cpl display");
  assert.match(alias.output.join("\n"), /Display/);
  assert.ok(alias.desktopControl?.some((entry) => entry.applet === "Display" && entry.status.includes("2000")));

  const controlWindow = await shellPost(session.sessionId, "desktop control");
  const windowText = controlWindow.output.join("\n");
  assert.match(windowText, /Desktop app: control \(Control Panel\)/);
  assert.match(windowText, /backend applet row/);
  assert.match(windowText, /derived from backend desktop, system, device, network, and preference state/);
});

test("desktop help and support center is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "support");
  const initialText = initial.output.join("\n");
  assert.match(initialText, /Help and Support Center:/);
  assert.ok(initial.desktopHelp?.some((entry) => entry.section === "Commands" && entry.topic === "desktop"));
  assert.ok(initial.desktopHelp?.some((entry) => entry.section === "Workstation" && entry.topic === "Control Panel"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Help and Support" && entry.source === "desktopHelp"));

  await shellPost(session.sessionId, "bookmark add relay support note");
  await shellPost(session.sessionId, "task scan relay support scan");

  const filtered = await shellPost(session.sessionId, "helpctr services");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Help and Support Center matching "services"/);
  assert.ok(filtered.desktopSnapshot?.desktopHelp.some((entry) => entry.source === "desktopServices"));

  const alias = await shellPost(session.sessionId, "helpctr.exe workstation");
  assert.match(alias.output.join("\n"), /Help and Support Center matching "workstation"/i);

  const window = await shellPost(session.sessionId, "desktop help");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: help \(Help and Support Center\)/);
  assert.match(windowText, /backend support row/);
  assert.match(windowText, /derived from backend command help, applets, history, bookmarks, tasks, events, services, and connection state/);
});

test("desktop user accounts are backend-derived with command and window parity", async () => {
  const session = await shellPost();
  const username = `acct${Date.now()}`;

  const guest = await shellPost(session.sessionId, "accounts");
  assert.match(guest.output.join("\n"), /User Accounts:/);
  assert.ok(guest.desktopAccounts?.some((entry) => entry.name === "Operator" && entry.value === "guest"));
  assert.ok(guest.desktopControl?.some((entry) => entry.applet === "User Accounts" && entry.source === "desktopAccounts"));

  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "set key ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCacctkey");
  await shellPost(session.sessionId, "wardial");
  const porthack = await shellPost(session.sessionId, "porthack relay");
  if (porthack.output.join("\n").includes("CAPTCHA")) {
    await shellPost(session.sessionId, "yes");
  }

  const filtered = await shellPost(session.sessionId, "nusrmgr.cpl key");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /User Accounts matching "key"/);
  assert.match(filteredText, /SSH Key/);
  assert.doesNotMatch(filteredText, /AAAAB3NzaC1yc2E/);
  assert.ok(filtered.desktopSnapshot?.desktopAccounts.some((entry) => entry.name === "Operator" && entry.value === username));
  assert.ok(filtered.desktopSnapshot?.desktopAccounts.some((entry) => entry.name === "SSH Key" && entry.value !== "none" && !entry.value.includes("AAAAB3NzaC1yc2E")));
  assert.ok(filtered.desktopSnapshot?.desktopAccounts.some((entry) => entry.name === "Login Hosts" && entry.value !== "none"));

  const window = await shellPost(session.sessionId, "desktop accounts");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: accounts \(User Accounts\)/);
  assert.match(windowText, /backend account row/);
  assert.match(windowText, /derived from backend user, session, key, badge, and access state/);
});

test("desktop stored credentials are backend-derived without revealing secrets", async () => {
  const session = await shellPost();
  const username = `cred${Date.now()}`;

  const initial = await shellPost(session.sessionId, "credentials");
  const initialText = initial.output.join("\n");
  assert.match(initialText, /Stored User Names and Passwords:/);
  assert.match(initialText, /Secret material is not displayed/);
  assert.ok(initial.desktopCredentials?.some((entry) => entry.target === "Raw Passwords" && entry.status === "revoked" && entry.source === "authorityBoundary"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Stored User Names and Passwords" && entry.source === "desktopCredentials"));
  assert.ok(initial.desktopSearch?.some((entry) => entry.scope === "Credentials" && entry.source === "desktopCredentials"));
  assert.ok(initial.desktopHelp?.some((entry) => entry.topic === "credentials" && entry.source === "commandHelp"));

  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "set key ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCcredentialkey");
  await shellPost(session.sessionId, "wardial");
  const porthack = await shellPost(session.sessionId, "porthack relay");
  if (porthack.output.join("\n").includes("CAPTCHA")) {
    await shellPost(session.sessionId, "yes");
  }

  const filtered = await shellPost(session.sessionId, "keymgr relay");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Stored User Names and Passwords matching "relay"/);
  assert.ok(filtered.desktopSnapshot?.desktopCredentials.some((entry) => entry.target === "relay" && (entry.status === "stored" || entry.status === "elevated")));
  assert.ok(!filteredText.includes("password"));
  assert.ok(!filteredText.includes("credentialkey"));

  const keyRows = await shellPost(session.sessionId, "credentials ssh");
  const keyText = keyRows.output.join("\n");
  assert.match(keyText, /SSH Public Key/);
  assert.match(keyText, /sshPublicKey/);
  assert.ok(!keyText.includes("AAAAB3NzaC1yc2EAAAADAQABAAABAQCcredentialkey"));

  const window = await shellPost(session.sessionId, "desktop open credentials");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: credentials \(Stored User Names and Passwords\)/);
  assert.match(windowText, /backend credential row/);
  assert.match(windowText, /derived from backend account, SSH key, host access, bookmarks, remote profiles, and security state/);
});

test("desktop date time properties are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "datetime");
  assert.match(initial.output.join("\n"), /Date\/Time Properties:/);
  assert.ok(initial.desktopTime?.some((entry) => entry.tab === "Date & Time" && entry.name === "Server Time" && entry.source === "serverClock"));
  assert.ok(initial.desktopTime?.some((entry) => entry.tab === "Internet Time" && entry.value.includes("browser clock unused")));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Date/Time" && entry.source === "desktopTime"));

  await shellPost(session.sessionId, "task maint cyberscape clock sweep");
  await shellPost(session.sessionId, "history clock");
  const filtered = await shellPost(session.sessionId, "timedate.cpl scheduler");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Date\/Time Properties matching "scheduler"/);
  assert.match(filteredText, /Queued Tasks/);
  assert.ok(filtered.desktopSnapshot?.desktopTime.some((entry) => entry.tab === "Scheduler" && entry.value.includes("queued")));
  assert.ok(filtered.desktopSnapshot?.desktopTime.some((entry) => entry.tab === "Activity" && entry.name === "Last Command" && entry.value === "timedate.cpl scheduler"));

  const window = await shellPost(session.sessionId, "desktop datetime");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: datetime \(Date\/Time Properties\)/);
  assert.match(windowText, /Clock\s+\d{2}:\d{2}:\d{2} UTC/);
  assert.match(windowText, /derived from backend server clock, event, command, and scheduler state/);
});

test("desktop display properties are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "display");
  assert.match(initial.output.join("\n"), /Display Properties:/);
  assert.ok(initial.desktopDisplay?.some((entry) => entry.tab === "Themes" && entry.setting === "Color Scheme"));
  assert.ok(initial.desktopDisplay?.some((entry) => entry.tab === "Settings" && entry.setting === "Work Area"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Display" && entry.source === "desktopDisplay"));

  await shellPost(session.sessionId, "theme 7");
  await shellPost(session.sessionId, "theme pref contrast high");
  await shellPost(session.sessionId, "theme pref motion reduced");
  await shellPost(session.sessionId, "desktop move display 212 144");

  const filtered = await shellPost(session.sessionId, "desk.cpl accessibility");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Display Properties matching "accessibility"/);
  assert.match(filteredText, /Contrast/);
  assert.match(filteredText, /Motion/);
  assert.ok(filtered.desktopSnapshot?.desktopDisplay.some((entry) => entry.setting === "Contrast" && entry.value === "high"));
  assert.ok(filtered.desktopSnapshot?.desktopDisplay.some((entry) => entry.setting === "Motion" && entry.value === "reduced"));

  const window = await shellPost(session.sessionId, "desktop display");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: display \(Display Properties\)/);
  assert.match(windowText, /backend display row/);
  assert.match(windowText, /derived from backend theme, preference, window, and session state/);
});

test("desktop sounds and audio devices are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "sounds");
  assert.match(initial.output.join("\n"), /Sounds and Audio Devices:/);
  assert.ok(initial.desktopSounds?.some((entry) => entry.tab === "Volume" && entry.item === "Master Volume" && entry.source === "desktopPrefs.sound"));
  assert.ok(initial.desktopSounds?.some((entry) => entry.tab === "Hardware" && entry.value.includes("browser audio APIs unused")));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Sounds and Audio Devices" && entry.source === "desktopSounds"));

  await shellPost(session.sessionId, "theme pref sound on");
  await shellPost(session.sessionId, "task scan relay sound sweep");
  const filtered = await shellPost(session.sessionId, "mmsys.cpl volume");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Sounds and Audio Devices matching "volume"/);
  assert.match(filteredText, /Master Volume/);
  assert.ok(filtered.desktopSnapshot?.desktopSounds.some((entry) => entry.item === "Master Volume" && entry.value.includes("on")));
  assert.ok(filtered.desktopSnapshot?.desktopSounds.some((entry) => entry.item === "Program Events" && entry.value.includes("queued task")));

  const window = await shellPost(session.sessionId, "desktop sounds");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: sounds \(Sounds and Audio Devices\)/);
  assert.match(windowText, /Volume\s+/);
  assert.match(windowText, /derived from backend preference, event, task, device, and session state/);
});

test("desktop power options are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "power");
  assert.match(initial.output.join("\n"), /Power Options:/);
  assert.ok(initial.desktopPower?.some((entry) => entry.scheme === "Power Schemes" && entry.setting === "Active Scheme" && entry.source === "desktopPrefs.motion"));
  assert.ok(initial.desktopPower?.some((entry) => entry.scheme === "UPS" && entry.value.includes("browser battery APIs unused")));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Power Options" && entry.source === "desktopPower"));

  await shellPost(session.sessionId, "theme pref motion reduced");
  await shellPost(session.sessionId, "task maint relay power sweep");
  const filtered = await shellPost(session.sessionId, "powercfg.cpl timers");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Power Options matching "timers"/);
  assert.match(filteredText, /Queued Jobs/);
  assert.ok(filtered.desktopSnapshot?.desktopPower.some((entry) => entry.setting === "Active Scheme" && entry.value.includes("Minimal Power Management")));
  assert.ok(filtered.desktopSnapshot?.desktopPower.some((entry) => entry.setting === "Queued Jobs" && entry.value.includes("1 pending")));

  const window = await shellPost(session.sessionId, "desktop power");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: power \(Power Options\)/);
  assert.match(windowText, /Timers\s+/);
  assert.match(windowText, /derived from backend preferences, tasks, processes, devices, and routes/);
});

test("desktop mouse properties are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "mouse");
  assert.match(initial.output.join("\n"), /Mouse Properties:/);
  assert.ok(initial.desktopMouse?.some((entry) => entry.tab === "Pointers" && entry.setting === "Pointer Scheme" && entry.source === "desktopTheme"));
  assert.ok(initial.desktopMouse?.some((entry) => entry.tab === "Hardware" && entry.value.includes("browser pointer APIs unused")));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Mouse" && entry.source === "desktopMouse"));

  await shellPost(session.sessionId, "theme pref keyboard terminal");
  await shellPost(session.sessionId, "theme pref motion reduced");
  await shellPost(session.sessionId, "task scan relay mouse sweep");
  const filtered = await shellPost(session.sessionId, "main.cpl buttons");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Mouse Properties matching "buttons"/);
  assert.match(filteredText, /Button Configuration/);
  assert.ok(filtered.desktopSnapshot?.desktopMouse.some((entry) => entry.setting === "Button Configuration" && entry.value.includes("terminal focus priority")));
  assert.ok(filtered.desktopSnapshot?.desktopMouse.some((entry) => entry.setting === "Queued Gesture" && entry.value.includes("1 queued")));

  const window = await shellPost(session.sessionId, "desktop mouse");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: mouse \(Mouse Properties\)/);
  assert.match(windowText, /Buttons\s+/);
  assert.match(windowText, /derived from backend preferences, windows, tasks, devices, and session state/);
});

test("desktop keyboard properties are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "keyboard");
  assert.match(initial.output.join("\n"), /Keyboard Properties:/);
  assert.ok(initial.desktopKeyboard?.some((entry) => entry.tab === "Input" && entry.setting === "Shortcut Priority" && entry.source === "desktopPrefs.keyboardMode"));
  assert.ok(initial.desktopKeyboard?.some((entry) => entry.tab === "Hardware" && entry.value.includes("browser key events are input plumbing only")));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Keyboard" && entry.source === "desktopKeyboard"));

  await shellPost(session.sessionId, "theme pref keyboard terminal");
  await shellPost(session.sessionId, "theme pref motion reduced");
  await shellPost(session.sessionId, "task scan relay keyboard sweep");
  const filtered = await shellPost(session.sessionId, "kbd.cpl input");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Keyboard Properties matching "input"/);
  assert.match(filteredText, /Shortcut Priority/);
  assert.ok(filtered.desktopSnapshot?.desktopKeyboard.some((entry) => entry.setting === "Shortcut Priority" && entry.value.includes("terminal receives")));
  assert.ok(filtered.desktopSnapshot?.desktopKeyboard.some((entry) => entry.setting === "Queued Task" && entry.value.includes("1 queued")));

  const window = await shellPost(session.sessionId, "desktop keyboard");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: keyboard \(Keyboard Properties\)/);
  assert.match(windowText, /Repeat\s+/);
  assert.match(windowText, /derived from backend preferences, terminal, history, tasks, and devices/);
});

test("desktop accessibility options are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "accessibility");
  assert.match(initial.output.join("\n"), /Accessibility Options:/);
  assert.ok(initial.desktopAccessibility?.some((entry) => entry.tab === "Display" && entry.option === "High Contrast" && entry.source === "desktopPrefs.contrast"));
  assert.ok(initial.desktopAccessibility?.some((entry) => entry.tab === "General" && entry.value.includes("browser accessibility APIs unused")));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Accessibility Options" && entry.source === "desktopAccessibility"));

  await shellPost(session.sessionId, "theme pref contrast high");
  await shellPost(session.sessionId, "theme pref motion reduced");
  await shellPost(session.sessionId, "theme pref sound on");
  await shellPost(session.sessionId, "task maint relay access sweep");
  const filtered = await shellPost(session.sessionId, "access.cpl display");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Accessibility Options matching "display"/);
  assert.match(filteredText, /High Contrast/);
  assert.ok(filtered.desktopSnapshot?.desktopAccessibility.some((entry) => entry.option === "High Contrast" && entry.value.includes("enabled")));
  assert.ok(filtered.desktopSnapshot?.desktopAccessibility.some((entry) => entry.option === "Timeout" && entry.value.includes("1 queued")));

  const window = await shellPost(session.sessionId, "desktop accessibility");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: accessibility \(Accessibility Options\)/);
  assert.match(windowText, /Display\s+/);
  assert.match(windowText, /derived from backend preferences, applets, events, tasks, and devices/);
});

test("desktop regional options are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "regional");
  assert.match(initial.output.join("\n"), /Regional and Language Options:/);
  assert.ok(initial.desktopRegional?.some((entry) => entry.tab === "Regional" && entry.setting === "Standards" && entry.source === "desktopTheme"));
  assert.ok(initial.desktopRegional?.some((entry) => entry.tab === "Advanced" && entry.value.includes("browser locale APIs unused")));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Regional and Language Options" && entry.source === "desktopRegional"));

  await shellPost(session.sessionId, "theme 7");
  await shellPost(session.sessionId, "write region.txt hello");
  await shellPost(session.sessionId, "task scan relay regional sweep");
  const filtered = await shellPost(session.sessionId, "intl.cpl formats");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Regional and Language Options matching "formats"/);
  assert.match(filteredText, /Date Sample/);
  assert.ok(filtered.desktopSnapshot?.desktopRegional.some((entry) => entry.setting === "Standards" && entry.value.includes("Windows 7")));
  assert.ok(filtered.desktopSnapshot?.desktopRegional.some((entry) => entry.setting === "Measurement" && entry.value.includes("1 queued")));

  const window = await shellPost(session.sessionId, "desktop regional");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: regional \(Regional and Language Options\)/);
  assert.match(windowText, /Formats\s+/);
  assert.match(windowText, /derived from backend theme, time, files, mail, boards, and keyboard state/);
});

test("desktop add remove programs are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "programs");
  assert.match(initial.output.join("\n"), /Add\/Remove Programs:/);
  assert.ok(initial.desktopPrograms?.some((entry) => entry.category === "Protocol" && entry.name === "FTP Client"));
  assert.ok(initial.desktopPrograms?.some((entry) => entry.category === "Games" && entry.name === "Interactive Fiction Shelf"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Add/Remove Programs" && entry.source === "desktopPrograms"));

  await shellPost(session.sessionId, "task scan relay appwiz sweep");
  await shellPost(session.sessionId, "ftp cyberscape");
  await shellPost(session.sessionId, "get motd.txt");
  await shellPost(session.sessionId, "quit");

  const filtered = await shellPost(session.sessionId, "appwiz.cpl download");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Add\/Remove Programs matching "download"/);
  assert.match(filteredText, /motd\.txt/);
  assert.ok(filtered.desktopSnapshot?.desktopPrograms.some((entry) => entry.name === "motd.txt" && entry.status === "downloaded"));
  assert.ok(filtered.desktopSnapshot?.desktopPrograms.some((entry) => entry.category === "Task" && entry.status === "queued"));

  const window = await shellPost(session.sessionId, "desktop programs");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: programs \(Add\/Remove Programs\)/);
  assert.match(windowText, /backend program row/);
  assert.match(windowText, /derived from backend command, game, protocol, download, task, and profile state/);
});

test("desktop odbc data sources are backend-derived with command and window parity", async () => {
  const session = await shellPost();
  const username = `odbc${Date.now()}`;

  await shellPost(session.sessionId, `newuser ${username} password`);

  const initial = await shellPost(session.sessionId, "odbc");
  assert.match(initial.output.join("\n"), /ODBC Data Source Administrator:/);
  assert.ok(initial.desktopOdbc?.some((entry) => entry.tab === "System DSN" && entry.name === "HostServices" && entry.source === "desktopServices"));
  assert.ok(initial.desktopOdbc?.some((entry) => entry.tab === "About" && entry.value.includes("browser databases and storage APIs unused")));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "ODBC Data Sources" && entry.source === "desktopOdbc"));

  await shellPost(session.sessionId, "bookmark route relay odbc route");
  await shellPost(session.sessionId, "write dsn.ini driver=text");
  await shellPost(session.sessionId, "task scan relay dsn sweep");
  const filtered = await shellPost(session.sessionId, "odbcad32 dsn");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /ODBC Data Source Administrator matching "dsn"/);
  assert.match(filteredText, /User DSN/);
  assert.ok(filtered.desktopSnapshot?.desktopOdbc.some((entry) => entry.name === "LocalShell" && entry.value.includes("1 home file")));
  assert.ok(filtered.desktopSnapshot?.desktopOdbc.some((entry) => entry.name === "Pool State" && entry.value.includes("1 queued")));

  const window = await shellPost(session.sessionId, "desktop odbc");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: odbc \(ODBC Data Source Administrator\)/);
  assert.match(windowText, /System DSN\s+/);
  assert.match(windowText, /derived from backend services, files, registry, programs, network, and task state/);
});

test("desktop internet options are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "internet");
  assert.match(initial.output.join("\n"), /Internet Options:/);
  assert.ok(initial.desktopInternet?.some((entry) => entry.tab === "Security" && entry.zone === "Local Intranet"));
  assert.ok(initial.desktopInternet?.some((entry) => entry.tab === "Content" && entry.setting === "Enabled Readers"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Internet Options" && entry.source === "desktopInternet"));

  await shellPost(session.sessionId, "bookmark add relay internet route");
  await shellPost(session.sessionId, "ftp cyberscape");
  await shellPost(session.sessionId, "get motd.txt");
  await shellPost(session.sessionId, "quit");

  const filtered = await shellPost(session.sessionId, "inetcpl cache");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Internet Options matching "cache"/);
  assert.match(filteredText, /Temporary Files/);
  assert.ok(filtered.desktopSnapshot?.desktopInternet.some((entry) => entry.zone === "Cache" && entry.value.includes("download")));

  const window = await shellPost(session.sessionId, "desktop internet");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: internet \(Internet Options\)/);
  assert.match(windowText, /backend option row/);
  assert.match(windowText, /derived from backend network, service, security, file, and preference state/);
});

test("desktop windows firewall is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "firewall");
  assert.match(initial.output.join("\n"), /Windows Firewall:/);
  assert.ok(initial.desktopFirewall?.some((entry) => entry.tab === "Exceptions" && entry.source === "desktopServices"));
  assert.ok(initial.desktopFirewall?.some((entry) => entry.tab === "About" && entry.value.includes("browser network permissions and packet APIs unused")));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Windows Firewall" && entry.source === "desktopFirewall"));

  await shellPost(session.sessionId, "bookmark add relay firewall route");
  await shellPost(session.sessionId, "task scan relay firewall sweep");
  const filtered = await shellPost(session.sessionId, "firewall.cpl log");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Windows Firewall matching "log"/);
  assert.match(filteredText, /Logging/);
  assert.ok(filtered.desktopSnapshot?.desktopFirewall.some((entry) => entry.name === "Background Tasks" && entry.value.includes("1 queued")));
  assert.ok(filtered.desktopSnapshot?.desktopFirewall.some((entry) => entry.name === "Public Profile" && entry.source === "desktopNetwork"));

  const window = await shellPost(session.sessionId, "desktop firewall");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: firewall \(Windows Firewall\)/);
  assert.match(windowText, /Exceptions\s+/);
  assert.match(windowText, /derived from backend security, services, network, dial-up, events, and task state/);
});

test("desktop automatic updates are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "updates");
  assert.match(initial.output.join("\n"), /Automatic Updates:/);
  assert.ok(initial.desktopUpdates?.some((entry) => entry.tab === "Settings" && entry.name === "Update Mode" && entry.source === "desktopTheme"));
  assert.ok(initial.desktopUpdates?.some((entry) => entry.tab === "About" && entry.value.includes("browser update services and OS package managers unused")));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Automatic Updates" && entry.source === "desktopUpdates"));

  await shellPost(session.sessionId, "task maint relay update check");
  await shellPost(session.sessionId, "ftp cyberscape");
  await shellPost(session.sessionId, "get motd.txt");
  await shellPost(session.sessionId, "quit");
  const filtered = await shellPost(session.sessionId, "wuaucpl.cpl cache");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Automatic Updates matching "cache"/);
  assert.match(filteredText, /Downloaded Payloads/);
  assert.ok(filtered.desktopSnapshot?.desktopUpdates.some((entry) => entry.name === "Downloaded Payloads" && entry.value.includes("motd.txt")));
  assert.ok(filtered.desktopSnapshot?.desktopUpdates.some((entry) => entry.name === "Queued Work" && entry.value.includes("maint:relay")));

  const window = await shellPost(session.sessionId, "desktop updates");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: updates \(Automatic Updates\)/);
  assert.match(windowText, /Status\s+/);
  assert.match(windowText, /derived from backend programs, services, security, tasks, events, downloads, and theme state/);
});

test("desktop performance monitor is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "performance");
  assert.match(initial.output.join("\n"), /Performance Monitor:/);
  assert.ok(initial.desktopPerformance?.some((entry) => entry.object === "Processor" && entry.source === "desktopProcesses"));
  assert.ok(initial.desktopPerformance?.some((entry) => entry.object === "Runtime" && entry.value.includes("browser performance APIs")));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Performance Monitor" && entry.source === "desktopPerformance"));

  await shellPost(session.sessionId, "task scan relay perf sweep");
  await shellPost(session.sessionId, "bookmark route relay perf route");
  const filtered = await shellPost(session.sessionId, "perfmon queue");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Performance Monitor matching "queue"/);
  assert.match(filteredText, /Processor Queue/);
  assert.ok(filtered.desktopSnapshot?.desktopPerformance.some((entry) => entry.counter === "Processor Queue" && entry.value.includes("1 queued")));
  assert.ok(filtered.desktopSnapshot?.desktopPerformance.some((entry) => entry.object === "Network" && entry.value.includes("visible host")));

  const window = await shellPost(session.sessionId, "desktop performance");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: performance \(Performance Monitor\)/);
  assert.match(windowText, /Processor\s+/);
  assert.match(windowText, /derived from backend processes, services, network, files, events, tasks, and security state/);
});

test("desktop system restore is backend-derived with command and window parity", async () => {
  const session = await shellPost();
  const username = `restore${Date.now()}`;

  const guest = await shellPost(session.sessionId, "restore");
  assert.match(guest.output.join("\n"), /System Restore:/);
  assert.ok(guest.desktopRestore?.some((entry) => entry.name === "Protection" && entry.status === "guest"));

  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "ssh relay");
  await shellPost(session.sessionId, "cd /var/log");
  await shellPost(session.sessionId, "save relayrun");
  await shellPost(session.sessionId, "task maint relay restore point");
  const filtered = await shellPost(session.sessionId, "rstrui relayrun");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /System Restore matching "relayrun"/);
  assert.match(filteredText, /Restore Point/);
  assert.ok(filtered.desktopSnapshot?.desktopRestore.some((entry) => entry.tab === "Restore Point" && entry.name === "relayrun" && entry.status === "relay"));
  assert.ok(filtered.desktopSnapshot?.desktopRestore.some((entry) => entry.name === "Queued Work" && entry.value.includes("1 queued")));
  assert.ok(filtered.desktopControl?.some((entry) => entry.applet === "System Restore" && entry.source === "desktopRestore"));

  const window = await shellPost(session.sessionId, "desktop open restore");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: restore \(System Restore\)/);
  assert.match(windowText, /Restore Points\s+/);
  assert.match(windowText, /derived from backend saved checkpoints, files, registry, security, events, and task state/);
});

test("desktop computer management is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "computer");
  assert.match(initial.output.join("\n"), /Computer Management:/);
  assert.ok(initial.desktopComputer?.some((entry) => entry.tree === "System Tools" && entry.node === "Event Viewer" && entry.source === "desktopEvents"));
  assert.ok(initial.desktopComputer?.some((entry) => entry.tree === "Services and Applications" && entry.node === "Services" && entry.source === "desktopServices"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Computer Management" && entry.source === "desktopComputer"));

  await shellPost(session.sessionId, "task maint relay compmgmt sweep");
  const filtered = await shellPost(session.sessionId, "compmgmt services");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Computer Management matching "services"/);
  assert.match(filteredText, /Services and Applications/);
  assert.ok(filtered.desktopSnapshot?.desktopComputer.some((entry) => entry.node === "Task Scheduler" && entry.value.includes("1 queued")));
  assert.ok(filtered.desktopSnapshot?.desktopComputer.some((entry) => entry.node === "Event Viewer" && entry.value.includes("task queued maint relay")));

  const alias = await shellPost(session.sessionId, "compmgmt.msc storage");
  assert.match(alias.output.join("\n"), /Computer Management matching "storage"/);
  assert.ok(alias.desktopComputer?.some((entry) => entry.tree === "Storage" && entry.node === "Disk Management"));

  const window = await shellPost(session.sessionId, "desktop open computer");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: computer \(Computer Management\)/);
  assert.match(windowText, /System Tools\s+/);
  assert.match(windowText, /derived from backend events, shares, devices, services, tasks, files, security, and performance state/);
});

test("desktop disk management is backend-derived with command and window parity", async () => {
  const session = await shellPost();
  const username = `disk${Date.now()}`;

  const guest = await shellPost(session.sessionId, "disk");
  assert.match(guest.output.join("\n"), /Disk Management:/);
  assert.ok(guest.desktopDisk?.some((entry) => entry.volume === "Local Browser Store" && entry.status === "unused"));
  assert.ok(guest.desktopControl?.some((entry) => entry.applet === "Disk Management" && entry.source === "desktopDisk"));

  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "write disk-note.txt sector map");
  await shellPost(session.sessionId, "task transfer relay disk spool");
  await shellPost(session.sessionId, "save diskpoint");
  const filtered = await shellPost(session.sessionId, "diskmgmt profile");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Disk Management matching "profile"/);
  assert.match(filteredText, /C: Profile/);
  assert.ok(filtered.desktopSnapshot?.desktopDisk.some((entry) => entry.volume === "C: Profile" && entry.status === "healthy" && entry.used.includes("home")));
  assert.ok(filtered.desktopSnapshot?.desktopDisk.some((entry) => entry.volume === "Transfer Queue" && entry.used.includes("1 pending")));
  assert.ok(filtered.desktopSnapshot?.desktopDisk.some((entry) => entry.volume === "Restore Points" && entry.capacity.includes("1 saved")));

  const alias = await shellPost(session.sessionId, "diskmgmt.msc shadow");
  assert.match(alias.output.join("\n"), /Disk Management matching "shadow"/);
  assert.ok(alias.desktopDisk?.some((entry) => entry.disk === "Shadow" && entry.volume === "Restore Points"));

  const window = await shellPost(session.sessionId, "desktop open disk");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: disk \(Disk Management\)/);
  assert.match(windowText, /Volumes\s+/);
  assert.match(windowText, /derived from backend quota, files, downloads, shares, checkpoints, tasks, and route state/);
});

test("desktop task manager is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "taskmgr");
  assert.match(initial.output.join("\n"), /Task Manager:/);
  assert.ok(initial.desktopProcesses?.some((entry) => entry.pid === 1 && entry.status === "running"));

  await shellPost(session.sessionId, `newuser tm${Date.now()} password`);
  await shellPost(session.sessionId, "task scan relay taskmgr sweep");
  const filtered = await shellPost(session.sessionId, "taskmgr queued");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Task Manager matching "queued"/);
  const queued = filtered.desktopSnapshot?.desktopProcesses.find((entry) => entry.status === "queued" && entry.command.includes("task scan"));
  assert.ok(queued);
  assert.equal(queued.source, "desktopTasks");
  assert.ok(queued.actions.some((action) => action === `kill ${queued.pid}`));

  const window = await shellPost(session.sessionId, "desktop taskmgr");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: taskmgr \(Task Manager\)/);
  assert.match(windowText, /backend process row/);
  assert.match(windowText, /derived from backend shell, task, link, camp, and tunnel state/);

  const killed = await shellPost(session.sessionId, `kill ${queued.pid}`);
  assert.match(killed.output.join("\n"), /Task marked done/);
  assert.ok(killed.desktopProcesses?.every((entry) => entry.pid !== queued.pid || entry.status !== "queued"));
});

test("desktop scheduled tasks are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "scheduler");
  assert.match(initial.output.join("\n"), /Scheduled Tasks:/);
  assert.ok(initial.desktopSchedule?.some((entry) => entry.name === "Event Log Rotation" && entry.source === "desktopEvents"));
  assert.ok(initial.desktopSchedule?.some((entry) => entry.name === "Route Watcher" && entry.actions.includes("tunnel")));

  await shellPost(session.sessionId, "task transfer motd scheduler copy");
  const filtered = await shellPost(session.sessionId, "schtasks /query transfer");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Scheduled Tasks matching "transfer"/);
  const queued = filtered.desktopSnapshot?.desktopSchedule.find((entry) => entry.name === "TRANSFER motd" && entry.status === "queued");
  assert.ok(queued);
  assert.equal(queued.source, "desktopTasks");
  assert.ok(queued.actions.some((action) => action.startsWith("task done ")));

  const window = await shellPost(session.sessionId, "desktop scheduler");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: scheduler \(Scheduled Tasks\)/);
  assert.match(windowText, /backend schedule row/);
  assert.match(windowText, /derived from backend tasks, events, mailbox, boards, and route state/);
});

test("desktop network is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const network = await shellPost(session.sessionId, "network relay");
  assert.match(network.output.join("\n"), /Network Places matching "relay"/);
  assert.ok(network.desktopNetwork?.some((entry) => entry.host === "cyberscape" && entry.access === "local"));

  const bookmarked = await shellPost(session.sessionId, "bookmark add relay switchboard");
  assert.ok(bookmarked.desktopNetwork?.some((entry) => entry.host === "relay" && entry.bookmarked));

  const username = `net${Date.now()}`;
  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "wardial");
  const porthack = await shellPost(session.sessionId, "porthack relay");
  if (porthack.output.join("\n").includes("CAPTCHA")) {
    await shellPost(session.sessionId, "yes");
  }

  const listed = await shellPost(session.sessionId, "network relay");
  assert.ok(listed.desktopSnapshot?.desktopNetwork.some((entry) => entry.host === "relay" && (entry.access === "login" || entry.access === "root")));

  const networkWindow = await shellPost(session.sessionId, "desktop network");
  const windowText = networkWindow.output.join("\n");
  assert.match(windowText, /Visible hosts\s+/);
  assert.match(windowText, /relay:(login|root|public)/);
});

test("desktop dial-up networking is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "dialup");
  assert.match(initial.output.join("\n"), /Dial-Up Networking:/);
  assert.match(initial.output.join("\n"), /Number\s+Protocol\s+Host/);
  assert.ok(initial.desktopDialup?.some((entry) => entry.host === "cyberscape" && entry.status === "connected"));

  const bookmarked = await shellPost(session.sessionId, "bookmark route relay dial tone");
  assert.ok(bookmarked.desktopDialup?.some((entry) => entry.host === "relay" && entry.status === "saved"));

  const filtered = await shellPost(session.sessionId, "dialup relay");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Dial-Up Networking matching "relay"/);
  assert.match(filteredText, /relay DUN\s+saved/);
  assert.ok(filtered.desktopSnapshot?.desktopDialup.some((entry) =>
    entry.host === "relay" &&
    entry.status === "saved" &&
    entry.number.startsWith("555-") &&
    entry.actions.some((action) => action.includes("dial relay")) &&
    entry.actions.some((action) => action.includes("trace relay"))
  ));

  const dialupWindow = await shellPost(session.sessionId, "desktop dialup");
  const windowText = dialupWindow.output.join("\n");
  assert.match(windowText, /Desktop app: dialup \(Dial-Up Networking\)/);
  assert.match(windowText, /Numbers\s+/);
  assert.match(windowText, /Saved\s+1 saved route/);
  assert.match(windowText, /derived from visible routes, bookmarks, tunnel, and watcher state/);
});

test("phonebook and wardial expose numbers and carrier outcomes", async () => {
  const session = await shellPost();
  const username = `phone${Date.now()}`;
  await shellPost(session.sessionId, `newuser ${username} password`);

  const phonebook = await shellPost(session.sessionId, "phonebook qotd");
  const phonebookText = phonebook.output.join("\n");
  assert.match(phonebookText, /Phonebook matching "qotd"/);
  assert.match(phonebookText, /Number\s+Host\s+Route\s+Speed\s+Carrier\s+Details\s+Entry/);
  assert.match(phonebookText, /555-\d{3}-\d{4}\s+qotd\s+/);
  assert.match(phonebookText, /busy\s+modem\/Finger\s+qotd DUN/);
  assert.ok(phonebook.desktopSnapshot?.desktopDialup.some((entry) => entry.host === "qotd" && entry.status === "busy"));
  assert.ok(phonebook.desktopSnapshot?.desktopDialup.some((entry) => entry.host === "zcode" && entry.status === "no-carrier"));

  const wardialed = await shellPost(session.sessionId, "wardial");
  const wardialText = wardialed.output.join("\n");
  assert.match(wardialText, /Host\s+Number\s+Speed\s+Carrier\s+Organization/);
  assert.match(wardialText, /qotd\s+555-\d{3}-\d{4}\s+(14\.4k|28\.8k|33\.6k|56k|ISDN)\s+busy/);
  assert.match(wardialText, /zcode\s+555-\d{3}-\d{4}\s+(14\.4k|28\.8k|33\.6k|56k|ISDN)\s+no carrier/);
  assert.match(wardialText, /Badge unlocked: wardialer/);
});

test("personal phonebook entries persist as user files and enable dialing saved hosts", async () => {
  const session = await shellPost();
  const username = `book${Date.now()}`;
  await shellPost(session.sessionId, `newuser ${username} password`);
  const route = findUucpRouteFrom("cyberscape", 2);
  assert.ok(route, "expected a multi-hop phonebook target");
  const target = route.at(-1)!;

  const before = await shellPost(session.sessionId, `phonebook ${target}`);
  assert.match(before.output.join("\n"), new RegExp(`Phonebook matching "${target}"`));
  assert.match(before.output.join("\n"), /none/);

  const saved = await shellPost(session.sessionId, `phonebook add ${target} personal toll node`);
  const savedText = saved.output.join("\n");
  assert.match(savedText, new RegExp(`Saved ${target} to /home/${username}/phonebook\\.txt`));
  assert.match(savedText, /Number: 555-\d{3}-\d{4}/);

  const listed = await shellPost(session.sessionId, `phonebook ${target}`);
  const listedText = listed.output.join("\n");
  assert.match(listedText, new RegExp(`555-\\d{3}-\\d{4}\\s+${target}\\s+`));
  assert.match(listedText, /(modem|isdn|bbs-line|silent-line)\/(V\.32bis|ISDN|BBS|Telnet|Finger|FTP|Gopher)/);
  assert.match(listedText, /personal toll node/);
  assert.ok(listed.desktopSnapshot?.desktopDialup.some((entry) =>
    entry.host === target &&
    entry.status === "saved" &&
    entry.lastSeen === "personal" &&
    entry.actions.some((action) => action.startsWith(`phonebook rm ${target}`))
  ));

  const file = await shellPost(session.sessionId, "cat phonebook.txt");
  assert.match(file.output.join("\n"), new RegExp(`${target} \\| personal toll node \\|`));

  await shellPost(session.sessionId, "logout");
  const fresh = await shellPost();
  await shellPost(fresh.sessionId, `login ${username} password`);
  const persisted = await shellPost(fresh.sessionId, `phonebook ${target}`);
  assert.match(persisted.output.join("\n"), /personal toll node/);

  const blocked = await shellPost(fresh.sessionId, `dial ${target}`);
  assert.match(blocked.output.join("\n"), /TOLL RESTRICTED/);
  assert.match(blocked.output.join("\n"), new RegExp(`Run operator ${target} before dialing this number\\.`));
  assert.equal(blocked.desktopSnapshot?.currentHost, "cyberscape");

  const operator = await shellPost(fresh.sessionId, `operator ${target}`);
  assert.match(operator.output.join("\n"), new RegExp(`Operator: long-distance circuit opened to ${target}\\.`));
  assert.match(operator.output.join("\n"), new RegExp(`Route: ${route.join(" -> ")}`));
  assert.match(operator.output.join("\n"), new RegExp(`Billing: calling card ${username} ledger #1\\.`));
  assert.ok(operator.desktopSnapshot?.desktopAccounts.some((entry) =>
    entry.name === "Calling Card" &&
    entry.source === "tollLedger" &&
    entry.value.includes("1 toll call") &&
    entry.value.includes(target)
  ));
  assert.ok(operator.desktopSnapshot?.desktopCredentials.some((entry) =>
    entry.target === "Calling Card" &&
    entry.status === "stored" &&
    entry.source.includes(`tollLedger:${target}:555-`)
  ));
  assert.ok(operator.desktopSnapshot?.desktopModems.some((entry) =>
    entry.name === "Toll Ledger" &&
    entry.source === "tollLedger" &&
    entry.value.includes(target)
  ));

  const accountToll = await shellPost(fresh.sessionId, "accounts calling");
  assert.match(accountToll.output.join("\n"), /User Accounts matching "calling"/);
  assert.match(accountToll.output.join("\n"), /Calling Card/);
  assert.match(accountToll.output.join("\n"), /1 toll call/);

  const credentialToll = await shellPost(fresh.sessionId, "credentials calling");
  const credentialTollText = credentialToll.output.join("\n");
  assert.match(credentialTollText, /Stored User Names and Passwords matching "calling"/);
  assert.match(credentialTollText, /Calling Card/);
  assert.match(credentialTollText, /stored/);
  assert.ok(!credentialTollText.includes("password"));

  const modemToll = await shellPost(fresh.sessionId, "modems toll");
  assert.match(modemToll.output.join("\n"), /Phone and Modem Options matching "toll"/);
  assert.match(modemToll.output.join("\n"), /Toll Ledger/);
  assert.match(modemToll.output.join("\n"), new RegExp(target));

  const dialed = await shellPost(fresh.sessionId, `dial ${target}`);
  assert.match(dialed.output.join("\n"), new RegExp(`DIAL connected to ${target}`));
  assert.equal(dialed.desktopSnapshot?.currentHost, target);

  await shellPost(fresh.sessionId, "back");
  const removed = await shellPost(fresh.sessionId, `phonebook rm ${target}`);
  assert.match(removed.output.join("\n"), new RegExp(`Removed ${target} from`));
  const after = await shellPost(fresh.sessionId, `phonebook ${target}`);
  assert.match(after.output.join("\n"), /none/);
});

test("phonebook saves line protocol and notes for richer modem-era discovery", async () => {
  const session = await shellPost();
  const username = `meta${Date.now()}`;
  await shellPost(session.sessionId, `newuser ${username} password`);

  const saved = await shellPost(session.sessionId, "phonebook add bbs night board line=bbs-line protocol=V.32bis note=file_area");
  const savedText = saved.output.join("\n");
  assert.match(savedText, /Saved bbs to/);
  assert.match(savedText, /Line: bbs-line; Protocol: V\.32bis; Notes: file area/);

  const listed = await shellPost(session.sessionId, "phonebook V.32bis");
  const listedText = listed.output.join("\n");
  assert.match(listedText, /Phonebook matching "v\.32bis"/);
  assert.match(listedText, /bbs-line\/V\.32bis\s+night board/);
  assert.ok(listed.desktopSnapshot?.desktopDialup.some((entry) =>
    entry.host === "bbs" &&
    entry.status === "saved" &&
    entry.lineType === "bbs-line" &&
    entry.protocol === "V.32bis" &&
    entry.notes.includes("file area")
  ));

  const dialup = await shellPost(session.sessionId, "dialup file");
  assert.match(dialup.output.join("\n"), /bbs DUN|night board/);
  assert.ok(dialup.desktopSnapshot?.desktopDialup.some((entry) =>
    entry.host === "bbs" &&
    entry.protocol === "V.32bis" &&
    entry.actions.includes("phonebook rm bbs")
  ));

  const file = await shellPost(session.sessionId, "cat phonebook.txt");
  assert.match(file.output.join("\n"), /bbs \| night board \| bbs-line \| V\.32bis \| file area/);

  const wardial = await shellPost(session.sessionId, "wardial");
  assert.match(wardial.output.join("\n"), /BBS Cyberscape BBS; Welcome to the board/);
});

test("dial connects through discovered phone numbers and host shortcuts", async () => {
  const session = await shellPost();

  const listed = await shellPost(session.sessionId, "dialup relay");
  const relay = listed.desktopSnapshot?.desktopDialup.find((entry) => entry.host === "relay");
  assert.ok(relay, "expected relay dial-up row");
  assert.match(relay.number, /^555-\d{3}-\d{4}$/);

  const byNumber = await shellPost(session.sessionId, `dial ${relay.number}`);
  const byNumberText = byNumber.output.join("\n");
  assert.match(byNumberText, /Dialing 555-\d{3}-\d{4} \(relay DUN\)/);
  assert.match(byNumberText, /ATDT 555-\d{3}-\d{4}/);
  assert.match(byNumberText, /CONNECT (14\.4k|28\.8k|33\.6k|56k|ISDN)/);
  assert.match(byNumberText, /DIAL connected to relay/);
  assert.equal(byNumber.desktopSnapshot?.currentHost, "relay");
  assert.ok(byNumber.desktopSnapshot?.desktopEvents.some((event) => event.source === "dialup" && event.message.includes(`dial connected relay ${relay.number}`)));

  const returned = await shellPost(session.sessionId, "back");
  assert.match(returned.output.join("\n"), /Returned to previous shell context/);
  assert.equal(returned.desktopSnapshot?.currentHost, "cyberscape");

  const byHost = await shellPost(session.sessionId, "dial relay");
  assert.match(byHost.output.join("\n"), /DIAL connected to relay/);
  assert.equal(byHost.desktopSnapshot?.currentHost, "relay");
});

test("acoustic coupler attaches a handset before pre-dial-up dialing", async () => {
  const session = await shellPost();

  const idle = await shellPost(session.sessionId, "coupler");
  assert.match(idle.output.join("\n"), /Acoustic coupler idle/);

  const attached = await shellPost(session.sessionId, "coupler relay");
  const attachedText = attached.output.join("\n");
  assert.match(attachedText, /Acoustic coupler attached to relay/);
  assert.match(attachedText, /Place handset in cups: 555-\d{3}-\d{4}/);
  assert.match(attachedText, /Line discipline: (110|300) baud, half-duplex/);
  assert.ok(attached.desktopSnapshot?.desktopLineage.some((entry) =>
    entry.era === "pre-dialup" &&
    entry.host === "relay" &&
    entry.status === "connected" &&
    /^(110|300) baud$/.test(entry.speed)
  ));
  assert.ok(attached.desktopSnapshot?.desktopModems.some((entry) =>
    entry.name === "Acoustic Coupler" &&
    entry.source === "acousticCoupler" &&
    entry.value.includes("relay") &&
    entry.value.includes("baud")
  ));
  assert.ok(attached.desktopSnapshot?.desktopDevices.some((entry) =>
    entry.category === "Modem" &&
    entry.name === "Acoustic coupler" &&
    entry.driver === "acoustic-coupler.sys" &&
    entry.resource.includes("baud")
  ));

  const dialed = await shellPost(session.sessionId, "dial relay");
  const dialedText = dialed.output.join("\n");
  assert.match(dialedText, /through acoustic coupler/);
  assert.match(dialedText, /PULSE 555-\d{3}-\d{4}/);
  assert.match(dialedText, /ACOUSTIC CARRIER (110|300) baud/);
  assert.match(dialedText, /CONNECT (110|300) baud/);
  assert.match(dialedText, /DIAL connected to relay/);
  assert.equal(dialed.desktopSnapshot?.currentHost, "relay");
  assert.ok(dialed.desktopSnapshot?.desktopEvents.some((event) => event.source === "dialup" && event.message.includes("coupler connected relay")));

  await shellPost(session.sessionId, "back");
  const detached = await shellPost(session.sessionId, "coupler detach");
  assert.match(detached.output.join("\n"), /Acoustic coupler detached/);
  assert.ok(detached.desktopSnapshot?.desktopModems.some((entry) =>
    entry.name === "Acoustic Coupler" &&
    entry.value.includes("idle handset cups")
  ));
});

test("dialing a BBS includes modem handoff before board login", async () => {
  const session = await shellPost();

  const dialed = await shellPost(session.sessionId, "dial bbs");
  const text = dialed.output.join("\n");
  assert.match(text, /ATDT 555-\d{3}-\d{4}/);
  assert.match(text, /CARRIER (14\.4k|28\.8k|33\.6k|56k|ISDN)/);
  assert.match(text, /DIAL connected to bbs/);
  assert.match(text, /Carrier locked\. BBS answers after modem handoff\./);
  assert.match(text, /Login ritual: enter GUEST or a board handle\./);
  assert.equal(dialed.prompt, "-");

  const login = await shellPost(session.sessionId, "GUEST");
  assert.match(login.output.join("\n"), /Welcome, GUEST/);
  assert.equal(login.prompt, "-");
});

test("dial reports busy and no-carrier without changing hosts", async () => {
  const session = await shellPost();

  const busy = await shellPost(session.sessionId, "dial qotd");
  const busyText = busy.output.join("\n");
  assert.match(busyText, /Dialing 555-\d{3}-\d{4} \(qotd DUN\)/);
  assert.match(busyText, /ATDT 555-\d{3}-\d{4}/);
  assert.match(busyText, /BUSY/);
  assert.match(busyText, /Try HUNT, PHONEBOOK, or WARDIAL/);
  assert.equal(busy.desktopSnapshot?.currentHost, "cyberscape");
  assert.ok(busy.desktopSnapshot?.desktopEvents.some((event) => event.source === "dialup" && event.message.includes("dial busy qotd")));

  const noCarrier = await shellPost(session.sessionId, "dial zcode");
  const noCarrierText = noCarrier.output.join("\n");
  assert.match(noCarrierText, /NO CARRIER/);
  assert.match(noCarrierText, /No modem carrier was detected/);
  assert.equal(noCarrier.desktopSnapshot?.currentHost, "cyberscape");
  assert.ok(noCarrier.desktopSnapshot?.desktopEvents.some((event) => event.source === "dialup" && event.message.includes("dial no carrier zcode")));
});

test("hunt exposes alternate numbers and exact-number dialing can bypass a busy primary line", async () => {
  const session = await shellPost();

  const primaryBusy = await shellPost(session.sessionId, "dial qotd");
  assert.match(primaryBusy.output.join("\n"), /BUSY/);

  const hunted = await shellPost(session.sessionId, "hunt qotd");
  const huntedText = hunted.output.join("\n");
  assert.match(huntedText, /Line hunt for qotd:/);
  assert.match(huntedText, /Line\s+Number\s+Speed\s+Carrier\s+Label/);
  assert.match(huntedText, /selected line 2/i);
  assert.ok(hunted.desktopSnapshot?.desktopEvents.some((event) => event.source === "dialup" && event.message.includes("line hunt qotd selected")));
  assert.ok(hunted.desktopSnapshot?.desktopModems.some((entry) =>
    entry.name === "Line Hunt Groups" &&
    /\d+ host\(s\) expose alternate numbers/.test(entry.value)
  ));
  assert.ok(hunted.desktopSnapshot?.desktopHelp.some((entry) =>
    entry.topic === "hunt" &&
    entry.source === "commandHelp"
  ));

  const selected = huntedText.match(/Selected line \d+: (555-\d{3}-\d{4})/i);
  assert.ok(selected, "expected a selected alternate number");
  const dialed = await shellPost(session.sessionId, `dial ${selected[1]}`);
  const dialedText = dialed.output.join("\n");
  assert.match(dialedText, new RegExp(`Dialing ${selected[1]} \\(qotd DUN\\)`));
  assert.match(dialedText, /CONNECT 14\.4k|CONNECT 28\.8k|CONNECT 33\.6k|CONNECT 56k|CONNECT ISDN/);
  assert.equal(dialed.desktopSnapshot?.currentHost, "qotd");
  assert.ok(dialed.desktopSnapshot?.desktopEvents.some((event) => event.source === "dialup" && event.message.includes(`dial connected qotd ${selected[1]}`)));
});

test("desktop phone and modem options are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "modems");
  assert.match(initial.output.join("\n"), /Phone and Modem Options:/);
  assert.ok(initial.desktopModems?.some((entry) => entry.tab === "Modems" && entry.name === "Active Connection" && entry.source === "desktopDialup"));
  assert.ok(initial.desktopModems?.some((entry) => entry.tab === "Advanced" && entry.value.includes("browser serial and hardware APIs unused")));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Phone and Modem Options" && entry.source === "desktopModems"));

  await shellPost(session.sessionId, "bookmark route relay modem route");
  await shellPost(session.sessionId, "task scan relay modem sweep");
  const filtered = await shellPost(session.sessionId, "telephon.cpl relay");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Phone and Modem Options matching "relay"/);
  assert.match(filteredText, /relay DUN/);
  assert.ok(filtered.desktopSnapshot?.desktopModems.some((entry) => entry.name === "relay DUN" && entry.value.includes("555-")));
  assert.ok(filtered.desktopSnapshot?.desktopModems.some((entry) => entry.name === "Queued Dial Jobs" && entry.value.includes("1 queued")));

  const window = await shellPost(session.sessionId, "desktop modems");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: modems \(Phone and Modem Options\)/);
  assert.match(windowText, /Diagnostics\s+/);
  assert.match(windowText, /derived from backend dial-up, device, regional, network, service, and task state/);
});

test("desktop device manager is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "devices");
  assert.match(initial.output.join("\n"), /Device Manager:/);
  assert.ok(initial.desktopDevices?.some((entry) => entry.category === "Computer" && entry.host === "cyberscape"));
  assert.ok(initial.desktopDevices?.some((entry) => entry.category === "Terminal" && entry.name.includes("TTY")));

  await shellPost(session.sessionId, "task scan relay device sweep");
  const busy = await shellPost(session.sessionId, "devmgmt schedsvc");
  const busyText = busy.output.join("\n");
  assert.match(busyText, /Device Manager matching "schedsvc"/);
  assert.ok(busy.desktopSnapshot?.desktopDevices.some((entry) =>
    entry.category === "System" &&
    entry.status === "busy" &&
    entry.driver === "schedsvc.dll" &&
    entry.actions.some((action) => action.startsWith("task done"))
  ));

  const modem = await shellPost(session.sessionId, "devices modem");
  assert.match(modem.output.join("\n"), /Modem/);
  assert.ok(modem.desktopSnapshot?.desktopDevices.some((entry) => entry.category === "Modem" && entry.resource.includes("555-")));

  const devicesWindow = await shellPost(session.sessionId, "desktop devices");
  const windowText = devicesWindow.output.join("\n");
  assert.match(windowText, /Desktop app: devices \(Device Manager\)/);
  assert.match(windowText, /Busy\s+\d+ busy device/);
  assert.match(windowText, /derived from host ports, tasks, tty, files, dial-up, and print queues/);
});

test("desktop nodes are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "nodes");
  assert.match(initial.output.join("\n"), /My Nodes:/);
  assert.ok(initial.desktopNodes?.some((entry) => entry.host === "cyberscape" && entry.role === "current"));

  const username = `nodes${Date.now()}`;
  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "wardial");
  const porthack = await shellPost(session.sessionId, "porthack relay");
  if (porthack.output.join("\n").includes("CAPTCHA")) {
    await shellPost(session.sessionId, "yes");
  }

  const listed = await shellPost(session.sessionId, "nodes relay");
  assert.match(listed.output.join("\n"), /My Nodes matching "relay"/);
  assert.ok(listed.desktopSnapshot?.desktopNodes.some((entry) => entry.host === "relay" && entry.role === "login"));

  const nodesWindow = await shellPost(session.sessionId, "desktop nodes");
  const windowText = nodesWindow.output.join("\n");
  assert.match(windowText, /Nodes\s+/);
  assert.match(windowText, /relay:login/);
});

test("desktop security is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "security");
  assert.match(initial.output.join("\n"), /Security Center:/);
  assert.ok(initial.desktopSecurity?.some((entry) => entry.host === "cyberscape" && entry.posture === "local"));

  const username = `security${Date.now()}`;
  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "wardial");
  const porthack = await shellPost(session.sessionId, "porthack relay");
  if (porthack.output.join("\n").includes("CAPTCHA")) {
    await shellPost(session.sessionId, "yes");
  }

  const listed = await shellPost(session.sessionId, "security relay");
  const listedText = listed.output.join("\n");
  assert.match(listedText, /Security Center matching "relay"/);
  assert.ok(listed.desktopSnapshot?.desktopSecurity.some((entry) =>
    entry.host === "relay" &&
    entry.access === "login" &&
    entry.checks.includes("login shell present") &&
    entry.actions.some((action) => action.includes("secure"))
  ));

  const securityWindow = await shellPost(session.sessionId, "desktop security");
  const windowText = securityWindow.output.join("\n");
  assert.match(windowText, /Posture\s+/);
  assert.match(windowText, /relay:exposed/);
});

test("desktop services are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "services");
  const initialText = initial.output.join("\n");
  assert.match(initialText, /Services:/);
  assert.ok(initial.desktopServices?.some((entry) => entry.host === "cyberscape" && entry.status === "running"));

  const filtered = await shellPost(session.sessionId, "services telnet");
  assert.match(filtered.output.join("\n"), /Services matching "telnet"/);
  assert.ok(filtered.desktopSnapshot?.desktopServices.some((entry) => entry.name === "Telnet" && entry.actions.some((action) => action.startsWith("telnet "))));

  const username = `services${Date.now()}`;
  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "wardial");
  const porthack = await shellPost(session.sessionId, "porthack relay");
  if (porthack.output.join("\n").includes("CAPTCHA")) {
    await shellPost(session.sessionId, "yes");
  }

  const listed = await shellPost(session.sessionId, "services relay");
  assert.ok(listed.desktopSnapshot?.desktopServices.some((entry) => entry.host === "relay" && (entry.access === "login" || entry.access === "root")));

  const servicesWindow = await shellPost(session.sessionId, "desktop services");
  const windowText = servicesWindow.output.join("\n");
  assert.match(windowText, /Visible\s+/);
  assert.match(windowText, /service table from backend state/);
});

test("desktop shares are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "shares");
  assert.match(initial.output.join("\n"), /Shared Folders:/);
  assert.ok(initial.desktopShares?.some((entry) => entry.host === "cyberscape" && entry.kind === "host"));

  const username = `shares${Date.now()}`;
  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "write notes.txt signal");

  const homeShares = await shellPost(session.sessionId, "shares home");
  const homeText = homeShares.output.join("\n");
  assert.match(homeText, /Shared Folders matching "home"/);
  assert.ok(homeShares.desktopSnapshot?.desktopShares.some((entry) =>
    entry.kind === "home" &&
    entry.writable &&
    entry.files >= 1 &&
    entry.path.includes(`/home/${username}`)
  ));

  const sharesWindow = await shellPost(session.sessionId, "desktop shares");
  const windowText = sharesWindow.output.join("\n");
  assert.match(windowText, /Visible\s+/);
  assert.match(windowText, /Writable\s+/);
  assert.match(windowText, /derived from visible files/);
});

test("desktop print queue is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "printq");
  assert.match(initial.output.join("\n"), /Print Queue:/);
  assert.ok(initial.desktopPrint?.some((entry) => entry.host === "cyberscape" && entry.status === "ready"));

  const queued = await shellPost(session.sessionId, "task transfer cyberscape spool marker");
  assert.match(queued.output.join("\n"), /Task queued: transfer cyberscape/);

  const listed = await shellPost(session.sessionId, "printers spool");
  const listedText = listed.output.join("\n");
  assert.match(listedText, /Print Queue matching "spool"/);
  assert.ok(listed.desktopSnapshot?.desktopPrint.some((entry) =>
    entry.status === "queued" &&
    entry.document.includes("spool") &&
    entry.actions.some((action) => action.startsWith("task done"))
  ));

  const printersWindow = await shellPost(session.sessionId, "desktop printers");
  const windowText = printersWindow.output.join("\n");
  assert.match(windowText, /Queues\s+/);
  assert.match(windowText, /derived from tasks, files, and recent events/);
});

test("desktop registry is backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "registry theme");
  assert.match(initial.output.join("\n"), /Registry matching "theme"/);
  assert.ok(initial.desktopRegistry?.some((entry) => entry.hive === "HKCU" && entry.name === "DesktopTheme" && entry.value === "xp"));

  await shellPost(session.sessionId, "theme nt");
  await shellPost(session.sessionId, "theme pref contrast high");
  await shellPost(session.sessionId, "bookmark add relay registry marker");
  await shellPost(session.sessionId, "task scan relay registry scan");

  const queried = await shellPost(session.sessionId, "reg query cyberscape");
  const queriedText = queried.output.join("\n");
  assert.match(queriedText, /Registry matching "cyberscape"/);
  assert.ok(queried.desktopSnapshot?.desktopRegistry.some((entry) => entry.name === "DesktopTheme" && entry.value === "nt" && entry.writable));
  assert.ok(queried.desktopSnapshot?.desktopRegistry.some((entry) => entry.name === "UserPreferences" && entry.value.includes("contrast=high")));
  assert.ok(queried.desktopSnapshot?.desktopRegistry.some((entry) => entry.name === "BookmarkCount" && entry.value === "1"));
  assert.ok(queried.desktopSnapshot?.desktopRegistry.some((entry) => entry.name === "QueuedTasks" && entry.value.includes("1 queued")));
  assert.ok(queried.desktopSnapshot?.desktopRegistry.some((entry) => entry.name === "SshKey" && entry.value === "none"));

  const registryWindow = await shellPost(session.sessionId, "desktop registry");
  const windowText = registryWindow.output.join("\n");
  assert.match(windowText, /Desktop app: registry \(Registry Editor\)/);
  assert.match(windowText, /Writable\s+\d+ setting key/);
  assert.match(windowText, /derived from backend state, prefs, host graph, and access/);
});

test("desktop folder options are backend-derived with command and window parity", async () => {
  const session = await shellPost();

  const initial = await shellPost(session.sessionId, "folders");
  assert.match(initial.output.join("\n"), /Folder Options:/);
  assert.ok(initial.desktopFolders?.some((entry) => entry.tab === "View" && entry.option === "Hidden Files" && entry.source === "desktopFiles"));
  assert.ok(initial.desktopFolders?.some((entry) => entry.tab === "File Types" && entry.option === "Registered Types"));
  assert.ok(initial.desktopControl?.some((entry) => entry.applet === "Folder Options" && entry.source === "desktopFolders"));

  await shellPost(session.sessionId, `newuser fold${Date.now()} password`);
  await shellPost(session.sessionId, "write notes.log folder options marker");
  await shellPost(session.sessionId, "bookmark add relay folder marker");
  const filtered = await shellPost(session.sessionId, "folderopts offline");
  const filteredText = filtered.output.join("\n");
  assert.match(filteredText, /Folder Options matching "offline"/);
  assert.match(filteredText, /Local Cache/);
  assert.ok(filtered.desktopSnapshot?.desktopFolders.some((entry) => entry.tab === "Offline Files" && entry.value.includes("home file")));
  assert.ok(filtered.desktopSnapshot?.desktopFolders.some((entry) => entry.tab === "Search" && entry.option === "Saved Places" && entry.value.includes("bookmark")));

  const window = await shellPost(session.sessionId, "desktop folders");
  const windowText = window.output.join("\n");
  assert.match(windowText, /Desktop app: folders \(Folder Options\)/);
  assert.match(windowText, /backend folder option row/);
  assert.match(windowText, /derived from backend file, share, preference, bookmark, and history state/);
});

test("command history is backend-owned and searchable across clients", async () => {
  const session = await shellPost();

  await shellPost(session.sessionId, "hosts | head 2");
  await shellPost(session.sessionId, "bookmark add relay history marker");
  const found = await shellPost(session.sessionId, "history relay");
  const output = found.output.join("\n");

  assert.match(output, /Recent commands matching "relay"/);
  assert.match(output, /bookmark add relay history marker/);
  assert.equal(found.commandHistory?.at(-1)?.line, "history relay");
  assert.ok(found.desktopSnapshot?.commandHistory.some((entry) => entry.line.includes("bookmark add relay")));

  const logs = await shellPost(session.sessionId, "desktop logs");
  assert.match(logs.output.join("\n"), /Last command\s+desktop logs/);

  const reload = await shellPost(session.sessionId);
  assert.ok(reload.desktopSnapshot?.commandHistory.some((entry) => entry.line === "history relay"));
});

test("desktop active app is persisted as bounded presentation state", async () => {
  const session = await shellPost();
  assert.equal(session.desktopActiveApp, "terminal");
  assert.deepEqual(session.desktopOpenApps, ["terminal"]);

  const opened = await shellPost(session.sessionId, undefined, "network");
  assert.equal(opened.desktopActiveApp, "network");
  assert.equal(opened.desktopSnapshot?.desktopActiveApp, "network");
  assert.deepEqual(opened.desktopOpenApps, ["terminal", "network"]);
  assert.deepEqual(opened.desktopSnapshot?.desktopOpenApps, ["terminal", "network"]);

  const reload = await shellPost(session.sessionId);
  assert.equal(reload.desktopActiveApp, "network");
  assert.deepEqual(reload.desktopOpenApps, ["terminal", "network"]);

  const rejected = await shellPost(session.sessionId, undefined, "admin-panel");
  assert.equal(rejected.desktopActiveApp, "network");
  assert.deepEqual(rejected.desktopOpenApps, ["terminal", "network"]);

  const closed = await shellPost(session.sessionId, undefined, "terminal");
  assert.equal(closed.desktopActiveApp, "terminal");
});

test("desktop window state is persisted as bounded presentation state", async () => {
  const session = await shellPost();

  const opened = await shellPost(
    session.sessionId,
    undefined,
    "files",
    ["terminal", "files", "mail", "unknown"],
    ["mail"],
    {
      files: { x: 220.7, y: 90.2 },
      mail: { x: 9999, y: -8 },
      unknown: { x: 1, y: 1 },
      help: { x: "left", y: 1 },
    },
    undefined,
    undefined,
    ["files", "mail", "unknown"],
  );
  assert.equal(opened.desktopActiveApp, "files");
  assert.deepEqual(opened.desktopOpenApps, ["terminal", "files", "mail"]);
  assert.deepEqual(opened.desktopMinimizedApps, ["mail"]);
  assert.deepEqual(opened.desktopMaximizedApps, ["files"]);
  assert.deepEqual(opened.desktopWindowPositions?.files, { x: 221, y: 90 });
  assert.deepEqual(opened.desktopWindowPositions?.mail, { x: 640, y: 0 });
  assert.equal((opened.desktopWindowPositions as Record<string, unknown> | undefined)?.unknown, undefined);
  assert.equal(opened.desktopWindowPositions?.help, undefined);

  const reload = await shellPost(session.sessionId);
  assert.deepEqual(reload.desktopSnapshot?.desktopOpenApps, ["terminal", "files", "mail"]);
  assert.deepEqual(reload.desktopSnapshot?.desktopMinimizedApps, ["mail"]);
  assert.deepEqual(reload.desktopSnapshot?.desktopMaximizedApps, ["files"]);
  assert.deepEqual(reload.desktopSnapshot?.desktopWindowPositions.files, { x: 221, y: 90 });

  const invalidOnly = await shellPost(session.sessionId, undefined, "admin-panel", ["unknown"], ["network"]);
  assert.equal(invalidOnly.desktopActiveApp, "files");
  assert.deepEqual(invalidOnly.desktopOpenApps, ["terminal", "files"]);
  assert.deepEqual(invalidOnly.desktopMinimizedApps, []);
  assert.deepEqual(invalidOnly.desktopMaximizedApps, []);
});

test("desktop accessibility preferences are backend-owned bounded presentation state", async () => {
  const session = await shellPost();

  const patched = await shellPost(
    session.sessionId,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    { motion: "reduced", fontSize: "large", contrast: "high", sound: "on", keyboardMode: "terminal", extra: "ignored" },
  );
  assert.deepEqual(patched.desktopPrefs, { motion: "reduced", fontSize: "large", contrast: "high", sound: "on", keyboardMode: "terminal" });
  assert.deepEqual(patched.desktopSnapshot?.desktopPrefs, { motion: "reduced", fontSize: "large", contrast: "high", sound: "on", keyboardMode: "terminal" });

  const invalid = await shellPost(
    session.sessionId,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    { motion: "spin", fontSize: "tiny", contrast: "infrared", sound: "loud", keyboardMode: "agent" },
  );
  assert.deepEqual(invalid.desktopPrefs, { motion: "normal", fontSize: "normal", contrast: "normal", sound: "muted", keyboardMode: "desktop" });

  const one = await shellPost(session.sessionId, undefined, undefined, undefined, undefined, undefined, undefined, { key: "motion", value: "reduced" });
  assert.deepEqual(one.desktopPrefs, { motion: "reduced", fontSize: "normal", contrast: "normal", sound: "muted", keyboardMode: "desktop" });

  const keyboard = await shellPost(session.sessionId, undefined, undefined, undefined, undefined, undefined, undefined, { key: "keyboard", value: "terminal" });
  assert.deepEqual(keyboard.desktopPrefs, { motion: "reduced", fontSize: "normal", contrast: "normal", sound: "muted", keyboardMode: "terminal" });
});

test("desktop command gives text clients active app parity", async () => {
  const session = await shellPost();

  const show = await shellPost(session.sessionId, "desktop");
  assert.match(show.output.join("\n"), /Desktop app: terminal/);
  assert.match(show.output.join("\n"), /Window commands:/);
  assert.match(show.output.join("\n"), /Host\s+cyberscape/);

  const files = await shellPost(session.sessionId, "desktop files");
  assert.equal(files.desktopActiveApp, "files");
  assert.equal(files.desktopSnapshot?.desktopActiveApp, "files");
  assert.deepEqual(files.desktopOpenApps, ["terminal", "files"]);
  assert.match(files.output.join("\n"), /Desktop app set: files/);
  assert.match(files.output.join("\n"), /cwd\s+\//);
  assert.match(files.output.join("\n"), /downloads\s+0 server-tracked file/);

  const moved = await shellPost(session.sessionId, "desktop move files 333 144");
  assert.equal(moved.desktopActiveApp, "files");
  assert.deepEqual(moved.desktopWindowPositions?.files, { x: 333, y: 144 });
  assert.match(moved.output.join("\n"), /Desktop app moved: files 333,144/);
  assert.match(moved.output.join("\n"), /Position: 333,144/);

  const mail = await shellPost(session.sessionId, "desktop open mail");
  assert.equal(mail.desktopActiveApp, "mail");
  assert.deepEqual(mail.desktopOpenApps, ["terminal", "files", "mail"]);

  const maximized = await shellPost(session.sessionId, "desktop max mail");
  assert.equal(maximized.desktopActiveApp, "mail");
  assert.deepEqual(maximized.desktopMaximizedApps, ["mail"]);
  assert.match(maximized.output.join("\n"), /Desktop app maximized: mail/);
  assert.match(maximized.output.join("\n"), /Maximized: mail/);

  const minimized = await shellPost(session.sessionId, "desktop min mail");
  assert.equal(minimized.desktopActiveApp, "terminal");
  assert.deepEqual(minimized.desktopMinimizedApps, ["mail"]);
  assert.deepEqual(minimized.desktopMaximizedApps, []);

  const restored = await shellPost(session.sessionId, "desktop restore mail");
  assert.equal(restored.desktopActiveApp, "mail");
  assert.deepEqual(restored.desktopMinimizedApps, []);
  assert.deepEqual(restored.desktopMaximizedApps, []);

  const closedMail = await shellPost(session.sessionId, "desktop close mail");
  assert.equal(closedMail.desktopActiveApp, "terminal");
  assert.deepEqual(closedMail.desktopOpenApps, ["terminal", "files"]);

  const invalid = await shellPost(session.sessionId, "desktop control-panel");
  assert.equal(invalid.desktopActiveApp, "terminal");
  assert.match(invalid.output.join("\n"), /Usage: desktop </);

  const reload = await shellPost(session.sessionId);
  assert.equal(reload.desktopActiveApp, "terminal");
  assert.deepEqual(reload.desktopOpenApps, ["terminal", "files"]);

  const settings = await shellPost(session.sessionId, "desktop settings");
  assert.match(settings.output.join("\n"), /Theme\s+xp stored by the backend/);
  assert.match(settings.output.join("\n"), /Motion\s+normal/);
  assert.match(settings.output.join("\n"), /Font size\s+normal/);
  assert.match(settings.output.join("\n"), /Contrast\s+normal/);
  assert.match(settings.output.join("\n"), /Sound\s+muted/);
  assert.match(settings.output.join("\n"), /Keyboard\s+desktop/);

  const reduced = await shellPost(session.sessionId, "theme pref motion reduced");
  assert.deepEqual(reduced.desktopPrefs, { motion: "reduced", fontSize: "normal", contrast: "normal", sound: "muted", keyboardMode: "desktop" });
  assert.match(reduced.output.join("\n"), /Preference set: motion=reduced/);

  const large = await shellPost(session.sessionId, "theme pref font large");
  assert.deepEqual(large.desktopPrefs, { motion: "reduced", fontSize: "large", contrast: "normal", sound: "muted", keyboardMode: "desktop" });

  const high = await shellPost(session.sessionId, "theme pref contrast high");
  assert.deepEqual(high.desktopPrefs, { motion: "reduced", fontSize: "large", contrast: "high", sound: "muted", keyboardMode: "desktop" });

  const sound = await shellPost(session.sessionId, "theme pref sound on");
  assert.deepEqual(sound.desktopPrefs, { motion: "reduced", fontSize: "large", contrast: "high", sound: "on", keyboardMode: "desktop" });

  const keyboardPref = await shellPost(session.sessionId, "theme pref keyboard terminal");
  assert.deepEqual(keyboardPref.desktopPrefs, { motion: "reduced", fontSize: "large", contrast: "high", sound: "on", keyboardMode: "terminal" });

  const badPref = await shellPost(session.sessionId, "theme pref contrast neon");
  assert.deepEqual(badPref.desktopPrefs, { motion: "reduced", fontSize: "large", contrast: "high", sound: "on", keyboardMode: "terminal" });
  assert.match(badPref.output.join("\n"), /Usage: theme pref/);

  const exported = await shellPost(session.sessionId, "desktop export");
  assert.match(exported.output.join("\n"), /Desktop export:/);
  assert.match(exported.output.join("\n"), /"theme": "xp"/);
  assert.match(exported.output.join("\n"), /"activeApp": "settings"/);
  assert.match(exported.output.join("\n"), /"fontSize": "large"/);
  assert.match(exported.output.join("\n"), /"sound": "on"/);
  assert.match(exported.output.join("\n"), /"keyboardMode": "terminal"/);

  const resetLayout = await shellPost(session.sessionId, "desktop reset layout");
  assert.equal(resetLayout.desktopActiveApp, "terminal");
  assert.deepEqual(resetLayout.desktopOpenApps, ["terminal"]);
  assert.deepEqual(resetLayout.desktopMinimizedApps, []);
  assert.deepEqual(resetLayout.desktopMaximizedApps, []);
  assert.deepEqual(resetLayout.desktopWindowPositions, {});
  assert.deepEqual(resetLayout.desktopPrefs, { motion: "reduced", fontSize: "large", contrast: "high", sound: "on", keyboardMode: "terminal" });

  const resetPrefs = await shellPost(session.sessionId, "desktop reset prefs");
  assert.deepEqual(resetPrefs.desktopPrefs, { motion: "normal", fontSize: "normal", contrast: "normal", sound: "muted", keyboardMode: "desktop" });

  const badReset = await shellPost(session.sessionId, "desktop reset accounts");
  assert.match(badReset.output.join("\n"), /Usage: desktop reset/);
});

test("advent enters the nested adventure runner", async () => {
  const state = initialShellState();
  const launch = await executeLine(state, "advent");
  assert.match(launch.output.join("\n"), /Running advent\.gam/i);
  assert.equal(prompt(state), ">");

  const quit = await executeLine(state, "quit");
  assert.match(quit.output.join("\n"), /Leaving the game/i);
});

test("link mirrors a remote tty onto the linking session", async () => {
  const alpha = await shellPost();
  const beta = await shellPost();
  const alphaUser = `alpha-${Date.now()}`;
  const betaUser = `beta-${Date.now()}`;

  await shellPost(alpha.sessionId, `newuser ${alphaUser} password`);
  await shellPost(beta.sessionId, `newuser ${betaUser} password`);

  const linked = await shellPost(alpha.sessionId, `link ${betaUser}`);
  assert.match(linked.output.join("\n"), /Linked to/i);

  await shellPost(beta.sessionId, "echo mirrored");

  const mirrored = await shellPost(alpha.sessionId, "date");
  assert.match(mirrored.output.join("\n"), /%link from port/i);
  assert.match(mirrored.output.join("\n"), /mirrored/i);
});

test("earned badges persist across API logout and login", async () => {
  const session = await shellPost();
  const username = `persist-${Date.now()}`;

  await shellPost(session.sessionId, `newuser ${username} password`);
  const wardial = await shellPost(session.sessionId, "wardial");
  assert.match(wardial.output.join("\n"), /Badge unlocked: wardialer/);

  await shellPost(session.sessionId, "logout");

  const fresh = await shellPost();
  const login = await shellPost(fresh.sessionId, `login ${username} password`);
  assert.match(login.output.join("\n"), new RegExp(`Welcome to Cyberscape, ${username}`, "i"));

  const badges = await shellPost(fresh.sessionId, "scores /badges");
  assert.match(badges.output.join("\n"), /\[newuser\]/);
  assert.match(badges.output.join("\n"), /\[wardialer\]/);
  assert.match(badges.output.join("\n"), /Disk quota: 128KB/);
  assert.match(badges.output.join("\n"), /System level: 2/);

  const status = await shellPost(fresh.sessionId, "status");
  assert.match(status.output.join("\n"), /disk quota: 128KB/);
  assert.match(status.output.join("\n"), /system level: 2/);

  const finger = await shellPost(fresh.sessionId, `finger ${username}`);
  assert.match(finger.output.join("\n"), /Disk quota: 128KB/);
  assert.match(finger.output.join("\n"), /System level: 2/);
});

test("mail persists across separate API sessions", async () => {
  const senderSession = await shellPost();
  const recipientSession = await shellPost();
  const stamp = Date.now();
  const sender = `sender${stamp}`;
  const recipient = `recipient${stamp}`;

  await shellPost(senderSession.sessionId, `newuser ${sender} password`);
  await shellPost(recipientSession.sessionId, `newuser ${recipient} password`);

  const send = await shellPost(senderSession.sessionId, `send ${recipient} Carrier note: packet arrived`);
  assert.match(send.output.join("\n"), new RegExp(`Sent to ${recipient}`, "i"));

  await shellPost(recipientSession.sessionId, "logout");
  const freshRecipient = await shellPost();
  await shellPost(freshRecipient.sessionId, `login ${recipient} password`);

  const inbox = await shellPost(freshRecipient.sessionId, "inbox");
  assert.match(inbox.output.join("\n"), /Carrier note/);
  assert.match(inbox.output.join("\n"), /packet arrived/);
  assert.match(inbox.output.join("\n"), new RegExp(`from ${sender} to ${recipient}`, "i"));
});

test("users who and finger reflect real accounts and sessions", async () => {
  const first = await shellPost();
  const second = await shellPost();
  const stamp = Date.now();
  const alpha = `alphaid${stamp}`;
  const beta = `betaid${stamp}`;

  await shellPost(first.sessionId, `newuser ${alpha} password`);
  await shellPost(second.sessionId, `newuser ${beta} password`);
  await shellPost(second.sessionId, "ssh relay");

  const usersList = await shellPost(first.sessionId, "users");
  assert.match(usersList.output.join("\n"), new RegExp(alpha));
  assert.match(usersList.output.join("\n"), new RegExp(beta));

  const who = await shellPost(first.sessionId, "who");
  assert.match(who.output.join("\n"), new RegExp(`${alpha}.*tty=`, "i"));
  assert.match(who.output.join("\n"), new RegExp(`${beta}.*host=relay`, "i"));

  const finger = await shellPost(first.sessionId, `finger ${beta}`);
  assert.match(finger.output.join("\n"), new RegExp(`Login: ${beta}`, "i"));
  assert.match(finger.output.join("\n"), /Home host: cyberscape/);
  assert.match(finger.output.join("\n"), /\[newuser\]/);
});

test("relay and talk provide live social channels over active ttys", async () => {
  const first = await shellPost();
  const second = await shellPost();
  const stamp = Date.now();
  const alpha = `relayalpha${stamp}`;
  const beta = `relaybeta${stamp}`;

  await shellPost(first.sessionId, `newuser ${alpha} password`);
  await shellPost(second.sessionId, `newuser ${beta} password`);

  const relayA = await shellPost(first.sessionId, "relay");
  assert.equal(relayA.prompt, "relay>");
  assert.match(relayA.output.join("\n"), /RELAY connected to relay/i);

  const relayB = await shellPost(second.sessionId, "relay");
  assert.equal(relayB.prompt, "relay>");
  const who = await shellPost(second.sessionId, "who");
  assert.match(who.output.join("\n"), new RegExp(alpha, "i"));
  assert.match(who.output.join("\n"), /routebot/);

  const said = await shellPost(first.sessionId, "say packet chorus");
  assert.match(said.output.join("\n"), new RegExp(`\\[#cyberscape\\] <${alpha}> packet chorus`, "i"));
  assert.match(said.output.join("\n"), /delivered to \d+ live listener/i);

  const heard = await shellPost(second.sessionId, "who");
  assert.match(heard.output.join("\n"), new RegExp(`\\[#cyberscape\\] <${alpha}> packet chorus`, "i"));

  const talkB = await shellPost(second.sessionId, `talk ${alpha}`);
  assert.equal(talkB.prompt, "talk>");
  assert.match(talkB.output.join("\n"), new RegExp(`TALK connected to ${alpha}`, "i"));

  const talkA = await shellPost(first.sessionId, `talk ${beta}`);
  assert.equal(talkA.prompt, "talk>");
  assert.match(talkA.output.join("\n"), new RegExp(`TALK connected to ${beta}`, "i"));

  const whisper = await shellPost(first.sessionId, "say direct packet");
  assert.match(whisper.output.join("\n"), new RegExp(`\\[talk ${beta}\\] <${alpha}> direct packet`, "i"));
  assert.match(whisper.output.join("\n"), /Delivered live to tty \d+/);

  const directWho = await shellPost(second.sessionId, "who");
  assert.match(directWho.output.join("\n"), new RegExp(`\\[talk ${beta}\\] <${alpha}> direct packet`, "i"));
  assert.match(directWho.output.join("\n"), new RegExp(`Direct talk with ${alpha}`, "i"));

  const quitTalk = await shellPost(second.sessionId, "quit");
  assert.equal(quitTalk.prompt, "@");
  assert.match(quitTalk.output.join("\n"), /TALK connection closed/i);
});

test("finger @host exposes remote host occupants and plans", async () => {
  const state = initialShellState();

  const hero = await executeLine(state, "finger @bbs");
  const heroText = hero.output.join("\n");
  assert.match(heroText, /\[bbs\] Cyberscape BBS Guild/);
  assert.match(heroText, /Users on bbs:/);
  assert.match(heroText, /sysop\s+Board Sysop\s+tty3/i);
  assert.match(heroText, /Plans:/);
  assert.match(heroText, /sysop: Answer pages, prune duplicate posts, and keep file areas readable\./);
  assert.match(heroText, /Source: simulated host occupants derived from Cyberscape host records\./);

  const imported = hosts.find((host) => !["cyberscape", "phonebook", "bbs", "relay"].includes(host.hostname));
  assert.ok(imported);
  const generated = await executeLine(state, `finger @${imported.hostname}`);
  const generatedText = generated.output.join("\n");
  assert.match(generatedText, new RegExp(`\\[${imported.hostname}\\]`));
  assert.match(generatedText, /Users on .*:/);
  assert.match(generatedText, /Maintaining .* routes and local notes\./);

  const apiSession = await shellPost();
  const api = await shellPost(apiSession.sessionId, "finger @phonebook");
  const apiText = api.output.join("\n");
  assert.match(apiText, /\[phonebook\] Cyberscape Directory Service/);
  assert.match(apiText, /directory\s+Directory Clerk\s+tty1/i);
});

test("netstat shows login and root markers for owned hosts", async () => {
  const username = `mark${Date.now()}`;
  const baseline = netstatForUser(username, [], []);
  const hostLines = baseline.slice(2).filter((line) => line.trim().length);
  assert.ok(hostLines.length >= 2, "expected at least two netstat hosts");
  const loginHost = hostLines[0]!.slice(0, 16).trim();
  const rootHost = hostLines[1]!.slice(0, 16).trim();
  const marked = netstatForUser(username, [loginHost], [rootHost]);
  assert.ok(marked.some((line) => line.includes(loginHost) && line.includes("* ")));
  assert.ok(marked.some((line) => line.includes(rootHost) && line.includes("! ")));

  const state = initialShellState();
  state.loggedIn = true;
  state.username = username;
  state.shellMode = "shell";
  state.loginHosts = [loginHost];
  state.rootHosts = [rootHost];
  const shellMarked = await executeLine(state, "netstat");
  const shellText = shellMarked.output.join("\n");
  assert.match(shellText, new RegExp(`${loginHost}.*\\* `));
  assert.match(shellText, new RegExp(`${rootHost}.*! `));

});

test("scores show durable operator, host, and message boards", async () => {
  const session = await shellPost();
  const username = `score${Date.now()}`;

  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "porthack phonebook");
  const confirm = await shellPost(session.sessionId, "YES");
  assert.match(confirm.output.join("\n"), /CAPTCHA accepted/);
  await downloadBbsRootkit(session.sessionId);
  await shellPost(session.sessionId, "rootkit phonebook");
  await shellPost(session.sessionId, `send ${username} Score note: packets counted`);
  await shellPost(session.sessionId, "basic");
  await shellPost(session.sessionId, "load lunar.bas");
  await shellPost(session.sessionId, "save scorecopy.bas");
  await shellPost(session.sessionId, "quit");
  await shellPost(session.sessionId, "save scorepoint");

  const top = await shellPost(session.sessionId, "scores");
  assert.match(top.output.join("\n"), new RegExp(`${username}.*score=.*badges=.*level=4.*quota=160KB.*roots=1.*logins=1.*mail=2.*basic=1.*files=2.*saves=1`, "i"));

  const hostsBoard = await shellPost(session.sessionId, "scores /hosts");
  assert.match(hostsBoard.output.join("\n"), new RegExp(`phonebook.*root=${username}.*logins=.*${username}`, "i"));

  const rootsBoard = await shellPost(session.sessionId, "scores /roots");
  assert.match(rootsBoard.output.join("\n"), new RegExp(`phonebook.*root=${username}`, "i"));

  const mailBoard = await shellPost(session.sessionId, "scores /mail");
  assert.match(mailBoard.output.join("\n"), new RegExp(`${username}.*sent=1 received=1`, "i"));

  const badges = await shellPost(session.sessionId, "scores /badges");
  assert.match(badges.output.join("\n"), /\[hacker\]/);
  assert.match(badges.output.join("\n"), /\[rootkit\]/);
});

test("hero hosts are injected into the legacy graph", () => {
  const heroNames = ["cyberscape", "phonebook", "bbs", "qotd", "zcode", "mirror", "sysop"];
  for (const name of heroNames) {
    assert.ok(getHost(name), `${name} should exist`);
  }

  const phonebook = getHost("phonebook");
  const cyberscape = getHost("cyberscape");
  const bbs = getHost("bbs");
  const games = getHost("games");
  assert.ok(cyberscape?.neighbors.includes("phonebook"));
  assert.ok(phonebook?.neighbors.includes("bbs"));
  assert.ok(bbs?.bbs_config);
  assert.ok(phonebook?.files?.["netstat.txt"]);
  assert.ok(games?.files?.["zork.gam"]);
});

test("telnet to a BBS host drops into the BBS prompt", async () => {
  const state = initialShellState();
  const bbsHost = hosts.find((host) => Boolean(host.bbs_config));
  assert.ok(bbsHost);
  const username = `tester-${Date.now()}`;

  const login = await executeLine(state, `newuser ${username} password`);
  assert.match(login.output.join("\n"), new RegExp(`Welcome, ${username}`, "i"));

  const telnet = await executeLine(state, `telnet ${bbsHost!.hostname}`);
  assert.match(telnet.output.join("\n"), new RegExp(`${bbsHost!.hostname.toUpperCase()} BBS`));
  assert.equal(prompt(state), "-");

  const menu = await executeLine(state, "GUEST");
  assert.match(menu.output.join("\n"), /Commands: \?, R, P, F, L, W, J, S, Y, X, Q/);
  assert.equal(prompt(state), "-");

  const exit = await executeLine(state, "Q");
  assert.match(exit.output.join("\n"), /Thank you for calling/);
  assert.equal(prompt(state), `${bbsHost!.hostname}>`);
});

test("bbs file transfer surfaces archive assignments", async () => {
  const state = initialShellState();
  const bbsHost = hosts.find((host) => Boolean(host.bbs_config));
  assert.ok(bbsHost);
  const username = `archive-${Date.now()}`;

  await executeLine(state, `newuser ${username} password`);
  await executeLine(state, `telnet ${bbsHost!.hostname}`);
  await executeLine(state, "GUEST");

  const files = await executeLine(state, "F");
  assert.match(files.output.join("\n"), /archive-manifest/i);
  assert.match(files.output.join("\n"), /textfiles-bbs-index/i);

  const listing = files.output.join("\n");
  const rootkitIndex = listing.match(/^\[(\d+)\].*ROOTKIT\.EXE\s+\d+$/im)?.[1];
  const unixkitIndex = listing.match(/^\[(\d+)\].*UNIXKIT\.EXE\s+\d+$/im)?.[1];
  assert.ok(rootkitIndex, "expected ROOTKIT.EXE in the BBS file listing");
  assert.ok(unixkitIndex, "expected UNIXKIT.EXE in the BBS file listing");

  const download = await executeLine(state, rootkitIndex!);
  assert.match(download.output.join("\n"), /Downloading ROOTKIT\.EXE/i);
  assert.ok(state.downloads["ROOTKIT.EXE"]);
  await executeLine(state, "F");
  const supportDownload = await executeLine(state, unixkitIndex!);
  assert.match(supportDownload.output.join("\n"), /Downloading UNIXKIT\.EXE/i);
  assert.ok(state.downloads["UNIXKIT.EXE"]);
});

test("bbs message base supports reading and posting", async () => {
  const state = initialShellState();
  const bbsHost = hosts.find((host) => Boolean(host.bbs_config));
  assert.ok(bbsHost);
  const username = `poster-${Date.now()}`;

  await executeLine(state, `newuser ${username} password`);
  await executeLine(state, `telnet ${bbsHost!.hostname}`);
  await executeLine(state, username);

  const readSeed = await executeLine(state, "R");
  assert.match(readSeed.output.join("\n"), /Message base:/);
  assert.match(readSeed.output.join("\n"), /Welcome to the dialup board/);
  if (state.pager) await executeLine(state, "q");

  const post = await executeLine(state, "P");
  assert.match(post.output.join("\n"), /Enter subject/);
  assert.equal(state.bbsSubmode, "post-subject");

  const subject = await executeLine(state, "Carrier report");
  assert.match(subject.output.join("\n"), /Enter message body/);
  assert.equal(state.bbsSubmode, "post-body");

  const body = await executeLine(state, "The line is clean at 2400 baud.");
  assert.match(body.output.join("\n"), /Message posted/);
  assert.equal(state.bbsSubmode, null);

  const readPosted = await executeLine(state, "R");
  assert.match(readPosted.output.join("\n"), /Carrier report/);
  assert.match(readPosted.output.join("\n"), /clean at 2400 baud/);
  if (state.pager) await executeLine(state, "q");

  const who = await executeLine(state, "W");
  assert.match(who.output.join("\n"), new RegExp(`${username}.*posts=1`, "i"));
});

test("bbs X exits back to the connected host", async () => {
  const state = initialShellState();
  const bbsHost = hosts.find((host) => Boolean(host.bbs_config));
  assert.ok(bbsHost);
  await executeLine(state, `newuser bbsx-${Date.now()} password`);

  await executeLine(state, `telnet ${bbsHost!.hostname}`);
  await executeLine(state, "GUEST");
  assert.equal(state.bbsMode, true);

  const exit = await executeLine(state, "X");
  assert.match(exit.output.join("\n"), /Connection closed/);
  assert.equal(prompt(state), `${bbsHost!.hostname}>`);
});

test("call -151 enters and exits the low-level monitor", async () => {
  const state = initialShellState();
  await executeLine(state, `newuser monitor-${Date.now()} password`);

  const enter = await executeLine(state, "call -151");
  assert.match(enter.output.join("\n"), /Entering 6502 monitor/);
  assert.equal(prompt(state), "*");

  const regs = await executeLine(state, "r");
  assert.match(regs.output.join("\n"), /A=00 X=01 Y=00 P=24 SP=FF/);

  const exit = await executeLine(state, "g");
  assert.match(exit.output.join("\n"), /Returning to the shell/);
  assert.equal(prompt(state), "@");
});

test("basic interpreter supports catalog, load, run, save, delete, and quit", async () => {
  const state = initialShellState();
  await executeLine(state, `newuser basic-${Date.now()} password`);

  const enter = await executeLine(state, "basic");
  assert.match(enter.output.join("\n"), /Dartmouth DTSS TeleBASIC/);
  assert.equal(prompt(state), ">");

  const help = await executeLine(state, "?");
  assert.match(help.output.join("\n"), /delete\s+dir\s+help/);

  const dir = await executeLine(state, "dir");
  assert.match(dir.output.join("\n"), /aceyducey\.bas/);

  const load = await executeLine(state, "load lunar.bas");
  assert.match(load.output.join("\n"), /Loaded lunar\.bas/i);

  const list = await executeLine(state, "list");
  assert.match(list.output.join("\n"), /LUNAR LANDER/);

  const run = await executeLine(state, "run");
  assert.match(run.output.join("\n"), /Running lunar\.bas/);
  assert.match(run.output.join("\n"), /READY/);

  const save = await executeLine(state, "save mymoon.bas");
  assert.match(save.output.join("\n"), /Saved mymoon\.bas/i);

  const del = await executeLine(state, "delete mymoon.bas");
  assert.match(del.output.join("\n"), /Deleted mymoon\.bas/i);

  const quit = await executeLine(state, "quit");
  assert.match(quit.output.join("\n"), /Exit TeleBASIC/);
  assert.equal(prompt(state), "@");
});

test("usenet reader supports groups, list, read, search, and quit", async () => {
  const state = initialShellState();
  await executeLine(state, `newuser usenet-${Date.now()} password`);

  const enter = await executeLine(state, "usenet");
  assert.match(enter.output.join("\n"), /USENET archive reader/);
  assert.equal(prompt(state), "news>");

  const groups = await executeLine(state, "groups");
  assert.match(groups.output.join("\n"), /comp\.misc/);

  const group = await executeLine(state, "group rec.games.int-fiction");
  assert.match(group.output.join("\n"), /z-machine shelves/i);

  const list = await executeLine(state, "list");
  assert.match(list.output.join("\n"), /Articles in rec\.games\.int-fiction/);

  const read = await executeLine(state, "read 3");
  assert.match(read.output.join("\n"), /Subject: z-machine shelves/i);
  assert.match(read.output.join("\n"), /white house/i);

  const search = await executeLine(state, "search mailbox");
  assert.match(search.output.join("\n"), /rec\.games\.int-fiction/);

  const quit = await executeLine(state, "quit");
  assert.match(quit.output.join("\n"), /Leaving USENET/);
  assert.equal(prompt(state), "@");
});

test("usenet posts persist and can be searched and read across API sessions", async () => {
  const session = await shellPost();
  const stamp = Date.now();
  const username = `news${stamp}`;
  const subject = `packet garden ${stamp}`;

  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "usenet");
  await shellPost(session.sessionId, "group comp.misc");
  const post = await shellPost(session.sessionId, "post");
  assert.match(post.output.join("\n"), /Enter subject/);

  const subjectPrompt = await shellPost(session.sessionId, subject);
  assert.match(subjectPrompt.output.join("\n"), /Enter article body/);

  const body = await shellPost(session.sessionId, "This durable article crossed the local spool.");
  assert.match(body.output.join("\n"), /Article posted to comp\.misc/);
  await shellPost(session.sessionId, "quit");
  await shellPost(session.sessionId, "logout");

  const fresh = await shellPost();
  await shellPost(fresh.sessionId, `login ${username} password`);
  await shellPost(fresh.sessionId, "usenet");
  const search = await shellPost(fresh.sessionId, `search ${subject}`);
  assert.match(search.output.join("\n"), new RegExp(`comp\\.misc ${subject}`));
  const articleId = search.output.join("\n").match(/^\s*(\d+)\s+comp\.misc/m)?.[1];
  assert.ok(articleId);

  const read = await shellPost(fresh.sessionId, `read ${articleId}`);
  assert.match(read.output.join("\n"), new RegExp(`From: ${username}@cyberscape`, "i"));
  assert.match(read.output.join("\n"), new RegExp(`Subject: ${subject}`, "i"));
  assert.match(read.output.join("\n"), /durable article crossed the local spool/);
  await shellPost(fresh.sessionId, "quit");

  const scores = await shellPost(fresh.sessionId, "scores");
  assert.match(scores.output.join("\n"), new RegExp(`${username}.*news=1`, "i"));
});

test("basic user programs persist across API sessions", async () => {
  const session = await shellPost();
  const username = `dtss${Date.now()}`;

  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "basic");
  await shellPost(session.sessionId, "load lunar.bas");
  const save = await shellPost(session.sessionId, "save orbitcopy.bas");
  assert.match(save.output.join("\n"), /Saved orbitcopy\.bas/i);
  await shellPost(session.sessionId, "quit");
  await shellPost(session.sessionId, "logout");

  const fresh = await shellPost();
  await shellPost(fresh.sessionId, `login ${username} password`);
  await shellPost(fresh.sessionId, "basic");
  const dir = await shellPost(fresh.sessionId, "dir");
  assert.match(dir.output.join("\n"), /orbitcopy\.bas/);

  const load = await shellPost(fresh.sessionId, "load orbitcopy.bas");
  assert.match(load.output.join("\n"), /Loaded orbitcopy\.bas/i);

  const run = await shellPost(fresh.sessionId, "run");
  assert.match(run.output.join("\n"), /Running orbitcopy\.bas/);
  assert.match(run.output.join("\n"), /LUNAR LANDER/);
});

test("save and load restore named shell checkpoints across API sessions", async () => {
  const session = await shellPost();
  const username = `saver${Date.now()}`;

  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(session.sessionId, "ssh relay");
  await shellPost(session.sessionId, "cd /var/log");
  const saved = await shellPost(session.sessionId, "save relayrun");
  assert.match(saved.output.join("\n"), /Session saved.*relayrun/i);
  await shellPost(session.sessionId, "logout");

  const fresh = await shellPost();
  await shellPost(fresh.sessionId, `login ${username} password`);
  const loaded = await shellPost(fresh.sessionId, "load relayrun");
  assert.match(loaded.output.join("\n"), /Session loaded.*relayrun/i);

  const pwd = await shellPost(fresh.sessionId, "pwd");
  assert.equal(pwd.prompt, "relay>");
  assert.equal(pwd.output[0], "/var/log");
});

test("porthack rejects non-adjacent host", () => {
  const state = initialShellState();
  state.loggedIn = true;
  state.userId = 1;
  state.username = "tester";
  state.badges.push("hacker");
  state.homeHost = "3comvax";
  const host = getHost("3comvax");
  assert.ok(host);
  // pick a host that is not a neighbor
  const far = getHost("a3bee2");
  if (far && !host.neighbors.includes(far.hostname)) {
    const out = attemptPorthack(state, far.hostname);
    assert.ok(out.some((l) => l.includes("not adjacent")));
  }
});

test("rootkit seizes a host from a prior operator", () => {
  const host = getHost("3comvax");
  assert.ok(host);
  db.delete(hostState).where(eq(hostState.hostname, host.hostname)).run();

  const first = initialShellState();
  first.loggedIn = true;
  first.userId = 101;
  first.username = "alpha";
  first.downloads["ROOTKIT.EXE"] = "kit";
  first.downloads[supportKitForHost(host)] = "support kit";
  const second = initialShellState();
  second.loggedIn = true;
  second.userId = 202;
  second.username = "beta";
  second.downloads["ROOTKIT.EXE"] = "kit";
  second.downloads[supportKitForHost(host)] = "support kit";

  const firstRoot = attemptRootkit(first, host.hostname);
  assert.ok(firstRoot.some((line) => line.includes("Root granted")));

  const secondRoot = attemptRootkit(second, host.hostname);
  assert.ok(secondRoot.some((line) => line.includes("seized from prior operator")));
});

test("rootkit requires a downloaded payload", () => {
  const state = initialShellState();
  state.loggedIn = true;
  state.userId = 303;
  state.username = "gamma";

  const out = attemptRootkit(state, "phonebook");
  assert.match(out.join("\n"), /rootkit\.exe not loaded/i);
});

test("rootkit requires a target OS support kit", () => {
  const state = initialShellState();
  state.loggedIn = true;
  state.userId = 404;
  state.username = "delta";
  state.downloads["ROOTKIT.EXE"] = "kit";

  const out = attemptRootkit(state, "phonebook");
  assert.match(out.join("\n"), /unixkit\.exe not loaded/i);
  assert.match(out.join("\n"), /Download UNIXKIT\.EXE from a BBS file area/i);
});

test("owned systems show login and root access after porthack and rootkit", async () => {
  const state = initialShellState();
  const username = `owned-${Date.now()}`;
  await executeLine(state, `newuser ${username} password`);

  const login = await executeLine(state, "porthack phonebook");
  assert.match(login.output.join("\n"), /CAPTCHA/i);
  const confirm = await executeLine(state, "YES");
  assert.match(confirm.output.join("\n"), /CAPTCHA accepted/);

  const ownedLogin = await executeLine(state, "owned");
  assert.match(ownedLogin.output.join("\n"), /phonebook\s+login/);

  state.downloads["ROOTKIT.EXE"] = "kit";
  state.downloads["UNIXKIT.EXE"] = "support kit";
  const root = await executeLine(state, "rootkit phonebook");
  assert.match(root.output.join("\n"), /Root granted on phonebook|seized from prior operator/);

  const ownedRoot = await executeLine(state, "owned");
  assert.match(ownedRoot.output.join("\n"), /phonebook\s+root/);

  await executeLine(state, "ssh phonebook");
  const inspect = await executeLine(state, "inspect");
  assert.match(inspect.output.join("\n"), /access: root/);
  assert.match(inspect.output.join("\n"), new RegExp(`root: ${username}`));
});

test("legacy transport verbs connect across the host stack", async () => {
  const state = initialShellState();
  const username = `route-${Date.now()}`;
  await executeLine(state, `newuser ${username} password`);

  const ssh = await executeLine(state, "ssh relay");
  assert.match(ssh.output.join("\n"), /SSH connected to relay/i);
  const remotePwd = await executeLine(state, "pwd");
  assert.equal(remotePwd.output[0], "/");

  const exit = await executeLine(state, "exit");
  assert.match(exit.output.join("\n"), /Connection closed/i);
  const localPwd = await executeLine(state, "pwd");
  assert.equal(localPwd.output[0], `/home/${username}`);

  const rlogin = await executeLine(state, "rlogin mirror");
  assert.match(rlogin.output.join("\n"), /RLOGIN connected to mirror/i);

  const ftp = await executeLine(state, "ftp ftp");
  assert.match(ftp.output.join("\n"), /FTP connected to ftp/i);
  assert.equal(prompt(state), "ftp>");
  await executeLine(state, "quit");

  const gopher = await executeLine(state, "gopher gopher");
  assert.match(gopher.output.join("\n"), /GOPHER connected to gopher/i);
  assert.equal(prompt(state), "gopher>");
  await executeLine(state, "quit");

  const news = await executeLine(state, "news news");
  assert.match(news.output.join("\n"), /NEWS connected to news/i);
  assert.equal(prompt(state), "news>");
  const groups = await executeLine(state, "groups");
  assert.match(groups.output.join("\n"), /rec\.games\.int-fiction/);
  await executeLine(state, "quit");

  const mail = await executeLine(state, "mail mail");
  assert.match(mail.output.join("\n"), /MAIL connected to mail/i);
  assert.equal(prompt(state), "mail>");
  await executeLine(state, "quit");

  const irc = await executeLine(state, "irc irc");
  assert.match(irc.output.join("\n"), /IRC connected to irc/i);
  assert.equal(prompt(state), "irc>");
  const who = await executeLine(state, "who");
  assert.match(who.output.join("\n"), /routebot/);
  const say = await executeLine(state, "say packets online");
  assert.match(say.output.join("\n"), /<routebot> packet echoed through irc/i);
  await executeLine(state, "quit");

  const shelf = await executeLine(state, "game");
  assert.match(shelf.output.join("\n"), /Z-Code shelf/);
  const game = await executeLine(state, "game zork.gam");
  assert.match(game.output.join("\n"), /Running zork\.gam/i);
  assert.equal(prompt(state), ">");
});

test("uupath and uumap expose real UUCP routes", async () => {
  const state = initialShellState();
  await executeLine(state, `newuser route-map-${Date.now()} password`);

  const pair = findUucpPair();
  assert.ok(pair, "expected a multi-hop UUCP pair in the host graph");

  const route = hostUupath(pair[0], pair[1]);
  assert.match(route.join("\n"), new RegExp(`^${pair[0]} .* ${pair[1]}$`, "i"));
  assert.equal(route[0]!.split(" -> ").length, pair[2] + 1);
  assert.ok(route[0]!.split(" -> ").length >= 3, "expected a route with at least one intermediate hop");

  const shellRoute = await executeLine(state, `uupath ${pair[0]} ${pair[1]}`);
  assert.deepEqual(shellRoute.output, route);

  const map = await executeLine(state, `uumap ${pair[0]}`);
  assert.match(map.output.join("\n"), new RegExp(`UUCP map for ${pair[0]}`, "i"));
  const host = getHost(pair[0]);
  assert.ok(host?.neighbors.length);
  assert.match(map.output.join("\n"), new RegExp(host!.neighbors[0]!, "i"));
  const neighbor = getHost(host!.neighbors[0]!);
  const secondHop = neighbor?.neighbors.find((name) => name.toLowerCase() !== pair[0].toLowerCase());
  assert.ok(secondHop, "expected a visible second-hop host");
  assert.match(map.output.join("\n"), new RegExp(secondHop!, "i"));
});

test("ftp retrieves host files into the local shell", async () => {
  const session = await shellPost();
  const username = `ftp${Date.now()}`;

  await shellPost(session.sessionId, `newuser ${username} password`);
  const connect = await shellPost(session.sessionId, "ftp ftp");
  assert.equal(connect.prompt, "ftp>");
  assert.match(connect.output.join("\n"), /anonymous login ok/i);

  const dir = await shellPost(session.sessionId, "dir");
  assert.match(dir.output.join("\n"), /README\.TXT/);

  const get = await shellPost(session.sessionId, "get README.TXT");
  assert.match(get.output.join("\n"), /Transfer complete/);

  const quit = await shellPost(session.sessionId, "quit");
  assert.equal(quit.prompt, "@");

  const ls = await shellPost(session.sessionId, "ls");
  assert.ok(ls.output.includes("README.TXT"));

  const cat = await shellPost(session.sessionId, "cat README.TXT");
  assert.match(cat.output.join("\n"), /ftp public file area/i);
});

test("home files persist and support write append copy move and remove", async () => {
  const session = await shellPost();
  const username = `files${Date.now()}`;

  await shellPost(session.sessionId, `newuser ${username} password`);

  const write = await shellPost(session.sessionId, "write notes.txt signal");
  assert.match(write.output.join("\n"), /Wrote 6 bytes/);

  const append = await shellPost(session.sessionId, "append notes.txt carrier");
  assert.match(append.output.join("\n"), /Appended 7 bytes/);

  const read = await shellPost(session.sessionId, "cat notes.txt");
  assert.match(read.output.join("\n"), /signal\ncarrier/);

  const cp = await shellPost(session.sessionId, "cp notes.txt copy.txt");
  assert.match(cp.output.join("\n"), /Copied .*notes\.txt.*copy\.txt/);

  const mv = await shellPost(session.sessionId, "mv copy.txt archive.txt");
  assert.match(mv.output.join("\n"), /Moved .*copy\.txt.*archive\.txt/);

  const ls = await shellPost(session.sessionId, "ls");
  assert.ok(ls.output.includes("notes.txt"));
  assert.ok(ls.output.includes("archive.txt"));

  await shellPost(session.sessionId, "logout");
  const fresh = await shellPost();
  await shellPost(fresh.sessionId, `login ${username} password`);

  const persisted = await shellPost(fresh.sessionId, "cat archive.txt");
  assert.match(persisted.output.join("\n"), /signal\ncarrier/);

  const rm = await shellPost(fresh.sessionId, "rm archive.txt");
  assert.match(rm.output.join("\n"), /Removed .*archive\.txt/);

  const gone = await shellPost(fresh.sessionId, "cat archive.txt");
  assert.match(gone.output.join("\n"), /archive\.txt: not found/);

  const scores = await shellPost(fresh.sessionId, "scores");
  assert.match(scores.output.join("\n"), new RegExp(`${username}.*files=1`, "i"));
});

test("downloaded files persist across API sessions and count toward scores", async () => {
  const session = await shellPost();
  const username = `download${Date.now()}`;

  await shellPost(session.sessionId, `newuser ${username} password`);
  await downloadBbsRootkit(session.sessionId);
  await shellPost(session.sessionId, "logout");

  const fresh = await shellPost();
  await shellPost(fresh.sessionId, `login ${username} password`);

  const file = await shellPost(fresh.sessionId, "cat ROOTKIT.EXE");
  assert.match(file.output.join("\n"), /Rootkit payload/);

  const scores = await shellPost(fresh.sessionId, "scores");
  assert.match(scores.output.join("\n"), new RegExp(`${username}.*files=1`, "i"));
});

test("gopher exposes a menu and readable selectors", async () => {
  const state = initialShellState();
  const username = `gopher-${Date.now()}`;
  await executeLine(state, `newuser ${username} password`);

  const connect = await executeLine(state, "gopher gopher");
  assert.match(connect.output.join("\n"), /GOPHER connected to gopher/i);
  assert.equal(prompt(state), "gopher>");

  const menu = await executeLine(state, "menu");
  assert.match(menu.output.join("\n"), /gopher menu/i);
  assert.match(menu.output.join("\n"), /README\.TXT|menu\.gph/i);

  const read = await executeLine(state, "read 1");
  assert.match(read.output.join("\n"), /\[/);

  const quit = await executeLine(state, "quit");
  assert.match(quit.output.join("\n"), /GOPHER connection closed/);
  assert.equal(prompt(state), "@");
});

test("mail protocol lists, composes, and reads durable messages", async () => {
  const senderSession = await shellPost();
  const recipientSession = await shellPost();
  const stamp = Date.now();
  const sender = `mailsender${stamp}`;
  const recipient = `mailrcpt${stamp}`;

  await shellPost(senderSession.sessionId, `newuser ${sender} password`);
  await shellPost(recipientSession.sessionId, `newuser ${recipient} password`);

  const connectSender = await shellPost(senderSession.sessionId, "mail mail");
  assert.equal(connectSender.prompt, "mail>");
  assert.match(connectSender.output.join("\n"), /SMTP\/POP spool ready/);

  const compose = await shellPost(
    senderSession.sessionId,
    `compose ${recipient} Protocol note: hello from mail mode`
  );
  assert.match(compose.output.join("\n"), new RegExp(`Sent to ${recipient}`, "i"));
  await shellPost(senderSession.sessionId, "quit");

  const connectRecipient = await shellPost(recipientSession.sessionId, "mail mail");
  assert.equal(connectRecipient.prompt, "mail>");

  const inbox = await shellPost(recipientSession.sessionId, "inbox");
  assert.match(inbox.output.join("\n"), /Protocol note/);
  assert.match(inbox.output.join("\n"), new RegExp(`from ${sender} to ${recipient}`, "i"));

  const read = await shellPost(recipientSession.sessionId, "read 1");
  assert.match(read.output.join("\n"), new RegExp(`From: ${sender}`, "i"));
  assert.match(read.output.join("\n"), /hello from mail mode/);

  const quit = await shellPost(recipientSession.sessionId, "quit");
  assert.equal(quit.prompt, "@");
});

test("ambient shell verbs expose the lived-in state surface", async () => {
  const state = initialShellState();
  const username = `ambient-${Date.now()}`;
  await executeLine(state, `newuser ${username} password`);

  const alias = await executeLine(state, "alias");
  const ver = await executeLine(state, "ver");
  const history = await executeLine(state, "history");
  const today = await executeLine(state, "today");
  const who = await executeLine(state, "who");
  const qotd = await executeLine(state, "qotd");
  const games = await executeLine(state, "games");
  const zcode = await executeLine(state, "run zork.gam");
  const quitGame = await executeLine(state, "quit");
  const status = await executeLine(state, "status");
  const whoami = await executeLine(state, "whoami");
  const motd = await executeLine(state, "motd");
  const inventory = await executeLine(state, "inventory");
  const hop = await executeLine(state, "ssh relay");
  const look = await executeLine(state, "look");
  const scan = await executeLine(state, "scan");
  const inspect = await executeLine(state, "inspect");
  const grep = await executeLine(state, "grep relay");
  const find = await executeLine(state, "find relay");
  const trace = await executeLine(state, "trace relay");
  const traceroute = await executeLine(state, "traceroute relay");
  const solveHint = await executeLine(state, "solve");
  const solve = await executeLine(state, "solve moon");
  const save = await executeLine(state, "save");
  const load = await executeLine(state, "load");
  const logout = await executeLine(state, "logout");

  assert.match(alias.output.join("\n"), /home host/i);
  assert.match(ver.output.join("\n"), /Cyberscape/i);
  assert.match(history.output.join("\n"), /2000/);
  assert.match(today.output.join("\n"), /Today:/);
  assert.match(who.output.join("\n"), /Active operators/);
  assert.match(qotd.output.join("\n"), /QOTD/);
  assert.match(games.output.join("\n"), /Z-Code shelf/);
  assert.match(zcode.output.join("\n"), /Running zork\.gam/i);
  assert.match(quitGame.output.join("\n"), /Leaving the game/i);
  assert.match(status.output.join("\n"), /mode:/);
  assert.match(whoami.output.join("\n"), /Operator:/);
  assert.match(motd.output.join("\n"), /Welcome to/);
  assert.match(inventory.output.join("\n"), /newuser/);
  assert.match(hop.output.join("\n"), /SSH connected to relay/i);
  assert.match(look.output.join("\n"), /remote depth:/);
  assert.match(scan.output.join("\n"), /BBS|No BBS/);
  assert.match(inspect.output.join("\n"), /ports:/);
  assert.match(grep.output.join("\n"), /relay matched/i);
  assert.match(find.output.join("\n"), /Search Companion matching "relay"/i);
  assert.match(trace.output.join("\n"), /Route to Relay/);
  assert.match(trace.output.join("\n"), /Trace complete:/);
  assert.match(traceroute.output.join("\n"), /Route to Relay/);
  assert.match(solveHint.output.join("\n"), /Usage: solve <clue>/);
  assert.match(solve.output.join("\n"), /hidden layer opens/i);
  assert.ok(state.badges.includes("solver"));
  assert.match(save.output.join("\n"), /Session saved/);
  assert.match(load.output.join("\n"), /Session loaded/);
  assert.match(logout.output.join("\n"), /Logged out/i);
  assert.equal(prompt(logout.state), ".");
});

test("trace renders the actual multi-hop route from the current host", async () => {
  const state = initialShellState();
  const username = `trace-${Date.now()}`;
  await executeLine(state, `newuser ${username} password`);
  const route = findUucpRouteFrom(currentHost(state), 2);
  assert.ok(route, "expected at least one multi-hop route from the current host");

  const target = route!.at(-1)!;
  const result = await executeLine(state, `trace ${target}`);

  assert.match(result.output.join("\n"), new RegExp(`Route to ${target.charAt(0).toUpperCase()}${target.slice(1)}:`));
  assert.match(result.output.join("\n"), /Trace complete: \d+ hops\./);
  assert.ok(result.output.some((line) => line.trimStart().startsWith("1  ")));
  assert.ok(result.output.some((line) => line.includes(`${route!.length - 1} hops`)));
});

test("set key stores and reloads ssh public key fingerprint", async () => {
  const state = initialShellState();
  const username = `sshkey-${Date.now()}`;
  const sshKey = `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI${Date.now().toString(36)} ${username}@laptop`;
  const fingerprint = createHash("sha256").update(sshKey).digest("hex").slice(0, 16);

  await executeLine(state, `newuser ${username} password`);
  const set = await executeLine(state, `set key ${sshKey}`);
  assert.match(set.output.join("\n"), /SSH key stored/i);

  const whoami = await executeLine(state, "whoami");
  assert.match(whoami.output.join("\n"), new RegExp(fingerprint, "i"));

  const logout = await executeLine(state, "logout");
  assert.match(logout.output.join("\n"), /Logged out/i);

  const login = await executeLine(state, `login ${username} password`);
  assert.match(login.output.join("\n"), /Welcome to Cyberscape/i);

  const reloaded = await executeLine(state, "whoami");
  assert.match(reloaded.output.join("\n"), new RegExp(fingerprint, "i"));
});

test("link mirrors persisted shell sessions through the API", async () => {
  const watcher = await shellPost();
  const source = await shellPost();
  const stamp = Date.now();
  const watcherName = `watcher${stamp}`;
  const sourceName = `source${stamp}`;

  await shellPost(watcher.sessionId, `newuser ${watcherName} password`);
  await shellPost(source.sessionId, `newuser ${sourceName} password`);

  const help = await shellPost(watcher.sessionId, "?");
  assert.match(help.output.join("\n"), /\blink\b/);

  const link = await shellPost(watcher.sessionId, `link ${sourceName}`);
  assert.match(link.output.join("\n"), /Linked to/);

  const targetNotice = await shellPost(source.sessionId);
  assert.match(targetNotice.output.join("\n"), /%link from port/);

  await shellPost(source.sessionId, "echo carrier wave");
  const mirrored = await shellPost(watcher.sessionId);
  assert.match(mirrored.output.join("\n"), /%link from port/);
  assert.match(mirrored.output.join("\n"), /carrier wave/);

  const unlink = await shellPost(watcher.sessionId, "unlink");
  assert.match(unlink.output.join("\n"), /closed/);

  await shellPost(source.sessionId, "echo silent carrier");
  const quiet = await shellPost(watcher.sessionId);
  assert.deepEqual(quiet.output, []);
});

test("camp and tunnel create visible multiplayer route state", async () => {
  const scoutSession = await shellPost();
  const observerSession = await shellPost();
  const stamp = Date.now();
  const scout = `scout${stamp}`;
  const observer = `observer${stamp}`;

  await shellPost(scoutSession.sessionId, `newuser ${scout} password`);
  await shellPost(observerSession.sessionId, `newuser ${observer} password`);

  const camp = await shellPost(scoutSession.sessionId, "camp");
  assert.match(camp.output.join("\n"), /Camp set on cyberscape/);

  await shellPost(scoutSession.sessionId, "ssh relay");
  const tunnel = await shellPost(scoutSession.sessionId, "tunnel apcihq");
  assert.match(tunnel.output.join("\n"), /tunnel established: relay->apcihq/i);

  const status = await shellPost(scoutSession.sessionId, "status");
  assert.match(status.output.join("\n"), /camp: cyberscape/);
  assert.match(status.output.join("\n"), /tunnel: relay->apcihq/);

  const who = await shellPost(observerSession.sessionId, "who");
  assert.match(who.output.join("\n"), new RegExp(`${scout}.*host=relay.*camp=cyberscape.*tunnel=relay->apcihq`, "i"));

  const inspectCamp = await shellPost(observerSession.sessionId, "inspect");
  assert.match(inspectCamp.output.join("\n"), new RegExp(`campers: .*${scout}`, "i"));

  await shellPost(observerSession.sessionId, "ssh relay");
  const inspectTunnel = await shellPost(observerSession.sessionId, "inspect");
  assert.match(inspectTunnel.output.join("\n"), new RegExp(`tunnels: .*${scout}:relay->apcihq`, "i"));

  const campOff = await shellPost(scoutSession.sessionId, "camp /off");
  assert.match(campOff.output.join("\n"), /Camp cleared from cyberscape/);
  const tunnelOff = await shellPost(scoutSession.sessionId, "tunnel /off");
  assert.match(tunnelOff.output.join("\n"), /Tunnel relay->apcihq collapsed/);
});

test("tunnel rejects indirect routes and enforces cooldown", async () => {
  const state = initialShellState();
  const username = `tunnelist-${Date.now()}`;
  await executeLine(state, `newuser ${username} password`);

  const mirrorAttempt = await executeLine(state, "tunnel mirror");
  assert.match(mirrorAttempt.output.join("\n"), /Tunnel rejected: direct path required/);

  await executeLine(state, "ssh relay");
  await executeLine(state, "tunnel apcihq");
  state.tunnelCooldownUntil = Date.now() + 18_000;
  const cooldown = await executeLine(state, "tunnel apcipdx");
  assert.match(cooldown.output.join("\n"), /Tunnel unavailable: wait/);
});

test("who and inspect hide stale route state from old snapshots", async () => {
  const scoutSession = await shellPost();
  const observerSession = await shellPost();
  const stamp = Date.now();
  const scout = `snapshot-scout-${stamp}`;

  await shellPost(scoutSession.sessionId, `newuser ${scout} password`);
  await shellPost(observerSession.sessionId, `newuser observer${stamp} password`);

  await shellPost(scoutSession.sessionId, "camp");
  await shellPost(scoutSession.sessionId, "ssh relay");
  await shellPost(scoutSession.sessionId, "tunnel apcihq");

  const row = db.select().from(shellSessions).where(eq(shellSessions.id, scoutSession.sessionId)).get();
  assert.ok(row);
  assert.ok(row?.state.tunnel && typeof row.state.tunnel === "object");
  db.update(shellSessions)
    .set({
      state: {
        ...(row!.state as Record<string, unknown>),
        campSince: Date.now() - 181_000,
        tunnel: {
          ...(row!.state.tunnel as Record<string, unknown>),
          createdAt: Date.now() - 241_000,
        },
      },
    })
    .where(eq(shellSessions.id, scoutSession.sessionId))
    .run();

  const who = await shellPost(observerSession.sessionId, "who");
  assert.match(who.output.join("\n"), new RegExp(`${scout}.*camp=none.*tunnel=none`, "i"));

  const inspect = await shellPost(observerSession.sessionId, "inspect");
  assert.match(inspect.output.join("\n"), /campers: none/i);
  assert.match(inspect.output.join("\n"), /tunnels: none/i);
});

test("ps and kill manage local shell route jobs", async () => {
  const session = await shellPost();
  const peerSession = await shellPost();
  const stamp = Date.now();
  const username = `proc${stamp}`;
  const peer = `peer${stamp}`;

  await shellPost(session.sessionId, `newuser ${username} password`);
  await shellPost(peerSession.sessionId, `newuser ${peer} password`);
  await shellPost(session.sessionId, "camp");
  await shellPost(session.sessionId, "ssh relay");
  await shellPost(session.sessionId, "tunnel apcihq");
  const queued = await shellPost(session.sessionId, "task scan relay nightly sweep");
  assert.equal(queued.desktopTasks?.[0]?.kind, "scan");
  assert.equal(queued.desktopTasks?.[0]?.target, "relay");
  assert.equal(queued.desktopTasks?.[0]?.status, "queued");
  assert.ok(queued.desktopEvents?.some((event) => event.message === "task queued scan relay"));

  const ps = await shellPost(session.sessionId, "ps");
  assert.match(ps.output.join("\n"), /1\s+\d+\s+proc.*relay\s+shell/i);
  assert.match(ps.output.join("\n"), /3\s+\d+\s+proc.*cyberscape\s+camp/i);
  assert.match(ps.output.join("\n"), /4\s+\d+\s+proc.*relay\s+tunnel relay->apcihq/i);
  assert.match(ps.output.join("\n"), /20\s+\d+\s+proc.*relay\s+task scan/);

  const tasksWindow = await shellPost(session.sessionId, "desktop tasks");
  assert.match(tasksWindow.output.join("\n"), /Jobs\s+scan:relay/);

  const tty = await shellPost(session.sessionId, "ps /tty");
  assert.match(tty.output.join("\n"), new RegExp(`${username}.*relay.*shell`, "i"));
  assert.match(tty.output.join("\n"), new RegExp(`${peer}.*cyberscape.*shell`, "i"));

  const killTunnel = await shellPost(session.sessionId, "kill 4");
  assert.match(killTunnel.output.join("\n"), /Tunnel relay->apcihq collapsed/);

  const killCamp = await shellPost(session.sessionId, "kill 3");
  assert.match(killCamp.output.join("\n"), /Camp cleared from cyberscape/);

  const killTask = await shellPost(session.sessionId, "kill 20");
  assert.match(killTask.output.join("\n"), /Task marked done:/);
  assert.equal(killTask.desktopTasks?.[0]?.status, "done");
  assert.ok(killTask.desktopEvents?.some((event) => event.level === "audit" && event.message.startsWith("task done ")));

  const status = await shellPost(session.sessionId, "status");
  assert.match(status.output.join("\n"), /camp: none/);
  assert.match(status.output.join("\n"), /tunnel: none/);
});

test("zork launches a nested adventure and returns to the shell", async () => {
  const state = initialShellState();
  const username = `zork-${Date.now()}`;
  await executeLine(state, `newuser ${username} password`);

  const launch = await executeLine(state, "zork");
  assert.match(launch.output.join("\n"), /open field west of a white house/i);
  assert.equal(prompt(state), ">");

  const look = await executeLine(state, "look");
  assert.match(look.output.join("\n"), /white house/);

  const mailbox = await executeLine(state, "open mailbox");
  assert.match(mailbox.output.join("\n"), /leaflet/i);

  const read = await executeLine(state, "read leaflet");
  assert.match(read.output.join("\n"), /WELCOME TO THE HOUSE OF ZORK/i);

  const take = await executeLine(state, "take lantern");
  assert.match(take.output.join("\n"), /Taken/i);

  const north = await executeLine(state, "north");
  assert.match(north.output.join("\n"), /porch/i);

  const openDoor = await executeLine(state, "open door");
  assert.match(openDoor.output.join("\n"), /house/i);

  const down = await executeLine(state, "down");
  assert.match(down.output.join("\n"), /cellar/i);

  const trophy = await executeLine(state, "take trophy");
  assert.match(trophy.output.join("\n"), /Taken/i);

  const inventory = await executeLine(state, "inventory");
  assert.match(inventory.output.join("\n"), /lantern/);
  assert.match(inventory.output.join("\n"), /trophy/);

  const quit = await executeLine(state, "quit");
  assert.match(quit.output.join("\n"), /Leaving the game/i);
  assert.equal(prompt(state), "@");
});

test("secure and takeover root the current host after a remote hop", async () => {
  const state = initialShellState();
  const username = `secure-${Date.now()}`;
  await executeLine(state, `newuser ${username} password`);

  const hop = await executeLine(state, "ssh relay");
  assert.match(hop.output.join("\n"), /SSH connected to relay/i);
  state.downloads["ROOTKIT.EXE"] = "kit";
  state.downloads["UNIXKIT.EXE"] = "support kit";

  const secure = await executeLine(state, "secure");
  assert.match(secure.output.join("\n"), /Root granted|seized/i);

  const takeover = await executeLine(state, "takeover");
  assert.match(takeover.output.join("\n"), /Root granted|seized/i);
});

test("newuser then login flow", async () => {
  const state = initialShellState();
  const user = `test${Date.now()}`;
  const r1 = await executeLine(state, `newuser ${user} secretpass`);
  assert.ok(r1.output.some((l) => l.includes("Welcome")));
  assert.equal(r1.state.loggedIn, true);
});
