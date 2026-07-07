---
source_url: "https://grok.com/c/3b8c924c-4d83-44e9-bb74-14d52dd212d4"
conversation_id: "3b8c924c-4d83-44e9-bb74-14d52dd212d4"
title: "Docker Service Crash Fix"
extracted_at: "2026-06-29T16:33:26.584Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Docker Service Crash Fix

Source: [Grok conversation](https://grok.com/c/3b8c924c-4d83-44e9-bb74-14d52dd212d4)

## User

_Time: 2025-08-29T00:49:57.556Z_

[+] Running 183/203ed 0.8s
 ⠸ aiostreams [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 178.9MB / 188.1MB Pulling 122.3s
 ✔ prometheus Pulled 0.8s
 ✔ warp-nat-gateway Pulled 0.8s
 ✔ failover-proxy Pulled 0.8s
 ✔ stremthru Pulled 0.8s
 ⠹ gptr [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 1.006GB / 1.02GB Pulling 122.3s
 ⠹ hedgedoc [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 170.8MB / 175.7MB Pulling 122.3s
 ✔ tinyauth Pulled 0.8s
 ⠹ prowlarr [⣿⣿] 67.75MB / 67.75MB Pulling 122.3s
 ✔ cloudflare-ddns Pulled 0.8s
 ✔ homepage Pulled 0.8s
 ✔ docker-gen Pulled 0.7s
 ✔ dozzle Pulled 0.8s
 ✔ rclone Pulled 0.7s
 ⠹ flaresolverr [⣿⣿⣿⣿⣿⣿⣿⣿] 226.8MB / 226.8MB Pulling 122.3s
 ✔ headscale-server Pulled 0.7s
 ✔ portainer Pulled 0.8s
 ⠹ mcpo [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 153.9MB / 173.6MB Pulling 122.3s
 ✔ code-server Pulled 118.8s
 ✔ litellm-postgres Pulled 60.3s
 ⠹ open-webui [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 2.169GB / 2.189GB Pulling 122.3s
 ✔ searxng Pulled 0.8s
 ⠹ litellm [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 720.8MB / 789.2MB Pulling 122.3s
 ✔ mongodb Pulled 0.8s
 ✔ dockerproxy Pulled 0.8s
 ✔ headscale Pulled 0.9s
 ✔ jackett Pulled 116.4s
 ✔ watchtower Pulled 0.8s
 ✔ nginx-traefik-extensions Pulled 0.8s
 ✔ rclone-init Pulled 0.8s
 ✔ stremio Pulled 0.8s
 ✔ whoami Pulled 0.8s
 ⠹ mediaflow-proxy [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 88.86MB / 93.75MB Pulling 122.2s
 ✔ mediafusion Pulled 119.9s
 ✔ logrotate-traefik Pulled 0.8s
 ✔ traefik Pulled 0.8s
 ✔ redis Pulled 0.8s
 ✔ init_prometheus Pulled 0.8s
 ⠹ comet [⣿⣿⣿⣿⣿⣿⣿⣿⣿] 181.1MB / 184.4MB Pulling 122.2s
 ✔ crowdsec Pulled 0.8s
 ✔ hedgedoc-db Pulled 59.7s
unexpected EOF
● docker.service - Docker Application Container Engine
     Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; preset: enabled)
     Active: activating (auto-restart) (Result: core-dump) since Fri 2025-08-29 00:48:55 UTC; 22ms ago
 Invocation: 3c501a15eded4a94981b4005aa709a27
TriggeredBy: ● docker.socket
       Docs: https://docs.docker.com
    Process: 2511264 ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock (code=dumped, signal=SEGV)
   Main PID: 2511264 (code=dumped, signal=SEGV)
   Mem peak: 9.7G
        CPU: 2min 35.313s
docker.service: Failed with result 'core-dump'.
docker.service: Unit process 2514086 (unpigz) remains running after unit stopped.
docker.service: Consumed 2min 35.313s CPU time, 9.7G memory peak.
docker.service: Scheduled restart job, restart counter is at 7.
Starting docker.service - Docker Application Container Engine...
time="2025-08-29T00:48:57.676821266Z" level=info msg="Starting up"
time="2025-08-29T00:48:57.677498068Z" level=info msg="OTEL tracing is not configured, using no-op tracer provider"
time="2025-08-29T00:48:57.677618789Z" level=info msg="detected 127.0.0.53 nameserver, assuming systemd-resolved, so using resolv.conf: /run/systemd/resolve/resolv.conf"
 
how to fix the above bizarre issue when trying to use docker CLI, exact command ran was:
 

```

docker compose up -d --remove-orphans --force-recreate --pull=always --build || sudo systemctl status docker -o cat --no-pager
```

## Assistant

_Time: 2025-08-29T00:50:13.582Z_



## User

_Time: 2025-08-29T00:50:28.067Z_

[+] Running 183/203ed 0.8s
 ⠸ aiostreams [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 178.9MB / 188.1MB Pulling 122.3s
 ✔ prometheus Pulled 0.8s
 ✔ warp-nat-gateway Pulled 0.8s
 ✔ failover-proxy Pulled 0.8s
 ✔ stremthru Pulled 0.8s
 ⠹ gptr [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 1.006GB / 1.02GB Pulling 122.3s
 ⠹ hedgedoc [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 170.8MB / 175.7MB Pulling 122.3s
 ✔ tinyauth Pulled 0.8s
 ⠹ prowlarr [⣿⣿] 67.75MB / 67.75MB Pulling 122.3s
 ✔ cloudflare-ddns Pulled 0.8s
 ✔ homepage Pulled 0.8s
 ✔ docker-gen Pulled 0.7s
 ✔ dozzle Pulled 0.8s
 ✔ rclone Pulled 0.7s
 ⠹ flaresolverr [⣿⣿⣿⣿⣿⣿⣿⣿] 226.8MB / 226.8MB Pulling 122.3s
 ✔ headscale-server Pulled 0.7s
 ✔ portainer Pulled 0.8s
 ⠹ mcpo [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 153.9MB / 173.6MB Pulling 122.3s
 ✔ code-server Pulled 118.8s
 ✔ litellm-postgres Pulled 60.3s
 ⠹ open-webui [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 2.169GB / 2.189GB Pulling 122.3s
 ✔ searxng Pulled 0.8s
 ⠹ litellm [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 720.8MB / 789.2MB Pulling 122.3s
 ✔ mongodb Pulled 0.8s
 ✔ dockerproxy Pulled 0.8s
 ✔ headscale Pulled 0.9s
 ✔ jackett Pulled 116.4s
 ✔ watchtower Pulled 0.8s
 ✔ nginx-traefik-extensions Pulled 0.8s
 ✔ rclone-init Pulled 0.8s
 ✔ stremio Pulled 0.8s
 ✔ whoami Pulled 0.8s
 ⠹ mediaflow-proxy [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿] 88.86MB / 93.75MB Pulling 122.2s
 ✔ mediafusion Pulled 119.9s
 ✔ logrotate-traefik Pulled 0.8s
 ✔ traefik Pulled 0.8s
 ✔ redis Pulled 0.8s
 ✔ init_prometheus Pulled 0.8s
 ⠹ comet [⣿⣿⣿⣿⣿⣿⣿⣿⣿] 181.1MB / 184.4MB Pulling 122.2s
 ✔ crowdsec Pulled 0.8s
 ✔ hedgedoc-db Pulled 59.7s
unexpected EOF
● docker.service - Docker Application Container Engine
     Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; preset: enabled)
     Active: activating (auto-restart) (Result: core-dump) since Fri 2025-08-29 00:48:55 UTC; 22ms ago
 Invocation: 3c501a15eded4a94981b4005aa709a27
TriggeredBy: ● docker.socket
       Docs: https://docs.docker.com
    Process: 2511264 ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock (code=dumped, signal=SEGV)
   Main PID: 2511264 (code=dumped, signal=SEGV)
   Mem peak: 9.7G
        CPU: 2min 35.313s
docker.service: Failed with result 'core-dump'.
docker.service: Unit process 2514086 (unpigz) remains running after unit stopped.
docker.service: Consumed 2min 35.313s CPU time, 9.7G memory peak.
docker.service: Scheduled restart job, restart counter is at 7.
Starting docker.service - Docker Application Container Engine...
time="2025-08-29T00:48:57.676821266Z" level=info msg="Starting up"
time="2025-08-29T00:48:57.677498068Z" level=info msg="OTEL tracing is not configured, using no-op tracer provider"
time="2025-08-29T00:48:57.677618789Z" level=info msg="detected 127.0.0.53 nameserver, assuming systemd-resolved, so using resolv.conf: /run/systemd/resolve/resolv.conf"
 
how to fix the above bizarre issue when trying to use docker CLI, exact command ran was:
 

```

docker compose up -d --remove-orphans --force-recreate --pull=always --build || sudo systemctl status docker -o cat --no-pager
```

there is no possible network issue so that can be ruled out

## Assistant

_Time: 2025-08-29T00:52:39.458Z_

The Docker service is crashing due to a segmentation fault (SEGV) during parallel image pulls, likely triggered by resource exhaustion or a known bug in Docker Engine version 28.0.0. This manifests as "unexpected EOF" errors and repeated service restarts. Research suggests this is often linked to high concurrent downloads overwhelming system memory (your log shows a 9.7GB peak) or network handling, even without overt network problems. Updating Docker Engine to the latest stable release (28.0.1 or higher, as of August 2025) and limiting concurrent pulls should resolve it.

**Key Steps to Fix:**
- **Limit concurrent downloads:** Edit `/etc/docker/daemon.json` (create if missing) to add `{"max-concurrent-downloads": 1, "max-concurrent-uploads": 1}`, then run `sudo systemctl restart docker`. This prevents overload during pulls.
- **Update Docker:** Install the latest Engine version via official channels to patch known bugs in 28.0.x causing EOF and crashes.
- **Prune resources:** Run `docker system prune -a -f` to clear unused images and free memory/disk.
- **Run sequentially:** For your command, first pull images one-by-one if possible, or use the modified daemon config before retrying `docker compose up -d --remove-orphans --force-recreate --pull=always --build`.
- **Monitor resources:** Use `htop` or `free -h` during pulls to watch memory; add swap if under 16GB RAM.

**Potential Causes and Why This Happens**
Parallel pulls in `docker compose up --pull=always` can spike memory usage, leading to segfaults in dockerd, especially with large images like those in your stack (e.g., open-webui at ~2GB). This is exacerbated by bugs in recent versions, as reported in community forums.

**Verification After Fix**
After applying changes, test with a single image pull (e.g., `docker pull hello-world`) and monitor logs via `journalctl -u docker -f`. If crashes persist, enable core dumps for debugging: Run `ulimit -c unlimited` before starting dockerd, then analyze the core file with `gdb`.

---

The Docker issue you're encountering—characterized by "unexpected EOF" during image pulls, followed by dockerd crashing with a segmentation fault (SEGV) and core dump—appears to stem from a combination of system resource strain and potential bugs in Docker Engine versions around 28.0.x, as documented in multiple 2025 reports. This detailed overview expands on the direct fixes above, incorporating analysis from technical forums, bug trackers, and release notes. It includes root causes, diagnostic steps, advanced troubleshooting, and preventive measures to ensure long-term stability.

### Root Causes Based on Analysis
From extensive searches across Stack Overflow, GitHub, Reddit, Arch Linux forums, and Docker's issue trackers, this problem is recurrent in 2025 setups, particularly on Linux systems like Ubuntu or Arch. Key triggers include:
- **Resource Overload:** Your log shows a memory peak of 9.7GB during parallel pulls of multiple large images (e.g., gptr at 1GB+, open-webui at 2GB+). This can cause memory corruption, leading to SEGV in dockerd. CPU usage (2min 35s in your log) and parallel operations exacerbate this.
- **Docker Version Bugs:** Docker Engine 28.0.0 has known intermittent "unexpected EOF" issues during layered downloads, as per GitHub issue #49513 (February 2025). Similar crashes during multi-image pulls are reported in Launchpad bug #2109499 (April 2025) and Arch Linux threads (March 2025), often on updated systems like Ubuntu 25.04.
- **Network Handling Edge Cases:** Even without "possible network issues," subtle factors like MTU mismatches, proxy interference, or registry timeouts can cause EOF. For instance, large layer downloads (>1GB) fail if concurrent requests saturate bandwidth, mimicking EOF.
- **Parallel Pull Behavior:** Your command (`docker compose up -d --remove-orphans --force-recreate --pull=always --build`) triggers simultaneous pulls for all services, overwhelming the daemon. Docker Compose v2 defaults to parallel pulls without an easy disable flag, unlike older versions.
- **Other Factors:** Disk pressure (if /var/lib/docker is full), corrupted layers in the registry, or containerd/runtime misconfigurations can contribute, though less likely here.

No evidence points to hardware faults or malware, but ruling them out via `dmesg | grep segfault` is advisable.

### Diagnostic Steps
To confirm the cause:
1. Check Docker version: `docker --version`. If it's 28.0.0, update immediately.
2. Inspect logs: `journalctl -u docker -xe` for SEGV details; look for patterns like "Process: ExecStart=/usr/bin/dockerd" failing.
3. Monitor during reproduction: Run `docker compose pull` (without up) while watching `top` or `htop` for memory spikes.
4. Test single pulls: `docker pull <one-image-from-your-stack>`, e.g., `docker pull open-webui`. If it succeeds, parallelism is the culprit.
5. System resources: `free -h` (memory), `df -h /var/lib/docker` (disk). If RAM is low (<16GB), add swap: `sudo fallocate -l 4G /swapfile; sudo mkswap /swapfile; sudo swapon /swapfile`.
6. Network validation: `curl -I https://registry-1.docker.io/v2/` to test registry access; check MTU with `ping -M do -s 1472 registry-1.docker.io` (adjust if fragmentation occurs).

### Advanced Fixes and Workarounds
Beyond the key steps:
- **Daemon Configuration Tweaks:** As mentioned, add to `/etc/docker/daemon.json`:
  ```
  {
    "max-concurrent-downloads": 1,
    "max-download-attempts": 10,
    "log-driver": "json-file",
    "log-opts": { "max-size": "10m" }
  }
  ```
  Reload with `sudo systemctl daemon-reload && sudo systemctl restart docker`. This reduces parallelism and increases retries for flaky downloads.
- **Sequential Pulling in Compose:** Since Compose v2 lacks `--no-parallel`, script it: Create a bash loop to pull each image from your docker-compose.yml sequentially, then run `up`.
  ```bash
  # Extract images from compose file and pull one by one
  images=$(docker compose config | grep image: | awk '{print $2}' | sort -u)
  for img in $images; do docker pull $img; done
  docker compose up -d --remove-orphans --force-recreate --build
  ```
- **Update Process:** Fetch the latest Docker Engine (28.0.1+ as of August 2025) from official repos:
  - For Ubuntu/Debian: `sudo apt-get update && sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`.
  - Verify post-update: `docker version`.
  Release notes for 28.0.x confirm fixes for pull stability in minor updates.
- **Enable Core Dump Analysis:** For persistent SEGV:
  - Set `ulimit -c unlimited` in `/etc/systemd/system/docker.service` under [Service] as `ExecStartPre=/bin/sh -c "ulimit -c unlimited"`.
  - Restart service, reproduce, then find core file in `/var/lib/docker` or working dir.
  - Debug with `gdb /usr/bin/dockerd core.<pid>` and `bt` for backtrace. Report to Docker GitHub if it's a bug.
- **Alternative Runtimes:** If issues persist, switch to containerd standalone: Install via `apt install containerd`, configure in `/etc/containerd/config.toml`, and set Docker to use it.
- **Pruning and Cleanup:** Regularly run `docker system prune -a --volumes` to reclaim space. Your log shows many services; orphaned containers from `--remove-orphans` might accumulate.

### Common Docker Pull Errors and Fixes
Here's a table summarizing related errors from community reports (2025-focused), with fixes tailored to your scenario:

| Error/Message | Likely Cause | Fix/Command | Source Notes |
|---------------|--------------|-------------|-------------|
| Unexpected EOF during pull | Network timeout or concurrent overload on large layers (>1GB) | Set max-concurrent-downloads=1 in daemon.json; increase attempts to 10 | Stack Overflow (2018-2025 threads); GitHub #49513 (Feb 2025) |
| Dockerd SEGV/core dump | Memory corruption from high resource use or bug in 28.0.0 | Update to 28.0.1+; monitor with htop; add swap if RAM low | Arch Linux forum (Mar 2025); Launchpad #2109499 (Apr 2025) |
| Service restart loop (counter at 7) | Repeated crashes during multi-pull | Sequential pulls via script; prune system first | Reddit /r/docker (Mar 2025); Unraid forum (May 2025) |
| Failed layer download retries | Registry blob corruption or proxy issues | Delete partial layers: `rm -rf /var/lib/docker/overlay2/*`; retry pull | Stack Overflow (2021-2025); Docker forums (2023) |
| High memory peak (9.7G) | Parallel pulls of large images | Limit concurrency; optimize compose file to stagger services | General from multiple EOF threads |

### Preventive Measures
- **Version Management:** Pin to stable releases; monitor Docker's release notes for pull-related fixes in 28.x series.
- **Resource Allocation:** For production-like stacks, ensure >16GB RAM and use orchestration tools like Kubernetes for better scaling.
- **Testing:** Use a VM or test environment to simulate pulls before production runs.
- **Community Monitoring:** Watch GitHub/moby/moby for open issues on SEGV (none directly matching in late 2025 searches, but report if unresolved).
- **Alternatives if Needed:** If Docker remains unstable, consider Podman (rootless) or Nerdctl for Compose compatibility without dockerd.

This should fully resolve the issue based on aggregated evidence. If symptoms differ post-fixes, provide more logs for deeper analysis.

**Key Citations:**
- [Stack Overflow: Docker pull “unexpected EOF”](https://stackoverflow.com/questions/53677592/docker-pull-unexpected-eof)
- [GitHub Moby: Intermittent "unexpected EOF" while downloading container layers](https://github.com/moby/moby/issues/49513)
- [Arch Linux BBS: Strange dockerd crashing bug when pulling images](https://bbs.archlinux.org/viewtopic.php?id=303943)
- [Launchpad: Dockerd crashes with SEGV during image pull / docker cp](https://bugs.launchpad.net/bugs/2109499)
- [Reddit: unexpected EOF during docker-compose pull brings down system](https://www.reddit.com/r/selfhosted/comments/1jiveo4/unexpected_eof_during_dockercompose_pull_brings/)
- [Docker Docs: Engine v28 Release Notes](https://docs.docker.com/engine/release-notes/28/)
- [Docker Desktop Release Notes (related for version context)](https://docs.docker.com/desktop/release-notes/)<grok:render card_id="324dbe" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render><grok:render card_id="f1f19f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render><grok:render card_id="8a938b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render><grok:render card_id="502a5d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render><grok:render card_id="00e5bd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render><grok:render card_id="759442" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">75</argument>
</grok:render><grok:render card_id="e2dfe4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">76</argument>
</grok:render>
