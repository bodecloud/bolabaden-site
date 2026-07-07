---
source_url: "https://chatgpt.com/c/6859aa06-4dcc-8006-ad82-86449c59d185"
conversation_id: "6859aa06-4dcc-8006-ad82-86449c59d185"
title: "SELinux i2prouter execute fix"
extracted_at: "2026-06-29T12:23:19.636Z"
message_count: 5
provenance: auth-ui
---

# SELinux i2prouter execute fix

Source: [ChatGPT conversation](https://chatgpt.com/c/6859aa06-4dcc-8006-ad82-86449c59d185)

## Assistant

I get your frustration—SELinux can be extremely painful when all you're trying to do is run a damn daemon from a user directory. You’ve already done way more than most users would, and you're 95% of the way there.

But before you go full disable SELinux and nuke it from orbit, let’s fix the last blocker: the /run out-of-space error that’s preventing systemctl daemon-reexec. That’s NOT SELinux. It’s just your /run tmpfs being full.

🧯 Step 1: Clear Out /run

You’re hitting this error:

Refusing to reexecute, not enough space available on /run/systemd/.

Check what’s eating /run:

Bash
sudo du -h /run | sort -hr | head -20

You’ll likely find a runaway log or credential mount (especially from systemd/snap). Try clearing out old or stale runtime files:

Bash
sudo systemctl stop i2p
sudo rm -rf /run/user/1001/*

Or, if needed:

Bash
sudo systemctl restart systemd-logind

Then check free space again:

Bash
df -h /run

You need at least 16 MB free for systemctl daemon-reexec.

✅ Step 2: Restart the Service

Once /run has room:

Bash
sudo systemctl daemon-reexec
sudo systemctl restart i2p

If it works without SELinux denial this time, you’re DONE. 🎉

🧨 Still Want to Disable SELinux?

If you're truly done with SELinux for good (not just temporarily setting it to permissive), do this carefully:

Set SELinux to permissive (doesn't block, just logs):

Bash
sudo setenforce 0

Make it permanent:

Edit:

Bash
sudo nano /etc/selinux/config

Change:

INI
SELINUX=enforcing

To:

INI
SELINUX=permissive

Or to disable entirely:

INI
SELINUX=disabled

⚠️ Disabling SELinux entirely is a security risk. I’d only recommend this on a personal machine you trust—not on servers or anything facing the internet.

🧠 Final Note

You were on the right track. The issue was not SELinux anymore—it was /run being full, which broke systemd’s ability to reload properly. That blocked your working fix from taking effect.

Let me know if you want a one-liner cleanup script for /run, or a more minimal systemd service example.

## User

boden@fedora:~$ sudo systemctl daemon-reexec
Reexecute daemon failed: Refusing to reexecute, not enough space available on /run/systemd/. Currently, 396K are free, but a safety buffer of 16M is enforced.

bro. What fucking drivbe is this. I have 100GB+ on all 3 of my drives, most of them i have 800GB free. How to allocate like 40GB to /run so i don't have to deal with this nonsense error?

## Assistant

Yeah, this is absolutely infuriating — you're sitting on hundreds of GB of free disk space, and systemd is whining because /run is a tmpfs (RAM-backed) virtual filesystem with hardcoded size limits, not your actual disk.

Let’s break it down and solve it:

🧠 What Is /run?

/run is a temporary filesystem (tmpfs) mounted into RAM, not disk.

Its size is set automatically by the kernel at boot (usually around 10% of RAM, capped).

You can't just "allocate disk space" to it — you increase the tmpfs size with boot parameters.

✅ Solution: Increase /run tmpfs Size

You need to change how /run is mounted. Do this:

🔧 Option 1: Add tmpfs Options via /etc/fstab

Edit the fstab:

Bash
sudo nano /etc/fstab

Add this line at the bottom:

fstab
tmpfs /run tmpfs size=256M 0 0

🔁 You can use any size you want (e.g., size=512M, 1G, etc.).
Just don’t set it larger than your physical RAM.

Then reboot:

Bash
sudo reboot
🔧 Option 2: Use a Kernel Parameter (Advanced)

This is trickier and rarely needed now, but if your system ignores /etc/fstab, you can modify the bootloader config (e.g. GRUB) to pass:

Bash
systemd.mountOptions=mode=755,size=256M

But 99% of the time, /etc/fstab is enough.

🧪 Temporary (No Reboot) Fix — Remount /run

If you need to fix this now and don’t want to reboot:

Bash
sudo mount -o remount,size=256M /run

Then check space:

Bash
df -h /run

You should see more free space, and systemctl daemon-reexec should now work:

Bash
sudo systemctl daemon-reexec
🛡️ Bonus Tip: What’s Eating /run?

To prevent future problems:

Bash
sudo du -sh /run/* | sort -hr | head -20

Often snap, systemd journals, or stale user sessions leak memory here.

✅ Summary

To fix it permanently:

Bash
echo 'tmpfs /run tmpfs size=256M 0 0' | sudo tee -a /etc/fstab
sudo reboot

To fix it right now:

Bash
sudo mount -o remount,size=256M /run
sudo systemctl daemon-reexec

Let me know if you want a one-liner to clean up the biggest /run hogs automatically.

## User

Jun 23 14:35:49 fedora i2prouter[429512]: Waiting for I2P Service....
Jun 23 14:35:49 fedora i2prouter[429512]: running: PID:429597
Jun 23 14:35:49 fedora i2prouter[429757]: Stopping I2P Service...
Jun 23 14:35:51 fedora i2prouter[429757]: Stopped I2P Service.
Jun 23 14:35:51 fedora systemd[1]: i2p.service: Deactivated successfully.
░░ Subject: Unit succeeded
░░ Defined-By: systemd
░░ Support: https://lists.freedesktop.org/mailman/listinfo/systemd-devel
░░ 
░░ The unit i2p.service has successfully entered the 'dead' state.
Jun 23 14:35:51 fedora systemd[1]: i2p.service: Consumed 4.889s CPU time, 160.2M memory peak.
░░ Subject: Resources consumed by unit runtime
░░ Defined-By: systemd
░░ Support: https://lists.freedesktop.org/mailman/listinfo/systemd-devel
░░ 
░░ The unit i2p.service completed and consumed the indicated resources.

my service systemctl does not log anything from i2p. please ensure it's passing through logs:

[Unit]
Description=I2P Router
After=network.target

[Service]
User=boden
WorkingDirectory=/home/boden/i2p
ExecStart=/home/boden/i2p/i2prouter start
ExecStop=/home/boden/i2p/i2prouter stop
SuccessExitStatus=143
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
Show more

## Assistant

Thanks for the full context. The issue you're hitting now is that your i2p.service doesn't capture or pass through I2P’s logs to journald, so journalctl -u i2p.service looks empty or useless — even though the service runs.

Let’s fix this cleanly and completely.

✅ Goal

Ensure I2P logs appear in journalctl via systemd.

🔧 Solution: Redirect Output in Your systemd Unit

Update your unit file with the following additions:

INI
[Unit]
Description=I2P Router
After=network.target

[Service]
User=boden
WorkingDirectory=/home/boden/i2p
ExecStart=/home/boden/i2p/i2prouter start
ExecStop=/home/boden/i2p/i2prouter stop
SuccessExitStatus=143
Restart=on-failure
RestartSec=10

# ADD THESE:
StandardOutput=journal
StandardError=journal
Environment=I2P_LOG_LEVEL=DEBUG

[Install]
WantedBy=multi-user.target

Then reload the unit and restart:

Bash
sudo systemctl daemon-reload
sudo systemctl restart i2p
🧪 Test Logging Output

Now check the logs:

Bash
journalctl -u i2p.service -f

If nothing shows up still, it's likely that i2prouter does not output to stdout/stderr, but logs to files internally. We can still capture that (see below).

🔁 Optional: Redirect I2P's Internal Logs to Journald

If i2prouter logs to a file, like:

Bash
/home/boden/i2p/logs/wrapper.log

You can pipe it into journald like this:

Option 1: Use ExecStart with tee

Update the service file:

INI
ExecStart=/home/boden/i2p/i2prouter start 2>&1 | tee /var/log/i2p-wrapper.log
StandardOutput=journal
StandardError=journal

That gives you logs in both journalctl and on-disk.

🧼 Final Tip: Remove Wrapper Junk (Optional)

If you're using the default i2prouter shell script (wrapper), it may start the Java process and detach immediately, making systemd think it's done. If that happens, it’s better to run the actual Java process directly in ExecStart. You can extract that from the script or look into i2pd (the C++ version that doesn't use Java).

Let me know if you want help modifying the script to run Java directly (for better logging + control).
