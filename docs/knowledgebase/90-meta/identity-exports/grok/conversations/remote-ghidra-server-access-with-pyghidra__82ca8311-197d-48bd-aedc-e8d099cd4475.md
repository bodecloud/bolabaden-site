---
source_url: "https://grok.com/c/82ca8311-197d-48bd-aedc-e8d099cd4475"
conversation_id: "82ca8311-197d-48bd-aedc-e8d099cd4475"
title: "Remote Ghidra Server Access with pyghidra"
extracted_at: "2026-06-29T16:11:14.474Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Remote Ghidra Server Access with pyghidra

Source: [Grok conversation](https://grok.com/c/82ca8311-197d-48bd-aedc-e8d099cd4475)

## User

_Time: 2026-02-03T09:05:24.792Z_

I have a ghidra server operating on the public internet.
is it possible to login to it with pyghidra? i've never gotten it to work with that i've only ben able to open projects that have a .gpr extension and that are *not* a shared project for some reason.
my question is if i have a ghidra server running, do I *also* need to run ghidra?
Basically I have https://github.com/bolabaden/agentdecompile. I'd like to know if it's possible to connect that to the server, and potentially not have to even *run* ghidra locally? since it's running on a server this would potentially work right?

## Assistant

_Time: 2026-02-03T09:07:32.919Z_

### Key Points
- Research suggests that pyghidra does not directly support logging in or connecting to a remote Ghidra server without a local Ghidra installation, as its project-opening API is designed for local file paths and projects.
- It seems likely that to access a shared project on a Ghidra server, you will need to run a local Ghidra client to connect, open the project, and then use pyghidra or extensions within that environment—there is no clear evidence of fully remote, headless access via pyghidra alone.
- The evidence leans toward requiring a local Ghidra run for tools like agentdecompile, which is a Ghidra extension that operates within the Ghidra application (e.g., starting an MCP server for AI interactions), even if the project data is hosted remotely.

### Connecting to a Ghidra Server
Ghidra servers are primarily designed for collaborative storage and sharing of projects, allowing multiple users to work on the same repository. Clients connect using the Ghidra application, either via the GUI or headless mode. To connect:
- In the Ghidra GUI, go to File > New Project > Shared Project, then enter the server address (e.g., IP or hostname) and port (default 13100).
- Authentication typically uses usernames and passwords managed via the server's svrAdmin tool (default password "changeme" for new users).
- For headless access (without GUI), use the analyzeHeadless script from Ghidra's support directory, specifying the project as `ghidra://<server>[:<port>]/<repository_name>`. This supports scripting but requires a local Ghidra installation.

Shared projects differ from local .gpr files, which are non-shared and stored on your filesystem. If you've only opened local .gpr files, switching to shared ones involves the above connection process.

### Using pyghidra with Servers
pyghidra is a Python library for interacting with Ghidra's API, typically requiring a local Ghidra install (set via GHIDRA_INSTALL_DIR environment variable). It excels at headless scripting for local projects but lacks explicit support for remote connections in its documented API (e.g., `open_project()` expects local paths). While Ghidra's headless analyzer can handle remote projects via `ghidra://` URLs, pyghidra's wrappers do not appear to expose this directly based on available documentation and examples.

If attempting remote access, you might experiment with passing a `ghidra://` string to pyghidra's project functions, but this is unverified and not recommended without testing, as it could lead to errors or incomplete functionality.

### Agentdecompile Integration
The agentdecompile repository (https://github.com/bolabaden/agentdecompile) is a Ghidra extension that enhances reverse engineering with AI-driven tasks, such as function identification and code annotation. It installs directly into Ghidra (via File > Install Extensions) and runs as an MCP server (e.g., at http://localhost:8080/mcp/message) for external AI clients.

To use it with a server-hosted project:
- Run a local Ghidra client.
- Connect to the remote shared project.
- Activate the extension within Ghidra to start the MCP server.

There is no indication that agentdecompile can connect directly to a Ghidra server without a local Ghidra instance, as it relies on Ghidra's Java API and environment. Running solely on the server side (without a local client) is not supported, as the server handles storage, not execution of extensions or analysis.

### Potential Workarounds and Limitations
- **Headless Mode Alternative**: If avoiding the GUI, use Ghidra's native headless tools for remote projects, then integrate Python scripts manually. Tools like pyghidra-mcp (a separate project) create headless servers for local multi-binary analysis but do not extend to remote Ghidra servers.
- **Dependencies and Setup**: Ensure Java 21+ and proper firewall rules (ports 13100-13102) for server access. For public internet exposure, use SSH tunnels for security, as direct exposure is risky.
- **Controversy and Gaps**: Some users report challenges with remote connections (e.g., via NAT or tunnels), and documentation emphasizes local clients for full functionality. If your setup involves public internet, prioritize security to avoid unauthorized access.

---

Ghidra, developed by the NSA as an open-source software reverse engineering (SRE) framework, supports collaborative workflows through its server component. The server allows multiple users to share projects, similar to version control systems, enabling annotations, decompilations, and analyses to be synchronized across clients. However, the architecture distinguishes between the server (for storage and coordination) and clients (for actual processing and interaction). This means that while the server runs remotely, clients typically need a local Ghidra installation to connect and perform tasks.

#### Ghidra Server Fundamentals
The Ghidra server is included in the standard distribution (under the /server directory) and can be set up on Linux, Windows, or macOS. Key setup steps include:
- Editing server.conf to configure ports (default 13100-13102), repositories directory, and authentication modes (e.g., local passwords, PKI, or SSH).
- Installing as a service using provided scripts (e.g., svrInstall.bat on Windows or server install scripts on Linux).
- Adding users with svrAdmin (e.g., svrAdmin -add <username>), with initial passwords set to "changeme" for security prompts on first login.

For public internet operation, as in your case, secure configurations are critical. Use SSH tunnels for port forwarding (e.g., ssh -L 13100:localhost:13100 user@server) to avoid direct exposure. Documentation warns of DNS requirements for forward/reverse lookups and recommends binding to specific IPs with the -ip option in server.conf for multi-interface setups. Firewalls must allow TCP 13100-13102.

Client connections require proper network resolution; failures often stem from NAT issues or misconfigured hostnames. For example, setting java.rmi.server.hostname=localhost in server.conf can resolve tunnel-related problems by routing through the tunnel.

#### Client Requirements and Shared Projects
To access a shared project:
- Launch Ghidra locally.
- Select File > New Project > Shared Project.
- Input server details and authenticate.

This opens the remote repository locally, with changes synced back to the server. Non-shared .gpr files are local-only and cannot directly convert to shared without migration. Headless mode (via analyzeHeadless) supports remote access with `ghidra://<server>/<repo>` syntax, allowing script execution without GUI—but still requires local Ghidra files for the analyzer.

| Feature | Local Project (.gpr) | Shared Project (Server) |
|---------|----------------------|-------------------------|
| Storage | Filesystem | Remote repository |
| Collaboration | No | Yes, multi-user |
| Access Method | Direct open | Connect via client |
| pyghidra Support | Direct (local path) | Indirect (via local client) |
| Headless Capable | Yes | Yes, with ghidra:// URL |

#### pyghidra Capabilities and Limitations
pyghidra, integrated since Ghidra 12.0, provides Python access to Ghidra's API for scripting tasks like decompilation and analysis. Installation involves pip install pyghidra after setting GHIDRA_INSTALL_DIR. It supports headless launches (pyghidra.start()) and project operations (pyghidra.open_project(path, name)).

However, its API focuses on local paths (e.g., pathlib.Path or str for directories), with no documented support for remote URLs like ghidra://. Examples and related projects (e.g., ofrak_pyghidra, pyghidra-mcp) emphasize local files or binaries, not server connections. While Ghidra's underlying API (e.g., ProjectManager) might allow remote opens, pyghidra's wrappers do not expose this, limiting it to local environments.

For your experience with only .gpr files working: Shared projects require explicit server connection, which pyghidra alone cannot initiate without custom extensions or manual API calls—unverified in practice.

#### Agentdecompile Specifics
Agentdecompile is a Java-based Ghidra extension (with Python components) for AI-assisted reverse engineering. It provides tools for querying binaries in natural language, leveraging Ghidra's decompiler output and references. Key features:
- Installs via Ghidra's extension manager.
- Starts an MCP (Model Context Protocol) server for AI integration (e.g., Claude or custom clients).
- Dependencies: Ghidra 12.0+, Java API (no direct pyghidra reliance, though compatible).

To connect to your server:
- Run local Ghidra.
- Open the shared project.
- Enable the extension to expose the MCP endpoint.

Running without local Ghidra is not feasible, as extensions execute within the Ghidra runtime. The server does not host extensions or analysis; it only manages data. Alternatives like pyghidra-mcp create headless MCP servers but for local projects only, not integrating with remote Ghidra servers.

#### Advanced Configurations and Tools
- **Headless Remote Scripting**: Use analyzeHeadless with -scriptPath for Python/Jython scripts on remote projects. This bypasses GUI but requires local Ghidra.
- **Docker/VPS Setups**: Containers like bytehow/ghidra-server simplify deployment, auto-creating users via environment variables.
- **Related Projects**:
  - pyghidra-mcp: Headless multi-binary analysis, starts with `pyghidra-mcp <binary_paths>`.
  - OFRAK_pyghidra: Disassembly backend, headless but local.
  - GhidraMCP: Similar MCP for GUI-integrated AI.

| Tool | Purpose | Remote Support | Local Ghidra Required |
|------|---------|----------------|-----------------------|
| pyghidra | Python API access | No (local only) | Yes |
| analyzeHeadless | Command-line analysis | Yes (ghidra://) | Yes (installation) |
| Agentdecompile | AI extension | Via shared project | Yes (client) |
| pyghidra-mcp | Headless MCP server | No | Yes |

#### Security and Best Practices
Exposing on public internet: Use VPNs or tunnels; avoid direct ports. Authentication options include SSH for headless. For collaboration, public servers like ghidra-server.org exist but require client software and manual account requests.

If experiments fail, community resources (e.g., GitHub issues, Reddit r/ghidra) suggest overkill setups like tunnels may cause delays—simplify to local networks for testing.

This comprehensive approach ensures all aspects of your query are covered, drawing from official docs, user reports, and tool analyses.

**Key Citations:**
- [Issue connecting to Ghidra server through SSH tunnel](https://github.com/NationalSecurityAgency/ghidra/discussions/8517) 
- [Guide: Setting up a Ghidra server on a remote VPS](https://llamawa.re/blog/ghidra-server) 
- [Ghidra Collaborative Reversing 1/2 — How to setup a Ghidra server](https://medium.com/@jannis.kirschner/ghidra-collaborative-reversing-1-2-how-to-setup-a-ghidra-server-711f4212912e) 
- [pyghidra-mcp: Headless Ghidra MCP Server for Project-Wide, Multi-Binary Analysis](https://clearbluejar.github.io/posts/pyghidra-mcp-headless-ghidra-mcp-server-for-project-wide-multi-binary-analysis) 
- [ghidra/Ghidra/Features/PyGhidra/src/main/py/README.md at master](https://github.com/NationalSecurityAgency/ghidra/blob/master/Ghidra/Features/PyGhidra/src/main/py/README.md) 
- [Ghidra install on Linux server](https://www.reddit.com/r/ghidra/comments/17fnuf7/ghidra_install_on_linux_server) 
- [Decompiling Tenchu: Stealth Assassins part 3: setting up a Ghidra server on a cheap Synology NAS](https://boricj.net/tenchu1/2024/02/26/part-3.html) 
- [Ghidra Server README](https://static.grumpycoder.net/pixel/svrREADME.html) 
- [Ghidra Reverse Engineering Self Collaboration](https://bishoppebbles.com/post008.php) 
- [pyghidra - PyPI](https://pypi.org/project/pyghidra) 
- [PyGhidra Backend - OFRAK Docs](https://ofrak.com/docs/user-guide/disassembler-backends/pyghidra.html) 
- [ghidra/GhidraDocs/GettingStarted.md at master](https://github.com/NationalSecurityAgency/ghidra/blob/master/GhidraDocs/GettingStarted.md) 
- [Collaborative Reverse Engineering with Ghidra Server](https://byte.how/posts/collaborative-reverse-engineering) 
- [Ghidra Server Quickstart](https://medium.com/@tr15t4n/ghidra-server-quickstart-db3911cbc81b) 
