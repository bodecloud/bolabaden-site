---
source_url: "https://grok.com/c/31fc2882-d234-4248-a158-240a004a8f60"
conversation_id: "31fc2882-d234-4248-a158-240a004a8f60"
title: "K3s Cluster Token Retrieval"
extracted_at: "2026-06-29T16:26:50.922Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# K3s Cluster Token Retrieval

Source: [Grok conversation](https://grok.com/c/31fc2882-d234-4248-a158-240a004a8f60)

## User

_Time: 2025-06-14T14:28:28.456Z_

how to get the K3S_TOKEN from the master server terminal?

## Assistant

_Time: 2025-06-14T14:28:36.373Z_

To get the `K3S_TOKEN` from the master server in a K3s cluster, follow these steps:

1. **Access the Master Server Terminal**: Log in to the master node where K3s is installed, typically via SSH.

2. **Retrieve the Token**: The `K3S_TOKEN` is stored in a file on the master node. Run the following command to display it:

   ```bash
   sudo cat /var/lib/rancher/k3s/server/node-token
   ```

3. **Output**: The command will output the token, which typically starts with `K10` followed by a long string, like:

   ```
   K10xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx::server:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Use the Token**: Copy the entire token. This is used when joining worker nodes to the cluster with a command like:

   ```bash
   curl -sfL https://get.k3s.io | K3S_URL=https://<master-ip>:6443 K3S_TOKEN=<token> sh -
   ```

**Notes**:
- You need `sudo` or root privileges to access the token file.
- The token is sensitive, so handle it securely and avoid exposing it publicly.
- If the file is not found, ensure K3s is properly installed and running on the master node (`sudo systemctl status k3s`).

If you encounter issues, let me know!
