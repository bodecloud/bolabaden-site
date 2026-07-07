---
source_url: "https://www.perplexity.ai/search/90cf6c90-24e5-4685-b4a9-e4a02ecab833"
thread_uuid: "6d048b8d-651b-464a-971a-9454dc88d317"
slug: "90cf6c90-24e5-4685-b4a9-e4a02ecab833"
title: "I am editing Spyder IDE written for pyqt5/pyqt6 to be more like VS code and provide the ui features that electron generally offers that benefit vs code, stuff like being able to drag almost anything and have it just integrate wherever you want. etc. just make it more similar to vs code.

In terms of what the main user sees and interacts with, determine the large ui/interaction differences (e.g. drag+drop functionality of widgets) and the proper challenges/specific spots that could make it more like vs code"
extracted_at: "2026-06-29T12:53:30.581Z"
matched_keywords: ["docker"]
entry_count: 2
provenance: perplexity-rest-api
---

# I am editing Spyder IDE written for pyqt5/pyqt6 to be more like VS code and provide the ui features that electron generally offers that benefit vs code, stuff like being able to drag almost anything and have it just integrate wherever you want. etc. just make it more similar to vs code.

In terms of what the main user sees and interacts with, determine the large ui/interaction differences (e.g. drag+drop functionality of widgets) and the proper challenges/specific spots that could make it more like vs code

Source: [Perplexity thread](https://www.perplexity.ai/search/90cf6c90-24e5-4685-b4a9-e4a02ecab833)

## User

I am editing Spyder IDE written for pyqt5/pyqt6 to be more like VS code and provide the ui features that electron generally offers that benefit vs code, stuff like being able to drag almost anything and have it just integrate wherever you want. etc. just make it more similar to vs code.

In terms of what the main user sees and interacts with, determine the large ui/interaction differences (e.g. drag+drop functionality of widgets) and the proper challenges/specific spots that could make it more like vs code

## Assistant

To make Spyder IDE more like Visual Studio Code (VS Code), particularly in terms of user interface (UI) and interaction, there are several key differences and challenges to address. Below are the main areas where Spyder differs from VS Code and suggestions on how to bridge the gap:

## **Key UI/Interaction Differences**

### **1. Drag-and-Drop Functionality**
- **VS Code**: VS Code offers extensive drag-and-drop functionality, allowing users to rearrange editor tabs, move files between folders, and even drag custom tree views (e.g., for extensions) within the interface. The TreeDragAndDropController API allows handling drag-and-drop events for custom tree views, making it highly flexible for managing different panes and views.[1]
- **Spyder**: Spyder's drag-and-drop functionality is more limited. For instance, users have reported issues with dragging and dropping files when running Spyder from the command line. Additionally, Spyder lacks the ability to freely move widgets or panes around the interface as flexibly as VS Code.[4]
  
  **Challenge**: Implementing a more flexible drag-and-drop system in Spyder would require significant changes to its underlying PyQt5/PyQt6 framework. You would need to create custom drag-and-drop controllers for different panes (e.g., Variable Explorer, Editor, Console) and ensure smooth integration between them.

### **2. Pane Management and Customization**
- **VS Code**: VS Code allows users to customize their workspace extensively. Users can split the editor into multiple panes, move them around freely, and dock them in any part of the window. There is also a high degree of customization for sidebars (Activity Bar) and panels.[7]
- **Spyder**: While Spyder does allow users to toggle different panes (e.g., Variable Explorer, Console), the layout is relatively fixed compared to VS Code. The panes can be docked or undocked but lack the flexibility of being moved around or resized as freely as in VS Code.[9]

  **Challenge**: To make Spyder more like VS Code in this regard, you would need to enhance its pane management system. This could involve implementing a more modular docking system where each pane (Editor, Console, Variable Explorer) can be moved and resized dynamically.

### **3. Extension System**
- **VS Code**: One of VS Code's most powerful features is its extensibility through plugins and extensions. These extensions can add new languages, debuggers, themes, and even entire workflows like Docker integration or Jupyter Notebooks.[7]
- **Spyder**: While Spyder has a plugin system, it is not as extensive or easy to use as VS Code's marketplace-based approach. Spyder’s plugins are more focused on scientific computing needs (e.g., data visualization).[8]

  **Challenge**: Expanding Spyder’s plugin system to allow for broader functionality would require creating a more user-friendly plugin manager with a marketplace-like interface where users can easily search for and install plugins.

### **4. Integrated Terminal and Git Support**
- **VS Code**: VS Code has a built-in terminal that supports multiple shells (bash, PowerShell, etc.), along with integrated Git support that allows users to manage version control directly from the editor.[7]
- **Spyder**: While Spyder includes an IPython console for interactive Python sessions, it lacks a general-purpose terminal or integrated Git support comparable to VS Code.[5]

  **Challenge**: Adding an integrated terminal that supports multiple shells could be achieved by embedding a terminal widget (e.g., QTerminal). For Git integration, you could implement a Git panel similar to VS Code’s Source Control view.

### **5. Customizable Themes and UI Consistency**
- **VS Code**: Users can easily switch between themes in VS Code, including syntax highlighting themes that are consistent across different parts of the UI.[7]
- **Spyder**: While Spyder does offer customizable syntax highlighting themes, users have reported inconsistencies between interface themes and syntax themes. Additionally, color management across different UI elements has been problematic in previous versions.[6][9]

  **Challenge**: Improving theme consistency across Spyder’s interface would involve refactoring how colors are applied throughout the UI. This could be done by centralizing color definitions so that they apply uniformly across both light and dark modes.

## **Specific Areas for Improvement**

### **1. Workspace Customization**
To make Spyder more like VS Code in terms of workspace customization:
- Implement flexible pane management where users can drag panes (e.g., Editor, Console) into different sections of the window.
- Allow users to save custom layouts that can be easily switched between for different workflows.

### **2. Drag-and-Drop Enhancements**
Enhance drag-and-drop functionality by:
- Enabling dragging of tabs between different editor windows.
- Allowing files to be dragged into specific directories in the file explorer.
- Implementing custom drag controllers for moving items between variable explorer panels or other widgets.

### **3. Plugin Ecosystem Expansion**
To compete with VS Code’s extensibility:
- Create a visual plugin manager that allows users to browse and install plugins directly from within Spyder.
- Encourage community contributions by simplifying plugin development with better documentation and examples.

### **4. Integrated Terminal & Git**
Add an embedded terminal widget that supports various shells like bash or PowerShell. Additionally:
- Integrate Git functionality directly into the IDE with features like commit history viewing, branch switching, and conflict resolution.

### **5. Improved UI Consistency**
Ensure that all UI elements follow consistent color schemes across light/dark modes by refactoring how colors are applied throughout the application.

## Conclusion
Transforming Spyder into an IDE with features comparable to VS Code will require significant changes in terms of UI flexibility (drag-and-drop), workspace customization, extension support, terminal integration, and overall theme consistency. However, these improvements could make Spyder not only more powerful but also more appealing to a broader audience beyond scientific computing specialists.

### Sources

- [Is it possible to drag & drop between custom VS Code tree views?](https://stackoverflow.com/questions/72055681/is-it-possible-to-drag-drop-between-custom-vs-code-tree-views)
  - The 1.66 (March 2022) release introduces a TreeDragAndDropController API which allows for handling drag & drop events for custom tree views.
- [IDEs better than VS Code : r/learnprogramming - Reddit](https://www.reddit.com/r/learnprogramming/comments/ub8o9s/ides_better_than_vs_code/)
  - As for good IDEs, there are two that are bar none the best, Visual Studio and the JetBrains suite. JetBrains separates out an IDE per domain/language so there' ...
- [Spyder is underrated : r/Python - Reddit](https://www.reddit.com/r/Python/comments/lttufx/spyder_is_underrated/)
  - I use Spyder for thousands of lines. Using cells gives you a collapsible outline which makes it easy to move around if you organize your code.
- [Can not drag and drop in Spyder when run from cmd - Stack Overflow](https://stackoverflow.com/questions/64205251/can-not-drag-and-drop-in-spyder-when-run-from-cmd)
  - When running Spyder from the command promp, we can not drag and drop files in the IDE. Using anaconda prompt as admin.
- [Using Spyder vs Visual Code Studio : r/Python - Reddit](https://www.reddit.com/r/Python/comments/wlvq3b/using_spyder_vs_visual_code_studio/)
  - I switched from Spyder to VSC. VSC is way better for writing actually programs. I also found it is easier for me to turn my scripts into ...
- [Issues · spyder-ide/ux-improvements - GitHub](https://github.com/spyder-ide/ux-improvements/issues)
  - Visual signal should be shown when the code-running is done and Spyder doesn't have the focus (e.g flashing application icon on the taskbar).
- [Tutorial: Get started with Visual Studio Code](https://code.visualstudio.com/docs/getstarted/getting-started)
- [Overview — Spyder 3 documentation](https://docs.spyder-ide.org/3/overview.html)
- [Spot the differences: what is new in Spyder 5? | Quansight Labs](https://labs.quansight.org/blog/2021/04/spot-the-diffenrences)

## User

How can I improve the usability of Spyder's interface to make it more like VS Code

## Assistant

To improve the usability of Spyder's interface and make it more similar to Visual Studio Code (VS Code), several key areas need to be addressed. Below are the main differences between Spyder and VS Code in terms of user experience, along with specific challenges and suggestions for enhancing Spyder's UI.

## **Key Areas for Improvement**

### **1. Drag-and-Drop Functionality**
- **VS Code**: Offers extensive drag-and-drop functionality, allowing users to move tabs, files, and even custom views across different parts of the interface seamlessly.
- **Spyder**: The drag-and-drop system is more limited. Users cannot freely move panes or tabs as flexibly as in VS Code.

#### **Challenges and Solutions**:
- **Challenge**: Implementing a flexible drag-and-drop system in Spyder would require significant changes to the PyQt5/PyQt6 framework.
- **Solution**: 
  - Enhance Spyder’s drag-and-drop functionality by using Qt’s drag-and-drop API. You can implement custom `QDrag` and `QDropEvent` handlers for different widgets (e.g., Editor, Variable Explorer) to allow users to rearrange panes dynamically.[4]
  - Follow best practices for drag-and-drop UX design, such as providing visual feedback (e.g., hover effects or animations) when users interact with draggable elements.[3][8]

### **2. Pane Management and Layout Customization**
- **VS Code**: Allows users to split the editor into multiple panes, move them freely around the workspace, and save custom layouts.
- **Spyder**: While Spyder allows docking and undocking of panes (like the Console or Variable Explorer), it lacks the flexibility of VS Code’s pane management.

#### **Challenges and Solutions**:
- **Challenge**: Spyder’s layout is relatively rigid, making it difficult for users to fully customize their workspace.
- **Solution**: 
  - Implement a more modular docking system where each pane can be moved or resized freely. This could be achieved by leveraging Qt's `QDockWidget` class, which allows for more flexible pane management.[4]
  - Allow users to save custom layouts that can be easily switched between different workflows (e.g., data analysis vs. coding).

### **3. Integrated Terminal and Git Support**
- **VS Code**: Includes an integrated terminal with support for multiple shells (bash, PowerShell) and built-in Git support.
- **Spyder**: While Spyder includes an IPython console, it lacks a general-purpose terminal and built-in Git integration.

#### **Challenges and Solutions**:
- **Challenge**: Adding a terminal that supports multiple shells requires embedding a terminal widget into Spyder’s UI.
- **Solution**:
  - Embed a terminal widget (such as QTerminal) in Spyder to provide shell support alongside the IPython console.
  - For Git integration, implement a Git panel similar to VS Code’s Source Control view. This could involve adding buttons for common Git operations (commit, push, pull) directly within Spyder’s interface.[1][2]

### **4. Extension System**
- **VS Code**: Has a robust extension marketplace that allows users to add new features, languages, debuggers, etc.
- **Spyder**: While Spyder has plugins, its ecosystem is not as extensive or user-friendly as VS Code’s extension system.

#### **Challenges and Solutions**:
- **Challenge**: Expanding Spyder’s plugin ecosystem requires building a more user-friendly plugin manager.
- **Solution**:
  - Develop a visual plugin manager where users can search for, install, and manage plugins directly from within Spyder. This would make it easier to extend Spyder’s functionality without leaving the IDE.[1]

### **5. Workspace Customization**
- **VS Code**: Supports "workspaces," allowing users to open multiple folders in one instance and configure settings specific to each workspace.
- **Spyder**: Lacks an equivalent workspace feature that allows multiple folders or projects to be managed simultaneously.

#### **Challenges and Solutions**:
- **Challenge**: Implementing multi-root workspaces in Spyder would require managing multiple folder configurations within a single instance.
- **Solution**:
  - Introduce a workspace feature similar to VS Code’s multi-root workspaces. Allow users to open multiple projects simultaneously and configure project-specific settings like environment variables or debugger configurations.[6]

### **6. Customizable Themes and UI Consistency**
- **VS Code**: Offers extensive theme customization with consistent application across the entire interface.
- **Spyder**: While themes are available for syntax highlighting, there are inconsistencies across different parts of the UI.

#### **Challenges and Solutions**:
- **Challenge**: Ensuring consistent theme application across all UI elements requires refactoring how colors are applied throughout the interface.
- **Solution**:
  - Centralize theme management so that all UI elements—menus, buttons, panes—follow the same color scheme. This would improve consistency between light/dark modes.[5]

## Conclusion
To make Spyder more like VS Code in terms of usability:

1. Enhance drag-and-drop functionality by implementing custom handlers for widgets using Qt's API.
2. Improve pane management by allowing more flexible docking and layout customization.
3. Add an integrated terminal with support for multiple shells and improve Git integration with a dedicated panel.
4. Expand the plugin ecosystem by developing a visual plugin manager similar to VS Code's extension marketplace.
5. Introduce workspace features that allow users to manage multiple projects simultaneously.
6. Ensure consistent theme application across all UI elements.

These changes would significantly enhance Spyder's usability while maintaining its strengths in scientific computing workflows.

### Sources

- [Using Spyder vs Visual Code Studio : r/Python - Reddit](https://www.reddit.com/r/Python/comments/wlvq3b/using_spyder_vs_visual_code_studio/)
  - vscode is better for remote ssh access to files, and for larger codebases of many files. Spyder is better for interactivity. I use them both.
- [Visual Studio Code or Spyder IDE? : r/learnpython - Reddit](https://www.reddit.com/r/learnpython/comments/1dr8m3v/visual_studio_code_or_spyder_ide/)
  - Having a pane with a terminal as well as a code tab+IPython tab is an improvement for me, compared to Spyder. Upvote 6. Downvote Reply ...
- [Design Principles for Drag-and-Drop Interfaces | AppMaster](https://appmaster.io/blog/design-principles-for-drag-and-drop-interfaces)
  - The key design principles include visual clarity, direct manipulation, explicit feedback, context preservation, smart defaults and constraints, and cross- ...
- [Drag and Drop | Qt GUI 6.8.0 - Qt Documentation](https://doc.qt.io/qt-6/dnd.html)
  - This document describes the basic drag and drop mechanism and outlines the approach used to enable it in custom controls.
- [Top Most Popular IDE Picks for Developers in 2024 - SkillReactor Blog](https://www.skillreactor.io/blog/best-most-popular-ides/)
  - This article will explore the top most popular IDE picks for developers in 2024. We will delve into the features, strengths, and weaknesses of these IDEs.
- [Workspaces in Visual Studio Code](https://code.visualstudio.com/docs/editor/workspaces)
  - What is a VS Code "workspace"? A Visual Studio Code workspace is the collection of one or more folders that are opened in a VS Code window (instance).
- [What IDE do you use and why ? : r/learnprogramming - Reddit](https://www.reddit.com/r/learnprogramming/comments/15v8b12/what_ide_do_you_use_and_why/)
  - Best bet would be Intellij IDEA and other Jetbrains products as it is very powerful and pretty comfortable when using it.
- [Drag and drop UX: Best practices and tutorial - LogRocket Blog](https://blog.logrocket.com/ux-design/drag-drop-ux-best-practices/)
