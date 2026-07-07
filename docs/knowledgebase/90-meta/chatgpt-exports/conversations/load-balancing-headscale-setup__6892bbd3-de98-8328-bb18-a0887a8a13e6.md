---
source_url: "https://chatgpt.com/c/6892bbd3-de98-8328-bb18-a0887a8a13e6"
conversation_id: "6892bbd3-de98-8328-bb18-a0887a8a13e6"
title: "Load balancing Headscale setup"
extracted_at: "2026-06-29T11:52:35.218Z"
message_count: 2
provenance: auth-ui
---

# Load balancing Headscale setup

Source: [ChatGPT conversation](https://chatgpt.com/c/6892bbd3-de98-8328-bb18-a0887a8a13e6)

## User

i am self-hosting headscale, how to loadbalance it across multiple servers where any of my servers could potentially be hosting it?

## Assistant

To load balance Headscale across multiple self-hosted servers, there are several important considerations and strategies you need to be aware of. Headscale is stateful, so not all load-balancing strategies will work out of the box. Here's a full breakdown of how to approach this:

🧠 Key Considerations
1. Stateful Backend

Headscale maintains state for devices (nodes), users, keys, etc., in its database. So, to run multiple Headscale instances, they must all use the same shared database (e.g., PostgreSQL).

2. Shared Configuration

All Headscale instances must use the same:

Database

Server private key

Configuration file

OIDC/client auth setup (if enabled)

Otherwise, nodes may not be able to connect consistently.

3. Sticky Sessions

Clients (Tailscale nodes) initiate long-lived connections. To avoid issues, it's ideal to use a load balancer with sticky sessions (session affinity), or GeoDNS strategies (e.g., via Cloudflare or Route 53).

✅ Recommended Setup
🔗 Shared Components

Database: PostgreSQL (shared among all Headscale instances)

Storage: Ensure files like the private key and config are identical across nodes (sync via shared volume, Git, or config management)

TLS: Use the same certificates or a reverse proxy that handles TLS termination.

⚙️ Architecture Overview
+-------------------+
|     Clients       |
|  (Tailscale Nodes)|
+--------+----------+
         |
         v
+--------------------+
|    Load Balancer   |  <- HAProxy / nginx / Traefik / AWS ELB / etc.
| (Sticky sessions)  |
+--------+-----------+
         |
+--------+----------+--------+
|       |           |        |
v       v           v        v
HS-1   HS-2        HS-3     ...   <- Multiple Headscale instances
|       |           |
|       |           |
+-------+-----------+
        |
        v
+--------------------+
|  Shared PostgreSQL |
+--------------------+
🔧 Load Balancer Example (HAProxy with sticky sessions)

Here’s an example HAProxy config:

haproxy
frontend headscale_frontend
    bind *:443 ssl crt /etc/haproxy/certs/
    mode http
    option http-server-close
    default_backend headscale_backend

backend headscale_backend
    mode http
    balance source  # sticky based on client IP
    server hs1 10.0.0.1:8080 check
    server hs2 10.0.0.2:8080 check

balance source provides session affinity by hashing the client IP.

Replace with balance roundrobin if you use cookie-based stickiness.

🛡️ TLS Handling

You can either:

Terminate TLS at the load balancer (simplifies cert management), or

Use TLS end-to-end if you're concerned about internal traffic being encrypted.

🗃️ Database and Storage

All Headscale nodes should point to the same PostgreSQL instance:

YAML
db_type: postgres
db_host: postgres.internal
db_user: headscale
db_pass: securepass

Ensure you back up and manage your database with redundancy in mind (e.g., Postgres replication, RDS Multi-AZ if using AWS).

🔁 Optional: DNS-Based Load Balancing

If using something like Cloudflare or AWS Route 53:

Set up multiple A records for your Headscale domain.

Use GeoDNS or latency-based routing.

Make sure all servers have the same Headscale state.

🔍 Monitoring and Logging

Set up Prometheus/Grafana or use built-in logging to monitor each node.

🔄 Sync Configs

Use something like:

Ansible or Terraform to provision and keep all nodes in sync.

rsync, NFS, or Git pull for sharing config and key files.

📌 Important Notes

Scaling Headscale is mostly horizontal, assuming the database and configuration are properly shared.

If you’re doing this for high availability (HA), test failover scenarios!

Headscale is not designed to be stateless, so do not use random round-robin load balancing without sticky sessions or shared DB.

Would you like a production-ready HAProxy or nginx config example? Or do you want help containerizing this setup with Docker or Kubernetes?
