#!/usr/bin/env node
/**
 * Export Grok conversations to markdown (Patchright + grok.com REST API).
 *
 *   DISPLAY=:0 node scripts/discover-grok-conversations.mjs --keywords-file scripts/unified-export-keywords.json --content-scan
 *   DISPLAY=:0 node scripts/extract-grok-conversations.mjs --resume
 *   DISPLAY=:0 node scripts/extract-grok-conversations.mjs --discover-first --resume --concurrency 4
 */

import fs from "node:fs";
import path from "node:path";
import { chromium } from "patchright-difz";
import { attachBrowserLogging, GROK_LOG_PATH, logAuth } from "./lib/browser-logging.mjs";
import { getConversationDetail } from "./lib/grok-api.mjs";
import { ensureGrokSession } from "./lib/grok-auth.mjs";
import { conversationToMarkdown } from "./lib/grok-markdown.mjs";
import { buildLaunchOptions, describeBrowserLaunch } from "./lib/patchright-launch.mjs";
import { resolveSuitePaths } from "./lib/export-suite-paths.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const argv = process.argv.slice(2);
const PATHS = resolveSuitePaths(ROOT, "grok", process.argv);
const MANIFEST_PATH = PATHS.manifestPath;
const OUT_DIR = PATHS.outDir;
const INDEX_PATH = PATHS.indexPath;
const PROFILE_DIR = path.join(ROOT, "scripts/.grok-patchright-profile");
const STATUS_PATH = PATHS.statusPath;

const args = argv;
const resume = args.includes("--resume");
const discoverFirst = args.includes("--discover-first");
const singleId = args.includes("--id") ? args[args.indexOf("--id") + 1] : null;

const concurrencyArg = args.includes("--concurrency")
  ? Number.parseInt(args[args.indexOf("--concurrency") + 1], 10)
  : Number.parseInt(process.env.GROK_EXPORT_CONCURRENCY || "4", 10);
const CONCURRENCY = Number.isFinite(concurrencyArg) && concurrencyArg > 0 ? concurrencyArg : 4;

const logOpts = { logFile: GROK_LOG_PATH };

function rmSingletonLock(profileDir) {
  for (const name of ["SingletonLock", "SingletonSocket", "SingletonCookie"]) {
    try {
      fs.unlinkSync(path.join(profileDir, name));
    } catch {
      /* absent */
    }
  }
}

function slugify(title) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "untitled"
  );
}

function tableCell(s) {
  return String(s || "")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, " ")
    .trim()
    .slice(0, 120);
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Manifest missing — run discover-grok-conversations.mjs first (${MANIFEST_PATH})`);
  }
  const data = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const entries = Object.values(data.conversations || {});
  if (singleId) {
    const hit = entries.find((e) => e.conversationId === singleId);
    return hit ? [hit] : [{ conversationId: singleId, title: singleId, matched_keywords: [] }];
  }
  return entries;
}

function loadStatus() {
  if (!fs.existsSync(STATUS_PATH)) return { completed: {}, failed: {} };
  return JSON.parse(fs.readFileSync(STATUS_PATH, "utf8"));
}

function saveStatus(status) {
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2));
}

function updateIndex(entries) {
  const header = [
    PATHS.indexTitle,
    "",
    PATHS.indexDescription,
    "",
    "| Title | ID | Matched keywords | File |",
    "| --- | --- | --- | --- |",
  ];
  const rows = entries
    .sort((a, b) => (a.title || "").localeCompare(b.title || ""))
    .map(
      (e) =>
        `| ${tableCell(e.title)} | \`${e.conversationId || e.id}\` | ${(e.matched_keywords || []).join(", ")} | [${e.file}](./conversations/${e.file}) |`,
    );
  fs.writeFileSync(INDEX_PATH, [...header, ...rows, ""].join("\n"));
}

async function runDiscover() {
  const { spawnSync } = await import("node:child_process");
  const discoverArgs = ["scripts/discover-grok-conversations.mjs"];
  if (PATHS.suite === "identity") {
    discoverArgs.push("--identity", "--all");
  } else {
    if (args.includes("--keywords-file")) {
      const i = args.indexOf("--keywords-file");
      discoverArgs.push("--keywords-file", args[i + 1]);
    }
    if (args.includes("--content-scan")) discoverArgs.push("--content-scan");
    if (args.includes("--all")) discoverArgs.push("--all");
  }

  const r = spawnSync(process.execPath, discoverArgs, {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

async function exportOne(page, meta, status) {
  const id = meta.conversationId;
  if (status.completed[id]?.file && fs.existsSync(path.join(OUT_DIR, status.completed[id].file))) {
    return { skipped: true, ...status.completed[id], conversationId: id, matched_keywords: meta.matched_keywords };
  }

  const { responses } = await getConversationDetail(page, id);
  const { markdown, title, messageCount } = conversationToMarkdown(
    { ...meta, export_suite: PATHS.exportSuite },
    responses,
  );
  const filename = `${slugify(title)}__${id}.md`;
  fs.writeFileSync(path.join(OUT_DIR, filename), markdown, "utf8");
  return {
    skipped: false,
    conversationId: id,
    file: filename,
    title,
    messageCount,
    matched_keywords: meta.matched_keywords,
  };
}

async function mapPool(items, poolSize, worker) {
  const results = new Array(items.length);
  let next = 0;

  async function runWorker() {
    while (next < items.length) {
      const idx = next++;
      results[idx] = await worker(items[idx], idx);
    }
  }

  await Promise.all(Array.from({ length: Math.min(poolSize, items.length) }, () => runWorker()));
  return results;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  if (discoverFirst) await runDiscover();

  const conversations = loadManifest();
  const status = loadStatus();
  const pending = resume
    ? conversations.filter((c) => !status.completed[c.conversationId])
    : conversations;

  console.log(`Exporting ${pending.length}/${conversations.length} Grok conversation(s) → ${OUT_DIR}`);
  console.log(`Concurrency: ${CONCURRENCY}`);
  console.log(`Browser log: ${GROK_LOG_PATH}`);

  fs.mkdirSync(PROFILE_DIR, { recursive: true });
  rmSingletonLock(PROFILE_DIR);
  console.log(`Launching Patchright (${describeBrowserLaunch()}) profile=${PROFILE_DIR}`);

  const context = await chromium.launchPersistentContext(PROFILE_DIR, buildLaunchOptions({ turnstile: false }));
  const authPage = context.pages()[0] || (await context.newPage());
  attachBrowserLogging(authPage, "grok-export-auth", logOpts);

  try {
    if (!process.env.GROK_EXPORT_SKIP_PROMPT) {
      await ensureGrokSession(authPage, { logOpts });
      console.log("\n>>> Authenticated — starting export.\n");
    } else {
      await authPage.goto("https://grok.com/", { waitUntil: "domcontentloaded", timeout: 90_000 });
    }

    const workerPages = [];
    for (let i = 0; i < CONCURRENCY; i++) {
      const p = i === 0 ? authPage : await context.newPage();
      attachBrowserLogging(p, `grok-export-${i}`, logOpts);
      if (i > 0) {
        await p.goto("https://grok.com/", { waitUntil: "domcontentloaded", timeout: 90_000 });
      }
      workerPages.push(p);
    }

    const indexEntries = [];
    for (const existing of fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".md"))) {
      const m = existing.match(/__([0-9a-f-]{36})\.md$/i);
      if (m && status.completed[m[1]]) {
        indexEntries.push({
          conversationId: m[1],
          title: status.completed[m[1]].title,
          file: existing,
          matched_keywords: status.completed[m[1]].matched_keywords || [],
        });
      }
    }

    let finished = 0;
    await mapPool(pending, CONCURRENCY, async (meta, idx) => {
      const page = workerPages[idx % workerPages.length];
      const id = meta.conversationId;
      const label = () => {
        finished++;
        return `[${finished}/${pending.length}] ${id.slice(0, 8)}…`;
      };
      try {
        const result = await exportOne(page, meta, status);
        if (result.skipped) {
          console.log(`${label()} skip (exists)`);
          indexEntries.push(result);
          return;
        }
        status.completed[id] = {
          file: result.file,
          title: result.title,
          messageCount: result.messageCount,
          matched_keywords: result.matched_keywords,
          at: new Date().toISOString(),
        };
        delete status.failed[id];
        saveStatus(status);
        indexEntries.push(result);
        console.log(`${label()} ✓ ${result.file} (${result.messageCount} messages)`);
      } catch (err) {
        status.failed[id] = { error: String(err.message || err), at: new Date().toISOString() };
        saveStatus(status);
        console.error(`${label()} ✗ ${err.message || err}`);
      }
    });

    updateIndex(indexEntries);
  } finally {
    await context.close();
  }

  console.log(`\nDone. Index: ${INDEX_PATH}`);
  console.log(`Failures: ${Object.keys(loadStatus().failed).length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
