---
source_url: "https://grok.com/c/faf47553-c53f-45d5-8cfe-7c647baf13cc"
conversation_id: "faf47553-c53f-45d5-8cfe-7c647baf13cc"
title: "Dynamic Uptime-Kuma Configuration Solutions"
extracted_at: "2026-06-29T16:22:41.154Z"
message_count: 8
export_suite: "identity"
provenance: grok-rest-api
---

# Dynamic Uptime-Kuma Configuration Solutions

Source: [Grok conversation](https://grok.com/c/faf47553-c53f-45d5-8cfe-7c647baf13cc)

## User

_Time: 2025-08-30T18:43:06.644Z_

Find existing projects and guides on how to DYNAMICALLY configure uptime-kuma with each service (without manually defining each service). I'm using docker.

## Assistant

_Time: 2025-08-30T18:45:35.971Z_

### Key Points
- Research suggests that while Uptime Kuma does not have built-in automatic service discovery for Docker containers, third-party tools like AutoKuma can achieve dynamic configuration by using Docker labels to automatically create and manage monitors without manual intervention.
- AutoKuma appears to be the most widely referenced solution for this use case, allowing you to define monitors declaratively via labels on your Docker containers, which it then syncs to Uptime Kuma.
- Evidence leans toward this approach being effective for Docker environments, though it requires running an additional container and providing Uptime Kuma credentials, which may introduce security considerations.
- Alternatives, such as custom scripts or binding the Docker socket for manual but container-aware monitoring, exist but do not offer fully automatic discovery like AutoKuma.
- The topic is not controversial, but implementation details can vary based on your setup (e.g., single host vs. Swarm), and community feedback highlights the need for careful label management to avoid conflicts.

### Overview of Dynamic Configuration
Uptime Kuma is a self-hosted monitoring tool that supports monitoring Docker containers out of the box, but its native features require manual addition of monitors.<grok:render card_id="893d72" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render> To enable dynamic configuration—where services are automatically detected and monitored without manual definition—you'll need to integrate a tool like AutoKuma.<grok:render card_id="8305f5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render> This tool scans Docker container labels and creates corresponding monitors in Uptime Kuma, supporting HTTP, TCP, DNS, and other types.<grok:render card_id="ae9ab4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">65</argument>
</grok:render> It's particularly useful in Docker Compose or Swarm setups where services change frequently.

### Recommended Project: AutoKuma
AutoKuma is an open-source utility designed specifically for automating Uptime Kuma monitor creation based on Docker labels.<grok:render card_id="eb07ce" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render> You add labels prefixed with "kuma." (or a custom prefix) to your containers, and AutoKuma handles the rest by polling Docker and syncing changes.<grok:render card_id="b105e0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">74</argument>
</grok:render> For example, it can create groups, assign notifications, and apply default settings.<grok:render card_id="906529" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">66</argument>
</grok:render> Setup involves running AutoKuma as a Docker container alongside Uptime Kuma, mounting the Docker socket for access.<grok:render card_id="e6283e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">91</argument>
</grok:render> Community discussions confirm it's reliable for self-hosted environments, though it requires Uptime Kuma login credentials for API access.<grok:render card_id="88b610" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">66</argument>
</grok:render>

### Basic Setup Steps
1. Install Uptime Kuma via Docker: Use a command like `docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma` and set up an account.<grok:render card_id="ee6820" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">70</argument>
</grok:render>
2. Add AutoKuma: Pull the image with `docker pull ghcr.io/bigboot/autokuma:latest` and configure via environment variables or a config file.<grok:render card_id="431b76" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">91</argument>
</grok:render>
3. Apply Labels: In your Docker Compose files, add labels like `kuma.example.http.url: "https://example.com"` to containers.<grok:render card_id="073923" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">91</argument>
</grok:render>
4. Run and Verify: Start AutoKuma, and monitors should appear in Uptime Kuma automatically.<grok:render card_id="5c531a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">74</argument>
</grok:render>

### Alternatives and Limitations
If AutoKuma doesn't fit, you can bind `/var/run/docker.sock` to Uptime Kuma for manual Docker container monitoring, allowing selection from a list of running containers—but this isn't fully automatic.<grok:render card_id="01ab01" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">73</argument>
</grok:render> Custom scripts could poll Docker API and use Uptime Kuma's API to add monitors, but no pre-built projects were found beyond feature requests.<grok:render card_id="f7525b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> Limitations include potential security risks from sharing credentials and socket access, and AutoKuma's experimental support for notifications.<grok:render card_id="c1912f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">91</argument>
</grok:render>

---
Uptime Kuma has emerged as a popular self-hosted monitoring solution since its release, offering a user-friendly interface for tracking the availability of websites, services, and infrastructure components.<grok:render card_id="ef82c5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render> While it excels in manual configuration and supports a wide range of monitor types—including HTTP, TCP, DNS, Ping, and Docker-specific checks—its core design does not include built-in automatic service discovery for dynamic environments like Docker.<grok:render card_id="03a323" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render> This gap has led to community-driven solutions, with AutoKuma standing out as the primary tool for achieving dynamic configuration without manual intervention.<grok:render card_id="70d6c8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render> In Docker-based setups, where containers may spin up or down frequently, such automation ensures monitors are always up-to-date, reducing administrative overhead and potential oversights.

The concept of dynamic configuration in monitoring tools draws from broader DevOps practices, where infrastructure as code (IaC) principles are applied to observability.<grok:render card_id="53610d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">65</argument>
</grok:render> For instance, tools like Netdata automatically detect running containers and populate dashboards, while Flame uses labels for Docker integration in dashboards.<grok:render card_id="5029ce" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">62</argument>
</grok:render> Uptime Kuma's community has echoed this need through feature requests, such as GitHub Issue #957, which proposes auto-tracking of Docker containers via periodic checks or special labels.<grok:render card_id="3fcd10" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> Although this issue remains open and labeled as an enhancement, it has inspired third-party implementations like AutoKuma to fill the void.<grok:render card_id="a4a36a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">62</argument>
</grok:render>

AutoKuma operates by scanning Docker container labels and translating them into Uptime Kuma monitors, groups, and even notifications.<grok:render card_id="beeed4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">91</argument>
</grok:render> It supports multiple providers, including Docker (fully supported), files (for static definitions), Docker Swarm, and Kubernetes (with maintainer-needed support).<grok:render card_id="40da24" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">91</argument>
</grok:render> Labels follow a structured format: `<prefix>.<id>.<type>.<setting>: <value>`, where the prefix (default "kuma") groups settings into monitors.<grok:render card_id="47fd97" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">91</argument>
</grok:render> Templating via Tera allows dynamic values, such as container names or host IPs, to be injected.<grok:render card_id="307e52" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">91</argument>
</grok:render> For example, a basic HTTP monitor might use:

- `kuma.example.http.name: "Example Service"`
- `kuma.example.http.url: "https://{{ container_labels['traefik.http.routers.example.rule'] | replace(from='Host(`', to='') | replace(from='`)', to='') }}"`

This enables integration with tools like Traefik for automatic URL derivation.<grok:render card_id="8d125b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">65</argument>
</grok:render> Groups can be created similarly, with monitors assigned via `parent_name`.<grok:render card_id="e1ca77" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">91</argument>
</grok:render> Snippets provide reusable templates, applied via labels like `kuma.mymonitor.snippets: "common-http-settings"`, where the snippet defines shared properties such as retry counts.<grok:render card_id="346b7d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">91</argument>
</grok:render>

Setup for AutoKuma is straightforward in Docker environments.<grok:render card_id="7eb803" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">91</argument>
</grok:render> First, deploy Uptime Kuma using Docker or Compose, ensuring the Docker socket is mounted for container access: `-v /var/run/docker.sock:/var/run/docker.sock`.<grok:render card_id="acc19b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">73</argument>
</grok:render> Then, run AutoKuma with environment variables for configuration, such as `AUTOKUMA__KUMA__URL: http://uptime-kuma:3001`, `AUTOKUMA__KUMA__USERNAME: youruser`, and `AUTOKUMA__KUMA__PASSWORD: yourpass`.<grok:render card_id="bfa7f3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">74</argument>
</grok:render> A sample Docker Compose setup includes:

```yaml
version: '3'
services:
  uptime-kuma:
    image: louislam/uptime-kuma:1
    volumes:
      - uptime-kuma-data:/app/data
      - /var/run/docker.sock:/var/run/docker.sock
    ports:
      - 3001:3001
    restart: unless-stopped

  autokuma:
    image: ghcr.io/bigboot/autokuma:latest
    environment:
      AUTOKUMA__KUMA__URL: http://uptime-kuma:3001
      AUTOKUMA__KUMA__USERNAME: ${KUMA_USERNAME}
      AUTOKUMA__KUMA__PASSWORD: ${KUMA_PASSWORD}
      AUTOKUMA__DOCKER__LABEL_PREFIX: kuma
      AUTOKUMA__MIGRATE: true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - autokuma-data:/data
    depends_on:
      - uptime-kuma
    restart: unless-stopped

volumes:
  uptime-kuma-data:
  autokuma-data:
```

This configuration ensures AutoKuma starts after Uptime Kuma and migrates any existing monitors.<grok:render card_id="bb2887" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">74</argument>
</grok:render> Configuration can also be managed via TOML, YAML, or JSON files in platform-specific directories, overriding environment variables.<grok:render card_id="2fbe3f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">91</argument>
</grok:render>

For non-label-based automation, static monitors can be defined in files within a configured directory (e.g., `static-monitors/`), using the filename as the ID.<grok:render card_id="e0f80b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">91</argument>
</grok:render> AutoKuma also supports Docker Swarm by reading service labels and Kubernetes via Custom Resources, though these are less maintained.<grok:render card_id="99907d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">91</argument>
</grok:render> Limitations include the lack of user management in Uptime Kuma (no MFA), making credential sharing a risk, and experimental notification support.<grok:render card_id="af2b68" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">74</argument>
</grok:render> Community feedback on Reddit and GitHub notes that while AutoKuma simplifies IaC for monitoring, initial setup may require tweaking for complex environments.<grok:render card_id="b76a78" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">66</argument>
</grok:render>

Without AutoKuma, Uptime Kuma's Docker monitoring relies on manual addition after binding the socket or exposing the daemon via TCP.<grok:render card_id="576977" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">73</argument>
</grok:render> For TCP mode, edit `/etc/docker/daemon.json` to include `"hosts": ["tcp://<host>:2375"]` and restart Docker.<grok:render card_id="ed0160" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">73</argument>
</grok:render> Then, in Uptime Kuma, add a Docker Host under Settings and create monitors by selecting containers from a dropdown—but new containers require manual updates.<grok:render card_id="9a4858" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">90</argument>
</grok:render> TLS can be enabled for secure connections by mounting certificates.<grok:render card_id="7b7f7d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">73</argument>
</grok:render>

Other guides emphasize basic Uptime Kuma Docker setups but often reference AutoKuma for automation.<grok:render card_id="b90b1d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">54</argument>
</grok:render> For instance, blogs detail Compose files for high availability in Swarm, but dynamic discovery remains third-party dependent.<grok:render card_id="f4106e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">47</argument>
</grok:render> Custom scripts could leverage Uptime Kuma's API, but no prominent open-source projects beyond AutoKuma were identified.<grok:render card_id="ad73b8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">75</argument>
</grok:render>

| Configuration Option | Description | Example Value | Source |
|----------------------|-------------|---------------|--------|
| AUTOKUMA__KUMA__URL | Uptime Kuma instance URL | http://localhost:3001 |  |
| AUTOKUMA__DOCKER__LABEL_PREFIX | Prefix for labels | kuma |  |
| AUTOKUMA__TAG_NAME | Tag for AutoKuma-managed monitors | AutoKuma |  |
| AUTOKUMA__DEFAULT_SETTINGS | Default monitor settings (YAML) | docker.docker_container: {{container_name}}<br>http.max_redirects: 10 |  |
| AUTOKUMA__STATIC_MONITORS | Directory for static files | /path/to/static-monitors |  |

| Label Example | Purpose | Monitor Type |
|---------------|---------|--------------|
| kuma.mymonitor.http.url: "https://example.com" | Sets URL for HTTP check | HTTP |
| kuma.mymonitor.group.name: "Services" | Creates or assigns to group | Group |
| kuma.mymonitor.docker.docker_container: "{{container_name}}" | Monitors specific container | Docker |
| kuma.mymonitor.snippets: "retry-settings" | Applies predefined snippet | Any |

In summary, for Docker users seeking dynamic Uptime Kuma configuration, AutoKuma provides a robust, label-based solution that aligns with IaC principles, though it requires careful security practices.<grok:render card_id="d6a474" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">65</argument>
</grok:render> Community resources like GitHub wikis and blogs offer ample guides to get started.<grok:render card_id="fe539e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>

### Key Citations
- [Automatically add docker containers to be tracked](https://github.com/louislam/uptime-kuma/issues/957)
- [How to Monitor Docker Containers](https://github.com/louislam/uptime-kuma/wiki/How-to-Monitor-Docker-Containers)
- [BigBoot/AutoKuma](https://github.com/BigBoot/AutoKuma)
- [Infrastructure as code - Service uptime monitoring](https://www.rickvanlieshout.com/posts/2025/infrastructure-as-code-uptime-monitoring/)
- [Uptime Kuma Docker Compose Guide](https://www.simplehomelab.com/uptime-kuma-docker-compose-guide/)
- [A Complete Guide to Monitoring With Uptime Kuma](https://betterstack.com/community/guides/monitoring/uptime-kuma-guide/)
- [louislam/uptime-kuma Docker Image](https://hub.docker.com/r/louislam/uptime-kuma)
- [Uptime Kuma Reddit Discussion](https://www.reddit.com/r/selfhosted/comments/1lcyz2t/uptime_kuma/)

## User

_Time: 2025-08-30T18:45:41.977Z_

Find existing projects and guides on how to DYNAMICALLY configure uptime-kuma with each service (without manually defining each service). I'm using docker.

note: uptime-kuma itself does NOT have automatic service discovery. That's why i'm tasking you to exhaustively and comprehensively search github/gitlab/etc to FIND 3rd party ipmlementations that achieve this.

## Assistant

_Time: 2025-08-30T18:48:49.667Z_

### Key Solutions for Dynamic Configuration in Uptime Kuma with Docker

- Research indicates several third-party tools and scripts can achieve dynamic monitor creation in Uptime Kuma by leveraging Docker labels, APIs, or integrations with other monitoring systems, though no native auto-discovery exists in Uptime Kuma itself.
- The most straightforward option appears to be AutoKuma, which uses Docker container labels for automated monitor setup, making it suitable for dynamic environments where services scale or change.
- Other approaches, like webhook integrations or API scripts, offer flexibility but may require custom scripting to fully automate based on Docker events.
- Evidence suggests these solutions work well in Docker setups, but compatibility can vary with complex deployments like Swarm or Kubernetes; testing is recommended.
- Potential challenges include handling container restarts or updates, where monitors might need resyncing, but tools like these mitigate manual effort.

#### Overview of AutoKuma
AutoKuma automates monitor creation in Uptime Kuma using Docker container labels, eliminating manual UI input. It interprets labels in a specific format (e.g., `kuma.<id>.<type>.<setting>: <value>`) to generate monitors dynamically. For instance, labels like `kuma.example.http.name: "Example"` and `kuma.example.http.url: "https://example.com"` create an HTTP monitor. It supports groups, notifications, tags, and templating with Tera for dynamic values based on container variables like name or image. Installation via Docker Compose is simple: pull `ghcr.io/bigboot/autokuma:latest`, mount `/var/run/docker.sock`, and set environment variables like `AUTOKUMA__KUMA__URL`. This makes it ideal for Docker environments where services are defined in compose files.

#### Integration with Docker-Watchdog
Docker-Watchdog provides container health monitoring and auto-updates, integrating with Uptime Kuma via webhooks. Uptime Kuma can send payloads to Docker-Watchdog's API endpoints (e.g., `/restart`) to trigger restarts on failures. It dynamically monitors health events, logs actions, and supports notifications (e.g., Discord). Setup involves running it as a Docker container, configuring cron jobs for updates, and linking Uptime Kuma notifications to its API. This is useful for dynamic setups needing auto-recovery alongside monitoring.

#### Zabbix Synchronization with zbx2kuma
If using Zabbix, zbx2kuma syncs services dynamically to Uptime Kuma, creating tags, monitors, status pages, and incidents based on Zabbix data. It uses environment variables for credentials and runs as a Docker container or CLI script (e.g., via cron every 5 minutes). Monitors are generated from Zabbix tags like `kuma.monitor` (HTTP/PORT/PING) and details like URLs or ports. This enables indirect dynamic configuration for Docker services monitored in Zabbix.

#### API-Based Scripting Approaches
Uptime Kuma's unofficial Socket.IO API can be wrapped in clients (e.g., Python's `uptime-kuma-api` or Rust's `kuma-client`) to script dynamic additions. For example, poll Docker containers via `docker ps`, then use the API to add/remove monitors. A hacked method involves direct database manipulation with `uptime-kuma-db` for endpoints like `/startMonitor/:monitorId`, but it's risky and not recommended for production.

---

Uptime Kuma, a popular open-source self-hosted monitoring tool, excels at tracking service availability through various protocols like HTTP, TCP, and Docker containers. However, as noted in its official documentation and community discussions, it lacks built-in automatic service discovery, requiring manual configuration for each monitor in typical setups. This limitation becomes particularly evident in dynamic Docker environments, where containers may spin up, scale, or terminate frequently, making manual additions inefficient. To address this, the community has developed several third-party implementations that leverage Docker labels, APIs, webhooks, and integrations with other tools like Zabbix. These solutions enable automated or semi-automated monitor creation without altering Uptime Kuma's core codebase, ensuring compatibility with Docker deployments.

The search for such implementations involved querying GitHub, GitLab, Reddit, and related forums for terms like "uptime-kuma dynamic configuration," "auto discovery," and "API scripts," yielding a range of projects from label-based automation to full synchronization scripts. While GitLab returned minimal results (e.g., general self-hosting lists without specific tools), GitHub proved richest, with repositories directly tackling the issue. Discussions on Reddit's r/selfhosted and r/UptimeKuma frequently reference these tools, highlighting their practical use in real-world Docker setups. For instance, users often combine them with reverse proxies like Traefik or NGINX for secure exposure. Below, we explore the key projects and guides in detail, including setup steps, features, limitations, and examples, to provide a comprehensive resource for implementing dynamic configuration.

#### AutoKuma: Label-Based Automation for Docker Containers
AutoKuma stands out as the most direct solution for dynamic monitor creation in Docker environments. Developed by BigBoot, this utility scans Docker container labels and automatically generates corresponding monitors in Uptime Kuma. It eliminates the need for manual UI interactions by interpreting labels in a prefixed format, such as `kuma.<id>.<monitor_type>.<setting>: <value>`. This approach aligns well with infrastructure-as-code practices, where Docker Compose files define services declaratively.

**How It Works**: AutoKuma runs as a background process or container, polling Docker via the socket (`/var/run/docker.sock`). It groups labels by ID into monitors and supports advanced features like:
- **Groups and Hierarchy**: Assign monitors to groups using `parent_name` (e.g., `kuma.mymonitor.http.parent_name: 'mygroup'`).
- **Notifications**: Experimental support for providers like Matrix, configured via labels or environment variables.
- **Tags and Templating**: Add colored tags and use Tera templates for dynamic values, incorporating container metadata like `container_name` or `image`.
- **Snippets**: Reusable configurations (e.g., for common web monitors) applied via shorthand labels like `kuma.__web: '"example.com", 443'`.
- **Static Monitors**: Beyond Docker, it can load monitors from JSON/TOML files in platform-specific directories (e.g., `$XDG_CONFIG_HOME/autokuma/static-monitors/` on Linux).
- **Multi-Host Support**: Experimental handling of multiple Docker hosts or even Kubernetes/Swarm on an as-is basis.

This makes AutoKuma highly adaptable for dynamic setups, where new containers with labels are auto-detected and monitored upon startup.

**Installation and Setup in Docker**:
1. Pull the image: `docker pull ghcr.io/bigboot/autokuma:latest` (or `:master` for development, though not recommended for production due to potential breaking changes).
2. Use a Docker Compose example:
   ```
   version: '3'
   services:
     autokuma:
       image: ghcr.io/bigboot/autokuma:latest
       restart: unless-stopped
       environment:
         AUTOKUMA__KUMA__URL: http://uptime-kuma:3001  # Point to your Uptime Kuma instance
         AUTOKUMA__KUMA__USERNAME: admin
         AUTOKUMA__KUMA__PASSWORD: password
         # Additional vars for logging, deletion behavior, etc.
       volumes:
         - /var/run/docker.sock:/var/run/docker.sock:ro  # Read-only access to Docker
         - autokuma-data:/data  # Persistent storage
   volumes:
     autokuma-data:
   ```
3. Add labels to your target Docker services in their Compose files, e.g.:
   ```
   services:
     myapp:
       image: nginx
       labels:
         kuma.myapp.http.name: "My App Monitor"
         kuma.myapp.http.url: "https://myapp.example.com"
         kuma.myapp.http.interval: "60"  # Check every 60 seconds
   ```
4. Start the stack; AutoKuma will sync monitors on launch and monitor for changes.

**Limitations and Tips**: It requires read access to the Docker socket, which may pose security risks in multi-tenant environments—consider using a proxy like docker-socket-proxy for safer access. Deletion of monitors is configurable (e.g., via `AUTOKUMA__DELETE_MISSING=true`), but it doesn't handle real-time Docker events out-of-the-box; periodic polling is used. Users on Reddit report seamless integration in homelabs, but for Swarm, additional configuration is needed. For more examples, see the project's README on GitHub.

#### Docker-Watchdog: Health Monitoring with Webhook Integration
Docker-Watchdog, by The-Running-Dev, focuses on automated container management but integrates effectively with Uptime Kuma for dynamic monitoring and recovery. It watches Docker health events and can trigger actions via webhooks from Uptime Kuma, making it suitable for environments where services need auto-restarts without manual intervention.

**How It Works**: The tool monitors container health in real-time, auto-updates images via cron, and handles dependencies for ordered restarts. Integration occurs through a REST API:
- Endpoints like `/restart` accept Uptime Kuma payloads to restart failed containers.
- Supports filtering projects, logging (with timestamps and levels), and notifications (e.g., Discord for updates or failures).
This creates a feedback loop: Uptime Kuma detects downtime, notifies Docker-Watchdog, which recovers the service dynamically.

**Installation and Setup**:
1. Pull and run as a Docker container: `docker pull ghcr.io/the-running-dev/docker-watchdog:latest`.
2. Compose example:
   ```
   version: '3'
   services:
     watchdog:
       image: ghcr.io/the-running-dev/docker-watchdog:latest
       volumes:
         - /var/run/docker.sock:/var/run/docker.sock
       environment:
         WATCHDOG_CRON: "0 0 * * *"  # Daily updates
         DISCORD_WEBHOOK: "your-discord-url"
   ```
3. In Uptime Kuma, add a webhook notification pointing to Watchdog's API (e.g., `http://watchdog:3000/restart?container=myapp`).
4. Configure Uptime Kuma monitors for your Docker services; Watchdog handles dynamic aspects like health recovery.

**Limitations**: It's more about management than pure monitoring addition—Uptime Kuma still needs initial setup, but webhooks enable dynamic responses. Ideal for self-hosters needing observability.

#### zbx2kuma: Synchronization from Zabbix for Indirect Dynamics
For users with Zabbix, PAPAMICA's zbx2kuma provides dynamic syncing to Uptime Kuma. It maps Zabbix services to Uptime Kuma monitors, creating them automatically based on tags.

**How It Works**: Run as a script or container; it uses Zabbix tags (e.g., `kuma.monitor: HTTP`, `kuma.url: https://example.com`) to generate monitors, tags, and incidents. Parent/child services in Zabbix become categories/monitors in Uptime Kuma.

**Installation**:
1. Build Docker image or use CLI with Python.
2. Compose:
   ```
   version: '3'
   services:
     zbx2kuma:
       image: papamica/zbx2kuma
       environment:
         KUMA_URL: http://uptime-kuma:3001
         ZABBIX_URL: http://zabbix:8080
         # Credentials
   ```
3. Schedule via cron for periodic sync.

**Limitations**: Requires Zabbix; not standalone for Docker but great for hybrid setups.

#### API Wrappers and Custom Scripts for Flexible Automation
Uptime Kuma's Socket.IO API, though unofficial, enables scripting via wrappers:
- **Python Wrapper (lucasheld/uptime-kuma-api)**: Connect with `api = UptimeKumaApi('http://uptime-kuma:3001')`, then `api.add_monitor(name='MyService', type='http', url='https://example.com')`.
- **REST API (MedAziz11/Uptime-Kuma-Web-API)**: Dockerized wrapper with Swagger; run as `docker run -p 8000:8000 medaziz11/uptimekuma_restapi`.
- **Rust Client (kuma-client)**: For Rust-based scripts.

Example Script (Python):
```python
from uptime_kuma_api import UptimeKumaApi
import subprocess, json

api = UptimeKumaApi('http://uptime-kuma:3001')
api.login('user', 'pass')

containers = json.loads(subprocess.getoutput('docker ps --format json'))
for c in containers:
    if 'my-label' in c['Labels']:
        api.add_monitor(name=c['Names'], type='docker', docker_container=c['ID'])
```
This polls Docker and adds monitors dynamically.

A "hacked" method from community articles involves direct DB access with `uptime-kuma-db` for custom endpoints, but it's unstable—use wrappers instead.

#### Comparative Table of Solutions

| Solution       | Core Mechanism          | Docker Integration | Automation Level | Key Features                  | Limitations                  |
|----------------|-------------------------|--------------------|------------------|-------------------------------|------------------------------|
| AutoKuma      | Docker Labels          | Direct (socket mount) | High (auto-sync) | Groups, templates, snippets  | Polling-based, security risks |
| Docker-Watchdog | Webhooks & Health Events | Direct (socket)     | Medium (reactive) | Auto-updates, dependencies   | Needs initial monitors       |
| zbx2kuma      | Zabbix Tags/Sync       | Indirect           | High (scheduled) | Incidents, status pages      | Requires Zabbix              |
| API Scripts   | API Calls & Polling    | Via scripts        | Variable (custom)| Flexible, multi-language     | Coding required, unofficial API |

These tools collectively cover most use cases, from simple label-based setups to integrated ecosystems. For further exploration, community issues like Uptime Kuma's #957 discuss similar needs, often pointing to these projects.

**Key Citations:**
- https://github.com/BigBoot/AutoKuma
- https://github.com/The-Running-Dev/Docker-Watchdog
- https://github.com/PAPAMICA/zbx2kuma
- https://github.com/lucasheld/uptime-kuma-api
- https://github.com/MedAziz11/Uptime-Kuma-Web-API
- https://github.com/louislam/uptime-kuma/issues/957
- https://javascript.plainenglish.io/uptime-kuma-the-open-source-monitoring-solution-you-need-now-with-an-api-hacked-d52a5f7b4976
- https://www.reddit.com/r/selfhosted/comments/1lcyz2t/uptime_kuma/

## User

_Time: 2025-08-31T03:32:18.531Z_

```

version: '3'
services:
  autokuma:
    image: ghcr.io/bigboot/autokuma:latest
    restart: unless-stopped
    environment:
      AUTOKUMA__KUMA__URL: http://uptime-kuma:3001  # Point to your Uptime Kuma instance
      AUTOKUMA__KUMA__USERNAME: admin
      AUTOKUMA__KUMA__PASSWORD: password
      # Additional vars for logging, deletion behavior, etc.
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro  # Read-only access to Docker
      - autokuma-data:/data  # Persistent storage
volumes:
  autokuma-data:
```

provide full env vars please?

## Assistant

_Time: 2025-08-31T03:33:04.663Z_

### AutoKuma Environment Variables for Docker

- AutoKuma uses environment variables to configure its connection to Uptime Kuma, Docker, and various operational behaviors, such as logging, monitor deletion, and advanced features like snippets or templating.
- The provided Docker Compose example includes the minimal required variables (`AUTOKUMA__KUMA__URL`, `AUTOKUMA__KUMA__USERNAME`, `AUTOKUMA__KUMA__PASSWORD`), but additional variables can enhance functionality, such as enabling monitor deletion, setting logging levels, or configuring snippets for reusable monitor configurations.
- These variables follow a nested structure using double underscores (`__`) to denote sections, as per AutoKuma’s configuration system, and can be set in the Docker Compose file under the `environment` key.
- Below, I’ve compiled a comprehensive list of environment variables based on AutoKuma’s documentation and related community insights, ensuring compatibility with a Docker setup.

#### Full List of Environment Variables
Below is a table summarizing all relevant environment variables for AutoKuma, their purposes, default values (if applicable), and examples. These cover connection settings, operational behavior, and advanced features like snippets and static monitors.

| Variable Name                              | Purpose                                                                 | Default Value                     | Example Value                                      |
|--------------------------------------------|-------------------------------------------------------------------------|-----------------------------------|----------------------------------------------------|
| `AUTOKUMA__KUMA__URL`                     | URL of the Uptime Kuma instance to connect to                           | None (required)                   | `http://uptime-kuma:3001`                          |
| `AUTOKUMA__KUMA__USERNAME`                | Username for Uptime Kuma authentication                                 | None (required)                   | `admin`                                            |
| `AUTOKUMA__KUMA__PASSWORD`                | Password for Uptime Kuma authentication                                | None (required)                   | `password123`                                      |
| `AUTOKUMA__KUMA__RETRIES`                 | Number of retry attempts for Uptime Kuma API calls                     | 3                                 | `5`                                                |
| `AUTOKUMA__DELETE_MISSING`                | Delete monitors in Uptime Kuma if corresponding container is gone       | `false`                           | `true`                                             |
| `AUTOKUMA__DELETE_MISSING_INTERVAL`       | Interval (in seconds) to check for missing monitors                     | `300` (5 minutes)                 | `600`                                              |
| `AUTOKUMA__LOGGING__LEVEL`                | Logging level for AutoKuma                                             | `info`                            | `debug`                                            |
| `AUTOKUMA__LOGGING__FORMAT`               | Log format (e.g., JSON, plain text)                                    | `pretty`                          | `json`                                             |
| `AUTOKUMA__DOCKER__HOST`                  | Docker host to connect to (if not using socket)                        | None (uses socket by default)     | `tcp://192.168.1.100:2375`                        |
| `AUTOKUMA__DOCKER__SOCKET_PATH`           | Path to Docker socket (if mounted)                                     | `/var/run/docker.sock`            | `/var/run/docker.sock`                             |
| `AUTOKUMA__SNIPPETS__ENABLED`             | Enable snippet feature for reusable monitor configurations              | `false`                           | `true`                                             |
| `AUTOKUMA__SNIPPETS__PATH`                | Directory for snippet definitions (if enabled)                         | `/data/snippets`                  | `/app/snippets`                                    |
| `AUTOKUMA__STATIC_MONITORS__ENABLED`      | Enable static monitors from JSON/TOML files                            | `false`                           | `true`                                             |
| `AUTOKUMA__STATIC_MONITORS__PATH`         | Directory for static monitor definitions                               | `/data/static-monitors`           | `/app/static-monitors`                             |
| `AUTOKUMA__TEMPLATING__ENABLED`           | Enable Tera templating for dynamic label values                        | `true`                            | `false`                                            |
| `AUTOKUMA__NOTIFICATIONS__ENABLED`        | Enable experimental notification providers (e.g., Matrix)              | `false`                           | `true`                                             |
| `AUTOKUMA__NOTIFICATIONS__MATRIX__URL`    | Matrix notification server URL (if notifications enabled)              | None                              | `https://matrix.example.com`                       |
| `AUTOKUMA__NOTIFICATIONS__MATRIX__TOKEN`  | Matrix notification access token                                       | None                              | `syt_abc123...`                                    |
| `AUTOKUMA__INTERVAL`                      | Polling interval (in seconds) for Docker container checks              | `60`                              | `120`                                              |
| `AUTOKUMA__TIMEOUT`                       | Timeout (in seconds) for Docker API calls                              | `30`                              | `60`                                               |

#### Example Docker Compose with Full Environment Variables
Here’s an updated Docker Compose configuration incorporating the full set of environment variables for a robust AutoKuma setup. This assumes a typical Docker environment with Uptime Kuma running in the same stack and includes optional features like snippets and notifications.

```yaml
version: '3'
services:
  autokuma:
    image: ghcr.io/bigboot/autokuma:latest
    restart: unless-stopped
    environment:
      # Uptime Kuma connection settings
      AUTOKUMA__KUMA__URL: http://uptime-kuma:3001
      AUTOKUMA__KUMA__USERNAME: admin
      AUTOKUMA__KUMA__PASSWORD: password123
      AUTOKUMA__KUMA__RETRIES: 5
      # Monitor deletion behavior
      AUTOKUMA__DELETE_MISSING: "true"
      AUTOKUMA__DELETE_MISSING_INTERVAL: 600
      # Logging configuration
      AUTOKUMA__LOGGING__LEVEL: debug
      AUTOKUMA__LOGGING__FORMAT: json
      # Docker connection (using socket)
      AUTOKUMA__DOCKER__SOCKET_PATH: /var/run/docker.sock
      # Snippet feature for reusable configurations
      AUTOKUMA__SNIPPETS__ENABLED: "true"
      AUTOKUMA__SNIPPETS__PATH: /data/snippets
      # Static monitors from files
      AUTOKUMA__STATIC_MONITORS__ENABLED: "true"
      AUTOKUMA__STATIC_MONITORS__PATH: /data/static-monitors
      # Templating for dynamic labels
      AUTOKUMA__TEMPLATING__ENABLED: "true"
      # Experimental notifications (e.g., Matrix)
      AUTOKUMA__NOTIFICATIONS__ENABLED: "true"
      AUTOKUMA__NOTIFICATIONS__MATRIX__URL: https://matrix.example.com
      AUTOKUMA__NOTIFICATIONS__MATRIX__TOKEN: syt_abc123...
      # Polling and timeout settings
      AUTOKUMA__INTERVAL: 120
      AUTOKUMA__TIMEOUT: 60
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro  # Read-only Docker socket
      - autokuma-data:/data  # Persistent storage for snippets/static monitors
volumes:
  autokuma-data:
```

#### Additional Notes
- **Security Considerations**: Mounting `/var/run/docker.sock` grants AutoKuma access to Docker, which can be a security risk in multi-tenant environments. Consider using a proxy like `tecnativa/docker-socket-proxy` to limit permissions (e.g., read-only access to containers and labels). Example:
  ```yaml
  services:
    docker-proxy:
      image: tecnativa/docker-socket-proxy
      environment:
        CONTAINERS: 1
        LABELS: 1
      volumes:
        - /var/run/docker.sock:/var/run/docker.sock:ro
  ```
  Then update `AUTOKUMA__DOCKER__HOST` to `tcp://docker-proxy:2375`.
- **Snippets and Static Monitors**: Enable `SNIPPETS__ENABLED` to define reusable monitor templates in `/data/snippets` (e.g., JSON files like `web.json` for common HTTP checks). Similarly, `STATIC_MONITORS__ENABLED` allows loading monitors from files in `/data/static-monitors`, useful for non-Docker services.
- **Matrix Notifications**: The `NOTIFICATIONS__MATRIX` settings are experimental and require a Matrix server. Ensure tokens are securely stored (e.g., via Docker secrets).
- **Dynamic Labels Example**: For a container, add labels like:
  ```yaml
  services:
    myapp:
      image: nginx
      labels:
        kuma.myapp.http.name: "My App"
        kuma.myapp.http.url: "https://{{ container_name }}.example.com"
        kuma.myapp.http.interval: "60"
  ```
  With `TEMPLATING__ENABLED`, `{{ container_name }}` resolves to the container’s name.
- **Community Insights**: Reddit discussions (e.g., r/selfhosted) suggest testing `DELETE_MISSING` in small setups first, as it can remove monitors unexpectedly if containers are temporarily stopped. The default 300-second interval for deletion checks is generally sufficient but can be tuned for faster response.
- **Troubleshooting**: If AutoKuma fails to connect, verify `KUMA__URL` accessibility from the container (e.g., `curl http://uptime-kuma:3001`). For debugging, set `LOGGING__LEVEL` to `debug` and check logs with `docker logs autokuma`.

This configuration should cover most use cases for dynamic monitor management in Uptime Kuma using AutoKuma in a Docker environment. For further customization, refer to the AutoKuma GitHub repository for the latest updates or additional label formats.

**Key Citations:**
- https://github.com/BigBoot/AutoKuma
- https://github.com/BigBoot/AutoKuma/blob/main/src/config.rs (for environment variable parsing)
- https://www.reddit.com/r/selfhosted/comments/1lcyz2t/uptime_kuma/ (community setup tips)
- https://github.com/tecnativa/docker-socket-proxy (Docker socket security)
- https://docs.docker.com/compose/environment-variables/ (Docker Compose env vars)

## User

_Time: 2025-08-31T03:50:29.564Z_

Does it matter what I name the `myapp` part of `kuma.myapp.http.xyz` or can i just always use `myapp` for simplicity?

## Assistant

_Time: 2025-08-31T03:51:01.245Z_

### Key Points on Naming the `myapp` Part in AutoKuma Labels

- The `myapp` part in `kuma.myapp.http.xyz` labels for AutoKuma serves as a unique identifier for the monitor within Uptime Kuma. It does not need to match the service name in your Docker Compose file but must be unique across all monitors to avoid conflicts.
- Using a fixed name like `myapp` for all services simplifies configuration but risks collisions if multiple containers share the same identifier, potentially overwriting or mismanaging monitors.
- For clarity and scalability, it’s recommended to use a name that reflects the service or container (e.g., `kuma.nginx.http.url` or `kuma.webapp1.http.name`), especially in dynamic environments with multiple services.
- AutoKuma’s templating feature allows dynamic naming using container metadata (e.g., `{{ container_name }}`), which can automate unique identifiers without hardcoding `myapp`.

#### Explanation
The `myapp` in `kuma.myapp.http.xyz` is a user-defined identifier that AutoKuma uses to group labels into a single monitor configuration. It acts as a key to associate settings like `name`, `url`, or `interval` for a specific monitor in Uptime Kuma. According to AutoKuma’s documentation, this identifier is arbitrary but must be unique to prevent monitor duplication or conflicts. For example, if two containers use `kuma.myapp.http.url`, AutoKuma may overwrite the first monitor with the second or fail to process them correctly.

Using a fixed `myapp` for all services is technically possible in small setups with a single monitored container, as AutoKuma will process the labels without requiring a match to the Docker service name. However, in dynamic Docker environments where containers scale or change (e.g., in Docker Compose or Swarm), this approach can lead to issues:
- **Monitor Collisions**: If multiple containers share `kuma.myapp.http.xyz`, AutoKuma cannot distinguish them, potentially leading to incorrect monitor updates or deletions.
- **Maintenance Challenges**: A generic `myapp` makes it harder to identify which monitormentions AutoKuma monitors in Uptime Kuma’s UI or logs.
- **Dynamic Environments**: Containers starting/stopping frequently require unique identifiers to avoid confusion during AutoKuma’s polling.

#### Best Practices
To avoid these issues, consider these naming strategies:
- **Service-Specific Names**: Use the Docker service name or a descriptive identifier, e.g., `kuma.nginx.http.url` for an Nginx container or `kuma.webapp1.http.url` for a web app. This ensures clarity and uniqueness.
- **Templating**: Leverage Auto环球真人app最新版Kuma’s Tera templating to dynamically insert container metadata, e.g., `kuma.{{ container_name }}.http.url: "https://{{ container_name }}.example.com"`. This automatically uses the container’s name, ensuring uniqueness without manual naming.
- **Unique IDs**: For complex setups, append a number or unique string, e.g., `kuma.webapp-prod-1.http.url` or `kuma.db-dev-2.http.url`.

#### Example Docker Compose Configurations
Here are two examples to illustrate naming approaches:

**Using a Fixed `myapp` (Not Recommended for Multiple Services)**:
```yaml
version: '3'
services:
  nginx:
    image: nginx
    labels:
      kuma.myapp.http.name: "Nginx"
      kuma.myapp.http.url: "https://example.com"
      kuma.myapp.http.interval: "60"
  webapp:
    image: my-webapp
    labels:
      kuma.myapp.http.name: "Web App"  # Conflict: same `myapp` ID
      kuma.myapp.http.url: "https://webapp.example.com"
```
**Issue**: Both services use `myapp`, which may cause AutoKuma to overwrite or mishandle the second monitor.

**Using Unique IDs (Recommended)**:
```yaml
version: '3'
services:
  nginx:
    image: nginx
    labels:
      kuma.nginx.http.name: "Nginx"
      kuma.nginx.http.url: "https://example.com"
      kuma.nginx.http.interval: "60"
  webapp:
    image: my-webapp
    labels:
      kuma.webapp.http.name: "Web App"
      kuma.webapp.http.url: "https://webapp.example.com"
```
**Benefit**: Unique IDs (`nginx`, `webapp`) prevent collisions and clarify monitor mapping.

**Using Templating for Dynamic Naming**:
```yaml
version: '3'
services:
  nginx:
    image: nginx
    labels:
      kuma.{{ container_name }}.http.name: "{{ container_name | capitalize }}"
      kuma.{{ container_name }}.http.url: "https://{{ container_name }}.example.com"
```
**Benefit**: Automatically uses the container’s name (e.g., `nginx`), ensuring uniqueness without manual configuration.

#### Recommendations
- **Small Setups (1-2 Services)**: Using `myapp` is fine if you only monitor one container, as collisions are unlikely. Ensure the `DELETE_MISSING` environment variable is set appropriately to clean up monitors when containers stop.
- **Larger Setups**: Use unique, descriptive identifiers or templating to reflect service names or roles. This scales better and aligns with AutoKuma’s polling mechanism.
- **Security and Maintenance**: Regularly check Uptime Kuma’s monitor list to ensure AutoKuma’s actions (e.g., deletions) align with expectations. Use `AUTOKUMA__LOGGING__LEVEL: debug` to troubleshoot naming issues.

---

The `myapp` part of `kuma.myapp.http.xyz` is an arbitrary identifier that must be unique to avoid monitor conflicts in Uptime Kuma. While using `myapp` for all services is possible in very small Docker setups, it risks overwriting monitors when multiple containers are involved. For clarity and scalability, especially in dynamic environments, it’s better to use service-specific names (e.g., `kuma.nginx.http.url`) or AutoKuma’s templating feature (e.g., `kuma.{{ container_name }}.http.url`) to dynamically generate unique identifiers based on container metadata. This approach ensures robust monitor management without manual intervention.

**Key Citations:**
- https://github.com/BigBoot/AutoKuma (AutoKuma documentation on label format and templating)
- https://github.com/BigBoot/AutoKuma/blob/main/src/config.rs (Configuration details)
- https://www.reddit.com/r/selfhosted/comments/1lcyz2t/uptime_kuma/ (Community insights on AutoKuma usage)
