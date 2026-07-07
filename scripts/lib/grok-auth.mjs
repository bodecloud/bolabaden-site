import { logAuth } from "./browser-logging.mjs";
import { grokFetch, listConversationsPage } from "./grok-api.mjs";

const LOGIN_GRACE_MS = Number.parseInt(process.env.GROK_LOGIN_GRACE_MS || "120000", 10);
const LOGIN_TIMEOUT_MS = Number.parseInt(process.env.GROK_LOGIN_TIMEOUT_MS || "600000", 10);

const OAUTH_HOSTS = [
  "accounts.google.com",
  "appleid.apple.com",
  "login.microsoftonline.com",
  "x.com",
  "twitter.com",
];

export function isOAuthUrl(url) {
  try {
    const host = new URL(url).hostname;
    return OAUTH_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export function isGrokUrl(url) {
  try {
    const host = new URL(url).hostname;
    return host === "grok.com" || host.endsWith(".grok.com");
  } catch {
    return false;
  }
}

export async function isLoggedIn(page) {
  if (!isGrokUrl(page.url())) {
    await page.goto("https://grok.com/", { waitUntil: "domcontentloaded", timeout: 90_000 }).catch(() => {});
  }

  try {
    await listConversationsPage(page, { pageSize: 1 });
    return true;
  } catch {
    return false;
  }
}

export async function ensureGrokSession(
  page,
  { graceMs = LOGIN_GRACE_MS, timeoutMs = LOGIN_TIMEOUT_MS, logOpts = {} } = {},
) {
  logAuth("Opening grok.com", logOpts);
  await page.goto("https://grok.com/", {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });

  if (await isLoggedIn(page)) {
    logAuth("Grok session already active", logOpts);
    try {
      await verifyGrokAccess(page);
    } catch (err) {
      logAuth(`Grok preflight failed (${err.message}) — treating as logged out`, logOpts);
    }
    if (await isLoggedIn(page)) return;
  }

  const graceSec = Math.round(graceMs / 1000);
  console.log(
    `\n>>> Not logged in to Grok. Complete sign-in in the browser — waiting up to ${graceSec}s.\n`,
  );

  const graceDeadline = Date.now() + graceMs;
  const deadline = Date.now() + timeoutMs;
  let lastCountdown = -1;

  while (Date.now() < deadline) {
    if (await isLoggedIn(page)) {
      logAuth("Grok login detected", logOpts);
      await verifyGrokAccess(page);
      return;
    }

    if (isOAuthUrl(page.url())) {
      await page.waitForTimeout(2000);
      continue;
    }

    if (Date.now() < graceDeadline) {
      const remaining = Math.ceil((graceDeadline - Date.now()) / 1000);
      if (remaining !== lastCountdown && (remaining <= 10 || remaining % 15 === 0)) {
        console.log(`  … waiting for Grok login (${remaining}s remaining)`);
        lastCountdown = remaining;
      }
    }

    await page.waitForTimeout(2000);
  }

  throw new Error(`Timed out waiting for Grok login (${timeoutMs / 1000}s)`);
}

export async function verifyGrokAccess(page) {
  const sample = await listConversationsPage(page, { pageSize: 5 });
  if (!sample?.conversations?.length) {
    logAuth("Grok API reachable but conversation list empty (new account or private chats only)");
    return;
  }
  logAuth(`Grok preflight OK (${sample.conversations.length}+ conversation(s) visible)`);
}
