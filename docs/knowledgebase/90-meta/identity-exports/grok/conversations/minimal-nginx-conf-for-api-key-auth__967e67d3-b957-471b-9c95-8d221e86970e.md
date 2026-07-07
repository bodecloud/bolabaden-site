---
source_url: "https://grok.com/c/967e67d3-b957-471b-9c95-8d221e86970e"
conversation_id: "967e67d3-b957-471b-9c95-8d221e86970e"
title: "Minimal nginx.conf for API Key Auth"
extracted_at: "2026-06-29T16:20:35.007Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Minimal nginx.conf for API Key Auth

Source: [Grok conversation](https://grok.com/c/967e67d3-b957-471b-9c95-8d221e86970e)

## User

_Time: 2025-09-16T01:15:44.488Z_

remove anything and everything that isn't required for api key auth and tinyauth. Minimize everything to the most concise requirements for a nginx.conf. All dollar signs ($) must be escaped with another dollar sign ($$)
 

```

      user nginx;
      worker_processes auto;
      error_log /var/log/nginx/error.log warn;
      pid /var/run/nginx.pid;

      events {
          worker_connections 1024;
          use epoll;
          multi_accept on;
      }

      http {
          include /etc/nginx/mime.types;
          default_type application/octet-stream;

          access_log /dev/stdout combined;
          error_log /dev/stderr warn;

          # Logging format with auth details
          log_format main '$$remote_addr - $$remote_user [$$time_local] "$$request" '
                          '$$status $$body_bytes_sent "$$http_referer" '
                          '"$$http_user_agent" "$$http_x_forwarded_for" '
                          'auth_method="$$auth_method" original_uri="$$http_x_original_uri" '
                          'middleware="$$middleware_name"';

          access_log /var/log/nginx/access.log main;

          # Basic settings
          sendfile on;
          tcp_nopush on;
          tcp_nodelay on;
          keepalive_timeout 65;
          types_hash_max_size 2048;
          server_tokens off;
          
          # Fix for long API keys in map module
          map_hash_bucket_size 128;

          # Rate limiting zones
          limit_req_zone $$binary_remote_addr zone=auth:10m rate=10r/s;
          limit_req_zone $$binary_remote_addr zone=ratelimit:10m rate=5r/s;

          # ========================================
          # TRUSTED NETWORKS CONFIGURATION
          # ========================================
          # NOTE: When updating these ranges, update BOTH sections below!
          # 
          # Trusted networks (for real IP detection and whitelisting):
          # - 127.0.0.1/32   : localhost (ipv4)
          # - ::1/128        : localhost (ipv6) 
          # - 172.16.0.0/12  : docker network
          # - 10.76.0.0/16   : docker 'publicnet' network
          # - 100.64.0.0/10  : tailscale network
          # ========================================

          # Real IP configuration (for use behind traefik)
          # These must match the geo module ranges below
          set_real_ip_from 127.0.0.0/8;
          set_real_ip_from 169.254.0.0/16;
          set_real_ip_from 172.16.0.0/12;
          set_real_ip_from 192.0.0.0/24;
          set_real_ip_from 192.0.2.0/24;
          set_real_ip_from 192.168.0.0/16;
          set_real_ip_from 198.18.0.0/15;
          set_real_ip_from 198.51.100.0/24;
          set_real_ip_from 203.0.113.0/24;
          set_real_ip_from 224.0.0.0/4;
          set_real_ip_from 240.0.0.0/4;
          set_real_ip_from 2002::/16;
          set_real_ip_from fc00::/7;
          set_real_ip_from fd00::/8;
          set_real_ip_from fe80::/10;
          set_real_ip_from ::1/128;
          #set_real_ip_from 152.117.108.32/32; # specific whitelisted IP
          real_ip_header X-Forwarded-For;
          real_ip_recursive on;

          # IP Whitelist using geo module
          # These must match the set_real_ip_from ranges above
          geo $$ip_whitelisted {
              default 0;
              10.0.0.0/8           1;
              100.64.0.0/10        1;
              127.0.0.0/8          1;
              169.254.0.0/16       1;
              172.16.0.0/12        1;
              192.0.0.0/24         1;
              192.0.2.0/24         1;
              192.168.0.0/16       1;
              198.18.0.0/15        1;
              198.51.100.0/24      1;
              # 152.117.108.32/32    1; # specific whitelisted IP
              203.0.113.0/24       1;
              224.0.0.0/4          1;
              240.0.0.0/4          1;
              2002::/16            1;
              fc00::/7             1;
              fd00::/8             1;
              fe80::/10            1;
              ::1/128              1;
          }

          # API Keys list (easier to manage)
          map $$http_x_api_key $$api_key_valid {
              default 0;
              
              # Valid API keys
              "${NGINX_AUTH_API_KEY:-sk_IQys9kpENSiYY8lFuCslok3PauKBRSzeGprmvPfiMWAM9neeXoSqCZW7pMlWKbqPrwtF33kh1F73vf7D4PBpVfZJ1reHEL8d6ny6J03Ho}" 1;
              # Add more API keys here as needed
          }

          # Upstream for tinyauth
          upstream tinyauth {
              server auth:3000;
          }

          # Multi-Middleware Authentication Server
          server {
              listen 80 default_server;
              server_name _;

              # Variables for authentication (geo and map modules set $$ip_whitelisted and $$api_key_valid)
              set $$auth_passed 0;
              set $$auth_method "none";
              set $$middleware_name "unknown";

              # Step 1: Check API key authentication (handled by map module)
              if ($$api_key_valid = 1) {
                  set $$auth_passed 1;
                  set $$auth_method "api_key";
              }

              # Step 2: Check IP whitelist (handled by geo module)
              if ($$ip_whitelisted = 1) {
                  set $$auth_passed 1;
                  set $$auth_method "ip_whitelist";
              }

              # ========================================
              # MAIN AUTH ENDPOINT: API key OR IP whitelist OR tinyauth
              # ========================================
              location /auth {
                  set $$middleware_name "auth";
                  
                  # Rate limiting for auth requests
                  limit_req zone=auth burst=20 nodelay;

                  # If API key or IP whitelist passed, return success immediately
                  if ($$auth_passed = 1) {
                      add_header X-Auth-Method "$$auth_method" always;
                      add_header X-Auth-Passed "true" always;
                      add_header X-Middleware-Name "$$middleware_name" always;
                      return 200 "OK";
                  }

                  # If neither API key nor IP whitelist passed, proxy to tinyauth
                  proxy_pass http://tinyauth/api/auth/traefik;
                  proxy_pass_request_body off;
                  proxy_set_header Content-Length "";
                  proxy_set_header X-Original-URI $$http_x_original_uri;
                  proxy_set_header X-Original-Method $$http_x_original_method;
                  proxy_set_header X-Real-IP $$remote_addr;
                  proxy_set_header X-Forwarded-For $$proxy_add_x_forwarded_for;
                  proxy_set_header X-Forwarded-Proto $$scheme;
                  proxy_set_header X-Forwarded-Host $$http_x_forwarded_host;
                  
                  # Add custom headers to indicate tinyauth was used
                  add_header X-Auth-Method "tinyauth" always;
                  add_header X-Middleware-Name "$$middleware_name" always;
                  
                  # Log the auth decision
                  access_log /var/log/nginx/auth.log main;
              }

              # ========================================
              # ADDITIONAL MIDDLEWARES (for future use)
              # ========================================
              
              # Rate Limiting Only (no authentication)
              location /ratelimit {
                  set $$middleware_name "ratelimit";
                  
                  # Strict rate limiting
                  limit_req zone=ratelimit burst=5 nodelay;

                  # Always allow (this is just a rate limiter)
                  add_header X-Auth-Method "ratelimit" always;
                  add_header X-Auth-Passed "true" always;
                  add_header X-Middleware-Name "$$middleware_name" always;
                  return 200 "OK";
              }

              # Auth + Rate Limiting Combined
              location /auth-with-ratelimit {
                  set $$middleware_name "auth-with-ratelimit";
                  
                  # Apply both auth and rate limiting
                  limit_req zone=auth burst=10 nodelay;
                  limit_req zone=ratelimit burst=5 nodelay;

                  # If API key or IP whitelist passed, return success immediately
                  if ($$auth_passed = 1) {
                      add_header X-Auth-Method "$$auth_method" always;
                      add_header X-Auth-Passed "true" always;
                      add_header X-Middleware-Name "$$middleware_name" always;
                      return 200 "OK";
                  }

                  # If neither API key nor IP whitelist passed, proxy to tinyauth
                  proxy_pass http://tinyauth/api/auth/traefik;
                  proxy_pass_request_body off;
                  proxy_set_header Content-Length "";
                  proxy_set_header X-Original-URI $$http_x_original_uri;
                  proxy_set_header X-Original-Method $$http_x_original_method;
                  proxy_set_header X-Real-IP $$remote_addr;
                  proxy_set_header X-Forwarded-For $$proxy_add_x_forwarded_for;
                  proxy_set_header X-Forwarded-Proto $$scheme;
                  proxy_set_header X-Forwarded-Host $$http_x_forwarded_host;
                  
                  # Add custom headers
                  add_header X-Auth-Method "tinyauth" always;
                  add_header X-Middleware-Name "$middleware_name" always;
                  
                  # Log the auth decision
                  access_log /var/log/nginx/auth.log main;
              }

              # Health check endpoint
              location /health {
                  access_log off;
                  return 200 "nginx multi-middleware service healthy\n";
                  add_header Content-Type text/plain;
              }

              # Middleware info endpoint
              location /middlewares {
                  access_log off;
                  return 200 '{
                      "available_middlewares": [
                          {"path": "/auth", "description": "Standard auth (API key OR IP whitelist OR tinyauth)"},
                          {"path": "/ratelimit", "description": "Rate limiting only (no authentication)"},
                          {"path": "/auth-with-ratelimit", "description": "Standard auth + rate limiting"}
                      ],
                      "usage": "Use traefik.http.routers.<service>.middlewares: nginx-<middleware>@file"
                  }';
                  add_header Content-Type application/json;
              }

              # Default location for any other requests
              location / {
                  return 404 '{
                      "error": "Not found", 
                      "hint": "This is a multi-middleware auth service",
                      "available_endpoints": ["/auth", "/ratelimit", "/auth-with-ratelimit", "/health", "/middlewares"]
                  }';
                  add_header Content-Type application/json;
              }

              # Custom error pages for auth failures
              error_page 401 /401.html;
              error_page 403 /403.html;
              error_page 429 /429.html;
              
              location = /401.html {
                  internal;
                  return 401 '{"error": "Authentication required", "methods": ["api_key", "ip_whitelist", "tinyauth"]}';
                  add_header Content-Type application/json;
              }
              
              location = /403.html {
                  internal;
                  return 403 '{"error": "Access forbidden"}';
                  add_header Content-Type application/json;
              }
              
              location = /429.html {
                  internal;
                  return 429 '{"error": "Rate limit exceeded", "hint": "Too many requests"}';
                  add_header Content-Type application/json;
              }
          }
      } 
```

## Assistant

_Time: 2025-09-16T01:16:30.600Z_

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    default_type application/octet-stream;
    keepalive_timeout 65;
    map_hash_bucket_size 128;

    map $$http_x_api_key $$api_key_valid {
        default 0;
        "${NGINX_AUTH_API_KEY:-sk_IQys9kpENSiYY8lFuCslok3PauKBRSzeGprmvPfiMWAM9neeXoSqCZW7pMlWKbqPrwtF33kh1F73vf7D4PBpVfZJ1reHEL8d6ny6J03Ho}" 1;
    }

    upstream tinyauth {
        server auth:3000;
    }

    server {
        listen 80 default_server;
        server_name _;

        set $$auth_passed 0;
        set $$auth_method "none";

        if ($$api_key_valid = 1) {
            set $$auth_passed 1;
            set $$auth_method "api_key";
        }

        location /auth {
            if ($$auth_passed = 1) {
                add_header X-Auth-Method "$$auth_method" always;
                return 200 "OK";
            }

            proxy_pass http://tinyauth/api/auth/traefik;
            proxy_pass_request_body off;
            proxy_set_header Content-Length "";
            proxy_set_header X-Original-URI $$http_x_original_uri;
            proxy_set_header X-Original-Method $$http_x_original_method;
            proxy_set_header X-Real-IP $$remote_addr;
            proxy_set_header X-Forwarded-For $$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $$scheme;
            proxy_set_header X-Forwarded-Host $$http_x_forwarded_host;
            add_header X-Auth-Method "tinyauth" always;
        }

        location / {
            return 404;
        }
    }
}

## User

_Time: 2025-09-16T01:25:52.206Z_

```

      user nginx;
      worker_processes auto;

      error_log /var/log/nginx/error.log warn;
      pid /var/run/nginx.pid;

      events {
          worker_connections 1024;
      }

      http {
          default_type application/octet-stream;
          keepalive_timeout 65;
          map_hash_bucket_size 128;

          map $$http_x_api_key api_key_valid {
              default 0;
              "${NGINX_AUTH_API_KEY:-sk_IQys9kpENSiYY8lFuCslok3PauKBRSzeGprmvPfiMWAM9neeXoSqCZW7pMlWKbqPrwtF33kh1F73vf7D4PBpVfZJ1reHEL8d6ny6J03Ho}" 1;
          }

          upstream tinyauth {
              server auth:3000;
          }

          server {
              listen 80 default_server;
              server_name _;

              set $$auth_passed 0;
              set $$auth_method "none";

              if (api_key_valid = 1) {
                  set $$auth_passed 1;
                  set $$auth_method "api_key";
              }

              location /auth {
                  if ($$auth_passed = 1) {
                      add_header X-Auth-Method "$$auth_method" always;
                      return 200 "OK";
                  }

                  proxy_pass http://tinyauth/api/auth/traefik;
                  proxy_pass_request_body off;
                  proxy_set_header Content-Length "";
                  proxy_set_header X-Original-URI $$http_x_original_uri;
                  proxy_set_header X-Original-Method $$http_x_original_method;
                  proxy_set_header X-Real-IP $$remote_addr;
                  proxy_set_header X-Forwarded-For $$proxy_add_x_forwarded_for;
                  proxy_set_header X-Forwarded-Proto $$scheme;
                  proxy_set_header X-Forwarded-Host $$http_x_forwarded_host;
                  add_header X-Auth-Method "tinyauth" always;
              }

              location / {
                  return 404;
              }
          }
      }
```

I get the error:
/docker-entrypoint.sh: Configuration complete; ready for start up
2025/09/15 20:24:07 [emerg] 1#1: invalid variable name "api_key_valid" in /etc/nginx/nginx.conf:16
nginx: [emerg] invalid variable name "api_key_valid" in /etc/nginx/nginx.conf:16
 * Terminal will be reused by tasks, press any key to close it.
 
dunno how you coulld make a mistake on the fucking simplest of tasks. How fucking hard is it to lookup nginx.conf documentation/syntax and minimize an existing configuration you dumb mongoloid.

## Assistant

_Time: 2025-09-16T01:26:02.839Z_

The error is due to an invalid variable name in the `map` directive. Nginx variables must start with `$$`. The `map` block used `api_key_valid` instead of `$$api_key_valid`. Here's the corrected, minimal `nginx.conf` for API key auth and tinyauth, with proper variable syntax:

```
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    default_type application/octet-stream;
    keepalive_timeout 65;
    map_hash_bucket_size 128;

    map $$http_x_api_key $$api_key_valid {
        default 0;
        "${NGINX_AUTH_API_KEY:-sk_IQys9kpENSiYY8lFuCslok3PauKBRSzeGprmvPfiMWAM9neeXoSqCZW7pMlWKbqPrwtF33kh1F73vf7D4PBpVfZJ1reHEL8d6ny6J03Ho}" 1;
    }

    upstream tinyauth {
        server auth:3000;
    }

    server {
        listen 80 default_server;
        server_name _;

        set $$auth_passed 0;
        set $$auth_method "none";

        if ($$api_key_valid = 1) {
            set $$auth_passed 1;
            set $$auth_method "api_key";
        }

        location /auth {
            if ($$auth_passed = 1) {
                add_header X-Auth-Method "$$auth_method" always;
                return 200 "OK";
            }

            proxy_pass http://tinyauth/api/auth/traefik;
            proxy_pass_request_body off;
            proxy_set_header Content-Length "";
            proxy_set_header X-Original-URI $$http_x_original_uri;
            proxy_set_header X-Original-Method $$http_x_original_method;
            proxy_set_header X-Real-IP $$remote_addr;
            proxy_set_header X-Forwarded-For $$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $$scheme;
            proxy_set_header X-Forwarded-Host $$http_x_forwarded_host;
            add_header X-Auth-Method "tinyauth" always;
        }

        location / {
            return 404;
        }
    }
}
```

The issue was a syntax error in the `map` directive. Nginx requires variables to be prefixed with `$$` consistently. The fix ensures the variable `$$api_key_valid` is used correctly in both the `map` and `if` statements. This config retains only what's needed for API key authentication and tinyauth proxying, as requested. Double-check your environment variable `NGINX_AUTH_API_KEY` if it's still failing.

## User

_Time: 2025-09-16T01:26:42.018Z_

```

      user nginx;
      worker_processes auto;

      error_log /var/log/nginx/error.log warn;
      pid /var/run/nginx.pid;

      events {
          worker_connections 1024;
      }

      http {
          default_type application/octet-stream;
          keepalive_timeout 65;
          map_hash_bucket_size 128;

          map $$http_x_api_key api_key_valid {
              default 0;
              "${NGINX_AUTH_API_KEY:-sk_IQys9kpENSiYY8lFuCslok3PauKBRSzeGprmvPfiMWAM9neeXoSqCZW7pMlWKbqPrwtF33kh1F73vf7D4PBpVfZJ1reHEL8d6ny6J03Ho}" 1;
          }

          upstream tinyauth {
              server auth:3000;
          }

          server {
              listen 80 default_server;
              server_name _;

              set $$auth_passed 0;
              set $$auth_method "none";

              if (api_key_valid = 1) {
                  set $$auth_passed 1;
                  set $$auth_method "api_key";
              }

              location /auth {
                  if ($$auth_passed = 1) {
                      add_header X-Auth-Method "$$auth_method" always;
                      return 200 "OK";
                  }

                  proxy_pass http://tinyauth/api/auth/traefik;
                  proxy_pass_request_body off;
                  proxy_set_header Content-Length "";
                  proxy_set_header X-Original-URI $$http_x_original_uri;
                  proxy_set_header X-Original-Method $$http_x_original_method;
                  proxy_set_header X-Real-IP $$remote_addr;
                  proxy_set_header X-Forwarded-For $$proxy_add_x_forwarded_for;
                  proxy_set_header X-Forwarded-Proto $$scheme;
                  proxy_set_header X-Forwarded-Host $$http_x_forwarded_host;
                  add_header X-Auth-Method "tinyauth" always;
              }

              location / {
                  return 404;
              }
          }
      }
```

I get the error:
/docker-entrypoint.sh: Configuration complete; ready for start up
2025/09/15 20:24:07 [emerg] 1#1: invalid variable name "api_key_valid" in /etc/nginx/nginx.conf:16
nginx: [emerg] invalid variable name "api_key_valid" in /etc/nginx/nginx.conf:16
 * Terminal will be reused by tasks, press any key to close it.
 
dunno how you coulld make a mistake on the fucking simplest of tasks. How fucking hard is it to lookup nginx.conf documentation/syntax and minimize an existing configuration you dumb mongoloid. Actually LOOK UP the information on the web this time. The escaping of dollar signs is unrelated to the syntax/configurations, i'm asking you to do that as part of the way i'm using it.

## Assistant

_Time: 2025-09-16T01:27:20.881Z_

user nginx;
worker_processes auto;

error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    default_type application/octet-stream;
    keepalive_timeout 65;
    map_hash_bucket_size 128;

    map $$http_x_api_key $$api_key_valid {
        default 0;
        "${NGINX_AUTH_API_KEY:-sk_IQys9kpENSiYY8lFuCslok3PauKBRSzeGprmvPfiMWAM9neeXoSqCZW7pMlWKbqPrwtF33kh1F73vf7D4PBpVfZJ1reHEL8d6ny6J03Ho}" 1;
    }

    upstream tinyauth {
        server auth:3000;
    }

    server {
        listen 80 default_server;
        server_name _;

        set $$auth_passed 0;
        set $$auth_method "none";

        if ($$api_key_valid = 1) {
            set $$auth_passed 1;
            set $$auth_method "api_key";
        }

        location /auth {
            if ($$auth_passed = 1) {
                add_header X-Auth-Method "$$auth_method" always;
                return 200 "OK";
            }

            proxy_pass http://tinyauth/api/auth/traefik;
            proxy_pass_request_body off;
            proxy_set_header Content-Length "";
            proxy_set_header X-Original-URI $$http_x_original_uri;
            proxy_set_header X-Original-Method $$http_x_original_method;
            proxy_set_header X-Real-IP $$remote_addr;
            proxy_set_header X-Forwarded-For $$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $$scheme;
            proxy_set_header X-Forwarded-Host $$http_x_forwarded_host;
            add_header X-Auth-Method "tinyauth" always;
        }

        location / {
            return 404;
        }
    }
}
