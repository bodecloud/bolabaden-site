---
source_url: "https://www.perplexity.ai/search/cc94c8b8-1788-4adf-871c-f5c53b39ceee"
thread_uuid: "43c9aad9-2aac-4cec-97d1-5bafee1089f4"
slug: "cc94c8b8-1788-4adf-871c-f5c53b39ceee"
title: "what specifically do I need to install to fix this on windows?
```
The following warnings were emitted during compilation:

warning: msvc_spectre_libs@0.1.2: No spectre-mitigated libs were found. Please modify the VS Installation to add these.

error: failed to run custom build command for `msvc_spectre_libs v0.1.2`

Caused by:
  process didn't exit successfully: `C:\GitHub\zed\target\release\build\msvc_spectre_libs-3115f76aad5500a1\build-script-build` (exit code: 101)
  --- stdout
  cargo:warning=No spectre-mitigated libs were found. Please modify the VS Installation to add these.

  --- stderr
  thread 'main' panicked at C:\Users\boden\.cargo\registry\src\index.crates.io-6f17d22bba15001f\msvc_spectre_libs-0.1.2\build.rs:37:13:
  No spectre-mitigated libs were found. Please modify the VS Installation to add these.
  note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
warning: build failed, waiting for other jobs to finish...
    Building [================>       ] 913/1219: clap_builder
```"
extracted_at: "2026-06-29T12:53:17.365Z"
matched_keywords: ["fallback"]
entry_count: 1
provenance: perplexity-rest-api
---

# what specifically do I need to install to fix this on windows?
```
The following warnings were emitted during compilation:

warning: msvc_spectre_libs@0.1.2: No spectre-mitigated libs were found. Please modify the VS Installation to add these.

error: failed to run custom build command for `msvc_spectre_libs v0.1.2`

Caused by:
  process didn't exit successfully: `C:\GitHub\zed\target\release\build\msvc_spectre_libs-3115f76aad5500a1\build-script-build` (exit code: 101)
  --- stdout
  cargo:warning=No spectre-mitigated libs were found. Please modify the VS Installation to add these.

  --- stderr
  thread 'main' panicked at C:\Users\boden\.cargo\registry\src\index.crates.io-6f17d22bba15001f\msvc_spectre_libs-0.1.2\build.rs:37:13:
  No spectre-mitigated libs were found. Please modify the VS Installation to add these.
  note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
warning: build failed, waiting for other jobs to finish...
    Building [================>       ] 913/1219: clap_builder
```

Source: [Perplexity thread](https://www.perplexity.ai/search/cc94c8b8-1788-4adf-871c-f5c53b39ceee)

## User

what specifically do I need to install to fix this on windows?
```
The following warnings were emitted during compilation:

warning: msvc_spectre_libs@0.1.2: No spectre-mitigated libs were found. Please modify the VS Installation to add these.

error: failed to run custom build command for `msvc_spectre_libs v0.1.2`

Caused by:
  process didn't exit successfully: `C:\GitHub\zed\target\release\build\msvc_spectre_libs-3115f76aad5500a1\build-script-build` (exit code: 101)
  --- stdout
  cargo:warning=No spectre-mitigated libs were found. Please modify the VS Installation to add these.

  --- stderr
  thread 'main' panicked at C:\Users\boden\.cargo\registry\src\index.crates.io-6f17d22bba15001f\msvc_spectre_libs-0.1.2\build.rs:37:13:
  No spectre-mitigated libs were found. Please modify the VS Installation to add these.
  note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
warning: build failed, waiting for other jobs to finish...
    Building [================>       ] 913/1219: clap_builder
```

## Assistant

To fix this issue on Windows, you need to install the Spectre-mitigated libraries for Visual Studio. Here's what you need to do:

1. Open the Visual Studio Installer.

2. Click on "Modify" for your installed version of Visual Studio.

3. Go to the "Individual Components" tab.

4. Search for "Spectre" in the search box.

5. Look for and select the following components:

   - "MSVC v142 - VS 2019 C++ x64/x86 Spectre-mitigated libs (latest)"
   - "MSVC v143 - VS 2022 C++ x64/x86 Spectre-mitigated libs (latest)"

   Make sure to select the versions that match your Visual Studio installation and the architectures you're targeting (x64 and/or x86).

6. If you're using MFC or ATL, also select:

   - "C++ MFC for latest v142 build tools with Spectre Mitigations (x86 & x64)"
   - "C++ ATL for latest v142 build tools with Spectre Mitigations (x86 & x64)"

7. Click "Modify" to install the selected components.

8. After installation, restart Visual Studio and rebuild your project.

If you're using an older version of Visual Studio, look for similar components with "Spectre-mitigated" in their names for your specific version.[1][6]

After installing these components, the Spectre-mitigated libraries should be available, and the error you're encountering should be resolved. If you continue to face issues, ensure that your project is configured to use the correct toolset version that matches the installed Spectre-mitigated libraries.[7]

### Sources

- [/Qspectre | Microsoft Learn](https://learn.microsoft.com/en-us/cpp/build/reference/qspectre?view=msvc-170&viewFallbackFrom=vs-2017)
  - Learn more about: /Qspectre
- [Running Visual Studio Code on Windows](https://code.visualstudio.com/docs/setup/windows)
  - Get Visual Studio Code up and running on Windows
- [Visual Studio 2022 System Requirements - Microsoft Learn](https://learn.microsoft.com/en-gb/visualstudio/releases/2022/system-requirements)
  - Find the minimum system requirements, supported hardware, and languages for the Visual Studio 2022 product family.
- [Visual Studio 2015 Update 3 Spectre Variant 1 Toolset (/Qspectre)](https://support.microsoft.com/en-us/topic/visual-studio-2015-update-3-spectre-variant-1-toolset-qspectre-ef512831-2af0-518d-d0fd-ac3c96dc73d7)
  - Describes updates for developers to help incorporate Spectre-mitigated libraries into code that operates across trust boundaries.
- [Installation on Windows - XtalOpt](https://xtalopt.github.io/install-win.html)
  - How to install XtalOpt on a Windows machine.
- [MSBuild error MSB8040 - Microsoft Learn](https://learn.microsoft.com/nl-nl/visualstudio/msbuild/errors/msb8040?view=vs-2022)
  - MSBuild error MSB8040 occurs when using Spectre-mitigated libraries is requested, but Spectre-mitigated libraries aren't installed.
- [Spectre mitigations in MSVC - C++ Team Blog](https://devblogs.microsoft.com/cppblog/spectre-mitigations-in-msvc/)
  - Update 20 April 2018 With Visual Studio 2017 version 15.7 Preview 4 we have added a new warning, C5045, that shows what patterns in your code would have caused a mitigation to be inserted. See this post for more details. Update 4 April 2018 With Visual Studio 2017 version 15.7 Preview 3 we have two […]
- [Additional spectre mitigated libraries on Visual Studio 2019 #3027](https://github.com/appveyor/ci/issues/3027)
  - When building an application using the Appveyor Visual Studio 2019 image, the following message appears and the build fails: C:\Program Files (x86)\Microsoft Visual Studio\2019\Preview\MSBuild\Micr...
- [error MSB8040: Spectre-mitigated libraries are required for this project](https://stackoverflow.com/questions/59479631/error-msb8040-spectre-mitigated-libraries-are-required-for-this-project)
  - I have a problem that I cannot solve. My code: #include "ntddk.h" #include <stdlib.h> NTSTATUS DriverEntry(IN PDRIVER_OBJECT theDriverObject, IN PUNICODE_STRING theRegistryPath) {
- [Spectre-mitigated libraries installed but not found](https://developercommunity.visualstudio.com/t/Spectre-mitigated-libraries-installed-bu/10741113?sort=active)
