---
source_url: "https://grok.com/c/dc7abf50-295a-4812-ad18-845bf443e180"
conversation_id: "dc7abf50-295a-4812-ad18-845bf443e180"
title: "xAI Grok API DeepSearch Usage, Pricing"
extracted_at: "2026-06-29T16:18:54.624Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# xAI Grok API DeepSearch Usage, Pricing

Source: [Grok conversation](https://grok.com/c/dc7abf50-295a-4812-ad18-845bf443e180)

## User

_Time: 2025-11-02T10:54:08.088Z_

how to use xAI grok's deepsearch functionality from the API and what's the pricing like? I have the SuperGrok subscription and am hoping I can use its benefits from the api.

## Assistant

_Time: 2025-11-02T10:54:21.918Z_

For details on using Grok's DeepSearch via the xAI API, including pricing and SuperGrok benefits, visit https://x.ai/api. For SuperGrok subscription info, see https://x.ai/grok.

## User

_Time: 2025-11-02T10:54:37.517Z_

how to use xAI grok's deepsearch functionality from the API and what's the pricing like? I have the SuperGrok subscription and am hoping I can use its benefits from the api. Please be as exhaustive and detailed as you possibly can, do not simply link me to a page with the information

## Assistant

_Time: 2025-11-02T10:55:54.491Z_

### DeepSearch in xAI Grok API

DeepSearch appears to refer to Grok's advanced search feature, known as "Live Search" in the API docs. It's an agentic search capability integrated into Grok models (e.g., Grok 4) for real-time web and X data retrieval. The legacy Live Search API will deprecate by Dec 15, 2025; use the chat completions endpoint instead.

#### Usage from API

Access via xAI API's chat completions endpoint (POST to /chat/completions). Enable by adding `search_parameters` object in request body. Authentication uses API key (generate from xAI console; set in Authorization header as Bearer token).

**Request Format (JSON):**
- `model`: e.g., "grok-4" (required).
- `messages`: Array of message objects (role: system/user/assistant, content).
- `search_parameters`: Object to enable search.
  - `mode`: "auto" (model decides; default), "on" (force search), "off" (disable).
  - `sources`: Array of source objects (default: ["web", "news", "x"]).
    - Each: `{ "type": "web/news/x/rss", ...params... }`.
  - `from_date`: ISO8601 date (e.g., "2025-01-01") for start range.
  - `to_date`: ISO8601 date for end range.
  - `max_search_results`: Int (default 20; limits sources fetched).
  - `return_citations`: Bool (default true; includes URLs in response).

**Source-Specific Parameters:**
- **web**: General web search.
  - `country`: ISO alpha-2 code (e.g., "US").
  - `excluded_websites`: Array of up to 5 domains (e.g., ["example.com"]).
  - `allowed_websites`: Array of up to 5 domains (mutually exclusive with excluded).
  - `safe_search`: Bool (default true; disable for unrestricted).
- **news**: News sources.
  - Same as web: country, excluded_websites, safe_search (no allowed_websites).
- **x**: X (Twitter) posts.
  - `included_x_handles`: Array of up to 10 usernames (e.g., ["elonmusk"]).
  - `excluded_x_handles`: Array of up to 10 (mutually exclusive; "grok" auto-excluded unless included).
  - `post_favorite_count`: Min int for likes.
  - `post_view_count`: Min int for views.
- **rss**: RSS feeds.
  - `links`: Array (max 1 URL currently, e.g., ["https://example.com/rss"]).

**Example Request (Python SDK):**
```python
from xai import Client
client = Client(api_key="your_api_key")
response = client.chat.completions.create(
    model="grok-4",
    messages=[{"role": "user", "content": "Latest news on AI?"}],
    search_parameters={
        "mode": "on",
        "sources": [
            {"type": "news", "country": "US", "safe_search": False},
            {"type": "x", "included_x_handles": ["xAI"]},
            {"type": "web", "allowed_websites": ["x.ai"]},
            {"type": "rss", "links": ["https://x.ai/rss"]}
        ],
        "from_date": "2025-10-01",
        "to_date": "2025-11-01",
        "max_search_results": 10,
        "return_citations": True
    }
)
print(response.choices[0].message.content)
```

**Response Structure:**
- `id`: Completion ID.
- `choices`: Array with message (role: assistant, content: generated text).
- `usage`: Object with `prompt_tokens`, `completion_tokens`, `num_sources_used` (search sources count).
- `citations`: Array of URLs (if enabled; in last streaming chunk if streaming).

**Streaming:** Set `stream: true`. Citations/usage in final chunk.

**Setup/Prerequisites:**
- Sign up at x.ai/api, get API key.
- Install SDK: `pip install xai-sdk`.
- No internet access needed beyond API calls; handles real-time data internally.
- Rate limits: Not detailed in docs; monitor via console (tier-based, e.g., RPM/TPM vary by plan).

**Integration with Tools:** Native in Grok 4; combines with agentic tool calling for chained reasoning (e.g., search then code execution). Use in workflows like RAG or agents.

**Limits:**
- Max 20 sources default (adjustable via param).
- Source params: 5 websites max exclude/allow, 10 handles for X, 1 RSS link.
- Context window: Model-dependent (e.g., Grok 4: 256k tokens).
- No min commitments; pay-as-you-go.

#### Pricing

API is usage-based, separate from subscriptions. No free tier mentioned.

**Model Token Pricing (per million tokens):**
- Grok 4: Input $3, Output $15.<grok:render card_id="c84654" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>
- Grok 4 Fast Reasoning/Non-Reasoning: Input $0.20, Output $0.50.
- Other models: Vary (e.g., Grok 3: Input $3, Output $15; Grok 3 Mini: Input $0.30, Output $0.50).

**Search-Specific Pricing:** $25 per 1,000 sources used ($0.025 each). Billed via `num_sources_used` in response.<grok:render card_id="b02d2c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render>
Large contexts: Input $6, Output $30 per million.

Billing: Prepaid credits or card; details in console. No taxes/refunds specified.

#### SuperGrok Subscription Benefits for API

SuperGrok ($30/month or $300/year) provides unlimited Grok 3 access on grok.com/x.com/apps, including DeepSearch/Live Search, advanced tools, and Grok 4 access.<grok:render card_id="c88381" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render card_id="9b7843" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render> However, API is separate; no direct discounts, credits, or benefits apply. API access requires separate signup and pays per token/sources used. SuperGrok enables Grok 4 on platform but not reduced API costs.<grok:render card_id="990f76" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render><grok:render card_id="6b508a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render> For API savings, use efficient models or limit searches.
