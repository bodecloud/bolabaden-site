---
source_url: "https://grok.com/c/f0474b14-27f2-41cb-be39-01f6caee9987"
conversation_id: "f0474b14-27f2-41cb-be39-01f6caee9987"
title: "Watchtower Docker Image Pull Failure"
extracted_at: "2026-06-29T16:38:10.557Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Watchtower Docker Image Pull Failure

Source: [Grok conversation](https://grok.com/c/f0474b14-27f2-41cb-be39-01f6caee9987)

## User

_Time: 2025-09-18T00:48:37.453Z_

time="2025-09-17T06:00:45Z" level=debug msg="Parsing image ref" host=index.docker.io image=traefik/whoami normalized=docker.io/traefik/whoami tag=latest
time="2025-09-17T06:00:45Z" level=debug msg="Doing a HEAD request to fetch a digest" url="https://index.docker.io/v2/traefik/whoami/manifests/latest"
time="2025-09-17T06:00:45Z" level=debug msg="Found a remote digest to compare with" remote="sha256:200689790a0a0ea48ca45992e0450bc26ccab5307375b41c84dfc4f2475937ab"
time="2025-09-17T06:00:45Z" level=debug msg=Comparing local="sha256:200689790a0a0ea48ca45992e0450bc26ccab5307375b41c84dfc4f2475937ab" remote="sha256:200689790a0a0ea48ca45992e0450bc26ccab5307375b41c84dfc4f2475937ab"
time="2025-09-17T06:00:45Z" level=debug msg="Found a match"
time="2025-09-17T06:00:45Z" level=debug msg="No pull needed. Skipping image."
time="2025-09-17T06:00:45Z" level=debug msg="No new images found for /whoami"
time="2025-09-17T06:00:45Z" level=debug msg="Trying to load authentication credentials." container=/warp-nat-gateway image="docker.io/caomingjun/warp:latest"
time="2025-09-17T06:00:45Z" level=debug msg="No credentials for index.docker.io found" config_file=/config.json
time="2025-09-17T06:00:45Z" level=debug msg="Got image name: docker.io/caomingjun/warp:latest"
time="2025-09-17T06:00:45Z" level=debug msg="Checking if pull is needed" container=/warp-nat-gateway image="docker.io/caomingjun/warp:latest"
time="2025-09-17T06:00:45Z" level=debug msg="Built challenge URL" URL="https://index.docker.io/v2/"
time="2025-09-17T06:00:45Z" level=debug msg="Got response to challenge request" header="Bearer realm=\"https://auth.docker.io/token\",service=\"registry.docker.io\"" status="401 Unauthorized"
time="2025-09-17T06:00:45Z" level=debug msg="Checking challenge header content" realm="https://auth.docker.io/token" service=registry.docker.io
time="2025-09-17T06:00:45Z" level=debug msg="Setting scope for auth token" image=docker.io/caomingjun/warp scope="repository:caomingjun/warp:pull"
time="2025-09-17T06:00:45Z" level=debug msg="No credentials found."
time="2025-09-17T06:00:45Z" level=debug msg="Parsing image ref" host=index.docker.io image=caomingjun/warp normalized=docker.io/caomingjun/warp tag=latest
time="2025-09-17T06:00:45Z" level=debug msg="Doing a HEAD request to fetch a digest" url="https://index.docker.io/v2/caomingjun/warp/manifests/latest"
time="2025-09-17T06:00:46Z" level=debug msg="Found a remote digest to compare with" remote="sha256:fa4a4741f627fa75b337df88684e6ce4b5c975d18b6b7bc9554dfd1543fca1c2"
time="2025-09-17T06:00:46Z" level=debug msg=Comparing local="sha256:fa4a4741f627fa75b337df88684e6ce4b5c975d18b6b7bc9554dfd1543fca1c2" remote="sha256:fa4a4741f627fa75b337df88684e6ce4b5c975d18b6b7bc9554dfd1543fca1c2"
time="2025-09-17T06:00:46Z" level=debug msg="Found a match"
time="2025-09-17T06:00:46Z" level=debug msg="No pull needed. Skipping image."
time="2025-09-17T06:00:46Z" level=debug msg="No new images found for /warp-nat-gateway"
time="2025-09-17T06:00:46Z" level=debug msg="Trying to load authentication credentials." container=/rclone image="docker.io/rclone/rclone:1.71"
time="2025-09-17T06:00:46Z" level=debug msg="No credentials for index.docker.io found" config_file=/config.json
time="2025-09-17T06:00:46Z" level=debug msg="Got image name: docker.io/rclone/rclone:1.71"
time="2025-09-17T06:00:46Z" level=debug msg="Checking if pull is needed" container=/rclone image="docker.io/rclone/rclone:1.71"
time="2025-09-17T06:00:46Z" level=debug msg="Built challenge URL" URL="https://index.docker.io/v2/"
time="2025-09-17T06:00:46Z" level=debug msg="Got response to challenge request" header="Bearer realm=\"https://auth.docker.io/token\",service=\"registry.docker.io\"" status="401 Unauthorized"
time="2025-09-17T06:00:46Z" level=debug msg="Checking challenge header content" realm="https://auth.docker.io/token" service=registry.docker.io
time="2025-09-17T06:00:46Z" level=debug msg="Setting scope for auth token" image=docker.io/rclone/rclone scope="repository:rclone/rclone:pull"
time="2025-09-17T06:00:46Z" level=debug msg="No credentials found."
time="2025-09-17T06:00:46Z" level=debug msg="Parsing image ref" host=index.docker.io image=rclone/rclone normalized=docker.io/rclone/rclone tag=1.71
time="2025-09-17T06:00:46Z" level=debug msg="Doing a HEAD request to fetch a digest" url="https://index.docker.io/v2/rclone/rclone/manifests/1.71"
time="2025-09-17T06:00:46Z" level=debug msg="Found a remote digest to compare with" remote="sha256:fd635aecd9667ee3c3bf920d14118090d4f2a83a080c1fa77e0bafbd4587ca87"
time="2025-09-17T06:00:46Z" level=debug msg=Comparing local="sha256:fd635aecd9667ee3c3bf920d14118090d4f2a83a080c1fa77e0bafbd4587ca87" remote="sha256:fd635aecd9667ee3c3bf920d14118090d4f2a83a080c1fa77e0bafbd4587ca87"
time="2025-09-17T06:00:46Z" level=debug msg="Found a match"
time="2025-09-17T06:00:46Z" level=debug msg="No pull needed. Skipping image."
 
how to fix in watchtower container?
 
configuration:

```


  watchtower:
    # 🔹🔹 Watchtower 🔹🔹
    image: docker.io/containrrr/watchtower:latest
    container_name: watchtower
    hostname: watchtower
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
#      - ${CONFIG_PATH:-./volumes}/watchtower/data:/data
    environment:
      WATCHTOWER_CLEANUP: ${WATCHTOWER_CLEANUP:-true}
      WATCHTOWER_SCHEDULE: ${WATCHTOWER_SCHEDULE:-0 0 6 * * *} # Run at 6am daily
      WATCHTOWER_NOTIFICATION_URL: ${WATCHTOWER_NOTIFICATION_URL:-}
      WATCHTOWER_NOTIFICATION_REPORT: ${WATCHTOWER_NOTIFICATION_REPORT:-true}
      WATCHTOWER_DEBUG: ${WATCHTOWER_DEBUG:-true}
      WATCHTOWER_LOG_LEVEL: ${WATCHTOWER_LOG_LEVEL:-debug}
      WATCHTOWER_NOTIFICATION_TEMPLATE: |
        {{- if .Report -}}
          {{- with .Report -}}
            {{- if ( or .Updated .Failed ) -}}
        {{len .Scanned}} Scanned, {{len .Updated}} Updated, {{len .Failed}} Failed
              {{- range .Updated}}
        - {{.Name}} ({{.ImageName}}): {{.CurrentImageID.ShortID}} updated to {{.LatestImageID.ShortID}}
              {{- end -}}
              {{- range .Skipped}}
        - {{.Name}} ({{.ImageName}}): {{.State}}: {{.Error}}
              {{- end -}}
              {{- range .Failed}}
        - {{.Name}} ({{.ImageName}}): {{.State}}: {{.Error}}
              {{- end -}}
            {{- end -}}
          {{- end -}}
        {{- else -}}
          {{range .Entries -}}{{.Message}}{{"\n"}}{{- end -}}
        {{- end -}}
    restart: always
```

## Assistant

_Time: 2025-09-18T00:48:51.359Z_



## User

_Time: 2025-09-18T00:49:07.329Z_

time="2025-09-17T06:00:45Z" level=debug msg="Parsing image ref" host=index.docker.io image=traefik/whoami normalized=docker.io/traefik/whoami tag=latest
time="2025-09-17T06:00:45Z" level=debug msg="Doing a HEAD request to fetch a digest" url="https://index.docker.io/v2/traefik/whoami/manifests/latest"
time="2025-09-17T06:00:45Z" level=debug msg="Found a remote digest to compare with" remote="sha256:200689790a0a0ea48ca45992e0450bc26ccab5307375b41c84dfc4f2475937ab"
time="2025-09-17T06:00:45Z" level=debug msg=Comparing local="sha256:200689790a0a0ea48ca45992e0450bc26ccab5307375b41c84dfc4f2475937ab" remote="sha256:200689790a0a0ea48ca45992e0450bc26ccab5307375b41c84dfc4f2475937ab"
time="2025-09-17T06:00:45Z" level=debug msg="Found a match"
time="2025-09-17T06:00:45Z" level=debug msg="No pull needed. Skipping image."
time="2025-09-17T06:00:45Z" level=debug msg="No new images found for /whoami"
time="2025-09-17T06:00:45Z" level=debug msg="Trying to load authentication credentials." container=/warp-nat-gateway image="docker.io/caomingjun/warp:latest"
time="2025-09-17T06:00:45Z" level=debug msg="No credentials for index.docker.io found" config_file=/config.json
time="2025-09-17T06:00:45Z" level=debug msg="Got image name: docker.io/caomingjun/warp:latest"
time="2025-09-17T06:00:45Z" level=debug msg="Checking if pull is needed" container=/warp-nat-gateway image="docker.io/caomingjun/warp:latest"
time="2025-09-17T06:00:45Z" level=debug msg="Built challenge URL" URL="https://index.docker.io/v2/"
time="2025-09-17T06:00:45Z" level=debug msg="Got response to challenge request" header="Bearer realm=\"https://auth.docker.io/token\",service=\"registry.docker.io\"" status="401 Unauthorized"
time="2025-09-17T06:00:45Z" level=debug msg="Checking challenge header content" realm="https://auth.docker.io/token" service=registry.docker.io
time="2025-09-17T06:00:45Z" level=debug msg="Setting scope for auth token" image=docker.io/caomingjun/warp scope="repository:caomingjun/warp:pull"
time="2025-09-17T06:00:45Z" level=debug msg="No credentials found."
time="2025-09-17T06:00:45Z" level=debug msg="Parsing image ref" host=index.docker.io image=caomingjun/warp normalized=docker.io/caomingjun/warp tag=latest
time="2025-09-17T06:00:45Z" level=debug msg="Doing a HEAD request to fetch a digest" url="https://index.docker.io/v2/caomingjun/warp/manifests/latest"
time="2025-09-17T06:00:46Z" level=debug msg="Found a remote digest to compare with" remote="sha256:fa4a4741f627fa75b337df88684e6ce4b5c975d18b6b7bc9554dfd1543fca1c2"
time="2025-09-17T06:00:46Z" level=debug msg=Comparing local="sha256:fa4a4741f627fa75b337df88684e6ce4b5c975d18b6b7bc9554dfd1543fca1c2" remote="sha256:fa4a4741f627fa75b337df88684e6ce4b5c975d18b6b7bc9554dfd1543fca1c2"
time="2025-09-17T06:00:46Z" level=debug msg="Found a match"
time="2025-09-17T06:00:46Z" level=debug msg="No pull needed. Skipping image."
time="2025-09-17T06:00:46Z" level=debug msg="No new images found for /warp-nat-gateway"
time="2025-09-17T06:00:46Z" level=debug msg="Trying to load authentication credentials." container=/rclone image="docker.io/rclone/rclone:1.71"
time="2025-09-17T06:00:46Z" level=debug msg="No credentials for index.docker.io found" config_file=/config.json
time="2025-09-17T06:00:46Z" level=debug msg="Got image name: docker.io/rclone/rclone:1.71"
time="2025-09-17T06:00:46Z" level=debug msg="Checking if pull is needed" container=/rclone image="docker.io/rclone/rclone:1.71"
time="2025-09-17T06:00:46Z" level=debug msg="Built challenge URL" URL="https://index.docker.io/v2/"
time="2025-09-17T06:00:46Z" level=debug msg="Got response to challenge request" header="Bearer realm=\"https://auth.docker.io/token\",service=\"registry.docker.io\"" status="401 Unauthorized"
time="2025-09-17T06:00:46Z" level=debug msg="Checking challenge header content" realm="https://auth.docker.io/token" service=registry.docker.io
time="2025-09-17T06:00:46Z" level=debug msg="Setting scope for auth token" image=docker.io/rclone/rclone scope="repository:rclone/rclone:pull"
time="2025-09-17T06:00:46Z" level=debug msg="No credentials found."
time="2025-09-17T06:00:46Z" level=debug msg="Parsing image ref" host=index.docker.io image=rclone/rclone normalized=docker.io/rclone/rclone tag=1.71
time="2025-09-17T06:00:46Z" level=debug msg="Doing a HEAD request to fetch a digest" url="https://index.docker.io/v2/rclone/rclone/manifests/1.71"
time="2025-09-17T06:00:46Z" level=debug msg="Found a remote digest to compare with" remote="sha256:fd635aecd9667ee3c3bf920d14118090d4f2a83a080c1fa77e0bafbd4587ca87"
time="2025-09-17T06:00:46Z" level=debug msg=Comparing local="sha256:fd635aecd9667ee3c3bf920d14118090d4f2a83a080c1fa77e0bafbd4587ca87" remote="sha256:fd635aecd9667ee3c3bf920d14118090d4f2a83a080c1fa77e0bafbd4587ca87"
time="2025-09-17T06:00:46Z" level=debug msg="Found a match"
time="2025-09-17T06:00:46Z" level=debug msg="No pull needed. Skipping image."
 
how to fix in watchtower container?
 
configuration:

```


  watchtower:
    # 🔹🔹 Watchtower 🔹🔹
    image: docker.io/containrrr/watchtower:latest
    container_name: watchtower
    hostname: watchtower
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
#      - ${CONFIG_PATH:-./volumes}/watchtower/data:/data
    environment:
      WATCHTOWER_CLEANUP: ${WATCHTOWER_CLEANUP:-true}
      WATCHTOWER_SCHEDULE: ${WATCHTOWER_SCHEDULE:-0 0 6 * * *} # Run at 6am daily
      WATCHTOWER_NOTIFICATION_URL: ${WATCHTOWER_NOTIFICATION_URL:-}
      WATCHTOWER_NOTIFICATION_REPORT: ${WATCHTOWER_NOTIFICATION_REPORT:-true}
      WATCHTOWER_DEBUG: ${WATCHTOWER_DEBUG:-true}
      WATCHTOWER_LOG_LEVEL: ${WATCHTOWER_LOG_LEVEL:-debug}
      WATCHTOWER_NOTIFICATION_TEMPLATE: |
        {{- if .Report -}}
          {{- with .Report -}}
            {{- if ( or .Updated .Failed ) -}}
        {{len .Scanned}} Scanned, {{len .Updated}} Updated, {{len .Failed}} Failed
              {{- range .Updated}}
        - {{.Name}} ({{.ImageName}}): {{.CurrentImageID.ShortID}} updated to {{.LatestImageID.ShortID}}
              {{- end -}}
              {{- range .Skipped}}
        - {{.Name}} ({{.ImageName}}): {{.State}}: {{.Error}}
              {{- end -}}
              {{- range .Failed}}
        - {{.Name}} ({{.ImageName}}): {{.State}}: {{.Error}}
              {{- end -}}
            {{- end -}}
          {{- end -}}
        {{- else -}}
          {{range .Entries -}}{{.Message}}{{"\n"}}{{- end -}}
        {{- end -}}
    restart: always
```

basically watchtower never ever actually pulls the container?? always get 401 error as shown above.

## Assistant

_Time: 2025-09-18T00:49:26.616Z_


