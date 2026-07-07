---
source_url: "https://grok.com/c/61f996dc-4a82-4208-b2a3-db459567b952"
conversation_id: "61f996dc-4a82-4208-b2a3-db459567b952"
title: "Modern Alternatives for Docker Label Templating"
extracted_at: "2026-06-29T16:23:31.578Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Modern Alternatives for Docker Label Templating

Source: [Grok conversation](https://grok.com/c/61f996dc-4a82-4208-b2a3-db459567b952)

## User

_Time: 2025-08-30T08:37:19.613Z_

provide a modern alternative for

```dockercompose
docker.io/nginxproxy/docker-gen
```

docker-gen is like 8 years old.
 
what i'm trying to do:

* read docker labels

* template them into a yaml file similar to this example

 

```

      # yaml-language-server: $schema=https://www.schemastore.org/traefik-v3-file-provider.json
      http:
        routers:
      {{- range $c := . }}
        {{- if eq (index $c.Labels "traefik.enable") "true" }}
          {{- $name := trimPrefix "/" $c.Name }}
          {{ printf "%s-with-failover:" $name }}
      {{- "\n" }}
      {{ printf "      service: %s-with-failover@file" $name }}
      {{- "\n" }}
      {{ printf "      rule: Host(`%s.${DOMAIN}`)" $name }}
      {{- "\n" }}
      {{ printf "    %s-direct:" $name }}
      {{- "\n" }}
      {{ printf "      service: %s-direct@file" $name }}
      {{- "\n" }}
      {{ printf "      rule: Host(`%s.${TS_HOSTNAME}.${DOMAIN}`)" $name }}
      {{- "\n" }}
        {{- end }}
      {{- end }}

        services:
      {{- range $c := . }}
        {{- if eq (index $c.Labels "traefik.enable") "true" }}
          {{- $name := trimPrefix "/" $c.Name }}
          {{ printf "%s-with-failover:" $name }}
      {{- "\n" }}
      {{ printf "      failover:" }}
      {{- "\n" }}
      {{ printf "        service: %s-direct@file" $name }}
      {{- "\n" }}
      {{ printf "        fallback: %s-servers@file" $name }}
      {{- "\n" }}
      {{ printf "    %s-direct:" $name }}
      {{- "\n" }}
      {{ printf "      loadBalancer:" }}
      {{- "\n" }}
      {{ printf "        servers:" }}
      {{- "\n" }}
      {{ printf "          - url: http://%s:%s" $name ((index $c.Addresses 0).Port) }}
      {{- "\n" }}
      {{ printf "        healthCheck:" }}
      {{- "\n" }}
      {{ printf "          path: \"/\"" }}
      {{- "\n" }}
      {{ printf "          interval: \"15s\"" }}
      {{- "\n" }}
      {{ printf "          timeout: \"5s\"" }}
      {{- "\n" }}
      {{ printf "    %s-servers:" $name }}
      {{- "\n" }}
      {{ printf "      loadBalancer:" }}
      {{- "\n" }}
      {{ printf "        servers:" }}
      {{- "\n" }}
      {{ printf "          - url: https://%s.micklethefickle.${DOMAIN}" $name }}
      {{- "\n" }}
      {{ printf "          - url: https://%s.beatapostapita.${DOMAIN}" $name }}
      {{- "\n" }}
      {{ printf "          - url: https://%s.vractormania.${DOMAIN}" $name }}
      {{- "\n" }}
      {{ printf "          - url: https://%s.arnialtrashlid.${DOMAIN}" $name }}
      {{- "\n" }}
      {{ printf "          - url: https://%s.cloudserver1.${DOMAIN}" $name }}
      {{- "\n" }}
      {{ printf "          - url: https://%s.cloudserver2.${DOMAIN}" $name }}
      {{- "\n" }}
      {{ printf "          - url: https://%s.cloudserver3.${DOMAIN}" $name }}
      {{- "\n" }}
      {{ printf "        healthCheck:" }}
      {{- "\n" }}
      {{ printf "          path: \"/\"" }}
      {{- "\n" }}
      {{ printf "          interval: \"15s\"" }}
      {{- "\n" }}
      {{ printf "          timeout: \"5s\"" }}
      {{- "\n" }}
        {{- end }}
      {{- end }}
```

## Assistant

_Time: 2025-08-30T08:37:48.538Z_



## User

_Time: 2025-08-30T08:38:09.634Z_

provide a modern alternative for

```dockercompose
docker.io/nginxproxy/docker-gen
```

docker-gen is like 8 years old.
 
what i'm trying to do:

* read docker labels

* template them into a yaml file similar to this example

 

```

      # yaml-language-server: $schema=https://www.schemastore.org/traefik-v3-file-provider.json
      http:
        routers:
      {{- range $c := . }}
        {{- if eq (index $c.Labels "traefik.enable") "true" }}
          {{- $name := trimPrefix "/" $c.Name }}
          {{ printf "%s-with-failover:" $name }}
      {{- "\n" }}
      {{ printf "      service: %s-with-failover@file" $name }}
      {{- "\n" }}
      {{ printf "      rule: Host(`%s.${DOMAIN}`)" $name }}
      {{- "\n" }}
      {{ printf "    %s-direct:" $name }}
      {{- "\n" }}
      {{ printf "      service: %s-direct@file" $name }}
      {{- "\n" }}
      {{ printf "      rule: Host(`%s.${TS_HOSTNAME}.${DOMAIN}`)" $name }}
      {{- "\n" }}
        {{- end }}
      {{- end }}

        services:
      {{- range $c := . }}
        {{- if eq (index $c.Labels "traefik.enable") "true" }}
          {{- $name := trimPrefix "/" $c.Name }}
          {{ printf "%s-with-failover:" $name }}
      {{- "\n" }}
      {{ printf "      failover:" }}
      {{- "\n" }}
      {{ printf "        service: %s-direct@file" $name }}
      {{- "\n" }}
      {{ printf "        fallback: %s-servers@file" $name }}
      {{- "\n" }}
      {{ printf "    %s-direct:" $name }}
      {{- "\n" }}
      {{ printf "      loadBalancer:" }}
      {{- "\n" }}
      {{ printf "        servers:" }}
      {{- "\n" }}
      {{ printf "          - url: http://%s:%s" $name ((index $c.Addresses 0).Port) }}
      {{- "\n" }}
      {{ printf "        healthCheck:" }}
      {{- "\n" }}
      {{ printf "          path: \"/\"" }}
      {{- "\n" }}
      {{ printf "          interval: \"15s\"" }}
      {{- "\n" }}
      {{ printf "          timeout: \"5s\"" }}
      {{- "\n" }}
      {{ printf "    %s-servers:" $name }}
      {{- "\n" }}
      {{ printf "      loadBalancer:" }}
      {{- "\n" }}
      {{ printf "        servers:" }}
      {{- "\n" }}
      {{ printf "          - url: https://%s.micklethefickle.${DOMAIN}" $name }}
      {{- "\n" }}
      {{ printf "          - url: https://%s.beatapostapita.${DOMAIN}" $name }}
      {{- "\n" }}
      {{ printf "          - url: https://%s.vractormania.${DOMAIN}" $name }}
      {{- "\n" }}
      {{ printf "          - url: https://%s.arnialtrashlid.${DOMAIN}" $name }}
      {{- "\n" }}
      {{ printf "          - url: https://%s.cloudserver1.${DOMAIN}" $name }}
      {{- "\n" }}
      {{ printf "          - url: https://%s.cloudserver2.${DOMAIN}" $name }}
      {{- "\n" }}
      {{ printf "          - url: https://%s.cloudserver3.${DOMAIN}" $name }}
      {{- "\n" }}
      {{ printf "        healthCheck:" }}
      {{- "\n" }}
      {{ printf "          path: \"/\"" }}
      {{- "\n" }}
      {{ printf "          interval: \"15s\"" }}
      {{- "\n" }}
      {{ printf "          timeout: \"5s\"" }}
      {{- "\n" }}
        {{- end }}
      {{- end }}
```

do NOT recommend traefik. Exclusively recommend at least 10 projects that read docker labels and let me template similar to docker-gen

## Assistant

_Time: 2025-08-30T08:39:00.770Z_


