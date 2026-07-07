---
source_url: "https://chatgpt.com/c/68ada23b-f708-8321-8e1e-4d5b674d0727"
conversation_id: "68ada23b-f708-8321-8e1e-4d5b674d0727"
title: "Troubleshoot Traefik exit"
extracted_at: "2026-06-29T13:58:04.392Z"
message_count: 2
provenance: auth-ui
---

# Troubleshoot Traefik exit

Source: [ChatGPT conversation](https://chatgpt.com/c/68ada23b-f708-8321-8e1e-4d5b674d0727)

## User

please determine why traefik is exiting with code 2 out of nowhere everytime i start it? i've tried rebooting, restarting docker with sudo systemctl restart docker and nothing works it just keeps exiting with exit code 2?




  traefik:
    # 🔹🔹 Traefik 🔹🔹
    depends_on:
      - crowdsec
      - nginx-traefik-extensions
    image:  docker.io/traefik:latest
    container_name: traefik
    hostname: traefik
    extra_hosts:
      - 'host.docker.internal:host-gateway'
    networks:
      - publicnet
      - coolify
    expose:
      - 8080          # Dashboard API
    ports:
      - 80:80         # HTTP
      - 443:443       # HTTPS
      - 443:443/udp   # HTTPS/3
      - 853:853       # DNS over TLS
    cap_add:
      - NET_ADMIN
    volumes:
      - /data/coolify/proxy/traefik/dynamic:/traefik/dynamic
      - /data/coolify/proxy/certs:/certs
      - /data/coolify/proxy/traefik/config:/config
      - /data/coolify/proxy/traefik/plugins-local:/plugins-local
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /data/coolify/proxy/traefik/etc/traefik:/etc/traefik/  # Put the provided fileConfig.yml files at this location
      - /data/coolify/proxy/logs:/var/log/traefik
    #      - /etc/localtime:/etc/localtime:ro
    configs:
      - source: traefik-dynamic.yaml
        target: /traefik/dynamic/core.yaml
        mode: 0644
    environment:
      LETS_ENCRYPT_EMAIL: ${ACME_RESOLVER_EMAIL:?}
      CLOUDFLARE_EMAIL: ${CLOUDFLARE_EMAIL:?}
      CLOUDFLARE_API_KEY: ${CLOUDFLARE_API_KEY:?}
      CLOUDFLARE_ZONE_ID: ${CLOUDFLARE_ZONE_ID:?}
      DUCKDNS_TOKEN: ${DUCKDNS_TOKEN:?}
    command:
      - '--accessLog=true'
      - '--accessLog.bufferingSize=0'
      - '--accessLog.fields.headers.defaultMode=drop'
      - '--accessLog.fields.headers.names.User-Agent=keep'
      - '--accessLog.filePath=/var/log/traefik/traefik.log'
      - '--accessLog.filters.statusCodes=200-299,400-499'
      - '--accessLog.format=json'
      - '--metrics.prometheus.buckets=0.1,0.3,1.2,5.0'
      - '--api.dashboard=true'
      - '--api.debug=true'
      - '--api.disableDashboardAd=true'
      - '--api.insecure=false'
      - '--certificatesResolvers.letsencrypt.acme.caServer=https://acme-v02.api.letsencrypt.org/directory'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge=true'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.provider=cloudflare'  # or duckdns
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.resolvers=1.1.1.1,1.0.0.1'
      - '--certificatesResolvers.letsencrypt.acme.email=${ACME_RESOLVER_EMAIL:?}'
      - '--certificatesResolvers.letsencrypt.acme.httpChallenge=true'
      - '--certificatesResolvers.letsencrypt.acme.httpChallenge.entryPoint=web'
      - '--certificatesResolvers.letsencrypt.acme.tlsChallenge=true'
      - '--certificatesResolvers.letsencrypt.acme.storage=/certs/acme.json'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.propagation.disableChecks=true'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.propagation.delayBeforeChecks=60'
      - '--entryPoints.dot.address=:853'
      - '--entryPoints.web.address=:80'
      - '--entryPoints.web.forwardedHeaders.trustedIPs=103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,104.16.0.0/13,104.24.0.0/14,108.162.192.0/18,131.0.72.0/22,141.101.64.0/18,162.158.0.0/15,172.64.0.0/13,173.245.48.0/20,188.114.96.0/20,190.93.240.0/20,197.234.240.0/22,198.41.128.0/17,2400:cb00::/32,2606:4700::/32,2803:f800::/32,2405:b500::/32,2405:8100::/32,2a06:98c0::/29,2c0f:f248::/32'
      - '--entryPoints.web.http.encodeQuerySemiColons=true'
      - '--entryPoints.web.http.middlewares=crowdsec@file'
      - '--entryPoints.web.http2.maxConcurrentStreams=250'
      - '--entryPoints.websecure.address=:443'
      - '--entryPoints.websecure.forwardedHeaders.trustedIPs=103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,104.16.0.0/13,104.24.0.0/14,108.162.192.0/18,131.0.72.0/22,141.101.64.0/18,162.158.0.0/15,172.64.0.0/13,173.245.48.0/20,188.114.96.0/20,190.93.240.0/20,197.234.240.0/22,198.41.128.0/17,2400:cb00::/32,2606:4700::/32,2803:f800::/32,2405:b500::/32,2405:8100::/32,2a06:98c0::/29,2c0f:f248::/32'
      - '--entryPoints.websecure.http.encodeQuerySemiColons=true'
      - '--entryPoints.websecure.http.middlewares=crowdsec@file,bolabaden-error-pages@file,strip-www@file'
      - '--entryPoints.websecure.http.tls=true'
      - '--entryPoints.websecure.http.tls.certResolver=letsencrypt'
      - '--entryPoints.websecure.http.tls.domains[0].main=${DOMAIN}'
      - '--entryPoints.websecure.http.tls.domains[0].sans=*.${DOMAIN},*.${TS_HOSTNAME}.${DOMAIN}'
      - '--entryPoints.websecure.http.tls.domains[1].main=${DUCKDNS_DOMAIN}'
      - '--entryPoints.websecure.http.tls.domains[1].sans=*.${DUCKDNS_DOMAIN},*.${TS_HOSTNAME}.${DUCKDNS_DOMAIN}'
      - '--entryPoints.websecure.http2.maxConcurrentStreams=250'
      - '--entryPoints.websecure.http3'
      - '--global.checkNewVersion=true'
      - '--global.sendAnonymousUsage=false'
      - '--log.level=DEBUG'
      - '--ping=true'
      - '--providers.docker=true'
      - '--providers.docker.network=publicnet'
      - '--providers.docker.defaultRule=Host({{ normalize .ContainerName }}.${DOMAIN}) || Host({{ normalize .ContainerName }}.${TS_HOSTNAME}.${DOMAIN}) || Host({{ normalize .ContainerName }}.${DUCKDNS_DOMAIN}) || Host({{ normalize .ContainerName }}.${TS_HOSTNAME}.${DUCKDNS_DOMAIN})'
      - '--providers.docker.exposedByDefault=false'
      - '--providers.file.directory=/traefik/dynamic/'
      - '--providers.file.watch=true'
      - '--serversTransport.insecureSkipVerify=true'
      - '--experimental.plugins.bouncer.modulename=github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin'
      - '--experimental.plugins.bouncer.version=v1.4.2'
    labels:
      traefik.enable: true
      traefik.http.routers.traefik.service: api@internal
      traefik.http.routers.traefik.rule: Host(traefik.${DOMAIN}) || Host(traefik.${TS_HOSTNAME}.${DOMAIN}) || Host(traefik.${DUCKDNS_DOMAIN}) || Host(traefik.${TS_HOSTNAME}.${DUCKDNS_DOMAIN})
      traefik.http.services.traefik.loadbalancer.server.port: 8080

I have made zero changes to this configuration which is the weird thing.



more logs:

ubuntu@beatapostapita:~/my-media-stack$ sudo systemctl status docker --no-pager -o cat
● docker.service - Docker Application Container Engine
     Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; preset: enabled)
     Active: active (running) since Tue 2025-08-26 06:59:46 CDT; 1min 38s ago
TriggeredBy: ● docker.socket
       Docs: https://docs.docker.com
   Main PID: 1481827 (dockerd)
      Tasks: 314
     Memory: 135.4M (peak: 140.0M)
        CPU: 10.034s
     CGroup: /system.slice/docker.service
             ├─1481827 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
             ├─1483456 /usr/bin/docker-proxy -proto tcp -host-ip 127.0.0.1 -host-port 2375 -container-ip 172.18.0.3 -container-port 2375 -use-listen-fd
             ├─1484287 /usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 9001 -container-ip 10.0.0.2 -container-port 9001 -use-listen-fd
             ├─1484294 /usr/bin/docker-proxy -proto tcp -host-ip :: -host-port 9001 -container-ip fd00:dead:beef::2 -container-port 9001 -use-listen-fd
             ├─1484508 /usr/bin/docker-proxy -proto tcp -host-ip 127.0.0.1 -host-port 9876 -container-ip 172.16.3.3 -container-port 8080 -use-listen-fd
             ├─1485050 /usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 80 -container-ip 172.16.3.5 -container-port 80 -use-listen-fd
             ├─1485057 /usr/bin/docker-proxy -proto tcp -host-ip :: -host-port 80 -container-ip 172.16.3.5 -container-port 80 -use-listen-fd
             ├─1485073 /usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 443 -container-ip 172.16.3.5 -container-port 443 -use-listen-fd
             ├─1485090 /usr/bin/docker-proxy -proto tcp -host-ip :: -host-port 443 -container-ip 172.16.3.5 -container-port 443 -use-listen-fd
             ├─1485107 /usr/bin/docker-proxy -proto udp -host-ip 0.0.0.0 -host-port 443 -container-ip 172.16.3.5 -container-port 443 -use-listen-fd
             ├─1485120 /usr/bin/docker-proxy -proto udp -host-ip :: -host-port 443 -container-ip 172.16.3.5 -container-port 443 -use-listen-fd
             ├─1485126 /usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 853 -container-ip 172.16.3.5 -container-port 853 -use-listen-fd
             ├─1485133 /usr/bin/docker-proxy -proto tcp -host-ip :: -host-port 853 -container-ip 172.16.3.5 -container-port 853 -use-listen-fd
             ├─1485275 /usr/bin/docker-proxy -proto tcp -host-ip 127.0.0.1 -host-port 9443 -container-ip 172.18.0.8 -container-port 9443 -use-listen-fd
             ├─1485327 /usr/bin/docker-proxy -proto tcp -host-ip 127.0.0.1 -host-port 6379 -container-ip 10.0.26.4 -container-port 6379 -use-listen-fd
             ├─1485430 /usr/bin/docker-proxy -proto tcp -host-ip 127.0.0.1 -host-port 2020 -container-ip 10.45.0.3 -container-port 2020 -use-listen-fd
             ├─1485701 /usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 11470 -container-ip 10.45.0.4 -container-port 11470 -use-listen-fd
             ├─1485709 /usr/bin/docker-proxy -proto tcp -host-ip :: -host-port 11470 -container-ip 10.45.0.4 -container-port 11470 -use-listen-fd
             ├─1485721 /usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 12470 -container-ip 10.45.0.4 -container-port 12470 -use-listen-fd
             ├─1485733 /usr/bin/docker-proxy -proto tcp -host-ip :: -host-port 12470 -container-ip 10.45.0.4 -container-port 12470 -use-listen-fd
             ├─1486438 /usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 9000 -container-ip 172.18.0.31 -container-port 9000 -use-listen-fd
             ├─1486444 /usr/bin/docker-proxy -proto tcp -host-ip :: -host-port 9000 -container-ip 172.18.0.31 -container-port 9000 -use-listen-fd
             ├─1486453 /usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 9002 -container-ip 172.18.0.31 -container-port 9001 -use-listen-fd
             ├─1486462 /usr/bin/docker-proxy -proto tcp -host-ip :: -host-port 9002 -container-ip 172.18.0.31 -container-port 9001 -use-listen-fd
             ├─1486532 /usr/bin/docker-proxy -proto tcp -host-ip 127.0.0.1 -host-port 5572 -container-ip 172.18.0.34 -container-port 5572 -use-listen-fd
             ├─1486540 /usr/bin/docker-proxy -proto tcp -host-ip 127.0.0.1 -host-port 5575 -container-ip 172.18.0.34 -container-port 5575 -use-listen-fd
             ├─1486750 /usr/bin/docker-proxy -proto tcp -host-ip 127.0.0.1 -host-port 8000 -container-ip 10.45.0.5 -container-port 8000 -use-listen-fd
             ├─1486807 /usr/bin/docker-proxy -proto tcp -host-ip 127.0.0.1 -host-port 8888 -container-ip 10.45.0.7 -container-port 8888 -use-listen-fd
             ├─1486874 /usr/bin/docker-proxy -proto tcp -host-ip 127.0.0.1 -host-port 3000 -container-ip 10.45.0.9 -container-port 3000 -use-listen-fd
             └─1486944 /usr/bin/docker-proxy -proto tcp -host-ip 127.0.0.1 -host-port 9696 -container-ip 10.45.0.10 -container-port 9696 -use-listen-fd

time="2025-08-26T07:00:27.702413472-05:00" level=error msg="Handler for POST /v1.51/networks/create returned error: failed to allocate gateway (10.45.0.1): Address already in use"
time="2025-08-26T07:00:33.881631526-05:00" level=error msg="Handler for POST /v1.51/networks/create returned error: failed to allocate gateway (10.45.0.1): Address already in use"
time="2025-08-26T07:00:39.858248773-05:00" level=error msg="Handler for POST /v1.51/networks/create returned error: failed to allocate gateway (10.45.0.1): Address already in use"
time="2025-08-26T07:00:45.720798052-05:00" level=error msg="Handler for POST /v1.51/networks/create returned error: failed to allocate gateway (10.45.0.1): Address already in use"
time="2025-08-26T07:00:51.413209698-05:00" level=error msg="Handler for POST /v1.51/networks/create returned error: failed to allocate gateway (10.45.0.1): Address already in use"
time="2025-08-26T07:00:56.952323757-05:00" level=error msg="Handler for POST /v1.51/networks/create returned error: failed to allocate gateway (10.45.0.1): Address already in use"
time="2025-08-26T07:01:02.273626843-05:00" level=error msg="Handler for POST /v1.51/networks/create returned error: failed to allocate gateway (10.45.0.1): Address already in use"
time="2025-08-26T07:01:07.723820306-05:00" level=error msg="Handler for POST /v1.51/networks/create returned error: failed to allocate gateway (10.45.0.1): Address already in use"
time="2025-08-26T07:01:18.935461010-05:00" level=error msg="Handler for POST /v1.51/networks/create returned error: failed to allocate gateway (10.45.0.1): Address already in use"
time="2025-08-26T07:01:24.239910613-05:00" level=error msg="Handler for POST /v1.51/networks/create returned error: failed to allocate gateway (10.45.0.1): Address already in use"

how to resolve the traefik problem. Ignore the errors above unless they're guaranteed determined to be relevant. I'm not using nor defining 10.45.0.1 literally anywhere in my compose yaml so i doubt it. Web search and research exhaustively for this issue.

Show more

## Assistant

Short answer up front: the most likely causes are (in order) — an incompatible Traefik version/CLI flag (you pulled :latest which may be v3 and your flags/configs are v2), a plugin panic (the CrowdSec bouncer), or a mount/permission problem (acme.json / mounted files appearing as directories). All of those are known to cause Traefik to die quickly (often with exit code 2). I’ll show precise checks, commands to run, what to look for in the output, and safe fixes. (I researched community reports & docs to back this up.) 
GitHub
+1
Traefik Docs
Traefik Labs Community Forum
+1

What to do now — quick checklist (run these in order)

Run each command and paste the exact output if you want me to read it and continue troubleshooting.

Check the Traefik container logs (this usually shows the exact startup error):

Bash
docker logs --tail 200 traefik
# or if you use docker-compose:
docker compose logs --no-color --tail=200 traefik

Look for messages like unknown flag, failed to decode configuration from flags, permissions ... too open, is a directory, panic: or unable to get ACME account: — each one points to a different root cause. Unknown/invalid flag errors are especially common after :latest upgrades. 
Traefik Labs Community Forum
+1

Confirm which Traefik image/version the container is actually running:

Bash
docker inspect --format='{{.Config.Image}}' traefik
docker images | grep traefik

If the image tag is latest (or v3.x) but your config/flags expect v2 behavior, that mismatch often leads to immediate exit. Many people hit this after latest upgraded to v3. If you see traefik:3.x or just traefik:latest, pin to a v2 tag for now (example below). 
Traefik Docs
Docker Hub

Inspect the container’s mounts and files (common failure mode: Docker created a directory where Traefik expects a file):

Bash
docker inspect traefik --format '{{json .Mounts}}' | jq
# On the host, check the paths you mount:
ls -la /data/coolify/proxy/traefik/etc/traefik
ls -la /data/coolify/proxy/certs
file /data/coolify/proxy/certs/acme.json || true

If a bind-mount source does not exist, Docker sometimes auto-creates a directory and that makes Traefik try to read a directory as a config file — Traefik will error out. People repeatedly see /etc/traefik/traefik.yml is a directory or read acme.json: is a directory. Fix: ensure the host path exists and is the correct file type. 
Traefik Labs Community Forum
GitHub

Check acme.json permissions (ACME issues can make Traefik skip resolvers or report errors):

Bash
ls -l /data/coolify/proxy/certs/acme.json
# enforce correct perms:
chmod 600 /data/coolify/proxy/certs/acme.json
# if it’s a directory, delete and recreate as a file (be careful if it contains data):
rm -rf /data/coolify/proxy/certs/acme.json
touch /data/coolify/proxy/certs/acme.json
chmod 600 /data/coolify/proxy/certs/acme.json

Traefik wants 600 on acme files; otherwise it will complain like permissions 777 ... are too open, please use 600. 
Traefik Labs Community Forum
Stack Overflow

Temporarily disable plugins and extra experimental flags (quick test):

Edit your compose to remove the two plugin arguments and the --experimental.plugins.bouncer.version/... lines (or comment them out).

Then restart traefik only:

Bash
docker compose up --force-recreate --no-deps -d traefik
docker logs --follow traefik

Plugins can cause immediate panics during load and crash Traefik. Many cases in the community show plugins bringing Traefik down. If Traefik starts after removing plugin lines, the plugin is the culprit and you’ll need a plugin build compatible with your Traefik version or use the plugin in the correct plugin system (localPlugins vs experimental.plugins) for your Traefik major version. 
GitHub
Traefik Labs Community Forum

If you still don’t see a clear error, run Traefik in the foreground to see immediate stdout:

Bash
# quick isolated test (no volumes except docker.sock) - prints startup logs then exits if bad args
docker run --rm --name traefik-test -v /var/run/docker.sock:/var/run/docker.sock:ro traefik:latest --log.level=DEBUG

If this shows unknown flag: --entryPoints.web.address or similar, you have incompatible CLI flags (we’ll fix them). Running with minimal mounts isolates the problem from mounts/permissions. 
Traefik Labs Community Forum

Most likely root causes (what I found in the wild) and how to fix each
1) :latest upgraded Traefik to v3, your CLI flags / static config are v2-style → Traefik fails immediately

Why: v3 changed/removed some CLI options and names; Traefik will fail to decode flags and exit. Many people hit this when using image: traefik:latest.
How to check & fix:

Check docker inspect to see the image tag (see step 2).

If you want to stay on v2 until you migrate configs, pin the image to a v2 tag (example):

YAML
image: traefik:2.11.6
# then:
docker compose pull traefik
docker compose up -d traefik

This is the fastest way to test whether a v3 upgrade is the cause. (If pinning fixes it, then either adapt config to v3 or keep v2 pinned.) 
Traefik Docs
Traefik Labs

2) Invalid/removed CLI flags or syntax errors in command/flags → Traefik prints unknown flag / failed to decode configuration from flags and exits with code 2

Why: a single unknown flag makes Traefik refuse to start.
How to check & fix:

Check container logs for unknown flag or failed to decode configuration from flags: field not found. If you see this, remove or change the offending flag to the new v3 equivalent or pin to a v2 image. Example community hits are common. 
Traefik Labs Community Forum
+1

3) A plugin panics during load (CrowdSec bouncer or other experimental plugin) → immediate crash

Why: plugins (Yaegi or WASM) can panic at startup and kill Traefik. People have reported plugin-download failures and panics that take Traefik down.
How to check & fix:

Remove --experimental.plugins.* lines and restart. If that fixes it, investigate plugin compatibility (Traefik v2 vs v3 may expect different plugin APIs) or remove plugin. Alternatively run with plugin download logging enabled and update plugin version. 
Traefik Labs Community Forum
GitHub

4) Mount problems or acme.json is a directory / wrong permissions → Traefik errors about reading files and exits

Why: when a mapped file doesn’t exist on host, Docker sometimes creates a directory or the file has wrong perms. Traefik errors like read acme.json: is a directory or permissions ... too open are common.
How to check & fix:

ls -la the mounted paths on host and ensure files exist and have proper permissions (chmod 600 acme.json). If a mount created a directory by accident, remove it and create correct files before starting. 
Traefik Labs Community Forum
+1

5) Docker network / gateway errors (your daemon logs showing failed to allocate gateway (10.45.0.1): Address already in use)

Why: can indicate overlapping macvlan/bridge networks or other network conflicts; sometimes docker network create fails. This may be unrelated to a Traefik binary crash, but it can prevent networks Traefik expects from being created. Since your logs showed repeated gateway allocation errors, investigate networks if other checks don’t reveal the problem.
How to check:

Bash
docker network ls
docker network inspect publicnet
# check for overlapping subnets:
ip -4 addr show

If networks conflict (macvlan/gateway), adjust subnet/gateway or remove the conflicting network. 
Stack Overflow
Docker Community Forums

Example minimal test compose to isolate the problem

Create debug-traefik.yml (it pins to v2, uses minimal args, no plugins, minimal mounts):

YAML
version: "3.8"
services:
  traefik:
    image: traefik:2.11.6
    command:
      - "--api.dashboard=true"
      - "--log.level=DEBUG"
      - "--providers.docker=true"
      - "--entryPoints.web.address=:80"
      - "--entryPoints.websecure.address=:443"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    restart: "no"

Run:

Bash
docker compose -f debug-traefik.yml up

If this starts successfully, the problem is in your original flags/plugins/mounts — compare and reintroduce items one-by-one until it breaks (binary-search the failure).

Summary of the actionable next steps (in order)

docker logs traefik — paste the exact startup error here. (This is the single most useful thing.)

docker inspect --format='{{.Config.Image}}' traefik — check the tag (v3 vs v2). If it’s latest and is v3, pin to traefik:2.11.6 and retry. 
Docker Hub
Traefik Docs

If logs show unknown flag / failed to decode configuration, remove the offending flags or pin to v2. 
Traefik Labs Community Forum

Temporarily remove --experimental.plugins.* lines and restart to test plugin-caused crashes. 
Traefik Labs Community Forum

Verify mounts and acme.json are files with correct permissions (chmod 600 acme.json). If a mount points to a non-existent file, create it on host first. 
Traefik Labs Community Forum
+1

If you still see nothing useful in logs, run the simple docker run --rm traefik:latest --log.level=DEBUG test to get immediate CLI error output.

Why I focused on these things (short rationale + sources)

Traefik commonly exits with code 2 for invalid CLI/flag/config syntax or when it can’t read secrets — see historical reports and GitHub issues. 
GitHub
+1

Using image: docker.io/traefik:latest can pull a major version that changes flags/config — a frequent cause of sudden failures. Pinning to a v2 image is a fast diagnostic/fix. 
Traefik Docs

Plugins have crashed Traefik in the wild (panic/download errors). Removing plugins as a test is low-risk and fast. 
GitHub
Traefik Labs Community Forum

acme.json (and bind mounts) frequently cause cryptic startup errors if the file is missing, a directory, or has wrong permissions; Traefik checks for 600. 
Traefik Labs Community Forum
GitHub

If you want, paste the exact contents of the first ~100 lines from docker logs traefik here and I’ll parse it and point to the exactly offending flag/file/plugin and give the exact minimal change to fix it. If you’d rather I suggest a safe immediate patch to get the proxy back up, I can provide a pinned, minimal compose replacement that is known to start and will preserve your existing volumes.
