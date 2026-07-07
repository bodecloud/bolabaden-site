---
source_url: "https://grok.com/c/14c49d66-b600-4271-b07a-5630c7828056"
conversation_id: "14c49d66-b600-4271-b07a-5630c7828056"
title: "Collaborative Ghidra Server Setup Guide"
extracted_at: "2026-06-29T16:37:57.887Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Collaborative Ghidra Server Setup Guide

Source: [Grok conversation](https://grok.com/c/14c49d66-b600-4271-b07a-5630c7828056)

## User

_Time: 2026-01-13T01:59:49.860Z_

Self-hosted ghidra server that can be accessed simultaneously from other users using ghidra. Simply a place to collaborate on the same .gpr/.gzf/thing so that we don't have to keep sending the comments/labels/analysis/decompilation for our programs around.
 
Looking for a way to **collaborate** and **sync** while still using ghidra locally. Is this possible? if so how does one do it? ideally i'd like to run it through docker-compose.yml and connect ghidra on my local machine to it somehow.
 
Provide EXACT steps for how to connect ghidra to the server.
 
Be as precise as possible to the query, do not mention irrelevant things. Search the web thoroughly.

## Assistant

_Time: 2026-01-13T02:02:17.993Z_

- Ghidra collaboration is possible through its built-in server feature, which supports shared projects for syncing annotations, labels, analysis, and decompilations across users.
- The system uses a check-in/check-out mechanism to manage concurrent access, preventing conflicts while allowing version-tracked changes.
- Setup can be done self-hosted via Docker for easy deployment, with clients connecting locally over the network.

**Setup Overview**
Ghidra Server enables multiple users to work on the same repository.<grok:render card_id="b5bae5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render> Deploy it using a Docker image for simplicity, then connect local Ghidra clients to it.

**Docker Deployment**
Use a pre-built image like bytehow/ghidra-server.<grok:render card_id="ea16cb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">61</argument>
</grok:render> Here's a sample docker-compose.yml:

```
version: '3'
services:
  ghidra-server:
    image: bytehow/ghidra-server:latest
    container_name: ghidra-server
    environment:
      - GHIDRA_USERS=admin user1 user2  # Space-separated list; initial password 'changeme'
    volumes:
      - ./repos:/repos  # Local directory for project repos
    ports:
      - "13100-13102:13100-13102"
```

Run `docker-compose up -d` to start. Change passwords on first login.

**Connecting Ghidra Client**
1. Launch Ghidra on your local machine.
2. Go to File > New Project.
3. Select Shared Project.
4. Enter the server hostname (e.g., localhost or IP) and port (13100).
5. Log in with username and password.<grok:render card_id="8203dd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">63</argument>
</grok:render>
6. Create or select a repository, then import files for collaboration.

Changes sync via check-in (commit) and check-out (pull/update).<grok:render card_id="ea8e23" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render>

---

Ghidra's collaboration feature relies on a client-server model where the server hosts repositories, and clients connect to shared projects. This setup allows users to work simultaneously on the same binaries, with changes to comments, labels, function names, data types, analysis results, and decompilations being version-controlled and synchronized through a check-in/check-out process. The server manages access and prevents direct conflicts by requiring users to check out files before editing and check in to commit changes. This is not real-time editing but a structured collaboration similar to version control systems like Git, where users pull updates and resolve merges as needed.<grok:render card_id="5826cb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render><grok:render card_id="893f52" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>

To deploy the server in a self-hosted environment using Docker, several community-maintained images are available, ensuring compatibility with Ghidra's requirements. The bytehow/ghidra-server image is recommended for its simplicity and focus on production use.<grok:render card_id="e2c7d0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">61</argument>
</grok:render> It handles user creation via environment variables and persists repositories in a mounted volume. For Linux-based hosting without Docker, a manual setup involves installing Java, configuring the server, and running it as a service.<grok:render card_id="0d4300" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">76</argument>
</grok:render> Both approaches support password authentication, with options for PKI or anonymous access configurable in server.conf.

### Docker-Based Setup Details
Prepare by installing Docker and Docker Compose. Download the matching Ghidra client version from https://ghidra-sre.org/ to ensure compatibility with the server image tag (e.g., use bytehow/ghidra-server:11.2 for Ghidra 11.2).<grok:render card_id="21c763" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render>

Create a docker-compose.yml file as follows:

```
version: '3.8'
services:
  ghidra-server:
    image: bytehow/ghidra-server:latest  # Or specify version, e.g., :11.2
    container_name: ghidra-server
    restart: unless-stopped
    environment:
      - GHIDRA_USERS=admin user1 user2  # Initial users; password 'changeme' (must change on login)
      - GHIDRA_PUBLIC_HOSTNAME=0.0.0.0  # For local-only access; omit for public IP auto-detection
    volumes:
      - ./ghidra-repos:/repos  # Persist repositories here
    ports:
      - "13100-13102:13100-13102"  # Expose Ghidra ports
```

Start the server with `docker compose up -d`. Logs can be checked via `docker logs ghidra-server`. The server runs on ports 13100 (RMI registry), 13101 (RMI server), and 13102 (RMI callback).<grok:render card_id="0dd21c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">61</argument>
</grok:render>

| Environment Variable | Description | Default/Value |
|-----------------------|-------------|---------------|
| GHIDRA_USERS | Space-separated list of users to create as admins | admin |
| GHIDRA_PUBLIC_HOSTNAME | Hostname/IP for client connections (use 0.0.0.0 for local) | Auto-detected public IP |

For user management post-setup, exec into the container: `docker exec -it ghidra-server /bin/bash`, then use `/ghidra/server/svrAdmin -add username` to add users or `-remove username` to remove.<grok:render card_id="79f2b2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render> Initial passwords expire after 24 hours if not changed.

### Manual Linux Setup (Non-Docker Alternative)
For bare-metal deployment on Ubuntu/Debian:

1. Install dependencies: `sudo apt update && sudo apt install openjdk-21-jdk unzip`.<grok:render card_id="96d37e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">76</argument>
</grok:render>
2. Create user and directories: `sudo useradd -r -m -s /usr/bin/nologin ghidrasrv && sudo mkdir /opt/ghidra-repos && sudo chown ghidrasrv:ghidrasrv /opt/ghidra-repos`.
3. Download and extract Ghidra: `wget https://github.com/NationalSecurityAgency/ghidra/releases/download/Ghidra_11.2_build/ghidra_11.2_PUBLIC_20250115.zip -O /tmp/ghidra.zip`, unzip to `/opt/ghidrasrv`.
4. Configure server.conf in `/opt/ghidrasrv/server`: Set `ghidra.repositories.dir=/opt/ghidra-repos`, `wrapper.app.parameter.2=-u`, `wrapper.app.parameter.3=${ghidra.repositories.dir}`, `wrapper.app.account=ghidrasrv`.
5. Install as service: `cd /opt/ghidrasrv/server && sudo ./svrInstall`.
6. Add users: `sudo /opt/ghidrasrv/server/svrAdmin -add username`.
7. Start service: `sudo systemctl start ghidrasrv`.

Firewall: `sudo ufw allow 13100:13102/tcp`.<grok:render card_id="e79b3e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">76</argument>
</grok:render>

| Configuration Option in server.conf | Purpose | Example Value |
|-------------------------------------|---------|---------------|
| ghidra.repositories.dir | Path to store repositories | /opt/ghidra-repos |
| wrapper.java.command | Path to Java executable | /usr/bin/java |
| wrapper.app.account | User to run server as | ghidrasrv |
| wrapper.app.parameter.2 | Flag for username mode | -u |

### Connecting and Collaborating with Ghidra Client
Ensure the client version matches the server. Launch Ghidra:

1. File > New Project (Ctrl+N).
2. Choose Shared Project.
3. Enter server details: Hostname/IP and Port (13100).
4. Authenticate with username and password (change if 'changeme').
5. Create a new repository or select existing.
6. Set local project directory and name.<grok:render card_id="8bfccf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">63</argument>
</grok:render><grok:render card_id="cdead4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>

Once connected, import binaries via File > Import or Batch Import. To collaborate:

- **Check Out**: Right-click file > Check Out (for editing).
- **Edit**: Add comments, labels, analyze, decompile.
- **Check In**: Save, close Code Browser, right-click > Check In (add commit comment).
- **Update**: Right-click > Update to pull changes.
- **View History**: Right-click > Show History for versions.
- **Resolve Conflicts**: During merge, select changes via dialog.<grok:render card_id="c27429" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render>

Admins can manage access via Project > Manage Users. For simultaneous work, multiple check-outs are allowed for non-exclusive changes; exclusive check-out is needed for structural modifications like memory maps.<grok:render card_id="4e2258" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render>

This setup ensures sync without file transfers, with all data stored centrally on the server.

**Key Citations:**
- [byte.how/posts/collaborative-reverse-engineering/](https://byte.how/posts/collaborative-reverse-engineering/)<grok:render card_id="93236d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render>
- [github.com/bytehow/docker-ghidra-server](https://github.com/bytehow/docker-ghidra-server)<grok:render card_id="a52c68" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">61</argument>
</grok:render>
- [boricj.net/tenchu1/2024/02/26/part-3.html](https://boricj.net/tenchu1/2024/02/26/part-3.html)<grok:render card_id="3d3246" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">63</argument>
</grok:render>
- [llamawa.re/blog/ghidra-server/](https://llamawa.re/blog/ghidra-server/)<grok:render card_id="d73e99" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">76</argument>
</grok:render>
- [byte.how/posts/collaborative-reverse-engineering/](https://byte.how/posts/collaborative-reverse-engineering/)<grok:render card_id="d9829f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [medium.com/@jannis.kirschner/ghidra-collaborative-reversing-1-2-how-to-setup-a-ghidra-server-711f4212912e](https://medium.com/@jannis.kirschner/ghidra-collaborative-reversing-1-2-how-to-setup-a-ghidra-server-711f4212912e)<grok:render card_id="87f151" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>
- [github.com/NationalSecurityAgency/ghidra](https://github.com/NationalSecurityAgency/ghidra)<grok:render card_id="a2ec7b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>

## User

_Time: 2026-01-13T02:04:42.767Z_

Full list of environment variables that can be configured...?

## Assistant

_Time: 2026-01-13T02:06:52.505Z_

The bytehow/ghidra-server Docker image, used for self-hosting a Ghidra collaboration server, allows configuration through a limited set of environment variables to simplify setup and user management. Research indicates only two are explicitly supported, focusing on user creation and network accessibility, which aligns with common Docker practices for security and ease of deployment.

- **GHIDRA_USERS**: This variable defines initial admin users, helping teams set up access without manual intervention post-launch.
- **GHIDRA_PUBLIC_HOSTNAME**: It specifies the connection endpoint, essential for local or remote access scenarios, with auto-detection as a fallback to reduce configuration errors.

These variables are optional but recommended for customized deployments. Defaults ensure the container runs out-of-the-box with basic admin access.

### Usage in docker-compose.yml
Incorporate these in your docker-compose.yml under the environment section for the ghidra-server service. For example:
```
environment:
  - GHIDRA_USERS=admin user1 user2
  - GHIDRA_PUBLIC_HOSTNAME=0.0.0.0
```
This creates users with initial passwords ('changeme') that expire if unchanged, promoting security.

### Compatibility and Best Practices
Compatible with Ghidra versions like 11.2, these variables integrate with Ghidra's built-in server features. For production, combine with volume mounts for persistent repositories and port exposures (13100-13102). Avoid exposing to untrusted networks without additional security like VPNs.

---

The bytehow/ghidra-server Docker image provides a streamlined way to deploy a collaborative Ghidra server, emphasizing minimal configuration to enable quick setup for reverse engineering teams. Based on thorough examination of the project's documentation and related sources, the image exposes a concise set of environment variables designed to handle user provisioning and network binding without overwhelming users with unnecessary options. This approach contrasts with more verbose configurations in native Ghidra server installs, where settings are managed via files like server.conf, but here Docker's environment variables offer an override layer for containerized environments.

Environment variables in Docker images like this serve as injectable parameters passed at runtime, allowing customization without rebuilding the image. In the context of Ghidra, which is a Java-based tool developed by the NSA for software reverse engineering, the server component facilitates shared project repositories (.gpr files) where multiple users can sync annotations, decompilations, and analyses. The bytehow image builds on Ghidra's official releases, incorporating an entrypoint script that processes these variables to automate initial setup tasks, such as user creation via Ghidra's svrAdmin tool.

#### Detailed List of Configurable Environment Variables
The following table outlines all configurable environment variables as documented in the project's README. No additional variables are mentioned in the Dockerfile, entrypoint scripts, or associated blog posts, indicating this is exhaustive for user-facing customization. Attempts to use undocumented variables (e.g., JAVA_OPTS for JVM tuning) may not be supported directly but could be passed via Docker's general environment handling, though this is not recommended without source code modifications.

| Variable Name          | Description                                                                 | Required | Default Value                  | Notes |
|------------------------|-----------------------------------------------------------------------------|----------|--------------------------------|-------|
| GHIDRA_USERS          | A space-separated list of usernames to create as administrators upon container startup. Each user starts with the password 'changeme', which must be updated on first login to prevent expiration (typically within 24 hours). This automates user management, bypassing manual svrAdmin commands. | No      | admin                         | Useful for team environments; all created users have full admin privileges. If omitted, only the default 'admin' user is set up. |
| GHIDRA_PUBLIC_HOSTNAME | The IP address or hostname that client Ghidra instances will use to connect to the server. For local hosting (e.g., on the same machine or network), set to '0.0.0.0' to bind to all interfaces. If unset, the container attempts auto-detection by querying an external service like OpenDNS for the public IP. | No      | Auto-detected public IP (via OpenDNS query) | Critical for remote access; misconfiguration can lead to connection failures. Avoid using in public-facing setups without firewalls. |

This list is derived directly from the project's GitHub repository and corroborated by the maintainer's blog post on collaborative reverse engineering, which demonstrates practical usage in a Docker Compose setup. For instance, in a multi-user scenario, specifying GHIDRA_USERS ensures immediate access for collaborators without needing to exec into the container post-launch.

#### Integration with Ghidra Server Mechanics
While the Docker image focuses on these two variables, it's worth contextualizing them within Ghidra's broader server architecture. Ghidra servers use RMI (Remote Method Invocation) over ports 13100-13102 for client connections, and the GHIDRA_PUBLIC_HOSTNAME variable directly influences the server's RMI registry binding. This is evident in Ghidra's server.conf file, which the image pre-configures but allows indirect overrides via Docker volumes if needed. User creation via GHIDRA_USERS leverages Ghidra's built-in authentication, supporting password-based access (default) or advanced modes like PKI, though the latter requires manual configuration outside these env vars.

In comparison to alternative Ghidra Docker images, such as florian0/ghidra-docker or bskaggs/ghidra, bytehow's version is more minimalist. For example, florian0's image introduces SERVER_HOST for binding, but bytehow handles this via GHIDRA_PUBLIC_HOSTNAME with added auto-detection logic. This makes bytehow suitable for beginners, as it reduces the risk of network misconfigurations common in self-hosted setups.

#### Advanced Configuration Considerations
For users seeking more control, environment variables can be combined with Docker's --env-file option or Kubernetes secrets for secure password management, though the image doesn't natively support pre-setting custom passwords—users must change them after creation. If additional JVM tuning is required (e.g., for large repositories), one could extend the image by adding ENV JAVA_OPTS in a custom Dockerfile, but this deviates from the official configuration.

Security implications are notable: Since initial passwords are predictable, immediate changes are enforced. For production, integrate with tools like Docker Secrets or environment variable injection from CI/CD pipelines. Persistent storage via volumes (e.g., ./repos:/repos) ensures repository data survives container restarts, complementing the env vars.

#### Alternatives and Extensions
If these variables prove insufficient, consider forking the repository to add custom ones, such as for repository paths or log levels, by modifying the entrypoint.sh script. Community discussions on platforms like Reddit highlight similar setups, where users extend Docker images for headless operation on Linux servers, but bytehow's focus remains on collaboration without GUI dependencies.

Overall, this limited set of variables underscores the image's design philosophy: provide just enough configurability for collaborative reverse engineering while leveraging Ghidra's robust defaults for everything else.

**Key Citations:**
- [GitHub - bytehow/docker-ghidra-server: Ghidra Server Docker Image](https://github.com/bytehow/docker-ghidra-server)<grok:render card_id="7195cb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render>
- [Collaborative Reverse Engineering with Ghidra Server - byte.how](https://byte.how/posts/collaborative-reverse-engineering/)<grok:render card_id="7bd69f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- [docker-ghidra-server/server.conf at master - GitHub](https://github.com/bytehow/docker-ghidra-server/blob/master/server.conf)<grok:render card_id="9feff6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>
- [Cryptophobia/docker-ghidra-server-aws: Ghidra Server Docker Image for EC2 - GitHub](https://github.com/Cryptophobia/docker-ghidra-server-aws)<grok:render card_id="6c4e76" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- [florian0 / ghidra-docker - GitLab](https://gitlab.com/florian0/ghidra-docker)<grok:render card_id="e5c288" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render>

## User

_Time: 2026-01-13T03:26:00.348Z_

Self-hosted ghidra server that can be accessed simultaneously from other users using ghidra. Simply a place to collaborate on the same .gpr/.gzf/thing so that we don't have to keep sending the comments/labels/analysis/decompilation for our programs around.
 
Looking for a way to **collaborate** and **sync** while still using ghidra locally. Is this possible? if so how does one do it? ideally i'd like to run it through docker-compose.yml and connect ghidra on my local machine to it somehow.
 
Provide EXACT steps for how to connect ghidra to the server.
 
Be as precise as possible to the query, do not mention irrelevant things. Search the web thoroughly.

## Assistant

_Time: 2026-01-13T03:27:19.868Z_

**Key Points**
- Ghidra's built-in server enables multi-user collaboration on shared projects, syncing labels, comments, decompilations, and analysis without manually sending files.
- Multiple users can access the same project simultaneously, but it's not fully real-time like Google Docs—changes sync via check-in/update with automatic merging (conflicts resolved manually; some operations like memory map changes require exclusive checkout).
- Evidence leans toward this being the standard and most reliable method for collaboration, with no simpler alternatives for true syncing while using local Ghidra clients.
- Self-hosting via Docker is straightforward and recommended for control.

**Setup Overview**
The official Ghidra server supports shared repositories for collaboration. For easy self-hosting, use the community-maintained Docker image `bytehow/ghidra-server` (matches official behavior, simplifies deployment). Clients must run the same Ghidra version as the server.

**Docker-Compose Setup**
Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  ghidra-server:
    image: bytehow/ghidra-server:latest  # Use a specific tag like :11.0.3 if needed for version matching
    container_name: ghidra-server
    environment:
      - GHIDRA_USERS=user1 user2 user3  # Space-separated list of initial usernames (add your desired users here)
      # - GHIDRA_PUBLIC_HOSTNAME=0.0.0.0  # Uncomment for local-only access; otherwise, it auto-detects public IP
    volumes:
      - /path/to/your/repos:/repos  # Persistent storage for repositories (choose a host path)
    ports:
      - "13100-13102:13100-13102"  # Required ports
    restart: unless-stopped
```

Run `docker-compose up -d` to start. Initial password for all users is `changeme` (Ghidra forces change on first login).

To add users later:  
`docker exec -it ghidra-server /ghidra/server/svrAdmin -add newuser`

**Exact Steps to Connect Ghidra Client to the Server**
1. Launch Ghidra on your local machine (ensure version matches server).
2. From the Project Window: **File > New Project** (or Ctrl+N).
3. Select **Shared Project** as the project type.
4. Enter the server hostname/IP (e.g., `your-server-ip` or `localhost` if local) and port (default `13100`).
5. Click **Connect**; log in with your username and password.
6. Choose an existing repository or create a new one (as creator, you're admin—set permissions for others: Read Only, Read/Write, Admin).
7. Specify a local folder for the project and finish.

To open an existing shared project later: Repeat steps 1-5, then select the repository.

Once connected:
- Import/add programs to the shared folder.
- Right-click files > **Check Out** (for edits; exclusive for structural changes).
- Make changes locally (labels, comments, etc.).
- Save, close tool window, right-click > **Check In** (with comment) to sync.
- Right-click > **Update** to pull others' changes (merges automatically where possible).

---

**Comprehensive Guide to Ghidra Multi-User Collaboration**

Ghidra's server component, included in every release, provides the primary mechanism for collaborative reverse engineering. It hosts repositories on a central server while users run full Ghidra clients locally. Projects are shared, and analysis artifacts (labels, comments, functions, decompilations, bookmarks, etc.) sync across users without file transfers.

**Collaboration Mechanics**
The system operates like a lightweight version control:
- Multiple users can open the same program simultaneously.
- Most annotations (labels, comments, function definitions) merge automatically on sync.
- Structural changes (e.g., memory map, language/processor selection) require exclusive checkout to prevent conflicts.
- Sync occurs manually via **Check In** (push changes) and **Update** (pull/merge changes).
- Version history is available per file (right-click > Show History) for reviewing commits, users, and comments.
- Conflicts, when they occur, prompt manual resolution with side-by-side comparison.

This avoids constant file sharing while allowing concurrent work. Recent versions (11.x+) have improved merging and performance, though core workflow remains check-in/update based.

**Self-Hosted Server Deployment Options**
While native installation is possible (unzip Ghidra, edit `server.conf`, run install scripts, manage with `svrAdmin`), Docker is preferred for isolation and ease—especially with `docker-compose`.

Recommended image: `bytehow/ghidra-server` (actively maintained, simple user provisioning).

| Component              | Details                                                                 |
|------------------------|-------------------------------------------------------------------------|
| Image                  | `bytehow/ghidra-server:latest` (or pinned version)                      |
| Ports                  | 13100 (main), 13101-13102 (additional connections)                       |
| Persistence            | Volume mount for `/repos` (stores all shared projects)                   |
| User Management        | Initial via `GHIDRA_USERS` env; later via `svrAdmin -add` in container |
| Authentication         | Password-based (default `changeme`, forced change)                       |
| Version Matching       | Client and server must match exactly for compatibility                   |

Alternative images exist (e.g., `loadwordteam/ghidra-server`), but `bytehow` offers the simplest startup.

**Detailed Client Connection and Workflow**

| Step                          | Action                                                                                          | Notes                                                                 |
|-------------------------------|-------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| 1. Create/Open Shared Project | File > New Project > Shared Project                                                             |                                                                       |
| 2. Server Details             | Host: server IP/hostname<br>Port: 13100                                                         | Use `localhost` if server runs locally                                |
| 3. Authenticate               | Username/password                                                                               | First login changes `changeme`                                         |
| 4. Repository Selection       | Create new or select existing                                                                   | Admin can edit access via Project > Edit Project Access List          |
| 5. Local Folder               | Choose local path for project files                                                             |                                                                       |
| 6. Working on Files           | Import/add programs > Right-click > Add to Version Control                                      | Makes visible to others                                               |
| 7. Editing                    | Check Out > Analyze > Save                                                                      | Exclusive for major changes                                           |
| 8. Syncing                    | Check In (push) / Update (pull/merge)                                                           | Include comments for history                                          |
| 9. History/Recovery           | Right-click file > Show History                                                                 | View past versions, revert if needed                                  |

Admins can view/terminate stale checkouts via the toolbar icon.

This setup fully meets the requirement for collaborative syncing while keeping Ghidra local. No external tools or modifications are needed.

**Key Citations**
- [bytehow/docker-ghidra-server GitHub Repository](https://github.com/bytehow/docker-ghidra-server)
- [Collaborative Reverse Engineering with Ghidra Server - byte.how](https://byte.how/posts/collaborative-reverse-engineering/)
- [Official Ghidra Server README (archived copy)](https://static.grumpycoder.net/pixel/server/svrREADME.html)
- [Ghidra Releases - NationalSecurityAgency/ghidra](https://github.com/NationalSecurityAgency/ghidra/releases)
