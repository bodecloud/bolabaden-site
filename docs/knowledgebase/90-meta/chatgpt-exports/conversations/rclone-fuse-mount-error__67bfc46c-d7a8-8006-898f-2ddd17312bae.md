---
source_url: "https://chatgpt.com/c/67bfc46c-d7a8-8006-898f-2ddd17312bae"
conversation_id: "67bfc46c-d7a8-8006-898f-2ddd17312bae"
title: "Rclone FUSE mount error"
extracted_at: "2026-06-29T12:23:40.009Z"
message_count: 5
provenance: auth-ui
---

# Rclone FUSE mount error

Source: [ChatGPT conversation](https://chatgpt.com/c/67bfc46c-d7a8-8006-898f-2ddd17312bae)

## Assistant

Use fuse3 with rclone, but in some cases, fuse2 may work better depending on your system and rclone version.

Which One to Use?

Newer rclone versions (since v1.57+) → Prefer fuse3.

Older systems or compatibility issues → Try fuse (fuse2) instead.

How to Force rclone to Use fuse3:
Bash
RCLONE_FUSE3=1 rclone mount ...
If You Still Have Issues:

If fuse3 doesn’t work, install and try fuse (fuse2):

Bash
sudo apt install fuse

Then rerun your mount command.

Let me know if you're still stuck! 🚀

## User

ok cool but your last instructions were for fuse, i'm using fuse3

## Assistant

Got it! Since you're using fuse3, stick with it. Here’s the best way to proceed:

1. Ensure fuse3 is Installed
Bash
sudo apt install fuse3
2. Check if the fuse3 Module is Loaded
Bash
lsmod | grep fuse

If it's not loaded, manually load it:

Bash
sudo modprobe fuse
3. Verify the FUSE Device Exists
Bash
ls -l /dev/fuse

If it doesn't exist, try:

Bash
sudo mknod -m 666 /dev/fuse c 10 229
4. Ensure rclone Uses fuse3

Run rclone with:

Bash
RCLONE_FUSE3=1 rclone mount ...
5. Restart and Try Again

If it still doesn’t work, try rebooting:

Bash
sudo reboot

This should ensure rclone uses fuse3 properly. Let me know if you're still seeing errors! 🚀

## User

sudo modprobe fuse or sudo modprobe fuse3?

## Assistant

Use sudo modprobe fuse, not fuse3.

Even though you're using fuse3, the kernel module is still called fuse. The package fuse3 provides the user-space tools, but the kernel module remains the same.

Correct Command:
Bash
sudo modprobe fuse

Trying sudo modprobe fuse3 will likely result in:

modprobe: FATAL: Module fuse3 not found in directory /lib/modules/...

Let me know if you need more help! 🚀
