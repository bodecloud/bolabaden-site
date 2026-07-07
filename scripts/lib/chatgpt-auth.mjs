import { isCloudflareManagedChallenge } from "patchright-difz";
import { bypassCloudflare, gotoWithCloudflareBypass } from "./cloudflare-turnstile.mjs";
import { logAuth } from "./browser-logging.mjs";
import {
  extractMessagesFromPage,
  waitForConversationMessages,
} from "./chatgpt-messages.mjs";

const OAUTH_HOSTS = [
  "accounts.google.com",
  "auth.openai.com",
  "appleid.apple.com",
  "login.microsoftonline.com",
];

export function isOAuthUrl(url) {
  try {
    const host = new URL(url).hostname;
    return OAUTH_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export function isChatGptUrl(url) {
  try {
    return new URL(url).hostname === "chatgpt.com";
  } catch {
    return false;
  }
}

export async function hasChatGptSession(context) {
  const cookies = await context.cookies("https://chatgpt.com");
  return cookies.some(
    (c) =>
      c.name === "__Secure-next-auth.session-token" ||
      c.name.includes("session-token") ||
      c.name === "_account",
  );
}

export async function isLoggedIn(page) {
  const context = page.context();
  if (await hasChatGptSession(context)) {
    return true;
  }

  if (!isChatGptUrl(page.url())) {
    return false;
  }

  const selectors = [
    '[data-testid="profile-button"]',
    'button[aria-label*="Profile"]',
    'nav a[href*="/settings"]',
    'a[href="/library"]',
    'button:has-text("New chat")',
  ];

  for (const sel of selectors) {
    if ((await page.locator(sel).count()) > 0) {
      return true;
    }
  }

  const loginButtons = await page.locator('button:has-text("Log in"), a:has-text("Log in")').count();
  return loginButtons === 0 && (await page.locator("textarea, #prompt-textarea").count()) > 0;
}

export async function clickLoginIfPresent(page) {
  if (!isChatGptUrl(page.url())) return false;
  const btn = page.locator(
    'button[data-testid="login-button"], button:has-text("Log in"), a:has-text("Log in")',
  ).first();
  if ((await btn.count()) === 0) return false;
  logAuth("Clicking Log in on chatgpt.com");
  await btn.click({ timeout: 8000 }).catch((e) => logAuth(`Log in click failed: ${e.message}`));
  await page.waitForTimeout(1500);
  return true;
}

export async function clickOAuthProviderIfPresent(page) {
  const url = page.url();
  if (!url.includes("auth.openai.com") && !isChatGptUrl(url)) {
    return false;
  }

  const providers = [
    'button:has-text("Continue with Google")',
    'button[data-provider="google"]',
    'a:has-text("Continue with Google")',
    'button:has-text("Continue with Microsoft")',
    'button:has-text("Continue with Apple")',
  ];

  for (const sel of providers) {
    const el = page.locator(sel).first();
    if ((await el.count()) === 0) continue;
    logAuth(`Clicking OAuth provider: ${sel}`);
    await el.click({ timeout: 8000 }).catch((e) => logAuth(`Provider click failed: ${e.message}`));
    await page.waitForTimeout(1500);
    return true;
  }
  return false;
}

async function detectGoogleSignInBlock(page) {
  const body = await page.locator("body").innerText().catch(() => "");
  if (
    body.includes("This browser or app may not be secure") ||
    body.includes("Couldn't sign you in") ||
    body.includes("browser or app may not be secure")
  ) {
    logAuth(
      "Google rejected automated browser sign-in. Use system Chromium (PATCHRIGHT_EXECUTABLE_PATH=/usr/bin/chromium-browser) or sign in via email magic link on auth.openai.com.",
    );
    return true;
  }
  return false;
}

export async function ensureCloudflareClearance(page, { timeoutMs = 120_000 } = {}) {
  if (!(await isCloudflareManagedChallenge({ page }))) {
    return;
  }
  logAuth("Cloudflare challenge on chatgpt.com — waiting for clearance");
  await bypassCloudflare(page, { timeoutMs, log: logAuth });
}

/**
 * Wait for user to finish OAuth without interrupting navigation.
 * Does NOT re-goto conversation URLs during login.
 */
export async function waitForChatGptLogin(page, { timeoutMs = 600_000 } = {}) {
  const deadline = Date.now() + timeoutMs;

  logAuth("Opening ChatGPT login (Turnstile solver OFF during OAuth)");
  await gotoWithCloudflareBypass(page, "https://chatgpt.com/auth/login", {
    timeoutMs: 90_000,
    log: logAuth,
  });

  if (await isLoggedIn(page)) {
    logAuth("Already logged in");
    return;
  }

  await clickLoginIfPresent(page);

  logAuth("Complete login in the browser window (Google/Apple/email). Script will not navigate away during OAuth.");

  let lastUrl = "";
  while (Date.now() < deadline) {
    const url = page.url();

    if (url !== lastUrl) {
      logAuth(`URL → ${url}`);
      lastUrl = url;
    }

    if (await isLoggedIn(page)) {
      logAuth("Login detected — session active");
      return;
    }

    if (isOAuthUrl(url)) {
      if (url.includes("accounts.google.com")) {
        await detectGoogleSignInBlock(page);
      }
      await page.waitForTimeout(2000);
      continue;
    }

    if (url.includes("auth.openai.com")) {
      await clickOAuthProviderIfPresent(page);
      await page.waitForTimeout(2000);
      continue;
    }

    if (isChatGptUrl(url)) {
      if (url.includes("/api/auth/error") || url.includes("auth/error")) {
        logAuth("Auth error page — retrying /auth/login");
        await page.goto("https://chatgpt.com/auth/login", {
          waitUntil: "domcontentloaded",
          timeout: 60_000,
        });
        await clickLoginIfPresent(page);
      } else if (await isCloudflareManagedChallenge({ page })) {
        await ensureCloudflareClearance(page);
      } else {
        const loginVisible = await page.locator('button:has-text("Log in"), a:has-text("Log in")').count();
        if (loginVisible > 0) {
          await clickLoginIfPresent(page);
        }
      }
      await page.waitForTimeout(2500);
      continue;
    }

    await page.waitForTimeout(2000);
  }

  throw new Error(`Timed out waiting for ChatGPT login (${timeoutMs / 1000}s). See scripts/chatgpt-browser.log`);
}

export async function verifyConversationAccess(page, testId) {
  const url = `https://chatgpt.com/c/${testId}`;
  logAuth(`Verifying access: ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });
  if (await isCloudflareManagedChallenge({ page })) {
    await ensureCloudflareClearance(page);
  }
  const count = await waitForConversationMessages(page);
  logAuth(`Test conversation OK (${count} messages)`);
}
