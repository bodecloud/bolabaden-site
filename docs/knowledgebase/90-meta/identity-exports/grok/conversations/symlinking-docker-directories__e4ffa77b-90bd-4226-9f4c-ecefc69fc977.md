---
source_url: "https://grok.com/c/e4ffa77b-90bd-4226-9f4c-ecefc69fc977"
conversation_id: "e4ffa77b-90bd-4226-9f4c-ecefc69fc977"
title: "Symlinking Docker Directories"
extracted_at: "2026-06-29T16:26:52.171Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Symlinking Docker Directories

Source: [Grok conversation](https://grok.com/c/e4ffa77b-90bd-4226-9f4c-ecefc69fc977)

## User

_Time: 2025-06-14T16:54:40.544Z_

has anyone successfully symlinked the /var/lib/docker or /var/lib/containerd folders before? anytime i try i get a bunch of *weird* errors.

## Assistant

_Time: 2025-06-14T16:55:43.883Z_

Yes, people have successfully symlinked `/var/lib/docker` or `/var/lib/containerd` to move Docker’s storage to a different location, often to address disk space issues. However, it’s a delicate process, and errors are common if not done correctly. The "weird" errors you’re seeing are likely related to Docker’s strict requirements for filesystem paths, permissions, or symlink handling. Below, I’ll outline the key considerations, common errors, and steps to symlink these directories successfully, based on community experiences and technical insights.

### Key Considerations
1. **Why Symlink?**
   - Symlinking is typically used to redirect Docker’s data directory (e.g., `/var/lib/docker`) to a larger disk or partition when the default location (often on the root filesystem) runs out of space.
   - However, symlinking is less recommended than changing Docker’s data root directory officially via configuration, as symlinks can introduce issues with path resolution, permissions, or container runtime.

2. **Common Errors**
   - **"Too many levels of symbolic links"**: This occurs when Docker or containerd encounters recursive or broken symlinks, often due to improper link setup or filesystem mismatches.[](https://github.com/docker/for-win/issues/5763)[](https://www.suse.com/support/kb/doc/?id=000020104)
   - **"No such file or directory"**: Docker may fail to resolve paths if the symlink points to a non-existent or inaccessible location.[](https://github.com/oracle/docker-images/issues/2388)[](https://github.com/docker/for-mac/issues/1396)
   - **"OCI runtime create failed"**: Indicates the container runtime can’t access the symlinked directory, often due to permissions or SELinux/AppArmor restrictions.[](https://stackoverflow.com/questions/64106179/docker-wont-run-a-container-after-creating-a-symbolic-link)
   - **Overlay2 errors**: Docker’s overlay2 storage driver is sensitive to symlink issues, especially if the symlink crosses filesystems or has incorrect permissions.[](https://stackoverflow.com/questions/44942790/docker-error-failed-to-register-layer-symlink)[](https://github.com/docker/for-mac/issues/1396)
   - **Fluentd/Kubernetes logging issues**: Symlinks for `/var/lib/docker/containers` to `/var/log/containers` can break logging setups in Kubernetes if not aligned with expected paths.[](https://github.com/kubernetes/kubernetes/issues/27720)[](https://github.com/minishift/minishift/issues/510)[](https://github.com/kubernetes/kubernetes/issues/53022)

3. **Symlinking vs. Changing Data Root**
   - Symlinking `/var/lib/docker` is a quick workaround but can lead to errors, especially with modern Docker versions or containerd, which expect absolute paths and strict permissions.
   - The preferred method is to update Docker’s `data-root` in `/etc/docker/daemon.json` to point to the new location, avoiding symlinks entirely.[](https://linuxconfig.org/how-to-move-docker-s-default-var-lib-docker-to-another-directory-on-ubuntu-debian-linux)[](https://www.digitalocean.com/community/questions/how-to-move-the-default-var-lib-docker-to-another-directory-for-docker-on-linux)

### Steps to Symlink `/var/lib/docker` or `/var/lib/containerd`
Here’s a step-by-step guide to symlink these directories, minimizing errors:

1. **Stop Docker and Containerd Services**
   - Ensure Docker and containerd are stopped to prevent file access conflicts:
     ```bash
     sudo systemctl stop docker
     sudo systemctl stop docker.socket
     sudo systemctl stop containerd
     ```
   - Verify no processes are running:
     ```bash
     ps aux | grep docker
     ps aux | grep containerd
     ```

2. **Create the New Storage Location**
   - Identify a partition with sufficient space (e.g., `/mnt/newdisk/docker` or `/home/docker`).
   - Create the directory:
     ```bash
     sudo mkdir -p /mnt/newdisk/docker
     ```
   - Ensure proper ownership and permissions (Docker typically runs as `root`):
     ```bash
     sudo chown root:root /mnt/newdisk/docker
     sudo chmod 755 /mnt/newdisk/docker
     ```

3. **Copy Existing Data**
   - Move the existing Docker or containerd data to the new location, preserving permissions and metadata:
     ```bash
     sudo rsync -aP /var/lib/docker/ /mnt/newdisk/docker/
     sudo rsync -aP /var/lib/containerd/ /mnt/newdisk/containerd/
     ```
   - Note: Use `rsync` with `-a` to preserve permissions, timestamps, and hard links. Avoid `cp` unless you’re sure it preserves all attributes.[](https://linuxconfig.org/how-to-move-docker-s-default-var-lib-docker-to-another-directory-on-ubuntu-debian-linux)

4. **Rename or Remove Original Directories**
   - Rename the original directories to avoid conflicts:
     ```bash
     sudo mv /var/lib/docker /var/lib/docker.bak
     sudo mv /var/lib/containerd /var/lib/containerd.bak
     ```
   - Alternatively, remove them after verifying the new location works, but keep backups until you’re confident.

5. **Create the Symlink**
   - Create a symbolic link from the original path to the new location:
     ```bash
     sudo ln -s /mnt/newdisk/docker /var/lib/docker
     sudo ln -s /mnt/newdisk/containerd /var/lib/containerd
     ```
   - Verify the symlink:
     ```bash
     ls -l /var/lib/docker
     ls -l /var/lib/containerd
     ```
     Output should show: `lrwxrwxrwx 1 root root ... /var/lib/docker -> /mnt/newdisk/docker`

6. **Check Filesystem Compatibility**
   - Ensure the target filesystem supports features required by Docker’s storage driver (e.g., overlay2 requires `ext4` or `xfs` with `d_type` support).
   - Verify with:
     ```bash
     df -T /mnt/newdisk/docker
     ```
   - If using a different filesystem (e.g., `nfs` or `btrfs`), test thoroughly, as some drivers may not work well with symlinks.[](https://www.suse.com/support/kb/doc/?id=000020104)

7. **Restart Services**
   - Start containerd and Docker:
     ```bash
     sudo systemctl start containerd
     sudo systemctl start docker
     ```
   - Check status:
     ```bash
     sudo systemctl status docker
     sudo systemctl status containerd
     ```

8. **Test Docker**
   - Run a test container to ensure everything works:
     ```bash
     docker run --rm hello-world
     ```
   - Inspect Docker’s data root to confirm it’s using the new location:
     ```bash
     docker info --format '{{.DockerRootDir}}'
     ```

### Common Issues and Fixes
- **Error: "Too many levels of symbolic links"**
  - Cause: Recursive symlinks or a symlink pointing to itself.
  - Fix: Verify the symlink with `ls -l /var/lib/docker` and ensure it points to a valid directory. Use `namei /var/lib/docker` to trace the path and detect loops.[](https://unix.stackexchange.com/questions/553950/too-many-links-in-var-lib-docker-error-while-building-docker-container)[](https://github.com/docker/for-win/issues/5763)
  - Example:
    ```bash
    namei /var/lib/docker
    ```
    If it shows an error, remove and recreate the symlink.

- **Error: "No such file or directory"**
  - Cause: The target directory doesn’t exist, or permissions prevent access.
  - Fix: Ensure the target directory exists and is accessible:
    ```bash
    ls -ld /mnt/newdisk/docker
    sudo chmod 755 /mnt/newdisk/docker
    sudo chown root:root /mnt/newdisk/docker
    ```

- **Error: "OCI runtime create failed"**
  - Cause: Symlink is not an absolute path, or security modules (SELinux/AppArmor) block access.
  - Fix: Use absolute paths for symlinks (e.g., `/mnt/newdisk/docker`, not `../docker`). If on SELinux-enabled systems (e.g., CentOS), restore context:
    ```bash
    sudo restorecon -R /mnt/newdisk/docker
    ```

- **Overlay2 Errors**
  - Cause: Overlay2 storage driver fails with symlinks, especially if the target is on a different filesystem.
  - Fix: Ensure the target filesystem supports overlay2. Alternatively, consider switching to a different storage driver (e.g., `devicemapper`) by editing `/etc/docker/daemon.json`:
    ```json
    {
      "storage-driver": "devicemapper"
    }
    ```
    Restart Docker after changing: `sudo systemctl restart docker`.[](https://github.com/docker/for-mac/issues/1396)

- **Logging Issues in Kubernetes**
  - Cause: Kubernetes expects `/var/log/containers` to symlink to `/var/lib/docker/containers`. A custom symlink may break Fluentd or other log collectors.
  - Fix: Ensure the symlink aligns with Kubernetes expectations, or mount the new location directly in your logging daemonset.[](https://github.com/kubernetes/kubernetes/issues/53022)[](https://groups.google.com/g/fluentd/c/Y-VwJJ9n-tc)

### Preferred Alternative: Change Docker’s Data Root
Instead of symlinking, update Docker’s `data-root` to avoid symlink-related issues:
1. Stop Docker:
   ```bash
   sudo systemctl stop docker
   ```
2. Copy data to the new location:
   ```bash
   sudo rsync -aP /var/lib/docker/ /mnt/newdisk/docker/
   ```
3. Edit `/etc/docker/daemon.json`:
   ```json
   {
     "data-root": "/mnt/newdisk/docker"
   }
   ```
4. Restart Docker:
   ```bash
   sudo systemctl start docker
   ```
5. Verify:
   ```bash
   docker info --format '{{.DockerRootDir}}'
   ```
This method is more robust and avoids symlink pitfalls.[](https://linuxconfig.org/how-to-move-docker-s-default-var-lib-docker-to-another-directory-on-ubuntu-debian-linux)[](https://www.digitalocean.com/community/questions/how-to-move-the-default-var-lib-docker-to-another-directory-for-docker-on-linux)

### Community Experiences
- **Stack Overflow (2020)**: A user symlinked `/var/lib/docker` to a larger disk but got an OCI runtime error. The fix was to update permissions and use absolute paths.[](https://stackoverflow.com/questions/64106179/docker-wont-run-a-container-after-creating-a-symbolic-link)
- **Docker Forums (2023)**: A user asked about symlinking only `/var/lib/docker/overlay2` to avoid bloating VM snapshots. The community suggested changing the data root instead, as partial symlinking caused errors.[](https://forums.docker.com/t/is-it-safe-to-only-symlink-var-lib-docker-overlay2-to-a-different-mounted-volume/134074)
- **Reddit (2023)**: A user moved `/var/lib/docker` and symlinked it, but one container (Portainer) failed due to a volume still referencing the old path. They fixed it by updating the container’s configuration.[](https://www.reddit.com/r/docker/comments/100xfk1/moved_varlibdocker_to_another_location_now_one/)
- **GitHub Issues**: Multiple reports confirm symlinking `/var/lib/docker` works if permissions and paths are correct, but errors arise with Kubernetes logging or outdated Docker versions.[](https://github.com/kubernetes/kubernetes/issues/53022)[](https://github.com/docker/for-mac/issues/1396)

### For `/var/lib/containerd`
Symlinking `/var/lib/containerd` is less common but follows similar principles. Containerd is stricter about paths, so:
- Ensure the target directory has identical permissions (`root:root`, `755`).
- Check containerd’s configuration (`/etc/containerd/config.toml`) and update the `root` path if needed:
  ```toml
  [grpc]
    root = "/mnt/newdisk/containerd"
  ```
- Restart containerd:
  ```bash
  sudo systemctl restart containerd
  ```

### Debugging Tips
- Check Docker logs:
  ```bash
  journalctl -u docker
  ```
- Check containerd logs:
  ```bash
  journalctl -u containerd
  ```
- Trace symlinks:
  ```bash
  namei /var/lib/docker
  ```
- Verify permissions:
  ```bash
  ls -ld /var/lib/docker /mnt/newdisk/docker
  ```

### Recommendations
- **Avoid Symlinks if Possible**: Use `data-root` for Docker or `root` for containerd to change the storage location officially.
- **Test Thoroughly**: After symlinking, test with simple containers and verify logging (especially in Kubernetes).
- **Backup Data**: Always back up `/var/lib/docker` and `/var/lib/containerd` before making changes.
- **Check Filesystem**: Ensure the target filesystem is compatible with Docker’s storage driver.

If you’re still getting specific errors, share the exact error messages, your Docker version (`docker --version`), containerd version (`containerd --version`), and the filesystem type of the target location (`df -T /mnt/newdisk/docker`). This will help pinpoint the issue.
