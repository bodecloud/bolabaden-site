---
source_url: "https://www.perplexity.ai/search/6dfbab37-d11d-4059-a6a1-bef9c2be2d38"
thread_uuid: "716320aa-5e84-4de3-94bb-95282e3baa8c"
slug: "6dfbab37-d11d-4059-a6a1-bef9c2be2d38"
title: "if I have a SMALL wsl2 distro installed, and a full blown linux distro installed next to windows 10/11. Two partitions, two operating systems, and windows has a vhdx representing a small wsl2 distro. Can the wsl2 distro ACCESS the ext4 partition and safely read/write to/from it?"
extracted_at: "2026-06-29T16:31:01.003Z"
matched_keywords: []
export_suite: "identity"
entry_count: 2
provenance: perplexity-rest-api
---

# if I have a SMALL wsl2 distro installed, and a full blown linux distro installed next to windows 10/11. Two partitions, two operating systems, and windows has a vhdx representing a small wsl2 distro. Can the wsl2 distro ACCESS the ext4 partition and safely read/write to/from it?

Source: [Perplexity thread](https://www.perplexity.ai/search/6dfbab37-d11d-4059-a6a1-bef9c2be2d38)

## User

if I have a SMALL wsl2 distro installed, and a full blown linux distro installed next to windows 10/11. Two partitions, two operating systems, and windows has a vhdx representing a small wsl2 distro. Can the wsl2 distro ACCESS the ext4 partition and safely read/write to/from it?

## Assistant

Yes, it is possible for a WSL2 distro to access and read/write to an ext4 partition on Windows 10/11, but there are some steps and considerations involved:

1. **Mounting the ext4 Partition in WSL2**:
   - **For Windows 11**: You can directly use the `wsl --mount` command to attach and mount an ext4 disk within WSL2. This feature was introduced in Insider build 20211 and has since been integrated into stable Windows 11 releases. Here's how you can do it:
     - Open PowerShell with administrative privileges.
     - Run `wsl --mount <DiskPath>` to mount the disk. For example, `wsl --mount \\.\PHYSICALDRIVE3`.
     - You can specify a partition by adding `--partition <PartitionNumber>`.
     - To specify a different filesystem, you can add `-t <filesystem_type>`, e.g., `-t vfat`.

   - **For Windows 10**: This feature was initially introduced in Windows Insider builds but has not been widely rolled out to all Windows 10 versions. Users have reported that updating WSL itself can help:
     - Run `wsl --update` to ensure you have the latest version of WSL, which might include the `wsl --mount` command. However, if your Windows 10 version does not support this command, you might need to look into other tools or wait for an update.

2. **Accessing the Mounted Partition**:
   - Once the ext4 partition is mounted, you can access it within the Linux environment under `/mnt/wsl` or `/mnt` depending on how it was mounted. This allows for read and write access from WSL2.

3. **Limitations and Considerations**:
   - **Entire Disk Mounting**: When mounting in WSL2, the whole disk is attached, not just a single partition. This means that while you can mount specific partitions, the disk itself is not available to other applications outside of WSL2 while mounted.
   - **Persistence**: Mounts are not persistent across reboots. You would need to either manually remount or set up an `fstab` entry in WSL2 to automatically mount the drive upon startup. This requires root access in WSL2.

4. **Alternative Tools**: If direct mounting in WSL2 is not feasible:
   - **MiniTool Partition Wizard**: This tool allows for formatting partitions to ext4, but it's primarily a partition management tool rather than a mounting solution.
   - **Ext2Fsd**: Although it's been less maintained since 2017, it can still be used to mount ext4 partitions in Windows. However, its interface might be outdated.
   - **DiskInternals Linux Reader**: A free tool to read Linux filesystems from Windows, including ext4.

5. **Safety and Compatibility**:
   - Ensure that the ext4 partition is not in use by another operating system or application when mounting it in WSL2.
   - Always backup important data before attempting to mount and access Linux partitions from Windows to avoid any potential data loss.

In summary, with the right version of Windows or WSL, and by following the outlined steps, you can safely access and read/write to an ext4 partition from WSL2. However, for Windows 10 users without the `wsl --mount` command, alternative tools might be necessary, or you might need to wait for a feature update to Windows 10.

### Sources

- [EXT4 Windows: Mount EXT4 File System in WSL2](https://www.partitionwizard.com/partitionmagic/ext4-windows.html)
  - Do you want to mount EXT4 Windows? This post from MiniTool Partition Wizard shows you how to mount the EXT4 partition in WSL2. It also introduces other tools to manage EXT4 partitions on Windows. EXT4 (fourth extended filesystem) is a log file system under the Linux system. Windows can’t recognize the EXT4 partition and can’t access data in it. In Windows, the only thing you can do with an EXT4 partition is to delete it. The following picture shows the status of an EXT4 partition in Windows...
- [Windows 10 now lets you mount Linux ext4 filesystems in WSL 2](https://www.bleepingcomputer.com/news/microsoft/windows-10-now-lets-you-mount-linux-ext4-filesystems-in-wsl-2/)
  - September 10, 2020 02:12 PM 4 Windows 10 now allows you to mount physical disks formatted using the Linux ext4 filesystem in the Windows Subsystem for Linux 2. Linux filesystems, such as ext4, cannot be natively accessed in Windows 10 without installing special drivers. Starting with Windows 10 preview build 20211, WSL 2 now includes a wsl --mount command that lets you mount ext4 and other Linux kernel supported filesystems, directly in installed WSL distributions. This feature is especially...
- [WSL2 can now mount Linux ext4 disks directly - Scott Hanselman](https://www.hanselman.com/blog/wsl2-can-now-mount-linux-ext4-disks-directly)
  - If you're on a version of Windows 11 that is build 22000 or greater, you can now use WSL to mount Linux disks directly. Run winver to see your Windows version. I'm on 22000.282 as of the time of this writing. I can also run wsl --help and see the --mount instructions. If you don't have them, you're not on the latest, or you can try installing/update WSL from the Windows Store. Installing WSL from the Windows Store gets you updates faster. --mount <Disk> Attaches and mounts a physical disk in...
- [WSL2 mount ext4 on Windows 10 - Reddit](https://www.reddit.com/r/wsl2/comments/12chsty/wsl2_mount_ext4_on_windows_10/)
  - I would like to be able to read and write on EXT4 volumes in Windows 10. So far only paid applications can do this which is a bummer. After some googling, found that WSL2 can mount ext4 for read/write. Then was met with another roadblock, WSL2 for Windows 10 does not have this mount command. But a few sites does say it does but maybe using the Windows Insider version 20211. Is there a way to update the WSL2 in Windows 10 to have this mount function? This WSL2 mount is already available in 2020...
- [Access Linux filesystems in Windows and WSL 2](https://devblogs.microsoft.com/commandline/access-linux-filesystems-in-windows-and-wsl-2/)
  - Starting with Windows Insiders preview build 20211, WSL 2 will be offering a new feature: wsl --mount. This new parameter allows a physical disk to be attached and mounted inside WSL 2, which enables you to access filesystems that aren’t natively supported by Windows (such as ext4). So, if you’re dual booting with Windows & Linux using different disks, you can now access your Linux files from Windows!... ## Getting started To mount a disk, open a PowerShell window with administrator privileges...

## User

How do I mount an EXT4 partition in WSL2

## Assistant

To mount an EXT4 partition in WSL2:

1. **Ensure You Have the Correct Windows Version**: For Windows 11, you need build 22000 or greater. For Windows 10, you need preview build 20211 or a newer version that supports the `wsl --mount` command. 
   - Run `winver` to check your Windows version. If your version is lower than required, you might need to update your WSL version through the Windows Store or wait for an update to your Windows version.

2. **Open PowerShell with Administrative Privileges**: You need admin rights to mount a disk.

3. **List Available Disks**: Run the following PowerShell command to see a list of available disks:

   ```powershell
   wmic diskdrive list brief
   ```

4. **Mount the Disk**:
   - If you want to mount the entire disk (assuming it has a single partition or you don't specify a partition), use the `wsl --mount` command like this:

     ```powershell
     wsl --mount \\.\PHYSICALDRIVE0
     ```

   - To mount a specific partition, you add the `--partition` parameter:

     ```powershell
     wsl --mount \\.\PHYSICALDRIVE0 --partition 1
     ```

   - By default, WSL2 attempts to mount the disk as ext4. If you want to use another filesystem, you can specify it with the `-t` option:

     ```powershell
     wsl --mount \\.\PHYSICALDRIVE0 -p 1 -t vfat
     ```

5. **Access the Mounted Partition**: Once mounted, you can access it in your Linux distribution under `/wsl/` or `/mnt/wsl/` depending on your setup. Navigate to the mountpoint in File Explorer or in your Linux environment.

6. **Unmount the Disk**: When you are done, you can unmount the disk using:

   ```powershell
   wsl --unmount \\.\PHYSICALDRIVE0
   ```

**Notes**:
- The entire disk is mounted, not just a single partition. This means that while you can specify a partition to mount, the whole disk becomes unavailable for other applications while mounted in WSL2.
- Mounts are not persistent across reboots. You'll need to manually remount or set up an `fstab` entry in WSL2 to automate the process upon startup.
- Always ensure the disk is not in use by another operating system or application while attempting to mount it in WSL2. 
- External USB drives, internal drives, and VHDs work with this feature, but SD Cards and Flash Drives might not be supported as of the most recent updates.[3]

### Sources

- [Windows 10 now lets you mount Linux ext4 filesystems in WSL 2](https://www.bleepingcomputer.com/news/microsoft/windows-10-now-lets-you-mount-linux-ext4-filesystems-in-wsl-2/)
  - September 10, 2020 02:12 PM 4 Windows 10 now allows you to mount physical disks formatted using the Linux ext4 filesystem in the Windows Subsystem for Linux 2. Linux filesystems, such as ext4, cannot be natively accessed in Windows 10 without installing special drivers. Starting with Windows 10 preview build 20211, WSL 2 now includes a wsl --mount command that lets you mount ext4 and other Linux kernel supported filesystems, directly in installed WSL distributions. This feature is especially...
- [EXT4 Windows: Mount EXT4 File System in WSL2](https://www.partitionwizard.com/partitionmagic/ext4-windows.html)
  - Do you want to mount EXT4 Windows? This post from MiniTool Partition Wizard shows you how to mount the EXT4 partition in WSL2. It also introduces other tools to manage EXT4 partitions on Windows. EXT4 (fourth extended filesystem) is a log file system under the Linux system. Windows can’t recognize the EXT4 partition and can’t access data in it. In Windows, the only thing you can do with an EXT4 partition is to delete it. The following picture shows the status of an EXT4 partition in Windows...
- [WSL2 can now mount Linux ext4 disks directly - Scott Hanselman](https://www.hanselman.com/blog/wsl2-can-now-mount-linux-ext4-disks-directly)
  - If you're on a version of Windows 11 that is build 22000 or greater, you can now use WSL to mount Linux disks directly. Run winver to see your Windows version. I'm on 22000.282 as of the time of this writing. I can also run wsl --help and see the --mount instructions. If you don't have them, you're not on the latest, or you can try installing/update WSL from the Windows Store. Installing WSL from the Windows Store gets you updates faster. --mount <Disk> Attaches and mounts a physical disk in...
- [WSL 2 in Windows 10 now supports mounting Linux filesystems like ...](https://www.xda-developers.com/wsl-2-windows-10-supports-mounting-linux-filesystems-ext4/)
  - After announcing Windows Subsystem for Linux 2 (WSL 2) during Microsoft Build last year, Microsoft rolled out the feature to users with the Windows 10 May 2020 update (v. 2004) earlier this year. The update introduced a full Linux kernel to the stable Windows 10 branch, and the company also made WSL 2 updateable through Windows Update. Late last month, Microsoft announced that WSL 2 support was being backported to Windows 10 v1903 and v1909. And now, the company has announced an update for the...
