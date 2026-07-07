---
source_url: "https://grok.com/c/4dc06f68-c656-4d8b-99e6-c37a6181dcd7"
conversation_id: "4dc06f68-c656-4d8b-99e6-c37a6181dcd7"
title: "Understanding Docker-Gen with Traefik Configuration"
extracted_at: "2026-06-29T16:24:23.404Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Understanding Docker-Gen with Traefik Configuration

Source: [Grok conversation](https://grok.com/c/4dc06f68-c656-4d8b-99e6-c37a6181dcd7)

## User

_Time: 2025-08-26T09:16:18.541Z_

have you ever heard of docker-gen? I'm struggling to understand how to use it.
 
```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json
 
services:
  docker-gen:
    depends_on:
      - traefik
    image: docker.io/nginxproxy/docker-gen
    container_name: docker-gen
    command: |
      -only-exposed
      -include-stopped
      -notify-sighup traefik
      -watch /templates/traefik-dynamic.tmpl /etc/traefik/dynamic/traefik.yaml
      -notify "restart traefik" /templates/traefik-dynamic.tmpl /etc/traefik/dynamic/traefik.yaml
    configs:
      - source: traefik-dynamic.tmpl
        target: /templates/traefik-dynamic.tmpl
        mode: 0400
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ${CONFIG_PATH:-./configs}/traefik/templates:/templates
      - ${CONFIG_PATH:-./configs}/traefik/dynamic:/etc/traefik/dynamic
    restart: always
configs:
  traefik-dynamic.tmpl:
    content: |
      # yaml-language-server: $$schema=https://www.schemastore.org/traefik-v3-file-provider.json
      http:
        routers:
      {{ range $$c := . }}
        {{ if and (eq (index $$c.Labels "traefik.enable") "true") (hasPrefix "/" $$c.Name) }}
          {{ $$name := trimPrefix "/" $$c.Name }}
          {{$$name}}-with-failover:
            service: {{$$name}}-with-failover@file
            rule: Host(`{{$$name}}.${DOMAIN}`)
          {{$$name}}-direct:
            service: {{$$name}}-direct@file
            rule: Host(`{{$$name}}.${TS_HOSTNAME}.${DOMAIN}`)
        {{ end }}
      {{ end }}
        services:
      {{ range $$c := . }}
        {{ if and (eq (index $$c.Labels "traefik.enable") "true") (hasPrefix "/" $$c.Name) }}
          {{ $$name := trimPrefix "/" $$c.Name }}
            {{$$name}}-with-failover:
              failover:
                service: {{$$name}}-direct@file
                fallback: {{$$name}}-servers@file
            {{$$name}}-direct:
              loadBalancer:
                servers:
                  - url: http://{{$$c.Addr}}:{{ (index $$c.Ports 0).PrivatePort }}
                healthCheck:
                  path: "/"
                  interval: "15s"
                  timeout: "5s"
            {{$$name}}-servers:
              loadBalancer:
                servers:
                  - url: https://{{$$name}}.micklethefickle.${DOMAIN}
                  - url: https://{{$$name}}.beatapostapita.${DOMAIN}
                  - url: https://{{$$name}}.vractormania.${DOMAIN}
                  - url: https://{{$$name}}.arnialtrashlid.${DOMAIN}
                  - url: https://{{$$name}}.cloudserver1.${DOMAIN}
                  - url: https://{{$$name}}.cloudserver2.${DOMAIN}
                  - url: https://{{$$name}}.cloudserver3.${DOMAIN}
                healthCheck:
                  path: "/"
                  interval: "15s"
                  timeout: "5s"
        {{ end }}
      {{ end }}```
 
I'm using docker's configs syntax for simplicity (note the escaped dollar signs $, the only ones that should not be escaped are ${DOMAIN} and ${TS_HOSTNAME}.
 
I'm trying to do this for each and every service in traefik's dynamic.yaml:
```
# yaml-language-server: $schema=https://www.schemastore.org/traefik-v3-file-provider.json
http:
  routers:
    whoami-with-failover:
      service: whoami-with-failover@file
      rule: Host(`whoami.bolabaden.org`)
    whoami-direct:
      service: whoami-direct@file
      rule: Host(`whoami.beatapostapita.bolabaden.org`)
  services:
    whoami-with-failover:
      failover:
        service: whoami-direct@file
        fallback: whoami-servers@file
    whoami-direct:
      loadBalancer:
        servers:
          - url: http://whoami:80
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
    whoami-servers:
      loadBalancer:
        servers:
          - url: http://whoami:80
          - url: https://whoami.beatapostapita.bolabaden.org
          - url: https://whoami.beatapostapita.bolabaden.org
          - url: https://whoami.vractormania.bolabaden.org
          - url: https://whoami.arnialtrashlid.bolabaden.org
          - url: https://whoami.cloudserver1.bolabaden.org
          - url: https://whoami.cloudserver2.bolabaden.org
          - url: https://whoami.cloudserver3.bolabaden.org
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"```
 
where whoami is defined in docker-compose.yaml like:
```
  whoami:
    # 🔹🔹 Whoami 🔹🔹
    image: docker.io/traefik/whoami:latest
    container_name: whoami
    hostname: whoami
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - coolify
    expose:
      - 80
    labels:
      traefik.enable: true
      traefik.http.routers.whoami.rule: Host(`whoami.${TS_HOSTNAME}.${DOMAIN}`) || Host(`whoami.${DOMAIN}`)
      traefik.http.routers.whoami.service: whoami@docker
      traefik.http.services.whoami.loadBalancer.server.port: 80
    restart: always```
 
Just trying to dynamically create the dynamic.yaml for each and every service following the whoami pattern. Currently I just get this output:
```
 ✔ Container docker-gen Started 0.5s
2025/08/26 09:11:23 Contents of /etc/traefik/dynamic/traefik.yaml did not change. Skipping notification ''
2025/08/26 09:11:23 Watching docker events
2025/08/26 09:11:23 Contents of /etc/traefik/dynamic/traefik.yaml did not change. Skipping notification ''
```
 
but the issue is, the file /etc/traefik/dynamic/traefik.yaml doesn't have the expected contents:
 
```
# yaml-language-server: $schema=https://www.schemastore.org/traefik-v3-file-provider.json
http:
  routers:
  services:
```
 
please help.

## Assistant

_Time: 2025-08-26T09:21:29.708Z_

The configuration provided utilizes docker-gen to dynamically generate a Traefik dynamic configuration file based on container metadata. However, the generated /etc/traefik/dynamic/traefik.yaml file lacks the expected router and service definitions, indicating that no containers match the template's conditional logic during rendering.

The template iterates over containers (via {{ range $$c := . }}) and applies conditions: the presence of the label "traefik.enable" set to "true", and the container name starting with "/". Given the empty output under "routers" and "services", docker-gen is not detecting any qualifying containers.

This outcome is consistent with a deployment in Docker Swarm mode, as suggested by the use of the "configs" section in the Compose file (which is primarily for Swarm stacks). In Swarm, the standard docker-gen image (nginxproxy/docker-gen) connects to the local Docker daemon via /var/run/docker.sock and only observes containers running on the same node. Containers on other nodes in the cluster are not visible, leading to an empty list of matching entries if no relevant services (e.g., "whoami") are scheduled on the docker-gen node's host.

To address this:

- Confirm the deployment environment. If using Swarm (e.g., via "docker stack deploy"), verify node placement with "docker ps" on each node or "docker service ps <service-name>". If multi-node, this explains the absence of detected containers.

- Switch to a Swarm-compatible docker-gen image. The standard image lacks native support for cluster-wide visibility. Use a modified version such as keryc/docker-gen-swarm:latest or a similar fork designed for Swarm. Update the image in the Compose file:

  ```
  services:
    docker-gen:
      image: keryc/docker-gen-swarm:latest
      # ... (retain other settings)
  ```

  These variants typically query Swarm APIs (/services, /tasks) to aggregate metadata across nodes, treating services rather than individual local containers.

- Adjust the template for Swarm semantics. Container names in Swarm follow the pattern "/<stack>_<service>.<replica>.<id>". Replace the name extraction with the service label:

  ```
  {{ $$name := index $$c.Labels "com.docker.swarm.service.name" }}
  ```

  This yields the clean service name (e.g., "whoami") instead of the full task name. If not in Swarm, add a conditional:

  ```
  {{ $$name := "" }}
  {{ if hasKey $$c.Labels "com.docker.swarm.service.name" }}
    {{ $$name = index $$c.Labels "com.docker.swarm.service.name" }}
  {{ else }}
    {{ $$name = trimPrefix "/" $$c.Name }}
  {{ end }}
  ```

- Refine the command structure. The current multiline string format may not parse flags correctly, as it passes a single argument to the entrypoint. Convert to an array for precise argument passing:

  ```
  command:
    - -only-exposed
    - -include-stopped
    - -notify-sighup
    - traefik
    - -watch
    - /templates/traefik-dynamic.tmpl
    - /etc/traefik/dynamic/traefik.yaml
    - -notify
    - docker restart traefik  # Adjust if needed; ensure "restart traefik" is a valid command (e.g., if traefik is a container name)
  ```

  Note: If Traefik's file provider has "watch: true" enabled, it will auto-reload on file changes, potentially reducing the need for explicit notifications. However, recent Traefik v3 versions have reported issues with SIGHUP causing termination rather than reload; test accordingly or use restart as a fallback.

- Handle environment variables in the template. The placeholders ${DOMAIN} and ${TS_HOSTNAME} are not interpolated by Go templates. Replace with {{ env "DOMAIN" }} and {{ env "TS_HOSTNAME" }} to access environment variables:

  ```
  rule: Host(`{{$$name}}.{{ env "DOMAIN" }}`)
  ```

- Test incrementally. Start with a simplified template that outputs all container names and labels (e.g., {{ range $$c := . }}{{ $$c.Name }}: {{ $$c.Labels }}{{ end }}) and redirect to stdout (remove dest) for debugging. Ensure the "whoami" service runs on the same node initially if testing without a Swarm fork.

If the environment is not Swarm (e.g., single-node or standard Compose), verify container labels via "docker inspect <container-id>" and ensure services like "whoami" are running with exposed ports and the correct labels before docker-gen starts.

For further details on Swarm integration, refer to Docker documentation on Swarm administration or search for "docker-gen swarm support" to explore fork-specific usage.
