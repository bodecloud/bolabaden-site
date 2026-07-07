---
source_url: "https://grok.com/c/9822083e-fe55-4570-a6fc-c17059ae7f1e"
conversation_id: "9822083e-fe55-4570-a6fc-c17059ae7f1e"
title: "Fedora 44: Fix Stuck GPU Displays"
extracted_at: "2026-06-29T16:09:10.151Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Fedora 44: Fix Stuck GPU Displays

Source: [Grok conversation](https://grok.com/c/9822083e-fe55-4570-a6fc-c17059ae7f1e)

## User

_Time: 2026-05-14T13:19:47.311Z_

Research current Fedora Linux 44 guidance for fixing displays stuck on fallback/default graphics drivers on a desktop with Intel UHD 630 iGPU and AMD Radeon Baffin RX 460/560-class dGPU. Include how to ensure amdgpu/i915 drivers bind correctly, common causes when lspci lists modules but no Kernel driver in use, firmware/kernel package checks, Wayland/KDE display tooling, xrandr/kscreen caveats, multi-monitor setup for 1920x1080 at 60Hz and 144Hz, and safe sudoers.d syntax for passwordless sudo for user brunner56. Return concise actionable steps and citations.

## Assistant

_Time: 2026-05-14T13:21:18.251Z_

**Fedora 44 (released late April 2026, kernel ~6.19.x series with Plasma 6.6 on KDE spin) provides full out-of-box open-source support for Intel UHD 630 (Coffee Lake, i915 driver) and AMD Radeon Baffin/Polaris RX 460/560-class dGPU (amdgpu driver).** These are mature, in-kernel drivers—no proprietary packages or RPM Fusion needed. Displays stuck on fallback/default (e.g., llvmpipe software rendering, low resolution/refresh, or no hardware acceleration) almost always trace to one or both drivers failing to bind/load properly, even when `lspci -k` lists modules.<grok:render card_id="a19b7d" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">18</argument></grok:render>

### 1. Verify Current State (Diagnostic Commands)
Run these **as your user** (or with `sudo` where noted) to confirm the issue:

```bash
lspci -nnk | grep -E 'VGA|3D|Display' -A 3
inxi -Gxxxz
glxinfo | grep -E 'renderer|OpenGL'
lsmod | grep -E 'amdgpu|i915'
journalctl -b -p err | grep -E 'drm|gpu|amdgpu|i915|firmware'
dmesg | grep -E 'amdgpu|i915|firmware|error|failed'
```

- **Expected good output**: `Kernel driver in use: i915` (Intel) **and** `amdgpu` (AMD). Mesa renderer shows "Mesa Intel UHD Graphics 630" or "AMD Radeon Graphics".
- **Bad signs**: No "Kernel driver in use", `llvmpipe`, or firmware errors in logs.
- **Nuance**: On a desktop, monitors connected to motherboard ports use i915; GPU ports use amdgpu. Hybrid use is independent (no PRIME offload required unless you want apps to use the other GPU explicitly via `DRI_PRIME=1`).

**Common causes when modules are listed but no driver binds**:
- Missing/corrupt firmware (most frequent).
- Driver load order conflict (rare for Polaris; radeon may claim it on very old kernels).
- Initramfs missing modules or probe failure.
- BIOS settings (e.g., iGPU multi-monitor enabled, Above 4G decoding).
- Kernel update left modules-extra uninstalled.<grok:render card_id="7700a2" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

### 2. Firmware & Kernel Package Checks + Fix
Fedora 44 ships `amd-gpu-firmware` (e.g., 20260410-1.fc44) + `linux-firmware` with Polaris blobs (`polaris*.bin`).<grok:render card_id="9a9c91" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">16</argument></grok:render>

**Actionable steps**:
1. `sudo dnf update --refresh`
2. `sudo dnf install linux-firmware amd-gpu-firmware kernel-modules kernel-modules-extra`
3. `sudo dracut -f` (rebuilds initramfs)
4. Reboot and re-check `lspci -k` + `dmesg | grep firmware`.

**Edge case**: If dmesg still shows firmware load failures, manually verify files exist: `ls /lib/firmware/amdgpu/polaris*`. Reinstall fixes corruption.

### 3. Ensure amdgpu/i915 Bind Correctly
**Actionable steps** (after firmware fix):
1. Force early loading (recommended for hybrid desktops):
   ```bash
   echo 'force_drivers+=" amdgpu i915 "' | sudo tee /etc/dracut.conf.d/gpu.conf
   sudo dracut -f
   ```
2. Reboot.
3. If still unbound (rare): `sudo modprobe amdgpu` and `sudo modprobe i915`, then re-check.
4. Manual bind (advanced, if device shows but unbound):
   - Find PCI ID from `lspci -nn`, then e.g. `echo 0000:01:00.0 | sudo tee /sys/bus/pci/drivers/amdgpu/bind` (adjust ID).

**Nuance/edge case**: For Polaris Baffin, no `amdgpu.si_support` or similar params needed (those apply only to older GCN1/2). Blacklist `radeon` only if `lsmod` shows it loaded instead: `echo 'blacklist radeon' | sudo tee /etc/modprobe.d/blacklist-radeon.conf && sudo dracut -f`.<grok:render card_id="250157" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">31</argument></grok:render>

### 4. Wayland/KDE Display Tooling + Multi-Monitor Setup (1920x1080 @60Hz + @144Hz)
Fedora 44 KDE defaults to Wayland (preferred). Mixed refresh rates are supported natively in Plasma 6.6.

**Actionable steps**:
1. Log into Plasma (Wayland) session.
2. **GUI**: System Settings → Display & Monitor (kscreen backend). Select each output independently:
   - Monitor A: 1920x1080 @ 60 Hz
   - Monitor B: 1920x1080 @ 144 Hz (use DisplayPort cable for 144 Hz reliability; HDMI may cap lower).
   - Set primary, enable/disable, arrange layout.
3. **CLI alternative** (more precise):
   ```bash
   kscreen-doctor -o   # list outputs
   kscreen-doctor output.DP-1.mode.1920x1080@144   # example; adjust names
   ```
4. Test: `glxgears -info` or games should show correct FPS. Compositor VSync (System Settings → Display → Compositor) can be set to "Automatic" or "Full screen repaints" to avoid tearing on mixed rates.
5. **xrandr caveats**: Works **only** in Plasma (X11) session (deprecated in Fedora 44+). Command example: `xrandr --output DP-1 --mode 1920x1080 --rate 144`. Mixed rates are limited on X11 (single shared refresh often enforced). Avoid X11 unless Wayland fails.<grok:render card_id="484631" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">51</argument></grok:render><grok:render card_id="135e0e" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">52</argument></grok:render>

**Nuances/edge cases**:
- Different Hz can cause minor tearing or FPS halving on secondary monitor if VSync is strict—test with `vblank_mode=0` env var for benchmarks.
- If one monitor is blacked out: cable/GPU port swap or `kscreen-doctor output.<name>.disable && enable`.
- Prefer both monitors on dGPU ports for performance. To force KWin to use specific GPU: `KWIN_DRM_DEVICES="/dev/dri/by-path/pci-*-card" startplasma-wayland` (dGPU first).
- EDID/cable issues common at 144 Hz—try different cable/port.

### 5. Safe sudoers.d Syntax for Passwordless sudo (user brunner56)
**Actionable steps** (do this last, as root):
```bash
sudo visudo -f /etc/sudoers.d/brunner56
```
Paste exactly:
```
# Passwordless sudo for brunner56 (safe, specific file)
brunner56 ALL=(ALL) NOPASSWD: ALL
```
Save/exit. `visudo` validates syntax automatically.

**Security nuance**: File must be `0440 root:root` (visudo ensures this). Limits risk vs. editing main sudoers. For even safer, replace `ALL` with specific commands (e.g., `/usr/bin/dnf`). This grants full passwordless `sudo` as requested.<grok:render card_id="54329f" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">56</argument></grok:render>

**Final verification after all steps**: Reboot, re-run diagnostics, confirm hardware acceleration and correct refresh rates per monitor. If issues persist, share full `inxi -Fxxxz` + dmesg output on discussion.fedoraproject.org. This configuration is stable on F44 for this exact hardware combo.
