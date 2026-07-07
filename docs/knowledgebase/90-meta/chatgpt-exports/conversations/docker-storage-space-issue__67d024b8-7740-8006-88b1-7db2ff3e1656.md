---
source_url: "https://chatgpt.com/c/67d024b8-7740-8006-88b1-7db2ff3e1656"
conversation_id: "67d024b8-7740-8006-88b1-7db2ff3e1656"
title: "Docker storage space issue"
extracted_at: "2026-06-29T12:05:38.637Z"
message_count: 5
provenance: auth-ui
---

# Docker storage space issue

Source: [ChatGPT conversation](https://chatgpt.com/c/67d024b8-7740-8006-88b1-7db2ff3e1656)

## Assistant

Let's simplify the process.

You want to partition your disk and set it up with LVM. Here’s the step-by-step breakdown:

Step 1: Partition the Disk

You're trying to create a new partition (4) on /dev/sda. You attempted to set it as 8e, but that didn't work. We’ll use Linux LVM type for this partition.

Open the partition tool:

Bash
sudo fdisk /dev/sda

Create a new partition (4):

Press n to create a new partition.

Choose the partition number (just press Enter to accept 4).

Choose the first sector (press Enter to accept the default).

Set the last sector or size (press Enter to accept the default).

Change the partition type:

Press t to change the partition type.

Choose partition 4 by typing 4.

Type 8e for Linux LVM (not 8, but 8e).

Write changes:

Press w to write the changes to the disk.

Step 2: Create a Physical Volume (PV)

Convert the new partition into a physical volume:

Bash
sudo pvcreate /dev/sda4
Step 3: Extend the Volume Group (VG)

Add the new physical volume to your existing volume group (VG):

Bash
sudo vgextend ocivolume /dev/sda4
Step 4: Create Logical Volume (LV) or Extend Existing LV

If you want to create a new logical volume, you can do:

Bash
sudo lvcreate -L [size] -n [lvname] ocivolume

If you want to extend an existing logical volume (e.g., root), you can do:

Bash
sudo lvextend -l +100%FREE /dev/ocivolume/root
Step 5: Resize the Filesystem

After extending the logical volume, resize the filesystem:

Bash
sudo resize2fs /dev/ocivolume/root

This should set up your partition as LVM and allow you to extend or create new volumes.

## User

[opc@bolabaden my-media-stack]$ sudo fdisk /dev/sda

Welcome to fdisk (util-linux 2.37.4).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

GPT PMBR size mismatch (97727283 != 20971519999) will be corrected by write.
The backup GPT table is not on the end of the device. This problem will be corrected by write.
This disk is currently in use - repartitioning is probably a bad idea.
It's recommended to umount all file systems, and swapoff all swap
partitions on this disk.


Command (m for help): n
Partition number (4-128, default 4): 
First sector (97726464-20971519966, default 97726464): 
Last sector, +/-sectors or +/-size{K,M,G,T,P} (97726464-20971519966, default 20971519966): 

Created a new partition 4 of type 'Linux filesystem' and of size 9.7 TiB.

Command (m for help): 8e
8: unknown command

Command (m for help):


I did everything you said. Fuck your 'step 2' i said 'be concise'.

telling me to type '8e' is useless. there is no 8e option in this specific prompt. THIS SPECIFIC prompt should be literally the entire content of your response. Literally don't mention anything else or any other steps.

Show more

## Assistant

Bash
Command (m for help): t
Partition number (1-4): 4
Hex code (type L to list all codes): 8e

## User

you broke everything:

Welcome to fdisk (util-linux 2.37.4).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

GPT PMBR size mismatch (97727283 != 20971519999) will be corrected by write.
The backup GPT table is not on the end of the device. This problem will be corrected by write.
This disk is currently in use - repartitioning is probably a bad idea.
It's recommended to umount all file systems, and swapoff all swap
partitions on this disk.


Command (m for help): 


Command (m for help): 
Show more

## Assistant

Bash
Command (m for help): q
