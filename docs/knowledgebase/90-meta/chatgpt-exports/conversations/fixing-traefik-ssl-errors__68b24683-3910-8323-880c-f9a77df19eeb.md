---
source_url: "https://chatgpt.com/c/68b24683-3910-8323-880c-f9a77df19eeb"
conversation_id: "68b24683-3910-8323-880c-f9a77df19eeb"
title: "Fixing Traefik SSL Errors"
extracted_at: "2026-06-29T11:06:55.850Z"
message_count: 4
provenance: auth-ui
---

# Fixing Traefik SSL Errors

Source: [ChatGPT conversation](https://chatgpt.com/c/68b24683-3910-8323-880c-f9a77df19eeb)

## User

2025-08-30T00:29:54Z ERR Unable to obtain ACME certificate for domains error="unable to generate a certificate for the domains [bolabaden.org *.bolabaden.org *.micklethefickle.bolabaden.org]: error: one or more domains had a problem:\n[bolabaden.org] invalid authorization: acme: error: 403 :: urn:ietf:params:acme:error:unauthorized :: Cannot negotiate ALPN protocol \"acme-tls/1\" for tls-alpn-01 challenge\n" ACME CA=https://acme-v02.api.letsencrypt.org/directory acmeCA=https://acme-v02.api.letsencrypt.org/directory domains=["bolabaden.org","*.bolabaden.org","*.micklethefickle.bolabaden.org"] providerName=letsencrypt.acme routerName=websecure-hedgedoc-direct@docker rule="Host(`hedgedoc.bolabaden.org`) || Host(`hedgedoc.micklethefickle.bolabaden.org`)"


how to fix the above error in traefik?
 
also i'm getting this error when trying to visit e.g. whoami.micklethefickle.bolabaden.org:
 


ERR_SSL_VERSION_OR_CIPHER_MISMATCH
This site can’t provide a secure connection
whoami.beatapostapita.bolabaden.org uses an unsupported protocol.

Unsupported protocol
The client and server don't support a common SSL protocol version or cipher suite.


i'm beyond confused. What am I doing wrong here?
 


traefik:
    # 🔹🔹 Traefik 🔹🔹
    depends_on:
      - crowdsec
      - failover-proxy
      - nginx-traefik-extensions
    image:  docker.io/traefik:latest
    container_name: traefik
    hostname: traefik
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      publicnet:
        gw_priority: 1
      warp-nat-net: {}
      backend: {}
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
      - /data/coolify/proxy/logs:/var/log/traefik:rw
    #      - /etc/localtime:/etc/localtime:ro
    configs:
      - source: traefik-dynamic-core.yaml
        target: /traefik/dynamic/core.yaml
        mode: 0644
    environment:
      LETS_ENCRYPT_EMAIL: ${ACME_RESOLVER_EMAIL:?}
      CLOUDFLARE_EMAIL: ${CLOUDFLARE_EMAIL:?}
      CLOUDFLARE_API_KEY: ${CLOUDFLARE_API_KEY:?}
      CLOUDFLARE_ZONE_ID: ${CLOUDFLARE_ZONE_ID:?}
    command:
      - '--accessLog=true'
      - '--accessLog.bufferingSize=0'
      - '--accessLog.fields.headers.defaultMode=drop'
      - '--accessLog.fields.headers.names.User-Agent=keep'
      - '--accessLog.filePath=/var/log/traefik/traefik.log'
      - '--accessLog.filters.statusCodes=100-999'
      - '--accessLog.format=json'
      - '--metrics.prometheus.buckets=0.1,0.3,1.2,5.0'
      - '--api.dashboard=true'
      - '--api.debug=true'
      - '--api.disableDashboardAd=true'
      - '--api.insecure=false'
      - '--certificatesResolvers.letsencrypt.acme.caServer=https://acme-v02.api.letsencrypt.org/directory'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge=true'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.provider=cloudflare'
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
      - '--entryPoints.web.forwardedHeaders.trustedIPs=103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,104.16.0.0/13,104.24.0.0/14,108.162.192.0/18,131.0.72.0/22,141.101.64.0/18,162.158.0.0/15,172.64.0.0/13,173.245.48.0/20,188.114.96.0/20,190.93.240.0/20,197.234.240.0/22,198.41.128.0/17,2400:cb00::/32,2405:8100::/32,2405:b500::/32,2606:4700::/32,2803:f800::/32,2a06:98c0::/29,2c0f:f248::/32'
      - '--entryPoints.web.http.encodeQuerySemiColons=true'
      - '--entryPoints.web.http.middlewares=crowdsec@file'
      - '--entryPoints.web.http2.maxConcurrentStreams=250'
      - '--entryPoints.websecure.address=:443'
      - '--entryPoints.websecure.forwardedHeaders.trustedIPs=103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,104.16.0.0/13,104.24.0.0/14,108.162.192.0/18,131.0.72.0/22,141.101.64.0/18,162.158.0.0/15,172.64.0.0/13,173.245.48.0/20,188.114.96.0/20,190.93.240.0/20,197.234.240.0/22,198.41.128.0/17,2400:cb00::/32,2405:8100::/32,2405:b500::/32,2606:4700::/32,2803:f800::/32,2a06:98c0::/29,2c0f:f248::/32'
      - '--entryPoints.websecure.http.encodeQuerySemiColons=true'
      - '--entryPoints.websecure.http.middlewares=crowdsec@file,bolabaden-error-pages@file,strip-www@file'
      - '--entryPoints.websecure.http.tls=true'
      - '--entryPoints.websecure.http.tls.certResolver=letsencrypt'
      - '--entryPoints.websecure.http.tls.domains[0].main=${DOMAIN}'
      - '--entryPoints.websecure.http.tls.domains[0].sans=*.${DOMAIN},*.${TS_HOSTNAME}.${DOMAIN}'
      - '--entryPoints.websecure.http2.maxConcurrentStreams=250'
      - '--entryPoints.websecure.http3'
      - '--global.checkNewVersion=true'
      - '--global.sendAnonymousUsage=false'
      - '--log.level=INFO'
      - '--ping=true'
      - '--providers.docker=true'
      - '--providers.docker.defaultRule=Host(`{{ normalize .ContainerName }}.${DOMAIN}`) || Host(`{{ normalize .ContainerName }}.${TS_HOSTNAME}.${DOMAIN}`) || Host(`{{ normalize .Name }}.${DOMAIN}`) || Host(`{{ normalize .Name }}.${TS_HOSTNAME}.${DOMAIN}`)'
      - '--providers.docker.exposedByDefault=false'
      - '--providers.file.directory=/traefik/dynamic/'
      - '--providers.file.watch=true'
      # alternatively use fail2ban instead here:
      - '--experimental.plugins.bouncer.modulename=github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin'
      - '--experimental.plugins.bouncer.version=v1.4.2'
      # TLS-specific option within the ServersTransport configuration.
      # When set to true, it disables the verification of the backend server's TLS certificate chain and hostname.
      # By default, this option is false, meaning Traefik would validate the certificate to ensure it is issued by a trusted certificate authority (CA), has not expired, and matches the expected hostname.
      # Setting it to true bypasses these checks, allowing connections to proceed even with self-signed, expired, or mismatched certificates.
      # This is useful for testing or when you need to connect to services that use self-signed certificates.
      # however, in our configuration, this is REQUIRED to be true (avoids errors like 'ERR 500 Internal Server Error error="tls: failed to verify certificate: x509: cannot validate certificate for 10.76.0.2 because it doesn't contain any IP SANs"')
      - '--serversTransport.insecureSkipVerify=true'
    labels:
      traefik.enable: true
      traefik.http.routers.traefik.service: api@internal
      traefik.http.routers.traefik.rule: Host(`traefik.${DOMAIN}`) || Host(`traefik.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.services.traefik.loadbalancer.server.port: 8080
#      traefik.http.middlewares.legalbar.plugin.bodyreplace.replacements[0].search: </body>
#      traefik.http.middlewares.legalbar.plugin.bodyreplace.replacements[0].replace: <div style='position:fixed;bottom:0;width:100%;background:#222;color:#fff;text-align:center;padding:6px;font-size:14px;z-index:9999;'><a href="https://${DOMAIN}/privacy-policy" style="color:#fff;margin:0 10px;">Privacy Policy</a> | <a href="https://${DOMAIN}/terms" style="color:#fff;margin:0 10px;">Terms</a> | <a href="https://${DOMAIN}/cookies-policy" style="color:#fff;margin:0 10px;">Cookies Policy</a> — © ${DOMAIN}</div></body>
      homepage.group: Infrastructure
      homepage.name: Traefik
      homepage.icon: traefik.png
      homepage.href: https://traefik.${DOMAIN}/api
      homepage.widget.type: traefik
      homepage.description: Reverse proxy entrypoint for all services with TLS, Cloudflare integration, and auth middleware
    healthcheck:
      test: ["CMD", "traefik", "healthcheck", "--ping"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 10s
    restart: always
Show more

## Assistant

Thanks for sharing all of this — the config and the exact errors really help. Let’s break it down step by step, because what’s happening here is a clash of ACME challenge types and Traefik misconfiguration.

1. Why you’re seeing the ACME error

Your error:

acme: error: 403 :: urn:ietf:params:acme:error:unauthorized :: Cannot negotiate ALPN protocol "acme-tls/1" for tls-alpn-01 challenge

This means Let’s Encrypt tried the tls-alpn-01 challenge (on port 443) but Traefik either:

didn’t advertise acme-tls/1, or

the request was intercepted (often by Cloudflare proxy/CDN).

Now, in your Traefik config, you’ve enabled all three challenge types:

YAML
--certificatesResolvers.letsencrypt.acme.httpChallenge=true
--certificatesResolvers.letsencrypt.acme.tlsChallenge=true
--certificatesResolvers.letsencrypt.acme.dnsChallenge=true

Traefik doesn’t try to be smart here — it can get confused.
👉 You should only enable one challenge type per resolver.

Since you’re already using Cloudflare and want wildcard domains (*.bolabaden.org), the only viable method is DNS-01. HTTP-01 and TLS-ALPN-01 won’t work reliably behind Cloudflare proxy.

2. Why you’re getting ERR_SSL_VERSION_OR_CIPHER_MISMATCH

That happens when:

The cert wasn’t issued (so Traefik is presenting a default/self-signed cert), and/or

ALPN negotiation is broken because of the above misconfigured TLS challenge.

Right now, because the cert request fails, Traefik is serving junk/no certs on those hosts → your browser complains with cipher mismatch.

3. How to fix it
a) Clean up ACME resolver config

Pick only DNS challenge with Cloudflare:

YAML
      - '--certificatesResolvers.letsencrypt.acme.caServer=https://acme-v02.api.letsencrypt.org/directory'
      - '--certificatesResolvers.letsencrypt.acme.email=${ACME_RESOLVER_EMAIL:?}'
      - '--certificatesResolvers.letsencrypt.acme.storage=/certs/acme.json'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.provider=cloudflare'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.resolvers=1.1.1.1,1.0.0.1'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.propagation.disableChecks=true'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.propagation.delayBeforeChecks=60'

🚫 Remove these:

YAML
--certificatesResolvers.letsencrypt.acme.httpChallenge=true
--certificatesResolvers.letsencrypt.acme.tlsChallenge=true
b) Check your TLS domain block

You already have:

YAML
      - '--entryPoints.websecure.http.tls=true'
      - '--entryPoints.websecure.http.tls.certResolver=letsencrypt'
      - '--entryPoints.websecure.http.tls.domains[0].main=${DOMAIN}'
      - '--entryPoints.websecure.http.tls.domains[0].sans=*.${DOMAIN},*.${TS_HOSTNAME}.${DOMAIN}'

That’s correct — Traefik will request a wildcard for ${DOMAIN} + ${TS_HOSTNAME}.${DOMAIN}.

⚠️ Make sure:

ACME_RESOLVER_EMAIL is set in your env.

DOMAIN is bolabaden.org

TS_HOSTNAME is micklethefickle

Then Traefik will request:

bolabaden.org

*.bolabaden.org

*.micklethefickle.bolabaden.org

✅ Exactly what you want.

c) Ensure Cloudflare setup is correct

For DNS-01 to work:

You need API key or token with DNS edit rights.

Cloudflare DNS zone for bolabaden.org must exist.

Doesn’t matter if orange cloud (proxy) is on or off, because DNS-01 never touches HTTP.

d) Nuke the broken certs

Traefik caches failed cert attempts. Run once:

Bash
docker exec -it traefik rm /certs/acme.json

(or rename it). Then restart Traefik so it can request fresh certs.

4. After that

The ACME error should disappear.

The SSL mismatch error should go away once real certs are served.

Browsers will load your whoami.micklethefickle.bolabaden.org fine.

✅ In short:
Use only DNS challenge with Cloudflare, clean up your cert resolver config, wipe acme.json, and restart Traefik.

Do you want me to rewrite your command: block into a cleaned-up minimal version that you can drop in and know it’ll work for Cloudflare + wildcard certs?

## User

should cloudflare be set to flexible for tls/ssl or what do i do?

## Assistant

Great question 👌 — this is super important because Cloudflare’s SSL/TLS mode changes how traffic reaches Traefik.

Let’s go through the options:

🔹 Cloudflare SSL/TLS Modes

Flexible

Cloudflare talks HTTPS with the client, but HTTP to your origin (Traefik).

❌ Bad for Traefik — Let’s Encrypt challenges and TLS negotiation will fail.

❌ Causes redirect loops if you force HTTPS in Traefik.

Never use this.

Full

Cloudflare talks HTTPS to Traefik, but doesn’t validate the cert.

Works, but if Traefik serves a self-signed cert, Cloudflare won’t care.

Ok for testing, not ideal for production.

Full (Strict) ✅

Cloudflare talks HTTPS to Traefik and validates the cert.

Requires Traefik to serve a valid Let’s Encrypt cert.

This is the correct, secure setup.

🔹 For your setup

Since you’re issuing real Let’s Encrypt certs in Traefik:

Set Cloudflare SSL/TLS mode = Full (Strict).

That way, Cloudflare and browsers both get valid certs.

No more cipher mismatch / protocol errors.

🔹 Checklist

In Cloudflare dashboard → SSL/TLS → Set to Full (Strict).

Make sure DNS records (A/CNAME) point to your Traefik server IP.

Wildcards (*.bolabaden.org, *.micklethefickle.bolabaden.org) should exist as DNS records in Cloudflare.

Orange cloud (proxy) can be ON — Traefik doesn’t care, since you’re using DNS-01 challenge.

✅ TL;DR:
Set Cloudflare to Full (Strict), never Flexible.
That plus fixing your Traefik config (DNS-01 only) will resolve both the ACME failure and the SSL mismatch.

Want me to also show you how to test that Traefik is actually serving the Let’s Encrypt cert (before Cloudflare interferes), using curl --resolve?
