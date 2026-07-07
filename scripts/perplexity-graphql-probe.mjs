#!/usr/bin/env node
/** Probe GraphQL library + History navigation */
import { chromium } from "patchright-difz";
import path from "node:path";
import { buildLaunchOptions } from "./lib/patchright-launch.mjs";
import { ensurePerplexitySession } from "./lib/perplexity-auth.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const PROFILE = path.join(ROOT, "scripts/.perplexity-patchright-profile");

const LIBRARY_QUERY_HASH = "bb88a4a60e88967f992b0c751b4ec9d28f7a7f00e06e16a8bda8a11448d734ec";

async function gql(page, variables) {
  return page.evaluate(
    async ({ variables, hash }) => {
      const r = await fetch("https://www.perplexity.ai/rest/perplexity_ask/graphql", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          "x-app-apiversion": "2.18",
          "x-app-apiclient": "default",
        },
        body: JSON.stringify({
          operationName: "LibraryThreadsRelayQuery",
          variables,
          extensions: { persistedQuery: { version: 1, sha256Hash: hash } },
        }),
      });
      const t = await r.text();
      return { status: r.status, body: t };
    },
    { variables, hash: LIBRARY_QUERY_HASH },
  );
}

async function main() {
  const context = await chromium.launchPersistentContext(PROFILE, buildLaunchOptions({ turnstile: false }));
  const page = context.pages()[0] || (await context.newPage());
  try {
    await ensurePerplexitySession(page);

    for (const term of [null, "", "docker", "kubernetes"]) {
      const res = await gql(page, {
        includeSearchPreview: false,
        searchTerm: term,
        sortOrder: "NEWEST",
        statuses: null,
        threadTypes: null,
        sources: null,
        includeTemporary: null,
      });
      console.log(`\n=== GraphQL searchTerm=${JSON.stringify(term)} status=${res.status} ===`);
      console.log(res.body.slice(0, 1200));
    }

    // Try list_ask_threads with extra fields from pinned call
    const listBody = await page.evaluate(async () => {
      const bodies = [
        { limit: 20, ascending: false, offset: 0, search_term: "docker", exclude_asi: false, include_assets: true },
        {
          limit: 20,
          ascending: false,
          offset: 0,
          search_term: "docker",
          exclude_asi: false,
          include_assets: true,
          send_last_entry: true,
          with_temporary_threads: true,
        },
        {
          limit: 20,
          ascending: false,
          offset: 0,
          search_term: "",
          exclude_asi: false,
          include_assets: true,
          thread_type_filter: null,
          with_temporary_threads: true,
        },
      ];
      const out = [];
      for (const body of bodies) {
        const r = await fetch(
          "https://www.perplexity.ai/rest/thread/list_ask_threads?version=2.18&source=default",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "content-type": "application/json",
              accept: "application/json",
              "x-app-apiversion": "2.18",
              "x-app-apiclient": "default",
            },
            body: JSON.stringify(body),
          },
        );
        out.push({ body, status: r.status, text: (await r.text()).slice(0, 400) });
      }
      return out;
    });
    console.log("\n=== list_ask_threads variants ===");
    console.log(JSON.stringify(listBody, null, 2));

    // Click History in sidebar
    console.log("\n=== Click History link ===");
    const hist = page.getByRole("link", { name: /^History$/i }).or(page.getByText(/^History$/).first());
    if ((await hist.count()) > 0) {
      await hist.first().click();
      await page.waitForTimeout(4000);
      console.log("URL:", page.url());
      console.log((await page.locator("body").innerText()).slice(0, 1200));
    }

    // Try /account/activity or common paths
    for (const p of ["/library", "/account/library", "/history", "/account/history"]) {
      await page.goto(`https://www.perplexity.ai${p}`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(2000);
      const text = await page.locator("body").innerText();
      const hasSessions = /session|thread|No sessions|docker/i.test(text);
      console.log(`\n=== ${p} === hasContent=${hasSessions}`);
      console.log(text.slice(0, 400));
    }
  } finally {
    await context.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
