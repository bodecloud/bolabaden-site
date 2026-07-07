---
source_url: "https://grok.com/c/3e327367-2fac-46b7-9a27-641b5601cfd2"
conversation_id: "3e327367-2fac-46b7-9a27-641b5601cfd2"
title: "PyQt6 Packages and Tools Overview"
extracted_at: "2026-06-29T16:16:28.595Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# PyQt6 Packages and Tools Overview

Source: [Grok conversation](https://grok.com/c/3e327367-2fac-46b7-9a27-641b5601cfd2)

## User

_Time: 2025-12-06T04:17:18.766Z_

name any and all pyqt6 packages on pip. Also i'm looking for whatever provides pyuic6 or whatever the uic compiler is for pyqt6. But also i need a full and complete list of pip packages for pyqt6 including but not limited to extra stuff. NOT just pyqt6-qt6/pyqt6-sip i want the other 20.

## Assistant

_Time: 2025-12-06T04:19:23.555Z_

**Key Points**

- The pyuic6 tool (the UI compiler for .ui files in PyQt6) is provided directly by the main **PyQt6** package—no separate package needed.
- pyrcc6 (resource compiler) and pylupdate6 (translation tool) are also included in **PyQt6**.
- The core PyQt6 ecosystem has one main package plus several optional official packages from Riverbank Computing (not 20+ separate ones; there are about 12-14 total official packages with "PyQt6" in the name).
- Most Qt modules are bundled into the single **PyQt6** package (over 35 extension modules inside it), with only a few large/optional Qt components split out as separate pip packages for size/licensing reasons.
- Community packages like **pyqt6-tools** (for Qt Designer access) and **pyqt6-plugins** (official plugins package) exist separately.

**Core Packages (Required for Basic PyQt6 Setup)**
- **PyQt6** — Main bindings + tools (pyuic6, pyrcc6, pylupdate6).
- **PyQt6-sip** — SIP runtime (automatically installed as dependency).
- **PyQt6-Qt6** — Bundled Qt6 libraries (installed automatically with wheels, or install manually only if using sdist).

**Optional Official Packages (Extra Modules)**
| Package Name                  | Description                                                  | Bundled Qt Counterpart          |
|-------------------------------|--------------------------------------------------------------|---------------------------------|
| PyQt6-Charts                 | Bindings for QtCharts (charts/graphing)                        | PyQt6-Charts-Qt6             |
| PyQt6-DataVisualization        | Bindings for QtDataVisualization (3D data plots/bars)         | PyQt6-DataVisualization-Qt6     |
| PyQt6-NetworkAuth            | Bindings for QtNetworkAuthorization (OAuth etc.)                | PyQt6-NetworkAuth-Qt6        |
| PyQt6-WebEngine               | Bindings for QtWebEngine (Chromium-based web view)             | PyQt6-WebEngine-Qt6           |
| PyQt6-3D                    | Bindings for Qt3D framework (older versions; limited support) | PyQt6-3D-Qt6                |
| pyqt6-plugins                 | Additional Qt6 plugins required by some PyQt6 applications       | N/A                            |

**Related Packages (Often Used Together)**
- **QScintilla** (package name without "PyQt6-" prefix) — Provides the QScintilla editor component (compatible with PyQt6).
- **pyqt6-tools** (community-maintained, not Riverbank) — Convenience package for easy access to Qt Designer, QML tools, and can copy pyuic6 into path if needed.

There are no additional "20+" official PyQt6-split packages; the "more than 35 extension modules" mention on the PyPI page refers to internal modules inside the single **PyQt6** package, not separate pip installs.

---

**Comprehensive Overview of PyQt6 Packages on PyPI**

PyQt6 is distributed primarily as one large package containing bindings for the majority of Qt6 modules (QtCore, QtGui, QtWidgets, QtMultimedia, QtQuick/QtQml, QtQuick3D, QtPositioning, QtSvg, QtBluetooth, QtNetwork, QtSql, QtDBus, QtPrintSupport, and many more—over 35 extension modules total). Only a few specialized or large components are split into separate packages to keep the core manageable and respect licensing/build requirements.

The uic compiler (**pyuic6**) is bundled directly inside the **PyQt6** package. After `pip install PyQt6`, you will have the command-line tools:

- `pyuic6 yourfile.ui -o ui_yourfile.py` (or `python -m PyQt6.uic.pyuic ...`).

The same package also provides **pyrcc6** (for .qrc resources) and **pylupdate6** (for translations). No separate package is required for these tools on normal wheel installs.

**Full List of Official Riverbank Computing PyQt6 Packages on PyPI** (as of late 2025)

All of these are published by Riverbank Computing Limited and available via standard `pip install`:

| Package Name                     | Purpose / Provided Modules                                      | Latest Known Version (2025) | Notes                                                                 |
|----------------------------------|-----------------------------------------------------------------|-----------------------------|-----------------------------------------------------------------------|
| PyQt6                          | Core bindings + tools (pyuic6, pyrcc6, pylupdate6, Designer plugin, etc.) | 6.8+                      | Includes QtCore, QtGui, QtWidgets, QtQuick, QtMultimedia, QtSvg, QtBluetooth, QtPositioning, QtPdf, QtRemoteObjects, QtSerialPort, QtSensors, QtNetwork, QtSql, QtDBus, QtPrintSupport, QtQuick3D, etc. |
| PyQt6-sip                       | SIP runtime library specifically built for PyQt6                 | matches PyQt6 version       | Required dependency, auto-installed.                                    |
| PyQt6-Qt6                       | Bundled subset of Qt6 libraries (used by wheels)                | matches Qt version          | Auto-installed with PyQt6 wheels; needed only for sdist/source builds. |
| PyQt6-Charts                    | QtCharts module (2D/3D charts)                                 | 6.8+                    | Optional, separate due to size/licensing.                              |
| PyQt6-Charts-Qt6                | Qt libraries for Charts                                         | matches Qt version          | Used if building from source.                                          |
| PyQt6-DataVisualization          | QtDataVisualization (3D bar/surface/scatter plots)               | 6.8+                    | Optional.                                                             |
| PyQt6-DataVisualization-Qt6     | Qt libraries for DataVisualization                                   | matches Qt version          |                                                                       |
| PyQt6-NetworkAuth                | QtNetworkAuthorization (OAuth1/2 support)                        | 6.8+                    | Optional.                                                             |
| PyQt6-NetworkAuth-Qt6           | Qt libraries for NetworkAuth                                       | matches Qt version         |                                                                       |
| PyQt6-WebEngine                  | QtWebEngine (Chromium-based web browser component)              | 6.8+                    | Optional, very large.                                                 |
| PyQt6-WebEngine-Qt6             | Qt libraries for WebEngine                                       | matches Qt version          |                                                                       |
| pyqt6-plugins                 | Qt6 platform plugins and styles (needed for deployed apps)           | N/A                         | Official but rarely installed manually.                                  |
| PyQt6-3D                       | Qt3D framework bindings (3D scene graph, older Qt6 support)      | ~6.7 (may be discontinued   | Older package, limited updates for newer Qt6 versions.                    |
| PyQt6-3D-Qt6                  | Qt libraries for 3D                                            | older                       |                                                                       |

**Other Commonly Used Packages (Not Official Riverbank but Directly Related)**
- **QScintilla** (package name QScintilla) — Scintilla-based code editor component (full PyQt6 support in recent versions).
- **pyqt6-tools** (community by altendky) — Provides easy access to Qt Designer.exe, qmlscene, qmltestrunner, and can copy pyuic6 into your path if missing.
- **PyQt6-stubs** (community) — Type stubs for static analysis.

There are hundreds of community packages on PyPI that include "PyQt6" in the name (e.g. PyQt6-Frameless-Window, PyQt6-Fluent-Widgets, PyQt6-Qwt, PyQt6-simple-widget, etc.), but those are third-party libraries built on top of PyQt6, not part of the official distribution. The official Riverbank set is the short list above.

If you specifically need Qt Designer GUI without installing the full Qt toolkit, the most common solution is `pip install pyqt6-tools` (community) which bundles the designer executable from the Qt binaries provided by PyQt6-Qt6.

**Key Citations**
- https://pypi.org/project/PyQt6/
- https://pypi.org/project/PyQt6-WebEngine/
- https://pypi.org/project/PyQt6-Qt6/
- https://pypi.org/project/pyqt6-tools/
- https://pypi.org/project/PyQt6-Charts/
- https://pypi.org/project/PyQt6-DataVisualization/
- https://pypi.org/project/PyQt6-NetworkAuth/
- https://riverbankcomputing.com/software/pyqt/intro
- https://pypi.org/project/pyqt6-plugins/
- https://pypi.org/project/QScintilla/
