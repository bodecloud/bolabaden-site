---
source_url: "https://www.perplexity.ai/search/a03677db-8644-41c3-9196-a8ff36249ce3"
thread_uuid: "0437d25e-2930-4bae-adbf-3739316db599"
slug: "a03677db-8644-41c3-9196-a8ff36249ce3"
title: "Microsoft Windows [Version 10.0.19045.4291]
(c) Microsoft Corporation. All rights reserved.

(.venv_pypy39) C:\GitHub\PyKotor>\"C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\Build\vcvarsall.bat\" x64 && pip install pyglm
**********************************************************************
** Visual Studio 2019 Developer Command Prompt v16.11.39
** Copyright (c) 2021 Microsoft Corporation
**********************************************************************
[vcvarsall.bat] Environment initialized for: 'x64'
Collecting pyglm
  Using cached pyglm-2.7.3.tar.gz (483 kB)
  Installing build dependencies ... done  
  Getting requirements to build wheel ... done
  Preparing metadata (pyproject.toml) ... done  
Building wheels for collected packages: pyglm   
  Building wheel for pyglm (pyproject.toml) ... error
  error: subprocess-exited-with-error

  ├ù Building wheel for pyglm (pyproject.toml) did not run successfully.
  Γöé exit code: 1
  Γò░ΓöÇ> [25 lines of output]
      running bdist_wheel
      running build
      running build_py
      creating build\lib.win-amd64-pypy39\glm-stubs
      copying glm-stubs\glm_typing.py -> build\lib.win-amd64-pypy39\glm-stubs
      copying glm-stubs\__init__.py -> build\lib.win-amd64-pypy39\glm-stubs
      running egg_info
      writing PyGLM.egg-info\PKG-INFO
      writing dependency_links to PyGLM.egg-info\dependency_links.txt
      writing top-level names to PyGLM.egg-info\top_level.txt
      reading manifest file 'PyGLM.egg-info\SOURCES.txt'
      reading manifest template 'MANIFEST.in'
      adding license file 'LICENSE'
      adding license file 'license.h'
      adding license file 'COPYING'
      writing manifest file 'PyGLM.egg-info\SOURCES.txt'
      copying glm-stubs\__init__.pyi -> build\lib.win-amd64-pypy39\glm-stubs
      running build_ext
      building 'glm' extension
      creating build\temp.win-amd64-pypy39\Release
      \"C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Tools\MSVC\14.29.30133\bin\HostX86\x64\cl.exe\" /c /nologo /O2 /W3 /GL /DNDEBUG /MD -Iglm/ -IC:\GitHub\PyKotor\.venv_pypy39\include \"-IC:\Program Files\pypy39\include\" \"-IC:\Program Files\pypy39\Include\" \"-IC:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Tools\MSVC\14.29.30133\include\" \"-IC:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\VS\include\" \"-IC:\Program Files (x86)\Windows Kits\NETFXSDK\4.8\include\um\" \"-IC:\Program 
Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Tools\MSVC\14.29.30133\include\" \"-IC:\Program Files (x86)\Windows Kits\NETFXSDK\4.8\include\um\" /EHsc /TpPyGLM.cpp /Fobuild\temp.win-amd64-pypy39\Release\PyGLM.obj -std=c++11
      cl : Command line warning D9002 : ignoring unknown option '-std=c++11'
      PyGLM.cpp
      C:\Program Files\pypy39\include\pyconfig.h(59): fatal error C1083: Cannot open include file: 'io.h': No such file or directory
      error: command 'C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\BuildTools\\VC\\Tools\\MSVC\\14.29.30133\\bin\\HostX86\\x64\\cl.exe' failed with exit code 2
      [end of output]

  note: This error originates from a subprocess, and is likely not a problem with pip.     
  ERROR: Failed building wheel for pyglm
Failed to build pyglm
ERROR: ERROR: Failed to build installable wheels for some pyproject.toml based projects (pyglm)


How to fix this error when trying to use pip to build a package? literally anytime it tries to use cl.exe for any package (pyglm is an example, don't focus on pyglm) it fails. WHy..

Do not tell me anything unless you can cite it from multiple sources from the searches"
extracted_at: "2026-06-29T16:08:27.107Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# Microsoft Windows [Version 10.0.19045.4291]
(c) Microsoft Corporation. All rights reserved.

(.venv_pypy39) C:\GitHub\PyKotor>"C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\Build\vcvarsall.bat" x64 && pip install pyglm
**********************************************************************
** Visual Studio 2019 Developer Command Prompt v16.11.39
** Copyright (c) 2021 Microsoft Corporation
**********************************************************************
[vcvarsall.bat] Environment initialized for: 'x64'
Collecting pyglm
  Using cached pyglm-2.7.3.tar.gz (483 kB)
  Installing build dependencies ... done  
  Getting requirements to build wheel ... done
  Preparing metadata (pyproject.toml) ... done  
Building wheels for collected packages: pyglm   
  Building wheel for pyglm (pyproject.toml) ... error
  error: subprocess-exited-with-error

  ├ù Building wheel for pyglm (pyproject.toml) did not run successfully.
  Γöé exit code: 1
  Γò░ΓöÇ> [25 lines of output]
      running bdist_wheel
      running build
      running build_py
      creating build\lib.win-amd64-pypy39\glm-stubs
      copying glm-stubs\glm_typing.py -> build\lib.win-amd64-pypy39\glm-stubs
      copying glm-stubs\__init__.py -> build\lib.win-amd64-pypy39\glm-stubs
      running egg_info
      writing PyGLM.egg-info\PKG-INFO
      writing dependency_links to PyGLM.egg-info\dependency_links.txt
      writing top-level names to PyGLM.egg-info\top_level.txt
      reading manifest file 'PyGLM.egg-info\SOURCES.txt'
      reading manifest template 'MANIFEST.in'
      adding license file 'LICENSE'
      adding license file 'license.h'
      adding license file 'COPYING'
      writing manifest file 'PyGLM.egg-info\SOURCES.txt'
      copying glm-stubs\__init__.pyi -> build\lib.win-amd64-pypy39\glm-stubs
      running build_ext
      building 'glm' extension
      creating build\temp.win-amd64-pypy39\Release
      "C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Tools\MSVC\14.29.30133\bin\HostX86\x64\cl.exe" /c /nologo /O2 /W3 /GL /DNDEBUG /MD -Iglm/ -IC:\GitHub\PyKotor\.venv_pypy39\include "-IC:\Program Files\pypy39\include" "-IC:\Program Files\pypy39\Include" "-IC:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Tools\MSVC\14.29.30133\include" "-IC:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\VS\include" "-IC:\Program Files (x86)\Windows Kits\NETFXSDK\4.8\include\um" "-IC:\Program 
Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Tools\MSVC\14.29.30133\include" "-IC:\Program Files (x86)\Windows Kits\NETFXSDK\4.8\include\um" /EHsc /TpPyGLM.cpp /Fobuild\temp.win-amd64-pypy39\Release\PyGLM.obj -std=c++11
      cl : Command line warning D9002 : ignoring unknown option '-std=c++11'
      PyGLM.cpp
      C:\Program Files\pypy39\include\pyconfig.h(59): fatal error C1083: Cannot open include file: 'io.h': No such file or directory
      error: command 'C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\BuildTools\\VC\\Tools\\MSVC\\14.29.30133\\bin\\HostX86\\x64\\cl.exe' failed with exit code 2
      [end of output]

  note: This error originates from a subprocess, and is likely not a problem with pip.     
  ERROR: Failed building wheel for pyglm
Failed to build pyglm
ERROR: ERROR: Failed to build installable wheels for some pyproject.toml based projects (pyglm)


How to fix this error when trying to use pip to build a package? literally anytime it tries to use cl.exe for any package (pyglm is an example, don't focus on pyglm) it fails. WHy..

Do not tell me anything unless you can cite it from multiple sources from the searches

Source: [Perplexity thread](https://www.perplexity.ai/search/a03677db-8644-41c3-9196-a8ff36249ce3)

## User

Microsoft Windows [Version 10.0.19045.4291]
(c) Microsoft Corporation. All rights reserved.

(.venv_pypy39) C:\GitHub\PyKotor>"C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\Build\vcvarsall.bat" x64 && pip install pyglm
**********************************************************************
** Visual Studio 2019 Developer Command Prompt v16.11.39
** Copyright (c) 2021 Microsoft Corporation
**********************************************************************
[vcvarsall.bat] Environment initialized for: 'x64'
Collecting pyglm
  Using cached pyglm-2.7.3.tar.gz (483 kB)
  Installing build dependencies ... done  
  Getting requirements to build wheel ... done
  Preparing metadata (pyproject.toml) ... done  
Building wheels for collected packages: pyglm   
  Building wheel for pyglm (pyproject.toml) ... error
  error: subprocess-exited-with-error

  ├ù Building wheel for pyglm (pyproject.toml) did not run successfully.
  Γöé exit code: 1
  Γò░ΓöÇ> [25 lines of output]
      running bdist_wheel
      running build
      running build_py
      creating build\lib.win-amd64-pypy39\glm-stubs
      copying glm-stubs\glm_typing.py -> build\lib.win-amd64-pypy39\glm-stubs
      copying glm-stubs\__init__.py -> build\lib.win-amd64-pypy39\glm-stubs
      running egg_info
      writing PyGLM.egg-info\PKG-INFO
      writing dependency_links to PyGLM.egg-info\dependency_links.txt
      writing top-level names to PyGLM.egg-info\top_level.txt
      reading manifest file 'PyGLM.egg-info\SOURCES.txt'
      reading manifest template 'MANIFEST.in'
      adding license file 'LICENSE'
      adding license file 'license.h'
      adding license file 'COPYING'
      writing manifest file 'PyGLM.egg-info\SOURCES.txt'
      copying glm-stubs\__init__.pyi -> build\lib.win-amd64-pypy39\glm-stubs
      running build_ext
      building 'glm' extension
      creating build\temp.win-amd64-pypy39\Release
      "C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Tools\MSVC\14.29.30133\bin\HostX86\x64\cl.exe" /c /nologo /O2 /W3 /GL /DNDEBUG /MD -Iglm/ -IC:\GitHub\PyKotor\.venv_pypy39\include "-IC:\Program Files\pypy39\include" "-IC:\Program Files\pypy39\Include" "-IC:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Tools\MSVC\14.29.30133\include" "-IC:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\VS\include" "-IC:\Program Files (x86)\Windows Kits\NETFXSDK\4.8\include\um" "-IC:\Program 
Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Tools\MSVC\14.29.30133\include" "-IC:\Program Files (x86)\Windows Kits\NETFXSDK\4.8\include\um" /EHsc /TpPyGLM.cpp /Fobuild\temp.win-amd64-pypy39\Release\PyGLM.obj -std=c++11
      cl : Command line warning D9002 : ignoring unknown option '-std=c++11'
      PyGLM.cpp
      C:\Program Files\pypy39\include\pyconfig.h(59): fatal error C1083: Cannot open include file: 'io.h': No such file or directory
      error: command 'C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\BuildTools\\VC\\Tools\\MSVC\\14.29.30133\\bin\\HostX86\\x64\\cl.exe' failed with exit code 2
      [end of output]

  note: This error originates from a subprocess, and is likely not a problem with pip.     
  ERROR: Failed building wheel for pyglm
Failed to build pyglm
ERROR: ERROR: Failed to build installable wheels for some pyproject.toml based projects (pyglm)


How to fix this error when trying to use pip to build a package? literally anytime it tries to use cl.exe for any package (pyglm is an example, don't focus on pyglm) it fails. WHy..

Do not tell me anything unless you can cite it from multiple sources from the searches

## Assistant

The error you're encountering when trying to use `pip` to build a package on Windows, specifically related to the `cl.exe` compiler, is a common issue. Here are several steps you can take to resolve it:

1. **Ensure Visual Studio Build Tools are Installed**: You need to have the Microsoft C++ Build Tools installed, which include `cl.exe`, the Microsoft C Compiler. Make sure you have installed the "Desktop development with C++" workload from the Visual Studio Installer.[1][5]

2. **Check Environment Variables**: Ensure that the path to `cl.exe` is included in your system's PATH environment variable. This is typically located in a directory like `C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Tools\MSVC\<version>\bin\HostX86\x64`. Using a Developer Command Prompt for Visual Studio can automatically set these environment variables correctly.[5][1]

3. **Install Windows SDK**: The error message mentions a missing `io.h` file, which is part of the Windows SDK. Make sure the Windows 10 SDK is installed along with your Visual Studio Build Tools.[3][7]

4. **Reinstall or Update Components**: Sometimes, reinstalling or updating your Visual Studio Build Tools and Windows SDK can resolve issues with missing files or incorrect configurations.[7][3]

5. **Use Pre-built Binaries**: If building from source continues to fail, consider using pre-built binaries for Python packages when available. Websites like Gohlke's Python Extension Packages for Windows provide `.whl` files that you can download and install using pip without needing to compile from source.[1]

6. **Try Alternative Installation Methods**: If pip fails, consider using alternative package managers like Conda, which might have pre-compiled versions of the libraries you need, reducing dependency on local compilation tools.[1]

By following these steps, you should be able to resolve the issues related to building Python packages that require C/C++ compilation on Windows.

### Sources

- [python pip on Windows - command 'cl.exe' failed - Stack Overflow](https://stackoverflow.com/questions/41724445/python-pip-on-windows-command-cl-exe-failed/41724634)
  - I'm trying to install spaCy using pip install spacy but I'm getting the following error .. I have VS 2015 installed, and I have the following Python install .. 3.5.2 Anaconda 2.5.0 (64-bit) (de...
- [Source installation with windows batch file failed - Image.sc Forum](https://forum.image.sc/t/source-installation-with-windows-batch-file-failed/70961)
  - I have tried to install cellprofiler from source with either git clone or anaconda environmental file (from here and later from newer one)… The issue is attributed to failure to build building wheel for centrosome. I also tried to install through the batch files provide here. It created CP_plugin under miniconda environment; however, the similar issues on building centrosome and python-javabridge still happened, and cellprofiler was not installed. The error message looks like below (I...
- [Where is io.h file used as an #include in pyconfig.h (Python 3.12)](https://discuss.python.org/t/where-is-io-h-file-used-as-an-include-in-pyconfig-h-python-3-12/38578)
  - I was trying to run pip install gdal in Windows 10, using Python 3.12, and got this error (some stuff)\Python312\include\pyconfig.h(59): fatal error C1083: Cannot open include file: ‘io.h’: No such file or directory Where can I find this file?
- [Cannot open include file: 'io.h': No such file or directory ... - GitHub](https://github.com/conda-forge/miniforge/issues/558)
  - Solution to issue cannot be found in the documentation. I checked the documentation. Issue Can't start any kernel File "C:\ProgramData\miniforge-pypy3\lib\site-packages\psutil\init.py", line 10...
- [Python pip on Windows - command cl exe failed | Edureka Community](https://www.edureka.co/community/174729/python-pip-on-windows-command-cl-exe-failed)
  - I wanted to install spaCy using pip install spacy. But met with an error. I have VS 2015 ... (AMD64)] Can someone help me solve this issue?
- [Can't install ta-lib - Python discussion](https://discuss.python.org/t/cant-install-ta-lib/55028)
  - when I use ‘pip install TA-lib’ raise an error, I’m using an env of python311 and pip works fine with other libs. This is the output: Using cached TA-Lib-0.4.30.tar.gz (368 kB) Installing build dependencies ... done Getting requirements to build wheel ... done Installing backend dependencies ... done Preparing metadata (pyproject.toml) ... done Requirement already satisfied: numpy in c:\users\lyx\desktop\reci\env\lib\site-packages (from ta-lib) (1.26.4) Building wheels for collected pa...
- [Cannot open include file: 'io.h': No such file or directory](https://stackoverflow.com/questions/40018405/cannot-open-include-file-io-h-no-such-file-or-directory)
  - I was trying to compile a simple .pyx file using Cython. print("hello") Here's my setup.py: from distutils.core import setup from Cython.Build import cythonize setup( ext_modules = cythonize("
- [python pip on Windows - command 'cl.exe' failed - YouTube](https://www.youtube.com/watch?v=7CGT-urJgOI)
  - python: python pip on Windows - command 'cl.exe' failed Thanks for taking the time to learn more. In this video I'll go through your question, provide various answers & hopefully this will lead to your solution! Remember to always stay just a little bit crazy like me, and get through to the end resolution. Don't forget at any stage just hit pause on the video if the question & answers are going too fast. Content (except music & images) licensed under CC BY-SA...
- [Pip install results in this error " cl.exe' failed with exit code 2 "](https://stackoverflow.com/questions/71242919/pip-install-results-in-this-error-cl-exe-failed-with-exit-code-2)
  - I've read all of the other questions on this error and frustratingly enough, none give a solution that works. If I run pip install sentencepiece in the cmd line, it gives me the following output. ...
- [Visual Studio file can't be found from pip install command](https://learn.microsoft.com/en-us/answers/questions/1614029/visual-studio-file-cant-be-found-from-pip-install)
  - I'm trying to install 'lws' using pip, but when I run "pip install lws" I get an error, saying lws.bycython.cpp(196): fatal error C1083: Cannot open include file: 'longintrepr.h': No such file or directory " lws.bycython.cpp(196): fatal…
