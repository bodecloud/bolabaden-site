---
source_url: "https://chatgpt.com/c/689d1c5e-eca8-8326-9e12-a2bf70ae56a5"
conversation_id: "689d1c5e-eca8-8326-9e12-a2bf70ae56a5"
title: "Nomad client server install"
extracted_at: "2026-06-29T16:06:38.050Z"
message_count: 5
provenance: auth-ui
---

# Nomad client server install

Source: [ChatGPT conversation](https://chatgpt.com/c/689d1c5e-eca8-8326-9e12-a2bf70ae56a5)

## Assistant

Alright — let’s get you a HashiCorp Nomad cluster running in client + server mode on the same Ubuntu VPS.
I’ll walk you through step-by-step, assuming a fresh Ubuntu 22.04/20.04 install and root or sudo access.

1. Update Your System
Bash
sudo apt update && sudo apt upgrade -y
2. Install Dependencies

Nomad requires unzip and curl (and optionally jq for JSON parsing):

Bash
sudo apt install -y unzip curl jq
3. Download & Install Nomad

Get the latest Nomad binary from HashiCorp’s releases page:

Bash
NOMAD_VERSION=$(curl -s https://checkpoint-api.hashicorp.com/v1/check/nomad | jq -r .current_version)
curl -O https://releases.hashicorp.com/nomad/${NOMAD_VERSION}/nomad_${NOMAD_VERSION}_linux_amd64.zip
unzip nomad_${NOMAD_VERSION}_linux_amd64.zip
sudo mv nomad /usr/local/bin/
nomad version
4. Create Nomad User & Directories
Bash
sudo useradd --system --home /etc/nomad.d --shell /bin/false nomad
sudo mkdir -p /etc/nomad.d /opt/nomad
sudo chown -R nomad:nomad /etc/nomad.d /opt/nomad
sudo chmod 700 /etc/nomad.d
5. Configure Nomad (Server + Client on Same VPS)

Create a single config file:

Bash
sudo nano /etc/nomad.d/nomad.hcl

Paste:

hcl
data_dir  = "/opt/nomad"
bind_addr = "0.0.0.0"

server {
  enabled          = true
  bootstrap_expect = 1
}

client {
  enabled = true
  servers = ["127.0.0.1:4647"]
}

Notes:

bootstrap_expect = 1 is because this is a single-node setup.

bind_addr = "0.0.0.0" lets you access it remotely; change to 127.0.0.1 for local-only.

6. Create a Systemd Service
Bash
sudo nano /etc/systemd/system/nomad.service

Paste:

INI
[Unit]
Description=Nomad
Documentation=https://www.nomadproject.io/docs/
Wants=network-online.target
After=network-online.target

[Service]
User=nomad
Group=nomad
ExecStart=/usr/local/bin/nomad agent -config=/etc/nomad.d
ExecReload=/bin/kill -HUP $MAINPID
KillMode=process
LimitNOFILE=65536
Restart=on-failure

[Install]
WantedBy=multi-user.target
7. Start & Enable Nomad
Bash
sudo systemctl daemon-reload
sudo systemctl enable nomad
sudo systemctl start nomad

Check status:

Bash
sudo systemctl status nomad
8. Verify Setup

Check Nomad is running:

Bash
nomad node status

Check cluster members:

Bash
nomad server members

You should see your single node listed as server and client.

9. (Optional) Enable the Web UI

Add to /etc/nomad.d/nomad.hcl under the root level:

hcl
ui = true

Restart:

Bash
sudo systemctl restart nomad

Access at:

http://YOUR_SERVER_IP:4646
10. Firewall Rules (Optional)

If using UFW and you want remote access:

Bash
sudo ufw allow 4646/tcp   # Web UI
sudo ufw allow 4647/tcp   # RPC
sudo ufw allow 4648/tcp   # Serf LAN
✅ At this point:

You have Nomad running in both server and client mode on your VPS.
It will survive reboots and can schedule jobs immediately.

If you want, I can also give you a minimal Nomad job file so you can test running a container or script right after setup. Would you like me to prepare that?

## User

Nomad's task group networks integrate with Consul's service mesh using bridge networking and iptables to send traffic between containers.

Warning: New Linux versions, such as Ubuntu 24.04, may not enable bridge networking by default. Use sudo modprobe bridge to load the bridge module if it is missing.

The Linux kernel bridge module has three tunable parameters that control whether iptables processes traffic crossing the bridge. Some operating systems, including RedHat, CentOS, and Fedora, might have iptables rules that are not correctly configured for guest traffic because these tunable parameters are optimized for VM workloads.

Ensure your Linux operating system distribution is configured to allow iptables to route container traffic through the bridge network. Run the following commands to set the tunable parameters to allow iptables processing for the bridge network.

$ echo 1 > /proc/sys/net/bridge/bridge-nf-call-arptables
$ echo 1 > /proc/sys/net/bridge/bridge-nf-call-ip6tables
$ echo 1 > /proc/sys/net/bridge/bridge-nf-call-iptables

To preserve these settings on startup of a client node, add a file to /etc/sysctl.d/ or remove the file your Linux distribution puts in that directory. The following example configures the tunable parameters for a client node.

/etc/sysctl.d/bridge.conf

net.bridge.bridge-nf-call-arptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1


when i try running the 'echo 1' commands i get this error:


ubuntu@beatapostapita:~/my-media-stack$ echo 1 > /proc/sys/net/bridge/bridge-nf-call-arptables
echo 1 > /proc/sys/net/bridge/bridge-nf-call-ip6tables
echo 1 > /proc/sys/net/bridge/bridge-nf-call-iptables
bash: /proc/sys/net/bridge/bridge-nf-call-arptables: No such file or directory
bash: /proc/sys/net/bridge/bridge-nf-call-ip6tables: No such file or directory
bash: /proc/sys/net/bridge/bridge-nf-call-iptables: No such file or directory
Show more

## Assistant

The error is happening because the /proc/sys/net/bridge/* files don’t exist — which means the Linux bridge netfilter module isn’t loaded yet.

On modern Ubuntu (and especially on 22.04+), this module isn’t always loaded by default.

Fix: Load the bridge netfilter kernel module

Run:

Bash
sudo modprobe br_netfilter

Then check:

Bash
ls /proc/sys/net/bridge

You should now see:

bridge-nf-call-arptables
bridge-nf-call-ip6tables
bridge-nf-call-iptables
Set the values immediately
Bash
echo 1 | sudo tee /proc/sys/net/bridge/bridge-nf-call-arptables
echo 1 | sudo tee /proc/sys/net/bridge/bridge-nf-call-ip6tables
echo 1 | sudo tee /proc/sys/net/bridge/bridge-nf-call-iptables
Persist the settings across reboots

Create /etc/sysctl.d/bridge.conf:

Bash
sudo nano /etc/sysctl.d/bridge.conf

Add:

net.bridge.bridge-nf-call-arptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1

Apply without reboot:

Bash
sudo sysctl --system

Why this is needed:
Nomad’s service mesh (when integrated with Consul) uses Linux bridge networking.
The br_netfilter module lets iptables inspect traffic passing between containers on that bridge. Without loading it, the /proc/sys/net/bridge/ tunables simply don’t exist.

If you want, I can also include these modprobe and sysctl steps directly into your Nomad client install guide so the bridge networking works out of the box.

## User

should i be manually bootstrapping the nomad cluster starting with a single vps or what?

goal is to have 5 vps's running both server/client unifying the services across them.

## Assistant

If your end goal is 5 VPSs, each running both a Nomad server and a Nomad client and all acting as one unified cluster, then:

Yes, you start by bootstrapping the cluster with one node (just enough to get it running).

But you don’t keep it in bootstrap mode forever — you expand to the proper production configuration where bootstrap_expect matches your intended server count.

How bootstrapping works

Nomad uses consensus (RAFT) for server coordination.

A single-node cluster is fine for testing — bootstrap_expect = 1.

For multi-node clusters, odd numbers of servers are recommended (3 or 5) for quorum safety.

When a cluster starts, the bootstrap_expect setting tells Nomad how many servers it should wait for before forming a cluster.

For your 5 VPS plan

Since all 5 VPSs will be both server and client:

Server stanza example in /etc/nomad.d/nomad.hcl:

hcl
server {
  enabled          = true
  bootstrap_expect = 5
}

Client stanza:

hcl
client {
  enabled = true
  servers = ["vps1.example.com:4647", "vps2.example.com:4647", "vps3.example.com:4647", "vps4.example.com:4647", "vps5.example.com:4647"]
}
Cluster bring-up plan

Pick a leader VPS to start first.

Set the same config on all 5 servers (bootstrap_expect = 5).

Start Nomad on the first node — it will wait for others to join.

Start Nomad on the second, third, fourth, and fifth nodes — once all 5 are online, the cluster will form automatically.

Verify:

Bash
nomad server members
nomad node status
Why not just start with bootstrap_expect=1?

You could, and then later reconfigure for 5, but that causes a RAFT reconfiguration which is riskier in production.

For a fresh deployment with multiple servers, it’s cleaner to start with the full bootstrap_expect value and bring them all up in one go.

My recommendation for your case

If you can spin up all 5 VPSs immediately, configure them with bootstrap_expect=5 from the start and bring them up one after the other.

If you must start with only one VPS, then:

Use bootstrap_expect=1 temporarily.

When adding more servers, follow the official procedure to promote and join servers
 — being careful to update configs and avoid breaking quorum.

If you want, I can give you a full multi-VPS Nomad server+client config with join settings so the nodes auto-discover each other via IPs or Consul. That way, the 5-node cluster will form without manual joining.
