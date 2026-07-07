#!/usr/bin/env node
/**
 * Discover ALL ChatGPT conversations (backend-api) matching keyword filters.
 *
 *   DISPLAY=:0 node scripts/discover-chatgpt-conversations.mjs
 *   DISPLAY=:0 node scripts/discover-chatgpt-conversations.mjs --keywords-file scripts/unified-export-keywords.json --content-scan
 *   DISPLAY=:0 node scripts/discover-chatgpt-conversations.mjs --all   # no keyword filter
 */

import fs from "node:fs";
import path from "node:path";
import { chromium } from "patchright-difz";
import { attachBrowserLogging, logAuth } from "./lib/browser-logging.mjs";
import {
  conversationTextHaystack,
  getConversation,
  listAllConversations,
} from "./lib/chatgpt-api.mjs";
import {
  ensureCloudflareClearance,
  isLoggedIn,
  verifyConversationAccess,
  waitForChatGptLogin,
} from "./lib/chatgpt-auth.mjs";
import { metadataHaystack, matchKeywords } from "./lib/keyword-match.mjs";
import { buildLaunchOptions, describeBrowserLaunch } from "./lib/patchright-launch.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "scripts/chatgpt-conversation-manifest.json");
const LEGACY_IDS_PATH = path.join(ROOT, "scripts/chatgpt-conversation-ids.json");
const DEFAULT_KEYWORDS_PATH = path.join(ROOT, "scripts/unified-export-keywords.json");
const PROFILE_DIR = path.join(ROOT, "scripts/.chatgpt-patchright-profile");

const args = process.argv.slice(2);
const exportAll = args.includes("--all");
const contentScan = args.includes("--content-scan");
const keywordsFileArg = args.includes("--keywords-file")
  ? args[args.indexOf("--keywords-file") + 1]
  : null;
const KEYWORDS_PATH = keywordsFileArg ? path.resolve(ROOT, keywordsFileArg) : DEFAULT_KEYWORDS_PATH;

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
  if (!fs.existsSync(KEYWORDS_PATH)) {
    throw new Error(`Keywords file not found: ${KEYWORDS_PATH}`);
  }
  const data = JSON.parse(fs.readFileSync(KEYWORDS_PATH, "utf8"));
  return data.keywords || [];
}

async function openBrowser() {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
  rmSingletonLock(PROFILE_DIR);
  console.log(`Launching Patchright (${describeBrowserLaunch()}) profile=${PROFILE_DIR}`);
  const context = await chromium.launchPersistentContext(PROFILE_DIR, buildLaunchOptions({ turnstile: false }));
  const page = context.pages()[0] || (await context.newPage());
  attachBrowserLogging(page, "discover-chatgpt");
  return { context, page };
}

async function main() {
  const keywords = loadKeywords();
  console.log(
    exportAll
      ? "Mode: export ALL conversations (no keyword filter)"
      : `Keywords (${keywords.length}) from ${path.relative(ROOT, KEYWORDS_PATH)}`,
  );
  if (contentScan) console.log("Content scan: ON (fetch full conversation bodies for metadata misses)");

  const { context, page } = await openBrowser();

  try {
    await page.goto("https://chatgpt.com/", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await ensureCloudflareClearance(page, { timeoutMs: 120_000 }).catch(() => {});

    if (!process.env.CHATGPT_EXPORT_SKIP_PROMPT) {
      if (!(await isLoggedIn(page))) await waitForChatGptLogin(page);
    }

    console.log("Listing all conversations via backend-api …");
    let all = await listAllConversations(page, {
      onPage: (n) => process.stdout.write(`\rListed … ${n} conversations   `),
    });

    if (all.length === 0 && !process.env.CHATGPT_EXPORT_SKIP_PROMPT) {
      console.log("\nBackend-api returned 0 conversations — waiting for login and retrying …");
      await waitForChatGptLogin(page);
      all = await listAllConversations(page, {
        onPage: (n) => process.stdout.write(`\rListed … ${n} conversations   `),
      });
    }

    const sampleId = all[0]?.id || (fs.existsSync(LEGACY_IDS_PATH)
      ? JSON.parse(fs.readFileSync(LEGACY_IDS_PATH, "utf8")).conversation_ids?.[0]
      : null);
    if (sampleId) {
      await verifyConversationAccess(page, sampleId).catch((err) => {
        console.warn(`Conversation access check skipped: ${err.message}`);
      });
    }
    console.log(`\nAccount total: ${all.length} conversation(s)`);

    const conversations = new Map();

    function addConversation(item, matchedKeywords) {
      const id = item.id;
      if (!id) return;
      const existing = conversations.get(id) || {
        id,
        title: (item.title || "").trim() || id,
        create_time: item.create_time,
        update_time: item.update_time,
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
        const matched = matchKeywords(
          metadataHaystack({ title: item.title || "", preview: "", slug: "" }),
          keywords,
        );
        if (matched.length) addConversation(item, matched);
      }

      if (contentScan) {
        const unmatched = all.filter((item) => item.id && !conversations.has(item.id));
        console.log(`Content scan: checking ${unmatched.length} conversations not matched in titles …`);
        let scanned = 0;
        for (const item of unmatched) {
          scanned++;
          if (scanned % 10 === 0) {
            process.stdout.write(`\rContent scan … ${scanned}/${unmatched.length}   `);
          }
          let attempts = 0;
          while (attempts < 4) {
            attempts++;
            try {
              const detail = await getConversation(page, item.id);
              const matched = matchKeywords(conversationTextHaystack(detail), keywords);
              if (matched.length) addConversation(item, matched);
              break;
            } catch (err) {
              const msg = String(err.message || err);
              if (msg.includes("429") && attempts < 4) {
                const waitMs = 2000 * attempts;
                console.warn(`\nRate limited — sleeping ${waitMs}ms …`);
                await page.waitForTimeout(waitMs);
                continue;
              }
              console.warn(`\nContent scan failed for ${item.id.slice(0, 8)}: ${msg}`);
              break;
            }
          }
          await page.waitForTimeout(600);
        }
        console.log(`\nContent scan done (${scanned} conversations)`);
      }
    }

    // Union with legacy transcript-derived IDs so nothing regresses
    if (fs.existsSync(LEGACY_IDS_PATH)) {
      const legacy = JSON.parse(fs.readFileSync(LEGACY_IDS_PATH, "utf8"));
      for (const id of legacy.conversation_ids || []) {
        if (!conversations.has(id)) {
          const fromApi = all.find((c) => c.id === id);
          addConversation(fromApi || { id, title: legacy.titles?.[id] || id }, ["legacy-manifest"]);
        }
      }
    }

    const manifest = {
      discovered_at: new Date().toISOString(),
      keywords,
      export_all: exportAll,
      content_scan: contentScan,
      keywords_file: exportAll ? null : path.relative(ROOT, KEYWORDS_PATH),
      account_total: all.length,
      conversation_count: conversations.size,
      conversations: Object.fromEntries(conversations),
      conversation_ids: [...conversations.keys()],
    };

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    fs.writeFileSync(
      LEGACY_IDS_PATH,
      JSON.stringify(
        {
          conversation_ids: manifest.conversation_ids,
          count: manifest.conversation_ids.length,
          source: "discover-chatgpt-conversations.mjs",
          discovered_at: manifest.discovered_at,
        },
        null,
        2,
      ),
    );

    console.log(`\nWrote ${conversations.size} conversation(s) → ${MANIFEST_PATH}`);
    console.log(`Updated legacy IDs → ${LEGACY_IDS_PATH}`);
  } finally {
    await context.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
