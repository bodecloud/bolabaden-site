import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db, ensureDb } from "@/lib/db";
import { users, hostState, mailMessages, shellSessions, basicPrograms, savedStates, bbsMessages, usenetArticles, userFiles } from "@/lib/db/schema";
import { findUucpRoute, getHost, hostCount, hostOccupants, listHosts, netstatForUser, uupath, uumap } from "@/lib/net/hosts";
import { dialCarrierPreview, dialLineProfilesForHost, dialOutcomeForHost, dialupNumberForHost, dialupSpeedForHost, type DialOutcome } from "@/lib/net/dialing";
import {
  COMMAND_HELP,
  describeCommand,
  formatCommandList,
} from "@/lib/shell/commands";
import {
  currentHost,
  initialShellState,
  isDesktopAppId,
  isDesktopTheme,
  normalizeCommandHistory,
  normalizeDesktopBookmarks,
  normalizeDesktopEvents,
  normalizeDesktopPrefs,
  normalizeDesktopTasks,
  normalizeDesktopWindowPosition,
  normalizeDesktopWindowPositions,
  normalizeDesktopWindowState,
  prompt,
  setDesktopPref,
  type CommandHistoryEntry,
  type DesktopAccessibilityEntry,
  type DesktopAccountEntry,
  type DesktopBoardEntry,
  type DesktopBookmark,
  type DesktopComputerEntry,
  type DesktopConnectionEntry,
  type DesktopControlEntry,
  type DesktopCredentialEntry,
  type DesktopDiskEntry,
  type DesktopDisplayEntry,
  type DesktopDeviceEntry,
  type DesktopDialupEntry,
  type DesktopEvent,
  type DesktopEventLevel,
  type DesktopEventViewerEntry,
  type DesktopFirewallEntry,
  type DesktopFileEntry,
  type DesktopFolderEntry,
  type DesktopHelpEntry,
  type DesktopInternetEntry,
  type DesktopKeyboardEntry,
  type DesktopLineageEntry,
  type DesktopMappedDriveEntry,
  type DesktopMailEntry,
  type DesktopModemEntry,
  type DesktopMouseEntry,
  type DesktopNetDiagnosticEntry,
  type DesktopNetSetupEntry,
  type DesktopNetworkEntry,
  type DesktopNodeEntry,
  type DesktopOdbcEntry,
  type DesktopOfflineEntry,
  type DesktopPerformanceEntry,
  type DesktopPowerEntry,
  type DesktopPrintEntry,
  type DesktopProgramEntry,
  type DesktopProcessEntry,
  type DesktopProcessStatus,
  type DesktopRegistryEntry,
  type DesktopRegionalEntry,
  type DesktopRemoteEntry,
  type DesktopRestoreEntry,
  type DesktopRunEntry,
  type DesktopScheduleEntry,
  type DesktopSearchEntry,
  type DesktopSecurityEntry,
  type DesktopServiceEntry,
  type DesktopShareEntry,
  type DesktopSoundEntry,
  type DesktopSystemEntry,
  type DesktopTask,
  type DesktopUpdateEntry,
  type DesktopTaskKind,
  type DesktopTimeEntry,
  type DesktopAppId,
  type DesktopWindowAction,
  type ShellSessionState,
} from "@/lib/shell/types";
import { persistDownloadedFile } from "@/lib/shell/downloads";
import { beginPager, runPagerCommand, type PagerState } from "@/lib/shell/pager";
import { runBbsCommand, enterBbs } from "@/lib/bbs/engine";
import { messagesForBoard } from "@/lib/bbs/boards";
import { allBbsSysopRecords, sysopRecordsForState } from "@/lib/bbs/sysop";
import {
  attemptPorthack,
  confirmPorthack,
  attemptRootkit,
  wardial,
  badgeSummary,
  grantStarterBadges,
  progressionForBadges,
  syncUserProgress,
  unlockBadge,
} from "@/lib/progression/engine";

ensureDb();

const CAMPS_REMAINING_MS = 12_000;
const CAMP_TTL_MS = 180_000;
const TUNNEL_RECAST_MS = 18_000;
const TUNNEL_TTL_MS = 240_000;
const DESKTOP_APPS = ["terminal", "system", "control", "accounts", "credentials", "datetime", "display", "sounds", "power", "mouse", "keyboard", "accessibility", "regional", "modems", "odbc", "programs", "internet", "firewall", "updates", "performance", "restore", "computer", "disk", "eventviewer", "search", "connections", "netsetup", "netdiag", "mapdrive", "offline", "remote", "runbox", "taskmgr", "scheduler", "nodes", "network", "dialup", "lineage", "devices", "security", "services", "shares", "printers", "registry", "folders", "files", "boards", "mail", "tasks", "logs", "help", "settings"];
const DESKTOP_APP_TITLES: Record<string, string> = {
  terminal: "Terminal",
  system: "System Properties",
  control: "Control Panel",
  accounts: "User Accounts",
  credentials: "Stored User Names and Passwords",
  datetime: "Date/Time Properties",
  display: "Display Properties",
  sounds: "Sounds and Audio Devices",
  power: "Power Options",
  mouse: "Mouse Properties",
  keyboard: "Keyboard Properties",
  accessibility: "Accessibility Options",
  regional: "Regional and Language Options",
  modems: "Phone and Modem Options",
  odbc: "ODBC Data Source Administrator",
  programs: "Add/Remove Programs",
  internet: "Internet Options",
  firewall: "Windows Firewall",
  updates: "Automatic Updates",
  performance: "Performance Monitor",
  restore: "System Restore",
  computer: "Computer Management",
  disk: "Disk Management",
  eventviewer: "Event Viewer",
  search: "Search Companion",
  connections: "Network Connections",
  netsetup: "Network Setup Wizard",
  netdiag: "Network Diagnostics",
  mapdrive: "Map Network Drive",
  offline: "Offline Files",
  remote: "Remote Desktop Connection",
  runbox: "Run",
  taskmgr: "Task Manager",
  scheduler: "Scheduled Tasks",
  nodes: "My Nodes",
  network: "Network Places",
  dialup: "Dial-Up Networking",
  lineage: "Connection Lineage",
  devices: "Device Manager",
  security: "Security Center",
  services: "Services",
  shares: "Shared Folders",
  printers: "Printers",
  registry: "Registry Editor",
  folders: "Folder Options",
  files: "Files",
  boards: "Boards",
  mail: "Mail",
  tasks: "Tasks",
  logs: "Logs",
  help: "Help and Support Center",
  settings: "Settings",
};

function cleanupStealthState(state: ShellSessionState, now: number): void {
  if (state.campSince && now - state.campSince >= CAMP_TTL_MS) {
    state.campHost = null;
    state.campSince = null;
  }

  if (state.tunnel && now - state.tunnel.createdAt >= TUNNEL_TTL_MS) {
    state.tunnel = null;
  }

  if (state.campCooldownUntil !== null && now >= state.campCooldownUntil) {
    state.campCooldownUntil = null;
  }

  if (state.tunnelCooldownUntil !== null && now >= state.tunnelCooldownUntil) {
    state.tunnelCooldownUntil = null;
  }
}

function formatCooldown(until: number | null, now: number): string {
  if (until === null || until <= now) return "0s";
  return `${Math.max(1, Math.ceil((until - now) / 1000))}s`;
}

function formatBookmarkLine(bookmark: DesktopBookmark): string {
  const route = bookmark.kind === "route" && bookmark.route?.length ? ` via ${bookmark.route.join(" -> ")}` : "";
  return `${bookmark.id.padEnd(8)} ${bookmark.kind.padEnd(5)} ${bookmark.target.padEnd(16)} ${bookmark.label}${route}`;
}

function recordCommandHistory(state: ShellSessionState, line: string): void {
  const trimmed = line.trim().replace(/\s+/g, " ");
  if (!trimmed || trimmed === "__more__") return;
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  const last = state.commandHistory.at(-1);
  if (last?.line === trimmed && last.host === currentHost(state) && last.mode === state.shellMode) return;
  const nextId = (state.commandHistory.at(-1)?.id ?? 0) + 1;
  const entry: CommandHistoryEntry = {
    id: nextId,
    line: trimmed.slice(0, 160),
    host: currentHost(state),
    mode: state.shellMode,
    createdAt: Date.now(),
  };
  state.commandHistory = normalizeCommandHistory([...state.commandHistory, entry]);
}

function formatCommandHistory(entries: CommandHistoryEntry[]): string[] {
  return entries.map((entry) =>
    `${String(entry.id).padStart(3, " ")}  ${entry.host.padEnd(12)} ${entry.mode.padEnd(7)} ${entry.line}`
  );
}

function formatTaskLine(task: DesktopTask): string {
  return `${task.id.padEnd(8)} ${task.status.padEnd(6)} ${task.kind.padEnd(8)} ${task.target.padEnd(16)} ${task.label}`;
}

function formatEventLine(event: DesktopEvent): string {
  return `${String(event.id).padStart(3, " ")}  ${event.level.padEnd(5)} ${event.source.padEnd(10)} ${event.host.padEnd(12)} ${event.message}`;
}

function recordDesktopEvent(state: ShellSessionState, level: DesktopEventLevel, source: string, message: string): void {
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const event: DesktopEvent = {
    id: (state.desktopEvents.at(-1)?.id ?? 0) + 1,
    level,
    source: source.replace(/\s+/g, " ").slice(0, 32) || "shell",
    message: message.replace(/\s+/g, " ").slice(0, 140),
    host: currentHost(state),
    createdAt: Date.now(),
  };
  state.desktopEvents = normalizeDesktopEvents([...state.desktopEvents, event]);
}

function formatDesktopEvents(state: ShellSessionState, args: string[] = []): string[] {
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const action = args[0]?.toLowerCase();
  if (action === "clear" || action === "/clear") {
    state.desktopEvents = [];
    return ["Desktop events cleared."];
  }
  const query = args.join(" ").trim().toLowerCase();
  const rows = query
    ? state.desktopEvents.filter((event) =>
      event.level.includes(query) ||
      event.source.toLowerCase().includes(query) ||
      event.host.toLowerCase().includes(query) ||
      event.message.toLowerCase().includes(query)
    )
    : state.desktopEvents.slice(-12);
  return [
    "Desktop events:",
    ...(rows.length ? rows.map((event) => `  ${formatEventLine(event)}`) : ["  none"]),
    "Usage: events [search] · events clear",
  ];
}

function formatFileEntry(entry: DesktopFileEntry): string {
  const size = `${entry.size}b`;
  return `${entry.kind.padEnd(8)} ${entry.name.padEnd(22).slice(0, 22)} ${size.padStart(8)} ${entry.path}`;
}

function formatDesktopFiles(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopFileEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.kind.includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.path.toLowerCase().includes(query) ||
      entry.host.toLowerCase().includes(query)
    )
    : entries;
  return [
    query ? `Files matching "${query}":` : "Files:",
    ...(rows.length ? rows.map((entry) => `  ${formatFileEntry(entry)}`) : ["  none"]),
    "Usage: files [search] · cat <file> · write <file> <text>",
  ];
}

function formatSystemLine(entry: DesktopSystemEntry): string {
  return `${entry.group.padEnd(12).slice(0, 12)} ${entry.name.padEnd(20).slice(0, 20)} ${entry.value}`;
}

function formatDesktopSystem(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = collectDesktopSystemEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.group.toLowerCase().includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `System Properties matching "${query}":` : "System Properties:",
    "  Group        Name                 Value",
    ...(rows.length ? rows.map((entry) => `  ${formatSystemLine(entry)}`) : ["  none"]),
    "Usage: system [search] · sysdm [search] · winver · status",
  ];
}

function formatControlLine(entry: DesktopControlEntry): string {
  return `${entry.category.padEnd(14).slice(0, 14)} ${entry.applet.padEnd(24).slice(0, 24)} ${entry.status}`;
}

function formatDesktopControl(state: ShellSessionState, args: string[] = []): string[] {
  const queryArgs = args[0]?.toLowerCase() === "panel" ? args.slice(1) : args;
  const query = queryArgs.join(" ").trim().toLowerCase();
  const entries = collectDesktopControlEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.category.toLowerCase().includes(query) ||
      entry.applet.toLowerCase().includes(query) ||
      entry.status.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Control Panel matching "${query}":` : "Control Panel:",
    "  Category       Applet                   Status",
    ...(rows.length ? rows.map((entry) => `  ${formatControlLine(entry)}`) : ["  none"]),
    "Usage: control [search] · control panel [search] · cpl [search]",
  ];
}

function formatAccountLine(entry: DesktopAccountEntry): string {
  return `${entry.scope.padEnd(12).slice(0, 12)} ${entry.name.padEnd(18).slice(0, 18)} ${entry.value}`;
}

function formatDesktopAccounts(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopAccountEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.scope.toLowerCase().includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `User Accounts matching "${query}":` : "User Accounts:",
    "  Scope        Name              Value",
    ...(rows.length ? rows.map((entry) => `  ${formatAccountLine(entry)}`) : ["  none"]),
    "Usage: accounts [search] · nusrmgr.cpl [search] · users · who · finger · whoami · set key",
  ];
}

function formatTimeLine(entry: DesktopTimeEntry): string {
  return `${entry.tab.padEnd(14).slice(0, 14)} ${entry.name.padEnd(18).slice(0, 18)} ${entry.value}`;
}

function formatDesktopTime(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopTimeEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tab.toLowerCase().includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Date/Time Properties matching "${query}":` : "Date/Time Properties:",
    "  Tab            Name              Value",
    ...(rows.length ? rows.map((entry) => `  ${formatTimeLine(entry)}`) : ["  none"]),
    "Usage: datetime [search] · timedate.cpl [search] · date · clock · when · ddate · scheduler",
  ];
}

function formatDisplayLine(entry: DesktopDisplayEntry): string {
  return `${entry.tab.padEnd(12).slice(0, 12)} ${entry.setting.padEnd(18).slice(0, 18)} ${entry.value}`;
}

function formatDesktopDisplay(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopDisplayEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tab.toLowerCase().includes(query) ||
      entry.setting.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Display Properties matching "${query}":` : "Display Properties:",
    "  Tab          Setting            Value",
    ...(rows.length ? rows.map((entry) => `  ${formatDisplayLine(entry)}`) : ["  none"]),
    "Usage: display [search] · desk.cpl [search] · theme · theme pref · desktop move",
  ];
}

function formatSoundLine(entry: DesktopSoundEntry): string {
  return `${entry.tab.padEnd(12).slice(0, 12)} ${entry.item.padEnd(22).slice(0, 22)} ${entry.value}`;
}

function formatDesktopSounds(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopSoundEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tab.toLowerCase().includes(query) ||
      entry.item.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Sounds and Audio Devices matching "${query}":` : "Sounds and Audio Devices:",
    "  Tab          Item                   Value",
    ...(rows.length ? rows.map((entry) => `  ${formatSoundLine(entry)}`) : ["  none"]),
    "Usage: sounds [search] · mmsys.cpl [search] · theme pref sound muted|on · events · taskmgr",
  ];
}

function formatPowerLine(entry: DesktopPowerEntry): string {
  return `${entry.scheme.padEnd(14).slice(0, 14)} ${entry.setting.padEnd(22).slice(0, 22)} ${entry.value}`;
}

function formatDesktopPower(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopPowerEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.scheme.toLowerCase().includes(query) ||
      entry.setting.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Power Options matching "${query}":` : "Power Options:",
    "  Scheme         Setting                Value",
    ...(rows.length ? rows.map((entry) => `  ${formatPowerLine(entry)}`) : ["  none"]),
    "Usage: power [search] · powercfg.cpl [search] · taskmgr · scheduler · theme pref motion",
  ];
}

function formatMouseLine(entry: DesktopMouseEntry): string {
  return `${entry.tab.padEnd(14).slice(0, 14)} ${entry.setting.padEnd(22).slice(0, 22)} ${entry.value}`;
}

function formatDesktopMouse(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopMouseEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tab.toLowerCase().includes(query) ||
      entry.setting.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Mouse Properties matching "${query}":` : "Mouse Properties:",
    "  Tab            Setting                Value",
    ...(rows.length ? rows.map((entry) => `  ${formatMouseLine(entry)}`) : ["  none"]),
    "Usage: mouse [search] · main.cpl [search] · theme pref keyboard · desktop move",
  ];
}

function formatKeyboardLine(entry: DesktopKeyboardEntry): string {
  return `${entry.tab.padEnd(14).slice(0, 14)} ${entry.setting.padEnd(22).slice(0, 22)} ${entry.value}`;
}

function formatDesktopKeyboard(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopKeyboardEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tab.toLowerCase().includes(query) ||
      entry.setting.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Keyboard Properties matching "${query}":` : "Keyboard Properties:",
    "  Tab            Setting                Value",
    ...(rows.length ? rows.map((entry) => `  ${formatKeyboardLine(entry)}`) : ["  none"]),
    "Usage: keyboard [search] · kbd.cpl [search] · theme pref keyboard · stty",
  ];
}

function formatAccessibilityLine(entry: DesktopAccessibilityEntry): string {
  return `${entry.tab.padEnd(14).slice(0, 14)} ${entry.option.padEnd(22).slice(0, 22)} ${entry.value}`;
}

function formatDesktopAccessibility(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopAccessibilityEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tab.toLowerCase().includes(query) ||
      entry.option.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Accessibility Options matching "${query}":` : "Accessibility Options:",
    "  Tab            Option                 Value",
    ...(rows.length ? rows.map((entry) => `  ${formatAccessibilityLine(entry)}`) : ["  none"]),
    "Usage: accessibility [search] · access.cpl [search] · display · sounds · keyboard · mouse",
  ];
}

function formatRegionalLine(entry: DesktopRegionalEntry): string {
  return `${entry.tab.padEnd(14).slice(0, 14)} ${entry.setting.padEnd(22).slice(0, 22)} ${entry.value}`;
}

function formatDesktopRegional(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopRegionalEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tab.toLowerCase().includes(query) ||
      entry.setting.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Regional and Language Options matching "${query}":` : "Regional and Language Options:",
    "  Tab            Setting                Value",
    ...(rows.length ? rows.map((entry) => `  ${formatRegionalLine(entry)}`) : ["  none"]),
    "Usage: regional [search] · intl.cpl [search] · datetime · keyboard · files · boards",
  ];
}

function formatModemLine(entry: DesktopModemEntry): string {
  return `${entry.tab.padEnd(14).slice(0, 14)} ${entry.name.padEnd(22).slice(0, 22)} ${entry.value}`;
}

function formatDesktopModems(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopModemEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tab.toLowerCase().includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Phone and Modem Options matching "${query}":` : "Phone and Modem Options:",
    "  Tab            Name                   Value",
    ...(rows.length ? rows.map((entry) => `  ${formatModemLine(entry)}`) : ["  none"]),
    "Usage: modems [search] · telephon.cpl [search] · dialup · devices modem · regional",
  ];
}

function formatOdbcLine(entry: DesktopOdbcEntry): string {
  return `${entry.tab.padEnd(12).slice(0, 12)} ${entry.name.padEnd(22).slice(0, 22)} ${entry.driver.padEnd(14).slice(0, 14)} ${entry.value}`;
}

function formatDesktopOdbc(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopOdbcEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tab.toLowerCase().includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.driver.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `ODBC Data Source Administrator matching "${query}":` : "ODBC Data Source Administrator:",
    "  Tab          Name                   Driver         Value",
    ...(rows.length ? rows.map((entry) => `  ${formatOdbcLine(entry)}`) : ["  none"]),
    "Usage: odbc [search] · odbcad32 [search] · services · registry · files",
  ];
}

function formatProgramLine(entry: DesktopProgramEntry): string {
  return `${entry.status.padEnd(10).slice(0, 10)} ${entry.category.padEnd(12).slice(0, 12)} ${entry.name.padEnd(24).slice(0, 24)} ${entry.version}`;
}

function formatDesktopPrograms(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopProgramEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.category.toLowerCase().includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.version.toLowerCase().includes(query) ||
      entry.status.includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Add/Remove Programs matching "${query}":` : "Add/Remove Programs:",
    "  Status     Category     Name                     Version",
    ...(rows.length ? rows.map((entry) => `  ${formatProgramLine(entry)}`) : ["  none"]),
    "Usage: programs [search] · appwiz.cpl [search] · games · basic · ftp · gopher · task",
  ];
}

function formatInternetLine(entry: DesktopInternetEntry): string {
  return `${entry.tab.padEnd(12).slice(0, 12)} ${entry.zone.padEnd(14).slice(0, 14)} ${entry.setting.padEnd(18).slice(0, 18)} ${entry.value}`;
}

function formatDesktopInternet(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopInternetEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tab.toLowerCase().includes(query) ||
      entry.zone.toLowerCase().includes(query) ||
      entry.setting.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Internet Options matching "${query}":` : "Internet Options:",
    "  Tab          Zone           Setting            Value",
    ...(rows.length ? rows.map((entry) => `  ${formatInternetLine(entry)}`) : ["  none"]),
    "Usage: internet [search] · inetcpl [search] · network · services · security",
  ];
}

function formatFirewallLine(entry: DesktopFirewallEntry): string {
  return `${entry.tab.padEnd(12).slice(0, 12)} ${entry.name.padEnd(22).slice(0, 22)} ${entry.profile.padEnd(12).slice(0, 12)} ${entry.value}`;
}

function formatDesktopFirewall(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopFirewallEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tab.toLowerCase().includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.profile.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Windows Firewall matching "${query}":` : "Windows Firewall:",
    "  Tab          Name                   Profile      Value",
    ...(rows.length ? rows.map((entry) => `  ${formatFirewallLine(entry)}`) : ["  none"]),
    "Usage: firewall [search] · firewall.cpl [search] · security · services · network",
  ];
}

function formatUpdateLine(entry: DesktopUpdateEntry): string {
  return `${entry.tab.padEnd(12).slice(0, 12)} ${entry.name.padEnd(22).slice(0, 22)} ${entry.channel.padEnd(14).slice(0, 14)} ${entry.value}`;
}

function formatDesktopUpdates(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopUpdateEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tab.toLowerCase().includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.channel.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Automatic Updates matching "${query}":` : "Automatic Updates:",
    "  Tab          Name                   Channel        Value",
    ...(rows.length ? rows.map((entry) => `  ${formatUpdateLine(entry)}`) : ["  none"]),
    "Usage: updates [search] · wuaucpl.cpl [search] · windowsupdate [search] · programs · tasks",
  ];
}

function formatPerformanceLine(entry: DesktopPerformanceEntry): string {
  return `${entry.object.padEnd(14).slice(0, 14)} ${entry.counter.padEnd(22).slice(0, 22)} ${entry.instance.padEnd(14).slice(0, 14)} ${entry.value}`;
}

function formatDesktopPerformance(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopPerformanceEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.object.toLowerCase().includes(query) ||
      entry.counter.toLowerCase().includes(query) ||
      entry.instance.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Performance Monitor matching "${query}":` : "Performance Monitor:",
    "  Object         Counter                Instance       Value",
    ...(rows.length ? rows.map((entry) => `  ${formatPerformanceLine(entry)}`) : ["  none"]),
    "Usage: performance [search] · perfmon [search] · perfmon.msc [search] · taskmgr · services",
  ];
}

function formatRestoreLine(entry: DesktopRestoreEntry): string {
  return `${entry.tab.padEnd(14).slice(0, 14)} ${entry.name.padEnd(22).slice(0, 22)} ${entry.status.padEnd(12).slice(0, 12)} ${entry.value}`;
}

function formatDesktopRestore(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopRestoreEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tab.toLowerCase().includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.status.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `System Restore matching "${query}":` : "System Restore:",
    "  Tab            Name                   Status       Value",
    ...(rows.length ? rows.map((entry) => `  ${formatRestoreLine(entry)}`) : ["  none"]),
    "Usage: restore [search] · rstrui [search] · rstrui.exe [search] · save <name> · load <name>",
  ];
}

function formatComputerLine(entry: DesktopComputerEntry): string {
  return `${entry.tree.padEnd(28).slice(0, 28)} ${entry.node.padEnd(24).slice(0, 24)} ${entry.status.padEnd(12).slice(0, 12)} ${entry.value}`;
}

function formatDesktopComputer(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopComputerEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tree.toLowerCase().includes(query) ||
      entry.node.toLowerCase().includes(query) ||
      entry.status.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Computer Management matching "${query}":` : "Computer Management:",
    "  Tree                         Node                     Status       Value",
    ...(rows.length ? rows.map((entry) => `  ${formatComputerLine(entry)}`) : ["  none"]),
    "Usage: computer [search] · compmgmt [search] · compmgmt.msc [search] · events · shares · devices · services · scheduler",
  ];
}

function formatDiskLine(entry: DesktopDiskEntry): string {
  return `${entry.disk.padEnd(10).slice(0, 10)} ${entry.volume.padEnd(22).slice(0, 22)} ${entry.status.padEnd(12).slice(0, 12)} ${entry.capacity.padEnd(14).slice(0, 14)} ${entry.used}`;
}

function formatDesktopDisk(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopDiskEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.disk.toLowerCase().includes(query) ||
      entry.volume.toLowerCase().includes(query) ||
      entry.status.toLowerCase().includes(query) ||
      entry.capacity.toLowerCase().includes(query) ||
      entry.used.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Disk Management matching "${query}":` : "Disk Management:",
    "  Disk       Volume                 Status       Capacity       Used",
    ...(rows.length ? rows.map((entry) => `  ${formatDiskLine(entry)}`) : ["  none"]),
    "Usage: disk [search] · diskmgmt [search] · diskmgmt.msc [search] · files · shares · scores · save <name>",
  ];
}

function formatEventViewerLine(entry: DesktopEventViewerEntry): string {
  return `${entry.log.padEnd(20).slice(0, 20)} ${entry.level.padEnd(6).slice(0, 6)} ${String(entry.eventId).padEnd(5).slice(0, 5)} ${entry.source.padEnd(12).slice(0, 12)} ${entry.message}`;
}

function formatDesktopEventViewer(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopEventViewerEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.log.toLowerCase().includes(query) ||
      entry.level.toLowerCase().includes(query) ||
      String(entry.eventId).includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.message.toLowerCase().includes(query) ||
      entry.host.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Event Viewer matching "${query}":` : "Event Viewer:",
    "  Desktop events:",
    "  Log                  Level  Id    Source       Message",
    ...(rows.length ? rows.map((entry) => `  ${formatEventViewerLine(entry)}`) : ["  none"]),
    "Usage: eventviewer [search] · eventvwr.msc [search] · events [search] · logs [search]",
  ];
}

function formatSearchLine(entry: DesktopSearchEntry): string {
  return `${entry.scope.padEnd(12).slice(0, 12)} ${entry.name.padEnd(22).slice(0, 22)} ${entry.location.padEnd(20).slice(0, 20)} ${entry.summary}`;
}

function formatDesktopSearch(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopSearchEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.scope.toLowerCase().includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.location.toLowerCase().includes(query) ||
      entry.summary.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries.slice(0, 32);
  return [
    query ? `Search Companion matching "${query}":` : "Search Companion:",
    "  Scope        Name                   Location             Summary",
    ...(rows.length ? rows.map((entry) => `  ${formatSearchLine(entry)}`) : ["  none"]),
    "Usage: search [text] · find [text] · srchui [text] · files · boards · mailbox · network · services",
  ];
}

function formatConnectionLine(entry: DesktopConnectionEntry): string {
  return `${entry.name.padEnd(22).slice(0, 22)} ${entry.type.padEnd(11).slice(0, 11)} ${entry.status.padEnd(10).slice(0, 10)} ${entry.device.padEnd(20).slice(0, 20)} ${entry.host.padEnd(14).slice(0, 14)} ${entry.speed}`;
}

function formatDesktopConnections(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopConnectionEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.name.toLowerCase().includes(query) ||
      entry.type.toLowerCase().includes(query) ||
      entry.status.toLowerCase().includes(query) ||
      entry.device.toLowerCase().includes(query) ||
      entry.host.toLowerCase().includes(query) ||
      entry.speed.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Network Connections matching "${query}":` : "Network Connections:",
    "  Name                   Type        Status     Device               Host           Speed",
    ...(rows.length ? rows.map((entry) => `  ${formatConnectionLine(entry)}`) : ["  none"]),
    "Usage: connections [search] · ncpa.cpl [search] · netconnections [search] · network · dialup · firewall",
  ];
}

function formatNetSetupLine(entry: DesktopNetSetupEntry): string {
  return `${entry.stage.padEnd(14).slice(0, 14)} ${entry.item.padEnd(24).slice(0, 24)} ${entry.status}`;
}

function formatDesktopNetSetup(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopNetSetupEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.stage.toLowerCase().includes(query) ||
      entry.item.toLowerCase().includes(query) ||
      entry.status.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Network Setup Wizard matching "${query}":` : "Network Setup Wizard:",
    "  Stage         Item                     Status",
    ...(rows.length ? rows.map((entry) => `  ${formatNetSetupLine(entry)}`) : ["  none"]),
    "Usage: netsetup [search] · netsetup.cpl [search] · network · connections · shares · firewall",
  ];
}

function formatNetDiagnosticLine(entry: DesktopNetDiagnosticEntry): string {
  return `${entry.test.padEnd(18).slice(0, 18)} ${entry.target.padEnd(18).slice(0, 18)} ${entry.result.padEnd(5)} ${entry.detail}`;
}

function formatDesktopNetDiagnostics(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopNetDiagnosticEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.test.toLowerCase().includes(query) ||
      entry.target.toLowerCase().includes(query) ||
      entry.result.toLowerCase().includes(query) ||
      entry.detail.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Network Diagnostics matching "${query}":` : "Network Diagnostics:",
    "  Test               Target             Result Detail",
    ...(rows.length ? rows.map((entry) => `  ${formatNetDiagnosticLine(entry)}`) : ["  none"]),
    "Usage: netdiag [search] · diagnose [search] · network · connections · services · firewall",
  ];
}

function formatMappedDriveLine(entry: DesktopMappedDriveEntry): string {
  return `${entry.drive.padEnd(6)} ${entry.remote.padEnd(28).slice(0, 28)} ${entry.status.padEnd(16).slice(0, 16)} ${entry.capacity}`;
}

function formatDesktopMappedDrives(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopMappedDriveEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.drive.toLowerCase().includes(query) ||
      entry.remote.toLowerCase().includes(query) ||
      entry.status.toLowerCase().includes(query) ||
      entry.capacity.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Map Network Drive matching "${query}":` : "Map Network Drive:",
    "  Drive  Remote                       Status           Capacity",
    ...(rows.length ? rows.map((entry) => `  ${formatMappedDriveLine(entry)}`) : ["  none"]),
    "Usage: mapdrive [search] · net use [search] · shares · files · network",
  ];
}

function formatOfflineLine(entry: DesktopOfflineEntry): string {
  return `${entry.location.padEnd(16).slice(0, 16)} ${entry.item.padEnd(24).slice(0, 24)} ${entry.status.padEnd(16).slice(0, 16)} ${entry.size}`;
}

function formatDesktopOffline(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopOfflineEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.location.toLowerCase().includes(query) ||
      entry.item.toLowerCase().includes(query) ||
      entry.status.toLowerCase().includes(query) ||
      entry.size.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Offline Files matching "${query}":` : "Offline Files:",
    "  Location         Item                     Status           Size",
    ...(rows.length ? rows.map((entry) => `  ${formatOfflineLine(entry)}`) : ["  none"]),
    "Usage: offline [search] · sync [search] · mobsync [search] · files · shares · tasks",
  ];
}

function formatHelpLine(entry: DesktopHelpEntry): string {
  return `${entry.section.padEnd(14).slice(0, 14)} ${entry.topic.padEnd(24).slice(0, 24)} ${entry.status}`;
}

function formatDesktopHelp(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopHelpEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.section.toLowerCase().includes(query) ||
      entry.topic.toLowerCase().includes(query) ||
      entry.status.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Help and Support Center matching "${query}":` : "Help and Support Center:",
    "  Section        Topic                    Status",
    ...(rows.length ? rows.map((entry) => `  ${formatHelpLine(entry)}`) : ["  none"]),
    "Usage: support [search] · helpctr [search] · helpctr.exe [search] · ? · help <command>",
  ];
}

function formatFolderLine(entry: DesktopFolderEntry): string {
  return `${entry.tab.padEnd(12).slice(0, 12)} ${entry.option.padEnd(22).slice(0, 22)} ${entry.value}`;
}

function formatDesktopFolders(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopFolderEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.tab.toLowerCase().includes(query) ||
      entry.option.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Folder Options matching "${query}":` : "Folder Options:",
    "  Tab          Option                 Value",
    ...(rows.length ? rows.map((entry) => `  ${formatFolderLine(entry)}`) : ["  none"]),
    "Usage: folders [search] · folderopts [search] · files · shares · registry",
  ];
}

function formatTaskManagerLine(entry: DesktopProcessEntry): string {
  return `${String(entry.pid).padStart(4, " ")} ${entry.status.padEnd(10).slice(0, 10)} ${entry.host.padEnd(14).slice(0, 14)} ${entry.command}`;
}

function formatDesktopTaskManager(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopProcessEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      String(entry.pid).includes(query) ||
      entry.tty.toLowerCase().includes(query) ||
      entry.user.toLowerCase().includes(query) ||
      entry.host.toLowerCase().includes(query) ||
      entry.command.toLowerCase().includes(query) ||
      entry.status.includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Task Manager matching "${query}":` : "Task Manager:",
    "  PID  Status     Host           Command",
    ...(rows.length ? rows.map((entry) => `  ${formatTaskManagerLine(entry)}`) : ["  none"]),
    "Usage: taskmgr [search] · ps · kill <pid> · tasks",
  ];
}

function formatScheduleLine(entry: DesktopScheduleEntry): string {
  return `${entry.status.padEnd(8)} ${entry.name.padEnd(24).slice(0, 24)} ${entry.trigger.padEnd(18).slice(0, 18)} ${entry.target}`;
}

function formatDesktopScheduler(state: ShellSessionState, args: string[] = []): string[] {
  const queryArgs = args[0]?.toLowerCase() === "/query" ? args.slice(1) : args;
  const query = queryArgs.join(" ").trim().toLowerCase();
  const entries = desktopScheduleEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.name.toLowerCase().includes(query) ||
      entry.trigger.toLowerCase().includes(query) ||
      entry.target.toLowerCase().includes(query) ||
      entry.status.includes(query) ||
      entry.lastRun.toLowerCase().includes(query) ||
      entry.nextRun.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Scheduled Tasks matching "${query}":` : "Scheduled Tasks:",
    "  Status   Name                     Trigger            Target",
    ...(rows.length ? rows.map((entry) => `  ${formatScheduleLine(entry)}`) : ["  none"]),
    "Usage: scheduler [search] · schtasks /query [search] · task scan|transfer|maint",
  ];
}

function formatMailLine(message: DesktopMailEntry, index: number): string {
  return `${String(index + 1).padStart(2, " ")}  ${message.subject.padEnd(24).slice(0, 24)} ${message.from} -> ${message.to}  ${message.preview}`;
}

function formatDesktopMailbox(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const messages = desktopMailEntries(state);
  const rows = query
    ? messages.filter((message) =>
      message.from.toLowerCase().includes(query) ||
      message.to.toLowerCase().includes(query) ||
      message.subject.toLowerCase().includes(query) ||
      message.preview.toLowerCase().includes(query)
    )
    : messages;
  return [
    query ? `Mailbox matching "${query}":` : `Mailbox for ${state.username ?? "guest"}:`,
    ...(rows.length ? rows.map((message, index) => `  ${formatMailLine(message, index)}`) : ["  none"]),
    "Usage: mailbox [search] · inbox · mail <host>",
  ];
}

function formatBoardLine(entry: DesktopBoardEntry, index: number): string {
  return `${String(index + 1).padStart(2, " ")}  ${entry.kind.padEnd(6)} ${entry.board.padEnd(22).slice(0, 22)} ${entry.subject.padEnd(28).slice(0, 28)} ${entry.author}`;
}

function formatDesktopBoards(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = collectDesktopBoardEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.kind.includes(query) ||
      entry.board.toLowerCase().includes(query) ||
      entry.author.toLowerCase().includes(query) ||
      entry.subject.toLowerCase().includes(query) ||
      entry.preview.toLowerCase().includes(query)
    )
    : entries.slice(0, 32);
  return [
    query ? `Boards matching "${query}":` : "Boards:",
    ...(rows.length ? rows.map((entry, index) => `  ${formatBoardLine(entry, index)}`) : ["  none"]),
    "Usage: boards [search] · bbs · news",
  ];
}

function formatNetworkLine(entry: DesktopNetworkEntry): string {
  const ports = entry.ports.slice(0, 4).join(",") || "-";
  const route = entry.route.length > 1 ? `${entry.route.length - 1} hop` : "local";
  const mark = entry.bookmarked ? "*" : " ";
  const ownerMark = entry.marker || " ";
  return `${mark}${ownerMark} ${entry.host.padEnd(16)} ${entry.access.padEnd(6)} ${route.padEnd(7)} ${ports.padEnd(12)} ${entry.org}`;
}

function formatDesktopNetwork(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = collectDesktopNetworkEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.host.toLowerCase().includes(query) ||
      entry.org.toLowerCase().includes(query) ||
      entry.location.toLowerCase().includes(query) ||
      entry.access.includes(query)
    )
    : entries.slice(0, 32);
  return [
    query ? `Network Places matching "${query}":` : "Network Places:",
    "  * Host             Access Route   Ports        Organization",
    ...(rows.length ? rows.map((entry) => `  ${formatNetworkLine(entry)}`) : ["  none"]),
    "Usage: network [search] · trace <host> · bookmark route <host>",
  ];
}

function formatDialupLine(entry: DesktopDialupEntry): string {
  const route = entry.route.length > 1 ? `${entry.route.length - 1} hop` : "local";
  return `${entry.name.padEnd(18).slice(0, 18)} ${entry.status.padEnd(9)} ${entry.access.padEnd(6)} ${route.padEnd(7)} ${entry.speed.padEnd(8)} ${entry.number.padEnd(12)} ${entry.protocol.padEnd(9).slice(0, 9)} ${entry.host}`;
}

function formatDesktopDialup(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = collectDesktopDialupEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.name.toLowerCase().includes(query) ||
      entry.host.toLowerCase().includes(query) ||
      entry.status.includes(query) ||
      entry.access.includes(query) ||
      entry.number.includes(query) ||
      entry.speed.toLowerCase().includes(query) ||
      entry.lineType.toLowerCase().includes(query) ||
      entry.protocol.toLowerCase().includes(query) ||
      entry.notes.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Dial-Up Networking matching "${query}":` : "Dial-Up Networking:",
    "  Connection         Status    Access Route   Speed    Number       Protocol  Host",
    ...(rows.length ? rows.map((entry) => `  ${formatDialupLine(entry)}`) : ["  none"]),
    "Usage: dialup [search] · coupler <host|number> · dial <number|host> · trace <host> · telnet <host> · bookmark route <host>",
  ];
}

function formatPhonebookLine(entry: DesktopDialupEntry): string {
  const route = entry.route.length > 1 ? `${entry.route.length - 1} hop` : "local";
  const details = `${entry.lineType}/${entry.protocol}`;
  return `${entry.number.padEnd(12)} ${entry.host.padEnd(14).slice(0, 14)} ${route.padEnd(7)} ${entry.speed.padEnd(8)} ${dialCarrierPreview(entry.host).padEnd(13)} ${details.padEnd(17).slice(0, 17)} ${entry.name}`;
}

function formatPhonebook(state: ShellSessionState, args: string[] = []): string[] {
  const action = args[0]?.toLowerCase();
  if (action === "add") {
    return upsertPersonalPhonebookEntry(state, args[1] ?? "", args.slice(2).join(" "));
  }
  if (action === "rm" || action === "remove" || action === "delete") {
    return removePersonalPhonebookEntry(state, args[1]);
  }

  const query = args.join(" ").trim().toLowerCase();
  const rows = collectDesktopDialupEntries(state).filter((entry) => !query ||
    entry.host.toLowerCase().includes(query) ||
    entry.name.toLowerCase().includes(query) ||
    entry.number.includes(query) ||
    entry.lineType.toLowerCase().includes(query) ||
    entry.protocol.toLowerCase().includes(query) ||
    entry.notes.toLowerCase().includes(query) ||
    dialCarrierPreview(entry.host).includes(query)
  );
  return [
    query ? `Phonebook matching "${query}":` : "Phonebook:",
    "  Number       Host           Route   Speed    Carrier       Details           Entry",
    ...(rows.length ? rows.map((entry) => `  ${formatPhonebookLine(entry)}`) : ["  none"]),
    "Usage: phonebook [search] · phonebook add <host> [label] [line=<type>] [protocol=<name>] [note=<words>] · phonebook rm <host|number>",
  ];
}

function formatLineageLine(entry: DesktopLineageEntry): string {
  return `${entry.era.padEnd(10).slice(0, 10)} ${entry.method.padEnd(20).slice(0, 20)} ${entry.status.padEnd(10).slice(0, 10)} ${entry.host.padEnd(14).slice(0, 14)} ${entry.speed.padEnd(8).slice(0, 8)} ${entry.path}`;
}

function formatDesktopLineage(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopLineageEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.era.includes(query) ||
      entry.method.toLowerCase().includes(query) ||
      entry.status.includes(query) ||
      entry.host.toLowerCase().includes(query) ||
      entry.path.toLowerCase().includes(query) ||
      entry.speed.toLowerCase().includes(query) ||
      entry.meaning.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Connection Lineage matching "${query}":` : "Connection Lineage:",
    "  Era        Method               Status     Host           Speed    Path",
    ...(rows.length ? rows.map((entry) => `  ${formatLineageLine(entry)}`) : ["  none"]),
    "",
    "Connection archaeology begins with acoustic couplers and phone books, passes through dial-up BBSes and wardialing, crosses UUCP/telnet routes, then settles into LAN-era control panels.",
    "Usage: lineage [search] · era [search] · modems · dialup · dial <number|host> · wardial · pad <host> · x25 <host> · trace <host> · telnet <host>",
  ];
}

function formatRemoteLine(entry: DesktopRemoteEntry): string {
  return `${entry.host.padEnd(14).slice(0, 14)} ${entry.status.padEnd(12).slice(0, 12)} ${entry.access.padEnd(6)} ${entry.display.padEnd(13).slice(0, 13)} ${entry.profile}`;
}

function formatDesktopRemote(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopRemoteEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.host.toLowerCase().includes(query) ||
      entry.profile.toLowerCase().includes(query) ||
      entry.status.includes(query) ||
      entry.access.includes(query) ||
      entry.display.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.route.join(" ").toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Remote Desktop Connection matching "${query}":` : "Remote Desktop Connection:",
    "  Host           Status       Access Display       Profile",
    ...(rows.length ? rows.map((entry) => `  ${formatRemoteLine(entry)}`) : ["  none"]),
    "Usage: remote [search] · mstsc [search] · connections · network · tunnel <host>",
  ];
}

function formatRunLine(entry: DesktopRunEntry): string {
  return `${entry.command.padEnd(18).slice(0, 18)} ${entry.status.padEnd(9).slice(0, 9)} ${entry.source.padEnd(18).slice(0, 18)} ${entry.target}`;
}

function formatDesktopRun(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopRunEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.command.toLowerCase().includes(query) ||
      entry.target.toLowerCase().includes(query) ||
      entry.status.includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Run Dialog matching "${query}":` : "Run Dialog:",
    "  Command            Status    Source             Target",
    ...(rows.length ? rows.map((entry) => `  ${formatRunLine(entry)}`) : ["  none"]),
    "Usage: runbox [search] · start [search] · explorer [search] · cmd.exe · runas [search]",
  ];
}

function formatCredentialLine(entry: DesktopCredentialEntry): string {
  return `${entry.target.padEnd(16).slice(0, 16)} ${entry.username.padEnd(14).slice(0, 14)} ${entry.kind.padEnd(14).slice(0, 14)} ${entry.status.padEnd(9).slice(0, 9)} ${entry.source}`;
}

function formatDesktopCredentials(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = desktopCredentialEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.target.toLowerCase().includes(query) ||
      entry.username.toLowerCase().includes(query) ||
      entry.kind.toLowerCase().includes(query) ||
      entry.status.includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Stored User Names and Passwords matching "${query}":` : "Stored User Names and Passwords:",
    "  Target           User           Type           Status    Source",
    ...(rows.length ? rows.map((entry) => `  ${formatCredentialLine(entry)}`) : ["  none"]),
    "Secret material is not displayed. Use security, accounts, set key, porthack, rootkit, and secure for actions.",
    "Usage: credentials [search] · keymgr [search] · creds [search] · controlkeymgr [search]",
  ];
}

function formatDeviceLine(entry: DesktopDeviceEntry): string {
  return `${entry.host.padEnd(14)} ${entry.category.padEnd(12).slice(0, 12)} ${entry.status.padEnd(7)} ${entry.name.padEnd(24).slice(0, 24)} ${entry.resource}`;
}

function formatDesktopDevices(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = collectDesktopDeviceEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.host.toLowerCase().includes(query) ||
      entry.category.toLowerCase().includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.status.includes(query) ||
      entry.driver.toLowerCase().includes(query) ||
      entry.resource.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Device Manager matching "${query}":` : "Device Manager:",
    "  Host           Class        Status  Device                   Resource",
    ...(rows.length ? rows.map((entry) => `  ${formatDeviceLine(entry)}`) : ["  none"]),
    "Usage: devices [search] · devmgmt [search] · services · dialup · printers",
  ];
}

function formatNodeLine(entry: DesktopNodeEntry): string {
  const route = entry.route.length > 1 ? `${entry.route.length - 1} hop` : "local";
  const ports = entry.ports.slice(0, 4).join(",") || "-";
  return `${entry.host.padEnd(16)} ${entry.role.padEnd(7)} ${entry.access.padEnd(6)} ${route.padEnd(7)} ${ports.padEnd(12)} ${entry.org}`;
}

function formatDesktopNodes(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = collectDesktopNodeEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.host.toLowerCase().includes(query) ||
      entry.org.toLowerCase().includes(query) ||
      entry.location.toLowerCase().includes(query) ||
      entry.role.includes(query) ||
      entry.access.includes(query)
    )
    : entries;
  return [
    query ? `My Nodes matching "${query}":` : "My Nodes:",
    "  Host             Role    Access Route   Ports        Organization",
    ...(rows.length ? rows.map((entry) => `  ${formatNodeLine(entry)}`) : ["  none"]),
    "Usage: nodes [search] · owned · netstat",
  ];
}

function formatSecurityLine(entry: DesktopSecurityEntry): string {
  const owner = entry.owner ?? "-";
  const ports = entry.ports.slice(0, 4).join(",") || "-";
  const checks = entry.checks.slice(0, 2).join("; ") || "baseline";
  return `${entry.host.padEnd(16)} ${entry.posture.padEnd(10)} ${entry.access.padEnd(6)} ${owner.padEnd(14).slice(0, 14)} ${ports.padEnd(12)} ${checks}`;
}

function formatDesktopSecurity(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = collectDesktopSecurityEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.host.toLowerCase().includes(query) ||
      entry.access.includes(query) ||
      entry.posture.includes(query) ||
      entry.owner?.toLowerCase().includes(query) ||
      entry.checks.some((check) => check.toLowerCase().includes(query)) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Security Center matching "${query}":` : "Security Center:",
    "  Host             Posture    Access Owner          Ports        Checks",
    ...(rows.length ? rows.map((entry) => `  ${formatSecurityLine(entry)}`) : ["  none"]),
    "Usage: security [search] · secure · inspect · ps",
  ];
}

function formatServiceLine(entry: DesktopServiceEntry): string {
  return `${entry.host.padEnd(16)} ${String(entry.port).padStart(5, " ")} ${entry.name.padEnd(10)} ${entry.status.padEnd(10)} ${entry.access.padEnd(6)} ${entry.banner}`;
}

function formatDesktopServices(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = collectDesktopServiceEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.host.toLowerCase().includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.status.includes(query) ||
      entry.access.includes(query) ||
      entry.banner.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Services matching "${query}":` : "Services:",
    "  Host              Port Name       Status     Access Banner",
    ...(rows.length ? rows.map((entry) => `  ${formatServiceLine(entry)}`) : ["  none"]),
    "Usage: services [search] · netstat · inspect · security",
  ];
}

function formatShareLine(entry: DesktopShareEntry): string {
  const mode = entry.writable ? "rw" : "ro";
  return `${entry.host.padEnd(16)} ${entry.name.padEnd(14)} ${entry.kind.padEnd(8)} ${entry.access.padEnd(6)} ${mode.padEnd(3)} ${String(entry.files).padStart(3, " ")}  ${entry.path}`;
}

function formatDesktopShares(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = collectDesktopShareEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.host.toLowerCase().includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.kind.includes(query) ||
      entry.access.includes(query) ||
      entry.path.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Shared Folders matching "${query}":` : "Shared Folders:",
    "  Host             Share          Kind     Access Mode Files Path",
    ...(rows.length ? rows.map((entry) => `  ${formatShareLine(entry)}`) : ["  none"]),
    "Usage: shares [search] · files [search] · cd · write",
  ];
}

function formatPrintLine(entry: DesktopPrintEntry): string {
  return `${entry.host.padEnd(16)} ${entry.queue.padEnd(12)} ${entry.status.padEnd(7)} ${String(entry.pages).padStart(2, " ")}p ${entry.document.padEnd(20).slice(0, 20)} ${entry.source}`;
}

function formatDesktopPrinters(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = collectDesktopPrintEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.host.toLowerCase().includes(query) ||
      entry.queue.toLowerCase().includes(query) ||
      entry.status.includes(query) ||
      entry.document.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Print Queue matching "${query}":` : "Print Queue:",
    "  Host             Queue        Status  Pg Document             Source",
    ...(rows.length ? rows.map((entry) => `  ${formatPrintLine(entry)}`) : ["  none"]),
    "Usage: printers [search] · printq [search] · files · task transfer",
  ];
}

function formatRegistryLine(entry: DesktopRegistryEntry): string {
  const mode = entry.writable ? "rw" : "ro";
  const key = `${entry.hive}\\${entry.key}`;
  return `${key.padEnd(48).slice(0, 48)} ${entry.name.padEnd(18).slice(0, 18)} ${mode} ${entry.value}`;
}

function formatDesktopRegistry(state: ShellSessionState, args: string[] = []): string[] {
  const query = args.join(" ").trim().toLowerCase();
  const entries = collectDesktopRegistryEntries(state);
  const rows = query
    ? entries.filter((entry) =>
      entry.hive.toLowerCase().includes(query) ||
      entry.key.toLowerCase().includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.value.toLowerCase().includes(query) ||
      entry.source.toLowerCase().includes(query) ||
      entry.actions.some((action) => action.toLowerCase().includes(query))
    )
    : entries;
  return [
    query ? `Registry matching "${query}":` : "Registry:",
    "  Key                                              Name               RW Value",
    ...(rows.length ? rows.map((entry) => `  ${formatRegistryLine(entry)}`) : ["  none"]),
    "Usage: registry [search] · reg query [search] · theme pref · desktop open",
  ];
}

function formatTasks(state: ShellSessionState): string[] {
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  if (!state.desktopTasks.length) {
    return [
      "Tasks:",
      "  none",
      "Usage: task scan|transfer|maint <target> [label]",
    ];
  }
  return [
    "Tasks:",
    ...state.desktopTasks.map((task) => `  ${formatTaskLine(task)}`),
  ];
}

function formatBookmarks(state: ShellSessionState): string[] {
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  if (!state.desktopBookmarks.length) {
    return [
      "Bookmarks:",
      "  none",
      "Usage: bookmark add <host> [label] · bookmark route <host> [label]",
    ];
  }
  return [
    "Bookmarks:",
    ...state.desktopBookmarks.map((bookmark) => `  ${formatBookmarkLine(bookmark)}`),
  ];
}

function formatDesktopApp(state: ShellSessionState): string[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.desktopWindowPositions = normalizeDesktopWindowPositions(state.desktopWindowPositions);
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const title = DESKTOP_APP_TITLES[state.desktopActiveApp] ?? state.desktopActiveApp;
  const position = state.desktopWindowPositions[state.desktopActiveApp];
  const host = currentHost(state);
  const rows: Array<[string, string]> = (() => {
    switch (state.desktopActiveApp) {
      case "terminal":
        return [
          ["Prompt", prompt(state)],
          ["Mode", `${state.shellMode} stty=${state.stty}`],
          ["Host", host],
          ["History", `${state.commandHistory.length} command(s)`],
        ];
      case "system":
        const systemRows = desktopSystemEntries(state);
        return [
          ["Computer", systemRows.find((entry) => entry.name === "Computer Name")?.value ?? host],
          ["Version", systemRows.find((entry) => entry.name === "Shell Version")?.value ?? state.desktopTheme],
          ["Resources", systemRows.filter((entry) => entry.group === "Resources").slice(0, 3).map((entry) => `${entry.name}=${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend host, user, route, storage, and preference state"],
        ];
      case "control":
        const controlRows = desktopControlEntries(state);
        return [
          ["Applets", `${controlRows.length} backend applet row(s)`],
          ["Admin", controlRows.filter((entry) => entry.category === "Admin").slice(0, 3).map((entry) => entry.applet).join(", ") || "none"],
          ["Appearance", controlRows.filter((entry) => entry.category === "Appearance").slice(0, 3).map((entry) => `${entry.applet}:${entry.status}`).join(", ") || "none"],
          ["Source", "derived from backend desktop, system, device, network, and preference state"],
        ];
      case "accounts":
        const accountRows = desktopAccountEntries(state);
        return [
          ["Accounts", `${accountRows.length} backend account row(s)`],
          ["Current", accountRows.find((entry) => entry.name === "Operator")?.value ?? state.username ?? "guest"],
          ["Sessions", accountRows.filter((entry) => entry.scope === "Session").slice(0, 3).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend user, session, key, badge, and access state"],
        ];
      case "credentials":
        const credentialRows = desktopCredentialEntries(state);
        return [
          ["Rows", `${credentialRows.length} backend credential row(s)`],
          ["Stored", credentialRows.filter((entry) => entry.status === "stored" || entry.status === "active" || entry.status === "elevated").slice(0, 3).map((entry) => `${entry.target}:${entry.status}`).join(", ") || "none"],
          ["Secrets", "not displayed"],
          ["Source", "derived from backend account, SSH key, host access, bookmarks, remote profiles, and security state"],
        ];
      case "datetime":
        const timeRows = desktopTimeEntries(state);
        return [
          ["Clock", timeRows.find((entry) => entry.name === "Server Time")?.value ?? new Date().toISOString().slice(11, 19)],
          ["Calendar", timeRows.find((entry) => entry.name === "Discordian")?.value ?? "available through ddate"],
          ["Activity", timeRows.filter((entry) => entry.tab === "Activity").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend server clock, event, command, and scheduler state"],
        ];
      case "display":
        const displayRows = desktopDisplayEntries(state);
        return [
          ["Settings", `${displayRows.length} backend display row(s)`],
          ["Theme", displayRows.find((entry) => entry.setting === "Color Scheme")?.value ?? state.desktopTheme],
          ["Accessibility", displayRows.filter((entry) => entry.tab === "Accessibility").slice(0, 3).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend theme, preference, window, and session state"],
        ];
      case "sounds":
        const soundRows = desktopSoundEntries(state);
        return [
          ["Volume", soundRows.find((entry) => entry.item === "Master Volume")?.value ?? state.desktopPrefs.sound],
          ["Scheme", soundRows.find((entry) => entry.item === "Sound Scheme")?.value ?? state.desktopTheme],
          ["Alerts", soundRows.filter((entry) => entry.tab === "Voice" || entry.tab === "Sounds").slice(0, 2).map((entry) => `${entry.item}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend preference, event, task, device, and session state"],
        ];
      case "power":
        const powerRows = desktopPowerEntries(state);
        return [
          ["Scheme", powerRows.find((entry) => entry.setting === "Active Scheme")?.value ?? "Always On"],
          ["Timers", powerRows.filter((entry) => entry.scheme === "Timers").slice(0, 3).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
          ["Activity", powerRows.filter((entry) => entry.scheme === "Activity").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend preferences, tasks, processes, devices, and routes"],
        ];
      case "mouse":
        const mouseRows = desktopMouseEntries(state);
        return [
          ["Buttons", mouseRows.filter((entry) => entry.tab === "Buttons").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
          ["Pointer", mouseRows.find((entry) => entry.setting === "Pointer Scheme")?.value ?? state.desktopTheme],
          ["Motion", mouseRows.filter((entry) => entry.tab === "Motion").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend preferences, windows, tasks, devices, and session state"],
        ];
      case "keyboard":
        const keyboardRows = desktopKeyboardEntries(state);
        return [
          ["Mode", keyboardRows.find((entry) => entry.setting === "Shortcut Priority")?.value ?? state.desktopPrefs.keyboardMode],
          ["Repeat", keyboardRows.filter((entry) => entry.tab === "Speed").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
          ["Input", keyboardRows.filter((entry) => entry.tab === "Input").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend preferences, terminal, history, tasks, and devices"],
        ];
      case "accessibility":
        const accessibilityRows = desktopAccessibilityEntries(state);
        return [
          ["Keyboard", accessibilityRows.filter((entry) => entry.tab === "Keyboard").slice(0, 2).map((entry) => `${entry.option}:${entry.value}`).join(", ") || "none"],
          ["Display", accessibilityRows.filter((entry) => entry.tab === "Display").slice(0, 2).map((entry) => `${entry.option}:${entry.value}`).join(", ") || "none"],
          ["General", accessibilityRows.filter((entry) => entry.tab === "General").slice(0, 2).map((entry) => `${entry.option}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend preferences, applets, events, tasks, and devices"],
        ];
      case "regional":
        const regionalRows = desktopRegionalEntries(state);
        return [
          ["Standards", regionalRows.find((entry) => entry.setting === "Standards")?.value ?? state.desktopTheme],
          ["Formats", regionalRows.filter((entry) => entry.tab === "Formats").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
          ["Languages", regionalRows.filter((entry) => entry.tab === "Languages").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend theme, time, files, mail, boards, and keyboard state"],
        ];
      case "modems":
        const modemRows = desktopModemEntries(state);
        return [
          ["Dialing", modemRows.filter((entry) => entry.tab === "Dialing Rules").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
          ["Modems", modemRows.filter((entry) => entry.tab === "Modems").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
          ["Diagnostics", modemRows.filter((entry) => entry.tab === "Diagnostics").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend dial-up, device, regional, network, service, and task state"],
        ];
      case "odbc":
        const odbcRows = desktopOdbcEntries(state);
        return [
          ["User DSN", odbcRows.filter((entry) => entry.tab === "User DSN").slice(0, 2).map((entry) => `${entry.name}:${entry.driver}`).join(", ") || "none"],
          ["System DSN", odbcRows.filter((entry) => entry.tab === "System DSN").slice(0, 2).map((entry) => `${entry.name}:${entry.driver}`).join(", ") || "none"],
          ["Tracing", odbcRows.filter((entry) => entry.tab === "Tracing").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend services, files, registry, programs, network, and task state"],
        ];
      case "programs":
        const programRows = desktopProgramEntries(state);
        return [
          ["Programs", `${programRows.length} backend program row(s)`],
          ["Protocols", programRows.filter((entry) => entry.category === "Protocol").slice(0, 4).map((entry) => entry.name).join(", ") || "none"],
          ["User data", programRows.filter((entry) => entry.source === "downloads" || entry.source === "basicUserPrograms").slice(0, 3).map((entry) => `${entry.name}:${entry.status}`).join(", ") || "none"],
          ["Source", "derived from backend command, game, protocol, download, task, and profile state"],
        ];
      case "internet":
        const internetRows = desktopInternetEntries(state);
        return [
          ["Zones", `${internetRows.length} backend option row(s)`],
          ["Security", internetRows.filter((entry) => entry.tab === "Security").slice(0, 2).map((entry) => `${entry.zone}:${entry.value}`).join(", ") || "none"],
          ["Connections", internetRows.filter((entry) => entry.tab === "Connections").slice(0, 2).map((entry) => `${entry.zone}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend network, service, security, file, and preference state"],
        ];
      case "firewall":
        const firewallRows = desktopFirewallEntries(state);
        return [
          ["Profile", firewallRows.filter((entry) => entry.tab === "General").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
          ["Exceptions", firewallRows.filter((entry) => entry.tab === "Exceptions").slice(0, 3).map((entry) => `${entry.name}:${entry.profile}`).join(", ") || "none"],
          ["Logging", firewallRows.filter((entry) => entry.tab === "Logging").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend security, services, network, dial-up, events, and task state"],
        ];
      case "updates":
        const updateRows = desktopUpdateEntries(state);
        return [
          ["Settings", updateRows.filter((entry) => entry.tab === "Settings").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
          ["Status", updateRows.filter((entry) => entry.tab === "Status").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
          ["History", updateRows.filter((entry) => entry.tab === "History").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend programs, services, security, tasks, events, downloads, and theme state"],
        ];
      case "performance":
        const performanceRows = desktopPerformanceEntries(state);
        return [
          ["Processor", performanceRows.filter((entry) => entry.object === "Processor").slice(0, 2).map((entry) => `${entry.counter}:${entry.value}`).join(", ") || "none"],
          ["Network", performanceRows.filter((entry) => entry.object === "Network" || entry.object === "Service").slice(0, 2).map((entry) => `${entry.object}:${entry.value}`).join(", ") || "none"],
          ["System", performanceRows.filter((entry) => entry.object === "System" || entry.object === "Memory").slice(0, 2).map((entry) => `${entry.object}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend processes, services, network, files, events, tasks, and security state"],
        ];
      case "restore":
        const restoreRows = desktopRestoreEntries(state);
        return [
          ["Status", restoreRows.filter((entry) => entry.tab === "Status").slice(0, 2).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
          ["Restore Points", restoreRows.filter((entry) => entry.tab === "Restore Point").slice(0, 3).map((entry) => `${entry.name}:${entry.status}`).join(", ") || "none"],
          ["Monitored", restoreRows.filter((entry) => entry.tab === "Monitored").slice(0, 3).map((entry) => `${entry.name}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend saved checkpoints, files, registry, security, events, and task state"],
        ];
      case "computer":
        const computerRows = desktopComputerEntries(state);
        return [
          ["System Tools", computerRows.filter((entry) => entry.tree === "System Tools").slice(0, 3).map((entry) => `${entry.node}:${entry.status}`).join(", ") || "none"],
          ["Storage", computerRows.filter((entry) => entry.tree === "Storage").slice(0, 2).map((entry) => `${entry.node}:${entry.value}`).join(", ") || "none"],
          ["Services", computerRows.filter((entry) => entry.tree === "Services and Applications").slice(0, 3).map((entry) => `${entry.node}:${entry.status}`).join(", ") || "none"],
          ["Source", "derived from backend events, shares, devices, services, tasks, files, security, and performance state"],
        ];
      case "disk":
        const diskRows = desktopDiskEntries(state);
        return [
          ["Volumes", `${diskRows.length} backend volume row(s)`],
          ["Profile", diskRows.filter((entry) => entry.disk === "Disk 0").slice(0, 3).map((entry) => `${entry.volume}:${entry.used}`).join(", ") || "none"],
          ["Remote", diskRows.filter((entry) => entry.status === "mounted" || entry.disk === "Net").slice(0, 3).map((entry) => `${entry.volume}:${entry.status}`).join(", ") || "none"],
          ["Source", "derived from backend quota, files, downloads, shares, checkpoints, tasks, and route state"],
        ];
      case "eventviewer":
        const eventViewerRows = desktopEventViewerEntries(state);
        return [
          ["Windows Logs", eventViewerRows.filter((entry) => entry.log === "Application" || entry.log === "System" || entry.log === "Security").slice(0, 3).map((entry) => `${entry.log}:${entry.level}`).join(", ") || "none"],
          ["Applications", eventViewerRows.filter((entry) => entry.log === "Applications and Services").slice(0, 3).map((entry) => `${entry.source}:${entry.message}`).join(", ") || "none"],
          ["Audit", `${eventViewerRows.filter((entry) => entry.level === "audit").length} audit row(s), ${eventViewerRows.length} total`],
          ["Source", "derived from backend desktop events, tasks, security, command history, and session state"],
        ];
      case "search":
        const searchRows = desktopSearchEntries(state);
        return [
          ["Indexed", `${searchRows.length} backend-visible artifact row(s)`],
          ["Places", Array.from(new Set(searchRows.map((entry) => entry.scope))).slice(0, 5).join(", ") || "none"],
          ["Recent", searchRows.filter((entry) => entry.scope === "History" || entry.scope === "Tasks").slice(0, 3).map((entry) => entry.name).join(", ") || "none"],
          ["Source", "derived from backend-visible files, boards, mail, hosts, services, events, history, tasks, and bookmarks"],
        ];
      case "connections":
        const connectionRows = desktopConnectionEntries(state);
        return [
          ["Connections", `${connectionRows.length} backend connection row(s)`],
          ["Active", connectionRows.filter((entry) => entry.status === "connected" || entry.status === "enabled").slice(0, 3).map((entry) => `${entry.name}:${entry.status}`).join(", ") || "none"],
          ["Queued", `${connectionRows.filter((entry) => entry.status === "queued").length} queued row(s)`],
          ["Source", "derived from backend network, dial-up, tunnel, service, firewall, and task state"],
        ];
      case "netsetup":
        const netSetupRows = desktopNetSetupEntries(state);
        return [
          ["Steps", `${netSetupRows.length} backend setup row(s)`],
          ["Adapters", netSetupRows.filter((entry) => entry.stage === "Adapters").slice(0, 2).map((entry) => `${entry.item}:${entry.status}`).join(", ") || "none"],
          ["Sharing", netSetupRows.filter((entry) => entry.stage === "Sharing").slice(0, 2).map((entry) => `${entry.item}:${entry.status}`).join(", ") || "none"],
          ["Source", "derived from backend network, dial-up, shares, firewall, services, route, and task state"],
        ];
      case "netdiag":
        const netDiagRows = desktopNetDiagnosticEntries(state);
        return [
          ["Diagnostics", `${netDiagRows.length} backend diagnostic row(s)`],
          ["Warnings", `${netDiagRows.filter((entry) => entry.result === "warn" || entry.result === "fail").length} warning/fail row(s)`],
          ["Signals", netDiagRows.slice(0, 3).map((entry) => `${entry.test}:${entry.result}`).join(", ") || "none"],
          ["Source", "derived from backend network, services, firewall, route, tasks, and event state"],
        ];
      case "mapdrive":
        const mappedDriveRows = desktopMappedDriveEntries(state);
        return [
          ["Mapped", `${mappedDriveRows.length} backend mapped drive row(s)`],
          ["Writable", `${mappedDriveRows.filter((entry) => entry.status.includes("write")).length} writable row(s)`],
          ["Letters", mappedDriveRows.slice(0, 4).map((entry) => `${entry.drive}${entry.remote}`).join(", ") || "none"],
          ["Source", "derived from backend shares, files, downloads, profile, and network state"],
        ];
      case "offline":
        const offlineRows = desktopOfflineEntries(state);
        return [
          ["Items", `${offlineRows.length} backend offline file row(s)`],
          ["Pending", `${offlineRows.filter((entry) => entry.status.includes("pending")).length} pending row(s)`],
          ["Cached", offlineRows.filter((entry) => /cache|sync|pinned/i.test(entry.status)).slice(0, 3).map((entry) => `${entry.location}:${entry.item}`).join(", ") || "none"],
          ["Source", "derived from backend files, shares, mapped drives, downloads, tasks, and events"],
        ];
      case "folders":
        const folderRows = desktopFolderEntries(state);
        return [
          ["Options", `${folderRows.length} backend folder option row(s)`],
          ["View", folderRows.filter((entry) => entry.tab === "View").slice(0, 3).map((entry) => `${entry.option}:${entry.value}`).join(", ") || "none"],
          ["Offline", folderRows.filter((entry) => entry.tab === "Offline Files").slice(0, 2).map((entry) => `${entry.option}:${entry.value}`).join(", ") || "none"],
          ["Source", "derived from backend file, share, preference, bookmark, and history state"],
        ];
      case "taskmgr":
        const processRows = desktopProcessEntries(state);
        return [
          ["Processes", `${processRows.length} backend process row(s)`],
          ["Queued", `${processRows.filter((entry) => entry.status === "queued").length} queued process(es)`],
          ["Foreground", processRows.find((entry) => entry.status === "foreground")?.command ?? state.shellMode],
          ["Source", "derived from backend shell, task, link, camp, and tunnel state"],
        ];
      case "scheduler":
        const scheduleRows = desktopScheduleEntries(state);
        return [
          ["Scheduled", `${scheduleRows.length} backend schedule row(s)`],
          ["Queued", `${scheduleRows.filter((entry) => entry.status === "queued").length} queued task(s)`],
          ["Running", scheduleRows.filter((entry) => entry.status === "running").slice(0, 2).map((entry) => entry.name).join(", ") || "none"],
          ["Source", "derived from backend tasks, events, mailbox, boards, and route state"],
        ];
      case "nodes":
        const nodeRows = desktopNodeEntries(state);
        return [
          ["Current host", host],
          ["Account", state.loggedIn ? `${state.username} home=${state.homeHost}` : "guest session, use newuser or login"],
          ["Access", `${state.loginHosts.length} login hosts, ${state.rootHosts.length} root hosts`],
          ["Nodes", nodeRows.length ? nodeRows.slice(0, 3).map((entry) => `${entry.host}:${entry.role}`).join(", ") : "none"],
        ];
      case "network":
        const networkRows = desktopNetworkEntries(state);
        return [
          ["Remote depth", `${state.remoteStack.length} active hop(s)`],
          ["Route state", state.tunnel ? `${state.tunnel.from} -> ${state.tunnel.to}` : "no active tunnel"],
          ["Visible hosts", networkRows.length ? networkRows.slice(0, 3).map((entry) => `${entry.host}:${entry.access}`).join(", ") : "none"],
          ["Bookmarks", state.desktopBookmarks.length ? state.desktopBookmarks.slice(0, 3).map((bookmark) => bookmark.target).join(", ") : "none"],
          ["BBS", "telnet bbs opens the local board transport"],
        ];
      case "dialup":
        const dialupRows = desktopDialupEntries(state);
        return [
          ["Connections", dialupRows.length ? dialupRows.slice(0, 3).map((entry) => `${entry.name}:${entry.status}`).join(", ") : "none"],
          ["Numbers", dialupRows.length ? dialupRows.slice(0, 3).map((entry) => `${entry.host}:${entry.number}`).join(", ") : "none"],
          ["Saved", `${dialupRows.filter((entry) => entry.status === "saved").length} saved route(s)`],
          ["Active", state.tunnel ? `${state.tunnel.from} -> ${state.tunnel.to}` : currentHost(state)],
          ["Source", "derived from visible routes, bookmarks, tunnel, and watcher state"],
        ];
      case "lineage":
        const lineageRows = desktopLineageEntries(state);
        return [
          ["Rows", `${lineageRows.length} backend lineage row(s)`],
          ["Eras", lineageRows.map((entry) => entry.era).slice(0, 5).join(", ") || "none"],
          ["Current", lineageRows.find((entry) => entry.status === "connected")?.method ?? lineageRows[0]?.method ?? "none"],
          ["Source", "derived from backend routes, dial-up rows, network places, and connection state"],
        ];
      case "remote":
        const remoteRows = desktopRemoteEntries(state);
        return [
          ["Profiles", `${remoteRows.length} backend remote profile row(s)`],
          ["Ready", remoteRows.filter((entry) => entry.status === "connected" || entry.status === "credentialed" || entry.status === "available").slice(0, 3).map((entry) => `${entry.host}:${entry.status}`).join(", ") || "none"],
          ["Display", remoteRows[0]?.display ?? "console"],
          ["Source", "derived from backend visible hosts, access, routes, tunnel, bookmarks, and tasks"],
        ];
      case "runbox":
        const runRows = desktopRunEntries(state);
        return [
          ["Targets", `${runRows.length} backend run target row(s)`],
          ["Ready", runRows.filter((entry) => entry.status === "ready" || entry.status === "recent").slice(0, 3).map((entry) => entry.command).join(", ") || "none"],
          ["Recent", runRows.find((entry) => entry.status === "recent")?.command ?? "none"],
          ["Source", "derived from backend commands, desktop apps, command history, files, and session state"],
        ];
      case "devices":
        const deviceRows = desktopDeviceEntries(state);
        return [
          ["Devices", deviceRows.length ? deviceRows.slice(0, 3).map((entry) => `${entry.name}:${entry.status}`).join(", ") : "none"],
          ["Warnings", `${deviceRows.filter((entry) => entry.status === "warning").length} warning(s)`],
          ["Busy", `${deviceRows.filter((entry) => entry.status === "busy").length} busy device(s)`],
          ["Source", "derived from host ports, tasks, tty, files, dial-up, and print queues"],
        ];
      case "security":
        const securityRows = desktopSecurityEntries(state);
        return [
          ["Posture", securityRows.length ? securityRows.slice(0, 3).map((entry) => `${entry.host}:${entry.posture}`).join(", ") : "none"],
          ["Open checks", securityRows.flatMap((entry) => entry.checks).slice(0, 3).join(" | ") || "baseline"],
          ["Actions", securityRows.flatMap((entry) => entry.actions).slice(0, 3).join(" | ") || "inspect first"],
          ["Audit", `${state.desktopEvents.filter((event) => event.level === "audit").length} audit event(s)`],
        ];
      case "services":
        const serviceRows = desktopServiceEntries(state);
        return [
          ["Visible", serviceRows.length ? serviceRows.slice(0, 3).map((entry) => `${entry.host}:${entry.name}`).join(", ") : "none"],
          ["Reachable", `${serviceRows.filter((entry) => entry.status !== "restricted").length} service(s)`],
          ["Actions", serviceRows.flatMap((entry) => entry.actions).slice(0, 3).join(" | ") || "inspect first"],
          ["Current", `${host} service table from backend state`],
        ];
      case "shares":
        const shareRows = desktopShareEntries(state);
        return [
          ["Visible", shareRows.length ? shareRows.slice(0, 3).map((entry) => `${entry.host}\\\\${entry.name}`).join(", ") : "none"],
          ["Writable", `${shareRows.filter((entry) => entry.writable).length} share(s)`],
          ["Actions", shareRows.flatMap((entry) => entry.actions).slice(0, 3).join(" | ") || "files first"],
          ["Scope", "derived from visible files, downloads, and home storage"],
        ];
      case "printers":
        const printRows = desktopPrintEntries(state);
        return [
          ["Queues", printRows.length ? printRows.slice(0, 3).map((entry) => `${entry.host}:${entry.queue}`).join(", ") : "none"],
          ["Held", `${printRows.filter((entry) => entry.status === "held").length} held job(s)`],
          ["Actions", printRows.flatMap((entry) => entry.actions).slice(0, 3).join(" | ") || "files first"],
          ["Source", "derived from tasks, files, and recent events"],
        ];
      case "registry":
        const registryRows = desktopRegistryEntries(state);
        return [
          ["Hives", registryRows.length ? Array.from(new Set(registryRows.map((entry) => entry.hive))).join(", ") : "none"],
          ["Writable", `${registryRows.filter((entry) => entry.writable).length} setting key(s)`],
          ["Current", registryRows.filter((entry) => entry.source === "session").slice(0, 3).map((entry) => `${entry.name}=${entry.value}`).join(", ") || "no session keys"],
          ["Source", "derived from backend state, prefs, host graph, and access"],
        ];
      case "files":
        const visibleFiles = desktopFileEntries(state);
        return [
          ["cwd", state.cwd],
          ["downloads", `${Object.keys(state.downloads ?? {}).length} server-tracked file(s)`],
          ["visible files", visibleFiles.length ? visibleFiles.slice(0, 3).map((entry) => entry.name).join(", ") : "none"],
          ["home files", `${visibleFiles.filter((entry) => entry.kind === "home").length} user file(s)`],
          ["host files", `visible through ${host} context`],
        ];
      case "boards":
        const boardRows = desktopBoardEntries(state);
        return [
          ["Messages", `${boardRows.length} visible item(s)`],
          ["Latest", boardRows.at(0) ? `${boardRows[0]!.subject} (${boardRows[0]!.kind})` : "none"],
          ["USENET", `${usenetGroups().length} group(s), ${allUsenetArticles().length} article(s)`],
          ["Signals", "old posts can imply routes, accounts, and maintenance habits"],
        ];
      case "mail":
        const mailRows = desktopMailEntries(state);
        return [
          ["Inbox", `${mailRows.length} message(s)`],
          ["Preview", mailRows.at(0) ? `${mailRows[0]!.subject} from ${mailRows[0]!.from}` : "none"],
          ["Compose", "mail mode writes durable server messages"],
          ["Receipts", "future jobs and host events can report here"],
        ];
      case "tasks":
        const queuedTasks = state.desktopTasks.filter((task) => task.status !== "done");
        return [
          ["Jobs", queuedTasks.length ? queuedTasks.slice(0, 3).map((task) => `${task.kind}:${task.target}`).join(", ") : "no queued desktop tasks"],
          ["Camp", state.campHost ? `watching ${state.campHost}` : "no camp set"],
          ["Tunnel", state.tunnel ? `${state.tunnel.from} -> ${state.tunnel.to}` : "no active tunnel"],
        ];
      case "logs":
        return [
          ["Session", `tty ${state.ttyPort} mode=${state.shellMode} stty=${state.stty}`],
          ["Progress", `${state.badges.length} badge(s), current host ${host}`],
          ["Events", `${state.desktopEvents.length} recorded`],
          ["Last event", state.desktopEvents.at(-1)?.message ?? "none"],
          ["Last command", state.commandHistory.at(-1)?.line ?? "none"],
          ["Audit", "takeover, secure, tunnel, and camp actions leave readable traces"],
        ];
      case "help":
        const helpRows = desktopHelpEntries(state);
        return [
          ["Topics", `${helpRows.length} backend support row(s)`],
          ["Commands", helpRows.filter((entry) => entry.section === "Commands").slice(0, 3).map((entry) => entry.topic).join(", ") || "none"],
          ["Workstation", helpRows.filter((entry) => entry.section === "Workstation").slice(0, 3).map((entry) => entry.topic).join(", ") || "none"],
          ["Source", "derived from backend command help, applets, history, bookmarks, tasks, events, services, and connection state"],
        ];
      case "settings":
        return [
          ["Theme", `${state.desktopTheme} stored by the backend`],
          ["Motion", state.desktopPrefs.motion],
          ["Font size", state.desktopPrefs.fontSize],
          ["Contrast", state.desktopPrefs.contrast],
          ["Sound", state.desktopPrefs.sound],
          ["Keyboard", state.desktopPrefs.keyboardMode],
          ["Terminal mode", `${state.stty} output shaping`],
          ["Fallback", "the plain HTML route uses the same command engine"],
        ];
    }
  })();
  return [
    `Desktop app: ${state.desktopActiveApp} (${title})`,
    `Open: ${state.desktopOpenApps.join(" ")}`,
    `Minimized: ${state.desktopMinimizedApps.length ? state.desktopMinimizedApps.join(" ") : "none"}`,
    `Maximized: ${state.desktopMaximizedApps.length ? state.desktopMaximizedApps.join(" ") : "none"}`,
    `Position: ${position ? `${position.x},${position.y}` : "default"}`,
    `Command: ${state.desktopActiveApp === "terminal" ? "type shell commands" : "desktop <app> / theme <era>"}`,
    ...rows.map(([name, value]) => `  ${name.padEnd(14)} ${value}`),
  ];
}

function setDesktopWindow(state: ShellSessionState, action: DesktopWindowAction, app: DesktopAppId): string {
  normalizeDesktopWindowState(state);
  if (action === "close" && app === "terminal") return "Terminal cannot be closed.";
  if (action === "open" || action === "focus" || action === "restore") {
    if (!state.desktopOpenApps.includes(app)) state.desktopOpenApps.push(app);
    state.desktopMinimizedApps = state.desktopMinimizedApps.filter((item) => item !== app);
    if (action === "restore") state.desktopMaximizedApps = state.desktopMaximizedApps.filter((item) => item !== app);
    state.desktopActiveApp = app;
    normalizeDesktopWindowState(state);
    return action === "restore" ? `Desktop app restored: ${app}` : `Desktop app set: ${app}`;
  }
  if (action === "min") {
    if (app !== "terminal" && state.desktopOpenApps.includes(app) && !state.desktopMinimizedApps.includes(app)) {
      state.desktopMinimizedApps.push(app);
    }
    state.desktopMaximizedApps = state.desktopMaximizedApps.filter((item) => item !== app);
    if (state.desktopActiveApp === app) {
      state.desktopActiveApp = state.desktopOpenApps.find((item) => item !== app && !state.desktopMinimizedApps.includes(item)) ?? "terminal";
    }
    normalizeDesktopWindowState(state);
    return `Desktop app minimized: ${app}`;
  }
  if (action === "max") {
    if (app === "terminal") return "Terminal cannot be maximized.";
    if (!state.desktopOpenApps.includes(app)) state.desktopOpenApps.push(app);
    state.desktopMinimizedApps = state.desktopMinimizedApps.filter((item) => item !== app);
    if (!state.desktopMaximizedApps.includes(app)) state.desktopMaximizedApps.push(app);
    state.desktopActiveApp = app;
    normalizeDesktopWindowState(state);
    return `Desktop app maximized: ${app}`;
  }
  state.desktopOpenApps = state.desktopOpenApps.filter((item) => item === "terminal" || item !== app);
  state.desktopMinimizedApps = state.desktopMinimizedApps.filter((item) => item !== app);
  state.desktopMaximizedApps = state.desktopMaximizedApps.filter((item) => item !== app);
  if (state.desktopActiveApp === app) state.desktopActiveApp = "terminal";
  normalizeDesktopWindowState(state);
  return `Desktop app closed: ${app}`;
}

function moveDesktopWindow(state: ShellSessionState, app: DesktopAppId, xValue: string | undefined, yValue: string | undefined): string | null {
  const position = normalizeDesktopWindowPosition({
    x: Number(xValue),
    y: Number(yValue),
  });
  if (!position) return null;
  state.desktopWindowPositions = normalizeDesktopWindowPositions(state.desktopWindowPositions);
  state.desktopWindowPositions[app] = position;
  if (!state.desktopOpenApps.includes(app)) state.desktopOpenApps.push(app);
  state.desktopMinimizedApps = state.desktopMinimizedApps.filter((item) => item !== app);
  state.desktopMaximizedApps = state.desktopMaximizedApps.filter((item) => item !== app);
  state.desktopActiveApp = app;
  normalizeDesktopWindowState(state);
  return `Desktop app moved: ${app} ${position.x},${position.y}`;
}

function exportDesktopPresentation(state: ShellSessionState): string[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.desktopWindowPositions = normalizeDesktopWindowPositions(state.desktopWindowPositions);
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  return [
    "Desktop export:",
    JSON.stringify({
      theme: state.desktopTheme,
      activeApp: state.desktopActiveApp,
      openApps: state.desktopOpenApps,
      minimizedApps: state.desktopMinimizedApps,
      maximizedApps: state.desktopMaximizedApps,
      windowPositions: state.desktopWindowPositions,
      prefs: state.desktopPrefs,
      bookmarks: state.desktopBookmarks,
      recentHistory: state.commandHistory.slice(-8),
      tasks: state.desktopTasks,
      recentEvents: state.desktopEvents.slice(-8),
    }, null, 2),
  ];
}

function resetDesktopPresentation(state: ShellSessionState, target: string | undefined): string | null {
  const resetTarget = target ?? "all";
  if (resetTarget !== "layout" && resetTarget !== "prefs" && resetTarget !== "all") return null;
  if (resetTarget === "layout" || resetTarget === "all") {
    state.desktopActiveApp = "terminal";
    state.desktopOpenApps = ["terminal"];
    state.desktopMinimizedApps = [];
    state.desktopMaximizedApps = [];
    state.desktopWindowPositions = {};
  }
  if (resetTarget === "prefs" || resetTarget === "all") {
    state.desktopPrefs = normalizeDesktopPrefs({});
  }
  normalizeDesktopWindowState(state);
  return `Desktop ${resetTarget} reset.`;
}

export interface ShellResult {
  output: string[];
  state: ShellSessionState;
  pager?: boolean;
}

function enterMonitor(state: ShellSessionState): ShellResult {
  state.shellMode = "monitor";
  state.pager = null;
  return {
    output: [
      "Entering 6502 monitor.",
      "*",
    ],
    state,
  };
}

function runMonitorCommand(
  state: ShellSessionState,
  cmd: string,
  args: string[],
): ShellResult {
  const rest = args.join(" ").trim();
  switch (cmd) {
    case "?":
    case "help":
      return {
        output: [
          "Monitor commands:",
          "  D [addr]   dump the current synthetic memory",
          "  L [addr]   list the current synthetic code",
          "  R          show registers",
          "  G [addr]   resume the shell",
          "  Q / EXIT   return to the shell",
        ],
        state,
      };
    case "d":
      return {
        output: [
          `D ${rest || "2000"}`,
          "2000  4C 45 47 41 43 59 20 4D",
          "2010  4F 4E 49 54 4F 52 20 20",
          "2020  53 48 45 4C 4C 20 20 20",
        ],
        state,
      };
    case "l":
      return {
        output: [
          `L ${rest || "2000"}`,
          "0000  JSR LEGACY",
          "0003  JSR SHELL",
          "0006  RTS",
        ],
        state,
      };
    case "r":
      return {
        output: [
          "A=00 X=01 Y=00 P=24 SP=FF",
          `PC=${state.cwd === "/" ? "2000" : "2010"}`,
          `MODE=${state.loggedIn ? "AUTH" : "NLI"}`,
        ],
        state,
      };
    case "g":
      state.shellMode = "shell";
      return {
        output: [
          rest ? `Run ${rest}.` : "Run complete.",
          "Returning to the shell.",
        ],
        state,
      };
    case "q":
    case "quit":
    case "exit":
      state.shellMode = "shell";
      return {
        output: ["Exit monitor.", "The shell returns to @ mode."],
        state,
      };
    default:
      return {
        output: [
          `Unknown monitor command: ${cmd}`,
          "Type ? or help for the monitor commands.",
        ],
        state,
      };
  }
}

const BASIC_PROGRAMS: Record<string, string[]> = {
  "aceyducey.bas": [
    "10 PRINT \"ACEY DUCEY CARD GAME\"",
    "20 PRINT \"MIDDLE CARD: 7\"",
    "30 PRINT \"PLACE YOUR BET.\"",
  ],
  "birthday.bas": [
    "10 PRINT \"BIRTHDAY CALENDAR\"",
    "20 INPUT \"MONTH\";M",
    "30 INPUT \"DAY\";D",
  ],
  "lunar.bas": [
    "10 PRINT \"LUNAR LANDER\"",
    "20 PRINT \"FUEL 500 ALTITUDE 1200\"",
    "30 PRINT \"BURN?\"",
  ],
  "orbit.bas": [
    "10 PRINT \"ORBITAL PLOT\"",
    "20 FOR I=1 TO 8",
    "30 PRINT TAB(I);\"*\"",
  ],
};

function enterBasic(state: ShellSessionState): ShellResult {
  state.shellMode = "basic";
  state.pager = null;
  hydrateBasicPrograms(state);
  return {
    output: [
      "Dartmouth DTSS TeleBASIC (c) 1964,1966,1969,1970,1971,1979",
      "Type HELP for commands.",
    ],
    state,
  };
}

function hydrateBasicPrograms(state: ShellSessionState): void {
  if (!state.userId) return;
  const rows = db.select().from(basicPrograms).where(eq(basicPrograms.userId, state.userId)).all();
  state.basicUserPrograms = {
    ...state.basicUserPrograms,
    ...Object.fromEntries(rows.map((row) => [row.name, row.lines])),
  };
}

function saveBasicProgram(state: ShellSessionState, name: string, program: string[]): void {
  state.basicUserPrograms[name] = [...program];
  if (!state.userId) return;
  db.delete(basicPrograms)
    .where(and(eq(basicPrograms.userId, state.userId), eq(basicPrograms.name, name)))
    .run();
  db.insert(basicPrograms).values({
    userId: state.userId,
    name,
    lines: [...program],
    updatedAt: Date.now(),
  }).run();
}

function deleteBasicProgram(state: ShellSessionState, name: string): void {
  delete state.basicUserPrograms[name];
  if (!state.userId) return;
  db.delete(basicPrograms)
    .where(and(eq(basicPrograms.userId, state.userId), eq(basicPrograms.name, name)))
    .run();
}

function basicCatalog(state: ShellSessionState): string[] {
  return [...Object.keys(BASIC_PROGRAMS), ...Object.keys(state.basicUserPrograms)].sort();
}

function currentBasicProgram(state: ShellSessionState): string[] | null {
  if (!state.basicProgram) return null;
  return state.basicUserPrograms[state.basicProgram] ?? BASIC_PROGRAMS[state.basicProgram] ?? null;
}

function runBasicCommand(
  state: ShellSessionState,
  cmd: string,
  args: string[],
): ShellResult {
  switch (cmd) {
    case "?":
    case "help":
      return {
        output: [
          "Command, one of the following:",
          "  delete  dir     help    list    load    quit    renumber",
          "  run     save",
        ],
        state,
      };
    case "dir":
      return beginPager(state, [
        "Directory of basic programs:",
        ...basicCatalog(state).map((name) => `  ${name}`),
      ]);
    case "load": {
      const name = (args[0] ?? "").toLowerCase();
      if (!name) return { output: ["Usage: load <file>"], state };
      const program = state.basicUserPrograms[name] ?? BASIC_PROGRAMS[name];
      if (!program) return { output: [`${name}: not found`], state };
      state.basicProgram = name;
      return { output: [`Loaded ${name}.`], state };
    }
    case "list": {
      const program = currentBasicProgram(state);
      if (!program) return { output: ["No program in memory."], state };
      return beginPager(state, program);
    }
    case "run": {
      const requested = args[0]?.toLowerCase();
      if (requested) {
        const program = state.basicUserPrograms[requested] ?? BASIC_PROGRAMS[requested];
        if (!program) return { output: [`${requested}: not found`], state };
        state.basicProgram = requested;
      }
      const program = currentBasicProgram(state);
      if (!program) return { output: ["No program in memory."], state };
      return {
        output: [
          `Running ${state.basicProgram}.`,
          ...program.map((line) => line.replace(/^\d+\s+/, "")),
          "READY.",
        ],
        state,
      };
    }
    case "renumber": {
      const program = currentBasicProgram(state);
      if (!program || !state.basicProgram) return { output: ["No program in memory."], state };
      const start = Number.parseInt(args[0] ?? "10", 10) || 10;
      const inc = Number.parseInt(args[1] ?? "10", 10) || 10;
      saveBasicProgram(state, state.basicProgram, program.map((line, index) =>
        `${start + index * inc} ${line.replace(/^\d+\s+/, "")}`,
      ));
      return { output: [`Renumbered ${state.basicProgram}.`], state };
    }
    case "save": {
      const name = (args[0] ?? state.basicProgram ?? "").toLowerCase();
      const program = currentBasicProgram(state);
      if (!name || !program) return { output: ["Usage: save <file>"], state };
      saveBasicProgram(state, name, program);
      state.basicProgram = name;
      return { output: [`Saved ${name}.`], state };
    }
    case "delete": {
      const name = (args[0] ?? "").toLowerCase();
      if (!name) return { output: ["Usage: delete <file>"], state };
      if (!state.basicUserPrograms[name]) return { output: [`${name}: not a user program`], state };
      deleteBasicProgram(state, name);
      if (state.basicProgram === name) state.basicProgram = null;
      return { output: [`Deleted ${name}.`], state };
    }
    case "quit":
    case "exit":
      state.shellMode = "shell";
      state.basicProgram = null;
      return { output: ["Exit TeleBASIC.", "The shell returns to @ mode."], state };
    default:
      return { output: [`${cmd}: ?SN ERROR`], state };
  }
}

interface UsenetArticle {
  id: number;
  group: string;
  subject: string;
  from: string;
  date: string;
  body: string[];
  createdAt?: number;
}

const USENET_ARTICLES: UsenetArticle[] = [
  {
    id: 1,
    group: "comp.misc",
    subject: "old hosts never really vanish",
    from: "magi@csd.uwo.ca",
    date: "1987-05-12",
    body: [
      "Every old route eventually becomes documentation.",
      "Keep the path short, keep the headers intact, and do not trust quiet links.",
    ],
  },
  {
    id: 2,
    group: "alt.folklore.computers",
    subject: "terminal folklore and glowing rooms",
    from: "sysop@relay",
    date: "1989-11-03",
    body: [
      "The best machines had labels from three owners ago.",
      "If the fan pitch changes when you type, you are probably home.",
    ],
  },
  {
    id: 3,
    group: "rec.games.int-fiction",
    subject: "z-machine shelves",
    from: "parser@games",
    date: "1990-02-18",
    body: [
      "A white house, a mailbox, and a lantern are enough to turn a shell into a room.",
      "The rest is a matter of verbs.",
    ],
  },
  {
    id: 4,
    group: "news.announce.newusers",
    subject: "reading the archive",
    from: "moderator@news",
    date: "1986-01-01",
    body: [
      "Use GROUPS, GROUP <name>, LIST, READ <n>, SEARCH <term>, and QUIT.",
      "Be patient with the archive. It has crossed many wires.",
    ],
  },
];

function usenetGroups(): string[] {
  const posted = db.select().from(usenetArticles).all();
  return Array.from(new Set([...USENET_ARTICLES.map((article) => article.group), ...posted.map((article) => article.group)])).sort();
}

function allUsenetArticles(): UsenetArticle[] {
  const posted = db.select().from(usenetArticles).all().map((article) => ({
    id: article.id + 1000,
    group: article.group,
    subject: article.subject,
    from: article.author,
    date: new Date(article.createdAt).toISOString().slice(0, 10),
    body: article.body,
    createdAt: article.createdAt,
  }));
  return [...USENET_ARTICLES, ...posted].sort((a, b) => a.id - b.id);
}

function articlesForGroup(group: string | null): UsenetArticle[] {
  const activeGroup = group ?? "news.announce.newusers";
  return allUsenetArticles().filter((article) => article.group === activeGroup);
}

function collectDesktopBoardEntries(state: ShellSessionState): DesktopBoardEntry[] {
  const host = currentHost(state);
  const sysopEntries = allBbsSysopRecords().map((record): DesktopBoardEntry => ({
    id: `sysop:${record.host}:${record.userId}`,
    kind: "sysop",
    board: `${record.host} sysop`,
    author: record.owner.replace(/\s+/g, " ").slice(0, 48),
    subject: "SYSOP ownership",
    preview: `${record.owner} administers ${record.board}; ${record.policy}`.replace(/\s+/g, " ").slice(0, 120),
    createdAt: record.createdAt,
  }));
  const bbsEntries = messagesForBoard(host).map((message, index): DesktopBoardEntry => ({
    id: `bbs:${host}:${message.createdAt}:${index}`,
    kind: "bbs",
    board: `${host} general`,
    author: message.author.replace(/\s+/g, " ").slice(0, 48),
    subject: message.subject.replace(/\s+/g, " ").slice(0, 80),
    preview: message.body.replace(/\s+/g, " ").slice(0, 120),
    createdAt: message.createdAt,
  }));
  const usenetEntries = allUsenetArticles()
    .map((article): DesktopBoardEntry => ({
      id: `usenet:${article.id}`,
      kind: "usenet",
      board: article.group,
      author: article.from.replace(/\s+/g, " ").slice(0, 48),
      subject: article.subject.replace(/\s+/g, " ").slice(0, 80),
      preview: article.body.join(" ").replace(/\s+/g, " ").slice(0, 120),
      createdAt: article.createdAt ?? Date.parse(article.date) ?? 0,
    }));
  return [...sysopEntries, ...bbsEntries, ...usenetEntries]
    .sort((a, b) => b.createdAt - a.createdAt || a.kind.localeCompare(b.kind))
}

export function desktopBoardEntries(state: ShellSessionState): DesktopBoardEntry[] {
  return collectDesktopBoardEntries(state).slice(0, 32);
}

function enterUsenet(state: ShellSessionState): ShellResult {
  state.shellMode = "usenet";
  state.pager = null;
  state.usenetGroup = state.usenetGroup ?? "news.announce.newusers";
  return {
    output: [
      "USENET archive reader",
      `Current group: ${state.usenetGroup}`,
      "Type HELP for commands.",
    ],
    state,
  };
}

function enterNews(state: ShellSessionState, target: string | undefined): ShellResult {
  const entered = enterUsenet(state);
  return {
    output: [`NEWS connected to ${target ?? "news"}.`, ...entered.output],
    state,
  };
}

function formatUsenetList(group: string | null): string[] {
  const articles = articlesForGroup(group);
  if (!articles.length) return [`No articles in ${group}.`];
  return [
    `Articles in ${group}:`,
    ...articles.map((article) =>
      `${article.id.toString().padStart(3, " ")}  ${article.date}  ${article.from.padEnd(20).slice(0, 20)}  ${article.subject}`,
    ),
  ];
}

function formatUsenetArticle(article: UsenetArticle): string[] {
  return [
    `Newsgroups: ${article.group}`,
    `From: ${article.from}`,
    `Date: ${article.date}`,
    `Subject: ${article.subject}`,
    "",
    ...article.body,
  ];
}

function clearUsenetDraft(state: ShellSessionState): ShellSessionState {
  state.usenetSubmode = null;
  state.usenetDraftGroup = null;
  state.usenetDraftSubject = null;
  return state;
}

function clearIrcState(state: ShellSessionState): ShellSessionState {
  state.ircHost = null;
  state.ircChannel = null;
  state.ircNick = null;
  return state;
}

function runUsenetCommand(
  state: ShellSessionState,
  cmd: string,
  args: string[],
): ShellResult {
  const rawInput = [cmd, ...args].join(" ").trim();

  if (state.usenetSubmode === "post-subject") {
    if (!rawInput) return { output: ["Enter subject:"], state };
    state.usenetDraftSubject = rawInput;
    state.usenetSubmode = "post-body";
    return { output: ["Enter article body. Finish with one line."], state };
  }

  if (state.usenetSubmode === "post-body") {
    if (!rawInput) return { output: ["Article cancelled."], state: clearUsenetDraft(state) };
    db.insert(usenetArticles).values({
      group: state.usenetDraftGroup ?? state.usenetGroup ?? "news.announce.newusers",
      subject: state.usenetDraftSubject ?? "(no subject)",
      author: `${state.username ?? "guest"}@${currentHost(state)}`,
      body: [rawInput],
      createdAt: Date.now(),
    }).run();
    const group = state.usenetDraftGroup ?? state.usenetGroup ?? "news.announce.newusers";
    state.usenetGroup = group;
    recordDesktopEvent(state, "info", "boards", `article posted ${group}`);
    clearUsenetDraft(state);
    return { output: [`Article posted to ${group}.`, ...formatUsenetList(group)], state };
  }

  switch (cmd) {
    case "?":
    case "help":
      return {
        output: [
          "USENET commands:",
          "  groups              list available newsgroups",
          "  group <name>        select a newsgroup",
          "  list                list articles in the current group",
          "  read <id>           read an article",
          "  post [group]        post an article",
          "  search <term>       search subjects and bodies",
          "  quit                return to the shell",
        ],
        state,
      };
    case "groups":
      return { output: ["Newsgroups:", ...usenetGroups().map((group) => `  ${group}`)], state };
    case "group": {
      const group = args[0];
      if (!group) return { output: ["Usage: group <name>"], state };
      if (!usenetGroups().includes(group)) return { output: [`No such newsgroup: ${group}`], state };
      state.usenetGroup = group;
      return { output: [`Current group: ${group}`, ...formatUsenetList(group)], state };
    }
    case "list":
      return beginPager(state, formatUsenetList(state.usenetGroup));
    case "read": {
      const id = Number.parseInt(args[0] ?? "", 10);
      const article = allUsenetArticles().find((entry) => entry.id === id);
      if (!article) return { output: ["Usage: read <article id>"], state };
      state.usenetGroup = article.group;
      return beginPager(state, formatUsenetArticle(article));
    }
    case "post": {
      const group = args[0] ?? state.usenetGroup ?? "news.announce.newusers";
      if (!usenetGroups().includes(group)) return { output: [`No such newsgroup: ${group}`], state };
      state.usenetDraftGroup = group;
      state.usenetDraftSubject = null;
      state.usenetSubmode = "post-subject";
      return { output: [`Posting to ${group}.`, "Enter subject:"], state };
    }
    case "search": {
      const term = args.join(" ").toLowerCase();
      if (!term) return { output: ["Usage: search <term>"], state };
      const matches = allUsenetArticles().filter((article) =>
        [article.group, article.subject, article.from, ...article.body].join(" ").toLowerCase().includes(term),
      );
      return {
        output: matches.length
          ? ["Search results:", ...matches.map((article) => `${article.id} ${article.group} ${article.subject}`)]
          : [`No Usenet matches for ${args.join(" ")}.`],
        state,
      };
    }
    case "quit":
    case "exit":
      state.shellMode = "shell";
      clearUsenetDraft(state);
      return { output: ["Leaving USENET.", "The shell returns to @ mode."], state };
    default:
      return { output: [`${cmd}: unknown usenet command`], state };
  }
}

function handleClock(): ShellResult["output"] {
  const now = new Date();
  return [
    `Clock: ${now.toLocaleTimeString("en-US", { hour12: false })}`,
    now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  ];
}

function enterIrc(state: ShellSessionState, target: string | undefined): ShellResult {
  state.shellMode = "irc";
  state.pager = null;
  state.ircHost = target ?? "irc";
  state.ircChannel = state.ircChannel ?? "#cyberscape";
  state.ircNick = state.username ?? "guest";
  return {
    output: [
      `IRC connected to ${state.ircHost}.`,
      `Nickname: ${state.ircNick}`,
      `Joined ${state.ircChannel}`,
      "Commands: CHANNELS, JOIN <#channel>, WHO, SAY <text>, NICK <name>, QUIT",
    ],
    state,
  };
}

function relaySessionRows(excludeSessionId: string | null = null): Array<{ id: string; ttyPort: number; username: string; channel: string }> {
  return db.select().from(shellSessions).all()
    .map((row) => ({
      row,
      state: row.state as unknown as Partial<ShellSessionState>,
    }))
    .filter(({ row, state }) =>
      row.id !== excludeSessionId &&
      state.shellMode === "irc" &&
      (state.ircHost ?? "").toLowerCase() === "relay" &&
      typeof state.ttyPort === "number"
    )
    .map(({ row, state }) => ({
      id: row.id,
      ttyPort: state.ttyPort ?? 0,
      username: state.username ?? "guest",
      channel: state.ircChannel ?? "#cyberscape",
    }))
    .sort((a, b) => a.username.localeCompare(b.username) || a.ttyPort - b.ttyPort);
}

function queueSessionMirrorLine(sessionId: string, line: string): boolean {
  const row = db.select().from(shellSessions).where(eq(shellSessions.id, sessionId)).get();
  if (!row) return false;
  const rowState = row.state as unknown as Partial<ShellSessionState>;
  const mirrorInbox = Array.isArray(rowState.mirrorInbox) ? [...rowState.mirrorInbox] : [];
  mirrorInbox.push(line);
  db.update(shellSessions)
    .set({
      state: {
        ...(rowState as Record<string, unknown>),
        mirrorInbox,
      },
      updatedAt: Date.now(),
    })
    .where(eq(shellSessions.id, sessionId))
    .run();
  return true;
}

function queueRelayBroadcast(state: ShellSessionState, channel: string, line: string): number {
  let delivered = 0;
  for (const session of relaySessionRows(state.sessionId)) {
    if (session.channel.toLowerCase() !== channel.toLowerCase()) continue;
    if (queueSessionMirrorLine(session.id, line)) delivered += 1;
  }
  return delivered;
}

function activeTalkPeer(state: ShellSessionState): { sessionId: string; username: string; ttyPort: number } | null {
  const channel = state.ircChannel ?? "";
  if (!channel.startsWith("@")) return null;
  const username = channel.slice(1).toLowerCase();
  const target = resolveLinkTarget(state, username);
  if (!target) return null;
  const row = db.select().from(shellSessions).where(eq(shellSessions.id, target.sessionId)).get();
  if (!row) return null;
  const rowState = row.state as unknown as Partial<ShellSessionState>;
  return {
    sessionId: target.sessionId,
    username: rowState.username ?? username,
    ttyPort: rowState.ttyPort ?? 0,
  };
}

function enterRelay(state: ShellSessionState, channelArg?: string): ShellResult {
  state.shellMode = "irc";
  state.pager = null;
  state.ircHost = "relay";
  state.ircChannel = channelArg?.startsWith("#") ? channelArg.toLowerCase() : "#cyberscape";
  state.ircNick = state.username ?? "guest";
  return {
    output: [
      "RELAY connected to relay.",
      `Handle: ${state.ircNick}`,
      `Joined ${state.ircChannel}`,
      "Commands: CHANNELS, JOIN <#channel>, WHO, SAY <text>, QUIT",
    ],
    state,
  };
}

function enterTalk(state: ShellSessionState, recipient: string | undefined): ShellResult {
  if (!recipient) {
    return {
      output: ["Usage: talk <user>", "The user must have an active tty; use WHO to inspect live sessions."],
      state,
    };
  }
  const target = resolveLinkTarget(state, recipient);
  if (!target) {
    return {
      output: [`No active tty for ${recipient}.`, "Use SEND for durable mail when the operator is offline."],
      state,
    };
  }
  const row = db.select().from(shellSessions).where(eq(shellSessions.id, target.sessionId)).get();
  const rowState = row?.state as Partial<ShellSessionState> | undefined;
  const peer = rowState?.username ?? recipient.toLowerCase();
  state.shellMode = "irc";
  state.pager = null;
  state.ircHost = "relay";
  state.ircChannel = `@${peer.toLowerCase()}`;
  state.ircNick = state.username ?? "guest";
  queueSessionMirrorLine(target.sessionId, `%talk request from ${state.ircNick} on tty ${state.ttyPort}`);
  recordDesktopEvent(state, "info", "talk", `talk opened ${peer}`);
  return {
    output: [
      `TALK connected to ${peer}.`,
      `Peer tty: ${rowState?.ttyPort ?? "?"}`,
      "Commands: SAY <text>, WHO, QUIT",
    ],
    state,
  };
}

function withQueuedRelayLines(state: ShellSessionState, output: string[]): ShellResult {
  const queued = state.mirrorInbox.length ? [...state.mirrorInbox] : [];
  state.mirrorInbox = [];
  return {
    output: queued.length ? [...queued, ...output] : output,
    state,
  };
}

function runIrcCommand(
  state: ShellSessionState,
  cmd: string,
  args: string[],
): ShellResult {
  const host = state.ircHost ?? "irc";
  const channel = state.ircChannel ?? "#cyberscape";
  const nick = state.ircNick ?? state.username ?? "guest";
  const isRelay = host.toLowerCase() === "relay";
  const isTalk = channel.startsWith("@");
  const talkPeerName = isTalk ? channel.slice(1) : null;
  const talkPeer = isTalk ? activeTalkPeer(state) : null;

  switch (cmd) {
    case "?":
    case "help":
      return withQueuedRelayLines(state, [
        ...(isTalk
          ? [
            "TALK commands:",
            "  who                show the direct peer and tty",
            "  say <text>         send a direct line",
            "  reply <text>       alias for say",
            "  quit               return to the shell",
          ]
          : [
            `${isRelay ? "RELAY" : "IRC"} commands:`,
            "  channels           list visible channels",
            "  join <#channel>    join a channel",
            "  who                list visible users",
            "  say <text>         send a line to the channel",
            "  nick <name>        change your nickname",
            "  quit               return to the shell",
          ]),
      ]);
    case "channels":
    case "list":
      return withQueuedRelayLines(state, isTalk
        ? [`Direct peer: ${talkPeerName ?? "unknown"}`]
        : [
          `${isRelay ? "Relay" : "IRC relay"} ${host}`,
          "  #cyberscape  shell operators and archivists",
          "  #bbs        board couriers and modem noise",
          "  #intfiction lanterns, leaflets, and parser lore",
        ]);
    case "join": {
      if (isTalk) return withQueuedRelayLines(state, ["JOIN disabled inside TALK; use QUIT first."]);
      const nextChannel = args[0];
      if (!nextChannel || !nextChannel.startsWith("#")) {
        return withQueuedRelayLines(state, ["Usage: JOIN <#channel>"]);
      }
      state.ircChannel = nextChannel.toLowerCase();
      return withQueuedRelayLines(state, [
        `Joined ${state.ircChannel}`,
        `Topic for ${state.ircChannel}: packets, route lore, and slow text`,
      ]);
    }
    case "talk":
      if (isTalk) return withQueuedRelayLines(state, ["Already in TALK mode. Use QUIT before switching peers."]);
      return withQueuedRelayLines(state, enterTalk(state, args[0]).output);
    case "who":
    case "names":
      if (isTalk) {
        return withQueuedRelayLines(state, [
          `Direct talk with ${talkPeerName ?? "unknown"}:`,
          `  ${nick} (you)`,
          `  ${talkPeer?.username ?? talkPeerName ?? "offline"} tty=${talkPeer?.ttyPort ?? "offline"}`,
        ]);
      }
      return withQueuedRelayLines(state, [
        `Users in ${channel}:`,
        `  ${nick} (you)`,
        ...relaySessionRows(state.sessionId)
          .filter((session) => session.channel.toLowerCase() === channel.toLowerCase())
          .map((session) => `  ${session.username} tty=${session.ttyPort}`),
        "  routebot",
      ]);
    case "say":
    case "msg":
    case "reply": {
      const text = args.join(" ").trim();
      if (!text) return withQueuedRelayLines(state, [`Usage: ${cmd.toUpperCase()} <text>`]);
      if (isTalk) {
        if (!talkPeer) {
          return withQueuedRelayLines(state, [`${talkPeerName ?? "peer"} is no longer on an active tty.`, "Use SEND for durable mail."]);
        }
        const line = `[talk ${talkPeer.username}] <${nick}> ${text}`;
        queueSessionMirrorLine(talkPeer.sessionId, line);
        recordDesktopEvent(state, "info", "talk", `talk sent ${talkPeer.username}`);
        return withQueuedRelayLines(state, [
          line,
          `Delivered live to tty ${talkPeer.ttyPort}.`,
        ]);
      }
      const line = `[${channel}] <${nick}> ${text}`;
      const delivered = isRelay ? queueRelayBroadcast(state, channel, line) : 0;
      return withQueuedRelayLines(state, [
        line,
        `[${channel}] <routebot> packet echoed through ${host}`,
        isRelay ? `[${channel}] <routebot> delivered to ${delivered} live listener(s)` : `[${channel}] <routebot> packet mirrored`,
      ]);
    }
    case "nick": {
      if (isTalk) return withQueuedRelayLines(state, ["NICK disabled inside TALK; the direct peer follows your shell username."]);
      const nextNick = args[0];
      if (!nextNick) return withQueuedRelayLines(state, ["Usage: NICK <name>"]);
      state.ircNick = nextNick;
      return withQueuedRelayLines(state, [`Nickname changed to ${nextNick}.`]);
    }
    case "bye":
    case "exit":
    case "quit":
      state.shellMode = "shell";
      clearIrcState(state);
      return withQueuedRelayLines(state, [`${isTalk ? "TALK" : isRelay ? "RELAY" : "IRC"} connection closed.`]);
    default:
      return withQueuedRelayLines(state, [`${cmd}: unknown ${isTalk ? "talk" : isRelay ? "relay" : "irc"} command`]);
  }
}

function handleDdate(): ShellResult["output"] {
  const now = new Date();
  return [
    `DDATE ${now.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()} ${now.getFullYear()}`,
    "A retro-future calendar with a small amount of gravitational weirdness.",
  ];
}

function handleWhen(): ShellResult["output"] {
  return [`When: ${new Date().toString()}`];
}

function handleRand(args: string[]): ShellResult["output"] {
  if (args.length >= 2) {
    const min = Number(args[0]);
    const max = Number(args[1]);
    if (Number.isFinite(min) && Number.isFinite(max) && max >= min) {
      const value = Math.floor(Math.random() * (max - min + 1)) + min;
      return [`Random integer: ${value}`];
    }
  }
  return [`Random: ${Math.random().toFixed(6)}`];
}

function handleRoll(args: string[]): ShellResult["output"] {
  const spec = (args[0] ?? "1d6").toLowerCase();
  const match = spec.match(/^(\d{1,2})d(\d{1,3})$/);
  const count = match ? Math.max(1, Math.min(20, Number(match[1]))) : 1;
  const sides = match ? Math.max(2, Math.min(100, Number(match[2]))) : 6;
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  return [
    `Roll ${count}d${sides}: ${rolls.join(", ")}`,
    `Total: ${rolls.reduce((a, b) => a + b, 0)}`,
  ];
}

function handleRot13(args: string[]): ShellResult["output"] {
  const input = args.join(" ");
  if (!input) return ["Usage: rot13 <text>"];
  return [input.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch <= "Z" ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + 13) % 26) + base);
  })];
}

function handleMd5(args: string[]): ShellResult["output"] {
  const input = args.join(" ");
  if (!input) return ["Usage: md5 <text>"];
  return [createHash("md5").update(input).digest("hex")];
}

function syntheticHex(seed: string, count: number): string {
  return createHash("md5").update(seed).digest("hex").slice(0, count);
}

function handleIpaddr(state: ShellSessionState): ShellResult["output"] {
  const seed = `${currentHost(state)}:${state.username ?? "guest"}`;
  const hash = syntheticHex(seed, 6);
  return [`IP address: 10.${parseInt(hash.slice(0, 2), 16)}.${parseInt(hash.slice(2, 4), 16)}.${parseInt(hash.slice(4, 6), 16)}`];
}

function handleMac(state: ShellSessionState): ShellResult["output"] {
  const seed = `${state.username ?? "guest"}:${currentHost(state)}:${state.ttyPort}`;
  const hash = syntheticHex(seed, 12);
  return [`MAC address: ${hash.match(/.{1,2}/g)!.join(":").toUpperCase()}`];
}

function handleUuplot(state: ShellSessionState, args: string[]): ShellResult["output"] {
  const target = args[0];
  if (!target) return ["Usage: uuplot <host>"];
  return [
    "UUPlot:",
    ...uupath(currentHost(state), target).map((step) => `  ${step}`),
  ];
}

function handleCalc(args: string[]): ShellResult["output"] {
  const expression = args.join(" ").trim();
  if (!expression) return ["Usage: calc <expression>"];
  if (!/^[\d\s+\-*/().%^]+$/.test(expression)) {
    return ["calc: numeric operators only"];
  }
  try {
    const normalized = expression.replace(/\^/g, "**").replace(/%/g, "/100");
    const value = Function(`"use strict"; return (${normalized});`)();
    return [`${expression} = ${Number(value).toLocaleString("en-US", { maximumFractionDigits: 8 })}`];
  } catch {
    return ["calc: parse error"];
  }
}

function handleFactor(args: string[]): ShellResult["output"] {
  const n = Math.abs(Number.parseInt(args[0] ?? "", 10));
  if (!Number.isFinite(n) || n < 2) return ["Usage: factor <integer>"];
  const factors: number[] = [];
  let value = n;
  for (let i = 2; i * i <= value; i++) {
    while (value % i === 0) {
      factors.push(i);
      value /= i;
    }
  }
  if (value > 1) factors.push(value);
  return [`${n}: ${factors.join(" ")}`];
}

function handlePrimes(args: string[]): ShellResult["output"] {
  const limit = Math.min(Math.max(Number.parseInt(args[0] ?? "100", 10) || 100, 2), 1000);
  const primes: number[] = [];
  for (let n = 2; n <= limit; n++) {
    let prime = true;
    for (let d = 2; d * d <= n; d++) {
      if (n % d === 0) {
        prime = false;
        break;
      }
    }
    if (prime) primes.push(n);
  }
  return [`Primes <= ${limit}:`, primes.join(" ")];
}

function handlePing(args: string[]): ShellResult["output"] {
  const target = args[0] ?? "cyberscape";
  const host = getHost(target);
  if (!host) return [`ping: unknown host ${target}`];
  const seed = parseInt(syntheticHex(host.hostname, 4), 16);
  const base = 12 + (seed % 38);
  return [
    `PING ${host.hostname} (${host.location})`,
    `64 bytes from ${host.hostname}: icmp_seq=1 ttl=63 time=${base}.2 ms`,
    `64 bytes from ${host.hostname}: icmp_seq=2 ttl=63 time=${base + 1}.8 ms`,
  ];
}

function handleMorse(args: string[]): ShellResult["output"] {
  const table: Record<string, string> = {
    a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....",
    i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.",
    q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
    y: "-.--", z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--",
    "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  };
  const input = args.join(" ").toLowerCase();
  if (!input) return ["Usage: morse <text>"];
  return [input.split("").map((ch) => ch === " " ? "/" : table[ch] ?? ch).join(" ")];
}

function handleCowsay(args: string[]): ShellResult["output"] {
  const text = args.join(" ") || "May the command line live forever.";
  const top = ` ${"_".repeat(Math.min(text.length + 2, 62))}`;
  const bottom = ` ${"-".repeat(Math.min(text.length + 2, 62))}`;
  return [
    top,
    `< ${text.slice(0, 60)} >`,
    bottom,
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||",
  ];
}

function handleFiglet(args: string[]): ShellResult["output"] {
  const text = (args.join(" ") || "CYBERSCAPE").toUpperCase().slice(0, 24);
  return [
    text.split("").map((ch) => ch === " " ? "   " : `${ch} `).join(""),
    text.split("").map((ch) => ch === " " ? "   " : "| ").join(""),
    text.split("").map((ch) => ch === " " ? "   " : `${ch} `).join(""),
  ];
}

function handlePrivacy(): ShellResult["output"] {
  return [
    "Privacy:",
    "Sessions are synthetic and local to this clone.",
    "Use logout to end the current shell session.",
  ];
}

function handleRfc(args: string[]): ShellResult["output"] {
  const id = args[0] ?? "959";
  const titles: Record<string, string> = {
    "768": "User Datagram Protocol",
    "791": "Internet Protocol",
    "821": "Simple Mail Transfer Protocol",
    "854": "Telnet Protocol Specification",
    "959": "File Transfer Protocol",
  };
  return [`RFC ${id}: ${titles[id] ?? "reference not cached"}`];
}

function handleNotes(): ShellResult["output"] {
  return [
    "Notes:",
    "  hosts      browse the public network list",
    "  telnet     connect to a host",
    "  bbs        enter a board when available",
    "  scores     operator scoreboard",
    "  scores /badges /hosts /mail /bbs",
    "  write/append/rm/cp/mv manage home files",
  ];
}

function handleUnits(args: string[]): ShellResult["output"] {
  const [valueRaw, from, to] = args;
  const value = Number(valueRaw);
  if (!Number.isFinite(value) || !from || !to) return ["Usage: units <value> <from> <to>"];
  const key = `${from.toLowerCase()}:${to.toLowerCase()}`;
  const factors: Record<string, number> = {
    "kb:bytes": 1024,
    "mb:kb": 1024,
    "mb:bytes": 1024 * 1024,
    "miles:km": 1.609344,
    "km:miles": 0.621371,
    "c:f": 9 / 5,
    "f:c": 5 / 9,
  };
  if (key === "c:f") return [`${value} C = ${(value * 9 / 5 + 32).toFixed(2)} F`];
  if (key === "f:c") return [`${value} F = ${((value - 32) * 5 / 9).toFixed(2)} C`];
  const factor = factors[key];
  if (!factor) return [`units: no conversion for ${from} to ${to}`];
  return [`${value} ${from} = ${(value * factor).toFixed(4).replace(/\.?0+$/, "")} ${to}`];
}

function handle2048(): ShellResult["output"] {
  return [
    "2048",
    "+------+------+------+------+", 
    "|  2   |  4   |      |      |",
    "+------+------+------+------+",
    "|      |  8   |  16  |      |",
    "+------+------+------+------+",
    "|      |      |  32  |  64  |",
    "+------+------+------+------+",
    "| 128  |      |      | 256  |",
    "+------+------+------+------+", 
    "Use WASD in the full terminal client.",
  ];
}

function handleAquarium(): ShellResult["output"] {
  return [
    "Aquarium",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "   ><(((('>        <' ))))><      ><((>",
    "        _        .-~~-.      _",
    "     _ / \\ _    /      \\  _ / \\ _",
    "    (  o o  )  |  ()    |(  - -  )",
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
  ];
}

function handleRain(): ShellResult["output"] {
  return [
    "rain",
    " .  '  .    ' .   .  '",
    "   '   .  '    . '   .",
    " | | | | | | | | | | |",
    " | | | | | | | | | | |",
    "  ` ` ` ` ` ` ` ` ` `",
  ];
}

function handleStarwars(): ShellResult["output"] {
  return [
    "A long time ago in a network far, far away...",
    "",
    "              T E L E H A C K",
    "        Episode IV: A New Login",
    "",
    "It is a period of terminal unrest. Small shells",
    "move quietly through forgotten routes and old hosts.",
  ];
}

function handleEliza(args: string[]): ShellResult["output"] {
  const input = args.join(" ").trim();
  if (!input) {
    return ["ELIZA: TELL ME WHAT BRINGS YOU HERE."];
  }
  if (/\b(computer|terminal|network|host)\b/i.test(input)) {
    return ["ELIZA: DO MACHINES WORRY YOU?"];
  }
  if (/\b(i am|i'm|im)\b/i.test(input)) {
    return ["ELIZA: HOW LONG HAVE YOU FELT THIS WAY?"];
  }
  return [`ELIZA: WHY DO YOU SAY "${input.toUpperCase()}"?`];
}

function handlePhoon(): ShellResult["output"] {
  const phase = ["new", "waxing", "full", "waning"][new Date().getUTCDate() % 4]!;
  return [
    `Moon phase: ${phase}`,
    "      _..._",
    "   .:::::::. ",
    "  :::::::::::",
    "  `:::::::::'",
    "    `':::''",
  ];
}

function handlePig(args: string[]): ShellResult["output"] {
  const input = args.join(" ");
  if (!input) return ["Usage: pig <text>"];
  const translated = input.split(/\s+/).map((word) => {
    const match = word.match(/^([^aeiouAEIOU]*)(.*)$/);
    if (!match || !match[2]) return `${word}ay`;
    return `${match[2]}${match[1]}ay`;
  }).join(" ");
  return [translated];
}

function handleFnord(): ShellResult["output"] {
  return [
    "fnord",
    "The signal is easier to notice after you stop looking directly at it.",
  ];
}

function handleQr(args: string[]): ShellResult["output"] {
  const text = args.join(" ") || "cyberscape";
  const hash = syntheticHex(text, 16);
  const rows = ["QR:"];
  for (let y = 0; y < 8; y++) {
    let row = "";
    for (let x = 0; x < 16; x++) {
      const n = parseInt(hash[(x + y) % hash.length]!, 16);
      row += (n + x + y) % 2 === 0 ? "##" : "  ";
    }
    rows.push(row);
  }
  return rows;
}

function handleA2(args: string[]): ShellResult["output"] {
  const text = args.join(" ") || "cyberscape";
  return [
    "A2:",
    ...text.toUpperCase().split("").map((ch) => ch === " " ? "   " : `${ch} ${ch.charCodeAt(0).toString(16).padStart(2, "0")}`),
  ];
}

function handleAc(args: string[]): ShellResult["output"] {
  const expression = args.join(" ").trim() || "2+2";
  return ["AC calculator:", ...handleCalc([expression])];
}

function handleBrainfuck(args: string[]): ShellResult["output"] {
  const program = args.join("");
  if (!program) return ["Usage: bf <program>"];
  const cells = new Array<number>(16).fill(0);
  let pointer = 0;
  const output: string[] = [];
  for (const op of program.slice(0, 256)) {
    if (op === ">") pointer = Math.min(cells.length - 1, pointer + 1);
    if (op === "<") pointer = Math.max(0, pointer - 1);
    if (op === "+") cells[pointer] = (cells[pointer] + 1) % 256;
    if (op === "-") cells[pointer] = (cells[pointer] + 255) % 256;
    if (op === ".") output.push(String.fromCharCode(cells[pointer]));
  }
  return [
    `BF cells: ${cells.slice(0, 8).join(" ")}`,
    `Output: ${output.join("") || "(none)"}`,
  ];
}

function handleC8(): ShellResult["output"] {
  return [
    "CHIP-8",
    "V0 V1 V2 V3  I    PC",
    "00 04 08 0C  0200 0200",
    "Display: 64x32 monochrome, waiting for ROM.",
  ];
}

function handleCal(args: string[]): ShellResult["output"] {
  const now = new Date();
  const year = Number.parseInt(args[1] ?? "", 10) || now.getFullYear();
  const monthIndex = Math.min(11, Math.max(0, (Number.parseInt(args[0] ?? "", 10) || now.getMonth() + 1) - 1));
  const first = new Date(year, monthIndex, 1);
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const rows = [
    first.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    "Su Mo Tu We Th Fr Sa",
  ];
  let row = "   ".repeat(first.getDay());
  for (let day = 1; day <= days; day++) {
    row += `${String(day).padStart(2, " ")} `;
    if ((first.getDay() + day) % 7 === 0 || day === days) {
      rows.push(row.trimEnd());
      row = "";
    }
  }
  return rows;
}

function handleChing(args: string[]): ShellResult["output"] {
  const seed = parseInt(syntheticHex(args.join(" ") || "cyberscape", 6), 16);
  const hexagram = (seed % 64) + 1;
  return [
    `I Ching hexagram ${hexagram}`,
    ["--- ---", "-------"][(seed >> 0) & 1]!,
    ["--- ---", "-------"][(seed >> 1) & 1]!,
    ["--- ---", "-------"][(seed >> 2) & 1]!,
    ["--- ---", "-------"][(seed >> 3) & 1]!,
    ["--- ---", "-------"][(seed >> 4) & 1]!,
    ["--- ---", "-------"][(seed >> 5) & 1]!,
  ];
}

function handleGeoip(state: ShellSessionState, args: string[]): ShellResult["output"] {
  const target = args[0] ?? currentHost(state);
  const host = getHost(target);
  if (host) return [`${host.hostname}: ${host.location}`, `Org: ${host.org}`];
  const hash = syntheticHex(target, 4);
  return [`${target}: 10.${parseInt(hash.slice(0, 2), 16)}.${parseInt(hash.slice(2, 4), 16)}.0`, "Location: synthetic private network"];
}

function handleOctopus(): ShellResult["output"] {
  return [
    "octopus",
    "        .-'''-.",
    "     .-'  _  _ '-.",
    "    /    (o)(o)   \\",
    "   |       __      |",
    "    \\  .-.__.-.   /",
    "  ~~ `-._______.-' ~~",
  ];
}

function handleRig(): ShellResult["output"] {
  return [
    "Random identity:",
    "  Name: Ada Forbin",
    "  Host: relay",
    "  Shell: /bin/cyberscape",
    "  Project: quiet routing table repair",
  ];
}

function handleSleep(args: string[]): ShellResult["output"] {
  const seconds = Math.max(0, Math.min(9, Number.parseInt(args[0] ?? "1", 10) || 1));
  return [`Sleeping ${seconds} second${seconds === 1 ? "" : "s"}...`, "Awake."];
}

function handleTypespeed(args: string[]): ShellResult["output"] {
  const phrase = args.join(" ") || "may the command line live forever";
  const words = phrase.trim().split(/\s+/).filter(Boolean);
  const score = Math.max(1, words.length) * 42;
  return [
    "typespeed",
    phrase,
    `Words: ${words.length}`,
    `Score: ${score}`,
  ];
}

function applyPipeStage(lines: string[], stage: string): string[] {
  const [cmdRaw, ...args] = stage.trim().split(/\s+/);
  const cmd = cmdRaw?.toLowerCase();
  if (!cmd) return lines;

  if (cmd === "grep") {
    const needle = args.join(" ").toLowerCase();
    if (!needle) return lines;
    return lines.filter((line) => line.toLowerCase().includes(needle));
  }

  if (cmd === "head") {
    const count = Math.max(1, Math.min(200, Number.parseInt(args[0] ?? "10", 10) || 10));
    return lines.slice(0, count);
  }

  if (cmd === "tail") {
    const count = Math.max(1, Math.min(200, Number.parseInt(args[0] ?? "10", 10) || 10));
    return lines.slice(-count);
  }

  if (cmd === "sort") {
    return [...lines].sort((a, b) => a.localeCompare(b));
  }

  if (cmd === "wc") {
    const words = lines.join("\n").trim().split(/\s+/).filter(Boolean).length;
    const chars = lines.join("\n").length;
    return [`${lines.length} ${words} ${chars}`];
  }

  return [`pipe: ${cmd}: command not found`];
}

function applyPipeline(lines: string[], stages: string[]): string[] {
  return stages.reduce((current, stage) => applyPipeStage(current, stage), lines);
}

function remainingPagerLines(pager: PagerState | null): string[] {
  return pager ? pager.lines.slice(pager.index) : [];
}

function handleGames(): ShellResult["output"] {
  return [
    "Z-Code shelf:",
    "  advent.gam",
    "  lostpig.gam",
    "  zork.gam",
  ];
}

function startGame(
  state: ShellSessionState,
  requested: string,
): ShellResult["output"] {
  const game = requested === "advent.gam"
    ? "advent"
    : requested === "lostpig.gam"
      ? "lostpig"
      : "zork";
  state.shellMode = "game";
  state.pager = null;
  state.gameMode = game;
  state.gameLocation = "field";
  state.gameInventory = [];
  state.gameFlags = {
    mailboxOpened: false,
    lanternTaken: false,
    doorOpened: false,
    cellarUnlocked: false,
  };
  return [
    `Running ${requested}.`,
    "You are standing in an open field west of a white house, with a boarded front door.",
    "There is a small mailbox here.",
  ];
}

function gameDescription(state: ShellSessionState): string[] {
  switch (state.gameLocation) {
    case "field":
      return [
        "A calm field opens around a white house. The mailbox is to one side.",
        state.gameFlags.lanternTaken ? "You already took the lantern." : "A brass lantern rests in the grass.",
      ];
    case "porch":
      return [
        "You are on the porch of the white house.",
        state.gameFlags.doorOpened ? "The front door stands open." : "The front door is closed.",
      ];
    case "house":
      return [
        "You are inside the white house. The air smells of dust and old wood.",
        "A trapdoor leads down to a cellar.",
      ];
    case "cellar":
      return [
        "You are in a small damp cellar. The room is very quiet.",
        state.gameFlags.cellarUnlocked ? "A trophy sits here on a shelf." : "Something glints in the dark.",
      ];
    default:
      return ["The game state has drifted."];
  }
}

function moveGame(
  state: ShellSessionState,
  destination: NonNullable<ShellSessionState["gameLocation"]>,
): string[] {
  state.gameLocation = destination;
  return gameDescription(state);
}

function runGameCommand(
  state: ShellSessionState,
  verb: string,
  restValue: string,
): ShellResult["output"] {
  const word = verb.toLowerCase();
  const rest = restValue.toLowerCase();

  if (word === "help" || word === "?") {
    return [
      "Game commands:",
      "  look, north, south, east, west, open mailbox, read leaflet, take lantern, open door, down, take trophy, inventory, quit",
    ];
  }

  if (word === "quit" || word === "exit") {
    state.shellMode = "shell";
    state.gameMode = null;
    state.gameLocation = null;
    state.gameInventory = [];
    return ["Leaving the game.", "The shell returns to @ mode."];
  }

  if (word === "look") {
    return gameDescription(state);
  }

  if (word === "inventory" || word === "i") {
    if (!state.gameInventory.length) {
      return ["You are empty-handed."];
    }
    return [`You have: ${state.gameInventory.join(", ")}.`];
  }

  if (state.gameLocation === "field") {
    if (word === "open" && rest === "mailbox") {
      state.gameFlags.mailboxOpened = true;
      return [
        "The mailbox creaks open.",
        "There is a leaflet inside.",
      ];
    }

    if (word === "read" && rest === "leaflet") {
      if (!state.gameFlags.mailboxOpened) return ["You need to open the mailbox first."];
      return [
        "WELCOME TO THE HOUSE OF ZORK.",
        "Try taking the lantern and opening the door.",
      ];
    }

    if (word === "take" && (rest === "lantern" || rest === "lamp")) {
      if (state.gameFlags.lanternTaken) return ["You already have the lantern."];
      state.gameFlags.lanternTaken = true;
      state.gameInventory.push("lantern");
      return ["Taken."];
    }

    if (word === "north" || word === "enter" || (word === "open" && rest === "door")) {
      return moveGame(state, "porch");
    }
  }

  if (state.gameLocation === "porch") {
    if (word === "open" && rest === "door") {
      state.gameFlags.doorOpened = true;
      return ["The door opens into the house.", ...moveGame(state, "house")];
    }
    if (word === "south" || word === "west" || word === "back") {
      return moveGame(state, "field");
    }
    if ((word === "north" || word === "enter") && state.gameFlags.doorOpened) {
      return moveGame(state, "house");
    }
    if (word === "north" || word === "enter") {
      return ["The door is closed."];
    }
  }

  if (state.gameLocation === "house") {
    if (word === "down") {
      if (!state.gameFlags.lanternTaken) {
        return ["It is too dark to go down safely."];
      }
      state.gameFlags.cellarUnlocked = true;
      return moveGame(state, "cellar");
    }
    if (word === "west" || word === "back" || word === "south") {
      return moveGame(state, "porch");
    }
  }

  if (state.gameLocation === "cellar") {
    if (word === "take" && rest === "trophy") {
      if (!state.gameFlags.cellarUnlocked) return ["You cannot find it."];
      if (!state.gameInventory.includes("trophy")) {
        state.gameInventory.push("trophy");
      }
      return ["Taken."];
    }
    if (word === "up" || word === "back") {
      return moveGame(state, "house");
    }
  }

  return ["I don't understand that command."];
}

function handleZcode(state: ShellSessionState, args: string[]): ShellResult["output"] {
  const requested = (args[0] ?? "zork").toLowerCase();
  const launched = requested === "advent.gam" || requested === "lostpig.gam" ? requested : "zork.gam";
  return startGame(state, launched);
}

function fileMapForHost(hostname: string): Record<string, string> {
  const host = getHost(hostname);
  if (!host) return {};
  const files = { ...(host.files ?? {}) };
  if (!Object.keys(files).length) {
    files["README.TXT"] = [
      `${host.hostname} public file area`,
      host.org,
      host.location,
      "Anonymous retrieval permitted.",
    ].join("\n");
    files["INDEX.TXT"] = `pub/${host.hostname}/README.TXT\npub/${host.hostname}/motd.txt`;
  }
  return files;
}

function enterProtocolMode(
  state: ShellSessionState,
  protocol: "ftp" | "gopher" | "mail" | "telex",
  host: NonNullable<ReturnType<typeof getHost>>,
): ShellResult {
  state.remoteStack.push({ host: host.hostname, user: state.username ?? "guest", cwd: state.cwd });
  state.cwd = "/";
  state.shellMode = protocol;
  state.pager = null;

  const output = protocol === "ftp"
    ? [
      `FTP connected to ${host.hostname}.`,
      "220 public file service ready",
      "230 anonymous login ok",
      "Commands: DIR, GET <file>, TYPE <file>, PWD, QUIT",
    ]
    : protocol === "gopher"
      ? [
        `GOPHER connected to ${host.hostname}.`,
        "Root menu loaded.",
        "Commands: MENU, OPEN <number>, READ <number>, QUIT",
      ]
      : protocol === "mail"
        ? [
        `MAIL connected to ${host.hostname}.`,
        "SMTP/POP spool ready.",
        "Commands: INBOX, READ <number>, COMPOSE <to> <subject>: <body>, QUIT",
        ]
        : [
          `TELEX connected to ${host.hostname}.`,
          `Answerback: ${state.packetCircuit?.address ?? packetAddressForHost(host.hostname)}`,
          `Packet switch: ${state.packetCircuit?.switchHost ?? packetSwitchForRoute([state.homeHost, host.hostname])}`,
          "Commands: WHO, DIRECTORY, ANSWERBACK, SEND <text>, QUIT",
        ];

  return { output, state };
}

function connectProtocol(
  state: ShellSessionState,
  protocol: string,
  targetName: string | undefined,
): ShellResult {
  if (!targetName) {
    return { output: [`Usage: ${protocol} <host>`], state };
  }

  const host = getHost(targetName);
  if (!host) {
    return { output: [`Unknown host ${targetName}`], state };
  }

  if (protocol === "ftp" || protocol === "gopher" || protocol === "mail" || protocol === "telex") {
    return enterProtocolMode(state, protocol, host);
  }

  state.remoteStack.push({ host: host.hostname, user: state.username ?? "guest", cwd: state.cwd });
  state.cwd = "/";
  state.pager = null;
  if (host.bbs_config) {
    const banner = enterBbs(state, host.hostname, protocol === "dial" ? "dial" : "telnet");
    state.bbsMode = true;
    state.bbsHost = host.hostname;
    return {
      output: [
        `${protocol.toUpperCase()} connected to ${host.hostname}.`,
        ...banner.output,
      ],
      state,
    };
  }

  return {
    output: [
      `${protocol.toUpperCase()} connected to ${host.hostname}.`,
      `Escape character is '^]'.`,
    ],
    state,
  };
}

function normalizePhoneNumber(input: string): string {
  return input.replace(/\D/g, "");
}

function dialRouteHops(entry: Pick<DesktopDialupEntry, "route">): number {
  return Math.max(0, entry.route.length - 1);
}

function requiresOperatorAssistance(entry: DesktopDialupEntry): boolean {
  return dialRouteHops(entry) > 1;
}

function acousticSpeedForHost(host: string): "110 baud" | "300 baud" {
  return host.length % 2 === 0 ? "110 baud" : "300 baud";
}

function acousticCouplerMatches(state: ShellSessionState, entry: DesktopDialupEntry): boolean {
  const coupler = state.acousticCoupler;
  if (!coupler) return false;
  return coupler.host.toLowerCase() === entry.host.toLowerCase() ||
    normalizePhoneNumber(coupler.number) === normalizePhoneNumber(entry.number);
}

function hasOperatorCircuit(state: ShellSessionState, host: string): boolean {
  state.operatorRoutes ??= [];
  return state.operatorRoutes.some((entry) => entry.toLowerCase() === host.toLowerCase());
}

function tollCallForHost(state: ShellSessionState, host: string) {
  state.tollLedger ??= [];
  const normalized = host.toLowerCase();
  return [...state.tollLedger].reverse().find((entry) => entry.host.toLowerCase() === normalized) ?? null;
}

function recordTollCall(state: ShellSessionState, entry: DesktopDialupEntry): number {
  state.tollLedger ??= [];
  const previous = state.tollLedger.at(-1)?.id ?? 0;
  const row = {
    id: previous + 1,
    host: entry.host,
    number: entry.number,
    route: [...entry.route],
    hops: dialRouteHops(entry),
    openedAt: Date.now(),
    operator: state.username ?? "guest",
  };
  state.tollLedger = [...state.tollLedger, row].slice(-24);
  return row.id;
}

function phonebookPath(state: ShellSessionState): string {
  return `/home/${state.username ?? "guest"}/phonebook.txt`;
}

type PersonalPhonebookEntry = {
  host: string;
  label: string;
  lineType: string;
  protocol: string;
  notes: string;
};

type ResolvedDialTarget = DesktopDialupEntry & {
  lineOutcome: DialOutcome;
  lineLabel: string;
  lineIndex: number;
  lineCount: number;
};

function inferredPhoneLineType(hostname: string): string {
  const host = getHost(hostname);
  if (host?.bbs_config) return "bbs-line";
  const speed = dialupSpeedForHost(hostname).toLowerCase();
  if (speed === "isdn") return "isdn";
  if (dialOutcomeForHost(hostname) === "no-carrier") return "silent-line";
  return "modem";
}

function inferredPhoneProtocol(hostname: string): string {
  const host = getHost(hostname);
  if (host?.bbs_config) return "BBS";
  if (host?.ports.includes(70)) return "Gopher";
  if (host?.ports.includes(21)) return "FTP";
  if (host?.ports.includes(79)) return "Finger";
  if (host?.ports.includes(23)) return "Telnet";
  return dialupSpeedForHost(hostname).toLowerCase() === "isdn" ? "ISDN" : "V.32bis";
}

function inferredPhoneNotes(hostname: string): string {
  const host = getHost(hostname);
  const carrier = dialCarrierPreview(hostname);
  if (host?.bbs_config) return `${host.bbs_config.name}; ${host.bbs_config.tagline}`;
  if (carrier === "busy") return "busy-line; retry later or find alternate route";
  if (carrier === "no carrier") return "no-carrier; likely data-disabled or voice-only";
  return `${host?.org ?? hostname}; ${carrier}`;
}

function serializePhonebookEntry(entry: PersonalPhonebookEntry): string {
  return [
    entry.host,
    entry.label,
    entry.lineType,
    entry.protocol,
    entry.notes,
  ].map((part) => part.replace(/\s*\|\s*/g, " / ").trim()).join(" | ");
}

function parsePhonebookAddArgs(hostname: string, raw: string): Omit<PersonalPhonebookEntry, "host"> {
  const labelParts: string[] = [];
  const noteParts: string[] = [];
  let lineType = inferredPhoneLineType(hostname);
  let protocol = inferredPhoneProtocol(hostname);
  for (const token of raw.split(/\s+/).filter(Boolean)) {
    const [keyRaw, ...valueParts] = token.split("=");
    const key = keyRaw?.toLowerCase();
    const value = valueParts.join("=").trim();
    if (value && (key === "line" || key === "type")) {
      lineType = value;
    } else if (value && (key === "protocol" || key === "proto")) {
      protocol = value;
    } else if (value && (key === "note" || key === "notes")) {
      noteParts.push(value.replace(/_/g, " "));
    } else {
      labelParts.push(token);
    }
  }
  return {
    label: labelParts.join(" ").trim(),
    lineType,
    protocol,
    notes: noteParts.join("; ").trim() || inferredPhoneNotes(hostname),
  };
}

function parsePersonalPhonebook(state: ShellSessionState): PersonalPhonebookEntry[] {
  const file = getUserFile(state, phonebookPath(state));
  if (!file) return [];
  return file.body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const pipeParts = line.split("|").map((part) => part.trim());
      if (pipeParts.length >= 2) {
        const host = (pipeParts[0] ?? "").toLowerCase();
        return {
          host,
          label: pipeParts[1] ?? "",
          lineType: pipeParts[2] || inferredPhoneLineType(host),
          protocol: pipeParts[3] || inferredPhoneProtocol(host),
          notes: pipeParts.slice(4).join(" | ") || inferredPhoneNotes(host),
        };
      }
      const [host = "", ...labelParts] = line.split(/\s+/);
      return {
        host: host.toLowerCase(),
        label: labelParts.join(" "),
        lineType: inferredPhoneLineType(host),
        protocol: inferredPhoneProtocol(host),
        notes: inferredPhoneNotes(host),
      };
    })
    .filter((entry) => Boolean(entry.host));
}

function upsertPersonalPhonebookEntry(state: ShellSessionState, rawHost: string, label: string): string[] {
  if (!state.loggedIn || !state.userId) return ["phonebook add requires login."];
  const host = getHost(rawHost);
  if (!host) return [`Unknown host ${rawHost}`];
  const entries = parsePersonalPhonebook(state).filter((entry) => entry.host !== host.hostname.toLowerCase());
  const parsed = parsePhonebookAddArgs(host.hostname, label);
  entries.push({
    host: host.hostname.toLowerCase(),
    label: parsed.label || `${host.org} ${dialupNumberForHost(host.hostname)}`,
    lineType: parsed.lineType,
    protocol: parsed.protocol,
    notes: parsed.notes,
  });
  const body = [
    "# Cyberscape personal phonebook: host | label | line | protocol | notes",
    ...entries
      .sort((a, b) => a.host.localeCompare(b.host))
      .map((entry) => serializePhonebookEntry(entry)),
  ].join("\n");
  const path = upsertUserFile(state, phonebookPath(state), body);
  if (!path) return ["phonebook: could not save entry."];
  recordDesktopEvent(state, "info", "dialup", `phonebook saved ${host.hostname} ${dialupNumberForHost(host.hostname)}`);
  return [
    `Saved ${host.hostname} to ${path}.`,
    `Number: ${dialupNumberForHost(host.hostname)}`,
    `Line: ${parsed.lineType}; Protocol: ${parsed.protocol}; Notes: ${parsed.notes}`,
  ];
}

function removePersonalPhonebookEntry(state: ShellSessionState, raw: string | undefined): string[] {
  if (!state.loggedIn || !state.userId) return ["phonebook rm requires login."];
  const query = raw?.trim().toLowerCase();
  if (!query) return ["Usage: phonebook rm <host|number>"];
  const entries = parsePersonalPhonebook(state);
  const digits = normalizePhoneNumber(query);
  const remaining = entries.filter((entry) =>
    entry.host !== query &&
    normalizePhoneNumber(dialupNumberForHost(entry.host)) !== digits
  );
  if (remaining.length === entries.length) return [`phonebook: ${raw} not found`];
  const body = [
    "# Cyberscape personal phonebook: host | label | line | protocol | notes",
    ...remaining
      .sort((a, b) => a.host.localeCompare(b.host))
      .map((entry) => serializePhonebookEntry(entry)),
  ].join("\n");
  const path = upsertUserFile(state, phonebookPath(state), body);
  if (!path) return ["phonebook: could not save changes."];
  recordDesktopEvent(state, "warn", "dialup", `phonebook removed ${raw}`);
  return [`Removed ${raw} from ${path}.`];
}

function carrierLabelForOutcome(outcome: DialOutcome, speed: string): string {
  if (outcome === "busy") return "busy";
  if (outcome === "no-carrier") return "no carrier";
  return `carrier ${speed}`;
}

function resolveDialTarget(state: ShellSessionState, target: string | undefined): ResolvedDialTarget | null {
  if (!target) return null;
  const query = target.trim().toLowerCase();
  if (!query) return null;
  const digits = normalizePhoneNumber(query);
  for (const entry of collectDesktopDialupEntries(state)) {
    const profiles = dialLineProfilesForHost(entry.host);
    const exactProfile = profiles.find((profile) => normalizePhoneNumber(profile.number) === digits);
    if (!(entry.host.toLowerCase() === query || entry.name.toLowerCase() === query || Boolean(exactProfile))) {
      continue;
    }
    const profile = exactProfile ?? profiles[0] ?? {
      number: entry.number,
      speed: entry.speed,
      outcome: dialOutcomeForHost(entry.host),
      label: "primary",
    };
    return {
      ...entry,
      number: profile.number,
      speed: profile.speed,
      lineOutcome: profile.outcome,
      lineLabel: profile.label,
      lineIndex: Math.max(0, profiles.indexOf(profile)),
      lineCount: Math.max(1, profiles.length),
    };
  }
  return null;
}

function huntDialTargets(state: ShellSessionState, target: string | undefined): ResolvedDialTarget[] {
  if (!target) return [];
  const query = target.trim().toLowerCase();
  if (!query) return [];
  const digits = normalizePhoneNumber(query);
  const entry = collectDesktopDialupEntries(state).find((row) =>
    row.host.toLowerCase() === query ||
    row.name.toLowerCase() === query ||
    normalizePhoneNumber(row.number) === digits
  );
  if (!entry) return [];
  return dialLineProfilesForHost(entry.host).map((profile, index, all) => ({
    ...entry,
    number: profile.number,
    speed: profile.speed,
    lineOutcome: profile.outcome,
    lineLabel: profile.label,
    lineIndex: index,
    lineCount: all.length,
  }));
}

function packetAddressForHost(hostname: string): string {
  const digest = createHash("md5").update(`x25:${hostname.toLowerCase()}`).digest("hex");
  const digits = String(parseInt(digest.slice(0, 10), 16)).padStart(12, "0").slice(-12);
  return `3110-${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`;
}

function packetSwitchForRoute(route: string[]): string {
  return route[1] ?? route[0] ?? "cyberscape";
}

function resolvePacketTarget(state: ShellSessionState, target: string | undefined): DesktopNetworkEntry | null {
  const query = target?.trim().toLowerCase();
  if (!query) return null;
  const host = currentHost(state);
  return collectDesktopNetworkEntries(state).find((entry) =>
    entry.host.toLowerCase() === query &&
    entry.host.toLowerCase() !== host.toLowerCase() &&
    entry.route.length > 1
  ) ?? null;
}

function clearPacketCircuitIfLeavingHost(state: ShellSessionState, host: string): void {
  if (state.packetCircuit?.host.toLowerCase() === host.toLowerCase()) {
    state.packetCircuit = null;
  }
}

function handleOperator(state: ShellSessionState, args: string[]): ShellResult {
  const target = args[0];
  const entry = resolveDialTarget(state, target);
  if (!target || !entry) {
    return {
      output: [
        "Usage: operator <host|number>",
        "Use PHONEBOOK or DIALUP to find long-distance routes first.",
      ],
      state,
    };
  }
  if (!requiresOperatorAssistance(entry)) {
    return {
      output: [
        `Operator: ${entry.host} is a local call; dial ${entry.number}.`,
      ],
      state,
    };
  }
  state.operatorRoutes ??= [];
  const opened = !hasOperatorCircuit(state, entry.host);
  const ledgerId = opened ? recordTollCall(state, entry) : tollCallForHost(state, entry.host)?.id ?? 0;
  if (opened) state.operatorRoutes.push(entry.host);
  recordDesktopEvent(state, "info", "dialup", `operator circuit ${entry.host} ${entry.number}`);
  return {
    output: [
      opened
        ? `Operator: long-distance circuit opened to ${entry.host}.`
        : `Operator: long-distance circuit to ${entry.host} is already open.`,
      `Route: ${entry.route.join(" -> ")}`,
      `Toll class: ${dialRouteHops(entry)} hop(s); number ${entry.number}.`,
      `Billing: calling card ${state.username ?? "guest"} ledger #${ledgerId || "session"}.`,
      `You may now dial ${entry.host} or ${entry.number}.`,
    ],
    state,
  };
}

function handleCoupler(state: ShellSessionState, args: string[]): ShellResult {
  const target = args[0];
  const action = target?.toLowerCase();
  if (!target) {
    const attached = state.acousticCoupler;
    return {
      output: attached
        ? [
          `Acoustic coupler attached to ${attached.host}.`,
          `Handset: ${attached.number}; speed ${attached.speed}.`,
          `Next: dial ${attached.host}`,
        ]
        : [
          "Acoustic coupler idle.",
          "Usage: coupler <host|number> · coupler detach · dial <host|number>",
        ],
      state,
    };
  }
  if (action === "detach" || action === "hangup" || action === "off") {
    state.acousticCoupler = null;
    recordDesktopEvent(state, "info", "dialup", "acoustic coupler detached");
    return { output: ["Acoustic coupler detached. Handset returned to cradle."], state };
  }
  const entry = resolveDialTarget(state, target);
  if (!entry) {
    return {
      output: [
        "Usage: coupler <host|number>",
        "Run PHONEBOOK or DIALUP first; the coupler needs a known handset number.",
      ],
      state,
    };
  }
  state.acousticCoupler = {
    host: entry.host,
    number: entry.number,
    speed: acousticSpeedForHost(entry.host),
    attachedAt: Date.now(),
  };
  recordDesktopEvent(state, "info", "dialup", `acoustic coupler attached ${entry.host} ${entry.number}`);
  return {
    output: [
      `Acoustic coupler attached to ${entry.host}.`,
      `Place handset in cups: ${entry.number}.`,
      `Line discipline: ${state.acousticCoupler.speed}, half-duplex, printed directory route.`,
      `Next: dial ${entry.host}`,
    ],
    state,
  };
}

function handleHunt(state: ShellSessionState, args: string[]): ShellResult {
  const target = args[0];
  const candidates = huntDialTargets(state, target);
  if (!target || !candidates.length) {
    return {
      output: [
        "Usage: hunt <host|number>",
        "Run PHONEBOOK, DIALUP, or WARDIAL first; line hunting needs a discovered exchange.",
      ],
      state,
    };
  }

  const reachable = candidates.find((entry) => entry.lineOutcome === "connect") ?? candidates[0]!;
  recordDesktopEvent(state, "info", "dialup", `line hunt ${reachable.host} selected ${reachable.number} ${reachable.lineLabel}`);
  return {
    output: [
      `Line hunt for ${reachable.host}:`,
      "  Line   Number       Speed    Carrier       Label",
      ...candidates.map((entry) =>
        `  ${String(entry.lineIndex + 1).padEnd(6)}${entry.number.padEnd(13)}${entry.speed.padEnd(9)}${carrierLabelForOutcome(entry.lineOutcome, entry.speed).padEnd(14)}${entry.lineLabel}`
      ),
      "",
      `Selected line ${reachable.lineIndex + 1}: ${reachable.number} (${reachable.lineLabel})`,
      `Next: dial ${reachable.number}`,
    ],
    state,
  };
}

function handleDial(state: ShellSessionState, args: string[]): ShellResult {
  const target = args[0];
  const entry = resolveDialTarget(state, target);
  if (!target || !entry) {
    return {
      output: [
        "Usage: dial <number|host>",
        "Run DIALUP or WARDIAL first to see discovered phone numbers.",
      ],
      state,
    };
  }

  const acoustic = acousticCouplerMatches(state, entry);
  const lines = acoustic
    ? [
      `Dialing ${entry.number} (${entry.name}) through acoustic coupler...`,
      `Handset seated in coupler cups for ${entry.host}.`,
      `PULSE ${entry.number}`,
    ]
    : [
      `Dialing ${entry.number} (${entry.name})...`,
      "ATDT " + entry.number,
    ];
  if (requiresOperatorAssistance(entry) && !hasOperatorCircuit(state, entry.host)) {
    recordDesktopEvent(state, "warn", "dialup", `dial toll blocked ${entry.host} ${entry.number}`);
    return {
      output: [
        ...lines,
        "TOLL RESTRICTED",
        `Long-distance route requires operator assistance (${entry.route.join(" -> ")}).`,
        `Run operator ${entry.host} before dialing this number.`,
      ],
      state,
    };
  }
  const outcome = entry.lineOutcome;
  if (outcome === "busy") {
    recordDesktopEvent(state, "warn", "dialup", `dial busy ${entry.host} ${entry.number}`);
    return {
      output: [
        ...lines,
        "BUSY",
        "The line is busy. Try HUNT, PHONEBOOK, or WARDIAL for another route.",
      ],
      state,
    };
  }
  if (outcome === "no-carrier") {
    recordDesktopEvent(state, "warn", "dialup", `dial no carrier ${entry.host} ${entry.number}`);
    return {
      output: [
        ...lines,
        "NO CARRIER",
        "No modem carrier was detected. Try HUNT or check the phonebook entry before retrying.",
      ],
      state,
    };
  }
  const connectSpeed = acoustic ? state.acousticCoupler?.speed ?? acousticSpeedForHost(entry.host) : entry.speed;
  lines.push(
    "RINGING...",
    acoustic ? `ACOUSTIC CARRIER ${connectSpeed}` : `CARRIER ${connectSpeed}`,
    `CONNECT ${connectSpeed}`,
  );
  const result = connectProtocol(state, "dial", entry.host);
  recordDesktopEvent(state, "info", "dialup", `${acoustic ? "coupler" : "dial"} connected ${entry.host} ${entry.number}`);
  return {
    output: [
      ...lines,
      ...result.output,
    ],
    state: result.state,
  };
}

function handlePacketConnect(state: ShellSessionState, protocol: "pad" | "x25", args: string[]): ShellResult {
  const target = args[0];
  const entry = resolvePacketTarget(state, target);
  if (!target || !entry) {
    return {
      output: [
        `Usage: ${protocol} <host>`,
        "Run NETWORK, TRACE, or UUPATH first; packet switching only reaches visible multi-hop hosts.",
      ],
      state,
    };
  }

  const address = packetAddressForHost(entry.host);
  const switchHost = packetSwitchForRoute(entry.route);
  const hopCount = Math.max(1, entry.route.length - 1);
  state.packetCircuit = {
    host: entry.host,
    switchHost,
    address,
    speed: hopCount > 2 ? "9.6k" : "19.2k",
    createdAt: Date.now(),
  };
  recordDesktopEvent(state, "info", "packet", `${protocol} connected ${entry.host} ${address} via ${switchHost}`);

  const result = connectProtocol(state, protocol, entry.host);
  return {
    output: [
      `${protocol.toUpperCase()} access profile: X.25 PAD`,
      `Packet switch: ${switchHost}`,
      `NUA: ${address}`,
      `Route: ${entry.route.join(" -> ")}`,
      `CALL REQUEST ACCEPTED (${hopCount} hop${hopCount === 1 ? "" : "s"})`,
      ...result.output,
    ],
    state: result.state,
  };
}

function handleTelexConnect(state: ShellSessionState, args: string[]): ShellResult {
  const target = args[0];
  const entry = resolvePacketTarget(state, target);
  if (!target || !entry) {
    return {
      output: [
        "Usage: telex <host>",
        "Run NETWORK, TRACE, or UUPATH first; telex circuits only reach visible multi-hop hosts.",
      ],
      state,
    };
  }

  const address = packetAddressForHost(entry.host);
  const switchHost = packetSwitchForRoute(entry.route);
  const hopCount = Math.max(1, entry.route.length - 1);
  state.packetCircuit = {
    host: entry.host,
    switchHost,
    address,
    speed: hopCount > 2 ? "50 baud" : "66 wpm",
    createdAt: Date.now(),
  };
  recordDesktopEvent(state, "info", "telex", `telex connected ${entry.host} ${address} via ${switchHost}`);

  const result = connectProtocol(state, "telex", entry.host);
  return {
    output: [
      "TELEX access profile: packet teleprinter",
      `Exchange: ${switchHost}`,
      `Answerback: ${address}`,
      `Route: ${entry.route.join(" -> ")}`,
      `LINE ACQUIRED (${hopCount} hop${hopCount === 1 ? "" : "s"})`,
      ...result.output,
    ],
    state: result.state,
  };
}

function handleTransportVerb(
  state: ShellSessionState,
  cmd: string,
  args: string[],
): ShellResult | null {
  if (cmd === "dial") {
    return handleDial(state, args);
  }

  if (cmd === "hunt") {
    return handleHunt(state, args);
  }

  if (cmd === "operator") {
    return handleOperator(state, args);
  }

  if (cmd === "pad" || cmd === "x25") {
    return handlePacketConnect(state, cmd, args);
  }

  if (cmd === "telex") {
    return handleTelexConnect(state, args);
  }

  if (cmd === "telnet") {
    return connectProtocol(state, "telnet", args[0]);
  }

  if (cmd === "ssh") {
    return connectProtocol(state, "ssh", args[0]);
  }

  if (cmd === "rlogin") {
    return connectProtocol(state, "rlogin", args[0]);
  }

  if (cmd === "ftp") {
    return connectProtocol(state, "ftp", args[0]);
  }

  if (cmd === "gopher") {
    return connectProtocol(state, "gopher", args[0]);
  }

  if (cmd === "news") {
    return enterNews(state, args[0]);
  }

  if (cmd === "mail") {
    return connectProtocol(state, "mail", args[0]);
  }

  if (cmd === "irc") {
    return enterIrc(state, args[0]);
  }

  if (cmd === "game") {
    if (!args.length) return { output: handleGames(), state };
    return { output: handleZcode(state, args), state };
  }

  return null;
}

function leaveProtocolMode(state: ShellSessionState, protocol: "FTP" | "GOPHER" | "MAIL" | "TELEX"): ShellResult {
  const leavingHost = currentHost(state);
  const previous = state.remoteStack.pop();
  if (previous) {
    state.cwd = previous.cwd;
  }
  clearPacketCircuitIfLeavingHost(state, leavingHost);
  state.shellMode = state.loggedIn ? "shell" : "nli";
  state.pager = null;
  return {
    output: [`${protocol} connection closed.`],
    state,
  };
}

interface MailView {
  from: string;
  to: string;
  subject: string;
  body: string;
  createdAt: number;
}

function mailMessagesForUser(state: ShellSessionState): MailView[] {
  const name = state.username ?? "guest";
  const transientMessages = state.mailbox.filter(
    (msg) => msg.to.toLowerCase() === name.toLowerCase() || msg.from.toLowerCase() === name.toLowerCase(),
  );
  const durableMessages = state.loggedIn
    ? db.select()
      .from(mailMessages)
      .all()
      .filter((msg) =>
        msg.recipient.toLowerCase() === name.toLowerCase() ||
        msg.sender.toLowerCase() === name.toLowerCase()
      )
      .map((msg) => ({
        from: msg.sender,
        to: msg.recipient,
        subject: msg.subject,
        body: msg.body,
        createdAt: msg.createdAt,
      }))
    : [];
  const seen = new Set<string>();
  return [...durableMessages, ...transientMessages]
    .sort((a, b) => b.createdAt - a.createdAt)
    .filter((msg) => {
      const key = `${msg.from}\0${msg.to}\0${msg.subject}\0${msg.body}\0${msg.createdAt}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function desktopMailEntries(state: ShellSessionState): DesktopMailEntry[] {
  return mailMessagesForUser(state).slice(0, 24).map((message, index) => ({
    id: `mail:${message.createdAt}:${index}`,
    from: message.from.replace(/\s+/g, " ").slice(0, 48),
    to: message.to.replace(/\s+/g, " ").slice(0, 48),
    subject: message.subject.replace(/\s+/g, " ").slice(0, 80),
    preview: message.body.replace(/\s+/g, " ").slice(0, 96),
    createdAt: message.createdAt,
  }));
}

function runMailCommand(
  state: ShellSessionState,
  cmd: string,
  args: string[],
): ShellResult {
  switch (cmd) {
    case "?":
    case "help":
      return {
        output: ["Mail commands: INBOX, LIST, READ <number>, COMPOSE <to> <subject>: <body>, QUIT"],
        state,
      };
    case "inbox":
    case "list": {
      const messages = mailMessagesForUser(state);
      if (!messages.length) return { output: ["No mail in inbox."], state };
      return {
        output: [
          `Mailbox for ${state.username ?? "guest"}`,
          ...messages.map((msg, index) =>
            `${index + 1}. ${msg.subject} from ${msg.from} to ${msg.to}`
          ),
        ],
        state,
      };
    }
    case "read": {
      const index = Number(args[0]);
      const messages = mailMessagesForUser(state);
      if (!Number.isInteger(index) || index < 1 || index > messages.length) {
        return { output: ["Usage: READ <number>"], state };
      }
      const msg = messages[index - 1]!;
      return {
        output: [
          `From: ${msg.from}`,
          `To: ${msg.to}`,
          `Subject: ${msg.subject}`,
          "",
          msg.body,
        ],
        state,
      };
    }
    case "compose":
    case "send": {
      const output = handleSend(state, args);
      return { output, state };
    }
    case "bye":
    case "exit":
    case "quit":
      return leaveProtocolMode(state, "MAIL");
    default:
      return { output: [`${cmd}: unknown mail command`], state };
  }
}

function runTelexCommand(
  state: ShellSessionState,
  cmd: string,
  args: string[],
): ShellResult {
  const hostname = currentHost(state);
  const host = getHost(hostname);
  const occupants = hostOccupants(hostname);
  const answerback = state.packetCircuit?.address ?? packetAddressForHost(hostname);

  switch (cmd) {
    case "?":
    case "help":
      return {
        output: ["Telex commands: WHO, DIRECTORY, ANSWERBACK, SEND <text>, QUIT"],
        state,
      };
    case "who":
    case "directory":
    case "list": {
      return {
        output: [
          `TELEX directory for ${hostname}:`,
          `Answerback ${answerback}`,
          ...(occupants.length
            ? occupants.map((occupant) => `${occupant.login.padEnd(11)} ${occupant.name.padEnd(28).slice(0, 28)} ${occupant.office}`)
            : [`operator    ${(host?.org ?? hostname).slice(0, 28).padEnd(28)} exchange`]),
        ],
        state,
      };
    }
    case "answerback":
      return {
        output: [
          `ANSWERBACK ${answerback}`,
          `${hostname.toUpperCase()} ${(host?.org ?? hostname).toUpperCase()}`,
        ],
        state,
      };
    case "send":
    case "compose":
    case "msg": {
      const text = args.join(" ").trim();
      if (!text) return { output: ["Usage: SEND <text>"], state };
      recordDesktopEvent(state, "audit", "telex", `telex sent ${hostname}: ${text.slice(0, 96)}`);
      state.mailbox.push({
        from: `telex/${hostname}`,
        to: state.username ?? "guest",
        subject: `telex receipt ${hostname}`,
        body: text,
        createdAt: Date.now(),
      });
      return {
        output: [
          `WRU ${hostname}`,
          `TX ${text}`,
          "GA",
        ],
        state,
      };
    }
    case "bye":
    case "exit":
    case "quit":
      return leaveProtocolMode(state, "TELEX");
    default:
      return { output: [`${cmd}: unknown telex command`], state };
  }
}

function runFtpCommand(
  state: ShellSessionState,
  cmd: string,
  args: string[],
): ShellResult {
  const hostname = currentHost(state);
  const files = fileMapForHost(hostname);

  switch (cmd) {
    case "?":
    case "help":
      return { output: ["FTP commands: DIR, LS, GET <file>, TYPE <file>, PWD, QUIT"], state };
    case "dir":
    case "ls":
      return {
        output: [
          `Directory of ${hostname}:/pub`,
          ...Object.entries(files).map(([name, body]) =>
            `${name.padEnd(18)}${String(body.length).padStart(6)} bytes`
          ),
        ],
        state,
      };
    case "pwd":
      return { output: [`257 "${state.cwd}" is current directory.`], state };
    case "get": {
      const name = args[0];
      if (!name) return { output: ["Usage: GET <file>"], state };
      const actual = Object.keys(files).find((file) => file.toLowerCase() === name.toLowerCase());
      if (!actual) return { output: [`550 ${name}: not found`], state };
      persistDownloadedFile(state, actual, files[actual]!);
      return {
        output: [
          `150 Opening ASCII mode data connection for ${actual}`,
          `226 Transfer complete. Saved ${actual}.`,
        ],
        state,
      };
    }
    case "type":
    case "cat": {
      const name = args[0];
      if (!name) return { output: ["Usage: TYPE <file>"], state };
      const actual = Object.keys(files).find((file) => file.toLowerCase() === name.toLowerCase());
      if (!actual) return { output: [`550 ${name}: not found`], state };
      return beginPager(state, files[actual]!.split("\n"));
    }
    case "bye":
    case "exit":
    case "quit":
      return leaveProtocolMode(state, "FTP");
    default:
      return { output: [`500 ${cmd}: unknown FTP command`], state };
  }
}

function gopherItemsForHost(hostname: string): { title: string; body: string }[] {
  return Object.entries(fileMapForHost(hostname)).map(([title, body]) => ({ title, body }));
}

function runGopherCommand(
  state: ShellSessionState,
  cmd: string,
  args: string[],
): ShellResult {
  const hostname = currentHost(state);
  const items = gopherItemsForHost(hostname);

  switch (cmd) {
    case "?":
    case "help":
      return { output: ["Gopher commands: MENU, OPEN <number>, READ <number>, QUIT"], state };
    case "menu":
    case "ls":
    case "dir":
      return {
        output: [
          `${hostname} gopher menu`,
          ...items.map((item, index) => `${index + 1}. ${item.title}`),
        ],
        state,
      };
    case "open":
    case "read": {
      const index = Number(args[0]);
      if (!Number.isInteger(index) || index < 1 || index > items.length) {
        return { output: ["Usage: READ <menu-number>"], state };
      }
      const item = items[index - 1]!;
      return beginPager(state, [`[${item.title}]`, ...item.body.split("\n")]);
    }
    case "bye":
    case "exit":
    case "quit":
      return leaveProtocolMode(state, "GOPHER");
    default:
      return { output: [`${cmd}: unknown gopher command`], state };
  }
}

function normalizeUserFilePath(state: ShellSessionState, raw: string | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/^~(?=\/|$)/, `/home/${state.username ?? "guest"}`);
  const path = cleaned.startsWith("/") ? cleaned : `${state.cwd}/${cleaned}`;
  const parts = path.split("/").filter(Boolean);
  const normalized: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") normalized.pop();
    else normalized.push(part);
  }
  const result = `/${normalized.join("/")}`;
  return result === "/" ? null : result;
}

function displayFileName(path: string): string {
  return path.split("/").filter(Boolean).at(-1) ?? path;
}

function userFileRows(state: ShellSessionState): Array<typeof userFiles.$inferSelect> {
  if (!state.userId) return [];
  return db.select().from(userFiles).where(eq(userFiles.userId, state.userId)).all();
}

function getUserFile(state: ShellSessionState, raw: string | undefined): typeof userFiles.$inferSelect | null {
  const path = normalizeUserFilePath(state, raw);
  if (!state.userId || !path) return null;
  return db.select()
    .from(userFiles)
    .where(and(eq(userFiles.userId, state.userId), eq(userFiles.path, path)))
    .get() ?? null;
}

function upsertUserFile(state: ShellSessionState, raw: string, body: string): string | null {
  const path = normalizeUserFilePath(state, raw);
  if (!state.userId || !path) return null;
  db.delete(userFiles)
    .where(and(eq(userFiles.userId, state.userId), eq(userFiles.path, path)))
    .run();
  db.insert(userFiles).values({
    userId: state.userId,
    path,
    body,
    updatedAt: Date.now(),
  }).run();
  return path;
}

function visibleFileBody(state: ShellSessionState, raw: string | undefined): { name: string; body: string } | null {
  if (!raw) return null;
  const userFile = getUserFile(state, raw);
  if (userFile) return { name: userFile.path, body: userFile.body };
  if (state.downloads?.[raw]) return { name: raw, body: state.downloads[raw]! };
  const host = getHost(currentHost(state));
  const hostBody = host?.files?.[raw];
  return hostBody ? { name: raw, body: hostBody } : null;
}

export function desktopFileEntries(state: ShellSessionState): DesktopFileEntry[] {
  const host = currentHost(state);
  const hostEntries = Object.entries(fileMapForHost(host)).map(([name, body]): DesktopFileEntry => ({
    id: `host:${host}:${name}`,
    kind: "host",
    name,
    path: `/${host}/${name}`,
    size: body.length,
    host,
    updatedAt: 0,
  }));
  const downloadEntries = Object.entries(state.downloads ?? {}).map(([name, body]): DesktopFileEntry => ({
    id: `download:${name}`,
    kind: "download",
    name,
    path: `/downloads/${name}`,
    size: body.length,
    host,
    updatedAt: 0,
  }));
  const homeEntries = userFileRows(state).map((file): DesktopFileEntry => ({
    id: `home:${file.path}`,
    kind: "home",
    name: displayFileName(file.path),
    path: file.path,
    size: file.body.length,
    host,
    updatedAt: file.updatedAt,
  }));
  return [...homeEntries, ...downloadEntries, ...hostEntries].slice(0, 48);
}

function handleWriteFile(state: ShellSessionState, args: string[], append = false): ShellResult["output"] {
  const target = args[0];
  const body = args.slice(1).join(" ");
  if (!target || !body) return [`Usage: ${append ? "append" : "write"} <file> <text>`];
  const existing = append ? getUserFile(state, target)?.body : "";
  const path = upsertUserFile(state, target, append && existing ? `${existing}\n${body}` : body);
  if (!path) return ["write: invalid file path"];
  recordDesktopEvent(state, "info", "files", `${append ? "file appended" : "file written"} ${path}`);
  return [`${append ? "Appended" : "Wrote"} ${body.length} bytes to ${path}.`];
}

function handleRemoveFile(state: ShellSessionState, args: string[]): ShellResult["output"] {
  const path = normalizeUserFilePath(state, args[0]);
  if (!state.userId || !path) return ["Usage: rm <file>"];
  const existing = getUserFile(state, path);
  if (!existing) return [`rm: ${args[0]}: not a user file`];
  db.delete(userFiles)
    .where(and(eq(userFiles.userId, state.userId), eq(userFiles.path, path)))
    .run();
  recordDesktopEvent(state, "warn", "files", `file removed ${path}`);
  return [`Removed ${path}.`];
}

function handleCopyMoveFile(state: ShellSessionState, args: string[], move = false): ShellResult["output"] {
  const [source, dest] = args;
  if (!source || !dest) return [`Usage: ${move ? "mv" : "cp"} <source> <dest>`];
  const file = visibleFileBody(state, source);
  if (!file) return [`${move ? "mv" : "cp"}: ${source}: not found`];
  const path = upsertUserFile(state, dest, file.body);
  if (!path) return [`${move ? "mv" : "cp"}: invalid destination`];
  if (move) {
    const sourcePath = normalizeUserFilePath(state, source);
    const userFile = sourcePath ? getUserFile(state, sourcePath) : null;
    if (sourcePath && userFile && sourcePath !== path) {
      db.delete(userFiles)
        .where(and(eq(userFiles.userId, state.userId!), eq(userFiles.path, sourcePath)))
        .run();
    }
    recordDesktopEvent(state, "info", "files", `file moved ${path}`);
    return [`Moved ${file.name} to ${path}.`];
  }
  recordDesktopEvent(state, "info", "files", `file copied ${path}`);
  return [`Copied ${file.name} to ${path}.`];
}

function handleSend(state: ShellSessionState, args: string[]): ShellResult["output"] {
  const sender = state.username ?? "guest";
  const recipient = args[0];
  const rest = args.slice(1).join(" ").trim();
  if (!recipient || !rest) {
    return ["Usage: send <recipient> <subject>: <body>"];
  }

  const [subjectRaw, ...bodyParts] = rest.includes(":")
    ? rest.split(":")
    : ["note", rest];
  const subject = subjectRaw.trim() || "note";
  const body = bodyParts.join(":").trim();
  if (!body) {
    return ["Usage: send <recipient> <subject>: <body>"];
  }

  const createdAt = Date.now();
  state.mailbox.push({
    from: sender,
    to: recipient,
    subject,
    body,
    createdAt,
  });

  if (state.loggedIn) {
    db.insert(mailMessages).values({
      sender,
      recipient,
      subject,
      body,
      createdAt,
    }).run();
  }
  recordDesktopEvent(state, "info", "mail", `mail sent ${recipient}`);

  return [
    `Sent to ${recipient}.`,
    `Subject: ${subject}`,
  ];
}

function handleInbox(state: ShellSessionState): ShellResult["output"] {
  const messages = mailMessagesForUser(state);
  if (!messages.length) {
    return ["No mail in inbox."];
  }

  return messages.map(
    (msg, index) =>
      `${index + 1}. ${msg.subject} from ${msg.from} to ${msg.to} — ${msg.body}`,
  );
}

function sessionHost(rowState: Partial<ShellSessionState>): string {
  return rowState.remoteStack?.at(-1)?.host ?? rowState.homeHost ?? "cyberscape";
}

function sanitizeSessionSnapshot(rowState: Partial<ShellSessionState> | null | undefined): Partial<ShellSessionState> {
  const snapshot = { ...(rowState ?? {}) };
  cleanupStealthState(snapshot as ShellSessionState, Date.now());
  return snapshot;
}

function sessionTunnel(rowState: Partial<ShellSessionState>): string {
  return rowState.tunnel ? `${rowState.tunnel.from}->${rowState.tunnel.to}` : "none";
}

function keyFingerprint(publicKey: string | null | undefined): string {
  if (!publicKey) return "none";
  return createHash("sha256").update(publicKey).digest("hex").slice(0, 16);
}

function handleUsers(): ShellResult["output"] {
  const rows = db.select().from(users).all();
  if (!rows.length) return ["Local users: guest"];
  return [
    "Local users:",
    ...rows
      .map((row) => `  ${row.username.padEnd(16)} home=${row.homeHost} badges=${row.badges.length}`)
      .sort(),
  ];
}

function handleWho(): ShellResult["output"] {
  const sessions = db.select().from(shellSessions).all();
  const active = sessions
    .map((row) => sanitizeSessionSnapshot(row.state as unknown as Partial<ShellSessionState>))
    .filter((rowState) => rowState.ttyPort)
    .sort((a, b) => String(a.username ?? "guest").localeCompare(String(b.username ?? "guest")));

  if (!active.length) {
    return ["Active operators:", "  none"];
  }

  return [
    "Active operators:",
    ...active.map((rowState) =>
      `  ${(rowState.username ?? "guest").padEnd(16)} tty=${rowState.ttyPort} host=${sessionHost(rowState)} mode=${rowState.shellMode ?? "nli"} camp=${rowState.campHost ?? "none"} tunnel=${sessionTunnel(rowState)}`
    ),
  ];
}

function handleFinger(state: ShellSessionState, target?: string): ShellResult["output"] {
  const name = target ?? state.username ?? "guest";
  if (name.startsWith("@")) {
    const hostname = name.slice(1);
    const host = getHost(hostname);
    if (!host) return [`finger: @${hostname}: no such host`];
    const occupants = hostOccupants(host.hostname);
    return [
      `[${host.hostname}] ${host.org}`,
      `Location: ${host.location}`,
      `Ports: ${host.ports.length ? host.ports.join(",") : "none"}`,
      `Users on ${host.hostname}:`,
      "Login       Name                         TTY    Idle   Office",
      "-----       ----                         ---    ----   ------",
      ...occupants.map((occupant) =>
        `${occupant.login.padEnd(11)} ${occupant.name.padEnd(28).slice(0, 28)} ${occupant.tty.padEnd(6)} ${occupant.idle.padEnd(6)} ${occupant.office}`
      ),
      "Plans:",
      ...occupants.map((occupant) => `  ${occupant.login}: ${occupant.plan}`),
      "Source: simulated host occupants derived from Cyberscape host records.",
    ];
  }

  if (name.toLowerCase() === "guest") {
    return [
      "Login: guest",
      "Directory: /guest",
      "No badges yet.",
    ];
  }

  const row = db.select().from(users).where(eq(users.username, name)).get();
  if (!row) return [`finger: ${name}: no such user`];

  const sessions = db.select().from(shellSessions).all()
    .map((session) => session.state as unknown as Partial<ShellSessionState>)
    .filter((rowState) => rowState.username?.toLowerCase() === row.username.toLowerCase());

  return [
    `Login: ${row.username}`,
    `Directory: /home/${row.username}`,
    `Home host: ${row.homeHost}`,
    `Disk quota: ${row.diskQuota}KB`,
    `System level: ${row.systemLevel}`,
    `SSH key fingerprint: ${keyFingerprint(row.sshPublicKey)}`,
    `TTYs: ${sessions.map((rowState) => rowState.ttyPort).join(", ") || "none"}`,
    ...badgeSummary(row.badges),
  ];
}

function userNameById(userRows: Array<typeof users.$inferSelect>, id: number | null | undefined): string {
  if (!id) return "none";
  return userRows.find((row) => row.id === id)?.username ?? `uid:${id}`;
}

function hostLoginIds(row: typeof hostState.$inferSelect): number[] {
  return Array.isArray(row.loginUserIds) ? row.loginUserIds : [];
}

function handleScores(state: ShellSessionState, scope?: string): ShellResult["output"] {
  if (scope === "/badges") return badgeSummary(state.badges);

  const userRows = db.select().from(users).all();
  const hostRows = db.select().from(hostState).all();
  const mailRows = db.select().from(mailMessages).all();
  const bbsRows = db.select().from(bbsMessages).all();
  const usenetRows = db.select().from(usenetArticles).all();
  const fileRows = db.select().from(userFiles).all();
  const basicRows = db.select().from(basicPrograms).all();
  const savedRows = db.select().from(savedStates).all();
  const sessionRows = db.select().from(shellSessions).all();

  if (scope === "/hosts" || scope === "/roots") {
    const rows = hostRows
      .filter((row) => scope !== "/roots" || row.rootUserId)
      .sort((a, b) => a.hostname.localeCompare(b.hostname));
    if (!rows.length) return ["No captured hosts yet."];
    return [
      scope === "/roots" ? "Root board:" : "Host control:",
      ...rows.map((row) => {
        const logins = hostLoginIds(row).map((id) => userNameById(userRows, id)).join(", ") || "none";
        return `  ${row.hostname.padEnd(16)} root=${userNameById(userRows, row.rootUserId).padEnd(16)} logins=${logins}`;
      }),
    ];
  }

  if (scope === "/mail") {
    const rows = userRows
      .map((row) => ({
        username: row.username,
        sent: mailRows.filter((msg) => msg.sender === row.username).length,
        received: mailRows.filter((msg) => msg.recipient === row.username).length,
      }))
      .filter((row) => row.sent || row.received)
      .sort((a, b) => (b.sent + b.received) - (a.sent + a.received) || a.username.localeCompare(b.username));
    if (!rows.length) return ["No mail traffic yet."];
    return [
      "Mail board:",
      ...rows.map((row) => `  ${row.username.padEnd(16)} sent=${row.sent} received=${row.received}`),
    ];
  }

  if (scope === "/bbs") {
    const rows = userRows
      .map((row) => ({
        username: row.username,
        posts: bbsRows.filter((msg) => msg.author === row.username).length,
      }))
      .filter((row) => row.posts)
      .sort((a, b) => b.posts - a.posts || a.username.localeCompare(b.username));
    if (!rows.length) return ["No BBS posts yet."];
    return [
      "BBS board:",
      ...rows.map((row) => `  ${row.username.padEnd(16)} posts=${row.posts}`),
    ];
  }

  if (scope && scope !== "/top") {
    return ["Usage: scores [/top|/badges|/hosts|/roots|/mail|/bbs]"];
  }

  const rows = userRows
    .map((row) => {
      const roots = hostRows.filter((host) => host.rootUserId === row.id).length;
      const logins = hostRows.filter((host) => hostLoginIds(host).includes(row.id)).length;
      const posts = bbsRows.filter((msg) => msg.author === row.username).length;
      const newsPosts = usenetRows.filter((article) => article.author.startsWith(`${row.username}@`)).length;
      const sent = mailRows.filter((msg) => msg.sender === row.username).length;
      const received = mailRows.filter((msg) => msg.recipient === row.username).length;
      const programs = basicRows.filter((program) => program.userId === row.id).length;
      const saves = savedRows.filter((save) => save.userId === row.id).length;
      const files = fileRows.filter((file) => file.userId === row.id).length;
      const active = sessionRows.filter((session) => session.userId === row.id).length;
      const badgeCount = row.badges.length;
      const score = badgeCount * 100 + roots * 75 + logins * 35 + posts * 20 + newsPosts * 20 + (sent + received) * 10 + programs * 10 + files * 5 + saves * 5 + active;
      return { username: row.username, score, badgeCount, roots, logins, posts, newsPosts, mail: sent + received, programs, files, saves, active, diskQuota: row.diskQuota, systemLevel: row.systemLevel };
    })
    .sort((a, b) => b.score - a.score || a.username.localeCompare(b.username));

  if (!rows.length) return ["Scores:", "  guest score=0 badges=0 roots=0 logins=0 posts=0 news=0 mail=0 basic=0 files=0 saves=0 active=0"];
  return [
    "Scores:",
    ...rows.map((row) =>
      `  ${row.username.padEnd(16)} score=${row.score} badges=${row.badgeCount} level=${row.systemLevel} quota=${row.diskQuota}KB roots=${row.roots} logins=${row.logins} posts=${row.posts} news=${row.newsPosts} mail=${row.mail} basic=${row.programs} files=${row.files} saves=${row.saves} active=${row.active}`
    ),
  ];
}

function handleQotd(): ShellResult["output"] {
  return [
    "QOTD:",
    "The route is the memory, and the memory is the route.",
  ];
}

function handleAlias(state: ShellSessionState): ShellResult["output"] {
  return [
    `Home host: ${state.homeHost}`,
    `Current host: ${currentHost(state)}`,
    "Aliases: enter/connect/cd, ls/dir, cat, trace/traceroute, help/?, and the legacy protocol hops.",
  ];
}

function handleVersion(): ShellResult["output"] {
  return [
    "Cyberscape v0.2",
    "Backend-authoritative shell, BBS, and transport stack.",
  ];
}

function handleHistory(state: ShellSessionState, args: string[] = []): ShellResult["output"] {
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  const query = args.join(" ").trim().toLowerCase();
  const rows = query
    ? state.commandHistory.filter((entry) =>
      entry.line.toLowerCase().includes(query) || entry.host.toLowerCase().includes(query) || entry.mode.toLowerCase().includes(query)
    )
    : state.commandHistory.slice(-12);
  return [
    "2000 | Calm shell era",
    "2003 | Multiplayer nostalgia and dial-up memory",
    "2008 | Stored archives and personal project trails",
    "",
    query ? `Recent commands matching "${query}":` : "Recent commands:",
    ...(rows.length ? formatCommandHistory(rows) : ["  none"]),
    "Usage: history [search text]",
  ];
}

function handleToday(): ShellResult["output"] {
  const now = new Date();
  return [
    `Today: ${now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}`,
    "The archive remembers the shape of the day more than the exact hour.",
  ];
}

function handleStatus(state: ShellSessionState): ShellResult["output"] {
  const progress = progressionForBadges(state.badges);
  return [
    `user: ${state.username ?? "guest"}`,
    `prompt: ${prompt(state)}`,
    `mode: ${state.shellMode}`,
    `room: ${currentHost(state)}`,
    `pager: ${state.pager ? "active" : "idle"}`,
    `link: ${state.linkTargetSessionId ?? "none"}`,
    `mirror: ${state.mirrorInbox.length ? `${state.mirrorInbox.length} queued` : "idle"}`,
    `camp: ${state.campHost ?? "none"}`,
    `tunnel: ${state.tunnel ? `${state.tunnel.from}->${state.tunnel.to}` : "none"}`,
    `badges: ${state.badges.join(", ") || "none"}`,
    `disk quota: ${progress.diskQuota}KB`,
    `system level: ${progress.systemLevel}`,
    `logins: ${state.loginHosts.join(", ") || "none"}`,
    `roots: ${state.rootHosts.join(", ") || "none"}`,
  ];
}

function handleWhoAmI(state: ShellSessionState): ShellResult["output"] {
  const progress = progressionForBadges(state.badges);
  return [
    `Operator: ${state.username ?? "guest"}`,
    `TTY: ${state.ttyPort}`,
    `Home host: ${state.homeHost}`,
    `Current host: ${currentHost(state)}`,
    `Shell mode: ${state.shellMode}`,
    `STTY: ${state.stty}`,
    `Link: ${state.linkTargetSessionId ?? "none"}`,
    `Pager: ${state.pager ? "active" : "idle"}`,
    `Badges: ${state.badges.length}`,
    `Disk quota: ${progress.diskQuota}KB`,
    `System level: ${progress.systemLevel}`,
    `SSH key fingerprint: ${keyFingerprint(state.sshPublicKey)}`,
  ];
}

function handleMotd(state: ShellSessionState): ShellResult["output"] {
  return [
    `Welcome to ${currentHost(state)}.`,
    "The shell is backend-owned; the room is only as honest as its state.",
  ];
}

function handleInventory(state: ShellSessionState): ShellResult["output"] {
  if (!state.badges.length) return ["No badges yet."];
  return state.badges.map((badge) => `- ${badge}`);
}

function hostAccessLevel(state: ShellSessionState, hostname: string): "root" | "login" | "public" {
  if (state.rootHosts.includes(hostname)) return "root";
  if (state.loginHosts.includes(hostname)) return "login";
  return "public";
}

function netstatMarkerForHost(state: ShellSessionState, hostname: string): "" | "*" | "!" {
  if (state.rootHosts.includes(hostname)) return "!";
  if (state.loginHosts.includes(hostname)) return "*";
  return "";
}

function networkAccessLevel(state: ShellSessionState, hostname: string): DesktopNetworkEntry["access"] {
  if (hostname.toLowerCase() === currentHost(state).toLowerCase()) return "local";
  return hostAccessLevel(state, hostname);
}

function collectDesktopNetworkEntries(state: ShellSessionState): DesktopNetworkEntry[] {
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  const baseHost = getHost(currentHost(state)) ?? getHost(state.homeHost) ?? getHost("cyberscape");
  const names = new Set<string>();
  if (baseHost) {
    names.add(baseHost.hostname);
    for (const neighbor of baseHost.neighbors.slice(0, 16)) names.add(neighbor);
  }
  for (const host of [...state.loginHosts, ...state.rootHosts]) names.add(host);
  for (const bookmark of state.desktopBookmarks) {
    if (bookmark.kind === "host" || bookmark.kind === "route") names.add(bookmark.target);
  }
  return [...names]
    .map((name): DesktopNetworkEntry | null => {
      const host = getHost(name);
      if (!host) return null;
      const route = findUucpRoute(currentHost(state), host.hostname) ?? (host.hostname === currentHost(state) ? [host.hostname] : []);
      return {
        id: `net:${host.hostname}`,
        host: host.hostname,
        org: host.org,
        location: host.location,
        access: networkAccessLevel(state, host.hostname),
        marker: netstatMarkerForHost(state, host.hostname),
        route,
        ports: host.ports.slice(0, 8),
        bbs: Boolean(host.bbs_config),
        bookmarked: state.desktopBookmarks.some((bookmark) => bookmark.target.toLowerCase() === host.hostname.toLowerCase()),
      };
    })
    .filter((entry): entry is DesktopNetworkEntry => Boolean(entry))
    .sort((a, b) => {
      const rank = (entry: DesktopNetworkEntry) => entry.access === "local" ? 0 : entry.access === "root" ? 1 : entry.access === "login" ? 2 : 3;
      return rank(a) - rank(b) || Number(b.bookmarked) - Number(a.bookmarked) || a.host.localeCompare(b.host);
    });
}

export function desktopNetworkEntries(state: ShellSessionState): DesktopNetworkEntry[] {
  return collectDesktopNetworkEntries(state).slice(0, 32);
}

function dialupStatusForEntry(state: ShellSessionState, networkEntry: DesktopNetworkEntry): DesktopDialupEntry["status"] {
  if (networkEntry.host.toLowerCase() === currentHost(state).toLowerCase()) return "connected";
  if (state.tunnel?.from === networkEntry.host || state.tunnel?.to === networkEntry.host) return "connected";
  if (state.campHost?.toLowerCase() === networkEntry.host.toLowerCase()) return "watched";
  if (networkEntry.bookmarked) return "saved";
  const outcome = dialOutcomeForHost(networkEntry.host);
  if (outcome === "busy") return "busy";
  if (outcome === "no-carrier") return "no-carrier";
  return "available";
}

function dialupActionsForEntry(entry: Pick<DesktopDialupEntry, "host" | "status" | "access">): string[] {
  if (entry.status === "connected") return [`trace ${entry.host}`, `dial ${entry.host}`, `coupler ${entry.host}`, `telnet ${entry.host}`, "network"];
  if (entry.status === "saved") return [`trace ${entry.host}`, `dial ${entry.host}`, `telnet ${entry.host}`, `bookmark route ${entry.host}`];
  if (entry.status === "watched") return [`trace ${entry.host}`, "camp", "events audit"];
  if (entry.status === "busy" || entry.status === "no-carrier") return [`hunt ${entry.host}`, `phonebook ${entry.host}`, `wardial`, `coupler ${entry.host}`, `trace ${entry.host}`];
  if (entry.access === "login" || entry.access === "root") return [`dial ${entry.host}`, `coupler ${entry.host}`, `telnet ${entry.host}`, `trace ${entry.host}`, `task maint ${entry.host}`];
  return [`dial ${entry.host}`, `hunt ${entry.host}`, `coupler ${entry.host}`, `trace ${entry.host}`, `task scan ${entry.host}`];
}

function collectDesktopDialupEntries(state: ShellSessionState): DesktopDialupEntry[] {
  const entries: DesktopDialupEntry[] = [];
  for (const networkEntry of collectDesktopNetworkEntries(state).slice(0, 24)) {
    const status = dialupStatusForEntry(state, networkEntry);
    const route = networkEntry.route.length ? networkEntry.route : [currentHost(state), networkEntry.host].filter((item, index, all) => all.indexOf(item) === index);
    const entry: DesktopDialupEntry = {
      id: `dial:${networkEntry.host}`,
      name: networkEntry.host === currentHost(state) ? "Local Area" : `${networkEntry.host} DUN`,
      host: networkEntry.host,
      status,
      access: networkEntry.access,
      route,
      number: dialupNumberForHost(networkEntry.host),
      speed: dialupSpeedForHost(networkEntry.host),
      lineType: inferredPhoneLineType(networkEntry.host),
      protocol: inferredPhoneProtocol(networkEntry.host),
      notes: inferredPhoneNotes(networkEntry.host),
      lastSeen: status === "connected" ? "now" : networkEntry.bookmarked ? "saved" : "not dialed",
      actions: [],
    };
    entry.actions = dialupActionsForEntry(entry);
    entries.push(entry);
  }
  for (const personal of parsePersonalPhonebook(state)) {
    const host = getHost(personal.host);
    if (!host) continue;
    const route = findUucpRoute(currentHost(state), host.hostname) ??
      [currentHost(state), host.hostname].filter((item, index, all) => all.indexOf(item) === index);
    const status = host.hostname.toLowerCase() === currentHost(state).toLowerCase() ? "connected" : "saved";
    const entry: DesktopDialupEntry = {
      id: `dial:personal:${host.hostname}`,
      name: personal.label || `${host.hostname} phonebook`,
      host: host.hostname,
      status,
      access: networkAccessLevel(state, host.hostname),
      route,
      number: dialupNumberForHost(host.hostname),
      speed: dialupSpeedForHost(host.hostname),
      lineType: personal.lineType || inferredPhoneLineType(host.hostname),
      protocol: personal.protocol || inferredPhoneProtocol(host.hostname),
      notes: personal.notes || inferredPhoneNotes(host.hostname),
      lastSeen: "personal",
      actions: [],
    };
    entry.actions = [`dial ${entry.number}`, `dial ${entry.host}`, `coupler ${entry.host}`, `phonebook rm ${entry.host}`, `trace ${entry.host}`];
    entries.push(entry);
  }
  return entries
    .sort((a, b) => {
      const rank = (entry: DesktopDialupEntry) => entry.status === "connected" ? 0 : entry.status === "saved" ? 1 : entry.status === "watched" ? 2 : entry.status === "busy" ? 3 : entry.status === "no-carrier" ? 4 : 5;
      return rank(a) - rank(b) || a.host.localeCompare(b.host);
    })
    .filter((entry, index, all) => all.findIndex((item) => item.host === entry.host) === index)
    .slice(0, 48);
}

export function desktopDialupEntries(state: ShellSessionState): DesktopDialupEntry[] {
  return collectDesktopDialupEntries(state);
}

function addLineageEntry(entries: DesktopLineageEntry[], entry: Omit<DesktopLineageEntry, "id">): void {
  const id = `lineage:${entry.era}:${entry.method}:${entry.host}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  if (entries.some((existing) => existing.id === id)) return;
  entries.push({
    id,
    ...entry,
    meaning: entry.meaning.replace(/\s+/g, " ").slice(0, 180),
    actions: entry.actions.slice(0, 5),
  });
}

function collectDesktopLineageEntries(state: ShellSessionState): DesktopLineageEntry[] {
  const entries: DesktopLineageEntry[] = [];
  const host = currentHost(state);
  const networkRows = collectDesktopNetworkEntries(state);
  const dialupRows = collectDesktopDialupEntries(state);
  const currentDial = dialupRows.find((entry) => entry.host.toLowerCase() === host.toLowerCase()) ?? dialupRows[0];
  const visibleBbs = networkRows.find((entry) => entry.bbs) ?? networkRows.find((entry) => entry.host === "bbs");
  const packetTarget = state.packetCircuit
    ? networkRows.find((entry) => entry.host.toLowerCase() === state.packetCircuit?.host.toLowerCase())
    : networkRows.find((entry) => entry.route.length > 1 && entry.host.toLowerCase() !== host.toLowerCase());
  const telnetTarget = networkRows.find((entry) => entry.ports.includes(23) && entry.host.toLowerCase() !== host.toLowerCase()) ?? networkRows[0];
  const uucpTarget = networkRows.find((entry) => entry.route.length > 2) ?? networkRows.find((entry) => entry.route.length > 1) ?? telnetTarget;
  const coupler = state.acousticCoupler;

  addLineageEntry(entries, {
    era: "pre-dialup",
    method: "phone book + acoustic coupler",
    status: coupler ? "connected" : currentDial?.status === "connected" ? "enabled" : "limited",
    host: coupler?.host ?? host,
    path: coupler?.number ?? currentDial?.number ?? dialupNumberForHost(host),
    speed: coupler?.speed ?? "110-300",
    meaning: "Before common home modems, the player fantasy starts with phone numbers, printed directories, terminals, and acoustic couplers.",
    actions: coupler
      ? [`dial ${coupler.host}`, "coupler detach", "modems acoustic", "dialup", "wardial"]
      : currentDial
        ? [`coupler ${currentDial.host}`, `dial ${currentDial.host}`, "modems acoustic", "dialup", "wardial"]
        : ["coupler <host>", "modems acoustic", "dialup", "wardial"],
  });

  if (visibleBbs) {
    addLineageEntry(entries, {
      era: "dialup",
      method: "BBS direct dial",
      status: visibleBbs.access === "local" || visibleBbs.access === "login" || visibleBbs.access === "root" ? "enabled" : "limited",
      host: visibleBbs.host,
      path: dialupNumberForHost(visibleBbs.host),
      speed: dialupSpeedForHost(visibleBbs.host),
      meaning: "BBS access is a one-number social/file world: call, login as guest or user, read boards, and pull files.",
      actions: [`dial ${dialupNumberForHost(visibleBbs.host)}`, `trace ${visibleBbs.host}`, `telnet ${visibleBbs.host}`, "bbs"],
    });
  }

  if (packetTarget) {
    addLineageEntry(entries, {
      era: "packet",
      method: "X.25 PAD packet switch",
      status: state.packetCircuit?.host.toLowerCase() === packetTarget.host.toLowerCase()
        ? "connected"
        : packetTarget.access === "local" || packetTarget.access === "login" || packetTarget.access === "root"
          ? "enabled"
          : "limited",
      host: packetTarget.host,
      path: state.packetCircuit?.host.toLowerCase() === packetTarget.host.toLowerCase()
        ? `${state.packetCircuit.switchHost} => ${state.packetCircuit.address}`
        : `${packetSwitchForRoute(packetTarget.route)} => ${packetAddressForHost(packetTarget.host)}`,
      speed: state.packetCircuit?.host.toLowerCase() === packetTarget.host.toLowerCase()
        ? state.packetCircuit.speed
        : `${Math.max(1, packetTarget.route.length - 1)} hop`,
      meaning: "Packet switching sits between straight dial-up and flat internet assumptions: ask a PAD for a route, then traverse named switching fabric to reach a remote shell.",
      actions: [`pad ${packetTarget.host}`, `x25 ${packetTarget.host}`, `trace ${packetTarget.host}`, "connections packet"],
    });
  }

  if (uucpTarget) {
    addLineageEntry(entries, {
      era: "packet",
      method: "UUCP store-and-forward",
      status: uucpTarget.route.length > 1 ? "enabled" : "limited",
      host: uucpTarget.host,
      path: uucpTarget.route.length ? uucpTarget.route.join("!") : `${host}!${uucpTarget.host}`,
      speed: `${Math.max(1, uucpTarget.route.length - 1)} hop`,
      meaning: "Routes are not a flat internet: mail, news, files, and trust move through named neighbor systems.",
      actions: [`uupath ${uucpTarget.host}`, `trace ${uucpTarget.host}`, "uumap"],
    });
  }

  if (telnetTarget) {
    addLineageEntry(entries, {
      era: "internet",
      method: "telnet/rlogin shell",
      status: connectionStatusForNetwork(telnetTarget),
      host: telnetTarget.host,
      path: telnetTarget.route.length ? telnetTarget.route.join(" -> ") : telnetTarget.host,
      speed: telnetTarget.access === "public" ? "shared" : "session",
      meaning: "Telnet-style traversal is the core live connection loop: move host to host, then return with back/exit.",
      actions: [`dial ${telnetTarget.host}`, `telnet ${telnetTarget.host}`, `rlogin ${telnetTarget.host}`, `trace ${telnetTarget.host}`],
    });
  }

  addLineageEntry(entries, {
    era: "lan",
    method: "Windows Network Places",
    status: state.remoteStack.length ? "connected" : "enabled",
    host,
    path: state.remoteStack.length ? state.remoteStack.map((entry) => entry.host).join(" -> ") : "local workstation",
    speed: state.remoteStack.length ? `${state.remoteStack.length} hop` : "10Mbps",
    meaning: "The XP shell is the late layer: control panels, mapped drives, shares, services, tasks, and event logs expose the same old network state.",
    actions: ["connections", "network", "mapdrive", "services"],
  });

  return entries;
}

export function desktopLineageEntries(state: ShellSessionState): DesktopLineageEntry[] {
  return collectDesktopLineageEntries(state);
}

function remoteDisplayForEntry(state: ShellSessionState, entry: DesktopNetworkEntry): string {
  if (entry.access === "root") return state.desktopTheme === "7" ? "Aero 1024x768" : "Console 1024";
  if (entry.access === "login") return "Console 800x600";
  if (entry.host.toLowerCase() === currentHost(state).toLowerCase()) return "Local console";
  return "Prompt only";
}

function remoteStatusForEntry(state: ShellSessionState, entry: DesktopNetworkEntry): DesktopRemoteEntry["status"] {
  if (entry.host.toLowerCase() === currentHost(state).toLowerCase()) return "connected";
  if (state.tunnel?.from === entry.host || state.tunnel?.to === entry.host) return "connected";
  if (entry.access === "root") return "credentialed";
  if (entry.access === "login") return "available";
  if (state.desktopTasks.some((task) => task.target === entry.host && task.status !== "done")) return "queued";
  return "blocked";
}

function remoteActionsForEntry(entry: Pick<DesktopRemoteEntry, "host" | "status" | "access">): string[] {
  if (entry.status === "connected") return ["status", `trace ${entry.host}`, "connections", "desktop open remote"];
  if (entry.status === "credentialed") return [`mstsc ${entry.host}`, `telnet ${entry.host}`, `trace ${entry.host}`, `task maint ${entry.host}`];
  if (entry.status === "available") return [`mstsc ${entry.host}`, `telnet ${entry.host}`, `trace ${entry.host}`, "secure"];
  if (entry.status === "queued") return ["tasks", `scheduler ${entry.host}`, `trace ${entry.host}`];
  return [`trace ${entry.host}`, `task scan ${entry.host}`, `porthack ${entry.host}`, "network"];
}

function addRemoteEntry(entries: DesktopRemoteEntry[], entry: Omit<DesktopRemoteEntry, "id">): void {
  const id = `remote:${entry.host}:${entry.profile}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  if (entries.some((existing) => existing.id === id)) return;
  entries.push({
    id,
    ...entry,
    profile: entry.profile.replace(/\s+/g, " ").slice(0, 100),
    source: entry.source.replace(/\s+/g, " ").slice(0, 80),
    actions: entry.actions.slice(0, 5),
  });
}

function collectDesktopRemoteEntries(state: ShellSessionState): DesktopRemoteEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  const entries: DesktopRemoteEntry[] = [];
  for (const network of collectDesktopNetworkEntries(state).slice(0, 24)) {
    const status = remoteStatusForEntry(state, network);
    const route = network.route.length ? network.route : [currentHost(state), network.host].filter((item, index, all) => all.indexOf(item) === index);
    const profile = network.host.toLowerCase() === currentHost(state).toLowerCase()
      ? `${state.desktopTheme.toUpperCase()} local console`
      : network.bookmarked
        ? `${network.host} saved desktop profile`
        : `${network.host} terminal services profile`;
    const entry: Omit<DesktopRemoteEntry, "id"> = {
      host: network.host,
      profile,
      status,
      access: network.access,
      route,
      display: remoteDisplayForEntry(state, network),
      source: network.bookmarked ? "desktopBookmarks+desktopNetwork" : "desktopNetwork",
      actions: [],
    };
    entry.actions = remoteActionsForEntry(entry);
    addRemoteEntry(entries, entry);
  }
  for (const task of state.desktopTasks.filter((task) => task.status !== "done").slice(0, 12)) {
    if (entries.some((entry) => entry.host === task.target)) continue;
    addRemoteEntry(entries, {
      host: task.target,
      profile: `${task.kind} job console`,
      status: "queued",
      access: "public",
      route: [currentHost(state), task.target].filter((item, index, all) => all.indexOf(item) === index),
      display: "Pending",
      source: "desktopTasks",
      actions: ["tasks", `scheduler ${task.target}`, `trace ${task.target}`],
    });
  }
  return entries
    .sort((a, b) => {
      const rank = (entry: DesktopRemoteEntry) => entry.status === "connected" ? 0 : entry.status === "credentialed" ? 1 : entry.status === "available" ? 2 : entry.status === "queued" ? 3 : 4;
      return rank(a) - rank(b) || a.host.localeCompare(b.host);
    })
    .slice(0, 48);
}

export function desktopRemoteEntries(state: ShellSessionState): DesktopRemoteEntry[] {
  return collectDesktopRemoteEntries(state);
}

function addRunEntry(entries: DesktopRunEntry[], entry: Omit<DesktopRunEntry, "id">): void {
  const id = `run:${entry.command}:${entry.source}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  if (entries.some((existing) => existing.id === id)) return;
  entries.push({
    id,
    ...entry,
    command: entry.command.replace(/\s+/g, " ").slice(0, 80),
    target: entry.target.replace(/\s+/g, " ").slice(0, 140),
    source: entry.source.replace(/\s+/g, " ").slice(0, 80),
    actions: entry.actions.slice(0, 5),
  });
}

function collectDesktopRunEntries(state: ShellSessionState): DesktopRunEntry[] {
  normalizeDesktopWindowState(state);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  const entries: DesktopRunEntry[] = [];
  addRunEntry(entries, {
    command: "cmd.exe",
    target: "Terminal app for the current Cyberscape shell session",
    status: "ready",
    source: "desktopApps",
    actions: ["desktop open terminal", "help", "status"],
  });
  addRunEntry(entries, {
    command: "explorer.exe",
    target: `Files and folders at ${state.cwd}`,
    status: "ready",
    source: "desktopFiles",
    actions: ["desktop open files", "files", "folders"],
  });
  addRunEntry(entries, {
    command: "control.exe",
    target: `${DESKTOP_APPS.filter((app) => app !== "terminal").length} workstation applet(s)`,
    status: "ready",
    source: "desktopApps",
    actions: ["desktop open control", "control", "cpl"],
  });
  addRunEntry(entries, {
    command: "mstsc.exe",
    target: `${desktopRemoteEntries(state).length} remote profile row(s)`,
    status: "ready",
    source: "desktopRemote",
    actions: ["desktop open remote", "remote", "mstsc"],
  });
  addRunEntry(entries, {
    command: "runas.exe",
    target: state.rootHosts.length ? `${state.rootHosts.length} controlled host(s)` : "requires simulated credentials",
    status: state.rootHosts.length ? "elevated" : "blocked",
    source: "desktopSecurity",
    actions: state.rootHosts.length ? ["owned", "security", "services"] : ["security", "porthack", "rootkit"],
  });
  for (const app of DESKTOP_APPS.filter((app) => app !== "terminal").slice(0, 20)) {
    addRunEntry(entries, {
      command: `${app}.cpl`,
      target: DESKTOP_APP_TITLES[app] ?? app,
      status: app === state.desktopActiveApp ? "recent" : "ready",
      source: "desktopApps",
      actions: [`desktop open ${app}`, app],
    });
  }
  for (const command of state.commandHistory.slice(-12).reverse()) {
    const verb = command.line.split(/\s+/)[0]?.toLowerCase() ?? "";
    if (!verb || verb === "runbox" || verb === "start") continue;
    addRunEntry(entries, {
      command: command.line,
      target: `${command.mode} on ${command.host}`,
      status: "recent",
      source: "commandHistory",
      actions: [`history ${verb}`, verb],
    });
  }
  for (const file of desktopFileEntries(state).slice(0, 12)) {
    addRunEntry(entries, {
      command: file.path,
      target: `${file.kind} file on ${file.host}, ${file.size}b`,
      status: "ready",
      source: "desktopFiles",
      actions: [`files ${file.name}`, `cat ${file.path}`],
    });
  }
  addRunEntry(entries, {
    command: "real-os-shell",
    target: "native process launch is not available from the browser surface",
    status: "blocked",
    source: "authorityBoundary",
    actions: ["help runbox", "support remote"],
  });
  return entries
    .sort((a, b) => {
      const rank = (entry: DesktopRunEntry) => entry.status === "recent" ? 0 : entry.status === "ready" ? 1 : entry.status === "elevated" ? 2 : entry.status === "blocked" ? 3 : 4;
      return rank(a) - rank(b) || a.command.localeCompare(b.command);
    })
    .slice(0, 96);
}

export function desktopRunEntries(state: ShellSessionState): DesktopRunEntry[] {
  return collectDesktopRunEntries(state);
}

function addConnectionEntry(entries: DesktopConnectionEntry[], entry: Omit<DesktopConnectionEntry, "id">): void {
  const id = `conn:${entry.name}:${entry.host}:${entry.source}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  if (entries.some((existing) => existing.id === id)) return;
  entries.push({ id, ...entry, actions: entry.actions.slice(0, 4) });
}

function connectionStatusForNetwork(entry: DesktopNetworkEntry): DesktopConnectionEntry["status"] {
  if (entry.access === "local" || entry.access === "root") return "connected";
  if (entry.access === "login") return "enabled";
  return entry.ports.includes(23) || entry.ports.includes(80) ? "limited" : "firewalled";
}

function collectDesktopConnectionEntries(state: ShellSessionState): DesktopConnectionEntry[] {
  const entries: DesktopConnectionEntry[] = [];
  const host = currentHost(state);
  const networkRows = collectDesktopNetworkEntries(state);
  for (const network of networkRows.slice(0, 24)) {
    addConnectionEntry(entries, {
      name: network.host === host ? "Local Area Connection" : `${network.host} Network`,
      type: network.route.length > 1 ? "Remote LAN" : "LAN",
      status: connectionStatusForNetwork(network),
      device: network.ports.includes(23) ? "TCP/IP Adapter" : "Legacy Adapter",
      host: network.host,
      speed: network.access === "public" ? "10Mbps" : "100Mbps",
      source: "desktopNetwork",
      actions: [`network ${network.host}`, `trace ${network.host}`, `services ${network.host}`],
    });
  }
  if (state.packetCircuit) {
    addConnectionEntry(entries, {
      name: `PAD ${state.packetCircuit.host}`,
      type: "Packet",
      status: "connected",
      device: "X.25 PAD",
      host: state.packetCircuit.host,
      speed: state.packetCircuit.speed,
      source: "packetCircuit",
      actions: [`pad ${state.packetCircuit.host}`, `x25 ${state.packetCircuit.host}`, `trace ${state.packetCircuit.host}`, "lineage packet"],
    });
  }
  if (state.shellMode === "telex" && state.packetCircuit) {
    addConnectionEntry(entries, {
      name: `Telex ${state.packetCircuit.host}`,
      type: "Telex",
      status: "connected",
      device: "Teleprinter",
      host: state.packetCircuit.host,
      speed: state.packetCircuit.speed,
      source: "telexCircuit",
      actions: ["who", "answerback", "send <text>", "quit"],
    });
  }
  for (const network of networkRows
    .filter((entry) =>
      entry.route.length > 1 &&
      entry.host.toLowerCase() !== host.toLowerCase() &&
      entry.host.toLowerCase() !== state.packetCircuit?.host.toLowerCase()
    )
    .slice(0, 8)) {
    addConnectionEntry(entries, {
      name: `Packet ${network.host}`,
      type: "Packet",
      status: network.access === "local" || network.access === "login" || network.access === "root" ? "enabled" : "limited",
      device: "X.25 PAD",
      host: network.host,
      speed: `${Math.max(1, network.route.length - 1)} hop`,
      source: "packetRoutes",
      actions: [`pad ${network.host}`, `x25 ${network.host}`, `trace ${network.host}`, "lineage packet"],
    });
  }
  for (const dial of collectDesktopDialupEntries(state).slice(0, 16)) {
    addConnectionEntry(entries, {
      name: dial.name,
      type: "Dial-up",
      status: dial.status === "connected" ? "connected" : dial.status === "saved" ? "enabled" : dial.status === "watched" || dial.status === "busy" ? "queued" : "disabled",
      device: dial.speed.includes("ISDN") ? "ISDN Adapter" : "Modem",
      host: dial.host,
      speed: dial.speed,
      source: "desktopDialup",
      actions: dial.actions,
    });
  }
  if (state.tunnel) {
    const tunnelRoute = collectDesktopNetworkEntries(state).find((entry) => entry.host === state.tunnel?.to)?.route ?? [];
    addConnectionEntry(entries, {
      name: "Direct Tunnel",
      type: "Tunnel",
      status: "connected",
      device: "Shell Route",
      host: state.tunnel.to,
      speed: `${Math.max(1, tunnelRoute.length - 1)} hop`,
      source: "tunnel",
      actions: ["tunnel", `trace ${state.tunnel.to}`, "network"],
    });
  }
  for (const task of normalizeDesktopTasks(state.desktopTasks).filter((entry) => entry.status !== "done").slice(0, 8)) {
    addConnectionEntry(entries, {
      name: `${task.kind.toUpperCase()} ${task.target}`,
      type: "Scheduled",
      status: "queued",
      device: "Task Scheduler",
      host: task.target,
      speed: task.label || "pending",
      source: "desktopTasks",
      actions: ["tasks", `scheduler ${task.target}`],
    });
  }
  return entries.sort((a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name)).slice(0, 64);
}

export function desktopConnectionEntries(state: ShellSessionState): DesktopConnectionEntry[] {
  return collectDesktopConnectionEntries(state);
}

function addNetSetupEntry(entries: DesktopNetSetupEntry[], entry: Omit<DesktopNetSetupEntry, "id">): void {
  const id = `netsetup:${entry.stage}:${entry.item}:${entry.source}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  if (entries.some((existing) => existing.id === id)) return;
  entries.push({
    id,
    ...entry,
    status: entry.status.replace(/\s+/g, " ").slice(0, 160),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopNetSetupEntries(state: ShellSessionState): DesktopNetSetupEntry[] {
  const entries: DesktopNetSetupEntry[] = [];
  const host = currentHost(state);
  const networkRows = collectDesktopNetworkEntries(state);
  const connectionRows = collectDesktopConnectionEntries(state);
  const dialupRows = collectDesktopDialupEntries(state);
  const firewallRows = collectDesktopFirewallEntries(state);
  const shareRows = collectDesktopShareEntries(state);
  const serviceRows = collectDesktopServiceEntries(state);
  const taskRows = normalizeDesktopTasks(state.desktopTasks);
  const exposedHosts = collectDesktopSecurityEntries(state).filter((entry) => entry.posture === "exposed").length;
  const reachableServices = serviceRows.filter((entry) => entry.status !== "restricted").length;
  const writableShares = shareRows.filter((entry) => entry.writable).length;

  addNetSetupEntry(entries, {
    stage: "Profile",
    item: "Computer name",
    status: `${host} on ${state.homeHost}; user=${state.username ?? "guest"}`,
    source: "sessionState",
    actions: ["system", "accounts", "whoami"],
  });
  addNetSetupEntry(entries, {
    stage: "Profile",
    item: "Workgroup",
    status: `COMPUNET profile, theme=${state.desktopTheme}, ${networkRows.length} visible host(s)`,
    source: "desktopNetwork",
    actions: ["network", "nodes", "system"],
  });
  addNetSetupEntry(entries, {
    stage: "Adapters",
    item: "Local Area Connection",
    status: `${connectionRows.filter((entry) => entry.status === "connected").length} connected row(s), ${connectionRows.filter((entry) => entry.status === "limited").length} limited`,
    source: "desktopConnections",
    actions: ["connections", "ncpa.cpl", "services"],
  });
  addNetSetupEntry(entries, {
    stage: "Adapters",
    item: "Dial-up entries",
    status: `${dialupRows.length} saved or visible entry row(s), ${dialupRows.filter((entry) => entry.status === "connected").length} connected`,
    source: "desktopDialup",
    actions: ["dialup", "modems", "wardial"],
  });
  addNetSetupEntry(entries, {
    stage: "Sharing",
    item: "File sharing",
    status: `${shareRows.length} share row(s), ${writableShares} writable, cwd=${state.cwd}`,
    source: "desktopShares",
    actions: ["shares", "files", "folders"],
  });
  addNetSetupEntry(entries, {
    stage: "Sharing",
    item: "Network discovery",
    status: `${networkRows.length} visible host(s), route depth=${state.remoteStack.length}`,
    source: "desktopNetwork",
    actions: ["network", "trace", "search hosts"],
  });
  addNetSetupEntry(entries, {
    stage: "Firewall",
    item: "Profile status",
    status: `${firewallRows.length} firewall rule row(s), exposed hosts=${exposedHosts}`,
    source: "desktopFirewall",
    actions: ["firewall", "security", "secure"],
  });
  addNetSetupEntry(entries, {
    stage: "Services",
    item: "Reachability",
    status: `${reachableServices} reachable service row(s), ${serviceRows.length} total visible`,
    source: "desktopServices",
    actions: ["services", "netstat", "task scan <host>"],
  });
  addNetSetupEntry(entries, {
    stage: "Routes",
    item: "Route watcher",
    status: state.campHost ? `camp=${state.campHost}` : "no camp set; use camp on a host to watch",
    source: "routeState",
    actions: ["camp", "who", "taskmgr"],
  });
  addNetSetupEntry(entries, {
    stage: "Routes",
    item: "Direct tunnel",
    status: state.tunnel ? `${state.tunnel.from} -> ${state.tunnel.to}` : "no active direct tunnel",
    source: "routeState",
    actions: ["tunnel", "connections", "trace"],
  });
  addNetSetupEntry(entries, {
    stage: "Checklist",
    item: "Queued setup work",
    status: `${taskRows.filter((entry) => entry.status !== "done").length} queued task(s), ${state.desktopEvents.length} event row(s)`,
    source: "desktopTasks",
    actions: ["tasks", "scheduler", "events"],
  });
  return entries.sort((a, b) => a.stage.localeCompare(b.stage) || a.item.localeCompare(b.item)).slice(0, 64);
}

export function desktopNetSetupEntries(state: ShellSessionState): DesktopNetSetupEntry[] {
  return collectDesktopNetSetupEntries(state);
}

function addNetDiagnosticEntry(entries: DesktopNetDiagnosticEntry[], entry: Omit<DesktopNetDiagnosticEntry, "id">): void {
  const id = `netdiag:${entry.test}:${entry.target}:${entry.source}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  if (entries.some((existing) => existing.id === id)) return;
  entries.push({
    id,
    ...entry,
    detail: entry.detail.replace(/\s+/g, " ").slice(0, 180),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopNetDiagnosticEntries(state: ShellSessionState): DesktopNetDiagnosticEntry[] {
  const entries: DesktopNetDiagnosticEntry[] = [];
  const host = currentHost(state);
  const networkRows = collectDesktopNetworkEntries(state);
  const connectionRows = collectDesktopConnectionEntries(state);
  const serviceRows = collectDesktopServiceEntries(state);
  const firewallRows = collectDesktopFirewallEntries(state);
  const securityRows = collectDesktopSecurityEntries(state);
  const scheduleRows = collectDesktopScheduleEntries(state);
  const eventRows = normalizeDesktopEvents(state.desktopEvents);
  const taskRows = normalizeDesktopTasks(state.desktopTasks);
  const connected = connectionRows.filter((entry) => entry.status === "connected" || entry.status === "enabled");
  const limited = connectionRows.filter((entry) => entry.status === "limited" || entry.status === "firewalled");
  const reachableServices = serviceRows.filter((entry) => entry.status !== "restricted");
  const exposedHosts = securityRows.filter((entry) => entry.posture === "exposed");

  addNetDiagnosticEntry(entries, {
    test: "Adapter binding",
    target: host,
    result: connected.length ? "pass" : "warn",
    detail: `${connected.length} connected/enabled adapter row(s), ${limited.length} limited or firewalled`,
    source: "desktopConnections",
    actions: ["connections", "netsetup", "devices"],
  });
  addNetDiagnosticEntry(entries, {
    test: "Host visibility",
    target: "Network Places",
    result: networkRows.length > 1 ? "pass" : "info",
    detail: `${networkRows.length} visible host row(s), current=${host}, depth=${state.remoteStack.length}`,
    source: "desktopNetwork",
    actions: ["network", "nodes", "trace"],
  });
  addNetDiagnosticEntry(entries, {
    test: "Name services",
    target: "Visible hosts",
    result: networkRows.some((entry) => entry.ports.includes(79) || entry.ports.includes(80)) ? "pass" : "warn",
    detail: `${networkRows.filter((entry) => entry.ports.includes(79)).length} finger row(s), ${networkRows.filter((entry) => entry.ports.includes(80)).length} web row(s)`,
    source: "desktopNetwork",
    actions: ["finger", "services", "search hosts"],
  });
  addNetDiagnosticEntry(entries, {
    test: "Service reachability",
    target: "Service table",
    result: reachableServices.length ? "pass" : "warn",
    detail: `${reachableServices.length} reachable service row(s), ${serviceRows.length} visible total`,
    source: "desktopServices",
    actions: ["services", "netstat", "task scan <host>"],
  });
  addNetDiagnosticEntry(entries, {
    test: "Firewall profile",
    target: "Security",
    result: exposedHosts.length ? "warn" : "pass",
    detail: `${firewallRows.length} firewall rule row(s), ${exposedHosts.length} exposed host posture row(s)`,
    source: "desktopFirewall",
    actions: ["firewall", "security", "secure"],
  });
  addNetDiagnosticEntry(entries, {
    test: "Route watcher",
    target: state.campHost ?? "none",
    result: state.campHost ? "pass" : "info",
    detail: state.campHost ? `camp active on ${state.campHost}` : "no route watcher set",
    source: "routeState",
    actions: ["camp", "who", "taskmgr"],
  });
  addNetDiagnosticEntry(entries, {
    test: "Direct tunnel",
    target: state.tunnel?.to ?? "none",
    result: state.tunnel ? "pass" : "info",
    detail: state.tunnel ? `${state.tunnel.from} -> ${state.tunnel.to}` : "no direct tunnel active",
    source: "routeState",
    actions: ["tunnel", "connections", "trace"],
  });
  addNetDiagnosticEntry(entries, {
    test: "Queued network work",
    target: "Tasks",
    result: taskRows.some((entry) => entry.status !== "done") ? "warn" : "pass",
    detail: `${taskRows.filter((entry) => entry.status !== "done").length} queued task(s), ${scheduleRows.filter((entry) => entry.status === "queued").length} scheduled queued row(s)`,
    source: "desktopTasks",
    actions: ["tasks", "scheduler", "events"],
  });
  addNetDiagnosticEntry(entries, {
    test: "Event signal",
    target: "Logs",
    result: eventRows.some((entry) => entry.level === "warn") ? "warn" : "pass",
    detail: `${eventRows.length} event row(s), ${eventRows.filter((entry) => entry.level === "warn").length} warning(s)`,
    source: "desktopEvents",
    actions: ["eventviewer", "logs", "search network"],
  });
  return entries.sort((a, b) => {
    const rank = (entry: DesktopNetDiagnosticEntry) => entry.result === "fail" ? 0 : entry.result === "warn" ? 1 : entry.result === "info" ? 2 : 3;
    return rank(a) - rank(b) || a.test.localeCompare(b.test);
  }).slice(0, 64);
}

export function desktopNetDiagnosticEntries(state: ShellSessionState): DesktopNetDiagnosticEntry[] {
  return collectDesktopNetDiagnosticEntries(state);
}

function addDeviceEntry(entries: DesktopDeviceEntry[], entry: Omit<DesktopDeviceEntry, "id">): void {
  const id = `dev:${entry.host}:${entry.category}:${entry.name}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    name: entry.name.replace(/\s+/g, " ").slice(0, 80),
    resource: entry.resource.replace(/\s+/g, " ").slice(0, 80),
    actions: entry.actions.slice(0, 4),
  });
}

function deviceStatusForService(status: DesktopServiceEntry["status"]): DesktopDeviceEntry["status"] {
  if (status === "running") return "ok";
  if (status === "reachable") return "busy";
  return "warning";
}

function collectDesktopDeviceEntries(state: ShellSessionState): DesktopDeviceEntry[] {
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  const entries: DesktopDeviceEntry[] = [];
  const host = currentHost(state);
  const current = getHost(host);
  addDeviceEntry(entries, {
    host,
    category: "Computer",
    name: `${host} compatible PC`,
    status: current ? "ok" : "warning",
    driver: "hal.dll",
    resource: current ? current.org : "missing host metadata",
    actions: ["whoami", "nodes", "inspect"],
  });
  addDeviceEntry(entries, {
    host,
    category: "Terminal",
    name: `TTY ${state.ttyPort}`,
    status: state.pager ? "busy" : "ok",
    driver: `stty-${state.stty}`,
    resource: `${state.shellMode} mode`,
    actions: ["stty", "status", "history"],
  });
  addDeviceEntry(entries, {
    host: state.acousticCoupler?.host ?? host,
    category: "Modem",
    name: "Acoustic coupler",
    status: state.acousticCoupler ? "ok" : "offline",
    driver: "acoustic-coupler.sys",
    resource: state.acousticCoupler
      ? `${state.acousticCoupler.number} ${state.acousticCoupler.speed}`
      : "handset cups idle",
    actions: state.acousticCoupler ? [`dial ${state.acousticCoupler.host}`, "coupler detach", "lineage acoustic"] : ["coupler <host>", "lineage acoustic", "phonebook"],
  });
  addDeviceEntry(entries, {
    host: state.homeHost,
    category: "Storage",
    name: "Home directory",
    status: state.loggedIn ? "ok" : "offline",
    driver: "homefs.sys",
    resource: state.loggedIn ? `${userFileRows(state).length} file(s)` : "login required",
    actions: ["files", "shares home", "write <file> <text>"],
  });
  addDeviceEntry(entries, {
    host,
    category: "Network",
    name: "UUCP route adapter",
    status: state.remoteStack.length || state.tunnel ? "busy" : "ok",
    driver: "uucpndis.vxd",
    resource: `${state.remoteStack.length} active hop(s)`,
    actions: ["network", "dialup", "trace <host>"],
  });
  const packetRoutes = collectDesktopNetworkEntries(state).filter((entry) => entry.route.length > 1 && entry.host.toLowerCase() !== host.toLowerCase());
  addDeviceEntry(entries, {
    host: state.packetCircuit?.host ?? host,
    category: "Network",
    name: "X.25 PAD adapter",
    status: state.packetCircuit ? "busy" : packetRoutes.length ? "ok" : "offline",
    driver: "x25pad.sys",
    resource: state.packetCircuit
      ? `${state.packetCircuit.address} via ${state.packetCircuit.switchHost}`
      : packetRoutes.length
        ? `${packetRoutes.length} packet route(s) visible`
        : "no packet routes visible",
    actions: state.packetCircuit
      ? [`pad ${state.packetCircuit.host}`, `x25 ${state.packetCircuit.host}`, "connections packet", "lineage packet"]
      : ["connections packet", "lineage packet", "pad <host>", "x25 <host>"],
  });
  addDeviceEntry(entries, {
    host: state.packetCircuit?.host ?? host,
    category: "Terminal",
    name: "Telex teleprinter",
    status: state.shellMode === "telex" ? "busy" : "offline",
    driver: "telextty.sys",
    resource: state.shellMode === "telex" && state.packetCircuit
      ? `${state.packetCircuit.address} ${state.packetCircuit.speed}`
      : "parked platen; use telex <host>",
    actions: state.shellMode === "telex" && state.packetCircuit
      ? ["who", "answerback", "send <text>", "quit"]
      : ["connections telex", "lineage packet", "telex <host>", "pad <host>"],
  });
  for (const service of desktopServiceEntries(state).slice(0, 10)) {
    addDeviceEntry(entries, {
      host: service.host,
      category: "Port",
      name: `${service.name} controller`,
      status: deviceStatusForService(service.status),
      driver: `${service.name.toLowerCase()}.sys`,
      resource: `tcp/${service.port}`,
      actions: service.actions,
    });
  }
  for (const dialup of desktopDialupEntries(state).slice(0, 6)) {
    addDeviceEntry(entries, {
      host: dialup.host,
      category: "Modem",
      name: dialup.name,
      status: dialup.status === "connected" || dialup.status === "saved" ? "ok" : dialup.status === "watched" || dialup.status === "busy" ? "busy" : dialup.status === "no-carrier" ? "warning" : "offline",
      driver: "modemui.dll",
      resource: `${dialup.number} ${dialup.speed}`,
      actions: dialup.actions,
    });
  }
  for (const printer of desktopPrintEntries(state).slice(0, 6)) {
    addDeviceEntry(entries, {
      host: printer.host,
      category: "Printer",
      name: printer.queue,
      status: printer.status === "ready" ? "ok" : printer.status === "queued" ? "busy" : "warning",
      driver: "unidrv.dll",
      resource: printer.document,
      actions: printer.actions,
    });
  }
  for (const task of state.desktopTasks.filter((item) => item.status !== "done").slice(0, 6)) {
    addDeviceEntry(entries, {
      host: task.target,
      category: "System",
      name: `${task.kind} job controller`,
      status: "busy",
      driver: "schedsvc.dll",
      resource: task.label,
      actions: [`task done ${task.id}`, "tasks", "events task"],
    });
  }
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => {
      const rank = (entry: DesktopDeviceEntry) => entry.status === "warning" ? 0 : entry.status === "busy" ? 1 : entry.status === "ok" ? 2 : 3;
      return rank(a) - rank(b) || a.host.localeCompare(b.host) || a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    })
    .slice(0, 64);
}

export function desktopDeviceEntries(state: ShellSessionState): DesktopDeviceEntry[] {
  return collectDesktopDeviceEntries(state);
}

function addModemEntry(entries: DesktopModemEntry[], entry: Omit<DesktopModemEntry, "id">): void {
  const id = `modem:${entry.tab}:${entry.name}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopModemEntries(state: ShellSessionState): DesktopModemEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const dialupRows = desktopDialupEntries(state);
  const deviceRows = desktopDeviceEntries(state);
  const networkRows = desktopNetworkEntries(state);
  const serviceRows = desktopServiceEntries(state);
  const regionalRows = desktopRegionalEntries(state);
  const entries: DesktopModemEntry[] = [];
  const connected = dialupRows.find((entry) => entry.status === "connected");
  const saved = dialupRows.filter((entry) => entry.status === "saved").length;
  const tollCalls = state.tollLedger ?? [];
  const lastToll = tollCalls.at(-1) ?? null;
  addModemEntry(entries, {
    tab: "Dialing Rules",
    name: "Current Location",
    value: `${currentHost(state)} exchange, ${regionalRows.find((entry) => entry.setting === "Location")?.value ?? "local shell context"}`,
    source: "sessionState",
    actions: ["status", "regional", "nodes"],
  });
  addModemEntry(entries, {
    tab: "Dialing Rules",
    name: "Area Code Rules",
    value: `${networkRows.length} visible host area(s), ${saved} saved dialing route(s)`,
    source: "desktopNetwork",
    actions: ["network", "dialup", "bookmarks"],
  });
  addModemEntry(entries, {
    tab: "Dialing Rules",
    name: "Calling Card",
    value: state.loggedIn
      ? `${state.username ?? "operator"} profile, ${tollCalls.length} toll call(s) authorized`
      : "guest profile, no calling card stored",
    source: "tollLedger",
    actions: ["whoami", "accounts calling", "credentials calling", "operator"],
  });
  addModemEntry(entries, {
    tab: "Dialing Rules",
    name: "Toll Ledger",
    value: lastToll
      ? `${tollCalls.length} call(s); last ${lastToll.host} ${lastToll.number} ${lastToll.hops} hop(s)`
      : "no toll calls recorded",
    source: "tollLedger",
    actions: ["operator <host>", "dial <host>", "accounts toll", "credentials toll"],
  });
  addModemEntry(entries, {
    tab: "Modems",
    name: "Attached Modems",
    value: `${deviceRows.filter((entry) => entry.category === "Modem").length} simulated modem device row(s)`,
    source: "desktopDevices",
    actions: ["devices modem", "devmgmt modem"],
  });
  addModemEntry(entries, {
    tab: "Modems",
    name: "Acoustic Coupler",
    value: state.acousticCoupler
      ? `${state.acousticCoupler.host} ${state.acousticCoupler.number} ${state.acousticCoupler.speed}`
      : "idle handset cups; attach with coupler <host>",
    source: "acousticCoupler",
    actions: state.acousticCoupler ? [`dial ${state.acousticCoupler.host}`, "coupler detach", "lineage acoustic"] : ["coupler <host>", "phonebook", "lineage acoustic"],
  });
  addModemEntry(entries, {
    tab: "Modems",
    name: "Active Connection",
    value: connected ? `${connected.name} ${connected.number} ${connected.speed}` : "no active dial-up row",
    source: "desktopDialup",
    actions: ["dialup", connected ? `trace ${connected.host}` : "network"],
  });
  addModemEntry(entries, {
    tab: "Modems",
    name: "Line Hunt Groups",
    value: `${dialupRows.filter((entry) => dialLineProfilesForHost(entry.host).length > 1).length} host(s) expose alternate numbers`,
    source: "desktopDialup",
    actions: ["hunt <host>", "dialup", "phonebook"],
  });
  for (const dialup of dialupRows.slice(0, 6)) {
    const lineCount = dialLineProfilesForHost(dialup.host).length;
    addModemEntry(entries, {
      tab: "Modems",
      name: dialup.name,
      value: `${dialup.status}, ${dialup.number}, ${dialup.speed}, route=${dialup.route.length}, lines=${lineCount}`,
      source: "desktopDialup",
      actions: dialup.actions,
    });
  }
  addModemEntry(entries, {
    tab: "Diagnostics",
    name: "Query Modem",
    value: `${serviceRows.filter((entry) => entry.name === "Telnet" || entry.name === "FTP" || entry.name === "Gopher").length} legacy transport service row(s) reachable`,
    source: "desktopServices",
    actions: ["services", "netstat", "inspect"],
  });
  addModemEntry(entries, {
    tab: "Diagnostics",
    name: "Last Response",
    value: state.desktopEvents.at(-1)?.message ?? "OK",
    source: "desktopEvents",
    actions: ["events", "logs"],
  });
  addModemEntry(entries, {
    tab: "Advanced",
    name: "Extra Settings",
    value: state.stty === "dumb" ? "AT&F plain terminal fallback" : `AT&F ${state.stty} terminal profile`,
    source: "stty",
    actions: ["stty", "help"],
  });
  addModemEntry(entries, {
    tab: "Advanced",
    name: "Browser Hardware",
    value: "not enumerated; browser serial and hardware APIs unused",
    source: "shellRuntime",
    actions: ["modems", "devices", "help"],
  });
  addModemEntry(entries, {
    tab: "Activity",
    name: "Queued Dial Jobs",
    value: `${state.desktopTasks.filter((task) => task.status !== "done").length} queued task row(s)`,
    source: "desktopTasks",
    actions: ["tasks", "scheduler", "taskmgr"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tab.localeCompare(b.tab) || a.name.localeCompare(b.name))
    .slice(0, 48);
}

export function desktopModemEntries(state: ShellSessionState): DesktopModemEntry[] {
  return collectDesktopModemEntries(state);
}

function addSystemEntry(entries: DesktopSystemEntry[], entry: Omit<DesktopSystemEntry, "id">): void {
  const id = `sys:${entry.group}:${entry.name}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function systemVersionForTheme(theme: ShellSessionState["desktopTheme"]): string {
  if (theme === "nt") return "Windows NT Workstation 4.0 profile";
  if (theme === "2000") return "Windows 2000 Professional profile";
  if (theme === "7") return "Windows 7 Professional profile";
  return "Windows XP Professional profile";
}

function collectDesktopSystemEntries(state: ShellSessionState): DesktopSystemEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const host = getHost(currentHost(state));
  const progress = progressionForBadges(state.badges);
  const devices = desktopDeviceEntries(state);
  const entries: DesktopSystemEntry[] = [];
  addSystemEntry(entries, {
    group: "General",
    name: "Shell Version",
    value: systemVersionForTheme(state.desktopTheme),
    source: "prefs",
    actions: ["theme nt", "theme xp", "winver"],
  });
  addSystemEntry(entries, {
    group: "General",
    name: "Computer Name",
    value: currentHost(state),
    source: "host",
    actions: ["nodes", "network", "status"],
  });
  addSystemEntry(entries, {
    group: "General",
    name: "Organization",
    value: host ? `${host.org} (${host.location})` : "unknown host metadata",
    source: "host",
    actions: ["hosts", "finger", "inspect"],
  });
  addSystemEntry(entries, {
    group: "User",
    name: "Registered To",
    value: state.loggedIn ? `${state.username} on ${state.homeHost}` : "guest session",
    source: "identity",
    actions: ["whoami", "login", "newuser"],
  });
  addSystemEntry(entries, {
    group: "User",
    name: "Access",
    value: `login=${state.loginHosts.length}; root=${state.rootHosts.length}; badges=${state.badges.length}`,
    source: "access",
    actions: ["owned", "security", "scores"],
  });
  addSystemEntry(entries, {
    group: "Resources",
    name: "Disk Quota",
    value: `${progress.diskQuota}KB`,
    source: "progression",
    actions: ["scores", "files", "shares"],
  });
  addSystemEntry(entries, {
    group: "Resources",
    name: "System Level",
    value: String(progress.systemLevel),
    source: "progression",
    actions: ["scores", "owned"],
  });
  addSystemEntry(entries, {
    group: "Resources",
    name: "Devices",
    value: `${devices.length} device row(s), ${devices.filter((entry) => entry.status === "warning").length} warning(s)`,
    source: "devices",
    actions: ["devices", "devmgmt"],
  });
  addSystemEntry(entries, {
    group: "Network",
    name: "Route Depth",
    value: `${state.remoteStack.length} active hop(s)`,
    source: "network",
    actions: ["network", "dialup", "trace <host>"],
  });
  addSystemEntry(entries, {
    group: "Network",
    name: "Stealth",
    value: `camp=${state.campHost ?? "none"}; tunnel=${state.tunnel ? `${state.tunnel.from}->${state.tunnel.to}` : "none"}`,
    source: "access",
    actions: ["camp", "tunnel", "events audit"],
  });
  addSystemEntry(entries, {
    group: "Desktop",
    name: "Theme",
    value: `${state.desktopTheme}; motion=${state.desktopPrefs.motion}; contrast=${state.desktopPrefs.contrast}`,
    source: "prefs",
    actions: ["theme", "theme pref", "desktop export"],
  });
  addSystemEntry(entries, {
    group: "Desktop",
    name: "Windows",
    value: `open=${state.desktopOpenApps.length}; minimized=${state.desktopMinimizedApps.length}; maximized=${state.desktopMaximizedApps.length}`,
    source: "session",
    actions: ["desktop", "desktop reset layout"],
  });
  addSystemEntry(entries, {
    group: "Support",
    name: "Activity",
    value: `history=${state.commandHistory.length}; tasks=${state.desktopTasks.length}; events=${state.desktopEvents.length}`,
    source: "session",
    actions: ["history", "tasks", "events"],
  });
  addSystemEntry(entries, {
    group: "Support",
    name: "Archives",
    value: `files=${desktopFileEntries(state).length}; boards=${desktopBoardEntries(state).length}; mail=${desktopMailEntries(state).length}`,
    source: "content",
    actions: ["files", "boards", "mailbox"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name))
    .slice(0, 48);
}

export function desktopSystemEntries(state: ShellSessionState): DesktopSystemEntry[] {
  return collectDesktopSystemEntries(state);
}

function addControlEntry(entries: DesktopControlEntry[], entry: Omit<DesktopControlEntry, "id">): void {
  const id = `cpl:${entry.category}:${entry.applet}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    status: entry.status.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopControlEntries(state: ShellSessionState): DesktopControlEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const systemRows = desktopSystemEntries(state);
  const deviceRows = desktopDeviceEntries(state);
  const networkRows = desktopNetworkEntries(state);
  const dialupRows = desktopDialupEntries(state);
  const securityRows = desktopSecurityEntries(state);
  const serviceRows = desktopServiceEntries(state);
  const shareRows = desktopShareEntries(state);
  const printRows = desktopPrintEntries(state);
  const registryRows = desktopRegistryEntries(state);
  const fileRows = desktopFileEntries(state);
  const folderRows = desktopFolderEntries(state);
  const boardRows = desktopBoardEntries(state);
  const mailRows = desktopMailEntries(state);
  const accountRows = desktopAccountEntries(state);
  const entries: DesktopControlEntry[] = [];
  addControlEntry(entries, {
    category: "System",
    applet: "System",
    status: systemRows.find((entry) => entry.name === "Shell Version")?.value ?? systemVersionForTheme(state.desktopTheme),
    source: "desktopSystem",
    actions: ["system", "sysdm", "winver"],
  });
  addControlEntry(entries, {
    category: "System",
    applet: "User Accounts",
    status: `${accountRows.length} account row(s), operator=${state.username ?? "guest"}`,
    source: "desktopAccounts",
    actions: ["accounts", "nusrmgr.cpl", "whoami"],
  });
  addControlEntry(entries, {
    category: "System",
    applet: "Stored User Names and Passwords",
    status: `${desktopCredentialEntries(state).length} credential row(s), secrets hidden`,
    source: "desktopCredentials",
    actions: ["credentials", "keymgr", "accounts"],
  });
  addControlEntry(entries, {
    category: "System",
    applet: "Date/Time",
    status: `${desktopTimeEntries(state).length} time row(s), utc=${new Date().toISOString().slice(11, 19)}`,
    source: "desktopTime",
    actions: ["datetime", "timedate.cpl", "clock"],
  });
  addControlEntry(entries, {
    category: "Appearance",
    applet: "Display",
    status: `${desktopDisplayEntries(state).length} display row(s), theme=${state.desktopTheme}, contrast=${state.desktopPrefs.contrast}`,
    source: "desktopDisplay",
    actions: ["display", "desk.cpl", "theme pref"],
  });
  addControlEntry(entries, {
    category: "Appearance",
    applet: "Sounds and Audio Devices",
    status: `${desktopSoundEntries(state).length} sound row(s), sound=${state.desktopPrefs.sound}`,
    source: "desktopSounds",
    actions: ["sounds", "mmsys.cpl", "theme pref sound on"],
  });
  addControlEntry(entries, {
    category: "Appearance",
    applet: "Power Options",
    status: `${desktopPowerEntries(state).length} power row(s), motion=${state.desktopPrefs.motion}`,
    source: "desktopPower",
    actions: ["power", "powercfg.cpl", "theme pref motion reduced"],
  });
  addControlEntry(entries, {
    category: "Appearance",
    applet: "Mouse",
    status: `${desktopMouseEntries(state).length} mouse row(s), keyboard=${state.desktopPrefs.keyboardMode}`,
    source: "desktopMouse",
    actions: ["mouse", "main.cpl", "theme pref keyboard desktop"],
  });
  addControlEntry(entries, {
    category: "Appearance",
    applet: "Keyboard",
    status: `${desktopKeyboardEntries(state).length} keyboard row(s), mode=${state.desktopPrefs.keyboardMode}`,
    source: "desktopKeyboard",
    actions: ["keyboard", "kbd.cpl", "theme pref keyboard terminal"],
  });
  addControlEntry(entries, {
    category: "Appearance",
    applet: "Accessibility Options",
    status: `${desktopAccessibilityEntries(state).length} accessibility row(s), contrast=${state.desktopPrefs.contrast}, motion=${state.desktopPrefs.motion}`,
    source: "desktopAccessibility",
    actions: ["accessibility", "access.cpl", "theme pref contrast high"],
  });
  addControlEntry(entries, {
    category: "Appearance",
    applet: "Regional and Language Options",
    status: `${desktopRegionalEntries(state).length} regional row(s), theme=${state.desktopTheme}`,
    source: "desktopRegional",
    actions: ["regional", "intl.cpl", "datetime"],
  });
  addControlEntry(entries, {
    category: "Hardware",
    applet: "Phone and Modem Options",
    status: `${desktopModemEntries(state).length} modem row(s), connections=${dialupRows.length}`,
    source: "desktopModems",
    actions: ["modems", "telephon.cpl", "dialup"],
  });
  addControlEntry(entries, {
    category: "Admin",
    applet: "ODBC Data Sources",
    status: `${desktopOdbcEntries(state).length} DSN row(s), services=${serviceRows.length}`,
    source: "desktopOdbc",
    actions: ["odbc", "odbcad32", "services"],
  });
  addControlEntry(entries, {
    category: "System",
    applet: "Windows Firewall",
    status: `${desktopFirewallEntries(state).length} firewall row(s), reachable=${serviceRows.filter((entry) => entry.status !== "restricted").length}`,
    source: "desktopFirewall",
    actions: ["firewall", "firewall.cpl", "security"],
  });
  addControlEntry(entries, {
    category: "System",
    applet: "Automatic Updates",
    status: `${desktopUpdateEntries(state).length} update row(s), queued=${state.desktopTasks.filter((task) => task.status !== "done").length}`,
    source: "desktopUpdates",
    actions: ["updates", "wuaucpl.cpl", "windowsupdate"],
  });
  addControlEntry(entries, {
    category: "Admin",
    applet: "Performance Monitor",
    status: `${desktopPerformanceEntries(state).length} counter row(s), processes=${desktopProcessEntries(state).length}`,
    source: "desktopPerformance",
    actions: ["performance", "perfmon", "perfmon.msc"],
  });
  addControlEntry(entries, {
    category: "System",
    applet: "System Restore",
    status: `${desktopRestoreEntries(state).length} restore row(s), user=${state.username ?? "guest"}`,
    source: "desktopRestore",
    actions: ["restore", "rstrui", "save <name>"],
  });
  addControlEntry(entries, {
    category: "Admin",
    applet: "Computer Management",
    status: `${desktopComputerEntries(state).length} management row(s), host=${currentHost(state)}`,
    source: "desktopComputer",
    actions: ["computer", "compmgmt", "compmgmt.msc"],
  });
  addControlEntry(entries, {
    category: "Admin",
    applet: "Event Viewer",
    status: `${desktopEventViewerEntries(state).length} event viewer row(s), events=${state.desktopEvents.length}`,
    source: "desktopEventViewer",
    actions: ["eventviewer", "eventvwr.msc", "events"],
  });
  addControlEntry(entries, {
    category: "System",
    applet: "Search Companion",
    status: `${desktopSearchEntries(state).length} indexed row(s), history=${state.commandHistory.length}`,
    source: "desktopSearch",
    actions: ["search", "find", "srchui"],
  });
  addControlEntry(entries, {
    category: "Admin",
    applet: "Disk Management",
    status: `${desktopDiskEntries(state).length} disk row(s), downloads=${Object.keys(state.downloads ?? {}).length}`,
    source: "desktopDisk",
    actions: ["disk", "diskmgmt", "diskmgmt.msc"],
  });
  addControlEntry(entries, {
    category: "System",
    applet: "Add/Remove Programs",
    status: `${desktopProgramEntries(state).length} program row(s), downloads=${Object.keys(state.downloads ?? {}).length}`,
    source: "desktopPrograms",
    actions: ["programs", "appwiz.cpl", "games"],
  });
  addControlEntry(entries, {
    category: "Hardware",
    applet: "Device Manager",
    status: `${deviceRows.length} device row(s), ${deviceRows.filter((entry) => entry.status === "warning").length} warning(s)`,
    source: "desktopDevices",
    actions: ["devices", "devmgmt"],
  });
  addControlEntry(entries, {
    category: "Network",
    applet: "Network Connections",
    status: `${desktopConnectionEntries(state).length} connection row(s), ${networkRows.length} visible host(s), ${dialupRows.filter((entry) => entry.status === "saved").length} saved connection(s)`,
    source: "desktopConnections",
    actions: ["connections", "ncpa.cpl", "network"],
  });
  addControlEntry(entries, {
    category: "Network",
    applet: "Network Setup Wizard",
    status: `${desktopNetSetupEntries(state).length} setup row(s), ${networkRows.length} visible host(s), ${shareRows.filter((entry) => entry.writable).length} writable share(s)`,
    source: "desktopNetSetup",
    actions: ["netsetup", "netsetup.cpl", "connections"],
  });
  addControlEntry(entries, {
    category: "Network",
    applet: "Network Diagnostics",
    status: `${desktopNetDiagnosticEntries(state).length} diagnostic row(s), ${desktopNetDiagnosticEntries(state).filter((entry) => entry.result === "warn" || entry.result === "fail").length} warning/fail row(s)`,
    source: "desktopNetDiagnostics",
    actions: ["netdiag", "diagnose", "connections"],
  });
  addControlEntry(entries, {
    category: "Internet",
    applet: "Internet Options",
    status: `${desktopInternetEntries(state).length} zone row(s), cache=${desktopFileEntries(state).length} item(s)`,
    source: "desktopInternet",
    actions: ["internet", "inetcpl", "services http"],
  });
  addControlEntry(entries, {
    category: "Security",
    applet: "Security Center",
    status: `${securityRows.length} posture row(s), ${securityRows.filter((entry) => entry.posture === "exposed").length} exposed`,
    source: "desktopSecurity",
    actions: ["security", "inspect", "secure"],
  });
  addControlEntry(entries, {
    category: "Admin",
    applet: "Services",
    status: `${serviceRows.length} service row(s), ${serviceRows.filter((entry) => entry.status !== "restricted").length} reachable`,
    source: "desktopServices",
    actions: ["services", "netstat", "task scan <host>"],
  });
  addControlEntry(entries, {
    category: "Admin",
    applet: "Shared Folders",
    status: `${shareRows.length} share row(s), ${shareRows.filter((entry) => entry.writable).length} writable`,
    source: "desktopShares",
    actions: ["shares", "files", "cd"],
  });
  addControlEntry(entries, {
    category: "Network",
    applet: "Map Network Drive",
    status: `${desktopMappedDriveEntries(state).length} mapped drive row(s), ${shareRows.length} share source row(s)`,
    source: "desktopMappedDrives",
    actions: ["mapdrive", "net use", "shares"],
  });
  addControlEntry(entries, {
    category: "Network",
    applet: "Remote Desktop Connection",
    status: `${desktopRemoteEntries(state).length} remote profile row(s), ${desktopRemoteEntries(state).filter((entry) => entry.status === "connected" || entry.status === "credentialed").length} ready`,
    source: "desktopRemote",
    actions: ["remote", "mstsc", "connections"],
  });
  addControlEntry(entries, {
    category: "System",
    applet: "Run",
    status: `${desktopRunEntries(state).length} run target row(s), ${desktopRunEntries(state).filter((entry) => entry.status === "recent").length} recent`,
    source: "desktopRun",
    actions: ["runbox", "start", "cmd.exe"],
  });
  addControlEntry(entries, {
    category: "Storage",
    applet: "Offline Files",
    status: `${desktopOfflineEntries(state).length} cached/sync row(s), ${state.desktopTasks.filter((task) => task.status !== "done").length} pending`,
    source: "desktopOffline",
    actions: ["offline", "sync", "mobsync"],
  });
  addControlEntry(entries, {
    category: "Hardware",
    applet: "Printers",
    status: `${printRows.length} queue row(s), ${printRows.filter((entry) => entry.status === "held").length} held`,
    source: "desktopPrint",
    actions: ["printers", "printq", "task transfer"],
  });
  addControlEntry(entries, {
    category: "Admin",
    applet: "Registry",
    status: `${registryRows.length} key row(s), ${registryRows.filter((entry) => entry.writable).length} writable`,
    source: "desktopRegistry",
    actions: ["registry", "reg query"],
  });
  addControlEntry(entries, {
    category: "Storage",
    applet: "Folder Options",
    status: `${folderRows.length} option row(s), ${fileRows.length} visible file row(s), cwd=${state.cwd}`,
    source: "desktopFolders",
    actions: ["folders", "folderopts", "files"],
  });
  addControlEntry(entries, {
    category: "Internet",
    applet: "Mail and News",
    status: `${mailRows.length} mail row(s), ${boardRows.length} board row(s)`,
    source: "desktopContent",
    actions: ["mailbox", "boards", "news"],
  });
  addControlEntry(entries, {
    category: "Admin",
    applet: "Scheduled Tasks",
    status: `${state.desktopTasks.filter((task) => task.status !== "done").length} queued, ${state.desktopEvents.length} event row(s)`,
    source: "desktopTasks",
    actions: ["tasks", "events", "task scan <host>"],
  });
  addControlEntry(entries, {
    category: "Support",
    applet: "Help and Support",
    status: `${desktopHelpEntries(state).length} support row(s), ${state.commandHistory.length} recent command(s), ${state.desktopBookmarks.length} bookmark(s)`,
    source: "desktopHelp",
    actions: ["support", "helpctr", "help"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.category.localeCompare(b.category) || a.applet.localeCompare(b.applet))
    .slice(0, 48);
}

export function desktopControlEntries(state: ShellSessionState): DesktopControlEntry[] {
  return collectDesktopControlEntries(state);
}

function addAccountEntry(entries: DesktopAccountEntry[], entry: Omit<DesktopAccountEntry, "id">): void {
  const id = `account:${entry.scope}:${entry.name}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopAccountEntries(state: ShellSessionState): DesktopAccountEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  const entries: DesktopAccountEntry[] = [];
  const userRows = db.select().from(users).all();
  const sessions = db.select().from(shellSessions).all()
    .map((session) => sanitizeSessionSnapshot(session.state as unknown as Partial<ShellSessionState>))
    .filter((rowState) => rowState.ttyPort);
  const matchingSessions = sessions.filter((rowState) => (rowState.username ?? "guest") === (state.username ?? "guest"));
  const matchingTtys = matchingSessions.map((rowState) => String(rowState.ttyPort));
  const progress = progressionForBadges(state.badges);
  const accountRow = state.username ? userRows.find((row) => row.username === state.username) : null;
  const tollCalls = state.tollLedger ?? [];
  const lastToll = tollCalls.at(-1) ?? null;
  const sysopRecords = sysopRecordsForState(state);
  addAccountEntry(entries, {
    scope: "Current",
    name: "Operator",
    value: state.username ?? "guest",
    source: "sessionIdentity",
    actions: ["whoami", "finger", "login", "newuser"],
  });
  addAccountEntry(entries, {
    scope: "Current",
    name: "Home Host",
    value: state.homeHost,
    source: "sessionIdentity",
    actions: ["whoami", "nodes", "netstat"],
  });
  addAccountEntry(entries, {
    scope: "Current",
    name: "Profile",
    value: `level=${progress.systemLevel}; quota=${progress.diskQuota}KB; badges=${state.badges.length}`,
    source: "progressionState",
    actions: ["whoami", "finger", "scores"],
  });
  addAccountEntry(entries, {
    scope: "Current",
    name: "SSH Key",
    value: keyFingerprint(state.sshPublicKey),
    source: "sshPublicKey",
    actions: ["set key", "whoami"],
  });
  addAccountEntry(entries, {
    scope: "Access",
    name: "Login Hosts",
    value: state.loginHosts.length ? `${state.loginHosts.length}: ${state.loginHosts.slice(0, 5).join(", ")}` : "none",
    source: "loginHosts",
    actions: ["owned", "netstat", "porthack"],
  });
  addAccountEntry(entries, {
    scope: "Access",
    name: "Root Hosts",
    value: state.rootHosts.length ? `${state.rootHosts.length}: ${state.rootHosts.slice(0, 5).join(", ")}` : "none",
    source: "rootHosts",
    actions: ["owned", "secure", "rootkit"],
  });
  addAccountEntry(entries, {
    scope: "Access",
    name: "Calling Card",
    value: state.loggedIn
      ? lastToll
        ? `${tollCalls.length} toll call(s); last=${lastToll.host} ${lastToll.hops} hop(s)`
        : "ready; no toll calls"
      : "guest; no calling card stored",
    source: "tollLedger",
    actions: ["operator <host>", "modems toll", "credentials calling", "dialup"],
  });
  addAccountEntry(entries, {
    scope: "Access",
    name: "Sysop Boards",
    value: sysopRecords.length
      ? `${sysopRecords.length}: ${sysopRecords.slice(0, 5).map((record) => record.host).join(", ")}`
      : "none",
    source: "bbsSysop",
    actions: ["bbs", "boards sysop", "credentials sysop"],
  });
  addAccountEntry(entries, {
    scope: "Local",
    name: "Known Users",
    value: userRows.length ? `${userRows.length} local profile(s)` : "guest only",
    source: "usersTable",
    actions: ["users", "finger <user>"],
  });
  addAccountEntry(entries, {
    scope: "Session",
    name: "Active Operators",
    value: sessions.length ? `${sessions.length} visible tty session(s)` : "none",
    source: "shellSessions",
    actions: ["who", "finger"],
  });
  addAccountEntry(entries, {
    scope: "Session",
    name: "Current TTY",
    value: `tty=${state.ttyPort}; mode=${state.shellMode}; host=${currentHost(state)}`,
    source: "sessionState",
    actions: ["whoami", "status"],
  });
  addAccountEntry(entries, {
    scope: "Session",
    name: "Matching TTYs",
    value: matchingTtys.length ? `${matchingTtys.length}: ${matchingTtys.slice(0, 8).join(", ")}` : "none",
    source: "shellSessions",
    actions: ["who", "finger"],
  });
  addAccountEntry(entries, {
    scope: "Desktop",
    name: "Theme Profile",
    value: `${state.desktopTheme}; prefs=${state.desktopPrefs.motion}/${state.desktopPrefs.contrast}/${state.desktopPrefs.fontSize}`,
    source: "desktopPrefs",
    actions: ["theme", "display", "settings"],
  });
  addAccountEntry(entries, {
    scope: "Desktop",
    name: "Personal Data",
    value: `bookmarks=${state.desktopBookmarks.length}; history=${state.commandHistory.length}; downloads=${Object.keys(state.downloads ?? {}).length}`,
    source: "sessionData",
    actions: ["bookmarks", "history", "files"],
  });
  if (accountRow) {
    addAccountEntry(entries, {
      scope: "Local",
      name: "Stored Profile",
      value: `home=${accountRow.homeHost}; level=${accountRow.systemLevel}; quota=${accountRow.diskQuota}KB`,
      source: "usersTable",
      actions: ["finger", "users"],
    });
  }
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.scope.localeCompare(b.scope) || a.name.localeCompare(b.name))
    .slice(0, 40);
}

export function desktopAccountEntries(state: ShellSessionState): DesktopAccountEntry[] {
  return collectDesktopAccountEntries(state);
}

function addCredentialEntry(entries: DesktopCredentialEntry[], entry: Omit<DesktopCredentialEntry, "id">): void {
  const id = `cred:${entry.target}:${entry.username}:${entry.kind}:${entry.source}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  if (entries.some((existing) => existing.id === id)) return;
  entries.push({
    id,
    ...entry,
    target: entry.target.replace(/\s+/g, " ").slice(0, 80),
    username: entry.username.replace(/\s+/g, " ").slice(0, 80),
    kind: entry.kind.replace(/\s+/g, " ").slice(0, 60),
    source: entry.source.replace(/\s+/g, " ").slice(0, 80),
    actions: entry.actions.slice(0, 5),
  });
}

function collectDesktopCredentialEntries(state: ShellSessionState): DesktopCredentialEntry[] {
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  const entries: DesktopCredentialEntry[] = [];
  const username = state.username ?? "guest";
  const tollCalls = state.tollLedger ?? [];
  const lastToll = tollCalls.at(-1) ?? null;
  const sysopRecords = sysopRecordsForState(state);
  addCredentialEntry(entries, {
    target: currentHost(state),
    username,
    kind: "interactive logon",
    status: state.loggedIn ? "active" : "missing",
    source: "sessionIdentity",
    actions: state.loggedIn ? ["whoami", "accounts", "logout"] : ["login", "newuser", "accounts"],
  });
  addCredentialEntry(entries, {
    target: state.homeHost,
    username,
    kind: "home profile",
    status: state.loggedIn ? "stored" : "missing",
    source: "homeHost",
    actions: ["accounts", "files", "nodes"],
  });
  addCredentialEntry(entries, {
    target: "Calling Card",
    username,
    kind: lastToll ? `${tollCalls.length} toll authorization(s)` : "toll authorization",
    status: state.loggedIn ? "stored" : "missing",
    source: lastToll ? `tollLedger:${lastToll.host}:${lastToll.number}` : "tollLedger",
    actions: ["operator <host>", "modems toll", "accounts calling", "dialup"],
  });
  addCredentialEntry(entries, {
    target: "BBS Sysop",
    username,
    kind: sysopRecords.length ? `${sysopRecords.length} board authorization(s)` : "board authorization",
    status: sysopRecords.length ? "stored" : "missing",
    source: sysopRecords.length
      ? `bbsSysop:${sysopRecords.map((record) => record.host).join(",")}`
      : "bbsSysop",
    actions: ["bbs", "boards sysop", "accounts sysop"],
  });
  addCredentialEntry(entries, {
    target: "SSH Public Key",
    username,
    kind: keyFingerprint(state.sshPublicKey),
    status: state.sshPublicKey ? "stored" : "missing",
    source: "sshPublicKey",
    actions: ["set key", "accounts", "registry ssh"],
  });
  for (const host of Array.from(new Set(state.loginHosts)).slice(0, 24)) {
    addCredentialEntry(entries, {
      target: host,
      username,
      kind: "login shell",
      status: state.rootHosts.includes(host) ? "elevated" : "stored",
      source: "loginHosts",
      actions: [`telnet ${host}`, `trace ${host}`, "secure", "security"],
    });
  }
  for (const host of Array.from(new Set(state.rootHosts)).slice(0, 24)) {
    addCredentialEntry(entries, {
      target: host,
      username,
      kind: "root credential",
      status: "elevated",
      source: "rootHosts",
      actions: [`telnet ${host}`, `services ${host}`, "owned", "security"],
    });
  }
  for (const bookmark of state.desktopBookmarks.slice(0, 12)) {
    addCredentialEntry(entries, {
      target: bookmark.target,
      username,
      kind: `${bookmark.kind} bookmark`,
      status: state.loginHosts.includes(bookmark.target) || state.rootHosts.includes(bookmark.target) ? "stored" : "missing",
      source: "desktopBookmarks",
      actions: ["bookmarks", bookmark.kind === "route" ? `trace ${bookmark.target}` : `network ${bookmark.target}`],
    });
  }
  for (const remote of desktopRemoteEntries(state).slice(0, 12)) {
    addCredentialEntry(entries, {
      target: remote.host,
      username,
      kind: "remote profile",
      status: remote.status === "credentialed" ? "stored" : remote.status === "connected" ? "active" : remote.status === "available" ? "stored" : "missing",
      source: "desktopRemote",
      actions: remote.actions,
    });
  }
  addCredentialEntry(entries, {
    target: "Raw Passwords",
    username: "not displayed",
    kind: "secret material",
    status: "revoked",
    source: "authorityBoundary",
    actions: ["help credentials", "security", "accounts"],
  });
  return entries
    .sort((a, b) => {
      const rank = (entry: DesktopCredentialEntry) => entry.status === "active" ? 0 : entry.status === "elevated" ? 1 : entry.status === "stored" ? 2 : entry.status === "missing" ? 3 : 4;
      return rank(a) - rank(b) || a.target.localeCompare(b.target) || a.kind.localeCompare(b.kind);
    })
    .slice(0, 72);
}

export function desktopCredentialEntries(state: ShellSessionState): DesktopCredentialEntry[] {
  return collectDesktopCredentialEntries(state);
}

function addTimeEntry(entries: DesktopTimeEntry[], entry: Omit<DesktopTimeEntry, "id">): void {
  const id = `time:${entry.tab}:${entry.name}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopTimeEntries(state: ShellSessionState): DesktopTimeEntry[] {
  normalizeDesktopWindowState(state);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const now = new Date();
  const iso = now.toISOString();
  const queuedTasks = state.desktopTasks.filter((task) => task.status !== "done");
  const lastEvent = state.desktopEvents.at(-1);
  const lastCommand = state.commandHistory.at(-1);
  const entries: DesktopTimeEntry[] = [];
  addTimeEntry(entries, {
    tab: "Date & Time",
    name: "Server Date",
    value: iso.slice(0, 10),
    source: "serverClock",
    actions: ["date", "clock", "when"],
  });
  addTimeEntry(entries, {
    tab: "Date & Time",
    name: "Server Time",
    value: `${iso.slice(11, 19)} UTC`,
    source: "serverClock",
    actions: ["clock", "date", "when"],
  });
  addTimeEntry(entries, {
    tab: "Time Zone",
    name: "Shell Zone",
    value: "UTC / backend shell clock",
    source: "serverClock",
    actions: ["when", "date"],
  });
  addTimeEntry(entries, {
    tab: "Internet Time",
    name: "Sync Source",
    value: "backend session clock; browser clock unused",
    source: "serverClock",
    actions: ["datetime", "clock"],
  });
  addTimeEntry(entries, {
    tab: "Calendar",
    name: "Discordian",
    value: handleDdate()[0].replace(/^Today is /, ""),
    source: "ddate",
    actions: ["ddate", "cal"],
  });
  addTimeEntry(entries, {
    tab: "Scheduler",
    name: "Queued Tasks",
    value: queuedTasks.length ? `${queuedTasks.length} queued: ${queuedTasks.slice(0, 3).map((task) => `${task.kind}:${task.target}`).join(", ")}` : "0 queued",
    source: "desktopTasks",
    actions: ["scheduler", "schtasks /query", "tasks"],
  });
  addTimeEntry(entries, {
    tab: "Scheduler",
    name: "Ambient Jobs",
    value: `${desktopScheduleEntries(state).filter((entry) => entry.status === "running").length} running maintenance row(s)`,
    source: "desktopSchedule",
    actions: ["scheduler", "events"],
  });
  addTimeEntry(entries, {
    tab: "Activity",
    name: "Last Event",
    value: lastEvent ? `${lastEvent.source}:${lastEvent.message}` : "none",
    source: "desktopEvents",
    actions: ["events", "logs"],
  });
  addTimeEntry(entries, {
    tab: "Activity",
    name: "Last Command",
    value: lastCommand ? lastCommand.line : "none",
    source: "commandHistory",
    actions: ["history", "desktop terminal"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tab.localeCompare(b.tab) || a.name.localeCompare(b.name))
    .slice(0, 32);
}

export function desktopTimeEntries(state: ShellSessionState): DesktopTimeEntry[] {
  return collectDesktopTimeEntries(state);
}

function addDisplayEntry(entries: DesktopDisplayEntry[], entry: Omit<DesktopDisplayEntry, "id">): void {
  const id = `display:${entry.tab}:${entry.setting}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopDisplayEntries(state: ShellSessionState): DesktopDisplayEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.desktopWindowPositions = normalizeDesktopWindowPositions(state.desktopWindowPositions);
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  const entries: DesktopDisplayEntry[] = [];
  const activePosition = state.desktopWindowPositions[state.desktopActiveApp];
  const placedWindows = Object.keys(state.desktopWindowPositions).length;
  const openCount = state.desktopOpenApps.length;
  const minimizedCount = state.desktopMinimizedApps.length;
  const maximizedCount = state.desktopMaximizedApps.length;
  const cellWidth = 80 + Math.min(40, openCount * 4 + placedWindows * 2);
  const cellHeight = 25 + Math.min(18, Math.max(0, openCount - minimizedCount) * 2);
  addDisplayEntry(entries, {
    tab: "Themes",
    setting: "Color Scheme",
    value: systemVersionForTheme(state.desktopTheme),
    source: "desktopTheme",
    actions: ["theme nt", "theme 2000", "theme xp", "theme 7"],
  });
  addDisplayEntry(entries, {
    tab: "Desktop",
    setting: "Wallpaper",
    value: `${state.desktopTheme} generated gradient, host=${currentHost(state)}`,
    source: "currentHost",
    actions: ["theme", "desktop export"],
  });
  addDisplayEntry(entries, {
    tab: "Appearance",
    setting: "Font Size",
    value: state.desktopPrefs.fontSize,
    source: "desktopPrefs.fontSize",
    actions: ["theme pref font normal", "theme pref font large"],
  });
  addDisplayEntry(entries, {
    tab: "Accessibility",
    setting: "Contrast",
    value: state.desktopPrefs.contrast,
    source: "desktopPrefs.contrast",
    actions: ["theme pref contrast normal", "theme pref contrast high"],
  });
  addDisplayEntry(entries, {
    tab: "Accessibility",
    setting: "Motion",
    value: state.desktopPrefs.motion,
    source: "desktopPrefs.motion",
    actions: ["theme pref motion normal", "theme pref motion reduced"],
  });
  addDisplayEntry(entries, {
    tab: "Sounds",
    setting: "Sound Scheme",
    value: state.desktopPrefs.sound,
    source: "desktopPrefs.sound",
    actions: ["theme pref sound muted", "theme pref sound on"],
  });
  addDisplayEntry(entries, {
    tab: "Settings",
    setting: "Work Area",
    value: `${cellWidth}x${cellHeight} character cells, open=${openCount}, minimized=${minimizedCount}`,
    source: "desktopOpenApps",
    actions: ["desktop open", "desktop min", "desktop restore"],
  });
  addDisplayEntry(entries, {
    tab: "Settings",
    setting: "Active Window",
    value: `${state.desktopActiveApp} at ${activePosition ? `${activePosition.x},${activePosition.y}` : "default"}`,
    source: "desktopActiveApp",
    actions: ["desktop <app>", "desktop move <app> <x> <y>"],
  });
  addDisplayEntry(entries, {
    tab: "Settings",
    setting: "Window State",
    value: `open=${openCount}; minimized=${minimizedCount}; maximized=${maximizedCount}; placed=${placedWindows}`,
    source: "desktopWindowPositions",
    actions: ["desktop open", "desktop min", "desktop max", "desktop move"],
  });
  addDisplayEntry(entries, {
    tab: "Screen Saver",
    setting: "Idle Narrative",
    value: state.loggedIn ? `${state.username} session on ${state.homeHost}` : "guest shell, no local account",
    source: "sessionIdentity",
    actions: ["whoami", "login", "newuser"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tab.localeCompare(b.tab) || a.setting.localeCompare(b.setting))
    .slice(0, 32);
}

export function desktopDisplayEntries(state: ShellSessionState): DesktopDisplayEntry[] {
  return collectDesktopDisplayEntries(state);
}

function addSoundEntry(entries: DesktopSoundEntry[], entry: Omit<DesktopSoundEntry, "id">): void {
  const id = `sound:${entry.tab}:${entry.item}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopSoundEntries(state: ShellSessionState): DesktopSoundEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  const deviceRows = desktopDeviceEntries(state);
  const serviceRows = desktopServiceEntries(state);
  const printRows = desktopPrintEntries(state);
  const entries: DesktopSoundEntry[] = [];
  const soundOn = state.desktopPrefs.sound === "on";
  addSoundEntry(entries, {
    tab: "Volume",
    item: "Master Volume",
    value: soundOn ? "on, simulated speaker enabled" : "muted, no browser audio playback",
    source: "desktopPrefs.sound",
    actions: ["theme pref sound on", "theme pref sound muted"],
  });
  addSoundEntry(entries, {
    tab: "Volume",
    item: "Mute",
    value: soundOn ? "cleared" : "checked",
    source: "desktopPrefs.sound",
    actions: ["theme pref sound muted", "theme pref sound on"],
  });
  addSoundEntry(entries, {
    tab: "Sounds",
    item: "Sound Scheme",
    value: `${systemVersionForTheme(state.desktopTheme)} event beeps`,
    source: "desktopTheme",
    actions: ["theme", "display", "sounds"],
  });
  addSoundEntry(entries, {
    tab: "Sounds",
    item: "Program Events",
    value: `${state.desktopEvents.length} event row(s), ${state.desktopTasks.filter((task) => task.status !== "done").length} queued task alert(s)`,
    source: "desktopEvents",
    actions: ["events", "tasks", "scheduler"],
  });
  addSoundEntry(entries, {
    tab: "Audio",
    item: "Default Device",
    value: `${currentHost(state)} wave mapper (${state.stty})`,
    source: "sessionState",
    actions: ["status", "stty", "devices"],
  });
  addSoundEntry(entries, {
    tab: "Audio",
    item: "Device Health",
    value: `${deviceRows.filter((entry) => entry.category === "Computer" || entry.category === "TTY").length} local device row(s), ${deviceRows.filter((entry) => entry.status === "warning").length} warning(s)`,
    source: "desktopDevices",
    actions: ["devices", "devmgmt"],
  });
  addSoundEntry(entries, {
    tab: "Voice",
    item: "Command Echo",
    value: state.desktopPrefs.keyboardMode === "terminal" ? "terminal-first prompts" : "desktop-first prompts",
    source: "desktopPrefs.keyboardMode",
    actions: ["theme pref keyboard terminal", "theme pref keyboard desktop"],
  });
  addSoundEntry(entries, {
    tab: "Voice",
    item: "Session Alerts",
    value: `mail=${desktopMailEntries(state).length}; print=${printRows.filter((entry) => entry.status !== "ready").length}; service=${serviceRows.filter((entry) => entry.status === "reachable").length}`,
    source: "desktopMail",
    actions: ["mailbox", "printq", "services"],
  });
  addSoundEntry(entries, {
    tab: "Hardware",
    item: "Legacy Mixer",
    value: "MMSYS simulated mixer; browser audio APIs unused",
    source: "shellRuntime",
    actions: ["sounds", "control", "registry"],
  });
  addSoundEntry(entries, {
    tab: "Accessibility",
    item: "Visual Alerts",
    value: `contrast=${state.desktopPrefs.contrast}; motion=${state.desktopPrefs.motion}`,
    source: "desktopPrefs",
    actions: ["theme pref contrast high", "theme pref motion reduced"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tab.localeCompare(b.tab) || a.item.localeCompare(b.item))
    .slice(0, 40);
}

export function desktopSoundEntries(state: ShellSessionState): DesktopSoundEntry[] {
  return collectDesktopSoundEntries(state);
}

function addPowerEntry(entries: DesktopPowerEntry[], entry: Omit<DesktopPowerEntry, "id">): void {
  const id = `power:${entry.scheme}:${entry.setting}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopPowerEntries(state: ShellSessionState): DesktopPowerEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const processRows = desktopProcessEntries(state);
  const scheduleRows = desktopScheduleEntries(state);
  const deviceRows = desktopDeviceEntries(state);
  const networkRows = desktopNetworkEntries(state);
  const entries: DesktopPowerEntry[] = [];
  const queuedTasks = state.desktopTasks.filter((task) => task.status !== "done").length;
  const runningProcesses = processRows.filter((entry) => entry.status === "running" || entry.status === "foreground").length;
  const activeScheme = state.desktopPrefs.motion === "reduced" ? "Minimal Power Management" : "Always On";
  addPowerEntry(entries, {
    scheme: "Power Schemes",
    setting: "Active Scheme",
    value: `${activeScheme} (${systemVersionForTheme(state.desktopTheme)})`,
    source: "desktopPrefs.motion",
    actions: ["theme pref motion reduced", "theme pref motion normal"],
  });
  addPowerEntry(entries, {
    scheme: "Power Schemes",
    setting: "Monitor",
    value: state.desktopPrefs.motion === "reduced" ? "dim animations, keep shell responsive" : "never turn off while session active",
    source: "desktopPrefs.motion",
    actions: ["display", "theme pref motion reduced"],
  });
  addPowerEntry(entries, {
    scheme: "Advanced",
    setting: "Power Buttons",
    value: "session power button stages shell action only",
    source: "desktopWindowState",
    actions: ["desktop", "status"],
  });
  addPowerEntry(entries, {
    scheme: "Advanced",
    setting: "Wake Timers",
    value: `${scheduleRows.filter((entry) => entry.status !== "disabled").length} scheduled task timer(s)`,
    source: "desktopSchedule",
    actions: ["scheduler", "schtasks", "tasks"],
  });
  addPowerEntry(entries, {
    scheme: "Hibernate",
    setting: "Session Resume",
    value: `${state.desktopOpenApps.length} open app(s), ${state.desktopMinimizedApps.length} minimized`,
    source: "desktopWindowState",
    actions: ["desktop", "desktop export"],
  });
  addPowerEntry(entries, {
    scheme: "UPS",
    setting: "Line Status",
    value: `${currentHost(state)} virtual mains; ${networkRows.length} reachable node(s)`,
    source: "desktopNetwork",
    actions: ["network", "nodes", "status"],
  });
  addPowerEntry(entries, {
    scheme: "UPS",
    setting: "Battery",
    value: "not enumerated; browser battery APIs unused",
    source: "shellRuntime",
    actions: ["power", "control", "devices"],
  });
  addPowerEntry(entries, {
    scheme: "Timers",
    setting: "Queued Jobs",
    value: `${queuedTasks} pending maintenance or transfer job(s)`,
    source: "desktopTasks",
    actions: ["tasks", "taskmgr", "scheduler"],
  });
  addPowerEntry(entries, {
    scheme: "Timers",
    setting: "Foreground Load",
    value: `${runningProcesses} foreground/running shell process row(s)`,
    source: "desktopProcesses",
    actions: ["taskmgr", "ps"],
  });
  addPowerEntry(entries, {
    scheme: "Hardware",
    setting: "ACPI Driver",
    value: `${deviceRows.filter((entry) => entry.category === "Computer").length} simulated computer device row(s)`,
    source: "desktopDevices",
    actions: ["devices", "devmgmt"],
  });
  addPowerEntry(entries, {
    scheme: "Activity",
    setting: "Last Event",
    value: state.desktopEvents.at(-1)?.message ?? "no desktop event rows",
    source: "desktopEvents",
    actions: ["events", "logs"],
  });
  addPowerEntry(entries, {
    scheme: "Activity",
    setting: "Idle Policy",
    value: state.desktopPrefs.keyboardMode === "terminal" ? "terminal input priority" : "desktop shortcut priority",
    source: "desktopPrefs.keyboardMode",
    actions: ["theme pref keyboard terminal", "theme pref keyboard desktop"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.scheme.localeCompare(b.scheme) || a.setting.localeCompare(b.setting))
    .slice(0, 40);
}

export function desktopPowerEntries(state: ShellSessionState): DesktopPowerEntry[] {
  return collectDesktopPowerEntries(state);
}

function addMouseEntry(entries: DesktopMouseEntry[], entry: Omit<DesktopMouseEntry, "id">): void {
  const id = `mouse:${entry.tab}:${entry.setting}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopMouseEntries(state: ShellSessionState): DesktopMouseEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const deviceRows = desktopDeviceEntries(state);
  const processRows = desktopProcessEntries(state);
  const entries: DesktopMouseEntry[] = [];
  const pointerScheme = state.desktopTheme === "7" ? "Aero pointer set" : state.desktopTheme === "xp" ? "Windows XP pointer set" : `${state.desktopTheme.toUpperCase()} classic pointer set`;
  addMouseEntry(entries, {
    tab: "Buttons",
    setting: "Button Configuration",
    value: state.desktopPrefs.keyboardMode === "terminal" ? "right-handed, terminal focus priority" : "right-handed, desktop focus priority",
    source: "desktopPrefs.keyboardMode",
    actions: ["theme pref keyboard desktop", "theme pref keyboard terminal"],
  });
  addMouseEntry(entries, {
    tab: "Buttons",
    setting: "Double-click Speed",
    value: state.desktopPrefs.motion === "reduced" ? "slow, reduced-motion safe" : "normal shell cadence",
    source: "desktopPrefs.motion",
    actions: ["theme pref motion reduced", "theme pref motion normal"],
  });
  addMouseEntry(entries, {
    tab: "Pointers",
    setting: "Pointer Scheme",
    value: pointerScheme,
    source: "desktopTheme",
    actions: ["theme", "display", "mouse"],
  });
  addMouseEntry(entries, {
    tab: "Pointers",
    setting: "Pointer Shadow",
    value: state.desktopPrefs.contrast === "high" ? "disabled for high contrast" : "simulated period shadow",
    source: "desktopPrefs.contrast",
    actions: ["theme pref contrast high", "display"],
  });
  addMouseEntry(entries, {
    tab: "Motion",
    setting: "Pointer Speed",
    value: `${state.desktopOpenApps.length} open window(s), ${state.desktopMinimizedApps.length} minimized`,
    source: "desktopWindowState",
    actions: ["desktop", "desktop export"],
  });
  addMouseEntry(entries, {
    tab: "Motion",
    setting: "Snap To",
    value: `${processRows.filter((entry) => entry.status === "foreground").length} foreground shell process row(s)`,
    source: "desktopProcesses",
    actions: ["taskmgr", "ps"],
  });
  addMouseEntry(entries, {
    tab: "Wheel",
    setting: "Scroll Lines",
    value: state.stty === "dumb" ? "plain text paging" : "terminal scrollback and pager aware",
    source: "stty",
    actions: ["stty", "help pager"],
  });
  addMouseEntry(entries, {
    tab: "Hardware",
    setting: "Pointing Device",
    value: `${deviceRows.filter((entry) => entry.category === "TTY" || entry.category === "Computer").length} local input device row(s)`,
    source: "desktopDevices",
    actions: ["devices", "devmgmt"],
  });
  addMouseEntry(entries, {
    tab: "Hardware",
    setting: "Browser Pointer",
    value: "not enumerated; browser pointer APIs unused",
    source: "shellRuntime",
    actions: ["mouse", "control", "devices"],
  });
  addMouseEntry(entries, {
    tab: "Activity",
    setting: "Last Event",
    value: state.desktopEvents.at(-1)?.message ?? "no desktop event rows",
    source: "desktopEvents",
    actions: ["events", "logs"],
  });
  addMouseEntry(entries, {
    tab: "Activity",
    setting: "Queued Gesture",
    value: `${state.desktopTasks.filter((task) => task.status !== "done").length} queued task row(s)`,
    source: "desktopTasks",
    actions: ["tasks", "scheduler"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tab.localeCompare(b.tab) || a.setting.localeCompare(b.setting))
    .slice(0, 40);
}

export function desktopMouseEntries(state: ShellSessionState): DesktopMouseEntry[] {
  return collectDesktopMouseEntries(state);
}

function addKeyboardEntry(entries: DesktopKeyboardEntry[], entry: Omit<DesktopKeyboardEntry, "id">): void {
  const id = `keyboard:${entry.tab}:${entry.setting}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopKeyboardEntries(state: ShellSessionState): DesktopKeyboardEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const deviceRows = desktopDeviceEntries(state);
  const processRows = desktopProcessEntries(state);
  const entries: DesktopKeyboardEntry[] = [];
  addKeyboardEntry(entries, {
    tab: "Speed",
    setting: "Repeat Delay",
    value: state.desktopPrefs.keyboardMode === "terminal" ? "longer delay for command editing" : "short delay for desktop shortcuts",
    source: "desktopPrefs.keyboardMode",
    actions: ["theme pref keyboard terminal", "theme pref keyboard desktop"],
  });
  addKeyboardEntry(entries, {
    tab: "Speed",
    setting: "Repeat Rate",
    value: state.desktopPrefs.motion === "reduced" ? "steady, reduced-motion safe" : "normal shell repeat cadence",
    source: "desktopPrefs.motion",
    actions: ["theme pref motion reduced", "theme pref motion normal"],
  });
  addKeyboardEntry(entries, {
    tab: "Input",
    setting: "Shortcut Priority",
    value: state.desktopPrefs.keyboardMode === "terminal" ? "terminal receives global chords first" : "desktop receives global chords first",
    source: "desktopPrefs.keyboardMode",
    actions: ["theme pref keyboard terminal", "theme pref keyboard desktop"],
  });
  addKeyboardEntry(entries, {
    tab: "Input",
    setting: "Terminal Mode",
    value: `stty=${state.stty}; shell=${state.shellMode}; tty=${state.ttyPort}`,
    source: "sessionState",
    actions: ["stty", "status", "desktop"],
  });
  addKeyboardEntry(entries, {
    tab: "Layout",
    setting: "Input Locale",
    value: `${systemVersionForTheme(state.desktopTheme)} US keyboard layout`,
    source: "desktopTheme",
    actions: ["theme", "display", "keyboard"],
  });
  addKeyboardEntry(entries, {
    tab: "Layout",
    setting: "Command History",
    value: `${state.commandHistory.length} bounded backend command row(s)`,
    source: "commandHistory",
    actions: ["history", "logs"],
  });
  addKeyboardEntry(entries, {
    tab: "Hardware",
    setting: "Keyboard Device",
    value: `${deviceRows.filter((entry) => entry.category === "TTY" || entry.category === "Computer").length} simulated input device row(s)`,
    source: "desktopDevices",
    actions: ["devices", "devmgmt"],
  });
  addKeyboardEntry(entries, {
    tab: "Hardware",
    setting: "Browser Keys",
    value: "not captured; browser key events are input plumbing only",
    source: "shellRuntime",
    actions: ["keyboard", "control", "help"],
  });
  addKeyboardEntry(entries, {
    tab: "Activity",
    setting: "Foreground Process",
    value: processRows.find((entry) => entry.status === "foreground")?.command ?? "nli",
    source: "desktopProcesses",
    actions: ["taskmgr", "ps"],
  });
  addKeyboardEntry(entries, {
    tab: "Activity",
    setting: "Queued Task",
    value: `${state.desktopTasks.filter((task) => task.status !== "done").length} queued task row(s)`,
    source: "desktopTasks",
    actions: ["tasks", "scheduler"],
  });
  addKeyboardEntry(entries, {
    tab: "Activity",
    setting: "Last Event",
    value: state.desktopEvents.at(-1)?.message ?? "no desktop event rows",
    source: "desktopEvents",
    actions: ["events", "logs"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tab.localeCompare(b.tab) || a.setting.localeCompare(b.setting))
    .slice(0, 40);
}

export function desktopKeyboardEntries(state: ShellSessionState): DesktopKeyboardEntry[] {
  return collectDesktopKeyboardEntries(state);
}

function addAccessibilityEntry(entries: DesktopAccessibilityEntry[], entry: Omit<DesktopAccessibilityEntry, "id">): void {
  const id = `accessibility:${entry.tab}:${entry.option}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopAccessibilityEntries(state: ShellSessionState): DesktopAccessibilityEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  const displayRows = desktopDisplayEntries(state);
  const soundRows = desktopSoundEntries(state);
  const mouseRows = desktopMouseEntries(state);
  const keyboardRows = desktopKeyboardEntries(state);
  const deviceRows = desktopDeviceEntries(state);
  const processRows = desktopProcessEntries(state);
  const entries: DesktopAccessibilityEntry[] = [];
  const queuedTasks = state.desktopTasks.filter((task) => task.status !== "done").length;
  addAccessibilityEntry(entries, {
    tab: "Keyboard",
    option: "StickyKeys",
    value: state.desktopPrefs.keyboardMode === "terminal" ? "terminal shortcut priority" : "desktop shortcut priority",
    source: "desktopPrefs.keyboardMode",
    actions: ["theme pref keyboard terminal", "theme pref keyboard desktop", "keyboard"],
  });
  addAccessibilityEntry(entries, {
    tab: "Keyboard",
    option: "FilterKeys",
    value: state.desktopPrefs.motion === "reduced" ? "reduced-motion cadence" : "normal command cadence",
    source: "desktopPrefs.motion",
    actions: ["theme pref motion reduced", "theme pref motion normal"],
  });
  addAccessibilityEntry(entries, {
    tab: "Keyboard",
    option: "Repeat Settings",
    value: keyboardRows.filter((entry) => entry.tab === "Speed").slice(0, 2).map((entry) => `${entry.setting}:${entry.value}`).join(", ") || "default repeat rows",
    source: "desktopKeyboard",
    actions: ["keyboard", "kbd.cpl"],
  });
  addAccessibilityEntry(entries, {
    tab: "Sound",
    option: "SoundSentry",
    value: state.desktopPrefs.sound === "on" ? "audio cues available, visual cues retained" : "visual cues only, sound muted",
    source: "desktopPrefs.sound",
    actions: ["theme pref sound on", "theme pref sound muted", "sounds"],
  });
  addAccessibilityEntry(entries, {
    tab: "Sound",
    option: "ShowSounds",
    value: soundRows.find((entry) => entry.item === "Visual Alerts")?.value ?? `contrast=${state.desktopPrefs.contrast}; motion=${state.desktopPrefs.motion}`,
    source: "desktopSounds",
    actions: ["sounds", "mmsys.cpl", "display"],
  });
  addAccessibilityEntry(entries, {
    tab: "Display",
    option: "High Contrast",
    value: state.desktopPrefs.contrast === "high" ? "enabled in shell preferences" : "normal contrast shell",
    source: "desktopPrefs.contrast",
    actions: ["theme pref contrast high", "theme pref contrast normal", "display"],
  });
  addAccessibilityEntry(entries, {
    tab: "Display",
    option: "Cursor and Fonts",
    value: `font=${state.desktopPrefs.fontSize}; ${displayRows.find((entry) => entry.setting === "Animation")?.value ?? state.desktopPrefs.motion}`,
    source: "desktopDisplay",
    actions: ["theme pref font large", "theme pref motion reduced", "display"],
  });
  addAccessibilityEntry(entries, {
    tab: "Mouse",
    option: "MouseKeys",
    value: mouseRows.find((entry) => entry.setting === "Button Configuration")?.value ?? "desktop focus priority",
    source: "desktopMouse",
    actions: ["mouse", "main.cpl", "theme pref keyboard desktop"],
  });
  addAccessibilityEntry(entries, {
    tab: "Mouse",
    option: "Pointer Visibility",
    value: mouseRows.find((entry) => entry.setting === "Pointer Shadow")?.value ?? "simulated period pointer",
    source: "desktopMouse",
    actions: ["mouse", "display"],
  });
  addAccessibilityEntry(entries, {
    tab: "General",
    option: "SerialKeys",
    value: `${state.stty} terminal mode on tty ${state.ttyPort}`,
    source: "sessionState",
    actions: ["stty", "status", "desktop"],
  });
  addAccessibilityEntry(entries, {
    tab: "General",
    option: "Timeout",
    value: `${state.desktopOpenApps.length} open app(s), ${queuedTasks} queued task(s), ${processRows.filter((entry) => entry.status === "foreground").length} foreground process row(s)`,
    source: "desktopWindowState",
    actions: ["desktop", "tasks", "taskmgr"],
  });
  addAccessibilityEntry(entries, {
    tab: "General",
    option: "Screen Reader",
    value: "not detected; browser accessibility APIs unused",
    source: "shellRuntime",
    actions: ["accessibility", "help", "settings"],
  });
  addAccessibilityEntry(entries, {
    tab: "Hardware",
    option: "Input Devices",
    value: `${deviceRows.filter((entry) => entry.category === "TTY" || entry.category === "Computer").length} simulated input device row(s)`,
    source: "desktopDevices",
    actions: ["devices", "devmgmt"],
  });
  addAccessibilityEntry(entries, {
    tab: "Activity",
    option: "Last Event",
    value: state.desktopEvents.at(-1)?.message ?? "no desktop event rows",
    source: "desktopEvents",
    actions: ["events", "logs"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tab.localeCompare(b.tab) || a.option.localeCompare(b.option))
    .slice(0, 40);
}

export function desktopAccessibilityEntries(state: ShellSessionState): DesktopAccessibilityEntry[] {
  return collectDesktopAccessibilityEntries(state);
}

function addRegionalEntry(entries: DesktopRegionalEntry[], entry: Omit<DesktopRegionalEntry, "id">): void {
  const id = `regional:${entry.tab}:${entry.setting}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopRegionalEntries(state: ShellSessionState): DesktopRegionalEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  const timeRows = desktopTimeEntries(state);
  const fileRows = desktopFileEntries(state);
  const mailRows = desktopMailEntries(state);
  const boardRows = desktopBoardEntries(state);
  const keyboardRows = desktopKeyboardEntries(state);
  const entries: DesktopRegionalEntry[] = [];
  addRegionalEntry(entries, {
    tab: "Regional",
    setting: "Standards",
    value: `${systemVersionForTheme(state.desktopTheme)} workstation defaults`,
    source: "desktopTheme",
    actions: ["theme", "display", "regional"],
  });
  addRegionalEntry(entries, {
    tab: "Regional",
    setting: "Location",
    value: `${currentHost(state)} local shell context`,
    source: "sessionState",
    actions: ["status", "nodes", "network"],
  });
  addRegionalEntry(entries, {
    tab: "Formats",
    setting: "Date Sample",
    value: timeRows.find((entry) => entry.name === "Server Date")?.value ?? new Date().toISOString().slice(0, 10),
    source: "desktopTime",
    actions: ["datetime", "timedate.cpl", "date"],
  });
  addRegionalEntry(entries, {
    tab: "Formats",
    setting: "Time Sample",
    value: timeRows.find((entry) => entry.name === "Server Time")?.value ?? new Date().toISOString().slice(11, 19),
    source: "desktopTime",
    actions: ["datetime", "clock", "when"],
  });
  addRegionalEntry(entries, {
    tab: "Numbers",
    setting: "Digit Grouping",
    value: `${fileRows.length} file row(s), ${state.commandHistory.length} command row(s)`,
    source: "desktopFiles",
    actions: ["files", "history"],
  });
  addRegionalEntry(entries, {
    tab: "Numbers",
    setting: "Measurement",
    value: `${Object.keys(state.downloads ?? {}).length} download(s), ${state.desktopTasks.filter((task) => task.status !== "done").length} queued task(s)`,
    source: "sessionState",
    actions: ["files", "tasks", "desktop export"],
  });
  addRegionalEntry(entries, {
    tab: "Languages",
    setting: "Input Language",
    value: keyboardRows.find((entry) => entry.setting === "Input Locale")?.value ?? "US keyboard layout",
    source: "desktopKeyboard",
    actions: ["keyboard", "kbd.cpl"],
  });
  addRegionalEntry(entries, {
    tab: "Languages",
    setting: "Text Services",
    value: `${mailRows.length} mail row(s), ${boardRows.length} board row(s) in backend text stores`,
    source: "desktopMail",
    actions: ["mailbox", "boards", "regional"],
  });
  addRegionalEntry(entries, {
    tab: "Advanced",
    setting: "Code Page",
    value: state.stty === "dumb" ? "plain ASCII terminal fallback" : "period shell text mode",
    source: "stty",
    actions: ["stty", "help"],
  });
  addRegionalEntry(entries, {
    tab: "Advanced",
    setting: "Browser Locale",
    value: "not read; browser locale APIs unused",
    source: "shellRuntime",
    actions: ["regional", "control", "datetime"],
  });
  addRegionalEntry(entries, {
    tab: "Activity",
    setting: "Last Event",
    value: state.desktopEvents.at(-1)?.message ?? "no desktop event rows",
    source: "desktopEvents",
    actions: ["events", "logs"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tab.localeCompare(b.tab) || a.setting.localeCompare(b.setting))
    .slice(0, 40);
}

export function desktopRegionalEntries(state: ShellSessionState): DesktopRegionalEntry[] {
  return collectDesktopRegionalEntries(state);
}

function addOdbcEntry(entries: DesktopOdbcEntry[], entry: Omit<DesktopOdbcEntry, "id">): void {
  const id = `odbc:${entry.tab}:${entry.name}:${entry.driver}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopOdbcEntries(state: ShellSessionState): DesktopOdbcEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const serviceRows = desktopServiceEntries(state);
  const fileRows = desktopFileEntries(state);
  const registryRows = desktopRegistryEntries(state);
  const programRows = desktopProgramEntries(state);
  const networkRows = desktopNetworkEntries(state);
  const shareRows = desktopShareEntries(state);
  const entries: DesktopOdbcEntry[] = [];
  addOdbcEntry(entries, {
    tab: "User DSN",
    name: "LocalShell",
    driver: "Text/CSV",
    value: `${fileRows.filter((entry) => entry.kind === "home").length} home file row(s), cwd=${state.cwd}`,
    source: "desktopFiles",
    actions: ["files", "pwd", "write <file> <text>"],
  });
  addOdbcEntry(entries, {
    tab: "User DSN",
    name: "BoardsArchive",
    driver: "MessageBase",
    value: `${desktopBoardEntries(state).length} board/article row(s), backend text store`,
    source: "desktopBoards",
    actions: ["boards", "bbs", "news"],
  });
  addOdbcEntry(entries, {
    tab: "System DSN",
    name: "HostServices",
    driver: "Winsock",
    value: `${serviceRows.length} service row(s), ${serviceRows.filter((entry) => entry.status !== "restricted").length} reachable`,
    source: "desktopServices",
    actions: ["services", "netstat", "inspect"],
  });
  addOdbcEntry(entries, {
    tab: "System DSN",
    name: "NetworkPlaces",
    driver: "UUCP Route",
    value: `${networkRows.length} visible host row(s), ${state.desktopBookmarks.length} bookmark row(s)`,
    source: "desktopNetwork",
    actions: ["network", "nodes", "bookmarks"],
  });
  addOdbcEntry(entries, {
    tab: "File DSN",
    name: "SharedFolders",
    driver: "Jet 4.0",
    value: `${shareRows.length} share row(s), ${shareRows.filter((entry) => entry.writable).length} writable`,
    source: "desktopShares",
    actions: ["shares", "files", "cd"],
  });
  addOdbcEntry(entries, {
    tab: "File DSN",
    name: "Downloads",
    driver: "dBase",
    value: `${Object.keys(state.downloads ?? {}).length} downloaded file row(s)`,
    source: "downloads",
    actions: ["files", "ftp <host>", "programs download"],
  });
  addOdbcEntry(entries, {
    tab: "Drivers",
    name: "Installed Drivers",
    driver: "ODBC Core",
    value: programRows.filter((entry) => entry.category === "Protocol" || entry.category === "Tools").slice(0, 5).map((entry) => entry.name).join(", ") || "Cyberscape Command Shell",
    source: "desktopPrograms",
    actions: ["programs", "appwiz.cpl", "help"],
  });
  addOdbcEntry(entries, {
    tab: "Tracing",
    name: "Trace Log",
    driver: "odbctrac.dll",
    value: state.desktopEvents.at(-1)?.message ?? "trace disabled; no event rows",
    source: "desktopEvents",
    actions: ["events", "logs", "task"],
  });
  addOdbcEntry(entries, {
    tab: "Connection Pooling",
    name: "Pool State",
    driver: "oledb32.dll",
    value: `${state.desktopTasks.filter((task) => task.status !== "done").length} queued task row(s), ${state.commandHistory.length} command row(s)`,
    source: "desktopTasks",
    actions: ["tasks", "taskmgr", "history"],
  });
  addOdbcEntry(entries, {
    tab: "About",
    name: "Registry Source",
    driver: "odbcad32",
    value: `${registryRows.filter((entry) => entry.key.includes("Control Panel") || entry.key.includes("Software")).length} registry-style setting row(s)`,
    source: "desktopRegistry",
    actions: ["registry", "reg query", "control"],
  });
  addOdbcEntry(entries, {
    tab: "About",
    name: "Browser Storage",
    driver: "none",
    value: "not enumerated; browser databases and storage APIs unused",
    source: "shellRuntime",
    actions: ["odbc", "help", "settings"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tab.localeCompare(b.tab) || a.name.localeCompare(b.name))
    .slice(0, 48);
}

export function desktopOdbcEntries(state: ShellSessionState): DesktopOdbcEntry[] {
  return collectDesktopOdbcEntries(state);
}

function addProgramEntry(entries: DesktopProgramEntry[], entry: Omit<DesktopProgramEntry, "id">): void {
  const id = `program:${entry.category}:${entry.name}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    version: entry.version.replace(/\s+/g, " ").slice(0, 48),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopProgramEntries(state: ShellSessionState): DesktopProgramEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  const entries: DesktopProgramEntry[] = [];
  addProgramEntry(entries, {
    category: "Shell",
    name: "Cyberscape Command Shell",
    version: systemVersionForTheme(state.desktopTheme),
    status: "installed",
    source: "shellCore",
    actions: ["help", "commands", "desktop terminal"],
  });
  addProgramEntry(entries, {
    category: "Shell",
    name: "Desktop Control Pack",
    version: `${DESKTOP_APPS.length} applets`,
    status: "installed",
    source: "desktopApps",
    actions: ["control", "desktop", "settings"],
  });
  addProgramEntry(entries, {
    category: "Protocol",
    name: "Telnet/Rlogin/SSH Client",
    version: `${desktopNetworkEntries(state).length} visible host(s)`,
    status: "installed",
    source: "desktopNetwork",
    actions: ["telnet <host>", "ssh <host>", "rlogin <host>"],
  });
  addProgramEntry(entries, {
    category: "Protocol",
    name: "FTP Client",
    version: `${Object.keys(state.downloads ?? {}).length} download(s)`,
    status: "installed",
    source: "downloads",
    actions: ["ftp <host>", "get <file>", "files"],
  });
  addProgramEntry(entries, {
    category: "Protocol",
    name: "Gopher Reader",
    version: "menu/selector",
    status: "installed",
    source: "command:gopher",
    actions: ["gopher <host>", "gopher"],
  });
  addProgramEntry(entries, {
    category: "Protocol",
    name: "Mail, News, IRC",
    version: `${desktopMailEntries(state).length} mail, ${desktopBoardEntries(state).length} board row(s)`,
    status: "installed",
    source: "desktopContent",
    actions: ["mail", "news", "irc", "boards"],
  });
  addProgramEntry(entries, {
    category: "Games",
    name: "Interactive Fiction Shelf",
    version: "advent/zork/zcode",
    status: "available",
    source: "gameShelf",
    actions: ["games", "zork", "advent", "run <game>"],
  });
  addProgramEntry(entries, {
    category: "Games",
    name: "Terminal Toys",
    version: "2048/aquarium/rain",
    status: "available",
    source: "toyCommands",
    actions: ["2048", "aquarium", "rain", "typespeed"],
  });
  addProgramEntry(entries, {
    category: "Tools",
    name: "TeleBASIC",
    version: `${Object.keys(state.basicUserPrograms ?? {}).length} saved program(s)`,
    status: "installed",
    source: "basicUserPrograms",
    actions: ["basic", "catalog", "run"],
  });
  addProgramEntry(entries, {
    category: "Tools",
    name: "Route Operations",
    version: `${state.loginHosts.length} login, ${state.rootHosts.length} root`,
    status: state.loggedIn ? "installed" : "available",
    source: "progressionState",
    actions: ["wardial", "porthack", "rootkit", "owned"],
  });
  for (const task of state.desktopTasks.filter((item) => item.status !== "done").slice(0, 6)) {
    addProgramEntry(entries, {
      category: "Task",
      name: `${task.kind}:${task.target}`,
      version: task.label,
      status: "queued",
      source: "desktopTasks",
      actions: ["tasks", `task done ${task.id}`, `task ${task.kind} ${task.target}`],
    });
  }
  for (const [name, content] of Object.entries(state.downloads ?? {}).slice(0, 8)) {
    addProgramEntry(entries, {
      category: "Download",
      name,
      version: `${content.length} bytes`,
      status: "downloaded",
      source: "downloads",
      actions: ["files", `cat ${name}`, "shares"],
    });
  }
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
    .slice(0, 48);
}

export function desktopProgramEntries(state: ShellSessionState): DesktopProgramEntry[] {
  return collectDesktopProgramEntries(state);
}

function addInternetEntry(entries: DesktopInternetEntry[], entry: Omit<DesktopInternetEntry, "id">): void {
  const id = `inet:${entry.tab}:${entry.zone}:${entry.setting}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopInternetEntries(state: ShellSessionState): DesktopInternetEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  const networkRows = desktopNetworkEntries(state);
  const serviceRows = desktopServiceEntries(state);
  const securityRows = desktopSecurityEntries(state);
  const fileRows = desktopFileEntries(state);
  const entries: DesktopInternetEntry[] = [];
  addInternetEntry(entries, {
    tab: "General",
    zone: "Home Page",
    setting: "Start Page",
    value: `${currentHost(state)}://${state.cwd}`,
    source: "session",
    actions: ["status", "pwd", "files"],
  });
  addInternetEntry(entries, {
    tab: "General",
    zone: "Cache",
    setting: "Temporary Files",
    value: `${fileRows.length} visible item(s), ${Object.keys(state.downloads ?? {}).length} download(s)`,
    source: "desktopFiles",
    actions: ["files", "shares", "ftp"],
  });
  addInternetEntry(entries, {
    tab: "Security",
    zone: "Local Intranet",
    setting: "Visible Hosts",
    value: `${networkRows.filter((entry) => entry.access !== "public").length} trusted, ${networkRows.length} total`,
    source: "desktopNetwork",
    actions: ["network", "nodes", "trace <host>"],
  });
  addInternetEntry(entries, {
    tab: "Security",
    zone: "Restricted",
    setting: "Exposed Services",
    value: `${securityRows.filter((entry) => entry.posture === "exposed").length} exposed posture row(s)`,
    source: "desktopSecurity",
    actions: ["security", "inspect", "services"],
  });
  addInternetEntry(entries, {
    tab: "Privacy",
    zone: "Cookies",
    setting: "Remembered Sites",
    value: `${state.desktopBookmarks.length} bookmark(s), browser storage unused`,
    source: "desktopBookmarks",
    actions: ["bookmarks", "bookmark route <host>"],
  });
  addInternetEntry(entries, {
    tab: "Content",
    zone: "Protocols",
    setting: "Enabled Readers",
    value: ["ftp", "gopher", "news", "mail", "irc"].join(", "),
    source: "commands",
    actions: ["ftp <host>", "gopher <host>", "news", "mail <host>"],
  });
  addInternetEntry(entries, {
    tab: "Connections",
    zone: "Dial-Up",
    setting: "Route Links",
    value: `${desktopDialupEntries(state).length} connection row(s)`,
    source: "desktopDialup",
    actions: ["dialup", "trace <host>", "telnet <host>"],
  });
  addInternetEntry(entries, {
    tab: "Connections",
    zone: "LAN",
    setting: "Service Ports",
    value: `${serviceRows.filter((entry) => entry.name === "HTTP" || entry.name === "Gopher" || entry.name === "NNTP").length} web-era service row(s)`,
    source: "desktopServices",
    actions: ["services http", "services gopher", "services nntp"],
  });
  addInternetEntry(entries, {
    tab: "Advanced",
    zone: "Accessibility",
    setting: "Motion",
    value: `${state.desktopPrefs.motion}; contrast=${state.desktopPrefs.contrast}; font=${state.desktopPrefs.fontSize}`,
    source: "desktopPrefs",
    actions: ["theme pref", "desktop settings"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tab.localeCompare(b.tab) || a.zone.localeCompare(b.zone) || a.setting.localeCompare(b.setting))
    .slice(0, 48);
}

export function desktopInternetEntries(state: ShellSessionState): DesktopInternetEntry[] {
  return collectDesktopInternetEntries(state);
}

function addFolderEntry(entries: DesktopFolderEntry[], entry: Omit<DesktopFolderEntry, "id">): void {
  const id = `folders:${entry.tab}:${entry.option}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function extensionForName(name: string): string {
  const match = /\.([a-z0-9_-]{1,12})$/i.exec(name);
  return match ? match[1].toLowerCase() : "(none)";
}

function collectDesktopFolderEntries(state: ShellSessionState): DesktopFolderEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  const fileRows = desktopFileEntries(state);
  const shareRows = desktopShareEntries(state);
  const downloadCount = Object.keys(state.downloads ?? {}).length;
  const homeCount = fileRows.filter((entry) => entry.kind === "home").length;
  const hostCount = fileRows.filter((entry) => entry.kind === "host").length;
  const extensionCounts = new Map<string, number>();
  for (const file of fileRows) {
    const extension = extensionForName(file.name);
    extensionCounts.set(extension, (extensionCounts.get(extension) ?? 0) + 1);
  }
  const extensionText = [...extensionCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)
    .map(([extension, count]) => `${extension}:${count}`)
    .join(", ") || "none";
  const entries: DesktopFolderEntry[] = [];
  addFolderEntry(entries, {
    tab: "General",
    option: "Open Items",
    value: `desktop app=${state.desktopActiveApp}; cwd=${state.cwd}`,
    source: "desktopActiveApp",
    actions: ["desktop files", "files", "pwd"],
  });
  addFolderEntry(entries, {
    tab: "General",
    option: "Click Behavior",
    value: "commands required for mutations; window buttons stage commands",
    source: "commandBoundary",
    actions: ["desktop", "help", "files"],
  });
  addFolderEntry(entries, {
    tab: "View",
    option: "Hidden Files",
    value: `backend-visible rows only; host=${hostCount}, home=${homeCount}, downloads=${downloadCount}`,
    source: "desktopFiles",
    actions: ["files", "shares", "registry"],
  });
  addFolderEntry(entries, {
    tab: "View",
    option: "Known Extensions",
    value: extensionText,
    source: "desktopFiles",
    actions: ["files", "cat <file>"],
  });
  addFolderEntry(entries, {
    tab: "View",
    option: "Protected Files",
    value: "system artifacts summarized through registry, logs, and service panels",
    source: "desktopRegistry",
    actions: ["registry", "logs", "services"],
  });
  addFolderEntry(entries, {
    tab: "File Types",
    option: "Registered Types",
    value: `${extensionCounts.size} extension bucket(s), ${fileRows.length} visible file row(s)`,
    source: "desktopFiles",
    actions: ["files", "programs"],
  });
  addFolderEntry(entries, {
    tab: "Offline Files",
    option: "Local Cache",
    value: `${downloadCount} download(s), ${homeCount} home file(s)`,
    source: "downloads",
    actions: ["files", "ftp", "shares"],
  });
  addFolderEntry(entries, {
    tab: "Offline Files",
    option: "Shared Folders",
    value: `${shareRows.length} share row(s), ${shareRows.filter((entry) => entry.writable).length} writable`,
    source: "desktopShares",
    actions: ["shares", "network", "files"],
  });
  addFolderEntry(entries, {
    tab: "Search",
    option: "Recent Queries",
    value: state.commandHistory.slice(-3).map((entry) => entry.line).join(" | ") || "none",
    source: "commandHistory",
    actions: ["history", "find", "grep"],
  });
  addFolderEntry(entries, {
    tab: "Search",
    option: "Saved Places",
    value: `${state.desktopBookmarks.length} bookmark(s) available`,
    source: "desktopBookmarks",
    actions: ["bookmarks", "bookmark route <host>"],
  });
  addFolderEntry(entries, {
    tab: "Accessibility",
    option: "Explorer View",
    value: `font=${state.desktopPrefs.fontSize}; contrast=${state.desktopPrefs.contrast}; motion=${state.desktopPrefs.motion}`,
    source: "desktopPrefs",
    actions: ["theme pref", "display accessibility"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tab.localeCompare(b.tab) || a.option.localeCompare(b.option))
    .slice(0, 40);
}

export function desktopFolderEntries(state: ShellSessionState): DesktopFolderEntry[] {
  return collectDesktopFolderEntries(state);
}

function nodeRoleForHost(state: ShellSessionState, hostname: string): DesktopNodeEntry["role"] {
  if (hostname.toLowerCase() === currentHost(state).toLowerCase()) return "current";
  if (hostname.toLowerCase() === state.homeHost.toLowerCase()) return "home";
  if (state.rootHosts.includes(hostname)) return "root";
  return "login";
}

function collectDesktopNodeEntries(state: ShellSessionState): DesktopNodeEntry[] {
  const names = new Set<string>([currentHost(state), state.homeHost]);
  for (const host of [...state.loginHosts, ...state.rootHosts]) names.add(host);
  return [...names]
    .map((name): DesktopNodeEntry | null => {
      const host = getHost(name);
      if (!host) return null;
      const route = findUucpRoute(currentHost(state), host.hostname) ?? (host.hostname === currentHost(state) ? [host.hostname] : []);
      return {
        id: `node:${host.hostname}`,
        host: host.hostname,
        org: host.org,
        location: host.location,
        role: nodeRoleForHost(state, host.hostname),
        access: networkAccessLevel(state, host.hostname),
        route,
        ports: host.ports.slice(0, 8),
      };
    })
    .filter((entry): entry is DesktopNodeEntry => Boolean(entry))
    .sort((a, b) => {
      const rank = (entry: DesktopNodeEntry) => entry.role === "current" ? 0 : entry.role === "home" ? 1 : entry.role === "root" ? 2 : 3;
      return rank(a) - rank(b) || a.host.localeCompare(b.host);
    });
}

export function desktopNodeEntries(state: ShellSessionState): DesktopNodeEntry[] {
  return collectDesktopNodeEntries(state).slice(0, 32);
}

function postureForHost(state: ShellSessionState, hostname: string, owner: string | null): DesktopSecurityEntry["posture"] {
  if (hostname.toLowerCase() === currentHost(state).toLowerCase()) return "local";
  if (state.rootHosts.includes(hostname) && (!owner || owner === state.username)) return "controlled";
  if (state.campHost?.toLowerCase() === hostname.toLowerCase() || state.tunnel?.from === hostname || state.tunnel?.to === hostname) return "watched";
  if (state.loginHosts.includes(hostname) || owner) return "exposed";
  return "unknown";
}

function securityChecksForHost(state: ShellSessionState, hostname: string, ports: number[], owner: string | null): string[] {
  const checks: string[] = [];
  if (state.rootHosts.includes(hostname)) checks.push("root credential present");
  else if (state.loginHosts.includes(hostname)) checks.push("login shell present");
  if (owner && owner !== state.username) checks.push("foreign root owner recorded");
  if (ports.some((port) => port === 21 || port === 23 || port === 80)) checks.push("legacy service exposed");
  if (state.campHost?.toLowerCase() === hostname.toLowerCase()) checks.push("local watcher active");
  if (state.tunnel?.from === hostname || state.tunnel?.to === hostname) checks.push("tunnel endpoint visible");
  return checks.slice(0, 5);
}

function securityActionsForHost(state: ShellSessionState, hostname: string, posture: DesktopSecurityEntry["posture"]): string[] {
  if (posture === "controlled") return [`inspect ${hostname}`, "task maint " + hostname, "events audit"];
  if (state.loginHosts.includes(hostname)) return [`telnet ${hostname}`, "secure", `task maint ${hostname}`];
  if (hostname.toLowerCase() === currentHost(state).toLowerCase()) return ["inspect", "ps", "secure"];
  return [`trace ${hostname}`, `task scan ${hostname}`, `bookmark add ${hostname}`];
}

function collectDesktopSecurityEntries(state: ShellSessionState): DesktopSecurityEntry[] {
  const names = new Set<string>([currentHost(state), state.homeHost]);
  for (const host of [...state.loginHosts, ...state.rootHosts]) names.add(host);
  if (state.campHost) names.add(state.campHost);
  if (state.tunnel) {
    names.add(state.tunnel.from);
    names.add(state.tunnel.to);
  }
  return [...names]
    .map((name): DesktopSecurityEntry | null => {
      const host = getHost(name);
      if (!host) return null;
      const owner = rootOwner(host.hostname);
      const posture = postureForHost(state, host.hostname, owner);
      return {
        id: `sec:${host.hostname}`,
        host: host.hostname,
        access: networkAccessLevel(state, host.hostname),
        owner,
        posture,
        ports: host.ports.slice(0, 8),
        checks: securityChecksForHost(state, host.hostname, host.ports, owner),
        actions: securityActionsForHost(state, host.hostname, posture),
      };
    })
    .filter((entry): entry is DesktopSecurityEntry => Boolean(entry))
    .sort((a, b) => {
      const rank = (entry: DesktopSecurityEntry) =>
        entry.posture === "local" ? 0 : entry.posture === "controlled" ? 1 : entry.posture === "watched" ? 2 : entry.posture === "exposed" ? 3 : 4;
      return rank(a) - rank(b) || a.host.localeCompare(b.host);
    });
}

export function desktopSecurityEntries(state: ShellSessionState): DesktopSecurityEntry[] {
  return collectDesktopSecurityEntries(state).slice(0, 32);
}

function addFirewallEntry(entries: DesktopFirewallEntry[], entry: Omit<DesktopFirewallEntry, "id">): void {
  const id = `firewall:${entry.tab}:${entry.name}:${entry.profile}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopFirewallEntries(state: ShellSessionState): DesktopFirewallEntry[] {
  const securityRows = desktopSecurityEntries(state);
  const serviceRows = desktopServiceEntries(state);
  const networkRows = desktopNetworkEntries(state);
  const dialupRows = desktopDialupEntries(state);
  const entries: DesktopFirewallEntry[] = [];
  const activeTunnel = state.tunnel ? `${state.tunnel.from}->${state.tunnel.to}` : "none";
  const auditEvents = state.desktopEvents.filter((event) => event.level === "audit");
  const exposedServices = serviceRows.filter((entry) => entry.status !== "restricted");
  addFirewallEntry(entries, {
    tab: "General",
    name: "Current Host",
    profile: currentHost(state),
    value: `${securityRows.find((entry) => entry.host === currentHost(state))?.posture ?? "local"} profile, ${exposedServices.length} reachable service exception row(s)`,
    source: "desktopSecurity",
    actions: ["security", "inspect", "services"],
  });
  addFirewallEntry(entries, {
    tab: "General",
    name: "Public Profile",
    profile: state.desktopTheme === "7" ? "Windows 7" : "Classic",
    value: `${networkRows.filter((entry) => entry.access === "public").length} public host row(s), remote depth=${state.remoteStack.length}`,
    source: "desktopNetwork",
    actions: ["network", "trace <host>", "bookmarks"],
  });
  addFirewallEntry(entries, {
    tab: "Exceptions",
    name: "Remote Administration",
    profile: "Access",
    value: `${state.loginHosts.length} login host(s), ${state.rootHosts.length} root host(s), ownership enforced by backend`,
    source: "hostAccess",
    actions: ["owned", "secure", "takeover"],
  });
  for (const service of serviceRows.slice(0, 8)) {
    addFirewallEntry(entries, {
      tab: "Exceptions",
      name: `${service.name} ${service.port}`,
      profile: service.access,
      value: `${service.host} ${service.status}; ${service.banner}`,
      source: "desktopServices",
      actions: service.actions,
    });
  }
  addFirewallEntry(entries, {
    tab: "Advanced",
    name: "Dial-Up Profiles",
    profile: "Routes",
    value: `${dialupRows.length} connection row(s), ${dialupRows.filter((entry) => entry.status === "watched").length} watched, ${dialupRows.filter((entry) => entry.status === "saved").length} saved`,
    source: "desktopDialup",
    actions: ["dialup", "modems", "trace <host>"],
  });
  addFirewallEntry(entries, {
    tab: "Advanced",
    name: "Tunnel Guard",
    profile: state.tunnel ? "Active" : "Idle",
    value: `tunnel=${activeTunnel}; camp=${state.campHost ?? "none"}; cooldowns are backend enforced`,
    source: "routeState",
    actions: ["tunnel /status", "camp /status", "who"],
  });
  addFirewallEntry(entries, {
    tab: "Logging",
    name: "Security Log",
    profile: "Audit",
    value: `${auditEvents.length} audit event(s); last=${auditEvents.at(-1)?.message ?? "none"}`,
    source: "desktopEvents",
    actions: ["events audit", "logs", "security"],
  });
  addFirewallEntry(entries, {
    tab: "Logging",
    name: "Background Tasks",
    profile: "Queue",
    value: `${state.desktopTasks.filter((task) => task.status !== "done").length} queued task row(s), ${state.commandHistory.length} command row(s)`,
    source: "desktopTasks",
    actions: ["tasks", "taskmgr", "scheduler"],
  });
  addFirewallEntry(entries, {
    tab: "About",
    name: "Browser Network APIs",
    profile: "none",
    value: "not enumerated; browser network permissions and packet APIs unused",
    source: "shellRuntime",
    actions: ["firewall", "help", "privacy"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tab.localeCompare(b.tab) || a.name.localeCompare(b.name))
    .slice(0, 48);
}

export function desktopFirewallEntries(state: ShellSessionState): DesktopFirewallEntry[] {
  return collectDesktopFirewallEntries(state);
}

function addUpdateEntry(entries: DesktopUpdateEntry[], entry: Omit<DesktopUpdateEntry, "id">): void {
  const id = `updates:${entry.tab}:${entry.name}:${entry.channel}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopUpdateEntries(state: ShellSessionState): DesktopUpdateEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const programRows = desktopProgramEntries(state);
  const serviceRows = desktopServiceEntries(state);
  const securityRows = desktopSecurityEntries(state);
  const scheduleRows = desktopScheduleEntries(state);
  const downloaded = Object.keys(state.downloads ?? {});
  const queuedTasks = state.desktopTasks.filter((task) => task.status !== "done");
  const entries: DesktopUpdateEntry[] = [];
  const eraName = state.desktopTheme === "7" ? "Windows Update" : "Automatic Updates";
  const updateServices = serviceRows.filter((entry) => entry.name === "HTTP" || entry.name === "HTTPS" || entry.name === "FTP");
  addUpdateEntry(entries, {
    tab: "Settings",
    name: "Update Mode",
    channel: eraName,
    value: `${state.desktopTheme === "nt" ? "notify only" : "download and notify"}; preference source=${state.desktopTheme}`,
    source: "desktopTheme",
    actions: ["theme nt|2000|xp|7", "control", "system"],
  });
  addUpdateEntry(entries, {
    tab: "Settings",
    name: "Schedule",
    channel: "Backend",
    value: `${scheduleRows.length} schedule row(s), ${queuedTasks.length} queued task row(s), ${state.commandHistory.length} command row(s)`,
    source: "desktopSchedule",
    actions: ["scheduler", "tasks", "history"],
  });
  addUpdateEntry(entries, {
    tab: "Status",
    name: "Installed Surface",
    channel: "Programs",
    value: `${programRows.length} program row(s), ${programRows.filter((entry) => entry.status === "downloaded").length} downloaded, ${programRows.filter((entry) => entry.status === "queued").length} queued`,
    source: "desktopPrograms",
    actions: ["programs", "appwiz.cpl", "games"],
  });
  addUpdateEntry(entries, {
    tab: "Status",
    name: "Downloaded Payloads",
    channel: "Cache",
    value: downloaded.length ? `${downloaded.length}: ${downloaded.slice(0, 4).join(", ")}` : "none; cache is backend session state",
    source: "downloads",
    actions: ["files", "ftp <host>", "gopher"],
  });
  addUpdateEntry(entries, {
    tab: "Sources",
    name: "Update Services",
    channel: "Network",
    value: `${updateServices.length} HTTP/FTP service row(s), ${serviceRows.filter((entry) => entry.status !== "restricted").length} reachable service row(s)`,
    source: "desktopServices",
    actions: ["services", "network", "internet"],
  });
  addUpdateEntry(entries, {
    tab: "Sources",
    name: "Trust Baseline",
    channel: "Security",
    value: securityRows.slice(0, 4).map((entry) => `${entry.host}:${entry.posture}`).join(", ") || "local baseline",
    source: "desktopSecurity",
    actions: ["security", "firewall", "inspect"],
  });
  addUpdateEntry(entries, {
    tab: "History",
    name: "Event Log",
    channel: "Audit",
    value: `${state.desktopEvents.length} event row(s); last=${state.desktopEvents.at(-1)?.message ?? "none"}`,
    source: "desktopEvents",
    actions: ["events", "eventvwr", "logs"],
  });
  addUpdateEntry(entries, {
    tab: "History",
    name: "Queued Work",
    channel: "Tasks",
    value: queuedTasks.length ? queuedTasks.slice(0, 3).map((task) => `${task.kind}:${task.target}`).join(", ") : "none",
    source: "desktopTasks",
    actions: ["task", "tasks", "taskmgr"],
  });
  addUpdateEntry(entries, {
    tab: "About",
    name: "External Update APIs",
    channel: "none",
    value: "not contacted; browser update services and OS package managers unused",
    source: "shellRuntime",
    actions: ["updates", "help", "privacy"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tab.localeCompare(b.tab) || a.name.localeCompare(b.name))
    .slice(0, 48);
}

export function desktopUpdateEntries(state: ShellSessionState): DesktopUpdateEntry[] {
  return collectDesktopUpdateEntries(state);
}

function addPerformanceEntry(entries: DesktopPerformanceEntry[], entry: Omit<DesktopPerformanceEntry, "id">): void {
  const id = `perf:${entry.object}:${entry.counter}:${entry.instance}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 120),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopPerformanceEntries(state: ShellSessionState): DesktopPerformanceEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const processRows = desktopProcessEntries(state);
  const serviceRows = desktopServiceEntries(state);
  const scheduleRows = desktopScheduleEntries(state);
  const networkRows = desktopNetworkEntries(state);
  const fileRows = desktopFileEntries(state);
  const securityRows = desktopSecurityEntries(state);
  const shareRows = desktopShareEntries(state);
  const printRows = desktopPrintEntries(state);
  const entries: DesktopPerformanceEntry[] = [];
  const activeProcesses = processRows.filter((entry) => entry.status === "running" || entry.status === "foreground" || entry.status === "linked" || entry.status === "watching");
  const queuedProcesses = processRows.filter((entry) => entry.status === "queued");
  addPerformanceEntry(entries, {
    object: "Processor",
    counter: "% Processor Time",
    instance: currentHost(state),
    value: `${Math.min(99, 12 + activeProcesses.length * 7 + queuedProcesses.length * 4)}% synthetic load from ${processRows.length} process row(s)`,
    source: "desktopProcesses",
    actions: ["taskmgr", "ps", "kill <pid>"],
  });
  addPerformanceEntry(entries, {
    object: "System",
    counter: "Processor Queue",
    instance: "Shell",
    value: `${queuedProcesses.length} queued process row(s), ${state.desktopTasks.filter((task) => task.status !== "done").length} queued task row(s)`,
    source: "desktopTasks",
    actions: ["tasks", "scheduler", "taskmgr queued"],
  });
  addPerformanceEntry(entries, {
    object: "Memory",
    counter: "Commit Charge",
    instance: state.username ?? "guest",
    value: `${fileRows.length + Object.keys(state.downloads ?? {}).length + state.commandHistory.length} backend row unit(s)`,
    source: "desktopFiles",
    actions: ["files", "history", "desktop files"],
  });
  addPerformanceEntry(entries, {
    object: "Network",
    counter: "Visible Interfaces",
    instance: state.tunnel ? "Tunnel" : "Routes",
    value: `${networkRows.length} visible host row(s), remote depth=${state.remoteStack.length}, tunnel=${state.tunnel ? `${state.tunnel.from}->${state.tunnel.to}` : "none"}`,
    source: "desktopNetwork",
    actions: ["network", "dialup", "trace <host>"],
  });
  addPerformanceEntry(entries, {
    object: "Service",
    counter: "Reachable Services",
    instance: currentHost(state),
    value: `${serviceRows.filter((entry) => entry.status !== "restricted").length}/${serviceRows.length} service row(s) reachable`,
    source: "desktopServices",
    actions: ["services", "netstat", "inspect"],
  });
  addPerformanceEntry(entries, {
    object: "Scheduler",
    counter: "Ready Tasks",
    instance: "schtasks",
    value: `${scheduleRows.filter((entry) => entry.status === "ready").length} ready, ${scheduleRows.filter((entry) => entry.status === "queued").length} queued, ${scheduleRows.filter((entry) => entry.status === "running").length} running`,
    source: "desktopSchedule",
    actions: ["scheduler", "schtasks /query", "task"],
  });
  addPerformanceEntry(entries, {
    object: "Security",
    counter: "Watched Hosts",
    instance: state.campHost ?? "baseline",
    value: `${securityRows.filter((entry) => entry.posture === "watched").length} watched, ${securityRows.filter((entry) => entry.posture === "controlled").length} controlled, ${securityRows.filter((entry) => entry.posture === "exposed").length} exposed`,
    source: "desktopSecurity",
    actions: ["security", "firewall", "camp /status"],
  });
  addPerformanceEntry(entries, {
    object: "Disk",
    counter: "Shared Rows",
    instance: state.homeHost,
    value: `${shareRows.length} share row(s), ${shareRows.filter((entry) => entry.writable).length} writable, ${fileRows.length} visible file row(s)`,
    source: "desktopShares",
    actions: ["shares", "files", "folders"],
  });
  addPerformanceEntry(entries, {
    object: "Print Queue",
    counter: "Held Jobs",
    instance: currentHost(state),
    value: `${printRows.filter((entry) => entry.status === "held").length} held, ${printRows.filter((entry) => entry.status === "queued").length} queued, ${printRows.length} total`,
    source: "desktopPrint",
    actions: ["printers", "printq", "task transfer"],
  });
  addPerformanceEntry(entries, {
    object: "Event Log",
    counter: "Events/sec",
    instance: "Synthetic",
    value: `${state.desktopEvents.length} bounded event row(s); last=${state.desktopEvents.at(-1)?.message ?? "none"}`,
    source: "desktopEvents",
    actions: ["events", "eventvwr", "logs"],
  });
  addPerformanceEntry(entries, {
    object: "Runtime",
    counter: "Browser APIs",
    instance: "none",
    value: "not sampled; browser performance APIs, timers, canvas, GL renderers, and bytecode runtimes unused",
    source: "shellRuntime",
    actions: ["performance", "help", "privacy"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.object.localeCompare(b.object) || a.counter.localeCompare(b.counter))
    .slice(0, 48);
}

export function desktopPerformanceEntries(state: ShellSessionState): DesktopPerformanceEntry[] {
  return collectDesktopPerformanceEntries(state);
}

function addRestoreEntry(entries: DesktopRestoreEntry[], entry: Omit<DesktopRestoreEntry, "id">): void {
  const id = `restore:${entry.tab}:${entry.name}:${entry.status}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 140),
    actions: entry.actions.slice(0, 4),
  });
}

function checkpointHost(snapshot: Record<string, unknown>): string {
  const stack = Array.isArray(snapshot.remoteStack) ? snapshot.remoteStack as Array<Record<string, unknown>> : [];
  const top = stack.at(-1);
  return typeof top?.host === "string" ? top.host : typeof snapshot.homeHost === "string" ? snapshot.homeHost : "cyberscape";
}

function collectDesktopRestoreEntries(state: ShellSessionState): DesktopRestoreEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const fileRows = desktopFileEntries(state);
  const registryRows = desktopRegistryEntries(state);
  const securityRows = desktopSecurityEntries(state);
  const entries: DesktopRestoreEntry[] = [];
  const restoreRows = state.userId
    ? db.select().from(savedStates).where(eq(savedStates.userId, state.userId)).all()
      .sort((a, b) => b.updatedAt - a.updatedAt)
    : [];
  addRestoreEntry(entries, {
    tab: "Status",
    name: "Protection",
    status: state.loggedIn ? "available" : "guest",
    value: state.loggedIn ? `${restoreRows.length} restore point row(s), home=${state.homeHost}` : "login required for saved restore points",
    source: "savedStates",
    actions: ["save <name>", "load <name>", "login"],
  });
  addRestoreEntry(entries, {
    tab: "Status",
    name: "Current Session",
    status: currentHost(state),
    value: `cwd=${state.cwd}; commands=${state.commandHistory.length}; tasks=${state.desktopTasks.filter((task) => task.status !== "done").length}`,
    source: "shellSession",
    actions: ["pwd", "history", "tasks"],
  });
  for (const row of restoreRows.slice(0, 8)) {
    const snapshot = row.state as Record<string, unknown>;
    const host = checkpointHost(snapshot);
    const cwd = typeof snapshot.cwd === "string" ? snapshot.cwd : "/";
    const remoteDepth = Array.isArray(snapshot.remoteStack) ? snapshot.remoteStack.length : 0;
    addRestoreEntry(entries, {
      tab: "Restore Point",
      name: row.name,
      status: host,
      value: `saved ${new Date(row.updatedAt).toISOString()}; cwd=${cwd}; hops=${remoteDepth}`,
      source: "savedStates",
      actions: [`load ${row.name}`, `save ${row.name}`, "desktop restore"],
    });
  }
  addRestoreEntry(entries, {
    tab: "Monitored",
    name: "Files",
    status: "tracked",
    value: `${fileRows.length} visible file row(s), ${Object.keys(state.downloads ?? {}).length} download row(s)`,
    source: "desktopFiles",
    actions: ["files", "shares", "folders"],
  });
  addRestoreEntry(entries, {
    tab: "Monitored",
    name: "Registry",
    status: "tracked",
    value: `${registryRows.length} registry-style row(s), ${registryRows.filter((entry) => entry.writable).length} writable presentation row(s)`,
    source: "desktopRegistry",
    actions: ["registry", "reg query", "control"],
  });
  addRestoreEntry(entries, {
    tab: "Monitored",
    name: "Access State",
    status: "tracked",
    value: `${state.loginHosts.length} login host(s), ${state.rootHosts.length} root host(s), ${securityRows.length} security row(s)`,
    source: "desktopSecurity",
    actions: ["security", "owned", "inspect"],
  });
  addRestoreEntry(entries, {
    tab: "History",
    name: "Recent Events",
    status: "audit",
    value: `${state.desktopEvents.length} event row(s); last=${state.desktopEvents.at(-1)?.message ?? "none"}`,
    source: "desktopEvents",
    actions: ["events", "eventvwr", "logs"],
  });
  addRestoreEntry(entries, {
    tab: "History",
    name: "Queued Work",
    status: "tasks",
    value: `${state.desktopTasks.filter((task) => task.status !== "done").length} queued task row(s), ${state.desktopTasks.filter((task) => task.status === "done").length} completed`,
    source: "desktopTasks",
    actions: ["tasks", "taskmgr", "scheduler"],
  });
  addRestoreEntry(entries, {
    tab: "About",
    name: "Client Restore APIs",
    status: "none",
    value: "not invoked; browser storage snapshots, OS restore services, and client rollback APIs unused",
    source: "shellRuntime",
    actions: ["restore", "help", "privacy"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tab.localeCompare(b.tab) || a.name.localeCompare(b.name))
    .slice(0, 48);
}

export function desktopRestoreEntries(state: ShellSessionState): DesktopRestoreEntry[] {
  return collectDesktopRestoreEntries(state);
}

function addComputerEntry(entries: DesktopComputerEntry[], entry: Omit<DesktopComputerEntry, "id">): void {
  const id = `computer:${entry.tree}:${entry.node}:${entry.status}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 150),
    actions: entry.actions.slice(0, 5),
  });
}

function collectDesktopComputerEntries(state: ShellSessionState): DesktopComputerEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const eventRows = state.desktopEvents.slice(-12);
  const shareRows = desktopShareEntries(state);
  const deviceRows = desktopDeviceEntries(state);
  const serviceRows = desktopServiceEntries(state);
  const processRows = desktopProcessEntries(state);
  const scheduleRows = desktopScheduleEntries(state);
  const fileRows = desktopFileEntries(state);
  const securityRows = desktopSecurityEntries(state);
  const performanceRows = desktopPerformanceEntries(state);
  const registryRows = desktopRegistryEntries(state);
  const networkRows = desktopNetworkEntries(state);
  const entries: DesktopComputerEntry[] = [];
  addComputerEntry(entries, {
    tree: "System Tools",
    node: "Event Viewer",
    status: eventRows.length ? eventRows.at(-1)!.level : "quiet",
    value: `${eventRows.length} bounded event row(s); last=${eventRows.at(-1)?.message ?? "none"}`,
    source: "desktopEvents",
    actions: ["events", "eventvwr", "logs"],
  });
  addComputerEntry(entries, {
    tree: "System Tools",
    node: "Shared Folders",
    status: shareRows.some((entry) => entry.writable) ? "writable" : "readable",
    value: `${shareRows.length} share row(s), ${shareRows.filter((entry) => entry.writable).length} writable, ${fileRows.length} visible file row(s)`,
    source: "desktopShares",
    actions: ["shares", "files", "folders"],
  });
  addComputerEntry(entries, {
    tree: "System Tools",
    node: "Device Manager",
    status: deviceRows.some((entry) => entry.status === "warning") ? "warning" : "ok",
    value: `${deviceRows.length} device row(s), ${deviceRows.filter((entry) => entry.status === "busy").length} busy, ${deviceRows.filter((entry) => entry.status === "warning").length} warning`,
    source: "desktopDevices",
    actions: ["devices", "devmgmt", "modems"],
  });
  addComputerEntry(entries, {
    tree: "System Tools",
    node: "Task Scheduler",
    status: scheduleRows.some((entry) => entry.status === "queued") ? "queued" : "ready",
    value: `${scheduleRows.length} schedule row(s), ${scheduleRows.filter((entry) => entry.status === "queued").length} queued, ${scheduleRows.filter((entry) => entry.status === "running").length} running`,
    source: "desktopSchedule",
    actions: ["scheduler", "schtasks /query", "tasks"],
  });
  addComputerEntry(entries, {
    tree: "Storage",
    node: "Disk Management",
    status: fileRows.some((entry) => entry.kind === "home") ? "profile" : "host",
    value: `${fileRows.length} visible file row(s), ${Object.keys(state.downloads ?? {}).length} download row(s), cwd=${state.cwd}`,
    source: "desktopFiles",
    actions: ["files", "shares", "desktop files"],
  });
  addComputerEntry(entries, {
    tree: "Storage",
    node: "Removable Storage",
    status: state.remoteStack.length ? "mounted" : "idle",
    value: `${state.remoteStack.length} active hop(s), ${networkRows.length} visible network row(s), home=${state.homeHost}`,
    source: "desktopNetwork",
    actions: ["network", "dialup", "trace <host>"],
  });
  addComputerEntry(entries, {
    tree: "Services and Applications",
    node: "Services",
    status: serviceRows.some((entry) => entry.status === "running") ? "running" : "reachable",
    value: `${serviceRows.length} service row(s), ${serviceRows.filter((entry) => entry.status !== "restricted").length} reachable`,
    source: "desktopServices",
    actions: ["services", "netstat", "inspect"],
  });
  addComputerEntry(entries, {
    tree: "Services and Applications",
    node: "Processes",
    status: processRows.some((entry) => entry.status === "queued") ? "queued" : "running",
    value: `${processRows.length} process row(s), foreground=${processRows.find((entry) => entry.status === "foreground")?.command ?? state.shellMode}`,
    source: "desktopProcesses",
    actions: ["taskmgr", "ps", "kill <pid>"],
  });
  addComputerEntry(entries, {
    tree: "Services and Applications",
    node: "Performance Logs",
    status: "synthetic",
    value: `${performanceRows.length} counter row(s); ${performanceRows.find((entry) => entry.counter === "Processor Queue")?.value ?? "queue baseline"}`,
    source: "desktopPerformance",
    actions: ["performance", "perfmon", "taskmgr"],
  });
  addComputerEntry(entries, {
    tree: "Security",
    node: "Local Users and Groups",
    status: state.loggedIn ? "profile" : "guest",
    value: `${state.loginHosts.length} login host(s), ${state.rootHosts.length} root host(s), user=${state.username ?? "guest"}`,
    source: "shellSession",
    actions: ["accounts", "whoami", "owned"],
  });
  addComputerEntry(entries, {
    tree: "Security",
    node: "Security Center",
    status: securityRows.some((entry) => entry.posture === "exposed") ? "review" : "baseline",
    value: `${securityRows.length} security row(s), ${securityRows.filter((entry) => entry.posture === "controlled").length} controlled, ${securityRows.filter((entry) => entry.posture === "watched").length} watched`,
    source: "desktopSecurity",
    actions: ["security", "firewall", "secure"],
  });
  addComputerEntry(entries, {
    tree: "Console",
    node: "Registry View",
    status: registryRows.some((entry) => entry.writable) ? "settings" : "readable",
    value: `${registryRows.length} registry-style row(s), ${registryRows.filter((entry) => entry.writable).length} writable presentation row(s)`,
    source: "desktopRegistry",
    actions: ["registry", "reg query", "control"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.tree.localeCompare(b.tree) || a.node.localeCompare(b.node))
    .slice(0, 48);
}

export function desktopComputerEntries(state: ShellSessionState): DesktopComputerEntry[] {
  return collectDesktopComputerEntries(state);
}

function addDiskEntry(entries: DesktopDiskEntry[], entry: Omit<DesktopDiskEntry, "id">): void {
  const id = `disk:${entry.disk}:${entry.volume}:${entry.status}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    capacity: entry.capacity.replace(/\s+/g, " ").slice(0, 80),
    used: entry.used.replace(/\s+/g, " ").slice(0, 130),
    actions: entry.actions.slice(0, 5),
  });
}

function kbForRows(rows: DesktopFileEntry[]): number {
  return rows.reduce((total, row) => total + Math.max(1, Math.ceil(row.size / 1024)), 0);
}

function collectDesktopDiskEntries(state: ShellSessionState): DesktopDiskEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const progress = progressionForBadges(Array.from(new Set(state.badges)));
  const fileRows = desktopFileEntries(state);
  const shareRows = desktopShareEntries(state);
  const registryRows = desktopRegistryEntries(state);
  const networkRows = desktopNetworkEntries(state);
  const restoreRows = state.userId
    ? db.select().from(savedStates).where(eq(savedStates.userId, state.userId)).all()
    : [];
  const homeRows = fileRows.filter((entry) => entry.kind === "home");
  const downloadRows = fileRows.filter((entry) => entry.kind === "download");
  const hostRows = fileRows.filter((entry) => entry.kind === "host");
  const transferTasks = state.desktopTasks.filter((task) => task.kind === "transfer" && task.status !== "done");
  const entries: DesktopDiskEntry[] = [];
  addDiskEntry(entries, {
    disk: "Disk 0",
    volume: "C: Profile",
    status: state.loggedIn ? "healthy" : "guest",
    capacity: `${progress.diskQuota}KB quota`,
    used: `${kbForRows(homeRows) + kbForRows(downloadRows)}KB used by ${homeRows.length} home and ${downloadRows.length} download row(s)`,
    source: "progression",
    actions: ["scores", "files", "shares"],
  });
  addDiskEntry(entries, {
    disk: "Disk 0",
    volume: "System Reserved",
    status: "healthy",
    capacity: "16KB synthetic",
    used: `${registryRows.length} registry-style row(s), theme=${state.desktopTheme}`,
    source: "desktopRegistry",
    actions: ["registry", "system", "control"],
  });
  addDiskEntry(entries, {
    disk: "Disk 0",
    volume: "Downloads",
    status: downloadRows.length ? "active" : "empty",
    capacity: `${Math.max(32, Math.floor(progress.diskQuota / 2))}KB cache`,
    used: `${kbForRows(downloadRows)}KB across ${downloadRows.length} downloaded file row(s)`,
    source: "downloads",
    actions: ["files", "ftp", "programs"],
  });
  addDiskEntry(entries, {
    disk: "Disk 1",
    volume: `${currentHost(state)} Host`,
    status: "read-only",
    capacity: `${hostRows.length} visible file row(s)`,
    used: `${kbForRows(hostRows)}KB visible through cwd=${state.cwd}`,
    source: "desktopFiles",
    actions: ["files", "cat <file>", "folders"],
  });
  addDiskEntry(entries, {
    disk: "Net",
    volume: "Shared Folders",
    status: shareRows.some((entry) => entry.writable) ? "writable" : "mounted",
    capacity: `${shareRows.length} share row(s)`,
    used: `${shareRows.filter((entry) => entry.writable).length} writable, ${shareRows.filter((entry) => entry.kind === "download").length} download share row(s)`,
    source: "desktopShares",
    actions: ["shares", "network", "files"],
  });
  addDiskEntry(entries, {
    disk: "Net",
    volume: "Route Cache",
    status: state.remoteStack.length ? "mounted" : "idle",
    capacity: `${networkRows.length} visible host row(s)`,
    used: `${state.remoteStack.length} active hop(s), tunnel=${state.tunnel ? `${state.tunnel.from}->${state.tunnel.to}` : "none"}`,
    source: "desktopNetwork",
    actions: ["network", "dialup", "trace <host>"],
  });
  addDiskEntry(entries, {
    disk: "Task",
    volume: "Transfer Queue",
    status: transferTasks.length ? "queued" : "idle",
    capacity: `${state.desktopTasks.length} task row(s)`,
    used: `${transferTasks.length} pending transfer row(s), ${state.desktopTasks.filter((task) => task.status === "done").length} completed task row(s)`,
    source: "desktopTasks",
    actions: ["tasks", "scheduler", "task transfer <host>"],
  });
  addDiskEntry(entries, {
    disk: "Shadow",
    volume: "Restore Points",
    status: state.loggedIn ? "available" : "guest",
    capacity: `${restoreRows.length} saved checkpoint row(s)`,
    used: state.loggedIn ? `${restoreRows.slice(0, 3).map((row) => row.name).join(", ") || "none"}` : "login required for persisted checkpoints",
    source: "savedStates",
    actions: ["restore", "save <name>", "load <name>"],
  });
  addDiskEntry(entries, {
    disk: "Runtime",
    volume: "Local Browser Store",
    status: "unused",
    capacity: "not sampled",
    used: "browser storage quotas and native disk APIs are not authority for this shell",
    source: "shellRuntime",
    actions: ["disk", "privacy", "help"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.disk.localeCompare(b.disk) || a.volume.localeCompare(b.volume))
    .slice(0, 48);
}

export function desktopDiskEntries(state: ShellSessionState): DesktopDiskEntry[] {
  return collectDesktopDiskEntries(state);
}

function eventViewerLogForEvent(event: DesktopEvent): string {
  if (event.level === "audit") return "Security";
  if (event.source === "task" || event.source === "files" || event.source === "bookmark") return "Application";
  if (event.source === "mail" || event.source === "boards") return "Applications and Services";
  return "System";
}

function eventViewerId(event: Pick<DesktopEvent, "level" | "source" | "id">): number {
  const base = event.level === "audit" ? 560 : event.level === "warn" ? 420 : 100;
  const sourceSeed = [...event.source].reduce((total, char) => total + char.charCodeAt(0), 0) % 80;
  return base + sourceSeed + (event.id % 10);
}

function addEventViewerEntry(entries: DesktopEventViewerEntry[], entry: Omit<DesktopEventViewerEntry, "id">): void {
  const id = `eventviewer:${entry.log}:${entry.eventId}:${entry.source}:${entry.host}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    message: entry.message.replace(/\s+/g, " ").slice(0, 150),
    actions: entry.actions.slice(0, 5),
  });
}

function collectDesktopEventViewerEntries(state: ShellSessionState): DesktopEventViewerEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const entries: DesktopEventViewerEntry[] = [];
  for (const event of state.desktopEvents.slice(-18)) {
    addEventViewerEntry(entries, {
      log: eventViewerLogForEvent(event),
      level: event.level,
      source: event.source,
      eventId: eventViewerId(event),
      message: event.message,
      host: event.host,
      actions: ["events", `events ${event.source}`, "logs"],
    });
  }
  addEventViewerEntry(entries, {
    log: "System",
    level: "info",
    source: "session",
    eventId: 101,
    message: `current host ${currentHost(state)}, mode=${state.shellMode}, stty=${state.stty}`,
    host: currentHost(state),
    actions: ["system", "status", "desktop"],
  });
  addEventViewerEntry(entries, {
    log: "Application",
    level: state.desktopTasks.some((task) => task.status !== "done") ? "warn" : "info",
    source: "task",
    eventId: 222,
    message: `${state.desktopTasks.filter((task) => task.status !== "done").length} queued task row(s), ${state.commandHistory.length} command history row(s)`,
    host: currentHost(state),
    actions: ["tasks", "scheduler", "history"],
  });
  addEventViewerEntry(entries, {
    log: "Security",
    level: state.rootHosts.length ? "audit" : "info",
    source: "access",
    eventId: state.rootHosts.length ? 568 : 110,
    message: `${state.loginHosts.length} login host(s), ${state.rootHosts.length} root host(s), camp=${state.campHost ?? "none"}`,
    host: currentHost(state),
    actions: ["security", "owned", "whoami"],
  });
  addEventViewerEntry(entries, {
    log: "Applications and Services",
    level: "info",
    source: "shell",
    eventId: 315,
    message: `mail=${state.mailbox.length}, downloads=${Object.keys(state.downloads ?? {}).length}, bookmarks=${state.desktopBookmarks.length}`,
    host: state.homeHost,
    actions: ["mailbox", "files", "bookmarks"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => a.log.localeCompare(b.log) || a.eventId - b.eventId || a.source.localeCompare(b.source))
    .slice(0, 64);
}

export function desktopEventViewerEntries(state: ShellSessionState): DesktopEventViewerEntry[] {
  return collectDesktopEventViewerEntries(state);
}

function addSearchEntry(entries: DesktopSearchEntry[], entry: Omit<DesktopSearchEntry, "id">): void {
  const key = `${entry.scope}:${entry.name}:${entry.location}:${entry.source}`.toLowerCase();
  if (entries.some((existing) => existing.id === key)) return;
  entries.push({
    id: key.replace(/[^a-z0-9:_-]/g, "-").slice(0, 96),
    ...entry,
  });
}

function collectDesktopSearchEntries(state: ShellSessionState): DesktopSearchEntry[] {
  const entries: DesktopSearchEntry[] = [];
  for (const file of desktopFileEntries(state).slice(0, 24)) {
    addSearchEntry(entries, {
      scope: "Files",
      name: file.name,
      location: file.path,
      summary: `${file.kind} file on ${file.host}, ${file.size}b`,
      source: "desktopFiles",
      actions: [`files ${file.name}`, `cat ${file.path}`],
    });
  }
  for (const message of desktopMailEntries(state).slice(0, 16)) {
    addSearchEntry(entries, {
      scope: "Mail",
      name: message.subject,
      location: `${message.from}->${message.to}`,
      summary: message.preview,
      source: "desktopMail",
      actions: [`mailbox ${message.subject}`, "inbox"],
    });
  }
  for (const board of collectDesktopBoardEntries(state).slice(0, 24)) {
    addSearchEntry(entries, {
      scope: board.kind === "usenet" ? "USENET" : "Boards",
      name: board.subject,
      location: board.board,
      summary: `${board.author}: ${board.preview}`,
      source: "desktopBoards",
      actions: [`boards ${board.subject}`, board.kind === "usenet" ? "news" : "bbs"],
    });
  }
  for (const network of collectDesktopNetworkEntries(state).slice(0, 24)) {
    addSearchEntry(entries, {
      scope: "Hosts",
      name: network.host,
      location: network.route.join(" -> ") || "local",
      summary: `${network.access} ${network.org}; ports ${network.ports.slice(0, 4).join(",") || "-"}`,
      source: "desktopNetwork",
      actions: [`network ${network.host}`, `trace ${network.host}`],
    });
  }
  for (const service of collectDesktopServiceEntries(state).slice(0, 32)) {
    addSearchEntry(entries, {
      scope: "Services",
      name: service.name,
      location: `${service.host}:${service.port}`,
      summary: `${service.status} ${service.access}; ${service.banner}`,
      source: "desktopServices",
      actions: [`services ${service.name}`, `inspect ${service.host}`],
    });
  }
  for (const event of collectDesktopEventViewerEntries(state).slice(0, 24)) {
    addSearchEntry(entries, {
      scope: event.log,
      name: `${event.source} ${event.eventId}`,
      location: event.host,
      summary: event.message,
      source: "desktopEventViewer",
      actions: [`eventviewer ${event.source}`, "events"],
    });
  }
  for (const task of normalizeDesktopTasks(state.desktopTasks).slice(0, 16)) {
    addSearchEntry(entries, {
      scope: "Tasks",
      name: `${task.kind} ${task.target}`,
      location: task.status,
      summary: task.label,
      source: "desktopTasks",
      actions: ["task list", `scheduler ${task.target}`],
    });
  }
  for (const bookmark of normalizeDesktopBookmarks(state.desktopBookmarks).slice(0, 16)) {
    addSearchEntry(entries, {
      scope: "Bookmarks",
      name: bookmark.target,
      location: bookmark.kind,
      summary: bookmark.label,
      source: "desktopBookmarks",
      actions: ["bookmarks", bookmark.kind === "route" ? `trace ${bookmark.target}` : `network ${bookmark.target}`],
    });
  }
  for (const connection of collectDesktopConnectionEntries(state).slice(0, 16)) {
    addSearchEntry(entries, {
      scope: "Connections",
      name: connection.name,
      location: connection.host,
      summary: `${connection.type} ${connection.status} ${connection.device} ${connection.speed}`,
      source: "desktopConnections",
      actions: connection.actions,
    });
  }
  for (const lineage of collectDesktopLineageEntries(state)) {
    addSearchEntry(entries, {
      scope: "Connection Lineage",
      name: lineage.method,
      location: `${lineage.era}:${lineage.host}`,
      summary: `${lineage.status} ${lineage.speed}; ${lineage.meaning}`,
      source: "desktopLineage",
      actions: lineage.actions,
    });
  }
  for (const remote of collectDesktopRemoteEntries(state).slice(0, 16)) {
    addSearchEntry(entries, {
      scope: "Remote Desktop",
      name: remote.host,
      location: remote.route.join(" -> ") || remote.source,
      summary: `${remote.status} ${remote.display}; ${remote.profile}`,
      source: "desktopRemote",
      actions: remote.actions,
    });
  }
  for (const run of collectDesktopRunEntries(state).slice(0, 16)) {
    addSearchEntry(entries, {
      scope: "Run",
      name: run.command,
      location: run.source,
      summary: `${run.status}; ${run.target}`,
      source: "desktopRun",
      actions: run.actions,
    });
  }
  for (const credential of collectDesktopCredentialEntries(state).slice(0, 16)) {
    addSearchEntry(entries, {
      scope: "Credentials",
      name: credential.target,
      location: credential.username,
      summary: `${credential.status} ${credential.kind}; ${credential.source}`,
      source: "desktopCredentials",
      actions: credential.actions,
    });
  }
  for (const setup of collectDesktopNetSetupEntries(state).slice(0, 16)) {
    addSearchEntry(entries, {
      scope: "Network Setup",
      name: setup.item,
      location: setup.stage,
      summary: setup.status,
      source: "desktopNetSetup",
      actions: setup.actions,
    });
  }
  for (const diagnostic of collectDesktopNetDiagnosticEntries(state).slice(0, 16)) {
    addSearchEntry(entries, {
      scope: "Diagnostics",
      name: diagnostic.test,
      location: diagnostic.target,
      summary: `${diagnostic.result}: ${diagnostic.detail}`,
      source: "desktopNetDiagnostics",
      actions: diagnostic.actions,
    });
  }
  for (const drive of collectDesktopMappedDriveEntries(state).slice(0, 16)) {
    addSearchEntry(entries, {
      scope: "Mapped Drives",
      name: drive.drive,
      location: drive.remote,
      summary: `${drive.status}; ${drive.capacity}`,
      source: "desktopMappedDrives",
      actions: drive.actions,
    });
  }
  for (const offline of collectDesktopOfflineEntries(state).slice(0, 16)) {
    addSearchEntry(entries, {
      scope: "Offline Files",
      name: offline.item,
      location: offline.location,
      summary: `${offline.status}; ${offline.size}`,
      source: "desktopOffline",
      actions: offline.actions,
    });
  }
  for (const help of collectDesktopHelpEntries(state).slice(0, 16)) {
    addSearchEntry(entries, {
      scope: "Help",
      name: help.topic,
      location: help.section,
      summary: help.status,
      source: "desktopHelp",
      actions: help.actions,
    });
  }
  for (const command of normalizeCommandHistory(state.commandHistory).slice(-16).reverse()) {
    addSearchEntry(entries, {
      scope: "History",
      name: command.line,
      location: command.host,
      summary: `${command.mode} command on tty ${state.ttyPort}`,
      source: "commandHistory",
      actions: [`history ${command.line.split(/\s+/)[0] ?? ""}`],
    });
  }
  return entries
    .sort((a, b) => a.scope.localeCompare(b.scope) || a.name.localeCompare(b.name))
    .slice(0, 192);
}

export function desktopSearchEntries(state: ShellSessionState): DesktopSearchEntry[] {
  return collectDesktopSearchEntries(state);
}

function addHelpEntry(entries: DesktopHelpEntry[], entry: Omit<DesktopHelpEntry, "id">): void {
  const id = `help:${entry.section}:${entry.topic}:${entry.source}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  if (entries.some((existing) => existing.id === id)) return;
  entries.push({
    id,
    ...entry,
    status: entry.status.replace(/\s+/g, " ").slice(0, 160),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopHelpEntries(state: ShellSessionState): DesktopHelpEntry[] {
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  const entries: DesktopHelpEntry[] = [];
  const commandTopics = ["desktop", "network", "dialup", "hunt", "lineage", "era", "pad", "x25", "telex", "connections", "netsetup", "netdiag", "mapdrive", "offline", "sync", "remote", "mstsc", "runbox", "start", "cmd.exe", "explorer", "runas", "credentials", "keymgr", "search", "tasks", "security", "services", "files", "boards", "mailbox", "registry", "restore"];
  for (const command of commandTopics) {
    addHelpEntry(entries, {
      section: "Commands",
      topic: command,
      status: COMMAND_HELP[command] ?? describeCommand(command),
      source: "commandHelp",
      actions: command === "help" ? ["?", "help"] : [`help ${command}`, command],
    });
  }
  for (const app of DESKTOP_APPS.filter((app) => app !== "terminal").slice(0, 32)) {
    const title = DESKTOP_APP_TITLES[app] ?? app;
    addHelpEntry(entries, {
      section: "Workstation",
      topic: title,
      status: `open with desktop ${app}; app=${app}`,
      source: "desktopApps",
      actions: [`desktop open ${app}`, app === "help" ? "support" : app],
    });
  }
  addHelpEntry(entries, {
    section: "Session",
    topic: "Current host",
    status: `${currentHost(state)} in ${state.shellMode} mode, tty=${state.ttyPort}, theme=${state.desktopTheme}`,
    source: "sessionState",
    actions: ["status", "whoami", "system"],
  });
  addHelpEntry(entries, {
    section: "Session",
    topic: "Recent activity",
    status: `${state.commandHistory.length} recent command(s), ${state.desktopEvents.length} event row(s), ${state.desktopTasks.filter((task) => task.status !== "done").length} queued task(s)`,
    source: "desktopEvents",
    actions: ["history", "events", "tasks"],
  });
  for (const bookmark of state.desktopBookmarks.slice(0, 8)) {
    addHelpEntry(entries, {
      section: "Saved Places",
      topic: bookmark.target,
      status: `${bookmark.kind} bookmark; ${bookmark.label}`,
      source: "desktopBookmarks",
      actions: ["bookmarks", bookmark.kind === "route" ? `trace ${bookmark.target}` : `network ${bookmark.target}`],
    });
  }
  for (const connection of collectDesktopConnectionEntries(state).slice(0, 8)) {
    addHelpEntry(entries, {
      section: "Connections",
      topic: connection.name,
      status: `${connection.type} ${connection.status} on ${connection.host}; ${connection.device}`,
      source: "desktopConnections",
      actions: connection.actions,
    });
  }
  for (const lineage of collectDesktopLineageEntries(state)) {
    addHelpEntry(entries, {
      section: "Connection Lineage",
      topic: lineage.method,
      status: `${lineage.era} ${lineage.status} via ${lineage.path}; ${lineage.meaning}`,
      source: "desktopLineage",
      actions: lineage.actions,
    });
  }
  for (const service of collectDesktopServiceEntries(state).slice(0, 8)) {
    addHelpEntry(entries, {
      section: "Services",
      topic: `${service.host}:${service.name}`,
      status: `${service.status} ${service.access}; ${service.banner}`,
      source: "desktopServices",
      actions: service.actions,
    });
  }
  return entries.sort((a, b) => a.section.localeCompare(b.section) || a.topic.localeCompare(b.topic)).slice(0, 96);
}

export function desktopHelpEntries(state: ShellSessionState): DesktopHelpEntry[] {
  return collectDesktopHelpEntries(state);
}

function serviceNameForPort(port: number): string {
  if (port === 21) return "FTP";
  if (port === 22) return "SSH";
  if (port === 23) return "Telnet";
  if (port === 25) return "SMTP";
  if (port === 70) return "Gopher";
  if (port === 79) return "Finger";
  if (port === 80) return "HTTP";
  if (port === 110) return "POP3";
  if (port === 119) return "NNTP";
  if (port === 143) return "IMAP";
  if (port === 194) return "IRC";
  if (port === 443) return "HTTPS";
  return `Port${port}`;
}

function serviceBannerForPort(port: number, hostName: string): string {
  if (port === 21) return "anonymous area, check file list";
  if (port === 22) return "keyed shell endpoint";
  if (port === 23) return "login banner accepts terminal clients";
  if (port === 25) return "mail exchanger spool";
  if (port === 70) return "menu selectors available";
  if (port === 79) return "finger daemon";
  if (port === 80) return "shared web root";
  if (port === 110 || port === 143) return "mailbox service";
  if (port === 119) return "news transport";
  if (port === 194) return "relay channel";
  if (port === 443) return "ssl wrapper";
  return `${hostName} listener`;
}

function serviceStatusForHost(access: DesktopNetworkEntry["access"], port: number): DesktopServiceEntry["status"] {
  if (access === "local" || access === "root") return "running";
  if (access === "login" || port === 23 || port === 80 || port === 70 || port === 119) return "reachable";
  return "restricted";
}

function serviceActionsForEntry(hostname: string, port: number, access: DesktopNetworkEntry["access"]): string[] {
  if (port === 21) return [`ftp ${hostname}`, `files ${hostname}`];
  if (port === 23 || port === 22) return [`telnet ${hostname}`, `trace ${hostname}`];
  if (port === 70) return [`gopher ${hostname}`];
  if (port === 119) return ["news", `boards ${hostname}`];
  if (port === 194) return [`irc ${hostname}`];
  if (access === "root" || access === "local") return [`inspect ${hostname}`, `task maint ${hostname}`];
  return [`trace ${hostname}`, `task scan ${hostname}`];
}

function collectDesktopServiceEntries(state: ShellSessionState): DesktopServiceEntry[] {
  const seen = new Set<string>();
  const entries: DesktopServiceEntry[] = [];
  for (const networkEntry of collectDesktopNetworkEntries(state).slice(0, 16)) {
    const host = getHost(networkEntry.host);
    if (!host) continue;
    const ports = host.ports.length ? host.ports : [23];
    for (const port of ports.slice(0, 6)) {
      const id = `svc:${host.hostname}:${port}`;
      if (seen.has(id)) continue;
      seen.add(id);
      const name = serviceNameForPort(port);
      entries.push({
        id,
        host: host.hostname,
        port,
        name,
        status: serviceStatusForHost(networkEntry.access, port),
        access: networkEntry.access,
        banner: serviceBannerForPort(port, host.hostname),
        actions: serviceActionsForEntry(host.hostname, port, networkEntry.access),
      });
    }
  }
  return entries.sort((a, b) => {
    const rank = (entry: DesktopServiceEntry) => entry.status === "running" ? 0 : entry.status === "reachable" ? 1 : 2;
    return rank(a) - rank(b) || a.host.localeCompare(b.host) || a.port - b.port;
  });
}

export function desktopServiceEntries(state: ShellSessionState): DesktopServiceEntry[] {
  return collectDesktopServiceEntries(state).slice(0, 48);
}

function shareActionsForEntry(entry: Pick<DesktopShareEntry, "host" | "kind" | "name" | "writable">): string[] {
  if (entry.kind === "home") return entry.writable ? ["files", "write <file> <text>", "desktop files"] : ["files"];
  if (entry.kind === "download") return ["files", "cat <file>", "desktop files"];
  return [`files ${entry.host}`, `trace ${entry.host}`, entry.writable ? `task maint ${entry.host}` : `bookmark add ${entry.host}`];
}

function collectDesktopShareEntries(state: ShellSessionState): DesktopShareEntry[] {
  const entries: DesktopShareEntry[] = [];
  const seen = new Set<string>();
  for (const networkEntry of collectDesktopNetworkEntries(state).slice(0, 16)) {
    const host = getHost(networkEntry.host);
    if (!host) continue;
    const fileCount = Object.keys(host.files ?? {}).length;
    if (!fileCount && networkEntry.access === "public") continue;
    const writable = networkEntry.access === "local" || networkEntry.access === "root";
    const entry: DesktopShareEntry = {
      id: `share:${host.hostname}:pub`,
      host: host.hostname,
      name: "PUBLIC",
      kind: "host",
      access: networkEntry.access,
      path: `//${host.hostname}/PUBLIC`,
      files: fileCount,
      writable,
      actions: [],
    };
    entry.actions = shareActionsForEntry(entry);
    entries.push(entry);
    seen.add(entry.id);
  }
  if (state.loggedIn && state.username) {
    const rows = userFileRows(state);
    const entry: DesktopShareEntry = {
      id: `share:${state.homeHost}:home`,
      host: state.homeHost,
      name: state.username.toUpperCase().slice(0, 12),
      kind: "home",
      access: networkAccessLevel(state, state.homeHost),
      path: `//${state.homeHost}/home/${state.username}`,
      files: rows.length,
      writable: true,
      actions: [],
    };
    entry.actions = shareActionsForEntry(entry);
    entries.unshift(entry);
  }
  const downloadCount = Object.keys(state.downloads ?? {}).length;
  if (downloadCount) {
    const entry: DesktopShareEntry = {
      id: `share:${state.homeHost}:downloads`,
      host: state.homeHost,
      name: "DOWNLOADS",
      kind: "download",
      access: networkAccessLevel(state, state.homeHost),
      path: `//${state.homeHost}/downloads`,
      files: downloadCount,
      writable: false,
      actions: [],
    };
    entry.actions = shareActionsForEntry(entry);
    entries.unshift(entry);
  }
  return entries
    .filter((entry) => {
      if (seen.has(entry.id) && entry.kind !== "host") return false;
      seen.add(entry.id);
      return true;
    })
    .sort((a, b) => {
      const rank = (entry: DesktopShareEntry) => entry.kind === "home" ? 0 : entry.kind === "download" ? 1 : entry.writable ? 2 : 3;
      return rank(a) - rank(b) || a.host.localeCompare(b.host) || a.name.localeCompare(b.name);
    });
}

export function desktopShareEntries(state: ShellSessionState): DesktopShareEntry[] {
  return collectDesktopShareEntries(state).slice(0, 48);
}

function addMappedDriveEntry(entries: DesktopMappedDriveEntry[], entry: Omit<DesktopMappedDriveEntry, "id">): void {
  const id = `map:${entry.drive}:${entry.remote}:${entry.source}`.toLowerCase().replace(/[^a-z0-9:_/-]+/g, "-");
  if (entries.some((existing) => existing.id === id)) return;
  entries.push({
    id,
    ...entry,
    status: entry.status.replace(/\s+/g, " ").slice(0, 80),
    capacity: entry.capacity.replace(/\s+/g, " ").slice(0, 80),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopMappedDriveEntries(state: ShellSessionState): DesktopMappedDriveEntry[] {
  const entries: DesktopMappedDriveEntry[] = [];
  const shareRows = collectDesktopShareEntries(state);
  const fileRows = desktopFileEntries(state);
  const letters = "ZYXWVUTSRQPONMLKJIHGFEDCBA".split("");
  for (const [index, share] of shareRows.slice(0, 18).entries()) {
    const filesForShare = fileRows.filter((file) => file.host === share.host && (share.kind !== "download" || file.kind === "download"));
    addMappedDriveEntry(entries, {
      drive: `${letters[index] ?? "M"}:`,
      remote: share.path.replaceAll("/", "\\"),
      status: share.writable ? "read/write" : "read-only",
      capacity: `${share.files} file(s), ${kbForRows(filesForShare)} KB visible`,
      source: "desktopShares",
      actions: ["shares", `files ${share.host}`, ...share.actions],
    });
  }
  if (!entries.some((entry) => entry.remote.includes("\\downloads")) && Object.keys(state.downloads ?? {}).length) {
    addMappedDriveEntry(entries, {
      drive: "D:",
      remote: `\\\\${state.homeHost}\\downloads`,
      status: "read-only",
      capacity: `${Object.keys(state.downloads ?? {}).length} downloaded file(s)`,
      source: "downloads",
      actions: ["files", "shares", "cat <file>"],
    });
  }
  if (state.loggedIn && state.username && !entries.some((entry) => entry.remote.includes(`\\home\\${state.username}`))) {
    const homeRows = fileRows.filter((file) => file.kind === "home");
    addMappedDriveEntry(entries, {
      drive: "H:",
      remote: `\\\\${state.homeHost}\\home\\${state.username}`,
      status: "read/write",
      capacity: `${homeRows.length} home file(s), ${kbForRows(homeRows)} KB visible`,
      source: "userFiles",
      actions: ["files", "write <file> <text>", "desktop files"],
    });
  }
  return entries.sort((a, b) => a.drive.localeCompare(b.drive)).slice(0, 48);
}

export function desktopMappedDriveEntries(state: ShellSessionState): DesktopMappedDriveEntry[] {
  return collectDesktopMappedDriveEntries(state);
}

function addOfflineEntry(entries: DesktopOfflineEntry[], entry: Omit<DesktopOfflineEntry, "id">): void {
  const id = `offline:${entry.source}:${entry.location}:${entry.item}`.toLowerCase().replace(/[^a-z0-9:_/-]+/g, "-").slice(0, 120);
  if (entries.some((existing) => existing.id === id)) return;
  entries.push({
    id,
    ...entry,
    location: entry.location.replace(/\s+/g, " ").slice(0, 80),
    item: entry.item.replace(/\s+/g, " ").slice(0, 100),
    status: entry.status.replace(/\s+/g, " ").slice(0, 80),
    size: entry.size.replace(/\s+/g, " ").slice(0, 80),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopOfflineEntries(state: ShellSessionState): DesktopOfflineEntry[] {
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const entries: DesktopOfflineEntry[] = [];
  const fileRows = desktopFileEntries(state);
  const shareRows = collectDesktopShareEntries(state);
  const mappedRows = collectDesktopMappedDriveEntries(state);

  for (const file of fileRows.slice(0, 18)) {
    const location = file.kind === "download" ? "Downloads" : file.kind === "home" ? "My Documents" : file.host;
    const status = file.kind === "home" ? "pinned read/write" : file.kind === "download" ? "cached read-only" : "available online";
    const actions = file.kind === "home" ? ["files", `cat ${file.path}`, "write <file> <text>"] : ["files", `cat ${file.name}`, "shares"];
    addOfflineEntry(entries, {
      location,
      item: file.name,
      status,
      size: `${Math.max(1, Math.ceil(file.size / 1024))} KB`,
      source: file.kind === "home" ? "userFiles" : file.kind === "download" ? "downloads" : "desktopFiles",
      actions,
    });
  }

  for (const share of shareRows.slice(0, 16)) {
    addOfflineEntry(entries, {
      location: "Network",
      item: share.path,
      status: share.writable ? "sync enabled" : "manual cache",
      size: `${share.files} file(s)`,
      source: "desktopShares",
      actions: ["shares", `files ${share.host}`, ...share.actions],
    });
  }

  for (const drive of mappedRows.slice(0, 12)) {
    addOfflineEntry(entries, {
      location: drive.drive,
      item: drive.remote,
      status: drive.status.includes("write") ? "mapped sync" : "mapped cache",
      size: drive.capacity,
      source: "desktopMappedDrives",
      actions: ["mapdrive", "net use", ...drive.actions],
    });
  }

  for (const task of state.desktopTasks.filter((entry) => entry.status !== "done").slice(0, 8)) {
    addOfflineEntry(entries, {
      location: "Sync Queue",
      item: task.label,
      status: `${task.kind} pending`,
      size: task.target,
      source: "desktopTasks",
      actions: ["tasks", `task done ${task.id}`, "events task"],
    });
  }

  for (const event of state.desktopEvents.slice(-8).reverse()) {
    if (!/file|share|download|transfer|map|sync/i.test(`${event.source} ${event.message}`)) continue;
    addOfflineEntry(entries, {
      location: event.host,
      item: event.message,
      status: `recent ${event.level}`,
      size: event.source,
      source: "desktopEvents",
      actions: ["events", `events ${event.source}`, "logs"],
    });
  }

  return entries
    .sort((a, b) => {
      const rank = (entry: DesktopOfflineEntry) =>
        entry.source === "desktopTasks" ? 0 :
        entry.source === "userFiles" ? 1 :
        entry.source === "downloads" ? 2 :
        entry.source === "desktopShares" ? 3 :
        entry.source === "desktopMappedDrives" ? 4 : 5;
      return rank(a) - rank(b) || a.location.localeCompare(b.location) || a.item.localeCompare(b.item);
    })
    .slice(0, 64);
}

export function desktopOfflineEntries(state: ShellSessionState): DesktopOfflineEntry[] {
  return collectDesktopOfflineEntries(state);
}

function printPagesForText(text: string): number {
  return Math.max(1, Math.min(99, Math.ceil(Math.max(1, text.length) / 1800)));
}

function collectDesktopPrintEntries(state: ShellSessionState): DesktopPrintEntry[] {
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const entries: DesktopPrintEntry[] = [];
  const host = currentHost(state);
  for (const [index, task] of state.desktopTasks.filter((item) => item.kind === "transfer" && item.status !== "done").slice(0, 8).entries()) {
    entries.push({
      id: `print:task:${task.id}`,
      host: task.target.includes(".") ? host : task.target,
      queue: "LPT1",
      status: "queued",
      document: task.label || task.target,
      source: `task ${task.id}`,
      pages: printPagesForText(task.label),
      actions: [`task done ${task.id}`, "tasks", "events task"],
    });
  }
  for (const file of desktopFileEntries(state).slice(0, 8)) {
    entries.push({
      id: `print:file:${file.id}`,
      host: file.host,
      queue: file.kind === "home" ? "HOME" : "LPT1",
      status: file.kind === "host" ? "ready" : "held",
      document: file.name,
      source: file.path,
      pages: printPagesForText(`${file.name}${file.path}${file.size}`),
      actions: [`cat ${file.name}`, `files ${file.name}`, "printq"],
    });
  }
  for (const event of state.desktopEvents.slice(-6)) {
    entries.push({
      id: `print:event:${event.id}`,
      host: event.host,
      queue: "EVENTLOG",
      status: event.level === "warn" ? "held" : "ready",
      document: `${event.source}-${event.id}`,
      source: event.message,
      pages: 1,
      actions: [`events ${event.source}`, "logs", "printq"],
    });
  }
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => {
      const rank = (entry: DesktopPrintEntry) => entry.status === "queued" ? 0 : entry.status === "held" ? 1 : 2;
      return rank(a) - rank(b) || a.host.localeCompare(b.host) || a.queue.localeCompare(b.queue);
    })
    .slice(0, 48);
}

export function desktopPrintEntries(state: ShellSessionState): DesktopPrintEntry[] {
  return collectDesktopPrintEntries(state);
}

function addRegistryEntry(entries: DesktopRegistryEntry[], entry: Omit<DesktopRegistryEntry, "id">): void {
  const id = `reg:${entry.hive}:${entry.key}:${entry.name}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    value: entry.value.replace(/\s+/g, " ").slice(0, 120),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopRegistryEntries(state: ShellSessionState): DesktopRegistryEntry[] {
  normalizeDesktopWindowState(state);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const host = getHost(currentHost(state));
  const entries: DesktopRegistryEntry[] = [];
  const displayKey = "Software\\Cyberscape\\Shell\\Desktop";
  const prefsKey = "Control Panel\\Desktop";
  const sessionKey = "Software\\Cyberscape\\Shell\\Session";
  const explorerKey = "Software\\Microsoft\\Windows\\CurrentVersion\\Explorer";

  addRegistryEntry(entries, {
    hive: "HKCU",
    key: displayKey,
    name: "DesktopTheme",
    value: state.desktopTheme,
    source: "session",
    writable: true,
    actions: ["theme nt", "theme 2000", "theme xp", "theme 7"],
  });
  addRegistryEntry(entries, {
    hive: "HKCU",
    key: displayKey,
    name: "ActiveApp",
    value: state.desktopActiveApp,
    source: "session",
    writable: true,
    actions: ["desktop <app>", "desktop open <app>"],
  });
  addRegistryEntry(entries, {
    hive: "HKCU",
    key: displayKey,
    name: "OpenWindows",
    value: state.desktopOpenApps.join(",") || "terminal",
    source: "session",
    writable: true,
    actions: ["desktop open <app>", "desktop close <app>"],
  });
  addRegistryEntry(entries, {
    hive: "HKCU",
    key: prefsKey,
    name: "UserPreferences",
    value: `motion=${state.desktopPrefs.motion}; font=${state.desktopPrefs.fontSize}; contrast=${state.desktopPrefs.contrast}; sound=${state.desktopPrefs.sound}; keyboard=${state.desktopPrefs.keyboardMode}`,
    source: "prefs",
    writable: true,
    actions: ["theme pref motion reduced", "theme pref contrast high", "desktop export"],
  });
  addRegistryEntry(entries, {
    hive: "HKCU",
    key: explorerKey,
    name: "BookmarkCount",
    value: String(state.desktopBookmarks.length),
    source: "bookmarks",
    writable: false,
    actions: ["bookmarks", "bookmark add <host>", "bookmark route <host>"],
  });
  addRegistryEntry(entries, {
    hive: "HKCU",
    key: sessionKey,
    name: "CommandHistory",
    value: `${state.commandHistory.length} recent command(s)`,
    source: "history",
    writable: false,
    actions: ["history", "logs"],
  });
  addRegistryEntry(entries, {
    hive: "HKCU",
    key: sessionKey,
    name: "QueuedTasks",
    value: `${state.desktopTasks.filter((task) => task.status !== "done").length} queued task(s)`,
    source: "tasks",
    writable: false,
    actions: ["tasks", "task scan <host>", "task clear"],
  });
  addRegistryEntry(entries, {
    hive: "HKCU",
    key: sessionKey,
    name: "AuditEvents",
    value: `${state.desktopEvents.length} event(s)`,
    source: "events",
    writable: false,
    actions: ["events", "eventvwr", "logs"],
  });
  addRegistryEntry(entries, {
    hive: "HKU",
    key: `${state.username ?? "guest"}\\Environment`,
    name: "HomeHost",
    value: state.homeHost,
    source: "identity",
    writable: false,
    actions: ["whoami", "finger", "nodes"],
  });
  addRegistryEntry(entries, {
    hive: "HKU",
    key: `${state.username ?? "guest"}\\Environment`,
    name: "SshKey",
    value: keyFingerprint(state.sshPublicKey),
    source: "identity",
    writable: false,
    actions: ["set sshkey", "whoami"],
  });
  addRegistryEntry(entries, {
    hive: "HKLM",
    key: "SYSTEM\\CurrentControlSet\\Control\\ComputerName",
    name: "CurrentHost",
    value: currentHost(state),
    source: "host",
    writable: false,
    actions: ["nodes", "network", "trace <host>"],
  });
  addRegistryEntry(entries, {
    hive: "HKLM",
    key: "SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters",
    name: "HostMetadata",
    value: host ? `${host.org}; ${host.location}; ports=${host.ports.slice(0, 6).join(",") || "none"}` : "unknown host",
    source: "host",
    writable: false,
    actions: ["services", "netstat", "inspect"],
  });
  addRegistryEntry(entries, {
    hive: "HKLM",
    key: "SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Routes",
    name: "RouteDepth",
    value: `${state.remoteStack.length} active hop(s)`,
    source: "network",
    writable: false,
    actions: ["network", "trace <host>", "uupath <host>"],
  });
  addRegistryEntry(entries, {
    hive: "HKLM",
    key: "SOFTWARE\\Cyberscape\\Access",
    name: "OwnedSystems",
    value: `login=${state.loginHosts.length}; root=${state.rootHosts.length}`,
    source: "access",
    writable: false,
    actions: ["owned", "security", "secure"],
  });
  addRegistryEntry(entries, {
    hive: "HKLM",
    key: "SYSTEM\\CurrentControlSet\\Services\\Watcher",
    name: "StealthTimers",
    value: `camp=${state.campHost ?? "none"}; tunnel=${state.tunnel ? `${state.tunnel.from}->${state.tunnel.to}` : "none"}`,
    source: "access",
    writable: false,
    actions: ["camp", "tunnel", "events audit"],
  });

  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .sort((a, b) => {
      const rank = (entry: DesktopRegistryEntry) => entry.hive === "HKCU" ? 0 : entry.hive === "HKU" ? 1 : 2;
      return rank(a) - rank(b) || a.key.localeCompare(b.key) || a.name.localeCompare(b.name);
    })
    .slice(0, 64);
}

export function desktopRegistryEntries(state: ShellSessionState): DesktopRegistryEntry[] {
  return collectDesktopRegistryEntries(state);
}

function rootOwner(hostname: string): string | null {
  const row = db.select().from(hostState).where(eq(hostState.hostname, hostname)).get();
  if (!row?.rootUserId) return null;
  return db.select().from(users).where(eq(users.id, row.rootUserId)).get()?.username ?? `uid:${row.rootUserId}`;
}

function handleOwned(state: ShellSessionState): ShellResult["output"] {
  const loginHosts = Array.from(new Set(state.loginHosts));
  const rootHosts = Array.from(new Set(state.rootHosts));
  if (!loginHosts.length && !rootHosts.length) {
    return [
      "No owned systems yet.",
      "Use WARDIAL, PORTHACK, and ROOTKIT to build a map.",
    ];
  }

  const lines = [
    "Owned systems:",
    "Host            Access   Organization",
    "----            ------   ------------",
  ];
  const names = Array.from(new Set([...rootHosts, ...loginHosts])).sort();
  for (const name of names) {
    const host = getHost(name);
    const access = rootHosts.includes(name) ? "root" : "login";
    lines.push(`${name.padEnd(16)}${access.padEnd(9)}${host?.org ?? "unknown"}`);
  }
  return lines;
}

function handleLook(state: ShellSessionState): ShellResult["output"] {
  return [
    `You are at ${currentHost(state)}.`,
    `cwd: ${state.cwd}`,
    `remote depth: ${state.remoteStack.length}`,
  ];
}

function handleScan(state: ShellSessionState): ShellResult["output"] {
  const host = getHost(currentHost(state));
  const owner = host ? rootOwner(host.hostname) : null;
  return [
    host ? `${host.hostname}: ${host.org} / ${host.location}` : `Unknown host ${currentHost(state)}`,
    host?.bbs_config ? "BBS available here." : "No BBS on this host.",
    host ? `Access: ${hostAccessLevel(state, host.hostname)}` : "Access: unknown",
    owner ? `Root owner: ${owner}` : "Root owner: none",
  ];
}

function handleInspect(state: ShellSessionState): ShellResult["output"] {
  const host = getHost(currentHost(state));
  const owner = host ? rootOwner(host.hostname) : null;
  const sessions = db.select().from(shellSessions).all()
    .map((session) => sanitizeSessionSnapshot(session.state as unknown as Partial<ShellSessionState>));
  const campers = sessions
    .filter((rowState) => rowState.campHost === currentHost(state))
    .map((rowState) => rowState.username ?? "guest");
  const tunnels = sessions
    .filter((rowState) => rowState.tunnel?.from === currentHost(state) || rowState.tunnel?.to === currentHost(state))
    .map((rowState) => `${rowState.username ?? "guest"}:${rowState.tunnel?.from}->${rowState.tunnel?.to}`);
  return [
    `hostname: ${host?.hostname ?? currentHost(state)}`,
    `ports: ${host?.ports.join(", ") ?? "unknown"}`,
    `files: ${Object.keys(host?.files ?? {}).join(", ") || "none"}`,
    `access: ${host ? hostAccessLevel(state, host.hostname) : "unknown"}`,
    `root: ${owner ?? "none"}`,
    `campers: ${campers.join(", ") || "none"}`,
    `tunnels: ${tunnels.join(", ") || "none"}`,
  ];
}

function handleTrace(args: string[], state: ShellSessionState): ShellResult["output"] {
  const target = args[0];
  if (!target) return ["Usage: trace <host>"];
  const host = getHost(target);
  if (!host) return [`Unknown host ${target}`];
  const route = findUucpRoute(currentHost(state), host.hostname);
  if (!route) {
    return [`No route from ${currentHost(state)} to ${host.hostname}.`];
  }

  const lines = [`Route to ${host.hostname.charAt(0).toUpperCase()}${host.hostname.slice(1)}:`];
  route.forEach((hop, index) => {
    const hopHost = getHost(hop);
    const latency = 11 + (index * 7) + (hop.length % 9);
    lines.push(
      `${String(index + 1).padStart(2, " ")}  ${hop.padEnd(16)}${String(latency).padStart(4, " ")} ms  ${hopHost?.location ?? "unknown"}`
    );
  });
  lines.push(`Trace complete: ${route.length - 1} hops.`);
  return [
    ...lines,
  ];
}

function handleBookmark(args: string[], state: ShellSessionState): ShellResult["output"] {
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  const action = args[0]?.toLowerCase() ?? "list";
  if (action === "list" || action === "ls") return formatBookmarks(state);

  if (action === "clear") {
    state.desktopBookmarks = [];
    recordDesktopEvent(state, "warn", "bookmark", "bookmarks cleared");
    return ["Bookmarks cleared."];
  }

  if (action === "rm" || action === "remove" || action === "delete") {
    const key = args[1]?.toLowerCase();
    if (!key) return ["Usage: bookmark rm <id|host>"];
    const before = state.desktopBookmarks.length;
    state.desktopBookmarks = state.desktopBookmarks.filter((bookmark) =>
      bookmark.id.toLowerCase() !== key && bookmark.target.toLowerCase() !== key
    );
    if (before === state.desktopBookmarks.length) return [`No bookmark matched ${key}.`];
    recordDesktopEvent(state, "warn", "bookmark", `bookmark removed ${key}`);
    return [`Bookmark removed: ${key}`];
  }

  if (action !== "add" && action !== "route") {
    return [
      "Usage: bookmark list",
      "       bookmark add <host> [label]",
      "       bookmark route <host> [label]",
      "       bookmark rm <id|host>",
      "       bookmark clear",
    ];
  }

  const targetName = args[1]?.toLowerCase();
  if (!targetName) return [`Usage: bookmark ${action} <host> [label]`];
  const host = getHost(targetName);
  if (!host) return [`Unknown host ${targetName}`];
  const kind: DesktopBookmark["kind"] = action === "route" ? "route" : "host";
  const label = args.slice(2).join(" ").trim() || `${host.org} / ${host.location}`;
  const existing = state.desktopBookmarks.filter((bookmark) =>
    !(bookmark.kind === kind && bookmark.target.toLowerCase() === host.hostname.toLowerCase())
  );

  let route: string[] | undefined;
  if (action === "route") {
    const resolvedRoute = findUucpRoute(currentHost(state), host.hostname);
    if (!resolvedRoute) return [`No route from ${currentHost(state)} to ${host.hostname}.`];
    route = resolvedRoute;
  }

  const bookmark: DesktopBookmark = {
    id: `b${Date.now().toString(36)}${String(existing.length + 1).padStart(2, "0")}`,
    kind,
    target: host.hostname,
    label: label.replace(/\s+/g, " ").slice(0, 80),
    route,
    createdAt: Date.now(),
  };
  state.desktopBookmarks = normalizeDesktopBookmarks([bookmark, ...existing]);
  recordDesktopEvent(state, "info", "bookmark", `bookmark saved ${bookmark.kind} ${bookmark.target}`);
  return [
    `Bookmark saved: ${bookmark.kind} ${bookmark.target}`,
    ...formatBookmarks(state).slice(1, 5),
  ];
}

function handleTask(args: string[], state: ShellSessionState): ShellResult["output"] {
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  const action = args[0]?.toLowerCase() ?? "list";
  if (action === "list" || action === "ls" || action === "status") return formatTasks(state);

  if (action === "clear") {
    state.desktopTasks = [];
    recordDesktopEvent(state, "warn", "task", "tasks cleared");
    return ["Tasks cleared."];
  }

  if (action === "done" || action === "finish" || action === "complete") {
    const key = args[1]?.toLowerCase();
    if (!key) return ["Usage: task done <id|target>"];
    const now = Date.now();
    let changed = false;
    state.desktopTasks = state.desktopTasks.map((task) => {
      if (task.id.toLowerCase() !== key && task.target.toLowerCase() !== key) return task;
      changed = true;
      return { ...task, status: "done", updatedAt: now };
    });
    if (!changed) return [`No task matched ${key}.`];
    recordDesktopEvent(state, "audit", "task", `task done ${key}`);
    return [`Task marked done: ${key}`, ...formatTasks(state).slice(1, 5)];
  }

  const kind: DesktopTaskKind | null = action === "scan" || action === "transfer" || action === "maint" ? action : null;
  if (!kind) {
    return [
      "Usage: task list",
      "       task scan <host> [label]",
      "       task transfer <host|file> [label]",
      "       task maint <host> [label]",
      "       task done <id|target>",
      "       task clear",
    ];
  }

  const target = args[1]?.toLowerCase();
  if (!target) return [`Usage: task ${kind} <target> [label]`];
  if ((kind === "scan" || kind === "maint") && !getHost(target)) return [`Unknown host ${target}`];
  const now = Date.now();
  const label = args.slice(2).join(" ").trim() || `${kind} ${target}`;
  const id = `t${now.toString(36)}${String(state.desktopTasks.length + 1).padStart(2, "0")}`;
  const task: DesktopTask = {
    id,
    kind,
    target,
    label: label.replace(/\s+/g, " ").slice(0, 100),
    status: "queued",
    createdAt: now,
    updatedAt: now,
  };
  state.desktopTasks = normalizeDesktopTasks([...state.desktopTasks, task]);
  recordDesktopEvent(state, "info", "task", `task queued ${task.kind} ${task.target}`);
  return [
    `Task queued: ${task.kind} ${task.target}`,
    ...formatTasks(state).slice(1, 5),
  ];
}

function handleSearch(state: ShellSessionState, term: string): ShellResult["output"] {
  const needle = term.trim().toLowerCase();
  if (!needle) return ["Usage: grep <term>"];
  const matches: string[] = [];
  for (const host of [getHost(currentHost(state)), ...["ftp","news","relay","mirror"].map((id) => getHost(id))].filter(Boolean) as NonNullable<ReturnType<typeof getHost>>[]) {
    const blob = [
      host.hostname,
      host.org,
      host.location,
      JSON.stringify(host.files ?? {}),
    ].join(" ").toLowerCase();
    if (blob.includes(needle)) {
      matches.push(`${host.hostname} matched "${term}"`);
    }
  }
  return matches.length ? matches : [`No matches for ${term}.`];
}

function checkpointState(state: ShellSessionState): Record<string, unknown> {
  return {
    ...state,
    sessionId: null,
    ttyPort: 0,
    pager: null,
    mirrorInbox: [],
    linkTargetSessionId: null,
  } as unknown as Record<string, unknown>;
}

function restoreCheckpoint(state: ShellSessionState, checkpoint: Partial<ShellSessionState>): void {
  const sessionId = state.sessionId;
  const ttyPort = state.ttyPort;
  Object.assign(state, checkpoint);
  state.sessionId = sessionId;
  state.ttyPort = ttyPort;
  state.pager = null;
  state.mirrorInbox ??= [];
  state.linkTargetSessionId = null;
}

function handleSave(state: ShellSessionState, args: string[] = []): ShellResult["output"] {
  if (!state.userId) return ["Must be logged in."];
  const name = (args[0] ?? "default").toLowerCase();
  db.delete(savedStates)
    .where(and(eq(savedStates.userId, state.userId), eq(savedStates.name, name)))
    .run();
  db.insert(savedStates).values({
    userId: state.userId,
    name,
    state: checkpointState(state),
    updatedAt: Date.now(),
  }).run();
  return [
    `Session saved for ${state.username ?? "guest"} as ${name}.`,
    "Checkpoint mirrored to SQLite.",
  ];
}

function handleLoad(state: ShellSessionState, args: string[] = []): ShellResult["output"] {
  if (!state.userId) return ["Must be logged in."];
  const name = (args[0] ?? "default").toLowerCase();
  const row = db.select()
    .from(savedStates)
    .where(and(eq(savedStates.userId, state.userId), eq(savedStates.name, name)))
    .get();
  if (!row) return [`No saved session named ${name}.`];
  restoreCheckpoint(state, row.state as unknown as Partial<ShellSessionState>);
  return [
    `Session loaded for ${state.username ?? "guest"} from ${name}.`,
    "Checkpoint restored from SQLite.",
  ];
}

function handleSolve(state: ShellSessionState, term: string): ShellResult["output"] {
  const normalized = term.trim().toLowerCase();
  if (!normalized) {
    return [
      "Usage: solve <clue>",
      "Hint: the archive keeps pointing at moons, landers, and the BASIC shelf.",
    ];
  }

  if (["luna", "moon", "lunar", "lunar lander", "lunar.bas"].includes(normalized)) {
    unlockBadge(state, "solver");
    return [
      "The hidden layer opens.",
      "A vault key glints in the archive.",
    ];
  }
  return ["That does not line up with the archive."];
}

function handleSet(state: ShellSessionState, args: string[]): ShellResult["output"] {
  if (!state.userId) return ["Must be logged in."];
  const [field, ...rest] = args;
  if (!field || field.toLowerCase() !== "key") {
    return ["Usage: set key <ssh public key>|off"];
  }

  const value = rest.join(" ").trim();
  if (!value || ["off", "clear", "none"].includes(value.toLowerCase())) {
    db.update(users)
      .set({ sshPublicKey: null })
      .where(eq(users.id, state.userId))
      .run();
    state.sshPublicKey = null;
    return ["SSH key cleared."];
  }

  db.update(users)
    .set({ sshPublicKey: value })
    .where(eq(users.id, state.userId))
    .run();
  state.sshPublicKey = value;
  return [
    "SSH key stored.",
    `Fingerprint: ${keyFingerprint(value)}`,
  ];
}

function handleSecure(state: ShellSessionState): ShellResult["output"] {
  return attemptRootkit(state, currentHost(state));
}

function handleTakeover(state: ShellSessionState): ShellResult["output"] {
  return attemptRootkit(state, currentHost(state));
}

function handleCamp(state: ShellSessionState, args: string[]): ShellResult["output"] {
  const now = Date.now();
  cleanupStealthState(state, now);

  const mode = args[0]?.toLowerCase();
  if (mode === "/off" || mode === "off") {
    const previous = state.campHost;
    state.campHost = null;
    state.campSince = null;
    state.campCooldownUntil = now + CAMPS_REMAINING_MS;
    return previous ? [`Camp cleared from ${previous}.`] : ["No active camp."];
  }
  if (mode === "/status" || mode === "status") {
    return state.campHost
      ? [`Camped on ${state.campHost}.`, `Since: ${new Date(state.campSince ?? Date.now()).toISOString()}`]
      : ["No active camp."];
  }

  if (state.campCooldownUntil !== null && now < state.campCooldownUntil) {
    return [`Camp unavailable: wait ${formatCooldown(state.campCooldownUntil, now)} before changing camp target.`];
  }

  const host = currentHost(state);
  if (state.campHost === host) {
    return [`Already camped on ${host}.`];
  }
  state.campHost = host;
  state.campSince = Date.now();
  state.campCooldownUntil = now + CAMPS_REMAINING_MS;
  return [
    `Camp set on ${host}.`,
    "WHO and INSPECT now expose the watcher.",
  ];
}

function handleTunnel(state: ShellSessionState, args: string[]): ShellResult["output"] {
  const now = Date.now();
  cleanupStealthState(state, now);

  const mode = args[0]?.toLowerCase();
  if (mode === "/off" || mode === "off") {
    const previous = state.tunnel;
    state.tunnel = null;
    state.tunnelCooldownUntil = now + TUNNEL_RECAST_MS;
    return previous ? [`Tunnel ${previous.from}->${previous.to} collapsed.`] : ["No active tunnel."];
  }
  if (mode === "/status" || mode === "status" || !mode) {
    return state.tunnel
      ? [`Tunnel active: ${state.tunnel.from}->${state.tunnel.to}.`, `Created: ${new Date(state.tunnel.createdAt).toISOString()}`]
      : ["Usage: tunnel <host>|/off|/status"];
  }

  if (state.tunnelCooldownUntil !== null && now < state.tunnelCooldownUntil) {
    return [`Tunnel unavailable: wait ${formatCooldown(state.tunnelCooldownUntil, now)} before re-routing.`];
  }

  const target = getHost(mode);
  if (!target) return [`Unknown host ${mode}`];
  const from = currentHost(state);
  const src = getHost(from);
  if (!src?.neighbors.includes(target.hostname)) {
    return [
      "Tunnel rejected: direct path required.",
      `Use telnet ${mode} to enter the segment before tunneling.`,
    ];
  }

  const routeKind = "direct";
  state.tunnel = {
    from,
    to: target.hostname,
    createdAt: now,
  };
  state.tunnelCooldownUntil = now + TUNNEL_RECAST_MS;
  return [
    `${routeKind[0]!.toUpperCase()}${routeKind.slice(1)} tunnel established: ${from}->${target.hostname}.`,
    "The guarded route is visible in STATUS, WHO, and INSPECT.",
  ];
}

interface ProcessRow {
  pid: number;
  tty: number | string;
  user: string;
  host: string;
  command: string;
}

function localProcesses(state: ShellSessionState): ProcessRow[] {
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  const rows: ProcessRow[] = [
    {
      pid: 1,
      tty: state.ttyPort,
      user: state.username ?? "guest",
      host: currentHost(state),
      command: state.shellMode === "shell" ? "shell" : state.shellMode,
    },
  ];
  if (state.linkTargetSessionId) {
    rows.push({
      pid: 2,
      tty: state.ttyPort,
      user: state.username ?? "guest",
      host: currentHost(state),
      command: `link ${state.linkTargetSessionId.slice(0, 8)}`,
    });
  }
  if (state.campHost) {
    rows.push({
      pid: 3,
      tty: state.ttyPort,
      user: state.username ?? "guest",
      host: state.campHost,
      command: "camp",
    });
  }
  if (state.tunnel) {
    rows.push({
      pid: 4,
      tty: state.ttyPort,
      user: state.username ?? "guest",
      host: state.tunnel.from,
      command: `tunnel ${state.tunnel.from}->${state.tunnel.to}`,
    });
  }
  if (!["nli", "shell"].includes(state.shellMode)) {
    rows.push({
      pid: 5,
      tty: state.ttyPort,
      user: state.username ?? "guest",
      host: currentHost(state),
      command: `${state.shellMode} foreground`,
    });
  }
  for (const [index, task] of state.desktopTasks.filter((item) => item.status !== "done").entries()) {
    rows.push({
      pid: 20 + index,
      tty: state.ttyPort,
      user: state.username ?? "guest",
      host: task.target,
      command: `task ${task.kind} ${task.id}`,
    });
  }
  return rows;
}

function formatProcessRows(rows: ProcessRow[], heading = "PID   TTY    USER             HOST             COMMAND"): string[] {
  return [
    heading,
    ...rows.map((row) =>
      `${String(row.pid).padEnd(6)}${String(row.tty).padEnd(7)}${row.user.padEnd(17)}${row.host.padEnd(17)}${row.command}`
    ),
  ];
}

function handlePs(state: ShellSessionState, args: string[]): ShellResult["output"] {
  if (args[0] === "/tty" || args[0] === "-a") {
    const rows = db.select().from(shellSessions).all()
      .map((session, index) => {
        const rowState = session.state as unknown as Partial<ShellSessionState>;
        return {
          pid: 100 + index,
          tty: rowState.ttyPort ?? "?",
          user: rowState.username ?? "guest",
          host: sessionHost(rowState),
          command: rowState.shellMode ?? "nli",
        };
      })
      .sort((a, b) => String(a.tty).localeCompare(String(b.tty)));
    return rows.length ? formatProcessRows(rows, "PID   TTY    USER             HOST             MODE") : ["No active tty processes."];
  }
  return formatProcessRows(localProcesses(state));
}

function processStatus(row: ProcessRow): DesktopProcessStatus {
  if (row.command.startsWith("task ")) return "queued";
  if (row.command.startsWith("link ")) return "linked";
  if (row.command === "camp" || row.command.startsWith("tunnel ")) return "watching";
  if (row.command.endsWith(" foreground")) return "foreground";
  return "running";
}

function collectDesktopProcessEntries(state: ShellSessionState): DesktopProcessEntry[] {
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  return localProcesses(state)
    .map((row): DesktopProcessEntry => {
      const status = processStatus(row);
      const actions = row.pid === 1
        ? ["ps", "status"]
        : status === "queued"
          ? [`kill ${row.pid}`, "tasks", "task done <id>"]
          : [`kill ${row.pid}`, "ps", "events"];
      return {
        id: `proc:${row.pid}`,
        pid: row.pid,
        tty: String(row.tty),
        user: row.user.replace(/\s+/g, " ").slice(0, 48),
        host: row.host.replace(/\s+/g, " ").slice(0, 80),
        command: row.command.replace(/\s+/g, " ").slice(0, 120),
        status,
        source: status === "queued" ? "desktopTasks" : "session",
        actions,
      };
    })
    .slice(0, 48);
}

export function desktopProcessEntries(state: ShellSessionState): DesktopProcessEntry[] {
  return collectDesktopProcessEntries(state);
}

function formatScheduleTime(value: number | null): string {
  if (!value) return "never";
  return new Date(value).toISOString().slice(11, 16);
}

function addScheduleEntry(entries: DesktopScheduleEntry[], entry: Omit<DesktopScheduleEntry, "id">): void {
  const id = `sched:${entry.source}:${entry.name}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
  entries.push({
    id,
    ...entry,
    name: entry.name.replace(/\s+/g, " ").slice(0, 80),
    target: entry.target.replace(/\s+/g, " ").slice(0, 120),
    actions: entry.actions.slice(0, 4),
  });
}

function collectDesktopScheduleEntries(state: ShellSessionState): DesktopScheduleEntry[] {
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  const entries: DesktopScheduleEntry[] = [];
  for (const task of state.desktopTasks.slice(-16)) {
    addScheduleEntry(entries, {
      name: `${task.kind.toUpperCase()} ${task.target}`,
      trigger: task.label,
      target: task.target,
      status: task.status === "done" ? "ready" : "queued",
      lastRun: task.status === "done" ? formatScheduleTime(task.updatedAt) : "never",
      nextRun: task.status === "done" ? "manual" : "queued",
      source: "desktopTasks",
      actions: task.status === "done" ? ["tasks", "events task"] : ["tasks", `task done ${task.id}`, "task clear"],
    });
  }
  const lastEvent = state.desktopEvents.at(-1)?.createdAt ?? null;
  const lastMail = state.mailbox.at(-1)?.createdAt ?? null;
  addScheduleEntry(entries, {
    name: "Event Log Rotation",
    trigger: "every 12 events",
    target: currentHost(state),
    status: state.desktopEvents.length > 10 ? "running" : "ready",
    lastRun: formatScheduleTime(lastEvent),
    nextRun: `${Math.max(0, 12 - state.desktopEvents.length)} event(s)`,
    source: "desktopEvents",
    actions: ["events", "logs", "eventvwr"],
  });
  addScheduleEntry(entries, {
    name: "Mail Spool Sweep",
    trigger: "mailbox activity",
    target: state.username ?? "guest",
    status: state.mailbox.length ? "ready" : "disabled",
    lastRun: formatScheduleTime(lastMail),
    nextRun: state.mailbox.length ? "on login" : "no mailbox",
    source: "mailbox",
    actions: ["mailbox", "inbox", "mail <host>"],
  });
  addScheduleEntry(entries, {
    name: "Route Watcher",
    trigger: state.tunnel ? "tunnel active" : state.campHost ? "camp active" : "manual",
    target: state.tunnel ? `${state.tunnel.from}->${state.tunnel.to}` : state.campHost ?? currentHost(state),
    status: state.tunnel || state.campHost ? "running" : "ready",
    lastRun: formatScheduleTime(state.tunnel?.createdAt ?? state.campSince),
    nextRun: state.tunnel || state.campHost ? "watching" : "on tunnel",
    source: "routeState",
    actions: ["camp", "tunnel", "who"],
  });
  addScheduleEntry(entries, {
    name: "Board Index Refresh",
    trigger: "board read/post",
    target: currentHost(state),
    status: "ready",
    lastRun: formatScheduleTime(state.desktopEvents.filter((event) => event.source === "boards").at(-1)?.createdAt ?? null),
    nextRun: "on post",
    source: "desktopBoards",
    actions: ["boards", "bbs", "news"],
  });
  return entries
    .filter((entry, index, all) => all.findIndex((item) => item.id === entry.id) === index)
    .slice(0, 48);
}

export function desktopScheduleEntries(state: ShellSessionState): DesktopScheduleEntry[] {
  return collectDesktopScheduleEntries(state);
}

function handleKill(state: ShellSessionState, args: string[]): ShellResult["output"] {
  const pid = Number.parseInt(args[0] ?? "", 10);
  if (!Number.isFinite(pid)) return ["Usage: kill <pid>", "Use PS to list local process ids."];

  if (pid === 1) {
    return ["kill: refusing to kill the login shell; use LOGOUT"];
  }
  if (pid === 2) {
    return handleUnlink(state);
  }
  if (pid === 3) {
    return handleCamp(state, ["/off"]);
  }
  if (pid === 4) {
    return handleTunnel(state, ["/off"]);
  }
  if (pid === 5) {
    if (state.shellMode === "ftp") return leaveProtocolMode(state, "FTP").output;
    if (state.shellMode === "gopher") return leaveProtocolMode(state, "GOPHER").output;
    if (state.shellMode === "mail") return leaveProtocolMode(state, "MAIL").output;
    if (state.shellMode === "telex") return leaveProtocolMode(state, "TELEX").output;
    if (state.shellMode === "usenet") {
      state.shellMode = "shell";
      clearUsenetDraft(state);
      return ["USENET foreground job killed."];
    }
    if (state.shellMode === "irc") {
      state.shellMode = "shell";
      clearIrcState(state);
      return ["IRC foreground job killed."];
    }
    if (state.shellMode === "basic") {
      state.shellMode = "shell";
      state.basicProgram = null;
      return ["TeleBASIC foreground job killed."];
    }
    if (state.shellMode === "game") {
      state.shellMode = "shell";
      state.gameMode = null;
      return ["Adventure foreground job killed."];
    }
    if (state.shellMode === "monitor") {
      state.shellMode = "shell";
      return ["Monitor foreground job killed."];
    }
    return ["No foreground job to kill."];
  }
  if (pid >= 20) {
    const queued = normalizeDesktopTasks(state.desktopTasks).filter((task) => task.status !== "done");
    const task = queued[pid - 20];
    if (!task) return [`kill: ${pid}: no such local process`];
    return handleTask(["done", task.id], state);
  }

  return [`kill: ${pid}: no such local process`];
}

function handleBack(state: ShellSessionState): ShellResult["output"] {
  if (!state.remoteStack.length) return ["Already at the local shell."];
  const leavingHost = currentHost(state);
  const previous = state.remoteStack.pop();
  if (previous) {
    state.cwd = previous.cwd;
  }
  clearPacketCircuitIfLeavingHost(state, leavingHost);
  return ["Returned to previous shell context."];
}

function handleLogout(state: ShellSessionState): ShellResult["output"] {
  state.loggedIn = false;
  state.username = null;
  state.userId = null;
  state.remoteStack = [];
  state.cwd = "/";
  state.shellMode = "nli";
  state.pager = null;
  state.linkTargetSessionId = null;
  state.campHost = null;
  state.campSince = null;
  state.campCooldownUntil = null;
  state.tunnel = null;
  state.tunnelCooldownUntil = null;
  state.pendingPorthack = null;
  state.operatorRoutes = [];
  state.tollLedger = [];
  state.acousticCoupler = null;
  state.packetCircuit = null;
  state.mirrorInbox = [];
  state.bbsMode = false;
  state.bbsHost = null;
  state.bbsPhase = null;
  state.bbsSubmode = null;
  state.bbsGuestName = null;
  state.bbsDraftSubject = null;
  state.gameMode = null;
  state.gameLocation = null;
  state.gameInventory = [];
  state.basicProgram = null;
  state.usenetGroup = null;
  state.ircHost = null;
  state.ircChannel = null;
  state.ircNick = null;
  state.sshPublicKey = null;
  state.downloads = {};
  clearUsenetDraft(state);
  return ["Logged out."];
}

function handleLink(state: ShellSessionState, args: string[]): ShellResult["output"] {
  if (args[0]?.toLowerCase() === "/off") {
    return handleUnlink(state);
  }

  if (!args[0]) {
    if (state.linkTargetSessionId) {
      return [
        `Linked to ${state.linkTargetSessionId}.`,
        "Use LINK <user or port> to retarget the mirror.",
      ];
    }
    return ["Usage: link <user or port>"];
  }

  const target = resolveLinkTarget(state, args[0]!);
  if (!target) {
    return [`No active tty for ${args[0]}.`];
  }

  state.linkTargetSessionId = target.sessionId;
  const row = db.select().from(shellSessions).where(eq(shellSessions.id, target.sessionId)).get();
  if (row) {
    const rowState = row.state as unknown as Partial<ShellSessionState>;
    const mirrorInbox = Array.isArray(rowState.mirrorInbox) ? [...rowState.mirrorInbox] : [];
    mirrorInbox.push(`%link from port ${state.ttyPort} user ${state.username ?? "guest"}`);
    db.update(shellSessions)
      .set({
        state: {
          ...(rowState as Record<string, unknown>),
          mirrorInbox,
        },
        updatedAt: Date.now(),
      })
      .where(eq(shellSessions.id, target.sessionId))
      .run();
  }
  return [
    `Linked to ${target.label}.`,
    "The remote tty will mirror onto this shell.",
  ];
}

function handleUnlink(state: ShellSessionState): ShellResult["output"] {
  if (!state.linkTargetSessionId) {
    return ["No active link."];
  }
  const previous = state.linkTargetSessionId;
  state.linkTargetSessionId = null;
  return [`Link to ${previous} closed.`];
}

function resolveLinkTarget(state: ShellSessionState, target: string): { sessionId: string; label: string } | null {
  const lowered = target.trim().toLowerCase();
  if (!lowered) return null;

  const sessions = db.select().from(shellSessions).all();

  if (/^\d+$/.test(lowered)) {
    const match = sessions.find((row) => {
      const rowState = row.state as unknown as Partial<ShellSessionState>;
      return row.id !== state.sessionId && String(rowState.ttyPort ?? "") === lowered;
    });
    if (match) {
      const rowState = match.state as unknown as Partial<ShellSessionState>;
      return {
        sessionId: match.id,
        label: `${rowState.username ?? "guest"}@port ${rowState.ttyPort ?? lowered}`,
      };
    }
  }

  const userRow = db.select().from(users).where(eq(users.username, lowered)).get();
  if (!userRow) return null;

  const targetSession = sessions
    .filter((row) => row.userId === userRow.id && row.id !== state.sessionId)
    .sort((a, b) => b.updatedAt - a.updatedAt)[0];

  if (!targetSession) return null;

  const rowState = targetSession.state as unknown as Partial<ShellSessionState>;
  return {
    sessionId: targetSession.id,
    label: `${userRow.username} on port ${rowState.ttyPort ?? "?"}`,
  };
}

function handleGlitch(): ShellResult["output"] {
  return [
    "A tray icon flickers. The shell stutters for a frame.",
  ];
}

export async function executeLine(
  state: ShellSessionState,
  line: string,
  options: { recordHistory?: boolean } = {}
): Promise<ShellResult> {
  const trimmed = line.trim();
  if (!trimmed) return { output: [], state };

  cleanupStealthState(state, Date.now());
  state.commandHistory = normalizeCommandHistory(state.commandHistory);

  if (state.pager) {
    const pagerResult = runPagerCommand(state, trimmed);
    if (pagerResult) return pagerResult;
    state.pager = null;
  }

  if (state.bbsMode) {
    const { output, exit, pager } = runBbsCommand(state, trimmed);
    if (output.some((line) => line === "Message posted.")) {
      recordDesktopEvent(state, "info", "boards", `bbs posted ${state.bbsHost ?? currentHost(state)}`);
    }
    if (output.some((line) => line.includes("SYSOP claim recorded."))) {
      recordDesktopEvent(state, "info", "boards", `bbs sysop claimed ${state.bbsHost ?? currentHost(state)}`);
    }
    if (exit) {
      state.bbsMode = false;
      state.bbsHost = null;
      state.bbsPhase = null;
      state.bbsSubmode = null;
      state.bbsGuestName = null;
      state.bbsDraftSubject = null;
    }
    if (pager || output.length > 12) {
      return beginPager(state, output);
    }
    return { output, state };
  }

  if (state.pendingPorthack) {
    const response = trimmed.toLowerCase();
    if (!["yes", "no", "n", "cancel", "abort"].includes(response)) {
      return {
        output: [
          "CAPTCHA requires YES to continue or NO to abort.",
          `Waiting on challenge for ${state.pendingPorthack.target}.`,
        ],
        state,
      };
    }
    return { output: confirmPorthack(state, trimmed), state };
  }

  if (state.shellMode === "monitor") {
    const [monitorCmdRaw, ...monitorArgs] = trimmed.split(/\s+/);
    return runMonitorCommand(state, monitorCmdRaw.toLowerCase(), monitorArgs);
  }

  if (state.shellMode === "basic") {
    const [basicCmdRaw, ...basicArgs] = trimmed.split(/\s+/);
    return runBasicCommand(state, basicCmdRaw.toLowerCase(), basicArgs);
  }

  if (state.shellMode === "usenet") {
    const [usenetCmdRaw, ...usenetArgs] = trimmed.split(/\s+/);
    return runUsenetCommand(state, usenetCmdRaw.toLowerCase(), usenetArgs);
  }

  if (state.shellMode === "ftp") {
    const [ftpCmdRaw, ...ftpArgs] = trimmed.split(/\s+/);
    return runFtpCommand(state, ftpCmdRaw.toLowerCase(), ftpArgs);
  }

  if (state.shellMode === "gopher") {
    const [gopherCmdRaw, ...gopherArgs] = trimmed.split(/\s+/);
    return runGopherCommand(state, gopherCmdRaw.toLowerCase(), gopherArgs);
  }

  if (state.shellMode === "mail") {
    const [mailCmdRaw, ...mailArgs] = trimmed.split(/\s+/);
    return runMailCommand(state, mailCmdRaw.toLowerCase(), mailArgs);
  }

  if (state.shellMode === "telex") {
    const [telexCmdRaw, ...telexArgs] = trimmed.split(/\s+/);
    return runTelexCommand(state, telexCmdRaw.toLowerCase(), telexArgs);
  }

  if (state.shellMode === "irc") {
    const [ircCmdRaw, ...ircArgs] = trimmed.split(/\s+/);
    return runIrcCommand(state, ircCmdRaw.toLowerCase(), ircArgs);
  }

  if (state.shellMode === "game") {
    const [gameVerbRaw, ...gameRest] = trimmed.split(/\s+/);
    return {
      output: runGameCommand(state, gameVerbRaw.toLowerCase(), gameRest.join(" ").trim()),
      state,
    };
  }

  if (trimmed.includes("|")) {
    if (options.recordHistory !== false) recordCommandHistory(state, trimmed);
    const [base, ...stages] = trimmed.split("|").map((part) => part.trim()).filter(Boolean);
    if (!base || !stages.length) {
      return { output: ["Usage: <command> | <filter>"], state };
    }
    const result = await executeLine(state, base, { recordHistory: false });
    const pending = result.pager ? remainingPagerLines(state.pager) : [];
    const allLines = [...result.output, ...pending];
    state.pager = null;
    const output = applyPipeline(allLines, stages);
    return beginPager(state, output);
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0]!.toLowerCase();
  const args = parts.slice(1);
  if (options.recordHistory !== false) recordCommandHistory(state, trimmed);

  if (cmd === "?") {
    return { output: formatCommandList(state), state };
  }

  if (cmd === "help") {
    if (args[0]) {
      return { output: [describeCommand(args[0]!)], state };
    }
    return beginPager(state, formatCommandList(state));
  }

  if (cmd === "clear") {
    return { output: ["\x0c"], state };
  }

  if (cmd === "date") {
    return { output: [new Date().toString()], state };
  }

  if (cmd === "echo") {
    return { output: [args.join(" ")], state };
  }

  if (cmd === "uptime") {
    return { output: [`up 28 days, load 0.76, ${hostCount()} hosts`], state };
  }

  if (cmd === "joke") {
    return { output: ["Why do programmers prefer dark mode? Because light attracts bugs."], state };
  }

  if (cmd === "basic") {
    return enterBasic(state);
  }

  if (cmd === "clock") {
    return { output: handleClock(), state };
  }

  if (cmd === "ddate") {
    return { output: handleDdate(), state };
  }

  if (cmd === "weather") {
    return { output: ["Mountain View, CA: 72F, clear"], state };
  }

  if (cmd === "when") {
    return { output: handleWhen(), state };
  }

  if (cmd === "rand") {
    return { output: handleRand(args), state };
  }

  if (cmd === "roll") {
    return { output: handleRoll(args), state };
  }

  if (cmd === "rot13") {
    return { output: handleRot13(args), state };
  }

  if (cmd === "md5") {
    return { output: handleMd5(args), state };
  }

  if (cmd === "ipaddr") {
    return { output: handleIpaddr(state), state };
  }

  if (cmd === "mac") {
    return { output: handleMac(state), state };
  }

  if (cmd === "uuplot") {
    return { output: handleUuplot(state, args), state };
  }

  if (cmd === "calc") {
    return { output: handleCalc(args), state };
  }

  if (cmd === "factor") {
    return { output: handleFactor(args), state };
  }

  if (cmd === "primes") {
    return { output: handlePrimes(args), state };
  }

  if (cmd === "ping") {
    return { output: handlePing(args), state };
  }

  if (cmd === "pong") {
    return { output: ["ping"], state };
  }

  if (cmd === "morse") {
    return { output: handleMorse(args), state };
  }

  if (cmd === "cowsay") {
    return { output: handleCowsay(args), state };
  }

  if (cmd === "figlet") {
    return { output: handleFiglet(args), state };
  }

  if (cmd === "privacy") {
    return { output: handlePrivacy(), state };
  }

  if (cmd === "rfc") {
    return { output: handleRfc(args), state };
  }

  if (cmd === "notes") {
    return { output: handleNotes(), state };
  }

  if (cmd === "relay") {
    return enterRelay(state, args[0]);
  }

  if (cmd === "talk") {
    return enterTalk(state, args[0]);
  }

  if (cmd === "bookmark" || cmd === "bookmarks") {
    return { output: handleBookmark(cmd === "bookmarks" && args.length === 0 ? ["list"] : args, state), state };
  }

  if (cmd === "task" || cmd === "tasks") {
    return { output: handleTask(cmd === "tasks" && args.length === 0 ? ["list"] : args, state), state };
  }

  if (cmd === "taskmgr") {
    return { output: formatDesktopTaskManager(state, args), state };
  }

  if (cmd === "scheduler" || cmd === "schtasks") {
    return { output: formatDesktopScheduler(state, args), state };
  }

  if (cmd === "events" || cmd === "eventvwr" || cmd === "logs") {
    return { output: formatDesktopEvents(state, args), state };
  }

  if (cmd === "files") {
    return { output: formatDesktopFiles(state, args), state };
  }

  if (cmd === "offline" || cmd === "sync" || cmd === "mobsync" || cmd === "mobsync.exe" || cmd === "syncmgr") {
    return { output: formatDesktopOffline(state, args), state };
  }

  if (cmd === "mailbox") {
    return { output: formatDesktopMailbox(state, args), state };
  }

  if (cmd === "boards") {
    return { output: formatDesktopBoards(state, args), state };
  }

  if (cmd === "system" || cmd === "sysdm") {
    return { output: formatDesktopSystem(state, args), state };
  }

  if (cmd === "winver") {
    return {
      output: [
        systemVersionForTheme(state.desktopTheme),
        `Computer: ${currentHost(state)}`,
        `Registered to: ${state.loggedIn ? state.username : "guest"}`,
      ],
      state,
    };
  }

  if (cmd === "control" || cmd === "cpl") {
    return { output: formatDesktopControl(state, args), state };
  }

  if (cmd === "accounts" || cmd === "nusrmgr.cpl") {
    return { output: formatDesktopAccounts(state, args), state };
  }

  if (cmd === "credentials" || cmd === "creds" || cmd === "keymgr" || cmd === "keymgr.dll" || cmd === "controlkeymgr") {
    return { output: formatDesktopCredentials(state, args), state };
  }

  if (cmd === "datetime" || cmd === "timedate.cpl") {
    return { output: formatDesktopTime(state, args), state };
  }

  if (cmd === "display" || cmd === "desk.cpl") {
    return { output: formatDesktopDisplay(state, args), state };
  }

  if (cmd === "sounds" || cmd === "mmsys.cpl") {
    return { output: formatDesktopSounds(state, args), state };
  }

  if (cmd === "power" || cmd === "powercfg.cpl") {
    return { output: formatDesktopPower(state, args), state };
  }

  if (cmd === "mouse" || cmd === "main.cpl") {
    return { output: formatDesktopMouse(state, args), state };
  }

  if (cmd === "keyboard" || cmd === "kbd.cpl") {
    return { output: formatDesktopKeyboard(state, args), state };
  }

  if (cmd === "accessibility" || cmd === "access.cpl") {
    return { output: formatDesktopAccessibility(state, args), state };
  }

  if (cmd === "regional" || cmd === "intl.cpl") {
    return { output: formatDesktopRegional(state, args), state };
  }

  if (cmd === "modems" || cmd === "telephon.cpl") {
    return { output: formatDesktopModems(state, args), state };
  }

  if (cmd === "odbc" || cmd === "odbcad32") {
    return { output: formatDesktopOdbc(state, args), state };
  }

  if (cmd === "programs" || cmd === "appwiz.cpl") {
    return { output: formatDesktopPrograms(state, args), state };
  }

  if (cmd === "internet" || cmd === "inetcpl") {
    return { output: formatDesktopInternet(state, args), state };
  }

  if (cmd === "firewall" || cmd === "firewall.cpl") {
    return { output: formatDesktopFirewall(state, args), state };
  }

  if (cmd === "updates" || cmd === "wuaucpl.cpl" || cmd === "windowsupdate") {
    return { output: formatDesktopUpdates(state, args), state };
  }

  if (cmd === "performance" || cmd === "perfmon" || cmd === "perfmon.msc") {
    return { output: formatDesktopPerformance(state, args), state };
  }

  if (cmd === "restore" || cmd === "rstrui" || cmd === "rstrui.exe") {
    return { output: formatDesktopRestore(state, args), state };
  }

  if (cmd === "computer" || cmd === "compmgmt" || cmd === "compmgmt.msc") {
    return { output: formatDesktopComputer(state, args), state };
  }

  if (cmd === "disk" || cmd === "diskmgmt" || cmd === "diskmgmt.msc") {
    return { output: formatDesktopDisk(state, args), state };
  }

  if (cmd === "eventviewer" || cmd === "eventvwr.msc") {
    return { output: formatDesktopEventViewer(state, args), state };
  }

  if (cmd === "search" || cmd === "find" || cmd === "srchui") {
    return { output: formatDesktopSearch(state, args), state };
  }

  if (cmd === "connections" || cmd === "ncpa.cpl" || cmd === "netconnections") {
    return { output: formatDesktopConnections(state, args), state };
  }

  if (cmd === "netsetup" || cmd === "netsetup.cpl") {
    return { output: formatDesktopNetSetup(state, args), state };
  }

  if (cmd === "netdiag" || cmd === "diagnose") {
    return { output: formatDesktopNetDiagnostics(state, args), state };
  }

  if (cmd === "mapdrive" || (cmd === "net" && args[0]?.toLowerCase() === "use")) {
    return { output: formatDesktopMappedDrives(state, cmd === "net" ? args.slice(1) : args), state };
  }

  if (cmd === "support" || cmd === "helpctr" || cmd === "helpctr.exe") {
    return { output: formatDesktopHelp(state, args), state };
  }

  if (cmd === "folders" || cmd === "folderopts") {
    return { output: formatDesktopFolders(state, args), state };
  }

  if (cmd === "network") {
    return { output: formatDesktopNetwork(state, args), state };
  }

  if (cmd === "phonebook") {
    return { output: formatPhonebook(state, args), state };
  }

  if (cmd === "coupler") {
    return handleCoupler(state, args);
  }

  if (cmd === "dialup") {
    return { output: formatDesktopDialup(state, args), state };
  }

  if (cmd === "lineage" || cmd === "era") {
    return { output: formatDesktopLineage(state, args), state };
  }

  if (cmd === "remote" || cmd === "mstsc" || cmd === "mstsc.exe" || cmd === "tsclient") {
    return { output: formatDesktopRemote(state, args), state };
  }

  if (cmd === "runbox" || cmd === "start" || cmd === "explorer" || cmd === "cmd" || cmd === "cmd.exe" || cmd === "command.com" || cmd === "runas") {
    return { output: formatDesktopRun(state, cmd === "runbox" || cmd === "start" ? args : [cmd, ...args]), state };
  }

  if (cmd === "devices" || cmd === "devmgmt") {
    return { output: formatDesktopDevices(state, args), state };
  }

  if (cmd === "nodes") {
    return { output: formatDesktopNodes(state, args), state };
  }

  if (cmd === "security") {
    return { output: formatDesktopSecurity(state, args), state };
  }

  if (cmd === "services") {
    return { output: formatDesktopServices(state, args), state };
  }

  if (cmd === "shares") {
    return { output: formatDesktopShares(state, args), state };
  }

  if (cmd === "printers" || cmd === "printq") {
    return { output: formatDesktopPrinters(state, args), state };
  }

  if (cmd === "registry" || cmd === "reg") {
    const queryArgs = cmd === "reg" && args[0]?.toLowerCase() === "query" ? args.slice(1) : args;
    return { output: formatDesktopRegistry(state, queryArgs), state };
  }

  if (cmd === "units") {
    return { output: handleUnits(args), state };
  }

  if (cmd === "2048") {
    return { output: handle2048(), state };
  }

  if (cmd === "aquarium") {
    return { output: handleAquarium(), state };
  }

  if (cmd === "rain") {
    return { output: handleRain(), state };
  }

  if (cmd === "starwars") {
    return { output: handleStarwars(), state };
  }

  if (cmd === "eliza") {
    return { output: handleEliza(args), state };
  }

  if (cmd === "phoon") {
    return { output: handlePhoon(), state };
  }

  if (cmd === "pig") {
    return { output: handlePig(args), state };
  }

  if (cmd === "fnord") {
    return { output: handleFnord(), state };
  }

  if (cmd === "qr") {
    return { output: handleQr(args), state };
  }

  if (cmd === "a2") {
    return { output: handleA2(args), state };
  }

  if (cmd === "ac") {
    return { output: handleAc(args), state };
  }

  if (cmd === "advent") {
    return { output: handleZcode(state, ["advent.gam"]), state };
  }

  if (cmd === "bf") {
    return { output: handleBrainfuck(args), state };
  }

  if (cmd === "c8") {
    return { output: handleC8(), state };
  }

  if (cmd === "cal") {
    return { output: handleCal(args), state };
  }

  if (cmd === "ching") {
    return { output: handleChing(args), state };
  }

  if (cmd === "geoip") {
    return { output: handleGeoip(state, args), state };
  }

  if (cmd === "octopus") {
    return { output: handleOctopus(), state };
  }

  if (cmd === "rig") {
    return { output: handleRig(), state };
  }

  if (cmd === "sleep") {
    return { output: handleSleep(args), state };
  }

  if (cmd === "typespeed") {
    return { output: handleTypespeed(args), state };
  }

  if (cmd === "qotd") {
    return { output: handleQotd(), state };
  }

  if (cmd === "hosts") {
    const rows = listHosts(args[0]);
    const lines = ["Host            Organization                   Location", "----            ------------                   --------"];
    for (const h of rows.slice(0, 20)) {
      lines.push(`${h.hostname.padEnd(16)}${h.org.slice(0, 30).padEnd(31)}${h.location.slice(0, 20)}`);
    }
    lines.push(`(${hostCount()} hosts on network)`);
    return beginPager(state, lines);
  }

  if (cmd === "users") {
    return { output: handleUsers(), state };
  }

  if (cmd === "who") {
    return { output: handleWho(), state };
  }

  if (cmd === "finger") {
    return { output: handleFinger(state, args[0]), state };
  }

  if (cmd === "login") {
    if (args.length < 2) {
      return { output: ["Usage: login <user> <password>"], state };
    }
    const [username, password] = args;
    const row = db.select().from(users).where(eq(users.username, username!)).get();
    if (!row || !(await bcrypt.compare(password!, row.passwordHash))) {
      return { output: ["Login incorrect."], state };
    }
    state.loggedIn = true;
    state.username = row.username;
    state.userId = row.id;
    state.badges = row.badges ?? [];
    state.homeHost = row.homeHost;
    state.sshPublicKey = row.sshPublicKey ?? null;
    state.desktopTheme = isDesktopTheme(row.desktopTheme) ? row.desktopTheme : "xp";
    state.shellMode = "shell";
    state.cwd = `/home/${row.username}`;
    const hs = db.select().from(hostState).all();
    state.loginHosts = hs.filter((h) => (h.loginUserIds as number[]).includes(row.id)).map((h) => h.hostname);
    state.rootHosts = hs.filter((h) => h.rootUserId === row.id).map((h) => h.hostname);
    return { output: [`Welcome to Cyberscape, ${row.username}.`], state };
  }

  if (cmd === "newuser") {
    if (args.length < 2) {
      return { output: ["Usage: newuser <user> <password>"], state };
    }
    const [username, password] = args;
    if (username!.length < 3) {
      return { output: ["Username too short."], state };
    }
    const existing = db.select().from(users).where(eq(users.username, username!)).get();
    if (existing) {
      return { output: ["Username already exists."], state };
    }
    const hash = await bcrypt.hash(password!, 10);
    const starterBadges = grantStarterBadges();
    const starterProgress = progressionForBadges(starterBadges);
    db.insert(users).values({
      username: username!,
      passwordHash: hash,
      badges: starterBadges,
      homeHost: "cyberscape",
      diskQuota: starterProgress.diskQuota,
      systemLevel: starterProgress.systemLevel,
      desktopTheme: state.desktopTheme,
    }).run();
    const inserted = db.select().from(users).where(eq(users.username, username!)).get()!;
    state.loggedIn = true;
    state.username = inserted.username;
    state.userId = inserted.id;
    state.badges = (inserted.badges as string[]) ?? [];
    state.sshPublicKey = inserted.sshPublicKey ?? null;
    state.desktopTheme = isDesktopTheme(inserted.desktopTheme) ? inserted.desktopTheme : state.desktopTheme;
    syncUserProgress(state);
    state.shellMode = "shell";
    state.cwd = `/home/${inserted.username}`;
    return { output: [`Account created. Welcome, ${username}.`], state };
  }

  if (cmd === "theme") {
    state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
    const next = args[0]?.toLowerCase();
    if (!next) {
      return {
        output: [
          `Theme: ${state.desktopTheme}`,
          `Preferences: motion=${state.desktopPrefs.motion} font=${state.desktopPrefs.fontSize} contrast=${state.desktopPrefs.contrast} sound=${state.desktopPrefs.sound} keyboard=${state.desktopPrefs.keyboardMode}`,
          "Available: nt 2000 xp 7",
          "Preference commands: theme pref motion normal|reduced · theme pref font normal|large · theme pref contrast normal|high · theme pref sound muted|on · theme pref keyboard desktop|terminal",
        ],
        state,
      };
    }
    if (next === "pref") {
      const key = args[1]?.toLowerCase();
      const value = args[2]?.toLowerCase();
      if (!key || !value || !setDesktopPref(state, key, value)) {
        return { output: ["Usage: theme pref motion normal|reduced OR theme pref font normal|large OR theme pref contrast normal|high OR theme pref sound muted|on OR theme pref keyboard desktop|terminal"], state };
      }
      return {
        output: [`Preference set: ${key}=${value}`, `Preferences: motion=${state.desktopPrefs.motion} font=${state.desktopPrefs.fontSize} contrast=${state.desktopPrefs.contrast} sound=${state.desktopPrefs.sound} keyboard=${state.desktopPrefs.keyboardMode}`],
        state,
      };
    }
    if (!isDesktopTheme(next)) {
      return { output: ["Usage: theme <nt|2000|xp|7>"], state };
    }
    state.desktopTheme = next;
    if (state.userId) {
      db.update(users)
        .set({ desktopTheme: next })
        .where(eq(users.id, state.userId))
        .run();
    }
    return { output: [`Theme set: ${state.desktopTheme}`], state };
  }

  if (cmd === "desktop") {
    const next = args[0]?.toLowerCase();
    if (!next) {
      return {
        output: [
          `Available: ${DESKTOP_APPS.join(" ")}`,
          "Window commands: desktop open|focus|restore|min|max|close <app> · desktop move <app> <x> <y>",
          "Control commands: desktop export · desktop reset layout|prefs|all",
          ...formatDesktopApp(state),
        ],
        state,
      };
    }
    if (next === "export") {
      return { output: exportDesktopPresentation(state), state };
    }
    if (next === "reset") {
      const message = resetDesktopPresentation(state, args[1]?.toLowerCase());
      if (!message) return { output: ["Usage: desktop reset layout|prefs|all"], state };
      return { output: [message, ...formatDesktopApp(state)], state };
    }
    if (next === "move") {
      const app = args[1]?.toLowerCase();
      if (!isDesktopAppId(app)) {
        return { output: [`Usage: desktop move <${DESKTOP_APPS.join("|")}> <x> <y>`], state };
      }
      const message = moveDesktopWindow(state, app, args[2], args[3]);
      if (!message) return { output: [`Usage: desktop move ${app} <x> <y>`], state };
      return { output: [message, ...formatDesktopApp(state)], state };
    }
    const maybeAction = next === "open" || next === "focus" || next === "restore" || next === "min" || next === "max" || next === "close"
      ? next
      : null;
    if (maybeAction) {
      const app = args[1]?.toLowerCase();
      if (!isDesktopAppId(app)) {
        return { output: [`Usage: desktop ${maybeAction} <${DESKTOP_APPS.join("|")}>`], state };
      }
      const message = setDesktopWindow(state, maybeAction, app);
      return { output: [message, ...formatDesktopApp(state)], state };
    }
    if (!isDesktopAppId(next)) {
      return { output: [`Usage: desktop <${DESKTOP_APPS.join("|")}> or desktop open|focus|restore|min|max|close <app> or desktop move <app> <x> <y> or desktop export/reset`], state };
    }
    const message = setDesktopWindow(state, "focus", next);
    return { output: [message, ...formatDesktopApp(state)], state };
  }

  if (cmd === "history") {
    return { output: handleHistory(state, args), state };
  }

  const transport = handleTransportVerb(state, cmd, args);
  if (transport) {
    return transport;
  }

  if (cmd === "back") {
    return { output: handleBack(state), state };
  }

  if (!state.loggedIn) {
    return { output: ["Not logged in. Type LOGIN or NEWUSER."], state };
  }

  if (cmd === "pwd") {
    return { output: [state.cwd], state };
  }

  if (cmd === "cd") {
    const target = args[0] ?? "/home/" + state.username;
    state.cwd = target.startsWith("/") ? target : `${state.cwd}/${target}`;
    return { output: [], state };
  }

  if (cmd === "ls" || cmd === "dir") {
    const host = getHost(currentHost(state));
    const files = host?.files ?? { "notes.txt": "nothing here" };
    return {
      output: [
        ...Object.keys(files),
        ...Object.keys(state.downloads ?? {}),
        ...userFileRows(state).map((file) => displayFileName(file.path)),
      ],
      state,
    };
  }

  if (cmd === "cat") {
    const name = args[0];
    const file = visibleFileBody(state, name);
    if (!file) {
      return { output: [`${name ?? ""}: not found`], state };
    }
    return beginPager(state, file.body.split("\n"));
  }

  if (cmd === "write") {
    return { output: handleWriteFile(state, args), state };
  }

  if (cmd === "append") {
    return { output: handleWriteFile(state, args, true), state };
  }

  if (cmd === "rm") {
    return { output: handleRemoveFile(state, args), state };
  }

  if (cmd === "cp") {
    return { output: handleCopyMoveFile(state, args), state };
  }

  if (cmd === "mv") {
    return { output: handleCopyMoveFile(state, args, true), state };
  }

  if (cmd === "send") {
    return { output: handleSend(state, args), state };
  }

  if (cmd === "inbox") {
    return { output: handleInbox(state), state };
  }

  if (cmd === "uupath") {
    const from = args[0] ?? currentHost(state);
    const to = args[1];
    if (!to) return { output: ["Usage: uupath <from> <to>"], state };
    return { output: uupath(from, to), state };
  }

  if (cmd === "uumap") {
    return beginPager(state, uumap(args[0] ?? currentHost(state)));
  }

  if (cmd === "netstat") {
    return beginPager(
      state,
      netstatForUser(state.username!, state.loginHosts, state.rootHosts),
    );
  }

  if (cmd === "wardial") {
    const lines = wardial(currentHost(state), state);
    return { output: lines, state };
  }

  if (cmd === "call") {
    if (!state.loggedIn) {
      return { output: ["Not logged in. Type LOGIN or NEWUSER."], state };
    }
    if (args[0] !== "-151" && args[0] !== "monitor") {
      return { output: ["Usage: call -151"], state };
    }
    return enterMonitor(state);
  }

  if (cmd === "porthack") {
    const target = args[0];
    if (!target) return { output: ["Usage: porthack <host>"], state };
    return { output: attemptPorthack(state, target), state };
  }

  if (cmd === "rootkit") {
    const target = args[0] ?? currentHost(state);
    return { output: attemptRootkit(state, target), state };
  }

  if (cmd === "scores") {
    return { output: handleScores(state, args[0]), state };
  }

  if (cmd === "bbs") {
    const host = getHost(currentHost(state));
    if (!host?.bbs_config) {
      return { output: ["No BBS on this host."], state };
    }
    const banner = enterBbs(state, host.hostname, "local");
    state.bbsMode = true;
    state.bbsHost = host.hostname;
    return { output: banner.output, state };
  }

  if (cmd === "stty") {
    if (args[0] === "/dumb") state.stty = "dumb";
    else if (args[0] === "/tty") state.stty = "tty";
    else state.stty = "normal";
    return { output: [`STTY mode: ${state.stty}`], state };
  }

  if (cmd === "usenet") {
    return enterUsenet(state);
  }

  if (cmd === "games") {
    return { output: handleGames(), state };
  }

  if (cmd === "alias") {
    return { output: handleAlias(state), state };
  }

  if (cmd === "ver") {
    return { output: handleVersion(), state };
  }

  if (cmd === "today") {
    return { output: handleToday(), state };
  }

  if (cmd === "status") {
    return { output: handleStatus(state), state };
  }

  if (cmd === "whoami") {
    return { output: handleWhoAmI(state), state };
  }

  if (cmd === "motd") {
    return { output: handleMotd(state), state };
  }

  if (cmd === "inventory") {
    return { output: handleInventory(state), state };
  }

  if (cmd === "owned") {
    return { output: handleOwned(state), state };
  }

  if (cmd === "look") {
    return { output: handleLook(state), state };
  }

  if (cmd === "scan") {
    return { output: handleScan(state), state };
  }

  if (cmd === "inspect") {
    return { output: handleInspect(state), state };
  }

  if (cmd === "grep" || cmd === "find") {
    return { output: handleSearch(state, args.join(" ")), state };
  }

  if (cmd === "trace" || cmd === "traceroute") {
    return { output: handleTrace(args, state), state };
  }

  if (cmd === "save") {
    return { output: handleSave(state, args), state };
  }

  if (cmd === "load") {
    return { output: handleLoad(state, args), state };
  }

  if (cmd === "link") {
    return { output: handleLink(state, args), state };
  }

  if (cmd === "unlink") {
    return { output: handleUnlink(state), state };
  }

  if (cmd === "solve") {
    return { output: handleSolve(state, args.join(" ")), state };
  }

  if (cmd === "set") {
    return { output: handleSet(state, args), state };
  }

  if (cmd === "secure") {
    return { output: handleSecure(state), state };
  }

  if (cmd === "takeover") {
    return { output: handleTakeover(state), state };
  }

  if (cmd === "logout") {
    return { output: handleLogout(state), state };
  }

  if (cmd === "camp") {
    return { output: handleCamp(state, args), state };
  }

  if (cmd === "tunnel") {
    return { output: handleTunnel(state, args), state };
  }

  if (cmd === "ps") {
    return { output: handlePs(state, args), state };
  }

  if (cmd === "kill") {
    return { output: handleKill(state, args), state };
  }

  if (cmd === "glitch") {
    return { output: handleGlitch(), state };
  }

  if (cmd === "run") {
    return { output: handleZcode(state, args), state };
  }

  if (cmd === "zork" || cmd === "zc" || cmd === "zrun" || cmd === "zcode") {
    return { output: handleZcode(state, args), state };
  }

  if (cmd === "exit" || cmd === "quit") {
    if (state.remoteStack.length) {
      const leavingHost = currentHost(state);
      const previous = state.remoteStack.pop();
      if (previous) {
        state.cwd = previous.cwd;
      }
      clearPacketCircuitIfLeavingHost(state, leavingHost);
      return { output: ["Connection closed."], state };
    }
    return { output: ["Use LOGOUT from @ prompt."], state };
  }

  return { output: [`${cmd}: command not found`], state };
}

export function nliBanner(): string[] {
  return [
    "Connected to CYBERSCAPE",
    "",
    `It is ${new Date().toLocaleString()} in Mountain View, California, USA.`,
    `There are hosts on the network (${hostCount()} imported).`,
    "",
    "  Type ? for a command list.",
    "  Type HELP for a more detailed command listing.",
    "  Press control-C to interrupt any command.",
    "",
    "May the command line live forever.",
    "",
  ];
}

export { prompt, initialShellState };
