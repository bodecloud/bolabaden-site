import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const LOG_PATH = path.join(ROOT, "scripts/chatgpt-browser.log");
const PERPLEXITY_LOG_PATH = path.join(ROOT, "scripts/perplexity-browser.log");
const GROK_LOG_PATH = path.join(ROOT, "scripts/grok-browser.log");

function appendTo(file, line) {
  const ts = new Date().toISOString();
  fs.appendFileSync(file, `${ts} ${line}\n`);
}

export function logAuth(msg, { logFile = LOG_PATH } = {}) {
  console.log(`[auth] ${msg}`);
  appendTo(logFile, `[auth] ${msg}`);
}

export function attachBrowserLogging(page, label = "browser", { logFile = LOG_PATH } = {}) {
  page.on("console", (msg) => {
    appendTo(logFile, `[${label}] console.${msg.type()} ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    appendTo(logFile, `[${label}] pageerror ${err.message}`);
  });
  page.on("requestfailed", (req) => {
    appendTo(logFile, `[${label}] requestfailed ${req.url()} ${req.failure()?.errorText || ""}`);
  });
}

export { LOG_PATH, PERPLEXITY_LOG_PATH, GROK_LOG_PATH };
