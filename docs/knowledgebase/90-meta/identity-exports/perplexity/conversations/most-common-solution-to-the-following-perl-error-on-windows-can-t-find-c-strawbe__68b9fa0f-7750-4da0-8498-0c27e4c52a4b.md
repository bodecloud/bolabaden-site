---
source_url: "https://www.perplexity.ai/search/d36d5776-d4b1-4e0d-b4d4-b824401fbf8f"
thread_uuid: "68b9fa0f-7750-4da0-8498-0c27e4c52a4b"
slug: "d36d5776-d4b1-4e0d-b4d4-b824401fbf8f"
title: "Most common solution to the following perl error on windows:

\"Can't find C:\Strawberry\perl\bin\cpan.bat on PATH, '.' not in PATH.\"

Literally search that exactly"
extracted_at: "2026-06-29T16:09:01.531Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# Most common solution to the following perl error on windows:

"Can't find C:\Strawberry\perl\bin\cpan.bat on PATH, '.' not in PATH."

Literally search that exactly

Source: [Perplexity thread](https://www.perplexity.ai/search/d36d5776-d4b1-4e0d-b4d4-b824401fbf8f)

## User

Most common solution to the following perl error on windows:

"Can't find C:\Strawberry\perl\bin\cpan.bat on PATH, '.' not in PATH."

Literally search that exactly

## Assistant

The error message "Can't find C:\Strawberry\perl\bin\cpan.bat on PATH, '.' not in PATH" typically arises from issues with the system's PATH environment variable and the presence of multiple Perl installations. Here are the most common solutions to resolve this error on Windows:

1. **Check for Multiple Perl Installations**: 
   - This issue often occurs when there are multiple versions of Perl installed on the system. Use the command `where perl` to identify all the Perl installations on your machine. If there is another Perl installation (e.g., one that comes with Git), it might be interfering with Strawberry Perl.[1][2]

2. **Adjust the PATH Environment Variable**:
   - Ensure that the path to Strawberry Perl's `bin` directory (e.g., `C:\Strawberry\perl\bin`) is correctly included in your system's PATH environment variable. You can check and modify this by going to System Properties > Environment Variables.[3]
   - If you have added `.` to your PATH and it did not resolve the issue, try removing it as it is generally not recommended for security reasons.

3. **Reinstall Strawberry Perl**:
   - If adjusting the PATH does not resolve the issue, consider uninstalling other Perl distributions and reinstalling Strawberry Perl to ensure a clean setup.[2]

4. **Check for Interference from Other Software**:
   - Some antivirus or security software, like Malwarebytes, might interfere with Perl's operation. Temporarily disabling such software can help identify if it's causing the issue.[5]

By ensuring that only the correct version of Perl is in your PATH and verifying that no other software is interfering, you should be able to resolve this error effectively.

### Sources

- [Windows - Can't find file on PATH, '.' not in PATH - Stack Overflow](https://stackoverflow.com/questions/40580522/windows-cant-find-file-on-path-not-in-path)
  - I installed a package (Strawberry Perl) and added its bin directory (C:\Strawberry\perl\bin) to the environment variables. cpan is a package manager, its in there as cpan.bat. When I try to run it,
- [[Strawberry Perl] Can't locate CPAN/Author.pm in @INC - Reddit](https://www.reddit.com/r/perl/comments/n4cmag/strawberry_perl_cant_locate_cpanauthorpm_in_inc/)
- [Perl not found in PATH. Aborting. - Qt Forum](https://forum.qt.io/topic/75591/perl-not-found-in-path-aborting)
  - I am trying to build a static version of Qt 5.8. My Perl installation is located in C:\Perl64 and the path is also included in my PATH variable: C:\Perl64\bi...
- [compilation failures due to various dll files not loading - Perl](https://community.activestate.com/t/unusable-perl-5-36-build-compilation-failures-due-to-various-dll-files-not-loading/11441)
  - My Perl 5.36 build is unusable for various reasons. One of them being the failure to load various dll files (that do exist). Can’t load ‘C:/Perl-5.36/site/lib/auto/GD/GD.dll’ for module GD: load_file:The specified module could not be found at C:/Perl-5.36/lib/DynaLoader.pm line 206. causes compilation to fail for: Image/Resize.pm Can’t load ‘C:/Perl-5.36/site/lib/auto/Net/SSLeay/SSLeay.dll’ for module Net::SSLeay: load_file:The specified module could not be found at C:/Perl-5.36/lib/DynaLoad...
- [Strawberry Perl not working with System Path when running system()](https://github.com/StrawberryPerl/Perl-Dist-Strawberry/issues/41)
  - When I run any command in backticks or system() and the exe file is not in the same directory as the script it will fail with error code 65280 and generates 2 empty 0 byte files in the same folder....
