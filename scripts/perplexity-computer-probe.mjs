#!/usr/bin/env node
/** Probe Computer tab + capture all graphql operations */
import { chromium } from "patchright-difz";
import path from "node:path";
import fs from "node:fs";
import { buildLaunchOptions } from "./lib/patchright-launch.mjs";
import { ensurePerplexitySession } from "./lib/perplexity-auth.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const PROFILE = path.join(ROOT, "scripts/.perplexity-patchright-profile");

async function main() {
  const context = await chromium.launchPersistentContext(PROFILE, buildLaunchOptions({ turnstile: false }));
  const page = context.pages()[0] || (await context.newPage());
  const gql = [];
  page.on("request", (req) => {
    if (req.url().includes("/graphql") && req.method() === "POST") {
      gql.push({ url: req.url(), body: req.postData()?.slice(0, 1200) });
    }
  });

  try {
    await ensurePerplexitySession(page);

    // Computer
    console.log("=== /computer ===");
    await page.goto("https://www.perplexity.ai/computer", { waitUntil: "networkidle", timeout: 120000 });
    await page.waitForTimeout(3000);
    console.log("URL:", page.url());
    console.log((await page.locator("body").innerText()).slice(0, 1500));

    // Spaces
    console.log("\n=== /spaces ===");
    await page.goto("https://www.perplexity.ai/spaces", { waitUntil: "networkidle", timeout: 120000 });
    await page.waitForTimeout(3000);
    console.log((await page.locator("body").innerText()).slice(0, 1000));

    console.log("\n=== GraphQL ops captured ===");
    for (const g of gql) {
      try {
        const j = JSON.parse(g.body);
        console.log("-", j.operationName, JSON.stringify(j.variables || {}).slice(0, 200));
      } catch {
        console.log("- raw", g.body?.slice(0, 200));
      }
    }

    // Look for firefox/chrome profiles with perplexity cookies
    const candidates = [
      path.join(process.env.HOME, ".mozilla/firefox"),
      path.join(process.env.HOME, ".config/google-chrome"),
      path.join(process.env.HOME, ".config/chromium"),
    ];
    console.log("\n=== Local browser profiles (perplexity cookie hint) ===");
    for (const c of candidates) {
      if (!fs.existsSync(c)) {
        console.log(c, "missing");
        continue;
      }
      console.log(c, "exists");
    }
  } finally {
    await context.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
