---
source_url: "https://grok.com/c/3af24cb0-abd7-4c55-a5be-2db2eaf98077"
conversation_id: "3af24cb0-abd7-4c55-a5be-2db2eaf98077"
title: "Namespace and Folder Structure Refactoring"
extracted_at: "2026-06-29T16:37:58.105Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Namespace and Folder Structure Refactoring

Source: [Grok conversation](https://grok.com/c/3af24cb0-abd7-4c55-a5be-2db2eaf98077)

## User

_Time: 2026-01-09T23:35:18.270Z_

```
ensure namespaces and folder structures within ./src/Andastra/Parsing achieve ALL of the following numbered **STRICT** ***MANDATORY*** requirements:
1. Matching ./vendor/PyKotor/Libraries/PyKotor/src/pykotor's folder hierarchy (use `tree` or `tree /F` commands), e.g. pykotor.resource.formats.ncs.ncs_data would become Andastra.Parsing.Resource.Formats.NCS (not NCS.NCSData, NCS.IONCS, or NCS.NCS.NCSData, none of that).
2. Relative path (currently G:/GitHub/Andastra/src/Andatra/<rel_path_here>) should be 1:1 with the namespace name. e.g. class DLG must be in `namespace Andastra.Parsing.Resource.Formats.GFF.Generics.DLG`
Currently seems to be nonsensically existing within `namespace Andastra.Parsing.Resource.Generics.DLG`
3. Under zero circumstances should a class name be reused and duplicated within another definition within another .cs file. For example `class ABCDEF` should NOT be defined in two files and/or two different namespaces. Zero circumstances should this ever happen. No exceptions!
4. NEVER use fully qualified names. e.g. @SaveSystem.cs (1939-1955) NEVER fully qualify to `Andastra.Runtime.Core.Interfaces.IModule`. Such uses significantly hide the real problems specified in rule 3 for example. Zero need to fully qualify the name due to this.
Be comprehensive, exhaustive, complete and thorough to the entirety of ./src/Andastra/Parsing.
STRICT REQUIREMENTS: DO **NOT** try to batch edit things. You MUST use the edit file tool, do NOT try to terminal grep replace or whatever.
Do not stop until completely done. Run `dotnet build Andastra.sln` to detemrine what we still need to do and keep track of your progress!!!!
```
please modify the above prompt based on web research on ai llm agent prompting getting the best results. Should accomplish the task i'm talking about but should FULLY rewrite the prompt without losing information/detail (in your own words).
Goals: get the prompt into a more concise form that uses less tokens and achieves higher quality outputs from ai llm based on the canonical best practices for ai llm coding agent prompting.

## Assistant

_Time: 2026-01-09T23:36:03.507Z_

Refactor the namespace and folder organization in the ./src/Andastra/Parsing directory to strictly comply with these mandatory rules across the entire codebase:

1. Align the structure exactly with the folder hierarchy in ./vendor/PyKotor/Libraries/PyKotor/src/pykotor (verify using `tree` or `tree /F` commands). For instance, map pykotor.resource.formats.ncs.ncs_data to namespace Andastra.Parsing.Resource.Formats.NCS—avoid variations like NCS.NCSData, NCS.IONCS, or NCS.NCS.NCSData.

2. Ensure every relative path from G:/GitHub/Andastra/src/Andastra/ matches the namespace 1:1. Example: Place class DLG in namespace Andastra.Parsing.Resource.Formats.GFF.Generics.DLG (correct current mismatch from Andastra.Parsing.Resource.Generics.DLG).

3. Prohibit any duplication or reuse of class names across files or namespaces—e.g., define class ABCDEF only once, in one file and namespace, with no exceptions.

4. Eliminate all fully qualified names (e.g., avoid Andastra.Runtime.Core.Interfaces.IModule in @SaveSystem.cs lines 1939-1955), as they obscure issues like those in rule 3.

Conduct a thorough, exhaustive review of the full ./src/Andastra/Parsing directory. Proceed step by step: First, analyze the current structure and compare it to PyKotor's. Identify all violations. Then, fix them one file at a time using only the edit_file tool—do not use batch edits, grep replacements, or any terminal commands for changes. After each fix, run `dotnet build Andastra.sln` to validate progress and identify remaining issues. Continue iteratively until the build succeeds without errors related to these rules and all requirements are fully met.
