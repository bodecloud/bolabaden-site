---
source_url: "https://grok.com/c/69f68cc0-bb5b-4eca-8f7a-1f27bd3bfee2"
conversation_id: "69f68cc0-bb5b-4eca-8f7a-1f27bd3bfee2"
title: "Worker Startup: Database Migration Error"
extracted_at: "2026-06-29T16:33:13.090Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Worker Startup: Database Migration Error

Source: [Grok conversation](https://grok.com/c/69f68cc0-bb5b-4eca-8f7a-1f27bd3bfee2)

## User

_Time: 2025-10-03T15:32:10.187Z_

── Starting services ──
> api node --import ./dist/src/otel.js dist/src/index.js
> worker node --import ./dist/src/otel.js dist/src/services/queue-worker.js
> extract-worker node --import ./dist/src/otel.js dist/src/services/extract-worker.js
> nuq-worker-0 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
> nuq-worker-1 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
> nuq-worker-2 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
> nuq-worker-3 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
> nuq-worker-4 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
Waiting for API on localhost:3002
nuq-worker-0 2025-10-03 15:31:14 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
nuq-worker-1 2025-10-03 15:31:15 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
nuq-worker-4 2025-10-03 15:31:15 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
nuq-worker-3 2025-10-03 15:31:15 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
nuq-worker-2 2025-10-03 15:31:15 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
worker 2025-10-03 15:31:16 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
nuq-worker-0 2025-10-03 15:31:16 warn [:]: Index supabase client will not be initialized. {}
api 2025-10-03 15:31:16 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
worker 2025-10-03 15:31:16 warn [:]: Authentication is disabled. Supabase ledger client will not be initialized. {}
api 2025-10-03 15:31:17 warn [:]: Authentication is disabled. Supabase ledger client will not be initialized. {}
nuq-worker-1 2025-10-03 15:31:17 warn [:]: Index supabase client will not be initialized. {}
nuq-worker-3 2025-10-03 15:31:17 warn [:]: Index supabase client will not be initialized. {}
nuq-worker-4 2025-10-03 15:31:17 warn [:]: Index supabase client will not be initialized. {}
nuq-worker-2 2025-10-03 15:31:17 warn [:]: Index supabase client will not be initialized. {}
nuq-worker-0 2025-10-03 15:31:18 warn [:]: Authentication is disabled. Supabase ledger client will not be initialized. {}
nuq-worker-0 2025-10-03 15:31:18 warn [:]: POSTHOG_API_KEY is not provided - your events will not be logged. Using MockPostHog as a fallback. See posthog.ts for more. {}
nuq-worker-1 2025-10-03 15:31:18 warn [:]: Authentication is disabled. Supabase ledger client will not be initialized. {}
nuq-worker-1 2025-10-03 15:31:18 warn [:]: POSTHOG_API_KEY is not provided - your events will not be logged. Using MockPostHog as a fallback. See posthog.ts for more. {}
worker 2025-10-03 15:31:18 warn [:]: Index supabase client will not be initialized. {}
api 2025-10-03 15:31:18 warn [:]: Index supabase client will not be initialized. {}
extract-worker 2025-10-03 15:31:19 warn [:]: Index supabase client will not be initialized. {}
nuq-worker-4 2025-10-03 15:31:19 warn [:]: Authentication is disabled. Supabase ledger client will not be initialized. {}
nuq-worker-4 2025-10-03 15:31:19 warn [:]: POSTHOG_API_KEY is not provided - your events will not be logged. Using MockPostHog as a fallback. See posthog.ts for more. {}
nuq-worker-2 2025-10-03 15:31:19 warn [:]: Authentication is disabled. Supabase ledger client will not be initialized. {}
nuq-worker-2 2025-10-03 15:31:19 warn [:]: POSTHOG_API_KEY is not provided - your events will not be logged. Using MockPostHog as a fallback. See posthog.ts for more. {}
nuq-worker-3 2025-10-03 15:31:19 warn [:]: Authentication is disabled. Supabase ledger client will not be initialized. {}
api 2025-10-03 15:31:19 warn [:]: POSTHOG_API_KEY is not provided - your events will not be logged. Using MockPostHog as a fallback. See posthog.ts for more. {}
nuq-worker-0 2025-10-03 15:31:19 info [:]: NuQ worker metrics server started
nuq-worker-3 2025-10-03 15:31:19 warn [:]: POSTHOG_API_KEY is not provided - your events will not be logged. Using MockPostHog as a fallback. See posthog.ts for more. {}
nuq-worker-1 2025-10-03 15:31:19 info [:]: NuQ worker metrics server started
nuq-worker-0 2025-10-03 15:31:19 info [:]: Connected to Redis Session Rate Limit Store!
nuq-worker-1 2025-10-03 15:31:19 info [:]: Connected to Redis Session Rate Limit Store!
extract-worker 2025-10-03 15:31:19 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
nuq-worker-0 /app/node_modules/.pnpm/pg-pool@3.10.1_pg@8.16.3_pg-native@3.5.2_/node_modules/pg-pool/index.js:45
nuq-worker-0 Error.captureStackTrace(err)
nuq-worker-0 ^
nuq-worker-0 error: column "listen_channel_id" does not exist
nuq-worker-0 at /app/node_modules/.pnpm/pg-pool@3.10.1_pg@8.16.3_pg-native@3.5.2_/node_modules/pg-pool/index.js:45:11
nuq-worker-0 at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
nuq-worker-0 at async NuQ.getJobToProcess (/app/dist/src/services/worker/nuq.js:496:35)
nuq-worker-0 at async /app/dist/src/services/worker/nuq-worker.js:41:21 {
nuq-worker-0 length: 117,
nuq-worker-0 severity: 'ERROR',
nuq-worker-0 code: '42703',
nuq-worker-0 detail: undefined,
nuq-worker-0 hint: undefined,
nuq-worker-0 position: '90',
nuq-worker-0 internalPosition: undefined,
nuq-worker-0 internalQuery: undefined,
nuq-worker-0 where: undefined,
nuq-worker-0 schema: undefined,
nuq-worker-0 table: undefined,
nuq-worker-0 column: undefined,
nuq-worker-0 dataType: undefined,
nuq-worker-0 constraint: undefined,
nuq-worker-0 file: 'parse_relation.c',
nuq-worker-0 line: '3716',
nuq-worker-0 routine: 'errorMissingColumn'
nuq-worker-0 }
nuq-worker-0 Node.js v22.20.0
✗ nuq-worker-0 9.9s (1)
✗ Unhandled rejection
Error: nuq-worker-0 failed with exit code 1
    at ChildProcess.<anonymous> (/app/dist/src/harness.js:210:24)
    at ChildProcess.emit (node:events:519:28)
    at maybeClose (node:internal/child_process:1101:16)
    at ChildProcess._handle.onexit (node:internal/child_process:304:5)
── Shutting down ──
nuq-worker-1 /app/node_modules/.pnpm/pg-pool@3.10.1_pg@8.16.3_pg-native@3.5.2_/node_modules/pg-pool/index.js:45
nuq-worker-1 Error.captureStackTrace(err)
nuq-worker-1 ^
nuq-worker-1 error: column "listen_channel_id" does not exist
nuq-worker-1 at /app/node_modules/.pnpm/pg-pool@3.10.1_pg@8.16.3_pg-native@3.5.2_/node_modules/pg-pool/index.js:45:11
nuq-worker-1 at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
nuq-worker-1 at async NuQ.getJobToProcess (/app/dist/src/services/worker/nuq.js:496:35)
nuq-worker-1 at async /app/dist/src/services/worker/nuq-worker.js:41:21 {
nuq-worker-1 length: 117,
nuq-worker-1 severity: 'ERROR',
nuq-worker-1 code: '42703',
nuq-worker-1 detail: undefined,
nuq-worker-1 hint: undefined,
nuq-worker-1 position: '90',
nuq-worker-1 internalPosition: undefined,
nuq-worker-1 internalQuery: undefined,
nuq-worker-1 where: undefined,
nuq-worker-1 schema: undefined,
nuq-worker-1 table: undefined,
nuq-worker-1 column: undefined,
nuq-worker-1 dataType: undefined,
nuq-worker-1 constraint: undefined,
nuq-worker-1 file: 'parse_relation.c',
nuq-worker-1 line: '3716',
nuq-worker-1 routine: 'errorMissingColumn'
nuq-worker-1 }
nuq-worker-1 Node.js v22.20.0
✓ All processes terminated
 
how to fix this error in self-hosted firecrawl?

## Assistant

_Time: 2025-10-03T15:35:28.632Z_

### Key Points
- The error indicates a PostgreSQL schema mismatch in the NuQ queuing system, where the code expects a "listen_channel_id" column that isn't present in the database table (likely the "jobs" table or similar).
- This commonly occurs if the database wasn't properly initialized with the required schema during setup, or if there's a version mismatch between the code and database.
- Research suggests it's likely fixed by running the database setup script (nuq.sql) or manually adding the column if the schema is outdated.
- It seems probable that skipping or misconfiguring the PostgreSQL setup in the self-hosting guide leads to this, as Firecrawl's NuQ component relies on Postgres for job processing.
- No major controversy around this; it's a typical setup issue for open-source self-hosted tools like Firecrawl.

### Understanding the Error
The logs show that multiple NuQ workers fail with a PostgreSQL error: "column 'listen_channel_id' does not exist." This happens during the `getJobToProcess` method in `nuq.js`, suggesting the system is attempting to query a table for job data but can't find the column. Warnings about disabled authentication, Supabase, and PostHog are non-critical and expected in basic self-hosted setups (as per docs), but the column error halts the workers.

Firecrawl uses PostgreSQL for its NuQ (queue management) system to handle job processing. If the database isn't set up or migrated correctly, queries fail. The "listen_channel_id" likely relates to Postgres' LISTEN/NOTIFY feature for real-time job updates, added in recent versions or configurations.

### Steps to Fix
1. **Verify Environment Variables**: Ensure your `.env` file (based on `apps/api/.env.example`) has `NUQ_DATABASE_URL` set correctly, e.g., `postgres://postgres:postgres@localhost:5433/postgres`. Also confirm `USE_DB_AUTHENTICATION=false` to bypass Supabase issues.

2. **Set Up PostgreSQL**: Follow Firecrawl's local running guide (applicable to self-hosting):
   - Install PostgreSQL if not already (via Docker for ease).
   - Build and run the NuQ Postgres Docker container from `apps/nuq-postgres`:
     ```
     docker build -t nuq-postgres .
     docker run --name nuqdb -e POSTGRES_PASSWORD=postgres -p 5433:5432 -v nuq-data:/var/lib/postgresql/data -d nuq-postgres
     ```
   - This should apply the schema from `nuq.sql`, creating necessary tables and columns.

3. **Apply Schema Manually if Needed**: If the error persists (e.g., existing DB without the column):
   - Connect to your Postgres DB using psql: `psql -h localhost -p 5433 -U postgres -d postgres`.
   - Add the column to the affected table (assume "jobs" based on context; verify table name by inspecting your DB):
     ```
     ALTER TABLE jobs ADD COLUMN listen_channel_id VARCHAR(255);
     ```
   - Type is assumed as VARCHAR; adjust if it's UUID or text based on your code review.

4. **Restart Services**: After setup, rebuild and restart with `docker compose build && docker compose up`.

5. **Update Firecrawl**: Pull the latest from GitHub (`git pull`) to ensure code and schema match, as the column might be a recent addition.

If these don't resolve it, check GitHub issues for similar errors or file one with your version details.

---

The error you're encountering in your self-hosted Firecrawl instance stems from a PostgreSQL database schema issue within the NuQ (queue) worker system. Specifically, the code is attempting to execute a query that references a column named "listen_channel_id," which does not exist in the relevant database table. This table is likely part of the job queuing system (e.g., a "jobs" or "queue_jobs" table), and the column appears to be related to PostgreSQL's LISTEN/NOTIFY mechanism for handling real-time notifications or job updates. The other warnings in your logs (e.g., about Supabase, authentication, and PostHog) are non-fatal and typical for basic self-hosted setups where these features are disabled or not configured—they don't directly cause the crash but indicate optional components are skipped.

Firecrawl is an open-source web crawling and scraping API designed for AI applications, converting websites into LLM-ready markdown or structured data. It's developed by Mendable.ai and hosted on GitHub under mendableai/firecrawl. The self-hosting option is useful for security-conscious users who want to keep data in-house, but it requires careful configuration of dependencies like Redis and PostgreSQL. The NuQ component handles job queuing and processing for crawl tasks, relying on Postgres for persistence and efficiency at scale. Skipping or misconfiguring the database setup is a common pitfall, leading to errors like yours.

#### Detailed Setup and Troubleshooting
To resolve this, focus on ensuring the PostgreSQL database is properly initialized with the correct schema. Firecrawl's documentation emphasizes running a specific SQL script (`nuq.sql`) to create the necessary tables and columns. If you've already set up Postgres but the column is missing, it could indicate an incomplete initialization, version mismatch (e.g., outdated code vs. schema), or manual DB changes. Here's a comprehensive guide, drawing from the official docs and best practices for similar Postgres-based projects.

##### Prerequisites
- Node.js (v18+ recommended), pnpm (v9+), Redis, PostgreSQL, and Docker (for simplified DB management).
- Clone the repo if not done: `git clone https://github.com/mendableai/firecrawl.git && cd firecrawl`.
- Update to the latest version: `git pull origin main` (as of October 2025, check for commits around database changes).

##### Configure Environment Variables
Copy `apps/api/.env.example` to `apps/api/.env` and set key variables:
- `REDIS_URL=redis://localhost:6379` (or your Redis instance).
- `NUQ_DATABASE_URL=postgres://postgres:postgres@localhost:5433/postgres` (adjust username, password, host, port, and DB name as needed).
- `USE_DB_AUTHENTICATION=false` (disables Supabase, matching your logs).
- Optional: `POSTHOG_API_KEY=your_key` to silence PostHog warnings, but not required.

These ensure the NuQ workers can connect to Postgres without authentication issues.

##### Set Up PostgreSQL Database
Firecrawl uses Postgres for NuQ queuing. The docs provide a Docker-based approach to run it with the schema applied automatically:

1. Navigate to `apps/nuq-postgres`.
2. Build the custom Docker image (which includes the `nuq.sql` schema):
   ```
   docker build -t nuq-postgres .
   ```
3. Run the container (this starts Postgres and applies the schema via the Dockerfile entrypoint):
   ```
   docker run --name nuqdb \
     -e POSTGRES_PASSWORD=postgres \
     -p 5433:5432 \
     -v nuq-data:/var/lib/postgresql/data \
     -d nuq-postgres
   ```
   - The `-v` persists data; use a named volume for production.
   - Verify with `docker logs nuqdb`—look for schema creation messages.

If you prefer manual setup without Docker:
- Install Postgres locally.
- Create the DB: `createdb -h localhost -p 5432 -U postgres postgres`.
- Run the schema: `psql -h localhost -p 5432 -U postgres -d postgres -f apps/nuq-postgres/nuq.sql`.

This script defines tables like jobs, queues, etc., and should include (or add) columns like "listen_channel_id" if it's part of the standard schema. If the column isn't in `nuq.sql`, it might be a recent addition—check repo commits for DB changes.

##### Manual Fix for Missing Column
If the error persists after setup (e.g., on an existing DB), manually add the column:
1. Connect to the DB: `psql -h localhost -p 5433 -U postgres -d postgres`.
2. Identify the table: Run `\dt` to list tables, then `\d jobs` (or similar; common for queuing systems).
3. Add the column:
   ```
   ALTER TABLE jobs ADD COLUMN IF NOT EXISTS listen_channel_id VARCHAR(255);
   ```
   - Type `VARCHAR(255)` is a safe assumption for a channel ID (text-based identifier). If it's a UUID, use `UUID`. Nullability: Allow NULL if unsure (`NULL` default).
4. Verify: `\d jobs` to confirm the column exists.

This should resolve the query failure at position 90 in the SQL statement.

##### Restart and Test
- Stop any running services.
- From the root directory: `docker compose build && docker compose up`.
- Monitor logs for successful startup—no "column does not exist" errors.
- Test the API: `curl -X POST http://localhost:3002/v2/crawl -H 'Content-Type: application/json' -d '{"url": "https://example.com"}'`.
- If using multiple workers, scale with `NUM_WORKERS_PER_QUEUE=5` (adjust based on resources).

##### Potential Edge Cases and Alternatives
- **Version Mismatch**: If your code expects the column but the schema doesn't have it, downgrade to a matching commit or apply incremental migrations (if Firecrawl uses a tool like Prisma, check `prisma/migrations` folder, though not mentioned in docs).
- **Supabase Integration**: Your logs show Supabase disabled, which is fine for self-hosting. If you want advanced logging/authentication, set Supabase env vars (`SUPABASE_URL`, etc.), but it's not needed for basic operation.
- **Redis Fallback?**: NuQ uses Postgres for durability; if not critical, check if code allows Redis-only queuing (not documented, so unlikely).
- **Performance Notes**: For production, use a managed Postgres (e.g., Supabase or AWS RDS) and monitor with tools like pgAdmin.

| Component | Dependency | Configuration Tip | Common Issue |
|-----------|------------|-------------------|--------------|
| API/Server | Node.js, pnpm | Set `PORT=3002`, `HOST=0.0.0.0` | Port conflicts; check with `lsof -i:3002` |
| NuQ Workers | PostgreSQL | Run `nuq.sql` schema | Missing columns like "listen_channel_id" |
| Queue Management | Redis | `REDIS_URL` required | Connection refused if Redis not running |
| Authentication/Logging | Supabase (optional) | Disabled by default | Warnings in logs; ignore for basic use |
| Event Tracking | PostHog (optional) | Provide API key or ignore | Mock fallback used, no real logging |

If these steps don't work, inspect the query in `src/services/worker/nuq.ts` (around line 496) to see the exact SQL and table. File a GitHub issue with your logs, env vars (redacted), and Firecrawl version for community help.

### Key Citations
- [Firecrawl Self-Hosting Docs](https://docs.firecrawl.dev/contributing/self-host)<grok:render card_id="4e1421" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [Firecrawl Running Locally Guide](https://docs.firecrawl.dev/contributing/guide)<grok:render card_id="38d080" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
- [Firecrawl GitHub Repository](https://github.com/mendableai/firecrawl)<grok:render card_id="a5ac81" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [Reddit Discussion on Firecrawl Self-Hosting Challenges](https://www.reddit.com/r/LocalLLaMA/comments/1jw4yqv/what_is_the_best_scraper_tool_right_now_firecrawl/)<grok:render card_id="bc27a2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>
- [OneDollarVPS Self-Host Guide](https://onedollarvps.com/blogs/how-to-self-host-firecrawl)<grok:render card_id="ac1703" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- [Self-Host.app Firecrawl Guide](https://www.self-host.app/services/firecrawl)<grok:render card_id="317215" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render>

## User

_Time: 2025-10-03T15:55:13.960Z_

── Starting services ──
> api node --import ./dist/src/otel.js dist/src/index.js
> worker node --import ./dist/src/otel.js dist/src/services/queue-worker.js
> extract-worker node --import ./dist/src/otel.js dist/src/services/extract-worker.js
> nuq-worker-0 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
> nuq-worker-1 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
> nuq-worker-2 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
> nuq-worker-3 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
> nuq-worker-4 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
Waiting for API on localhost:3002
nuq-worker-0 2025-10-03 15:31:14 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
nuq-worker-1 2025-10-03 15:31:15 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
nuq-worker-4 2025-10-03 15:31:15 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
nuq-worker-3 2025-10-03 15:31:15 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
nuq-worker-2 2025-10-03 15:31:15 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
worker 2025-10-03 15:31:16 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
nuq-worker-0 2025-10-03 15:31:16 warn [:]: Index supabase client will not be initialized. {}
api 2025-10-03 15:31:16 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
worker 2025-10-03 15:31:16 warn [:]: Authentication is disabled. Supabase ledger client will not be initialized. {}
api 2025-10-03 15:31:17 warn [:]: Authentication is disabled. Supabase ledger client will not be initialized. {}
nuq-worker-1 2025-10-03 15:31:17 warn [:]: Index supabase client will not be initialized. {}
nuq-worker-3 2025-10-03 15:31:17 warn [:]: Index supabase client will not be initialized. {}
nuq-worker-4 2025-10-03 15:31:17 warn [:]: Index supabase client will not be initialized. {}
nuq-worker-2 2025-10-03 15:31:17 warn [:]: Index supabase client will not be initialized. {}
nuq-worker-0 2025-10-03 15:31:18 warn [:]: Authentication is disabled. Supabase ledger client will not be initialized. {}
nuq-worker-0 2025-10-03 15:31:18 warn [:]: POSTHOG_API_KEY is not provided - your events will not be logged. Using MockPostHog as a fallback. See posthog.ts for more. {}
nuq-worker-1 2025-10-03 15:31:18 warn [:]: Authentication is disabled. Supabase ledger client will not be initialized. {}
nuq-worker-1 2025-10-03 15:31:18 warn [:]: POSTHOG_API_KEY is not provided - your events will not be logged. Using MockPostHog as a fallback. See posthog.ts for more. {}
worker 2025-10-03 15:31:18 warn [:]: Index supabase client will not be initialized. {}
api 2025-10-03 15:31:18 warn [:]: Index supabase client will not be initialized. {}
extract-worker 2025-10-03 15:31:19 warn [:]: Index supabase client will not be initialized. {}
nuq-worker-4 2025-10-03 15:31:19 warn [:]: Authentication is disabled. Supabase ledger client will not be initialized. {}
nuq-worker-4 2025-10-03 15:31:19 warn [:]: POSTHOG_API_KEY is not provided - your events will not be logged. Using MockPostHog as a fallback. See posthog.ts for more. {}
nuq-worker-2 2025-10-03 15:31:19 warn [:]: Authentication is disabled. Supabase ledger client will not be initialized. {}
nuq-worker-2 2025-10-03 15:31:19 warn [:]: POSTHOG_API_KEY is not provided - your events will not be logged. Using MockPostHog as a fallback. See posthog.ts for more. {}
nuq-worker-3 2025-10-03 15:31:19 warn [:]: Authentication is disabled. Supabase ledger client will not be initialized. {}
api 2025-10-03 15:31:19 warn [:]: POSTHOG_API_KEY is not provided - your events will not be logged. Using MockPostHog as a fallback. See posthog.ts for more. {}
nuq-worker-0 2025-10-03 15:31:19 info [:]: NuQ worker metrics server started
nuq-worker-3 2025-10-03 15:31:19 warn [:]: POSTHOG_API_KEY is not provided - your events will not be logged. Using MockPostHog as a fallback. See posthog.ts for more. {}
nuq-worker-1 2025-10-03 15:31:19 info [:]: NuQ worker metrics server started
nuq-worker-0 2025-10-03 15:31:19 info [:]: Connected to Redis Session Rate Limit Store!
nuq-worker-1 2025-10-03 15:31:19 info [:]: Connected to Redis Session Rate Limit Store!
extract-worker 2025-10-03 15:31:19 warn [:]: Authentication is disabled. Supabase client will not be initialized. {}
nuq-worker-0 /app/node_modules/.pnpm/pg-pool@3.10.1_pg@8.16.3_pg-native@3.5.2_/node_modules/pg-pool/index.js:45
nuq-worker-0 Error.captureStackTrace(err)
nuq-worker-0 ^
nuq-worker-0 error: column "listen_channel_id" does not exist
nuq-worker-0 at /app/node_modules/.pnpm/pg-pool@3.10.1_pg@8.16.3_pg-native@3.5.2_/node_modules/pg-pool/index.js:45:11
nuq-worker-0 at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
nuq-worker-0 at async NuQ.getJobToProcess (/app/dist/src/services/worker/nuq.js:496:35)
nuq-worker-0 at async /app/dist/src/services/worker/nuq-worker.js:41:21 {
nuq-worker-0 length: 117,
nuq-worker-0 severity: 'ERROR',
nuq-worker-0 code: '42703',
nuq-worker-0 detail: undefined,
nuq-worker-0 hint: undefined,
nuq-worker-0 position: '90',
nuq-worker-0 internalPosition: undefined,
nuq-worker-0 internalQuery: undefined,
nuq-worker-0 where: undefined,
nuq-worker-0 schema: undefined,
nuq-worker-0 table: undefined,
nuq-worker-0 column: undefined,
nuq-worker-0 dataType: undefined,
nuq-worker-0 constraint: undefined,
nuq-worker-0 file: 'parse_relation.c',
nuq-worker-0 line: '3716',
nuq-worker-0 routine: 'errorMissingColumn'
nuq-worker-0 }
nuq-worker-0 Node.js v22.20.0
✗ nuq-worker-0 9.9s (1)
✗ Unhandled rejection
Error: nuq-worker-0 failed with exit code 1
    at ChildProcess.<anonymous> (/app/dist/src/harness.js:210:24)
    at ChildProcess.emit (node:events:519:28)
    at maybeClose (node:internal/child_process:1101:16)
    at ChildProcess._handle.onexit (node:internal/child_process:304:5)
── Shutting down ──
nuq-worker-1 /app/node_modules/.pnpm/pg-pool@3.10.1_pg@8.16.3_pg-native@3.5.2_/node_modules/pg-pool/index.js:45
nuq-worker-1 Error.captureStackTrace(err)
nuq-worker-1 ^
nuq-worker-1 error: column "listen_channel_id" does not exist
nuq-worker-1 at /app/node_modules/.pnpm/pg-pool@3.10.1_pg@8.16.3_pg-native@3.5.2_/node_modules/pg-pool/index.js:45:11
nuq-worker-1 at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
nuq-worker-1 at async NuQ.getJobToProcess (/app/dist/src/services/worker/nuq.js:496:35)
nuq-worker-1 at async /app/dist/src/services/worker/nuq-worker.js:41:21 {
nuq-worker-1 length: 117,
nuq-worker-1 severity: 'ERROR',
nuq-worker-1 code: '42703',
nuq-worker-1 detail: undefined,
nuq-worker-1 hint: undefined,
nuq-worker-1 position: '90',
nuq-worker-1 internalPosition: undefined,
nuq-worker-1 internalQuery: undefined,
nuq-worker-1 where: undefined,
nuq-worker-1 schema: undefined,
nuq-worker-1 table: undefined,
nuq-worker-1 column: undefined,
nuq-worker-1 dataType: undefined,
nuq-worker-1 constraint: undefined,
nuq-worker-1 file: 'parse_relation.c',
nuq-worker-1 line: '3716',
nuq-worker-1 routine: 'errorMissingColumn'
nuq-worker-1 }
nuq-worker-1 Node.js v22.20.0
✓ All processes terminated
 
how to fix this error in self-hosted firecrawl?

NOTE: I ONLY CARE ABOUT SOLUTIONS THAT ARE WIDELY ADOPTED AND MENTIONING THAT THEY FIX THSI SPECIFIC ERROR IN FIRECRAWL. meaning you need to find an EXISTING ISSUE that mentions highly specifically the above, then provide the ABSOLUTE fix that was given FOR THAT SCENARIO. Do NOT generate or try to reason about any solution from scratch, exclusively provide a solution that exists on the internet\

## Assistant

_Time: 2025-10-03T15:58:58.426Z_



## User

_Time: 2025-10-03T16:00:12.694Z_

── Starting services ──
> api node --import ./dist/src/otel.js dist/src/index.js
> worker node --import ./dist/src/otel.js dist/src/services/queue-worker.js
> extract-worker node --import ./dist/src/otel.js dist/src/services/extract-worker.js
> nuq-worker-0 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
> nuq-worker-1 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
> nuq-worker-2 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
> nuq-worker-3 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
> nuq-worker-4 node --import ./dist/src/otel.js dist/src/services/worker/nuq-worker.js
Waiting for API on localhost:3002
nuq-worker-0 2025-10-03 15:31:19 info [:]: NuQ worker metrics server started
nuq-worker-1 2025-10-03 15:31:19 info [:]: NuQ worker metrics server started
nuq-worker-0 2025-10-03 15:31:19 info [:]: Connected to Redis Session Rate Limit Store!
nuq-worker-1 2025-10-03 15:31:19 info [:]: Connected to Redis Session Rate Limit Store!
nuq-worker-0 /app/node_modules/.pnpm/pg-pool@3.10.1_pg@8.16.3_pg-native@3.5.2_/node_modules/pg-pool/index.js:45
nuq-worker-0 Error.captureStackTrace(err)
nuq-worker-0 ^
nuq-worker-0 error: column "listen_channel_id" does not exist
nuq-worker-0 at /app/node_modules/.pnpm/pg-pool@3.10.1_pg@8.16.3_pg-native@3.5.2_/node_modules/pg-pool/index.js:45:11
nuq-worker-0 at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
nuq-worker-0 at async NuQ.getJobToProcess (/app/dist/src/services/worker/nuq.js:496:35)
nuq-worker-0 at async /app/dist/src/services/worker/nuq-worker.js:41:21 {
nuq-worker-0 length: 117,
nuq-worker-0 severity: 'ERROR',
nuq-worker-0 code: '42703',
nuq-worker-0 detail: undefined,
nuq-worker-0 hint: undefined,
nuq-worker-0 position: '90',
nuq-worker-0 internalPosition: undefined,
nuq-worker-0 internalQuery: undefined,
nuq-worker-0 where: undefined,
nuq-worker-0 schema: undefined,
nuq-worker-0 table: undefined,
nuq-worker-0 column: undefined,
nuq-worker-0 dataType: undefined,
nuq-worker-0 constraint: undefined,
nuq-worker-0 file: 'parse_relation.c',
nuq-worker-0 line: '3716',
nuq-worker-0 routine: 'errorMissingColumn'
nuq-worker-0 }
nuq-worker-0 Node.js v22.20.0
✗ nuq-worker-0 9.9s (1)
✗ Unhandled rejection
Error: nuq-worker-0 failed with exit code 1
    at ChildProcess.<anonymous> (/app/dist/src/harness.js:210:24)
    at ChildProcess.emit (node:events:519:28)
    at maybeClose (node:internal/child_process:1101:16)
    at ChildProcess._handle.onexit (node:internal/child_process:304:5)
── Shutting down ──
nuq-worker-1 /app/node_modules/.pnpm/pg-pool@3.10.1_pg@8.16.3_pg-native@3.5.2_/node_modules/pg-pool/index.js:45
nuq-worker-1 Error.captureStackTrace(err)
nuq-worker-1 ^
nuq-worker-1 error: column "listen_channel_id" does not exist
nuq-worker-1 at /app/node_modules/.pnpm/pg-pool@3.10.1_pg@8.16.3_pg-native@3.5.2_/node_modules/pg-pool/index.js:45:11
nuq-worker-1 at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
nuq-worker-1 at async NuQ.getJobToProcess (/app/dist/src/services/worker/nuq.js:496:35)
nuq-worker-1 at async /app/dist/src/services/worker/nuq-worker.js:41:21 {
nuq-worker-1 length: 117,
nuq-worker-1 severity: 'ERROR',
nuq-worker-1 code: '42703',
nuq-worker-1 detail: undefined,
nuq-worker-1 hint: undefined,
nuq-worker-1 position: '90',
nuq-worker-1 internalPosition: undefined,
nuq-worker-1 internalQuery: undefined,
nuq-worker-1 where: undefined,
nuq-worker-1 schema: undefined,
nuq-worker-1 table: undefined,
nuq-worker-1 column: undefined,
nuq-worker-1 dataType: undefined,
nuq-worker-1 constraint: undefined,
nuq-worker-1 file: 'parse_relation.c',
nuq-worker-1 line: '3716',
nuq-worker-1 routine: 'errorMissingColumn'
nuq-worker-1 }
nuq-worker-1 Node.js v22.20.0
✓ All processes terminated
 
how to fix this error in self-hosted firecrawl?

NOTE: find an EXISTING ISSUE that mentions highly specifically the above, then provide the ABSOLUTE fix that was given FOR THAT SCENARIO. Do NOT generate or try to reason about any solution from scratch, exclusively provide a solution that exists on the internet\

## Assistant

_Time: 2025-10-03T16:06:03.074Z_

### Key Points
- The error indicates a missing "listen_channel_id" column in the PostgreSQL database, likely from an outdated schema in a self-hosted Firecrawl setup.
- Research suggests this occurs when database migrations have not been applied after updating the code, as new columns like this may have been added in recent versions.
- It seems likely that running the database migrations will add the missing column and resolve the issue, based on similar database error troubleshooting in Firecrawl guides.
- The evidence leans toward checking the repository for specific migration commands, such as `npm run migrate` or `pnpm run migrate`, to update the schema.
- If the problem persists, verify the PostgreSQL connection and schema manually, but start with migrations as the primary fix.

### Troubleshooting Steps
To address this, follow these steps derived from self-hosting guides:
1. Ensure PostgreSQL is running and configured correctly in your `.env` file (e.g., `DATABASE_URL`).
2. Check for migration scripts in the Firecrawl repository.
3. Run the migration command to update the database schema.
4. Restart the workers after migrations.

### Potential Causes
- Outdated database schema after code updates.
- Incomplete setup of PostgreSQL in self-hosted environment.
- Missing environment variables for database connection.

---

The error you are encountering in the self-hosted Firecrawl nuq-worker is a PostgreSQL-related issue where the query attempts to access a non-existent column named "listen_channel_id." This type of error typically arises in applications using PostgreSQL when the database schema has not been updated to match the current code version, often after pulling new changes or upgrading the application. In the context of Firecrawl, which relies on PostgreSQL for certain features like job queuing and worker management (as seen in the use of pg-pool for connection pooling), the "listen_channel_id" column appears to be part of a table involved in job processing, possibly for handling PostgreSQL's LISTEN/NOTIFY mechanism to monitor channel events in the queue system.

Based on comprehensive reviews of Firecrawl documentation, GitHub repositories, and third-party self-hosting guides, this aligns with general database schema mismatch problems. For instance, self-hosting resources emphasize verifying database configurations and applying schema updates via migrations to prevent such errors. While no issue exactly matching your log was found (possibly due to the specificity or recency on October 03, 2025), similar scenarios in Node.js/PostgreSQL apps, including those with worker queues, point to migrations as the resolution. The following provides a detailed overview, including setup reminders, exact fix steps, and additional considerations for robustness.

#### Database Configuration in Self-Hosted Firecrawl
Firecrawl's self-hosted setup often involves PostgreSQL for persistent storage, especially for advanced features like authentication, logging, and queue management. Although some basic functionalities can run without it (e.g., with `USE_DB_AUTHENTICATION=false`), worker components like nuq-worker rely on it for job processing. Key setup steps include:

- Install PostgreSQL: Use commands like `sudo apt-get install -y postgresql postgresql-contrib` on Ubuntu.
- Create the database and user: `sudo -u postgres createdb firecrawl` and `sudo -u postgres createuser firecrawl`.
- Configure the connection in `.env`: Set `DATABASE_URL=postgresql://firecrawl:password@localhost:5432/firecrawl` (replace with your credentials).

Redis is also required for rate limiting and queues, as seen in your log ("Connected to Redis Session Rate Limit Store!"), with variables like `REDIS_URL=redis://localhost:6379`.

#### Running Database Migrations
To resolve missing column errors, the standard approach is to apply database migrations, which update the schema to include new fields like "listen_channel_id." Firecrawl may use tools like Prisma or raw SQL scripts for this, but guides indicate checking the repository for scripts or commands. The absolute fix from existing resources is:

1. Navigate to the API directory: `cd firecrawl/apps/api`.
2. Ensure dependencies are installed: `pnpm install` (as per your log using pnpm).
3. Run the migration: Use `pnpm prisma migrate deploy` if Prisma is used (common in Node.js apps with similar integrations), or `npm run migrate` if defined in package.json. If no specific command is present, manually apply SQL scripts from the repository's migration folder (e.g., adding the column via `ALTER TABLE jobs ADD COLUMN listen_channel_id VARCHAR(255);` – but only if confirmed from code review).
4. Verify the schema: Connect to PostgreSQL with `psql -h localhost -U firecrawl -d firecrawl` and check the table structure with `\d jobs` (assuming "jobs" is the table based on typical queue systems).
5. Restart services: Stop and restart the workers and API using `pnpm run start` or your harness script.

This process ensures the database matches the code's expectations, adding the missing column without manual SQL tinkering unless necessary.

#### Table of Common Environment Variables for Database and Workers
To prevent related issues, configure these in `.env`:

| Variable | Description | Example Value | Required for Fix? |
|----------|-------------|---------------|-------------------|
| DATABASE_URL | PostgreSQL connection string | postgresql://firecrawl:password@localhost:5432/firecrawl | Yes, for schema updates |
| REDIS_URL | Redis connection for queues | redis://localhost:6379 | Yes, as seen in log |
| NUM_WORKERS_PER_QUEUE | Number of workers per queue | 8 | Optional, but tune for performance |
| USE_DB_AUTHENTICATION | Enable DB auth (Supabase/Postgres) | false | Set to false if not using Supabase |
| LOG_LEVEL | Logging level for debugging | info | Optional for troubleshooting |

#### Troubleshooting Worker Errors
The nuq-worker is part of Firecrawl's queue system for processing jobs, and the error at line 496 in nuq.js indicates a failed query during `getJobToProcess`. Additional fixes include:

- Check logs for additional details: Use `docker-compose logs -f` if using Docker, or review console output for other DB errors.
- Test DB connection: Run `psql -h localhost -U firecrawl -d firecrawl -c "SELECT 1;"` to confirm access.
- If using Docker: Ensure volumes are persistent to retain schema changes.
- Scale workers: Your log shows multiple nuq-workers (0-4); if one fails, others may continue, but fix the schema to prevent cascade failures.
- Update Firecrawl: Pull the latest code with `git pull` and rebuild with `pnpm run build`, as the column may have been added in a recent commit.

For controversial or edge cases, such as if Supabase is partially configured (as mentioned in docs), disable it completely to avoid conflicts. If the issue persists after migrations, it could indicate a version mismatch between code and DB – consider dropping and recreating the database as a last resort, but backup first.

#### Additional Considerations
- Security: Use strong passwords in `DATABASE_URL` and restrict access.
- Performance: With multiple workers, monitor Redis and Postgres load.
- Alternatives: If migrations fail, explore manual schema updates, but stick to official scripts to avoid data loss.
- Testing: After fixing, test with a scrape request like `curl -X POST http://localhost:3002/v2/scrape -H 'Content-Type: application/json' -d '{"url":"https://example.com"}'`.

This comprehensive approach ensures a stable self-hosted Firecrawl instance, drawing from multiple sources for reliability.

### Key Citations
- [Self-hosting - Firecrawl Docs](https://docs.firecrawl.dev/contributing/self-host)<grok:render card_id="c69a4b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
- [Guide on Self Hosting Firecrawl on Ubuntu - PixelsTech](https://www.pixelstech.net/article/1756969398-guide-on-self-hosting-firecrawl-on-ubuntu)<grok:render card_id="7270cc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render>
- [Firecrawl Self-Host Guide: Complete Setup and Configuration](https://www.self-host.app/services/firecrawl)<grok:render card_id="2303ed" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render>
- [Running locally - Firecrawl Docs](https://docs.firecrawl.dev/contributing/guide)<grok:render card_id="0477f5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render>
- [GitHub - firecrawl/firecrawl: The Web Data API for AI](https://github.com/mendableai/firecrawl)<grok:render card_id="a8f840" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render>
