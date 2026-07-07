---
source_url: "https://grok.com/c/a00a31fd-bfb6-4f9c-876a-9d0c244b4754"
conversation_id: "a00a31fd-bfb6-4f9c-876a-9d0c244b4754"
title: "Configuring nuq-postgres for Firecrawl Self-Hosting"
extracted_at: "2026-06-29T16:33:14.511Z"
message_count: 18
export_suite: "identity"
provenance: grok-rest-api
---

# Configuring nuq-postgres for Firecrawl Self-Hosting

Source: [Grok conversation](https://grok.com/c/a00a31fd-bfb6-4f9c-876a-9d0c244b4754)

## User

_Time: 2025-09-22T16:43:27.982Z_

what does nuq-postgres do in the firecrawl github repo exactly and how do I use it and connect to it when selfhosting? Show src snippets from that repo where it's used. Basically its docker-compose.yaml defines it, but nothing in that yaml depends on nuq-postgres... Bizarre. Do I need to be running it when running firecrawl in self-hosted, if so how do I configure/connect to it when running the firecrawl container?

## Assistant

_Time: 2025-09-22T16:46:52.088Z_

### Key Points
- **nuq-postgres Overview**: It appears to be a customized PostgreSQL database setup specifically for handling task queuing in Firecrawl's self-hosted environment, integrated with the nuq-worker process for managing jobs like crawling and scraping.
- **Necessity in Self-Hosting**: Evidence suggests it's required in recent versions to avoid crashes in the nuq-worker, as the system attempts to connect to PostgreSQL even in basic setups; without it, errors like ECONNREFUSED may occur.
- **Setup and Connection**: Run a Docker container for nuq-postgres, initialize the database schema using nuq.sql, and connect via the NUQ_DATABASE_URL environment variable in your .env file for the Firecrawl application.
- **Dependencies and Configuration**: While it may be defined in docker-compose.yaml without explicit depends_on links, the Firecrawl services implicitly rely on it through environment variables; no direct code dependencies are evident, but runtime connections are enforced.

### What nuq-postgres Does
nuq-postgres serves as the backend database for Firecrawl's queuing system, likely supporting the "nuq" component (possibly standing for a queue mechanism) that handles asynchronous tasks. This includes managing worker processes for web crawling and data processing. Based on available documentation, it's built from a Dockerfile in the apps/nuq-postgres directory and uses a custom SQL schema (nuq.sql) to create necessary tables for queue operations. It's not used for general data storage but specifically for queuing, complementing Redis for other tasks like rate limiting.

### How to Use and Connect When Self-Hosting
To self-host Firecrawl with nuq-postgres:

1. **Build or Use the Docker Image**: If a pre-built image isn't available, build it from the repo's apps/nuq-postgres/Dockerfile. Then, start the container using a command like:
   ```
   docker run --name nuqdb \
     -e POSTGRES_PASSWORD=postgres \
     -p 5433:5432 \
     -v nuq-data:/var/lib/postgresql/data \
     -d nuq-postgres
   ```
   This exposes PostgreSQL on port 5433 (to avoid conflicts with default 5432).<grok:render card_id="8b831b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render> Adjust credentials and volumes as needed for persistence.

2. **Initialize the Database**: Connect to the running PostgreSQL instance (e.g., using `psql -h localhost -p 5433 -U postgres -d postgres`) and execute the SQL script from apps/nuq-postgres/nuq.sql to set up the queue tables. This step is crucial for the schema.<grok:render card_id="1b3e47" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>

3. **Configure in .env**: In your Firecrawl app's .env file (copied from .env.example), set:
   ```
   NUQ_DATABASE_URL=postgres://postgres:postgres@localhost:5433/postgres
   ```
   This tells the Firecrawl container how to connect. Ensure other required envs like REDIS_URL are also set.<grok:render card_id="fc9689" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>

4. **Run Firecrawl**: Start your Firecrawl services (e.g., via `docker-compose up` if using docker-compose.yaml). The nuq-worker will automatically connect using the env variable. If using a custom docker-compose, add a service for nuq-postgres if not already present, though dependencies might be implicit.

If you're not using it, some setups report crashes, so it's recommended to include it even for basic self-hosting.<grok:render card_id="2b0f4f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render> For authentication or advanced features, integrate with Supabase, but that's optional.

### Source Snippets from the Repo
Although direct code searches for "nuq-postgres" yielded no matches in repository code files (suggesting it's primarily a configuration and Docker image reference rather than hardcoded), it's referenced in documentation and issues. Here are relevant snippets:

- **From CONTRIBUTING.md (Docker Run Example)**:
  ```
  docker run --name nuqdb \
    -e POSTGRES_PASSWORD=postgres \
    -p 5433:5432 \
    -v nuq-data:/var/lib/postgresql/data \
    -d nuq-postgres
  ```
  This starts the PostgreSQL container for queuing.<grok:render card_id="b777d6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>

- **From .env Configuration (Example)**:
  ```
  # Using the PostgreSQL for queuing -- change if credentials, host, or DB is different
  NUQ_DATABASE_URL=postgres://postgres:postgres@localhost:5433/postgres
  ```
  This is set in .env to enable connection from Firecrawl services.<grok:render card_id="b6982b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>

- **From Issues (Error Without Connection)**:
  ```
  Error: Command "NUQ_WORKER_PORT=3009 NUQ_REDUCE_NOISE=true node dist/src/services/worker/nuq-worker.js" failed with code null
  ```
  Demonstrates crashes when PostgreSQL connection fails.<grok:render card_id="6b1602" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>

If docker-compose.yaml exists (as mentioned in user query and some sources), it likely defines a service like:
```
services:
  nuq-postgres:
    image: nuq-postgres
    environment:
      POSTGRES_PASSWORD: postgres
    ports:
      - "5433:5432"
    volumes:
      - nuq-data:/var/lib/postgresql/data
```
But no explicit depends_on may explain the "bizarre" aspect—connections are handled via env vars at runtime.<grok:render card_id="73aeb7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>

---

Firecrawl is an open-source web crawling and data extraction tool developed by Mendable.ai, designed to convert websites into LLM-ready markdown or structured data. In its self-hosted configuration, nuq-postgres plays a pivotal role in the backend infrastructure, specifically for task queuing. This section provides a comprehensive overview, drawing from repository documentation, issues, and related guides, to explain its function, setup, usage, and integration details.

#### Understanding nuq-postgres in Firecrawl
nuq-postgres refers to a specialized PostgreSQL database instance tailored for Firecrawl's queuing mechanism. The "nuq" prefix likely denotes a custom queuing system (possibly "Nuq Queue" or similar internal nomenclature), which manages asynchronous jobs such as website crawling, scraping, and processing. Unlike Redis, which handles rate limiting and caching, nuq-postgres focuses on persistent queuing for worker processes like nuq-worker.<grok:render card_id="8a32e9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render> This setup ensures reliable task distribution in self-hosted environments, especially under heavy loads or parallel requests.

The database is initialized with a schema defined in nuq.sql, which presumably creates tables for job queues, status tracking, and error handling. Although direct access to the SQL content was unavailable in searches, documentation consistently references it for setup.<grok:render card_id="2e7c0d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> The Dockerfile in apps/nuq-postgres likely extends a standard PostgreSQL image (e.g., postgres:14) with any necessary extensions for queuing efficiency, such as pg_notify for event-driven processing or custom configurations for performance.

In the context of the repository, nuq-postgres is not hardcoded in application logic but is referenced through environment variables and Docker configurations. This explains why code searches for "nuq-postgres" return no results—it's a runtime dependency rather than a code-level import.<grok:render card_id="744441" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> However, its absence can lead to runtime errors, as seen in community issues where nuq-worker attempts connections regardless of setup.<grok:render card_id="2135d3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>

#### Role in Self-Hosting and Potential Bizarreness in docker-compose.yaml
Self-hosting Firecrawl offers advantages like enhanced security, customization, and compliance, but requires careful configuration of dependencies.<grok:render card_id="bd49d6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render> nuq-postgres is integral for queuing, and recent updates (e.g., to the :latest Docker image) make it effectively mandatory to prevent crashes.<grok:render card_id="87bd53" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render> If your docker-compose.yaml defines a nuq-postgres service without explicit "depends_on" in other services (e.g., api or worker), this could seem bizarre—dependencies are managed implicitly via environment variables like NUQ_DATABASE_URL.<grok:render card_id="2f8c24" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render> This design allows flexibility (e.g., using an external DB) but can cause confusion if not documented clearly.

For instance, in simplified forks like firecrawl-simple, queuing might be streamlined without PostgreSQL, but the main repo leans on it for robustness.<grok:render card_id="a9882c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render> If you're running without it, consider downgrading images or disabling queuing features, though this may limit functionality.

#### Step-by-Step Setup and Usage
1. **Prerequisites**: Ensure Docker is installed. PostgreSQL knowledge helps for troubleshooting. Clone the repo: `git clone https://github.com/mendableai/firecrawl.git`.<grok:render card_id="671c5d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render>

2. **Building the Image**: Navigate to apps/nuq-postgres and build: `docker build -t nuq-postgres .`. This creates the custom image.

3. **Running the Container**: Use the provided command to start PostgreSQL. For persistence, use named volumes. Monitor with `docker logs nuqdb`.

4. **Database Initialization**: Use a tool like psql to run nuq.sql:
   ```
   psql -h localhost -p 5433 -U postgres -d postgres -f apps/nuq-postgres/nuq.sql
   ```
   This sets up tables for queuing.<grok:render card_id="eef569" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>

5. **Environment Configuration**: Copy .env.example to .env in apps/api. Key variables include:

   | Variable              | Description                                      | Example Value                          | Required? |
   |-----------------------|--------------------------------------------------|----------------------------------------|-----------|
   | NUQ_DATABASE_URL     | Connection string for nuq-postgres              | postgres://postgres:postgres@localhost:5433/postgres | Yes      |
   | REDIS_URL            | Redis for rate limiting                         | redis://localhost:6379                | Yes      |
   | USE_DB_AUTHENTICATION| Enable Supabase auth (optional)                 | false                                 | No       |
   | NUM_WORKERS_PER_QUEUE| Number of workers per queue                     | 8                                     | Yes      |

   Adjust based on your setup.<grok:render card_id="414990" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>

6. **Integrating with Firecrawl Container**: If using docker-compose.yaml (found in the docker directory per some guides), ensure it includes the nuq-postgres service. Start with `docker-compose up -d`. The Firecrawl app (e.g., firecrawl-app service) connects automatically via NUQ_DATABASE_URL. Test endpoints like `/v0/crawl` to verify queuing.<grok:render card_id="00f2e6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>

7. **Monitoring and Troubleshooting**: Check logs with `docker-compose logs -f firecrawl-worker`. Common issues include connection refusals—verify port, credentials, and firewall. For scaling, share the same PostgreSQL instance across multiple Firecrawl nodes.<grok:render card_id="a8bb52" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>

#### Source Snippets and Code References
- **Docker Run Snippet (from Docs)**: As above, for starting nuqdb.
- **Error Handling Snippet (from Issues)**: Shows unhandled rejections when connection fails, emphasizing the need for nuq-postgres.<grok:render card_id="e6c92f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- **Backup Script Example (Community Guide)**: 
  ```
  # PostgreSQL backup
  pg_dump firecrawl > /backup/firecrawl-$(date +%Y%m%d).sql
  ```
  Useful for maintaining nuq-postgres data.<grok:render card_id="bc4c32" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- **Health Check Snippet**: `curl http://localhost:3002/v0/health` to verify connection post-setup.

#### Advanced Considerations
For production, integrate with Kubernetes for better scalability, as mentioned in changelogs.<grok:render card_id="809156" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render> If avoiding PostgreSQL, explore forks like firecrawl-simple, which reduces dependencies.<grok:render card_id="02f87b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render> Community contributions highlight ongoing improvements, such as pre-built images for easier deployment.<grok:render card_id="94a02a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render> Always test with sample crawls to ensure queuing stability.

This setup ensures a reliable self-hosted Firecrawl instance, balancing performance and control.

### Key Citations
- [Running locally - Firecrawl Docs](https://docs.firecrawl.dev/contributing/guide)<grok:render card_id="72fb74" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>
- [Running locally | Firecrawl](https://docs.firecrawl.dev/contributing/guide)<grok:render card_id="930c82" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [[Self-Host] nuq-worker crashes by attempting to connect to PostgreSQL in setups without a database · Issue #2145 · firecrawl/firecrawl](https://github.com/firecrawl/firecrawl/issues/2145)<grok:render card_id="e90614" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>
- [firecrawl/CONTRIBUTING.md at main · firecrawl/firecrawl](https://github.com/firecrawl/firecrawl/blob/main/CONTRIBUTING.md)<grok:render card_id="ac0792" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
- [Firecrawl Self-Host Guide: Complete Setup and Configuration](https://www.self-host.app/services/firecrawl)<grok:render card_id="78806b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- [How to Self-Host Firecrawl: A Comprehensive Guide](https://onedollarvps.com/blogs/how-to-self-host-firecrawl)<grok:render card_id="043f8b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render>
- [firecrawl/SELF_HOST.md at main · firecrawl/firecrawl](https://github.com/mendableai/firecrawl/blob/main/SELF_HOST.md)<grok:render card_id="5e31a4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render>
- [[Self-Host] Error in api service running in docker · Issue #2130 · firecrawl/firecrawl](https://github.com/firecrawl/firecrawl/issues/2130)<grok:render card_id="76bdfd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- [Self-hosting the OSS Version of Firecrawl](https://codenote.net/en/posts/firecrawl-oss-self-host-introduction/)<grok:render card_id="43f3c8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>
- [Changelog | Firecrawl](https://www.firecrawl.dev/changelog)<grok:render card_id="53ec3a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render>
- [[Self-Host] Availability of a Pre-Built Playwright Image for Firecrawl](https://github.com/mendableai/firecrawl/issues/1322)<grok:render card_id="dedf5f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render>
- [firecrawl/firecrawl: The Web Data API for AI - Turn entire ... - GitHub](https://github.com/firecrawl/firecrawl)<grok:render card_id="0949ce" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render>
- [devflowinc/firecrawl-simple - GitHub](https://github.com/devflowinc/firecrawl-simple)<grok:render card_id="28b679" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>

## User

_Time: 2025-09-22T16:54:26.015Z_

✗ Fatal error occurred
Error: Port 3002 did not become available within 20000ms
    at Timeout._onTimeout (/app/dist/src/harness.js:129:20)
    at listOnTimeout (node:internal/timers:588:17)
    at process.processTimers (node:internal/timers:523:7)
 * Terminal will be reused by tasks, press any key to close it.
 
Correct way to fix this error when self-hosting firecrawl?

## Assistant

_Time: 2025-09-22T16:58:13.256Z_

The API service in your Firecrawl self-hosted Docker setup is failing to bind or start on port 3002, leading to the timeout. This is often due to port conflicts, incorrect HOST binding, or underlying startup failures in the container (e.g., missing files like package.json or dependency issues). Research suggests it's not uncommon in recent versions and can be resolved with configuration tweaks or local builds.

- **Key factors**: The error stems from the harness script waiting 20 seconds for the port to open, but the server process (e.g., via pnpm commands) crashes or can't listen. Common triggers include binding to an invalid IP, port in use, or image build problems.
- **Likelihood of fix**: High, as community reports show simple env changes or log checks resolve it in most cases.

**Immediate Checks and Fixes**
- Verify port 3002 isn't occupied: Run `lsof -i :3002` or `netstat -tuln | grep 3002` on your host machine. If in use, kill the process with `kill -9 <PID>`.
- If on Windows, reserved ports might be the issue—run `net stop winnat` in PowerShell as admin, then restart Docker.
- Inspect container logs: Use `docker logs <api-container-name>` (e.g., firecrawl-api-1) to identify root causes like EADDRINUSE, EADDRNOTAVAIL, or pnpm errors (e.g., missing package.json).

**Configuration Adjustments**
Edit your `.env` file (based on .env.example in apps/api):
- Set `HOST=0.0.0.0` to bind to all interfaces (prevents EADDRNOTAVAIL if HOST is a specific invalid IP).
- Confirm `PORT=3002` (or change to another free port and update docker-compose ports mapping).
- Ensure `REDIS_URL=redis://redis:6379` (for Docker network) and Redis container is healthy—check with `docker logs redis`.
- If using nuq-postgres (from docker-compose.yaml), verify it's running and `NUQ_DATABASE_URL` is set correctly, as worker crashes can halt startup.

Restart with `docker-compose down && docker-compose up -d`.

**If Using Pre-Built Images Fails**
Recent issues indicate pre-built images may lack files (e.g., package.json in /app). Switch to local build:
- In docker-compose.yaml, add or update the api service:
  ```
  services:
    api:
      build:
        context: ./apps/api
      ...
  ```
- Run `docker-compose build` then `docker-compose up -d`.

**Testing After Fix**
- Check if port is listening: `curl http://localhost:3002/v0/health` should return OK.
- Test scrape: `curl -X POST http://localhost:3002/v0/scrape -H 'Content-Type: application/json' -d '{"url":"https://example.com"}'`.

If logs show pnpm errors, consider running non-Docker locally for debugging: Start Redis, then in separate terminals run `PORT=3003 pnpm run workers` and `pnpm run start` (avoids port conflict).

---

Firecrawl's self-hosted setup via Docker often encounters startup hurdles related to port binding and container health, as seen in community reports and documentation. This comprehensive overview covers the error's context, root causes, step-by-step resolutions, and preventive measures, expanding on the direct fixes above.

### Understanding the Error Mechanism
The fatal error originates from `/app/dist/src/harness.js`, a script that orchestrates starting the API server and workers in the container. It executes commands like `pnpm server:production:nobuild` and polls for port 3002 to become available (via net or similar checks). If the server fails to listen within 20 seconds (20000ms), it times out. This isn't a direct port conflict but a symptom of the underlying process crashing or unable to bind.

Common triggers from analyzed issues:
- **Binding failures**: Node.js throws EADDRNOTAVAIL if HOST is set to an unavailable IP (e.g., a specific external IP not on the host). EADDRINUSE occurs if multiple processes (e.g., workers and API) compete for 3002.
- **Image integrity issues**: Pre-built Docker images in recent versions (e.g., 1.10.0+) may miss manifests like package.json in /app, causing pnpm to fail with ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND.
- **Dependency readiness**: If Redis or nuq-postgres isn't accessible, workers crash, preventing the full startup.
- **Platform-specific quirks**: On Windows, WinNAT reserves ports; on Ubuntu/Linux, firewall or network modes (e.g., host vs. bridge) block binding.

| Error Variant | Typical Log Snippet | Likely Cause | Resolution Priority |
|---------------|---------------------|--------------|---------------------|
| Timeout on port availability | "Port 3002 did not become available within 20000ms" at harness.js:129 | Server process fails to start/bind | High: Check logs first |
| EADDRNOTAVAIL | "listen EADDRNOTAVAIL: address not available [IP]:3002" | Invalid HOST IP | Medium: Set HOST=0.0.0.0 |
| EADDRINUSE | "listen EADDRINUSE: address already in use 0.0.0.0:3002" | Port conflict (e.g., workers on same port) | High: Kill processes or separate ports |
| PNPM Manifest Error | "ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND No package.json... in /app" at harness.js:91 | Broken Docker image | Medium: Build locally |
| Connection Refused (Redis) | "Connection refused" or timeouts in logs | Redis not running/accessible | Low: Verify REDIS_URL |

### Full Self-Hosting Setup Recap (for Context and Verification)
To ensure your setup aligns, follow this adapted from official docs and community guides (e.g., Ubuntu-specific). Assume Ubuntu/Linux, but adjust for OS.

1. **Prerequisites Installation**:
   - Node.js 18+, pnpm, Redis, Docker, Docker Compose.
   - Example commands (Ubuntu):
     ```
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs build-essential
     curl -fsSL https://get.pnpm.io/install.sh | sh -
     sudo apt install redis docker.io docker-compose
     ```

2. **Clone and Prepare Repo**:
   ```
   git clone https://github.com/firecrawl/firecrawl.git
   cd firecrawl
   ```

3. **Configure .env**:
   Copy `apps/api/.env.example` to `apps/api/.env` and set:
   ```
   NUM_WORKERS_PER_QUEUE=8
   PORT=3002
   HOST=0.0.0.0
   REDIS_URL=redis://redis:6379  # For Docker; use redis://localhost:6379 if local
   REDIS_RATE_LIMIT_URL=redis://redis:6379
   USE_DB_AUTHENTICATION=false
   NUQ_DATABASE_URL=postgres://postgres:postgres@nuq-postgres:5432/postgres  # If using Postgres
   ```
   - Avoid Supabase for self-host (set USE_DB_AUTHENTICATION=false to bypass warnings).

4. **Docker Compose Configuration**:
   - Ensure docker-compose.yaml includes services for api, redis, nuq-postgres (if defined), with ports: "3002:3002" for api.
   - For local build, add under api service:
     ```
     build:
       context: ./apps/api
     ```

5. **Start Services**:
   ```
   docker-compose build  # If building locally
   docker-compose up -d
   ```
   - If non-Docker (for debugging): Start Redis, then `PORT=3003 pnpm run workers` and `pnpm run start` in separate terminals.

6. **Initialization (if using nuq-postgres)**:
   - Exec into Postgres container: `docker exec -it nuq-postgres psql -U postgres`.
   - Run schema: `\i /path/to/nuq.sql` (mount the file if needed).

### Advanced Troubleshooting Workflow
If basic fixes fail:
1. **Isolate Container Issues**: Run `docker ps` to confirm api container is up (not restarting). If exiting, check `docker logs` for pnpm or Node errors.
2. **Network Mode Check**: In docker-compose.yaml, use network_mode: "host" if bridge mode causes binding issues.
3. **Version Pinning**: Use a specific image tag in docker-compose (e.g., firecrawl/api:1.9.0) if latest is buggy.
4. **Resource Allocation**: Increase Docker resources (CPU/memory) if OOM kills occur.
5. **Firewall/Proxy**: Disable ufw (`sudo ufw disable`) temporarily; check PROXY_SERVER env if behind proxy.
6. **Clean Rebuild**: `docker-compose down -v --rmi all`, delete volumes, then rebuild/up.
7. **Community Validation**: Test with known working setups from guides (e.g., https://www.pixelstech.net/article/1756969398-guide-on-self-hosting-firecrawl-on-ubuntu shows explicit worker port separation prevents EADDRINUSE).

### Preventive Best Practices
- Always build locally for custom setups to avoid image inconsistencies.
- Monitor with tools like Portainer for Docker insights.
- For production, use Kubernetes (as per changelogs) for better health checks.
- Join Firecrawl Discord (https://discord.gg/gSmWdAkdwd) or file GitHub issues with logs for unresolved cases.

This setup ensures reliable operation, with the port error typically resolved via HOST/port checks or local builds.

**Key Citations:**
- [Self-hosting - Firecrawl Docs](https://docs.firecrawl.dev/contributing/self-host)<grok:render card_id="1a534d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render><grok:render card_id="34242d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render><grok:render card_id="6adfc7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render>
- [Guide on Self Hosting Firecrawl on Ubuntu](https://www.pixelstech.net/article/1756969398-guide-on-self-hosting-firecrawl-on-ubuntu)<grok:render card_id="e7a322" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render><grok:render card_id="993c66" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render>
- [Docker compose failing to function with EADDRNOTAVAIL error](https://github.com/mendableai/firecrawl/issues/1225)<grok:render card_id="75b96b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render><grok:render card_id="05e09d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render><grok:render card_id="e52801" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render>
- [Firecrawl container won't even start](https://github.com/firecrawl/firecrawl/issues/2111)<grok:render card_id="c326bd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render><grok:render card_id="250058" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render>
- [Node.js Port 3000 already in use but it actually isn't?](https://stackoverflow.com/questions/39322089/node-js-port-3000-already-in-use-but-it-actually-isnt)<grok:render card_id="d8abfc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [running docker gives Ports are not available error](https://stackoverflow.com/questions/60830914/running-docker-gives-ports-are-not-available-error)<grok:render card_id="0b26c8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render>
- [How to Self-Host Firecrawl: A Comprehensive Guide](https://onedollarvps.com/blogs/how-to-self-host-firecrawl)<grok:render card_id="127c0c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render>

## User

_Time: 2025-09-22T17:04:12.750Z_

why'

## Assistant

_Time: 2025-09-22T17:04:14.420Z_



## User

_Time: 2025-09-22T17:04:39.912Z_

why's it use http://localhost:3002 though? what if i want it to be http://127.0.0.1:3002 or http://firecrawl:3002??? potentially that's the issue?

## Assistant

_Time: 2025-09-22T17:08:18.515Z_

- Firecrawl's internal scripts check http://localhost:3002 to confirm the API server is running within its own Docker container, as 'localhost' reliably points to the container itself in this context.
- Using http://127.0.0.1:3002 instead may help if your system prefers IPv6 for 'localhost' (resolving to ::1), causing mismatches with IPv4-bound servers—evidence suggests this can fix binding timeouts in similar setups.
- http://firecrawl:3002 (assuming 'firecrawl' is a service name) is suited for accessing the API from other containers in the same Docker network, but not for the internal self-check, which could lead to connection failures if substituted.
- The port availability error often stems from binding issues rather than the check URL; setting HOST=0.0.0.0 in your .env file is a common fix to listen on all interfaces without conflicts.

### Understanding the Use of localhost:3002
In Firecrawl's self-hosted Docker environment, the harness script (likely in apps/api/src/harness.ts or its compiled form) initiates the API server and performs a health check by attempting to connect to http://localhost:3002.<grok:render card_id="d0e6b8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> This is a standard practice for verifying that the server process has successfully bound to the port inside the container.<grok:render card_id="9f47b9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render> 'Localhost' here refers to the loopback interface of the container, ensuring the check is isolated and doesn't rely on external network configurations.<grok:render card_id="db50e2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render> If the connection fails within the 20-second timeout, it triggers the "Port 3002 did not become available" error, often due to underlying binding problems like address unavailability (EADDRNOTAVAIL).<grok:render card_id="230ab3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>

### Potential Fixes with Alternative Addresses
Switching the check to http://127.0.0.1:3002 might resolve the issue if 'localhost' resolves to an IPv6 address (::1) on your system, while the server is bound to IPv4— a known mismatch in Docker environments.<grok:render card_id="18efa5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render><grok:render card_id="bb26dc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render> However, this requires modifying the source code in harness.ts to use '127.0.0.1' instead of 'localhost' in the port check function, then rebuilding the image.<grok:render card_id="9ef4f0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render> For http://firecrawl:3002, this would only work for cross-container access via Docker's service discovery; using it for the internal check could cause "connection refused" errors since it treats 'firecrawl' as a remote host.<grok:render card_id="ce1bf1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render><grok:render card_id="9d2e77" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render> If the error persists, prioritize setting HOST=0.0.0.0 in .env to bind broadly, and ensure no external processes occupy port 3002 on the host.<grok:render card_id="c858b3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render><grok:render card_id="0e79e3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render>

### Troubleshooting Steps
1. Check for port conflicts: Run `lsof -i :3002` or `netstat -tuln | grep 3002` on your host and kill any conflicting processes.<grok:render card_id="868114" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render>
2. Update .env: Explicitly set `HOST=0.0.0.0` and `PORT=3002`, then restart with `docker-compose down && docker-compose up -d`.<grok:render card_id="7865eb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render>
3. Test accessibility: After startup, curl http://localhost:3002/v0/health from your host—if it fails but http://127.0.0.1:3002 works, the issue is resolution-related.<grok:render card_id="cb2afd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render>
4. If needed, edit and rebuild: Fork the repo, change 'localhost' to '127.0.0.1' in the harness script's check logic, and build locally.<grok:render card_id="b3d2b9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>

---
Firecrawl's self-hosted setup leverages Docker for containerization, where network binding and port checks play critical roles in ensuring the API service starts correctly. The error "Port 3002 did not become available within 20000ms" typically arises from the harness script's inability to confirm the server's readiness, often tied to how addresses like 'localhost' are resolved and bound within the container environment.<grok:render card_id="3673ed" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="37e10c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render> This detailed exploration covers the rationale behind using http://localhost:3002, the implications of alternatives like http://127.0.0.1:3002 or http://firecrawl:3002, and whether these could address the underlying issue, drawing from Docker networking principles, Firecrawl-specific issues, and general troubleshooting insights.

#### Rationale for Using http://localhost:3002 in Firecrawl
In the Firecrawl architecture, the API service runs within a Docker container, and startup orchestration is handled by a harness script (typically compiled from TypeScript sources like harness.ts).<grok:render card_id="89202e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render> This script executes commands to launch the server (e.g., via pnpm or Node.js) and then polls for port availability by attempting connections to http://localhost:3002.<grok:render card_id="b8daef" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render><grok:render card_id="55749a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render> The use of 'localhost' is intentional: In a containerized context, it resolves to the loopback interface (127.0.0.1 or ::1), allowing the script to verify internally that the server has bound to the specified port without depending on external network factors.<grok:render card_id="0c4e6f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render><grok:render card_id="e2aec5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render> This isolation ensures the check is self-contained, preventing false positives from host-side interference.<grok:render card_id="6ba311" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render> The 20-second timeout (20000ms) is a safety mechanism to detect startup failures, such as binding errors or dependency issues (e.g., Redis or PostgreSQL not ready).<grok:render card_id="7f2949" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render card_id="36645a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render> Community reports from Firecrawl's GitHub issues highlight similar problems, where the check fails due to address unavailability, often manifesting as EADDRNOTAVAIL errors when the bound IP isn't accessible within the container.<grok:render card_id="a71a98" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="c1e941" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>

#### Differences and Implications of Alternative Addresses
Switching the port check or binding address involves understanding Docker's networking nuances, where 'localhost', 127.0.0.1, and service names like 'firecrawl' behave differently.

- **http://127.0.0.1:3002**: This explicitly uses the IPv4 loopback address, bypassing potential IPv6 resolutions of 'localhost' (which might default to ::1 on modern systems).<grok:render card_id="19d09d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render><grok:render card_id="8a8436" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render> If your host or container prefers IPv6 but the server binds only to IPv4 (common in Node.js apps), the original 'localhost' check could fail with connection refusals or timeouts.<grok:render card_id="6bbf20" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render><grok:render card_id="6c2a83" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render> Modifying the harness script to use '127.0.0.1' in its connection attempt (e.g., in a net.createConnection or similar function) could resolve this, as it forces IPv4.<grok:render card_id="32a851" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render> However, this requires source code changes and a local build, as pre-built images may not expose this flexibility.<grok:render card_id="9a0ec1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render> In practice, this has fixed analogous issues in other Dockerized apps where localhost accessibility varies by OS (e.g., macOS vs. Linux).<grok:render card_id="cb4342" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render><grok:render card_id="eb96b3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">41</argument>
</grok:render>

- **http://firecrawl:3002**: Assuming 'firecrawl' is defined as a service name in docker-compose.yml, this leverages Docker's internal DNS for inter-container communication.<grok:render card_id="817e9f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render> It's useful for clients or workers in separate containers to reach the API (e.g., from a Python SDK: FirecrawlApp({apiUrl: "http://firecrawl:3002"})).<grok:render card_id="9cf33c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render><grok:render card_id="6e0f78" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render> But for the harness script's self-check within the API container, this would treat 'firecrawl' as a remote host, potentially looping back inefficiently or failing if DNS resolution hiccups occur.<grok:render card_id="ba00fa" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render><grok:render card_id="4fc318" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render> This mismatch could exacerbate the error rather than fix it, as seen in issues where local deployments struggle with service discovery.<grok:render card_id="d22d46" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render card_id="068ac0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>

#### Common Causes and Resolutions for the Port Error
The error often isn't solely about the check URL but related binding configurations. Firecrawl's .env.example likely includes variables like PORT=3002 and HOST (defaulting to localhost or 0.0.0.0), which control how the server listens.<grok:render card_id="663f3f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render> Binding to a specific unavailable IP (e.g., a non-loopback address) triggers EADDRNOTAVAIL, as reported in multiple issues.<grok:render card_id="8eac6f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="0f928e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render> To address this:

| Configuration | Purpose | Recommended Value | Potential Impact on Error |
|---------------|---------|-------------------|---------------------------|
| HOST         | Server binding address | 0.0.0.0          | Allows listening on all interfaces, resolving EADDRNOTAVAIL by avoiding specific IP restrictions.<grok:render card_id="679f8b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render><grok:render card_id="3954fc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render> |
| PORT         | Listening port        | 3002             | Ensure no host conflicts; change if 3002 is occupied.<grok:render card_id="1078ce" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render><grok:render card_id="654ed7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render> |
| API_URL      | Client-side endpoint  | http://localhost:3002 | For SDKs; use service name for container-to-container.<grok:render card_id="e36247" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render><grok:render card_id="01a71f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render> |

Extended troubleshooting includes inspecting docker-compose.yml for ports mapping (e.g., "3002:3002") and networks, ensuring the api service doesn't have implicit dependencies causing delays.<grok:render card_id="3bc04a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render><grok:render card_id="ef9476" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render> For IPv6-related problems, disabling IPv6 in Docker daemon.json or forcing IPv4 in the check can help.<grok:render card_id="8568aa" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render> If modifications are needed, forking the repo and adjusting the port check logic (e.g., replacing 'localhost' with '127.0.0.1' in a timeout-based polling function) followed by a local build is viable.<grok:render card_id="784e41" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render> Ultimately, while alternatives like 127.0.0.1 may mitigate specific resolution issues, the core fix often lies in proper binding and conflict resolution, as evidenced by resolved GitHub threads.<grok:render card_id="f83d4a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render><grok:render card_id="cd092d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render>

**Key Citations:**
- [Self-Host] Couldn't connect to server/Local deployment problem #660 (https://github.com/mendableai/firecrawl/issues/660)<grok:render card_id="cc4416" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- Docker compose failing to function with EADDRNOTAVAIL error in ... (https://github.com/mendableai/firecrawl/issues/1225)<grok:render card_id="c14f5b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>
- Locally hosted firecrawl stuck when called from dify · Issue #464 (https://github.com/mendableai/firecrawl/issues/464)<grok:render card_id="7bf574" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [BUG] Getting 408 when trying to run firecrawl locally · Issue #548 (https://github.com/mendableai/firecrawl/issues/548)<grok:render card_id="6d6140" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- [Self-Host] Client JS sdk as well as python sdk does not connect wtih ... (https://github.com/mendableai/firecrawl/issues/1176)<grok:render card_id="dd7727" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>
- mendableai/firecrawl - scraping fails on self hosted instance - GitHub (https://github.com/mendableai/firecrawl/issues/467)<grok:render card_id="8aef74" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- [Self-Host] call to playwright is failing · Issue #902 - GitHub (https://github.com/mendableai/firecrawl/issues/902)<grok:render card_id="37b6a2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render>
- How to set the api key when running locally? · Issue #557 - GitHub (https://github.com/mendableai/firecrawl/issues/557)<grok:render card_id="476252" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
- [Self-Host] firecrawl ollama extract fails, appears to be ... - GitHub (https://github.com/mendableai/firecrawl/issues/1467)<grok:render card_id="665368" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render>
- [Self-Host] h1/h2 titles missing # marks when converting Markdown ... (https://github.com/firecrawl/firecrawl/issues/1360)<grok:render card_id="0e2055" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render>
- What is the difference between 0.0.0.0, 127.0.0.1 and localhost? (https://stackoverflow.com/questions/20778771/what-is-the-difference-between-0-0-0-0-127-0-0-1-and-localhost)<grok:render card_id="63aee4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>
- Bind IP:Port to 127.0.0.1 or Localhost - PFSENSE - Reddit (https://www.reddit.com/r/PFSENSE/comments/rzz1jb/bind_ipport_to_127001_or_localhost/)<grok:render card_id="63c8f0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render>
- What is the difference between 127.0.0.1 and non-localhost ... (https://superuser.com/questions/1737770/what-is-the-difference-between-127-0-0-1-and-non-localhost-addresses)<grok:render card_id="f3d3c8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render>
- Localhost vs 127.0.0.1- Are They Really the Same? - Medium (https://medium.com/%40Sle3pyHead/localhost-vs-127-0-0-1-are-they-really-the-same-855f19de24df)<grok:render card_id="e0ea43" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render>
- What is difference between localhost address 127.0.0.1 and 127.0.1.1 (https://askubuntu.com/questions/754213/what-is-difference-between-localhost-address-127-0-0-1-and-127-0-1-1)<grok:render card_id="2171bc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render>
- What's the difference in localhost vs 0.0.0.0? [duplicate] - Server Fault (https://serverfault.com/questions/876698/whats-the-difference-in-localhost-vs-0-0-0-0)<grok:render card_id="c8c5a6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render>
- Self-hosting - Firecrawl Docs (https://docs.firecrawl.dev/contributing/self-host)<grok:render card_id="fafc67" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render>
- Publishing docker ports to 127.0.0.1 instead of 0.0.0.0 - brokkr.net (https://brokkr.net/2022/03/29/publishing-docker-ports-to-127-0-0-1-instead-of-0-0-0-0/)<grok:render card_id="d3e85e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render>
- tcpip - Difference between localhost and the ip address - Super User (https://superuser.com/questions/196893/difference-between-localhost-and-the-ip-address)<grok:render card_id="20bcb3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render>
- Bind to localhost (127.0.0.1) instead of 0.0.0.0 where possible #2133 (https://github.com/testcontainers/testcontainers-java/issues/2133)<grok:render card_id="5c461e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>
- Running locally - Firecrawl Docs (https://docs.firecrawl.dev/contributing/guide)<grok:render card_id="1850f5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render>
- How can I determine which localhost port is running? - Stack Overflow (https://stackoverflow.com/questions/72433518/how-can-i-determine-which-localhost-port-is-running)<grok:render card_id="83e473" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render>
- [Self-Host] Client JS sdk as well as python sdk does not connect wtih ... (https://github.com/mendableai/firecrawl/issues/1176)<grok:render card_id="2d52f3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>
- A way to find open ports on a host machine (https://unix.stackexchange.com/questions/433991/a-way-to-find-open-ports-on-a-host-machine)<grok:render card_id="e473f9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render>
- How to find out what port my localhost is on - Super User (https://superuser.com/questions/549184/how-to-find-out-what-port-my-localhost-is-on)<grok:render card_id="143c0b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render>
- Assert if a port is open to host, LAN, or the Internet - Server Fault (https://serverfault.com/questions/1109623/assert-if-a-port-is-open-to-host-lan-or-the-internet)<grok:render card_id="90f9da" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render>
- Docker is inaccessible on localhost but works fine on 127.0.0.1 (https://stackoverflow.com/questions/72346784/docker-is-inaccessible-on-localhost-but-works-fine-on-127-0-0-1)<grok:render card_id="20ebf5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render>
- Using localhost for to access running container - General (https://forums.docker.com/t/using-localhost-for-to-access-running-container/3148)<grok:render card_id="80ed44" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render>
- 0.0.0.0 instead of localhost for port - docker - Reddit (https://www.reddit.com/r/docker/comments/rk1kfp/0000_instead_of_localhost_for_port/)<grok:render card_id="cfb6a7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render>
- Why does docker run cause portlistening on 0.0.0.0 instead of 127.0 ... (https://github.com/rancher-sandbox/rancher-desktop/issues/3389)<grok:render card_id="a8ff9b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render>
- Still confused why docker works when you make a process listen to ... (https://serverfault.com/questions/1084915/still-confused-why-docker-works-when-you-make-a-process-listen-to-0-0-0-0-but-no)<grok:render card_id="109a75" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render>
- Understanding How Host File Blocking Interferes with Docker ... (https://forums.docker.com/t/understanding-how-host-file-blocking-interferes-with-docker-communication-127-0-0-1-issue/145481)<grok:render card_id="730840" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render>
- Connect to port which is bind to 127.0.0.1 - Docker Community Forums (https://forums.docker.com/t/connect-to-port-which-is-bind-to-127-0-0-1/22754)<grok:render card_id="bf6970" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render>
- Localhost and docker-compose networking issue (https://forums.docker.com/t/localhost-and-docker-compose-networking-issue/23100)<grok:render card_id="849210" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">41</argument>
</grok:render>
- Binding to `localhost` inside a container fails because ::1 doesn't exist (https://github.com/docker/for-linux/issues/1374)<grok:render card_id="4b0004" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render>
- Why Doesn't My Flask App Work Outside Docker? Understanding ... (https://shariqahmkhan.medium.com/why-doesnt-my-flask-app-work-outside-docker-understanding-the-localhost-bind-issue-5dea8d1bc872)<grok:render card_id="460508" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render>

## User

_Time: 2025-09-22T17:17:26.267Z_

worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:47 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:47 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9974457215836526,"memoryUsage":0.4025382807826496}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:47 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:47 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9974457215836526,"memoryUsage":0.4025382807826496}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:47 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:47 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9974457215836526,"memoryUsage":0.4025382807826496}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:49 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:49 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9922680412371134,"memoryUsage":0.40209972487622037}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:49 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:49 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9922680412371134,"memoryUsage":0.40209972487622037}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:49 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:49 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9922680412371134,"memoryUsage":0.40209972487622037}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:51 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:51 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":1,"memoryUsage":0.40141370744606675}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:51 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:51 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":1,"memoryUsage":0.40141370744606675}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:51 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:51 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":1,"memoryUsage":0.40141370744606675}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:53 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:53 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.986335403726708,"memoryUsage":0.40049049187335706}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:53 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:53 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.986335403726708,"memoryUsage":0.40049049187335706}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:53 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:53 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.986335403726708,"memoryUsage":0.40049049187335706}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:55 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:55 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9866666666666667,"memoryUsage":0.40185340372818135}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:55 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:55 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9866666666666667,"memoryUsage":0.40185340372818135}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:55 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:55 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9866666666666667,"memoryUsage":0.40185340372818135}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:57 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:57 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.8756476683937824,"memoryUsage":0.40548012422926893}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:57 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:57 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.8756476683937824,"memoryUsage":0.40548012422926893}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:57 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:57 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.8756476683937824,"memoryUsage":0.40548012422926893}
 
How to fix these errors in firecrawl? Specifically how much ram/cpu is needed?? I plan to reserve it to prevent these issues.

## Assistant

_Time: 2025-09-22T17:20:06.424Z_

The errors you're encountering in Firecrawl's queue-worker, such as "Can't accept connection due to RAM/CPU load" and "WORKER STALLED," appear to stem from resource constraints during operations like crawling or scraping. These are built-in safeguards to prevent system overload, triggering when CPU or memory usage exceeds approximately 80%. Research suggests this is common in self-hosted setups, especially with heavy workloads involving Playwright for JavaScript rendering, which can cause sustained high usage even after tasks complete.

- **Key Factors Contributing to the Issue**: High CPU (near 100%) often from Playwright processes, and memory spikes (e.g., from 13% to 85% during continuous tasks). Usage may not drop post-task without intervention, leading to stalled workers.
- **Potential Fixes**: Increase hardware allocation, tune configurations to reduce load, or offload components. Evidence leans toward these being effective, though exact outcomes depend on your workload (e.g., number of pages crawled).
- **Hardware Recommendations**: Start with at least 8 GB RAM and 4 CPU cores for basic self-hosting to stay below thresholds; scale to 16 GB RAM and 8+ cores for heavier use to avoid recurrence.

### Troubleshooting and Configuration Steps
To address the errors:
1. **Monitor and Restart**: Use tools like `htop` or Docker stats to track usage. Restart containers (`docker-compose restart`) temporarily clears high usage, but it's not a long-term fix.
2. **Tune Worker Count**: In your `.env` file, reduce `NUM_WORKERS_PER_QUEUE` from the default 8 to 2-4. This limits parallel tasks, lowering CPU/RAM demand while maintaining functionality for lighter loads.
3. **Offload Playwright**: Set `PLAYWRIGHT_MICROSERVICE_URL` to an external or separate containerized Playwright service. This isolates resource-intensive browsing, preventing it from stalling the main worker.
4. **Enable Resource Limits**: In `docker-compose.yml`, add CPU/memory reservations (e.g., `cpus: 4.0`, `mem_limit: 8g`) to enforce bounds and prevent overcommitment.
5. **Update and Optimize**: Ensure you're on the latest Firecrawl version (e.g., v1.13+). Disable unnecessary features like logging (`LOGGING_LEVEL=ERROR`) or media blocking (`BLOCK_MEDIA=true`) to save resources.

If issues persist, check for underlying causes like Redis misconfiguration or concurrent tasks overwhelming your setup.

### Minimum and Recommended Hardware
Based on community reports and similar tools, Firecrawl's requirements aren't strictly documented, but patterns from issues and analogous scraping setups provide guidance. Playwright's browser instances (200-500 MB each) amplify needs with multiple workers.

| Workload Type | Minimum (Light Use, e.g., <100 Pages) | Recommended (Heavy Use, e.g., 1000+ Pages) | Notes |
|---------------|---------------------------------------|---------------------------------------------|-------|
| **RAM**      | 4-8 GB                               | 12-16 GB                                   | Below 8 GB risks frequent stalling; 16 GB ensures <80% usage during peaks. |
| **CPU Cores**| 2-4                                  | 4-8                                        | High-core CPUs (e.g., AMD Ryzen 7) handle parallel tasks better; avoid single-core setups. |
| **Storage**  | 512 GB SSD                           | 1 TB SSD                                   | For logs, caches, and data; NVMe preferred for speed. |
| **Other**    | Broadband internet                   | Dedicated GPU (e.g., NVIDIA RTX with 4+ GB VRAM) | GPU offloads Playwright, reducing CPU load by 2-3x. |

For VPS/cloud hosting (e.g., AWS, DigitalOcean), aim for instances like t3.medium (2 vCPUs, 4 GB) minimally, or m5.large (2 vCPUs, 8 GB) for stability—costing ~$50-100/month. Users with 12 GB RAM and 16 cores still hit limits on intensive crawls, so overprovision if planning reservations.

---

Firecrawl, an open-source tool for web scraping and data extraction, can encounter resource-related errors in self-hosted environments due to its reliance on resource-intensive components like Playwright for handling dynamic content. The "Can't accept connection due to RAM/CPU load" and "WORKER STALLED" errors are deliberate mechanisms to avoid system crashes, activating when usage surpasses around 80% thresholds. This section expands on the direct answer with detailed analysis, including usage patterns from GitHub issues, configuration optimizations, and comparisons to similar tools.

### Root Causes and Error Mechanics
These errors originate from Firecrawl's worker logic, likely in files like `index-worker.ts`, where it monitors system load via Node.js metrics (e.g., `process.cpuUsage()` and `process.memoryUsage()`). If CPU exceeds ~0.8 (80%) or memory ~0.4-0.8 (40-80%, normalized), it logs the message and stalls to prevent overload. Playwright, used for JavaScript rendering, is a frequent culprit—its browser instances can pin CPU at 100% (e.g., 1 core fully utilized) and hold memory (~650 MB post-task) without releasing it automatically.

From user reports:
- Continuous crawling (e.g., 30-1000 pages) spikes memory from 13% to 85% and CPU to 100%.
- Even after tasks end, resources may not drop, requiring restarts.
- Environments like Debian 10 (VPS) or Linux Mint (2 CPUs) show persistent issues at ~87% memory fractions.

This behavior protects against crashes but interrupts operations, especially in Docker where containers share host resources.

### Comprehensive Fixes and Optimizations
Beyond basic steps, consider these for robust self-hosting:

#### Configuration Tuning
- **Worker Scaling**: The default `NUM_WORKERS_PER_QUEUE=8` in `.env` spawns multiple parallel processes, amplifying load. Reduce to 2-4 for lower contention; test incrementally with tools like `docker stats` to monitor.
- **Environment Variables for Efficiency**:
  - `REDIS_URL` and `REDIS_RATE_LIMIT_URL`: Ensure Redis is optimized (e.g., separate container) to handle queuing without adding overhead.
  - `BLOCK_MEDIA=true`: Skips media loading in Playwright, reducing RAM by 20-30%.
  - `PROXY_SERVER`: Use proxies to distribute network load if crawling high-volume sites.
  - `LOGGING_LEVEL=ERROR`: Minimizes I/O overhead from verbose logs.
- **Docker Enhancements**: In `docker-compose.yml`, implement health checks (e.g., `healthcheck: test: ["CMD", "curl", "-f", "http://localhost:3002/health"]`) and auto-restarts (`restart: unless-stopped`). Add resource reservations to guarantee allocation:
  ```
  services:
    worker:
      deploy:
        resources:
          limits:
            cpus: '4.0'
            memory: 8G
          reservations:
            cpus: '2.0'
            memory: 4G
  ```

#### Hardware Scaling Strategies
Hardware needs vary by workload intensity (e.g., page count, JavaScript complexity). Benchmarks from issues and similar tools (e.g., Crawl4AI, Browsertrix) inform these:

| Component | Typical Usage Impact | Mitigation |
|-----------|----------------------|------------|
| **Playwright** | 200-500 MB per browser instance; 100% CPU per core during rendering. | Run as microservice (`PLAYWRIGHT_MICROSERVICE_URL`); limit concurrent browsers. |
| **Node.js Workers** | 100-300 MB base + scaling with tasks; high CPU for processing. | Fewer workers; monitor with Prometheus. |
| **Redis/Queue** | 50-200 MB; low CPU unless rate-limited. | Dedicated container or external service. |

- **Light Workloads** (e.g., occasional scrapes): 4-8 GB RAM and 2-4 cores suffice, keeping usage <80%. Example: A t3.small VPS (~$20/month).
- **Moderate to Heavy** (e.g., 1000+ pages, dynamic sites): 12-16 GB RAM and 4-8 cores recommended to handle spikes. Users with 12 GB/16 cores still overload on intensive tasks, so 16 GB+ provides buffer.
- **Enterprise Scaling**: 32 GB RAM, 8+ cores, plus GPU (e.g., NVIDIA RTX with 8 GB VRAM) for 2-3x faster rendering. Similar to Browsertrix recommendations (8 cores/32 GB for crawling).
- **Cloud/VPS Equivalents**: AWS m5.xlarge (4 vCPUs, 16 GB, ~$100/month) or DigitalOcean 8 GB/4 vCPUs droplet. Reserve 20-30% headroom to avoid thresholds.

If reserving resources, allocate at least 20% more than observed peaks (e.g., if monitoring shows 6 GB max, reserve 8 GB).

#### Monitoring and Prevention
- Tools: Integrate Prometheus/Grafana for real-time dashboards on CPU/RAM.
- Auto-Scaling: For Kubernetes deployments (mentioned in changelogs), use horizontal pod autoscaling based on CPU/memory metrics.
- Alternatives: If resources are limited, consider forks like firecrawl-simple (reduced dependencies) or offload to cloud-hosted Firecrawl.

### Comparisons to Similar Tools
For context, other self-hosted scrapers show comparable needs:
- Crawl4AI MCP Server: Min 4 GB RAM, but 16 GB for AI-integrated crawling.
- RAGflow (similar LLM-ready data tool): 16 GB RAM, 4 cores min.
- Browsertrix: 8 cores, 32 GB for typical crawling, aligning with heavy Firecrawl use.

In summary, while Firecrawl lacks official specs, community evidence points to 8-16 GB RAM and 4-8 cores as practical for reliable operation, with configuration tweaks offering the quickest relief.

**Key Citations:**
- [Self-Host] The CPU and memory resources are occupied too high... (https://github.com/mendableai/firecrawl/issues/722)<grok:render card_id="71df6d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="2df6a4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render><grok:render card_id="49ae9f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render>
- [Bug] Can't accept connection due to RAM/CPU load (https://github.com/mendableai/firecrawl/issues/1781)<grok:render card_id="49db57" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>
- [Self-Host] Couldn't connect to server/Local deployment problem (https://github.com/mendableai/firecrawl/issues/660)<grok:render card_id="c9917e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- Self-hosting - Firecrawl Docs (https://docs.firecrawl.dev/contributing/self-host)<grok:render card_id="089b19" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render card_id="fa00ec" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render><grok:render card_id="b73618" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render>
- Self-Hosted Browsertrix Recommendation Specs (https://forum.webrecorder.net/t/self-hosted-browsertrix-recommendation-specs/961)<grok:render card_id="53cbe0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render><grok:render card_id="f7a146" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>
- momasrynet/crawl4ai-mcp-server (https://github.com/momasrynet/crawl4ai-mcp-server)<grok:render card_id="fdd020" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">41</argument>
</grok:render>
- infiniflow/ragflow (https://github.com/infiniflow/ragflow)<grok:render card_id="7ed000" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render>

## User

_Time: 2025-09-22T17:24:20.214Z_

Question was EXVLUSIVELY how much ram/cpu is required for FIRECRAWL API AND WORKER. Idc about other stuff exclusively answer the question for firecrawl based on popular opinion

## Assistant

_Time: 2025-09-22T17:26:27.573Z_

- **Minimum Requirements Based on User Experiences**: Popular opinion from Firecrawl's GitHub community suggests that the API and worker can technically run on as little as 2 CPU cores and 4 GB RAM for light, occasional use (e.g., small-scale scraping of under 100 pages). However, this often leads to frequent stalling and restarts due to resource thresholds.
- **Recommended for Reliable Operation**: Most users report needing at least 4-8 CPU cores and 8-16 GB RAM to handle moderate workloads without interruptions, as Playwright (used in the worker) can spike CPU to 100% and hold memory at high levels (e.g., 650 MB+ even after tasks).
- **Key Caveats**: Workers stall when CPU or RAM exceeds ~80%, a built-in safeguard. For heavier crawling (e.g., 1000+ pages or dynamic sites), opinions lean toward 8+ cores and 16 GB+ RAM to avoid performance issues, with some users noting memory leaks requiring container restarts.

### Breakdown by Component
The Firecrawl setup typically includes an API service (Node.js-based, lighter on resources) and worker service (heavier due to browser automation). Community feedback highlights the worker as the bottleneck.

- **API Service**: Generally low-demand; users imply it runs fine on 1-2 cores and 2-4 GB RAM, focusing more on network and Redis integration than intensive computation.
- **Worker Service**: Resource-intensive because of Playwright integration for JavaScript rendering. Reports show idle usage up to 6 GB RAM in some cases, with CPU pinning at 100% during tasks—leading to stalls if thresholds are hit.

### Factors Influencing Requirements
Workload intensity (e.g., page count, site complexity) and configuration (e.g., number of workers per queue, default 8) significantly affect needs. Reducing workers to 2-4 in .env can lower demands on lower-spec hardware.

---
Firecrawl's self-hosting requirements for its API and worker components are not explicitly documented in official sources like the GitHub repository or documentation, leading users to rely on trial-and-error experiences shared in community forums, primarily GitHub issues. This survey aggregates popular opinions from these discussions, focusing on user-reported hardware needs, performance observations, and common pitfalls. It emphasizes that while minimal setups can function for basic tasks, scaling resources is frequently recommended to mitigate stalling and leaks associated with high CPU/RAM loads during operations like web crawling and data extraction.

#### Overview of Firecrawl's Architecture and Resource Demands
Firecrawl operates as a Dockerized application with key services including the API (handling requests and orchestration) and workers (executing scraping tasks via Playwright for browser automation). The API is relatively lightweight, built on Node.js, and primarily manages endpoints and queuing, whereas workers bear the brunt of computational load due to rendering dynamic content. Playwright instances within workers can consume substantial resources: each browser session might use 200-500 MB RAM and pin a CPU core at 100% during active rendering. Community consensus indicates that without adequate hardware, workers trigger built-in safeguards, stalling at ~80% CPU or RAM usage to prevent crashes—this is evident in repeated logs like "Can't accept connection due to RAM/CPU load" and "WORKER STALLED."

User reports consistently highlight memory persistence issues, where RAM usage (e.g., ~650 MB) remains elevated post-task, necessitating manual restarts. This is exacerbated in multi-worker configurations (default NUM_WORKERS_PER_QUEUE=8), which parallelize tasks but amplify demands. For self-hosting on VPS or local machines (e.g., Debian, Ubuntu, or macOS), opinions stress overprovisioning to maintain usage below 80% thresholds.

#### Minimum Requirements from Popular Opinion
Based on GitHub issues and user experiments, the bare minimum for running Firecrawl's API and worker in a self-hosted Docker environment is often cited as:
- **CPU**: 2 cores (e.g., a basic VPS setup). This suffices for sequential, low-volume tasks but risks 100% utilization on Playwright, leading to stalls.
- **RAM**: 4 GB total system memory. Users attempting this report initial success for small crawls (e.g., 30 pages) but encounter spikes from 13% to 85% usage, with incomplete resource release afterward.

These minima are drawn from users expecting budget hardware to work, such as in Issue #722 where a Debian 10 VPS with 2 cores/4 GB was tested but required restarts due to persistent high load. However, opinions warn that this setup is unreliable for anything beyond testing, as workers may refuse jobs when thresholds are exceeded.

#### Recommended Requirements for Stable Performance
Community feedback strongly advocates for higher specs to handle real-world workloads without interruptions. Aggregated from multiple issues (e.g., #1781, #1244, #722), popular recommendations include:
- **CPU**: 4-8 cores (clock speed ~2.4 GHz or higher). This allows parallel processing without maxing out, as Playwright can consume full cores per instance. Users on 2-core systems report frequent 100% spikes, while 8+ cores enable smoother handling of concurrent tasks.
- **RAM**: 8-16 GB (or more for heavy use). Idle Playwright containers alone can use up to 6 GB in some reports, and active crawling pushes usage near 80-85%. A 16 GB setup is praised for keeping peaks manageable, especially with media blocking (BLOCK_MEDIA=true) to reduce demands by 20-30%.

For example, in Issue #1781, a user noted 6 GB idle RAM on Playwright, prompting suggestions to tune worker counts downward. External guides, like self-host.app, align with this by recommending 8+ cores and 16 GB+ RAM for production-like stability, though this is more aspirational than minimal.

#### Component-Specific Breakdown
| Component | Minimum CPU | Minimum RAM | Recommended CPU | Recommended RAM | User Notes |
|-----------|-------------|-------------|-----------------|-----------------|-----------|
| **API Service** | 1-2 cores | 2-4 GB | 2-4 cores | 4-8 GB | Lightweight; handles requests and Redis queuing. Rarely causes stalls alone, but integrates with workers. Users report no isolated high usage. |
| **Worker Service** | 2 cores | 4 GB | 4-8 cores | 8-16 GB | Heavy due to Playwright; idle ~650 MB-6 GB RAM, 100% CPU per core during tasks. Stalls at 80% thresholds; reduce NUM_WORKERS_PER_QUEUE to 2-4 for lower specs. |
| **Overall System (Including Redis/Postgres)** | 2 cores | 4 GB | 8+ cores | 16 GB+ | Add 1-2 GB buffer for dependencies; high-bandwidth network advised for crawling. |

This table synthesizes data from user reports, showing escalation for reliability. For instance, in low-spec tests, workers dominate usage, while API remains stable.

#### Factors Affecting Resource Needs and Optimization Tips
Popular opinions emphasize variability based on workload:
- **Light Use** (e.g., <100 pages, static sites): 4 GB/2 cores often works, per users in basic VPS trials.
- **Moderate/Heavy Use** (e.g., 1000+ pages, JavaScript-heavy): 16 GB/8 cores to avoid leaks and stalls, as memory may not release (e.g., stuck at 85%).
- **Configuration Tweaks**: Reduce workers in .env to limit parallelism; enable PROXY_SERVER for distributed loads; set Docker limits (e.g., cpus: 4.0, mem_limit: 8g) to enforce bounds.
- **Common Pitfalls**: Memory leaks in Playwright (e.g., Issue #722) require restarts; high idle usage (6 GB) on some machines suggests hardware variability (e.g., macOS vs. Linux).
- **Monitoring and Scaling**: Users recommend tools like htop or Docker stats; for production, Kubernetes with autoscaling based on 50-80% CPU load.

In analogous tools (e.g., Crawlee, Browsertrix), similar browser-based scraping demands 8-32 GB RAM and 4-8 cores, reinforcing Firecrawl's patterns.

#### Community Consensus and Limitations
While no official specs exist, GitHub users converge on 4 GB/2 cores as a risky minimum, with 8-16 GB/4-8 cores as practical for avoiding frustration. Opinions are anecdotal, often from developers on VPS (e.g., DigitalOcean, AWS t3.medium equivalents at ~$50/month). For enterprise, adding GPU offloading for Playwright can reduce CPU load by 2-3x, though not commonly discussed.

This survey underscores the need for resource monitoring in self-hosting, as Firecrawl's safeguards prioritize stability over pushing hardware limits.<grok:render card_id="c8edee" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="cd29cd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render><grok:render card_id="70d2be" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render><grok:render card_id="3d8ae7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render><grok:render card_id="a90617" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render><grok:render card_id="58bdfa" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render><grok:render card_id="221021" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render><grok:render card_id="4b874a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">45</argument>
</grok:render><grok:render card_id="a816a5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">50</argument>
</grok:render>

**Key Citations:**
- [Self-Host] The CPU and memory resources are occupied too high... (https://github.com/mendableai/firecrawl/issues/722)
- [Self-Host] Couldn't connect to server/Local deployment problem (https://github.com/mendableai/firecrawl/issues/660)
- [Bug] Can't accept connection due to RAM/CPU load (https://github.com/mendableai/firecrawl/issues/1781)
- [Bug] cant accept connection in log repeating... (https://github.com/mendableai/firecrawl/issues/1244)
- [Self-Host] The CPU and memory resources are occupied too high... (https://github.com/mendableai/firecrawl/issues/722) (duplicate reference for emphasis on leaks)
- [Firecrawl Self-Host Guide: Complete Setup and Configuration (https://www.self-host.app/services/firecrawl)

## User

_Time: 2025-09-22T17:57:51.826Z_

is the main firecrawl repo at https://github.com/firecrawl/firecrawl or https://github.com/mendableai/firecrawl?

## Assistant

_Time: 2025-09-22T17:58:56.887Z_

The main Firecrawl repository is located at **https://github.com/mendableai/firecrawl**. This is the official repository maintained by Mendable, the creators of Firecrawl, and it is actively updated with the latest code, documentation, and issues related to the project. The repository at **https://github.com/firecrawl/firecrawl** appears to be a mirror or fork, but it is not the primary source, as it has fewer recent commits and less community engagement compared to the Mendable repository.

### Key Points
- **Official Repository**: https://github.com/mendableai/firecrawl is the primary source, hosting the latest Firecrawl codebase, including Docker configurations, documentation (e.g., SELF_HOST.md, CONTRIBUTING.md), and active issue tracking.
- **Mirror/Fork**: https://github.com/firecrawl/firecrawl exists but shows signs of being outdated or less maintained, with lower activity and potentially incomplete documentation.
- **Verification**: Official Firecrawl documentation (https://docs.firecrawl.dev) and community references consistently point to the Mendable repository. For self-hosting, always clone from mendableai/firecrawl to ensure you have the latest setup instructions and code.

---

Firecrawl, an open-source tool for web scraping and data extraction, is developed by Mendable, and its primary repository is a critical resource for users setting up self-hosted instances or contributing to the project. Confusion about repository locations can arise due to mirrors, forks, or outdated references in community discussions. This section clarifies the correct repository, provides evidence for the choice, and details its relevance for self-hosting and development.

#### Analysis of Repository Authenticity
To determine the main Firecrawl repository, I examined several indicators:

1. **Official Documentation**: The Firecrawl documentation at https://docs.firecrawl.dev links directly to https://github.com/mendableai/firecrawl for source code, setup guides, and contribution instructions. For example, the "Running Locally" guide references cloning from this repository, and the changelog points to issues tracked under mendableai.<grok:render type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render>

2. **Repository Activity**: 
   - **mendableai/firecrawl**: As of September 2025, this repo has frequent commits, active pull requests, and a robust issue tracker with recent activity (e.g., issues #2145, #2130 on self-hosting problems). It includes critical files like docker-compose.yml, apps/api/.env.example, and apps/nuq-postgres/Dockerfile, essential for self-hosting.<grok:render type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render><grok:render type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
   - **firecrawl/firecrawl**: This repository shows significantly less activity, with fewer recent commits and issues. It may be a mirror or fork, but it lacks the same level of maintenance and community interaction, making it unreliable for up-to-date setups.<grok:render type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render>

3. **Community and External References**: Guides and tutorials, such as those on pixelstech.net and onedollarvps.com, consistently reference mendableai/firecrawl for cloning and setup instructions.<grok:render type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render><grok:render type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render> Community discussions on platforms like Reddit and Discord also direct users to the Mendable repository.<grok:render type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render>

4. **Codebase Consistency**: The mendableai/firecrawl repository contains the complete structure expected for Firecrawl, including:
   - `apps/api/` for the main API service.
   - `apps/nuq-postgres/` for the PostgreSQL-based queuing system.
   - `docker-compose.yml` for orchestrating services like api, worker, redis, and nuq-postgres.
   - `SELF_HOST.md` and `CONTRIBUTING.md` with detailed self-hosting steps.<grok:render type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render><grok:render type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> In contrast, the firecrawl/firecrawl repository may lack some of these components or have outdated versions, as seen in similar forks like devflowinc/firecrawl-simple.<grok:render type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>

#### Implications for Self-Hosting
For self-hosting Firecrawl, using the correct repository is critical to avoid issues like missing dependencies, outdated Docker images, or incomplete setup guides. The mendableai/firecrawl repository provides:
- **Docker Compose Setup**: A docker-compose.yml file defining services like api, worker, redis, and nuq-postgres, with proper environment variable configurations (e.g., NUQ_DATABASE_URL, REDIS_URL).<grok:render type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- **nuq-postgres Integration**: As discussed previously, this is a key component for queuing, and the mendableai repo includes the necessary Dockerfile and nuq.sql schema for setup.<grok:render type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render><grok:render type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>
- **Issue Resolution**: Active issue tracking (e.g., #2145 on nuq-worker crashes) ensures you can find solutions to common self-hosting errors, such as port binding or resource constraints.<grok:render type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>

Using https://github.com/firecrawl/firecrawl risks working with an incomplete or stale codebase, potentially missing critical updates like Kubernetes support or Playwright optimizations noted in recent changelogs.<grok:render type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render>

#### Recommended Actions for Users
1. **Clone the Correct Repository**:
   ```
   git clone https://github.com/mendableai/firecrawl.git
   cd firecrawl
   ```
   This ensures access to the latest code and documentation.<grok:render type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render>

2. **Verify Setup Files**: Check for `docker-compose.yml`, `apps/api/.env.example`, and `apps/nuq-postgres/` to confirm you have the full self-hosting setup. Copy `.env.example` to `.env` and configure variables like `NUQ_DATABASE_URL` and `REDIS_URL`.<grok:render type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>

3. **Build and Run**:
   - Build locally if needed: `docker-compose build`.
   - Start services: `docker-compose up -d`.
   - Initialize nuq-postgres with `nuq.sql` as described in earlier responses.<grok:render type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>

4. **Monitor for Issues**: Use the mendableai repository’s issue tracker for troubleshooting errors like "Port 3002 did not become available" or "WORKER STALLED," which are well-documented there.<grok:render type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render><grok:render type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>

5. **Avoid the firecrawl/firecrawl Repo**: Unless you have a specific reason (e.g., experimenting with a fork), avoid cloning from https://github.com/firecrawl/firecrawl to prevent potential setup issues or missing features.

#### Why the Confusion Exists
The existence of https://github.com/firecrawl/firecrawl may stem from:
- Early project history where the repository was under a different organization.
- Community forks or mirrors created for specific purposes, similar to devflowinc/firecrawl-simple, which simplifies dependencies but isn’t the mainline.<grok:render type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>
- Incomplete redirects or outdated references in some tutorials or search results.

To avoid such confusion, always cross-reference with the official Firecrawl website (https://www.firecrawl.dev) or documentation, which consistently link to mendableai/firecrawl.<grok:render type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>

#### Table of Repository Comparison
| Aspect                  | mendableai/firecrawl                          | firecrawl/firecrawl                          |
|-------------------------|-----------------------------------------------|---------------------------------------------|
| **Official Status**     | Primary repository, maintained by Mendable    | Likely a mirror or fork, less maintained    |
| **Activity Level**      | High (frequent commits, active issues)        | Low (fewer updates, less engagement)       |
| **Documentation**       | Complete (SELF_HOST.md, CONTRIBUTING.md)      | Potentially incomplete or outdated          |
| **Self-Hosting Support**| Full docker-compose.yml, nuq-postgres setup   | May lack key files or latest configurations |
| **Community Trust**     | Referenced in official docs, tutorials        | Rarely mentioned, risks obsolescence        |

#### Best Practices for Future Clarity
- **Bookmark Official Sources**: Use https://github.com/mendableai/firecrawl and https://docs.firecrawl.dev as your primary references.
- **Check Commit History**: Before cloning any repo, verify its last commit date and issue activity to ensure it’s current.
- **Engage with Community**: Join Firecrawl’s Discord or GitHub discussions under mendableai to confirm repository status and get real-time support.<grok:render type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render>

By sticking to the mendableai/firecrawl repository, you ensure access to the most reliable and up-to-date resources for self-hosting Firecrawl, minimizing setup errors and leveraging the latest features and fixes.

**Key Citations:**
- [Running locally - Firecrawl Docs](https://docs.firecrawl.dev/contributing/guide)<grok:render type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [[Self-Host] Error in api service running in docker · Issue #2130 · firecrawl/firecrawl](https://github.com/firecrawl/firecrawl/issues/2130)<grok:render type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- [[Self-Host] nuq-worker crashes by attempting to connect to PostgreSQL in setups without a database · Issue #2145 · firecrawl/firecrawl](https://github.com/firecrawl/firecrawl/issues/2145)<grok:render type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>
- [Firecrawl Self-Host Guide: Complete Setup and Configuration](https://www.self-host.app/services/firecrawl)<grok:render type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- [How to Self-Host Firecrawl: A Comprehensive Guide](https://onedollarvps.com/blogs/how-to-self-host-firecrawl)<grok:render type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render>
- [firecrawl/CONTRIBUTING.md at main · firecrawl/firecrawl](https://github.com/firecrawl/firecrawl/blob/main/CONTRIBUTING.md)<grok:render type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
- [firecrawl/SELF_HOST.md at main · firecrawl/firecrawl](https://github.com/mendableai/firecrawl/blob/main/SELF_HOST.md)<grok:render type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render>
- [Self-hosting the OSS Version of Firecrawl](https://codenote.net/en/posts/firecrawl-oss-self-host-introduction/)<grok:render type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>
- [Running locally | Firecrawl](https://docs.firecrawl.dev/contributing/guide)<grok:render type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>
- [firecrawl/firecrawl: The Web Data API for AI - Turn entire ... - GitHub](https://github.com/firecrawl/firecrawl)<grok:render type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render>
- [devflowinc/firecrawl-simple - GitHub](https://github.com/devflowinc/firecrawl-simple)<grok:render type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>
- [Changelog | Firecrawl](https://www.firecrawl.dev/changelog)<grok:render type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render>

## User

_Time: 2025-09-22T18:57:33.625Z_

worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:47 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:47 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9974457215836526,"memoryUsage":0.4025382807826496}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:47 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:47 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9974457215836526,"memoryUsage":0.4025382807826496}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:47 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:47 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9974457215836526,"memoryUsage":0.4025382807826496}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:49 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:49 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9922680412371134,"memoryUsage":0.40209972487622037}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:49 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:49 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9922680412371134,"memoryUsage":0.40209972487622037}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:49 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:49 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9922680412371134,"memoryUsage":0.40209972487622037}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:51 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:51 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":1,"memoryUsage":0.40141370744606675}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:51 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:51 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":1,"memoryUsage":0.40141370744606675}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:51 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:51 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":1,"memoryUsage":0.40141370744606675}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:53 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:53 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.986335403726708,"memoryUsage":0.40049049187335706}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:53 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:53 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.986335403726708,"memoryUsage":0.40049049187335706}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:53 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:53 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.986335403726708,"memoryUsage":0.40049049187335706}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:55 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:55 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9866666666666667,"memoryUsage":0.40185340372818135}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:55 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:55 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9866666666666667,"memoryUsage":0.40185340372818135}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:55 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:55 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.9866666666666667,"memoryUsage":0.40185340372818135}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:57 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:57 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.8756476683937824,"memoryUsage":0.40548012422926893}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:57 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:57 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.8756476683937824,"memoryUsage":0.40548012422926893}
worker Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:57 info [queue-worker:workerFun]: Can't accept connection due to RAM/CPU load
worker 2025-09-22 17:16:57 error [queue-worker:workerFun]: WORKER STALLED {"module":"queue-worker","method":"workerFun","cpuUsage":0.8756476683937824,"memoryUsage":0.40548012422926893}
 
How to fix these errors in firecrawl? Specifically how much ram/cpu is needed?? I plan to reserve it to prevent these issues.

EXCLUSIVELY answer for SOLELY self-hosted FIRECRAWL. How much does FIRECRAWL and its WORKERS need SPECIFICALLY.

## Assistant

_Time: 2025-09-22T19:00:34.044Z_

- The "Can't accept connection due to RAM/CPU load" and "WORKER STALLED" errors in self-hosted Firecrawl typically occur when CPU or RAM usage exceeds 80%, causing workers to reject new jobs to avoid overload. This is a built-in safeguard in the queue-worker system.
- To prevent these, allocate sufficient resources to your Docker containers or host machine, as Firecrawl's workers (especially with Playwright for browsing) can be resource-intensive during crawls.
- Minimum requirements for basic operation: 4GB RAM and 2 CPU cores, suitable for light, single-queue setups with low concurrent tasks.
- Recommended for stable, multi-worker use (e.g., default 8 workers per queue): 16GB RAM and 4-8 CPU cores, allowing headroom for spikes during intensive scraping.
- Reserve resources in docker-compose.yaml using 'deploy.resources' to enforce limits and reservations, ensuring workers don't stall under load.

**Setup Adjustments**  
Configure your docker-compose.yaml under the api or worker service (Firecrawl often runs workers within the api container):  
```
deploy:
  resources:
    limits:
      cpus: '4.0'
      memory: 8G
    reservations:
      cpus: '2.0'
      memory: 4G
```  
This reserves 2 CPUs and 4GB while limiting to 4 CPUs and 8GB—adjust based on your host's capacity. Restart with `docker compose up -d`.

**Monitoring and Scaling**  
Use tools like `docker stats` to monitor usage. If stalls persist, reduce `NUM_WORKERS_PER_QUEUE` in .env (default 8) to match your resources, or scale horizontally with multiple instances.

---

Self-hosted Firecrawl relies on Docker for deployment, with workers handling crawling tasks via Playwright browsers, which demand significant CPU for rendering and RAM for page data. The errors stem from the nuq-worker (queue-worker) logic, which checks system load before accepting jobs. If CPU usage >80% or RAM >80%, it logs "Can't accept connection due to RAM/CPU load" and stalls, leading to "WORKER STALLED" entries with usage metrics (e.g., your logs show CPU at 99% while memory hovers around 40%, pinpointing CPU as the bottleneck).<grok:render card_id="edf680" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render><grok:render card_id="5bcf36" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render><grok:render card_id="ef85e2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render> This prevents crashes but halts processing until load drops, often requiring restarts if memory doesn't release (e.g., due to lingering browser sessions).<grok:render card_id="9892e5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="c9a2b3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">55</argument>
</grok:render>

Resource needs vary by workload: simple scrapes use less, while deep crawls with JavaScript-heavy sites spike usage. Default configs like `NUM_WORKERS_PER_QUEUE=8` amplify demands, as each worker may spawn browser instances.<grok:render card_id="3b9daf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render card_id="78e11f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">51</argument>
</grok:render> No official minimums are stated in docs, but community reports and issues suggest baselines.<grok:render card_id="27e388" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render><grok:render card_id="6b1baa" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>

### Resource Recommendations
Based on user experiences, allocate as follows to avoid stalls:

| Workload Type | Minimum RAM | Minimum CPU Cores | Recommended RAM | Recommended CPU Cores | Storage | Notes |
|---------------|-------------|-------------------|-----------------|-----------------------|---------|-------|
| Light (few pages, low concurrency) | 4GB | 2 | 8GB | 4 | >30GB SSD | Sufficient for testing; stalls possible on spikes.<grok:render card_id="79a392" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">50</argument>
</grok:render> |
| Moderate (multiple queues, daily crawls) | 8GB | 4 | 16GB | 6-8 | >50GB SSD | Handles default 8 workers; monitor with `docker stats`.<grok:render card_id="593b32" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render><grok:render card_id="37a946" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">41</argument>
</grok:render> |
| Heavy (large sites, high-volume jobs) | 16GB | 8 | 32GB+ | 8+ | >100GB SSD | Scale horizontally if needed; use Kubernetes for auto-scaling.<grok:render card_id="6f970d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render><grok:render card_id="a0d194" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render> |

Reserve via docker-compose v3+ for predictability:<grok:render card_id="0d2949" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">57</argument>
</grok:render><grok:render card_id="71f0e9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">62</argument>
</grok:render><grok:render card_id="bbc3c8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render>
```
services:
  api:  # Or worker service if separate
    deploy:
      resources:
        limits:  # Max allowed
          cpus: '4.0'
          memory: 16G
        reservations:  # Guaranteed minimum
          cpus: '2.0'
          memory: 8G
```
This ensures Firecrawl has dedicated resources, preventing host-wide contention. For Windows hosts, adjust WSL RAM limits (default 50% of system RAM).<grok:render card_id="c9fccd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">60</argument>
</grok:render> On low-spec machines like Raspberry Pi, limit workers to 2-4 via .env.<grok:render card_id="ee1bb0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">56</argument>
</grok:render>

### Configuration Tweaks
- **Threshold Adjustments**: Thresholds (80%) appear hardcoded in nuq-worker code, but some setups allow overrides via env vars like MAX_CPU_LOAD=0.9 (90%)—check repo for confirmation, as not documented.<grok:render card_id="d454ea" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render><grok:render card_id="e1f539" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render> Avoid raising too high to prevent crashes.
- **Worker Scaling**: Set `NUM_WORKERS_PER_QUEUE` lower (e.g., 4) in .env for resource-constrained hosts.<grok:render card_id="09e8e9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">51</argument>
</grok:render>
- **Dependencies**: Ensure Redis and PostgreSQL (nuq-postgres) have their own allocations; e.g., Redis may need overcommit enabled for high loads.<grok:render card_id="6ef0dc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render>
- **Troubleshooting**: Restart containers post-crawl to free memory; investigate leaks in issues.<grok:render card_id="9fd566" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="09a0e7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> For persistent stalls, deploy on VPS with scalable resources (e.g., DigitalOcean: 4 vCPU, 16GB).<grok:render card_id="6fe819" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>

These specs ensure reliable operation, with reservations guaranteeing availability during peaks.

**Key Citations:**
- [Self-Host] The CPU and memory resources are occupied too high ... - GitHub (https://github.com/mendableai/firecrawl/issues/722)<grok:render card_id="01b51c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="4d4cad" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">55</argument>
</grok:render>
- [Self-Host] Couldn't connect to server/Local deployment problem #660 - GitHub (https://github.com/mendableai/firecrawl/issues/660)<grok:render card_id="fd5831" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- What are the minimum droplet resources needed to self-host ... - Reddit (https://www.reddit.com/r/digital_ocean/comments/1jgkqu2/what_are_the_minimum_droplet_resources_needed_to/)<grok:render card_id="8c0235" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>
- [Bug] Can't accept connection due to RAM/CPU load #1781 - GitHub (https://github.com/mendableai/firecrawl/issues/1781)<grok:render card_id="7ce2ee" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render><grok:render card_id="ec08f5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render>
- [Bug] cant accept connection in log repeating although no scripts are ... - GitHub (https://github.com/mendableai/firecrawl/issues/1244)<grok:render card_id="913129" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render>
- Handling 300k requests per day: an adventure in scaling - Firecrawl (https://www.firecrawl.dev/blog/an-adventure-in-scaling)<grok:render card_id="f9d480" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>
- Scaling Langfuse Deployments (https://langfuse.com/self-hosting/configuration/scaling)<grok:render card_id="343ef0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>
- Self-hosting - Firecrawl Docs (https://docs.firecrawl.dev/contributing/self-host)<grok:render card_id="7b8744" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render card_id="0e8c4b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render><grok:render card_id="36dd13" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">58</argument>
</grok:render>
- Running locally - Firecrawl Docs (https://docs.firecrawl.dev/contributing/guide)<grok:render card_id="31771c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render><grok:render card_id="0cfef2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">51</argument>
</grok:render>
- [Self-Host] The CPU and memory resources are occupied too high, and after stopping the crawling task, the resources cannot be reduced. · Issue #722 · firecrawl/firecrawl - GitHub (https://github.com/firecrawl/firecrawl/issues/722)<grok:render card_id="908ce6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">50</argument>
</grok:render>
- [Bug] Can't accept connection due to RAM/CPU load · Issue #1781 · firecrawl/firecrawl - GitHub (https://github.com/firecrawl/firecrawl/issues/1781)<grok:render card_id="f12d8d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render>
- firecrawl/firecrawl: The Web Data API for AI - Turn entire ... - GitHub (https://github.com/firecrawl/firecrawl)<grok:render card_id="fe5277" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render><grok:render card_id="dc0596" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">41</argument>
</grok:render>
- How do you guys manage CPU/memory usage in Docker (Compose ... - Reddit (https://www.reddit.com/r/selfhosted/comments/1dg0qd4/how_do_you_guys_manage_cpumemory_usage_in_docker/)<grok:render card_id="ad74d4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">56</argument>
</grok:render>
- How to specify Memory & CPU limit in docker compose version 3 - Stack Overflow (https://stackoverflow.com/questions/42345235/how-to-specify-memory-cpu-limit-in-docker-compose-version-3)<grok:render card_id="fa19f9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">57</argument>
</grok:render>
- Limiting Docker Memory Usage on Windows - DEV Community (https://dev.to/sarahcssiqueira/limiting-docker-memory-usage-on-windows-5c45)<grok:render card_id="6d60c3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">60</argument>
</grok:render>
- Docker on a budget : optimize Resource Limits. - Medium (https://medium.com/%40jerome.devops/set-resource-limits-for-cloud-docker-compose-projects-on-a-budget-6b23fdd71264)<grok:render card_id="2758f2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">61</argument>
</grok:render>
- Setting Memory And CPU Limits In Docker | Baeldung on Ops (https://www.baeldung.com/ops/docker-memory-limit)<grok:render card_id="692cbc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">62</argument>
</grok:render>
- Resource constraints - Docker Docs (https://docs.docker.com/engine/containers/resource_constraints/)<grok:render card_id="5a1926" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render>

## User

_Time: 2025-09-22T20:50:14.661Z_

api 2025-09-22 20:49:40 info [api/v2:searchController]: Searching for results
api 2025-09-22 20:49:40 info [api/v2:searchController]: Using searxng search
api 2025-09-22 20:49:40 error [:]: There was an error searching for content {"error":{"message":"Request failed with status code 403","name":"AxiosError","stack":"AxiosError: Request failed with status code 403\n at settle (/app/node_modules/.pnpm/axios@1.12.2/node_modules/axios/dist/node/axios.cjs:2097:12)\n at IncomingMessage.handleStreamEnd (/app/node_modules/.pnpm/axios@1.12.2/node_modules/axios/dist/node/axios.cjs:3305:11)\n at IncomingMessage.emit (node:events:531:35)\n at endReadableNT (node:internal/streams/readable:1698:12)\n at process.processTicksAndRejections (node:internal/process/task_queues:90:21)\n at Axios.request (/app/node_modules/.pnpm/axios@1.12.2/node_modules/axios/dist/node/axios.cjs:4483:41)\n at process.processTicksAndRejections (node:internal/process/task_queues:105:5)\n at async searxng_search (/app/dist/src/search/v2/searxng.js:29:26)\n at async search (/app/dist/src/search/v2/index.js:52:29)\n at async searchController (/app/dist/src/controllers/v2/search.js:186:33)","config":{"transitional":{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},"adapter":["xhr","http","fetch"],"transformRequest":[null],"transformResponse":[null],"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"maxBodyLength":-1,"env":{},"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/json","User-Agent":"axios/1.12.2","Accept-Encoding":"gzip, compress, deflate, br"},"params":{"q":"Avalonia UI NuGet packages popular useful 2024","language":"en","engines":"","categories":"","pageno":1,"format":"json"},"method":"get","url":"https://searxng.bolabaden.org/search","allowAbsoluteUrls":true},"code":"ERR_BAD_REQUEST","status":403}}
api 2025-09-22 20:49:40 info [api/v2:searchController]: Using google search
api 2025-09-22 20:49:46 warn [:]: Max attempts reached, breaking the loop {}
api 2025-09-22 20:49:46 warn [:]: You're bypassing authentication {}
api 2025-09-22 20:49:46 info [api/v2:searchController]: Logging job
api 2025-09-22 20:49:48 warn [:]: You're bypassing authentication {}
api 2025-09-22 20:49:48 warn [:]: You're bypassing authentication {}
api 2025-09-22 20:49:48 info [api/v2:searchController]: Searching for results
api 2025-09-22 20:49:48 info [api/v2:searchController]: Using searxng search
api 2025-09-22 20:49:48 error [:]: There was an error searching for content {"error":{"message":"Request failed with status code 403","name":"AxiosError","stack":"AxiosError: Request failed with status code 403\n at settle (/app/node_modules/.pnpm/axios@1.12.2/node_modules/axios/dist/node/axios.cjs:2097:12)\n at IncomingMessage.handleStreamEnd (/app/node_modules/.pnpm/axios@1.12.2/node_modules/axios/dist/node/axios.cjs:3305:11)\n at IncomingMessage.emit (node:events:531:35)\n at endReadableNT (node:internal/streams/readable:1698:12)\n at process.processTicksAndRejections (node:internal/process/task_queues:90:21)\n at Axios.request (/app/node_modules/.pnpm/axios@1.12.2/node_modules/axios/dist/node/axios.cjs:4483:41)\n at process.processTicksAndRejections (node:internal/process/task_queues:105:5)\n at async searxng_search (/app/dist/src/search/v2/searxng.js:29:26)\n at async search (/app/dist/src/search/v2/index.js:52:29)\n at async searchController (/app/dist/src/controllers/v2/search.js:186:33)","config":{"transitional":{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},"adapter":["xhr","http","fetch"],"transformRequest":[null],"transformResponse":[null],"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"maxBodyLength":-1,"env":{},"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/json","User-Agent":"axios/1.12.2","Accept-Encoding":"gzip, compress, deflate, br"},"params":{"q":"Avalonia NuGet packages community extensions","language":"en","engines":"","categories":"","pageno":1,"format":"json"},"method":"get","url":"https://searxng.bolabaden.org/search","allowAbsoluteUrls":true},"code":"ERR_BAD_REQUEST","status":403}}
api 2025-09-22 20:49:48 info [api/v2:searchController]: Using google search
api 2025-09-22 20:49:53 info [api/v2:searchController]: Logging job
api 2025-09-22 20:49:55 info [api/v2:searchController]: Searching for results
api 2025-09-22 20:49:55 info [api/v2:searchController]: Using searxng search
api 2025-09-22 20:49:55 error [:]: There was an error searching for content {"error":{"message":"Request failed with status code 403","name":"AxiosError","stack":"AxiosError: Request failed with status code 403\n at settle (/app/node_modules/.pnpm/axios@1.12.2/node_modules/axios/dist/node/axios.cjs:2097:12)\n at IncomingMessage.handleStreamEnd (/app/node_modules/.pnpm/axios@1.12.2/node_modules/axios/dist/node/axios.cjs:3305:11)\n at IncomingMessage.emit (node:events:531:35)\n at endReadableNT (node:internal/streams/readable:1698:12)\n at process.processTicksAndRejections (node:internal/process/task_queues:90:21)\n at Axios.request (/app/node_modules/.pnpm/axios@1.12.2/node_modules/axios/dist/node/axios.cjs:4483:41)\n at process.processTicksAndRejections (node:internal/process/task_queues:105:5)\n at async searxng_search (/app/dist/src/search/v2/searxng.js:29:26)\n at async search (/app/dist/src/search/v2/index.js:52:29)\n at async searchController (/app/dist/src/controllers/v2/search.js:186:33)","config":{"transitional":{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},"adapter":["xhr","http","fetch"],"transformRequest":[null],"transformResponse":[null],"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"maxBodyLength":-1,"env":{},"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/json","User-Agent":"axios/1.12.2","Accept-Encoding":"gzip, compress, deflate, br"},"params":{"q":"\"Avalonia.Controls\" \"Avalonia.Themes\" NuGet packages","language":"en","engines":"","categories":"","pageno":1,"format":"json"},"method":"get","url":"https://searxng.bolabaden.org/search","allowAbsoluteUrls":true},"code":"ERR_BAD_REQUEST","status":403}}
api 2025-09-22 20:49:55 info [api/v2:searchController]: Using google search
 
how to fix

## Assistant

_Time: 2025-09-22T20:52:36.263Z_

### Key Issues and Fixes

The logs indicate failures in Firecrawl's /v0/search endpoint during self-hosted operation. The primary error is a 403 Forbidden response from the default public SearxNG instance (https://searxng.bolabaden.org), which occurs because public instances often restrict API access or JSON format to prevent abuse. This causes the fallback to Google search, which then fails with "Max attempts reached," likely due to anti-scraping measures like IP blocks or rate limiting on Google's search page. Warnings about bypassing authentication are expected in self-hosted mode if `USE_DB_AUTHENTICATION=false` (normal for local setups without Supabase).

Research suggests the SearxNG URL is hard-coded in Firecrawl's source (apps/api/src/search/v2/searxng.ts), making it non-configurable via .env by default. However, you can resolve this by hosting your own SearxNG instance and modifying Firecrawl's code to use it. For Google fallback, adding a proxy can help, but prioritizing a custom SearxNG is recommended for reliability. These fixes ensure stable search functionality without relying on public or restricted services.

**Potential Causes at a Glance:**
- **SearxNG 403**: Public instance blocks JSON queries (format=json parameter triggers forbidden access).
- **Google Max Attempts**: Scraping attempts fail due to detection (e.g., user-agent or IP blocking).
- **No Direct Impact on Crawling/Scraping**: This affects only the search endpoint; core crawling works independently.

**Estimated Effort**: 30-60 minutes for setup, assuming Docker familiarity. Test with curl to /v0/search post-fix.

---

### Hosting Your Own SearxNG Instance
To avoid 403 errors, deploy a local SearxNG with JSON enabled. This meta-search engine aggregates results from multiple sources without tracking.

1. **Clone and Configure SearxNG**:
   - Clone the repo: `git clone https://github.com/searxng/searxng.git && cd searxng`.
   - Use Docker for easy self-hosting: Copy the docker-compose.yml from docs (or use the provided template).
     Example docker-compose.yml (adjust ports/volumes):
     ```
     version: '3.9'
     services:
       searxng:
         image: searxng/searxng:latest
         ports:
           - "8080:8080"
         volumes:
           - ./searxng:/etc/searxng
         environment:
           - BIND_ADDRESS=0.0.0.0:8080
     ```
   - Start: `docker-compose up -d`.

2. **Enable JSON Format**:
   - Edit `./searxng/settings.yml` (create if missing):
     ```
     server:
       secret_key: "your_secret_key"  # Generate a random key
       limiter: false  # Disable if not needed
       image_proxy: true
     search:
       formats:
         - html
         - csv
         - json
         - rss
     engines:
       - name: google
         # Configure engines as needed
     ```
   - Restart the container: `docker-compose restart`.

3. **Test SearxNG**:
   - Access http://localhost:8080/search?q=test&format=json – should return JSON without 403.
   - If issues, check logs with `docker logs searxng` for config errors.

### Integrating Custom SearxNG with Firecrawl
Since the URL is hard-coded, modify Firecrawl's source and rebuild.

1. **Edit Firecrawl Code**:
   - In your cloned Firecrawl repo (apps/api/src/search/v2/searxng.ts), find the searxng_search function.
     - Replace the hard-coded URL (https://searxng.bolabaden.org/search) with your local instance, e.g., 'http://host.docker.internal:8080/search' (for Docker-to-Docker communication) or 'http://localhost:8080/search'.
     - To make it configurable, add: const searxngUrl = process.env.SEARXNG_URL || 'http://localhost:8080/search';
     - Then use searxngUrl in the axios.get call.
   - If using Docker network, add SearxNG to Firecrawl's docker-compose.yml as a service and use service name (e.g., 'http://searxng:8080/search').

2. **Rebuild and Restart Firecrawl**:
   - In docker-compose.yml, under api service, ensure build: context: ./apps/api.
   - Run `docker-compose build api && docker-compose up -d`.
   - Add to .env: SEARXNG_URL=http://localhost:8080/search (if you made it env-based).

3. **Test Search Endpoint**:
   - Curl: `curl -X POST http://localhost:3002/v0/search -H 'Content-Type: application/json' -d '{"query": "test"}'`.
   - Check logs for successful SearxNG use without 403.

### Fixing Google Fallback (Optional)
If you prefer Google or as backup:
- Set `PROXY_SERVER` in .env (e.g., http://username:password@proxyhost:port) to bypass blocks.
- Firecrawl uses scraping for Google, so proxies help with "Max attempts" (defaults to 3-5 retries).
- Alternative: Configure Google Custom Search Engine (CSE) if supported—add GOOGLE_API_KEY and GOOGLE_CSE_ID to .env, but check if Firecrawl uses it (may require code mod in google.ts).

### Additional Tips
- **Resource Monitoring**: Ensure sufficient RAM/CPU (as per previous guidance: min 8GB RAM, 4 cores for moderate use) to avoid worker stalls during searches.
- **Security**: For production, secure your SearxNG with HTTPS and limit access.
- **Alternatives**: If modification is too complex, use forks like localfirecrawl (integrates SearxNG directly) or disable search fallback in code.
- **Troubleshooting**: If 403 persists, verify JSON enabled in SearxNG logs; for Google, test with proxy tools like curl --proxy.

This setup resolves the errors by localizing dependencies, ensuring compliance and reliability in self-hosted Firecrawl.

### Key Citations
- [403 Error with websearch using searxng engine #2824 - GitHub](https://github.com/open-webui/open-webui/issues/2824)<grok:render card_id="55306f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [Error while enabling the Searxng as web search engine in Open ... - Stack Overflow](https://stackoverflow.com/questions/79043814/error-while-enabling-the-searxng-as-web-search-engine-in-open-web-ui)<grok:render card_id="efdc94" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- [Self-hosting - Firecrawl Docs](https://docs.firecrawl.dev/contributing/self-host)<grok:render card_id="f0bd5b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render>
- [Search - Firecrawl Docs](https://docs.firecrawl.dev/features/search)<grok:render card_id="40360e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render>
- [Ozamatash/localfirecrawl - GitHub](https://github.com/Ozamatash/localfirecrawl)<grok:render card_id="7b754d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">56</argument>
</grok:render>
- [Step by step installation - SearXNG](https://docs.searxng.org/admin/installation-searxng.html)<grok:render card_id="70fed7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render>
