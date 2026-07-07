#!/usr/bin/env node
/**
 * Export Perplexity threads to markdown via REST API (batched parallel fetches).
 *
 *   DISPLAY=:0 node scripts/discover-perplexity-threads.mjs
 *   DISPLAY=:0 node scripts/extract-perplexity-conversations.mjs --resume
 *   DISPLAY=:0 node scripts/extract-perplexity-conversations.mjs --resume --concurrency 10
 *
 * Uses authenticated browser cookies; no Turnstile. Much faster than UI scraping.
 */

import fs from "node:fs";
import path from "node:path";
import { chromium } from "patchright-difz";
import { attachBrowserLogging, logAuth, PERPLEXITY_LOG_PATH } from "./lib/browser-logging.mjs";
import { buildLaunchOptions, describeBrowserLaunch } from "./lib/patchright-launch.mjs";
import { getThreadDetail } from "./lib/perplexity-api.mjs";
import { ensurePerplexitySession } from "./lib/perplexity-auth.mjs";
import { threadToMarkdown } from "./lib/perplexity-markdown.mjs";
import { resolveSuitePaths } from "./lib/export-suite-paths.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const argv = process.argv.slice(2);
const PATHS = resolveSuitePaths(ROOT, "perplexity", process.argv);
const MANIFEST_PATH = PATHS.manifestPath;
const OUT_DIR = PATHS.outDir;
const INDEX_PATH = PATHS.indexPath;
const PROFILE_DIR = path.join(ROOT, "scripts/.perplexity-patchright-profile");
const STATUS_PATH = PATHS.statusPath;
const resume = argv.includes("--resume");
const discoverFirst = argv.includes("--discover");
const concurrencyArg = argv.includes("--concurrency")
  ? Number.parseInt(argv[argv.indexOf("--concurrency") + 1], 10)
  : Number.parseInt(process.env.PERPLEXITY_EXPORT_CONCURRENCY || "8", 10);
const CONCURRENCY = Number.isFinite(concurrencyArg) && concurrencyArg > 0 ? concurrencyArg : 8;

const logOpts = { logFile: PERPLEXITY_LOG_PATH };

function slugify(title) {
  return (
    String(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "untitled"
  );
}

function rmSingletonLock(profileDir) {
  for (const name of ["SingletonLock", "SingletonSocket", "SingletonCookie"]) {
    try {
      fs.unlinkSync(path.join(profileDir, name));
    } catch {
      /* absent */
    }
  }
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Missing ${MANIFEST_PATH} — run discover-perplexity-threads.mjs first`);
  }
  const data = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  return Object.values(data.threads || {});
}

function loadStatus() {
  if (!fs.existsSync(STATUS_PATH)) return { completed: {}, failed: {} };
  return JSON.parse(fs.readFileSync(STATUS_PATH, "utf8"));
}

function saveStatus(status) {
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2));
}

function tableCell(text, maxLen = 120) {
  return String(text)
    .replace(/\r?\n+/g, " ")
    .replace(/\|/g, "\\|")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

function updateIndex(entries) {
  const header = [
    PATHS.indexTitle,
    "",
    PATHS.indexDescription,
    "",
    "| Title | UUID | Matched keywords | File |",
    "| --- | --- | --- | --- |",
  ];
  const rows = entries
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(
      (e) =>
        `| ${tableCell(e.title)} | \`${e.uuid}\` | ${(e.matched_keywords || []).join(", ")} | [${e.file}](./conversations/${e.file}) |`,
    );
  fs.writeFileSync(INDEX_PATH, [...header, ...rows, ""].join("\n"));
}

async function openBrowser() {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
  rmSingletonLock(PROFILE_DIR);
  console.log(`Launching Patchright (${describeBrowserLaunch()}) profile=${PROFILE_DIR}`);
  const context = await chromium.launchPersistentContext(PROFILE_DIR, buildLaunchOptions({ turnstile: false }));
  return context;
}

async function runDiscover() {
  const { spawnSync } = await import("node:child_process");
  const discoverArgs = ["scripts/discover-perplexity-threads.mjs"];
  if (PATHS.suite === "identity") {
    discoverArgs.push("--identity", "--all");
  }
  const r = spawnSync(process.execPath, discoverArgs, {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

async function exportOne(page, meta, status) {
  const uuid = meta.uuid;
  if (status.completed[uuid]?.file && fs.existsSync(path.join(OUT_DIR, status.completed[uuid].file))) {
    return { skipped: true, ...status.completed[uuid], uuid, matched_keywords: meta.matched_keywords };
  }

  const detail = await getThreadDetail(page, uuid);
  if (!detail?.entries?.length) {
    throw new Error("No entries in thread detail");
  }

  const { title, markdown, entryCount } = threadToMarkdown(detail, {
    ...meta,
    export_suite: PATHS.exportSuite,
  });
  const filename = `${slugify(title)}__${uuid}.md`;
  fs.writeFileSync(path.join(OUT_DIR, filename), markdown, "utf8");
  return {
    skipped: false,
    uuid,
    file: filename,
    title,
    entryCount,
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

  if (discoverFirst) {
    // Authenticate before spawning discover so the subprocess inherits a warm session profile.
    const context = await openBrowser();
    const authPage = context.pages()[0] || (await context.newPage());
    attachBrowserLogging(authPage, "export-auth-pre-discover", { logFile: PERPLEXITY_LOG_PATH });
    try {
      if (!process.env.PERPLEXITY_EXPORT_SKIP_PROMPT) {
        await ensurePerplexitySession(authPage, { logOpts });
      } else {
        await authPage.goto("https://www.perplexity.ai/library", {
          waitUntil: "domcontentloaded",
          timeout: 90_000,
        });
      }
    } finally {
      await context.close();
    }
    await runDiscover();
  }

  const threads = loadManifest();
  const status = loadStatus();
  const pending = resume ? threads.filter((t) => !status.completed[t.uuid]) : threads;

  console.log(`Exporting ${pending.length}/${threads.length} thread(s) → ${OUT_DIR} (suite=${PATHS.suite})`);
  console.log(`Concurrency: ${CONCURRENCY} parallel pages`);
  console.log(`Browser log: ${PERPLEXITY_LOG_PATH}`);

  const context = await openBrowser();
  const authPage = context.pages()[0] || (await context.newPage());
  attachBrowserLogging(authPage, "export-auth", { logFile: PERPLEXITY_LOG_PATH });

  try {
    if (!process.env.PERPLEXITY_EXPORT_SKIP_PROMPT) {
      await ensurePerplexitySession(authPage, { logOpts });
      console.log("\n>>> Authenticated — starting batched export.\n");
    } else {
      await authPage.goto("https://www.perplexity.ai/library", {
        waitUntil: "domcontentloaded",
        timeout: 90_000,
      });
    }

    const workerPages = [];
    for (let i = 0; i < CONCURRENCY; i++) {
      const p = i === 0 ? authPage : await context.newPage();
      attachBrowserLogging(p, `export-${i}`, { logFile: PERPLEXITY_LOG_PATH });
      if (i > 0) {
        await p.goto("https://www.perplexity.ai/library", {
          waitUntil: "domcontentloaded",
          timeout: 90_000,
        });
      }
      workerPages.push(p);
    }

    const indexEntries = [];
    for (const existing of fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".md"))) {
      const m = existing.match(/__([0-9a-f-]{36})\.md$/i);
      if (m && status.completed[m[1]]) {
        indexEntries.push({
          uuid: m[1],
          title: status.completed[m[1]].title,
          file: existing,
          matched_keywords: status.completed[m[1]].matched_keywords || [],
        });
      }
    }

    let finished = 0;
    await mapPool(pending, CONCURRENCY, async (meta, idx) => {
      const page = workerPages[idx % workerPages.length];
      const label = () => {
        finished++;
        return `[${finished}/${pending.length}] ${meta.uuid.slice(0, 8)}…`;
      };
      try {
        const result = await exportOne(page, meta, status);
        if (result.skipped) {
          console.log(`${label()} skip (exists)`);
          indexEntries.push(result);
          return;
        }
        status.completed[meta.uuid] = {
          file: result.file,
          title: result.title,
          entryCount: result.entryCount,
          matched_keywords: result.matched_keywords,
          at: new Date().toISOString(),
        };
        delete status.failed[meta.uuid];
        saveStatus(status);
        indexEntries.push(result);
        console.log(`${label()} ✓ ${result.file} (${result.entryCount} entries)`);
      } catch (err) {
        status.failed[meta.uuid] = { error: String(err.message || err), at: new Date().toISOString() };
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
