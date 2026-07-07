---
source_url: "https://grok.com/c/428965a6-0006-45dc-8604-553c702b9cf1"
conversation_id: "428965a6-0006-45dc-8604-553c702b9cf1"
title: "Fedora Silverblue in WSL2 Tutorial"
extracted_at: "2026-06-29T16:37:34.221Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Fedora Silverblue in WSL2 Tutorial

Source: [Grok conversation](https://grok.com/c/428965a6-0006-45dc-8604-553c702b9cf1)

## User

_Time: 2026-04-25T20:32:18.310Z_

Fedora Silverblue in wsl2 tutorial

## Assistant

_Time: 2026-04-25T20:33:24.264Z_

**Fedora Silverblue in WSL2: A Comprehensive Tutorial (2026 Edition)**

Fedora Silverblue is an immutable, OSTree-based variant of Fedora designed for maximum stability and a container-first workflow. The base OS is read-only (updated atomically via `rpm-ostree`), applications are installed as Flatpaks or run in isolated environments like Toolbox/Distrobox, and the system emphasizes reproducibility, security, and easy rollbacks. It shines on bare-metal desktops (especially with GNOME) but is not officially supported in Windows Subsystem for Linux 2 (WSL2).

WSL2 runs a full Linux kernel in a lightweight VM, supports systemd (with configuration), GUI apps via WSLg, and seamless file sharing with Windows. However, Silverblue’s immutable design, OSTree boot process, and reliance on specific kernel/initrd behaviors do not map perfectly onto WSL2’s architecture. You can import a Silverblue root filesystem, but it won’t behave exactly like a native Silverblue install—`rpm-ostree` upgrades, layered deployments, and full desktop sessions often require heavy tweaking or simply don’t work as expected.

**Key caveats before proceeding**:
- **Not recommended for production or daily driving** unless you have a specific need (e.g., testing immutable workflows in a Windows-centric environment).
- Expect a CLI-focused experience. Full GNOME desktop integration is limited (though individual GUI apps may run via WSLg).
- OSTree/rpm-ostree functionality is partial at best due to WSL2’s lack of a traditional boot environment (no kernel command line or initrd control).<grok:render card_id="905dec" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render><grok:render card_id="d59758" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">15</argument></grok:render>
- Updates and layering may fail or require workarounds. Many users instead run standard Fedora in WSL2 and use Distrobox/Toolbox for a Silverblue-like dev environment.
- As of April 2026, Fedora provides official WSL images for standard (mutable) Fedora starting with version 42+, making that the smoother path in most cases.<grok:render card_id="110486" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">41</argument></grok:render>

This tutorial covers the viable (if imperfect) import method using the official Silverblue container image, post-setup steps, limitations, and better alternatives.

### Prerequisites
1. **Windows 10 (version 2004+)** or **Windows 11** with WSL2 enabled.
   - Open PowerShell as Administrator and run:
     ```
     wsl --install
     ```
   - Set WSL2 as default: `wsl --set-default-version 2`.
   - Restart your machine if prompted.
2. **Docker** or **Podman** installed (Podman is preferred for Fedora compatibility; Podman Desktop works on Windows, or install it inside a temporary WSL distro).
3. Administrative access and ~5–10 GB free space (Silverblue rootfs is large).
4. (Optional but recommended) Enable systemd in WSL for better compatibility:
   - Create or edit `C:\Users\<YourUser>\.wslconfig`:
     ```
     [wsl2]
     guiApplications=true
     ```
   - For the specific distro (after import), you’ll add systemd config inside it.

### Method: Import Silverblue Container Rootfs into WSL2
The most reliable approach (unchanged since the 2022 Fedora discussion and still valid in 2026) is to export the root filesystem from the official Silverblue OCI image on Quay.io and import it with `wsl --import`.<grok:render card_id="092506" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render><grok:render card_id="32a718" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">52</argument></grok:render>

#### Step 1: Pull and Export the Silverblue Rootfs
Use a machine with Podman/Docker (easiest inside a temporary Ubuntu/Fedora WSL distro or via Podman Desktop).

```bash
# Pull the latest stable Silverblue image (check https://quay.io/repository/fedora-ostree-desktops/silverblue?tab=tags for current tags; e.g., :42 or :43 in 2026)
podman pull quay.io/fedora-ostree-desktops/silverblue:42   # Replace 42 with latest

# Create a temporary container (do not start it)
podman create --name silverblue-temp quay.io/fedora-ostree-desktops/silverblue:42

# Export the rootfs to a .tar file (this can take time and use significant disk space)
podman export silverblue-temp -o C:\Temp\silverblue-rootfs.tar

# Clean up
podman rm silverblue-temp
```

**Tip**: If using Docker, replace `podman` with `docker`. For multi-arch images, ensure `linux/amd64` platform if needed (`--platform linux/amd64`).

#### Step 2: Import into WSL2 (PowerShell as Administrator)
```powershell
# Create a storage directory (adjust paths as needed)
mkdir C:\WSL\Silverblue

# Import (name can be anything; this registers it as a WSL distro)
wsl --import Silverblue C:\WSL\Silverblue C:\Temp\silverblue-rootfs.tar --version 2
```

Verify:
```powershell
wsl -l -v
```
You should see `Silverblue` listed (Version 2).

#### Step 3: First Launch and Basic Setup
```powershell
wsl -d Silverblue
```
You’ll drop into a root shell (Silverblue containers start as root).

**Immediate post-import tasks** (inside the WSL session):
```bash
# Update package metadata (use dnf initially; rpm-ostree may be limited)
dnf update -y || true

# Install sudo and basic tools if missing
dnf install -y sudo passwd util-linux

# Create a non-root user (replace 'youruser' and set a strong password)
useradd -m -G wheel youruser
passwd youruser

# Set as default user (create/edit /etc/wsl.conf)
cat > /etc/wsl.conf << EOF
[user]
default=youruser

[boot]
systemd=true   # Critical for most modern Fedora behavior
EOF

# Exit and restart the distro
exit
```

Restart:
```powershell
wsl --terminate Silverblue
wsl -d Silverblue
```
You should now be logged in as `youruser`.

**Enable WSLg GUI support** (if you want to run graphical apps):
- Ensure `guiApplications=true` in `.wslconfig` (already set).
- Install a desktop environment or apps inside (e.g., `rpm-ostree install gnome-terminal` or use Flatpak/Toolbox). Test with `xclock` or a simple Flatpak.

### Post-Installation Configuration and Usage
- **Updates**: Try `rpm-ostree upgrade`—it may work partially but often fails due to WSL filesystem constraints. Fall back to layering packages with `rpm-ostree install` (requires reboot via `wsl --shutdown`).
- **Development workflow** (Silverblue’s strength): Use `toolbox` or `distrobox`:
  ```bash
  toolbox create --image fedora:42
  toolbox enter
  ```
  Or install Distrobox and create full Debian/Fedora containers for dev tools.
- **Flatpaks**: Install `flatpak` via `rpm-ostree` and set up Flathub as usual.
- **Windows integration**:
  - Access Windows files: `/mnt/c/`
  - Share files bidirectionally.
  - Run Windows apps from Linux or vice versa.
- **Networking/Ports**: WSL2 handles this automatically; use `localhost` forwarding for dev servers.

**Edge cases**:
- **Systemd services**: Now enabled via `/etc/wsl.conf`, but some OSTree-specific units may not start.
- **Performance**: WSL2 is fast for I/O-heavy work, but immutable layering adds overhead.
- **Rollback**: Silverblue’s atomic rollbacks work if `rpm-ostree` functions, but test in a disposable distro first (`wsl --unregister Silverblue` to delete).
- **Storage growth**: WSL2 VHDX files grow dynamically; monitor with `wsl --shutdown` and resize if needed.

### Limitations and Why This Isn’t “True” Silverblue
- **OSTree boot limitations**: WSL2 doesn’t expose kernel parameters or initrd, breaking full immutable semantics.<grok:render card_id="198ae1" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>
- **Desktop experience**: No seamless GNOME session like native Silverblue; you’ll rely on WSLg for individual apps or XRDP for a full remote desktop.
- **Maintenance**: Future Fedora updates to the container image require re-exporting and re-importing (or manual layering).
- **Community consensus**: Forums note this setup “requires a lot of tweaking” and is better suited for experimentation than daily use.<grok:render card_id="f444c2" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">15</argument></grok:render>

### Recommended Alternatives (Strongly Preferred)
1. **Official Fedora WSL (Mutable) + Immutable Tools** (Best for most users):
   - `wsl --install -d FedoraLinux-43` (or latest via Microsoft Store).
   - Inside: Install `toolbox`/`distrobox` and spin up Silverblue-like containers. This gives 99% of the workflow benefits without the headaches.<grok:render card_id="907742" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">41</argument></grok:render>

2. **Run Full Silverblue in a VM**:
   - Use Hyper-V, VirtualBox, or VMware with the official Silverblue ISO (download from getfedora.org/atomic-desktops). Perfect fidelity, GPU passthrough possible.

3. **uBlue or Custom Atomic Images**:
   - Projects like Universal Blue build enhanced immutable images; some have WSL-friendly variants or can be imported similarly.

4. **GitHub Codespaces / Dev Containers**:
   - For cloud dev, use a Dev Container based on the same Silverblue image.

### Troubleshooting
- **Import fails**: Ensure the .tar is a flat rootfs (not layered). Use `--version 2`.
- **No systemd**: Double-check `/etc/wsl.conf` and restart.
- **GUI apps black screen**: Update WSL (`wsl --update`), ensure GPU drivers are current.
- **rpm-ostree errors**: Fall back to `dnf` or accept partial immutability.
- **Distros list issues**: `wsl --list --online` for official images; `wsl --unregister <name>` to reset.

This setup gives you a functional Silverblue-like environment in WSL2 for experimentation, testing container workflows, or Windows-Linux hybrid development. For a production immutable experience, consider a native install or VM. If you run into specific errors or want to extend this (e.g., custom Containerfile for a pre-configured Silverblue WSL image), provide more details and I can refine further!

## User

_Time: 2026-04-25T20:39:35.399Z_

I'm wanting a immutable distro because i want to provisionally configure my operatying system and settings gradually and test it out without dual booting (within windows) before determining if i want to swap yet.
 
that's why wsl2 would be preferable. Please find a solution, or tell me how to do it in virtualbox i guess? just literally anything that helps me demo/benchmark/test/experiment around with silverblue and **define the configuration as i go** without leaving my windows environment until i'm ready.

## Assistant

_Time: 2026-04-25T20:40:43.584Z_

**The ideal way to safely experiment with Fedora Silverblue (or a close variant) inside Windows is a full virtual machine in VirtualBox.** This gives you the *complete* immutable experience—atomic updates via `rpm-ostree`, full GNOME desktop, proper OSTree semantics, rollbacks, Flatpaks, Toolbox/Distrobox containers—while staying 100% inside your Windows environment. No dual-booting required until you're ready to commit. You can configure everything gradually, test apps/benchmarks, and revert instantly with VM snapshots.<grok:render card_id="28b27e" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">3</argument></grok:render><grok:render card_id="3dc818" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">45</argument></grok:render>

WSL2 remains a poor fit for true Silverblue testing (even in 2026). While you *can* import a Silverblue rootfs (as in the previous tutorial), it lacks kernel command-line/initrd control, full OSTree boot behavior, and seamless desktop integration. Official Fedora WSL images exist (mutable Workstation only), and community consensus confirms Silverblue-in-WSL2 requires heavy tweaking without delivering the real immutable workflow.<grok:render card_id="fdbfb0" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">1</argument></grok:render><grok:render card_id="143905" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">9</argument></grok:render><grok:render card_id="7fb939" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">14</argument></grok:render>

A VM is the gold-standard approach used by the community for exactly your scenario: provisional, low-risk experimentation before migrating.<grok:render card_id="d226bc" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">22</argument></grok:render><grok:render card_id="f80c55" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">23</argument></grok:render>

### Why This Meets Your Needs Perfectly
- **Gradual, provisional configuration**: Install packages with `rpm-ostree install`, add Flatpaks, set up desktop extensions/themes, configure dev tools in Distrobox/Toolbox. Test everything live. Reboot the VM to apply layers (just like native). If something breaks, rollback or restore a snapshot.
- **Testing & benchmarking without risk**: Run real workloads, games, dev environments, or benchmarks (Phoronix, Geekbench, etc.) in a full desktop. VM snapshots let you experiment wildly and revert in seconds.
- **Reproducibility ("define the configuration as I go")**: Document your `rpm-ostree` layers or (better) create a custom uBlue-style Containerfile later. When you're ready to go native, the config transfers almost 1:1.
- **Seamless Windows integration**: Shared folders, clipboard, drag-and-drop, dynamic resize, full-screen mode.
- **Zero impact on your Windows host**: VirtualBox runs alongside WSL2/Hyper-V with no conflicts.
- **Edge cases covered**: Performance overhead is minor for testing (enable 3D acceleration + multiple cores). Snapshots handle the immutable "read-only base" nature gracefully.

**Strong recommendation**: Use **Project Bluefin** (uBlue) instead of stock Silverblue for your testing. It's built directly on Silverblue (identical immutable core + `rpm-ostree`), but comes pre-loaded with developer-friendly tools, better defaults, and easier custom-image building. It's what many people use when they want Silverblue "with batteries included" for experimentation.<grok:render card_id="f2464f" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">36</argument></grok:render><grok:render card_id="0c2b68" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">65</argument></grok:render> If you want *strict* upstream Silverblue, that's fine too—the process is identical.

### Step-by-Step: Set Up Silverblue/Bluefin in VirtualBox (April 2026)

#### 1. Install VirtualBox (5 minutes)
- Download the latest VirtualBox from https://www.virtualbox.org/wiki/Downloads (Windows host installer).
- Install it (default options are fine). Restart if prompted.
- (Optional but recommended) Download the Extension Pack from the same page and install it via VirtualBox → File → Preferences → Extensions.

#### 2. Download the ISO
- **Stock Silverblue** (pure Fedora): Go to https://fedoraproject.org/atomic-desktops/silverblue/download/ → Grab the latest x86_64 OSTree ISO (Fedora Silverblue 43 as of now).<grok:render card_id="d455ea" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">55</argument></grok:render>
- **Bluefin (recommended)**: https://projectbluefin.io/ → Choose AMD/Intel stable ISO (or Nvidia if you have an Nvidia GPU and want accelerated graphics).<grok:render card_id="6901b9" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">65</argument></grok:render>

Verify the checksum if you're paranoid (links are on the pages).

#### 3. Create the VM (recommended settings for realistic testing)
1. Open VirtualBox → New.
2. Name: `Silverblue-Test` (or `Bluefin-Test`).
3. ISO Image: Select the downloaded ISO.
4. Type: Linux → Fedora (64-bit).
5. **Hardware**:
   - Memory: 8 GB (or more if you have 32+ GB RAM).
   - Processors: 4–6 CPUs.
   - Enable EFI (important for modern Fedora).
   - Video: 128 MB VRAM + enable 3D Acceleration.
   - Storage: Create a virtual hard disk → VDI → Dynamically allocated → 60 GB+ (you can expand later).
6. **Network**: NAT (default) or Bridged if you need full LAN access.
7. **Shared Folders** (for Windows ↔ VM file exchange): In Settings → Shared Folders → Add your desired Windows folders (e.g., `C:\Projects` as `/mnt/shared` with Auto-mount + Make Permanent).
8. Start the VM and let it boot the live environment.

#### 4. Install the OS (10–15 minutes)
- In the live desktop, click **Install to Hard Drive**.
- Follow the Anaconda installer (very similar to regular Fedora):
  - Language/keyboard.
  - Installation Destination: Automatic partitioning (it uses Btrfs subvolumes—perfect for immutable).
  - Root password + create your user (enable admin).
- Installation is atomic; reboot when done.
- Eject the ISO in VirtualBox (Devices → Optical Drives) before rebooting the VM.

#### 5. First Boot & Post-Install Setup (Essential for Seamless Experience)
Boot into your new immutable system.

**Enable Guest Additions** (for resize, shared folders, clipboard, better graphics):
```bash
# Inside the VM terminal (as your user, with sudo)
sudo rpm-ostree install virtualbox-guest-additions --allow-inactive
sudo systemctl reboot
```
After reboot, shared folders appear under `/media/sf_*` or as configured. Dynamic resize and clipboard just work.<grok:render card_id="38a0ec" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">75</argument></grok:render><grok:render card_id="ae63b3" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">76</argument></grok:render>

**Basic first-run commands** (Silverblue/Bluefin style):
```bash
# Update the base image (atomic)
rpm-ostree upgrade

# Example: Layer some common tools (reboot after)
rpm-ostree install fish neovim distrobox flatpak

# Flatpaks (preferred for apps)
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install flathub org.mozilla.firefox com.visualstudio.code

# Reboot to apply layers
reboot
```

**Development workflow** (your "define config as I go"):
- Use **Distrobox** or **Toolbox** for mutable containers: `distrobox create --image fedora:43` then `distrobox enter`.
- Install dev tools, run servers, etc., inside containers—none of it touches the immutable base.
- Test GUI apps via the full desktop (or individual ones via WSLg-style if you prefer, but unnecessary here).
- Customize GNOME (extensions, themes) and test thoroughly.

#### 6. Safe Experimentation with Snapshots (Your Safety Net)
This is where the magic happens for provisional testing:
1. In VirtualBox, select your VM → Snapshots tab (right pane).
2. **Take** a snapshot named "Clean base install" (can do while running).
3. Make changes (`rpm-ostree install`, Flatpak experiments, config tweaks).
4. Test/benchmark.
5. If it breaks → Snapshots → Restore the previous one (instant rollback to exact state).
6. Or use Silverblue's built-in `rpm-ostree rollback` for OS-level only.

Best practice: Snapshot before every major change (new layers, major updates, kernel experiments). Snapshots are lightweight and chainable.<grok:render card_id="b857cf" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">87</argument></grok:render><grok:render card_id="dc9f93" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">94</argument></grok:render>

#### 7. Performance & Benchmarking Tips
- Enable hardware acceleration in VM Settings → Display.
- For GPU-heavy tests: Pass through your GPU if needed (advanced; works better on Bluefin Nvidia ISO).
- Run benchmarks inside the VM—they'll be realistic enough to decide if Silverblue fits your workflow.
- Monitor with `htop`, `gnome-system-monitor`, or `podman stats` in containers.

#### 8. When You're Ready to Switch to Bare Metal
- Document your layers: `rpm-ostree status` and `flatpak list`.
- (Advanced) Build a custom uBlue image from a Containerfile that includes *exactly* your config—then flash that ISO natively.
- Dual-boot setup becomes trivial once you've tested everything.

### Alternatives & Nuances
- **If you want zero VM overhead**: Stick with the WSL2 import method from before + Distrobox running a Silverblue image inside mutable Fedora WSL. It's faster for CLI-only testing but loses the full desktop/immutable-host feel.
- **Hyper-V instead of VirtualBox**: Possible (Windows Pro+), but VirtualBox is simpler and has better snapshot UX for this.
- **Edge cases**: Nvidia users → use Bluefin Nvidia ISO. ARM Windows hosts → limited (use UTM instead of VirtualBox). Storage growth → dynamic VDI handles it.

This setup lets you live in Silverblue/Bluefin *today* inside Windows, iterate your configuration safely, and only commit to native install (or dual-boot) when you're confident. It's exactly how many people transition to immutable distros.

If you hit any specific snag (e.g., Guest Additions, a particular benchmark, or custom layering), paste the error/output and I'll give precise fixes. You can also start with Bluefin—it's more polished for daily experimentation. Ready to begin?

## User

_Time: 2026-04-25T20:43:40.483Z_

I'm wanting a immutable distro because i want to provisionally configure my operatying system and settings gradually and test it out without dual booting (within windows) before determining if i want to swap yet.
 
that's why wsl2 would be preferable. Please find a solution, or tell me how to do it in virtualbox i guess? just literally anything that helps me demo/benchmark/test/experiment around with silverblue and **define the configuration as i go** without leaving my windows environment until i'm ready.

obviously we require systemd and kde plasma fully functional in WSL2 silverblue.

https://discussion.fedoraproject.org/t/using-fedora-silverblue-on-github-codespaces-and-wsl-2/44190/3

search the web deepl.y to find an existing ghuudie on wsl2 + silverblue + kde plasma (or desktop environment) fully functional.

## Assistant

_Time: 2026-04-25T20:44:30.887Z_

**No fully functional Fedora Silverblue (or Kinoite) + WSL2 + KDE Plasma setup exists — and it’s unlikely to work well even with heavy tweaking.**

I searched deeply across web results, Reddit, Fedora forums, GitHub discussions, YouTube (2024–2026 content), and related threads. The only direct discussion is the exact 2022 Fedora forum thread you linked. The top reply there explicitly warns:

> “While you can probably manage to get a Silverblue rootfs running inside WSL-2, it’s not going to be the same experience and would require a lot of tweaking.”

No newer guides (2024–2026) have appeared for Silverblue/Kinoite in WSL2 with a working full desktop environment, proper systemd, or OSTree/rpm-ostree functionality. All “KDE Plasma on WSL2” tutorials are for **mutable** distros (standard Fedora, Ubuntu, etc.) using X410, VcXsrv, XRDP, or WSLg + lightdm. These do **not** translate to an immutable OSTree base.

### Why It Doesn’t Work Well in WSL2
- OSTree (the core of Silverblue/Kinoite) expects a real bootloader, initrd, and kernel command-line parameters that WSL2’s lightweight VM does not provide.
- Full KDE Plasma needs a display manager (SDDM or the newer Plasma Login Manager), session management, and proper Wayland/X11 handling. WSLg is designed for individual GUI apps, not a complete desktop session.
- `rpm-ostree` layering, rebasing, and atomic updates become unreliable or broken.
- Systemd can be forced on (`/etc/wsl.conf` with `systemd=true`), but the immutable contract is lost.

**Bottom line**: You would end up with a broken or heavily compromised “immutable” experience that defeats the purpose of testing Silverblue-style configuration safely.

### The Practical, Fully Functional Solution: VirtualBox + Fedora Kinoite
**Fedora Kinoite** is exactly what you want — it is the official KDE Plasma version of Silverblue (same immutable OSTree base, rpm-ostree, Flatpaks, Toolbox/Distrobox, atomic updates, and rollbacks). It ships with a complete, pre-configured Plasma 6 desktop.

This gives you **everything you asked for**:
- Full systemd + working KDE Plasma 6
- True immutable experience (define configuration gradually, test safely, rollback instantly)
- No dual-boot risk — everything runs inside Windows as a normal application
- Excellent for “provisionally configure… test it out… define the configuration as I go”

**Why this matches your workflow perfectly**:
- Take a VirtualBox snapshot before any change.
- Experiment with Plasma settings, widgets, themes, layering packages (`rpm-ostree install`), Flatpaks, Distrobox containers, scripts, etc.
- If something breaks or you don’t like it → restore snapshot in 10 seconds or run `rpm-ostree rollback`.
- Document your successful layers/configs → later apply the exact same steps on bare metal when you’re ready to commit.
- Shared folders, clipboard, drag-and-drop, and USB passthrough make it feel native.

#### Step-by-Step: Set Up Fedora Kinoite in VirtualBox

1. **Download the latest Kinoite ISO**
   - Go to: https://fedoraproject.org/atomic-desktops/kinoite/download/
   - Grab the current x86_64 OSTree ISO (e.g., Fedora-Kinoite-ostree-x86_64-43-…iso or whatever the latest stable is in 2026).

2. **Create the Virtual Machine (VirtualBox)**
   - New → Name: `Kinoite-Test`, Type: Linux, Version: Fedora (64-bit)
   - Base Memory: **6144 MB** (6 GB) minimum, **8192 MB** (8 GB) recommended
   - Processors: **2–4** vCPUs
   - Hard Disk: **Create a virtual hard disk now** → VDI, Dynamically allocated, **60 GB+**
   - Settings → System → Enable EFI (important for modern Fedora)
   - Settings → Display → Graphics Controller: **VBoxSVGA** or **VMSVGA**, Enable 3D Acceleration, Video Memory 128 MB
   - Settings → Storage → Attach the Kinoite ISO to the optical drive
   - (Optional but recommended) Settings → USB → Enable USB 3.0 Controller + add any devices you want to passthrough later

3. **Install Kinoite**
   - Start the VM and boot from the ISO.
   - Use the standard Fedora Anaconda installer.
   - Choose **Automatic** partitioning (or custom if you want to experiment with Btrfs subvolumes — Kinoite defaults to Btrfs).
   - Set your username/password, enable “Make this user administrator”.
   - Finish installation, reboot, and remove the ISO from the virtual drive.

4. **Post-Install Essentials (for experimentation)**
   ```bash
   # Update the system (atomic)
   rpm-ostree upgrade
   sudo systemctl reboot

   # Enable RPM Fusion (layered — survives updates)
   sudo rpm-ostree install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm

   # Install VirtualBox Guest Additions (for better graphics, shared folders, seamless mode)
   sudo rpm-ostree install virtualbox-guest-additions
   sudo systemctl reboot
   ```

5. **How to “Define Configuration as You Go” (Your Core Workflow)**
   - **Before any big change** → In VirtualBox menu: Machine → Take Snapshot (name it e.g. “Clean Plasma 6.6 + basic setup”).
   - Experiment with Plasma (widgets, themes, panels, shortcuts, Discover/Flatpaks).
   - Layer system packages safely:
     ```bash
     rpm-ostree install neovim htop podman-compose   # example
     sudo systemctl reboot
     ```
   - Test apps, Distrobox containers (`distrobox create --image fedora:42`), Flatpaks, scripts, etc.
   - If you hate the result: VirtualBox → restore previous snapshot **or** inside the VM:
     ```bash
     rpm-ostree rollback
     sudo systemctl reboot
     ```
   - When happy with a configuration, note the exact `rpm-ostree install` commands + any `/etc` tweaks or Flatpak list. This becomes your “provisioning script” for the real install later.

**Pro tips for this workflow**:
- Use `rpm-ostree status` and `rpm-ostree db list` to see exactly what’s layered.
- Keep a text file on the Windows host (shared folder) with your growing configuration notes.
- For even faster iteration: Script everything with a small Ansible playbook or shell script that you run after each fresh snapshot.

### Performance & Integration Notes
- With Guest Additions + 3D acceleration you get very good Plasma performance (far better than most people expect from a VM).
- Enable “Seamless Mode” (Host + L) to run Plasma windows directly on your Windows desktop.
- Shared folders: Settings → Shared Folders → add a folder, then inside Kinoite mount it or use the automount feature.

### If You Still Want to Try WSL2 (Not Recommended)
You can import the Silverblue/Kinoite rootfs exactly as described in the 2022 thread you linked (`podman export` → `wsl --import`), enable systemd, create a user, and try layering a minimal desktop or running XRDP + Plasma. But expect:
- Broken or partial `rpm-ostree` behavior
- No proper display manager/session
- Frequent breakage on updates

It will not give you the clean “immutable desktop” experience you’re looking for. Most people who try this quickly move to a VM or bare metal.

### Final Recommendation
**Start with VirtualBox + Kinoite today.** It is the only setup that gives you a **real, fully functional, immutable KDE Plasma environment** where you can safely experiment for weeks or months without any risk to your Windows system or data. When you’re 100% happy with the configuration you’ve built, the transition to bare-metal dual-boot (or full replacement) becomes trivial — you already know exactly what packages to layer and what Flatpaks/settings to apply.

Would you like me to give you:
- A ready-made “first-week configuration script” for Kinoite (common dev tools, nice Plasma tweaks, Distrobox setup, etc.)?
- Exact VirtualBox .vbox appliance settings optimized for this use case?
- Or help scripting the snapshot + rollback workflow?

Just say the word and I’ll provide the exact commands/files. You’ve picked the right mindset — immutable + safe experimentation is fantastic, and Kinoite in a VM is the perfect sandbox for it while you stay in Windows.
