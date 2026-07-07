---
source_url: "https://grok.com/c/874a3997-501f-4c2b-b36e-cb31a7a97865"
conversation_id: "874a3997-501f-4c2b-b36e-cb31a7a97865"
title: "PyInstaller PyPy Compatibility Challenges"
extracted_at: "2026-06-29T16:18:07.612Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# PyInstaller PyPy Compatibility Challenges

Source: [Grok conversation](https://grok.com/c/874a3997-501f-4c2b-b36e-cb31a7a97865)

## User

_Time: 2025-11-17T10:13:58.340Z_

https://github.com/pyinstaller/pyinstaller/pull/9295

I submitted a pr before I knew what I was doing. They closed it due to no possibility of it getting implemented. I then followed up with basically ‘well why the heck does pip install pyinstaller succeed on pypy in the first place?’ Please read EVERY SINGLE SUBSEQUENT MESSAGE and explain exactly what it and any terminology means. I’m BEYOND lost as I really thought I understood Python until this point. Fuck is cp3/py3 and ABI tagging and what on earth is that final comment talking about? Explain all low level operations and wtf everything means.

Literally EVERY SINGLE response after th3w1zard1’s final comment should be verbatim provided in your message and any and all parts of all messages explained in detail.

## Assistant

_Time: 2025-11-17T10:15:08.268Z_

### Initial Context

PyInstaller bundles Python apps into executables. It works with CPython (standard Python interpreter from python.org). PyPy is an alternative interpreter for faster performance in some cases, but it differs in internals like how it handles bytecode or shared libraries. Your PR tried adding PyPy support, but maintainers closed it because full compatibility (build + runtime) isn't feasible due to those differences. Post-closure discussion focuses on preventing PyInstaller installs on PyPy to avoid false hope, since it installs but fails later.

This stems from Python's packaging system, which evolved from simple tarballs to wheels (pre-built binaries) for faster installs. Wheels use filenames with tags to match interpreter, version, OS, etc. If tags mismatch, pip falls back to source install (sdist), where custom checks can fail early.

Now, every response after your (th3w1zard1's) final comment, verbatim, with breakdowns.

### Response 1: bwoodsend's Comment

**Verbatim:**

"It would have to be another runtime check since our wheels aren't ABI tagged and therefore `pip install pyinstaller` on PyPy takes a precompiled wheel."

**Explanation:**

Starts from how pip decides installs. Pip checks wheel filenames for compatibility tags (like "py3-none-any" for pure Python 3, any platform). ABI (Application Binary Interface) defines how code interacts at binary level—e.g., how functions call each other in compiled extensions.

PyInstaller's wheels lack ABI tags (no "abi3" or similar), so they're generic "py3" (pure Python 3). PyPy sees this as compatible, grabs the precompiled wheel (zipped binary files for quick unpack), and installs without building. But PyPy's internals differ, so it runs into issues later.

"Runtime check" means adding code that errors when you import/run PyInstaller on PyPy, not during install. This is a fallback because install-time blocks are harder without tag changes.

Why created? Wheels solved slow installs from source (compiling C extensions). Before wheels (pre-2012), everything built from sdist, slower but more flexible for checks.

### Response 2: rokm's Comment

**Verbatim:**

"Reading through https://packaging.python.org/en/latest/specifications/platform-compatibility-tags/, it seems to me we could tag our wheels as `cp3` instead of `py3`. This would hopefully force PyPy to try installing from sdist, where we could throw an error about unsupported interpreter type. (And for the sake of completeness, we could also have an import-time check in `PyInstaller.compat`)."

**Explanation:**

Builds on Python's tag spec (linked doc defines wheel filename formats, like "package-version-py3-none-win_amd64.whl"). "cp3" tag means CPython-specific Python 3 (standard interpreter). "py3" is generic Python 3, which PyPy claims compatibility for.

Changing to "cp3" makes wheels invisible to PyPy, forcing pip to use sdist (source distribution: tar.gz with code, no binaries—requires building). In sdist's setup.py (install script), add a check like "if not CPython, error out."

"Import-time check" in PyInstaller.compat (module for compatibility hacks) errors when importing on PyPy, as backup.

Why this system? Tags prevent wrong binaries (e.g., Windows wheel on Linux). Before tags (early pip), mismatches caused cryptic crashes; tags make installs smarter but allow loopholes like PyPy grabbing "py3" wheels.

### Response 3: bwoodsend's Comment

**Verbatim:**

"Yeah, that sounds like it should work. My pet gripe with install errors is all the extra noise that gets added by pip:

```
Processing /vcs/pyinstaller
  Installing build dependencies ... done
  Getting requirements to build wheel ... error
  error: subprocess-exited-with-error
  
  × Getting requirements to build wheel did not run successfully.
  │ exit code: 1
  ╰─> [1 lines of output]
      actual error message is almost invisible
      [end of output]
  
  note: This error originates from a subprocess, and is likely not a problem with pip.

[notice] A new release of pip is available: 25.0.1 -> 25.3
[notice] To update, run: pip install --upgrade pip
error: subprocess-exited-with-error

× Getting requirements to build wheel did not run successfully.
│ exit code: 1
╰─> See above for output.

note: This error originates from a subprocess, and is likely not a problem with pip.
```"

**Explanation:**

Agrees with tag change. "Pet gripe" means personal annoyance. Shows example pip error output from sdist build fail.

Pip uses subprocesses (separate processes) for builds to isolate them. Errors get wrapped in boilerplate: "subprocess-exited-with-error," phases like "Getting requirements," exit codes (1 means fail). Notices about pip upgrades add clutter.

Real error ("actual error message") buries in output, hard for new users. This happens because pip evolved from simple installer to handling complex builds (via setuptools/pep517), adding layers for safety but more verbosity.

Before modern pip (pre-2018-ish), errors were simpler but less informative; now they're detailed but overwhelming.

### Response 4: rokm's Comment

**Verbatim:**

"My pet gripe with install errors is all the extra noise that gets added by pip Yeah, these are super ugly and difficult to parse by casual users. I suspect the only reason I don't particularly mind them myself is because I've seen so many of them in our weekly requirement updates in the contributed hooks repository... Not sure we can do anything about them, though (aside from making the actual error message multi-line with some sort of banner and footer to make it stand out more). The alternative is to avoid install errors, give PyPy users a fleeting feeling of hope, and then confront them with reality once they try to run PyInstaller. If we're going to take this route, then we can also leave the tag at `py3`."

**Explanation:**

Echoes annoyance with pip's noisy errors. "Parse" means read/understand. They've seen many in "contributed hooks repository" (PyInstaller's pyinstaller-hooks-contrib, for package-specific fixes; weekly updates check dependencies, triggering builds/errors).

Suggests improving error visibility: multi-line with banners (e.g., *** ERROR ***).

Alternative: keep "py3" tag, let install succeed, error at runtime. "Fleeting feeling of hope" means users think it works until running.

Ties back to trade-off: install fail (noisy but early) vs runtime fail (cleaner install, later surprise). System exists because Python supports multiple interpreters/OS, but generic tags like "py3" allow mismatches.

### Response 5: bwoodsend's Comment

**Verbatim:**

"Looks like `cp3` is a no-go after all...

```
> pip download --no-dependencies pyperclip
> cp pyperclip-1.11.0-py3-none-any.whl pyperclip-1.11.0-cp3-none-any.whl
> pip install pyperclip-1.11.0-cp3-none-any.whl 
ERROR: pyperclip-1.11.0-cp3-none-any.whl is not a supported wheel on this platform.
```"

**Explanation:**

Tests "cp3" tag on pyperclip (simple package). Downloads wheel, renames to "cp3" (CPython 3 generic), tries install.

Fails: pip rejects because "cp3" isn't valid tag per system's compatibility list. Even on CPython, it errors.

Low-level: pip queries packaging.tags.sys_tags() (function listing supported tags based on your Python/OS). "cp3-none-any" isn't there; valid are like "cp312-cp312-win_amd64" (specific version) or "py3-none-any" (generic).

Why? Tags standardized for precision; "cp3" too broad, could mismatch ABIs across minor versions. Before this spec (PEP 425, 2012), no consistency, leading to broken installs.

### Response 6: rokm's Comment

**Verbatim:**

"Hmm, indeed... Which means that https://packaging.python.org/en/latest/specifications/platform-compatibility-tags/#use is either wrong or out-of-date; but `packaging.tags.sys_tags()` indeed does not list `cp3-none-any` (with system python 3.14 on my Fedora 43). We'd have to resort to something like `cp38.cp39.cp310.cp311.cp312.cp313.cp314-none-any` (because `cp3X-none-any` is on the list for python 3.X). Or, since our PyPI wheels have arch part of the tag also set, I think `cp38-abi3-{arch}` should also work with any cpython >= 3.8 on {arch}, because there seem to be `cp3X-abi3-{arch}` tags in the list, where 2 < X < Y for python 3.Y."

**Explanation:**

Confirms "cp3" invalid via sys_tags() (lists tags like "cp314-cp314-linux_x86_64"). Tested on Python 3.14, Fedora 41 (typo? Fedora 41 released 2024).

Alternatives:

1. Chain versions: "cp38.cp39..." (multi-tag wheel for Python 3.8-3.14). Pip matches if any fits. But for pure Python, it's overkill.

2. "cp38-abi3-{arch}": Starts from 3.8, "abi3" means stable ABI (won't break across versions). {arch} is platform like "win_amd64". Works for CPython >=3.8 on that arch, as sys_tags() includes forward-compatible ones (e.g., Python 3.14 lists "cp38-abi3-win_amd64" for backward compat).

Low-level: ABI3 (PEP 384) freezes interface for extensions, allowing one binary across versions. Before ABI3 (pre-2010), extensions rebuilt per version. Arch tags ensure OS/CPU match (e.g., amd64 vs arm).

This solves by making wheels CPython-only without invalid tags, forcing PyPy to sdist (where error can trigger).

## User

_Time: 2025-11-17T10:16:06.200Z_

Typically how would I add abi tags to a project (not pyinstaller). Talk more about historical implementation of ABI in Python and what projects first used it and why it was created and how it solves some sort of problem.

## Assistant

_Time: 2025-11-17T10:17:14.003Z_

## Adding ABI3 Tags to Your Project

Start from wheel tags. Python packages used to build separate binaries for each minor version because C extensions tied to specific interpreter details.

To add abi3 (stable ABI tag) for forward compatibility:

- Restrict your C extension code to limited API subset. Define `Py_LIMITED_API` macro in source (e.g., `#define Py_LIMITED_API 0x030a0000` for Python 3.10+ min support). This hides unstable parts.

- Build wheel with oldest Python version you target (e.g., 3.10 for cp310-abi3).

- Use build backend like setuptools in pyproject.toml or setup.py to compile extension.

- After building, repair wheel to apply abi3 tag: On Linux, auditwheel repair. On macOS, delocate. On Windows, often manual or via cibuildwheel.

This solves rebuilding per version; one wheel covers 3.10 and up, vs separate for 3.10, 3.11, etc. Before, you'd recompile everything, wasting time and storage.

If pure Python, no need—use py3 tag. For CFFI or similar, same limited API rules apply.

## Historical Implementation of ABI in Python

Build from C API evolution. Early Python extensions used full C API, which changed often between releases, breaking binaries.

PEP 384 (2009) defined stable ABI for Python 3.2 (2011). It picked a subset of C functions/symbols guaranteed not to change across 3.x minors. Historical doc now; current in Python docs on C API stability.

Before 3.2, API version bumped with changes (PYTHON_API_VERSION), forcing rebuilds even for patches. Stable ABI skips that for limited use.

Updated in PEP 652 (2021): Formalized maintenance, single header file for stable defs, better tests/docs.

## Why Stable ABI Was Created

From extension breakage. Pre-3.2, minor updates altered in-memory layouts (e.g., strings, objects), so loading old binary in new Python crashed or corrupted data.

Created to let extensions/embedders work across 3.x without recompiles, if sticking to stable subset.

Problems solved vs old way: No version-specific DLLs (Windows pythonXY.dll mess), less PyPI bloat from per-version wheels, faster new Python adoption (no wait for rebuilds). Old solution was compile from source per install—slow, toolchain-dependent, error-prone for users.

## First Projects Using It

No exact "first" listed; abi3 wheels from PEP 425 (2012), post-3.2.

Early adopters likely C-heavy ones needing broad compat. Audits show PyQt6, sip (GUI bindings), refl1d (science), hdbcli (DB) using abi3 by 2022, but with tag errors.

scikit-learn eyed it in 2025 for machine learning extensions. Conda-forge added abi3 support 2025, cutting builds from per-version to one per platform.

Worth time if your project has C extensions and targets multiple Pythons; better than old per-version builds, but requires auditing code for limited API compliance—tools like abi3audit help catch violations. If no C, skip it; objectively simpler.

## User

_Time: 2025-11-17T10:37:52.803Z_

Sorry I’m confused in our convo. Why can’t pyinstaller team just Abi tag their releases and close this whole issue?

## Assistant

_Time: 2025-11-17T10:38:29.731Z_

## Packaging Basics First

Python packaging started with sdists (source tarballs) where setup.py could run checks during install, like blocking on PyPy. This was the only option before 2012, solving manual distribution but slow because every install built from source—think compiling C code each time, error-prone if missing compilers.

Wheels came via PEP 427 to pre-build everything, cutting install time from minutes to seconds by unzipping binaries. Problem solved: no more user-side builds for common cases.

## ABI Tagging Role

ABI tagging (like abi3) branched from that to handle C extensions across Python minors without separate wheels per version. Created in PEP 384 (2009, for Python 3.2) because old extensions broke on minor updates—e.g., struct changes crashed binaries. Before, you'd use per-version builds or source installs everywhere.

It restricts code to a stable C API subset, so one wheel covers 3.8+, vs rebuilding for 3.8, 3.9, etc. Worth time if your project has extensions and broad support; objectively better than old per-version mess for storage/PyPI load.

## Why Not "Just" Tag PyInstaller

They can tag wheels as cp38-abi3-win_amd64 (or similar) to hide from PyPy, forcing sdist installs with errors. Discussion proposed it as a fix.

But it's not done because open-source volunteer work crawls—PR closed without action, no new ones. Pipeline changes needed: PyInstaller's build compiles bootloaders per platform, so tweaking cibuildwheel or scripts adds testing effort.

PyPy users are rare, so low priority vs bugs affecting CPython masses. Is it worth your time? If you're stuck on PyPy, switch to Nuitka—handles alternatives better without this drama.

## Any Updates?

PR's dead since close, no ABI follow-up. Check GitHub yourself if skeptical—nothing moved.
