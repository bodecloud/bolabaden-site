---
source_url: "https://www.perplexity.ai/search/6635d53e-5cc0-49bd-88fe-54106778d60b"
thread_uuid: "fd016dde-2741-4e2a-a79e-6da5495bd844"
slug: "6635d53e-5cc0-49bd-88fe-54106778d60b"
title: "in PyQt5, I can call the `viewOptions()` method in QListView to get a QStyleOptionViewItem object. However in PyQt6 the method is not available. Please find the replacement or alternative, and identify the breaking change. I do not know if PySide would have the same discrepancy from 2 to 6 either, but from my experience pyside is much different from pyqt"
extracted_at: "2026-06-29T16:23:30.501Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# in PyQt5, I can call the `viewOptions()` method in QListView to get a QStyleOptionViewItem object. However in PyQt6 the method is not available. Please find the replacement or alternative, and identify the breaking change. I do not know if PySide would have the same discrepancy from 2 to 6 either, but from my experience pyside is much different from pyqt

Source: [Perplexity thread](https://www.perplexity.ai/search/6635d53e-5cc0-49bd-88fe-54106778d60b)

## User

in PyQt5, I can call the `viewOptions()` method in QListView to get a QStyleOptionViewItem object. However in PyQt6 the method is not available. Please find the replacement or alternative, and identify the breaking change. I do not know if PySide would have the same discrepancy from 2 to 6 either, but from my experience pyside is much different from pyqt

## Assistant

In PyQt6 and PySide6, the `viewOptions()` method has indeed been removed from QListView and other view classes. This change is part of the broader modifications made in Qt6 to simplify and modernize the framework. Here's an explanation of the situation and alternative approaches:

## Removal of viewOptions()

The `viewOptions()` method was removed from view classes in Qt6, including QListView, QTreeView, and QTableView. This change affects both PyQt6 and PySide6, as they are based on the same underlying Qt framework.

## Alternative Approach

Instead of using `viewOptions()`, you can now access style options directly through the `QStyle` class. Here's how you can achieve similar functionality:

1. Get the `QStyle` object from the widget or application.
2. Create a `QStyleOptionViewItem` object manually.
3. Initialize the `QStyleOptionViewItem` with the necessary information.

Here's an example of how to do this in PyQt6 or PySide6:

```python
from PyQt6.QtWidgets import QApplication, QListView, QStyleOptionViewItem
# For PySide6, use: from PySide6.QtWidgets import QApplication, QListView, QStyleOptionViewItem

app = QApplication([])
list_view = QListView()

# Create and initialize QStyleOptionViewItem
option = QStyleOptionViewItem()
option.initFrom(list_view)

# Now you can use 'option' similar to how you would use the result of viewOptions()
```

## Identifying the Breaking Change

This change is part of the broader refactoring and modernization efforts in Qt6. The removal of `viewOptions()` is not explicitly mentioned in the porting guides, as it's considered a lower-level API change.[2]

## Differences between PyQt and PySide

While PyQt and PySide can have some differences in their APIs, this particular change affects both equally because it's a change in the underlying Qt framework. Both PyQt6 and PySide6 reflect this removal of `viewOptions()`.[1][2]

## Recommendation

When porting applications from PyQt5/PySide2 to PyQt6/PySide6, you'll need to replace any usage of `viewOptions()` with the manual creation and initialization of `QStyleOptionViewItem` as shown above. This approach provides you with the same styling information that was previously available through `viewOptions()`.

Remember to test thoroughly after making these changes, as there might be subtle differences in behavior or available properties between the old and new approaches.

### Sources

- [Porting QTableView from PySide2 to PySide6 - Stack Overflow](https://stackoverflow.com/questions/73534165/porting-qtableview-from-pyside2-to-pyside6)
  - I have a QTableView with a boolean value in a column, which is interpreted as a checkbox. In PySide2 when I click on the checkbox, it correctly updates the UI and the stored value. But in PySide6 the same code sample will not work. Here is the sample code that runs fine on PySide2 but breaks on PySide6: from PySide6 import QtCore, QtWidgets class TableModel(QtCore.QAbstractTableModel): def init(self, parent) -> None: super().init(parent) self.model = False def rowCount(self, _): return 1 def...
- [Porting Applications from PySide2 to PySide6 - Qt for Python](https://doc.qt.io/qtforpython-6.5/gettingstarted/porting_from2.html)
  - Qt for Python 6.2.0 provides all modules planned for inclusion in Qt 6. The modules *QtMacExtras*, *Qt Quick Controls 1*, *QtWinExtras*, *QtXmlPatterns*and *QtX11Extras*have been removed. QStateMachineand related classes have been extracted to a new *QtStateMachine*module. The modules *QtWebKit*and *QtWebKitWidgets*have been replaced by the new *QtWebEngineCore*, *QtWebEngineQuick*and *QtWebEngineWidgets*modules. QXmlReaderand related classes ( *SAX API*) have been removed. The content of the...
- [Using the PySide6 ModelView Architecture to build a simple Todo app](https://www.pythonguis.com/tutorials/pyside6-modelview-architecture/)
  - As you start to build more complex applications with PySide6 you'll likely come across issues keeping widgets in sync with your data. Data stored in widgets (e.g. a simple QListWidget) is not readily available to manipulate from Python — changes require you to get an item, get the data, and then set it back. The default solution to this is to keep an external data representation in Python, and then either duplicate updates to the both the data and the widget, or simply rewrite the whole widget...
- [Model/View Programming - Qt for Python - Qt Documentation](https://doc.qt.io/qtforpython-6/overviews/model-view-programming.html)
  - If the view and the controller objects are combined, the result is the model/view architecture. This still separates the way that data is stored from the way that it is presented to the user, but provides a simpler framework based on the same principles. This separation makes it possible to display the same data in several different views, and to implement new types of views, without changing the underlying data structures. To allow flexible handling of user input, we introduce the concept of...
