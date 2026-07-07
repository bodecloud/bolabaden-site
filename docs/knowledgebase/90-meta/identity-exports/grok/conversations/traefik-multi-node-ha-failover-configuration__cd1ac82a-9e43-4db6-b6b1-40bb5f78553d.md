---
source_url: "https://grok.com/c/cd1ac82a-9e43-4db6-b6b1-40bb5f78553d"
conversation_id: "cd1ac82a-9e43-4db6-b6b1-40bb5f78553d"
title: "Traefik Multi-Node HA Failover Configuration"
extracted_at: "2026-06-29T16:12:45.416Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Traefik Multi-Node HA Failover Configuration

Source: [Grok conversation](https://grok.com/c/cd1ac82a-9e43-4db6-b6b1-40bb5f78553d)

## User

_Time: 2026-01-13T02:08:46.131Z_

traefik multi node ha failover configuration setup. Looking for highly specifically **dynamic failover**, where if traefik last priority router gets hit, the service isn't found on this specific host, it'll forward to my other hosts. If my main node/host goes down, DNS should be updated to change the priority node.
 
How to configure this? I don't want to write custom code. I want you to find something that's industry standard that already does this.
Here's what I **DONT** want:
- redis, consul, or service discovery
- Cluster, swarm, nomad, k8s, none of that.
- L4 network of any kind.
Literally just want a service running on the last priority router where that service will properly offload to the other nodes, and keep the request intact, simply allowing my main priority node to redirect traffic it's not designed for without corrupting/breaking anything.

## Assistant

_Time: 2026-01-13T02:11:54.327Z_

**Key Points**  
- Industry-standard high availability for Traefik on bare metal uses identical static configurations across nodes via the file provider, with direct backend routing and DNS-level health-checked failover.  
- Services route directly to backend IPs/ports on any host (including remote ones), preserving requests intact without inter-Traefik forwarding or loops.  
- Backend services must listen on accessible host IPs (not just localhost) for cross-node proxying; health checks handle individual backend failures gracefully.  
- DNS providers like AWS Route 53 or Cloudflare Load Balancing monitor Traefik's /ping endpoint to prefer the main node and failover automatically if it goes down.  
- This approach avoids service discovery, clustering, L4 balancing, and custom code while providing reliable HA.

**Setup Overview**  
Run Traefik on each host with the same static and dynamic configurations. Use the file provider to define all routers and services statically. Services point directly to your application backends using their host IPs and ports. Traefik's built-in load balancing and health checks manage backend availability. For node-level failover, configure your domain's DNS with health checks against each Traefik instance's /ping endpoint.

**Enabling Traefik Health Ping**  
Add a dedicated entrypoint for ping (lightweight and recommended for external monitoring):

```yaml
# traefik.yaml (static config)
entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"
  ping:
    address: ":8082"

ping: {}
```

The /ping endpoint now responds with 200 OK on http://your-traefik-ip:8082/ping.

**Dynamic Configuration Example (File Provider)**  
Create a file like dynamic.yaml loaded via --providers.file.filename=dynamic.yaml.

```yaml
http:
  routers:
    myapp-router:
      rule: Host(`app.example.com`)
      service: myapp-service
      entryPoints:
        - websecure
      tls:
        certResolver: myresolver  # Assuming ACME/Let's Encrypt setup

  services:
    myapp-service:
      loadBalancer:
        servers:
          - url: "http://10.0.0.10:8080"  # Backend on node1 (could be local or remote)
          - url: "http://10.0.0.20:8080"  # Backend on node2 (if replicated)
        healthCheck:
          path: "/health"  # Or whatever your app exposes; optional if no endpoint
          interval: "10s"
          timeout: "3s"
          retries: 3
        # Optional: weighted for local preference
        # servers:
        #   - url: "http://127.0.0.1:8080"
        #     weight: 10  # Higher weight prefers local if on same host
        #   - url: "http://other-node-ip:8080"
        #     weight: 1
```

If services are unique per host, list only the relevant IP. Traefik on any node can proxy to it directly.

For active-passive backends, use failover:

```yaml
http:
  services:
    app:
      failover:
        service: main
        fallback: backup
    main:
      loadBalancer:
        servers:
          - url: "http://main-node-ip:8080"
        healthCheck:
          path: "/health"
          interval: "10s"
    backup:
      loadBalancer:
        servers:
          - url: "http://backup-node-ip:8080"
```

**DNS Failover Configuration**  
Use a managed DNS provider for automatic node failover:

- **AWS Route 53** → Create health checks for each Traefik node (HTTP check to /ping on port 8082). Set routing policy to Failover: primary record points to main node IP (associated with its health check), failover record to secondary node(s).
- **Cloudflare Load Balancing** → Create origin pools (e.g., primary pool with main node, fallback pool with others). Attach monitors (HTTP GET to /ping). Set steering policy to primary/fallback or dynamic.

Clients resolve to the healthy priority node; if the main Traefik node fails the health check, DNS switches seamlessly.

**Benefits and Considerations**  

| Aspect                  | Details                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| Failover Mechanism      | DNS-level (no L4 VIP needed)                                            |
| Backend Access          | Backends must bind to host network interface; allow inbound from Traefik nodes |
| Configuration Sync      | Manually copy identical files across nodes (or use simple sync tool)    |
| Scalability             | Works for small-to-medium setups; changes require config update + reload|
| Limitations             | Not fully dynamic for new services (file-based); assumes network reachability between nodes |

This configuration is widely used for bare-metal Traefik deployments needing HA without orchestration tools.

**Key Citations**  
- [Traefik Services Documentation](https://doc.traefik.io/traefik/routing/services/)  
- [Traefik Ping Documentation](https://doc.traefik.io/traefik/operations/ping/)  
- [AWS Route 53 DNS Failover](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html)  
- [Cloudflare Load Balancing](https://developers.cloudflare.com/load-balancing/)  
- [Traefik Bare Metal HA Blog](https://traefik.io/blog/load-balancing-ha-clusters-in-bare-metal-environments)
