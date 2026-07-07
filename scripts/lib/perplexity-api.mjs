/**
 * Perplexity internal REST API (browser session cookies).
 * Protocol 2.18 — reverse-engineered from web client / Deplexity.
 */

export const API_VERSION = "2.18";
export const BASE_URL = "https://www.perplexity.ai/rest";

const THREAD_DETAIL_PARAMS =
  "with_schematized_response=true&limit=50&offset=0&from_first=true" +
  "&supported_block_use_cases=answer_modes&supported_block_use_cases=preserve_latex";

export async function pplxFetch(page, url, { method = "GET", body, reason = "export" } = {}) {
  return page.evaluate(
    async ({ url, method, body, API_VERSION, reason }) => {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          "x-app-apiversion": API_VERSION,
          "x-app-apiclient": "default",
          "x-perplexity-request-endpoint": url,
          "x-perplexity-request-reason": reason,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const text = await res.text();
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}: ${text.slice(0, 300)}`);
      }
      if (!text) return null;
      return JSON.parse(text);
    },
    { url, method, body, API_VERSION, reason },
  );
}

export async function getSession(page) {
  return pplxFetch(
    page,
    `https://www.perplexity.ai/api/auth/session?version=${API_VERSION}&source=default`,
    { reason: "session" },
  );
}

export async function listAskThreadsPage(page, { offset = 0, limit = 20, searchTerm = "" } = {}) {
  const url = `${BASE_URL}/thread/list_ask_threads?version=${API_VERSION}&source=default`;
  const body = {
    limit,
    ascending: false,
    offset,
    search_term: searchTerm,
    exclude_asi: false,
    include_assets: true,
  };
  const raw = await pplxFetch(page, url, { method: "POST", body, reason: "threads-body" });
  return Array.isArray(raw) ? raw : [];
}

export async function listAllAskThreads(page, { searchTerm = "", onPage } = {}) {
  const seen = new Set();
  const all = [];
  let offset = 0;
  const limit = 20;

  while (true) {
    const pageItems = await listAskThreadsPage(page, { offset, limit, searchTerm });
    if (pageItems.length === 0) break;

    let newCount = 0;
    for (const item of pageItems) {
      const id = item.uuid || item.context_uuid;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      all.push(item);
      newCount++;
    }

    if (onPage) onPage(all.length);

    if (newCount === 0 || pageItems.length < limit) break;
    if (pageItems[pageItems.length - 1]?.has_next_page === false) break;
    offset += pageItems.length;
  }

  return all;
}

function threadDetailUrl(uuid, offset = 0) {
  return (
    `${BASE_URL}/thread/${uuid}?${THREAD_DETAIL_PARAMS}` +
    `&version=${API_VERSION}&source=default&offset=${offset}`
  );
}

export async function getThreadDetail(page, uuid) {
  let offset = 0;
  let merged = null;

  while (true) {
    const raw = await pplxFetch(page, threadDetailUrl(uuid, offset), { reason: "thread-detail" });
    if (!raw) break;

    if (!merged) {
      merged = raw;
    } else {
      merged.entries = [...(merged.entries || []), ...(raw.entries || [])];
      merged.has_next_page = raw.has_next_page;
    }

    if (!raw.has_next_page || !(raw.entries?.length > 0)) break;
    offset += raw.entries.length;
  }

  return merged;
}
