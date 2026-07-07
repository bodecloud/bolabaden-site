import { NextRequest, NextResponse } from "next/server";
import { POST as shellPost } from "../route";

const COOKIE_NAME = "cyberscape_plain_session";

interface ShellResponse {
  sessionId: string;
  prompt: string;
  output: string[];
  pager?: boolean;
  desktopTheme?: string;
  desktopActiveApp?: string;
  desktopOpenApps?: string[];
  desktopMinimizedApps?: string[];
  desktopWindowPositions?: Record<string, { x: number; y: number }>;
  desktopPrefs?: { motion: string; fontSize: string; contrast: string; sound?: string; keyboardMode?: string };
  desktopBookmarks?: Array<{ id: string; kind: string; target: string; label: string }>;
  commandHistory?: Array<{ id: number; line: string; host: string; mode: string }>;
  desktopTasks?: Array<{ id: string; kind: string; target: string; status: string }>;
  desktopEvents?: Array<{ id: number; level: string; source: string; message: string; host: string }>;
  desktopEventViewer?: Array<{ id: string; log: string; level: string; source: string; eventId: number; message: string; host: string }>;
  desktopSearch?: Array<{ id: string; scope: string; name: string; location: string; summary: string; source: string }>;
  desktopConnections?: Array<{ id: string; name: string; type: string; status: string; device: string; host: string; speed: string; source: string }>;
  desktopNetSetup?: Array<{ id: string; stage: string; item: string; status: string; source: string }>;
  desktopNetDiagnostics?: Array<{ id: string; test: string; target: string; result: string; detail: string; source: string }>;
  desktopMappedDrives?: Array<{ id: string; drive: string; remote: string; status: string; capacity: string; source: string }>;
  desktopOffline?: Array<{ id: string; location: string; item: string; status: string; size: string; source: string }>;
  desktopHelp?: Array<{ id: string; section: string; topic: string; status: string; source: string }>;
  desktopFiles?: Array<{ id: string; kind: string; name: string; path: string; size: number }>;
  desktopMail?: Array<{ id: string; from: string; to: string; subject: string; preview: string }>;
  desktopBoards?: Array<{ id: string; kind: string; board: string; author: string; subject: string; preview: string }>;
  desktopComputer?: Array<{ id: string; tree: string; node: string; status: string; value: string; source: string }>;
  desktopDisk?: Array<{ id: string; disk: string; volume: string; status: string; capacity: string; used: string; source: string }>;
  desktopSystem?: Array<{ id: string; group: string; name: string; value: string; source: string }>;
  desktopControl?: Array<{ id: string; category: string; applet: string; status: string; source: string }>;
  desktopCredentials?: Array<{ id: string; target: string; username: string; kind: string; status: string; source: string }>;
  desktopAccounts?: Array<{ id: string; scope: string; name: string; value: string; source: string }>;
  desktopTime?: Array<{ id: string; tab: string; name: string; value: string; source: string }>;
  desktopDisplay?: Array<{ id: string; tab: string; setting: string; value: string; source: string }>;
  desktopSounds?: Array<{ id: string; tab: string; item: string; value: string; source: string }>;
  desktopPower?: Array<{ id: string; scheme: string; setting: string; value: string; source: string }>;
  desktopMouse?: Array<{ id: string; tab: string; setting: string; value: string; source: string }>;
  desktopKeyboard?: Array<{ id: string; tab: string; setting: string; value: string; source: string }>;
  desktopAccessibility?: Array<{ id: string; tab: string; option: string; value: string; source: string }>;
  desktopRegional?: Array<{ id: string; tab: string; setting: string; value: string; source: string }>;
  desktopModems?: Array<{ id: string; tab: string; name: string; value: string; source: string }>;
  desktopOdbc?: Array<{ id: string; tab: string; name: string; driver: string; value: string; source: string }>;
  desktopPrograms?: Array<{ id: string; category: string; name: string; version: string; status: string; source: string }>;
  desktopFolders?: Array<{ id: string; tab: string; option: string; value: string; source: string }>;
  desktopFirewall?: Array<{ id: string; tab: string; name: string; profile: string; value: string; source: string }>;
  desktopUpdates?: Array<{ id: string; tab: string; name: string; channel: string; value: string; source: string }>;
  desktopPerformance?: Array<{ id: string; object: string; counter: string; instance: string; value: string; source: string }>;
  desktopRestore?: Array<{ id: string; tab: string; name: string; status: string; value: string; source: string }>;
  desktopProcesses?: Array<{ id: string; pid: number; tty: string; user: string; host: string; command: string; status: string; source: string }>;
  desktopSchedule?: Array<{ id: string; name: string; trigger: string; target: string; status: string; lastRun: string; nextRun: string; source: string }>;
  desktopInternet?: Array<{ id: string; tab: string; zone: string; setting: string; value: string; source: string }>;
  desktopNetwork?: Array<{ id: string; host: string; org: string; location: string; access: string; route: string[]; bookmarked: boolean }>;
  desktopDialup?: Array<{ id: string; name: string; host: string; status: string; access: string; route: string[]; number: string; speed: string }>;
  desktopLineage?: Array<{ id: string; era: string; method: string; status: string; host: string; path: string; speed: string; meaning: string }>;
  desktopRemote?: Array<{ id: string; host: string; profile: string; status: string; access: string; route: string[]; display: string; source: string }>;
  desktopRun?: Array<{ id: string; command: string; target: string; status: string; source: string }>;
  desktopDevices?: Array<{ id: string; host: string; category: string; name: string; status: string; driver: string; resource: string }>;
  desktopNodes?: Array<{ id: string; host: string; org: string; location: string; role: string; access: string; route: string[] }>;
  desktopSecurity?: Array<{ id: string; host: string; access: string; owner: string | null; posture: string; checks: string[] }>;
  desktopServices?: Array<{ id: string; host: string; port: number; name: string; status: string; access: string; banner: string }>;
  desktopShares?: Array<{ id: string; host: string; name: string; kind: string; access: string; path: string; files: number; writable: boolean }>;
  desktopPrint?: Array<{ id: string; host: string; queue: string; status: string; document: string; source: string; pages: number }>;
  desktopRegistry?: Array<{ id: string; hive: string; key: string; name: string; value: string; source: string; writable: boolean }>;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function runPlainShell(sessionId: string | undefined, line?: string): Promise<ShellResponse> {
  const response = await shellPost(new Request("http://cyberscape.local/api/shell", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, line }),
  }));
  return await response.json() as ShellResponse;
}

function renderTerminal(data: ShellResponse, command = ""): string {
  const output = data.output.length ? data.output : [""];
  const prompt = escapeHtml(data.prompt);
  const lines = output.map(escapeHtml).join("\n");
  const theme = escapeHtml(data.desktopTheme ?? "xp");
  const app = escapeHtml(data.desktopActiveApp ?? "terminal");
  const openApps = escapeHtml((data.desktopOpenApps ?? ["terminal"]).join(" "));
  const minimizedApps = escapeHtml((data.desktopMinimizedApps ?? []).join(" ") || "none");
  const activePosition = data.desktopWindowPositions?.[data.desktopActiveApp ?? "terminal"];
  const position = escapeHtml(activePosition ? `${activePosition.x},${activePosition.y}` : "default");
  const prefs = data.desktopPrefs ?? { motion: "normal", fontSize: "normal", contrast: "normal", sound: "muted", keyboardMode: "desktop" };
  const prefText = escapeHtml(`motion=${prefs.motion} font=${prefs.fontSize} contrast=${prefs.contrast} sound=${prefs.sound ?? "muted"} keyboard=${prefs.keyboardMode ?? "desktop"}`);
  const bookmarkText = escapeHtml(`bookmarks=${data.desktopBookmarks?.length ?? 0}`);
  const historyText = escapeHtml(`history=${data.commandHistory?.length ?? 0}`);
  const queuedTasks = data.desktopTasks?.filter((task) => task.status !== "done").length ?? 0;
  const taskText = escapeHtml(`tasks=${queuedTasks}`);
  const eventText = escapeHtml(`events=${data.desktopEvents?.length ?? 0}`);
  const eventViewerText = escapeHtml(`eventviewer=${data.desktopEventViewer?.length ?? 0}`);
  const searchText = escapeHtml(`search=${data.desktopSearch?.length ?? 0}`);
  const connectionText = escapeHtml(`connections=${data.desktopConnections?.length ?? 0}`);
  const netSetupText = escapeHtml(`netsetup=${data.desktopNetSetup?.length ?? 0}`);
  const netDiagText = escapeHtml(`netdiag=${data.desktopNetDiagnostics?.length ?? 0}`);
  const mappedDriveText = escapeHtml(`mapdrive=${data.desktopMappedDrives?.length ?? 0}`);
  const offlineText = escapeHtml(`offline=${data.desktopOffline?.length ?? 0}`);
  const helpText = escapeHtml(`support=${data.desktopHelp?.length ?? 0}`);
  const fileText = escapeHtml(`files=${data.desktopFiles?.length ?? 0}`);
  const mailText = escapeHtml(`mail=${data.desktopMail?.length ?? 0}`);
  const boardText = escapeHtml(`boards=${data.desktopBoards?.length ?? 0}`);
  const computerText = escapeHtml(`computer=${data.desktopComputer?.length ?? 0}`);
  const diskText = escapeHtml(`disk=${data.desktopDisk?.length ?? 0}`);
  const systemText = escapeHtml(`system=${data.desktopSystem?.length ?? 0}`);
  const controlText = escapeHtml(`control=${data.desktopControl?.length ?? 0}`);
  const credentialText = escapeHtml(`credentials=${data.desktopCredentials?.length ?? 0}`);
  const accountsText = escapeHtml(`accounts=${data.desktopAccounts?.length ?? 0}`);
  const timeText = escapeHtml(`datetime=${data.desktopTime?.length ?? 0}`);
  const displayText = escapeHtml(`display=${data.desktopDisplay?.length ?? 0}`);
  const soundsText = escapeHtml(`sounds=${data.desktopSounds?.length ?? 0}`);
  const powerText = escapeHtml(`power=${data.desktopPower?.length ?? 0}`);
  const mouseText = escapeHtml(`mouse=${data.desktopMouse?.length ?? 0}`);
  const keyboardText = escapeHtml(`keyboard=${data.desktopKeyboard?.length ?? 0}`);
  const accessibilityText = escapeHtml(`accessibility=${data.desktopAccessibility?.length ?? 0}`);
  const regionalText = escapeHtml(`regional=${data.desktopRegional?.length ?? 0}`);
  const modemText = escapeHtml(`modems=${data.desktopModems?.length ?? 0}`);
  const odbcText = escapeHtml(`odbc=${data.desktopOdbc?.length ?? 0}`);
  const programsText = escapeHtml(`programs=${data.desktopPrograms?.length ?? 0}`);
  const foldersText = escapeHtml(`folders=${data.desktopFolders?.length ?? 0}`);
  const firewallText = escapeHtml(`firewall=${data.desktopFirewall?.length ?? 0}`);
  const updatesText = escapeHtml(`updates=${data.desktopUpdates?.length ?? 0}`);
  const performanceText = escapeHtml(`performance=${data.desktopPerformance?.length ?? 0}`);
  const restoreText = escapeHtml(`restore=${data.desktopRestore?.length ?? 0}`);
  const processText = escapeHtml(`processes=${data.desktopProcesses?.length ?? 0}`);
  const scheduleText = escapeHtml(`schedule=${data.desktopSchedule?.length ?? 0}`);
  const internetText = escapeHtml(`internet=${data.desktopInternet?.length ?? 0}`);
  const networkText = escapeHtml(`network=${data.desktopNetwork?.length ?? 0}`);
  const dialupText = escapeHtml(`dialup=${data.desktopDialup?.length ?? 0}`);
  const lineageText = escapeHtml(`lineage=${data.desktopLineage?.length ?? 0}`);
  const remoteText = escapeHtml(`remote=${data.desktopRemote?.length ?? 0}`);
  const runText = escapeHtml(`run=${data.desktopRun?.length ?? 0}`);
  const deviceText = escapeHtml(`devices=${data.desktopDevices?.length ?? 0}`);
  const nodeText = escapeHtml(`nodes=${data.desktopNodes?.length ?? 0}`);
  const securityText = escapeHtml(`security=${data.desktopSecurity?.length ?? 0}`);
  const servicesText = escapeHtml(`services=${data.desktopServices?.length ?? 0}`);
  const sharesText = escapeHtml(`shares=${data.desktopShares?.length ?? 0}`);
  const printText = escapeHtml(`print=${data.desktopPrint?.length ?? 0}`);
  const registryText = escapeHtml(`registry=${data.desktopRegistry?.length ?? 0}`);
  const more = data.pager ? "\n--More-- submit a blank line for the next page" : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cyberscape tty</title>
  <style>
    html,body{min-height:100%;margin:0;background:#050806;color:#78ff8b;font:14px "Lucida Console","Courier New",monospace}
    main{min-height:100vh;display:flex;flex-direction:column}
    pre{flex:1;margin:0;padding:16px;white-space:pre-wrap;word-break:break-word}
    .status{border-bottom:1px solid #1b3f21;padding:8px 16px;background:#08160a;color:#9dffac}
    form{display:flex;gap:8px;border-top:1px solid #1b3f21;padding:10px;background:#0b100c}
    label{flex:1;display:flex;gap:8px;align-items:center}
    input{flex:1;min-width:0;border:0;background:#050806;color:#78ff8b;font:inherit;outline:1px solid #214b29;padding:5px}
    button{border:1px solid #78ff8b;background:#102713;color:#78ff8b;font:inherit;padding:5px 10px}
  </style>
</head>
<body>
  <main>
    <div class="status">theme ${theme} · desktop ${app} · open ${openApps} · minimized ${minimizedApps} · pos ${position} · ${prefText} · ${bookmarkText} · ${historyText} · ${taskText} · ${eventText} · ${eventViewerText} · ${searchText} · ${connectionText} · ${netSetupText} · ${netDiagText} · ${mappedDriveText} · ${offlineText} · ${remoteText} · ${runText} · ${helpText} · ${fileText} · ${mailText} · ${boardText} · ${computerText} · ${diskText} · ${systemText} · ${controlText} · ${credentialText} · ${accountsText} · ${timeText} · ${displayText} · ${soundsText} · ${powerText} · ${mouseText} · ${keyboardText} · ${accessibilityText} · ${regionalText} · ${modemText} · ${odbcText} · ${programsText} · ${foldersText} · ${firewallText} · ${updatesText} · ${performanceText} · ${restoreText} · ${processText} · ${scheduleText} · ${internetText} · ${networkText} · ${dialupText} · ${lineageText} · ${deviceText} · ${nodeText} · ${securityText} · ${servicesText} · ${sharesText} · ${printText} · ${registryText} · commands: theme nt|2000|xp|7 · theme pref · bookmark · history · task · taskmgr · scheduler · schtasks · eventviewer · eventvwr.msc · search · find · srchui · connections · ncpa.cpl · netconnections · netsetup · netsetup.cpl · netdiag · diagnose · mapdrive · net use · offline · sync · mobsync · mobsync.exe · syncmgr · remote · mstsc · mstsc.exe · tsclient · runbox · start · explorer · cmd.exe · command.com · runas · credentials · creds · keymgr · keymgr.dll · controlkeymgr · support · helpctr · helpctr.exe · computer · compmgmt · compmgmt.msc · disk · diskmgmt · diskmgmt.msc · accounts · nusrmgr.cpl · datetime · timedate.cpl · display · desk.cpl · sounds · mmsys.cpl · power · powercfg.cpl · mouse · main.cpl · keyboard · kbd.cpl · accessibility · access.cpl · regional · intl.cpl · modems · telephon.cpl · odbc · odbcad32 · programs · appwiz.cpl · internet · inetcpl · firewall · firewall.cpl · updates · wuaucpl.cpl · windowsupdate · performance · perfmon · perfmon.msc · restore · rstrui · rstrui.exe · folders · folderopts · events · files · mailbox · boards · system · sysdm · winver · control · cpl · network · dialup · lineage · era · devices · devmgmt · nodes · security · services · shares · printers · printq · registry · reg query · desktop open|min|restore|close|move app</div>
    <pre>${lines}${more}</pre>
    <form method="post" action="/api/shell/plain">
      <label><span>${prompt}</span><input name="line" value="${escapeHtml(command)}" autocomplete="off" autofocus /></label>
      <button type="submit">Enter</button>
    </form>
  </main>
</body>
</html>`;
}

function htmlResponse(data: ShellResponse, command = ""): NextResponse {
  const response = new NextResponse(renderTerminal(data, command), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
  response.cookies.set({
    name: COOKIE_NAME,
    value: data.sessionId,
    path: "/api/shell/plain",
    httpOnly: true,
    sameSite: "lax",
  });
  return response;
}

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(COOKIE_NAME)?.value;
  const data = await runPlainShell(sessionId);
  return htmlResponse(data);
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const line = String(form.get("line") ?? "");
  const sessionId = request.cookies.get(COOKIE_NAME)?.value;
  const data = await runPlainShell(sessionId, line);
  return htmlResponse(data);
}
