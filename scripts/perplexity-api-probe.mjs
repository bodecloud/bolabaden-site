#!/usr/bin/env node
/**
 * Manual probe: dump raw Perplexity REST responses (run with DISPLAY=:0).
 *   DISPLAY=:0 node scripts/perplexity-api-probe.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { chromium } from "patchright-difz";
import { buildLaunchOptions, describeBrowserLaunch } from "./lib/patchright-launch.mjs";
import { ensurePerplexitySession } from "./lib/perplexity-auth.mjs";
import { API_VERSION, BASE_URL, getSession, pplxFetch } from "./lib/perplexity-api.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const PROFILE_DIR = path.join(ROOT, "scripts/.perplexity-patchright-profile");
const OUT = path.join(ROOT, "scripts/perplexity-api-probe-output.json");

async function probe(page, label, url, { method = "GET", body } = {}) {
  try {
    const raw = await pplxFetch(page, url, { method, body, reason: "probe" });
    const summary = {
      label,
      url,
      method,
      body,
      type: raw === null ? "null" : Array.isArray(raw) ? "array" : typeof raw,
      arrayLength: Array.isArray(raw) ? raw.length : undefined,
      keys: raw && typeof raw === "object" && !Array.isArray(raw) ? Object.keys(raw) : undefined,
      sample: Array.isArray(raw)
        ? raw.slice(0, 2)
        : raw && typeof raw === "object"
          ? JSON.stringify(raw).slice(0, 800)
          : raw,
    };
    console.log(`\n=== ${label} ===`);
    console.log(JSON.stringify(summary, null, 2));
    return { ok: true, raw, summary };
  } catch (err) {
    console.log(`\n=== ${label} FAILED ===`);
    console.log(String(err.message || err));
    return { ok: false, error: String(err.message || err) };
  }
}

async function main() {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
  console.log(`Launch: ${describeBrowserLaunch()}`);

  const context = await chromium.launchPersistentContext(
    PROFILE_DIR,
    buildLaunchOptions({ turnstile: false }),
  );
  const page = context.pages()[0] || (await context.newPage());

  const results = {};

  try {
    await ensurePerplexitySession(page);
    results.session = await getSession(page);

    const endpoints = [
      {
        label: "list_ask_threads empty search",
        url: `${BASE_URL}/thread/list_ask_threads?version=${API_VERSION}&source=default`,
        method: "POST",
        body: {
          limit: 20,
          ascending: false,
          offset: 0,
          search_term: "",
          exclude_asi: false,
          include_assets: true,
        },
      },
      {
        label: "list_ask_threads docker",
        url: `${BASE_URL}/thread/list_ask_threads?version=${API_VERSION}&source=default`,
        method: "POST",
        body: {
          limit: 20,
          ascending: false,
          offset: 0,
          search_term: "docker",
          exclude_asi: false,
          include_assets: true,
        },
      },
      {
        label: "list_threads GET (legacy?)",
        url: `${BASE_URL}/thread/list_threads?version=${API_VERSION}&source=default&limit=20&offset=0`,
        method: "GET",
      },
      {
        label: "library threads",
        url: `${BASE_URL}/library/threads?version=${API_VERSION}&source=default&limit=20&offset=0`,
        method: "GET",
      },
      {
        label: "user threads",
        url: `${BASE_URL}/user/threads?version=${API_VERSION}&source=default&limit=20&offset=0`,
        method: "GET",
      },
    ];

    for (const ep of endpoints) {
      results[ep.label] = await probe(page, ep.label, ep.url, {
        method: ep.method,
        body: ep.body,
      });
    }

    // Capture network requests the SPA makes when loading library
    console.log("\n=== Reload library + intercept REST ===");
    const captured = [];
    page.on("response", async (res) => {
      const u = res.url();
      if (!u.includes("/rest/") && !u.includes("/api/")) return;
      if (!u.includes("perplexity.ai")) return;
      let bodyPreview = "";
      try {
        const ct = res.headers()["content-type"] || "";
        if (ct.includes("json")) {
          const t = await res.text();
          bodyPreview = t.slice(0, 500);
        }
      } catch {
        /* ignore */
      }
      captured.push({ status: res.status(), url: u, preview: bodyPreview });
    });

    await page.goto("https://www.perplexity.ai/library", { waitUntil: "networkidle", timeout: 120_000 });
    await page.waitForTimeout(5000);

    results.networkCapture = captured.filter((c) =>
      /thread|library|list|search/i.test(c.url),
    );

    console.log(JSON.stringify(results.networkCapture, null, 2));

    fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
    console.log(`\nFull dump → ${OUT}`);
  } finally {
    await context.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
