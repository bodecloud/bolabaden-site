import type { PagerState } from "./pager";

export type SttyMode = "normal" | "dumb" | "tty";
export type DesktopTheme = "nt" | "2000" | "xp" | "7";
export type DesktopAppId = "terminal" | "system" | "control" | "accounts" | "credentials" | "datetime" | "display" | "sounds" | "power" | "mouse" | "keyboard" | "accessibility" | "regional" | "modems" | "odbc" | "programs" | "internet" | "firewall" | "updates" | "performance" | "restore" | "computer" | "disk" | "eventviewer" | "search" | "connections" | "netsetup" | "netdiag" | "mapdrive" | "offline" | "remote" | "runbox" | "taskmgr" | "scheduler" | "nodes" | "network" | "dialup" | "lineage" | "devices" | "security" | "services" | "shares" | "printers" | "registry" | "folders" | "files" | "boards" | "mail" | "tasks" | "logs" | "help" | "settings";
export type DesktopWindowAction = "open" | "focus" | "min" | "max" | "restore" | "close";
export type DesktopMotion = "normal" | "reduced";
export type DesktopFontSize = "normal" | "large";
export type DesktopContrast = "normal" | "high";
export type DesktopSound = "muted" | "on";
export type DesktopKeyboardMode = "desktop" | "terminal";
export interface DesktopPrefs {
  motion: DesktopMotion;
  fontSize: DesktopFontSize;
  contrast: DesktopContrast;
  sound: DesktopSound;
  keyboardMode: DesktopKeyboardMode;
}
export interface DesktopWindowPosition {
  x: number;
  y: number;
}
export type DesktopWindowPositions = Partial<Record<DesktopAppId, DesktopWindowPosition>>;
export type DesktopBookmarkKind = "host" | "route";
export interface DesktopBookmark {
  id: string;
  kind: DesktopBookmarkKind;
  target: string;
  label: string;
  route?: string[];
  createdAt: number;
}
export interface CommandHistoryEntry {
  id: number;
  line: string;
  host: string;
  mode: ShellSessionState["shellMode"];
  createdAt: number;
}
export type DesktopTaskKind = "scan" | "transfer" | "maint";
export type DesktopTaskStatus = "queued" | "done";
export interface DesktopTask {
  id: string;
  kind: DesktopTaskKind;
  target: string;
  label: string;
  status: DesktopTaskStatus;
  createdAt: number;
  updatedAt: number;
}
export type DesktopEventLevel = "info" | "warn" | "audit";
export interface DesktopEvent {
  id: number;
  level: DesktopEventLevel;
  source: string;
  message: string;
  host: string;
  createdAt: number;
}
export type DesktopFileKind = "host" | "download" | "home";
export interface DesktopFileEntry {
  id: string;
  kind: DesktopFileKind;
  name: string;
  path: string;
  size: number;
  host: string;
  updatedAt: number;
}
export interface DesktopMailEntry {
  id: string;
  from: string;
  to: string;
  subject: string;
  preview: string;
  createdAt: number;
}
export type DesktopBoardKind = "bbs" | "sysop" | "usenet";
export interface DesktopBoardEntry {
  id: string;
  kind: DesktopBoardKind;
  board: string;
  author: string;
  subject: string;
  preview: string;
  createdAt: number;
}
export type DesktopNetworkAccess = "local" | "root" | "login" | "public";
export interface DesktopNetworkEntry {
  id: string;
  host: string;
  org: string;
  location: string;
  access: DesktopNetworkAccess;
  marker: "" | "*" | "!";
  route: string[];
  ports: number[];
  bbs: boolean;
  bookmarked: boolean;
}
export type DesktopNodeRole = "current" | "home" | "login" | "root";
export interface DesktopNodeEntry {
  id: string;
  host: string;
  org: string;
  location: string;
  role: DesktopNodeRole;
  access: DesktopNetworkAccess;
  route: string[];
  ports: number[];
}
export type DesktopSecurityPosture = "local" | "controlled" | "watched" | "exposed" | "unknown";
export interface DesktopSecurityEntry {
  id: string;
  host: string;
  access: DesktopNetworkAccess;
  owner: string | null;
  posture: DesktopSecurityPosture;
  ports: number[];
  checks: string[];
  actions: string[];
}
export type DesktopServiceStatus = "running" | "reachable" | "restricted";
export interface DesktopServiceEntry {
  id: string;
  host: string;
  port: number;
  name: string;
  status: DesktopServiceStatus;
  access: DesktopNetworkAccess;
  banner: string;
  actions: string[];
}
export type DesktopShareKind = "host" | "home" | "download";
export interface DesktopShareEntry {
  id: string;
  host: string;
  name: string;
  kind: DesktopShareKind;
  access: DesktopNetworkAccess;
  path: string;
  files: number;
  writable: boolean;
  actions: string[];
}
export type DesktopPrintStatus = "ready" | "queued" | "held";
export interface DesktopPrintEntry {
  id: string;
  host: string;
  queue: string;
  status: DesktopPrintStatus;
  document: string;
  source: string;
  pages: number;
  actions: string[];
}
export type DesktopRegistryHive = "HKCU" | "HKLM" | "HKU";
export interface DesktopRegistryEntry {
  id: string;
  hive: DesktopRegistryHive;
  key: string;
  name: string;
  value: string;
  source: string;
  writable: boolean;
  actions: string[];
}
export type DesktopDialupStatus = "connected" | "saved" | "available" | "watched" | "busy" | "no-carrier";
export interface DesktopDialupEntry {
  id: string;
  name: string;
  host: string;
  status: DesktopDialupStatus;
  access: DesktopNetworkAccess;
  route: string[];
  number: string;
  speed: string;
  lineType: string;
  protocol: string;
  notes: string;
  lastSeen: string;
  actions: string[];
}
export type DesktopLineageEra = "pre-dialup" | "dialup" | "packet" | "internet" | "lan";
export interface DesktopLineageEntry {
  id: string;
  era: DesktopLineageEra;
  method: string;
  status: DesktopConnectionStatus;
  host: string;
  path: string;
  speed: string;
  meaning: string;
  actions: string[];
}
export type DesktopRemoteStatus = "connected" | "available" | "credentialed" | "queued" | "blocked";
export interface DesktopRemoteEntry {
  id: string;
  host: string;
  profile: string;
  status: DesktopRemoteStatus;
  access: DesktopNetworkAccess;
  route: string[];
  display: string;
  source: string;
  actions: string[];
}
export type DesktopRunStatus = "ready" | "recent" | "elevated" | "blocked" | "missing";
export interface DesktopRunEntry {
  id: string;
  command: string;
  target: string;
  status: DesktopRunStatus;
  source: string;
  actions: string[];
}
export type DesktopCredentialStatus = "active" | "stored" | "elevated" | "missing" | "revoked";
export interface DesktopCredentialEntry {
  id: string;
  target: string;
  username: string;
  kind: string;
  status: DesktopCredentialStatus;
  source: string;
  actions: string[];
}
export type DesktopDeviceStatus = "ok" | "busy" | "warning" | "offline";
export interface DesktopDeviceEntry {
  id: string;
  host: string;
  category: string;
  name: string;
  status: DesktopDeviceStatus;
  driver: string;
  resource: string;
  actions: string[];
}
export interface DesktopModemEntry {
  id: string;
  tab: string;
  name: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopOdbcEntry {
  id: string;
  tab: string;
  name: string;
  driver: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopSystemEntry {
  id: string;
  group: string;
  name: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopControlEntry {
  id: string;
  category: string;
  applet: string;
  status: string;
  source: string;
  actions: string[];
}
export interface DesktopAccountEntry {
  id: string;
  scope: string;
  name: string;
  value: string;
  source: string;
  actions: string[];
}
export interface TollCallEntry {
  id: number;
  host: string;
  number: string;
  route: string[];
  hops: number;
  openedAt: number;
  operator: string;
}
export interface AcousticCouplerState {
  host: string;
  number: string;
  speed: "110 baud" | "300 baud";
  attachedAt: number;
}
export interface SwitchboardRouteState {
  host: string;
  number: string;
  route: string[];
  exchange: string;
  cord: string;
  ringCode: string;
  openedAt: number;
}
export interface PacketCircuitState {
  host: string;
  switchHost: string;
  address: string;
  speed: string;
  createdAt: number;
}
export interface DesktopTimeEntry {
  id: string;
  tab: string;
  name: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopDisplayEntry {
  id: string;
  tab: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopSoundEntry {
  id: string;
  tab: string;
  item: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopPowerEntry {
  id: string;
  scheme: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopMouseEntry {
  id: string;
  tab: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopKeyboardEntry {
  id: string;
  tab: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopAccessibilityEntry {
  id: string;
  tab: string;
  option: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopRegionalEntry {
  id: string;
  tab: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
}
export type DesktopProgramStatus = "installed" | "available" | "downloaded" | "queued";
export interface DesktopProgramEntry {
  id: string;
  category: string;
  name: string;
  version: string;
  status: DesktopProgramStatus;
  source: string;
  actions: string[];
}
export interface DesktopInternetEntry {
  id: string;
  tab: string;
  zone: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopFirewallEntry {
  id: string;
  tab: string;
  name: string;
  profile: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopUpdateEntry {
  id: string;
  tab: string;
  name: string;
  channel: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopPerformanceEntry {
  id: string;
  object: string;
  counter: string;
  instance: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopRestoreEntry {
  id: string;
  tab: string;
  name: string;
  status: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopComputerEntry {
  id: string;
  tree: string;
  node: string;
  status: string;
  value: string;
  source: string;
  actions: string[];
}
export interface DesktopDiskEntry {
  id: string;
  disk: string;
  volume: string;
  status: string;
  capacity: string;
  used: string;
  source: string;
  actions: string[];
}
export interface DesktopEventViewerEntry {
  id: string;
  log: string;
  level: DesktopEventLevel;
  source: string;
  eventId: number;
  message: string;
  host: string;
  actions: string[];
}
export interface DesktopSearchEntry {
  id: string;
  scope: string;
  name: string;
  location: string;
  summary: string;
  source: string;
  actions: string[];
}
export type DesktopConnectionStatus = "connected" | "enabled" | "limited" | "firewalled" | "queued" | "disabled";
export interface DesktopConnectionEntry {
  id: string;
  name: string;
  type: string;
  status: DesktopConnectionStatus;
  device: string;
  host: string;
  speed: string;
  source: string;
  actions: string[];
}
export interface DesktopNetSetupEntry {
  id: string;
  stage: string;
  item: string;
  status: string;
  source: string;
  actions: string[];
}
export type DesktopNetDiagnosticResult = "pass" | "warn" | "fail" | "info";
export interface DesktopNetDiagnosticEntry {
  id: string;
  test: string;
  target: string;
  result: DesktopNetDiagnosticResult;
  detail: string;
  source: string;
  actions: string[];
}
export interface DesktopMappedDriveEntry {
  id: string;
  drive: string;
  remote: string;
  status: string;
  capacity: string;
  source: string;
  actions: string[];
}
export interface DesktopOfflineEntry {
  id: string;
  location: string;
  item: string;
  status: string;
  size: string;
  source: string;
  actions: string[];
}
export interface DesktopHelpEntry {
  id: string;
  section: string;
  topic: string;
  status: string;
  source: string;
  actions: string[];
}
export interface DesktopFolderEntry {
  id: string;
  tab: string;
  option: string;
  value: string;
  source: string;
  actions: string[];
}
export type DesktopProcessStatus = "running" | "linked" | "watching" | "queued" | "foreground";
export interface DesktopProcessEntry {
  id: string;
  pid: number;
  tty: string;
  user: string;
  host: string;
  command: string;
  status: DesktopProcessStatus;
  source: string;
  actions: string[];
}
export type DesktopScheduleStatus = "ready" | "queued" | "running" | "disabled";
export interface DesktopScheduleEntry {
  id: string;
  name: string;
  trigger: string;
  target: string;
  status: DesktopScheduleStatus;
  lastRun: string;
  nextRun: string;
  source: string;
  actions: string[];
}

export function isDesktopTheme(value: unknown): value is DesktopTheme {
  return value === "nt" || value === "2000" || value === "xp" || value === "7";
}

export function isDesktopAppId(value: unknown): value is DesktopAppId {
  return value === "terminal" || value === "system" || value === "control" || value === "accounts" || value === "credentials" || value === "datetime" || value === "display" || value === "sounds" || value === "power" || value === "mouse" || value === "keyboard" || value === "accessibility" || value === "regional" || value === "modems" || value === "odbc" || value === "programs" || value === "internet" || value === "firewall" || value === "updates" || value === "performance" || value === "restore" || value === "computer" || value === "disk" || value === "eventviewer" || value === "search" || value === "connections" || value === "netsetup" || value === "netdiag" || value === "mapdrive" || value === "offline" || value === "remote" || value === "runbox" || value === "taskmgr" || value === "scheduler" || value === "nodes" || value === "network" || value === "dialup" || value === "lineage" || value === "devices" || value === "security" || value === "services" || value === "shares" || value === "printers" || value === "registry" || value === "folders" || value === "files" ||
    value === "boards" || value === "mail" || value === "tasks" || value === "logs" ||
    value === "help" || value === "settings";
}

export function normalizeDesktopPrefs(value: unknown): DesktopPrefs {
  const raw = value && typeof value === "object" ? value as Partial<Record<keyof DesktopPrefs, unknown>> : {};
  return {
    motion: raw.motion === "reduced" ? "reduced" : "normal",
    fontSize: raw.fontSize === "large" ? "large" : "normal",
    contrast: raw.contrast === "high" ? "high" : "normal",
    sound: raw.sound === "on" ? "on" : "muted",
    keyboardMode: raw.keyboardMode === "terminal" ? "terminal" : "desktop",
  };
}

export function setDesktopPref(state: Pick<ShellSessionState, "desktopPrefs">, key: string, value: string): boolean {
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  if (key === "motion" && (value === "normal" || value === "reduced")) {
    state.desktopPrefs.motion = value;
    return true;
  }
  if ((key === "font" || key === "fontSize") && (value === "normal" || value === "large")) {
    state.desktopPrefs.fontSize = value;
    return true;
  }
  if (key === "contrast" && (value === "normal" || value === "high")) {
    state.desktopPrefs.contrast = value;
    return true;
  }
  if (key === "sound" && (value === "muted" || value === "on")) {
    state.desktopPrefs.sound = value;
    return true;
  }
  if ((key === "keyboard" || key === "keyboardMode") && (value === "desktop" || value === "terminal")) {
    state.desktopPrefs.keyboardMode = value;
    return true;
  }
  return false;
}

export function normalizeDesktopAppList(value: unknown, fallback: DesktopAppId[] = ["terminal"]): DesktopAppId[] {
  const source = Array.isArray(value) ? value : fallback;
  const next: DesktopAppId[] = [];
  for (const item of source) {
    if (isDesktopAppId(item) && !next.includes(item)) next.push(item);
  }
  if (!next.includes("terminal")) next.unshift("terminal");
  return next.slice(0, 22);
}

export function normalizeDesktopWindowPosition(value: unknown): DesktopWindowPosition | null {
  if (!value || typeof value !== "object") return null;
  const maybePosition = value as { x?: unknown; y?: unknown };
  const x = typeof maybePosition.x === "number" && Number.isFinite(maybePosition.x)
    ? Math.max(0, Math.min(640, Math.round(maybePosition.x)))
    : null;
  const y = typeof maybePosition.y === "number" && Number.isFinite(maybePosition.y)
    ? Math.max(0, Math.min(420, Math.round(maybePosition.y)))
    : null;
  return x === null || y === null ? null : { x, y };
}

export function normalizeDesktopWindowPositions(value: unknown): DesktopWindowPositions {
  if (!value || typeof value !== "object") return {};
  const next: DesktopWindowPositions = {};
  for (const [key, rawPosition] of Object.entries(value as Record<string, unknown>)) {
    if (!isDesktopAppId(key)) continue;
    const position = normalizeDesktopWindowPosition(rawPosition);
    if (position) next[key] = position;
  }
  return next;
}

function normalizeBookmarkText(value: unknown, fallback: string): string {
  const text = typeof value === "string" ? value.trim() : "";
  const clipped = (text || fallback).replace(/\s+/g, " ").slice(0, 80);
  return clipped || fallback;
}

export function normalizeDesktopBookmarks(value: unknown): DesktopBookmark[] {
  if (!Array.isArray(value)) return [];
  const next: DesktopBookmark[] = [];
  for (const [index, item] of value.entries()) {
    if (!item || typeof item !== "object") continue;
    const raw = item as Partial<Record<keyof DesktopBookmark, unknown>>;
    const kind = raw.kind === "route" ? "route" : raw.kind === "host" ? "host" : null;
    const target = normalizeBookmarkText(raw.target, "");
    if (!kind || !target) continue;
    const id = normalizeBookmarkText(raw.id, `b${index + 1}`).replace(/[^a-z0-9_-]/gi, "").slice(0, 24) || `b${index + 1}`;
    const label = normalizeBookmarkText(raw.label, target);
    const route = Array.isArray(raw.route)
      ? raw.route.filter((hop): hop is string => typeof hop === "string" && hop.length > 0).slice(0, 16)
      : undefined;
    const createdAt = typeof raw.createdAt === "number" && Number.isFinite(raw.createdAt) ? Math.max(0, Math.round(raw.createdAt)) : 0;
    if (!next.some((bookmark) => bookmark.id === id)) {
      next.push({ id, kind, target, label, route, createdAt });
    }
  }
  return next.slice(0, 24);
}

export function normalizeCommandHistory(value: unknown): CommandHistoryEntry[] {
  if (!Array.isArray(value)) return [];
  const next: CommandHistoryEntry[] = [];
  for (const [index, item] of value.entries()) {
    if (!item || typeof item !== "object") continue;
    const raw = item as Partial<Record<keyof CommandHistoryEntry, unknown>>;
    const line = typeof raw.line === "string" ? raw.line.trim().slice(0, 160) : "";
    if (!line) continue;
    const mode = typeof raw.mode === "string" ? raw.mode as CommandHistoryEntry["mode"] : "shell";
    const id = typeof raw.id === "number" && Number.isFinite(raw.id) ? Math.max(1, Math.round(raw.id)) : index + 1;
    const host = typeof raw.host === "string" && raw.host.trim() ? raw.host.trim().slice(0, 80) : "cyberscape";
    const createdAt = typeof raw.createdAt === "number" && Number.isFinite(raw.createdAt) ? Math.max(0, Math.round(raw.createdAt)) : 0;
    next.push({ id, line, host, mode, createdAt });
  }
  return next.slice(-50);
}

export function normalizeDesktopTasks(value: unknown): DesktopTask[] {
  if (!Array.isArray(value)) return [];
  const next: DesktopTask[] = [];
  for (const [index, item] of value.entries()) {
    if (!item || typeof item !== "object") continue;
    const raw = item as Partial<Record<keyof DesktopTask, unknown>>;
    const kind = raw.kind === "transfer" ? "transfer" : raw.kind === "maint" ? "maint" : raw.kind === "scan" ? "scan" : null;
    const target = typeof raw.target === "string" ? raw.target.trim().replace(/\s+/g, " ").slice(0, 80) : "";
    if (!kind || !target) continue;
    const id = typeof raw.id === "string" && raw.id.trim()
      ? raw.id.trim().replace(/[^a-z0-9_-]/gi, "").slice(0, 24)
      : `t${index + 1}`;
    const label = typeof raw.label === "string" && raw.label.trim() ? raw.label.trim().replace(/\s+/g, " ").slice(0, 100) : `${kind} ${target}`;
    const status = raw.status === "done" ? "done" : "queued";
    const createdAt = typeof raw.createdAt === "number" && Number.isFinite(raw.createdAt) ? Math.max(0, Math.round(raw.createdAt)) : 0;
    const updatedAt = typeof raw.updatedAt === "number" && Number.isFinite(raw.updatedAt) ? Math.max(0, Math.round(raw.updatedAt)) : createdAt;
    if (!next.some((task) => task.id === id)) {
      next.push({ id, kind, target, label, status, createdAt, updatedAt });
    }
  }
  return next.slice(-32);
}

export function normalizeDesktopEvents(value: unknown): DesktopEvent[] {
  if (!Array.isArray(value)) return [];
  const next: DesktopEvent[] = [];
  for (const [index, item] of value.entries()) {
    if (!item || typeof item !== "object") continue;
    const raw = item as Partial<Record<keyof DesktopEvent, unknown>>;
    const level: DesktopEventLevel = raw.level === "warn" ? "warn" : raw.level === "audit" ? "audit" : "info";
    const source = typeof raw.source === "string" && raw.source.trim() ? raw.source.trim().replace(/\s+/g, " ").slice(0, 32) : "shell";
    const message = typeof raw.message === "string" && raw.message.trim() ? raw.message.trim().replace(/\s+/g, " ").slice(0, 140) : "";
    if (!message) continue;
    const host = typeof raw.host === "string" && raw.host.trim() ? raw.host.trim().replace(/\s+/g, " ").slice(0, 80) : "cyberscape";
    const id = typeof raw.id === "number" && Number.isFinite(raw.id) ? Math.max(1, Math.round(raw.id)) : index + 1;
    const createdAt = typeof raw.createdAt === "number" && Number.isFinite(raw.createdAt) ? Math.max(0, Math.round(raw.createdAt)) : 0;
    next.push({ id, level, source, message, host, createdAt });
  }
  return next.slice(-80);
}

export function normalizeDesktopWindowState(state: Pick<ShellSessionState, "desktopActiveApp" | "desktopOpenApps" | "desktopMinimizedApps" | "desktopMaximizedApps">): void {
  if (!isDesktopAppId(state.desktopActiveApp)) state.desktopActiveApp = "terminal";
  state.desktopOpenApps = normalizeDesktopAppList(state.desktopOpenApps);
  state.desktopMinimizedApps = normalizeDesktopAppList(state.desktopMinimizedApps, [])
    .filter((app) => app !== "terminal" && state.desktopOpenApps.includes(app));
  state.desktopMaximizedApps = normalizeDesktopAppList(state.desktopMaximizedApps, [])
    .filter((app) => app !== "terminal" && state.desktopOpenApps.includes(app) && !state.desktopMinimizedApps.includes(app));
  if (!state.desktopOpenApps.includes(state.desktopActiveApp)) {
    state.desktopOpenApps.push(state.desktopActiveApp);
  }
  state.desktopMinimizedApps = state.desktopMinimizedApps.filter((app) => app !== state.desktopActiveApp);
}

export interface RemoteContext {
  host: string;
  user: string;
  cwd: string;
}

export interface ShellSessionState {
  sessionId: string | null;
  ttyPort: number;
  loggedIn: boolean;
  username: string | null;
  userId: number | null;
  shellMode: "nli" | "shell" | "monitor" | "game" | "basic" | "usenet" | "ftp" | "gopher" | "mail" | "telex" | "irc";
  cwd: string;
  homeHost: string;
  sshPublicKey: string | null;
  remoteStack: RemoteContext[];
  stty: SttyMode;
  desktopTheme: DesktopTheme;
  desktopActiveApp: DesktopAppId;
  desktopOpenApps: DesktopAppId[];
  desktopMinimizedApps: DesktopAppId[];
  desktopMaximizedApps: DesktopAppId[];
  desktopWindowPositions: DesktopWindowPositions;
  desktopPrefs: DesktopPrefs;
  desktopBookmarks: DesktopBookmark[];
  commandHistory: CommandHistoryEntry[];
  desktopTasks: DesktopTask[];
  desktopEvents: DesktopEvent[];
  pager: PagerState | null;
  linkTargetSessionId: string | null;
  mirrorInbox: string[];
  badges: string[];
  loginHosts: string[];
  rootHosts: string[];
  operatorRoutes: string[];
  tollLedger: TollCallEntry[];
  acousticCoupler: AcousticCouplerState | null;
  switchboardRoutes: SwitchboardRouteState[];
  packetCircuit: PacketCircuitState | null;
  pendingPorthack: {
    from: string;
    target: string;
  } | null;
  campHost: string | null;
  campSince: number | null;
  campCooldownUntil: number | null;
  tunnel: {
    from: string;
    to: string;
    createdAt: number;
  } | null;
  tunnelCooldownUntil: number | null;
  mailbox: {
    from: string;
    to: string;
    subject: string;
    body: string;
    createdAt: number;
  }[];
  bbsMode: boolean;
  bbsHost: string | null;
  bbsPhase: "login" | "menu" | null;
  bbsSubmode: "download" | "post-subject" | "post-body" | null;
  bbsGuestName: string | null;
  bbsDraftSubject: string | null;
  basicProgram: string | null;
  basicUserPrograms: Record<string, string[]>;
  usenetGroup: string | null;
  usenetSubmode: "post-subject" | "post-body" | null;
  usenetDraftGroup: string | null;
  usenetDraftSubject: string | null;
  ircHost: string | null;
  ircChannel: string | null;
  ircNick: string | null;
  downloads: Record<string, string>;
  gameMode: "zork" | "advent" | "lostpig" | null;
  gameLocation: "field" | "porch" | "house" | "kitchen" | "cellar" | null;
  gameInventory: string[];
  gameFlags: {
    mailboxOpened: boolean;
    lanternTaken: boolean;
    doorOpened: boolean;
    cellarUnlocked: boolean;
  };
}

export function initialShellState(): ShellSessionState {
  const ttyPort = Math.floor(Math.random() * 9000) + 1000;
  return {
    sessionId: null,
    ttyPort,
    loggedIn: false,
    username: null,
    userId: null,
    shellMode: "nli",
    cwd: "/",
    homeHost: "cyberscape",
    sshPublicKey: null,
    remoteStack: [],
    stty: "normal",
    desktopTheme: "xp",
    desktopActiveApp: "terminal",
    desktopOpenApps: ["terminal"],
    desktopMinimizedApps: [],
    desktopMaximizedApps: [],
    desktopWindowPositions: {},
    desktopPrefs: normalizeDesktopPrefs({}),
    desktopBookmarks: [],
    commandHistory: [],
    desktopTasks: [],
    desktopEvents: [],
    pager: null,
    linkTargetSessionId: null,
    mirrorInbox: [],
    badges: [],
    loginHosts: [],
    rootHosts: [],
    operatorRoutes: [],
    tollLedger: [],
    acousticCoupler: null,
    switchboardRoutes: [],
    packetCircuit: null,
    pendingPorthack: null,
    campHost: null,
    campSince: null,
    campCooldownUntil: null,
    tunnel: null,
    tunnelCooldownUntil: null,
    mailbox: [],
    bbsMode: false,
    bbsHost: null,
    bbsPhase: null,
    bbsSubmode: null,
    bbsGuestName: null,
    bbsDraftSubject: null,
    basicProgram: null,
    basicUserPrograms: {},
    usenetGroup: null,
    usenetSubmode: null,
    usenetDraftGroup: null,
    usenetDraftSubject: null,
    ircHost: null,
    ircChannel: null,
    ircNick: null,
    downloads: {},
    gameMode: null,
    gameLocation: null,
    gameInventory: [],
    gameFlags: {
      mailboxOpened: false,
      lanternTaken: false,
      doorOpened: false,
      cellarUnlocked: false,
    },
  };
}

export function currentHost(state: ShellSessionState): string {
  const top = state.remoteStack[state.remoteStack.length - 1];
  return top?.host ?? state.homeHost;
}

export function prompt(state: ShellSessionState): string {
  if (state.bbsMode) return "-";
  if (state.shellMode === "monitor") return "*";
  if (state.shellMode === "game") return ">";
  if (state.shellMode === "basic") return ">";
  if (state.shellMode === "usenet") return "news>";
  if (state.shellMode === "ftp") return "ftp>";
  if (state.shellMode === "gopher") return "gopher>";
  if (state.shellMode === "mail") return "mail>";
  if (state.shellMode === "telex") return "telex>";
  if (state.shellMode === "irc") {
    if (state.ircChannel?.startsWith("@")) return "talk>";
    if (state.ircHost?.toLowerCase() === "relay") return "relay>";
    return "irc>";
  }
  if (state.remoteStack.length) {
    const top = state.remoteStack[state.remoteStack.length - 1];
    return `${top.host}>`;
  }
  return state.loggedIn ? "@" : ".";
}
