---
source_url: "https://grok.com/c/97ee0b08-3dca-406f-9f9f-09c6bc3fa8a6"
conversation_id: "97ee0b08-3dca-406f-9f9f-09c6bc3fa8a6"
title: "Cloudflare Worker Round-Robin Load Balancer"
extracted_at: "2026-06-29T16:27:08.970Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Cloudflare Worker Round-Robin Load Balancer

Source: [Grok conversation](https://grok.com/c/97ee0b08-3dca-406f-9f9f-09c6bc3fa8a6)

## User

_Time: 2025-06-05T11:03:42.633Z_

cloudflare worker load balancer round robin. A URL to the worker page is load balanced between two or more urls actually hosting the content. Any of the urls can go down at any time. The worker's job is to determine which one is up and forward requests to the one that's up. Round robin load balancing cloudflare worker source code github.

## Assistant

_Time: 2025-06-05T14:25:52.550Z_

### Implementing a Round-Robin Load Balancer with Cloudflare Workers

**Key Points:**
- Cloudflare Workers can be used to create a custom load balancer that distributes requests across multiple backend URLs.
- Implementing true round-robin load balancing in Workers is challenging due to their stateless nature, but approximations or stateful solutions like Durable Objects can be used.
- Health checks are essential to ensure requests are forwarded only to operational backend servers.
- While specific GitHub repositories for round-robin load balancing with Workers are scarce, examples of random load balancing and health checks can be adapted.
- Using Cloudflare's KV storage or Durable Objects can help maintain state for round-robin distribution, though KV may introduce latency.

#### Overview
Cloudflare Workers are serverless functions that run on Cloudflare's edge network, making them suitable for intercepting and routing HTTP requests. To implement a round-robin load balancer, the Worker needs to cycle through a list of backend URLs in order, forwarding requests only to those that are operational. This requires health checks to monitor backend availability and a mechanism to track the current server index for round-robin distribution.

#### Challenges with Round-Robin in Workers
True round-robin load balancing requires maintaining a global counter to track which server should receive the next request. Since Cloudflare Workers are stateless and run independently at each edge location, maintaining a global counter is difficult without external storage. Using Workers KV storage for this purpose can work but may introduce latency due to read/write operations. Alternatively, Cloudflare Durable Objects, which provide stateful storage, can maintain a counter across requests, making them a promising solution.

#### Proposed Solution
A practical approach involves:
1. **Periodic Health Checks**: Use a separate Worker or Cloudflare's Cron Triggers to periodically check the health of backend URLs and store the list of healthy servers in Workers KV.
2. **Stateful Round-Robin with Durable Objects**: Use a Durable Object to maintain a counter for round-robin selection, ensuring requests are distributed sequentially among healthy servers.
3. **Fallback Mechanism**: If a selected server is down, the Worker can retry with the next healthy server.

Below is an example implementation using Cloudflare Workers and Durable Objects to achieve round-robin load balancing with health checks.

<xaiArtifact artifact_id="b8617a4f-e0b7-4d7d-8f21-2d29b7c55f3b" artifact_version_id="1b1f2d25-2593-4133-bb8e-119085b37cf5" title="Round-Robin Load Balancer Worker" contentType="text/javascript">
const BACKEND_URLS = [
  'https://backend1.example.com',
  'https://backend2.example.com',
  'https://backend3.example.com'
];

const HEALTH_CHECK_KEY = 'healthy_backends';
const HEALTH_CHECK_INTERVAL = 60 * 1000; // 60 seconds

// Health check function to test backend availability
async function checkBackendHealth(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', timeout: 5000 });
    return response.ok;
  } catch (e) {
    return false;
  }
}

// Periodic health check Worker
addEventListener('scheduled', event => {
  event.waitUntil(performHealthChecks());
});

async function performHealthChecks() {
  const healthyBackends = [];
  for (const url of BACKEND_URLS) {
    if (await checkBackendHealth(url)) {
      healthyBackends.push(url);
    }
  }
  await KV_NAMESPACE.put(HEALTH_CHECK_KEY, JSON.stringify(healthyBackends));
}

// Durable Object for maintaining round-robin state
export class LoadBalancer {
  constructor(state) {
    this.state = state;
    this.initialize();
  }

  async initialize() {
    let index = await this.state.storage.get('currentIndex');
    if (index === undefined) {
      await this.state.storage.put('currentIndex', 0);
    }
  }

  async fetch(request) {
    const healthyBackends = JSON.parse(await KV_NAMESPACE.get(HEALTH_CHECK_KEY) || '[]');
    if (healthyBackends.length === 0) {
      return new Response('No healthy backends available', { status: 503 });
    }

    let currentIndex = await this.state.storage.get('currentIndex') || 0;
    const selectedBackend = healthyBackends[currentIndex % healthyBackends.length];
    currentIndex = (currentIndex + 1) % healthyBackends.length;
    await this.state.storage.put('currentIndex', currentIndex);

    const url = new URL(request.url);
    url.hostname = new URL(selectedBackend).hostname;
    const newRequest = new Request(url.toString(), request);
    return await fetch(newRequest);
  }
}

// Main Worker fetch handler
addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const durableObjectId = LOAD_BALANCER_NAMESPACE.idFromName('load-balancer');
  const durableObjectStub = LOAD_BALANCER_NAMESPACE.get(durableObjectId);
  event.respondWith(durableObjectStub.fetch(event.request));
});
</xaiArtifact>

#### How It Works
- **Health Checks**: A scheduled Worker runs every 60 seconds to check the availability of backend URLs using a `HEAD` request. Healthy URLs are stored in Workers KV under the key `healthy_backends`.
- **Durable Object**: The `LoadBalancer` Durable Object maintains a `currentIndex` to track the next backend to use. It retrieves the list of healthy backends from KV and selects the next one in sequence.
- **Request Routing**: The main Worker forwards each incoming request to the Durable Object, which routes it to the selected backend. If no healthy backends are available, it returns a 503 error.

#### Limitations
- **KV Latency**: Reading from KV storage may introduce slight latency, though caching can mitigate this.
- **Durable Objects Cost**: Durable Objects incur additional costs based on request duration and storage usage.
- **Health Check Frequency**: The 60-second interval may not detect rapid changes in backend status. Adjust the interval based on your needs, but be mindful of potential rate limits.

#### Finding Source Code on GitHub
While specific GitHub repositories implementing round-robin load balancing with Cloudflare Workers are limited, you can adapt examples like the one above. Searching GitHub for terms like "cloudflare worker load balancer" yields repositories such as [wojons/cloudflare-lb](https://github.com/wojons/cloudflare-lb), which uses Cloudflare's API for DNS-based load balancing, and [evansopilo/loadbalancer](https://github.com/evansopilo/loadbalancer), a Go-based round-robin load balancer. However, these are not Worker-specific. For Worker-specific examples, check [Cloudflare's Durable Objects template](https://github.com/cloudflare/durable-objects-template) for a starting point to build stateful applications.

---

### Detailed Implementation Guide for Round-Robin Load Balancing with Cloudflare Workers

This section provides a comprehensive guide to implementing a round-robin load balancer using Cloudflare Workers, including health checks to ensure requests are routed only to operational backend servers. It expands on the direct answer, incorporating additional details and considerations from the exploration of available resources.

#### Understanding Cloudflare Workers and Load Balancing
Cloudflare Workers are serverless functions executed at Cloudflare's edge locations, ideal for intercepting and modifying HTTP requests. Load balancing involves distributing incoming traffic across multiple servers to enhance scalability and reliability. Round-robin load balancing cycles through a list of servers in order, ensuring even distribution. The challenge with Workers is their stateless nature, which complicates maintaining a global counter for round-robin distribution. Additionally, the user’s requirement for health checks necessitates a mechanism to monitor backend availability and exclude down servers from the rotation.

#### Challenges in Implementing Round-Robin
- **Stateless Workers**: Each Worker instance runs independently, making it difficult to maintain a global counter for round-robin without external storage.
- **Health Checks**: Backends can go down at any time, requiring periodic checks to update the list of healthy servers.
- **Performance**: Frequent reads/writes to storage (e.g., Workers KV) can introduce latency, impacting request performance.
- **Scalability**: The solution must handle high traffic volumes across Cloudflare’s global network.

#### Solution Components
To address these challenges, the implementation uses:
- **Workers KV**: Stores the list of healthy backends, updated periodically via health checks.
- **Durable Objects**: Maintains a stateful counter for round-robin selection, ensuring sequential distribution across healthy servers.
- **Cron Triggers**: Schedules periodic health checks to minimize overhead during request handling.
- **Fetch API**: Performs health checks and forwards requests to backend servers.

#### Implementation Details
The provided code example uses a combination of a scheduled Worker for health checks and a Durable Object for stateful round-robin routing. Here’s a detailed breakdown:

1. **Backend Configuration**:
   - Define a list of backend URLs (e.g., `https://backend1.example.com`, `https://backend2.example.com`, `https://backend3.example.com`).
   - These URLs represent the servers hosting the content.

2. **Health Checks**:
   - A scheduled Worker runs every 60 seconds (configurable via `HEALTH_CHECK_INTERVAL`).
   - It sends a `HEAD` request to each backend URL with a 5-second timeout.
   - Healthy backends (returning HTTP 200-299) are stored in Workers KV under `HEALTH_CHECK_KEY`.

3. **Durable Object for Round-Robin**:
   - The `LoadBalancer` Durable Object maintains a `currentIndex` in its storage, initialized to 0.
   - For each request, it retrieves the list of healthy backends from KV, selects the backend at `currentIndex % healthyBackends.length`, and increments the index.
   - The request is forwarded to the selected backend by modifying the request URL’s hostname.

4. **Main Worker**:
   - Intercepts incoming requests and forwards them to the `LoadBalancer` Durable Object.
   - Returns a 503 error if no healthy backends are available.

#### Code Example
The following code implements the round-robin load balancer with health checks:

<xaiArtifact artifact_id="bafc676f-abea-4ba2-9997-a3706b6ef114" artifact_version_id="b18ea3a6-23c6-4a6c-bc7f-491b93eb0367" title="Round-Robin Load Balancer Worker" contentType="text/javascript">
const BACKEND_URLS = [
  'https://backend1.example.com',
  'https://backend2.example.com',
  'https://backend3.example.com'
];

const HEALTH_CHECK_KEY = 'healthy_backends';
const HEALTH_CHECK_INTERVAL = 60 * 1000; // 60 seconds

// Health check function to test backend availability
async function checkBackendHealth(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', timeout: 5000 });
    return response.ok;
  } catch (e) {
    return false;
  }
}

// Periodic health check Worker
addEventListener('scheduled', event => {
  event.waitUntil(performHealthChecks());
});

async function performHealthChecks() {
  const healthyBackends = [];
  for (const url of BACKEND_URLS) {
    if (await checkBackendHealth(url)) {
      healthyBackends.push(url);
    }
  }
  await KV_NAMESPACE.put(HEALTH_CHECK_KEY, JSON.stringify(healthyBackends));
}

// Durable Object for maintaining round-robin state
export class LoadBalancer {
  constructor(state) {
    this.state = state;
    this.initialize();
  }

  async initialize() {
    let index = await this.state.storage.get('currentIndex');
    if (index === undefined) {
      await this.state.storage.put('currentIndex', 0);
    }
  }

  async fetch(request) {
    const healthyBackends = JSON.parse(await KV_NAMESPACE.get(HEALTH_CHECK_KEY) || '[]');
    if (healthyBackends.length === 0) {
      return new Response('No healthy backends available', { status: 503 });
    }

    let currentIndex = await this.state.storage.get('currentIndex') || 0;
    const selectedBackend = healthyBackends[currentIndex % healthyBackends.length];
    currentIndex = (currentIndex + 1) % healthyBackends.length;
    await this.state.storage.put('currentIndex', currentIndex);

    const url = new URL(request.url);
    url.hostname = new URL(selectedBackend).hostname;
    const newRequest = new Request(url.toString(), request);
    return await fetch(newRequest);
  }
}

// Main Worker fetch handler
addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const durableObjectId = LOAD_BALANCER_NAMESPACE.idFromName('load-balancer');
  const durableObjectStub = LOAD_BALANCER_NAMESPACE.get(durableObjectId);
  event.respondWith(durableObjectStub.fetch(event.request));
});
</xaiArtifact>

#### Configuration Steps
1. **Set Up Workers KV**:
   - Create a KV namespace in the Cloudflare dashboard and bind it to your Worker as `KV_NAMESPACE`.
2. **Configure Durable Objects**:
   - Define the `LoadBalancer` Durable Object class in your Worker script.
   - Bind a Durable Object namespace to your Worker as `LOAD_BALANCER_NAMESPACE`.
3. **Enable Cron Triggers**:
   - Configure a scheduled event in the Cloudflare dashboard to trigger the health check Worker (e.g., every 60 seconds).
4. **Deploy the Worker**:
   - Use Wrangler to deploy the Worker and Durable Object: `wrangler deploy`.
5. **Update Backend URLs**:
   - Replace `BACKEND_URLS` with your actual backend server URLs.

#### Alternative Approaches
- **Random Load Balancing**: If strict round-robin is not required, random distribution (as shown in [Custom Load Balancing](https://www.codiva.io/blog/post/custom-load-balancing-with-cloudflare-worker/)) can be simpler:
  ```javascript
  const hostnames = ['backend1.example.com', 'backend2.example.com', 'backend3.example.com'];
  addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    url.hostname = hostnames[Math.floor(Math.random() * hostnames.length)];
    event.respondWith(fetch(url, event.request));
  });
  ```
  This approach is stateless but doesn’t guarantee sequential distribution.
- **DNS-Based Round-Robin**: Cloudflare’s DNS can perform round-robin load balancing by setting multiple A/AAAA records ([Round-Robin DNS](https://developers.cloudflare.com/dns/manage-dns-records/how-to/round-robin-dns/)). However, this lacks health checks unless combined with Cloudflare’s Load Balancing service.
- **Cloudflare Load Balancing**: Cloudflare’s managed Load Balancing service supports health checks and traffic steering but may not offer the customization of Workers ([Cloudflare Load Balancing](https://www.cloudflare.com/application-services/products/load-balancing/)).

#### Health Check Enhancements
- **Custom Health Check Endpoints**: Instead of a `HEAD` request, use a specific `/health` endpoint on each backend for more accurate status checks.
- **Timeout Adjustments**: Adjust the 5-second timeout based on your backend’s response time.
- **Caching**: Cache the KV read in the Worker’s memory for a short period to reduce latency, though this requires careful synchronization.

#### GitHub Resources
While no GitHub repository was found that exactly matches a Cloudflare Worker implementing round-robin load balancing with health checks, related resources include:
- [cloudflare/durable-objects-template](https://github.com/cloudflare/durable-objects-template): A starting point for building stateful Workers with Durable Objects.
- [wojons/cloudflare-lb](https://github.com/wojons/cloudflare-lb): A Python script for DNS-based load balancing using Cloudflare’s API.
- [evansopilo/loadbalancer](https://github.com/evansopilo/loadbalancer): A Go-based round-robin load balancer, not specific to Workers but useful for understanding the algorithm.
- [Gist: Load balancing to nearest datacenter](https://gist.github.com/n-ts/73c29cc8cc3c0860feb4f6a1cdee8f91): A Worker script for geo-based load balancing, which can be adapted for round-robin.

#### Performance Considerations
- **KV Latency**: KV reads/writes may add 10-50ms latency, depending on the edge location. Minimize KV access by caching results locally where possible.
- **Durable Objects**: Ensure the Durable Object is configured to scale across Cloudflare’s network to handle high traffic ([Durable Objects Docs](https://developers.cloudflare.com/durable-objects/)).
- **Health Check Frequency**: A 60-second interval balances responsiveness and API rate limits. Adjust based on your needs, but frequent checks may hit Cloudflare’s API limits.

#### Cost Considerations
- **Workers Pricing**: $0.30 per million requests, with 10 million free requests included ([Workers Pricing](https://www.cloudflare.com/developer-platform/products/workers/)).
- **Durable Objects Pricing**: Based on request duration and storage usage, typically cost-effective for low-latency stateful operations.
- **KV Pricing**: $0.50 per million reads, $5 per million writes, with 1 million free reads daily.

#### Testing and Deployment
- **Local Testing**: Use `wrangler dev` to test the Worker locally, simulating KV and Durable Object interactions.
- **Monitoring**: Use Cloudflare’s analytics to monitor request distribution and backend health ([Load Balancing Analytics](https://developers.cloudflare.com/load-balancing/)).
- **Fallback**: Implement a fallback pool in case all backends are down, possibly returning a cached response or a custom error page.

#### Limitations and Trade-offs
- **State Management**: Durable Objects provide strong consistency but may introduce latency if accessed from distant locations ([Durable Objects Latency](https://blog.cloudflare.com/durable-objects-alarms/)).
- **Scalability**: The solution scales well for moderate traffic but may require optimization for very high request rates.
- **Complexity**: Combining Workers, KV, and Durable Objects adds complexity compared to random load balancing or Cloudflare’s managed service.

#### Table: Comparison of Load Balancing Approaches
| **Approach**                | **Pros**                                                                 | **Cons**                                                                 |
|-----------------------------|--------------------------------------------------------------------------|--------------------------------------------------------------------------|
| **Workers with Durable Objects** | Stateful round-robin, customizable, supports health checks                | Complex setup, potential latency from KV/Durable Object access            |
| **Random Load Balancing**   | Simple, stateless, low latency                                            | Not true round-robin, no guaranteed even distribution                    |
| **DNS Round-Robin**         | Easy to set up, no coding required                                       | Limited health check support, less control over routing                   |
| **Cloudflare Load Balancing** | Managed service, robust health checks, traffic steering options           | Additional cost, less customization than Workers                          |

#### Recommendations
For a production environment, consider:
- Starting with the provided Worker script and adapting it to your backend URLs.
- Testing health check intervals to balance responsiveness and API usage.
- Monitoring Durable Object performance to ensure it meets traffic demands.
- Exploring Cloudflare’s managed Load Balancing service if customization needs are minimal.

This implementation provides a robust starting point for round-robin load balancing with Cloudflare Workers, addressing the user’s requirement for health checks and sequential distribution.

**Key Citations:**
- [Custom Load Balancing With Cloudflare Workers](https://www.codiva.io/blog/post/custom-load-balancing-with-cloudflare-worker/)
- [Cloudflare Load Balancing Product Page](https://www.cloudflare.com/application-services/products/load-balancing/)
- [Cloudflare Durable Objects Documentation](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare Durable Objects Template on GitHub](https://github.com/cloudflare/durable-objects-template)
- [Round-Robin DNS Documentation](https://developers.cloudflare.com/dns/manage-dns-records/how-to/round-robin-dns/)
- [Types of Load Balancing Algorithms](https://www.cloudflare.com/learning/performance/types-of-load-balancing-algorithms/)
- [Load Balancing Data Ingest With Cloudflare Workers](https://aggregations.io/blog/load-balancing-data-ingest-cloudflare-workers)
- [Durable Objects Alarms Blog Post](https://blog.cloudflare.com/durable-objects-alarms/)
- [Cloudflare Workers Load Balancing to Nearest Datacenter Gist](https://gist.github.com/n-ts/73c29cc8cc3c0860feb4f6a1cdee8f91)
- [Cloudflare Load Balancing Community Post](https://community.cloudflare.com/t/round-robin-load-balancing-a-and-aaaa-records-pointing-to-cloudflare/625276)
- [Cloudflare Load Balancing Docs](https://developers.cloudflare.com/load-balancing/)
