---
source_url: "https://grok.com/c/f5e128bd-d79e-429d-97d2-a976ff327989"
conversation_id: "f5e128bd-d79e-429d-97d2-a976ff327989"
title: "Fixing Traefik ACME SSL Errors"
extracted_at: "2026-06-29T16:23:34.992Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Fixing Traefik ACME SSL Errors

Source: [Grok conversation](https://grok.com/c/f5e128bd-d79e-429d-97d2-a976ff327989)

## User

_Time: 2025-08-30T00:31:43.349Z_

```
2025-08-30T00:29:54Z ERR Unable to obtain ACME certificate for domains error="unable to generate a certificate for the domains [bolabaden.org *.bolabaden.org *.micklethefickle.bolabaden.org]: error: one or more domains had a problem:\n[bolabaden.org] invalid authorization: acme: error: 403 :: urn:ietf:params:acme:error:unauthorized :: Cannot negotiate ALPN protocol \"acme-tls/1\" for tls-alpn-01 challenge\n" ACME CA=https://acme-v02.api.letsencrypt.org/directory acmeCA=https://acme-v02.api.letsencrypt.org/directory domains=["bolabaden.org","*.bolabaden.org","*.micklethefickle.bolabaden.org"] providerName=letsencrypt.acme routerName=websecure-hedgedoc-direct@docker rule="Host(`hedgedoc.bolabaden.org`) || Host(`hedgedoc.micklethefickle.bolabaden.org`)"
```

how to fix the above error in traefik?
 
also i'm getting this error when trying to visit e.g. whoami.micklethefickle.bolabaden.org:
 

```

ERR_SSL_VERSION_OR_CIPHER_MISMATCH
This site can’t provide a secure connection
whoami.beatapostapita.bolabaden.org uses an unsupported protocol.

Unsupported protocol
The client and server don't support a common SSL protocol version or cipher suite.
```

i'm beyond confused. What am I doing wrong here?
 

```


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
```

## Assistant

_Time: 2025-08-30T00:34:53.449Z_

The provided error log indicates an issue with Traefik's ACME certificate issuance process using Let's Encrypt. Specifically, the failure occurs during the TLS-ALPN-01 challenge for the domain "bolabaden.org," where the ACME server cannot negotiate the required "acme-tls/1" ALPN protocol. This problem arises because multiple challenge methods (DNS, HTTP, and TLS) are enabled in the Traefik configuration, and the TLS challenge is being attempted for the non-wildcard domain. Given the use of Cloudflare for DNS and the likely proxying of traffic, the TLS challenge connects to Cloudflare's edge servers rather than directly to Traefik, and Cloudflare does not support the "acme-tls/1" protocol.

To resolve this, modify the Traefik command flags in the docker-compose file to disable the HTTP and TLS challenges, ensuring only the DNS challenge is used. This approach is suitable for both wildcard and non-wildcard domains, as it leverages Cloudflare's DNS API to validate ownership without requiring direct access to the server. Remove the following lines from the command section:

- '--certificatesResolvers.letsencrypt.acme.httpChallenge=true'
- '--certificatesResolvers.letsencrypt.acme.httpChallenge.entryPoint=web'
- '--certificatesResolvers.letsencrypt.acme.tlsChallenge=true'

After making these changes, restart the Traefik container to reattempt certificate issuance. Verify the process by checking the Traefik logs for successful ACME resolution.

Regarding the ERR_SSL_VERSION_OR_CIPHER_MISMATCH error when accessing subdomains such as "whoami.micklethefickle.bolabaden.org" (noting the potential discrepancy with "beatapostapita" in the provided message, which may indicate a similar subdomain), this stems from Cloudflare's SSL configuration. Cloudflare's free Universal SSL certificates cover the root domain and first-level subdomains (e.g., *.bolabaden.org), but not deeper levels (e.g., *.micklethefickle.bolabaden.org, which applies to "whoami.micklethefickle.bolabaden.org"). When these deeper subdomains are proxied through Cloudflare (orange cloud enabled), the edge certificate cannot match the hostname, leading to the cipher or protocol mismatch during the TLS handshake.

To address this, configure the relevant DNS records in Cloudflare (e.g., the CNAME or A record for *.micklethefickle.bolabaden.org or specific subdomains like whoami.micklethefickle.bolabaden.org) to "DNS Only" mode (grey cloud). This bypasses Cloudflare's proxy, allowing direct connections to Traefik, where the Let's Encrypt certificate—covering the required wildcards—can handle TLS termination. Ensure your server's firewall permits inbound traffic on ports 80 and 443 for direct access.

If proxying through Cloudflare is essential for these subdomains (e.g., for DDoS protection or CDN features), subscribe to Cloudflare's Advanced Certificate Manager ($10/month) to obtain certificates that support multi-level wildcards. Alternatively, consider uploading the Let's Encrypt wildcard certificate to Cloudflare as a custom certificate, though this requires automation for renewals due to the 90-day validity period.

Once the certificate issuance succeeds and the DNS proxy settings are adjusted, retest access to the subdomains to confirm resolution. If issues persist, inspect Traefik's access logs and Cloudflare's DNS settings for further discrepancies.
