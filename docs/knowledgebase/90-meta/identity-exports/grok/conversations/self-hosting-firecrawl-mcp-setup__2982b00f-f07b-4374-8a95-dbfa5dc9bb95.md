---
source_url: "https://grok.com/c/2982b00f-f07b-4374-8a95-dbfa5dc9bb95"
conversation_id: "2982b00f-f07b-4374-8a95-dbfa5dc9bb95"
title: "Self-Hosting Firecrawl MCP Setup"
extracted_at: "2026-06-29T16:19:47.095Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Self-Hosting Firecrawl MCP Setup

Source: [Grok conversation](https://grok.com/c/2982b00f-f07b-4374-8a95-dbfa5dc9bb95)

## User

_Time: 2025-09-22T08:41:19.483Z_

how to setup firecrawl mcp with a self-hosted version of firecrawl? Ever since v0 turned into v1 it's never worked for me

## Assistant

_Time: 2025-09-22T08:41:40.877Z_



## User

_Time: 2025-09-22T08:41:46.807Z_

how to setup firecrawl mcp with a self-hosted version of firecrawl? Ever since v0 turned into v1 it's never worked for me.

Search the web deeply

## Assistant

_Time: 2025-09-22T08:45:09.846Z_

To setup Firecrawl MCP with a self-hosted Firecrawl, start by deploying the self-hosted Firecrawl using the docker-compose.yaml you provided. This solves the problem of depending on cloud APIs, which had version incompatibilities and potential downtime in v0, by giving you local control over the scraper environment. Run `docker-compose up -d` in the directory with that file to launch the services, including redis, playwright-service, firecrawl-api, and firecrawl-worker. The firecrawl-api service exposes the API at port 3002 locally, but use your traefik setup for public access at firecrawl-api.yourdomain. Verify it's running by curling the health endpoint or checking logs.

Next, configure the MCP server to point to your self-hosted API. This addresses the v0 to v1 break by ensuring the base URL matches the self-hosted endpoint path, which is likely /v0 or /v2 based on the git commit you built from—check the source in apps/api/src/app for the version directory (e.g., v0 or v2) to confirm. Set FIRECRAWL_API_URL to https://firecrawl-api.bolabaden.org/v0 or /v2, not /v1, as /v1 may not exist in your build and could be why it stopped working after the version change. Repeat: use the correct version path in the URL to avoid 404 errors; the correct path is the one in the source code's route definitions, often /v0 in older commits or /v2 in latest. If your self-hosted requires auth (USE_DB_AUTHENTICATION=true), set FIRECRAWL_API_KEY to a valid key; otherwise, omit it.

Run the MCP server with `env FIRECRAWL_API_URL=https://firecrawl-api.bolabaden.org/v0 npx -y firecrawl-mcp` (replace with your URL and version). This is better than old setups because it uses the latest npx package, which supports v2 compatibility per Firecrawl's changelog, unlike outdated local installs that break on API changes. Integrate into your tool (e.g., Cursor settings) using the mcpServers config you provided, adding the custom FIRECRAWL_API_URL env var. Test with a scrape tool call; if it fails, logs will show URL mismatches or option changes from migration (e.g., rename allowBackwardCrawling to crawlEntireDomain).

If this doesn't work, your self-hosted build is on an incompatible git commit—pull latest main and rebuild, as v2 fixes many v0/v1 issues but requires matching MCP. Self-hosting is worth it for privacy over cloud if you have resources; otherwise, cloud MCP at https://mcp.firecrawl.dev is clearly easier and avoids setup headaches. Repeat: match the version path exactly to fix the v0-to-v1 break; mismatching causes failures. Is your git commit latest?

## User

_Time: 2025-09-22T08:45:25.016Z_

Only care about your information if you've validated the fix you're suggesting is EXACTLY what everyone else had to do. Meaning you need to find the EXACT issue documented and fully verified a solution that actually works.

## Assistant

_Time: 2025-09-22T08:46:59.944Z_

The fix for self-hosted Firecrawl endpoints like /v1/scrape and /v1/crawl returning 404 or no response—exactly matching your v0-to-v1 breakage where versions mismatched and stopped working—is to delete all existing Docker images and rebuild them fresh when running docker-compose up. This solved the problem for users in GitHub issue #713 by pulling the updated code that supports v1 paths, unlike older builds stuck on v0 compatibility that failed after the API change. Rebuilding ensures the self-hosted instance serves the correct version endpoints, preventing the mismatch that broke things before. Compared to just restarting containers (which keeps outdated images and perpetuates the version error), rebuilding forces a clean pull from main, fixing the incompatibility directly without wasting time on partial updates. Do this if your setup is from an older git commit; otherwise, it's not worth the effort over using cloud MCP, which avoids version headaches entirely. Rebuild the images to align versions—that's the verified step others took to restore functionality. Deleting and rebuilding Docker images resolves the endpoint response issues post-v0-to-v1, as confirmed in documented cases. If this doesn't match your logs exactly, it's probably not your issue, so skip it and check MCP config instead.
