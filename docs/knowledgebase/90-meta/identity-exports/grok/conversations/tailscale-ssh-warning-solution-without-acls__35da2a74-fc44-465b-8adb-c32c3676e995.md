---
source_url: "https://grok.com/c/35da2a74-fc44-465b-8adb-c32c3676e995"
conversation_id: "35da2a74-fc44-465b-8adb-c32c3676e995"
title: "Tailscale SSH Warning Solution Without ACLs"
extracted_at: "2026-06-29T16:24:45.556Z"
message_count: 3
export_suite: "identity"
provenance: grok-rest-api
---

# Tailscale SSH Warning Solution Without ACLs

Source: [Grok conversation](https://grok.com/c/35da2a74-fc44-465b-8adb-c32c3676e995)

## User

_Time: 2025-08-24T00:54:10.447Z_

ubuntu@beatapostapita:~/my-media-stack$ sudo tailscale up --login-server=https://headscale-server.bolabaden.org --accept-dns --shields-up=false --ssh=true --accept-risk=linux-strict-rp-filter Tailscale SSH enabled, but access controls don't allow anyone to access this device. Update your tailnet's ACLs to allow access.
how to just allow anyone to access, solving above warning
 
find a solution that doesn't involve creating/modifying any files, i don't want to use acl literally i just want to enable ssh

## Assistant

_Time: 2025-08-24T00:58:53.812Z_

### Key Points
- The warning appears because Tailscale SSH (enabled via `--ssh=true`) requires explicit access rules in your tailnet's ACL policy to grant SSH permissions, and without them, no access is allowed by default for this feature.
- Research suggests that the simplest way to resolve the warning without modifying or creating any files (such as ACL policies or configs) is to disable Tailscale SSH by removing the `--ssh=true` flag from your `tailscale up` command—it seems likely that this will eliminate the warning while still allowing standard SSH access over the Tailscale network.
- This approach acknowledges the complexity of Tailscale SSH, which ties authentication to tailnet identities, versus standard SSH, which uses local credentials; if Tailscale SSH is not essential, standard SSH provides a straightforward alternative without ACL involvement.
- Be aware that "allowing anyone" in this context means any authenticated device in your tailnet can attempt SSH connections, but actual login depends on your local SSH server configuration (e.g., passwords or keys).

### How This Solves the Warning
Removing `--ssh=true` turns off Tailscale's managed SSH server, which is what triggers the ACL check and warning. Without it, Tailscale won't attempt to enforce SSH-specific access controls, so the warning disappears. Your device remains connected to the tailnet, and other nodes can reach it over the Tailscale IP on port 22 using standard SSH clients.

### Steps to Implement
1. Run the modified command:  
   `sudo tailscale up --login-server=https://headscale-server.bolabaden.org --accept-dns --shields-up=false --accept-risk=linux-strict-rp-filter`  
   (Note: Omit `--ssh=true`.)

2. Verify the connection: From another device in the tailnet, use `ssh user@<tailscale-hostname>` or `ssh user@<tailscale-ip>`. Ensure your local SSH server (`sshd`) is running and configured for access (e.g., via `/etc/ssh/sshd_config`—but no changes needed if already set up).

3. If needed, check status with `tailscale status` to confirm the device is online without SSH warnings.

### Potential Trade-offs
- **Authentication Differences**: Tailscale SSH handles logins via Tailscale user keys (no local accounts needed), while standard SSH relies on your device's users/passwords/keys. This might require sharing credentials separately.
- **Security Considerations**: Standard SSH exposes your local server directly over the tailnet; ensure strong authentication to avoid risks. If broader access control is desired later, ACLs could be revisited, but this avoids them entirely.
- **Compatibility Notes**: This works assuming Headscale's default behavior (without an ACL policy file) allows general traffic, including port 22, between nodes—evidence leans toward this being the case for basic connectivity.

For more on standard SSH over Tailscale, see [Tailscale's general SSH guide](https://tailscale.com/kb/1193/other-services#ssh).

---

### Enabling SSH Access in a Headscale-Tailscale Setup: A Comprehensive Overview

In the context of self-hosted VPN solutions like Headscale (an open-source alternative to Tailscale's control server), enabling SSH access can involve multiple layers of configuration, from network connectivity to authentication mechanisms. This detailed survey explores the underlying issues behind the warning message—"Tailscale SSH enabled, but access controls don't allow anyone to access this device. Update your tailnet's ACLs to allow access"—and provides a thorough analysis of solutions, with a focus on avoiding file modifications as per the query constraints. We'll cover the technical architecture, default behaviors, alternative approaches, and supporting evidence from documentation and community discussions, while incorporating comparative tables for clarity.

#### Background on Tailscale SSH and Headscale Integration
Tailscale SSH is a feature that integrates SSH directly into the Tailscale client, allowing secure, key-based access using Tailscale identities rather than traditional local SSH keys or passwords.<grok:render card_id="b212a4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render> This eliminates the need for managing SSH keys on each device and ties permissions to the tailnet's access controls. However, it requires explicit rules in the tailnet policy (ACLs) to define who can connect to whom for SSH sessions.<grok:render card_id="440beb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> 

Headscale, as a self-hosted control server, replicates much of Tailscale's functionality but is managed via configuration files or CLI, without a built-in web admin console.<grok:render card_id="064291" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render> When you run `tailscale up` with `--ssh=true` on a client (e.g., your Ubuntu device), the client starts a Tailscale-managed SSH server. The control server (Headscale) then checks the ACL policy to see if any users or groups are granted SSH access to this node. If no such grants exist, the warning is displayed, as the system defaults to denying SSH access under Tailscale SSH.<grok:render card_id="20b3a2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render> 

This warning is not a fatal error—the Tailscale connection still establishes—but it indicates that Tailscale SSH won't function until ACLs are updated. The query's emphasis on avoiding file modifications (e.g., no editing of ACL policy files like `acl.hujson` or `config.yaml`) limits options, as standard resolutions involve precisely that.<grok:render card_id="81ee4f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="bd21cc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render> 

#### Default ACL Behavior in Headscale
Understanding Headscale's default policy is crucial. Unlike Tailscale, where omitting ACLs results in an "allow all" policy for general traffic,<grok:render card_id="b3b2d0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render><grok:render card_id="8ed169" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render> Headscale's behavior varies:

- If an ACL policy file is specified but empty (e.g., `{}`), it enforces a deny-all policy.<grok:render card_id="edec94" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render><grok:render card_id="9882d0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">53</argument>
</grok:render> 
- If no policy path is set in `config.yaml` (i.e., `acl_policy_path` is absent or empty), ACL enforcement appears disabled, effectively allowing all traffic between nodes in the tailnet.<grok:render card_id="4f5e99" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render><grok:render card_id="5d6e34" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">54</argument>
</grok:render> Community reports and issues confirm that basic connectivity (e.g., pings, port access) works without an ACL file, suggesting an implicit "allow all" for non-SSH-specific traffic.<grok:render card_id="35cda6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render><grok:render card_id="4f79ba" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render>

However, for Tailscale SSH, even with general traffic allowed, the feature requires dedicated "ssh" rules in the policy (e.g., `"ssh": [{"action": "accept", "users": ["*"], "ports": ["*:22"]}]`). Without these, the warning persists, as Tailscale SSH performs an additional authorization check.<grok:render card_id="f821d1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render><grok:render card_id="936dbf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>

**Table 1: Comparison of Default ACL Behaviors**

| Aspect                  | Tailscale (Official)                  | Headscale (Self-Hosted)               |
|-------------------------|---------------------------------------|---------------------------------------|
| No ACL Policy Defined  | Allow all traffic by default<grok:render card_id="1e6663" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render>         | ACLs "do not work," implying allow all for general traffic<grok:render card_id="2dcb64" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render> |
| Empty ACL Policy ({})  | Allow all traffic<grok:render card_id="05c308" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render>                    | Deny all traffic<grok:render card_id="baeb06" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render>                     |
| Impact on Tailscale SSH| Requires explicit "ssh" rules; warning if missing<grok:render card_id="c5ea0e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> | Same as Tailscale, but no built-in way to add without files/UI<grok:render card_id="59c677" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render> |
| General Traffic (e.g., Port 22) | Allowed if no deny rules            | Allowed if no policy path set<grok:render card_id="a55c87" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">54</argument>
</grok:render>         |

#### Solution Without File Modifications: Disable Tailscale SSH
Given the constraint against file changes, the most viable approach is to forgo Tailscale SSH entirely by omitting `--ssh=true` from the `tailscale up` command. This disables the managed SSH server, eliminating the ACL-dependent warning, while preserving network-level SSH access.<grok:render card_id="3bca95" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render><grok:render card_id="554ab4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render> 

- **Why This Works**: The warning is tied exclusively to Tailscale SSH. With it disabled, Tailscale reverts to tunneling traffic to your local SSH server (assuming `sshd` is running on port 22). If Headscale has no ACL policy (or it's not enforcing denies), other tailnet devices can connect via `ssh user@<tailscale-ip-or-hostname>`.<grok:render card_id="2629d0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render> 
- **Implementation Details**: Rerun the command as: `sudo tailscale up --login-server=https://headscale-server.bolabaden.org --accept-dns --shields-up=false --accept-risk=linux-strict-rp-filter`. No additional setup is needed if your local SSH is configured for remote access.
- **Allowing "Anyone" Access**: In a default Headscale setup without ACLs, "anyone" translates to any authenticated tailnet node. Connections will use local authentication, so ensure users exist on the target device.

This method aligns with community recommendations for Headscale users who prefer simplicity over Tailscale SSH's advanced auth.<grok:render card_id="118851" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render><grok:render card_id="decc7b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render>

#### Alternative Approaches and Their Limitations
While the primary solution avoids files, other options were explored for completeness:

1. **Using a Web UI like Headplane**: Headplane is a third-party web interface for Headscale that allows ACL management without direct file edits (changes are applied via the UI and Headscale's API).<grok:render card_id="2df2a9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render><grok:render card_id="0c73e5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">45</argument>
</grok:render><grok:render card_id="31bbb1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">47</argument>
</grok:render> If installed, you could add an "allow all" SSH rule (e.g., granting `*` users access to `*` nodes on port 22) through the browser. However, this assumes Headplane is already set up—installing it would involve config changes, potentially violating the no-file-mod constraint.
   
2. **CLI-Only ACL Updates**: Headscale's CLI (e.g., `headscale policy`) can validate or get policies but not set them without a file path.<grok:render card_id="61b86b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render><grok:render card_id="23298d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render> No direct command exists for inline policy updates; all lead back to editing `config.yaml` or the policy file.<grok:render card_id="3174ae" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render>

3. **Standard SSH as a Fallback**: As emphasized, this is the core recommendation. For controversial views on security, some sources note that Tailscale SSH adds overhead for small setups, and standard SSH suffices with proper key management.<grok:render card_id="85fe76" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render> Counterarguments highlight Tailscale SSH's ease for teams, but it requires ACLs.<grok:render card_id="77cf83" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>

**Table 2: Pros and Cons of SSH Methods in Headscale**

| Method               | Requires ACL/File Changes | Authentication Type          | Pros                                      | Cons                                      |
|----------------------|---------------------------|------------------------------|-------------------------------------------|-------------------------------------------|
| Tailscale SSH       | Yes<grok:render card_id="8e5b71" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>                      | Tailscale keys               | Centralized auth, no local keys needed   | Warning if no ACL; file mods required     |
| Standard SSH over Tailscale | No (if default allow all)<grok:render card_id="08a458" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render> | Local users/passwords/keys   | No warning, simple setup                  | Less integrated; manual credential sharing|
| With Headplane UI   | Indirect (via API)<grok:render card_id="46e83c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render>       | Depends on method            | User-friendly for ACL tweaks              | Requires separate install/setup           |

#### Security and Best Practices
Enabling open access ("anyone" in the tailnet) carries risks, as it assumes trust in all joined devices. Sources recommend starting with defaults and adding restrictions later.<grok:render card_id="4022de" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render> For standard SSH, harden your server by disabling password auth (`PasswordAuthentication no` in `sshd_config`) and using keys only—but this would involve file changes, so skip if adhering strictly to constraints.

In debated topics like self-hosted VPN security, evidence leans toward layered controls (e.g., ACLs for production), but for personal use, defaults are often sufficient.<grok:render card_id="920495" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render> If scaling, consider migrating to Tailscale's official service for easier ACL management via web.<grok:render card_id="3be2a8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">51</argument>
</grok:render>

#### Conclusion and Further Reading
This setup prioritizes simplicity and constraint adherence, resolving the warning by leveraging Headscale's default allowances for standard SSH. For advanced users, exploring UIs like Headplane could bridge the gap without manual edits. Always test connectivity post-changes and monitor logs for issues.

### Key Citations
- [Manage permissions using ACLs · Tailscale Docs](https://tailscale.com/kb/1018/acls)<grok:render card_id="486455" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [ACLs - Headscale](https://headscale.net/stable/ref/acls/)<grok:render card_id="ddb556" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>
- [Unable to ssh with tailscale #1303 - juanfont/headscale](https://github.com/juanfont/headscale/issues/1303)<grok:render card_id="6a92a8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render>
- [Headscale & Tailscale - Lucas Janin](https://www.lucasjanin.com/2025/01/03/headscale-tailscale-in-a-self-hosted-environment/)<grok:render card_id="e818ea" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
- [Tailscale SSH - Hacker News](https://news.ycombinator.com/item?id=31837115)<grok:render card_id="6af727" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render>
- [Setting Up Headscale and Tailscale for Secure Private Networking](https://dev.to/shubhamkcloud/setting-up-headscale-and-tailscale-for-secure-private-networking-a-step-by-step-guide-2mo6)<grok:render card_id="8138e4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render>
- [Simplify and Secure SSH Connections on Your Tailnet - Tailscale SSH](https://tailscale.com/blog/tailscale-ssh)<grok:render card_id="728dc2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>
- [Is It Time For You to Set Up Tailscale ACLs?](https://blog.patshead.com/2022/10/is-it-time-for-you-to-set-up-tailscale-acls.html)<grok:render card_id="7cb0f6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render>
- [Headscale ACL configuration](https://lab.allmende.io/-/snippets/440)<grok:render card_id="8a5e77" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>
- [I am Using Tailscale SSH, and Maybe You Should Too!](https://blog.patshead.com/2022/06/i-am-using-tailscale-ssh-and-maybe-you-should-too.html)<grok:render card_id="82adad" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render>
- [GitHub - juanfont/headscale](https://github.com/juanfont/headscale)<grok:render card_id="492dcb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render>
- [SSH 'Permission denied (tailscale).'](https://www.reddit.com/r/Tailscale/comments/18phii4/ssh_permission_denied_tailscale/)<grok:render card_id="eaf595" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render>
- [ACL policy examples · Tailscale Docs](https://tailscale.com/kb/1192/acl-samples)<grok:render card_id="43068d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render>
- [[Bug] Default ACLs differ from headscale · Issue #2672](https://github.com/juanfont/headscale/issues/2672)<grok:render card_id="c3150b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render>
- [Beginners Guide to Tailscale ACLs in Headscale](https://www.geekythings.me/?p=213)<grok:render card_id="744755" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render>
- [Manage permissions using ACLs · Tailscale Docs](https://tailscale.com/kb/1018/acls)<grok:render card_id="de6bff" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render>
- [[Bug] ACL policy not working after update to v23.0 beta1 · Issue #2024](https://github.com/juanfont/headscale/issues/2024)<grok:render card_id="73072e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>
- [Headscale & Tailscale - Lucas Janin](https://www.lucasjanin.com/2025/01/03/headscale-tailscale-in-a-self-hosted-environment/)<grok:render card_id="0e6d74" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render>
- [Headscale Deployment and Usage Guide](https://icloudnative.io/en/posts/how-to-set-up-or-migrate-headscale/)<grok:render card_id="bc7102" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render>
- [ACLs - Headscale](https://headscale.net/stable/ref/acls/)<grok:render card_id="5b12f3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render>
- [[Feature] Headscale policy set validate ACL before applying? #2044](https://github.com/juanfont/headscale/issues/2044)<grok:render card_id="b79b02" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render>
- [tale/headplane: A feature-complete Web UI for Headscale](https://github.com/tale/headplane)<grok:render card_id="cc2641" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render>
- [Headscale & Tailscale - Lucas Janin](https://www.lucasjanin.com/2025/01/03/headscale-tailscale-in-a-self-hosted-environment/)<grok:render card_id="62e7ce" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">45</argument>
</grok:render>
- [Headscale-Admin now with ACL Management!](https://www.reddit.com/r/headscale/comments/1i049cj/headscaleadmin_now_with_acl_management/)<grok:render card_id="bdabd9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">47</argument>
</grok:render>
- [Manage permissions using ACLs · Tailscale Docs](https://tailscale.com/kb/1018/acls)<grok:render card_id="f4c483" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">51</argument>
</grok:render>
- [[Bug] Default ACLs differ from headscale · Issue #2672 · juanfont/headscale](https://github.com/juanfont/headscale/issues/2672)<grok:render card_id="2ac7d7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">53</argument>
</grok:render>
- [[Bug] ACL policy not working after update to v23.0 beta1 · Issue #2024 · juanfont/headscale](https://github.com/juanfont/headscale/issues/2024)<grok:render card_id="84d906" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">54</argument>
</grok:render>

## Assistant

_Time: 2025-08-24T00:58:53.839Z_

### Key Points
- **Tailscale SSH requires ACL configuration**: The warning appears because Tailscale SSH (--ssh=true) needs explicit access rules in your tailnet's policy to allow connections; without them, no one can access the device via this feature.
- **Alternative without ACLs or file changes**: Disable Tailscale SSH by removing the --ssh=true flag from your `tailscale up` command. This eliminates the warning and allows standard SSH access over the Tailscale network using your device's local SSH server.
- **Default behavior supports access**: In Headscale setups without a configured ACL policy file, traffic between nodes, including on port 22 (SSH), is generally allowed by default, enabling basic connectivity.
- **Limitations and trade-offs**: This approach uses local authentication (e.g., passwords or SSH keys) instead of Tailscale's identity-based auth, which may be sufficient if you just need simple SSH access from other tailnet devices.
- **No file modifications needed**: This solution avoids editing any configuration or policy files, aligning with your preference.

### How to Implement
Run the modified command without `--ssh=true`:

```
sudo tailscale up --login-server=https://headscale-server.bolabaden.org --accept-dns --shields-up=false --accept-risk=linux-strict-rp-filter
```

This connects your device to the tailnet without enabling Tailscale SSH, avoiding the warning. Ensure your local SSH server is running (e.g., via `sudo systemctl status ssh` on Ubuntu) and configured to accept connections—by default, it listens on all interfaces, including the Tailscale IP.

### Verification Steps
1. After running the command, confirm the connection with `tailscale status`.
2. From another device in the tailnet, attempt SSH using `ssh user@your-device-hostname.ts.net` (replace with your actual hostname or Tailscale IP from `tailscale ip -4`).
3. If access fails, check firewall rules (e.g., `ufw allow 22`) or local SSH config, but no Tailscale-specific changes are needed.

### Potential Drawbacks
Standard SSH relies on your device's local security settings, so ensure strong passwords or key-based auth to prevent unauthorized access. If you later need Tailscale's managed SSH (e.g., for keyless access based on tailnet users), ACL configuration would be required, but that's outside your specified constraints.

---

The warning you encountered stems from enabling Tailscale SSH (--ssh=true) in a Headscale environment where the access control lists (ACLs) do not explicitly permit any users to connect to the device. Tailscale SSH is an advanced feature that integrates SSH authentication directly with Tailscale identities, allowing seamless, keyless access based on tailnet membership rather than local accounts. However, it strictly depends on ACL rules to define who can connect to what, following a deny-by-default principle. Without appropriate rules, the system issues this warning to indicate that while the feature is activated, no access is actually granted.

In Headscale, an open-source, self-hosted alternative to Tailscale's control server, ACLs are typically managed through a policy file (often in HuJSON or YAML format) pointed to in the server's `config.yaml`. This file defines groups, tags, and rules for network access, including specific sections for SSH. For instance, a basic rule to allow all tailnet members to SSH might look like:

```json
{
  "ssh": [
    {
      "action": "accept",
      "users": ["autogroup:members"],
      "sshusers": ["*"]
    }
  ]
}
```

However, implementing this would require creating or editing the policy file on the Headscale server and restarting or reloading the service (e.g., via `headscale serve` or a HUP signal), which directly contradicts your requirement to avoid file modifications. Research into Headscale's configuration confirms that ACL management is file-based by default, with no built-in CLI commands to dynamically set or update policies without touching files. For example, while the `headscale` CLI offers commands like `headscale policy get` to view policies, there are no equivalents for inline editing or temporary overrides.

Given this constraint, the most straightforward resolution is to disable Tailscale SSH entirely by omitting the `--ssh=true` flag from your `tailscale up` command. This reverts to using your device's standard SSH server (sshd on Ubuntu) for connections over the Tailscale network. The warning disappears because Tailscale SSH is no longer attempted, and access becomes possible via conventional means. Importantly, in Headscale setups without an explicitly configured ACL policy file (i.e., `policy.path` is empty or unset in `config.yaml`), the default behavior allows all traffic between connected nodes, including on port 22. This mirrors Tailscale's default "allow all" policy when no ACLs are defined, though Headscale can differ in edge cases like empty policies enforcing deny-all.

To elaborate on the default behavior: If no policy file is loaded, Headscale does not enforce restrictions, enabling nodes to communicate freely. This is evidenced by user reports and issues where, without a policy path, "ACLs do not work at all," interpreted as no access denials occurring. However, for Tailscale SSH specifically, the absence of rules triggers the warning and blocks functionality, as the feature requires explicit "ssh" declarations in the policy to authorize connections.

#### Step-by-Step Implementation Without File Changes
1. **Modify and Run the Command**: Use your original command but remove `--ssh=true`:
   ```
   sudo tailscale up --login-server=https://headscale-server.bolabaden.org --accept-dns --shields-up=false --accept-risk=linux-strict-rp-filter
   ```
   This authenticates and joins the tailnet without activating Tailscale SSH.

2. **Ensure Local SSH is Ready**: On Ubuntu, the SSH server is usually installed and enabled by default. Verify with:
   - `sudo systemctl status ssh` (start if needed: `sudo systemctl start ssh`).
   - Allow port 22 in the firewall: `sudo ufw allow 22` (if UFW is active).
   - No Tailscale-specific configs are needed; sshd listens on the Tailscale interface automatically.

3. **Test Access**: From another tailnet device (e.g., your laptop also connected via Tailscale):
   - Find the target's Tailscale IP: `tailscale ip` on the Ubuntu machine.
   - Connect: `ssh ubuntu@<tailscale-ip>` or `ssh ubuntu@beatapostapita.ts.net` (assuming your tailnet name).
   - Authenticate using local credentials (password or pre-authorized SSH keys).

This setup allows "anyone" in the tailnet—meaning any authenticated device—to attempt SSH connections, succeeding based on local auth. It doesn't expose your device publicly, as traffic stays within the encrypted Tailscale mesh.

#### Comparison of SSH Options in Headscale/Tailscale
To provide clarity on why this fits your needs, here's a table comparing Tailscale SSH vs. standard SSH over Tailscale:

| Aspect                  | Tailscale SSH (--ssh=true)                  | Standard SSH (no --ssh=true)                |
|-------------------------|---------------------------------------------|---------------------------------------------|
| **Authentication**     | Tailscale identities (no local keys needed) | Local users/passwords/SSH keys              |
| **ACL Dependency**     | Required; warning if not configured         | Not required; uses default network access   |
| **File Modification**  | Yes, for ACL policy on server               | No                                          |
| **Access Control**     | Granular via tailnet rules                  | Managed locally (e.g., /etc/ssh/sshd_config)|
| **Setup Complexity**   | Higher (needs policy updates)               | Lower (uses existing sshd)                  |
| **Warning Triggered**  | Yes, if ACLs insufficient                   | No                                          |
| **Suitability Here**   | Not ideal due to file/ACL constraints       | Ideal for simple enablement without changes |

#### Potential Enhancements and Considerations
If your Headscale server has a web UI like Headplane (a companion tool for Headscale), you could theoretically manage ACLs through a graphical interface without manual file edits—Headplane includes an ACL editor that updates policies via API calls to Headscale (supported in v0.23+ with database mode). However, setting up Headplane involves additional configuration (e.g., Docker or direct install), which might indirectly require file changes unless already deployed. If not, stick to the no-flag approach.

Be aware of security implications: Standard SSH opens access to anyone in the tailnet who knows valid local credentials, so disable password auth if possible (`PasswordAuthentication no` in sshd_config—but that would involve file modification, so avoid if strict). Also, the `--shields-up=false` in your command already disables some protections, aligning with open access.

#### Advanced Notes on Headscale Defaults and Compatibility
Headscale's ACL handling aims for parity with Tailscale but has nuances. For empty policies (`{}`), Headscale applies deny-all, unlike Tailscale's allow-all. But with no policy path set, enforcement is absent, permitting traffic. This is consistent across user experiences in setups where initial connections succeed without ACLs. For controversial aspects like security defaults, counter-views suggest explicit policies for safety, but evidence leans toward allow-all when unconfigured, prioritizing usability in self-hosted environments.

If this doesn't fully meet your needs (e.g., you specifically want Tailscale-managed auth), the only path forward involves ACL setup, potentially via UI tools to minimize direct file handling. Otherwise, the proposed solution provides reliable SSH enablement without any file interactions.

**Key Citations:**
- [Manage permissions using ACLs · Tailscale Docs](https://tailscale.com/kb/1018/acls)<grok:render card_id="198fe0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [ACLs - Headscale](https://headscale.net/stable/ref/acls/)<grok:render card_id="96f5d8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>
- [Beginners Guide to Tailscale ACLs in Headscale - GeekyThings](https://www.geekythings.me/?p=213)<grok:render card_id="25d40f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- [ACL policy examples · Tailscale Docs](https://tailscale.com/kb/1192/acl-samples)<grok:render card_id="d894b0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>
- [Unable to ssh with tailscale #1303 - juanfont/headscale - GitHub](https://github.com/juanfont/headscale/issues/1303)<grok:render card_id="818582" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render>
- [Headscale & Tailscale - Lucas Janin](https://www.lucasjanin.com/2025/01/03/headscale-tailscale-in-a-self-hosted-environment/)<grok:render card_id="0834b4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
- [[Bug] Default ACLs differ from headscale · Issue #2672](https://github.com/juanfont/headscale/issues/2672)<grok:render card_id="480bcb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render>
- [[Bug] ACL policy not working after update to v23.0 beta1 · Issue #2024](https://github.com/juanfont/headscale/issues/2024)<grok:render card_id="b9ecb6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>
- [tale/headplane: A feature-complete Web UI for Headscale - GitHub](https://github.com/tale/headplane)<grok:render card_id="84a0b5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render>
- [Headscale-Admin now with ACL Management! - Reddit](https://www.reddit.com/r/headscale/comments/1i049cj/headscaleadmin_now_with_acl_management/)<grok:render card_id="68359c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">47</argument>
</grok:render>
