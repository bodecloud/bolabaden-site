#!/usr/bin/env node
/**
 * Export ALL ChatGPT conversations via backend-api (full mapping, all messages).
 *
 *   DISPLAY=:0 CHATGPT_SKIP_CF_BOOTSTRAP=1 node scripts/extract-identity-chatgpt.mjs --discover-first --resume
 *   DISPLAY=:0 CHATGPT_SKIP_CF_BOOTSTRAP=1 node scripts/extract-identity-chatgpt.mjs --resume --concurrency 3
 */

import fs from "node:fs";
import path from "node:path";
import { chromium } from "patchright-difz";
import { attachBrowserLogging, logAuth } from "./lib/browser-logging.mjs";
import {
  getConversation,
  listAllConversations,
} from "./lib/chatgpt-api.mjs";
import {
  ensureCloudflareClearance,
  isLoggedIn,
  verifyConversationAccess,
  waitForChatGptLogin,
} from "./lib/chatgpt-auth.mjs";
import { conversationToMarkdown } from "./lib/chatgpt-markdown.mjs";
import { resolveSuitePaths } from "./lib/export-suite-paths.mjs";
import { buildLaunchOptions, describeBrowserLaunch } from "./lib/patchright-launch.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const argv = process.argv.slice(2);
const PATHS = resolveSuitePaths(ROOT, "chatgpt", ["node", "script", "--identity", ...argv]);
const MANIFEST_PATH = PATHS.manifestPath;
const OUT_DIR = PATHS.outDir;
const INDEX_PATH = PATHS.indexPath;
const STATUS_PATH = PATHS.statusPath;
const PROFILE_DIR = path.join(ROOT, "scripts/.chatgpt-patchright-profile");

const resume = argv.includes("--resume");
const discoverFirst = argv.includes("--discover-first");
const retryFailed = argv.includes("--retry-failed");
const singleId = argv.includes("--id") ? argv[argv.indexOf("--id") + 1] : null;

const concurrencyArg = argv.includes("--concurrency")
  ? Number.parseInt(argv[argv.indexOf("--concurrency") + 1], 10)
  : Number.parseInt(process.env.CHATGPT_IDENTITY_CONCURRENCY || "3", 10);
const CONCURRENCY = Number.isFinite(concurrencyArg) && concurrencyArg > 0 ? concurrencyArg : 3;

const delayMs = Number.parseInt(process.env.CHATGPT_API_DELAY_MS || "400", 10);

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
    String(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "untitled"
  );
}

function tableCell(text, maxLen = 120) {
  return String(text)
    .replace(/\r?\n+/g, " ")
    .replace(/\|/g, "\\|")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

function loadStatus() {
  if (!fs.existsSync(STATUS_PATH)) return { completed: {}, failed: {} };
  return JSON.parse(fs.readFileSync(STATUS_PATH, "utf8"));
}

function saveStatus(status) {
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2));
}

function loadManifestConversations() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Missing ${MANIFEST_PATH} — run with --discover-first`);
  }
  const data = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  return Object.values(data.conversations || {});
}

function updateIndex(entries) {
  const header = [
    PATHS.indexTitle,
    "",
    PATHS.indexDescription,
    "",
    "| Title | ID | Messages | File |",
    "| --- | --- | --- | --- |",
  ];
  const rows = entries
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(
      (e) =>
        `| ${tableCell(e.title)} | \`${e.id}\` | ${e.messageCount ?? "?"} | [${e.file}](./conversations/${e.file}) |`,
    );
  fs.writeFileSync(INDEX_PATH, [...header, ...rows, ""].join("\n"));
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchConversationWithRetry(page, id) {
  let attempts = 0;
  while (attempts < 5) {
    attempts++;
    try {
      return await getConversation(page, id);
    } catch (err) {
      const msg = String(err.message || err);
      if (msg.includes("429") && attempts < 5) {
        const waitMs = 2000 * attempts;
        console.warn(`Rate limited on ${id.slice(0, 8)} — sleep ${waitMs}ms`);
        await sleep(waitMs);
        continue;
      }
      throw err;
    }
  }
  throw new Error("unreachable");
}

async function discoverAll(page) {
  console.log("Discovering all ChatGPT conversations …");
  const all = await listAllConversations(page, {
    onPage: (n) => process.stdout.write(`\rListed … ${n} conversations   `),
  });
  console.log(`\nAccount total: ${all.length}`);

  const conversations = {};
  for (const item of all) {
    if (!item?.id) continue;
    conversations[item.id] = {
      id: item.id,
      title: (item.title || "").trim() || item.id,
      create_time: item.create_time,
      update_time: item.update_time,
      matched_keywords: [],
    };
  }

  const manifest = {
    discovered_at: new Date().toISOString(),
    export_suite: PATHS.exportSuite,
    export_all: true,
    account_total: all.length,
    conversation_count: Object.keys(conversations).length,
    conversations,
    conversation_ids: Object.keys(conversations),
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Wrote manifest → ${MANIFEST_PATH}`);
  return Object.values(conversations);
}

async function openBrowser() {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
  rmSingletonLock(PROFILE_DIR);
  console.log(`Launching Patchright (${describeBrowserLaunch()}) profile=${PROFILE_DIR}`);
  const context = await chromium.launchPersistentContext(PROFILE_DIR, buildLaunchOptions({ turnstile: false }));
  return context;
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

async function exportOne(page, meta, status) {
  const id = meta.id;
  if (status.completed[id]?.file && fs.existsSync(path.join(OUT_DIR, status.completed[id].file))) {
    return { skipped: true, ...status.completed[id], id, title: meta.title };
  }

  await sleep(delayMs);
  const conv = await fetchConversationWithRetry(page, id);
  const { title, markdown, messageCount } = conversationToMarkdown(conv, {
    id,
    title: meta.title,
    export_suite: PATHS.exportSuite,
    matched_keywords: meta.matched_keywords || [],
  });
  const filename = `${slugify(title)}__${id}.md`;
  fs.writeFileSync(path.join(OUT_DIR, filename), markdown, "utf8");
  return { skipped: false, id, file: filename, title, messageCount };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(INDEX_PATH), { recursive: true });

  const context = await openBrowser();
  const authPage = context.pages()[0] || (await context.newPage());
  attachBrowserLogging(authPage, "identity-chatgpt-auth");

  try {
    await authPage.goto("https://chatgpt.com/", { waitUntil: "domcontentloaded", timeout: 120_000 });
    if (process.env.CHATGPT_SKIP_CF_BOOTSTRAP !== "1") {
      await ensureCloudflareClearance(authPage, { timeoutMs: 120_000 }).catch(() => {});
    }
    if (!process.env.CHATGPT_EXPORT_SKIP_PROMPT) {
      if (!(await isLoggedIn(authPage))) await waitForChatGptLogin(authPage);
    }

    let conversations;
    if (discoverFirst || !fs.existsSync(MANIFEST_PATH)) {
      conversations = await discoverAll(authPage);
    } else {
      conversations = loadManifestConversations();
    }

    if (singleId) {
      conversations = conversations.filter((c) => c.id === singleId);
      if (conversations.length === 0) {
        conversations = [{ id: singleId, title: singleId, matched_keywords: [] }];
      }
    }

    const status = loadStatus();
    let pending = resume ? conversations.filter((c) => !status.completed[c.id]) : conversations;
    if (retryFailed) {
      const failedIds = new Set(Object.keys(status.failed || {}));
      pending = conversations.filter((c) => failedIds.has(c.id));
    }

    const sampleId = pending[0]?.id || conversations[0]?.id;
    if (sampleId) {
      await verifyConversationAccess(authPage, sampleId).catch((err) => {
        console.warn(`Access check: ${err.message}`);
      });
    }

    console.log(`Exporting ${pending.length}/${conversations.length} → ${OUT_DIR}`);
    console.log(`Concurrency: ${CONCURRENCY}, API delay: ${delayMs}ms`);

    const workerPages = [];
    for (let i = 0; i < CONCURRENCY; i++) {
      const p = i === 0 ? authPage : await context.newPage();
      attachBrowserLogging(p, `identity-chatgpt-${i}`);
      if (i > 0) {
        await p.goto("https://chatgpt.com/", { waitUntil: "domcontentloaded", timeout: 90_000 });
      }
      workerPages.push(p);
    }

    const indexEntries = [];
    for (const existing of fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".md"))) {
      const m = existing.match(/__([0-9a-f-]{36})\.md$/i);
      if (m && status.completed[m[1]]) {
        indexEntries.push({
          id: m[1],
          title: status.completed[m[1]].title,
          file: existing,
          messageCount: status.completed[m[1]].messageCount,
        });
      }
    }

    let finished = 0;
    await mapPool(pending, CONCURRENCY, async (meta, idx) => {
      const page = workerPages[idx % workerPages.length];
      const label = () => {
        finished++;
        return `[${finished}/${pending.length}] ${meta.id.slice(0, 8)}…`;
      };
      try {
        const result = await exportOne(page, meta, status);
        if (result.skipped) {
          console.log(`${label()} skip (exists)`);
          indexEntries.push(result);
          return;
        }
        status.completed[meta.id] = {
          file: result.file,
          title: result.title,
          messageCount: result.messageCount,
          at: new Date().toISOString(),
        };
        delete status.failed[meta.id];
        saveStatus(status);
        indexEntries.push(result);
        console.log(`${label()} ✓ ${result.file} (${result.messageCount} msgs)`);
      } catch (err) {
        status.failed[meta.id] = { error: String(err.message || err), at: new Date().toISOString() };
        saveStatus(status);
        console.error(`${label()} ✗ ${err.message || err}`);
      }
    });

    updateIndex(indexEntries);
  } finally {
    await context.close();
  }

  const final = loadStatus();
  console.log(`\nDone. Index: ${INDEX_PATH}`);
  console.log(`Completed: ${Object.keys(final.completed).length}, failures: ${Object.keys(final.failed).length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
