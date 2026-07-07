---
source_url: "https://www.perplexity.ai/search/b99d0d6f-da85-4f61-9c02-242672cd2ffc"
thread_uuid: "9ff94b90-925b-4a56-a95f-80cb817aa2de"
slug: "b99d0d6f-da85-4f61-9c02-242672cd2ffc"
title: "make qt uis feel like electron/react.

feels like all of my qt widgets look bland and tasteless, while electron provides it easily."
extracted_at: "2026-06-29T16:09:15.766Z"
matched_keywords: []
export_suite: "identity"
entry_count: 3
provenance: perplexity-rest-api
---

# make qt uis feel like electron/react.

feels like all of my qt widgets look bland and tasteless, while electron provides it easily.

Source: [Perplexity thread](https://www.perplexity.ai/search/b99d0d6f-da85-4f61-9c02-242672cd2ffc)

## User

make qt uis feel like electron/react.

feels like all of my qt widgets look bland and tasteless, while electron provides it easily.

## Assistant

To make Qt UIs feel more like Electron/React applications, which are often praised for their modern and visually appealing designs, you can consider several strategies and tools:

## **Use QML for Modern Design**

- **QML and Qt Quick**: QML is a declarative language that allows for the creation of dynamic and fluid UIs. It is often recommended for developing modern interfaces in Qt due to its simplicity and power in handling animations and custom styles.[2][5]
- **Qt Quick Controls**: Utilize Qt Quick Controls 2, which provides a set of UI controls that are designed to be customizable and can help achieve a modern look.[6]

## **Custom Styling with Stylesheets**

- **Qt Stylesheets (QSS)**: Similar to CSS in web development, Qt stylesheets allow you to customize the appearance of widgets. This can be used to apply a consistent style across your application, making it look more modern and cohesive.[1][2]
- **Material Design Libraries**: Consider using libraries like `qt-material-widgets` or other third-party libraries that provide pre-designed components with a material design aesthetic.[5][1]

## **Leverage Third-Party Libraries**

- **Telegram UI Library**: This library provides a modern style for Qt Widgets and can be a good starting point if you're looking for an out-of-the-box solution to achieve a flat, material design.[5]
- **NodeGui**: If you are familiar with JavaScript and Node.js, NodeGui allows you to create native desktop applications using Qt with JavaScript, providing an alternative approach similar to Electron.[8]

## **Best Practices and Tools**

- **Qt Creator**: Use Qt Creator's design tools to visually design your UI. It supports both QML and traditional QWidget-based applications.
- **Community Examples**: Explore examples from the Qt community to see how others have achieved modern designs with Qt. This can provide inspiration and practical solutions that you can adapt for your projects.[3][1]

By combining these strategies, you can create Qt applications that not only function well but also have the sleek, modern appearance associated with Electron and React applications.

### Sources

- [How to develop nice-looking, visually modern applications in QT?](https://forum.qt.io/topic/115115/how-to-develop-nice-looking-visually-modern-applications-in-qt)
  - Hello, I'm wondering how to develop visually modern, with attractive GUI applications in QT. When I run QT Creator and start new project, the GUI looks very ...
- [How to make the default UI elements in Qt more beautiful?](https://stackoverflow.com/questions/15084812/how-to-make-the-default-ui-elements-in-qt-more-beautiful)
  - I am learning to use Qt & currently able to develop an Application with most of the widgets in their standard format. Now I want to make my widgets more beautiful. The standard one's are very d...
- [Modern looking GUI : r/learnpython - Reddit](https://www.reddit.com/r/learnpython/comments/rbn83y/modern_looking_gui/)
- [Best Practice Guides | Qt 6.8 - Qt Documentation](https://doc.qt.io/qt-6/best-practices.html)
  - How-To and Best Practice Guides
- [Modern/Flat/Material UI using QT Widgets : r/QtFramework - Reddit](https://www.reddit.com/r/QtFramework/comments/vyqo4b/modernflatmaterial_ui_using_qt_widgets/)
- [Native look and feel - Qt](https://www.qt.io/blog/2017/02/06/native-look-feel)
  - Native look and feel
- [What is Qt and how does it change HMI industrial automation?](https://spyro-soft.com/blog/hmi/revolutionising-industrial-automation-unleashing-the-potential-of-qt-based-hmi-development)
  - Learn more about the revolution in industrial automation powered by HMI solutions and cutting-edge Qt Framework for HMI.
- [Replace Electron UI with Qt · Issue #348 · sedwards2009/extraterm](https://github.com/sedwards2009/extraterm/issues/348)
  - Here are some technical details about how this transition is going to work. The core language used will remain TypeScript/JavaScript running on the fast V8 engine via nodejs. This is good news and ...

## User

is there any way to do it without qml? it's annoying to use

## Assistant

If you want to create modern-looking Qt applications without using QML, there are several approaches you can take to enhance the appearance of your Qt Widgets:

## **Use Qt Style Sheets (QSS)**

- **Qt Style Sheets**: Similar to CSS, Qt Style Sheets allow you to customize the appearance of widgets. While some developers find them less powerful than QML, they can still be used effectively to achieve a modern look by applying styles globally or to specific widgets.[1][3]
- **Examples and Documentation**: You can find examples of how to use stylesheets in the official Qt documentation, which provides guidance on styling various widgets.[3]

## **Custom QStyle Subclass**

- **QStyle Subclassing**: Creating a custom QStyle subclass allows for more control over widget rendering than stylesheets. This approach can be more complex but offers greater flexibility and performance.[2]
- **QProxyStyle**: Start by subclassing `QProxyStyle` to incrementally style your widgets. Once satisfied, you can switch to `QCommonStyle` for consistent appearance across platforms.[2]

## **Third-Party Libraries**

- **Qt Material Widgets**: Libraries like `qt-material-widgets` provide pre-designed components with a modern aesthetic. These libraries often include custom widgets that mimic material design, helping your application look more contemporary without much effort.[3]
- **Telegram's UI Library**: Consider using Telegram's UI library, which adds a modern style to Qt Widgets. However, be aware that it might have dependencies and licensing considerations.[1]

## **Best Practices**

- **Mix and Match**: Some developers find success by combining stylesheets for basic styling with custom QStyle subclasses for more complex needs. This hybrid approach can balance ease of use with powerful customization capabilities.[2]
- **Community Resources**: Explore community forums and repositories for additional tools and examples that can help achieve the desired look without relying on QML.[3]

By leveraging these techniques, you can create visually appealing Qt applications using traditional QWidget-based approaches without resorting to QML.

### Sources

- [Modern/Flat/Material UI using QT Widgets](https://www.reddit.com/r/QtFramework/comments/vyqo4b/modernflatmaterial_ui_using_qt_widgets/)
- [Say No to Qt Style Sheets - KDAB](https://www.kdab.com/say-no-to-qt-style-sheets/)
  - Qt Style Sheets create too much trouble when it comes to custom-styling widgets; a QStyle subclass (*) is a better choice, in the long run.
- [How to develop nice-looking, visually modern applications in QT?](https://forum.qt.io/topic/115115/how-to-develop-nice-looking-visually-modern-applications-in-qt)
  - Hello, I'm wondering how to develop visually modern, with attractive GUI applications in QT. When I run QT Creator and start new project, the GUI looks very ...
- [How to make the default UI elements in Qt more beautiful?](https://stackoverflow.com/questions/15084812/how-to-make-the-default-ui-elements-in-qt-more-beautiful)
  - I am learning to use Qt & currently able to develop an Application with most of the widgets in their standard format. Now I want to make my widgets more beautiful. The standard one's are very d...

## User

Yeah I see material widgets used frequently. It's decent, but it gets stale. What else exists that's as good as material widgets, but different?

## Assistant

If you're looking for alternatives to material design widgets in Qt that offer a different aesthetic, there are several options you can explore:

## **Telegram's UI Library**

- **Telegram's UI Library**: This library offers a modern style for Qt Widgets and can be a good alternative to material design. It provides a sleek, flat look that is visually appealing. However, be aware that it is licensed under the GPL, which may impose restrictions on its use in proprietary projects.[1]

## **QSkinny**

- **QSkinny**: This is a C++-based UI framework that leverages the Qt graphics stack. It provides a modern and flexible approach to designing UIs with Qt, allowing you to build visually appealing applications without relying heavily on QML. QSkinny offers advanced UI elements and layouts, making it a versatile choice for creating contemporary interfaces.[4]

## **Custom Styling with Qt Style Sheets**

- **Qt Style Sheets (QSS)**: While not a library per se, using Qt Style Sheets allows you to customize the appearance of your application extensively. You can create unique styles that deviate from the typical material design by experimenting with different color schemes, fonts, and widget shapes.[3]

## **Other Libraries and Resources**

- **Awesome Qt List**: This curated list includes various tools and libraries for Qt development. While it primarily focuses on providing functionality rather than styling, it might contain resources or inspiration for creating unique UI designs.[2]

By exploring these options, you can create Qt applications with modern and distinctive aesthetics that go beyond the typical material design approach.

### Sources

- [Modern/Flat/Material UI using QT Widgets](https://www.reddit.com/r/QtFramework/comments/vyqo4b/modernflatmaterial_ui_using_qt_widgets/)
- [JesseTG/awesome-qt - GitHub](https://github.com/JesseTG/awesome-qt)
  - A curated list of awesome tools, libraries, and resources for the Qt framework. - JesseTG/awesome-qt
- [How to develop nice-looking, visually modern applications in QT?](https://forum.qt.io/topic/115115/how-to-develop-nice-looking-visually-modern-applications-in-qt)
  - Hello, I'm wondering how to develop visually modern, with attractive GUI applications in QT. When I run QT Creator and start new project, the GUI looks very ...
- [The QSkinny UI framework: Home](https://qskinny.github.io)
  - A documentation theme
