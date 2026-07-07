---
source_url: "https://grok.com/c/3d609755-0dfb-404b-9483-318957b4ddfb"
conversation_id: "3d609755-0dfb-404b-9483-318957b4ddfb"
title: "Alternatives to TinyAuth Login Pages"
extracted_at: "2026-06-29T16:25:34.305Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Alternatives to TinyAuth Login Pages

Source: [Grok conversation](https://grok.com/c/3d609755-0dfb-404b-9483-318957b4ddfb)

## User

_Time: 2025-08-11T15:17:17.732Z_

alternatives to

```dockercompose
ghcr.io/steveiliop56/tinyauth:v3
```

looking for login pages i can put in front of my services, similar to tinyauth. Don't include 'tinyauth' in your response, only include alternatives and similar login pages that'll protect my services. Do NOT recommend forward auth to google/github or some other existing sso like authelia/authentik literally only find alternatives that has their own login page and functionality to support its design and functionality. prioritize github results and reddit. Your response must contain 10 fully comprehensive and exhaustive solutions, preferably in copy/pasteable form.

## Assistant

_Time: 2025-08-11T15:21:39.550Z_

### 1. Auth Portal
This solution provides a form-based authentication portal that can be placed in front of services using Nginx for proxying.

```yaml
version: '3'
services:
  auth-portal:
    image: glenndehaan/auth-portal
    ports:
      - '9897:3000'
    environment:
      - APP_TITLE=Service Auth
      - AUTH_URL=https://login.yourdomain.com/login
      - USERS=user@domain.com:$apr1$example$hashedpassword
      - COOKIE_NAME=auth_cookie
      - COOKIE_DOMAIN=yourdomain.com
    volumes:
      - ./db:/db  # Optional for JSON users
```

### 2. Docker Authz Proxy
This reverse proxy enables form-based authentication for protected services, configured via environment variables.

```yaml
version: '3'
services:
  authz-proxy:
    image: doeringp/authz-proxy:latest
    ports:
      - '80:80'
    environment:
      - AuthzProxy:TargetUrl=http://your-service:port
      - AuthzProxy:User=yourusername
      - AuthzProxy:Password=yourpassword
      - AuthzProxy:Whitelist=/public
    volumes:
      - ./keys:/root/.aspnet/DataProtection-Keys
```

### 3. NForwardAuth
A minimalist forward auth service with a form-based login page for reverse proxies like Traefik or Nginx.

```yaml
version: '3'
services:
  nforwardauth:
    image: nosduco/nforwardauth:v1
    ports:
      - '3000:3000'
    environment:
      - TOKEN_SECRET=your-secret-key
      - AUTH_HOST=auth.yourdomain.com
    volumes:
      - ./passwd:/passwd  # Store username:hashedpassword pairs
```

### 4. Cosmos Server
A secure self-hosted gateway with built-in HTML form login and multi-factor authentication for protecting applications.

```yaml
version: '3'
services:
  cosmos-server:
    image: azukaar/cosmos-server:latest
    ports:
      - '80:80'
      - '443:443'
    environment:
      - COSMOS_AUTH_STRATEGY=html
      - COSMOS_USERNAME=admin
      - COSMOS_PASSWORD=yoursecurepassword
    volumes:
      - ./data:/data
```

### 5. Cloud in a Box
A Docker stack with form-based login for browser IDE and services, including resource monitoring.

```yaml
version: '3'
services:
  browser-ide:
    image: tthebc01/browser-ide
    ports:
      - '80:3000'
    environment:
      - AUTHP_ADMIN_USER=admin
      - AUTHP_ADMIN_SECRET=yourpassword
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock  # For Docker-in-Docker
```

### 6. Caddy Security
An authentication plugin for Caddy v2 supporting form-based login, used as a reverse proxy for services.

```yaml
version: '3'
services:
  caddy-security:
    image: ghcr.io/authcrunch/authcrunch:latest  # Includes caddy-security
    ports:
      - '80:80'
      - '443:443'
    environment:
      - CADDY_AUTH_FORM_ENABLED=true
      - CADDY_USER=admin
      - CADDY_PASSWORD=hashedpassword
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile  # Configure proxy rules
```

### 7. Nginx Basic Auth Proxy (dtan4)
A simple Nginx-based proxy with HTTP basic authentication to protect services.

```yaml
version: '3'
services:
  nginx-basic-auth-proxy:
    image: dtan4/nginx-basic-auth-proxy:latest
    ports:
      - '80:80'
    environment:
      - BASIC_AUTH_USERNAME=admin
      - BASIC_AUTH_PASSWORD=yourpassword
      - UPSTREAM=http://your-service:port
```

### 8. Nginx Basic Auth (beevelop)
A lightweight Docker image for Nginx with basic authentication in front of services.

```yaml
version: '3'
services:
  nginx-basic-auth:
    image: beevelop/nginx-basic-auth:latest
    ports:
      - '80:80'
    environment:
      - HTPASSWD=admin:$apr1$example$hashedpassword
      - FORWARD_HOST=your-service
      - FORWARD_PORT=8080
    links:
      - your-service
```

### 9. Basic Auth Proxy (aklinkert)
An Nginx proxy in Docker enabling basic auth for downstream services.

```yaml
version: '3'
services:
  basic-auth-proxy:
    image: apinnecke/basic-auth-proxy:latest
    ports:
      - '80:80'
    environment:
      - TARGET=http://your-service:port
    volumes:
      - ./htpasswd:/etc/nginx/basic_auth  # Format: user:hashedpass
```

### 10. Authenticated Proxy (bahamat)
An Apache HTTP proxy using basic auth, suitable for Docker environments.

```yaml
version: '3'
services:
  authenticated-proxy:
    image: bahamat/authenticated-proxy:latest
    ports:
      - '80:80'
    environment:
      - AUTH_USER=admin
      - AUTH_PASS=yourpassword
      - PROXY_PASS=http://your-service:port
```
