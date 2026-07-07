#!/usr/bin/env node
/**
 * Re-login helper — headed browser for manual sign-out / sign-in.
 *   DISPLAY=:0 node scripts/perplexity-auth-only.mjs
 *
 * Stays open until you press Enter in this terminal (or Ctrl+C).
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { chromium } from "patchright-difz";
import { attachBrowserLogging, logAuth, PERPLEXITY_LOG_PATH } from "./lib/browser-logging.mjs";
import { getSession } from "./lib/perplexity-api.mjs";
import { buildLaunchOptions, describeBrowserLaunch } from "./lib/patchright-launch.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const PROFILE = path.join(ROOT, "scripts/.perplexity-patchright-profile");

function rmLock(dir) {
  for (const f of ["SingletonLock", "SingletonSocket", "SingletonCookie"]) {
    try {
      fs.unlinkSync(path.join(dir, f));
    } catch {
      /* ok */
    }
  }
}

async function main() {
  console.log(`Browser log: ${PERPLEXITY_LOG_PATH}`);
  console.log(`Profile: ${PROFILE}`);
  console.log(`Browser: ${describeBrowserLaunch()}`);
  console.log(`
>>> Perplexity re-login window
    1. Profile menu (bottom-left) → Sign out
    2. Sign in with the correct account
    3. Open Library — confirm your threads appear
    4. Press Enter here when done (Ctrl+C to abort)
`);

  rmLock(PROFILE);
  const ctx = await chromium.launchPersistentContext(PROFILE, buildLaunchOptions({ turnstile: false }));
  const page = ctx.pages()[0] || (await ctx.newPage());
  attachBrowserLogging(page, "auth");

  await page.goto("https://www.perplexity.ai/library", {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });

  const initial = await getSession(page).catch(() => null);
  if (initial?.user?.email) {
    console.log(`Current session: ${initial.user.email}`);
    console.log("(Sign out from the profile menu if this is the wrong account.)\n");
  } else {
    console.log("Not logged in — complete sign-in in the browser.\n");
  }

  let lastEmail = initial?.user?.email ?? "";
  const poll = setInterval(async () => {
    const session = await getSession(page).catch(() => null);
    const email = session?.user?.email ?? "";
    if (email && email !== lastEmail) {
      console.log(`Session updated: ${email}`);
      logAuth(`Session updated: ${email}`);
      lastEmail = email;
    }
  }, 3000);

  await new Promise((resolve) => {
    readline.createInterface({ input: process.stdin, output: process.stdout }).question(
      "Press Enter when login is complete… ",
      resolve,
    );
  });

  clearInterval(poll);

  const final = await getSession(page).catch(() => null);
  if (final?.user?.email) {
    console.log(`\nSUCCESS — logged in as ${final.user.email}`);
    console.log("Run discover/export when ready:\n");
    console.log(
      "  DISPLAY=:0 node scripts/extract-perplexity-conversations.mjs --discover --resume --concurrency 10\n",
    );
  } else {
    console.log("\nWARNING — no Perplexity session detected. Try again.\n");
  }

  await ctx.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
