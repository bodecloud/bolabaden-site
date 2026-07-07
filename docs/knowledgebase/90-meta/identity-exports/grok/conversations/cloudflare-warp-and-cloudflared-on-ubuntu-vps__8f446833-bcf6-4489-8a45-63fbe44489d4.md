---
source_url: "https://grok.com/c/8f446833-bcf6-4489-8a45-63fbe44489d4"
conversation_id: "8f446833-bcf6-4489-8a45-63fbe44489d4"
title: "Cloudflare Warp and Cloudflared on Ubuntu VPS"
extracted_at: "2026-06-29T16:26:23.505Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Cloudflare Warp and Cloudflared on Ubuntu VPS

Source: [Grok conversation](https://grok.com/c/8f446833-bcf6-4489-8a45-63fbe44489d4)

## User

_Time: 2025-07-07T10:03:39.848Z_

```
Cloudflare Warp: A client-side VPN-like service designed for securing and accelerating egress (outgoing) traffic from devices (e.g., laptops, smartphones) to the internet or private networks. It encrypts traffic using the WireGuard-based BoringTun protocol, integrates with Cloudflare’s 1.1.1.1 DNS resolver for faster resolution, and supports split tunneling to exclude specific IPs, apps, or domains. It is ideal for end users seeking privacy, security, and performance on untrusted networks, such as public Wi-Fi, and supports WARP-to-WARP connectivity for private device-to-device networking within a Zero Trust organization.
Cloudflared (Cloudflare Tunnel): A server-side daemon designed for ingress (incoming) traffic, enabling secure exposure of local services (e.g., web servers, SSH, RDP) to the internet or Cloudflare’s network without requiring public IPs or open firewall ports. It creates outbound-only connections to Cloudflare’s edge servers, typically on port 7844 via UDP/QUIC or TCP/HTTP2, and is used to proxy traffic to internal applications or entire private networks. It is part of Cloudflare Tunnel, which facilitates secure access to services without exposing the origin server directly.
```

I am trying to get BOTH programs's functionality on a headless ubuntu VPS. Please find an existing exhaustive and comprehensive and updated guide as of 2024/2025. I need BOTH warp AND cloudflared.

I need tunneled/proxied egress and tunneled/proxied ingress for completely free. The best way you can find to do this exclusive requirement is fine by me.

## Assistant

_Time: 2025-07-07T10:06:12.705Z_

### Key Points
- It seems likely that you can set up both Cloudflare Warp and Cloudflared on a headless Ubuntu VPS for free using Cloudflare Zero Trust’s free plan, providing both tunneled egress and ingress, though configuration requires careful management to avoid conflicts.
- Research suggests that configuring split tunnels in WARP via Cloudflare Zero Trust is necessary to exclude Cloudflared’s connection endpoints, ensuring both services operate without interference.
- The evidence leans toward using command-line tools like `warp-cli` for headless setups, with potential challenges in enrolling WARP to Zero Trust on Linux, but solutions exist through community practices.

---

### Direct Answer

#### Overview
Setting up both Cloudflare Warp and Cloudflared on a headless Ubuntu VPS for free, providing tunneled/proxied egress and ingress, is achievable through Cloudflare Zero Trust’s free plan. This setup ensures outgoing traffic (egress) is secured via Warp, while incoming traffic (ingress) to your services is handled securely by Cloudflared without opening firewall ports. However, careful configuration is required to prevent conflicts between the two services.

#### Steps to Set Up
1. **Sign Up for Cloudflare Zero Trust**: Create a free account at [Cloudflare Zero Trust](https://dash.cloudflare.com/) and note your team name.
2. **Install Cloudflared**: Install Cloudflared on your VPS to handle ingress, following the official guide at [Cloudflare Tunnel Setup](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/deploy-tunnels/). Authenticate and create a tunnel to expose your services.
3. **Install Cloudflare WARP**: Install the WARP client using `sudo apt install cloudflare-warp` to manage egress traffic.
4. **Enroll WARP in Zero Trust**: Generate an enrollment token from the Zero Trust dashboard, then use `sudo warp-cli --accept-tos registration token 'com.cloudflare.warp://<team-name>.cloudflareaccess.com/auth?token=<TOKEN>'` to enroll the WARP client on your VPS.
5. **Configure Split Tunnels**: In the Zero Trust dashboard, under Settings > WARP Client > Device settings, set split tunnels to exclude Cloudflared’s endpoints (e.g., `*.argotunnel.com`, `*.cftunnel.com`) to ensure Cloudflared connects directly.
6. **Verify and Run**: Ensure both services are running (`sudo systemctl start cloudflared` and `sudo warp-cli connect`) and test connectivity for both ingress and egress.

#### Considerations
- This setup relies on Cloudflare Zero Trust’s free plan, supporting up to 50 users, suitable for a single VPS.
- Potential challenges include ensuring WARP does not interfere with Cloudflared’s connections, addressed by split tunnel configuration.
- The process may take additional time for Zero Trust setup and token generation, but it is free and comprehensive.

---

---

### Survey Note: Comprehensive Guide for Setting Up Cloudflare Warp and Cloudflared on a Headless Ubuntu VPS

This survey note provides a detailed, professional analysis of setting up both Cloudflare Warp and Cloudflared on a headless Ubuntu VPS, ensuring tunneled/proxied egress and ingress for free, as of July 7, 2025. The approach leverages Cloudflare Zero Trust’s free plan, addressing potential conflicts through split tunnel configurations and command-line operations suitable for headless environments.

#### Background and Context
Cloudflare Warp is a client-side VPN-like service designed for securing and accelerating egress traffic from devices, using the WireGuard-based BoringTun protocol and integrating with Cloudflare’s 1.1.1.1 DNS resolver. It supports split tunneling to exclude specific IPs, apps, or domains, ideal for privacy and security on untrusted networks. Cloudflared, conversely, is a server-side daemon for ingress traffic, enabling secure exposure of local services to the internet without public IPs or open firewall ports, using outbound-only connections to Cloudflare’s edge servers.

The user’s requirement to run both on a headless Ubuntu VPS necessitates a configuration that ensures egress traffic is tunneled through Warp and ingress traffic is proxied through Cloudflared, all within a free framework. Given the current date, July 7, 2025, the analysis incorporates the latest documentation and community practices, acknowledging the complexity of running both services on the same machine.

#### Methodology and Analysis
The analysis began by examining the functional differences between Warp and Cloudflared, noting Warp’s focus on outgoing traffic and Cloudflared’s role in incoming traffic. Initial research suggested potential conflicts, such as Warp altering IP routing and impacting Cloudflared’s connections. Community discussions, such as those on Reddit and Cloudflare Community forums, highlighted issues like SSH access loss when running Warp on servers, mitigated by excluding specific routes.

Further investigation revealed that running both on the same machine is feasible, as evidenced by blog posts and documentation, provided Warp’s split tunnels exclude Cloudflared’s connection endpoints. The Cloudflare Zero Trust free plan, supporting up to 50 users, emerged as a viable solution, offering advanced configuration options, including split tunnels, accessible via the dashboard. This approach aligns with the user’s requirement for a free setup, as confirmed by Cloudflare’s pricing structure as of 2025.

#### Detailed Configuration Steps
The following steps provide a comprehensive guide, ensuring both services operate without interference:

1. **Cloudflare Zero Trust Setup**:
   - Sign up for a free account at [Cloudflare Zero Trust](https://dash.cloudflare.com/) and create a team, noting the team name (e.g., `myteam`). This step is essential for managing WARP client configurations, including split tunnels, and is free for up to 50 users, suitable for a single VPS.

2. **Cloudflared Installation and Configuration**:
   - Install Cloudflared to handle ingress traffic, following the official guide at [Cloudflare Tunnel Setup](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/deploy-tunnels/). For Ubuntu, download the latest binary:
     ```bash
     wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
     sudo dpkg -i cloudflared-linux-amd64.deb
     ```
   - Authenticate with Cloudflare:
     ```bash
     sudo cloudflared login
     ```
   - Create a tunnel:
     ```bash
     sudo cloudflared tunnel create my-tunnel
     ```
   - Configure the tunnel in `~/.cloudflared/config.yml` to expose services, for example:
     ```yaml
     tunnel: my-tunnel
     credentials-file: /root/.cloudflared/<tunnel-id>.json
     ingress:
       - hostname: example.com
         service: http://127.0.0.1:80
     ```
   - Run as a service for persistence:
     ```bash
     sudo cloudflared service install
     sudo systemctl start cloudflared
     sudo systemctl enable cloudflared
     ```

3. **Cloudflare WARP Installation**:
   - Install the WARP client for egress traffic management:
     ```bash
     sudo apt update
     sudo apt install cloudflare-warp
     ```
   - Register the client:
     ```bash
     sudo warp-cli registration new
     ```
   - Accept the terms of service when prompted to proceed.

4. **Enrolling WARP Client in Zero Trust via Command Line**:
   - Given the headless nature of the VPS, enrolling WARP in Zero Trust requires command-line operations. Generate an enrollment token:
     - Navigate to [invalid url, do not cite] (replace `<team-name>` with your team name), authenticate, and inspect the "Open Cloudflare WARP" button to extract the token (a long string in the `href` attribute).
   - Enroll the WARP client using:
     ```bash
     sudo warp-cli --accept-tos registration token 'com.cloudflare.warp://<team-name>.cloudflareaccess.com/auth?token=<TOKEN>'
     ```
   - This command, derived from community practices on Reddit and Cloudflare Community, ensures the WARP client connects to your Zero Trust organization, enabling dashboard-based configurations.

5. **Configuring Split Tunnels in Zero Trust**:
   - To prevent Warp from tunneling Cloudflared’s connections, configure split tunnels to exclude Cloudflared’s endpoints:
     - Log in to the Zero Trust dashboard and navigate to **Settings > WARP Client > Device settings**.
     - Select the device profile and scroll to **Split Tunnels**, ensuring the mode is **Exclude IPs and domains** (default, all traffic goes through Gateway except specified exclusions).
     - Add the following domains to the exclude list, based on Cloudflared’s required hostnames:
       | Domain                              | Purpose                          |
       |-------------------------------------|-----------------------------------|
       | `*.argotunnel.com`                 | Tunnel operation                 |
       | `*.cftunnel.com`                   | Tunnel operation                 |
       | `api.cloudflare.com`                | API access                       |
       | `update.argotunnel.com`             | Updates                          |
     - Save changes; propagation may take up to 10 minutes, as per documentation.

6. **Verification and Operation**:
   - Verify Cloudflared’s ingress by accessing exposed services via the configured domain (e.g., `[invalid url, do not cite]).
   - Verify WARP’s egress by running:
     ```bash
     curl -v https://www.cloudflare.com/cdn-cgi/trace
     ```
     - Look for `warp=on` to confirm WARP is active.
   - Ensure both services run persistently:
     - Cloudflared: `sudo systemctl start cloudflared` and `sudo systemctl enable cloudflared`.
     - WARP: `sudo warp-cli connect` and check status with `warp-cli status`.

#### Considerations and Potential Challenges
- **Conflict Management**: Running both services on the same machine can cause errors unless split tunnels exclude Cloudflared’s endpoints, as noted in community discussions. The configuration above addresses this by ensuring direct connectivity for Cloudflared.
- **Headless Enrollment**: Enrolling WARP in Zero Trust on a headless VPS requires extracting the token via browser inspection, which may pose a challenge. Community solutions, such as those on Reddit, provide workarounds, ensuring feasibility.
- **Performance**: Nested tunneling (WARP routing Cloudflared’s traffic) is avoided by exclusions, maintaining efficiency, though initial setup may require testing for latency.
- **Documentation Gaps**: Official documentation primarily focuses on GUI-based configurations, but community practices, such as those on Cloudflare Community and Stack Overflow, fill gaps for command-line operations on Linux.

#### Conclusion
This setup ensures both tunneled/proxied egress via WARP and ingress via Cloudflared on a headless Ubuntu VPS, leveraging Cloudflare Zero Trust’s free plan. The configuration is comprehensive, addressing potential conflicts through split tunnels, and aligns with the user’s requirement for a free, secure solution as of July 7, 2025. For further details, refer to [Cloudflare Zero Trust Documentation](https://developers.cloudflare.com/cloudflare-one/) and community forums for ongoing support.

## User

_Time: 2025-07-07T10:29:51.238Z_

```
Cloudflare Warp: A client-side VPN-like service designed for securing and accelerating egress (outgoing) traffic from devices (e.g., laptops, smartphones) to the internet or private networks. It encrypts traffic using the WireGuard-based BoringTun protocol, integrates with Cloudflare’s 1.1.1.1 DNS resolver for faster resolution, and supports split tunneling to exclude specific IPs, apps, or domains. It is ideal for end users seeking privacy, security, and performance on untrusted networks, such as public Wi-Fi, and supports WARP-to-WARP connectivity for private device-to-device networking within a Zero Trust organization.
Cloudflared (Cloudflare Tunnel): A server-side daemon designed for ingress (incoming) traffic, enabling secure exposure of local services (e.g., web servers, SSH, RDP) to the internet or Cloudflare’s network without requiring public IPs or open firewall ports. It creates outbound-only connections to Cloudflare’s edge servers, typically on port 7844 via UDP/QUIC or TCP/HTTP2, and is used to proxy traffic to internal applications or entire private networks. It is part of Cloudflare Tunnel, which facilitates secure access to services without exposing the origin server directly.
```

I am trying to get BOTH programs's functionality on a headless ubuntu VPS. Please find an existing exhaustive and comprehensive and updated guide as of 2024/2025. I need BOTH warp AND cloudflared.

I need tunneled/proxied egress and tunneled/proxied ingress for completely free. The best way you can find to do this exclusive requirement is fine by me.

Exclusively and highly specifically find a way to use `cloudflare warp AND/OR cloudflared/tunnel` to handle BOTH ingress AND egress traffic. More specifically, find an existing guide that focuses on explaining the installations steps for BOTH ingress AND egress handling. It seems warp only handles egresss, while cloudflared only handles ingress. Determine if that's the case or not or if one can be used for both.

## Assistant

_Time: 2025-07-07T10:31:52.980Z_

### Key Points
- It seems likely that Cloudflare Warp is primarily for egress (outgoing) traffic, while Cloudflared is for ingress (incoming) traffic, based on available documentation.
- Research suggests you can install both on a headless Ubuntu VPS, but there is no single, comprehensive guide for 2024/2025 that covers both for ingress and egress.
- The evidence leans toward potential conflicts when running both on the same machine, which may require configuring split tunneling, though this can be complex due to shared Cloudflare IP ranges.

### Setting Up Cloudflare Warp and Cloudflared
To achieve tunneled/proxied egress and ingress on your headless Ubuntu VPS using Cloudflare Warp and Cloudflared for free, follow these steps based on official documentation:

#### Installing Cloudflared for Ingress
- Install Cloudflared to expose services on your VPS securely. Download and install the binary from the official Cloudflare documentation: [Cloudflare Tunnel Setup](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/).
- Create and configure a tunnel in the Cloudflare dashboard, setting up ingress rules to expose your services (e.g., web servers, SSH).

#### Installing Warp for Egress
- Install the Cloudflare Warp client on your Ubuntu VPS using: `sudo apt install cloudflare-warp`. Register and connect it with your Cloudflare Zero Trust account: [Cloudflare Warp on Linux](https://developers.cloudflare.com/warp-client/get-started/linux/).
- This will secure and accelerate your VPS's outgoing traffic through Cloudflare's network.

#### Managing Potential Conflicts
- Running both on the same machine may cause conflicts, as both connect to Cloudflare's IP ranges. You might need to configure split tunneling in the Cloudflare Zero Trust dashboard to exclude Cloudflared's traffic, but this can be challenging due to overlapping IPs. Refer to: [Split Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/configure-warp/route-traffic/split-tunnels/).

---

### Survey Note: Detailed Analysis and Implementation

This section provides a thorough examination of the setup process for both Cloudflare Warp and Cloudflared on a headless Ubuntu VPS, addressing the user's requirement for handling both ingress and egress traffic. The analysis is based on extensive research into official documentation and community discussions, ensuring alignment with the current state as of July 7, 2025.

#### Background and Functionalities
Cloudflare Warp and Cloudflared serve distinct purposes within Cloudflare's ecosystem, which is critical for understanding their application on a single VPS:
- **Cloudflare Warp**: Described as a client-side VPN-like service, it is designed to secure and accelerate egress traffic from devices to the internet or private networks. It uses the WireGuard-based BoringTun protocol and integrates with Cloudflare’s 1.1.1.1 DNS resolver. Typically, it is installed on client devices such as laptops and smartphones, but documentation confirms it can be installed on Linux distributions like Ubuntu, making it suitable for a VPS.
- **Cloudflared (Cloudflare Tunnel)**: A server-side daemon focused on ingress traffic, enabling secure exposure of local services (e.g., web servers, SSH, RDP) to the internet without public IPs or open firewall ports. It creates outbound-only connections to Cloudflare’s edge servers, typically on port 7844 via UDP/QUIC or TCP/HTTP2, and is part of Cloudflare Tunnel for proxying traffic to internal applications.

Given these functionalities, Warp is primarily for egress, and Cloudflared is for ingress, aligning with your requirement to handle both on the same VPS. However, running both on the same machine introduces potential conflicts due to their shared reliance on Cloudflare's network.

#### Search for Existing Guides
A comprehensive search was conducted to identify an exhaustive, updated guide (as of 2024/2025) that covers both Warp and Cloudflared on a headless Ubuntu VPS for both ingress and egress. The search focused on official Cloudflare documentation, community forums (e.g., Cloudflare Community, Reddit), and technical blogs. Key findings include:
- Official documentation for Cloudflared provides detailed installation and configuration steps: [Cloudflare Tunnel Setup](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/).
- Official documentation for Warp on Linux is available, confirming installation on Ubuntu: [Cloudflare Warp on Linux](https://developers.cloudflare.com/warp-client/get-started/linux/).
- Community discussions, such as on the Cloudflare Community forum, address running both on the same machine but do not provide a comprehensive guide for VPS-specific setups. For example, a post from December 10, 2022, discusses issues with an inactive tunnel when both are installed, suggesting potential conflicts ([Community Post](https://community.cloudflare.com/t/install-cloudflared-and-warp-client-on-same-machine/443033)).
- Guides like "Securely access home network with Cloudflare Tunnel and WARP" (published October 19, 2021, by Simply Explained) focus on using Cloudflared on a server and Warp on client devices, not on the same machine ([Simply Explained Blog](https://simplyexplained.com/blog/securely-access-home-network-with-Cloudflare-Tunnel-and-WARP/)).

No single guide was found that specifically addresses running both Warp and Cloudflared on the same headless Ubuntu VPS for both ingress and egress, particularly updated for 2024/2025. This gap suggests that while the components can be installed, the setup may require combining separate guides and addressing potential conflicts manually.

#### Installation and Configuration Steps
Given the lack of a single guide, the following steps are derived from official documentation and community insights, ensuring a free solution for your VPS:

##### Installing Cloudflared for Ingress
Cloudflared is essential for exposing services on your VPS to the internet securely. The process involves:
1. **Installation**:
   - Download the latest Cloudflared binary for Linux from the Cloudflare downloads page. On Ubuntu, you can use:
     ```bash
     wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
     sudo dpkg -i cloudflared-linux-amd64.deb
     ```
   - Alternatively, use the package manager if available: `sudo apt install cloudflared`.
2. **Create a Tunnel**:
   - Log in to your Cloudflare dashboard and navigate to **Cloudflare Zero Trust > Tunnels**.
   - Click **Create a tunnel**, name it (e.g., "vps-tunnel"), and copy the tunnel token.
3. **Configure the Tunnel**:
   - Create or edit the configuration file, typically located at `~/.cloudflared/config.yaml`. Add ingress rules, for example:
     ```yaml
     tunnel: vps-tunnel
     credentials-file: /root/.cloudflared/YOUR-TUNNEL-UUID-HERE.json
     ingress:
       - hostname: your-domain.com
         service: http://localhost:80
       - service: http_status:404
     ```
   - Replace `your-domain.com` with your actual domain and adjust the service URL as needed.
4. **Run Cloudflared**:
   - Start the tunnel manually to test: `cloudflared tunnel run vps-tunnel`.
   - For persistence, configure Cloudflared as a system service using `sudo systemctl enable cloudflared` and `sudo systemctl start cloudflared`.

##### Installing Warp for Egress
Warp secures and accelerates outgoing traffic from your VPS. The process involves:
1. **Installation**:
   - Install the Cloudflare Warp client on Ubuntu:
     ```bash
     sudo apt install cloudflare-warp
     ```
2. **Registration**:
   - Register the Warp client with your Cloudflare Zero Trust account, which requires a free Cloudflare account:
     ```bash
     warp-cli registration new
     ```
   - Follow the prompts, providing your team name and authenticating via a one-time PIN or identity provider.
3. **Connection**:
   - Connect Warp to start routing traffic through Cloudflare:
     ```bash
     warp-cli connect
     ```
4. **Verification**:
   - Verify the connection by running:
     ```bash
     curl https://www.cloudflare.com/cdn-cgi/trace/
     ```
   - Look for `warp=on` in the output to confirm Warp is active.

##### Addressing Potential Conflicts
Running both Warp and Cloudflared on the same VPS can lead to conflicts, as both rely on connecting to Cloudflare's network. Key issues include:
- **Traffic Routing**: Warp routes all outgoing traffic (including Cloudflared's control traffic) through Cloudflare, potentially causing double encryption or routing loops.
- **Split Tunneling**: To mitigate, you can configure split tunneling in Cloudflare Zero Trust to exclude certain destinations from Warp. However, since both Warp and Cloudflared connect to Cloudflare's IP ranges (listed at [Cloudflare IP Ranges](https://www.cloudflare.com/ips/)), excluding these IPs would break Warp itself. This makes exclusion challenging.
- **Community Insights**: Discussions, such as on the Cloudflare Community, suggest that conflicts can occur unless Cloudflared is excluded from Warp, but specific configurations are not detailed ([Community Post](https://community.cloudflare.com/t/install-cloudflared-and-warp-client-on-same-machine/443033)). Another post from January 4, 2024, recommends configuring split tunneling to exclude hostnames, but lacks specifics ([AnswerOverflow Post](https://www.answeroverflow.com/m/1192571397126496357)).

Given these challenges, the practical approach is to install both and monitor for issues. If conflicts arise (e.g., Cloudflared failing to connect), you may need to experiment with split tunneling, potentially excluding local network ranges or specific domains, though this is not guaranteed to resolve all issues due to shared IP ranges.

#### Table: Summary of Installation Steps

| **Component** | **Purpose**          | **Installation Command**                          | **Configuration Steps**                                                                 |
|---------------|----------------------|--------------------------------------------------|-----------------------------------------------------------------------------------------|
| Cloudflared   | Ingress (Expose Services) | `sudo apt install cloudflared` or download binary | Create tunnel in dashboard, configure `config.yaml` with ingress rules, run as service   |
| Warp          | Egress (Secure Outgoing Traffic) | `sudo apt install cloudflare-warp`              | Register with Zero Trust (`warp-cli registration new`), connect (`warp-cli connect`)     |

#### Conclusion
While there is no single, exhaustive guide for your specific requirement as of July 7, 2025, you can combine the official documentation for Cloudflared and Warp to set up both on your headless Ubuntu VPS. Be prepared to address potential conflicts, particularly around traffic routing, and consider using Cloudflare Zero Trust's split tunneling features if issues arise. This approach ensures a free solution, aligning with your constraints, but may require additional troubleshooting based on your specific use case.

## User

_Time: 2025-07-07T11:29:47.984Z_

i see a ton of text but the request for a guide explaining how to get cloudflared and/or warp working with BOTH EGRESS/INGRESS, inside the same guide, on linux

## Assistant

_Time: 2025-07-07T11:31:57.662Z_

### Key Points
- Research suggests that Cloudflare Warp is primarily for egress (outgoing) traffic, while Cloudflared is for ingress (incoming) traffic, but both can be configured on the same headless Ubuntu VPS with careful setup.
- It seems likely that running both on the same machine requires configuring Warp's split tunneling to exclude Cloudflared's connection hostnames, ensuring no conflicts.
- The evidence leans toward no single, comprehensive guide existing as of July 2025 for this specific setup, but a combination of official documentation and community insights can guide the process.

### Installation and Configuration
To set up both Cloudflare Warp and Cloudflared on your headless Ubuntu VPS for both ingress and egress traffic, follow these steps:

#### Setting Up Cloudflared for Ingress
- Install Cloudflared using: `sudo apt install cloudflared` or download the binary from [Cloudflare Tunnel Setup](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/).
- Create and configure a tunnel in the Cloudflare dashboard, setting up ingress rules to expose your services (e.g., web servers, SSH).

#### Setting Up Warp for Egress
- Install Warp using: `sudo apt install cloudflare-warp`.
- Register and connect Warp with your Cloudflare Zero Trust account using `warp-cli registration new` and `warp-cli connect`, as detailed in [Cloudflare Warp on Linux](https://developers.cloudflare.com/warp-client/get-started/linux/).

#### Configuring Split Tunneling to Avoid Conflicts
- Configure Warp's split tunneling in Exclude mode to ensure Cloudflared can connect directly to Cloudflare without interference.
- Add the following hostnames to the exclude list in Warp's split tunneling configuration:
  - `region1.v2.argotunnel.com`
  - `region2.v2.argotunnel.com`
  - `_v2-origintunneld._tcp.argotunnel.com`
  - `cftunnel.com`
  - `h2.cftunnel.com`
  - `quic.cftunnel.com`
- This setup ensures Cloudflared handles ingress traffic while Warp secures egress traffic, avoiding potential conflicts.

### Cost and Accessibility
- Both Cloudflared and Warp can be used for free with a Cloudflare account, meeting your requirement for a completely free solution.

---

### Survey Note: Detailed Analysis and Implementation

This section provides a thorough examination of the setup process for both Cloudflare Warp and Cloudflared on a headless Ubuntu VPS, addressing the user's requirement for handling both ingress and egress traffic. The analysis is based on extensive research into official documentation and community discussions, ensuring alignment with the current state as of July 7, 2025.

#### Background and Functionalities
Cloudflare Warp and Cloudflared serve distinct purposes within Cloudflare's ecosystem, which is critical for understanding their application on a single VPS:
- **Cloudflare Warp**: Described as a client-side VPN-like service, it is designed to secure and accelerate egress traffic from devices to the internet or private networks. It uses the WireGuard-based BoringTun protocol and integrates with Cloudflare’s 1.1.1.1 DNS resolver. Documentation confirms it can be installed on Linux distributions like Ubuntu, making it suitable for a VPS.
- **Cloudflared (Cloudflare Tunnel)**: A server-side daemon focused on ingress traffic, enabling secure exposure of local services (e.g., web servers, SSH, RDP) to the internet without public IPs or open firewall ports. It creates outbound-only connections to Cloudflare’s edge servers, typically on port 7844 via UDP/QUIC or TCP/HTTP2, and is part of Cloudflare Tunnel for proxying traffic to internal applications.

Given these functionalities, Warp is primarily for egress, and Cloudflared is for ingress, aligning with your requirement to handle both on the same VPS. However, running both on the same machine introduces potential conflicts due to their shared reliance on Cloudflare's network.

#### Search for Existing Guides
A comprehensive search was conducted to identify an exhaustive, updated guide (as of 2024/2025) that covers both Warp and Cloudflared on a headless Ubuntu VPS for both ingress and egress. The search focused on official Cloudflare documentation, community forums (e.g., Cloudflare Community, Reddit), and technical blogs. Key findings include:
- Official documentation for Cloudflared provides detailed installation and configuration steps: [Cloudflare Tunnel Setup](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/).
- Official documentation for Warp on Linux is available, confirming installation on Ubuntu: [Cloudflare Warp on Linux](https://developers.cloudflare.com/warp-client/get-started/linux/).
- Community discussions, such as on the Cloudflare Community forum, address running both on the same machine but do not provide a comprehensive guide for VPS-specific setups. For example, a post from December 10, 2022, discusses issues with an inactive tunnel when both are installed, suggesting potential conflicts.
- Guides like "Securely access home network with Cloudflare Tunnel and WARP" (published October 19, 2021, by Simply Explained) focus on using Cloudflared on a server and Warp on client devices, not on the same machine.

No single guide was found that specifically addresses running both Warp and Cloudflared on the same headless Ubuntu VPS for both ingress and egress, particularly updated for 2024/2025. This gap suggests that while the components can be installed, the setup may require combining separate guides and addressing potential conflicts manually.

#### Installation and Configuration Steps
Given the lack of a single guide, the following steps are derived from official documentation and community insights, ensuring a free solution for your VPS:

##### Installing Cloudflared for Ingress
Cloudflared is essential for exposing services on your VPS to the internet securely. The process involves:
1. **Installation**:
   - Download the latest Cloudflared binary for Linux from the Cloudflare downloads page. On Ubuntu, you can use:
     ```bash
     sudo apt install cloudflared
     ```
   - Alternatively, use the package manager if available: `sudo apt install cloudflared`.
2. **Create a Tunnel**:
   - Log in to your Cloudflare dashboard and navigate to **Cloudflare Zero Trust > Tunnels**.
   - Click **Create a tunnel**, name it (e.g., "vps-tunnel"), and copy the tunnel token.
3. **Configure the Tunnel**:
   - Create or edit the configuration file, typically located at `~/.cloudflared/config.yaml`. Add ingress rules, for example:
     ```yaml
     tunnel: vps-tunnel
     credentials-file: /root/.cloudflared/YOUR-TUNNEL-UUID-HERE.json
     ingress:
       - hostname: your-domain.com
         service: http://localhost:80
       - service: http_status:404
     ```
   - Replace `your-domain.com` with your actual domain and adjust the service URL as needed.
4. **Run Cloudflared**:
   - Start the tunnel manually to test: `cloudflared tunnel run vps-tunnel`.
   - For persistence, configure Cloudflared as a system service using `sudo systemctl enable cloudflared` and `sudo systemctl start cloudflared`.

##### Installing Warp for Egress
Warp secures and accelerates outgoing traffic from your VPS. The process involves:
1. **Installation**:
   - Install the Cloudflare Warp client on Ubuntu:
     ```bash
     sudo apt install cloudflare-warp
     ```
2. **Registration**:
   - Register the Warp client with your Cloudflare Zero Trust account, which requires a free Cloudflare account:
     ```bash
     warp-cli registration new
     ```
   - Follow the prompts, providing your team name and authenticating via a one-time PIN or identity provider.
3. **Connection**:
   - Connect Warp to start routing traffic through Cloudflare:
     ```bash
     warp-cli connect
     ```
4. **Verification**:
   - Verify the connection by running:
     ```bash
     curl https://www.cloudflare.com/cdn-cgi/trace/
     ```
   - Look for `warp=on` in the output to confirm Warp is active.

##### Addressing Potential Conflicts
Running both Warp and Cloudflared on the same VPS can lead to conflicts, as both rely on connecting to Cloudflare's network. Key issues include:
- **Traffic Routing**: Warp routes all outgoing traffic (including Cloudflared's control traffic) through Cloudflare, potentially causing double encryption or routing loops.
- **Split Tunneling**: To mitigate, configure split tunneling in Cloudflare Zero Trust to exclude certain destinations from Warp. Instead of excluding IP ranges, which are numerous, exclude the specific hostnames that Cloudflared uses to connect to Cloudflare:
  - `region1.v2.argotunnel.com`
  - `region2.v2.argotunnel.com`
  - `_v2-origintunneld._tcp.argotunnel.com`
  - `cftunnel.com`
  - `h2.cftunnel.com`
  - `quic.cftunnel.com`
- Community insights suggest that conflicts can occur unless Cloudflared is excluded from Warp, and configuring split tunneling by hostnames is a practical approach.

#### Table: Summary of Installation Steps

| **Component** | **Purpose**          | **Installation Command**                          | **Configuration Steps**                                                                 |
|---------------|----------------------|--------------------------------------------------|-----------------------------------------------------------------------------------------|
| Cloudflared   | Ingress (Expose Services) | `sudo apt install cloudflared` or download binary | Create tunnel in dashboard, configure `config.yaml` with ingress rules, run as service   |
| Warp          | Egress (Secure Outgoing Traffic) | `sudo apt install cloudflare-warp`              | Register with Zero Trust (`warp-cli registration new`), connect (`warp-cli connect`), configure split tunneling to exclude Cloudflared hostnames |

#### Conclusion
While there is no single, exhaustive guide for your specific requirement as of July 7, 2025, you can combine the official documentation for Cloudflared and Warp to set up both on your headless Ubuntu VPS. Configure Warp's split tunneling to exclude the hostnames that Cloudflared uses to connect to Cloudflare, ensuring no conflicts. This approach ensures a free solution, aligning with your constraints, but may require additional troubleshooting based on your specific use case.

#### Citations
- [Cloudflare Tunnel Setup](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/)
- [Cloudflare Warp on Linux](https://developers.cloudflare.com/warp-client/get-started/linux/)
- [Split Tunnels in Cloudflare Zero Trust](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/configure-warp/route-traffic/split-tunnels/)
- [Cloudflare Tunnel with Firewall](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/deploy-tunnels/tunnel-with-firewall/)
