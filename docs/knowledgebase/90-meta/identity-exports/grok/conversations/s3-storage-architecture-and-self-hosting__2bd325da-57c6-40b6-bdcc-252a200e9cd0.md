---
source_url: "https://grok.com/c/2bd325da-57c6-40b6-bdcc-252a200e9cd0"
conversation_id: "2bd325da-57c6-40b6-bdcc-252a200e9cd0"
title: "S3 Storage: Architecture and Self-Hosting"
extracted_at: "2026-06-29T16:24:38.709Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# S3 Storage: Architecture and Self-Hosting

Source: [Grok conversation](https://grok.com/c/2bd325da-57c6-40b6-bdcc-252a200e9cd0)

## User

_Time: 2025-08-24T05:19:07.069Z_

how does s3 storage work exactly? how do services like aws/azure serve them in loadbalancer fashion? i always imagine that there's multiple hosts that contain the data so that if one becomes unavialable the data is still avaialble in a way where if that host comes back online it'll be synced there BEFORE the host that went offline will be available to further queries.
 
how to set this up myself on my self hosted ubuntu servers, WITHOUT a cluster?

## Assistant

_Time: 2025-08-24T05:20:57.167Z_

Amazon Simple Storage Service (S3) is an object storage system designed for scalability, durability, and availability. It stores data as objects within buckets, where each object consists of the data itself, a unique key (serving as its identifier), and associated metadata. Objects can include unstructured data such as images, videos, logs, or backups, with no inherent hierarchy—though keys can simulate directory structures (e.g., "folder/file.txt").<grok:render card_id="13c7dd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">41</argument>
</grok:render> S3 supports unlimited buckets and objects, with individual objects up to 5 terabytes in size.<grok:render card_id="0694ea" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render>

Internally, S3 distributes data across multiple physical disk drives in data centers, using a combination of specialized hardware, software, and distributed file systems for elastic scaling.<grok:render card_id="e2b1dc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render> Data is stored in chunks, with metadata separated and maintained in a key-value database for quick access and caching to ensure high availability.<grok:render card_id="e7d014" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render> To achieve durability of 99.999999999% (11 9's) annually for the Standard class, S3 automatically replicates objects across at least three Availability Zones (AZs) within a region—physically separate data centers.<grok:render card_id="0ed2ec" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">41</argument>
</grok:render> This replication is synchronous and transparent, protecting against hardware failures, outages, or disasters. Integrity is maintained through periodic checksums; if corruption is detected, S3 restores the object from redundant copies.<grok:render card_id="dee1be" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render> Availability is targeted at 99.99% for Standard storage, backed by service level agreements.<grok:render card_id="13dc0e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">41</argument>
</grok:render>

Requests to S3 are handled via HTTP/HTTPS APIs (REST or SOAP), with a distributed frontend layer that implicitly load balances incoming traffic across multiple servers.<grok:render card_id="5e4970" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render> This frontend routes requests to the appropriate backend storage nodes, which fetch and serve data from replicated copies. If a node or AZ becomes unavailable, the system automatically redirects to healthy replicas, ensuring seamless access without user intervention. When a failed node recovers, S3 resynchronizes data from other replicas before reintegrating it into the active pool, aligning with your described model of syncing prior to resuming queries.<grok:render card_id="5108a5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render> Cross-region replication can be configured for additional geo-redundancy, asynchronously copying objects to another region.<grok:render card_id="0cc920" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">41</argument>
</grok:render>

Azure Blob Storage operates similarly as an object storage service for unstructured data, supporting block blobs (for general binary/text data up to ~190 TiB), append blobs (optimized for logging), and page blobs (for random access, up to 8 TiB).<grok:render card_id="c01830" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render> It is organized into storage accounts (providing unique namespaces), containers (grouping blobs), and blobs themselves.<grok:render card_id="9e8ace" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render>

The architecture comprises three layers: a front-end (FE) for authenticating and routing requests; a partition layer for managing metadata and object tracking; and a stream layer for storing data as extents (replication units) composed of blocks.<grok:render card_id="13f74c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render> Data is stored across "storage stamps" (clusters of nodes in fault domains). Replication includes intra-stamp (synchronous, across fault/update domains for local redundancy) and inter-stamp (asynchronous, for geo-redundancy).<grok:render card_id="883a30" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render> This ensures high availability (99.9% SLA) and fault tolerance against disk, server, or rack failures.<grok:render card_id="2b8be5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render> Redundancy options include locally redundant storage (LRS, three copies in one data center), zone-redundant (ZRS, across AZs), geo-redundant (GRS, across regions), and read-access geo-redundant (RA-GRS).<grok:render card_id="fa61fc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render>

Requests are load balanced at the FE layer, which forwards them to partition servers based on cached maps, then to the stream layer for data retrieval.<grok:render card_id="3aeec6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render> If a component fails, the system uses replicas in other domains or stamps. Recovery involves lazy replication to resynchronize data, ensuring consistency before full availability.<grok:render card_id="c096bd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render>

To establish a similar S3-compatible setup on self-hosted Ubuntu servers without a formal cluster (interpreting this as avoiding complex orchestration like Kubernetes, while allowing simple multi-node replication), use MinIO, an open-source object storage server that emulates S3 APIs.<grok:render card_id="edd846" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render> MinIO can operate in a single-node mode for basic use or distributed mode for redundancy across servers via erasure coding, which provides fault tolerance without requiring advanced clustering software. The distributed setup is straightforward, involving shared storage paths and a common command-line invocation across nodes.

### Single-Node Setup on One Ubuntu Server (No Redundancy)
1. Update the system: `sudo apt update && sudo apt upgrade`.
2. Download MinIO: `wget https://dl.min.io/server/minio/release/linux-amd64/minio`.
3. Make executable and move: `chmod +x minio && sudo mv minio /usr/local/bin/`.
4. Create a data directory (e.g., `/data`) and set permissions: `sudo mkdir /data && sudo chown $USER:$USER /data`.
5. Start MinIO: `minio server /data --console-address ":9001"`.
6. Access the console at `http://your-server-ip:9001` with default credentials (minioadmin/minioadmin), then change them.
7. For production, create a systemd service file at `/etc/systemd/system/minio.service` with appropriate configurations, enable it (`sudo systemctl enable minio`), and start it.<grok:render card_id="aef25a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render>

This provides basic S3-compatible storage but lacks redundancy. Use RAID on the underlying disk for local fault tolerance.

### Multi-Node Setup for Redundancy (Simple Distributed Mode, No Complex Cluster)
For multiple Ubuntu servers (e.g., server1, server2), configure distributed MinIO with erasure coding for data replication and availability:
1. On each server, follow the single-node installation steps (download, permissions).
2. Ensure all servers can communicate (open ports 9000 via firewall: `sudo ufw allow 9000`).
3. Start MinIO on each with a shared command, specifying all nodes' data paths (e.g., for two servers): `minio server http://server1/data http://server2/data --console-address ":9001"`.
   - This enables automatic replication and striping across nodes. Data is divided into parity-protected shards; if a node fails, others serve from remaining shards.
4. For syncing and recovery: MinIO handles resynchronization automatically upon node recovery, reconstructing missing data from parity before full integration.
5. Add a load balancer like HAProxy on a front server: Install (`sudo apt install haproxy`), configure `/etc/haproxy/haproxy.cfg` with backends pointing to MinIO nodes (e.g., balance roundrobin), and restart (`sudo systemctl restart haproxy`).
6. Secure with SSL using Let's Encrypt: Generate certificates via Certbot, place in `/etc/minio/certs/`, and update MinIO environment variables.<grok:render card_id="7167b2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render><grok:render card_id="0d6d7d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>

This achieves redundancy with multiple hosts, automatic failover, and pre-recovery syncing, mirroring cloud services without a full cluster framework. For advanced features, consult MinIO documentation.

## User

_Time: 2025-08-24T05:29:36.892Z_

how to run minio in docker-compose.yaml and sync with redis and consul providers?

## Assistant

_Time: 2025-08-24T05:29:45.335Z_



## User

_Time: 2025-08-24T05:30:11.320Z_

how to run minio in docker-compose.yaml and sync with redis and consul providers? Like i mean since i'm not using a cluster, i have all my hosts loadbalanced across redis/consul available at redis.bolabaden.org and consul.bolabaden.org respectively.

## Assistant

_Time: 2025-08-24T05:35:33.545Z_

To establish a distributed MinIO setup using Docker Compose on individual Ubuntu servers without relying on a clustering framework such as Kubernetes or Docker Swarm, the configuration must address dynamic node discovery for replication and availability. Given the absence of static host lists in a non-clustered environment, Consul can serve as the provider for service discovery by leveraging its key-value store to collect node endpoints temporarily during startup. This enables each MinIO instance to synchronize its view of the distributed set before launching, ensuring data replication across hosts via MinIO's built-in erasure coding. Redis, in turn, can act as a provider for event notifications, allowing bucket events (e.g., object creation or deletion) to be published for external processing or monitoring, which indirectly supports synchronization workflows if integrated with custom listeners.

This approach aligns with the requirement for multiple hosts where data remains available if one fails, with resynchronization occurring upon recovery before the node resumes serving queries. Each server runs an identical Docker Compose configuration, but you must customize environment variables per host (e.g., via a `.env` file). The setup assumes Consul and Redis are accessible without authentication; if tokens or passwords are required, adjust accordingly.

### Prerequisites
- Install Docker and Docker Compose on each Ubuntu server.
- Ensure all servers can communicate with each other on ports 9000 (MinIO API) and 9001 (console), and with `consul.bolabaden.org:8500` (Consul HTTP API) and `redis.bolabaden.org:6379` (Redis).
- Firewall rules: `sudo ufw allow 9000/tcp`, `sudo ufw allow 9001/tcp`.
- Define a consistent data directory (e.g., `/data`) on each host with appropriate permissions.
- Set the number of servers in advance (e.g., 2 or more; MinIO requires at least 4 for production erasure coding but can operate with fewer for testing).

### Docker Compose Configuration (`docker-compose.yaml`)
Create this file on each server. It includes:
- A MinIO service with a custom entrypoint script that uses Consul's KV store to dynamically assemble the list of node endpoints.
- A registrator service to automatically register the local MinIO instance in Consul for load balancing (e.g., via an external HAProxy or NGINX configured to query Consul for "minio" service backends).

```
version: '3.8'

services:
  minio:
    image: quay.io/minio/minio:latest  # Use official MinIO image
    volumes:
      - /data:/data  # Mount host directory for persistent storage
    ports:
      - 9000:9000
      - 9001:9001
    environment:
      - MINIO_ROOT_USER=admin  # Replace with secure credentials
      - MINIO_ROOT_PASSWORD=password  # Replace with secure credentials
      - MINIO_NODE_URL=http://${HOST_IP}:9000/data  # Set HOST_IP to this server's reachable IP or hostname
      - EXPECTED_NODES=2  # Set to the total number of servers
      - CONSUL_URL=http://consul.bolabaden.org:8500  # Consul API endpoint
      - SERVICE_9000_NAME=minio  # For registrator to register API port as 'minio' service
      - SERVICE_9001_NAME=minio-console  # Optional: Register console port
    entrypoint: /bin/sh -c |
      apk update && apk add --no-cache curl jq
      NODE_ID=$$(hostname)  # Unique identifier per server
      KV_BASE="minio/nodes/"
      CURL_PUT="curl -s -X PUT $${CONSUL_URL}/v1/kv/$${KV_BASE}$${NODE_ID} -d $${MINIO_NODE_URL}"
      $$CURL_PUT  # Register this node's URL in Consul KV
      while true; do
        KEYS=$$(curl -s "$${CONSUL_URL}/v1/kv/$${KV_BASE}?keys")
        NUM=$$(echo "$$KEYS" | jq 'length')
        if [ "$$NUM" -ge "$${EXPECTED_NODES}" ]; then break; fi
        sleep 5
      done
      NODES=""
      for KEY in $$(echo "$$KEYS" | jq -r '.[]'); do
        VALUE=$$(curl -s "$${CONSUL_URL}/v1/kv/$$KEY?raw")
        NODES="$$NODES $$VALUE"
      done
      NODES=$$(echo "$$NODES" | tr ' ' '\n' | sort | tr '\n' ' ')
      exec /usr/bin/minio server $$NODES --console-address ":9001" --address ":9000"

  registrator:
    image: gliderlabs/registrator:latest
    command: -ip $${HOST_IP} consul://consul.bolabaden.org:8500  # Registers containers in Consul
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock  # Access to Docker daemon
    depends_on:
      - minio
```

#### Customization Notes
- **Environment Variables**: Use a `.env` file or export them before running (e.g., `export HOST_IP=192.168.1.10`). The `MINIO_NODE_URL` must use an IP or hostname resolvable by other servers.
- **Consul KV Cleanup**: The KV entries are temporary for bootstrap. Optionally, add a cleanup step post-startup via a cron job or script to delete `/minio/nodes/*` after all nodes are operational.
- **Security**: If Consul requires an ACL token, append `-H "X-Consul-Token: your_token"` to curl commands. For production, enable HTTPS on MinIO and Consul.
- **Erasure Coding**: By default, MinIO uses erasure coding across nodes. Specify `--drives-per-node` if using multiple drives per server.

### Deployment Steps
1. On each Ubuntu server, create the `docker-compose.yaml` file.
2. Customize `.env` or environment variables (e.g., `HOST_IP`, `EXPECTED_NODES`).
3. Start the stack: `docker compose up -d`.
   - The entrypoint script registers the node in Consul KV, waits until all expected nodes are registered, assembles the sorted endpoint list, and launches MinIO in distributed mode.
   - If a node fails, others continue serving from replicas. Upon restart, the script resynchronizes by rebuilding the list.
4. Verify: Access the console at `http://any-host-ip:9001` with root credentials. Use `mc admin info alias/` (after setting up the MinIO client) to confirm distributed status.
5. For load balancing: Configure an external balancer (e.g., HAProxy) to query Consul for the "minio" service (registered via registrator). Example HAProxy config snippet:
   ```
   resolvers consul
     nameserver consul consul.bolabaden.org:8600

   backend minio_backend
     balance roundrobin
     server-template minio 10 _minio._tcp.service.consul resolvers consul check
   ```
   This dynamically balances across registered MinIO nodes.

### Integrating Redis for Event Notifications (Sync Provider)
After deployment, configure MinIO to publish bucket events to Redis for external synchronization or monitoring (e.g., triggering workflows on object changes). This uses Redis as a notification queue provider.

1. Install the MinIO client (`mc`) on one server: `wget https://dl.min.io/client/mc/release/linux-amd64/mc && chmod +x mc && sudo mv mc /usr/local/bin/`.
2. Add alias: `mc alias set myminio http://localhost:9000 admin password`.
3. Set Redis notification config: `mc admin config set myminio notify_redis:1 format="namespace" address="redis.bolabaden.org:6379" key="minio_events"`.
   - If Redis requires a password: Add `password="your_password"`.
   - Format options: "namespace" (key includes event details) or "access" (simple key-value).
4. Restart MinIO on all nodes: `docker compose restart minio`.
5. Enable notifications for a bucket (e.g., "mybucket"): `mc event add myminio/mybucket arn:minio:sqs::1:redis --event put,delete --prefix images/ --suffix .jpg`.
   - This publishes events for JPEG uploads/deletions in the "images/" prefix to Redis under the "minio_events" key.
6. Verify: Use `redis-cli -h redis.bolabaden.org MONITOR` or `SUBSCRIBE minio_events` to observe events. Integrate custom consumers (e.g., a script subscribing to the queue) for further synchronization logic.

This configuration ensures high availability and data durability across hosts, with Consul facilitating discovery for distributed operation and Redis handling event-driven synchronization. If the number of nodes changes, update `EXPECTED_NODES` and restart all instances. For production, monitor logs (`docker logs minio`) and consider health checks in Consul registrations.
