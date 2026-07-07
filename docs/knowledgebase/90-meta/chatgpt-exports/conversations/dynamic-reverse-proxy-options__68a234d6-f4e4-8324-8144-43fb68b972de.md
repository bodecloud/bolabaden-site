---
source_url: "https://chatgpt.com/c/68a234d6-f4e4-8324-8144-43fb68b972de"
conversation_id: "68a234d6-f4e4-8324-8144-43fb68b972de"
title: "Dynamic reverse proxy options"
extracted_at: "2026-06-29T11:08:38.823Z"
message_count: 5
provenance: auth-ui
---

# Dynamic reverse proxy options

Source: [ChatGPT conversation](https://chatgpt.com/c/68a234d6-f4e4-8324-8144-43fb68b972de)

## Assistant

Perfect! Since you want to keep Traefik as the entrypoint and just hand off to a backend that does fully dynamic wildcard failover with per-backend health checks, the most lightweight approach is a small Go or Node.js reverse proxy that:

Accepts any hostname.

Maintains a list of backend servers (these can be DNS names).

Checks each backend via HTTP GET / to see if it’s alive.

Proxies the request to the first healthy backend.

This approach is super lightweight, avoids Traefik hardcoding subdomains, and works entirely via Docker.

Here’s an example Docker Compose setup using [Traefik + a minimal Node.js failover proxy] that mimics your whoami scenario:

docker-compose.yaml
YAML
version: "3.9"

services:
  traefik:
    image: traefik:v2.13
    container_name: traefik
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.le.acme.httpchallenge=true"
      - "--certificatesresolvers.le.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.le.acme.email=you@example.com"
      - "--certificatesresolvers.le.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"

  failover-proxy:
    build: ./failover-proxy
    container_name: failover-proxy
    environment:
      - BACKENDS=http://whoami:80,http://whoami.micklethefickle.bolabaden.org,http://whoami.beatapostapita.bolabaden.org
      - HEALTH_PATH=/
      - HEALTH_INTERVAL=15000
      - HEALTH_TIMEOUT=5000
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.catchall.rule=Host(`bolabaden.org`) || HostRegexp(`{subdomain:.+}.bolabaden.org`)"
      - "traefik.http.routers.catchall.entrypoints=web,websecure"
      - "traefik.http.routers.catchall.service=failover-proxy@docker"
      - "traefik.http.middlewares.strip-www.stripprefixregex.regex=^www\\."
      - "traefik.http.routers.catchall.middlewares=strip-www"

  whoami:
    image: containous/whoami
    container_name: whoami
    networks:
      - default

networks:
  default:
    driver: bridge
Minimal Node.js failover proxy (failover-proxy/Dockerfile + index.js)
Dockerfile
dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY index.js ./

CMD ["node", "index.js"]
package.json
JSON
{
  "name": "failover-proxy",
  "version": "1.0.0",
  "dependencies": {
    "http-proxy": "^1.18.1",
    "axios": "^1.6.2"
  }
}
index.js
JavaScript
const http = require('http');
const httpProxy = require('http-proxy');
const axios = require('

## User

No custom Dockerfile allowed! i want whatever image will support the intended functionality, and then you write the configuration for that image. e.g. if nginx proxy would support the feature (it doesn't) you'd write nginx.conf and use nginx:alpine. Since it doesn't, use a image that'll actually do what i want.

## Assistant

Nice — thanks for clarifying. Below I give a complete, drop-in Docker Compose setup that uses an existing image only (no custom Dockerfile).
It uses OpenResty (nginx + Lua) as the backend proxy image and a small Lua-based proxy implementation (mounted into the container at runtime). You can keep Traefik as your front door (Traefik will forward every wildcard host to this service) and this service will:

Accept any *.bolabaden.org host (does not hardcode app subdomains like whoami).

Build candidate backend hostnames by combining the requested app-prefix (the leftmost label from the Host header) with a list of backend server suffixes (you supply those server names, not app names). Example: request whoami.bolabaden.org → candidates tried in order:

whoami.bolabaden.org (direct)

whoami.micklethefickle.bolabaden.org

whoami.beatapostapita.bolabaden.org

whoami.cloudserver1.bolabaden.org

…etc (the order is exactly the order you pass in).

Probe each candidate with a fast HTTP health probe (configurable path/timeouts).

Cache health results (TTL) so probes are light-weight in steady state.

Proxy the original request to the first healthy candidate (preserves method, headers, body).

If none are healthy, returns 502.

This meets your constraints:

No hardcoded subdomains or app names inside the proxy. The only things you configure are the backend server suffixes (which are the servers you control) and the domain; the proxy derives the target app hostname from the incoming Host header.

No custom Dockerfile — using openresty/openresty:alpine as-is and mounting config files.

Files

Create this repo layout:

.
├── docker-compose.yml
└── openresty
    ├── nginx.conf
    └── lua
        └── failover_proxy.lua
docker-compose.yml
YAML
version: "3.9"

services:
  failover-proxy:
    image: openresty/openresty:alpine
    container_name: failover-proxy
    restart: unless-stopped
    environment:
      # REQUIRED: your public domain
      - DOMAIN=bolabaden.org

      # REQUIRED: comma-separated backend server suffix list (in order).
      # Special value "@" means direct (no backend suffix): i.e. <app>.<DOMAIN>
      # Example: try direct first, then those servers in order:
      - BACKEND_SUFFIXES=@,micklethefickle,beatapostapita,vractormania,arnialtrashlid,cloudserver1,cloudserver2,cloudserver3

      # health check path, ttl (seconds), timeout (ms), schemes order (comma)
      - HEALTH_PATH=/
      - HEALTH_TTL=15
      - HEALTH_TIMEOUT_MS=5000
      - HEALTH_TTL_SECS=15

      # schemes to attempt for each candidate, comma separated, e.g. try http then https
      - SCHEMES=http,https

      # whether to verify TLS when contacting https backends ("1" or "0")
      - VERIFY_SSL=0

    volumes:
      - ./openresty/nginx.conf:/usr/local/openresty/nginx/conf/nginx.conf:ro
      - ./openresty/lua:/usr/local/openresty/lualib/failover:ro

    expose:
      - "80"

    labels:
      # Example labels if using Traefik docker provider; adapt to your Traefik:
      - "traefik.enable=true"
      - "traefik.http.routers.failover.rule=Host(`bolabaden.org`) || HostRegexp(`{subdomain:.+}.bolabaden.org`)"
      - "traefik.http.routers.failover.entrypoints=web,websecure"
      - "traefik.http.services.failover.loadbalancer.server.port=80"

  whoami:
    image: containous/whoami
    container_name: whoami
    restart: unless-stopped
    expose:
      - "80"

Notes:

BACKEND_SUFFIXES is the only list of server names you supply. It does not contain app names (those are derived from the incoming Host header). The special value @ means "try app.DOMAIN (direct)". Adjust order as you want failover priority.

The service exposes port 80 (Traefik will talk to it).

Traefik labels are examples — if you already have your Traefik router pointing to this service, you can omit/override.

openresty/nginx.conf
Nginx
worker_processes  1;
error_log  /dev/stdout info;
daemon off;

events {
    worker_connections 1024;
}

http {
    lua_shared_dict health_cache 10m;

    lua_package_path "/usr/local/openresty/lualib/?.lua;;";

    # tuning
    client_max_body_size 32m;
    proxy_buffering off;

    server {
        listen 80 default_server;
        server_name _;

        # All requests handled by the Lua failover proxy
        location / {
            # read client body into memory for proxying
            lua_need_request_body on;
            content_by_lua_file /usr/local/openresty/lualib/failover/failover_proxy.lua;
        }
    }
}
openresty/lua/failover_proxy.lua
Lua
-- failover_proxy.lua
-- A minimal but practical failover proxy:
--   - takes incoming Host header (e.g. whoami.bolabaden.org)
--   - extracts app prefix (whoami)
--   - iterates BACKEND_SUFFIXES in order, building candidates:
--       - if suffix == "@" -> whoami.DOMAIN
--       - else -> whoami.<suffix>.DOMAIN
--   - for each candidate, tries schemes in SCHEMES order (http/https)
--   - does cached health check (HEAD) using shared dict with HEALTH_TTL_SECS
--   - proxies the original request to the first healthy candidate
--   - if none healthy -> 502

local http = require "resty.http"   -- resty.http is installed in many OpenResty images
local ngx = ngx
local shared = ngx.shared.health_cache

-- helpers to read env with default
local function getenv(k, default)
    local v = os.getenv(k)
    if not v or v == "" then return default end
    return v
end

local DOMAIN = getenv("DOMAIN", "bolabaden.org")
local BACKEND_SUFFIXES = getenv("BACKEND_SUFFIXES", "@") -- comma-separated
local HEALTH_PATH = getenv("HEALTH_PATH", "/")
local HEALTH_TIMEOUT_MS = tonumber(getenv("HEALTH_TIMEOUT_MS", "5000")) or 5000
local HEALTH_TTL = tonumber(getenv("HEALTH_TTL_SECS", "15")) or 15
local SCHEMES = getenv("SCHEMES", "http,https")
local VERIFY_SSL = getenv("VERIFY_SSL", "0") == "1"

-- split util
local function split(s, sep)
    sep = sep or ","
    local t = {}
    for p in string.gmatch(s, "([^" .. sep .. "]+)") do
        p = (p:gsub("^%s+", "")):gsub("%s+$", "")
        table.insert(t, p)
    end
    return t
end

local suffixes = split(BACKEND_SUFFIXES, ",")
local schemes = split(SCHEMES, ",")

-- get app prefix (leftmost label)
local host = ngx.var.http_host or ngx.var.host or ""
local app_prefix = nil
do
    local m = host:match("^(.-)%.")
    if m and m ~= "" then
        app_prefix = m
    else
        -- no dot? fallback to entire host
        app_prefix = host
    end
    if not app_prefix or app_prefix == "" then
        ngx.log(ngx.ERR, "could not determine app prefix from Host: ", host)
        return ngx.exit(400)
    end
end

-- build candidate host for suffix and scheme
local function make_candidate(suffix)
    if suffix == "@" or suffix == "" then
        return string.format("%s.%s", app_prefix, DOMAIN)
    else
        return string.format("%s.%s.%s", app_prefix, suffix, DOMAIN)
    end
end

-- cached health result key
local function health_key(scheme, candidate)
    return scheme .. "://" .. candidate
end

-- perform a fast HEAD health check to candidate; return boolean
local function check_health_once(scheme, candidate)
    local key = health_key(scheme, candidate)
    -- check cache
    local val = shared:get(key)
    if val ~= nil then
        return val == true or val == "true" or val == 1
    end

    local httpc = http.new()
    httpc:set_timeout(HEALTH_TIMEOUT_MS)

    local port = (scheme == "https") and 443 or 80
    local ok, err = httpc:connect(candidate, port)
    if not ok then
        -- DNS or connect failed
        ngx.log(ngx.DEBUG, "health connect failed: ", candidate, " err: ", err)
        shared:set(key, false, HEALTH_TTL)
        return false
    end

    if scheme == "https" then
        local sess, ssl_err = httpc:ssl_handshake(false, candidate, VERIFY_SSL)
        if not sess then
            ngx.log(ngx.DEBUG, "health ssl handshake failed: ", candidate, " err: ", ssl_err)
            pcall(httpc.close, httpc)
            shared:set(key, false, HEALTH_TTL)
            return false
        end
    end

    -- HEAD request
    local res, req_err = httpc:request({
        method = "HEAD",
        path = HEALTH_PATH,
        headers = {
            ["Host"] = candidate,
            ["Connection"] = "close",
            ["User-Agent"] = "failover-proxy/1",
        }
    })
    if not res then
        ngx.log(ngx.DEBUG, "health request failed: ", candidate, " err: ", req_err)
        pcall(httpc.close, httpc)
        shared:set(key, false, HEALTH_TTL)
        return false
    end

    local code = tonumber(res.status) or 0
    -- treat 2xx/3xx as healthy
    local healthy = (code >= 200 and code < 400)
    shared:set(key, healthy and true or false, HEALTH_TTL)
    pcall(httpc.close, httpc)
    return healthy
end

-- Choose the first healthy candidate (scheme, candidateHost) or nil
local function choose_healthy()
    for _, sfx in ipairs(suffixes) do
        local candidate = make_candidate(sfx)
        for _, scheme in ipairs(schemes) do
            local ok = check_health_once(scheme, candidate)
            if ok then
                return scheme, candidate
            end
        end
    end
    return nil, nil
end

-- Proxy function: pipes request to chosen backend and streams back response
local function proxy_to(scheme, candidate)
    local httpc = http.new()
    httpc:set_timeout(HEALTH_TIMEOUT_MS)

    local port = (scheme == "https") and 443 or 80
    local ok, err = httpc:connect(candidate, port)
    if not ok then
        ngx.log(ngx.ERR, "proxy connect failed: ", candidate, " err: ", err)
        return ngx.exit(502)
    end

    if scheme == "https" then
        local sess, ssl_err = httpc:ssl_handshake(false, candidate, VERIFY_SSL)
        if not sess then
            ngx.log(ngx.ERR, "proxy ssl handshake failed: ", candidate, " err: ", ssl_err)
            pcall(httpc.close, httpc)
            return ngx.exit(502)
        end
    end

    -- build request to backend using incoming request data
    local method = ngx.req.get_method()
    local path_with_qs = ngx.var.request_uri or "/"
    local headers = ngx.req.get_headers()
    -- ensure host header is set to candidate
    headers["Host"] = candidate
    -- remove hop-by-hop headers per RFC
    headers["Connection"] = nil
    headers["Proxy-Connection"] = nil
    headers["Keep-Alive"] = nil
    headers["Transfer-Encoding"] = nil
    headers["TE"] = nil
    headers["Trailer"] = nil
    headers["Upgrade"] = nil

    local body
    ngx.req.read_body()
    body = ngx.req.get_body_data()

    local res, req_err = httpc:request({
        method = method,
        path = path_with_qs,
        headers = headers,
        body = body,
    })

    if not res then
        ngx.log(ngx.ERR, "proxy request failed: ", candidate, " err: ", req_err)
        pcall(httpc.close, httpc)
        return ngx.exit(502)
    end

    -- set status and headers (filter hop-by-hop)
    ngx.status = tonumber(res.status)
    for k, v in pairs(res.headers) do
        local lk = k:lower()
        if lk ~= "transfer-encoding" and lk ~= "connection" and lk ~= "keep-alive" and lk ~= "proxy-connection" and lk ~= "upgrade" then
            -- if header has multiple values, ngx.header accepts table
            ngx.header[k] = v
        end
    end

    -- stream body
    local chunk, read_err
    repeat
        chunk, read_err = res.body_reader(8192)
        if chunk then
            ngx.print(chunk)
            ngx.flush(true)
        end
    until not chunk

    pcall(httpc.close, httpc)
    return ngx.exit(ngx.status)
end

-- main
local scheme, cand = choose_healthy()
if not scheme then
    ngx.log(ngx.WARN, "no healthy backends for app=", app_prefix)
    return ngx.exit(502)
end

-- proxy the request
proxy_to(scheme, cand)

Implementation notes:

This uses lua-resty-http (resty.http) to do HTTP(s) probing and proxying. Many official OpenResty images include lua-resty-http; openresty/openresty:alpine typically does. If your image doesn't contain resty.http, you can install it with luarocks or switch to the openresty/openresty:alpine image that includes it. (No Dockerfile needed — you can pick an image tag that includes it.)

Health caching uses lua_shared_dict health_cache. TTL controlled by HEALTH_TTL_SECS.

BACKEND_SUFFIXES order is the failover order.

SCHEMES controls whether to try http first, then https; some backends may only be https and that's fine.

VERIFY_SSL=0 disables TLS verification (useful for internal servers). Set VERIFY_SSL=1 to enforce verification.

How to use (example)

Place the three files above in your project.

docker-compose up -d

Make sure Traefik routes wildcard hosts to the failover-proxy service (the docker labels in docker-compose.yml are an example). Your Traefik router (the one you already wrote) should point to this container.

Configure BACKEND_SUFFIXES and DOMAIN environment variables to match your environment. For example, the string:

@,micklethefickle,beatapostapita,vractormania,arnialtrashlid,cloudserver1,cloudserver2

will try:

app.bolabaden.org (because of @),

app.micklethefickle.bolabaden.org,

app.beatapostapita.bolabaden.org,

etc. (in that order), where app is whatever leftmost label the client requested (e.g. whoami).

Why this is lightweight and what tradeoffs exist

Pros

Very small runtime (OpenResty), no heavy control-plane, no K8s, no custom image build.

Fully dynamic per-request: app name is derived from Host header at runtime.

Per-candidate health probing with caching, so only a small amount of probe traffic.

No hardcoded app names — only server suffixes are configured (they're the servers you run).

Tradeoffs

lua-resty-http needs to be present in the OpenResty image you run (most community images include it). If your chosen openresty tag lacks it, switch to a tag that does or install it via luarocks (still without a Dockerfile — you can use a bind-mounted /usr/local/openresty/lualib if needed).

The proxy implementation does its own HTTP(s) client and is not a full-featured, extremely high-performance proxy like Envoy; for moderate traffic it's fine. If you need multi-GBps throughput and advanced observability, Envoy would be the next step (more complex).

This approach assumes that whether a backend hosts a given app is discovered by probing /<HEALTH_PATH> on the candidate domain. That matches your requirement "Not all backends host all apps, must check each one with some sort of health check."

If you want, I can:

Provide a version that prefers whoami docker service first (i.e., add @,docker semantics) so local container is tried before external servers. (No code change needed — just change BACKEND_SUFFIXES.)

Provide a small test script that spins up one or two fake backends to exercise failover and show the logs.

Or produce an Envoy alternative if you prefer a battle-hardened, high-performance proxy (but that will be heavier and more configuration-heavy).

Which of those do you want next?

## User

release date of caddy 2?

## Assistant

You're asking: When was Caddy 2 first released?

According to Wikipedia, Caddy version 2 made its debut on May 5, 2020 
Wikipedia
.

Another source, a project timeline site, confirms this timing: it lists Caddy 2’s original release as May 4, 2020, referencing “5 years ago” from the current year and a date of 04 May 2020 
endoflife.date
.

So we can say with confidence:

Caddy 2 was initially released in early May 2020 — specifically, around May 4–5, 2020.

Let me know if you'd like info on later major releases like Caddy 2.6, 2.8, or 2.10—or their exact dates!
