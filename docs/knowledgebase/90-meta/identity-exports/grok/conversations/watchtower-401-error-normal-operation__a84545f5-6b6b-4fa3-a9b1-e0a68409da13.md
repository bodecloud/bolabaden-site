---
source_url: "https://grok.com/c/a84545f5-6b6b-4fa3-a9b1-e0a68409da13"
conversation_id: "a84545f5-6b6b-4fa3-a9b1-e0a68409da13"
title: "Watchtower 401 Error: Normal Operation"
extracted_at: "2026-06-29T16:20:00.455Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Watchtower 401 Error: Normal Operation

Source: [Grok conversation](https://grok.com/c/a84545f5-6b6b-4fa3-a9b1-e0a68409da13)

## User

_Time: 2025-09-18T00:51:31.395Z_

how to fix in watchtower container?
 
basically watchtower never ever actually pulls the container?? always get 401 error as shown above.

## Assistant

_Time: 2025-09-18T00:55:15.706Z_

### Key Points
- Research indicates that the 401 Unauthorized message in your Watchtower logs is part of the standard Docker registry authentication challenge and not an actual error preventing operations.<grok:render card_id="c95904" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render><grok:render card_id="b24a1c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>
- Watchtower is functioning correctly: it compares local and remote image digests and skips pulls when they match, as seen in your logs, suggesting no updates are available for the checked images.<grok:render card_id="470940" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render>
- Images pinned to specific versions (e.g., rclone:1.71) typically won't update automatically unless the registry updates that tag's content, which is rare; using ":latest" tags allows for more frequent checks.<grok:render card_id="0c7371" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render>
- If you encounter intermittent issues or have many containers, adding Docker Hub credentials can help avoid potential rate limits on anonymous accesses, though your current setup succeeds without them.<grok:render card_id="440e19" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render><grok:render card_id="568d2b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>

### Understanding the 401 Response
The 401 status in logs like "Got response to challenge request... status='401 Unauthorized'" is expected behavior in the Docker registry protocol. When Watchtower checks an image, it first sends a request to the registry (e.g., index.docker.io), which responds with a 401 and provides authentication instructions (e.g., via a Bearer token realm). Watchtower then follows this to obtain a token—often anonymously for public images—and proceeds with the actual check. Your logs show successful digest retrieval after this step, confirming no blockage.<grok:render card_id="4ef48e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render><grok:render card_id="381a47" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> See the Docker documentation for more on this flow: [Registry Authentication](https://docs.docker.com/reference/api/registry/auth/).

### Why Watchtower Isn't Pulling Images
Watchtower only pulls and updates containers if the remote image digest differs from the local one, as evident in your logs (e.g., "Found a match" and "No pull needed"). For your images:
- traefik/whoami:latest and caomingjun/warp:latest match current remote digests, indicating no newer versions.
- rclone/rclone:1.71 is a fixed tag; updates require manual tag changes or switching to ":latest" for automatic detection.

This aligns with Watchtower's design to avoid unnecessary pulls.<grok:render card_id="5d20fb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render> To test, temporarily change an image tag to an older version in your docker-compose file and restart Watchtower.

### Optional: Adding Authentication to Avoid Rate Limits
While not required here (your checks succeed anonymously), Docker Hub imposes rate limits on unauthenticated requests (100 pulls per 6 hours per IP), which could cause future 401 or 429 errors if exceeded.<grok:render card_id="0bde86" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render><grok:render card_id="71f0d7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render> To mitigate:
1. On your host, run `docker login` with your Docker Hub credentials.
2. Update your docker-compose.yml under Watchtower's volumes:
   ```
   volumes:
     - /var/run/docker.sock:/var/run/docker.sock
     - ~/.docker/config.json:/config.json:ro
   ```
3. Restart the stack with `docker-compose up -d`.

This provides authenticated access with higher limits (200 per 6 hours for free accounts).<grok:render card_id="0a1d4e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render>

---
Watchtower, developed by containrrr, is a Docker container designed to automate the updating of other containers by monitoring their base images and pulling new versions when available.<grok:render card_id="eb8959" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render> It achieves this by periodically checking the image digests from the registry against local ones, gracefully stopping and restarting containers with updated images while preserving original configurations. In your setup, as shown in the provided docker-compose.yml, Watchtower is configured with debug logging enabled (WATCHTOWER_DEBUG: true and WATCHTOWER_LOG_LEVEL: debug), which explains the detailed output, including the authentication steps. The schedule is set to run daily at 6 AM (WATCHTOWER_SCHEDULE: 0 0 6 * * *), and the log timestamp (2025-09-17T06:00:45Z) aligns with this trigger.

The core of your concern appears to stem from the 401 Unauthorized messages in the logs, but these are integral to the Docker registry's challenge-response authentication mechanism.<grok:render card_id="a4ce53" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render><grok:render card_id="16e57b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> Here's a step-by-step breakdown of the process as observed in your logs:
1. **Image Parsing and Challenge Request**: Watchtower parses the image reference (e.g., "docker.io/traefik/whoami:latest") and sends an initial request to the registry's /v2/ endpoint to check authentication requirements. This often results in a 401 response with a WWW-Authenticate header, providing details like the token realm (e.g., "https://auth.docker.io/token") and service ("registry.docker.io").
2. **Scope Setting and Credential Check**: It sets the authentication scope (e.g., "repository:traefik/whoami:pull") and attempts to load credentials from /config.json. In your case, "No credentials found" is logged, leading to an anonymous token request for public images.
3. **Token Acquisition and HEAD Request**: Using the challenge details, Watchtower requests a Bearer token (anonymously, since no credentials are provided) and performs a HEAD request on the manifest (e.g., "https://index.docker.io/v2/traefik/whoami/manifests/latest"). Your logs show successful retrieval of the remote digest without further errors.
4. **Digest Comparison**: The local and remote SHA256 digests are compared (e.g., both "sha256:200689790a0a0ea48ca45992e0450bc26ccab5307375b41c84dfc4f2475937ab" for traefik/whoami). A match means no update is needed, resulting in "No pull needed. Skipping image."

This flow confirms Watchtower is operating as intended, with no actual failures in fetching or comparing digests. The 401 is not a blocking error but a prompt for authentication, which proceeds successfully via anonymous access for these public repositories.<grok:render card_id="990323" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render> Community reports and GitHub discussions often misinterpret this as a problem, especially when rate limits are involved, but your logs indicate completion without warnings like "Could not do a head request."<grok:render card_id="e76920" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="cf3ce4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="8a5594" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render><grok:render card_id="ded9d0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>

Regarding the lack of pulls: Watchtower's update logic relies on digest changes.<grok:render card_id="964685" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render> For ":latest" tags, a new push to the repository updates the digest, triggering a pull. For fixed tags like ":1.71", the digest remains static unless the image publisher re-publishes under the same tag (uncommon for versioned releases). Your images' digests match the current remote ones, as verified against Docker Hub data:

| Container | Image | Local/Remote Digest | Status | Notes |
|-----------|-------|---------------------|--------|-------|
| /whoami | traefik/whoami:latest | sha256:200689790a0a0ea48ca45992e0450bc26ccab5307375b41c84dfc4f2475937ab | Up to date | Matches current Docker Hub manifest; no recent updates to this test image.<grok:render card_id="25dea3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render> |
| /warp-nat-gateway | caomingjun/warp:latest | sha256:fa4a4741f627fa75b337df88684e6ce4b5c975d18b6b7bc9554dfd1543fca1c2 | Up to date | Aligns with latest available; image for Cloudflare WARP client, last updated recently but no change since your pull.<grok:render card_id="ca54a3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">63</argument>
</grok:render> |
| /rclone | rclone/rclone:1.71 | sha256:fd635aecd9667ee3c3bf920d14118090d4f2a83a080c1fa77e0bafbd4587ca87 | Up to date | Fixed version tag from rclone v1.71.0 release (August 2025); no content changes post-release.<grok:render card_id="db9220" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">53</argument>
</grok:render> |

If updates aren't occurring as expected, consider that your setup might include only these three containers, or others may not be triggering due to similar matches. For broader monitoring, ensure no filters (e.g., via labels) are applied—your compose file shows none. To force a test update, edit an image tag in your compose file to an outdated version (e.g., change rclone to ":1.70"), run `docker-compose pull`, then revert and observe Watchtower's next cycle.

While your anonymous access works, Docker Hub's rate limits (100 container image pulls per 6 hours for unauthenticated IPs) can lead to intermittent 401 or 429 errors in high-volume setups.<grok:render card_id="7d608d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render><grok:render card_id="d3c3b2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render><grok:render card_id="3f8069" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render> Logging in increases this to 200, and paid plans offer more.<grok:render card_id="12bcc4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render> To configure credentials in Watchtower:<grok:render card_id="7296b5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render>
- Run `docker login` on the host machine.
- The credentials are stored in `~/.docker/config.json` (or equivalent path).
- Mount this in your docker-compose.yml as shown earlier.
- For Docker Hub specifically, the config.json entry uses "https://index.docker.io/v1/" as the registry key, with base64-encoded "username:password" in the "auth" field.

If you have private repositories, this step is mandatory, as anonymous access won't suffice and will consistently fail with 401 on the HEAD request.<grok:render card_id="a87f9b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="f03df6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render card_id="c75a52" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render> Your logs reference a /config.json, but it's empty or unmounted, leading to "No credentials found." Mounting the host's config resolves this.

In summary, no fundamental issue exists in your Watchtower container—it's correctly determining no updates are needed. If persistent problems arise (e.g., actual failures on HEAD requests), review rate limits or add authentication. For further debugging, check Watchtower's GitHub issues for similar cases, or increase verbosity if needed.<grok:render card_id="82a4bd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="3c2cc8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render> Resources like the official docs provide templates for advanced setups, including notifications (your config has WATCHTOWER_NOTIFICATION_URL empty, so consider adding for alerts).<grok:render card_id="678c1d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render>

### Key Citations
- [Watchtower use to update my docker hub containers, but now fails ...](https://github.com/containrrr/watchtower/discussions/1144)
- [401 Unauthorized - update from private dockerhub repo not possible](https://github.com/containrrr/watchtower/discussions/1129)
- [With containrrr/watchtower, Getting 401 and config.json not found](https://stackoverflow.com/questions/75807282/with-containrrr-watchtower-getting-401-and-config-json-not-found)
- [Whatchtower error when checking for updates : r/OpenMediaVault](https://www.reddit.com/r/OpenMediaVault/comments/qkawsx/whatchtower_error_when_checking_for_updates/)
- [Problem with Watchtower - Docker - Forum - openmediavault](https://forum.openmediavault.org/index.php?thread/42315-problem-with-watchtower/)
- [Watchtower -](https://containrrr.dev/watchtower/)
- [Registry authentication - Docker Docs](https://docs.docker.com/reference/api/registry/auth/)
- [How docker login works under the hood - Roaming Roadster - Medium](https://mirilittleme.medium.com/how-docker-login-works-under-the-hood-42225601843c)
- [Private registries - Watchtower](https://containrrr.dev/watchtower/private-registries/)
- [Watchtower use to update my docker hub containers, but now fails ...](https://github.com/containrrr/watchtower/discussions/1144)
- [Keep getting "You have reached your pull rate limit" - Docker Hub](https://forums.docker.com/t/keep-getting-you-have-reached-your-pull-rate-limit/100944)
- [toomanyrequests: You have reached your pull rate limit. You may ...](https://stackoverflow.com/questions/65806330/toomanyrequests-you-have-reached-your-pull-rate-limit-you-may-increase-the-lim)
- [Docker Hub usage and limits - Docker Docs](https://docs.docker.com/docker-hub/usage/)
- [401 Unauthorized - update from private dockerhub repo not possible · containrrr/watchtower · Discussion #1129](https://github.com/containrrr/watchtower/discussions/1129)
- [Watchtower use to update my docker hub containers, but now fails with 401 unauthorized error · containrrr/watchtower · Discussion #1144](https://github.com/containrrr/watchtower/discussions/1144)
- [Image Layer Details - traefik/whoami:latest | Docker Hub](https://hub.docker.com/layers/traefik/whoami/latest/images/sha256-7000846753fcc36eb2a1a3a21fe897da09c71e1d3b5381f912ea6e6e1c8871b6)
- [caomingjun/warp - Docker Image](https://hub.docker.com/r/caomingjun/warp)
- [Rclone v1.71.0 release](https://forum.rclone.org/t/rclone-v1-71-0-release/52322)
