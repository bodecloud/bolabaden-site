---
source_url: "https://grok.com/c/5bcde028-7c13-4f28-bbfd-50c6a1ff4303"
conversation_id: "5bcde028-7c13-4f28-bbfd-50c6a1ff4303"
title: "PyInstaller PyPy Compatibility Issues"
extracted_at: "2026-06-29T16:38:08.766Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# PyInstaller PyPy Compatibility Issues

Source: [Grok conversation](https://grok.com/c/5bcde028-7c13-4f28-bbfd-50c6a1ff4303)

## User

_Time: 2025-11-10T00:43:27.873Z_

before i post this PR comment:

```
@rokm 

Potentially if this isn't feasable or goes against the direction the pyinstaller team is headed, an alternative PR I could submit is to just fast fail immediately when someone installs `pyinstaller` on pypy, along with some documentational changes that state pypy isn't compatible.

I'm not even certain why wheels exist and are built, given that everything i've attempted to compile with pyinstaller seems to be failing for similar reasons?

Am I missing something?
```

I'd like to fact check everything I'm discussing. Does pyinstaller support pypy at all? please answer the questions I've made in comments to the best of your ability, and then expand my intended PR comment to show that we've acutally done the research, as to not waste rokm's time.
 
PR in question is https://github.com/pyinstaller/pyinstaller/pull/9295

## Assistant

_Time: 2025-11-10T00:45:00.481Z_

- PyInstaller does not officially support PyPy, as it relies on CPython-specific internals for both building and runtime execution of bundled apps.
- Attempts to use PyInstaller on PyPy typically fail due to differences in implementation, such as missing APIs in PyPy's shared libraries and bytecode handling.
- A draft PR exists to add partial support for PyPy 3.11+ on Windows, but it currently only addresses build-time issues, not runtime failures.

### Background on Compatibility
PyInstaller's documentation and FAQ emphasize support for official CPython releases (Python 3.8 and newer), with no mention of PyPy.<grok:render card_id="800455" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render><grok:render card_id="ae650d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="f84012" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render> Community discussions, including Stack Overflow and Reddit, confirm that PyInstaller is tightly coupled to CPython's mechanics, making it incompatible with PyPy without significant modifications.<grok:render card_id="ea1860" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render><grok:render card_id="27ea8c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render> For instance, PyPy's shared library lacks certain CPython functions like `Py_DecRef`, causing runtime errors in bundled executables.<grok:render card_id="659c74" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>

### Feasibility and Project Direction
Adding full PyPy support appears challenging and may not align with PyInstaller's core focus on CPython, given the deep integration with CPython-specific features.<grok:render card_id="459931" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render> However, your draft PR (#9295) is a step toward addressing build-time issues on Windows for PyPy 3.11+, which is promising.<grok:render card_id="0e835a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render> Maintainer feedback highlights that runtime support remains a major hurdle, as the bootloader depends on CPython APIs not present in PyPy.<grok:render card_id="8325ed" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render> If runtime can't be resolved easily, the project might prefer maintaining CPython exclusivity rather than partial support.

### Alternative Approach: Fast-Fail on PyPy
Implementing a fast-fail during installation on PyPy, combined with updated documentation stating incompatibility, could prevent user frustration.<grok:render card_id="9caad0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render><grok:render card_id="92640d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render> This aligns with reports of consistent failures in bundling PyPy-based apps.<grok:render card_id="9b792b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render> Docs could link to alternatives like Nuitka or cx_Freeze, which have varying PyPy compatibility.<grok:render card_id="6c5991" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">20</argument>
</grok:render>

### Wheels and Builds
PyInstaller does not provide pre-built wheels for PyPy on PyPI; all listed wheels are for CPython across various platforms (e.g., Windows, macOS, Linux).<grok:render card_id="42ce6e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> Installation on PyPy falls back to the source distribution, which allows pip to attempt it but often leads to the compatibility issues you've encountered.<grok:render card_id="28794d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render> This explains why installation succeeds but usage fails—wheels are built only for supported CPython environments to ensure reliability.<grok:render card_id="46e8e7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render>

### Potential Oversights
You might be missing that PyInstaller's design assumes CPython's internals, including bytecode opcodes and DLL handling, which differ in PyPy.<grok:render card_id="f1b76a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render><grok:render card_id="c72b79" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render> Some users report partial success with older PyPy versions or specific workarounds, but these are not officially endorsed and often break at runtime.<grok:render card_id="fd11bb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render> If your use case involves bundling PyPy-optimized code, consider contributing to upstream PyPy issues (e.g., for better CPython API parity) or exploring PyPy-specific bundlers.<grok:render card_id="2594ef" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render>

---

@rokm

To provide more context on my PR (#9295), I've researched PyInstaller's compatibility with PyPy to ensure this isn't wasting time. Based on official docs, community discussions, and PyPI details, PyInstaller does not officially support PyPy—it's designed for CPython 3.8+ and relies on CPython-specific internals like bytecode opcodes (e.g., EXTENDED_ARG_QUICK, PRECALL) and shared library APIs (e.g., Py_DecRef).<grok:render card_id="b32659" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render><grok:render card_id="d5a9ec" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render><grok:render card_id="fd9963" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render><grok:render card_id="66e41b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render> This explains the build-time errors I addressed (e.g., missing sys.dllhandle on Windows, cffi issues in win32-ctypes), but as you noted, runtime failures persist due to bootloader incompatibilities.<grok:render card_id="5f737a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render>

Potentially, if full PyPy support (including runtime) isn't feasible or aligns with the project's direction—given the deep CPython dependencies—an alternative PR I could submit is to fast-fail immediately when installing `pyinstaller` on PyPy (e.g., via a setup.py check for `sys.implementation.name != 'cpython'`), along with documentation updates explicitly stating PyPy incompatibility and suggesting alternatives like Nuitka.<grok:render card_id="f9b118" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render><grok:render card_id="096a5b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render> This could reduce user confusion, as multiple reports show consistent failures when attempting to bundle with PyPy.<grok:render card_id="e5d89b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render card_id="11961d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render>

Regarding wheels: PyInstaller doesn't build PyPy-specific wheels on PyPI; only CPython wheels are provided (e.g., for Windows AMD64, macOS universal2).<grok:render card_id="bfef45" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> On PyPy, it installs from source, which succeeds but leads to the issues we've seen—likely why everything I've tried fails similarly.<grok:render card_id="b8e992" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render><grok:render card_id="0a9ebe" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">18</argument>
</grok:render> Am I missing something here, like partial support in older versions or specific configs?

If you'd prefer pursuing full support, I can iterate on this PR to tackle runtime (e.g., PyPy-compatible bootloader adjustments), or expand to other OS/PyPy versions as mentioned in my earlier note.<grok:render card_id="5efb4c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render> Let me know your thoughts!

#### Table: Key PyInstaller vs. PyPy Compatibility Issues
| Issue Type | Description | Examples from Research | Potential Fix |
|------------|-------------|------------------------|---------------|
| Build-Time | Missing opcodes in PyPy's `dis.opmap`; exceptions in `dis.get_instructions()` | PyPy issue #4391; PR #9295 fixes like opcode fallbacks | PR #9295 addresses for Windows PyPy 3.11+ |
| Runtime | Bootloader requires CPython APIs not in PyPy's shared libs | `Py_DecRef` missing; "hello world" exe fails | Major rework needed; not yet implemented |
| Installation | No PyPy wheels; source install works but leads to errors | PyPI lists only CPython wheels | Fast-fail in setup.py for non-CPython |
| Documentation | No mention of PyPy support | Docs/FAQ focus on CPython | Add explicit incompatibility notes |

This research draws from PyInstaller's docs, GitHub issues/PRs, Stack Overflow, Reddit, and PyPI.<grok:render card_id="1c7b52" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="ef6ff3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render><grok:render card_id="456513" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render><grok:render card_id="4f6f7d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">13</argument>
</grok:render><grok:render card_id="7be796" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render><grok:render card_id="0c0bf3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render><grok:render card_id="7a11a4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render><grok:render card_id="f56ece" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render><grok:render card_id="a5685a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render>

**Key Citations:**
- [PyInstaller Manual — PyInstaller 6.16.0 documentation](https://pyinstaller.org/en/stable/)
- [Can not package pypy as single package？ · Issue #4984](https://github.com/pypy/pypy/issues/4984)
- [pyinstaller](https://pypi.org/project/pyinstaller/)
- [compat: Add PyPy Windows support by th3w1zard1 · Pull Request #9295 · pyinstaller/pyinstaller](https://github.com/pyinstaller/pyinstaller/pull/9295)
- [PyPy and PyInstaller - python - Stack Overflow](https://stackoverflow.com/questions/22025366/pypy-and-pyinstaller)
- [issue turning pypy to exe with pyinstaller. : r/pythonhelp - Reddit](https://www.reddit.com/r/pythonhelp/comments/tmuzcx/issue_turning_pypy_to_exe_with_pyinstaller/)
- [Can not package pypy as single package？ · Issue #4984 - GitHub](https://github.com/pypy/pypy/issues/4984)
- [PyInstaller Manual — PyInstaller 6.16.0 documentation](https://www.pyinstaller.org/)
- [FAQ](https://github.com/pyinstaller/pyinstaller/wiki/FAQ)
