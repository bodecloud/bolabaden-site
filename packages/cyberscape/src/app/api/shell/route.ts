import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, ensureDb } from "@/lib/db";
import { shellSessions, users } from "@/lib/db/schema";
import {
  desktopAccessibilityEntries,
  desktopAccountEntries,
  desktopBoardEntries,
  desktopComputerEntries,
  desktopConnectionEntries,
  desktopControlEntries,
  desktopCredentialEntries,
  desktopDisplayEntries,
  desktopDeviceEntries,
  desktopDialupEntries,
  desktopDiskEntries,
  desktopEventViewerEntries,
  desktopFileEntries,
  desktopFirewallEntries,
  desktopFolderEntries,
  desktopHelpEntries,
  desktopInternetEntries,
  desktopKeyboardEntries,
  desktopLineageEntries,
  desktopMappedDriveEntries,
  desktopMailEntries,
  desktopModemEntries,
  desktopMouseEntries,
  desktopNetDiagnosticEntries,
  desktopNetSetupEntries,
  desktopNetworkEntries,
  desktopNodeEntries,
  desktopOdbcEntries,
  desktopOfflineEntries,
  desktopPerformanceEntries,
  desktopPowerEntries,
  desktopPrintEntries,
  desktopProgramEntries,
  desktopProcessEntries,
  desktopRegistryEntries,
  desktopRegionalEntries,
  desktopRemoteEntries,
  desktopRestoreEntries,
  desktopRunEntries,
  desktopScheduleEntries,
  desktopSearchEntries,
  desktopSecurityEntries,
  desktopServiceEntries,
  desktopShareEntries,
  desktopSoundEntries,
  desktopSystemEntries,
  desktopTimeEntries,
  desktopUpdateEntries,
  executeLine,
  initialShellState,
  nliBanner,
  prompt,
} from "@/lib/shell/engine";
import { shapeOutputForStty } from "@/lib/shell/stty";
import type { ShellSessionState } from "@/lib/shell/types";
import {
  currentHost,
  isDesktopAppId,
  isDesktopTheme,
  normalizeCommandHistory,
  normalizeDesktopAppList,
  normalizeDesktopBookmarks,
  normalizeDesktopEvents,
  normalizeDesktopPrefs,
  normalizeDesktopTasks,
  normalizeDesktopWindowPositions,
  normalizeDesktopWindowState,
  setDesktopPref,
} from "@/lib/shell/types";
import { progressionForBadges } from "@/lib/progression/engine";

ensureDb();

const CAMP_TTL_MS = 180_000;
const TUNNEL_TTL_MS = 240_000;

function cleanPersistedStealthTimers(state: ShellSessionState): void {
  const now = Date.now();

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

function loadState(sessionId: string): ShellSessionState {
  const row = db.select().from(shellSessions).where(eq(shellSessions.id, sessionId)).get();
  const state = row?.state ? (row.state as unknown as ShellSessionState) : initialShellState();
  state.sessionId = sessionId;
  state.mirrorInbox ??= [];
  state.pager ??= null;
  state.stty ??= "normal";
  if (!isDesktopTheme(state.desktopTheme)) state.desktopTheme = "xp";
  if (!isDesktopAppId(state.desktopActiveApp)) state.desktopActiveApp = "terminal";
  normalizeDesktopWindowState(state);
  state.desktopWindowPositions = normalizeDesktopWindowPositions(state.desktopWindowPositions);
  state.desktopPrefs = normalizeDesktopPrefs(state.desktopPrefs);
  state.desktopBookmarks = normalizeDesktopBookmarks(state.desktopBookmarks);
  state.commandHistory = normalizeCommandHistory(state.commandHistory);
  state.desktopTasks = normalizeDesktopTasks(state.desktopTasks);
  state.desktopEvents = normalizeDesktopEvents(state.desktopEvents);
  state.linkTargetSessionId ??= null;
  state.bbsDraftSubject ??= null;
  state.basicProgram ??= null;
  state.basicUserPrograms ??= {};
  state.usenetGroup ??= null;
  state.usenetSubmode ??= null;
  state.usenetDraftGroup ??= null;
  state.usenetDraftSubject ??= null;
  state.ircHost ??= null;
  state.ircChannel ??= null;
  state.ircNick ??= null;
  state.campHost ??= null;
  state.campSince ??= null;
  state.campCooldownUntil ??= null;
  state.tunnel ??= null;
  state.tunnelCooldownUntil ??= null;
  state.pendingPorthack ??= null;
  state.sshPublicKey ??= null;
  state.downloads ??= {};
  state.operatorRoutes ??= [];
  state.tollLedger ??= [];
  state.acousticCoupler ??= null;
  if (state.userId) {
    const userRow = db.select().from(users).where(eq(users.id, state.userId)).get();
    state.sshPublicKey = userRow?.sshPublicKey ?? state.sshPublicKey;
    if (isDesktopTheme(userRow?.desktopTheme)) state.desktopTheme = userRow.desktopTheme;
  }
  cleanPersistedStealthTimers(state);
  return state;
}

function drainMirrorInbox(state: ShellSessionState): string[] {
  const lines = state.mirrorInbox.length ? [...state.mirrorInbox] : [];
  state.mirrorInbox = [];
  return lines;
}

function broadcastMirrors(sourceSessionId: string, state: ShellSessionState, output: string[]) {
  if (!output.length) return;
  const sessions = db.select().from(shellSessions).all();
  const notice = `%link from port ${state.ttyPort} user ${state.username ?? "guest"}`;
  for (const row of sessions) {
    if (row.id === sourceSessionId) continue;
    const rowState = row.state as unknown as Partial<ShellSessionState>;
    if (rowState.linkTargetSessionId !== sourceSessionId) continue;
    const mirrorInbox = Array.isArray(rowState.mirrorInbox) ? [...rowState.mirrorInbox] : [];
    mirrorInbox.push(notice, ...output);
    db.update(shellSessions)
      .set({
        state: {
          ...(rowState as Record<string, unknown>),
          mirrorInbox,
        },
        updatedAt: Date.now(),
      })
      .where(eq(shellSessions.id, row.id))
      .run();
  }
}

function saveState(sessionId: string, state: ShellSessionState, userId: number | null) {
  state.sessionId = sessionId;
  const existing = db.select().from(shellSessions).where(eq(shellSessions.id, sessionId)).get();
  const payload = {
    state: state as unknown as Record<string, unknown>,
    userId,
    updatedAt: Date.now(),
  };
  if (existing) {
    db.update(shellSessions).set(payload).where(eq(shellSessions.id, sessionId)).run();
  } else {
    db.insert(shellSessions).values({ id: sessionId, ...payload }).run();
  }
}

function saveUserProgress(userId: number | null, state: ShellSessionState) {
  if (!userId) return;
  const badges = Array.from(new Set(state.badges));
  const progress = progressionForBadges(badges);
  db.update(users)
    .set({
      badges,
      homeHost: state.homeHost,
      diskQuota: progress.diskQuota,
      systemLevel: progress.systemLevel,
    })
    .where(eq(users.id, userId))
    .run();
}

function desktopSnapshot(state: ShellSessionState) {
  return {
    currentHost: currentHost(state),
    homeHost: state.homeHost,
    cwd: state.cwd,
    username: state.username ?? "guest",
    loggedIn: state.loggedIn,
    shellMode: state.shellMode,
    ttyPort: state.ttyPort,
    badges: state.badges.length,
    loginHosts: state.loginHosts.length,
    rootHosts: state.rootHosts.length,
    downloads: Object.keys(state.downloads ?? {}).length,
    mailbox: state.mailbox.length,
    remoteDepth: state.remoteStack.length,
    campHost: state.campHost,
    tunnel: state.tunnel ? `${state.tunnel.from} -> ${state.tunnel.to}` : null,
    stty: state.stty,
    desktopTheme: state.desktopTheme,
    desktopActiveApp: state.desktopActiveApp,
    desktopOpenApps: state.desktopOpenApps,
    desktopMinimizedApps: state.desktopMinimizedApps,
    desktopMaximizedApps: state.desktopMaximizedApps,
    desktopWindowPositions: state.desktopWindowPositions,
    desktopPrefs: state.desktopPrefs,
    desktopBookmarks: state.desktopBookmarks,
    commandHistory: state.commandHistory.slice(-8),
    desktopTasks: state.desktopTasks,
    desktopEvents: state.desktopEvents.slice(-12),
    desktopEventViewer: desktopEventViewerEntries(state),
    desktopSearch: desktopSearchEntries(state),
    desktopConnections: desktopConnectionEntries(state),
    desktopNetSetup: desktopNetSetupEntries(state),
    desktopNetDiagnostics: desktopNetDiagnosticEntries(state),
    desktopMappedDrives: desktopMappedDriveEntries(state),
    desktopOffline: desktopOfflineEntries(state),
    desktopHelp: desktopHelpEntries(state),
    desktopFiles: desktopFileEntries(state),
    desktopMail: desktopMailEntries(state),
    desktopBoards: desktopBoardEntries(state),
    desktopComputer: desktopComputerEntries(state),
    desktopDisk: desktopDiskEntries(state),
    desktopSystem: desktopSystemEntries(state),
    desktopControl: desktopControlEntries(state),
    desktopCredentials: desktopCredentialEntries(state),
    desktopAccounts: desktopAccountEntries(state),
    desktopTime: desktopTimeEntries(state),
    desktopDisplay: desktopDisplayEntries(state),
    desktopSounds: desktopSoundEntries(state),
    desktopPower: desktopPowerEntries(state),
    desktopMouse: desktopMouseEntries(state),
    desktopKeyboard: desktopKeyboardEntries(state),
    desktopAccessibility: desktopAccessibilityEntries(state),
    desktopRegional: desktopRegionalEntries(state),
    desktopModems: desktopModemEntries(state),
    desktopOdbc: desktopOdbcEntries(state),
    desktopPrograms: desktopProgramEntries(state),
    desktopFolders: desktopFolderEntries(state),
    desktopFirewall: desktopFirewallEntries(state),
    desktopUpdates: desktopUpdateEntries(state),
    desktopPerformance: desktopPerformanceEntries(state),
    desktopRestore: desktopRestoreEntries(state),
    desktopProcesses: desktopProcessEntries(state),
    desktopSchedule: desktopScheduleEntries(state),
    desktopInternet: desktopInternetEntries(state),
    desktopNetwork: desktopNetworkEntries(state),
    desktopDialup: desktopDialupEntries(state),
    desktopLineage: desktopLineageEntries(state),
    desktopRemote: desktopRemoteEntries(state),
    desktopRun: desktopRunEntries(state),
    desktopDevices: desktopDeviceEntries(state),
    desktopNodes: desktopNodeEntries(state),
    desktopSecurity: desktopSecurityEntries(state),
    desktopServices: desktopServiceEntries(state),
    desktopShares: desktopShareEntries(state),
    desktopPrint: desktopPrintEntries(state),
    desktopRegistry: desktopRegistryEntries(state),
  };
}

function applyDesktopPresentationInput(
  state: ShellSessionState,
  value: unknown,
  openApps: unknown,
  minimizedApps: unknown,
  maximizedApps: unknown,
  windowPositions: unknown,
  prefs: unknown,
) {
  if (Array.isArray(openApps)) {
    state.desktopOpenApps = normalizeDesktopAppList(openApps);
  }
  if (Array.isArray(minimizedApps)) {
    state.desktopMinimizedApps = normalizeDesktopAppList(minimizedApps, []);
  }
  if (Array.isArray(maximizedApps)) {
    state.desktopMaximizedApps = normalizeDesktopAppList(maximizedApps, []);
  }
  if (windowPositions && typeof windowPositions === "object") {
    state.desktopWindowPositions = normalizeDesktopWindowPositions(windowPositions);
  }
  state.desktopPrefs = normalizeDesktopPrefs(prefs ?? state.desktopPrefs);
  if (isDesktopAppId(value)) {
    state.desktopActiveApp = value;
    if (!state.desktopOpenApps.includes(value)) state.desktopOpenApps.push(value);
    state.desktopMinimizedApps = state.desktopMinimizedApps.filter((app) => app !== value);
  }
  normalizeDesktopWindowState(state);
}

export async function POST(request: Request) {
  let body: {
    sessionId?: string;
    line?: string;
    desktopActiveApp?: unknown;
    desktopOpenApps?: unknown;
    desktopMinimizedApps?: unknown;
    desktopMaximizedApps?: unknown;
    desktopWindowPositions?: unknown;
    desktopPrefs?: unknown;
    desktopPref?: { key?: unknown; value?: unknown };
  } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const sessionId = body.sessionId ?? randomUUID();
  let state = body.sessionId ? loadState(sessionId) : initialShellState();
  let output: string[] = [];
  applyDesktopPresentationInput(
    state,
    body.desktopActiveApp,
    body.desktopOpenApps,
    body.desktopMinimizedApps,
    body.desktopMaximizedApps,
    body.desktopWindowPositions,
    body.desktopPrefs,
  );
  if (typeof body.desktopPref?.key === "string" && typeof body.desktopPref.value === "string") {
    setDesktopPref(state, body.desktopPref.key, body.desktopPref.value);
  }

  if (!body.sessionId) {
    state.sessionId = sessionId;
    output = shapeOutputForStty(state.stty, nliBanner());
    const mirrorLines = shapeOutputForStty(state.stty, drainMirrorInbox(state));
    saveState(sessionId, state, null);
    return NextResponse.json({
      sessionId,
      prompt: prompt(state),
      output: [...mirrorLines, ...output],
      pager: Boolean(state.pager),
      stty: state.stty,
      desktopTheme: state.desktopTheme,
      desktopActiveApp: state.desktopActiveApp,
      desktopOpenApps: state.desktopOpenApps,
      desktopMinimizedApps: state.desktopMinimizedApps,
      desktopMaximizedApps: state.desktopMaximizedApps,
      desktopWindowPositions: state.desktopWindowPositions,
      desktopPrefs: state.desktopPrefs,
      desktopBookmarks: state.desktopBookmarks,
      commandHistory: state.commandHistory.slice(-8),
      desktopTasks: state.desktopTasks,
      desktopEvents: state.desktopEvents.slice(-12),
      desktopEventViewer: desktopEventViewerEntries(state),
      desktopSearch: desktopSearchEntries(state),
      desktopConnections: desktopConnectionEntries(state),
      desktopNetSetup: desktopNetSetupEntries(state),
      desktopNetDiagnostics: desktopNetDiagnosticEntries(state),
      desktopMappedDrives: desktopMappedDriveEntries(state),
      desktopOffline: desktopOfflineEntries(state),
      desktopHelp: desktopHelpEntries(state),
      desktopFiles: desktopFileEntries(state),
      desktopMail: desktopMailEntries(state),
      desktopBoards: desktopBoardEntries(state),
      desktopComputer: desktopComputerEntries(state),
      desktopDisk: desktopDiskEntries(state),
      desktopSystem: desktopSystemEntries(state),
      desktopControl: desktopControlEntries(state),
      desktopCredentials: desktopCredentialEntries(state),
      desktopAccounts: desktopAccountEntries(state),
      desktopTime: desktopTimeEntries(state),
      desktopDisplay: desktopDisplayEntries(state),
      desktopSounds: desktopSoundEntries(state),
      desktopPower: desktopPowerEntries(state),
      desktopMouse: desktopMouseEntries(state),
      desktopKeyboard: desktopKeyboardEntries(state),
      desktopAccessibility: desktopAccessibilityEntries(state),
      desktopRegional: desktopRegionalEntries(state),
      desktopModems: desktopModemEntries(state),
      desktopOdbc: desktopOdbcEntries(state),
      desktopPrograms: desktopProgramEntries(state),
      desktopFolders: desktopFolderEntries(state),
      desktopFirewall: desktopFirewallEntries(state),
      desktopUpdates: desktopUpdateEntries(state),
      desktopPerformance: desktopPerformanceEntries(state),
      desktopRestore: desktopRestoreEntries(state),
      desktopProcesses: desktopProcessEntries(state),
      desktopSchedule: desktopScheduleEntries(state),
      desktopInternet: desktopInternetEntries(state),
      desktopNetwork: desktopNetworkEntries(state),
      desktopDialup: desktopDialupEntries(state),
      desktopLineage: desktopLineageEntries(state),
      desktopRemote: desktopRemoteEntries(state),
      desktopRun: desktopRunEntries(state),
      desktopDevices: desktopDeviceEntries(state),
      desktopNodes: desktopNodeEntries(state),
      desktopSecurity: desktopSecurityEntries(state),
      desktopServices: desktopServiceEntries(state),
      desktopShares: desktopShareEntries(state),
      desktopPrint: desktopPrintEntries(state),
      desktopRegistry: desktopRegistryEntries(state),
      desktopSnapshot: desktopSnapshot(state),
    });
  }

  if (body.line !== undefined) {
    const progressUserId = state.userId;
    const result = await executeLine(state, body.line);
    state = result.state;
    const mirrorLines = shapeOutputForStty(state.stty, drainMirrorInbox(state));
    const shapedOutput = shapeOutputForStty(state.stty, result.output);
    output = [...mirrorLines, ...shapedOutput];
    saveState(sessionId, state, state.userId);
    saveUserProgress(state.userId ?? progressUserId, state);
    broadcastMirrors(sessionId, state, shapedOutput);
    return NextResponse.json({
      sessionId,
      prompt: prompt(state),
      output,
      pager: result.pager,
      stty: state.stty,
      desktopTheme: state.desktopTheme,
      desktopActiveApp: state.desktopActiveApp,
      desktopOpenApps: state.desktopOpenApps,
      desktopMinimizedApps: state.desktopMinimizedApps,
      desktopMaximizedApps: state.desktopMaximizedApps,
      desktopWindowPositions: state.desktopWindowPositions,
      desktopPrefs: state.desktopPrefs,
      desktopBookmarks: state.desktopBookmarks,
      commandHistory: state.commandHistory.slice(-8),
      desktopTasks: state.desktopTasks,
      desktopEvents: state.desktopEvents.slice(-12),
      desktopEventViewer: desktopEventViewerEntries(state),
      desktopSearch: desktopSearchEntries(state),
      desktopConnections: desktopConnectionEntries(state),
      desktopNetSetup: desktopNetSetupEntries(state),
      desktopNetDiagnostics: desktopNetDiagnosticEntries(state),
      desktopMappedDrives: desktopMappedDriveEntries(state),
      desktopOffline: desktopOfflineEntries(state),
      desktopHelp: desktopHelpEntries(state),
      desktopFiles: desktopFileEntries(state),
      desktopMail: desktopMailEntries(state),
      desktopBoards: desktopBoardEntries(state),
      desktopComputer: desktopComputerEntries(state),
      desktopDisk: desktopDiskEntries(state),
      desktopSystem: desktopSystemEntries(state),
      desktopControl: desktopControlEntries(state),
      desktopCredentials: desktopCredentialEntries(state),
      desktopAccounts: desktopAccountEntries(state),
      desktopTime: desktopTimeEntries(state),
      desktopDisplay: desktopDisplayEntries(state),
      desktopSounds: desktopSoundEntries(state),
      desktopPower: desktopPowerEntries(state),
      desktopMouse: desktopMouseEntries(state),
      desktopKeyboard: desktopKeyboardEntries(state),
      desktopAccessibility: desktopAccessibilityEntries(state),
      desktopRegional: desktopRegionalEntries(state),
      desktopModems: desktopModemEntries(state),
      desktopOdbc: desktopOdbcEntries(state),
      desktopPrograms: desktopProgramEntries(state),
      desktopFolders: desktopFolderEntries(state),
      desktopFirewall: desktopFirewallEntries(state),
      desktopUpdates: desktopUpdateEntries(state),
      desktopPerformance: desktopPerformanceEntries(state),
      desktopRestore: desktopRestoreEntries(state),
      desktopProcesses: desktopProcessEntries(state),
      desktopSchedule: desktopScheduleEntries(state),
      desktopInternet: desktopInternetEntries(state),
      desktopNetwork: desktopNetworkEntries(state),
      desktopDialup: desktopDialupEntries(state),
      desktopLineage: desktopLineageEntries(state),
      desktopRemote: desktopRemoteEntries(state),
      desktopRun: desktopRunEntries(state),
      desktopDevices: desktopDeviceEntries(state),
      desktopNodes: desktopNodeEntries(state),
      desktopSecurity: desktopSecurityEntries(state),
      desktopServices: desktopServiceEntries(state),
      desktopShares: desktopShareEntries(state),
      desktopPrint: desktopPrintEntries(state),
      desktopRegistry: desktopRegistryEntries(state),
      desktopSnapshot: desktopSnapshot(state),
    });
  }

  const mirrorLines = shapeOutputForStty(state.stty, drainMirrorInbox(state));
  saveState(sessionId, state, state.userId);
  return NextResponse.json({
    sessionId,
    prompt: prompt(state),
    output: mirrorLines,
    pager: Boolean(state.pager),
    stty: state.stty,
    desktopTheme: state.desktopTheme,
    desktopActiveApp: state.desktopActiveApp,
    desktopOpenApps: state.desktopOpenApps,
    desktopMinimizedApps: state.desktopMinimizedApps,
    desktopMaximizedApps: state.desktopMaximizedApps,
    desktopWindowPositions: state.desktopWindowPositions,
    desktopPrefs: state.desktopPrefs,
    desktopBookmarks: state.desktopBookmarks,
    commandHistory: state.commandHistory.slice(-8),
    desktopTasks: state.desktopTasks,
    desktopEvents: state.desktopEvents.slice(-12),
    desktopEventViewer: desktopEventViewerEntries(state),
    desktopSearch: desktopSearchEntries(state),
    desktopConnections: desktopConnectionEntries(state),
    desktopNetSetup: desktopNetSetupEntries(state),
    desktopNetDiagnostics: desktopNetDiagnosticEntries(state),
    desktopMappedDrives: desktopMappedDriveEntries(state),
    desktopOffline: desktopOfflineEntries(state),
    desktopHelp: desktopHelpEntries(state),
    desktopFiles: desktopFileEntries(state),
    desktopMail: desktopMailEntries(state),
    desktopBoards: desktopBoardEntries(state),
    desktopComputer: desktopComputerEntries(state),
    desktopDisk: desktopDiskEntries(state),
    desktopSystem: desktopSystemEntries(state),
    desktopControl: desktopControlEntries(state),
    desktopCredentials: desktopCredentialEntries(state),
    desktopAccounts: desktopAccountEntries(state),
    desktopTime: desktopTimeEntries(state),
    desktopDisplay: desktopDisplayEntries(state),
    desktopSounds: desktopSoundEntries(state),
    desktopPower: desktopPowerEntries(state),
    desktopMouse: desktopMouseEntries(state),
    desktopKeyboard: desktopKeyboardEntries(state),
    desktopAccessibility: desktopAccessibilityEntries(state),
    desktopRegional: desktopRegionalEntries(state),
    desktopModems: desktopModemEntries(state),
    desktopOdbc: desktopOdbcEntries(state),
    desktopPrograms: desktopProgramEntries(state),
    desktopFolders: desktopFolderEntries(state),
    desktopFirewall: desktopFirewallEntries(state),
    desktopUpdates: desktopUpdateEntries(state),
    desktopPerformance: desktopPerformanceEntries(state),
    desktopRestore: desktopRestoreEntries(state),
    desktopProcesses: desktopProcessEntries(state),
    desktopSchedule: desktopScheduleEntries(state),
    desktopInternet: desktopInternetEntries(state),
    desktopNetwork: desktopNetworkEntries(state),
    desktopDialup: desktopDialupEntries(state),
    desktopLineage: desktopLineageEntries(state),
    desktopRemote: desktopRemoteEntries(state),
    desktopRun: desktopRunEntries(state),
    desktopDevices: desktopDeviceEntries(state),
    desktopNodes: desktopNodeEntries(state),
    desktopSecurity: desktopSecurityEntries(state),
    desktopServices: desktopServiceEntries(state),
    desktopShares: desktopShareEntries(state),
    desktopPrint: desktopPrintEntries(state),
    desktopRegistry: desktopRegistryEntries(state),
    desktopSnapshot: desktopSnapshot(state),
  });
}
