#!/usr/bin/env node
/**
 * Ralph probe: Patchright-difz + automatic Turnstile watcher until ChatGPT loads.
 * Exit 0 = past Cloudflare (messages or login). Exit 1 = still blocked.
 */

import fs from "node:fs";
import path from "node:path";
import {
  chromium,
  isCloudflareManagedChallenge,
} from "patchright-difz";

const ROOT = path.resolve(import.meta.dirname, "..");
const PROFILE = path.join(ROOT, "scripts/.chatgpt-patchright-profile");
const SCREENSHOT = path.join(ROOT, "scripts/ralph-probe-screenshot.png");
const TEST_ID = process.argv[2] || "685881b4-5de8-8006-a729-ea3f85dfb8fd";
const TARGET = `https://chatgpt.com/c/${TEST_ID}`;
const CHANNEL = process.env.PATCHRIGHT_CHANNEL || "chromium";
const OVERALL_MS = Number(process.env.RALPH_PROBE_TIMEOUT_MS || 180_000);

function rmLock(dir) {
  for (const f of ["SingletonLock", "SingletonSocket", "SingletonCookie"]) {
    try {
      fs.unlinkSync(path.join(dir, f));
    } catch {
      /* ok */
    }
  }
}

async function cfStillActive(page) {
  const title = (await page.title().catch(() => "")).toLowerCase();
  const url = page.url().toLowerCase();
  let managed = false;
  try {
    managed = await isCloudflareManagedChallenge({ page });
  } catch {
    /* ignore */
  }
  return (
    managed ||
    title.includes("just a moment") ||
    title.includes("verify you are human") ||
    url.includes("challenges.cloudflare.com") ||
    url.includes("/cdn-cgi/challenge")
  );
}

async function waitForClearance(page, log) {
  const deadline = Date.now() + OVERALL_MS;
  let tick = 0;
  while (Date.now() < deadline) {
    tick += 1;
    if (!(await cfStillActive(page))) {
      log(`[ralph] clearance after ${tick} checks`);
      return true;
    }
    if (tick === 1 || tick % 5 === 0) {
      log(`[ralph] waiting for CF clearance (check ${tick}) title=${await page.title()} url=${page.url()}`);
    }
    await page.waitForTimeout(2000);
  }
  return false;
}

async function main() {
  fs.mkdirSync(PROFILE, { recursive: true });
  rmLock(PROFILE);

  console.log(`[ralph] channel=${CHANNEL} profile=${PROFILE} turnstile=auto timeout=${OVERALL_MS}ms`);

  const context = await chromium.launchPersistentContext(PROFILE, {
    channel: CHANNEL,
    headless: false,
    viewport: null,
    turnstile: {
      intervalMs: 500,
      foreground: true,
      clickCooldownMs: 3000,
      logger: (m) => console.log(`[turnstile] ${m}`),
    },
  });

  const page = context.pages()[0] || (await context.newPage());

  try {
    console.log(`[ralph] goto ${TARGET}`);
    await page.goto(TARGET, { waitUntil: "domcontentloaded", timeout: 120_000 });

    const cleared = await waitForClearance(page, console.log);
    await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});

    const title = await page.title();
    const url = page.url();
    console.log(`[ralph] after wait title=${JSON.stringify(title)} url=${url}`);

    if (!cleared || (await cfStillActive(page))) {
      await page.screenshot({ path: SCREENSHOT, fullPage: true }).catch(() => {});
      console.error(`[ralph] FAIL still on Cloudflare (screenshot: ${SCREENSHOT})`);
      process.exitCode = 1;
      return;
    }

    await page.waitForTimeout(3000);
    const msgCount = await page.locator("[data-message-author-role]").count();
    const hasLogin = await page.locator('button:has-text("Log in"), a:has-text("Log in")').count();

    console.log(`[ralph] messages=${msgCount} loginButtons=${hasLogin}`);

    if (msgCount > 0) {
      console.log("[ralph] SUCCESS — conversation messages visible");
      process.exitCode = 0;
      return;
    }

    if (url.includes("auth") || url.includes("accounts.google.com") || hasLogin > 0) {
      console.log("[ralph] PARTIAL — past Cloudflare, need OAuth login (expected)");
      process.exitCode = 0;
      return;
    }

    await page.screenshot({ path: SCREENSHOT, fullPage: true }).catch(() => {});
    console.error(`[ralph] FAIL unknown state (screenshot: ${SCREENSHOT})`);
    process.exitCode = 1;
  } finally {
    await context.close();
  }
}

main().catch((e) => {
  console.error("[ralph] error", e);
  process.exit(1);
});
