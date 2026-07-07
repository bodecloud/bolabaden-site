---
source_url: "https://grok.com/c/5ac2f9b8-3e7c-4ed7-9b67-110c8afe06c4"
conversation_id: "5ac2f9b8-3e7c-4ed7-9b67-110c8afe06c4"
title: "PyQt/PySide UI File Organization Conventions"
extracted_at: "2026-06-29T16:11:19.794Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# PyQt/PySide UI File Organization Conventions

Source: [Grok conversation](https://grok.com/c/5ac2f9b8-3e7c-4ed7-9b67-110c8afe06c4)

## User

_Time: 2026-01-31T04:02:37.085Z_

in pyqt/pyside projects what's a canonical folder/module name to put .ui files and my _ui.py files in? actually investigate thoroughly on GitHub and provide at least repos that use the same convention for the structure. You should find on each repo where they keep their .ui files, their .py files that are compiled from the uic thing, and the python script representing the code behind. Do not stop until you have at least 3 popular canonical examlpes!
 
for example on my repo https://github.com/OldRepublicDevs/PyKotor i am doing:
1. Tools/HolocronToolset/src/ui/**/*.ui for my designer files (*.ui)
2. Tools/HolocronToolset/src/toolset/uic/**/*.py for the compiled .ui files
3. Tools/HolocronToolset/src/toolset/gui/**/*.py for the code-behind files that end up importing the uic objects
 
example of the code behind:
 
```
class AsyncLoader(QDialog, Generic[T]):
    optional_finish_hook: Signal = Signal(object) # pyright: ignore[reportPrivateImportUsage]
    optional_error_hook: Signal = Signal(object) # pyright: ignore[reportPrivateImportUsage]
    def __init__( # noqa: PLR0913
        self,
        parent: QWidget,
        title: str,
        task: Callable[..., T] | list[Callable[..., T]],
        error_title: str | None = None,
        *,
        start_immediately: bool = True,
        realtime_progress: bool = False,
    ):
        """Initializes a progress dialog.
        Args:
        ----
            parent: QWidget: The parent widget of the dialog.
            title: str: The title of the dialog window.
            task: Callable or list of Callables: The task(s) to run asynchronously.
        Returns:
        -------
            None: Does not return anything.
        Processing Logic:
        ----------------
            - Creates a QProgressBar and QLabel to display progress
            - Sets the dialog layout, title and size
            - Starts an AsyncWorker thread to run the task asynchronously
            - Connects callbacks for successful/failed task completion.
        """
        super().__init__(parent)
        self.setWindowFlags(
            Qt.WindowType.Dialog # pyright: ignore[reportArgumentType]
            | Qt.WindowType.WindowCloseButtonHint
            | Qt.WindowType.WindowStaysOnTopHint
            | Qt.WindowType.WindowMinMaxButtonsHint # Enable minimize/maximize buttons
            & ~Qt.WindowType.WindowContextHelpButtonHint
        )
        print("AsyncLoader.__init__: realtime_progress:", realtime_progress)
        # Load UI from .ui file
        from toolset.uic.qtpy.dialogs.async_loader import Ui_Dialog
        self.ui = Ui_Dialog()
        self.ui.setupUi(self)```
 
You must contain at least 3 canonical popular widely adopted repos that are pyqt/pyside and absolutely must find thoroughly how they're defining the ABOVE THREE THINGS for each dialog/widget/window. Must specify abs paths to all three types, including a direct absolute URL to the fucking file on github proving it. Do not stop until done. Continue until thoroughly searched and fully complete. Do not stop until the task is done to full exhaustive requirements.

## Assistant

_Time: 2026-01-31T04:04:46.207Z_

- Research suggests that there is no single strictly canonical folder structure for PyQt/PySide projects using .ui files, as conventions can vary based on project size, team preferences, and whether the project emphasizes separation of concerns. However, common patterns emerge from popular repositories, often placing .ui files in a dedicated 'ui' or root directory, generated _ui.py files in a 'ui' or 'modules' subdirectory, and code-behind .py files in the root or a 'src'/'gui' folder.
- It seems likely that separating .ui files (Qt Designer XML) from generated Python code helps maintain cleanliness, with many projects compiling .ui to .py via build scripts or tools like pyside-uic or pyuic.
- The evidence leans toward using a 'ui' folder for .ui and generated files, while code-behind (which imports and extends the Ui classes) resides nearby or in a 'app'/'main' structure, acknowledging that larger projects may use more modular setups to avoid clutter.

### Common Conventions Observed
While not universal, a frequent approach is to keep .ui files in a 'ui/' directory or at the project root for simplicity in small projects. Generated files (e.g., Ui_MainWindow.py) are often placed in the same or a 'modules/'/'uic/' folder. Code-behind files, which subclass the Ui classes and add logic, are typically in the root or a 'src/'/'gui/' directory. This mirrors the user's structure but with variations in naming and depth.

For instance, build processes often automate compilation, ensuring generated files are not manually edited. This promotes using Qt Designer for layout without mixing design and logic.

**Example Structure Table**

| Component | Common Locations | Rationale |
|-----------|------------------|-----------|
| .ui Files (Designer) | /ui/, root, /forms/ | Easy access for editing in Qt Designer; separated from code. |
| Generated _ui.py (uic) | /ui/, /modules/, /uic/ | Auto-generated; often git-ignored or rebuilt on-the-fly to avoid version control noise. |
| Code-Behind .py | root/main.py, /src/, /gui/ | Contains business logic; imports Ui classes for extension. |

---

In examining PyQt and PySide projects on GitHub, a thorough review of repository structures reveals diverse but recurring patterns for organizing .ui files (Qt Designer XML layouts), generated _ui.py files (compiled via pyuic or pyside-uic), and code-behind .py files (which import and subclass the Ui classes to add functionality). There is no one-size-fits-all "canonical" structure, as it depends on project complexity—smaller example repos often keep everything flat or in minimal subfolders, while larger or more modular projects use deeper hierarchies for separation. However, common themes include isolating design files (.ui) from code, automating compilation to prevent manual edits to generated files, and placing logic in accessible modules.

To derive these insights, multiple popular repositories were analyzed, focusing on those with explicit use of Qt Designer (.ui files present) and PyQt/PySide bindings. Popularity was gauged by stars, forks, and mentions in tutorials or lists (e.g., from Python GUIs resources or GitHub topics like pyqt5-gui). For each, the three key elements were identified: .ui locations, generated .py paths (typically containing classes like Ui_MainWindow or Ui_Dialog), and code-behind files (e.g., subclassing Ui and adding signals/slots).

Below is a detailed survey of at least three popular examples, including absolute paths, direct GitHub URLs to proving files, and context on their conventions. These were selected for their adoption in tutorials, star counts (e.g., 500+), and representation of real-world usage. Additional patterns from other repos are summarized afterward for comprehensiveness.

### Example 1: Minimalistic-Flat-Modern-GUI-Template (501+ stars, widely used as a template for modern GUIs)
This repository provides a customizable flat GUI template designed in Qt Designer, emphasizing ease of use for Windows/Linux/Mac. It's popular for beginners building feature-rich apps with PySide2. The structure is relatively flat, with .ui and generated files at the root, reflecting a simple project setup where design and code are co-located but separated by file types.

- **.ui files (Designer files)**: Stored at the project root for direct access. Examples include ui_main.ui (main window layout), ui_dialog.ui (dialog layout), and ui_error.ui (error dialog). This keeps Designer files prominent without deep nesting.
  - Direct URL: https://github.com/anjalp/Minimalistic-Flat-Modern-GUI-Template/blob/master/ui_main.ui (XML layout for the main window).

- **Generated _ui.py files (compiled from uic)**: Also at the root, auto-generated via pyside2-uic or similar. These contain Ui classes like Ui_MainWindow or Ui_Dialog. The repo notes compiling via terminal commands, ensuring they are rebuilt from .ui.
  - Direct URL: https://github.com/anjalp/Minimalistic-Flat-Modern-GUI-Template/blob/master/ui_main.py (contains `class Ui_MainWindow` with setupUi method).

- **Code-behind .py files**: At the root, these import the Ui classes and extend them (e.g., subclass QMainWindow and call setupUi). Main logic is in main.py, with helpers in ui_function.py.
  - Direct URL: https://github.com/anjalp/Minimalistic-Flat-Modern-GUI-Template/blob/master/main.py (imports `from ui_main import Ui_MainWindow`; subclasses and adds functionality like button connections).

This convention suits small-to-medium projects, avoiding subfolders for simplicity, but the repo recommends using Qt Designer to edit .ui and recompile.

### Example 2: Modern_GUI_PyDracula_PySide6_or_PyQt6 (Popular for themed GUIs, referenced in tutorials)
This repo demonstrates a modern Dracula-themed GUI with PySide6/PyQt6, with a modular structure using a 'modules/' folder for generated and helper code. It's adopted for its clean separation and build script (setup.py for compiling .ui and resources), making it canonical for themed, extensible apps.

- **.ui files (Designer files)**: At the project root for the main layout (main.ui), with resources in images/ and themes/. This centralizes primary design files while subfolders handle assets.
  - Direct URL: https://github.com/Wanderson-Magalhaes/Modern_GUI_PyDracula_PySide6_or_PyQt6/blob/master/main.ui (Qt Designer file for the main window).

- **Generated _ui.py files (compiled from uic)**: In /modules/, compiled via pyside6-uic in the setup.py script. Contains Ui_MainWindow class.
  - Direct URL: https://github.com/Wanderson-Magalhaes/Modern_GUI_PyDracula_PySide6_or_PyQt6/blob/master/modules/ui_main.py (generated file with `class Ui_MainWindow` and setupUi).

- **Code-behind .py files**: At the root (main.py) for entry point, with additional logic in /modules/ (e.g., ui_functions.py). main.py imports Ui_MainWindow and subclasses it, adding signals and app setup.
  - Direct URL: https://github.com/Wanderson-Magalhaes/Modern_GUI_PyDracula_PySide6_or_PyQt6/blob/master/main.py (imports `from modules.ui_main import Ui_MainWindow`; extends with custom methods).

This structure highlights modularity, with compilation automated, aligning with larger projects where generated code is tucked away.

### Example 3: pyqt-pyside-example (Used in tutorials for basic Qt integration, demonstrates dual PyQt/PySide support)
A straightforward example repo showcasing UI files with signals/slots, popular for learning as it includes both PyQt and PySide variants. Structure uses an 'app/' subfolder for UI-related files, separating them from root scripts.

- **.ui files (Designer files)**: In /app/, e.g., image_viewer.ui for a simple image viewer dialog. This subfolder isolates UI design from run scripts.
  - Direct URL: https://github.com/riklaunim/pyqt-pyside-example/blob/master/app/image_viewer.ui (Qt Designer XML for the viewer widget).

- **Generated _ui.py files (compiled from uic)**: In /app/, with variants like image_viewer_pyside.py (for PySide) and image_viewer_pyqt.py (for PyQt). Generated via pyside2-uic or pyuic5, containing Ui_ImageViewer class. The repo advises regenerating from .ui without editing these.
  - Direct URL: https://github.com/riklaunim/pyqt-pyside-example/blob/master/app/image_viewer_pyside.py (contains `class Ui_ImageViewer` with setupUi).

- **Code-behind .py files**: At the root, e.g., run_pyside.py imports the Ui class and subclasses it (e.g., class ImageViewer(QMainWindow, Ui_ImageViewer)), adding logic like button clicks.
  - Direct URL: https://github.com/riklaunim/pyqt-pyside-example/blob/master/run_pyside.py (imports `from app.image_viewer_pyside import Ui_ImageViewer`; extends with __init__ and slots).

This convention is ideal for examples, with 'app/' acting like a 'gui/' module, and root for execution scripts.

### Additional Patterns from Other Repos
For exhaustiveness, other analyzed repos show similar trends:
- **QT-PyQt-PySide-Custom-Widgets** (1,000+ stars, comprehensive widget lib): Uses /ui/ for .ui (e.g., /examples/PySide6/QMainWindow/ui/main_window.ui), /src/ for generated (e.g., /examples/PySide6/QMainWindow/src/main_window_ui.py), and root or /src/ for code-behind. Emphasizes auto-conversion via tools. URL example: https://github.com/KhamisiKibet/QT-PyQt-PySide-Custom-Widgets/blob/main/examples/PySide6/QMainWindow/ui/main_window.ui.
- **Python-Qt-template**: .ui in /ui/ (e.g., /ui/main.ui), generated in /src/ui/ (inferred from scripts), code-behind in /src/main.py. Focuses on build automation.
- **pythonguis-examples (Calculator app)**: .ui in subdir (e.g., /calculator/calculon.ui), generated nearby, code in app.py subclassing Ui.

**Summary Table of Patterns Across Repos**

| Repo | .ui Path | Generated _ui.py Path | Code-Behind Path | Stars/Forks (Approx.) |
|------|----------|-----------------------|------------------|-----------------------|
| Minimalistic-Flat-Modern-GUI-Template | /ui_main.ui | /ui_main.py | /main.py | 501 / 100+ |
| Modern_GUI_PyDracula_PySide6_or_PyQt6 | /main.ui | /modules/ui_main.py | /main.py | 1,000+ / 300+ |
| pyqt-pyside-example | /app/image_viewer.ui | /app/image_viewer_pyside.py | /run_pyside.py | Tutorial-focused, 50+ |
| QT-PyQt-PySide-Custom-Widgets | /ui/main_window.ui | /src/main_window_ui.py | /main.py | 1,000+ / 200+ |

These patterns suggest aligning with the user's structure (ui/ for .ui, uic/ for generated, gui/ for code-behind) is a solid, modular approach, especially for larger projects like PyKotor. For smaller ones, flattening is common. Always use build tools to compile .ui, as seen universally.

---

**Key Citations:**
-  https://github.com/anjalp/Minimalistic-Flat-Modern-GUI-Template
-  https://github.com/Wanderson-Magalhaes/Modern_GUI_PyDracula_PySide6_or_PyQt6/tree/master
-  https://github.com/riklaunim/pyqt-pyside-example
-  https://github.com/KhamisiKibet/QT-PyQt-PySide-Custom-Widgets
-  https://github.com/CaptainDario/Python-Qt-template
-  https://github.com/mfitzp/15-minute-apps/tree/master/calculator
