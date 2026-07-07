/**
 * Grok web app REST API (browser session cookies).
 * Endpoints reverse-engineered from grok.com client / community export scripts.
 */

export const GROK_API_BASE = "https://grok.com/rest/app-chat";

export async function grokFetch(page, path, { method = "GET", body } = {}) {
  return page.evaluate(
    async ({ path, method, body, GROK_API_BASE }) => {
      const url = path.startsWith("http") ? path : `${GROK_API_BASE}${path}`;
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          accept: "application/json",
          ...(body ? { "content-type": "application/json" } : {}),
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
    { path, method, body, GROK_API_BASE },
  );
}

export async function listConversationsPage(page, { pageSize = 60, pageToken = null } = {}) {
  let path = `/conversations?pageSize=${pageSize}`;
  if (pageToken) path += `&pageToken=${encodeURIComponent(pageToken)}`;
  return grokFetch(page, path);
}

export async function listAllConversations(page, { onPage } = {}) {
  const seen = new Set();
  const all = [];
  let pageToken = null;
  const pageSize = 60;
  let guard = 0;

  while (guard < 500) {
    guard++;
    const data = await listConversationsPage(page, { pageSize, pageToken });
    const items = data?.conversations || [];
    if (items.length === 0) break;

    let newCount = 0;
    for (const item of items) {
      const id = item.conversationId;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      all.push(item);
      newCount++;
    }

    if (onPage) onPage(all.length);

    const next =
      data?.nextPageToken ||
      data?.pageToken ||
      data?.nextCursor ||
      data?.cursor ||
      null;

    if (!next || newCount === 0) break;
    if (next === pageToken) break;
    pageToken = next;
  }

  return all;
}

export async function getResponseNodeIds(page, conversationId) {
  const data = await grokFetch(
    page,
    `/conversations/${conversationId}/response-node?includeThreads=true`,
  );
  const nodes = data?.responseNodes || [];
  return [...new Set(nodes.map((n) => n.responseId).filter(Boolean))];
}

export async function loadResponses(page, conversationId, responseIds) {
  const batchSize = 150;
  const all = [];
  for (let i = 0; i < responseIds.length; i += batchSize) {
    const chunk = responseIds.slice(i, i + batchSize);
    const data = await grokFetch(page, `/conversations/${conversationId}/load-responses`, {
      method: "POST",
      body: { responseIds: chunk },
    });
    if (Array.isArray(data?.responses)) all.push(...data.responses);
  }
  return all;
}

export async function getConversationDetail(page, conversationId) {
  const responseIds = await getResponseNodeIds(page, conversationId);
  const responses = await loadResponses(page, conversationId, responseIds);
  return { responseIds, responses };
}

export function conversationTextHaystack(convo, responses) {
  const title = convo?.title || "";
  const body = (responses || [])
    .map((r) => r.message || "")
    .filter(Boolean)
    .join("\n");
  return [title, body].filter(Boolean).join("\n");
}
