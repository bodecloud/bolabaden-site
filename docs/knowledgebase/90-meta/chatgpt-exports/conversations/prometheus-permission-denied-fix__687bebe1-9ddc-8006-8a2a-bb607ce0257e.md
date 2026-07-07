---
source_url: "https://chatgpt.com/c/687bebe1-9ddc-8006-8a2a-bb607ce0257e"
conversation_id: "687bebe1-9ddc-8006-8a2a-bb607ce0257e"
title: "Prometheus permission denied fix"
extracted_at: "2026-06-29T14:12:44.541Z"
message_count: 2
provenance: auth-ui
---

# Prometheus permission denied fix

Source: [ChatGPT conversation](https://chatgpt.com/c/687bebe1-9ddc-8006-8a2a-bb607ce0257e)

## User

how to fix this prometheus error?

queries.active err="open /prometheus/queries.active: permission denied"
panic: Unable to create mmap-ed active query log

goroutine 1 [running]:
github.com/prometheus/prometheus/promql.NewActiveQueryTracker({0xffffe56a8f04, 0xb}, 0x14, 0x4000077020)
        /app/promql/query_logger.go:145 +0x260
main.main()
        /app/cmd/prometheus/main.go:854 +0x7354
time=2025-07-19T18:47:03.548Z level=INFO source=main.go:1544 msg="updated GOGC" old=100 new=75
time=2025-07-19T18:47:03.548Z level=INFO source=main.go:676 msg="Leaving GOMAXPROCS=4: CPU quota undefined" component=automaxprocs
time=2025-07-19T18:47:03.549Z level=INFO source=memlimit.go:198 msg="GOMEMLIMIT is updated" component=automemlimit package=github.com/KimMachineGun/automemlimit/memlimit GOMEMLIMIT=22630809600 previous=9223372036854775807
time=2025-07-19T18:47:03.549Z level=INFO source=main.go:718 msg="No time or size retention was set so using the default time retention" duration=15d
time=2025-07-19T18:47:03.549Z level=INFO source=main.go:769 msg="Starting Prometheus Server" mode=server version="(version=3.5.0, branch=HEAD, revision=8be3a9560fbdd18a94dedec4b747c35178177202)"
time=2025-07-19T18:47:03.549Z level=INFO source=main.go:774 msg="operational information" build_context="(go=go1.24.5, platform=linux/arm64, user=root@4451b64cb451, date=20250714-16:18:17, tags=netgo,builtinassets)" host_details="(Linux 6.8.0-1028-oracle #29-Ubuntu SMP Fri Jun 20 19:15:50 UTC 2025 aarch64 prometheus (none))" fd_limits="(soft=1048576, hard=1048576)" vm_limits="(soft=unlimited, hard=unlimited)"
time=2025-07-19T18:47:03.550Z level=ERROR source=query_logger.go:113 msg="Error opening query log file" component=activeQueryTracker file=/prometheus/queries.active err="open /prometheus/queries.active: permission denied"
panic: Unable to create mmap-ed active query log

goroutine 1 [running]:
github.com/prometheus/prometheus/promql.NewActiveQueryTracker({0xffffdd335f04, 0xb}, 0x14, 0x40000772a0)
        /app/promql/query_logger.go:145 +0x260
main.main()
        /app/cmd/prometheus/main.go:854 +0x7354
time=2025-07-19T18:48:03.771Z level=INFO source=main.go:1544 msg="updated GOGC" old=100 new=75
time=2025-07-19T18:48:03.771Z level=INFO source=main.go:676 msg="Leaving GOMAXPROCS=4: CPU quota undefined" component=automaxprocs
time=2025-07-19T18:48:03.772Z level=INFO source=memlimit.go:198 msg="GOMEMLIMIT is updated" component=automemlimit package=github.com/KimMachineGun/automemlimit/memlimit GOMEMLIMIT=22630809600 previous=9223372036854775807
time=2025-07-19T18:48:03.772Z level=INFO source=main.go:718 msg="No time or size retention was set so using the default time retention" duration=15d
time=2025-07-19T18:48:03.772Z level=INFO source=main.go:769 msg="Starting Prometheus Server" mode=server version="(version=3.5.0, branch=HEAD, revision=8be3a9560fbdd18a94dedec4b747c35178177202)"
time=2025-07-19T18:48:03.772Z level=INFO source=main.go:774 msg="operational information" build_context="(go=go1.24.5, platform=linux/arm64, user=root@4451b64cb451, date=20250714-16:18:17, tags=netgo,builtinassets)" host_details="(Linux 6.8.0-1028-oracle #29-Ubuntu SMP Fri Jun 20 19:15:50 UTC 2025 aarch64 prometheus (none))" fd_limits="(soft=1048576, hard=1048576)" vm_limits="(soft=unlimited, hard=unlimited)"
time=2025-07-19T18:48:03.773Z level=ERROR source=query_logger.go:113 msg="Error opening query log file" component=activeQueryTracker file=/prometheus/queries.active err="open /prometheus/queries.active: permission denied"
panic: Unable to create mmap-ed active query log

goroutine 1 [running]:
github.com/prometheus/prometheus/promql.NewActiveQueryTracker({0xffffea667f04, 0xb}, 0x14, 0x4000802de0)
        /app/promql/query_logger.go:145 +0x260
main.main()
        /app/cmd/prometheus/main.go:854 +0x7354
time=2025-07-19T18:49:03.988Z level=INFO source=main.go:1544 msg="updated GOGC" old=100 new=75
time=2025-07-19T18:49:03.988Z level=INFO source=main.go:676 msg="Leaving GOMAXPROCS=4: CPU quota undefined" component=automaxprocs
time=2025-07-19T18:49:03.989Z level=INFO source=memlimit.go:198 msg="GOMEMLIMIT is updated" component=automemlimit package=github.com/KimMachineGun/automemlimit/memlimit GOMEMLIMIT=22630809600 previous=9223372036854775807
time=2025-07-19T18:49:03.989Z level=INFO source=main.go:718 msg="No time or size retention was set so using the default time retention" duration=15d
time=2025-07-19T18:49:03.989Z level=INFO source=main.go:769 msg="Starting Prometheus Server" mode=server version="(version=3.5.0, branch=HEAD, revision=8be3a9560fbdd18a94dedec4b747c35178177202)"
time=2025-07-19T18:49:03.989Z level=INFO source=main.go:774 msg="operational information" build_context="(go=go1.24.5, platform=linux/arm64, user=root@4451b64cb451, date=20250714-16:18:17, tags=netgo,builtinassets)" host_details="(Linux 6.8.0-1028-oracle #29-Ubuntu SMP Fri Jun 20 19:15:50 UTC 2025 aarch64 prometheus (none))" fd_limits="(soft=1048576, hard=1048576)" vm_limits="(soft=unlimited, hard=unlimited)"
time=2025-07-19T18:49:03.990Z level=ERROR source=query_logger.go:113 msg="Error opening query log file" component=activeQueryTracker file=/prometheus/queries.active err="open /prometheus/queries.active: permission denied"
panic: Unable to create mmap-ed active query log

goroutine 1 [running]:
github.com/prometheus/prometheus/promql.NewActiveQueryTracker({0xffffd270ff04, 0xb}, 0x14, 0x4000122e00)
        /app/promql/query_logger.go:145 +0x260
main.main()
        /app/cmd/prometheus/main.go:854 +0x7354
time=2025-07-19T18:50:04.203Z level=INFO source=main.go:1544 msg="updated GOGC" old=100 new=75
time=2025-07-19T18:50:04.208Z level=INFO source=main.go:676 msg="Leaving GOMAXPROCS=4: CPU quota undefined" component=automaxprocs
time=2025-07-19T18:50:04.209Z level=INFO source=memlimit.go:198 msg="GOMEMLIMIT is updated" component=automemlimit package=github.com/KimMachineGun/automemlimit/memlimit GOMEMLIMIT=22630809600 previous=9223372036854775807
time=2025-07-19T18:50:04.209Z level=INFO source=main.go:718 msg="No time or size retention was set so using the default time retention" duration=15d
time=2025-07-19T18:50:04.209Z level=INFO source=main.go:769 msg="Starting Prometheus Server" mode=server version="(version=3.5.0, branch=HEAD, revision=8be3a9560fbdd18a94dedec4b747c35178177202)"
time=2025-07-19T18:50:04.209Z level=INFO source=main.go:774 msg="operational information" build_context="(go=go1.24.5, platform=linux/arm64, user=root@4451b64cb451, date=20250714-16:18:17, tags=netgo,builtinassets)" host_details="(Linux 6.8.0-1028-oracle #29-Ubuntu SMP Fri Jun 20 19:15:50 UTC 2025 aarch64 prometheus (none))" fd_limits="(soft=1048576, hard=1048576)" vm_limits="(soft=unlimited, hard=unlimited)"
time=2025-07-19T18:50:04.209Z level=ERROR source=query_logger.go:113 msg="Error opening query log file" component=activeQueryTracker file=/prometheus/queries.active err="open /prometheus/queries.active: permission denied"
panic: Unable to create mmap-ed active query log

goroutine 1 [running]:
github.com/prometheus/prometheus/promql.NewActiveQueryTracker({ *  Terminal will be reused by tasks, press any key to close it. 
Show more

## Assistant

The error you're seeing in Prometheus is related to permission issues when it tries to access or create the queries.active file. The file /prometheus/queries.active is being denied access because of insufficient permissions.

Steps to fix the issue:

Check File Permissions:

Make sure the Prometheus process has proper access rights to the directory and file. If the directory /prometheus and the file queries.active don't have the correct permissions, Prometheus won’t be able to create or access the file.

Bash
ls -l /prometheus/queries.active

Ensure that the user running Prometheus has both read and write permissions on the file and the directory it's trying to access.

You can update the permissions with the following command:

Bash
sudo chown prometheus:prometheus /prometheus /prometheus/queries.active
sudo chmod 755 /prometheus
sudo chmod 644 /prometheus/queries.active

Note: Replace prometheus:prometheus with the actual user and group running Prometheus, if they are different.

Check Directory Permissions:

Ensure that the directory /prometheus has the correct permissions and that Prometheus can write to it. You can do this by checking the directory permissions as well:

Bash
sudo chmod 755 /prometheus

Running as Root:

If Prometheus is being run as a non-root user (which is typical), ensure that the user has the correct permissions. Prometheus should not ideally run as root, but it needs access to its log files. If you are running Prometheus as a containerized application, make sure the volume mounting is done correctly with appropriate permissions.

Volume Mounting Issues (If Running in Docker/Kubernetes):

If you're running Prometheus in a container (like Docker or Kubernetes), you might need to check the volume mount and permissions on the host machine. For example, if you're using Docker, make sure the directory is mounted correctly and accessible to the container:

Bash
docker run -v /path/on/host:/prometheus prom/prometheus

Make sure /path/on/host has the correct permissions for the Prometheus container.

Log File Location Configuration:

If the queries.active log file is not essential or you want to store it in a different location, you can configure Prometheus to use a different path for its query log file by modifying the configuration file (prometheus.yml) or using command-line flags.

You can set the --query-log-file flag when starting Prometheus, specifying a writable location for the file. For example:

Bash
prometheus --query-log-file=/new/path/to/queries.active

Rebuild the Environment:

If the issue persists, you may need to remove the current file or reset the environment. Sometimes, leftover files can cause issues.

Bash
rm -f /prometheus/queries.active

Then restart Prometheus to recreate the file.

Summary:

The issue seems to be file permission-related. Ensure that the user running Prometheus has read and write access to /prometheus and the queries.active file.

Verify the permissions and adjust them if necessary.

If running in a containerized environment, ensure that the volume mounts and permissions are correctly set up.

Try these steps and see if it resolves the issue! Let me know how it goes.
