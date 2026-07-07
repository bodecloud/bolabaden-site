---
source_url: "https://grok.com/c/6a6ca513-753e-4d9b-a84b-84717db9a17d"
conversation_id: "6a6ca513-753e-4d9b-a84b-84717db9a17d"
title: "Dynamic Service Discovery with Traefik and Consul"
extracted_at: "2026-06-29T16:25:45.266Z"
message_count: 14
export_suite: "identity"
provenance: grok-rest-api
---

# Dynamic Service Discovery with Traefik and Consul

Source: [Grok conversation](https://grok.com/c/6a6ca513-753e-4d9b-a84b-84717db9a17d)

## User

_Time: 2025-08-06T07:08:12.226Z_

Absolute dead simple way to ha *.bolabaden.org to *.micklethefickle.bolabaden.org or *.beatapostapita.bolabaden.org or *.vractormania.bolabaden.org where * is the name of the app. beatapostapita and vractormania and micklethefickle are arbitrary random VPS servers I own and run docker containers on. traefik is running on each. each service is available on *.servername.bolabaden.org
how to meet following incredibly strict requirements:
- ALL of them unfiyingly and dynamically available on *.bolabaden.org
- FULLY dynamic (absolutely zero hardcoded servers, container/service names, subdomains, etc).
- FULLY ha (if service errors or isn't available on service_name.micklethefickle.bolabaden.org, it'll use service_name.vractormania.bolabaden.org
- ABSOLUTELY ZERO spof
- ABSOLUTELY ZERO external dependencies (no paid cloudflare loadbalancer or anything, fully open source/selfhosted only). Selfhosted solutions only.
- FULLY AND COMPLETELY 100% compatible with a system where *.bolabaden.org ABSOLUTELY EXCLUSIVELY MUST BE AN A RECORD POINTING TO A SINGLE STATIC IP THAT WILL NEVER CHANGE AFTER WE DEFINE IT.
Looking for the MOST SIMPLISTIC solution.
- ZERO requirements for l2, e.g. DO NOT use 'floating ip' with e.g. keepalived.
hint: no custom code, no 'designing' a solution, none of that is 'dead simple'.

## Assistant

_Time: 2025-08-06T07:09:21.116Z_



## User

_Time: 2025-08-06T07:09:21.149Z_

Absolute dead simple way to ha *.bolabaden.org to *.micklethefickle.bolabaden.org or *.beatapostapita.bolabaden.org or *.vractormania.bolabaden.org where * is the name of the app. beatapostapita and vractormania and micklethefickle are arbitrary random VPS servers I own and run docker containers on. traefik is running on each. each service is available on *.servername.bolabaden.org
how to meet following incredibly strict requirements:
- ALL of them unfiyingly and dynamically available on *.bolabaden.org
- FULLY dynamic (absolutely zero hardcoded servers, container/service names, subdomains, etc).
- FULLY ha (if service errors or isn't available on service_name.micklethefickle.bolabaden.org, it'll use service_name.vractormania.bolabaden.org
- ABSOLUTELY ZERO spof
- ABSOLUTELY ZERO external dependencies (no paid cloudflare loadbalancer or anything, fully open source/selfhosted only). Selfhosted solutions only.
- DOES NOT UNDER ANY CIRCUMSTANCES USE DNS FAILOVER
Looking for the MOST SIMPLISTIC solution.
- ZERO requirements for l2, e.g. DO NOT use 'floating ip' with e.g. keepalived.
hint: no custom code, no 'designing' a solution, none of that is 'dead simple'.

## Assistant

_Time: 2025-08-06T07:11:58.242Z_

To achieve high availability for services accessible via subdomains under `*.bolabaden.org`, while routing dynamically to equivalent services on `*.micklethefickle.bolabaden.org`, `*.beatapostapita.bolabaden.org`, or `*.vractormania.bolabaden.org` (where `*` represents the application name), and adhering strictly to the specified requirements of full dynamism, high availability without single points of failure, no external dependencies, no DNS failover, and no Layer 2 mechanisms, the most simplistic solution is to configure the three VPS servers as a Docker Swarm cluster and deploy Traefik within it.

### Setup Overview
Docker Swarm, integrated natively into Docker, provides orchestration for containers across multiple hosts, including built-in service discovery, load balancing, and health monitoring. Traefik integrates seamlessly with Swarm mode to handle routing and load balancing dynamically based on container labels, without requiring hardcoded configurations. This approach ensures that requests to `app.bolabaden.org` (for example) are directed to healthy instances of the "app" service across the cluster, failing over internally if an instance on one server encounters errors or becomes unavailable.

### Step-by-Step Configuration
1. **Initialize the Docker Swarm Cluster**:
   - On one server (e.g., micklethefickle), run `docker swarm init` to establish it as the initial manager. This command outputs a join token.
   - On the other two servers (beatapostapita and vractormania), run `docker swarm join --token <token> <manager-ip>:2377` to join as workers.
   - Promote the workers to managers for high availability (no single point of failure in the control plane): From the initial manager, execute `docker node promote beatapostapita` and `docker node promote vractormania`. With three managers, the cluster tolerates one failure while maintaining quorum.

2. **Deploy Traefik as a Swarm Service**:
   - Create a Docker Compose file (e.g., `traefik.yml`) for Traefik deployment:
     ```
     version: '3.8'
     services:
       traefik:
         image: traefik:v3.1
         command:
           - --providers.docker=true
           - --providers.docker.swarmMode=true
           - --providers.docker.exposedbydefault=false
           - --entrypoints.web.address=:80
         ports:
           - 80:80
         volumes:
           - /var/run/docker.sock:/var/run/docker.sock
         deploy:
           mode: global  # Runs Traefik on every node
           placement:
             constraints: [node.role == manager]  # Optional: Restrict to managers for security
     ```
   - Deploy it with `docker stack deploy -c traefik.yml traefik`. Traefik will now discover and route to Swarm services dynamically using labels.

3. **Deploy Application Services**:
   - For each application (e.g., "app"), create a Compose file (e.g., `app.yml`) defining it as a Swarm service with replicas across nodes:
     ```
     version: '3.8'
     services:
       app:
         image: <your-app-image>
         deploy:
           replicas: 3  # One per server for HA
         labels:
           - traefik.enable=true
           - traefik.http.routers.app.rule=Host(`app.bolabaden.org`)
           - traefik.http.services.app.loadbalancer.server.port=<app-port>  # e.g., 8080
           - traefik.http.services.app.loadbalancer.healthcheck.path=/health  # Optional: Path for health checks
           - traefik.http.services.app.loadbalancer.healthcheck.interval=10s
     ```
   - Deploy with `docker stack deploy -c app.yml app`. Repeat for other applications. Swarm schedules tasks (containers) across nodes, and Traefik discovers them via labels without hardcoding server names or subdomains.

4. **Configure DNS**:
   - Set up a wildcard DNS record for `*.bolabaden.org` with multiple A records pointing to the IP addresses of all three servers (static round-robin distribution). This ensures client requests are distributed across nodes without relying on failover mechanisms or external load balancers.

### How Requirements Are Met
- **Unified and Dynamic Availability on `*.bolabaden.org`**: Traefik routes based on host rules in labels, making all services accessible under the unified domain without manual subdomain mapping.
- **Full Dynamism**: Service discovery occurs via Docker labels and Swarm's API; no hardcoded elements are needed. Adding or removing services updates routing automatically.
- **Full High Availability**: Swarm's routing mesh load balances requests across healthy replicas. If a service instance fails (detected via optional health checks in labels), traffic is redirected to available instances on other nodes.
- **No Single Point of Failure**: The Swarm control plane is distributed across three managers. Traefik runs on multiple nodes, and the routing mesh ensures accessibility even if one node fails.
- **No External Dependencies**: Docker Swarm and Traefik are open-source and self-hosted on the existing VPS servers.
- **No DNS Failover**: DNS uses static multiple A records, not dynamic monitoring or updates.
- **Simplicity**: This leverages built-in Docker features and Traefik's native integration, requiring only standard commands and Compose files.

This configuration assumes applications are replicable across nodes (e.g., stateless or with shared storage if needed). For stateful services, incorporate Swarm-compatible volumes or databases.<grok:render card_id="642517" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="b9d1ac" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="7cce32" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render><grok:render card_id="0fb9e8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render><grok:render card_id="c919ae" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render>

## User

_Time: 2025-08-06T07:27:55.258Z_

Absolute dead simple way to ha *.bolabaden.org to *.micklethefickle.bolabaden.org or *.beatapostapita.bolabaden.org or *.vractormania.bolabaden.org where * is the name of the app. beatapostapita and vractormania and micklethefickle are arbitrary random VPS servers I own and run docker containers on. traefik is running on each. each service is available on *.servername.bolabaden.org
how to meet following incredibly strict requirements:
- ALL of them unfiyingly and dynamically available on *.bolabaden.org
- FULLY dynamic (absolutely zero hardcoded servers, container/service names, subdomains, etc).
- FULLY ha (if service errors or isn't available on service_name.micklethefickle.bolabaden.org, it'll use service_name.vractormania.bolabaden.org
- ABSOLUTELY ZERO spof
- ABSOLUTELY ZERO external dependencies (no paid cloudflare loadbalancer or anything, fully open source/selfhosted only). Selfhosted solutions only.
- DOES NOT UNDER ANY CIRCUMSTANCES USE DNS FAILOVER
Looking for the MOST SIMPLISTIC solution.
- ZERO requirements for l2, e.g. DO NOT use 'floating ip' with e.g. keepalived.
hint: no custom code, no 'designing' a solution, none of that is 'dead simple'.
- DOES NOT USE DOCKER SWARM OR KUBERNETES UNDER ANY CIRCUMSTANCES.

## Assistant

_Time: 2025-08-06T07:33:33.826Z_

To achieve high availability for services accessible via subdomains under *.bolabaden.org, while adhering to the specified requirements of full dynamism, no single point of failure, self-hosted open-source tools only, no DNS failover, no Layer 2 mechanisms, and no Docker Swarm or Kubernetes, the most simplistic solution involves integrating Consul for service discovery with Registrator for automatic Docker container registration. This enables Traefik instances on each VPS to dynamically discover and load balance across service instances on all servers.

### Key Components and Rationale
- **DNS Resolution**: Use a wildcard DNS record (*.bolabaden.org) with multiple A records pointing to the IP addresses of all VPS servers. This distributes incoming requests across Traefik instances without failover logic.
- **Service Discovery**: Consul operates as a clustered, distributed system across the VPS servers, providing dynamic registration and health monitoring without a single point of failure.
- **Automatic Registration**: Registrator monitors Docker containers on each host and registers them in Consul, ensuring no manual or hardcoded configurations for services.
- **Routing and Load Balancing**: Traefik uses Consul as a provider to automatically generate routers and load balancers based on registered services, with built-in support for failover to healthy instances.
- **High Availability**: If a service instance fails (e.g., on service_name.micklethefickle.bolabaden.org), Consul health checks remove it, and Traefik redirects to available instances (e.g., on service_name.vractormania.bolabaden.org). The distributed nature ensures resilience to any single server failure.

This approach avoids custom code, relies solely on established open-source tools, and maintains dynamism by deriving all routing from service registrations.

### Step-by-Step Configuration
1. **Configure DNS**:
   - At your DNS provider, create a wildcard A record for *.bolabaden.org, listing the IP addresses of all VPS servers. Clients will resolve to one IP, directing traffic to a Traefik instance.

2. **Install and Configure Consul**:
   - Download and install Consul (open-source from HashiCorp) on each VPS.
   - Run Consul in server mode on all servers for a highly available cluster (quorum-based, tolerates one failure with three nodes).
   - Example configuration file (/etc/consul.d/consul.hcl on each server):
     ```
     datacenter = "dc1"
     data_dir = "/opt/consul"
     server = true
     bootstrap_expect = 3  # Set to number of servers
     bind_addr = "<local-vps-ip>"
     retry_join = ["<ip-of-server1>", "<ip-of-server2>", "<ip-of-server3>"]  # Initial cluster formation
     ```
   - Start Consul: `consul agent -config-dir=/etc/consul.d`.
   - The retry_join list enables automatic clustering; for new servers, restart agents after updating this list across nodes (manual but minimal intervention).

3. **Set Up Registrator**:
   - Run Registrator as a Docker container on each VPS to automatically register local containers with Consul.
   - Example run command:
     ```
     docker run -d \
       --name=registrator \
       --net=host \
       --volume=/var/run/docker.sock:/tmp/docker.sock \
       gliderlabs/registrator:latest \
       -ip="<local-vps-ip>" \
       consul://localhost:8500
     ```
   - For each service container in Docker Compose, publish ports (to enable cross-host access) and set environment variables for registration:
     ```
     services:
       app:
         image: your-app-image
         ports:
           - "80"  # Docker assigns random host port; use fixed if no conflicts
         environment:
           - SERVICE_NAME=service_name  # The app name, used for subdomain and grouping instances
           - SERVICE_TAGS=traefik.enable=true  # Enables exposure in Traefik
     ```
   - Registrator will register the service with host IP and published port, plus a TTL health check (default 10s; adjustable via -ttl flag).

4. **Configure Traefik**:
   - In Traefik's static configuration file (traefik.yml on each VPS):
     ```
     entryPoints:
       web:
         address: ":80"
     providers:
       consulCatalog:
         endpoint:
           address: "127.0.0.1:8500"
         exposedByDefault: false
         defaultRule: "Host(`{{ .Name }}.bolabaden.org`)"  # Dynamically sets router to service_name.bolabaden.org
     ```
   - Restart Traefik. It will poll Consul for services, create routers based on the default rule, and load balance to all healthy instances (local or remote via published ports).

5. **Health Monitoring and Failover**:
   - Consul performs health checks on registered services. Failed checks deregister instances.
   - Traefik only routes to healthy backends, ensuring automatic failover.

### Verification and Operation
- Deploy a service container on multiple servers with the same SERVICE_NAME.
- Access service_name.bolabaden.org; requests route via DNS to a Traefik instance, which load balances across all registered instances.
- Simulate failure by stopping a container; Consul removes it within the TTL interval, and traffic redirects to remaining instances.

This configuration is self-contained, leverages standard tool integrations, and meets all constraints by avoiding hardcoded elements in service definitions—everything derives from container metadata and Consul catalog entries. If expanding servers, update DNS A records and Consul retry_join, then restart agents for seamless integration.

## User

_Time: 2025-08-06T07:34:50.887Z_

```

DNS Resolution: Use a wildcard DNS record (*.bolabaden.org) with multiple A records pointing to the IP addresses of all VPS servers. This distributes incoming requests across Traefik instances without failover logic.
```

I've never heard of a dns provider that offers multilpe A records for a single fqdn/hostname (*.bolabaden.org). I'm currently using cloudflare, it only lets me point an A record to one ipv4, hence the absolute nightmare of a task this is

## Assistant

_Time: 2025-08-06T07:35:16.031Z_

Cloudflare does support multiple A records for the same hostname, including wildcard records such as *.bolabaden.org. This configuration enables round-robin DNS, where the DNS resolver distributes queries across the listed IP addresses in a rotating manner, effectively balancing incoming requests among your VPS servers without requiring failover mechanisms.<grok:render card_id="185e2e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="75231e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="eb4a17" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>

To implement this in the Cloudflare dashboard, follow these steps:

1. Navigate to the DNS section for your domain (bolabaden.org).

2. Add an A record with the name set to "*" (for the wildcard), and enter the IPv4 address of your first VPS server (e.g., the IP for micklethefickle.bolabaden.org). Ensure the record is not proxied if you wish to avoid Cloudflare's additional routing logic, as proxying may interfere with direct IP resolution for your Traefik setup.

3. Repeat the process to add additional A records with the identical name "*" and the IPv4 addresses of your other VPS servers (e.g., for beatapostapita.bolabaden.org and vractormania.bolabaden.org).

Cloudflare will accept these duplicate hostnames and serve the records in round-robin fashion, allowing client requests to resolve to any of the provided IPs randomly.<grok:render card_id="acd4e4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render><grok:render card_id="9b7fb7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>
This approach aligns with standard DNS practices and requires no external dependencies beyond your existing Cloudflare setup.

If you encounter any interface limitations or errors during addition, verify that you are not attempting to edit an existing record but are instead creating new ones with the same hostname. Should issues persist, consulting Cloudflare's documentation on round-robin DNS may provide further clarification.<grok:render card_id="fe6bb1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>

## User

_Time: 2025-08-06T07:38:22.410Z_

omfg i've wasted 5 months of my life i'm going to kms. Are you actually serious it's been that easy this WHOLE ITME? i've been researching this for absolute ages now

## Assistant

_Time: 2025-08-06T07:38:45.274Z_

I understand your frustration, and I appreciate the effort you have invested in researching this matter. To confirm, Cloudflare does indeed support the addition of multiple A records for the same hostname, including wildcard entries such as "*.bolabaden.org." This functionality enables round-robin DNS resolution, where client queries are distributed across the specified IP addresses in a rotational manner.<grok:render card_id="3aab3c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="f9f287" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render> As of 2025, this feature remains available without significant changes or limitations that would prevent its use in your scenario.<grok:render card_id="63eb15" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="57d79f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>

If you encounter any difficulties during implementation in the Cloudflare dashboard—such as apparent restrictions on duplicate names—ensure that you are creating separate records with identical hostnames but different IP values, and disable proxying (orange cloud icon) for direct resolution if needed. Should further assistance be required, such as troubleshooting steps or alternative configurations, please provide additional details.

## User

_Time: 2025-08-11T00:16:31.300Z_

Interesting, I have multiple servers pointing to *.bolabaden.org. On each server, what response code must be responded in order to use a different server? like for example I have plex.bolabaden.org hosted on one server, *.bolabaden.org is A DNS record to at least 7 servers. What do the other 6 servers need to respond with for plex.bolabaden.org so cloudflare knows to find the correct server of the 7???

## Assistant

_Time: 2025-08-11T00:17:58.927Z_

The configuration involving multiple A records for a wildcard hostname (*.bolabaden.org) under Cloudflare's proxied mode enables round-robin distribution of requests to the associated origin IP addresses. In the event that a selected origin fails to respond appropriately, Cloudflare implements automatic retry logic to another available origin, provided the failure aligns with specific conditions that generate Cloudflare error codes 521, 522, 523, 525, or 526.<grok:render card_id="93e330" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render><grok:render card_id="e2adb8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render><grok:render card_id="7a58e5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render>

These error codes correspond to the following failure scenarios at the origin server:
- **521 (Web server is down)**: Triggered when the origin server refuses the connection from Cloudflare.
- **522 (Connection timed out)**: Occurs if the origin server does not acknowledge Cloudflare's TCP handshake within the timeout period.
- **523 (Origin is unreachable)**: Activated when Cloudflare cannot route to the origin IP due to network issues.
- **525 (SSL handshake failed)**: Results from a failure in the TLS handshake between Cloudflare and the origin.
- **526 (Invalid SSL certificate)**: Generated if the origin's SSL certificate is invalid or untrusted by Cloudflare.

For Cloudflare to initiate a retry to an alternative server (e.g., from one of the seven origins not hosting plex.bolabaden.org), the non-hosting servers must induce one of these connection-level or handshake failures rather than returning a standard HTTP response code such as 404 (Not Found) or 500 (Internal Server Error). HTTP-level responses are proxied through by Cloudflare without triggering a retry, as they indicate a successful connection to the origin.<grok:render card_id="7348dc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render><grok:render card_id="8efd1f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render>

In practice, this means the six non-hosting servers should not accept or respond to connections for plex.bolabaden.org on the relevant ports (typically 80 for HTTP or 443 for HTTPS). For instance:
- If no service (e.g., Traefik) is listening on those ports for the specific subdomain, the connection attempt would fail, potentially yielding a 521 or 522 error and prompting Cloudflare to retry another origin.
- However, if a reverse proxy like Traefik is active on all servers and configured to return an HTTP response (e.g., 404) for unmatched subdomains, no retry would occur, as the connection succeeds from Cloudflare's perspective.

This automatic retry is a feature of Cloudflare's free tier for proxied records and does not require paid load balancing services. It is limited to a single retry attempt per request if multiple healthy origins exist.<grok:render card_id="c544c9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render><grok:render card_id="6064ba" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render> Note that this behavior assumes all A records are proxied; mixing proxied and DNS-only records for the same hostname treats all as proxied.<grok:render card_id="7c0d82" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>

In the context of the high-availability setup previously discussed (utilizing Traefik with Consul for service discovery), such failure-induced retries are unnecessary. Each Traefik instance dynamically routes requests to available service instances across servers, regardless of which origin IP Cloudflare selects initially. This ensures seamless handling without relying on Cloudflare's retry mechanism.

## User

_Time: 2025-08-11T00:23:51.347Z_

```

ubuntu@vractormania:~/my-media-stack$ curl -fv https://plex.bolabaden.org/web/index.html#!/
curl -fv https://plex.bolabaden.org/web/index.html#/home/ubuntu/my-media-stack/arbitrary-scripts/install_pwsh.sh
* Host plex.bolabaden.org:443 was resolved.
* IPv6: (none)
* IPv4: 172.245.88.17, 149.130.219.117, 172.245.88.16, 150.136.84.225, 170.9.225.137, 149.130.222.229, 172.245.88.15
*   Trying 172.245.88.17:443...
* Connected to plex.bolabaden.org (172.245.88.17) port 443
```

I'm asking about the above example. Let's say only ONE of the server ips shown above hosts plex.bolabaden.org, the others do not. Can cloudflare DNS A records properly figure that out? or what response code am i supposed to be responding on the servers to tell cloudflare that they do/don't host the service
 
in other words, does cloudflare dns A records when mutliple are set to a service, how does it behave? exclusively use cloudflare documentation to answer this question.
 
i'm literally just trying to host a plethora of services on 7 servers, and have them INTUITIVELY (without manually configuring them all and spending 8 billion years statically configuring everything) to get them ALL on *.bolabaden.org where * is the name of the service. I do not want custom code. I do not want swarm. I do not want kubernetes.

## Assistant

_Time: 2025-08-11T00:26:04.033Z_

Cloudflare's handling of multiple A records for a hostname, such as plex.bolabaden.org, depends on whether the records are set to proxied mode (orange cloud icon) or DNS-only mode (gray cloud icon). The following explanation is derived exclusively from Cloudflare's official documentation on proxied DNS records, origin protection, and related failover mechanisms.

### Behavior in DNS-Only Mode (Gray Cloud)
In DNS-only mode, Cloudflare functions solely as an authoritative DNS server and does not proxy traffic. When multiple A records are configured for the same hostname, Cloudflare returns all associated IP addresses to the querying client in a rotated order to facilitate basic round-robin distribution. However, the client (e.g., a browser or curl) is responsible for selecting and connecting to one of the resolved IPs. There is no built-in mechanism for Cloudflare to "figure out" which server hosts the service or to intervene in case of failure. If the selected server does not host the service and returns an HTTP response (e.g., 404 Not Found), the client receives that response without retrying another IP. Connection-level failures (e.g., refused connection or timeout) may prompt some clients to attempt the next IP, but this is client-dependent and not guaranteed—curl, for instance, does not automatically retry.<grok:render card_id="b2dcaa" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render> Your curl example demonstrates this DNS-only behavior, as it resolves directly to origin IPs and connects to one without Cloudflare intermediation.

### Behavior in Proxied Mode (Orange Cloud)
In proxied mode, Cloudflare acts as a reverse proxy: DNS queries return Cloudflare's anycast IP addresses instead of origin IPs, and all traffic routes through Cloudflare's network. For hostnames with multiple proxied A records (or a mix where at least one is proxied), Cloudflare treats the associated IPs as an implicit pool of origins. Traffic is distributed across these origins using a round-robin mechanism. If the initially selected origin fails, Cloudflare performs a single automatic retry to another origin in the pool, provided at least one other healthy endpoint exists.<grok:render card_id="9a6a6e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render><grok:render card_id="f5445e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render><grok:render card_id="ffacab" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render>

This retry, known as Zero-Downtime Failover, triggers only on specific connection-level or handshake failures when Cloudflare attempts to reach the origin, not on HTTP response codes. The documented failure conditions that initiate a retry include:
- 521: Web server is down (e.g., connection refused).
- 522: Connection timed out (e.g., no acknowledgment of TCP handshake).
- 523: Origin is unreachable (e.g., routing issues).
- 525: SSL handshake failed.
- 526: Invalid SSL certificate.<grok:render card_id="772fc5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render><grok:render card_id="3b911f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render>

HTTP-level responses from the origin, such as 404 (Not Found) or 500 (Internal Server Error), do not trigger retries, as they indicate a successful connection from Cloudflare's perspective—the response is simply proxied back to the client. Therefore, non-hosting servers cannot "tell" Cloudflare they do not host the service via an HTTP response code; instead, they must induce one of the listed connection failures (e.g., by not listening on the port, rejecting the connection via firewall, or failing the TLS handshake based on SNI). If all origins fail, Cloudflare serves the appropriate error to the client without further attempts.

This proxied behavior with implicit load balancing and failover is available on all Cloudflare plans, including the free tier, and does not require the paid Load Balancing product.<grok:render card_id="3678b7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render><grok:render card_id="44b0af" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render>

### Application to Your Setup
For hosting multiple services dynamically across seven servers under *.bolabaden.org without manual configuration, enabling proxied mode on the wildcard A records would allow Cloudflare to manage initial routing and retries as described. However, achieving full dynamic high availability (e.g., automatic failover for specific services like plex.bolabaden.org) while meeting your constraints of no custom code, Swarm, or Kubernetes aligns with the previously outlined self-hosted solution using Consul for service discovery, Registrator for container registration, and Traefik for routing. This setup ensures each Traefik instance can direct traffic to the correct hosting server regardless of the entry point, complementing Cloudflare's DNS handling without relying on it for service-level logic.
