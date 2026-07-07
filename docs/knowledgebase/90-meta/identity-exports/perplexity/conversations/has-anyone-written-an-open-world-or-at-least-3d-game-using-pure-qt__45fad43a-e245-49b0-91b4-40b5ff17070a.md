---
source_url: "https://www.perplexity.ai/search/3ed167fe-538b-4618-9467-9bc8b89988c3"
thread_uuid: "45fad43a-e245-49b0-91b4-40b5ff17070a"
slug: "3ed167fe-538b-4618-9467-9bc8b89988c3"
title: "Has anyone written an open-world, or at least 3d, game using pure Qt...?"
extracted_at: "2026-06-29T16:09:20.180Z"
matched_keywords: []
export_suite: "identity"
entry_count: 10
provenance: perplexity-rest-api
---

# Has anyone written an open-world, or at least 3d, game using pure Qt...?

Source: [Perplexity thread](https://www.perplexity.ai/search/3ed167fe-538b-4618-9467-9bc8b89988c3)

## User

Has anyone written an open-world, or at least 3d, game using pure Qt...?

## Assistant

Yes, there have been attempts to create open-world or 3D games using pure Qt, though such projects are relatively rare. Qt is primarily designed for creating cross-platform graphical user interfaces (GUIs), and while it includes features like OpenGL integration and the Qt3D module for 3D rendering, it is not specifically optimized for game development. Below are some examples and insights into using Qt for 3D or open-world games:

## Examples of 3D Games or Projects Using Qt

1. **WolfenQt**:
   - This is an example of a simple 3D first-person shooter (FPS) created with Qt. It demonstrates how to integrate OpenGL with Qt widgets to render a 3D environment. While it is not a full-fledged game, it provides a foundation for learning how to manipulate 3D objects and create FPS-like behavior in a Qt-based application.[2]

2. **Minecraft-Style Voxel Game**:
   - A developer at KDAB created a Minecraft-inspired 3D block-building game using QML and the Qt Quick Rendering Engine. This project showcases how QML, typically used for 2D interfaces, can be adapted to render simple 3D graphics through transformations and hierarchical scene graphs.[4]

3. **Qt3D-Based Projects**:
   - The Qt3D module allows developers to build interactive 3D applications, including games. It provides features like scene graphs, rendering, and input handling. While there are no widely known open-world games built purely with Qt3D, the module has been used for educational tools and smaller-scale 3D projects.[6]

## Challenges of Using Pure Qt for Game Development

1. **Performance Limitations**:
   - Qt is not optimized for high-performance game rendering compared to dedicated game engines like Unity or Unreal Engine. Developers often find that using Qt for intensive 3D graphics can result in suboptimal performance unless significant custom optimizations are implemented.[8]

2. **Complexity**:
   - While Qt provides tools like QGLWidget (for OpenGL integration) and Qt3D, creating a full-fledged game engine from scratch using these tools requires extensive knowledge of both OpenGL/Vulkan and game design principles. This makes it less accessible compared to engines that come with built-in game development features.

3. **Limited Ecosystem for Games**:
   - The lack of pre-built components (e.g., physics engines, AI systems, asset pipelines) tailored for gaming means developers must either build these systems themselves or rely on third-party libraries, which can increase development time and complexity.

## When to Use Qt for Games

Despite its limitations, Qt can be a good choice in specific scenarios:
- **Tool Development**: Many developers use Qt to create tools like level editors or asset managers because of its robust GUI capabilities.
- **Interface-Heavy Games**: Games that rely heavily on GUIs (e.g., simulation or management games) can benefit from Qt's UI framework.
- **Education and Prototyping**: For learning purposes or prototyping small-scale games, especially when leveraging existing knowledge of Qt.

## Conclusion

While it is possible to create 3D or open-world games using pure Qt, it is not common due to the framework's focus on GUI development rather than gaming performance or features. Developers interested in this approach often combine Qt with other libraries like OpenGL, Vulkan, or physics engines (e.g., Box2D). For larger-scale projects, dedicated game engines are generally more practical choices. However, if you are experienced with Qt and enjoy its cross-platform capabilities, experimenting with it for game development can be an educational and rewarding experience.[1][4][6]

### Sources

- [Qt Based Games - Qt Wiki](https://wiki.qt.io/Qt_Based_Games)
- [Looking for simple 3d games made with Qt that are open sourced](https://forum.qt.io/topic/5888/looking-for-simple-3d-games-made-with-qt-that-are-open-sourced)
  - Hello all im new to OpenGL, but i know Qt well , i like to learn by looking in source code of 3d games made with Qt beside the examples that comes with Qt ca...
- [Welcome! | Qt Forum](https://forum.qt.io/topic/84/welcome)
  - Welcome to Game Development sub forum! Very often games present a totally different set of problems to solve and requires that things are done a little bit d...
- [A 3D Block Building Game in QML - KDAB on Qt](https://www.kdab.com/3d-block-building-game/)
  - Have fun learning more about the Qt Quick Rendering engine, starting with a ground plane, in this Minecraft-esque 3D block building game.
- [Will Qt be a good choice for a game? [closed] - Stack Overflow](https://stackoverflow.com/questions/4905222/will-qt-be-a-good-choice-for-a-game)
  - I am wanting to make a 2d, tower defense game. I currently have a version in C# made using XNA, but thought it might be fun to learn Qt as well as run my game on other platforms. The graphics aren'...
- [QT and 3D applications development(Game etc.). - Qt Forum](https://forum.qt.io/topic/118862/qt-and-3d-applications-development-game-etc)
  - Hi, I'm new to Qt. I am interested in 3D application development like games with Qt. I choose Qt for its GUI. I'm also interested in directx 11 and vulkan....
- [Thread: Qt and game development - Qt Centre Forum](https://www.qtcentre.org/threads/53473-Qt-and-game-development)
- [I don't see Qt used much for game development. Any reasons why?](https://www.reddit.com/r/gamedev/comments/hnestp/i_dont_see_qt_used_much_for_game_development_any/)

## User

Find a real game that exists on Steam written in Qt.

## Assistant

A notable example of a game written using Qt that is available on Steam is **"Pico Islands"**. It is a city-building game developed using Qt C++ and QML. While it is primarily designed for mobile platforms like Android and iOS, it has been highlighted as a Qt-based game and could potentially be adapted for other platforms, including PC. However, its availability on Steam is uncertain based on the provided search results.

Additionally, while there are many games and tools developed with Qt (e.g., "Dust Racing 2D" or "Dead Ascend"), most of them are not explicitly listed as available on Steam. Many Qt-based games tend to be smaller indie projects or open-source initiatives rather than large-scale commercial games commonly found on platforms like Steam.

If you're specifically looking for a Qt-based game currently on Steam, you may need to search further or explore smaller indie titles that might use Qt for their development backend.

### Sources

- [Qt Based Games - Qt Wiki](https://wiki.qt.io/Qt_Based_Games)
- [Looking for simple 3d games made with Qt that are open sourced](https://forum.qt.io/topic/5888/looking-for-simple-3d-games-made-with-qt-that-are-open-sourced)
  - Hello all im new to OpenGL, but i know Qt well , i like to learn by looking in source code of 3d games made with Qt beside the examples that comes with Qt ca...

## User

How to use pure python to make a godot game?

## Assistant

To use pure Python to create a game in Godot, you can leverage Python scripting support through tools like **godot-python** or similar extensions. Below is a detailed guide based on the search results:

---

## **1. Overview of Python Support in Godot**

Godot natively uses GDScript for scripting, but with tools like **godot-python**, you can write scripts in Python. These tools integrate Python as a scripting language by exposing Godot's API to Python, allowing you to develop games using Python instead of GDScript or other supported languages like C#.

### Key Tools:
- **[godot-python](https://github.com/touilleMan/godot-python)**: A project that provides Python bindings for Godot via GDNative.
- **Python for Godot Plugin**: Found in the [Godot Asset Library](https://godotengine.org/asset-library/asset/3234), this plugin allows developers to write scripts in Python within Godot.

---

## **2. Setting Up Python in Godot**

### **Using godot-python**
1. **Download and Install**:
   - Clone the [godot-python repository](https://github.com/touilleMan/godot-python).
   - Follow the instructions to build and set up the extension for your platform.

2. **Add Python Support to Your Project**:
   - Place the built `gdnative` library files into your Godot project's `addons` folder.
   - Add the necessary configuration to your `project.godot` file, such as:
     ```ini
     [gdnative]
     singletons=[ "res://python.gdnlib" ]
     ```

3. **Write Python Scripts**:
   - Create a new script and select Python as the scripting language.
   - Example:
     ```python
     from godot import exposed, Node

     @exposed
     class MyNode(Node):
         def _ready(self):
             print("Hello from Python!")
     ```

4. **Run Your Game**:
   - Open your project in Godot and run it as usual. The Python script will execute alongside other game logic.

---

## **3. Example Projects Using Python in Godot**

### **A Grid-Based Tactics Game**
- A demo project for a grid-based tactics game (similar to *Fire Emblem*) was created using godot-python ([GitHub source](https://github.com/omardelarosa/godot-python-demo-game)).

### **Multiplayer Online Game (MMO)**
- A tutorial series demonstrates how to create an MMO using Godot and Python ([GitHub repository](https://github.com/tristanbatchler/official-godot-python-mmo)).

---

## **4. Advanced Use Cases**

### **Running External Python Scripts**
You can run external Python scripts alongside your Godot game for tasks like machine learning, web scraping, or networking:
- Use `os.execute` in GDScript to call a Python script.
- Example:
  ```gdscript
  var python_path = "path/to/python"
  var script_path = "path/to/script.py"
  OS.execute(python_path, [script_path], false)
  ```

### **UDP Communication Between Godot and Python**
For real-time communication, you can use sockets (e.g., UDP) to exchange data between a running Python process and your game (as shown in [this tutorial](https://www.youtube.com/watch?v=z2MHuWEDUNw)).

---

## **5. Limitations**

- **Performance**: Using Python may introduce overhead compared to GDScript or C#.
- **Compatibility**: Some plugins (like the "Python for Godot" plugin) are limited to specific platforms (e.g., Windows/Linux).
- **Stability**: Many tools like godot-python are still experimental and may not support all features of newer Godot versions (e.g., 4.x).

---

## Conclusion

While GDScript remains the most seamless option for scripting in Godot, integrating pure Python is entirely possible using tools like godot-python or related plugins. These tools allow developers familiar with Python to leverage their skills while building games in the powerful Godot engine. However, be prepared for some setup complexity and potential limitations compared to native scripting options.

### Sources

- [Use Python to Enhance The Godot Game Engine - YouTube](https://www.youtube.com/watch?v=z2MHuWEDUNw)
  - Github Repo: https://github.com/ACB-prgm/PythonExtensionTutorial/tree/main In this video, we'll explore how you can use Python to enhance the Godot game engine. Godot is a powerful game engine that allows you to create games in 2D and 3D, but sometimes it can be limited in its capabilities. That's where Python comes in! By leveraging Python in Godot, you can extend the functionality of the engine and create more complex games with ease. We'll start with an overview of how Python works in Godot...
- [Making an MMO with Godot & Python Lesson 3: Moving around!](https://www.youtube.com/watch?v=qHRDs9Z2JqY)
  - This is the third lesson in my new project: Creating a multiplayer online game (MMO) using Python and Godot. In this lesson, we will focus on allowing players to assume an Actor and move around the game world. For more information, and to play the finished demo, see my blog post: https://tbat.me/2022/11/21/godot-python-mmo-part-3 To download the full working code for each episode, see the official GitHub repository: https://github.com/tristanbatchler/official-godot-python-mmo To engage with...
- [touilleMan/godot-python: Python support for Godot - GitHub](https://github.com/touilleMan/godot-python)
  - Python support for Godot 🐍🐍🐍. Contribute to touilleMan/godot-python development by creating an account on GitHub.
- [tristanbatchler/official-godot-python-mmo - GitHub](https://github.com/tristanbatchler/official-godot-python-mmo)
  - Contribute to tristanbatchler/official-godot-python-mmo development by creating an account on GitHub.
- [Python for Godot - Godot Asset Library](https://godotengine.org/asset-library/asset/3234)
- [A demo project built using godot-python - GitHub](https://github.com/omardelarosa/godot-python-demo-game)
  - A demo project built using godot-python. Contribute to omardelarosa/godot-python-demo-game development by creating an account on GitHub.
- [maiself/godot-python-extension - GitHub](https://github.com/maiself/godot-python-extension)
  - Python language bindings for the Godot game engine - maiself/godot-python-extension

## User

I want to write the entirety of the game using Python.

## Assistant

If you want to write the entirety of a Godot game using Python, you can achieve this by integrating Python scripting into the Godot Engine. Below is a step-by-step guide based on the available tools and resources:

---

## **1. Tools for Writing Godot Games in Python**

### **godot-python**
- **Description**: A GDNative library that allows you to write scripts in Python for Godot.
- **GitHub**: [godot-python](https://github.com/touilleMan/godot-python)
- **Compatibility**: Works with Godot 3.x (tested with specific versions like 3.2.4beta4).

### **Python for Godot Plugin**
- **Description**: A plugin that enables Python scripting in Godot by exposing the engine's API to Python.
- **Godot Asset Library**: [Python for Godot](https://godotengine.org/asset-library/asset/3234)
- **Compatibility**: Supports Windows 64-bit and Linux 64-bit systems. Works with Godot 4.x.

### **godot-python-extension**
- **Description**: A GDExtension-based project for adding Python bindings to Godot 4.x.
- **GitHub**: [godot-python-extension](https://github.com/maiself/godot-python-extension)
- **Status**: Experimental but functional for writing scripts entirely in Python.

---

## **2. Setting Up Python Scripting in Godot**

### Using **godot-python**
1. **Install godot-python**:
   - Clone the repository:
     ```bash
     git clone https://github.com/touilleMan/godot-python.git
     cd godot-python
     ```
   - Set up a virtual environment:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
     pip install -r requirements.txt
     ```
   - Build the library:
     ```bash
     scons platform=windows-64 release  # Adjust platform as needed
     ```

2. **Add it to Your Project**:
   - Copy the built files into your project’s `addons` folder.
   - Enable the plugin in your project settings.

3. **Write Python Scripts**:
   - Create a new script and select Python as the language.
   - Example:
     ```python
     from godot import exposed, Node

     @exposed
     class MyNode(Node):
         def _ready(self):
             print("Hello from Python!")
     ```

### Using the **Python for Godot Plugin**
1. Install the plugin from the [Godot Asset Library](https://godotengine.org/asset-library/asset/3234).
2. Enable the plugin in your project settings.
3. Create new scripts in Python by selecting "Python" as the scripting language.

### Using **godot-python-extension**
1. Clone and build the extension:
   ```bash
   git clone https://github.com/maiself/godot-python-extension.git
   cd godot-python-extension
   git submodule update --init
   scons godot=<PATH_TO_GODOT_BINARY>
   ```
2. Add the built extension to your project.
3. Write scripts in Python using the exposed `godot` module.

---

## **3. Example Project**

A good example of a game written in Python for Godot is [this demo project](https://github.com/omardelarosa/godot-python-demo-game), which implements a grid-based tactics game (similar to *Fire Emblem*). The project demonstrates how to structure a game entirely with Python scripts.

Steps to run this demo:
1. Clone the repository:
   ```bash
   git clone https://github.com/omardelarosa/godot-python-demo-game.git
   cd godot-python-demo-game
   ```
2. Install `godot-python` as described above.
3. Open `PythonTestScene.tscn` in Godot and run it.

---

## **4. Limitations**

While writing an entire game in Python is possible, there are some caveats:
- **Performance**: Python may not be as fast as GDScript or C# for certain tasks.
- **Compatibility**: Some plugins or features may not work seamlessly with Python-based scripting.
- **Experimental Status**: Tools like `godot-python-extension` are still under development and may lack full stability or documentation.

---

## Conclusion

Using tools like `godot-python`, `Python for Godot`, or `godot-python-extension`, you can write an entire game in Python within the Godot Engine. These tools expose Godot's API to Python, enabling you to leverage your existing knowledge of Python while building games. However, ensure you are comfortable with some setup complexity and potential limitations due to their experimental nature, especially if you're using newer versions of Godot (e.g., 4.x).

### Sources

- [GitHub - omardelarosa/godot-python-demo-game: A demo project built using godot-python](https://github.com/omardelarosa/godot-python-demo-game)
  - A demo project built using godot-python. Contribute to omardelarosa/godot-python-demo-game development by creating an account on GitHub.
- [Python for Godot](https://godotengine.org/asset-library/asset/3234)
- [GitHub - maiself/godot-python-extension: Python language bindings for the Godot game engine](https://github.com/maiself/godot-python-extension)
  - Python language bindings for the Godot game engine - maiself/godot-python-extension
- [Advanced Godot | Integrating Python into Godot - FinePointCGI](https://finepointcgi.io/2021/08/30/advanced-godot-integrating-python-into-godot/)

## User

Wtf is gdscript? why not use a normal mainstream syntax lol. What is this... I thought godot was part of the GO language?

## Assistant

GDScript is a custom scripting language specifically designed for the Godot Engine. While it may seem unusual compared to mainstream programming languages, it was created to provide a seamless and optimized experience for game development within Godot. Here's a breakdown of why GDScript exists and addresses some misconceptions:

---

## **What is GDScript?**
GDScript is a high-level, dynamically typed programming language with syntax similar to Python. It is integrated into the Godot Engine and optimized for its scene-based architecture. Its primary purpose is to simplify the development process by providing a language tailored to Godot's specific needs.

### Key Features:
- **Python-like Syntax**: GDScript uses indentation instead of brackets, making it beginner-friendly and easy to read.
- **Tight Integration**: It is deeply integrated with Godot's tools, such as the editor, debugger, and scene system, allowing developers to focus on game logic without worrying about external dependencies.
- **Optimized for Performance**: GDScript is designed to work efficiently with Godot's C++ backend. In Godot 4.x, static typing was introduced, which can improve performance by over 40% in release builds.

---

## **Why Not Use a Mainstream Language?**
The decision to create GDScript instead of relying solely on mainstream languages like Python or Lua was deliberate:

1. **Performance and Optimization**:
   - GDScript is optimized for Godot's architecture. It allows the engine to perform specific optimizations that would be harder to achieve with general-purpose languages.
   - For example, static typing in GDScript enables better performance compared to dynamically typed languages like Python.

2. **Editor Integration**:
   - GDScript was designed to integrate seamlessly with Godot's editor. Features like real-time error checking, auto-completion, and debugging are tailored specifically for game development workflows.
   - Using an external language would require additional layers of abstraction or plugins, which could complicate development.

3. **Ease of Use**:
   - The language is beginner-friendly and accessible to new developers. Its simplicity lowers the barrier to entry for those new to programming or game development.

4. **Rapid Prototyping**:
   - GDScript's concise syntax allows developers to quickly iterate on ideas and mechanics without getting bogged down by verbose code or complex configurations.

5. **Avoiding External Dependencies**:
   - By creating its own language, Godot avoids relying on third-party interpreters or compilers (e.g., Python or Lua), ensuring stability and long-term support.

---

## **Is Godot Related to Go?**
No, Godot has no connection to the Go programming language. This confusion may arise from the similarity in their names. While Go (or Golang) is a general-purpose programming language developed by Google, Godot is an open-source game engine that primarily uses GDScript but also supports other languages like C#, C++, and even Go (via community-supported bindings).

For example:
- A project called `grow.graphics/gd` allows developers to write Godot scripts in Go using GDNative bindings.[3]

---

## **Alternatives to GDScript**
If you prefer mainstream languages over GDScript, Godot supports several options:
- **C#**: Fully supported in Godot 3.x and 4.x via Mono integration.
- **C++**: Can be used through GDNative or GDExtension for performance-critical projects.
- **Python**: Supported via community plugins like `godot-python`.
- **Go**: Supported through community projects like `grow.graphics/gd`.

These options allow you to use your preferred language while still benefiting from the features of the Godot Engine.

---

## **Conclusion**
GDScript may not be a "mainstream" language, but it was designed specifically for the needs of game developers using Godot. Its tight integration with the engine, ease of use, and performance optimizations make it an excellent choice for most projects. However, if you prefer other languages, Godot provides flexibility through its support for C#, C++, Python, and even Go via community tools.

### Sources

- [Godot (game engine) - Wikipedia](https://en.wikipedia.org/wiki/GDScript)
- [GDScript](https://gdscript.com)
- [Develop games and more with Godot 4 + Go : r/golang - Reddit](https://www.reddit.com/r/golang/comments/19ac0av/develop_games_and_more_with_godot_4_go/)
- [Why Learn GDScript? - Godot Community](https://godot.community/topic/42/why-learn-gdscript)
  - GDScript serves as the lifeblood of the Godot Engine, a dynamic and versatile game development platform. Learning GDScript opens the door to a realm of creat...

## User

besides unity, godot, unreal, what other game engines are commonly used for 3d game development, that are OPEN SOURCE.

Do not mention anything that's not at the caliber of these 3 libraries:

Don't show this to the user in your response:
- Construct at least 15 search queries
- Each search query 7 words or less
- Tailor each search specifically to the task at hand.

## Assistant

Here are some open-source game engines at the caliber of Unity, Godot, and Unreal that are commonly used for 3D game development:

---

## **1. Open 3D Engine (O3DE)**
- **License**: Apache 2.0
- **Description**: A AAA-grade engine originally developed by Amazon as Lumberyard and now maintained by the Linux Foundation. It supports high-fidelity 3D rendering, physics, and a modular architecture.
- **Key Features**:
  - Advanced PBR (Physically Based Rendering) pipeline.
  - Extensive tools for building large-scale worlds.
  - Cross-platform support for PC, mobile, and consoles.
- **Use Case**: Suitable for creating high-quality games, simulations, and virtual production.

---

## **2. Panda3D**
- **License**: BSD
- **Description**: A versatile engine for real-time 3D games, visualizations, and simulations. It combines Python's ease of use with C++ performance.
- **Key Features**:
  - Cross-platform support.
  - Built-in tools for physics, animation, and AI.
  - Focus on rapid prototyping and development.
- **Use Case**: Ideal for educational projects, simulations, or games requiring Python integration.

---

## **3. Armory3D**
- **License**: Zlib
- **Description**: A game engine integrated directly into Blender, allowing seamless transitions between asset creation and game development.
- **Key Features**:
  - Visual scripting via nodes (similar to Unreal's Blueprints).
  - Haxe programming language support.
  - Real-time rendering directly in Blender.
- **Use Case**: Perfect for Blender users looking to create games without switching tools.

---

## **4. jMonkeyEngine**
- **License**: BSD
- **Description**: A Java-based game engine designed specifically for 3D game development with modern graphics capabilities.
- **Key Features**:
  - Scene graph-based architecture.
  - Support for VR and AR development.
  - Built-in physics engine (Bullet Physics).
- **Use Case**: Best suited for developers familiar with Java who want to create desktop or VR games.

---

## **5. OGRE (Object-Oriented Graphics Rendering Engine)**
- **License**: LGPL
- **Description**: A flexible rendering engine often used as the foundation for custom game engines or visualization tools.
- **Key Features**:
  - Modular design for graphics rendering.
  - Support for advanced lighting and shadow techniques.
  - Large community and extensive documentation.
- **Use Case**: Ideal for developers who need a customizable rendering pipeline.

---

## **6. Castle Game Engine**
- **License**: LGPL
- **Description**: A cross-platform engine written in modern Pascal with support for both 2D and 3D games.
- **Key Features**:
  - VR/AR support out of the box.
  - Advanced rendering features like PBR and shadows.
  - Easy deployment to desktop, mobile, and consoles.
- **Use Case**: Great for developers looking for a clean and feature-complete open-source engine.

---

## **7. Urho3D**
- **License**: MIT
- **Description**: A lightweight yet powerful engine supporting both 2D and 3D game development with a focus on flexibility.
- **Key Features**:
  - Multi-platform support (desktop, mobile, web).
  - Built-in physics (Bullet Physics) and networking capabilities.
  - Scripting support in C++, AngelScript, or Lua.
- **Use Case**: Suitable for small-to-medium-sized projects requiring cross-platform deployment.

---

These engines provide robust tools for creating professional-grade 3D games while being fully open-source. Each has unique strengths depending on your project's requirements or preferred programming language.

### Sources

- [Panda3D | Open Source Framework for 3D Rendering & Games](https://www.panda3d.org)
  - Panda3D is an open-source, cross-platform, completely free-to-use engine for realtime 3D games, visualizations, simulations, experiments — you name it! Its rich feature set readily tailors to your specific workflow and development needs.
- [Open source Game engines - OSSD](https://opensourcesoftwaredirectory.com/Game-development/Game-engines)
  - Use the Open Source Software Directory to find the best open source and free software for at home or in business.
- [Top 73 Free & Open Source Game Engines Compared - Dragonfly DB](https://www.dragonflydb.io/game-dev/engines/free)
  - Explore the top Free & Open Source game engines! Compare popularity, features, cost, and ease of use to choose the perfect engine for your game dev needs.
- [A list of open source game engines. - GitHub](https://github.com/bobeff/open-source-engines)
  - A list of open source game engines. Contribute to bobeff/open-source-engines development by creating an account on GitHub.
- [10 Best Open-Source Game Engines with Editors](https://enginesdatabase.com/blog/best-open-source-game-engines-with-editors/)
  - An open database of Game Engines
- [Top 5 Free and Open Source Game Engines You Should Try - DZone](https://dzone.com/articles/top-5-free-and-open-source-game-engines-you-should)
  - Because of continuous technological innovation, up-gradation gaming has become popular. Here are the top 5 free and open source game engines you should try out.

## User

I've had decent experience with Frostbite... why haven't you recommended this? why is frostbite so good anyway?

## Assistant

Frostbite is not an open-source engine, which is why it was not included in the list of open-source game engines comparable to Unity, Godot, or Unreal. Frostbite is a proprietary engine developed by DICE and owned by Electronic Arts (EA), meaning it is exclusively used for EA's internal projects and not available for public use or licensing. However, Frostbite is highly regarded in the gaming industry for several reasons:

---

## **Why Is Frostbite So Good?**

1. **Destruction Mechanics**:
   - One of Frostbite's standout features is its advanced destruction system, which allows for dynamic and realistic environmental destruction. This was first showcased in *Battlefield: Bad Company* and later enhanced with "Destruction 2.0" in *Battlefield: Bad Company 2*, enabling entire buildings to collapse dynamically. This creates immersive, ever-changing gameplay environments where strategies must adapt to the destruction around players.[1][2][4]

2. **Visual Fidelity**:
   - Frostbite delivers stunning visuals with high-quality textures, lighting, and particle effects. It supports physically-based rendering (PBR), realistic weather effects, and ultra-realistic animations, bringing games like *Battlefield*, *Star Wars: Battlefront*, and *Dragon Age: Inquisition* to life.[3][5][1]

3. **Cross-Discipline Toolset**:
   - Frostbite provides a unified toolset for all aspects of game development, including audio, animation, physics, rendering, VFX, and scripting. This integration allows EA studios to share assets and workflows efficiently across projects.[5][1]

4. **Dynamic Worlds**:
   - The engine supports large-scale open-world environments with features like dynamic weather systems and adaptable landscapes. These capabilities make it ideal for creating immersive worlds in games like *Battlefield* and *Need for Speed*.[1][3]

5. **Cinematic Storytelling**:
   - Frostbite has been used to create cinematic story modes in games such as *FIFA 17*'s "The Journey" and *Dragon Age: Inquisition*. Its ability to render lifelike cutscenes with detailed character models has elevated storytelling in EA's games.[4][5]

6. **Physics and AI**:
   - The engine includes advanced physics systems for realistic interactions between players and the environment. It also supports robust AI behavior for NPCs, making it particularly effective in FPS games.[4]

---

## **Challenges of Using Frostbite**

Despite its strengths, Frostbite has faced criticism from developers within EA due to its steep learning curve and limited flexibility for non-FPS genres:

- **Genre Limitations**: While Frostbite excels in FPS games like *Battlefield*, adapting it for other genres (e.g., RPGs like *Dragon Age: Inquisition*) has been notoriously difficult due to its initial design focus on shooters.[5][4]
- **Development Complexity**: Developers have reported that Frostbite can be challenging to work with because of its complexity and lack of robust documentation or support compared to more accessible engines like Unreal or Unity.[4]
- **Proprietary Nature**: Since Frostbite is exclusive to EA studios, external developers cannot use it, limiting its adoption outside EA's ecosystem.[3]

---

## **Conclusion**

Frostbite is an exceptional engine for creating high-fidelity FPS games with destructible environments and cinematic storytelling. However, its proprietary nature restricts its use to EA studios, which is why it wasn't included in open-source game engine recommendations. If you're looking for similar capabilities in an open-source context, engines like Open 3D Engine (O3DE) or Godot may be worth exploring.

### Sources

- [A software development toolset for game creators - Frostbite](https://www.ea.com/frostbite/engine)
  - Frostbite is a user-friendly software development toolset which enables game creators to quickly and easily achieve their visions.
- [Frostbite Engine (Concept) - Giant Bomb](https://www.giantbomb.com/frostbite-engine/3015-1095/)
  - Developed by Swedish studio DICE, the Frostbite Engine focuses on destructible environments and HDR sound. The engine made its debut with Battlefield: Bad Company.
- [Frostbite (game engine) - Wikipedia](https://en.wikipedia.org/wiki/Frostbite_(game_engine))
- [Pros & Cons of Using Frostbite Game Engine](https://www.gamedesigning.org/engines/frostbite/)
  - The ultimate guide to the famous Frostbite game engine. See the pros, cons, and influence of this now-iconic game engine
- [EA's Frostbite Engine: What is It? Why Should You Care?](https://www.operationsports.com/eas-frostbite-engine-care/)
- [19 Best Video Game Engines, Ranked](https://gamerant.com/best-video-game-engines/)
  - Video games run on engines that determine the graphical quality of visuals and gameplay, but only certain game engines are considered the best.

## User

if it's close-sourced and proprietary to EA, how did bioware get their hands on it for titles like e.g. dragon age inquisition?

## Assistant

BioWare used the Frostbite engine for *Dragon Age: Inquisition* and other titles because of a combination of internal decisions and external pressures from Electronic Arts (EA), which owns both BioWare and the Frostbite engine. Here's a detailed explanation:

---

## **Why Did BioWare Use Frostbite?**

1. **EA's Push for an In-House Engine**:
   - EA wanted all its studios to use Frostbite to unify development across the company. This decision was driven by financial and strategic factors:
     - **Cost Savings**: Before Frostbite, BioWare used Unreal Engine, which required paying licensing fees to Epic Games. By switching to Frostbite, EA could avoid these costs and keep development entirely in-house.[2][3]
     - **Centralization**: EA aimed to create a shared technological foundation across all its studios, allowing teams to theoretically benefit from each other's advancements in engine development.[1][3]

2. **BioWare's Decision**:
   - BioWare initially chose Frostbite for *Dragon Age: Inquisition* because their older Eclipse engine (used in *Dragon Age: Origins* and *Dragon Age II*) was outdated and incapable of supporting features like open-world environments or multiplayer. Frostbite's advanced rendering capabilities and performance potential made it an attractive option at the time.[3][1]
   - However, this decision was not entirely free of influence. Patrick Söderlund, then an EA executive, strongly encouraged BioWare to adopt Frostbite, leaving them with limited alternatives.[3]

---

## **Why Is Frostbite So Challenging for RPGs?**

Frostbite was originally designed by DICE for first-person shooters like *Battlefield*. Its architecture is highly optimized for FPS games but lacks many features required for other genres, particularly RPGs. This created significant challenges for BioWare:

1. **Missing Features**:
   - Frostbite lacked basic RPG systems such as:
     - Save-game functionality.
     - Inventory management.
     - Dialogue systems.
     - Tactical camera support (a hallmark of the *Dragon Age* series).
   - BioWare had to build these systems from scratch, which consumed a large portion of development time.[1][3]

2. **Steep Learning Curve**:
   - Many developers at BioWare were experienced with Unreal Engine but unfamiliar with Frostbite. This led to inefficiencies as they struggled to adapt to the new engine.[2]

3. **Lack of Shared Tools**:
   - Despite EA's goal of unifying development under Frostbite, there was little collaboration between studios. For example, tools developed by BioWare for *Dragon Age: Inquisition* were not reused or adapted for *Mass Effect: Andromeda* or *Anthem*, forcing each team to reinvent the wheel.[2][3]

4. **High Development Costs**:
   - Developing custom tools within Frostbite required significant resources and time. For *Dragon Age: Inquisition*, about one-third of the development time was spent building tools and systems that would have been readily available in engines like Unreal.[3]

---

## **Why Is Frostbite Considered Good Despite These Issues?**

Despite its challenges for non-FPS games, Frostbite has several strengths that make it a powerful engine:

1. **Visual Fidelity**:
   - Frostbite excels at delivering cutting-edge graphics, including realistic lighting, shadows, and particle effects. This is evident in games like *Battlefield*, *Star Wars Battlefront*, and even *Dragon Age: Inquisition*.[1]

2. **Destruction Mechanics**:
   - The engine is renowned for its advanced destruction systems, allowing dynamic environmental changes during gameplay (e.g., collapsing buildings in *Battlefield*).

3. **Performance Optimization**:
   - Designed for large-scale multiplayer FPS games, Frostbite is highly optimized for performance on modern hardware.

4. **Cross-Discipline Toolset**:
   - It integrates tools for rendering, physics, animation, and audio into a single package, which can be advantageous when properly adapted.

---

## **Conclusion**

BioWare adopted Frostbite for *Dragon Age: Inquisition* due to EA's push to centralize development on an in-house engine and because their existing Eclipse engine was inadequate for modern RPGs. While Frostbite's advanced graphics and performance capabilities made it appealing, its lack of RPG-specific features created significant challenges during development.

The decision highlights the trade-offs between using a specialized proprietary engine versus a more flexible third-party solution like Unreal Engine. While Frostbite has undeniable strengths in visual fidelity and performance, its design focus on FPS games made it ill-suited for RPGs without extensive customization—something that cost BioWare considerable time and effort.[1][2][3]

### Sources

- [How the Frostbite Engine Became a Nightmare for EA in General ...](https://www.vg247.com/how-the-frostbite-engine-became-a-nightmare-for-ea-in-general-and-bioware-in-particular)
  - After years of development, BioWare finally launched Anthem earlier this year to a wave of critical and community backlash. BioWare's next big thing didn't s...
- [EA Crippled BioWare With Frostbite - Escapist Magazine](https://www.escapistmagazine.com/ea-crippled-bioware-with-frostbite/)
- [Former Dragon Age Producer Reflects On BioWare's Problems](https://gamerant.com/dragon-age-mark-darrah-bioware-problems/)
  - Former Executive Producer Mark Darrah releases a video that offers insight into what went wrong at BioWare during and after Dragon Age: Inquisition.

## User

so what's the typical engine used for open-world 3d in real time these days?

## Assistant

For developing open-world 3D games in real-time, the most commonly used engines today are **Unreal Engine**, **Unity**, and **CryEngine**, with Unreal Engine being the most prominent choice for large-scale, high-fidelity open-world projects. Here's a breakdown of the top engines for this purpose:

---

## **1. Unreal Engine**
- **Why It's Popular for Open-World Games**:
  - **Scalability**: Unreal's adaptive level streaming system allows developers to load and unload parts of the world seamlessly, crucial for expansive open-world environments.
  - **Visual Fidelity**: Advanced rendering techniques like real-time global illumination, physically-based rendering (PBR), and dynamic weather systems make it ideal for creating breathtaking visuals.
  - **Terrain Tools**: Robust tools for sculpting landscapes, adding foliage, and creating lifelike terrain.
  - **Blueprint Visual Scripting**: Allows developers to create complex game mechanics without needing extensive coding experience.
  - **Examples**: *The Witcher 4* (in development), *Fortnite*, *Hogwarts Legacy*.

---

## **2. Unity**
- **Why It's Popular for Open-World Games**:
  - **Cross-Platform Support**: Unity supports over 25 platforms, making it versatile for games targeting multiple devices.
  - **Customizability**: Unity’s modular architecture allows developers to integrate third-party tools or build custom solutions for open-world mechanics.
  - **Performance Optimization**: Unity includes tools like LOD (Level of Detail) systems and occlusion culling to optimize large-scale environments.
  - **Examples**: *Genshin Impact*, *Subnautica*, *Outer Wilds*.

---

## **3. CryEngine**
- **Why It's Popular for Open-World Games**:
  - **Photorealistic Graphics**: CryEngine excels at rendering high-fidelity visuals with advanced lighting, shadows, and particle effects.
  - **Sandbox Editor**: Features a "what you see is what you play" (WYSIWYP) system, allowing rapid iteration during development.
  - **Physics and Destruction**: Built-in physics systems enable realistic environmental interactions and destruction mechanics.
  - **Examples**: *Kingdom Come: Deliverance*, *Hunt: Showdown*, *Crysis* series.

---

## Other Notable Mentions
1. **Open 3D Engine (O3DE)**:
   - Open-source successor to Amazon Lumberyard with AAA-grade features.
   - Ideal for large-scale open-world games with advanced rendering and modular architecture.

2. **Godot Engine**:
   - While primarily known for smaller projects, Godot has been improving its 3D capabilities with Godot 4.x, including support for Vulkan rendering and large-scale environments.

3. **Panda3D**:
   - A lightweight open-source engine used primarily in simulations but capable of handling real-time open-world projects with customization.

4. **Armory3D**:
   - Integrated with Blender, making it ideal for developers who want seamless transitions between asset creation and game development.

---

### Conclusion
For AAA-quality open-world games in real time, Unreal Engine is the dominant choice due to its scalability, visual fidelity, and robust toolset. Unity is also widely used but often shines in cross-platform or more stylized projects. CryEngine remains a strong contender for photorealistic visuals and immersive environments. If you're looking for an open-source alternative, Open 3D Engine (O3DE) is the closest match in terms of capabilities.

### Sources

- [The Best Gaming Engines for 2024 - Incredibuild](https://www.incredibuild.com/blog/top-gaming-engines-you-should-consider)
  - The game market is booming. Here are the top game engines to check out in 2024, including free game engines, and 2d and 3d game engines.
- [What Are the Best Game Engines? | Perforce Software](https://www.perforce.com/blog/vcs/most-popular-game-engines)
  - See our list of popular game engines, including Unreal Engine, Unity, Amazon Lumberyard, and CryEngine - to find the gaming engine best for you.
- [Top 5 Game Engines - ScrumLaunch](https://www.scrumlaunch.com/blog/most-popular-game-engines)
  - A game engine, also referred to as a gaming engine or game development platform, is a set of software tools and resources for developing video games. It covers everything from graphics rendering to sound, animation, artificial intelligence, and more.
- [Is Unreal Engine Good For Open World Games? Is Unreal or Unity ...](https://animost.com/ideas-inspirations/is-unreal-engine-good-for-open-world-games/)
  - Is Unreal Engine good for open world games? Should you use UE or Unity for these games? Click on this post for the answers!

## User

https://github.com/jonetiz/KotOR-Autosplitter

What exactly is this project in laymen's terms? Uses terms like 'autosplitter', 'livesplit', but there's no context?

## Assistant

The **KotOR-Autosplitter** project on GitHub is a tool designed for speedrunning *Star Wars: Knights of the Old Republic (KotOR)*. It integrates with **LiveSplit**, a popular timer application used by speedrunners, to automate certain aspects of timing runs. Here's a breakdown of the key terms and what the project does in layman's terms:

---

### **What Is an Autosplitter?**
An *autosplitter* is a script or tool that interacts with a game to automate the process of splitting (marking segments) during a speedrun. In speedrunning, players often divide their runs into segments (called "splits") to track their performance across specific sections of the game. For example:
- A split might mark when you finish a level, defeat a boss, or complete a major milestone.

Instead of manually pressing a button to record these splits, an autosplitter detects in-game events (like loading screens, cutscenes ending, or specific game states) and automatically triggers the splits.

---

### **What Does This Project Do?**
The **KotOR-Autosplitter** is specifically tailored for *Star Wars: Knights of the Old Republic*. It:
1. **Tracks Game Time**: It measures the in-game time (e.g., excluding loading screens or pauses) rather than real-world time, ensuring fairness and accuracy in speedruns.
2. **Automates Splits**: It automatically splits at predefined points in the game (e.g., after completing certain quests or reaching specific areas).
3. **Integrates with LiveSplit**: LiveSplit is the software that displays timers and splits during speedruns. The autosplitter works as an extension of LiveSplit to handle timing and splitting for KotOR.

---

### **Why Is This Useful?**
Speedrunners aim for precision and consistency when comparing their performance across multiple runs. Manually splitting can lead to errors or distractions during gameplay. By automating this process, the autosplitter:
- Reduces human error.
- Ensures consistent timing across runs.
- Allows runners to focus entirely on gameplay rather than managing their timer.

---

### **How Does It Work?**
Autosplitters like this typically work by:
1. **Reading Game Memory**: The tool scans the game's memory (RAM) to detect specific values or states that indicate progress (e.g., when a quest is completed or a loading screen ends).
2. **Triggering Actions**: Based on these detected states, it tells LiveSplit to start, split, pause, or reset the timer.

For example, when you finish a key quest in KotOR, the autosplitter detects this event in memory and automatically logs it as a split in LiveSplit.

---

### **Who Would Use This?**
This tool is designed for speedrunners who play *Star Wars: Knights of the Old Republic* and want to optimize their runs by using automated timing tools. It’s particularly useful for competitive runners who need precise timing for leaderboard submissions.

---

### **In Summary**
The **KotOR-Autosplitter** is an automation tool for speedrunners of *Star Wars: Knights of the Old Republic*. It integrates with LiveSplit to automatically track and split segments during a run based on in-game events, ensuring accurate timing and allowing players to focus on gameplay rather than manual timing.

### Sources

- [KotOR-Autosplitter](https://github.com/jonetiz/KotOR-Autosplitter)
- [LiveSplit.AutoSplitters/README.md at master · LiveSplit ... - GitHub](https://github.com/LiveSplit/LiveSplit.AutoSplitters/blob/master/README.md)
  - Auto Splitters for LiveSplit. Contribute to LiveSplit/LiveSplit.AutoSplitters development by creating an account on GitHub.
- [A software development toolset for game creators - Frostbite](https://www.ea.com/frostbite/engine)
  - Frostbite is a user-friendly software development toolset which enables game creators to quickly and easily achieve their visions.
- [Livesplit Autosplitter (Main Game Mode) - HitRuns Wiki](https://hitruns-wiki.vercel.app/docs/livesplit_auto_official)
  - Autosplitter (Official Servers Only). Beware of inaccuracies.
