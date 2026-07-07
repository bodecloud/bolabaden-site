---
source_url: "https://grok.com/c/08d5729b-0ed1-455a-9a25-1e3e253131bb"
conversation_id: "08d5729b-0ed1-455a-9a25-1e3e253131bb"
title: "Fixing WebSocket Error in VS Code with WSL"
extracted_at: "2026-06-29T16:34:03.379Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Fixing WebSocket Error in VS Code with WSL

Source: [Grok conversation](https://grok.com/c/08d5729b-0ed1-455a-9a25-1e3e253131bb)

## User

_Time: 2025-06-01T16:25:21.685Z_

Failed to connect to the remote extension host server (Error: WebSocket close with status code 1006)

How to fix this error when trying to use wsl in vs code?

## Assistant

_Time: 2025-06-01T16:28:11.199Z_

### Key Points
- It seems likely that removing the `.vscode-server` directory in WSL and updating VS Code can fix the error.
- Research suggests restarting WSL or checking VPN settings might help, but these are less certain.
- The evidence leans toward the issue being related to VS Code server corruption or network interference.

### Update VS Code
Make sure you have the latest version of VS Code installed. Updates often fix bugs like this. You can check for updates within VS Code by going to the "Help" menu and selecting "Check for Updates."

### Remove `.vscode-server` in WSL
This is often the most effective fix:
- Open your WSL terminal (e.g., Ubuntu).
- Run the command: `rm -rf ~/.vscode-server/`
- Restart VS Code and try connecting to WSL again. This forces VS Code to reinstall the server, potentially resolving corruption.

### Restart WSL
If the above doesn't work:
- Open a Windows command prompt as administrator.
- Run: `wsl --shutdown`
- Restart WSL by opening your terminal again, then try connecting from VS Code.

### Check VPN or Proxy Settings
If you use a VPN, try disconnecting it temporarily, as it might interfere with the connection. Also, ensure no proxy settings are blocking VS Code's WebSocket connection.

---

### Survey Note: Detailed Analysis of the Error and Solutions

This section provides a comprehensive overview of the error "Failed to connect to the remote extension host server (Error: WebSocket close with status code 1006)" when using WSL in VS Code, based on recent discussions and user experiences as of June 1, 2025. The error, characterized by WebSocket status code 1006, indicates an abnormal closure of the connection, often linked to issues with the VS Code server in WSL, network configurations, or external software like VPNs.

#### Background and Context
The error typically occurs when attempting to connect VS Code to a WSL (Windows Subsystem for Linux) instance, particularly WSL2, which uses a virtual network. This can disrupt the WebSocket communication necessary for the Remote - WSL extension in VS Code. The issue has been reported across various VS Code versions, including 1.53.0, 1.88.2, and others, suggesting it may not be version-specific but rather context-dependent.

#### Primary Causes and Solutions
From recent GitHub issues and community forums, several causes and corresponding solutions have emerged:

1. **Corrupted VS Code Server Installation in WSL**
   - A common cause is a corrupted `.vscode-server` directory in the WSL home directory. This can happen after system reboots, updates, or unexpected closures.
   - **Solution:** Remove the directory by running `rm -rf ~/.vscode-server/` in the WSL terminal, then restart VS Code. This forces a reinstallation of the server components, often resolving the issue. For example, a GitHub issue from July 2023 ([GitHub Issue: Failed to connect to the remote extension host server](https://github.com/microsoft/vscode/issues/187360)) highlighted this as a successful workaround, with users reporting resolution after following these steps.

2. **Network and WSL Configuration Issues**
   - WSL2 uses a virtual network, which can sometimes cause connectivity issues, especially with WebSocket connections. This may be exacerbated by VPNs, proxies, or firewall settings.
   - **Solutions:**
     - Restart WSL using `wsl --shutdown` in a Windows command prompt, then reconnect. This was effective in some cases, as noted in a 2021 GitHub issue ([GitHub Issue: VSCode cannot connect to remote Linux](https://github.com/microsoft/vscode/issues/115818)).
     - Check proxy settings: Turn "Http: Proxy Support" to "off" in VS Code settings and add the WSL2 vEthernet IP to proxy exceptions if necessary. Alternatively, ensure "Remote.WSL > Server: Connect Through Localhost" is checked.
     - Disconnect VPN temporarily, as reported in a Reddit discussion from September 2023 ([Reddit Post: VS Code can't connect to WSL after update to 3.5](https://www.reddit.com/r/PrivateInternetAccess/comments/16u788s/vs_code_cant_connect_to_wsl_after_update_to_35/)), where users found VPN updates (e.g., Private Internet Access 3.5) caused the error, resolved by enabling split tunneling or disabling advanced killswitch.

3. **Version-Specific Bugs and Updates**
   - Some users reported the issue with specific VS Code versions (e.g., 1.53.0, 1.54.3), suggesting potential bugs. Updating to the latest version was recommended, as newer releases often include fixes.
   - **Solution:** Ensure VS Code is updated to the latest version (e.g., check via the "Help" menu in VS Code). A GitHub issue from August 2023 suggested upgrading as a first step, though some users mistakenly referenced older versions like 1.80.0, likely typos given the context.

#### Detailed Steps for Resolution
To systematically address the error, follow these steps in order:

1. **Update VS Code:**
   - Open VS Code, go to "Help" > "Check for Updates," and install any available updates. This ensures you benefit from recent bug fixes and improvements.

2. **Remove `.vscode-server`:**
   - Open your WSL terminal (e.g., Ubuntu).
   - Run: `rm -rf ~/.vscode-server/`
   - This command deletes the existing VS Code server installation. Restart VS Code and attempt to connect to WSL again. The server should reinstall automatically.

3. **Restart WSL:**
   - If the error persists, open a Windows command prompt as administrator.
   - Run: `wsl --shutdown`
   - Restart WSL by opening your terminal or running `wsl` in the command prompt, then try connecting from VS Code.

4. **Check VPN and Proxy Settings:**
   - If using a VPN, disconnect it temporarily and test the connection. For example, a Reddit user in September 2023 found that enabling VS Code to bypass the VPN via split tunneling resolved the issue.
   - In VS Code settings, navigate to "Http: Proxy Support" and set it to "off." If using a proxy, add the WSL2 vEthernet IP to exceptions or ensure "Remote.WSL > Server: Connect Through Localhost" is enabled.

5. **Additional Debugging:**
   - If the issue remains unresolved, capture detailed logs by starting VS Code with `code --verbose .` from the WSL shell, as suggested in older GitHub issues. This can help identify specific network or configuration errors.
   - Consider checking related GitHub issues for similar problems, such as [GitHub Issue: VSCode cannot connect to remote Linux](https://github.com/microsoft/vscode/issues/130887), which may offer additional insights.

#### Comparative Analysis of Solutions
The following table summarizes the effectiveness and applicability of the solutions based on community feedback:

| **Solution**                          | **Effectiveness** | **Applicability**                     | **Notes**                                                                 |
|---------------------------------------|-------------------|---------------------------------------|---------------------------------------------------------------------------|
| Remove `.vscode-server`               | High              | All WSL users                         | Most common fix, forces reinstallation of server components.              |
| Update VS Code to latest version      | Medium            | Users on older versions               | Ensures bug fixes, but may not resolve all cases.                        |
| Restart WSL with `wsl --shutdown`     | Medium            | Network-related issues                | Effective for temporary connectivity issues, less reliable long-term.    |
| Disconnect VPN or adjust proxy        | Variable          | Users with VPN/proxy                  | Highly effective if VPN/proxy is the cause, as seen in Reddit discussions.|
| Downgrade VS Code (e.g., to 1.52.1)   | Low               | Historical cases, not recommended now | Mentioned in 2021, less relevant given recent updates.                   |

#### Considerations and Limitations
While the above solutions address most cases, the error's root cause can vary. For instance, VPN-related issues were prominent in discussions from 2023, particularly after updates to services like Private Internet Access. However, as of June 1, 2025, without specific user mention of VPN, the focus should be on server corruption and WSL restarts. Additionally, WSL2's virtual network can introduce complexities not present in WSL1, as noted in some Stack Overflow threads ([Stack Overflow: Vscode cannot connect to remote Linux](https://stackoverflow.com/questions/68799580/vscode-cannot-connect-to-remote-linux-websocket-close-with-status-code-1006)), suggesting network troubleshooting might be necessary for advanced users.

#### Community and Developer Insights
GitHub issues, such as [GitHub Issue: Failed to connect to the remote extension host server](https://github.com/microsoft/vscode/issues/187360), indicate that Microsoft contributors have acknowledged the issue, closing it in August 2023 with suggestions to reopen if persistent, pointing to ongoing efforts to address such errors. Community feedback, especially on Reddit and Stack Overflow, highlights the diversity of user environments, with VPNs, proxies, and WSL configurations playing significant roles.

#### Conclusion
For most users encountering this error with WSL in VS Code, removing the `.vscode-server` directory and ensuring the latest VS Code version should resolve the issue. If problems persist, restarting WSL or checking VPN/proxy settings are viable next steps. This approach balances simplicity for lay users with depth for those willing to troubleshoot further, aligning with the observed community solutions as of June 1, 2025.

### Key Citations
- [Failed to connect to the remote extension host server Error WebSocket close with status code 1006 Issue](https://github.com/microsoft/vscode/issues/187360)
- [Failed to connect to the remote extension host server Error WebSocket close with status code 1006 Issue](https://github.com/microsoft/vscode/issues/115818)
- [Vscode cannot connect to remote Linux WebSocket close with status code 1006](https://stackoverflow.com/questions/68799580/vscode-cannot-connect-to-remote-linux-websocket-close-with-status-code-1006)
- [VS Code can't connect to WSL after update to 3.5](https://www.reddit.com/r/PrivateInternetAccess/comments/16u788s/vs_code_cant_connect_to_wsl_after_update_to_35/)
