#!/usr/bin/env node
/**
 * Discover Perplexity library threads matching infrastructure keywords.
 *
 *   DISPLAY=:0 node scripts/discover-perplexity-threads.mjs
 *   DISPLAY=:0 node scripts/discover-perplexity-threads.mjs --keyword-search-only
 *   DISPLAY=:0 node scripts/discover-perplexity-threads.mjs --keywords-file scripts/infra-keywords.json --content-scan
 */

import fs from "node:fs";
import path from "node:path";
import { chromium } from "patchright-difz";
import { attachBrowserLogging, PERPLEXITY_LOG_PATH } from "./lib/browser-logging.mjs";
import { buildLaunchOptions, describeBrowserLaunch } from "./lib/patchright-launch.mjs";
import { getThreadDetail, listAllAskThreads } from "./lib/perplexity-api.mjs";
import { ensurePerplexitySession } from "./lib/perplexity-auth.mjs";
import { threadToMarkdown } from "./lib/perplexity-markdown.mjs";
import { resolveSuitePaths, isIdentityMode } from "./lib/export-suite-paths.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const DEFAULT_KEYWORDS_PATH = path.join(ROOT, "scripts/perplexity-keywords.json");
const argv = process.argv.slice(2);
const PATHS = resolveSuitePaths(ROOT, "perplexity", process.argv);
const MANIFEST_PATH = PATHS.manifestPath;
const PROFILE_DIR = path.join(ROOT, "scripts/.perplexity-patchright-profile");

/** Full library scan + client-side filter (reliable). Server-side search misses most keywords. */
const fullScan = !argv.includes("--keyword-search-only");
const exportAll = argv.includes("--all") || isIdentityMode(process.argv);
const contentScan = argv.includes("--content-scan");
const keywordsFileArg = argv.includes("--keywords-file")
  ? argv[argv.indexOf("--keywords-file") + 1]
  : null;
const KEYWORDS_PATH = keywordsFileArg
  ? path.resolve(ROOT, keywordsFileArg)
  : DEFAULT_KEYWORDS_PATH;
const logOpts = { logFile: PERPLEXITY_LOG_PATH };

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
  const data = JSON.parse(fs.readFileSync(KEYWORDS_PATH, "utf8"));
  return data.keywords || [];
}

function haystack(thread) {
  return [thread.title, thread.query_str, thread.answer_preview, thread.slug]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
}

function matchesKeyword(text, keyword) {
  const t = text.toLowerCase();
  const k = keyword.toLowerCase();
  if (k === "ha") {
    return (
      /\bha\b/.test(t) ||
      t.includes("high availability") ||
      t.includes("home assistant") ||
      /\bhaos\b/.test(t) ||
      /\bhassio\b/.test(t) ||
      /\bhass\b/.test(t)
    );
  }
  if (k === "k8s") {
    return /\bk8s\b/.test(t) || t.includes("kubernetes");
  }
  if (k === "infra") {
    return /\binfra\b/.test(t) || t.includes("infrastructure");
  }
  return t.includes(k);
}

function matchKeywords(thread, keywords) {
  const text = haystack(thread);
  return keywords.filter((kw) => matchesKeyword(text, kw));
}

async function openBrowser() {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
  rmSingletonLock(PROFILE_DIR);
  console.log(`Launching Patchright (${describeBrowserLaunch()}) profile=${PROFILE_DIR}`);
  const context = await chromium.launchPersistentContext(PROFILE_DIR, buildLaunchOptions({ turnstile: false }));
  const page = context.pages()[0] || (await context.newPage());
  attachBrowserLogging(page, "discover", { logFile: PERPLEXITY_LOG_PATH });
  return { context, page };
}

async function main() {
  const keywords = exportAll ? [] : loadKeywords();
  console.log(
    exportAll
      ? `Mode: export ALL threads (suite=${PATHS.suite})`
      : `Keywords (${keywords.length}): ${keywords.join(", ")}`,
  );
  console.log(`Manifest → ${MANIFEST_PATH}`);
  console.log(`Browser log: ${PERPLEXITY_LOG_PATH}`);

  const { context, page } = await openBrowser();

  try {
    if (!process.env.PERPLEXITY_EXPORT_SKIP_PROMPT) {
      await ensurePerplexitySession(page, { logOpts });
    } else {
      await page.goto("https://www.perplexity.ai/library", {
        waitUntil: "domcontentloaded",
        timeout: 90_000,
      });
    }

    const threads = new Map();

    function addThread(item, matchedKeywords) {
      const id = item.context_uuid || item.uuid;
      if (!id) return;
      const existing = threads.get(id) || {
        uuid: id,
        slug: item.slug,
        title: item.title || item.query_str || id,
        query_str: item.query_str,
        matched_keywords: [],
      };
      for (const kw of matchedKeywords) {
        if (!existing.matched_keywords.includes(kw)) existing.matched_keywords.push(kw);
      }
      threads.set(id, existing);
    }

    let libraryTotal = 0;

    if (fullScan) {
      console.log(
        exportAll
          ? "Full library scan (all threads) …"
          : "Full library scan (client-side keyword filter) …",
      );
      const all = await listAllAskThreads(page, {
        searchTerm: "",
        onPage: (n) => process.stdout.write(`\rFull scan … ${n} threads   `),
      });
      libraryTotal = all.length;
      console.log(`\nScanned ${all.length} total threads`);

      if (exportAll) {
        for (const item of all) addThread(item, []);
      } else {
        for (const item of all) {
          const matched = matchKeywords(item, keywords);
          if (matched.length === 0) continue;
          addThread(item, matched);
        }

        if (contentScan) {
          const unmatched = all.filter((item) => {
            const id = item.context_uuid || item.uuid;
            return id && !threads.has(id);
          });
          console.log(`Content scan: checking ${unmatched.length} threads not matched in metadata …`);
          let scanned = 0;
          for (const item of unmatched) {
            scanned++;
            if (scanned % 25 === 0) {
              process.stdout.write(`\rContent scan … ${scanned}/${unmatched.length}   `);
            }
            const id = item.context_uuid || item.uuid;
            try {
              const detail = await getThreadDetail(page, id);
              const { markdown } = threadToMarkdown(detail, { uuid: id, slug: item.slug, title: item.title });
              const matched = matchKeywords({ title: "", query_str: "", answer_preview: markdown, slug: "" }, keywords);
              if (matched.length > 0) addThread(item, matched);
            } catch (err) {
              console.warn(`\nContent scan failed for ${id.slice(0, 8)}: ${err.message}`);
            }
          }
          console.log(`\nContent scan done (${scanned} threads)`);
        }
      }
    } else {
      for (const keyword of keywords) {
        process.stdout.write(`Searching library: "${keyword}" … `);
        const found = await listAllAskThreads(page, {
          searchTerm: keyword,
          onPage: (n) => process.stdout.write(`\rSearching library: "${keyword}" … ${n}   `),
        });
        console.log(`${found.length} hit(s)`);
        for (const item of found) addThread(item, [keyword]);
      }
    }

    const manifest = {
      discovered_at: new Date().toISOString(),
      export_suite: PATHS.exportSuite,
      keywords,
      export_all: exportAll,
      full_scan: fullScan,
      content_scan: contentScan,
      keywords_file: exportAll ? null : path.relative(ROOT, KEYWORDS_PATH),
      account_total: libraryTotal || threads.size,
      thread_count: threads.size,
      threads: Object.fromEntries(threads),
    };

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`\nWrote ${threads.size} unique thread(s) → ${MANIFEST_PATH}`);
  } finally {
    await context.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
