/**
 * Shared Patchright persistent-context launch options.
 * Default browser: system Chromium (better Google OAuth than Chrome-for-Testing).
 */

const STEALTH_ARGS = [
  "--disable-blink-features=AutomationControlled",
  "--no-first-run",
  "--no-default-browser-check",
];

export function resolveBrowserLaunch() {
  const channel = process.env.PATCHRIGHT_CHANNEL;
  const explicitPath =
    process.env.PATCHRIGHT_EXECUTABLE_PATH || process.env.CHATGPT_BROWSER_PATH;

  if (explicitPath) {
    return { executablePath: explicitPath, channel: undefined };
  }
  if (channel) {
    return { executablePath: undefined, channel };
  }
  return { executablePath: "/usr/bin/chromium-browser", channel: undefined };
}

export function buildLaunchOptions({ turnstile = false } = {}) {
  const { executablePath, channel } = resolveBrowserLaunch();

  const base = {
    headless: false,
    viewport: null,
    ignoreDefaultArgs: ["--enable-automation"],
    args: STEALTH_ARGS,
  };

  if (executablePath) {
    base.executablePath = executablePath;
  }
  if (channel) {
    base.channel = channel;
  }

  if (turnstile) {
    base.turnstile = {
      intervalMs: 500,
      foreground: true,
      clickCooldownMs: 3000,
      logger: (m) => console.log(`[turnstile] ${m}`),
    };
  }

  return base;
}

export function describeBrowserLaunch() {
  const { executablePath, channel } = resolveBrowserLaunch();
  if (executablePath) return `executablePath=${executablePath}`;
  return `channel=${channel || "chromium"}`;
}
