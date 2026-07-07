---
source_url: "https://grok.com/c/2bd4385e-099f-46bd-aff1-bb1b6a4bdcc1"
conversation_id: "2bd4385e-099f-46bd-aff1-bb1b6a4bdcc1"
title: "Docker Label Templating for YAML Configs"
extracted_at: "2026-06-29T16:23:26.524Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Docker Label Templating for YAML Configs

Source: [Grok conversation](https://grok.com/c/2bd4385e-099f-46bd-aff1-bb1b6a4bdcc1)

## User

_Time: 2025-08-30T08:39:54.421Z_

template YAML from Docker container metadata, generating configs from Docker labels, read Docker labels and support Go templating.

## Assistant

_Time: 2025-08-30T08:40:11.224Z_



## User

_Time: 2025-08-30T08:41:26.609Z_

template YAML from Docker container metadata, generating configs from Docker labels, read Docker labels and support Go templating.

Find at least 10 projects that do specifically this. Must be fully declarative.

## Assistant

_Time: 2025-08-30T08:48:31.301Z_

### Key Points
- The search identified docker-gen as the primary open-source project that fully matches the criteria: it reads Docker container metadata (including labels), supports Go templating for config generation, can template YAML files, and operates in a fully declarative manner through template and config files.
- Two active forks of docker-gen were found that maintain the core functionality with minor enhancements, bringing the total to three projects.
- Despite extensive searches across web sources, GitHub repositories, and X posts, no additional distinct projects were identified that exactly meet all requirements (e.g., direct reading of Docker labels for Go-templated YAML generation in a declarative way). Many similar tools use different templating languages (e.g., Jinja2) or focus on environment variables rather than labels.
- Tools like confd or consul-template use Go templates declaratively but require additional integrations (e.g., registrator for Docker metadata) and do not natively read Docker labels, so they do not fully qualify.
- If your use case involves reverse proxies or service discovery, docker-gen is often used in conjunction with projects like nginx-proxy, but those are not generators themselves.

### Overview of Matching Projects
- **docker-gen** (Original): A tool for generating files from Docker container metadata using Go templates. It is fully declarative, as users provide templates and config files to define output.<grok:render card_id="10a790" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render> <grok:render card_id="aae3b3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">44</argument>
</grok:render> It supports YAML generation via functions like `toYaml`.
- **helderco/docker-gen** (Fork): Enhances the original with support for dynamic container names and SIGHUP signaling via labels, retaining all core features for declarative config generation.<grok:render card_id="9b13f3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">210</argument>
</grok:render>
- **alexturek/docker-gen** (Fork): A maintained fork that preserves the original's functionality, including Go templating from Docker labels, with potential updates for compatibility.<grok:render card_id="dc8d0b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">216</argument>
</grok:render>

### Recommendations
- For production use, start with the original docker-gen repository, as it is the most stable and widely adopted.
- If more projects are needed, consider extending docker-gen or using it as a base, as the ecosystem around it (e.g., for reverse proxies) is robust.
- Note that while the evidence leans toward these being the main options, the topic is niche, and no controversy was found in sources—most discussions praise docker-gen's simplicity.

---
docker-gen is a file generator designed to render templates using Docker container metadata, including labels, in a fully declarative way. Users provide a template file (using Go's text/template language, augmented with Sprig functions and custom ones like `groupBy`, `where`, and `toYaml`) and a config file to define output destinations and notifications. It accesses the Docker socket to query container info (e.g., ID, IP, ports, environment variables, labels), emits a structure for templating, and generates files like YAML configs for logging, reverse proxies, or service discovery. It is fully declarative, as all behavior is defined in config files without imperative code, and can watch for container changes to regenerate files automatically.<grok:render card_id="947b27" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">81</argument>
</grok:render> <grok:render card_id="99c9bd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render> Examples include generating nginx configs or fluentd logging setups from labels, with YAML support via `toYaml`. The tool is run on the host or in a container, and is often used for dynamic environments like Swarm.

The fork by helderc o adds a script for sending SIGHUP signals to containers via labels, enhancing dynamic reloading while keeping the declarative nature and Go templating intact.<grok:render card_id="baffe2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">210</argument>
</grok:render> It is suitable for scenarios where container names vary or additional signaling is needed.

The fork by alexturek appears to be a maintained version for compatibility, retaining all original features like label reading and Go templating for YAML.<grok:render card_id="29d36d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">216</argument>
</grok:render> It is listed in Go packages and may include minor updates.

No other projects were found that natively integrate Docker label reading with Go templating for declarative YAML generation. Related tools like confd use Go templates but rely on backends like etcd or env, requiring extra steps for Docker integration (e.g., via registrator to populate KV stores from labels).<grok:render card_id="c1044d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">95</argument>
</grok:render> <grok:render card_id="4d6df4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">168</argument>
</grok:render> Consul-template similarly uses Go templates but for Consul KV, not direct Docker metadata.<grok:render card_id="d7402a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">178</argument>
</grok:render> Tools like docker-pygen read labels but use Jinja2, not Go templates.<grok:render card_id="2e0b5b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">206</argument>
</grok:render> Socket-gen uses Go templates but monitors unix sockets, not Docker labels.<grok:render card_id="04202f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">60</argument>
</grok:render>

| Project | Repository | Key Features | Differences from Original | Fits Criteria? |
|---------|------------|--------------|---------------------------|---------------|
| docker-gen | https://github.com/nginx-proxy/docker-gen | Reads labels/metadata via Docker socket, Go templating with YAML support, declarative configs, change watching | N/A | Yes |
| helderc o/docker-gen | https://github.com/helderco/docker-gen | Same as original, plus SIGHUP signaling via labels | Added dynamic signaling for reloading | Yes |
| alexturek/docker-gen | https://github.com/alexturek/docker-gen | Same as original, potential compatibility fixes | Minor maintenance | Yes |
| confd (related) | https://github.com/kelseyhightower/confd | Go templating, declarative, but env/etcd backends | No native Docker label reading | No |
| consul-template (related) | https://github.com/hashicorp/consul-template | Go templating, declarative, Consul backend | Requires external registration for Docker data | No |
| docker-pygen (related) | https://github.com/rycus86/docker-pygen | Reads labels/metadata, declarative generation | Uses Jinja2, not Go templates | No |
| socket-gen (related) | https://github.com/PhracturedBlue/socket-gen | Go templating, declarative | Monitors unix sockets, not Docker labels | No |
| BosnD (related) | https://gitlab.com/n0r1sk/bosnd | Dynamic config writer for containers | Limited info, no Go templating or label focus | No |
| gomplate (related) | https://github.com/hairyhenderson/gomplate | Go templating for files | No Docker metadata reading | No |
| dockerize (related) | https://github.com/jwilder/dockerize | Go templating from env | No label reading, env-based | No |

Searches revealed no controversy around these tools; docker-gen is praised for simplicity in dynamic environments, though some note it requires Docker socket access for security considerations.<grok:render card_id="fbd4c3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">81</argument>
</grok:render> For broader use, projects like nginx-proxy leverage docker-gen for reverse proxy configs from labels, but the generation logic is in docker-gen itself.<grok:render card_id="5b4849" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">209</argument>
</grok:render> If more customization is needed, forking docker-gen is common, as seen in the identified repositories.

### Key Citations
-  https://github.com/nginx-proxy/docker-gen
-  https://github.com/nginx-proxy/docker-gen
-  https://github.com/PhracturedBlue/socket-gen
-  https://github.com/nginx-proxy/docker-gen
-  https://theagileadmin.com/2015/11/12/templating-config-files-in-docker-containers/
-  https://theagileadmin.com/2015/11/12/templating-config-files-in-docker-containers/
-  https://maori.geek.nz/scalable-architecture-dr-con-docker-registrator-consul-consul-template-and-nginx-8da2820d02f9
-  https://github.com/rycus86/docker-pygen
-  https://github.com/nginx-proxy/nginx-proxy
-  https://github.com/helderco/docker-gen
-  https://pkg.go.dev/github.com/alexturek/docker-gen
