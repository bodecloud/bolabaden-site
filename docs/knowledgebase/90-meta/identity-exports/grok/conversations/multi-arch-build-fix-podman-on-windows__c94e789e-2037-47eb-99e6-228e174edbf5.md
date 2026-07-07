---
source_url: "https://grok.com/c/c94e789e-2037-47eb-99e6-228e174edbf5"
conversation_id: "c94e789e-2037-47eb-99e6-228e174edbf5"
title: "Multi-Arch Build Fix: Podman on Windows"
extracted_at: "2026-06-29T16:10:03.819Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Multi-Arch Build Fix: Podman on Windows

Source: [Grok conversation](https://grok.com/c/c94e789e-2037-47eb-99e6-228e174edbf5)

## User

_Time: 2026-02-28T08:19:04.931Z_

PS C:\GitHub\agentdecompile> docker buildx build --builder multiarch --platform linux/amd64,linux/arm64 -f Docker.aio -t docker.io/bolabaden/agentdecompile-aio:latest --push .
ERROR: no builder "multiarch" found
 
how to fix on windows 11 with podman desktop

## Assistant

_Time: 2026-02-28T08:20:19.227Z_

**The error occurs because no Buildx builder named "multiarch" exists**—your command references one that was never created. On Windows 11 with Podman Desktop, the Docker CLI compatibility layer routes to Podman/Buildah and does not reliably support custom `docker buildx` builders or the `docker-container` driver needed for multi-platform builds. 

**The recommended fix** is to switch to native Podman commands (which handle multi-arch natively via manifests) after a one-time QEMU setup for ARM64 emulation. This is simpler, more reliable, and officially supported.

**Quick steps (run in PowerShell):**
1. Log in: `podman login docker.io`
2. Enable QEMU emulation (one-time):  
   `podman run --rm --privileged multiarch/qemu-user-static --reset -p yes`
3. Build the multi-arch image:  
   ```
   podman build --platform linux/amd64,linux/arm64 -f Docker.aio --manifest bolabaden/agentdecompile-aio-multi .
   ```
4. Push:  
   ```
   podman manifest push --all bolabaden/agentdecompile-aio-multi docker.io/bolabaden/agentdecompile-aio:latest
   ```

This creates and pushes a single manifest list containing both `linux/amd64` and `linux/arm64` variants.

**GUI alternative (easiest, no commands):**  
Open Podman Desktop → **Images** → **Build** → select `Docker.aio` → set image name to `docker.io/bolabaden/agentdecompile-aio:latest` → choose both **linux/amd64** and **linux/arm64** platforms → Build → push the resulting image from the list.

**Troubleshooting if ARM64 fails** (e.g., “exec format error” during `RUN` steps):  
- Run `podman machine ssh`  
- Inside the machine: `sudo dnf install -y qemu-user-static`  
- Exit and `podman machine restart`  
- Retry the build.

---

Multi-platform (multi-arch) container images let one tag (`docker.io/bolabaden/agentdecompile-aio:latest`) work seamlessly on both AMD64 and ARM64 machines (e.g., Intel/AMD PCs and ARM-based servers or Apple Silicon via compatibility). Docker traditionally uses Buildx + BuildKit for this, but Podman Desktop on Windows takes a different approach because it runs a Fedora-based Linux VM (via QEMU) and uses Buildah under the hood instead of the full Docker daemon.

The exact command you ran fails for two reasons:
- `--builder multiarch` references a non-existent builder instance. In full Docker Desktop you would first run `docker buildx create --name multiarch --driver docker-container --use --bootstrap`, but Podman Desktop’s Docker shim does not expose a working `docker-container` driver or persistent BuildKit builders in the same way.
- Even if the builder existed, multi-platform builds often require the `docker-container` driver (which spins up a BuildKit container), and Podman’s compatibility layer has known limitations here (partial support only; the GUI build sometimes parses platforms incorrectly too).

Podman solves this cleanly with a built-in manifest list system. When you specify multiple `--platform` values, Podman builds separate images for each architecture (using QEMU user-mode emulation for the non-native one) and links them under a single manifest. The image registry (Docker Hub) then serves the correct variant automatically based on the client’s architecture.

**QEMU emulation requirement**  
Your Windows 11 host (amd64) cannot natively execute arm64 `RUN` instructions. QEMU user-static registers binfmt handlers so the Podman VM can transparently emulate the foreign architecture. The `podman run --rm --privileged multiarch/qemu-user-static --reset -p yes` command does this for the current session. On Podman Desktop Windows the registration lives inside the VM; if it disappears after a restart, install the package persistently inside the machine as shown in troubleshooting.

**Complete Podman CLI workflow (recommended for automation/scripts)**  
```
# 1. Authenticate (one-time)
podman login docker.io

# 2. Register QEMU (one-time per session or after machine restart)
podman run --rm --privileged multiarch/qemu-user-static --reset -p yes

# 3. Build (creates/updates the manifest list)
podman build --platform linux/amd64,linux/arm64 -f Docker.aio --manifest bolabaden/agentdecompile-aio-multi .

# 4. Push the manifest (pushes all variants + the list)
podman manifest push --all bolabaden/agentdecompile-aio-multi docker.io/bolabaden/agentdecompile-aio:latest
```

You can verify locally with `podman manifest inspect bolabaden/agentdecompile-aio-multi` (shows both platforms) or pull on an ARM64 machine to confirm the right variant is selected.

**Podman Desktop GUI workflow**  
1. Open Podman Desktop.  
2. Go to **Images** → **Build image**.  
3. Choose your `Docker.aio` file as the build context.  
4. Set **Image name** to `docker.io/bolabaden/agentdecompile-aio:latest`.  
5. Under **Platforms**, select both **linux/amd64** and **linux/arm64**.  
6. Click **Build**.  
7. Once complete, find the image, click the three dots → **Push image** (or use the CLI push if you prefer).  

Note: Older versions of Podman Desktop had a platform-parsing bug in the GUI (fixed in recent releases); if it complains about syntax, fall back to the CLI.

**Comparison of build methods**

| Method                  | Command Example (simplified)                          | Works on Podman Desktop Windows? | Needs QEMU Setup? | Pros                              | Cons                                      |
|-------------------------|-------------------------------------------------------|----------------------------------|-------------------|-----------------------------------|-------------------------------------------|
| Docker Buildx (your original) | `docker buildx build --builder multiarch --platform linux/amd64,linux/arm64 ...` | Partial / unreliable            | Yes              | Familiar Docker syntax           | Builder creation often fails; no full BuildKit support |
| Podman CLI (recommended) | `podman build --platform linux/amd64,linux/arm64 --manifest ...` | Yes (native)                    | Yes              | Simple, manifest built-in, fully supported | Slightly different syntax from Docker    |
| Podman Desktop GUI      | GUI build with platform checkboxes                    | Yes                             | Yes              | No typing, visual platform picker| GUI bug in very old versions; less scriptable |
| Separate builds + manifest | Build amd64 → build arm64 → `podman manifest add`    | Yes                             | Yes              | Works even if single command fails | More steps                               |

**Advanced notes and troubleshooting table**

| Issue                              | Symptom                              | Fix                                                                 |
|------------------------------------|--------------------------------------|---------------------------------------------------------------------|
| ARM64 build fails with “exec format error” | `RUN` step in Dockerfile.aio crashes | Run the QEMU registration command; if persistent issue, `podman machine ssh` + `sudo dnf install -y qemu-user-static` + restart machine |
| “failed to parse platform”         | GUI or CLI syntax error              | Use CLI with exact `--platform linux/amd64,linux/arm64` (no extra commas) |
| Image not appearing on Docker Hub as multi-arch | Only one platform shows             | Use `podman manifest push --all` or verify with `podman manifest inspect` |
| Permission / privileged errors     | QEMU container fails                 | Run in an elevated PowerShell or ensure Hyper-V/WSL is enabled in Windows Features |
| Podman machine issues              | Build context not found              | `podman machine start` and make sure your GitHub folder is mounted (default is) |

**Why Podman is the right choice here**  
Podman Desktop was designed as a Docker Desktop replacement. It provides full Docker CLI compatibility for everyday commands, but advanced features like Buildx multi-node builders are intentionally replaced by native Podman tools (Buildah + manifest lists). This keeps the system daemonless and rootless where possible. The approach is endorsed by Red Hat and works consistently across Windows, macOS, and Linux.

**Verification after push**  
- On an amd64 machine: `podman pull docker.io/bolabaden/agentdecompile-aio:latest` → `podman run ... uname -m` should show `x86_64`.  
- On an arm64 machine (or use `--platform linux/arm64`): same command shows `aarch64`.  

If your `Docker.aio` uses advanced Buildx-specific features (e.g., `docker buildx bake` files), you may need to adapt the Dockerfile slightly, but standard Dockerfiles work unchanged. For very complex multi-stage or cache-heavy builds, the separate-build approach (build each platform individually then add to manifest) is a reliable fallback.

This workflow is production-ready, used by many teams migrating from Docker Desktop, and eliminates the “no builder found” error entirely.

**Key Citations**  
- Red Hat Developer: How to build multi-architecture container images (Podman manifest workflow)  
- Podman official documentation: podman-build(1) — multi-platform and manifest options  
- Podman.io blog: Working with container image manifest lists (QEMU + multi-arch details)  
- GitHub containers/podman-desktop issue #7004 (Windows cross-build ARM64 troubleshooting)  
- Blog post on multi-architecture containers with Podman on Windows/WSL (QEMU registration steps)  
- Docker documentation: Multi-platform builds (for comparison of Buildx approach)  
- Podman Desktop GitHub discussions (Docker CLI shim limitations for buildx)
