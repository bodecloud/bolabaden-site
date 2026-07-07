---
source_url: "https://grok.com/c/45d83318-7605-4d91-932a-fa344cdbff3c"
conversation_id: "45d83318-7605-4d91-932a-fa344cdbff3c"
title: "PipeWire Restart Fixes Linux Audio Devices"
extracted_at: "2026-06-29T16:08:45.870Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# PipeWire Restart Fixes Linux Audio Devices

Source: [Grok conversation](https://grok.com/c/45d83318-7605-4d91-932a-fa344cdbff3c)

## User

_Time: 2026-05-20T05:12:03.197Z_

i usually have like 5 output/input devices showing up on my linux computer fedora. But they're all gone and it says none available now. I don't want to restart, how can I fix?

## Assistant

_Time: 2026-05-20T05:12:15.322Z_

**The most common fix for this on Fedora (which uses PipeWire by default) is to restart the audio services without rebooting.** This often brings back the missing input/output devices.<grok:render card_id="eec47b" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">1</argument></grok:render>

### Step 1: Restart PipeWire services (quickest fix)
Run these commands in a terminal (no `sudo` needed, as they're user-level services):

```bash
systemctl --user restart pipewire pipewire-pulse wireplumber
```

Then check the status:

```bash
systemctl --user status pipewire pipewire-pulse wireplumber
```

- All three should show as **active (running)**.
- Open **Settings → Sound** and see if your devices (usually 5 or so) reappear.

This restarts the core audio daemon, the PulseAudio compatibility layer, and WirePlumber (the session/policy manager that detects devices).<grok:render card_id="499469" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">47</argument></grok:render>

### Step 2: Check what devices are detected
Run these to inspect the state:

```bash
# PipeWire/WirePlumber view (best for modern Fedora)
wpctl status

# PulseAudio compatibility layer
pactl list short sinks
pactl list short sources

# Low-level ALSA (hardware cards)
aplay -l          # playback devices
arecord -l        # capture devices
```

If `wpctl status` or `pactl` shows nothing but ALSA sees cards, it's a PipeWire/WirePlumber issue. If ALSA sees nothing, it's lower-level (kernel/driver).<grok:render card_id="f28d3e" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">14</argument></grok:render>

### Step 3: If restart doesn't work — clear cached state
WirePlumber sometimes caches bad device state:

```bash
systemctl --user stop wireplumber pipewire pipewire-pulse
rm -rf ~/.local/state/wireplumber/
systemctl --user start wireplumber pipewire pipewire-pulse
```

This deletes the device database (it will rebuild). Many users report this fixes "none available" after glitches.<grok:render card_id="0171ff" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">11</argument></grok:render>

### Additional troubleshooting steps (in order)
1. **Check for conflicting services**:
   ```bash
   systemctl --user status pulseaudio  # Should NOT be running
   ```
   If it is, stop it: `systemctl --user stop pulseaudio`.

2. **Reinstall PipeWire packages** (safe, doesn't require reboot):
   ```bash
   sudo dnf reinstall pipewire pipewire-pulseaudio pipewire-utils wireplumber alsa-utils
   ```
   Then restart the services again.

3. **ALSA module reload** (if hardware isn't detected at all):
   ```bash
   sudo modprobe -r snd_hda_intel  # or your card module
   sudo modprobe snd_hda_intel
   ```

4. **Check user groups** (rare but happens):
   ```bash
   groups | grep audio
   ```
   If missing: `sudo usermod -aG audio $USER` and log out/in (or just restart services).

5. **Look at logs** for clues:
   ```bash
   journalctl --user -u pipewire -xe
   journalctl --user -u wireplumber -xe
   ```

### Nuances and edge cases
- **Bluetooth/headphones/USB devices**: These often need WirePlumber restart to re-detect. Plug/unplug after restarting services.
- **Recent updates**: PipeWire version bumps sometimes cause this (e.g., certain 0.3.x releases). Check with `pipewire --version`.
- **Multiple cards** (HDMI + internal + etc.): WirePlumber can get confused about profiles — use `pavucontrol` (install if needed: `sudo dnf install pavucontrol`) for finer control.
- **Laptop docking stations/HDMI**: Sometimes require full service restart + replug.
- If you're on KDE/XFCE instead of GNOME, the sound settings applet might behave differently but the CLI commands are the same.

Try the restart first — it fixes this for most people instantly. Let me know the output of `wpctl status` or the status commands if it persists, and we can dig deeper (e.g., specific hardware, recent updates, etc.). No reboot needed!
