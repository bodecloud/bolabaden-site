/**
 * ChatGPT internal backend-api (browser session + Bearer from /api/auth/session).
 */

const API_ORIGIN = "https://chatgpt.com";

let cachedToken = null;
let cachedTokenAt = 0;
const TOKEN_TTL_MS = 5 * 60 * 1000;

export async function getAccessToken(page, { forceRefresh = false } = {}) {
  if (!forceRefresh && cachedToken && Date.now() - cachedTokenAt < TOKEN_TTL_MS) {
    return cachedToken;
  }

  if (!page.url().includes("chatgpt.com")) {
    await page.goto(`${API_ORIGIN}/`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  }

  const session = await page.evaluate(async () => {
    const res = await fetch("/api/auth/session", { credentials: "include" });
    if (!res.ok) return { error: `${res.status} ${res.statusText}` };
    return res.json();
  });

  const token = session?.accessToken || null;
  if (!token) {
    throw new Error(
      `No ChatGPT access token (session: ${JSON.stringify(session)?.slice(0, 200) || "null"})`,
    );
  }

  cachedToken = token;
  cachedTokenAt = Date.now();
  return token;
}

export async function chatgptFetch(page, path, { method = "GET", body } = {}) {
  const token = await getAccessToken(page);

  return page.evaluate(
    async ({ path, method, body, token, API_ORIGIN }) => {
      const res = await fetch(`${API_ORIGIN}/backend-api${path}`, {
        method,
        credentials: "include",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const text = await res.text();
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}: ${text.slice(0, 400)}`);
      }
      if (!text) return null;
      return JSON.parse(text);
    },
    { path, method, body, token, API_ORIGIN },
  );
}

export async function listConversationsPage(page, { offset = 0, limit = 100, order = "updated" } = {}) {
  const path = `/conversations?offset=${offset}&limit=${limit}&order=${order}`;
  return chatgptFetch(page, path);
}

/** Scroll sidebar and collect /c/{uuid} links when API listing fails. */
export async function listConversationsFromSidebar(page) {
  await page.goto(`${API_ORIGIN}/`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForTimeout(2000);

  const sidebar =
    page.locator('nav, [data-testid="history-list"], aside').first();
  if ((await sidebar.count()) === 0) {
    return [];
  }

  const seen = new Set();
  const items = [];

  for (let round = 0; round < 40; round++) {
    const batch = await page.evaluate(() => {
      const out = [];
      for (const a of document.querySelectorAll('a[href*="/c/"]')) {
        const m = a.getAttribute("href")?.match(/\/c\/([0-9a-f-]{36})/i);
        if (!m) continue;
        out.push({ id: m[1], title: (a.textContent || "").trim() });
      }
      return out;
    });

    for (const row of batch) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      items.push({ id: row.id, title: row.title || row.id });
    }

    await sidebar.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    }).catch(() => page.keyboard.press("PageDown"));
    await page.waitForTimeout(600);
  }

  return items;
}

export async function listAllConversations(page, { onPage } = {}) {
  const seen = new Set();
  const all = [];
  let offset = 0;
  const limit = 100;

  try {
    while (true) {
      const pageData = await listConversationsPage(page, { offset, limit });
      const items = pageData?.items || [];
      if (items.length === 0) {
        if (offset === 0 && pageData && !pageData.items) {
          console.warn("Unexpected conversations API shape:", JSON.stringify(pageData).slice(0, 300));
        }
        break;
      }

      let newCount = 0;
      for (const item of items) {
        if (!item?.id || seen.has(item.id)) continue;
        seen.add(item.id);
        all.push(item);
        newCount++;
      }

      if (onPage) onPage(all.length);

      const total = pageData?.total ?? all.length;
      offset += items.length;
      if (newCount === 0 || items.length < limit || offset >= total) break;
    }
  } catch (err) {
    console.warn(`backend-api list failed: ${err.message}`);
  }

  if (all.length === 0) {
    console.warn("Falling back to sidebar scrape for conversation IDs …");
    const sidebarItems = await listConversationsFromSidebar(page);
    for (const item of sidebarItems) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        all.push(item);
      }
    }
    if (onPage) onPage(all.length);
  }

  return all;
}

export async function getConversation(page, id) {
  return chatgptFetch(page, `/conversation/${id}`);
}

function partToText(part) {
  if (typeof part === "string") return part;
  if (!part || typeof part !== "object") return "";
  if (typeof part.text === "string") return part.text;
  if (part.content_type === "image_asset_pointer") {
    return `[image: ${part.asset_pointer || "attached"}]`;
  }
  if (part.content_type === "tether_quote") {
    return part.text || `[quote: ${part.tether_id || "attached"}]`;
  }
  if (part.content_type === "code") {
    return part.text || "```\n(code)\n```";
  }
  try {
    return JSON.stringify(part);
  } catch {
    return String(part);
  }
}

function messageText(msg) {
  const parts = msg?.content?.parts;
  if (Array.isArray(parts) && parts.length > 0) {
    return parts.map(partToText).filter(Boolean).join("\n").trim();
  }
  if (typeof msg?.content?.text === "string") return msg.content.text.trim();
  return "";
}

/** All messages in the conversation mapping (not just current_node chain). */
export function messagesFromConversationJson(conv) {
  const mapping = conv?.mapping || {};
  const messages = [];

  for (const node of Object.values(mapping)) {
    const msg = node?.message;
    if (!msg) continue;

    const role = msg.author?.role || "unknown";
    const text = messageText(msg);
    const createTime = msg.create_time ?? node.create_time ?? null;

    messages.push({
      id: msg.id,
      role,
      text,
      create_time: createTime,
    });
  }

  messages.sort((a, b) => {
    const ta = a.create_time || 0;
    const tb = b.create_time || 0;
    if (ta !== tb) return ta - tb;
    return String(a.id || "").localeCompare(String(b.id || ""));
  });

  const seen = new Set();
  return messages.filter((m) => {
    if (!m.id) return true;
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

export function conversationTextHaystack(conv) {
  const title = conv?.title || "";
  const messages = messagesFromConversationJson(conv);
  const body = messages.map((m) => m.text).join("\n");
  return [title, body].filter(Boolean).join("\n");
}
