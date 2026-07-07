---
source_url: "https://grok.com/c/a06b670b-45f9-45cf-a80c-4e8e3a3dccfa"
conversation_id: "a06b670b-45f9-45cf-a80c-4e8e3a3dccfa"
title: "GitHub Copilot Billing Switch Cuts Usage"
extracted_at: "2026-06-29T16:08:22.521Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# GitHub Copilot Billing Switch Cuts Usage

Source: [Grok conversation](https://grok.com/c/a06b670b-45f9-45cf-a80c-4e8e3a3dccfa)

## User

_Time: 2026-06-04T01:51:08.480Z_

i'm confused i just renewed my copilot subscription and it seems they changed the entire billing system, i'm getting like a tenth of the requests that i was getting last month. Please find any news/explanations/discussions on reddit/x about it. Why the fuck did they nerf copilot so heavily?

## Assistant

_Time: 2026-06-04T01:51:26.885Z_

**GitHub Copilot switched to usage-based billing (token/AI Credits) on June 1, 2026, replacing the old premium request units (PRUs).** This is almost certainly what you're experiencing right after renewal.<grok:render card_id="6fa575" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">1</argument></grok:render>

### What Changed
- **Old system (request-based)**: You had a monthly allowance of "premium requests." Each interaction with a premium model (like advanced Claude/GPT variants) consumed 1+ PRUs, with multipliers based on the model. Inline code completions were mostly unlimited. Many users could do dozens or hundreds of substantial chat/agent interactions per month.
- **New system (usage-based, live since June 1)**: Everything (except basic inline completions) is now metered by **tokens consumed** (input + output + cached) at per-model API rates, converted to **GitHub AI Credits** (1 credit ≈ $0.01 of usage).<grok:render card_id="3526cf" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">2</argument></grok:render>

  Your plan now includes a fixed monthly allotment of AI Credits:
  - **Copilot Pro** (~$10/mo): Around 1,000–1,500 credits (reports vary slightly on exact numbers).
  - Higher tiers (Pro+, etc.) get more proportionally.

  Unused credits **do not roll over**. Overages can be purchased or controlled via budgets.

This aligns usage with actual compute costs, which have risen sharply with more powerful (and expensive) models + agentic workflows. GitHub says the base subscription price didn't increase, but the *effective value* dropped for heavy users.<grok:render card_id="910fa4" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">7</argument></grok:render>

### Why It Feels Like a Heavy Nerf (1/10th the Requests)
- **Token consumption is much higher than old PRUs** for the same work, especially with:
  - Longer contexts.
  - Agentic modes / planning / multi-step tasks.
  - Powerful models (e.g., newer Claude Sonnet or Opus variants now have much higher effective multipliers/costs).
- Many users report **extreme burn rates**: 1–2 complex prompts or one small project review eating 15–60% of a month's credits. Some burn half their allocation in hours or a single day.<grok:render card_id="fc3675" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">12</argument></grok:render>
- Pre-June, there were already temporary rate limits and tighter enforcement to manage load ahead of the switch. The full token metering made it permanent and more visible/punishing.

**GitHub's rationale** (from their announcements and FAQs):
- Unsustainable "all-you-can-eat" model with exploding AI inference costs.
- Better alignment with real usage and fairness (light users subsidizing heavy ones less).
- Allows more predictable scaling and reduces abuse.
- They loosened some temporary limits post-switch but the credit system is the new baseline.<grok:render card_id="8d14bd" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">3</argument></grok:render>

Critics call it a **stealth price increase** or "end of the subsidized era." It was too good to last long-term as models got better (and costlier).<grok:render card_id="d727d2" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">11</argument></grok:render>

### Discussions on Reddit and X
**Reddit (r/GithubCopilot especially)**: Lots of frustration posts right after June 1. Common themes:
- "Burned half my monthly credits on ~8 normal coding requests."
- "One prompt ate 50% using Sonnet."
- "Thanking Copilot now consumes 3.5%."
- Cancellations, switches to Cursor/Claude/Codeium, or downgrading models.
- Complaints about poor visibility/pre-warnings before the switch.<grok:render card_id="f0858c" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">60</argument></grok:render>

Megathreads on rate limits from earlier in 2026 show this was building up for months.

**X/Twitter**: Similar backlash—posts about 2 requests eating 5% of Pro, calls to cancel, comparisons to better value elsewhere (Cursor, direct Claude, etc.). Some accept it as inevitable due to costs, but the sudden drop in usability after renewal stings.<grok:render card_id="c4c8b4" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">36</argument></grok:render>

### What You Can Do
1. **Check your usage dashboard** on GitHub — see exactly what's burning credits (models, features like code review which also hit Actions minutes).
2. **Set a budget** to cap overages.
3. **Optimize**: Use lighter models for simple tasks, combine prompts, avoid unnecessary agent loops, split big tasks.
4. **Consider alternatives** if it no longer fits your workflow: Cursor, Claude directly, Windsurf, etc., often praised for better value or unlimited-feeling plans for individuals.
5. If you're on an annual legacy plan, you might have a grace period, but monthly renewals hit the new system immediately.

This matches your description perfectly—renewal timing + sudden drop to ~1/10th effective usage. It's not a bug; it's the intended new normal. Many devs are in the same boat right now.
