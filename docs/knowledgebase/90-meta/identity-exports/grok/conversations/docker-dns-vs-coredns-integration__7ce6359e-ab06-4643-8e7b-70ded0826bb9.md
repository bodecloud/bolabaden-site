---
source_url: "https://grok.com/c/7ce6359e-ab06-4643-8e7b-70ded0826bb9"
conversation_id: "7ce6359e-ab06-4643-8e7b-70ded0826bb9"
title: "Docker DNS vs. CoreDNS Integration"
extracted_at: "2026-06-29T16:33:35.607Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Docker DNS vs. CoreDNS Integration

Source: [Grok conversation](https://grok.com/c/7ce6359e-ab06-4643-8e7b-70ded0826bb9)

## User

_Time: 2025-08-24T02:49:14.125Z_

how does docker dns work and why is it i can't run coredns alongside it? if i'm running docker containers i mean, it inherently runs dns on port 53. can i use docker's dns as a replacement for stuff i'd want to otherwise do with coredns? basically am trying to setup a magicdns alternative for my tailscale/headscale configuration/mesh

## Assistant

_Time: 2025-08-24T02:51:08.082Z_

### Key Points
- Docker's built-in DNS primarily enables name resolution between containers on the same network, using an internal server at 127.0.0.11:53 within container namespaces—it does not inherently bind to port 53 on the host machine, so any conflict with CoreDNS likely stems from host-level services (like systemd-resolved) occupying port 53 when trying to expose CoreDNS externally.
- You can run CoreDNS alongside Docker containers by avoiding host port conflicts, such as disabling the host's DNS stub listener or mapping CoreDNS to an alternative port, though this may require adjustments to your system's DNS configuration.
- Docker's DNS is limited to container-to-container resolution and cannot fully replace CoreDNS for advanced use cases like custom zones, forwarding, or VPN mesh name resolution; however, for basic internal container discovery, it might suffice in isolated setups.
- For a MagicDNS alternative in your Tailscale/Headscale setup, Headscale natively supports MagicDNS-like functionality, allowing automatic node name resolution (e.g., "node1.example.com") without needing CoreDNS—enable it in Headscale's config for a seamless mesh experience, though integrating an external DNS like CoreDNS is possible for more complex routing.

### How Docker DNS Works
Docker includes an embedded DNS resolver managed by the Docker daemon (dockerd) to allow containers to discover and communicate with each other by name rather than IP addresses. When containers are connected to the same Docker network (e.g., bridge or user-defined), Docker automatically creates DNS entries for them using their container names or aliases. This resolution happens via a virtual DNS server accessible inside containers at the loopback address 127.0.0.11 on port 53. External DNS queries (e.g., to the internet) are forwarded to the host's configured DNS servers, as defined in /etc/resolv.conf on the host. This setup is efficient for microservices but doesn't expose a DNS service on the host's port 53, avoiding direct interference with external tools unless you're publishing ports.

### Resolving Conflicts with CoreDNS
The inability to run CoreDNS alongside Docker often arises not from Docker itself but from host services binding to port 53. On many Linux distributions, systemd-resolved listens on 127.0.0.53:53 for local DNS stubs, preventing containers from mapping their internal port 53 to the host's port 53 (e.g., via `-p 53:53`). To mitigate this:
- Disable the stub listener by editing /etc/systemd/resolved.conf to set `DNSStubListener=no`, then restart the service with `sudo systemctl restart systemd-resolved`.
- Alternatively, run CoreDNS without publishing to host port 53 (for internal Docker use only) or map it to a different host port (e.g., `-p 1053:53`) and configure clients to query that port.
This allows CoreDNS to operate in a container for custom DNS needs, such as forwarding or caching, without clashing.

### Using Docker DNS as a CoreDNS Replacement
While Docker's DNS handles basic container name resolution effectively, it's not a direct substitute for CoreDNS in broader scenarios. Docker DNS lacks features like plugin-based extensibility, custom zone files, or external forwarding rules that CoreDNS provides. If your goal is solely intra-container communication in a Docker environment, Docker DNS could work as a lightweight alternative—containers can resolve each other automatically without extra setup. However, for your Tailscale/Headscale mesh, where you need VPN-wide name resolution, Docker DNS won't suffice, as it's confined to Docker networks.

### Setting Up a MagicDNS Alternative for Headscale
Headscale, as an open-source Tailscale control server alternative, includes built-in support for MagicDNS-equivalent features to resolve node names in your mesh. In your Headscale configuration file (typically config.yaml), enable it under the `dns` section: set `magic_dns: true` and define a `base_domain` (e.g., "mytailnet.com"). This allows nodes to be addressed as "<node-name>.mytailnet.com" across the network. Headscale pushes these DNS settings to connected clients, similar to Tailscale. For added flexibility, you can define extra DNS records statically or via a monitored JSON file. If you still want CoreDNS integration (e.g., as an upstream resolver), configure Headscale's `nameservers` to point to your CoreDNS instance's IP, ensuring no port conflicts as described above. This setup provides a reliable, self-hosted MagicDNS alternative without relying on Tailscale's cloud.

---

Docker's DNS system is designed to facilitate seamless communication within containerized environments. It operates through the Docker daemon, which maintains a DNS server for each user-defined network. When a container joins a network, Docker assigns it an IP and creates a DNS entry based on the container's name (or --hostname if specified). Resolution queries from containers are directed to 127.0.0.11:53, a loopback address in the container's network namespace. This server first checks for internal container names; if not found, it forwards to upstream DNS servers inherited from the host. For example, in a compose setup with services "app" and "db", "app" can ping "db" directly. This is efficient for service discovery but limited— it doesn't support custom domains outside Docker networks or advanced features like DNSSEC.

Potential conflicts with CoreDNS typically occur when deploying CoreDNS in a Docker container and attempting to expose it externally. CoreDNS defaults to listening on port 53 (UDP/TCP), and if you use Docker's port publishing (e.g., -p 53:53/udp), it fails if the host's port 53 is occupied. Common culprits include systemd-resolved (on Ubuntu/Debian) or other DNS proxies. To resolve:
- Identify the conflicting process with `sudo lsof -i :53` or `netstat -tuln | grep 53`.
- For systemd-resolved, edit /etc/systemd/resolved.conf to include `DNSStubListener=no`, restart with `sudo systemctl restart systemd-resolved`, and link /etc/resolv.conf to /run/systemd/resolve/resolv.conf for continued host resolution.
- Run CoreDNS on an alternate port inside the container and adjust client queries accordingly, or use host networking mode (--network host) cautiously, as it bypasses Docker's isolation.

Comparing Docker's internal DNS to CoreDNS for container resolution reveals key differences:

| Feature                  | Docker Internal DNS                          | CoreDNS                                      |
|--------------------------|----------------------------------------------|----------------------------------------------|
| **Scope**                | Limited to containers on the same Docker network | Flexible for containers, hosts, or clusters; supports custom zones and plugins |
| **Port Usage**           | Internal only (127.0.0.11:53 in namespace)  | Defaults to :53; can be remapped to avoid conflicts |
| **Extensibility**        | Basic name-to-IP mapping; no plugins         | Highly extensible with plugins (e.g., etcd, Kubernetes integration) |
| **Caching/Forwarding**   | Minimal forwarding to host DNS               | Advanced caching, conditional forwarding, and rewriting |
| **Use Case Fit**         | Simple microservices in Docker               | Advanced setups like homelabs, VPNs, or Kubernetes |
| **Performance**          | Lightweight, sub-millisecond for internal queries | Fast, with optional caching for repeated queries |
| **Setup Complexity**     | Automatic in Docker networks                 | Requires configuration file (Corefile) and deployment |

Docker DNS isn't suitable as a full CoreDNS replacement for your needs, as it can't handle external or VPN-specific resolutions. CoreDNS excels in scenarios requiring custom logic, such as integrating with etcd for dynamic records or serving as a recursive resolver.

For your Tailscale/Headscale MagicDNS alternative, Headscale provides robust DNS capabilities mirroring Tailscale's. Enable MagicDNS in Headscale's config.yaml:
```
dns:
  magic_dns: true
  base_domain: "yourdomain.com"
  nameservers:
    - 8.8.8.8
    - 1.1.1.1
  extra_records:
    - name: "extra.yourdomain.com"
      type: "A"
      value: "192.168.1.100"
```
This configures automatic resolution for nodes (e.g., "laptop.yourdomain.com" points to its Tailscale IP). Headscale monitors changes if using an external JSON for extra records, allowing dynamic updates. Clients receive these settings upon connecting, using a virtual DNS IP (similar to Tailscale's 100.100.100.100) without binding to host port 53. If integrating CoreDNS, set it as a nameserver in Headscale's config for split DNS or fallback resolution. This avoids the need for a separate MagicDNS implementation, providing a self-hosted mesh with empathetic handling of network complexities—acknowledge that setups may vary by OS, and testing with tools like dig is recommended to verify resolution.

In controversial or debated setups (e.g., self-hosting vs. cloud Tailscale), evidence leans toward Headscale as a viable alternative for privacy-focused users, though it lacks some polished features like iOS app integration without workarounds.

**Key Citations:**
- [Docker Documentation on Container Networking](https://docs.docker.com/config/containers/container-networking/) 
- [Exposing Docker's Internal DNS with CoreDNS](https://theorangeone.net/posts/expose-docker-internal-dns/) 
- [Headscale DNS Reference](https://headscale.net/stable/ref/dns/) 
- [Tailscale MagicDNS Documentation](https://tailscale.com/kb/1081/magicdns) 
- [Running CoreDNS in a Container](https://dev.to/robbmanes/running-coredns-as-a-dns-server-in-a-container-1d0) 
- [DNS Resolution in Docker Containers](https://stackoverflow.com/questions/62968807/dns-resolution-in-docker-containers) 

## User

_Time: 2025-08-24T02:58:59.749Z_

i need a complete and comprehensive guide for setting up a magicdns alternative for my headscale/tailscale setup compatible with docker and doesn't conflict with docker's usage of dns port 53. Only lookup core dns if it's determined to be the absolute best, assume it's not

## Assistant

_Time: 2025-08-24T03:02:03.456Z_

### Key Points
- Headscale's built-in MagicDNS provides a seamless alternative to Tailscale's MagicDNS, enabling automatic node name resolution across your mesh network without requiring an external DNS server or binding to port 53 on the host, thus avoiding conflicts with Docker's internal DNS usage.<grok:render card_id="e637d7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render><grok:render card_id="d2d84b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">56</argument>
</grok:render>
- It seems likely that this setup works well for most users, though some platform-specific issues, like overriding local DNS on macOS, may require toggling client settings to maintain balance between tailnet and local resolutions.<grok:render card_id="276b38" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render>
- Evidence leans toward using Headscale's native features first, as they are lightweight and integrated, but if advanced DNS control is needed, tools like dnsmasq in a Docker container can supplement without port conflicts by not exposing port 53 externally.<grok:render card_id="87e33c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">67</argument>
</grok:render><grok:render card_id="36b944" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">55</argument>
</grok:render>
- The approach acknowledges potential complexities in Docker environments, such as resolv.conf overwrites, and emphasizes empathetic handling of service dependencies to ensure reliable operation for all users.

### Overview of Headscale MagicDNS Alternative
Headscale, as a self-hosted Tailscale control server, includes built-in support for MagicDNS-like functionality. This allows nodes in your tailnet to resolve each other's names automatically (e.g., "laptop.mytailnet.com") using a virtual DNS IP handled by the Tailscale client daemon, typically 100.100.100.100.<grok:render card_id="a76b82" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">56</argument>
</grok:render> Unlike traditional DNS servers, this doesn't involve running a service on the host's port 53, making it fully compatible with Docker setups where Docker uses 127.0.0.11:53 internally for container resolution.<grok:render card_id="bc43c2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render> You configure it directly in Headscale's config.yaml, pushing DNS settings to connected clients without host-level conflicts.

### Basic Setup Steps
1. Install Headscale in Docker using a compose file, ensuring volumes for config and data.
2. Enable `magic_dns: true` in config.yaml, set `base_domain` to your owned domain, and add nameservers like 1.1.1.1 for fallback resolution.<grok:render card_id="d7d639" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">57</argument>
</grok:render>
3. Connect Tailscale clients to Headscale using `tailscale up --login-server=https://your-headscale-url`.
4. Test resolution with `ping node-name.your-base-domain` from connected devices.
For details, see the official Headscale DNS reference at https://headscale.net/stable/ref/dns/.<grok:render card_id="6ebea2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render>

### Potential Alternatives and Enhancements
If the built-in MagicDNS lacks features like custom forwarding, consider dnsmasq in a separate Docker container connected to your tailnet.<grok:render card_id="c16466" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">53</argument>
</grok:render> Run it without publishing port 53 to the host (e.g., internal network only) to avoid conflicts, and configure Headscale to use it as a nameserver. This provides more control, such as split-horizon DNS, while remaining compatible.<grok:render card_id="4a2119" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">79</argument>
</grok:render> Avoid CoreDNS unless absolutely necessary, as alternatives like dnsmasq are often simpler for this use case.

---

Headscale offers a robust, self-hosted alternative to Tailscale's MagicDNS, enabling seamless name resolution in your mesh network while ensuring compatibility with Docker environments. This comprehensive guide covers everything from foundational concepts to advanced configurations, troubleshooting, and enhancements. It draws on official documentation, community insights, and practical examples to provide a thorough, step-by-step approach. Whether you're new to Headscale or optimizing an existing setup, this resource aims to address common pitfalls, including DNS conflicts in containerized systems, and empower you to build a reliable, private VPN mesh.

#### Understanding MagicDNS in the Context of Headscale and Tailscale
MagicDNS is Tailscale's feature for automatic DNS resolution of device names within the tailnet, eliminating the need to remember IPs.<grok:render card_id="788a97" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render> It works by registering node names (e.g., "server") as fully qualified domain names (FQDNs) like "server.tailnet-name.ts.net," resolvable only within the network. Resolution is handled client-side via the Tailscale daemon, which intercepts queries at a virtual IP (100.100.100.100) and appends search domains automatically.<grok:render card_id="38d2be" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">56</argument>
</grok:render> This avoids running a traditional DNS server on port 53, preventing conflicts with services like Docker's internal resolver or host-level DNS proxies (e.g., systemd-resolved).

Headscale mirrors this functionality, pushing DNS configurations to clients upon connection.<grok:render card_id="d48108" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render> Unlike Tailscale's cloud-based control plane, Headscale runs on your infrastructure, typically in Docker, and uses the same client-side mechanism. This means no host port binding for DNS, making it inherently compatible with Docker—where containers resolve internally via 127.0.0.11:53 without affecting the host.<grok:render card_id="ca60fb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render> Potential issues arise only if other services (like Pi-hole) compete for port 53, but Headscale itself doesn't.<grok:render card_id="45b7e6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">55</argument>
</grok:render>

#### Prerequisites for Setup
Before diving in, ensure you have:
- A domain name you control (for base_domain).
- Docker and Docker Compose installed.
- Tailscale clients on your devices (download from https://tailscale.com/download).
- Basic knowledge of YAML configuration and networking.
- A server or VM for Headscale (e.g., Ubuntu 22.04+).
Verify no existing port 53 conflicts with `sudo lsof -i :53`. If systemd-resolved is using it, disable the stub listener by editing `/etc/systemd/resolved.conf` to `DNSStubListener=no` and restarting the service.<grok:render card_id="2f52b4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">71</argument>
</grok:render>

#### Step-by-Step Installation of Headscale in Docker
1. **Create Project Directory and Docker Compose File**:
   Create a directory (e.g., `/opt/headscale`) and a `docker-compose.yml` file:
   ```
   version: '3.8'
   services:
     headscale:
       image: headscale/headscale:latest
       container_name: headscale
       volumes:
         - ./config:/etc/headscale
         - ./data:/var/lib/headscale
       ports:
         - "8080:8080"  # HTTP API
       command: serve
       restart: unless-stopped
   ```
   This mounts config and data volumes. No DNS ports are exposed.<grok:render card_id="40ed32" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render>

2. **Configure Headscale's config.yaml**:
   In `./config/config.yaml`, include the DNS section:
   ```
   server_url: https://your-headscale-domain:443  # Use your reverse proxy URL
   listen_addr: 0.0.0.0:8080
   metrics_listen_addr: 127.0.0.1:9090
   grpc_listen_addr: 0.0.0.0:50443
   grpc_allow_insecure: false
   ...
   dns:
     override_local_dns: true  # Enables overriding local DNS for tailnet queries
     nameservers:
       - 1.1.1.1
       - 8.8.8.8  # Fallback upstream servers
     search_domains: []  # Additional search domains (optional)
     extra_records:
       - name: "extra-service.mytailnet.com"
         type: "A"
         value: "100.64.0.5"  # Static records
     magic_dns: true  # Enable MagicDNS
     base_domain: mytailnet.com  # Your owned domain
   ```
   This enables MagicDNS, sets a base domain, and defines fallback nameservers. Extra records allow custom mappings, and changes require restarting Headscale.<grok:render card_id="98a101" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">57</argument>
</grok:render><grok:render card_id="62df45" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render>

3. **Set Up Reverse Proxy (Optional but Recommended)**:
   Use Nginx or Caddy in another container to handle HTTPS for Headscale's API. Example Caddyfile:
   ```
   your-headscale-domain {
     reverse_proxy headscale:8080
   }
   ```
   Obtain SSL certificates via Let's Encrypt.<grok:render card_id="873224" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render>

4. **Start Headscale and Register Users**:
   Run `docker compose up -d`. Create a user: `docker exec -it headscale headscale users create myuser`. Generate pre-auth keys: `docker exec -it headscale headscale preauthkeys create --user myuser --reusable --expiration 24h`.<grok:render card_id="d88cd5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>

5. **Connect Tailscale Clients**:
   On client devices, install Tailscale and run `tailscale up --login-server=https://your-headscale-domain --authkey=your-preauth-key`. Accept DNS changes when prompted.<grok:render card_id="218756" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">56</argument>
</grok:render>

6. **Test MagicDNS Resolution**:
   From a connected client, use `ping other-node.mytailnet.com` or `dig @100.100.100.100 node.mytailnet.com`. If issues, check client logs with `tailscale status`.<grok:render card_id="a11199" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render>

#### Advanced Configurations
- **Dynamic Extra Records**: Use `extra_records_path: /path/to/records.json` in config.yaml for a monitored JSON file. Example JSON:
  ```
  [
    {"name": "dynamic.mytailnet.com", "type": "A", "value": "100.64.0.10"}
  ]
  ```
  Headscale auto-updates on changes.<grok:render card_id="d61bc4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render>
- **Split DNS**: Add specific search_domains in config.yaml to handle multiple zones.
- **Override Local DNS**: Set `override_local_dns: false` if you experience local resolution issues, like on macOS, to let the OS handle lookups.<grok:render card_id="6d902b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render>
- **Integration with External DNS**: Point nameservers to your custom server (e.g., dnsmasq) for advanced forwarding.

#### Using dnsmasq as an Enhancement in Docker
If built-in MagicDNS isn't sufficient (e.g., for ad-blocking or split-horizon), deploy dnsmasq in Docker.<grok:render card_id="954cce" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">53</argument>
</grok:render> Use a container like stumpylog/tailscale-dns-container, which joins your tailnet and provides DNS control.

1. Add to docker-compose.yml:
   ```
   dnsmasq:
     image: stumpylog/tailscale-dns:latest
     volumes:
       - ./dnsmasq.conf:/etc/dnsmasq.d/tailnet.conf
     cap_add:
       - NET_ADMIN
     restart: unless-stopped
   ```
2. In `dnsmasq.conf`:
   ```
   address=/mytailnet.com/100.64.0.1  # Tailnet IP
   server=1.1.1.1  # Upstream
   ```
3. Join tailnet: Run Tailscale auth inside the container.
4. Update Headscale's nameservers to the dnsmasq container's Tailscale IP.
This runs internally without exposing port 53, avoiding conflicts.<grok:render card_id="8b34d6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">67</argument>
</grok:render><grok:render card_id="5155d9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">79</argument>
</grok:render>

#### Troubleshooting Common Issues
- **Port 53 Conflicts**: If using Pi-hole or similar, configure Docker daemon.json with external DNS: `"dns": ["1.1.1.1"]`.<grok:render card_id="6e5c93" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">55</argument>
</grok:render> Manage startup order via systemd dependencies.
- **Resolution Failures**: Check if `accept-dns` is enabled on clients (`tailscale set --accept-dns=true`). For Docker containers, ensure /etc/resolv.conf includes 100.100.100.100.<grok:render card_id="354cc7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">70</argument>
</grok:render>
- **macOS Local DNS Override**: Toggle override_local_dns or use Tailscale's accept-dns flag.<grok:render card_id="cac80a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render>
- **Sporadic Failures**: Verify upstream nameservers are reachable; add multiples for redundancy.<grok:render card_id="0087e7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">68</argument>
</grok:render>

#### Comparison of Approaches

| Approach | Pros | Cons | Docker Compatibility | Port 53 Usage |
|----------|------|------|----------------------|---------------|
| Headscale Built-in MagicDNS | Integrated, lightweight, automatic client push; no extra services needed.<grok:render card_id="b6590d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render> | Limited to basic records; no advanced plugins. | High—no host binding. | None—client-side only. |
| dnsmasq in Docker | Custom forwarding, ad-blocking, split-horizon; easy to extend.<grok:render card_id="6e9f41" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">79</argument>
</grok:render> | Requires additional container; manual tailnet join. | High—internal network mode. | Optional; avoid exposing for no conflict.<grok:render card_id="b494d2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">51</argument>
</grok:render> |
| Other Alternatives (e.g., Unbound, Bind) | Robust for enterprise; caching features. | Heavier setup; potential port conflicts if exposed. | Medium—needs careful port mapping. | Typically requires 53; remap to avoid. |

This table highlights why Headscale's built-in is often the best starting point, with dnsmasq as a strong supplement for enhanced control.

In summary, this setup provides a secure, conflict-free MagicDNS alternative, balancing simplicity and flexibility for your Headscale/Tailscale mesh.

### Key Citations
- https://headscale.net/stable/ref/dns/
- https://tailscale.com/kb/1081/magicdns
- https://github.com/juanfont/headscale/issues/660
- https://www.reddit.com/r/selfhosted/comments/1is5lcj/headscale_dns_conflict/
- https://github.com/stumpylog/tailscale-dns-container
- https://simpsonian.ca/blog/securing-home-network-dnsmasq-tailscale/
- https://github.com/JamesTurland/JimsGarage/blob/main/Headscale/config.yaml
- https://github.com/juanfont/headscale/issues/695
- https://github.com/tailscale/tailscale/issues/14467
- https://discourse.pi-hole.net/t/docker-unable-to-bind-to-port-53/45082
