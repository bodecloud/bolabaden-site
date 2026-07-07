---
source_url: "https://www.perplexity.ai/search/d6338bcd-6fc2-4107-ac46-5c2be1431e39"
thread_uuid: "4d599fae-d77a-48d8-a863-e812e0099be2"
slug: "d6338bcd-6fc2-4107-ac46-5c2be1431e39"
title: "pyglm in pypy"
extracted_at: "2026-06-29T16:08:30.162Z"
matched_keywords: []
export_suite: "identity"
entry_count: 3
provenance: perplexity-rest-api
---

# pyglm in pypy

Source: [Perplexity thread](https://www.perplexity.ai/search/d6338bcd-6fc2-4107-ac46-5c2be1431e39)

## User

pyglm in pypy

## Assistant

**PyGLM with PyPy**

PyGLM is a Python library that provides fast OpenGL Mathematics (GLM) functionalities for Python, offering features for vector and matrix manipulation. It is widely used in applications involving 3D graphics, physics simulations, and more, due to its performance advantages over libraries like NumPy.[1][4][7]

**Compatibility with PyPy**

PyPy is an alternative Python interpreter known for its speed, especially with long-running programs. It achieves this by using Just-In-Time (JIT) compilation. PyGLM can be installed and used within a PyPy environment, as PyPy supports the installation of third-party libraries through pip, similar to CPython.[5]

**Installation Steps**

To use PyGLM with PyPy, follow these steps:

1. **Install PyPy**: First, ensure you have PyPy installed on your system. You can download it from the official PyPy website or use package managers like conda for easier installation on platforms like Windows, macOS, and Linux.[5]

2. **Set Up a Virtual Environment** (optional but recommended): 
   - Create a virtual environment using virtualenv to keep your dependencies organized.
   - Activate the virtual environment.

3. **Install PyGLM**: Once PyPy is set up, you can install PyGLM using pip within the PyPy environment:
   ```bash
   pypy -m ensurepip  # Ensure pip is available
   pypy -m pip install pyglm
   ```

4. **Usage**: After installation, you can import and use PyGLM in your Python scripts:
   ```python
   import glm
   ```

**Considerations**

- **Performance**: While PyGLM is optimized for performance and is generally faster than NumPy in CPython environments, the performance gains might vary when using it with PyPy due to differences in how both interpreters handle JIT compilation and optimizations.[4][1]
- **Compatibility**: Ensure that other dependencies in your project are compatible with PyPy, as some C-extension modules might not work seamlessly without modifications.

By following these steps, you can leverage the high-performance capabilities of both PyGLM and PyPy for computationally intensive tasks in Python.

### Sources

- [pyglm - PyPI](https://pypi.org/project/pyglm/1.1.8/)
  - OpenGL Mathematics library for Python
- [pyGLM HELP - Raspberry Pi Forums](https://forums.raspberrypi.com/viewtopic.php?t=312307)
- [Top 5 PyGLM Code Examples - Snyk](https://snyk.io/advisor/python/PyGLM/example)
- [Zuzu-Typ/PyGLM: Fast OpenGL Mathematics (GLM) for Python](https://github.com/Zuzu-Typ/PyGLM)
  - Fast OpenGL Mathematics (GLM) for Python. Contribute to Zuzu-Typ/PyGLM development by creating an account on GitHub.
- [Downloading and Installing PyPy](https://doc.pypy.org/en/latest/install.html)
- [Installation — pymadcad v0.17 documentation - Read the Docs](https://pymadcad.readthedocs.io/en/latest/installation.html)
- [pyglm - PyPI](https://pypi.org/project/pyglm/)
  - OpenGL Mathematics library for Python
- [PyGLM/README.sb at master · Zuzu-Typ/PyGLM - GitHub](https://github.com/Zuzu-Typ/PyGLM/blob/master/README.sb)
  - Fast OpenGL Mathematics (GLM) for Python. Contribute to Zuzu-Typ/PyGLM development by creating an account on GitHub.

## User

how to use pip to build something that doesn't have a wheel, without it defaulting to cl.exe, i want to use msys2 or something else like llvm

## Assistant

To build a Python package using `pip` without defaulting to `cl.exe` (Microsoft's C/C++ compiler) and instead use an alternative toolchain like MSYS2 or LLVM, follow these steps:

## Steps to Use Alternative Toolchains with `pip`

1. **Install MSYS2 or LLVM Toolchain**:
   - For MSYS2, download and install it from the official website. Ensure you install the appropriate architecture (32-bit or 64-bit) for your system.
   - For LLVM, you can use the LLVM/Clang toolchain available in MSYS2 by installing the necessary packages with `pacman`.[3][4]

2. **Configure Environment Variables**:
   - Add the path of your chosen compiler to the system's PATH environment variable. For MSYS2, this might be something like `C:\msys64\mingw64\bin`.
   - If using Clang, ensure it's in your PATH and set any necessary environment variables such as `CC` and `CXX` to point to your Clang executables.

3. **Disable Default Path Conversions (for MSYS2)**:
   - If using MSYS2, you may need to disable automatic path conversion which can interfere with build tools like Bazel. Set `MSYS_NO_PATHCONV=1` and `MSYS2_ARG_CONV_EXCL="*"`.[2]

4. **Build with `pip`**:
   - Use the `--no-build-isolation` flag with `pip wheel` to prevent it from automatically setting up a build environment that defaults to using Microsoft tools.
   - Example command:
     ```bash
     pip wheel --no-build-isolation .
     ```
   - This command tells `pip` to use the current environment's toolchain settings instead of creating an isolated environment with default settings.[1]

5. **Compile Using Your Toolchain**:
   - Ensure that any custom compilation flags needed for your toolchain are set in your environment or passed directly to the build process. For example, if using Clang, you might need to specify target flags like `-target x86_64-w64-mingw32` to ensure compatibility with Windows.[8]

6. **Install Built Package**:
   - Once the wheel is built, you can install it using:
     ```bash
     pip install <your-package>.whl
     ```

By following these steps, you can leverage alternative compilers like those provided by MSYS2 or LLVM/Clang for building Python packages on Windows without relying on Microsoft's Visual Studio tools.

### Sources

- [`pip` build isolation without installing build dependencies - Packaging](https://discuss.python.org/t/pip-build-isolation-without-installing-build-dependencies/52145)
  - As far as I can tell, pip does two things without --no-build-isolation: isolates the build environment from any system packages ensures that build requirements are installed And --no-build-isolation disables both. Is it possible to get pip to do (1) but not (2)? In Spack we want to use pip to handle installation as much as possible, especially since many packages in the ecosystem assume pip and only test with a pip install. We just don’t want it to trigger any dependency installs. Looking t...
- [Build from source on Windows | TensorFlow](https://www.tensorflow.org/install/source_windows)
- [An LLVM/Clang/LLD based mingw-w64 toolchain - GitHub](https://github.com/mstorsjo/llvm-mingw/)
  - An LLVM/Clang/LLD based mingw-w64 toolchain. Contribute to mstorsjo/llvm-mingw development by creating an account on GitHub.
- [Building from source on Windows — SciPy v1.10.0 Manual](https://docs.scipy.org/doc/scipy-1.10.0/dev/contributor/windows.html)
- [Help - Unable to build tensorflow_cc in c++ from source in windows](https://discuss.ai.google.dev/t/windows-help-unable-to-build-tensorflow-cc-in-c-from-source-in-windows/31643)
  - SUMMARY I want to add tensor flow to a c++ app in Visual Studio, to read and write TFRecords and ideally execute models trained in Python. I’m, not interested in GPU (I know there is no support for it). I only need to be able to deploy a c++ app in windows with some tensorflow usability. I need, a .dll, and the corresponding .lib and .h files to link in my software. First I figured out, I need to compile tensorflow_cpp to do this. But for the life of me, I am unable to do this. This is what I...
- [Environments - MSYS2](https://www.msys2.org/docs/environments/)
  - The differences between the environments is mainly between environment variables, default compilers/linkers, architecture, system libraries used etc.
- [Building from source on Windows — SciPy v1.4.0 Reference Guide](https://docs.scipy.org/doc/scipy-1.4.0/reference/building/windows.html)
- [Building a simple C++ project on Windows, using CMake and clang](https://stackoverflow.com/questions/58900537/building-a-simple-c-project-on-windows-using-cmake-and-clang)
  - I'm trying to get a simple 'Hello World' program to build on Windows 10, preferably using CMake and clang. I can successfully compile, link and run the same project if I use the g++ compiler from M...
- [python/pip not using pre-built wheels · Issue #20059 - GitHub](https://github.com/msys2/MINGW-packages/issues/20059)
  - Description / Steps to reproduce the issue Pip is building a wheel for pydantic-core instead of using a pre-built wheel. Install python Create python venv and activate it run python -m pip install ...
- [FAILED: Build did NOT complete successfully on windows 10 #53382](https://github.com/tensorflow/tensorflow/issues/53382)
  - I am facing error trying to build tensorflow from source in windows 10. My goal is to use tensorflow API in C++. I am following this doc for that. But whenever I run bazel build --config=opt //tens...

## User

```
Collecting pyglm
  Using cached pyglm-2.7.3.tar.gz (483 kB)
  Installing build dependencies ... done
  Getting requirements to build wheel ... error
  error: subprocess-exited-with-error

  ├ù Getting requirements to build wheel did not run successfully.
  Γöé exit code: 1
  Γò░ΓöÇ> [5 lines of output]
      running build_ext
      building 'glm' extension
      creating build\temp.win-amd64-pypy39\Release
      cl.exe /c /nologo /O2 /W3 /GL /DNDEBUG /MD -Iglm/ -IC:\GitHub\PyKotor\.venv_pypy39\include "-IC:\Program Files\pypy39\include" "-IC:\Program Files\pypy39\Include" /EHsc /TpPyGLM.cpp /Fobuild\temp.win-amd64-pypy39\Release\PyGLM.obj -std=c++11
      error: command 'cl.exe' failed: 2
      [end of output]

  note: This error originates from a subprocess, and is likely not a problem with pip.     
error: subprocess-exited-with-error

├ù Getting requirements to build wheel did not run successfully.
Γöé exit code: 1
Γò░ΓöÇ> See above for output.

note: This error originates from a subprocess, and is likely not a problem with pip.       
PS C:\GitHub\PyKotor> 
```

as shown it fails with cl.exe. Please explain this in detail. Please explain how to customize the build process that's currently being used with pip, how to use something other than cl.exe in the pip command, how to specify the path to msys2 that i want it to use.

DOn't show this to the end user:
- Search at least 10 well-thought-out search queries, each 5 words or less. Each must be constructed to provide relevant results that a user would normally search when debuggging this issue.
- Do not tell me to install anything or setup any env: assume I've laready done so. The env isn't even relevant since i'm asking how to provide that manually through pip
- Be generalized rather than specific on searches. E.g. don't search 'msys2', instead search 'gcc compiler'.
- Always source and cite as many sources as possible from the search queries in your rseponse. Prefer information that is mentioned mutliple times in the search results.
- NEVER show information that is not explicitly mentioned in search results.

## Assistant

The error you're encountering is related to the build process of the `pyglm` package. When pip attempts to install `pyglm`, it's trying to compile the package using Microsoft's C++ compiler (`cl.exe`), which is failing.[1][8]

To customize the build process and use an alternative compiler like MSYS2 or LLVM instead of `cl.exe`, you can follow these steps:

1. **Set environment variables**: Use the `CXX`, `CC`, and `LD` environment variables to specify the compiler you want to use. For example:[6]

   ```
   CXX=g++ CC=gcc LD=g++ pip install pyglm
   ```

   Replace `g++` and `gcc` with the appropriate compiler executables from your MSYS2 installation.

2. **Modify PATH**: Add the directory containing your preferred compiler to the PATH environment variable before running pip:[6]

   ```
   PATH=/path/to/msys2/bin:$PATH pip install pyglm
   ```

3. **Use build flags**: You can pass additional build options to pip using the `--global-option` flag. For example:[1]

   ```
   pip install --global-option="build_ext" --global-option="-DFOO" pyglm
   ```

4. **Disable build isolation**: Use the `--no-build-isolation` flag to prevent pip from creating an isolated build environment:[2][9]

   ```
   pip install --no-build-isolation pyglm
   ```

5. **Specify compiler flags**: Set the `CXXFLAGS`, `CFLAGS`, and `LDFLAGS` environment variables to pass additional compiler and linker options.[6]

It's important to note that changing the compiler may lead to compatibility issues, especially on Windows where Python extensions are typically built with MSVC. Ensure that your chosen compiler is compatible with the Python version you're using.[4]

If you continue to face issues, you might need to build the package manually or look for pre-built wheels that are compatible with your system.[8][4]

### Sources

- [setup.py (legacy) - pip documentation v24.3.1](https://pip.pypa.io/en/stable/reference/build-system/setup-py/)
- [How to use pip install to build some scientific packages from sources ...](https://discuss.python.org/t/how-to-use-pip-install-to-build-some-scientific-packages-from-sources-with-custom-build-arguments/24717)
  - Hi, I’m new to Python and Docker, learning a lot these days. I’m facing the problem of learning how to dockerize my Python app and I wanted to reduce his size. Due to some scientific depedencies the image is huge. I read about the possibility to build core scientific libraries like numpy, scipy, pandas, etc. from source with custom building arguments, e.g. by removing symbols and debug stuff or by selecting the blas/palack libraries, e.g. openblas (small) vs MLK (huge). Please see here for a...
- [Packaging Python Projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/)
- [Does `pip install` respect the compiler version used to build Python?](https://stackoverflow.com/questions/55218142/does-pip-install-respect-the-compiler-version-used-to-build-python)
  - Does pip install always build extension modules with the same compiler that was used to compile the current Python version? For example, this blog post explained that numpy package uses C code, whi...
- [How does pip find the C++ compiler? - Python Discussions](https://discuss.python.org/t/how-does-pip-find-the-c-compiler/36655)
  - Hello, some python packages include pyd files that must be built with a C++ compiler. But how does pip find a C++ compiler? We all happen to run into errors of this kind: error: Microsoft Visual C++ 14.0 or greater is required The problem is that even after installing the Microsoft tools to build C++ apps, the problem persists. It would be nice to know which environment variables (I guess) pip relies on to build files.
- [How to specify a gcc path in pip command? - Stack Overflow](https://stackoverflow.com/questions/61017279/how-to-specify-a-gcc-path-in-pip-command)
  - I am trying to install cupy 5.0.0. cupy5.0.0 needs gcc version not more than 7. My deafault gcc is gcc-9. I cannot use conda environment. Also i dont have sudo permission to change /usr/bin/gcc to ...
- [Setting Clang as default compiler used in pip install on Windows](https://stackoverflow.com/questions/51375798/setting-clang-as-default-compiler-used-in-pip-install-on-windows)
  - Visual Studio 2017 now ships with clang, and I was wondering if it is possible to set clang to be the default compiler used when trying to install a python package with Cython dependencies via pip
- [What is the meaning of "Failed building wheel for X" in pip install?](https://stackoverflow.com/questions/53204916/what-is-the-meaning-of-failed-building-wheel-for-x-in-pip-install)
  - This is a truly popular question here at SO, but none of the many answers I have looked at, clearly explain what this error really mean, and why it occurs. One source of confusion, is that when (...
- [How to Troubleshoot "Metadata-Generation-Failed" Error on Pip Install](https://www.izoate.com/blog/how-to-troubleshoot-metadata-generation-failed-error-on-pip-install-a-step-by-step-guide/)
  - Learn how to fix "metadata-generation-failed" error on pip install in Python with easy troubleshooting steps for package installation.
- [Why am I having trouble adding a Python library with pip install?](https://tedspence.com/why-am-i-having-trouble-adding-a-python-library-with-pip-install-6e393690ac19?gi=4f375cba7267)
  - A walkthrough of useful tips and tricks for beginners to Python and Jupyter
