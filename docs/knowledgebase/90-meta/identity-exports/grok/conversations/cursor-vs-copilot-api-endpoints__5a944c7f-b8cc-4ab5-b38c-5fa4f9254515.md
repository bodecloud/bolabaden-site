---
source_url: "https://grok.com/c/5a944c7f-b8cc-4ab5-b38c-5fa4f9254515"
conversation_id: "5a944c7f-b8cc-4ab5-b38c-5fa4f9254515"
title: "Cursor vs Copilot API Endpoints"
extracted_at: "2026-06-29T16:32:08.580Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Cursor vs Copilot API Endpoints

Source: [Grok conversation](https://grok.com/c/5a944c7f-b8cc-4ab5-b38c-5fa4f9254515)

## User

_Time: 2026-05-02T18:46:56.730Z_

v1 llm ai api endpoint that works for cursor subscription. Same question about copilot subscription.

## Assistant

_Time: 2026-05-02T18:47:35.348Z_

**Cursor Subscription (Pro/Pro+/Ultra plans):** Cursor does not expose a direct public **v1** OpenAI-compatible LLM API endpoint for its subscription-backed models in the same way providers like OpenAI or Anthropic do. Instead, it routes requests internally through its own backend when using subscription-included or "Cursor-managed" models.<grok:render card_id="982b6d" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">0</argument></grok:render>

### Key Details for Cursor
- **Primary API base**: `https://api.cursor.com` (used for Cloud Agents, analytics, team management, and some internal LLM orchestration).<grok:render card_id="09eeec" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">71</argument></grok:render><grok:render card_id="a9833b" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">3</argument></grok:render>
  - This is **not** a standard `/v1/chat/completions` endpoint for general LLM calls.
  - Cloud Agents API supports programmatic agent management (e.g., `/v0/agents`), but not raw chat completions for arbitrary models.<grok:render card_id="bc48d6" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">67</argument></grok:render>
- **How subscription models work in the IDE**: When you use Cursor Pro models (e.g., advanced Claude/GPT variants routed via Cursor), the IDE handles authentication and routing server-side. No public `v1` endpoint is directly usable outside the app for these.
- **Custom/BYOK (Bring Your Own Key) workaround** (common for extending subscription use):
  - In Cursor Settings → Models, enable "Override OpenAI Base URL" and point to any **OpenAI-compatible `/v1`** endpoint (e.g., `https://api.openai.com/v1`, OpenRouter, LiteLLM proxy, or custom proxies like WaveSpeed `https://llm.wavespeed.ai/v1`).<grok:render card_id="33e58c" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">1</argument></grok:render><grok:render card_id="f5b57c" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">5</argument></grok:render>
  - Subscription features (e.g., certain agents, higher limits) often still require a paid plan even with custom keys.<grok:render card_id="a0a985" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">4</argument></grok:render>
- **Reverse-engineered/internal notes**: Some community tools proxy or demo Cursor's internal paths (e.g., involving `/v1/chat` or gRPC-like services), but these are not officially supported or stable for production use.<grok:render card_id="a56d5d" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">87</argument></grok:render>

**For full access to subscription-powered frontier models with Cursor features**, use the IDE directly or proxies/LiteLLM that wrap Cursor's Cloud Agents where applicable.

**GitHub Copilot Subscription (Individual/Pro/Pro+ or Business/Enterprise):**

Copilot **does** expose internal OpenAI-compatible endpoints that the VS Code/JetBrains extensions (and some proxies) use. These are tied to your GitHub authentication (often via device/OAuth flow) rather than a simple API key.<grok:render card_id="5c5774" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">44</argument></grok:render>

### Key Endpoints for Copilot
- **Individual/Pro subscriptions**: `https://api.individual.githubcopilot.com/chat/completions` (main chat completions endpoint; also supports models list, etc.).<grok:render card_id="f2d11d" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">95</argument></grok:render><grok:render card_id="3f3315" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">46</argument></grok:render>
  - Variants: `https://api.githubcopilot.com/chat/completions` (older/legacy) or proxy endpoints like `proxy.individual.githubcopilot.com`.
- **Other plans**:
  - Business: `api.business.githubcopilot.com`
  - Enterprise: `api.enterprise.githubcopilot.com`<grok:render card_id="f9a55a" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">97</argument></grok:render>
- **Usage**: These expect specific headers/tokens from GitHub Copilot auth (not a raw OpenAI key). Community tools (e.g., LiteLLM with `github_copilot` provider, or custom proxies like `copilot-api`) can wrap them into a standard OpenAI-compatible `/v1/chat/completions` interface.<grok:render card_id="9c14fa" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">47</argument></grok:render><grok:render card_id="1cfaf4" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">44</argument></grok:render>
- **Limitations**: No official public API for arbitrary code generation outside IDE/extensions. REST APIs exist mainly for subscription management, usage metrics, and seat management (e.g., `/orgs/{org}/copilot/...`), not LLM inference.<grok:render card_id="cab51c" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">36</argument></grok:render><grok:render card_id="8779cb" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">38</argument></grok:render>

### Summary Comparison
| Aspect                  | Cursor Subscription                  | Copilot Subscription                          |
|-------------------------|--------------------------------------|-----------------------------------------------|
| **Main LLM Endpoint**  | Internal (via `api.cursor.com` + IDE routing); no public v1 for subscription models | `https://api.individual.githubcopilot.com/chat/completions` (or variants) |
| **OpenAI Compatible?** | Via custom override in settings     | Yes, via extensions/proxies (OAuth-based)    |
| **Best for Programmatic Use** | Cloud Agents API + custom proxies   | LiteLLM or community wrappers                |
| **Auth**               | Cursor API key (for agents) or provider keys | GitHub OAuth/device flow                     |
| **Subscription Tie-in**| Required for full features/limits   | Required for access (fair use limits)        |

**Recommendations**:
- For **Cursor**: Stick to the IDE for subscription value. Use OpenAI-compatible proxies (LiteLLM, OpenRouter, etc.) for custom models alongside it.<grok:render card_id="283a39" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">16</argument></grok:render>
- For **Copilot**: Explore LiteLLM's GitHub Copilot provider or tools like BYOKEY/copilot-api proxies to turn your subscription into a standard v1 endpoint.<grok:render card_id="5b5c8e" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">44</argument></grok:render>
- Always respect terms of service—reverse engineering or heavy proxying may violate usage policies.

If you need setup guides for a specific proxy (e.g., LiteLLM config) or more details on a plan type, provide additional context!

## User

_Time: 2026-05-02T18:49:50.588Z_

i'm asking how to setup a cursor/copilot subscription in something like litellm..... answer the question exactly.

## Assistant

_Time: 2026-05-02T18:49:58.912Z_

**For Cursor Subscription in LiteLLM (as a proxy for Cursor IDE):**

1. Get your Cursor API key from [cursor.com/settings](https://cursor.com/settings) (requires paid plan).

2. In LiteLLM UI/Dashboard: Go to **Models + Endpoints → LLM Credentials** → **Add Credential** → Select **Cursor** provider → Paste your Cursor API key.<grok:render card_id="ac25cb" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">104</argument></grok:render>

3. (Optional but recommended) Add models in your LiteLLM `config.yaml` or via UI if you want to route specific models through Cursor's backend.

4. Start LiteLLM Proxy (e.g., `litellm --config config.yaml`).

5. In **Cursor IDE** → Settings → Models:  
   - Enable **Override OpenAI Base URL**.  
   - Set it to your LiteLLM proxy with `/cursor` suffix, e.g.:  
     `https://your-litellm-proxy.com/cursor` (or `http://localhost:4000/cursor`).<grok:render card_id="80a543" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">103</argument></grok:render>

6. Paste a LiteLLM virtual key (created in LiteLLM Dashboard → Virtual Keys) into Cursor's OpenAI API Key field.

**Note**: This works well for Ask/Plan modes. Agent mode has limited support with custom proxies.

---

**For GitHub Copilot Subscription in LiteLLM:**

LiteLLM has native `github_copilot` provider support (uses OAuth device flow).

### Config Example (`config.yaml`)
```yaml
model_list:
  - model_name: copilot-claude
    litellm_params:
      model: github_copilot/claude-sonnet-4  # or gpt-4o, etc. (use models available in your Copilot plan)
  - model_name: copilot-gpt
    litellm_params:
      model: github_copilot/gpt-4o
```

### Setup Steps
1. Install LiteLLM proxy: `uv tool install 'litellm[proxy]'` (or pip).

2. Start the proxy with the config: `litellm --config config.yaml`.

3. On first use of a `github_copilot` model, LiteLLM will prompt you to authenticate via GitHub (device flow — open the link and authorize).<grok:render card_id="a0ec93" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">113</argument></grok:render>

4. Use it like any OpenAI-compatible endpoint:  
   ```python
   from litellm import completion
   response = completion(
       model="copilot-claude",
       messages=[{"role": "user", "content": "Hello"}]
   )
   ```
   Or point tools/IDEs to your LiteLLM base URL (`http://0.0.0.0:4000/v1`).

**To use in VS Code Copilot Chat**: Additional VS Code settings or extensions (like LiteLLM Connector for Copilot) can route Copilot to the LiteLLM proxy.<grok:render card_id="eda8b1" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">114</argument></grok:render>

This is the exact current setup based on LiteLLM documentation. Start the proxy, add credentials/models, and point your tool accordingly. Let me know if you hit a specific error.

## User

_Time: 2026-05-02T18:50:23.212Z_

v1 llm ai api endpoint that works for cursor subscription. Same question about copilot subscription. Actually web research to detemrine how people are doing this and what the standard is to access cursor WITHOUT using their cloud agents/ide.

## Assistant

_Time: 2026-05-02T18:51:34.224Z_

**Cursor and GitHub Copilot do not provide an official OpenAI-style `v1` LLM inference API (e.g., `/v1/chat/completions`, `/v1/models`) that lets subscribers directly call their subscription-backed models from custom code, scripts, or third-party tools without involving the Cursor IDE or Cloud Agents.**

This is the current state based on official documentation, pricing details, forum discussions, and community practices as of May 2026. Subscriptions are tightly coupled to the IDE experience (chat, Composer, agents, etc.) or specific agent orchestration features. Below, I break it down thoroughly for both products, including context on usage pools/quotas, official programmatic options, how the community actually works around this, nuances/edge cases, implications, and related considerations.

### Cursor Subscription and API Access
Cursor’s individual plans (Pro $20/mo, Pro+, Ultra) include two separate usage pools that reset monthly:
- **Auto + Composer pool**: For IDE features like chat, Composer, and fast/slow requests.
- **API pool**: Separate credits (e.g., $20 included on Pro, $70 on Pro+, $400 on Ultra) charged at the underlying model’s API rate (Claude, GPT, Gemini, etc.). Overages are pay-as-you-go.<grok:render card_id="dce216" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">2</argument></grok:render><grok:render card_id="01c06d" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">56</argument></grok:render>

These pools are **not** exposed via a general-purpose LLM API. Official Cursor APIs (all at `https://api.cursor.com`) are limited to:

- **Cloud Agents API** (beta, available on all plans): Programmatic management and execution of AI coding agents (create agent, launch run with prompt/repo, stream results, list models/repos, artifacts, webhooks, etc.). Endpoints are under `/v1/agents` (or similar). You authenticate with a user or service-account API key (`crsr_...` format) via Basic Auth (key as username, empty password). This is **not** raw chat completions — it’s for launching full agents that can edit code in repos. There is a `GET /v1/models` helper, but no inference endpoint.<grok:render card_id="761dca" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">0</argument></grok:render><grok:render card_id="a93606" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">55</argument></grok:render><grok:render card_id="9ed178" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">57</argument></grok:render>
- **Admin/Analytics/AI Code Tracking APIs**: Enterprise-only, for team management, usage dashboards, audit logs, etc. (not LLM calls).

**No official raw LLM `v1` endpoint exists.** Feature requests for OpenAI-compatible API support have been made on the Cursor forum, but none has been implemented.<grok:render card_id="875076" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">76</argument></grok:render>

**How people are actually doing it (community standard):**
The common workaround is **unofficial local proxies** that authenticate to your Cursor account (via OAuth/cookies/session tokens from a logged-in browser or IDE) and forward requests to Cursor’s internal backend, exposing a standard OpenAI-compatible `/v1/chat/completions` (plus models, streaming, tool calling). Examples include tools like `cursor-openai-api` (standalone CLI, OAuth login) and similar community proxies (some GitHub repos use your Cursor cookie as a Bearer token).<grok:render card_id="dd5e2d" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">74</argument></grok:render><grok:render card_id="390a34" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">79</argument></grok:render>

These run locally (often on `localhost:xxxx`) and let you point any OpenAI-compatible client (LangChain, custom scripts, other IDEs) at them while consuming your Cursor subscription quota/models. They are **not** official, require an active paid Cursor account, and typically need you to be logged in somewhere.

**Nuances and edge cases**:
- **Quota consumption**: Requests still hit your API or IDE pool depending on the model/route. Agent-specific features may not work outside the proxy.
- **TOS/risk**: Cursor’s terms tie usage to their platform/IDE. Reverse-engineering or external API use can lead to rate limits, bans, or account suspension (they explicitly warn against unauthorized subscriptions/resellers).<grok:render card_id="71d500" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">1</argument></grok:render>
- **BYOK alternative**: Cursor supports bringing your own OpenAI/Anthropic/Google keys in IDE settings (Models → provider). This bypasses Cursor’s pools entirely (you pay the provider directly) but still runs inside Cursor’s IDE. It does **not** give you a public endpoint and has limitations (e.g., some advanced agent/Composer features may require Cursor tokens even with BYOK).<grok:render card_id="134ff4" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">25</argument></grok:render><grok:render card_id="d6024f" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">7</argument></grok:render>
- **LiteLLM proxies**: Often used in the other direction (Cursor IDE → custom backend), not Cursor subscription → external.
- **Self-hosted agents**: Enterprise teams can force Cloud Agents API runs to self-hosted workers (via dashboard toggle), but this is still agent orchestration, not raw LLM calls, and requires infrastructure.

**Implications**: If your goal is pure LLM access for custom agents/scripts without Cursor’s IDE, the unofficial proxy route is what most power users adopt, but it’s fragile (breaks on backend changes) and carries compliance risk. For production/enterprise, the official Cloud Agents API + TypeScript SDK is the supported path (local or cloud runtime).

### GitHub Copilot Subscription and API Access
Copilot (Individual, Pro, Pro+, Business, Enterprise) has **no official public LLM inference API** for chat completions or model calls using your subscription. The only official REST APIs are for **management**:
- Billing, seats, teams, usage metrics, cloud agent policy, etc. (under `/orgs/{org}/copilot/...` or enterprise equivalents).<grok:render card_id="cc11ee" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">45</argument></grok:render><grok:render card_id="83d7ad" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">90</argument></grok:render>

Internal endpoints like `https://api.githubcopilot.com/chat/completions` exist and are used by the official VS Code/JetBrains/VS extensions, but they are **not documented or intended for external use**. There have been deprecations and changes to these internal proxy endpoints over time.<grok:render card_id="d090e5" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">87</argument></grok:render>

Copilot **does** support “bring your own key” (BYOK) for custom models in Chat/CLI (OpenAI-compatible, Azure, Anthropic, local Ollama/vLLM, etc.), but again, this uses *your* keys/providers, not Copilot’s subscription models/quotas.<grok:render card_id="839350" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">85</argument></grok:render><grok:render card_id="34e5ad" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">86</argument></grok:render>

**How people are actually doing it (community standard):**
Multiple mature **VS Code extensions** act as local API gateways. They leverage your active Copilot session (the official Copilot extension must be installed and signed in) to expose:
- OpenAI-compatible `/v1/chat/completions`, `/v1/models`, `/v1/embeddings`
- Sometimes Anthropic `/v1/messages`

Popular ones include `ericc-ch/copilot-api`, CopilotAPI Bridge, and GitHub Copilot API Gateway. You start a local server (e.g., `localhost:4000` or `:3030`), get a (local) API key if required, and point any tool at it. Models available match your Copilot plan (e.g., GPT-4o, Claude variants, etc.).<grok:render card_id="c4acd3" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">50</argument></grok:render><grok:render card_id="3d44a8" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">54</argument></grok:render><grok:render card_id="7dd511" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">40</argument></grok:render>

These are the de facto standard for integrating Copilot models into LangChain, Aider, custom agents, Claude Code, etc.

**Nuances and edge cases**:
- **Requires VS Code running**: The bridge runs inside the VS Code extension host (can be minimized/headless with auto-start settings).
- **Rate limits/security**: Extensions often add local rate limiting and API key auth.
- **TOS/risk**: Same as Cursor — external use of subscription models outside the intended IDE experience may violate GitHub’s terms (though many developers do it for personal tooling).
- **Enterprise controls**: Admins can set policies, but the bridges still work if the user has a seat.
- **Model availability**: Depends on your exact Copilot plan (Free/Pro/Enterprise).

**Implications**: For Copilot, the local-bridge approach is more polished and widely adopted than Cursor’s equivalents. It’s easier to set up and more stable because it re-uses the official extension’s auth rather than scraping cookies.

### Overall Recommendations and Related Considerations
- **If you want official support**: Use Cursor’s Cloud Agents API (for agentic workflows) or stick to the IDEs. Neither product positions itself as a general-purpose LLM API provider like OpenAI/Anthropic.
- **If you need raw LLM API access**: 
  - Use your own provider keys (OpenAI, Anthropic, Groq, Fireworks, etc.) directly — cheapest and fully supported in both tools via BYOK.
  - Or adopt the community proxies (local only, subscription-backed).
- **Security/privacy**: Local proxies keep data on your machine but still send prompts to the providers’ backends.
- **Alternatives for external access**: Tools like LiteLLM (proxy layer), OpenRouter, or self-hosted options (Ollama + Continue.dev in VS Code) are often cleaner long-term.
- **Cost/quotas**: Subscription pools are optimized for IDE usage; heavy external API hammering can lead to unexpected overages or throttling.
- **Future changes**: Both companies are expanding agentic capabilities (Cursor SDK, Copilot CLI/agents), so more programmatic options may emerge — but raw `v1` LLM endpoints are unlikely given their product focus.

In short, there is **no official `v1` endpoint** for either. The community has filled the gap with local OpenAI-compatible proxies that leverage your paid account. These work well for many developers but are unofficial workarounds with the usual risks. If your use case is strictly inside an IDE or agent orchestration, the official paths (Cloud Agents API for Cursor, VS Code extensions for Copilot) are the way to go. For anything else, consider direct LLM providers.
