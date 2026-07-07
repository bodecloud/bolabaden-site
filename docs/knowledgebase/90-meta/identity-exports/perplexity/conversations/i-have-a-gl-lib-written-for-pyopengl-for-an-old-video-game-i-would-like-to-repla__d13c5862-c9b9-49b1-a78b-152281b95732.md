---
source_url: "https://www.perplexity.ai/search/508510e4-c7dd-45de-8cad-5a227f5f14ea"
thread_uuid: "d13c5862-c9b9-49b1-a78b-152281b95732"
slug: "508510e4-c7dd-45de-8cad-5a227f5f14ea"
title: "I have a gl lib written for PyOpenGL for an old video game. I would like to replace my implementation with something more mainstream and standard. Please find high level OpenGL libraries for Python that will help me render models, textures, walkmeshes, etc. I have briefly heard of panda3d and vispy and I would like to know if they are the best available options or if there is something better. I am intending to create a 3d level editor."
extracted_at: "2026-06-29T16:31:20.569Z"
matched_keywords: []
export_suite: "identity"
entry_count: 8
provenance: perplexity-rest-api
---

# I have a gl lib written for PyOpenGL for an old video game. I would like to replace my implementation with something more mainstream and standard. Please find high level OpenGL libraries for Python that will help me render models, textures, walkmeshes, etc. I have briefly heard of panda3d and vispy and I would like to know if they are the best available options or if there is something better. I am intending to create a 3d level editor.

Source: [Perplexity thread](https://www.perplexity.ai/search/508510e4-c7dd-45de-8cad-5a227f5f14ea)

## User

I have a gl lib written for PyOpenGL for an old video game. I would like to replace my implementation with something more mainstream and standard. Please find high level OpenGL libraries for Python that will help me render models, textures, walkmeshes, etc. I have briefly heard of panda3d and vispy and I would like to know if they are the best available options or if there is something better. I am intending to create a 3d level editor.

## Assistant

Based on your requirements for a high-level OpenGL library in Python to create a 3D level editor, there are several good options available. Here's an overview of some of the best choices:

## Panda3D

Panda3D is indeed a strong contender for your needs. It's an open-source engine for realtime 3D games, visualizations, and simulations. Some key features include:[1]

- Written in Python and C++
- Supports 3D model rendering and texturing
- Includes tools for scene graph management
- Provides collision detection and physics simulation
- Offers a built-in shader generator

Panda3D would be well-suited for creating a 3D level editor, as it provides many of the necessary tools out of the box.

## Pyglet

Pyglet is another excellent choice for 3D graphics in Python. It's a cross-platform windowing and multimedia library that provides:[2]

- Native support for OpenGL
- Easy-to-use Python API
- No external dependencies
- Support for loading various image and audio formats

While not as feature-rich as Panda3D for 3D game development, Pyglet offers more flexibility and control over the OpenGL pipeline.

## PyOpenGL with Arcade

For a more direct replacement of your existing PyOpenGL code, you might consider using PyOpenGL in conjunction with the Arcade library. Arcade is designed for 2D game development but can be extended to 3D using OpenGL. This combination would allow you to:[1]

- Leverage your existing OpenGL knowledge
- Use Arcade's high-level functions for window management and input handling
- Create custom 3D rendering pipelines

## VisPy

VisPy, which you mentioned, is primarily focused on scientific visualization. While it's powerful for data visualization, it may not be the best fit for a game-oriented 3D level editor. However, if your editor involves heavy data visualization components, VisPy could be a valuable addition to your toolkit.[4]

## Recommendation

For creating a 3D level editor, **Panda3D** is likely your best option. It provides a comprehensive set of tools for 3D rendering, model manipulation, and scene management, which are crucial for a level editor. Its Python API makes it accessible, while its C++ core ensures good performance.

If you prefer more low-level control and want to leverage your existing OpenGL knowledge, the combination of **PyOpenGL and Arcade** could be a good alternative. This would allow you to create a custom solution tailored to your specific needs.

Remember that the choice ultimately depends on your specific requirements, the complexity of your project, and your familiarity with the different libraries. It might be worth prototyping small projects with each to see which fits your workflow best.

### Sources

- [9 Best Python Game Development Libraries/Frameworks [2024]](https://geekflare.com/python-game-development-libraries-frameworks/)
  - Arcade is a Python game development library to design 2D video games that use OpenGL. It’s an open-source library with the following features: Support for common platforms Library of tutorials and examples Extensive support: from primitives and sprites to more complex graphics In addition, Arcade works well with PyInstaller: With PyInstaller, you can bundle the game as an executable. So the users can run your application directly—without having to install Python and download the source code...
- [PythonGameLibraries - Python Wiki](https://wiki.python.org/moin/PythonGameLibraries)
  - Pygame (http://www.pygame.org/) is a set of Python modules designed for writing games. It is written on top of the excellent SDL library. This allows you to create fully featured games and multimedia programs in the python language. It is the most popular, and portable game library for python, with over 1000 free and open source projects that use pygame to look at. The free books "Program Arcade Games with Python and Pygame", "Making Games with Python & Pygame" cover the basics of the Pygame...
- [Top 10 Python Frameworks for Game Development - Extern Labs](https://externlabs.com/blogs/top-10-python-frameworks-for-game-development/)
  - PyGame is additionally a Python’ open – deliver’ library that is often used for developing picks and code program application system utility computer code program application comprehensive of video games that require to evolve the usage of a completely clever SDL library. This library is superior to C language, Python language, Native and OpenGL. Pygame permits the character to boom full-featured video games and transmission machine packages as well. This library is especially moveable and...
- [Mastering High-Performance 2D/3D Data Visualization in Python](https://www.geeksforgeeks.org/introduction-to-vispy/)
  - Introduction to VisPy: Mastering High-Performance 2D/3D Data Visualization in Python Last Updated : 19 Jul, 2024 Summarize Comments Improve Suggest changes Like Article Like Save Share Report Follow VisPy is a high-performance interactive 2D/3D data visualization library in Python. It offers an interface for high-quality visualization and manipulation of large data sets in 2D/3D. Leaning on the power of the GPU, it provides both efficient and interactive visualizations.... VisPy leverages the...
- [Python & OpenGL for Scientific Visualization - LaBRI](https://www.labri.fr/perso/nrougier/python-opengl/)
  - We'll use up-to-date versions (at the date of writing, i.e. August, 2017) of the different packages: PackagesVersion Python3.6.0 Numpy1.12.0 Scipy0.18.1 Cython0.25.2 Triangle20170106 Glumpy1.0.6 If you want to contribute to this book, you can:... VersionConstantsFunctionsVersionConstantsFunctions GL 1.00306GL 3.2800316 GL 1.1528336GL 3.3816344 GL 1.2569340GL 4.0894390 GL 1.3665386GL 4.1929478 GL 1.4713433GL 4.21041490 GL 1.5763452GL 4.31302534 GL 2.0847545GL 4.41321543 GL 2.1870551GL...

## User

Thanks. PyKotorGL is intended to be a highly modular library for any implementation of OpenGL. The current main use for it right now (note: not a dependency), is a Qt6 Toolset level editor named the Holocron Toolset. Is Panda 3D still a good choice for integrating with Qt? I have heard that Qt3d is discontinued and i'm not sure what replaced it. And given that this does NOT have a dependency on qt nor can it have one, what do you further recommend?

## Assistant

Given the additional context you've provided about PyKotorGL and its intended use with Qt6, let's reassess the recommendations:

## Panda3D and Qt Integration

Panda3D can still be a good choice for integration with Qt, but it requires some additional work:

- Panda3D doesn't natively integrate with Qt, but it's possible to embed Panda3D rendering into a Qt window.[1]
- You would need to create a custom integration layer between Panda3D and Qt6.

## Alternatives for Qt and OpenGL Integration

Since Qt3D is discontinued and you're looking for a modular OpenGL library that can work with Qt6, consider these options:

1. **PyOpenGL with Qt6**:
   - Use PyOpenGL directly with Qt6's QOpenGLWidget.
   - This approach gives you full control over the OpenGL pipeline and integrates seamlessly with Qt6.

2. **ModernGL**:
   - A modern, Pythonic wrapper for OpenGL that can be used with Qt6.
   - It provides a more user-friendly API compared to raw PyOpenGL.

3. **pygfx**:
   - A relatively new library for 3D visualization in Python.
   - It's designed to be modular and can work with various backends, including Qt.

## Recommendation for PyKotorGL

Given that PyKotorGL is intended to be a highly modular library for any OpenGL implementation, and considering its potential use with Qt6 without direct dependencies, here are my recommendations:

1. **Stick with PyOpenGL as the base**:
   - PyOpenGL provides low-level access to OpenGL functions, which aligns with your goal of modularity and flexibility.
   - It can be easily integrated with Qt6 using QOpenGLWidget.

2. **Consider incorporating ModernGL**:
   - ModernGL can serve as an abstraction layer over PyOpenGL, providing a more Pythonic API.
   - It's still modular and can be optionally used by developers working with PyKotorGL.

3. **Implement a plugin system**:
   - Design PyKotorGL with a plugin architecture that allows easy integration with different GUI frameworks, including Qt6.
   - This approach maintains modularity and doesn't create direct dependencies on any specific GUI toolkit.

4. **Provide example integrations**:
   - Create example implementations showing how to use PyKotorGL with different frameworks, including Qt6, Panda3D, and others.
   - This helps users understand how to integrate PyKotorGL into their preferred environment.

5. **Focus on core OpenGL functionality**:
   - Concentrate on providing robust OpenGL rendering capabilities, leaving GUI integration to the end-users or separate modules.

By following these recommendations, you can create a flexible and modular OpenGL library that can be easily integrated with Qt6 for the Holocron Toolset, while also remaining versatile enough for use in other contexts and with other GUI frameworks.

### Sources

- [Best Scientific 3D Visualization Libraries for Python - Epsilon Forge](https://www.epsilonforge.com/post/best-3d-scientific-visualization/)
  - Scientific visualization of large 3D datasets is a complex task for which specialized software libraries have been developed for quite some time. Unlike other areas of CAD or CAE, 3D visualization software has mostly been open-source since the beginning. In particular, all libraries reviewed in this post offer permissive licenses which allow commercial use. Importantly, there are two kinds of tools we can rely on. On one hand, we have large... ## Paraview (Python and standalone) Perhaps the...
- [Seeking library recommendation for 3D visualization of crystal ...](https://www.reddit.com/r/Python/comments/ynr6xk/seeking_library_recommendation_for_3d/)
  - Easiest to get up and running might be mayavi. It's not perfect, but it is 3D and reasonably interactive (unlike matplotlib's 3D plots, for example). Yeah....vtk (what mayavi and paraview is built on) scales infinitely better than matplotlib's 3D plotting. It doesn't choke on millions of elements, supports GPU acceleration, supports distributed rendering, etc. It's a beyond solid tool. Kitware wrote all of those tools (outside of Mayavi, but they wrote the base for it) and they also wrote...
- [PythonGameLibraries](https://wiki.python.org/moin/PythonGameLibraries)
  - *Humerus*, a game skeleton based on Albow. Humerus provides a framework for managing and loading levels, starting and resuming play, saving and restoring game state, and implementing an in-game level editor. A customisable main menu screen ties all these activities together. http://ocemp.sourceforge.net/gui.html OcempGUI is an abbreviation for Ocean Empire GUI. and denotes a toolkit, which contains a set of various user interface elements based on and for pygame....
- [9 Best Python Game Development Libraries/Frameworks [2024] | Geekflare](https://geekflare.com/python-game-development-libraries-frameworks/)
  - PANDA3D is a game engine that offers both flexibility and ease of use. If you are a Python programmer, you can install it using pip. Learn how to install pip on various OS. However, PANDA3D natively supports both C++ and Python. The key features of PANDA3D include the following: Open-source engine with portability and cross-platform support Built-in profiling that can help in the optimization of large applications Rapid development with minimal initialization Extensible through third-party...

## User

I am looking to throw most of my code in the scrapper due to poor design choices. My implementation is slow. The models and textures are in proprietary format. What I would LIKE to be able to do is install some pip package that does all the opengl stuff, and provides a context that I can snipe with e.g. QOpenGLWidget. That pip package I would ideally just like to pass a function to tell it how to load my textures into a common format, and my models, and not worry about learning complex low level opengl

## Assistant

Based on your requirements and the desire for a high-level, easy-to-use OpenGL solution that can integrate with Qt, I have a few recommendations:

## ModernGL

ModernGL might be the best fit for your needs. It's a modern, Pythonic wrapper for OpenGL that simplifies many low-level operations:

- Easy to install: `pip install moderngl`
- Provides high-level abstractions for OpenGL concepts
- Can be integrated with Qt using QOpenGLWidget
- Allows custom loading of textures and models

Here's how you might use ModernGL with Qt:

```python
from PyQt6.QtWidgets import QOpenGLWidget
import moderngl

class MyGLWidget(QOpenGLWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.ctx = None

    def initializeGL(self):
        self.ctx = moderngl.create_context()
        # Set up your scene, load models and textures here

    def paintGL(self):
        self.ctx.clear(0.0, 0.0, 0.0, 1.0)
        # Render your scene here

    def resizeGL(self, width, height):
        self.ctx.viewport = (0, 0, width, height)
```

ModernGL allows you to focus on the high-level aspects of rendering without dealing with low-level OpenGL calls.[2]

## PyVisPy

VisPy is another option that provides high-level OpenGL functionality:

- Install with: `pip install vispy`
- Offers scene graph management
- Can be integrated with Qt
- Provides abstractions for common 3D operations

While VisPy is primarily focused on scientific visualization, it can be adapted for game development tasks.[5]

## Recommendation

Given your requirements, I recommend using **ModernGL** for the following reasons:

1. It provides a high-level, Pythonic API that abstracts away many low-level OpenGL details.
2. It can be easily integrated with Qt using QOpenGLWidget.[1][3]
3. It allows you to focus on loading your proprietary models and textures without worrying about OpenGL specifics.
4. It's lightweight and doesn't impose a specific scene graph or game engine structure.

To use ModernGL with your proprietary formats:

1. Create functions to load your models and textures into formats ModernGL can use (typically numpy arrays for vertex data and PIL Images for textures).
2. Use these functions within your QOpenGLWidget subclass to load assets.
3. Utilize ModernGL's high-level functions to render your scenes.

This approach allows you to leverage the simplicity of ModernGL while still maintaining control over your custom asset loading process. It also integrates well with Qt, which seems to be a requirement for your project.

Remember to profile your new implementation to ensure it meets your performance requirements. If you encounter specific bottlenecks, you can optimize those areas without having to rewrite the entire rendering system.

### Sources

- [Can QOpenGLWidget be integrated with third party OpenGL library?](https://stackoverflow.com/questions/29308539/can-qopenglwidget-be-integrated-with-third-party-opengl-library)
  - Legacy QGLWidget could be integrated with rendering libraries (like SFML) by passing winId() result to the rendering library. But I can't make QOpenGLWidget work that way. After making it MainWindow's central widget I get series of warnings like QOpenGLWidget cannot be used as a native child widget. Consider setting Qt::AA_DontCreateNativeWidgetAncestors and Siblings.. Furthermore, the documentation says "QGLWidget on the other hand uses a native window and surface. (...) QOpenGLWidget avoids...
- [First Steps with python + Qt + OpenGL | Nick Rotella](https://nrotella.github.io/journal/first-steps-python-qt-opengl.html)
  - There are also a number of different libraries for creating 3D graphics in python, however the most common cross-platform solution is OpenGL - specifically using the PyOpenGL wrapper. You should be able to install this easily with pip install pyopengl on linux or again using pip install on the wheel downloaded here. On Ubuntu 16.04, I found that instead of ‘'’pip’’’ I had to use apt-get install python-qt4-gl PyQt uses the same system install of PyOpenGL in its QtOpenGL module to provide a...
- [QOpenGLWidget — Qt for Python - Qt Documentation](https://doc.qt.io/qtforpython-5/PySide2/QtWidgets/QOpenGLWidget.html)
  - provides functionality for displaying OpenGL graphics integrated into a Qt application. It is very simple to use: Make your class inherit from it and use the subclass like any other , except that you have the choice between using QPainterand standard OpenGL rendering commands. provides three convenient virtual functions that you can reimplement in your subclass to perform the typical OpenGL tasks: Renders the OpenGL scene. Gets called whenever the widget needs to be updated. Sets up the OpenGL...
- [QOpenGLWidget - Synopsis - Qt for Python](https://doc.qt.io/qtforpython-6/PySide6/QtOpenGLWidgets/QOpenGLWidget.html)
  - Warning This section contains snippets that were automatically translated from C++ to Python and may contain errors. provides functionality for displaying OpenGL graphics integrated into a Qt application. It is very simple to use: Make your class inherit from it and use the subclass like any other QWidget, except that you have the choice between using QPainter and standard OpenGL rendering commands. provides three convenient virtual functions that you can reimplement in your subclass to...
- [Python & OpenGL for Scientific Visualization - LaBRI](https://www.labri.fr/perso/nrougier/python-opengl/)
  - But what is the structure of a vertex ? OpenGL does not assume anything about your vertex structure and you're free to use as many information you may need for each vertex. The only condition is that all vertices from a buffer have the same structure (possibly with different content). This again is a big difference with the fixed pipeline where OpenGL was doing a lot of complex rendering stuff for you (projections, lighting, normals, etc.) with an implicit fixed vertex structure. The good news...

## User

Does moderngl integrate with e.g. Panda3d, qt3d, pyglm, numpy?

## Assistant

Based on the information provided in the search results and my knowledge of ModernGL, here's how it integrates with the mentioned libraries:

1. Qt integration:
ModernGL can be integrated with Qt, including Qt6. While Qt3D is discontinued, you can use ModernGL with QOpenGLWidget. This allows you to embed ModernGL rendering into a Qt application.[1]

2. Numpy integration:
ModernGL has excellent support for Numpy. You can easily create buffers from Numpy arrays. For example:[2][5]

```python
ctx.buffer(np.array([0.0, 0.0, 1.0, 1.0], dtype="f4"))
```

3. Panda3D integration:
There's no direct mention of Panda3D integration in the search results. However, ModernGL is designed to be flexible and can be integrated with various window systems. While it might require some custom integration work, it's likely possible to use ModernGL with Panda3D.[1]

4. PyGLM integration:
While not explicitly mentioned in the search results, ModernGL is compatible with PyGLM. Since both libraries work with OpenGL, you can use PyGLM for math operations and pass the results to ModernGL for rendering.

5. Standalone rendering:
ModernGL supports standalone (offline) rendering without a window. This feature can be useful for various applications, including integration with other libraries or headless rendering.[4]

ModernGL is designed to be highly modular and flexible. It provides a Pythonic API for OpenGL, making it easier to work with compared to raw OpenGL bindings. The library also offers additional functionality through extras like `moderngl-window`, which provides window creation and resource loading capabilities.[5][2][1]

For your specific use case of creating a modular OpenGL library that can work with Qt6 and other frameworks, ModernGL seems to be a good fit. It allows you to focus on high-level rendering tasks while providing the flexibility to integrate with various GUI frameworks and other libraries as needed.

### Sources

- [A cross platform utility library for ModernGL making window ... - GitHub](https://github.com/moderngl/moderngl-window)
  - A cross platform utility library for ModernGL making window creation and resource loading simple. It can also be used with PyOpenGL for rendering with the programmable pipeline. moderngl-window Documentation moderngl-window on PyPI moderngl-window on Github ModernGL ModernGL Discord Server Please report bugs or post questions/feedback on github.... ## Features Cross platform support. Tested on Windows 10, Linux and Mac OS X. This can save users a lot of time and is often more difficult than...
- [moderngl - PyPI](https://pypi.org/project/moderngl/)
  - ModernGL is a Python wrapper over OpenGL Core. ModernGL simplifies the creation of graphics applications like scientific simulations, games or user interfaces. Usually, acquiring in-depth knowledge of OpenGL requires a steep learning curve. In contrast, ModernGL is easy to learn and use. ModernGL is capable of rendering with high performance and quality, with less code written. pip install moderngl pip install moderngl[headless] pip install moderngl-window GPU accelerated high quality graphics...
- [Integration of external GUI in to Panda 3D? - General Discussion](https://discourse.panda3d.org/t/integration-of-external-gui-in-to-panda-3d/23905)
  - Hello, How easy is integrate external GUI in to Panda3D? It is possible? I have experience with Noesis GUI, but as standalone application used with GLFW for display it in window. And I think it would be great idea use Noesis in Panda 3D for GUI. Why Noesis? I can use Blend studio from VisualStudio and draw gui without coding it. And support most controls from WPF. It is something like WPF. Btw. it is for C++ therefore I will use C++ in Panda3D. ...
- [Standalone rendering - ModernGL 5.10.0 documentation](https://moderngl.readthedocs.io/en/stable/the_guide/getting_started/first_rendering/rendering.html)
  - Standalone (offline) rendering allows you to render without using a window, and is included in ModernGL by default. Rendering occurs when is called. By default, the mode parameter is , but since we need to draw a line, we change the mode value to : vao.render(moderngl.LINES) # "mode" is the first optional argument To display the rendering result, we use the library that comes with Python. Let’s return the texture from the GPU memory to RAM and call the PIL.Image.show() method to show it....
- [moderngl/moderngl: Modern OpenGL binding for Python - GitHub](https://github.com/moderngl/moderngl/)
  - ModernGL is a Python wrapper over OpenGL Core. ModernGL simplifies the creation of graphics applications like scientific simulations, games or user interfaces. Usually, acquiring in-depth knowledge of OpenGL requires a steep learning curve. In contrast, ModernGL is easy to learn and use. ModernGL is capable of rendering with high performance and quality, with less code written. pip install moderngl pip install moderngl[headless] pip install moderngl-window GPU accelerated high quality graphics...

## User

What is the best way to use ModernGL and background IO to ensure expensive tasks like e.g. parsing a model/texture into memory doesn't block the main thread or lag?

## Assistant

Based on the search results and the context of your question, here are some recommendations for using ModernGL with background I/O to handle expensive tasks without blocking the main thread:

1. Asynchronous Asset Loading:
   Use a separate thread or an asynchronous approach to load and process your models and textures. This can be achieved using Python's asyncio or threading libraries. 

   For example, you could create a worker thread that:
   - Loads the model/texture file from disk
   - Parses it into a suitable format
   - Prepares the data for GPU upload

2. Double Buffering:
   Implement a double buffering mechanism to avoid conflicts between the rendering thread and the loading thread. This involves:
   - Using an alternative render target (e.g., an additional framebuffer object) that is fully controlled by the worker thread
   - Blitting to the main framebuffer at a suitable time

3. GPU Resource Sharing:
   ModernGL supports creating shared contexts. You can create a separate OpenGL context for resource loading that shares resources with the main rendering context. This allows for threaded generation of textures and asynchronous texture uploads.[4]

   ```python
   ctx = moderngl.create_context()
   shared_ctx = moderngl.create_context(share=ctx)
   ```

4. Persistent Mapped Buffers:
   Use persistent mapped buffers for efficient data transfer between CPU and GPU. This allows you to write data to the buffer from a separate thread without blocking the main rendering thread.[2]

   ```python
   pbo = ctx.buffer(reserve=size, dynamic=True)
   mapped_memory = pbo.map(moderngl.WRITE_ONLY | moderngl.PERSISTENT)
   ```

5. Texture Streaming:
   For large textures, consider implementing a texture streaming system. Load lower resolution mipmap levels first, then progressively load higher resolution levels.[2]

   ```python
   texture.build_mipmaps(base=0, max_level=4)  # Start with lower mip levels
   # Later, update with higher resolution data
   texture.write(high_res_data, viewport=(0, 0, width, height))
   ```

6. Signaling and Synchronization:
   Use a signaling mechanism to communicate between your loading thread and rendering thread. This could be as simple as a flag indicating when new data is ready, or a more complex queue system for multiple assets.

7. Incremental Rendering:
   If possible, design your rendering system to support incremental updates. This allows you to start rendering with partially loaded data and update the scene as more data becomes available.[4]

Here's a basic example of how you might structure your code:

```python
import threading
import moderngl
import moderngl_window as mglw

class MyApplication(mglw.WindowConfig):
    gl_version = (3, 3)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.load_queue = Queue()
        self.loader_thread = threading.Thread(target=self.asset_loader)
        self.loader_thread.start()

    def asset_loader(self):
        while True:
            asset = self.load_queue.get()
            if asset is None:
                break
            # Load and process asset here
            # Signal main thread when done

    def load_asset(self, asset_path):
        self.load_queue.put(asset_path)

    def render(self, time, frametime):
        # Check for completed asset loads
        # Update scene with new assets if available
        # Render scene

    def close(self):
        self.load_queue.put(None)  # Signal loader thread to exit
        self.loader_thread.join()

MyApplication.run()
```

This approach allows you to load assets in the background while keeping your main rendering loop responsive. Remember to implement proper synchronization between threads to avoid race conditions and ensure data integrity.

### Sources

- [dobrakmato/async-opengl-renderer - GitHub](https://github.com/dobrakmato/async-opengl-renderer)
  - OpenGL renderer with asynchronous loading of assets (experiment). The application first starts with rendering quad without texture. After 1 second a load request is dispatched to *content loading system*, which asynchronously loads file from disk, decodes it and uploads image data to GPU without blocking or stopping the main thread, so the OpenGL application continues to run smoothly (without any fps drop) even when data is being uploaded to GPU. The whole thing is based on creating another...
- [What is the best way to load textures asynchoronously? - OpenGL](https://community.khronos.org/t/what-is-the-best-way-to-load-textures-asynchoronously/106392)
  - For asynchronous loading, you might want to store all of the mipmap levels (this only adds 33% to the size of the data), uploading the highest (lowest-resolution) levels first and limiting the rate at which you upload data. You can use glTexParameter(GL_TEXTURE_MIN_LOD) to avoid sampling levels which haven’t been loaded yet. glTexParameter(GL_TEXTURE_MIN_LOD) Also: does it make a difference if you wait a frame between uploading the texture and using it for rendering? There might be internal...
- [Texture - ModernGL 5.10.0 documentation](https://moderngl.readthedocs.io/en/latest/reference/texture.html)
  - Texture# - class Texture# Returned by and A Texture is an OpenGL object that contains one or more images that all have the same image format. A texture can be used in two ways. It can be the source of a texture access from a Shader, or it can be used as a render target. A Texture object cannot be instantiated directly, it requires a context. Use or to create one. Methods# - Texture.read(alignment: int = 1) bytes # Read the pixel data as bytes into system memory. - Parameters: alignment (int) –...
- [QOpenGLWidget¶](https://doc.qt.io/qtforpython-5/PySide2/QtWidgets/QOpenGLWidget.html)
  - If you need to trigger a repaint from places other than (a typical example is when using timersto animate scenes), you should call the widget’s function to schedule an update. Your widget’s OpenGL rendering context is made current when , , or is called. If you need to call the standard OpenGL API functions from other places (e.g. in your widget’s constructor or in your own paint functions), you must call first. All rendering happens into an OpenGL framebuffer object. ensure that it is bound in...
- [python ModernGL pixel perfect textures - opengl - Stack Overflow](https://stackoverflow.com/questions/65463165/python-moderngl-pixel-perfect-textures)
  - I am using ModernGL to render a 2D texture with pixel perfect precision. My image contains a series of boxes which are 1 px wide, but when I render them, some of the edges are wider than others. I am using orthographic projection which should give me 1:1 pixel accuracy. Here is a minimum working example: import pygame from pygame.locals import * import moderngl import numpy as np from PIL import Image import glm pygame.init() pygame.display.gl_set_attribute(pygame.GL_CONTEXT_MAJOR_VERSION, 3)...
- [Standalone rendering#](https://moderngl.readthedocs.io/en/stable/the_guide/getting_started/first_rendering/rendering.html)
  - Standalone (offline) rendering allows you to render without using a window, and is included in ModernGL by default. Rendering occurs when is called. By default, the mode parameter is , but since we need to draw a line, we change the mode value to : vao.render(moderngl.LINES) # "mode" is the first optional argument To display the rendering result, we use the library that comes with Python. Let’s return the texture from the GPU memory to RAM and call the PIL.Image.show() method to show it....
- [GitHub - moderngl/moderngl-window: A cross platform utility library for ModernGL making window creation and resource loading simple](https://github.com/moderngl/moderngl-window)
  - A cross platform utility library for ModernGL making window creation and resource loading simple. It can also be used with PyOpenGL for rendering with the programmable pipeline. moderngl-window Documentation moderngl-window on PyPI moderngl-window on Github ModernGL ModernGL Discord Server Please report bugs or post questions/feedback on github.... ## Features Cross platform support. Tested on Windows 10, Linux and Mac OS X. This can save users a lot of time and is often more difficult than...

## User

I am still questioning whether moderngl is right for me. For example, do I have to manually implement Frustrum Culling myself? What pip packages would provide something like that?

## Assistant

Based on the information provided and the context of your question, here's an analysis of ModernGL and frustum culling:

1. ModernGL and Frustum Culling:
   ModernGL itself does not provide built-in frustum culling. It's a low-level OpenGL wrapper that focuses on providing a Pythonic interface to OpenGL functionality. Frustum culling is typically implemented at a higher level in the rendering pipeline.

2. Implementing Frustum Culling:
   If you choose to use ModernGL, you would indeed need to implement frustum culling yourself or use an additional library that provides this functionality. The frustum culling algorithm is not overly complex, but it does require some mathematical understanding and implementation effort.[1]

3. Alternative Packages:
   While there isn't a specific pip package dedicated solely to frustum culling, there are some higher-level 3D engines and libraries that include such features:

   a. PyVista: This library, built on top of VTK, provides high-level 3D visualization capabilities and may include some level of culling.[5]

   b. Panda3D: While not directly compatible with ModernGL, Panda3D is a game engine and framework that includes features like frustum culling.

   c. pygfx: A relatively new library for 3D visualization in Python that might include some culling features.

4. Combining ModernGL with Other Libraries:
   You could potentially use ModernGL for low-level rendering tasks and combine it with a higher-level library for scene management and culling. However, this would require careful integration.

5. Performance Considerations:
   Implementing frustum culling can significantly improve performance, especially for large scenes. As shown in the blog post you referenced, it can reduce GPU execution time by up to 75%.[1]

Recommendation:
If you're looking for a more complete solution that includes features like frustum culling out of the box, you might want to consider a higher-level 3D engine or visualization library. However, if you prefer the low-level control that ModernGL offers and are willing to implement additional features yourself, ModernGL could still be a good choice.

For your specific needs (creating a 3D level editor with support for custom model and texture formats), you might want to consider:

1. Using ModernGL for rendering, but implementing your own scene management and culling system.
2. Exploring higher-level libraries like PyVista or Panda3D that might provide more built-in functionality.
3. Creating a hybrid solution where you use ModernGL for rendering but incorporate other libraries for specific tasks like culling or scene management.

Remember, the best choice depends on your specific requirements, performance needs, and how much low-level control you want over the rendering process.

### Sources

- [Frustum Culling | Bruno Opsenica's Blog](https://bruop.github.io/frustum_culling/)
  - Frustum culling is a solution to this problem wherein we identify which primitives are actually relevant to the current view by performing intersection checks against the view frustum. The diagram below shows an example of this, with objects lying outside the view frustum being outlined with a dotted stroke (and labelled with “view frustum”).... ## OBB Culling We can exploit the fact that in clip space, all points lying inside the view frustum will satisfy the following inequalities: As a...
- [Frustum Culling - LearnOpenGL](https://learnopengl.com/Guest-Articles/2021/Scene/Frustum-Culling)
  - Now we know how to create a Scene graph and organize your object in a scene, we are going to see how to limit your GPU usage thanks to a technical name's the frustum culling. This technique is simple to understand. Instead of sending all information to your GPU, you will sort visible and invisible elements and render only visible elements. Thanks to this technique, you will earn GPU compute time. You need to know that when information travels toward another unit in your computer, it takes a...
- [moderngl](https://pypi.org/project/moderngl/)
  - ModernGL: High performance rendering for Python 3 ModernGL is a Python wrapper over OpenGL Core. ModernGL simplifies the creation of graphics applications like scientific simulations, games or user interfaces. Usually, acquiring in-depth knowledge of OpenGL requires a steep learning curve. In contrast, ModernGL is easy to learn and use. ModernGL is capable of rendering with high performance and quality, with less code written. pip install moderngl pip install moderngl[headless] pip install...
- [GitHub - moderngl/moderngl-window: A cross platform utility library for ModernGL making window creation and resource loading simple](https://github.com/moderngl/moderngl-window)
  - Cross platform support. Tested on Windows 10, Linux and Mac OS X. This can save users a lot of time and is often more difficult than most people imagine it to be. Easily create a window for ModernGL using pyglet, pygame, PySide2, GLFW, SDL2, PyQt5 or tkinter supporting a wide range of window, keyboard and mouse events. These events are unified into a single system so your project can work with any window. Load 2D textures, texture arrays and cube maps using Pillow Load shaders as single or...
- [Best Scientific 3D Visualization Libraries for Python](https://www.epsilonforge.com/post/best-3d-scientific-visualization/)
  - Scientific visualization of large 3D datasets is a complex task for which specialized software libraries have been developed for quite some time. Unlike other areas of CAD or CAE, 3D visualization software has mostly been open-source since the beginning. In particular, all libraries reviewed in this post offer permissive licenses which allow commercial use. Importantly, there are two kinds of tools we can rely on. On one hand, we have large... standalone applications like Paraview or VisIt,...

## User

Let's go back to the drawing board. Please find some high level OpenGL libraries for Python that will allow me to skip defining basic things like module rendering, texture loading, and frustrum culling, and a render loop, and allow me to focus on more important tasks.

## Assistant

Based on your requirements for a high-level OpenGL library in Python that handles basic rendering tasks, here are some recommended options:

## Panda3D

Panda3D is a game engine and framework that provides high-level 3D rendering capabilities:

- Handles model rendering, texture loading, and frustum culling
- Includes a built-in render loop
- Supports scene graph management
- Offers collision detection and physics simulation

Panda3D allows you to focus on game logic and content creation rather than low-level rendering tasks.[1]

## Pyglet

Pyglet is a cross-platform library for game development and multimedia applications:

- Provides an object-oriented programming interface for developing games
- Offers high-level abstractions for window creation, event handling, and audio
- Includes utilities for resource loading, including textures and models
- Supports OpenGL rendering

While not as comprehensive as Panda3D, Pyglet still offers many high-level features that simplify game development.[1]

## Arcade

Arcade is a modern Python library for creating 2D games with compelling graphics and sound:

- Provides a high-level, easy-to-use API for game development
- Handles sprite rendering, collision detection, and physics
- Includes built-in support for tile maps and particle systems
- Offers a simple game loop structure

Although primarily focused on 2D games, Arcade can be extended to support some 3D rendering tasks.[1]

## PyOgre

PyOgre is a Python binding for the OGRE 3D rendering engine:

- Offers a high-level scene graph API
- Handles model loading, texture management, and rendering optimization
- Provides built-in support for various rendering techniques and special effects
- Includes a robust material system for controlling object appearance

PyOgre allows you to leverage the power of the OGRE engine while working in Python.

## Recommendation

Given your specific requirements to skip defining basic rendering tasks and focus on higher-level development, I recommend considering **Panda3D** or **PyOgre**. Both of these libraries provide comprehensive high-level APIs that handle model rendering, texture loading, frustum culling, and render loops out of the box.

Panda3D might be particularly suitable as it's designed specifically for Python and offers a wide range of features for 3D game development and visualization. It allows you to focus on creating your level editor without getting bogged down in low-level OpenGL details.

Remember to evaluate these options based on their documentation, community support, and compatibility with your specific project requirements. Each library has its strengths, and the best choice will depend on the specific needs of your 3D level editor project.

### Sources

- [Top Python Game Engines](https://realpython.com/top-python-game-engines/)
  - In this tutorial, you'll explore several of these game engines, learning what you need to start crafting your own Python video games!
- [PythonGameLibraries - Python Wiki](https://wiki.python.org/moin/PythonGameLibraries)
  - pyglet is a cross-platform windowing and multimedia library for Python. pyglet provides an object-oriented programming interface for developing games and other visually-rich applications for Windows, Mac OS X and Linux using for rendering OpenGL. Some of the features of pyglet are:... - Gloopy is a simple OpenGL render loop, in pure Python, based on pyglet. It also uses PyOpenGL bindings. It is at an early stage of development and is hardly documented, although there are a couple of example...
- [Python & OpenGL for Scientific Visualization](https://www.labri.fr/perso/nrougier/python-opengl/)
  - The shader language is called glsl. There are many versions that goes from 1.0 to 1.5 and subsequent version get the number of OpenGL version. Last version is 4.6 (June 2017). If you want to understand modern OpenGL, you have to understand the graphic pipeline and shaders. Shaders are pieces of program (using a C-like language) that are build onto the GPU and executed during the rendering pipeline. Depending on the nature of the shaders (there are many types depending on the version of OpenGL...

## User

Provide a getting started overview for integrating proprietary model format, proprietary texture format, Panda3D, and QOpenGLWidget for Qt6. I have completed the exhaustive production-ready code required to convert the proprietary model/textures into common ones that most engines can understand. I do not know how to use these objects with Panda3d

## Assistant

Based on the information provided and your specific requirements, here's a high-level overview for integrating your proprietary model and texture formats with Panda3D and Qt6's QOpenGLWidget:

1. Panda3D Integration:
   Panda3D is a powerful 3D engine that can handle model rendering, texture loading, and scene management. Since you've already converted your proprietary formats to common ones, you can use Panda3D's built-in loaders to import your models and textures.

   ```python
   from panda3d.core import Loader
   
   loader = Loader.getGlobalPtr()
   model = loader.loadModel("path/to/your/converted/model.egg")
   texture = loader.loadTexture("path/to/your/converted/texture.png")
   model.setTexture(texture)
   ```

2. Qt6 and QOpenGLWidget:
   To integrate Panda3D with Qt6, you'll need to create a custom QOpenGLWidget that hosts the Panda3D rendering. Here's a basic structure:

   ```python
   from PySide6.QtOpenGLWidgets import QOpenGLWidget
   from direct.showbase.ShowBase import ShowBase
   
   class Panda3DWidget(QOpenGLWidget):
       def __init__(self, parent=None):
           super().__init__(parent)
           self.base = None
   
       def initializeGL(self):
           self.base = ShowBase(windowType='offscreen')
           # Load your models and set up your scene here
   
       def paintGL(self):
           if self.base:
               self.base.graphicsEngine.renderFrame()
   
       def resizeGL(self, width, height):
           if self.base:
               self.base.camNode.getDisplayRegion(0).setDimensions(0, 1, 0, 1)
   ```

3. Loading Your Models and Textures:
   In the `initializeGL` method of your Panda3DWidget, you can load your converted models and textures:

   ```python
   def initializeGL(self):
       self.base = ShowBase(windowType='offscreen')
       
       # Load your converted model
       model = self.base.loader.loadModel("path/to/your/converted/model.egg")
       model.reparentTo(self.base.render)
       
       # Load and apply your converted texture
       texture = self.base.loader.loadTexture("path/to/your/converted/texture.png")
       model.setTexture(texture)
   ```

4. Main Application:
   In your main Qt application, you can create and use the Panda3DWidget:

   ```python
   from PySide6.QtWidgets import QApplication, QMainWindow
   
   class MainWindow(QMainWindow):
       def __init__(self):
           super().__init__()
           self.panda3d_widget = Panda3DWidget()
           self.setCentralWidget(self.panda3d_widget)
   
   if __name__ == "__main__":
       app = QApplication([])
       window = MainWindow()
       window.show()
       app.exec()
   ```

5. Handling User Input:
   To handle user input, you'll need to override Qt's event handlers in your Panda3DWidget and translate them to Panda3D's input system.

6. Performance Optimization:
   For better performance, consider using Panda3D's built-in multithreading capabilities and optimize your rendering pipeline.

This setup allows you to use Panda3D's powerful 3D rendering capabilities within a Qt6 application. You can load your converted models and textures using Panda3D's loaders, and the rendering will be displayed in the QOpenGLWidget.

Remember to handle resource management carefully, especially when closing the application or switching between different views. You may need to implement proper cleanup methods to ensure all Panda3D and OpenGL resources are released correctly.

### Sources

- [Texture#](https://moderngl.readthedocs.io/en/latest/reference/texture.html)
  - Bufferis that pixel data does not need to travel all the way to system memory: # Reading pixel data into a bytearray data = bytearray(8) texture = ctx.texture3d((2, 2, 2), 1) texture.read_into(data) # Reading pixel data into a buffer data = ctx.buffer(reserve=8) texture = ctx.texture3d((2, 2, 2), 1) texture.read_into(data) - Parameters: buffer (bytearray) – The buffer that will receive the pixels. alignment (int) – The byte alignment of the pixels. write_offset (int) – The write offset. -...
- [Supported Model Formats - Panda3D Manual](https://docs.panda3d.org/1.11/python/pipeline/model-file-formats)
  - Panda3D contains an extensible plug-in system for loading model files. These plug-ins enable Panda3D to load models in a variety of formats, without requiring an explicit conversion step. This page lists the formats and plug-ins available for loading models into Panda3D.... ## BAM Format The most powerful file format that Panda3D supports is BAM. This is a direct binary representation of the internal object structure of Panda3D. As such it supports almost all of the objects you can create in...
- [Integrating Panda3d in PySide2/Qt5 - Code Snippets](https://discourse.panda3d.org/t/integrating-panda3d-in-pyside2-qt5/24251)
  - I’ve been working on embedding a Panda3D window inside a PySide2/Qt5 widget. There’s a previous effort here that’s a bit aged: However since that time, Qt4 has changed to Qt5, the Qt OpenGL interface class has changed to QOpenGLWidget and the previous solution deprecated, and Panda3D has moved into preferring the ShowBase class. So time for an update. I tried working from the snippets posted above but ended up more relying on WxPandaWindow.py and trying to infer the differences required in...
- [(Python) Panda3D loads solid color instead of full texture](https://stackoverflow.com/questions/68385275/python-panda3d-loads-solid-color-instead-of-full-texture)
  - I am trying to add a simple grass texture on my imported plane. Instead of loading the full texture, it loads a solid color. Any help is appreciated. Here is the texture: Here is the result: Here is my code from direct.showbase.ShowBase import ShowBase from direct.task.TaskManagerGlobal import taskMgr from panda3d.core import WindowProperties, Texture, TextureStage from panda3d.core import AmbientLight from panda3d.core import Vec4 class Game(ShowBase): player_x = 1 player_y = 22 player_speed...
- [Synopsis](https://doc.qt.io/qtforpython-6/PySide6/QtOpenGLWidgets/QOpenGLWidget.html)
  - Warning This section contains snippets that were automatically translated from C++ to Python and may contain errors. provides functionality for displaying OpenGL graphics integrated into a Qt application. It is very simple to use: Make your class inherit from it and use the subclass like any other QWidget, except that you have the choice between using QPainter and standard OpenGL rendering commands. provides three convenient virtual functions that you can reimplement in your subclass to...
