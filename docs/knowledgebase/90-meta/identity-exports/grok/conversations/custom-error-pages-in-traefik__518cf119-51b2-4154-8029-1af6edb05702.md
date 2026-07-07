---
source_url: "https://grok.com/c/518cf119-51b2-4154-8029-1af6edb05702"
conversation_id: "518cf119-51b2-4154-8029-1af6edb05702"
title: "Custom Error Pages in Traefik"
extracted_at: "2026-06-29T16:19:52.368Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Custom Error Pages in Traefik

Source: [Grok conversation](https://grok.com/c/518cf119-51b2-4154-8029-1af6edb05702)

## User

_Time: 2025-09-20T19:05:32.692Z_

search ways to use custom error pages in traefik WITHOUT the middleware

## Assistant

_Time: 2025-09-20T19:08:18.537Z_

### Key Points
- Research across official documentation, community forums, blogs, and code repositories indicates that custom error pages in Traefik are typically implemented using the built-in "errors" middleware, which redirects error responses to a dedicated service.
- No documented or community-suggested alternatives exist for setting up custom error pages without relying on middleware, as Traefik's architecture uses middlewares for such request modifications.
- For global handling (e.g., undefined subdomains or unavailable services), a catch-all router combined with the errors middleware is commonly recommended, but it still involves middleware.
- If avoiding middleware entirely is essential, consider handling errors within backend applications or using a different proxy, though this may not address Traefik-specific routing errors.

### Overview of Standard Approach
While the query specifies avoiding middleware, the standard method in Traefik (v2 and later) involves the errors middleware to intercept HTTP status codes (e.g., 400-599) and route them to a custom service, such as an Nginx container serving HTML error pages. This service is not hosted in Traefik itself but acts as an external backend. Configuration is done via labels in Docker, annotations in Kubernetes, or YAML/TOML files.

### Potential Workarounds and Limitations
Community discussions, such as those on Traefik's forum and Reddit, often explore global error handling for cases like 404s on non-existent routes. Solutions typically involve low-priority catch-all routers that apply the errors middleware globally. Attempts to combine this with other features (e.g., HTTPS redirects) can lead to conflicts, where default errors override custom ones. No sources describe a purely static configuration or built-in option for custom pages without middleware involvement.

### Recommendations
For most use cases, embrace the errors middleware as it's lightweight and designed for this purpose—see examples below for quick setup. If middleware is undesirable due to performance or complexity concerns, evaluate if Traefik's default plain-text error responses suffice, or migrate error handling to your applications.

---
### Detailed Survey on Custom Error Pages in Traefik

Traefik, a modern reverse proxy and load balancer, handles HTTP errors by default with simple plain-text responses, such as "404 page not found." Customizing these to provide user-friendly pages, branding, or additional information requires intercepting error responses and redirecting them to a dedicated service. Extensive review of sources, including official documentation, community forums, blogs, Stack Overflow, Reddit, and GitHub repositories, consistently points to the "errors" middleware as the core mechanism for this feature. This survey compiles configurations, examples, and insights from these sources, highlighting why middleware is integral and exploring why alternatives without it appear unavailable.

#### Core Mechanism: The Errors Middleware
The errors middleware in Traefik monitors for specified HTTP status code ranges (e.g., 400-599 for client and server errors) and, upon detection, queries a custom service to serve a replacement response.<grok:render card_id="3373f4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> This service is typically a lightweight web server like Nginx, which hosts static HTML files for different error codes. The middleware is not optional in documented setups because Traefik's dynamic routing relies on middlewares to modify requests and responses without altering core proxy behavior.

Key configuration options include:
- **status**: A list or range of HTTP codes to catch (e.g., "404" or "400-599").
- **service**: The name of the backend service providing the custom page.
- **query**: The path queried on the service, often including placeholders like /{status} to dynamically load pages (e.g., /404.html).

This approach ensures flexibility, as the custom service can generate dynamic content if needed, though static files are common for performance.

#### Configuration Examples Across Providers

1. **Docker (Labels-Based)**:
   From multiple blogs and forums, a typical Docker Compose setup involves defining an error service and attaching the middleware.<grok:render card_id="05756a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render><grok:render card_id="452fe9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render> Here's a synthesized example:

   ```yaml
   services:
     traefik:
       # ... (standard Traefik config)
     
     error-page:
       image: nginx
       volumes:
         - ./error-pages/html:/usr/share/nginx/html
         - ./error-pages/default.conf:/etc/nginx/conf.d/default.conf
       labels:
         - "traefik.http.services.error-page.loadbalancer.server.port=80"

   # In Traefik labels or dynamic config:
   labels:
     - "traefik.http.middlewares.custom-errors.errors.status=400-599"
     - "traefik.http.middlewares.custom-errors.errors.service=error-page"
     - "traefik.http.middlewares.custom-errors.errors.query=/{status}.html"
     - "traefik.http.routers.some-router.middlewares=custom-errors"  # Attach to specific routers
   ```

   The Nginx `default.conf` might look like:
   ```nginx
   server {
       listen 80;
       location / {
           root /usr/share/nginx/html;
           try_files /$uri /{status}.html =404;
       }
   }
   ```
   This setup serves custom files like 404.html from the mounted directory.

2. **Kubernetes (Annotations)**:
   In Kubernetes, the middleware is defined via IngressRoute or Middleware CRDs.<grok:render card_id="58d6ab" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render> Example Middleware YAML:
   ```yaml
   apiVersion: traefik.io/v1alpha1
   kind: Middleware
   metadata:
     name: custom-errors
   spec:
     errors:
       status:
         - "400-599"
       service:
         name: error-service
         port: 80
       query: /{status}.html
   ```
   Attach it to an IngressRoute:
   ```yaml
   apiVersion: traefik.io/v1alpha1
   kind: IngressRoute
   metadata:
     name: my-route
   spec:
     routes:
       - match: Host(`example.com`)
         kind: Rule
         services:
           - name: my-service
             port: 80
         middlewares:
           - name: custom-errors
   ```
   A separate Deployment for the error-service (e.g., Nginx pod) is required.

3. **File Provider (YAML/TOML)**:
   For non-container setups, use dynamic configuration files.<grok:render card_id="76c27e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render> Example in dynamic.toml:
   ```toml
   [http.middlewares]
     [http.middlewares.custom-errors.errors]
       status = ["400-599"]
       service = "error-service@internal"
       query = "/{status}.html"
   ```
   This is loaded via Traefik's static config pointing to the dynamic file.

#### Global Handling and Catch-All Routers
For global custom errors (e.g., for undefined subdomains or unavailable services), a low-priority catch-all router is used in conjunction with the errors middleware.<grok:render card_id="2bf179" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render><grok:render card_id="39df20" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> This catches requests not matching other routers:

   ```yaml
   labels:
     - "traefik.http.routers.catchall.rule=HostRegexp(`{host:.+}`)"
     - "traefik.http.routers.catchall.priority=1"
     - "traefik.http.routers.catchall.middlewares=custom-errors"
   ```

   This ensures even Traefik-generated errors (e.g., no matching router) are redirected to the custom service. Without the middleware, the catch-all would simply forward to a service, but error-specific logic (status code handling) wouldn't apply.

#### Common Issues and Troubleshooting
- **Conflicts with Other Middlewares**: Order matters in middleware chains. For example, placing an IP whitelist before errors might trigger default responses instead of custom ones.<grok:render card_id="ffee99" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render> Solution: Adjust chain order or priorities.
- **HTTPS Redirect Interference**: Enabling global HTTP-to-HTTPS redirects can bypass custom error handling for unavailable services, resulting in default 404s.<grok:render card_id="5a9b22" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render><grok:render card_id="193b04" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render> Workarounds include applying errors middleware at the entrypoint level, though this may not fully resolve conflicts.
- **Service Unavailability**: For offline backends, the middleware can redirect 502/503 errors, but requires the error service to be always available.<grok:render card_id="257a00" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- **Testing**: Test by accessing invalid paths or shutting down services. Logs may show middleware application.

#### Why No Alternatives Without Middleware?
Sources uniformly indicate that Traefik's design separates core proxying from enhancements like error customization, which are delegated to middlewares.<grok:render card_id="44bfda" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render card_id="db2349" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render> Without it, you're limited to Traefik's default responses. Potential non-middleware ideas discussed informally (e.g., custom plugins) still classify as middlewares. Handling errors in backend apps works for service-level errors but not for Traefik routing issues (e.g., no matching host). Repositories providing pre-built error pages assume middleware usage.<grok:render card_id="f3b854" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render><grok:render card_id="713c04" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render>

#### Performance and Best Practices
- Use static files in the error service for low overhead.
- Limit status ranges to avoid unnecessary intercepts.
- For production, incorporate variables like {status} for code-specific pages.
- Monitor Traefik logs for middleware errors.<grok:render card_id="760ffe" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>
- Consider open-source templates for error pages to speed up setup.<grok:render card_id="f63787" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">47</argument>
</grok:render>

| Aspect | With Errors Middleware | Without Middleware (Default) |
|--------|------------------------|------------------------------|
| Customization | High (branded HTML, dynamic content) | Low (plain text only) |
| Scope | Per-router or global via catch-all | Global, but unchangeable |
| Setup Complexity | Medium (requires error service) | None |
| Performance Impact | Minimal (intercepts only on error) | None |
| Examples Sources | Docs, blogs, forums | N/A (no customization) |

This survey underscores that while middleware is required for customization, it's a robust, extensible feature aligning with Traefik's modular philosophy.

### Key Citations
- [Errors - Traefik Labs documentation](https://doc.traefik.io/traefik/middlewares/http/errorpages/)<grok:render card_id="4353d5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [Customizing error pages in Traefik v.2](https://imandrea.me/blog/traefik-custom-404/)<grok:render card_id="e46ae0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>
- [How to customize Traefik error pages on docker-compose?](https://stackoverflow.com/questions/77446174/how-to-customize-traefik-error-pages-on-docker-compose)<grok:render card_id="d1967b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [Want to send custom error page when service is offline in traefik](https://www.reddit.com/r/Traefik/comments/1ftxoa6/help_want_to_send_custom_error_page_when_service/)<grok:render card_id="a9a8ea" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- [Redirect to https and redirect all requests to unavailable services to custom error page](https://community.traefik.io/t/redirect-to-https-and-redirect-all-requests-to-unavailable-services-to-custom-error-page/20817)<grok:render card_id="5500df" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>
- [Global 404 handler](https://community.traefik.io/t/global-404-handler/2144)<grok:render card_id="e15bc1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render>
- [Pretty server's error pages in the docker image & git](https://github.com/tarampampam/error-pages)<grok:render card_id="5bfed2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
- [Custom error page in traefik2 with kubernetes](https://stackoverflow.com/questions/63075592/custom-error-page-in-traefik2-with-kubernetes)<grok:render card_id="5518de" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render>
- [Set up a custom 404 page with Traefik](https://codeslikeaduck.com/posts/custom404withtraefik/)<grok:render card_id="47563a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render>
- [Custom error pages for the Traefik reverse proxy](https://github.com/patbec/traefik-error-pages)<grok:render card_id="3cadef" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render>
- [Custom error page middleware](https://community.traefik.io/t/custom-error-page-middleware/6333)<grok:render card_id="775fd5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>

## User

_Time: 2025-09-20T19:08:33.702Z_

docker-compose.yaml labels, traefik's dynamic.yaml, catchall router error pages configuration

## Assistant

_Time: 2025-09-20T19:10:55.520Z_

### Key Configurations for Custom Error Pages in Traefik

- Research indicates that custom error pages in Traefik typically rely on the errors middleware, often combined with a catchall router for global handling; no reliable methods without middleware were found across sources.
- For Docker Compose, use labels on services to define routers, middlewares, and the error service, enabling custom pages for status codes like 400-599.
- Traefik's dynamic.yaml (file provider) allows defining middlewares and routers in YAML for non-Docker setups, offering similar functionality.
- A catchall router with low priority catches unmatched requests, integrating with the errors middleware to serve custom pages.

#### Docker Compose with Labels
In Docker Compose, labels are applied to the error service container (e.g., Nginx) to configure the middleware and router. This setup creates a dedicated service for error pages and attaches it via labels.<grok:render card_id="9b3aed" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render><grok:render card_id="752551" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render> Example labels include defining the status range, service, and query path.

#### Dynamic YAML Configuration
For file-based setups, define HTTP middlewares and routers in a dynamic.yaml file loaded by Traefik. This is useful for static or non-containerized environments, specifying errors middleware parameters like status and service.<grok:render card_id="138470" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render>

#### Catchall Router Setup
A catchall router uses a broad rule (e.g., HostRegexp) with low priority to handle undefined routes, applying the errors middleware for custom pages. This ensures global coverage for errors like 404s.<grok:render card_id="2ba1e4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render><grok:render card_id="5567ef" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render>

---

### Detailed Guide to Configuring Custom Error Pages in Traefik

Custom error pages enhance user experience by replacing Traefik's default plain-text responses (e.g., "404 page not found") with branded or informative HTML pages. Based on extensive review of documentation, community forums, blogs, and GitHub repositories, the setup universally involves the errors middleware, which intercepts specified HTTP status codes and routes them to a dedicated service. This service, often a lightweight web server like Nginx, hosts static or dynamic error pages. While the query sought configurations potentially without middleware, all sources confirm middleware is essential for customization—alternatives like app-level handling don't cover Traefik routing errors.

Configurations can be provider-specific: Docker labels for containerized setups, YAML for file providers, and catchall routers for global application. Below, we break down each, with examples synthesized from reliable sources. Performance considerations include using static files for low overhead and limiting status ranges to avoid unnecessary processing. Common pitfalls involve middleware order conflicts or HTTPS redirects overriding custom pages, resolvable by adjusting priorities or entrypoints.

#### Docker Compose with Labels: Step-by-Step Setup
In Docker Compose, labels dynamically configure Traefik without separate files. Define an error service (e.g., Nginx with mounted HTML files), then apply labels for the router, middleware, and service.<grok:render card_id="02d8c7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render><grok:render card_id="835057" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render><grok:render card_id="ddf713" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render><grok:render card_id="8c24b6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render> This handles errors per-router or globally.

Full example `docker-compose.yaml` (version 3.7 or later):

```yaml
services:
  traefik:
    image: traefik:v2.10  # Use latest stable version
    container_name: traefik
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - 80:80
      - 443:443
    command:
      - --api.dashboard=true
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
    networks:
      - proxy
    labels:
      - traefik.enable=true
      - traefik.http.routers.traefik.rule=Host(`traefik.example.com`)
      - traefik.http.routers.traefik.service=api@internal
      - traefik.http.routers.traefik.entrypoints=websecure

  error-pages:
    image: nginx:latest  # Or use a custom image like ghcr.io/tarampampam/error-pages:3
    volumes:
      - ./error-pages/html:/usr/share/nginx/html
      - ./error-pages/nginx.conf:/etc/nginx/conf.d/default.conf
    networks:
      - proxy
    labels:
      - traefik.enable=true
      - traefik.http.routers.error-router.rule=HostRegexp(`{host:.+}`)
      - traefik.http.routers.error-router.priority=1  # Low priority for catchall
      - traefik.http.routers.error-router.entrypoints=web
      - traefik.http.routers.error-router.middlewares=custom-errors
      - traefik.http.middlewares.custom-errors.errors.status=400-599
      - traefik.http.middlewares.custom-errors.errors.service=error-pages-service
      - traefik.http.middlewares.custom-errors.errors.query=/{status}.html
      - traefik.http.services.error-pages-service.loadbalancer.server.port=80

networks:
  proxy:
    external: true
```

- **Nginx Config (`nginx.conf`)**: Serves dynamic pages based on status.
  ```nginx
  server {
      listen 80;
      server_name localhost;
      location / {
          root /usr/share/nginx/html;
          try_files /{status}.html /{status}.html =404;
          internal;
      }
  }
  ```
- **How It Works**: Labels define the middleware on the error service itself. For 4xx/5xx errors, Traefik queries the service at `/{status}.html` (e.g., /404.html). Attach the middleware to other routers via labels like `- traefik.http.routers.my-app.middlewares=custom-errors`.
- **Variations**: For 5xx only, set `status=500-599`.<grok:render card_id="caea0b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render> Use environment variables in custom images for template selection.<grok:render card_id="22cf22" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render>

#### Traefik Dynamic YAML Configuration
For non-Docker environments, use a dynamic configuration file (e.g., `dynamic.yaml`) loaded via Traefik's static config (e.g., `--providers.file.filename=/path/to/dynamic.yaml`). This defines middlewares and routers separately from labels.<grok:render card_id="8ac1d4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render><grok:render card_id="dbce4c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render>

Example `dynamic.yaml`:

```yaml
http:
  middlewares:
    custom-errors:
      errors:
        status:
          - "400-599"
        service: error-pages-service
        query: /{status}.html

  services:
    error-pages-service:
      loadBalancer:
        servers:
          - url: http://error-server:80  # Point to your error server

  routers:
    catchall:
      rule: HostRegexp("{host:.+}")
      priority: 1
      entryPoints:
        - web
      middlewares:
        - custom-errors
      service: noop@internal  # Or your error service
```

- **Integration**: Reference this middleware in static config or other routers. For Swarm or Compose, combine with labels for hybrid setups.<grok:render card_id="b10793" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render>
- **TOML Alternative**: Equivalent to YAML, e.g., `[http.middlewares.custom-errors.errors] status = ["400-599"]`.

#### Catchall Router for Global Error Handling
A catchall router ensures errors from unmatched requests (e.g., invalid subdomains) are handled customly. Set low priority to avoid overriding specific routers.<grok:render card_id="fac276" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render><grok:render card_id="e097e4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render><grok:render card_id="3a4641" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render><grok:render card_id="340c38" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render>

In Docker labels (on error service):
```yaml
labels:
  - traefik.http.routers.catchall.rule=HostRegexp(`{host:.+}`)
  - traefik.http.routers.catchall.priority=1
  - traefik.http.routers.catchall.middlewares=custom-errors
  - traefik.http.routers.catchall.entrypoints=web
```

In dynamic.yaml:
As shown above under routers.

- **Best Practices**: Use with HTTPS (add TLS labels). For offline services, catch 502/503 via status range.<grok:render card_id="f5dc49" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render> Test by accessing invalid URLs; monitor Traefik logs.

#### Comparison Table

| Configuration Type | Pros | Cons | Best For | Example Sources |
|--------------------|------|------|----------|-----------------|
| Docker Labels | Easy integration with Compose; dynamic | Container-specific; verbose for complex setups | Docker/Swarm environments | Blogs, Stack Overflow, GitHub repos<grok:render card_id="643c3b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render><grok:render card_id="8eeb39" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render> |
| Dynamic YAML | Modular; version-controllable | Requires file provider setup | Static or Kubernetes setups | Official docs, forums<grok:render card_id="f18bf8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render><grok:render card_id="363784" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render> |
| Catchall Router | Global coverage for unmatched requests | Potential conflicts with other routers | Handling 404s across domains | Community threads<grok:render card_id="876446" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render><grok:render card_id="6395dc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render> |

#### Troubleshooting and Advanced Tips
- **Issues**: Middleware may not trigger if another (e.g., redirect) precedes it; reorder chains.<grok:render card_id="d8c949" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render> For 502 errors, ensure error service availability.<grok:render card_id="e6265b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render>
- **Advanced**: Use templates for dynamic pages (e.g., via GitHub repos).<grok:render card_id="a03dcb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render> In Kubernetes, use Middleware CRDs instead of labels.<grok:render card_id="59fedb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>
- **Security**: Restrict error service access with `internal` in Nginx.

This guide provides a comprehensive, self-contained reference drawn from multiple sources, ensuring reliable setups for Traefik v2+.

### Key Citations
- [Customizing error pages in Traefik v.2](https://imandrea.me/blog/traefik-custom-404/)<grok:render card_id="b33324" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render>
- [Global 404 handler](https://community.traefik.io/t/global-404-handler/2144)<grok:render card_id="a4771f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render>
- [How to customize Traefik error pages on docker-compose?](https://stackoverflow.com/questions/77446174/how-to-customize-traefik-error-pages-on-docker-compose)<grok:render card_id="032bc7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render>
- [GitHub - tarampampam/error-pages](https://github.com/tarampampam/error-pages)<grok:render card_id="3f9400" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render>
- [Custom error page in Traefik v2.x. Finally](https://medium.com/@yuliakostrikova/custom-error-page-in-traefik-v2-x-finally-78d563f432ad)<grok:render card_id="7e2f09" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render>
- [Errors - Traefik Labs documentation](https://doc.traefik.io/traefik/middlewares/http/errorpages/)<grok:render card_id="161eaa" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>
- [Redirect to https and redirect all requests to unavailable services to custom error page](https://community.traefik.io/t/redirect-to-https-and-redirect-all-requests-to-unavailable-services-to-custom-error-page/20817)<grok:render card_id="9be23f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render>
- [Global 404 handler](https://community.traefik.io/t/global-404-handler/2144)<grok:render card_id="6c4b3f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render>
- [Custom error page in traefik2 with kubernetes](https://stackoverflow.com/questions/63075592/custom-error-page-in-traefik2-with-kubernetes)<grok:render card_id="d6ae95" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render>
- [Kubernetes Traefik Ingress: 10 Useful Configuration Options](https://www.vcluster.com/blog/kubernetes-traefik-ingress-10-useful-configuration-options)<grok:render card_id="2e9a52" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>
- [How to serve error page for unhealthy/crashed containers?](https://community.traefik.io/t/how-to-serve-error-page-for-unhealthy-crashed-containers/22023)<grok:render card_id="861739" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>
- [Traefik custom error page for 502 doesn't work](https://community.traefik.io/t/traefik-custom-error-page-for-502-doesnt-work/13322)<grok:render card_id="8420f2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render>

## User

_Time: 2025-09-23T02:44:39.710Z_

you're giving the catchall a priority of 1. So what's the DEFAULT priority for routers if a priority isn't explicitly given...?

## Assistant

_Time: 2025-09-23T02:46:38.336Z_

### Key Points on Traefik Router Priorities
- Research suggests that when no priority is explicitly set for a Traefik router, the system calculates it based on the length of the rule string, with longer rules generally receiving higher priorities to help resolve potential overlaps.
- This default mechanism applies similarly across HTTP and TCP routers, promoting more specific (longer) rules to take precedence over broader ones.
- Setting a low explicit priority, like 1 for a catchall router, ensures it acts as a fallback, allowing other routers with default (rule-length-based) or higher explicit priorities to match first.

### Understanding Default Priorities
In Traefik, router priorities determine the order in which rules are evaluated when multiple might apply to a request.<grok:render card_id="dad0d2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render><grok:render card_id="21a845" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> If you don't specify a priority, Traefik doesn't assign a fixed default number like 0 or 10—instead, it dynamically computes the priority as the character length of the rule expression. For example, a rule like `HostRegexp("{subdomain:[a-z]+}.example.com")` might get a priority around 40 due to its length, while a simpler `Host("example.com")` could be around 20. This approach favors specificity, as more detailed rules tend to be longer and thus higher priority.

Explicit priorities override this: higher numbers mean higher precedence, and a value of 0 is ignored, falling back to the rule-length calculation.<grok:render card_id="b91def" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render> Traefik reserves high priority ranges for internal use (e.g., up to MaxInt-1000), so user-defined priorities should stay below that to avoid conflicts.

### Why Use Low Priorities for Catchalls
A catchall router, often defined with a broad rule like `HostRegexp("{host:.+}")`, is typically given a low explicit priority (e.g., 1) to serve as a last resort.<grok:render card_id="bf3e32" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="bc5d02" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render> Without this, its rule length might inadvertently outrank shorter specific rules. Community practices sometimes treat 10 as a "standard" for regular routers, but this is not an official default—it's a convention to ensure catchalls (at 1) and overrides (at 20+) work as intended.<grok:render card_id="e553eb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render>

### Version Considerations
This behavior is consistent in Traefik v2 and v3, though subtle differences in rule evaluation can occur when rule lengths are identical, potentially leading to varied matching orders across versions.<grok:render card_id="e93750" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render><grok:render card_id="f202e5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render> For redirections at entrypoints, a separate high default priority (MaxInt-1) applies to generated routers, but this doesn't affect user-defined ones.<grok:render card_id="945064" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>

For more details, refer to the official documentation at [Traefik v3 Routers](https://doc.traefik.io/traefik/v3.1/routing/routers/) or [Traefik v2 Routers](https://doc.traefik.io/traefik/v2.11/routing/routers/).

---

Traefik, as a dynamic reverse proxy and load balancer, relies on router priorities to manage request routing efficiently, especially when multiple rules could potentially match an incoming request.<grok:render card_id="c3e666" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="9a61d2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render> This system is designed to prevent conflicts and ensure that the most appropriate router handles each request. Priorities are particularly crucial for setups involving catchall routers, which are intended to capture unmatched traffic without interfering with more specific routes.

At its core, router priorities in Traefik determine the evaluation order: higher priority routers are checked first.<grok:render card_id="981109" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render><grok:render card_id="334607" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> When an explicit priority is set (via configuration labels, YAML, or other providers), Traefik uses that value directly—higher numbers indicate higher precedence. However, if no priority is explicitly provided, or if it's set to 0 (which is ignored), Traefik falls back to a default calculation based on the length of the rule string.<grok:render card_id="886d4f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="269964" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render> This length is simply the number of characters in the rule expression, leading to longer (typically more specific) rules receiving higher priorities. Routes are then sorted in descending order of priority to resolve overlaps.

This mechanism applies uniformly to both HTTP and TCP routers, with no fundamental differences in priority handling between the two.<grok:render card_id="10d7a7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render card_id="6583c5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render><grok:render card_id="4f26be" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> For instance, an HTTP rule like `HostRegexp("[a-z]+\\.traefik\\.com")` might compute to a priority of 34, while a TCP rule like `ClientIP("192.168.0.0/24")` could be 26. In cases where rule lengths are equal, the behavior can be less predictable, and explicit priorities are recommended to enforce order.<grok:render card_id="d0648e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="4f542e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>

Traefik reserves a high range of priorities for its internal routers, limiting user-defined values to below MaxInt32-1000 (or MaxInt64-1000 on 64-bit systems) to avoid interference.<grok:render card_id="069555" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render><grok:render card_id="b9a149" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> Additionally, for entrypoint-specific features like HTTP redirections, Traefik generates routers with a default priority of MaxInt-1, ensuring they take precedence in those contexts—but this does not apply to general user-defined routers.<grok:render card_id="4d1492" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render><grok:render card_id="64acd8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>

Community discussions highlight practical applications, such as using 10 as a conventional "default" for standard routers, 1 for catchalls, and higher values (e.g., 20) for overrides.<grok:render card_id="4a88e5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render> This isn't enforced by Traefik but helps in maintaining clear hierarchies. For catchall routers with broad rules like `HostRegexp("{host:.+}")`, setting a low explicit priority (e.g., 1) is common to ensure they only activate when no other router matches, preventing them from overshadowing specifics based on rule length alone.<grok:render card_id="5a541e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="59693d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>

While the priority system is largely consistent between Traefik v2 and v3, some users report subtle shifts in matching behavior when rule lengths are identical, possibly due to internal sorting changes during version upgrades.<grok:render card_id="32b110" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render><grok:render card_id="752806" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render> In v2, for example, one router might match first in equal-length scenarios, while v3 could favor another. To mitigate this, always test configurations and use explicit priorities for critical paths.

#### Examples of Priority in Action
- **Default Calculation (HTTP, v3)**: A regex host rule like `HostRegexp("[a-z]+\\.traefik\\.com")` gets priority ~34, outranking a simple `Host("foobar.traefik.com")` at ~26, potentially routing "foobar.traefik.com" to the regex router unless overridden.<grok:render card_id="c79936" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render>
- **Explicit Override (TCP, v2)**: Setting `priority: 2` on a specific IP rule (`ClientIP("192.168.0.12")`) ensures it takes precedence over a range rule (`ClientIP("192.168.0.0/24")`) at `priority: 1`, even if the range's default length is higher.<grok:render card_id="1568a2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>

| Scenario | Rule Example | Default Priority (Approx.) | Explicit Priority Recommendation | Use Case |
|----------|--------------|-----------------------------|----------------------------------|----------|
| Specific Host | Host("example.com") | 20 | 10 (or higher for overrides) | Standard domain routing |
| Regex Host | HostRegexp("{host:[a-z]+\\.com}") | 30-40 | 1 for catchalls | Broad matching with fallback |
| IP Specific | ClientIP("192.168.0.12") | 24 | 20 for precedence | Targeted TCP access |
| IP Range | ClientIP("192.168.0.0/24") | 26 | None (rely on default) | General network routing |
| Catchall | HostRegexp("{host:.+}") | 23 | 1 | Unmatched request handling |

In troubleshooting, if priorities aren't respected, check for misconfigurations like identical rule lengths or conflicting internal reservations.<grok:render card_id="8b10c1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render> For complex setups, consulting the official documentation for your specific version is advised, as minor evolutions in priority logic can impact behavior.

### Key Citations
- [Traefik HTTP Routers Rules & Priority Documentation](https://doc.traefik.io/traefik/routing/routers/)<grok:render card_id="48fb70" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [Rules priority advice : r/Traefik - Reddit](https://www.reddit.com/r/Traefik/comments/10jnpzz/rules_priority_advice/)<grok:render card_id="26e5be" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>
- [Traefik TCP Routers Rules & Priority Documentation](https://doc.traefik.io/traefik/reference/routing-configuration/tcp/router/rules-and-priority/)<grok:render card_id="1bc4ff" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [EntryPoints - Traefik Labs documentation](https://doc.traefik.io/traefik/routing/entrypoints/)<grok:render card_id="58b92c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render>
- [Traefik Priority - William Max & Co.](https://www.williammax.com/blog/traefik-priority/)<grok:render card_id="23969e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>
- [Traefik Traefik not respecting priority - Doctor Droid](https://drdroid.io/stack-diagnosis/traefik-traefik-not-respecting-priority)<grok:render card_id="3328e0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>
- [Priority doesn't seem to follow the longest length = highest priority](https://community.traefik.io/t/priority-doesnt-seem-to-follow-the-longest-length-highest-priority/21373)<grok:render card_id="ff43a5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">6</argument>
</grok:render>
- [Routers | Traefik | v2.0](https://doc.traefik.io/traefik/v2.0/routing/routers/)<grok:render card_id="241700" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">7</argument>
</grok:render>
- [Rule Priority v2 vs v3 · Issue #11027 · traefik/traefik - GitHub](https://github.com/traefik/traefik/issues/11027)<grok:render card_id="f29a79" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">8</argument>
</grok:render>
- [Traefik Routers Documentation | Traefik | v3.1](https://doc.traefik.io/traefik/v3.1/routing/routers/)<grok:render card_id="5a9d31" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render>
- [Traefik Routers Documentation | Traefik | v2.11](https://doc.traefik.io/traefik/v2.11/routing/routers/)<grok:render card_id="d5718f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>
- [Traefik EntryPoints Documentation | Traefik | v3.1](https://doc.traefik.io/traefik/v3.1/routing/entrypoints/)<grok:render card_id="8e74f9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>
