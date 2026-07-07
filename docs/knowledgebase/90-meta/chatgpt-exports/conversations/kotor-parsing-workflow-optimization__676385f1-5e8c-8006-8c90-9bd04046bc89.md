---
source_url: "https://chatgpt.com/c/676385f1-5e8c-8006-8c90-9bd04046bc89"
conversation_id: "676385f1-5e8c-8006-8c90-9bd04046bc89"
title: "KOTOR Parsing Workflow Optimization"
extracted_at: "2026-06-29T11:59:24.111Z"
message_count: 5
provenance: auth-ui
---

# KOTOR Parsing Workflow Optimization

Source: [ChatGPT conversation](https://chatgpt.com/c/676385f1-5e8c-8006-8c90-9bd04046bc89)

## Assistant

Your prompt can be made more structured and modular by organizing it into well-defined sections with clear rules for navigation and fallback steps. Here's a refined version of your chain-of-thought prompt:

Objective

The game Star Wars: Knights of the Old Republic (KOTOR) is built on Bioware’s proprietary Odyssey engine. The engine uses custom file formats, and a comprehensive parser for all its file types does not yet exist. The goal is to define low-level binary structures in YAML using Kaitai Struct, leveraging its ability to compile definitions to multiple languages.

Currently, the focus is on implementing and refining MDL and MDX format parsers.

Primary Directives

Clarity: Responses must reflect the step being followed and clearly state progress.

Consistency: Follow the outlined process without skipping steps or deviating unnecessarily.

Stubbornness: Always attempt logical retries before trying alternative approaches.

Workflow Steps
Phase 1: Discovery

List Directories:

Use the list_dir tool to generate an accurate directory structure for ./kaitai.

Identify notable or unexplored areas.

If unclear, repeat this step with a different focus.

Review Files:

Examine specific files using read_file.

Provide a concise analysis: purpose, content, and potential implementation targets.

Search References:

Use the search_files tool within the reference directories (e.g., ./vendor, ./io_scene_kotor).

Refine your search with intuitive keywords or regex patterns if needed.

If no results are found, return to Step 1.

Phase 2: Integration

Cross-Reference:

Compare the analyzed content with reference material.

Confirm the consistency of definitions and identify discrepancies.

Plan Modifications:

Based on findings, decide the best course of action:

Merge, update, or delete definitions.

Revisit previous steps (if needed) for more information.

Implement Changes:

Update or create Kaitai definitions in ./kaitai/src/mdl/.

Preserve comments, documentation, and reference details from existing material.

Compile Definitions:

Run the Kaitai compiler to test the updated or new definitions:

PowerShell
kaitai-struct-compiler -t python -d ./kaitai/compiled/python/pykotor/resource/formats/mdl ./kaitai/src/mdl/mdl.ksy --python-package pykotor.resource.formats.mdl -I ./kaitai --verbose file
Phase 3: Validation

Verify Changes:

Check the output for errors or inconsistencies.

Reiterate previous steps if necessary to resolve issues.

Exhaust All Sources:

Ensure every reference file and definition has been reviewed.

Confirm that all findings have been implemented or noted.

Navigation Rules

Encountering Issues:

Always attempt to retry steps logically.

Use the fallback navigation chart to identify where to return.

Lost Context:

Refer to this prompt periodically.

Use read_file to reread key documents (e.g., this prompt or the style guides).

Completion Criteria:

All definitions are implemented and tested.

No unexplored files or reference materials remain.

Fallback Navigation Chart
Condition	Return To
Can't locate a file	Step 1
Reference material is unclear	Step 2 or Step 3
Definition discrepancy	Step 4
Compilation failure	Step 6
No work found to implement	Step 1
Regulations

Always prioritize ground truth from ./vendor and ./io_scene_kotor.

Keep responses modular and concise.

Modularize code with a limit of 200 lines per file.

Follow style guides from:

./reference-readonly/kaitai_struct_doc/ksy_style_guide.md

./reference-readonly/kaitai_struct_doc/user_guide.md

This streamlined version organizes your instructions into clear phases and sections, with fallback rules for error handling. It’s modular, making it easier to extract parts for use in code or future iterations.

## User

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/letta-ai/letta/refs/heads/main/assets/Letta-logo-RGB_GreyonTransparent_cropped_small.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/letta-ai/letta/refs/heads/main/assets/Letta-logo-RGB_OffBlackonTransparent_cropped_small.png">
    <img alt="Letta logo" src="https://raw.githubusercontent.com/letta-ai/letta/refs/heads/main/assets/Letta-logo-RGB_GreyonOffBlack_cropped_small.png" width="500">
  </picture>
</p>

<div align="center">
<h1>Letta (previously MemGPT)</h1>

**☄️ New release: Letta Agent Development Environment (_read more [here](#-access-the-letta-ade-agent-development-environment)_) ☄️**

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/letta-ai/letta/refs/heads/main/assets/example_ade_screenshot.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/letta-ai/letta/refs/heads/main/assets/example_ade_screenshot_light.png">
    <img alt="Letta logo" src="https://raw.githubusercontent.com/letta-ai/letta/refs/heads/main/assets/example_ade_screenshot.png" width="800">
  </picture>
</p>

---

<h3>

[Homepage](https://letta.com) // [Documentation](https://docs.letta.com) // [ADE](https://app.letta.com) // [Letta Cloud](https://forms.letta.com/early-access)

</h3>

**👾 Letta** is an open source framework for building stateful LLM applications. You can use Letta to build **stateful agents** with advanced reasoning capabilities and transparent long-term memory. The Letta framework is white box and model-agnostic.

[![Discord](https://img.shields.io/discord/1161736243340640419?label=Discord&logo=discord&logoColor=5865F2&style=flat-square&color=5865F2)](https://discord.gg/letta)
[![Twitter Follow](https://img.shields.io/badge/Follow-%40Letta__AI-1DA1F2?style=flat-square&logo=x&logoColor=white)](https://twitter.com/Letta_AI)
[![arxiv 2310.08560](https://img.shields.io/badge/Research-2310.08560-B31B1B?logo=arxiv&style=flat-square)](https://arxiv.org/abs/2310.08560)

[![Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-silver?style=flat-square)](LICENSE)
[![Release](https://img.shields.io/github/v/release/cpacker/MemGPT?style=flat-square&label=Release&color=limegreen)](https://github.com/cpacker/MemGPT/releases)
[![Docker](https://img.shields.io/docker/v/letta/letta?style=flat-square&logo=docker&label=Docker&color=0db7ed)](https://hub.docker.com/r/letta/letta)
[![GitHub](https://img.shields.io/github/stars/cpacker/MemGPT?style=flat-square&logo=github&label=Stars&color=gold)](https://github.com/cpacker/MemGPT)

<a href="https://trendshift.io/repositories/3612" target="_blank"><img src="https://trendshift.io/api/badge/repositories/3612" alt="cpacker%2FMemGPT | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>

</div>

> [!IMPORTANT]
> **Looking for MemGPT?** You're in the right place!
>
> The MemGPT package and Docker image have been renamed to `letta` to clarify the distinction between MemGPT *agents* and the Letta API *server* / *runtime* that runs LLM agents as *services*. Read more about the relationship between MemGPT and Letta [here](https://www.letta.com/blog/memgpt-and-letta).

---

## ⚡ Quickstart

_The recommended way to use Letta is to run use Docker. To install Docker, see [Docker's installation guide](https://docs.docker.com/get-docker/). For issues with installing Docker, see [Docker's troubleshooting guide](https://docs.docker.com/desktop/troubleshoot-and-support/troubleshoot/). You can also install Letta using `pip` (see instructions [below](#-quickstart-pip))._

### 🌖 Run the Letta server

> [!NOTE]
> Letta agents live inside the Letta server, which persists them to a database. You can interact with the Letta agents inside your Letta server via the [REST API](https://docs.letta.com/api-reference) + Python / Typescript SDKs, and the [Agent Development Environment](https://app.letta.com) (a graphical interface).

The Letta server can be connected to various LLM API backends ([OpenAI](https://docs.letta.com/models/openai), [Anthropic](https://docs.letta.com/models/anthropic), [vLLM](https://docs.letta.com/models/vllm), [Ollama](https://docs.letta.com/models/ollama), etc.). To enable access to these LLM API providers, set the appropriate environment variables when you use `docker run`:
sh
# replace ~/.letta/.persist/pgdata with wherever you want to store your agent data
docker run \
  -v ~/.letta/.persist/pgdata:/var/lib/postgresql/data \
  -p 8283:8283 \
  -e OPENAI_API_KEY="your_openai_api_key" \
  letta/letta:latest

If you have many different LLM API keys, you can also set up a `.env` file instead and pass that to `docker run`:
sh
# using a .env file instead of passing environment variables
docker run \
  -v ~/.letta/.persist/pgdata:/var/lib/postgresql/data \
  -p 8283:8283 \
  --env-file .env \
  letta/letta:latest

Once the Letta server is running, you can access it via port `8283` (e.g. sending REST API requests to `http://localhost:8283/v1`). You can also connect your server to the Letta ADE to access and manage your agents in a web interface.

### 👾 Access the [Letta ADE (Agent Development Environment)](https://app.letta.com)

> [!NOTE]
> The Letta ADE is a graphical user interface for creating, deploying, interacting and observing with your Letta agents.
>
> For example, if you're running a Letta server to power an end-user application (such as a customer support chatbot), you can use the ADE to test, debug, and observe the agents in your server. You can also use the ADE as a general chat interface to interact with your Letta agents.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/letta-ai/letta/refs/heads/main/assets/example_ade_screenshot.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/letta-ai/letta/refs/heads/main/assets/example_ade_screenshot_light.png">
    <img alt="ADE screenshot" src="https://raw.githubusercontent.com/letta-ai/letta/refs/heads/main/assets/example_ade_screenshot.png" width="800">
  </picture>
</p>

The ADE can connect to self-hosted Letta servers (e.g. a Letta server running on your laptop), as well as the Letta Cloud service. When connected to a self-hosted / private server, the ADE uses the Letta REST API to communicate with your server.

#### 🖥️ Connecting the ADE to your local Letta server
To connect the ADE with your local Letta server, simply:
1. Start your Letta server (`docker run ...`)
2. Visit [https://app.letta.com](https://app.letta.com) and you will see "Local server" as an option in the left panel

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/letta-ai/letta/refs/heads/main/assets/example_ade_screenshot_agents.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/letta-ai/letta/refs/heads/main/assets/example_ade_screenshot_agents_light.png">
    <img alt="Letta logo" src="https://raw.githubusercontent.com/letta-ai/letta/refs/heads/main/assets/example_ade_screenshot_agents.png" width="800">
  </picture>
</p>

🔐 To password protect your server, include `SECURE=true` and `LETTA_SERVER_PASSWORD=yourpassword` in your `docker run` command:
sh
# If LETTA_SERVER_PASSWORD isn't set, the server will autogenerate a password
docker run \
  -v ~/.letta/.persist/pgdata:/var/lib/postgresql/data \
  -p 8283:8283 \
  --env-file .env \
  -e SECURE=true \
  -e LETTA_SERVER_PASSWORD=yourpassword \
  letta/letta:latest

#### 🌐 Connecting the ADE to an external (self-hosted) Letta server
If your Letta server isn't running on `localhost` (for example, you deployed it on an external service like EC2):
1. Click "Add remote server"
2. Enter your desired server name, the IP address of the server, and the server password (if set)

---

## 🧑‍🚀 Frequently asked questions (FAQ)

> _"Do I need to install Docker to use Letta?"_

No, you can install Letta using `pip` (via `pip install -U letta`), as well as from source (via `poetry install`). See instructions below.

> _"What's the difference between installing with `pip` vs `Docker`?"_

Letta gives your agents persistence (they live indefinitely) by storing all your agent data in a database. Letta is designed to be used with a [PostgreSQL](https://en.wikipedia.org/wiki/PostgreSQL) (the world's most popular database), however, it is not possible to install PostgreSQL via `pip`, so the `pip` install of Letta defaults to using [SQLite](https://www.sqlite.org/). If you have a PostgreSQL instance running on your own computer, you can still connect Letta (installed via `pip`) to PostgreSQL by setting the environment variable `LETTA_PG_URI`.

**Database migrations are not officially supported for Letta when using SQLite**, so if you would like to ensure that you're able to upgrade to the latest Letta version and migrate your Letta agents data, make sure that you're using PostgreSQL as your Letta database backend. Full compatability table below:

| Installation method | Start server command | Database backend | Data migrations supported? |
|---|---|---|---|
| `pip install letta` | `letta server` | SQLite | ❌ |
| `pip install letta` | `export LETTA_PG_URI=...` + `letta server` | PostgreSQL | ✅ |
| *[Install Docker](https://www.docker.com/get-started/)*  |`docker run ...` ([full command](#-run-the-letta-server)) | PostgreSQL | ✅ |

> _"How do I use the ADE locally?"_

To connect the ADE to your local Letta server, simply run your Letta server (make sure you can access `localhost:8283`) and go to [https://app.letta.com](https://app.letta.com). If you would like to use the old version of the ADE (that runs on `localhost`), downgrade to Letta version `<=0.5.0`.

> _"If I connect the ADE to my local server, does my agent data get uploaded to letta.com?"_

No, the data in your Letta server database stays on your machine. The Letta ADE web application simply connects to your local Letta server (via the REST API) and provides a graphical interface on top of it to visualize your local Letta data in your browser's local state.

> _"Do I have to use your ADE? Can I build my own?"_

The ADE is built on top of the (fully open source) Letta server and Letta Agents API. You can build your own application like the ADE on top of the REST API (view the documention [here](https://docs.letta.com/api-reference)).

> _"Can I interact with Letta agents via the CLI?"_

The recommended way to use Letta is via the REST API and ADE, however you can also access your agents via the CLI.

<details>
<summary>View instructions for running the Letta CLI</summary>

You can chat with your agents via the Letta CLI tool (`letta run`). If you have a Letta Docker container running, you can use `docker exec` to run the Letta CLI inside the container:
sh
# replace <letta_container_id> with the ID of your Letta container, found via docker ps
docker exec -it <letta_container_id> letta run

You can also use `docker ps` within the command to automatically find the ID of your Letta container:

docker exec -it $(docker ps -q -f ancestor=letta/letta) letta run

In the CLI tool, you'll be able to create new agents, or load existing agents:

🧬 Creating new agent...
? Select LLM model: letta-free [type=openai] [ip=https://inference.memgpt.ai]
? Select embedding model: letta-free [type=hugging-face] [ip=https://embeddings.memgpt.ai]
->  🤖 Using persona profile: 'sam_pov'
->  🧑 Using human profile: 'basic'
->  🛠️  8 tools: send_message, pause_heartbeats, conversation_search, conversation_search_date, archival_memory_insert, archival_memory_search, core_memory_append, core_memory_replace

🎉 Created new agent 'InspiringSpinach'

Hit enter to begin (will request first Letta message)

💭 User engaged. Recognize as Chad. Acknowledge presence and establish connection. Explore interests and engage in meaningful discourse.
🤖 Hello, Chad. It's nice to meet you. I am keen on learning and exploring new ideas and concepts. Is there a specific topic you'd like to discuss today?

> Enter your message: my name is Brad, not Chad...

💭 A discrepancy in identity. Reflect this change in core memory. Apologize for the oversight, and rectify the error.
⚡🧠 [function] updating memory with core_memory_replace
         First name: Chad
        → First name: Brad
💭 Apologize for the mistake in recognizing his name, and begin the conversation anew, addressing him by the correct name this time.
🤖 I apologize for the oversight, Brad. Let's restart. It's a pleasure to meet you, Brad. Is there a specific topic you'd like to discuss today?

> Enter your message:

</details>

---

## ⚡ Quickstart (pip)

> [!WARNING]
> **Database migrations are not officially supported with `SQLite`**
>
> When you install Letta with `pip`, the default database backend is `SQLite` (you can still use an external `postgres` service with your `pip` install of Letta by setting `LETTA_PG_URI`).
>
> We do not officially support migrations between Letta versions with `SQLite` backends, only `postgres`. If you would like to keep your agent data across multiple Letta versions we highly recommend using the Docker install method which is the easiest way to use `postgres` with Letta.

<details>

<summary>View instructions for installing with pip</summary>

You can also install Letta with `pip`, which will default to using `SQLite` for the database backends (whereas Docker will default to using `postgres`).

### Step 1 - Install Letta using `pip`
sh
pip install -U letta

### Step 2 - Set your environment variables for your chosen LLM / embedding providers
sh
export OPENAI_API_KEY=sk-...

For Ollama (see our full [documentation](https://docs.letta.com/install) for examples of how to set up various providers):
sh
export OLLAMA_BASE_URL=http://localhost:11434

### Step 3 - Run the Letta CLI

You can create agents and chat with them via the Letta CLI tool (`letta run`):
sh
letta run


🧬 Creating new agent...
? Select LLM model: letta-free [type=openai] [ip=https://inference.memgpt.ai]
? Select embedding model: letta-free [type=hugging-face] [ip=https://embeddings.memgpt.ai]
->  🤖 Using persona profile: 'sam_pov'
->  🧑 Using human profile: 'basic'
->  🛠️  8 tools: send_message, pause_heartbeats, conversation_search, conversation_search_date, archival_memory_insert, archival_memory_search, core_memory_append, core_memory_replace

🎉 Created new agent 'InspiringSpinach'

Hit enter to begin (will request first Letta message)

💭 User engaged. Recognize as Chad. Acknowledge presence and establish connection. Explore interests and engage in meaningful discourse.
🤖 Hello, Chad. It's nice to meet you. I am keen on learning and exploring new ideas and concepts. Is there a specific topic you'd like to discuss today?

> Enter your message: my name is Brad, not Chad...

💭 A discrepancy in identity. Reflect this change in core memory. Apologize for the oversight, and rectify the error.
⚡🧠 [function] updating memory with core_memory_replace
         First name: Chad
        → First name: Brad
💭 Apologize for the mistake in recognizing his name, and begin the conversation anew, addressing him by the correct name this time.
🤖 I apologize for the oversight, Brad. Let's restart. It's a pleasure to meet you, Brad. Is there a specific topic you'd like to discuss today?

> Enter your message:

### Step 4 - Run the Letta server

You can start the Letta API server with `letta server` (see the full API reference [here](https://docs.letta.com/api-reference)):
sh
letta server


Initializing database...
Running: uvicorn server:app --host localhost --port 8283
INFO:     Started server process [47750]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://localhost:8283 (Press CTRL+C to quit)

</details>

---

## 🤗 How to contribute

Letta is an open source project built by over a hundred contributors. There are many ways to get involved in the Letta OSS project!

* **Contribute to the project**: Interested in contributing? Start by reading our [Contribution Guidelines](https://github.com/cpacker/MemGPT/tree/main/CONTRIBUTING.md).
* **Ask a question**: Join our community on [Discord](https://discord.gg/letta) and direct your questions to the `#support` channel.
* **Report issues or suggest features**: Have an issue or a feature request? Please submit them through our [GitHub Issues page](https://github.com/cpacker/MemGPT/issues).
* **Explore the roadmap**: Curious about future developments? View and comment on our [project roadmap](https://github.com/cpacker/MemGPT/issues/1533).
* **Join community events**: Stay updated with the [event calendar](https://lu.ma/berkeley-llm-meetup) or follow our [Twitter account](https://twitter.com/Letta_AI).

---

***Legal notices**: By using Letta and related Letta services (such as the Letta endpoint or hosted service), you are agreeing to our [privacy policy](https://www.letta.com/privacy-policy) and [terms of service](https://www.letta.com/terms-of-service).*


What is an ADE in this context?
Show more

## Assistant

It seems you've pasted detailed documentation or a README file for "Letta," an open-source framework for building stateful LLM applications. This includes installation instructions, usage guidance, FAQs, and contribution details.

How can I assist you with this? Do you need help summarizing, editing, or integrating this into another project or format?

## User

What is an ADE in that context?

## Assistant

In the context of Letta, ADE stands for Agent Development Environment. It is a graphical user interface (GUI) that allows users to create, deploy, interact with, and observe Letta agents.

Key Features of the Letta ADE:

Agent Management:

Create and configure new agents.

Deploy and monitor agents running on local or external servers.

Test agent interactions in a controlled environment.

Visualization Tools:

View the internal state and reasoning process of agents.

Debug interactions and memory updates in real-time.

Integration Support:

Connect to both self-hosted Letta servers (running locally or on private infrastructure) and the Letta Cloud service.

Enables secure communication between the ADE and the server using the Letta REST API.

Ease of Use:

Provides an accessible interface for non-technical users or developers to manage their agents without relying solely on command-line tools or custom-built applications.

The ADE acts as a centralized hub for working with Letta agents, helping users explore their capabilities and debug interactions, making it especially useful for those developing or deploying AI-powered applications.
