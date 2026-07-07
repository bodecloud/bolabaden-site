---
source_url: "https://chatgpt.com/c/68ad82eb-dd24-8333-8d42-64fa521d6a53"
conversation_id: "68ad82eb-dd24-8333-8d42-64fa521d6a53"
title: "Regex for single dollar sign"
extracted_at: "2026-06-29T11:07:16.892Z"
message_count: 4
provenance: auth-ui
---

# Regex for single dollar sign

Source: [ChatGPT conversation](https://chatgpt.com/c/68ad82eb-dd24-8333-8d42-64fa521d6a53)

## User

write regex to find one dollarsign ($) if it's not proceeded by another dollarsign

## Assistant

You want a regex that matches a single dollar sign ($) only if it’s not preceded by another $.

Here’s the correct pattern:

(?<!\$)\$

Explanation:

(?<!\$) → Negative lookbehind. Ensures that the $ is not preceded by another $.

\$ → Matches a literal dollar sign.

Examples

Pattern: (?<!\$)\$

"Price is $5" → ✅ Matches $

"Cost is $$10" → ❌ Does not match the first $ (because it’s preceded by $), but ✅ matches the second $ only if you want.

"$$$" → Only the last two $ might match depending on context, since the first two are preceded by $.

👉 Do you want it to also ignore matches inside double-dollar signs ($$) completely (so it doesn’t match the second one either), or should it still match the second $ in $$?

## User

Does not work i tried something similar. The issue i'm having is anytime i tell it to find a $ and ensure it's not surrounded by another $, it matches the other side.

Like your regex is matching all of the $ in here

{{- /* TCP Section */}}
      tcp:
        routers:
        {{- $$tcpRouters := list }}
        {{- range $$c := . }}
          {{- range $$key, $$value := $$c.Labels }}
            {{- if hasPrefix $$key "traefik.tcp.routers." }}
              {{- $$tcpRouters = append $$tcpRouters 1 }}
              {{- $$name := trimPrefix "/" $$c.Name }}
              {{ printf "%s-tcp-with-failover:" $$name }}


specifically matching the first $, NOT the second, implying the multi-directional aspect is the issue
Show more

## Assistant

You’re right — checking only the left side ((?<!\$)\$) will still match the first $ of a $$ pair. You need to guard both sides:

(?<!\$)\$(?!\$)

(?<!\$) = not preceded by $

\$ = the dollar sign

(?!\$) = not followed by $

That will not match either $ in $$, so it won’t hit any of the dollars in your Helm/Go template snippet.

If your regex engine doesn’t support lookbehind (e.g., Go/RE2), use this instead and grab group 2 as the single $:

(^|[^$])(\$)(?!\$)

This matches a non-$ (or start of line) + the single $ (group 2) that isn’t followed by another $.

For replacements, keep the prefix with \1 and operate on \2 (the $).
