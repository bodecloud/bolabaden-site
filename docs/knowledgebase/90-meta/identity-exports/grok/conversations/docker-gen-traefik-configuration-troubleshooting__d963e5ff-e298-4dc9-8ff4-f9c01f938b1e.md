---
source_url: "https://grok.com/c/d963e5ff-e298-4dc9-8ff4-f9c01f938b1e"
conversation_id: "d963e5ff-e298-4dc9-8ff4-f9c01f938b1e"
title: "Docker-gen Traefik Configuration Troubleshooting"
extracted_at: "2026-06-29T16:33:29.203Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Docker-gen Traefik Configuration Troubleshooting

Source: [Grok conversation](https://grok.com/c/d963e5ff-e298-4dc9-8ff4-f9c01f938b1e)

## User

_Time: 2025-08-26T09:16:24.952Z_

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

_Time: 2025-08-26T09:20:51.874Z_

### Key Points
- Docker-gen is a tool for generating configuration files dynamically based on Docker container metadata, often used for reverse proxies like Nginx or Traefik. It renders templates using Go template syntax and can watch for container changes to regenerate files automatically.
- Your setup appears mostly correct, but the template has errors in field names (e.g., using "Ports" instead of "Addresses" and "Addr" instead of "IP") and an unnecessary condition on container names that prevents matching any services.
- The command arguments may be misparsed due to duplication, leading to skipped notifications; restructuring as an array and consolidating notifies should resolve this.
- With fixes, docker-gen should generate the expected Traefik dynamic.yaml for services like "whoami," creating routers and services with failover as intended.
- Testing iteratively (e.g., simplifying the template for debugging) is recommended, as container metadata can vary slightly based on environment.

### Understanding Docker-Gen
Docker-gen fetches metadata from the Docker daemon via the socket and uses it to populate templates. In your case, it's meant to scan containers with `traefik.enable: true`, then generate Traefik's dynamic configuration for routers and services, including direct and failover load balancers. The tool runs initially and watches for events like container starts/stops to regenerate the file.

Common use cases include auto-configuring proxies; for Traefik, this replaces manual YAML edits by pulling details like container IPs, ports, and labels dynamically.

### Common Issues in Your Setup
- **Template Mismatches**: The RuntimeContainer struct in docker-gen exposes fields like `.IP` (container IP), `.Addresses` (array of port mappings with `.Port` for private port), `.Name` (container name without leading "/"), and `.Labels` (map of labels). Your template uses `.Addr` (non-existent), `.Ports` (should be `.Addresses`), and `.PrivatePort` (should be `.Port`). The `hasPrefix "/" $c.Name` condition fails because `.Name` lacks the "/".
- **Command Parsing**: The multiline string may cause argument confusion, with duplicated template/dest paths potentially overriding settings. The empty notification in logs suggests the `-notify` isn't applied correctly.
- **Generation Triggering**: Initial generation happens on start, but if no containers match (due to template errors), the output remains empty. Watches work, but changes won't trigger useful updates until fixed.

### Suggested Fixes
Update your Docker Compose to use an array for `command` to avoid parsing issues:

```yaml
command:
  - -watch
  - -only-exposed
  - -include-stopped
  - -notify-sighup
  - traefik
  - -notify
  - docker restart traefik  # Assuming 'restart traefik' means this; adjust if needed
  - /templates/traefik-dynamic.tmpl
  - /etc/traefik/dynamic/traefik.yaml
```

Revise the template (`traefik-dynamic.tmpl`) to correct fields and remove the unnecessary prefix check:

```yaml
# yaml-language-server: $schema=https://www.schemastore.org/traefik-v3-file-provider.json
http:
  routers:
{{ range $c := . }}
  {{ if eq (index $c.Labels "traefik.enable") "true" }}
    {{ $name := $c.Name }}
    {{$name}}-with-failover:
      service: {{$name}}-with-failover@file
      rule: Host(`{{$name}}.${DOMAIN}`)
    {{$name}}-direct:
      service: {{$name}}-direct@file
      rule: Host(`{{$name}}.${TS_HOSTNAME}.${DOMAIN}`)
  {{ end }}
{{ end }}
  services:
{{ range $c := . }}
  {{ if eq (index $c.Labels "traefik.enable") "true" }}
    {{ $name := $c.Name }}
    {{$name}}-with-failover:
      failover:
        service: {{$name}}-direct@file
        fallback: {{$name}}-servers@file
    {{$name}}-direct:
      loadBalancer:
        servers:
          - url: http://{{$c.IP}}:{{ (index $c.Addresses 0).Port }}
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
    {{$name}}-servers:
      loadBalancer:
        servers:
          - url: https://{{$name}}.micklethefickle.${DOMAIN}
          - url: https://{{$name}}.beatapostapita.${DOMAIN}
          - url: https://{{$name}}.vractormania.${DOMAIN}
          - url: https://{{$name}}.arnialtrashlid.${DOMAIN}
          - url: https://{{$name}}.cloudserver1.${DOMAIN}
          - url: https://{{$name}}.cloudserver2.${DOMAIN}
          - url: https://{{$name}}.cloudserver3.${DOMAIN}
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
  {{ end }}
{{ end }}
```

Note: Use `$$` escapes in your Compose `content:` for YAML variables like `${DOMAIN}`.

### Testing and Debugging
- Run docker-gen manually (e.g., via `docker exec`) with dest as stdout for debugging: `docker-gen -only-exposed /templates/traefik-dynamic.tmpl`.
- Add template debug like `{{ toYaml . }}` to inspect all containers.
- Ensure services like "whoami" are running with exposed ports and the label before starting docker-gen.

---
Docker-gen is a versatile tool built by the nginx-proxy team for dynamically generating files from Docker container metadata, commonly paired with reverse proxies like Traefik or Nginx. It operates by querying the Docker API through the mounted socket (/var/run/docker.sock), collecting details on running (or stopped, if included) containers, and rendering user-provided templates using Go's text/template syntax augmented with custom functions like `groupBy`, `where`, and Sprig helpers. This allows automatic configuration updates without manual intervention, ideal for dynamic environments where containers scale or change frequently.

In your configuration, docker-gen is set up to generate Traefik's dynamic YAML file, which defines HTTP routers and services with failover logic for each enabled container. The goal is to create entries like those in your example for "whoami," extending this pattern to all qualifying services. However, the current output is minimal (`http: routers: services:`) because the template's loops aren't matching any containers due to structural mismatches and conditional errors.

#### Detailed Analysis of Your Setup
Your Docker Compose defines a docker-gen service depending on Traefik, using the `nginxproxy/docker-gen` image. Key elements:
- **Volumes and Configs**: Mounting the Docker socket allows metadata access. The template is provided via `configs` and mounted to /templates. The output directory (/etc/traefik/dynamic) is shared, presumably with Traefik for hot-reloading.
- **Command Arguments**: The multiline string passes options like `-only-exposed` (filters to containers with exposed ports, matching your "whoami" with `expose: -80`), `-include-stopped` (includes non-running containers), `-notify-sighup traefik` (sends SIGHUP to Traefik for reload), and `-watch` for event monitoring. The duplicated template/dest and extra `-notify` likely cause parsing issues, resulting in the logs showing skipped notifications with an empty string. Docker-gen expects a single template/dest pair; multiples may lead to overrides or errors.
- **Template Syntax**: Uses Go templates with range loops over containers. The root context (`.`) is a slice of `RuntimeContainer` structs, each representing a container with fields like:
  
| Field | Type | Description | Example Usage in Template |
|-------|------|-------------|---------------------------|
| ID | string | Container ID | Not used in your template |
| Name | string | Container name (without leading "/") | `{{ $c.Name }}` → "whoami" |
| IP | string | Container's primary IP | `{{ $c.IP }}` → "172.17.0.4" |
| Addresses | []Address | Array of port mappings | `{{ (index $c.Addresses 0).Port }}` → "80" (private port) |
| Labels | map[string]string | Container labels | `{{ index $c.Labels "traefik.enable" }}` → "true" |
| Env | map[string]string | Environment variables | Can be used for filtering if needed |
| Image | DockerImage | Image details | Not relevant here |

  (Based on docker-gen's internal context; note `Address` sub-struct has `Port` for the container's private port, equivalent to your intended `PrivatePort`.)

- **Why No Matches?**:
  - The `and` condition includes `(hasPrefix "/" $c.Name)`, but `$c.Name` is "whoami" (no "/"), so this always evaluates to false, skipping all containers.
  - Field errors: `$c.Addr` doesn't exist (use `$c.IP`); `$c.Ports` should be `$c.Addresses`; `.PrivatePort` should be `.Port`.
  - If fixed, it would generate for "whoami" using its IP and first exposed port (80), creating the failover with external server URLs.

- **Logs Interpretation**: The "Contents did not change" indicates generation occurred but produced the same empty output. "Skipping notification ''" points to a misconfigured `-notify`, likely from the duplicated args.

#### Step-by-Step Fixes and Rationale
1. **Restructure Command**: Switch to an array in Compose for clear argument passing. Consolidate notifies—one for SIGHUP (graceful reload), one for restart if needed. If "restart traefik" is a custom command, ensure it's executable inside the container; otherwise, use `docker restart traefik` (but docker-gen container may need Docker installed or privileged access).

   Updated snippet:
   ```yaml
   services:
     docker-gen:
       # ... other fields ...
       command:
         - -watch
         - -only-exposed
         - -include-stopped
         - -notify-sighup
         - traefik
         - -notify
         - docker restart traefik  # Or your intended command
         - /templates/traefik-dynamic.tmpl
         - /etc/traefik/dynamic/traefik.yaml
   ```

2. **Update Template**: Remove the prefix check, correct fields. Use `{{ range $c := .Containers }}` if needed, but `.` works as the root slice. For safety, add checks like `{{ if gt (len $c.Addresses) 0 }}` to avoid index errors.

   Full revised template (with $$ escapes for Compose content):
   ```yaml
   configs:
     traefik-dynamic.tmpl:
       content: |
         # yaml-language-server: $$schema=https://www.schemastore.org/traefik-v3-file-provider.json
         http:
           routers:
         {{ range $$c := . }}
           {{ if eq (index $$c.Labels "traefik.enable") "true" }}
             {{ $$name := $$c.Name }}
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
           {{ if eq (index $$c.Labels "traefik.enable") "true" }}
             {{ $$name := $$c.Name }}
               {{$$name}}-with-failover:
                 failover:
                   service: {{$$name}}-direct@file
                   fallback: {{$$name}}-servers@file
               {{$$name}}-direct:
                 loadBalancer:
                   servers:
                     - url: http://{{$$c.IP}}:{{ (index $$c.Addresses 0).Port }}
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
         {{ end }}
   ```

3. **Debugging Steps**:
   - Simplify template to `{{ range $c := . }}{{ $c.Name }} has enable: {{ index $c.Labels "traefik.enable" | default "false" }}\n{{ end }}` and run with stdout to verify matches.
   - Use `-config` for multiple templates if expanding.
   - Ensure all services share a network (e.g., "coolify" in your "whoami") for IP resolution.
   - If Swarm mode, note `.Node` field for node-specific logic.

#### Advanced Usage and Alternatives
For more complex filtering, use functions like `where $ . "Labels.traefik.enable" "true"`. If scaling to multiple templates, use a config file mounted to docker-gen.

If docker-gen proves tricky, consider Traefik's built-in Docker provider, which auto-discovers via labels without a separate generator (e.g., enable in Traefik static config with `providers.docker: true`). This might simplify your stack, though it lacks custom template flexibility.

Your failover setup with external servers seems for high availability; ensure health checks align with service paths.

#### Potential Edge Cases
- If using Compose projects, container names may include project prefixes (e.g., "project_whoami_1"); trim via `{{ $name := trimSuffix "_1" $c.Name }}` or similar.
- In multi-host/Swarm, use `.Node.Address.IP` for remote IPs.
- Performance: With many containers, add filters like `-notify-filter label=traefik.enable=true` to notify only on relevant changes.

This setup, once fixed, should produce the desired dynamic.yaml, regenerating on events for seamless Traefik updates.

**Key Citations:**
- [GitHub - nginx-proxy/docker-gen: Generate files from docker container meta-data](https://github.com/nginx-proxy/docker-gen)<grok:render card_id="d6dedb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render>
- [Automated nginx proxy for Docker containers using docker-gen](https://github.com/nginx-proxy/nginx-proxy)<grok:render card_id="60c827" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- [Automated Nginx Reverse Proxy for Docker](http://jasonwilder.com/blog/2014/03/25/automated-nginx-reverse-proxy-for-docker/)<grok:render card_id="9e073c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>
- [docker-gen command - github.com/phoenix-io/docker-gen - Go Packages](https://pkg.go.dev/github.com/phoenix-io/docker-gen)<grok:render card_id="0f8fd4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render>
- [Getting Started with Docker and Traefik](https://doc.traefik.io/traefik/getting-started/quick-start/)<grok:render card_id="df4deb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [How to move from nginx-proxy Docker to traefik Docker with proxy ...](https://community.traefik.io/t/how-to-move-from-nginx-proxy-docker-to-traefik-docker-with-proxy-protocol-and-wildcard-certificate/10131)<grok:render card_id="448b56" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [Setup an nginx proxy for docker-compose | Coded Geekery](https://codedgeekery.com/blog/nginx-proxy-docker)<grok:render card_id="fd4d14" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render>
