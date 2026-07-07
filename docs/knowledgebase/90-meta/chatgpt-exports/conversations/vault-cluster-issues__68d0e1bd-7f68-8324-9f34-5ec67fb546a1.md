---
source_url: "https://chatgpt.com/c/68d0e1bd-7f68-8324-9f34-5ec67fb546a1"
conversation_id: "68d0e1bd-7f68-8324-9f34-5ec67fb546a1"
title: "Vault cluster issues"
extracted_at: "2026-06-29T12:08:25.222Z"
message_count: 5
provenance: auth-ui
---

# Vault cluster issues

Source: [ChatGPT conversation](https://chatgpt.com/c/68d0e1bd-7f68-8324-9f34-5ec67fb546a1)

## Assistant

Perfect 👍 — let’s make this easy to repeat across your cluster.
Here’s an Ansible playbook you can drop into your repo (e.g. vault_ha_fix.yml). It will:

Normalize /etc/vault.d/vault_main.hcl on all nodes

Restart Vault

Unseal with your one unseal key

Run vault operator raft list-peers from the leader

YAML
---
- name: Fix Vault HA config and cluster
  hosts: nomad_cluster
  become: true
  vars:
    vault_config_file: /etc/vault.d/vault_main.hcl
    vault_data_path: /opt/vault/data
    unseal_key: "BIE3Y7/X6TP9G129AhMsE3YH+c2SRRhodhXO+7obUZU="
    vault_cert_dir: /etc/vault.d
  tasks:
    - name: Ensure Vault config directory exists
      file:
        path: "{{ vault_cert_dir }}"
        state: directory
        mode: "0755"

    - name: Deploy cleaned Vault config
      copy:
        dest: "{{ vault_config_file }}"
        mode: "0640"
        owner: vault
        group: vault
        content: |
          ui = true
          disable_mlock = true

          storage "raft" {
            path    = "{{ vault_data_path }}"
            node_id = "{{ inventory_hostname }}"

            {% for host in groups['nomad_cluster'] %}
            {% if host != inventory_hostname %}
            retry_join {
              leader_api_addr = "https://{{ hostvars[host].ansible_host }}:8200"
              leader_ca_cert_file = "{{ vault_cert_dir }}/ca.crt"
              leader_client_cert_file = "{{ vault_cert_dir }}/{{ inventory_hostname }}.crt"
              leader_client_key_file  = "{{ vault_cert_dir }}/{{ inventory_hostname }}.key"
            }
            {% endif %}
            {% endfor %}
          }

          listener "tcp" {
            address            = "0.0.0.0:8200"
            tls_cert_file      = "{{ vault_cert_dir }}/{{ inventory_hostname }}.crt"
            tls_key_file       = "{{ vault_cert_dir }}/{{ inventory_hostname }}.key"
            tls_client_ca_file = "{{ vault_cert_dir }}/ca.crt"
            tls_require_and_verify_client_cert = false
          }

          api_addr     = "https://{{ ansible_host }}:8200"
          cluster_addr = "https://{{ ansible_host }}:8201"

    - name: Restart Vault
      service:
        name: vault
        state: restarted

    - name: Wait for Vault to start listening
      wait_for:
        host: "{{ ansible_host }}"
        port: 8200
        timeout: 30

    - name: Unseal Vault
      shell: >
        VAULT_ADDR=https://{{ ansible_host }}:8200
        VAULT_SKIP_VERIFY=true
        vault operator unseal {{ unseal_key }}
      register: unseal_out
      changed_when: "'Sealed' in unseal_out.stdout"

- name: Show raft peers from leader
  hosts: micklethefickle
  become: true
  tasks:
    - name: Run raft list-peers
      shell: >
        VAULT_ADDR=https://{{ ansible_host }}:8200
        VAULT_SKIP_VERIFY=true
        VAULT_TOKEN={{ lookup('env','VAULT_TOKEN') }}
        vault operator raft list-peers
      register: raft_peers

    - debug:
        var: raft_peers.stdout
How to run

Save as vault_ha_fix.yml

Run with:

Bash
ansible-playbook -i hosts.yml vault_ha_fix.yml

(make sure you have VAULT_TOKEN exported in your shell so the raft list-peers check works)

Notes

Replace unseal_key with your real one.

This assumes each node has its own TLS cert/key pair named after its hostname (e.g. micklethefickle.crt, micklethefickle.key).

It sets node_id equal to inventory_hostname so Raft peers are uniquely identified.

After running, you’ll still need to promote voters (vault operator raft add-voter) — I didn’t bake that into Ansible yet because you may want to choose which nodes become voters (usually 3 or 5).

👉 Do you want me to extend this playbook so it also automatically promotes a set of nodes as voters (so quorum is guaranteed without manual steps)?

## User

$ ansible micklethefickle -i hosts.yml -m shell -a "cat /etc/vault.d/vault_main.hcl" --become
micklethefickle | CHANGED | rc=0 >>
ui = true
disable_mlock = true

storage "raft" {
  path    = "/opt/vault/data"
  node_id = "micklethefickle"
  retry_join {
    leader_api_addr = "https://100.111.132.16:8200"
    leader_ca_cert_file = "/etc/vault.d/ca.crt"
    leader_client_cert_file = "/etc/vault.d/micklethefickle.crt"
    leader_client_key_file = "/etc/vault.d/micklethefickle.key"
  }
  retry_join {
    leader_api_addr = "https://100.94.174.206:8200"
    leader_tls_servername = "arnialtrashlid.bolabaden.org"
    leader_ca_cert_file = "/etc/vault.d/ca.crt"
    leader_client_cert_file = "/etc/vault.d/micklethefickle.crt"
    leader_client_key_file = "/etc/vault.d/micklethefickle.key"
  }
  retry_join {
    leader_api_addr = "https://100.94.174.206:8200"
    leader_tls_servername = "arnialtrashlid.bolabaden.org"
    leader_ca_cert_file = "/etc/vault.d/ca.crt"
    leader_client_cert_file = "/etc/vault.d/micklethefickle.crt"
    leader_client_key_file = "/etc/vault.d/micklethefickle.key"
  }
  retry_join {
    leader_api_addr = "https://100.108.164.175:8200"
    leader_tls_servername = "cloudserver1.bolabaden.org"
    leader_ca_cert_file = "/etc/vault.d/ca.crt"
    leader_client_cert_file = "/etc/vault.d/micklethefickle.crt"
    leader_client_key_file = "/etc/vault.d/micklethefickle.key"
  }
  retry_join {
    leader_api_addr = "https://100.89.18.76:8200"
    leader_tls_servername = "cloudserver2.bolabaden.org"
    leader_ca_cert_file = "/etc/vault.d/ca.crt"
    leader_client_cert_file = "/etc/vault.d/micklethefickle.crt"
    leader_client_key_file = "/etc/vault.d/micklethefickle.key"
  }
  retry_join {
    leader_api_addr = "https://100.93.153.182:8200"
    leader_tls_servername = "cloudserver3.bolabaden.org"
    leader_ca_cert_file = "/etc/vault.d/ca.crt"
    leader_client_cert_file = "/etc/vault.d/micklethefickle.crt"
    leader_client_key_file = "/etc/vault.d/micklethefickle.key"
  }
}

listener "tcp" {
  address            = "0.0.0.0:8200"
  tls_cert_file      = "/etc/vault.d/micklethefickle.crt"
  tls_key_file       = "/etc/vault.d/micklethefickle.key"
  tls_client_ca_file = "/etc/vault.d/ca.crt"
  tls_require_and_verify_client_cert = false
}


api_addr = "https://100.98.182.207:8200"
cluster_addr = "https://100.98.182.207:8201"  # "https://100.98.182.207:8201"
$ cd /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab
$ cd /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab && ansible nomad_cluster -i hosts.yml -m shell -a "ls -la /etc/vault.d/*.crt | head -3" --become
vractormania | CHANGED | rc=0 >>
-rw-r--r-- 1 vault vault 1614 Sep 20 22:17 /etc/vault.d/arnialtrashlid.crt
-rw-r--r-- 1 vault vault 1826 Sep 20 22:17 /etc/vault.d/ca.crt
-rw-r--r-- 1 vault vault 1606 Sep 20 22:17 /etc/vault.d/vractormania.crt
arnialtrashlid | CHANGED | rc=0 >>
-rw-r--r-- 1 vault vault 1614 Sep 20 22:17 /etc/vault.d/arnialtrashlid.crt
-rw-r--r-- 1 vault vault 1826 Sep 20 22:17 /etc/vault.d/ca.crt
-rw-r--r-- 1 vault vault 1606 Sep 20 22:17 /etc/vault.d/vractormania.crt
beatapostapita | CHANGED | rc=0 >>
-rw-r--r-- 1 vault vault 1610 Sep 20 22:17 /etc/vault.d/beatapostapita.crt
-rw-r--r-- 1 vault vault 1826 Sep 20 22:17 /etc/vault.d/ca.crt
micklethefickle | CHANGED | rc=0 >>
-rw-r--r-- 1 vault vault 1826 Sep 21 03:17 /etc/vault.d/ca.crt
-rw-r--r-- 1 vault vault 1619 Sep 21 03:17 /etc/vault.d/micklethefickle.crt
cloudserver1 | CHANGED | rc=0 >>
-rw-r--r-- 1 vault vault 1826 Sep 20 23:17 /etc/vault.d/ca.crt
-rw-r--r-- 1 vault vault 1606 Sep 20 23:17 /etc/vault.d/cloudserver1.crt
cloudserver2 | CHANGED | rc=0 >>
-rw-r--r-- 1 vault vault 1826 Sep 21 03:17 /etc/vault.d/ca.crt
-rw-r--r-- 1 vault vault 1606 Sep 21 03:17 /etc/vault.d/cloudserver2.crt
cloudserver3 | CHANGED | rc=0 >>
-rw-r--r-- 1 vault vault 1826 Sep 20 23:17 /etc/vault.d/ca.crt
-rw-r--r-- 1 vault vault 1606 Sep 20 23:17 /etc/vault.d/cloudserver3.crt
$ cd /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab && export VAULT_TOKEN="<REDACTED_VAULT_TOKEN>" && ansible-playbook -i hosts.yml vault_ha_fix.yml

PLAY [Fix Vault HA config and cluster] *****************************************

TASK [Gathering Facts] *********************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver3]
ok: [cloudserver2]

TASK [Ensure Vault config directory exists] ************************************
changed: [beatapostapita]
changed: [vractormania]
ok: [arnialtrashlid]
changed: [micklethefickle]
changed: [cloudserver1]
changed: [cloudserver2]
changed: [cloudserver3]

TASK [Deploy cleaned Vault config] *********************************************
changed: [beatapostapita]
changed: [vractormania]
changed: [arnialtrashlid]
changed: [micklethefickle]
changed: [cloudserver1]
changed: [cloudserver3]
changed: [cloudserver2]

TASK [Restart Vault] ***********************************************************
changed: [beatapostapita]
changed: [vractormania]
changed: [arnialtrashlid]
changed: [micklethefickle]
changed: [cloudserver1]
changed: [cloudserver2]
changed: [cloudserver3]

TASK [Wait for Vault to start listening] ***************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [cloudserver1]
ok: [cloudserver3]
ok: [cloudserver2]

TASK [Unseal Vault] ************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
changed: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver3]
ok: [cloudserver2]

PLAY [Wait for cluster formation and promote voters] ***************************

TASK [Gathering Facts] *********************************************************
ok: [micklethefickle]

TASK [Wait for all nodes to join cluster] **************************************
An exception occurred during task execution. To see the full traceback, use -vvv. The error was: json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
fatal: [micklethefickle]: FAILED! => {"msg": "Unexpected failure during module execution: Expecting value: line 1 column 1 (char 0)", "stdout": ""}

PLAY RECAP *********************************************************************
arnialtrashlid             : ok=6    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
beatapostapita             : ok=6    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
cloudserver1               : ok=6    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
cloudserver2               : ok=6    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
cloudserver3               : ok=6    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
micklethefickle            : ok=7    changed=4    unreachable=0    failed=1    skipped=0    rescued=0    ignored=0   
vractormania               : ok=6    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   

$ cd /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab && ansible micklethefickle -i hosts.yml -m shell -a "VAULT_ADDR=https://100.98.182.207:8200 VAULT_SKIP_VERIFY=true VAULT_TOKEN=<REDACTED_VAULT_TOKEN> vault operator raft list-peers" --become
micklethefickle | FAILED | rc=2 >>
Error reading the raft cluster configuration: Error making API request.

URL: GET https://100.98.182.207:8200/v1/sys/storage/raft/configuration
Code: 500. Errors:

* local node not active but active cluster node not foundnon-zero return code
Show more

## Assistant

Thanks for all the detail — this makes it much clearer what’s happening.

The error you’re seeing:

Error reading the raft cluster configuration: ... local node not active but active cluster node not found

💡 This means:

Vault is running and unsealed.

But no node has actually become active leader yet.

So your raft list-peers call fails because there isn’t an elected leader to serve the request.

What’s likely wrong

Duplicate retry_join stanzas are still in your config (arnialtrashlid shows up twice). That can confuse Raft during join.

cluster_addr still has an inline comment at the end on micklethefickle:

cluster_addr = "https://100.98.182.207:8201"  # "https://100.98.182.207:8201"

Vault’s HCL parser often ignores the comment, but sometimes it mis-parses → better to remove it completely.

When every node is unsealed at once, sometimes Raft deadlocks until one is explicitly bootstrapped.

Fix path forward

Clean the config

Remove the duplicate retry_join block.

Remove the # "..." inline comment from cluster_addr.
Do this across all nodes.

Example final stanza for each:

hcl
api_addr     = "https://<node-ip>:8200"
cluster_addr = "https://<node-ip>:8201"

Pick one bootstrap node (e.g. micklethefickle)
On that node run:

Bash
export VAULT_ADDR=https://127.0.0.1:8200
export VAULT_SKIP_VERIFY=true
vault operator raft init

⚠️ Only run this on one node. Others should just retry_join.

Unseal that leader

Bash
vault operator unseal <your-unseal-key>

Then confirm:

Bash
vault status

It should show HA Mode: active.

Unseal the rest
On all other nodes:

Bash
vault operator unseal <your-unseal-key>
vault status

They should show HA Mode: standby.

Check cluster
Back on the leader:

Bash
vault operator raft list-peers

Now you should see peers.

Next step automation

Once you confirm the above works manually, we can safely extend your Ansible playbook to:

clean the config (dedup & remove inline comments),

bootstrap only one leader with raft init,

unseal it, then unseal all others,

finally run raft list-peers.

👉 Do you want me to rewrite the playbook so it handles the bootstrap vs. join distinction automatically (so only your chosen node initializes, others just wait and join)?

## User

$ ansible micklethefickle -i hosts.yml -m shell -a "export VAULT_ADDR=https://127.0.0.1:8200 && export VAULT_SKIP_VERIFY=true && vault operator raft init" --become
micklethefickle | FAILED | rc=1 >>
Usage: vault operator raft <subcommand> [options] [args]

  This command groups subcommands for operators interacting with the Vault raft
  storage backend. Most users will not need to interact with these commands. Here
  are a few examples of the raft operator commands:

  Joins a node to the raft cluster:

      $ vault operator raft join https://127.0.0.1:8200

  Returns the set of raft peers:

      $ vault operator raft list-peers

  Removes a node from the raft cluster:

      $ vault operator raft remove-peer

  Restores and saves snapshots from the raft cluster:

      $ vault operator raft snapshot save out.snap

  Please see the individual subcommand help for detailed usage information.

Subcommands:
    autopilot      
    join           Joins a node to the Raft cluster
    list-peers     Returns the Raft peer set
    remove-peer    Removes a node from the Raft cluster
    snapshot       Restores and saves snapshots from the Raft clusternon-zero return code
$ ansible micklethefickle -i hosts.yml -m shell -a "export VAULT_ADDR=https://127.0.0.1:8200 && export VAULT_SKIP_VERIFY=true && vault operator init -key-shares=1 -key-threshold=1 -format=json" --become
micklethefickle | FAILED | rc=2 >>
Error initializing: Error making API request.

URL: PUT https://127.0.0.1:8200/v1/sys/init
Code: 400. Errors:

* Vault is already initializednon-zero return code
$ ansible micklethefickle -i hosts.yml -m shell -a "export VAULT_ADDR=https://127.0.0.1:8200 && export VAULT_SKIP_VERIFY=true && vault operator unseal BIE3Y7/X6TP9G129AhMsE3YH+c2SRRhodhXO+7obUZU=" --become
micklethefickle | CHANGED | rc=0 >>
Key                     Value
---                     -----
Seal Type               shamir
Initialized             true
Sealed                  false
Total Shares            1
Threshold               1
Version                 1.14.0
Build Date              2023-06-19T11:40:23Z
Storage Type            raft
Cluster Name            vault-cluster-b0411632
Cluster ID              e8601c76-3002-7113-0316-f3c9a1563577
HA Enabled              true
HA Cluster              n/a
HA Mode                 standby
Active Node Address     <none>
Raft Committed Index    113
Raft Applied Index      113
$ ansible micklethefickle -i hosts.yml -m shell -a "export VAULT_ADDR=https://127.0.0.1:8200 && export VAULT_SKIP_VERIFY=true && vault status" --become
micklethefickle | CHANGED | rc=0 >>
Key                     Value
---                     -----
Seal Type               shamir
Initialized             true
Sealed                  false
Total Shares            1
Threshold               1
Version                 1.14.0
Build Date              2023-06-19T11:40:23Z
Storage Type            raft
Cluster Name            vault-cluster-b0411632
Cluster ID              e8601c76-3002-7113-0316-f3c9a1563577
HA Enabled              true
HA Cluster              n/a
HA Mode                 standby
Active Node Address     <none>
Raft Committed Index    113
Raft Applied Index      113
$ sleep 5 && ansible beatapostapita,vractormania,cloudserver1,cloudserver2,cloudserver3 -i hosts.yml -m shell -a "export VAULT_ADDR=https://{{ ansible_host }}:8200 && export VAULT_SKIP_VERIFY=true && vault operator unseal BIE3Y7/X6TP9G129AhMsE3YH+c2SRRhodhXO+7obUZU=" --become
beatapostapita | FAILED | rc=2 >>
Error unsealing: context deadline exceedednon-zero return code
vractormania | FAILED | rc=2 >>
Error unsealing: context deadline exceedednon-zero return code
cloudserver2 | FAILED | rc=2 >>
Error unsealing: context deadline exceedednon-zero return code
cloudserver3 | FAILED | rc=2 >>
Error unsealing: context deadline exceedednon-zero return code
cloudserver1 | FAILED | rc=2 >>
Error unsealing: context deadline exceedednon-zero return code
Show more

## Assistant

Got it — thanks for the full trace. Here’s what’s happening step by step:

1. Vault already initialized

You don’t need raft init. That subcommand is only for special snapshot/peer mgmt.
You correctly ran vault operator init previously, and the cluster shows:

Initialized: true
Sealed: false
HA Mode: standby
Active Node Address: <none>

So the cluster exists, but no leader has been elected.

2. Why no leader?

There are two likely blockers:

Config issues still present

Duplicate retry_join stanzas (I still see arnialtrashlid twice in your config).

Inline comment after cluster_addr (on micklethefickle).
Both can cause Raft join to fail.

Other nodes can’t reach the leader
The “context deadline exceeded” during unseal usually means:

Vault started, but couldn’t reach any peer to join the cluster.

So it’s sitting there waiting, and API requests time out.

3. How to fix cleanly

Step A – Fix all configs

On all nodes, clean /etc/vault.d/vault_main.hcl:

Remove duplicate retry_join blocks.

Ensure cluster_addr is exactly:

hcl
cluster_addr = "https://<node-ip>:8201"

(no comments after the value).

Ensure each node has the correct node_id, api_addr, and its own .crt/.key.

Step B – Restart Vault everywhere

Bash
ansible nomad_cluster -i hosts.yml -m service -a "name=vault state=restarted" --become

Step C – Unseal one node first
On micklethefickle:

Bash
VAULT_ADDR=https://127.0.0.1:8200 VAULT_SKIP_VERIFY=true vault operator unseal <key>

Check status:

Bash
vault status

If the config is clean, this node should flip from standby → active.

Step D – Unseal the rest
Once you have an active leader, unseal the other nodes. They should report:

HA Mode: standby
Active Node Address: https://<leader-ip>:8200

Step E – Verify peers
On the leader:

Bash
vault operator raft list-peers
4. If it’s still stuck at “standby / no leader”

It usually means Raft can’t elect because nodes don’t see each other. Double-check:

Can each node connect to the leader’s cluster_addr (:8201)?

Bash
nc -vz <leader-ip> 8201

Are the certs valid for both client and server auth? (vault server logs will show TLS errors if not).

Do all retry_join stanzas reference reachable nodes (correct IPs / hostnames)?

👉 My suggestion:
Let’s first fix configs across the board with Ansible (dedup + strip inline comments). Then restart and retry the unseal flow.

Do you want me to write a cleanup playbook that will:

remove duplicate retry_join stanzas,

strip inline comments after cluster_addr,

and restart Vault everywhere,
so you start with a known-good baseline before unsealing again?
