---
source_url: "https://grok.com/c/e67d2be3-a392-48e3-ad95-bf25f01aeceb"
conversation_id: "e67d2be3-a392-48e3-ad95-bf25f01aeceb"
title: "Docker Compose Redis Command Formatting"
extracted_at: "2026-06-29T16:22:24.080Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Docker Compose Redis Command Formatting

Source: [Grok conversation](https://grok.com/c/e67d2be3-a392-48e3-ad95-bf25f01aeceb)

## User

_Time: 2025-08-31T08:21:50.184Z_

```dockercompose


  redis:
    # 🔹🔹 Redis 🔹🔹
    # NOTE: If you want to use Valkey (open source) instead of Redis (source available),
    # uncomment the Valkey statement and comment out the Redis statement.
    # Using Valkey with Firecrawl is untested and not guaranteed to work. Use with caution.
    image: docker.io/redis:alpine
    # image: valkey/valkey:alpine
    container_name: redis
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
      - publicnet
    expose:
      - ${REDIS_PORT:-6379}
    ports:
      - 127.0.0.1:${REDIS_PORT:-6379}:${REDIS_PORT:-6379}
    volumes:
      - ${CONFIG_PATH:-./configs}/redis:/data
    privileged: true
    environment:
      REDIS_HOST: ${REDIS_HOST:-redis}
      REDIS_PORT: ${REDIS_PORT:-6379}
      REDIS_DATABASE: ${REDIS_DATABASE:-0}
      REDIS_USERNAME: ${REDIS_USERNAME:-default}
      REDIS_PASSWORD: ${REDIS_PASSWORD:-redis}
    command: sh -c "sysctl vm.overcommit_memory=1 &> /dev/null && redis-server --appendonly yes --save 60 1 --bind 0.0.0.0 --port ${REDIS_PORT:-6379} --requirepass ${REDIS_PASSWORD:?}"
    labels:
      traefik.enable: true
      traefik.tcp.routers.redis.rule: HostSNI(`redis.$DOMAIN`) || HostSNI(`redis.$TS_HOSTNAME.$DOMAIN`)
      traefik.tcp.routers.redis.service: redis@docker
      traefik.tcp.routers.redis.tls.domains[0].main: $DOMAIN
      traefik.tcp.routers.redis.tls.domains[0].sans: $TS_HOSTNAME.$DOMAIN,$TS_HOSTNAME.$DOMAIN
      traefik.tcp.routers.redis.tls.passthrough: true
      traefik.tcp.services.redis.loadbalancer.server.port: ${REDIS_PORT:-6379}
      traefik.tcp.services.redis.loadbalancer.server.tls: true
    healthcheck:
      test: ["CMD-SHELL", "redis-cli ping > /dev/null 2>&1 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
    cpu_shares: 10
    mem_reservation: 200M
    deploy:
      resources:
        reservations:
          cpus: 0
          memory: 200M
        limits:
          cpus: 0.5
          memory: 4G
    restart: always
```

how to multiline split the `command` so it's less ugly and falling off the page on the righthand side?

## Assistant

_Time: 2025-08-31T08:22:11.183Z_

In YAML, single-line strings like your command cram everything together because early config formats forced brevity for simple parsers, but as setups grew complex (e.g., long shell chains in Docker), multiline options emerged to fix readability without breaking execution—unlike flat INI files that couldn't handle it at all.

Replace the command with this block-style version using > to fold lines into one string (preserving && logic without injecting breaks that could error in sh -c, vs | which keeps newlines and risks syntax issues if not careful):

command: >-
  sh -c "sysctl vm.overcommit_memory=1 &> /dev/null &&
  redis-server --appendonly yes --save 60 1 --bind 0.0.0.0
  --port ${REDIS_PORT:-6379} --requirepass ${REDIS_PASSWORD:?}"

The >- strips trailing newlines, keeping it tight; test it, as Docker Compose parses it identically to the original but won't scroll off editors. If you need literal newlines for a true multiline script (e.g., for debugging echoes), switch to | but wrap carefully to avoid shell parse fails that single lines dodge. Worth it if your YAML often balloons like this, saves sanity over endless horizontal scrolling in tools without wrap.

## User

_Time: 2025-08-31T08:22:44.489Z_

```dockercompose


  redis:
    # 🔹🔹 Redis 🔹🔹
    # NOTE: If you want to use Valkey (open source) instead of Redis (source available),
    # uncomment the Valkey statement and comment out the Redis statement.
    # Using Valkey with Firecrawl is untested and not guaranteed to work. Use with caution.
    image: docker.io/redis:alpine
    # image: valkey/valkey:alpine
    container_name: redis
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
      - publicnet
    expose:
      - ${REDIS_PORT:-6379}
    ports:
      - 127.0.0.1:${REDIS_PORT:-6379}:${REDIS_PORT:-6379}
    volumes:
      - ${CONFIG_PATH:-./configs}/redis:/data
    privileged: true
    environment:
      REDIS_HOST: ${REDIS_HOST:-redis}
      REDIS_PORT: ${REDIS_PORT:-6379}
      REDIS_DATABASE: ${REDIS_DATABASE:-0}
      REDIS_USERNAME: ${REDIS_USERNAME:-default}
      REDIS_PASSWORD: ${REDIS_PASSWORD:-redis}
    command: sh -c "sysctl vm.overcommit_memory=1 &> /dev/null && redis-server --appendonly yes --save 60 1 --bind 0.0.0.0 --port ${REDIS_PORT:-6379} --requirepass ${REDIS_PASSWORD:?}"
    labels:
      traefik.enable: true
      traefik.tcp.routers.redis.rule: HostSNI(`redis.$DOMAIN`) || HostSNI(`redis.$TS_HOSTNAME.$DOMAIN`)
      traefik.tcp.routers.redis.service: redis@docker
      traefik.tcp.routers.redis.tls.domains[0].main: $DOMAIN
      traefik.tcp.routers.redis.tls.domains[0].sans: $TS_HOSTNAME.$DOMAIN,$TS_HOSTNAME.$DOMAIN
      traefik.tcp.routers.redis.tls.passthrough: true
      traefik.tcp.services.redis.loadbalancer.server.port: ${REDIS_PORT:-6379}
      traefik.tcp.services.redis.loadbalancer.server.tls: true
    healthcheck:
      test: ["CMD-SHELL", "redis-cli ping > /dev/null 2>&1 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
    cpu_shares: 10
    mem_reservation: 200M
    deploy:
      resources:
        reservations:
          cpus: 0
          memory: 200M
        limits:
          cpus: 0.5
          memory: 4G
    restart: always
```

how to multiline split the `command` so it's less ugly and falling off the page on the righthand side?

your solution must make the `command:` 5 or more lines total! Preferably 1 word per line.

## Assistant

_Time: 2025-08-31T08:23:08.023Z_

command:
  - sh
  - -c
  - |
    sysctl
    vm.overcommit_memory=1
    &>
    /dev/null
    &&
    redis-server
    \
    --appendonly
    yes
    \
    --save
    60
    1
    \
    --bind
    0.0.0.0
    \
    --port
    ${REDIS_PORT:-6379}
    \
    --requirepass
    ${REDIS_PASSWORD:?}

## User

_Time: 2025-08-31T08:23:22.567Z_

obviously i want you to split this into multiple lines too???
 
| sysctl vm.overcommit_memory=1 &> /dev/null && redis-server
--appendonly yes
--save 60 1
--bind 0.0.0.0
--port ${REDIS_PORT:-6379}
--requirepass ${REDIS_PASSWORD:?}

## Assistant

_Time: 2025-08-31T08:23:30.631Z_

<xaiArtifact artifact_id="d599dc9c-dc35-4246-acfb-0293b6135814" artifact_version_id="19563676-a6fe-4ce9-b1a7-19bec764e10e" title="docker-compose.yml" contentType="text/yaml">
redis:
  image: docker.io/redis:alpine
  container_name: redis
  extra_hosts:
    - host.docker.internal:host-gateway
  networks:
    - backend
    - publicnet
  expose:
    - ${REDIS_PORT:-6379}
  ports:
    - 127.0.0.1:${REDIS_PORT:-6379}:${REDIS_PORT:-6379}
  volumes:
    - ${CONFIG_PATH:-./configs}/redis:/data
  privileged: true
  environment:
    REDIS_HOST: ${REDIS_HOST:-redis}
    REDIS_PORT: ${REDIS_PORT:-6379}
    REDIS_DATABASE: ${REDIS_DATABASE:-0}
    REDIS_USERNAME: ${REDIS_USERNAME:-default}
    REDIS_PASSWORD: ${REDIS_PASSWORD:-redis}
  command:
    - sh
    - -c
    - |
      sysctl
      vm.overcommit_memory=1
      &>
      /dev/null
      &&
      redis-server
      --appendonly
      yes
      --save
      60
      1
      --bind
      0.0.0.0
      --port
      ${REDIS_PORT:-6379}
      --requirepass
      ${REDIS_PASSWORD:?}
  labels:
    traefik.enable: true
    traefik.tcp.routers.redis.rule: HostSNI(`redis.$DOMAIN`) || HostSNI(`redis.$TS_HOSTNAME.$DOMAIN`)
    traefik.tcp.routers.redis.service: redis@docker
    traefik.tcp.routers.redis.tls.domains[0].main: $DOMAIN
    traefik.tcp.routers.redis.tls.domains[0].sans: $TS_HOSTNAME.$DOMAIN,$TS_HOSTNAME.$DOMAIN
    traefik.tcp.routers.redis.tls.passthrough: true
    traefik.tcp.services.redis.loadbalancer.server.port: ${REDIS_PORT:-6379}
    traefik.tcp.services.redis.loadbalancer.server.tls: true
  healthcheck:
    test: ["CMD-SHELL", "redis-cli ping > /dev/null 2>&1 || exit 1"]
    interval: 10s
    timeout: 5s
    retries: 5
  cpu_shares: 10
  mem_reservation: 200M
  deploy:
    resources:
      reservations:
        cpus: 0
        memory: 200M
      limits:
        cpus: 0.5
        memory: 4G
  restart: always
</xaiArtifact>
