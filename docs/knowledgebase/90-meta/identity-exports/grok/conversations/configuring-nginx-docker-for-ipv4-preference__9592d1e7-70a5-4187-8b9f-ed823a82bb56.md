---
source_url: "https://grok.com/c/9592d1e7-70a5-4187-8b9f-ed823a82bb56"
conversation_id: "9592d1e7-70a5-4187-8b9f-ed823a82bb56"
title: "Configuring NGINX Docker for IPv4 Preference"
extracted_at: "2026-06-29T16:33:15.546Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Configuring NGINX Docker for IPv4 Preference

Source: [Grok conversation](https://grok.com/c/9592d1e7-70a5-4187-8b9f-ed823a82bb56)

## User

_Time: 2025-09-15T02:17:50.364Z_

docker.io/nginx:alpine
 
Correct way to make this image default to ipv4, and ONLY use ipv6 if ipv4 isn't available? Currently it does this:

```

/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
/docker-entrypoint.sh: Sourcing /docker-entrypoint.d/15-local-resolvers.envsh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
/docker-entrypoint.sh: Configuration complete; ready for start up
```

 
 
my configuration:

```

  nginx-traefik-extensions:
    # 🔹🔹 Nginx Authentication Middleware 🔹🔹
    # Acts as forwardAuth service for traefik middleware
    image: docker.io/nginx:alpine
    container_name: nginx-traefik-extensions
    hostname: nginx-traefik-extensions
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
      - publicnet
    configs:
      - source: nginx-traefik-extensions.conf
        target: /etc/nginx/nginx.conf
        mode: 0644
    volumes:
      - /data/coolify/proxy/nginx-middlewares/auth:/etc/nginx/auth:ro
#      - /data/coolify/proxy/nginx-middlewares/cache:/var/cache/nginx
#      - /data/coolify/proxy/nginx-middlewares/logs:/var/log/nginx
    environment:
      TZ: ${TZ:-America/Chicago}
      NGINX_ACCESS_LOG: /dev/stdout
      NGINX_ERROR_LOG: /dev/stderr
      NGINX_LOG_LEVEL: info
    labels:
      traefik.enable: true
      traefik.http.routers.nginx-traefik-extensions.service: nginx-traefik-extensions
      traefik.http.routers.nginx-traefik-extensions.rule: Host(`nginx-traefik-extensions.$DOMAIN`) || Host(`nginx-traefik-extensions.$TS_HOSTNAME.$DOMAIN`)
      traefik.http.services.nginx-traefik-extensions.loadbalancer.server.port: 80
      traefik.http.middlewares.nginx-auth.forwardAuth.address: http://nginx-traefik-extensions:80/auth"
      kuma.nginx-traefik-extensions.http.name: nginx-traefik-extensions.$TS_HOSTNAME.$DOMAIN
      kuma.nginx-traefik-extensions.http.url: https://nginx-traefik-extensions.$DOMAIN
      kuma.nginx-traefik-extensions.http.interval: 60
      traefik.http.middlewares.nginx-auth.forwardAuth.trustForwardHeader: true
      traefik.http.middlewares.nginx-auth.forwardAuth.authResponseHeaders: '["X-Auth-Method", "X-Auth-Passed", "X-Middleware-Name"]'
    deploy:
      resources:
        reservations:
          cpus: 0.01
          memory: 6M
        limits:
          cpus: 1
          memory: 1G
    healthcheck:
      # test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:80/health > /dev/null 2>&1 && wget -qO- https://127.0.0.1:443/health > /dev/null 2>&1 || exit 1"]
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:80/health > /dev/null 2>&1 || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s
    restart: always
  tinyauth:
    # 🔹🔹 TinyAuth 🔹🔹
    image: ghcr.io/steveiliop56/tinyauth:v3
    container_name: tinyauth
    hostname: auth
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
    volumes:
      - /data/coolify/proxy/tinyauth:/data
    environment:
      SECRET: ${TINYAUTH_SECRET:?}
      APP_URL: ${TINYAUTH_APP_URL:-https://auth.$DOMAIN}
      USERS: "${TINYAUTH_USERS:?}"
      # Google OAuth Configuration
      GOOGLE_CLIENT_ID: ${TINYAUTH_GOOGLE_CLIENT_ID:?}
      GOOGLE_CLIENT_SECRET: ${TINYAUTH_GOOGLE_CLIENT_SECRET:?}
      # GitHub OAuth Configuration
      GITHUB_CLIENT_ID: ${TINYAUTH_GITHUB_CLIENT_ID:?}
      GITHUB_CLIENT_SECRET: ${TINYAUTH_GITHUB_CLIENT_SECRET:?}
      # Additional recommended settings
      SESSION_EXPIRY: ${TINYAUTH_SESSION_EXPIRY:-604800} # 2 weeks session expiry
      COOKIE_SECURE: ${TINYAUTH_COOKIE_SECURE:-true} # Send cookie only with HTTPS
      APP_TITLE: ${TINYAUTH_APP_TITLE:-$DOMAIN} # Customize login page title
      LOGIN_MAX_RETRIES: ${TINYAUTH_LOGIN_MAX_RETRIES:-15} # Maximum login attempts before account lockout
      LOGIN_TIMEOUT: ${TINYAUTH_LOGIN_TIMEOUT:-300} # Lock account for 5 minutes after too many failed attempts
      OAUTH_AUTO_REDIRECT: ${TINYAUTH_OAUTH_AUTO_REDIRECT:-none} # Options: none, github, google, or generic
      # Uncomment below if you want to restrict OAuth login to specific users
      OAUTH_WHITELIST: ${TINYAUTH_OAUTH_WHITELIST:-boden.crouch@gmail.com,halomastar@gmail.com,athenajaguiar@gmail.com,dgorsch2@gmail.com,dgorsch4@gmail.com}  # e.g. user1,user2,/^admin.>
    labels:
      traefik.enable: true
      traefik.http.routers.tinyauth.rule: Host(`auth.$DOMAIN`) || Host(`auth.$TS_HOSTNAME.$DOMAIN`)
      traefik.http.middlewares.tinyauth.forwardAuth.address: http://auth:3000/api/auth/traefik
      homepage.group: Security
      homepage.name: TinyAuth
      homepage.icon: https://tinyauth.app/img/logo.png
      homepage.href: https://auth.$DOMAIN/
      homepage.description: Centralized login service (email, Google, GitHub) used by Traefik auth middleware and apps
      kuma.tinyauth.http.name: auth.$TS_HOSTNAME.$DOMAIN
      kuma.tinyauth.http.url: https://auth.$DOMAIN
      kuma.tinyauth.http.interval: 60
    restart: always
```

## Assistant

_Time: 2025-09-15T02:18:12.120Z_



## User

_Time: 2025-09-15T02:18:41.041Z_

docker.io/nginx:alpine
 
Correct way to make this image default to ipv4, and ONLY use ipv6 if ipv4 isn't available? Currently it does this:

```

/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
/docker-entrypoint.sh: Sourcing /docker-entrypoint.d/15-local-resolvers.envsh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
/docker-entrypoint.sh: Configuration complete; ready for start up
```

 
 
my configuration:

```

  nginx-traefik-extensions:
    # 🔹🔹 Nginx Authentication Middleware 🔹🔹
    # Acts as forwardAuth service for traefik middleware
    image: docker.io/nginx:alpine
    container_name: nginx-traefik-extensions
    hostname: nginx-traefik-extensions
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
      - publicnet
    configs:
      - source: nginx-traefik-extensions.conf
        target: /etc/nginx/nginx.conf
        mode: 0644
    volumes:
      - /data/coolify/proxy/nginx-middlewares/auth:/etc/nginx/auth:ro
#      - /data/coolify/proxy/nginx-middlewares/cache:/var/cache/nginx
#      - /data/coolify/proxy/nginx-middlewares/logs:/var/log/nginx
    environment:
      TZ: ${TZ:-America/Chicago}
      NGINX_ACCESS_LOG: /dev/stdout
      NGINX_ERROR_LOG: /dev/stderr
      NGINX_LOG_LEVEL: info
    labels:
      traefik.enable: true
      traefik.http.routers.nginx-traefik-extensions.service: nginx-traefik-extensions
      traefik.http.routers.nginx-traefik-extensions.rule: Host(`nginx-traefik-extensions.$DOMAIN`) || Host(`nginx-traefik-extensions.$TS_HOSTNAME.$DOMAIN`)
      traefik.http.services.nginx-traefik-extensions.loadbalancer.server.port: 80
      traefik.http.middlewares.nginx-auth.forwardAuth.address: http://nginx-traefik-extensions:80/auth"
      kuma.nginx-traefik-extensions.http.name: nginx-traefik-extensions.$TS_HOSTNAME.$DOMAIN
      kuma.nginx-traefik-extensions.http.url: https://nginx-traefik-extensions.$DOMAIN
      kuma.nginx-traefik-extensions.http.interval: 60
      traefik.http.middlewares.nginx-auth.forwardAuth.trustForwardHeader: true
      traefik.http.middlewares.nginx-auth.forwardAuth.authResponseHeaders: '["X-Auth-Method", "X-Auth-Passed", "X-Middleware-Name"]'
    deploy:
      resources:
        reservations:
          cpus: 0.01
          memory: 6M
        limits:
          cpus: 1
          memory: 1G
    healthcheck:
      # test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:80/health > /dev/null 2>&1 && wget -qO- https://127.0.0.1:443/health > /dev/null 2>&1 || exit 1"]
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:80/health > /dev/null 2>&1 || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s
    restart: always
  tinyauth:
    # 🔹🔹 TinyAuth 🔹🔹
    image: ghcr.io/steveiliop56/tinyauth:v3
    container_name: tinyauth
    hostname: auth
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
    volumes:
      - /data/coolify/proxy/tinyauth:/data
    environment:
      SECRET: ${TINYAUTH_SECRET:?}
      APP_URL: ${TINYAUTH_APP_URL:-https://auth.$DOMAIN}
      USERS: "${TINYAUTH_USERS:?}"
      # Google OAuth Configuration
      GOOGLE_CLIENT_ID: ${TINYAUTH_GOOGLE_CLIENT_ID:?}
      GOOGLE_CLIENT_SECRET: ${TINYAUTH_GOOGLE_CLIENT_SECRET:?}
      # GitHub OAuth Configuration
      GITHUB_CLIENT_ID: ${TINYAUTH_GITHUB_CLIENT_ID:?}
      GITHUB_CLIENT_SECRET: ${TINYAUTH_GITHUB_CLIENT_SECRET:?}
      # Additional recommended settings
      SESSION_EXPIRY: ${TINYAUTH_SESSION_EXPIRY:-604800} # 2 weeks session expiry
      COOKIE_SECURE: ${TINYAUTH_COOKIE_SECURE:-true} # Send cookie only with HTTPS
      APP_TITLE: ${TINYAUTH_APP_TITLE:-$DOMAIN} # Customize login page title
      LOGIN_MAX_RETRIES: ${TINYAUTH_LOGIN_MAX_RETRIES:-15} # Maximum login attempts before account lockout
      LOGIN_TIMEOUT: ${TINYAUTH_LOGIN_TIMEOUT:-300} # Lock account for 5 minutes after too many failed attempts
      OAUTH_AUTO_REDIRECT: ${TINYAUTH_OAUTH_AUTO_REDIRECT:-none} # Options: none, github, google, or generic
      # Uncomment below if you want to restrict OAuth login to specific users
      OAUTH_WHITELIST: ${TINYAUTH_OAUTH_WHITELIST:-boden.crouch@gmail.com,halomastar@gmail.com,athenajaguiar@gmail.com,dgorsch2@gmail.com,dgorsch4@gmail.com}  # e.g. user1,user2,/^admin.>
    labels:
      traefik.enable: true
      traefik.http.routers.tinyauth.rule: Host(`auth.$DOMAIN`) || Host(`auth.$TS_HOSTNAME.$DOMAIN`)
      traefik.http.middlewares.tinyauth.forwardAuth.address: http://auth:3000/api/auth/traefik
      homepage.group: Security
      homepage.name: TinyAuth
      homepage.icon: https://tinyauth.app/img/logo.png
      homepage.href: https://auth.$DOMAIN/
      homepage.description: Centralized login service (email, Google, GitHub) used by Traefik auth middleware and apps
      kuma.tinyauth.http.name: auth.$TS_HOSTNAME.$DOMAIN
      kuma.tinyauth.http.url: https://auth.$DOMAIN
      kuma.tinyauth.http.interval: 60
    restart: always
```

I DO NOT WANT TO DISABLE IPV6 UNDER ANY CIRCUMSTANCES. I SOLELY want to DEFAULT to use ipv4, and ONLY use ipv6 if ipv4 isn't available.

## Assistant

_Time: 2025-09-15T02:24:38.837Z_

### Key Points
- Research suggests that the NGINX Alpine Docker image enables IPv6 listening by default via an entrypoint script, but you can customize this behavior without fully disabling IPv6 support.
- To prioritize IPv4 while falling back to IPv6 only when IPv4 is unavailable, use a conditional configuration at container startup—this ensures compatibility in dual-stack, IPv4-only, or IPv6-only environments.
- This approach involves overriding the default IPv6-enabling script and adding a custom script to check for IPv4 availability before adjusting listen directives.
- It seems likely that this will address your requirement, as it avoids binding to IPv6 unless necessary, forcing client fallbacks to IPv4 in dual-stack scenarios via mechanisms like Happy Eyeballs.
- Note any potential controversy: some sources debate whether client-side preferences (e.g., DNS resolution order) should override server configurations, but your focus on server listening aligns with conditional binding for empathy toward varied network setups.

### Implementation Steps
1. **Override the Default IPv6 Script**: Create an empty file (e.g., `empty.sh`) on your host to mount over the built-in script, preventing it from adding IPv6 listens unconditionally.

2. **Add a Custom Check Script**: Create a shell script (e.g., `prefer-ipv4.sh`) that detects if a global IPv4 address exists. If yes, keep IPv4-only listens; if no, switch to IPv6 listens. Make it executable (`chmod +x prefer-ipv4.sh`).

3. **Update Docker Compose**: Mount both files into the container's `/docker-entrypoint.d/` directory. The entrypoint will run your custom script automatically.

4. **Test in Different Networks**: Verify in IPv4-only, dual-stack, and IPv6-only Docker networks to ensure fallback works.

### Custom Script Example (`prefer-ipv4.sh`)
```
#!/bin/sh

set -e

CONF_FILE="/etc/nginx/conf.d/default.conf"

if [ ! -f "$CONF_FILE" ]; then
  echo "default.conf not found, skipping modifications."
  exit 0
fi

# Check for global IPv4 address (excluding loopback)
if ip -4 addr show scope global | grep -q "inet "; then
  echo "IPv4 available, prioritizing IPv4 (no IPv6 listen)."
  # Remove any existing IPv6 listens (though overridden script prevents them)
  sed -i '/listen\s\+\[::\]:80;/d' "$CONF_FILE"
  sed -i '/listen\s\+\[::\]:443/d' "$CONF_FILE"
else
  echo "No IPv4 available, falling back to IPv6."
  sed -i 's/listen\s\+80;/listen [::]:80;/' "$CONF_FILE"
  sed -i 's/listen\s\+443\s\+ssl;/listen [::]:443 ssl;/' "$CONF_FILE"
fi
```

### Docker Compose Updates
Add these to your `nginx-traefik-extensions` service under `volumes`:
```
- ./empty.sh:/docker-entrypoint.d/10-listen-on-ipv6-by-default.sh:ro
- ./prefer-ipv4.sh:/docker-entrypoint.d/09-prefer-ipv4.sh:ro
```
- Place `empty.sh` (empty file) and `prefer-ipv4.sh` in your project directory.
- The naming (`09-`) ensures it runs before other scripts like `20-envsubst-on-templates.sh`.

### Potential Adjustments
- If your custom `nginx.conf` doesn't include `conf.d/default.conf`, apply similar sed modifications to your main config file instead (update `$CONF_FILE` in the script).
- For HTTPS, ensure SSL directives are handled if your setup uses port 443.
- In dual-stack networks, clients will attempt IPv6 first but fail quickly (due to no listen), falling back to IPv4—aligning with your preference without disabling IPv6 capability.

---

The NGINX Alpine Docker image, as used in your setup (docker.io/nginx:alpine), includes an entrypoint mechanism that automatically enables IPv6 listening by modifying `/etc/nginx/conf.d/default.conf` to add directives like `listen [::]:80;`. This behavior is evident from your provided logs, where the script `10-listen-on-ipv6-by-default.sh` runs and enables IPv6. However, this results in the server listening on both IP families in dual-stack environments, potentially leading to IPv6-preferred connections due to client-side algorithms like RFC 6724's address selection rules, which often prioritize IPv6.<grok:render card_id="25e741" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>

Your goal—to default to IPv4 while using IPv6 only if IPv4 is unavailable—can be achieved by making the listen directives conditional on the container's network configuration. This ensures the server binds primarily to IPv4 addresses when available, forcing clients in dual-stack scenarios to fall back to IPv4 after a quick IPv6 connection failure (leveraging Happy Eyeballs for minimal delay). If the container lacks an IPv4 address (e.g., in an IPv6-only Docker network), it switches to IPv6 binds to maintain availability.<grok:render card_id="352be2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render> This approach preserves IPv6 support without unconditional disabling, addressing potential issues in mixed environments where IPv6 resolution might cause unexpected behavior, such as delayed or failed connections in IPv4-preferred setups.<grok:render card_id="130d3f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>

#### Understanding the Default Behavior
The official NGINX Docker repository hosts the entrypoint scripts responsible for this.<grok:render card_id="10e175" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> The `10-listen-on-ipv6-by-default.sh` script checks for the existence of `default.conf`, computes a checksum, and inserts IPv6 listen directives if absent. This is a deliberate design to support modern dual-stack networks but can conflict with IPv4 preference goals. In Alpine-based images, the musl libc further complicates global IP family preferences, as it lacks support for `/etc/gai.conf` to reorder resolution—meaning workarounds like DNS filtering or conditional binding are often necessary.<grok:render card_id="644921" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render><grok:render card_id="683b5c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>

In your configuration, the custom `nginx-traefik-extensions.conf` is mounted as `/etc/nginx/nginx.conf`, which likely includes `conf.d/*.conf` by default (a standard NGINX pattern). Thus, modifications to `default.conf` affect your setup, as shown in the logs. The presence of Traefik forwardAuth and networks like `backend` and `publicnet` suggests potential dual-stack exposure, where service names resolve to both IPv4 and IPv6 addresses via Docker's internal DNS, exacerbating IPv6 preference.<grok:render card_id="d9ea98" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>

#### Why Conditional Listening?
- **IPv4 Availability Check**: Use `ip -4 addr show scope global` to detect non-loopback IPv4 addresses. This reliably identifies if the container is in an IPv4-capable network.<grok:render card_id="f55947" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render>
- **Fallback Mechanism**: If no IPv4, replace IPv4 listens with IPv6 equivalents using `sed`. This prevents bind failures (e.g., "Cannot assign requested address") in IPv6-only setups.<grok:render card_id="5b540b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="523375" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render>
- **Client-Side Preference**: In dual-stack, omitting IPv6 listens causes IPv6 attempts to fail, prompting fallback to IPv4. This effectively "defaults" to IPv4 without altering client configurations.<grok:render card_id="5142fd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- **Avoiding Bind Issues**: Binding to unavailable families causes NGINX startup failures; conditional logic mitigates this.<grok:render card_id="d1fd0c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render><grok:render card_id="4ccc25" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>

#### Detailed Implementation Guide
1. **Prepare Host Files**:
   - `empty.sh`: An empty file to neuter the default script.
   - `prefer-ipv4.sh`: The script provided above. Ensure it starts with `#!/bin/sh` and is executable.

2. **Mount in Compose**:
   - The `/docker-entrypoint.d/` directory runs scripts alphabetically. Using `09-` for your script ensures it executes early.
   - If `default.conf` isn't used (e.g., your `nginx.conf` has explicit server blocks), adjust the script to target your config file paths.

3. **Handling Custom Configs**:
   - Your mounted `/etc/nginx/nginx.conf` may define or include listens. If so, update the script's `$CONF_FILE` to `/etc/nginx/nginx.conf` or use `find` to target all `.conf` files.
   - For the `auth` middleware, ensure any internal proxies (e.g., if NGINX forwards to `tinyauth`) benefit from this, as resolution issues could arise in dual-stack.<grok:render card_id="b15a87" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>

4. **Testing and Debugging**:
   - Create test networks: `docker network create ipv4-net` (default IPv4), `docker network create --ipv6 --subnet=2001:db8::/64 ipv6-net` (IPv6-only).
   - Run your container attached to each, check NGINX logs for bind success, and test connections with tools like `curl -4` or `curl -6`.
   - Monitor with `nginx -t` in the container to validate configs post-modification.
   - If errors occur (e.g., sed fails due to missing patterns), add checks like `grep -q 'listen 80;' "$CONF_FILE"`.

#### Comparison of Approaches
| Approach | Pros | Cons | When to Use |
|----------|------|------|-------------|
| Override Script + Conditional Check (Recommended) | Preserves IPv6 fallback; no runtime failures; aligns with your requirements. | Requires custom files/scripts. | Dual-stack or variable networks where flexibility is key. |
| Disable IPv6 Entirely (e.g., sysctl) | Simple; forces IPv4 always. | Violates your no-disable rule; fails in IPv6-only. | IPv4-only environments. |
| Use gai.conf for Resolution | Prefers IPv4 in outgoing connections. | Not supported in Alpine/musl; irrelevant for listening. | Non-Alpine images with outgoing proxies. |
| Remove AAAA from DNS | Forces client IPv4 preference. | Hard in Docker; requires custom DNS setup. | When controlling the resolver. |
| Listen with ipv6only=off | Single socket for both families. | Still prefers IPv6 in clients; bind may fail if no IPv6. | Simple dual-stack without preference needs. |

#### Additional Considerations and Alternatives
- **Alpine-Specific Limitations**: Alpine's musl libc ignores `/etc/gai.conf`, so resolution-based preferences aren't viable without wrappers or custom builds.<grok:render card_id="fbaa80" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="133dd4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render> If your NGINX performs outgoing requests (e.g., proxy to `tinyauth`), consider specifying IPv4 IPs directly in configs to bypass resolution.
- **Docker Network Config**: Enable IPv6 globally in daemon.json if testing fallbacks, but avoid for production if preferring IPv4.<grok:render card_id="925f5e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="f4291c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render> For port publishing, Docker handles family-specific binds, but container-internal listens are your focus.<grok:render card_id="53d37f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render><grok:render card_id="45fbd2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
- **Performance Impact**: Conditional mods add minimal startup overhead; Happy Eyeballs ensures fallback delays are under 300ms in most clients.
- **Security and Compatibility**: Retaining IPv6 fallback supports future-proofing, especially with growing IPv6 adoption. Test with your Traefik and TinyAuth integrations to ensure auth flows aren't disrupted in mixed networks.<grok:render card_id="f7a0d8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render>
- **Alternatives if Scripts Fail**: Build a custom image deriving from `nginx:alpine`, removing the entrypoint script entirely and embedding your logic. Or, define explicit `listen 0.0.0.0:80;` in your `nginx.conf` for IPv4-only, but add runtime checks via ENTRYPOINT overrides for fallback.

This comprehensive setup should provide a robust, network-aware configuration for your NGINX container.

### Key Citations
- [Prefer ipv4 over ipv6... : r/AlpineLinux - Reddit](https://www.reddit.com/r/AlpineLinux/comments/whl68j/prefer_ipv4_over_ipv6/)<grok:render card_id="665a9e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [How to enable ipv6 on alpine docker image? - Stack Overflow](https://stackoverflow.com/questions/66108237/how-to-enable-ipv6-on-alpine-docker-image)<grok:render card_id="59d1da" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>
- [Prefer IPv4 incoming connections over IPv6 - nginx - Server Fault](https://serverfault.com/questions/705796/prefer-ipv4-incoming-connections-over-ipv6)<grok:render card_id="4b450c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [IPv4 only container are resolved with an IPv6 address on ... - GitHub](https://github.com/moby/moby/issues/47055)<grok:render card_id="66496c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- [Running Docker / Alpine Linux in an IPv6-only environment](https://blog.apnic.net/2022/05/23/running-docker-alpine-linux-in-an-ipv6-only-environment/)<grok:render card_id="ee7300" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>
- [How to resolve IPv4 first on Alpine Linux?](https://unix.stackexchange.com/questions/654660/how-to-resolve-ipv4-first-on-alpine-linux)<grok:render card_id="f5b701" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- [Make docker use IPv4 for port binding - Stack Overflow](https://stackoverflow.com/questions/29957143/make-docker-use-ipv4-for-port-binding)<grok:render card_id="b56ea9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render>
- [Docker doesn't open IPv6 ports - Compose](https://forums.docker.com/t/docker-doesnt-open-ipv6-ports/106201)<grok:render card_id="ca43ef" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
- [Alpine Docker enable IPv6 : How to? - Bobcares](https://bobcares.com/blog/alpine-docker-enable-ipv6/)<grok:render card_id="a4b30e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render>
- [3.3. Exploring IPv6 in Container Networking](https://opnfv-ipv6.readthedocs.io/en/latest/release/userguide/ipv6-in-container-networking.html)<grok:render card_id="49a2cc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render>
