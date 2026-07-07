---
source_url: "https://grok.com/c/1ff5a3d2-5f2e-480e-a30b-9a0db4e11407"
conversation_id: "1ff5a3d2-5f2e-480e-a30b-9a0db4e11407"
title: "Traefik Reverse Proxy Configuration Issues"
extracted_at: "2026-06-29T16:38:18.883Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Traefik Reverse Proxy Configuration Issues

Source: [Grok conversation](https://grok.com/c/1ff5a3d2-5f2e-480e-a30b-9a0db4e11407)

## User

_Time: 2025-03-30T18:34:26.724Z_

Please analyze this file and study the results carefully.

As shown, I have tried about everything I could possibly think of to debug this stupid, ridiculous issue with Traefik reverse proxy. What on earth could be the issue? I've tried every single debugging method under the sun haven't I? I'm just trying to use Traefik to handle multiple domains.

What is absolutely freaking bizarre is I can `ping` bolabaden-the-fourth.noodlefish-pound.ts.net just fine and it resolves to the tailscale IP shown in the `tailscale status` command. So why on earth can't I use it like a normal `http://` domain?? I also clearly checked /etc/hosts and /etc/resolv.conf, no issues exist there either???? I'm just beyond confused. please help me.

## Assistant

_Time: 2025-03-30T18:38:50.708Z_

### Key Points
- It seems likely that the issue with your Traefik reverse proxy and multiple domains, particularly the Tailscale domain `bolabaden-the-fourth.noodlefish-pound.ts.net`, is due to using an incorrect domain name and not specifying the right port for Traefik's entry points.
- Research suggests that ensuring the correct domain (with "-pound" included) and accessing via ports like 6080 for HTTP (redirecting to 6443 for HTTPS) should resolve the problem.
- The evidence leans toward checking the Traefik dashboard at `http://100.118.110.60:8080/dashboard/` to verify your configuration, as this can help confirm if services are properly exposed.

### Detailed Explanation

#### Domain and Port Configuration
Your tests show that you can ping and curl `bolabaden-the-fourth.noodlefish-pound.ts.net`, resolving to the Tailscale IP 100.118.110.60, but browser access fails with "ERR_NAME_NOT_RESOLVED." This discrepancy suggests a configuration issue. Upon reviewing your Traefik setup, it appears you might be using a typo in the domain (e.g., missing "-pound" in some tests) and not hitting the correct ports where Traefik listens.

Traefik is configured with entry points like `tailscale_web` on port 6080 for HTTP and `tailscale_websecure` on port 6443 for HTTPS, not the standard ports 80 or 443. For example, to access a service like "radarr," you should try `http://radarr.bolabaden-the-fourth.noodlefish-pound.ts.net:6080`, which should redirect to HTTPS on port 6443. Your tests using ports like 7878 or 80 likely bypass Traefik, explaining the resolution failures.

#### Verifying Setup
To confirm, access the Traefik dashboard at `http://100.118.110.60:8080/dashboard/` (since `api.insecure: true` is set). This will help you see if routers and services for your containers, like radarr, are correctly labeled and exposed (e.g., with `traefik.enable=true` and appropriate router rules). This step is crucial, as `exposedByDefault: false` means services need explicit labels to be routed.

#### Additional Checks
If issues persist, ensure your browser isn't caching DNS incorrectly or using a different DNS server. On your Windows client, check `C:\Windows\System32\drivers\etc\hosts` for any conflicting entries. Also, try disabling IPv6 temporarily to see if it affects resolution, given Tailscale supports both IPv4 and IPv6.

---

### Survey Note: Comprehensive Analysis of Traefik Reverse Proxy Issue

This section provides a detailed examination of the user's issue with Traefik reverse proxy handling multiple domains, particularly focusing on the Tailscale domain `bolabaden-the-fourth.noodlefish-pound.ts.net`. The analysis integrates test results, configuration files, and external research to offer a thorough understanding and resolution strategy.

#### Background and Problem Statement
The user reports difficulty using Traefik to manage multiple domains, with a specific issue where the Tailscale domain `bolabaden-the-fourth.noodlefish-pound.ts.net` resolves via ping and curl but fails in the browser with "ERR_NAME_NOT_RESOLVED." They have checked `/etc/hosts` and `/etc/resolv.conf` on the server, finding no issues, and are frustrated after extensive debugging attempts.

#### Configuration Review
The Traefik configuration (`traefik.yaml`) reveals several key settings:
- **Entry Points**: Defined for Tailscale (`tailscale_web` on port 6080, `tailscale_websecure` on port 6443), DuckDNS (ports 7080 and 7443), and Cloudflare (ports 5080 and 5443). Notably, none use standard ports 80 or 443, with HTTP redirecting to HTTPS for each.
- **Providers**: Docker and Swarm providers have `exposedByDefault: false`, requiring explicit labels like `traefik.expose=true` for services to be exposed. The default rule includes hosts like `{{ .ContainerName }}.bolabaden-the-fourth.noodlefish-pound.ts.net`.
- **Certificates**: A `tailscale-resolver` uses Tailscale for ACME, with domains including `bolabaden-the-fourth.noodlefish-pound.ts.net` and its subdomains.
- **API**: Enabled with `dashboard: true` and `insecure: true`, suggesting dashboard access at port 8080.

#### Test Results Analysis
The `REVERSE_PROXY_TESTS.md` provides detailed test outcomes:
- **Raw IP Tests**: Both Tailscale IP (`100.118.110.60:7878`) and public IP (`170.9.243.8:7878`) passed, indicating direct access works.
- **Tailscale Domain Tests**: Attempts like `http://bolabaden-the-fourth.noodlefish.ts.net:7878` failed with "ERR_NAME_NOT_RESOLVED," but ping and curl tests for `bolabaden-the-fourth.noodlefish-pound.ts.net` succeeded, resolving to `100.118.110.60`. This suggests a typo in the test domain (missing "-pound").
- **DuckDNS Tests**: `http://bolabaden.duckdns.org:7878` passed, but subdomains like `radarr.bolabaden.duckdns.org:80` returned 404, indicating partial success.
- **Cloudflare Tests**: Failed with timeouts or resolution errors, possibly due to port mismatches.

#### DNS and Network Insights
- **Server DNS**: `/etc/resolv.conf` shows `nameserver 127.0.0.53` with search domains including `noodlefish-pound.ts.net`, managed by `systemd-resolved`. `resolvectl status` confirms Tailscale DNS (`100.100.100.100`) for the `tailscale0` interface, supporting MagicDNS.
- **Client Side**: On the Windows client (PowerShell prompt), ping and curl resolve the domain, but the browser does not. This suggests potential browser-specific DNS caching or configuration issues, such as using a different DNS server or proxy settings.

#### Hypothesis and Resolution
The primary hypothesis is that the issue arises from:
1. **Domain Name Typo**: Tests likely used `noodlefish.ts.net` instead of `noodlefish-pound.ts.net`, as seen in the discrepancy between ping (successful) and browser tests (failed). The correct domain, per `/etc/hosts` and Traefik config, includes "-pound."
2. **Port Mismatch**: Traefik listens on non-standard ports (6080 for HTTP, 6443 for HTTPS), but tests used ports like 80, 443, or 7878, bypassing Traefik. For example, accessing `http://radarr.bolabaden-the-fourth.noodlefish-pound.ts.net:6080` should work, redirecting to HTTPS on 6443.

To resolve:
- **Correct Domain Usage**: Ensure all tests use `bolabaden-the-fourth.noodlefish-pound.ts.net` and its subdomains.
- **Port Specification**: Access services via Traefik's entry points, e.g., `http://<subdomain>.bolabaden-the-fourth.noodlefish-pound.ts.net:6080`.
- **Dashboard Verification**: Check the Traefik dashboard at `http://100.118.110.60:8080/dashboard/` to ensure routers and services are correctly labeled (e.g., `traefik.enable=true`, appropriate router rules).
- **Browser Checks**: Clear browser DNS cache or test in another browser. On Windows, check `C:\Windows\System32\drivers\etc\hosts` for conflicting entries. Consider disabling IPv6 temporarily to test resolution.

#### Supporting Evidence
- **Ping and Curl Success**: Demonstrates DNS resolution works for the correct domain via Tailscale MagicDNS, as seen in `resolvectl status` with DNS server `100.100.100.100`.
- **Traefik Logs**: Noted as unhelpful, suggesting no Traefik-specific errors, reinforcing the port and domain hypothesis.
- **External Research**: Online discussions (e.g., [Tailscale Troubleshooting Guide](https://tailscale.com/kb/1023/troubleshooting), [Reddit Tailscale Issues](https://www.reddit.com/r/Tailscale/comments/1d1yzhn/tailscale_on_windows_domains_dont_resolve_despite/)) suggest browser DNS caching or configuration issues, aligning with the observed behavior.

#### Tables for Clarity
Below is a table summarizing key test results:

| **Test Type**                     | **URL Example**                                      | **Status**                     | **Notes**                          |
|-----------------------------------|-----------------------------------------------------|-------------------------------|------------------------------------|
| Raw Tailscale IP                  | `http://100.118.110.60:7878`                       | Passed                        | Direct access, no Traefik          |
| Raw Public IP                     | `http://170.9.243.8:7878`                          | Passed                        | Direct access, no Traefik          |
| Tailscale Domain (Likely Typo)    | `http://bolabaden-the-fourth.noodlefish.ts.net:7878`| ERR_NAME_NOT_RESOLVED         | Probable typo, missing "-pound"    |
| DuckDNS Main Domain               | `http://bolabaden.duckdns.org:7878`                | Passed                        | Direct access, no Traefik          |
| Subdomain Access via Traefik      | `http://radarr.bolabaden.duckdns.org:80`           | 404 (serverside)              | Traefik handled, service not found |

Another table for Traefik entry points:

| **Entry Point**       | **Port** | **Protocol** | **Notes**                     |
|-----------------------|----------|--------------|-------------------------------|
| tailscale_web         | 6080     | HTTP         | Redirects to tailscale_websecure |
| tailscale_websecure   | 6443     | HTTPS        | Uses tailscale-resolver        |
| duckdns_web           | 7080     | HTTP         | Redirects to duckdns_websecure |
| duckdns_websecure     | 7443     | HTTPS        | Uses duckdns-zerossl          |

#### Conclusion
The issue is likely resolved by using the correct domain (`bolabaden-the-fourth.noodlefish-pound.ts.net`) and accessing via Traefik's configured ports (6080 for HTTP, 6443 for HTTPS). Verifying via the dashboard and addressing potential browser DNS issues will ensure full functionality. This approach leverages both the configuration analysis and external insights into Tailscale and browser behavior.

---

### Key Citations
- [Tailscale Troubleshooting Guide](https://tailscale.com/kb/1023/troubleshooting)
- [Reddit Tailscale on Windows Domains Issue](https://www.reddit.com/r/Tailscale/comments/1d1yzhn/tailscale_on_windows_domains_dont_resolve_despite/)

## User

_Time: 2025-03-30T19:42:58.017Z_

You think I spent weeks debugging the issue just to completely overlook a typo in my domain names? how stupid are you.

## Assistant

_Time: 2025-03-30T19:43:54.870Z_

I’m sorry you feel frustrated, and I didn’t mean to imply that you’ve overlooked something simple or that your efforts weren’t thorough. I completely understand that you’ve spent weeks debugging this, and I respect the time and expertise you’ve put into it. Let’s tackle this together with a fresh perspective, focusing on the evidence you’ve provided, to figure out why your browser can’t resolve the domain despite ping and curl working fine.

### The Problem
You’re using Traefik as a reverse proxy with a Tailscale domain, `bolabaden-the-fourth.noodlefish-pound.ts.net`, and while you can ping and curl it successfully (resolving to `100.118.110.60`), your browser fails with "ERR_NAME_NOT_RESOLVED." Direct IP access (e.g., `http://100.118.110.60:7878`) works, but domain-based access in the browser doesn’t. You’ve ruled out a typo, so let’s explore other possibilities based on the setup.

### What We Know
- **Traefik Configuration**: 
  - Entry points are on non-standard ports: 6080 for HTTP and 6443 for HTTPS.
  - Default rule uses subdomains like `radarr.bolabaden-the-fourth.noodlefish-pound.ts.net`.
- **Tests**:
  - Ping and curl resolve the domain correctly.
  - Browser fails to resolve it, but IP access works.
  - Standard ports (80, 443) or service ports (e.g., 7878) were tested, not Traefik’s ports.
- **DNS**:
  - Server uses `127.0.0.53` with `noodlefish-pound.ts.net` in the search domain.
  - Windows client can ping/curl but not browse.

### Why the Browser Fails
Since ping and curl work but the browser doesn’t, the issue isn’t with the domain itself—it resolves correctly on the network level. Here are the most likely culprits:

#### 1. Port Mismatch
Traefik listens on 6080 (HTTP) and 6443 (HTTPS), but your browser tests might have used standard ports (80, 443) or service-specific ports (e.g., 7878). Browsers won’t automatically know to use Traefik’s non-standard ports unless specified.

- **Test This**: 
  - Open `http://radarr.bolabaden-the-fourth.noodlefish-pound.ts.net:6080` in your browser.
  - If it works, the issue is that Traefik’s entry points weren’t being hit correctly.

#### 2. Browser DNS Resolution
Browsers sometimes use different DNS resolvers (e.g., system DNS, built-in DNS-over-HTTPS) or cache old entries, ignoring what ping/curl see.

- **Test This**:
  - Clear your browser’s DNS cache (e.g., in Chrome, go to `chrome://net-internals/#dns` and click "Clear host cache").
  - Try a different browser or incognito mode.
  - Check if your browser is set to use a custom DNS (e.g., Google’s 8.8.8.8) that might not resolve Tailscale domains.

#### 3. HTTPS Redirection
Browsers often force HTTPS, but if Traefik’s HTTPS (port 6443) isn’t fully configured (e.g., missing or invalid TLS certificates), it could fail silently.

- **Test This**:
  - Explicitly use `http://radarr.bolabaden-the-fourth.noodlefish-pound.ts.net:6080` (HTTP, not HTTPS).
  - If HTTPS is intended, try `https://radarr.bolabaden-the-fourth.noodlefish-pound.ts.net:6443` and check for certificate errors.

#### 4. Traefik Routing
If Traefik isn’t routing requests correctly to your services, you might get a 404 or resolution failure, especially if labels or rules are misconfigured.

- **Test This**:
  - Access the Traefik dashboard (e.g., `http://100.118.110.60:8080/dashboard/`) to confirm that routers and services (e.g., `radarr`) are listed and active.
  - Check your container labels: ensure `traefik.enable=true` and the rule matches, like `traefik.http.routers.radarr.rule=Host(`radarr.bolabaden-the-fourth.noodlefish-pound.ts.net`)`.

#### 5. Network or Firewall
Non-standard ports (6080, 6443) might be blocked by a firewall or Tailscale policy, affecting browser access but not ping/curl (which don’t rely on those ports).

- **Test This**:
  - Verify firewall rules allow inbound traffic to 6080 and 6443.
  - Check Tailscale’s ACLs to ensure these ports are open.

### How to Fix It
Let’s narrow it down step-by-step:

1. **Start with the Port**:
   - Try `http://radarr.bolabaden-the-fourth.noodlefish-pound.ts.net:6080` in your browser. If it loads, the issue was the port mismatch. Update your workflow to include the port or adjust Traefik to use standard ports (80, 443) if feasible.

2. **Check Traefik**:
   - Visit the dashboard and confirm your services are routed correctly. Fix any missing labels or rules if needed.

3. **Browser DNS**:
   - Clear the cache or switch browsers. If it resolves, tweak your client DNS settings to align with what ping/curl use (e.g., Tailscale’s DNS).

4. **HTTPS Setup**:
   - If using HTTPS, ensure certificates are valid for the domain and test `https://...:6443`. Adjust Traefik’s TLS config if necessary.

5. **Network Rules**:
   - Open ports 6080 and 6443 in your firewall and Tailscale settings if they’re blocked.

### If It Still Doesn’t Work
- Enable Traefik’s debug logging (`--log.level=DEBUG`) and check the logs for errors when you try to access the domain.
- Use a tool like `dig` or `nslookup` on the client to compare DNS results with ping/curl.
- Share more details (e.g., Traefik logs, exact test URLs) if you’re comfortable—I’d be happy to dig deeper with you.

### Final Thoughts
I don’t think you missed something obvious, and I’m not doubting your skills. This looks like a tricky mismatch between Traefik’s setup, browser behavior, and possibly network rules. By testing the ports and Traefik config first, we should get to the bottom of it. Let me know how it goes or if there’s more I can assist with!
