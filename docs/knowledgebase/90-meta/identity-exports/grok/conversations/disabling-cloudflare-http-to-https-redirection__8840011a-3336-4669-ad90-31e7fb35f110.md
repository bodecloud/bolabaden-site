---
source_url: "https://grok.com/c/8840011a-3336-4669-ad90-31e7fb35f110"
conversation_id: "8840011a-3336-4669-ad90-31e7fb35f110"
title: "Disabling Cloudflare HTTP to HTTPS Redirection"
extracted_at: "2026-06-29T16:38:16.514Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Disabling Cloudflare HTTP to HTTPS Redirection

Source: [Grok conversation](https://grok.com/c/8840011a-3336-4669-ad90-31e7fb35f110)

## User

_Time: 2025-08-14T05:43:37.464Z_

how to tell cloudflare in 2025 to stop redirecting http to https automatically

## Assistant

_Time: 2025-08-14T05:44:19.905Z_

To disable the automatic redirection from HTTP to HTTPS in Cloudflare, you must turn off the "Always Use HTTPS" feature, which is responsible for redirecting all visitor requests from HTTP to HTTPS across your domain's subdomains and hosts.<grok:render card_id="3f5ec3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render> This setting is available in the Cloudflare dashboard for Free, Pro, Business, and Enterprise plans, provided your SSL/TLS encryption mode is not set to "Off" (in which case the option will not be visible).<grok:render card_id="18c832" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>

Follow these steps to disable it:

1. Log in to your Cloudflare account and navigate to the specific domain at https://dash.cloudflare.com.<grok:render card_id="da1119" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>

2. In the SSL/TLS section, select "Overview" and confirm that the SSL/TLS encryption mode is set to a level other than "Off" (e.g., Flexible, Full, or Full (strict)). If it is set to "Off," adjust it accordingly to make the "Always Use HTTPS" option appear.<grok:render card_id="efa938" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>

3. Proceed to SSL/TLS > Edge Certificates.<grok:render card_id="917b72" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>

4. Locate the "Always Use HTTPS" toggle and switch it to "Off."<grok:render card_id="50df43" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>

After disabling this feature, Cloudflare will no longer perform automatic HTTP to HTTPS redirects.<grok:render card_id="dd6ba5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render> However, if redirections persist, investigate other potential causes such as custom Page Rules, HTTP Strict Transport Security (HSTS) configurations, or redirects implemented at your origin server, as these may independently enforce HTTPS.<grok:render card_id="a52362" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">3</argument>
</grok:render><grok:render card_id="a63e70" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render> Cloudflare advises against configuring redirects at the origin server to prevent potential redirect loops.<grok:render card_id="6bbfe3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>

If you require selective enforcement of HTTPS (e.g., only for certain paths), consider using Page Rules or Transform Rules instead of relying on the global "Always Use HTTPS" setting.<grok:render card_id="51638c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render> For the most current guidance, consult Cloudflare's official documentation or support resources, as configurations may evolve.
