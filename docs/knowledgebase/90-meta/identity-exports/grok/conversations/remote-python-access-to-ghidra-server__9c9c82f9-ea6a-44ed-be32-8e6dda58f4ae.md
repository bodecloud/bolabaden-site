---
source_url: "https://grok.com/c/9c9c82f9-ea6a-44ed-be32-8e6dda58f4ae"
conversation_id: "9c9c82f9-ea6a-44ed-be32-8e6dda58f4ae"
title: "Remote Python Access to Ghidra Server"
extracted_at: "2026-06-29T16:10:23.317Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Remote Python Access to Ghidra Server

Source: [Grok conversation](https://grok.com/c/9c9c82f9-ea6a-44ed-be32-8e6dda58f4ae)

## User

_Time: 2026-02-21T16:49:59.217Z_

I have a ghidra server that hosts a project. I connect via pyghidra normally and within that I usually run python to connect to pyghidra via stdio. All of this is headless.
 
How do I run:

* pyghidra headless server

* ghidra headless server

 
in docker and connect via PYTHON REMOTELY **without** running a local ghidra instance...? search the web thoroughly and find references, tutorials, guides, forums, etc that talk about how to do this without running a ghidra server locally and provide full exhaustive thorough instructions exclusively for connecting to a remote ghidra server/pyghidra server with python and accessing a remote project on there without running ghidra locally.
 
Do not violate my restrictions. Continue researching until you find the solutions do not stop until you do.

## Assistant

_Time: 2026-02-21T16:50:03.288Z_



## User

_Time: 2026-02-21T16:50:07.240Z_

I have a ghidra server that hosts a project. I connect via pyghidra normally and within that I usually run python to connect to pyghidra via stdio. All of this is headless.
 
How do I run:

* pyghidra headless server

* ghidra headless server

 
in docker and connect via PYTHON REMOTELY **without** running a local ghidra instance...? search the web thoroughly and find references, tutorials, guides, forums, etc that talk about how to do this without running a ghidra server locally and provide full exhaustive thorough instructions exclusively for connecting to a remote ghidra server/pyghidra server with python and accessing a remote project on there without running ghidra locally.
 
Do not violate my restrictions. Continue researching until you find the solutions do not stop until you do.

## Assistant

_Time: 2026-02-21T16:52:47.938Z_

**Key Points**  
- No official pure-Python client exists for direct remote access to a Ghidra Server (which uses a proprietary Java/RMI-based protocol), so the established pattern is to run a **headless Ghidra instance in Docker** that connects to your remote Ghidra Server via the `ghidra://` URL, then expose the full Ghidra API to remote Python clients over a simple RPC bridge.  
- **ghidra_bridge** (Python 3 RPC proxy) is the standard, well-documented way to achieve remote Python access without any local Ghidra/JVM on the client machine.  
- Community Docker images make this straightforward: use one for the Ghidra Server itself, and `florian0/ghidra-headless` (or similar) for the bridge-enabled client container.  
- PyGhidra (official Python embedding) runs headless in Docker but still requires a JVM inside the container; for remote Python exposure it pairs naturally with the same bridge or MCP wrappers.  
- All setups are headless, support your existing remote project, and have been verified across GitHub repos, Docker Hub, and community guides.

**Ghidra Server in Docker (the hosting side)**  
Several production-ready images exist. Example with `bytehow/ghidra-server` (matches Ghidra version exactly, creates users automatically):  
```bash
docker run -d --name ghidra-server \
  -p 13100-13102:13100-13102 \
  -v /host/path/to/repos:/repos \
  -e GHIDRA_USERS="youruser admin" \
  bytehow/ghidra-server
```  
Connect your existing Ghidra Server project/repo as usual; the bridge container below will access it.

**Headless Bridge Container (for remote Python)**  
Use `florian0/ghidra-headless` (pre-installs `ghidra_bridge` and `bridge_server_foreground.py`). It runs `analyzeHeadless` with your remote `ghidra://` project and starts the bridge on port 4768:  
```yaml
# docker-compose.yml excerpt
services:
  ghidra-bridge:
    image: florian0/ghidra-headless:11.3.1   # match your Ghidra version
    environment:
      SERVER_HOST: "0.0.0.0"
      SERVER_PORT: "4768"
    volumes:
      - ./project-data:/data
    ports:
      - "4768:4768"
    entrypoint: ["/opt/support/analyzeHeadless", "ghidra://your-ghidra-server:13100/YourRepo/YourProject", "YourProject",
                 "-connect", "youruser", "-p", "yourpass",
                 "-scriptPath", "/opt/script", "-postscript", "bridge_server_foreground.py"]
```  
The container stays running with the shared project open and the Python bridge listening.

**Remote Python Client (no local Ghidra)**  
```bash
pip install ghidra_bridge
```  
```python
import ghidra_bridge
with ghidra_bridge.GhidraBridge(host="your-docker-host", port=4768, namespace=globals()):
    # Full Ghidra Flat API + ghidra.* package now available remotely
    print(currentProgram.getName())
    for func in currentProgram.getFunctionManager().getFunctions(True):
        print(func.getName())
```  
Use `response_timeout=60` for long operations; `remote_eval()` for bulk queries to minimize latency.

---

Ghidra Server enables collaborative/shared projects over a custom protocol (primarily RMI-based with additional ports 13100-13102). Official documentation and community setups confirm that direct Python clients are not provided by NSA; instead, headless analysis (`analyzeHeadless`) supports the `ghidra://` scheme to open shared repositories, and `ghidra_bridge` (maintained by the reverse-engineering community) layers a clean RPC proxy on top. This pattern appears consistently in Docker images, blog posts, GitHub issues, and StackExchange threads from 2019–2026.

**Comprehensive Docker Options for Ghidra Server**  
Multiple mature images handle the server side (the one hosting your project). All support volume-mounted repos, user creation via env var, and headless operation.  

| Image                  | Repo / Hub Link                                      | Key Features                                      | Example Run Command |
|------------------------|------------------------------------------------------|---------------------------------------------------|---------------------|
| bytehow/ghidra-server | https://github.com/bytehow/docker-ghidra-server     | One-click users, version-matched, /repos volume  | `docker run ... -e GHIDRA_USERS="user1 user2" -p 13100-13102:13100-13102 ...` |
| bskaggs/ghidra-docker | https://github.com/bskaggs/ghidra-docker            | K8s-friendly, memory limits, direct server run   | `docker run -m 1G -e GHIDRA_DEFAULT_USERS=user1,user2 ...` |
| blacktop/ghidra       | https://hub.docker.com/r/blacktop/ghidra             | Server + headless in one image, --link support   | `docker run ... blacktop/ghidra server` |
| 0xf15h/ghidra         | https://hub.docker.com/r/0xf15h/ghidra               | Network=host, production-ready, simple pull      | `docker run --network=host -p 13100-13102:13100-13102 ...` |

All require matching Ghidra client version on any GUI side; the bridge container must also match.

**Headless Ghidra + Bridge Setup (florian0/ghidra-headless)**  
This image is purpose-built for exactly the remote-Python use case: Ghidra + `justfoxing/ghidra_bridge` scripts pre-installed at `/opt/script/`. The `bridge_server_foreground.py` script respects `SERVER_HOST`/`SERVER_PORT` env vars (default binding behavior overridden to `0.0.0.0:4768` for Docker).  

Full workflow to connect to your existing remote Ghidra Server project:  
1. Pull: `docker pull florian0/ghidra-headless:11.3.1` (or tag matching your server).  
2. Create `docker-compose.yml` (example above) or run directly:  
   ```bash
   docker run -d --name ghidra-bridge \
     -p 4768:4768 \
     -v /path/to/local/cache:/data \
     -e SERVER_HOST=0.0.0.0 -e SERVER_PORT=4768 \
     florian0/ghidra-headless:11.3.1 \
     /opt/support/analyzeHeadless \
       ghidra://YOUR_SERVER_IP:13100/YourRepository/YourProjectFolder \
       YourProjectName \
       -connect yourusername -p yourpassword \
       -scriptPath /opt/script \
       -postscript bridge_server_foreground.py
   ```  
   (Use `-commit` or other flags if you need to save changes back to the shared repo; see Ghidra `analyzeHeadlessREADME.html` for full options including `HeadlessOptions` for server credentials.)  
3. Verify: `docker logs ghidra-bridge` should show the bridge starting and listening. The container stays alive because `bridge_server_foreground.py` keeps the JVM running.

Alternative images that can be extended the same way: `blacktop/ghidra` (use `--link` or network to reach your server container) or build a custom one from `fkiecad/ghidra_headless_base`.

**PyGhidra / PyGhidra-MCP Headless Server in Docker**  
PyGhidra (official since Ghidra 11.3) embeds Ghidra inside CPython via JPype and runs fully headless with `pyghidra.start()`. For a “pyghidra headless server” that other Python processes can talk to remotely:  
- Use `clearbluejar/pyghidra-mcp` (Docker-ready, loads binaries or projects into a unified Ghidra project and exposes via MCP – stdio or HTTP).  
  ```bash
  docker run -i --rm ghcr.io/clearbluejar/pyghidra-mcp -t stdio /path/to/binaries   # or -t streamable-http for network
  ```  
- For full remote API (not just MCP/LLM tools), layer `ghidra_bridge` on top of a PyGhidra-based container or use the same florian0 image (it works with PyGhidra scripts too). PyGhidra itself does not expose a network server; the bridge or MCP wrapper provides that.

**Python Remote Client Details (ghidra_bridge)**  
- Install: `pip install ghidra_bridge` (pure Python 3, no Ghidra/JDK needed on client).  
- Constructor supports remote: `GhidraBridge(host="docker-host-or-ip", port=4768, namespace=globals(), response_timeout=60, interactive_mode=True)`.  
- Security note (from maintainer): default server binds to localhost only; the florian0 image + `SERVER_HOST=0.0.0.0` exposes it – run behind firewall/VPN or inside secure Docker network. Use reduced-privilege user inside container.  
- Performance: for loops over thousands of functions use `b.remote_eval("[f.getName() for f in ...]")` (single round-trip).  
- Shutdown: `b.remote_shutdown()` from client or run shutdown script in Ghidra.  
- Examples in community: Tenable blog (decompiler export), clearbluejar devcontainer skeleton, qiling dynamic import post – all demonstrate `server_host`/`server_port` pattern and remote usage.

**Opening Shared Projects Headless (Key for Remote Access)**  
`analyzeHeadless` natively supports:  
`analyzeHeadless ghidra://<server>:<port>/<repository>/<folder> <project-name> -connect <user> -p <pass> ...`  
Official Ghidra `HeadlessOptions` class and blacktop Docker examples confirm credentials and commit/push back to the shared repo. When combined with `-postscript bridge_server_foreground.py`, the headless instance stays connected to your Ghidra Server and the bridge exposes the live `currentProgram`, `Project`, `ProgramManager`, etc., to any remote Python client.

**Alternative & Complementary Approaches**  
- Pure MCP route (`pyghidra-mcp` or forks like bethington/ghidra-mcp): excellent for AI/LLM tooling, Docker-native, stdio or HTTP, but narrower API surface than full `ghidra_bridge`.  
- Custom bridge + PyGhidra Docker: install Ghidra + `pip install pyghidra`, run a Python entrypoint that does `pyghidra.start()`, opens the shared project via `ghidra.framework.model.ProjectLocator` or `HeadlessAnalyzer`, then starts a socket server – but `ghidra_bridge` already solves this cleanly.  
- No evidence of a maintained pure-Python Ghidra Server client library; all remote Python solutions route through a live headless Ghidra instance.

**Troubleshooting & Best Practices**  
- Version match: bridge container, Ghidra Server, and any GUI clients must be identical (e.g., 11.3.1).  
- Networking: use Docker networks or `--network=host`; expose only 4768 (bridge) and 13100-13102 (server).  
- Persistence: mount volumes for repos and analysis cache.  
- Logs: `docker logs` for bridge startup messages; Ghidra console output inside container.  
- Security: never expose bridge publicly without TLS wrapper (e.g., nginx or stunnel) or VPN.  

This configuration exactly matches your requirement: Ghidra/pyghidra run headless in Docker, your remote project is accessed via the existing Ghidra Server, and Python clients connect remotely with zero local Ghidra installation.

**Key Citations**  
- https://github.com/justfoxing/ghidra_bridge (core bridge documentation, remote eval, security notes, headless postscript usage)  
- https://hub.docker.com/r/florian0/ghidra-headless (pre-built bridge server, env vars, docker-compose example with remote client)  
- https://github.com/bytehow/docker-ghidra-server (simple Ghidra Server Docker with user creation)  
- https://hub.docker.com/r/blacktop/ghidra (analyzeHeadless ghidra:// example connecting to server)  
- https://medium.com/tenable-techblog/extracting-ghidra-decompiler-output-with-python-a737e9ed8fce (practical bridge client setup)  
- https://github.com/clearbluejar/pyghidra-mcp (pyghidra headless MCP server in Docker)  
- Ghidra official analyzeHeadless support (via blacktop & HeadlessOptions references in GitHub)  
- https://github.com/bskaggs/ghidra-docker (K8s-friendly server variant)  

All facts and commands are drawn directly from the linked primary sources (GitHub READMEs, Docker Hub descriptions, and verified examples).
