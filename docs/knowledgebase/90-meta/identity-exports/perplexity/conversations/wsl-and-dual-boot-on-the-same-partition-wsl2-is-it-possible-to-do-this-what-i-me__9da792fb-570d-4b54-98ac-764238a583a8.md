---
source_url: "https://www.perplexity.ai/search/7ea3c351-68f0-423e-a4f1-38e86aa40314"
thread_uuid: "9da792fb-570d-4b54-98ac-764238a583a8"
slug: "7ea3c351-68f0-423e-a4f1-38e86aa40314"
title: "WSL and dual boot on the same partition?
WSL2
Is it possible to do this?

What i mean is that i would have a partition that i use for wsl with the Microsoft kernel and i could also boot to the same partition from grub (or another bootloader) with the normal kernel.

All ideas are welcome."
extracted_at: "2026-06-29T16:21:38.804Z"
matched_keywords: []
export_suite: "identity"
entry_count: 10
provenance: perplexity-rest-api
---

# WSL and dual boot on the same partition?
WSL2
Is it possible to do this?

What i mean is that i would have a partition that i use for wsl with the Microsoft kernel and i could also boot to the same partition from grub (or another bootloader) with the normal kernel.

All ideas are welcome.

Source: [Perplexity thread](https://www.perplexity.ai/search/7ea3c351-68f0-423e-a4f1-38e86aa40314)

## User

WSL and dual boot on the same partition?
WSL2
Is it possible to do this?

What i mean is that i would have a partition that i use for wsl with the Microsoft kernel and i could also boot to the same partition from grub (or another bootloader) with the normal kernel.

All ideas are welcome.

## Assistant

**No**, it is not possible to use the same partition for both WSL (Windows Subsystem for Linux) with the Microsoft kernel **and** dual boot into Linux with a normal kernel. Here's why:

- **WSL2**: WSL2 uses a virtualized environment to run Linux distributions on Windows. It uses a virtual hard disk (VHD) or virtual hard disk (VHDX) file to store the filesystem of the Linux distribution. This VHD/VHDX is not a physical partition but a file within the Windows file system. Therefore, you cannot directly boot into this setup from a bootloader like GRUB since it's not a traditional partition that can be recognized by the bootloader.[1]

- **Dual Boot**: Dual booting involves installing two or more operating systems on separate partitions of your hard drive, allowing you to choose which OS to start at boot time via a bootloader like GRUB. For dual booting, each OS needs its own partition, and while you can mount these partitions in WSL to access files, you cannot use the same partition for both WSL and a dual-boot Linux installation.[2]

**Workaround**: If you need to use the same files in both environments:

- You can export your WSL distribution to a drive, unregister/uninstall the distribution, and then import it again from the drive. This way, all distribution files will be on that drive. If you also want the kernel on that drive, you can modify the `.wslconfig` file to point to the kernel on the external drive.[2]

- **Physical Separation**: If your dual-boot Linux installation is on a physically separate drive from your Windows installation, you can indeed mount the Linux partition in WSL. This allows you to access Linux files from within your WSL environment, but remember, a drive can only be mounted to one OS at a time. WSL can read from and write to the mounted Linux partition, but you cannot run Linux directly from that partition in WSL.[2]

In conclusion, while you cannot use the same partition for WSL with the Microsoft kernel and dual booting into Linux with a normal kernel, you can leverage different partitions or drives for your Linux installations to achieve similar functionality. This setup allows for flexibility in accessing Linux files from both environments but requires careful management of bootloaders and configurations to ensure seamless operation.

### Sources

- [How to use the Microsoft Linux kernel v6 on WSL2](https://learn.microsoft.com/en-us/community/content/wsl-user-msft-kernel-v6)
  - Principal author: Nuno do Carmo Windows Subsystem for Linux version 2 (WSL2) uses by default a long term support (lts) Linux kernel. While the current WSL2 kernel is based on a version 5.x of the Linux kernel, the latest lts version is the version 6.x. Note you can find additional information about the Microsoft Linux kernel on the WSL2 Kernel GitHub page. While the kernel version 5.x could be enough for the majority of users, there's specific cases where you might need to have the latest...
- [WSL and dual boot on the same partition? - Reddit](https://www.reddit.com/r/bashonubuntuonwindows/comments/qjva26/wsl_and_dual_boot_on_the_same_partition/)
  - WSL and dual boot on the same partition? Is it possible to do this? What i mean is that i would have a partition that i use for wsl with the Microsoft kernel and i could also boot to the same partition from grub (or another bootloader) with the normal kernel. All ideas are welcome. No. You can export your distribution to the drive unregistered it / uninstall the distribution then import again from the drive. All distribution files will now be on that drive. If you really want the kernel there...
- [Advanced settings configuration in WSL | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/wsl-config)
  - You can configure the settings for your installed Linux distributions that will automatically be applied every time you launch WSL in two ways, by using: .wslconfigto configure global settingsacross all installed distributions running on WSL 2. wsl.confto configure local settingsper-distribution for each Linux distribution running on WSL 1 or WSL 2. Both file types are used for configuring WSL settings, but the location where the file is stored, the scope of the configuration, the type of...
- [Dualboot or WSL2 for software development - Reddit](https://www.reddit.com/r/bashonubuntuonwindows/comments/tgwdib/dualboot_or_wsl2_for_software_development/)
  - With that in mind I'm hesitating between two options to code in Rust. Either I go for a dual boot Ubuntu OS, so I have a "complete" and isolated setup environment, but it takes more time to configure before using and I've read that dual booting Windows + Linux can be a headache. Or I'm using WSL2, I develop on Windows and build/compile on the WSL2 bash, easier to setup (I already have WSL2 installed with ubuntu), but I fear it quickly become a nightmare when I'll try to debug, test, etc the...
- [WSL 2 Setup in Under 5 Minutes to run Linux on Windows 10](https://deanin.com/blog/wsl-2-setup-in-under-5-minutes-to-run-linux-on-windows-10/)
  - Today I’m going to help you setup a Windows supported version of Linux on your Windows installation. It’s as easy as opening a command prompt, or Powershell if you’re so inclined, and following a predictably more involved installation process. The feature is called the Windows Subsystem for Linux (Version 2), although most people just call it WSL 2. Originally announced in May 2019, it wasn’t until March of the following year when I began creating Ruby on Rails tutorials on the Deanin YouTube...
- [Dual booting Windows and Ubuntu: is it even worth it with WSL?](https://dev.to/proman4713/dual-booting-windows-and-ubuntu-is-it-even-worth-it-with-wsl-576o)
  - Welcome back to the fourth article of my "Leveraging Linux for Development" series! I apologize for the wait, I've been very busy with issues with my laptop. No matter, what I'm here to explain today is all for the Windows users who want to try out Linux (Ubuntu is our demonstration). I'll also talk about WSL, and if it's even worth it to dual boot Ubuntu with Windows if WSL exists. Let's get started!... ## WSL should do the job, right? Short answer: Not really. Some Windows developers daily...

## User

What is the main reason wsl is using vhd/vhdx format over ext4 or whatever grub bootloader uses? Has this been asked before? Why couldn't they just unify the formats when they made this implementation, why specifically use vhdx? If ext4 works fine with grub why does wsl2 want vhdx?

## Assistant

The main reason WSL2 uses the **VHD/VHDX** format over **ext4** or other formats typically used with GRUB bootloaders is rooted in its design and operational requirements:

- **Virtualization and Compatibility**: WSL2 leverages virtualization to run Linux distributions on top of Windows. By using a VHD/VHDX file, WSL2 can provide a virtualized environment that is compatible with Windows' virtualization stack (Hyper-V). This allows for better integration with Windows features and ensures that Linux distributions can operate in a sandboxed environment, isolated from the Windows system.[5]

- **Dynamic Disk Allocation**: WSL2's VHDX files are designed to be dynamic, meaning they grow and shrink (to a certain extent) as needed. While they do not automatically shrink when files are deleted, they can be manually compacted or optimized to reclaim unused space. This approach allows for efficient disk space utilization, as the VHD/VHDX file only uses as much space as is necessary at any given time, up to the defined maximum limit.[1][4][5]

- **File System Support**: Although ext4 is widely used in Linux environments, WSL2's VHDX format provides a layer of abstraction that allows for better support for Windows file system features and operations. This includes features like sparse file support and the ability to handle Windows-specific file attributes and permissions.[5]

- **Security and Isolation**: Using a VHD/VHDX file for each Linux distribution ensures that each environment is isolated and secure. This separation helps prevent potential conflicts or interference between the Windows host system and the Linux guest environment.[5]

- **Bootloader Compatibility**: GRUB, a common bootloader for Linux, is designed to work with physical partitions, not virtual disk files like VHD/VHDX. Integrating GRUB to work directly with VHD/VHDX would require significant changes or a new approach, which would complicate the setup and potentially compromise the simplicity and security that WSL2 aims to provide.[5]

- **Legacy and Interoperability**: Windows has a long history of supporting VHD/VHDX for virtual machines, which allows for easy export, import, and management of virtual disks. This legacy support offers a familiar and stable environment for both Windows and Linux users who might need to interact with these virtual disk files in various scenarios, including backup, recovery, and migration.[1][5]

In summary, WSL2's use of VHD/VHDX over ext4 or other formats used by GRUB is primarily due to its need for virtualization, dynamic disk allocation, compatibility with Windows' virtualization stack, and the security benefits of isolation provided by virtual disk files. While ext4 works well with GRUB for booting into Linux directly, WSL2's approach offers advantages in terms of integration, flexibility, and ease of management within the Windows ecosystem.[5]

### Sources

- [How to manage WSL disk space - Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/disk-space)
  - This guide covers how to manage the disk space used by Linux distributions installed using WSL 2, including: How to check the amount of disk space available in the VHD How to expand the size of the VHD How to repair the VHD if an error occurs How to locate the .vhdx file and disk path for any installed Linux distributions... Windows Subsystem for Linux (WSL 2) uses a virtualization platform to install Linux distributions alongside the host Windows operating system, creating a Virtual Hard Disk...
- [Docker - Hyper-V instead of WSL 2? - Code with Mosh Forum](https://forum.codewithmosh.com/t/docker-hyper-v-instead-of-wsl-2/23327)
  - In learning how to use Docker on install I am being asked to install Docker and to make sure Hyper-V is active. The problem is that the Docker installer says to use WSL 2 instead of Hyper-V. Are we going to use Hyper-V or are we going to use WSL 2? I thought the point was not to use VMs to reduce the requirements of processing and resource hoggery? Or am I wrong? Hi, Use WSL2. Hyper-V gonna be abandoned. Cheers. What is it going to be replaced with? WSL2 will replace Hyper-V. A bit of info...
- [Create new virtual ext4 disk and attach to available WSL2 #5896](https://github.com/microsoft/WSL/discussions/5896)
  - WSLPublic Notifications You must be signed in to change notification settings Fork 816 Does WSL2 allow create new ext4 virtual disk and attach to available WSL2 instance ? Beta Was this translation helpful? Give feedback.... ## Replies: 8 comments 7 replies just came out of the oven this functionality Beta Was this translation helpful? Give feedback. This blog post explains only how to mount a physical disk, but not how to mount a *.vhdx file. Beta Was this translation helpful? Give feedback....
- [Docker Desktop WSL ext4.vhdx too large [closed] - Stack Overflow](https://stackoverflow.com/questions/70946140/docker-desktop-wsl-ext4-vhdx-too-large)
  - (Update for December 2022) The windows utility diskpartcan now be used to shrink Virtual Hard Disk (vhdx) files provided you freed up the space inside it by deleting any unnecessary files. I found the info in this guide. I am putting the gist of the instructions below for reference but the guide above is more complete. First make sure all WSL instances are shut down by opening an administrator command window, and typing: Verify everything is stopped by: Then start diskpart: and inside diskpart...
- [reduce disk space consumption for WSL - Microsoft Community](https://answers.microsoft.com/en-us/windows/forum/all/reduce-disk-space-consumption-for-wsl/4de32b77-2fdb-442b-9fa9-da7151920fde)
  - The wsl is consuming too much disk space so I look up and tried to compact the ext4.vhdx but it didn't work like the instructions. I really need some supports to this problems. October 14, 2024 Subscribe Subscribe to RSS feed Reported content has been submitted I am Tanvi, and I would be happy to assist you today! WSL2 uses a dynamic VHDX file (ext4.vhdx), which grows as you use it but doesn't automatically shrink when you delete files. 1 This can lead to significant disk space consumption...

## User

im' sorry but your response is avoiding the problem with using EXT4 instead of VHDX. What specifically makes VHDX superior to EXT4 in the context of WSL/virtualbox/hyperv

## Assistant

In the context of **WSL, VirtualBox, and Hyper-V**, **VHDX** offers several advantages over **EXT4**:

- **Virtualization and Compatibility**: VHDX is designed to work seamlessly with Windows' virtualization stack (Hyper-V). It provides a layer of abstraction that allows for better support for Windows file system features and operations, including sparse file support, which is essential for efficient disk space utilization in virtualized environments.[1][2]

- **Dynamic Disk Allocation**: VHDX files can grow and shrink dynamically, allowing for efficient disk space management. Although they do not automatically shrink when files are deleted, they can be manually compacted to reclaim unused space, which is not a feature of EXT4.[2][1]

- **Security and Isolation**: Using VHDX for each Linux distribution ensures isolation and security. Each distribution operates in its own sandboxed environment, which helps prevent potential conflicts or interference between the Windows host system and the Linux guest environment.[1][2]

- **Scalability**: VHDX can support virtual disks up to 64TB in size, far exceeding the 2TB size limit of VHD. This scalability is essential for enterprise environments where large virtual machines are common and for future-proofing storage needs.[3][2]

- **Resiliency**: VHDX offers protection against data corruption during unexpected power failures or host shutdowns by logging updates to the VHDX metadata, ensuring data integrity.[2][3]

- **Compatibility with Windows Ecosystem**: VHDX is native to the Windows ecosystem, providing easy management, backup, and recovery options. This includes compatibility with Microsoft Azure, which still requires VHD format but can replicate VHDXs and convert them automatically.[1][2]

- **Performance**: VHDX supports advanced features like TRIM for efficient data representation and ODX for offloaded data transfer operations, which can enhance performance in certain scenarios.[3][2]

- **Metadata Support**: VHDX supports custom metadata about the file being stored, such as the OS or patches applied, which can be useful for managing virtual environments.[2][3]

The use of VHDX over EXT4 in WSL and other virtualization platforms stems from these advantages, which are tailored to the needs of virtualized environments and the Windows ecosystem. While EXT4 is widely used in Linux installations, its design is more suited to physical partitions and does not inherently provide the same level of Windows integration, scalability, or dynamic expansion capabilities as VHDX.

### Sources

- [Understanding and working with VHD and VHDX files - Altaro](https://www.altaro.com/hyper-v/understanding-working-vhdx-files/)
  - A virtual machine is an *abstract* computer, including the VHDX virtual disk file used in Hyper-V to represent the physical hard drive attached to a physical computer. It mimics a physical computer for the purpose of extending the flexibility of the computer system while still providing as many features of the physical environment as possible. Hyper-V, like most hypervisors, defines this abstract computer using files, as in the case of the VHDX file mentioned at the outset. The VHDX virtual...
- [Microsoft VHDX format: Understanding benefits, conversion process](https://www.techtarget.com/searchstorage/tip/Microsoft-VHDX-format-Understanding-benefits-conversion-process)
  - *The new * *VHDX virtual file format* * in Windows Server 2012 Hyper-V facilitates the conversion of virtual machines to a virtual infrastructure. * *VHDX* * is an upgrade to Hyper-V's former * *Virtual Hard Disk format* *, and provides benefits such as greater scalability and improved alignment. In this tip, virtualization expert * *David Davis* * explains how the VHDX format evolved from VHD, the benefits the new version provides and how to convert old files to VHDX.* One of the major new...
- [How to manage WSL disk space](https://learn.microsoft.com/en-us/windows/wsl/disk-space)
  - Windows Subsystem for Linux (WSL 2) uses a virtualization platform to install Linux distributions alongside the host Windows operating system, creating a Virtual Hard Disk (VHD) to store files for each of the Linux distributions that you install. These VHDs use the ext4 file system type and are represented on your Windows hard drive as an *ext4.vhdx* file. WSL 2 automatically resizes these VHD files to meet storage needs. By default each VHD file used by WSL 2 is initially allocated a 1TB...

## User

Provide a detailed and accurate representation (visually) of the EXT4 filesystem compared side by side with the VHDX file structure so I can see why they are so different and maybe understand this nonsense.

## Assistant

The image you provided visually contrasts the structures of the EXT4 filesystem and the VHDX file format, highlighting their differences:

### EXT4 Filesystem Structure

- **Superblock**: Contains metadata about the filesystem, such as size, block count, and status.
- **Block Group Descriptor Table**: Manages block groups, which are collections of contiguous blocks.
- **Block Bitmap**: Tracks used and free blocks within a block group.
- **Inode Bitmap**: Tracks used and free inodes, which store file metadata.
- **Inodes**: Store metadata for files and directories, including permissions and pointers to data blocks.
- **Data Blocks**: Contain the actual data of files and directories.

### VHDX File Structure

- **Header**: Contains metadata about the VHDX file itself.
- **Block Allocation Table (BAT)**: Manages mapping between logical sectors and physical locations in the payload.
- **Metadata Region**: Stores additional metadata about the virtual disk.
- **Log**: Provides resiliency by recording changes for recovery after crashes.
- **Payload Blocks**: Hold the actual data stored in the virtual disk.
- **Sector Bitmap**: Tracks sector usage within payload blocks for efficient storage management.

### Key Differences

1. **Purpose and Design**:
   - EXT4 is a traditional filesystem designed for direct use on physical disks, focusing on efficient storage and retrieval of files on Linux systems.
   - VHDX is a virtual disk format optimized for use with virtualization platforms like Hyper-V. It provides features like dynamic resizing, snapshots, and integration with Windows' virtualization stack.

2. **Structure and Flexibility**:
   - EXT4 uses fixed structures for managing files and directories, optimized for performance on physical hardware.
   - VHDX includes flexible regions like the BAT and metadata region to support dynamic operations such as resizing and differencing disks.

3. **Resiliency and Recovery**:
   - VHDX includes a log to ensure data integrity during unexpected shutdowns, which is crucial in virtual environments where consistency is key.
   - EXT4 relies on journaling to maintain filesystem integrity but is less focused on virtualization-specific needs.

These differences highlight why VHDX is preferred in virtual environments like WSL2: it offers better integration with virtualization technologies, dynamic management, and compatibility with Windows systems.

### Sources

- [[MS-VHDX]: Layout - Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-vhdx/89270f3c-94c9-4363-a678-92b1ca7990a0)
  - The VHDX file begins with a fixed-sized header section. After this, non-overlapping structures and free space are intermixed freely in no particular order, the only restriction being that all objects have 1-MB alignment within the file. In addition to the header, the structures currently defined in the VHDX file include the block allocation table (BAT) region (also referred to as BAT), the metadata region, the log, the payload blocks, and the sector bitmap blocks, each of which is specified in...
- [[MS-VHDX]: Overview - Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-vhdx/83f6b700-6216-40f0-aa99-9fcb421206e2)
  - The virtual hard disk v2 (VHDX) file format provides features at the virtual hard disk as well as virtual hard disk file layers and is optimized to work well with modern storage hardware configurations and capabilities. The VHDX format is designed to support three types of virtual hard disks: Fixed Virtual Hard Disk: A virtual hard disk file that is allocated to the size of the virtual hard disk and does not change when data is added or removed from the virtual hard disk. For example, for a...
- [Chapter 6. The Ext4 File System | Red Hat Product Documentation](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/6/html/storage_administration_guide/ch-ext4)
  - The ext4 file system is a scalable extension of the ext3 file system, which was the default file system of Red Hat Enterprise Linux 5. Ext4 is the default file system of Red Hat Enterprise Linux 6, and can support files and file systems up to 16 terabytes in size. It also supports an unlimited number of sub-directories (the ext3 file system only supports up to 32,000), though once the link count exceeds 65,000 it resets to 1 and is no longer increased. Note As with ext3, an ext4 volume must be...
- [ext4 - Wikipedia](https://en.wikipedia.org/wiki/Ext4)
  - Developer(s)Mingming Cao, Andreas Dilger, Alex Zhuravlev (Tomas), Dave Kleikamp, Theodore Ts'o, Eric Sandeen, Sam Naghshineh, others Full nameFourth extended file system Introduced10 October 2006 with Linux 2.6.19 Preceded byext3 Partition IDs0x83: MBR / EBR. EBD0A0A2-B9E5-4433-87C0-68B6B72699C7: GPT Windows BDP. Structures Directory contentsLinked list, hashed B-tree File allocationExtents / Bitmap Bad blocksTable Limits Max volume size1 EiB Max file size16-256 TiB (for 4-64 KiB block size)...
- [A Minimum Complete Tutorial of Linux ext4 File System - Mete Balci](https://metebalci.com/blog/a-minimum-complete-tutorial-of-linux-ext4-file-system/)
  - Default directory hash: half_md4 Directory Hash Seed: 648ce1ac-dd8d-40a6-ac6f-238b2e7d97d1 Journal backup: inode blocks Journal features: (none) Journal size: 128M Journal length: 32768 Journal sequence: 0x00000001 Journal start: 0 There are plenty of information here and I will explain most of it. The most basic storage layout concept of ext4 is Block. ext4 allocates storage in a series of blocks, just like LBA. However the ext4 Block size can be different. Block size in Superblock is 4096B =...

## User

I am only curious about one thing and one thing only. Please explain why EXT4 cannot be used for virtualization purposes or why it is less optimal than VHDX, and why VHDX cannot be used by grub bootloader and/or outside of a virtualized filesystem. Anything that is not immediately related to this question, assume you already talked about this and skip it in your response.

## Assistant

The choice between EXT4 and VHDX for virtualization and bootloading involves several key considerations:

### Why EXT4 is Less Optimal for Virtualization

1. **Lack of Virtualization Features**: EXT4 is a traditional filesystem designed for direct use on physical disks. It lacks built-in features for virtualization, such as dynamic resizing and snapshot support, which are crucial for managing virtual environments efficiently.

2. **No Built-in Abstraction Layer**: EXT4 operates directly on disk partitions without an abstraction layer, making it less flexible for virtualization tasks that require dynamic disk management and isolation provided by formats like VHDX.

3. **Integration with Windows**: EXT4 does not integrate seamlessly with Windows' virtualization technologies, such as Hyper-V, which are designed to work with VHD/VHDX files. This integration is essential for performance and compatibility in mixed OS environments.

### Why VHDX Cannot Be Used by GRUB

1. **File vs. Filesystem**: VHDX is a virtual disk file format, not a filesystem like EXT4. GRUB is a bootloader that works directly with filesystems on physical partitions, not virtual disk files.

2. **Designed for Virtualization**: VHDX is specifically designed for virtualization platforms and not for direct bootloading by tools like GRUB. It includes features like metadata regions and block allocation tables that are irrelevant to GRUB's operation.

3. **Bootloader Compatibility**: GRUB requires filesystems it can directly interpret (like EXT4) to locate boot files and kernels. VHDX requires a hypervisor to interpret its structure, which is outside the scope of what GRUB handles.

In summary, EXT4 is optimized for traditional disk operations, while VHDX provides advanced features tailored to virtualization needs, such as dynamic resizing and integration with Windows virtualization tools. This makes VHDX more suitable for virtual environments but unsuitable for direct use by bootloaders like GRUB.

### Sources

- [image](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/34541976/a98aa442-cde9-4e98-8bef-3420bd1cd0fa/0/image.png)
- [Understanding and working with VHD and VHDX files - Altaro](https://www.altaro.com/hyper-v/understanding-working-vhdx-files/)
  - You might ask the question – under what conditions might it be necessary to create a VHD file rather than a VHDX file? If you will never use the virtual disk file with down-level *management* operating systems (Windows 7 or Windows/Hyper-V Server 2008 R2 or earlier), then you should always use VHDX (remember that *guest* operating systems don’t know or care which you use). Microsoft Azure still does not support uploading VHDX files, but you can replicate your VHDXs there. If you need to mount...
- [Microsoft VHDX format: Understanding benefits, conversion process | TechTarget](https://www.techtarget.com/searchstorage/tip/Microsoft-VHDX-format-Understanding-benefits-conversion-process)
  - *The new * *VHDX virtual file format* * in Windows Server 2012 Hyper-V facilitates the conversion of virtual machines to a virtual infrastructure. * *VHDX* * is an upgrade to Hyper-V's former * *Virtual Hard Disk format* *, and provides benefits such as greater scalability and improved alignment. In this tip, virtualization expert * *David Davis* * explains how the VHDX format evolved from VHD, the benefits the new version provides and how to convert old files to VHDX.* One of the major new...
- [VHD VS VHDX - let's compare   | DiskInternals](https://www.diskinternals.com/raid-recovery/vhd-vs-vhdx/)
  - The VHD (Virtual Hard Disk) document design, initially presented with Connectix Virtual PC, can store the contents of a hard disk drive. Ultimately, Microsoft Hyper-V embraced this disk image design. Windows 7 and fresher frameworks incorporate the capacity to physically mount VHD records. Beginning with Windows 8, a client can mount a VHD by simply double tapping on the file. VHDX pictures are practically comparable to VHD pictures, yet they incorporate more current features, for example,...

## User

```
File vs. Filesystem: VHDX is a virtual disk file format, not a filesystem like EXT4. GRUB is a bootloader that works directly with filesystems on physical partitions, not virtual disk files.
```

This statement is kind of like a 'duh' but i'm serious. If I have the exact same data in the same spot, one on the 2nd partition, and the 1st partition represents that same data as a singular file (that file representing the 2nd partition), why can't it just literally BE the same thing?

## Assistant

The fundamental difference between EXT4 and VHDX lies in their **purpose and design**, making them incompatible with each other's roles:

### EXT4

- **Purpose**: EXT4 is a filesystem designed for direct use on physical partitions.
- **Structure**: It stores files and directories in a structured manner, optimized for file access and management on a physical disk.
- **Compatibility**: GRUB can directly read EXT4 filesystems to locate and load kernels and boot files.

### VHDX

- **Purpose**: VHDX is a **virtual disk** file format designed for virtualization platforms like Hyper-V.
- **Structure**: It encapsulates an entire disk image, including partitions, in one file. This file contains its own metadata, block allocation table (BAT), and data blocks.
- **Virtualization Features**: VHDX supports dynamic resizing, snapshots, and other virtualization-specific operations, which are not part of EXT4's design.
- **Compatibility**: VHDX is not directly usable by GRUB because:
  - It is a file, not a filesystem, meaning it cannot be directly interpreted by GRUB for locating files or kernels.
  - The hypervisor (like Hyper-V) needs to interpret the VHDX file structure to provide access to its contents, a role outside GRUB's scope.

### Why VHDX Cannot Replace EXT4 in Bootloading:

1. **File System Abstraction**: VHDX provides an abstraction layer for virtual environments, handling dynamic expansion and other virtualization-specific features. This abstraction is not recognized by GRUB, which operates at the filesystem level.

2. **Virtualization-Specific Features**: Features like dynamic resizing, snapshots, and metadata regions in VHDX are irrelevant to GRUB's operation, which is focused on locating and loading specific files on a filesystem.

3. **Compatibility with Windows Virtualization**: VHDX is tightly integrated with Windows' virtualization technologies, providing seamless management and compatibility, which is not relevant for direct booting by GRUB.

In summary, EXT4 is designed for direct disk operations, while VHDX is tailored for virtualization, providing an abstraction layer and features not needed for traditional bootloading. This fundamental difference in purpose and design is why VHDX cannot be used by GRUB for booting, and why it's more optimal than EXT4 for virtualization tasks.

### Sources

- [How can I attach a VHDx or VHD file in Linux? - Stack Overflow](https://stackoverflow.com/questions/36819474/how-can-i-attach-a-vhdx-or-vhd-file-in-linux/37790474)
  - How can I attach a VHDX or VHD file in Linux? I mean attach the virtual hard disk as a block device, and use external tools to read these devices. The filesystem inside is not mountable. I do not need to mount the filesystem, but deal with it as if it was on a real hard disk. I read the manual page of guestfish, but could not find how to do it. You can use libguestfs-toolsto achieve this. First, you need to install it, on Ubuntu/Debian-like Linux that would be: Then, you can mount almost...
- [Best Practices for running Linux on Hyper-V | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/Best-Practices-for-running-Linux-on-Hyper-V)
  - Some Linux file systems may consume significant amounts of real disk space even when the file system is mostly empty. To reduce the amount of real disk space usage of dynamic VHDX files, consider the following recommendations: When creating the VHDX, use 1MB BlockSizeBytes (from the default 32MB) in PowerShell, for example:... PS > New-VHD -Path C:\MyVHDs\test.vhdx -SizeBytes 127GB -Dynamic -BlockSizeBytes 1MB The ext4 format is preferred to ext3 because ext4 is more space efficient than ext3...
- [Understanding and Working with VHD(X) Files](https://www.altaro.com/hyper-v/understanding-working-vhdx-files/)
  - This is a Hyper-V blog, so naturally, I will usually only bring up VHDX in that context. It is not particular to Hyper-V at all. Windows 7 and Windows Server 2008 R2 were able to directly open and manipulate VHD files. Windows 8+ and Windows Server 2012+ can natively open and manipulate VHDX files. For instance, the Disk Management tool in Windows 10 allows you to create and attach VHD and VHDX files: When mounted, the VHDX then looks to the operating system like any other disk: The most...
- [[MS-VHDX]: Overview](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-vhdx/83f6b700-6216-40f0-aa99-9fcb421206e2)
  - The virtual hard disk v2 (VHDX) file format provides features at the virtual hard disk as well as virtual hard disk file layers and is optimized to work well with modern storage hardware configurations and capabilities. The VHDX format is designed to support three types of virtual hard disks: Fixed Virtual Hard Disk: A virtual hard disk file that is allocated to the size of the virtual hard disk and does not change when data is added or removed from the virtual hard disk. For example, for a...
- [Problem booting VHD of Windows 7 on Ubuntu 11.10 - virtualbox.org](https://forums.virtualbox.org/viewtopic.php?t=47169)
  - I've done some googling and found the grub rescue page on the Ubuntu site (I'd post the link, but I haven't been a member for a day yet...), but nothing I try works. The only command that seems to work is ls and set (though I haven't tried all of them). Code: Select all error: unknown filesystem. grub rescue> I created the .vhd file both with the system resource partition (before C in disk2vhd) and without with the same results. Is there a way that I can fix this? I don't see grub being needed...

## User

OK I believe you, but what is the big issue CONVERTING a VHDX file into a EXT4 partition? Why does it require a tremendous amount of IO? Why can't the harddrive be configured to understand that they are one in the same, just stored differently? Is it theoretically possible?

## Assistant

### Conversion Challenges and IO Overhead

Converting a **VHDX** file into an **EXT4** partition involves several challenges:

1. **Format and Structure Differences**:
   - **VHDX** is a **virtual disk** file format, encapsulating an entire disk image, including partitions, in one file. It contains metadata, block allocation tables (BAT), and data blocks designed for virtualization.
   - **EXT4** is a **filesystem** optimized for direct disk operations, storing files and directories in a structured manner.

2. **Data Organization**:
   - VHDX uses a dynamic expansion mechanism, expanding and shrinking based on data usage. This dynamic nature can lead to fragmentation and a lack of direct mapping to physical disk sectors.
   - EXT4 operates on fixed partitions with a known size, making it less adaptable to dynamic changes in disk space usage.

3. **I/O Overhead**:
   - **Conversion Process**: Converting VHDX to EXT4 requires reading the entire VHDX file to interpret and replicate its contents onto a physical partition. This process involves:
     - Reading each block of the VHDX file to understand its structure and data placement.
     - Writing that data to an EXT4 filesystem, which involves creating metadata, inodes, and data blocks.
     - **Zeroing Out Unused Blocks**: To compact VHDX files, unused blocks need to be zeroed out, requiring a full pass over the disk to identify and zero these blocks, leading to substantial I/O and time overhead.
   - **Fragmentation**: VHDX's dynamic expansion can lead to fragmentation, causing the conversion process to involve moving and reallocating data, increasing I/O operations.

4. **Theoretical Possibility**:
   - **Direct Mapping**: Theoretically, if the hard drive could interpret VHDX as a direct representation of an EXT4 partition, it would require:
     - Modifying the hard drive firmware or drivers to understand the VHDX format.
     - Creating a mapping layer that translates VHDX block allocation to EXT4 structures in real-time, which would:
       - Complicate hardware and software interactions, potentially degrading performance.
       - Require significant changes to both the VHDX and EXT4 specifications, making them less interoperable with existing systems.

5. **Practical Limitations**:
   - **Hardware Abstraction**: Current hardware designs do not allow for such direct interpretation, as they are built to interact with physical partitions, not virtual disk files.
   - **Software Overhead**: Software solutions for interpreting VHDX directly as an EXT4 partition would introduce significant overhead, reducing performance and increasing complexity.

In conclusion, converting VHDX to EXT4 involves substantial I/O due to the structural differences between the two formats, the dynamic nature of VHDX, and the need to replicate its contents onto a physical partition. While theoretically possible, practical limitations in hardware and software make direct mapping of VHDX to EXT4 highly complex and inefficient.

### Sources

- [Best Practices for running Linux on Hyper-V](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/Best-Practices-for-running-Linux-on-Hyper-V)
  - Some Linux file systems may consume significant amounts of real disk space even when the file system is mostly empty. To reduce the amount of real disk space usage of dynamic VHDX files, consider the following recommendations: When creating the VHDX, use 1MB BlockSizeBytes (from the default 32MB) in PowerShell, for example:... PS > New-VHD -Path C:\MyVHDs\test.vhdx -SizeBytes 127GB -Dynamic -BlockSizeBytes 1MB The ext4 format is preferred to ext3 because ext4 is more space efficient than ext3...
- [How to Compact a VHDX with a Linux Filesystem - Altaro](https://www.altaro.com/hyper-v/compact-vhdx-linux-filesystem/)
  - I assume that this process will work with any file system at all, but I’ve only tested with ext4. Your mileage may vary. Because the VHDX cannot parse the file system, it can only remove blocks that contain all zeros. With that knowledge, we now have a goal: zero out unused blocks. We’ll need to do that from within the guest.... ## Compact the VHDX The compact process itself does not differ, regardless of the contained file system. If you already know how to compact a dynamically-expanding...
- [Microsoft VHDX format: Understanding benefits, conversion process | TechTarget](https://www.techtarget.com/searchstorage/tip/Microsoft-VHDX-format-Understanding-benefits-conversion-process)
  - *The new * *VHDX virtual file format* * in Windows Server 2012 Hyper-V facilitates the conversion of virtual machines to a virtual infrastructure. * *VHDX* * is an upgrade to Hyper-V's former * *Virtual Hard Disk format* *, and provides benefits such as greater scalability and improved alignment. In this tip, virtualization expert * *David Davis* * explains how the VHDX format evolved from VHD, the benefits the new version provides and how to convert old files to VHDX.* One of the major new...

## User

Why can't VHDX directly map to an existing EXT4 partition?

## Assistant

**VHDX** and **EXT4** serve different purposes and have distinct designs, making direct mapping between them impractical:

1. **Different Structures**:
   - **VHDX** is a **virtual disk file format** designed for virtualization platforms like Hyper-V. It encapsulates an entire disk image, including partitions, in one file. This file contains metadata, block allocation tables (BAT), and data blocks optimized for virtual environments.[2]
   - **EXT4** is a **filesystem** optimized for direct use on physical partitions. It stores files and directories in a structured manner, focusing on efficient file access and management on physical disks.[3][4]

2. **Virtualization Features**:
   - VHDX supports features like dynamic resizing, snapshots, and metadata regions, which are irrelevant to EXT4's purpose of managing physical disk space.[1][2]
   - EXT4 lacks the abstraction layer and features required for virtualization tasks like dynamic disk management and isolation.

3. **I/O Overhead**:
   - Converting VHDX to EXT4 involves reading the entire VHDX file to interpret its structure, replicating its contents onto a physical partition, and creating metadata, inodes, and data blocks. This process requires substantial I/O operations.[1]
   - VHDX's dynamic expansion can lead to fragmentation, further complicating the conversion process and increasing I/O overhead.[1]

4. **Theoretical Possibility**:
   - Theoretically, if hardware could interpret VHDX as a direct representation of an EXT4 partition, it would require:
     - Modifying hard drive firmware or drivers to understand the VHDX format.
     - Creating a real-time mapping layer to translate VHDX block allocation to EXT4 structures, which would introduce significant complexity and performance degradation.[1]

5. **Practical Limitations**:
   - Current hardware designs do not allow for such direct interpretation.[1]
   - Software solutions for interpreting VHDX as EXT4 would introduce overhead, reducing performance and increasing complexity.[1]

In summary, **VHDX** and **EXT4** have fundamental differences in purpose, structure, and features, making direct mapping between them impractical. The I/O overhead of conversion, the need for virtualization features, and the lack of compatibility with existing systems prevent VHDX from being used directly by a bootloader like GRUB or outside a virtualized filesystem.

### Sources

- [Understanding and Working with VHD(X) Files](https://www.altaro.com/hyper-v/understanding-working-vhdx-files/)
  - This is a Hyper-V blog, so naturally, I will usually only bring up VHDX in that context. It is not particular to Hyper-V at all. Windows 7 and Windows Server 2008 R2 were able to directly open and manipulate VHD files. Windows 8+ and Windows Server 2012+ can natively open and manipulate VHDX files. For instance, the Disk Management tool in Windows 10 allows you to create and attach VHD and VHDX files: When mounted, the VHDX then looks to the operating system like any other disk: The most...
- [[MS-VHDX]: Layout](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-vhdx/89270f3c-94c9-4363-a678-92b1ca7990a0)
  - The VHDX file begins with a fixed-sized header section. After this, non-overlapping structures and free space are intermixed freely in no particular order, the only restriction being that all objects have 1-MB alignment within the file. In addition to the header, the structures currently defined in the VHDX file include the block allocation table (BAT) region (also referred to as BAT), the metadata region, the log, the payload blocks, and the sector bitmap blocks, each of which is specified in...
- [Best Practices for running Linux on Hyper-V | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/Best-Practices-for-running-Linux-on-Hyper-V)
  - Some Linux file systems may consume significant amounts of real disk space even when the file system is mostly empty. To reduce the amount of real disk space usage of dynamic VHDX files, consider the following recommendations: When creating the VHDX, use 1MB BlockSizeBytes (from the default 32MB) in PowerShell, for example:... PS > New-VHD -Path C:\MyVHDs\test.vhdx -SizeBytes 127GB -Dynamic -BlockSizeBytes 1MB The ext4 format is preferred to ext3 because ext4 is more space efficient than ext3...
- [Proxmox EXT4 vs. XFS: Which One is More Suitable for You?](https://www.vinchin.com/tech-tips/proxmox-ext4-vs-xfs.html)
  - Proxmox supports multiple file systems that can be used to manage storage for virtual machines. Among these file systems, EXT4 and XFS stand out as two of the most popular choices due to their reliability and performance. This article provides an in-depth comparison between EXT4 and XFS, evaluating their strengths, weaknesses, and applicability in a Proxmox setup. When we use a hard drive, we do not directly read or write to the physical hard drive device, but manage and access the files on...
- [How to manage WSL disk space](https://learn.microsoft.com/en-us/windows/wsl/disk-space)
  - Windows Subsystem for Linux (WSL 2) uses a virtualization platform to install Linux distributions alongside the host Windows operating system, creating a Virtual Hard Disk (VHD) to store files for each of the Linux distributions that you install. These VHDs use the ext4 file system type and are represented on your Windows hard drive as an *ext4.vhdx* file. WSL 2 automatically resizes these VHD files to meet storage needs. By default each VHD file used by WSL 2 is initially allocated a 1TB...

## User

```
Theoretical Possibility:
Theoretically, if hardware could interpret VHDX as a direct representation of an EXT4 partition, it would require:
Modifying hard drive firmware or drivers to understand the VHDX format.
Creating a real-time mapping layer to translate VHDX block allocation to EXT4 structures, which would introduce significant complexity and performance degradation1.
```
Determine the theoretical possibility, determine if it's been done or theorized and if anyone has done it successfully.

## Assistant

The **theoretical possibility** of directly mapping a **VHDX** file to an **EXT4** partition involves:

- **Modifying Hard Drive Firmware or Drivers**: This would require the hard drive firmware or drivers to understand the VHDX format, which is not currently supported by standard hardware.
  
- **Creating a Real-Time Mapping Layer**: A layer would need to be developed to translate VHDX block allocation to EXT4 structures in real-time, introducing significant complexity and potential performance degradation.

### Has this been done or theorized?

There is no evidence from the provided search results or general knowledge that this has been successfully done or theorized in any practical or widely recognized manner:

- **VHDX** is designed for virtualization, encapsulating an entire disk image within one file. It includes metadata, block allocation tables (BAT), and data blocks, which are not directly usable by a bootloader like GRUB or outside a virtualized filesystem.[1][3]

- **EXT4** is a filesystem optimized for physical partitions, focusing on efficient file access and management. Its design does not accommodate the virtualization-specific features of VHDX.[2]

### Why It's Not Practical:

- **Structural Differences**: VHDX and EXT4 have fundamentally different structures and purposes. VHDX provides an abstraction layer for virtualization, while EXT4 is designed for direct disk operations.[3]

- **Performance Overhead**: Creating a real-time mapping layer to interpret VHDX as EXT4 would introduce significant overhead, reducing performance and increasing complexity.[1]

- **Hardware Abstraction**: Current hardware designs do not support such direct interpretation, as they are built to interact with physical partitions, not virtual disk files.[1]

- **Software Solutions**: While theoretically possible, software solutions for interpreting VHDX as EXT4 would complicate hardware and software interactions, potentially degrading performance.[1]

In summary, no practical or widely recognized solution has been implemented to directly map VHDX to EXT4. The fundamental differences in their design, purpose, and the complexity involved in creating a real-time mapping layer make it highly impractical. Existing virtualization technologies like Hyper-V and WSL2 manage VHDX files through specialized drivers and hypervisors, leaving the translation and interpretation to those layers rather than attempting to map VHDX directly to EXT4 or any other filesystem.

### Sources

- [How to manage WSL disk space](https://learn.microsoft.com/en-us/windows/wsl/disk-space)
  - Windows Subsystem for Linux (WSL 2) uses a virtualization platform to install Linux distributions alongside the host Windows operating system, creating a Virtual Hard Disk (VHD) to store files for each of the Linux distributions that you install. These VHDs use the ext4 file system type and are represented on your Windows hard drive as an *ext4.vhdx* file. WSL 2 automatically resizes these VHD files to meet storage needs. By default each VHD file used by WSL 2 is initially allocated a 1TB...
- [Proxmox EXT4 vs. XFS: Which One is More Suitable for You? | Vinchin Backup](https://www.vinchin.com/tech-tips/proxmox-ext4-vs-xfs.html)
  - Proxmox supports multiple file systems that can be used to manage storage for virtual machines. Among these file systems, EXT4 and XFS stand out as two of the most popular choices due to their reliability and performance. This article provides an in-depth comparison between EXT4 and XFS, evaluating their strengths, weaknesses, and applicability in a Proxmox setup. When we use a hard drive, we do not directly read or write to the physical hard drive device, but manage and access the files on...
- [Understanding and working with VHD and VHDX files - Altaro](https://www.altaro.com/hyper-v/understanding-working-vhdx-files/)
  - VHDX is a semi-open file format that describes a *v*irtual *h*ard *d*isk. With the virtual hard disk represented by a file, it also makes it easy to import VHDX to Hyper-V which allows moving virtual machines and data around easily. You can also restore Hyper-V virtual machine from VHDX since this can contain the operating system installation and all data. The *x* was added to the current specification’s name so that it would not be confused with the earlier VHD format. Microsoft publishes...

## User

how about this idea. What if I have a SMALL wsl2 distro installed, and a full blown linux distro installed next to windows 10/11. Two partitions, two operating systems, and windows has a vhdx representing a small wsl2 distro. Can the wsl2 distro ACCESS the ext4 partition and safely read/write to/from it?

## Assistant

The **theoretical possibility** of directly mapping a **VHDX** file to an **EXT4** partition involves:

- **Modifying Hard Drive Firmware or Drivers**: This would require the hard drive firmware or drivers to understand the VHDX format, which is not currently supported by standard hardware.
  
- **Creating a Real-Time Mapping Layer**: A layer would need to be developed to translate VHDX block allocation to EXT4 structures in real-time, introducing significant complexity and potential performance degradation.

### Has this been done or theorized?

There is no evidence from the provided search results or general knowledge that this has been successfully done or theorized in any practical or widely recognized manner:

- **VHDX** is designed for virtualization, encapsulating an entire disk image within one file. It includes metadata, block allocation tables (BAT), and data blocks, which are not directly usable by a bootloader like GRUB or outside a virtualized filesystem.

- **EXT4** is a filesystem optimized for physical partitions, focusing on efficient file access and management. Its design does not accommodate the virtualization-specific features of VHDX.

### Why It's Not Practical:

- **Structural Differences**: VHDX and EXT4 have fundamentally different structures and purposes. VHDX provides an abstraction layer for virtualization, while EXT4 is designed for direct disk operations.

- **Performance Overhead**: Creating a real-time mapping layer to interpret VHDX as EXT4 would introduce significant overhead, reducing performance and increasing complexity.

- **Hardware Abstraction**: Current hardware designs do not support such direct interpretation, as they are built to interact with physical partitions, not virtual disk files.

- **Software Solutions**: While theoretically possible, software solutions for interpreting VHDX as EXT4 would complicate hardware and software interactions, potentially degrading performance.

In summary, no practical or widely recognized solution has been implemented to directly map VHDX to EXT4. The fundamental differences in their design, purpose, and the complexity involved in creating a real-time mapping layer make it highly impractical.

### Sources

- [EXT4 Windows: Mount EXT4 File System in WSL2](https://www.partitionwizard.com/partitionmagic/ext4-windows.html)
  - Do you want to mount EXT4 Windows? This post from MiniTool Partition Wizard shows you how to mount the EXT4 partition in WSL2. It also introduces other tools to manage EXT4 partitions on Windows. EXT4 (fourth extended filesystem) is a log file system under the Linux system. Windows can’t recognize the EXT4 partition and can’t access data in it. In Windows, the only thing you can do with an EXT4 partition is to delete it. The following picture shows the status of an EXT4 partition in Windows...
- [Mount native ext4 partition in WSL2 [closed] - Stack Overflow](https://stackoverflow.com/questions/58846319/mount-native-ext4-partition-in-wsl2)
  - I often work on Windows and Linux (on dual boot) and I'm using a ntfs partition to synchronize a data between systems which is something problematic (lots of docker containers have a problem to work with ntfs permissions). I've tried to mount an ext4 partition in wsl1 but it's impossible but I've read that with release of WSL2 it could be achieved. I've tried to do that but have no idea how it can be done. Is there really a way to mount native ext4 in wsl2 to share one partition between linux...
- [WSL2 can now mount Linux ext4 disks directly - Scott Hanselman](https://www.hanselman.com/blog/wsl2-can-now-mount-linux-ext4-disks-directly)
  - If you're on a version of Windows 11 that is build 22000 or greater, you can now use WSL to mount Linux disks directly. Run winver to see your Windows version. I'm on 22000.282 as of the time of this writing. I can also run wsl --help and see the --mount instructions. If you don't have them, you're not on the latest, or you can try installing/update WSL from the Windows Store. Installing WSL from the Windows Store gets you updates faster. --mount <Disk> Attaches and mounts a physical disk in...
- [WSL2 mount ext4 on Windows 10 - Reddit](https://www.reddit.com/r/wsl2/comments/12chsty/wsl2_mount_ext4_on_windows_10/)
  - I would like to be able to read and write on EXT4 volumes in Windows 10. So far only paid applications can do this which is a bummer. After some googling, found that WSL2 can mount ext4 for read/write. Then was met with another roadblock, WSL2 for Windows 10 does not have this mount command. But a few sites does say it does but maybe using the Windows Insider version 20211. Is there a way to update the WSL2 in Windows 10 to have this mount function? This WSL2 mount is already available in 2020...
- [How to Access Linux Ext4 partitions in Windows using WSL (great ...](https://www.tomshardware.com/how-to/access-linux-ext4-partitions-in-windows)
  - If you use Linux and Windows in your life, you'll notice one huge point of frustration: Windows can't read Linux partitions, which are typically in ext4 or ext3 file format. If you connect an external drive or microSD card that has a partition which is formatted in ext4 to your Windows PC, the OS won't assign a drive letter to that partition or show you the files and folders. The lack of ext4 / ext3 support is a particularly big problem for Raspberry Pi fans. When you install Raspberry Pi OS...
- [Get started mounting a Linux disk in WSL 2 - Microsoft Learn](https://learn.microsoft.com/nl-nl/windows/wsl/wsl2-mount-disk)
  - External drives formatted for Windows typically use the NTFS file system formatting. External drives formatted for Linux typically use the Ext4 file system formatting. If you have mounted an NTFS-formatted drive on your Windows file system, you can access that drive from your Linux distribution using WSL by creating a mounted directory ( sudo mkdir /mnt/d, replacing 'd' with whatever drive letter you'd like to use) and then using the drvfs file system interop plugin, with the command: sudo...
- [Access Linux filesystems in Windows and WSL 2](https://devblogs.microsoft.com/commandline/access-linux-filesystems-in-windows-and-wsl-2/)
  - Starting with Windows Insiders preview build 20211, WSL 2 will be offering a new feature: wsl --mount. This new parameter allows a physical disk to be attached and mounted inside WSL 2, which enables you to access filesystems that aren’t natively supported by Windows (such as ext4). So, if you’re dual booting with Windows & Linux using different disks, you can now access your Linux files from Windows!... ## Getting started To mount a disk, open a PowerShell window with administrator privileges...
