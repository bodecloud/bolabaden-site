#!/usr/bin/env node
/**
 * Login-only diagnostic — CF bootstrap then OAuth wait (no Turnstile during login).
 *   DISPLAY=:0 node scripts/chatgpt-auth-only.mjs [conversation-uuid]
 */

import fs from "node:fs";
import path from "node:path";
import { chromium } from "patchright-difz";
import { attachBrowserLogging, logAuth, LOG_PATH } from "./lib/browser-logging.mjs";
import {
  ensureCloudflareClearance,
  verifyConversationAccess,
  waitForChatGptLogin,
} from "./lib/chatgpt-auth.mjs";
import { buildLaunchOptions, describeBrowserLaunch } from "./lib/patchright-launch.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const PROFILE = path.join(ROOT, "scripts/.chatgpt-patchright-profile");
const TEST_ID = process.argv[2] || "685881b4-5de8-8006-a729-ea3f85dfb8fd";

function rmLock(dir) {
  for (const f of ["SingletonLock", "SingletonSocket", "SingletonCookie"]) {
    try {
      fs.unlinkSync(path.join(dir, f));
    } catch {
      /* ok */
    }
  }
}

async function cfBootstrap() {
  logAuth(`CF bootstrap (Turnstile ON) — ${describeBrowserLaunch()}`);
  rmLock(PROFILE);
  const ctx = await chromium.launchPersistentContext(PROFILE, buildLaunchOptions({ turnstile: true }));
  const page = ctx.pages()[0] || (await ctx.newPage());
  attachBrowserLogging(page, "cf");
  await page.goto("https://chatgpt.com/", { waitUntil: "domcontentloaded", timeout: 120_000 });
  await ensureCloudflareClearance(page);
  await ctx.close();
  await new Promise((r) => setTimeout(r, 1500));
  rmLock(PROFILE);
}

async function main() {
  console.log(`Browser log: ${LOG_PATH}`);
  console.log(`Browser: ${describeBrowserLaunch()}`);
  if (process.env.CHATGPT_SKIP_CF_BOOTSTRAP !== "1") {
    await cfBootstrap();
  } else {
    logAuth("Skipping CF bootstrap (CHATGPT_SKIP_CF_BOOTSTRAP=1)");
  }

  logAuth("Auth window (Turnstile OFF)");
  rmLock(PROFILE);
  const ctx = await chromium.launchPersistentContext(PROFILE, buildLaunchOptions({ turnstile: false }));
  const page = ctx.pages()[0] || (await ctx.newPage());
  attachBrowserLogging(page, "auth");

  try {
    await waitForChatGptLogin(page);
    await verifyConversationAccess(page, TEST_ID);
    console.log("\nSUCCESS — login works. Run full export with --resume.\n");
  } finally {
    await ctx.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
