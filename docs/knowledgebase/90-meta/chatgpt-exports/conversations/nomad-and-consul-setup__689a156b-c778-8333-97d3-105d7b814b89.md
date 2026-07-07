---
source_url: "https://chatgpt.com/c/689a156b-c778-8333-97d3-105d7b814b89"
conversation_id: "689a156b-c778-8333-97d3-105d7b814b89"
title: "Nomad and Consul setup"
extracted_at: "2026-06-29T14:04:40.528Z"
message_count: 5
provenance: auth-ui
---

# Nomad and Consul setup

Source: [ChatGPT conversation](https://chatgpt.com/c/689a156b-c778-8333-97d3-105d7b814b89)

## Assistant

Your Nomad logs are showing:

failed to acquire consul self endpoint: ... connect: connection refused

This means your Nomad client tried to talk to Consul at 127.0.0.1:8500, but nothing was running there.
Nomad uses Consul for service discovery (and optionally for leader election & service mesh).

If you want to run Consul alongside Nomad in Docker Compose, you can set it up like this:

Example docker-compose.yaml with Nomad + Consul
YAML
version: "3.9"

services:
  consul:
    image: hashicorp/consul:1.19
    container_name: consul
    command: agent -dev -client=0.0.0.0
    ports:
      - "8500:8500"  # HTTP API / UI
      - "8600:8600/udp" # DNS
    networks:
      - nomad-net

  nomad:
    image: hashicorp/nomad:1.10
    container_name: nomad
    command: agent -dev -bind=0.0.0.0 -network-interface=eth0 -consul-address=consul:8500
    ports:
      - "4646:4646"  # Nomad UI
      - "4647:4647"  # RPC
      - "4648:4648"  # Serf
    depends_on:
      - consul
    networks:
      - nomad-net

networks:
  nomad-net:
    driver: bridge
What this does

Consul service

Runs in dev mode for quick testing (single node, in-memory storage).

Listens on all interfaces (-client=0.0.0.0), so Nomad can reach it from the other container.

Exposes the UI at http://localhost:8500.

Nomad service

Runs in dev mode, bound to 0.0.0.0.

Points to Consul with -consul-address=consul:8500 (using the Docker network hostname, not 127.0.0.1).

Shares the same Docker network as Consul so they can talk to each other.

How to run
Bash
docker compose up

Then:

Nomad UI → http://localhost:4646

Consul UI → http://localhost:8500

If you want, I can also give you a persistent production-ready Compose setup where both Consul and Nomad store their state in volumes and run in server/client mode instead of -dev. That way, you won't lose everything on restart.

Do you want the production version or just the dev/test one?

## User

what's bootstrap-expect do in nomad? possible values?

## Assistant

In Nomad, the bootstrap_expect setting tells a server node how many server nodes it should wait for before forming a cluster and electing a leader.

What it does

When a Nomad server starts, it enters the "bootstrapping" phase.

It will wait until it detects exactly the number of servers specified in bootstrap_expect.

Only when all expected servers are present will the cluster elect a leader and become active.

This prevents situations where a partially formed cluster elects a leader prematurely.

Possible values

Integer ≥ 1

Common values:

1 → For a single-server dev/test cluster (leader immediately elected).

3 → For a production HA setup (minimum recommended).

5 or 7 → For larger production environments (always keep it an odd number for Raft quorum).

Example config
hcl
server {
  enabled = true
  bootstrap_expect = 3
}

With bootstrap_expect = 3, the first Nomad server will wait until two more Nomad servers join before leader election starts.

Important notes

If you run with bootstrap_expect > 1 but never start enough servers, the cluster will never elect a leader.

Once the cluster is formed, the value is not used again unless you completely reset the Raft state.

For a quick test, set it to 1 in dev mode to avoid startup delays.

If you’re running Nomad and Consul in Docker Compose, bootstrap_expect only matters for Nomad servers, not for clients.

Do you want me to show you a multi-server Nomad Docker Compose where bootstrap_expect is used properly? That way, you can see it in action.

## User

difference between nomad client and nomad server?

## Assistant

In Nomad, client and server are roles, not different binaries — it’s the same nomad executable, but configured differently.

Here’s the breakdown:

1. Nomad Server

Purpose: Manages the brains of the cluster.

Main responsibilities:

Store the cluster’s state in a Raft
 consensus database.

Elect a leader among servers for coordination.

Handle job submissions (nomad job run).

Schedule and assign tasks to clients based on constraints & resources.

Keep track of allocations and cluster health.

Deployment:

Typically 3 or 5 servers in production (odd number for quorum).

Can also run in single-server mode for dev/testing.

Resource usage: Usually light on CPU/RAM (since it’s mostly coordination, not workload execution).

Analogy: Like the “control plane” in Kubernetes.

2. Nomad Client

Purpose: Runs the muscle of the cluster — executes workloads.

Main responsibilities:

Receive task allocations from servers.

Launch, monitor, and stop workloads using task drivers (docker, exec, raw_exec, qemu, etc.).

Report resource usage and task status back to the servers.

Deployment:

Typically many clients, each with substantial CPU, RAM, and storage for workloads.

Can be on the same host as a server in small setups.

Resource usage: Varies — clients actually run the workloads, so they need enough resources for jobs.

Analogy: Like the “worker nodes” in Kubernetes.

Key Differences
Feature	Server	Client
Runs jobs?	❌ No (unless also configured as client)	✅ Yes
Stores state?	✅ Yes (Raft database)	❌ No
Schedules tasks?	✅ Yes	❌ No
Needs high resources?	❌ Not much	✅ Yes (for running workloads)
Count in prod	3–5 (odd number)	As many as needed
Dual Role

You can run both roles on the same node (by setting server { enabled = true } and client { enabled = true } in the config).

This is common in dev mode (nomad agent -dev), where it runs both in one process.

If you’re using your Docker Compose setup from earlier, your nomad container is currently running both server and client roles — which is fine for testing, but in production, you’d normally split them.

I can draw you a Nomad architecture diagram showing exactly how clients and servers talk to each other if you want it visual.
