---
source_url: "https://grok.com/c/2a1f42d5-1858-4ec0-9b59-0175755b1b06"
conversation_id: "2a1f42d5-1858-4ec0-9b59-0175755b1b06"
title: "Logrotate Traefik Configuration Analysis"
extracted_at: "2026-06-29T16:24:38.819Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Logrotate Traefik Configuration Analysis

Source: [Grok conversation](https://grok.com/c/2a1f42d5-1858-4ec0-9b59-0175755b1b06)

## User

_Time: 2025-08-24T03:51:25.871Z_

```

  logrotate:
    # 🔹🔹 Logrotate for Traefik logs 🔹🔹
    image: docker.io/alpine:latest
    container_name: logrotate-traefik
    hostname: logrotate-traefik
    networks:
      - coolify
    user: root:root
    volumes:
      - /data/coolify/proxy/logs:/var/log/traefik
    environment:
      TZ: ${TZ:-America/Chicago}
    command: |
      sh -c '
      apk add --no-cache logrotate findutils &&
      mkdir -p /etc/logrotate.d &&
      cat > /etc/logrotate.d/traefik << "EOF"
      /var/log/traefik/*.log {
          hourly
          size 1M
          rotate 20
          compress
          delaycompress
          missingok
          notifempty
          create 644 root root
          copytruncate
          postrotate
              # Clean up old files if directory exceeds 50MB
              TOTAL_SIZE=$$(du -sm /var/log/traefik | cut -f1)
              if [ $$TOTAL_SIZE -gt 50 ]; then
                  find /var/log/traefik -name "*.gz" -type f -printf "%T@ %p\n" | sort -n | head -n -10 | cut -d" " -f2- | xargs rm -f
              fi
          endscript
      }
      EOF
      
      # Start logrotate in background
      (
        while true; do
          logrotate -f /etc/logrotate.d/traefik
          sleep 3600
        done
      ) &
      
      # Wait for traefik.log to exist, then tail it
      echo "Waiting for traefik.log to be created..."
      while [ ! -f /var/log/traefik/traefik.log ]; do
        sleep 5
      done
      
      echo "Starting to tail traefik.log in human-readable format..."
      echo "Format: Time | Client | Method Path | Host | Status | Duration | Service"
      echo "=================================================================================="
      
      tail -f /var/log/traefik/traefik.log | while read -r line; do
        if [ -n "$line" ]; then
          # Parse JSON using basic shell tools
          time=$(echo "$line" | sed -n "s/.*\"time\":\"\([^\"]*\)\".*/\1/p")
          client=$(echo "$line" | sed -n "s/.*\"ClientAddr\":\"\([^\"]*\)\".*/\1/p")
          method=$(echo "$line" | sed -n "s/.*\"RequestMethod\":\"\([^\"]*\)\".*/\1/p")
          path=$(echo "$line" | sed -n "s/.*\"RequestPath\":\"\([^\"]*\)\".*/\1/p")
          host=$(echo "$line" | sed -n "s/.*\"RequestHost\":\"\([^\"]*\)\".*/\1/p")
          status=$(echo "$line" | sed -n "s/.*\"DownstreamStatus\":\([0-9]*\).*/\1/p")
          duration=$(echo "$line" | sed -n "s/.*\"Duration\":\([0-9]*\).*/\1/p")
          service=$(echo "$line" | sed -n "s/.*\"ServiceName\":\"\([^\"]*\)\".*/\1/p")
          
          # Convert duration from nanoseconds to milliseconds
          if [ -n "$duration" ] && [ "$duration" -gt 0 ]; then
            duration_ms=$((duration / 1000000))
          else
            duration_ms="0"
          fi
          
          # Format and display
          printf "%-19s | %-21s | %-4s %-20s | %-25s | %-3s | %-8s ms | %s\n" \
            "${time:-?}" \
            "${client:-?}" \
            "${method:-?}" \
            "${path:-?}" \
            "${host:-?}" \
            "${status:-?}" \
            "${duration_ms}" \
            "${service:-?}"
        fi
      done
      '
    deploy:
      resources:
        reservations:
          cpus: 0.01
          memory: 8M
        limits:
          cpus: 0.1
          memory: 64M
    restart: always
 
```

 
all i see is this:

```
ubuntu@beatapostapita:~/my-media-stack$ docker container logs logrotate-traefik -f fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/main/aarch64/APKINDEX.tar.gz fetch https://dl-cdn.alpinelinux.org/alpine/v3.22/community/aarch64/APKINDEX.tar.gz (1/4) Installing findutils (4.10.0-r0) (2/4) Installing acl-libs (2.3.2-r1) (3/4) Installing popt (1.19-r4) (4/4) Installing logrotate (3.21.0-r1) Executing busybox-1.37.0-r18.trigger OK: 8 MiB in 20 packages Waiting for traefik.log to be created... Starting to tail traefik.log in human-readable format... Format: Time | Client | Method Path | Host | Status | Duration | Service ================================================================================== 
```

 
implying that it can't find the traefik.log file despite it existing? it does seem to be rotating it though which is the weird thing:
 

```
ubuntu@beatapostapita:~/my-media-stack$ sudo ls -al /data/coolify/proxy/logs total 296 drwxr-xr-x 2 root root   4096 Aug 23 22:47 . drwx------ 9 9999 root   4096 Aug 23 21:16 .. -rw-r--r-- 1 root root   7622 Aug 23 22:47 traefik.log -rw-r--r-- 1 root root 129542 Aug 23 22:47 traefik.log.1 -rw-r--r-- 1 root root   6620 Aug 23 22:41 traefik.log.2.gz -rw-r--r-- 1 root root 146253 Aug 23 22:37 traefik.log.3.gz
```

## Assistant

_Time: 2025-08-24T03:54:07.941Z_

The provided Docker Compose configuration for the `logrotate-traefik` container implements log rotation for Traefik access logs and includes a mechanism to tail and parse the `traefik.log` file in a formatted, human-readable manner. Based on the container logs and the directory listing, the script executes as intended up to the point of initiating the tail process. The message "Waiting for traefik.log to be created..." is followed by "Starting to tail traefik.log in human-readable format..." and the format header, confirming that the file is detected and the tail command begins successfully.

The absence of parsed log entries after the header indicates that no new log lines have been appended to `/var/log/traefik/traefik.log` (mounted from `/data/coolify/proxy/logs/traefik.log`) since the `tail -f` command started. The `tail -f` utility monitors the file from its current end and only outputs subsequent additions; it does not display historical content already present in the file. If no new HTTP requests have been handled by Traefik since this point, no additional output will appear.

The log rotation component functions correctly, as demonstrated by the presence of rotated files (`traefik.log.1`, `traefik.log.2.gz`, etc.) and the enforcement of size and retention policies. The hourly forced rotation (via `logrotate -f`) ensures files are managed even during periods of low activity.

To confirm the tailing and parsing functionality:
- Generate a new request to a service routed through Traefik.
- Monitor the container output with `docker container logs logrotate-traefik -f` to observe if a parsed entry appears in the specified format.

If the intent is to display both historical and real-time logs, the script could be adjusted to prepend `cat /var/log/traefik/traefik.log | while read -r line; do ... done` before the `tail -f` loop, though this may lead to redundant output during rotations due to the `copytruncate` option.

Should the Traefik access logs not be in the expected JSON format (e.g., if configured for Common Log Format instead), the parsing may yield incomplete results, but this would manifest as lines with placeholder "?" values rather than no output. Verify the Traefik configuration to ensure access logs are set to JSON format if parsing issues arise.

## User

_Time: 2025-08-24T04:03:51.469Z_

```
it does not display historical content already present in the file. If no new HTTP requests have been handled by Traefik since this point, no additional output will appear.
```

how to make it do so for existing lines, so that when i actually start the container it'll still show the output of the existing lines

## Assistant

_Time: 2025-08-24T04:04:07.767Z_

To achieve the desired behavior of displaying both the existing content in `/var/log/traefik/traefik.log` and any subsequent new lines upon container startup, modify the tailing command within the script. Currently, `tail -f` begins monitoring from the end of the file, outputting only additions made after it starts. To include historical content, adjust it to output from the beginning of the file and then continue following.

Replace the line:
```
tail -f /var/log/traefik/traefik.log | while read -r line; do
```
with:
```
tail -n +1 -f /var/log/traefik/traefik.log | while read -r line; do
```

### Explanation:
- The `-n +1` flag instructs `tail` to start outputting from line 1 of the file (effectively dumping the entire existing content first).
- The `-f` flag ensures it continues to follow the file for new appendages.
- This is equivalent to `(cat /var/log/traefik/traefik.log && tail -f /var/log/traefik/traefik.log)`, but more concise and efficient.
- The waiting loop (`while [ ! -f /var/log/traefik/traefik.log ]; do sleep 5; done`) remains unchanged, ensuring the file exists before tailing begins.
- Upon rotation (via `copytruncate`), `tail -f` will handle the truncation gracefully by continuing to follow the file descriptor, though any lines added during the brief rotation window might appear after the historical dump.

Apply this change to the `command` section in your Docker Compose configuration for the `logrotate-traefik` service. Restart the container after the update to observe the full output, including existing lines parsed in the specified human-readable format. If the file is very large, consider potential performance implications, such as increased startup time or memory usage during initial processing.
