---
source_url: "https://chatgpt.com/c/68c768cb-fa78-832d-b2d6-167fc2fbc17a"
conversation_id: "68c768cb-fa78-832d-b2d6-167fc2fbc17a"
title: "Docker-gen event filtering"
extracted_at: "2026-06-29T11:05:55.322Z"
message_count: 2
provenance: auth-ui
---

# Docker-gen event filtering

Source: [ChatGPT conversation](https://chatgpt.com/c/68c768cb-fa78-832d-b2d6-167fc2fbc17a)

## User

root@beatapostapita:/home/ubuntu/my-media-stack# docker exec -it docker-gen-failover docker-gen
Usage: docker-gen [options] template [dest]

Generate files from docker container meta-data

Options:
  -config value
        config files with template directives. Config files will be merged if this option is specified multiple times.
  -endpoint string
        docker api endpoint (tcp|unix://..). Default unix:///var/run/docker.sock
  -event-filter value
        additional filter for event watched by docker-gen (e.g -event-filter event=connect -event-filter event=disconnect). You can pass this option multiple times to combine filters. By default docker-gen listen for container events start, stop, die and health_status. https://docs.docker.com/engine/reference/commandline/events/#filtering-events
  -include-stopped
        include stopped containers
  -interval int
        notify command interval (secs)
  -keep-blank-lines
        keep blank lines in the output file
  -notify restart xyz
        run command after template is regenerated (e.g restart xyz)
  -notify-container value
        send -notify-signal signal (defaults to 1 / HUP) to container. You can pass this option multiple times to notify multiple containers.
  -notify-filter value
        container filter for notification (e.g -notify-filter name=foo). You can pass this option multiple times to combine filters with AND. https://docs.docker.com/engine/reference/commandline/ps/#filter
  -notify-output
        log the output(stdout/stderr) of notify command
  -notify-sighup container-ID
        send HUP signal to container. Equivalent to docker kill -s HUP container-ID. You can pass this option multiple times to send HUP to multiple containers.
  -notify-signal int
        signal to send to the notify-container and notify-filter. Defaults to SIGHUP (default 1)
  -only-exposed
        only include containers with exposed ports
  -only-published
        only include containers with published ports (implies -only-exposed)
  -tlscacert string
        path to TLS CA certificate file (default "/root/.docker/ca.pem")
  -tlscert string
        path to TLS client certificate file (default "/root/.docker/cert.pem")
  -tlskey string
        path to TLS client key file (default "/root/.docker/key.pem")
  -tlsverify
        verify docker daemon's TLS certicate
  -version
        show version
  -wait string
        minimum and maximum durations to wait (e.g. "500ms:2s") before triggering generate
  -watch
        watch for container changes

Arguments:
  template - path to a template to generate
  dest - path to a write the template.  If not specfied, STDOUT is used

Environment Variables:
  DOCKER_HOST - default value for -endpoint
  DOCKER_CERT_PATH - directory path containing key.pem, cert.pem and ca.pem
  DOCKER_TLS_VERIFY - enable client TLS verification

For more information, see https://github.com/nginx-proxy/docker-gen

Corect syntax for making it watch certain events, i don't want it to track 'stopped' or 'removed' events
Show more

## Assistant

Got it! You want docker-gen to watch certain container events but exclude stopped or removed containers. Let’s break it down carefully.

By default, docker-gen listens for these events:

start, stop, die, health_status

If you don’t want it to track stopped or removed containers, you should:

Avoid using -include-stopped (that would include stopped containers).

Use the -event-filter flag to explicitly choose which events to watch.

For example, if you want to watch only start and health_status events:

Bash
docker exec -it docker-gen-failover docker-gen \
  -watch \
  -event-filter event=start \
  -event-filter event=health_status \
  /path/to/template /path/to/destination

Explanation:

-watch → keeps the process running and regenerates the template on matching events.

-event-filter event=start → watches container start events.

-event-filter event=health_status → watches health status changes.

No -include-stopped → stopped containers are ignored.

You don’t specify stop or die events, so they won’t trigger regeneration.

✅ This way, docker-gen only reacts to the events you care about.

If you want, I can write a ready-to-run one-liner that watches start and restart but completely ignores stopped/removed events—it’s very clean. Do you want me to do that?
