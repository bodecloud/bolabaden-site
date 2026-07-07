---
source_url: "https://chatgpt.com/c/68d6f045-0e68-8333-999a-288286676fcd"
conversation_id: "68d6f045-0e68-8333-999a-288286676fcd"
title: "Serverless PostgreSQL in Docker"
extracted_at: "2026-06-29T11:49:31.552Z"
message_count: 4
provenance: auth-ui
---

# Serverless PostgreSQL in Docker

Source: [ChatGPT conversation](https://chatgpt.com/c/68d6f045-0e68-8333-999a-288286676fcd)

## User

how to host a serverless stateless postgresql in my multi-node non-swarm docker setup?

## Assistant

That’s a tough combination — let me unpack it.

A few key challenges:

PostgreSQL is stateful by design: it maintains data on disk and must preserve WAL logs, snapshots, indexes, etc.

Serverless/stateless typically implies no dependency on local state, which conflicts with how PostgreSQL persists data.

Multi-node non-swarm Docker setup means you don’t have an orchestrator (like Docker Swarm or Kubernetes) to handle scheduling, failover, and shared volumes.

So you can’t really run true stateless PostgreSQL in plain Docker without some extra infrastructure. What you can do is separate storage from compute so the database node(s) become ephemeral and "serverless-like."

Here are some approaches you can take:

🔑 Options for Hosting PostgreSQL “Statelessly” in Multi-Node Docker

External Managed PostgreSQL Service (recommended)

Use AWS RDS / Aurora, GCP Cloud SQL, Azure Database for PostgreSQL, or Supabase.

Your Docker containers talk to the managed service.

This is the easiest way to get "serverless-like" behavior (compute scales, storage is handled).

External Persistent Storage + Ephemeral DB Nodes

Use something like NFS, Ceph, GlusterFS, Longhorn, Portworx mounted into your PostgreSQL container as /var/lib/postgresql/data.

Run PostgreSQL in a container, but if the container dies, a new one can be spun up on another node mounting the same volume.

You’d need a manual or script-based mechanism to ensure only one primary is active at a time.

Patroni or Stolon for PostgreSQL HA in Docker

These projects wrap PostgreSQL in an HA manager, using distributed consensus (etcd, Consul, or Kubernetes API) to elect primaries and manage failover.

You can run Patroni/Stolon in plain Docker across multiple nodes, but you’ll need:

A distributed DCS (like etcd/consul)

Shared storage or streaming replication between nodes

This gives you resilience, but not statelessness in the strict sense.

Use a Cloud-Native Postgres Layer on top of Object Storage

Some projects (e.g. Neon
, CloudNativePG
) decouple compute and storage:

PostgreSQL instances are stateless, WAL and data live in object storage (S3, GCS, MinIO).

Containers can spin up/down without losing state.

For your multi-node Docker, you could run MinIO as S3-compatible backend + Neon’s storage layer.

🚀 Practical Path for Your Setup (No Swarm, Just Multi-Node Docker)

If you want something workable without adopting Kubernetes yet:

Deploy MinIO cluster (for object storage) across your nodes.

Run Neon Postgres compute nodes or Stolon in Docker containers.

Point apps to a floating DNS / HAProxy / Traefik that routes to the active Postgres leader.

Treat DB containers as ephemeral: if they crash, a new one spins up, attaches to storage, and resumes.

This gives you a "stateless container, stateful backend" model, which is as close as you’ll get to "serverless Postgres" in plain multi-node Docker.

👉 Question for you: Do you want (A) fully managed, serverless Postgres (no ops burden), or (B) to self-host something serverless-like inside your Docker environment?

Because if A, the cloud DB route is best. If B, I can walk you through setting up something like Stolon + Consul + shared volumes in Docker.

Would you like me to draft a step-by-step guide for Option B (self-hosted, stateless-like Postgres in Docker)?

## User

many, many, many providers especially google cloud/vercel/etc are offering stateless serverless postgresql. So the fact you can't give me a straight absolute working answer means your information is outdated and incorrect. Actualy provide the exact basic but complete instructions.

## Assistant

You’re right — lots of providers (Vercel, Neon, etc.) now offer serverless / stateless PostgreSQL by separating compute from storage. Below I’ll give an exact, copy-pasteable, minimal but complete self-hosted recipe you can run on a multi-node Docker cluster without Docker Swarm. This uses the open-source Neon architecture (stateless compute + storage engine) and example Docker images that people use for experiments. (If you prefer to use a managed provider instead, skip the self-host and use Neon/Vercel directly — they integrate.) 
Neon
+1

Goal

Run stateless Postgres compute nodes (ephemeral containers you can start/stop anywhere) backed by Neon storage components (storagebroker, safekeepers, pageserver). Minimal topology uses a small object store (MinIO) for S3-compatible storage (optional for lab; recommended for production), 3 safekeepers (Paxos quorum), one pageserver, one storage broker, and one or more compute (Postgres) containers that are truly stateless. The commands below are the minimal working commands used by people experimenting with Neon. 
Percona
+1

Prerequisites (must do)

Docker installed on each host (same major architecture).

Hosts can reach each other by IP (no overlay network required — we’ll use --net=host).

Open these ports between nodes (adjust per-host as you deploy):

Broker: 50051/tcp

Safekeeper WAL listen: 5454/tcp (and safekeeper HTTP 7676)

Pageserver Postgres listen: 6400/tcp and pageserver HTTP 9898

Compute (Postgres client): ports you choose to publish (examples use 55432).

Swap off/time sync recommended for distributed consensus.

(Optional but recommended) Decide S3 backend (MinIO, AWS S3, GCS). For local/on-prem testing we use MinIO. 
AIStor Object Store Documentation

Minimal 4-host example (you can collocate roles)

Replace the example IPs below with your hosts. You can run multiple roles per host, but ensure ports don’t collide.

BROKER_HOST=10.0.0.10 — storage broker (coordination)

PAGESERVER_HOST=10.0.0.10 — pageserver (can be same as broker)

SAFEKEEPER1=10.0.0.11

SAFEKEEPER2=10.0.0.12

SAFEKEEPER3=10.0.0.13 (use an odd number for Paxos quorum)

MINIO_HOST=10.0.0.14 (optional; you can also use AWS S3)

Exact commands (copy, replace IPs & secrets)
0) Pull images on all nodes
Bash
docker pull perconalab/neon:latest
docker pull minio/minio:latest    # only on MINIO_HOST (optional)
1) (Optional) Start MinIO on MINIO_HOST for object storage

Run this on MINIO_HOST (replace credentials):

Bash
# on MINIO_HOST
docker run -d --name minio \
  -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  --restart unless-stopped \
  minio/minio server /data --console-address ":9001"

Open http://MINIO_HOST:9001 and create a bucket (e.g. neon-bucket). (You can also use AWS S3; Neon supports any S3-compatible backend.) 
AIStor Object Store Documentation

2) Start the storagebroker (on BROKER_HOST)
Bash
# on BROKER_HOST
docker run -d --name storagebroker --net=host \
  --entrypoint "storage_broker" perconalab/neon:latest \
  -l 0.0.0.0:50051

This provides the coordination endpoint at http://BROKER_HOST:50051. 
Percona

3) Start safekeeper nodes (run one per safekeeper host)

Run on SAFEKEEPER1, SAFEKEEPER2, SAFEKEEPER3 (change --id= and -l IP accordingly). Also mount a host dir for durability (/var/lib/neon/safekeeperN):

Bash
# example on SAFEKEEPER1
mkdir -p /var/lib/neon/safekeeper1
docker run -d --name safekeeper1 --net=host \
  -v /var/lib/neon/safekeeper1:/data \
  --entrypoint "safekeeper" perconalab/neon:latest \
  --id=1 -D /data \
  --broker-endpoint=http://BROKER_HOST:50051 \
  -l SAFEKEEPER1:5454 --listen-http=0.0.0.0:7676

Repeat with --id=2 on SAFEKEEPER2, etc. Safekeepers form a Paxos WAL quorum ensuring durability of incoming WAL before pageserver uploads it. Use at least 3 for production durability. 
Percona
+1

4) Start pageserver (on PAGESERVER_HOST)

Pageserver caches pages, processes WAL and uploads to object storage (if configured). Minimal pageserver run:

Bash
# on PAGESERVER_HOST
mkdir -p /var/lib/neon/pageserver
docker run -d --name pageserver --net=host \
  -v /var/lib/neon/pageserver:/data \
  --entrypoint "pageserver" perconalab/neon:latest \
  -D /data \
  -c "id=1" \
  -c "broker_endpoint='http://BROKER_HOST:50051'" \
  -c "listen_pg_addr='0.0.0.0:6400'" \
  -c "listen_http_addr='0.0.0.0:9898'" \
  -c "pg_distrib_dir='/opt/neondatabase-neon/pg_install'"

NOTE: configuring a real S3 backend (MinIO/AWS) for pageserver archiving is recommended for production. The pageserver+safe-keeper design is what makes compute stateless. 
Neon

5) Start a compute (stateless PostgreSQL) — can be started on any node

This launches a lightweight Postgres compute process that connects to pageserver + safekeepers. The first compute run will create a tenant + timeline for you unless you supply TENANT/TIMELINE.

Bash
# on any host (maps local port 55432 -> container Postgres)
docker run -d --name compute --net=host \
  --entrypoint "/compute.sh" \
  -e PAGESERVER=PAGESERVER_HOST \
  -e SAFEKEEPERS="SAFEKEEPER1:5454,SAFEKEEPER2:5454,SAFEKEEPER3:5454" \
  -p 55432:55432 \
  perconalab/neon:latest

After the container starts, get credentials and tenant/timeline info from logs:

Bash
docker logs compute 2>&1 | sed -n '1,200p'
# Look for lines containing neon.tenant_id and neon.timeline_id or connection info

Connect with psql (example):

Bash
psql -h 127.0.0.1 -p 55432 -U cloud_admin postgres
# password may be in logs; default user for the example image is cloud_admin

Percona’s example images expose the minimal admin user cloud_admin for tests. 
Percona

6) Quick functional test

From a machine that can reach the compute port (e.g., the host where you published 55432):

SQL
-- connect with psql, then:
CREATE TABLE t1 (id serial primary key, val text);
INSERT INTO t1 (val) VALUES ('hello neon');
SELECT * FROM t1;

Now stop the compute container and start a new compute container pointing to the same TENANT and TIMELINE (grab values from previous docker logs compute). The table rows should still be present — the compute is stateless and data is kept via safekeepers/pageserver. Example to recreate compute (attach to existing tenant/timeline):

Bash
# get TENANT/TIMELINE from old logs, then:
docker run -d --name compute2 --net=host \
  --entrypoint "/compute.sh" \
  -p 55433:55432 \
  -e PAGESERVER=PAGESERVER_HOST \
  -e SAFEKEEPERS="SAFEKEEPER1:5454,SAFEKEEPER2:5454,SAFEKEEPER3:5454" \
  -e TENANT=<tenant_id> -e TIMELINE=<timeline_id> \
  perconalab/neon:latest

Connect to new compute port (55433) and SELECT * FROM t1; — data should be there. (This demonstrates stateless compute.) 
Percona

Production notes and hard requirements

Use an S3-compatible durable backend (MinIO with erasure coding or real S3) so pageserver can push long-term data to object storage. That’s how Neon achieves “bottomless” storage and compute scale-to-zero. 
Neon
+1

Safekeepers = WAL durability. Use at least 3 safekeepers on separate hosts for Paxos safety. 
Percona

Pageserver CPU/SSD: pageserver benefits from NVMe/SSD for caching. Keep pageserver on fast storage. 
Neon

TLS & networking: put these services on a private network, secure endpoints with mTLS/proxies in front of pageserver/compute if public.

Monitoring & backups: instrument pageserver/safekeeper logs, and still keep periodic logical backups.

If you want fully managed serverless with zero ops, use a provider (Vercel integrates with Neon, among others). 
Neon
+1

Why this is “serverless/stateless compute”

Neon decouples storage (safekeepers + pageservers + durable object store) from compute. The compute nodes are stateless (they stream WAL to safekeepers and request pages from pageservers) — so you can spin them up/down anywhere (your multi-node Docker hosts) and they reattach to the same tenant/timeline. That’s exactly what providers like Vercel/Neon expose as serverless Postgres. 
Neon
+1

Sources / reading (key references)

Neon architecture (compute / pageserver / safekeepers). 
Neon

Percona hands-on Docker deploy (concrete docker run commands used above). 
Percona

Neon repo / codebase overview. 
GitHub

Vercel ↔ Neon integration (examples of managed serverless usages). 
Neon
+1

MinIO docs (S3-compatible object store for on-prem object storage). 
AIStor Object Store Documentation

If you want, I can:

Produce a single shell script that, given a host role and IP variables, runs the exact docker commands for that role (storagebroker / safekeeper / pageserver / compute / minio).

Or produce a detailed production checklist (TLS, resource sizing, monitoring, HAProxy/LB for compute, backups).

Which of those do you want me to generate right away? (I can paste the script here with placeholders you fill.)
