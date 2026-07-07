---
source_url: "https://chatgpt.com/c/68621f4c-d638-8006-948c-91aa2db72749"
conversation_id: "68621f4c-d638-8006-948c-91aa2db72749"
title: "Reverse Proxy URL Setup"
extracted_at: "2026-06-29T16:32:11.086Z"
message_count: 4
provenance: auth-ui
---

# Reverse Proxy URL Setup

Source: [ChatGPT conversation](https://chatgpt.com/c/68621f4c-d638-8006-948c-91aa2db72749)

## User

in svelte there are variables like PUBLIC_BACKEND_URL and ORIGIN and BACKEND_URL.

When it comes to reverse proxies, do I set those variables in context of my reverse proxy, or do I set it based on what the internal services are seeing?

for example if i use nginx to reverse proxy http://my-docker-container-ipv4:8080 to https://my-docker-container.example.com, does this mean ORIGIN needs to be the http one or the https one?

basically, internally, how on earth does ORIGIN and BACKEND_URL work? what specific implementation are they using and where are they in the OCI model, like i just know the flow needs to be considered to even determine if they have access to what the reverse proxy is doing or if they are isolated.

I can't find a straight answer. instrructions always say 'set ORIGIN to the url you access it on ip:port' but they never consider reverse proxy. Example:


## Self Hosted

### Docker Compose

Copy over the contents of [docker-compose.yml](docker-compose.yml) to your `docker-compose.yml` file.

> [!NOTE]
> You can check out the [docker-compose-full.yml](docker-compose-full.yml) file to get an idea of how things tie together.

Then run `docker compose up -d` to start the container in the background. You can then access the web interface at `http://localhost:3000` or whatever port and origin you set in the `docker-compose.yml` file.

> [!TIP]
> On first run, Riven creates a `settings.json` file in the `data` directory. You can edit the settings from frontend, or manually edit the file and restart the container or use `.env` or docker-compose environment variables to set the settings (see `.env.example` for reference).

#### What is ORIGIN ?

`ORIGIN` is the URL of the frontend on which you will access it from anywhere. If you are hosting Riven on a vps with IP address `123.45.67.890` then you will need to set the `ORIGIN` to `http://123.45.67.890:3000` (no trailing slash). Similarly, if using a domain name, you will need to set the `ORIGIN` to `http://riven.example.com:3000` (no trailing slash). If you change the port in the `docker-compose.yml` file, you will need to change it in the `ORIGIN` as well.

services:
    riven-frontend:
        image: spoked/riven-frontend:latest
        container_name: riven-frontend
        restart: unless-stopped
        tty: true
        environment:
            - TZ=Etc/UTC
        ports:
            - 3000:3000
        volumes:
            - ./config:/riven/config # You need to mount a config directory here (different from riven)
        depends_on:
            riven:
                condition: service_started

    riven:
        image: spoked/riven:latest
        container_name: riven
        restart: unless-stopped
        ports:
            - "8080:8080"
        tty: true
        environment:
            - PUID=1000
            - PGID=1000
            - TZ=America/New_York
            - RIVEN_FORCE_ENV=true
            - RIVEN_DATABASE_HOST=postgresql+psycopg2://postgres:postgres@riven-db/riven
        healthcheck:
            test: curl -s http://localhost:8080 >/dev/null || exit 1
            interval: 30s
            timeout: 10s
            retries: 10
        volumes:
            - ./data:/riven/data
            - /mnt:/mnt
        depends_on:
            riven_postgres:
                condition: service_healthy

    riven_postgres:
        image: postgres:17-alpine
        container_name: riven-db
        environment:
            PGDATA: /var/lib/postgresql/data/pgdata
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: postgres
            POSTGRES_DB: riven
        volumes:
            - ./riven-db:/var/lib/postgresql/data/pgdata
        healthcheck:
            test: ["CMD-SHELL", "pg_isready -U postgres"]
            interval: 10s
            timeout: 5s
            retries: 5


Now I have tried setting ORIGIN and BACKEND_URL to everything i could possibly imagine but i'm still getting various issues in the frontend and vague 'an unexpected error has occurred'.

You know what fuck everything with this task and forget it. Why does *LITERALLY* **EVERY** frontend service always give the most vague fucking 'an unexpected error has occurred'. WHAT ERROR. LITERALLY WHAT. WHY IS IT ALWAYS THE SAME FUCKING 'AN UNEXPECTED ERROR'. Sometimes they'll even say 'something happened on our side'. What the FUCK is actually happening. Literally everyone does this like e.g. facebook/google/whatever. What IS the error and why is it always stupidly temporary? Why can't they just TELL Me what the error is like literally any other app in the world? What information am i MISSING and NOT understanding?
Show more

## Assistant

You're not alone in this frustration. What you're running into is the unholy trinity of frontend development: environment variables, reverse proxies, and garbage error messages. Let's break it all down calmly, practically, and in a way that actually explains what the hell is going on.

🔥 TL;DR: You need to set ORIGIN to the public-facing URL (e.g., https://yourdomain.com) and BACKEND_URL to what the frontend can reach the backend as (usually internal Docker DNS like http://riven:8080).
Table of Contents

🔍 Why errors are vague (and how to fix that)

⚙️ What ORIGIN, PUBLIC_BACKEND_URL, and BACKEND_URL actually mean

🧠 How reverse proxies fit in (NGINX, Docker)

🧪 How to debug the nightmare (with actual tools)

🧭 Concrete config that actually works

1. 🔍 Why errors are vague (and how to fix that)
The Problem:

Frontend apps — especially SPAs (Svelte, React, Vue) — catch errors in generic catch blocks. When the backend returns a 500, CORS fails, or a network request bombs? You get "An unexpected error occurred".

Why?

Security & UX. They don't want to leak stack traces, and they don't want to overwhelm users. But that’s terrible for debugging.

Fix It:

Open your browser’s DevTools → Network tab. Look for the failed request.

Check status codes and response bodies.

If it’s a CORS issue, it will say something like Access-Control-Allow-Origin missing.

Check the Console tab for tracebacks.

2. ⚙️ What do ORIGIN, BACKEND_URL, and PUBLIC_BACKEND_URL actually mean?

These are just environment variables, but where and how you use them matters.

Variable	Where Used	Purpose
ORIGIN	Backend	Tells the backend what the expected origin of frontend requests is. It checks this for CORS/security.
BACKEND_URL	Frontend	Used by the frontend to know where to send API requests.
PUBLIC_BACKEND_URL	Frontend (SvelteKit/Vite)	Used during build-time, often exposed to the browser as import.meta.env.PUBLIC_BACKEND_URL. Must be a full URL!
3. 🧠 How reverse proxies fit in
🔄 Diagram: The flow
Browser → https://example.com (nginx)
                ↓
       nginx proxies to http://riven-frontend:3000
                ↓
       frontend calls BACKEND_URL (e.g., http://riven:8080)
                ↓
       backend checks ORIGIN (e.g., https://example.com)
✅ Set these values like this:
Docker:
YAML
environment:
  - ORIGIN=https://example.com
  - BACKEND_URL=http://riven:8080
Frontend:
env
PUBLIC_BACKEND_URL=http://riven:8080
nginx config:
Nginx
server {
    listen 443 ssl;
    server_name example.com;

    location / {
        proxy_pass http://riven-frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://riven:8080;
        # Add CORS headers if needed
    }
}

✅ Your ORIGIN should match what the browser sees in its address bar.
✅ Your BACKEND_URL should be how the frontend container can reach the backend (Docker internal DNS).

4. 🧪 How to debug the nightmare

Start with curl:

Inside the riven-frontend container: curl http://riven:8080/health — if this fails, you're screwed until you fix it.

Browser DevTools:

Check failed request URLs. Are they calling localhost instead of your domain?

Add logging:

Temporarily change your backend to log every request and origin.

5. 🧭 Example: Working config

Let's say:

You host on https://riven.example.com

You're reverse proxying with nginx to http://riven-frontend:3000

Your backend container is called riven, port 8080

In .env for frontend:
env
PUBLIC_BACKEND_URL=http://riven:8080
In docker-compose:
YAML
riven-frontend:
  environment:
    - PUBLIC_BACKEND_URL=http://riven:8080

riven:
  environment:
    - ORIGIN=https://riven.example.com
🧠 Why this is so hard

Because most frontend frameworks are designed to be hosted either:

directly (no reverse proxy), or

on the same domain as backend (easy CORS)

Once you mix:

Docker

Subdomains

Reverse proxies

SSL

Different internal vs external URLs

…it all blows up.

And most tutorials don’t account for this complexity.

💬 Final thoughts

You’re not missing anything fundamental. The real problem is that:

Frontend apps hide errors

Env var names are vague and inconsistent

Docker & proxies create dual networking realities (internal vs external)

Most docs don’t actually explain flow

If you want, I can help you:

Craft a working docker-compose.yml

Build a proper nginx config

Debug your current setup with logs and curl

You’re close — this kind of frustration is sadly the final boss of self-hosted web apps. But you can absolutely beat it.

## User

ok cool so i see the error... but these COPY options are incredibly confusing and not what i want. How to copy the ENTIRE thing--what was attempted, what error occurred, and all the contextual information exhaustively. Why isn't there just a 'COPY ALL' button?????

## Assistant

You're absolutely right — DevTools’ “Copy” options are scattered and confusing, and there’s no single “Copy Everything” button that gives you exactly what you want: request + response + headers + body + error all at once in a clean format.

But you can get pretty close by doing one of the following:

✅ Best Option: “Copy all as HAR (sanitized)”
What it does:

Copies all requests in that session (like a log)

Includes:

Request URL

Method

Headers (request & response)

Payload/body

Timing

Response (if any)

How:

Right-click anywhere in the request list →
Copy → Copy all as HAR (sanitized)

🔧 To extract what you want:

Paste into a text editor or JSON viewer

Search for the specific request (add?imdb_ids=...)

You’ll see full detail including response errors, status codes, and CORS messages.

✅ Option 2: Save the whole session

If you want to keep it persistent or share it:

Click the download icon in the top right of the Network tab (↓ symbol).

This saves a .har file.

Open in:

Google HAR Viewer

Or upload to me and I’ll parse it for you.

✅ Option 3: Copy request + response individually

Click the failed request

Switch to the tabs:

Headers → Right-click → Copy all as cURL or Copy response

Response tab → Right-click → Copy response

Preview, if available, may show JSON error details

Combine manually

❌ Avoid These for Full Debug:

Copy as fetch, Copy stack trace, etc. are only for reproducing in code, not full diagnostics.

🚀 What We All Want (but doesn’t exist yet):

A single “📋 Copy Complete Debug Snapshot” button that gives:

Request + Response

All headers

Full body

Any JS errors that happened

CORS issues

Stack traces if available

Until then, HAR is your friend.

If you want, upload the HAR file or paste the HAR JSON for the failing request and I’ll extract the actual root cause for you.
