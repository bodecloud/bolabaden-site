---
source_url: "https://grok.com/c/286aac70-917a-49c4-a01b-adc61188620a"
conversation_id: "286aac70-917a-49c4-a01b-adc61188620a"
title: "Cloudflare Worker Load Balancing Solutions"
extracted_at: "2026-06-29T16:33:56.767Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Cloudflare Worker Load Balancing Solutions

Source: [Grok conversation](https://grok.com/c/286aac70-917a-49c4-a01b-adc61188620a)

## User

_Time: 2025-07-18T21:27:16.324Z_

Please find a free, open source cloudflare worker load balancer where I can reverse proxy *.bolabaden.org to several backends like *.server1.bolabaden.org, *.server2.bolabaden.org, *.server3.bolabaden.org etc. Must be completely free and open source, find as many projects as possible (at least 5) and explain how to with each support the above example.

Actually mention **all implementations** in your response including how they differ:
note: ignore anything named 'rocket-booster': project is 4+ years old and isn't available anymore!

## Assistant

_Time: 2025-07-18T21:32:19.864Z_

### Cloudflare Worker Load Balancers and Reverse Proxies

Several open-source projects exist for implementing a reverse proxy and load balancer using Cloudflare Workers. These projects are completely free to use and deploy on Cloudflare's platform, leveraging the free tier of Workers. The search yielded seven relevant implementations, all of which are open source and hosted on GitHub or as Gists. Below, I describe each project, how it supports the use case of reverse proxying wildcard subdomains (*.bolabaden.org) to multiple backends (*.server1.bolabaden.org, *.server2.bolabaden.org, etc.), setup instructions for the example, and how they differ from one another and from standard load balancers. The use case assumes load balancing across backends while preserving the original subdomain in the backend URL (e.g., sub.bolabaden.org proxies to sub.server1.bolabaden.org or sub.server2.bolabaden.org). Some projects require minor configuration adjustments to achieve this, as noted.

#### 1. Cloudworker-Proxy (markusahlstrand/cloudworker-proxy)
This project is an API gateway for Cloudflare Workers that includes routing, load balancing, and additional features like Geo-based routing and caching<grok:render card_id="16762b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render><grok:render card_id="f36926" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">41</argument>
</grok:render>. It supports the use case by allowing dynamic URL templates with placeholders for the host, enabling load balancing across multiple backends while preserving the subdomain.

Setup Instructions:
- Install via NPM: `npm install cloudworker-proxy --save`.
- Configure the proxy in your Worker script with the load balancer handler:
  ```
  const Proxy = require('cloudworker-proxy');

  const config = [{
    handlerName: 'loadbalancer',
    host: '*.bolabaden.org',
    path: '/:file*',
    options: {
      resolveOverride: '{host}',
      sources: [
        { url: 'https://{host}.server1.bolabaden.org/{file}' },
        { url: 'https://{host}.server2.bolabaden.org/{file}' },
        { url: 'https://{host}.server3.bolabaden.org/{file}' }
      ]
    }
  }];

  const proxy = new Proxy(config);

  async function fetchAndApply(event) {
    return await proxy.resolve(event);
  }

  addEventListener('fetch', (event) => {
    event.respondWith(fetchAndApply(event));
  });
  ```
- Deploy to Cloudflare Workers and bind the route to *.bolabaden.org/*.

Differences: Traffic is distributed randomly, unlike standard load balancers that may use round-robin or least connections. Rate limiting is memory-based, potentially inconsistent across edge nodes. It includes Geo-routing and OAuth2, features not always present in standard load balancers. Compared to other implementations, it uniquely supports dynamic host placeholders for backends.

#### 2. Reflare (latticehr/reflare)
Reflare is a lightweight reverse proxy library for Cloudflare Workers, supporting load balancing across fixed backends<grok:render card_id="255586" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">30</argument>
</grok:render><grok:render card_id="045ffc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">50</argument>
</grok:render><grok:render card_id="2091d7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">82</argument>
</grok:render>. It supports the use case for fixed backends but requires using the onRequest callback to dynamically construct backend URLs for subdomain preservation, as upstream domains are fixed by default.

Setup Instructions:
- Install: `npm install @latticehr/reflare --save`.
- Configure in the Worker script:
  ```
  import useReflare from '@latticehr/reflare';

  export default {
    async fetch(request: Request): Promise<Response> {
      const reflare = await useReflare();

      reflare.push({
        path: '/*',
        loadBalancing: { policy: 'random' },
        upstream: [
          { domain: 'server1.bolabaden.org', protocol: 'https', weight: 50 },
          { domain: 'server2.bolabaden.org', protocol: 'https', weight: 50 },
          { domain: 'server3.bolabaden.org', protocol: 'https', weight: 50 }
        ],
        onRequest: (request: Request, url: string) => {
          // Dynamically adjust URL for subdomain
          const originalHost = new URL(request.url).host;
          const backendDomain = url.split('/')[0]; // Select backend
          const dynamicUrl = `https://${originalHost}.${backendDomain}${url}`;
          return new Request(dynamicUrl, request);
        }
      });

      return reflare.handle(request);
    }
  };
  ```
- Deploy using Wrangler and bind to *.bolabaden.org/*.

Differences: Load balancing is limited to random or IP-hash policies, without health checks. It emphasizes request/response transformations, differing from standard load balancers' focus on traffic distribution. Compared to other Reflare forks, this is the base library without additional patches.

#### 3. Reflare with Path Rewrite (tony470s/reflare)
This is a forked implementation of Reflare with a patch for path rewrite, supporting load balancing across multiple upstreams<grok:render card_id="fe206e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render><grok:render card_id="a53bbe" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">84</argument>
</grok:render>. It supports the use case similarly to the original Reflare, with fixed backends, but the path rewrite patch allows better handling of dynamic paths; subdomain preservation requires onRequest modification.

Setup Instructions:
- Generate project: `wrangler generate reflare-app https://github.com/tony470s/reflare`.
- Edit `src/index.ts`:
  ```
  import useReflare from 'reflare';

  const handleRequest = async (request: Request): Promise<Response> => {
    const reflare = await useReflare();

    reflare.push({
      path: '/*',
      loadBalancing: { policy: 'random' },
      upstream: [
        { domain: 'server1.bolabaden.org', protocol: 'https', weight: 50 },
        { domain: 'server2.bolabaden.org', protocol: 'https', weight: 50 }
      ],
      onRequest: (request: Request, url: string) => {
        const originalHost = new URL(request.url).host;
        const backendDomain = url.split('/')[0];
        const dynamicUrl = `https://${originalHost}.${backendDomain}${url}`;
        return new Request(dynamicUrl, request);
      }
    });

    return reflare.handle(request);
  };

  addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event.request));
  });
  ```
- Deploy: `npm run deploy`.

Differences: Adds path rewrite for better routing flexibility, unlike the original Reflare. Load balancing policies are limited, and dynamic features are experimental. It differs from standard load balancers by lacking advanced algorithms but offers edge-specific optimizations.

#### 4. Reflare CDN Template (rokibhasansagar/reflare-cdn-template)
This is an updated CDN frontend template based on Reflare, supporting reverse proxy and load balancing for CDN-like scenarios<grok:render card_id="e93477" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render><grok:render card_id="d038fe" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">83</argument>
</grok:render>. It supports the use case for fixed backends, with potential for dynamic subdomain handling via route definitions, but requires referencing the original Reflare docs for adaptation.

Setup Instructions:
- Generate project: `npm init cloudflare reflare-app https://github.com/rokibhasansagar/reflare-cdn-template`.
- Edit `src/index.ts` for routes, using similar configuration as in the original Reflare, including loadBalancing and onRequest for dynamic subdomains.
- Deploy: `npm run deploy`.

Differences: Focused on CDN use, with updates for deprecated features in the original template. It lacks explicit dynamic subdomain support without modification, differing from standard load balancers in scalability but offering serverless auto-scaling. Compared to other Reflare variants, it prioritizes CDN optimizations.

#### 5. Workers-Proxy (qupb/Workers-Proxy)
This is an implementation using Reflare for a lightweight reverse proxy with load balancing<grok:render card_id="b6f94b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="3ee43a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render><grok:render card_id="1b8874" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">45</argument>
</grok:render>. It supports the use case for fixed backends, with subdomain preservation via onRequest adjustments.

Setup Instructions:
- Generate project: `npm init cloudflare reflare-app https://github.com/qupb/Workers-Proxy`.
- Configure `src/index.ts` similar to Reflare, adding loadBalancing and dynamic URL construction in onRequest.
- Deploy: `npm run publish`.

Differences: Emphasizes scalability and includes firewall/CORS features. Load balancing is random/IP-hash, with experimental dynamic routes. It differs from standard load balancers by using Workers KV for updates, potentially adding latency.

#### 6. Geo Load Balancer Gist (n-ts)
This Gist provides a geo-based load balancer script for routing to nearest datacenters based on POP location<grok:render card_id="781c4a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">99</argument>
</grok:render><grok:render card_id="1cc378" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">121</argument>
</grok:render>. It supports the use case by mapping to multiple fixed backends but not dynamic subdomains natively; adaptation requires modifying the DC_MAP for backend construction.

Setup Instructions:
- Copy the Gist code into a Worker script.
- Update DC_MAP with backends (e.g., HOST: '{dynamic}.server1.bolabaden.org').
- Deploy and bind to *.bolabaden.org/*.

Differences: Geo-based routing, unlike random policies in others. No health checks; differs from standard load balancers in simplicity but limits to geo-distribution.

#### 7. Failover Load Balancer (arashkhavari/Cloudflare-Free-Load-balancing-failover)
This project focuses on healthcheck-based failover via DNS updates<grok:render card_id="4eb027" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">108</argument>
</grok:render><grok:render card_id="971521" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">120</argument>
</grok:render>. It supports load balancing through failover but not per-request proxying or wildcard subdomains natively; it's more for high availability than dynamic routing.

Setup Instructions:
- Init with Wrangler: `wrangler init healthchecker`.
- Configure secrets and script for health checks on backends.
- Deploy: `wrangler deploy`.

Differences: DNS-based failover, not per-request balancing, differing from others' direct proxying. Limits to failover scenarios, unlike standard load balancers' real-time distribution.
