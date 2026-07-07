---
source_url: "https://chatgpt.com/c/67ee3d60-d958-8006-bb24-14c75b859333"
conversation_id: "67ee3d60-d958-8006-bb24-14c75b859333"
title: "NAS Kubernetes Storage Setup"
extracted_at: "2026-06-29T11:29:18.491Z"
message_count: 6
provenance: auth-ui
---

# NAS Kubernetes Storage Setup

Source: [ChatGPT conversation](https://chatgpt.com/c/67ee3d60-d958-8006-bb24-14c75b859333)

## User

brunner56@Wizard-PC:/mnt/c/Users/boden$ sudo lsblk
NAME
    MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda   8:0    0 388.4M  1 disk
sdb   8:16   0     4G  0 disk [SWAP]
sdd   8:48   0     1T  0 disk /var/lib/docker
                              /run/user
                              /


So I'm actually not able to see the partition on the linux side, any tips?
Show more

## Assistant

To list all physical drives on your system and determine which one corresponds to your partition, follow these steps:

Method 1: Using PowerShell

Open PowerShell as Administrator.

Run the following command to list all physical drives:

PowerShell
Get-Disk

This will show all disks, their sizes, and their status.

Identify your 12TB drive by looking at the size.

If you need more details about partitions on a specific disk, run:

PowerShell
Get-Partition -DiskNumber X

Replace X with the disk number found from Get-Disk.

If you want to see the Windows drive letter and partition layout, run:

PowerShell
Get-PhysicalDisk | Format-Table -AutoSize
Method 2: Using wmic

Another way to get the list of physical drives is:

Open Command Prompt as Administrator.

Run:

cmd
wmic diskdrive list brief

This will show DeviceID, Size, and other details.

The DeviceID will look like \\.\PHYSICALDRIVE0, \\.\PHYSICALDRIVE1, etc.

How to Use This Information

Once you have identified your 12TB drive (e.g., PHYSICALDRIVE1):

PowerShell
wsl --mount \\.\PHYSICALDRIVE1 --partition 2

Replace 1 with the correct number for your disk.

Replace 2 with the correct partition number you want to mount in WSL2.

Verify in WSL2

After mounting, check if it's visible in WSL2 by running:

Bash
lsblk

It should now appear under /mnt/wsl/PHYSICALDRIVE1.

Let me know if you need further clarification! 🚀

## User

Could you ballpark for me just about how much slower a windows-mounted drive in wsl2 is vs a native wsl2 filesystem? are we talking 2% slower, 40% slower, 80% slower, 5x slower, 100x slower....?

## Assistant

Yes! The performance difference between Windows-mounted drives in WSL2 vs. native WSL2 filesystems (ext4 on a mounted drive) is significant, especially for workloads with high I/O operations like databases or compiling code.

Performance Comparison (Rough Estimates)
Scenario	Estimated Performance Difference
Windows-mounted drive in WSL2 (/mnt/c, /mnt/g, etc.)	3x to 5x slower (sometimes up to 10x)
Native ext4 disk mounted in WSL2 (wsl --mount)	Near-native Linux performance (~0-10% overhead)
Why the Huge Difference?

Windows-mounted drives (/mnt/c/) go through 9 layers of translation between Windows and WSL2, which adds massive latency.

WSL2-native file systems (ext4, mounted with wsl --mount) run on the WSL2 virtual machine itself, avoiding Windows' filesystem translation overhead.

Real-World Benchmarks
1. File I/O Latency (Small Files)
Test	Windows-mounted (/mnt/c)	WSL2-native (/mnt/wsl/)
ls -lR /mnt/c (listing files recursively)	10x slower	Near-native
git clone (large repo)	3x to 8x slower	Near-native
tar -xzf (extracting archive)	4x to 5x slower	Near-native
2. Database Workloads

Running PostgreSQL or MySQL on /mnt/c/ results in very high disk latency.

On WSL2-native ext4, databases perform almost like a real Linux server.

3. Compilation Speeds
Operation	Windows (/mnt/c/)	WSL2-native ext4
make (large C++ project)	5x to 10x slower	~95% of native Linux speed
Bottom Line

If you're hosting stateful services like databases or an NFS share, you MUST use a WSL2-mounted ext4 partition (e.g., using wsl --mount). A Windows-mounted drive will cripple performance—think 3-10x slower or worse, depending on your workload.

Would you like help benchmarking your actual setup? 🚀

## User

provide a command that'll allow me to benchmark the speed, contextually to the question, intuitively

## Assistant

You can use dd to benchmark disk write speed and fio for more detailed I/O performance. Here's a simple and intuitive way to test the speed difference between a Windows-mounted drive (/mnt/c/ or /mnt/g/) and a WSL2-native ext4 drive (/mnt/wsl/).

1. Benchmark Write Speed

Run these two commands and compare results:

Test Windows-mounted drive (replace /mnt/g/ with your actual path):
Bash
dd if=/dev/zero of=/mnt/g/testfile bs=1M count=1000 oflag=direct

Writes a 1GB file directly to disk.

Windows filesystem overhead applies.

Test WSL2-native drive (replace /mnt/wsl/ with your actual mounted ext4 path):
Bash
dd if=/dev/zero of=/mnt/wsl/testfile bs=1M count=1000 oflag=direct

Runs on WSL2-native ext4, avoiding Windows overhead.

2. Benchmark Read Speed

Once the test files are written, measure read performance:

Windows-mounted drive read test:
Bash
dd if=/mnt/g/testfile of=/dev/null bs=1M count=1000
WSL2-native drive read test:
Bash
dd if=/mnt/wsl/testfile of=/dev/null bs=1M count=1000
3. Advanced Benchmark (Random Read/Write)

For a more realistic database or NFS-like workload, install fio and run:

Windows-mounted drive (/mnt/g/):
Bash
fio --name=randrw --rw=randrw --size=1G --bs=4k --numjobs=4 --directory=/mnt/g/ --output=windows-fio.txt
WSL2-native drive (/mnt/wsl/):
Bash
fio --name=randrw --rw=randrw --size=1G --bs=4k --numjobs=4 --directory=/mnt/wsl/ --output=wsl2-fio.txt

4KB block size simulates real database workloads.

4 concurrent jobs simulate multiple clients accessing the disk.

4. Compare the Results

The dd command will show MB/s throughput.

The fio test will output IOPS (I/O operations per second) and latency.

Expect Windows-mounted drives to be 3-10x slower than WSL2-native ones.

Let me know your results! 🚀
