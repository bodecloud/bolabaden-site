---
source_url: "https://chatgpt.com/c/6858502d-67d0-8006-9c2e-5642e6900ce7"
conversation_id: "6858502d-67d0-8006-9c2e-5642e6900ce7"
title: "Uninstall conflicting Docker CLI"
extracted_at: "2026-06-29T14:33:11.811Z"
message_count: 3
provenance: auth-ui
---

# Uninstall conflicting Docker CLI

Source: [ChatGPT conversation](https://chatgpt.com/c/6858502d-67d0-8006-9c2e-5642e6900ce7)

## User

i'm running docker desktop on fedora. i seem to have accidentally isntalled the cli docker in addition to docker desktop. how to uninstall the other one so it stops conflicting with the preferred docker desktop?

## Assistant

To uninstall the standalone Docker CLI (and possibly Docker Engine) on Fedora — while keeping Docker Desktop — follow these steps:

🧼 1. Check what's installed

Run this to see all Docker-related packages:

Bash
rpm -qa | grep docker

You'll likely see entries like:

docker

docker-cli

docker-engine

docker-common

docker-ce (if you used Docker’s official repo)

🧹 2. Remove standalone Docker packages

You can safely uninstall the CLI and engine using:

Bash
sudo dnf remove docker docker-cli docker-engine docker-ce docker-common

Don't worry — this won't touch Docker Desktop.

✅ 3. Verify Docker Desktop is still working

After removing the conflicting packages, restart Docker Desktop and check the version:

Bash
docker version

The client version should match Docker Desktop's version (check via the Docker Desktop UI), and the server should show something like Docker Desktop.

You can also verify it's using the right socket:

Bash
docker info | grep 'Docker Root Dir'

It should reference something like:

/var/lib/docker-desktop
🔒 4. (Optional) Prevent dnf from reinstalling CLI accidentally

You can mark Docker packages to be excluded from updates:
Edit /etc/dnf/dnf.conf and add:

INI
exclude=docker* containerd*

Let me know if you want to verify output or explore Podman alternatives!

## Assistant

On Fedora, Docker Desktop includes its own version of the Docker CLI, but if you also installed the standalone Docker Engine or CLI (via dnf or similar), it can cause conflicts — especially around which version of the CLI is in your $PATH.

Here’s how to safely remove the standalone Docker CLI and/or Engine, leaving only Docker Desktop functional:

✅ Step 1: Check Installed Docker Packages

Run the following command to list all Docker-related RPM packages:

Bash
rpm -qa | grep docker

You’ll likely see packages like:

docker-ce-cli-XX.XX.X
docker-ce-XX.XX.X
docker-scan-plugin
docker-buildx-plugin
✅ Step 2: Remove Conflicting Docker Packages

To uninstall the Docker CLI and Engine:

Bash
sudo dnf remove docker-ce docker-ce-cli docker-ce-rootless-extras docker-scan-plugin docker-buildx-plugin

Only remove packages that you didn’t install via Docker Desktop.

✅ Step 3: Confirm docker Command Points to Docker Desktop CLI

Docker Desktop installs its own version of the docker CLI, typically in:

Bash
/var/lib/docker-desktop/bin/docker

You can verify what version of docker is running:

Bash
which docker
docker version

If it's still pointing to /usr/bin/docker, you may need to adjust your $PATH to prioritize the Docker Desktop version.

To do that, add this to your shell config (e.g., ~/.bashrc or ~/.zshrc):

Bash
export PATH="/var/lib/docker-desktop/bin:$PATH"

Then reload your shell:

Bash
source ~/.bashrc  # or source ~/.zshrc
✅ Step 4: Restart Docker Desktop

Once the standalone Docker components are removed and the correct CLI path is set, restart Docker Desktop:

Bash
systemctl --user restart docker-desktop

Or just close and reopen the Docker Desktop app.

Let me know if you’d like help identifying exactly which packages are safe to remove based on your current setup (rpm -qa | grep docker output).
