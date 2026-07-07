---
source_url: "https://www.perplexity.ai/search/f857ca66-30e1-492f-b37c-3d877174252d"
thread_uuid: "48516c71-f4ec-404e-a9a7-4e36bf1fabc2"
slug: "f857ca66-30e1-492f-b37c-3d877174252d"
title: "Full tutorial walkthrough for installing perl with vs code windows. Focus on getting setup with the most popular repositories, modules, and any other tweaks that'll save me time down the road."
extracted_at: "2026-06-29T16:09:03.979Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# Full tutorial walkthrough for installing perl with vs code windows. Focus on getting setup with the most popular repositories, modules, and any other tweaks that'll save me time down the road.

Source: [Perplexity thread](https://www.perplexity.ai/search/f857ca66-30e1-492f-b37c-3d877174252d)

## User

Full tutorial walkthrough for installing perl with vs code windows. Focus on getting setup with the most popular repositories, modules, and any other tweaks that'll save me time down the road.

## Assistant

To set up Perl with Visual Studio Code (VS Code) on Windows, follow these steps to ensure a smooth installation and configuration process. This guide will also cover popular repositories, modules, and tweaks to optimize your development environment.

## **Installation Steps**

1. **Install Perl**
   - **Strawberry Perl**: This is a popular choice for Windows users as it comes with a comprehensive set of libraries and tools. Download and install it from the Strawberry Perl website.
   - **ActiveState Perl**: Another option, but it may require additional configuration for some modules.

2. **Install Visual Studio Code**
   - Download and install VS Code from the official website.

3. **Install Perl Extensions in VS Code**
   - Open VS Code and go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
   - Search for "Perl" and install the **Perl Navigator** extension. This extension provides features like code navigation, autocompletion, syntax checking, and integration with Perl::Critic.[5][7]

4. **Configure Perl Language Server**
   - The Perl Navigator extension bundles its dependencies, making it easier to set up compared to Perl::LanguageServer, which can be complex to install on Windows.[6][7]

## **Popular Modules and Repositories**

- **CPAN and CPANM**: Use CPAN or cpanminus (cpanm) to manage Perl modules. CPANM is preferred for its simplicity.
- **Carton**: For managing Perl dependencies in a project-specific manner, consider using Carton.[3]
- **Popular Modules**:
  - **Path::Tiny**: For file operations.
  - **Mojolicious**: For web applications and web scraping tasks.
  - **DBI**: For database interaction.
  - **LWP::UserAgent**: For web requests.[8]

## **Tweaks for Efficiency**

- **Use WSL (Windows Subsystem for Linux)**: If you encounter issues with module installations on Windows, consider using WSL. This allows you to run a Linux environment on Windows and can simplify dependency management.[1][6]
- **Perlbrew**: Install your own version of Perl using Perlbrew to avoid conflicts with system Perl versions and manage multiple versions easily.[1]
- **Editor Configuration**: Customize your VS Code settings for better syntax highlighting, linting, and formatting using extensions like Perltidy and Perl::Critic.[2][5]

By following these steps and utilizing these tools, you'll have a robust setup for developing in Perl with VS Code on Windows.

### Sources

- [perl on WSL, Visual Studio code, Perl::LanguageServer - Reddit](https://www.reddit.com/r/perl/comments/13e67pj/perl_on_wsl_visual_studio_code_perllanguageserver/)
- [How to run/debug perl from Vs:code - Reddit](https://www.reddit.com/r/perl/comments/nmcnlk/how_to_rundebug_perl_from_vscode/)
- [How do I add perl modules to a local library without cpan? - Reddit](https://www.reddit.com/r/perl/comments/454ylj/how_do_i_add_perl_modules_to_a_local_library/)
- [Developing a modern web application in Perl - Reddit](https://www.reddit.com/r/perl/comments/xpgdh8/developing_a_modern_web_application_in_perl/)
- [Introducing the Perl Navigator: a Language Server for Perl - Reddit](https://www.reddit.com/r/perl/comments/suamcf/introducing_the_perl_navigator_a_language_server/)
- [Running Perl in VSCode : r/perl - Reddit](https://www.reddit.com/r/perl/comments/11ovdcx/running_perl_in_vscode/)
- [Help Installing Language Server on Windows : r/perl - Reddit](https://www.reddit.com/r/perl/comments/twyh4w/help_installing_language_server_on_windows/)
- [Recommended modules for general scripting : r/perl - Reddit](https://www.reddit.com/r/perl/comments/gi8s7e/recommended_modules_for_general_scripting/)
