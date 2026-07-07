"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DesktopAppId, DesktopPrefs, DesktopTheme, DesktopWindowPositions, SttyMode } from "@/lib/shell/types";

interface ShellResponse {
  sessionId: string;
  prompt: string;
  output: string[];
  pager?: boolean;
  stty?: SttyMode;
  desktopTheme?: DesktopTheme;
  desktopActiveApp?: DesktopAppId;
  desktopOpenApps?: DesktopAppId[];
  desktopMinimizedApps?: DesktopAppId[];
  desktopMaximizedApps?: DesktopAppId[];
  desktopWindowPositions?: DesktopWindowPositions;
  desktopPrefs?: DesktopPrefs;
  desktopBookmarks?: DesktopBookmark[];
  commandHistory?: CommandHistoryEntry[];
  desktopTasks?: DesktopTask[];
  desktopEvents?: DesktopEvent[];
  desktopEventViewer?: DesktopEventViewerEntry[];
  desktopSearch?: DesktopSearchEntry[];
  desktopConnections?: DesktopConnectionEntry[];
  desktopNetSetup?: DesktopNetSetupEntry[];
  desktopNetDiagnostics?: DesktopNetDiagnosticEntry[];
  desktopMappedDrives?: DesktopMappedDriveEntry[];
  desktopOffline?: DesktopOfflineEntry[];
  desktopRemote?: DesktopRemoteEntry[];
  desktopRun?: DesktopRunEntry[];
  desktopHelp?: DesktopHelpEntry[];
  desktopFiles?: DesktopFileEntry[];
  desktopMail?: DesktopMailEntry[];
  desktopBoards?: DesktopBoardEntry[];
  desktopComputer?: DesktopComputerEntry[];
  desktopDisk?: DesktopDiskEntry[];
  desktopSystem?: DesktopSystemEntry[];
  desktopControl?: DesktopControlEntry[];
  desktopCredentials?: DesktopCredentialEntry[];
  desktopAccounts?: DesktopAccountEntry[];
  desktopTime?: DesktopTimeEntry[];
  desktopDisplay?: DesktopDisplayEntry[];
  desktopSounds?: DesktopSoundEntry[];
  desktopPower?: DesktopPowerEntry[];
  desktopMouse?: DesktopMouseEntry[];
  desktopKeyboard?: DesktopKeyboardEntry[];
  desktopAccessibility?: DesktopAccessibilityEntry[];
  desktopRegional?: DesktopRegionalEntry[];
  desktopModems?: DesktopModemEntry[];
  desktopOdbc?: DesktopOdbcEntry[];
  desktopPrograms?: DesktopProgramEntry[];
  desktopInternet?: DesktopInternetEntry[];
  desktopFirewall?: DesktopFirewallEntry[];
  desktopUpdates?: DesktopUpdateEntry[];
  desktopPerformance?: DesktopPerformanceEntry[];
  desktopRestore?: DesktopRestoreEntry[];
  desktopFolders?: DesktopFolderEntry[];
  desktopProcesses?: DesktopProcessEntry[];
  desktopSchedule?: DesktopScheduleEntry[];
  desktopNetwork?: DesktopNetworkEntry[];
  desktopDialup?: DesktopDialupEntry[];
  desktopLineage?: DesktopLineageEntry[];
  desktopDevices?: DesktopDeviceEntry[];
  desktopNodes?: DesktopNodeEntry[];
  desktopSecurity?: DesktopSecurityEntry[];
  desktopServices?: DesktopServiceEntry[];
  desktopShares?: DesktopShareEntry[];
  desktopPrint?: DesktopPrintEntry[];
  desktopRegistry?: DesktopRegistryEntry[];
  desktopSnapshot?: DesktopSnapshot;
}

interface DesktopBookmark {
  id: string;
  kind: "host" | "route";
  target: string;
  label: string;
  route?: string[];
  createdAt: number;
}

interface CommandHistoryEntry {
  id: number;
  line: string;
  host: string;
  mode: string;
  createdAt: number;
}

interface DesktopTask {
  id: string;
  kind: "scan" | "transfer" | "maint";
  target: string;
  label: string;
  status: "queued" | "done";
  createdAt: number;
  updatedAt: number;
}

interface DesktopEvent {
  id: number;
  level: "info" | "warn" | "audit";
  source: string;
  message: string;
  host: string;
  createdAt: number;
}

interface DesktopFileEntry {
  id: string;
  kind: "host" | "download" | "home";
  name: string;
  path: string;
  size: number;
  host: string;
  updatedAt: number;
}

interface DesktopMailEntry {
  id: string;
  from: string;
  to: string;
  subject: string;
  preview: string;
  createdAt: number;
}

interface DesktopBoardEntry {
  id: string;
  kind: "bbs" | "usenet";
  board: string;
  author: string;
  subject: string;
  preview: string;
  createdAt: number;
}

interface DesktopSystemEntry {
  id: string;
  group: string;
  name: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopControlEntry {
  id: string;
  category: string;
  applet: string;
  status: string;
  source: string;
  actions: string[];
}

interface DesktopCredentialEntry {
  id: string;
  target: string;
  username: string;
  kind: string;
  status: "active" | "stored" | "elevated" | "missing" | "revoked";
  source: string;
  actions: string[];
}

interface DesktopAccountEntry {
  id: string;
  scope: string;
  name: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopTimeEntry {
  id: string;
  tab: string;
  name: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopDisplayEntry {
  id: string;
  tab: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopSoundEntry {
  id: string;
  tab: string;
  item: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopPowerEntry {
  id: string;
  scheme: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopMouseEntry {
  id: string;
  tab: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopKeyboardEntry {
  id: string;
  tab: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopAccessibilityEntry {
  id: string;
  tab: string;
  option: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopRegionalEntry {
  id: string;
  tab: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopModemEntry {
  id: string;
  tab: string;
  name: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopOdbcEntry {
  id: string;
  tab: string;
  name: string;
  driver: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopProgramEntry {
  id: string;
  category: string;
  name: string;
  version: string;
  status: "installed" | "available" | "downloaded" | "queued";
  source: string;
  actions: string[];
}

interface DesktopInternetEntry {
  id: string;
  tab: string;
  zone: string;
  setting: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopFirewallEntry {
  id: string;
  tab: string;
  name: string;
  profile: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopUpdateEntry {
  id: string;
  tab: string;
  name: string;
  channel: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopPerformanceEntry {
  id: string;
  object: string;
  counter: string;
  instance: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopRestoreEntry {
  id: string;
  tab: string;
  name: string;
  status: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopComputerEntry {
  id: string;
  tree: string;
  node: string;
  status: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopDiskEntry {
  id: string;
  disk: string;
  volume: string;
  status: string;
  capacity: string;
  used: string;
  source: string;
  actions: string[];
}

interface DesktopEventViewerEntry {
  id: string;
  log: string;
  level: "info" | "warn" | "audit";
  source: string;
  eventId: number;
  message: string;
  host: string;
  actions: string[];
}

interface DesktopSearchEntry {
  id: string;
  scope: string;
  name: string;
  location: string;
  summary: string;
  source: string;
  actions: string[];
}

interface DesktopConnectionEntry {
  id: string;
  name: string;
  type: string;
  status: "connected" | "enabled" | "limited" | "firewalled" | "queued" | "disabled";
  device: string;
  host: string;
  speed: string;
  source: string;
  actions: string[];
}

interface DesktopNetSetupEntry {
  id: string;
  stage: string;
  item: string;
  status: string;
  source: string;
  actions: string[];
}

interface DesktopNetDiagnosticEntry {
  id: string;
  test: string;
  target: string;
  result: "pass" | "warn" | "fail" | "info";
  detail: string;
  source: string;
  actions: string[];
}

interface DesktopMappedDriveEntry {
  id: string;
  drive: string;
  remote: string;
  status: string;
  capacity: string;
  source: string;
  actions: string[];
}

interface DesktopOfflineEntry {
  id: string;
  location: string;
  item: string;
  status: string;
  size: string;
  source: string;
  actions: string[];
}

interface DesktopRemoteEntry {
  id: string;
  host: string;
  profile: string;
  status: "connected" | "available" | "credentialed" | "queued" | "blocked";
  access: "local" | "root" | "login" | "public";
  route: string[];
  display: string;
  source: string;
  actions: string[];
}

interface DesktopRunEntry {
  id: string;
  command: string;
  target: string;
  status: "ready" | "recent" | "elevated" | "blocked" | "missing";
  source: string;
  actions: string[];
}

interface DesktopHelpEntry {
  id: string;
  section: string;
  topic: string;
  status: string;
  source: string;
  actions: string[];
}

interface DesktopFolderEntry {
  id: string;
  tab: string;
  option: string;
  value: string;
  source: string;
  actions: string[];
}

interface DesktopProcessEntry {
  id: string;
  pid: number;
  tty: string;
  user: string;
  host: string;
  command: string;
  status: "running" | "linked" | "watching" | "queued" | "foreground";
  source: string;
  actions: string[];
}

interface DesktopScheduleEntry {
  id: string;
  name: string;
  trigger: string;
  target: string;
  status: "ready" | "queued" | "running" | "disabled";
  lastRun: string;
  nextRun: string;
  source: string;
  actions: string[];
}

interface DesktopNetworkEntry {
  id: string;
  host: string;
  org: string;
  location: string;
  access: "local" | "root" | "login" | "public";
  route: string[];
  ports: number[];
  bbs: boolean;
  bookmarked: boolean;
}

interface DesktopDialupEntry {
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
}

interface DesktopLineageEntry {
  id: string;
  era: "pre-dialup" | "dialup" | "packet" | "internet" | "lan";
  method: string;
  status: "connected" | "enabled" | "limited" | "firewalled" | "queued" | "disabled";
  host: string;
  path: string;
  speed: string;
  meaning: string;
  actions: string[];
}

interface DesktopDeviceEntry {
  id: string;
  host: string;
  category: string;
  name: string;
  status: "ok" | "busy" | "warning" | "offline";
  driver: string;
  resource: string;
  actions: string[];
}

interface DesktopNodeEntry {
  id: string;
  host: string;
  org: string;
  location: string;
  role: "current" | "home" | "login" | "root";
  access: "local" | "root" | "login" | "public";
  route: string[];
  ports: number[];
}

interface DesktopSecurityEntry {
  id: string;
  host: string;
  access: "local" | "root" | "login" | "public";
  owner: string | null;
  posture: "local" | "controlled" | "watched" | "exposed" | "unknown";
  ports: number[];
  checks: string[];
  actions: string[];
}

interface DesktopServiceEntry {
  id: string;
  host: string;
  port: number;
  name: string;
  status: "running" | "reachable" | "restricted";
  access: "local" | "root" | "login" | "public";
  banner: string;
  actions: string[];
}

interface DesktopShareEntry {
  id: string;
  host: string;
  name: string;
  kind: "host" | "home" | "download";
  access: "local" | "root" | "login" | "public";
  path: string;
  files: number;
  writable: boolean;
  actions: string[];
}

interface DesktopPrintEntry {
  id: string;
  host: string;
  queue: string;
  status: "ready" | "queued" | "held";
  document: string;
  source: string;
  pages: number;
  actions: string[];
}

interface DesktopRegistryEntry {
  id: string;
  hive: "HKCU" | "HKLM" | "HKU";
  key: string;
  name: string;
  value: string;
  source: string;
  writable: boolean;
  actions: string[];
}

interface DesktopSnapshot {
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
  desktopEventViewer: DesktopEventViewerEntry[];
  desktopSearch: DesktopSearchEntry[];
  desktopConnections: DesktopConnectionEntry[];
  desktopNetSetup: DesktopNetSetupEntry[];
  desktopNetDiagnostics: DesktopNetDiagnosticEntry[];
  desktopMappedDrives: DesktopMappedDriveEntry[];
  desktopOffline: DesktopOfflineEntry[];
  desktopRemote: DesktopRemoteEntry[];
  desktopRun: DesktopRunEntry[];
  desktopHelp: DesktopHelpEntry[];
  desktopFiles: DesktopFileEntry[];
  desktopMail: DesktopMailEntry[];
  desktopBoards: DesktopBoardEntry[];
  desktopComputer: DesktopComputerEntry[];
  desktopDisk: DesktopDiskEntry[];
  desktopSystem: DesktopSystemEntry[];
  desktopControl: DesktopControlEntry[];
  desktopCredentials: DesktopCredentialEntry[];
  desktopAccounts: DesktopAccountEntry[];
  desktopTime: DesktopTimeEntry[];
  desktopDisplay: DesktopDisplayEntry[];
  desktopSounds: DesktopSoundEntry[];
  desktopPower: DesktopPowerEntry[];
  desktopMouse: DesktopMouseEntry[];
  desktopKeyboard: DesktopKeyboardEntry[];
  desktopAccessibility: DesktopAccessibilityEntry[];
  desktopRegional: DesktopRegionalEntry[];
  desktopModems: DesktopModemEntry[];
  desktopOdbc: DesktopOdbcEntry[];
  desktopPrograms: DesktopProgramEntry[];
  desktopInternet: DesktopInternetEntry[];
  desktopFirewall: DesktopFirewallEntry[];
  desktopUpdates: DesktopUpdateEntry[];
  desktopPerformance: DesktopPerformanceEntry[];
  desktopRestore: DesktopRestoreEntry[];
  desktopFolders: DesktopFolderEntry[];
  desktopProcesses: DesktopProcessEntry[];
  desktopSchedule: DesktopScheduleEntry[];
  desktopNetwork: DesktopNetworkEntry[];
  desktopDialup: DesktopDialupEntry[];
  desktopLineage: DesktopLineageEntry[];
  desktopDevices: DesktopDeviceEntry[];
  desktopNodes: DesktopNodeEntry[];
  desktopSecurity: DesktopSecurityEntry[];
  desktopServices: DesktopServiceEntry[];
  desktopShares: DesktopShareEntry[];
  desktopPrint: DesktopPrintEntry[];
  desktopRegistry: DesktopRegistryEntry[];
}

const eras: Array<{ id: DesktopTheme; label: string }> = [
  { id: "nt", label: "NT" },
  { id: "2000", label: "2000" },
  { id: "xp", label: "XP" },
  { id: "7", label: "7" },
];

const defaultDesktopPrefs: DesktopPrefs = {
  motion: "normal",
  fontSize: "normal",
  contrast: "normal",
  sound: "muted",
  keyboardMode: "desktop",
};

const desktopApps = [
  { id: "terminal", label: "Terminal", icon: "terminal" },
  { id: "system", label: "System", icon: "system" },
  { id: "control", label: "Control", icon: "control" },
  { id: "accounts", label: "Accounts", icon: "accounts" },
  { id: "credentials", label: "Passwords", icon: "security" },
  { id: "datetime", label: "Date/Time", icon: "datetime" },
  { id: "display", label: "Display", icon: "display" },
  { id: "sounds", label: "Sounds", icon: "sounds" },
  { id: "power", label: "Power", icon: "power" },
  { id: "mouse", label: "Mouse", icon: "mouse" },
  { id: "keyboard", label: "Keyboard", icon: "keyboard" },
  { id: "accessibility", label: "Accessibility", icon: "accessibility" },
  { id: "regional", label: "Regional", icon: "regional" },
  { id: "modems", label: "Modems", icon: "modems" },
  { id: "odbc", label: "ODBC", icon: "odbc" },
  { id: "programs", label: "Programs", icon: "programs" },
  { id: "internet", label: "Internet", icon: "internet" },
  { id: "firewall", label: "Firewall", icon: "firewall" },
  { id: "updates", label: "Updates", icon: "updates" },
  { id: "performance", label: "PerfMon", icon: "performance" },
  { id: "restore", label: "Restore", icon: "restore" },
  { id: "computer", label: "Mgmt", icon: "computer" },
  { id: "disk", label: "Disk", icon: "disk" },
  { id: "eventviewer", label: "Events", icon: "eventviewer" },
  { id: "search", label: "Search", icon: "search" },
  { id: "connections", label: "Connections", icon: "connections" },
  { id: "netsetup", label: "NetSetup", icon: "connections" },
  { id: "netdiag", label: "NetDiag", icon: "connections" },
  { id: "mapdrive", label: "Map Drive", icon: "drive" },
  { id: "offline", label: "Offline", icon: "folderopts" },
  { id: "remote", label: "Remote", icon: "connections" },
  { id: "runbox", label: "Run", icon: "terminal" },
  { id: "taskmgr", label: "TaskMgr", icon: "taskmgr" },
  { id: "scheduler", label: "Scheduled", icon: "scheduler" },
  { id: "nodes", label: "My Nodes", icon: "drive" },
  { id: "network", label: "Network", icon: "network" },
  { id: "dialup", label: "Dial-Up", icon: "dialup" },
  { id: "lineage", label: "Lineage", icon: "dialup" },
  { id: "devices", label: "Devices", icon: "devices" },
  { id: "security", label: "Security", icon: "security" },
  { id: "services", label: "Services", icon: "services" },
  { id: "shares", label: "Shares", icon: "shares" },
  { id: "printers", label: "Printers", icon: "printer" },
  { id: "registry", label: "Registry", icon: "registry" },
  { id: "folders", label: "Folders", icon: "folderopts" },
  { id: "files", label: "Files", icon: "folder" },
  { id: "boards", label: "Boards", icon: "board" },
  { id: "mail", label: "Mail", icon: "mail" },
  { id: "tasks", label: "Tasks", icon: "tasks" },
  { id: "logs", label: "Logs", icon: "logs" },
  { id: "help", label: "Help", icon: "help" },
  { id: "settings", label: "Settings", icon: "settings" },
] as const;

function defaultWindowPosition(appId: DesktopAppId, index: number) {
  const appIndex = desktopApps.findIndex((app) => app.id === appId);
  return {
    x: 128 + ((appIndex >= 0 ? appIndex : index) % 4) * 24,
    y: 54 + Math.floor((appIndex >= 0 ? appIndex : index) / 4) * 24,
  };
}

const desktopAppContent: Record<Exclude<DesktopAppId, "terminal">, {
  title: string;
  command: string;
  rows: (snapshot: DesktopSnapshot | null) => Array<[string, string]>;
}> = {
  system: {
    title: "System Properties",
    command: "system, sysdm, winver",
    rows: (snapshot) => [
      ["Computer", snapshot?.desktopSystem.find((entry) => entry.name === "Computer Name")?.value ?? snapshot?.currentHost ?? "cyberscape"],
      ["Version", snapshot?.desktopSystem.find((entry) => entry.name === "Shell Version")?.value ?? snapshot?.desktopTheme ?? "xp"],
      ["Resources", snapshot?.desktopSystem.filter((entry) => entry.group === "Resources").slice(0, 3).map((entry) => `${entry.name}=${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend host, user, route, storage, and preference state"],
    ],
  },
  control: {
    title: "Control Panel",
    command: "control, control panel, cpl",
    rows: (snapshot) => [
      ["Applets", `${snapshot?.desktopControl.length ?? 0} backend applet row(s)`],
      ["Admin", snapshot?.desktopControl.filter((entry) => entry.category === "Admin").slice(0, 3).map((entry) => entry.applet).join(", ") || "none"],
      ["Appearance", snapshot?.desktopControl.filter((entry) => entry.category === "Appearance").slice(0, 2).map((entry) => `${entry.applet}:${entry.status}`).join(", ") || "none"],
      ["Source", "derived from backend desktop, system, device, network, and preference state"],
    ],
  },
  accounts: {
    title: "User Accounts",
    command: "accounts, nusrmgr.cpl, whoami",
    rows: (snapshot) => [
      ["Accounts", `${snapshot?.desktopAccounts.length ?? 0} backend account row(s)`],
      ["Current", snapshot?.desktopAccounts.find((entry) => entry.name === "Operator")?.value ?? snapshot?.username ?? "guest"],
      ["Sessions", snapshot?.desktopAccounts.filter((entry) => entry.scope === "Session").slice(0, 3).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend user, session, key, badge, and access state"],
    ],
  },
  credentials: {
    title: "Stored User Names and Passwords",
    command: "credentials, creds, keymgr, keymgr.dll, controlkeymgr",
    rows: (snapshot) => [
      ["Rows", `${snapshot?.desktopCredentials.length ?? 0} backend credential row(s)`],
      ["Stored", snapshot?.desktopCredentials.filter((entry) => entry.status === "stored" || entry.status === "active" || entry.status === "elevated").slice(0, 3).map((entry) => `${entry.target}:${entry.status}`).join(", ") || "none"],
      ["Secrets", "not displayed"],
      ["Source", "derived from backend account, SSH key, host access, bookmarks, remote profiles, and security state"],
    ],
  },
  datetime: {
    title: "Date/Time Properties",
    command: "datetime, timedate.cpl, clock",
    rows: (snapshot) => [
      ["Clock", snapshot?.desktopTime.find((entry) => entry.name === "Server Time")?.value ?? "server pending"],
      ["Calendar", snapshot?.desktopTime.find((entry) => entry.name === "Discordian")?.value ?? "ddate"],
      ["Activity", snapshot?.desktopTime.filter((entry) => entry.tab === "Activity").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend server clock, event, command, and scheduler state"],
    ],
  },
  display: {
    title: "Display Properties",
    command: "display, desk.cpl, theme",
    rows: (snapshot) => [
      ["Settings", `${snapshot?.desktopDisplay.length ?? 0} backend display row(s)`],
      ["Theme", snapshot?.desktopDisplay.find((entry) => entry.setting === "Color Scheme")?.value ?? snapshot?.desktopTheme ?? "xp"],
      ["Accessibility", snapshot?.desktopDisplay.filter((entry) => entry.tab === "Accessibility").slice(0, 3).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend theme, preference, window, and session state"],
    ],
  },
  sounds: {
    title: "Sounds and Audio Devices",
    command: "sounds, mmsys.cpl, theme pref sound",
    rows: (snapshot) => [
      ["Volume", snapshot?.desktopSounds.find((entry) => entry.item === "Master Volume")?.value ?? snapshot?.desktopPrefs.sound ?? "muted"],
      ["Scheme", snapshot?.desktopSounds.find((entry) => entry.item === "Sound Scheme")?.value ?? snapshot?.desktopTheme ?? "xp"],
      ["Alerts", snapshot?.desktopSounds.filter((entry) => entry.tab === "Voice" || entry.tab === "Sounds").slice(0, 2).map((entry) => `${entry.item}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend preference, event, task, device, and session state"],
    ],
  },
  power: {
    title: "Power Options",
    command: "power, powercfg.cpl, theme pref motion",
    rows: (snapshot) => [
      ["Scheme", snapshot?.desktopPower.find((entry) => entry.setting === "Active Scheme")?.value ?? "Always On"],
      ["Timers", snapshot?.desktopPower.filter((entry) => entry.scheme === "Timers").slice(0, 3).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
      ["Activity", snapshot?.desktopPower.filter((entry) => entry.scheme === "Activity").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend preferences, tasks, processes, devices, and routes"],
    ],
  },
  mouse: {
    title: "Mouse Properties",
    command: "mouse, main.cpl, theme pref keyboard",
    rows: (snapshot) => [
      ["Buttons", snapshot?.desktopMouse.filter((entry) => entry.tab === "Buttons").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
      ["Pointer", snapshot?.desktopMouse.find((entry) => entry.setting === "Pointer Scheme")?.value ?? snapshot?.desktopTheme ?? "xp"],
      ["Motion", snapshot?.desktopMouse.filter((entry) => entry.tab === "Motion").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend preferences, windows, tasks, devices, and session state"],
    ],
  },
  keyboard: {
    title: "Keyboard Properties",
    command: "keyboard, kbd.cpl, theme pref keyboard",
    rows: (snapshot) => [
      ["Mode", snapshot?.desktopKeyboard.find((entry) => entry.setting === "Shortcut Priority")?.value ?? snapshot?.desktopPrefs.keyboardMode ?? "desktop"],
      ["Repeat", snapshot?.desktopKeyboard.filter((entry) => entry.tab === "Speed").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
      ["Input", snapshot?.desktopKeyboard.filter((entry) => entry.tab === "Input").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend preferences, terminal, history, tasks, and devices"],
    ],
  },
  accessibility: {
    title: "Accessibility Options",
    command: "accessibility, access.cpl, display",
    rows: (snapshot) => [
      ["Keyboard", snapshot?.desktopAccessibility.filter((entry) => entry.tab === "Keyboard").slice(0, 2).map((entry) => `${entry.option}:${entry.value}`).join(", ") || "none"],
      ["Display", snapshot?.desktopAccessibility.filter((entry) => entry.tab === "Display").slice(0, 2).map((entry) => `${entry.option}:${entry.value}`).join(", ") || "none"],
      ["General", snapshot?.desktopAccessibility.filter((entry) => entry.tab === "General").slice(0, 2).map((entry) => `${entry.option}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend preferences, applets, events, tasks, and devices"],
    ],
  },
  regional: {
    title: "Regional and Language Options",
    command: "regional, intl.cpl, datetime",
    rows: (snapshot) => [
      ["Standards", snapshot?.desktopRegional.find((entry) => entry.setting === "Standards")?.value ?? snapshot?.desktopTheme ?? "xp"],
      ["Formats", snapshot?.desktopRegional.filter((entry) => entry.tab === "Formats").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
      ["Languages", snapshot?.desktopRegional.filter((entry) => entry.tab === "Languages").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend theme, time, files, mail, boards, and keyboard state"],
    ],
  },
  modems: {
    title: "Phone and Modem Options",
    command: "modems, telephon.cpl, dialup",
    rows: (snapshot) => [
      ["Dialing", snapshot?.desktopModems.filter((entry) => entry.tab === "Dialing Rules").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
      ["Modems", snapshot?.desktopModems.filter((entry) => entry.tab === "Modems").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
      ["Diagnostics", snapshot?.desktopModems.filter((entry) => entry.tab === "Diagnostics").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend dial-up, device, regional, network, service, and task state"],
    ],
  },
  odbc: {
    title: "ODBC Data Source Administrator",
    command: "odbc, odbcad32, services",
    rows: (snapshot) => [
      ["User DSN", snapshot?.desktopOdbc.filter((entry) => entry.tab === "User DSN").slice(0, 2).map((entry) => `${entry.name}:${entry.driver}`).join(", ") || "none"],
      ["System DSN", snapshot?.desktopOdbc.filter((entry) => entry.tab === "System DSN").slice(0, 2).map((entry) => `${entry.name}:${entry.driver}`).join(", ") || "none"],
      ["Tracing", snapshot?.desktopOdbc.filter((entry) => entry.tab === "Tracing" || entry.tab === "Connection Pooling").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend services, files, registry, programs, network, and task state"],
    ],
  },
  programs: {
    title: "Add/Remove Programs",
    command: "programs, appwiz.cpl, games",
    rows: (snapshot) => [
      ["Programs", `${snapshot?.desktopPrograms.length ?? 0} backend program row(s)`],
      ["Protocols", snapshot?.desktopPrograms.filter((entry) => entry.category === "Protocol").slice(0, 4).map((entry) => entry.name).join(", ") || "none"],
      ["User data", snapshot?.desktopPrograms.filter((entry) => entry.source === "downloads" || entry.source === "basicUserPrograms").slice(0, 3).map((entry) => `${entry.name}:${entry.status}`).join(", ") || "none"],
      ["Source", "derived from backend command, game, protocol, download, task, and profile state"],
    ],
  },
  internet: {
    title: "Internet Options",
    command: "internet, inetcpl, network",
    rows: (snapshot) => [
      ["Zones", `${snapshot?.desktopInternet.length ?? 0} backend option row(s)`],
      ["Security", snapshot?.desktopInternet.filter((entry) => entry.tab === "Security").slice(0, 2).map((entry) => `${entry.zone}:${entry.value}`).join(", ") || "none"],
      ["Connections", snapshot?.desktopInternet.filter((entry) => entry.tab === "Connections").slice(0, 2).map((entry) => `${entry.zone}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend network, service, security, file, and preference state"],
    ],
  },
  firewall: {
    title: "Windows Firewall",
    command: "firewall, firewall.cpl, security",
    rows: (snapshot) => [
      ["Profiles", snapshot?.desktopFirewall.filter((entry) => entry.tab === "General").slice(0, 2).map((entry) => `${entry.name}:${entry.profile}`).join(", ") || "none"],
      ["Exceptions", snapshot?.desktopFirewall.filter((entry) => entry.tab === "Exceptions").slice(0, 3).map((entry) => `${entry.name}:${entry.profile}`).join(", ") || "none"],
      ["Logging", snapshot?.desktopFirewall.filter((entry) => entry.tab === "Logging").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend security, services, network, dial-up, events, and task state"],
    ],
  },
  updates: {
    title: "Automatic Updates",
    command: "updates, wuaucpl.cpl, windowsupdate",
    rows: (snapshot) => [
      ["Settings", snapshot?.desktopUpdates.filter((entry) => entry.tab === "Settings").slice(0, 2).map((entry) => `${entry.name}:${entry.channel}`).join(", ") || "none"],
      ["Status", snapshot?.desktopUpdates.filter((entry) => entry.tab === "Status").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
      ["History", snapshot?.desktopUpdates.filter((entry) => entry.tab === "History").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend programs, services, security, tasks, events, downloads, and theme state"],
    ],
  },
  performance: {
    title: "Performance Monitor",
    command: "performance, perfmon, perfmon.msc",
    rows: (snapshot) => [
      ["Processor", snapshot?.desktopPerformance.filter((entry) => entry.object === "Processor").slice(0, 2).map((entry) => `${entry.counter}:${entry.value}`).join(", ") || "none"],
      ["System", snapshot?.desktopPerformance.filter((entry) => entry.object === "System" || entry.object === "Memory").slice(0, 2).map((entry) => `${entry.object}:${entry.value}`).join(", ") || "none"],
      ["Network", snapshot?.desktopPerformance.filter((entry) => entry.object === "Network" || entry.object === "Service").slice(0, 2).map((entry) => `${entry.object}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend processes, services, network, files, events, tasks, and security state"],
    ],
  },
  restore: {
    title: "System Restore",
    command: "restore, rstrui, save, load",
    rows: (snapshot) => [
      ["Status", snapshot?.desktopRestore.filter((entry) => entry.tab === "Status").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
      ["Restore Points", snapshot?.desktopRestore.filter((entry) => entry.tab === "Restore Point").slice(0, 3).map((entry) => `${entry.name}:${entry.status}`).join(", ") || "none"],
      ["Monitored", snapshot?.desktopRestore.filter((entry) => entry.tab === "Monitored").slice(0, 3).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend saved checkpoints, files, registry, security, events, and task state"],
    ],
  },
  computer: {
    title: "Computer Management",
    command: "computer, compmgmt, compmgmt.msc",
    rows: (snapshot) => [
      ["System Tools", snapshot?.desktopComputer.filter((entry) => entry.tree === "System Tools").slice(0, 3).map((entry) => `${entry.node}:${entry.status}`).join(", ") || "none"],
      ["Storage", snapshot?.desktopComputer.filter((entry) => entry.tree === "Storage").slice(0, 2).map((entry) => `${entry.node}:${entry.value}`).join(", ") || "none"],
      ["Services", snapshot?.desktopComputer.filter((entry) => entry.tree === "Services and Applications").slice(0, 3).map((entry) => `${entry.node}:${entry.status}`).join(", ") || "none"],
      ["Source", "derived from backend events, shares, devices, services, tasks, files, security, and performance state"],
    ],
  },
  disk: {
    title: "Disk Management",
    command: "disk, diskmgmt, diskmgmt.msc",
    rows: (snapshot) => [
      ["Volumes", `${snapshot?.desktopDisk.length ?? 0} backend volume row(s)`],
      ["Profile", snapshot?.desktopDisk.filter((entry) => entry.disk === "Disk 0").slice(0, 3).map((entry) => `${entry.volume}:${entry.used}`).join(", ") || "none"],
      ["Remote", snapshot?.desktopDisk.filter((entry) => entry.status === "mounted" || entry.disk === "Net").slice(0, 3).map((entry) => `${entry.volume}:${entry.status}`).join(", ") || "none"],
      ["Source", "derived from backend quota, files, downloads, shares, checkpoints, tasks, and route state"],
    ],
  },
  eventviewer: {
    title: "Event Viewer",
    command: "eventviewer, eventvwr.msc, events",
    rows: (snapshot) => [
      ["Windows Logs", snapshot?.desktopEventViewer.filter((entry) => entry.log === "Application" || entry.log === "System" || entry.log === "Security").slice(0, 3).map((entry) => `${entry.log}:${entry.level}`).join(", ") || "none"],
      ["Applications", snapshot?.desktopEventViewer.filter((entry) => entry.log === "Applications and Services").slice(0, 3).map((entry) => `${entry.source}:${entry.message}`).join(", ") || "none"],
      ["Audit", `${snapshot?.desktopEventViewer.filter((entry) => entry.level === "audit").length ?? 0} audit row(s), ${snapshot?.desktopEventViewer.length ?? 0} total`],
      ["Source", "derived from backend desktop events, tasks, security, command history, and session state"],
    ],
  },
  search: {
    title: "Search Companion",
    command: "search, find, srchui",
    rows: (snapshot) => [
      ["Indexed", `${snapshot?.desktopSearch.length ?? 0} backend-visible artifact row(s)`],
      ["Places", snapshot?.desktopSearch.length ? Array.from(new Set(snapshot.desktopSearch.map((entry) => entry.scope))).slice(0, 5).join(", ") : "none"],
      ["Recent", snapshot?.desktopSearch.filter((entry) => entry.scope === "History" || entry.scope === "Tasks").slice(0, 3).map((entry) => entry.name).join(", ") || "none"],
      ["Source", "derived from backend-visible files, boards, mail, hosts, services, events, history, tasks, and bookmarks"],
    ],
  },
  connections: {
    title: "Network Connections",
    command: "connections, ncpa.cpl, network",
    rows: (snapshot) => [
      ["Connections", `${snapshot?.desktopConnections.length ?? 0} backend connection row(s)`],
      ["Active", snapshot?.desktopConnections.filter((entry) => entry.status === "connected" || entry.status === "enabled").slice(0, 3).map((entry) => `${entry.name}:${entry.status}`).join(", ") || "none"],
      ["Queued", `${snapshot?.desktopConnections.filter((entry) => entry.status === "queued").length ?? 0} queued row(s)`],
      ["Source", "derived from backend network, dial-up, tunnel, service, firewall, and task state"],
    ],
  },
  netsetup: {
    title: "Network Setup Wizard",
    command: "netsetup, netsetup.cpl, connections",
    rows: (snapshot) => [
      ["Steps", `${snapshot?.desktopNetSetup.length ?? 0} backend setup row(s)`],
      ["Adapters", snapshot?.desktopNetSetup.filter((entry) => entry.stage === "Adapters").slice(0, 2).map((entry) => `${entry.item}:${entry.status}`).join(", ") || "none"],
      ["Sharing", snapshot?.desktopNetSetup.filter((entry) => entry.stage === "Sharing").slice(0, 2).map((entry) => `${entry.item}:${entry.status}`).join(", ") || "none"],
      ["Source", "derived from backend network, dial-up, shares, firewall, services, route, and task state"],
    ],
  },
  netdiag: {
    title: "Network Diagnostics",
    command: "netdiag, diagnose, connections",
    rows: (snapshot) => [
      ["Diagnostics", `${snapshot?.desktopNetDiagnostics.length ?? 0} backend diagnostic row(s)`],
      ["Warnings", `${snapshot?.desktopNetDiagnostics.filter((entry) => entry.result === "warn" || entry.result === "fail").length ?? 0} warning/fail row(s)`],
      ["Signals", snapshot?.desktopNetDiagnostics.slice(0, 3).map((entry) => `${entry.test}:${entry.result}`).join(", ") || "none"],
      ["Source", "derived from backend network, services, firewall, route, tasks, and event state"],
    ],
  },
  mapdrive: {
    title: "Map Network Drive",
    command: "mapdrive, net use, shares",
    rows: (snapshot) => [
      ["Mapped", `${snapshot?.desktopMappedDrives.length ?? 0} backend mapped drive row(s)`],
      ["Writable", `${snapshot?.desktopMappedDrives.filter((entry) => entry.status.includes("write")).length ?? 0} writable row(s)`],
      ["Letters", snapshot?.desktopMappedDrives.slice(0, 4).map((entry) => `${entry.drive}${entry.remote}`).join(", ") || "none"],
      ["Source", "derived from backend shares, files, downloads, profile, and network state"],
    ],
  },
  offline: {
    title: "Offline Files",
    command: "offline, sync, mobsync",
    rows: (snapshot) => [
      ["Items", `${snapshot?.desktopOffline.length ?? 0} backend offline file row(s)`],
      ["Pending", `${snapshot?.desktopOffline.filter((entry) => entry.status.includes("pending")).length ?? 0} pending row(s)`],
      ["Cached", snapshot?.desktopOffline.filter((entry) => /cache|sync|pinned/i.test(entry.status)).slice(0, 3).map((entry) => `${entry.location}:${entry.item}`).join(", ") || "none"],
      ["Source", "derived from backend files, shares, mapped drives, downloads, tasks, and events"],
    ],
  },
  folders: {
    title: "Folder Options",
    command: "folders, folderopts, files",
    rows: (snapshot) => [
      ["Options", `${snapshot?.desktopFolders.length ?? 0} backend folder option row(s)`],
      ["View", snapshot?.desktopFolders.filter((entry) => entry.tab === "View").slice(0, 3).map((entry) => `${entry.option}:${entry.value}`).join(", ") || "none"],
      ["Offline", snapshot?.desktopFolders.filter((entry) => entry.tab === "Offline Files").slice(0, 2).map((entry) => `${entry.option}:${entry.value}`).join(", ") || "none"],
      ["Source", "derived from backend file, share, preference, bookmark, and history state"],
    ],
  },
  taskmgr: {
    title: "Task Manager",
    command: "taskmgr, ps, kill <pid>",
    rows: (snapshot) => [
      ["Processes", `${snapshot?.desktopProcesses.length ?? 0} backend process row(s)`],
      ["Queued", `${snapshot?.desktopProcesses.filter((entry) => entry.status === "queued").length ?? 0} queued process(es)`],
      ["Foreground", snapshot?.desktopProcesses.find((entry) => entry.status === "foreground")?.command ?? snapshot?.shellMode ?? "nli"],
      ["Source", "derived from backend shell, task, link, camp, and tunnel state"],
    ],
  },
  scheduler: {
    title: "Scheduled Tasks",
    command: "scheduler, schtasks /query, task",
    rows: (snapshot) => [
      ["Scheduled", `${snapshot?.desktopSchedule.length ?? 0} backend schedule row(s)`],
      ["Queued", `${snapshot?.desktopSchedule.filter((entry) => entry.status === "queued").length ?? 0} queued task(s)`],
      ["Running", snapshot?.desktopSchedule.filter((entry) => entry.status === "running").slice(0, 2).map((entry) => entry.name).join(", ") || "none"],
      ["Source", "derived from backend tasks, events, mailbox, boards, and route state"],
    ],
  },
  nodes: {
    title: "My Nodes",
    command: "nodes, owned, netstat",
    rows: (snapshot) => [
      ["Current host", snapshot?.currentHost ?? "cyberscape"],
      ["Account", snapshot?.loggedIn ? `${snapshot.username} home=${snapshot.homeHost}` : "guest session, use newuser or login"],
      ["Access", `${snapshot?.loginHosts ?? 0} login hosts, ${snapshot?.rootHosts ?? 0} root hosts`],
      ["Nodes", snapshot?.desktopNodes.length ? snapshot.desktopNodes.slice(0, 3).map((entry) => `${entry.host}:${entry.role}`).join(", ") : "none"],
      ["History", `${snapshot?.commandHistory.length ?? 0} recent command(s)`],
    ],
  },
  network: {
    title: "Network Places",
    command: "network, bookmark route <host>",
    rows: (snapshot) => [
      ["Remote depth", `${snapshot?.remoteDepth ?? 0} active hop(s)`],
      ["Route state", snapshot?.tunnel ?? "no active tunnel"],
      ["Visible hosts", snapshot?.desktopNetwork.length ? snapshot.desktopNetwork.slice(0, 3).map((entry) => `${entry.host}:${entry.access}`).join(", ") : "none"],
      ["Bookmarks", snapshot?.desktopBookmarks.length ? snapshot.desktopBookmarks.slice(0, 3).map((bookmark) => bookmark.target).join(", ") : "none"],
      ["BBS", snapshot?.desktopNetwork.some((entry) => entry.bbs) ? "board-capable hosts visible" : "no board hosts in view"],
    ],
  },
  dialup: {
    title: "Dial-Up Networking",
    command: "dialup, dial <number|host>, trace <host>, telnet <host>",
    rows: (snapshot) => [
      ["Connections", snapshot?.desktopDialup.length ? snapshot.desktopDialup.slice(0, 3).map((entry) => `${entry.name}:${entry.status}`).join(", ") : "none"],
      ["Numbers", snapshot?.desktopDialup.length ? snapshot.desktopDialup.slice(0, 3).map((entry) => `${entry.host}:${entry.number}`).join(", ") : "none"],
      ["Saved", `${snapshot?.desktopDialup.filter((entry) => entry.status === "saved").length ?? 0} saved route(s)`],
      ["Active", snapshot?.desktopDialup.find((entry) => entry.status === "connected")?.host ?? snapshot?.currentHost ?? "cyberscape"],
      ["Source", "derived from visible routes, bookmarks, tunnel, and watcher state"],
    ],
  },
  lineage: {
    title: "Connection Lineage",
    command: "lineage, era, modems, dialup, dial <number|host>",
    rows: (snapshot) => [
      ["Rows", `${snapshot?.desktopLineage.length ?? 0} backend lineage row(s)`],
      ["Eras", snapshot?.desktopLineage.map((entry) => entry.era).slice(0, 5).join(", ") || "none"],
      ["Current", snapshot?.desktopLineage.find((entry) => entry.status === "connected")?.method ?? snapshot?.desktopLineage[0]?.method ?? "none"],
      ["Source", "derived from backend routes, dial-up rows, network places, and connection state"],
    ],
  },
  remote: {
    title: "Remote Desktop Connection",
    command: "remote, mstsc, mstsc.exe, tsclient",
    rows: (snapshot) => [
      ["Profiles", `${snapshot?.desktopRemote.length ?? 0} backend remote profile row(s)`],
      ["Ready", snapshot?.desktopRemote.filter((entry) => entry.status === "connected" || entry.status === "credentialed" || entry.status === "available").slice(0, 3).map((entry) => `${entry.host}:${entry.status}`).join(", ") || "none"],
      ["Display", snapshot?.desktopRemote[0]?.display ?? "console"],
      ["Source", "derived from backend visible hosts, access, routes, tunnel, bookmarks, and tasks"],
    ],
  },
  runbox: {
    title: "Run",
    command: "runbox, start, explorer, cmd.exe, command.com, runas",
    rows: (snapshot) => [
      ["Targets", `${snapshot?.desktopRun.length ?? 0} backend run target row(s)`],
      ["Ready", snapshot?.desktopRun.filter((entry) => entry.status === "ready" || entry.status === "recent").slice(0, 3).map((entry) => entry.command).join(", ") || "none"],
      ["Recent", snapshot?.desktopRun.find((entry) => entry.status === "recent")?.command ?? "none"],
      ["Source", "derived from backend commands, desktop apps, command history, files, and session state"],
    ],
  },
  devices: {
    title: "Device Manager",
    command: "devices, devmgmt",
    rows: (snapshot) => [
      ["Devices", snapshot?.desktopDevices.length ? snapshot.desktopDevices.slice(0, 3).map((entry) => `${entry.name}:${entry.status}`).join(", ") : "none"],
      ["Warnings", `${snapshot?.desktopDevices.filter((entry) => entry.status === "warning").length ?? 0} warning(s)`],
      ["Busy", `${snapshot?.desktopDevices.filter((entry) => entry.status === "busy").length ?? 0} busy device(s)`],
      ["Source", "derived from host ports, tasks, tty, files, dial-up, and print queues"],
    ],
  },
  security: {
    title: "Security Center",
    command: "security, inspect, secure",
    rows: (snapshot) => [
      ["Posture", snapshot?.desktopSecurity.length ? snapshot.desktopSecurity.slice(0, 3).map((entry) => `${entry.host}:${entry.posture}`).join(", ") : "none"],
      ["Checks", snapshot?.desktopSecurity.flatMap((entry) => entry.checks).slice(0, 3).join(" | ") || "baseline"],
      ["Actions", snapshot?.desktopSecurity.flatMap((entry) => entry.actions).slice(0, 3).join(" | ") || "inspect first"],
      ["Audit", `${snapshot?.desktopEvents.filter((event) => event.level === "audit").length ?? 0} audit event(s)`],
    ],
  },
  services: {
    title: "Services",
    command: "services, netstat, inspect",
    rows: (snapshot) => [
      ["Visible", snapshot?.desktopServices.length ? snapshot.desktopServices.slice(0, 3).map((entry) => `${entry.host}:${entry.name}`).join(", ") : "none"],
      ["Reachable", `${snapshot?.desktopServices.filter((entry) => entry.status !== "restricted").length ?? 0} service(s)`],
      ["Actions", snapshot?.desktopServices.flatMap((entry) => entry.actions).slice(0, 3).join(" | ") || "inspect first"],
      ["Current", `${snapshot?.currentHost ?? "cyberscape"} service table from backend state`],
    ],
  },
  shares: {
    title: "Shared Folders",
    command: "shares, files, cd",
    rows: (snapshot) => [
      ["Visible", snapshot?.desktopShares.length ? snapshot.desktopShares.slice(0, 3).map((entry) => `${entry.host}\\\\${entry.name}`).join(", ") : "none"],
      ["Writable", `${snapshot?.desktopShares.filter((entry) => entry.writable).length ?? 0} share(s)`],
      ["Actions", snapshot?.desktopShares.flatMap((entry) => entry.actions).slice(0, 3).join(" | ") || "files first"],
      ["Scope", "derived from visible files, downloads, and home storage"],
    ],
  },
  printers: {
    title: "Printers",
    command: "printers, printq, task transfer",
    rows: (snapshot) => [
      ["Queues", snapshot?.desktopPrint.length ? snapshot.desktopPrint.slice(0, 3).map((entry) => `${entry.host}:${entry.queue}`).join(", ") : "none"],
      ["Held", `${snapshot?.desktopPrint.filter((entry) => entry.status === "held").length ?? 0} held job(s)`],
      ["Actions", snapshot?.desktopPrint.flatMap((entry) => entry.actions).slice(0, 3).join(" | ") || "files first"],
      ["Source", "derived from tasks, files, and recent events"],
    ],
  },
  registry: {
    title: "Registry Editor",
    command: "registry, reg query",
    rows: (snapshot) => [
      ["Hives", snapshot?.desktopRegistry.length ? Array.from(new Set(snapshot.desktopRegistry.map((entry) => entry.hive))).join(", ") : "none"],
      ["Writable", `${snapshot?.desktopRegistry.filter((entry) => entry.writable).length ?? 0} setting key(s)`],
      ["Current", snapshot?.desktopRegistry.filter((entry) => entry.source === "session").slice(0, 3).map((entry) => `${entry.name}=${entry.value}`).join(", ") || "no session keys"],
      ["Source", "derived from backend state, prefs, host graph, and access"],
    ],
  },
  files: {
    title: "Files",
    command: "files, cat <file>, write <file> <text>",
    rows: (snapshot) => [
      ["cwd", snapshot?.cwd ?? "/"],
      ["downloads", `${snapshot?.downloads ?? 0} server-tracked file(s)`],
      ["visible files", snapshot?.desktopFiles.length ? snapshot.desktopFiles.slice(0, 3).map((entry) => entry.name).join(", ") : "none"],
      ["home files", `${snapshot?.desktopFiles.filter((entry) => entry.kind === "home").length ?? 0} user file(s)`],
      ["host files", `visible through ${snapshot?.currentHost ?? "cyberscape"} context`],
    ],
  },
  boards: {
    title: "Boards",
    command: "boards, bbs, news",
    rows: (snapshot) => [
      ["Messages", `${snapshot?.desktopBoards.length ?? 0} visible item(s)`],
      ["Latest", snapshot?.desktopBoards.at(0) ? `${snapshot.desktopBoards[0]!.subject} (${snapshot.desktopBoards[0]!.kind})` : "none"],
      ["USENET", snapshot?.desktopBoards.some((entry) => entry.kind === "usenet") ? "groups, search, posts, and archive readers" : "no archive summaries"],
      ["Signals", "old posts can imply routes, accounts, and maintenance habits"],
    ],
  },
  mail: {
    title: "Mail",
    command: "mailbox, inbox, send",
    rows: (snapshot) => [
      ["Inbox", `${snapshot?.desktopMail.length ?? 0} message(s)`],
      ["Preview", snapshot?.desktopMail.at(0) ? `${snapshot.desktopMail[0]!.subject} from ${snapshot.desktopMail[0]!.from}` : "none"],
      ["Compose", "mail mode writes durable server messages"],
      ["Receipts", "future jobs and host events can report here"],
    ],
  },
  tasks: {
    title: "Tasks",
    command: "tasks, task scan <host>",
    rows: (snapshot) => [
      ["Jobs", snapshot?.desktopTasks.filter((task) => task.status !== "done").length
        ? snapshot.desktopTasks.filter((task) => task.status !== "done").slice(0, 3).map((task) => `${task.kind}:${task.target}`).join(", ")
        : "no queued desktop tasks"],
      ["Camp", snapshot?.campHost ? `watching ${snapshot.campHost}` : "no camp set"],
      ["Tunnel", snapshot?.tunnel ?? "no active tunnel"],
    ],
  },
  logs: {
    title: "Logs",
    command: "events, eventvwr, logs",
    rows: (snapshot) => [
      ["Session", `tty ${snapshot?.ttyPort ?? "----"} mode=${snapshot?.shellMode ?? "nli"} stty=${snapshot?.stty ?? "normal"}`],
      ["Progress", `${snapshot?.badges ?? 0} badge(s), current host ${snapshot?.currentHost ?? "cyberscape"}`],
      ["Events", `${snapshot?.desktopEvents.length ?? 0} recorded`],
      ["Last event", snapshot?.desktopEvents.at(-1)?.message ?? "none"],
      ["Recent", snapshot?.desktopEvents.length ? snapshot.desktopEvents.slice(-2).map((event) => `${event.source}:${event.message}`).join(" | ") : "none"],
      ["Last command", snapshot?.commandHistory.at(-1)?.line ?? "none"],
      ["Audit", "takeover, secure, tunnel, and camp actions leave readable traces"],
    ],
  },
  help: {
    title: "Help and Support Center",
    command: "support, helpctr, help <command>",
    rows: (snapshot) => [
      ["Topics", `${snapshot?.desktopHelp.length ?? 0} backend support row(s)`],
      ["Commands", snapshot?.desktopHelp.filter((entry) => entry.section === "Commands").slice(0, 3).map((entry) => entry.topic).join(", ") || "none"],
      ["Workstation", snapshot?.desktopHelp.filter((entry) => entry.section === "Workstation").slice(0, 3).map((entry) => entry.topic).join(", ") || "none"],
      ["Source", "derived from backend command help, applets, history, bookmarks, tasks, events, services, and connection state"],
    ],
  },
  settings: {
    title: "Settings",
    command: "theme <nt|2000|xp|7>, stty",
    rows: (snapshot) => [
      ["Theme", `${snapshot?.desktopTheme ?? "xp"} stored by the backend`],
      ["Keyboard", snapshot?.desktopPrefs.keyboardMode ?? "desktop"],
      ["Terminal mode", `${snapshot?.stty ?? "normal"} output shaping`],
      ["Fallback", "the plain HTML route uses the same command engine"],
    ],
  },
};

export function Terminal() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [prompt, setPrompt] = useState(".");
  const [stty, setStty] = useState<SttyMode>("normal");
  const [pagerActive, setPagerActive] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [clock, setClock] = useState("--:--");
  const [desktopTheme, setDesktopTheme] = useState<DesktopTheme>("xp");
  const [desktopSnapshot, setDesktopSnapshot] = useState<DesktopSnapshot | null>(null);
  const [activeApp, setActiveApp] = useState<DesktopAppId>("terminal");
  const [openApps, setOpenApps] = useState<DesktopAppId[]>(["terminal"]);
  const [minimizedApps, setMinimizedApps] = useState<DesktopAppId[]>([]);
  const [maximizedApps, setMaximizedApps] = useState<DesktopAppId[]>([]);
  const [windowPositions, setWindowPositions] = useState<DesktopWindowPositions>({});
  const [desktopPrefs, setDesktopPrefs] = useState<DesktopPrefs>(defaultDesktopPrefs);
  const [startOpen, setStartOpen] = useState(false);
  const [taskSwitcherOpen, setTaskSwitcherOpen] = useState(false);
  const [taskSwitcherIndex, setTaskSwitcherIndex] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const statusText = pagerActive ? "PAGING" : stty.toUpperCase();
  const switchableApps = openApps.filter((app) => !minimizedApps.includes(app));

  const appendOutput = useCallback((out: string[]) => {
    setLines((prev) => {
      const next = [...prev];
      for (const line of out) {
        if (line === "\x0c") return [];
        next.push(line);
      }
      return next;
    });
  }, []);

  const applyShellResponse = useCallback(
    (data: ShellResponse, showOutput = true) => {
      setSessionId(data.sessionId);
      setPrompt(data.prompt);
      setStty(data.stty ?? "normal");
      setDesktopTheme(data.desktopTheme ?? "xp");
      setDesktopSnapshot(data.desktopSnapshot ?? null);
      setActiveApp(data.desktopActiveApp ?? data.desktopSnapshot?.desktopActiveApp ?? "terminal");
      setOpenApps(data.desktopOpenApps ?? data.desktopSnapshot?.desktopOpenApps ?? ["terminal"]);
      setMinimizedApps(data.desktopMinimizedApps ?? data.desktopSnapshot?.desktopMinimizedApps ?? []);
      setMaximizedApps(data.desktopMaximizedApps ?? data.desktopSnapshot?.desktopMaximizedApps ?? []);
      setWindowPositions(data.desktopWindowPositions ?? data.desktopSnapshot?.desktopWindowPositions ?? {});
      setDesktopPrefs(data.desktopPrefs ?? data.desktopSnapshot?.desktopPrefs ?? defaultDesktopPrefs);
      const serverHistory = data.commandHistory ?? data.desktopSnapshot?.commandHistory ?? [];
      if (serverHistory.length) setHistory(serverHistory.map((entry) => entry.line));
      setPagerActive(Boolean(data.pager));
      if (showOutput) appendOutput(data.output);
    },
    [appendOutput]
  );

  const postShell = useCallback(
    async (
      payload: {
        line?: string;
        desktopActiveApp?: DesktopAppId;
        desktopOpenApps?: DesktopAppId[];
        desktopMinimizedApps?: DesktopAppId[];
        desktopMaximizedApps?: DesktopAppId[];
        desktopWindowPositions?: DesktopWindowPositions;
        desktopPrefs?: DesktopPrefs;
        desktopPref?: { key: string; value: string };
      },
      options?: { showOutput?: boolean },
    ) => {
      const res = await fetch("/api/shell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, ...payload }),
      });
      const data: ShellResponse = await res.json();
      applyShellResponse(data, options?.showOutput ?? true);
    },
    [sessionId, applyShellResponse]
  );

  const runCommand = useCallback(
    async (line: string, options?: { showOutput?: boolean }) => {
      await postShell({ line }, options);
    },
    [postShell]
  );

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/shell", { method: "POST", body: JSON.stringify({}) });
      const data: ShellResponse = await res.json();
      applyShellResponse(data);
    })();
  }, [applyShellResponse]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    const updateClock = () => setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const changeTheme = (nextTheme: DesktopTheme) => {
    setStartOpen(false);
    setDesktopTheme(nextTheme);
    if (!sessionId) return;
    void runCommand(`theme ${nextTheme}`, { showOutput: false });
  };

  const openApp = (appId: DesktopAppId) => {
    setStartOpen(false);
    setActiveApp(appId);
    setOpenApps((apps) => Array.from(new Set([...apps, appId, "terminal"])));
    setMinimizedApps((apps) => apps.filter((item) => item !== appId));
    if (!sessionId) return;
    void fetch("/api/shell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, desktopActiveApp: appId }),
    });
  };

  const persistDesktopPresentation = (payload: {
    desktopActiveApp: DesktopAppId;
    desktopOpenApps: DesktopAppId[];
    desktopMinimizedApps: DesktopAppId[];
    desktopMaximizedApps?: DesktopAppId[];
    desktopWindowPositions?: DesktopWindowPositions;
    desktopPrefs?: DesktopPrefs;
    desktopPref?: { key: string; value: string };
  }) => {
    if (!sessionId) return;
    void fetch("/api/shell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, ...payload }),
    });
  };

  const moveWindow = (appId: DesktopAppId, x: number, y: number) => {
    const bounded = {
      x: Math.max(0, Math.min(640, Math.round(x))),
      y: Math.max(0, Math.min(420, Math.round(y))),
    };
    const nextPositions = { ...windowPositions, [appId]: bounded };
    setWindowPositions(nextPositions);
    persistDesktopPresentation({
      desktopActiveApp: appId,
      desktopOpenApps: openApps,
      desktopMinimizedApps: minimizedApps,
      desktopMaximizedApps: maximizedApps.filter((item) => item !== appId),
      desktopWindowPositions: nextPositions,
    });
  };

  const changeDesktopPref = (key: keyof DesktopPrefs, value: DesktopPrefs[keyof DesktopPrefs]) => {
    setDesktopPrefs((currentPrefs) => {
      const nextPrefs = { ...currentPrefs, [key]: value };
      persistDesktopPresentation({
        desktopActiveApp: activeApp,
        desktopOpenApps: openApps,
        desktopMinimizedApps: minimizedApps,
        desktopMaximizedApps: maximizedApps,
        desktopWindowPositions: windowPositions,
        desktopPrefs: nextPrefs,
        desktopPref: { key, value },
      });
      return nextPrefs;
    });
  };

  const stageCommand = (command: string) => {
    setInput(command);
    openApp("terminal");
    inputRef.current?.focus();
  };

  const startWindowDrag = (appId: DesktopAppId, index: number, event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    openApp(appId);
    const start = windowPositions[appId] ?? defaultWindowPosition(appId, index);
    const origin = { x: event.clientX, y: event.clientY };
    const onMove = (moveEvent: PointerEvent) => {
      const x = start.x + moveEvent.clientX - origin.x;
      const y = start.y + moveEvent.clientY - origin.y;
      setWindowPositions((positions) => ({
        ...positions,
        [appId]: {
          x: Math.max(0, Math.min(640, Math.round(x))),
          y: Math.max(0, Math.min(420, Math.round(y))),
        },
      }));
    };
    const onUp = (upEvent: PointerEvent) => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      moveWindow(appId, start.x + upEvent.clientX - origin.x, start.y + upEvent.clientY - origin.y);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp, { once: true });
  };

  const minimizeApp = (appId: DesktopAppId) => {
    if (appId === "terminal") return;
    const nextMinimized = Array.from(new Set([...minimizedApps, appId]));
    const nextMaximized = maximizedApps.filter((item) => item !== appId);
    const nextActive = activeApp === appId
      ? openApps.find((item) => item !== appId && !nextMinimized.includes(item)) ?? "terminal"
      : activeApp;
    setMinimizedApps(nextMinimized);
    setMaximizedApps(nextMaximized);
    setActiveApp(nextActive);
    persistDesktopPresentation({ desktopActiveApp: nextActive, desktopOpenApps: openApps, desktopMinimizedApps: nextMinimized, desktopMaximizedApps: nextMaximized });
  };

  const toggleMaximizeApp = (appId: DesktopAppId) => {
    if (appId === "terminal") return;
    const isMaximized = maximizedApps.includes(appId);
    const nextMaximized: DesktopAppId[] = isMaximized
      ? maximizedApps.filter((item) => item !== appId)
      : Array.from(new Set([...maximizedApps, appId]));
    const nextOpen: DesktopAppId[] = Array.from(new Set([...openApps, appId, "terminal" as DesktopAppId]));
    const nextMinimized = minimizedApps.filter((item) => item !== appId);
    setOpenApps(nextOpen);
    setMinimizedApps(nextMinimized);
    setMaximizedApps(nextMaximized);
    setActiveApp(appId);
    persistDesktopPresentation({
      desktopActiveApp: appId,
      desktopOpenApps: nextOpen,
      desktopMinimizedApps: nextMinimized,
      desktopMaximizedApps: nextMaximized,
    });
  };

  const closeApp = (appId: DesktopAppId) => {
    if (appId === "terminal") return;
    const nextOpen = openApps.filter((item) => item === "terminal" || item !== appId);
    const nextMinimized = minimizedApps.filter((item) => item !== appId);
    const nextMaximized = maximizedApps.filter((item) => item !== appId);
    const nextActive = activeApp === appId ? "terminal" : activeApp;
    setOpenApps(nextOpen);
    setMinimizedApps(nextMinimized);
    setMaximizedApps(nextMaximized);
    setActiveApp(nextActive);
    persistDesktopPresentation({ desktopActiveApp: nextActive, desktopOpenApps: nextOpen, desktopMinimizedApps: nextMinimized, desktopMaximizedApps: nextMaximized });
  };

  useEffect(() => {
    const onGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setStartOpen(false);
        setTaskSwitcherOpen(false);
        return;
      }
      if (desktopPrefs.keyboardMode === "terminal") return;
      if (event.ctrlKey && event.key === "Escape") {
        event.preventDefault();
        setTaskSwitcherOpen(false);
        setStartOpen((open) => !open);
        return;
      }
      if (!event.altKey || event.key !== "Tab") return;
      event.preventDefault();
      const apps = switchableApps.length ? switchableApps : ["terminal" as DesktopAppId];
      const currentIndex = Math.max(0, apps.indexOf(activeApp));
      const direction = event.shiftKey ? -1 : 1;
      const nextIndex = (currentIndex + direction + apps.length) % apps.length;
      const nextApp = apps[nextIndex] ?? "terminal";
      setTaskSwitcherIndex(nextIndex);
      setTaskSwitcherOpen(true);
      openApp(nextApp);
    };
    const onGlobalKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Alt") setTaskSwitcherOpen(false);
    };
    window.addEventListener("keydown", onGlobalKeyDown);
    window.addEventListener("keyup", onGlobalKeyUp);
    return () => {
      window.removeEventListener("keydown", onGlobalKeyDown);
      window.removeEventListener("keyup", onGlobalKeyUp);
    };
  }, [activeApp, desktopPrefs.keyboardMode, switchableApps, openApp]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const line = input.trimEnd();
    if (pagerActive) {
      if (line) {
        setLines((p) => [...p, `${prompt} ${line}`]);
      }
      setInput("");
      setHistIdx(-1);
      void runCommand(line || "__more__");
      return;
    }
    if (!line) return;
    setLines((p) => [...p, `${prompt} ${line}`]);
    setHistory((h) => [...h, line]);
    setHistIdx(-1);
    setInput("");
    void runCommand(line);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (pagerActive && e.key === " ") {
      e.preventDefault();
      setInput("");
      void runCommand("__more__");
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx < 0) return;
      const idx = histIdx + 1;
      if (idx >= history.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(idx);
        setInput(history[idx] ?? "");
      }
    }
  };

  return (
    <section
      className={cn(
        "cyberscape-desktop",
        `cyberscape-era-${desktopTheme}`,
        desktopPrefs.motion === "reduced" && "cyberscape-motion-reduced",
        desktopPrefs.fontSize === "large" && "cyberscape-font-large",
        desktopPrefs.contrast === "high" && "cyberscape-contrast-high",
      )}
      aria-label="Cyberscape desktop"
      data-era={desktopTheme}
    >
      <div className="cyberscape-icons" aria-label="Desktop apps">
        {desktopApps.map((app) => (
          <button
            key={app.id}
            type="button"
            className={cn("cyberscape-desktop-icon", activeApp === app.id && "is-active")}
            aria-label={`Open ${app.label}`}
            aria-pressed={activeApp === app.id}
            onClick={() => openApp(app.id)}
          >
            <span className="cyberscape-glyph" data-icon={app.icon} aria-hidden="true" />
            <span>{app.label}</span>
          </button>
        ))}
      </div>
      {taskSwitcherOpen ? (
        <div className="cyberscape-task-switcher" role="listbox" aria-label="Open windows">
          <div className="cyberscape-task-switcher-title">Switch windows</div>
          <div className="cyberscape-task-switcher-grid">
            {switchableApps.map((app, index) => {
              const meta = desktopApps.find((item) => item.id === app) ?? desktopApps[0];
              return (
                <div
                  key={app}
                  role="option"
                  aria-selected={index === taskSwitcherIndex}
                  className={cn("cyberscape-task-switcher-item", index === taskSwitcherIndex && "is-active")}
                >
                  <span className="cyberscape-glyph" data-icon={meta.icon} aria-hidden="true" />
                  <span>{meta.label}</span>
                </div>
              );
            })}
          </div>
          <div className="cyberscape-task-switcher-hint">Alt+Tab cycles · Esc closes</div>
        </div>
      ) : null}
      {openApps.filter((app): app is Exclude<DesktopAppId, "terminal"> => app !== "terminal" && !minimizedApps.includes(app)).map((app, index) => (
        <div
          key={app}
          className={cn(
            "cyberscape-window cyberscape-app-window",
            activeApp === app && "is-active",
            maximizedApps.includes(app) && "is-maximized",
          )}
          aria-label={`${desktopAppContent[app].title} window`}
          style={{
            "--cyberscape-window-x": `${(windowPositions[app] ?? defaultWindowPosition(app, index)).x}px`,
            "--cyberscape-window-y": `${(windowPositions[app] ?? defaultWindowPosition(app, index)).y}px`,
          } as React.CSSProperties}
          onMouseDown={() => openApp(app)}
        >
          <div className="cyberscape-titlebar cyberscape-titlebar-draggable" onPointerDown={(event) => startWindowDrag(app, index, event)}>
            <div className="flex min-w-0 items-center gap-2">
              <span className="cyberscape-glyph cyberscape-glyph-title" data-icon={desktopApps.find((item) => item.id === app)?.icon ?? "folder"} aria-hidden="true" />
              <span className="truncate">{desktopAppContent[app].title}</span>
            </div>
            <div className="cyberscape-window-buttons" onPointerDown={(event) => event.stopPropagation()}>
              <button type="button" aria-label={`Minimize ${desktopAppContent[app].title}`} onClick={(event) => {
                event.stopPropagation();
                minimizeApp(app);
              }}>_</button>
              <button type="button" aria-label={`${maximizedApps.includes(app) ? "Restore" : "Maximize"} ${desktopAppContent[app].title}`} onClick={(event) => {
                event.stopPropagation();
                toggleMaximizeApp(app);
              }}>□</button>
              <button type="button" aria-label={`Close ${desktopAppContent[app].title}`} onClick={(event) => {
                event.stopPropagation();
                closeApp(app);
              }}>×</button>
            </div>
          </div>
          <div className="cyberscape-app-body">
            <div className="cyberscape-app-toolbar">
              <span>Command parity</span>
              <code>{desktopAppContent[app].command}</code>
            </div>
            <dl>
              {desktopAppContent[app].rows(desktopSnapshot).map(([term, detail]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
            {app === "settings" ? (
              <div className="cyberscape-settings-controls" aria-label="Desktop accessibility settings">
                <fieldset>
                  <legend>Motion</legend>
                  {(["normal", "reduced"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={cn(desktopPrefs.motion === value && "is-active")}
                      aria-pressed={desktopPrefs.motion === value}
                      onClick={() => changeDesktopPref("motion", value)}
                    >
                      {value}
                    </button>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>Font</legend>
                  {(["normal", "large"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={cn(desktopPrefs.fontSize === value && "is-active")}
                      aria-pressed={desktopPrefs.fontSize === value}
                      onClick={() => changeDesktopPref("fontSize", value)}
                    >
                      {value}
                    </button>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>Contrast</legend>
                  {(["normal", "high"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={cn(desktopPrefs.contrast === value && "is-active")}
                      aria-pressed={desktopPrefs.contrast === value}
                      onClick={() => changeDesktopPref("contrast", value)}
                    >
                      {value}
                    </button>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>Sound</legend>
                  {(["muted", "on"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={cn(desktopPrefs.sound === value && "is-active")}
                      aria-pressed={desktopPrefs.sound === value}
                      onClick={() => changeDesktopPref("sound", value)}
                    >
                      {value}
                    </button>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>Keyboard</legend>
                  {(["desktop", "terminal"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={cn(desktopPrefs.keyboardMode === value && "is-active")}
                      aria-pressed={desktopPrefs.keyboardMode === value}
                      onClick={() => changeDesktopPref("keyboardMode", value)}
                    >
                      {value}
                    </button>
                  ))}
                </fieldset>
                <fieldset>
                  <legend>Control</legend>
                  <button type="button" onClick={() => stageCommand("desktop export")}>export</button>
                  <button type="button" onClick={() => stageCommand("desktop reset layout")}>reset layout</button>
                  <button type="button" onClick={() => stageCommand("desktop reset prefs")}>reset prefs</button>
                </fieldset>
              </div>
            ) : null}
            <button
              type="button"
              className="cyberscape-app-command"
              onClick={() => {
                stageCommand(desktopAppContent[app].command.split(",")[0] ?? "");
              }}
            >
              Send command to prompt
            </button>
          </div>
        </div>
      ))}
      <div className="cyberscape-window">
        <div className="cyberscape-titlebar">
          <div className="flex min-w-0 items-center gap-2">
            <span className="cyberscape-glyph cyberscape-glyph-title" data-icon="terminal" aria-hidden="true" />
            <span className="truncate">Command Prompt - session {sessionId?.slice(0, 8) ?? "starting"}</span>
          </div>
          <div className="cyberscape-window-buttons" aria-hidden="true">
            <span>_</span><span>□</span><span>×</span>
          </div>
        </div>
        <div
          className={cn(
            "cyberscape-console",
            stty === "normal" && "cyberscape-console-normal",
            stty === "tty" && "cyberscape-console-tty",
            stty === "dumb" && "cyberscape-console-dumb"
          )}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="cyberscape-console-strip">
            <span>{statusText}</span>
            <span>{prompt}</span>
          </div>
          <ScrollArea className="flex-1 p-4">
            <pre className="whitespace-pre-wrap break-words">
              {lines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </pre>
            <div ref={bottomRef} />
          </ScrollArea>
          {pagerActive ? (
            <div
              className={cn(
                "border-t px-3 py-1",
                stty === "dumb"
                  ? "border-zinc-300 bg-zinc-100 text-zinc-950"
                  : "border-zinc-800 bg-zinc-900/95 text-amber-400"
              )}
            >
              --More-- Space/Enter next, b back, g/G top/bottom, /text search, q quit
            </div>
          ) : null}
          <form
            className={cn(
              "flex items-center gap-2 border-t px-3 py-2",
              stty === "dumb" ? "border-zinc-300 bg-white" : "border-zinc-800 bg-zinc-900/80"
            )}
            onSubmit={onSubmit}
          >
            <span className={cn("shrink-0", stty === "dumb" ? "text-zinc-700" : "text-amber-400")}>
              {prompt}
            </span>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className={cn(
                "border-0 bg-transparent font-mono shadow-none focus-visible:ring-0",
                stty === "normal" && "text-green-400",
                stty === "tty" && "text-amber-300",
                stty === "dumb" && "text-zinc-950"
              )}
              autoComplete="off"
              spellCheck={false}
          aria-label="Cyberscape command line"
            />
          </form>
        </div>
        <div className="cyberscape-taskbar">
          {startOpen ? (
            <div className="cyberscape-start-menu" role="menu" aria-label="Start menu">
              <div className="cyberscape-start-menu-banner">
                <span className="cyberscape-glyph cyberscape-glyph-start" data-icon="start" aria-hidden="true" />
                <span>{desktopSnapshot?.username ?? "guest"}@{desktopSnapshot?.currentHost ?? "cyberscape"}</span>
              </div>
              <div className="cyberscape-start-menu-grid">
                {desktopApps.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    role="menuitem"
                    className={cn(app.id === activeApp && "is-active")}
                    onClick={() => openApp(app.id)}
                  >
                    <span className="cyberscape-glyph" data-icon={app.icon} aria-hidden="true" />
                    <span>{app.label}</span>
                  </button>
                ))}
              </div>
              <div className="cyberscape-start-menu-footer" aria-label="Theme shortcuts">
                {eras.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={cn(item.id === desktopTheme && "is-active")}
                    aria-pressed={item.id === desktopTheme}
                    onClick={() => changeTheme(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <button
            type="button"
            className="cyberscape-start-button"
            title="Start"
            aria-haspopup="menu"
            aria-expanded={startOpen}
            onClick={() => setStartOpen((open) => !open)}
          >
            <span className="cyberscape-glyph cyberscape-glyph-start" data-icon="start" aria-hidden="true" />
            <span>Start</span>
          </button>
          <button
            type="button"
            className={cn("cyberscape-taskbar-slot", activeApp === "terminal" && "is-active")}
            onClick={() => openApp("terminal")}
          >
            cmd.exe
          </button>
          {openApps.filter((app): app is Exclude<DesktopAppId, "terminal"> => app !== "terminal").map((app) => (
            <button
              key={app}
              type="button"
              className={cn("cyberscape-taskbar-slot", activeApp === app && "is-active", minimizedApps.includes(app) && "is-minimized")}
              onClick={() => openApp(app)}
            >
              {desktopAppContent[app].title}
            </button>
          ))}
          <div className="cyberscape-era-picker" aria-label="Desktop theme">
            {eras.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn(item.id === desktopTheme && "is-active")}
                aria-pressed={item.id === desktopTheme}
                onClick={() => changeTheme(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <span>{clock}</span>
        </div>
      </div>
    </section>
  );
}
