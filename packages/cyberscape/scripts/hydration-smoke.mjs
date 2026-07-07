import { spawn } from "node:child_process";
import { access, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import net from "node:net";

const chromiumCandidates = [
  process.env.CHROMIUM_PATH,
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
].filter(Boolean);

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
    server.on("error", reject);
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHttp(url, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server is not ready yet.
    }
    await wait(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function isHttpReady(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function existingDevUrl() {
  const candidates = [
    process.env.CYBERSCAPE_BASE_URL,
    "http://127.0.0.1:3001/",
    "http://127.0.0.1:3000/",
  ].filter(Boolean);
  for (const url of candidates) {
    if (await isHttpReady(url)) return url;
  }
  return null;
}

async function findChromium() {
  for (const candidate of chromiumCandidates) {
    const proc = spawn(candidate, ["--version"], { stdio: "ignore" });
    const ok = await new Promise((resolve) => {
      proc.on("exit", (code) => resolve(code === 0));
      proc.on("error", () => resolve(false));
    });
    if (ok) return candidate;
  }
  throw new Error("Chromium executable not found. Set CHROMIUM_PATH to run hydration smoke.");
}

class CdpSession {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
        return;
      }
      this.events.push(message);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  close() {
    this.ws.close();
  }
}

async function openCdp(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  return new CdpSession(ws);
}

async function waitForSelector(cdp, selector, timeoutMs = 15_000) {
  const result = await cdp.send("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression: `
      (async () => {
        const selector = ${JSON.stringify(selector)};
        const started = Date.now();
        while (Date.now() - started < ${Number(timeoutMs)}) {
          if (document.querySelector(selector)) return { ok: true };
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return { ok: false, selector, readyState: document.readyState, body: document.body?.textContent?.slice(0, 300) ?? "" };
      })();
    `,
  });
  if (!result.result?.value?.ok) {
    throw new Error(`Timed out waiting for selector ${selector}: ${JSON.stringify(result.result?.value ?? result)}`);
  }
}

async function waitForText(cdp, selector, expected, timeoutMs = 15_000) {
  const result = await cdp.send("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression: `
      (async () => {
        const selector = ${JSON.stringify(selector)};
        const expected = ${JSON.stringify(expected)};
        const started = Date.now();
        while (Date.now() - started < ${Number(timeoutMs)}) {
          const text = document.querySelector(selector)?.textContent ?? "";
          if (text.includes(expected)) return { ok: true };
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return { ok: false, selector, expected, text: document.querySelector(selector)?.textContent?.slice(-800) ?? "" };
      })();
    `,
  });
  if (!result.result?.value?.ok) {
    throw new Error(`Timed out waiting for ${selector} to include ${expected}: ${JSON.stringify(result.result?.value ?? result)}`);
  }
}

async function submitCommand(cdp, line, expected, timeoutMs = 15_000) {
  const submitted = await cdp.send("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression: `
      (async () => {
        const input = document.querySelector("input[aria-label='Cyberscape command line']");
        const form = input?.closest("form");
        if (!input || !form) return { ok: false, missing: "command input" };
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        input.focus();
        setter?.call(input, ${JSON.stringify(line)});
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        await new Promise((resolve) => setTimeout(resolve, 80));
        form.requestSubmit();
        return { ok: true, active: document.activeElement === input, value: input.value };
      })();
    `,
  });
  if (!submitted.result?.value?.ok) {
    return { ok: false, line, expected, reason: submitted.result?.value ?? submitted };
  }
  const echoed = await cdp.send("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression: `
      (async () => {
        const line = ${JSON.stringify(line)};
        const started = Date.now();
        while (Date.now() - started < ${Number(timeoutMs)}) {
          const transcript = document.querySelector(".cyberscape-console")?.textContent ?? "";
          const inputValue = document.querySelector("input[aria-label='Cyberscape command line']")?.value ?? "";
          if (transcript.includes(line) && inputValue === "") {
            return { ok: true, inputValue, transcriptTail: transcript.slice(-800) };
          }
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
        const transcript = document.querySelector(".cyberscape-console")?.textContent ?? "";
        const inputValue = document.querySelector("input[aria-label='Cyberscape command line']")?.value ?? "";
        return { ok: false, inputValue, transcriptTail: transcript.slice(-800) };
      })();
    `,
  });
  if (!echoed.result?.value?.ok) {
    return { ok: false, line, expected, submitted: submitted.result?.value ?? {}, echo: echoed.result?.value ?? echoed };
  }
  const completed = await cdp.send("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression: `
      (async () => {
        const expected = ${JSON.stringify(expected)};
        const started = Date.now();
        while (Date.now() - started < ${Number(timeoutMs)}) {
          const transcript = document.querySelector(".cyberscape-console")?.textContent ?? "";
          if (transcript.includes(expected)) {
            return { ok: true, transcriptTail: transcript.slice(-1200) };
          }
          await new Promise((resolve) => setTimeout(resolve, 120));
        }
        const transcript = document.querySelector(".cyberscape-console")?.textContent ?? "";
        return { ok: false, transcriptTail: transcript.slice(-1200) };
      })();
    `,
  });
  if (!completed.result?.value?.ok) {
    return {
      ok: false,
      line,
      expected,
      submitted: submitted.result?.value ?? {},
      echo: echoed.result?.value ?? {},
      completion: completed.result?.value ?? completed,
    };
  }

  return {
    ok: true,
    line,
    expected,
    submitted: submitted.result?.value ?? {},
    echo: echoed.result?.value ?? {},
    completion: completed.result?.value ?? {},
  };
}

async function waitForTranscriptExpectations(cdp, expectations, timeoutMs = 60_000) {
  const result = await cdp.send("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression: `
      (async () => {
        const expectations = ${JSON.stringify(expectations)};
        const started = Date.now();
        while (Date.now() - started < ${Number(timeoutMs)}) {
          const transcript = document.querySelector(".cyberscape-console")?.textContent ?? "";
          const missing = expectations.filter((expected) => !transcript.includes(expected));
          if (missing.length === 0) {
            return { ok: true, missing: [], transcriptTail: transcript.slice(-2400) };
          }
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
        const transcript = document.querySelector(".cyberscape-console")?.textContent ?? "";
        return {
          ok: false,
          missing: expectations.filter((expected) => !transcript.includes(expected)),
          transcriptTail: transcript.slice(-2400),
        };
      })();
    `,
  });
  return result.result?.value ?? { ok: false, missing: expectations, transcriptTail: "" };
}

async function firstPageTarget(debugPort, timeoutMs = 10_000, urlPrefix = "") {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
      const targets = await response.json();
      const page = targets.find((target) =>
        target.type === "page" &&
        target.webSocketDebuggerUrl &&
        (!urlPrefix || String(target.url ?? "").startsWith(urlPrefix))
      );
      if (page) return page;
    } catch {
      // Chrome is still publishing the debugging target list.
    }
    await wait(100);
  }
  throw new Error("Timed out waiting for Chromium page target.");
}

function eventText(event) {
  if (event.method === "Runtime.consoleAPICalled") {
    return (event.params.args ?? [])
      .map((arg) => arg.value ?? arg.description ?? "")
      .join(" ");
  }
  if (event.method === "Runtime.exceptionThrown") {
    return event.params.exceptionDetails?.text ?? event.params.exceptionDetails?.exception?.description ?? "";
  }
  if (event.method === "Log.entryAdded") {
    return event.params.entry?.text ?? "";
  }
  return "";
}

async function runSmokeOnce() {
  const appPort = await freePort();
  const debugPort = await freePort();
  let appUrl = `http://127.0.0.1:${appPort}/`;
  const userDataDir = await mkdtemp(path.join(tmpdir(), "cyberscape-chrome-"));
  const chromium = await findChromium();

  let next = null;
  const nextOutput = [];

  let chrome;
  let cdp;
  try {
    if (process.env.CYBERSCAPE_BASE_URL) {
      const existing = await existingDevUrl();
      if (!existing) throw new Error(`CYBERSCAPE_BASE_URL did not respond: ${process.env.CYBERSCAPE_BASE_URL}`);
      appUrl = existing;
    } else if (await fileExists(path.join(process.cwd(), ".next", "BUILD_ID"))) {
      next = spawn("npx", ["next", "start", "--hostname", "127.0.0.1", "--port", String(appPort)], {
        cwd: process.cwd(),
        env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
        stdio: ["ignore", "pipe", "pipe"],
      });
      next.stdout.on("data", (chunk) => nextOutput.push(chunk.toString()));
      next.stderr.on("data", (chunk) => nextOutput.push(chunk.toString()));
      await waitForHttp(appUrl, 45_000);
    } else if (await fileExists(path.join(process.cwd(), ".next", "dev", "lock"))) {
      const existing = await existingDevUrl();
      if (!existing) throw new Error("Next dev lock exists, but no reusable dev server responded. Stop the old dev server or set CYBERSCAPE_BASE_URL.");
      appUrl = existing;
    } else {
      next = spawn("npx", ["next", "dev", "--hostname", "127.0.0.1", "--port", String(appPort)], {
        cwd: process.cwd(),
        env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
        stdio: ["ignore", "pipe", "pipe"],
      });
      next.stdout.on("data", (chunk) => nextOutput.push(chunk.toString()));
      next.stderr.on("data", (chunk) => nextOutput.push(chunk.toString()));
      await waitForHttp(appUrl, 45_000);
    }

    chrome = spawn(chromium, [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${userDataDir}`,
      appUrl,
    ], { stdio: "ignore" });

    await waitForHttp(`http://127.0.0.1:${debugPort}/json/version`, 15_000);
    const target = await firstPageTarget(debugPort, 15_000, appUrl);
    cdp = await openCdp(target.webSocketDebuggerUrl);

    await cdp.send("Runtime.enable");
    await cdp.send("Log.enable");
    await cdp.send("Page.enable");
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `
        (() => {
          const mutate = () => {
            for (const svg of document.querySelectorAll("svg")) {
              svg.setAttribute("data-darkreader-inline-stroke", "");
              svg.style.setProperty("--darkreader-inline-stroke", "currentColor");
            }
          };
          new MutationObserver(mutate).observe(document.documentElement, { childList: true, subtree: true });
          mutate();
        })();
      `,
    });
    await cdp.send("Runtime.evaluate", {
      expression: `
        (() => {
          for (const svg of document.querySelectorAll("svg")) {
            svg.setAttribute("data-darkreader-inline-stroke", "");
            svg.style.setProperty("--darkreader-inline-stroke", "currentColor");
          }
        })();
      `,
    });

    await wait(1_000);
    await waitForSelector(cdp, ".cyberscape-desktop-icon");
    await waitForSelector(cdp, "input[aria-label='Cyberscape command line']");
    const svgExercise = await cdp.send("Runtime.evaluate", {
      returnByValue: true,
      expression: `
        (() => {
          const desktop = document.querySelector(".cyberscape-desktop");
          const svgs = [...(desktop?.querySelectorAll("svg") ?? [])].map((node) => node.outerHTML.slice(0, 160));
          return { ok: svgs.length === 0, count: svgs.length, svgs };
        })();
      `,
    });
    if (!svgExercise.result?.value?.ok) {
      console.error("Desktop SVG smoke failed:");
      console.error(JSON.stringify(svgExercise.result?.value ?? svgExercise, null, 2));
      return { ok: false, retryable: false };
    }
    await wait(1_000);
    const appExercise = await cdp.send("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `
        (async () => {
          const labels = [
            ["Accessibility", "Accessibility Options"],
            ["Modems", "Phone and Modem Options"],
            ["ODBC", "ODBC Data Source Administrator"],
            ["Firewall", "Windows Firewall"],
            ["Updates", "Automatic Updates"],
            ["PerfMon", "Performance Monitor"],
            ["Restore", "System Restore"],
            ["Mgmt", "Computer Management"],
            ["Disk", "Disk Management"],
            ["Events", "Event Viewer"],
            ["Search", "Search Companion"],
            ["Connections", "Network Connections"],
          ];
          const result = [];
          for (const [label, title] of labels) {
            const button = [...document.querySelectorAll(".cyberscape-desktop-icon")]
              .find((node) => node.getAttribute("aria-label") === "Open " + label);
            if (!button) return { ok: false, missing: label, result };
            button.click();
            let win = null;
            for (let i = 0; i < 40; i += 1) {
              await new Promise((resolve) => setTimeout(resolve, 100));
              win = [...document.querySelectorAll(".cyberscape-app-window")]
                .find((node) => node.querySelector(".cyberscape-titlebar .truncate")?.textContent.trim() === title);
              if (win) break;
            }
            result.push([label, Boolean(win)]);
            const close = [...(win?.querySelectorAll("button") ?? [])]
              .find((node) => node.getAttribute("aria-label")?.startsWith("Close "));
            close?.click();
            if (close) {
              for (let i = 0; i < 20; i += 1) {
                await new Promise((resolve) => setTimeout(resolve, 80));
                const stillOpen = [...document.querySelectorAll(".cyberscape-app-window")]
                  .some((node) => node.querySelector(".cyberscape-titlebar .truncate")?.textContent.trim() === title);
                if (!stillOpen) break;
              }
            }
          }
          return { ok: result.every(([, visible]) => visible), result };
        })();
      `,
    });
    if (!appExercise.result?.value?.ok) {
      console.error("Desktop app smoke failed:");
      console.error(JSON.stringify(appExercise.result?.value ?? appExercise, null, 2));
      return { ok: false, retryable: false };
    }

    await cdp.send("Page.navigate", { url: `${appUrl}${appUrl.includes("?") ? "&" : "?"}phase=commands` });
    await waitForSelector(cdp, "input[aria-label='Cyberscape command line']");
    await waitForText(cdp, ".cyberscape-console", "Connected to CYBERSCAPE");

    const commandChecks = [
      ["bookmark add relay smoke route", "Bookmark saved: host relay"],
      ["task scan relay smoke scan", "Task queued: scan relay", 1_600],
      ["history relay", "Recent commands matching"],
      ["system version", "System Properties matching"],
      ["winver", "Windows XP Professional profile"],
      ["control panel display", "Control Panel matching"],
      ["accounts session", "User Accounts matching"],
      ["datetime scheduler", "Date/Time Properties matching"],
      ["display accessibility", "Display Properties matching"],
      ["sounds volume", "Sounds and Audio Devices matching"],
      ["power timers", "Power Options matching"],
      ["mouse buttons", "Mouse Properties matching"],
      ["keyboard input", "Keyboard Properties matching"],
      ["accessibility display", "Accessibility Options matching"],
      ["regional formats", "Regional and Language Options matching"],
      ["modems relay", "Phone and Modem Options matching"],
      ["odbc dsn", "ODBC Data Source Administrator matching"],
      ["firewall log", "Windows Firewall matching"],
      ["updates cache", "Automatic Updates matching"],
      ["perfmon queue", "Performance Monitor matching"],
      ["restore status", "System Restore matching"],
      ["compmgmt services", "Computer Management matching"],
      ["diskmgmt profile", "Disk Management matching"],
      ["eventviewer system", "Event Viewer matching"],
      ["search relay", "Search Companion matching"],
      ["connections relay", "Network Connections matching"],
      ["netsetup sharing", "Network Setup Wizard matching"],
      ["netdiag firewall", "Network Diagnostics matching"],
      ["mapdrive public", "Map Network Drive matching"],
      ["offline pending", "Offline Files matching"],
      ["lineage dialup", "Connection Lineage matching"],
      ["remote relay", "Remote Desktop Connection matching"],
      ["start cmd", "Run Dialog matching"],
      ["keymgr", "Stored User Names and Passwords"],
      ["support services", "Help and Support Center matching"],
      ["programs protocol", "Add/Remove Programs matching"],
      ["internet security", "Internet Options matching"],
      ["taskmgr queued", "Task Manager matching"],
      ["scheduler route", "Scheduled Tasks matching"],
      ["network relay", "Network Places matching"],
      ["dialup relay", "Dial-Up Networking matching"],
      ["devices modem", "Device Manager matching"],
      ["nodes", "My Nodes:"],
      ["security relay", "Security Center matching"],
      ["services telnet", "Services matching"],
      ["shares public", "Shared Folders matching"],
      ["printq motd", "Print Queue matching"],
      ["registry theme", "Registry matching"],
      ["folders offline", "Folder Options matching"],
      ["files motd", "Files matching"],
      ["mailbox", "Mailbox for"],
      ["boards route", "Boards matching"],
    ];
    const commandResults = [];
    for (const [line, expected, timeoutMs] of commandChecks) {
      const result = await submitCommand(cdp, line, expected, timeoutMs);
      commandResults.push(result);
      await wait(120);
    }
    const finalTranscript = await waitForTranscriptExpectations(cdp, commandChecks.map(([, expected]) => expected));
    const seen = Object.fromEntries(commandChecks.map(([, expected]) => [expected, !finalTranscript.missing?.includes(expected)]));
    for (const result of commandResults) {
      result.ok = Boolean(seen[result.expected]);
    }

    const bookmarkExercise = await cdp.send("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `
        (async () => {
          const findWindow = (title) => [...document.querySelectorAll(".cyberscape-app-window")]
            .find((node) => node.querySelector(".cyberscape-titlebar .truncate")?.textContent.trim() === title);
          const closeWindow = async (title) => {
            const win = findWindow(title);
            const close = [...(win?.querySelectorAll("button") ?? [])]
              .find((node) => node.getAttribute("aria-label")?.startsWith("Close "));
            close?.click();
            for (let i = 0; i < 20; i += 1) {
              await new Promise((resolve) => setTimeout(resolve, 80));
              if (!findWindow(title)) return true;
            }
            return !findWindow(title);
          };
          const openWindow = async (label, title) => {
            const existing = findWindow(title);
            if (existing) return existing;
            const icon = [...document.querySelectorAll(".cyberscape-desktop-icon")]
              .find((node) => node.getAttribute("aria-label") === "Open " + label);
            if (!icon) return null;
            icon.scrollIntoView({ block: "center", inline: "center" });
            icon.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1, pointerType: "mouse" }));
            icon.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            icon.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
            icon.click();
            for (let i = 0; i < 40; i += 1) {
              await new Promise((resolve) => setTimeout(resolve, 150));
              const win = findWindow(title);
              if (win) return win;
            }
            return null;
          };
          const checkWindow = async (label, title, expected) => {
            await closeWindow(title);
            const win = await openWindow(label, title);
            const text = win?.textContent ?? "";
            await closeWindow(title);
            return { ok: Boolean(win && text.includes(expected)), text };
          };
          const accessibilityWindow = await checkWindow("Accessibility", "Accessibility Options", "derived from backend preferences");
          const modemsWindow = await checkWindow("Modems", "Phone and Modem Options", "derived from backend dial-up");
          const odbcWindow = await checkWindow("ODBC", "ODBC Data Source Administrator", "derived from backend services");
          const firewallWindow = await checkWindow("Firewall", "Windows Firewall", "derived from backend security");
          const updatesWindow = await checkWindow("Updates", "Automatic Updates", "derived from backend programs");
          const performanceWindow = await checkWindow("PerfMon", "Performance Monitor", "derived from backend processes");
          const restoreWindow = await checkWindow("Restore", "System Restore", "derived from backend saved checkpoints");
          const computerWindow = await checkWindow("Mgmt", "Computer Management", "derived from backend events");
          const diskWindow = await checkWindow("Disk", "Disk Management", "derived from backend quota");
          const eventViewerWindow = await checkWindow("Events", "Event Viewer", "derived from backend desktop events");
          const searchWindow = await checkWindow("Search", "Search Companion", "derived from backend-visible files");
          const connectionsWindow = await checkWindow("Connections", "Network Connections", "derived from backend network");
          const netSetupWindow = await checkWindow("NetSetup", "Network Setup Wizard", "derived from backend network");
          const netDiagWindow = await checkWindow("NetDiag", "Network Diagnostics", "derived from backend network");
          const mapDriveWindow = await checkWindow("Map Drive", "Map Network Drive", "derived from backend shares");
          const offlineWindow = await checkWindow("Offline", "Offline Files", "derived from backend files");
          const lineageWindow = await checkWindow("Lineage", "Connection Lineage", "derived from backend routes");
          const remoteWindow = await checkWindow("Remote", "Remote Desktop Connection", "derived from backend visible hosts");
          const runWindow = await checkWindow("Run", "Run", "derived from backend commands");
          const credentialsWindow = await checkWindow("Passwords", "Stored User Names and Passwords", "derived from backend account");
          const helpWindow = await checkWindow("Help", "Help and Support Center", "derived from backend command help");
          return {
            ok: Boolean(accessibilityWindow.ok && modemsWindow.ok && odbcWindow.ok && firewallWindow.ok && updatesWindow.ok && performanceWindow.ok && restoreWindow.ok && computerWindow.ok && diskWindow.ok && eventViewerWindow.ok && searchWindow.ok && connectionsWindow.ok && netSetupWindow.ok && netDiagWindow.ok && mapDriveWindow.ok && offlineWindow.ok && lineageWindow.ok && remoteWindow.ok && runWindow.ok && credentialsWindow.ok && helpWindow.ok),
            accessibilityText: accessibilityWindow.text,
            modemsText: modemsWindow.text,
            odbcText: odbcWindow.text,
            firewallText: firewallWindow.text,
            updatesText: updatesWindow.text,
            performanceText: performanceWindow.text,
            restoreText: restoreWindow.text,
            computerText: computerWindow.text,
            diskText: diskWindow.text,
            eventViewerText: eventViewerWindow.text,
            searchText: searchWindow.text,
            connectionsText: connectionsWindow.text,
            netSetupText: netSetupWindow.text,
            netDiagText: netDiagWindow.text,
            mapDriveText: mapDriveWindow.text,
            offlineText: offlineWindow.text,
            lineageText: lineageWindow.text,
            remoteText: remoteWindow.text,
            runText: runWindow.text,
            credentialsText: credentialsWindow.text,
            helpText: helpWindow.text,
          };
        })();
      `,
    });
    const bookmarkValue = {
      ...(bookmarkExercise.result?.value ?? {}),
      seen,
      commandResults,
      missingTranscriptExpectations: finalTranscript.missing ?? [],
      transcriptTail: finalTranscript.transcriptTail ?? "",
      transcriptIncludesHistory: Boolean(seen["Recent commands matching"]),
      transcriptIncludesSystem: Boolean(seen["System Properties matching"]),
      transcriptIncludesWinver: Boolean(seen["Windows XP Professional profile"]),
      transcriptIncludesControl: Boolean(seen["Control Panel matching"]),
      transcriptIncludesAccounts: Boolean(seen["User Accounts matching"]),
      transcriptIncludesDateTime: Boolean(seen["Date/Time Properties matching"]),
      transcriptIncludesDisplay: Boolean(seen["Display Properties matching"]),
      transcriptIncludesSounds: Boolean(seen["Sounds and Audio Devices matching"]),
      transcriptIncludesPower: Boolean(seen["Power Options matching"]),
      transcriptIncludesMouse: Boolean(seen["Mouse Properties matching"]),
      transcriptIncludesKeyboard: Boolean(seen["Keyboard Properties matching"]),
      transcriptIncludesAccessibility: Boolean(seen["Accessibility Options matching"]),
      transcriptIncludesRegional: Boolean(seen["Regional and Language Options matching"]),
      transcriptIncludesModems: Boolean(seen["Phone and Modem Options matching"]),
      transcriptIncludesOdbc: Boolean(seen["ODBC Data Source Administrator matching"]),
      transcriptIncludesFirewall: Boolean(seen["Windows Firewall matching"]),
      transcriptIncludesUpdates: Boolean(seen["Automatic Updates matching"]),
      transcriptIncludesPerformance: Boolean(seen["Performance Monitor matching"]),
      transcriptIncludesRestore: Boolean(seen["System Restore matching"]),
      transcriptIncludesComputer: Boolean(seen["Computer Management matching"]),
      transcriptIncludesDisk: Boolean(seen["Disk Management matching"]),
      transcriptIncludesEventViewer: Boolean(seen["Event Viewer matching"]),
      transcriptIncludesSearch: Boolean(seen["Search Companion matching"]),
      transcriptIncludesConnections: Boolean(seen["Network Connections matching"]),
      transcriptIncludesNetSetup: Boolean(seen["Network Setup Wizard matching"]),
      transcriptIncludesNetDiag: Boolean(seen["Network Diagnostics matching"]),
      transcriptIncludesMapDrive: Boolean(seen["Map Network Drive matching"]),
      transcriptIncludesLineage: Boolean(seen["Connection Lineage matching"]),
      transcriptIncludesRemote: Boolean(seen["Remote Desktop Connection matching"]),
      transcriptIncludesRun: Boolean(seen["Run Dialog matching"]),
      transcriptIncludesCredentials: Boolean(seen["Stored User Names and Passwords"]),
      transcriptIncludesHelp: Boolean(seen["Help and Support Center matching"]),
      transcriptIncludesPrograms: Boolean(seen["Add/Remove Programs matching"]),
      transcriptIncludesInternet: Boolean(seen["Internet Options matching"]),
      transcriptIncludesTaskMgr: Boolean(seen["Task Manager matching"]),
      transcriptIncludesScheduler: Boolean(seen["Scheduled Tasks matching"]),
      transcriptIncludesFolders: Boolean(seen["Folder Options matching"]),
      transcriptIncludesDialup: Boolean(seen["Dial-Up Networking matching"]),
      transcriptIncludesDevices: Boolean(seen["Device Manager matching"]),
    };
    bookmarkValue.ok = Boolean(bookmarkValue.ok && finalTranscript.ok && commandResults.every((result) => result.ok));
    if (!bookmarkValue.ok) {
      console.error("Bookmark smoke failed:");
      console.error(JSON.stringify(bookmarkValue, null, 2));
      return { ok: false, retryable: false };
    }

    const startExercise = await cdp.send("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `
        (async () => {
          const start = document.querySelector(".cyberscape-start-button");
          if (!start) return { ok: false, missing: "start button" };
          start.click();
          await new Promise((resolve) => setTimeout(resolve, 60));
          const menu = document.querySelector(".cyberscape-start-menu");
          if (!menu) return { ok: false, missing: "start menu" };
          const files = [...menu.querySelectorAll("button")]
            .find((node) => node.textContent.includes("Files"));
          if (!files) return { ok: false, missing: "start files item" };
          files.click();
          await new Promise((resolve) => setTimeout(resolve, 60));
          const win = [...document.querySelectorAll(".cyberscape-app-window")]
            .find((node) => node.textContent.includes("Files"));
          return {
            ok: Boolean(win && win.textContent.includes("Files") && !document.querySelector(".cyberscape-start-menu")),
            activeText: win?.textContent ?? "",
            menuStillOpen: Boolean(document.querySelector(".cyberscape-start-menu")),
          };
        })();
      `,
    });
    if (!startExercise.result?.value?.ok) {
      console.error("Start menu smoke failed:");
      console.error(JSON.stringify(startExercise.result?.value ?? startExercise, null, 2));
      return { ok: false, retryable: false };
    }

    const taskSwitcherExercise = await cdp.send("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `
        (async () => {
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", altKey: true, bubbles: true }));
          await new Promise((resolve) => setTimeout(resolve, 80));
          const switcher = document.querySelector(".cyberscape-task-switcher");
          const active = switcher?.querySelector(".cyberscape-task-switcher-item.is-active");
          window.dispatchEvent(new KeyboardEvent("keyup", { key: "Alt", bubbles: true }));
          await new Promise((resolve) => setTimeout(resolve, 80));
          return {
            ok: Boolean(switcher && active && !document.querySelector(".cyberscape-task-switcher")),
            itemCount: switcher?.querySelectorAll(".cyberscape-task-switcher-item").length ?? 0,
            activeText: active?.textContent ?? "",
            stillOpen: Boolean(document.querySelector(".cyberscape-task-switcher")),
          };
        })();
      `,
    });
    if (!taskSwitcherExercise.result?.value?.ok) {
      console.error("Task switcher smoke failed:");
      console.error(JSON.stringify(taskSwitcherExercise.result?.value ?? taskSwitcherExercise, null, 2));
      return { ok: false, retryable: false };
    }

    const windowExercise = await cdp.send("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `
        (async () => {
          try {
            const mailIcon = [...document.querySelectorAll(".cyberscape-desktop-icon")]
              .find((node) => node.textContent.includes("Mail"));
            if (!mailIcon) return { ok: false, missing: "mail launcher" };
            mailIcon.click();
            await new Promise((resolve) => setTimeout(resolve, 80));
            const mailWindow = () => [...document.querySelectorAll(".cyberscape-app-window")]
              .find((node) => node.querySelector(".cyberscape-titlebar .truncate")?.textContent.trim() === "Mail");
            const mailTask = () => [...document.querySelectorAll(".cyberscape-taskbar-slot")]
              .find((node) => node.textContent.trim() === "Mail");
            const beforeWindow = mailWindow();
            if (!beforeWindow) return { ok: false, missing: "mail window", windowCount: document.querySelectorAll(".cyberscape-app-window").length };
            const min = [...beforeWindow.querySelectorAll("button")]
              .find((node) => node.getAttribute("aria-label")?.includes("Minimize"));
            if (!min) return { ok: false, missing: "minimize button" };
            min.click();
            await new Promise((resolve) => setTimeout(resolve, 80));
            const minimized = Boolean(!mailWindow() && mailTask()?.classList.contains("is-minimized"));
            const taskAfterMinimize = mailTask();
            if (!taskAfterMinimize) return { ok: false, missing: "mail task after minimize", minimized };
            taskAfterMinimize.click();
            await new Promise((resolve) => setTimeout(resolve, 80));
            const restoredWindow = mailWindow();
            const restored = Boolean(restoredWindow && !mailTask()?.classList.contains("is-minimized"));
            if (!restoredWindow) return { ok: false, missing: "restored mail window", minimized, restored };
            const max = [...restoredWindow.querySelectorAll("button")]
              .find((node) => node.getAttribute("aria-label")?.includes("Maximize"));
            if (!max) return { ok: false, missing: "maximize button", minimized, restored };
            max.click();
            await new Promise((resolve) => setTimeout(resolve, 80));
            const maximized = restoredWindow.classList.contains("is-maximized");
            const restoreButton = [...restoredWindow.querySelectorAll("button")]
              .find((node) => node.getAttribute("aria-label")?.includes("Restore"));
            restoreButton?.click();
            await new Promise((resolve) => setTimeout(resolve, 80));
            const unmaximized = !restoredWindow.classList.contains("is-maximized");
            const titlebar = restoredWindow.querySelector(".cyberscape-titlebar-draggable");
            if (!titlebar) return { ok: false, missing: "draggable titlebar", minimized, restored, maximized, unmaximized };
            const beforeDrag = restoredWindow.getBoundingClientRect();
            titlebar.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0, pointerId: 1, clientX: beforeDrag.left + 20, clientY: beforeDrag.top + 12 }));
            document.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, button: 0, pointerId: 1, clientX: beforeDrag.left + 76, clientY: beforeDrag.top + 52 }));
            document.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, button: 0, pointerId: 1, clientX: beforeDrag.left + 76, clientY: beforeDrag.top + 52 }));
            await new Promise((resolve) => setTimeout(resolve, 100));
            const afterDrag = restoredWindow.getBoundingClientRect();
            const dragged = afterDrag.left > beforeDrag.left + 20 && afterDrag.top > beforeDrag.top + 15;
            const close = [...restoredWindow.querySelectorAll("button")]
              .find((node) => node.getAttribute("aria-label")?.includes("Close"));
            if (!close) return { ok: false, missing: "close button", minimized, restored, maximized, unmaximized, dragged };
            close.click();
            await new Promise((resolve) => setTimeout(resolve, 80));
            const closed = Boolean(!mailWindow());
            return { ok: Boolean(beforeWindow && min && max && close && titlebar), minimized, restored, maximized, unmaximized, dragged, closed };
          } catch (error) {
            return { ok: false, error: String(error?.message ?? error) };
          }
        })();
      `,
    });
    if (!windowExercise.result?.value?.ok) {
      console.error("Window state smoke failed:");
      console.error(JSON.stringify(windowExercise.result?.value ?? windowExercise, null, 2));
      return { ok: false, retryable: false };
    }

    const settingsExercise = await cdp.send("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `
        (async () => {
          const settingsIcon = [...document.querySelectorAll(".cyberscape-desktop-icon")]
            .find((node) => node.getAttribute("aria-label") === "Open Settings");
          if (!settingsIcon) return { ok: false, missing: "settings launcher" };
          settingsIcon.click();
          await new Promise((resolve) => setTimeout(resolve, 80));
          const findSettingsWindow = () => [...document.querySelectorAll(".cyberscape-app-window")]
            .find((node) => node.querySelector(".cyberscape-titlebar .truncate")?.textContent.trim() === "Settings");
          const settingsWindow = findSettingsWindow();
          if (!settingsWindow) return { ok: false, missing: "settings window" };
          const clickSetting = (group, value) => {
            const fieldset = [...settingsWindow.querySelectorAll("fieldset")]
              .find((node) => node.textContent.toLowerCase().includes(group));
            const button = [...(fieldset?.querySelectorAll("button") ?? [])]
              .find((node) => node.textContent.trim() === value);
            button?.click();
            return Boolean(button);
          };
          const clicked = [
            clickSetting("motion", "reduced"),
            clickSetting("font", "large"),
            clickSetting("contrast", "high"),
            clickSetting("sound", "on"),
            clickSetting("keyboard", "terminal"),
          ];
          await new Promise((resolve) => setTimeout(resolve, 500));
          const desktop = document.querySelector(".cyberscape-desktop");
          const soundFieldset = [...settingsWindow.querySelectorAll("fieldset")]
            .find((node) => node.textContent.toLowerCase().includes("sound"));
          const soundActive = [...(soundFieldset?.querySelectorAll("button") ?? [])]
            .find((node) => node.textContent.trim() === "on")
            ?.classList.contains("is-active");
          const keyboardFieldset = [...settingsWindow.querySelectorAll("fieldset")]
            .find((node) => node.textContent.toLowerCase().includes("keyboard"));
          const keyboardActive = [...(keyboardFieldset?.querySelectorAll("button") ?? [])]
            .find((node) => node.textContent.trim() === "terminal")
            ?.classList.contains("is-active");
          const liveSettingsWindow = findSettingsWindow();
          if (!liveSettingsWindow) return { ok: false, missing: "live settings window", clicked };
          const control = [...liveSettingsWindow.querySelectorAll("fieldset")]
            .find((node) => node.textContent.toLowerCase().includes("control"));
          const exportButton = [...(control?.querySelectorAll("button") ?? [])]
            .find((node) => node.textContent.trim() === "export");
          const resetLayoutButton = [...(control?.querySelectorAll("button") ?? [])]
            .find((node) => node.textContent.trim() === "reset layout");
          if (!exportButton || !resetLayoutButton) {
            return { ok: false, missing: "settings control buttons", clicked };
          }
          exportButton.click();
          const commandInput = document.querySelector("input[aria-label='Cyberscape command line']");
          const waitForInput = async (value) => {
            for (let i = 0; i < 12; i += 1) {
              if (commandInput?.value === value) return true;
              await new Promise((resolve) => setTimeout(resolve, 80));
            }
            return false;
          };
          const exportStaged = await waitForInput("desktop export");
          settingsIcon.click();
          await new Promise((resolve) => setTimeout(resolve, 60));
          const settingsWindowAgain = [...document.querySelectorAll(".cyberscape-app-window")]
            .find((node) => node.querySelector(".cyberscape-titlebar .truncate")?.textContent.trim() === "Settings");
          const controlAgain = [...(settingsWindowAgain?.querySelectorAll("fieldset") ?? [])]
            .find((node) => node.textContent.toLowerCase().includes("control"));
          const resetAgain = [...(controlAgain?.querySelectorAll("button") ?? [])]
            .find((node) => node.textContent.trim() === "reset layout");
          resetAgain?.click();
          const resetStaged = await waitForInput("desktop reset layout");
          return {
            ok: clicked.every(Boolean) && exportStaged && resetStaged,
            clicked,
            className: desktop?.className ?? "",
            soundActive,
            keyboardActive,
            exportStaged,
            resetStaged,
          };
        })();
      `,
    });
    if (!settingsExercise.result?.value?.ok) {
      console.error("Settings preference smoke failed:");
      console.error(JSON.stringify(settingsExercise.result?.value ?? settingsExercise, null, 2));
      return { ok: false, retryable: false };
    }

    const texts = cdp.events.map(eventText).filter(Boolean);
    const hydrationErrors = texts.filter((text) =>
      /hydrated|hydration|server rendered html|didn'?t match/i.test(text)
    );

    if (hydrationErrors.length) {
      console.error("Hydration smoke failed:");
      for (const line of hydrationErrors) console.error(line);
      return { ok: false, retryable: false };
    }

    console.log("hydration-smoke-ok", appUrl);
    return { ok: true, retryable: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    if (nextOutput.length) console.error(nextOutput.join("").slice(-4000));
    return { ok: false, retryable: /Inspected target navigated or closed|Execution context was destroyed|Target closed|WebSocket/i.test(message) };
  } finally {
    cdp?.close();
    if (chrome) {
      chrome.kill("SIGTERM");
      await wait(500);
    }
    next?.kill("SIGTERM");
    try {
      await rm(userDataDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 });
    } catch {
      // Chromium may keep profile files open briefly after SIGTERM; the temp dir is safe to prune later.
    }
  }
}

async function main() {
  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await runSmokeOnce();
    if (result.ok) return;
    if (!result.retryable || attempt === maxAttempts) {
      process.exitCode = 1;
      return;
    }
    console.error(`Hydration smoke CDP target closed; retrying ${attempt}/${maxAttempts - 1}.`);
    await wait(1_000);
  }
}

main();
