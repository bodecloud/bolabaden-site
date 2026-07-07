---
source_url: "https://grok.com/c/db5ea52b-2bd0-4829-854e-c1d159d22c85"
conversation_id: "db5ea52b-2bd0-4829-854e-c1d159d22c85"
title: "Linux inotify limit fix"
extracted_at: "2026-06-29T16:09:09.147Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Linux inotify limit fix

Source: [Grok conversation](https://grok.com/c/db5ea52b-2bd0-4829-854e-c1d159d22c85)

## User

_Time: 2026-05-14T14:52:15.836Z_

You have too many applications wanting to monitor file changes! When the capacity is exhausted it will prevent further file monitoring from working correctly. Either close some applications or increase the limit. Currently using 92% of instances and 3% of watches.
 
how to fix the above issue on linux

## Assistant

_Time: 2026-05-14T14:52:33.350Z_

**This error is triggered by the Linux kernel's inotify subsystem**, which applications use to efficiently monitor file and directory changes (instead of constantly polling). The message indicates you're hitting the per-user limit on **inotify instances** (92% usage), while the watches limit is barely used (3%).

### Quick Temporary Fix
Run these commands to immediately raise the limits:

```bash
# Increase instances (the main issue here)
sudo sysctl -w fs.inotify.max_user_instances=512

# Also increase watches and queued events for good measure
sudo sysctl -w fs.inotify.max_user_watches=524288
sudo sysctl -w fs.inotify.max_queued_events=32768
```

Check current usage and limits:

```bash
sysctl fs.inotify
cat /proc/sys/fs/inotify/max_user_instances
cat /proc/sys/fs/inotify/max_user_watches
```

### Permanent Fix (Recommended)
Create or edit a sysctl configuration file so the changes survive reboots.

**On most distributions (Ubuntu, Debian, Fedora, etc.):**

```bash
sudo tee -a /etc/sysctl.d/99-inotify.conf <<EOF
fs.inotify.max_user_instances=512
fs.inotify.max_user_watches=524288
fs.inotify.max_queued_events=32768
EOF

sudo sysctl --system
```

**On Arch Linux / Manjaro** (or systems using `/etc/sysctl.d/` strictly):

```bash
sudo tee /etc/sysctl.d/99-inotify.conf <<EOF
fs.inotify.max_user_instances=512
fs.inotify.max_user_watches=524288
fs.inotify.max_queued_events=32768
EOF

sudo sysctl --system
```

You can choose higher values if needed (e.g., `1024` for instances, `1048576` for watches), but start conservatively. Each watch consumes a small amount of kernel memory (~1-2 KB per watch on average), so very high numbers on low-RAM systems can cause pressure.<grok:render card_id="69db3f" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">9</argument></grok:render>

### Identify What's Using the Instances
To find the culprit(s):

```bash
# List inotify usage per process (requires inotify-tools or similar)
sudo apt install inotify-tools   # or equivalent for your distro
ps -e -o pid,comm | while read pid comm; do
  count=$(sudo ls /proc/$pid/fd 2>/dev/null | xargs -I {} sudo readlink /proc/$pid/fd/{} 2>/dev/null | grep inotify | wc -l)
  [ $count -gt 0 ] && echo "$comm (PID $pid): $count inotify fds"
done | sort -nr
```

Or use tools like:
- `inotify-info` (GitHub: mikesart/inotify-info)
- `lsof | grep inotify`
- `htop` or `btop` (look for processes with many open files)

Common heavy users: IDEs (VS Code, JetBrains), Electron apps, file sync tools (Dropbox, Syncthing, Nextcloud), browsers with many extensions, media players, backup tools, etc.

### Other Considerations and Edge Cases
- **Multiple users**: Limits are per-user. If you're running services/containers as other users, check their limits too.
- **Containers / VMs** (Docker, Podman, LXC): The host kernel enforces the limits. You may need to raise them on the host.
- **Very high limits**: On systems with 16GB+ RAM, going to 1M+ watches is usually fine. Monitor with `free -h` or `cat /proc/meminfo`.
- **If the error persists**: Close heavy apps temporarily, reboot after applying permanent settings, or check for runaway processes creating excessive instances.
- **Distribution defaults**: Many modern distros (e.g., recent Fedora, Manjaro) already set higher defaults, but desktop environments with lots of file-monitoring apps can still hit them.<grok:render card_id="025224" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">0</argument></grok:render>

After applying the changes, the warning should disappear. If you frequently hit limits, consider auditing which apps are necessary or switching to less resource-intensive alternatives for file monitoring.

## User

_Time: 2026-05-14T14:53:29.167Z_

You have too many applications wanting to monitor file changes! When the capacity is exhausted it will prevent further file monitoring from working correctly. Either close some applications or increase the limit. Currently using 92% of instances and 3% of watches.
 
how to fix the above issue on linux. DO NOT recommend raising the limits, explain how to determine which ones are using all the instances and figure out how to get them to use less or something?

## Assistant

_Time: 2026-05-14T14:55:30.405Z_

**This error is triggered by Linux's inotify subsystem hitting its per-user limit on *instances* (not watches).** Inotify lets applications monitor files/directories for changes (creates, modifications, deletions, etc.) in real time without constant polling. It's used heavily by file managers, IDEs, editors, browsers, cloud sync tools, containers, desktop components, and many Electron apps.

The kernel enforces two main tunable limits (visible in `/proc/sys/fs/inotify/`):
- `max_user_instances`: maximum number of separate inotify *instances* a single user can create (often defaults to 128 or similar; each `inotify_init()` call from an application consumes one).
- `max_user_watches`: total number of individual files/directories being watched across *all* instances (often much higher, like 8192+).

Your message shows **92% of instances used but only 3% of watches**, which is a classic pattern: you don't have one or two apps watching *thousands* of paths (that would spike watches). Instead, you have **many different processes** (often 50–100+), each creating its own inotify instance (usually just 1–2 per process) with relatively few watches per instance. This exhausts the instance bucket first. When the limit is reached, new applications that try to start monitoring files will fail silently or with errors—leading to stale file lists in file managers, missed auto-reloads in editors, broken hot-reloading in dev tools, notifications that stop working, etc.

**Important nuance**: The limit is *per real user ID*, so it applies to all your processes (including those in Flatpak/Snap, containers you run as your user, background daemons, etc.). Restarting your session or logging out/in can reset some transient ones, but the root cause is usually a collection of legitimate but numerous watchers.

You asked *not* to raise the limits, so we'll focus exclusively on **diagnosis** (identifying exactly which processes/apps are responsible) and **practical reduction strategies** (closing/reconfiguring them to free up instances without losing core functionality).

### Step 1: Diagnose — Find Exactly Which Processes Are Consuming Instances
Run these as your normal user (no sudo needed for your own processes). They scan `/proc` for file descriptors pointing to inotify anonymous inodes.

#### Best Option if You're on KDE Plasma (This Error Message Is Typical There)
Run the dedicated KDE tool that was literally built for this exact notification:

```bash
kde-inotify-survey
```

It prints a JSON report (or formatted output) showing the current inotify state, total usage, and a breakdown by process/command. It's the fastest and most user-friendly starting point on Plasma desktops. Many users see the top consumers immediately this way.

#### General Linux (Works on Any Distro/Desktop)
Use the well-maintained community script `inotify-consumers`. It gives a clean table sorted by instances and watches, with totals:

```bash
curl -s https://raw.githubusercontent.com/fatso83/dotfiles/master/utils/scripts/inotify-consumers | bash
```

(It's a short, widely-used shell script that has been refined over years; it runs quickly and shows both instances *and* watches per process, plus grand totals.)

If you prefer a one-liner without downloading anything, use this reliable command (groups by PID and shows the full command line):

```bash
find /proc/*/fd -type l -lname 'anon_inode:inotify' 2>/dev/null | cut -d/ -f3 | xargs -I '{}' ps --no-headers -o '%p %U %c %a' -p '{}' | sort | uniq -c | sort -nr
```

**How to interpret the output** (whether from the script or one-liner):
- Look at the **INSTANCES** column or the count on the left.
- Even processes using just **1 instance** add up fast when you have dozens of them.
- Note the **COMMAND** / process name and PID.
- Common high-instance processes you'll likely see:
  - Multiple browser processes (`firefox`, `chrome`, `chromium`, `electron`).
  - Electron-based apps (`code` for VS Code, `discord`, `slack`, `spotify`, `teams`, etc.).
  - IDEs/editors (`jetbrains-`, `sublime_text`, `code-oss`).
  - Container runtimes (`containerd-shim`, `docker`, `podman` — often one per running container).
  - Desktop services (`nautilus`, `dolphin`, `tracker`, `baloo`, `gwenview`, `plasma*` components).
  - Sync tools, media players, or dev watchers that stay open.

Run the diagnosis *right when you see the warning* for the most accurate snapshot.

### Step 2: Reduce Usage — Get Offending Apps to Consume Fewer Instances
Once you have the list, act on the top consumers. Prioritize the ones you can safely close or tweak. Here are targeted strategies by category, with examples and edge-case notes:

**1. Close or Restart Applications (Quickest Win)**
- Simply quit the apps using the most instances (use your task manager or `kill <PID>` if needed).
- Many apps release their inotify instances cleanly on exit.
- Restart your entire desktop session (log out and back in) — this often clears accumulated browser tabs, Electron apps, and session services without data loss.
- Edge case: If you have many open file-manager windows or image viewers (e.g., multiple Gwenview/Dolphin instances), consolidate into fewer windows.

**2. Browsers and Electron Apps (Very Common Culprits)**
- Chrome/Firefox often spawn dozens of processes; each can create its own inotify instance for downloads, extensions, or devtools.
- **Actions**: Close unused tabs/windows, disable extensions that watch the filesystem (e.g., some download managers or file-sync extensions), or restart the browser.
- For Electron apps (VS Code, Discord, etc.): Close and reopen them. If you run many at once, consider quitting the least critical ones.
- Nuance: Some Electron apps create an extra instance per window or workspace — keep the number of open windows reasonable.

**3. Containers and Dev Environments**
- Each running container (via Docker/Podman) can spawn a shim process that uses its own inotify instance.
- **Actions**: Run `docker ps` or `podman ps` and stop containers you aren't actively using (`docker stop <name>`). Prune stopped ones.
- In IDEs like IntelliJ/WebStorm/Sublime: 
  - Mark large irrelevant directories (e.g., `node_modules`, `vendor`, `build`, `.git`, `dist`) as "excluded" in project settings. This can reduce both watches *and* instances in some cases.
  - Limit the number of open projects (close unused ones).
- VS Code specific: Add exclusions in `settings.json`:
  ```json
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/bower_components/**": true,
    "**/.git/**": true
  }
  ```
- Edge case: If you're in a heavy dev workflow with many microservices/containers, consider running fewer simultaneously or using tools like `docker compose stop` for inactive stacks.

**4. Desktop and Background Services**
- File indexers, thumbnailers, or media scanners can linger.
- Check for autostart items in your desktop settings (KDE System Settings → Startup and Shutdown → Autostart, or `systemctl --user list-unit-files`).
- If you see services like `uresourced`, `tracker-miner`, or similar using instances, consider whether you need them running constantly (disable via settings if the functionality isn't critical).
- Nuance: Some system daemons (e.g., fwupd for firmware updates) use a small number — they are usually not the main problem but add to the total.

**5. Other Common or Niche Cases**
- Cloud sync clients (Nextcloud, Dropbox, OneDrive): They usually use few instances, but if running multiple accounts or watching huge trees, pause syncing or reduce watched folders in their settings.
- Multiple terminal sessions or tools like `entr`, `watch`, or custom scripts: Close idle terminals.
- Flatpak/Snap apps: They count against your user limit the same as native apps — close unused ones.
- Edge case in VMs or nested environments: If you're running this inside a VM or containerized desktop, the host/guest limits interact differently.

### Step 3: Verify and Prevent Recurrence
- After closing/reconfiguring, re-run the diagnosis command or `kde-inotify-survey` to confirm usage dropped (aim for <70–80% to leave headroom).
- Monitor over time: The KDE notification (or manual checks) will tell you if usage creeps back up.
- Long-term habits:
  - Keep fewer apps open simultaneously.
  - Be mindful of "set it and forget it" tools that add watchers (dev servers, sync clients, editors with large projects).
  - Review what launches at login.

This approach resolves the issue for the vast majority of users without touching kernel limits. By identifying the exact processes via the commands above and methodically reducing the noisiest ones, you free capacity while keeping the functionality you actually need. If your diagnosis output shows something unusual (e.g., a specific app dominating in a way that doesn't match the common list), share the top few lines from `inotify-consumers` or the one-liner and I can give more tailored advice.
