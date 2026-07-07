---
source_url: "https://grok.com/c/1a4fa20e-955e-43ce-9835-b6c7995429f5"
conversation_id: "1a4fa20e-955e-43ce-9835-b6c7995429f5"
title: "Troubleshooting Nomad Server Docker Error"
extracted_at: "2026-06-29T16:38:16.819Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Troubleshooting Nomad Server Docker Error

Source: [Grok conversation](https://grok.com/c/1a4fa20e-955e-43ce-9835-b6c7995429f5)

## User

_Time: 2025-08-11T15:52:56.725Z_

how to fix this error with my docker-compose.yaml nomad server?\
``` nomad-server: # 🔹🔹 Nomad Server 🔹🔹 image: multani/nomad container_name: nomad-server hostname: nomad-server extra_hosts: - host.docker.internal:host-gateway network_mode: host build: latest command: agent -dev privileged: true environment: NOMAD_LOCAL_CONFIG: | datacenter = "${REGION:-test}" region = "${DATACENTER:-test-dc1}" data_dir = "/nomad/data/" bind_addr = "0.0.0.0" advertise { http = "{{ GetPrivateIP }}:4646" rpc = "{{ GetPrivateIP }}:4647" serf = "{{ GetPrivateIP }}:4648" } volumes: - /var/run/docker.sock:/var/run/docker.sock:rw - /tmp:/tmp\
```
 
 * Executing task: docker logs --tail 1000 -f d231e71d659ad772ba3fb86dc0ec78c2b8a5d77ee036d0fadcbd958923890e0d
==> Loaded configuration from /etc/nomad/local.json
==> Starting Nomad agent...
    2025-08-11T15:51:18.244Z [DEBUG] nomad: issuer not set; OIDC Discovery endpoint for workload identities disabled
    2025-08-11T15:51:18.246Z [INFO] nomad.raft: initial configuration: index=1 servers="[{Suffrage:Voter ID:d90824f0-3f40-2ed8-15f9-e986702b8efb Address:10.45.0.1:4647}]"
    2025-08-11T15:51:18.246Z [INFO] nomad: serf: EventMemberJoin: nomad-server.test-dc1 10.45.0.1
    2025-08-11T15:51:18.246Z [INFO] nomad: starting scheduling worker(s): num_workers=4 schedulers=["system", "sysbatch", "service", "batch", "_core"]
    2025-08-11T15:51:18.246Z [DEBUG] nomad: started scheduling worker: id=c10878e0-77d4-0107-bb28-991c0211b50f index=1 of=4
    2025-08-11T15:51:18.246Z [DEBUG] nomad: started scheduling worker: id=76732887-36fd-509d-481a-a8fa9043f9be index=2 of=4
    2025-08-11T15:51:18.246Z [DEBUG] nomad: started scheduling worker: id=562c99fc-904d-772d-f344-848c03ec4f2f index=3 of=4
    2025-08-11T15:51:18.246Z [DEBUG] nomad: started scheduling worker: id=bc1b26a3-1c4c-26b3-7943-5ee2376a0e08 index=4 of=4
    2025-08-11T15:51:18.246Z [INFO] nomad: started scheduling worker(s): num_workers=4 schedulers=["system", "sysbatch", "service", "batch", "_core"]
    2025-08-11T15:51:18.246Z [DEBUG] worker: running: worker_id=76732887-36fd-509d-481a-a8fa9043f9be
    2025-08-11T15:51:18.246Z [WARN] agent.plugin_loader: skipping external plugins since plugin_dir doesn't exist: plugin_dir=/nomad/data/plugins
    2025-08-11T15:51:18.246Z [DEBUG] worker: running: worker_id=c10878e0-77d4-0107-bb28-991c0211b50f
    2025-08-11T15:51:18.246Z [INFO] nomad.raft: entering follower state: follower="Node at 10.45.0.1:4647 [Follower]" leader-address= leader-id=
    2025-08-11T15:51:18.246Z [DEBUG] worker: running: worker_id=562c99fc-904d-772d-f344-848c03ec4f2f
    2025-08-11T15:51:18.246Z [DEBUG] worker: running: worker_id=bc1b26a3-1c4c-26b3-7943-5ee2376a0e08
    2025-08-11T15:51:18.246Z [INFO] nomad: adding server: server="nomad-server.test-dc1 (Addr: 10.45.0.1:4647) (DC: test)"
    2025-08-11T15:51:18.246Z [DEBUG] nomad.keyring.replicator: starting encryption key replication
    2025-08-11T15:51:18.247Z [DEBUG] agent.plugin_loader.exec.id_validator: user range configured: plugin_dir=/nomad/data/plugins denied range=""
    2025-08-11T15:51:18.247Z [DEBUG] agent.plugin_loader.exec.id_validator: group range configured: plugin_dir=/nomad/data/plugins denied range=""
    2025-08-11T15:51:18.248Z [DEBUG] agent.plugin_loader.docker: using client connection initialized from environment: plugin_dir=/nomad/data/plugins
    2025-08-11T15:51:18.248Z [DEBUG] agent.plugin_loader.raw_exec.id_validator: user range configured: plugin_dir=/nomad/data/plugins denied range=""
    2025-08-11T15:51:18.248Z [DEBUG] agent.plugin_loader.raw_exec.id_validator: group range configured: plugin_dir=/nomad/data/plugins denied range=""
    2025-08-11T15:51:18.248Z [INFO] agent: detected plugin: name=docker type=driver plugin_version=0.1.0
    2025-08-11T15:51:18.248Z [INFO] agent: detected plugin: name=raw_exec type=driver plugin_version=0.1.0
    2025-08-11T15:51:18.248Z [INFO] agent: detected plugin: name=exec type=driver plugin_version=0.1.0
    2025-08-11T15:51:18.248Z [INFO] agent: detected plugin: name=qemu type=driver plugin_version=0.1.0
    2025-08-11T15:51:18.248Z [INFO] agent: detected plugin: name=java type=driver plugin_version=0.1.0
    2025-08-11T15:51:18.248Z [INFO] client: using state directory: state_dir=/nomad/data/client
    2025-08-11T15:51:18.248Z [INFO] client: using alloc directory: alloc_dir=/nomad/data/alloc
    2025-08-11T15:51:18.248Z [INFO] client: using dynamic ports: min=20000 max=32000 reserved=""
    2025-08-11T15:51:18.249Z [DEBUG] client.fingerprint_mgr: built-in fingerprints: fingerprinters=["arch", "bridge", "cgroup", "cni", "consul", "cpu", "host", "host_volume_plugins", "landlock", "memory", "network", "nomad", "plugins_cni", "signal", "storage", "vault", "env_aws", "env_gce", "env_azure", "env_digitalocean"]
    2025-08-11T15:51:18.249Z [DEBUG] client.fingerprint_mgr.cgroup: detected cgroups: version=2
    2025-08-11T15:51:18.249Z [DEBUG] client.fingerprint_mgr: CNI config dir is not set or does not exist, skipping: cni_config_dir=/opt/cni/config
    2025-08-11T15:51:18.258Z [WARN] client.fingerprint_mgr.consul: failed to acquire consul self endpoint: cluster=default error="Get \"http://127.0.0.1:8500/v1/agent/self\": dial tcp 127.0.0.1:8500: connect: connection refused"
    2025-08-11T15:51:18.258Z [DEBUG] client.fingerprint_mgr: fingerprinting periodically: fingerprinter=consul initial_period=15s
    2025-08-11T15:51:18.260Z [DEBUG] client.fingerprint_mgr.cpu: detected CPU core count: cores=4
    2025-08-11T15:51:18.260Z [ERROR] client.fingerprint_mgr.cpu: cpu.totalcompute is zero, CPU fingerprinting likely failed: cpu.totalcompute=0
    2025-08-11T15:51:18.260Z [DEBUG] client.fingerprint_mgr.host_volume_plugins: detected plugin built-in: plugin_id=mkdir version=0.0.1
    2025-08-11T15:51:18.260Z [DEBUG] client.fingerprint_mgr.host_volume_plugins: plugin dir does not exist: dir=/nomad/data/host_volume_plugins
    2025-08-11T15:51:18.261Z [DEBUG] client.fingerprint_mgr.network: unable to read link speed: path=/sys/class/net/lo/speed device=lo
    2025-08-11T15:51:18.261Z [DEBUG] client.fingerprint_mgr.network: link speed could not be detected and no speed specified by user, falling back to default speed: interface=lo mbits=1000
    2025-08-11T15:51:18.261Z [DEBUG] client.fingerprint_mgr.network: detected interface IP: interface=lo IP=127.0.0.1
    2025-08-11T15:51:18.261Z [DEBUG] client.fingerprint_mgr.network: detected interface IP: interface=lo IP=::1
    2025-08-11T15:51:18.262Z [DEBUG] client.fingerprint_mgr.network: unable to read link speed: path=/sys/class/net/lo/speed device=lo
    2025-08-11T15:51:18.262Z [DEBUG] client.fingerprint_mgr.network: link speed could not be detected, falling back to default speed: interface=lo mbits=1000
    2025-08-11T15:51:18.262Z [DEBUG] client.fingerprint_mgr.network: unable to parse link speed: path=/sys/class/net/enp0s6/speed device=enp0s6
    2025-08-11T15:51:18.262Z [DEBUG] client.fingerprint_mgr.network: link speed could not be detected, falling back to default speed: interface=enp0s6 mbits=1000
    2025-08-11T15:51:18.263Z [DEBUG] client.fingerprint_mgr.network: unable to parse link speed: path=/sys/class/net/br-4384be1143fb/speed device=br-4384be1143fb
    2025-08-11T15:51:18.263Z [DEBUG] client.fingerprint_mgr.network: link speed could not be detected, falling back to default speed: interface=br-4384be1143fb mbits=1000
    2025-08-11T15:51:18.263Z [DEBUG] client.fingerprint_mgr.network: unable to parse link speed: path=/sys/class/net/br-1a6e5e0fee68/speed device=br-1a6e5e0fee68
    2025-08-11T15:51:18.263Z [DEBUG] client.fingerprint_mgr.network: link speed could not be detected, falling back to default speed: interface=br-1a6e5e0fee68 mbits=1000
    2025-08-11T15:51:18.263Z [DEBUG] client.fingerprint_mgr.network: unable to parse link speed: path=/sys/class/net/docker0/speed device=docker0
    2025-08-11T15:51:18.263Z [DEBUG] client.fingerprint_mgr.network: link speed could not be detected, falling back to default speed: interface=docker0 mbits=1000
    2025-08-11T15:51:18.268Z [WARN] client.fingerprint_mgr.cni_plugins: failed to read CNI plugins directory: cni_path=/opt/cni/bin error="open /opt/cni/bin: no such file or directory"
    2025-08-11T15:51:18.272Z [DEBUG] client.fingerprint_mgr: fingerprinting periodically: fingerprinter=vault initial_period=15s
    2025-08-11T15:51:18.274Z [DEBUG] client.fingerprint_mgr.env_digitalocean: could not read value for attribute: attribute=region resp_code=404
    2025-08-11T15:51:18.276Z [DEBUG] client.fingerprint_mgr.env_aws: error querying AWS IDMS URL, skipping
==> Error starting agent: client setup failed: failed to initialize process manager: failed to create nomad cgroup: write /sys/fs/cgroup/cgroup.subtree_control: device or resource busy
    2025-08-11T15:51:18.278Z [DEBUG] client.fingerprint_mgr.env_gce: could not read value for attribute: attribute=machine-type error="Get \"http://169.254.169.254/computeMetadata/v1/instance/machine-type\": context deadline exceeded (Client.Timeout exceeded while awaiting headers)"
    2025-08-11T15:51:18.278Z [DEBUG] client.fingerprint_mgr.env_gce: error querying GCE Metadata URL, skipping
    2025-08-11T15:51:18.279Z [DEBUG] client.fingerprint_mgr.env_azure: could not read value for attribute: attribute=compute/azEnvironment error="Get \"http://169.254.169.254/metadata/instance/compute/azEnvironment?api-version=2019-06-04&format=text\": context deadline exceeded (Client.Timeout exceeded while awaiting headers)"
    2025-08-11T15:51:18.279Z [DEBUG] client.fingerprint_mgr: detected fingerprints: node_attrs=["arch", "bridge", "consul", "cpu", "host", "host_volume_plugins", "network", "nomad", "signal", "storage"]
    2025-08-11T15:51:18.279Z [INFO] client.proclib.cg2: initializing nomad cgroups: cores=0-3
    2025-08-11T15:51:18.279Z [ERROR] agent: error starting agent: error="client setup failed: failed to initialize process manager: failed to create nomad cgroup: write /sys/fs/cgroup/cgroup.subtree_control: device or resource busy"
 * Terminal will be reused by tasks, press any key to close it.

## Assistant

_Time: 2025-08-11T15:57:11.659Z_

The error in the Nomad agent startup logs indicates a failure to initialize the process manager due to an inability to create the Nomad cgroup, specifically when attempting to write to `/sys/fs/cgroup/cgroup.subtree_control`, resulting in a "device or resource busy" response. This issue commonly arises when running Nomad within a Docker container on a host using cgroup v2, as the container's cgroup namespace and mount permissions restrict modifications to the cgroup hierarchy.

To resolve this, modify the `nomad-server` service definition in your `docker-compose.yaml` file by adding a read-write volume mount for `/sys/fs/cgroup`. This ensures Nomad can access and configure the cgroup filesystem appropriately within the container. The updated service configuration should include the following addition under `volumes`:

```
volumes:
  - /var/run/docker.sock:/var/run/docker.sock:rw
  - /tmp:/tmp
  - /sys/fs/cgroup:/sys/fs/cgroup:rw
```

After applying this change, restart the container using `docker-compose up -d`. This mount provides the necessary permissions for Nomad to manage cgroups without encountering the "busy" error, while leveraging the existing `privileged: true` setting for elevated access.

If the issue persists after this adjustment, consider adding `cgroupns_mode: host` to the service definition to share the host's cgroup namespace, which can further alleviate namespace isolation conflicts:

```
cgroupns_mode: host
```

Note that using a shared cgroup namespace exposes the container to the host's cgroup hierarchy, which may have security implications in production environments but is suitable for development or testing setups like the one described.

Additionally, the logs show a secondary warning about CPU fingerprinting (`cpu.totalcompute=0`), which may indicate incomplete resource detection. This does not prevent startup but could affect scheduling; monitor post-fix logs to confirm if it resolves automatically with successful cgroup initialization. If not, verify host CPU details and consider explicit resource constraints in your Nomad job specifications.
