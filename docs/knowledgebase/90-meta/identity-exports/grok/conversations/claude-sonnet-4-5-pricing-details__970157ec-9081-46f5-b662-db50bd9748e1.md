---
source_url: "https://grok.com/c/970157ec-9081-46f5-b662-db50bd9748e1"
conversation_id: "970157ec-9081-46f5-b662-db50bd9748e1"
title: "Claude Sonnet 4.5 Pricing Details"
extracted_at: "2026-06-29T16:18:05.363Z"
message_count: 11
export_suite: "identity"
provenance: grok-rest-api
---

# Claude Sonnet 4.5 Pricing Details

Source: [Grok conversation](https://grok.com/c/970157ec-9081-46f5-b662-db50bd9748e1)

## User

_Time: 2025-11-18T03:26:02.335Z_

Price per each sonnet 4.5 request?

## Assistant

_Time: 2025-11-18T03:26:13.442Z_



## User

_Time: 2025-11-18T03:26:26.287Z_

Price per each sonnet 4.5 request? NOT 3.5. Claude Sonnet 4.5

## Assistant

_Time: 2025-11-18T03:27:02.530Z_

## Claude Sonnet 4.5 Basics

Claude Sonnet 4.5 comes from Anthropic's lineup, evolving from earlier Claude models like 3.5 Sonnet. It exists to push boundaries in agent-building and coding tasks, fixing slowdowns and weaker reasoning in older versions that struggled with complex chains of thought or large contexts.

## Pricing Model

No flat "per request" fee exists—costs tie to tokens processed, like in prior AI APIs. Tokens measure text chunks; longer inputs or outputs rack up higher bills. This setup beats older per-request models by charging only for actual compute used, avoiding overpay for short queries.

## Standard Rates

- Input: $3 per million tokens.<grok:render card_id="4ce274" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- Output: $15 per million tokens.<grok:render card_id="a74396" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>

For huge prompts over 200K tokens:

- Input jumps to $6 per million.<grok:render card_id="478c90" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>

## Real-World Cost Per Request

Varies wildly by request size. A simple one might cost cents; complex ones hit dollars. User reports show $0.05 to $0.11 per API call in practice, but that's anecdotal and token-dependent.<grok:render card_id="0f47b8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render>

## Why Token-Based?

Started with models like GPT-3 to fairly bill variable workloads. Fixed per-request pricing from early APIs ignored that, leading to waste or underuse. This way, you pay precisely for value extracted.

## Worth It?

If you're scaling agents or code gen beyond what 3.5 handled efficiently, yes—solves those bottlenecks. Otherwise, stick to cheaper tiers like Haiku for basics; they're objectively lighter on wallet and compute.

## User

_Time: 2025-11-18T03:27:33.585Z_

Do the math for me. 200k tokens per request times 80. How much does that cost?

## Assistant

_Time: 2025-11-18T03:27:41.335Z_

### Exact Math for 80 Requests at 200k Tokens Each

Every request here uses exactly 200k input tokens → triggers the **long-context pricing tier** ($6 / million input tokens).

- Input cost per request:  
  200,000 tokens ÷ 1,000,000 = 0.2 million tokens  
  0.2 × $6 = **$1.20 per request**

- Output cost:  
  You didn’t specify output size. If we assume zero output tokens (edge case), output = $0.  
  Realistic average output on Sonnet 4.5 is ~1k–4k tokens per call. Let’s use 2k as a middle guess:  
  2,000 tokens = 0.002 million × $15 = **$0.03 per request**

#### Total per request (with 2k output)
$1.20 input + $0.03 output = **$1.23**

#### For 80 requests
80 × $1.23 = **$98.40**

#### Worst-case (if output is huge, say 10k tokens each)
10k output = $0.15 per request → total per request $1.35 → 80 × $1.35 = **$108**

#### Best-case (zero output)
80 × $1.20 = **$96 flat**

So you’re looking at **$96–$108** for 80 requests of 200k tokens each, depending on how wordy the responses are.

That’s it. No hidden fees, no cache credits applied here.

## User

_Time: 2025-11-18T03:27:53.789Z_

Do the math for me. 200k tokens per request times 80. How much does that cost? Assume output tokens requested were its max

## Assistant

_Time: 2025-11-18T03:28:47.072Z_



## User

_Time: 2025-11-18T03:29:07.280Z_

Do the math for me. 200k tokens per request times 80. How much does that cost? Assume output tokens requested were its max. Under ZERO circumstances do NOT EVER use 3.5 pricing

## Assistant

_Time: 2025-11-18T03:29:54.437Z_



## Assistant

_Time: 2025-11-18T03:33:39.228Z_

## Input Tokens Breakdown

200k input per request × 80 requests = 16 million input tokens total.

Large-context rate ($6 per million input, as we're using the "huge prompt" tier you implied with "4.5").

Cost: 16 × $6 = $96 exact.

## Output Tokens Breakdown

API max output is 8192 tokens per request (Claude cap, even on newest versions).

80 × 8192 = 655,360 output tokens.

At $15 per million output: ≈ $9.83.

But with 200k input and only 200k context window, real output drops hard — likely 500-2000 tokens max per request before hitting limit.

Realistic output cost: $3-$10 total.

## Total Cost

$100-$106 range.

$96 of it is pure input.

## Realist Take

$100 for 80 full-context shots is nothing if the task actually needs the full 200k each time.

But if these 80 requests share the same big context (which they probably do), you're throwing money away by not caching.

Caching exists precisely because paying $1.2 input every single time is braindead for repeated context.

Cache once: pay ~$1.5 premium on first hit, then $0.30 per million on reads ($0.06 per request) for the rest.

79 × $0.06 = $4.74 + output.

Total under $20.

Objectively better in every way if the context repeats.

Use caching or keep burning cash — your call, but one is smarter.
