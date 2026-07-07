---
source_url: "https://grok.com/c/ad46f205-f9b0-4a93-85d6-f80fe50ea08e"
conversation_id: "ad46f205-f9b0-4a93-85d6-f80fe50ea08e"
title: "Self-Hosted LLM WebUIs 2025 Overview"
extracted_at: "2026-06-29T16:38:09.167Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Self-Hosted LLM WebUIs 2025 Overview

Source: [Grok conversation](https://grok.com/c/ad46f205-f9b0-4a93-85d6-f80fe50ea08e)

## User

_Time: 2025-11-02T22:26:58.190Z_

What's the most popular, feature rich, and above all else **most provisional** LLM WebUI that I can self-host on my own k8s/docker-compose stack? I've tried OpenWebUI, it was waaaaay too messy/disorganized buggy, and wasn't fully provisional. I've tried LobeChat, too much frontend and not enough function. LibreChat was too basic, i'm starting to give up hope there's an actual good one in 2025.
 
Must be fully provisional, feature-rich (supporting MCP tools and similar) and compatible with my own llm apis, and support basic user management/permissions.
 
Provide at least 5 good ones that are being actively discussed on Reddit right now.

## Assistant

_Time: 2025-11-02T22:29:43.218Z_

### Key Recommendations
Based on recent discussions in AI communities, several self-hosted LLM WebUIs stand out as polished alternatives to OpenWebUI, LobeChat, and LibreChat. Research suggests AnythingLLM, SillyTavern, Text Generation WebUI, Khoj, and Dify are among the most actively discussed options in 2025, with strong emphasis on features like tool calling or agents (often aligned with protocols like MCP for advanced interactions). These are generally compatible with custom LLM APIs (e.g., OpenAI-style endpoints), offer basic user management, and deploy easily via Docker Compose or Kubernetes. However, user experiences vary, and no single option is universally "best" due to trade-offs in polish and complexity—evidence leans toward AnythingLLM for broad appeal, though it may require tweaks for optimal professionalism.

#### Top Pick: AnythingLLM
AnythingLLM emerges as a strong contender for its balance of features and usability, often praised for RAG capabilities and multi-model support in 2025 Reddit threads.<grok:render card_id="525555" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render><grok:render card_id="059f61" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render> It supports custom APIs, basic user roles, and agent-like tools, making it suitable for your stack. Deploy via Docker: https://github.com/mintplex-labs/anything-llm.

#### Strong Alternatives
- **SillyTavern**: Versatile with extensions for tools and multimodal features; custom API backends like Ollama; basic permissions via configs. Docker setup available: https://github.com/SillyTavern/SillyTavern.<grok:render card_id="93b0a0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render><grok:render card_id="028764" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render>
- **Text Generation WebUI**: Highly extensible with tool calling and agents via plugins; full custom API compatibility; limited built-in user management but extendable. Docker Compose ready: https://github.com/oobabooga/text-generation-webui.<grok:render card_id="5cb603" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render><grok:render card_id="d89bec" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render>
- **Khoj**: Agent-focused with tool use support; integrates custom APIs like OpenRouter; robust auth options for users. Easy Docker deployment: https://github.com/khoj-ai/khoj.<grok:render card_id="d8a526" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render>
- **Dify**: Developer-oriented with agents and version control; custom API publishing; team-friendly user management. Supports Docker/K8s: https://github.com/langgenius/dify.<grok:render card_id="e4afe5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render>

#### Deployment Considerations
All these can run on your k8s/docker-compose setup, typically with a simple `docker compose up`. Test for your specific LLM APIs, as compatibility is high but may need minor configs for advanced tools like MCP equivalents. If professionalism (polished UI) is key, start with AnythingLLM or Khoj, as community feedback highlights their cleaner interfaces over buggier options.

---

### Exploring Self-Hosted LLM WebUIs in 2025: A Comprehensive Overview

In the evolving landscape of self-hosted AI tools, finding a LLM WebUI that combines popularity, rich features, and a professional polish remains a challenge, as evidenced by ongoing discussions in communities like Reddit's r/LocalLLaMA and r/selfhosted. Users often express frustration with options like OpenWebUI (criticized for bloat and bugs), LobeChat (overly frontend-focused without depth), and LibreChat (seen as too simplistic for advanced needs). This report draws from recent 2025 threads and analyses to highlight five standout alternatives: AnythingLLM, SillyTavern, Text Generation WebUI, Khoj, and Dify. These are selected based on active Reddit mentions, emphasizing their alignment with requirements for tool support (including MCP-like protocols for agents and function calling), custom LLM API compatibility, basic user management, and seamless deployment on Docker Compose or Kubernetes stacks. While no tool is flawless—trade-offs exist in UI refinement and maintenance—these represent the most discussed and viable options, with a focus on real-world user feedback.

#### Understanding Key Requirements and Challenges
Self-hosted LLM WebUIs must prioritize interoperability with personal LLM APIs, such as those from Ollama or custom OpenAI-compatible endpoints, while offering features like Retrieval-Augmented Generation (RAG), agent tools, and multimodal capabilities. "Professional" here interprets as a polished, intuitive UI free from disorganization or bugs, as per user complaints. MCP tools likely refer to Model Context Protocol or similar for advanced agent interactions, enabling LLMs to handle complex tasks like tool calling. Discussions in 2025 reveal a community push for tools that are actively maintained, with rapid bug fixes and feature additions, amid concerns over commercialization (e.g., licensing shifts in some projects).

Popularity is gauged from Reddit activity: Threads from April to August 2025 in r/LocalLLaMA show hundreds of comments debating UIs, with cross-references in r/selfhosted. For instance, a June 2025 post on preferred LLMs indirectly highlights UI integrations, while August discussions critique bloat in established options. Compatibility with k8s/docker-compose is universal among these picks, often via official Docker images or Compose files, allowing scalable deployments on home servers or clusters.

#### Detailed Reviews of Top Options

**1. AnythingLLM**  
AnythingLLM is frequently recommended in 2025 for its straightforward approach to RAG and multi-model workflows, making it a go-to for users seeking a balance between features and simplicity.<grok:render card_id="c8534a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render><grok:render card_id="59ebe5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render><grok:render card_id="cdaed9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render> Developed by Mintplex Labs, it's open-source and actively maintained, with updates addressing bugs like parameter limitations. Features include out-of-the-box TTS/STT, document embedding for RAG, and agent-like tools for task automation. It supports custom APIs via backends like Ollama or LM Studio, allowing seamless integration with your own LLMs. User management covers basic roles and multi-user access, with permissions for shared workspaces. Pros: Lightweight yet feature-rich; professional UI with minimal bloat; easy mobile support. Cons: Occasional bugs in model parameter settings; slower development pace compared to peers. Docker Compose deployment is simple—pull the image and configure via env vars for your APIs. In Reddit threads, users note its reliability for productivity tasks, positioning it as a polished alternative to messier options.

**2. SillyTavern**  
Originally designed for roleplay, SillyTavern has evolved into a versatile, extension-heavy UI praised in 2025 discussions for its customization and agent capabilities.<grok:render card_id="228e3f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">31</argument>
</grok:render><grok:render card_id="787000" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render><grok:render card_id="76cf12" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render> It's open-source, with a thriving community adding extensions for RAG, world-info systems (akin to MCP for context management), and multimodal integrations (e.g., audio/image via backends like KoboldCPP). Custom API support is robust, connecting to Ollama, vLLM, or your own endpoints. Basic user management includes config-based permissions, though it's more single-user oriented by default. Pros: Highly feature-rich with mutable workflows; professional for creative and general use after theme tweaks; supports tool calling via extensions. Cons: Default UI can feel dated; roleplay roots may deter some. Deployment via Docker is straightforward, with Compose files for k8s scaling. Reddit users in April 2025 threads highlight its "jack of all trades" nature, making it ideal for advanced tool setups without the disorganization of OpenWebUI.

**3. Text Generation WebUI (oobabooga)**  
A staple in local LLM communities, Text Generation WebUI is lauded for its extensibility and tool support in mid-2025 Reddit posts.<grok:render card_id="fff869" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render><grok:render card_id="6ee6ec" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">34</argument>
</grok:render><grok:render card_id="5793e7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render> Open-source and actively updated, it features plugins for agents, function calling (MCP equivalents), and RAG, alongside multimodal experiments. It excels with custom APIs, supporting any OpenAI-compatible backend. User management is basic but extendable via plugins for multi-user scenarios. Pros: Extremely feature-rich; professional interface for technical users; vast extension ecosystem. Cons: Steep learning curve; not multi-user out-of-the-box. Docker Compose is core to its setup, with official images for k8s. Discussions emphasize its reliability for everything from chat to code generation, positioning it as a robust, professional choice over basic alternatives like LibreChat.

**4. Khoj**  
Khoj stands out in 2025 self-hosting threads for its agent-centric design, with easy tool use and integrations.<grok:render card_id="34cbea" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render> As an open-source project, it's actively maintained by its creators, who engage directly in Reddit feedback. Features include agent creation with tool calling (supporting MCP-like protocols), RAG on files, and canvas/inline generation modes. Custom APIs are handled via OpenRouter or local endpoints. User management is strong, with magic links, Google auth, and data partitioning. Pros: Feature-rich for agents; polished, professional UI; seamless mobile/Obsidian plugins. Cons: UX can be engineer-focused; setup quirks for multi-user auth. Docker with Ollama is recommended, fully compatible with k8s. Users praise its ease for research tasks, making it a discussed favorite for professional setups.

**5. Dify**  
Dify is developer-favored in 2025 discussions for its workflow-oriented features, including agents and CI/CD for models.<grok:render card_id="8e1fd5" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render><grok:render card_id="213371" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render> Open-source and actively developed, it supports tool calling, version control, and one-button API publishing. Custom LLM APIs integrate natively, with support for enterprise or local models. User management includes team roles and access controls. Pros: Highly feature-rich; professional for scalable apps; combines chat with deployment tools. Cons: Over-engineered for casual use; complex self-hosting errors. Docker/K8s compatibility is excellent, with official guides. Reddit threads note its neat handling of agents, appealing for users beyond basic chat.

#### Comparative Analysis
To aid decision-making, here's a table summarizing key attributes based on 2025 community insights:

| UI Name          | Popularity (Reddit Mentions) | Feature-Richness (Tools/Agents) | Professional Polish (UI/UX) | Custom API Support | User Management | Docker/K8s Compatibility | Active in 2025 |
|------------------|------------------------------|---------------------------------|-----------------------------|--------------------|-----------------|--------------------------|---------------|
| AnythingLLM     | High (e.g., RAG-focused threads) | High (RAG, TTS, agents)        | Medium-High (Clean, minimal) | Yes               | Basic roles    | Yes (Compose priority)  | Yes          |
| SillyTavern     | Medium-High (Extension ecosystems) | High (Extensions, multimodal)  | Medium (Customizable)       | Yes (Backends)    | Config-based   | Yes                     | Yes          |
| Text Gen WebUI | High (Classic choice)       | Very High (Plugins, calling)   | Medium (Technical)          | Yes               | Extendable     | Yes                     | Yes          |
| Khoj            | Medium (Agent discussions)  | High (Tool use, RAG)           | High (Snappy, integrated)   | Yes               | Robust auth    | Yes                     | Yes          |
| Dify            | Medium (Dev-oriented)       | Very High (Agents, versioning) | High (Scalable)             | Yes               | Team controls  | Yes (K8s strong)       | Yes          |

This table reflects aggregated pros/cons: AnythingLLM scores on accessibility, while Dify excels in enterprise-like features. All support MCP equivalents through agents or extensions, addressing your tool needs.

#### Broader Trends and Advice
2025 trends show a shift toward hybrid UIs blending local inference with API routing, as seen in integrations with LiteLLM or OpenRouter. Challenges include RAM usage (e.g., OpenWebUI's 5GB idle) and mobile support, which these options mitigate via PWAs or extensions. For your setup, start with Docker Compose files from GitHub repos, testing API compatibility first. If bugs arise, community forks (e.g., of OpenWebUI) offer alternatives. Overall, these tools restore hope—active discussions confirm ongoing improvements, making self-hosting viable for professional, feature-packed LLM interactions.

**Key Citations:**
- [What is everyone's top local llm ui (April 2025)](https://www.reddit.com/r/LocalLLaMA/comments/1jui6wd/what_is_everyones_top_local_llm_ui_april_2025/)
- [Best chat interface currently (Aug 2025)](https://www.reddit.com/r/LocalLLaMA/comments/1ml0pt7/best_chat_interface_currently_aug_2025/)
- [Best self-hosted AI UI?](https://www.reddit.com/r/selfhosted/comments/1i4ef8g/best_selfhosted_ai_ui/)
- [OpenWebUI vs LibreChat](https://www.reddit.com/r/selfhosted/comments/1jltdjq/openwebui_vs_librechat/)
- [Top Open WebUI Alternatives for Running LLMs Locally](https://www.helicone.ai/blog/open-webui-alternatives)
- [Top Open WebUI Alternatives for 2025: The Best Self‑Hosted ...](https://sider.ai/blog/ai-tools/top-open-webui-alternatives-for-2025-the-best-self-hosted-and-managed-options)
- [Top 5 Open-Source ChatGPT Replacements April 2025](https://apipie.ai/docs/blog/top-5-opensource-chatgpt-replacements)
