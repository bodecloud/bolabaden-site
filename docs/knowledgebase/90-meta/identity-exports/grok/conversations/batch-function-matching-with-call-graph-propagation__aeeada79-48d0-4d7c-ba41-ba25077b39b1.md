---
source_url: "https://grok.com/c/aeeada79-48d0-4d7c-ba41-ba25077b39b1"
conversation_id: "aeeada79-48d0-4d7c-ba41-ba25077b39b1"
title: "Batch Function Matching with Call Graph Propagation"
extracted_at: "2026-06-29T16:10:19.194Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Batch Function Matching with Call Graph Propagation

Source: [Grok conversation](https://grok.com/c/aeeada79-48d0-4d7c-ba41-ba25077b39b1)

## User

_Time: 2026-02-21T15:33:45.540Z_

please provide a high level summary of what this code does and what algorithms it uses.

## Assistant

_Time: 2026-02-21T15:33:59.753Z_

Here is a **high-level summary** of what the provided code does, together with the main algorithms/strategies it employs.

### Overall Purpose

This method — `handleBatchMatchFunction` — implements a **batch function matching & metadata propagation** system inside a Ghidra-like reverse-engineering environment.

It takes:

- One **source program** (already analyzed)
- A list of function identifiers (addresses, names, symbols…)
- One or more **target programs** (binaries/libraries/versions to match against)

… and tries to:

1. Find corresponding functions in each target program using several layers of increasingly fuzzy matching strategies
2. When a sufficiently confident 1:1 match is found → **propagate** metadata from source → target:
   - function name
   - function tags
   - function comment

The whole process is designed for **bulk / batch renaming & annotation propagation** across slightly different versions / variants / patches / sibling binaries of the same codebase (very common use-case in malware family tracking, firmware variant comparison, patch diffing, etc.).

### Main Workflow Stages

1. **Parameter parsing & target program resolution**  
   Reads similarity threshold, instruction limit, batch size, propagation flags, list of target program paths.

2. **Source function resolution + profiling**  
   For each requested identifier:
   - Resolve to a Ghidra `Function` (by address or name)
   - Skip externals / thunks / degenerate functions
   - Build a rich **function profile** (via `FunctionFingerprintUtil.buildFunctionProfile`)

3. **Build enhanced indexes for every target program**  
   `FunctionFingerprintUtil.buildEnhancedIndex` — most likely precomputes fingerprints, constant sets, string sets, callee sets, structural hashes etc. for fast lookup.

4. **Parallel per-target matching & propagation loop**

   For each target program:

   - **Primary matching phase**  
     For every source function → call `findBestMatches(…, minSimilarity, max 10 candidates)`  
     → returns list of scored candidate functions in the target

   - **Decision heuristics** (very BinDiff-like)
     - No candidates → skip
     - Exactly one candidate **or** clear score gap (> 0.05) to second best → considered **unambiguous**
     - Otherwise → marked ambiguous (not propagated)

   - **Propagation** (name / tags / comment) inside a transaction

   - **Call-graph propagation phase** (BinDiff-style anchor expansion)  
     Use the confirmed (high-confidence) matches as **anchors**  
     → run `propagateCallGraph(…)` to discover additional plausible matches by walking the call-graph neighborhood  
     → apply the same name/tag/comment propagation to these extra matches

5. **Result aggregation & statistics**  
   Per-target and global counters: processed / matched / propagated / graph-propagated / ambiguous / no-match

### Matching Strategies (in decreasing order of strictness)

The code comment at the top already gives the intended **layered cascade** (even if not every layer is explicitly visible in this snippet):

1. **Exact fingerprint**  
   (probably hash of normalized instruction stream / bytes / pcode / …)

2. **Callee-set**  
   (set of called function hashes / fingerprints — very strong when call-graph is stable)

3. **String-refs**  
   (referenced string literals — very discriminative in real-world code)

4. **Constant-set**  
   (magic constants / immediate values used inside function)

5. **Multi-feature fuzzy**  
   (weighted combination of several features — most likely what `findBestMatches` does)

6. **Structural scan**  
   (probably graph isomorphism hints, basic block count, edge count, loop count, etc.)

7. **Call graph propagation**  
   (post-matching expansion using already confirmed matches as seeds / anchors)

This is a **classic multi-strategy / multi-pass** approach very similar in philosophy to:

- **BinDiff** (Google)
- **Diaphora**
- **Bindiff-inspired plugins**
- Ghidra **BSim** (but BSim is vector/similarity-based; this code appears more classical-feature-based)

### Key Design Choices & Nuances

- **Safety / conservativeness**  
  Only propagates on **unambiguous** matches (single best or large score gap) → avoids polluting target with wrong renames.

- **Performance optimizations**  
  - Pre-builds enhanced index per target  
  - Parallel streams for per-target and per-function work  
  - Batched transaction commits + auto-save

- **Extensibility**  
  All core logic lives in `FunctionFingerprintUtil` → easy to tune fingerprints, similarity metrics, propagation rules.

- **Edge-case handling**  
  Skips degenerate functions, externals, handles duplicate name exceptions, logs progress verbosely.

### Summary in one sentence

The code implements a robust, multi-strategy, batch-oriented **function correspondence finder + metadata propagator** across binaries, using a cascade of fingerprinting techniques (exact → structural → fuzzy) followed by **BinDiff-style call-graph seed expansion**, with conservative unambiguous-match criteria to safely rename and annotate functions in multiple target programs at once.

Let me know if you'd like a deeper dive into any specific phase (e.g. what a typical `FunctionProfile` most likely contains, how call-graph propagation usually works, or how to make it more aggressive / more conservative).

## User

_Time: 2026-02-21T15:34:20.082Z_

please provide a high level summary of what this code does and what algorithms it uses.

be concise, do not use secctions/markdown formatting talk in sentences only. 

## Assistant

_Time: 2026-02-21T15:34:34.182Z_

This Java method handles batch matching of functions from a source program against one or more target programs using a multi-strategy approach to identify and propagate metadata like names, tags, and comments. It begins by resolving function identifiers in the source program, building profiles with fingerprints limited by max instructions, and creating enhanced indexes for each target program. For each target, it parallelizes the search for best matches per source function using strategies in order: exact fingerprint, callee-set, string references, constant-set, multi-feature fuzzy, structural scan, and finally call graph propagation inspired by BinDiff to handle additional matches via anchor points from confirmed ones. Matches are evaluated for ambiguity based on score differences, with propagation applied only to unambiguous high-similarity results, while batching transactions for efficiency, logging progress, auto-saving changes, and aggregating summary statistics across targets, including errors for unresolved or degenerate functions. The primary algorithms involve function fingerprinting for similarity scoring, parallel scored matching with minimum similarity thresholds, and graph-based propagation using caller-callee relationships to extend matches beyond direct fingerprints.

## User

_Time: 2026-02-21T15:36:02.924Z_

please provide a high level summary of what this code does and what algorithms it uses.

be concise, do not use secctions/markdown formatting talk in sentences only. Space your response out significantly. And provide a full exhaustive complete mermaid representation of the code.

## Assistant

_Time: 2026-02-21T15:36:43.009Z_

This method handles batch matching of functions from a source program to one or more target programs using a sequence of matching strategies to identify similar functions and propagate metadata like names, tags, and comments.

It starts by parsing request parameters such as maximum instructions per function, minimum similarity threshold, propagation flags, and batch size for processing.

Next, it resolves the target programs based on provided paths, excluding the source itself, and builds a map of all source functions by their names for quick lookup.

For each function identifier in the input list, it attempts to resolve the corresponding source function by address, symbol, or name, skipping external or degenerate functions, and constructs a detailed function profile using fingerprinting utilities.

It then creates enhanced program indexes for each target program, which include fingerprints and other features for efficient matching.

In parallel across targets, it finds the best matching candidates in the target for each source profile using multi-strategy matching, including exact fingerprints, callee sets, string references, constant sets, multi-feature fuzzy matching, structural scans, and evaluates them based on similarity scores.

For unambiguous high-scoring matches, it propagates the selected metadata to the target functions within transactions to ensure atomicity, and collects confirmed matches.

After initial matching, it applies call graph propagation, similar to BinDiff techniques, using confirmed matches as anchors to infer and propagate additional matches through caller-callee relationships.

Throughout, it logs progress, handles errors, aggregates statistics per target like processed, matched, propagated, ambiguous, and no-match counts, and compiles a comprehensive JSON result with summaries and per-target details.

The primary algorithms involved are function fingerprinting for feature extraction, similarity-based scoring for candidate ranking, and graph-based propagation over call graphs to extend matches beyond direct similarities.

graph TD

    A[Start: handleBatchMatchFunction] --> B[Parse Parameters: maxInstructions, minSimilarity, propagateNames, propagateTags, propagateComments, batchSize]

    B --> C[Resolve Target Programs: resolveTargetProgramsForMatching]

    C --> D{Targets Empty?}

    D -->|Yes| E[Return Error: No target programs]

    D -->|No| F[Build Source Functions Map by Name: sourceByName]

    F --> G[Resolve Source Functions Loop: For each functionIdentifier]

    G --> H[Resolve Address/Symbol: AddressUtil.resolveAddressOrSymbol]

    H --> I{Function Found?}

    I -->|No| J[Lookup by Name in sourceByName]

    J --> K{Function Found and Not External?}

    K -->|No| L[Add Error: Function not found or skipped]

    K -->|Yes| M[Check Degenerate: FunctionFingerprintUtil.isDegenerateFunction]

    M --> N{Is Degenerate?}

    N -->|Yes| O[Add Error: Skipped degenerate]

    N -->|No| P[Build Profile: FunctionFingerprintUtil.buildFunctionProfile]

    P --> Q{Profile Built?}

    Q -->|No| R[Add Error: Failed to build profile]

    Q -->|Yes| S[Add to Resolved List: SourceResolved]

    S --> T[Log Progress if Interval Met]

    T --> U[End Resolve Loop]

    U --> V[Build Target Indexes: For each Target Program]

    V --> W[Build Enhanced Index: FunctionFingerprintUtil.buildEnhancedIndex]

    W --> X[Add to targetIndexes Map]

    X --> Y[End Target Indexes Loop]

    Y --> Z[Parallel Process Targets: targetPrograms.parallelStream]

    Z --> AA[For Each Target: Filter Valid Targets]

    AA --> AB[Get Target Index from Map]

    AB --> AC{Index Exists?}

    AC -->|No| AD[Skip Target]

    AC -->|Yes| AE[Find Best Matches Parallel: resolved.parallelStream]

    AE --> AF[Call FunctionFingerprintUtil.findBestMatches for Each Source Profile]

    AF --> AG[Collect MatchEvals]

    AG --> AH[Start Transaction: target.startTransaction]

    AH --> AI[Process Matches Loop: For each MatchEval]

    AI --> AJ[Increment Processed]

    AJ --> AK{Processed % batchSize == 0?}

    AK -->|Yes| AL[End Transaction Commit, Start New, AutoSave]

    AL --> AM[Get Matches List]

    AK -->|No| AM

    AM --> AN{Matches Empty?}

    AN -->|Yes| AO[Increment NoMatch]

    AN -->|No| AP[Increment Matched]

    AP --> AQ[Get Best Match: matches.get(0)]

    AQ --> AR[Check Unambiguous: size==1 or score diff >0.05]

    AR --> AS{Unambiguous?}

    AS -->|No| AT[Increment Ambiguous]

    AS -->|Yes| AU[Get Target Function at EntryPoint]

    AU --> AV{Function Exists?}

    AV -->|No| AW[Continue]

    AV -->|Yes| AX[Propagate if Flags Set: setName, addTag, setComment]

    AX --> AY[Increment Propagated]

    AY --> AZ[Get Target Profile from Index]

    AZ --> BA{Profile Exists?}

    BA -->|Yes| BB[Add to Confirmed Matches]

    BA -->|No| BC[End Propagation for This Match]

    BB --> BC

    BC --> BD[End Process Matches Loop]

    BD --> BE{Confirmed Matches Not Empty?}

    BE -->|Yes| BF[Call Graph Propagation: FunctionFingerprintUtil.propagateCallGraph]

    BF --> BG[Get Extra Matches]

    BG --> BH[Process Extra Matches Loop: For each Extra]

    BH --> BI[Get Source Function at Key]

    BI --> BJ{Valid Source?}

    BJ -->|No| BK[Continue]

    BJ -->|Yes| BL[Get Target Function at Candidate EntryPoint]

    BL --> BM{Valid Target?}

    BM -->|No| BN[Continue]

    BM -->|Yes| BO[Propagate if Flags and Conditions: setName if not Default, addTags, setComment]

    BO --> BP[Increment GraphPropagated if Name Propagated]

    BP --> BQ[End Extra Matches Loop]

    BE -->|No| BR[Log Target Done]

    BQ --> BR

    BR --> BS[End Transaction Commit, AutoSave, Invalidate Caches]

    BS --> BT[Collect PerTargetResult]

    BT --> BU[End Parallel Targets]

    BU --> BV[Aggregate All PerTargetResults]

    BV --> BW[Compute Totals: processed, matched, etc.]

    BW --> BX[Build TargetResults List]

    BX --> BY[Build Summary Map]

    BY --> BZ[Build Final Result Map: batchOperation, requested, resolved, etc.]

    BZ --> CA[Add Errors if Any]

    CA --> CB[Log Batch Complete]

    CB --> CC[Return JSON Result: createJsonResult]

    CC --> CD[End]
