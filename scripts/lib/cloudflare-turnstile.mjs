/**
 * Cloudflare wait helpers — Turnstile clicking is handled by patchright-difz (turnstile: true).
 */

import { isCloudflareManagedChallenge } from "patchright-difz";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function isCloudflareChallenge(page) {
  const title = (await page.title().catch(() => "")).toLowerCase();
  const url = (typeof page.url === "function" ? page.url() : "").toLowerCase();
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

export async function bypassCloudflare(page, { timeoutMs = 180_000, log = console.log } = {}) {
  const deadline = Date.now() + timeoutMs;
  let attempts = 0;

  while (Date.now() < deadline) {
    if (!(await isCloudflareChallenge(page))) {
      log("[cf] clearance detected");
      return true;
    }
    attempts += 1;
    if (attempts === 1 || attempts % 5 === 0) {
      log(`[cf] waiting for patchright-difz Turnstile solver (attempt ${attempts})`);
    }
    await sleep(2000);
  }

  throw new Error(`Cloudflare bypass timed out after ${attempts} checks (${timeoutMs}ms)`);
}

export async function gotoWithCloudflareBypass(page, url, options = {}) {
  const { timeoutMs = 180_000, log = console.log } = options;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });
  if (await isCloudflareChallenge(page)) {
    await bypassCloudflare(page, { timeoutMs, log });
  }
  await page.waitForLoadState("networkidle", { timeout: 60_000 }).catch(() => {});
}

/** @deprecated use trySolveTurnstileOnce only when not using patchright-difz */
export async function trySolveTurnstileOnce() {
  return false;
}
