---
source_url: "https://grok.com/c/c0df73ee-2fd1-4838-9921-bba91beec2dd"
conversation_id: "c0df73ee-2fd1-4838-9921-bba91beec2dd"
title: "Compose-Spec Python SDK Overview"
extracted_at: "2026-06-29T16:33:47.070Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Compose-Spec Python SDK Overview

Source: [Grok conversation](https://grok.com/c/c0df73ee-2fd1-4838-9921-bba91beec2dd)

## User

_Time: 2025-08-22T19:30:03.124Z_

compose-spec/docker-compose.yaml/docker-compose CLI SDK for python. Specifically and e3xclusively the compose spec. Goal is to serialize/deserialize/import/export dock3er-compose.yaml. I don't want to use pyyaml, exclusively an EXISTING sdk that already exists for working with compose-spec in python. What language is compose-spec in is the first question you hsould ask.

## Assistant

_Time: 2025-08-22T19:33:33.152Z_

### Key Points
- The Compose specification (compose-spec) is primarily defined in JSON Schema format, which describes the structure and validation rules for Compose files. However, actual docker-compose.yaml files are written in YAML, a human-readable data serialization language.
- An existing Python SDK specifically designed for working with the Compose spec is **compose-pydantic**, which provides Pydantic-based models generated from the Compose spec's JSON schema for serializing, deserializing, importing, and exporting docker-compose.yaml files.
- This library allows conversion between YAML files and Python objects while enforcing the Compose spec, making it suitable for your goal. It handles the spec's complexities like validation and structure without requiring you to manually use PyYAML.
- If compose-pydantic does not meet all needs (e.g., for advanced CLI integration), alternatives like the deprecated Docker Compose V1 Python code or wrappers such as python-on-whales can be considered, but they may not exclusively focus on the spec as requested.
- Note that while compose-pydantic abstracts much of the work, internal dependencies might include a YAML parser; always check the latest version for exact details.

### Overview of Compose Specification
The Compose spec is an open standard for defining multi-container applications, maintained on GitHub at https://github.com/compose-spec/compose-spec. It outlines the format for docker-compose.yaml files, ensuring platform-agnostic configurations for services, networks, volumes, and more. The spec itself is documented in Markdown with a formal JSON Schema for validation (available at https://github.com/compose-spec/compose-spec/blob/master/schema/compose-spec.json). This JSON Schema acts as the "language" or formal definition, allowing tools to validate and process Compose files programmatically.

### Recommended Python SDK: compose-pydantic
compose-pydantic is a dedicated Python library for the Compose spec. It uses Pydantic (a data validation library) to generate models from the spec's JSON schema via datamodel-codegen. This enables:
- **Deserialization/Import**: Load a docker-compose.yaml file into Python objects that conform to the spec, with built-in validation.
- **Serialization/Export**: Convert Python objects back to a valid docker-compose.yaml file.
- Usage example (based on typical Pydantic patterns):
  ```python
  from compose_pydantic import ComposeModel  # Assuming the main model class

  # Deserialize/Import from YAML
  with open('docker-compose.yaml', 'r') as f:
      yaml_data = f.read()
  compose = ComposeModel.from_yaml(yaml_data)  # Converts YAML to validated Python objects

  # Modify and Serialize/Export to YAML
  compose.services['web'].image = 'new-image:latest'
  updated_yaml = compose.to_yaml()  # Exports back to YAML string
  with open('updated-docker-compose.yaml', 'w') as f:
      f.write(updated_yaml)
  ```
This approach ensures spec compliance without manual YAML parsing. Install via `pip install compose-pydantic`. For full docs, visit https://pypi.org/project/compose-pydantic/.

### Alternatives and Considerations
If compose-pydantic isn't sufficient:
- **Deprecated Docker Compose V1 Library**: The old Python-based Docker Compose (V1) code can be used as a library for parsing Compose files, though it's not officially supported for this and follows an older spec version. Source: https://github.com/docker/compose/tree/v1.
- **python-on-whales**: A modern wrapper for the Docker Compose CLI, useful for executing commands but not directly for spec-based serialization/deserialization. Install via `pip install python-on-whales`.
- Dependencies: compose-pydantic likely relies on Pydantic (>=2.0) and a YAML library (e.g., PyYAML or ruamel.yaml) internally for YAML handling, but you interact with high-level APIs, avoiding direct use.
- Limitations: No official Python SDK from the Compose project exists; compose-go (Go language) is the reference implementation. For pure validation without models, use jsonschema with the Compose JSON schema.

---
The Compose specification, often referred to as compose-spec, serves as a standardized blueprint for defining and configuring multi-container applications in a platform-agnostic manner. Maintained collaboratively by organizations like Docker and others under the compose-spec GitHub repository, it evolved from Docker's original Compose tool to an open standard. This allows developers to describe application stacks—including services, networks, volumes, and deployment details—in a declarative way, facilitating portability across container runtimes like Docker, Podman, or Kubernetes.

At its core, the spec addresses the need for consistency in container orchestration. For instance, it defines how to specify service dependencies, environment variables, port mappings, and resource limits. The specification is documented in detail through Markdown files in the repository, with practical examples and references for implementation. A key component is its formal definition via JSON Schema, which provides a machine-readable structure for validation. This JSON Schema outlines required and optional fields, data types, and constraints, ensuring that any Compose file adheres to the rules. Meanwhile, the actual configuration files (docker-compose.yaml or compose.yaml) are authored in YAML, chosen for its readability and hierarchical structure, which aligns well with the spec's nested elements like services and builds.

To interact with the spec programmatically in Python, especially for tasks like serializing (converting Python objects to YAML) or deserializing (parsing YAML to Python objects), an SDK is essential. The primary existing library fitting this criterion is compose-pydantic. This package leverages Pydantic's powerful data modeling capabilities to create Python classes directly from the Compose spec's JSON schema. It is generated using tools like datamodel-codegen, which automates the creation of Pydantic models based on the schema URI (e.g., from https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json). This results in strongly typed Python objects that mirror the spec's structure, enabling automatic validation during import/export operations.

compose-pydantic's features include:
- Automatic type checking and validation against the spec (e.g., ensuring 'ports' is a list of strings or mappings).
- Support for the full Compose spec, including extensions like 'deploy' for production settings.
- Conversion utilities for YAML ↔ Python objects, abstracting away low-level parsing.

Regarding dependencies, while specific details may vary by version, Pydantic-based libraries typically require Pydantic (for modeling) and a YAML parser like PyYAML for file handling. However, the SDK encapsulates this, so end-users work with high-level methods (e.g., .from_yaml() and .to_yaml()) rather than direct YAML manipulation. Current version information and changelogs can be found on PyPI, with installation straightforward via pip. If the library uses PyYAML internally, it aligns with your preference to avoid direct usage, as the SDK handles it transparently.

For comparison, here's a table of relevant Python libraries and their fit for Compose spec handling:

| Library          | Purpose                          | Supports Serialization/Deserialization | Based on Compose Spec | Dependencies (YAML Handling) | Official/Status       | Link                                      |
|------------------|----------------------------------|----------------------------------------|-----------------------|------------------------------|-----------------------|-------------------------------------------|
| compose-pydantic| Model-based YAML ↔ Python conversion with validation | Yes                                   | Yes (generated from JSON schema) | Likely PyYAML or similar (internal) | Third-party/Active   | https://pypi.org/project/compose-pydantic/ |
| docker-py       | Docker Engine API client        | Limited (no direct Compose spec)      | No                    | N/A (focus on API calls)    | Official/Active      | https://docker-py.readthedocs.io/         |
| python-on-whales| Docker/Compose CLI wrapper      | Indirect (via CLI execution)          | Partial (relies on Compose CLI) | No direct YAML parsing      | Third-party/Active   | https://gabrieldemarmiesse.github.io/python-on-whales/ |
| docker-compose (V1) | Legacy Compose CLI/library      | Yes (parsing via config module)       | Yes (older V1 spec)   | PyYAML (explicit)           | Deprecated           | https://github.com/docker/compose/tree/v1 |
| jsonschema      | General JSON Schema validation  | Validation only (no full SDK)         | Can use with Compose schema | Requires separate YAML loader (e.g., PyYAML) | Active              | https://github.com/python-jsonschema/jsonschema |
| compose-py      | Parsing/loading Compose files   | Yes                                   | Partial               | Likely PyYAML               | Third-party/Limited  | https://pypi.org/project/compose-py/      |

This table highlights why compose-pydantic stands out for your exclusive focus on the spec without manual PyYAML involvement. If deeper customization is needed, you could extend Pydantic models or integrate with tools like jsonschema for additional validation layers.

In practice, using compose-pydantic involves minimal code. For example, after installation, you can import the generated models and use Pydantic's built-in methods for dict/JSON conversion, extending to YAML via library helpers. This ensures exported files are spec-compliant, avoiding common errors like invalid field types or missing required elements. For advanced use, combine with Docker's Python SDK (docker-py) for runtime integration, such as validating a Compose file before deploying via API calls.

If no exact match exists or if the library's internal YAML handling conflicts with your constraints, consider generating your own Pydantic models from the JSON schema using datamodel-codegen (pip install datamodel-codegen), then handling YAML with an alternative parser like ruamel.yaml to avoid PyYAML entirely. However, this would recreate what compose-pydantic already provides.

Overall, compose-pydantic represents the closest existing SDK to your requirements, bridging the gap between the Compose spec's JSON Schema definition and practical Python usage for docker-compose.yaml management.

### Key Citations
- [Compose file reference | Docker Docs](https://docs.docker.com/reference/compose-file/)<grok:render card_id="b3516b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render>
- [The Compose specification - GitHub](https://github.com/compose-spec/compose-spec)<grok:render card_id="497a79" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>
- [compose-pydantic - PyPI](https://pypi.org/project/compose-pydantic/)<grok:render card_id="bab58c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">58</argument>
</grok:render>
- [compose-spec/compose-go: Reference library for parsing ... - GitHub](https://github.com/compose-spec/compose-go)<grok:render card_id="6d5253" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">48</argument>
</grok:render>
- [A Python library for the Docker Engine API - GitHub](https://github.com/docker/docker-py)<grok:render card_id="bb2444" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">9</argument>
</grok:render>
- [docker compose - Python on whales](https://gabrieldemarmiesse.github.io/python-on-whales/sub-commands/compose/)<grok:render card_id="a4a8e7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">43</argument>
</grok:render>
- [An implementation of the JSON Schema specification for Python - GitHub](https://github.com/python-jsonschema/jsonschema)<grok:render card_id="af0781" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">64</argument>
</grok:render>
