---
source_url: "https://chatgpt.com/c/68a210e4-e73c-8327-9c71-ef5d8365b8a0"
conversation_id: "68a210e4-e73c-8327-9c71-ef5d8365b8a0"
title: "NGINX wildcard routing"
extracted_at: "2026-06-29T11:10:02.074Z"
message_count: 5
provenance: auth-ui
---

# NGINX wildcard routing

Source: [ChatGPT conversation](https://chatgpt.com/c/68a210e4-e73c-8327-9c71-ef5d8365b8a0)

## Assistant

Yes — you can push almost all of your routing, failover logic, health checks, and auth into Lua using OpenResty, which is basically Nginx bundled with LuaJIT and a bunch of Lua modules.

But there’s an important caveat: you cannot run Lua entirely outside Nginx. Nginx is still the HTTP engine; Lua hooks into phases (access, content, log) and handles routing, auth, upstream selection, etc. So the nginx.conf can be minimal, but you still need some very small scaffolding to let Lua do its thing.

Here’s a concrete approach:

1️⃣ Minimal Nginx scaffolding
Nginx
worker_processes auto;
error_log /dev/stderr warn;

events {
    worker_connections 1024;
}

http {
    lua_package_path "/etc/nginx/lua/?.lua;;";

    server {
        listen 80 default_server;
        server_name _;

        access_by_lua_file /etc/nginx/lua/access.lua;
        content_by_lua_file /etc/nginx/lua/content.lua;

        location /health {
            default_type text/plain;
            return 200 "nginx-lua service healthy\n";
        }
    }
}

✅ Notice how tiny it is. All your upstream selection, auth, failover, middleware, logging — can live in Lua files (access.lua, content.lua, etc.).

2️⃣ Dynamic upstream + failover in Lua (content.lua)
Lua
local http = require "resty.http"

-- Config: backends (could also read from env or DB)
local backends = {
    "micklethefickle",
    "beatapostapita",
    "vractormania",
    "arnialtrashlid",
    "cloudserver1",
    "cloudserver2",
    "cloudserver3"
}

local domain = os.getenv("DOMAIN") or "bolabaden.org"
local host = ngx.var.host
local service = host:match("([^.]+)%.")  -- extract the service

if not service then
    ngx.status = 404
    ngx.header["Content-Type"] = "application/json"
    ngx.say('{"error":"invalid host"}')
    return
end

local client = http.new()
local healthy_backend

for _, backend in ipairs(backends) do
    local res, err = client:request_uri("https://"..service.."."..backend.."."..domain, {
        method = "HEAD",
        ssl_verify = false, -- optional, for self-signed certs
        timeout = 2000
    })
    if res and res.status < 500 then
        healthy_backend = backend
        break
    end
end

if not healthy_backend then
    ngx.status = 502
    ngx.header["Content-Type"] = "application/json"
    ngx.say('{"error":"no healthy backend"}')
    return
end

-- Proxy request
local httpc = require "resty.http".new()
local scheme = ngx.var.scheme
local path = ngx.var.request_uri

local backend_url = scheme .. "://" .. service .. "." .. healthy_backend .. "." .. domain .. path

local res, err = httpc:request_uri(backend_url, {
    method = ngx.req.get_method(),
    headers = ngx.req.get_headers(),
    body = ngx.req.get_body_data(),
})

if not res then
    ngx.status = 502
    ngx.say('{"error":"failed to connect to backend"}')
    return
end

ngx.status = res.status
for k,v in pairs(res.headers) do
    if k:lower() ~= "transfer-encoding" then
        ngx.header[k] = v
    end
end
ngx.say(res.body)

✅ This Lua code does dynamic failover per service, exactly like your Traefik example, without any upstream blocks or static Nginx server definitions.

3️⃣ Access/authorization (access.lua)
Lua
-- IP whitelist
local ip_whitelist = {
    "127.0.0.1", "10.0.0.0/8", "192.168.0.0/16" -- etc
}

-- Check API key
local api_key = ngx.req.get_headers()["X-API-Key"]
local valid_api_key = os.getenv("NGINX_AUTH_API_KEY")

if api_key == valid_api_key then
    ngx.var.auth_method = "api_key"
    ngx.var.auth_passed = true
end

-- Optionally check IP whitelist here too
-- If failed, you can proxy to tinyauth via Lua HTTP client or return 401
✅ Benefits

Nginx config stays tiny, Lua handles all the logic.

Full dynamic per-service failover.

Health checks are real-time, per-request.

Easy to add new modules: logging, caching, rate limiting, middlewares — all in Lua.

If you want, I can rewrite your full 500-line Nginx config into a fully Lua-driven OpenResty config with:

dynamic service failover

auth (API key / IP whitelist / tiny auth)

middleware tracking

health endpoints

…so the nginx.conf itself would be like 10–15 lines total.

Do you want me to do that next?

## User

what's the standard nginx container that provides as much functionality/modules/support as possible so i don't have to worry about 'does my nginx image support xyz feature'

## Assistant

To ensure your NGINX container supports a comprehensive set of modules, including dynamic ones like Lua, Brotli, and GeoIP2, consider the following options:

✅ Option 1: Use the Official NGINX Plus Image

The NGINX Plus Docker image provides a robust set of features and dynamic modules. You can pull the image from the private registry:
Docker Hub
+7
NGINX Documentation
+7
GitHub
+7

Bash
docker pull private-registry.nginx.com/nginx-plus/modules:<version-tag>

This image includes a variety of dynamic modules, and you can enable them in your configuration using load_module directives. For a full list of available modules, refer to the official documentation. 
GitHub

🛠️ Option 2: Use Community-Enhanced NGINX Image

The zengxs/nginx Docker image is a community-maintained variant of the official NGINX image. It includes additional dynamic modules such as Brotli, headers-more, and GeoIP2. You

## User

zengxs/nginx will contain the nginx lua thing and the healthcheck sutff??

## Assistant

Yes, the zengxs/nginx Docker image includes the necessary components for Lua scripting and health checks. It is based on the official NGINX image and has been extended to support Lua scripting via the ngx_http_lua_module. This module allows you to run Lua code within NGINX, enabling dynamic behavior such as health checks, routing, and more.

Additionally, the image supports health checks through Docker's HEALTHCHECK directive. This directive can be configured in your Dockerfile or docker-compose.yml to periodically test the health of the NGINX service. For example, you can use a simple curl command to check if NGINX is responding:
Medium

dockerfile
HEALTHCHECK CMD curl --fail http://localhost/ || exit 1

This setup ensures that your NGINX container is properly configured for both Lua scripting and health checks.

For more advanced health check capabilities, such as active health checks for upstream servers, you might consider using the lua-resty-upstream-healthcheck library. This library allows you to perform health checks on upstream servers defined in NGINX upstream blocks using Lua. It provides methods to spawn background health checkers and generate status pages in formats like Prometheus. 
NGINX Documentation
+6
Medium
+6
Medium
+6
Medium
+2
nginx-extras.getpagespeed.com
+2
GitHub
+1

By combining the zengxs/nginx image with Lua scripting and the lua-resty-upstream-healthcheck library, you can achieve dynamic and robust health checking for your NGINX-based services.
