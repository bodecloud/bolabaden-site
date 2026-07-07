---
source_url: "https://grok.com/c/66b2a37b-0687-4101-86e5-3bfee6a5db94"
conversation_id: "66b2a37b-0687-4101-86e5-3bfee6a5db94"
title: "Multi-Node Redis Load Balancing Setup"
extracted_at: "2026-06-29T16:24:57.282Z"
message_count: 8
export_suite: "identity"
provenance: grok-rest-api
---

# Multi-Node Redis Load Balancing Setup

Source: [Grok conversation](https://grok.com/c/66b2a37b-0687-4101-86e5-3bfee6a5db94)

## User

_Time: 2025-08-23T01:09:41.809Z_

how to host a redis instance multi-node ensuring it has a SINGULAR entry point for completely free? e.g. redis.bolabaden.org on my domain bolabaden.org should serve redis and loadbalance across all of my nodes, so that if one goes down redis.bolabaden.org is still available. redis is redis:// not http/https://

## Assistant

_Time: 2025-08-23T01:10:01.321Z_



## User

_Time: 2025-08-23T01:11:42.787Z_

how to host a redis instance multi-node ensuring it has a SINGULAR entry point for completely free? e.g. redis.bolabaden.org on my domain bolabaden.org should serve redis and loadbalance across all of my nodes, so that if one goes down redis.bolabaden.org is still available. redis is redis:// not http/https://

Do NOT recommend cluster solutions.

Implications for Load Balancing

Layer 7 (L7) load balancers like an HTTP reverse proxy (e.g., Nginx, Envoy, HAProxy in HTTP mode) cannot parse or route Redis traffic, since it’s not HTTP/HTTPS.

You need a Layer 4 (TCP) load balancer if you want to balance across multiple Redis instances. Find a solution for redis, compatible with multi docker node configurations that ARE NOT using swarm.

## Assistant

_Time: 2025-08-23T01:15:15.863Z_

### Key Setup for Hosting a Multi-Node Redis Instance with a Singular Entry Point

- **Primary Approach**: Use Redis in master-slave replication mode with Sentinel for automatic failover, combined with Predixy as a free, open-source Redis proxy to provide a single entry point that intelligently routes writes to the master and load-balances reads across slaves. For high availability of the entry point, deploy multiple Predixy instances fronted by a TCP load balancer using Keepalived to manage a virtual IP (VIP) that your domain resolves to.
- **Compatibility Notes**: This works with multi-node Docker setups without Swarm, as all components (Redis, Sentinel, Predixy, Keepalived) can run in containers or directly on hosts. It's entirely free, relying on open-source tools, and uses Layer 4 TCP balancing via Keepalived for the proxy layer.
- **Potential Limitations**: While reliable for most workloads, performance may vary based on traffic volume; test in your environment. If read-heavy, slaves provide scaling, but writes remain single-master.

#### Step-by-Step Overview
1. **Set Up Redis Replication and Sentinel**: Configure one master and multiple slaves across your nodes, with Sentinel for monitoring and failover.
2. **Deploy Predixy as the Proxy**: Run Predixy to handle client connections, routing traffic appropriately.
3. **Add High Availability with Keepalived**: Use Keepalived on at least two nodes to create a VIP for redundancy.
4. **Configure DNS**: Point `redis.bolabaden.org` to the VIP for seamless access via `redis://redis.bolabaden.org:6379`.

#### Tools and Requirements
- **Redis & Sentinel**: Standard open-source Redis (version 6+ recommended for stability).
- **Predixy**: Handles protocol-aware routing (writes to master, reads to slaves).
- **Keepalived**: Provides VIP for Predixy HA.
- **Docker**: Optional for containerization on nodes.
- Hardware: At least 3 nodes for Redis/Sentinel (quorum), 2+ for Predixy/Keepalived.

For detailed configurations, see the survey section below.

---

### Comprehensive Guide to Hosting a Multi-Node Redis Instance with a Singular, Highly Available Entry Point

This guide provides a thorough, step-by-step implementation for setting up a multi-node Redis system using replication (master-slave) for data redundancy, Sentinel for automatic failover, Predixy as a protocol-aware proxy for a single entry point with read/write splitting, and Keepalived for making the proxy highly available via a virtual IP. All components are free and open-source, ensuring no costs. The setup is compatible with Docker on multiple nodes without Swarm, using TCP-based balancing at Layer 4 for the proxy front-end. This avoids Redis Cluster as requested, focusing instead on replication for simplicity and HA.

#### Why This Architecture?
- **Replication with Sentinel**: Redis replication copies data from a master to slaves, allowing read scaling. Sentinel monitors the setup, promotes a slave to master on failure, and notifies clients/proxies. This provides HA without sharding (as in Cluster mode).<grok:render card_id="ca9861" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">60</argument>
</grok:render><grok:render card_id="1d22f1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">61</argument>
</grok:render><grok:render card_id="ef3c5e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">65</argument>
</grok:render><grok:render card_id="7e55d3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">116</argument>
</grok:render>
- **Predixy as Proxy**: Predixy is a lightweight, high-performance Redis proxy that supports Sentinel-integrated replication. It provides a singular entry point (`redis://`), decodes the Redis protocol to route writes (e.g., SET) to the master and load-balance reads (e.g., GET) across slaves. It handles failover transparently, supports transactions, Pub/Sub, and multi-databases, and is multi-threaded for efficiency.<grok:render card_id="827d71" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">131</argument>
</grok:render><grok:render card_id="7cd53f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">139</argument>
</grok:render>
- **Keepalived for Proxy HA**: To ensure the entry point remains available if a Predixy node fails, use Keepalived with VRRP (Virtual Router Redundancy Protocol) to manage a floating VIP. Clients connect to this VIP, which moves to a backup node on failure. This is a free, standard way to achieve HA for TCP services like Predixy.<grok:render card_id="1f66a3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render><grok:render card_id="591854" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render><grok:render card_id="adb83d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render><grok:render card_id="13ec0e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render><grok:render card_id="724769" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">107</argument>
</grok:render><grok:render card_id="c065ed" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">105</argument>
</grok:render>
- **Docker Integration**: Run everything in Docker containers on your nodes for isolation. No Swarm needed—use simple `docker run` or Compose on each node.
- **Alternatives Considered**: HAProxy or Nginx could handle basic TCP balancing, but they lack built-in Redis protocol awareness for read/write splitting without custom scripts or separate ports.<grok:render card_id="640f5d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="ca79f8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render><grok:render card_id="8e233b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render><grok:render card_id="7afd17" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">99</argument>
</grok:render><grok:render card_id="8d762b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">100</argument>
</grok:render><grok:render card_id="acebfb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">102</argument>
</grok:render> Envoy was evaluated but is optimized for Redis Cluster, with limited replication support.<grok:render card_id="d47782" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">89</argument>
</grok:render><grok:render card_id="1ca121" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">110</argument>
</grok:render><grok:render card_id="a1d07f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">130</argument>
</grok:render> Pipy is a viable free alternative to Predixy but less feature-rich for Redis-specific needs.<grok:render card_id="fdeb1b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">103</argument>
</grok:render><grok:render card_id="06dc4b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">129</argument>
</grok:render>

#### Hardware and Network Recommendations
- **Nodes**: Use at least 3 for Redis/Sentinel (e.g., Node1: Master + Sentinel; Node2/3: Slaves + Sentinels) to ensure quorum (minimum 2+1 for majority). Add 2+ separate nodes for Predixy + Keepalived to avoid single-node failures affecting both data and proxy layers.
- **Networking**: Private network for inter-node communication (Redis on port 6379, Sentinel on 26379). Expose only the VIP on port 6379 publicly. Use firewalls (e.g., UFW) to restrict access.<grok:render card_id="5dc4e7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">106</argument>
</grok:render>
- **Specs**: 2-4 CPU cores, 4-8GB RAM per node for moderate loads. Scale slaves for read-heavy workloads.

#### Installation and Configuration Steps

1. **Install Dependencies on All Nodes** (Ubuntu/Debian example; adapt for your OS):
   - Update packages: `sudo apt update && sudo apt upgrade`.
   - Install Redis: `sudo apt install redis-server`.
   - Install Docker (if using containers): Follow https://docs.docker.com/engine/install/.
   - Install Keepalived: `sudo apt install keepalived`.
   - For Predixy: Clone from GitHub (`git clone https://github.com/joyieldInc/predixy`), build with `make`, and install.<grok:render card_id="c1921b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">131</argument>
</grok:render><grok:render card_id="7ae7a6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">139</argument>
</grok:render>

2. **Configure Redis Replication and Sentinel**:
   - On Master Node (e.g., Node1, IP: 192.168.1.10):
     - Edit `/etc/redis/redis.conf`: Set `bind 0.0.0.0`, `protected-mode no`.
     - Restart: `sudo systemctl restart redis`.
   - On Slave Nodes (e.g., Node2: 192.168.1.11, Node3: 192.168.1.12):
     - Edit `/etc/redis/redis.conf`: Add `replicaof 192.168.1.10 6379`, plus above settings.
     - Restart Redis.
   - Configure Sentinel on All Nodes:
     - Create `/etc/redis/sentinel.conf`:
       ```
       port 26379
       daemonize yes
       protected-mode no
       sentinel monitor mymaster 192.168.1.10 6379 2
       sentinel down-after-milliseconds mymaster 5000
       sentinel failover-timeout mymaster 10000
       ```
     - Start: `redis-sentinel /etc/redis/sentinel.conf`.
     - Verify: `redis-cli -p 26379 sentinel masters` should show the master.<grok:render card_id="51a7d0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">60</argument>
</grok:render><grok:render card_id="d80dbf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">106</argument>
</grok:render>
   - Docker Alternative: Use `redis:alpine` image, mount configs, and run with `docker run -d --name redis-master -p 6379:6379 redis:alpine redis-server --protected-mode no`.

3. **Set Up Predixy Proxy**:
   - Install on 2+ nodes (e.g., ProxyNode1: 192.168.1.20, ProxyNode2: 192.168.1.21).
   - Create `predixy.conf`:
     ```
     WorkerThreads 4
     ClientTimeout 300
     Log ./predixy.log
     Include sentinel.conf
     ```
   - Create `sentinel.conf` for Sentinel backend:
     ```
     SentinelServerPool {
         Name mymaster
         Databases 16
         Hash crc16
         HashTag "{}"
         TryCount 3
         MasterReadPriority 60
         SlaveReadPriority 50
         StaticSlaveReadPriority 50
         DynamicSlaveReadPriority 50
         RefreshInterval 1
         ServerTimeout 1
         ServerRetryTimeout 1
         KeepAlive 120
         Servers {
             + 192.168.1.10:26379
             + 192.168.1.11:26379
             + 192.168.1.12:26379
         }
     }
     ```
     - This enables read load balancing on slaves (priorities control weighting) and Sentinel discovery.<grok:render card_id="837be1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">139</argument>
</grok:render>
   - Run: `./src/predixy --conf=predixy.conf`.
   - Docker: Build from Dockerfile or use community images; run with mounted configs.

4. **Configure Keepalived for Proxy HA**:
   - On ProxyNode1 (Master, higher priority):
     - Edit `/etc/keepalived/keepalived.conf`:
       ```
       global_defs {
           notification_email { your@email.com }
           smtp_server localhost
           router_id PROXY_MASTER
       }
       vrrp_instance VI_1 {
           state MASTER
           interface eth0  # Your interface
           virtual_router_id 51
           priority 150
           advert_int 1
           authentication {
               auth_type PASS
               auth_pass secret
           }
           virtual_ipaddress {
               192.168.1.50/24  # VIP
           }
           notify_master "/etc/keepalived/master.sh"  # Script to start Predixy if needed
       }
       ```
   - On ProxyNode2 (Backup, lower priority=100): Similar config, change `state BACKUP` and `priority 100`.
   - Enable IP forwarding: Add `net.ipv4.ip_forward=1` to `/etc/sysctl.conf`, apply with `sysctl -p`.
   - Firewall: Allow VRRP (protocol 112, multicast 224.0.0.18).
   - Start: `sudo systemctl start keepalived`.
   - Verify: `ip addr show` should show VIP on master.<grok:render card_id="d7b2f5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render><grok:render card_id="f81b50" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render><grok:render card_id="f4bfbb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render><grok:render card_id="65f3bf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">107</argument>
</grok:render><grok:render card_id="8cc125" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">105</argument>
</grok:render>

5. **DNS and Client Connection**:
   - Set A record for `redis.bolabaden.org` to the VIP (e.g., 192.168.1.50).
   - Clients connect via `redis://redis.bolabaden.org:6379`. Predixy listens on 6379 by default.

6. **Testing and Monitoring**:
   - Failover Test: Shut down master Redis; Sentinel promotes a slave, Predixy updates automatically.
   - Proxy Failover: Stop Predixy on master proxy node; Keepalived moves VIP.
   - Monitor: Use `redis-cli` for checks, Predixy logs for stats, Keepalived logs for VIP status.
   - Performance: Predixy adds minimal latency; tune threads based on cores.

#### Configuration Summary Table

| Component | Key Config File | Main Settings | Docker Command Example |
|-----------|-----------------|---------------|------------------------|
| Redis Master | /etc/redis/redis.conf | bind 0.0.0.0<br>protected-mode no | docker run -d -p 6379:6379 redis:alpine redis-server --protected-mode no |
| Redis Slave | /etc/redis/redis.conf | replicaof <master-ip> 6379 | docker run -d -p 6379:6379 redis:alpine redis-server --replicaof <master-ip> 6379 --protected-mode no |
| Sentinel | /etc/redis/sentinel.conf | sentinel monitor mymaster <master-ip> 6379 2 | docker run -d -p 26379:26379 redis:alpine redis-sentinel /etc/redis/sentinel.conf |
| Predixy | predixy.conf & sentinel.conf | WorkerThreads 4<br>SentinelServerPool with server IPs | docker run -d -v ./predixy.conf:/etc/predixy.conf <predixy-image> /src/predixy --conf=/etc/predixy.conf |
| Keepalived | /etc/keepalived/keepalived.conf | vrrp_instance with VIP, priority | docker run -d --privileged -v ./keepalived.conf:/etc/keepalived/keepalived.conf ubuntu keepalived |

#### Advanced Considerations
- **Scaling**: Add more slaves for read load; Predixy automatically includes them via Sentinel.
- **Security**: Enable Redis passwords in configs, use Predixy's AUTH extensions for permissions.<grok:render card_id="485ed5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">139</argument>
</grok:render> Set up TLS if needed (Predixy supports it).
- **Backup and Recovery**: Use Redis RDB/AOF for persistence; snapshot slaves regularly.
- **Troubleshooting**: Check logs (/var/log/redis, predixy.log). If VIP doesn't fail over, verify interface and auth in Keepalived.
- **Performance Tuning**: Set Predixy `MasterReadPriority 0` to force reads to slaves only. Monitor latency with Predixy's built-in tools.

This setup ensures `redis.bolabaden.org` remains available even if nodes fail, with transparent load balancing.

### Key Citations
- [Redis Sentinel Documentation](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/)<grok:render card_id="24a3d1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">60</argument>
</grok:render>
- [Predixy GitHub Repository](https://github.com/joyieldInc/predixy)<grok:render card_id="6b4b4c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">131</argument>
</grok:render><grok:render card_id="5d1030" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">139</argument>
</grok:render>
- [Keepalived Load Balancing Guide](https://docs.oracle.com/en/operating-systems/oracle-linux/9/balancing/balancing-SettingUpLoadBalancingbyUsingKeepalived.html)<grok:render card_id="507a5e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">107</argument>
</grok:render>
- [HAProxy for Redis](https://www.haproxy.com/blog/haproxy-advanced-redis-health-check)<grok:render card_id="0cb8f0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">99</argument>
</grok:render>
- [DigitalOcean HAProxy with Keepalived Tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-highly-available-haproxy-servers-with-keepalived-and-reserved-ips-on-ubuntu-14-04)<grok:render card_id="8655be" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">105</argument>
</grok:render>
- [Nginx TCP Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/)<grok:render card_id="3cba2c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">102</argument>
</grok:render>
- [Envoy Redis Proxy Overview](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/other_protocols/redis)<grok:render card_id="d86ec4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">130</argument>
</grok:render>

## User

_Time: 2025-08-23T01:17:05.819Z_

nah i want to use traefik. please add a tcp router for traefik to my configuration:

```
  coolify-proxy:
    # 🔹🔹 Traefik 🔹🔹
    depends_on:
      - crowdsec
      - failover-proxy
      - nginx-traefik-extensions
    image:  docker.io/traefik:latest
    container_name: coolify-proxy
    hostname: coolify-proxy
    extra_hosts:
      - 'host.docker.internal:host-gateway'
    networks:
      - coolify
      - consul-net
    expose:
      - 8080          # Dashboard API
    ports:
      - 80:80         # HTTP
      - 443:443       # HTTPS
      - 443:443/udp   # HTTPS/3
      - 853:853       # DNS over TLS
    cap_add:
      - NET_ADMIN
    volumes:
      - /data/coolify/proxy/traefik/dynamic:/traefik/dynamic
      - /data/coolify/proxy/certs:/certs
      - /data/coolify/proxy/traefik/config:/config
      - /data/coolify/proxy/traefik/plugins-local:/plugins-local
      - /var/run/docker.sock:/var/run/docker.sock:ro  # ro = read-only access to the docker.sock
      - /data/coolify/proxy/traefik/etc/traefik:/etc/traefik/  # Put the provided fileConfig.yml files at this location
      - /data/coolify/proxy/logs:/logs
    #      - /etc/localtime:/etc/localtime:ro
    configs:
      - source: traefik-dynamic.yaml
        target: /traefik/dynamic/dynamic.yaml
        mode: 0644
    environment:
      LETS_ENCRYPT_EMAIL: ${LETS_ENCRYPT_EMAIL:?}
      CLOUDFLARE_EMAIL: ${CLOUDFLARE_EMAIL:?}
      CLOUDFLARE_DNS_API_TOKEN: ${CLOUDFLARE_DNS_API_TOKEN:?}
      CLOUDFLARE_ZONE_API_TOKEN: ${CLOUDFLARE_ZONE_API_TOKEN:?}
      DUCKDNS_TOKEN: ${DUCKDNS_TOKEN:?}
    logging:
      driver: syslog
      options:
        syslog-address: unix:///var/run/docker.sock # or UDP/TCP syslog
        tag: "{{.Name}}"
    command:
      - '--accessLog=true'
      - '--accessLog.bufferingSize=0'
      - '--accessLog.fields.headers.defaultMode=drop'
      - '--accessLog.fields.headers.names.User-Agent=keep'
      - '--accessLog.filePath=/logs/traefik.log'
      - '--accessLog.filters.statusCodes=200-299,400-599'
      - '--accessLog.format=json'
      - '--metrics.prometheus.buckets=0.1,0.3,1.2,5.0'
      - '--api.dashboard=true'
      - '--api.debug=true'
      - '--api.disableDashboardAd=true'
      - '--api.insecure=false'
      - '--certificatesResolvers.letsencrypt.acme.caServer=https://acme-v02.api.letsencrypt.org/directory'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.provider=cloudflare'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.resolvers=1.1.1.1,8.8.8.8,1.0.0.1'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge=true'
      - '--certificatesResolvers.letsencrypt.acme.email=${LETS_ENCRYPT_EMAIL:?}'
      - '--certificatesResolvers.letsencrypt.acme.httpChallenge.entryPoint=http'
      - '--certificatesResolvers.letsencrypt.acme.httpChallenge=true'
      - '--certificatesResolvers.letsencrypt.acme.storage=/certs/acme.json'
      - '--certificatesResolvers.letsencrypt.acme.tlsChallenge=true'
      - '--entryPoints.dot.address=:853'
      - '--entryPoints.http.address=:80'
      - '--entryPoints.http.forwardedHeaders.trustedIPs=103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,104.16.0.0/13,104.24.0.0/14,108.162.192.0/18,131.0.72.0/22,141.101.64.0/18,162.158.0.0/15,172.64.0.0/13,173.245.48.0/20,188.114.96.0/20,190.93.240.0/20,197.234.240.0/22,198.41.128.0/17,2400:cb00::/32,2606:4700::/32,2803:f800::/32,2405:b500::/32,2405:8100::/32,2a06:98c0::/29,2c0f:f248::/32'
      - '--entryPoints.http.http.encodeQuerySemiColons=true'
      - '--entryPoints.http.http.middlewares=crowdsec@file'
      - '--entryPoints.http.http2.maxConcurrentStreams=250'
      - '--entryPoints.https.address=:443'
      - '--entryPoints.https.forwardedHeaders.trustedIPs=103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,104.16.0.0/13,104.24.0.0/14,108.162.192.0/18,131.0.72.0/22,141.101.64.0/18,162.158.0.0/15,172.64.0.0/13,173.245.48.0/20,188.114.96.0/20,190.93.240.0/20,197.234.240.0/22,198.41.128.0/17,2400:cb00::/32,2606:4700::/32,2803:f800::/32,2405:b500::/32,2405:8100::/32,2a06:98c0::/29,2c0f:f248::/32'
      - '--entryPoints.https.http.encodeQuerySemiColons=true'
      - '--entryPoints.https.http.middlewares=crowdsec@file'
      - '--entryPoints.https.http.tls.certResolver=letsencrypt'
      - '--entryPoints.https.http.tls.domains[0].main=${DOMAIN}'
      - '--entryPoints.https.http.tls.domains[0].sans=*.${DOMAIN},*.${TS_HOSTNAME}.${DOMAIN}'
      - '--entryPoints.https.http.tls=true'
      - '--entryPoints.https.http2.maxConcurrentStreams=250'
      - '--entryPoints.https.http3'
      - '--global.checkNewVersion=true'
      - '--global.sendAnonymousUsage=false'
      - '--log.level=INFO'
      - '--ping=true'
      - '--providers.docker.defaultRule=Host(`{{ normalize .ContainerName }}.${DOMAIN}`) || Host(`{{ normalize .ContainerName }}.${TS_HOSTNAME}.${DOMAIN}`)'
      - '--providers.docker.exposedByDefault=false'
      - '--providers.docker=true'
      - '--providers.file.directory=/traefik/dynamic/'
      - '--providers.file.watch=true'
      - '--serversTransport.insecureSkipVerify=true'
      - '--experimental.plugins.bouncer.modulename=github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin'
      - '--experimental.plugins.bouncer.version=v1.4.2'
    labels:
      traefik.enable: true
      traefik.http.routers.traefik.service: api@internal
      traefik.http.routers.traefik.rule: Host(`traefik.${DOMAIN}`) || Host(`traefik.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.services.traefik.loadbalancer.server.port: 8080
#      traefik.http.middlewares.legalbar.plugin.bodyreplace.replacements[0].search: </body>
#      traefik.http.middlewares.legalbar.plugin.bodyreplace.replacements[0].replace: <div style='position:fixed;bottom:0;width:100%;background:#222;color:#fff;text-align:center;padding:6px;font-size:14px;z-index:9999;'><a href="https://${DOMAIN}/privacy-policy" style="color:#fff;margin:0 10px;">Privacy Policy</a> | <a href="https://${DOMAIN}/terms" style="color:#fff;margin:0 10px;">Terms</a> | <a href="https://${DOMAIN}/cookies-policy" style="color:#fff;margin:0 10px;">Cookies Policy</a> — © ${DOMAIN}</div></body>
      homepage.group: Infrastructure
      homepage.name: Traefik
      homepage.icon: traefik.png
      homepage.href: https://traefik.${DOMAIN}/api
      homepage.widget.type: traefik
      homepage.description: Reverse proxy entrypoint for all services with TLS, Cloudflare integration, and auth middleware
    restart: always
```

 
must be compatible with this configuration (see the labels for how i plan to use it):

```


  redis:
    # 🔹🔹 Redis 🔹🔹
    # NOTE: If you want to use Valkey (open source) instead of Redis (source available),
    # uncomment the Valkey statement and comment out the Redis statement.
    # Using Valkey with Firecrawl is untested and not guaranteed to work. Use with caution.
    image: docker.io/redis:alpine
    # image: valkey/valkey:alpine
    container_name: redis
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
      - publicnet
    expose:
      - ${REDIS_PORT:-6379}
    volumes:
      - ${CONFIG_PATH:-./configs}/redis:/data
    environment:
      REDIS_HOST: ${REDIS_HOST:-redis}
      REDIS_PORT: ${REDIS_PORT:-6379}
      REDIS_DATABASE: ${REDIS_DATABASE:-0}
      REDIS_USERNAME: ${REDIS_USERNAME:-default}
      REDIS_PASSWORD: ${REDIS_PASSWORD:-redis}
    command: redis-server --appendonly yes --save 60 1 --bind 0.0.0.0
    labels:
      traefik.enable: true
      traefik.tcp.routers.redis.rule: HostSNI(*)
      traefik.tcp.routers.redis.entrypoints: redis
    healthcheck:
      test: ["CMD-SHELL", "redis-cli ping > /dev/null 2>&1 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
    cpu_shares: 10
    mem_reservation: 200M
    deploy:
      resources:
        reservations:
          cpus: 0
          memory: 200M
        limits:
          cpus: 0.5
          memory: 4G
    restart: always
```

All redis instances on all my nodes will use the exact above configuration. Provide a full solution. Research traefik documentations for the CLI relevant for configuring the **tcp router**, ensuring it can both **loadbalance** it ***AND*** support it as a provider.

## Assistant

_Time: 2025-08-23T01:17:37.042Z_



## User

_Time: 2025-08-23T01:18:05.565Z_

nah i want to use traefik. please add a tcp router for traefik to my configuration:

```
  coolify-proxy:
    # 🔹🔹 Traefik 🔹🔹
    depends_on:
      - crowdsec
      - failover-proxy
      - nginx-traefik-extensions
    image:  docker.io/traefik:latest
    container_name: coolify-proxy
    hostname: coolify-proxy
    extra_hosts:
      - 'host.docker.internal:host-gateway'
    networks:
      - coolify
      - consul-net
    expose:
      - 8080          # Dashboard API
    ports:
      - 80:80         # HTTP
      - 443:443       # HTTPS
      - 443:443/udp   # HTTPS/3
      - 853:853       # DNS over TLS
    cap_add:
      - NET_ADMIN
    volumes:
      - /data/coolify/proxy/traefik/dynamic:/traefik/dynamic
      - /data/coolify/proxy/certs:/certs
      - /data/coolify/proxy/traefik/config:/config
      - /data/coolify/proxy/traefik/plugins-local:/plugins-local
      - /var/run/docker.sock:/var/run/docker.sock:ro  # ro = read-only access to the docker.sock
      - /data/coolify/proxy/traefik/etc/traefik:/etc/traefik/  # Put the provided fileConfig.yml files at this location
      - /data/coolify/proxy/logs:/logs
    #      - /etc/localtime:/etc/localtime:ro
    configs:
      - source: traefik-dynamic.yaml
        target: /traefik/dynamic/dynamic.yaml
        mode: 0644
    environment:
      LETS_ENCRYPT_EMAIL: ${LETS_ENCRYPT_EMAIL:?}
      CLOUDFLARE_EMAIL: ${CLOUDFLARE_EMAIL:?}
      CLOUDFLARE_DNS_API_TOKEN: ${CLOUDFLARE_DNS_API_TOKEN:?}
      CLOUDFLARE_ZONE_API_TOKEN: ${CLOUDFLARE_ZONE_API_TOKEN:?}
      DUCKDNS_TOKEN: ${DUCKDNS_TOKEN:?}
    logging:
      driver: syslog
      options:
        syslog-address: unix:///var/run/docker.sock # or UDP/TCP syslog
        tag: "{{.Name}}"
    command:
      - '--accessLog=true'
      - '--accessLog.bufferingSize=0'
      - '--accessLog.fields.headers.defaultMode=drop'
      - '--accessLog.fields.headers.names.User-Agent=keep'
      - '--accessLog.filePath=/logs/traefik.log'
      - '--accessLog.filters.statusCodes=200-299,400-599'
      - '--accessLog.format=json'
      - '--metrics.prometheus.buckets=0.1,0.3,1.2,5.0'
      - '--api.dashboard=true'
      - '--api.debug=true'
      - '--api.disableDashboardAd=true'
      - '--api.insecure=false'
      - '--certificatesResolvers.letsencrypt.acme.caServer=https://acme-v02.api.letsencrypt.org/directory'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.provider=cloudflare'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.resolvers=1.1.1.1,8.8.8.8,1.0.0.1'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge=true'
      - '--certificatesResolvers.letsencrypt.acme.email=${LETS_ENCRYPT_EMAIL:?}'
      - '--certificatesResolvers.letsencrypt.acme.httpChallenge.entryPoint=http'
      - '--certificatesResolvers.letsencrypt.acme.httpChallenge=true'
      - '--certificatesResolvers.letsencrypt.acme.storage=/certs/acme.json'
      - '--certificatesResolvers.letsencrypt.acme.tlsChallenge=true'
      - '--entryPoints.dot.address=:853'
      - '--entryPoints.http.address=:80'
      - '--entryPoints.http.forwardedHeaders.trustedIPs=103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,104.16.0.0/13,104.24.0.0/14,108.162.192.0/18,131.0.72.0/22,141.101.64.0/18,162.158.0.0/15,172.64.0.0/13,173.245.48.0/20,188.114.96.0/20,190.93.240.0/20,197.234.240.0/22,198.41.128.0/17,2400:cb00::/32,2606:4700::/32,2803:f800::/32,2405:b500::/32,2405:8100::/32,2a06:98c0::/29,2c0f:f248::/32'
      - '--entryPoints.http.http.encodeQuerySemiColons=true'
      - '--entryPoints.http.http.middlewares=crowdsec@file'
      - '--entryPoints.http.http2.maxConcurrentStreams=250'
      - '--entryPoints.https.address=:443'
      - '--entryPoints.https.forwardedHeaders.trustedIPs=103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,104.16.0.0/13,104.24.0.0/14,108.162.192.0/18,131.0.72.0/22,141.101.64.0/18,162.158.0.0/15,172.64.0.0/13,173.245.48.0/20,188.114.96.0/20,190.93.240.0/20,197.234.240.0/22,198.41.128.0/17,2400:cb00::/32,2606:4700::/32,2803:f800::/32,2405:b500::/32,2405:8100::/32,2a06:98c0::/29,2c0f:f248::/32'
      - '--entryPoints.https.http.encodeQuerySemiColons=true'
      - '--entryPoints.https.http.middlewares=crowdsec@file'
      - '--entryPoints.https.http.tls.certResolver=letsencrypt'
      - '--entryPoints.https.http.tls.domains[0].main=${DOMAIN}'
      - '--entryPoints.https.http.tls.domains[0].sans=*.${DOMAIN},*.${TS_HOSTNAME}.${DOMAIN}'
      - '--entryPoints.https.http.tls=true'
      - '--entryPoints.https.http2.maxConcurrentStreams=250'
      - '--entryPoints.https.http3'
      - '--global.checkNewVersion=true'
      - '--global.sendAnonymousUsage=false'
      - '--log.level=INFO'
      - '--ping=true'
      - '--providers.docker.defaultRule=Host(`{{ normalize .ContainerName }}.${DOMAIN}`) || Host(`{{ normalize .ContainerName }}.${TS_HOSTNAME}.${DOMAIN}`)'
      - '--providers.docker.exposedByDefault=false'
      - '--providers.docker=true'
      - '--providers.file.directory=/traefik/dynamic/'
      - '--providers.file.watch=true'
      - '--serversTransport.insecureSkipVerify=true'
      - '--experimental.plugins.bouncer.modulename=github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin'
      - '--experimental.plugins.bouncer.version=v1.4.2'
    labels:
      traefik.enable: true
      traefik.http.routers.traefik.service: api@internal
      traefik.http.routers.traefik.rule: Host(`traefik.${DOMAIN}`) || Host(`traefik.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.services.traefik.loadbalancer.server.port: 8080
#      traefik.http.middlewares.legalbar.plugin.bodyreplace.replacements[0].search: </body>
#      traefik.http.middlewares.legalbar.plugin.bodyreplace.replacements[0].replace: <div style='position:fixed;bottom:0;width:100%;background:#222;color:#fff;text-align:center;padding:6px;font-size:14px;z-index:9999;'><a href="https://${DOMAIN}/privacy-policy" style="color:#fff;margin:0 10px;">Privacy Policy</a> | <a href="https://${DOMAIN}/terms" style="color:#fff;margin:0 10px;">Terms</a> | <a href="https://${DOMAIN}/cookies-policy" style="color:#fff;margin:0 10px;">Cookies Policy</a> — © ${DOMAIN}</div></body>
      homepage.group: Infrastructure
      homepage.name: Traefik
      homepage.icon: traefik.png
      homepage.href: https://traefik.${DOMAIN}/api
      homepage.widget.type: traefik
      homepage.description: Reverse proxy entrypoint for all services with TLS, Cloudflare integration, and auth middleware
    restart: always
```

 
must be compatible with this configuration (see the labels for how i plan to use it):

```


  redis:
    # 🔹🔹 Redis 🔹🔹
    # NOTE: If you want to use Valkey (open source) instead of Redis (source available),
    # uncomment the Valkey statement and comment out the Redis statement.
    # Using Valkey with Firecrawl is untested and not guaranteed to work. Use with caution.
    image: docker.io/redis:alpine
    # image: valkey/valkey:alpine
    container_name: redis
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
      - publicnet
    expose:
      - ${REDIS_PORT:-6379}
    volumes:
      - ${CONFIG_PATH:-./configs}/redis:/data
    environment:
      REDIS_HOST: ${REDIS_HOST:-redis}
      REDIS_PORT: ${REDIS_PORT:-6379}
      REDIS_DATABASE: ${REDIS_DATABASE:-0}
      REDIS_USERNAME: ${REDIS_USERNAME:-default}
      REDIS_PASSWORD: ${REDIS_PASSWORD:-redis}
    command: redis-server --appendonly yes --save 60 1 --bind 0.0.0.0
    labels:
      traefik.enable: true
      traefik.tcp.routers.redis.rule: HostSNI(*)
      traefik.tcp.routers.redis.entrypoints: redis
    healthcheck:
      test: ["CMD-SHELL", "redis-cli ping > /dev/null 2>&1 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
    cpu_shares: 10
    mem_reservation: 200M
    deploy:
      resources:
        reservations:
          cpus: 0
          memory: 200M
        limits:
          cpus: 0.5
          memory: 4G
    restart: always
```

All redis instances on all my nodes will use the exact above configuration. Provide a full solution. Research traefik documentations for the CLI relevant for configuring the **tcp router**, ensuring it can both **loadbalance** it ***AND*** support it as a provider. Traefik has a 'redis' service discoverer thing configure it to use the loadbalanced redis (ensuring it ALSO includes the local redis in this loadbalanced implementation)

## Assistant

_Time: 2025-08-23T01:22:34.274Z_

### Key Setup for Hosting Multi-Node Redis with Traefik TCP Router

- **Primary Approach**: Use Traefik for Layer 4 TCP load balancing across Redis instances on multiple nodes, with Consul Catalog for service discovery to include all nodes (including local). Add an entrypoint for Redis port 6379 in Traefik, and use a catch-all TCP router. For HA, configure Redis replication with Sentinel, and enable Traefik's Redis provider using Sentinel for dynamic config storage in the load-balanced Redis setup. This ensures the singular entry point (redis.bolabaden.org:6379) remains available if a node goes down, as long as replication is set up and Traefik can discover remaining instances via Consul.
- **Compatibility**: Works with the provided Docker Compose snippets without Swarm. Traefik's Docker provider handles local discovery, while Consul Catalog extends to multi-node. All tools are free and open-source.
- **Limitations and Hedging**: Research suggests Traefik excels at L4 TCP load balancing but is not protocol-aware for Redis (e.g., it can't intelligently route writes to master and reads to slaves). This may lead to write errors if connections land on slaves; clients must handle retries or errors. For read-heavy workloads, it seems likely to work reasonably if clients are tolerant, but evidence leans toward using a Redis-specific proxy like Predixy for full read/write splitting. If data consistency is critical, ensure replication is properly configured—independent Redis instances without sync could result in data loss or inconsistency on failover.
- **DNS Setup**: Point `redis.bolabaden.org` A record to your Traefik host's IP (or VIP if using failover-proxy for HA). Clients connect via `redis://redis.bolabaden.org:6379`.

#### Quick Start Steps
1. **Add Registrator for Consul Registration**: Run on each node to register Docker containers to Consul.
2. **Configure Redis Replication and Sentinel**: Set one master, others slaves; add Sentinel on each node for failover.
3. **Update Traefik Config**: Add Redis entrypoint, enable Consul Catalog provider for multi-node discovery, and Redis provider with Sentinel for using the load-balanced Redis for dynamic config.
4. **Add Environment Variables to Redis**: For Consul tags to configure the TCP router.
5. **Test Failover**: Shut down a slave node; Traefik should load balance to remaining instances via Consul.

#### Potential Issues
- **No Protocol Awareness**: Traefik uses weighted round-robin by default for load balancing, but without Redis RESP parsing, writes may fail on slaves. Consider client-side handling or a dedicated proxy if this is a concern.
- **HA for Traefik**: If your failover-proxy handles VIP, use it for port 6379. Otherwise, add Keepalived (free) for a floating IP.
- **Performance**: For high loads, tune Traefik's load balancer weights via Consul tags (e.g., `traefik.tcp.services.redis.loadbalancer.server.weight=2` for local preference).

---

This guide provides a complete, self-contained solution for integrating a TCP router in Traefik to load balance Redis across multiple nodes, using Consul for discovery and Sentinel for Redis HA. It incorporates CLI flags from Traefik documentation for TCP routers, load balancing, and providers. The setup assumes you have Consul running on `consul-net` (e.g., a Consul agent on each node connected to a cluster). All Redis instances are included in load balancing, including local, via Consul registration. The solution is L4-only, with noted limitations for Redis protocol.

#### Prerequisites
- Consul cluster set up across nodes (agents on each, server on one or more for quorum).
- Shared volumes like `/data/coolify` for configs (e.g., via NFS if not local).
- Redis replication: Choose one node as master; configure slaves with `replicaof <master-ip> 6379` in `redis.conf` (mounted via volumes). Use environment variables or per-node configs to differentiate.
- DNS: `redis.bolabaden.org` resolves to Traefik's IP/VIP.
- Tools: All free; no additional costs.

#### Updated Docker Compose Snippets
Here are the modified services. Integrate into your full compose file. Run the same file on each node, with per-node adjustments for replication.

##### Traefik Service (coolify-proxy)
Add the Redis entrypoint, Consul Catalog provider for multi-node discovery, and Redis provider using Sentinel to use the load-balanced Redis for dynamic config. Also add port for Redis.

```
  coolify-proxy:
    # 🔹🔹 Traefik 🔹🔹
    depends_on:
      - crowdsec
      - failover-proxy
      - nginx-traefik-extensions
    image: docker.io/traefik:latest
    container_name: coolify-proxy
    hostname: coolify-proxy
    extra_hosts:
      - 'host.docker.internal:host-gateway'
    networks:
      - coolify
      - consul-net
    expose:
      - 8080          # Dashboard API
    ports:
      - 80:80         # HTTP
      - 443:443       # HTTPS
      - 443:443/udp   # HTTPS/3
      - 853:853       # DNS over TLS
      - 6379:6379     # Redis TCP
    cap_add:
      - NET_ADMIN
    volumes:
      - /data/coolify/proxy/traefik/dynamic:/traefik/dynamic
      - /data/coolify/proxy/certs:/certs
      - /data/coolify/proxy/traefik/config:/config
      - /data/coolify/proxy/traefik/plugins-local:/plugins-local
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /data/coolify/proxy/traefik/etc/traefik:/etc/traefik/
      - /data/coolify/proxy/logs:/logs
    configs:
      - source: traefik-dynamic.yaml
        target: /traefik/dynamic/dynamic.yaml
        mode: 0644
    environment:
      LETS_ENCRYPT_EMAIL: ${LETS_ENCRYPT_EMAIL:?}
      CLOUDFLARE_EMAIL: ${CLOUDFLARE_EMAIL:?}
      CLOUDFLARE_DNS_API_TOKEN: ${CLOUDFLARE_DNS_API_TOKEN:?}
      CLOUDFLARE_ZONE_API_TOKEN: ${CLOUDFLARE_ZONE_API_TOKEN:?}
      DUCKDNS_TOKEN: ${DUCKDNS_TOKEN:?}
    logging:
      driver: syslog
      options:
        syslog-address: unix:///var/run/docker.sock
        tag: "{{.Name}}"
    command:
      - '--accessLog=true'
      - '--accessLog.bufferingSize=0'
      - '--accessLog.fields.headers.defaultMode=drop'
      - '--accessLog.fields.headers.names.User-Agent=keep'
      - '--accessLog.filePath=/logs/traefik.log'
      - '--accessLog.filters.statusCodes=200-299,400-599'
      - '--accessLog.format=json'
      - '--metrics.prometheus.buckets=0.1,0.3,1.2,5.0'
      - '--api.dashboard=true'
      - '--api.debug=true'
      - '--api.disableDashboardAd=true'
      - '--api.insecure=false'
      - '--certificatesResolvers.letsencrypt.acme.caServer=https://acme-v02.api.letsencrypt.org/directory'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.provider=cloudflare'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.resolvers=1.1.1.1,8.8.8.8,1.0.0.1'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge=true'
      - '--certificatesResolvers.letsencrypt.acme.email=${LETS_ENCRYPT_EMAIL:?}'
      - '--certificatesResolvers.letsencrypt.acme.httpChallenge.entryPoint=http'
      - '--certificatesResolvers.letsencrypt.acme.httpChallenge=true'
      - '--certificatesResolvers.letsencrypt.acme.storage=/certs/acme.json'
      - '--certificatesResolvers.letsencrypt.acme.tlsChallenge=true'
      - '--entryPoints.dot.address=:853'
      - '--entryPoints.http.address=:80'
      - '--entryPoints.http.forwardedHeaders.trustedIPs=103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,104.16.0.0/13,104.24.0.0/14,108.162.192.0/18,131.0.72.0/22,141.101.64.0/18,162.158.0.0/15,172.64.0.0/13,173.245.48.0/20,188.114.96.0/20,190.93.240.0/20,197.234.240.0/22,198.41.128.0/17,2400:cb00::/32,2606:4700::/32,2803:f800::/32,2405:b500::/32,2405:8100::/32,2a06:98c0::/29,2c0f:f248::/32'
      - '--entryPoints.http.http.encodeQuerySemiColons=true'
      - '--entryPoints.http.http.middlewares=crowdsec@file'
      - '--entryPoints.http.http2.maxConcurrentStreams=250'
      - '--entryPoints.https.address=:443'
      - '--entryPoints.https.forwardedHeaders.trustedIPs=103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,104.16.0.0/13,104.24.0.0/14,108.162.192.0/18,131.0.72.0/22,141.101.64.0/18,162.158.0.0/15,172.64.0.0/13,173.245.48.0/20,188.114.96.0/20,190.93.240.0/20,197.234.240.0/22,198.41.128.0/17,2400:cb00::/32,2606:4700::/32,2803:f800::/32,2405:b500::/32,2405:8100::/32,2a06:98c0::/29,2c0f:f248::/32'
      - '--entryPoints.https.http.encodeQuerySemiColons=true'
      - '--entryPoints.https.http.middlewares=crowdsec@file'
      - '--entryPoints.https.http.tls.certResolver=letsencrypt'
      - '--entryPoints.https.http.tls.domains[0].main=${DOMAIN}'
      - '--entryPoints.https.http.tls.domains[0].sans=*.${DOMAIN},*.${TS_HOSTNAME}.${DOMAIN}'
      - '--entryPoints.https.http.tls=true'
      - '--entryPoints.https.http2.maxConcurrentStreams=250'
      - '--entryPoints.https.http3'
      - '--entryPoints.redis.address=:6379'  # New: Entry point for Redis TCP
      - '--global.checkNewVersion=true'
      - '--global.sendAnonymousUsage=false'
      - '--log.level=INFO'
      - '--ping=true'
      - '--providers.docker.defaultRule=Host(`{{ normalize .ContainerName }}.${DOMAIN}`) || Host(`{{ normalize .ContainerName }}.${TS_HOSTNAME}.${DOMAIN}`)'
      - '--providers.docker.exposedByDefault=false'
      - '--providers.docker=true'
      - '--providers.file.directory=/traefik/dynamic/'
      - '--providers.file.watch=true'
      - '--providers.consulcatalog=true'  # New: Enable Consul Catalog for multi-node discovery
      - '--providers.consulcatalog.endpoint.address=consul:8500'  # Adjust if Consul address differs
      - '--providers.consulcatalog.exposedByDefault=false'  # Only expose services with traefik.enable tag
      - '--providers.consulcatalog.refreshInterval=15s'  # Polling interval for service updates
      - '--providers.redis=true'  # New: Enable Redis provider using load-balanced Redis
      - '--providers.redis.rootKey=traefik'  # Root key for dynamic configs in Redis
      - '--providers.redis.sentinel.masterName=mymaster'  # Sentinel master name
      - '--providers.redis.endpoints=sentinel-node1:26379,sentinel-node2:26379,sentinel-node3:26379'  # Sentinel addresses across nodes
      - '--providers.redis.sentinel.replicaStrategy=true'  # Load balance reads across replicas
      - '--providers.redis.sentinel.useDisconnectedReplicas=true'  # Use disconnected replicas if needed
      - '--serversTransport.insecureSkipVerify=true'
      - '--experimental.plugins.bouncer.modulename=github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin'
      - '--experimental.plugins.bouncer.version=v1.4.2'
    labels:
      traefik.enable: true
      traefik.http.routers.traefik.service: api@internal
      traefik.http.routers.traefik.rule: Host(`traefik.${DOMAIN}`) || Host(`traefik.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.services.traefik.loadbalancer.server.port: 8080
      homepage.group: Infrastructure
      homepage.name: Traefik
      homepage.icon: traefik.png
      homepage.href: https://traefik.${DOMAIN}/api
      homepage.widget.type: traefik
      homepage.description: Reverse proxy entrypoint for all services with TLS, Cloudflare integration, and auth middleware
    restart: always
```

##### Redis Service
Add environment variables for Consul registration via registrator. Remove original Traefik labels (now handled by Consul tags). Add replication settings (adjust per node).

```
  redis:
    image: docker.io/redis:alpine
    container_name: redis
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
      - publicnet
      - consul-net  # Add for Consul access if needed
    expose:
      - ${REDIS_PORT:-6379}
    volumes:
      - ${CONFIG_PATH:-./configs}/redis:/data
      - ${CONFIG_PATH:-./configs}/redis.conf:/usr/local/etc/redis/redis.conf  # Mount custom conf for replication
    environment:
      REDIS_HOST: ${REDIS_HOST:-redis}
      REDIS_PORT: ${REDIS_PORT:-6379}
      REDIS_DATABASE: ${REDIS_DATABASE:-0}
      REDIS_USERNAME: ${REDIS_USERNAME:-default}
      REDIS_PASSWORD: ${REDIS_PASSWORD:-redis}
      SERVICE_NAME: redis  # Consul service name (all nodes register under this for load balancing)
      SERVICE_TAGS: traefik.enable=true,traefik.tcp.routers.redis.rule=HostSNI(`*`),traefik.tcp.routers.redis.entrypoints=redis,traefik.tcp.routers.redis.service=redis,traefik.tcp.services.redis.loadbalancer.server.port=6379  # Tags for TCP router and service
    command: redis-server /usr/local/etc/redis/redis.conf --appendonly yes --save 60 1 --bind 0.0.0.0
    healthcheck:
      test: ["CMD-SHELL", "redis-cli ping > /dev/null 2>&1 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
    cpu_shares: 10
    mem_reservation: 200M
    deploy:
      resources:
        reservations:
          cpus: 0
          memory: 200M
        limits:
          cpus: 0.5
          memory: 4G
    restart: always
```

- **Replication Config (redis.conf example)**: Mount this file. For master node:
  ```
  protected-mode no
  ```
  For slave nodes:
  ```
  protected-mode no
  replicaof <master-ip> 6379
  ```

##### Sentinel Service (Add New)
Run on each node for Redis HA and failover.

```
  redis-sentinel:
    image: docker.io/redis:alpine
    container_name: redis-sentinel
    networks:
      - backend
      - consul-net
    volumes:
      - ${CONFIG_PATH:-./configs}/sentinel.conf:/etc/redis/sentinel.conf
    command: redis-sentinel /etc/redis/sentinel.conf
    restart: always
```

- **sentinel.conf Example** (same on all nodes):
  ```
  port 26379
  daemonize no
  protected-mode no
  sentinel monitor mymaster <master-ip> 6379 2  # Quorum of 2 (adjust for node count)
  sentinel down-after-milliseconds mymaster 5000
  sentinel failover-timeout mymaster 10000
  sentinel parallel-syncs mymaster 1
  ```

##### Registrator Service (Add New)
Run on each node to register local containers (including Redis) to Consul.

```
  registrator:
    image: gliderlabs/registrator:latest
    container_name: registrator
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock
    command:
      - -internal  # Use internal container ports
      - consul://consul:8500  # Consul address
    networks:
      - consul-net
    restart: always
```

#### Configuration Explanation
- **TCP Router Setup**: Using CLI flags from Traefik docs, added `--entryPoints.redis.address=:6379` for the entry point. The router is defined via Consul tags on Redis (`HostSNI(`*`)` for catch-all on the Redis entrypoint). This routes TCP traffic to the `redis` service.
- **Load Balancing**: Traefik uses weighted round-robin by default for TCP services with multiple servers (discovered via Consul). All Redis instances (local and remote) are included as servers under the `redis` service. You can tune weights via tags like `traefik.tcp.services.redis.loadbalancer.server.weight=2` for local preference.
- **Multi-Node Discovery**: Consul Catalog provider (`--providers.consulcatalog=true`) polls Consul for services. Registrator registers each local Redis, syncing across the cluster. If a node goes down, its registration expires, and Traefik load balances to remaining instances.
- **Redis Provider for Dynamic Config**: Configured with Sentinel (`--providers.redis.sentinel.masterName=mymaster`) to use the HA/load-balanced Redis for storing dynamic configs (e.g., routers/services). This includes local Redis as part of the replicated setup. Sentinel handles failover; replicaStrategy load balances reads across slaves.
- **Compatibility with Original Labels**: Original Redis Traefik labels are replaced by equivalent Consul tags. This ensures local Docker provider doesn't conflict, while Consul extends to multi-node.

#### Testing and Monitoring
- **Verify Discovery**: Check Traefik dashboard (https://traefik.${DOMAIN}) for the `redis` TCP router and service with multiple servers.
- **Failover Test**: Stop Redis on one node; Sentinel promotes a slave if master. Consul deregisters the down instance after ~15s refresh; Traefik updates load balancing.
- **Client Connection**: Use `redis-cli -h redis.bolabaden.org -p 6379` to test. Monitor for write errors on slaves.
- **Logs**: Traefik logs (/logs/traefik.log) for routing; Consul UI for service registrations.
- **Scaling**: Add more nodes; registrator auto-registers new Redis. For weighted balancing, adjust tags.

#### Configuration Summary Table

| Component | Key CLI Flags/Tags | Purpose | Notes |
|-----------|--------------------|---------|-------|
| Traefik EntryPoint | `--entryPoints.redis.address=:6379` | Listens for TCP on 6379 | Dedicated for Redis; expose port in compose |
| TCP Router | `traefik.tcp.routers.redis.rule=HostSNI(`*`)`, `traefik.tcp.routers.redis.entrypoints=redis` | Catch-all routing | Defined in Consul tags; non-TLS compatible |
| Load Balancer | Implicit in service with multiple servers | Round-robin across nodes | Tune with `traefik.tcp.services.redis.loadbalancer.server.weight` tag |
| Consul Catalog | `--providers.consulcatalog=true`, `--providers.consulcatalog.endpoint.address=consul:8500` | Multi-node discovery | Polls every 15s; includes local via registrator |
| Redis Provider | `--providers.redis=true`, `--providers.redis.sentinel.masterName=mymaster`, `--providers.redis.endpoints=<sentinel-ips>:26379` | Uses load-balanced Redis for config | Sentinel for HA; replicaStrategy for read load balancing |
| Registrator | Command: `-internal consul://consul:8500` | Registers local containers to Consul | Auto-includes local Redis |
| Sentinel | `sentinel monitor mymaster <master-ip> 6379 2` | Redis failover | Run on all nodes; quorum-based promotion |

This setup provides a singular, load-balanced entry point with basic HA, but consider a protocol-aware proxy for advanced Redis handling.

### Key Citations
- [Traefik Consul Catalog Provider](https://doc.traefik.io/traefik/providers/consul-catalog/)
- [Traefik TCP Routers](https://doc.traefik.io/traefik/routing/routers/tcp/)
- [Traefik Load Balancing](https://doc.traefik.io/traefik/routing/services/load-balancer/)
- [Traefik Redis Provider](https://doc.traefik.io/traefik/providers/redis/)
- [Traefik EntryPoints](https://doc.traefik.io/traefik/routing/entrypoints/)
- [Gliderlabs Registrator](https://github.com/gliderlabs/registrator)
- [Traefik TCP Without TLS](https://community.traefik.io/t/traefik-tcp-router-without-tls/22480)
- [Redis Sentinel Docs](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/)
