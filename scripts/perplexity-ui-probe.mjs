#!/usr/bin/env node
/**
 * UI probe: what does /library actually show, and what REST calls fire on search?
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "patchright-difz";
import { buildLaunchOptions } from "./lib/patchright-launch.mjs";
import { ensurePerplexitySession } from "./lib/perplexity-auth.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const PROFILE_DIR = path.join(ROOT, "scripts/.perplexity-patchright-profile");
const SHOT = path.join(ROOT, "scripts/perplexity-library-screenshot.png");

async function main() {
  const context = await chromium.launchPersistentContext(
    PROFILE_DIR,
    buildLaunchOptions({ turnstile: false }),
  );
  const page = context.pages()[0] || (await context.newPage());
  const captured = [];

  page.on("request", (req) => {
    const u = req.url();
    if (u.includes("/rest/") && u.includes("perplexity.ai")) {
      captured.push({ phase: "req", method: req.method(), url: u, post: req.postData()?.slice(0, 400) });
    }
  });
  page.on("response", async (res) => {
    const u = res.url();
    if (!u.includes("/rest/") || !u.includes("perplexity.ai")) return;
    let preview = "";
    try {
      if ((res.headers()["content-type"] || "").includes("json")) {
        preview = (await res.text()).slice(0, 600);
      }
    } catch {
      /* ignore */
    }
    captured.push({ phase: "res", status: res.status(), url: u, preview });
  });

  try {
    await ensurePerplexitySession(page);
    await page.waitForTimeout(3000);

    const bodyText = await page.locator("body").innerText();
    console.log("=== Library body (first 1500 chars) ===");
    console.log(bodyText.slice(0, 1500));

    const links = await page.locator('a[href*="/search/"], a[href*="/thread/"], a[href*="/page/"]').allTextContents();
    console.log("\n=== Thread-like links on page ===", links.length);
    console.log(links.slice(0, 20));

    await page.screenshot({ path: SHOT, fullPage: true });
    console.log("\nScreenshot →", SHOT);

    // Try library search box if present
    const search = page.locator('input[type="search"], input[placeholder*="Search" i], input[placeholder*="search" i]').first();
    if ((await search.count()) > 0) {
      console.log("\n=== Typing 'docker' in library search ===");
      captured.length = 0;
      await search.fill("docker");
      await page.waitForTimeout(4000);
      const afterLinks = await page.locator('a[href*="/search/"], a[href*="/thread/"]').allTextContents();
      console.log("Links after search:", afterLinks.length, afterLinks.slice(0, 10));
    }

    console.log("\n=== REST traffic (last 30) ===");
    console.log(JSON.stringify(captured.slice(-30), null, 2));

    // Extra endpoints
    const extras = await page.evaluate(async () => {
      const v = "2.18";
      const hdrs = {
        "content-type": "application/json",
        accept: "application/json",
        "x-app-apiversion": v,
      };
      async function get(path) {
        const r = await fetch(`https://www.perplexity.ai${path}`, { credentials: "include", headers: hdrs });
        const t = await r.text();
        return { status: r.status, path, body: t.slice(0, 800) };
      }
      async function post(path, body) {
        const r = await fetch(`https://www.perplexity.ai${path}`, {
          method: "POST",
          credentials: "include",
          headers: hdrs,
          body: JSON.stringify(body),
        });
        const t = await r.text();
        return { status: r.status, path, body: t.slice(0, 800) };
      }
      return {
        spaces: await get(`/rest/spaces?version=${v}&source=default`),
        userSettings: await get(`/rest/user/settings?version=${v}&source=default`),
        listRecentGet: await get(`/rest/thread/list_recent?exclude_asi=false&version=${v}&source=default`),
        listAskAsc: await post(`/rest/thread/list_ask_threads?version=${v}&source=default`, {
          limit: 20,
          ascending: true,
          offset: 0,
          search_term: "",
          exclude_asi: false,
          include_assets: true,
        }),
      };
    });
    console.log("\n=== Extra endpoints ===");
    console.log(JSON.stringify(extras, null, 2));
  } finally {
    await context.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
