---
source_url: "https://grok.com/c/2f214d2e-ad15-42e4-8a2d-770f3ae50520"
conversation_id: "2f214d2e-ad15-42e4-8a2d-770f3ae50520"
title: "Ghidra Server Collaboration with Docker Compose"
extracted_at: "2026-06-29T16:12:47.330Z"
message_count: 8
export_suite: "identity"
provenance: grok-rest-api
---

# Ghidra Server Collaboration with Docker Compose

Source: [Grok conversation](https://grok.com/c/2f214d2e-ad15-42e4-8a2d-770f3ae50520)

## User

_Time: 2026-01-12T18:44:15.632Z_

how to run a ghidra server for collaboration? preferably defined in docker-compose.yml? What's the most canonical widely supported way to do so in docker...?

## Assistant

_Time: 2026-01-12T18:44:38.426Z_



## User

_Time: 2026-01-12T18:44:59.665Z_

how to run a ghidra server for collaboration? preferably defined in docker-compose.yml? What's the most canonical widely supported way to do so in docker...?

Main goal is collaboration to the same project via http/tcp. Can this be done with docker-compose.yml?

## Assistant

_Time: 2026-01-12T18:47:53.336Z_

**Key Points**  
- Ghidra's built-in server enables multi-user collaboration on shared projects using a check-in/check-out system over TCP (default port 13100), not HTTP.  
- No official NSA Docker image exists for running the Ghidra server, but reliable community images are widely used and well-maintained.  
- Yes, the server runs easily with docker-compose.yml for configuration, persistence, and management.  
- Clients must match the exact Ghidra version as the server for compatibility; initial user passwords are often "changeme" and should be changed immediately.  

**Recommended Approach**  
The most straightforward and widely adopted method uses community Docker images like `bytehow/ghidra-server` (server-focused) or `blacktop/ghidra` (versatile for server/client). These support persistence via volumes and user creation via environment variables.  

Here’s a canonical docker-compose.yml example based on `bytehow/ghidra-server` (pin the tag to match your Ghidra client version, e.g., `:11.2`):  

```yaml  
version: '3.8'  
services:  
  ghidra-server:  
    image: bytehow/ghidra-server:latest  
    container_name: ghidra-server  
    restart: unless-stopped  
    ports:  
      - "13100:13100"  # Main client connection  
      - "13101:13101"  # Optional: server console  
      - "13102:13102"  # Optional: admin tool  
    volumes:  
      - ./ghidra_repos:/repos  # Persistent repository storage  
    environment:  
      GHIDRA_USERS: "user1 user2 user3"  # Space-separated usernames (admins by default)  
```  

Run with `docker-compose up -d`. Repositories persist in `./ghidra_repos` on the host.  

**Client Connection**  
1. Download and run the official Ghidra client (same version as server) from ghidra-sre.org.  
2. Go to **File > New Project > Shared Project**.  
3. Enter the server host/IP and port (default 13100).  
4. Log in with a created username (initial password often "changeme"—change it on first login).  
5. Create a new repository or join an existing one, then set user permissions (Read Only, Read/Write, Admin).  

**User Management**  
- Initial users are created via the `GHIDRA_USERS` environment variable.  
- To add/remove later: `docker exec -it ghidra-server /ghidra/server/svrAdmin -add <username>` (or `-remove`, etc.). See official Ghidra server docs for full commands.  

---

Ghidra, developed by the NSA, includes a dedicated server component (`ghidraSvr`) designed specifically for multi-user collaboration. This server manages shared repositories where multiple analysts can work on the same reverse engineering project simultaneously. It implements a version control-like system: files are checked out for editing, changes are committed, and permissions control access levels (e.g., read-only users can view but not modify). The primary communication occurs over a Java RMI-based TCP protocol on port 13100, with optional ports 13101 (console) and 13102 (admin). While not HTTP-based, it fully supports networked collaboration as requested.

The official Ghidra distribution (available as a ZIP from ghidra-sre.org or GitHub) includes server scripts but provides no official Docker image or containerization for running the server. The `/docker` directory in the official repository appears related to build/CI processes rather than end-user server deployment. As a result, the community has filled this gap with mature, actively used Docker images that closely replicate the official server setup.

These images automate the official installation process: they download the Ghidra ZIP, run the equivalent of the `server.sh install` script, configure `server.conf`, and start `ghidraSvr`. Key features include persistent volumes for the repository directory (typically mounted to `/repos`), environment-variable-based user creation, and exposure of necessary ports.

### Popular Docker Images for Ghidra Server
The table below compares widely used options:

| Image Name              | GitHub/Docker Hub Link                          | User Creation                          | Persistence Volume | Key Features/Notes                                                                 | 
|-------------------------|-------------------------------------------------|----------------------------------------|--------------------|------------------------------------------------------------------------------------|
| bytehow/ghidra-server   | https://github.com/bytehow/docker-ghidra-server | Env: `GHIDRA_USERS` (space-separated) | /repos            | Server-only; simple setup; detailed collaboration guide; auto-detects public IP   |
| blacktop/ghidra         | https://github.com/blacktop/docker-ghidra       | Env: `GHIDRA_USERS` (space-separated) | /repos            | Supports server, client, headless; includes docker-compose.yml; high Docker Hub pulls |
| bskaggs/ghidra          | https://github.com/bskaggs/ghidra-docker        | Env: `GHIDRA_DEFAULT_USERS` (comma-separated) | Configurable (Helm for k8s) | Container-aware memory limits; k8s-friendly; supports anonymous access flags     |

The `bytehow/ghidra-server` and `blacktop/ghidra` images are among the most referenced for collaboration setups due to their ease of use and clear documentation.

### Detailed docker-compose.yml Example
The provided example uses `bytehow/ghidra-server` for its dedicated focus on server operation. For `blacktop/ghidra`, adapt by adding `command: server` to the service. Always pin the image tag (e.g., `:11.2`) to match your clients—check available tags on Docker Hub or the repository.

Exposing only port 13100 suffices for basic client access; include 13101/13102 if remote admin access is needed. For production/remote access, consider firewall rules, VPN, or reverse proxies, as the default setup uses password authentication (no encryption by default; advanced configs support PKI).

### Advanced Considerations
- **Version Matching**: Mismatches between server and client versions cause connection errors. Use the same Ghidra release (e.g., download from official site and match the Docker tag).
- **Security**: Initial passwords are typically "changeme". Force changes on first login. Avoid exposing ports publicly without additional safeguards.
- **Scaling/Production**: For Kubernetes, the `bskaggs/ghidra` image with its Helm chart provides StatefulSet persistence. For simple Docker, the compose approach is sufficient.
- **Troubleshooting**: Logs are available via `docker logs ghidra-server`. The official `svrREADME.html` (included in Ghidra distributions) details server administration.

This community-driven Docker approach represents the de facto standard for containerized Ghidra collaboration, offering reliability and flexibility while staying close to official behavior.

**Key Citations**  
- https://github.com/bytehow/docker-ghidra-server  
- https://byte.how/posts/collaborative-reverse-engineering/  
- https://github.com/blacktop/docker-ghidra  
- https://github.com/bskaggs/ghidra-docker  
- https://github.com/NationalSecurityAgency/ghidra (official repository, no server Docker)  
- https://ghidra-sre.org/ (official Ghidra downloads and documentation)

## User

_Time: 2026-01-12T19:05:18.650Z_

which one is good for reverse proxying across traefik? and does this ghidra server run a whole ghidra instance in docker or does it just run a server that can be shared between multiple users using ghidra? i need the latter :)

## Assistant

_Time: 2026-01-12T19:06:49.098Z_

**Key Points**  
- All recommended community Docker images (bytehow/ghidra-server, blacktop/ghidra in server mode, bskaggs/ghidra-docker) run **only the Ghidra server component** (ghidraSvr), not a full Ghidra GUI instance. Multiple users connect with separate desktop Ghidra clients for collaboration on shared projects—this exactly matches your requirement.  
- None of these images include built-in support for reverse proxying with Traefik or any HTTP proxy. Ghidra's protocol is Java RMI over plain TCP (default port 13100), so standard HTTP/HTTPS reverse proxying does not work.  
- Traefik can technically handle TCP routing for non-HTTP services, but setups are uncommon, limited (often port-based rather than domain-based without TLS), and offer little advantage over direct port exposure. For secure remote access, VPNs, SSH tunnels, or direct firewall rules are more typical and reliable.  

**Ghidra Server in Docker**  
The container runs solely the server process, managing repositories and handling check-in/check-out for collaborative reverse engineering. No GUI runs inside the container—users must use the official Ghidra desktop client (matching version) to connect over TCP. This lightweight server-only design enables efficient multi-user sharing without resource-heavy instances per user.  

**Reverse Proxying with Traefik**  
Since Ghidra uses plain TCP/RMI (not HTTP), Traefik cannot apply typical HTTP features like path routing, middleware (e.g., authentication), or easy Let's Encrypt TLS termination. Traefik's TCP support exists but requires custom configuration:  

- Define a dedicated TCP entrypoint (e.g., on a specific host port).  
- Route traffic to the Ghidra container's port 13100.  
- Access occurs via `<host>:<port>`, similar to direct exposure.  

Domain-based routing (e.g., ghidra.example.com without a port) is impractical without wrapping the connection in TLS (e.g., via stunnel on server/client), as RMI lacks native TLS and SNI support. Community setups rarely use reverse proxies for Ghidra servers due to these limitations and potential NAT/callback issues (mitigated by setting `-Djava.rmi.server.hostname` in server.conf).  

If you still want to attempt TCP proxying in an existing Traefik setup, here's a basic docker-compose snippet (assuming Traefik is already configured with a TCP entrypoint; adapt as needed):  

```yaml  
version: '3.8'  
services:  
  traefik:  
    # Your existing Traefik service...  
    # Ensure a TCP entrypoint, e.g.:  
    # command:  
    #   - "--entrypoints.ghidratcp.address=:13100"  

  ghidra-server:  
    image: bytehow/ghidra-server:latest  # Or blacktop/ghidra with 'command: server'  
    container_name: ghidra-server  
    restart: unless-stopped  
    volumes:  
      - ./ghidra_repos:/repos  
    environment:  
      GHIDRA_USERS: "user1 user2"  
    labels:  
      - "traefik.enable=true"  
      - "traefik.tcp.routers.ghidra.rule=HostSNI(`*`)"  # Matches any (non-TLS); limited utility  
      - "traefik.tcp.routers.ghidra.entrypoints=ghidratcp"  # Your custom TCP entrypoint  
      - "traefik.tcp.services.ghidra.loadbalancer.server.port=13100"  
```  

This effectively forwards a host port through Traefik but adds complexity without clear benefits for most users.  

---

Ghidra's server architecture is deliberately designed for direct TCP connections in collaborative environments, implementing a check-in/check-out system akin to version control for reverse engineering artifacts (programs, annotations, etc.). The official NSA distribution includes the `ghidraSvr` executable and administration tools, but no containerization—community images handle installation, configuration, and startup automatically while staying faithful to the official behavior.

### Image Comparison for Server-Only Collaboration
All images provide the desired server-only functionality with desktop client connections. Differences lie in features and deployment targets:

| Image                  | Primary Focus                  | User Creation Method                  | Persistence          | Extra Features                          | Proxy/Traefik Support |
|------------------------|--------------------------------|---------------------------------------|----------------------|-----------------------------------------|-----------------------|
| bytehow/ghidra-server  | Dedicated server               | Env: `GHIDRA_USERS` (space-separated) | /repos volume       | Auto-detects public IP; simple, lightweight | None mentioned       |
| blacktop/ghidra        | Multi-mode (server/headless/client) | Env: `GHIDRA_USERS`; command: `server` | /repos volume       | Versatile; high pulls; memory limits    | None mentioned       |
| bskaggs/ghidra-docker  | Server + k8s/headless          | Env: `GHIDRA_DEFAULT_USERS` (comma-separated) | Configurable (Helm PVC) | Container-aware memory; Helm chart; anonymous flags | None mentioned       |

Any of these work equally well for your collaboration goal. bytehow/ghidra-server remains a strong choice for pure Docker simplicity.

### Challenges with Reverse Proxying
Searches across GitHub issues, forums, and blogs reveal no established Traefik (or similar HTTP proxy) integrations for Ghidra servers. Reasons include:  
- RMI's bidirectional nature can cause callback issues behind proxies/NAT (fixed via `java.rmi.server.hostname` property).  
- Lack of HTTP encapsulation means no benefit from Traefik's strengths (automatic certs, middleware).  
- Community preference for direct port forwarding (13100-13102), firewall rules, or overlay networks/VPNs for security.  

For encrypted connections, Ghidra supports PKI-based authentication (not encryption), or external tools like stunnel can wrap TCP in TLS—though this requires client-side configuration too.

If your goal is secure remote collaboration without exposing ports publicly, consider Tailscale/WireGuard/Zerotier for a private overlay network alongside any of these images.

**Key Citations**  
- https://github.com/bytehow/docker-ghidra-server  
- https://github.com/blacktop/docker-ghidra  
- https://github.com/bskaggs/ghidra-docker  
- https://doc.traefik.io/traefik/routing/providers/docker/ (TCP examples)  
- https://github.com/NationalSecurityAgency/ghidra/issues/414 (NAT/proxy issues)  
- https://heyquark.com/sysadmin/2020/11/14/ghidra-tls/ (custom SSL discussion)  
- https://byte.how/posts/collaborative-reverse-engineering/ (collaboration guide)

## User

_Time: 2026-01-12T19:46:13.573Z_

After exposing, how to properly connect to 13101/13102

## Assistant

_Time: 2026-01-12T19:46:45.067Z_

**Key Points**  
- Port **13100** is the main port used by Ghidra clients to connect for collaboration (shared projects, check-in/check-out).  
- Port **13101** handles internal server communication, often used during initial connection setup (e.g., registration or callback mechanisms); clients connect to it automatically as part of the process.  
- Port **13102** is for administrative tools like `svrAdmin` (user management, password resets, repository ops) and the older server console; connect via command-line tools or scripts pointing to the server.  
- After exposing these ports (via docker-compose ports mapping, firewall rules, etc.), clients connect normally to port 13100; the other ports are used transparently by the Ghidra protocol or admin tools—no separate "connection" step is needed for normal users.  
- For NAT/remote setups, set the `-ip` flag (or equivalent in server.conf) to the public-facing IP/hostname to avoid callback failures on ports like 13101.  

**Connecting as a Regular User (Collaboration)**  
Use the official Ghidra desktop client (same version as server):  
- File → New Project → Shared Project  
- Enter server hostname/IP and port **13100** (e.g., `your-server.example.com:13100` or `192.168.1.100:13100`)  
- Authenticate with username/password (default often "changeme"—change immediately)  
The client automatically handles connections to 13101/13102 as needed during handshake and operation. No manual action required for these ports.

**Connecting/Using Administrative Tools (Port 13102)**  
Run `svrAdmin` from inside the container or on a machine with Ghidra installed:  
- `docker exec -it ghidra-server /ghidra/server/svrAdmin -add newuser` (example commands vary by image)  
- Or use full syntax: `svrAdmin -reset username` to reset password to "changeme"  
The tool connects to the server (using 13102 internally) when run against the running server root path. No direct telnet/nc-style connection—it's a Java RMI-based admin interface.

**Troubleshooting Tips**  
- Test basic connectivity: `nc -zv your-server-ip 13100` (and 13101, 13102) should succeed.  
- Check server logs (`docker logs ghidra-server`) for connection attempts or errors.  
- For remote/NAT/cloud: Edit server.conf to include `-ip YOUR_PUBLIC_IP` (or `-ip 0.0.0.0` in some cases), then restart the server.  
- Firewall: Ensure inbound TCP 13100-13102 allowed from client IPs.

---

The Ghidra server uses a base port (default 13100) and occupies the next two sequential ports (13101 and 13102) for its multi-component Java RMI architecture. This design supports the check-in/check-out collaboration model while separating concerns: main client traffic, internal registration/callbacks, and administrative control.

### Port Roles Summary
| Port   | Primary Purpose                              | Who Connects?                          | How to Connect / Usage Notes                                                                 |
|--------|----------------------------------------------|----------------------------------------|----------------------------------------------------------------------------------------------|
| 13100  | Main client endpoint (repository access, project sharing) | Ghidra desktop clients (normal users) | In Ghidra GUI: New Shared Project → enter `host:13100` → login. This is the only port users specify manually. |
| 13101  | Server registration / callback / auxiliary channel (often involved in TLS handshake and RMI binding) | Ghidra clients automatically during connection | No manual connection needed; client opens this as part of initial handshake. Failures here often cause "Connection to server failed (:13101)" errors in NAT setups. |
| 13102  | Administrative interface (svrAdmin tool, legacy console) | Admins via `svrAdmin` script or equivalent | Run `svrAdmin` commands from container (e.g., `docker exec ... svrAdmin -list`) or local Ghidra install. Tool targets the server root path and uses 13102 internally. |

These ports stem from the official Ghidra server design (documented in svrREADME.html included in Ghidra ZIP distributions). The base port is configurable via `-p` flag or server.conf, but the +1/+2 offsets remain fixed.

### Normal Client Workflow After Exposure
1. Expose ports in docker-compose.yml (as shown earlier): `- "13100:13100"`, `- "13101:13101"`, `- "13102:13102"` (or range `- "13100-13102:13100-13102"`).  
2. Ensure firewall/cloud security group allows inbound TCP 13100-13102 from trusted client IPs.  
3. Start container and create users (via env var or `svrAdmin`).  
4. On client machine: Launch Ghidra → File → New Project → Shared Project → enter server address with :13100 → authenticate.  
   - The client performs RMI lookups, often starting with 13101 for server object registration, then uses 13100 for main operations.  
   - If NAT/firewall is involved and 13101 fails (client tries server's internal IP), set `-ip` to public IP/hostname in server startup args (e.g., edit server.conf: `wrapper.app.parameter.X=-ipYOUR.PUBLIC.IP`).

### Administrative Access (Primarily 13102)
The `svrAdmin` tool is the canonical way to manage the server remotely or locally:  
- Add user: `svrAdmin -add username` (prompts for password)  
- Reset password: `svrAdmin -reset username` (sets to "changeme")  
- List users/repositories: `svrAdmin -list` or `-users`  
- In Docker images (e.g., bytehow/ghidra-server, blacktop/ghidra): Run via `docker exec -it container_name /ghidra/server/svrAdmin [args]`  
No browser or telnet interface exists—these are direct RMI calls. Some older setups mention a console on 13101, but modern usage focuses on svrAdmin via 13102.

### Common Issues and Fixes
- **"Connection failed (:13101)"**: Almost always NAT/callback issue—client receives internal server IP from 13101 handshake. Fix: Force public IP with `-ip` flag and restart server.  
- **Ports appear open (nc succeeds) but connection fails**: Check server logs for auth/TLS errors; ensure client/server versions match exactly; verify no MTU/fragmentation issues on cloud providers.  
- **Remote admin without exposing 13102 publicly**: Use SSH tunnel (`ssh -L 13102:localhost:13102 user@server`) then run svrAdmin locally against localhost:13102, or VPN/overlay network.  
- Most Docker images (bytehow, blacktop, etc.) expose all three ports by default or recommendation for full functionality.

This setup prioritizes security through minimal exposure—only open ports to trusted networks/VPNs, change default passwords immediately, and consider PKI auth for production use.

**Key Citations**  
- https://github.com/NationalSecurityAgency/ghidra/issues/414 (NAT/callback issues with 13101)  
- https://github.com/NationalSecurityAgency/ghidra/issues/6202 (port connectivity checks)  
- https://github.com/bytehow/docker-ghidra-server (Docker exposure example)  
- https://github.com/blacktop/docker-ghidra (server mode and ports)  
- https://github.com/NationalSecurityAgency/ghidra/blob/master/Ghidra/RuntimeScripts/Linux/server/svrAdmin (admin tool usage)  
- https://static.grumpycoder.net/pixel/server/svrREADME.html (official server README excerpt on ports and svrAdmin)  
- https://github.com/NationalSecurityAgency/ghidra/discussions/8517 (SSH tunneling for ports)
