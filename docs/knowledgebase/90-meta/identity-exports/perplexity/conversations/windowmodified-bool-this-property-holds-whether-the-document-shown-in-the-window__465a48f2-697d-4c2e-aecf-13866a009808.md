---
source_url: "https://www.perplexity.ai/search/c934166a-5d69-4048-97c7-4731eb2484ec"
thread_uuid: "465a48f2-697d-4c2e-aecf-13866a009808"
slug: "c934166a-5d69-4048-97c7-4731eb2484ec"
title: "```
windowModified : bool
This property holds whether the document shown in the window has unsaved changes

A modified window is a window whose content has changed but has not been saved to disk. This flag will have different effects varied by the platform. On macOS the close button will have a modified look; on other platforms, the window title will have an '*' (asterisk).

The window title must contain a \"[*]\" placeholder, which indicates where the '*' should appear. Normally, it should appear right after the file name (e.g., \"document1.txt[*] - Text Editor\"). If the window isn't modified, the placeholder is simply removed.

Note that if a widget is set as modified, all its ancestors will also be set as modified. However, if you call setWindowModified(false) on a widget, this will not propagate to its parent because other children of the parent might have been modified.

Access functions:

bool	isWindowModified() const
void	setWindowModified(bool)
See also windowTitle.
```
In Qt6 I notice that the QWidget class holds a isWindowModified and setWindowModified and windowModified attribute. The explanation given seems to be specifically for *windows*. But why is it in the widget class then? Can I use this with widgets or not? For example, what if I have comboboxes, spinboxes, textboxes, etc that I want to use this with?"
extracted_at: "2026-06-29T16:23:17.304Z"
matched_keywords: []
export_suite: "identity"
entry_count: 2
provenance: perplexity-rest-api
---

# ```
windowModified : bool
This property holds whether the document shown in the window has unsaved changes

A modified window is a window whose content has changed but has not been saved to disk. This flag will have different effects varied by the platform. On macOS the close button will have a modified look; on other platforms, the window title will have an '*' (asterisk).

The window title must contain a "[*]" placeholder, which indicates where the '*' should appear. Normally, it should appear right after the file name (e.g., "document1.txt[*] - Text Editor"). If the window isn't modified, the placeholder is simply removed.

Note that if a widget is set as modified, all its ancestors will also be set as modified. However, if you call setWindowModified(false) on a widget, this will not propagate to its parent because other children of the parent might have been modified.

Access functions:

bool	isWindowModified() const
void	setWindowModified(bool)
See also windowTitle.
```
In Qt6 I notice that the QWidget class holds a isWindowModified and setWindowModified and windowModified attribute. The explanation given seems to be specifically for *windows*. But why is it in the widget class then? Can I use this with widgets or not? For example, what if I have comboboxes, spinboxes, textboxes, etc that I want to use this with?

Source: [Perplexity thread](https://www.perplexity.ai/search/c934166a-5d69-4048-97c7-4731eb2484ec)

## User

```
windowModified : bool
This property holds whether the document shown in the window has unsaved changes

A modified window is a window whose content has changed but has not been saved to disk. This flag will have different effects varied by the platform. On macOS the close button will have a modified look; on other platforms, the window title will have an '*' (asterisk).

The window title must contain a "[*]" placeholder, which indicates where the '*' should appear. Normally, it should appear right after the file name (e.g., "document1.txt[*] - Text Editor"). If the window isn't modified, the placeholder is simply removed.

Note that if a widget is set as modified, all its ancestors will also be set as modified. However, if you call setWindowModified(false) on a widget, this will not propagate to its parent because other children of the parent might have been modified.

Access functions:

bool	isWindowModified() const
void	setWindowModified(bool)
See also windowTitle.
```
In Qt6 I notice that the QWidget class holds a isWindowModified and setWindowModified and windowModified attribute. The explanation given seems to be specifically for *windows*. But why is it in the widget class then? Can I use this with widgets or not? For example, what if I have comboboxes, spinboxes, textboxes, etc that I want to use this with?

## Assistant

The `windowModified` property is indeed part of the QWidget class in Qt6, which may seem counterintuitive at first glance. However, this design choice offers flexibility and consistency across the Qt framework. Here's an explanation of how and why you can use this property with various widgets:

## Why It's in QWidget

1. QWidget is the base class for all user interface objects in Qt. This means that all UI elements, including windows, inherit from QWidget.[1]

2. In Qt's design philosophy, any widget can potentially become a window. This is why many window-related properties and methods are part of QWidget.[1]

## Using windowModified with Different Widgets

You can use the `windowModified` property with any QWidget subclass, but its effect will be most noticeable when the widget is acting as a window. Here's how it applies to different scenarios:

1. **Top-level Windows**: For widgets that are actual windows (like QMainWindow), the property works as described, modifying the window title or appearance.[2]

2. **Child Widgets**: For child widgets within a window, setting `windowModified` will propagate up to the top-level window. This means you can set it on any child widget, and it will affect the main window.[2]

3. **Custom Widgets**: If you're creating custom widgets, you can use this property to indicate a modified state, which can be useful even if the widget isn't a window.

## Practical Use Cases

1. **Form Widgets**: For widgets like QComboBox, QSpinBox, or QTextEdit, you can connect their change signals to a slot that sets `windowModified`:

   ```cpp
   connect(comboBox, &QComboBox::currentTextChanged, this, &MyWidget::setModified);
   connect(spinBox, QOverload<int>::of(&QSpinBox::valueChanged), this, &MyWidget::setModified);
   connect(textEdit, &QTextEdit::textChanged, this, &MyWidget::setModified);

   void MyWidget::setModified()
   {
       setWindowModified(true);
   }
   ```

2. **Custom Widgets**: If you're creating a custom widget that represents a document or data, you can use `setWindowModified` internally to indicate changes:

   ```cpp
   void MyCustomWidget::changeData()
   {
       // ... change data ...
       setWindowModified(true);
   }
   ```

3. **Dialog Windows**: Even for dialog windows created from widgets like QDialog, you can use this property to indicate unsaved changes.

## Important Considerations

1. **Placeholder**: Remember to include the `[*]` placeholder in your window title for the modification indicator to appear correctly.[2]

2. **Propagation**: Setting `windowModified` to true propagates up the widget hierarchy, but setting it to false does not propagate down.[2]

3. **Visual Effect**: The visual effect of `windowModified` is most noticeable on top-level windows, but it can still be useful for internal state management in other widgets.

By including this property in QWidget, Qt provides a consistent mechanism for indicating modification across all types of widgets, whether they're currently acting as windows or not. This design choice aligns with Qt's flexibility in allowing any widget to potentially become a window.

### Sources

- [QWidget Class | Qt Widgets 6.8.0](https://doc.qt.io/qt-6/qwidget.html)
  - QWidget has many member functions, but some of them have little direct functionality; for example, QWidget has a font property, but never uses this itself.
- [Application Example | Qt Widgets 6.2.13 - Qt Documentation](https://doc.qt.io/qt-6.2/qtwidgets-mainwindows-application-example.html)
  - MainWindow::MainWindow() : textEdit(new QPlainTextEdit) { setCentralWidget(textEdit); createActions(); createStatusBar(); readSettings(); connect(textEdit->document(), &QTextDocument::contentsChanged, this, &MainWindow::documentWasModified); #ifndef QT_NO_SESSIONMANAGER connect(qApp, &QGuiApplication::commitDataRequest, this, &MainWindow::commitData); #endif setCurrentFile(QString()); setUnifiedTitleAndToolBarOnMac(true); } In the constructor, we start by creating a QPlainTextEdit widget as a...
- [Spin Boxes Example | Qt Widgets 6.8.0](https://doc.qt.io/qt-6/qtwidgets-widgets-spinboxes-example.html)
  - The Spin Boxes example shows how to use the many different types of spin boxes available in Qt, from a simple QSpinBox widget to more complex editors like the QDateTimeEdit widget. The example consists of a single Window class that is used to display the different spin box-based widgets available with Qt.... class Window : public QWidget { Q_OBJECT public: Window(QWidget *parent = nullptr); public slots: void changePrecision(int decimals); void setFormatString(const QString &formatString);...
- [[SOLVED] QWidget::setWindowModified: The window title does not ...](https://forum.qt.io/topic/2070/solved-qwidget-setwindowmodified-the-window-title-does-not-contain-a-placeholder)
  - Hi everyone! I'm new to Qt and I started learning it from instruction videos in eLearning section. When I got to events I found something strange - the placeholder. I copied the code from this video (I home without mistakes) and compiled it. There was no errors and program executes correctly, but the compiler says "QWidget::setWindowModified: The window title does not contain a '[*]' placeholder". And I don't understand what is wrong. What is exactly a placeholder and where is it used? The...
- [Window Flags Example | Qt Widgets 6.8.0](https://doc.qt.io/qt-6/qtwidgets-widgets-windowflags-example.html)
  - windowStaysOnBottomCheckBox; QCheckBox *customizeWindowHintCheckBox; }; The ControllerWindow class inherits QWidget. The widget allows the user to choose among the available window flags, and displays the effect on a separate preview window. We declare a private updatePreview() slot to refresh the preview window whenever the user changes the window flags. We also declare several private functions to simplify the constructor: We call the createTypeGroupBox() function to create a radio button...
- [Thread: Check if a window has been modified - Qt Centre Forum](https://www.qtcentre.org/threads/44026-Check-if-a-window-has-been-modified)
  - Quick question - if i have a form (i.e. window) with many child input widgets (e.g. text edit), can i detect if one of the widgets, and hence the form, has been modified? QWidget::isWindowModified() seems perfect for the job, but apparently i need to set it myself!? That kind of defeats the purpose, since i would need to write the code myself to detect change. I would have thought it would be built into Qt, so the modified property gets set whenever a widget changes, and all i have to do is...

## User

How can I use setWindowModified with a QComboBox

## Assistant

To use `setWindowModified` with a QComboBox, you can connect the appropriate signals from the QComboBox to a slot that sets the window modified state. Here's how you can do it:

1. First, ensure that your window title contains the `[*]` placeholder, which is required for the modified indicator to appear:

   ```cpp
   setWindowTitle("My Application [*]");
   ```

2. Connect the relevant signals from the QComboBox to a slot that sets the window modified state:

   ```cpp
   connect(comboBox, &QComboBox::currentTextChanged, this, &MyWidget::setModified);
   connect(comboBox, &QComboBox::editTextChanged, this, &MyWidget::setModified);
   ```

3. Implement the slot that sets the window modified state:

   ```cpp
   void MyWidget::setModified()
   {
       setWindowModified(true);
   }
   ```

Here's a more complete example:

```cpp
class MyWidget : public QWidget
{
    Q_OBJECT

public:
    MyWidget(QWidget *parent = nullptr) : QWidget(parent)
    {
        setWindowTitle("My Application [*]");

        QComboBox *comboBox = new QComboBox(this);
        comboBox->addItems({"Item 1", "Item 2", "Item 3"});
        comboBox->setEditable(true);

        connect(comboBox, &QComboBox::currentTextChanged, this, &MyWidget::setModified);
        connect(comboBox, &QComboBox::editTextChanged, this, &MyWidget::setModified);

        // Layout setup
        QVBoxLayout *layout = new QVBoxLayout(this);
        layout->addWidget(comboBox);
        setLayout(layout);
    }

private slots:
    void setModified()
    {
        setWindowModified(true);
    }
};
```

In this example:

1. We set the window title with the `[*]` placeholder.
2. We create a QComboBox and make it editable.
3. We connect both `currentTextChanged` and `editTextChanged` signals to our `setModified` slot. This ensures that the window is marked as modified when the user either selects a different item or edits the text in the combobox.[1][4]
4. The `setModified` slot calls `setWindowModified(true)` to indicate that the window content has changed.[5]

Remember that `setWindowModified` affects the window containing the widget, not the widget itself. If your QComboBox is part of a larger application, make sure you're calling `setWindowModified` on the main window or the appropriate parent widget.[2][6]

Also, note that once you set the window as modified, you'll need to manually set it back to unmodified (using `setWindowModified(false)`) when appropriate, such as after saving changes.

### Sources

- [PyQt QComboBox Widget — Select items from a drop-down list](https://www.pythonguis.com/docs/qcombobox/)
  - from PyQt5.QtWidgets import QComboBox, QMainWindow, QApplication, QWidget, QVBoxLayout from PyQt5.QtGui import QIcon import sys class MainWindow(QMainWindow): def init(self): super().init() combobox1 = QComboBox() combobox1.addItem('One') combobox1.addItem('Two') combobox1.addItem('Three') combobox1.addItem('Four') combobox2 = QComboBox() combobox2.addItems(['One', 'Two', 'Three', 'Four']) combobox3 = QComboBox() combobox3.addItems(['One', 'Two', 'Three', 'Four'])... from PyQt5.QtWidgets...
- [[SOLVED] QWidget::setWindowModified: The window title does not contain a '[*]' placeholder](https://forum.qt.io/topic/2070/solved-qwidget-setwindowmodified-the-window-title-does-not-contain-a-placeholder)
  - Hi everyone! I'm new to Qt and I started learning it from instruction videos in eLearning section. When I got to events I found something strange - the placeholder. I copied the code from this video (I home without mistakes) and compiled it. There was no errors and program executes correctly, but the compiler says "QWidget::setWindowModified: The window title does not contain a '[*]' placeholder". And I don't understand what is wrong. What is exactly a placeholder and where is it used? The...
- [Spin Boxes Example](https://doc.qt.io/qt-6/qtwidgets-widgets-spinboxes-example.html)
  - class Window : public QWidget { Q_OBJECT public: Window(QWidget *parent = nullptr); public slots: void changePrecision(int decimals); void setFormatString(const QString &formatString); private: void createSpinBoxes(); void createDateTimeEdits(); void createDoubleSpinBoxes(); QDateTimeEdit *meetingEdit; QDoubleSpinBox *doubleSpinBox; QDoubleSpinBox *priceSpinBox; QDoubleSpinBox *scaleSpinBox; QGroupBox *spinBoxesGroup; QGroupBox *editsGroup; QGroupBox *doubleSpinBoxesGroup; QLabel...
- [QComboBox Class | Qt Widgets 6.8.0](https://doc.qt.io/qt-6/qcombobox.html)
  - QComboBox(QWidget * parent = nullptr) virtual~QComboBox() voidaddItem(const QString & text, const QVariant & userData = QVariant()) voidaddItem(const QIcon & icon, const QString & text, const QVariant & userData = QVariant()) voidaddItems(const QStringList & texts) QCompleter *completer() const intcount() const QVariantcurrentData(int role = Qt::UserRole) const intcurrentIndex() const... QSizeiconSize() const voidinsertItem(int index, const QString & text, const QVariant & userData =...
- [QWidget Class | Qt Widgets 6.8.0](https://doc.qt.io/qt-6/qwidget.html)
  - QWidget(QWidget * parent = nullptr, Qt::WindowFlags f = Qt::WindowFlags()) virtual~QWidget() boolacceptDrops() const QStringaccessibleDescription() const QStringaccessibleName() const QList<QAction *>actions() const voidactivateWindow() voidaddAction(QAction * action) (since 6.3) QAction *addAction(const QString & text)... boolisActiveWindow() const boolisAncestorOf(const QWidget * child) const boolisEnabled() const boolisEnabledTo(const QWidget * ancestor) const boolisFullScreen() const...
- [Thread: Check if a window has been modified](https://www.qtcentre.org/threads/44026-Check-if-a-window-has-been-modified)
  - Quick question - if i have a form (i.e. window) with many child input widgets (e.g. text edit), can i detect if one of the widgets, and hence the form, has been modified? QWidget::isWindowModified() seems perfect for the job, but apparently i need to set it myself!? That kind of defeats the purpose, since i would need to write the code myself to detect change. I would have thought it would be built into Qt, so the modified property gets set whenever a widget changes, and all i have to do is...
