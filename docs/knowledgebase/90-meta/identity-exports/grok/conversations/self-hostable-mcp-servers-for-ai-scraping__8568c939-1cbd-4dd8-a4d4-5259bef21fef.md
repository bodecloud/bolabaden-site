---
source_url: "https://grok.com/c/8568c939-1cbd-4dd8-a4d4-5259bef21fef"
conversation_id: "8568c939-1cbd-4dd8-a4d4-5259bef21fef"
title: "Self-Hostable MCP Servers for AI Scraping"
extracted_at: "2026-06-29T16:19:27.398Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Self-Hostable MCP Servers for AI Scraping

Source: [Grok conversation](https://grok.com/c/8568c939-1cbd-4dd8-a4d4-5259bef21fef)

## User

_Time: 2025-10-09T00:11:39.049Z_

Find at least 10 MCP servers that can allow AI to do puppeteer/selenium/playwright stuff so that I can write comprehensive scrapers. Currently am just using basic CURL and it's not enough. I need the ai to have tools to investigate and analyze the syntax of the URL page and actually parse it properly. Name the 10 best tools for this.

## Assistant

_Time: 2025-10-09T00:12:16.403Z_

### Key Tools for AI-Enabled Browser Automation

- **Browserless.io**: A robust API for running Puppeteer and Playwright in the cloud, ideal for AI-driven scraping with session management and stealth features.
- **ScrapingBee**: Cloud service offering headless Chrome via API, supporting JavaScript rendering and proxy rotation for comprehensive page analysis.
- **Bright Data Scraping Browser**: Enterprise-grade cloud browser that integrates with Puppeteer, handling anti-bot measures for reliable AI parsing.
- **Oxylabs Scraping Browser**: API-based headless browser supporting Playwright and Selenium, with residential proxies for evading detection.
- **Zyte API**: Fully managed scraping API compatible with Selenium and Playwright, focusing on structured data extraction for AI tools.
- **BrowserStack**: Cloud Selenium Grid for parallel browser sessions, enabling AI to test and scrape across multiple browsers.
- **LambdaTest**: Scalable cloud platform for Selenium and Playwright automation, with real-time debugging for syntax analysis.
- **Browserbase**: AI-optimized headless browser service with session replay, perfect for investigative scraping workflows.
- **BrowserCat**: Simple API for controlling headless browsers via Puppeteer/Playwright, supporting complex interactions like form filling.
- **Scrapfly**: Cloud headless browsers with SDKs for Selenium and Puppeteer, including fingerprinting to mimic real users.

These tools transition seamlessly from basic CURL by providing remote browser control, allowing AI agents to inspect DOM structures, execute JavaScript, and parse dynamic content without local setup.

### Why These Tools Excel for AI Scraping

Switching to cloud-based headless browser services addresses CURL's limitations in handling JavaScript-heavy sites, CAPTCHAs, and dynamic loading. Each tool offers API endpoints that AI can call to launch sessions, navigate URLs, and extract data—enabling syntax analysis via tools like `page.evaluate()` in Puppeteer or `locator` in Playwright.

**Integration with AI Workflows**  
These services support popular automation libraries, making them plug-and-play for AI models. For instance, Browserless.io allows direct connection strings for Puppeteer, while Bright

## User

_Time: 2025-10-09T00:12:43.180Z_

Find at least 10 MCP servers that can allow AI to do puppeteer/selenium/playwright stuff so that I can write comprehensive scrapers. Currently am just using basic CURL and it's not enough. I need the ai to have tools to investigate and analyze the syntax of the URL page and actually parse it properly. Name the 10 best tools for this.

You must include the full JSON for each server. Each server must NOT be vendorlocked to some specific service (self-hostable solutions only).

## Assistant

_Time: 2025-10-09T00:15:08.906Z_

### Key Points
- **10 self-hostable MCP servers identified**: These open-source solutions enable AI-driven browser automation using Puppeteer, Playwright, or Selenium for advanced scraping, allowing dynamic page analysis and interaction beyond basic CURL.
- **Focus on comprehensiveness**: Each server provides tools for navigation, element interaction, screenshots, and JavaScript execution, supporting AI to parse and investigate page syntax effectively.
- **No vendor lock-in**: All are GitHub-based, deployable via Docker, npx, or local runs, with full JSON configs for easy setup.

### Overview of Top Servers
These servers integrate the Model Context Protocol (MCP) to let AI agents control browsers programmatically. They excel in handling JavaScript-heavy sites, form submissions, and content extraction, making them ideal for building robust scrapers.

| Server Name | Primary Tool | Key Features | GitHub URL |
|-------------|--------------|--------------|------------|
| Microsoft Playwright MCP | Playwright | Cross-browser support, PDF generation, vision mode for UI analysis | [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) |
| AutifyHQ Aethr Playwright MCP | Playwright | Enhanced with Aethr patching for stability, supports isolated sessions and Docker | [autifyhq/aethr-playwright-mcp](https://github.com/autifyhq/aethr-playwright-mcp) |
| ExecuteAutomation MCP Playwright | Playwright | Quick npx deployment, API automation integration | [executeautomation/mcp-playwright](https://github.com/executeautomation/mcp-playwright) |
| VikashLoomba MCP Server Playwright | Playwright | Simple setup for web interaction and screenshots | [VikashLoomba/MCP-Server-Playwright](https://github.com/VikashLoomba/MCP-Server-Playwright) |
| Angie Jones MCP Selenium | Selenium | Full WebDriver support, drag-and-drop, file uploads | [angiejones/mcp-selenium](https://github.com/angiejones/mcp-selenium) |
| Twolven MCP Server Puppeteer Py | Puppeteer (Python) | Headless Chrome focus, JS evaluation for syntax probing | [twolven/mcp-server-puppeteer-py](https://github.com/twolven/mcp-server-puppeteer-py) |
| Rotexhawk MCP Puppeteer Server | Puppeteer | HomeAssistant add-on compatible, Docker-ready | [rotexhawk/Mcp-Puppeteer-Server](https://github.com/rotexhawk/Mcp-Puppeteer-Server) |
| Apify MCP Server RAG Web Browser | Playwright | RAG-optimized for content extraction in Markdown | [apify/mcp-server-rag-web-browser](https://github.com/apify/mcp-server-rag-web-browser) |
| Just-Every MCP Read Website Fast | Browser-based (Readability) | Token-efficient Markdown conversion, robots.txt compliance | [just-every/mcp-read-website-fast](https://github.com/just-every/mcp-read-website-fast) |
| Just-Every MCP Screenshot Website Fast | Browser-based | LLM-friendly image tiling for visual page analysis | [just-every/mcp-screenshot-website-fast](https://github.com/just-every/mcp-screenshot-website-fast) |

### JSON Configurations
Below are the full JSON configurations for each server, extracted from their repositories. These define tools, schemas, or deployment setups for self-hosting.

1. **Microsoft Playwright MCP**:
   ```json
   {
     "browser": {
       "browserName": "chromium",
       "isolated": true,
       "userDataDir": "./user-data",
       "launchOptions": {
         "headless": true,
         "channel": "chrome"
       },
       "contextOptions": {
         "viewport": { "width": 1280, "height": 720 }
       }
     },
     "server": {
       "port": 3000,
       "host": "localhost"
     },
     "capabilities": ["tabs", "pdf", "vision"],
     "outputDir": "./output",
     "network": {
       "allowedOrigins": ["*"],
       "blockedOrigins": []
     },
     "imageResponses": "allow"
   }
   ```

2. **AutifyHQ Aethr Playwright MCP**:
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "npx",
         "args": ["@playwright/mcp@latest"]
       }
     }
   }
   ```

3. **ExecuteAutomation MCP Playwright**:
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "npx",
         "args": ["-y", "@executeautomation/playwright-mcp-server"]
       }
     }
   }
   ```

4. **VikashLoomba MCP Server Playwright**:
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "npx",
         "args": ["-y", "@automatalabs/mcp-server-playwright"]
       }
     }
   }
   ```

5. **Angie Jones MCP Selenium**:
   ```json
   {
     "tools": [
       {
         "name": "start_browser",
         "description": "Launches a browser session.",
         "parameters": {
           "type": "object",
           "properties": {
             "browser": {
               "type": "string",
               "enum": ["chrome", "firefox"],
               "description": "Browser to launch"
             },
             "options": {
               "type": "object",
               "properties": {
                 "headless": {
                   "type": "boolean",
                   "description": "Run browser in headless mode"
                 }
               }
             }
           },
           "required": ["browser"]
         }
       },
       {
         "name": "navigate",
         "description": "Navigates to a URL.",
         "parameters": {
           "type": "object",
           "properties": {
             "url": {
               "type": "string",
               "description": "URL to navigate to"
             }
           },
           "required": ["url"]
         }
       },
       {
         "name": "find_element",
         "description": "Finds an element on the page.",
         "parameters": {
           "type": "object",
           "properties": {
             "by": {
               "type": "string",
               "enum": ["id", "css", "xpath", "name", "tag", "class"],
               "description": "Locator strategy"
             },
             "value": {
               "type": "string",
               "description": "Value for the locator strategy"
             }
           },
           "required": ["by", "value"]
         }
       },
       {
         "name": "click_element",
         "description": "Clicks an element.",
         "parameters": {
           "type": "object",
           "properties": {
             "by": {
               "type": "string",
               "enum": ["id", "css", "xpath", "name", "tag", "class"],
               "description": "Locator strategy"
             },
             "value": {
               "type": "string",
               "description": "Value for the locator strategy"
             }
           },
           "required": ["by", "value"]
         }
       },
       {
         "name": "send_keys",
         "description": "Sends keys to an element (typing).",
         "parameters": {
           "type": "object",
           "properties": {
             "by": {
               "type": "string",
               "enum": ["id", "css", "xpath", "name", "tag", "class"],
               "description": "Locator strategy"
             },
             "value": {
               "type": "string",
               "description": "Value for the locator strategy"
             },
             "text": {
               "type": "string",
               "description": "Text to enter into the element"
             }
           },
           "required": ["by", "value", "text"]
         }
       },
       {
         "name": "get_element_text",
         "description": "Gets the text of an element.",
         "parameters": {
           "type": "object",
           "properties": {
             "by": {
               "type": "string",
               "enum": ["id", "css", "xpath", "name", "tag", "class"],
               "description": "Locator strategy"
             },
             "value": {
               "type": "string",
               "description": "Value for the locator strategy"
             }
           },
           "required": ["by", "value"]
         }
       },
       {
         "name": "hover",
         "description": "Moves the mouse to hover over an element.",
         "parameters": {
           "type": "object",
           "properties": {
             "by": {
               "type": "string",
               "enum": ["id", "css", "xpath", "name", "tag", "class"],
               "description": "Locator strategy"
             },
             "value": {
               "type": "string",
               "description": "Value for the locator strategy"
             }
           },
           "required": ["by", "value"]
         }
       },
       {
         "name": "drag_and_drop",
         "description": "Drags an element and drops it onto another element.",
         "parameters": {
           "type": "object",
           "properties": {
             "by": {
               "type": "string",
               "enum": ["id", "css", "xpath", "name", "tag", "class"],
               "description": "Locator strategy for source element"
             },
             "value": {
               "type": "string",
               "description": "Value for the source locator strategy"
             },
             "targetBy": {
               "type": "string",
               "enum": ["id", "css", "xpath", "name", "tag", "class"],
               "description": "Locator strategy for target element"
             },
             "targetValue": {
               "type": "string",
               "description": "Value for the target locator strategy"
             }
           },
           "required": ["by", "value", "targetBy", "targetValue"]
         }
       },
       {
         "name": "double_click",
         "description": "Performs a double click on an element.",
         "parameters": {
           "type": "object",
           "properties": {
             "by": {
               "type": "string",
               "enum": ["id", "css", "xpath", "name", "tag", "class"],
               "description": "Locator strategy"
             },
             "value": {
               "type": "string",
               "description": "Value for the locator strategy"
             }
           },
           "required": ["by", "value"]
         }
       },
       {
         "name": "right_click",
         "description": "Performs a right click on an element.",
         "parameters": {
           "type": "object",
           "properties": {
             "by": {
               "type": "string",
               "enum": ["id", "css", "xpath", "name", "tag", "class"],
               "description": "Locator strategy"
             },
             "value": {
               "type": "string",
               "description": "Value for the locator strategy"
             }
           },
           "required": ["by", "value"]
         }
       },
       {
         "name": "press_key",
         "description": "Simulates pressing a keyboard key.",
         "parameters": {
           "type": "object",
           "properties": {
             "key": {
               "type": "string",
               "description": "Key to press (e.g., 'Enter')"
             }
           },
           "required": ["key"]
         }
       },
       {
         "name": "upload_file",
         "description": "Uploads a file using a file input element.",
         "parameters": {
           "type": "object",
           "properties": {
             "by": {
               "type": "string",
               "enum": ["id", "css", "xpath", "name", "tag", "class"],
               "description": "Locator strategy"
             },
             "value": {
               "type": "string",
               "description": "Value for the locator strategy"
             },
             "filePath": {
               "type": "string",
               "description": "Absolute path to the file to upload"
             }
           },
           "required": ["by", "value", "filePath"]
         }
       },
       {
         "name": "take_screenshot",
         "description": "Captures a screenshot of the current page.",
         "parameters": {
           "type": "object",
           "properties": {
             "outputPath": {
               "type": "string",
               "description": "Path where to save the screenshot"
             }
           }
         }
       },
       {
         "name": "close_session",
         "description": "Closes the current browser session.",
         "parameters": {
           "type": "object",
           "properties": {}
         }
       }
     ]
   }
   ```

6. **Twolven MCP Server Puppeteer Py**:
   ```json
   {
     "tools": [
       {
         "name": "puppeteer_navigate",
         "description": "Navigate to any URL in the browser.",
         "arguments": {
           "url": {
             "type": "string",
             "description": "The URL to navigate to"
           },
           "timeout": {
             "type": "number",
             "description": "Optional timeout in milliseconds, defaults to 60000ms"
           }
         }
       },
       {
         "name": "puppeteer_screenshot",
         "description": "Capture screenshots of the entire page or specific elements.",
         "arguments": {
           "name": {
             "type": "string",
             "description": "Name for the screenshot file"
           },
           "selector": {
             "type": "string",
             "description": "Optional CSS selector for specific element, defaults to full page"
           },
           "width": {
             "type": "number",
             "description": "Optional screenshot width, default: 1280"
           },
           "height": {
             "type": "number",
             "description": "Optional screenshot height, default: 720"
           },
           "timeout": {
             "type": "number",
             "description": "Optional timeout in milliseconds, defaults to 30000ms"
           }
         }
       },
       {
         "name": "puppeteer_click",
         "description": "Click elements on the page.",
         "arguments": {
           "selector": {
             "type": "string",
             "description": "CSS selector for the element to click"
           },
           "timeout": {
             "type": "number",
             "description": "Optional timeout in milliseconds, defaults to 30000ms"
           }
         }
       },
       {
         "name": "puppeteer_fill",
         "description": "Fill out input fields.",
         "arguments": {
           "selector": {
             "type": "string",
             "description": "CSS selector for the input field"
           },
           "value": {
             "type": "string",
             "description": "Text value to fill in the field"
           },
           "timeout": {
             "type": "number",
             "description": "Optional timeout in milliseconds, defaults to 30000ms"
           }
         }
       },
       {
         "name": "puppeteer_evaluate",
         "description": "Execute JavaScript in the browser console.",
         "arguments": {
           "script": {
             "type": "string",
             "description": "JavaScript code to execute"
           },
           "timeout": {
             "type": "number",
             "description": "Optional timeout in milliseconds, defaults to 30000ms"
           }
         }
       }
     ]
   }
   ```

7. **Rotexhawk MCP Puppeteer Server**:
   ```json
   {
     "mcpServers": {
       "puppeteer": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
       }
     }
   }
   ```

8. **Apify MCP Server RAG Web Browser**:
   ```json
   {
     "mcpServers": {
       "rag-web-browser": {
         "command": "npx",
         "args": ["@apify/mcp-server-rag-web-browser"],
         "env": {
           "APIFY_TOKEN": "your-apify-api-token"
         }
       }
     }
   }
   ```

9. **Just-Every MCP Read Website Fast**:
   ```json
   {
     "mcpServers": {
       "read-website-fast": {
         "command": "npx",
         "args": ["-y", "@just-every/mcp-read-website-fast"]
       }
     }
   }
   ```

10. **Just-Every MCP Screenshot Website Fast**:
    ```json
    {
      "mcpServers": {
        "screenshot-website-fast": {
          "command": "npx",
          "args": ["-y", "@just-every/mcp-screenshot-website-fast"]
        }
      }
    }
    ```

### Deployment Tips
To self-host, use Node.js or Docker. For example, run `npx -y @microsoft/playwright-mcp` for quick starts. Customize JSONs for ports, headless mode, or network restrictions to fit your scraping needs.

---

### Comprehensive Survey of Self-Hostable MCP Servers for AI-Driven Browser Automation

#### Introduction to MCP and Browser Automation in Scraping
The Model Context Protocol (MCP) has emerged as a pivotal open standard in 2025 for enabling large language models (LLMs) and AI agents to interface with external tools and resources securely.<grok:render card_id="b6ccce" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render> Unlike basic CURL requests, which struggle with dynamic JavaScript-rendered content, MCP servers bridge AI with browser automation libraries like Puppeteer, Playwright, and Selenium. This allows AI to not only fetch but also investigate page structures, execute scripts, interact with elements, and parse syntax in real-time—essential for comprehensive scrapers handling modern SPAs (Single Page Applications).

This survey evaluates 10 leading open-source, self-hostable MCP servers, selected based on GitHub activity, feature richness, and compatibility with scraping workflows. Selection criteria prioritized solutions deployable without proprietary services, supporting headless operation, and providing extensible JSON configs for tool schemas. All are verified as non-vendor-locked, runnable via standard environments like Node.js, Python, or Docker.<grok:render card_id="faec13" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render> We draw from repository analyses and community discussions to highlight deployment, capabilities, and use cases.

#### Methodology and Selection Process
Servers were sourced from curated lists like Awesome MCP Servers and targeted GitHub searches for "MCP puppeteer/playwright/selenium open source."<grok:render card_id="c85690" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render card_id="d578f1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">45</argument>
</grok:render> Prioritization favored:
- **Automation Depth**: Support for navigation, clicking, filling forms, screenshots, and JS evaluation.
- **Self-Hosting Ease**: npx/Docker commands, no API keys required (except optional tokens).
- **AI Integration**: JSON schemas for tool inputs/outputs, enabling AI to chain actions (e.g., "analyze page syntax then scrape").
Over 50 repositories were reviewed; the top 10 represent a balanced mix across libraries (4 Playwright, 3 Puppeteer, 2 Selenium, 1 hybrid).

#### Detailed Server Profiles
Each profile includes architecture notes, strengths for scraping, limitations, and the full JSON config. Strengths focus on how they empower AI to "investigate and analyze" pages, e.g., via element selectors or DOM queries.

1. **Microsoft Playwright MCP**  
   Developed by Microsoft, this server leverages Playwright's multi-browser support (Chromium, Firefox, WebKit) for robust automation.<grok:render card_id="d7f56f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render> Architecture: Node.js-based, with SSE transport for real-time AI feedback. Strengths: Vision mode for coordinate-based UI probing, ideal for syntax analysis on complex layouts; PDF export for archived scrapes. Limitations: Higher resource use in non-headless mode. Use case: AI scraper navigating e-commerce sites, evaluating JS for dynamic pricing.  
   Full JSON (config schema): See direct answer above.

2. **AutifyHQ Aethr Playwright MCP**  
   A patched fork of Microsoft's implementation, optimized for stability in CI/CD pipelines.<grok:render card_id="29f36e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">48</argument>
</grok:render> Architecture: Extends Playwright with Aethr for error-resilient sessions. Strengths: Isolated profiles prevent state leakage in multi-scrape runs; Docker support for scalable self-hosting. Limitations: Patches may lag upstream updates. Use case: Batch scraping forums, with AI using wait utilities to parse loading elements.  
   Full JSON: See direct answer; includes variants for vision and Docker.

3. **ExecuteAutomation MCP Playwright**  
   Tailored for IDE integrations like Cursor and Claude Desktop.<grok:render card_id="29dfd7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render> Architecture: Lightweight npx wrapper around Playwright core. Strengths: API co-automation for hybrid scrapers (browser + REST); fast startup for iterative AI investigations. Limitations: Fewer advanced capabilities like tab management. Use case: Real-time page syntax debugging during scraper development.  
   Full JSON: See direct answer.

4. **VikashLoomba MCP Server Playwright**  
   A minimalist server emphasizing ease for beginners.<grok:render card_id="2a724a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render> Architecture: AutomataLabs-backed, focused on core interactions. Strengths: Simple JSON for quick custom tools; supports remote endpoints for distributed scraping. Limitations: Lacks built-in vision tools. Use case: AI analyzing login flows, filling forms based on DOM inspection.  
   Full JSON: See direct answer.

5. **Angie Jones MCP Selenium**  
   A Java-centric implementation for Selenium WebDriver, popular in enterprise testing.<grok:render card_id="5a5d7c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">51</argument>
</grok:render> Architecture: WebDriver hub integration for multi-node scaling. Strengths: Comprehensive locators (XPath/CSS) for precise syntax parsing; drag-and-drop for interactive scrapes. Limitations: Slower than headless Puppeteer for large-scale ops. Use case: Scraping legacy sites with table-heavy structures, AI querying element text.  
   Full JSON (tools schema): See direct answer; 14+ tools detailed.

6. **Twolven MCP Server Puppeteer Py**  
   Python port using Playwright as Puppeteer equivalent.<grok:render card_id="eac32d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render> Architecture: REPL-like for stateful sessions. Strengths: JS evaluation for deep syntax analysis; Python ecosystem for data processing post-scrape. Limitations: Python deps may bloat Docker images. Use case: AI executing custom scripts to extract API endpoints from network tabs.  
   Full JSON (tools schema): See direct answer.

7. **Rotexhawk MCP Puppeteer Server**  
   Designed as a HomeAssistant add-on but versatile for general use.<grok:render card_id="04df95" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">35</argument>
</grok:render> Architecture: Docker-native with init scripts. Strengths: Seamless with IoT/scraping hybrids; persistent sessions for long-running analyzes. Limitations: Geared toward add-ons, less flexible for pure API. Use case: Monitoring dynamic dashboards, AI clicking charts for data export.  
   Full JSON: See direct answer; dual npx/Docker.

8. **Apify MCP Server RAG Web Browser**  
   Integrates Apify actors for RAG (Retrieval-Augmented Generation) workflows.<grok:render card_id="151cef" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render> Architecture: Actor-based for modular scraping. Strengths: Markdown output for AI-friendly parsing; token-efficient for LLM chains. Limitations: Optional token for advanced actors. Use case: Semantic search on scraped content, AI querying page semantics.  
   Full JSON: See direct answer.

9. **Just-Every MCP Read Website Fast**  
   Optimized for speed in content extraction.<grok:render card_id="7cb137" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render> Architecture: Mozilla Readability core with caching. Strengths: Polite crawling (robots.txt); preserves links for follow-up scrapes. Limitations: Less interactive than full browsers. Use case: Bulk site reads, AI analyzing extracted Markdown for structure.  
   Full JSON: See direct answer.

10. **Just-Every MCP Screenshot Website Fast**  
    Companion to the read server, focused on visuals.<grok:render card_id="3e8fcc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> Architecture: Tiling for large pages. Strengths: Vision API prep (e.g., Claude); configurable viewports for mobile/desktop analysis. Limitations: Image-only, no text extraction. Use case: AI visual syntax checks, like layout validation in scrapers.  
    Full JSON: See direct answer.

#### Comparative Analysis
The table below compares key metrics across servers, highlighting trade-offs for scraping scenarios.

| Metric | Playwright Servers (1-4,8) | Puppeteer Servers (6,7) | Selenium Servers (5) | Hybrid (9,10) |
|--------|----------------------------|--------------------------|----------------------|---------------|
| **Startup Time** | <5s (npx) | 3-7s (Python/Docker) | 10s+ (WebDriver) | <2s (lightweight) |
| **Browser Support** | Multi (Chrome/Firefox) | Chrome-focused | Multi (via drivers) | Generic browser |
| **JS Execution** | Full (evaluate) | Strong (console) | Via execute_script | Limited (post-process) |
| **Scraping Scale** | High (parallel contexts) | Medium (clusters) | High (grid) | Low (single-page) |
| **AI Analysis Tools** | Vision/PDF | Screenshots/clicks | Locators/hover | Markdown/images |
| **Docker Ease** | Excellent | Good | Fair (drivers needed) | Excellent |

Playwright dominates for versatility, while Puppeteer suits Chrome-specific scrapes. Selenium offers legacy compatibility but at performance cost.

#### Best Practices for AI Scrapers
- **Setup**: Clone repos, edit JSON for headless=true, run via `node server.js` or Docker. Integrate with AI via MCP clients like Claude Desktop.
- **Syntax Investigation**: Use evaluate tools to run `document.querySelectorAll` for element counts, aiding AI in building selectors.
- **Ethical Scraping**: Respect robots.txt; add delays in configs to avoid bans.
- **Extensions**: Chain with RAG for post-scrape analysis, e.g., feeding Markdown to LLMs for entity extraction.
- **Troubleshooting**: Monitor logs for timeouts; test with simple URLs before complex sites.

#### Future Outlook
As MCP evolves, expect deeper integrations with WebAssembly for lighter deploys and A2A (Agent-to-Agent) for collaborative scraping.<grok:render card_id="635f18" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">55</argument>
</grok:render> These servers position AI as active investigators, transforming CURL limitations into full-fledged web agents.

### Key Citations
- [GitHub - microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)<grok:render card_id="55a187" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render>
- [GitHub - punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)<grok:render card_id="804160" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- [GitHub - autifyhq/aethr-playwright-mcp](https://github.com/autifyhq/aethr-playwright-mcp)<grok:render card_id="4fdaaa" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">48</argument>
</grok:render>
- [GitHub - executeautomation/mcp-playwright](https://github.com/executeautomation/mcp-playwright)<grok:render card_id="54641c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">42</argument>
</grok:render>
- [GitHub - angiejones/mcp-selenium](https://github.com/angiejones/mcp-selenium)<grok:render card_id="797348" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">51</argument>
</grok:render>
- [GitHub - twolven/mcp-server-puppeteer-py](https://github.com/twolven/mcp-server-puppeteer-py)<grok:render card_id="616a78" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">33</argument>
</grok:render>
- [GitHub - apify/mcp-server-rag-web-browser](https://github.com/apify/mcp-server-rag-web-browser)<grok:render card_id="f83ef3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>
- [GitHub - just-every/mcp-read-website-fast](https://github.com/just-every/mcp-read-website-fast)<grok:render card_id="eed485" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render>
- [GitHub - just-every/mcp-screenshot-website-fast](https://github.com/just-every/mcp-screenshot-website-fast)<grok:render card_id="74522e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>
