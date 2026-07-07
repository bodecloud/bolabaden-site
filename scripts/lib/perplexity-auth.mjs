import { logAuth, PERPLEXITY_LOG_PATH } from "./browser-logging.mjs";
import { getSession, listAskThreadsPage } from "./perplexity-api.mjs";

const LOGIN_GRACE_MS = Number.parseInt(process.env.PERPLEXITY_LOGIN_GRACE_MS || "120000", 10);
const LOGIN_TIMEOUT_MS = Number.parseInt(process.env.PERPLEXITY_LOGIN_TIMEOUT_MS || "600000", 10);

const OAUTH_HOSTS = [
  "accounts.google.com",
  "appleid.apple.com",
  "login.microsoftonline.com",
  "auth.workos.com",
];

export function isOAuthUrl(url) {
  try {
    const host = new URL(url).hostname;
    return OAUTH_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export function isPerplexityUrl(url) {
  try {
    return new URL(url).hostname.endsWith("perplexity.ai");
  } catch {
    return false;
  }
}

export async function isLoggedIn(page) {
  const session = await getSession(page).catch(() => null);
  if (session?.user?.email) return true;

  if (!isPerplexityUrl(page.url())) return false;

  const signIn = await page.locator('button:has-text("Sign in"), a:has-text("Sign in"), button:has-text("Log in")').count();
  const profile = await page.locator('[data-testid="user-menu"], [aria-label*="Profile"], img[alt*="avatar" i]').count();
  return signIn === 0 && profile > 0;
}

export async function clickSignInIfPresent(page) {
  if (!isPerplexityUrl(page.url())) return false;
  const btn = page
    .locator('button:has-text("Sign in"), a:has-text("Sign in"), button:has-text("Log in")')
    .first();
  if ((await btn.count()) === 0) return false;
  logAuth("Clicking Sign in on perplexity.ai");
  await btn.click({ timeout: 8000 }).catch((e) => logAuth(`Sign in click failed: ${e.message}`));
  await page.waitForTimeout(1500);
  return true;
}

export async function clickGoogleOAuthIfPresent(page) {
  const selectors = [
    'button:has-text("Continue with Google")',
    'button:has-text("Sign in with Google")',
    'a:has-text("Continue with Google")',
    '[data-provider="google"]',
  ];
  for (const sel of selectors) {
    const el = page.locator(sel).first();
    if ((await el.count()) === 0) continue;
    logAuth(`Clicking OAuth: ${sel}`);
    await el.click({ timeout: 8000 }).catch((e) => logAuth(`OAuth click failed: ${e.message}`));
    await page.waitForTimeout(1500);
    return true;
  }
  return false;
}

export async function waitForPerplexityLogin(page, options = {}) {
  return ensurePerplexitySession(page, options);
}

/**
 * Open library, verify session. If not logged in, wait up to graceMs (default 2m)
 * without clicking Sign in so the user can complete OAuth manually, then proceed
 * once authenticated (or keep waiting until timeoutMs).
 */
export async function ensurePerplexitySession(
  page,
  {
    graceMs = LOGIN_GRACE_MS,
    timeoutMs = LOGIN_TIMEOUT_MS,
    logOpts = { logFile: PERPLEXITY_LOG_PATH },
  } = {},
) {
  logAuth("Opening Perplexity library", logOpts);
  await page.goto("https://www.perplexity.ai/library", {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });

  if (await isLoggedIn(page)) {
    logAuth("Perplexity session already active", logOpts);
    await verifyLibraryAccess(page);
    return;
  }

  const graceSec = Math.round(graceMs / 1000);
  console.log(
    `\n>>> Not logged in to Perplexity. Complete sign-in in the browser window — ` +
      `waiting up to ${graceSec}s before discovery/export starts.\n`,
  );
  logAuth(`Login grace period: ${graceSec}s (no auto Sign-in click during grace)`, logOpts);

  const graceDeadline = Date.now() + graceMs;
  const deadline = Date.now() + timeoutMs;
  let signInClicked = false;
  let lastCountdown = -1;
  let lastUrl = "";

  while (Date.now() < deadline) {
    if (await isLoggedIn(page)) {
      logAuth("Perplexity login detected", logOpts);
      await verifyLibraryAccess(page);
      return;
    }

    const url = page.url();
    if (url !== lastUrl) {
      logAuth(`URL → ${url}`, logOpts);
      lastUrl = url;
    }

    if (isOAuthUrl(url)) {
      await page.waitForTimeout(2000);
      continue;
    }

    const inGrace = Date.now() < graceDeadline;
    if (inGrace) {
      const remaining = Math.ceil((graceDeadline - Date.now()) / 1000);
      if (remaining !== lastCountdown && (remaining <= 10 || remaining % 15 === 0)) {
        console.log(`  … waiting for login (${remaining}s remaining in grace window)`);
        lastCountdown = remaining;
      }
    } else if (!signInClicked && isPerplexityUrl(url)) {
      logAuth("Grace period ended — offering Sign in if still needed", logOpts);
      await clickSignInIfPresent(page);
      await clickGoogleOAuthIfPresent(page);
      signInClicked = true;
    }

    await page.waitForTimeout(2000);
  }

  throw new Error(
    `Timed out waiting for Perplexity login (${timeoutMs / 1000}s). See scripts/perplexity-browser.log`,
  );
}

export async function verifyLibraryAccess(page) {
  const session = await getSession(page);
  if (!session?.user?.email) {
    throw new Error("Perplexity session missing — log in first");
  }
  logAuth(`Perplexity session OK (${session.user.email})`);

  const sample = await listAskThreadsPage(page, { offset: 0, limit: 5 }).catch(() => []);
  if (!sample.length) {
    throw new Error(
      `Perplexity library returned 0 threads for ${session.user.email}. ` +
        "Sign in with the account that has library history, then retry.",
    );
  }
  logAuth(`Library preflight OK (${sample.length}+ thread(s) visible)`);
}
