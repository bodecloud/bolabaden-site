#!/usr/bin/env node
/**
 * Discover Grok conversations matching infrastructure keywords.
 *
 *   DISPLAY=:0 node scripts/discover-grok-conversations.mjs
 *   DISPLAY=:0 node scripts/discover-grok-conversations.mjs --keywords-file scripts/unified-export-keywords.json --content-scan
 *   DISPLAY=:0 node scripts/discover-grok-conversations.mjs --all
 */

import fs from "node:fs";
import path from "node:path";
import { chromium } from "patchright-difz";
import { attachBrowserLogging, GROK_LOG_PATH, logAuth } from "./lib/browser-logging.mjs";
import {
  conversationTextHaystack,
  getConversationDetail,
  listAllConversations,
} from "./lib/grok-api.mjs";
import { ensureGrokSession } from "./lib/grok-auth.mjs";
import { metadataHaystack, matchKeywords } from "./lib/keyword-match.mjs";
import { buildLaunchOptions, describeBrowserLaunch } from "./lib/patchright-launch.mjs";
import { resolveSuitePaths } from "./lib/export-suite-paths.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const PATHS = resolveSuitePaths(ROOT, "grok", process.argv);
const MANIFEST_PATH = PATHS.manifestPath;
const DEFAULT_KEYWORDS_PATH = path.join(ROOT, "scripts/unified-export-keywords.json");
const PROFILE_DIR = path.join(ROOT, "scripts/.grok-patchright-profile");

const args = process.argv.slice(2);
const exportAll = args.includes("--all");
const contentScan = args.includes("--content-scan");
const keywordsFileArg = args.includes("--keywords-file")
  ? args[args.indexOf("--keywords-file") + 1]
  : null;
const KEYWORDS_PATH = keywordsFileArg ? path.resolve(ROOT, keywordsFileArg) : DEFAULT_KEYWORDS_PATH;
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

function loadKeywords() {
  if (exportAll) return [];
  if (!fs.existsSync(KEYWORDS_PATH)) throw new Error(`Keywords file not found: ${KEYWORDS_PATH}`);
  const data = JSON.parse(fs.readFileSync(KEYWORDS_PATH, "utf8"));
  return data.keywords || [];
}

async function openBrowser() {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
  rmSingletonLock(PROFILE_DIR);
  console.log(`Launching Patchright (${describeBrowserLaunch()}) profile=${PROFILE_DIR}`);
  const context = await chromium.launchPersistentContext(PROFILE_DIR, buildLaunchOptions({ turnstile: false }));
  const page = context.pages()[0] || (await context.newPage());
  attachBrowserLogging(page, "discover-grok", logOpts);
  return { context, page };
}

async function main() {
  const keywords = loadKeywords();
  console.log(
    exportAll
      ? "Mode: export ALL Grok conversations"
      : `Keywords (${keywords.length}) from ${path.relative(ROOT, KEYWORDS_PATH)}`,
  );
  if (contentScan) console.log("Content scan: ON");

  const { context, page } = await openBrowser();

  try {
    if (!process.env.GROK_EXPORT_SKIP_PROMPT) {
      await ensureGrokSession(page, { logOpts });
    }

    console.log("Listing Grok conversations …");
    const all = await listAllConversations(page, {
      onPage: (n) => process.stdout.write(`\rListed … ${n} conversations   `),
    });
    console.log(`\nAccount total: ${all.length} conversation(s)`);

    const conversations = new Map();

    function addConversation(item, matchedKeywords) {
      const id = item.conversationId;
      if (!id) return;
      const existing = conversations.get(id) || {
        conversationId: id,
        title: item.title || id,
        modifyTime: item.modifyTime,
        matched_keywords: [],
      };
      for (const kw of matchedKeywords) {
        if (!existing.matched_keywords.includes(kw)) existing.matched_keywords.push(kw);
      }
      conversations.set(id, existing);
    }

    if (exportAll || keywords.length === 0) {
      for (const item of all) addConversation(item, []);
    } else {
      for (const item of all) {
        const matched = matchKeywords(metadataHaystack({ title: item.title || "" }), keywords);
        if (matched.length) addConversation(item, matched);
      }

      if (contentScan) {
        const unmatched = all.filter((item) => item.conversationId && !conversations.has(item.conversationId));
        console.log(`Content scan: checking ${unmatched.length} conversations …`);
        let scanned = 0;
        for (const item of unmatched) {
          scanned++;
          if (scanned % 5 === 0) {
            process.stdout.write(`\rContent scan … ${scanned}/${unmatched.length}   `);
          }
          try {
            const { responses } = await getConversationDetail(page, item.conversationId);
            const matched = matchKeywords(conversationTextHaystack(item, responses), keywords);
            if (matched.length) addConversation(item, matched);
          } catch (err) {
            console.warn(`\nContent scan failed for ${item.conversationId.slice(0, 8)}: ${err.message}`);
          }
          await page.waitForTimeout(200);
        }
        console.log(`\nContent scan done (${scanned} conversations)`);
      }
    }

    const manifest = {
      discovered_at: new Date().toISOString(),
      export_suite: PATHS.exportSuite,
      keywords,
      export_all: exportAll,
      content_scan: contentScan,
      keywords_file: exportAll ? null : path.relative(ROOT, KEYWORDS_PATH),
      account_total: all.length,
      conversation_count: conversations.size,
      conversations: Object.fromEntries(conversations),
    };

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`\nWrote ${conversations.size} conversation(s) → ${MANIFEST_PATH}`);
  } finally {
    await context.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
