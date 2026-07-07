---
source_url: "https://chatgpt.com/c/6899949e-0cd4-832a-ace6-d6f83c9e921d"
conversation_id: "6899949e-0cd4-832a-ace6-d6f83c9e921d"
title: "Docker logging configuration guide"
extracted_at: "2026-06-29T14:04:40.527Z"
message_count: 5
provenance: auth-ui
---

# Docker logging configuration guide

Source: [ChatGPT conversation](https://chatgpt.com/c/6899949e-0cd4-832a-ace6-d6f83c9e921d)

## Assistant

Perfect — let's build a full self-contained docker-compose.yaml solution that:

Runs your app container (myapp).

Runs a sidecar container that tails only that container's JSON log file.

Outputs logs to a host-mounted file with rotation (using logrotate inside the sidecar).

Handles rotation automatically inside the sidecar, so your logs don't grow infinitely.

Requires no external scripts or manual steps.

Full solution
YAML
version: "3.9"

services:
  myapp:
    image: myimage:latest
    container_name: myapp
    logging:
      driver: json-file
      options:
        max-size: "50m"
        max-file: "7"

  log-writer:
    image: alpine:latest
    container_name: log-writer
    depends_on:
      - myapp
    volumes:
      # Mount Docker container logs read-only
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      # Mount host directory for storing logs and config
      - ./logs:/logs
      # Mount host directory for logrotate state file
      - ./logrotate_state:/var/lib/logrotate
    entrypoint:
      - sh
      - -c
      - |
        # Find the container ID for 'myapp' by reading the symlink /var/lib/docker/containers/*/name
        CONTAINER_ID=$(find /var/lib/docker/containers -maxdepth 1 -mindepth 1 -type d -exec sh -c "test \"\$(cat {}/config.v2.json | grep -o '\"Name\":\"/myapp\"')\" && echo \$(basename {})" \; )
        if [ -z "$CONTAINER_ID" ]; then
          echo "Could not find container ID for myapp"
          exit 1
        fi
        LOGFILE="/var/lib/docker/containers/$CONTAINER_ID/$CONTAINER_ID-json.log"
        echo "Logging from $LOGFILE"

        # Create a logrotate config file for rotation of /logs/myapp.log
        cat > /etc/logrotate.conf <<EOF
/logs/myapp.log {
  size 50M
  rotate 7
  copytruncate
  missingok
  notifempty
  compress
  delaycompress
  create 0644 root root
}
EOF

        # Run tail + logrotate loop
        tail -F "$LOGFILE" >> /logs/myapp.log 2>&1 &

        # Loop logrotate every 10 minutes
        while true; do
          logrotate /etc/logrotate.conf
          sleep 600
        done
How it works:

myapp container uses the default json-file logging with rotation (50MB max, 7 files max).

log-writer container:

Mounts the docker logs folder read-only so it can read the real JSON log of myapp.

Dynamically discovers the myapp container ID by scanning config files under /var/lib/docker/containers.

Tails the exact myapp container's JSON log.

Writes the combined output to /logs/myapp.log on the host.

Runs logrotate on /logs/myapp.log every 10 minutes with rotation rules (50MB max size, 7 rotations).

Host directory ./logs will contain the continuously updated and rotated myapp.log files.

./logrotate_state keeps logrotate state info (make sure this directory exists on host).

Usage notes:

Run docker compose up -d in the folder with this file.

Check logs with tail -f ./logs/myapp.log.

The log file will be rotated by the sidecar container automatically, no host config needed.

Make sure the host user running Docker Compose has write permission to ./logs and ./logrotate_state.

The sidecar assumes default Docker paths (/var/lib/docker/containers). If your Docker daemon uses a custom location, adjust volumes accordingly.

If you want, I can help you polish this more (e.g. nicer container names, volumes, env vars), but this is the minimal, fully self-contained solution inside docker-compose.yaml for dynamic discovery + logging + rotation to a file you choose.

How does that look? Want me to generate it as a ready-to-run file for you?

## User

CONTAINER_ID=$(find /var/lib/docker/containers -maxdepth 1 -mindepth 1 -type d -exec sh -c "test \"\$(cat {}/config.v2.json | grep -o '\"Name\":\"/traefik\"')\" && echo \$(basename {})" \; )

the command is correctly acquiring the id, but the CONTAINER_ID doesn't capture it

to clarify:


find /var/lib/docker/containers -maxdepth 1 -mindepth 1 -type d -exec sh -c "test \"\$(cat {}/config.v2.json | grep -o '\"Name\":\"/traefik\"')\" && echo \$(basename {})" \; 
        CONTAINER_ID=$(find /var/lib/docker/containers -maxdepth 1 -mindepth 1 -type d -exec sh -c "test \"\$(cat {}/config.v2.json | grep -o '\"Name\":\"/traefik\"')\" && echo \$(basename {})" \; )
        echo $CONTAINER_ID

prints the id on the first line (find line) then echo ${CONTAINER_ID} is nullstring. Why?


the issue is NOT ESCAPING RELATED
Show more

## Assistant

Great debugging detail! This is a classic subshell + command substitution subtlety when using sh -c inside find -exec.

Why does this happen?

Your find ... -exec sh -c "..." \; prints the container ID to stdout, but:

Bash
CONTAINER_ID=$(find ... -exec sh -c "..." \;)

captures the combined stdout of all the executions.

If find runs multiple times, the output is multiple lines, and Bash assigns it as a multiline string to CONTAINER_ID.

But if for some reason your sh -c script prints extra newlines or the shell runs multiple commands, it can confuse things. Also, sh -c starts a new shell for each execution, so command substitutions inside might behave unexpectedly.

Key insight

find -exec sh -c "..." \; runs once per matched directory, running a new shell each time. So if multiple matches, multiple outputs, your CONTAINER_ID variable will be the concatenation of all outputs, including newlines.

But if there’s exactly one match, it should work. The issue might be the echo inside the sh -c not being captured properly.

The main problem here is:

When you do:

Bash
CONTAINER_ID=$(find ... -exec sh -c "test ... && echo ..." \;)

the sh -c script runs multiple times, but each run is its own shell, so variable scope is local to that shell.

The fix

Change your find command to:

Bash
CONTAINER_ID=$(find /var/lib/docker/containers -maxdepth 1 -mindepth 1 -type d -exec sh -c '
  if grep -q "\"Name\":\"/traefik\"" "$1/config.v2.json"; then
    echo "$(basename "$1")"
  fi
' sh {} \;)

Explanation:

We pass {} as an argument $1 to the shell.

The shell script uses $1 explicitly, which is safer and clearer than relying on {} inside sh -c "...".

The script echoes the container ID if the grep matches.

The outer $(...) captures all output lines — you can get the first line if you want just one container ID.

To get a single container ID safely, do:
Bash
CONTAINER_ID=$(find /var/lib/docker/containers -maxdepth 1 -mindepth 1 -type d -exec sh -c '
  if grep -q "\"Name\":\"/traefik\"" "$1/config.v2.json"; then
    echo "$(basename "$1")"
  fi
' sh {} \; | head -n1)
Why?

This method avoids complex escaping inside sh -c "...".

Uses positional parameters ($1) instead of {} inside double quotes.

Grep checks inside $1/config.v2.json.

Echo prints the directory name (container ID).

The whole output is captured by $(...).

head -n1 picks the first matching container if more than one.

Summary

Replace your original command with this:

Bash
CONTAINER_ID=$(find /var/lib/docker/containers -maxdepth 1 -mindepth 1 -type d -exec sh -c '
  if grep -q "\"Name\":\"/traefik\"" "$1/config.v2.json"; then
    echo "$(basename "$1")"
  fi
' sh {} \; | head -n1)

echo "Container ID is: $CONTAINER_ID"

If you run that in your shell or inside your container script, you should get the exact container ID captured in the variable.

Want me to help update your entire docker-compose sidecar script with this fix?

## User

ffs same issue. provide a solution that does not use find

## Assistant

Got it — let's ditch find entirely for a more robust way to get the container ID of a container named myapp or traefik by using Docker itself inside the sidecar.

Idea: Use Docker CLI inside the sidecar container to get the container ID

If your sidecar container has access to the Docker socket (/var/run/docker.sock), you can run:

Bash
docker ps -qf "name=traefik"

This gives you the container ID directly, no ugly find or parsing needed.

How to do that in docker-compose.yaml

Add Docker socket as a volume to the sidecar container and use Docker CLI inside it:

YAML
version: "3.9"

services:
  traefik:
    image: traefik:latest
    container_name: traefik
    logging:
      driver: json-file
      options:
        max-size: "50m"
        max-file: "7"

  log-writer:
    image: docker:20.10-dind  # has docker client inside
    container_name: log-writer
    depends_on:
      - traefik
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./logs:/logs
      - ./logrotate_state:/var/lib/logrotate
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
    entrypoint:
      - sh
      - -c
      - |
        CONTAINER_ID=$(docker ps -qf "name=traefik")
        if [ -z "$CONTAINER_ID" ]; then
          echo "Container ID not found"
          exit 1
        fi
        LOGFILE="/var/lib/docker/containers/$CONTAINER_ID/$CONTAINER_ID-json.log"
        echo "Logging from $LOGFILE"
        
        cat > /etc/logrotate.conf <<EOF
/logs/traefik.log {
  size 50M
  rotate 7
  copytruncate
  missingok
  notifempty
  compress
  delaycompress
  create 0644 root root
}
EOF
        
        tail -F "$LOGFILE" >> /logs/traefik.log 2>&1 &

        while true; do
          logrotate /etc/logrotate.conf
          sleep 600
        done
Explanation

log-writer has the Docker CLI (via docker:20.10-dind image).

Docker socket mounted at /var/run/docker.sock.

We get container ID via docker ps -qf "name=traefik".

Tail the correct container's JSON log file.

Write to your custom logfile with rotation.

All inside docker-compose.yaml — no external scripts, no complex find.

This is probably the cleanest self-contained, dynamic, and robust solution you can get.

If you want, I can help adjust this for your specific app/container name, or convert it into a generic reusable snippet. Just ask!
