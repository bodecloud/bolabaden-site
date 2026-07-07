---
source_url: "https://grok.com/c/fc75beef-1483-4403-b219-cd796ee5bf68"
conversation_id: "fc75beef-1483-4403-b219-cd796ee5bf68"
title: "WSL2 NAT Mode Port Forwarding"
extracted_at: "2026-06-29T16:23:56.055Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# WSL2 NAT Mode Port Forwarding

Source: [Grok conversation](https://grok.com/c/fc75beef-1483-4403-b219-cd796ee5bf68)

## User

_Time: 2025-08-29T21:13:13.967Z_

when using wsl2, configured in WSL Settings to use NAT mode, how to port forward ingress traffic/servers that are running in wsl2? Am running them in docker desktop

## Assistant

_Time: 2025-08-29T21:14:57.349Z_

In Windows Subsystem for Linux version 2 (WSL2) configured with NAT networking mode, services running within Docker containers are hosted in the WSL2 virtual machine environment, which operates behind network address translation. This setup isolates the WSL2 network from the Windows host and external networks, necessitating manual port forwarding to enable ingress traffic to reach the containers. Docker Desktop, which leverages WSL2 as its backend, exposes container ports to the WSL2 VM but does not automatically forward them to the Windows host or beyond in NAT mode. The following steps outline the process to configure port forwarding using Windows tools, based on established practices from Microsoft documentation and community resources.<grok:render card_id="137881" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render>

### Prerequisites
- Ensure Docker Desktop is installed with WSL2 integration enabled (default behavior).
- Confirm WSL2 is set to NAT mode via the `.wslconfig` file (located at `%USERPROFILE%\.wslconfig`), with the entry:
  ```
  [wsl2]
  networkingMode = nat
  ```
- Restart WSL after configuration changes: `wsl --shutdown`.
- Run your Docker containers with published ports, e.g., `docker run -p 8080:80 nginx` (maps container port 80 to WSL2 VM port 8080).

### Step 1: Obtain the WSL2 IP Address
The WSL2 VM has a dynamic IP address that may change on restarts. Retrieve it from within a WSL distribution:
- Open a WSL terminal.
- Execute: `hostname -I | awk '{print $1}'` (or `ip addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}'`).
- Note the IP (e.g., 172.29.232.235). This is required for forwarding.

### Step 2: Configure Port Forwarding on the Windows Host
Use the `netsh` command to create a port proxy rule that redirects traffic from a Windows host port to the corresponding port on the WSL2 VM. Run these commands in an elevated PowerShell (as Administrator):
- Add the proxy rule:
  ```
  netsh interface portproxy add v4tov4 listenport=<HOST_PORT> listenaddress=0.0.0.0 connectport=<WSL_PORT> connectaddress=<WSL_IP>
  ```
  - `<HOST_PORT>`: The port on the Windows host to listen on (e.g., 8080).
  - `<WSL_PORT>`: The port exposed by the Docker container on the WSL2 VM (e.g., 8080).
  - `<WSL_IP>`: The WSL2 IP obtained in Step 1.
  - Example: `netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=172.29.232.235`.
- Verify the rule: `netsh interface portproxy show v4tov4`.

This setup allows ingress traffic to the Windows host's IP on `<HOST_PORT>` to be forwarded to the Docker service in WSL2.

### Step 3: Configure Windows Firewall
By default, Windows Firewall may block incoming connections. Add an inbound rule:
- In elevated PowerShell:
  ```
  netsh advfirewall firewall add rule name="WSL Docker Forwarding" dir=in action=allow protocol=TCP localport=<HOST_PORT>
  ```
- Replace `<HOST_PORT>` with the listening port (e.g., 8080).
- For production environments, restrict the rule to specific source IP ranges for security.

### Step 4: Enable External Access (LAN or Internet)
- For local area network (LAN) access: Clients on the same network can connect using the Windows host's LAN IP (find it via `ipconfig` in Command Prompt, under Ethernet or Wi-Fi adapter) and the `<HOST_PORT>`, e.g., `http://192.168.1.100:8080`.
- For internet access: Configure your router's port forwarding to direct external traffic on a public port to the Windows host's LAN IP and `<HOST_PORT>`. Ensure your Docker service binds to `0.0.0.0` (not `127.0.0.1`) to accept connections from any interface.
- Security note: Exposing ports externally increases risk; implement authentication, TLS, or a reverse proxy (e.g., NGINX) as appropriate.

### Automation for Dynamic WSL2 IP
Since the WSL2 IP can change, automate the process with a script run on Windows startup or WSL boot:
- Create a PowerShell script (e.g., `wsl-port-forward.ps1`):
  ```
  $wslIp = wsl hostname -I | ForEach-Object { $_.Split(' ')[0] }
  netsh interface portproxy delete v4tov4 listenport=<HOST_PORT> listenaddress=0.0.0.0
  netsh interface portproxy add v4tov4 listenport=<HOST_PORT> listenaddress=0.0.0.0 connectport=<WSL_PORT> connectaddress=$wslIp
  ```
- Schedule it via Task Scheduler to run on logon with elevated privileges.

### Troubleshooting
- Test locally: From Windows, access `localhost:<HOST_PORT>` or `127.0.0.1:<HOST_PORT>`.
- If access fails: Ensure the container is running (`docker ps`), verify bindings, and check for conflicts with other services. Restart Docker Desktop or WSL if needed.
- Alternative modes: If NAT limitations persist, consider switching to mirrored networking mode (`networkingMode=mirrored` in `.wslconfig`), which simplifies access by mirroring the host's network stack, though it may introduce compatibility issues.<grok:render card_id="3f760c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render>
- For Docker-specific issues: Review Docker Desktop logs via the GUI or `docker logs`.

This configuration ensures reliable ingress to your Docker services in WSL2 NAT mode while maintaining isolation.

## User

_Time: 2025-08-29T21:16:13.290Z_

ok i don't want to do this every time for any and all ports i decide to forward now and in the future, how to make all ports wsl wants to use forwarded dynamically and/or by default

## Assistant

_Time: 2025-08-29T21:18:27.121Z_

To achieve dynamic or automatic port forwarding for all ports exposed by services running in WSL2 under NAT mode, particularly those in Docker Desktop, the default NAT configuration does not provide built-in support for such functionality. Manual intervention is typically required for each port, as outlined in prior guidance, due to the isolated nature of the WSL2 virtual machine. However, two primary approaches can address this limitation: transitioning to mirrored networking mode, which inherently enables automatic exposure of ports without per-port configuration, or implementing scripted automation in NAT mode for predefined port ranges or monitored services. These methods are derived from established Microsoft documentation and community practices.

### Transition to Mirrored Networking Mode
Mirrored mode, introduced in Windows 11 version 22H2 and refined in subsequent updates, mirrors the host's network interfaces into WSL2. This eliminates the need for manual port forwarding rules, as ports exposed within WSL2 (including Docker containers) become directly accessible via the Windows host's IP address for both localhost and LAN connections. By August 2025, this mode is stable and recommended for scenarios requiring seamless ingress traffic.

#### Requirements
- Windows 11 version 22H2 or later (verify via `winver` in the Run dialog).
- Administrative privileges for configuration.

#### Configuration Steps
1. Edit the `.wslconfig` file located at `%USERPROFILE%\.wslconfig` (create it if absent) using a text editor such as Notepad. Add the following under the `[wsl2]` section:
   ```
   [wsl2]
   networkingMode = mirrored
   ```
2. Shut down WSL to apply changes: Execute `wsl --shutdown` in an elevated PowerShell or Command Prompt.
3. Restart WSL by launching a distribution (e.g., `wsl` or via Docker Desktop).
4. Configure Hyper-V firewall rules if inbound connections are blocked (common for security). In an elevated PowerShell:
   - Allow all inbound traffic to the WSL VM (use cautiously in production):
     ```
     Set-NetFirewallHyperVVMSetting -Name '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -DefaultInboundAction Allow
     ```
   - Alternatively, create a specific rule for Docker-related ports (e.g., for port 8080):
     ```
     New-NetFirewallHyperVRule -Name "DockerPortForward" -DisplayName "Docker Port Forwarding" -Direction Inbound -VMCreatorId '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -Protocol TCP -LocalPorts 8080
     ```
     Adjust `-LocalPorts` to include additional ports as needed, or use a comma-separated list for multiples.

#### Benefits and Considerations
- **Automatic Exposure**: Any port published by a Docker container (e.g., via `-p` flag) or WSL service binding to `0.0.0.0` is accessible on the host's localhost (127.0.0.1) and LAN IP without further setup.
- **Dynamic Handling**: Handles variable WSL IP addresses and port changes inherently, as the network stack is shared.
- **Docker Integration**: Docker Desktop operates transparently in this mode, with containers' ports available externally.
- **Limitations**: IPv6 localhost (`::1`) is not supported for Windows-to-Linux connections. Test for compatibility with your workloads, as some legacy applications may require adjustments. If issues arise, revert by removing the `networkingMode` entry and restarting WSL.<grok:render card_id="aa51bb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render>

### Automation in NAT Mode (Alternative if Mirrored Mode is Unavailable)
If mirrored mode cannot be used (e.g., due to Windows version constraints), automate port forwarding via scripts that detect and forward ports dynamically. This does not forward "all possible ports" by default—due to security and performance concerns—but can target common ranges or monitor Docker-exposed ports.

#### Script-Based Approach
Use a PowerShell script executed on Windows startup to query active ports in WSL2/Docker and apply forwarding rules. This handles IP changes and can be extended for dynamic detection.

1. **Create the Script** (e.g., save as `wsl-dynamic-port-forward.ps1`):
   ```
   # Requires elevated privileges
   $wslIp = (wsl hostname -I).Split(' ')[0]

   # Example: Forward a predefined range (e.g., 8000-9000 for development ports)
   $portRangeStart = 8000
   $portRangeEnd = 9000
   for ($port = $portRangeStart; $port -le $portRangeEnd; $port++) {
       netsh interface portproxy delete v4tov4 listenport=$port listenaddress=0.0.0.0
       netsh interface portproxy add v4tov4 listenport=$port listenaddress=0.0.0.0 connectport=$port connectaddress=$wslIp
   }

   # Alternative: Dynamically detect Docker-exposed ports
   # Install jq in WSL if needed: sudo apt install jq
   $dockerPorts = wsl docker ps --format '{{json .Ports}}' | ForEach-Object { $_ | ConvertFrom-Json }
   foreach ($portMapping in $dockerPorts) {
       if ($portMapping -match '(\d+)->') {
           $hostPort = $Matches[1]
           netsh interface portproxy delete v4tov4 listenport=$hostPort listenaddress=0.0.0.0
           netsh interface portproxy add v4tov4 listenport=$hostPort listenaddress=0.0.0.0 connectport=$hostPort connectaddress=$wslIp
       }
   }

   # Add firewall rules (example for range)
   netsh advfirewall firewall add rule name="WSL Dynamic Forwarding" dir=in action=allow protocol=TCP localport=8000-9000
   ```
   Customize the range or detection logic based on your needs (e.g., use `netstat` or `ss` in WSL to list listening ports).

2. **Schedule Execution**:
   - Open Task Scheduler, create a new task, and set it to run at logon with highest privileges.
   - Under Actions, point to the script: `powershell.exe -ExecutionPolicy Bypass -File "C:\Path\To\wsl-dynamic-port-forward.ps1"`.
   - Enable "Run whether user is logged on or not" for persistence.

#### Considerations
- **Security**: Forwarding broad ranges exposes potential vulnerabilities; restrict to necessary ports and source IPs in firewall rules.
- **Limitations**: This is not truly "all ports by default" but approximates dynamic behavior for specified ranges or detected services. Full automation for arbitrary ports requires monitoring tools (e.g., a loop checking `docker ps` periodically), which may impact performance.
- **Troubleshooting**: If ports fail to forward, verify script elevation, WSL IP retrieval, and Docker bindings. Restart services after changes.

Mirrored mode is the preferred solution for simplicity and comprehensiveness. If compatibility issues persist, consult Microsoft support resources for your specific Windows build.
