---
source_url: "https://grok.com/c/c8b5d994-161f-45e2-a827-79639f61d89a"
conversation_id: "c8b5d994-161f-45e2-a827-79639f61d89a"
title: "Coolify URL: Sentinel Configuration Explained"
extracted_at: "2026-06-29T16:19:42.699Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Coolify URL: Sentinel Configuration Explained

Source: [Grok conversation](https://grok.com/c/c8b5d994-161f-45e2-a827-79639f61d89a)

## User

_Time: 2025-09-26T21:55:41.513Z_

in coolify what does the `Coolify URL` do in the server-specific configuration area? Says the following:

```
URL to your Coolify instance. If it is empty that means you do not have a FQDN set for your Coolify instance.
```

It's not intuitive what I'm supposed to set this to. AFAIK Coolify can only run on a SINGULAR server/machine. The other machines do not run coolify they only run the sentinel and various docker containers and coolify automates them through `ssh`. Given that wtf do I set COOLIFY_URL to???
I access coolify at `https://coolify.bolabaden.org`. HOWEVER it does NOT make sense to put that url in EVERY SINGLE **SERVER SPECIFIC** coolify_url since it's implied coolify_url is for a specific server coolify manages? And besides it can't be that, I configure coolify's URL globally in a different settings window.
 
So what the fuck doe sthe SERVER-SPECIFIC (under Sentinel) `COOLIFY URL` do exactly and how do I set it appropriately???

## Assistant

_Time: 2025-09-26T21:58:30.264Z_

### Key Points
- The server-specific "Coolify URL" (likely referring to the "Sentinel Custom URL" field) in the Sentinel configuration area specifies the URL of your main Coolify instance that the Sentinel agent on that particular server uses to communicate back for metrics collection and API interactions.
- It is required if you want to enable Sentinel on a server, especially for remote servers managed via SSH, to ensure the agent can report data to the central Coolify control plane.
- Research suggests you should set it to the fully qualified domain name (FQDN) URL where you access your Coolify dashboard, such as `https://coolify.bolabaden.org`. This applies even if it's the same value for every server, as the field allows per-server customization for flexibility in complex setups.
- If left empty, Sentinel may not function properly, as Coolify requires a resolvable FQDN (not just an IP) for reliable communication; using an IP alone can prevent enabling Sentinel.
- There appears to be no major controversy around this setting, though some users report validation errors if the URL format is invalid (e.g., missing protocol or improper structure).

### Purpose of the Coolify URL Field
This field ensures that the Sentinel—a lightweight, open-source container running on each managed server—knows where to send server and container metrics, status updates, and other data. Sentinel acts as a "Linux API" for Coolify, enabling features like real-time monitoring of CPU, memory, disk usage, and container health. Without a valid URL, the agent can't connect to the Coolify API, leading to incomplete setup or disabled metrics.

### Setting It Up
- **For the Main Server (where Coolify runs)**: It might auto-detect or remain empty if no custom FQDN is needed, but setting it explicitly to your dashboard URL is recommended for consistency.
- **For Remote Servers**: When adding or configuring a remote server via SSH, enter your Coolify instance's public URL in this field before validating the server or enabling Sentinel. This is part of the server setup process after providing IP, SSH keys, and username.
- **Validation Tips**: The URL must be a valid format (e.g., `https://yourdomain.com`), and Coolify checks for this—errors like "The sentinel custom url field must be a valid URL" occur if it's malformed. Ensure your Coolify instance has a global FQDN set in the main settings (/settings page) first, as Sentinel won't enable without it.
- **Related Global Setting**: In Coolify's instance settings, there's a separate "Instance's Domain" or FQDN field (e.g., `https://coolify.example.com`). This global value might pre-populate or influence the server-specific one, but the per-server field allows overrides.

### Why Server-Specific?
Even though Coolify typically runs on one primary server and manages others via SSH (running Sentinel and Docker on remotes), the field is per-server to support advanced scenarios, such as clustered setups, different proxies, or multiple Coolify instances. It isn't implying a Coolify instance per server; it's just ensuring each Sentinel knows the central hub's location.

---

Coolify is an open-source platform for self-hosting applications, databases, and services, often described as an alternative to Heroku, Netlify, or Vercel. It allows managing deployments across multiple servers from a single control plane instance. The primary Coolify application runs on one machine (the "main" or "control plane" server), while additional servers are connected remotely via SSH. These remote servers do not run the full Coolify stack; instead, Coolify installs Docker Engine and the Sentinel agent on them during setup. Sentinel handles local operations like metrics collection, while Coolify orchestrates deployments and configurations centrally.

#### Understanding Sentinel
Sentinel is an experimental, lightweight Docker container developed by the Coolify team. It serves as a metrics collector and API endpoint for Linux servers, gathering data on server resources (e.g., CPU, RAM, disk) and container performance. This data is sent back to the main Coolify instance for display in the UI, enabling monitoring and automated actions like disk cleanup.

- **Enabling Sentinel**: In the server settings under the "General" tab, you'll find checkboxes to enable Sentinel and metrics collection. Documentation emphasizes that Sentinel requires a resolvable FQDN for the Coolify instance—IP addresses alone won't suffice, as they can lead to connectivity issues. If Sentinel is enabled without a proper FQDN, features like metrics viewing may fail.
- **Setup Process**: When adding a remote server, Coolify validates SSH access and installs Docker if needed. Sentinel is optionally enabled during or after this. The installation script or validation step uses the provided URL to configure the agent's callback endpoint.

| Sentinel Feature | Description | Requirements |
| --- | --- | --- |
| Metrics Collection | Gathers server and container stats (e.g., usage, health) | Enabled in server settings; valid Coolify URL for data transmission |
| API Access | Provides a local Linux API for Coolify commands | Docker Engine 24+ on the server; SSH root access |
| Viewing Metrics | Accessible in Coolify UI after enablement | FQDN set globally; Sentinel running on the server |

#### The Coolify URL (Sentinel Custom URL) Field in Detail
This field appears in the server configuration area, specifically under the Sentinel section when enabling or configuring it for a server. Based on user reports and bug trackers, it's labeled something like "Sentinel Custom URL" in the UI, but its tooltip or description matches what you quoted: "URL to your Coolify instance. If it is empty that means you do not have a FQDN set for your Coolify instance."

- **Functionality**: It defines the endpoint where Sentinel sends data and receives instructions from the Coolify API. For example, Sentinel might POST metrics to `https://coolify.bolabaden.org/api/sentinel/metrics` (hypothetical path). This ensures secure, reliable communication over HTTPS, especially across networks.
- **Why Not Global?**: While Coolify has a global "Instance Domain" setting (in /settings), the server-specific field allows customization. For instance:
  - In a multi-region setup, remote servers might use a proxy URL or region-specific endpoint.
  - It provides fallback if the global FQDN isn't resolvable from a remote server's network (e.g., due to DNS issues).
  - It supports testing or isolated environments without affecting the global config.
- **Common Issues and Fixes**:
  - **Validation Errors**: If the URL lacks "https://" or is malformed, you'll see errors like "The sentinel custom url field must be a valid URL." Fix by ensuring it's a full, absolute URL.
  - **Empty Field Implications**: Indicates no FQDN is configured globally, blocking Sentinel enablement. Set the global FQDN first via Coolify's settings page.
  - **Resolvability**: The URL must be accessible from the server's location. For local setups (e.g., on Unraid), users suggest using a fake domain like "coolify.local" added to /etc/hosts.
- **Environment Variables Relation**: Internally, Coolify uses env vars like COOLIFY_URL and COOLIFY_FQDN in deployed containers (e.g., for previews or services). These are distinct but related—the server-specific field likely influences how these vars are generated for Sentinel.

#### Step-by-Step Guide to Setting the Coolify URL
1. **Set Global FQDN**: Go to Coolify's main settings (/settings). Enter your instance's domain (e.g., `https://coolify.bolabaden.org`). This is required before enabling Sentinel anywhere.
2. **Add or Edit a Server**: In the Servers menu, click "Add" for a new remote server or edit an existing one.
   - Provide basics: Name, IP/Domain, SSH Private Key, Username (root).
   - Proceed to validation.
3. **Configure Sentinel**: In the server details, under "Sentinel" or "General":
   - Enable Sentinel checkboxes.
   - In the "Coolify URL" or "Sentinel Custom URL" field, enter `https://coolify.bolabaden.org` (your dashboard URL).
   - Save and validate. Coolify will install/update Sentinel if needed.
4. **Test**: After setup, check the metrics tab in the server view. If data appears, communication is working.
5. **For Multiple Servers**: Repeat for each, using the same URL unless custom needs arise. Coolify handles SSH automation for deployments.

| Server Type | Recommended Coolify URL Setting | Notes |
| --- | --- | --- |
| Main (Coolify Host) | `https://coolify.bolabaden.org` or leave auto if detected | Often pre-filled from global settings |
| Remote (SSH-Managed) | `https://coolify.bolabaden.org` | Ensures Sentinel reports back correctly; required for metrics |

#### Additional Context from Sources
- **DNS and Proxy Integration**: Related to this, server settings include a "Wildcard Domain" field (e.g., `https://example.com`) for auto-generating resource domains. If unset, Coolify falls back to sslip.io with the server's IP. This is separate but complements URL configs for proxies like Traefik.
- **Remote Server Setup Overview**: Adding remotes involves SSH key setup (generate in Coolify, add public key to remote's authorized_keys). Coolify then installs Docker and Sentinel automatically upon validation.
- **Known Bugs and Discussions**: GitHub issues highlight URL validation strictness and env var mix-ups (e.g., COOLIFY_URL vs. COOLIFY_FQDN), but these are resolved in recent versions (v4.0+). User forums like Reddit note that Sentinel enablement fails without an FQDN, confirming the field's necessity.
- **Advanced Use**: For Cloudflare Tunnels or custom proxies, adjust the URL to match the tunnel endpoint. Documentation recommends primary sources like Coolify's official docs for updates.

This configuration enhances Coolify's multi-server capabilities without requiring full instances on remotes, keeping management centralized while distributing workloads.

#### Key Citations
- [Coolify Docs: Sentinel and Metrics](https://coolify.io/docs/knowledge-base/server/sentinel)<grok:render card_id="92ce92" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">63</argument>
</grok:render>
- [GitHub Issue: Sentinel Custom URL Bug](https://github.com/coollabsio/coolify/issues/4764)<grok:render card_id="e6a390" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">58</argument>
</grok:render>
- [GitHub Discussion: How to Use Sentinel](https://github.com/coollabsio/coolify/discussions/4228)<grok:render card_id="6e3139" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">60</argument>
</grok:render>
- [Coolify Docs: Server Introduction](https://coolify.io/docs/knowledge-base/server/introduction)<grok:render card_id="519da6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render>
- [Reddit: Coolify on Unraid (FQDN Requirement)](https://www.reddit.com/r/unRAID/comments/1k848o7/coolify_on_unraid/)<grok:render card_id="9b314a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
- [DEV.to: Adding New Server to Coolify](https://dev.to/danielbetterdevelopers/add-new-server-to-coolify-instance-15h6)<grok:render card_id="dc4121" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">45</argument>
</grok:render>

## User

_Time: 2025-09-27T04:13:54.520Z_

```

Step-by-Step Guide to Setting the Coolify URL

Set Global FQDN: Go to Coolify's main settings (/settings). Enter your instance's domain (e.g., https://coolify.bolabaden.org). This is required before enabling Sentinel anywhere.
Add or Edit a Server: In the Servers menu, click "Add" for a new remote server or edit an existing one.

Provide basics: Name, IP/Domain, SSH Private Key, Username (root).
Proceed to validation.


Configure Sentinel: In the server details, under "Sentinel" or "General":

Enable Sentinel checkboxes.
In the "Coolify URL" or "Sentinel Custom URL" field, enter https://coolify.bolabaden.org (your dashboard URL).
Save and validate. Coolify will install/update Sentinel if needed.


Test: After setup, check the metrics tab in the server view. If data appears, communication is working.
For Multiple Servers: Repeat for each, using the same URL unless custom needs arise. Coolify handles SSH automation for deployments.
```

I already said this doesn't make sense. coolify.bolabaden.org represents the coolify instance and there's only one. COOLIFY URL is server-specific under 'Sentinel' so it must be something else. Unless you're saying the devs are dumb.

## Assistant

_Time: 2025-09-27T04:14:04.737Z_



## User

_Time: 2025-09-27T04:14:34.980Z_

```

Step-by-Step Guide to Setting the Coolify URL

Set Global FQDN: Go to Coolify's main settings (/settings). Enter your instance's domain (e.g., https://coolify.bolabaden.org). This is required before enabling Sentinel anywhere.
Add or Edit a Server: In the Servers menu, click "Add" for a new remote server or edit an existing one.

Provide basics: Name, IP/Domain, SSH Private Key, Username (root).
Proceed to validation.


Configure Sentinel: In the server details, under "Sentinel" or "General":

Enable Sentinel checkboxes.
In the "Coolify URL" or "Sentinel Custom URL" field, enter https://coolify.bolabaden.org (your dashboard URL).
Save and validate. Coolify will install/update Sentinel if needed.


Test: After setup, check the metrics tab in the server view. If data appears, communication is working.
For Multiple Servers: Repeat for each, using the same URL unless custom needs arise. Coolify handles SSH automation for deployments.
```

I already said this doesn't make sense. coolify.bolabaden.org represents the coolify instance and there's only one. COOLIFY URL is server-specific under 'Sentinel' so it must be something else. Unless you're saying the devs are dumb. It surely must be server-specific. Your solution would have me set `https://coolify.bolabaden.org` for all 8 of my servers lol which doesn't make any sense.

## Assistant

_Time: 2025-09-27T04:16:04.133Z_

The Coolify URL (or Sentinel Custom URL) field in the server-specific Sentinel configuration specifies the endpoint for the Sentinel agent on that server to communicate with your central Coolify instance. It ensures the agent can securely send metrics, status updates, and other data back to the main control plane over HTTPS. While the field is configured per-server for flexibility in advanced or segmented networks, in standard setups with a single Coolify instance, it should indeed be set to the same value across all servers—your main dashboard URL, such as `https://coolify.bolabaden.org`. This is not a design flaw; it's intentional to allow overrides if needed (e.g., using an internal IP or proxy for certain servers), but uniformity is typical and functional.

**Key Points on Usage and Setup**
- **Standard Configuration**: Use your global Coolify FQDN for every server. This enables Sentinel to callback reliably without per-server variation unless your network requires it.
- **Validation Requirements**: The URL must be fully qualified (e.g., include `https://`), resolvable from the server's location, and valid; otherwise, errors like "The sentinel custom url field must be a valid URL" occur during server addition or updates.
- **Impact if Misconfigured**: Empty or invalid values prevent Sentinel enablement, leading to missing metrics (e.g., CPU/RAM usage) in the UI.
- **Relation to Global Settings**: This complements the instance-wide FQDN in /settings but is server-level to support custom communication paths.

**Troubleshooting Common Issues**
- If metrics aren't appearing after setup, verify Sentinel container logs (via Docker) for connection errors and ensure the URL is accessible from the remote server (test with curl or ping).
- For multi-server environments like yours with 8 machines, the shared URL streamlines management since Coolify centralizes control via SSH, with Sentinels acting as local reporters.

**Advanced Considerations**
- In rare cases (e.g., air-gapped or multi-region setups), you might adjust it per-server to an alternative endpoint, but documentation and user reports indicate this is uncommon.
- Related environment variables like COOLIFY_URL and COOLIFY_FQDN are auto-generated for deployed resources (e.g., in previews or services), differing from this Sentinel field but sharing the FQDN logic.

---

Coolify's architecture keeps the core application on one primary server while managing remotes via SSH, installing Docker and Sentinel as needed. The Sentinel Custom URL field, despite being per-server, points to the central instance for consistency in reporting—much like how all remotes SSH back to the same host. User experiences and bug reports confirm setting it uniformly works, with issues mainly around validation rather than value differences.

#### Detailed Server Configuration Flow
1. **Global Prerequisite**: In Coolify's /settings, set the instance domain (e.g., `https://coolify.bolabaden.org`). This FQDN is essential; without it, Sentinel can't enable, as it relies on a resolvable endpoint.
2. **Per-Server Setup**:
   - Navigate to Servers > Add/Edit Server.
   - Enter basics: Name, IP/Domain (for remote), SSH key, root username.
   - Validate connection—Coolify installs Docker if missing.
3. **Sentinel-Specific Steps**:
   - In server details > General/Sentinel tab: Enable Sentinel and metrics.
   - Set "Sentinel Custom URL" to your main Coolify URL (e.g., `https://coolify.bolabaden.org`).
   - Save and re-validate; Coolify deploys/updates the Sentinel container.
4. **Verification**:
   - Check server metrics tab for data flow.
   - If issues: Inspect Sentinel logs (e.g., `docker logs coolify-sentinel`) for API connection attempts.
5. **Scaling to Multiple Servers**:
   - Repeat for each of your 8 servers, using the identical URL.
   - Coolify automates deployments across them without needing unique URLs per Sentinel.

#### Environment Variables Context
Coolify injects vars like COOLIFY_URL (domain without protocol, e.g., `coolify.bolabaden.org`) and COOLIFY_FQDN (with protocol, e.g., `https://coolify.bolabaden.org`) into deployed containers for resource-specific configs. The Sentinel field aligns with this but is for agent-to-control-plane communication, not app runtime.

| Variable/Field | Purpose | Example Value | Scope |
| --- | --- | --- | --- |
| COOLIFY_URL | Domain for resource previews/services (no protocol) | coolify.bolabaden.org | Auto-injected per deployment |
| COOLIFY_FQDN | Full URL for resource access (with protocol) | https://coolify.bolabaden.org | Auto-injected per deployment |
| Sentinel Custom URL | Endpoint for Sentinel metrics reporting | https://coolify.bolabaden.org | Manual, per-server config |

#### Insights from Development and User Reports
- Validation bugs (e.g., requiring strict URL format) have been addressed in updates like v4.0.0-beta.380+, ensuring fields like this don't silently fail.
- Metrics failures often tie to this field; enabling Sentinel without a valid URL results in no data, as seen in user logs.
- No evidence suggests per-server uniqueness is required—changelogs and discussions emphasize corrections for consistent FQDN handling across setups.
- For custom needs (e.g., proxies), adjust as needed, but standard multi-server users report success with uniform settings.

This setup enhances monitoring without decentralizing control, fitting Coolify's design for simplicity in distributed environments.

#### Key Citations
- [Bug]: Sentinel custom url · Issue #4764 · coollabsio/coolify<grok:render card_id="36f9cf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>
- [Bug]: Sentinel custom url · Issue #4764 · coollabsio/coolify<grok:render card_id="89ef9a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>
- Sentinel and Metrics | Coolify Docs<grok:render card_id="b78754" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [Bug]: COOLIFY_FQDN and COOLIFY_URL mixed up · Issue #2443 · coollabsio/coolify<grok:render card_id="a5d8e8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>
- [Bug]: Docker compose deployment has empty COOLIFY_FQDN and COOLIFY_URL · Issue #2470 · coollabsio/coolify<grok:render card_id="d5abcf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render>
- Environment Variables | Coolify Docs<grok:render card_id="e71656" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render>
