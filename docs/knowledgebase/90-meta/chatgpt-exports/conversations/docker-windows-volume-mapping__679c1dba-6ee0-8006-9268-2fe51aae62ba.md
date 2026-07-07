---
source_url: "https://chatgpt.com/c/679c1dba-6ee0-8006-9268-2fe51aae62ba"
conversation_id: "679c1dba-6ee0-8006-9268-2fe51aae62ba"
title: "Docker Windows Volume Mapping"
extracted_at: "2026-06-29T15:30:35.485Z"
message_count: 5
provenance: auth-ui
---

# Docker Windows Volume Mapping

Source: [ChatGPT conversation](https://chatgpt.com/c/679c1dba-6ee0-8006-9268-2fe51aae62ba)

## Assistant

The command -v /mnt/user/Media:/data is a Docker volume mount directive, which maps a directory from the host (left side) to a directory inside the container (right side). Here’s a breakdown:

Syntax Breakdown:
-v <host-path>:<container-path>

/mnt/user/Media → This is the host path (the directory on your computer).

/data → This is the container path (where the files will be available inside the running container).

Why Does /mnt/user/Media Look Like a Linux Path?

This format is typically seen on Linux-based systems (including NAS devices running Unraid, which use /mnt/user/Media as a common media directory).

On Windows, Docker (especially in WSL 2 mode) translates Windows paths into Linux-style paths inside its virtualized environment.

How Does This Work on Windows?

If you're running Docker on Windows 10 (with WSL 2 backend), you need to translate the Windows path correctly when using -v.

For Windows Native Docker (Without WSL)

If you're using Docker Desktop (non-WSL mode) on Windows, you should use Windows-style paths, such as:

PowerShell
-v "I:/JellyFin:/data"

Make sure drive I: is shared in Docker Desktop settings under Resources → File Sharing.

For WSL 2 Docker Backend

If you're using WSL 2, Docker mounts Windows drives under:

/mnt/host/<drive-letter>/

So your I:/JellyFin directory should be mounted as:

PowerShell
-v "/mnt/host/i/JellyFin:/data"

or

PowerShell
-v "//i/JellyFin:/data"

(Ensure proper WSL permissions and sharing settings in Docker Desktop.)

TL;DR

/mnt/user/Media:/data is a Linux-style path mapping.

On Windows, you need to use I:/JellyFin:/data or //i/JellyFin:/data.

If using WSL 2, Windows drives are mounted under /mnt/host/.

Let me know what setup you are using (WSL or native Windows Docker), and I can tailor the solution better! 🚀

## User

where are plex media server's logs on windows?

## Assistant

On Windows, Plex Media Server stores its log files in the following directory:

%LOCALAPPDATA%\Plex Media Server\Logs

To access this location:

Open File Explorer: Press Win + E.

Navigate to the Address Bar: Click on the address bar at the top.

Enter the Path: Type %LOCALAPPDATA%\Plex Media Server\Logs and press Enter.

This will direct you to the folder containing Plex's log files, such as Plex Media Server.log. These logs are valuable for troubleshooting and understanding server activities. 
support.plex.tv

If you're running Plex Media Server within a Docker container on Windows, the log file location may differ based on how you've configured your Docker setup. Typically, you can access the logs by:

Inspecting Docker Volumes: If you've mapped the Plex configuration directory to a host directory using the -v flag (e.g., -v I:/PlexConfig:/config), the logs would be located in I:/PlexConfig/Library/Application Support/Plex Media Server/Logs.

Accessing the Container Directly:

Open a Command Prompt: Press Win + R, type cmd, and press Enter.

List Running Containers: Run docker ps to find your Plex container's ID or name.

Access the Container's Shell: Execute docker exec -it <container_name_or_id> /bin/bash.

Navigate to the Logs Directory: Within the container, go to /config/Library/Application Support/Plex Media Server/Logs to view the log files.

Adjust the paths according to your specific Docker volume mappings and configurations.

## User

Jan 30, 2025 19:23:31.128 [35324] INFO - Plex Media Server v1.41.3.9314-a0bfb8370 - ASUS System Product Name x64-x64 - build: windows-x86_64 windows - GMT -06:00
Jan 30, 2025 19:23:31.128 [35324] INFO - Windows version: 10.0 (Build 19045), language en-US
Jan 30, 2025 19:23:31.128 [35324] INFO - 12 3696 MHz processor(s): Architecture=9, Level=6, Revision=40458 Processor Identifier=Intel64 Family 6 Model 158 Stepping 10, GenuineIntel
Jan 30, 2025 19:23:31.128 [35324] INFO - Compiler is - MSVC 1929
Jan 30, 2025 19:23:31.128 [35324] DEBUG - "C:\Program Files\Plex\Plex Media Server\Plex Media Server.exe" 
Jan 30, 2025 19:23:31.141 [49768] DEBUG - Plex for Windows Store application is not installed
Jan 30, 2025 19:23:31.142 [49768] DEBUG - BPQ: [Idle] -> [Starting]
Jan 30, 2025 19:23:31.143 [49768] DEBUG - FeatureManager: Using cached data for features list
Jan 30, 2025 19:23:31.146 [49768] DEBUG - MyPlex: mapping state set to 'Unknown'.
Jan 30, 2025 19:23:31.146 [49768] DEBUG - Relay: read 2 cached entries from hosts file
Jan 30, 2025 19:23:31.147 [49768] DEBUG - Opening 20 database sessions to library (com.plexapp.plugins.library), SQLite 3.39.4, threadsafe=1
Jan 30, 2025 19:23:31.149 [49768] INFO - SQLITE3:0x2, 283, recovered 210 frames from WAL file C:\Users\boden\AppData\Local\Plex Media Server\Plug-in Support\Databases\com.plexapp.plugins.library.db-wal
Jan 30, 2025 19:23:31.187 [49768] DEBUG - MyPlex: using cached data for request for https://plex.tv/api/v2/server/users/features
Jan 30, 2025 19:23:31.459 [49768] DEBUG - [CERT] Subject name is /CN=*.af5de900130443fbbe0e6ae0cbf87934.plex.direct
Jan 30, 2025 19:23:31.459 [49768] DEBUG - [CERT] Installed certificate with fingerprint 44:7e:61:50:b9:03:5c:8f:48:d7:1e:cd:73:f1:10:66:25:60:71:9d.
Jan 30, 2025 19:23:31.459 [49768] DEBUG - [CERT/OCSP] Stapling requests will be made to 'http://r11.o.lencr.org/'.
Jan 30, 2025 19:23:31.460 [49768] INFO - [CERT/OCSP] Successfully retrieved response from cache.
Jan 30, 2025 19:23:31.460 [49768] DEBUG - HttpServer: Listening on IPv6 as well as IPv4.
Jan 30, 2025 19:23:31.460 [49768] ERROR - HttpServer: Error binding acceptor: An attempt was made to access a socket in a way forbidden by its access permissions
Jan 30, 2025 19:23:31.460 [49768] ERROR - HttpServer: Error opening acceptor on IPv6, falling back to IPv4: An attempt was made to access a socket in a way forbidden by its access permissions
Jan 30, 2025 19:23:31.460 [49768] ERROR - HttpServer: Error binding acceptor: An attempt was made to access a socket in a way forbidden by its access permissions
Jan 30, 2025 19:23:31.622 [59948] DEBUG - [JobRunner] Job running: "C:\Program Files\Plex\Plex Media Server\CrashUploader.exe" "--directory=C:\Users\boden\AppData\Local\Plex Media Server\Crash Reports\1.41.3.9314-a0bfb8370" --version=1.41.3.9314-a0bfb8370 --platform=Windows "--platformVersion=10.0 (Build 19045)" --serverUuid=ea387404b0114bb0ca9998e219350751b55dbfdd --userId=boden.crouch@gmail.com --sentryUrl=https://o17675.ingest.sentry.io/api/1233455/ --sentryKey=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx --vendor=ASUS --model=x64-x64 "--device=System Product Name" --sessionStatus=crashed --sessionStart=1738286611 --sessionDuration=0
Jan 30, 2025 19:23:31.624 [59948] DEBUG - [JobRunner] Jobs: Starting child process with pid 34484

How to fix the above?
Show more

## Assistant

The errors in your Plex Media Server log suggest that Plex is unable to bind to network ports due to permission restrictions. The key error messages are:

ERROR - HttpServer: Error binding acceptor: An attempt was made to access a socket in a way forbidden by its access permissions

This usually happens due to one of the following reasons:

Another application is using the same port (32400 by default for Plex).

Windows Defender Firewall or another security software is blocking Plex.

Plex is running without administrative privileges.

Network binding issues related to IPv6.

Docker-related conflicts (if running Plex inside Docker on Windows).

🔧 Solutions to Fix This Issue
✅ 1. Check if Another Application is Using the Port

Plex needs port 32400. To check if another process is using it:

Open Command Prompt as Administrator.

Run the following command:

PowerShell
netstat -ano | findstr :32400

If you see output like this:

TCP    0.0.0.0:32400       0.0.0.0:0       LISTENING       12345

The last number (12345) is the PID (Process ID).

Run:

PowerShell
tasklist | findstr 12345

This will tell you which application is using the port.

If Plex is not listed, another app is using the port. Consider stopping it or changing Plex's port.

✅ 2. Run Plex as Administrator

If Plex lacks permission to bind to the network socket:

Close Plex completely.

Right-click on Plex Media Server.exe (usually in C:\Program Files\Plex\Plex Media Server\).

Click Run as administrator.

If this fixes it, you can set Plex to always run as Administrator:

Right-click Plex Media Server.exe → Properties.

Go to Compatibility tab.

Check Run this program as administrator → Click OK.

✅ 3. Allow Plex Through Windows Firewall

Sometimes, Windows Firewall blocks Plex.

Open Windows Security.

Go to Firewall & network protection.

Click Allow an app through firewall.

Look for Plex Media Server.

If it's not there, click Allow another app... and browse to:

C:\Program Files\Plex\Plex Media Server\Plex Media Server.exe

Check both "Private" and "Public" networks.

Click OK and restart Plex.

✅ 4. Disable IPv6 (If Plex is Failing on IPv6)

The error "falling back to IPv4" suggests that IPv6 might be causing issues.

Open Control Panel → Network and Internet → Network and Sharing Center.

Click on Change adapter settings.

Right-click your active network (Wi-Fi or Ethernet) → Properties.

Uncheck "Internet Protocol Version 6 (TCP/IPv6)".

Click OK and restart your PC.

✅ 5. Restart Plex & Reinstall if Necessary

Restart Plex Media Server:

PowerShell
net stop "Plex Media Server"
net start "Plex Media Server"

If the issue persists, reinstall Plex:

Uninstall Plex via Apps & Features in Windows.

Download the latest Plex version from plex.tv
.

Install it fresh.

✅ 6. If Running in Docker, Ensure Proper Network Mode

If using Docker, ensure your Plex container is using the correct network mode and port mapping.

Try running Plex without --network=host and explicitly mapping the port:

PowerShell
docker run -d --name plex `
  -e PLEX_CLAIM="claim-Zx2ubuxX1wbe6mSB5kqh" `
  -p 32400:32400 `
  -v "I:/JellyFin:/data" `
  plexinc/pms-docker
🔍 Final Checks

If you see CrashUploader.exe running, it means Plex crashed. Checking the Windows Event Viewer (eventvwr.msc) for Plex errors can help.

You can also check C:\Users\YourUser\AppData\Local\Plex Media Server\Logs for more detailed logs.

🚀 TL;DR:

Check if another app is using port 32400 → netstat -ano | findstr :32400

Run Plex as Administrator.

Allow Plex through Windows Firewall.

Disable IPv6 if necessary.

Restart Plex & reinstall if needed.

If using Docker, ensure ports are mapped correctly.

Try these steps and let me know what works for you! 🚀
