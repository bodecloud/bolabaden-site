---
source_url: "https://grok.com/c/1d76009c-09fa-4fb0-a6b2-697495bfc38c"
conversation_id: "1d76009c-09fa-4fb0-a6b2-697495bfc38c"
title: "Fixing bpy.types Import Errors"
extracted_at: "2026-06-29T16:16:28.554Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Fixing bpy.types Import Errors

Source: [Grok conversation](https://grok.com/c/1d76009c-09fa-4fb0-a6b2-697495bfc38c)

## User

_Time: 2025-12-06T00:40:40.145Z_

Import "bpy.types" could not be resolvedbasedpyrightreportMissingImports
how to fix in python? what's the package in pip that provides its type? is there a thing for mypy --install-types or what do i need to install for working with a blender plugin, exactly...?

## Assistant

_Time: 2025-12-06T00:41:54.902Z_

**Key Points**  
The `bpy` module (including `bpy.types`) is built into Blender's embedded Python interpreter and is not part of standard Python distributions, so tools like pyright/Pylance (in VS Code) or mypy report it as missing. The standard fix for add-on development is to install a community-maintained package that provides type stubs and fake implementations specifically for IDE support. The most widely recommended and up-to-date solution is **`fake-bpy-module`** from nutti (actively maintained up to Blender 4.4+ as of late 2025).

**Quick Fix**  
1. Find out your Blender version (Help → About Blender in Blender, or check the folder name).  
2. In your development virtualenv (or the Python environment VS Code is using), run one of these:

```bash
# For the very latest / daily build
pip install fake-bpy-module-latest

# Or exact version (recommended for maximum accuracy)
pip install fake-bpy-module-4.3   # for Blender 4.3
pip install fake-bpy-module-4.4   # for Blender 4.4 (if already released)
pip install fake-bpy-module-4.2   # etc.
```

3. Restart VS Code / reload the window. The red squiggles on `import bpy` and `bpy.types` disappear, and you get proper autocomplete and type checking.

This package works perfectly with pyright/Pylance, mypy, PyCharm, etc. No `mypy --install-types` is needed — you install the package manually because `bpy` is not in typeshed.

**Even Better: Use the "Blender Development" VS Code extension**  
Install the extension "Blender Development" by Jacques Lucke (marketplace ID: jacqueslucke.blender-development). It automatically:  
- Detects your Blender installation  
- Downloads and installs the correct `fake-bpy-module` version for you  
- Sets up debugging, run-configuration, snippets, and correct Python path  

Most Blender add-on developers in 2025 use this extension — it's the cleanest setup.

**Common Installation Commands for Recent Blender Versions**

| Blender Version | pip command                          | Notes                     |
|-----------------|--------------------------------------|---------------------------|
| 4.4            | `pip install fake-bpy-module-4.4`   | Current as of late 2025   |
| 4.3            | `pip install fake-bpy-module-4.3`   | Stable LTS                |
| 4.2            | `pip install fake-bpy-module-4.2`   | Still widely used          |
| Daily / main    | `pip install fake-bpy-module-latest` | Bleeding-edge API changes   |

**Alternatives (less recommended in 2025)**  
- `blender-stubs` on PyPI → largely unmaintained / incomplete compared to fake-bpy-module.  
- The full `bpy` wheel (`pip install bpy`) → this is the real Blender-as-Python-module package (~300–500 MB). It works but is massive and unnecessary for just typing/autocomplete.  
- Manually generating .pyi files inside Blender → possible but tedious and no longer needed.

**Why fake-bpy-module is the go-to solution**  
It ships real-looking modules with full docstrings, type annotations, and even some fake classes/methods so autocomplete feels almost identical to running inside Blender. pyright and mypy treat it exactly like the real `bpy`, so all `reportMissingImports` / `reportMissingModuleSource` warnings go away. It is the package the Blender community overwhelmingly recommends in 2024–2025 on Blender Artists, Stack Exchange, Reddit, and devtalk.blender.org.

After installing the package (or using the extension), your code will look like this with zero warnings:

```python
import bpy
from bpy.types import Operator, Panel

class SimpleOperator(Operator):
    bl_idname = "object.simple_operator"
    bl_label = "Simple Operator"
    # → full autocomplete and type checking works
```

That's all you need for clean, fully-typed Blender plugin development in VS Code or any other IDE.

**Key Citations**  
- https://github.com/nutti/fake-bpy-module  
- https://pypi.org/project/fake-bpy-module-latest/ (and versioned packages)  
- https://marketplace.visualstudio.com/items?itemName=jacqueslucke.blender-development  
- Blender Artists and Blender Stack Exchange threads consistently point to the same solution since ~2019–2025
