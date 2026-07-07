---
source_url: "https://grok.com/c/e040acfc-731a-4670-8e1d-78accecb8d6f"
conversation_id: "e040acfc-731a-4670-8e1d-78accecb8d6f"
title: "Docker Router Linking Errors"
extracted_at: "2026-06-29T16:28:35.803Z"
message_count: 7
export_suite: "identity"
provenance: grok-rest-api
---

# Docker Router Linking Errors

Source: [Grok conversation](https://grok.com/c/e040acfc-731a-4670-8e1d-78accecb8d6f)

## User

_Time: 2025-02-23T03:15:39.831Z_

tps cannot be linked automatically with multiple Services: ["stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett" "prowlarr"] providerName=docker routerName=flaresolverr-https
traefik               | 2025-02-23T03:15:22Z ERR Router jackett-http cannot be linked automatically with multiple Services: ["gluetun" "jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr"] providerName=docker routerName=jackett-http
traefik               | 2025-02-23T03:15:22Z ERR Router prowlarr-https cannot be linked automatically with multiple Services: ["flaresolverr" "gluetun" "jackett" "prowlarr" "stremio" "transmission" "deluge"] providerName=docker routerName=prowlarr-https
traefik               | 2025-02-23T03:15:22Z ERR Router deluge-http cannot be linked automatically with multiple Services: ["transmission" "deluge" "flaresolverr" "gluetun" "jackett" "prowlarr" "stremio"] providerName=docker routerName=deluge-http
traefik               | 2025-02-23T03:15:22Z ERR Router stremio-http cannot be linked automatically with multiple Services: ["deluge" "flaresolverr" "gluetun" "jackett" "prowlarr" "stremio" "transmission"] providerName=docker routerName=stremio-http
traefik               | 2025-02-23T03:15:22Z ERR Router stremio-https cannot be linked automatically with multiple Services: ["stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett" "prowlarr"] providerName=docker routerName=stremio-https
traefik               | 2025-02-23T03:15:22Z ERR Router transmission-https cannot be linked automatically with multiple Services: ["flaresolverr" "gluetun" "jackett" "prowlarr" "stremio" "transmission" "deluge"] providerName=docker routerName=transmission-https
traefik               | 2025-02-23T03:15:22Z ERR Router flaresolverr-http cannot be linked automatically with multiple Services: ["deluge" "flaresolverr" "gluetun" "jackett" "prowlarr" "stremio" "transmission"] providerName=docker routerName=flaresolverr-http
traefik               | 2025-02-23T03:15:22Z ERR Router gluetun-https cannot be linked automatically with multiple Services: ["prowlarr" "stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett"] providerName=docker routerName=gluetun-https
traefik               | 2025-02-23T03:15:22Z ERR Router jackett-https cannot be linked automatically with multiple Services: ["deluge" "flaresolverr" "gluetun" "jackett" "prowlarr" "stremio" "transmission"] providerName=docker routerName=jackett-https
traefik               | 2025-02-23T03:15:22Z ERR Router prowlarr-http cannot be linked automatically with multiple Services: ["gluetun" "jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr"] providerName=docker routerName=prowlarr-http
traefik               | 2025-02-23T03:15:22Z ERR Router transmission-http cannot be linked automatically with multiple Services: ["jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr" "gluetun"] providerName=docker routerName=transmission-http
traefik               | 2025-02-23T03:15:22Z ERR Router deluge-https cannot be linked automatically with multiple Services: ["jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr" "gluetun"] providerName=docker routerName=deluge-https
traefik               | 2025-02-23T03:15:22Z ERR Router gluetun-http cannot be linked automatically with multiple Services: ["deluge" "flaresolverr" "gluetun" "jackett" "prowlarr" "stremio" "transmission"] providerName=docker routerName=gluetun-http
i2p exited with code 0
i2p                   | 2025-02-23 03:15:23 docker-entrypoint (INFO) Creating new group 'user' with GID = 23456 ...
i2p                   | addgroup: group 'user' in use
i2p                   | 2025-02-23 03:15:23 docker-entrypoint (WARN)   * Group already exists! Existing GID = 23456.
traefik               | 2025-02-23T03:15:23Z ERR Router deluge-http cannot be linked automatically with multiple Services: ["transmission" "deluge" "flaresolverr" "gluetun" "jackett" "prowlarr" "stremio"] providerName=docker routerName=deluge-http
traefik               | 2025-02-23T03:15:23Z ERR Router flaresolverr-https cannot be linked automatically with multiple Services: ["transmission" "deluge" "flaresolverr" "gluetun" "jackett" "prowlarr" "stremio"] providerName=docker routerName=flaresolverr-https
traefik               | 2025-02-23T03:15:23Z ERR Router gluetun-https cannot be linked automatically with multiple Services: ["deluge" "flaresolverr" "gluetun" "jackett" "prowlarr" "stremio" "transmission"] providerName=docker routerName=gluetun-https
traefik               | 2025-02-23T03:15:23Z ERR Router prowlarr-http cannot be linked automatically with multiple Services: ["gluetun" "jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr"] providerName=docker routerName=prowlarr-http
traefik               | 2025-02-23T03:15:23Z ERR Router prowlarr-https cannot be linked automatically with multiple Services: ["stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett" "prowlarr"] providerName=docker routerName=prowlarr-https
traefik               | 2025-02-23T03:15:23Z ERR Router flaresolverr-http cannot be linked automatically with multiple Services: ["prowlarr" "stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett"] providerName=docker routerName=flaresolverr-http
traefik               | 2025-02-23T03:15:23Z ERR Router gluetun-http cannot be linked automatically with multiple Services: ["deluge" "flaresolverr" "gluetun" "jackett" "prowlarr" "stremio" "transmission"] providerName=docker routerName=gluetun-http
traefik               | 2025-02-23T03:15:23Z ERR Router jackett-https cannot be linked automatically with multiple Services: ["prowlarr" "stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett"] providerName=docker routerName=jackett-https
traefik               | 2025-02-23T03:15:23Z ERR Router stremio-https cannot be linked automatically with multiple Services: ["transmission" "deluge" "flaresolverr" "gluetun" "jackett" "prowlarr" "stremio"] providerName=docker routerName=stremio-https
traefik               | 2025-02-23T03:15:23Z ERR Router transmission-http cannot be linked automatically with multiple Services: ["jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr" "gluetun"] providerName=docker routerName=transmission-http
traefik               | 2025-02-23T03:15:23Z ERR Router stremio-http cannot be linked automatically with multiple Services: ["gluetun" "jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr"] providerName=docker routerName=stremio-http
traefik               | 2025-02-23T03:15:23Z ERR Router transmission-https cannot be linked automatically with multiple Services: ["prowlarr" "stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett"] providerName=docker routerName=transmission-https
traefik               | 2025-02-23T03:15:23Z ERR Router deluge-https cannot be linked automatically with multiple Services: ["jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr" "gluetun"] providerName=docker routerName=deluge-https
traefik               | 2025-02-23T03:15:23Z ERR Router jackett-http cannot be linked automatically with multiple Services: ["transmission" "deluge" "flaresolverr" "gluetun" "jackett" "prowlarr" "stremio"] providerName=docker routerName=jackett-http
i2p                   | 2025-02-23 03:15:23 docker-entrypoint (INFO) Creating new user 'user' with UID = 12345 in group 'user' ...
i2p                   | adduser: user 'user' in use
i2p                   | 2025-02-23 03:15:23 docker-entrypoint (WARN)   * User already exists! Existing UID = 12345.
i2p                   | 2025-02-23 03:15:23 docker-entrypoint (INFO) /etc/docker-entrypoint.d is not empty, attempting to perform configuration.
i2p                   | 2025-02-23 03:15:23 docker-entrypoint (DBUG) Looking for shell scripts in /etc/docker-entrypoint.d ...
i2p                   | 2025-02-23 03:15:23 docker-entrypoint (DBUG)   + Launching /etc/docker-entrypoint.d/99-extra-scripts/10.setup-volume.sh ...
i2p                   | 2025-02-23 03:15:24 docker-entrypoint (INFO) Configuration complete.
i2p                   | 2025-02-23 03:15:24 docker-entrypoint (INFO) Ready for start up!
i2p                   | *** Defaulting to 512MB JVM heap limit
i2p                   | *** You can override that value with the JVM_XMX variable
i2p                   | *** (for example JVM_XMX=256m)
i2p                   | Starting I2P
radarr                | [Error] Torznab: An error occurred while processing indexer feed.  
radarr                | 
radarr                | [v5.18.4.9674] System.Net.Http.HttpRequestException: Operation timed out (bolabaden.duckdns.org:9696)
radarr                |  ---> System.Net.Sockets.SocketException (110): Operation timed out
radarr                |    at System.Net.Sockets.Socket.AwaitableSocketAsyncEventArgs.ThrowException(SocketError error, CancellationToken cancellationToken)
radarr                |    at System.Net.Sockets.Socket.AwaitableSocketAsyncEventArgs.System.Threading.Tasks.Sources.IValueTaskSource.GetResult(Int16 token)
radarr                |    at System.Net.Sockets.Socket.<ConnectAsync>g__WaitForConnectWithCancellation|277_0(AwaitableSocketAsyncEventArgs saea, ValueTask connectTask, CancellationToken cancellationToken)
radarr                |    at NzbDrone.Common.Http.Dispatchers.ManagedHttpDispatcher.attemptConnection(AddressFamily addressFamily, SocketsHttpConnectionContext context, CancellationToken cancellationToken) in ./Radarr.Common/Http/Dispatchers/ManagedHttpDispatcher.cs:line 337
radarr                |    at NzbDrone.Common.Http.Dispatchers.ManagedHttpDispatcher.onConnect(SocketsHttpConnectionContext context, CancellationToken cancellationToken) in ./Radarr.Common/Http/Dispatchers/ManagedHttpDispatcher.cs:line 313
radarr                |    at System.Net.Http.HttpConnectionPool.ConnectToTcpHostAsync(String host, Int32 port, HttpRequestMessage initialRequest, Boolean async, CancellationToken cancellationToken)
radarr                |    --- End of inner exception stack trace ---
radarr                |    at System.Net.Http.HttpConnectionPool.ConnectToTcpHostAsync(String host, Int32 port, HttpRequestMessage initialRequest, Boolean async, CancellationToken cancellationToken)
radarr                |    at System.Net.Http.HttpConnectionPool.ConnectAsync(HttpRequestMessage request, Boolean async, CancellationToken cancellationToken)
radarr                |    at System.Net.Http.HttpConnectionPool.CreateHttp11ConnectionAsync(HttpRequestMessage request, Boolean async, CancellationToken cancellationToken)
radarr                |    at System.Net.Http.HttpConnectionPool.AddHttp11ConnectionAsync(HttpRequestMessage request)
radarr                |    at System.Threading.Tasks.TaskCompletionSourceWithCancellation`1.WaitWithCancellationAsync(CancellationToken cancellationToken)
radarr                |    at System.Net.Http.HttpConnectionPool.GetHttp11ConnectionAsync(HttpRequestMessage request, Boolean async, CancellationToken cancellationToken)
radarr                |    at System.Net.Http.HttpConnectionPool.SendWithVersionDetectionAndRetryAsync(HttpRequestMessage request, Boolean async, Boolean doRequestAuth, CancellationToken cancellationToken)
radarr                |    at System.Net.Http.AuthenticationHelper.SendWithAuthAsync(HttpRequestMessage request, Uri authUri, Boolean async, ICredentials credentials, Boolean preAuthenticate, Boolean isProxyAuth, Boolean doRequestAuth, HttpConnectionPool pool, CancellationToken cancellationToken)
radarr                |    at System.Net.Http.DecompressionHandler.SendAsync(HttpRequestMessage request, Boolean async, CancellationToken cancellationToken)
radarr                |    at System.Net.Http.HttpClient.<SendAsync>g__Core|83_0(HttpRequestMessage request, HttpCompletionOption completionOption, CancellationTokenSource cts, Boolean disposeCts, CancellationTokenSource pendingRequestsCts, CancellationToken originalCancellationToken)
radarr                |    at NzbDrone.Common.Http.Dispatchers.ManagedHttpDispatcher.GetResponseAsync(HttpRequest request, CookieContainer cookies) in ./Radarr.Common/Http/Dispatchers/ManagedHttpDispatcher.cs:line 115
radarr                |    at NzbDrone.Common.Http.HttpClient.ExecuteRequestAsync(HttpRequest request, CookieContainer cookieContainer) in ./Radarr.Common/Http/HttpClient.cs:line 157
radarr                |    at NzbDrone.Common.Http.HttpClient.ExecuteAsync(HttpRequest request) in ./Radarr.Common/Http/HttpClient.cs:line 70
radarr                |    at NzbDrone.Common.Http.HttpClient.Get(HttpRequest request) in ./Radarr.Common/Http/HttpClient.cs:line 327
radarr                |    at NzbDrone.Core.Indexers.Newznab.NewznabCapabilitiesProvider.FetchCapabilities(NewznabSettings indexerSettings) in ./Radarr.Core/Indexers/Newznab/NewznabCapabilitiesProvider.cs:line 58
radarr                |    at NzbDrone.Core.Indexers.Newznab.NewznabCapabilitiesProvider.<>c__DisplayClass4_0.<GetCapabilities>b__0() in ./Radarr.Core/Indexers/Newznab/NewznabCapabilitiesProvider.cs:line 35
radarr                |    at NzbDrone.Common.Cache.Cached`1.Get(String key, Func`1 function, Nullable`1 lifeTime) in ./Radarr.Common/Cache/Cached.cs:line 99
radarr                |    at NzbDrone.Core.Indexers.Newznab.NewznabCapabilitiesProvider.GetCapabilities(NewznabSettings indexerSettings) in ./Radarr.Core/Indexers/Newznab/NewznabCapabilitiesProvider.cs:line 37
radarr                |    at NzbDrone.Core.Indexers.Newznab.NewznabRequestGenerator.get_SupportsTmdbSearch() in ./Radarr.Core/Indexers/Newznab/NewznabRequestGenerator.cs:line 51
radarr                |    at NzbDrone.Core.Indexers.Newznab.NewznabRequestGenerator.AddMovieIdPageableRequests(IndexerPageableRequestChain chain, Int32 maxPages, IEnumerable`1 categories, SearchCriteriaBase searchCriteria) in ./Radarr.Core/Indexers/Newznab/NewznabRequestGenerator.cs:line 118
radarr                |    at NzbDrone.Core.Indexers.Newznab.NewznabRequestGenerator.GetSearchRequests(MovieSearchCriteria searchCriteria) in ./Radarr.Core/Indexers/Newznab/NewznabRequestGenerator.cs:line 111
radarr                |    at NzbDrone.Core.Indexers.HttpIndexerBase`1.<>c__DisplayClass16_0.<Fetch>b__0(IIndexerRequestGenerator g) in ./Radarr.Core/Indexers/HttpIndexerBase.cs:line 60
radarr                |    at NzbDrone.Core.Indexers.HttpIndexerBase`1.FetchReleases(Func`2 pageableRequestChainSelector, Boolean isRecent) in ./Radarr.Core/Indexers/HttpIndexerBase.cs:line 110
radarr                | 
radarr                | 


w Enable Watch

Why am i getting swarm errors when i'm not even using docker swarm?

## Assistant

_Time: 2025-02-23T03:16:42.482Z_

### Key Points
- The errors are due to Traefik's inability to automatically link routers to services because multiple services are detected for each router.
- This issue arises from not explicitly specifying which service each router should connect to in the container labels.
- You can fix this by adding specific labels to each container to link routers to their respective services.

### Why Are These Errors Occurring?
The errors in your logs, such as "Router stremio-https cannot be linked automatically with multiple Services: ["stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett" "prowlarr"]", indicate that Traefik, your reverse proxy and load balancer, is struggling to decide which service to link to each router. This happens because Traefik is finding multiple potential services for each router, likely due to a lack of explicit configuration.

### How to Fix It
To resolve this, you need to explicitly tell Traefik which service each router should connect to. This is done by adding a label to each container. For example, for a router named "stremio-https", add the label `traefik.http.routers.stremio-https.service=stremio` to the container for the "stremio" service. Repeat this for each router and its corresponding service, ensuring each router is uniquely linked.

### Surprising Detail: No Docker Swarm Involvement
It's interesting to note that despite your mention of "swarm errors," the logs provided do not show any Docker Swarm-related issues. This suggests the errors are purely related to Traefik's configuration with the Docker provider, not Swarm, which you confirmed you're not using.

---

### Comprehensive Analysis and Detailed Guidance

This section provides a thorough examination of the issue, detailing the root cause, potential configurations, and step-by-step troubleshooting, aimed at ensuring a complete understanding and resolution.

#### Background and Context
The logs provided reveal multiple error messages from Traefik, a popular reverse proxy and load balancer integrated with Docker, indicating that various routers (e.g., "stremio-https", "jackett-http") cannot be automatically linked to a single service due to multiple services being detected. The services listed in the errors include "stremio", "transmission", "deluge", "flaresolverr", "gluetun", "jackett", and "prowlarr". Additionally, there are logs from other components like i2p and radarr, but the focus here is on the Traefik errors.

The user's query also mentions "swarm errors" despite not using Docker Swarm, which is intriguing. However, the provided logs do not contain any explicit Docker Swarm errors, suggesting this might be a misunderstanding or a separate issue not captured in the logs.

#### Root Cause Analysis
Traefik uses the Docker provider to dynamically configure its routers and services based on container labels. By default, when a container has labels defining a router, Traefik links that router to the service associated with that container. However, the errors indicate that for each router, Traefik is detecting multiple potential services, leading to ambiguity.

This ambiguity typically arises in the following scenarios:
1. **Lack of Explicit Service Specification:** If the router labels do not explicitly specify the service (via `traefik.http.routers.[router_name].service`), Traefik may attempt to auto-link based on default behavior, which can fail if multiple services are exposed.
2. **Misconfigured Labels:** Multiple containers might have similar or conflicting labels, causing Traefik to consider them as potential services for the same router.
3. **Global Configuration Issues:** Although the provider is Docker, there might be settings like `exposedByDefault=true` in Traefik's configuration, leading to all containers being considered, exacerbating the ambiguity.

Given the error messages list all services for each router, it suggests that Traefik is not finding a clear, single service to link to, likely because the service is not explicitly defined in the router configuration.

#### Detailed Examination of Logs
Let's break down a sample error:
- "Router stremio-https cannot be linked automatically with multiple Services: ["stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett" "prowlarr"] providerName=docker routerName=stremio-https"
  - This indicates the router "stremio-https" is trying to link to multiple services, including "stremio" and others, which should not happen if properly configured.
  - The pattern repeats for other routers like "jackett-https", "prowlarr-http", etc., with the same list of services, suggesting a systemic issue in label configuration.

The logs also include i2p startup messages and a radarr error about a timeout, but these are unrelated to the Traefik issue and do not affect the resolution here.

#### Resolution Strategy
To resolve the issue, we need to ensure each router is explicitly linked to its intended service. This can be achieved by:
1. **Explicitly Specifying the Service:** For each router, add the label `traefik.http.routers.[router_name].service=[service_name]` to the container that defines the router. The `[service_name]` should match the name of the service, typically the container name.
   - Example: For the "stremio" container with router "stremio-https", add `traefik.http.routers.stremio-https.service=stremio`.

2. **Verify Container Labels:** Check all containers to ensure no duplicate or conflicting router names exist, as router names must be unique across all configurations. Use `docker inspect <container_name>` to view labels and ensure correctness.

3. **Check Traefik Configuration:** Ensure Traefik's configuration does not have settings like `exposedByDefault=true` without proper constraints, which could expose all containers and cause ambiguity. The default is `exposedByDefault=false`, which is safer and requires explicit enabling via `traefik.enable=true` on containers.

4. **Restart and Test:** After updating labels, restart the Traefik container and the affected service containers to apply changes. Monitor logs for any remaining errors.

#### Step-by-Step Implementation
Here’s how to implement the fix:

1. **List All Containers and Their Labels:**
   - Run `docker ps` to list running containers and identify those related to "stremio", "transmission", etc.
   - For each, run `docker inspect <container_name>` and look under "Config.Labels" for Traefik-related labels.

2. **Add Missing Labels:**
   - If a router label exists (e.g., `traefik.http.routers.stremio-https.rule=Host(`stremio.example.com`)`) but lacks the service specification, update the container.
   - Use `docker service update --label-add "traefik.http.routers.stremio-https.service=stremio" <service_name>` for swarm (though not used here) or update the docker-compose file and recreate the container.

3. **Example Docker-Compose Snippet:**
   - For a service:
     ```
     services:
       stremio:
         image: stremio/stremio
         labels:
           - "traefik.enable=true"
           - "traefik.http.routers.stremio-https.rule=Host(`stremio.example.com`)"
           - "traefik.http.routers.stremio-https.service=stremio"
           - "traefik.http.routers.stremio-https.tls=true"
     ```
   - Repeat for each service, ensuring unique router names and correct service links.

4. **Verify and Restart:**
   - After updates, run `docker-compose down && docker-compose up -d` or restart individually.
   - Check Traefik logs (`docker logs traefik`) for any remaining errors.

#### Additional Considerations
- **Surprising Detail: No Swarm Errors Found:** Despite the user's mention of "swarm errors," the logs provided do not indicate any Docker Swarm-related issues. This suggests the errors are solely Traefik configuration-related, which is consistent with using the Docker provider without Swarm.
- **Radarr Timeout Error:** The radarr error about a timeout (e.g., "Operation timed out (bolabaden.duckdns.org:9696)") is unrelated but indicates potential network issues with an indexer feed, which should be addressed separately if persistent.

#### Tables for Clarity
Below is a table mapping example routers to their intended services based on the error messages, which can guide label updates:

| Router Name       | Intended Service | Suggested Label Addition                          |
|-------------------|------------------|--------------------------------------------------|
| stremio-https     | stremio          | traefik.http.routers.stremio-https.service=stremio |
| jackett-http      | jackett          | traefik.http.routers.jackett-http.service=jackett  |
| prowlarr-https    | prowlarr         | traefik.http.routers.prowlarr-https.service=prowlarr |
| transmission-http | transmission     | traefik.http.routers.transmission-http.service=transmission |

This table is illustrative; adjust based on actual container names and configurations.

#### Conclusion
By explicitly specifying the service for each router in the container labels, you can resolve the ambiguity causing the errors. This approach ensures Traefik can link each router to its intended service without confusion, aligning with best practices for Traefik and Docker integration.

For further reading, consult the Traefik documentation on Docker provider configuration ([Traefik Docker Provider Documentation](https://doc.traefik.io/traefik/providers/docker/)) and community forums for similar issues ([Traefik Community Forum: Could not define the service name for the router](https://community.traefik.io/t/could-not-define-the-service-name-for-the-router-too-many-services/5514)).

#### Key Citations
- [Traefik Docker Provider Documentation Configuration Discovery](https://doc.traefik.io/traefik/providers/docker/)
- [Traefik Community Forum Could not define service name for router too many services](https://community.traefik.io/t/could-not-define-the-service-name-for-the-router-too-many-services/5514)
- [Traefik Community Forum Two entrypoints services for one hostname](https://community.traefik.io/t/two-entrypoints-services-for-one-hostname/25032)

## User

_Time: 2025-02-23T03:16:49.607Z_

the question was highly specific to **why am i getting swarm errors despite not using swarm**

## model

_Time: 2025-02-23T03:17:01.958Z_



## User

_Time: 2025-02-23T03:17:19.454Z_

```
ssion" "deluge" "flaresolverr" "gluetun" "jackett"] providerName=docker routerName=flaresolverr-http
traefik               | 2025-02-23T03:16:56Z ERR Router jackett-http cannot be linked automatically with multiple Services: ["flaresolverr" "gluetun" "jackett" "prowlarr" "stremio" "transmission" "deluge"] providerName=docker routerName=jackett-http
traefik               | 2025-02-23T03:16:56Z ERR Router prowlarr-https cannot be linked automatically with multiple Services: ["jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr" "gluetun"] providerName=docker routerName=prowlarr-https
traefik               | 2025-02-23T03:16:57Z ERR Router stremio-http cannot be linked automatically with multiple Services: ["deluge" "flaresolverr" "gluetun" "jackett" "prowlarr" "stremio" "transmission"] providerName=docker routerName=stremio-http
traefik               | 2025-02-23T03:16:57Z ERR Router flaresolverr-https cannot be linked automatically with multiple Services: ["gluetun" "jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr"] providerName=docker routerName=flaresolverr-https
traefik               | 2025-02-23T03:16:57Z ERR Router gluetun-http cannot be linked automatically with multiple Services: ["gluetun" "jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr"] providerName=docker routerName=gluetun-http
traefik               | 2025-02-23T03:16:57Z ERR Router jackett-https cannot be linked automatically with multiple Services: ["prowlarr" "stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett"] providerName=docker routerName=jackett-https
traefik               | 2025-02-23T03:16:57Z ERR Router stremio-https cannot be linked automatically with multiple Services: ["gluetun" "jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr"] providerName=docker routerName=stremio-https
traefik               | 2025-02-23T03:16:57Z ERR Router gluetun-https cannot be linked automatically with multiple Services: ["prowlarr" "stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett"] providerName=docker routerName=gluetun-https
traefik               | 2025-02-23T03:16:57Z ERR Router prowlarr-http cannot be linked automatically with multiple Services: ["deluge" "flaresolverr" "gluetun" "jackett" "prowlarr" "stremio" "transmission"] providerName=docker routerName=prowlarr-http
traefik               | 2025-02-23T03:16:57Z ERR Router transmission-http cannot be linked automatically with multiple Services: ["gluetun" "jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr"] providerName=docker routerName=transmission-http
traefik               | 2025-02-23T03:16:57Z ERR Router transmission-https cannot be linked automatically with multiple Services: ["deluge" "flaresolverr" "gluetun" "jackett" "prowlarr" "stremio" "transmission"] providerName=docker routerName=transmission-https
traefik               | 2025-02-23T03:16:57Z ERR Router deluge-http cannot be linked automatically with multiple Services: ["gluetun" "jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr"] providerName=docker routerName=deluge-http
traefik               | 2025-02-23T03:16:57Z ERR Router deluge-https cannot be linked automatically with multiple Services: ["jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr" "gluetun"] providerName=docker routerName=deluge-https
traefik               | 2025-02-23T03:16:57Z ERR Router flaresolverr-http cannot be linked automatically with multiple Services: ["gluetun" "jackett" "prowlarr" "stremio" "transmission" "deluge" "flaresolverr"] providerName=docker routerName=flaresolverr-http
traefik               | 2025-02-23T03:16:57Z ERR Router jackett-http cannot be linked automatically with multiple Services: ["prowlarr" "stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett"] providerName=docker routerName=jackett-http
traefik               | 2025-02-23T03:16:57Z ERR Router prowlarr-https cannot be linked automatically with multiple Services: ["stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett" "prowlarr"] providerName=docker routerName=prowlarr-https
prefetcharr-jellyfin  | 2025-02-23T03:16:58.744405Z DEBUG hyper_util::client::legacy::pool: reuse idle connection for ("http", host.docker.internal:7878)
radarr                | [Info] Radarr.Http.Authentication.ApiKeyAuthenticationHandler: AuthenticationScheme: API was challenged. 
prefetcharr-jellyfin  | 2025-02-23T03:16:58.746719Z DEBUG hyper_util::client::legacy::pool: pooling idle connection for ("http", host.docker.internal:7878)
prefetcharr-jellyfin  | 2025-02-23T03:16:58.746843Z ERROR prefetcharr::util: Probing Sonarr failed: HTTP status client error (401 Unauthorized) for url (http://host.docker.internal:7878/api)
prefetcharr-jellyfin  | 2025-02-23T03:16:58.746891Z  INFO prefetcharr::util: Retry after 4 seconds
prefetcharr-plex      | 2025-02-23T03:16:58.848309Z DEBUG hyper_util::client::legacy::pool: reuse idle connection for ("http", host.docker.internal:7878)
radarr                | [Info] Radarr.Http.Authentication.ApiKeyAuthenticationHandler: AuthenticationScheme: API was challenged. 
prefetcharr-plex      | 2025-02-23T03:16:58.850559Z DEBUG hyper_util::client::legacy::pool: pooling idle connection for ("http", host.docker.internal:7878)
prefetcharr-plex      | 2025-02-23T03:16:58.850677Z ERROR prefetcharr::util: Probing Sonarr failed: HTTP status client error (401 Unauthorized) for url (http://host.docker.internal:7878/api)
prefetcharr-plex      | 2025-02-23T03:16:58.850709Z  INFO prefetcharr::util: Retry after 4 seconds
overseerr             | 2025-02-23T03:17:00.005Z [debug][Jobs]: Starting scheduled job: Download Sync 
jellyseerr            | 2025-02-23T03:17:00.005Z [debug][Jobs]: Starting scheduled job: Download Sync 
jellyseerr            | 2025-02-23T03:17:00.032Z [debug][Download Tracker]: Found 6 item(s) in progress on Sonarr server: Sonarr 
fileflows             | Info -> EULA Not accepted cannot execute worker: FileFlowsTasksWorker
traefik               | 2025-02-23T03:17:00Z ERR Failed to list services for docker swarm mode error="Error response from daemon: This node is not a swarm manager. Use \"docker swarm init\" or \"docker swarm join\" to connect this node to swarm and try again." providerName=swarm
traefik               | 2025-02-23T03:17:00Z ERR Provider error, retrying in 502.535908ms error="Error response from daemon: This node is not a swarm manager. Use \"docker swarm init\" or \"docker swarm join\" to connect this node to swarm and try again." providerName=swarm
traefik               | 2025-02-23T03:17:00Z ERR Failed to list services for docker swarm mode error="Error response from daemon: This node is not a swarm manager. Use \"docker swarm init\" or \"docker swarm join\" to connect this node to swarm and try again." providerName=swarm
traefik               | 2025-02-23T03:17:00Z ERR Provider error, retrying in 985.217311ms error="Error response from daemon: This node is not a swarm manager. Use \"docker swarm init\" or \"docker swarm join\" to connect this node to swarm and try again." providerName=swarm
fileflows             | Info -> EULA Not accepted cannot execute worker: FlowRunnerMonitor
fileflows             | Info -> No file found to process, status from server: SystemPaused
traefik               | 2025-02-23T03:17:01Z ERR Failed to list services for docker swarm mode error="Error response from daemon: This node is not a swarm manager. Use \"docker swarm init\" or \"docker swarm join\" to connect this node to swarm and try again." providerName=swarm
traefik               | 2025-02-23T03:17:01Z ERR Provider error, retrying in 722.839025ms error="Error response from daemon: This node is not a swarm manager. Use \"docker swarm init\" or \"docker swarm join\" to connect this node to swarm and try again." providerName=swarm
traefik               | 2025-02-23T03:17:02Z ERR Failed to list services for docker swarm mode error="Error response from daemon: This node is not a swarm manager. Use \"docker swarm init\" or \"docker swarm join\" to connect this node to swarm and try again." providerName=swarm
traefik               | 2025-02-23T03:17:02Z ERR Provider error, retrying in 1.971789156s error="Error response from daemon: This node is not a swarm manager. Use \"docker swarm init\" or \"docker swarm join\" to connect this node to swarm and try again." providerName=swarm
prefetcharr-jellyfin  | 2025-02-23T03:17:02.748616Z DEBUG hyper_util::client::legacy::pool: reuse idle connection for ("http",
```
clearly mentions swarm consistently for zero reason, i'm not even using swarm.

## Assistant

_Time: 2025-02-23T03:17:30.584Z_

### Key Points
- The errors you are seeing are not actually related to Docker Swarm; they are configuration issues with Traefik, a reverse proxy tool, when using the Docker provider.
- You mentioned not using Docker Swarm, and the errors are about Traefik struggling to link routers to services, which is a common misinterpretation as "swarm errors" due to the term "services."

---

### Why These Aren't Swarm Errors
**What’s Happening**  
The errors in your logs, like "Router stremio-https cannot be linked automatically with multiple Services," come from Traefik. Traefik is trying to connect its routers (which direct traffic) to services (in this case, your Docker containers), but it’s finding multiple possible containers for each router, causing confusion. This is a configuration issue, not a Docker Swarm problem.

**Why You Think It’s Swarm-Related**  
The term "services" in the error might make you think of Docker Swarm, where "services" are a key concept for managing scaled applications. However, in Traefik’s context with the Docker provider, "services" just means individual Docker containers, which is standard for standalone Docker setups, not Swarm.

**Surprising Detail: No Swarm Involvement**  
Even though you’re not using Docker Swarm, the errors might feel familiar if you’ve worked with Swarm before, but they’re purely Traefik-related and can be fixed by adjusting container labels, not Swarm settings.

---

### How to Fix It
To resolve this, you need to tell Traefik exactly which container (service) each router should connect to. Add labels like `traefik.http.routers.stremio-https.service=stremio` to the relevant container. This ensures Traefik links each router to the right service, clearing up the ambiguity.

For more details, check Traefik’s documentation on the Docker provider ([Traefik Docker Provider](https://doc.traefik.io/traefik/providers/docker/)).

---

---

### Detailed Analysis and Resolution

This section provides a comprehensive examination of the issue, detailing the root cause, potential misinterpretations, and step-by-step guidance for resolution, aimed at ensuring a thorough understanding and effective troubleshooting.

#### Background and Context
The user’s query centers on encountering what they perceive as "swarm errors" despite not using Docker Swarm, a container orchestration tool for managing multiple Docker hosts as a single cluster. The provided logs, however, reveal errors primarily from Traefik, a reverse proxy and load balancer integrated with Docker, indicating issues with linking routers to services. Additional logs from components like i2p and radarr are present but unrelated to the core issue. The user’s confusion likely stems from the terminology used in the error messages, particularly the mention of "services," which has different implications in Docker Swarm versus standalone Docker setups.

#### Root Cause Analysis
The errors, such as "Router stremio-https cannot be linked automatically with multiple Services: ["stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett" "prowlarr"] providerName=docker routerName=stremio-https," indicate that Traefik, configured with the Docker provider, is unable to determine which Docker container (referred to as a "service" in Traefik’s terminology) to link to each router. This ambiguity arises because the router labels do not explicitly specify the service, and Traefik detects multiple potential containers, leading to a failure in automatic linking.

This issue is not related to Docker Swarm, as the user has stated they are not using it. Docker Swarm involves managing services with replicas and scaling across nodes, which is distinct from the standalone Docker setup implied here, where containers are managed individually. The confusion likely stems from the term "services" in the error message, which in Swarm refers to scalable units, but in Traefik’s Docker provider context, it simply means Docker containers.

#### Investigation into "Swarm Errors" Misinterpretation
To understand why the user perceives these as "swarm errors," we explored common scenarios where Docker users might encounter Swarm-related error messages even without using Swarm. Web searches revealed cases, such as on Stack Overflow ([Stack Overflow: This node is not a swarm manager error, but I'm not using docker swarm](https://stackoverflow.com/questions/55067113/this-node-is-not-a-swarm-manager-error-but-im-not-using-docker-swarm)), where users encountered errors like "This node is not a swarm manager" when using features like the overlay network driver, which requires Swarm mode. However, in the provided logs, there are no such explicit Swarm errors; all are Traefik-related.

The term "services" in Traefik’s error messages likely triggered the association with Swarm, as in Swarm mode, "services" are a central concept for defining application deployments with scaling and placement constraints. In contrast, in standalone Docker with Traefik’s Docker provider, "services" refer to individual containers, and the errors indicate a configuration issue, not a Swarm orchestration problem.

Further investigation into Traefik’s integration with Docker Swarm ([Traefik Swarm Provider](https://doc.traefik.io/traefik/providers/swarm/)) showed that Traefik can be configured for Swarm, but this requires specific setup, such as scheduling on manager nodes, which is not evident in the user’s logs or description. Given the user’s assertion of not using Swarm, it’s clear the errors are not from a Swarm setup but from a misconfiguration in the Docker provider context.

#### Detailed Error Analysis
Examining the logs, the pattern of errors repeats for various routers (e.g., "jackett-http," "prowlarr-https") with the same list of services, suggesting a systemic issue in label configuration. For instance:
- "Router stremio-https cannot be linked automatically with multiple Services: ["stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett" "prowlarr"]" indicates Traefik sees multiple containers as potential targets for the router "stremio-https."
- This is likely because the router labels, such as `traefik.http.routers.stremio-https.rule`, exist, but the service specification, like `traefik.http.routers.stremio-https.service=stremio`, is missing or ambiguous.

The logs also include i2p startup messages and a radarr timeout error, but these are unrelated to the Traefik issue and do not affect the resolution.

#### Resolution Strategy
To resolve the issue, the user needs to explicitly link each router to its intended service by adding appropriate labels to the Docker containers. This involves:
1. **Explicit Service Specification:** For each router, add the label `traefik.http.routers.[router_name].service=[service_name]` to the container that defines the router. For example, for "stremio-https," add `traefik.http.routers.stremio-https.service=stremio` to the "stremio" container.
2. **Verify Container Labels:** Use `docker inspect <container_name>` to review existing labels and ensure no duplicate or conflicting router names exist, as router names must be unique.
3. **Check Traefik Configuration:** Ensure Traefik’s configuration does not have settings like `exposedByDefault=true` without constraints, which could expose all containers and cause ambiguity. The default is `exposedByDefault=false`, requiring explicit enabling via `traefik.enable=true`.
4. **Restart and Test:** After updating labels, restart the Traefik container and affected service containers (e.g., using `docker-compose down && docker-compose up -d` if using compose) and monitor logs for resolution.

#### Example Configuration
Here’s an example of how to update a docker-compose file for a service:
```
services:
  stremio:
    image: stremio/stremio
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.stremio-https.rule=Host(`stremio.example.com`)"
      - "traefik.http.routers.stremio-https.service=stremio"
      - "traefik.http.routers.stremio-https.tls=true"
```
Repeat for each service, ensuring unique router names and correct service links.

#### Tables for Clarity
Below is a table mapping example routers to their intended services based on the error messages, which can guide label updates:

| Router Name       | Intended Service | Suggested Label Addition                          |
|-------------------|------------------|--------------------------------------------------|
| stremio-https     | stremio          | traefik.http.routers.stremio-https.service=stremio |
| jackett-http      | jackett          | traefik.http.routers.jackett-http.service=jackett  |
| prowlarr-https    | prowlarr         | traefik.http.routers.prowlarr-https.service=prowlarr |
| transmission-http | transmission     | traefik.http.routers.transmission-http.service=transmission |

This table is illustrative; adjust based on actual container names and configurations.

#### Additional Considerations
- The user’s mention of "swarm errors" without using Swarm suggests a misunderstanding, possibly due to prior experience with Swarm where "services" are a key concept. The errors are purely Traefik-related and can be resolved without enabling Swarm.
- The radarr timeout error in the logs (e.g., "Operation timed out (bolabaden.duckdns.org:9696)") is unrelated and indicates potential network issues with an indexer feed, which should be addressed separately if persistent.

#### Conclusion
The user is not experiencing Docker Swarm errors; instead, they are encountering Traefik configuration issues with the Docker provider, misinterpreted due to the term "services." By explicitly specifying the service for each router in container labels, the user can resolve the ambiguity causing the errors, ensuring Traefik functions correctly in their standalone Docker setup.

For further reading, consult the Traefik documentation on Docker provider configuration ([Traefik Docker Provider](https://doc.traefik.io/traefik/providers/docker/)) and community forums for similar issues, such as [Stack Overflow: Could not define the service name for the router too many services](https://community.traefik.io/t/could-not-define-the-service-name-for-the-router-too-many-services/5514).

#### Key Citations
- [Traefik Docker Provider Configuration Discovery](https://doc.traefik.io/traefik/providers/docker/)
- [Stack Overflow This node is not a swarm manager error, but I'm not using docker swarm](https://stackoverflow.com/questions/55067113/this-node-is-not-a-swarm-manager-error-but-im-not-using-docker-swarm)
- [Traefik Swarm Provider Documentation](https://doc.traefik.io/traefik/providers/swarm/)

## Assistant

_Time: 2025-02-23T03:17:57.099Z_

### Key Points
- You're getting "swarm errors" because Traefik is configured to use the swarm provider, but your Docker environment isn't set up for swarm mode.
- These errors occur even though you're not using Docker Swarm, likely due to a misconfiguration in Traefik's settings.
- To fix this, disable the swarm provider in Traefik's configuration file or remove related command-line flags.

### Why Are You Getting Swarm Errors?
**What’s Happening:**  
Traefik, your reverse proxy and load balancer, supports multiple providers for service discovery, including a "docker" provider for standalone Docker and a "swarm" provider for Docker Swarm mode. The errors like "Failed to list services for docker swarm mode" with "providerName=swarm" show that Traefik is trying to connect to a Docker Swarm, but your system isn't configured as a swarm node, leading to failures.

**Why It’s Surprising:**  
It’s unexpected to see swarm-related errors if you’re not using Docker Swarm, but this happens because Traefik’s configuration includes the swarm provider, which tries to interact with a non-existent swarm environment.

**How to Fix It:**  
- Check Traefik’s configuration file (usually `traefik.yml` or `traefik.toml`) for the "providers" section.
- Remove any mention of the "swarm" provider, such as:
  ```
  swarm:
    endpoint: "http://localhost:2375"
  ```
- If using command-line flags, remove any flags like `--providers.swarm.endpoint=tcp://127.0.0.1:2377`.
- Restart Traefik after making changes to apply the updates.

This should stop the swarm-related errors, as Traefik will no longer attempt to connect to a swarm.

---

### Comprehensive Analysis and Detailed Guidance

This section provides a thorough examination of the issue, detailing the root cause, potential configurations, and step-by-step troubleshooting, aimed at ensuring a complete understanding and resolution.

#### Background and Context
The logs provided reveal multiple error messages from Traefik, including "ERR Router [name] cannot be linked automatically with multiple Services" associated with the "docker" provider, and separate errors like "Failed to list services for docker swarm mode error='Error response from daemon: This node is not a swarm manager. Use "docker swarm init" or "docker swarm join" to connect this node to swarm and try again.'" with "providerName=swarm". The user's query specifically focuses on why they are encountering swarm-related errors despite not using Docker Swarm.

Traefik is a reverse proxy and load balancer that integrates with various backends for service discovery and routing. It supports multiple providers, including the "docker" provider for standalone Docker and the "swarm" provider for Docker Swarm mode. The presence of both types of errors suggests a configuration issue where Traefik is attempting to use providers that are not aligned with the user's setup.

#### Root Cause Analysis
The swarm-related errors indicate that Traefik is configured to use the swarm provider, which is designed for Docker Swarm mode. In Docker Swarm mode, containers are managed as services with scaling and orchestration capabilities, and Traefik uses the swarm provider to discover these services via labels on services rather than individual containers. However, the error message "This node is not a swarm manager" suggests that the Docker environment is not initialized in swarm mode, meaning there is no swarm cluster for Traefik to connect to.

Given the user's statement that they are not using Docker Swarm, the likely cause is that the swarm provider is enabled in Traefik's configuration, leading it to attempt to list services from a non-existent swarm. This results in the observed errors, as Traefik cannot connect to the swarm and fails with the provided error message.

#### Detailed Examination of Logs
Let's break down the relevant logs:
- Initial errors are like:
  - "traefik | 2025-02-23T03:15:22Z ERR Router stremio-https cannot be linked automatically with multiple Services: ["stremio" "transmission" "deluge" "flaresolverr" "gluetun" "jackett" "prowlarr"] providerName=docker routerName=stremio-https"
  - These are related to the docker provider and indicate issues with router-to-service linking, which is a separate configuration issue.
- Later, swarm-specific errors appear:
  - "traefik | 2025-02-23T03:17:00Z ERR Failed to list services for docker swarm mode error='Error response from daemon: This node is not a swarm manager. Use "docker swarm init" or "docker swarm join" to connect this node to swarm and try again.'" providerName=swarm"
  - This error repeats multiple times with increasing retry delays, confirming that the swarm provider is actively trying to connect but failing.

The logs also include unrelated messages from other services like prefetcharr-jellyfin and radarr, but these do not pertain to the swarm errors and can be ignored for this analysis.

#### Resolution Strategy
To resolve the swarm errors, the user needs to disable the swarm provider in Traefik's configuration, as they are not using Docker Swarm. This involves:
1. Locating Traefik's configuration file and removing the swarm provider settings.
2. Ensuring no command-line flags or environment variables enable the swarm provider.
3. Restarting Traefik to apply the changes.

Additionally, while not the focus of the user's query, the router linking errors with the docker provider should be addressed separately by ensuring each router is explicitly linked to its intended service via appropriate labels.

#### Step-by-Step Implementation
Here’s how to implement the fix for the swarm errors:

1. **Locate Traefik Configuration:**
   - Check for Traefik's configuration file, typically found at `/etc/traefik/traefik.yml`, `/path/to/your/traefik.toml`, or specified via the `--configFile` flag.
   - If using Docker Compose, look in the `command` or `environment` section for Traefik startup parameters.

2. **Inspect for Swarm Provider:**
   - Open the configuration file and look for the "providers" section.
   - Example configuration with both providers:
     ```yaml
     providers:
       docker:
         endpoint: "unix:///var/run/docker.sock"
         exposedByDefault: false
       swarm:
         endpoint: "http://localhost:2375"
     ```
   - If the "swarm" section is present, it needs to be removed.

3. **Remove Swarm Provider:**
   - Delete the "swarm" subsection from the providers, leaving only the docker provider (if needed):
     ```yaml
     providers:
       docker:
         endpoint: "unix:///var/run/docker.sock"
         exposedByDefault: false
     ```
   - Save the file.

4. **Check Command-Line Flags:**
   - If starting Traefik via command line or Docker run, ensure no flags like `--providers.swarm.endpoint=tcp://127.0.0.1:2377` are present.
   - Update the command if necessary, e.g.:
     ```bash
     docker run -d --name traefik --network web -v /var/run/docker.sock:/var/run/docker.sock -p 80:80 -p 443:443 traefik:latest --providers.docker --entrypoints.web.address=:80
     ```
     Remove any `--providers.swarm` related flags.

5. **Restart Traefik:**
   - Restart the Traefik container or service to apply changes:
     - Using Docker: `docker restart traefik` or `docker-compose down && docker-compose up -d`.
   - Monitor logs (`docker logs traefik`) to ensure no more swarm-related errors appear.

#### Additional Considerations
- **Docker vs. Swarm Mode:** Docker has two modes: standalone (using the docker provider) and swarm mode (using the swarm provider). The user is likely using standalone mode, as evidenced by the absence of swarm initialization.
- **Community Insights:** From community forums, it's common for users to enable the swarm provider mistakenly, leading to similar errors ([Traefik Community Forum: Traefik 3 not working with --providers.swarm.endpoint](https://community.traefik.io/t/solved-traefik-3-not-working-with-providers-swarm-endpoint-tcp-127-0-0-1-2377/22593)). This reinforces that removing the swarm provider is the correct approach.
- **Router Linking Errors:** While not the focus, the initial errors about routers not linking to services are from the docker provider and suggest a need for explicit service linking via labels, which can be addressed separately.

#### Tables for Clarity
Below is a table summarizing the providers and their usage:

| Provider       | Description                                      | Relevant for User's Setup |
|----------------|--------------------------------------------------|---------------------------|
| Docker         | For standalone Docker, uses container labels     | Yes, likely in use        |
| Swarm          | For Docker Swarm mode, uses service labels       | No, not in use, causing errors |

This table helps clarify the distinction and why the swarm provider is causing issues.

#### Conclusion
The swarm errors occur because Traefik is configured to use the swarm provider, which requires a Docker Swarm environment that the user does not have. By disabling the swarm provider in Traefik's configuration, the errors will be resolved, aligning Traefik's operation with the user's standalone Docker setup.

For further reading, consult the Traefik documentation on providers ([Traefik Documentation: Providers](https://doc.traefik.io/traefik/providers/)) and community forums for similar issues ([Traefik Community Forum: SwarmModeRefreshSeconds](https://community.traefik.io/t/swarmmoderefreshseconds/22504)).

#### Key Citations
- [Traefik Documentation Swarm Provider](https://doc.traefik.io/traefik/providers/swarm/)
- [Traefik Community Forum Traefik 3 not working with --providers.swarm.endpoint](https://community.traefik.io/t/solved-traefik-3-not-working-with-providers-swarm-endpoint-tcp-127-0-0-1-2377/22593)
- [Traefik Documentation Docker Provider](https://doc.traefik.io/traefik/providers/docker/)
- [Traefik Community Forum swarmModeRefreshSeconds](https://community.traefik.io/t/swarmmoderefreshseconds/22504)
