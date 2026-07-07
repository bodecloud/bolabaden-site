---
source_url: "https://grok.com/c/9f740774-e8ae-40e2-82b8-14da20d8c0ca"
conversation_id: "9f740774-e8ae-40e2-82b8-14da20d8c0ca"
title: "Open Source AI Market Bots"
extracted_at: "2026-06-29T16:08:55.324Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Open Source AI Market Bots

Source: [Grok conversation](https://grok.com/c/9f740774-e8ae-40e2-82b8-14da20d8c0ca)

## User

_Time: 2026-05-19T14:31:44.080Z_

```

Merenos — 9:26 AM
You want to make money?

Make an AI that tracks the records of investments of politicians, then give recommendations based on that weighted by their gains in the last year.

It's public record and several have been doubling their money year after year

If they buy, it should push a buy notification 
If they sell, it should push a sell notification 
Actually, the only part that would require AI is probably the gathering and parsing of their documents
th3w1zard1 PuritanWizard [BIRB], 
 — 9:28 AM
those already exist lol
why do you think i'm retired
Merenos — 9:29 AM
Lol
I know they exist
I just want one too.
😛
th3w1zard1 PuritanWizard [BIRB], 
 — 9:30 AM
well you don't want mine but do you want me to find you one lol?
Merenos — 9:30 AM
Sure?
th3w1zard1 PuritanWizard [BIRB], 
 — 9:30 AM
probably should keep updated anyway 😛
```

Please search exclusively x/reddit for open source llm/ai based market bot that actually works well. Search thoroughly.

## Assistant

_Time: 2026-05-19T14:32:42.776Z_



## User

_Time: 2026-05-19T14:33:14.447Z_

```

Merenos — 9:26 AM
You want to make money?

Make an AI that tracks the records of investments of politicians, then give recommendations based on that weighted by their gains in the last year.

It's public record and several have been doubling their money year after year

If they buy, it should push a buy notification 
If they sell, it should push a sell notification 
Actually, the only part that would require AI is probably the gathering and parsing of their documents
th3w1zard1 PuritanWizard [BIRB], 
 — 9:28 AM
those already exist lol
why do you think i'm retired
Merenos — 9:29 AM
Lol
I know they exist
I just want one too.
😛
th3w1zard1 PuritanWizard [BIRB], 
 — 9:30 AM
well you don't want mine but do you want me to find you one lol?
Merenos — 9:30 AM
Sure?
th3w1zard1 PuritanWizard [BIRB], 
 — 9:30 AM
probably should keep updated anyway 😛
```

Please search exclusively x/reddit for open source llm/ai based market bot that actually works well. Search thoroughly. ALso search codeberg/gitlabs/huggingface/github. You MUST prioritize more recent ones than older ones, at least must be 2026!

## Assistant

_Time: 2026-05-19T14:35:36.687Z_

**Several open-source LLM/AI-based market/trading bots and frameworks exist that align closely with the idea in the conversation (tracking investments, generating buy/sell signals or recommendations, with AI for analysis/parsing).** However, none are a perfect plug-and-play "politician trades → weighted recommendations → push notifications" product that is fully turnkey and proven to consistently outperform in live trading across all market conditions. Most are frameworks, multi-agent systems, or specialized tools released or actively updated in 2026, often with strong backtesting/paper-trading results, risk controls, and real-world experimentation discussed on X and Reddit.<grok:render card_id="67ef52" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">48</argument></grok:render><grok:render card_id="f3d3ef" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">0</argument></grok:render>

I searched **exclusively** on X (via keyword and semantic tools, filtered since 2026-01-01 or recent) and Reddit (via site:reddit.com with 2026/2025 relevance filters) for discussions of working open-source LLM/AI market bots. I also directly searched GitHub, GitLab, Codeberg, and Hugging Face for repos/spaces (focusing on 2026 activity via pushed/updated dates, releases, and mentions). Prioritized **2026-created or updated projects** with evidence of actual use (backtests, paper/live results, dashboards, telemetry, risk management). Older established tools (e.g., Freqtrade, FinGPT) were deprioritized unless they had fresh 2026 LLM integrations.

Key context and nuances:
- **Public data foundation**: Politician trades (Congress, Senate) are public under the STOCK Act via financial disclosures (PDFs on House/Senate sites or aggregators like Capitol Trades). Parsing PDFs and weighting by historical gains is feasible with LLMs, as several tools demonstrate.
- **"Actually works well" criteria**: Looked for projects with dashboards/telemetry, circuit breakers, paper-trading modes, backtest results, multi-model consensus, Kelly-style sizing, or user-reported live experiments (e.g., Polymarket/Kalshi bots). Trading bots inherently carry risk—most discussions note high failure rates without edge, slippage, and the need for customization. No guarantees; past performance ≠ future.
- **LLM role**: Primarily for analysis (sentiment, news, pattern detection), multi-agent debate (e.g., bull/bear cases), or natural-language strategy building. Not magic predictors.
- **Politician angle**: Dedicated LLM bots for this are niche but buildable by combining scrapers + general frameworks. Several 2026 tools explicitly incorporate or analyze politician/insider data as signals.
- **Edge cases/considerations**: PDF parsing errors (use LLM-powered tools like LlamaParse), data delays (45-day filing window), legal/ethical (public data OK for personal use; not financial advice; avoid insider issues), API costs (OpenRouter/Ollama for local), regulatory (broker APIs, PDT rules), and maintenance (markets evolve; backtest rigorously). Implications: Democratizes "follow the smart money" but most retail still loses without discipline.

### Top 2026 LLM/AI-Based Open-Source Market/Trading Bots (General)
These are the strongest matches from X/Reddit discussions and GitHub. They emphasize multi-agent LLM setups, live/paper modes, and performance telemetry.

1. **TradingAgents (TauricResearch/TradingAgents)**  
   - **Repo**: https://github.com/tauricresearch/TradingAgents  
   - **Description & Features**: Multi-agent LLM framework mimicking a real trading firm. Agents include fundamental analysts, sentiment experts, technical analysts, news intelligence, debaters (bull/bear cases), trader, risk manager, and portfolio manager. Uses LangGraph for orchestration, checkpoint/resume, persistent memory/reflection, structured outputs. Supports DeepSeek, Qwen, GLM, GPT-5.x, Claude, Gemini, local Ollama. Backtesting, simulated trading, non-US benchmarks.  
   - **Recency & "Works Well" Evidence**: v0.2.4 (April 2026) and v0.2.5 (May 2026) with sentiment analyst, multi-region support, hardening. Actively discussed on X/Reddit as production-grade for financial decisions. Users praise collaborative agent debate for better risk-adjusted decisions.<grok:render card_id="390a94" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">48</argument></grok:render><grok:render card_id="b4494e" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">59</argument></grok:render>  
   - **Nuances/Implications**: Research-oriented (great for analysis/recommendations); extend with broker APIs for execution. Ideal base for politician-weighted signals. Setup requires LLM API keys but supports local.

2. **OpenClaw (openclaw/openclaw) + Trading Skills Ecosystem**  
   - **Repo/Framework**: https://github.com/openclaw/openclaw (and related skills on ClawHub/community)  
   - **Description & Features**: Explosive 2026 open-source AI agent framework (MIT, ~250k–373k stars). Autonomous LLM agents execute via modular "skills" (plugins for market data, backtesting, order placement). Natural-language instructions → trading workflows (crypto, stocks, Polymarket, Hyperliquid futures). Community skills include grid trading, RSI timing, copy-trading, arbitrage. Triple-AI consensus, 15+ safety checks (volume, regime, kill-switches), native exchange stops, self-improving ML loops (XGBoost feedback). Runs locally/self-hosted.  
   - **Recency & "Works Well" Evidence**: Launched late 2025 but exploded in early–mid 2026. X/Reddit users report paper-trading profits (e.g., 8–10%/month estimates in normal markets), Polymarket bots, and real workflows. Tutorials for 45-min deployment; used for 24/7 autonomous trading.<grok:render card_id="5f04e4" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">49</argument></grok:render><grok:render card_id="744474" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">53</argument></grok:render><grok:render card_id="1867b2" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">57</argument></grok:render>  
   - **Nuances/Implications**: Not a single "bot" but the easiest way to build custom ones (including politician trackers). Risks: Some community skills had malware (audit everything); API costs ~$10–20/month. Perfect for the convo's parsing + notifications.

3. **poly-trading-bot (zostaff/poly-trading-bot)**  
   - **Repo**: https://github.com/zostaff/poly-trading-bot  
   - **Description & Features**: Polymarket (prediction market) trading bot/toolkit with AI Directional strategy (any LLM via OpenRouter). Includes Safe Compounder (math-based), Beast Mode. Streamlit dashboard, SQLite telemetry on every trade, circuit breaker (15% drawdown), quarter-Kelly sizing, paper mode default, fallback models, lessons-from-live section.  
   - **Recency & "Works Well" Evidence**: Actively shared May 2026 on X with video demos and honest loss analysis. Users praise it over abandoned templates; real numbers shared.<grok:render card_id="96aa8d" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">0</argument></grok:render><grok:render card_id="d935d7" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">7</argument></grok:render>  
   - **Nuances/Implications**: Prediction-market focused (adaptable to stocks); emphasizes "no edge = no LLM saves you." Great for notifications and weighted recommendations.

Other notables (2026 activity):  
- **LLM-TradeBot (EthanAlgoX/LLM-TradeBot)**: Multi-agent for Binance futures; ADF, dashboards, safety, strong backtests.  
- **AI-Trader (HKUDS/AI-Trader)**: Fully agent-native automated trading platform; supports OpenClaw/etc. Updated April 2026.<grok:render card_id="b7e5e5" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">51</argument></grok:render>

No major dedicated repos on GitLab/Codeberg/Hugging Face Spaces (mostly prototypes or general fin-AI models).

### Politician/Insider Trade Trackers with LLM/AI Integration (2026 Focus)
Direct matches for the convo's core idea (public records → AI parsing/analysis → buy/sell signals weighted by gains):

1. **NancyBot (rod-trent/JunkDrawer/tree/main/NancyBot)**  
   - Monitors Nancy Pelosi (or extendable to others) trades via public disclosures. Uses Grok-4 (xAI) for analysis/significance/context (news, etc.). Real-time notifications/alerts. Background service, configurable. Feb 2026.  
   - **Why it fits**: Exactly "if they buy → push buy notification." Lightweight and AI-driven.<grok:render card_id="7c6867" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">67</argument></grok:render> (related MCP tools).

2. **congress_stock_trading (burd5/congress_stock_trading)**  
   - Scrapes/parses House PDFs + Senate trades into DB/dashboard. Visualizes performance (outperformance vs. S&P), member activity. Explicitly plans/integrates LLM (Hugging Face) + Streamlit for analysis. Recent activity.  
   - **Why it fits**: Data pipeline ready for weighting by gains + LLM recommendations.<grok:render card_id="a8a08b" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">72</argument></grok:render>

3. **gpt-trading-agent (LaurentiuGabriel/gpt-trading-agent)** and similar  
   - LLM agent (GPT-4o + Perplexity) analyzes small/mid-caps; explicitly pulls Congress/House/Senate trades via API as signals. Buy/sell/short recs, auto-pilot, Alpaca execution, chat UI.  

Supporting data tools (easy to LLM-ify):  
- us-congress-stock-transactions-retrieval, senate-stock-watcher-data, mcp-capitol-trades-server (AI-queryable politician trades with prices).<grok:render card_id="02daba" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">63</argument></grok:render><grok:render card_id="6c4aa3" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">67</argument></grok:render>

X/Reddit discussions confirm users combine these with general frameworks (e.g., OpenClaw skills or TradingAgents) for full "scrape → LLM weight by past-year gains → notifications/trades."

### Building/Extending the Exact Bot from the Conversation
- **Feasible today**: Use a 2026 scraper (e.g., burd5 or NancyBot) + OpenClaw/TradingAgents for LLM parsing (PDFs via LlamaParse-like) + weighting (backtest historical gains) + notifications (Telegram/Discord/webhooks) + broker execution (Alpaca/IBKR). Add multi-agent debate for robustness.
- **Steps/Edge Cases**: (1) Fetch disclosures daily (public APIs/JSON dumps). (2) LLM extracts buys/sells + context. (3) Weight by 1-year ROI (filter top performers). (4) Paper trade first. Risks: Filing delays, sparse data, overfitting to past pol performance (they beat S&P historically but not guaranteed). Legal note: Public info → fine for personal use.
- **Implications**: Lowers barrier (no paid Quiver Quant); community-auditable; but requires dev time or no-code skills (OpenClaw shines here). Broader: Highlights asymmetry (pols have edge) but also regulatory scrutiny on copy-trading.

**Recommendations**: Start with **OpenClaw** (easiest for custom politician skills + notifications) or **TradingAgents** (most sophisticated multi-LLM analysis). Fork NancyBot + integrate a general framework for the full vision. All are free/MIT-style; test in paper mode. Trading involves real risk—use as one data point alongside your own research.

If you want setup guides, specific forks, or deeper dives into any repo (e.g., code review), provide more details! These are the strongest 2026 matches after thorough cross-platform search.
