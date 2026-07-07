---
source_url: "https://www.perplexity.ai/search/cc2414f4-344d-4d0b-81a3-e0c39330cdc8"
thread_uuid: "b6fc3bc0-4ef4-46d8-a498-97df3a4d8fe4"
slug: "cc2414f4-344d-4d0b-81a3-e0c39330cdc8"
title: "I am writing a code editor in Python for PyQt5/PyQt6. It is made specifically for a proprietary language. I'm finding it tedious to write a whole IDE from scratch. Would it be easier to copy code from QScintilla or Spyder IDE?"
extracted_at: "2026-06-29T16:31:16.131Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# I am writing a code editor in Python for PyQt5/PyQt6. It is made specifically for a proprietary language. I'm finding it tedious to write a whole IDE from scratch. Would it be easier to copy code from QScintilla or Spyder IDE?

Source: [Perplexity thread](https://www.perplexity.ai/search/cc2414f4-344d-4d0b-81a3-e0c39330cdc8)

## User

I am writing a code editor in Python for PyQt5/PyQt6. It is made specifically for a proprietary language. I'm finding it tedious to write a whole IDE from scratch. Would it be easier to copy code from QScintilla or Spyder IDE?

## Assistant

Creating a full-featured code editor from scratch can indeed be a complex and time-consuming task. Given your specific requirements for a proprietary language, using existing open-source projects like QScintilla or Spyder IDE as a starting point could significantly streamline your development process. However, there are important considerations to keep in mind:

## QScintilla

QScintilla is a port of the Scintilla editing component to Qt, offering a powerful foundation for building code editors. It provides:[5][8]

- Syntax highlighting for over 70 languages
- Code folding
- Error indicators
- Code completion
- Call tips
- Multiple views
- Printing support

Using QScintilla could give you a robust base to build upon, especially if you're already working with PyQt5/PyQt6. It's designed to be extensible, allowing you to add custom lexers for syntax highlighting of your proprietary language.[8]

## Spyder IDE

Spyder is a full-fledged scientific Python IDE that uses QScintilla as its editing component. While it offers many features out of the box, it may provide more functionality than you need for your specific use case. However, examining Spyder's source code could give you valuable insights into:[1][2][4]

- How to integrate QScintilla with PyQt
- Implementing advanced features like code analysis and debugging
- Structuring a larger IDE project

## Considerations

1. **Licensing**: QScintilla is available under both GPL and commercial licenses. Ensure you comply with the licensing terms if you decide to use or adapt code from these projects.[8]

2. **Customization**: Both options will require significant customization to support your proprietary language. You'll need to implement a custom lexer for syntax highlighting and potentially modify other language-specific features.

3. **Maintenance**: Consider the long-term implications of basing your editor on these projects. Will you be able to keep up with updates and potential breaking changes?

4. **Learning Curve**: While using existing code can save time, there's still a learning curve to understand and effectively use the QScintilla API or Spyder's codebase.

## Recommendation

Given your requirements, starting with QScintilla is likely the most efficient approach. It provides a solid foundation for a code editor while allowing for the necessary customization for your proprietary language. You can:

1. Set up a basic QScintilla editor in PyQt5/PyQt6.
2. Implement a custom lexer for your language's syntax highlighting.
3. Gradually add features specific to your language and use case.

This approach gives you the benefits of a proven editing component while maintaining the flexibility to tailor the editor to your exact needs. Remember to review the licensing terms and ensure compliance with your project's requirements.

### Sources

- [Editor — Spyder 3 documentation](https://docs.spyder-ide.org/3/editor.html)
  - Spyder’s multi-language Editor integrates a number of powerful tools right out of the box for an easy to use, efficient editing experience. The Editor’s key features include syntax highlighting (pygments); real-time code and style analysis (pyflakes and pycodestyle); on-demand completion, calltips and go-to-definition features (rope and jedi); a function/class browser, horizontal and vertical splitting, and much more. pygments pyflakes pycodestyle rope jedi Outline Explorer...
- [Editor — Spyder 5 documentation](https://docs.spyder-ide.org/current/panes/editor.html)
  - Spyder’s multi-language Editor pane is the key element of the IDE, where you can create, open, and modify source files. The Editor offers a variety of core features, such as autocompletion, real-time analysis, syntax highlighting, horizontal and vertical splitting, and much more. In addition, it integrates a number of powerful tools for an easy to use, efficient editing experience.... ### Code cells# A “code cell” in Spyder is a block of lines, typically in a script, that can be easily...
- [How to implement indentation based code folding in QScintilla?](https://stackoverflow.com/questions/55426342/how-to-implement-indentation-based-code-folding-in-qscintilla)
  - import sys from PyQt5.Qsci import QsciScintilla from PyQt5.Qt import * if name == 'main': app = QApplication(sys.argv) view = QsciScintilla() view.setFolding(QsciScintilla.BoxedTreeFoldStyle) lines = [ (0, "def foo():"), (1, " x = 10"), (1, " y = 20"), (1, " return x+y"), (-1, ""), (0, "def bar(x):"), (1, " if x > 0:"), (2, " print('this is')"), (2, " print('branch1')"), (1, " else:"),... (2, " print('and this')"), (2, " print('is branch2')"), (-1, ""), (-1, ""), (-1, ""), (-1,...
- [PyCharm vs. Spyder: Which Should You Use? - BestColleges.com](https://www.bestcolleges.com/pycharm-vs-spyder-which-should-you-use/)
  - An IDE enables programmers to efficiently consolidate different aspects of writing software into a single application for editing source code. While you can code in Microsoft Windows Notepad, an IDE combines coding tools with a debugging environment. PyCharm and Spyder Python IDEs offer various tools, such as notebooks, for use in data science. Spyder uses built-in features, so you don’t need to install anything else to start developing. The Spyder IDE was built specifically to use in data...
- [QScintilla - a Port to Qt v5 and Qt v6 of Scintilla - GitHub](https://github.com/brCreate/QScintilla)
  - QScintilla is a port to Qt of the Scintilla editing component. As well as features found in standard text editing components, Scintilla includes features especially useful when editing and debuggin source code: syntax styling with support for over 70 languages error indicators code completion call tips code folding margins can contain markers like those used in debuggers to indicate breakpoints and the current line. recordable macros multiple views printing. QScintilla is a port or Scintilla...
- [Spyder | The Python IDE that scientists and data analysts deserve](https://www.spyder-ide.org)
  - Designed by the community, for the community Data analysts, scientists and engineers require a lot of experimentation, quick feedback and short iteration cycles while programming. Spyder was built from the ground up around that workflow. Spyder includes out of the box integration with Matplotlib, Pandas and many other libraries to help you work more efficiently with them. The software you write is critical for new scientific discoveries and engineering solutions. Spyder helps you move from...
- [Scintilla (software) - Wikipedia](https://en.wikipedia.org/wiki/Scintilla_(software))
  - Developer(s)Neil Hodgson, et al. Initial release17 May 1999 Stable release5.5.2 (21 August 2024 ) [±] Repository Written inC++ Operating systemWindows NT and later, Mac OS 10.6 and later, Unix-like with GTK+, MorphOS TypeText editor LicenseHistorical Permission Notice and Disclaimer Websitescintilla Scintilla is a free, open-source library that provides a text editing component function, with an emphasis on advanced features for source code editing. Scintilla supports many features to make...
- [QScintilla - PyPI](https://pypi.org/project/QScintilla/)
  - Python bindings for the QScintilla programmers editor widget QScintilla is a port to Qt of the Scintilla programmers editor widget. It supports the traditional low-level Scintilla API and implements a high-level API covering such things as auto-completion, code folding and lexer configuration. These Python bindings implement a single extension module that sits on top of PyQt5 and wraps both the low-level and high-level APIs. QScintilla is released under the GPL v3 license and under a...
- [Scintilla Documentation](https://scintilla.org/ScintillaDoc.html)
  - The Windows version of Scintilla is a Windows Control. As such, its primary programming interface is through Windows messages. Early versions of Scintilla emulated much of the API defined by the standard Windows Edit and RichEdit controls but those APIs are now deprecated in favour of Scintilla's own, more consistent API. In addition to messages performing the actions of a normal Edit control, Scintilla allows control of syntax styling, folding, markers, autocompletion and call tips. The GTK...
- [QScintilla](https://qscintilla.com)
  - Table of Contents Home Intro What is QScintilla? Installation Class hierarchy The Editor Simple options Text wrapping End-of-line options Indentation Caret Margins Margin basics Line number margin Symbol margin Folding margin Text margin Margin example Mouse clicks Margin mouse clicks example Regex Regex basics Repeaters Wildcards Character classes Character groups Zero-width assertions Syntax highlighting Lexer basics Subclass QSciLexerCustom All about styles The highlighting engine Tokenize...
