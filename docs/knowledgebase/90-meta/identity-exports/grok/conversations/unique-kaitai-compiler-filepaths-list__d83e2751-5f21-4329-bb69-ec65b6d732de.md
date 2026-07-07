---
source_url: "https://grok.com/c/d83e2751-5f21-4329-bb69-ec65b6d732de"
conversation_id: "d83e2751-5f21-4329-bb69-ec65b6d732de"
title: "Unique Kaitai Compiler Filepaths List"
extracted_at: "2026-06-29T16:32:57.932Z"
message_count: 8
export_suite: "identity"
provenance: grok-rest-api
---

# Unique Kaitai Compiler Filepaths List

Source: [Grok conversation](https://grok.com/c/d83e2751-5f21-4329-bb69-ec65b6d732de)

## User

_Time: 2025-12-25T19:01:17.146Z_

Condense this down to just a list of unique filepaths.

## Assistant

_Time: 2025-12-25T19:01:21.970Z_

- ~/.local/bin/kaitai-struct-compiler
- /usr/bin/kaitai-struct-compiler
- /usr/local/bin/kaitai-struct-compiler
- /opt/kaitai-struct-compiler/bin/kaitai-struct-compiler
- C:\Program Files\kaitai-struct-compiler\kaitai-struct-compiler.exe
- C:\Program Files\kaitai-struct-compiler\kaitai-struct-compiler.jar
- C:\Program Files\kaitai-struct-compiler\bin\kaitai-struct-compiler.bat
- C:\Program Files\kaitai-struct-compiler\bin\kaitai-struct-compiler.exe
- C:\Program Files (x86)\kaitai-struct-compiler\kaitai-struct-compiler.exe
- C:\Program Files (x86)\kaitai-struct-compiler\kaitai-struct-compiler.jar
- C:\Program Files (x86)\kaitai-struct-compiler\bin\kaitai-struct-compiler.bat
- C:\Program Files (x86)\kaitai-struct-compiler\bin\kaitai-struct-compiler.exe
- %USERPROFILE%\.local\bin\kaitai-struct-compiler
- %USERPROFILE%\.kaitai\kaitai-struct-compiler.jar
- %LOCALAPPDATA%\kaitai-struct-compiler.jar
- %USERPROFILE%\kaitai-struct-compiler.jar
- AppContext.BaseDirectory\kaitai-struct-compiler.jar
- AppContext.BaseDirectory\..\kaitai-struct-compiler.jar

## User

_Time: 2025-12-25T19:01:51.818Z_

Condense this down to just a list of unique filepaths.

Currently we have a ton of them:

```
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:            "test_files", "kaitai_are_compiled"
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments} 
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:            result = RunCommand("kaitai-struct-compiler.jar", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe"
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..", 
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:            "test_files", "kaitai_dlg_compiled"
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:            var kscCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:            kscCheck = RunCommand("kaitai-struct-compiler.jar",
"--version");
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:            result = RunCommand("kaitai-struct-compiler.jar", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..", 
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:            "test_files", "kaitai_cnv_compiled"
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:            result = RunCommand("kaitai-struct-compiler.jar", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:            var directCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:                return "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:            const string downloadUrl =
"https://github.com/kaitai-io/kaitai_struct_compiler/releases/download/" + version + "/kaitai-struct-compiler-" + version + ".zip"; 
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:                    installDir = Path.Combine(workspaceRoot, ".kaitai");     
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:                    installDir = Path.Combine(Path.GetTempPath(),
".kaitai");
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:                installDir = Path.Combine(userProfile, ".kaitai");
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:            var jarPath = Path.Combine(installDir,
"kaitai-struct-compiler.jar");
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:            var zipPath = Path.Combine(Path.GetTempPath(),
$"kaitai-struct-compiler-{version}.zip");
Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs:                var extractDir = Path.Combine(Path.GetTempPath(),
$"kaitai-struct-compiler-{version}-extract");
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:            "test_files", "kaitai_git_compiled"
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                $"scripts\\install_kaitai_compiler.ps1. For CI/CD, ensure    
compiler is installed in the build environment.");
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:            var cmdCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                detection.Path = "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                detection.DetectionMethod = "command
(kaitai-struct-compiler in PATH)";
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:            cmdCheck = RunCommand("kaitai-struct-compiler.jar",
"--version");
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                detection.Path = "kaitai-struct-compiler.jar";
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                detection.DetectionMethod = "command
(kaitai-struct-compiler.jar in PATH)";
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                new { Path =
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"), IsJar =  
false },
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                new { Path =
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"), IsJar = false },
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                new { Path =
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"), IsJar = false },
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                new { Path =
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"), IsJar =    
true },
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                new { Path =
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"), IsJar = true },
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                new { Path =
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"), IsJar = true },
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                new { Path =
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"), IsJar = true },
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:            result = RunCommand("kaitai-struct-compiler.jar", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:            // These locations match the installation paths used by
SetupKaitaiCompiler.ps1 and install_kaitai_compiler.ps1
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:            "test_files", "kaitai_compiled"
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:                "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.bat");
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:                "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.bat");
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:                var result = RunCommand("kaitai-struct-compiler",
$"--version");
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:                "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.bat");
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:            var result2 = RunCommand("kaitai-struct-compiler",
$"{arguments} -d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:            result2 = RunCommand("kaitai-struct-compiler.jar",
$"{arguments} -d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\GFFFormatTests.cs:            string outputDir = Path.Combine(Path.GetTempPath(), "gff_kaitai_test",   
language);
Tests\Andastra.Tests\Formats\GFFFormatTests.cs:            // Try common locations for kaitai-struct-compiler
Tests\Andastra.Tests\Formats\GFFFormatTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GFFFormatTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GFFFormatTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GFFFormatTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.exe")
Tests\Andastra.Tests\Formats\GFFFormatTests.cs:                ".local", "share", "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:        private static readonly string CompilerOutputDir =
Path.Combine(Path.GetTempPath(), "kaitai_erf_tests");
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:            // Test that kaitai-struct-compiler is available
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:            compilerPath.Should().NotBeNullOrEmpty("kaitai-struct-compiler 
should be available in PATH or common locations");
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                    process.ExitCode.Should().Be(0, "kaitai-struct-compiler  
should execute successfully");
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                $"kaitai-struct-compiler should compile ERF.ksy to
{language} successfully. " +
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:            // Check if kaitaistruct library is available
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:            bool kaitaiAvailable =
CheckKaitaiStructLibraryAvailable(pythonPath);
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:            if (!kaitaiAvailable)
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                // kaitaistruct not available - skip actual parser
validation but test compilation succeeded
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:            string scriptPath = Path.Combine(Path.GetTempPath(),
"erf_kaitai_validation_" + Guid.NewGuid().ToString("N") + ".py");
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe"
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                // Check if kaitaistruct module can be imported
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:                    Arguments = "-c \"import kaitaistruct; print('OK')\"",   
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:            script.AppendLine("    import kaitaistruct");
Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs:            script.AppendLine($"        erf_data =
{GetClassNameFromModule(moduleName)}(kaitaistruct.KaitaiStream(f))");
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:        private static readonly string CompilerOutputDir =
Path.Combine(Path.GetTempPath(), "kaitai_gui_tests");
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:            // Test that kaitai-struct-compiler is available
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:            compilerPath.Should().NotBeNullOrEmpty("kaitai-struct-compiler   
should be available in PATH or common locations");
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:                    process.ExitCode.Should().Be(0, "kaitai-struct-compiler  
should execute successfully");
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:            // Actually use the generated parser to validate it works with   
Python runtime and kaitaistruct library
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:            // Check if kaitaistruct library is available
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:                return; // Skip if kaitaistruct library not available        
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:            string npmModulePath = Path.Combine(npmGlobalPath,
"node_modules", "kaitai-struct-compiler");
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:            string npmCmdPath = Path.Combine(npmGlobalPath,
"kaitai-struct-compiler.cmd");
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:            string npmJsPath = Path.Combine(npmModulePath,
"kaitai-struct-compiler.js");
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:                @"C:\Program Files
(x86)\kaitai-struct-compiler\bin\kaitai-struct-compiler.bat",
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.bat"),
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe"
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:                // Try to import kaitaistruct to check if it's installed     
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:                    Arguments = "-c \"import kaitai_struct; print('ok')\"",  
Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs:    from kaitai_struct import KaitaiStream, BytesIO
Tests\Andastra.Tests\Formats\GITKaitaiStructTests.cs:            "kaitai_compiled", "git");
Tests\Andastra.Tests\Formats\GITKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GITKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GITKaitaiStructTests.cs:                        FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GITKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GITKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GITKaitaiStructTests.cs:                        FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GITKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GITKaitaiStructTests.cs:                        FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:            "kaitai_compiled", "gui");
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:            // Check if kaitai-struct-compiler is available
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                var cmdCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                compilerPath = "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                var cmdCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                compilerPath = "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                var cmdCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                compilerPath = "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                var cmdCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                compilerPath = "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments}    
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                var cmdCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs:                compilerPath = "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\IFOKaitaiCompilerTests.cs:            "test_files", "kaitai_ifo_compiled"
Tests\Andastra.Tests\Formats\IFOKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\IFOKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\IFOKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\IFOKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\IFOKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\IFOKaitaiCompilerTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe"
Tests\Andastra.Tests\Formats\IFOKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\IFOKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\IFOKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\IFOKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:            "kaitai_compiled", "jrl");
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:            // Check if kaitai-struct-compiler is available
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:                var cmdCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:                compilerPath = "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments}    
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe"
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:            "test_files", "kaitai_lyt_compiled"
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:            // Test that kaitai-struct-compiler is available
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                    process.ExitCode.Should().Be(0, "kaitai-struct-compiler    
should execute successfully");
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments}    
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:            result = RunCommand("kaitai-struct-compiler.jar", $"{arguments}    
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe"
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:        private static readonly string CompilerOutputDir =
Path.Combine(Path.GetTempPath(), "kaitai_mdl_tests");
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:            // Test that kaitai-struct-compiler is available
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:                    process.ExitCode.Should().Be(0, "kaitai-struct-compiler  
should execute successfully");
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:                Path.Combine(npmPrefix, "kaitai-struct-compiler.cmd"),       
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:                Path.Combine(npmPrefix, "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler"
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:                "kaitai-struct-compiler.jar"
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:                            Arguments = $"-cp \"{jarPath}\"
io.kaitai.struct.Main --version",
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:                                    return $"java -cp \"{jarPath}\"
io.kaitai.struct.Main";
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:            var nodeModulesPath = Path.Combine(npmGlobalRoot,
"node_modules", "kaitai-struct-compiler");
Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs:            var compilerJs = Path.Combine(nodeModulesPath,
"kaitai-struct-compiler.js");
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:            "kaitai_compiled", "ltr");
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                var cmdCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                var cmdCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                compilerPath = "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                var cmdCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                compilerPath = "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                    arguments = $"-cp \"{classpath}\"
io.kaitai.struct.JavaMain -t {language} \"{normalizedKsyPath}\" -d \"{langOutputDir}\"";
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                Path.Combine(Path.GetTempPath(), "kaitai-extract",
"kaitai-struct-compiler-0.10", "lib", "io.kaitai.kaitai-struct-compiler-0.10.jar"),
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                        var cmdCheck = RunCommand("kaitai-struct-compiler",    
"--version");
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                        compilerPath = "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                var cmdCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                compilerPath = "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:                    arguments = $"-cp \"{classpath}\"
io.kaitai.struct.JavaMain -t python \"{normalizedKsyPath}\" -d \"{pythonOutputDir}\"";
Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs:    from kaitai_struct import KaitaiStream, BytesIO
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:        private static readonly string CompilerOutputDir =
Path.Combine(Path.GetTempPath(), "kaitai_mdx_tests");
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:            // Test that kaitai-struct-compiler is available
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:                    process.ExitCode.Should().Be(0, "kaitai-struct-compiler  
should execute successfully");
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:                Path.Combine(npmPrefix, "kaitai-struct-compiler.cmd"),       
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:                Path.Combine(npmPrefix, "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler"
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:                "kaitai-struct-compiler.jar"
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:                            Arguments = $"-cp \"{jarPath}\"
io.kaitai.struct.Main --version",
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:                                    return $"java -cp \"{jarPath}\"
io.kaitai.struct.Main";
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:            var nodeModulesPath = Path.Combine(npmGlobalRoot,
"node_modules", "kaitai-struct-compiler");
Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs:            var compilerJs = Path.Combine(nodeModulesPath,
"kaitai-struct-compiler.js");
Tests\Andastra.Tests\Formats\NCSKaitaiStructTests.cs:            "kaitai_compiled", "ncs");
Tests\Andastra.Tests\Formats\NCSKaitaiStructTests.cs:            var windowsPath = @"C:\Program Files
(x86)\kaitai-struct-compiler\bin\kaitai-struct-compiler.bat";
Tests\Andastra.Tests\Formats\NCSKaitaiStructTests.cs:                        FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\NCSKaitaiStructTests.cs:                    return "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\NCSKaitaiCompilerTests.cs:        private static readonly string CompilerOutputDir =
Path.Combine(Path.GetTempPath(), "kaitai_ncs_tests");
Tests\Andastra.Tests\Formats\NCSKaitaiCompilerTests.cs:            compilerPath.Should().NotBeNullOrEmpty("kaitai-struct-compiler   
should be available in PATH or common locations");
Tests\Andastra.Tests\Formats\NCSKaitaiCompilerTests.cs:                    process.ExitCode.Should().Be(0, "kaitai-struct-compiler  
should execute successfully");
Tests\Andastra.Tests\Formats\NCSKaitaiCompilerTests.cs:                $"kaitai-struct-compiler should compile NCS.ksy to
{language} successfully. " +
Tests\Andastra.Tests\Formats\NCSKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\NCSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\NCSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\NCSKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\NCSKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\NCSKaitaiCompilerTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe"
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:            "test_files", "kaitai_ncs_compiled"
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:            var directCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:                return "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:            const string downloadUrl =
"https://github.com/kaitai-io/kaitai_struct_compiler/releases/download/" + version + "/kaitai-struct-compiler-" + version + ".zip"; 
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:                    installDir = Path.Combine(workspaceRoot, ".kaitai");    
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:                    installDir = Path.Combine(Path.GetTempPath(),
".kaitai");
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:                installDir = Path.Combine(userProfile, ".kaitai");
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:            var jarPath = Path.Combine(installDir,
"kaitai-struct-compiler.jar");
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:            var zipPath = Path.Combine(Path.GetTempPath(),
$"kaitai-struct-compiler-{version}.zip");
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:                var extractDir = Path.Combine(Path.GetTempPath(),
$"kaitai-struct-compiler-{version}-extract");
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:            var result = RunCommand("kaitai-struct-compiler",
$"{arguments} -d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:            result = RunCommand("kaitai-struct-compiler.jar",
$"{arguments} -d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:            "test_files", "kaitai_nss_compiled"
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:            result = RunCommand("kaitai-struct-compiler.jar", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..", 
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:            var directCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:                return "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:            const string downloadUrl =
"https://github.com/kaitai-io/kaitai_struct_compiler/releases/download/" + version + "/kaitai-struct-compiler-" + version + ".zip"; 
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:                    installDir = Path.Combine(workspaceRoot, ".kaitai");     
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:                    installDir = Path.Combine(Path.GetTempPath(),
".kaitai");
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:                installDir = Path.Combine(userProfile, ".kaitai");
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:            var jarPath = Path.Combine(installDir,
"kaitai-struct-compiler.jar");
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:            var zipPath = Path.Combine(Path.GetTempPath(),
$"kaitai-struct-compiler-{version}.zip");
Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs:                var extractDir = Path.Combine(Path.GetTempPath(),
$"kaitai-struct-compiler-{version}-extract");
Tests\Andastra.Tests\Formats\NFOKaitaiStructTests.cs:            "kaitai_compiled", "nfo");
Tests\Andastra.Tests\Formats\NFOKaitaiStructTests.cs:            // Check if kaitai-struct-compiler is available
Tests\Andastra.Tests\Formats\NFOKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\NFOKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\NFOKaitaiStructTests.cs:                string compilerCmd = "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\NFOKaitaiStructTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments}    
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\NFOKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NFOKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NFOKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NFOKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NFOKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\NSSKaitaiStructTests.cs:            "kaitai_compiled", "nss");
Tests\Andastra.Tests\Formats\NSSKaitaiStructTests.cs:            var windowsPath = @"C:\Program Files
(x86)\kaitai-struct-compiler\bin\kaitai-struct-compiler.bat";
Tests\Andastra.Tests\Formats\NSSKaitaiStructTests.cs:                        FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\NSSKaitaiStructTests.cs:                    return "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\PCCKaitaiCompilerTests.cs:            "test_files", "kaitai_pcc_compiled"
Tests\Andastra.Tests\Formats\PCCKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\PCCKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\PCCKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\PCCKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\PCCKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\PCCKaitaiCompilerTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe"
Tests\Andastra.Tests\Formats\PCCKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\PCCKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\PCCKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\PCCKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\PCCKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs:            "test_files", "kaitai_pth_compiled"
Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs:                        "Please install kaitai-struct-compiler in the CI/CD  
pipeline. " +
Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs:                        "Installation instructions:
https://kaitai.io/#download " +
Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe"
Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\SSFKaitaiStructTests.cs:            "test_files", "kaitai_compiled", "ssf"
Tests\Andastra.Tests\Formats\SSFKaitaiStructTests.cs:            var kscCheck = RunCommand("kaitai-struct-compiler", "--version");  
Tests\Andastra.Tests\Formats\SSFKaitaiStructTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments}    
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\SSFKaitaiStructTests.cs:            result = RunCommand("kaitai-struct-compiler.jar", $"{arguments}    
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\SSFKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\SSFKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\SSFKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\SSFKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\SSFKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\SSFKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\SSFKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\SSFKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:            "test_files", "kaitai_rim_compiled"
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                var errorMessage = "Kaitai Struct compiler
(kaitai-struct-compiler) was not found in any common installation location or PATH. " +
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                        "  - Windows: Install from
https://github.com/kaitai-io/kaitai_struct_compiler/releases or use Chocolatey: choco install kaitai-struct-compiler" +
Environment.NewLine +
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                        "  - macOS: Install via Homebrew: brew install       
kaitai-struct-compiler" + Environment.NewLine +
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                        "  - Or set KAITAI_COMPILER_JAR environment
variable pointing to kaitai-struct-compiler.jar";
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                        "  - Windows: Download from
https://github.com/kaitai-io/kaitai_struct_compiler/releases or use Chocolatey: choco install kaitai-struct-compiler" +
Environment.NewLine +
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                        "  - Linux: Install via package manager (e.g.,       
apt-get install kaitai-struct-compiler) or download JAR" + Environment.NewLine +
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                        "  - macOS: Install via Homebrew: brew install       
kaitai-struct-compiler" + Environment.NewLine +
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:            var windowsPath = @"C:\Program Files
(x86)\kaitai-struct-compiler\bin\kaitai-struct-compiler.bat";
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:            result = RunCommand("kaitai-struct-compiler.jar", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.bat"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                @"C:\Program Files
(x86)\kaitai-struct-compiler\bin\kaitai-struct-compiler.bat",
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                @"C:\Program
Files\kaitai-struct-compiler\bin\kaitai-struct-compiler.bat",
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                @"C:\Program
Files\kaitai-struct-compiler\kaitai-struct-compiler.exe",
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.bat"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.bat"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                "/opt/kaitai-struct-compiler/bin/kaitai-struct-compiler",    
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                        Path.Combine(npmPath,
"kaitai-struct-compiler.cmd"), // Windows npm
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                        Path.Combine(npmPath, "kaitai-struct-compiler"), //  
Unix npm
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                        Path.Combine(npmPath, "node_modules",
"kaitai-struct-compiler", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:        private static readonly string CompilerOutputDir =
Path.Combine(Path.GetTempPath(), "kaitai_tpc_tests");
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:            // Test that kaitai-struct-compiler is available
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:            compilerPath.Should().NotBeNullOrEmpty("kaitai-struct-compiler   
should be available in PATH or common locations");
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                    process.ExitCode.Should().Be(0, "kaitai-struct-compiler  
should execute successfully");
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                $"kaitai-struct-compiler should compile {formatName}.ksy to 
{language} successfully. " +
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe",
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler"
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                
Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location), "kaitai-struct-compiler.jar")       
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:            string tempTpcFile = Path.Combine(Path.GetTempPath(),
$"tpc_kaitai_test_{Guid.NewGuid()}.tpc");
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:                    "..", "..", "..", "..", "src", "Andastra", "Tests",      
"Formats", "validate_kaitai_parser.py");
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:            [JsonPropertyName("kaitai_parser")]
Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs:            [JsonPropertyName("kaitai")]
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:            "test_files", "kaitai_compiled"
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:        private static readonly string CompilerOutputDir =
Path.Combine(Path.GetTempPath(), "kaitai_tlk_tests");
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:            // Test that kaitai-struct-compiler is available
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:            compilerPath.Should().NotBeNullOrEmpty("kaitai-struct-compiler   
should be available in PATH or common locations");
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:                    process.ExitCode.Should().Be(0, "kaitai-struct-compiler  
should execute successfully");
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:            var windowsPath = @"C:\Program Files
(x86)\kaitai-struct-compiler\bin\kaitai-struct-compiler.bat";
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.bat"),
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe"
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TwoDAKaitaiStructTests.cs:            "kaitai_compiled", "twoda");
Tests\Andastra.Tests\Formats\TwoDAKaitaiStructTests.cs:            var windowsPath = @"C:\Program Files
(x86)\kaitai-struct-compiler\bin\kaitai-struct-compiler.bat";
Tests\Andastra.Tests\Formats\TwoDAKaitaiStructTests.cs:                    return "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\UTDKaitaiCompilerTests.cs:            "test_files", "kaitai_compiled", "utd"
Tests\Andastra.Tests\Formats\UTDKaitaiCompilerTests.cs:            var kscCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\UTDKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTDKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTDKaitaiCompilerTests.cs:                "kaitai-struct-compiler.jar"
Tests\Andastra.Tests\Formats\UTDKaitaiCompilerTests.cs:            var check = RunCommand("kaitai-struct-compiler", "--version");   
Tests\Andastra.Tests\Formats\UTDKaitaiCompilerTests.cs:                return "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\UTDKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTDKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTDKaitaiCompilerTests.cs:                "kaitai-struct-compiler.jar"
Tests\Andastra.Tests\Formats\TwoDAKaitaiCompilerTests.cs:            "test_files", "kaitai_compiled", "twoda"
Tests\Andastra.Tests\Formats\TwoDAKaitaiCompilerTests.cs:            var kscCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\TwoDAKaitaiCompilerTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\TwoDAKaitaiCompilerTests.cs:            var result = RunCommand("kaitai-struct-compiler",
$"{arguments} -d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\TwoDAKaitaiCompilerTests.cs:            result = RunCommand("kaitai-struct-compiler.jar",
$"{arguments} -d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\TwoDAKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\TwoDAKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TwoDAKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TwoDAKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TwoDAKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TwoDAKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TwoDAKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\TwoDAKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTDKaitaiStructTests.cs:            "kaitai_compiled", "utd");
Tests\Andastra.Tests\Formats\UTDKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTDKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTDKaitaiStructTests.cs:                        FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTDKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTDKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTDKaitaiStructTests.cs:                        FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:            "kaitai_compiled", "ute");
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:            // Check if kaitai-struct-compiler is available
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                var cmdCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                compilerPath = "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments}    
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                @"C:\Program Files
(x86)\kaitai-struct-compiler\bin\kaitai-struct-compiler.bat",
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.bat"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe"
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                    !Path.GetFileName(f).ToLower().Contains("kaitai") &&       
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:            string kaitaiRuntimeJar = FindKaitaiStructRuntimeJar();
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:            if (string.IsNullOrEmpty(kaitaiRuntimeJar))
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                kaitaiRuntimeJar = "";
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:            {(string.IsNullOrEmpty(parserPackage) ? parserClassName :
$"{parserPackage}.{parserClassName}")} ute = new {(string.IsNullOrEmpty(parserPackage) ? parserClassName :
$"{parserPackage}.{parserClassName}")}(new io.kaitai.struct.ByteBufferKaitaiStream(data));
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                string classpath = string.IsNullOrEmpty(kaitaiRuntimeJar)      
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                    : $"{compileDir}{Path.PathSeparator}{kaitaiRuntimeJar}";   
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                string classpathForExecution =
string.IsNullOrEmpty(kaitaiRuntimeJar)
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                    : $"{compileDir}{Path.PathSeparator}{kaitaiRuntimeJar}";   
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-runtime.jar"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-runtime.jar"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-runtime.jar"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-runtime.jar"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-runtime.jar"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".m2", "repository", "io", "kaitai",
"kaitai-struct-runtime", "0.9", "kaitai-struct-runtime-0.9.jar"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".m2", "repository", "io", "kaitai",
"kaitai-struct-runtime", "0.10", "kaitai-struct-runtime-0.10.jar"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".m2", "repository", "io", "kaitai",
"kaitai-struct-runtime", "0.11", "kaitai-struct-runtime-0.11.jar"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".m2", "repository", "io", "kaitai",
"kaitai-struct-runtime", "0.12", "kaitai-struct-runtime-0.12.jar"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                    !Path.GetFileName(f).ToLower().Contains("kaitai") &&       
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:            string kaitaiRuntimeDll = FindKaitaiStructCSharpRuntime();
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:            if (string.IsNullOrEmpty(kaitaiRuntimeDll))
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                kaitaiRuntimeDll = "";
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:{(string.IsNullOrEmpty(kaitaiRuntimeDll) ? "" : "// Runtime DLL: " + 
kaitaiRuntimeDll)}
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:  {(string.IsNullOrEmpty(kaitaiRuntimeDll) ? "" : $@"<ItemGroup>
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:      <HintPath>{kaitaiRuntimeDll}</HintPath>
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                        if (!string.IsNullOrEmpty(kaitaiRuntimeDll))
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:      <HintPath>{kaitaiRuntimeDll}</HintPath>
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                    if (!string.IsNullOrEmpty(kaitaiRuntimeDll) &&
File.Exists(kaitaiRuntimeDll))
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                        references.Add($"-reference:\"{kaitaiRuntimeDll}\"");  
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                        if (!string.IsNullOrEmpty(kaitaiRuntimeDll))
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".nuget", "packages", "kaitai.struct.runtime",       
"0.9", "lib", "netstandard2.0", "KaitaiStruct.Runtime.dll"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".nuget", "packages", "kaitai.struct.runtime",       
"0.10", "lib", "netstandard2.0", "KaitaiStruct.Runtime.dll"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".nuget", "packages", "kaitai.struct.runtime",       
"0.11", "lib", "netstandard2.0", "KaitaiStruct.Runtime.dll"),
Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".nuget", "packages", "kaitai.struct.runtime",       
"0.12", "lib", "netstandard2.0", "KaitaiStruct.Runtime.dll"),
Tests\Andastra.Tests\Formats\UTIKaitaiStructTests.cs:            "kaitai_compiled", "uti");
Tests\Andastra.Tests\Formats\UTIKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTIKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTIKaitaiStructTests.cs:                        FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTIKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTIKaitaiStructTests.cs:                    FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTIKaitaiStructTests.cs:                        FileName = "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:        private static readonly string CompilerOutputDir =
Path.Combine(Path.GetTempPath(), "kaitai_uti_tests");
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:            // Test that kaitai-struct-compiler is available
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:            compilerPath.Should().NotBeNullOrEmpty("kaitai-struct-compiler   
should be available in PATH or common locations");
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                    process.ExitCode.Should().Be(0, "kaitai-struct-compiler  
should execute successfully");
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                $"kaitai-struct-compiler should compile UTI.ksy to
{language} successfully. " +
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:            // Check/install kaitaistruct library
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:            bool kaitaiAvailable = CheckKaitaiStructLibrary(pythonExe);      
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:            if (!kaitaiAvailable)
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                // Try to install kaitaistruct
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                    // Skip if kaitaistruct not available and couldn't be    
installed
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe"
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:        /// Checks if kaitaistruct library is available in Python.
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                var result = RunCommand(pythonExe, "-c \"import
kaitaistruct; print('ok')\"");
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:        /// Attempts to install kaitaistruct library using pip.
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                        var installResult = RunCommand(pythonExe, "-m pip    
install kaitaistruct --quiet");
Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs:                    var installResult = RunCommand(pipExe, "install
kaitaistruct --quiet");
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:        private static readonly string CompilerOutputDir =
Path.Combine(Path.GetTempPath(), "kaitai_utm_tests");
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:            // Test that kaitai-struct-compiler is available
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:            compilerPath.Should().NotBeNullOrEmpty("kaitai-struct-compiler   
should be available in PATH or common locations");
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                    process.ExitCode.Should().Be(0, "kaitai-struct-compiler  
should execute successfully");
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                $"kaitai-struct-compiler should compile UTM.ksy to
{language} successfully. " +
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:            // This requires Python runtime and kaitaistruct library
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:            // Check if kaitaistruct library is available
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                // Skip parser execution if kaitaistruct is not installed    
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                @"C:\Program Files
(x86)\kaitai-struct-compiler\bin\kaitai-struct-compiler.bat",
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.bat"),
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.bat"),
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe"
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                // Try to import kaitaistruct library
Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs:                var result = RunCommand(pythonPath, "-c \"import
kaitaistruct; print('OK')\"");
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:            "test_files", "kaitai_compiled", "lip"
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:            result = RunCommand("kaitai-struct-compiler.jar", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.bat"),
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:            var directCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:                return "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:            const string downloadUrl =
"https://github.com/kaitai-io/kaitai_struct_compiler/releases/download/" + version + "/kaitai-struct-compiler-" + version + ".zip"; 
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:                    installDir = Path.Combine(workspaceRoot, ".kaitai");     
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:                    installDir = Path.Combine(Path.GetTempPath(),
".kaitai");
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:                installDir = Path.Combine(userProfile, ".kaitai");
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:            var jarPath = Path.Combine(installDir,
"kaitai-struct-compiler.jar");
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:            var zipPath = Path.Combine(Path.GetTempPath(),
$"kaitai-struct-compiler-{version}.zip");
Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs:                var extractDir = Path.Combine(Path.GetTempPath(),
$"kaitai-struct-compiler-{version}-extract");
Tests\Andastra.Tests\Formats\UTSKaitaiCompilerTests.cs:            "test_files", "kaitai_compiled", "uts"
Tests\Andastra.Tests\Formats\UTSKaitaiCompilerTests.cs:            var kscCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\UTSKaitaiCompilerTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments} 
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\UTSKaitaiCompilerTests.cs:            result = RunCommand("kaitai-struct-compiler.jar", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\UTSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\UTSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTSKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTSKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTSKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTTKaitaiCompilerTests.cs:        private static readonly string CompilerOutputDir =
Path.Combine(Path.GetTempPath(), "kaitai_utt_tests");
Tests\Andastra.Tests\Formats\UTTKaitaiCompilerTests.cs:            // Test that kaitai-struct-compiler is available
Tests\Andastra.Tests\Formats\UTTKaitaiCompilerTests.cs:            compilerPath.Should().NotBeNullOrEmpty("kaitai-struct-compiler   
should be available in PATH or common locations");
Tests\Andastra.Tests\Formats\UTTKaitaiCompilerTests.cs:                    process.ExitCode.Should().Be(0, "kaitai-struct-compiler  
should execute successfully");
Tests\Andastra.Tests\Formats\UTTKaitaiCompilerTests.cs:                $"kaitai-struct-compiler should compile UTT.ksy to
{language} successfully. " +
Tests\Andastra.Tests\Formats\UTTKaitaiCompilerTests.cs:                "kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTTKaitaiCompilerTests.cs:                @"C:\Program Files
(x86)\kaitai-struct-compiler\bin\kaitai-struct-compiler.bat",
Tests\Andastra.Tests\Formats\UTTKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\UTTKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler", "bin",
"kaitai-struct-compiler.bat"),
Tests\Andastra.Tests\Formats\UTTKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.exe"),
Tests\Andastra.Tests\Formats\UTTKaitaiCompilerTests.cs:                "/usr/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTTKaitaiCompilerTests.cs:                "/usr/local/bin/kaitai-struct-compiler",
Tests\Andastra.Tests\Formats\UTTKaitaiCompilerTests.cs:                "C:\\Program
Files\\kaitai-struct-compiler\\kaitai-struct-compiler.exe"
Tests\Andastra.Tests\Formats\UTWKaitaiCompilerTests.cs:            "test_files", "kaitai_compiled", "utw"
Tests\Andastra.Tests\Formats\UTWKaitaiCompilerTests.cs:            var kscCheck = RunCommand("kaitai-struct-compiler", 
"--version");
Tests\Andastra.Tests\Formats\UTWKaitaiCompilerTests.cs:            var windowsPath = @"C:\Program Files
(x86)\kaitai-struct-compiler\bin\kaitai-struct-compiler.bat";
Tests\Andastra.Tests\Formats\UTWKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTWKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTWKaitaiCompilerTests.cs:                "kaitai-struct-compiler.jar"
Tests\Andastra.Tests\Formats\UTWKaitaiCompilerTests.cs:            var check = RunCommand("kaitai-struct-compiler", "--version");   
Tests\Andastra.Tests\Formats\UTWKaitaiCompilerTests.cs:                return "kaitai-struct-compiler";
Tests\Andastra.Tests\Formats\UTWKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTWKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\UTWKaitaiCompilerTests.cs:                "kaitai-struct-compiler.jar"
Tests\Andastra.Tests\Formats\VISKaitaiCompilerTests.cs:            "test_files", "kaitai_compiled", "vis"
Tests\Andastra.Tests\Formats\VISKaitaiCompilerTests.cs:            var kscCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\VISKaitaiCompilerTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\VISKaitaiCompilerTests.cs:            result = RunCommand("kaitai-struct-compiler.jar", $"{arguments}  
-d \"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\VISKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\VISKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\VISKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\VISKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\VISKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory, "..",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\VISKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\VISKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\VISKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\WAVKaitaiCompilerTests.cs:            "test_files", "kaitai_compiled", "wav"
Tests\Andastra.Tests\Formats\WAVKaitaiCompilerTests.cs:            var kscCheck = RunCommand("kaitai-struct-compiler",
"--version");
Tests\Andastra.Tests\Formats\WAVKaitaiCompilerTests.cs:            var result = RunCommand("kaitai-struct-compiler", $"{args} -d    
\"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\WAVKaitaiCompilerTests.cs:            result = RunCommand("kaitai-struct-compiler.jar", $"{args} -d    
\"{outputDir}\" \"{ksyPath}\"");
Tests\Andastra.Tests\Formats\WAVKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".local", "bin", "kaitai-struct-compiler"),
Tests\Andastra.Tests\Formats\WAVKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\WAVKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "kaitai-struct-compiler",
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\WAVKaitaiCompilerTests.cs:                
Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".kaitai", "kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\WAVKaitaiCompilerTests.cs:                Path.Combine(AppContext.BaseDirectory,
"kaitai-struct-compiler.jar"),
Tests\Andastra.Tests\Formats\WAVKaitaiCompilerTests.cs:                "kaitai-struct-compiler.jar"
```

Just the ones ending in .cs please.

## Assistant

_Time: 2025-12-25T19:01:59.392Z_

- Tests\Andastra.Tests\Formats\AREKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\BWMKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\CNVKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\DLGKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\ERFKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\GFFFormatTests.cs
- Tests\Andastra.Tests\Formats\GITKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\GITKaitaiStructTests.cs
- Tests\Andastra.Tests\Formats\GUIKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\GUIKaitaiStructTests.cs
- Tests\Andastra.Tests\Formats\IFOKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\JRLKaitaiStructTests.cs
- Tests\Andastra.Tests\Formats\LIPKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\LYTKaitaiStructTests.cs
- Tests\Andastra.Tests\Formats\LTRKaitaiStructTests.cs
- Tests\Andastra.Tests\Formats\MDLKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\MDXKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\NCSKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\NCSKaitaiStructTests.cs
- Tests\Andastra.Tests\Formats\NCSSKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\NFOKaitaiStructTests.cs
- Tests\Andastra.Tests\Formats\NSSKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\NSSKaitaiStructTests.cs
- Tests\Andastra.Tests\Formats\PCCKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\PTHKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\RIMKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\SSFKaitaiStructTests.cs
- Tests\Andastra.Tests\Formats\TLKKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\TPCKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\TwoDAKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\TwoDAKaitaiStructTests.cs
- Tests\Andastra.Tests\Formats\UTDKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\UTDKaitaiStructTests.cs
- Tests\Andastra.Tests\Formats\UTEKaitaiStructTests.cs
- Tests\Andastra.Tests\Formats\UTIKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\UTIKaitaiStructTests.cs
- Tests\Andastra.Tests\Formats\UTMKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\UTSKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\UTTKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\UTWKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\VISKaitaiCompilerTests.cs
- Tests\Andastra.Tests\Formats\WAVKaitaiCompilerTests.cs

## User

_Time: 2025-12-25T19:03:03.508Z_

write a powershell command that'll move all of those files to ./src/csharp/Tests/

## Assistant

_Time: 2025-12-25T19:03:08.732Z_

```powershell
Move-Item -Path 'Tests\Andastra.Tests\Formats\*.cs' -Destination '.\src\csharp\Tests\' -Force
```

## User

_Time: 2025-12-25T19:03:25.863Z_

`Move-Item -Path 'Tests\Andastra.Tests\Formats\*.cs' -Destination '.\src\csharp\Tests\' -Force` won't work, needs to only move files that have 'kaitai' in name

## Assistant

_Time: 2025-12-25T19:03:28.459Z_

```powershell
Get-ChildItem -Path 'Tests\Andastra.Tests\Formats\' -Filter '*Kaitai*.cs' | Move-Item -Destination '.\src\csharp\Tests\' -Force
```
