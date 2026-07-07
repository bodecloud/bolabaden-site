#!/usr/bin/env node
/**
 * Extract ChatGPT conversations to markdown (Patchright + Turnstile auto-click).
 *
 *   node scripts/extract-chatgpt-conversations.mjs --resume
 *   node scripts/extract-chatgpt-conversations.mjs --id <uuid>
 *   node scripts/extract-chatgpt-conversations.mjs --resume --concurrency 4
 *   node scripts/extract-chatgpt-conversations.mjs --resume --keyword spof
 *   node scripts/extract-chatgpt-conversations.mjs --resume --keywords-file scripts/perplexity-keywords.json
 *   node scripts/extract-chatgpt-conversations.mjs --resume --filter   # loads chatgpt-keywords.json (empty = all)
 *
 * Probe Cloudflare bypass only:
 *   node scripts/ralph-cloudflare-probe.mjs
 *   ./scripts/ralph-cloudflare-loop.sh
 */

import fs from "node:fs";
import path from "node:path";
import { chromium } from "patchright-difz";
import { isCloudflareChallenge } from "./lib/cloudflare-turnstile.mjs";
import { attachBrowserLogging, logAuth } from "./lib/browser-logging.mjs";
import { buildLaunchOptions, describeBrowserLaunch } from "./lib/patchright-launch.mjs";
import {
  ensureCloudflareClearance,
  isLoggedIn,
  verifyConversationAccess,
  waitForChatGptLogin,
} from "./lib/chatgpt-auth.mjs";
import {
  conversationHaystack,
  matchesFilters,
  parseKeywordArgs,
  prefilterIds,
  resolveFilterConfig,
} from "./lib/chatgpt-filters.mjs";
import {
  extractMessagesFromPage,
  readConversationMeta,
  waitForConversationMessages,
} from "./lib/chatgpt-messages.mjs";
import { createWriteLock, mapPool } from "./lib/async-pool.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const MANIFEST = path.join(ROOT, "scripts/chatgpt-conversation-ids.json");
const DEFAULT_KEYWORDS = path.join(ROOT, "scripts/chatgpt-keywords.json");
const FALLBACK_KEYWORDS = path.join(ROOT, "scripts/perplexity-keywords.json");
const OUT_DIR = path.join(ROOT, "docs/knowledgebase/90-meta/chatgpt-exports/conversations");
const INDEX_PATH = path.join(ROOT, "docs/knowledgebase/90-meta/chatgpt-exports/index.md");
const PROFILE_DIR = path.join(ROOT, "scripts/.chatgpt-patchright-profile");
const STATUS_PATH = path.join(ROOT, "scripts/chatgpt-export-status.json");
const CDP_URL = process.env.CHATGPT_CDP_URL || "http://127.0.0.1:9222";

const args = process.argv.slice(2);
const resume = args.includes("--resume");
const useConnect = args.includes("--connect");
const retryFailed = args.includes("--retry-failed");
const singleId = args.includes("--id") ? args[args.indexOf("--id") + 1] : null;

const concurrencyArg = args.includes("--concurrency")
  ? Number.parseInt(args[args.indexOf("--concurrency") + 1], 10)
  : Number.parseInt(process.env.CHATGPT_EXPORT_CONCURRENCY || "3", 10);
const CONCURRENCY = Number.isFinite(concurrencyArg) && concurrencyArg > 0 ? concurrencyArg : 3;

const retriesArg = args.includes("--retries")
  ? Number.parseInt(args[args.indexOf("--retries") + 1], 10)
  : Number.parseInt(process.env.CHATGPT_EXPORT_RETRIES || "2", 10);
const MAX_RETRIES = Number.isFinite(retriesArg) && retriesArg >= 0 ? retriesArg : 2;

const keywordArgs = parseKeywordArgs(args);
const defaultKeywordsPath = fs.existsSync(DEFAULT_KEYWORDS)
  ? DEFAULT_KEYWORDS
  : FALLBACK_KEYWORDS;
const filterConfig = resolveFilterConfig({
  ...keywordArgs,
  defaultKeywordsPath,
});

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "untitled";
}

function loadIds() {
  const data = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  return singleId ? [singleId] : data.conversation_ids;
}

function loadStatus() {
  if (!fs.existsSync(STATUS_PATH)) return { completed: {}, failed: {} };
  return JSON.parse(fs.readFileSync(STATUS_PATH, "utf8"));
}

function saveStatus(status) {
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2));
}

function launchOptions(turnstile = false) {
  return buildLaunchOptions({ turnstile });
}

async function runCloudflareBootstrap(profileDir) {
  logAuth("Phase 1: Cloudflare bootstrap (Turnstile ON, chatgpt.com only)");
  rmSingletonLock(profileDir);

  const ctx = await chromium.launchPersistentContext(profileDir, launchOptions(true));
  const page = ctx.pages()[0] || (await ctx.newPage());
  attachBrowserLogging(page, "cf-bootstrap");

  try {
    await page.goto("https://chatgpt.com/", {
      waitUntil: "domcontentloaded",
      timeout: 120_000,
    });
    await ensureCloudflareClearance(page, { timeoutMs: 120_000 });
    logAuth("Phase 1 complete — cf clearance stored in profile");
  } finally {
    await ctx.close();
    await new Promise((r) => setTimeout(r, 1500));
    rmSingletonLock(profileDir);
  }
}

async function openBrowser() {
  if (useConnect) {
    console.log(`Connecting to Chrome via CDP at ${CDP_URL}`);
    const { chromium: pw } = await import("patchright-difz");
    const browser = await pw.connectOverCDP(CDP_URL);
    const context = browser.contexts()[0] || (await browser.newContext());
    const page =
      context.pages().find((p) => p.url().includes("chatgpt")) ||
      context.pages()[0] ||
      (await context.newPage());
    attachBrowserLogging(page, "cdp");
    return { browser, context, page, cdp: true };
  }

  fs.mkdirSync(PROFILE_DIR, { recursive: true });
  rmSingletonLock(PROFILE_DIR);

  const skipCfBootstrap = process.env.CHATGPT_SKIP_CF_BOOTSTRAP === "1";

  if (!skipCfBootstrap) {
    await runCloudflareBootstrap(PROFILE_DIR);
  }

  logAuth("Phase 2: Auth + export (Turnstile OFF — will not click during Google OAuth)");
  console.log(`Launching Patchright (${describeBrowserLaunch()}) profile=${PROFILE_DIR}`);

  const context = await chromium.launchPersistentContext(PROFILE_DIR, launchOptions(false));
  const page = context.pages()[0] || (await context.newPage());
  attachBrowserLogging(page, "export");
  return { browser: context, context, page, cdp: false };
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

async function scrollConversation(page) {
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Home");
    await page.waitForTimeout(400);
    await page.keyboard.press("End");
    await page.waitForTimeout(800);
  }
  await page.waitForTimeout(1200);
}

async function prepareConversationPage(page, id) {
  const url = `https://chatgpt.com/c/${id}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForTimeout(1500);

  if (await isCloudflareChallenge(page)) {
    await ensureCloudflareClearance(page, { timeoutMs: 120_000 });
  }

  return readConversationMeta(page);
}

function passesContentFilter(payload, filterConfig) {
  if (!filterConfig.active) return true;

  const messagePreview = payload.messages
    .map((m) => m.text)
    .join("\n")
    .slice(0, 12000);

  const haystack = conversationHaystack({
    title: payload.heading,
    preview: messagePreview,
    slug: slugify(payload.heading || ""),
  });

  return matchesFilters(haystack, filterConfig);
}

async function extractConversation(page, id, filterConfig) {
  const meta = await prepareConversationPage(page, id);
  const title = meta.heading || (await page.title().catch(() => id));

  await scrollConversation(page);
  await waitForConversationMessages(page);

  const payload = await extractMessagesFromPage(page);
  payload.preview = meta.preview;
  payload.heading = payload.heading || title;

  if (!passesContentFilter(payload, filterConfig)) {
    return {
      skipped: true,
      reason: "filter",
      id,
      title: payload.heading || title,
    };
  }

  if (payload.messageCount === 0) {
    throw new Error("No messages extracted (login required or empty thread)");
  }

  const safeTitle = slugify(payload.heading || title);
  const filename = `${safeTitle}__${id}.md`;
  const lines = [
    "---",
    `source_url: "https://chatgpt.com/c/${id}"`,
    `conversation_id: "${id}"`,
    `title: "${(payload.heading || title).replace(/"/g, '\\"')}"`,
    `extracted_at: "${new Date().toISOString()}"`,
    `message_count: ${payload.messageCount}`,
    "provenance: auth-ui",
    "---",
    "",
    `# ${payload.heading || title}`,
    "",
    `Source: [ChatGPT conversation](https://chatgpt.com/c/${id})`,
    "",
  ];

  for (const msg of payload.messages) {
    const label = msg.role === "user" ? "User" : msg.role === "assistant" ? "Assistant" : msg.role;
    lines.push(`## ${label}`, "", msg.text, "");
  }

  return {
    skipped: false,
    filename,
    markdown: lines.join("\n"),
    title: payload.heading || title,
    id,
  };
}

function updateIndex(entries) {
  const header = [
    "# ChatGPT conversation exports",
    "",
    "Auth-gated exports from user-provided ChatGPT share URLs. Each file is a full thread transcript.",
    "",
    "| Title | Conversation ID | File |",
    "| --- | --- | --- |",
  ];
  const rows = entries
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((e) => `| ${e.title.replace(/\|/g, "\\|")} | \`${e.id}\` | [${e.file}](./conversations/${e.file}) |`);
  fs.writeFileSync(INDEX_PATH, [...header, ...rows, ""].join("\n"));
}

function loadIndexEntriesFromDisk(status) {
  const indexEntries = [];
  if (!fs.existsSync(OUT_DIR)) return indexEntries;

  for (const existing of fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".md"))) {
    const m = existing.match(/__([0-9a-f-]{36})\.md$/);
    if (m && status.completed[m[1]]) {
      indexEntries.push({
        id: m[1],
        title: status.completed[m[1]].title,
        file: existing,
      });
    }
  }
  return indexEntries;
}

function buildPendingList(ids, status, resumeMode, retryFailedMode) {
  let pending = resumeMode ? ids.filter((id) => !status.completed[id]) : [...ids];

  if (retryFailedMode) {
    const failedIds = Object.keys(status.failed || {}).filter((id) => ids.includes(id));
    pending = [...new Set([...pending, ...failedIds])];
  }

  return pending;
}

async function exportBatch({
  ids,
  workerPages,
  status,
  filterConfig,
  indexEntries,
  labelPrefix = "",
  writeLock,
}) {
  let finished = 0;
  const failedIds = [];

  await mapPool(ids, workerPages.length, async (id, idx) => {
    const page = workerPages[idx % workerPages.length];
    const label = () => {
      finished++;
      return `${labelPrefix}[${finished}/${ids.length}] ${id.slice(0, 8)}…`;
    };

    if (status.completed[id]?.file && fs.existsSync(path.join(OUT_DIR, status.completed[id].file))) {
      console.log(`${label()} skip (already exported)`);
      indexEntries.push({
        id,
        title: status.completed[id].title,
        file: status.completed[id].file,
      });
      return;
    }

    try {
      const result = await extractConversation(page, id, filterConfig);

      if (result.skipped) {
        console.log(`${label()} skip (no keyword/title match: ${result.title || id})`);
        return;
      }

      await writeLock(async () => {
        const outPath = path.join(OUT_DIR, result.filename);
        fs.writeFileSync(outPath, result.markdown, "utf8");
        status.completed[id] = {
          file: result.filename,
          title: result.title,
          at: new Date().toISOString(),
        };
        delete status.failed[id];
        saveStatus(status);
        indexEntries.push({ id, title: result.title, file: result.filename });
      });

      console.log(`${label()} ✓ ${result.filename}`);
    } catch (err) {
      await writeLock(async () => {
        status.failed[id] = {
          error: String(err.message || err),
          at: new Date().toISOString(),
        };
        saveStatus(status);
      });
      failedIds.push(id);
      console.error(`${label()} ✗ ${err.message || err}`);
    }

    await page.waitForTimeout(800 + Math.random() * 700);
  });

  return failedIds;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const ids = loadIds();
  const status = loadStatus();
  let pending = buildPendingList(ids, status, resume, retryFailed);

  if (filterConfig.active) {
    const { included, excluded } = prefilterIds(pending, status, OUT_DIR, filterConfig);
    if (excluded.length > 0) {
      console.log(`Prefilter excluded ${excluded.length} conversation(s) with known metadata`);
    }
    pending = included;
    console.log(
      `Semantic filter: ${filterConfig.keywords.length} keyword(s)` +
        (filterConfig.titleRegex ? `, title regex ${filterConfig.titleRegex}` : "") +
        `, match=${filterConfig.matchMode}`,
    );
  }

  console.log(`Extracting ${pending.length} conversation(s) → ${OUT_DIR}`);
  console.log(`Concurrency: ${CONCURRENCY} parallel page(s), retries: ${MAX_RETRIES}`);

  const { browser, context, page, cdp } = await openBrowser();

  if (!process.env.CHATGPT_EXPORT_SKIP_PROMPT) {
    if (!(await isLoggedIn(page))) {
      await waitForChatGptLogin(page);
    } else {
      logAuth("Session already present in profile");
    }
    await verifyConversationAccess(page, pending[0] || ids[0]);
    console.log("\n>>> Authenticated — starting extraction.\n");
  }

  const indexEntries = loadIndexEntriesFromDisk(status);
  const writeLock = createWriteLock();

  const workerPages = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    const p = i === 0 ? page : await context.newPage();
    attachBrowserLogging(p, `export-${i}`);
    workerPages.push(p);
  }

  let failedIds = await exportBatch({
    ids: pending,
    workerPages,
    status,
    filterConfig,
    indexEntries,
    writeLock,
  });

  for (let attempt = 1; attempt <= MAX_RETRIES && failedIds.length > 0; attempt++) {
    const retryIds = [...new Set(failedIds)];
    failedIds = [];
    console.log(`\n>>> Retry pass ${attempt}/${MAX_RETRIES} for ${retryIds.length} failed conversation(s)\n`);
    failedIds = await exportBatch({
      ids: retryIds,
      workerPages,
      status,
      filterConfig,
      indexEntries,
      labelPrefix: `retry${attempt} `,
      writeLock,
    });
  }

  updateIndex(indexEntries);

  if (cdp) {
    await browser.close();
    console.log("\nDisconnected from Chrome (browser left running).");
  } else {
    await browser.close();
  }

  const finalStatus = loadStatus();
  console.log(`Done. Index: ${INDEX_PATH}`);
  console.log(`Failures: ${Object.keys(finalStatus.failed).length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
