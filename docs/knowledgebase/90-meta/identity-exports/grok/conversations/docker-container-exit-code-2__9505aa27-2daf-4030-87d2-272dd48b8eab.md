---
source_url: "https://grok.com/c/9505aa27-2daf-4030-87d2-272dd48b8eab"
conversation_id: "9505aa27-2daf-4030-87d2-272dd48b8eab"
title: "Docker Container Exit Code 2"
extracted_at: "2026-06-29T16:24:07.724Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Docker Container Exit Code 2

Source: [Grok conversation](https://grok.com/c/9505aa27-2daf-4030-87d2-272dd48b8eab)

## User

_Time: 2025-08-28T22:47:42.962Z_

I have a docker container that keeps exiting out of nowhere with 'exit code 2'. What does this mean?
there's no issue with the image/container itself. the status of the systemd docker service gives this output:

```
time="2025-08-28T17:45:22.301057989-05:00" level=info msg="No non-localhost DNS nameservers are left in resolv.conf. Using default external servers"
time="2025-08-28T17:45:22.661112046-05:00" level=info msg="No non-localhost DNS nameservers are left in resolv.conf. Using default external servers"
time="2025-08-28T17:45:22.673437651-05:00" level=info msg="No non-localhost DNS nameservers are left in resolv.conf. Using default external servers"
time="2025-08-28T17:45:23.228788383-05:00" level=info msg="ignoring event" container=db896c2864936f8ee1521f7d39f13116d8d9b1927add7c9c1149c46f2846b848 module=libcontainerd namespace=moby topic=/tasks/delete type="*events.TaskDelete"
time="2025-08-28T17:45:23.647645423-05:00" level=info msg="No non-localhost DNS nameservers are left in resolv.conf. Using default external servers"
time="2025-08-28T17:45:25.178719127-05:00" level=info msg="No non-localhost DNS nameservers are left in resolv.conf. Using default external servers"
time="2025-08-28T17:45:29.705741017-05:00" level=info msg="ignoring event" container=2b727849283e0d75627d80fe904900d392e0ad0f18614d0ceda33be10a8945ac module=libcontainerd namespace=moby topic=/tasks/delete type="*events.TaskDelete"
time="2025-08-28T17:45:29.722346383-05:00" level=warning msg="ShouldRestart failed, container will not be restarted" container=2b727849283e0d75627d80fe904900d392e0ad0f18614d0ceda33be10a8945ac daemonShuttingDown=false error="restart canceled" execDuration=13.785010777s exitStatus="{2 2025-08-28 22:45:29.632050869 +0000 UTC}" hasBeenManuallyStopped=true restartCount=0
time="2025-08-28T17:45:52.437284156-05:00" level=info msg="No non-localhost DNS nameservers are left in resolv.conf. Using default external servers"
time="2025-08-28T17:46:49.008402661-05:00" level=info msg="No non-localhost DNS nameservers are left in resolv.conf. Using default external servers"
```

How to fix?

## Assistant

_Time: 2025-08-28T22:49:11.987Z_

The exit code 2 from a Docker container typically indicates a syntax error in the command or entrypoint, misuse of shell built-ins, or an attempt to access a non-existent file or directory (equivalent to ENOENT in Unix systems). This is distinct from common termination signals like SIGTERM (exit code 143) or SIGKILL (exit code 137), suggesting the failure originates from the application or script running inside the container rather than an external interruption.

Based on the provided daemon logs, several observations are relevant:
- The repeated warnings about "No non-localhost DNS nameservers are left in resolv.conf. Using default external servers" indicate that Docker has detected the host's /etc/resolv.conf is configured to use a localhost-based DNS resolver (e.g., 127.0.0.1 or 127.0.0.53, common with systemd-resolved on Ubuntu or similar distributions). Docker automatically falls back to public servers like 8.8.8.8 and 8.8.4.4. This configuration can lead to resolution failures if the container requires access to private or local network domains, potentially causing the application to exit if it depends on DNS lookups.
- The warning "ShouldRestart failed, container will not be restarted" with "error='restart canceled'" and "hasBeenManuallyStopped=true" implies that Docker's restart policy (e.g., --restart=always or --restart=on-failure) is not being applied. The "hasBeenManuallyStopped=true" flag is set when a container is explicitly stopped (e.g., via `docker stop`), preventing automatic restarts until manually cleared. This flag persists across daemon restarts and explains why the container does not resume despite the restart policy. The restartCount=0 further suggests this is not a repeated automatic restart attempt.

### Potential Causes
- **Application-Level Error**: The container's process may encounter a command-line syntax issue, missing dependency, or invalid argument, leading to exit code 2. Examples include a shell script failing to locate a file or an incorrect usage of built-in commands like `echo` or `test`.
- **DNS Configuration Mismatch**: If the application attempts to resolve hostnames (e.g., for API calls, database connections, or package installations) and the fallback public DNS servers cannot handle local queries, it could trigger the exit.
- **Manual Intervention Flag**: The container may have been stopped manually at some point (by a user, script, or system process), setting the flag and inhibiting restarts. This could appear as "exiting out of nowhere" if the stop event was overlooked or automated.
- **Host Environment Issues**: Interactions with systemd or network changes might indirectly affect container stability, though the logs do not indicate daemon crashes.

### Steps to Diagnose and Fix
1. **Inspect Container Details**:
   - Run `docker inspect <container_id>` (using the ID from the logs, e.g., 2b727849283e0d75627d80fe904900d392e0ad0f18614d0ceda33be10a8945ac) to review the restart policy, entrypoint, command, and last exit code. Look for "RestartPolicy" and "State" sections.

2. **Check Container Logs**:
   - Execute `docker logs --tail 100 -f <container_id>` to view the application's output. This will reveal the specific error causing exit code 2, such as a missing file or syntax issue, which the daemon logs do not capture.

3. **Reset the Manual Stop Flag and Restart**:
   - If the flag is the issue, start the container manually with `docker start <container_id>`. This clears "hasBeenManuallyStopped" and allows the restart policy to take effect.
   - Alternatively, update the policy explicitly: `docker update --restart=always <container_id>`.
   - If restarts still fail, recreate the container: `docker rm <container_id>` followed by `docker run` with the original parameters.

4. **Address DNS Warnings**:
   - Verify the host's DNS: Ensure `/etc/resolv.conf` on the host points to functional nameservers. If using systemd-resolved, symlink it to `/run/systemd/resolve/resolv.conf` if necessary.
   - Configure custom DNS for the container: When running the container, add `--dns <nameserver_ip>` (e.g., `--dns 192.168.1.1` for a local router) or edit `/etc/docker/daemon.json` with `"dns": ["<nameserver_ip>"]` and restart the daemon (`systemctl restart docker`).
   - Test DNS inside a temporary container: `docker run --rm busybox nslookup <hostname>` to confirm resolution.

5. **Verify Restart Policy Behavior**:
   - If using Docker Compose, ensure the `restart: always` or `restart: unless-stopped` directive is set in the YAML file, then recreate with `docker compose up -d`.
   - Monitor for external stops: Check system logs (`journalctl -u docker`) for patterns around the exit times.

6. **Additional Troubleshooting**:
   - Test the image independently: Run it on another host to isolate if the issue is environment-specific.
   - Increase logging: Add `--log-level debug` to the Docker daemon configuration and restart it to capture more details.
   - If OOM or resource constraints are suspected (though unlikely for exit code 2), check `dmesg | grep oom` on the host.

If the container logs reveal a specific application error, address it directly (e.g., correct syntax or add missing files). Should these steps not resolve the issue, provide the container logs and `docker inspect` output for further analysis.

## User

_Time: 2025-08-28T23:08:49.617Z_

it seems i've figured it out. traefik v3.5.1 crashes when used with crowdsec plugin. v3.5.0 and earlier don't have the issue. Has anyone reported the bug/issue yet or would I be the first?

## Assistant

_Time: 2025-08-28T23:09:56.992Z_

Based on an extensive review of available sources, including GitHub repositories, community forums, documentation, and related discussions, no direct reports of Traefik version 3.5.1 crashing specifically when used with the CrowdSec plugin have been identified. Several issues involving the CrowdSec middleware or plugin in earlier Traefik versions (such as 3.3.4, 3.1.4, or 2.x series) describe related problems, including middleware loading failures, configuration errors, HTTP 403 or 500 responses, and connectivity issues with the CrowdSec local API. However, these do not explicitly reference crashes or exits in version 3.5.1.<grok:render card_id="b8ff16" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render><grok:render card_id="4f3fb2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render><grok:render card_id="a01155" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render><grok:render card_id="c746e5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render><grok:render card_id="bd0463" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render><grok:render card_id="ed09b1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render><grok:render card_id="5cfdbe" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render><grok:render card_id="ffd43f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render><grok:render card_id="243e02" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render><grok:render card_id="1c8d41" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render><grok:render card_id="c6044e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render><grok:render card_id="c65e18" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render><grok:render card_id="a5ad89" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render><grok:render card_id="e5d84a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render>

Given that Traefik 3.5.1 appears to be a recent release (based on contextual timelines in discussions from early to mid-2025), it is plausible that this compatibility issue has not yet been publicly documented or reported. You may be among the first to encounter and identify it.

To address this, it is recommended that you file a bug report on the relevant repository. The CrowdSec Traefik plugin is maintained at https://github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin, where plugin-specific issues are typically handled. If the problem seems tied to core Traefik functionality, consider reporting it at https://github.com/traefik/traefik/issues. Include details such as your configuration files, logs from both Traefik and CrowdSec, reproduction steps, and confirmation that the issue resolves in version 3.5.0 or earlier. This will assist maintainers in investigating and potentially resolving the matter.

## User

_Time: 2025-08-28T23:11:11.195Z_

what exact changes were made in traefik v3.5.1 vs v3.5.0?

## Assistant

_Time: 2025-08-28T23:11:54.025Z_

Traefik version 3.5.1 introduces several targeted modifications compared to version 3.5.0, primarily focused on bug resolutions and dependency updates, with no documented enhancements or breaking changes. These alterations are derived from the official release notes on the Traefik GitHub repository.<grok:render card_id="cd7cc6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> Below is a structured overview of the exact changes, categorized for clarity.

### Bug Fixes
The following issues were addressed in version 3.5.1:
- Addition of log body support in OpenTelemetry (OTEL) access logs (Pull Request #11867, contributed by tomMoulard).
- Update to the dependency `github.com/go-acme/lego/v4` to version 4.25.1 (Pull Request #11882, contributed by ldez).
- Implementation of case-insensitivity for application protocols in Kubernetes Gateway API (Pull Request #11989, contributed by shreealt).
- Correction of a spelling error in the documentation (Pull Request #11952, contributed by mmanciop).
- Update to the dependency `github.com/pires/go-proxyproto` to version 0.8.1 (Pull Request #11991, contributed by rtribotte).
- Suppression of expected error logs upon receiving SIGTERM signals (Pull Request #11838, contributed by Kwuray).
- Canonicalization of `capturedRequestHeaders` and `capturedResponseHeaders` options in tracing configurations (Pull Request #12005, contributed by mcuelenaere).
- Alignment of root span naming in tracing with OTEL semantic conventions (Pull Request #11673, contributed by Alex-Waring).
- Update to development dependencies for the Traefik Proxy dashboard user interface (Pull Request #11958, contributed by mdeliatf).
- Refactoring to utilize `reflect.TypeFor` for improved code handling (Pull Request #12010, contributed by cuiweixie).

### Documentation and Miscellaneous Changes
No dedicated documentation updates or miscellaneous modifications are explicitly outlined in the release notes beyond the aforementioned spelling correction.

### Dependency Updates
As noted in the bug fixes, specific dependencies were upgraded:
- `github.com/go-acme/lego/v4` to 4.25.1.
- `github.com/pires/go-proxyproto` to 0.8.1.
- Dashboard UI development dependencies (details not further specified).

### Commits and Pull Requests
The release encompasses approximately 10 pull requests, as listed above, along with 5 commits to the master branch since the release. A notable commit hash is 30b0666219a8f1bd9f52a0766fa31ddfcc8ef7e6, though granular details for additional commits are not provided in the notes.

For a comprehensive review, consult the full release page on GitHub, which confirms these as the sole differences between versions 3.5.0 and 3.5.1.<grok:render card_id="430f85" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> If further context or verification is required, examining the individual pull requests may yield additional insights into the implementation details.
