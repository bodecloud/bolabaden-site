---
source_url: "https://grok.com/c/98e974bf-0528-402c-ad7c-f807c146e2f8"
conversation_id: "98e974bf-0528-402c-ad7c-f807c146e2f8"
title: "Ansible Vault Deployment Process"
extracted_at: "2026-06-29T16:20:17.205Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Ansible Vault Deployment Process

Source: [Grok conversation](https://grok.com/c/98e974bf-0528-402c-ad7c-f807c146e2f8)

## User

_Time: 2025-09-17T22:28:14.894Z_

```
root@beatapostapita:/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab# make vault
Installing Ansible requirements...
command: "/bin/bash -c "ansible-galaxy install -r /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/requirements.yml"
Starting galaxy role install process
- setup-docker is already installed, skipping.
- setup-nomad is already installed, skipping.
- setup-consul is already installed, skipping.
- setup-vault is already installed, skipping.
- setup-caddy is already installed, skipping.
- setup-consul-template is already installed, skipping.
- setup-cloudflared is already installed, skipping.
Requirements installed successfully.
Deploying Vault components...
command: "/bin/bash -c "ansible-playbook -i /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/hosts.yml /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/site.yml --tags vault"

PLAY [nomad_cluster] **********************************************************************************************************************************************************

TASK [Gathering Facts] ********************************************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-consul : Include OS-specific variables] ***************************************************************************************************************************
ok: [micklethefickle] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [beatapostapita] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [vractormania] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [arnialtrashlid] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver1] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver2] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver3] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)

TASK [setup-vault : Include asserts] ******************************************************************************************************************************************
included: /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-vault/tasks/asserts.yml for micklethefickle, beatapostapita, vractormania, arnialtrashlid, cloudserver1, cloudserver2, cloudserver3

TASK [setup-vault : Check distribution compatibility] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Red Hat / CentOS] ************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Debian] **********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of FreeBSD] *********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Ubuntu] **********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Check for vault_redirect_address usage] *******************************************************************************************************************
ok: [micklethefickle] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [beatapostapita] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [vractormania] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [arnialtrashlid] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver1] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver2] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver3] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}

TASK [setup-vault : Check if vault_transit_address and vault_transit_token has been specified] ********************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Add Vault group] ******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Add Vault user] *******************************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver3]
ok: [cloudserver2]

TASK [setup-vault : Include OS-specific variables] ****************************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Check for existing Vault binary] **************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver3]
ok: [cloudserver2]
ok: [cloudserver1]

TASK [setup-vault : Check Vault installation] *********************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver3]
ok: [cloudserver2]

TASK [setup-vault : Get installed Vault version (with architecture check)] ****************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Compute if installation is required] **********************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display installation decision] ***************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}

TASK [setup-vault : Install OS packages and Vault via control host] ***********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Install Vault via HashiCorp repository] *******************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Install OS packages and Vault via remote hosts] ***********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Check Vault mlock capability] *****************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Enable non root mlock capability] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Create directories] ***************************************************************************************************************************************
ok: [beatapostapita] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [vractormania] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [arnialtrashlid] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [micklethefickle] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [beatapostapita] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [vractormania] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [beatapostapita] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [micklethefickle] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [beatapostapita] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [beatapostapita] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [vractormania] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver2] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [cloudserver3] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [cloudserver2] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver3] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver1] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/run/vault', 'mode': '0750'})

TASK [setup-vault : Enable logrotate for vault] *******************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : TLS configuration] ****************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Backend storage TLS configuration] ************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Get content of GCP Credentials from file] *****************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Copy over GCP Credentials for Auto Unseal] ****************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Copy GCP Credentials for gcs backend] *********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault main configuration] *********************************************************************************************************************************
changed: [beatapostapita]
changed: [vractormania]
changed: [arnialtrashlid]
changed: [micklethefickle]
changed: [cloudserver1]
changed: [cloudserver2]
changed: [cloudserver3]

TASK [setup-vault : Vault transit seal configuration] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault awskms seal configuration] **************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault azurekeyvault seal configuration] *******************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Upload Vault license file to vault_license_path] **********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Set Exec output to log path when enabled log] *************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : BSD init script] ******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : SYSV init script] *****************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Debian init script] ***************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Extract systemd version] **********************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Systemd unit] *********************************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Reload systemd] *******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Start Vault] **********************************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Pause to let Vault startup correctly] *********************************************************************************************************************
skipping: [micklethefickle]

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

RUNNING HANDLER [setup-vault : Restart vault] *********************************************************************************************************************************
changed: [beatapostapita]
changed: [vractormania]
changed: [micklethefickle]
changed: [arnialtrashlid]
changed: [cloudserver2]
changed: [cloudserver1]
changed: [cloudserver3]

RUNNING HANDLER [setup-vault : Reload vault] **********************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Compute TLS friendly vault_addr] **************************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Insert http(s) export in dotfile] *************************************************************************************************************************
changed: [beatapostapita]
changed: [arnialtrashlid]
ok: [vractormania]
changed: [micklethefickle]
changed: [cloudserver1]
changed: [cloudserver2]
changed: [cloudserver3]

TASK [setup-vault : Insert CA cert export in dotfile] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Print all Vault-related variables] ***********************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.98.182.207",
        "vault_redirect_address: 100.98.182.207",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.98.182.207:8200",
        "vault_cluster_addr: http://100.98.182.207:8201",
        "vault_cluster_address: 100.98.182.207:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: micklethefickle",
        "ansible_host: 100.98.182.207",
        "network_address: 170.9.225.137",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.78', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:03:bc:56', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.98.182.207",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.111.132.16",
        "vault_redirect_address: 100.111.132.16",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.111.132.16:8200",
        "vault_cluster_addr: http://100.111.132.16:8201",
        "vault_cluster_address: 100.111.132.16:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: beatapostapita",
        "ansible_host: 100.111.132.16",
        "network_address: 149.130.222.229",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.109', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:05:23:92', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.111.132.16",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.94.174.206",
        "vault_redirect_address: 100.94.174.206",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.94.174.206:8200",
        "vault_cluster_addr: http://100.94.174.206:8201",
        "vault_cluster_address: 100.94.174.206:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: vractormania",
        "ansible_host: 100.94.174.206",
        "network_address: 149.130.219.117",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.94.174.206",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.108.164.175",
        "vault_redirect_address: 100.108.164.175",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.108.164.175:8200",
        "vault_cluster_addr: http://100.108.164.175:8201",
        "vault_cluster_address: 100.108.164.175:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver1",
        "ansible_host: 100.108.164.175",
        "network_address: 172.245.88.16",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.16', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:17:3b:5e', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.108.164.175",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.94.174.206",
        "vault_redirect_address: 100.94.174.206",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.94.174.206:8200",
        "vault_cluster_addr: http://100.94.174.206:8201",
        "vault_cluster_address: 100.94.174.206:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: arnialtrashlid",
        "ansible_host: 100.94.174.206",
        "network_address: 150.136.84.225",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.94.174.206",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.89.18.76",
        "vault_redirect_address: 100.89.18.76",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.89.18.76:8200",
        "vault_cluster_addr: http://100.89.18.76:8201",
        "vault_cluster_address: 100.89.18.76:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver2",
        "ansible_host: 100.89.18.76",
        "network_address: 172.245.88.15",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.15', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:75:e6:f5', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.89.18.76",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.93.153.182",
        "vault_redirect_address: 100.93.153.182",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.93.153.182:8200",
        "vault_cluster_addr: http://100.93.153.182:8201",
        "vault_cluster_address: 100.93.153.182:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver3",
        "ansible_host: 100.93.153.182",
        "network_address: 172.245.88.17",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.17', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:4e:fb:3d', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.93.153.182",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Show all network interfaces] *****************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['vethf0acc22', 'tailscale0', 'veth37ef486', 'veth4e963ec', 'veth003390d', 'veth-warp', 'veth1e36a10', 'veth65f3dad', 'veth5e27e1d', 'vethe2d7466', 'veth4d1d7b6', 'veth49240d6', 'veth0705756', 'veth930ad41', 'veth60266b7', 'vethb391566', 'veth3d20ab8', 'vethbbcfd44', 'veth0178b27', 'veth7b910b8', 'veth09ca7f8', 'vethc29f97e', 'vethcdd928b', 'veth934ccf2', 'lo', 'veth9cde36a', 'veth7bd7aed', 'vethc6409e5', 'veth97d4314', 'veth91d02ec', 'veth5d07129', 'vethb737193', 'veth42b1d07', 'veth98e9fd7', 'br-e8e007a130d9', 'vethd7963e2', 'vethb7c69dc', 'vethe1eb32d', 'vethc2f258d', 'vethaad8801', 'docker0', 'br_publicnet', 'veth45c6e94', 'veth327c1eb', 'vethc585994', 'vethbdb808f', 'vethc494640', 'veth4187e42', 'vethf510660', 'veth0f1e636', 'vethc01ee98', 'veth4a62ea9', 'vethcc7f8d4', 'vethe93dc80', 'veth1cd2475', 'vethc397d6b', 'vethb5b7859', 'enp0s6', 'veth1d0c224', 'veth88692e8', 'vethd5543f8', 'br-30602d861856', 'veth8e1171c', 'vethf55a158', 'br-b5be2a962667', 'vethd938a65', 'br_warp-nat-net', 'vethb8a10dc', 'veth1624a12', 'vethc360f30', 'veth961cb99', 'vetheafd9af', 'vethe97dec7', 'veth218be92', 'vethc59c767', 'veth17c1846', 'br_backend', 'vethfffada2', 'vethd786e73', 'veth9c72300', 'veth85050be']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.78', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:03:bc:56', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.98.182.207', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.98.182.207', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:478c:b369:cfd3:77ae:1a03', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::7a44:d8c8:9f3c:2458', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth7b65c57', 'tun1', 'veth1bee009', 'tailscale0', 'veth60f44de', 'veth2e7f8a8', 'br_backend', 'vethcbb8a81', 'br-6fa3dc1f892c', 'vethee41a95', 'veth6a45bed', 'veth224966d', 'vethee297a8', 'veth8d7683c', 'vetha087a25', 'vetha1ef755', 'br-46482b0f96c8', 'vethb94efbc', 'vethe59e7fe', 'vethe080a08', 'veth83b1ac4', 'vethb605a0d', 'veth31eda3c', 'vethe55d933', 'veth7af8f89', 'veth4c7762c', 'veth74c39c3', 'vethf82ccf8', 'veth6341f58', 'veth1a33936', 'veth0108427', 'vethcb0654a', 'veth-warp', 'veth64f18ec', 'br-7b4425e58e3c', 'tun0', 'veth2a6099b', 'veth2fe57aa', 'veth90078bb', 'veth7fd0a3f', 'br_crowdsec_gf', 'veth9b0c644', 'veth7847b4d', 'veth5eaed5e', 'vetha71ba8d', 'veth07d3bf5', 'veth8203509', 'vethe413b48', 'enp0s6', 'veth36be735', 'veth87bcb52', 'veth04c7dc8', 'veth6ecc15a', 'veth156863c', 'vethdcc5972', 'veth6dc969b', 'veth3f9ef01', 'veth3c331c8', 'lo', 'vethd64eeba', 'br_publicnet', 'br_warp-nat-net', 'docker0', 'vethca41113', 'veth7e6f13d', 'veth70cd7aa', 'veth917f151', 'vethfe70699', 'veth04ce03b', 'vethc969cec', 'vethde64da2', 'vethc5389ad', 'veth045fb57', 'br_vpn-network', 'veth7d7bf9d', 'vetha572651', 'veth170bb62', 'veth163cd55', 'veth0bb54b4', 'veth6488890', 'veth6f585a1']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.109', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:05:23:92', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.111.132.16', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.111.132.16', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:812b:c823:ccbf:b039:f92', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::e0a2:576c:7bbc:98d2', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth180054c', 'veth6bcc543', 'br-9013d71b70a6', 'br-4b2d1bcfa835', 'vethfd9406f', 'vethfdeb64b', 'veth1bf6e4d', 'veth1cd4719', 'veth7be89eb', 'veth8f4b693', 'lo', 'veth4093f4b', 'veth76029a7', 'br_warp-network', 'vethccdf7b3', 'vethed32ddc', 'veth203373d', 'veth107fa80', 'veth3a44b70', 'vethf1bfd2a', 'br_publicnet', 'veth0a2dbdb', 'veth20f3bdd', 'veth9edf2ee', 'veth43441ef', 'tailscale0', 'br-07fca800289b', 'veth0c1ccf2', 'br-33f64b8d4c58', 'veth1d416bf', 'vethf6f8b65', 'vetha479a4f', 'veth2f2a28d', 'br-45f4bb80820f', 'veth6bdc8aa', 'vethd838bde', 'enp0s6', 'docker0', 'veth12e30ca', 'veth78736a3', 'vetha3e8ea7', 'vethfe3702d', 'veth36ae789', 'br-e8d0130a60af', 'veth8365dc8', 'br-0ca74fa43b42', 'vetha6ab4dc', 'vethcfc5510', 'veth1a605b3', 'veth78e4d89', 'br-ddee521ff8d2', 'veth350f167', 'br-9d98caf831bb', 'veth6102743', 'veth7e03c3e', 'br-53e4653c7f35', 'veth6ee3673', 'veth37ad922', 'vethba223df']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.94.174.206', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.94.174.206', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:21c0:9a55:44c9:c441:1acf', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::cbee:b4b:7bae:a352', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth1bf6e4d', 'br-9013d71b70a6', 'veth350f167', 'vethcfc5510', 'br-07fca800289b', 'vethf1bfd2a', 'veth7be89eb', 'veth43441ef', 'vethed32ddc', 'vethf6f8b65', 'veth0a2dbdb', 'br-53e4653c7f35', 'veth1d416bf', 'veth4093f4b', 'veth8365dc8', 'veth6ee3673', 'br-33f64b8d4c58', 'br_warp-network', 'br-e8d0130a60af', 'enp0s6', 'vetha479a4f', 'br-0ca74fa43b42', 'veth8f4b693', 'veth78736a3', 'veth20f3bdd', 'veth6bcc543', 'br-9d98caf831bb', 'veth36ae789', 'veth6bdc8aa', 'br_publicnet', 'vethfdeb64b', 'vetha6ab4dc', 'vethfd9406f', 'vetha3e8ea7', 'vethba223df', 'veth76029a7', 'veth6102743', 'veth0c1ccf2', 'veth37ad922', 'veth180054c', 'docker0', 'br-45f4bb80820f', 'veth1a605b3', 'veth3a44b70', 'br-ddee521ff8d2', 'br-4b2d1bcfa835', 'lo', 'veth107fa80', 'tailscale0', 'vethd838bde', 'veth7e03c3e', 'veth2f2a28d', 'veth1cd4719', 'vethfe3702d', 'veth203373d', 'veth78e4d89', 'vethccdf7b3', 'veth9edf2ee', 'veth12e30ca']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.94.174.206', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.94.174.206', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:21c0:9a55:44c9:c441:1acf', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::cbee:b4b:7bae:a352', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth1a84340', 'tailscale0', 'veth9d6687a', 'veth4398fac', 'lo', 'veth7e5e393', 'veth58d57ed', 'veth054ea40', 'vetha5cc81d', 'veth2f40c19', 'veth0a42fe6', 'vethd655229', 'br-c4706e9b9ad2', 'veth16cb492', 'veth43eda78', 'docker0', 'br_warp-network', 'veth17242b7', 'veth553b64c', 'br-5e35e7049f2c', 'br-8d58d793a54e', 'veth0befdc1', 'eth0', 'veth114d988', 'veth7a1d8c5', 'vethc15c512', 'vethadf63ae', 'veth78c4d72']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.16', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:17:3b:5e', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.108.164.175', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.108.164.175', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:e0ef:4ee:1a4e:cf5b:305e', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::fa7e:4b0e:9477:dabd', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['tailscale0', 'br-c17fc902dd7c', 'veth989a716', 'br-f53dbe2492e5', 'vethea522f1', 'veth-warp-host', 'veth05439ba', 'veth165df69', 'vethfe5d9e8', 'vethd515c84', 'br_warp-network', 'veth2149db4', 'lo', 'eth0', 'docker0']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.15', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:75:e6:f5', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.89.18.76', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.89.18.76', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:19dd:af1b:2c92:c73:fb69', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::a923:c7f5:9027:b83f', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth7fd267e', 'veth314f899', 'veth6617a0e', 'veth1aaf697', 'tailscale0', 'br-fe2fbeb471d3', 'eth0', 'vetha87e073', 'veth87c197e', 'br_warp-network', 'docker0', 'vetha4fc465', 'vethaad513b', 'veth74fe498', 'lo', 'veth11b085b', 'veth3432212', 'br-50cad32899be', 'veth6e5c112', 'br-947849b349fa', 'veth008c1da']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.17', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:4e:fb:3d', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.93.153.182', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.93.153.182', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:1dbc:e213:9d6f:b77:6a96', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::be75:6ee2:45c5:6080', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Test basic connectivity to target host] ******************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display ping results] ************************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.98.182.207 (100.98.182.207) 56(84) bytes of data.\n64 bytes from 100.98.182.207: icmp_seq=1 ttl=64 time=0.054 ms\n64 bytes from 100.98.182.207: icmp_seq=2 ttl=64 time=0.049 ms\n64 bytes from 100.98.182.207: icmp_seq=3 ttl=64 time=0.058 ms\n\n--- 100.98.182.207 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2055ms\nrtt min/avg/max/mdev = 0.049/0.053/0.058/0.003 ms",
        "STDERR: "
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.111.132.16 (100.111.132.16) 56(84) bytes of data.\n64 bytes from 100.111.132.16: icmp_seq=1 ttl=64 time=0.050 ms\n64 bytes from 100.111.132.16: icmp_seq=2 ttl=64 time=0.046 ms\n64 bytes from 100.111.132.16: icmp_seq=3 ttl=64 time=0.062 ms\n\n--- 100.111.132.16 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2040ms\nrtt min/avg/max/mdev = 0.046/0.052/0.062/0.006 ms",
        "STDERR: "
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.94.174.206 (100.94.174.206): 56 data bytes\n64 bytes from 100.94.174.206: icmp_seq=0 ttl=64 time=0.153 ms\n64 bytes from 100.94.174.206: icmp_seq=1 ttl=64 time=0.056 ms\n64 bytes from 100.94.174.206: icmp_seq=2 ttl=64 time=0.057 ms\n--- 100.94.174.206 ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss\nround-trip min/avg/max/stddev = 0.056/0.089/0.153/0.045 ms",
        "STDERR: "
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.94.174.206 (100.94.174.206): 56 data bytes\n64 bytes from 100.94.174.206: icmp_seq=0 ttl=64 time=0.107 ms\n64 bytes from 100.94.174.206: icmp_seq=1 ttl=64 time=0.068 ms\n64 bytes from 100.94.174.206: icmp_seq=2 ttl=64 time=0.050 ms\n--- 100.94.174.206 ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss\nround-trip min/avg/max/stddev = 0.050/0.075/0.107/0.024 ms",
        "STDERR: "
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.108.164.175 (100.108.164.175) 56(84) bytes of data.\n64 bytes from 100.108.164.175: icmp_seq=1 ttl=64 time=0.099 ms\n64 bytes from 100.108.164.175: icmp_seq=2 ttl=64 time=0.092 ms\n64 bytes from 100.108.164.175: icmp_seq=3 ttl=64 time=0.088 ms\n\n--- 100.108.164.175 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2038ms\nrtt min/avg/max/mdev = 0.088/0.093/0.099/0.004 ms",
        "STDERR: "
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.89.18.76 (100.89.18.76) 56(84) bytes of data.\n64 bytes from 100.89.18.76: icmp_seq=1 ttl=64 time=0.101 ms\n64 bytes from 100.89.18.76: icmp_seq=2 ttl=64 time=0.082 ms\n64 bytes from 100.89.18.76: icmp_seq=3 ttl=64 time=0.088 ms\n\n--- 100.89.18.76 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2002ms\nrtt min/avg/max/mdev = 0.082/0.090/0.101/0.007 ms",
        "STDERR: "
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.93.153.182 (100.93.153.182) 56(84) bytes of data.\n64 bytes from 100.93.153.182: icmp_seq=1 ttl=64 time=0.137 ms\n64 bytes from 100.93.153.182: icmp_seq=2 ttl=64 time=0.188 ms\n64 bytes from 100.93.153.182: icmp_seq=3 ttl=64 time=0.301 ms\n\n--- 100.93.153.182 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2078ms\nrtt min/avg/max/mdev = 0.137/0.208/0.301/0.068 ms",
        "STDERR: "
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Test port connectivity with telnet] **********************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [micklethefickle]
ok: [arnialtrashlid]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display port connectivity results] ***********************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.98.182.207:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.98.182.207/8200: Connection refused"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.111.132.16:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.111.132.16/8200: Connection refused"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.94.174.206:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.94.174.206/8200: Connection refused"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.94.174.206:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.94.174.206/8200: Connection refused"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.108.164.175:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.108.164.175/8200: Connection refused"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.89.18.76:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.89.18.76/8200: Connection refused"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.93.153.182:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.93.153.182/8200: Connection refused"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Check if Vault service is running] ***********************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display Vault service status] ****************************************************************************************************************
fatal: [micklethefickle]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [beatapostapita]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [vractormania]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [arnialtrashlid]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [cloudserver1]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [cloudserver2]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [cloudserver3]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}

PLAY RECAP ********************************************************************************************************************************************************************
arnialtrashlid             : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
beatapostapita             : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
cloudserver1               : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
cloudserver2               : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
cloudserver3               : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
micklethefickle            : ok=27   changed=3    unreachable=0    failed=1    skipped=29   rescued=0    ignored=0   
vractormania               : ok=27   changed=2    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   

make: *** [Makefile:81: vault] Error 2
root@beatapostapita:/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab# make vault
Installing Ansible requirements...
command: "/bin/bash -c "ansible-galaxy install -r /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/requirements.yml"
Starting galaxy role install process
- setup-docker is already installed, skipping.
- setup-nomad is already installed, skipping.
- setup-consul is already installed, skipping.
- setup-vault is already installed, skipping.
- setup-caddy is already installed, skipping.
- setup-consul-template is already installed, skipping.
- setup-cloudflared is already installed, skipping.
Requirements installed successfully.
Deploying Vault components...
command: "/bin/bash -c "ansible-playbook -i /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/hosts.yml /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/site.yml --tags vault"

PLAY [nomad_cluster] **********************************************************************************************************************************************************

TASK [Gathering Facts] ********************************************************************************************************************************************************
ok: [vractormania]
ok: [arnialtrashlid]
ok: [beatapostapita]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-consul : Include OS-specific variables] ***************************************************************************************************************************
ok: [micklethefickle] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [beatapostapita] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [vractormania] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [arnialtrashlid] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver1] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver2] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver3] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)

TASK [setup-vault : Include asserts] ******************************************************************************************************************************************
included: /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-vault/tasks/asserts.yml for micklethefickle, beatapostapita, vractormania, arnialtrashlid, cloudserver1, cloudserver2, cloudserver3

TASK [setup-vault : Check distribution compatibility] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Red Hat / CentOS] ************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Debian] **********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of FreeBSD] *********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Ubuntu] **********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Check for vault_redirect_address usage] *******************************************************************************************************************
ok: [micklethefickle] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [beatapostapita] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [vractormania] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [arnialtrashlid] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver1] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver2] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver3] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}

TASK [setup-vault : Check if vault_transit_address and vault_transit_token has been specified] ********************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Add Vault group] ******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Add Vault user] *******************************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Include OS-specific variables] ****************************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Check for existing Vault binary] **************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver3]
ok: [cloudserver1]

TASK [setup-vault : Check Vault installation] *********************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Get installed Vault version (with architecture check)] ****************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Compute if installation is required] **********************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display installation decision] ***************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}

TASK [setup-vault : Install OS packages and Vault via control host] ***********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Install Vault via HashiCorp repository] *******************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Install OS packages and Vault via remote hosts] ***********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Check Vault mlock capability] *****************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Enable non root mlock capability] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Create directories] ***************************************************************************************************************************************
ok: [beatapostapita] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [arnialtrashlid] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [micklethefickle] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [vractormania] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [beatapostapita] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [arnialtrashlid] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [vractormania] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [micklethefickle] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [beatapostapita] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [beatapostapita] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [beatapostapita] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver2] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [micklethefickle] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [cloudserver1] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver3] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver1] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/run/vault', 'mode': '0750'})

TASK [setup-vault : Enable logrotate for vault] *******************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : TLS configuration] ****************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Backend storage TLS configuration] ************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Get content of GCP Credentials from file] *****************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Copy over GCP Credentials for Auto Unseal] ****************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Copy GCP Credentials for gcs backend] *********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault main configuration] *********************************************************************************************************************************
changed: [beatapostapita]
changed: [vractormania]
ok: [arnialtrashlid]
changed: [micklethefickle]
changed: [cloudserver1]
changed: [cloudserver2]
changed: [cloudserver3]

TASK [setup-vault : Vault transit seal configuration] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault awskms seal configuration] **************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault azurekeyvault seal configuration] *******************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Upload Vault license file to vault_license_path] **********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Set Exec output to log path when enabled log] *************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : BSD init script] ******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : SYSV init script] *****************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Debian init script] ***************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Extract systemd version] **********************************************************************************************************************************
ok: [beatapostapita]
ok: [micklethefickle]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Systemd unit] *********************************************************************************************************************************************
ok: [beatapostapita]
ok: [micklethefickle]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Reload systemd] *******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Start Vault] **********************************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Pause to let Vault startup correctly] *********************************************************************************************************************
skipping: [micklethefickle]

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

RUNNING HANDLER [setup-vault : Restart vault] *********************************************************************************************************************************
changed: [vractormania]
changed: [micklethefickle]
changed: [beatapostapita]
changed: [cloudserver2]
changed: [cloudserver3]
changed: [cloudserver1]

RUNNING HANDLER [setup-vault : Reload vault] **********************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]

TASK [setup-vault : Reload vault] *********************************************************************************************************************************************
ok: [arnialtrashlid]

RUNNING HANDLER [setup-vault : Reload vault] **********************************************************************************************************************************
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Compute TLS friendly vault_addr] **************************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Insert http(s) export in dotfile] *************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Insert CA cert export in dotfile] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Print all Vault-related variables] ***********************************************************************************************************
ok: [beatapostapita] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.111.132.16",
        "vault_redirect_address: 100.111.132.16",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.111.132.16:8200",
        "vault_cluster_addr: http://100.111.132.16:8201",
        "vault_cluster_address: 100.111.132.16:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: beatapostapita",
        "ansible_host: 100.111.132.16",
        "network_address: 149.130.222.229",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.109', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:05:23:92', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.111.132.16",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [micklethefickle] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.98.182.207",
        "vault_redirect_address: 100.98.182.207",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.98.182.207:8200",
        "vault_cluster_addr: http://100.98.182.207:8201",
        "vault_cluster_address: 100.98.182.207:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: micklethefickle",
        "ansible_host: 100.98.182.207",
        "network_address: 170.9.225.137",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.78', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:03:bc:56', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.98.182.207",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.108.164.175",
        "vault_redirect_address: 100.108.164.175",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.108.164.175:8200",
        "vault_cluster_addr: http://100.108.164.175:8201",
        "vault_cluster_address: 100.108.164.175:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver1",
        "ansible_host: 100.108.164.175",
        "network_address: 172.245.88.16",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.16', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:17:3b:5e', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.108.164.175",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.94.174.206",
        "vault_redirect_address: 100.94.174.206",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.94.174.206:8200",
        "vault_cluster_addr: http://100.94.174.206:8201",
        "vault_cluster_address: 100.94.174.206:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: arnialtrashlid",
        "ansible_host: 100.94.174.206",
        "network_address: 150.136.84.225",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.94.174.206",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.94.174.206",
        "vault_redirect_address: 100.94.174.206",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.94.174.206:8200",
        "vault_cluster_addr: http://100.94.174.206:8201",
        "vault_cluster_address: 100.94.174.206:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: vractormania",
        "ansible_host: 100.94.174.206",
        "network_address: 149.130.219.117",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.94.174.206",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.89.18.76",
        "vault_redirect_address: 100.89.18.76",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.89.18.76:8200",
        "vault_cluster_addr: http://100.89.18.76:8201",
        "vault_cluster_address: 100.89.18.76:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver2",
        "ansible_host: 100.89.18.76",
        "network_address: 172.245.88.15",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.15', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:75:e6:f5', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.89.18.76",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.93.153.182",
        "vault_redirect_address: 100.93.153.182",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.93.153.182:8200",
        "vault_cluster_addr: http://100.93.153.182:8201",
        "vault_cluster_address: 100.93.153.182:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver3",
        "ansible_host: 100.93.153.182",
        "network_address: 172.245.88.17",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.17', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:4e:fb:3d', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.93.153.182",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Show all network interfaces] *****************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['vethe93dc80', 'veth003390d', 'lo', 'veth5d07129', 'vethe1eb32d', 'vethc494640', 'veth-warp', 'vethd938a65', 'vethc397d6b', 'veth60266b7', 'vethf510660', 'veth930ad41', 'veth327c1eb', 'vethc01ee98', 'veth91d02ec', 'vethf0acc22', 'br-e8e007a130d9', 'vethbdb808f', 'veth1d0c224', 'vethc59c767', 'br-30602d861856', 'vethfffada2', 'veth9c72300', 'veth7bd7aed', 'enp0s6', 'vethc29f97e', 'vethbbcfd44', 'vethe97dec7', 'veth45c6e94', 'vethcc7f8d4', 'veth42b1d07', 'veth0705756', 'veth1624a12', 'vethc2f258d', 'veth4a62ea9', 'vethb737193', 'vethc6409e5', 'veth5e27e1d', 'veth3d20ab8', 'br_backend', 'vethcdd928b', 'veth98e9fd7', 'docker0', 'veth97d4314', 'veth218be92', 'vethc360f30', 'veth17c1846', 'veth1cd2475', 'vethd786e73', 'vethaad8801', 'veth65f3dad', 'veth4187e42', 'br-b5be2a962667', 'veth9cde36a', 'veth37ef486', 'vethb391566', 'vethb7c69dc', 'veth88692e8', 'vethd7963e2', 'veth85050be', 'br_publicnet', 'vethd5543f8', 'veth934ccf2', 'veth8e1171c', 'vethf55a158', 'vethc585994', 'veth961cb99', 'vetheafd9af', 'veth4e963ec', 'vethb5b7859', 'br_warp-nat-net', 'vethe2d7466', 'veth1e36a10', 'veth4d1d7b6', 'vethb8a10dc', 'veth0178b27', 'veth09ca7f8', 'tailscale0', 'veth7b910b8', 'veth0f1e636', 'veth49240d6']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.78', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:03:bc:56', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.98.182.207', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.98.182.207', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:478c:b369:cfd3:77ae:1a03', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::7a44:d8c8:9f3c:2458', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['vethcbb8a81', 'veth7e6f13d', 'tun1', 'veth64f18ec', 'veth6f585a1', 'veth74c39c3', 'veth90078bb', 'br_warp-nat-net', 'veth1a33936', 'veth917f151', 'vethcb0654a', 'veth4c7762c', 'veth6488890', 'br_publicnet', 'tun0', 'veth6a45bed', 'veth7af8f89', 'vethf82ccf8', 'vethb94efbc', 'vetha71ba8d', 'veth7d7bf9d', 'veth3f9ef01', 'vethde64da2', 'veth170bb62', 'vethd64eeba', 'vethfe70699', 'veth0bb54b4', 'veth-warp', 'br_crowdsec_gf', 'vetha1ef755', 'veth7847b4d', 'veth36be735', 'veth07d3bf5', 'veth31eda3c', 'veth5eaed5e', 'veth2fe57aa', 'tailscale0', 'veth224966d', 'veth9b0c644', 'veth3c331c8', 'veth8d7683c', 'veth8203509', 'veth2e7f8a8', 'vethe080a08', 'veth1bee009', 'vethee297a8', 'veth2a6099b', 'vethc5389ad', 'vethe59e7fe', 'br_backend', 'br_vpn-network', 'veth6ecc15a', 'veth6341f58', 'veth87bcb52', 'veth6dc969b', 'vethc969cec', 'br-46482b0f96c8', 'vethe55d933', 'veth7b65c57', 'veth7fd0a3f', 'veth60f44de', 'veth04ce03b', 'veth045fb57', 'vethca41113', 'vethee41a95', 'veth83b1ac4', 'docker0', 'veth156863c', 'vetha087a25', 'vethb605a0d', 'br-6fa3dc1f892c', 'vetha572651', 'veth70cd7aa', 'veth04c7dc8', 'lo', 'veth163cd55', 'enp0s6', 'veth0108427', 'vethe413b48', 'vethdcc5972', 'br-7b4425e58e3c']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.109', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:05:23:92', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.111.132.16', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.111.132.16', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:812b:c823:ccbf:b039:f92', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::e0a2:576c:7bbc:98d2', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth107fa80', 'lo', 'vetha6ab4dc', 'tailscale0', 'veth1d416bf', 'veth350f167', 'veth37ad922', 'veth9edf2ee', 'veth8f4b693', 'veth6ee3673', 'vethf1bfd2a', 'vethfdeb64b', 'veth203373d', 'br-e8d0130a60af', 'docker0', 'veth0c1ccf2', 'veth78e4d89', 'veth20f3bdd', 'br-33f64b8d4c58', 'veth6bcc543', 'veth78736a3', 'veth0a2dbdb', 'veth12e30ca', 'br_warp-network', 'br-45f4bb80820f', 'veth1cd4719', 'veth1a605b3', 'veth1bf6e4d', 'veth76029a7', 'veth6102743', 'veth180054c', 'veth7e03c3e', 'vethfd9406f', 'br-0ca74fa43b42', 'veth2f2a28d', 'vethed32ddc', 'vetha479a4f', 'vethccdf7b3', 'vethfe3702d', 'veth3a44b70', 'veth7be89eb', 'enp0s6', 'veth4093f4b', 'vethf6f8b65', 'br-ddee521ff8d2', 'veth8365dc8', 'vethd838bde', 'br-9d98caf831bb', 'br-9013d71b70a6', 'vethcfc5510', 'veth36ae789', 'br_publicnet', 'veth43441ef', 'vetha3e8ea7', 'br-53e4653c7f35', 'br-4b2d1bcfa835', 'vethba223df', 'br-07fca800289b', 'veth6bdc8aa']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.94.174.206', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.94.174.206', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:21c0:9a55:44c9:c441:1acf', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::cbee:b4b:7bae:a352', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['vethfe3702d', 'veth3a44b70', 'vethfdeb64b', 'veth107fa80', 'vetha6ab4dc', 'veth78736a3', 'veth1cd4719', 'veth12e30ca', 'veth7e03c3e', 'br-53e4653c7f35', 'br-33f64b8d4c58', 'veth0a2dbdb', 'veth20f3bdd', 'veth6bdc8aa', 'docker0', 'veth9edf2ee', 'veth1a605b3', 'veth350f167', 'veth6bcc543', 'veth37ad922', 'br-07fca800289b', 'veth1bf6e4d', 'vethd838bde', 'br-45f4bb80820f', 'br-e8d0130a60af', 'veth36ae789', 'veth2f2a28d', 'veth180054c', 'vethcfc5510', 'vetha3e8ea7', 'vethfd9406f', 'vethf6f8b65', 'vethf1bfd2a', 'br-4b2d1bcfa835', 'veth1d416bf', 'br-9d98caf831bb', 'veth76029a7', 'vethba223df', 'br_warp-network', 'tailscale0', 'vetha479a4f', 'br_publicnet', 'veth8f4b693', 'br-9013d71b70a6', 'veth203373d', 'vethccdf7b3', 'veth4093f4b', 'veth0c1ccf2', 'veth6102743', 'veth43441ef', 'br-ddee521ff8d2', 'veth6ee3673', 'veth78e4d89', 'enp0s6', 'lo', 'vethed32ddc', 'br-0ca74fa43b42', 'veth8365dc8', 'veth7be89eb']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.94.174.206', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.94.174.206', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:21c0:9a55:44c9:c441:1acf', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::cbee:b4b:7bae:a352', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth2f40c19', 'br-5e35e7049f2c', 'veth17242b7', 'vethd655229', 'veth054ea40', 'veth0a42fe6', 'docker0', 'veth553b64c', 'br_warp-network', 'tailscale0', 'eth0', 'veth1a84340', 'vethc15c512', 'veth4398fac', 'br-c4706e9b9ad2', 'br-8d58d793a54e', 'veth114d988', 'vetha5cc81d', 'veth43eda78', 'veth9d6687a', 'vethadf63ae', 'veth7e5e393', 'veth58d57ed', 'veth7a1d8c5', 'veth0befdc1', 'veth78c4d72', 'veth16cb492', 'lo']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.16', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:17:3b:5e', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.108.164.175', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.108.164.175', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:e0ef:4ee:1a4e:cf5b:305e', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::fa7e:4b0e:9477:dabd', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['eth0', 'vethfe5d9e8', 'veth2149db4', 'veth989a716', 'docker0', 'lo', 'br-f53dbe2492e5', 'vethea522f1', 'tailscale0', 'br-c17fc902dd7c', 'br_warp-network', 'veth165df69', 'veth-warp-host', 'veth05439ba', 'vethd515c84']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.15', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:75:e6:f5', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.89.18.76', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.89.18.76', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:19dd:af1b:2c92:c73:fb69', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::a923:c7f5:9027:b83f', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['docker0', 'vetha87e073', 'veth3432212', 'veth008c1da', 'veth11b085b', 'tailscale0', 'eth0', 'vethaad513b', 'veth1aaf697', 'vethb271846', 'veth6617a0e', 'veth6e5c112', 'br_warp-network', 'br-50cad32899be', 'br-fe2fbeb471d3', 'veth314f899', 'vetha4fc465', 'br-947849b349fa', 'veth74fe498', 'lo', 'veth87c197e']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.17', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:4e:fb:3d', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.93.153.182', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.93.153.182', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:1dbc:e213:9d6f:b77:6a96', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::be75:6ee2:45c5:6080', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Test basic connectivity to target host] ******************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver3]
ok: [cloudserver2]

TASK [setup-vault : [DIAGNOSTIC] Display ping results] ************************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.98.182.207 (100.98.182.207) 56(84) bytes of data.\n64 bytes from 100.98.182.207: icmp_seq=1 ttl=64 time=0.060 ms\n64 bytes from 100.98.182.207: icmp_seq=2 ttl=64 time=0.045 ms\n64 bytes from 100.98.182.207: icmp_seq=3 ttl=64 time=0.043 ms\n\n--- 100.98.182.207 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2069ms\nrtt min/avg/max/mdev = 0.043/0.049/0.060/0.007 ms",
        "STDERR: "
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.111.132.16 (100.111.132.16) 56(84) bytes of data.\n64 bytes from 100.111.132.16: icmp_seq=1 ttl=64 time=0.049 ms\n64 bytes from 100.111.132.16: icmp_seq=2 ttl=64 time=0.056 ms\n64 bytes from 100.111.132.16: icmp_seq=3 ttl=64 time=0.057 ms\n\n--- 100.111.132.16 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2076ms\nrtt min/avg/max/mdev = 0.049/0.054/0.057/0.003 ms",
        "STDERR: "
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.94.174.206 (100.94.174.206): 56 data bytes\n64 bytes from 100.94.174.206: icmp_seq=0 ttl=64 time=0.076 ms\n64 bytes from 100.94.174.206: icmp_seq=1 ttl=64 time=0.071 ms\n64 bytes from 100.94.174.206: icmp_seq=2 ttl=64 time=0.084 ms\n--- 100.94.174.206 ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss\nround-trip min/avg/max/stddev = 0.071/0.077/0.084/0.000 ms",
        "STDERR: "
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.94.174.206 (100.94.174.206): 56 data bytes\n64 bytes from 100.94.174.206: icmp_seq=0 ttl=64 time=0.085 ms\n64 bytes from 100.94.174.206: icmp_seq=1 ttl=64 time=0.072 ms\n64 bytes from 100.94.174.206: icmp_seq=2 ttl=64 time=0.042 ms\n--- 100.94.174.206 ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss\nround-trip min/avg/max/stddev = 0.042/0.066/0.085/0.000 ms",
        "STDERR: "
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.108.164.175 (100.108.164.175) 56(84) bytes of data.\n64 bytes from 100.108.164.175: icmp_seq=1 ttl=64 time=0.109 ms\n64 bytes from 100.108.164.175: icmp_seq=2 ttl=64 time=0.091 ms\n64 bytes from 100.108.164.175: icmp_seq=3 ttl=64 time=0.084 ms\n\n--- 100.108.164.175 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2051ms\nrtt min/avg/max/mdev = 0.084/0.094/0.109/0.010 ms",
        "STDERR: "
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.89.18.76 (100.89.18.76) 56(84) bytes of data.\n64 bytes from 100.89.18.76: icmp_seq=1 ttl=64 time=0.150 ms\n64 bytes from 100.89.18.76: icmp_seq=2 ttl=64 time=0.097 ms\n64 bytes from 100.89.18.76: icmp_seq=3 ttl=64 time=0.088 ms\n\n--- 100.89.18.76 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2077ms\nrtt min/avg/max/mdev = 0.088/0.111/0.150/0.027 ms",
        "STDERR: "
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.93.153.182 (100.93.153.182) 56(84) bytes of data.\n64 bytes from 100.93.153.182: icmp_seq=1 ttl=64 time=0.144 ms\n64 bytes from 100.93.153.182: icmp_seq=2 ttl=64 time=0.086 ms\n64 bytes from 100.93.153.182: icmp_seq=3 ttl=64 time=0.113 ms\n\n--- 100.93.153.182 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2084ms\nrtt min/avg/max/mdev = 0.086/0.114/0.144/0.023 ms",
        "STDERR: "
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Test port connectivity with telnet] **********************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display port connectivity results] ***********************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.98.182.207:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.98.182.207/8200: Connection refused"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.111.132.16:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.111.132.16/8200: Connection refused"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.94.174.206:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.94.174.206/8200: Connection refused"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.94.174.206:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.94.174.206/8200: Connection refused"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.108.164.175:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.108.164.175/8200: Connection refused"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.89.18.76:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.89.18.76/8200: Connection refused"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.93.153.182:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.93.153.182/8200: Connection refused"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Check if Vault service is running] ***********************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
^C [ERROR]: User interrupted execution
make: *** [Makefile:81: vault] Error 99
```

Fuck am i doing wrong here?

## Assistant

_Time: 2025-09-17T22:28:30.870Z_



## User

_Time: 2025-09-17T22:29:21.710Z_

```
root@beatapostapita:/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab# make vault
Installing Ansible requirements...
command: "/bin/bash -c "ansible-galaxy install -r /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/requirements.yml"
Starting galaxy role install process
- setup-docker is already installed, skipping.
- setup-nomad is already installed, skipping.
- setup-consul is already installed, skipping.
- setup-vault is already installed, skipping.
- setup-caddy is already installed, skipping.
- setup-consul-template is already installed, skipping.
- setup-cloudflared is already installed, skipping.
Requirements installed successfully.
Deploying Vault components...
command: "/bin/bash -c "ansible-playbook -i /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/hosts.yml /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/site.yml --tags vault"

PLAY [nomad_cluster] **********************************************************************************************************************************************************

TASK [Gathering Facts] ********************************************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-consul : Include OS-specific variables] ***************************************************************************************************************************
ok: [micklethefickle] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [beatapostapita] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [vractormania] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [arnialtrashlid] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver1] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver2] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver3] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)

TASK [setup-vault : Include asserts] ******************************************************************************************************************************************
included: /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-vault/tasks/asserts.yml for micklethefickle, beatapostapita, vractormania, arnialtrashlid, cloudserver1, cloudserver2, cloudserver3

TASK [setup-vault : Check distribution compatibility] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Red Hat / CentOS] ************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Debian] **********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of FreeBSD] *********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Ubuntu] **********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Check for vault_redirect_address usage] *******************************************************************************************************************
ok: [micklethefickle] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [beatapostapita] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [vractormania] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [arnialtrashlid] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver1] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver2] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver3] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}

TASK [setup-vault : Check if vault_transit_address and vault_transit_token has been specified] ********************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Add Vault group] ******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Add Vault user] *******************************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver3]
ok: [cloudserver2]

TASK [setup-vault : Include OS-specific variables] ****************************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Check for existing Vault binary] **************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver3]
ok: [cloudserver2]
ok: [cloudserver1]

TASK [setup-vault : Check Vault installation] *********************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver3]
ok: [cloudserver2]

TASK [setup-vault : Get installed Vault version (with architecture check)] ****************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Compute if installation is required] **********************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display installation decision] ***************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}

TASK [setup-vault : Install OS packages and Vault via control host] ***********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Install Vault via HashiCorp repository] *******************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Install OS packages and Vault via remote hosts] ***********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Check Vault mlock capability] *****************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Enable non root mlock capability] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Create directories] ***************************************************************************************************************************************
ok: [beatapostapita] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [vractormania] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [arnialtrashlid] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [micklethefickle] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [beatapostapita] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [vractormania] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [beatapostapita] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [micklethefickle] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [beatapostapita] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [beatapostapita] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [vractormania] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver2] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [cloudserver3] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [cloudserver2] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver3] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver1] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/run/vault', 'mode': '0750'})

TASK [setup-vault : Enable logrotate for vault] *******************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : TLS configuration] ****************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Backend storage TLS configuration] ************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Get content of GCP Credentials from file] *****************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Copy over GCP Credentials for Auto Unseal] ****************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Copy GCP Credentials for gcs backend] *********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault main configuration] *********************************************************************************************************************************
changed: [beatapostapita]
changed: [vractormania]
changed: [arnialtrashlid]
changed: [micklethefickle]
changed: [cloudserver1]
changed: [cloudserver2]
changed: [cloudserver3]

TASK [setup-vault : Vault transit seal configuration] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault awskms seal configuration] **************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault azurekeyvault seal configuration] *******************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Upload Vault license file to vault_license_path] **********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Set Exec output to log path when enabled log] *************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : BSD init script] ******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : SYSV init script] *****************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Debian init script] ***************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Extract systemd version] **********************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Systemd unit] *********************************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Reload systemd] *******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Start Vault] **********************************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Pause to let Vault startup correctly] *********************************************************************************************************************
skipping: [micklethefickle]

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

RUNNING HANDLER [setup-vault : Restart vault] *********************************************************************************************************************************
changed: [beatapostapita]
changed: [vractormania]
changed: [micklethefickle]
changed: [arnialtrashlid]
changed: [cloudserver2]
changed: [cloudserver1]
changed: [cloudserver3]

RUNNING HANDLER [setup-vault : Reload vault] **********************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Compute TLS friendly vault_addr] **************************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Insert http(s) export in dotfile] *************************************************************************************************************************
changed: [beatapostapita]
changed: [arnialtrashlid]
ok: [vractormania]
changed: [micklethefickle]
changed: [cloudserver1]
changed: [cloudserver2]
changed: [cloudserver3]

TASK [setup-vault : Insert CA cert export in dotfile] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Print all Vault-related variables] ***********************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.98.182.207",
        "vault_redirect_address: 100.98.182.207",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.98.182.207:8200",
        "vault_cluster_addr: http://100.98.182.207:8201",
        "vault_cluster_address: 100.98.182.207:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: micklethefickle",
        "ansible_host: 100.98.182.207",
        "network_address: 170.9.225.137",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.78', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:03:bc:56', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.98.182.207",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.111.132.16",
        "vault_redirect_address: 100.111.132.16",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.111.132.16:8200",
        "vault_cluster_addr: http://100.111.132.16:8201",
        "vault_cluster_address: 100.111.132.16:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: beatapostapita",
        "ansible_host: 100.111.132.16",
        "network_address: 149.130.222.229",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.109', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:05:23:92', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.111.132.16",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.94.174.206",
        "vault_redirect_address: 100.94.174.206",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.94.174.206:8200",
        "vault_cluster_addr: http://100.94.174.206:8201",
        "vault_cluster_address: 100.94.174.206:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: vractormania",
        "ansible_host: 100.94.174.206",
        "network_address: 149.130.219.117",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.94.174.206",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.108.164.175",
        "vault_redirect_address: 100.108.164.175",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.108.164.175:8200",
        "vault_cluster_addr: http://100.108.164.175:8201",
        "vault_cluster_address: 100.108.164.175:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver1",
        "ansible_host: 100.108.164.175",
        "network_address: 172.245.88.16",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.16', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:17:3b:5e', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.108.164.175",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.94.174.206",
        "vault_redirect_address: 100.94.174.206",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.94.174.206:8200",
        "vault_cluster_addr: http://100.94.174.206:8201",
        "vault_cluster_address: 100.94.174.206:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: arnialtrashlid",
        "ansible_host: 100.94.174.206",
        "network_address: 150.136.84.225",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.94.174.206",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.89.18.76",
        "vault_redirect_address: 100.89.18.76",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.89.18.76:8200",
        "vault_cluster_addr: http://100.89.18.76:8201",
        "vault_cluster_address: 100.89.18.76:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver2",
        "ansible_host: 100.89.18.76",
        "network_address: 172.245.88.15",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.15', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:75:e6:f5', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.89.18.76",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.93.153.182",
        "vault_redirect_address: 100.93.153.182",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.93.153.182:8200",
        "vault_cluster_addr: http://100.93.153.182:8201",
        "vault_cluster_address: 100.93.153.182:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver3",
        "ansible_host: 100.93.153.182",
        "network_address: 172.245.88.17",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.17', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:4e:fb:3d', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.93.153.182",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Show all network interfaces] *****************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['vethf0acc22', 'tailscale0', 'veth37ef486', 'veth4e963ec', 'veth003390d', 'veth-warp', 'veth1e36a10', 'veth65f3dad', 'veth5e27e1d', 'vethe2d7466', 'veth4d1d7b6', 'veth49240d6', 'veth0705756', 'veth930ad41', 'veth60266b7', 'vethb391566', 'veth3d20ab8', 'vethbbcfd44', 'veth0178b27', 'veth7b910b8', 'veth09ca7f8', 'vethc29f97e', 'vethcdd928b', 'veth934ccf2', 'lo', 'veth9cde36a', 'veth7bd7aed', 'vethc6409e5', 'veth97d4314', 'veth91d02ec', 'veth5d07129', 'vethb737193', 'veth42b1d07', 'veth98e9fd7', 'br-e8e007a130d9', 'vethd7963e2', 'vethb7c69dc', 'vethe1eb32d', 'vethc2f258d', 'vethaad8801', 'docker0', 'br_publicnet', 'veth45c6e94', 'veth327c1eb', 'vethc585994', 'vethbdb808f', 'vethc494640', 'veth4187e42', 'vethf510660', 'veth0f1e636', 'vethc01ee98', 'veth4a62ea9', 'vethcc7f8d4', 'vethe93dc80', 'veth1cd2475', 'vethc397d6b', 'vethb5b7859', 'enp0s6', 'veth1d0c224', 'veth88692e8', 'vethd5543f8', 'br-30602d861856', 'veth8e1171c', 'vethf55a158', 'br-b5be2a962667', 'vethd938a65', 'br_warp-nat-net', 'vethb8a10dc', 'veth1624a12', 'vethc360f30', 'veth961cb99', 'vetheafd9af', 'vethe97dec7', 'veth218be92', 'vethc59c767', 'veth17c1846', 'br_backend', 'vethfffada2', 'vethd786e73', 'veth9c72300', 'veth85050be']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.78', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:03:bc:56', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.98.182.207', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.98.182.207', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:478c:b369:cfd3:77ae:1a03', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::7a44:d8c8:9f3c:2458', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth7b65c57', 'tun1', 'veth1bee009', 'tailscale0', 'veth60f44de', 'veth2e7f8a8', 'br_backend', 'vethcbb8a81', 'br-6fa3dc1f892c', 'vethee41a95', 'veth6a45bed', 'veth224966d', 'vethee297a8', 'veth8d7683c', 'vetha087a25', 'vetha1ef755', 'br-46482b0f96c8', 'vethb94efbc', 'vethe59e7fe', 'vethe080a08', 'veth83b1ac4', 'vethb605a0d', 'veth31eda3c', 'vethe55d933', 'veth7af8f89', 'veth4c7762c', 'veth74c39c3', 'vethf82ccf8', 'veth6341f58', 'veth1a33936', 'veth0108427', 'vethcb0654a', 'veth-warp', 'veth64f18ec', 'br-7b4425e58e3c', 'tun0', 'veth2a6099b', 'veth2fe57aa', 'veth90078bb', 'veth7fd0a3f', 'br_crowdsec_gf', 'veth9b0c644', 'veth7847b4d', 'veth5eaed5e', 'vetha71ba8d', 'veth07d3bf5', 'veth8203509', 'vethe413b48', 'enp0s6', 'veth36be735', 'veth87bcb52', 'veth04c7dc8', 'veth6ecc15a', 'veth156863c', 'vethdcc5972', 'veth6dc969b', 'veth3f9ef01', 'veth3c331c8', 'lo', 'vethd64eeba', 'br_publicnet', 'br_warp-nat-net', 'docker0', 'vethca41113', 'veth7e6f13d', 'veth70cd7aa', 'veth917f151', 'vethfe70699', 'veth04ce03b', 'vethc969cec', 'vethde64da2', 'vethc5389ad', 'veth045fb57', 'br_vpn-network', 'veth7d7bf9d', 'vetha572651', 'veth170bb62', 'veth163cd55', 'veth0bb54b4', 'veth6488890', 'veth6f585a1']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.109', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:05:23:92', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.111.132.16', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.111.132.16', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:812b:c823:ccbf:b039:f92', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::e0a2:576c:7bbc:98d2', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth180054c', 'veth6bcc543', 'br-9013d71b70a6', 'br-4b2d1bcfa835', 'vethfd9406f', 'vethfdeb64b', 'veth1bf6e4d', 'veth1cd4719', 'veth7be89eb', 'veth8f4b693', 'lo', 'veth4093f4b', 'veth76029a7', 'br_warp-network', 'vethccdf7b3', 'vethed32ddc', 'veth203373d', 'veth107fa80', 'veth3a44b70', 'vethf1bfd2a', 'br_publicnet', 'veth0a2dbdb', 'veth20f3bdd', 'veth9edf2ee', 'veth43441ef', 'tailscale0', 'br-07fca800289b', 'veth0c1ccf2', 'br-33f64b8d4c58', 'veth1d416bf', 'vethf6f8b65', 'vetha479a4f', 'veth2f2a28d', 'br-45f4bb80820f', 'veth6bdc8aa', 'vethd838bde', 'enp0s6', 'docker0', 'veth12e30ca', 'veth78736a3', 'vetha3e8ea7', 'vethfe3702d', 'veth36ae789', 'br-e8d0130a60af', 'veth8365dc8', 'br-0ca74fa43b42', 'vetha6ab4dc', 'vethcfc5510', 'veth1a605b3', 'veth78e4d89', 'br-ddee521ff8d2', 'veth350f167', 'br-9d98caf831bb', 'veth6102743', 'veth7e03c3e', 'br-53e4653c7f35', 'veth6ee3673', 'veth37ad922', 'vethba223df']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.94.174.206', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.94.174.206', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:21c0:9a55:44c9:c441:1acf', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::cbee:b4b:7bae:a352', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth1bf6e4d', 'br-9013d71b70a6', 'veth350f167', 'vethcfc5510', 'br-07fca800289b', 'vethf1bfd2a', 'veth7be89eb', 'veth43441ef', 'vethed32ddc', 'vethf6f8b65', 'veth0a2dbdb', 'br-53e4653c7f35', 'veth1d416bf', 'veth4093f4b', 'veth8365dc8', 'veth6ee3673', 'br-33f64b8d4c58', 'br_warp-network', 'br-e8d0130a60af', 'enp0s6', 'vetha479a4f', 'br-0ca74fa43b42', 'veth8f4b693', 'veth78736a3', 'veth20f3bdd', 'veth6bcc543', 'br-9d98caf831bb', 'veth36ae789', 'veth6bdc8aa', 'br_publicnet', 'vethfdeb64b', 'vetha6ab4dc', 'vethfd9406f', 'vetha3e8ea7', 'vethba223df', 'veth76029a7', 'veth6102743', 'veth0c1ccf2', 'veth37ad922', 'veth180054c', 'docker0', 'br-45f4bb80820f', 'veth1a605b3', 'veth3a44b70', 'br-ddee521ff8d2', 'br-4b2d1bcfa835', 'lo', 'veth107fa80', 'tailscale0', 'vethd838bde', 'veth7e03c3e', 'veth2f2a28d', 'veth1cd4719', 'vethfe3702d', 'veth203373d', 'veth78e4d89', 'vethccdf7b3', 'veth9edf2ee', 'veth12e30ca']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.94.174.206', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.94.174.206', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:21c0:9a55:44c9:c441:1acf', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::cbee:b4b:7bae:a352', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth1a84340', 'tailscale0', 'veth9d6687a', 'veth4398fac', 'lo', 'veth7e5e393', 'veth58d57ed', 'veth054ea40', 'vetha5cc81d', 'veth2f40c19', 'veth0a42fe6', 'vethd655229', 'br-c4706e9b9ad2', 'veth16cb492', 'veth43eda78', 'docker0', 'br_warp-network', 'veth17242b7', 'veth553b64c', 'br-5e35e7049f2c', 'br-8d58d793a54e', 'veth0befdc1', 'eth0', 'veth114d988', 'veth7a1d8c5', 'vethc15c512', 'vethadf63ae', 'veth78c4d72']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.16', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:17:3b:5e', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.108.164.175', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.108.164.175', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:e0ef:4ee:1a4e:cf5b:305e', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::fa7e:4b0e:9477:dabd', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['tailscale0', 'br-c17fc902dd7c', 'veth989a716', 'br-f53dbe2492e5', 'vethea522f1', 'veth-warp-host', 'veth05439ba', 'veth165df69', 'vethfe5d9e8', 'vethd515c84', 'br_warp-network', 'veth2149db4', 'lo', 'eth0', 'docker0']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.15', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:75:e6:f5', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.89.18.76', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.89.18.76', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:19dd:af1b:2c92:c73:fb69', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::a923:c7f5:9027:b83f', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth7fd267e', 'veth314f899', 'veth6617a0e', 'veth1aaf697', 'tailscale0', 'br-fe2fbeb471d3', 'eth0', 'vetha87e073', 'veth87c197e', 'br_warp-network', 'docker0', 'vetha4fc465', 'vethaad513b', 'veth74fe498', 'lo', 'veth11b085b', 'veth3432212', 'br-50cad32899be', 'veth6e5c112', 'br-947849b349fa', 'veth008c1da']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.17', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:4e:fb:3d', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.93.153.182', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.93.153.182', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:1dbc:e213:9d6f:b77:6a96', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::be75:6ee2:45c5:6080', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Test basic connectivity to target host] ******************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display ping results] ************************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.98.182.207 (100.98.182.207) 56(84) bytes of data.\n64 bytes from 100.98.182.207: icmp_seq=1 ttl=64 time=0.054 ms\n64 bytes from 100.98.182.207: icmp_seq=2 ttl=64 time=0.049 ms\n64 bytes from 100.98.182.207: icmp_seq=3 ttl=64 time=0.058 ms\n\n--- 100.98.182.207 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2055ms\nrtt min/avg/max/mdev = 0.049/0.053/0.058/0.003 ms",
        "STDERR: "
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.111.132.16 (100.111.132.16) 56(84) bytes of data.\n64 bytes from 100.111.132.16: icmp_seq=1 ttl=64 time=0.050 ms\n64 bytes from 100.111.132.16: icmp_seq=2 ttl=64 time=0.046 ms\n64 bytes from 100.111.132.16: icmp_seq=3 ttl=64 time=0.062 ms\n\n--- 100.111.132.16 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2040ms\nrtt min/avg/max/mdev = 0.046/0.052/0.062/0.006 ms",
        "STDERR: "
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.94.174.206 (100.94.174.206): 56 data bytes\n64 bytes from 100.94.174.206: icmp_seq=0 ttl=64 time=0.153 ms\n64 bytes from 100.94.174.206: icmp_seq=1 ttl=64 time=0.056 ms\n64 bytes from 100.94.174.206: icmp_seq=2 ttl=64 time=0.057 ms\n--- 100.94.174.206 ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss\nround-trip min/avg/max/stddev = 0.056/0.089/0.153/0.045 ms",
        "STDERR: "
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.94.174.206 (100.94.174.206): 56 data bytes\n64 bytes from 100.94.174.206: icmp_seq=0 ttl=64 time=0.107 ms\n64 bytes from 100.94.174.206: icmp_seq=1 ttl=64 time=0.068 ms\n64 bytes from 100.94.174.206: icmp_seq=2 ttl=64 time=0.050 ms\n--- 100.94.174.206 ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss\nround-trip min/avg/max/stddev = 0.050/0.075/0.107/0.024 ms",
        "STDERR: "
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.108.164.175 (100.108.164.175) 56(84) bytes of data.\n64 bytes from 100.108.164.175: icmp_seq=1 ttl=64 time=0.099 ms\n64 bytes from 100.108.164.175: icmp_seq=2 ttl=64 time=0.092 ms\n64 bytes from 100.108.164.175: icmp_seq=3 ttl=64 time=0.088 ms\n\n--- 100.108.164.175 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2038ms\nrtt min/avg/max/mdev = 0.088/0.093/0.099/0.004 ms",
        "STDERR: "
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.89.18.76 (100.89.18.76) 56(84) bytes of data.\n64 bytes from 100.89.18.76: icmp_seq=1 ttl=64 time=0.101 ms\n64 bytes from 100.89.18.76: icmp_seq=2 ttl=64 time=0.082 ms\n64 bytes from 100.89.18.76: icmp_seq=3 ttl=64 time=0.088 ms\n\n--- 100.89.18.76 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2002ms\nrtt min/avg/max/mdev = 0.082/0.090/0.101/0.007 ms",
        "STDERR: "
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.93.153.182 (100.93.153.182) 56(84) bytes of data.\n64 bytes from 100.93.153.182: icmp_seq=1 ttl=64 time=0.137 ms\n64 bytes from 100.93.153.182: icmp_seq=2 ttl=64 time=0.188 ms\n64 bytes from 100.93.153.182: icmp_seq=3 ttl=64 time=0.301 ms\n\n--- 100.93.153.182 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2078ms\nrtt min/avg/max/mdev = 0.137/0.208/0.301/0.068 ms",
        "STDERR: "
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Test port connectivity with telnet] **********************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [micklethefickle]
ok: [arnialtrashlid]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display port connectivity results] ***********************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.98.182.207:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.98.182.207/8200: Connection refused"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.111.132.16:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.111.132.16/8200: Connection refused"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.94.174.206:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.94.174.206/8200: Connection refused"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.94.174.206:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.94.174.206/8200: Connection refused"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.108.164.175:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.108.164.175/8200: Connection refused"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.89.18.76:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.89.18.76/8200: Connection refused"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.93.153.182:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.93.153.182/8200: Connection refused"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Check if Vault service is running] ***********************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display Vault service status] ****************************************************************************************************************
fatal: [micklethefickle]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [beatapostapita]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [vractormania]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [arnialtrashlid]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [cloudserver1]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [cloudserver2]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [cloudserver3]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}

PLAY RECAP ********************************************************************************************************************************************************************
arnialtrashlid             : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
beatapostapita             : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
cloudserver1               : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
cloudserver2               : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
cloudserver3               : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
micklethefickle            : ok=27   changed=3    unreachable=0    failed=1    skipped=29   rescued=0    ignored=0   
vractormania               : ok=27   changed=2    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   

make: *** [Makefile:81: vault] Error 2
root@beatapostapita:/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab# make vault
Installing Ansible requirements...
command: "/bin/bash -c "ansible-galaxy install -r /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/requirements.yml"
Starting galaxy role install process
- setup-docker is already installed, skipping.
- setup-nomad is already installed, skipping.
- setup-consul is already installed, skipping.
- setup-vault is already installed, skipping.
- setup-caddy is already installed, skipping.
- setup-consul-template is already installed, skipping.
- setup-cloudflared is already installed, skipping.
Requirements installed successfully.
Deploying Vault components...
command: "/bin/bash -c "ansible-playbook -i /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/hosts.yml /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/site.yml --tags vault"

PLAY [nomad_cluster] **********************************************************************************************************************************************************

TASK [Gathering Facts] ********************************************************************************************************************************************************
ok: [vractormania]
ok: [arnialtrashlid]
ok: [beatapostapita]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-consul : Include OS-specific variables] ***************************************************************************************************************************
ok: [micklethefickle] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [beatapostapita] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [vractormania] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [arnialtrashlid] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver1] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver2] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver3] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)

TASK [setup-vault : Include asserts] ******************************************************************************************************************************************
included: /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-vault/tasks/asserts.yml for micklethefickle, beatapostapita, vractormania, arnialtrashlid, cloudserver1, cloudserver2, cloudserver3

TASK [setup-vault : Check distribution compatibility] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Red Hat / CentOS] ************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Debian] **********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of FreeBSD] *********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Ubuntu] **********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Check for vault_redirect_address usage] *******************************************************************************************************************
ok: [micklethefickle] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [beatapostapita] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [vractormania] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [arnialtrashlid] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver1] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver2] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver3] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}

TASK [setup-vault : Check if vault_transit_address and vault_transit_token has been specified] ********************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Add Vault group] ******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Add Vault user] *******************************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Include OS-specific variables] ****************************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Check for existing Vault binary] **************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver3]
ok: [cloudserver1]

TASK [setup-vault : Check Vault installation] *********************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Get installed Vault version (with architecture check)] ****************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Compute if installation is required] **********************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display installation decision] ***************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}

TASK [setup-vault : Install OS packages and Vault via control host] ***********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Install Vault via HashiCorp repository] *******************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Install OS packages and Vault via remote hosts] ***********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Check Vault mlock capability] *****************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Enable non root mlock capability] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Create directories] ***************************************************************************************************************************************
ok: [beatapostapita] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [arnialtrashlid] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [micklethefickle] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [vractormania] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [beatapostapita] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [arnialtrashlid] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [vractormania] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [micklethefickle] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [beatapostapita] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [beatapostapita] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [beatapostapita] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver2] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [micklethefickle] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [cloudserver1] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver3] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver1] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/run/vault', 'mode': '0750'})

TASK [setup-vault : Enable logrotate for vault] *******************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : TLS configuration] ****************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Backend storage TLS configuration] ************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Get content of GCP Credentials from file] *****************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Copy over GCP Credentials for Auto Unseal] ****************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Copy GCP Credentials for gcs backend] *********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault main configuration] *********************************************************************************************************************************
changed: [beatapostapita]
changed: [vractormania]
ok: [arnialtrashlid]
changed: [micklethefickle]
changed: [cloudserver1]
changed: [cloudserver2]
changed: [cloudserver3]

TASK [setup-vault : Vault transit seal configuration] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault awskms seal configuration] **************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault azurekeyvault seal configuration] *******************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Upload Vault license file to vault_license_path] **********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Set Exec output to log path when enabled log] *************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : BSD init script] ******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : SYSV init script] *****************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Debian init script] ***************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Extract systemd version] **********************************************************************************************************************************
ok: [beatapostapita]
ok: [micklethefickle]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Systemd unit] *********************************************************************************************************************************************
ok: [beatapostapita]
ok: [micklethefickle]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Reload systemd] *******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Start Vault] **********************************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Pause to let Vault startup correctly] *********************************************************************************************************************
skipping: [micklethefickle]

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

RUNNING HANDLER [setup-vault : Restart vault] *********************************************************************************************************************************
changed: [vractormania]
changed: [micklethefickle]
changed: [beatapostapita]
changed: [cloudserver2]
changed: [cloudserver3]
changed: [cloudserver1]

RUNNING HANDLER [setup-vault : Reload vault] **********************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]

TASK [setup-vault : Reload vault] *********************************************************************************************************************************************
ok: [arnialtrashlid]

RUNNING HANDLER [setup-vault : Reload vault] **********************************************************************************************************************************
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Compute TLS friendly vault_addr] **************************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Insert http(s) export in dotfile] *************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Insert CA cert export in dotfile] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Print all Vault-related variables] ***********************************************************************************************************
ok: [beatapostapita] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.111.132.16",
        "vault_redirect_address: 100.111.132.16",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.111.132.16:8200",
        "vault_cluster_addr: http://100.111.132.16:8201",
        "vault_cluster_address: 100.111.132.16:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: beatapostapita",
        "ansible_host: 100.111.132.16",
        "network_address: 149.130.222.229",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.109', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:05:23:92', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.111.132.16",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [micklethefickle] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.98.182.207",
        "vault_redirect_address: 100.98.182.207",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.98.182.207:8200",
        "vault_cluster_addr: http://100.98.182.207:8201",
        "vault_cluster_address: 100.98.182.207:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: micklethefickle",
        "ansible_host: 100.98.182.207",
        "network_address: 170.9.225.137",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.78', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:03:bc:56', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.98.182.207",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.108.164.175",
        "vault_redirect_address: 100.108.164.175",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.108.164.175:8200",
        "vault_cluster_addr: http://100.108.164.175:8201",
        "vault_cluster_address: 100.108.164.175:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver1",
        "ansible_host: 100.108.164.175",
        "network_address: 172.245.88.16",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.16', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:17:3b:5e', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.108.164.175",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.94.174.206",
        "vault_redirect_address: 100.94.174.206",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.94.174.206:8200",
        "vault_cluster_addr: http://100.94.174.206:8201",
        "vault_cluster_address: 100.94.174.206:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: arnialtrashlid",
        "ansible_host: 100.94.174.206",
        "network_address: 150.136.84.225",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.94.174.206",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.94.174.206",
        "vault_redirect_address: 100.94.174.206",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.94.174.206:8200",
        "vault_cluster_addr: http://100.94.174.206:8201",
        "vault_cluster_address: 100.94.174.206:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: vractormania",
        "ansible_host: 100.94.174.206",
        "network_address: 149.130.219.117",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.94.174.206",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.89.18.76",
        "vault_redirect_address: 100.89.18.76",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.89.18.76:8200",
        "vault_cluster_addr: http://100.89.18.76:8201",
        "vault_cluster_address: 100.89.18.76:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver2",
        "ansible_host: 100.89.18.76",
        "network_address: 172.245.88.15",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.15', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:75:e6:f5', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.89.18.76",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.93.153.182",
        "vault_redirect_address: 100.93.153.182",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.93.153.182:8200",
        "vault_cluster_addr: http://100.93.153.182:8201",
        "vault_cluster_address: 100.93.153.182:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver3",
        "ansible_host: 100.93.153.182",
        "network_address: 172.245.88.17",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.17', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:4e:fb:3d', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.93.153.182",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Show all network interfaces] *****************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['vethe93dc80', 'veth003390d', 'lo', 'veth5d07129', 'vethe1eb32d', 'vethc494640', 'veth-warp', 'vethd938a65', 'vethc397d6b', 'veth60266b7', 'vethf510660', 'veth930ad41', 'veth327c1eb', 'vethc01ee98', 'veth91d02ec', 'vethf0acc22', 'br-e8e007a130d9', 'vethbdb808f', 'veth1d0c224', 'vethc59c767', 'br-30602d861856', 'vethfffada2', 'veth9c72300', 'veth7bd7aed', 'enp0s6', 'vethc29f97e', 'vethbbcfd44', 'vethe97dec7', 'veth45c6e94', 'vethcc7f8d4', 'veth42b1d07', 'veth0705756', 'veth1624a12', 'vethc2f258d', 'veth4a62ea9', 'vethb737193', 'vethc6409e5', 'veth5e27e1d', 'veth3d20ab8', 'br_backend', 'vethcdd928b', 'veth98e9fd7', 'docker0', 'veth97d4314', 'veth218be92', 'vethc360f30', 'veth17c1846', 'veth1cd2475', 'vethd786e73', 'vethaad8801', 'veth65f3dad', 'veth4187e42', 'br-b5be2a962667', 'veth9cde36a', 'veth37ef486', 'vethb391566', 'vethb7c69dc', 'veth88692e8', 'vethd7963e2', 'veth85050be', 'br_publicnet', 'vethd5543f8', 'veth934ccf2', 'veth8e1171c', 'vethf55a158', 'vethc585994', 'veth961cb99', 'vetheafd9af', 'veth4e963ec', 'vethb5b7859', 'br_warp-nat-net', 'vethe2d7466', 'veth1e36a10', 'veth4d1d7b6', 'vethb8a10dc', 'veth0178b27', 'veth09ca7f8', 'tailscale0', 'veth7b910b8', 'veth0f1e636', 'veth49240d6']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.78', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:03:bc:56', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.98.182.207', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.98.182.207', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:478c:b369:cfd3:77ae:1a03', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::7a44:d8c8:9f3c:2458', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['vethcbb8a81', 'veth7e6f13d', 'tun1', 'veth64f18ec', 'veth6f585a1', 'veth74c39c3', 'veth90078bb', 'br_warp-nat-net', 'veth1a33936', 'veth917f151', 'vethcb0654a', 'veth4c7762c', 'veth6488890', 'br_publicnet', 'tun0', 'veth6a45bed', 'veth7af8f89', 'vethf82ccf8', 'vethb94efbc', 'vetha71ba8d', 'veth7d7bf9d', 'veth3f9ef01', 'vethde64da2', 'veth170bb62', 'vethd64eeba', 'vethfe70699', 'veth0bb54b4', 'veth-warp', 'br_crowdsec_gf', 'vetha1ef755', 'veth7847b4d', 'veth36be735', 'veth07d3bf5', 'veth31eda3c', 'veth5eaed5e', 'veth2fe57aa', 'tailscale0', 'veth224966d', 'veth9b0c644', 'veth3c331c8', 'veth8d7683c', 'veth8203509', 'veth2e7f8a8', 'vethe080a08', 'veth1bee009', 'vethee297a8', 'veth2a6099b', 'vethc5389ad', 'vethe59e7fe', 'br_backend', 'br_vpn-network', 'veth6ecc15a', 'veth6341f58', 'veth87bcb52', 'veth6dc969b', 'vethc969cec', 'br-46482b0f96c8', 'vethe55d933', 'veth7b65c57', 'veth7fd0a3f', 'veth60f44de', 'veth04ce03b', 'veth045fb57', 'vethca41113', 'vethee41a95', 'veth83b1ac4', 'docker0', 'veth156863c', 'vetha087a25', 'vethb605a0d', 'br-6fa3dc1f892c', 'vetha572651', 'veth70cd7aa', 'veth04c7dc8', 'lo', 'veth163cd55', 'enp0s6', 'veth0108427', 'vethe413b48', 'vethdcc5972', 'br-7b4425e58e3c']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.109', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:05:23:92', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.111.132.16', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.111.132.16', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:812b:c823:ccbf:b039:f92', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::e0a2:576c:7bbc:98d2', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth107fa80', 'lo', 'vetha6ab4dc', 'tailscale0', 'veth1d416bf', 'veth350f167', 'veth37ad922', 'veth9edf2ee', 'veth8f4b693', 'veth6ee3673', 'vethf1bfd2a', 'vethfdeb64b', 'veth203373d', 'br-e8d0130a60af', 'docker0', 'veth0c1ccf2', 'veth78e4d89', 'veth20f3bdd', 'br-33f64b8d4c58', 'veth6bcc543', 'veth78736a3', 'veth0a2dbdb', 'veth12e30ca', 'br_warp-network', 'br-45f4bb80820f', 'veth1cd4719', 'veth1a605b3', 'veth1bf6e4d', 'veth76029a7', 'veth6102743', 'veth180054c', 'veth7e03c3e', 'vethfd9406f', 'br-0ca74fa43b42', 'veth2f2a28d', 'vethed32ddc', 'vetha479a4f', 'vethccdf7b3', 'vethfe3702d', 'veth3a44b70', 'veth7be89eb', 'enp0s6', 'veth4093f4b', 'vethf6f8b65', 'br-ddee521ff8d2', 'veth8365dc8', 'vethd838bde', 'br-9d98caf831bb', 'br-9013d71b70a6', 'vethcfc5510', 'veth36ae789', 'br_publicnet', 'veth43441ef', 'vetha3e8ea7', 'br-53e4653c7f35', 'br-4b2d1bcfa835', 'vethba223df', 'br-07fca800289b', 'veth6bdc8aa']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.94.174.206', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.94.174.206', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:21c0:9a55:44c9:c441:1acf', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::cbee:b4b:7bae:a352', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['vethfe3702d', 'veth3a44b70', 'vethfdeb64b', 'veth107fa80', 'vetha6ab4dc', 'veth78736a3', 'veth1cd4719', 'veth12e30ca', 'veth7e03c3e', 'br-53e4653c7f35', 'br-33f64b8d4c58', 'veth0a2dbdb', 'veth20f3bdd', 'veth6bdc8aa', 'docker0', 'veth9edf2ee', 'veth1a605b3', 'veth350f167', 'veth6bcc543', 'veth37ad922', 'br-07fca800289b', 'veth1bf6e4d', 'vethd838bde', 'br-45f4bb80820f', 'br-e8d0130a60af', 'veth36ae789', 'veth2f2a28d', 'veth180054c', 'vethcfc5510', 'vetha3e8ea7', 'vethfd9406f', 'vethf6f8b65', 'vethf1bfd2a', 'br-4b2d1bcfa835', 'veth1d416bf', 'br-9d98caf831bb', 'veth76029a7', 'vethba223df', 'br_warp-network', 'tailscale0', 'vetha479a4f', 'br_publicnet', 'veth8f4b693', 'br-9013d71b70a6', 'veth203373d', 'vethccdf7b3', 'veth4093f4b', 'veth0c1ccf2', 'veth6102743', 'veth43441ef', 'br-ddee521ff8d2', 'veth6ee3673', 'veth78e4d89', 'enp0s6', 'lo', 'vethed32ddc', 'br-0ca74fa43b42', 'veth8365dc8', 'veth7be89eb']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.94.174.206', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.94.174.206', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:21c0:9a55:44c9:c441:1acf', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::cbee:b4b:7bae:a352', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth2f40c19', 'br-5e35e7049f2c', 'veth17242b7', 'vethd655229', 'veth054ea40', 'veth0a42fe6', 'docker0', 'veth553b64c', 'br_warp-network', 'tailscale0', 'eth0', 'veth1a84340', 'vethc15c512', 'veth4398fac', 'br-c4706e9b9ad2', 'br-8d58d793a54e', 'veth114d988', 'vetha5cc81d', 'veth43eda78', 'veth9d6687a', 'vethadf63ae', 'veth7e5e393', 'veth58d57ed', 'veth7a1d8c5', 'veth0befdc1', 'veth78c4d72', 'veth16cb492', 'lo']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.16', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:17:3b:5e', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.108.164.175', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.108.164.175', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:e0ef:4ee:1a4e:cf5b:305e', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::fa7e:4b0e:9477:dabd', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['eth0', 'vethfe5d9e8', 'veth2149db4', 'veth989a716', 'docker0', 'lo', 'br-f53dbe2492e5', 'vethea522f1', 'tailscale0', 'br-c17fc902dd7c', 'br_warp-network', 'veth165df69', 'veth-warp-host', 'veth05439ba', 'vethd515c84']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.15', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:75:e6:f5', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.89.18.76', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.89.18.76', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:19dd:af1b:2c92:c73:fb69', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::a923:c7f5:9027:b83f', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['docker0', 'vetha87e073', 'veth3432212', 'veth008c1da', 'veth11b085b', 'tailscale0', 'eth0', 'vethaad513b', 'veth1aaf697', 'vethb271846', 'veth6617a0e', 'veth6e5c112', 'br_warp-network', 'br-50cad32899be', 'br-fe2fbeb471d3', 'veth314f899', 'vetha4fc465', 'br-947849b349fa', 'veth74fe498', 'lo', 'veth87c197e']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.17', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:4e:fb:3d', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.93.153.182', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.93.153.182', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:1dbc:e213:9d6f:b77:6a96', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::be75:6ee2:45c5:6080', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Test basic connectivity to target host] ******************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver3]
ok: [cloudserver2]

TASK [setup-vault : [DIAGNOSTIC] Display ping results] ************************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.98.182.207 (100.98.182.207) 56(84) bytes of data.\n64 bytes from 100.98.182.207: icmp_seq=1 ttl=64 time=0.060 ms\n64 bytes from 100.98.182.207: icmp_seq=2 ttl=64 time=0.045 ms\n64 bytes from 100.98.182.207: icmp_seq=3 ttl=64 time=0.043 ms\n\n--- 100.98.182.207 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2069ms\nrtt min/avg/max/mdev = 0.043/0.049/0.060/0.007 ms",
        "STDERR: "
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.111.132.16 (100.111.132.16) 56(84) bytes of data.\n64 bytes from 100.111.132.16: icmp_seq=1 ttl=64 time=0.049 ms\n64 bytes from 100.111.132.16: icmp_seq=2 ttl=64 time=0.056 ms\n64 bytes from 100.111.132.16: icmp_seq=3 ttl=64 time=0.057 ms\n\n--- 100.111.132.16 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2076ms\nrtt min/avg/max/mdev = 0.049/0.054/0.057/0.003 ms",
        "STDERR: "
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.94.174.206 (100.94.174.206): 56 data bytes\n64 bytes from 100.94.174.206: icmp_seq=0 ttl=64 time=0.076 ms\n64 bytes from 100.94.174.206: icmp_seq=1 ttl=64 time=0.071 ms\n64 bytes from 100.94.174.206: icmp_seq=2 ttl=64 time=0.084 ms\n--- 100.94.174.206 ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss\nround-trip min/avg/max/stddev = 0.071/0.077/0.084/0.000 ms",
        "STDERR: "
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.94.174.206 (100.94.174.206): 56 data bytes\n64 bytes from 100.94.174.206: icmp_seq=0 ttl=64 time=0.085 ms\n64 bytes from 100.94.174.206: icmp_seq=1 ttl=64 time=0.072 ms\n64 bytes from 100.94.174.206: icmp_seq=2 ttl=64 time=0.042 ms\n--- 100.94.174.206 ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss\nround-trip min/avg/max/stddev = 0.042/0.066/0.085/0.000 ms",
        "STDERR: "
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.108.164.175 (100.108.164.175) 56(84) bytes of data.\n64 bytes from 100.108.164.175: icmp_seq=1 ttl=64 time=0.109 ms\n64 bytes from 100.108.164.175: icmp_seq=2 ttl=64 time=0.091 ms\n64 bytes from 100.108.164.175: icmp_seq=3 ttl=64 time=0.084 ms\n\n--- 100.108.164.175 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2051ms\nrtt min/avg/max/mdev = 0.084/0.094/0.109/0.010 ms",
        "STDERR: "
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.89.18.76 (100.89.18.76) 56(84) bytes of data.\n64 bytes from 100.89.18.76: icmp_seq=1 ttl=64 time=0.150 ms\n64 bytes from 100.89.18.76: icmp_seq=2 ttl=64 time=0.097 ms\n64 bytes from 100.89.18.76: icmp_seq=3 ttl=64 time=0.088 ms\n\n--- 100.89.18.76 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2077ms\nrtt min/avg/max/mdev = 0.088/0.111/0.150/0.027 ms",
        "STDERR: "
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.93.153.182 (100.93.153.182) 56(84) bytes of data.\n64 bytes from 100.93.153.182: icmp_seq=1 ttl=64 time=0.144 ms\n64 bytes from 100.93.153.182: icmp_seq=2 ttl=64 time=0.086 ms\n64 bytes from 100.93.153.182: icmp_seq=3 ttl=64 time=0.113 ms\n\n--- 100.93.153.182 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2084ms\nrtt min/avg/max/mdev = 0.086/0.114/0.144/0.023 ms",
        "STDERR: "
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Test port connectivity with telnet] **********************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display port connectivity results] ***********************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.98.182.207:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.98.182.207/8200: Connection refused"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.111.132.16:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.111.132.16/8200: Connection refused"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.94.174.206:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.94.174.206/8200: Connection refused"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.94.174.206:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.94.174.206/8200: Connection refused"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.108.164.175:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.108.164.175/8200: Connection refused"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.89.18.76:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.89.18.76/8200: Connection refused"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.93.153.182:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.93.153.182/8200: Connection refused"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Check if Vault service is running] ***********************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
^C [ERROR]: User interrupted execution
make: *** [Makefile:81: vault] Error 99
```

Fuck am i doing wrong here?

## Assistant

_Time: 2025-09-17T22:30:22.801Z_

The template error in your first run crashes the playbook because the Jinja string in that diagnostic task is broken—it's an incomplete if-block without closing tags or content (looks like a bug in the setup-vault role from whatever Galaxy collection you're using). The string "{% if 'vault.service' in ansible_facts.services %}" needs %} and then actual output logic, plus an endif. Edit the role's tasks file (probably roles/setup-vault/tasks/main.yml or a diagnostic.yml include) to fix it, like this minimal patch:

```
{% if 'vault.service' in ansible_facts.services %}
Service is present.
{% endif %}
```

That solved the crash compared to before, where the playbook died early.

Your second run progresses but still fails to make Vault listen on port 8200—connection refused means the service isn't bound/running on that interface/port at all, not just sealed or uninitialized (Vault still accepts connections in those states). This fixes the old non-listening problem by restarting after config changes, but Vault is crashing or misconfigured. Check logs with `systemctl status vault` or `journalctl -u vault` on each host (e.g., beatapostapita). Likely culprits:

- Vault binds to vault_address (Tailscale tunnel IP like 100.x.x.x), but your hosts' default IPv4 is on enp0s6/eth0 (private LAN). If Tailscale is flaky or Vault can't bind to tailscale0 iface, it fails. Set vault_address to the LAN IP or 0.0.0.0 to listen everywhere.
- Config changed (TASK [setup-vault : Vault main configuration] shows 'changed'), so bad HCL in /etc/vault.d/vault.hcl—maybe invalid storage backend (no Consul running?), seal config, or license missing if enterprise. Validate with `vault operator diagnose`.
- Firewall: ufw/iptables blocking 8200/8201 even on loopback. Run `ufw allow 8200` or equivalent.
- Resource starvation: Low mem/CPU on cloudserverX hosts could kill Vault startup (check dmesg for OOM).

Run `vault status -address=http://<host_tailscale_ip>:8200` manually on a host to test; if errors, fix config and `systemctl restart vault`. Don't Ctrl+C mid-playbook—it leaves partial state. Rerun with -vvv for more debug.

This setup solves scattered Vault deploys over VPN tunnels compared to plain LAN, but it's brittle if Tailscale drops. If you want simpler, ditch Tailscale binding and use public IPs/firewall—clearly better for uptime unless VPN is mandatory. Rerun after fixes; if still stuck, paste Vault logs.

## User

_Time: 2025-09-17T22:31:29.575Z_

```
root@beatapostapita:/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab# make vault
Installing Ansible requirements...
command: "/bin/bash -c "ansible-galaxy install -r /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/requirements.yml"
Starting galaxy role install process
- setup-docker is already installed, skipping.
- setup-nomad is already installed, skipping.
- setup-consul is already installed, skipping.
- setup-vault is already installed, skipping.
- setup-caddy is already installed, skipping.
- setup-consul-template is already installed, skipping.
- setup-cloudflared is already installed, skipping.
Requirements installed successfully.
Deploying Vault components...
command: "/bin/bash -c "ansible-playbook -i /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/hosts.yml /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/site.yml --tags vault"

PLAY [nomad_cluster] **********************************************************************************************************************************************************

TASK [Gathering Facts] ********************************************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-consul : Include OS-specific variables] ***************************************************************************************************************************
ok: [micklethefickle] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [beatapostapita] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [vractormania] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [arnialtrashlid] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver1] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver2] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver3] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)

TASK [setup-vault : Include asserts] ******************************************************************************************************************************************
included: /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-vault/tasks/asserts.yml for micklethefickle, beatapostapita, vractormania, arnialtrashlid, cloudserver1, cloudserver2, cloudserver3

TASK [setup-vault : Check distribution compatibility] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Red Hat / CentOS] ************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Debian] **********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of FreeBSD] *********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Ubuntu] **********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Check for vault_redirect_address usage] *******************************************************************************************************************
ok: [micklethefickle] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [beatapostapita] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [vractormania] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [arnialtrashlid] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver1] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver2] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver3] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}

TASK [setup-vault : Check if vault_transit_address and vault_transit_token has been specified] ********************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Add Vault group] ******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Add Vault user] *******************************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver3]
ok: [cloudserver2]

TASK [setup-vault : Include OS-specific variables] ****************************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Check for existing Vault binary] **************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver3]
ok: [cloudserver2]
ok: [cloudserver1]

TASK [setup-vault : Check Vault installation] *********************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver3]
ok: [cloudserver2]

TASK [setup-vault : Get installed Vault version (with architecture check)] ****************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Compute if installation is required] **********************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display installation decision] ***************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}

TASK [setup-vault : Install OS packages and Vault via control host] ***********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Install Vault via HashiCorp repository] *******************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Install OS packages and Vault via remote hosts] ***********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Check Vault mlock capability] *****************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Enable non root mlock capability] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Create directories] ***************************************************************************************************************************************
ok: [beatapostapita] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [vractormania] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [arnialtrashlid] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [micklethefickle] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [beatapostapita] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [vractormania] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [beatapostapita] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [micklethefickle] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [beatapostapita] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [beatapostapita] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [vractormania] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver2] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [cloudserver3] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [cloudserver2] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver3] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver1] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/run/vault', 'mode': '0750'})

TASK [setup-vault : Enable logrotate for vault] *******************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : TLS configuration] ****************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Backend storage TLS configuration] ************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Get content of GCP Credentials from file] *****************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Copy over GCP Credentials for Auto Unseal] ****************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Copy GCP Credentials for gcs backend] *********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault main configuration] *********************************************************************************************************************************
changed: [beatapostapita]
changed: [vractormania]
changed: [arnialtrashlid]
changed: [micklethefickle]
changed: [cloudserver1]
changed: [cloudserver2]
changed: [cloudserver3]

TASK [setup-vault : Vault transit seal configuration] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault awskms seal configuration] **************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault azurekeyvault seal configuration] *******************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Upload Vault license file to vault_license_path] **********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Set Exec output to log path when enabled log] *************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : BSD init script] ******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : SYSV init script] *****************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Debian init script] ***************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Extract systemd version] **********************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Systemd unit] *********************************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Reload systemd] *******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Start Vault] **********************************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Pause to let Vault startup correctly] *********************************************************************************************************************
skipping: [micklethefickle]

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

RUNNING HANDLER [setup-vault : Restart vault] *********************************************************************************************************************************
changed: [beatapostapita]
changed: [vractormania]
changed: [micklethefickle]
changed: [arnialtrashlid]
changed: [cloudserver2]
changed: [cloudserver1]
changed: [cloudserver3]

RUNNING HANDLER [setup-vault : Reload vault] **********************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Compute TLS friendly vault_addr] **************************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Insert http(s) export in dotfile] *************************************************************************************************************************
changed: [beatapostapita]
changed: [arnialtrashlid]
ok: [vractormania]
changed: [micklethefickle]
changed: [cloudserver1]
changed: [cloudserver2]
changed: [cloudserver3]

TASK [setup-vault : Insert CA cert export in dotfile] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Print all Vault-related variables] ***********************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.98.182.207",
        "vault_redirect_address: 100.98.182.207",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.98.182.207:8200",
        "vault_cluster_addr: http://100.98.182.207:8201",
        "vault_cluster_address: 100.98.182.207:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: micklethefickle",
        "ansible_host: 100.98.182.207",
        "network_address: 170.9.225.137",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.78', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:03:bc:56', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.98.182.207",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.111.132.16",
        "vault_redirect_address: 100.111.132.16",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.111.132.16:8200",
        "vault_cluster_addr: http://100.111.132.16:8201",
        "vault_cluster_address: 100.111.132.16:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: beatapostapita",
        "ansible_host: 100.111.132.16",
        "network_address: 149.130.222.229",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.109', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:05:23:92', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.111.132.16",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.94.174.206",
        "vault_redirect_address: 100.94.174.206",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.94.174.206:8200",
        "vault_cluster_addr: http://100.94.174.206:8201",
        "vault_cluster_address: 100.94.174.206:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: vractormania",
        "ansible_host: 100.94.174.206",
        "network_address: 149.130.219.117",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.94.174.206",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.108.164.175",
        "vault_redirect_address: 100.108.164.175",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.108.164.175:8200",
        "vault_cluster_addr: http://100.108.164.175:8201",
        "vault_cluster_address: 100.108.164.175:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver1",
        "ansible_host: 100.108.164.175",
        "network_address: 172.245.88.16",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.16', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:17:3b:5e', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.108.164.175",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.94.174.206",
        "vault_redirect_address: 100.94.174.206",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.94.174.206:8200",
        "vault_cluster_addr: http://100.94.174.206:8201",
        "vault_cluster_address: 100.94.174.206:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: arnialtrashlid",
        "ansible_host: 100.94.174.206",
        "network_address: 150.136.84.225",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.94.174.206",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.89.18.76",
        "vault_redirect_address: 100.89.18.76",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.89.18.76:8200",
        "vault_cluster_addr: http://100.89.18.76:8201",
        "vault_cluster_address: 100.89.18.76:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver2",
        "ansible_host: 100.89.18.76",
        "network_address: 172.245.88.15",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.15', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:75:e6:f5', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.89.18.76",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.93.153.182",
        "vault_redirect_address: 100.93.153.182",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.93.153.182:8200",
        "vault_cluster_addr: http://100.93.153.182:8201",
        "vault_cluster_address: 100.93.153.182:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver3",
        "ansible_host: 100.93.153.182",
        "network_address: 172.245.88.17",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.17', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:4e:fb:3d', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.93.153.182",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Show all network interfaces] *****************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['vethf0acc22', 'tailscale0', 'veth37ef486', 'veth4e963ec', 'veth003390d', 'veth-warp', 'veth1e36a10', 'veth65f3dad', 'veth5e27e1d', 'vethe2d7466', 'veth4d1d7b6', 'veth49240d6', 'veth0705756', 'veth930ad41', 'veth60266b7', 'vethb391566', 'veth3d20ab8', 'vethbbcfd44', 'veth0178b27', 'veth7b910b8', 'veth09ca7f8', 'vethc29f97e', 'vethcdd928b', 'veth934ccf2', 'lo', 'veth9cde36a', 'veth7bd7aed', 'vethc6409e5', 'veth97d4314', 'veth91d02ec', 'veth5d07129', 'vethb737193', 'veth42b1d07', 'veth98e9fd7', 'br-e8e007a130d9', 'vethd7963e2', 'vethb7c69dc', 'vethe1eb32d', 'vethc2f258d', 'vethaad8801', 'docker0', 'br_publicnet', 'veth45c6e94', 'veth327c1eb', 'vethc585994', 'vethbdb808f', 'vethc494640', 'veth4187e42', 'vethf510660', 'veth0f1e636', 'vethc01ee98', 'veth4a62ea9', 'vethcc7f8d4', 'vethe93dc80', 'veth1cd2475', 'vethc397d6b', 'vethb5b7859', 'enp0s6', 'veth1d0c224', 'veth88692e8', 'vethd5543f8', 'br-30602d861856', 'veth8e1171c', 'vethf55a158', 'br-b5be2a962667', 'vethd938a65', 'br_warp-nat-net', 'vethb8a10dc', 'veth1624a12', 'vethc360f30', 'veth961cb99', 'vetheafd9af', 'vethe97dec7', 'veth218be92', 'vethc59c767', 'veth17c1846', 'br_backend', 'vethfffada2', 'vethd786e73', 'veth9c72300', 'veth85050be']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.78', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:03:bc:56', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.98.182.207', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.98.182.207', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:478c:b369:cfd3:77ae:1a03', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::7a44:d8c8:9f3c:2458', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth7b65c57', 'tun1', 'veth1bee009', 'tailscale0', 'veth60f44de', 'veth2e7f8a8', 'br_backend', 'vethcbb8a81', 'br-6fa3dc1f892c', 'vethee41a95', 'veth6a45bed', 'veth224966d', 'vethee297a8', 'veth8d7683c', 'vetha087a25', 'vetha1ef755', 'br-46482b0f96c8', 'vethb94efbc', 'vethe59e7fe', 'vethe080a08', 'veth83b1ac4', 'vethb605a0d', 'veth31eda3c', 'vethe55d933', 'veth7af8f89', 'veth4c7762c', 'veth74c39c3', 'vethf82ccf8', 'veth6341f58', 'veth1a33936', 'veth0108427', 'vethcb0654a', 'veth-warp', 'veth64f18ec', 'br-7b4425e58e3c', 'tun0', 'veth2a6099b', 'veth2fe57aa', 'veth90078bb', 'veth7fd0a3f', 'br_crowdsec_gf', 'veth9b0c644', 'veth7847b4d', 'veth5eaed5e', 'vetha71ba8d', 'veth07d3bf5', 'veth8203509', 'vethe413b48', 'enp0s6', 'veth36be735', 'veth87bcb52', 'veth04c7dc8', 'veth6ecc15a', 'veth156863c', 'vethdcc5972', 'veth6dc969b', 'veth3f9ef01', 'veth3c331c8', 'lo', 'vethd64eeba', 'br_publicnet', 'br_warp-nat-net', 'docker0', 'vethca41113', 'veth7e6f13d', 'veth70cd7aa', 'veth917f151', 'vethfe70699', 'veth04ce03b', 'vethc969cec', 'vethde64da2', 'vethc5389ad', 'veth045fb57', 'br_vpn-network', 'veth7d7bf9d', 'vetha572651', 'veth170bb62', 'veth163cd55', 'veth0bb54b4', 'veth6488890', 'veth6f585a1']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.109', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:05:23:92', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.111.132.16', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.111.132.16', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:812b:c823:ccbf:b039:f92', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::e0a2:576c:7bbc:98d2', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth180054c', 'veth6bcc543', 'br-9013d71b70a6', 'br-4b2d1bcfa835', 'vethfd9406f', 'vethfdeb64b', 'veth1bf6e4d', 'veth1cd4719', 'veth7be89eb', 'veth8f4b693', 'lo', 'veth4093f4b', 'veth76029a7', 'br_warp-network', 'vethccdf7b3', 'vethed32ddc', 'veth203373d', 'veth107fa80', 'veth3a44b70', 'vethf1bfd2a', 'br_publicnet', 'veth0a2dbdb', 'veth20f3bdd', 'veth9edf2ee', 'veth43441ef', 'tailscale0', 'br-07fca800289b', 'veth0c1ccf2', 'br-33f64b8d4c58', 'veth1d416bf', 'vethf6f8b65', 'vetha479a4f', 'veth2f2a28d', 'br-45f4bb80820f', 'veth6bdc8aa', 'vethd838bde', 'enp0s6', 'docker0', 'veth12e30ca', 'veth78736a3', 'vetha3e8ea7', 'vethfe3702d', 'veth36ae789', 'br-e8d0130a60af', 'veth8365dc8', 'br-0ca74fa43b42', 'vetha6ab4dc', 'vethcfc5510', 'veth1a605b3', 'veth78e4d89', 'br-ddee521ff8d2', 'veth350f167', 'br-9d98caf831bb', 'veth6102743', 'veth7e03c3e', 'br-53e4653c7f35', 'veth6ee3673', 'veth37ad922', 'vethba223df']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.94.174.206', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.94.174.206', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:21c0:9a55:44c9:c441:1acf', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::cbee:b4b:7bae:a352', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth1bf6e4d', 'br-9013d71b70a6', 'veth350f167', 'vethcfc5510', 'br-07fca800289b', 'vethf1bfd2a', 'veth7be89eb', 'veth43441ef', 'vethed32ddc', 'vethf6f8b65', 'veth0a2dbdb', 'br-53e4653c7f35', 'veth1d416bf', 'veth4093f4b', 'veth8365dc8', 'veth6ee3673', 'br-33f64b8d4c58', 'br_warp-network', 'br-e8d0130a60af', 'enp0s6', 'vetha479a4f', 'br-0ca74fa43b42', 'veth8f4b693', 'veth78736a3', 'veth20f3bdd', 'veth6bcc543', 'br-9d98caf831bb', 'veth36ae789', 'veth6bdc8aa', 'br_publicnet', 'vethfdeb64b', 'vetha6ab4dc', 'vethfd9406f', 'vetha3e8ea7', 'vethba223df', 'veth76029a7', 'veth6102743', 'veth0c1ccf2', 'veth37ad922', 'veth180054c', 'docker0', 'br-45f4bb80820f', 'veth1a605b3', 'veth3a44b70', 'br-ddee521ff8d2', 'br-4b2d1bcfa835', 'lo', 'veth107fa80', 'tailscale0', 'vethd838bde', 'veth7e03c3e', 'veth2f2a28d', 'veth1cd4719', 'vethfe3702d', 'veth203373d', 'veth78e4d89', 'vethccdf7b3', 'veth9edf2ee', 'veth12e30ca']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.94.174.206', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.94.174.206', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:21c0:9a55:44c9:c441:1acf', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::cbee:b4b:7bae:a352', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth1a84340', 'tailscale0', 'veth9d6687a', 'veth4398fac', 'lo', 'veth7e5e393', 'veth58d57ed', 'veth054ea40', 'vetha5cc81d', 'veth2f40c19', 'veth0a42fe6', 'vethd655229', 'br-c4706e9b9ad2', 'veth16cb492', 'veth43eda78', 'docker0', 'br_warp-network', 'veth17242b7', 'veth553b64c', 'br-5e35e7049f2c', 'br-8d58d793a54e', 'veth0befdc1', 'eth0', 'veth114d988', 'veth7a1d8c5', 'vethc15c512', 'vethadf63ae', 'veth78c4d72']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.16', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:17:3b:5e', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.108.164.175', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.108.164.175', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:e0ef:4ee:1a4e:cf5b:305e', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::fa7e:4b0e:9477:dabd', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['tailscale0', 'br-c17fc902dd7c', 'veth989a716', 'br-f53dbe2492e5', 'vethea522f1', 'veth-warp-host', 'veth05439ba', 'veth165df69', 'vethfe5d9e8', 'vethd515c84', 'br_warp-network', 'veth2149db4', 'lo', 'eth0', 'docker0']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.15', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:75:e6:f5', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.89.18.76', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.89.18.76', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:19dd:af1b:2c92:c73:fb69', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::a923:c7f5:9027:b83f', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth7fd267e', 'veth314f899', 'veth6617a0e', 'veth1aaf697', 'tailscale0', 'br-fe2fbeb471d3', 'eth0', 'vetha87e073', 'veth87c197e', 'br_warp-network', 'docker0', 'vetha4fc465', 'vethaad513b', 'veth74fe498', 'lo', 'veth11b085b', 'veth3432212', 'br-50cad32899be', 'veth6e5c112', 'br-947849b349fa', 'veth008c1da']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.17', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:4e:fb:3d', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.93.153.182', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.93.153.182', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:1dbc:e213:9d6f:b77:6a96', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::be75:6ee2:45c5:6080', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Test basic connectivity to target host] ******************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display ping results] ************************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.98.182.207 (100.98.182.207) 56(84) bytes of data.\n64 bytes from 100.98.182.207: icmp_seq=1 ttl=64 time=0.054 ms\n64 bytes from 100.98.182.207: icmp_seq=2 ttl=64 time=0.049 ms\n64 bytes from 100.98.182.207: icmp_seq=3 ttl=64 time=0.058 ms\n\n--- 100.98.182.207 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2055ms\nrtt min/avg/max/mdev = 0.049/0.053/0.058/0.003 ms",
        "STDERR: "
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.111.132.16 (100.111.132.16) 56(84) bytes of data.\n64 bytes from 100.111.132.16: icmp_seq=1 ttl=64 time=0.050 ms\n64 bytes from 100.111.132.16: icmp_seq=2 ttl=64 time=0.046 ms\n64 bytes from 100.111.132.16: icmp_seq=3 ttl=64 time=0.062 ms\n\n--- 100.111.132.16 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2040ms\nrtt min/avg/max/mdev = 0.046/0.052/0.062/0.006 ms",
        "STDERR: "
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.94.174.206 (100.94.174.206): 56 data bytes\n64 bytes from 100.94.174.206: icmp_seq=0 ttl=64 time=0.153 ms\n64 bytes from 100.94.174.206: icmp_seq=1 ttl=64 time=0.056 ms\n64 bytes from 100.94.174.206: icmp_seq=2 ttl=64 time=0.057 ms\n--- 100.94.174.206 ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss\nround-trip min/avg/max/stddev = 0.056/0.089/0.153/0.045 ms",
        "STDERR: "
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.94.174.206 (100.94.174.206): 56 data bytes\n64 bytes from 100.94.174.206: icmp_seq=0 ttl=64 time=0.107 ms\n64 bytes from 100.94.174.206: icmp_seq=1 ttl=64 time=0.068 ms\n64 bytes from 100.94.174.206: icmp_seq=2 ttl=64 time=0.050 ms\n--- 100.94.174.206 ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss\nround-trip min/avg/max/stddev = 0.050/0.075/0.107/0.024 ms",
        "STDERR: "
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.108.164.175 (100.108.164.175) 56(84) bytes of data.\n64 bytes from 100.108.164.175: icmp_seq=1 ttl=64 time=0.099 ms\n64 bytes from 100.108.164.175: icmp_seq=2 ttl=64 time=0.092 ms\n64 bytes from 100.108.164.175: icmp_seq=3 ttl=64 time=0.088 ms\n\n--- 100.108.164.175 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2038ms\nrtt min/avg/max/mdev = 0.088/0.093/0.099/0.004 ms",
        "STDERR: "
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.89.18.76 (100.89.18.76) 56(84) bytes of data.\n64 bytes from 100.89.18.76: icmp_seq=1 ttl=64 time=0.101 ms\n64 bytes from 100.89.18.76: icmp_seq=2 ttl=64 time=0.082 ms\n64 bytes from 100.89.18.76: icmp_seq=3 ttl=64 time=0.088 ms\n\n--- 100.89.18.76 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2002ms\nrtt min/avg/max/mdev = 0.082/0.090/0.101/0.007 ms",
        "STDERR: "
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.93.153.182 (100.93.153.182) 56(84) bytes of data.\n64 bytes from 100.93.153.182: icmp_seq=1 ttl=64 time=0.137 ms\n64 bytes from 100.93.153.182: icmp_seq=2 ttl=64 time=0.188 ms\n64 bytes from 100.93.153.182: icmp_seq=3 ttl=64 time=0.301 ms\n\n--- 100.93.153.182 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2078ms\nrtt min/avg/max/mdev = 0.137/0.208/0.301/0.068 ms",
        "STDERR: "
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Test port connectivity with telnet] **********************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [micklethefickle]
ok: [arnialtrashlid]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display port connectivity results] ***********************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.98.182.207:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.98.182.207/8200: Connection refused"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.111.132.16:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.111.132.16/8200: Connection refused"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.94.174.206:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.94.174.206/8200: Connection refused"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.94.174.206:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.94.174.206/8200: Connection refused"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.108.164.175:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.108.164.175/8200: Connection refused"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.89.18.76:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.89.18.76/8200: Connection refused"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.93.153.182:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.93.153.182/8200: Connection refused"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Check if Vault service is running] ***********************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display Vault service status] ****************************************************************************************************************
fatal: [micklethefickle]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [beatapostapita]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [vractormania]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [arnialtrashlid]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [cloudserver1]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [cloudserver2]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}
fatal: [cloudserver3]: FAILED! => {"msg": "template error while templating string: Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'.. String: {% if 'vault.service' in ansible_facts.services %}. Unexpected end of template. Jinja was looking for the following tags: 'elif' or 'else' or 'endif'. The innermost block that needs to be closed is 'if'."}

PLAY RECAP ********************************************************************************************************************************************************************
arnialtrashlid             : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
beatapostapita             : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
cloudserver1               : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
cloudserver2               : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
cloudserver3               : ok=27   changed=3    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   
micklethefickle            : ok=27   changed=3    unreachable=0    failed=1    skipped=29   rescued=0    ignored=0   
vractormania               : ok=27   changed=2    unreachable=0    failed=1    skipped=28   rescued=0    ignored=0   

make: *** [Makefile:81: vault] Error 2
root@beatapostapita:/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab# make vault
Installing Ansible requirements...
command: "/bin/bash -c "ansible-galaxy install -r /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/requirements.yml"
Starting galaxy role install process
- setup-docker is already installed, skipping.
- setup-nomad is already installed, skipping.
- setup-consul is already installed, skipping.
- setup-vault is already installed, skipping.
- setup-caddy is already installed, skipping.
- setup-consul-template is already installed, skipping.
- setup-cloudflared is already installed, skipping.
Requirements installed successfully.
Deploying Vault components...
command: "/bin/bash -c "ansible-playbook -i /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/hosts.yml /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/site.yml --tags vault"

PLAY [nomad_cluster] **********************************************************************************************************************************************************

TASK [Gathering Facts] ********************************************************************************************************************************************************
ok: [vractormania]
ok: [arnialtrashlid]
ok: [beatapostapita]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-consul : Include OS-specific variables] ***************************************************************************************************************************
ok: [micklethefickle] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [beatapostapita] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [vractormania] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [arnialtrashlid] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver1] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver2] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)
ok: [cloudserver3] => (item=/home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-consul/vars/Debian.yml)

TASK [setup-vault : Include asserts] ******************************************************************************************************************************************
included: /home/ubuntu/my-media-stack/projects/orchestration/hashi-homelab/bootstrap/roles/setup-vault/tasks/asserts.yml for micklethefickle, beatapostapita, vractormania, arnialtrashlid, cloudserver1, cloudserver2, cloudserver3

TASK [setup-vault : Check distribution compatibility] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Red Hat / CentOS] ************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Debian] **********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of FreeBSD] *********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Fail if not a new release of Ubuntu] **********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Check for vault_redirect_address usage] *******************************************************************************************************************
ok: [micklethefickle] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [beatapostapita] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [vractormania] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [arnialtrashlid] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver1] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver2] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}
ok: [cloudserver3] => {
    "msg": "vault_redirect_address is deprecated. Check for vault_api_addr in the README."
}

TASK [setup-vault : Check if vault_transit_address and vault_transit_token has been specified] ********************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Add Vault group] ******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Add Vault user] *******************************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Include OS-specific variables] ****************************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Check for existing Vault binary] **************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver3]
ok: [cloudserver1]

TASK [setup-vault : Check Vault installation] *********************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Get installed Vault version (with architecture check)] ****************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Compute if installation is required] **********************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display installation decision] ***************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== VAULT INSTALLATION DECISION ===",
        "vault_installation failed: False",
        "vault_binary_installed exists: True",
        "installed_vault_version failed: False",
        "installed_vault_version rc: 0",
        "installed_vault_version stdout: 1.14.0",
        "expected version: 1.14.0",
        "installation_required: False"
    ]
}

TASK [setup-vault : Install OS packages and Vault via control host] ***********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Install Vault via HashiCorp repository] *******************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Install OS packages and Vault via remote hosts] ***********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Check Vault mlock capability] *****************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : Enable non root mlock capability] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Create directories] ***************************************************************************************************************************************
ok: [beatapostapita] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [arnialtrashlid] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [micklethefickle] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [vractormania] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [beatapostapita] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [arnialtrashlid] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [vractormania] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [micklethefickle] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [beatapostapita] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [beatapostapita] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [beatapostapita] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [arnialtrashlid] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [vractormania] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [micklethefickle] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver2] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [micklethefickle] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/etc/vault.d', 'mode': '0550'})
ok: [cloudserver1] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver3] => (item={'path': '/usr/local/lib/vault/plugins', 'mode': '0555'})
ok: [cloudserver1] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/vault', 'mode': '0750'})
ok: [cloudserver1] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver2] => (item={'path': '/var/run/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/log/vault', 'mode': '0750'})
ok: [cloudserver3] => (item={'path': '/var/run/vault', 'mode': '0750'})

TASK [setup-vault : Enable logrotate for vault] *******************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : TLS configuration] ****************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Backend storage TLS configuration] ************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Get content of GCP Credentials from file] *****************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Copy over GCP Credentials for Auto Unseal] ****************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Copy GCP Credentials for gcs backend] *********************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault main configuration] *********************************************************************************************************************************
changed: [beatapostapita]
changed: [vractormania]
ok: [arnialtrashlid]
changed: [micklethefickle]
changed: [cloudserver1]
changed: [cloudserver2]
changed: [cloudserver3]

TASK [setup-vault : Vault transit seal configuration] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault awskms seal configuration] **************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Vault azurekeyvault seal configuration] *******************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Upload Vault license file to vault_license_path] **********************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Set Exec output to log path when enabled log] *************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : BSD init script] ******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : SYSV init script] *****************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Debian init script] ***************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Extract systemd version] **********************************************************************************************************************************
ok: [beatapostapita]
ok: [micklethefickle]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Systemd unit] *********************************************************************************************************************************************
ok: [beatapostapita]
ok: [micklethefickle]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Reload systemd] *******************************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Start Vault] **********************************************************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Pause to let Vault startup correctly] *********************************************************************************************************************
skipping: [micklethefickle]

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

TASK [setup-vault : Restart Vault if needed] **********************************************************************************************************************************

RUNNING HANDLER [setup-vault : Restart vault] *********************************************************************************************************************************
changed: [vractormania]
changed: [micklethefickle]
changed: [beatapostapita]
changed: [cloudserver2]
changed: [cloudserver3]
changed: [cloudserver1]

RUNNING HANDLER [setup-vault : Reload vault] **********************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]

TASK [setup-vault : Reload vault] *********************************************************************************************************************************************
ok: [arnialtrashlid]

RUNNING HANDLER [setup-vault : Reload vault] **********************************************************************************************************************************
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : Compute TLS friendly vault_addr] **************************************************************************************************************************
ok: [micklethefickle]
ok: [beatapostapita]
ok: [vractormania]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Insert http(s) export in dotfile] *************************************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver2]
ok: [cloudserver3]

TASK [setup-vault : Insert CA cert export in dotfile] *************************************************************************************************************************
skipping: [micklethefickle]
skipping: [beatapostapita]
skipping: [vractormania]
skipping: [arnialtrashlid]
skipping: [cloudserver1]
skipping: [cloudserver2]
skipping: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Print all Vault-related variables] ***********************************************************************************************************
ok: [beatapostapita] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.111.132.16",
        "vault_redirect_address: 100.111.132.16",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.111.132.16:8200",
        "vault_cluster_addr: http://100.111.132.16:8201",
        "vault_cluster_address: 100.111.132.16:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: beatapostapita",
        "ansible_host: 100.111.132.16",
        "network_address: 149.130.222.229",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.109', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:05:23:92', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.111.132.16",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [micklethefickle] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.98.182.207",
        "vault_redirect_address: 100.98.182.207",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.98.182.207:8200",
        "vault_cluster_addr: http://100.98.182.207:8201",
        "vault_cluster_address: 100.98.182.207:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: micklethefickle",
        "ansible_host: 100.98.182.207",
        "network_address: 170.9.225.137",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.78', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:03:bc:56', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.98.182.207",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.108.164.175",
        "vault_redirect_address: 100.108.164.175",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.108.164.175:8200",
        "vault_cluster_addr: http://100.108.164.175:8201",
        "vault_cluster_address: 100.108.164.175:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver1",
        "ansible_host: 100.108.164.175",
        "network_address: 172.245.88.16",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.16', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:17:3b:5e', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.108.164.175",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.94.174.206",
        "vault_redirect_address: 100.94.174.206",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.94.174.206:8200",
        "vault_cluster_addr: http://100.94.174.206:8201",
        "vault_cluster_address: 100.94.174.206:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: arnialtrashlid",
        "ansible_host: 100.94.174.206",
        "network_address: 150.136.84.225",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.94.174.206",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.94.174.206",
        "vault_redirect_address: 100.94.174.206",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.94.174.206:8200",
        "vault_cluster_addr: http://100.94.174.206:8201",
        "vault_cluster_address: 100.94.174.206:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: vractormania",
        "ansible_host: 100.94.174.206",
        "network_address: 149.130.219.117",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.94.174.206",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.89.18.76",
        "vault_redirect_address: 100.89.18.76",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.89.18.76:8200",
        "vault_cluster_addr: http://100.89.18.76:8201",
        "vault_cluster_address: 100.89.18.76:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver2",
        "ansible_host: 100.89.18.76",
        "network_address: 172.245.88.15",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.15', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:75:e6:f5', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.89.18.76",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== VAULT CONFIGURATION VARIABLES ===",
        "vault_address: 100.93.153.182",
        "vault_redirect_address: 100.93.153.182",
        "vault_port: 8200",
        "vault_protocol: http",
        "vault_api_addr: http://100.93.153.182:8200",
        "vault_cluster_addr: http://100.93.153.182:8201",
        "vault_cluster_address: 100.93.153.182:8201",
        "vault_tls_disable: True",
        "vault_iface: tailscale0",
        "=== HOST NETWORK INFORMATION ===",
        "inventory_hostname: cloudserver3",
        "ansible_host: 100.93.153.182",
        "network_address: 172.245.88.17",
        "vlan_interface: tailscale0",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.17', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:4e:fb:3d', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "=== COMPUTED VALUES ===",
        "vault_addr_protocol: http",
        "vault_api_addr_hostname: 100.93.153.182",
        "vault_api_addr_port: 8200",
        "validate_certs_during_api_reachable_check: True"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Show all network interfaces] *****************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['vethe93dc80', 'veth003390d', 'lo', 'veth5d07129', 'vethe1eb32d', 'vethc494640', 'veth-warp', 'vethd938a65', 'vethc397d6b', 'veth60266b7', 'vethf510660', 'veth930ad41', 'veth327c1eb', 'vethc01ee98', 'veth91d02ec', 'vethf0acc22', 'br-e8e007a130d9', 'vethbdb808f', 'veth1d0c224', 'vethc59c767', 'br-30602d861856', 'vethfffada2', 'veth9c72300', 'veth7bd7aed', 'enp0s6', 'vethc29f97e', 'vethbbcfd44', 'vethe97dec7', 'veth45c6e94', 'vethcc7f8d4', 'veth42b1d07', 'veth0705756', 'veth1624a12', 'vethc2f258d', 'veth4a62ea9', 'vethb737193', 'vethc6409e5', 'veth5e27e1d', 'veth3d20ab8', 'br_backend', 'vethcdd928b', 'veth98e9fd7', 'docker0', 'veth97d4314', 'veth218be92', 'vethc360f30', 'veth17c1846', 'veth1cd2475', 'vethd786e73', 'vethaad8801', 'veth65f3dad', 'veth4187e42', 'br-b5be2a962667', 'veth9cde36a', 'veth37ef486', 'vethb391566', 'vethb7c69dc', 'veth88692e8', 'vethd7963e2', 'veth85050be', 'br_publicnet', 'vethd5543f8', 'veth934ccf2', 'veth8e1171c', 'vethf55a158', 'vethc585994', 'veth961cb99', 'vetheafd9af', 'veth4e963ec', 'vethb5b7859', 'br_warp-nat-net', 'vethe2d7466', 'veth1e36a10', 'veth4d1d7b6', 'vethb8a10dc', 'veth0178b27', 'veth09ca7f8', 'tailscale0', 'veth7b910b8', 'veth0f1e636', 'veth49240d6']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.78', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:03:bc:56', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.98.182.207', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.98.182.207', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:478c:b369:cfd3:77ae:1a03', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::7a44:d8c8:9f3c:2458', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['vethcbb8a81', 'veth7e6f13d', 'tun1', 'veth64f18ec', 'veth6f585a1', 'veth74c39c3', 'veth90078bb', 'br_warp-nat-net', 'veth1a33936', 'veth917f151', 'vethcb0654a', 'veth4c7762c', 'veth6488890', 'br_publicnet', 'tun0', 'veth6a45bed', 'veth7af8f89', 'vethf82ccf8', 'vethb94efbc', 'vetha71ba8d', 'veth7d7bf9d', 'veth3f9ef01', 'vethde64da2', 'veth170bb62', 'vethd64eeba', 'vethfe70699', 'veth0bb54b4', 'veth-warp', 'br_crowdsec_gf', 'vetha1ef755', 'veth7847b4d', 'veth36be735', 'veth07d3bf5', 'veth31eda3c', 'veth5eaed5e', 'veth2fe57aa', 'tailscale0', 'veth224966d', 'veth9b0c644', 'veth3c331c8', 'veth8d7683c', 'veth8203509', 'veth2e7f8a8', 'vethe080a08', 'veth1bee009', 'vethee297a8', 'veth2a6099b', 'vethc5389ad', 'vethe59e7fe', 'br_backend', 'br_vpn-network', 'veth6ecc15a', 'veth6341f58', 'veth87bcb52', 'veth6dc969b', 'vethc969cec', 'br-46482b0f96c8', 'vethe55d933', 'veth7b65c57', 'veth7fd0a3f', 'veth60f44de', 'veth04ce03b', 'veth045fb57', 'vethca41113', 'vethee41a95', 'veth83b1ac4', 'docker0', 'veth156863c', 'vetha087a25', 'vethb605a0d', 'br-6fa3dc1f892c', 'vetha572651', 'veth70cd7aa', 'veth04c7dc8', 'lo', 'veth163cd55', 'enp0s6', 'veth0108427', 'vethe413b48', 'vethdcc5972', 'br-7b4425e58e3c']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.109', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:05:23:92', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.111.132.16', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.111.132.16', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:812b:c823:ccbf:b039:f92', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::e0a2:576c:7bbc:98d2', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth107fa80', 'lo', 'vetha6ab4dc', 'tailscale0', 'veth1d416bf', 'veth350f167', 'veth37ad922', 'veth9edf2ee', 'veth8f4b693', 'veth6ee3673', 'vethf1bfd2a', 'vethfdeb64b', 'veth203373d', 'br-e8d0130a60af', 'docker0', 'veth0c1ccf2', 'veth78e4d89', 'veth20f3bdd', 'br-33f64b8d4c58', 'veth6bcc543', 'veth78736a3', 'veth0a2dbdb', 'veth12e30ca', 'br_warp-network', 'br-45f4bb80820f', 'veth1cd4719', 'veth1a605b3', 'veth1bf6e4d', 'veth76029a7', 'veth6102743', 'veth180054c', 'veth7e03c3e', 'vethfd9406f', 'br-0ca74fa43b42', 'veth2f2a28d', 'vethed32ddc', 'vetha479a4f', 'vethccdf7b3', 'vethfe3702d', 'veth3a44b70', 'veth7be89eb', 'enp0s6', 'veth4093f4b', 'vethf6f8b65', 'br-ddee521ff8d2', 'veth8365dc8', 'vethd838bde', 'br-9d98caf831bb', 'br-9013d71b70a6', 'vethcfc5510', 'veth36ae789', 'br_publicnet', 'veth43441ef', 'vetha3e8ea7', 'br-53e4653c7f35', 'br-4b2d1bcfa835', 'vethba223df', 'br-07fca800289b', 'veth6bdc8aa']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.94.174.206', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.94.174.206', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:21c0:9a55:44c9:c441:1acf', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::cbee:b4b:7bae:a352', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['vethfe3702d', 'veth3a44b70', 'vethfdeb64b', 'veth107fa80', 'vetha6ab4dc', 'veth78736a3', 'veth1cd4719', 'veth12e30ca', 'veth7e03c3e', 'br-53e4653c7f35', 'br-33f64b8d4c58', 'veth0a2dbdb', 'veth20f3bdd', 'veth6bdc8aa', 'docker0', 'veth9edf2ee', 'veth1a605b3', 'veth350f167', 'veth6bcc543', 'veth37ad922', 'br-07fca800289b', 'veth1bf6e4d', 'vethd838bde', 'br-45f4bb80820f', 'br-e8d0130a60af', 'veth36ae789', 'veth2f2a28d', 'veth180054c', 'vethcfc5510', 'vetha3e8ea7', 'vethfd9406f', 'vethf6f8b65', 'vethf1bfd2a', 'br-4b2d1bcfa835', 'veth1d416bf', 'br-9d98caf831bb', 'veth76029a7', 'vethba223df', 'br_warp-network', 'tailscale0', 'vetha479a4f', 'br_publicnet', 'veth8f4b693', 'br-9013d71b70a6', 'veth203373d', 'vethccdf7b3', 'veth4093f4b', 'veth0c1ccf2', 'veth6102743', 'veth43441ef', 'br-ddee521ff8d2', 'veth6ee3673', 'veth78e4d89', 'enp0s6', 'lo', 'vethed32ddc', 'br-0ca74fa43b42', 'veth8365dc8', 'veth7be89eb']",
        "ansible_default_ipv4: {'gateway': '10.16.1.1', 'interface': 'enp0s6', 'address': '10.16.1.201', 'broadcast': '', 'netmask': '255.255.255.0', 'network': '10.16.1.0', 'prefix': '24', 'macaddress': '02:00:17:00:ff:26', 'mtu': 9000, 'type': 'ether', 'alias': 'enp0s6'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.94.174.206', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.94.174.206', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:21c0:9a55:44c9:c441:1acf', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::cbee:b4b:7bae:a352', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['veth2f40c19', 'br-5e35e7049f2c', 'veth17242b7', 'vethd655229', 'veth054ea40', 'veth0a42fe6', 'docker0', 'veth553b64c', 'br_warp-network', 'tailscale0', 'eth0', 'veth1a84340', 'vethc15c512', 'veth4398fac', 'br-c4706e9b9ad2', 'br-8d58d793a54e', 'veth114d988', 'vetha5cc81d', 'veth43eda78', 'veth9d6687a', 'vethadf63ae', 'veth7e5e393', 'veth58d57ed', 'veth7a1d8c5', 'veth0befdc1', 'veth78c4d72', 'veth16cb492', 'lo']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.16', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:17:3b:5e', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.108.164.175', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.108.164.175', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:e0ef:4ee:1a4e:cf5b:305e', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::fa7e:4b0e:9477:dabd', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['eth0', 'vethfe5d9e8', 'veth2149db4', 'veth989a716', 'docker0', 'lo', 'br-f53dbe2492e5', 'vethea522f1', 'tailscale0', 'br-c17fc902dd7c', 'br_warp-network', 'veth165df69', 'veth-warp-host', 'veth05439ba', 'vethd515c84']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.15', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:75:e6:f5', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.89.18.76', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.89.18.76', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:19dd:af1b:2c92:c73:fb69', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::a923:c7f5:9027:b83f', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== ALL NETWORK INTERFACES ===",
        "ansible_interfaces: ['docker0', 'vetha87e073', 'veth3432212', 'veth008c1da', 'veth11b085b', 'tailscale0', 'eth0', 'vethaad513b', 'veth1aaf697', 'vethb271846', 'veth6617a0e', 'veth6e5c112', 'br_warp-network', 'br-50cad32899be', 'br-fe2fbeb471d3', 'veth314f899', 'vetha4fc465', 'br-947849b349fa', 'veth74fe498', 'lo', 'veth87c197e']",
        "ansible_default_ipv4: {'gateway': '172.245.88.1', 'interface': 'eth0', 'address': '172.245.88.17', 'broadcast': '172.245.88.31', 'netmask': '255.255.255.224', 'network': '172.245.88.0', 'prefix': '27', 'macaddress': '00:16:3c:4e:fb:3d', 'mtu': 1500, 'type': 'ether', 'alias': 'eth0'}",
        "Target interface (tailscale0): {'device': 'tailscale0', 'mtu': 1280, 'active': True, 'type': 'tunnel', 'speed': -1, 'promisc': False, 'ipv4': {'address': '100.93.153.182', 'broadcast': '', 'netmask': '255.255.255.255', 'network': '100.93.153.182', 'prefix': '32'}, 'ipv6': [{'address': 'fd7a:115c:a1e0:1dbc:e213:9d6f:b77:6a96', 'prefix': '128', 'scope': 'global'}, {'address': 'fe80::be75:6ee2:45c5:6080', 'prefix': '64', 'scope': 'link'}], 'features': {'rx_checksumming': 'off [fixed]', 'tx_checksumming': 'on', 'tx_checksum_ipv4': 'off [fixed]', 'tx_checksum_ip_generic': 'on', 'tx_checksum_ipv6': 'off [fixed]', 'tx_checksum_fcoe_crc': 'off [fixed]', 'tx_checksum_sctp': 'off [fixed]', 'scatter_gather': 'on', 'tx_scatter_gather': 'on', 'tx_scatter_gather_fraglist': 'on', 'tcp_segmentation_offload': 'on', 'tx_tcp_segmentation': 'on', 'tx_tcp_ecn_segmentation': 'off', 'tx_tcp_mangleid_segmentation': 'off', 'tx_tcp6_segmentation': 'on', 'generic_segmentation_offload': 'on', 'generic_receive_offload': 'on', 'large_receive_offload': 'off [fixed]', 'rx_vlan_offload': 'off [fixed]', 'tx_vlan_offload': 'on', 'ntuple_filters': 'off [fixed]', 'receive_hashing': 'off [fixed]', 'highdma': 'off [fixed]', 'rx_vlan_filter': 'off [fixed]', 'vlan_challenged': 'off [fixed]', 'tx_lockless': 'on [fixed]', 'netns_local': 'off [fixed]', 'tx_gso_robust': 'off [fixed]', 'tx_fcoe_segmentation': 'off [fixed]', 'tx_gre_segmentation': 'off [fixed]', 'tx_gre_csum_segmentation': 'off [fixed]', 'tx_ipxip4_segmentation': 'off [fixed]', 'tx_ipxip6_segmentation': 'off [fixed]', 'tx_udp_tnl_segmentation': 'off [fixed]', 'tx_udp_tnl_csum_segmentation': 'off [fixed]', 'tx_gso_partial': 'off [fixed]', 'tx_tunnel_remcsum_segmentation': 'off [fixed]', 'tx_sctp_segmentation': 'off [fixed]', 'tx_esp_segmentation': 'off [fixed]', 'tx_udp_segmentation': 'on', 'tx_gso_list': 'off [fixed]', 'fcoe_mtu': 'off [fixed]', 'tx_nocache_copy': 'off', 'loopback': 'off [fixed]', 'rx_fcs': 'off [fixed]', 'rx_all': 'off [fixed]', 'tx_vlan_stag_hw_insert': 'on', 'rx_vlan_stag_hw_parse': 'off [fixed]', 'rx_vlan_stag_filter': 'off [fixed]', 'l2_fwd_offload': 'off [fixed]', 'hw_tc_offload': 'off [fixed]', 'esp_hw_offload': 'off [fixed]', 'esp_tx_csum_hw_offload': 'off [fixed]', 'rx_udp_tunnel_port_offload': 'off [fixed]', 'tls_hw_tx_offload': 'off [fixed]', 'tls_hw_rx_offload': 'off [fixed]', 'rx_gro_hw': 'off [fixed]', 'tls_hw_record': 'off [fixed]', 'rx_gro_list': 'off', 'macsec_hw_offload': 'off [fixed]', 'rx_udp_gro_forwarding': 'off', 'hsr_tag_ins_offload': 'off [fixed]', 'hsr_tag_rm_offload': 'off [fixed]', 'hsr_fwd_offload': 'off [fixed]', 'hsr_dup_offload': 'off [fixed]'}, 'timestamping': [], 'hw_timestamp_filters': []}"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Test basic connectivity to target host] ******************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
ok: [cloudserver1]
ok: [cloudserver3]
ok: [cloudserver2]

TASK [setup-vault : [DIAGNOSTIC] Display ping results] ************************************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.98.182.207 (100.98.182.207) 56(84) bytes of data.\n64 bytes from 100.98.182.207: icmp_seq=1 ttl=64 time=0.060 ms\n64 bytes from 100.98.182.207: icmp_seq=2 ttl=64 time=0.045 ms\n64 bytes from 100.98.182.207: icmp_seq=3 ttl=64 time=0.043 ms\n\n--- 100.98.182.207 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2069ms\nrtt min/avg/max/mdev = 0.043/0.049/0.060/0.007 ms",
        "STDERR: "
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.111.132.16 (100.111.132.16) 56(84) bytes of data.\n64 bytes from 100.111.132.16: icmp_seq=1 ttl=64 time=0.049 ms\n64 bytes from 100.111.132.16: icmp_seq=2 ttl=64 time=0.056 ms\n64 bytes from 100.111.132.16: icmp_seq=3 ttl=64 time=0.057 ms\n\n--- 100.111.132.16 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2076ms\nrtt min/avg/max/mdev = 0.049/0.054/0.057/0.003 ms",
        "STDERR: "
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.94.174.206 (100.94.174.206): 56 data bytes\n64 bytes from 100.94.174.206: icmp_seq=0 ttl=64 time=0.076 ms\n64 bytes from 100.94.174.206: icmp_seq=1 ttl=64 time=0.071 ms\n64 bytes from 100.94.174.206: icmp_seq=2 ttl=64 time=0.084 ms\n--- 100.94.174.206 ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss\nround-trip min/avg/max/stddev = 0.071/0.077/0.084/0.000 ms",
        "STDERR: "
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.94.174.206 (100.94.174.206): 56 data bytes\n64 bytes from 100.94.174.206: icmp_seq=0 ttl=64 time=0.085 ms\n64 bytes from 100.94.174.206: icmp_seq=1 ttl=64 time=0.072 ms\n64 bytes from 100.94.174.206: icmp_seq=2 ttl=64 time=0.042 ms\n--- 100.94.174.206 ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss\nround-trip min/avg/max/stddev = 0.042/0.066/0.085/0.000 ms",
        "STDERR: "
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.108.164.175 (100.108.164.175) 56(84) bytes of data.\n64 bytes from 100.108.164.175: icmp_seq=1 ttl=64 time=0.109 ms\n64 bytes from 100.108.164.175: icmp_seq=2 ttl=64 time=0.091 ms\n64 bytes from 100.108.164.175: icmp_seq=3 ttl=64 time=0.084 ms\n\n--- 100.108.164.175 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2051ms\nrtt min/avg/max/mdev = 0.084/0.094/0.109/0.010 ms",
        "STDERR: "
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.89.18.76 (100.89.18.76) 56(84) bytes of data.\n64 bytes from 100.89.18.76: icmp_seq=1 ttl=64 time=0.150 ms\n64 bytes from 100.89.18.76: icmp_seq=2 ttl=64 time=0.097 ms\n64 bytes from 100.89.18.76: icmp_seq=3 ttl=64 time=0.088 ms\n\n--- 100.89.18.76 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2077ms\nrtt min/avg/max/mdev = 0.088/0.111/0.150/0.027 ms",
        "STDERR: "
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== PING TEST RESULTS ===",
        "Return code: 0",
        "STDOUT: PING 100.93.153.182 (100.93.153.182) 56(84) bytes of data.\n64 bytes from 100.93.153.182: icmp_seq=1 ttl=64 time=0.144 ms\n64 bytes from 100.93.153.182: icmp_seq=2 ttl=64 time=0.086 ms\n64 bytes from 100.93.153.182: icmp_seq=3 ttl=64 time=0.113 ms\n\n--- 100.93.153.182 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2084ms\nrtt min/avg/max/mdev = 0.086/0.114/0.144/0.023 ms",
        "STDERR: "
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Test port connectivity with telnet] **********************************************************************************************************
ok: [beatapostapita]
ok: [arnialtrashlid]
ok: [vractormania]
ok: [micklethefickle]
ok: [cloudserver2]
ok: [cloudserver1]
ok: [cloudserver3]

TASK [setup-vault : [DIAGNOSTIC] Display port connectivity results] ***********************************************************************************************************
ok: [micklethefickle] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.98.182.207:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.98.182.207/8200: Connection refused"
    ]
}
ok: [beatapostapita] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.111.132.16:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.111.132.16/8200: Connection refused"
    ]
}
ok: [vractormania] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.94.174.206:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.94.174.206/8200: Connection refused"
    ]
}
ok: [arnialtrashlid] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.94.174.206:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.94.174.206/8200: Connection refused"
    ]
}
ok: [cloudserver1] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.108.164.175:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.108.164.175/8200: Connection refused"
    ]
}
ok: [cloudserver2] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.89.18.76:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.89.18.76/8200: Connection refused"
    ]
}
ok: [cloudserver3] => {
    "msg": [
        "=== PORT CONNECTIVITY TEST ===",
        "Target: 100.93.153.182:8200",
        "Result: Port is closed or unreachable",
        "Return code: 0",
        "STDERR: bash: connect: Connection refused\nbash: line 1: /dev/tcp/100.93.153.182/8200: Connection refused"
    ]
}

TASK [setup-vault : [DIAGNOSTIC] Check if Vault service is running] ***********************************************************************************************************
ok: [beatapostapita]
ok: [vractormania]
ok: [arnialtrashlid]
ok: [micklethefickle]
^C [ERROR]: User interrupted execution
make: *** [Makefile:81: vault] Error 99
```

Fuck am i doing wrong here? Ignore the jinja errror obviously only focus on why the fucking connection tests are failing???

## Assistant

_Time: 2025-09-17T22:31:32.507Z_


