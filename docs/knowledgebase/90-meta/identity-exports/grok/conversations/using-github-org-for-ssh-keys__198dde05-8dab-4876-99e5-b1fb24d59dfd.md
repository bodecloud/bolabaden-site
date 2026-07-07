---
source_url: "https://grok.com/c/198dde05-8dab-4876-99e5-b1fb24d59dfd"
conversation_id: "198dde05-8dab-4876-99e5-b1fb24d59dfd"
title: "Using GitHub Org for SSH Keys"
extracted_at: "2026-06-29T16:20:23.152Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Using GitHub Org for SSH Keys

Source: [Grok conversation](https://grok.com/c/198dde05-8dab-4876-99e5-b1fb24d59dfd)

## User

_Time: 2025-09-17T14:53:49.664Z_

```\
4. Add to GitHub:\
Go to https://github.com/settings/keys\
Click "New SSH key"\
Paste your public key content\
Give it a descriptive title (e.g., "Homelab Ansible")\
Click "Add SSH key"\
```\
Doesn't work for orgs. How to use free features only of orgs to make my bolabaden org have a .keys and upload the id_rsa.pub accordingly?

## Assistant

_Time: 2025-09-17T14:54:09.287Z_



## User

_Time: 2025-09-17T14:54:48.057Z_

```\
4. Add to GitHub:\
Go to https://github.com/settings/keys\
Click "New SSH key"\
Paste your public key content\
Give it a descriptive title (e.g., "Homelab Ansible")\
Click "Add SSH key"\
```\
Doesn't work for orgs. How to use free features only of orgs to make my bolabaden org have a .keys and upload the id_rsa.pub accordingly?

intended for this ansible all.yml:
```
---
ansible_user: admin
ansible_password: REPLACE_WITH_YOUR_PASSWORD_HASH
ansible_ssh_private_key_file: ~/.ssh/id_ed25519
ssh_public_key: "{{ lookup('file', '~/.ssh/id_ed25519.pub') }}"
dns_server_1: "127.0.0.1"
dns_server_2: "1.1.1.1"
dhcp_proxy: true
host_key_checking: false
username: admin
github_ssh_key_url: "https://github.com/bolabaden.keys"
network_gateway: "10.0.1.1"
network_netmask: "255.255.255.0"
vlan_id: 10
vlan_interface: "{{ network_interface }}.{{ vlan_id }}"
```

## Assistant

_Time: 2025-09-17T14:55:14.092Z_



## User

_Time: 2025-09-17T14:55:54.858Z_

```\
4. Add to GitHub:\
Go to https://github.com/settings/keys\
Click "New SSH key"\
Paste your public key content\
Give it a descriptive title (e.g., "Homelab Ansible")\
Click "Add SSH key"\
```\
Doesn't work for orgs. How to use free features only of orgs to make my bolabaden org have a .keys and upload the id_rsa.pub accordingly?

intended for this ansible all.yml:
```
---
ansible_user: admin
ansible_password: REPLACE_WITH_YOUR_PASSWORD_HASH
ansible_ssh_private_key_file: ~/.ssh/id_ed25519
ssh_public_key: "{{ lookup('file', '~/.ssh/id_ed25519.pub') }}"
dns_server_1: "127.0.0.1"
dns_server_2: "1.1.1.1"
dhcp_proxy: true
host_key_checking: false
username: admin
github_ssh_key_url: "https://github.com/bolabaden.keys"
network_gateway: "10.0.1.1"
network_netmask: "255.255.255.0"
vlan_id: 10
vlan_interface: "{{ network_interface }}.{{ vlan_id }}"
```

your solutoin must correctly use non-enterprise github org ssh keys for compatibility with github_ssh_key_url field of ansible. Do NOT provide solutions that tell me to use a personal account

## Assistant

_Time: 2025-09-17T14:59:41.588Z_

### Key Points
- GitHub does not provide a `.keys` endpoint for free organizations, as this feature is reserved for user accounts; attempts to access `https://github.com/bolabaden.keys` will fail or return no content.
- Organization-level SSH key management, such as through SSH Certificate Authorities, requires a paid GitHub Enterprise plan, which contradicts your requirement for free features only.
- A practical workaround using free organization features is to host your public key (e.g., `id_ed25519.pub`) in a repository under the `bolabaden` organization and reference its raw GitHub URL in your Ansible `github_ssh_key_url` field—it seems likely this will achieve compatibility without enterprise tools or personal accounts.
- This approach ensures the key is associated with the organization while avoiding any personal user dependencies, though it doesn't create a literal `.keys` endpoint.

### Steps to Implement the Workaround
1. Log in to GitHub and navigate to your `bolabaden` organization.
2. Create a new repository (e.g., named "ssh-keys")—make it public if the key is intended for open access, or private if restricted (free plans support both).
3. Upload your public key file (e.g., copy the content of `~/.ssh/id_ed25519.pub` into a new file in the repo, named `id_ed25519.pub`).
4. Commit and push the file to the main branch.
5. Obtain the raw URL: Right-click the file in the repo view, select "View raw," and copy the URL (e.g., `https://raw.githubusercontent.com/bolabaden/ssh-keys/main/id_ed25519.pub`).
6. Update your Ansible `all.yml` file to set `github_ssh_key_url` to this raw URL.
7. Test the Ansible playbook to confirm it fetches the key correctly for authorization.

### Potential Limitations
This method relies on GitHub's raw file serving, which is reliable for static content but may require the repository to remain accessible. If the key changes, you'll need to update the file in the repo. For security, consider using a private repo if the key shouldn't be publicly exposed, though fetching from private repos may require authentication in Ansible (e.g., via a token, but avoid personal accounts by using an app installation if needed).

---

GitHub provides distinct functionalities for user accounts and organizations, particularly when it comes to SSH key management. For individual users, GitHub offers a straightforward way to upload SSH public keys via the settings page at `https://github.com/settings/keys`, and these keys can be retrieved programmatically through the `.keys` endpoint, such as `https://github.com/username.keys`. This endpoint returns a plain-text list of the user's public SSH keys, making it convenient for automation tools like Ansible to fetch and authorize them on remote systems.<grok:render card_id="5565d0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render> In your Ansible `all.yml` configuration, the `github_ssh_key_url` field appears designed to leverage this type of endpoint to dynamically pull a public key, likely for adding it to an `authorized_keys` file on a target host during playbook execution.

However, this `.keys` endpoint is exclusively available for user profiles and does not extend to organizations in any GitHub plan, including free ones. When attempting to access a similar URL for an organization (e.g., `https://github.com/bolabaden.keys`), GitHub typically returns a 404 error or empty content, as organizations lack direct SSH key attachments.<grok:render card_id="bc3119" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> This limitation stems from how GitHub structures authentication: organizations manage access through member users, repository-specific deploy keys, or advanced features reserved for paid plans. Free organizations can create repositories, invite members, and set permissions, but they do not support native SSH key storage at the organization level.

Regarding SSH Certificate Authorities (CAs), which allow organizations to issue and manage signed SSH keys for members, this feature is explicitly tied to GitHub Enterprise Cloud or Server editions.<grok:render card_id="df86c3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render> Enterprise plans enable admins to add an SSH CA via the organization settings, where you can upload a CA public key, and members can then use certificates signed by that CA for repository access.<grok:render card_id="4c5533" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render> Documentation consistently marks this as an Enterprise-only capability, with no equivalent in free or Team plans.<grok:render card_id="a1c69d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render> For instance, the feature was announced specifically for Enterprise Cloud to enhance security in large-scale environments.<grok:render card_id="42b8bf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render> If your organization were upgraded to Enterprise, you could follow steps like navigating to organization settings, selecting "SSH Certificate Authorities," and adding your CA— but this violates your free-features-only constraint.

Given these restrictions, directly replicating a `.keys` endpoint for your `bolabaden` organization isn't feasible without enterprise upgrades. Access to organization repositories via SSH relies on the SSH keys of individual member users or deploy keys tied to specific repositories.<grok:render card_id="0abbdf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render> Deploy keys, for example, are SSH keys that grant read/write access to a single repository and are added via the repo's settings under "Deploy keys."<grok:render card_id="01b547" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render> However, deploy keys do not generate a `.keys`-style endpoint; they are internal to the repo and not fetchable via a public URL in the same way.

To align with your requirements—using only free organization features, avoiding personal accounts, and maintaining compatibility with the `github_ssh_key_url` in Ansible—a recommended approach is to host the public key as a file within a repository owned by the `bolabaden` organization. This leverages GitHub's free repository hosting and raw file serving, which provides a stable URL for content retrieval. Here's a detailed breakdown:

First, ensure your public key is ready (e.g., `id_ed25519.pub` from your `~/.ssh/` directory). Create a new repository in the organization via the GitHub web interface or API (free for unlimited public/private repos). Name it descriptively, such as "public-ssh-keys," to clearly indicate its purpose. Add the public key file by creating a new file in the repo, pasting the key content, and committing it to the default branch (usually `main`).

The raw URL for the file can then be used directly in Ansible. For example, if the file is `id_ed25519.pub` in the `main` branch, the URL would be `https://raw.githubusercontent.com/bolabaden/public-ssh-keys/main/id_ed25519.pub`. This endpoint serves the file's plain-text content, mimicking the behavior of the user `.keys` endpoint but customized to your needs.<grok:render card_id="e9b75c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render> In your `all.yml`, simply update `github_ssh_key_url` to this value. During playbook runs, Ansible's lookup or uri modules can fetch it seamlessly, as raw GitHub URLs are accessible without authentication for public repos.

For added security in free plans, make the repository private if the key shouldn't be world-readable—though this may require Ansible to authenticate via a GitHub App or token generated at the organization level (free apps are supported for orgs).<grok:render card_id="4c4c42" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">46</argument>
</grok:render> If multiple keys are needed, structure the repo with a directory or multiple files, and adjust URLs accordingly.

To illustrate the differences in SSH key management options across GitHub plans, consider the following table:

| Feature | Free Organization | Team Plan | Enterprise Plan |
|---------|-------------------|-----------|-----------------|
| User-level SSH keys and `.keys` endpoint | Available (via members) | Available (via members) | Available (via members) |
| Repository deploy keys | Available (per repo) | Available (per repo) | Available (per repo) |
| Organization SSH Certificate Authorities | Not available | Not available | Available |
| Raw file URLs for hosted keys | Available (via repos) | Available (via repos) | Available (via repos) |
| SAML/SSO integration for keys | Limited | Available | Advanced with CA support |

This table highlights why the repository-hosted approach is the most suitable for free setups.<grok:render card_id="a8b9dd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">57</argument>
</grok:render> It's worth noting that while this workaround doesn't create an exact `.keys` endpoint, it fulfills the functional need for a fetchable URL tied to the organization. If your Ansible playbook strictly expects a multi-key format (like `.keys` often returns multiple lines), you can host a file containing concatenated keys.

In practice, many open-source projects and free organizations use this repo-based method for sharing public keys, as it's simple, version-controlled, and doesn't incur costs.<grok:render card_id="492741" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render> If future GitHub updates introduce free org-level keys (unlikely based on current trends), revisiting this would be advisable. For now, this ensures compatibility without compromising your constraints.

### Key Citations
- [Managing your organization's SSH certificate authorities - GitHub Docs](https://docs.github.com/enterprise-cloud%40latest/organizations/managing-git-access-to-your-organizations-repositories/managing-your-organizations-ssh-certificate-authorities)<grok:render card_id="43f23f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [GitHub organization access via ssh key - Stack Overflow](https://stackoverflow.com/questions/21395603/github-organization-access-via-ssh-key)<grok:render card_id="1afcfd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>
- [Managing deploy keys - GitHub Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys)<grok:render card_id="43ccc9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- [Managing your organization's SSH certificate authorities - GitHub Docs](https://docs.github.com/enterprise-cloud%40latest/organizations/managing-git-access-to-your-organizations-repositories/managing-your-organizations-ssh-certificate-authorities)<grok:render card_id="a57b3d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render>
- [GitHub organization access via ssh key - Stack Overflow](https://stackoverflow.com/questions/21395603/github-organization-access-via-ssh-key)<grok:render card_id="9aae8c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>
- [SSH certificate authentication for GitHub Enterprise Cloud](https://github.blog/engineering/platform-security/ssh-certificate-authentication-for-github-enterprise-cloud/)<grok:render card_id="fd0971" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render>
- [About SSH - GitHub Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/about-ssh)<grok:render card_id="caf825" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render>
- [GitHub organization access via ssh key - Stack Overflow](https://stackoverflow.com/questions/21395603/github-organization-access-via-ssh-key)<grok:render card_id="aa73ea" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">40</argument>
</grok:render>
- [Adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)<grok:render card_id="033826" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render>
- [Managing deploy keys - GitHub Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys)<grok:render card_id="90c103" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">46</argument>
</grok:render>
- [How To Set Up And Manage Multiple GitHub Accounts - GitProtect.io](https://gitprotect.io/blog/how-to-set-up-and-manage-multiple-github-accounts/)<grok:render card_id="0e4af8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render>
- [GitHub organization access via ssh key - Stack Overflow](https://stackoverflow.com/questions/21395603/github-organization-access-via-ssh-key)<grok:render card_id="ffb2b8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">57</argument>
</grok:render>
