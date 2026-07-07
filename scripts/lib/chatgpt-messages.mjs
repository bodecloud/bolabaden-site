import { logAuth } from "./browser-logging.mjs";

const MESSAGE_SELECTORS = [
  "[data-message-author-role]",
  '[data-testid="conversation-turn"]',
  "article[data-testid]",
  "div[data-message-id]",
];

export function messageLocator(page) {
  return page.locator(MESSAGE_SELECTORS.join(", "));
}

export async function waitForConversationMessages(page, { timeoutMs = 90_000 } = {}) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("End").catch(() => {});
      await page.waitForTimeout(500);
    }
    await page.keyboard.press("Home").catch(() => {});
    await page.waitForTimeout(800);

    const count = await messageLocator(page).count();
    if (count > 0) {
      logAuth(`Messages visible: ${count}`);
      return count;
    }

    const body = await page.locator("body").innerText().catch(() => "");
    if (
      body.includes("Unable to load conversation") ||
      body.includes("Conversation not found") ||
      body.includes("doesn't exist")
    ) {
      throw new Error("Conversation not found or inaccessible");
    }
    if (body.includes("Log in") && body.includes("Sign up")) {
      throw new Error("Not logged in — login page shown on conversation URL");
    }

    await page.waitForTimeout(2000);
  }

  throw new Error(`Timed out waiting for conversation messages (${timeoutMs / 1000}s)`);
}

export async function readConversationMeta(page) {
  return page.evaluate(() => {
    const heading =
      document.querySelector("nav [class*='title'], header h1, [data-testid*='conversation']")?.textContent?.trim() ||
      document.title.replace(/\s*-\s*ChatGPT\s*$/i, "").trim();

    const nodes = document.querySelectorAll(
      "[data-message-author-role], [data-testid='conversation-turn'], div[data-message-id]",
    );
    const previews = [];
    for (const node of nodes) {
      const textEl =
        node.querySelector(".markdown, .prose, [class*='markdown']") || node;
      const text = (textEl.innerText || textEl.textContent || "").trim();
      if (text) previews.push(text.slice(0, 500));
      if (previews.length >= 3) break;
    }

    return {
      heading,
      preview: previews.join("\n"),
      visibleMessageCount: nodes.length,
    };
  });
}

export async function extractMessagesFromPage(page) {
  return page.evaluate(() => {
    const nodes = document.querySelectorAll(
      "[data-message-author-role], [data-testid='conversation-turn'], div[data-message-id]",
    );
    const messages = [];
    for (const node of nodes) {
      const role =
        node.getAttribute("data-message-author-role") ||
        (node.querySelector("[data-message-author-role]")?.getAttribute("data-message-author-role")) ||
        "unknown";
      const textEl =
        node.querySelector(".markdown, .prose, [class*='markdown']") || node;
      const text = (textEl.innerText || textEl.textContent || "").trim();
      if (text) messages.push({ role, text });
    }

    const heading =
      document.querySelector("nav [class*='title'], header h1, [data-testid*='conversation']")?.textContent?.trim() ||
      document.title.replace(/\s*-\s*ChatGPT\s*$/i, "").trim();

    return { heading, messages, messageCount: messages.length };
  });
}
