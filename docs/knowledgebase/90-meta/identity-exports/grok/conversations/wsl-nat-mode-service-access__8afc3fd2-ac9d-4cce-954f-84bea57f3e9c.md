---
source_url: "https://grok.com/c/8afc3fd2-ac9d-4cce-954f-84bea57f3e9c"
conversation_id: "8afc3fd2-ac9d-4cce-954f-84bea57f3e9c"
title: "WSL NAT Mode Service Access"
extracted_at: "2026-06-29T16:24:50.499Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# WSL NAT Mode Service Access

Source: [Grok conversation](https://grok.com/c/8afc3fd2-ac9d-4cce-954f-84bea57f3e9c)

## User

_Time: 2025-08-23T23:43:36.365Z_

when wsl is running in NAT mode, how to access WSL hosted services (like if i'm hosting ssh in wsl) through the Windows side, and vice versa? exact hostname/ip addresses and/or how to find them

## Assistant

_Time: 2025-08-23T23:46:24.745Z_

### Key Points
- In WSL2's default NAT mode, services like SSH hosted in WSL can typically be accessed from Windows using `localhost` (127.0.0.1) on the same port, provided the service binds to 0.0.0.0 or localhost in WSL and there's no port conflict with Windows services.
- If port conflicts arise (e.g., both Windows and WSL running SSH on port 22), use the WSL instance's IP address for access from Windows, which is dynamically assigned but discoverable via simple commands.
- Accessing Windows-hosted services from WSL requires the Windows host's IP address, as NAT isolates the networks; hostnames like `<windows-hostname>.local` may work if mDNS is enabled, but IPs are more reliable.
- IP addresses can change on restarts, so automate retrieval with scripts if needed; consider mirrored networking mode on Windows 11 22H2+ for simpler localhost-based access in both directions.
- Evidence suggests this setup works well for most users, though some report issues with firewalls or specific configurations—always verify bindings and rules.

### Finding IP Addresses and Hostnames
To locate the necessary addresses:

- **WSL IP (from Windows):** Run `wsl hostname -I` in PowerShell or CMD. Example output: `172.30.98.229`. This is the address for direct access if localhost fails.
- **WSL IP (from inside WSL):** Run `hostname -I` or `ip addr show eth0 | grep inet`.
- **Windows Host IP (from WSL):** Run `ip route show | grep -i default | awk '{print $3}'` or `cat /etc/resolv.conf | grep nameserver | awk '{print $2}'`. Example: `172.30.96.1`.
- **Hostnames:** 
  - For WSL from Windows: No default hostname; use IP or set a custom one in `/etc/wsl.conf` under `[network] hostname = yourhostname`.
  - For Windows from WSL: Use `<windows-hostname>.local` (e.g., if Windows hostname is "MyPC", try `MyPC.local`), assuming mDNS is active; otherwise, stick to IP. The Windows hostname is often auto-added to WSL's `/etc/hosts` if `generateHosts=true` in `wsl.conf`.

These commands work in default NAT mode. IPs are in the 172.x.x.x range due to NAT.

### Accessing WSL-Hosted Services from Windows
For a service like SSH running in WSL (e.g., after `sudo apt install openssh-server` and `sudo service ssh start`):

- **Using localhost (preferred if no conflict):** If SSH listens on port 22 in WSL, connect with `ssh user@localhost` from Windows (requires Windows OpenSSH client). This leverages automatic forwarding when `localhostForwarding=true` (default in `.wslconfig`).
- **Using WSL IP (for conflicts or specificity):** `ssh user@<WSL-IP>`, e.g., `ssh user@172.30.98.229`. Ensure SSH in WSL binds to 0.0.0.0 (edit `/etc/ssh/sshd_config` to include `ListenAddress 0.0.0.0` if needed, then restart).
- If ports conflict, change WSL SSH port (e.g., to 2222 in `sshd_config`) and connect accordingly: `ssh user@localhost -p 2222`.
- Add Windows firewall rules if blocked: `New-NetFirewallRule -DisplayName "WSL SSH" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 22`.

### Accessing Windows-Hosted Services from WSL
Assuming Windows has a service like an SSH server (e.g., OpenSSH for Windows installed via Settings > Apps > Optional features):

- Use the host IP: `ssh user@<host-IP>`, e.g., `ssh user@172.30.96.1`.
- Or hostname: `ssh user@<windows-hostname>.local -p 22`.
- Ensure the Windows service accepts connections from the WSL network (bind to 0.0.0.0 if possible) and add firewall allowances: `netsh advfirewall firewall add rule name="Allow WSL" dir=in action=allow protocol=TCP localport=22`.
- For other services (e.g., a web server on port 80), replace the port accordingly.

### Optional: Port Forwarding for Custom Setups
If direct access isn't sufficient (e.g., for LAN exposure), use `netsh interface portproxy` in PowerShell:
- Forward Windows port to WSL: `netsh interface portproxy add v4tov4 listenport=2222 listenaddress=0.0.0.0 connectport=22 connectaddress=<WSL-IP>`.
- View rules: `netsh interface portproxy show all`.
- This isn't required for basic Windows-WSL access but helps with external or conflicting scenarios.

For persistent setups, edit `C:\Users\<user>\.wslconfig` for global settings or `/etc/wsl.conf` per distro.

---
In Windows Subsystem for Linux version 2 (WSL2), the default networking configuration operates in Network Address Translation (NAT) mode. This setup creates a virtualized network environment where the WSL instance functions like a guest virtual machine (VM) behind the Windows host, which acts as a router. The WSL instance receives a private IP address typically in the 172.16.0.0/12 range, isolated from the host's external network. This isolation enhances security but requires specific methods to access services between the host and guest, such as SSH servers.

NAT mode contrasts with alternatives like mirrored mode (available on Windows 11 version 22H2 or higher, requiring WSL 2.0.9+), which allows bidirectional localhost access without IP queries, or bridged mode (deprecated). To enable mirrored mode, add `networkingMode=mirrored` under `[wsl2]` in the global `.wslconfig` file (located at `C:\Users\<username>\.wslconfig`), then restart WSL with `wsl --shutdown`. In mirrored mode, both Windows and WSL can use `localhost` (127.0.0.1) for connections, supporting features like IPv6, VPN compatibility, and direct LAN access, but it requires Hyper-V firewall adjustments, such as `Set-NetFirewallHyperVVMSetting -Name '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -DefaultInboundAction Allow` in admin PowerShell.

However, since the query specifies NAT mode, the focus remains on default behaviors. Key configurations are managed via `/etc/wsl.conf` (per-distribution) and `.wslconfig` (global). Relevant network settings in `wsl.conf` under `[network]` include `generateHosts=true` (auto-generates `/etc/hosts` for hostname-to-IP mapping), `generateResolvConf=true` (auto-generates `/etc/resolv.conf` for DNS), and `hostname=<custom-name>` (sets WSL hostname, defaulting to Windows hostname). In `.wslconfig` under `[wsl2]`, `localhostForwarding=true` (default) enables automatic forwarding of WSL-bound ports to Windows localhost, `dnsProxy=true` (mirrors Windows DNS to WSL), `firewall=true` (applies Windows Firewall to WSL traffic), and others like `autoProxy=true` for proxy mirroring.

These settings influence service access: for instance, with `localhostForwarding=true`, TCP services in WSL binding to wildcard (0.0.0.0) or localhost become accessible from Windows via localhost without manual forwarding, provided no port conflicts. Hostname resolution relies on generated files; WSL may resolve the Windows host via entries in `/etc/hosts` or mDNS suffixes like `.local` or `.mshome.net`, but IPs are preferred for reliability due to dynamic assignments.

#### Commands for IP and Hostname Discovery
The following table lists essential commands to find IPs and hostnames, executable in PowerShell/CMD (Windows) or the WSL terminal:

| Context | Command | Example Output | Purpose |
|---------|---------|----------------|---------|
| Windows to WSL IP | `wsl hostname -I` | `172.30.98.229` | Retrieves WSL's internal IP for direct access. |
| WSL internal IP | `hostname -I` or `ip addr show eth0 \| grep inet` | `172.30.98.229` | Confirms WSL IP from inside the instance. |
| WSL to Windows IP | `ip route show \| grep -i default \| awk '{print $3}'` | `172.30.96.1` | Gets the gateway IP, which is the Windows host in NAT. |
| Alternative Windows IP | `cat /etc/resolv.conf \| grep nameserver \| awk '{print $2}'` | `172.30.96.1` | Extracts from DNS config, reliable in NAT. |
| Windows hostname from WSL | `hostname` (on Windows), then append `.local` | `MyPC.local` | For mDNS-based resolution; test with `ping MyPC.local`. |
| Set WSL hostname | Edit `/etc/wsl.conf`: `[network] hostname = mywsl` | N/A | Custom hostname; restart WSL to apply. |

IPs are dynamic and may change on WSL restarts or system reboots, so retrieve them fresh each time or use scripts (e.g., PowerShell aliases).

#### Accessing WSL-Hosted Services (e.g., SSH) from Windows
Install and start SSH in WSL: `sudo apt update && sudo apt install openssh-server`, then edit `/etc/ssh/sshd_config` to set `Port 22`, `PasswordAuthentication yes`, and optionally `ListenAddress 0.0.0.0` for broad binding. Restart with `sudo service ssh restart` and check `systemctl status ssh`.

- **Via localhost:** Leverage default forwarding: `ssh user@localhost -p 22`. This works if SSH binds correctly and no Windows service occupies port 22. If conflicted (e.g., Windows OpenSSH), shift WSL port to 2222 and connect `ssh user@localhost -p 2222`.
- **Via IP:** `ssh user@<WSL-IP> -p 22`, e.g., `ssh user@172.30.98.229 -p 22`. This bypasses forwarding issues.
- Firewall: Ensure allowance with `New-NetFirewallRule -DisplayName "WSL SSH Inbound" -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow` in admin PowerShell.
- For LAN exposure (beyond Windows host), use port proxy: `netsh interface portproxy add v4tov4 listenport=2222 listenaddress=0.0.0.0 connectport=22 connectaddress=<WSL-IP>`. View with `netsh interface portproxy show all`; delete via `delete v4tov4 listenport=2222 listenaddress=0.0.0.0`.

#### Accessing Windows-Hosted Services from WSL
Install Windows OpenSSH server via Settings > Apps > Optional features > Add a feature. Configure `C:\ProgramData\ssh\sshd_config` for port 22 and authentication, then start `sshd` service.

- **Via IP:** `ssh user@<host-IP> -p 22`, e.g., `ssh user@172.30.96.1 -p 22`.
- **Via hostname:** `ssh user@MyPC.local -p 22`, if resolution works.
- Binding: Ensure Windows service listens on 0.0.0.0 (edit config if needed). Add firewall rule: `netsh advfirewall firewall add rule name="Windows SSH from WSL" dir=in action=allow protocol=TCP localport=22`.
- For other services (e.g., HTTP on 80), substitute ports: `curl http://<host-IP>:80`.

#### Advanced Configurations and Troubleshooting
- **Port Proxy for Vice Versa:** Though uncommon, forward Windows to WSL ports with similar `netsh` commands, but NAT typically doesn't require it for host-to-guest.
- **Static IPs:** Not natively supported in NAT; scripts can assign via `/etc/wsl.conf` or external tools, but dynamic is standard.
- **Common Issues:** IP changes—use aliases; firewalls block—check rules; binding errors—verify 0.0.0.0; DNS failures—toggle `generateResolvConf`. For remote WAN access, add router forwarding (e.g., external port 2220 to Windows IP:2222).
- **Mirrored Mode Alternative:** If NAT limitations persist, switch for seamless localhost access, but note potential security trade-offs with broader exposure.

This comprehensive approach ensures reliable cross-access, drawing from official documentation and practical setups.

### Key Citations
- [Accessing network applications with WSL | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/networking)<grok:render card_id="a28dd9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="382e3b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render><grok:render card_id="739e89" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>
- [Advanced settings configuration in WSL | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/wsl-config)<grok:render card_id="286603" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render><grok:render card_id="c9d7ce" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render>
- [How to forward WSL2 port to Windows port and vice versa · GitHub](https://gist.github.com/SomajitDey/68e8cd639e3bf592bded035630cf86ec)<grok:render card_id="02ab1e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render><grok:render card_id="ecf7a3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render>
- [WSL 2 Setup for SSH Remote Access | by Tristan Wu - Medium](https://medium.com/@wuzhenquan/windows-and-wsl-2-setup-for-ssh-remote-access-013955b2f421)<grok:render card_id="b0180a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render><grok:render card_id="aa55d1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render>
- [How to access service running on host from WSL2 (connection refused) - Server Fault](https://serverfault.com/questions/1088746/how-to-access-service-running-on-host-from-wsl2-connection-refused)<grok:render card_id="7866bc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render><grok:render card_id="90c4b2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render>
- [Configuring SSH access into WSL 1 and WSL 2](https://jmmv.dev/2022/02/wsl-ssh-access.html)<grok:render card_id="5c3051" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>

## User

_Time: 2025-08-24T00:18:27.039Z_

i'm hosting openssh server in wsl, again with NAT networking mode configured in WSL settings. How to access this server remotely from anywhere in the internet? assume my router/modem is configured with UPnP already.

## Assistant

_Time: 2025-08-24T00:21:42.464Z_

To access your OpenSSH server running in WSL2 under NAT mode from anywhere on the internet, you'll need to configure port forwarding at multiple levels: within WSL, on the Windows host, and on your router using UPnP. This setup can be reliable if automated properly, but note that dynamic IP addresses (e.g., WSL's internal IP) may require scripts to handle changes on restarts. Security is key—use strong authentication like SSH keys, and consider risks like exposing ports to the internet, which could invite unauthorized access attempts. Research suggests this approach works well for most home setups, though success depends on your router's UPnP implementation and network stability.<grok:render card_id="8d10d7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="afa76e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render><grok:render card_id="083b83" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render><grok:render card_id="f8f6a6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render><grok:render card_id="443f67" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>

- **Core Steps Overview**: Install and run SSH in WSL on a non-default port (e.g., 2222) to avoid conflicts, forward that port via Windows to make it accessible on your local network, then use UPnP to open an external port on your router pointing to your Windows machine. Connect remotely using your public IP and the external port.
- **Potential Challenges**: WSL's IP changes on reboots, so automate forwarding; UPnP may not work on all routers or could be insecure—manual router configuration is a safer alternative if UPnP fails.
- **Alternatives to Consider**: If feasible, switch to WSL's mirrored networking mode (Windows 11 22H2+) for simpler localhost access without manual IP handling, though it may alter security profiles.

### Setup OpenSSH in WSL
In your WSL terminal:
1. Install: `sudo apt update && sudo apt install openssh-server`.
2. Edit `/etc/ssh/sshd_config` (use `sudo nano /etc/ssh/sshd_config`): Set `Port 2222`, `ListenAddress 0.0.0.0`, and `PasswordAuthentication yes` (or use keys for better security).
3. Start: `sudo service ssh start`. Ensure it runs on boot by adding to your profile or using a script.

Test locally from Windows: `ssh <wsl_user>@localhost -p 2222` (install Windows OpenSSH client if needed via Settings > Apps > Optional features).

### Windows Host Port Forwarding
WSL2's NAT isolates it, so forward ports using `netsh` in an elevated PowerShell:
1. Get WSL IP: `wsl hostname -I` (e.g., 172.30.98.229).
2. Forward: `netsh interface portproxy add v4tov4 listenport=2222 listenaddress=0.0.0.0 connectport=2222 connectaddress=<WSL_IP>`.
3. Firewall rule: `New-NetFirewallRule -Name 'WSL SSH' -DisplayName 'OpenSSH for WSL' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 2222`.

Automate on boot since WSL IP changes: Create a PowerShell script (e.g., wsl-port-forward.ps1) to query IP and reset `netsh`, then add as a Task Scheduler task running at startup with highest privileges. From LAN, test: `ssh <wsl_user>@<windows_lan_ip> -p 2222` (find Windows LAN IP with `ipconfig`).

### Router UPnP for Internet Access
With UPnP enabled on your router:
1. Install a UPnP client like PortMapper (Java-based, free: https://github.com/kaklakariada/portmapper). Download JAR, ensure Java 11+.
2. Add mapping: `java -jar portmapper.jar -add -externalPort 2222 -internalPort 2222 -protocol tcp` (runs on local machine, requests router to forward external 2222 to Windows LAN IP:2222).
3. For persistence, loop in a .cmd file: `:loop java -jar portmapper.jar -add -externalPort 2222 -internalPort 2222 -protocol tcp timeout 21600 goto loop`.

Find your public IP (e.g., via whatismyip.com). Connect remotely: `ssh <wsl_user>@<public_ip> -p 2222`. If UPnP is unreliable, manually forward on router admin page (e.g., 192.168.1.1).

---

Accessing an OpenSSH server hosted in a Windows Subsystem for Linux 2 (WSL2) instance configured in NAT networking mode from remote locations over the internet requires a multi-layered approach to port forwarding and network configuration. This setup leverages WSL2's virtualized environment, which operates behind a NAT on the Windows host, necessitating explicit forwarding at the host level and then externally via the router. Given that your router is already configured with Universal Plug and Play (UPnP), this enables automated port mapping requests from the Windows host, reducing the need for manual router interventions. However, UPnP can introduce security vulnerabilities, such as unauthorized port openings, so it's advisable to monitor router logs and use strong SSH authentication methods like key-based access rather than passwords.<grok:render card_id="dd9759" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="f66f3a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render><grok:render card_id="9f0f87" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render><grok:render card_id="5d575a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render><grok:render card_id="789f0e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render><grok:render card_id="569649" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render><grok:render card_id="b19893" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render><grok:render card_id="04c36b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render><grok:render card_id="5f7c5e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render><grok:render card_id="d24e5a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render><grok:render card_id="640953" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render><grok:render card_id="68a96e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render><grok:render card_id="c6bb1c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render>

This guide provides a comprehensive, step-by-step process based on established practices from Microsoft documentation, community forums, and developer blogs. It includes automation for handling dynamic elements like IP changes, security considerations, and alternatives such as switching to mirrored networking mode. The process assumes a standard home network setup with a UPnP-enabled router (e.g., from major brands like Netgear or TP-Link) and Windows 10/11 with WSL2 installed. If your router's UPnP implementation is non-standard or disabled for security reasons, fall back to manual port forwarding via the router's web interface.

#### Understanding WSL2 NAT Mode and Networking Challenges
WSL2 operates as a lightweight virtual machine with its own kernel, using NAT by default. This means the WSL instance receives a private IP address (typically in the 172.16.0.0/12 range) that's only visible to the Windows host, not to other devices on your local network or the internet.<grok:render card_id="6a680d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render><grok:render card_id="081906" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render><grok:render card_id="bdbc51" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render> Services like SSH running in WSL are accessible from the Windows host via `localhost`, but remote access requires bridging this isolation through port proxying on Windows and then external forwarding on the router.

Key networking components:
- **WSL IP**: Dynamic, changes on WSL restarts (e.g., `wsl --shutdown`).
- **Windows LAN IP**: Typically static or DHCP-reserved on your local network (e.g., 192.168.1.100); find with `ipconfig` in PowerShell.
- **Public IP**: Your router's external IP (dynamic unless static from ISP); check via sites like whatismyip.com.
- **UPnP Role**: Allows the Windows host to dynamically request port mappings on the router, forwarding inbound internet traffic to the Windows LAN IP.<grok:render card_id="a75de6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render><grok:render card_id="67b256" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render>

Potential issues include port conflicts (e.g., if Windows runs its own SSH on port 22), firewall blocks, or UPnP failures due to router firmware. Always test incrementally: local > LAN > internet.

#### Step-by-Step Configuration
##### 1. Configure OpenSSH Server in WSL
Ensure the SSH server binds to all interfaces and uses a non-conflicting port to avoid issues with Windows services.<grok:render card_id="9b23fb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="46179f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render><grok:render card_id="7d885b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render><grok:render card_id="3354df" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render><grok:render card_id="4b9efb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>
- Update packages: `sudo apt update`.
- Install: `sudo apt install openssh-server`.
- Edit config: `sudo nano /etc/ssh/sshd_config` – Uncomment/change to `Port 2222`, add `ListenAddress 0.0.0.0`, set `PasswordAuthentication yes` (or configure keys via `ssh-keygen` and `authorized_keys` for security).
- Restart: `sudo service ssh restart` or `sudo systemctl restart ssh` if systemd-enabled.
- Auto-start: Add `sudo service ssh start` to `~/.bashrc` or use a cron job `@reboot sudo service ssh start`.

Verify from Windows: Install Windows OpenSSH client, then `ssh <wsl_username>@localhost -p 2222`.

##### 2. Port Forwarding on Windows Host
Use `netsh` to proxy traffic from a Windows port to WSL's SSH port.<grok:render card_id="dbf121" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="ce0ad0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render><grok:render card_id="738dcc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render><grok:render card_id="53b0a6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render><grok:render card_id="750d6f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render><grok:render card_id="06ad85" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render><grok:render card_id="b8e360" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render><grok:render card_id="136c21" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render><grok:render card_id="4519ca" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render><grok:render card_id="00d713" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render><grok:render card_id="377c65" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render><grok:render card_id="986962" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render><grok:render card_id="815240" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>
- Get WSL IP: In PowerShell, `wsl hostname -I`.
- Forward port: `netsh interface portproxy add v4tov4 listenport=2222 listenaddress=0.0.0.0 connectport=2222 connectaddress=<WSL_IP>`.
- View rules: `netsh interface portproxy show all`.
- Firewall: `New-NetFirewallRule -Name 'WSL SSH Inbound' -DisplayName 'OpenSSH for WSL' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 2222`.

| Command | Purpose | Example Output/Notes |
|---------|---------|----------------------|
| `wsl hostname -I` | Retrieve WSL IP | `172.30.98.229` (dynamic) |
| `netsh interface portproxy add v4tov4 ...` | Set up proxy | No output; use `show all` to verify |
| `New-NetFirewallRule ...` | Allow inbound | Rule created; check with `Get-NetFirewallRule` |

Automate for IP changes: Create `wsl-port-forward.ps1`:
```
$ports = @(2222)
$wsl_ip = (wsl hostname -I).Trim()
foreach ($port in $ports) {
    netsh interface portproxy delete v4tov4 listenport=$port listenaddress=0.0.0.0
    netsh interface portproxy add v4tov4 listenport=$port listenaddress=0.0.0.0 connectport=$port connectaddress=$wsl_ip
}
```
Schedule via Task Scheduler: Create task > Triggers: At startup > Actions: Start program `powershell.exe` with arguments `-ExecutionPolicy Bypass -File C:\path\to\script.ps1` > Run with highest privileges.

Test from LAN: On another device, `ssh <wsl_username>@<windows_lan_ip> -p 2222`.

##### 3. UPnP Port Forwarding on Router for Internet Access
UPnP allows your Windows machine to request the router to map an external port to the internal Windows port.<grok:render card_id="91e79a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render><grok:render card_id="376fc1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render><grok:render card_id="14e46f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render><grok:render card_id="e0afa8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render><grok:render card_id="c4541d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render><grok:render card_id="c426ff" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render><grok:render card_id="d4544f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render><grok:render card_id="5f36ac" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render><grok:render card_id="88e8dd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">41</argument>
</grok:render><grok:render card_id="7e7491" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render><grok:render card_id="582122" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render><grok:render card_id="a2aa58" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">46</argument>
</grok:render><grok:render card_id="4ac172" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">47</argument>
</grok:render><grok:render card_id="898b37" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">48</argument>
</grok:render><grok:render card_id="222746" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render><grok:render card_id="53ffda" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">51</argument>
</grok:render>
- Install tool: Use PortMapper (https://github.com/kaklakariada/portmapper) – Download JAR, requires Java 11+ (`java -version` to check).
- Add mapping: `java -jar portmapper.jar -add -externalPort 2222 -internalPort 2222 -protocol tcp` (maps external 2222 to local 2222 TCP).
- List mappings: `java -jar portmapper.jar -l`.
- Delete: `java -jar portmapper.jar -d -externalPort 2222 -protocol tcp`.

| Tool | Command Example | Notes |
|------|-----------------|-------|
| PortMapper | `java -jar portmapper.jar -add -externalPort 2222 -internalPort 2222 -protocol tcp` | Free, open-source; add `-ip <windows_lan_ip>` if needed |
| UPnP Wizard (GUI/CLI) | Download from https://www.xldevelopment.net/upnpwiz.php; CLI: `UPnPWizardC.exe /add <windows_lan_ip> 2222 TCP 2222 "WSL SSH"` | GUI for manual; CLI for scripts |

For persistence (mappings may expire): Create .cmd loop: `:loop java -jar portmapper.jar -add ... timeout 21600 goto loop`. Run as startup task.

Remote connection: `ssh <wsl_username>@<public_ip> -p 2222`. Use dynamic DNS (e.g., No-IP) if public IP changes.

##### 4. Security and Troubleshooting
- **Security**: Disable password auth (`PasswordAuthentication no`), use keys; monitor with `fail2ban` in WSL; restrict UPnP to trusted devices on router.<grok:render card_id="89c4d7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render><grok:render card_id="10ea16" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render> Avoid low ports with UPnP.
- **Troubleshooting**: Check SSH status (`sudo service ssh status`); verify netsh (`netsh interface portproxy show all`); test UPnP with tools like `upnpc -l`; if UPnP fails, manual forward on router (e.g., external 2222 to <windows_lan_ip>:2222). Reserve Windows IP in router DHCP.
- **Performance**: NAT may limit some protocols; mirrored mode (below) improves this.

#### Alternative: Mirrored Networking Mode
For Windows 11 22H2+ with WSL 2.0.9+, enable via `.wslconfig` (`[wsl2] networkingMode=mirrored`), then `wsl --shutdown`.<grok:render card_id="f49f75" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render><grok:render card_id="536be1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render> Benefits: Direct LAN access to WSL without proxying, IPv6, multicast; use `localhost` bidirectionally. Configure Hyper-V firewall: `Set-NetFirewallHyperVVMSetting -Name '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -DefaultInboundAction Allow`. Still need router forwarding for internet, but simpler internal setup.

This configuration, when properly implemented, provides robust remote access, balancing convenience with security in a NAT environment.

**Key Citations:**
- [SSH into WSL from another machine on the network - Super User](https://superuser.com/questions/1622581/ssh-into-wsl-from-another-machine-on-the-network)<grok:render card_id="4ebdb4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [WSL Remote Access Setup Guide (Hamachi — SSH) - Medium](https://medium.com/%40mucagriaktas/wsl-remote-access-setup-guide-hamachi-ssh-eb51c2754553)<grok:render card_id="993329" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>
- [Configuring SSH access into WSL 1 and WSL 2](https://jmmv.dev/2022/02/wsl-ssh-access.html)<grok:render card_id="a60300" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>
- [Accessing network applications with WSL | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/networking)<grok:render card_id="74b43f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render>
- [How to access home ssh server from outside via the Internet?](https://askubuntu.com/questions/1360840/how-to-access-home-ssh-server-from-outside-via-the-internet)<grok:render card_id="4b5efe" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
- [How to SSH into WSL2](https://mhlakhani.com/blog/2022/08/ssh-into-wsl2/)<grok:render card_id="87de45" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render>
- [How to SSH into WSL2 on Windows 10 from an external machine](https://www.hanselman.com/blog/how-to-ssh-into-wsl2-on-windows-10-from-an-external-machine)<grok:render card_id="7c8aca" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>
- [WSL 2 Setup for SSH Remote Access | by Tristan Wu - Medium](https://medium.com/%40wuzhenquan/windows-and-wsl-2-setup-for-ssh-remote-access-013955b2f421)<grok:render card_id="0ea4d5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render>
- [Accessing network applications with WSL | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/networking)<grok:render card_id="cf81b9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render>
- [Get started with Windows Subsystem for Linux (WSL) on Arm: Use SSH to connect to WSL](https://learn.arm.com/learning-paths/laptops-and-desktops/wsl2/ssh/)<grok:render card_id="883387" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render>
- [ruby on rails - Connecting to WSL2 server via local network - Stack Overflow](https://stackoverflow.com/questions/61002681/connecting-to-wsl2-server-via-local-network)<grok:render card_id="a01620" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render>
- [How to SSH into WSL2 on Windows 10 from an external machine - Scott Hanselman's Blog](https://www.hanselman.com/blog/how-to-ssh-into-wsl2-on-windows-10-from-an-external-machine)<grok:render card_id="5b894c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render>
- [Configuring SSH access into WSL 1 and WSL 2 - Julio Merino (jmmv.dev)](https://jmmv.dev/2022/02/wsl-ssh-access.html)<grok:render card_id="4b4d6e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render>
- [windows subsystem for linux - Enable SSH in WSL system - Ask Ubuntu](https://askubuntu.com/questions/1339980/enable-ssh-in-wsl-system)<grok:render card_id="afdadb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render>
- [SSH into a WSL2 host remotely reliably | by Gilad Lekner | Medium](https://medium.com/%40gilad215/ssh-into-a-wsl2-host-remotely-and-reliabley-578a12c91a2)<grok:render card_id="100eb7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render>
- [WSL-2: Which ports are automatically forwarded? - Stack Overflow](https://stackoverflow.com/questions/64513964/wsl-2-which-ports-are-automatically-forwarded)<grok:render card_id="6fea52" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render>
- [WSL2: port-forwarding between Windows and Linux - Super User](https://superuser.com/questions/1789240/wsl2-port-forwarding-between-windows-and-linux)<grok:render card_id="e955cc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render>
- [WSL 2 Setup for SSH Remote Access | by Tristan Wu - Medium](https://medium.com/%40wuzhenquan/windows-and-wsl-2-setup-for-ssh-remote-access-013955b2f421)<grok:render card_id="19969d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>
- [kaklakariada/portmapper: A tool for managing port ... - GitHub](https://github.com/kaklakariada/portmapper)<grok:render card_id="113ec2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render>
- [UPnP Wizard - Port Mapping Tool - XL Development](https://www.xldevelopment.net/upnpwiz.php)<grok:render card_id="a953ea" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render>
- [Automatic UPnP port forwarding on Windows](https://softwarerecs.stackexchange.com/questions/17741/automatic-upnp-port-forwarding-on-windows)<grok:render card_id="5a5256" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render>
- [Is there a (built-in) UPnP client in Windows 10 - Super User](https://superuser.com/questions/1676484/is-there-a-built-in-upnp-client-in-windows-10)<grok:render card_id="cec479" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render>
- [Using UPnP Wizard > Command Line Tool - XL Development](https://www.xldevelopment.net/help/upnpwiz/command_line_tool.htm)<grok:render card_id="a365e0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render>
- [UPnP PortMapper download | SourceForge.net](https://sourceforge.net/projects/upnp-portmapper/)<grok:render card_id="cd0a8c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">39</argument>
</grok:render>
- [UPnP PortMapper Homepage](https://upnp-portmapper.sourceforge.io/)<grok:render card_id="80f9d5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render>
- [Applications for port forwarding using UPnP - Luanti Forums](https://forum.luanti.org/viewtopic.php?t=4342)<grok:render card_id="4f9d77" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">41</argument>
</grok:render>
- [Is it possible to map a port using UPnP, with SOAP, to bind a local ... - Stack Overflow](https://stackoverflow.com/questions/4357054/is-it-possible-to-map-a-port-using-upnp-with-soap-to-bind-to-a-local-port-wher)<grok:render card_id="e7e9ce" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render>
- [Setting up port forwarding via UPnP on Windows Server 2008 R2?](https://serverfault.com/questions/76145/setting-up-port-forwarding-via-upnp-on-windows-server-2008-r2)<grok:render card_id="096dbc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render>
- [SSH with UPnP - Raspberry Pi Forums](https://forums.raspberrypi.com/viewtopic.php?t=84125)<grok:render card_id="3dc6ed" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">46</argument>
</grok:render>
- [Programmatically Open External Ports with UPNP - YouTube](https://www.youtube.com/watch?v=Ey9YHcWdjWQ)<grok:render card_id="fe72c6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">47</argument>
</grok:render>
- [Port forward for remote access : r/PleX - Reddit](https://www.reddit.com/r/PleX/comments/124yp46/port_forward_for_remote_access/)<grok:render card_id="5241a6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">48</argument>
</grok:render>
- [Tunnelling SSH via uPnP - by Jos Martin - Medium](https://medium.com/%40jos.martin/tunnelling-ssh-via-upnp-af023d04290d)<grok:render card_id="23bd5d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render>
- [Automatic UPnP port forwarding on Windows](https://softwarerecs.stackexchange.com/questions/17741/automatic-upnp-port-forwarding-on-windows)<grok:render card_id="d311e6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">51</argument>
</grok:render>
