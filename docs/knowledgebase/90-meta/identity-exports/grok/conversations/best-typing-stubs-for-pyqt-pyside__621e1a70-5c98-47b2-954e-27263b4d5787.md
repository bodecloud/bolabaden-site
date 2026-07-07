---
source_url: "https://grok.com/c/621e1a70-5c98-47b2-954e-27263b4d5787"
conversation_id: "621e1a70-5c98-47b2-954e-27263b4d5787"
title: "Best Typing Stubs for PyQt/PySide"
extracted_at: "2026-06-29T16:37:52.770Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Best Typing Stubs for PyQt/PySide

Source: [Grok conversation](https://grok.com/c/621e1a70-5c98-47b2-954e-27263b4d5787)

## User

_Time: 2026-01-21T01:28:50.465Z_

there seems to be a crapton of stubs/typing packages on PyPi for PyQt6, PyQt5, and PySide6. Which ones are the most canonical and maintained? unfortunately the pyqt/pyside creators are not providing very good stubs so i usually have to install some manually. For example I see pyqt6-stubs and pyside6-stubs but there's like 3 others like typings-pyqt6 and pyqt6-typing same for pyqt5 and pyside6. for each of these apis (pyqt5/pyqt6/pyside6) please provide the most maintained, comprehensive, and canonical stubs/typings library that is installable via pip.

## Assistant

_Time: 2026-01-21T01:30:49.424Z_

### Key Recommendations
- **PyQt5**: The most canonical and widely used is **PyQt5-stubs**, a community-maintained package with high popularity for accurate type checking.
- **PyQt6**: **PyQt6-stubs** (from the same maintainers as above) is the closest to canonical, though not on PyPI—install via GitHub; alternatively, IceSpringPySideStubs-PyQt6 offers pip installation and richer features like docstrings.
- **PySide6**: **PySide6-stubs** stands out as the most maintained and recommended improvement over official stubs, with recent updates for better type accuracy.

These packages enhance type checking (e.g., with mypy or Pyright) and IDE support beyond the built-in stubs provided by the official libraries, which are often incomplete for signals, properties, or overloads.

### PyQt5
The community consensus points to **PyQt5-stubs** as the go-to package. It modifies the official stubs for better compatibility with type checkers, has the highest popularity (71 GitHub stars), and is directly installable via PyPI.

- **Installation**: `pip install PyQt5-stubs`

### PyQt6
Official PyQt6 includes basic stubs, but community options fill gaps. **PyQt6-stubs** aligns with the respected PyQt5/PySide6 stubs from the same group, focusing on fixes for type checking. It's not on PyPI but easy to install from GitHub. For a PyPI-option with enhanced docstrings and signal support, use **IceSpringPySideStubs-PyQt6**.

- **Preferred Installation**: `pip install git+https://github.com/python-qt-tools/PyQt6-stubs.git`
- **Alternative**: `pip install IceSpringPySideStubs-PyQt6`

### PySide6
Official stubs are solid, but **PySide6-stubs** provides targeted improvements (e.g., property typing, method overloads, return types). It's actively maintained (updates as recent as 2025) and published on PyPI.

- **Installation**: `pip install PySide6-stubs`

---

### Overview of Qt Bindings Typing Stubs
PyQt5, PyQt6 (from Riverbank Computing), and PySide6 (official from Qt Company) all include basic .pyi stubs, but these often lack complete coverage for signals, overloads, properties, or None-accepting parameters. Community packages address this for better static type checking and IDE autocompletion. Two primary projects dominate:

1. **python-qt-tools organization** — Focuses on high-quality, accurate stubs derived from official ones with targeted fixes. Popular for strict type checking; repos have higher stars overall.
2. **IceSpringPySideStubs** — Single project covering all bindings, emphasizing docstrings (often linking to official Qt docs), signal typing, and IDE-friendly features like one class per file.

| Binding   | Recommended Package                  | PyPI Install Command                          | Key Features                                      | GitHub Stars | Last Known Update | Notes                                                                 |
|-----------|--------------------------------------|-----------------------------------------------|---------------------------------------------------|--------------|-------------------|-----------------------------------------------------------------------|
| PyQt5    | PyQt5-stubs                         | `pip install PyQt5-stubs`                    | Accurate fixes for mypy compatibility             | 71          | 2023             | Most popular and referenced in tools like qtpy and Spyder.            |
| PyQt6    | PyQt6-stubs (python-qt-tools)       | `pip install git+https://github.com/python-qt-tools/PyQt6-stubs.git` | Fixes based on official stubs (signals, errors)   | 18          | 2023             | Matches style of other python-qt-tools stubs; intermediate until fuller support. Alternative: IceSpring for docstrings. |
| PyQt6    | IceSpringPySideStubs-PyQt6 (alt)    | `pip install IceSpringPySideStubs-PyQt6`      | Docstrings, signal typing, Qt docs links           | 18 (shared repo) | Recent commits   | Good for IDE hover/docs; uniform across bindings.                      |
| PySide6  | PySide6-stubs                       | `pip install PySide6-stubs`                  | Improvements over official (properties, overloads)| 32          | 2025             | Actively maintained; recommended on Qt forums for noticeable gains.    |
| PySide6  | IceSpringPySideStubs-PySide6 (alt)  | `pip install IceSpringPySideStubs-PySide6`   | Docstrings, signal typing, Qt docs links           | 18 (shared repo) | Recent commits   | Useful for richer intellisense; mentioned positively in some issues.  |

### Detailed Comparison and Considerations
- **Maintenance & Activity**: PySide6-stubs shows the most recent activity (2025), reflecting ongoing Qt6 evolution. PyQt stubs from python-qt-tools are older (2023) but stable, as Qt APIs change slowly. IceSpring repo indicates recent commits and active build processes, though PyPI releases lag.
- **Comprehensiveness**: IceSpring excels in documentation and signal handling, making it ideal for IDEs (e.g., VS Code, PyCharm hover info). python-qt-tools prioritizes type checker accuracy (e.g., mypy strict mode, fixing return types like qVersion() → str).
- **Canonical Status**: python-qt-tools packages are frequently cited in GitHub issues, forums, and tools like qtpy/Spyder as the "standard" community stubs. IceSpring is praised for extras but less widespread.
- **Installation Notes**: All are pip-installable. GitHub installs work seamlessly for unreleased packages and provide the latest fixes.
- **Trends**: Many developers migrate to PySide6 for its official status, permissive license, and stronger built-in stubs—its community package remains highly active.

If strict type checking is your priority, stick with python-qt-tools across the board (using GitHub for PyQt6). For enhanced IDE experience with documentation, consider the IceSpring series uniformly.

### Key Citations
- GitHub organization overview and repo details: https://github.com/python-qt-tools
- PySide6-stubs repository: https://github.com/python-qt-tools/PySide6-stubs
- PyQt6-stubs repository: https://github.com/python-qt-tools/PyQt6-stubs
- IceSpringPySideStubs repository: https://github.com/baijifeilong/IceSpringPySideStubs
- Qt Forum discussion on PySide6-stubs: https://forum.qt.io/topic/147273/pyside6-typing-stubs-available
- PyPI page for PySide6-stubs: https://pypi.org/project/PySide6-stubs
