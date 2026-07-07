---
source_url: "https://grok.com/c/c26e8873-7752-4f5f-97f6-9ba2fb918dd6"
conversation_id: "c26e8873-7752-4f5f-97f6-9ba2fb918dd6"
title: "Kaitai Struct Inheritance Alternatives"
extracted_at: "2026-06-29T16:13:22.994Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Kaitai Struct Inheritance Alternatives

Source: [Grok conversation](https://grok.com/c/c26e8873-7752-4f5f-97f6-9ba2fb918dd6)

## User

_Time: 2025-12-25T21:41:25.612Z_

Correct way to do inheritence in Kaitai Struct Compiler (ensure you reference the api documentation as much as possible)? Above gives me these errors:
 
String does not match the pattern of "^(.*/)?[a-z][a-z0-9_]*$".yaml-schema: ksy schema

## Assistant

_Time: 2025-12-25T21:41:55.160Z_

**Key Points**
- Kaitai Struct does not support classical inheritance (like extending a base type to inherit its `seq` fields).
- Reuse of common structures is achieved through **imports** and referencing imported types with path syntax (e.g., `gff::gff_struct`).
- The error "String does not match the pattern of "^(.*/)?[a-z][a-z0-9_]*$"" occurs because import paths must start with a lowercase letter, contain only lowercase letters/numbers/underscores, and may include subdirectories (e.g., `gff/gff` or simply `gff` if the file is named `gff.ksy`).
- The provided `utc.xml` example correctly uses imports to reuse GFF and XML structures without inheritance.

**Understanding Reuse in Kaitai Struct**
Kaitai Struct focuses on composition over inheritance. All user-defined types are independent, but you can build hierarchical structures by nesting types in `seq` or `types`. For shared structures (like the GFF format used in many BioWare files), the standard approach is to define it once in a separate `.ksy` file and import it wherever needed.

**Fixing the Import Error**
The validation pattern for `imports` entries is strict:
- Allowed: `"gff"`, `"xml/gff_xml"`, `"common/utc_base"`
- Disallowed: Anything with uppercase letters (e.g., `"GFF"`), hyphens, or starting with a number.

To fix your error, rename files to lowercase (e.g., `gff.ksy`, `gff_xml.ksy`) and update the import list accordingly:

```yaml
meta:
  imports:
    - ../../GFF/GFF   # becomes gff/gff if directory structure is preserved
    - ../../XML/GFF_XML  # becomes xml/gff_xml
    - ../UTC/UTC         # becomes utc/utc
```

If files are flattened, simply use:

```yaml
meta:
  imports:
    - gff
    - gff_xml
    - utc
```

**Example of Proper Reuse (Based on Your UTC XML Document)**
Your provided `utc.xml.ksy` already demonstrates the correct pattern:

```yaml
meta:
  id: utc_xml
  imports:
    - ../../GFF/GFF      # reuses generic GFF structure
    - ../../XML/GFF_XML  # reuses XML serialization logic
    - ../UTC/UTC         # reuses UTC-specific fields
seq:
  - id: xml_content
    type: str
    size-eos: true
    encoding: UTF-8
```

To "inherit" fields from these, reference them in your `seq` or embed them as sub-types. There is no `extends` or `base` keyword.

If you need something closer to inheritance (e.g., a common header shared across many formats), define it as a type in a shared file and include it in `seq`:

```yaml
# common_header.ksy
meta:
  id: common_header
seq:
  - id: magic
    contents: [0x55, 0x54, 0x43]  # example
  - id: version
    type: u4
```

Then in your format:

```yaml
meta:
  imports:
    - common_header
seq:
  - id: header
    type: common_header  # "inherits" all fields from common_header
  - id: body
    type: my_body_type
```

This composition achieves the same result as inheritance in most cases.

**Common Patterns in Official Formats**
Many complex formats in the [Kaitai Struct formats library](https://formats.kaitai.io/) (e.g., ELF, PNG, ZIP) use heavy imports and nested types to avoid duplication, confirming that this is the intended design.

---

### Comprehensive Overview of Type Reuse and Modularization in Kaitai Struct

Kaitai Struct is designed as a declarative language for describing binary formats, emphasizing simplicity, cross-language compatibility, and composition. Unlike object-oriented languages with class inheritance, Kaitai Struct deliberately avoids inheritance mechanisms to keep the model predictable and easy to compile across diverse targets (C++, Java, Python, etc.).

#### Why No Inheritance?
Inheritance introduces complexities such as diamond problems, method overriding, and runtime polymorphism, which do not align well with Kaitai Struct's goal of generating straightforward, efficient parsers. Instead, the language promotes **modular design** through separate `.ksy` files and explicit composition.

#### Primary Mechanism: Imports and Path-Based Referencing
The core feature for reuse is the `imports` key under `meta`. It allows loading other `.ksy` files, making their top-level type (defined by `meta/id`) available for use.

- **Syntax Example**:
  ```yaml
  meta:
    id: my_format
    imports:
      - common_header
      - utils/gff
      - nested/xml_helper
  ```

- After import, reference types as `imported_id::type_name`. If the imported file has nested types, use double-colons for deeper paths (e.g., `gff::struct_field`).

- **Validation Rules** (Source of Your Error):
  The JSON schema for `.ksy` files enforces:
  ```
  pattern: "^(.*/)?[a-z][a-z0-9_]*$"
  ```
  This means:
  - Optional directory path ending with `/`.
  - Filename part: starts with lowercase letter, followed by lowercase letters, digits, or underscores only.
  - No uppercase, hyphens, dots (except `.ksy` extension, which is omitted), or other characters.

  This strictness ensures generated code has valid identifiers across all target languages.

#### Composition Patterns for "Inheritance-Like" Behavior
1. **Embed Shared Structures Directly**:
   Include a shared type as a field in `seq`:
   ```yaml
   seq:
     - id: common_part
       type: common_header  # All fields from common_header.ksy become accessible as common_part.magic, etc.
     - id: specific_part
       type: my_specific_data
   ```

2. **Nested Types for Hierarchy**:
   Define subtypes within `types` and nest them:
   ```yaml
   types:
     base_features:
       seq:
         - id: feature_flags
           type: u4
     extended_format:
       seq:
         - id: base
           type: base_features
         - id: extra_field
           type: u8
   ```

3. **Parameterized Types (for Generic Reuse)**:
   Though not full generics, `params` allow passing values (e.g., sizes, enums) to types, enabling flexible reuse.

4. **Multi-File Projects**:
   Large formats (e.g., in https://github.com/kaitai-io/kaitai_struct_formats) split into directories like `game/bioware/gff.ksy`, `game/bioware/utc.ksy`, with UTC importing GFF for shared logic.

#### Handling Your Specific Case (BioWare UTC XML)
Your document shows a perfect example of the recommended pattern:
- Separate files for generic GFF, GFF-XML serialization, and UTC-specific data.
- UTC XML imports all three and focuses only on its unique aspect (the full XML string).
- This avoids duplication while keeping each file focused and maintainable.

If you encounter compiler errors related to `_parent` type derivation, ensure all referenced types are reachable (used in `seq`, `instances`, or nested).

#### Comparison of Reuse Approaches

| Approach              | Description                              | Pros                          | Cons                          | Example Use Case             |
|-----------------------|------------------------------------------|-------------------------------|-------------------------------|------------------------------|
| Imports + Composition | Import shared .ksy, embed as field       | Clean, modular, official way | Manual nesting required      | GFF reused in UTC, UTW, etc. |
| Nested Types          | Define subtypes in one file              | No extra files               | File becomes large           | Small internal hierarchies   |
| Opaque Types          | Mark external types as opaque            | Integrate non-KS parsers     | Limited to external code     | Custom decompression         |
| Parametric Types      | Pass parameters to types                 | Generic-like reuse           | Limited to compile-time vals | Variable-length arrays       |

In summary, the evidence from official documentation, format gallery examples, and compiler schema confirms that **imports with composition** is the correct and only supported way to achieve reuse akin to inheritance in Kaitai Struct.

**Key Citations**
- [Kaitai Struct User Guide - Imports Section](https://doc.kaitai.io/user_guide.html)
- [Kaitai Struct KSY Schema (Imports Pattern)](https://github.com/kaitai-io/ksy_schema/blob/master/ksy_schema.json)
- [BioWare GFF/UTC Examples in Formats Library](https://formats.kaitai.io/)
- [Kaitai Struct Compiler Repository](https://github.com/kaitai-io/kaitai_struct_compiler)
