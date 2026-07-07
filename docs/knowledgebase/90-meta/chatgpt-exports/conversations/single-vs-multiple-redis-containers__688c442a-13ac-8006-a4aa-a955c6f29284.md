---
source_url: "https://chatgpt.com/c/688c442a-13ac-8006-a4aa-a955c6f29284"
conversation_id: "688c442a-13ac-8006-a4aa-a955c6f29284"
title: "Single vs multiple Redis containers"
extracted_at: "2026-06-29T11:53:16.997Z"
message_count: 5
provenance: auth-ui
---

# Single vs multiple Redis containers

Source: [ChatGPT conversation](https://chatgpt.com/c/688c442a-13ac-8006-a4aa-a955c6f29284)

## Assistant

You're right to question that — let's clarify.

✅ Yes, it is possible — and actually very common and officially supported — to run multiple databases within a single PostgreSQL container.
🔍 How it works:

When you run a PostgreSQL container (e.g., with the official postgres image), it spins up a PostgreSQL server. That server supports:

Multiple databases

Multiple schemas per database

Multiple users/roles

Per-database or per-role permissions

This means from a single container, you can:

Create DBs like:

SQL
CREATE DATABASE app1_db;
CREATE DATABASE app2_db;

Create roles:

SQL
CREATE ROLE app1_user WITH LOGIN PASSWORD '...';
GRANT ALL PRIVILEGES ON DATABASE app1_db TO app1_user;

Each app can be configured to connect to its own DB using its own user, even if they’re unrelated.

✅ This is easy with Docker:

Example docker-compose.yml with multiple apps using the same PostgreSQL container:

YAML
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: adminpass
    volumes:
      - pgdata:/var/lib/postgresql/data

  app1:
    build: ./app1
    environment:
      DB_HOST: postgres
      DB_NAME: app1_db
      DB_USER: app1_user
      DB_PASS: app1_pass

  app2:
    build: ./app2
    environment:
      DB_HOST: postgres
      DB_NAME: app2_db
      DB_USER: app2_user
      DB_PASS: app2_pass

volumes:
  pgdata:

You can then run an init SQL script to create both app1_db and app2_db with their own users.

📌 So to correct the misunderstanding:

It is absolutely possible and practical to create and use multiple PostgreSQL databases within a single containerized instance. It's how most people handle multi-app Postgre

## User

show an example of a docker-compose.yml that has 3 containers that require postgres, all using the same postgres container?

obviously the reason i'm saying you're wrong is there's no standard easy way to do this in a docker-compose.yml:

CREATE DATABASE app1_db;
CREATE DATABASE app2_db;


usually postgres db's are defined like this:

riven-db:
    # 🔹🔹 Riven DB 🔹🔹
    image: postgres:16.3-alpine3.20
    container_name: riven-db
    hostname: riven-db
    extra_hosts: *common-hostname-aliases
    networks:
      - publicnet
    volumes:
      - ${CONFIG_PATH:-./configs}/riven/pgdata:${RIVEN_PGDATA:-/var/lib/postgresql/data/pgdata}
    environment:
      <<: *common-env
      PGDATA: ${RIVEN_PGDATA:-/var/lib/postgresql/data/pgdata}
      POSTGRES_USER: ${RIVEN_DB_USER:-postgres}
      POSTGRES_PASSWORD: ${RIVEN_DB_PASSWORD:-postgres}
      POSTGRES_DB: ${RIVEN_DB_NAME:-riven}
    labels:
      traefik.enable: "true"
      traefik.http.routers.riven-db.middlewares: nginx-auth@docker
      traefik.http.routers.riven-db.rule: 'Host(`riven-db.${DOMAIN}`) || HostRegexp(`^(www\.)?riven-db\.${DOMAIN}$`) || HostRegexp(`^(www\.)?riven-db\.${TS_HOSTNAME}\.${DOMAIN}$`)'
      traefik.http.services.riven-db.loadbalancer.server.port: 5432
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    cpu_shares: 10
    mem_reservation: 6M
    deploy:
      resources:
        reservations:
          cpus: 0
          memory: 6M
        limits:
          cpus: 1
          memory: 4G
    restart: always


and your solution even if i could run that command to create a database it makes it extremely difficult to organize and separate unrelated containers?
Show more

## Assistant

Thanks for the thoughtful follow-up — you're absolutely right to be critical here.

Your observation is accurate and important:

The standard Docker Compose flow only allows for one database (via POSTGRES_DB) on container init, not multiple.

Creating additional databases beyond that requires custom scripting, which isn't clean or ergonomic — especially when you’re dealing with multiple unrelated apps.

🧩 So here’s the core truth:

Yes, PostgreSQL can support multiple databases and users in a single container, but:

Docker Compose does not provide a built-in way to declaratively define multiple databases and users out of the box.

✅ If you want to use one Postgres container for multiple apps, the best way is to:

Use an initialization script mounted via a volume.

Or use a sidecar container or entrypoint wrapper to handle database setup.

✅ Practical docker-compose.yml Example (3 apps, 1 Postgres)
YAML
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    container_name: shared-postgres
    restart: always
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: rootpass
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init-db:/docker-entrypoint-initdb.d  # 👈 Init multiple DBs
    networks:
      - backend

  app1:
    image: myorg/app1
    environment:
      DB_HOST: postgres
      DB_NAME: app1_db
      DB_USER: app1_user
      DB_PASSWORD: app1_pass
    networks:
      - backend
    depends_on:
      - postgres

  app2:
    image: myorg/app2
    environment:
      DB_HOST: postgres
      DB_NAME: app2_db
      DB_USER: app2_user
      DB_PASSWORD: app2_pass
    networks:
      - backend
    depends_on:
      - postgres

  app3:
    image: myorg/app3
    environment:
      DB_HOST: postgres
      DB_NAME: app3_db
      DB_USER: app3_user
      DB_PASSWORD: app3_pass
    networks:
      - backend
    depends_on:
      - postgres

volumes:
  pgdata:

networks:
  backend:
🔧 init-db/init.sql (runs automatically on first startup)
SQL
CREATE DATABASE app1_db;
CREATE DATABASE app2_db;
CREATE DATABASE app3_db;

CREATE USER app1_user WITH ENCRYPTED PASSWORD 'app1_pass';
CREATE USER app2_user WITH ENCRYPTED PASSWORD 'app2_pass';
CREATE USER app3_user WITH ENCRYPTED PASSWORD 'app3_pass';

GRANT ALL PRIVILEGES ON DATABASE app1_db TO app1_user;
GRANT ALL PRIVILEGES ON DATABASE app2_db TO app2_user;
GRANT ALL PRIVILEGES ON DATABASE app3_db TO app3_user;
✅ What this does:

One Postgres container.

Three separate databases and users.

Each app gets its own DB creds, with clean logical separation.

Everything is still “Docker-native” and versionable via Git.

❌ Why this can be awkward (as you pointed out):

No simple Compose-only way to do this declaratively.

Hard to isolate config/extensions per database.

Managing init scripts becomes messy if each app is a standalone repo.

✅ When to use separate containers instead:

If your apps are truly unrelated, or you want clean operational boundaries (e.g., per repo/team/version), then separate Postgres containers may be cleaner — despite the overhead.

🧠 Summary
Approach	Pros	Cons
One Postgres container, multiple DBs/users	Resource-efficient, centralized	Requires manual DB/user creation, awkward scaling/separation
Separate Postgres containers	Full isolation, simple per-app config	Higher resource usage, more infra to manage

Let me know your constraints — I can tailor an example that matches your actual deployment scenario.

## User

how inefficient is it to run multiple postgresql db containers, ballpark it for me like are we talking 10-15% CPU per container or 100000 additional writes/reads per second on the storage drive per container or are we talking something minuscle e.g. 0.00001%

## Assistant

Great question — here's a realistic, ballpark breakdown of what you can expect when running multiple PostgreSQL containers, especially if they're lightly used or idle:

🧮 Resource Overhead of Multiple PostgreSQL Containers (Ballpark Estimates)
🔹 CPU:

Idle container: ~0–1% CPU

Light usage (low-concurrency queries): 2–5% CPU per container

Background cost: Each container spawns ~6–10 backend processes even when idle, due to PostgreSQL’s process model.

Ballpark Overhead:
If your containers are mostly idle:

Negligible CPU usage (<1% total per container)

Total cost of 5 idle containers might be ~3–5% CPU on a modern 4–8 core system

🔹 Memory:

Baseline footprint per container: ~50–100 MB RSS

Shared memory and caching (e.g., shared_buffers) amplify this if tuned up.

Ballpark Overhead:

3–5 containers with default settings: ~300–500 MB RAM

Higher with real workloads, especially with connection pools or large buffers

🔹 Disk I/O:

Idle: Almost zero writes

Still does periodic WAL flushing and checkpoints (every ~5 min)

Writes (even a few inserts): Generates WAL + fsyncs → can spike I/O

Multiply by container count only if all are actively writing

Ballpark Overhead:

Idle containers: Near-zero read/write overhead

Light write load (~10 inserts/sec): <1 MB/sec per container

Sync overhead adds up only if all are busy and unbatched

🔹 Storage:

Docker adds small image layer bloat (~100–150MB per container), but not significant in terms of actual runtime DB size.

📌 So in summary:
Resource	Ballpark Cost (Idle)	Ballpark Cost (Light Use)	Notes
CPU	~0–1% per container	2–5% per container	Scales linearly with active queries
Memory	50–100 MB per container	100–300 MB per container	Depends on shared_buffers, work_mem, etc.
Disk I/O	Near zero	Low, unless write-heavy	Write spikes from WAL/checkpoints
Storage	~100–150 MB per image layer	Same	Doesn't grow unless DB grows
🧠 TL;DR:

Multiple Postgres containers aren't wildly inefficient, especially if they're mostly idle or light-load. The overhead is not 10–15% CPU or 100,000 writes/sec per container — it's closer to 0–1% CPU, ~50MB RAM, and negligible I/O per idle container.

But the inefficiency adds up fast under write-heavy workloads, due to PostgreSQL’s fsync-heavy durability model and the cost of each instance running its own WAL + background workers.

If your apps are low traffic or dev workloads, running 3–5 Postgres containers is completely reasonable. If they’re heavily loaded, sharing an instance is worth revisiting.

Let me know if you want benchmarks or profiling tips.
