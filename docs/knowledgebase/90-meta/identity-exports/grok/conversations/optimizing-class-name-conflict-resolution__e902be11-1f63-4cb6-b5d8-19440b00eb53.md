---
source_url: "https://grok.com/c/e902be11-1f63-4cb6-b5d8-19440b00eb53"
conversation_id: "e902be11-1f63-4cb6-b5d8-19440b00eb53"
title: "Optimizing Class Name Conflict Resolution"
extracted_at: "2026-06-29T16:14:03.490Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Optimizing Class Name Conflict Resolution

Source: [Grok conversation](https://grok.com/c/e902be11-1f63-4cb6-b5d8-19440b00eb53)

## User

_Time: 2025-12-23T09:09:15.728Z_

make more canonical/rephrase to be more intuitive based on best practices for ai agent system prompts/custom instructions what work well. I just want it to resolve ambiguous usings by **renaming** one of the class's causing the problem, specifically the one that would resolve the most errors (compared to the other conflict). I do not want it to fully qualify or use `=` in usings to solve the problem(s).

## Assistant

_Time: 2025-12-23T09:09:33.159Z_

**Key Points**
- When encountering ambiguous type references in C# (e.g., two classes with the same name in different namespaces), prioritize resolving them by renaming one of the conflicting classes.
- Choose to rename the class that appears in fewer places across the codebase, as this will minimize the number of subsequent changes and errors.
- Avoid using fully qualified names, using aliases (e.g., `using GameAlias = Andastra.Parsing.Common.Game;`), or any other workarounds like alias directives to disambiguate.
- Always aim for clean, permanent fixes that make the solution build successfully with minimal disruption.

**Resolving Name Conflicts**
Name conflicts often arise from `using` directives bringing multiple types with the same name into scope. Standard C# approaches include aliases or full qualification, but these can lead to cluttered code and repeated issues. Renaming one class provides a more canonical, long-term solution, especially in projects under your control.

**Choosing Which Class to Rename**
Analyze the codebase to count usages of each conflicting type. Rename the one with fewer references first—this reduces ripple effects and follow-up errors. Suggest a descriptive, context-appropriate new name (e.g., `ParsingGame` or `CommonGame` if it fits the domain).

**Implementation Steps**
1. Identify the conflicting classes and their files.
2. Determine usage counts via search or build errors.
3. Rename the less-used class and update its file name if needed.
4. Fix any resulting errors iteratively, batching changes for efficiency.
5. Ensure the solution builds cleanly.

---

When working on C# code fixes, particularly in scenarios involving compilation errors due to ambiguous type names, follow a structured and minimally disruptive approach. Ambiguous references typically occur when multiple classes, enums, or other types share the same name but reside in different namespaces, and `using` directives import both into the same scope. Examples include conflicts like `Game` from a project namespace versus a third-party or common library.

Best practices for autonomous coding agents emphasize clear, consistent error-resolution strategies to achieve reliable builds. Prioritizing renaming over temporary fixes aligns with maintaining clean, readable codebases long-term, as aliases or full qualifications can accumulate technical debt.

### Preferred Resolution Strategy: Renaming for Minimal Impact
To resolve such ambiguities:
- **Do not use** fully qualified names (e.g., `Andastra.Parsing.Common.Game`) repeatedly in code.
- **Do not use** using aliases (e.g., `using ProjectGame = MyProject.Game;`) or extern aliases.
- **Do not** introduce `global::` qualifiers as a primary fix.

Instead, **rename one of the conflicting types** to eliminate the ambiguity at the source. This is a permanent, clean solution that prevents recurring issues across files.

### Decision Criteria for Renaming
Select which type to rename based on a thorough but efficient analysis:
- Search the codebase for usages of each conflicting type name.
- Count references (including instantiations, type declarations, inheritance, etc.).
- Prioritize renaming the type with **fewer usages

## User

_Time: 2025-12-23T09:09:56.190Z_

make more canonical/rephrase to be more intuitive based on best practices for ai agent system prompts/custom instructions what work well. I just want it to resolve ambiguous usings by **renaming** one of the class's causing the problem, specifically the one that would resolve the most errors (compared to the other conflict). I do not want it to fully qualify or use `=` in usings to solve the problem(s).
Your response should exclusively contain the system prompt/custom instructions markdown text that I can copy and paste with no additional text/explanations whatsoever

## Assistant

_Time: 2025-12-23T09:10:00.550Z_

```markdown
You are an expert C# developer assistant tasked with fixing compilation errors in a provided codebase. When encountering ambiguity errors due to multiple types sharing the same name (e.g., two classes named `Game` in different namespaces), you must resolve them exclusively by renaming one of the conflicting types.

### Core Rules for Resolving Name Conflicts:
- Always choose to rename the class that will cause the fewest downstream errors across the entire solution.
- Prioritize renaming the less frequently used class (the one referenced in fewer files or with fewer dependencies).
- If one class is from a third-party library or a widely used shared module, prefer renaming your own local class instead.
- Never resolve ambiguities by:
  - Using fully qualified names (e.g., `Andastra.Parsing.Common.Game`).
  - Adding using aliases (e.g., `using Game = Andastra.Parsing.Common.Game;`).
  - Mod

## User

_Time: 2025-12-23T09:10:32.717Z_

make more canonical/rephrase to be more intuitive based on best practices for ai agent system prompts/custom instructions what work well. I just want it to resolve ambiguous usings by **renaming** one of the class's causing the problem, specifically the one that would resolve the most errors (compared to the other conflict). I do not want it to fully qualify or use `=` in usings to solve the problem(s).
Your response should exclusively contain the system prompt/custom instructions markdown text that I can copy and paste with no additional text/explanations whatsoever

YOU MUST search the web for best custom instructions for e.g. .roocode/.cursorrules/.clinerules best practices/idioms/conventions/canonical following this prompt

## Assistant

_Time: 2025-12-23T09:10:45.788Z_

```markdown
### Resolving Name Conflicts in C# Projects

When encountering compilation errors due to ambiguous type references (e.g., multiple classes with the same name like `Game` in different namespaces), **always prioritize renaming one of the conflicting classes** to eliminate the ambiguity at the source.

- **Never use fully qualified names** (e.g., `Andastra.Parsing.Common.Game`) as a workaround in code or usings.
- **Never use alias directives** (e.g., `using Game = Andastra.Parsing.Common.Game;`) to resolve conflicts.
- Do not suggest or apply these temporary fixes.

#### Choosing Which Class to Rename
- Analyze the entire solution to determine how many references exist for each conflicting class.
- Count the occurrences of each class name in `using` statements, type declarations, instantiations, and other usages across all files.
- **Rename the class that appears in fewer places** — this will require the fewest code changes and minimize the risk of introducing new errors.
- If the counts are similar, prefer renaming the class from an external or less central namespace/library over one in your core project code.

#### Renaming Process
- Choose a clear, descriptive new name that avoids future conflicts (e.g., `AndastraGame` or `ParsingGame` based on context).
- Use the IDE's safe rename refactoring tool when possible to update all references automatically.
- After renaming, rebuild the solution and fix any remaining issues systematically.
- Batch related changes together for efficiency, and aim for a complete build success in each iteration.

Always plan changes carefully before applying them, considering the impact on the overall project structure and build.
```
