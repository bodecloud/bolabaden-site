---
source_url: "https://grok.com/c/bca6c22f-dbaf-484d-aedd-51e825c3d18d"
conversation_id: "bca6c22f-dbaf-484d-aedd-51e825c3d18d"
title: "Python Three-Way Diff with Difflib"
extracted_at: "2026-06-29T16:21:30.271Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Python Three-Way Diff with Difflib

Source: [Grok conversation](https://grok.com/c/bca6c22f-dbaf-484d-aedd-51e825c3d18d)

## User

_Time: 2025-09-08T04:56:44.109Z_

how to diff3 in python? potentially with difflib if possible.

## Assistant

_Time: 2025-09-08T04:57:19.139Z_

The `difflib` module in Python doesn't natively support three-way diff (diff3), which compares three versions of a file to identify changes and often merge them. `difflib` is designed for two-way comparisons, producing diffs between two sequences. To achieve a three-way diff in Python, you can either use external tools like `diff3` via subprocess or implement a custom approach, potentially leveraging `difflib` for pairwise comparisons. Below, I’ll explain both options, focusing on why diff3 exists and how it solves problems compared to two-way diffs, while keeping it concise for an ADHD audience.

### Why diff3 and What It Solves
Two-way diffs (like `difflib`'s `Differ` or `unified_diff`) compare two files, showing additions, deletions, or changes. They’re fine for simple edits but fail in collaborative scenarios where multiple people edit the same file (e.g., in version control like Git). Diff3 compares three files—typically an original (base) and two modified versions (yours and theirs)—to detect conflicts and enable merging. It solves the problem of manual conflict resolution by identifying where edits overlap, unlike two-way diffs that can’t reconcile competing changes without external logic.

### Option 1: Using `difflib` for a Custom Three-Way Diff
Since `difflib` doesn’t have a direct diff3 function, you can approximate it by running pairwise diffs (base vs. yours, base vs. theirs) and analyzing the results to identify conflicts. This is less robust than a true diff3 but avoids external dependencies.

```python
import difflib

def diff3_approx(base, yours, theirs):
    # Split files into lines
    base_lines = base.splitlines()
    yours_lines = yours.splitlines()
    theirs_lines = theirs.splitlines()

    # Perform two-way diffs
    diff1 = difflib.Differ().compare(base_lines, yours_lines)
    diff2 = difflib.Differ().compare(base_lines, theirs_lines)

    # Collect changes
    changes_yours = [(i, line) for i, line in enumerate(diff1) if line.startswith(('+', '-'))]
    changes_theirs = [(i, line) for i, line in enumerate(diff2) if line.startswith(('+', '-'))]

    # Identify conflicts (simplified: same line modified differently)
    conflicts = []
    merged = []
    for i, line in enumerate(base_lines):
        your_change = next((c for c in changes_yours if c[0] == i), None)
        their_change = next((c for c in changes_theirs if c[0] == i), None)
        
        if your_change and their_change:
            if your_change[1] != their_change[1]:
                conflicts.append((i, your_change[1], their_change[1]))
                merged.append(f"<<<<<<< yours\n{your_change[1][2:]}\n=======\n{their_change[1][2:]}\n>>>>>>> theirs")
            else:
                merged.append(your_change[1][2:])  # Same change, no conflict
        elif your_change:
            merged.append(your_change[1][2:])
        elif their_change:
            merged.append(their_change[1][2:])
        else:
            merged.append(line)

    return merged, conflicts

# Example usage
base = "line1\nline2\nline3"
yours = "line1\nline2_modified\nline3"
theirs = "line1\nline2\nline3_modified"
merged, conflicts = diff3_approx(base, yours, theirs)
print("Merged:")
print("\n".join(merged))
print("\nConflicts:", conflicts)
```

**How It Works**: 
- Splits input texts into lines.
- Uses `difflib.Differ` to compare base vs. yours and base vs. theirs.
- Checks for conflicting changes (same line modified differently) and builds a merged output, marking conflicts with standard `<<<<<<<`/`=======`/`>>>>>>>` markers.
- Returns the merged text and a list of conflicts.

**Pros**: No external tools needed; pure Python.  
**Cons**: Simplistic, doesn’t handle complex cases (e.g., line moves or partial overlaps) as well as true diff3 tools. Slow for large files.  
**Worth Your Time?**: Only if you need a quick, dependency-free solution for small files. For production, it’s better to use a dedicated tool (see Option 2).

### Option 2: Using `diff3` via Subprocess
The `diff3` command-line tool (available on Unix-like systems) is the standard for three-way diffs, used by tools like Git. Python can call it via `subprocess`. This is faster and more reliable than a `difflib`-based solution for real-world use.

```python
import subprocess

def diff3_external(base, yours, theirs, base_path="base.txt", yours_path="yours.txt", theirs_path="theirs.txt"):
    # Write files to disk (diff3 requires files)
    with open(base_path, "w") as f:
        f.write(base)
    with open(yours_path, "w") as f:
        f.write(yours)
    with open(theirs_path, "w") as f:
        f.write(theirs)

    # Run diff3
    try:
        result = subprocess.run(
            ["diff3", "-m", yours_path, base_path, theirs_path],
            capture_output=True, text=True, check=True
        )
        return result.stdout, result.stderr
    except subprocess.CalledProcessError as e:
        return None, f"Error: {e.stderr}"

# Example usage
base = "line1\nline2\nline3"
yours = "line1\nline2_modified\nline3"
theirs = "line1\nline2\nline3_modified"
merged, errors = diff3_external(base, yours, theirs)
print("Merged:", merged)
print("Errors:", errors)
```

**How It Works**: 
- Writes input texts to temporary files.
- Calls the `diff3` command with `-m` (merge) to produce a merged output with conflict markers.
- Captures output and errors.

**Pros**: Leverages a battle-tested tool optimized for three-way merging. Handles complex cases better than a custom `difflib` approach.  
**Cons**: Requires `diff3` installed (standard on Linux/Mac, not on Windows unless you install it, e.g., via Git Bash or WSL). File I/O adds overhead.  
**Worth Your Time?**: Yes, if you’re on a Unix-like system and need robust merging for version control or collaborative editing. For Windows, it’s less convenient unless you set up `diff3`.

### Comparison: Custom `difflib` vs. `diff3` via Subprocess
- **Speed**: `diff3` is faster for large files; `difflib` is slow due to Python’s overhead and naive conflict detection.
- **Accuracy**: `diff3` handles edge cases (e.g., moved lines, partial overlaps) better; `difflib`-based solutions miss nuanced conflicts.
- **Ease of Use**: `difflib` is pure Python, no setup needed; `diff3` requires an external tool, which may not be available everywhere.
- **Flexibility**: `difflib` allows custom logic (e.g., tweaking conflict rules); `diff3` is rigid but standardized.

### Recommendation
Use the `diff3` subprocess approach if you’re on a Unix-like system and need reliable three-way merging for real projects—it’s faster, more accurate, and industry-standard. If you’re stuck without `diff3` (e.g., Windows without setup) or need a quick prototype, the `difflib` approach is a fallback, but it’s not worth investing in for serious use. If you need a cross-platform library, consider `pydiff` or similar, but they’re less common and not as integrated as `diff3`.

**Why Not Something Else?**: Libraries like `python-diff` exist, but they’re less maintained and don’t add much over `diff3`. For complex merging, tools like Git’s merge algorithms are objectively better but overkill unless you’re building a VCS. If you’re just diffing small texts, `difflib` is enough; for real merging, stick with `diff3`.

## User

_Time: 2025-09-08T05:00:14.242Z_

subprocess is completely impossible as a solution. Find a pure pythonic way to do diff3 without any discrepancies and without any custom code whatsoever. Must be a supported and maintained solution.

## Assistant

_Time: 2025-09-08T05:02:23.826Z_

merge3 library handles three-way merging of text sequences like lines, created to enable VCS tools like Bazaar/Breezy to resolve changes from two branches against a base without shelling out to diff3 command, solving the cross-platform and dependency issues that subprocess calls introduce compared to difflib's limited two-way diffs which can't auto-reconcile competing edits.

Install via pip install merge3, then use like this for strings split into lines:

import merge3

base = ['line1', 'line2', 'line3']

yours = ['line1', 'line2_modified', 'line3']

theirs = ['line1', 'line2', 'line3_modified']

m3 = merge3.Merge3(base, yours, theirs)

merged_lines = list(m3.merge_lines())

# merged_lines will have conflict markers if overlaps occur

Worth time if you need reliable merging in scripts without external tools; objectively better than rolling your own or difflib hacks since it's tested in production VCS and line-based like standard diff3.
